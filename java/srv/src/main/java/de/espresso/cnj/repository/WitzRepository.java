package de.espresso.cnj.repository;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import cds.gen.witzservice.Witze;
import cds.gen.witzservice.Witze_;

@Component
public class WitzRepository {

    private final PersistenceService db;

    public WitzRepository(PersistenceService db) {
        this.db = db;
    }

    /** Typisierte Abfrage ueber den Query Builder von CAP Java. */
    public List<Witze> witzeEinerQuelle(String quelleName) {
        CqnSelect abfrage = Select.from(Witze_.class)
            .columns(w -> w.text(), w -> w.bewertung())
            .where(w -> w.quelle().name().eq(quelleName))
            .orderBy(w -> w.bewertung().desc());

        return db.run(abfrage).listOf(Witze.class);
    }
}
