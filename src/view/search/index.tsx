import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from 'antd';
import classname from 'classname';
import Content from '@/components/Content';
import Header from '@/components/Header';
import Card from '@/components/Card';
import MAlert from '@/components/MAlert';
import MIcons from '@/components/Icons';
import BackTop from '@/components/BackTop';
import ActionIcon from '@/components/ActionIcon';
import Footer from '@/components/Footer';
import {
  useLoginStatus,
  useLikeArticle,
  useScrollLoad,
  useDeleteArticle,
  useHtmlWidth,
  useGetTheme,
} from '@/hooks';
import useStore from '@/store';
import * as Service from '@/service';
import { PAGESIZE, SEARCH_TYPE } from '@/constant';
import { info, error, normalizeResult } from '@/utils';
import { ArticleListResult, SearchTypeParams, ArticleItem } from '@/typings/common';
import styles from './index.less';

interface IProps {}

const Search: React.FC<IProps> = () => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [filterValues, setFilterValues] = useState<string[]>(['all']);
  const [loading, setLoading] = useState<boolean>(false);
  const [conditions, setConditions] = useState<SearchTypeParams[]>([]);
  const [keyword, setKeyWord] = useState<string>('');
  const [articleList, setArticleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });

  const listRef = useRef<ArticleItem[]>([]);
  const { pageNo, setPageNo, onScroll, scrollbarRef, scrollTop } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { htmlWidth } = useHtmlWidth();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const navigate = useNavigate();
  const { themeMode } = useGetTheme();

  useEffect(() => {
    if (showMore) {
      setConditions(SEARCH_TYPE);
      return;
    }
    if (htmlWidth > 960) {
      setConditions(SEARCH_TYPE.slice(0, 5));
      return;
    }
    const filters = SEARCH_TYPE.slice(0, 2);
    setConditions(filters);
  }, [showMore, htmlWidth]);

  useEffect(() => {
    if (keyword) {
      advancedSearch();
    }
  }, [pageNo, keyword, filterValues]);

  // 高级搜索接口
  const advancedSearch = async () => {
    const params = {
      userId: getUserInfo?.userId,
      pageNo,
      pageSize: PAGESIZE,
      keyword,
      filterList: filterValues,
    };
    setLoading(true);
    const res = normalizeResult<ArticleListResult>(await Service.advancedSearch(params));
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

  // 搜索
  const onSearch = async (value: string) => {
    // 当搜索的内容与之前的不同时，清除列表数据
    if (value !== keyword) {
      setPageNo(1);
      listRef.current = [];
      setArticleList({
        list: listRef.current,
        total: 0,
        count: 0,
      });
    }
    setKeyWord(value);
    if (!value) {
      setKeyWord(value);
      info('请先输入搜索内容');
    }
  };

  // 展示更多条件
  const onShowMore = () => {
    setShowMore(!showMore);
  };

  const menageConditions = () => {
    setShowMore(!showMore);
  };

  const onSelectChange = (value: string) => {
    setPageNo(1);
    listRef.current = [];
    setArticleList({
      list: listRef.current,
      total: 0,
      count: 0,
    });

    if (value === 'all') {
      setFilterValues(['all']);
    } else {
      const noAll = filterValues.filter((i) => i !== 'all');
      const filter = noAll.find((i) => i === value);
      if (filter) {
        const values = noAll.filter((i) => i !== value);
        if (values?.length) {
          setFilterValues(values);
        } else {
          setFilterValues(['all']);
        }
      } else {
        noAll.push(value);
        setFilterValues([...noAll]);
      }
    }
  };

  // 文章点赞
  const { likeArticle } = useLikeArticle({
    setAlertStatus,
    articleList,
    updateList: setArticleList,
    listRef,
  });

  // 删除文章
  const { deleteArticle } = useDeleteArticle({
    articleList,
    setArticleList,
    getArticleList: advancedSearch,
    setAlertStatus,
    listRef,
    pageNo,
    keyword,
    filterList: filterValues,
    removeConfirmStyle: classname(
      styles.removeConfirmStyle,
      themeMode === 'dark' && styles.darkRemoveConfirmStyle
    ),
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

  return (
    <div className={classname(styles.Search, themeMode === 'dark' && styles.dark)}>
      <ActionIcon
        noHideMenuIcon
        className={styles.changeIconWrap}
        themeMode={themeMode}
        htmlWidth={htmlWidth}
      />
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <div className={styles.headerWrap}>
        <Header needLeft excludesWidth needUser themeMode={themeMode}>
          <div className={styles.headerContent}>文章搜索</div>
        </Header>
      </div>
      <Content
        containerClassName={styles.containerClassName}
        wrapClassName={styles.wrapClassName}
        className={styles.scrollWrap}
        onScroll={onScroll}
        scrollbarRef={scrollbarRef}
        themeMode={themeMode}
      >
        <div className={styles.wrap}>
          <div className={styles.searchWrap}>
            <div className={styles.search}>
              <Input.Search
                placeholder="请输入搜索内容"
                enterButton="搜索"
                size="large"
                className={styles.searchInp}
                onSearch={onSearch}
              />
            </div>
            <div className={styles.searchTagList}>
              {htmlWidth > 960 && (
                <div className={styles.label} onClick={menageConditions}>
                  <MIcons
                    className={styles.downIcon}
                    name={!showMore ? 'icon-xiajiantou' : 'icon-shangjiantou'}
                    onClick={onShowMore}
                  />
                  <span className={styles.viewMoreInfo}>更多选项：</span>
                </div>
              )}
              <div className={styles.radioGroup}>
                {conditions.map((i) => {
                  return (
                    <div
                      className={classname(
                        styles.tag,
                        filterValues.includes(i.type) && styles.active
                      )}
                      key={i.key}
                      onClick={() => onSelectChange(i.type)}
                    >
                      {i.label}
                    </div>
                  );
                })}
              </div>
            </div>
            {htmlWidth < 960 && (
              <div onClick={onShowMore} className={styles.showMore}>
                <MIcons
                  className={styles.downIcon}
                  name={!showMore ? 'icon-xiajiantou' : 'icon-shangjiantou'}
                  onClick={onShowMore}
                />
                <span className={styles.viewMoreInfo}>更多搜索选项</span>
              </div>
            )}
          </div>
          <div className={styles.content}>
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
              themeMode={themeMode}
              htmlWidth={htmlWidth}
            />
          </div>
        </div>
      </Content>
      {htmlWidth <= 960 && <Footer themeMode={themeMode} />}
      <BackTop scrollTop={scrollTop} scrollbarRef={scrollbarRef} htmlWidth={htmlWidth} />
    </div>
  );
};

export default Search;
