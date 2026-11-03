/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import {
  transformReturnValueForEntity,
  DeSerializers,
  DefaultDeSerializers,
  defaultDeSerializers,
  OperationRequestBuilder
} from '@sap-cloud-sdk/odata-v4';
import { witzService } from './service';
import { Witze } from './Witze';
import { WitzeApi } from './WitzeApi';

/**
 * Type of the parameters to be passed to {@link witzAbrufen}.
 */
export interface WitzAbrufenParameters<DeSerializersT extends DeSerializers> {}

/**
 * Witz Abrufen.
 * @param parameters - Object containing all parameters for the action.
 * @returns A request builder that allows to overwrite some of the values and execute the resulting request.
 */
export function witzAbrufen<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
>(
  parameters: WitzAbrufenParameters<DeSerializersT>,
  deSerializers: DeSerializersT = defaultDeSerializers as DeSerializersT
): OperationRequestBuilder<
  DeSerializersT,
  WitzAbrufenParameters<DeSerializersT>,
  Witze | null
> {
  const params = {};

  return new OperationRequestBuilder(
    '/odata/v4/witze',
    'witzAbrufen',
    data =>
      transformReturnValueForEntity(data, witzService(deSerializers).witzeApi),
    params,
    deSerializers,
    'action'
  );
}

export const operations = {
  witzAbrufen
};
