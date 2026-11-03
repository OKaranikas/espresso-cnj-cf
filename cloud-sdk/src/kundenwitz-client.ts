import type { IncomingMessage } from 'node:http';
import { alwaysSubscriber, retrieveJwt } from '@sap-cloud-sdk/connectivity';
import { kundenwitzService } from './generated/kundenwitz-service';

const { witzeApi } = kundenwitzService();

/**
 * Liest den mandantenspezifischen Witz-Katalog eines Kunden.
 * Die Destination KUNDEN_WITZE wird ausschliesslich im Subaccount
 * des Subscribers gesucht, ein gueltiges Benutzertoken ist Pflicht.
 */
export async function leseKundenWitze(request: IncomingMessage) {
  return witzeApi
    .requestBuilder()
    .getAll()
    .top(20)
    .execute({
      destinationName: 'KUNDEN_WITZE',
      jwt: retrieveJwt(request),
      selectionStrategy: alwaysSubscriber
    });
}
