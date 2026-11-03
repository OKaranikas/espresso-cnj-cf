import http from 'node:http'
import https from 'node:https'
import { URL } from 'node:url'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const hier = dirname(fileURLToPath(import.meta.url))

// versions.json liegt im Repository eine Ebene ueber diesem Modul
// (zentrale-komponenten/versions.json neben zentrale-komponenten/ui5-proxy),
// so lesen es sowohl dieses Modul als auch srv/server.js. Fuer das
// Cloud-Foundry-Deployment kopiert der Build-Schritt in mta.yaml sie
// zusaetzlich NEBEN server.js, weil beim Deployment nur der Inhalt von
// ui5-proxy/ ausgeliefert wird, nicht das darueberliegende Verzeichnis.
const versionsJsonPfad = [join(hier, '../versions.json'), join(hier, 'versions.json')]
  .find(existsSync)

if (!versionsJsonPfad) {
  throw new Error(
    'versions.json nicht gefunden (weder eine Ebene ueber ui5-proxy noch daneben). ' +
    'Siehe zentrale-komponenten/README.md.'
  )
}

const { ui5 } = JSON.parse(readFileSync(versionsJsonPfad, 'utf8'))

const STANDARD_UPSTREAM = `https://ui5.sap.com/${ui5.version}`

/**
 * Zentrale Komponenten: Reverse Proxy fuer die UI5-Laufzeit.
 *
 * Vorher verdrahtete app/witze/webapp/index.html die CDN-URL
 * (https://ui5.sap.com/1.152.0/...) fest. Bei mehreren Fiori-Anwendungen
 * im selben Subaccount muesste dieselbe URL an jeder Stelle gepflegt und
 * bei einem Versionswechsel ueberall gleichzeitig geaendert werden; in
 * Landschaften ohne freien Internetzugang liesse sich die UI5-Laufzeit
 * ueberhaupt nicht laden. Dieses Modul buendelt beides an einer Stelle:
 *
 *  - lokal bindet srv/server.js erzeugeHandler() als Express-Middleware
 *    unter /resources und /test-resources ein,
 *  - produktiv laeuft dieses Modul als eigene Cloud-Foundry-App
 *    (Modul cnj-zentrale-komponenten in mta.yaml), an die der
 *    Application Router dieselben beiden Pfade weiterleitet
 *    (app/router/xs-app.json).
 *
 * In beiden Faellen ist der eigentliche Anfragepfad identisch, und
 * app/witze/webapp/index.html bootstrapt UI5 ueber den relativen Pfad
 * "/resources/sap-ui-core.js" - unabhaengig davon, ob lokal entwickelt
 * oder produktiv ausgeliefert wird.
 *
 * Der Upstream ist ueber die Umgebungsvariable UI5_UPSTREAM_URL
 * konfigurierbar (z. B. auf einen internen Spiegel in Landschaften ohne
 * Zugriff auf das oeffentliche SAP-CDN); ohne Vorgabe wird die in
 * versions.json gepflegte UI5-Version vom SAP-CDN bezogen.
 */
export function erzeugeHandler(upstreamBasis = process.env.UI5_UPSTREAM_URL || STANDARD_UPSTREAM) {
  const basis = upstreamBasis.replace(/\/$/, '')

  return function ui5ProxyHandler(req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (typeof next === 'function') return next()
      res.writeHead(405).end('Method Not Allowed')
      return
    }

    // req.originalUrl: vollstaendiger Pfad, wenn als Express-Middleware
    // unter einem Mount-Pfad eingehaengt (Express kuerzt sonst req.url).
    // Ausserhalb von Express (eigenstaendiger Server) ist req.url bereits
    // vollstaendig.
    const pfad = req.originalUrl || req.url
    let ziel
    try {
      ziel = new URL(basis + pfad)
    } catch (fehler) {
      res.writeHead(400).end('Bad Request')
      return
    }

    const client = ziel.protocol === 'http:' ? http : https
    const { host, connection, ...weiterzuleitendeHeader } = req.headers

    const weiterleitung = client.request(
      ziel,
      { method: req.method, headers: { ...weiterzuleitendeHeader, host: ziel.host } },
      upstreamRes => {
        res.writeHead(upstreamRes.statusCode, upstreamRes.headers)
        upstreamRes.pipe(res)
      }
    )

    weiterleitung.on('error', fehler => {
      console.error('[ui5-proxy] Weiterleitung an', ziel.href, 'fehlgeschlagen:', fehler.message)
      if (!res.headersSent) res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('Bad Gateway: UI5-Upstream nicht erreichbar')
    })

    req.pipe(weiterleitung)
  }
}

// Eigenstaendiger Start nur beim direkten Aufruf (Cloud-Foundry-Deployment
// als Modul cnj-zentrale-komponenten). Beim Einbinden aus srv/server.js
// wird ausschliesslich erzeugeHandler() verwendet, kein eigener Server.
if (import.meta.url === `file://${process.argv[1]}`) {
  const handler = erzeugeHandler()
  const port = process.env.PORT || 8080
  http.createServer(handler).listen(port, () => {
    console.log(
      `[ui5-proxy] hoert auf Port ${port}, Upstream: ${process.env.UI5_UPSTREAM_URL || STANDARD_UPSTREAM}`
    )
  })
}
