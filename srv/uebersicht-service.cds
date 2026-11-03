using { cnj as db } from '../db/schema';

@requires: 'authenticated-user'
service WitzUebersichtService {
  entity Witze as projection on db.Witz {
    ID,
    kategorie.code || ': ' || text as ListenName : String
  };
}

@requires: 'authenticated-user'
service WitzBewertungService {
  entity Witze as projection on db.Witz {
    ID,
    text,
    bewertung
  };
}
