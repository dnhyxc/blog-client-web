import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import Content from '@/components/Content';
import MAlert from '@/components/MAlert';
import MIcons from '@/components/Icons';
import Header from '@/components/Header';
import Image from '@/components/Image';
import Card from '@/components/Card';
import BackTop from '@/components/BackTop';
import Footer from '@/components/Footer';
import useStore from '@/store';
import * as Service from '@/service';
import { error, normalizeResult } from '@/utils';
import { useLoginStatus, useHtmlWidth, useScrollLoad, useGetUserInfo } from '@/hooks';
import { PAGESIZE, HEAD_UEL } from '@/constant';
import {
  ArticleListResult,
  // ArticleItem,
  // TimelineResult,
  // UserInfoParams,
  AddCollectionRes
} from '@/typings/common';
import styles from './index.less';

interface IProps { }

const Collection: React.FC<IProps> = () => {
  const [collectInfo, setCollectInfo] = useState<AddCollectionRes>({ id: '' });
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
  const [search] = useSearchParams();
  const authorId: string | null = search.get('authorId'); // 创建该收藏集的用户id
  const { id } = useParams(); // 收藏集id

  const { htmlWidth } = useHtmlWidth();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { showAlert, toLogin, onCloseAlert } = useLoginStatus();
  // const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { onScroll, scrollbarRef, scrollTop } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });
  const { userInfo } = useGetUserInfo(authorId as string || getUserInfo?.userId);

  useEffect(() => {
    getCollectInfo();
  }, [id]);

  // 获取收藏集详情
  const getCollectInfo = async () => {
    const res = normalizeResult<AddCollectionRes>(await Service.getCollectInfo({ id: id as string }));
    if (res.success) {
      setCollectInfo(res.data);
    } else {
      error(res.message);
    }
  };

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
            <div className={styles.name}>
              <span>{collectInfo?.name}</span>
              <div className={styles.acrions}>
                <span className={styles.edit}>
                  <MIcons
                    name="icon-icon_bianji"
                    className={styles.lockIcon}
                    text="编辑"
                  // customStyle
                  // onClick={() => onEdit(i as unknown as AddCollectionRes)}
                  />
                </span>
                <span className={styles.delete}>
                  <MIcons
                    name="icon-shanchu"
                    className={styles.lockIcon}
                    text="删除"
                  // customStyle
                  // onClick={() => onDelete(i.id)}
                  />
                </span>
              </div>
            </div>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <Image
                  url={userInfo?.headUrl || HEAD_UEL}
                  transitionImg={HEAD_UEL}
                  className={styles.image}
                />
              </div>
              <div className={styles.username}>
                <div className={styles.userdesc}>{userInfo?.username}</div>
                <div className={styles.moreCollection}>
                  <span>更多收藏集</span>
                  <MIcons
                    name="icon-arrow-right-bold"
                    className={styles.rightIcon}
                  // customStyle
                  // onClick={() => onEdit(i as unknown as AddCollectionRes)}
                  />
                </div>
              </div>
            </div>
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
