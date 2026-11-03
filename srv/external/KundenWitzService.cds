/* checksum : 125abfa23dadf1756a6ecb0aaf391c5b */
@cds.external : true
service KundenWitzService {
  @cds.external : true
  @cds.persistence.skip : true
  entity Witze {
    @Core.ComputedDefaultValue : true
    key ID : UUID not null;
    apiId : String(255);
    text : String(5000);
    bewertung : Integer;
    freigabe : Boolean;
  };
};

