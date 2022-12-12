import React, { ReactNode } from 'react';
import classname from 'classname';
import styles from './index.less';

interface IProps {
  children?: ReactNode;
  name: string;
  title?: string;
  text?: string | number | ReactNode;
  className?: string;
  iconWrapClass?: string;
  textStyle?: string;
  onClick?: () => void;
  customStyle?: boolean;
  noStopPropagation?: boolean;
}

const MIcons: React.FC<IProps> = ({
  children,
  text,
  name,
  className,
  iconWrapClass,
  onClick,
  title,
  customStyle,
  noStopPropagation,
  textStyle,
}) => {
  return (
    <span
      className={classname(styles.MIcons, iconWrapClass, customStyle && styles.customStyle)}
      id="ON_REPLAY"
      onClick={
        !noStopPropagation
          ? (e) => {
              e.stopPropagation();
              onClick && onClick();
            }
          : () => {}
      }
      title={title}
    >
      <span className={classname(className, `iconfont ${name}`)} />
      {(text || children) && (
        <span className={classname(styles.child, textStyle)}>
          {text && <span style={{ fontSize: '13px' }}>{text}</span>}
          {children && <span>{children}</span>}
        </span>
      )}
    </span>
  );
};

export default MIcons;
