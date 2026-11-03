import { createLogger } from '@sap-cloud-sdk/util';
import { resilience } from '@sap-cloud-sdk/resilience';
import { witzService } from './generated/witz-service';

const logger = createLogger('witz-client');

const { quellenApi, witzeApi } = witzService();

/**
 * Liest die Quellen des WitzService samt der Texte ihrer Witze.
 * Der typisierte Client stammt aus den Metadaten des Service.
 */
export async function leseQuellen() {
  return quellenApi
    .requestBuilder()
    .getAll()
    .select(quellenApi.schema.ID, quellenApi.schema.NAME)
    .expand(quellenApi.schema.WITZE.select(witzeApi.schema.TEXT))
    .filter(quellenApi.schema.NAME.equals('chucknorris.io'))
    .top(10)
    .execute({ destinationName: 'WITZ_SERVICE' });
}

/**
 * Dieselbe Abfrage, abgesichert mit den Resilienzmustern des Cloud SDK.
 * Im Fehlerfall wird eine leere Liste geliefert.
 */
export async function leseQuellenResilient() {
  try {
    return await quellenApi
      .requestBuilder()
      .getAll()
      .middleware(resilience({ retry: 3, timeout: 5000 }))
      .execute({ destinationName: 'WITZ_SERVICE' });
  } catch (fehler) {
    logger.warn('Quellen konnten nicht gelesen werden', fehler);
    return [];
  }
}
