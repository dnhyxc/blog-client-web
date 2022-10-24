/* eslint-disable no-unused-vars */
import React, { CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Skeleton, Popover, Modal } from 'antd';
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
  total?: number;
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
  removeArticle?: (id: string) => void;
  onEditArticle?: Function;
  moveTo?(id: string): void;
  showClassify?: boolean;
  loadText?: string;
  loading?: boolean;
  style?: CSSProperties;
  fromPage?: boolean;
  customRender?: boolean;
}

const Card: React.FC<IProps> = ({
  list,
  total,
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
  loadText,
  loading,
  style,
  fromPage,
  customRender,
  moveTo,
  removeArticle,
}) => {
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { htmlWidth } = useHtmlWidth();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const authorId = search.get('authorId');

  const renderAction = (id: string) => {
    const onRemoveArticle = (id: string) => {
      Modal.confirm({
        className: htmlWidth < 960 ? styles.removeArticleConfirm : '',
        title: '确定移除该文章吗？',
        content: '移除后，该文章将从当前收藏集中删除',
        centered: htmlWidth < 960,
        width: htmlWidth < 960 ? '80%' : '',
        onOk() {
          removeArticle && removeArticle(id);
        },
      });
    };

    return (
      <div className={styles.actions}>
        <span className={styles.edit}>
          <MIcons
            name="icon-table_move-o"
            iconWrapClass={styles.iconWrapClass}
            text="转移"
            onClick={() => moveTo && moveTo(id)}
          />
        </span>
        <span className={styles.delete}>
          <MIcons
            name="icon-shanchu"
            iconWrapClass={styles.iconWrapClass}
            text="移除"
            onClick={() => onRemoveArticle(id)}
          />
        </span>
      </div>
    );
  };

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

  const toClassify = (e: Event, classify: string) => {
    e.stopPropagation();
    navigate(`/classify?classify=${classify}`);
  };

  const toTagList = (e: MouseEvent, tag: string) => {
    e.stopPropagation();
    navigate(`/tag/list?tagName=${tag}`);
  };

  const toPersonal = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    if (fromPage || id !== getUserInfo?.userId) {
      window.location.href = `/personal?id=${id}`;
      // navigate(`/personal?id=${id}&tab=1`);
    } else {
      navigate(`/personal?id=${id}`);
    }
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
              <div className={styles.name}>
                <span>{i.title}</span>
                {(getUserInfo?.userId === i.authorId || getUserInfo?.auth === 1) &&
                  (customRender ? (
                    authorId === getUserInfo?.userId && renderAction(i.id)
                  ) : (
                    <Popover
                      placement="left"
                      content={() => content(i)}
                      trigger="hover"
                      className={styles.popover}
                      zIndex={12}
                    >
                      <EllipsisOutlined
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </Popover>
                  ))}
              </div>
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
                  <span onClick={(e) => toPersonal(e as unknown as MouseEvent, i.authorId)}>
                    {i?.authorName}
                  </span>
                  <span
                    className={styles.classify}
                    onClick={(e) => toTagList(e as unknown as MouseEvent, i.tag)}
                  >
                    标签：
                    {i.tag}
                  </span>
                  <span onClick={(e) => toClassify(e as unknown as MouseEvent, i.classify)}>
                    分类：
                    {i.classify}
                  </span>
                  <span className={styles.date}>{formatGapTime(i.createTime)}</span>
                </div>
              )}
              <div className={styles.action}>
                <div className={styles.icons}>
                  <div>
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
                  {htmlWidth < 960 && (
                    <div className={styles.classifyWrap}>
                      <span
                        onClick={(e) => toPersonal(e as unknown as MouseEvent, i.authorId)}
                      >
                        {i?.authorName?.length > 10
                          ? `${i?.authorName.slice(0, 10)}...`
                          : i?.authorName}
                      </span>
                      <span
                        className={styles.classifyTag}
                        onClick={(e) => toClassify(e as unknown as MouseEvent, i.classify)}
                      >
                        {i.classify}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : htmlWidth > 960 ? (
        <div className={classname(styles.item, itemClass, styles.skeletonWrap)}>
          <Skeleton.Image className={classname(styles.skeletonAvatar, skeletonAvatar)} />
          <Skeleton active title paragraph={{ rows: skeletonRows }} />
        </div>
      ) : (
        <div className={classname(styles.item, itemClass, styles.skeletonWrap)}>
          <Skeleton active title paragraph={{ rows: skeletonRows }} />
          <Skeleton.Image className={classname(styles.skeletonAvatar, skeletonAvatar)} />
        </div>
      )}
      {!loading && list.length === total ? (
        <div className={styles.noMore}>
          {list.length > 0
            ? `共(${list.length})
          篇，${loadText || '已是全部家当'}～～～`
            : `共(${list.length})
            篇，空空如也～～～`}
        </div>
      ) : (
        <div className={styles.noMore}>loading...</div>
      )}
    </div>
  );
};

export default Card;
