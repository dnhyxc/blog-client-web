import React, { useEffect, useRef, useState } from 'react';
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
  fromDetail?: boolean;
}

const MusicIcon: React.FC<IProps> = ({ siderVisible, className, onClick, type, icon, noHideMenuIcon, fromDetail }) => {
  const [show, setShow] = useState<boolean>(false);
  const [theme, setTheme] = useState<boolean>(storage.ssnGetItem('theme') === 'dark');
  const [onNode, setOnNode] = useState<boolean>(false);

  const timer = useRef<any>(null);

  useEffect(() => {
    storage.ssnSetItem('theme', theme ? 'dark' : 'light');
    EventBus.changeTheme(theme ? 'dark' : 'light');
  }, [theme]);

  useEffect(() => {
    // actionBar 没有展开或者鼠标放在actionBar中时，不关闭
    if (!show || onNode) return;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    timer.current = setTimeout(() => {
      setShow(false);
    }, 5000);
    return () => {
      clearTimeout(timer.current);
      timer.current = null;
    };
  }, [show, onNode]);

  const onToggle = () => {
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

  const onMouseEnter = () => {
    setOnNode(true);
  };

  const onMouseLeave = () => {
    setOnNode(false);
  };

  return (
    !fromDetail ? (
      <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={classname(styles.actionList, noHideMenuIcon && styles.noHideMenuActionList, theme && styles.dark)}>
        <div className={classname(theme && styles.darkIcon, className, styles.MusicIcon, show && styles.show)}>
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
    ) : (
      <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={classname(styles.detailActionList, theme && styles.dark)}>
        <div className={classname(className, styles.detailMusicIcon, show && styles.show, theme && styles.darkIcon)}>
          <MIcons
            name={
              type
                ? (icon as string)
                : !show
                  ? 'icon-arrow-left-bold'
                  : 'icon-arrow-right-bold'
            }
            className={styles.icon}
            onClick={onToggle}
            customStyle
          />
        </div>
        <div className={classname(styles.actionContent, show && styles.showContent)}>
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
    )
  );
};

export default MusicIcon;
