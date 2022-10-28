import React from 'react';
import { Skeleton } from 'antd';
import classname from 'classname';
import styles from './index.less';

interface IProps {
  className?: string;
  skeletonWrapStyle?: string;
  rows?: number;
  text?: string;
  terminal?: string;
}

const MSkeleton: React.FC<IProps> = ({
  className,
  skeletonWrapStyle,
  rows,
  text,
  terminal,
}) => {
  return (
    <div className={classname(className, styles.MSkeleton)}>
      {!terminal ? (
        <div className={classname(skeletonWrapStyle, styles.skeletonWrap)}>
          <Skeleton.Image className={classname(styles.skeletonAvatar)} />
          <Skeleton active title paragraph={{ rows }} />
        </div>
      ) : (
        <div className={classname(skeletonWrapStyle, styles.skeletonWrap)}>
          <Skeleton active title paragraph={{ rows }} />
          <Skeleton.Image className={classname(styles.skeletonAvatar)} />
        </div>
      )}

      <div className={styles.emptyText}>{text || '已是全部家当～～～'}</div>
    </div>
  );
};

export default MSkeleton;
