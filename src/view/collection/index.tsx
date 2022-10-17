import React from 'react';
import styles from './index.less';

interface IProps { }

const Collection: React.FC<IProps> = () => {
  return (
    <div className={styles.Collection}>
      <div>Collection</div>
    </div>
  );
};

export default Collection;
