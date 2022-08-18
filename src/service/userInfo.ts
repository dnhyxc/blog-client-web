import { post } from '@/utils/request';

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
