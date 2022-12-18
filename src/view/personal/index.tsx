/*
 * @Description: About 页面
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\personal\index.tsx
 */
import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Tabs } from 'antd';
import classname from 'classname';
import Content from '@/components/Content';
import Image from '@/components/Image';
import Card from '@/components/Card';
import MList from '@/components/MList';
import MIcons from '@/components/Icons';
import MAlert from '@/components/MAlert';
import Header from '@/components/Header';
import BackTop from '@/components/BackTop';
import ActionIcon from '@/components/ActionIcon';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, storage, uniqueFunc } from '@/utils';
import {
  ABOUT_ME_TABS,
  ABOUT_TABS,
  PAGESIZE,
  ICONLINKS,
  ABOUT_ME_API_PATH,
  HEAD_UEL,
  GLOBAL_STYLES,
} from '@/constant';
import {
  useLoginStatus,
  useLikeArticle,
  useDeleteArticle,
  useScrollLoad,
  useVerifyToken,
  useGetUserInfo,
  useHtmlWidth,
  useGetSiderVisible,
  useGetTheme,
} from '@/hooks';
import {
  ArticleListResult,
  ArticleItem,
  AddCollectionRes,
  PerGetArticlesParams,
} from '@/typings/common';
import styles from './index.less';

const { TabPane } = Tabs;

