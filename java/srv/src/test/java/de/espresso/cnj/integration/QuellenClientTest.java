package de.espresso.cnj.integration;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;

import com.github.tomakehurst.wiremock.junit5.WireMockExtension;
import com.sap.cloud.sdk.cloudplatform.connectivity.DefaultHttpDestination;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;

import de.espresso.cnj.client.namespaces.witz.Quellen;

/**
 * leseQuellen(HttpDestination) nimmt die Destination als Parameter entgegen
 * (siehe Kapitel 1.1 des Buchs: "Code muss Destinations als Parameter
 * annehmen, nicht selbst ermitteln") und ist dadurch direkt mit WireMock
 * testbar, ohne echten WitzService und ohne Destination-Service.
 */
class QuellenClientTest {

    @RegisterExtension
    static WireMockExtension wiremock = WireMockExtension.newInstance().build();

    private final QuellenClient client = new QuellenClient();

    private HttpDestination testDestination() {
        return DefaultHttpDestination.builder(wiremock.baseUrl()).build();
    }

    @Test
    void liefertDieQuellenDesWitzService() {
        wiremock.stubFor(get(urlPathEqualTo("/odata/v4/witze/Quellen"))
            .willReturn(aResponse()
                .withHeader("Content-Type", "application/json;odata.metadata=minimal")
                .withBody("""
                    {
                      "@odata.context": "$metadata#Quellen",
                      "value": [
                        { "ID": "11111111-1111-1111-1111-111111111111", "name": "chucknorris.io" }
                      ]
                    }
                    """)));

        List<Quellen> quellen = client.leseQuellen(testDestination());

        assertThat(quellen).hasSize(1);
        assertThat(quellen.get(0).getName()).isEqualTo("chucknorris.io");
    }

    @Test
    void gibtDenFehlerWeiterWennDerWitzServiceEinenServerfehlerLiefert() {
        wiremock.stubFor(get(urlPathEqualTo("/odata/v4/witze/Quellen"))
            .willReturn(aResponse().withStatus(503)));

        assertThatThrownBy(() -> client.leseQuellen(testDestination()))
            .isNotNull();
    }

    @Test
    void gibtDenFehlerWeiterWennDerWitzServiceNichtErreichbarIst() {
        wiremock.stubFor(get(urlPathEqualTo("/odata/v4/witze/Quellen"))
            .willReturn(aResponse().withFault(
                com.github.tomakehurst.wiremock.http.Fault.CONNECTION_RESET_BY_PEER)));

        assertThatThrownBy(() -> client.leseQuellen(testDestination()))
            .isNotNull();
    }
}
