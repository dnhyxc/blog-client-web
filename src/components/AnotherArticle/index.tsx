import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classname from 'classname';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { formatGapTime, storage } from '@/utils';
import MIcons from '../Icons';
import { ArticleItem, AnotherParams } from '@/typings/common';
import styles from './index.less';

interface IProps {
  id: string | undefined;
  themeMode?: string;
}

const AnotherArticle: React.FC<IProps> = ({ id, themeMode }) => {
  const [articleList, setArticleList] = useState<ArticleItem[]>([]);

  const navigate = useNavigate();

  const params: AnotherParams =
    (storage.locGetItem('params') && JSON.parse(storage.locGetItem('params')!)) || {};

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
    const res = normalizeResult<ArticleItem>(
      await Service.getPrevArticle({ id, ...params })
    );
    return res.data;
  };

  // 获取下一篇文章
  const getNextArticle = async () => {
    const res = normalizeResult<ArticleItem>(
      await Service.getNextArticle({ id, ...params })
    );
    return res.data;
  };

  const toDetail = (id: string) => {
    navigate(`/detail/${id}`);
  };

  return articleList[0]?.id || articleList[1]?.id ? (
    <div className={classname(styles.AnotherArticle, themeMode === 'dark' && styles.dark)}>
      {articleList.map((i, index) => {
        return (
          <div
            key={i.id || index}
            className={index > 0 ? styles.nextArticle : styles.prevArticle}
            onClick={() => toDetail && toDetail(i.id)}
          >
            {index === 0 && i?.id && (
              <div className={styles.icon}>
                <MIcons name="icon-arrow-left-bold" noStopPropagation />
              </div>
            )}
            {i.id && (
              <div className={styles.item}>
                <div className={styles.title}>{i?.title}</div>
                <div className={styles.abstract}>{i?.abstract}</div>
                <div className={styles.info}>
                  <span title={i?.authorName}>
                    {i?.authorName?.length > 20
                      ? `${i?.authorName?.slice(0, 19)}...`
                      : i?.authorName}
                  </span>
                  <span>{` · ${i?.tag} · `}</span>
                  <span>{`${i?.classify} · `}</span>
                  <span>{formatGapTime(i?.createTime!)}</span>
                </div>
              </div>
            )}
            {index > 0 && i?.id && (
              <div className={styles.icon}>
                <MIcons name="icon-arrow-right-bold" noStopPropagation />
              </div>
            )}
          </div>
        );
      })}
    </div>
  ) : null;
};

export default AnotherArticle;
