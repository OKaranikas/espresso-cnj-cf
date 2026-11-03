import nock from 'nock';
import { mockTestDestination, unmockTestDestination } from '@sap-cloud-sdk/test-util';
import { leseQuellen, leseQuellenResilient } from '../src/witz-client';

// Eine Destination fuer die ganze Datei: mockTestDestination() lehnt einen
// zweiten Aufruf mit demselben Namen ab, solange der erste nicht mit
// unmockTestDestination() rueckgaengig gemacht wurde.
beforeAll(() => {
  mockTestDestination('WITZ_SERVICE');
});

afterAll(() => {
  unmockTestDestination('WITZ_SERVICE');
});

describe('leseQuellen', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('liefert die Quellen des WitzService', async () => {
    nock('http://localhost:4004')
      .get(/\/odata\/v4\/witze\/Quellen/)
      .reply(200, {
        value:
          [{
            ID: '11111111-1111-1111-1111-111111111111',
            name: 'chucknorris.io'
          }]
      });

    const quellen = await leseQuellen();

    expect(quellen).toHaveLength(1);
    expect(quellen[0].name).toBe('chucknorris.io');
  });

  it('gibt den Fehler weiter, wenn der WitzService 503 liefert', async () => {
    nock('http://localhost:4004')
      .get(/\/odata\/v4\/witze\/Quellen/)
      .reply(503);

    await expect(leseQuellen()).rejects.toThrow();
  });

  it('gibt den Fehler weiter, wenn der WitzService nicht erreichbar ist', async () => {
    nock('http://localhost:4004')
      .get(/\/odata\/v4\/witze\/Quellen/)
      .replyWithError({ code: 'ECONNREFUSED' });

    await expect(leseQuellen()).rejects.toThrow();
  });
});

describe('leseQuellenResilient', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // Timeout erhoeht: die resilience-Middleware wiederholt mit Backoff,
  // das dauert laenger als Jests Standard-Timeout von 5000 ms.
  it('liefert eine leere Liste statt eines Fehlers, wenn der WitzService nicht erreichbar ist', async () => {
    nock('http://localhost:4004')
      .get(/\/odata\/v4\/witze\/Quellen/)
      .times(4) // 1 Versuch + bis zu 3 Wiederholungen aus der resilience-Middleware
      .replyWithError({ code: 'ECONNREFUSED' });

    const quellen = await leseQuellenResilient();

    expect(quellen).toEqual([]);
  }, 20000);
});
