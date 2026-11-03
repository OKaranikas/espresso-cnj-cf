/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import { Witze } from './Witze';
import { WitzeRequestBuilder } from './WitzeRequestBuilder';
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
  OrderableEdmTypeField
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

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
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
    API_ID: OrderableEdmTypeField<
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
    FREIGABE: OrderableEdmTypeField<
      Witze<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
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
         * Static representation of the {@link apiId} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        API_ID: fieldBuilder.buildEdmTypeField('apiId', 'Edm.String', true),
        /**
         * Static representation of the {@link text} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        TEXT: fieldBuilder.buildEdmTypeField('text', 'Edm.String', true),
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
         * Static representation of the {@link freigabe} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        FREIGABE: fieldBuilder.buildEdmTypeField(
          'freigabe',
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
