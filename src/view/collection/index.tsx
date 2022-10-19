import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Modal } from 'antd';
import Content from '@/components/Content';
import MAlert from '@/components/MAlert';
import MIcons from '@/components/Icons';
import Header from '@/components/Header';
import Image from '@/components/Image';
import Card from '@/components/Card';
import BackTop from '@/components/BackTop';
import Footer from '@/components/Footer';
import CollectionModal from '@/components/CollectionModel';
import AddCollection from '@/components/AddCollection';
import useStore from '@/store';
import * as Service from '@/service';
import { error, normalizeResult } from '@/utils';
import {
  useVerifyToken,
  useLikeArticle,
  useLoginStatus,
  useHtmlWidth,
  useScrollLoad,
  useGetUserInfo,
} from '@/hooks';
import { PAGESIZE, HEAD_UEL } from '@/constant';
import { ArticleListResult, ArticleItem, AddCollectionRes, updateCollectParams } from '@/typings/common';
import styles from './index.less';

interface IProps { }

const Collection: React.FC<IProps> = () => {
  const [collectInfo, setCollectInfo] = useState<AddCollectionRes>({ id: '' });
  const [updateCollectInfo, setUpdateCollectInfo] = useState<updateCollectParams>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [hideCollectModel, setHideCollectModel] = useState<boolean>(false);
  const [moveArticleId, setMoveArticleId] = useState<string>('');
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [articleList, setArticleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });

  const listRef = useRef<ArticleItem[]>([]);
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const authorId: string | null = search.get('authorId'); // 创建该收藏集的用户id
  const { id } = useParams(); // 收藏集id
  // 校验token是否过期
  useVerifyToken();
  const { htmlWidth } = useHtmlWidth();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { pageNo, onScroll, scrollbarRef, scrollTop } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
  });
  const { userInfo } = useGetUserInfo({ userId: authorId as string, authorId: getUserInfo?.userId });

  useEffect(() => {
    getCollectInfo();
  }, [id]);

  useEffect(() => {
    getCollectArticles();
  }, [pageNo, collectInfo]);

  // 获取收藏集详情
  const getCollectInfo = async () => {
    const res = normalizeResult<AddCollectionRes>(
      await Service.getCollectInfo({ id: id as string })
    );
    if (res.success) {
      setCollectInfo(res.data);
    } else {
      error(res.message);
    }
  };

  // 获取收藏集中收藏的文章
  const getCollectArticles = async () => {
    if (!collectInfo?.articleIds?.length) return;
    setLoading(true);
    const res = normalizeResult<ArticleListResult>(
      await Service.getCollectArticles({
        pageNo,
        pageSize: PAGESIZE,
        userId: getUserInfo?.userId,
        articleIds: collectInfo?.articleIds,
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

  // 文章点赞
  const { likeArticle } = useLikeArticle({
    setAlertStatus,
    articleList,
    updateList: setArticleList,
    listRef,
  });

  // 取消收藏
  const cancelCollected = async (articleId: string) => {
    if (!id) return;
    const res = normalizeResult<number>(
      await Service.removeCollectArticle({
        id,
        articleId,
        userId: getUserInfo?.userId,
      })
    );
    if (!res.success) {
      error(res.message);
    }
  };

  // 将收藏集中的文章移除，注意：并不是删除文章
  const removeArticle = (id: string) => {
    // 如果需要移入的收藏集包含了当前收藏集，那么就不需要删除当前收藏集中这条文章
    if (isSelected) return;
    const filterList = articleList.list.filter((i) => i.id !== id);
    listRef.current = [...filterList];
    setArticleList({
      ...articleList,
      list: listRef.current,
    });
    cancelCollected(id);
  };

  // 点击进入详情
  const toDetail = (id: string, needScroll: boolean): void => {
    if (needScroll) {
      navigate(`/detail/${id}?needScroll=1`);
    } else {
      navigate(`/detail/${id}`);
    }
  };

  // 移动到别的收藏集
  const moveTo = (id: string) => {
    setVisible(true);
    setMoveArticleId(id);
  };

  // 获取创建收藏集弹窗显示状态
  const getAddVisible = (value: boolean) => {
    // 从文章列表点击转移打开创建弹窗时，关闭隐藏允许点击创建弹窗取消后打开收藏集弹窗
    setHideCollectModel(false);
    setAddVisible(value);
  };

  // 收藏
  const onCollection = () => {
    setVisible(true);
  };

  // 获取转移成功回调
  const getCollectRes = (id: string) => {
    if (id) {
      removeArticle(id);
    }
  };

  // 获取选中的收藏集ids
  const getSelectCollectIds = (ids: string[]) => {
    const isSelect = ids.includes(id as string);
    setIsSelected(isSelect);
  };

  // 高级搜索
  const toSearch = () => {
    navigate('/search');
  };

  // 返回收藏集
  const goBackToCollection = () => {
    if (userInfo?.userId !== getUserInfo?.userId) {
      navigate(`/personal?id=${userInfo?.userId}&tab=3`);
    } else {
      navigate('/personal?tab=3');
    }
  };

  // 更新收藏集
  const updateCollection = (newData: AddCollectionRes) => {
    setUpdateCollectInfo(newData);
  };

  // 在头部编辑收藏集
  const onHeadEditCollection = () => {
    setAddVisible(true);
    setHideCollectModel(true);
  };

  // 删除收藏集
  const onDeleteCollect = async () => {
    Modal.confirm({
      title: '确定删除该收藏集吗？',
      content: '删除收藏集同时也会移除收藏集中的文章',
      async onOk() {
        const res = normalizeResult<ArticleListResult>(
          await Service.delCollection({
            id: collectInfo?.id,
            userId: getUserInfo?.userId,
          })
        );
        if (res.success) {
          navigate('/personal?tab=3');
        } else {
          error(res.message);
        }
      },
    });
  };

  const newCollectInfo = useMemo(() => {
    return { ...collectInfo, ...updateCollectInfo };
  }, [updateCollectInfo, collectInfo]);

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
              <span>{updateCollectInfo?.name || collectInfo?.name}</span>
              {userInfo?.userId === getUserInfo?.userId && (
                <div className={styles.actions}>
                  <span className={styles.edit}>
                    <MIcons
                      name="icon-icon_bianji"
                      className={styles.lockIcon}
                      text="编辑"
                      onClick={onHeadEditCollection}
                    />
                  </span>
                  <span className={styles.delete}>
                    <MIcons
                      name="icon-shanchu"
                      className={styles.lockIcon}
                      text="删除"
                      onClick={onDeleteCollect}
                    />
                  </span>
                </div>
              )}
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
                <div className={styles.moreCollection} onClick={goBackToCollection}>
                  <span>更多收藏集</span>
                  <MIcons
                    name="icon-arrow-right-bold"
                    className={styles.rightIcon}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.content}>
            <Card
              list={articleList.list}
              wrapClass={styles.wrapClass}
              likeArticle={likeArticle}
              toDetail={toDetail}
              loadText="地主家也没余粮了"
              loading={loading}
              customRender
              moveTo={moveTo}
              removeArticle={removeArticle}
            />
          </div>
        </div>
      </Content>
      {htmlWidth <= 960 && <Footer />}
      <BackTop scrollTop={scrollTop} scrollbarRef={scrollbarRef} />
      <CollectionModal
        visible={visible}
        onCancel={() => setVisible(false)}
        getAddVisible={getAddVisible}
        moveArticleId={moveArticleId}
        getCollectRes={getCollectRes}
        getSelectCollectIds={getSelectCollectIds}
        selectCollectId={id}
      />
      {addVisible && (
        <AddCollection
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          showCollection={onCollection}
          hideCollectModel={hideCollectModel}
          collectInfo={hideCollectModel ? newCollectInfo : null}
          updateCollection={updateCollection}
        />
      )}
    </div>
  );
};

export default Collection;
