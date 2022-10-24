import React from 'react';
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
  tocScrollRef: any;
}

const TocDrawer: React.FC<IProps> = ({ visible, onCancel, detail, tocScrollRef }) => {
  console.log(tocScrollRef, 'tocScrollRef');

  const renderThumb = () => {
    // renderThumb 改变样式时被调用的函数，必须是函数
    const thumbStyle = {
      // 设置滚动条样式
      backgroundColor: 'rgba(225, 225, 225, 0)',
    };
    return <div style={{ ...thumbStyle }} />;
  };

  return (
    <Drawer
      title="文章目录"
      placement="bottom"
      closable={false}
      onClose={() => onCancel()}
      visible={visible}
      height={427}
      headerStyle={{ padding: '10px' }}
      bodyStyle={{ padding: '0 0 10px 0', overflow: 'hidden' }}
    >
      <div className={styles.TocDrawer}>
        {
          detail?.content?.includes('#') ? (
            <div className={styles.mackNav}>
              {/* renderThumbVertical 用于更改滚动条样式 */}
              <Scrollbars
                autoHide
                ref={tocScrollRef}
                renderThumbVertical={renderThumb}
                autoHeight
                autoHeightMax={382}
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
          ) : null
        }
      </div>
    </Drawer>
  );
};

export default TocDrawer;
