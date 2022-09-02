import React, { CSSProperties } from 'react';
import { Skeleton, Popover } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import classname from 'classname';
import { formatGapTime } from '@/utils';
import useStore from '@/store';
import { useHtmlWidth } from '@/hooks';
import Image from '@/components/Image';
import { CARD_URL } from '@/constant';
import MIcons from '@/components/Icons';
import { ArticleItem } from '@/typings/common';
import styles from './index.less';

interface IProps {
  list: ArticleItem[];
  toDetail?: Function;
  wrapClass?: string;
  itemClass?: string;
  imgWrapStyle?: string;
  imgWrapClass?: string;
  cardImgWrapStyle?: string;
  descClass?: string;
  skeletonRows?: number;
  skeletonAvatar?: string;
  deleteArticle?: Function;
  likeArticle?: Function;
  onEditArticle?: Function;
  showClassify?: boolean;
  showInfo?: boolean;
  loadText?: string;
  loading?: boolean;
  style?: CSSProperties;
}

const Card: React.FC<IProps> = ({
  list,
  toDetail,
  wrapClass,
  itemClass,
  imgWrapStyle,
  imgWrapClass,
  cardImgWrapStyle,
  descClass,
  skeletonRows = 3,
  skeletonAvatar,
  deleteArticle,
  likeArticle,
  onEditArticle,
  showClassify = true,
  showInfo,
  loadText,
  loading,
  style,
}) => {
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { htmlWidth } = useHtmlWidth();

  const content = (item: ArticleItem) => {
    return (
      <>
        {getUserInfo?.userId === item.authorId && (
          <div
            onClick={(e) => onEdit(e, item)}
            className={classname(styles.edit, styles.btn)}
          >
            编辑
          </div>
        )}
        <div onClick={(e) => onDelete(e, item)} className={styles.btn}>
          下架
        </div>
      </>
    );
  };

  const onEdit = (e: any, item: ArticleItem) => {
    e.stopPropagation();
    onEditArticle && onEditArticle(item.id);
  };

  const onDelete = (e: any, item: ArticleItem) => {
    e.stopPropagation();
    deleteArticle && deleteArticle(item.id);
  };

  return (
    <div className={classname(styles.wrap, wrapClass)} style={style}>
      {list && list.length > 0 ? (
        list.map((i) => (
          <div
            className={classname(styles.item, itemClass)}
            key={i.id}
            onClick={() => toDetail && toDetail(i.id)}
          >
            {htmlWidth > 960 && (
              <div className={classname(imgWrapStyle, styles.imgWrap)}>
                <div className={styles.text}>{i.title}</div>
                <div className={classname(styles.cardImgWrap, cardImgWrapStyle)}>
                  <Image
                    url={i.coverImage || CARD_URL}
                    transitionImg={CARD_URL}
                    className={classname(styles.image, imgWrapClass)}
                    imageScaleStyle={styles.imageScaleStyle}
                  />
                </div>
              </div>
            )}
            <div className={styles.info}>
              <div className={styles.name}>{i.title}</div>
              {htmlWidth > 960 && (
                <div className={descClass || styles.desc}>{i.abstract}</div>
              )}
              {htmlWidth <= 960 && (
                <div className={styles.mobileDesc}>
                  <div className={descClass || styles.desc}>{i.abstract}</div>
                  <div className={styles.mobileImgWrap}>
                    <Image
                      url={i.coverImage || CARD_URL}
                      transitionImg={CARD_URL}
                      className={classname(styles.image, imgWrapClass)}
                      imageScaleStyle={styles.imageScaleStyle}
                    />
                  </div>
                </div>
              )}
              {showClassify && htmlWidth > 960 && (
                <div className={styles.classifyInfo}>
                  <span>{i?.authorName}</span>
                  <span className={styles.classify}>
                    标签：
                    {i.tag}
                  </span>
                  <span>
                    分类：
                    {i.classify}
                  </span>
                  <span className={styles.date}>{formatGapTime(i.createTime)}</span>
                </div>
              )}
              <div className={styles.action}>
                <div className={styles.icons}>
                  <MIcons
                    name={`${i.isLike ? 'icon-24gf-thumbsUp2' : 'icon-24gl-thumbsUp2'}`}
                    text={i.likeCount > 0 ? i.likeCount : '点赞'}
                    iconWrapClass={styles.iconWrap}
                    className={i.isLike ? styles.isLike : null}
                    onClick={() => likeArticle && likeArticle(i.id)}
                  />
                  <MIcons
                    name="icon-comment"
                    text={i.replyCount > 0 ? i.replyCount : '评论'}
                    iconWrapClass={styles.iconWrap}
                    onClick={() => toDetail && toDetail(i.id, true)}
                  />
                </div>
                {(getUserInfo?.userId === i.authorId || getUserInfo?.auth === 1) && (
                  <Popover
                    placement="left"
                    content={() => content(i)}
                    trigger="hover"
                    zIndex={12}
                  >
                    <EllipsisOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </Popover>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={classname(styles.item, itemClass, styles.skeletonWrap)}>
          <Skeleton.Image className={classname(styles.skeletonAvatar, skeletonAvatar)} />
          <Skeleton active title paragraph={{ rows: skeletonRows }} />
        </div>
      )}
      {showInfo &&
        (!loading ? (
          <div className={styles.noMore}>
            {list.length > 0
              ? `共(${list.length})
          篇，${loadText || '已是全部家当'}～～～`
              : `共(${list.length})
            篇，空空如也～～～`}
          </div>
        ) : (
          <div className={styles.noMore}>loading...</div>
        ))}
    </div>
  );
};

export default Card;
