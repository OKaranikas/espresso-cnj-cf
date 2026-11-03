/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import { WitzeApi } from './WitzeApi';
import { QuellenApi } from './QuellenApi';
import { KategorienApi } from './KategorienApi';
import { StatistikApi } from './StatistikApi';
import { Witze_TextsApi } from './Witze_TextsApi';
import { Kategorien_TextsApi } from './Kategorien_TextsApi';
import { witzAbrufen, WitzAbrufenParameters } from './operations';
import BigNumber from 'bignumber.js';
import { Moment, Duration } from 'moment';
import {
  defaultDeSerializers,
  DeSerializers,
  DefaultDeSerializers,
  mergeDefaultDeSerializersWith,
  Time
} from '@sap-cloud-sdk/odata-v4';
import { batch, changeset } from './BatchRequest';

export function witzService<
  BinaryT = string,
  BooleanT = boolean,
  ByteT = number,
  DecimalT = BigNumber,
  DoubleT = number,
  FloatT = number,
  Int16T = number,
  Int32T = number,
  Int64T = BigNumber,
  GuidT = string,
  SByteT = number,
  SingleT = number,
  StringT = string,
  AnyT = any,
  DateTimeOffsetT = Moment,
  DateT = Moment,
  DurationT = Duration,
  TimeOfDayT = Time,
  EnumT = any
>(
  deSerializers: Partial<
    DeSerializers<
      BinaryT,
      BooleanT,
      ByteT,
      DecimalT,
      DoubleT,
      FloatT,
      Int16T,
      Int32T,
      Int64T,
      GuidT,
      SByteT,
      SingleT,
      StringT,
      AnyT,
      DateTimeOffsetT,
      DateT,
      DurationT,
      TimeOfDayT,
      EnumT
    >
  > = defaultDeSerializers as any
): WitzService<
  DeSerializers<
    BinaryT,
    BooleanT,
    ByteT,
    DecimalT,
    DoubleT,
    FloatT,
    Int16T,
    Int32T,
    Int64T,
    GuidT,
    SByteT,
    SingleT,
    StringT,
    AnyT,
    DateTimeOffsetT,
    DateT,
    DurationT,
    TimeOfDayT,
    EnumT
  >
> {
  return new WitzService(mergeDefaultDeSerializersWith(deSerializers));
}
class WitzService<DeSerializersT extends DeSerializers = DefaultDeSerializers> {
  private apis: Record<string, any> = {};
  private deSerializers: DeSerializersT;

  constructor(deSerializers: DeSerializersT) {
    this.deSerializers = deSerializers;
  }

  private initApi(key: string, entityApi: any): any {
    if (!this.apis[key]) {
      this.apis[key] = entityApi._privateFactory(this.deSerializers);
    }
    return this.apis[key];
  }

  get witzeApi(): WitzeApi<DeSerializersT> {
    const api = this.initApi('witzeApi', WitzeApi);
    const linkedApis = [
      this.initApi('kategorienApi', KategorienApi),
      this.initApi('quellenApi', QuellenApi),
      this.initApi('witze_TextsApi', Witze_TextsApi),
      this.initApi('witze_TextsApi', Witze_TextsApi)
    ];
    api._addNavigationProperties(linkedApis);
    return api;
  }

  get quellenApi(): QuellenApi<DeSerializersT> {
    const api = this.initApi('quellenApi', QuellenApi);
    const linkedApis = [this.initApi('witzeApi', WitzeApi)];
    api._addNavigationProperties(linkedApis);
    return api;
  }

  get kategorienApi(): KategorienApi<DeSerializersT> {
    const api = this.initApi('kategorienApi', KategorienApi);
    const linkedApis = [
      this.initApi('kategorien_TextsApi', Kategorien_TextsApi),
      this.initApi('kategorien_TextsApi', Kategorien_TextsApi)
    ];
    api._addNavigationProperties(linkedApis);
    return api;
  }

  get statistikApi(): StatistikApi<DeSerializersT> {
    return this.initApi('statistikApi', StatistikApi);
  }

  get witze_TextsApi(): Witze_TextsApi<DeSerializersT> {
    return this.initApi('witze_TextsApi', Witze_TextsApi);
  }

  get kategorien_TextsApi(): Kategorien_TextsApi<DeSerializersT> {
    return this.initApi('kategorien_TextsApi', Kategorien_TextsApi);
  }

  get operations() {
    return {
      witzAbrufen: (parameter: WitzAbrufenParameters<DeSerializersT>) =>
        witzAbrufen(parameter, this.deSerializers)
    };
  }

  get batch(): typeof batch {
    return batch;
  }

  get changeset(): typeof changeset {
    return changeset;
  }
}
