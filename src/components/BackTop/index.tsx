import React from 'react';
import { ArrowUpOutlined } from '@ant-design/icons';
import styles from './index.less';

interface IProps {
  scrollTop: number;
  contentRef?: any;
}

const BackTop: React.FC<IProps> = ({ scrollTop, contentRef }) => {
  const onBackTop = () => {
    contentRef?.current?.scrollTop();
  };

  return scrollTop > 400 ? (
    <div className={styles.backTop} onClick={onBackTop}>
      <ArrowUpOutlined className={styles.topIcon} />
    </div>
  ) : null;
};

export default BackTop;
