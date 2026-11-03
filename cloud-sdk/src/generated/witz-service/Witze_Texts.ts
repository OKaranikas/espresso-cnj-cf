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
import type { Witze_TextsApi } from './Witze_TextsApi';

/**
 * This class represents the entity "Witze_texts" of service "WitzService".
 */
export class Witze_Texts<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements Witze_TextsType<T>
{
  /**
   * Technical entity name for Witze_Texts.
   */
  static override _entityName = 'Witze_texts';
  /**
   * Default url path for the according service.
   */
  static override _defaultBasePath = '/odata/v4/witze';
  /**
   * All key fields of the Witze_Texts entity.
   */
  static _keys = ['locale', 'ID'];
  /**
   * Locale.
   * Maximum length: 14.
   */
  declare locale: DeserializedType<T, 'Edm.String'>;
  /**
   * Id.
   */
  declare id: DeserializedType<T, 'Edm.Guid'>;
  /**
   * Text.
   * Maximum length: 5000.
   */
  declare text: DeserializedType<T, 'Edm.String'>;

  constructor(_entityApi: Witze_TextsApi<T>) {
    super(_entityApi);
  }
}

export interface Witze_TextsType<
  T extends DeSerializers = DefaultDeSerializers
> {
  locale: DeserializedType<T, 'Edm.String'>;
  id: DeserializedType<T, 'Edm.Guid'>;
  text: DeserializedType<T, 'Edm.String'>;
}
