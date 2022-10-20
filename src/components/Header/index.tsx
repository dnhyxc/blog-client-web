/*
 * @Description: 头部组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\Header\index.tsx
 */
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import { useHtmlWidth } from '@/hooks';
import { EventBus } from '@/event';
import useStore from '@/store';
import MIcons from '../Icons';
import HeadMenu from '../HeadMenu';
import User from './User';
import styles from './index.less';

interface IProps {
  children?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  needLeft?: boolean;
  excludesWidth?: boolean;
}

const Header: React.FC<IProps> = ({
  children,
  left,
  right,
  needLeft = true,
  excludesWidth = false,
}) => {
  const { siderStore } = useStore();

  const [headMenuVisible, setHeadMenuVisible] = useState<boolean>(
    siderStore.toggleSider || false
  );

  const navigate = useNavigate();
  const { htmlWidth } = useHtmlWidth();

  useEffect(() => {
    EventBus.onToggleSider.listen(() => {
      setHeadMenuVisible(EventBus.visible);
    });
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/home');
  };

  return (
    <div className={styles.herderWrap}>
      <div className={styles.left}>
        {needLeft &&
          (left || (
            <div className={styles.back} onClick={goBack}>
              <LeftOutlined />
              <MIcons name="icon-haidao_" className={styles.iconWrap} onClick={goHome} />
            </div>
          ))}
        <div className={styles.child}>{children}</div>
        {(excludesWidth || headMenuVisible) && htmlWidth > 960 && <HeadMenu />}
      </div>
      <div className={styles.right}>
        {right && <span>{right}</span>}
        <User />
      </div>
    </div>
  );
};

export default Header;
