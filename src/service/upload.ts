import { post } from '@/utils/request';
import * as API from './api';

export async function uploadFile(params?: any) {
  const res = await post(API.UPLOAD, params);
  return res;
}

// 删除文件
export const removeFile = async (params: { url: string; userId: string }) => {
  const res = await post(API.REMOVE_FILE, params);
  return res;
};
