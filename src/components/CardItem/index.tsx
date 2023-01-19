import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useNavigate, useSearchParams } from 'react-router-dom';
import classname from 'classname';
import Image from '@/components/Image';
import MIcons from '@/components/Icons';
import useStore from '@/store';
import { formatGapTime, warn } from '@/utils';
import { useDebounce } from '@/hooks';
import { SSM } from '@/constant';
import { ArticleItem } from '@/typings/common';
import styles from './index.less';

interface IProps {
  list: ArticleItem[];
  total?: number;
  loading?: boolean;
  toDetail?: Function;
  deleteArticle?: Function;
  likeArticle?: Function;
  // eslint-disable-next-line no-unused-vars
  // removeArticle?: (id: string) => void;
  onEditArticle?: Function;
  // eslint-disable-next-line no-unused-vars
  // moveTo?(id: string): void;
  // skeletonRows?: number;
  // skeletonAvatar?: string;
  noMoreStyle?: string;
  htmlWidth?: number;
  themeMode?: string;
  fromPage?: boolean;
  timelineNoMoreText?: string;
  loadText?: string;
}

const CardItem: React.FC<IProps> = ({
  list,
  total,
  loading,
  toDetail,
  likeArticle,
  deleteArticle,
  onEditArticle,
  // removeArticle,
  // moveTo,
  themeMode,
  htmlWidth = 0,
  noMoreStyle,
  // skeletonRows = 3,
  // skeletonAvatar,
  fromPage,
  timelineNoMoreText,
  loadText,
}) => {
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const navigate = useNavigate();
  // const [search] = useSearchParams();
  // const authorId = search.get('authorId');

  const onEdit = (item: ArticleItem) => {
    onEditArticle && onEditArticle(item.id);
  };

  const onDelete = (item: ArticleItem) => {
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

  // 点击已下架文章
  const onClickDelete = useDebounce(() => {
    warn('该文章已下架');
  }, 200);

  return (
    <div className={styles.itemWrap}>
      {list?.length > 0 &&
        list.map((i) => (
          <div
            className={styles.cardItem}
            key={i.id}
            onClick={() => (i.isDelete ? onClickDelete() : toDetail && toDetail(i.id))}
          >
            <div className={styles.imageWrap}>
              <Image
                className={classname(styles.image)}
                url={i.coverImage || SSM}
                transitionImg={SSM}
              />
              <div className={styles.articleInfo}>
                <div className={styles.title}>
                  <div className={styles.left}>{i.title}</div>
                  {(getUserInfo?.auth === 1 || i.authorId === getUserInfo?.userId) && (
                    <div className={styles.right}>
                      {i.authorId === getUserInfo?.userId && (
                        <MIcons
                          name="icon-icon_bianji"
                          text="编辑"
                          className={styles.editIcon}
                          textStyle={styles.editTextStyle}
                          onClick={() => onEdit(i)}
                        />
                      )}
                      <MIcons
                        name="icon-shanchu"
                        text="下架"
                        className={styles.delIcon}
                        textStyle={styles.delTextStyle}
                        onClick={() => onDelete(i)}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.abstract}>{i.abstract}</div>
                <div className={styles.info}>
                  <span onClick={(e) => toPersonal(e as unknown as MouseEvent, i.authorId)}>
                    作者：<span className={styles.tag}>{i?.authorName}</span>
                  </span>
                  <span
                    className={classname(
                      styles.classify,
                      themeMode === 'dark' && styles.dark && styles.darkClassify
                    )}
                    onClick={(e) => toTagList(e as unknown as MouseEvent, i.tag)}
                  >
                    标签：
                    <span className={styles.tag}>{i.tag}</span>
                  </span>
                  <span onClick={(e) => toClassify(e as unknown as MouseEvent, i.classify)}>
                    分类：
                    <span className={styles.tag}>{i.classify}</span>
                  </span>
                  <span
                    className={classname(
                      styles.date,
                      themeMode === 'dark' && styles.dark && styles.darkDate
                    )}
                  >
                    {formatGapTime(i.createTime)}
                  </span>
                </div>
                <div className={styles.action}>
                  <div className={styles.icons}>
                    <div className={styles.iconList}>
                      <MIcons
                        name={`${i.isLike ? 'icon-24gf-thumbsUp2' : 'icon-24gl-thumbsUp2'}`}
                        text={i.likeCount > 0 ? i.likeCount : '点赞'}
                        iconWrapClass={styles.iconWrap}
                        className={classname(i.isLike ? styles.isLike : styles.icon)}
                        textStyle={styles.textStyle}
                        onClick={() => likeArticle && likeArticle(i.id)}
                      />
                      <MIcons
                        name="icon-comment"
                        text={i.commentCount ? i.commentCount : '评论'}
                        iconWrapClass={styles.iconWrap}
                        onClick={() => toDetail && toDetail(i.id, true)}
                        className={styles.icon}
                        textStyle={styles.textStyle}
                      />
                      <MIcons
                        name="icon-yanjing"
                        text={i.readCount > 0 ? i.readCount : '阅读'}
                        iconWrapClass={styles.iconWrap}
                        className={(styles.eyes, styles.icon)}
                        textStyle={styles.textStyle}
                      />
                    </div>
                    {htmlWidth < 960 && (
                      <div className={styles.classifyWrap}>
                        <span
                          onClick={(e) =>
                            toPersonal(e as unknown as MouseEvent, i.authorId)
                          }
                        >
                          {i?.authorName?.length > 10
                            ? `${i?.authorName.slice(0, 10)}...`
                            : i?.authorName}
                        </span>
                        <span
                          className={classname(
                            styles.classifyTag,
                            themeMode === 'dark' && styles.darkClassifyTag
                          )}
                          onClick={(e) =>
                            toClassify(e as unknown as MouseEvent, i.classify)
                          }
                        >
                          {i.classify}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      {!loading && list.length === total ? (
        <div
          className={classname(
            styles.noMore,
            noMoreStyle,
            themeMode === 'dark' && styles.darkNoMore
          )}
        >
          {list.length > 0
            ? `${timelineNoMoreText || ''}共 (${list.length})
          篇，${loadText || '已是全部家当'}～～～`
            : `共(${list.length})
            篇，空空如也～～～`}
        </div>
      ) : (
        <div
          className={classname(
            styles.noMore,
            noMoreStyle,
            themeMode === 'dark' && styles.darkNoMore
          )}
        >
          loading...
        </div>
      )}
    </div>
  );
};

export default CardItem;
