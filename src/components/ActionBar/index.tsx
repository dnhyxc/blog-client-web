import React, { useState, useEffect } from 'react';
import classname from 'classname';
import MIcons from '@/components/Icons';
import ActionIcon from '@/components/ActionIcon';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { error } from '@/utils';
import CreateCollectModel from '@/components/CreateCollectModel';
import CollectionDrawer from '@/components/CollectionDrawer';
import TocDrawer from '@/components/TocDrawer';
import { ArticleDetailParams } from '@/typings/common';
import styles from './index.less';

interface IProps {
  id: string;
  detail: ArticleDetailParams;
  commentRef: any;
  commentCount: number;
}

const ActionBar: React.FC<IProps> = ({ id, detail, commentRef, commentCount }) => {
  const [barVisible, setBarVisible] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number | undefined>(0);
  const [isLike, setIsLike] = useState<boolean | undefined>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [collected, setCollected] = useState<boolean>(false);
  const [tocVisible, setTocVisible] = useState<boolean>(false);

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  useEffect(() => {
    setLikeCount(detail?.likeCount);
    setIsLike(detail?.isLike);
  }, [detail]);

  useEffect(() => {
    if (!visible) {
      getCollectionStatus();
    }
  }, [visible, id]);

  // 切换menu
  const onToggleActionBar = () => {
    setBarVisible(!barVisible);
  };

  // 滚动到评论
  const onScrollToComment = () => {
    if (!commentRef.current) return;
    const { offsetTop } = commentRef.current;
    document.documentElement.scrollTop = offsetTop;
  };

  // 显示目录
  const onShowToc = () => {
    setTocVisible(true);
  };

  // 文章点赞
  const onLikeArticle = async () => {
    if (!id) return;
    const res = normalizeResult<{ id: string; isLike: boolean }>(
      await Service.likeArticle({ id, userId: getUserInfo?.userId })
    );
    if (!res.success) {
      error(res.message);
      return;
    }
    setIsLike(res.data.isLike);
    if (isLike) {
      setLikeCount(likeCount! - 1);
    } else {
      setLikeCount(likeCount! + 1);
    }
  };

  // 获取收藏状态
  const getCollectionStatus = async () => {
    const res = normalizeResult<{ collected: boolean }>(
      await Service.checkCollectionStatus({
        articleId: id,
        userId: getUserInfo?.userId,
      })
    );
    if (res.success) {
      setCollected(res.data.collected);
    }
  };

  // 收藏
  const onCollection = () => {
    setVisible(true);
  };

  // 取消收藏
  const cancelCollected = async () => {
    const res = normalizeResult<number>(
      await Service.cancelCollected({
        articleId: id,
        userId: getUserInfo?.userId,
      })
    );
    if (res.success) {
      getCollectionStatus();
    } else {
      error(res.message);
    }
  };

  return (
    <div className={styles.ActionBar}>
      <ActionIcon
        className={styles.changeIconWrap}
        onClick={onToggleActionBar}
        icon={!barVisible ? 'icon-arrow-right-bold' : 'icon-arrow-left-bold'}
      />
      <div className={classname(styles.container, barVisible && styles.showBar)}>
        <div className={styles.actionBtn}>
          <MIcons
            name="icon-mulu"
            className={styles.tocIcon}
            onClick={onShowToc}
            customStyle
          />
        </div>
        <div className={styles.actionBtn}>
          <MIcons
            name="icon-pinglun1"
            className={styles.commentIcon}
            onClick={onScrollToComment}
            customStyle
          />
          {commentCount > 0 && (
            <span className={styles.likeCount}>
              {commentCount > 999 ? (
                <span title={(commentCount && JSON.stringify(commentCount)) || ''}>
                  999+
                </span>
              ) : (
                commentCount
              )}
            </span>
          )}
        </div>
        <div className={styles.actionBtn}>
          <MIcons
            name="icon-24gf-thumbsUp2"
            className={classname(styles.actionIcon, isLike && styles.likeActionIcon)}
            onClick={onLikeArticle}
            customStyle
          />
          {likeCount! > 0 && <span className={styles.likeCount}>{likeCount}</span>}
        </div>
        <div className={styles.actionBtn}>
          <MIcons
            name="icon-31shoucangxuanzhong"
            className={classname(styles.collectionIcon, collected && styles.collectedIcon)}
            onClick={collected ? cancelCollected : onCollection}
            customStyle
          />
        </div>
      </div>
      <CollectionDrawer
        visible={visible}
        onCancel={() => setVisible(false)}
        showCollectionDrawer={onCollection}
      />
      <CreateCollectModel
        key={Math.random()}
        visible={addVisible}
        onCancel={() => setAddVisible(false)}
        showCollection={onCollection}
      />
      <TocDrawer
        key={detail?.content}
        detail={detail}
        visible={tocVisible}
        onCancel={() => setTocVisible(false)}
      />
    </div>
  );
};

export default ActionBar;
