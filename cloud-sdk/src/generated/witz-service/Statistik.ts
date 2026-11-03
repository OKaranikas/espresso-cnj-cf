/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import {
  Entity,
  DefaultDeSerializers,
  DeSerializers,
  DeserializedType
} from '@sap-cloud-sdk/odata-v4';
import type { StatistikApi } from './StatistikApi';

/**
 * This class represents the entity "Statistik" of service "WitzService".
 */
export class Statistik<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements StatistikType<T>
{
  /**
   * Technical entity name for Statistik.
   */
  static override _entityName = 'Statistik';
  /**
   * Default url path for the according service.
   */
  static override _defaultBasePath = '/odata/v4/witze';
  /**
   * All key fields of the Statistik entity.
   */
  static _keys = ['quelle_ID'];
  /**
   * Quelle Id.
   */
  declare quelleId: DeserializedType<T, 'Edm.Guid'>;
  /**
   * Anzahl.
   * @nullable
   */
  declare anzahl?: DeserializedType<T, 'Edm.Int64'> | null;
  /**
   * Durchschnittsbewertung.
   * @nullable
   */
  declare durchschnittsbewertung?: DeserializedType<T, 'Edm.Decimal'> | null;

  constructor(_entityApi: StatistikApi<T>) {
    super(_entityApi);
  }
}

export interface StatistikType<T extends DeSerializers = DefaultDeSerializers> {
  quelleId: DeserializedType<T, 'Edm.Guid'>;
  anzahl?: DeserializedType<T, 'Edm.Int64'> | null;
  durchschnittsbewertung?: DeserializedType<T, 'Edm.Decimal'> | null;
}
