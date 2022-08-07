import React, { ReactNode } from 'react';
import classname from 'classname';
import { Scrollbars } from 'react-custom-scrollbars';

import styles from './index.less';

interface IProps {
  children: ReactNode;
  className?: string;
  wrapClassName?: string;
  onScroll?: Function;
}

const Content: React.FC<IProps> = ({ children, className, wrapClassName, onScroll }) => {
  return (
    <div className={styles.container}>
      <div className={classname(styles.wrap, wrapClassName)}>
        <div className={classname(styles.scrollWrap, className)}>
          <Scrollbars autoHide className={styles.scrollBar} onScrollFrame={onScroll}>
            {children}
          </Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default Content;
