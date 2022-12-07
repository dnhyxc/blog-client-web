import React from 'react';
import classname from 'classname';
import MarkNav from 'markdown-navbar'; // markdown 目录
import { Scrollbars } from 'react-custom-scrollbars';
import { useGetTocScrollHeight } from '@/hooks';
import { isInsideElement } from '@/utils';
import { ArticleDetailParams } from '@/typings/common';
import 'markdown-navbar/dist/navbar.css';
import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: Function;
  detail: ArticleDetailParams;
}

const TocDrawer: React.FC<IProps> = ({ visible, onCancel, detail }) => {
  const { tocScrollRef } = useGetTocScrollHeight({ tocVisible: visible });

  const onHideTocDrawer = () => {
    onCancel && onCancel();
  };

  const onTouchStart = (e: TouchEvent) => {
    // 判断鼠标是否进入蒙层
    const res = isInsideElement(e, e.target as HTMLDivElement);
    if (res) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const renderThumb = () => {
    // renderThumb 改变样式时被调用的函数，必须是函数
    const thumbStyle = {
      // 设置滚动条样式
      backgroundColor: 'rgba(225, 225, 225, 0)',
    };
    return <div style={{ ...thumbStyle }} />;
  };

  return (
    <div className={classname(styles.TocDrawer, visible && styles.showTocDrawer)}>
      <div
        className={styles.mack}
        onClick={onHideTocDrawer}
        onTouchStart={(e) => onTouchStart(e as unknown as TouchEvent)}
      />
      {detail?.content?.includes('#') ? (
        <div className={styles.mackNav}>
          <div className={styles.tocTitle}>文章目录</div>
          {/* renderThumbVertical 用于更改滚动条样式 */}
          <Scrollbars
            autoHide
            ref={tocScrollRef}
            renderThumbVertical={renderThumb}
            autoHeight
            autoHeightMax={350}
            className={styles.scrollbar}
          >
            <MarkNav
              className={styles.tocList}
              source={detail?.content}
              headingTopOffset={60}
              declarative={false}
              ordered
            />
          </Scrollbars>
        </div>
      ) : null}
    </div>
  );
};

export default TocDrawer;
