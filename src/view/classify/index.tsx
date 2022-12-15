import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classname from 'classname';
import Content from '@/components/Content';
import Header from '@/components/Header';
import RightBar from '@/components/RightBar';
import Card from '@/components/Card';
import MAlert from '@/components/MAlert';
import BackTop from '@/components/BackTop';
import MSegmented from '@/components/Segmented';
import MIcons from '@/components/Icons';
import {
  useLoginStatus,
  useLikeArticle,
  useScrollLoad,
  useDeleteArticle,
  useGetSiderVisible,
  useHtmlWidth,
  useGetTheme,
} from '@/hooks';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, storage, error } from '@/utils';
import { PAGESIZE } from '@/constant';
import { ArticleListResult, ArticleItem } from '@/typings/common';
import styles from './index.less';

const Classify: React.FC = () => {
  const [search] = useSearchParams();
  const classify = search.get('classify');
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [selectClassify, setSelectClassify] = useState<string>(classify || '前端');
  const [height, setHeight] = useState<number>(34);
  const [classifyList, setClassifyList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });

  const listRef = useRef<ArticleItem[]>([]);
  const { htmlWidth } = useHtmlWidth();
  const { siderVisible } = useGetSiderVisible();
  const { pageNo, setPageNo, onScroll, scrollRef, scrollTop, scrollbarRef } = useScrollLoad(
    {
      data: classifyList,
      loading,
      pageSize: PAGESIZE,
      scrollStyle: siderVisible && htmlWidth > 960 && styles.scrollTopStyle,
    }
  );
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { themeMode } = useGetTheme();

  useEffect(() => {
    getClassifyList();
  }, [selectClassify, pageNo]);

  const getClassifyList = async () => {
    setLoading(true);
    const params = {
      pageNo,
      pageSize: PAGESIZE,
      classify: selectClassify,
      userId: getUserInfo?.userId,
    };
    // 保存至storage用于根据不同页面进入详情时，针对性的进行上下篇文章的获取（如：分类页面上下篇、标签页面上下篇）
    storage.locSetItem(
      'params',
      JSON.stringify({
        classify: selectClassify,
        userId: getUserInfo?.userId,
        from: 'classify',
      })
    );
    const res = normalizeResult<ArticleListResult>(await Service.getClassifyList(params));
    setLoading(false);
    if (res.success) {
      const { total, list } = res.data;
      listRef.current = [...listRef.current, ...list];
      setClassifyList({
        list: listRef.current,
        total,
        count: list.length,
      });
    } else {
      error(res.message);
    }
  };

  // 选择分类查询
  const onSelectClassify = (classify: string) => {
    if (classify !== selectClassify) {
      setPageNo(1);
      listRef.current = [];
      setClassifyList({
        list: listRef.current,
        total: 0,
        count: 0,
      });
    }
    setSelectClassify(classify);
  };

  // 删除文章
  const { deleteArticle } = useDeleteArticle({
    articleList: classifyList,
    setArticleList: setClassifyList,
    getArticleList: getClassifyList,
    setAlertStatus,
    listRef,
    pageNo,
    classify: selectClassify,
  });

  // 文章点赞
  const { likeArticle } = useLikeArticle({
    setAlertStatus,
    articleList: classifyList,
    updateList: setClassifyList,
    listRef,
  });

  const toDetail = (id: string, needScroll: boolean): void => {
    if (needScroll) {
      navigate(`/detail/${id}?needScroll=1`);
    } else {
      navigate(`/detail/${id}`);
    }
  };

  // 编辑文章
  const onEditArticle = (id: string) => {
    navigate(`/create?id=${id}`);
  };

  // 获取MSegmented的高度，用户实时改变Card组件的paddingTop
  const getOffsetHeight = (height: number) => {
    setHeight(height);
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
    <div className={styles.Classify}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Header right={rightNode()}>文章分类</Header>
      <Content
        className={styles.contentWrap}
        onScroll={onScroll}
        scrollbarRef={scrollbarRef}
      >
        <div className={classname(styles.content, styles.contentPadding)} id="CONTENT">
          <div className={styles.filterList}>
            <div
              className={classname(
                styles.segmentedWrap,
                siderVisible && styles.changeWidth,
                themeMode === 'dark' && styles.dark
              )}
            >
              <MSegmented
                onClick={onSelectClassify}
                getOffsetHeight={getOffsetHeight}
                classify={classify}
                className={themeMode === 'dark' && styles.darkSegmented}
                activeTagStyle={themeMode === 'dark' && styles.activeTagStyle}
              />
            </div>
            <Card
              wrapClass={styles.wrapClass}
              list={classifyList.list}
              total={classifyList.total}
              toDetail={toDetail}
              likeArticle={likeArticle}
              deleteArticle={deleteArticle}
              onEditArticle={onEditArticle}
              loading={loading}
              style={{ paddingTop: `${!siderVisible ? height + 10 : height}px` }}
            />
          </div>
          <RightBar
            className={classname(styles.rightbar, siderVisible && styles.changePadding)}
            showRecommendArticle
            scrollRef={scrollRef}
          />
        </div>
      </Content>
      <BackTop scrollTop={scrollTop} scrollbarRef={scrollbarRef} />
    </div>
  );
};

export default Classify;
