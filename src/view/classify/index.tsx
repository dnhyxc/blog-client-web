import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Segmented } from 'antd';
import Content from '@/components/Content';
import Header from '@/components/Header';
import RightBar from '@/components/RightBar';
import Card from '@/components/Card';
import MAlert from '@/components/Alert';
import Empty from '@/components/Empty';
import { useLoginStatus, useLikeArticle, useScrollLoad, useDeleteArticle } from '@/hooks';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { ARTICLE_CLASSIFY, PAGESIZE } from '@/constant';
import { ArticleListResult, ArticleItem } from '@/typings/common';
import styles from './index.less';

interface IProps {}

const Classify: React.FC<IProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectClassify, setSelectClassify] = useState<string | number>('前端');
  const [classifyList, setClassifyList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });

  const navigate = useNavigate();
  const listRef = useRef<ArticleItem[]>([]);
  const { pageNo, setPageNo, onScroll } = useScrollLoad({
    data: classifyList,
    loading,
    pageSize: PAGESIZE,
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
    const res = normalizeResult<ArticleListResult>(
      await Service.getClassifyList({
        pageNo,
        pageSize: PAGESIZE,
        classify: selectClassify,
        userId: getUserInfo?.userId,
      })
    );
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
  const onSelectClassify = (classify: string | number) => {
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

  return (
    <div className={styles.Classify}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Header needMenu>文章分类</Header>
      <Content className={styles.contentWrap} onScroll={onScroll}>
        <div className={styles.segmentedWrap}>
          <Segmented
            options={ARTICLE_CLASSIFY}
            block
            className={styles.segmented}
            value={selectClassify}
            onChange={onSelectClassify}
          />
        </div>
        <div className={styles.content}>
          <Card
            list={classifyList.list}
            toDetail={toDetail}
            likeArticle={likeArticle}
            deleteArticle={deleteArticle}
            onEditArticle={onEditArticle}
            showInfo={classifyList.list.length === classifyList.total}
          />
          <RightBar className={styles.rightbar} />
        </div>
      </Content>
    </div>
  );
};

export default Classify;
