/*
 * @Description: 首页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\home\index.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import classname from 'classname';
import Content from '@/components/Content';
import Header from '@/components/Header';
import RightBar from '@/components/RightBar';
import Card from '@/components/Card';
import MIcons from '@/components/Icons';
import MAlert from '@/components/MAlert';
import MSearch from '@/components/MSearch';
import BackTop from '@/components/BackTop';
import ActionIcon from '@/components/ActionIcon';
import {
  useLoginStatus,
  useLikeArticle,
  useScrollLoad,
  useDeleteArticle,
  useHtmlWidth,
  useGetSiderVisible,
  useGetTheme,
} from '@/hooks';
import useStore from '@/store';
import * as Service from '@/service';
import { PAGESIZE } from '@/constant';
import { normalizeResult, storage, error } from '@/utils';
import { ArticleListResult, ArticleItem } from '@/typings/common';
import Cover from './Cover';
import styles from './index.less';

interface IProps {}

const Home: React.FC<IProps> = () => {
  const [articleList, setArticleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const inputRef = useRef<any>(null);
  const listRef = useRef<ArticleItem[]>([]);

  const navigate = useNavigate();
  const { themeMode } = useGetTheme();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { htmlWidth } = useHtmlWidth();
  const { siderVisible } = useGetSiderVisible();
  // scrollRef：用户设置rightbar的吸顶效果，scrollbarRef：scrollbar 滚动到顶部，scrollTop：回到顶部
  const {
    pageNo,
    setPageNo,
    onScroll,
    scrollRef,
    scrollbarRef,
    scrollTop,
    contentWrapRef,
    headerRef,
  } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
    paddingTopStyle: siderVisible && htmlWidth > 960 && styles.paddingTopStyle,
    headerStyle: siderVisible && htmlWidth > 960 && styles.headerStyle,
    headerDarkStyle: siderVisible && htmlWidth > 960 && styles.headerDarkStyle,
    themeMode,
    siderVisible,
  });

  useEffect(() => {
    storage.locRemoveItem('params');
  }, []);

  useEffect(() => {
    if (isSearch) {
      onSearchArticle(keyword);
    } else {
      getArticleList();
    }
  }, [pageNo, keyword, isSearch]);

  useEffect(() => {
    if (showSearch) {
      inputRef?.current?.focus({
        cursor: 'end',
      });
    }
  }, [inputRef, showSearch]);

  // 获取文章列表
  const getArticleList = async () => {
    setLoading(true);
    const res = normalizeResult<ArticleListResult>(
      await Service.getArticleList({
        pageNo,
        pageSize: PAGESIZE,
        userId: getUserInfo?.userId,
      })
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

  // 删除文章
  const { deleteArticle } = useDeleteArticle({
    articleList,
    setArticleList,
    getArticleList,
    setAlertStatus,
    listRef,
    pageNo,
    keyword,
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

  // 文章搜索
  const onSearchArticle = async (value: string) => {
    setLoading(true);
    const res = normalizeResult<ArticleListResult>(
      await Service.searchArticle({
        keyword: value,
        pageNo,
        pageSize: PAGESIZE,
        userId: getUserInfo?.userId,
      })
    );
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

  // 点击进入详情
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

  // 控制搜索框显隐
  const onShowSearch = () => {
    setShowSearch(true);
  };

  // 搜索
  const onSearch = (value: string) => {
    // 搜索时跳至文章列表
    scrollbarRef?.current.scrollTop(document.body.clientHeight - 49);
    setKeyword(value);
    if (keyword !== value) {
      setPageNo(1);
      listRef.current = [];
      setArticleList({
        list: listRef.current,
        total: 0,
        count: 0,
      });
    }
    if (value) {
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
  };

  // 当失去焦点时隐藏搜索输入框
  const onBlur = () => {
    setShowSearch(false);
  };

  // 高级搜索
  const toSearch = () => {
    navigate('/search');
  };

  // 渲染右侧搜索
  const rightNode = () => (
    <div className={styles.searchWrap}>
      <div>
        {!showSearch && (
          <MIcons
            name="icon-sousuo2"
            className={classname(
              htmlWidth > 960 && siderVisible && styles.searchIcon,
              styles.iconWrap,
              themeMode === 'dark' && styles.darkIconWrap
            )}
            onClick={htmlWidth > 960 ? onShowSearch : toSearch}
          />
        )}
        {showSearch && (
          <MSearch
            className={scrollTop >= document.body.clientHeight - 50 && styles.inputSearch}
            inputRef={inputRef}
            onSearch={onSearch}
            onBlur={onBlur}
          />
        )}
      </div>
      {htmlWidth > 960 && (
        <Button type="link" className={styles.toSearch} onClick={toSearch}>
          高级搜索
        </Button>
      )}
    </div>
  );

  return (
    <div className={classname(styles.container, themeMode === 'dark' && styles.dark)}>
      {htmlWidth <= 960 && (
        <ActionIcon
          noHideMenuIcon
          className={styles.changeIconWrap}
          themeMode={themeMode}
          htmlWidth={htmlWidth}
        />
      )}
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      {(htmlWidth <= 960 || !siderVisible) && (
        <Header
          right={rightNode()}
          className={htmlWidth > 960 && siderVisible && styles.header}
          headerRef={headerRef}
          themeMode={themeMode}
        >
          文章列表
        </Header>
      )}
      {articleList && (
        <Content
          className={classname(
            styles.contentWrap,
            siderVisible && htmlWidth > 960 && styles.changePaddingTop
          )}
          wrapClassName={siderVisible && htmlWidth > 960 ? styles.wrapClassName : ''}
          containerClassName={
            siderVisible && htmlWidth > 960 ? styles.containerClassName : ''
          }
          onScroll={onScroll}
          scrollbarRef={scrollbarRef}
          contentWrapRef={contentWrapRef}
          themeMode={themeMode}
        >
          {(siderVisible || htmlWidth <= 960) && (
            <Cover scrollbarRef={scrollbarRef}>
              {htmlWidth > 960 && (
                <Header
                  right={rightNode()}
                  className={htmlWidth > 960 && siderVisible && styles.header}
                  headerRef={headerRef}
                  itemStyles={htmlWidth > 960 && siderVisible && styles.itemStyles} // header item 的样式
                  iconStyles={htmlWidth > 960 && siderVisible && styles.iconStyles} // header item 的样式
                  activeMenuStyle={
                    scrollTop < document.body.clientHeight - 50 && styles.activeMenuStyle
                  }
                  themeMode={themeMode}
                >
                  <div className={styles.headTitle}>文章列表</div>
                </Header>
              )}
            </Cover>
          )}
          <div className={styles.content} id="CONTENT">
            <Card
              list={articleList.list}
              total={articleList.total}
              toDetail={toDetail}
              deleteArticle={deleteArticle}
              likeArticle={likeArticle}
              onEditArticle={onEditArticle}
              loading={loading}
              noMoreStyle={siderVisible && htmlWidth > 960 ? styles.noMoreStyle : ''}
              themeMode={themeMode}
              htmlWidth={htmlWidth}
            />
            <RightBar
              className={styles.rightbar}
              showRecommendArticle
              scrollRef={scrollRef}
              themeMode={themeMode}
              htmlWidth={htmlWidth}
            />
          </div>
        </Content>
      )}
      <BackTop scrollTop={scrollTop} scrollbarRef={scrollbarRef} htmlWidth={htmlWidth} />
    </div>
  );
};

export default Home;
