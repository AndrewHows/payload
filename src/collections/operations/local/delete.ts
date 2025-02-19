import { TypeWithID } from '../../config/types';
import { Document } from '../../../types';
import { PayloadRequest } from '../../../express/types';
import { Payload } from '../../../index';
import deleteOperation from '../delete';
import { getDataLoader } from '../../dataloader';
import i18n from '../../../translations/init';
import { APIError } from '../../../errors';

export type Options = {
  collection: string
  id: string
  depth?: number
  locale?: string
  fallbackLocale?: string
  user?: Document
  overrideAccess?: boolean
  showHiddenFields?: boolean
}

export default async function deleteLocal<T extends TypeWithID = any>(payload: Payload, options: Options): Promise<T> {
  const {
    collection: collectionSlug,
    depth,
    id,
    locale = null,
    fallbackLocale = null,
    user,
    overrideAccess = true,
    showHiddenFields,
  } = options;

  const collection = payload.collections[collectionSlug];
  const defaultLocale = payload?.config?.localization ? payload?.config?.localization?.defaultLocale : null;


  if (!collection) {
    throw new APIError(`The collection with slug ${collectionSlug} can't be found.`);
  }

  const req = {
    user,
    payloadAPI: 'local',
    locale: locale ?? defaultLocale,
    fallbackLocale: fallbackLocale ?? defaultLocale,
    payload,
    i18n: i18n(payload.config.i18n),
  } as PayloadRequest;

  if (!req.t) req.t = req.i18n.t;
  if (!req.payloadDataLoader) req.payloadDataLoader = getDataLoader(req);

  return deleteOperation({
    depth,
    id,
    collection,
    overrideAccess,
    showHiddenFields,
    req,
  });
}
