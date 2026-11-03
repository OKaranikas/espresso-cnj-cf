import cds from '@sap/cds'

export async function leseWitzeEinerQuelle(quelleName) {
  const { Witze } = cds.entities('WitzService')

  return SELECT.from(Witze)
    .columns(w => { w.text, w.bewertung, w.quelle(q => q.name) })
    .where`quelle.name = ${quelleName}`
    .orderBy`bewertung desc`
}

export async function bewertungErhoehen(witzID) {
  const { Witze } = cds.entities('WitzService')

  // Bei 5 Sternen ist Schluss - mehr laesst die Datenbank nicht zu.
  await UPDATE(Witze, witzID).with({ bewertung: { '+=': 1 } }).where({ bewertung: { '<': 5 } })
}
