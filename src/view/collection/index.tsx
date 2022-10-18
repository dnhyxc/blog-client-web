import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Content from '@/components/Content';
import MAlert from '@/components/MAlert';
import MIcons from '@/components/Icons';
import Header from '@/components/Header';
import Card from '@/components/Card';
import BackTop from '@/components/BackTop';
import Footer from '@/components/Footer';
// import useStore from '@/store';
import { useLoginStatus, useHtmlWidth, useScrollLoad } from '@/hooks';
import { PAGESIZE } from '@/constant';
import {
  ArticleListResult,
  // ArticleItem,
  // TimelineResult,
  // UserInfoParams,
} from '@/typings/common';
import styles from './index.less';

interface IProps {}

const Collection: React.FC<IProps> = () => {
  const [loading] = useState<boolean>(false);
  const [articleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });
  // const [loading, setLoading] = useState<boolean>(false);
  // const [articleList, setArticleList] = useState<ArticleListResult>({
  //   list: [1, 2, 3, 4, 5],
  //   total: 0,
  //   count: 0,
  // });

  const navigate = useNavigate();
  const { htmlWidth } = useHtmlWidth();
  // const {
  //   userInfoStore: { getUserInfo },
  // } = useStore();
  const { showAlert, toLogin, onCloseAlert } = useLoginStatus();
  // const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { onScroll, scrollbarRef, scrollTop } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });

  // 高级搜索
  const toSearch = () => {
    navigate('/search');
  };

  // 渲染右侧搜索
  const rightNode = () => (
    <div className={styles.searchWrap}>
      <MIcons name="icon-sousuo2" className={styles.iconWrap} onClick={toSearch} />
    </div>
  );

  return (
    <div className={styles.Collection}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <div className={styles.headerWrap}>
        <Header needLeft excludesWidth right={rightNode()}>
          <div className={styles.headerContent}>关于博主</div>
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
          <div className={styles.infoWrap}>
            <div>collectionName</div>
          </div>
          <div className={styles.content}>
            <Card
              list={articleList.list}
              wrapClass={styles.wrapClass}
              // toDetail={toDetail}
              // likeArticle={likeArticle}
              // deleteArticle={deleteArticle}
              // onEditArticle={onEditArticle}
              loadText="地主家也没余粮了"
              loading={loading}
            />
          </div>
        </div>
      </Content>
      {htmlWidth <= 960 && <Footer />}
      <BackTop scrollTop={scrollTop} scrollbarRef={scrollbarRef} />
    </div>
  );
};

export default Collection;
