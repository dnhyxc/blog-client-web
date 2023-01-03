import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Timeline } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import classname from 'classname';
import Header from '@/components/Header';
import MAlert from '@/components/MAlert';
import MIcons from '@/components/Icons';
import Content from '@/components/Content';
import Card from '@/components/Card';
import Image from '@/components/Image';
import BackTop from '@/components/BackTop';
import ActionIcon from '@/components/ActionIcon';
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
  useGetTheme,
} from '@/hooks';
import {
  PAGESIZE,
  HEAD_UEL,
  MAIN_COVER,
  AUTHOR_TABS,
  AUTHOR_API_PATH,
  GLOBAL_STYLES,
} from '@/constant';
import Footer from '@/components/Footer';
import {
  ArticleListResult,
  ArticleItem,
  TimelineResult,
  UserInfoParams,
} from '@/typings/common';
import styles from './index.less';

const { TabPane } = Tabs;

const Author: React.FC = () => {
  const [selectKey, setSelectKey] = useState<string>('1');
  const [timelineList, setTimelineList] = useState<TimelineResult[]>([]);
  const [authorInfo, setAuthorInfo] = useState<UserInfoParams>({
    userId: '',
  });
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [articleList, setArticleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });
  const listRef = useRef<ArticleItem[]>([]);
  const navigate = useNavigate();
  const { htmlWidth } = useHtmlWidth();
  const {
    userInfoStore: { getUserInfo },
    siderStore,
  } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { pageNo, setPageNo, onScroll, scrollbarRef, scrollTop } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });
  const { themeMode } = useGetTheme();

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
    // 保存至storage用于根据不同页面进入详情时，针对性的进行上下篇文章的获取（如：分类页面上下篇、标签页面上下篇）
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
    // 保存至storage用于根据不同页面进入详情时，针对性的进行上下篇文章的获取（如：分类页面上下篇、标签页面上下篇）
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
    listRef,
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
    listRef,
    pageNo,
    authorPage: selectKey === '1',
    authorLike: selectKey === '2',
    removeConfirmStyle: classname(
      styles.removeConfirmStyle,
      themeMode === 'dark' && styles.darkRemoveConfirmStyle
    ),
  });

  const { deleteTimeline } = useDeleteTimelineArticle({
    timelineList,
    setTimelineList,
    setAlertStatus,
    removeConfirmStyle: classname(
      styles.removeConfirmStyle,
      themeMode === 'dark' && styles.darkRemoveConfirmStyle
    ),
  });

  // 查看更多信息
  const onViewMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  // 高级搜索
  const toSearch = () => {
    navigate('/search');
  };

  // 渲染右侧搜索
  const rightNode = () => (
    <div className={styles.searchWrap}>
      <MIcons
        name="icon-sousuo2"
        className={classname(styles.iconWrap, themeMode === 'dark' && styles.darkIcon)}
        onClick={toSearch}
      />
    </div>
  );

  return (
    <div className={classname(styles.AuthorContainer, themeMode === 'dark' && styles.dark)}>
      <ActionIcon noHideMenuIcon className={styles.changeIconWrap} />
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <div className={styles.headerWrap}>
        <Header needLeft excludesWidth right={rightNode()} needUser themeMode={themeMode}>
          <div className={styles.headerContent}>关于博主</div>
        </Header>
      </div>
      <Content
        containerClassName={styles.containerClassName}
        wrapClassName={styles.wrapClassName}
        className={styles.scrollWrap}
        onScroll={onScroll}
        scrollbarRef={scrollbarRef}
      >
        <div
          className={classname(styles.wrap, siderStore.toggleSider && styles.changeWidth)}
        >
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
            </div>
          </div>
          <div className={styles.viewMore}>
            {showMoreInfo && (
              <div>
                <div className={styles.info}>{authorInfo?.introduce}</div>
                <div className={styles.info}>{authorInfo?.motto}</div>
                <a
                  href={authorInfo?.github}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.info}
                >
                  github: {authorInfo?.github}
                </a>
                <a
                  href={authorInfo?.juejin}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.info}
                >
                  掘金: {authorInfo?.juejin}
                </a>
                <a
                  className={styles.info}
                  href={authorInfo?.zhihu}
                  target="_blank"
                  rel="noreferrer"
                >
                  知乎: {authorInfo?.zhihu}
                </a>
                <a
                  className={styles.info}
                  href={authorInfo?.blog}
                  target="_blank"
                  rel="noreferrer"
                >
                  博客: {authorInfo?.blog}
                </a>
              </div>
            )}
            <div className={styles.moreInfo} onClick={onViewMoreInfo}>
              <MIcons
                className={styles.downIcon}
                name={!showMoreInfo ? 'icon-xiajiantou' : 'icon-shangjiantou'}
                onClick={onViewMoreInfo}
              />
              <span className={styles.viewMoreInfo}>查看详细资料</span>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.tabList}>
              <div className={styles.tab}>
                <Tabs
                  defaultActiveKey="1"
                  onChange={onChangeTabs}
                  tabBarStyle={
                    themeMode === 'dark'
                      ? {
                          backgroundColor: GLOBAL_STYLES.DARK_BGC_DEEP,
                          color: GLOBAL_STYLES.DARK_FC,
                        }
                      : {}
                  }
                >
                  {AUTHOR_TABS.map((i) => {
                    return (
                      <TabPane tab={i.name} key={i.value}>
                        {(i.value !== '3' ||
                          !timelineList.length ||
                          (timelineList.length && !timelineList[0].articles.length)) && (
                          <Card
                            list={articleList.list}
                            total={articleList.total}
                            wrapClass={styles.wrapClass}
                            toDetail={toDetail}
                            likeArticle={likeArticle}
                            deleteArticle={deleteArticle}
                            onEditArticle={onEditArticle}
                            loadText="地主家也没余粮了"
                            loading={loading}
                          />
                        )}
                        {i.value === '3' &&
                          timelineList.length > 0 &&
                          timelineList[0].articles.length > 0 && (
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
                                          total={i.articles.length}
                                          wrapClass={styles.wrapClass}
                                          itemClass={styles.itemClass}
                                          toDetail={toDetail}
                                          likeArticle={likeArticle}
                                          deleteArticle={deleteTimeline}
                                          onEditArticle={onEditArticle}
                                          noMoreStyle={styles.noMoreStyle}
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
  );
};

export default Author;
