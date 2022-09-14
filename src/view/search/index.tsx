import React, { useState } from 'react';
import { Input, Menu, Space, Dropdown, Radio } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Content from '@/components/Content';
import Header from '@/components/Header';
import Card from '@/components/Card';
import MAlert from '@/components/Alert';
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

interface IProps {}

const Search: React.FC<IProps> = () => {
  const [searchType, setSearchType] = useState<SearchTypeParams>();
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

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const selectKey = SEARCH_TYPE.find((i) => e.key === i.key);
    setSearchType(selectKey);
  };

  const menu = (
    <Menu onClick={handleMenuClick} items={SEARCH_TYPE} className={styles.tagMenu} />
  );

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
            <Dropdown overlay={menu} autoFocus>
              <div className={styles.tagSelect}>
                <Space>
                  {searchType?.label || '选择标签'}
                  <DownOutlined />
                </Space>
              </div>
            </Dropdown>
            <Input.Search
              placeholder="请输入搜索内容"
              enterButton="Search"
              size="large"
              className={styles.SearchInp}
            />
            <div className={styles.searchTagList}>
              <Radio.Group buttonStyle="solid">
                {SEARCH_TYPE.map((i) => {
                  return (
                    <Radio.Button className={styles.tag} key={i.key} value={i.key}>
                      {i.label}
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
            </div>
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
