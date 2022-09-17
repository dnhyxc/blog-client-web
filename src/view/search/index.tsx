import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import classname from 'classname';
import Content from '@/components/Content';
import Header from '@/components/Header';
import Card from '@/components/Card';
import MAlert from '@/components/Alert';
import MIcons from '@/components/Icons';
import BackTop from '@/components/BackTop';
import Footer from '@/components/Footer';
import {
  useLoginStatus,
  // useLikeArticle,
  useScrollLoad,
  // useDeleteArticle,
  // useDeleteTimelineArticle,
  useHtmlWidth,
} from '@/hooks';
import { PAGESIZE, SEARCH_TYPE } from '@/constant';
import {
  ArticleListResult,
  SearchTypeParams,
  // ArticleItem,
  // TimelineResult,
  // UserInfoParams,
} from '@/typings/common';
import styles from './index.less';

interface IProps { }

const Search: React.FC<IProps> = () => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string[]>([]);
  const [loading] = useState<boolean>(false);
  const [conditions, setConditions] = useState<SearchTypeParams[]>([]);
  const [articleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });
  // const [loading, setLoading] = useState<boolean>(false);
  // const [articleList, setArticleList] = useState<ArticleListResult>({
  //   list: [],
  //   total: 0,
  //   count: 0,
  // });
  const { onScroll, scrollbarRef, scrollTop } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });
  const { showAlert, toLogin, onCloseAlert } = useLoginStatus();
  const { htmlWidth } = useHtmlWidth();

  // 展示更多条件
  const onShowMore = () => {
    setShowMore(!showMore);
  };

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

  const menageConditions = () => {
    setShowMore(!showMore);
  };

  const onSelectChange = (value: string) => {
    const filter = filterValue.find((i) => i === value);
    if (filter) {
      const values = filterValue.filter((i) => i !== value);
      setFilterValue(values);
    } else {
      filterValue.push(value);
      setFilterValue([...filterValue]);
    }
  };

  return (
    <div className={styles.Search}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <div className={styles.headerWrap}>
        <Header needLeft excludesWidth>
          <div className={styles.headerContent}>
            <div>文章搜索</div>
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
          <div className={styles.searchWrap}>
            <div className={styles.search}>
              <Input.Search
                placeholder="请输入搜索内容"
                enterButton="搜索"
                size="large"
                className={styles.searchInp}
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
                    <div className={classname(styles.tag, filterValue.includes(i.key) && styles.active)} key={i.key} onClick={() => onSelectChange(i.key)}>
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
              list={[]}
              wrapClass={styles.wrapClass}
              // toDetail={toDetail}
              // likeArticle={likeArticle}
              // deleteArticle={deleteArticle}
              // onEditArticle={onEditArticle}
              // showInfo={articleList.list.length === articleList.total}
              loadText="地主家也没余粮了"
            // loading={loading}
            />
          </div>
        </div>
      </Content>
      {htmlWidth <= 960 && <Footer />}
      <BackTop scrollTop={scrollTop} scrollbarRef={scrollbarRef} />
    </div>
  );
};

export default Search;
