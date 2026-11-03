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
import { Kategorien } from './Kategorien';

/**
 * Request builder class for operations supported on the {@link Kategorien} entity.
 */
export class KategorienRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<Kategorien<T>, T> {
  /**
   * Returns a request builder for querying all `Kategorien` entities.
   * @returns A request builder for creating requests to retrieve all `Kategorien` entities.
   */
  getAll(): GetAllRequestBuilder<Kategorien<T>, T> {
    return new GetAllRequestBuilder<Kategorien<T>, T>(this.entityApi);
  }

  /**
   * Returns a request builder for creating a `Kategorien` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `Kategorien`.
   */
  create(entity: Kategorien<T>): CreateRequestBuilder<Kategorien<T>, T> {
    return new CreateRequestBuilder<Kategorien<T>, T>(this.entityApi, entity);
  }

  /**
   * Returns a request builder for retrieving one `Kategorien` entity based on its keys.
   * @param code Key property. See {@link Kategorien.code}.
   * @returns A request builder for creating requests to retrieve one `Kategorien` entity based on its keys.
   */
  getByKey(
    code: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<Kategorien<T>, T> {
    return new GetByKeyRequestBuilder<Kategorien<T>, T>(this.entityApi, {
      code: code
    });
  }

  /**
   * Returns a request builder for updating an entity of type `Kategorien`.
   * @param entity The entity to be updated
   * @returns A request builder for creating requests that update an entity of type `Kategorien`.
   */
  update(entity: Kategorien<T>): UpdateRequestBuilder<Kategorien<T>, T> {
    return new UpdateRequestBuilder<Kategorien<T>, T>(this.entityApi, entity);
  }

  /**
   * Returns a request builder for deleting an entity of type `Kategorien`.
   * @param code Key property. See {@link Kategorien.code}.
   * @returns A request builder for creating requests that delete an entity of type `Kategorien`.
   */
  delete(code: string): DeleteRequestBuilder<Kategorien<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `Kategorien`.
   * @param entity Pass the entity to be deleted.
   * @returns A request builder for creating requests that delete an entity of type `Kategorien` by taking the entity as a parameter.
   */
  delete(entity: Kategorien<T>): DeleteRequestBuilder<Kategorien<T>, T>;
  delete(codeOrEntity: any): DeleteRequestBuilder<Kategorien<T>, T> {
    return new DeleteRequestBuilder<Kategorien<T>, T>(
      this.entityApi,
      codeOrEntity instanceof Kategorien
        ? codeOrEntity
        : { code: codeOrEntity! }
    );
  }
}
