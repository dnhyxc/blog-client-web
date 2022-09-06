import React from 'react';
import { Popover, Button } from 'antd';
import Content from '@/components/Content';
import styles from './index.less';

interface IProps {}

const DraftPopover: React.FC<IProps> = () => {
  const content = (
    <div className={styles.draftContent}>
      <Content
        containerClassName={styles.containerClassName}
        wrapClassName={styles.wrapClassName}
        autoHeight
        autoHeightMax="300px"
      >
        <p style={{ height: '500px' }}>Content</p>
        <p>Content</p>
      </Content>
    </div>
  );

  return (
    <Popover
      className={styles.draftPop}
      placement="bottomRight"
      title="草稿列表"
      content={content}
      trigger="click"
    >
      <Button type="link" className={styles.draftBtn}>
        草稿箱
      </Button>
    </Popover>
  );
};

export default DraftPopover;
