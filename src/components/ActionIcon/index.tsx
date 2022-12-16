import React, { useEffect, useState } from 'react';
import classname from 'classname';
import MIcons from '@/components/Icons';
import { storage } from '@/utils';
import { EventBus } from '@/event';
import styles from './index.less';

interface IProps {
  siderVisible?: boolean;
  onClick?: () => void;
  className?: string;
  type?: string;
  icon?: string;
  noHideMenuIcon?: boolean;
}

const MusicIcon: React.FC<IProps> = ({ siderVisible, className, onClick, type, icon, noHideMenuIcon }) => {
  const [show, setShow] = useState<boolean>(false);
  const [theme, setTheme] = useState<boolean>(storage.ssnGetItem('theme') === 'dark');

  useEffect(() => {
    storage.ssnSetItem('theme', theme ? 'dark' : 'light');
    EventBus.changeTheme(theme ? 'dark' : 'light');
  }, [theme]);

  const onToggle = () => {
    type === 'actionBar' ? () => onClick && onClick() : showActions;
    if (type) {
      onClick && onClick();
    } else {
      showActions();
    }
  };

  const showActions = () => {
    setShow(!show);
  };

  const changeTheme = () => {
    setTheme(!theme);
  };

  return (
    <div className={classname(styles.actionList, noHideMenuIcon && styles.noHideMenuActionList, theme && styles.dark)}>
      <div className={classname(className, styles.MusicIcon, show && styles.show)}>
        <MIcons
          name={
            type
              ? (icon as string)
              : !show
                ? 'icon-arrow-right-bold'
                : 'icon-arrow-left-bold'
          }
          className={styles.icon}
          onClick={onToggle}
          customStyle
        />
      </div>
      <div className={classname(styles.actionContent, show && styles.showContent)}>
        {!noHideMenuIcon && (
          <div className={styles.iconList} onClick={() => onClick && onClick()}>
            <MIcons
              name={siderVisible ? 'icon-shuangjiantouyou' : 'icon-shuangjiantouzuo'}
              className={styles.actionIcon}
              noStopPropagation
              customStyle
            />
            <span className={styles.text}>隐藏菜单</span>
          </div>
        )}
        <div className={styles.iconList} onClick={changeTheme}>
          <MIcons
            name={theme ? 'icon-moon_fill' : 'icon-lieri'}
            className={classname(styles.actionIcon, !theme && styles.theme)}
            noStopPropagation
            customStyle
          />
          <span className={styles.text}>切换主题</span>
        </div>
      </div>
    </div>
  );
};

export default MusicIcon;
