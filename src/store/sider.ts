import { makeAutoObservable } from 'mobx';

class SiderStore {
  constructor() {
    makeAutoObservable(this);
  }

  toggleSider = false;

  onToggleSider(value: boolean) {
    console.log(value, 'vbalue');

    this.toggleSider = value;
  }
}

export default new SiderStore();
