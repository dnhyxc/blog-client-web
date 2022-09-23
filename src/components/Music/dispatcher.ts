export class Dispatcher {
  handlers: any[];

  constructor() {
    this.handlers = [];
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
