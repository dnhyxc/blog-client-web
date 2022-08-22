class Storage {
  locSetItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  locGetItem(key: string) {
    return localStorage.getItem(key);
  }

  locRemoveItem(key: string) {
    localStorage.removeItem(key);
  }

  ssnSetItem(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  ssnGetItem(key: string) {
    return sessionStorage.getItem(key);
  }

  ssnRemoveItem(key: string) {
    sessionStorage.removeItem(key);
  }
}

const storage = new Storage();

export { storage };
