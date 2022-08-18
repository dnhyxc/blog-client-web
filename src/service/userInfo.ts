import { post } from '@/utils/request';
import * as API from './api';

export async function getMyArticleList(
  params: {
    pageNo?: number;
    pageSize?: number;
    userId: string;
    accessUserId?: string;
  },
  path: string
) {
  const res = await post(path, params);
  return res;
}

export async function getAuthorArticleList(
  params: {
    pageNo?: number;
    pageSize?: number;
    accessUserId?: string;
  },
  path: string
) {
  const res = await post(path, params);
  return res;
}

export async function getAuthorTimeline(params: { accessUserId?: string }) {
  const res = await post(API.GET_AUTHOR_TIMELINE, params);
  return res;
}
