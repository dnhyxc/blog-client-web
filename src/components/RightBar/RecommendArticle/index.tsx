import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import useStore from '@/store';
import { formatGapTime } from '@/utils';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { ArticleItem } from '@/typings/common';

import styles from './index.less';

interface IProps {
  scrollRef?: any;
}

const RecommendArticle: React.FC<IProps> = ({ scrollRef }) => {
  const [recommendList, setRecommendList] = useState<ArticleItem[]>([]);

  const navigate = useNavigate();
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

  const toDetail = (id: string) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className={styles.NewArticles} ref={scrollRef}>
      <div className={styles.contant}>
        <div className={styles.header}>文章推荐</div>
        {recommendList.length > 0 &&
          recommendList.map((i) => (
            <div key={i.id} className={styles.item} onClick={() => toDetail(i.id)}>
              <div className={styles.title}>{i.title}</div>
              <div className={styles.abstract}>
                <span>{formatGapTime(i.createTime)}</span>
                {i?.likeCount > 0 && (
                  <span className={styles.likeCount}>{i.likeCount} 点赞</span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecommendArticle;
