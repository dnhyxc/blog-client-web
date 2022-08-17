import { makeAutoObservable } from 'mobx';
import { decrypt } from '@/utils';
import { LoginData } from '@/typings/common';

class UserInfo {
  constructor() {
    makeAutoObservable(this);
  }

  userInfo = {
    userId: '',
    username: '',
    job: '',
    motto: '',
    introduce: '',
    headUrl: '',
    github: '',
    juejin: '',
    zhihu: '',
    blog: '',
    mainCover: '',
    auth: 0,
  };

  setUserInfo(values: LoginData) {
    localStorage.setItem('userInfo', JSON.stringify(values));
    this.userInfo = { ...this.userInfo, ...values };
  }

  get getUserInfo() {
    const storageInfo = localStorage.getItem('userInfo');
    const userInfo = storageInfo && JSON.parse(storageInfo);
    const decryptInfo = {
      ...userInfo,
      username: (userInfo?.username && decrypt(userInfo?.username)) || userInfo?.useranme,
    };
    this.userInfo = decryptInfo;
    return this.userInfo;
  }
}

export default new UserInfo();
