namespace cnj;

@cds.persistence.exists
@cds.persistence.udf
entity WitzStatistik {
  key quelle_ID    : UUID;
      anzahl       : Integer64;
      durchschnitt : Decimal(10,2);
}
