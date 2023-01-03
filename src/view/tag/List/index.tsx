import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import classname from 'classname';
import Header from '@/components/Header';
import Content from '@/components/Content';
import Card from '@/components/Card';
import RightBar from '@/components/RightBar';
import MAlert from '@/components/MAlert';
import ActionIcon from '@/components/ActionIcon';
import MIcons from '@/components/Icons';
import useStore from '@/store';
import { PAGESIZE } from '@/constant';
import BackTop from '@/components/BackTop';
import {
  useLoginStatus,
  useLikeArticle,
  useScrollLoad,
  useDeleteArticle,
  useGetSiderVisible,
  useHtmlWidth,
  useGetTheme,
} from '@/hooks';
import * as Service from '@/service';
import { normalizeResult, storage, error } from '@/utils';
import { ArticleListResult, ArticleItem } from '@/typings/common';
import styles from './index.less';

interface IProps {}

const TagList: React.FC<IProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [articleList, setArticleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });

  const listRef = useRef<ArticleItem[]>([]);
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const tagName = search.get('tagName');

  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { siderVisible } = useGetSiderVisible();
  const { htmlWidth } = useHtmlWidth();
  const { pageNo, onScroll, scrollRef, scrollTop, scrollbarRef } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });
  const { themeMode } = useGetTheme();

  useEffect(() => {
    onGetArticleByTagName();
  }, [pageNo]);

  // 文章tag搜索
  const onGetArticleByTagName = async () => {
    setLoading(true);
    const params = { tagName, pageNo, pageSize: PAGESIZE, userId: getUserInfo?.userId };
    // 保存至storage用于根据不同页面进入详情时，针对性的进行上下篇文章的获取（如：分类页面上下篇、标签页面上下篇）
    storage.locSetItem(
      'params',
      JSON.stringify({ tagName, userId: getUserInfo?.userId, from: 'tag' })
    );
    const res = normalizeResult<ArticleListResult>(await Service.searchArticle(params));
    setLoading(false);
    if (res.success) {
      const { total, list } = res.data;
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

  // 删除文章
  const { deleteArticle } = useDeleteArticle({
    articleList,
    setArticleList,
    getArticleList: onGetArticleByTagName,
    setAlertStatus,
    listRef,
    pageNo,
    tagName: tagName! || '',
    removeConfirmStyle: classname(
      styles.removeConfirmStyle,
      themeMode === 'dark' && styles.darkRemoveConfirmStyle
    ),
  });

  // 文章点赞
  const { likeArticle } = useLikeArticle({
    setAlertStatus,
    articleList,
    updateList: setArticleList,
    listRef,
  });

  // 跳转详情
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
    <div className={styles.TagList}>
      {htmlWidth <= 960 && <ActionIcon noHideMenuIcon className={styles.changeIconWrap} />}
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Header right={rightNode()} themeMode={themeMode}>
        {tagName}
        &nbsp; 标签
      </Header>
      <Content
        className={classname(
          siderVisible && htmlWidth > 960 && styles.changePadding,
          styles.contentWrap
        )}
        onScroll={onScroll}
        scrollbarRef={scrollbarRef}
      >
        <div className={styles.content} id="CONTENT">
          <Card
            list={articleList.list}
            total={articleList.total}
            likeArticle={likeArticle}
            deleteArticle={deleteArticle}
            toDetail={toDetail}
            onEditArticle={onEditArticle}
            loading={loading}
          />
          <RightBar
            className={styles.rightbar}
            showRecommendArticle
            scrollRef={scrollRef}
          />
        </div>
      </Content>
      <BackTop scrollTop={scrollTop} scrollbarRef={scrollbarRef} />
    </div>
  );
};

export default TagList;
