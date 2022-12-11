import React, { ReactNode } from 'react';
import classname from 'classname';
import { useGetSiderVisible, useHtmlWidth, useGetTheme } from '@/hooks';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';

interface IProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  wrapClassName?: string;
  onScroll?: Function;
  scrollbarRef?: any;
  contentWrapRef?: any; // 用于滚动时动态给该元素添加paddingTop
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
  contentWrapRef,
  autoHeight,
  autoHeightMax,
}) => {
  const { siderVisible } = useGetSiderVisible();
  const { htmlWidth } = useHtmlWidth();
  const { themeMode } = useGetTheme();

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
        ref={contentWrapRef}
      >
        <div
          className={classname(
            styles.scrollWrap,
            className,
            siderVisible && htmlWidth > 960 && styles.contentWidth,
            themeMode === 'dark' && styles.dark
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
