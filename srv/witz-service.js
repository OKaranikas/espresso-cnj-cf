import cds from '@sap/cds'
import { holeZufallsWitz } from './lib/chuck-norris-api.js'

const LOG = cds.log('witz-service')

export class WitzService extends cds.ApplicationService {
  init() {
    const { Witze, Quellen, Kategorien, Statistik, Benutzerrechte } = this.entities

    const quelleNamens = async name =>
      name ? SELECT.one.from(Quellen).columns('ID', 'name').where({ name }) : undefined

    const redaktion = () => quelleNamens('Redaktion')

    this.before(['CREATE', 'UPDATE'], Witze, req => {
      if (req.data.bewertung < 0)
        req.error(400, 'Bewertung darf nicht negativ sein.', 'bewertung')
      else if (req.data.bewertung > 5)
        req.error(400, 'Bewertung darf hoechstens 5 Sterne betragen.', 'bewertung')
    })

    // Ein Witz von der API soll nur einmal in der Sammlung landen - auch
    // dann nicht doppelt, wenn zwei Entwuerfe denselben Vorschlag erhalten.
    this.before('CREATE', Witze, async req => {
      if (!req.data.apiId) return
      const bekannt = await SELECT.one.from(Witze).where({ apiId: req.data.apiId })
      if (bekannt) req.error(409, 'Dieser Witz der Chuck-Norris-API ist schon gespeichert.', 'text')
    })

    // Holt einen Witz von der API, der noch nicht gespeichert ist, und
    // bereitet ihn als Entwurfsdaten auf. Liefert undefined, wenn die API
    // nicht erreichbar ist oder nur bekannte Witze liefert - das Anlegen
    // soll daran nicht scheitern, der Benutzer tippt dann selbst.
    const alleKategorien = async () =>
      (await SELECT.from(Kategorien).columns('code').orderBy('code')).map(k => k.code).join(',')

    const vorschlagHolen = async (req, kategorie) => {
      for (let versuch = 0; versuch < 3; versuch++) {
        let witz
        try {
          // Kurzer Timeout ohne viele Wiederholungen: der Benutzer wartet
          // beim Klick auf "Anlegen" auf die Antwort.
          // Ohne Auswahl nur aus unseren Kategorien ziehen: die API kennt auch
          // explicit, political und religion, die hier nichts verloren haben.
          witz = await holeZufallsWitz(kategorie ?? await alleKategorien(), { retry: 1, timeout: 3000 })
        } catch (e) {
          LOG.warn('Kein Vorschlag von der Chuck-Norris-API', e.message)
          req.warn('Die Chuck-Norris-API ist gerade nicht erreichbar. Bitte den Witz selbst eingeben oder spaeter "Witz von der API laden" waehlen.')
          return
        }
        const { apiKategorien, ...daten } = witz
        if (await SELECT.one.from(Witze).where({ apiId: daten.apiId })) continue

        // Die Kategorie der API uebernehmen, sofern es sie bei uns gibt.
        const bekannteKategorie = kategorie ?? (apiKategorien.length
          ? (await SELECT.one.from(Kategorien).columns('code').where({ code: { in: apiKategorien } }))?.code
          : undefined)
        const quelle = await SELECT.one.from(Quellen).columns('ID').where({ name: 'chucknorris.io' })

        return {
          text: daten.text,
          apiId: daten.apiId,
          kategorie_code: bekannteKategorie ?? null,
          quelle_ID: quelle?.ID ?? null
        }
      }
      req.warn('Die Chuck-Norris-API hat nur bereits gespeicherte Witze geliefert. Bitte erneut versuchen oder den Witz selbst eingeben.')
    }

    // Beim Anlegen ueber die Oberflaeche ist der Entwurf sofort mit einem
    // Vorschlag der API gefuellt. Wer schon einen Text mitschickt (z.B. per
    // API-Aufruf), bekommt keinen Vorschlag. Ohne Vorschlag ist "Redaktion"
    // die Quelle.
    //
    // Bewusst ohne Meldung: Sie kaeme noch in der Liste an, bevor die
    // Objektseite offen ist. Den Hinweis zeigt die Objektseite selbst
    // (app/witze/webapp/ext/ObjectPageExt.js) - anhand von apiId erkennt
    // sie, ob ein Vorschlag geladen wurde.
    this.before('NEW', Witze.drafts, async req => {
      if (req.data.text) return
      const vorschlag = await vorschlagHolen({ warn () {} })
      if (vorschlag) return Object.assign(req.data, vorschlag)
      if (!req.data.quelle_ID) req.data.quelle_ID = (await redaktion())?.ID ?? null
    })

    // Wer Text oder Kategorie eines API-Witzes aendert, macht daraus einen
    // eigenen Witz: Die apiId entfaellt (sonst blockierte sie den echten
    // API-Witz als Dublette), und die Quelle wechselt auf "Redaktion" - es
    // sei denn, der Benutzer hat die Quelle selbst gewaehlt.
    this.before('PATCH', Witze.drafts, async req => {
      const { data } = req
      if ('quelleName' in data) {
        data.quelleName = data.quelleName?.trim() || null
        // Bekannte Quelle sofort zuordnen; eine neue entsteht erst beim
        // Sichern, damit verworfene Entwuerfe keine Quellen hinterlassen.
        data.quelle_ID = (await quelleNamens(data.quelleName))?.ID ?? null
      }

      if (!('text' in data) && !('kategorie_code' in data)) return
      const entwurf = await SELECT.one.from(req.subject)
        .columns('apiId', 'text', 'kategorie_code', 'quelle_ID')
      if (!entwurf?.apiId) return
      const geaendert = ('text' in data && data.text !== entwurf.text)
        || ('kategorie_code' in data && data.kategorie_code !== entwurf.kategorie_code)
      if (!geaendert) return

      data.apiId = null
      const chuckNorris = await quelleNamens('chucknorris.io')
      if (!('quelleName' in data) && entwurf.quelle_ID === chuckNorris?.ID) {
        const quelle = await redaktion()
        data.quelle_ID = quelle?.ID ?? null
        data.quelleName = quelle?.name ?? null
      }
    })

    // Beim Sichern: unbekannten Quellnamen als neue Quelle anlegen.
    // quelleName selbst ist nur ein Pfad auf quelle.name und wird nicht
    // gespeichert.
    this.before(['CREATE', 'UPDATE'], Witze, async req => {
      const { data } = req
      if (!('quelleName' in data)) return
      const name = data.quelleName?.trim()
      delete data.quelleName
      if (!name) return
      let quelle = await quelleNamens(name)
      if (!quelle) {
        quelle = { ID: cds.utils.uuid(), name }
        await INSERT.into(Quellen).entries(quelle)
      }
      data.quelle_ID = quelle.ID
    })

    this.on('vorschlagLaden', Witze.drafts, async req => {
      const vorschlag = await vorschlagHolen(req, req.data.kategorie || undefined)
      if (vorschlag) await UPDATE(req.subject).with(vorschlag)
      return SELECT.one.from(req.subject)
    })

    this.on('vorschlagLaden', Witze, req =>
      req.reject(400, 'Ein Vorschlag laesst sich nur im Bearbeitungsmodus laden.'))

    // Auch fuer Entwuerfe: die Oberflaeche liest nurLesen im Bearbeitungsmodus
    // (Schaltflaeche "Witz von der API laden"), sonst fehlt das Feld dort.
    this.after('each', [Witze, Witze.drafts], (witz, req) => {
      witz.istTopWitz = witz.bewertung >= 4
      witz.nurLesen = !req.user.is('Pflege')
    })

    this.on('bewertungAnpassen', Quellen, async req => {
      const { prozent } = req.data
      // Die HANA-Prozedur (db/src/BEWERTUNG_ANPASSEN.hdbprocedure) prueft
      // denselben Bereich und lehnt mit SIGNAL ab. Diese Pruefung hier
      // greift zusaetzlich auf SQLite, wo die Prozedur nicht existiert.
      if (prozent < -50 || prozent > 50) {
        return req.reject(400, 'Prozentsatz ausserhalb des erlaubten Bereichs.', 'prozent')
      }

      const { ID } = await SELECT.one.from(req.subject).columns('ID')

      if (cds.db.kind === 'hana') {
        await cds.run('CALL BEWERTUNG_ANPASSEN(?, ?)', [ID, prozent])
      } else {
        // Lokal und in der CI laeuft SQLite statt HANA Cloud, dort gibt es
        // die native Prozedur nicht. Dieselbe Logik in CAP-QL nachgebildet,
        // damit die Action auch ohne HDI-Container testbar ist.
        const betroffen = await SELECT.from(Witze)
          .columns('ID', 'bewertung')
          .where({ quelle_ID: ID, bewertung: { '!=': null } })

        for (const witz of betroffen) {
          // Auf 0-5 Sterne begrenzen - die Datenbank laesst nichts anderes zu
          // (CHECK-Constraint, db/schema.cds).
          const neu = Math.round(witz.bewertung * (1 + prozent / 100))
          await UPDATE(Witze, witz.ID)
            .with({ bewertung: Math.min(5, Math.max(0, neu)) })
        }
      }
    })

    // Statistik (db/statistik.cds) ist @cds.persistence.exists und bildet die
    // native HANA-Tabellenfunktion db/src/CNJ_WITZSTATISTIK.hdbfunction ab -
    // die gibt es in SQLite nicht, ein GET auf /Statistik schlaegt dort mit
    // "no such table" fehl. Fuer lokale Entwicklung und CI wird dieselbe
    // Aggregation (COUNT(*) und AVG(bewertung) je Quelle, wie in der
    // Funktion) hier in CAP-QL nachgebildet; produktiv auf HANA bleibt die
    // native Funktion unveraendert im Einsatz.
    this.on('READ', Statistik, async (req, next) => {
      if (cds.db.kind === 'hana') return next()

      const witze = await SELECT.from(Witze).columns('quelle_ID', 'bewertung')
      const gruppen = new Map()
      for (const { quelle_ID, bewertung } of witze) {
        if (quelle_ID == null) continue
        const eintrag = gruppen.get(quelle_ID) ?? { anzahl: 0, summe: 0, bewertete: 0 }
        eintrag.anzahl++
        if (bewertung != null) {
          eintrag.summe += bewertung
          eintrag.bewertete++
        }
        gruppen.set(quelle_ID, eintrag)
      }

      return [...gruppen].map(([quelle_ID, { anzahl, summe, bewertete }]) => ({
        quelle_ID,
        anzahl,
        durchschnitt: bewertete ? Math.round((summe / bewertete) * 100) / 100 : null
      }))
    })

    this.on('READ', Benutzerrechte, req => ({ nurLesen: !req.user.is('Pflege') }))

    this.on('witzAbrufen', async req => {
      const { apiKategorien, ...witz } = await holeZufallsWitz()
      const bekannt = await SELECT.one.from(Witze)
        .where({ apiId: witz.apiId })
      if (bekannt) return req.reject(409, 'Der Witz ist schon gespeichert.')
      return INSERT.into(Witze).entries(witz)
    })

    return super.init()
  }
}
