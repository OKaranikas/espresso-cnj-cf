namespace cnj;

using { cuid, managed, sap.common.CodeList } from '@sap/cds/common';

entity Quelle : cuid, managed {
  name   : String(100) not null;
  url    : String(255);
  witze  : Association to many Witz on witze.quelle = $self;
}

@cds.persistence.journal
entity Witz : cuid, managed {
  @title: '{i18n>Text}'
  text      : localized String(5000) not null;
  apiId     : String(255);
  // 0-5 Sterne, von der Datenbank selbst erzwungen (SQLite wie HANA) - auch
  // fuer Schreibzugriffe, die am WitzService vorbeigehen.
  bewertung : Integer @sql.append: 'CHECK (bewertung BETWEEN 0 AND 5)';
  kategorie : Association to Kategorie;
  quelle    : Association to Quelle;
}

entity Kategorie : CodeList {
  key code : String(20);
}

// Sternestufen 0-5 fuer die Bewertung. Dient der Oberflaeche als feste
// Werteliste, damit sich die Witze im Filter nach Sternen auswaehlen lassen.
entity Bewertungsstufe : CodeList {
  key code : Integer;
}
