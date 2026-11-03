package de.espresso.cnj.integration;

import java.time.Duration;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationAccessor;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceConfiguration;
import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceConfiguration.CircuitBreakerConfiguration;
import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceConfiguration.RetryConfiguration;
import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceConfiguration.TimeLimiterConfiguration;
import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceDecorator;
import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceIsolationMode;

import de.espresso.cnj.client.namespaces.witz.Quellen;
import de.espresso.cnj.client.namespaces.witz.Witze;
import de.espresso.cnj.client.services.DefaultWitzService;

/**
 * Kapselt saemtliche Aufrufe des WitzService ueber das SAP Cloud SDK.
 * Der typisierte Client wird beim Build aus den Metadaten des Service erzeugt.
 */
@Component
public class QuellenClient {

    private static final Logger log = LoggerFactory.getLogger(QuellenClient.class);

    /** Typisierter Aufruf mit Selektion, Navigation, Filter und Begrenzung. */
    public List<Quellen> leseQuellen(HttpDestination destination) {
        return new DefaultWitzService()
            .withServicePath("/odata/v4/witze")
            .getAllQuellen()
            .select(
                Quellen.ID,
                Quellen.NAME,
                Quellen.TO_WITZE.select(Witze.TEXT))
            .filter(Quellen.NAME.equalTo("chucknorris.io"))
            .top(10)
            .execute(destination);
    }

    /** Abruf der Destination ueber den DestinationAccessor des Cloud SDK. */
    public List<Quellen> leseQuellen() {
        HttpDestination destination = DestinationAccessor
            .getDestination("WITZ_SERVICE")
            .asHttp();

        return new DefaultWitzService()
            .withServicePath("/odata/v4/witze")
            .getAllQuellen()
            .execute(destination);
    }

    /** Derselbe Aufruf mit Timeout, Wiederholungen, Circuit Breaker und Fallback. */
    public List<Quellen> leseQuellenResilient() {
        ResilienceConfiguration konfiguration = ResilienceConfiguration
            .of("witz-service-quellen")
            .isolationMode(ResilienceIsolationMode.TENANT_OPTIONAL)
            .timeLimiterConfiguration(
                TimeLimiterConfiguration.of(Duration.ofSeconds(5)))
            .retryConfiguration(
                RetryConfiguration.of(3, Duration.ofMillis(500)))
            .circuitBreakerConfiguration(
                CircuitBreakerConfiguration.of());

        return ResilienceDecorator.executeSupplier(
            () -> new DefaultWitzService()
                .withServicePath("/odata/v4/witze")
                .getAllQuellen()
                .execute(DestinationAccessor
                    .getDestination("WITZ_SERVICE").asHttp()),
            konfiguration,
            fehler -> {
                log.warn("Quellen konnten nicht gelesen werden", fehler);
                return Collections.emptyList();
            });
    }
}
