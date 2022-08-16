import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import useStore from '@/store';
import { formatDate } from '@/utils';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { ArticleItem } from '@/typings/common';

import styles from './index.less';

interface IProps {
  scrollRef?: any;
}

const RecommendArticle: React.FC<IProps> = ({ scrollRef }) => {
  const [recommendList, setRecommendList] = useState<ArticleItem[]>([]);
  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  useEffect(() => {
    getArticleByRandom();
  }, []);

  // 随机获取文章
  const getArticleByRandom = async () => {
    const res = normalizeResult<ArticleItem[]>(
      await Service.getArticleByRandom({
        userId: getUserInfo?.userId,
      })
    );
    if (res.success) {
      setRecommendList(res.data);
    } else {
      message.error(res.message);
    }
  };

  return (
    <div className={styles.NewArticles} ref={scrollRef}>
      <div className={styles.header}>文章推荐</div>
      {recommendList.length > 0 &&
        recommendList.map((i) => (
          <div key={i.id} className={styles.item}>
            <div className={styles.title}>{i.title}</div>
            <div className={styles.abstract}>
              {i.likeCount && <span className={styles.likeCount}>{i.likeCount} 点赞</span>}
              <span>{formatDate(i.createTime)}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default RecommendArticle;
