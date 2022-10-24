import React, { useRef, useEffect } from 'react';
import { Drawer } from 'antd';
import MarkNav from 'markdown-navbar'; // markdown 目录
import { Scrollbars } from 'react-custom-scrollbars';
import { ArticleDetailParams } from '@/typings/common';
import 'markdown-navbar/dist/navbar.css';
import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: Function;
  detail: ArticleDetailParams;
}

const TocDrawer: React.FC<IProps> = ({ visible, onCancel, detail }) => {
  const scrollRef: any = useRef();

  useEffect(() => {
    if (scrollRef && !scrollRef.current) return;
    window.addEventListener('scroll', onHtmlScroll);
    return () => {
      window.removeEventListener('scroll', onHtmlScroll);
    };
  }, [scrollRef]);

  const onHtmlScroll = () => {
    const scrollRefScrollHeight = scrollRef?.current?.getScrollHeight();
    const htmlScrollTop = document.documentElement?.scrollTop;
    const htmlScrollHeight = document.documentElement?.scrollHeight;
    const percent = scrollRefScrollHeight / htmlScrollHeight;
    const needScrollTop = percent * htmlScrollTop;
    scrollRef?.current?.scrollTop(needScrollTop);
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
    <div className={styles.TocDrawer}>
      <Drawer
        title="目录"
        placement="bottom"
        closable={false}
        onClose={() => onCancel()}
        visible={visible}
        height={432}
        headerStyle={{ padding: '10px' }}
        bodyStyle={{ padding: '0 10px' }}
      >
        <div className={styles.createContent}>
          {detail?.content?.includes('#') ? (
            <div className={styles.tocWrap}>
              <div className={styles.tocText}>文章目录</div>
              <div className={styles.mackNav}>
                {/* renderThumbVertical 用于更改滚动条样式 */}
                <Scrollbars
                  autoHide
                  ref={scrollRef}
                  renderThumbVertical={renderThumb}
                  autoHeight
                  autoHeightMax="calc(100vh - 124px)"
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
            </div>
          ) : null}
        </div>
      </Drawer>
    </div>
  );
};

export default TocDrawer;
