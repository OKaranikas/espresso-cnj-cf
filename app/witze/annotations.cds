using {WitzService} from '../../srv/witz-service';

annotate WitzService.Witze with @(UI: {
  // Alle Felder eines Witzes stehen im Kopf: In der Anzeige oben auf der
  // Seite, beim Anlegen/Bearbeiten im Abschnitt "Kopfzeile". Die Abschnitte
  // darunter wiederholen sie nicht, damit kein Feld doppelt erscheint.
  HeaderInfo           : {
    TypeName      : '{i18n>Witz}',
    TypeNamePlural: '{i18n>Witze}',
    Title         : {Value: text}
  },
  HeaderFacets         : [{
    $Type : 'UI.ReferenceFacet',
    ID    : 'Kopf',
    Label : '{i18n>FacetWitz}',
    Target: '@UI.FieldGroup#Kopf'
  }],
  FieldGroup #Kopf     : {Data: [
    {Value: kategorie_code},
    {Value: quelleName},
    {
      $Type : 'UI.DataFieldForAnnotation',
      Target: '@UI.DataPoint#rating',
      Label : '{i18n>Bewertung}'
    }
  ]},
  // Kopfaktion: im Bearbeitungsmodus aktiv (OperationAvailable an der Action).
  Identification       : [{
    $Type : 'UI.DataFieldForAction',
    Action: 'WitzService.vorschlagLaden',
    Label : '{i18n>VorschlagLaden}',
    ![@UI.Hidden]: nurLesen
  }],
  SelectionFields      : [
    text,
    bewertung,
    kategorie_code,
    createdBy
  ],
  LineItem             : [
    {Value: text},
    // Die Fremdschluessel selbst als Spalten - sie zeigen per @Common.Text
    // den Namen an. Spalten auf kategorie.name/quelle.name erschienen in den
    // Tabelleneinstellungen sonst doppelt neben den gleichnamigen Feldern.
    {Value: kategorie_code},
    {Value: quelleName},
    {
      $Type : 'UI.DataFieldForAnnotation',
      Target: '@UI.DataPoint#rating',
      Label : '{i18n>Bewertung}'
    }
  ],
  DataPoint #rating    : {
    Value        : bewertung,
    Visualization: #Rating,
    Title        : '{i18n>Bewertung}',
    TargetValue  : 5
  },
  Facets               : [{
    $Type : 'UI.ReferenceFacet',
    ID    : 'Verlauf',
    Label : '{i18n>FacetVerlauf}',
    Target: '@UI.FieldGroup#Verlauf'
  }],
  FieldGroup #Verlauf  : {Data: [
    {Value: createdBy},
    {Value: createdAt},
    {Value: modifiedBy},
    {Value: modifiedAt}
  ]},
  // Benutzer ohne die Rolle Pflege sollen "Bearbeiten" und "Loeschen"
  // gar nicht erst angeboten bekommen. Ohne diese Annotationen zeigt
  // Fiori elements die Schaltflaechen jedem an, und der Service
  // antwortet erst beim Klick mit 403 Forbidden.
  UpdateHidden         : nurLesen,
  DeleteHidden         : nurLesen
});

annotate WitzService.Witze with {
  nurLesen   @UI.Hidden;
  istTopWitz @UI.Hidden;
}

