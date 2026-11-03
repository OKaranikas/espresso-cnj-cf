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
import type { QuellenApi } from './QuellenApi';
import { Witze, WitzeType } from './Witze';

/**
 * This class represents the entity "Quellen" of service "WitzService".
 */
export class Quellen<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements QuellenType<T>
{
  /**
   * Technical entity name for Quellen.
   */
  static override _entityName = 'Quellen';
  /**
   * Default url path for the according service.
   */
  static override _defaultBasePath = '/odata/v4/witze';
  /**
   * All key fields of the Quellen entity.
   */
  static _keys = ['ID'];
  /**
   * Id.
   */
  declare id: DeserializedType<T, 'Edm.Guid'>;
  /**
   * Created At.
   * @nullable
   */
  declare createdAt?: DeserializedType<T, 'Edm.DateTimeOffset'> | null;
  /**
   * Created By.
   * Maximum length: 255.
   * @nullable
   */
  declare createdBy?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Modified At.
   * @nullable
   */
  declare modifiedAt?: DeserializedType<T, 'Edm.DateTimeOffset'> | null;
  /**
   * Modified By.
   * Maximum length: 255.
   * @nullable
   */
  declare modifiedBy?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Name.
   * Maximum length: 100.
   */
  declare name: DeserializedType<T, 'Edm.String'>;
  /**
   * Url.
   * Maximum length: 255.
   * @nullable
   */
  declare url?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * One-to-many navigation property to the {@link Witze} entity.
   */
  declare witze: Witze<T>[];

  constructor(_entityApi: QuellenApi<T>) {
    super(_entityApi);
  }
}

export interface QuellenType<T extends DeSerializers = DefaultDeSerializers> {
  id: DeserializedType<T, 'Edm.Guid'>;
  createdAt?: DeserializedType<T, 'Edm.DateTimeOffset'> | null;
  createdBy?: DeserializedType<T, 'Edm.String'> | null;
  modifiedAt?: DeserializedType<T, 'Edm.DateTimeOffset'> | null;
  modifiedBy?: DeserializedType<T, 'Edm.String'> | null;
  name: DeserializedType<T, 'Edm.String'>;
  url?: DeserializedType<T, 'Edm.String'> | null;
  witze: WitzeType<T>[];
}
