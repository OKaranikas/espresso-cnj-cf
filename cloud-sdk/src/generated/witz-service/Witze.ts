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
import { Kategorien, KategorienType } from './Kategorien';
import { Quellen, QuellenType } from './Quellen';
import { Witze_Texts, Witze_TextsType } from './Witze_Texts';

/**
 * This class represents the entity "Witze" of service "WitzService".
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
  static override _defaultBasePath = '/odata/v4/witze';
  /**
   * All key fields of the Witze entity.
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
   * Text.
   * Maximum length: 5000.
   */
  declare text: DeserializedType<T, 'Edm.String'>;
  /**
   * Api Id.
   * Maximum length: 255.
   * @nullable
   */
  declare apiId?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Bewertung.
   * @nullable
   */
  declare bewertung?: DeserializedType<T, 'Edm.Int32'> | null;
  /**
   * Kategorie Code.
   * Maximum length: 20.
   * @nullable
   */
  declare kategorieCode?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Quelle Id.
   * @nullable
   */
  declare quelleId?: DeserializedType<T, 'Edm.Guid'> | null;
  /**
   * Ist Top Witz.
   * @nullable
   */
  declare istTopWitz?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * One-to-one navigation property to the {@link Kategorien} entity.
   */
  declare kategorie?: Kategorien<T> | null;
  /**
   * One-to-one navigation property to the {@link Quellen} entity.
   */
  declare quelle?: Quellen<T> | null;
  /**
   * One-to-many navigation property to the {@link Witze_Texts} entity.
   */
  declare texts: Witze_Texts<T>[];
  /**
   * One-to-one navigation property to the {@link Witze_Texts} entity.
   */
  declare localized?: Witze_Texts<T> | null;

  constructor(_entityApi: WitzeApi<T>) {
    super(_entityApi);
  }
}

export interface WitzeType<T extends DeSerializers = DefaultDeSerializers> {
  id: DeserializedType<T, 'Edm.Guid'>;
  createdAt?: DeserializedType<T, 'Edm.DateTimeOffset'> | null;
  createdBy?: DeserializedType<T, 'Edm.String'> | null;
  modifiedAt?: DeserializedType<T, 'Edm.DateTimeOffset'> | null;
  modifiedBy?: DeserializedType<T, 'Edm.String'> | null;
  text: DeserializedType<T, 'Edm.String'>;
  apiId?: DeserializedType<T, 'Edm.String'> | null;
  bewertung?: DeserializedType<T, 'Edm.Int32'> | null;
  kategorieCode?: DeserializedType<T, 'Edm.String'> | null;
  quelleId?: DeserializedType<T, 'Edm.Guid'> | null;
  istTopWitz?: DeserializedType<T, 'Edm.Boolean'> | null;
  kategorie?: KategorienType<T> | null;
  quelle?: QuellenType<T> | null;
  texts: Witze_TextsType<T>[];
  localized?: Witze_TextsType<T> | null;
}
