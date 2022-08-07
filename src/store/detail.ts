/*
 * @Description: 详情数据管理
 * @Author: dnh
 * @Date: 2022-06-14 11:44:09
 * @LastEditors: dnh
 * @FilePath: \src\store\detail.ts
 */
import { makeAutoObservable } from 'mobx';

class DetailStore {
  constructor() {
    makeAutoObservable(this);
  }
}

export default new DetailStore();
