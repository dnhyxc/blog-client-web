import React, { useState } from 'react';
import { Checkbox, Modal } from 'antd';
import Content from '@/components/Content';
import MIcons from '@/components/Icons';
import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: Function;
}

const CollectionModal: React.FC<IProps> = ({ visible, onCancel }) => {
  const [checked, setChecked] = useState<string[]>([]);

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
      wrapClassName={styles.wrapClassName}
      onCancel={() => onCancel()}
      onOk={onSubmit}
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
