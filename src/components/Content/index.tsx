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
  scrollbarRef?: any;
  autoHeight?: boolean;
  autoHeightMax?: number | string;
}

const Content: React.FC<IProps> = ({
  children,
  className,
  containerClassName,
  wrapClassName,
  onScroll,
  scrollbarRef,
  autoHeight,
  autoHeightMax,
}) => {
  return (
    <div className={classname(styles.container, containerClassName)}>
      <div className={classname(styles.wrap, wrapClassName)}>
        <div className={classname(styles.scrollWrap, className)}>
          <Scrollbars
            autoHide
            autoHeight={autoHeight}
            autoHeightMax={autoHeightMax}
            ref={scrollbarRef}
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
