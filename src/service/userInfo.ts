import { post } from '@/utils/request';
import * as API from './api';

export async function getMyArticleList(
  params: {
    pageNo?: number;
    pageSize?: number;
    userId: string;
  },
  path: string
) {
  const res = await post(path, params);
  return res;
}
