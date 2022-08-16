import React, { useEffect, useRef } from 'react';
import MarkNav from 'markdown-navbar'; // markdown 目录
import { Scrollbars } from 'react-custom-scrollbars';
import 'markdown-navbar/dist/navbar.css';
import styles from './index.less';

interface IProps {
  mackdown: string;
}

const Toc: React.FC<IProps> = ({ mackdown }) => {
  const scrollRef: any = useRef();

  useEffect(() => {
    if (scrollRef && !scrollRef.current) return;
    window.addEventListener('scroll', onHtmlScroll);
    return () => {
      window.removeEventListener('scroll', onHtmlScroll);
    };
  }, [scrollRef]);

  const onHtmlScroll = () => {
    const scrollRefScrollHeight = scrollRef.current.getScrollHeight();
    const htmlScrollTop = document.documentElement.scrollTop;
    const htmlScrollHeight = document.documentElement.scrollHeight;
    const percent = (scrollRefScrollHeight - 500) / htmlScrollHeight;
    const needScrollTop = percent * htmlScrollTop;
    scrollRef.current.scrollTop(needScrollTop);
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
    <div className={styles.tocWrap}>
      <div className={styles.tocText}>文章目录</div>
      <div className={styles.mackNav}>
        {/* renderThumbVertical 用于更改滚动条样式 */}
        <Scrollbars autoHide ref={scrollRef} renderThumbVertical={renderThumb}>
          {mackdown && (
            <MarkNav
              className={styles.tocList}
              source={mackdown}
              headingTopOffset={60}
              declarative={false}
              ordered
            />
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default Toc;
