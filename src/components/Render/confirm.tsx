import React from 'react';
import { Alert, Button } from 'antd';
import styles from './index.less';

interface IProps {
  close: Function;
}

const MAlert: React.FC<IProps> = ({ close }) => {
  const onClick = () => {
    window.location.href = '/login';
  };

  const onClose = () => {
    close();
  };

  return (
    <Alert
      message={
        <div className={styles.warning}>
          登录已过期，请重新
          <Button type="link" className={styles.toLogin} onClick={onClick}>
            登录
          </Button>
          后再试！
        </div>
      }
      type="warning"
      closable
      className={styles.alert}
      onClose={onClose}
    />
  );
};

export default MAlert;
