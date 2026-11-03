/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import { Witze } from './Witze';
import { WitzeRequestBuilder } from './WitzeRequestBuilder';
import { KategorienApi } from './KategorienApi';
import { QuellenApi } from './QuellenApi';
import { Witze_TextsApi } from './Witze_TextsApi';
import {
  CustomField,
  defaultDeSerializers,
  DefaultDeSerializers,
  DeSerializers,
  AllFields,
  entityBuilder,
  EntityBuilderType,
  EntityApi,
  FieldBuilder,
  OrderableEdmTypeField,
  OneToOneLink,
  OneToManyLink
} from '@sap-cloud-sdk/odata-v4';
export class WitzeApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<Witze<DeSerializersT>, DeSerializersT> {
  public deSerializers: DeSerializersT;

  private constructor(
    deSerializers: DeSerializersT = defaultDeSerializers as any
  ) {
    this.deSerializers = deSerializers;
  }

  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  public static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(
    deSerializers: DeSerializersT = defaultDeSerializers as any
  ): WitzeApi<DeSerializersT> {
    return new WitzeApi(deSerializers);
  }

  private navigationPropertyFields!: {
    /**
     * Static representation of the one-to-one navigation property {@link kategorie} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    KATEGORIE: OneToOneLink<
      Witze<DeSerializersT>,
      DeSerializersT,
      KategorienApi<DeSerializersT>
    >;
    /**
     * Static representation of the one-to-one navigation property {@link quelle} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    QUELLE: OneToOneLink<
      Witze<DeSerializersT>,
      DeSerializersT,
      QuellenApi<DeSerializersT>
    >;
    /**
     * Static representation of the one-to-many navigation property {@link texts} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    TEXTS: OneToManyLink<
      Witze<DeSerializersT>,
      DeSerializersT,
      Witze_TextsApi<DeSerializersT>
    >;
    /**
     * Static representation of the one-to-one navigation property {@link localized} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    LOCALIZED: OneToOneLink<
      Witze<DeSerializersT>,
      DeSerializersT,
      Witze_TextsApi<DeSerializersT>
    >;
  };

  _addNavigationProperties(
    linkedApis: [
      KategorienApi<DeSerializersT>,
      QuellenApi<DeSerializersT>,
      Witze_TextsApi<DeSerializersT>,
      Witze_TextsApi<DeSerializersT>
    ]
  ): this {
    this.navigationPropertyFields = {
      KATEGORIE: new OneToOneLink('kategorie', this, linkedApis[0]),
      QUELLE: new OneToOneLink('quelle', this, linkedApis[1]),
      TEXTS: new OneToManyLink('texts', this, linkedApis[2]),
      LOCALIZED: new OneToOneLink('localized', this, linkedApis[3])
    };
    return this;
  }

  entityConstructor = Witze;

  requestBuilder(): WitzeRequestBuilder<DeSerializersT> {
    return new WitzeRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<Witze<DeSerializersT>, DeSerializersT> {
    return entityBuilder<Witze<DeSerializersT>, DeSerializersT>(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<Witze<DeSerializersT>, DeSerializersT, NullableT> {
    return new CustomField(
      fieldName,
      this.entityConstructor,
      this.deSerializers,
      isNullable
    ) as any;
  }

  private _fieldBuilder?: FieldBuilder<typeof Witze, DeSerializersT>;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(Witze, this.deSerializers);
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    ID: OrderableEdmTypeField<
      Witze<DeSerializers>,
      DeSerializersT,
      'Edm.Guid',
      false,
      true
    >;
    CREATED_AT: OrderableEdmTypeField<
      Witze<DeSerializers>,
      DeSerializersT,
      'Edm.DateTimeOffset',
      true,
      true
    >;
    CREATED_BY: OrderableEdmTypeField<
      Witze<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    MODIFIED_AT: OrderableEdmTypeField<
      Witze<DeSerializers>,
      DeSerializersT,
      'Edm.DateTimeOffset',
      true,
      true
    >;
    MODIFIED_BY: OrderableEdmTypeField<
      Witze<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    TEXT: OrderableEdmTypeField<
      Witze<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    API_ID: OrderableEdmTypeField<
      Witze<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    BEWERTUNG: OrderableEdmTypeField<
      Witze<DeSerializers>,
      DeSerializersT,
      'Edm.Int32',
      true,
      true
    >;
    KATEGORIE_CODE: OrderableEdmTypeField<
      Witze<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    QUELLE_ID: OrderableEdmTypeField<
      Witze<DeSerializers>,
      DeSerializersT,
      'Edm.Guid',
      true,
      true
    >;
    IST_TOP_WITZ: OrderableEdmTypeField<
      Witze<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    /**
     * Static representation of the one-to-one navigation property {@link kategorie} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    KATEGORIE: OneToOneLink<
      Witze<DeSerializersT>,
      DeSerializersT,
      KategorienApi<DeSerializersT>
    >;
    /**
     * Static representation of the one-to-one navigation property {@link quelle} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    QUELLE: OneToOneLink<
      Witze<DeSerializersT>,
      DeSerializersT,
      QuellenApi<DeSerializersT>
    >;
    /**
     * Static representation of the one-to-many navigation property {@link texts} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    TEXTS: OneToManyLink<
      Witze<DeSerializersT>,
      DeSerializersT,
      Witze_TextsApi<DeSerializersT>
    >;
    /**
     * Static representation of the one-to-one navigation property {@link localized} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    LOCALIZED: OneToOneLink<
      Witze<DeSerializersT>,
      DeSerializersT,
      Witze_TextsApi<DeSerializersT>
    >;
    ALL_FIELDS: AllFields<Witze<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link id} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ID: fieldBuilder.buildEdmTypeField('ID', 'Edm.Guid', false),
        /**
         * Static representation of the {@link createdAt} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CREATED_AT: fieldBuilder.buildEdmTypeField(
          'createdAt',
          'Edm.DateTimeOffset',
          true,
          7
        ),
        /**
         * Static representation of the {@link createdBy} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CREATED_BY: fieldBuilder.buildEdmTypeField(
          'createdBy',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link modifiedAt} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        MODIFIED_AT: fieldBuilder.buildEdmTypeField(
          'modifiedAt',
          'Edm.DateTimeOffset',
          true,
          7
        ),
        /**
         * Static representation of the {@link modifiedBy} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        MODIFIED_BY: fieldBuilder.buildEdmTypeField(
          'modifiedBy',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link text} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        TEXT: fieldBuilder.buildEdmTypeField('text', 'Edm.String', false),
        /**
         * Static representation of the {@link apiId} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        API_ID: fieldBuilder.buildEdmTypeField('apiId', 'Edm.String', true),
        /**
         * Static representation of the {@link bewertung} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        BEWERTUNG: fieldBuilder.buildEdmTypeField(
          'bewertung',
          'Edm.Int32',
          true
        ),
        /**
         * Static representation of the {@link kategorieCode} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        KATEGORIE_CODE: fieldBuilder.buildEdmTypeField(
          'kategorie_code',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link quelleId} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        QUELLE_ID: fieldBuilder.buildEdmTypeField(
          'quelle_ID',
          'Edm.Guid',
          true
        ),
        /**
         * Static representation of the {@link istTopWitz} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        IST_TOP_WITZ: fieldBuilder.buildEdmTypeField(
          'istTopWitz',
          'Edm.Boolean',
          true
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', Witze)
      };
    }

    return this._schema;
  }
}
