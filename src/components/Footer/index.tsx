/*
 * @Description: 头部组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\Footer\index.tsx
 */
import React, { ReactNode } from 'react';
import classname from 'classname';
import { useGetSiderVisible, useHtmlWidth } from '@/hooks';
import MenuList from './Menu';
import styles from './index.less';

interface IProps {
  children?: ReactNode;
  themeMode?: string;
}

const Footer: React.FC<IProps> = ({ children, themeMode }) => {
  const { siderVisible } = useGetSiderVisible();
  const { htmlWidth } = useHtmlWidth();

  return (
    <div
      className={classname(
        styles.footerWrap,
        siderVisible && htmlWidth > 960 && styles.showFooter,
        themeMode === 'dark' && styles.dark
      )}
    >
      <MenuList htmlWidth={htmlWidth} />
      {children}
    </div>
  );
};

export default Footer;
