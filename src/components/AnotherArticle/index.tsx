import React, { useEffect, useState } from 'react';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { formatGapTime, decrypt } from '@/utils';
import MIcons from '../Icons';
import { ArticleItem } from '@/typings/common';
import styles from './index.less';

interface IProps {
  id: string | undefined;
  toDetail?: Function;
}

const AnotherArticle: React.FC<IProps> = ({ id, toDetail }) => {
  const [articleList, setArticleList] = useState<ArticleItem[]>([]);

  useEffect(() => {
    getAnothers();
  }, [id]);

  const getAnothers = async () => {
    const res = await Promise.all([getPrevArticle(), getNextArticle()]);
    if (res?.length) {
      setArticleList(res);
    }
  };

  // 获取上一篇文章
  const getPrevArticle = async () => {
    const res = normalizeResult<ArticleItem>(await Service.getPrevArticle({ id }));
    return res.data;
  };

  // 获取下一篇文章
  const getNextArticle = async () => {
    const res = normalizeResult<ArticleItem>(await Service.getNextArticle({ id }));
    return res.data;
  };

  return (
    <div className={styles.AnotherArticle}>
      {articleList?.length > 0 &&
        articleList.map((i, index) => {
          return (
            <div
              key={i.id || index}
              className={index > 0 ? styles.nextArticle : styles.prevArticle}
              onClick={() => toDetail && toDetail(i.id)}
            >
              {index === 0 && i?.id && (
                <div className={styles.icon}>
                  <MIcons name="icon-arrow-left-bold" />
                </div>
              )}
              {i.id && (
                <div className={styles.item}>
                  <div className={styles.title}>{i?.title}</div>
                  <div className={styles.abstract}>{i?.abstract}</div>
                  <div className={styles.info}>
                    <span>{i?.authorName && decrypt(i?.authorName)}</span>
                    <span>{` · ${i?.tag} · `}</span>
                    <span>{`${i?.classify} · `}</span>
                    <span>{formatGapTime(i?.createTime!)}</span>
                  </div>
                </div>
              )}
              {index > 0 && i?.id && (
                <div className={styles.icon}>
                  <MIcons name="icon-arrow-right-bold" />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default AnotherArticle;
