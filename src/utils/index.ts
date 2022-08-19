import Cookies from 'js-cookie';
import moment from 'moment';
import { SET_ITEM_CONFIG } from '@/constant';
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

// 转化距离当前时间的间隔时长
const formatGapTime = (date: number) => {
  const ms = Date.now() - date;
  const seconds = Math.round(ms / 1000);
  const minutes = Math.round(ms / 60000);
  const hours = Math.round(ms / 3600000);
  const days = Math.round(ms / 86400000);
  const months = Math.round(ms / 2592000000);
  const years = Math.round(ms / 31104000000);

  switch (true) {
    case seconds < 60:
      return '刚刚';
    case minutes < 60:
      return `${minutes} 分钟前`;
    case hours < 24:
      return `${hours} 小时前`;
    case days < 30:
      return `${days} 天前`;
    case months < 12:
      return `${months} 月前`;
    default:
      return `${years} 年前`;
  }
};

const getSetItemConfig = (auth: number, type: string | null) => {
  if (auth || type === 'DELETE__ALL__ARTICLE') {
    return SET_ITEM_CONFIG;
  }
  return SET_ITEM_CONFIG.filter((i) => i.label !== 'auth');
};

export { normalizeResult, useCookies, encrypt, decrypt, formatGapTime, getSetItemConfig };
