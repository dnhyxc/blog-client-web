import { post, put } from '@/utils/request';
import { UserInfoParams, LoginParams } from '@/typings/common';
import * as API from './api';

export async function register(params: LoginParams) {
  const res = await post(API.REGISTER, params);
  return res;
}

export async function login(params: LoginParams) {
  const res = await post(API.LOGIN, params);
  return res;
}

export async function updateInfo(params: UserInfoParams) {
  const res = await put(API.UPDATE_INFO, params);
  return res;
}

export async function getUserInfo(params: { userId: string }) {
  const res = await post(API.GET_USER_INFO, params);
  return res;
}
