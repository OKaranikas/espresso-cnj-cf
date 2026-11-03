// Nur fuer das lokale H2-Testschema (siehe cds.build in srv/pom.xml).
// cnj.WitzStatistik ist auf HANA eine Tabellenfunktion (@cds.persistence.udf),
// die es in H2 nicht gibt. Hier wird sie als leere Tabelle angelegt, damit
// die View WitzService.Statistik erzeugt werden kann.
using from '../db';

annotate cnj.WitzStatistik with @(
  cds.persistence.exists: false,
  cds.persistence.udf   : false
);
