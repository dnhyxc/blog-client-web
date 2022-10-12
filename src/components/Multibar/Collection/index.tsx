import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Button } from 'antd';
import Content from '@/components/Content';
import MIcons from '@/components/Icons';
import useStore from '@/store';
import * as Service from '@/service';
import { PAGESIZE } from '@/constant';
// import { normalizeResult, error, success } from '@/utils';
// import { AddCollectionRes } from '@/typings/common';
import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: Function;
  getAddVisible: Function;
}

const CollectionModal: React.FC<IProps> = ({ visible, onCancel, getAddVisible }) => {
  const [checkedItem, setCheckedItem] = useState<string[]>([]);

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  useEffect(() => {
    if (visible) {
      getCollectionList();
    }
  }, [visible]);

  const getCollectionList = async () => {
    if (!getUserInfo?.userId) return;
    const res = await Service.getCollectionList({
      pageNo: 1,
      pageSize: PAGESIZE,
      userId: getUserInfo.userId,
    });

    console.log(res, 'res');
  };

  // 选择需要加入的收藏夹
  const onCheckedItem = (id: string) => {
    console.log(id, 'id>>>>>');

    const res = checkedItem.find((i) => i === id);
    console.log(res, 'index');

    if (res) {
      const filter = checkedItem.filter((i) => i !== id);
      console.log(filter, 'filter');

      setCheckedItem([...filter]);
    } else {
      checkedItem.push(id);
      setCheckedItem([...checkedItem]);
    }
  };

  // 点击创建收藏夹打开新建弹窗，同时关闭当前弹窗
  const onCreate = () => {
    getAddVisible(true);
    onCancel();
  };

  console.log(checkedItem, 'checkedItem');

  const onSubmit = () => {
    console.log('确定');
  };

  const renderTitle = (
    <div className={styles.title}>
      <span>选择收藏集</span>
      <span className={styles.info}>（创建或选择你想添加的收藏集）</span>
    </div>
  );

  return (
    <Modal
      title={renderTitle}
      width={520}
      visible={visible}
      centered
      wrapClassName={styles.wrapClassName}
      onCancel={() => onCancel()}
      footer={[
        <div key="1" className={styles.actions}>
          <Button type="link" onClick={onCreate}>
            <MIcons name="icon-add" className={styles.addIcon} noStopPropagation />
            <span>新建收藏集</span>
          </Button>
          <div>
            <Button
              key="back"
              type="primary"
              ghost
              className={styles.action}
              onClick={() => onCancel()}
            >
              取消
            </Button>
            <Button
              key="submit"
              type="primary"
              className={styles.action}
              onClick={onSubmit}
            >
              确定
            </Button>
          </div>
        </div>,
      ]}
    >
      <Content
        className={styles.scrollWrapStyle}
        wrapClassName={styles.contentStyle}
        containerClassName={styles.containerClassName}
      >
        <div className={styles.collectionList}>
          {['React', 'Vue'].map((i) => {
            return (
              <div key={i} className={styles.collectionItem}>
                <div className={styles.desc} onClick={() => onCheckedItem(i)}>
                  <div className={styles.collectionName}>
                    <span>{i}</span>
                    <MIcons name="icon-lock-full" className={styles.lockIcon} />
                  </div>
                  <div className={styles.collectionCount}>13篇文章</div>
                </div>
                <Checkbox
                  checked={checkedItem.includes(i)}
                  onChange={() => onCheckedItem(i)}
                />
              </div>
            );
          })}
        </div>
      </Content>
    </Modal>
  );
};

export default CollectionModal;
