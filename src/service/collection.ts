import { post } from '@/utils/request';
import * as API from './api';
import { CreateCollectionParams } from '@/typings/common';

export async function createCollection(params: CreateCollectionParams) {
  const res = await post(API.CREATE_COLLECTION, params);
  return res;
}
