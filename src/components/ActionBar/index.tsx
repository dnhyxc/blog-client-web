import React, { useState, useEffect, useRef } from 'react';
import classname from 'classname';
import { useLocation } from 'react-router-dom';
import MIcons from '@/components/Icons';
import ActionIcon from '@/components/ActionIcon';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { EventBus } from '@/event';
import { useVerifyToken } from '@/hooks';
import { error } from '@/utils';
import { show, close } from '@/components/Render';
import CreateCollectModel from '@/components/CreateCollectModel';
import CollectionDrawer from '@/components/CollectionDrawer';
import TocDrawer from '@/components/TocDrawer';
import { sendMessage } from '@/socket';
import { ArticleDetailParams } from '@/typings/common';
import styles from './index.less';

interface IProps {
  id: string;
  detail: ArticleDetailParams;
  commentRef: any;
  className?: string;
  themeMode?: string;
  htmlWidth?: number;
}

const ActionBar: React.FC<IProps> = ({
  id,
  detail,
  commentRef,
  className,
  themeMode,
  htmlWidth = 0,
}) => {
  const [barVisible, setBarVisible] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number | undefined>(0);
  const [isLike, setIsLike] = useState<boolean | undefined>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [collected, setCollected] = useState<boolean>(false);
  const [tocVisible, setTocVisible] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [onNode, setOnNode] = useState<boolean>(false);

  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { pathname, search } = useLocation();
  const { loginStatus } = useVerifyToken(true, false, true);
  const timerRef = useRef<any>(null);
  const timer = useRef<any>(null);

  useEffect(() => {
    // actionBar 没有展开或者鼠标放在actionBar中时，不关闭
    if (!show || onNode) return;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    timer.current = setTimeout(() => {
      setBarVisible(false);
    }, 5000);
    return () => {
      clearTimeout(timer.current);
      timer.current = null;
    };
  }, [barVisible, onNode]);

  useEffect(() => {
    EventBus.onSetCommentCount.listen(() => {
      const count = EventBus.commentCount;
      setCommentCount(count);
    });
  }, []);

  useEffect(() => {
    setLikeCount(detail?.likeCount);
    setIsLike(detail?.isLike);
  }, [detail]);

  useEffect(() => {
    if (!visible) {
      getCollectionStatus();
    }
  }, [visible, id, loginStatus]);

  const onMouseEnter = () => {
    setOnNode(true);
  };

  const onMouseLeave = () => {
    setOnNode(false);
  };

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

  // 关闭alert弹窗
  const closeAlert = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = setTimeout(() => {
      close();
    }, 5000);
  };

  // 文章点赞
  const onLikeArticle = async () => {
    if (!id) return;
    if (!getUserInfo?.userId || !loginStatus.success) {
      show({ pathname, search });
      closeAlert();
      return;
    }
    const res = normalizeResult<{ id: string; isLike: boolean }>(
      await Service.likeArticle({ id, userId: getUserInfo?.userId })
    );
    if (!res.success) {
      if (res.code !== 401) {
        show({ pathname, search });
        closeAlert();
      }
      return;
    }
    setIsLike(res.data.isLike);
    if (isLike) {
      setLikeCount(likeCount! - 1);
    } else {
      setLikeCount(likeCount! + 1);
    }

    // 给别人点赞或取消点赞之后推送websocket消息
    if (getUserInfo?.userId !== detail?.authorId) {
      const data = { ...detail };
      // @ts-ignore
      delete data.content;
      sendMessage(
        JSON.stringify({
          action: 'push',
          data: {
            ...data,
            articleId: id,
            toUserId: data?.authorId,
            fromUsername: getUserInfo?.username,
            fromUserId: getUserInfo?.userId,
            action: isLike ? 'LIKE_ARTICLE' : 'CANCEL_LIKE_ARTICLE',
          },
          userId: getUserInfo?.userId!,
        })
      );
    }
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

  // 收藏
  const onCollection = () => {
    if (!getUserInfo?.userId || !loginStatus.success) {
      show({ pathname, search });
      closeAlert();
      return;
    }
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
    } else if (res.code === 409) {
      show({ pathname, search });
      closeAlert();
    } else {
      error(res.message);
    }
  };

  return (
    <div
      className={classname(styles.ActionBar, className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ActionIcon
        className={classname(
          styles.changeIconWrap,
          themeMode === 'dark' && styles.darkIconWrap
        )}
        onClick={onToggleActionBar}
        type="actionbar"
        icon={!barVisible ? 'icon-arrow-right-bold' : 'icon-arrow-left-bold'}
        themeMode={themeMode}
        htmlWidth={htmlWidth}
      />
      <div className={classname(styles.container, barVisible && styles.showBar, className)}>
        {detail?.content.includes('#') && (
          <div className={styles.actionBtn}>
            <MIcons
              name="icon-mulu"
              className={styles.tocIcon}
              onClick={onShowToc}
              customStyle
            />
          </div>
        )}
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
        themeMode={themeMode}
      />
      <CreateCollectModel
        key={Math.random()}
        visible={addVisible}
        onCancel={() => setAddVisible(false)}
        showCollection={onCollection}
        themeMode={themeMode}
      />
      <TocDrawer
        key={detail?.content}
        detail={detail}
        visible={tocVisible}
        onCancel={() => setTocVisible(false)}
        themeMode={themeMode}
      />
    </div>
  );
};

export default ActionBar;
