import React from 'react';
import styles from './index.less';

interface IProps {}

const Cover: React.FC<IProps> = () => {
  return (
    <div className={styles.Cover}>
      <div className={styles.content}>cover</div>
    </div>
  );
};

export default Cover;
