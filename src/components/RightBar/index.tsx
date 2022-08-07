import React from 'react';
import classname from 'classname';
import Introduction from './Introduction';
import styles from './index.less';

interface IProps {
  className?: string;
}

const RightBar: React.FC<IProps> = ({ className }) => {
  return (
    <div className={classname(styles.container, className)}>
      <Introduction />
    </div>
  );
};

export default RightBar;
