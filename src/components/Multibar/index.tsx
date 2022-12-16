import React, { useState, useEffect } from 'react';
import { Popover } from 'antd';
import classname from 'classname';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { shareQQ, shareSinaWeiBo, error, info } from '@/utils';
import Qrcode from '@/components/Qrcode';
import { useGetTheme, useVerifyToken } from '@/hooks';
import { EventBus } from '@/event';
import MIcons from '@/components/Icons';
import CollectionModal from '@/components/CollectionModel';
import CreateCollectModel from '@/components/CreateCollectModel';
import { ArticleDetailParams } from '@/typings/common';
import styles from './index.less';

interface IProps {
  id: string;
  detail: ArticleDetailParams;
  commentRef: any;
}

const Multibar: React.FC<IProps> = ({ id, detail, commentRef }) => {
  const [likeCount, setLikeCount] = useState<number | undefined>(0);
  const [isLike, setIsLike] = useState<boolean | undefined>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [collected, setCollected] = useState<boolean>(false);
  const [createCollectId, setCreateCollectId] = useState<string>('');
  const [commentCount, setCommentCount] = useState<number>(0);

  const { loginStatus } = useVerifyToken(true);
  const { themeMode } = useGetTheme();

  useEffect(() => {
    EventBus.onSetCommentCount.listen(() => {
      const count = EventBus.commentCount;
      setCommentCount(count);
    });
  }, []);

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
  }, [visible, id, loginStatus]);

  // 文章点赞
  const onLikeArticle = async () => {
    if (!id) return;
    if (!getUserInfo?.userId || !loginStatus.success) {
      info('请登录后再试');
      return;
    }
    const res = normalizeResult<{ id: string; isLike: boolean }>(
      await Service.likeArticle({ id, userId: getUserInfo?.userId })
    );
    if (!res.success) {
      res.code !== 401 && error(res.message);
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
    if (!getUserInfo?.userId || !loginStatus.success) {
      info('请登录后再试');
      return;
    }
    setVisible(true);
  };

  const onHideCollectModel = () => {
    setVisible(false);
    setCreateCollectId('');
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
    if (!getUserInfo?.userId || !loginStatus.success) return;
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
    if (!getUserInfo?.userId || !loginStatus.success) {
      info('请登录后再试');
      return;
    }
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

  // 获取新建的收藏集id
  const getCreateCollectId = (id: string) => {
    setCreateCollectId(id);
  };

  const shareContent = (
    <div className={styles.shareContent}>
      <Popover
        placement="top"
        trigger="hover"
        getPopupContainer={(triggerNode) => triggerNode as HTMLElement}
        content={<Qrcode />}
        overlayClassName={themeMode === 'dark' ? styles.overlayClassName : ''}
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
    <div className={classname(styles.Multibar, themeMode === 'dark' && styles.dark)}>
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
          name="icon-pinglun1"
          className={styles.commentIcon}
          onClick={onScrollToComment}
          customStyle
        />
        {commentCount > 0 && (
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
        overlayClassName={classname(
          styles.shareOverlayClassName,
          themeMode === 'dark' && styles.darkShareOverlayClassName
        )}
      >
        <div className={styles.actionBtn}>
          <MIcons name="icon-tiaoguofenxiang" className={styles.shareIcon} customStyle />
        </div>
      </Popover>
      <CollectionModal
        visible={visible}
        onCancel={onHideCollectModel}
        getAddVisible={getAddVisible}
        createCollectId={createCollectId}
      />
      <CreateCollectModel
        key={Math.random()}
        visible={addVisible}
        onCancel={() => setAddVisible(false)}
        showCollection={onCollection}
        getCreateCollectId={getCreateCollectId}
      />
    </div>
  );
};

export default Multibar;
