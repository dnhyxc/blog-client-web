import { post, put } from '@/utils/request';
import {
  UserInfoParams,
  LoginParams,
  GetUserInfoParams,
  ResetPasswordParams,
} from '@/typings/common';
import * as API from './api';

export async function register(params: LoginParams) {
  const res = await post(API.REGISTER, params);
  return res;
}

export async function login(params: LoginParams) {
  const res = await post(API.LOGIN, params);
  return res;
}

export async function updateInfo(params: UserInfoParams, path: string) {
  const res = await put(path, params);
  return res;
}

export async function updatePassword(params: UserInfoParams) {
  const res = await put(API.UPDATE_PASSWORD, params);
  return res;
}

export async function resetPassword(params: ResetPasswordParams) {
  const res = await put(API.RESET_PASSWORD, params);
  return res;
}

export async function getUserInfo(params: GetUserInfoParams) {
  const res = await post(API.GET_USER_INFO, params);
  return res;
}

export async function verify() {
  const res = await post(API.VERIFY);
  return res;
}
