import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import Header from '@/components/Header';
import Content from '@/components/Content';
import Card from '@/components/Card';
import RightBar from '@/components/RightBar';
import MAlert from '@/components/Alert';
import useStore from '@/store';
import { PAGESIZE } from '@/constant';
import { useLoginStatus, useLikeArticle, useScrollLoad, useDeleteArticle } from '@/hooks';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { ArticleListResult, ArticleItem } from '@/typings/common';
import styles from './index.less';

interface IProps { }

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
  const { pageNo, onScroll } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });

  useEffect(() => {
    onGetArticleByTagName();
  }, [pageNo]);

  // 文章搜索
  const onGetArticleByTagName = async () => {
    setLoading(true);
    const res = normalizeResult<ArticleListResult>(
      await Service.searchArticle({
        tagName,
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
      message.error(res.message);
    }
  };

  // 删除文章
  const { deleteArticle } = useDeleteArticle({ articleList, setArticleList, getArticleList: onGetArticleByTagName, setAlertStatus });

  // 文章点赞
  const { likeArticle } = useLikeArticle(setAlertStatus, articleList, setArticleList);

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

  return (
    <div className={styles.TagList}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Header needMenu>
        {tagName}
        &nbsp; 标签
      </Header>
      <Content className={styles.contentWrap} onScroll={onScroll}>
        <div className={styles.content}>
          <Card
            list={articleList.list}
            likeArticle={likeArticle}
            deleteArticle={deleteArticle}
            toDetail={toDetail}
            onEditArticle={onEditArticle}
            showInfo={
              articleList.list.length > 0 && articleList.list.length === articleList.total
            }
          />
          <RightBar className={styles.rightbar} />
        </div>
      </Content>
    </div>
  );
};

export default TagList;
