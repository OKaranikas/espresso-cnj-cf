sap.ui.define([
  'sap/m/Dialog',
  'sap/m/Button',
  'sap/m/Table',
  'sap/m/Column',
  'sap/m/ColumnListItem',
  'sap/m/Text',
  'sap/m/MessageBox',
  'sap/ui/model/json/JSONModel'
], function (Dialog, Button, Table, Column, ColumnListItem, Text, MessageBox, JSONModel) {
  'use strict';

  // Ruft den Statistikdienst auf Python (statistik/server.py) auf. Produktiv
  // leitet der Application Router /statistik/... samt Token an ihn weiter
  // (app/router/xs-app.json, Destination cnj-statistik-api); lokal liefert
  // srv/server.js unter demselben Pfad dieselben Daten.
  const STATISTIK_URL = '/statistik/statistik';

  async function quellNamen(model) {
    const kontexte = await model.bindList('/Quellen').requestContexts(0, 1000);
    return new Map(kontexte.map(k => [k.getProperty('ID'), k.getProperty('name')]));
  }

  return {
    anzeigen: async function () {
      const texte = this.getModel('i18n').getResourceBundle();
      let zeilen;
      try {
        const antwort = await fetch(STATISTIK_URL, { credentials: 'same-origin' });
        if (!antwort.ok) throw new Error(antwort.status + ' ' + antwort.statusText);
        const [daten, namen] = await Promise.all([antwort.json(), quellNamen(this.getModel())]);
        zeilen = daten.map(z => ({
          quelle: namen.get(z.quelle) ?? z.quelle,
          anzahl: z.anzahl,
          durchschnitt: Number(z.durchschnitt).toFixed(2)
        }));
      } catch (e) {
        MessageBox.error(texte.getText('StatistikFehler', [e.message]));
        return;
      }

      const tabelle = new Table({
        noDataText: texte.getText('StatistikLeer'),
        columns: [
          new Column({ header: new Text({ text: texte.getText('Quelle') }) }),
          new Column({ header: new Text({ text: texte.getText('StatistikAnzahl') }), hAlign: 'End' }),
          new Column({ header: new Text({ text: texte.getText('StatistikDurchschnitt') }), hAlign: 'End' })
        ]
      });
      tabelle.bindItems({
        path: '/',
        template: new ColumnListItem({
          cells: [new Text({ text: '{quelle}' }), new Text({ text: '{anzahl}' }), new Text({ text: '{durchschnitt}' })]
        })
      });

      const dialog = new Dialog({
        title: texte.getText('StatistikTitel'),
        contentWidth: '32rem',
        content: [tabelle],
        endButton: new Button({ text: texte.getText('Schliessen'), press: () => dialog.close() }),
        afterClose: () => dialog.destroy()
      });
      dialog.setModel(new JSONModel(zeilen));
      dialog.open();
    }
  };
});
