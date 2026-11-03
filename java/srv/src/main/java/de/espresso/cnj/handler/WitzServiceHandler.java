package de.espresso.cnj.handler;

import static com.sap.cds.ql.CQL.get;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import cds.gen.witzservice.Quellen;
import cds.gen.witzservice.QuellenBewertungAnpassenContext;
import cds.gen.witzservice.Quellen_;
import cds.gen.witzservice.WitzService_;
import cds.gen.witzservice.Witze;
import cds.gen.witzservice.Witze_;

@Component
@ServiceName(WitzService_.CDS_NAME)
public class WitzServiceHandler implements EventHandler {

    private static final BigDecimal PROZENT_MIN = BigDecimal.valueOf(-50);
    private static final BigDecimal PROZENT_MAX = BigDecimal.valueOf(50);

    private final PersistenceService db;
    private final JdbcTemplate jdbcTemplate;
    private final Environment env;

    public WitzServiceHandler(PersistenceService db,
                              JdbcTemplate jdbcTemplate,
                              Environment env) {
        this.db = db;
        this.jdbcTemplate = jdbcTemplate;
        this.env = env;
    }

    @Before(event = { CqnService.EVENT_CREATE, CqnService.EVENT_UPDATE },
            entity = Witze_.CDS_NAME)
    public void pruefeBewertung(List<Witze> witze) {
        for (Witze witz : witze) {
            if (witz.getBewertung() != null && witz.getBewertung() < 0) {
                throw new ServiceException(ErrorStatuses.BAD_REQUEST,
                    "Die Bewertung darf nicht negativ sein.");
            }
        }
    }

    @On(entity = Quellen_.CDS_NAME)
    public void bewertungAnpassen(QuellenBewertungAnpassenContext context) {
        BigDecimal prozent = context.getProzent();

        // Die HANA-Prozedur (db/src/BEWERTUNG_ANPASSEN.hdbprocedure) prueft
        // denselben Bereich und lehnt mit SIGNAL ab. Diese Pruefung hier
        // greift zusaetzlich fuer den H2-Zweig unten, wo es die Prozedur
        // nicht gibt (analog zur Node-Seite, srv/witz-service.js).
        if (prozent.compareTo(PROZENT_MIN) < 0 || prozent.compareTo(PROZENT_MAX) > 0) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST,
                "Prozentsatz ausserhalb des erlaubten Bereichs.");
        }

        Quellen quelle = db.run(context.getCqn()).single(Quellen.class);

        if (env.matchesProfiles("cloud")) {
            // Nur in der Cloud-Foundry-Umgebung (mta.yaml setzt
            // SPRING_PROFILES_ACTIVE=cloud) laeuft echtes HANA Cloud mit der
            // nativen Prozedur.
            jdbcTemplate.update("CALL BEWERTUNG_ANPASSEN(?, ?)", quelle.getId(), prozent);
        } else {
            // Lokal und in der CI (Profil "default", siehe application.yaml)
            // laeuft H2 statt HANA Cloud - dort gibt es BEWERTUNG_ANPASSEN
            // nicht. Dieselbe Logik hier in CAP-QL nachgebildet, damit die
            // Action auch ohne HDI-Container testbar ist.
            List<Witze> witze = db.run(Select.from(Witze_.CDS_NAME)
                    .where(get("quelle_ID").eq(quelle.getId())))
                .listOf(Witze.class);

            for (Witze witz : witze) {
                Integer bewertung = witz.getBewertung();
                if (bewertung == null) {
                    continue;
                }
                int neueBewertung = (int) Math.round(
                    bewertung * (1 + prozent.doubleValue() / 100));
                db.run(Update.entity(Witze_.CDS_NAME)
                    .data("bewertung", neueBewertung)
                    .where(get("ID").eq(witz.getId())));
            }
        }

        context.setCompleted();
    }
}
