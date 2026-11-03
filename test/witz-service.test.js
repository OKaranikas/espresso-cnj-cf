import cds from '@sap/cds'

const { GET, POST, expect, axios } = cds.test(import.meta.dirname + '/..')
axios.defaults.validateStatus = () => true

const leser  = { auth: { username: 'lea',  password: 'leserin' } }
const pflege = { auth: { username: 'paul', password: 'pflege'  } }

describe('WitzService', () => {

  it('weist nicht angemeldete Aufrufe ab', async () => {
    const { status } = await GET('/odata/v4/witze/Witze')
    expect(status).to.equal(401)
  })

  it('liefert die Witze fuer einen Leser', async () => {
    const { status, data } = await GET('/odata/v4/witze/Witze', leser)
    expect(status).to.equal(200)
    expect(data.value.length).to.be.greaterThan(0)
  })

  it('berechnet das virtuelle Feld istTopWitz', async () => {
    const { data } = await GET('/odata/v4/witze/Witze?$orderby=bewertung desc', leser)
    expect(data.value[0].istTopWitz).to.equal(true)
  })

  it('verbirgt gesperrte Quellen nicht vor dem Lesen', async () => {
    const { status, data } = await GET('/odata/v4/witze/Quellen', leser)
    expect(status).to.equal(200)
    expect(data.value.map(q => q.name)).to.include('chucknorris.io')
  })

  it('laesst einen Leser nicht schreiben', async () => {
    const { status } = await POST('/odata/v4/witze/Witze', { text: 'Test' }, leser)
    expect(status).to.equal(403)
  })

  it('weist eine negative Bewertung beim Aktivieren des Entwurfs ab', async () => {
    const { status, data: entwurf } = await POST('/odata/v4/witze/Witze',
      { text: 'Chuck Norris counted to infinity. Twice.', bewertung: -1 }, pflege)
    expect(status).to.equal(201)

    const schluessel = `Witze(ID=${entwurf.ID},IsActiveEntity=false)`
    const { status: aktivierung, data } = await POST(
      `/odata/v4/witze/${schluessel}/WitzService.draftActivate`, {}, pflege)

    expect(aktivierung).to.equal(400)
    expect(JSON.stringify(data)).to.include('Bewertung')
  })

  it('liefert die Kategorien nur lesend', async () => {
    const { status, data } = await GET('/odata/v4/witze/Kategorien', leser)
    expect(status).to.equal(200)
    expect(data.value.map(k => k.code)).to.include.members(['dev', 'food'])

    const { status: schreibversuch } = await POST('/odata/v4/witze/Kategorien',
      { code: 'neu', name: 'Neu' }, pflege)
    // @readonly gilt auch fuer Pflege - es gibt keinen Rollen-Bypass dafuer.
    expect(schreibversuch).to.equal(405)
  })

  it('liefert die Statistik je Quelle (CAP-QL-Ersatz fuer die native HANA-Funktion)', async () => {
    // db/statistik.cds bildet die native Tabellenfunktion
    // CNJ_WITZSTATISTIK.hdbfunction ab, die es unter SQLite nicht gibt.
    // Ohne den in srv/witz-service.js ergaenzten Fallback wuerde dieser
    // Aufruf mit einem SQL-Fehler abbrechen ("no such table").
    const { status, data } = await GET('/odata/v4/witze/Statistik', leser)
    expect(status).to.equal(200)

    const chuckNorris = data.value.find(
      s => s.quelle_ID === '11111111-1111-1111-1111-111111111111')
    expect(chuckNorris.anzahl).to.equal(3)
    expect(chuckNorris.durchschnitt).to.equal(4) // (5 + 4 + 3) / 3
  })
})

describe('WitzService - bewertungAnpassen', () => {
  const erlaubteQuelle = '11111111-1111-1111-1111-111111111111'   // chucknorris.io
  const gesperrteQuelle = '33333333-3333-3333-3333-333333333333'  // name = 'Gesperrt'

  function anpassen(quelleId, prozent, nutzer) {
    return POST(
      `/odata/v4/witze/Quellen(${quelleId})/WitzService.bewertungAnpassen`,
      { prozent }, nutzer)
  }

  it('passt die Bewertungen einer erlaubten Quelle fuer Pflege an', async () => {
    const { data: vorher } = await GET(
      `/odata/v4/witze/Witze?$filter=quelle_ID eq ${erlaubteQuelle}&$select=ID,bewertung`, pflege)

    const { status } = await anpassen(erlaubteQuelle, 10, pflege)
    expect(status).to.equal(204)

    const { data: nachher } = await GET(
      `/odata/v4/witze/Witze?$filter=quelle_ID eq ${erlaubteQuelle}&$select=ID,bewertung`, pflege)

    for (const witz of vorher.value) {
      const aktualisiert = nachher.value.find(w => w.ID === witz.ID)
      expect(aktualisiert.bewertung).to.equal(Math.min(5, Math.round(witz.bewertung * 1.1)))
    }
  })

  it('weist den Aufruf fuer einen Leser ab (regression fuer den grant-Fehler)', async () => {
    // Vorher fehlte 'bewertungAnpassen' im grant-Array von Pflege, wodurch die
    // Action fuer NIEMANDEN aufrufbar war - auch nicht fuer Pflege. Dieser Test
    // deckt die Leser-Seite ab; der Test oben bestaetigt, dass Pflege die
    // Action tatsaechlich ausfuehren kann.
    const { status } = await anpassen(erlaubteQuelle, 10, leser)
    expect(status).to.equal(403)
  })

  it('weist einen Prozentsatz ausserhalb des erlaubten Bereichs ab', async () => {
    const { status, data } = await anpassen(erlaubteQuelle, 60, pflege)
    expect(status).to.equal(400)
    expect(JSON.stringify(data)).to.include('Prozentsatz')
  })

  it('blockiert die Anpassung einer gesperrten Quelle auch fuer Pflege', async () => {
    // where: 'name <> ''Gesperrt''' im @restrict greift auch fuer die Action,
    // weil sie jetzt (nach dem Fix) im selben grant-Eintrag wie READ/WRITE steht.
    const { status } = await anpassen(gesperrteQuelle, 10, pflege)
    expect(status).to.be.oneOf([403, 404])
  })
})

