import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import classname from 'classname';
import Content from '@/components/Content';
import Header from '@/components/Header';
import RightBar from '@/components/RightBar';
import Card from '@/components/Card';
import MAlert from '@/components/Alert';
import BackTop from '@/components/BackTop';
import MSegmented from '@/components/Segmented';
import { useLoginStatus, useLikeArticle, useScrollLoad, useDeleteArticle } from '@/hooks';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, storage } from '@/utils';
import { PAGESIZE } from '@/constant';
import { ArticleListResult, ArticleItem } from '@/typings/common';
import styles from './index.less';

const Classify: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectClassify, setSelectClassify] = useState<string | number>('前端');
  const [height, setHeight] = useState<number>(34);
  const [classifyList, setClassifyList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });

  const navigate = useNavigate();
  const listRef = useRef<ArticleItem[]>([]);
  const { pageNo, setPageNo, onScroll, scrollRef, scrollTop, contentRef } = useScrollLoad({
    data: classifyList,
    loading,
    pageSize: PAGESIZE,
    scrollStyle: styles.scrollStyle,
  });
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();

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
      message.error(res.message);
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
  });

  // 文章点赞
  const { likeArticle } = useLikeArticle({
    setAlertStatus,
    articleList: classifyList,
    updateList: setClassifyList,
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

  return (
    <div className={styles.Classify}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Header>文章分类</Header>
      <Content className={styles.contentWrap} onScroll={onScroll} contentRef={contentRef}>
        <div className={classname(styles.content, styles.contentPadding)}>
          <div className={styles.filterList}>
            <div className={styles.segmentedWrap}>
              <MSegmented onClick={onSelectClassify} getOffsetHeight={getOffsetHeight} />
            </div>
            <Card
              wrapClass={styles.wrapClass}
              list={classifyList.list}
              toDetail={toDetail}
              likeArticle={likeArticle}
              deleteArticle={deleteArticle}
              onEditArticle={onEditArticle}
              showInfo={classifyList.list.length === classifyList.total}
              loading={loading}
              style={{ paddingTop: `${height + 10}px` }}
            />
          </div>
          <RightBar
            className={styles.rightbar}
            showRecommendArticle
            scrollRef={scrollRef}
          />
        </div>
      </Content>
      <BackTop scrollTop={scrollTop} contentRef={contentRef} />
    </div>
  );
};

export default Classify;