annotate WitzService.Witze with {
  text       @title: '{i18n>Text}'       @UI.MultiLineText
             @Common.QuickInfo: '{i18n>TextInfo}';
  // Werthilfe mit den Sternestufen - bewusst ohne ValueListWithFixedValues:
  // Damit bietet der Filter der Liste einen Dialog mit "Aus Liste auswaehlen"
  // und "Bedingungen definieren" (z.B. >= 3 oder zwischen 2 und 4 Sternen)
  // statt einer reinen Auswahlliste.
  bewertung  @title: '{i18n>Bewertung}'
             @Common.QuickInfo: '{i18n>BewertungInfo}'
             @Common.ValueList: {
               Label         : '{i18n>Bewertungsstufen}',
               CollectionPath: 'Bewertungsstufen',
               Parameters    : [
                 {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: bewertung, ValueListProperty: 'code'},
                 {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name'},
                 {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'descr'}
               ]
             };
  kategorie  @title: '{i18n>Kategorie}'  @Common.Text: kategorie.name
             @Common.TextArrangement: #TextOnly
             @Common.QuickInfo: '{i18n>KategorieInfo}'
             @Common.ValueListWithFixedValues;
  // Die UUID der Quelle bleibt verborgen - angezeigt und bearbeitet wird
  // quelleName. Die Werthilfe schlaegt die bekannten Quellen vor; ein neuer
  // Name ist erlaubt (keine ValueListForValidation) und wird beim Sichern
  // als Quelle angelegt.
  quelle     @UI.Hidden;
  quelleName @title: '{i18n>Quelle}'
             @Common.QuickInfo: '{i18n>QuelleInfo}'
             @Core.Computed: false
             @Common.ValueList: {
               Label         : '{i18n>Quellen}',
               CollectionPath: 'Quellen',
               Parameters    : [
                 {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: quelleName, ValueListProperty: 'name'},
                 {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'url'}
               ]
             };
  // Nur intern: verhindert doppelt gespeicherte API-Witze.
  apiId      @UI.Hidden @readonly;
  // @sap/cds/common blendet createdBy als Filter aus (@UI.HiddenFilter) -
  // hier ausdruecklich wieder einschalten, als Auswahlliste der Ersteller.
  createdBy  @title: '{i18n>EingetragenVon}'
             @Common.QuickInfo: '{i18n>EingetragenVonInfo}'
             @UI.HiddenFilter: false
             @Common.ValueListWithFixedValues
             @Common.ValueList: {
               CollectionPath: 'Ersteller',
               Parameters    : [
                 {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: createdBy, ValueListProperty: 'benutzer'}
               ]
             };
}

annotate WitzService.Ersteller with {
  benutzer @title: '{i18n>EingetragenVon}';
}

// Fiori elements zeigt bei Entwuerfen automatisch den Filter
// "Bearbeitungszustand" an. Er entfaellt, wenn die Navigation zu
// DraftAdministrativeData als nicht filterbar gekennzeichnet ist.
annotate WitzService.Witze with @Capabilities.NavigationRestrictions: {
  RestrictedProperties: [{
    NavigationProperty: DraftAdministrativeData,
    FilterRestrictions: {Filterable: false}
  }]
};

annotate WitzService.Bewertungsstufen with {
  code  @title: '{i18n>Sterne}';
  name  @title: '{i18n>Bewertung}';
  descr @title: '{i18n>Beschreibung}';
}

// Aendert der Benutzer Text oder Kategorie, setzt der Server apiId zurueck
// und stellt die Quelle auf "Redaktion" um - die Oberflaeche muss die Felder
// danach neu lesen.
annotate WitzService.Witze with @Common.SideEffects #Bearbeitet: {
  SourceProperties: [text, kategorie_code, quelleName],
  TargetProperties: [apiId, quelle_ID, quelleName]
};

// "Anlegen" in der Liste nur fuer Benutzer mit der Rolle Pflege. Die
// Schaltflaeche gehoert zu keinem einzelnen Witz, deshalb fragt sie das
// Singleton Benutzerrechte statt des Feldes nurLesen.
annotate WitzService.Witze with @UI.CreateHidden: {$edmJson: {$Path: '/WitzService.EntityContainer/Benutzerrechte/nurLesen'}};

annotate WitzService.Benutzerrechte with {
  nurLesen @UI.Hidden;
}

annotate WitzService.Quellen with {
  name @title: '{i18n>Quelle}';
  url  @title: '{i18n>QuelleUrl}';
}

annotate WitzService.Witze with @odata.draft.enabled;
