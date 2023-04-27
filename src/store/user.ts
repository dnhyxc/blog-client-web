import { makeAutoObservable } from 'mobx';
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
    sessionStorage.setItem('userInfo', JSON.stringify(values));
    this.userInfo = { ...this.userInfo, ...values };
  }

  get getUserInfo() {
    const storageInfo = sessionStorage.getItem('userInfo');
    const userInfo = storageInfo && JSON.parse(storageInfo);
    this.userInfo = userInfo;
    return this.userInfo;
  }

  clearUserInfo() {
    this.userInfo = {
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
  }
}

export default new UserInfo();
