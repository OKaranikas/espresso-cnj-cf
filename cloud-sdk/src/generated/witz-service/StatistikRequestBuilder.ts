/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import {
  CreateRequestBuilder,
  DeSerializers,
  DefaultDeSerializers,
  DeleteRequestBuilder,
  DeserializedType,
  GetAllRequestBuilder,
  GetByKeyRequestBuilder,
  RequestBuilder,
  UpdateRequestBuilder
} from '@sap-cloud-sdk/odata-v4';
import { Statistik } from './Statistik';

/**
 * Request builder class for operations supported on the {@link Statistik} entity.
 */
export class StatistikRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<Statistik<T>, T> {
  /**
   * Returns a request builder for querying all `Statistik` entities.
   * @returns A request builder for creating requests to retrieve all `Statistik` entities.
   */
  getAll(): GetAllRequestBuilder<Statistik<T>, T> {
    return new GetAllRequestBuilder<Statistik<T>, T>(this.entityApi);
  }

  /**
   * Returns a request builder for creating a `Statistik` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `Statistik`.
   */
  create(entity: Statistik<T>): CreateRequestBuilder<Statistik<T>, T> {
    return new CreateRequestBuilder<Statistik<T>, T>(this.entityApi, entity);
  }

  /**
   * Returns a request builder for retrieving one `Statistik` entity based on its keys.
   * @param quelleId Key property. See {@link Statistik.quelleId}.
   * @returns A request builder for creating requests to retrieve one `Statistik` entity based on its keys.
   */
  getByKey(
    quelleId: DeserializedType<T, 'Edm.Guid'>
  ): GetByKeyRequestBuilder<Statistik<T>, T> {
    return new GetByKeyRequestBuilder<Statistik<T>, T>(this.entityApi, {
      quelle_ID: quelleId
    });
  }

  /**
   * Returns a request builder for updating an entity of type `Statistik`.
   * @param entity The entity to be updated
   * @returns A request builder for creating requests that update an entity of type `Statistik`.
   */
  update(entity: Statistik<T>): UpdateRequestBuilder<Statistik<T>, T> {
    return new UpdateRequestBuilder<Statistik<T>, T>(this.entityApi, entity);
  }

  /**
   * Returns a request builder for deleting an entity of type `Statistik`.
   * @param quelleId Key property. See {@link Statistik.quelleId}.
   * @returns A request builder for creating requests that delete an entity of type `Statistik`.
   */
  delete(quelleId: string): DeleteRequestBuilder<Statistik<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `Statistik`.
   * @param entity Pass the entity to be deleted.
   * @returns A request builder for creating requests that delete an entity of type `Statistik` by taking the entity as a parameter.
   */
  delete(entity: Statistik<T>): DeleteRequestBuilder<Statistik<T>, T>;
  delete(quelleIdOrEntity: any): DeleteRequestBuilder<Statistik<T>, T> {
    return new DeleteRequestBuilder<Statistik<T>, T>(
      this.entityApi,
      quelleIdOrEntity instanceof Statistik
        ? quelleIdOrEntity
        : { quelle_ID: quelleIdOrEntity! }
    );
  }
}
