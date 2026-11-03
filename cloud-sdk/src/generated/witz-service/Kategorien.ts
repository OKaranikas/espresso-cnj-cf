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
import type { KategorienApi } from './KategorienApi';
import { Kategorien_Texts, Kategorien_TextsType } from './Kategorien_Texts';

/**
 * This class represents the entity "Kategorien" of service "WitzService".
 */
export class Kategorien<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements KategorienType<T>
{
  /**
   * Technical entity name for Kategorien.
   */
  static override _entityName = 'Kategorien';
  /**
   * Default url path for the according service.
   */
  static override _defaultBasePath = '/odata/v4/witze';
  /**
   * All key fields of the Kategorien entity.
   */
  static _keys = ['code'];
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
  /**
   * One-to-many navigation property to the {@link Kategorien_Texts} entity.
   */
  declare texts: Kategorien_Texts<T>[];
  /**
   * One-to-one navigation property to the {@link Kategorien_Texts} entity.
   */
  declare localized?: Kategorien_Texts<T> | null;

  constructor(_entityApi: KategorienApi<T>) {
    super(_entityApi);
  }
}

export interface KategorienType<
  T extends DeSerializers = DefaultDeSerializers
> {
  name?: DeserializedType<T, 'Edm.String'> | null;
  descr?: DeserializedType<T, 'Edm.String'> | null;
  code: DeserializedType<T, 'Edm.String'>;
  texts: Kategorien_TextsType<T>[];
  localized?: Kategorien_TextsType<T> | null;
}
