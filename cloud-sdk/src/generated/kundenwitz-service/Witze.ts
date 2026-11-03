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
import type { WitzeApi } from './WitzeApi';

/**
 * This class represents the entity "Witze" of service "KundenWitzService".
 */
export class Witze<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements WitzeType<T>
{
  /**
   * Technical entity name for Witze.
   */
  static override _entityName = 'Witze';
  /**
   * Default url path for the according service.
   */
  static override _defaultBasePath = '/odata/v4/kundenwitze';
  /**
   * All key fields of the Witze entity.
   */
  static _keys = ['ID'];
  /**
   * Id.
   */
  declare id: DeserializedType<T, 'Edm.Guid'>;
  /**
   * Api Id.
   * Maximum length: 255.
   * @nullable
   */
  declare apiId?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Text.
   * Maximum length: 5000.
   * @nullable
   */
  declare text?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Bewertung.
   * @nullable
   */
  declare bewertung?: DeserializedType<T, 'Edm.Int32'> | null;
  /**
   * Freigabe.
   * @nullable
   */
  declare freigabe?: DeserializedType<T, 'Edm.Boolean'> | null;

  constructor(_entityApi: WitzeApi<T>) {
    super(_entityApi);
  }
}

export interface WitzeType<T extends DeSerializers = DefaultDeSerializers> {
  id: DeserializedType<T, 'Edm.Guid'>;
  apiId?: DeserializedType<T, 'Edm.String'> | null;
  text?: DeserializedType<T, 'Edm.String'> | null;
  bewertung?: DeserializedType<T, 'Edm.Int32'> | null;
  freigabe?: DeserializedType<T, 'Edm.Boolean'> | null;
}
