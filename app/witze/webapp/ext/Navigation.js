sap.ui.define([], function () {
  'use strict';

  // Ohne Fiori Launchpad fehlt der Objektseite jede Zurueck-Navigation -
  // die Anwendung laeuft hier eigenstaendig ueber index.html. Die Schaltflaeche
  // "Zur Übersicht" im Kopf eines Witzes (siehe manifest.json) fuehrt zurueck
  // zur Liste. Fiori elements ruft den Handler mit der ExtensionAPI als this.
  return {
    zurUebersicht: function () {
      this.routing.navigateToRoute('WitzeList');
    }
  };
});
