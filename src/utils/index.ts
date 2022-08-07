import Cookies from 'js-cookie';
import moment from 'moment';
import { encrypt, decrypt } from './crypto';
import { normalizeResult } from './tools';

export const formatDate = (date: number, format = 'YYYY/MM/DD HH:mm:ss') => {
  if (!date) return;

  return moment(date).format(format);
};

class JsCookies {
  name?: string;

  constructor(name?: string) {
    if (name) {
      this.getCoolie(name);
    }
  }

  setCookie(name: string, value: string, time: number) {
    Cookies.set(name, value, { expires: time });
  }

  getCoolie(name: string) {
    return Cookies.get(name);
  }

  removeCoolie(name: string) {
    Cookies.remove(name);
  }
}

const useCookies = new JsCookies();

export { normalizeResult, useCookies, encrypt, decrypt };
