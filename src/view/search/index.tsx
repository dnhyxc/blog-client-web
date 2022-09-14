import React, { useMemo, useState } from 'react';
import { Input, Radio, RadioChangeEvent } from 'antd';
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
  // ArticleItem,
  // TimelineResult,
  // UserInfoParams,
} from '@/typings/common';
import styles from './index.less';

interface IProps { }

const Search: React.FC<IProps> = () => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [radioValue, setRadioValue] = useState<string>('');
  const [loading] = useState<boolean>(false);
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

  const conditions = useMemo(() => {
    if (showMore || htmlWidth > 960) {
      return SEARCH_TYPE;
    }
    return SEARCH_TYPE.slice(0, 2);
  }, [showMore, htmlWidth]);

  const onRadioChange = (e: RadioChangeEvent) => {
    console.log(e.target.value, 'value');
    setRadioValue(e.target.value);
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
              <Radio.Group buttonStyle="solid" className={styles.radioGroup} onChange={onRadioChange}>
                {conditions.map((i) => {
                  return (
                    <Radio.Button className={styles.tag} key={i.key} value={radioValue}>
                      {i.label}
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
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
