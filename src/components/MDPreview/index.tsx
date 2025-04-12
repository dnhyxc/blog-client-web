import React, { ReactNode } from 'react';
import { MdPreview } from 'md-editor-rt';
import classname from 'classname';
import 'md-editor-rt/lib/preview.css';
import { MDEDIT_ID } from '@/constant';
import styles from './index.less';

interface IProps {
  markdown: string;
  className?: string;
  children?: ReactNode;
  coverImg?: ReactNode;
  themeMode?: string;
}

const MDPreview: React.FC<IProps> = ({
  markdown,
  className,
  children: childNode,
  coverImg,
  themeMode,
}) => {
  return (
    <div className={classname(styles.container, className)}>
      <div className={styles.coverImg}>{coverImg}</div>
      <MdPreview id={MDEDIT_ID} value={markdown} theme={themeMode as 'dark' | 'light'} />
      {childNode}
    </div>
  );
};

export default MDPreview;
