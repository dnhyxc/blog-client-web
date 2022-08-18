import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Affix, BackTop, Tabs } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import Header from '@/components/Header';
import MAlert from '@/components/Alert';
import Content from '@/components/Content';
import Card from '@/components/Card';
import Image from '@/components/Image';
import RightBar from '@/components/RightBar';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { useLoginStatus, useLikeArticle, useScrollLoad } from '@/hooks';
import { PAGESIZE, HEAD_UEL, MAIN_COVER, AUTHOR_TABS, AUTHOR_API_PATH } from '@/constant';
import { ArticleListResult, ArticleItem } from '@/typings/common';
import styles from './index.less';

const { TabPane } = Tabs;

interface IProps {}

const Author: React.FC<IProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectKey, setSelectKey] = useState<string>('1');
  const [articleList, setArticleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });

  const listRef = useRef<ArticleItem[]>([]);
  const navigate = useNavigate();
  const {
    userInfoStore: {
      getUserInfo: { auth, userId },
    },
  } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { pageNo, setPageNo, onScroll } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });

  useEffect(() => {
    getAuthorArticleList();
  }, [selectKey, pageNo]);

  // 获取博主的文章及点赞文章列表
  const getAuthorArticleList = async () => {
    setLoading(true);
    const res = normalizeResult<ArticleListResult>(
      await Service.getAuthorArticleList(
        {
          pageNo,
          pageSize: PAGESIZE,
          accessUserId: userId,
        },
        AUTHOR_API_PATH[selectKey]
      )
    );
    setLoading(false);
    if (res.success) {
      const { total, list } = res.data;
      // 使用ref暂存list，防止滚动加载时，list添加错乱问题
      listRef.current = [...listRef.current, ...list];
      setArticleList({
        list: listRef.current,
        total,
        count: list.length,
      });
    }
  };

  // 文章点赞
  const { likeArticle } = useLikeArticle({
    setAlertStatus,
    articleList,
    updateList: setArticleList,
    isAboutMe: auth === 1 && selectKey === '2',
  });

  // 点击进入详情
  const toDetail = (id: string, needScroll: boolean): void => {
    if (needScroll) {
      navigate(`/detail/${id}?needScroll=1`);
    } else {
      navigate(`/detail/${id}`);
    }
  };

  const onChangeTabs = (key: string) => {
    setSelectKey(key);
    listRef.current = [];
    setPageNo(1);
    setArticleList({
      list: listRef.current,
      total: 0,
      count: 0,
    });
  };

  return (
    <>
      <div className={styles.AuthorContainer}>
        {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
        <div className={styles.headerWrap}>
          <Header needLeft needMenu excludesWidth>
            <div className={styles.headerContent}>
              <div>关于博主</div>
            </div>
          </Header>
        </div>
        <Content
          containerClassName={styles.containerClassName}
          wrapClassName={styles.wrapClassName}
          className={styles.scrollWrap}
          onScroll={onScroll}
        >
          <div className={styles.wrap}>
            <div className={styles.infoWrap}>
              <div className={styles.mainCover}>
                <Image
                  url={MAIN_COVER}
                  transitionImg={MAIN_COVER}
                  className={styles.image}
                  imageWrapStyle={styles.imageWrapStyle}
                />
              </div>
              <div className={styles.headImg}>
                <Image url={HEAD_UEL} transitionImg={HEAD_UEL} className={styles.image} />
              </div>
              <div className={styles.mainInfo}>dnhyxc</div>
            </div>
            <div className={styles.content}>
              <div className={styles.tabList}>
                <div className={styles.tab}>
                  <Tabs defaultActiveKey="1" onChange={onChangeTabs}>
                    {AUTHOR_TABS.map((i) => {
                      return (
                        <TabPane tab={i.name} key={i.value}>
                          <Card
                            list={articleList.list}
                            wrapClass={styles.wrapClass}
                            toDetail={toDetail}
                            likeArticle={likeArticle}
                            // deleteArticle={deleteArticle}
                            // onEditArticle={onEditArticle}
                            // showInfo={articleList.list.length === articleList.total}
                            showInfo
                          />
                        </TabPane>
                      );
                    })}
                  </Tabs>
                </div>
              </div>
              <Affix offsetTop={60}>
                <div className={styles.rightBar}>
                  <RightBar />
                </div>
              </Affix>
            </div>
          </div>
        </Content>
      </div>
      <BackTop className={styles.backTopWrap}>
        <div className={styles.backTop}>
          <ArrowUpOutlined className={styles.topIcon} />
        </div>
      </BackTop>
    </>
  );
};

export default Author;
