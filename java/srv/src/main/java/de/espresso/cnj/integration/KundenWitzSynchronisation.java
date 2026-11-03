package de.espresso.cnj.integration;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationAccessor;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import com.sap.cloud.sdk.cloudplatform.tenant.DefaultTenant;
import com.sap.cloud.sdk.cloudplatform.tenant.Tenant;
import com.sap.cloud.sdk.cloudplatform.tenant.TenantAccessor;

import de.espresso.cnj.kundenclient.namespaces.kundenwitz.Witze;
import de.espresso.cnj.kundenclient.services.DefaultKundenWitzService;

/**
 * Hintergrundverarbeitung ohne eingehenden Request: Der Mandant wird
 * explizit gesetzt, damit die Destination im richtigen Subaccount
 * gesucht wird.
 */
@Component
public class KundenWitzSynchronisation {

    public int synchronisiere(String tenantId, String subdomain) {
        Tenant kunde = new DefaultTenant(tenantId, subdomain);

        return TenantAccessor.executeWithTenant(kunde, () -> {
            HttpDestination destination = DestinationAccessor
                .getDestination("KUNDEN_WITZE")
                .asHttp();
            return synchronisiereStammdaten(destination);
        });
    }

    private int synchronisiereStammdaten(HttpDestination destination) {
        List<Witze> witze = new DefaultKundenWitzService()
            .withServicePath("/odata/v4/kundenwitze")
            .getAllWitze()
            .execute(destination);

        return witze.size();
    }
}