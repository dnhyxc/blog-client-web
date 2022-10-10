/**
 * 分享新浪微博
 * @param  {[type]} title [分享标题]
 * @param  {[type]} url   [分享url链接，默认当前页面]
 * @param  {[type]} pic   [分享图片]
 * @return {[type]}       [description]
 */
export const shareSinaWeiBo = (title: string, pic?: string, url?: string) => {
  const param = {
    url: url || window.location.href,
    type: '3',
    count: '1', //  是否显示分享数，1显示(可选)
    appkey: '', //  您申请的应用appkey,显示分享来源(可选)
    title, // 分享的文字内容(可选，默认为所在页面的title)
    pic: pic || '', // 分享图片的路径(可选)
    ralateUid: '', // 关联用户的UID，分享微博会@该用户(可选)
    rnd: new Date().valueOf(),
  };
  const temp = [];
  for (const p in param) {
    temp.push(`${p}=${encodeURIComponent(param[p] || '')}`);
  }
  const targetUrl = `http://service.weibo.com/share/share.php?${temp.join('&')}`;
  window.open(targetUrl, '_blank');
};

// 分享到QQ空间
export const shareQZon = (title: string, pic?: string, url?: string) => {
  const param = {
    url: url || window.location.href,
    desc: '',
    title: title || '',
    summary: '',
    pics: pic || '',
    flash: '',
    site: '',
  };
  const temp = [];
  for (const p in param) {
    temp.push(`${p}=${encodeURIComponent(param[p] || '')}`);
  }
  const targetUrl = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?${temp.join(
    '&'
  )}`;
  window.open(targetUrl, '_blank');
};

/**
 * 分享QQ
 * @param  {[type]} title [分享标题]
 * @param  {[type]} url   [分享url链接，默认当前页面链接]
 * @param  {[type]} pic   [分享图片]
 * @return {[type]}       [description]
 */
export const shareQQ = (title: string, pic?: string, url?: string) => {
  const param = {
    url: url || window.location.href,
    desc: '', // 分享理由
    title: title || '', // 分享标题(可选)
    summary: '', // 分享描述(可选)
    pics: pic || '', // 分享图片(可选)
    flash: '', // 视频地址(可选)
    site: '', // 分享来源 (可选),
  };
  const s = [];
  for (const i in param) {
    s.push(`${i}=${encodeURIComponent(param[i] || '')}`);
  }
  const targetUrl = `https://connect.qq.com/widget/shareqq/index.html?${s.join('&')}`;
  window.open(targetUrl, '_blank');
};
