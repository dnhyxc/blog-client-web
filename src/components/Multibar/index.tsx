import React, { useState, useEffect } from 'react';
import { Popover } from 'antd';
import classname from 'classname';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { shareQQ, shareSinaWeiBo, error } from '@/utils';
import { ArticleDetailParams } from '@/typings/common';
import Qrcode from '../Qrcode';
import MIcons from '../Icons';
import CollectionModal from './Collection';
import AddCollection from '../AddCollection';
import styles from './index.less';

interface IProps {
  id: string;
  detail: ArticleDetailParams;
  commentRef: any;
  commentCount: number;
}

const Multibar: React.FC<IProps> = ({ id, detail, commentRef, commentCount }) => {
  const [likeCount, setLikeCount] = useState<number | undefined>(0);
  const [isLike, setIsLike] = useState<boolean | undefined>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [collected, setCollected] = useState<boolean>(false);

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
  }, [visible]);

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

  // 收藏
  const onCollection = () => {
    setVisible(true);
  };

  // 滚动到评论
  const onScrollToComment = () => {
    if (!commentRef.current) return;
    const { offsetTop } = commentRef.current;
    document.documentElement.scrollTop = offsetTop;
  };

  const getAddVisible = (value: boolean) => {
    setAddVisible(value);
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

  const shareContent = (
    <div className={styles.shareContent}>
      <Popover
        placement="top"
        trigger="hover"
        getPopupContainer={(triggerNode) => triggerNode as HTMLElement}
        content={<Qrcode />}
        overlayClassName={styles.overlayClassName}
      >
        <div className={styles.wechart}>
          <div>
            <MIcons name="icon-weixin1" className={styles.wechartIcon} />
          </div>
          <span>微信</span>
        </div>
      </Popover>
      <div
        className={styles.weibo}
        onClick={() => shareSinaWeiBo(detail?.title!, detail?.coverImage)}
      >
        <div>
          <MIcons name="icon-xinlangweibo" className={styles.weiboIcon} noStopPropagation />
        </div>
        <span>新浪微博</span>
      </div>
      <div
        className={styles.shareQZon}
        onClick={() => shareQQ(detail?.title!, detail?.coverImage)}
      >
        <div>
          <MIcons name="icon-qq" className={styles.qqIcon} noStopPropagation />
        </div>
        <span>QQ</span>
      </div>
    </div>
  );

  return (
    <div className={styles.Multibar}>
      <div className={styles.actionBtn}>
        <MIcons
          name="icon-24gf-thumbsUp2"
          className={classname(styles.actionIcon, isLike && styles.likeActionIcon)}
          onClick={onLikeArticle}
          customStyle
        />
        {likeCount && <span className={styles.likeCount}>{likeCount}</span>}
      </div>
      <div className={styles.actionBtn}>
        <MIcons
          name="icon-pinglun1"
          className={styles.commentIcon}
          onClick={onScrollToComment}
          customStyle
        />
        {commentCount && (
          <span className={styles.likeCount}>
            {commentCount > 999 ? (
              <span title={(commentCount && JSON.stringify(commentCount)) || ''}>999+</span>
            ) : (
              commentCount
            )}
          </span>
        )}
      </div>
      <div className={styles.actionBtn}>
        <MIcons
          name="icon-31shoucangxuanzhong"
          className={classname(styles.collectionIcon, collected && styles.collectedIcon)}
          onClick={collected ? cancelCollected : onCollection}
          customStyle
        />
      </div>
      <Popover
        placement="rightTop"
        trigger="hover"
        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
        content={shareContent}
        overlayClassName={styles.shareOverlayClassName}
      >
        <div className={styles.actionBtn}>
          <MIcons name="icon-tiaoguofenxiang" className={styles.shareIcon} customStyle />
        </div>
      </Popover>
      <CollectionModal
        visible={visible}
        onCancel={() => setVisible(false)}
        getAddVisible={getAddVisible}
      />
      <AddCollection
        visible={addVisible}
        onCancel={() => setAddVisible(false)}
        showCollection={onCollection}
      />
    </div>
  );
};

export default Multibar;