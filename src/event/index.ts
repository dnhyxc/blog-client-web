import { storage } from '@/utils';
import { Dispatcher } from './dispatcher';

class Event {
  static instance: Event;

  onToggleSider: Dispatcher;

  onToggleTheme: Dispatcher;

  onSetCommentCount: Dispatcher;

  siderVisible: boolean;

  commentNum: number;

  theme: string;

  constructor() {
    this.siderVisible = false;
    this.commentNum = 0;
    this.theme = (storage.ssnGetItem('theme') as string) || 'light';
    this.onToggleSider = new Dispatcher();
    this.onSetCommentCount = new Dispatcher();
    this.onToggleTheme = new Dispatcher();
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

  // 切换主题
  changeTheme(theme: string) {
    this.theme = theme;
    this.onToggleTheme.emit(this);
  }
}

export const EventBus = Event.getInstance();
