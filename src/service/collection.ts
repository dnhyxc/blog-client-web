import { post } from '@/utils/request';
import * as API from './api';
import {
  CreateCollectionParams,
  GetCollectionListParams,
  getCollectArticlesParams,
} from '@/typings/common';

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

export async function getCollectedTotal(params: { userId: string; status: number }) {
  const res = await post(API.GET_COLLECTED_TOTAL, params);
  return res;
}

export async function delCollection(params: {
  id: string;
  userId?: string;
  pageNo?: number;
  pageSize?: number;
}) {
  const res = await post(API.DEL_COLLECTION, params);
  return res;
}

export async function updateCollection(params: CreateCollectionParams) {
  const res = await post(API.UPDATE_COLLECTION, params);
  return res;
}

export async function getCollectInfo(params: { id: string }) {
  const res = await post(API.GET_COLLECT_INFO, params);
  return res;
}

export async function getCollectArticles(params: getCollectArticlesParams) {
  const res = await post(API.GET_COLLECT_ARTICLES, params);
  return res;
}

export async function removeCollectArticle(params: {
  articleId: string;
  userId: string;
  id: string; // 收藏集id
}) {
  const res = await post(API.REMOVE_COLLECT_ARTICLE, params);
  return res;
}

export async function getCollectTotal(params: { userId: string; status: number }) {
  const res = await post(API.GET_COLLECT_TOTAL, params);
  return res;
}
