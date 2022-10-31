import React, { ReactNode } from 'react';
import classname from 'classname';
import { useGetSiderVisible, useHtmlWidth } from '@/hooks';
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
  const { siderVisible } = useGetSiderVisible();
  const { htmlWidth } = useHtmlWidth();

  return (
    <div
      className={classname(
        styles.container,
        containerClassName,
        siderVisible && htmlWidth > 960 && styles.showContainer
      )}
    >
      <div
        className={classname(
          styles.wrap,
          wrapClassName,
          siderVisible && htmlWidth > 960 && styles.hideWrapPadding
        )}
      >
        <div
          className={classname(
            styles.scrollWrap,
            className,
            siderVisible && htmlWidth > 960 && styles.contentWidth
          )}
        >
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
