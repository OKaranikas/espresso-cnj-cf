import { executeHttpRequest } from '@sap-cloud-sdk/http-client'
import { resilience } from '@sap-cloud-sdk/resilience'
import cds from '@sap/cds'

const LOG = cds.log('chuck-norris-api')

/**
 * In der lokalen Entwicklung (Mock-Authentifizierung) gibt es keinen
 * Destination-Service - ohne Eintrag in der Umgebungsvariable destinations
 * wuerde jeder Aufruf scheitern. Die API ist oeffentlich und braucht keine
 * Authentifizierung, deshalb dort der direkte Weg. Produktiv und in den Tests
 * (setTestDestination) bleibt es bei der Destination.
 */
function ziel() {
  const lokal = cds.env.requires.auth?.kind === 'mocked'
    && !JSON.parse(process.env.destinations ?? '[]').some(d => d.name === 'CHUCK_NORRIS_API')
  return lokal ? { url: 'https://api.chucknorris.io' } : { destinationName: 'CHUCK_NORRIS_API' }
}

/**
 * Liest einen zufaelligen Witz ueber die Destination CHUCK_NORRIS_API.
 * Adressierung und Authentifizierung uebernimmt das SAP Cloud SDK.
 *
 * Neben den Feldern fuer Witze liefert das Ergebnis unter apiKategorien die
 * Kategorien, die die API dem Witz zuordnet (kein Element der Entitaet, vor
 * dem Speichern also entfernen).
 */
export async function holeZufallsWitz(kategorie, { retry = 3, timeout = 5000 } = {}) {
  const pfad = kategorie
    ? `/jokes/random?category=${encodeURIComponent(kategorie)}`
    : '/jokes/random'

  const antwort = await executeHttpRequest(
    ziel(),
    { method: 'get', url: pfad },
    { middleware: [resilience({ retry, timeout })] }
  )

  LOG.info('Witz von der Chuck-Norris-API gelesen', antwort.data.id)

  return {
    apiId: antwort.data.id,
    text: antwort.data.value,
    bewertung: 0,
    kategorie_code: kategorie ?? 'dev',
    apiKategorien: antwort.data.categories ?? []
  }
}
