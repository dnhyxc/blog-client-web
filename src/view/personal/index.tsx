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
import Content from '@/components/Content';
import Image from '@/components/Image';
import Card from '@/components/Card';
import MList from '@/components/MList';
import MIcons from '@/components/Icons';
import MAlert from '@/components/MAlert';
import Header from '@/components/Header';
import BackTop from '@/components/BackTop';
import * as Service from '@/service';
import useStore from '@/store';
import { normalizeResult, storage, error } from '@/utils';
import {
  ABOUT_ME_TABS,
  ABOUT_TABS,
  PAGESIZE,
  ICONLINKS,
  ABOUT_ME_API_PATH,
  HEAD_UEL,
} from '@/constant';
import {
  useLoginStatus,
  useLikeArticle,
  useScrollLoad,
  useDeleteArticle,
  useVerifyToken,
  useUpdateCollectedList,
} from '@/hooks';
import {
  ArticleListResult,
  ArticleItem,
  UserInfoParams,
  AddCollectionRes,
} from '@/typings/common';
import styles from './index.less';

const { TabPane } = Tabs;

const Personal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectKey, setSelectKey] = useState<string>('1');
  const [collectedCount, setCollectedCount] = useState<number>(0);
  const [collectVisible, setCollecVisible] = useState<boolean>(false);
  const [addCollectRes, setAddCollectRes] = useState<AddCollectionRes>({
    id: '',
  });
  const [articleList, setArticleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: PAGESIZE,
  });
  const [personalInfo, setPersonalInfo] = useState<UserInfoParams>({
    userId: '',
  });

  // 校验token是否过期
  useVerifyToken();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const authorId: string | null = search.get('id');

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

  // 添加收藏集之后，前端更新收藏列表的hooks
  useUpdateCollectedList({
    params: addCollectRes as unknown as ArticleItem,
    articleList,
    setArticleList,
    listRef,
  });

  console.log(articleList.total, 'articleList');

  useEffect(() => {
    getMyArticleList();
  }, [selectKey, pageNo]);

  useEffect(() => {
    if (!authorId) return;
    onGetPersonalInfo();
  }, [authorId]);

  useEffect(() => {
    getCollectedTotal();
  }, []);

  // 获取收藏总条数
  const getCollectedTotal = async () => {
    const res = normalizeResult<{ total: number }>(
      await Service.getCollectedTotal({ userId: getUserInfo?.userId })
    );
    if (res.success) {
      setCollectedCount(res.data.total);
    }
  };

  // 获取创建收藏集的返回值
  const getAddCollectRes = (params: AddCollectionRes) => {
    setAddCollectRes(params);
  };

  // 获取我的文章、点赞文章列表、我的收藏列表
  const getMyArticleList = async () => {
    setLoading(true);
    const params = {
      pageNo,
      pageSize: PAGESIZE,
      userId: authorId || getUserInfo?.userId,
      accessUserId: getUserInfo?.userId,
    };
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

  // 获取用户信息
  const onGetPersonalInfo = async () => {
    const res = normalizeResult<UserInfoParams>(
      await Service.getUserInfo({
        userId: authorId,
      })
    );
    if (res.success) {
      setPersonalInfo(res.data);
      return;
    }
    if (res.code === 406) {
      error(res.message);
      navigate('home');
    }
  };

  // 文章点赞
  const { likeArticle } = useLikeArticle({
    setAlertStatus,
    articleList,
    updateList: setArticleList,
    isAboutMe: selectKey === '2',
  });

  // 删除文章
  const { deleteArticle } = useDeleteArticle({
    articleList,
    setArticleList,
    getArticleList: getMyArticleList,
    setAlertStatus,
  });

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
    if (scrollTop) {
      scrollbarRef.current.scrollTop();
    }
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
  }, [collectedCount]);

  return (
    <div className={styles.Personal}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Header>我的主页</Header>
      <Content
        className={styles.contentWrap}
        onScroll={onScroll}
        scrollbarRef={scrollbarRef}
      >
        <div className={styles.content}>
          <div className={styles.wrap}>
            <div className={styles.userInfo}>
              <Image
                url={(authorId ? personalInfo?.headUrl : getUserInfo?.headUrl) || HEAD_UEL}
                transitionImg={HEAD_UEL}
                className={styles.image}
              />
              <div className={styles.user}>
                <div className={styles.userName}>{getUserInfo?.username}</div>
                <div>{personalInfo?.job || getUserInfo?.job}</div>
                <div>{personalInfo?.motto || getUserInfo?.motto}</div>
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
                          style={
                            getUserInfo?.[i.label]
                              ? { display: 'inline-block' }
                              : { display: 'none' }
                          }
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
                {(authorId === getUserInfo.userId || !authorId) && (
                  <Button type="primary" ghost onClick={toSetting}>
                    修改个人资料
                  </Button>
                )}
              </div>
            </div>
            <div className={styles.tabsWrap}>
              <Tabs defaultActiveKey="1" onChange={onChange}>
                {getTabList.map((i) => {
                  return (
                    <TabPane tab={i.name} key={i.value}>
                      {i.value !== '3' ? (
                        <Card
                          list={articleList.list}
                          wrapClass={styles.wrapClass}
                          toDetail={toDetail}
                          deleteArticle={deleteArticle}
                          likeArticle={likeArticle}
                          onEditArticle={onEditArticle}
                          showInfo={articleList.list.length === articleList.total}
                          loading={loading}
                        />
                      ) : (
                        <MList
                          list={articleList.list}
                          loading={loading}
                          collectedCount={collectedCount}
                          visible={collectVisible}
                          onHide={() => setCollecVisible(false)}
                          onShow={() => setCollecVisible(true)}
                          getAddRes={getAddCollectRes}
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
