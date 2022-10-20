export class Dispatcher {
  handlers: any[];

  static instance: Dispatcher;

  constructor() {
    this.handlers = [];
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Dispatcher();
    }
    return this.instance;
  }

  listen(handler: any) {
    this.handlers.push(handler);
  }

  emit(...args: any[]) {
    this.handlers.forEach((handler) => {
      handler(...args);
    });
  }
}
