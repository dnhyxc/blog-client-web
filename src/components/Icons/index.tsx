import React, { ReactNode } from 'react';
import classname from 'classname';
import styles from './index.less';

interface IProps {
  children?: ReactNode;
  name?: string;
  text?: string | number | ReactNode;
  className?: string;
  iconWrapClass?: string;
  onClick?: () => void;
}

const MIcons: React.FC<IProps> = ({
  children,
  text,
  name,
  className,
  iconWrapClass,
  onClick,
}) => {
  return (
    <span
      className={classname(styles.MIcons, iconWrapClass)}
      id="ON_REPLAY"
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
    >
      <span className={classname(className, `iconfont ${name}`)} />
      {(text || children) && (
        <span className={styles.child}>
          {text && <span style={{ fontSize: '13px' }}>{text}</span>}
          {children && <span>{children}</span>}
        </span>
      )}
    </span>
  );
};

export default MIcons;
