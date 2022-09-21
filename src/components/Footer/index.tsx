/*
 * @Description: 头部组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\Footer\index.tsx
 */
import React, { ReactNode } from 'react';
// import { BOAT_TO_CHINA_MP3, BOAT_TO_CHINA_LRC } from '@/constant';
import MenuList from './Menu';
import styles from './index.less';

interface IProps {
  children?: ReactNode;
}

const Footer: React.FC<IProps> = ({ children }) => {
  return (
    <div className={styles.footerWrap}>
      {/* <div>
        <audio src={BOAT_TO_CHINA_MP3} id="aud" autoPlay controls preload="auto">
          <track default kind="captions" srcLang="en" src={BOAT_TO_CHINA_LRC} />
        </audio>
      </div> */}
      <MenuList />
      {children}
    </div>
  );
};

export default Footer;
