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
        <div>
          您尚未登录，暂时无权操作，请前往
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
