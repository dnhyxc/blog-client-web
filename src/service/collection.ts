import { post } from '@/utils/request';
import * as API from './api';
import { CreateCollectionParams, GetCollectionListParams } from '@/typings/common';

export async function createCollection(params: CreateCollectionParams) {
  const res = await post(API.CREATE_COLLECTION, params);
  return res;
}

export async function getCollectionList(params: GetCollectionListParams) {
  const res = await post(API.GET_COLLECTION_LIST, params);
  return res;
}
