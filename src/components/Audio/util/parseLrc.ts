import { LrcInfo } from '@/typings/common';

export const parseLrc = async (url: string) => {
  try {
    const lrcText = await fetch(url).then((res) => res.text());
    return createLrc(lrcText);
  } catch (error) {
    throw new Error('解析失败', error as Error);
  }
};

const createLrc = (lrc: string) => {
  const LRCInfo: LrcInfo = {
    ti: '', // 歌曲名
    ar: '', // 演唱者
    al: '', // 专辑名
    by: '', // 歌词制作人
    offset: 0, // 时间补偿值，单位毫秒，用于调整歌词整体位置
    ms: [], // 歌词数组{t:时间,c:歌词}
  };

  if (lrc.length === 0) return;
  const lrcs = lrc.split('\n'); // 用回车拆分成数组
  for (const i in lrcs) {
    // 遍历歌词数组
    lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ''); // 去除前后空格
    const t = lrcs[i].substring(lrcs[i].indexOf('[') + 1, lrcs[i].indexOf(']')); // 取[]间的内容
    const s = t.split(':'); // 分离:前后文字
    if (Number.isNaN(parseInt(s[0], 10))) {
      // 不是数值
      for (const i in LRCInfo) {
        if (i !== 'ms' && i === s[0].toLowerCase()) {
          const temp = s[1];
          LRCInfo[i] = temp;
        }
      }
    } else {
      // 是数值
      const arr = lrcs[i].match(/\[(\d+:.+?)\]/g); // 提取时间字段，可能有多个
      let start = 0;
      for (const k in arr) {
        start += arr[k].length; // 计算歌词位置
      }
      const content = lrcs[i].substring(start); // 获取歌词内容
      for (const k in arr) {
        const t = arr[k].substring(1, arr[k].length - 1); // 取[]间的内容
        const s = t.split(':'); // 分离:前后文字
        LRCInfo.ms.push({
          // 对象{t:时间,c:歌词}加入ms数组
          t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
          c: content,
        });
      }
    }
  }
  LRCInfo.ms.sort((a: any, b: any) => {
    // 按时间顺序排序
    return a.t - b.t;
  });

  return LRCInfo;
};
