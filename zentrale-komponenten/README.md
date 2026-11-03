# Zentrale Komponenten

Bündelt zwei Dinge, die vorher über mehrere Projekte verstreut waren:
externe Bibliotheken, die mehr als ein Modul verwendet, und die Version, in
der sie verwendet werden sollen.

## UI5-Proxy (`ui5-proxy/`)

Vorher lud `app/witze/webapp/index.html` die SAPUI5-Laufzeit über eine fest
verdrahtete CDN-URL (`https://ui5.sap.com/1.152.0/...`). Bei mehreren
Fiori-Anwendungen im selben Subaccount müsste diese URL an jeder Stelle
gepflegt werden; in Landschaften ohne freien Internetzugang liesse sich die
Laufzeit so überhaupt nicht laden.

`ui5-proxy/server.js` ist stattdessen ein kleiner, abhängigkeitsfreier
Reverse Proxy für `/resources` und `/test-resources`. Er wird zweimal
eingebunden, mit demselben Code:

- **lokal**: `srv/server.js` bindet `erzeugeHandler()` als Middleware ein.
- **produktiv**: Das Modul `cnj-zentrale-komponenten` in `mta.yaml` läuft
  als eigene Cloud-Foundry-App; der Application Router leitet
  `/resources/*` und `/test-resources/*` dorthin weiter
  (`app/router/xs-app.json`).

`app/witze/webapp/index.html` bootstrapt UI5 daher nur noch relativ
(`/resources/sap-ui-core.js`) - unabhängig davon, ob lokal entwickelt oder
produktiv ausgeliefert wird.

Der tatsächliche Ziel-Server ist über die Umgebungsvariable
`UI5_UPSTREAM_URL` konfigurierbar; ohne Vorgabe wird die in
`versions.json` gepflegte Version vom öffentlichen SAP-CDN bezogen. In
einer Landschaft ohne Zugriff auf `ui5.sap.com` reicht es, diese eine
Umgebungsvariable auf einen internen Spiegel zu setzen - an keiner anderen
Stelle des Projekts muss dafür etwas geändert werden.

**Wichtig:** Der Proxy leitet nur weiter, er hostet die UI5-Bibliotheken
nicht selbst. Er liefert damit exakt das, was der konfigurierte Upstream
liefert - inklusive `sap.fe.templates` (Fiori Elements), das nur über
SAPUI5 verfügbar ist, nicht über das freie OpenUI5. Ein eigener
`npm`-Paket-Ersatz für die Laufzeit selbst wäre daher kein vollständiger
Ersatz für diese Anwendung.

Tests: `cd zentrale-komponenten/ui5-proxy && npm test` (Node-Test-Runner,
prüft die Weiterleitungslogik gegen einen lokalen Stub-Server - ohne
Internetzugriff nötig).

## Versionsabgleich (`versions.json`, `check-versions.js`)

`versions.json` ist die einzige Quelle für Versionen externer
Node-Bibliotheken, die mehr als ein Projekt verwendet (SAP Cloud SDK,
`@sap/cds`, `@sap/xssec`, `@sap/approuter`, `@ui5/cli`) sowie für die
UI5-Version aus dem Proxy oben.

`check-versions.js` vergleicht das gegen die einzelnen `package.json`-
Dateien (Wurzel, `cloud-sdk`, `app/router`, `app/witze`) und gegen
`app/witze/ui5.yaml`. Aufruf:

```bash
node zentrale-komponenten/check-versions.js
# oder je Projekt:
npm run check-versions
```

Ist Teil von `scripts/verify.sh` und schlägt mit Exit-Code 1 fehl, sobald
eine Version abweicht.

Für Java gilt dasselbe Prinzip bereits: `java/pom.xml` importiert die
BOMs `cds-services-bom`, `sdk-modules-bom` und `java-bom` genau einmal,
`java/srv/pom.xml` erbt die Versionen davon. Die `java`-Einträge in
`versions.json` sind nur zur Übersicht gespiegelt und werden nicht
automatisch geprüft - bei einer Änderung bitte `java/pom.xml` direkt
anpassen.
