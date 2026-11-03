package de.espresso.cnj;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integrationstest gegen den echten OData-V4-Adapter, aber ohne HANA: das
 * Profil "default" (application.yaml) schaltet cds.data-source.auto-config
 * ab, wodurch Spring Boot automatisch eine eingebettete H2-Datenbank
 * verwendet (siehe Testphilosophie in Kapitel 1.1 des Buchs - Integration
 * gegen ein simuliertes/lokales System statt eines echten HANA-Containers).
 * Spiegelt test/witz-service.test.js auf der Node-Seite.
 */
@SpringBootTest
@AutoConfigureMockMvc
class WitzServiceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static String basicAuth(String benutzer, String passwort) {
        String wert = benutzer + ":" + passwort;
        return "Basic " + Base64.getEncoder().encodeToString(wert.getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void weistNichtAngemeldeteAufrufeAb() throws Exception {
        mockMvc.perform(get("/odata/v4/witze/Witze"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void liefertDieWitzeFuerEinenLeser() throws Exception {
        mockMvc.perform(get("/odata/v4/witze/Witze")
                .header("Authorization", basicAuth("lea", "leserin")))
            .andExpect(status().isOk());
    }

    @Test
    void laesstEinenLeserNichtSchreiben() throws Exception {
        mockMvc.perform(post("/odata/v4/witze/Witze")
                .header("Authorization", basicAuth("lea", "leserin"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"Test\"}"))
            .andExpect(status().isForbidden());
    }

    @Test
    void erlaubtPflegeDasAnlegenEinesWitzes() throws Exception {
        mockMvc.perform(post("/odata/v4/witze/Witze")
                .header("Authorization", basicAuth("paul", "pflege"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"Chuck Norris kann durch Null teilen.\"}"))
            .andExpect(status().isCreated());
    }

    @Test
    void liefertDieQuellenAuchGesperrteZumLesen() throws Exception {
        mockMvc.perform(get("/odata/v4/witze/Quellen")
                .header("Authorization", basicAuth("lea", "leserin")))
            .andExpect(status().isOk());
    }
}
