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
import type { Kategorien_TextsApi } from './Kategorien_TextsApi';

/**
 * This class represents the entity "Kategorien_texts" of service "WitzService".
 */
export class Kategorien_Texts<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements Kategorien_TextsType<T>
{
  /**
   * Technical entity name for Kategorien_Texts.
   */
  static override _entityName = 'Kategorien_texts';
  /**
   * Default url path for the according service.
   */
  static override _defaultBasePath = '/odata/v4/witze';
  /**
   * All key fields of the Kategorien_Texts entity.
   */
  static _keys = ['locale', 'code'];
  /**
   * Locale.
   * Maximum length: 14.
   */
  declare locale: DeserializedType<T, 'Edm.String'>;
  /**
   * Name.
   * Maximum length: 255.
   * @nullable
   */
  declare name?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Descr.
   * Maximum length: 1000.
   * @nullable
   */
  declare descr?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Code.
   * Maximum length: 20.
   */
  declare code: DeserializedType<T, 'Edm.String'>;

  constructor(_entityApi: Kategorien_TextsApi<T>) {
    super(_entityApi);
  }
}

export interface Kategorien_TextsType<
  T extends DeSerializers = DefaultDeSerializers
> {
  locale: DeserializedType<T, 'Edm.String'>;
  name?: DeserializedType<T, 'Edm.String'> | null;
  descr?: DeserializedType<T, 'Edm.String'> | null;
  code: DeserializedType<T, 'Edm.String'>;
}
