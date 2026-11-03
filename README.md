# Chuck Norris Jokes – Cloud-Foundry-Variante

Beispielanwendung zum Buch **»Entwicklung in der SAP BTP – Cloud Foundry«**
(Espresso Tutorials). Das Projekt ist die Cloud-Foundry-Migration der
XSA-Anwendung aus dem Vorgängerbuch
([espresso-cnj-hana-xsa](https://github.com/esunke/espresso-cnj-hana-xsa)) und
liefert die Quellen für sämtliche Listings aus Kapitel 4.

Die Anwendung sammelt Chuck-Norris-Witze über die öffentliche API
`api.chucknorris.io`, legt sie in SAP HANA Cloud ab, lässt sie bewerten und
wertet sie statistisch aus.

## Was aus der XSA-Fassung wurde

| XSA (Vorgängerbuch)                        | Cloud Foundry (dieses Projekt)                                  |
| ------------------------------------------ | --------------------------------------------------------------- |
| `db` mit `.hdbcds` (DB_JOKES, JOKESERVICE_JOKES) | `db/schema.cds` – CDS-Modell, aus dem CAP die HDI-Artefakte erzeugt |
| `node` – Express + `@sap/hdbext`, Routen von Hand | `srv` – CAP-Service, OData V4 generiert                           |
| `java` – OData-Provisioning-SDK, WAR, Tomcat | `java` – CAP Java 5 auf Spring Boot 4, ausführbares JAR             |
| `python` – Flask, Mittelwert über `DB_JOKES` | `statistik` – Flask, liest die SQLScript-Tabellenfunktion          |
| `ui` – Freestyle-SAPUI5 + Approuter in einem Modul | `app/witze` (SAP Fiori elements) + `app/router` (Approuter)      |
| `mta.yaml` Schema 2.1, `com.sap.xs.uaa-space` | `mta.yaml` Schema 3.3, XSUAA/Destination/Connectivity/HTML5-Repo   |
| Berechtigung über einen Scope `access`      | Rollen `Leser` und `Pflege`, im CDS-Modell deklariert              |

## Aufbau

```
db/            Domänenmodell (CDS), Testdaten, native HANA-Artefakte in db/src
srv/           CAP-Service auf Node.js (WitzService)
java/          derselbe Service auf CAP Java 5 (Spring Boot 4)
statistik/     Python-Microservice (Flask) für die Auswertung
cloud-sdk/     typisierte OData-Clients (SAP Cloud SDK for JavaScript) + Tests
app/witze/     SAP-Fiori-elements-Oberfläche
app/router/    Application Router mit eigener /getuserinfo-Erweiterung
zentrale-komponenten/
               gemeinsam genutzte externe Bibliotheken: UI5-Proxy und
               zentrale Versionsvorgabe, siehe zentrale-komponenten/README.md
_i18n/         Übersetzungen des Modells
test/          Tests des CAP-Service
mta.yaml       Multi-Target-Application-Deskriptor
prod.mtaext    Erweiterungsdeskriptor für die Produktivumgebung
```

## Lokal starten

```bash
npm install
npm run watch          # cds watch, SQLite im Speicher, Testbenutzer lea / paul
```

### Anmeldungen

Lokal (Mock-Authentifizierung, definiert im Abschnitt `cds.requires.auth` der
`package.json` und – wortgleich – unter `cds.security.mock.users` in
`java/srv/src/main/resources/application.yaml`):

| Benutzer     | Passwort  | Rollen           | wofür                                                        |
| ------------ | --------- | ---------------- | ------------------------------------------------------------ |
| `lea`        | `leserin` | `Leser`          | Witze und Quellen lesen                                        |
| `paul`       | `pflege`  | `Leser`, `Pflege`| zusätzlich schreiben, `witzAbrufen`, `bewertungAnpassen`       |
| `entwickler` | `geheim`  | `Leser`, `Pflege`| technischer Benutzer der Destination `WITZ_SERVICE`, siehe `cloud-sdk/destinations.json` und `cloud-sdk/credentials.json` |

In der Cloud gibt es keine Benutzerliste im Projekt. Dort vergibt XSUAA die
Rollen über die Rollensammlungen aus `xs-security.json`, die im Subaccount
einem Benutzer zugeordnet werden müssen:

| Rollensammlung | Rollenvorlage | Scopes                            |
| -------------- | ------------- | --------------------------------- |
| `CNJ_Leser`    | `Leser`       | `$XSAPPNAME.Leser`                |
| `CNJ_Pflege`   | `Pflege`      | `$XSAPPNAME.Leser`, `$XSAPPNAME.Pflege` |

Die Rollennamen `Leser` und `Pflege` sind dieselben, die im CDS-Modell in
`@restrict` stehen – CAP schneidet beim Prüfen das Präfix `$XSAPPNAME.` ab.

Die Oberfläche liegt danach unter
<http://localhost:4004/witze/webapp/index.html>. Der Browser fragt beim ersten
Aufruf nach Benutzername und Passwort: `srv/server.js` verlangt die
Anmeldung schon für die Seite selbst. Ohne diesen Handler kommt der erste 401
aus einem Hintergrundaufruf der Anwendung, und darauf zeigt kein Browser einen
Anmeldedialog – die Seite bliebe leer.

Die SAPUI5-Laufzeit wird nicht mehr fest auf eine CDN-URL verdrahtet:
`webapp/index.html` bootstrapt relativ über `/resources/sap-ui-core.js`,
was `srv/server.js` lokal (und der Application Router produktiv) an das
Modul `zentrale-komponenten/ui5-proxy` weiterreicht. Das leitet
standardmäßig an das SAP-CDN weiter, ist aber über die Umgebungsvariable
`UI5_UPSTREAM_URL` umschaltbar. Details: `zentrale-komponenten/README.md`.

Wer stattdessen mit dem UI5 Tooling arbeiten möchte, startet `npm start` in
`app/witze`; die Version dafür steht im Abschnitt `framework` der
`ui5.yaml` und muss zur Version in `zentrale-komponenten/versions.json`
passen (wird von `check-versions.js` geprüft).

Die 404-Meldungen zu `Component-preload.js` und `/sap/bc/lrep/flex/...` in der
Browserkonsole sind im Entwicklungsmodus normal: Ersteres entsteht erst beim
`ui5 build`, Letzteres ist der UI5-Flexibility-Dienst, den es lokal nicht gibt.

## Testen

Die Tests laufen vollständig gegen simulierte/lokale Systeme (SQLite statt
HANA, H2 statt HANA, WireMock/nock statt echter HTTP-Aufrufe, gemockte
Destinations) und benötigen keinen Zugriff auf ein echtes HANA, XSUAA,
Destination-/Connectivity-Service oder die echte Chuck-Norris-API. Das macht
sie in einer Pipeline (siehe `.github/workflows/pipeline.yml`) genauso lauffähig wie lokal.

```bash
npm run build                      # cds build --production
npm test                           # Node: CAP-Service, Application Router, Zentrale Komponenten
npm run check-versions             # Node-Abhaengigkeiten gegen zentrale-komponenten/versions.json
cd cloud-sdk && npm ci && npm run typecheck && npm test
cd java && mvn -B verify           # CAP Java: Unit-, Integrations- und WireMock-Tests
python3 -m venv statistik/.venv && . statistik/.venv/bin/activate \
  && pip install -r statistik/requirements-test.txt && (cd statistik && pytest)
mbt validate -p cf -e prod.mtaext  # MTA-Deskriptor prüfen
cd zentrale-komponenten/ui5-proxy && npm test  # Proxy-Logik gegen einen lokalen Stub
```

`bash scripts/verify.sh` führt alle diese Prüfungen (bis auf den
Cloud-SDK-Teil, falls `npm ci` dort noch nicht gelaufen ist, und den
Java-Teil, falls Maven Central nicht erreichbar ist) in einem Durchgang aus
und überspringt fehlende Voraussetzungen mit einer Meldung, statt sie als
Fehler zu zählen.

## Bauen und ausliefern

```bash
cf login -a https://api.cf.eu10.hana.ondemand.com
mbt build -p cf
cf deploy mta_archives/cnj-app_1.0.0.mtar -e prod.mtaext
cf mta cnj-app
```

Die Oberfläche wird nicht vom Application Router selbst ausgeliefert, sondern
aus dem HTML5 Application Repository. Dort heißt die Anwendung wie die
`sap.app.id` der `manifest.json` ohne Punkte, also `deespressocnjwitze`;
genau darauf zeigt der `welcomeFile`-Eintrag in `app/router/xs-app.json`.
Welche Anwendungen tatsächlich im Repository liegen, zeigt

```bash
cf html5-list -di cnj-html5-repo-host -u
```

Bleibt die Liste leer, ist das Archiv ohne UI gebaut worden – dann stimmt der
Name unter `artifacts` im Modul `cnj-ui-deployer` nicht mit dem `archiveName`
des `ui5-task-zipper` in `app/witze/ui5.yaml` überein.

Zusätzlich zu den bisherigen Modulen läuft `cnj-zentrale-komponenten` als
eigene, kleine App: Sie hostet die UI5-Laufzeit nicht selbst, sondern leitet
`/resources` und `/test-resources` an das SAP-CDN weiter (oder an einen
internen Spiegel, konfigurierbar über `UI5_UPSTREAM_URL`). Siehe
`zentrale-komponenten/README.md`.

## Destinations

Die Anwendung erwartet im Subaccount folgende Destinations:

| Name                | Zweck                                                        |
| ------------------- | ------------------------------------------------------------ |
| `CHUCK_NORRIS_API`  | `https://api.chucknorris.io`, Authentifizierung `NoAuthentication` |
| `WITZ_SERVICE`      | zeigt auf den eigenen `WitzService`, Benutzerweitergabe        |
| `KUNDEN_WITZE`      | mandantenspezifischer Witz-Katalog eines Kunden                |

Für die lokale Entwicklung genügt die Umgebungsvariable `destinations`,
siehe `cloud-sdk/destinations.json`.

## Versionen

Für Java stehen die Versionen von CAP Java (`cds.services.version`), SAP
Cloud SDK (`cloud-sdk.version`) und Spring Boot als Properties in
`java/pom.xml` (per BOM-Import zentral gepflegt) und sollten vor einem
Build auf den aktuellen Stand geprüft werden.

Für Node.js übernimmt das `zentrale-komponenten/versions.json`: die
einzige Quelle für Versionen externer Bibliotheken, die mehr als ein
Projekt verwendet (SAP Cloud SDK, `@sap/cds`, `@sap/xssec`,
`@sap/approuter`, `@ui5/cli`) sowie für die UI5-Laufzeitversion. `npm run
check-versions` (Wurzel und `cloud-sdk`) prüft die einzelnen
`package.json`-Dateien und `app/witze/ui5.yaml` dagegen.
