import { post } from '@/utils/request';
import * as API from './api';

export async function uploadFile(params?: { file: File }) {
  const res = await post(API.UPDATE_INFO, params, true);
  return res;
}
