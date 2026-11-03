/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import {
  CreateRequestBuilder,
  DeleteRequestBuilder,
  DeSerializers,
  GetAllRequestBuilder,
  GetByKeyRequestBuilder,
  ODataBatchRequestBuilder,
  UpdateRequestBuilder,
  OperationRequestBuilder,
  BatchChangeSet
} from '@sap-cloud-sdk/odata-v4';
import { transformVariadicArgumentToArray } from '@sap-cloud-sdk/util';
import {
  Witze,
  Quellen,
  Kategorien,
  Statistik,
  Witze_Texts,
  Kategorien_Texts,
  WitzAbrufenParameters
} from './index';

/**
 * Batch builder for operations supported on the Witz Service.
 * @param requests The requests of the batch.
 * @returns A request builder for batch.
 */
export function batch<DeSerializersT extends DeSerializers>(
  ...requests: Array<
    | ReadWitzServiceRequestBuilder<DeSerializersT>
    | BatchChangeSet<DeSerializersT>
  >
): ODataBatchRequestBuilder<DeSerializersT>;
export function batch<DeSerializersT extends DeSerializers>(
  requests: Array<
    | ReadWitzServiceRequestBuilder<DeSerializersT>
    | BatchChangeSet<DeSerializersT>
  >
): ODataBatchRequestBuilder<DeSerializersT>;
export function batch<DeSerializersT extends DeSerializers>(
  first:
    | undefined
    | ReadWitzServiceRequestBuilder<DeSerializersT>
    | BatchChangeSet<DeSerializersT>
    | Array<
        | ReadWitzServiceRequestBuilder<DeSerializersT>
        | BatchChangeSet<DeSerializersT>
      >,
  ...rest: Array<
    | ReadWitzServiceRequestBuilder<DeSerializersT>
    | BatchChangeSet<DeSerializersT>
  >
): ODataBatchRequestBuilder<DeSerializersT> {
  return new ODataBatchRequestBuilder(
    defaultWitzServicePath,
    transformVariadicArgumentToArray(first, rest)
  );
}

/**
 * Change set constructor consists of write operations supported on the Witz Service.
 * @param requests The requests of the change set.
 * @returns A change set for batch.
 */
export function changeset<DeSerializersT extends DeSerializers>(
  ...requests: Array<WriteWitzServiceRequestBuilder<DeSerializersT>>
): BatchChangeSet<DeSerializersT>;
export function changeset<DeSerializersT extends DeSerializers>(
  requests: Array<WriteWitzServiceRequestBuilder<DeSerializersT>>
): BatchChangeSet<DeSerializersT>;
export function changeset<DeSerializersT extends DeSerializers>(
  first:
    | undefined
    | WriteWitzServiceRequestBuilder<DeSerializersT>
    | Array<WriteWitzServiceRequestBuilder<DeSerializersT>>,
  ...rest: Array<WriteWitzServiceRequestBuilder<DeSerializersT>>
): BatchChangeSet<DeSerializersT> {
  return new BatchChangeSet(transformVariadicArgumentToArray(first, rest));
}

export const defaultWitzServicePath = '/odata/v4/witze';
export type ReadWitzServiceRequestBuilder<
  DeSerializersT extends DeSerializers
> =
  | GetAllRequestBuilder<Witze<DeSerializersT>, DeSerializersT>
  | GetAllRequestBuilder<Quellen<DeSerializersT>, DeSerializersT>
  | GetAllRequestBuilder<Kategorien<DeSerializersT>, DeSerializersT>
  | GetAllRequestBuilder<Statistik<DeSerializersT>, DeSerializersT>
  | GetAllRequestBuilder<Witze_Texts<DeSerializersT>, DeSerializersT>
  | GetAllRequestBuilder<Kategorien_Texts<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<Witze<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<Quellen<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<Kategorien<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<Statistik<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<Witze_Texts<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<Kategorien_Texts<DeSerializersT>, DeSerializersT>;
export type WriteWitzServiceRequestBuilder<
  DeSerializersT extends DeSerializers
> =
  | CreateRequestBuilder<Witze<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<Witze<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<Witze<DeSerializersT>, DeSerializersT>
  | CreateRequestBuilder<Quellen<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<Quellen<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<Quellen<DeSerializersT>, DeSerializersT>
  | CreateRequestBuilder<Kategorien<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<Kategorien<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<Kategorien<DeSerializersT>, DeSerializersT>
  | CreateRequestBuilder<Statistik<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<Statistik<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<Statistik<DeSerializersT>, DeSerializersT>
  | CreateRequestBuilder<Witze_Texts<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<Witze_Texts<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<Witze_Texts<DeSerializersT>, DeSerializersT>
  | CreateRequestBuilder<Kategorien_Texts<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<Kategorien_Texts<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<Kategorien_Texts<DeSerializersT>, DeSerializersT>
  | OperationRequestBuilder<
      DeSerializersT,
      WitzAbrufenParameters<DeSerializersT>,
      Witze | null
    >;
