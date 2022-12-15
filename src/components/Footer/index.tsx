/*
 * @Description: 头部组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\Footer\index.tsx
 */
import React, { ReactNode } from 'react';
import classname from 'classname';
import { useGetSiderVisible, useGetTheme, useHtmlWidth } from '@/hooks';
import MenuList from './Menu';
import styles from './index.less';

interface IProps {
  children?: ReactNode;
}

const Footer: React.FC<IProps> = ({ children }) => {
  const { siderVisible } = useGetSiderVisible();
  const { htmlWidth } = useHtmlWidth();
  const { themeMode } = useGetTheme();

  return (
    <div
      className={classname(
        styles.footerWrap,
        siderVisible && htmlWidth > 960 && styles.showFooter,
        themeMode === 'dark' && styles.dark
      )}
    >
      <MenuList />
      {children}
    </div>
  );
};

export default Footer;
