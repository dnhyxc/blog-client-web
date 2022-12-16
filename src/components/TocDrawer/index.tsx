import React, { useEffect } from 'react';
import classname from 'classname';
import MarkNav from 'markdown-navbar'; // markdown 目录
import { Scrollbars } from 'react-custom-scrollbars';
import { useGetTheme, useGetTocScrollHeight } from '@/hooks';
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
  const { themeMode } = useGetTheme();

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [visible]);

  const onHideTocDrawer = () => {
    onCancel && onCancel();
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
    <div
      className={classname(
        styles.TocDrawer,
        visible && styles.showTocDrawer,
        themeMode === 'dark' && styles.dark
      )}
    >
      <div
        className={styles.mack}
        onClick={onHideTocDrawer}
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
