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
import { Kategorien_Texts } from './Kategorien_Texts';

/**
 * Request builder class for operations supported on the {@link Kategorien_Texts} entity.
 */
export class Kategorien_TextsRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<Kategorien_Texts<T>, T> {
  /**
   * Returns a request builder for querying all `Kategorien_Texts` entities.
   * @returns A request builder for creating requests to retrieve all `Kategorien_Texts` entities.
   */
  getAll(): GetAllRequestBuilder<Kategorien_Texts<T>, T> {
    return new GetAllRequestBuilder<Kategorien_Texts<T>, T>(this.entityApi);
  }

  /**
   * Returns a request builder for creating a `Kategorien_Texts` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `Kategorien_Texts`.
   */
  create(
    entity: Kategorien_Texts<T>
  ): CreateRequestBuilder<Kategorien_Texts<T>, T> {
    return new CreateRequestBuilder<Kategorien_Texts<T>, T>(
      this.entityApi,
      entity
    );
  }

  /**
   * Returns a request builder for retrieving one `Kategorien_Texts` entity based on its keys.
   * @param locale Key property. See {@link Kategorien_Texts.locale}.
   * @param code Key property. See {@link Kategorien_Texts.code}.
   * @returns A request builder for creating requests to retrieve one `Kategorien_Texts` entity based on its keys.
   */
  getByKey(
    locale: DeserializedType<T, 'Edm.String'>,
    code: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<Kategorien_Texts<T>, T> {
    return new GetByKeyRequestBuilder<Kategorien_Texts<T>, T>(this.entityApi, {
      locale: locale,
      code: code
    });
  }

  /**
   * Returns a request builder for updating an entity of type `Kategorien_Texts`.
   * @param entity The entity to be updated
   * @returns A request builder for creating requests that update an entity of type `Kategorien_Texts`.
   */
  update(
    entity: Kategorien_Texts<T>
  ): UpdateRequestBuilder<Kategorien_Texts<T>, T> {
    return new UpdateRequestBuilder<Kategorien_Texts<T>, T>(
      this.entityApi,
      entity
    );
  }

  /**
   * Returns a request builder for deleting an entity of type `Kategorien_Texts`.
   * @param locale Key property. See {@link Kategorien_Texts.locale}.
   * @param code Key property. See {@link Kategorien_Texts.code}.
   * @returns A request builder for creating requests that delete an entity of type `Kategorien_Texts`.
   */
  delete(
    locale: string,
    code: string
  ): DeleteRequestBuilder<Kategorien_Texts<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `Kategorien_Texts`.
   * @param entity Pass the entity to be deleted.
   * @returns A request builder for creating requests that delete an entity of type `Kategorien_Texts` by taking the entity as a parameter.
   */
  delete(
    entity: Kategorien_Texts<T>
  ): DeleteRequestBuilder<Kategorien_Texts<T>, T>;
  delete(
    localeOrEntity: any,
    code?: string
  ): DeleteRequestBuilder<Kategorien_Texts<T>, T> {
    return new DeleteRequestBuilder<Kategorien_Texts<T>, T>(
      this.entityApi,
      localeOrEntity instanceof Kategorien_Texts
        ? localeOrEntity
        : {
            locale: localeOrEntity!,
            code: code!
          }
    );
  }
}
