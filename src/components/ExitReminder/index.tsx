/*
 * @Description: 强制退出提醒
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\Footer\index.tsx
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.less';

interface IProps {
  themeMode?: string;
}

const ExitReminder: React.FC<IProps> = () => {
  const navigate = useNavigate();

  const onReload = () => {
    navigate(0);
  };

  return (
    <div className={styles.exitWrap}>
      <div className={styles.message}>
        <div className={styles.info}>该账号已在别处登录，当前账号已被强制退出</div>
        <div className={styles.button} onClick={onReload}>
          确定
        </div>
      </div>
    </div>
  );
};

export default ExitReminder;
