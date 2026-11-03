import cds from '@sap/cds'
import nock from 'nock'
import { setTestDestination, unmockTestDestination } from '@sap-cloud-sdk/test-util'

const { GET, POST, PATCH, expect, axios } = cds.test(import.meta.dirname + '/..')
axios.defaults.validateStatus = () => true

const pflege = { auth: { username: 'paul', password: 'pflege' } }
const leser  = { auth: { username: 'lea',  password: 'leserin' } }

// witzAbrufen (srv/witz-service.js) ruft ueber srv/lib/chuck-norris-api.js die
// Destination CHUCK_NORRIS_API auf. Fuer Tests wird sie per
// setTestDestination() lokal auf einen frei erfundenen Host umgebogen, den
// nock abfaengt - es findet nie ein echter Netzwerkzugriff statt (siehe
// Testphilosophie in Kapitel 1.1 des Buchs: Unit-Tests ohne reale Systeme).
describe('WitzService - witzAbrufen', () => {
  beforeAll(() => {
    setTestDestination({ name: 'CHUCK_NORRIS_API', url: 'https://chuck-norris-api.test' })
  })

  afterAll(() => {
    unmockTestDestination('CHUCK_NORRIS_API')
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('weist den Aufruf fuer einen Leser ab, ohne die API zu rufen', async () => {
    // @requires: 'Pflege' auf der Action - hierfuer darf gar keine HTTP-
    // Anfrage stattfinden. Ein nicht abgefangener nock-Interceptor am Ende
    // des Tests wuerde das aufdecken (siehe afterEach/nock.cleanAll).
    const abfangen = nock('https://chuck-norris-api.test').get(/\/jokes\/random/).reply(200, {
      id: 'sollte-nicht-abgerufen-werden', value: 'x'
    })

    const { status } = await POST('/odata/v4/witze/witzAbrufen', {}, leser)

    expect(status).to.equal(403)
    expect(abfangen.isDone()).to.equal(false)
  })

  it('speichert einen neuen Witz von der Chuck-Norris-API', async () => {
    nock('https://chuck-norris-api.test')
      .get('/jokes/random')
      .reply(200, { id: 'neuer-witz-1', value: 'Chuck Norris kompiliert Warnungen zu Fehlern.' })

    const { status, data } = await POST('/odata/v4/witze/witzAbrufen', {}, pflege)

    // Aktionen antworten in CAP mit 200, auch wenn sie - wie hier - intern
    // einen neuen Datensatz anlegen; 201 ist POST auf ein Entity-Set
    // vorbehalten. Die Antwort auf die Action selbst enthaelt nur den
    // Schluessel, daher zur Pruefung ein Nachlesen des angelegten Witzes.
    expect(status).to.equal(200)

    const { data: witz } = await GET(`/odata/v4/witze/Witze(${data.ID})`, pflege)
    expect(witz.apiId).to.equal('neuer-witz-1')
    expect(witz.bewertung).to.equal(0)
  })

  it('lehnt einen bereits bekannten Witz ab (409)', async () => {
    // apiId 's0mek3y1' steckt schon in db/data/cnj-Witz.csv.
    nock('https://chuck-norris-api.test')
      .get('/jokes/random')
      .reply(200, { id: 's0mek3y1', value: 'Chuck Norris can divide by zero.' })

    const { status, data } = await POST('/odata/v4/witze/witzAbrufen', {}, pflege)

    expect(status).to.equal(409)
    expect(JSON.stringify(data)).to.include('schon gespeichert')
  })

  it('gibt einen Fehler weiter, wenn die Chuck-Norris-API einen Serverfehler liefert', async () => {
    nock('https://chuck-norris-api.test')
      .get('/jokes/random')
      .times(4) // 1 Versuch + bis zu 3 Wiederholungen der resilience-Middleware
      .reply(503)

    const { status } = await POST('/odata/v4/witze/witzAbrufen', {}, pflege)

    expect(status).to.be.oneOf([500, 502, 503])
  })

  it('gibt einen Fehler weiter, wenn die Chuck-Norris-API nicht erreichbar ist', async () => {
    nock('https://chuck-norris-api.test')
      .get('/jokes/random')
      .times(4)
      .replyWithError({ code: 'ECONNREFUSED' })

    const { status } = await POST('/odata/v4/witze/witzAbrufen', {}, pflege)

    expect(status).to.be.oneOf([500, 502, 503])
  })

  describe('Vorschlag beim Anlegen', () => {
    const anlegen = (daten = {}) => POST('/odata/v4/witze/Witze', daten, pflege)
    // Ohne gewaehlte Kategorie fragt der Vorschlag nur unsere Kategorien an.
    const zufall = { category: 'dev,food,movie,science' }
    const entwurf = ID => `/odata/v4/witze/Witze(ID=${ID},IsActiveEntity=false)`

    it('belegt einen neuen Entwurf mit einem Witz der API vor', async () => {
      nock('https://chuck-norris-api.test')
        .get('/jokes/random').query(zufall)
        .reply(200, { id: 'vorschlag-1', value: 'Chuck Norris schreibt Tests nach dem Deployment.', categories: ['science'] })

      const { status, data, headers } = await anlegen()

      expect(status).to.equal(201)
      expect(data.text).to.equal('Chuck Norris schreibt Tests nach dem Deployment.')
      expect(data.apiId).to.equal('vorschlag-1')
      expect(data.kategorie_code).to.equal('science')
      expect(data.quelle_ID).to.equal('11111111-1111-1111-1111-111111111111')
      // Den Hinweis zeigt erst die Objektseite - in der Liste kaeme er zu frueh.
      expect(headers['sap-messages']).to.equal(undefined)
    })

    it('liefert die virtuellen Felder auch fuer Entwuerfe', async () => {
      // Die Oberflaeche liest nurLesen im Bearbeitungsmodus fuer die
      // Schaltflaeche "Witz von der API laden" - fehlt es, meldet UI5
      // "Failed to drill-down into nurLesen".
      const { data: neu } = await anlegen({ text: 'Entwurf.' })
      const { data } = await GET(`${entwurf(neu.ID)}?$select=ID,nurLesen,istTopWitz`, pflege)
      expect(data.nurLesen).to.equal(false)
      expect(data).to.have.property('istTopWitz')
    })

    it('ruft die API nicht, wenn bereits ein Text mitkommt', async () => {
      const abfangen = nock('https://chuck-norris-api.test').get(/\/jokes\/random/).reply(200, { id: 'x', value: 'x' })

      const { status, data } = await anlegen({ text: 'Selbst geschrieben.' })

      expect(status).to.equal(201)
      expect(data.text).to.equal('Selbst geschrieben.')
      expect(abfangen.isDone()).to.equal(false)
    })

    it('legt den Entwurf trotzdem an, wenn die API nicht erreichbar ist', async () => {
      nock('https://chuck-norris-api.test')
        .get('/jokes/random').query(zufall)
        .times(2) // 1 Versuch + 1 Wiederholung beim Vorschlag
        .replyWithError({ code: 'ECONNREFUSED' })

      const { status, data, headers } = await anlegen()

      expect(status).to.equal(201)
      expect(data.text).to.equal(null)
      expect(data.apiId).to.equal(null)
      expect(data.quelle_ID).to.equal('22222222-2222-2222-2222-222222222222') // Redaktion
      expect(headers['sap-messages']).to.equal(undefined)
    })

    it('ueberspringt bereits gespeicherte Witze', async () => {
      nock('https://chuck-norris-api.test')
        .get('/jokes/random').query(zufall).reply(200, { id: 's0mek3y1', value: 'Chuck Norris can divide by zero.' })
        .get('/jokes/random').query(zufall).reply(200, { id: 'vorschlag-2', value: 'Chuck Norris braucht kein Undo.' })

      const { data } = await anlegen()

      expect(data.apiId).to.equal('vorschlag-2')
    })

    it('laedt im Entwurf einen neuen Vorschlag der gewaehlten Kategorie', async () => {
      nock('https://chuck-norris-api.test')
        .get('/jokes/random').query(zufall).reply(200, { id: 'vorschlag-3', value: 'Erster Vorschlag.', categories: [] })
        .get('/jokes/random?category=food').reply(200, { id: 'vorschlag-4', value: 'Chuck Norris isst Suppe mit der Gabel.', categories: ['food'] })

      const { data: neu } = await anlegen()
      const { status, data } = await POST(`${entwurf(neu.ID)}/WitzService.vorschlagLaden`, { kategorie: 'food' }, pflege)

      expect(status).to.equal(200)
      expect(data.text).to.equal('Chuck Norris isst Suppe mit der Gabel.')
      expect(data.apiId).to.equal('vorschlag-4')
      expect(data.kategorie_code).to.equal('food')
    })

    it('speichert Vorschlag samt Sternen beim Aktivieren', async () => {
      nock('https://chuck-norris-api.test')
        .get('/jokes/random').query(zufall).reply(200, { id: 'vorschlag-5', value: 'Chuck Norris bewertet sich selbst.', categories: ['dev'] })

      const { data: neu } = await anlegen()
      await PATCH(entwurf(neu.ID), { bewertung: 4 }, pflege)
      const { status } = await POST(`${entwurf(neu.ID)}/WitzService.draftActivate`, {}, pflege)
      expect(status).to.equal(201)

      const { data: witz } = await GET(`/odata/v4/witze/Witze(ID=${neu.ID},IsActiveEntity=true)`, pflege)
      expect(witz.apiId).to.equal('vorschlag-5')
      expect(witz.bewertung).to.equal(4)
      expect(witz.kategorie_code).to.equal('dev')
    })

    it('lehnt beim Aktivieren einen schon gespeicherten API-Witz ab', async () => {
      nock('https://chuck-norris-api.test')
        .get('/jokes/random').query(zufall).reply(200, { id: 'doppelt-1', value: 'Einmal.' })
        .get('/jokes/random').query(zufall).reply(200, { id: 'doppelt-1', value: 'Einmal.' })

      const { data: erster } = await anlegen()
      const { data: zweiter } = await anlegen()
      await POST(`${entwurf(erster.ID)}/WitzService.draftActivate`, {}, pflege)
      const { status } = await POST(`${entwurf(zweiter.ID)}/WitzService.draftActivate`, {}, pflege)

      expect(status).to.equal(409)
    })
  })

  describe('Sterne', () => {
    it('liefert die Sternestufen 0 bis 5 als Werteliste', async () => {
      const { status, data } = await GET('/odata/v4/witze/Bewertungsstufen?$orderby=code', leser)
      expect(status).to.equal(200)
      expect(data.value.map(s => s.code)).to.deep.equal([0, 1, 2, 3, 4, 5])
    })

    it('filtert die Witze nach Sternen', async () => {
      const { data } = await GET('/odata/v4/witze/Witze?$filter=bewertung in (4,5) and IsActiveEntity eq true', leser)
      expect(data.value.length).to.be.greaterThan(0)
      expect(data.value.every(w => w.bewertung >= 4)).to.equal(true)
    })

    it('weist mehr als 5 Sterne ab', async () => {
      const { data: entwurf } = await POST('/odata/v4/witze/Witze', { text: 'Zu gut.', bewertung: 6 }, pflege)
      const { status } = await POST(
        `/odata/v4/witze/Witze(ID=${entwurf.ID},IsActiveEntity=false)/WitzService.draftActivate`, {}, pflege)
      expect(status).to.equal(400)
    })
  })

  describe('Aenderungen am Entwurf', () => {
    const chuckNorris = '11111111-1111-1111-1111-111111111111'
    const redaktion = '22222222-2222-2222-2222-222222222222'
    const entwurf = ID => `/odata/v4/witze/Witze(ID=${ID},IsActiveEntity=false)`
    const lesen = async ID => (await GET(`${entwurf(ID)}?$select=apiId,quelle_ID,quelleName,text`, pflege)).data

    const apiEntwurf = async id => {
      nock('https://chuck-norris-api.test')
        .get('/jokes/random').query(true)
        .reply(200, { id, value: `API-Witz ${id}`, categories: ['dev'] })
      const { data } = await POST('/odata/v4/witze/Witze', {}, pflege)
      expect(data.apiId).to.equal(id)
      return data.ID
    }

    it('entfernt apiId und wechselt auf Redaktion, wenn der Text geaendert wird', async () => {
      const ID = await apiEntwurf('aendern-1')
      await PATCH(entwurf(ID), { text: 'Selbst umgeschrieben.' }, pflege)

      const witz = await lesen(ID)
      expect(witz.apiId).to.equal(null)
      expect(witz.quelle_ID).to.equal(redaktion)
      expect(witz.quelleName).to.equal('Redaktion')
    })

    it('entfernt apiId auch, wenn die Kategorie geaendert wird', async () => {
      const ID = await apiEntwurf('aendern-2')
      await PATCH(entwurf(ID), { kategorie_code: 'food' }, pflege)
      expect((await lesen(ID)).apiId).to.equal(null)
    })

    it('laesst apiId und Quelle beim Vergeben von Sternen unveraendert', async () => {
      const ID = await apiEntwurf('aendern-3')
      await PATCH(entwurf(ID), { bewertung: 5 }, pflege)

      const witz = await lesen(ID)
      expect(witz.apiId).to.equal('aendern-3')
      expect(witz.quelle_ID).to.equal(chuckNorris)
    })

    it('behaelt eine selbst gewaehlte Quelle', async () => {
      const ID = await apiEntwurf('aendern-4')
      await PATCH(entwurf(ID), { quelleName: 'Gesperrt' }, pflege)
      await PATCH(entwurf(ID), { text: 'Anders.' }, pflege)

      const witz = await lesen(ID)
      expect(witz.apiId).to.equal(null)
      expect(witz.quelleName).to.equal('Gesperrt')
    })

    it('ordnet einen bekannten Quellnamen sofort zu', async () => {
      const { data: neu } = await POST('/odata/v4/witze/Witze', { text: 'Mit Quelle.' }, pflege)
      await PATCH(entwurf(neu.ID), { quelleName: '  chucknorris.io ' }, pflege)
      expect((await lesen(neu.ID)).quelle_ID).to.equal(chuckNorris)
    })

    it('legt einen unbekannten Quellnamen erst beim Sichern als neue Quelle an', async () => {
      const { data: neu } = await POST('/odata/v4/witze/Witze', { text: 'Aus dem Buch.' }, pflege)
      await PATCH(entwurf(neu.ID), { quelleName: 'Witzebuch 1999' }, pflege)

      const { data: vorher } = await GET(`/odata/v4/witze/Quellen?$filter=name eq 'Witzebuch 1999'`, pflege)
      expect(vorher.value).to.have.length(0)

      const { status } = await POST(`${entwurf(neu.ID)}/WitzService.draftActivate`, {}, pflege)
      expect(status).to.equal(201)

      const { data: quellen } = await GET(`/odata/v4/witze/Quellen?$filter=name eq 'Witzebuch 1999'`, pflege)
      expect(quellen.value).to.have.length(1)
      const { data: witz } = await GET(
        `/odata/v4/witze/Witze(ID=${neu.ID},IsActiveEntity=true)?$select=quelle_ID,quelleName`, pflege)
      expect(witz.quelle_ID).to.equal(quellen.value[0].ID)
      expect(witz.quelleName).to.equal('Witzebuch 1999')
    })
  })

  describe('Benutzerrechte', () => {
    it('meldet Lesern, dass sie nur lesen duerfen', async () => {
      const { status, data } = await GET('/odata/v4/witze/Benutzerrechte', leser)
      expect(status).to.equal(200)
      expect(data.nurLesen).to.equal(true)
    })

    it('meldet Pflege, dass sie anlegen darf', async () => {
      const { data } = await GET('/odata/v4/witze/Benutzerrechte', pflege)
      expect(data.nurLesen).to.equal(false)
    })
  })
})

