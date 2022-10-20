import { makeAutoObservable } from 'mobx';

class SiderStore {
  constructor() {
    makeAutoObservable(this);
  }

  toggleSider = false;

  onToggleSider(value: boolean) {
    this.toggleSider = value;
  }
}

export default new SiderStore();
