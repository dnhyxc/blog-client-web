import React from 'react';
import { Skeleton } from 'antd';
import classname from 'classname';
import styles from './index.less';

interface IProps {
  className?: string;
  skeletonWrapStyle?: string;
  rows?: number;
  text?: string;
  textStyle?: string;
  terminal?: string;
}

const MSkeleton: React.FC<IProps> = ({
  className,
  skeletonWrapStyle,
  rows,
  text,
  textStyle,
  terminal,
}) => {
  return (
    <div className={classname(className, styles.MSkeleton)}>
      {terminal === 'web' ? (
        <div className={classname(skeletonWrapStyle, styles.skeletonWrap)}>
          <Skeleton.Image className={classname(styles.skeletonAvatar)} />
          <Skeleton active paragraph={{ rows }} />
        </div>
      ) : (
        <div className={classname(skeletonWrapStyle, styles.skeletonWrap)}>
          <Skeleton active title paragraph={{ rows }} />
          <Skeleton.Image className={classname(styles.skeletonAvatar)} />
        </div>
      )}

      <div className={classname(styles.emptyText, textStyle)}>
        {text || '已是全部家当～～～'}
      </div>
    </div>
  );
};

export default MSkeleton;
