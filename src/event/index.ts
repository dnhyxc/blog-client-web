import { Dispatcher } from './dispatcher';

class Event {
  static instance: Event;

  onToggleSider: Dispatcher;

  onSetCommentCount: Dispatcher;

  siderVisible: boolean;

  commentNum: number;

  constructor() {
    this.siderVisible = false;
    this.commentNum = 0;
    this.onToggleSider = new Dispatcher();
    this.onSetCommentCount = new Dispatcher();
  }

  // 单例模式
  static getInstance() {
    if (!this.instance) {
      this.instance = new Event();
    }
    return this.instance;
  }

  get visible() {
    return this.siderVisible;
  }

  // 返回评论评论数
  get commentCount() {
    return this.commentNum;
  }

  // 菜单切换
  toggle(value: boolean) {
    this.siderVisible = value;
    this.onToggleSider.emit(this);
  }

  // 获取评论数
  getCommentNum(comments: number) {
    this.commentNum = comments;
    this.onSetCommentCount.emit(this);
  }
}

export const EventBus = Event.getInstance();
