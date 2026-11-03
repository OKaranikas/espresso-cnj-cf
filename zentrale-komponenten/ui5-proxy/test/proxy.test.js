import { test } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { erzeugeHandler } from '../server.js'

// Diese Tests ersetzen das SAP-CDN durch einen lokalen Stub-Server, damit
// die Weiterleitungslogik ohne Internetzugriff geprueft werden kann. Der
// eigentliche Abgleich gegen https://ui5.sap.com laesst sich aus dieser
// Umgebung heraus nicht fuehren (ausgehende Verbindungen dorthin sind
// gesperrt) - die Proxy-Logik selbst ist davon unabhaengig, sie leitet
// jeden konfigurierten Upstream unveraendert weiter.

function starteServer(handler) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(handler)
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

function basisUrl(server) {
  const { address, port } = server.address()
  return `http://${address}:${port}`
}

async function schliesse(...server) {
  await Promise.all(server.map(s => new Promise(r => s.close(r))))
}

test('leitet eine erfolgreiche Anfrage mit Status, Header und Body durch', async () => {
  const stub = await starteServer((req, res) => {
    assert.equal(req.url, '/resources/sap-ui-core.js')
    res.writeHead(200, { 'content-type': 'application/javascript; charset=UTF-8' })
    res.end("console.log('stub-ui5-core')")
  })

  const proxy = await starteServer(erzeugeHandler(basisUrl(stub)))

  try {
    const antwort = await fetch(`${basisUrl(proxy)}/resources/sap-ui-core.js`)
    assert.equal(antwort.status, 200)
    assert.equal(antwort.headers.get('content-type'), 'application/javascript; charset=UTF-8')
    assert.equal(await antwort.text(), "console.log('stub-ui5-core')")
  } finally {
    await schliesse(proxy, stub)
  }
})

test('reicht einen 404 des Upstreams unveraendert durch', async () => {
  const stub = await starteServer((req, res) => {
    res.writeHead(404, { 'content-type': 'text/plain' })
    res.end('Not Found')
  })
  const proxy = await starteServer(erzeugeHandler(basisUrl(stub)))

  try {
    const antwort = await fetch(`${basisUrl(proxy)}/resources/unbekannt.js`)
    assert.equal(antwort.status, 404)
  } finally {
    await schliesse(proxy, stub)
  }
})

test('liefert 502, wenn der Upstream nicht erreichbar ist', async () => {
  // Port 1 ist auf jedem System reserviert und nimmt keine Verbindungen an -
  // eine verlaessliche Methode, "nicht erreichbar" ohne echtes Netzwerk zu simulieren.
  const proxy = await starteServer(erzeugeHandler('http://127.0.0.1:1'))

  try {
    const antwort = await fetch(`${basisUrl(proxy)}/resources/sap-ui-core.js`)
    assert.equal(antwort.status, 502)
  } finally {
    await schliesse(proxy)
  }
})

test('lehnt andere Methoden als GET/HEAD ohne next() mit 405 ab', async () => {
  const proxy = await starteServer(erzeugeHandler('http://127.0.0.1:1'))

  try {
    const antwort = await fetch(`${basisUrl(proxy)}/resources/sap-ui-core.js`, { method: 'POST' })
    assert.equal(antwort.status, 405)
  } finally {
    await schliesse(proxy)
  }
})

test('haengt den Mount-Pfad ueber originalUrl korrekt an den Upstream an (Express-Fall)', async () => {
  const stub = await starteServer((req, res) => {
    assert.equal(req.url, '/resources/sap/m/library-preload.js')
    res.writeHead(200, { 'content-type': 'application/javascript' })
    res.end('ok')
  })

  const handler = erzeugeHandler(basisUrl(stub))
  // Simuliert, was Express bei app.use('/resources', handler) tut: req.url
  // wird auf den Rest hinter dem Mount-Pfad gekuerzt, req.originalUrl bleibt
  // vollstaendig erhalten.
  const proxy = await starteServer((req, res) => {
    req.originalUrl = req.url
    req.url = req.url.replace(/^\/resources/, '') || '/'
    handler(req, res)
  })

  try {
    const antwort = await fetch(`${basisUrl(proxy)}/resources/sap/m/library-preload.js`)
    assert.equal(antwort.status, 200)
    assert.equal(await antwort.text(), 'ok')
  } finally {
    await schliesse(proxy, stub)
  }
})
