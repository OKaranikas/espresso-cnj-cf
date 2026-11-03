
CREATE TABLE cnj_Witz (
  ID NVARCHAR(36) NOT NULL,
  createdAt TIMESTAMP(7),
  createdBy NVARCHAR(255),
  modifiedAt TIMESTAMP(7),
  modifiedBy NVARCHAR(255),
  text NVARCHAR(5000) NOT NULL,
  apiId NVARCHAR(255),
  bewertung INTEGER CHECK (bewertung BETWEEN 0 AND 5),
  kategorie_code NVARCHAR(20),
  quelle_ID NVARCHAR(36),
  PRIMARY KEY(ID)
);

CREATE TABLE cnj_Kategorie (
  name NVARCHAR(255),
  descr NVARCHAR(1000),
  code NVARCHAR(20) NOT NULL,
  PRIMARY KEY(code)
);

CREATE TABLE cnj_Kategorie_texts (
  locale NVARCHAR(14) NOT NULL,
  name NVARCHAR(255),
  descr NVARCHAR(1000),
  code NVARCHAR(20) NOT NULL,
  PRIMARY KEY(locale, code)
);

CREATE TABLE cnj_Quelle (
  ID NVARCHAR(36) NOT NULL,
  createdAt TIMESTAMP(7),
  createdBy NVARCHAR(255),
  modifiedAt TIMESTAMP(7),
  modifiedBy NVARCHAR(255),
  name NVARCHAR(100) NOT NULL,
  url NVARCHAR(255),
  PRIMARY KEY(ID)
);

CREATE TABLE cnj_Witz_texts (
  locale NVARCHAR(14) NOT NULL,
  ID NVARCHAR(36) NOT NULL,
  text NVARCHAR(5000) NOT NULL,
  PRIMARY KEY(locale, ID)
);

CREATE TABLE cnj_Bewertungsstufe (
  name NVARCHAR(255),
  descr NVARCHAR(1000),
  code INTEGER NOT NULL,
  PRIMARY KEY(code)
);

CREATE TABLE cnj_Bewertungsstufe_texts (
  locale NVARCHAR(14) NOT NULL,
  name NVARCHAR(255),
  descr NVARCHAR(1000),
  code INTEGER NOT NULL,
  PRIMARY KEY(locale, code)
);

CREATE TABLE cnj_WitzStatistik (
  quelle_ID NVARCHAR(36) NOT NULL,
  anzahl BIGINT,
  durchschnitt DECIMAL(10, 2),
  PRIMARY KEY(quelle_ID)
);

CREATE VIEW WitzService_Witze AS SELECT
  Witz_0.ID,
  Witz_0.createdAt,
  Witz_0.createdBy,
  Witz_0.modifiedAt,
  Witz_0.modifiedBy,
  Witz_0.text,
  Witz_0.apiId,
  Witz_0.bewertung,
  Witz_0.kategorie_code,
  Witz_0.quelle_ID,
  quelle_1.name AS quelleName
FROM (cnj_Witz AS Witz_0 LEFT JOIN cnj_Quelle AS quelle_1 ON Witz_0.quelle_ID = quelle_1.ID);

CREATE VIEW WitzService_Kategorien AS SELECT
  Kategorie_0.name,
  Kategorie_0.descr,
  Kategorie_0.code
FROM cnj_Kategorie AS Kategorie_0;

CREATE VIEW WitzService_Kategorien_texts AS SELECT
  texts_0.locale,
  texts_0.name,
  texts_0.descr,
  texts_0.code
FROM cnj_Kategorie_texts AS texts_0;

CREATE VIEW WitzService_Quellen AS SELECT
  Quelle_0.ID,
  Quelle_0.createdAt,
  Quelle_0.createdBy,
  Quelle_0.modifiedAt,
  Quelle_0.modifiedBy,
  Quelle_0.name,
  Quelle_0.url
FROM cnj_Quelle AS Quelle_0;

CREATE VIEW WitzService_Witze_texts AS SELECT
  texts_0.locale,
  texts_0.ID,
  texts_0.text
FROM cnj_Witz_texts AS texts_0;

CREATE VIEW WitzService_Bewertungsstufen AS SELECT
  Bewertungsstufe_0.name,
  Bewertungsstufe_0.descr,
  Bewertungsstufe_0.code
FROM cnj_Bewertungsstufe AS Bewertungsstufe_0;

CREATE VIEW WitzService_Bewertungsstufen_texts AS SELECT
  texts_0.locale,
  texts_0.name,
  texts_0.descr,
  texts_0.code
FROM cnj_Bewertungsstufe_texts AS texts_0;

CREATE VIEW WitzService_Ersteller AS SELECT DISTINCT
  Witz_0.createdBy AS benutzer
FROM cnj_Witz AS Witz_0
WHERE Witz_0.createdBy IS NOT NULL;

CREATE VIEW WitzService_Statistik AS SELECT
  WitzStatistik_0.quelle_ID,
  WitzStatistik_0.anzahl,
  WitzStatistik_0.durchschnitt
FROM cnj_WitzStatistik AS WitzStatistik_0;

CREATE VIEW localized_cnj_Witz AS SELECT
  L_0.ID,
  L_0.createdAt,
  L_0.createdBy,
  L_0.modifiedAt,
  L_0.modifiedBy,
  coalesce(localized_1.text, L_0.text) AS text,
  L_0.apiId,
  L_0.bewertung,
  L_0.kategorie_code,
  L_0.quelle_ID
FROM (cnj_Witz AS L_0 LEFT JOIN cnj_Witz_texts AS localized_1 ON localized_1.ID = L_0.ID AND localized_1.locale = @locale);

CREATE VIEW localized_cnj_Kategorie AS SELECT
  coalesce(localized_1.name, L_0.name) AS name,
  coalesce(localized_1.descr, L_0.descr) AS descr,
  L_0.code
FROM (cnj_Kategorie AS L_0 LEFT JOIN cnj_Kategorie_texts AS localized_1 ON localized_1.code = L_0.code AND localized_1.locale = @locale);

CREATE VIEW localized_cnj_Bewertungsstufe AS SELECT
  coalesce(localized_1.name, L_0.name) AS name,
  coalesce(localized_1.descr, L_0.descr) AS descr,
  L_0.code
FROM (cnj_Bewertungsstufe AS L_0 LEFT JOIN cnj_Bewertungsstufe_texts AS localized_1 ON localized_1.code = L_0.code AND localized_1.locale = @locale);

CREATE VIEW localized_WitzService_Witze AS SELECT
  Witz_0.ID,
  Witz_0.createdAt,
  Witz_0.createdBy,
  Witz_0.modifiedAt,
  Witz_0.modifiedBy,
  Witz_0.text,
  Witz_0.apiId,
  Witz_0.bewertung,
  Witz_0.kategorie_code,
  Witz_0.quelle_ID,
  quelle_1.name AS quelleName
FROM (localized_cnj_Witz AS Witz_0 LEFT JOIN cnj_Quelle AS quelle_1 ON Witz_0.quelle_ID = quelle_1.ID);

CREATE VIEW localized_WitzService_Kategorien AS SELECT
  Kategorie_0.name,
  Kategorie_0.descr,
  Kategorie_0.code
FROM localized_cnj_Kategorie AS Kategorie_0;

CREATE VIEW localized_WitzService_Bewertungsstufen AS SELECT
  Bewertungsstufe_0.name,
  Bewertungsstufe_0.descr,
  Bewertungsstufe_0.code
FROM localized_cnj_Bewertungsstufe AS Bewertungsstufe_0;
