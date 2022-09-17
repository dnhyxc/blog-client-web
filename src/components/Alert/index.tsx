import React from 'react';
import { Alert, Button } from 'antd';
import styles from './index.less';

interface IProps {
  onClick: Function;
  onClose: Function;
}

const MAlert: React.FC<IProps> = ({ onClick, onClose }) => {
  return (
    <Alert
      message={
        <div className={styles.alertInfo}>
          尚未登录，请前往
          <Button
            type="link"
            className={styles.toLogin}
            onClick={() => onClick && onClick()}
          >
            登录
          </Button>
          后再试！
        </div>
      }
      type="warning"
      closable
      className={styles.alert}
      onClose={() => onClose && onClose()}
    />
  );
};

export default MAlert;
