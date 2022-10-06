import React from 'react';
import classname from 'classname';
import MIcons from '@/components/Icons';
import styles from './index.less';

interface IProps {
  icon?: string;
  type?: string;
  onClick: () => void;
}

const MusicIcon: React.FC<IProps> = ({ icon = 'icon-yinle', type, onClick }) => {
  return (
    <div
      className={classname(styles.MusicIcon, type && styles.show)}
      onClick={() => onClick()}
    >
      <MIcons name={icon} className={styles.icon} onClick={() => onClick()} />
    </div>
  );
};

export default MusicIcon;
