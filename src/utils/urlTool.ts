/**
 * new URL() 不好用，不支持非完成的 url，所以还是需要第三方库。
 */
import qs, { parseUrl, stringify } from 'query-string';
import { GATEWAY_HOST } from '@/constant';

/**
 * 判断 URL 是不是 m3u8 资源
 */
export function isHLS(url: string) {
  return /\.m3u8(\?.*)?/.test(url);
}

/**
 * FIXME: 临时方案，获取多st、dur情况下的数值
 * @param {*} urlString
 */
function getRealQueryNumber(value?: string | string[] | null) {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * 解析 xxx.m3u8?st=12&dur=23
 * @param {*} urlString
 */
export function parseSoftCut(urlString: string): [number, number] | null {
  const url = qs.parseUrl(urlString || '');
  const { query } = url;
  const st = Number(getRealQueryNumber(query.st as any)) || 0;
  const dur = Number(getRealQueryNumber(query.dur as any)) || 0;
  return [st, dur];
}

type URLProtocal = 'http:' | 'https:' | 'blob:' | 'data:';

// 获取 url 协议
export function getUrlProtocal(url: string): URLProtocal | null {
  if (url == null) return null;
  const matched = url.match(/^\w+:/);
  return (matched ? matched[0] : window.location.protocol) as URLProtocal;
}

/**
 *
 * @param urlString
 * @param params
 */
export function addParams(urlString: string, params: Record<string, any>) {
  const url = qs.parseUrl(urlString || '');
  Object.assign(url.query, params);
  return `${url.url}?${qs.stringify(url.query)}`;
}

export function replaceRepeatStDurQuery(inputUrl: string) {
  const { query, url } = parseUrl(inputUrl);
  return query.st && query.dur
    ? `${url}?${stringify({
        ...query,
        st: getRealQueryNumber(query.st as any),
        dur: getRealQueryNumber(query.dur as any),
      })}`
    : inputUrl;
}

/**
 * 添加一个特定的参数防止编辑器预览播放器使用媒资弹窗的缓存，造成 CORS 失效
 * 不使用随机数或者时间戳作为值，是因为那样会造成资源完全不被缓存，每次都会重新请求。
 * 因为我们只是希望编辑器播放器的 url 和其他地方的 url 进行区分，所以加一个固定的后缀足矣。
 * CORS 缓存问题参考 https://zhuanlan.zhihu.com/p/38972475
 * @param {string} urlString
 */
export function addNoCacheParam(urlString: string) {
  if (!urlString) return urlString;
  const protocal = getUrlProtocal(urlString);
  if (protocal !== 'http:' && protocal !== 'https:') return urlString;
  return addParams(replaceRepeatStDurQuery(urlString), {
    acors: '',
  });
}

// TODO: 目前测试环境和线上环境的 bucket 是未隔离的，而且都开启了 HTTPS，原则上可以直接替换成 HTTPS 而不是当前页面的协议
export function replaceWithCurrentProtocal(url: string) {
  return url && url.replace(/^http(s)?:/, window.location.protocol);
}

export function addGatewayPattern(url: string) {
  if (url.startsWith('/api/user')) {
    return `${GATEWAY_HOST}/web/mediax-ucenter${url}`;
  }
  if (url.startsWith('/onlinePreview')) {
    return `${GATEWAY_HOST}/web/online-preview${url}`;
  }
  if (url.startsWith('/access/message')) {
    return `${GATEWAY_HOST}${url}`;
  }
  return url;
}
