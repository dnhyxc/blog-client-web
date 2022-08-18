import React, { ReactNode } from 'react';
import classname from 'classname';
import { Scrollbars } from 'react-custom-scrollbars';

import styles from './index.less';

interface IProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  wrapClassName?: string;
  onScroll?: Function;
  contentRef?: any;
}

const Content: React.FC<IProps> = ({
  children,
  className,
  containerClassName,
  wrapClassName,
  onScroll,
  contentRef,
}) => {
  return (
    <div className={classname(styles.container, containerClassName)}>
      <div className={classname(styles.wrap, wrapClassName)}>
        <div className={classname(styles.scrollWrap, className)}>
          <Scrollbars
            autoHide
            ref={contentRef}
            className={styles.scrollBar}
            onScrollFrame={onScroll}
          >
            {children}
          </Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default Content;
