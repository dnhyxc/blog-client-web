import React from 'react';
import { EMPTY_URL } from '@/constant';
import styles from './index.less';

const Empty: React.FC = () => {
  return (
    <div className={styles.Empty}>
      <img alt="" src={EMPTY_URL} className={styles.emptyImg} />
      <div className={styles.text}>空空如也</div>
    </div>
  );
};

export default Empty;
