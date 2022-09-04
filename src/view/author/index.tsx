import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Timeline } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import Header from '@/components/Header';
import MAlert from '@/components/Alert';
import Content from '@/components/Content';
import Card from '@/components/Card';
import Image from '@/components/Image';
import BackTop from '@/components/BackTop';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, storage, error } from '@/utils';
import {
  useLoginStatus,
  useLikeArticle,
  useScrollLoad,
  useDeleteArticle,
  useDeleteTimelineArticle,
  useHtmlWidth,
} from '@/hooks';
import { PAGESIZE, HEAD_UEL, MAIN_COVER, AUTHOR_TABS, AUTHOR_API_PATH } from '@/constant';
import Footer from '@/components/Footer';
import {
  ArticleListResult,
  ArticleItem,
  TimelineResult,
  UserInfoParams,
} from '@/typings/common';
import styles from './index.less';

const { TabPane } = Tabs;

interface IProps { }

const Author: React.FC<IProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectKey, setSelectKey] = useState<string>('1');
  const [timelineList, setTimelineList] = useState<TimelineResult[]>([]);
  const [authorInfo, setAuthorInfo] = useState<UserInfoParams>({
    userId: '',
  });
  const [articleList, setArticleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });

  const listRef = useRef<ArticleItem[]>([]);
  const navigate = useNavigate();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { pageNo, setPageNo, onScroll, scrollbarRef, scrollTop } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });
  const { htmlWidth } = useHtmlWidth();

  useEffect(() => {
    onGetPersonalInfo();
  }, []);

  useEffect(() => {
    getAuthorArticleList();
  }, [selectKey, pageNo]);

  // 获取博主信息
  const onGetPersonalInfo = async () => {
    const res = normalizeResult<UserInfoParams>(
      await Service.getUserInfo({
        auth: 1,
      })
    );
    if (res.success) {
      setAuthorInfo(res.data);
      return;
    }
    if (res.code === 406) {
      error(res.message);
      navigate('home');
    }
  };

  const getAuthorArticleList = () => {
    if (selectKey !== '3') {
      getAuthorArticles();
    } else {
      getAuthorTimeline();
    }
  };

  // 获取博主的文章及点赞文章列表
  const getAuthorArticles = async () => {
    setLoading(true);
    const params = {
      pageNo,
      pageSize: PAGESIZE,
      accessUserId: getUserInfo?.userId,
    };
    storage.locSetItem(
      'params',
      JSON.stringify({ accessUserId: getUserInfo?.userId, selectKey, from: 'author' })
    );
    const res = normalizeResult<ArticleListResult>(
      await Service.getAuthorArticleList(params, AUTHOR_API_PATH[selectKey])
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
    } else {
      error(res.message);
    }
  };

  // 获取时间轴列表
  const getAuthorTimeline = async () => {
    storage.locSetItem(
      'params',
      JSON.stringify({ accessUserId: getUserInfo?.userId, selectKey, from: 'author' })
    );
    const res = normalizeResult<TimelineResult[]>(
      await Service.getAuthorTimeline({ accessUserId: getUserInfo?.userId })
    );
    if (res.success) {
      setTimelineList(res.data);
    } else {
      error(res.message);
    }
  };

  // 文章点赞
  const { likeArticle } = useLikeArticle({
    setAlertStatus,
    articleList: selectKey !== '3' ? articleList : timelineList,
    updateList: selectKey !== '3' ? setArticleList : setTimelineList,
    isAboutMe: getUserInfo?.auth === 1 && selectKey === '2',
    isTimeLine: selectKey === '3',
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

  // 编辑文章
  const onEditArticle = (id: string) => {
    navigate(`/create?id=${id}`);
  };

  // 删除文章
  const { deleteArticle } = useDeleteArticle({
    articleList,
    setArticleList,
    getArticleList: getAuthorArticleList,
    setAlertStatus,
  });

  const { deleteTimeline } = useDeleteTimelineArticle({
    timelineList,
    setTimelineList,
    setAlertStatus,
  });

  return (
    <>
      <div className={styles.AuthorContainer}>
        {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
        <div className={styles.headerWrap}>
          <Header needLeft excludesWidth>
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
          scrollbarRef={scrollbarRef}
        >
          <div className={styles.wrap}>
            <div className={styles.infoWrap}>
              <div className={styles.mainCover}>
                <Image
                  url={authorInfo?.mainCover || MAIN_COVER}
                  transitionImg={MAIN_COVER}
                  className={styles.image}
                  imageWrapStyle={styles.imageWrapStyle}
                />
              </div>
              <div className={styles.headImg}>
                <Image
                  url={authorInfo?.headUrl || HEAD_UEL}
                  transitionImg={HEAD_UEL}
                  className={styles.image}
                />
              </div>
              <div className={styles.mainInfo}>
                <div className={styles.username}>{authorInfo?.username}</div>
                <div className={styles.info}>{authorInfo?.job}</div>
                <div className={styles.info}>{authorInfo?.introduce}</div>
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.tabList}>
                <div className={styles.tab}>
                  <Tabs defaultActiveKey="1" onChange={onChangeTabs}>
                    {AUTHOR_TABS.map((i) => {
                      return (
                        <TabPane tab={i.name} key={i.value}>
                          {(i.value !== '3' || !timelineList.length || (timelineList.length && !timelineList[0].articles.length)) && (
                            <Card
                              list={articleList.list}
                              wrapClass={styles.wrapClass}
                              toDetail={toDetail}
                              likeArticle={likeArticle}
                              deleteArticle={deleteArticle}
                              onEditArticle={onEditArticle}
                              showInfo={articleList.list.length === articleList.total}
                              loadText="地主家也没余粮了"
                              loading={loading}
                            />
                          )}
                          {i.value === '3' && timelineList.length > 0 && timelineList[0].articles.length > 0 && (
                            <Timeline className={styles.timelineContent}>
                              {timelineList.map((i) => {
                                return (
                                  <Timeline.Item
                                    className={styles.timelineItem}
                                    key={i.date}
                                    color="green"
                                    dot={
                                      <ClockCircleOutlined style={{ fontSize: '16px' }} />
                                    }
                                  >
                                    <div className={styles.cardList}>
                                      <div className={styles.date}>{i.date}</div>
                                      {i.articles && i.articles.length > 0 && (
                                        <Card
                                          list={i.articles}
                                          wrapClass={styles.wrapClass}
                                          itemClass={styles.itemClass}
                                          descClass={styles.descClass}
                                          toDetail={toDetail}
                                          likeArticle={likeArticle}
                                          deleteArticle={deleteTimeline}
                                        />
                                      )}
                                    </div>
                                  </Timeline.Item>
                                );
                              })}
                            </Timeline>
                          )}
                        </TabPane>
                      );
                    })}
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </Content>
        {htmlWidth <= 960 && <Footer />}
        <BackTop scrollTop={scrollTop} scrollbarRef={scrollbarRef} />
      </div>
    </>
  );
};

export default Author;
