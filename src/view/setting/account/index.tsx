import React from 'react';

import styles from './index.less';

interface IProps {}

const Account: React.FC<IProps> = () => {
  return (
    <div className={styles.Account}>
      <div>Account</div>
    </div>
  );
};

export default Account;