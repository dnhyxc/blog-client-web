/*
 * @Description: About 页面
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\personal\index.tsx
 */
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Tabs } from 'antd';
import Content from '@/components/Content';
import Image from '@/components/Image';
import Card from '@/components/Card';
import MIcons from '@/components/Icons';
import MAlert from '@/components/Alert';
import ABOUTME from '@/assets/images/about_me.jpg';
import Header from '@/components/Header';
import * as Service from '@/service';
import useStore from '@/store';
import { normalizeResult } from '@/utils/tools';
import { ABOUT_ME_TABS, PAGESIZE, ICONLINKS, ABOUT_ME_API_PATH } from '@/constant';
import { useLoginStatus, useLikeArticle, useScrollLoad, useDeleteArticle } from '@/hooks';
import { ArticleListResult, ArticleItem } from '@/typings/common';
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

  const navigate = useNavigate();
  const [search] = useSearchParams();
  const authorId: string | null = search.get('id');

  const listRef = useRef<ArticleItem[]>([]);
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { pageNo, setPageNo, onScroll } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });

  useEffect(() => {
    getMyArticleList();
  }, [selectKey, pageNo]);

  // 获取我的文章及点赞文章列表
  const getMyArticleList = async () => {
    setLoading(true);
    const res = normalizeResult<ArticleListResult>(
      await Service.getMyArticleList(
        {
          pageNo: 1,
          pageSize: PAGESIZE,
          userId: getUserInfo?.userId,
        },
        ABOUT_ME_API_PATH[selectKey]
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
  };

  const toSetting = () => {
    navigate('/setting/profile');
  };

  return (
    <div className={styles.Personal}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Header needMenu>我的主页</Header>
      <Content className={styles.contentWrap} onScroll={onScroll}>
        <div className={styles.content}>
          <div className={styles.wrap}>
            <div className={styles.userInfo}>
              <Image url={ABOUTME} className={styles.image} />
              <div className={styles.user}>
                <div className={styles.userName}>dnhyxc</div>
                <div>职位: 前端工程师</div>
                <div>行到水穷处，坐看云起时</div>
              </div>
              <div className={styles.actions}>
                <div className={styles.icons}>
                  {ICONLINKS.map((i) => (
                    <MIcons
                      key={i.name}
                      name={i.name}
                      className={styles[i.className]}
                      iconWrapClass={styles.iconWrap}
                      title={i.title}
                    />
                  ))}
                </div>
                {authorId === getUserInfo.userId && (
                  <Button type="primary" ghost onClick={toSetting}>
                    修改个人资料
                  </Button>
                )}
              </div>
            </div>
            <div className={styles.tabsWrap}>
              <Tabs defaultActiveKey="1" onChange={onChange}>
                {ABOUT_ME_TABS.map((i) => {
                  return (
                    <TabPane tab={i.name} key={i.value}>
                      <Card
                        list={articleList.list}
                        wrapClass={styles.wrapClass}
                        toDetail={toDetail}
                        deleteArticle={deleteArticle}
                        likeArticle={likeArticle}
                        onEditArticle={onEditArticle}
                        showInfo={
                          articleList.list.length > 0 &&
                          articleList.list.length === articleList.total
                        }
                      />
                    </TabPane>
                  );
                })}
              </Tabs>
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default Personal;
