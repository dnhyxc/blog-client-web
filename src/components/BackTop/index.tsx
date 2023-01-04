import React from 'react';
import { ArrowUpOutlined } from '@ant-design/icons';
import styles from './index.less';

interface IProps {
  scrollTop: number;
  htmlWidth?: number;
  scrollbarRef?: any;
}

const BackTop: React.FC<IProps> = ({ scrollTop, scrollbarRef, htmlWidth = 0 }) => {
  const onBackTop = () => {
    scrollbarRef?.current?.scrollTop();
  };

  return scrollTop > 400 && htmlWidth > 960 ? (
    <div className={styles.backTop} onClick={onBackTop}>
      <ArrowUpOutlined className={styles.topIcon} />
    </div>
  ) : null;
};

export default BackTop;
