using { cnj as db } from '../db/schema';
using from '../db/statistik';

@path: 'witze'
@requires: 'authenticated-user'
service WitzService {

  @restrict: [
    { grant: 'READ', to: 'Leser'  },
    { grant: '*',    to: 'Pflege' }
  ]
  entity Witze as projection on db.Witz {
    *,
    // Name der Quelle als eigenes, bearbeitbares Feld: Die Oberflaeche zeigt
    // statt der UUID nur den Namen. Ein unbekannter Name legt beim Sichern
    // eine neue Quelle an (srv/witz-service.js).
    quelle.name as quelleName,
    virtual istTopWitz : Boolean,
    // True fuer Benutzer ohne die Rolle Pflege. Die Oberflaeche blendet
    // anhand dieses Feldes die Bearbeitungsfunktionen aus, damit ein
    // reiner Leser nicht erst durch einen 403 erfaehrt, dass er nicht
    // schreiben darf. Gefuellt wird es in srv/witz-service.js.
    virtual nurLesen   : Boolean
  } actions {
    // Fuellt einen Entwurf mit einem zufaelligen Witz der Chuck-Norris-API.
    // Nur im Bearbeitungsmodus sinnvoll, daher nur auf Entwuerfen verfuegbar.
    @Core.OperationAvailable: { $edmJson: { $Not: { $Path: 'in/IsActiveEntity' } } }
    @Common.SideEffects: {
      TargetProperties: ['in/text', 'in/apiId', 'in/kategorie_code', 'in/quelle_ID', 'in/quelleName'],
      TargetEntities  : ['in/kategorie', 'in/quelle']
    }
    action vorschlagLaden(
      @title: '{i18n>KategorieOptional}'
      @Common.ValueListWithFixedValues
      @Common.ValueList: {
        CollectionPath: 'Kategorien',
        Parameters    : [
          { $Type: 'Common.ValueListParameterOut', LocalDataProperty: kategorie, ValueListProperty: 'code' },
          { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
        ]
      }
      kategorie : String(20)
    ) returns Witze;
  };

  // WRITE deckt bei @restrict nur CREATE/UPDATE/DELETE ab, keine custom
  // actions - bewertungAnpassen muss deshalb einzeln im grant stehen, sonst
  // ist die Action fuer niemanden aufrufbar (auch nicht fuer Pflege).
  @restrict: [
    { grant: 'READ', to: 'Leser'  },
    { grant: ['READ','WRITE','bewertungAnpassen'], to: 'Pflege',
      where: 'name <> ''Gesperrt''' }
  ]
  entity Quellen as projection on db.Quelle actions {
    action bewertungAnpassen(prozent : Decimal(5,2));
  };

  @readonly
  entity Kategorien as projection on db.Kategorie;

  @readonly
  entity Bewertungsstufen as projection on db.Bewertungsstufe;

  // Alle Benutzer, die bisher Witze eingetragen haben - Werteliste fuer den
  // Filter "Eingetragen von" in der Liste. Kein Umleitungsziel fuer cnj.Witz,
  // Assoziationen (z.B. Quellen.witze) zeigen weiter auf Witze.
  @readonly
  @cds.redirection.target: false
  entity Ersteller as select from db.Witz distinct {
    key createdBy as benutzer
  } where createdBy is not null;

  @readonly
  entity Statistik as projection on db.WitzStatistik;

  // Rechte des angemeldeten Benutzers fuer die Oberflaeche. Die Schaltflaeche
  // "Anlegen" der Liste haengt an keinem einzelnen Witz, deshalb kann sie
  // nicht wie Bearbeiten/Loeschen ein Feld von Witze abfragen - sie fragt
  // dieses Singleton (UI.CreateHidden in app/witze/annotations.cds).
  @odata.singleton
  @cds.persistence.skip
  @readonly
  entity Benutzerrechte {
    nurLesen : Boolean;
  }

  @requires: 'Pflege'
  action witzAbrufen() returns Witze;
}
