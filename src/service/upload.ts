import { post } from '@/utils/request';
import * as API from './api';

export async function uploadFile(params?: any) {
  const res = await post(API.UPLOAD, params);
  return res;
}
