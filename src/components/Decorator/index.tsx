/*
 * @Description: 装饰组件
 * @Author: dnh
 * @Date: 2022-06-14 17:20:25
 * @LastEditors: dnh
 * @FilePath: \src\components\Decorator\index.tsx
 */
import React, { ReactNode, useState, useEffect } from 'react';
import classname from 'classname';
import { useGetTheme } from '@/hooks';
import { EventBus } from '@/event';
import useStore from '@/store';
import styles from './index.less';

interface IProps {
  children?: ReactNode;
  className?: string;
}

const Decorator: React.FC<IProps> = ({ children, className }) => {
  const { siderStore } = useStore();
  const { themeMode } = useGetTheme();

  const [headMenuVisible, setHeadMenuVisible] = useState<boolean>(
    siderStore.toggleSider || false
  );

  useEffect(() => {
    EventBus.onToggleSider.listen(() => {
      setHeadMenuVisible(EventBus.visible);
    });
  }, []);

  return (
    <div
      className={classname(
        className || styles.container,
        headMenuVisible && styles.hide,
        themeMode === 'dark' && styles.dark
      )}
    >
      {children}
    </div>
  );
};

export default Decorator;
