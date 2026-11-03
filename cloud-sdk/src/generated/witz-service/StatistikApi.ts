/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import { Statistik } from './Statistik';
import { StatistikRequestBuilder } from './StatistikRequestBuilder';
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
export class StatistikApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<Statistik<DeSerializersT>, DeSerializersT> {
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
  ): StatistikApi<DeSerializersT> {
    return new StatistikApi(deSerializers);
  }

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
    return this;
  }

  entityConstructor = Statistik;

  requestBuilder(): StatistikRequestBuilder<DeSerializersT> {
    return new StatistikRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<
    Statistik<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<Statistik<DeSerializersT>, DeSerializersT>(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<Statistik<DeSerializersT>, DeSerializersT, NullableT> {
    return new CustomField(
      fieldName,
      this.entityConstructor,
      this.deSerializers,
      isNullable
    ) as any;
  }

  private _fieldBuilder?: FieldBuilder<typeof Statistik, DeSerializersT>;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(Statistik, this.deSerializers);
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    QUELLE_ID: OrderableEdmTypeField<
      Statistik<DeSerializers>,
      DeSerializersT,
      'Edm.Guid',
      false,
      true
    >;
    ANZAHL: OrderableEdmTypeField<
      Statistik<DeSerializers>,
      DeSerializersT,
      'Edm.Int64',
      true,
      true
    >;
    DURCHSCHNITTSBEWERTUNG: OrderableEdmTypeField<
      Statistik<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      true,
      true
    >;
    ALL_FIELDS: AllFields<Statistik<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link quelleId} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        QUELLE_ID: fieldBuilder.buildEdmTypeField(
          'quelle_ID',
          'Edm.Guid',
          false
        ),
        /**
         * Static representation of the {@link anzahl} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ANZAHL: fieldBuilder.buildEdmTypeField('anzahl', 'Edm.Int64', true),
        /**
         * Static representation of the {@link durchschnittsbewertung} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DURCHSCHNITTSBEWERTUNG: fieldBuilder.buildEdmTypeField(
          'durchschnittsbewertung',
          'Edm.Decimal',
          true
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', Statistik)
      };
    }

    return this._schema;
  }
}
