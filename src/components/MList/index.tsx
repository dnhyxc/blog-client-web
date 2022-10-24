import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton } from 'antd';
import classname from 'classname';
import useStore from '@/store';
import { useHtmlWidth } from '@/hooks';
import { formatDate } from '@/utils';
import { ArticleItem, AddCollectionRes } from '@/typings/common';
import MIcons from '../Icons';
import CreateCollectModel from '../CreateCollectModel';
import CreateDrawer from '../CreateDrawer';
import styles from './index.less';

interface IProps {
  list: ArticleItem[];
  loading: boolean;
  collectTotal?: number;
  total?: number;
  visible?: boolean;
  collectedCount?: number;
  onHide?: Function;
  onShow?: Function;
  getAddRes?: Function;
  delCollection?: Function;
  updateCollection?: Function;
  authorId?: string | null;
  itemClass?: string;
  skeletonRows?: number;
}

const MList: React.FC<IProps> = ({
  list,
  collectTotal,
  total,
  loading,
  collectedCount,
  visible,
  onHide,
  onShow,
  getAddRes,
  delCollection,
  updateCollection,
  authorId,
  itemClass, // 骨架样式
  skeletonRows = 2,
}) => {
  const [collectInfo, setCollectInfo] = useState<AddCollectionRes>({ id: '' });
  const navigate = useNavigate();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { htmlWidth } = useHtmlWidth();

  const toClolection = (id: string) => {
    navigate(`/collection/${id}?authorId=${authorId || getUserInfo?.userId}`);
  };

  const onEdit = (i: AddCollectionRes) => {
    setCollectInfo(i);
    onShow && onShow();
  };

  const onDelete = (id: string) => {
    delCollection && delCollection(id);
  };

  return (
    <div className={styles.collectionWrap}>
      {list?.length > 0 && (
        <div className={styles.collectionHeader}>
          <div className={styles.collectCount}>
            <div className={styles.listCount}>{`我创建的 ${collectTotal}`}</div>
            <div className={styles.count}>{`我收藏的文章 ${collectedCount}`}</div>
          </div>
          {(!authorId || authorId === getUserInfo?.userId) && (
            <div>
              <Button
                type="link"
                className={styles.addCollect}
                onClick={() => onShow && onShow()}
              >
                <MIcons name="icon-add" className={styles.addIcon} />
                &nbsp;新建收藏集
              </Button>
            </div>
          )}
        </div>
      )}
      {list?.length ? (
        list.map((i) => {
          return (
            <div
              key={i.id}
              className={styles.collectionItem}
              onClick={() => toClolection(i.id)}
            >
              <div className={styles.desc}>
                <div className={styles.collectionName}>
                  <span>{i.name}</span>
                  {i.status === 2 && (
                    <MIcons name="icon-lock-full" className={styles.lockIcon} />
                  )}
                </div>
                <div className={styles.collectDesc}>{i.desc}</div>
                <div className={styles.collectionCount}>
                  <span>
                    {formatDate(i.createTime, 'YYYY-DD-MM')}更新 · {i.articleIds?.length}
                    篇文章
                  </span>
                  {(!authorId || authorId === getUserInfo?.userId) && (
                    <div className={styles.acrions}>
                      <span className={styles.edit}>
                        <MIcons
                          name="icon-icon_bianji"
                          iconWrapClass={styles.iconWrapClass}
                          text="编辑"
                          customStyle
                          onClick={() => onEdit(i as unknown as AddCollectionRes)}
                        />
                      </span>
                      <span className={styles.delete}>
                        <MIcons
                          name="icon-shanchu"
                          iconWrapClass={styles.iconWrapClass}
                          text="删除"
                          customStyle
                          onClick={() => onDelete(i.id)}
                        />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className={classname(styles.collectionItem, itemClass, styles.skeletonWrap)}>
          <Skeleton active title paragraph={{ rows: skeletonRows }} />
        </div>
      )}
      {!loading && total === list?.length ? (
        <div className={styles.loading}>
          {`共(${list?.length})
      条，空空如也～～～`}
        </div>
      ) : (
        <div className={styles.loading}>loading...</div>
      )}
      {htmlWidth > 906 ? (
        <CreateCollectModel
          key={collectInfo?.name || collectInfo?.desc || collectInfo?.status}
          visible={!!visible}
          onCancel={() => onHide && onHide()}
          callback={getAddRes}
          updateCollection={updateCollection}
          collectInfo={collectInfo}
        />
      ) : (
        <CreateDrawer
          key={collectInfo?.name || collectInfo?.desc || collectInfo?.status}
          visible={!!visible}
          onCancel={() => onHide && onHide()}
          callback={getAddRes}
          updateCollection={updateCollection}
          collectInfo={collectInfo}
        />
      )}
    </div>
  );
};

export default MList;