// Die Datenbank selbst laesst nur 0-5 Sterne zu (CHECK-Constraint in
// db/schema.cds) - auch fuer Zugriffe, die am WitzService vorbeigehen.
describe('Datenbank - Bewertung 0 bis 5', () => {
  const direkt = bewertung => INSERT.into('cnj.Witz').entries({ text: `Direkt ${bewertung}`, bewertung })

  it('lehnt Werte ausserhalb von 0-5 direkt in der Datenbank ab', async () => {
    for (const bewertung of [-1, 6, 42]) {
      let fehler
      try { await direkt(bewertung) } catch (e) { fehler = e }
      expect(fehler, `bewertung ${bewertung}`).to.exist
      expect(fehler.message).to.match(/CHECK constraint/i)
    }
  })

  it('akzeptiert 0 bis 5 Sterne und unbewertete Witze', async () => {
    for (const bewertung of [0, 1, 2, 3, 4, 5, null]) await direkt(bewertung)
  })

  it('begrenzt bewertungAnpassen auf 5 Sterne', async () => {
    const quelle = '11111111-1111-1111-1111-111111111111'
    const { status } = await POST(
      `/odata/v4/witze/Quellen(${quelle})/WitzService.bewertungAnpassen`, { prozent: 50 }, pflege)
    expect(status).to.equal(204)

    const { data } = await GET(
      `/odata/v4/witze/Witze?$filter=quelle_ID eq ${quelle}&$select=bewertung`, pflege)
    expect(Math.max(...data.value.map(w => w.bewertung))).to.equal(5)
  })

  it('erhoeht die Bewertung nicht ueber 5 Sterne', async () => {
    const { bewertungErhoehen } = await import('../srv/lib/witz-queries.js')
    const ID = 'aaaaaaaa-0000-0000-0000-000000000001'
    await UPDATE('cnj.Witz', ID).with({ bewertung: 4 })

    await bewertungErhoehen(ID)
    await bewertungErhoehen(ID)

    const { bewertung } = await SELECT.one.from('cnj.Witz', ID).columns('bewertung')
    expect(bewertung).to.equal(5)
  })
})

describe('WitzService - Filter "Eingetragen von"', () => {
  it('liefert jeden Ersteller genau einmal', async () => {
    const { status, data } = await GET('/odata/v4/witze/Ersteller?$orderby=benutzer', leser)
    expect(status).to.equal(200)
    // Weitere Ersteller koennen aus vorherigen Tests stammen (z.B. direkte
    // INSERTs als 'anonymous') - entscheidend ist: keiner doppelt.
    const benutzer = data.value.map(e => e.benutzer)
    expect(benutzer).to.include.members(['entwickler', 'paul'])
    expect(new Set(benutzer).size).to.equal(benutzer.length)
  })

  it('filtert die Witze nach dem Ersteller', async () => {
    const { data } = await GET(
      "/odata/v4/witze/Witze?$filter=createdBy eq 'entwickler' and IsActiveEntity eq true&$select=text,createdBy", leser)
    expect(data.value.map(w => w.text)).to.deep.equal(['Chuck Norris can eat soup with a fork.'])
  })
})

// Lokaler Ersatz fuer den Statistikdienst auf Python (srv/server.js): gleiche
// Antwortform wie statistik/server.py, damit die Schaltflaeche "Statistik"
// der Oberflaeche auch ohne Cloud funktioniert.
describe('Lokaler Statistikdienst /statistik/statistik', () => {
  it('liefert die Statistik je Quelle im Format des Python-Dienstes', async () => {
    const { status, data } = await GET('/statistik/statistik', leser)
    expect(status).to.equal(200)
    const chuckNorris = data.find(z => z.quelle === '11111111-1111-1111-1111-111111111111')
    expect(chuckNorris).to.have.all.keys('quelle', 'anzahl', 'durchschnitt')
    expect(chuckNorris.anzahl).to.be.greaterThan(0)
  })

  it('weist falsche Anmeldedaten ab', async () => {
    const { status } = await GET('/statistik/statistik', { auth: { username: 'lea', password: 'falsch' } })
    expect(status).to.equal(401)
  })
})
