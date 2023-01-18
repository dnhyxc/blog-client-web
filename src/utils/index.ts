import Cookies from 'js-cookie';
import moment from 'moment';
import { SET_ITEM_CONFIG } from '@/constant';
import { encrypt, decrypt } from './crypto';
import { normalizeResult } from './tools';
import { storage } from './storage';
import { success, error, info, warn } from './message';
import { shareQQ, shareQZon, shareSinaWeiBo } from './share';
import { onDowmloadElement, onPrintElement } from './print';

// 格式化时间
export const formatDate = (date: number, format = 'YYYY/MM/DD HH:mm:ss') => {
  if (!date) return;

  return moment(date).format(format);
};

// 数组去重方法
export const uniqueFunc = (arr: any, uniId: string) => {
  const res = new Map();
  return arr.filter((item: any) => !res.has(item[uniId]) && res.set(item[uniId], 1));
};

// 格式化歌曲时间
export const formatTime = (val: number) => {
  const min = Math.floor(val / 60);
  const sec = Math.floor(val % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

// 格式歌曲名称
export const formatName = (val: string) => {
  return val.replace(/\.mp3$/, '');
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

// 根据url中的type类型获取权限状态
const getSetItemConfig = (auth: number, type: string | null) => {
  if (auth || type === 'DELETE__ALL__ARTICLE') {
    return SET_ITEM_CONFIG;
  }
  return SET_ITEM_CONFIG.filter((i) => i.label !== 'auth');
};

// 获取随机数min-max之间的随机数，包含min和max（大于等于min，小于等于max）
export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 元素处于焦点返回true，反之返回false
export const elementIsInFocus = (el: any) => el === document.activeElement;

// 获取选定的文本
export const getSelectedText = () => window.getSelection()?.toString();

// 文字复制到剪贴板
export const copyText = async (text: string) => await navigator.clipboard.writeText(text);

// 判断鼠标是否在指定元素内部
export const isInsideElement = (e: any, dom: HTMLDivElement) => {
  const x = e.pageX; // 鼠标相对屏幕横坐标
  const y = e.pageY; // 鼠标相对屏幕纵坐标
  // const x = e.changedTouches[0].clientX; // 鼠标相对屏幕横坐标
  // const y = e.changedTouches[0].clientY; // 鼠标相对屏幕纵坐标
  const left = Number(dom.getBoundingClientRect().left); // obj相对屏幕的横坐标
  const clientWidth = Number(dom.getBoundingClientRect().left + dom.clientWidth); // obj相对屏幕的横坐标+width
  const top = Number(dom.getBoundingClientRect().top); // obj相对屏幕的纵坐标
  const clientHeight = Number(dom.getBoundingClientRect().top + dom.clientHeight); // obj相对屏幕的纵坐标+height
  if (x > left && x < clientWidth && y > top && y < clientHeight) {
    return true;
  }
  return false;
};

// 账号校验
const verifyUsername = (_: any, value: string) => {
  const usrRegex =
    /^((?!\\|\/|\(|\)|\+|-|=|~|～|`|!|！|:|\*|\?|<|>|\||'|%|#|&|\$|\^|&|\*).){1,20}$/;
  if (usrRegex.test(value)) {
    return Promise.resolve();
  }
  if (value.length < 1) {
    return Promise.reject('用户名不能少于1位');
  }
  if (value.length > 15) {
    return Promise.reject('用户名不能大于15位');
  }
  return Promise.reject('用户名不能包含特殊字符');
};

// 密码校验
const verifyPassword = (_: any, value: string) => {
  const pwdRegex = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}/;
  if (value.length > 20) {
    return Promise.reject('密码不能不大于20位');
  }
  if (value.length < 8) {
    return Promise.reject('密码不能少于8位');
  }
  if (pwdRegex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject('必须包含字母、数字、特称字符');
};

// 密码校验
const verifyResetPassword = (value: string) => {
  const pwdRegex = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}/;
  if (value.length > 20) {
    warn('密码不能不大于20位');
    return false;
  }
  if (value.length < 8) {
    warn('密码不能少于8位');
    return false;
  }
  if (pwdRegex.test(value)) {
    return true;
  }
  warn('必须包含字母、数字、特称字符');
  return false;
};

export {
  normalizeResult,
  useCookies,
  encrypt,
  decrypt,
  formatGapTime,
  getSetItemConfig,
  storage,
  success,
  error,
  info,
  warn,
  shareQQ,
  shareQZon,
  shareSinaWeiBo,
  onDowmloadElement,
  onPrintElement,
  verifyUsername,
  verifyPassword,
  verifyResetPassword,
};
