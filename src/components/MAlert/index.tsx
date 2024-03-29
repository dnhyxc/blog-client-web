import React, { ReactNode } from 'react';
import { Alert, Button } from 'antd';
import styles from './index.less';

interface IProps {
  close?: Function;
  onClick?: Function;
  onClose?: Function;
  type?: string;
  msgNode?: ReactNode;
  pathname?: string;
  search?: string;
}

const MAlert: React.FC<IProps> = ({
  close,
  onClick,
  onClose,
  type = 'login',
  msgNode,
  pathname,
  search,
}) => {
  const onClickHandler = () => {
    if (onClick) {
      onClick();
    } else {
      // request 中唤起 MAlert 组件将原来的pathname及search带过来
      window.location.href = `/login?pathname=${pathname}&search=${search}`;
    }
  };

  const onCloseHandler = () => {
    if (onClose) {
      onClose();
    } else {
      close && close();
    }
  };

  const message = () => {
    if (type === 'login') {
      return (
        <div className={styles.warning}>
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
      );
    }
    return (
      <div className={styles.warning}>
        登录已过期，请重新
        <Button type="link" className={styles.toLogin} onClick={() => onClickHandler()}>
          登录
        </Button>
        后再试！
      </div>
    );
  };

  return (
    <Alert
      message={msgNode || message()}
      type="warning"
      closable
      className={styles.alert}
      onClose={() => onCloseHandler()}
    />
  );
};

export default MAlert;
