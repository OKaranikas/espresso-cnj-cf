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
import { Quellen } from './Quellen';

/**
 * Request builder class for operations supported on the {@link Quellen} entity.
 */
export class QuellenRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<Quellen<T>, T> {
  /**
   * Returns a request builder for querying all `Quellen` entities.
   * @returns A request builder for creating requests to retrieve all `Quellen` entities.
   */
  getAll(): GetAllRequestBuilder<Quellen<T>, T> {
    return new GetAllRequestBuilder<Quellen<T>, T>(this.entityApi);
  }

  /**
   * Returns a request builder for creating a `Quellen` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `Quellen`.
   */
  create(entity: Quellen<T>): CreateRequestBuilder<Quellen<T>, T> {
    return new CreateRequestBuilder<Quellen<T>, T>(this.entityApi, entity);
  }

  /**
   * Returns a request builder for retrieving one `Quellen` entity based on its keys.
   * @param id Key property. See {@link Quellen.id}.
   * @returns A request builder for creating requests to retrieve one `Quellen` entity based on its keys.
   */
  getByKey(
    id: DeserializedType<T, 'Edm.Guid'>
  ): GetByKeyRequestBuilder<Quellen<T>, T> {
    return new GetByKeyRequestBuilder<Quellen<T>, T>(this.entityApi, {
      ID: id
    });
  }

  /**
   * Returns a request builder for updating an entity of type `Quellen`.
   * @param entity The entity to be updated
   * @returns A request builder for creating requests that update an entity of type `Quellen`.
   */
  update(entity: Quellen<T>): UpdateRequestBuilder<Quellen<T>, T> {
    return new UpdateRequestBuilder<Quellen<T>, T>(this.entityApi, entity);
  }

  /**
   * Returns a request builder for deleting an entity of type `Quellen`.
   * @param id Key property. See {@link Quellen.id}.
   * @returns A request builder for creating requests that delete an entity of type `Quellen`.
   */
  delete(id: string): DeleteRequestBuilder<Quellen<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `Quellen`.
   * @param entity Pass the entity to be deleted.
   * @returns A request builder for creating requests that delete an entity of type `Quellen` by taking the entity as a parameter.
   */
  delete(entity: Quellen<T>): DeleteRequestBuilder<Quellen<T>, T>;
  delete(idOrEntity: any): DeleteRequestBuilder<Quellen<T>, T> {
    return new DeleteRequestBuilder<Quellen<T>, T>(
      this.entityApi,
      idOrEntity instanceof Quellen ? idOrEntity : { ID: idOrEntity! }
    );
  }
}
