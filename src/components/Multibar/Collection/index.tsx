import React, { useState } from 'react';
import { Checkbox, Modal, Button } from 'antd';
import Content from '@/components/Content';
import MIcons from '@/components/Icons';
import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: Function;
  getAddVisible: Function
}

const CollectionModal: React.FC<IProps> = ({ visible, onCancel, getAddVisible }) => {
  const [checked, setChecked] = useState<string[]>([]);

  // 选择需要加入的收藏夹
  const onCheckedItem = (id: string) => {
    const res = checked.find((i) => i === id);
    console.log(res, 'index');

    if (res) {
      const filter = checked.filter((i) => i !== id);
      console.log(filter, 'filter');

      setChecked([...filter]);
    } else {
      checked.push(id);
      setChecked([...checked]);
    }
  };

  // 点击创建收藏夹打开新建弹窗，同时关闭当前弹窗
  const onCreate = () => {
    getAddVisible(true);
    onCancel();
  };

  console.log(checked, 'checked');

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
      footer={[
        <div key="1" className={styles.actions}>
          <Button type="link" onClick={onCreate}>
            <MIcons name="icon-add" className={styles.addIcon} noStopPropagation />
            <span>新建收藏集</span>
          </Button>
          <div>
            <Button key="back" type="primary" ghost className={styles.action} onClick={() => onCancel()}>
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
        </div>
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
                <div>
                  <div className={styles.collectionName}>
                    <span>{i}</span>
                    <MIcons name="icon-lock-full" className={styles.lockIcon} />
                  </div>
                  <div className={styles.collectionCount}>13篇文章</div>
                </div>
                <Checkbox checked={checked.includes(i)} onChange={() => onCheckedItem(i)} />
              </div>
            );
          })}
        </div>
      </Content>
    </Modal>
  );
};

export default CollectionModal;
