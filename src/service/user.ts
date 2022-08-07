import { post, put } from '@/utils/request';
import * as API from './api';

export interface LoginParams {
  username?: string;
  password?: string;
}

export async function register(params: LoginParams) {
  const res = await post(API.REGISTER, params);
  return res;
}

export async function login(params: LoginParams) {
  const res = await post(API.LOGIN, params);
  return res;
}

export async function updateInfo(params: LoginParams) {
  const res = await put(API.UPDATE_INFO, params);
  return res;
}
