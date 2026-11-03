import cds from '@sap/cds'

if (cds.env.requires.auth?.kind === 'mocked') {
  const { erzeugeHandler } = await import('../zentrale-komponenten/ui5-proxy/server.js')
  cds.on('bootstrap', app => {
    const ui5Proxy = erzeugeHandler()
    app.use('/resources', ui5Proxy)
    app.use('/test-resources', ui5Proxy)
  })
}

/**
 * Lokale Entwicklung: Die Fiori-Oberflaeche unter /witze/webapp/index.html
 * wird als statische Datei ausgeliefert und ist damit selbst ungeschuetzt.
 * Geschuetzt ist nur der WitzService. Der erste 401 kommt deshalb aus einem
 * XMLHttpRequest der laufenden Anwendung - und darauf zeigt der Browser
 * keinen Anmeldedialog an. Ergebnis: Die Seite laedt, bleibt aber leer.
 *
 * Der folgende Handler verlangt die Basic-Authentifizierung bereits fuer die
 * Seite selbst. Der Browser fragt dadurch beim Aufruf nach Benutzername und
 * Passwort und schickt die Anmeldedaten anschliessend auch an den Service.
 *
 * Er greift nur beim Mock-Authentifizierungsverfahren, also in der lokalen
 * Entwicklung. In der Cloud uebernimmt der Application Router die Anmeldung.
 */
cds.on('bootstrap', app => {
  if (cds.env.requires.auth?.kind !== 'mocked') return

  app.use('/witze', (req, res, next) => {
    if (req.headers.authorization) return next()
    res.setHeader('WWW-Authenticate', 'Basic realm="Users"')
    res.status(401).send('Unauthorized')
  })
})

/**
 * Lokale Entwicklung: Der Statistikdienst auf Python (statistik/server.py)
 * laeuft nur in der Cloud hinter dem Application Router unter /statistik/.
 * Damit die Schaltflaeche "Statistik" der Oberflaeche auch lokal etwas
 * anzeigt, liefert dieser Handler unter demselben Pfad dieselbe Antwort
 * (quelle, anzahl, durchschnitt) - berechnet ueber die Entitaet Statistik
 * des WitzService. Wie der Python-Dienst verlangt er die Rolle Leser.
 */
cds.on('bootstrap', app => {
  if (cds.env.requires.auth?.kind !== 'mocked') return

  app.get('/statistik/statistik', async (req, res) => {
    const [name, passwort] = Buffer.from(
      (req.headers.authorization ?? '').replace(/^Basic /, ''), 'base64').toString().split(':')
    const benutzer = cds.env.requires.auth.users?.[name]
    if (!benutzer || benutzer.password !== passwort) return res.sendStatus(401)
    // cds legt die Rollen aus package.json intern als Objekt ab, nicht als Array
    const rollen = Array.isArray(benutzer.roles) ? benutzer.roles : Object.keys(benutzer.roles ?? {})
    if (!rollen.includes('Leser')) return res.sendStatus(403)

    const srv = await cds.connect.to('WitzService')
    const zeilen = await srv.tx({ user: new cds.User({ id: name, roles: rollen }) },
      tx => tx.read(srv.entities.Statistik))
    res.json(zeilen.map(z => ({
      quelle: z.quelle_ID, anzahl: z.anzahl, durchschnitt: Number(z.durchschnitt ?? 0)
    })))
  })
})

export default cds.server
