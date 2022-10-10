import React from 'react';
import { Modal } from 'antd';
import styles from './index.less';

interface IProps {}

const AddCollection: React.FC<IProps> = () => {
  return (
    <Modal
      title="新建收藏集"
      width={520}
      visible
      // visible={visible}
      wrapClassName={styles.wrapClassName}
    >
      <div className={styles.AddCollection}>
        <div>AddCollection</div>
      </div>
    </Modal>
  );
};

export default AddCollection;
