/*
 * @Description: About 页面
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\personal\index.tsx
 */
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, message, Tabs } from 'antd';
import Content from '@/components/Content';
import Image from '@/components/Image';
import Card from '@/components/Card';
import MIcons from '@/components/Icons';
import MAlert from '@/components/Alert';
import Header from '@/components/Header';
import BackTop from '@/components/BackTop';
import * as Service from '@/service';
import useStore from '@/store';
import { normalizeResult, storage } from '@/utils';
import {
  ABOUT_ME_TABS,
  ABOUT_TABS,
  PAGESIZE,
  ICONLINKS,
  ABOUT_ME_API_PATH,
  HEAD_UEL,
} from '@/constant';
import { useLoginStatus, useLikeArticle, useScrollLoad, useDeleteArticle } from '@/hooks';
import { ArticleListResult, ArticleItem, UserInfoParams } from '@/typings/common';
import styles from './index.less';

const { TabPane } = Tabs;

const Personal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectKey, setSelectKey] = useState<string>('1');
  const [articleList, setArticleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });
  const [personalInfo, setPersonalInfo] = useState<UserInfoParams>({
    userId: '',
  });

  const navigate = useNavigate();
  const [search] = useSearchParams();
  const authorId: string | null = search.get('id');

  const listRef = useRef<ArticleItem[]>([]);
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { pageNo, setPageNo, onScroll, scrollTop, contentRef } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });

  useEffect(() => {
    getMyArticleList();
  }, [selectKey, pageNo]);

  useEffect(() => {
    if (!authorId) return;
    onGetPersonalInfo();
  }, [authorId]);

  // 获取我的文章及点赞文章列表
  const getMyArticleList = async () => {
    setLoading(true);
    const params = {
      pageNo,
      pageSize: PAGESIZE,
      userId: authorId || getUserInfo?.userId,
      accessUserId: getUserInfo?.userId,
    };
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
      message.error(res.message);
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
    contentRef.current.scrollTop();
  };

  const toSetting = () => {
    navigate('/setting/profile');
  };

  // 根据authorId获取对应的tabs
  const getTabList = () => {
    if (authorId && authorId !== getUserInfo?.userId) {
      return ABOUT_TABS;
    }
    return ABOUT_ME_TABS;
  };

  return (
    <div className={styles.Personal}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Header>我的主页</Header>
      <Content className={styles.contentWrap} onScroll={onScroll} contentRef={contentRef}>
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
                  {ICONLINKS.map((i) => (
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
                  ))}
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
                {getTabList().map((i) => {
                  return (
                    <TabPane tab={i.name} key={i.value}>
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
                    </TabPane>
                  );
                })}
              </Tabs>
            </div>
          </div>
        </div>
      </Content>
      <BackTop scrollTop={scrollTop} contentRef={contentRef} />
    </div>
  );
};

export default Personal;
