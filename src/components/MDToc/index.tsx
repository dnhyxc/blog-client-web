import React from 'react';
import { MdCatalog } from 'md-editor-rt';
import classname from 'classnames';
import { MDEDIT_ID } from '@/constant';
import styles from './index.less';

interface IProps {
  themeMode?: string;
  offsetTop?: number;
  className?: number;
}

const MDToc: React.FC<IProps> = ({ offsetTop, className, themeMode }) => {
  return (
    <div
      className={classname(styles.tocWrap, className, themeMode === 'dark' && styles.dark)}
    >
      <MdCatalog
        editorId={MDEDIT_ID}
        scrollElement={document.documentElement}
        scrollElementOffsetTop={offsetTop}
        theme={themeMode as 'dark' | 'light'}
      />
    </div>
  );
};

export default MDToc;
