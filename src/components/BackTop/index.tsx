import React from 'react';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useHtmlWidth } from '@/hooks';
import styles from './index.less';

interface IProps {
  scrollTop: number;
  scrollbarRef?: any;
}

const BackTop: React.FC<IProps> = ({ scrollTop, scrollbarRef }) => {
  const { htmlWidth } = useHtmlWidth();

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
