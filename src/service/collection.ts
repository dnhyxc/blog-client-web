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

export async function collectArticles(params: {
  ids: string[];
  articleId: string;
  userId: string;
}) {
  const res = await post(API.COLLECT_ARTICLES, params);
  return res;
}

export async function checkCollectionStatus(params: { articleId: string; userId: string }) {
  const res = await post(API.CHECK_COLLECTION_STATUS, params);
  return res;
}

export async function cancelCollected(params: { articleId: string; userId: string }) {
  const res = await post(API.CANCEL_COLLECTED, params);
  return res;
}

export async function getCollectedTotal(params: { userId: string }) {
  const res = await post(API.GET_COLLECTED_TOTAL, params);
  return res;
}

export async function delCollection(params: { id: string; userId?: string }) {
  const res = await post(API.DEL_COLLECTION, params);
  return res;
}
