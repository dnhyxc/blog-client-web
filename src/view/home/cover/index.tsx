import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '@/store';
import MIcons from '@/components/Icons';
import styles from './index.less';

interface IProps {
  scrollbarRef: any;
  children?: ReactNode;
}

const Cover: React.FC<IProps> = ({ scrollbarRef, children }) => {
  const navigate = useNavigate();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  const toArticleList = () => {
    scrollbarRef?.current.scrollTop(document.body.clientHeight - 49);
  };

  const toPersonal = () => {
    navigate('/personal');
  };

  return (
    <div className={styles.Cover}>
      {children}
      <div className={styles.content}>
        <div className={styles.desc}>
          <div className={styles.authorName} onClick={toPersonal}>
            {getUserInfo?.username}
          </div>
          <div className={styles.line}>
            {getUserInfo?.motto || '行到水穷处，坐看云起时！'}
          </div>
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
