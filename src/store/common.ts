import { makeAutoObservable } from 'mobx';

export interface Auth {
  token?: string;
  isAdmin?: boolean;
  redirectUrl?: string;
  hasAuth?: boolean;
  noLogin?: boolean;
}

class CommonStore {
  constructor() {
    makeAutoObservable(this);
  }

  auth: Auth = {
    token: '',
    isAdmin: false,
    hasAuth: false,
    redirectUrl: '',
    noLogin: false,
  };

  setAuth(value: Auth) {
    this.auth = { ...this.auth, ...value };
  }
}

export default new CommonStore();
