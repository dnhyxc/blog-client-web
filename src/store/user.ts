import { makeAutoObservable } from 'mobx';
import { decrypt } from '@/utils';

interface UserInfoParams {
  userId: string;
  username: string;
  avatar?: string;
}

class UserInfo {
  constructor() {
    makeAutoObservable(this);
  }

  userInfo = {
    userId: '',
    username: '',
  };

  setUserInfo(values: UserInfoParams) {
    localStorage.setItem('userInfo', JSON.stringify(values));
    this.userInfo = { ...this.userInfo, ...values };
  }

  get getUserInfo() {
    const storageInfo = localStorage.getItem('userInfo');
    const userInfo = storageInfo && JSON.parse(storageInfo);
    const decryptInfo = {
      ...userInfo,
      username: decrypt(userInfo.username) || userInfo.useranme,
    };
    this.userInfo = decryptInfo;
    return this.userInfo;
  }
}

export default new UserInfo();
