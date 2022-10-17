import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { formatDate } from '@/utils';
import { ArticleItem } from '@/typings/common';
import MIcons from '../Icons';
import AddCollection from '../AddCollection';
import styles from './index.less';

interface IProps {
  list: ArticleItem[];
  loading: boolean;
  visible?: boolean;
  collectedCount?: number;
  onHide?: Function;
  onShow?: Function;
  getAddRes?: Function;
  delCollection?: Function;
}

const MList: React.FC<IProps> = ({
  list,
  loading,
  collectedCount,
  visible,
  onHide,
  onShow,
  getAddRes,
  delCollection,
}) => {
  const navigate = useNavigate();

  const toClolection = (id: string) => {
    navigate(`/collection/${id}`);
  };

  const onEdit = (id: string) => {
    console.log(id, 'id>>>edit');
  };

  const onDelete = (id: string) => {
    console.log(id, 'id>>>delete');
    delCollection && delCollection(id);
  };

  return (
    <div className={styles.collectionWrap}>
      {list?.length > 0 && (
        <div className={styles.collectionHeader}>
          <div className={styles.collectCount}>
            <div className={styles.listCount}>{`我收藏的 ${list?.length}`}</div>
            <div className={styles.count}>{`我收藏的文章共 ${collectedCount} 篇`}</div>
          </div>
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
        </div>
      )}
      {list.map((i) => {
        return (
          <div key={i.id} className={styles.collectionItem} onClick={() => toClolection(i.id)}>
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
                  {formatDate(i.createTime, 'YYYY-DD-MM')}更新 · {i.count}
                  篇文章
                </span>
                <div className={styles.acrions}>
                  <span className={styles.edit}>
                    <MIcons name="icon-icon_bianji" className={styles.lockIcon} text="编辑" customStyle onClick={() => onEdit(i.id)} />
                  </span>
                  <span className={styles.delete}>
                    <MIcons name="icon-shanchu" className={styles.lockIcon} text="删除" customStyle onClick={() => onDelete(i.id)} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {!loading && list.length !== 0 ? (
        <div className={styles.loading}>
          {`共(${list?.length})
      条，空空如也～～～`}
        </div>
      ) : (
        <div className={styles.loading}>loading...</div>
      )}
      <AddCollection
        visible={!!visible}
        onCancel={() => onHide && onHide()}
        callback={getAddRes}
      />
    </div>
  );
};

export default MList;