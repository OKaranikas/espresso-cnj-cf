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
import { Witze } from './Witze';

/**
 * Request builder class for operations supported on the {@link Witze} entity.
 */
export class WitzeRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<Witze<T>, T> {
  /**
   * Returns a request builder for querying all `Witze` entities.
   * @returns A request builder for creating requests to retrieve all `Witze` entities.
   */
  getAll(): GetAllRequestBuilder<Witze<T>, T> {
    return new GetAllRequestBuilder<Witze<T>, T>(this.entityApi);
  }

  /**
   * Returns a request builder for creating a `Witze` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `Witze`.
   */
  create(entity: Witze<T>): CreateRequestBuilder<Witze<T>, T> {
    return new CreateRequestBuilder<Witze<T>, T>(this.entityApi, entity);
  }

  /**
   * Returns a request builder for retrieving one `Witze` entity based on its keys.
   * @param id Key property. See {@link Witze.id}.
   * @returns A request builder for creating requests to retrieve one `Witze` entity based on its keys.
   */
  getByKey(
    id: DeserializedType<T, 'Edm.Guid'>
  ): GetByKeyRequestBuilder<Witze<T>, T> {
    return new GetByKeyRequestBuilder<Witze<T>, T>(this.entityApi, { ID: id });
  }

  /**
   * Returns a request builder for updating an entity of type `Witze`.
   * @param entity The entity to be updated
   * @returns A request builder for creating requests that update an entity of type `Witze`.
   */
  update(entity: Witze<T>): UpdateRequestBuilder<Witze<T>, T> {
    return new UpdateRequestBuilder<Witze<T>, T>(this.entityApi, entity);
  }

  /**
   * Returns a request builder for deleting an entity of type `Witze`.
   * @param id Key property. See {@link Witze.id}.
   * @returns A request builder for creating requests that delete an entity of type `Witze`.
   */
  delete(id: string): DeleteRequestBuilder<Witze<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `Witze`.
   * @param entity Pass the entity to be deleted.
   * @returns A request builder for creating requests that delete an entity of type `Witze` by taking the entity as a parameter.
   */
  delete(entity: Witze<T>): DeleteRequestBuilder<Witze<T>, T>;
  delete(idOrEntity: any): DeleteRequestBuilder<Witze<T>, T> {
    return new DeleteRequestBuilder<Witze<T>, T>(
      this.entityApi,
      idOrEntity instanceof Witze ? idOrEntity : { ID: idOrEntity! }
    );
  }
}
