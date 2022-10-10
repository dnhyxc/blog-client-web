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
import AddCollection from './AddCollection';
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

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  useEffect(() => {
    setLikeCount(detail?.likeCount);
    setIsLike(detail?.isLike);
  }, [detail]);

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
    console.log('收藏');
    setVisible(true);
  };

  // 滚动到评论
  const onScrollToComment = () => {
    if (!commentRef.current) return;
    const { offsetTop } = commentRef.current;
    document.documentElement.scrollTop = offsetTop;
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
          <MIcons
            name="icon-xinlangweibo"
            className={styles.weiboIcon}
            onClick={() => shareSinaWeiBo(detail?.title!, detail?.coverImage)}
          />
        </div>
        <span>新浪微博</span>
      </div>
      <div
        className={styles.shareQZon}
        onClick={() => shareQQ(detail?.title!, detail?.coverImage)}
      >
        <div>
          <MIcons
            name="icon-qq"
            className={styles.qqIcon}
            onClick={() => shareQQ(detail?.title!, detail?.coverImage)}
          />
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
          className={styles.collectionIcon}
          onClick={onCollection}
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
      <CollectionModal visible={visible} onCancel={() => setVisible(false)} />
      <AddCollection />
    </div>
  );
};

export default Multibar;
