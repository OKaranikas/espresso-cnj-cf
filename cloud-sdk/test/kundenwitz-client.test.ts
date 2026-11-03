import type { IncomingMessage } from 'node:http';
import nock from 'nock';
import { mockTestDestination, unmockTestDestination } from '@sap-cloud-sdk/test-util';
import { leseKundenWitze } from '../src/kundenwitz-client';

// Ein Request-Objekt, das fuer retrieveJwt() ausreicht: es liest nur
// req.headers.authorization aus, dekodiert das Token selbst nicht.
function anfrageMitToken(token = 'kopf.nutzlast.signatur'): IncomingMessage {
  return { headers: { authorization: `Bearer ${token}` } } as IncomingMessage;
}

describe('leseKundenWitze', () => {
  beforeEach(() => {
    mockTestDestination('KUNDEN_WITZE');
  });

  afterEach(() => {
    unmockTestDestination('KUNDEN_WITZE');
    nock.cleanAll();
  });

  it('liefert den mandantenspezifischen Witz-Katalog', async () => {
    nock('http://localhost:4005')
      .get(/\/odata\/v4\/kundenwitze\/Witze/)
      .reply(200, {
        value: [
          { ID: '99999999-9999-9999-9999-999999999999', text: 'Ein Kundenwitz' }
        ]
      });

    const witze = await leseKundenWitze(anfrageMitToken());

    expect(witze).toHaveLength(1);
    expect(witze[0].text).toBe('Ein Kundenwitz');
  });

  it('lehnt eine Anfrage ohne Benutzertoken ab', async () => {
    const anfrageOhneToken = { headers: {} } as IncomingMessage;

    // retrieveJwt() liefert ohne Authorization-Header undefined; das
    // Cloud SDK verlangt fuer selectionStrategy: alwaysSubscriber ein JWT
    // und lehnt den Aufruf ab, statt den Katalog eines falschen Mandanten
    // zurueckzugeben.
    await expect(leseKundenWitze(anfrageOhneToken)).rejects.toThrow();
  });

  it('gibt einen Fehler weiter, wenn der Kundendienst nicht erreichbar ist', async () => {
    nock('http://localhost:4005')
      .get(/\/odata\/v4\/kundenwitze\/Witze/)
      .replyWithError('connection refused');

    await expect(leseKundenWitze(anfrageMitToken())).rejects.toThrow();
  });

  it('gibt einen Fehler weiter, wenn der Kundendienst 503 liefert', async () => {
    nock('http://localhost:4005')
      .get(/\/odata\/v4\/kundenwitze\/Witze/)
      .reply(503);

    await expect(leseKundenWitze(anfrageMitToken())).rejects.toThrow();
  });
});
