import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'antd';
import useStore from '@/store';
import MIcons from '@/components/Icons';
import { useHtmlWidth } from '@/hooks';
import * as Service from '@/service';
import { CARD_URL } from '@/constant';
import { error } from '@/utils';
import { normalizeResult } from '@/utils/tools';
import { ArticleItem } from '@/typings/common';
import styles from './index.less';

interface IProps {
  scrollbarRef: any;
  children?: ReactNode;
}

const Cover: React.FC<IProps> = ({ scrollbarRef, children }) => {
  const [recommendList, setRecommendList] = useState<ArticleItem[]>([]);

  const navigate = useNavigate();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { htmlWidth } = useHtmlWidth();

  useEffect(() => {
    if (htmlWidth <= 960) {
      getArticleByRandom();
    }
  }, [htmlWidth]);

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
      error(res.message);
    }
  };

  const toArticleList = () => {
    scrollbarRef?.current.scrollTop(document.body.clientHeight - 49);
  };

  const toPersonal = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/personal?id=${id}`);
  };

  // 点击进入详情
  const toDetail = (id: string, needScroll?: boolean): void => {
    if (needScroll) {
      navigate(`/detail/${id}?needScroll=1`);
    } else {
      navigate(`/detail/${id}`);
    }
  };

  // 去分类页
  const toClassify = (e: Event, classify: string) => {
    e.stopPropagation();
    navigate(`/classify?classify=${classify}`);
  };

  const itemStyles = (url: string) => {
    return {
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundImage: `url(${url || CARD_URL})`,
    };
  };

  return htmlWidth > 960 ? (
    <div className={styles.Cover}>
      {children}
      <div className={styles.content}>
        <div className={styles.desc}>
          <div
            className={styles.authorName}
            onClick={(e) =>
              toPersonal(e as unknown as MouseEvent, getUserInfo?.userId || '')
            }
          >
            {getUserInfo?.username || ''}
          </div>
          <div className={styles.line}>
            {getUserInfo?.motto || '行到水穷处，坐看云起时！'}
          </div>
        </div>
      </div>
      <div className={styles.downWrap}>
        <div className={styles.shaking} onClick={toArticleList}>
          <MIcons
            name="icon-double-arrow-down"
            className={styles.downIcon}
            noStopPropagation
          />
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.MobileCover}>
      {children}
      <div className={styles.content}>
        {recommendList.length > 0 ? (
          <Carousel autoplay>
            {recommendList.map((i) => {
              return (
                <div key={i.id} className={styles.carouselWrap}>
                  <div
                    className={styles.carouselItem}
                    style={itemStyles(i.coverImage)}
                    onClick={() => toDetail(i.id)}
                  >
                    <div className={styles.desc}>
                      <div className={styles.title}>{i.title}</div>
                      <div className={styles.authorName}>
                        <span
                          className={styles.tag}
                          onClick={(e) =>
                            toPersonal(e as unknown as MouseEvent, i.authorId)
                          }
                        >
                          {i.authorName}
                        </span>
                        <span
                          className={styles.classify}
                          onClick={(e) =>
                            toClassify(e as unknown as MouseEvent, i.classify)
                          }
                        >
                          {i.classify}
                        </span>
                      </div>
                      <div className={styles.abstract}>{i.abstract}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Carousel>
        ) : (
          <div className={styles.load}>正在卖力加载中...</div>
        )}
      </div>
    </div>
  );
};

export default Cover;
