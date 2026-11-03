package de.espresso.cnj.handler;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.sap.cds.services.ServiceException;

import cds.gen.witzservice.Witze;

/**
 * Reine Unit-Tests ohne Spring-Kontext und ohne Datenbank: pruefeBewertung()
 * greift weder auf db noch auf jdbcTemplate zu, daher genuegt ein Handler mit
 * null-Abhaengigkeiten (siehe Testphilosophie in Kapitel 1.1 des Buchs -
 * die unterste, schnellste Stufe der Testpyramide).
 */
class WitzServiceHandlerTest {

    private final WitzServiceHandler handler = new WitzServiceHandler(null, null, null);

    @Test
    void weistEineNegativeBewertungAb() {
        Witze witz = Witze.create();
        witz.setBewertung(-1);

        assertThatThrownBy(() -> handler.pruefeBewertung(List.of(witz)))
            .isInstanceOf(ServiceException.class)
            .hasMessageContaining("Bewertung");
    }

    @Test
    void laesstEineNichtNegativeBewertungZu() {
        Witze witz = Witze.create();
        witz.setBewertung(0);

        assertThatCode(() -> handler.pruefeBewertung(List.of(witz)))
            .doesNotThrowAnyException();
    }

    @Test
    void laesstEineFehlendeBewertungZu() {
        Witze witz = Witze.create();

        assertThatCode(() -> handler.pruefeBewertung(List.of(witz)))
            .doesNotThrowAnyException();
    }

    @Test
    void prueftAlleWitzeEinerListe() {
        Witze inOrdnung = Witze.create();
        inOrdnung.setBewertung(3);
        Witze negativ = Witze.create();
        negativ.setBewertung(-2);

        assertThatThrownBy(() -> handler.pruefeBewertung(List.of(inOrdnung, negativ)))
            .isInstanceOf(ServiceException.class);
    }
}
