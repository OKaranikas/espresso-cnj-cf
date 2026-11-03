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
import { Witze_Texts } from './Witze_Texts';

/**
 * Request builder class for operations supported on the {@link Witze_Texts} entity.
 */
export class Witze_TextsRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<Witze_Texts<T>, T> {
  /**
   * Returns a request builder for querying all `Witze_Texts` entities.
   * @returns A request builder for creating requests to retrieve all `Witze_Texts` entities.
   */
  getAll(): GetAllRequestBuilder<Witze_Texts<T>, T> {
    return new GetAllRequestBuilder<Witze_Texts<T>, T>(this.entityApi);
  }

  /**
   * Returns a request builder for creating a `Witze_Texts` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `Witze_Texts`.
   */
  create(entity: Witze_Texts<T>): CreateRequestBuilder<Witze_Texts<T>, T> {
    return new CreateRequestBuilder<Witze_Texts<T>, T>(this.entityApi, entity);
  }

  /**
   * Returns a request builder for retrieving one `Witze_Texts` entity based on its keys.
   * @param locale Key property. See {@link Witze_Texts.locale}.
   * @param id Key property. See {@link Witze_Texts.id}.
   * @returns A request builder for creating requests to retrieve one `Witze_Texts` entity based on its keys.
   */
  getByKey(
    locale: DeserializedType<T, 'Edm.String'>,
    id: DeserializedType<T, 'Edm.Guid'>
  ): GetByKeyRequestBuilder<Witze_Texts<T>, T> {
    return new GetByKeyRequestBuilder<Witze_Texts<T>, T>(this.entityApi, {
      locale: locale,
      ID: id
    });
  }

  /**
   * Returns a request builder for updating an entity of type `Witze_Texts`.
   * @param entity The entity to be updated
   * @returns A request builder for creating requests that update an entity of type `Witze_Texts`.
   */
  update(entity: Witze_Texts<T>): UpdateRequestBuilder<Witze_Texts<T>, T> {
    return new UpdateRequestBuilder<Witze_Texts<T>, T>(this.entityApi, entity);
  }

  /**
   * Returns a request builder for deleting an entity of type `Witze_Texts`.
   * @param locale Key property. See {@link Witze_Texts.locale}.
   * @param id Key property. See {@link Witze_Texts.id}.
   * @returns A request builder for creating requests that delete an entity of type `Witze_Texts`.
   */
  delete(locale: string, id: string): DeleteRequestBuilder<Witze_Texts<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `Witze_Texts`.
   * @param entity Pass the entity to be deleted.
   * @returns A request builder for creating requests that delete an entity of type `Witze_Texts` by taking the entity as a parameter.
   */
  delete(entity: Witze_Texts<T>): DeleteRequestBuilder<Witze_Texts<T>, T>;
  delete(
    localeOrEntity: any,
    id?: string
  ): DeleteRequestBuilder<Witze_Texts<T>, T> {
    return new DeleteRequestBuilder<Witze_Texts<T>, T>(
      this.entityApi,
      localeOrEntity instanceof Witze_Texts
        ? localeOrEntity
        : {
            locale: localeOrEntity!,
            ID: id!
          }
    );
  }
}