const Personal = () => {
  const [search] = useSearchParams();
  const authorId: string | null = search.get('id');
  const tabKey: string | null = search.get('tab');

  const [loading, setLoading] = useState<boolean>(false);
  const [selectKey, setSelectKey] = useState<string>(tabKey || '1');
  const [collectedCount, setCollectedCount] = useState<number>(0);
  const [collectVisible, setCollecVisible] = useState<boolean>(false);
  const [collectTotal, setCollecTotal] = useState<number>(0);
  const [articleList, setArticleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: PAGESIZE,
  });

  // 校验token是否过期
  useVerifyToken(undefined, true);
  const navigate = useNavigate();
  const { htmlWidth } = useHtmlWidth();
  const { siderVisible } = useGetSiderVisible();
  const { themeMode } = useGetTheme();

  const listRef = useRef<ArticleItem[]>([]);
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { pageNo, setPageNo, onScroll, scrollTop, scrollbarRef } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });
  const { userInfo } = useGetUserInfo({
    userId: authorId as string,
    authorId: getUserInfo?.userId,
    clearInfo: true,
  });

  useEffect(() => {
    if (tabKey) {
      setSelectKey(tabKey);
    }
  }, [tabKey]);

  useEffect(() => {
    getMyArticleList();
  }, [selectKey, pageNo, authorId]);

  useEffect(() => {
    // 从自己的主页切换为别人的主业时，首先
    if (!authorId) {
      listRef.current = [];
      setPageNo(1);
      setArticleList({
        list: listRef.current,
        total: 0,
        count: 0,
      });
    }
  }, [authorId]);

  useEffect(() => {
    if (selectKey === '3') {
      getCollectedTotal();
      getCollectionTotal();
    }
  }, [selectKey]);

  // 获取收藏集总数
  const getCollectionTotal = async () => {
    const res = normalizeResult<number>(
      await Service.getCollectTotal({ userId: getUserInfo?.userId })
    );
    if (res.success) {
      setCollecTotal(res.data);
    }
  };

  // 获取收藏文章总条数
  const getCollectedTotal = async () => {
    const res = normalizeResult<{ total: number }>(
      await Service.getCollectedTotal({ userId: authorId || getUserInfo?.userId })
    );
    if (res.success) {
      setCollectedCount(res.data.total);
    }
  };

  // 获取创建收藏集的返回值
  const getAddCollectRes = (params: AddCollectionRes) => {
    listRef.current = [params as unknown as ArticleItem, ...listRef.current];
    setArticleList({
      ...articleList,
      list: listRef.current,
    });
  };

  // 获取我的文章、点赞文章列表、我的收藏列表
  const getMyArticleList = async () => {
    setLoading(true);
    const params: PerGetArticlesParams = {
      pageNo,
      pageSize: PAGESIZE,
      userId: authorId || getUserInfo?.userId,
      accessUserId: getUserInfo?.userId, // accessUserId有值，说明是访问别人的主页，需要通过accessUserId去获取点赞状态
    };
    // 访问他人主页时，增加isVisitor参数
    if (authorId && authorId !== getUserInfo?.userId) {
      params.isVisitor = true;
    }
    // 保存至storage用于根据不同页面进入详情时，针对性的进行上下篇文章的获取（如：分类页面上下篇、标签页面上下篇）
    storage.locSetItem(
      'params',
      JSON.stringify({
        userId: authorId || getUserInfo?.userId,
        accessUserId: getUserInfo?.userId,
        selectKey,
        from: 'personal',
      })
    );
    const res = normalizeResult<ArticleListResult>(
      await Service.getMyArticleList(params, ABOUT_ME_API_PATH[selectKey])
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

  // 列表去重
  const dataList = useMemo(() => {
    // 由于创建收藏集时，手动添加了新增的一项到列表。由于添加新的数据之后，没有立即重新请求列表，在后续滚动加载时，每页请求的数据会存在重复的，因此需要去重
    const filterList = uniqueFunc(articleList.list, 'id');
    return filterList;
  }, [articleList.list]);

  // 文章点赞
  const { likeArticle } = useLikeArticle({
    setAlertStatus,
    articleList,
    updateList: setArticleList,
    isAboutMe: selectKey === '2',
    listRef,
  });

  // 删除文章
  const { deleteArticle } = useDeleteArticle({
    articleList,
    setArticleList,
    getArticleList: getMyArticleList,
    setAlertStatus,
    delType: selectKey,
    listRef,
    pageNo,
    authorId: authorId as string,
    accessUserId: getUserInfo?.userId,
    getCollectionTotal: selectKey === '3' ? getCollectionTotal : () => {},
    removeConfirmStyle: classname(
      styles.removeConfirmStyle,
      themeMode === 'dark' && styles.darkRemoveConfirmStyle
    ),
  });

  // 更新收藏集
  const updateCollection = (collectInfo: AddCollectionRes) => {
    const newData = articleList?.list.map((i) => {
      if (i.id === collectInfo.id) {
        return {
          ...i,
          ...collectInfo,
        };
      }
      return i;
    });

    listRef.current = [...newData] as unknown as ArticleItem[];

    setArticleList({
      ...articleList,
      list: listRef.current,
    });
  };

  // 编辑文章
  const onEditArticle = (id: string) => {
    navigate(`/create?id=${id}`);
  };

  // 点击进入详情
  const toDetail = (id: string, needScroll: boolean): void => {
    if (needScroll) {
      navigate(`/detail/${id}?needScroll=1`);
    } else {
      navigate(`/detail/${id}`);
    }
  };

  // 切换tab事件
  const onChange = (key: string) => {
    setSelectKey(key);
    listRef.current = [];
    setPageNo(1);
    setArticleList({
      list: listRef.current,
      total: 0,
      count: 0,
    });
  };

  const toSetting = () => {
    navigate('/setting/profile');
  };

  // 根据authorId获取对应的tabs
  const getTabList = useMemo(() => {
    if (authorId && authorId !== getUserInfo?.userId) {
      return ABOUT_TABS;
    }
    return ABOUT_ME_TABS;
  }, [authorId]);

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
    <div className={classname(styles.Personal, themeMode === 'dark' && styles.dark)}>
      <ActionIcon noHideMenuIcon className={styles.changeIconWrap} />
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Header right={rightNode()}>我的主页</Header>
      <Content
        className={classname(
          styles.contentWrap,
          htmlWidth > 960 && siderVisible && styles.contentPadding
        )}
        onScroll={onScroll}
        scrollbarRef={scrollbarRef}
      >
        <div className={styles.content} id="CONTENT">
          <div className={styles.wrap}>
            <div className={styles.userInfo}>
              <Image
                url={(authorId ? userInfo?.headUrl : getUserInfo?.headUrl) || HEAD_UEL}
                transitionImg={HEAD_UEL}
                className={styles.image}
              />
              <div className={styles.user}>
                <div className={styles.userName}>
                  {userInfo?.username || getUserInfo?.username}
                </div>
                <div>{userInfo ? userInfo?.job || '-' : getUserInfo?.job}</div>
                <div> {userInfo ? userInfo?.motto || '-' : getUserInfo?.motto}</div>
              </div>
              <div className={styles.actions}>
                <div className={styles.icons}>
                  {ICONLINKS.map(
                    (i) =>
                      getUserInfo?.[i.label] && (
                        <a
                          href={getUserInfo?.[i.label]}
                          target="_blank"
                          rel="noreferrer"
                          key={i.name}
                          className={styles.link}
                        >
                          <MIcons
                            name={i.name}
                            className={styles[i.className]}
                            iconWrapClass={styles.iconWrap}
                            title={i.title}
                          />
                        </a>
                      )
                  )}
                </div>
                {(authorId === getUserInfo?.userId || !authorId) && (
                  <Button type="primary" ghost onClick={toSetting}>
                    修改个人资料
                  </Button>
                )}
              </div>
            </div>
            <div className={styles.tabsWrap}>
              <Tabs
                defaultActiveKey={tabKey || '1'}
                onChange={onChange}
                tabBarStyle={
                  themeMode === 'dark'
                    ? {
                        backgroundColor: GLOBAL_STYLES.DARK_BGC_DEEP,
                        color: GLOBAL_STYLES.DARK_FC,
                      }
                    : {}
                }
              >
                {getTabList.map((i) => {
                  return (
                    <TabPane tab={i.name} key={i.value}>
                      {i.value !== '3' ? (
                        <Card
                          list={dataList}
                          total={articleList.total}
                          wrapClass={styles.wrapClass}
                          toDetail={toDetail}
                          deleteArticle={deleteArticle}
                          likeArticle={likeArticle}
                          onEditArticle={onEditArticle}
                          loading={loading}
                          fromPage={!authorId}
                        />
                      ) : (
                        <MList
                          list={dataList}
                          total={articleList.total}
                          collectTotal={collectTotal}
                          loading={loading}
                          collectedCount={collectedCount}
                          visible={collectVisible}
                          onHide={() => setCollecVisible(false)}
                          onShow={() => setCollecVisible(true)}
                          getAddRes={getAddCollectRes}
                          delCollection={deleteArticle}
                          updateCollection={updateCollection}
                          authorId={authorId || getUserInfo?.userId}
                        />
                      )}
                    </TabPane>
                  );
                })}
              </Tabs>
            </div>
          </div>
        </div>
      </Content>
      <BackTop scrollTop={scrollTop} scrollbarRef={scrollbarRef} />
    </div>
  );
};

export default Personal;
