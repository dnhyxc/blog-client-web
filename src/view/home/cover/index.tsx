import React from 'react';
import MIcons from '@/components/Icons';
import styles from './index.less';

interface IProps {
  scrollbarRef: any;
}

const Cover: React.FC<IProps> = ({ scrollbarRef }) => {
  const toArticleList = () => {
    scrollbarRef?.current.scrollTop(document.body.clientHeight - 49);
  };

  return (
    <div className={styles.Cover}>
      <div className={styles.content}>
        <div className={styles.desc}>
          <div className={styles.authorName}>dnhyxc</div>
          <div className={styles.line}>行到水穷处，坐看云起时！</div>
        </div>
      </div>
      <div className={styles.downWrap}>
        <div className={styles.shaking} onClick={toArticleList}>
          <MIcons
            name="icon-double-arrow-down"
            className={styles.downIcon}
            noStopPropagation
          />
        </div>
      </div>
    </div>
  );
};

export default Cover;
