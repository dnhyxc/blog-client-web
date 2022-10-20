import { Dispatcher } from './dispatcher';

class Event {
  static instance: Event;

  onToggleSider: Dispatcher;

  siderVisible: boolean;

  constructor() {
    this.siderVisible = false;
    this.onToggleSider = new Dispatcher();
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

  toggle(value: boolean) {
    this.siderVisible = value;
    this.onToggleSider.emit(this);
  }
}

export const EventBus = Event.getInstance();
