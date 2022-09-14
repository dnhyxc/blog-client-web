import React, { ReactNode, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classname from 'classname';
import useStore from '@/store';
import { menuList } from '@/router/menu';
import { useHtmlWidth } from '@/hooks';

import styles from './index.less';

interface IProps {
  className?: string;
  children?: ReactNode;
}

const MenuList: React.FC<IProps> = ({ className, children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { htmlWidth } = useHtmlWidth();

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  const toOtherPage = (e: any, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  // 根据登录显示对应的菜单
  const filterMenus = useMemo(() => {
    if (getUserInfo?.userId) {
      return menuList;
    }
    return menuList.filter(
      (i) => i.key !== 'personal' && i.key !== 'create' && i.key !== 'timeline'
    );
  }, [getUserInfo?.userId]);

  return (
    <div className={classname(styles.MenuList, className)}>
      {htmlWidth < 960 &&
        filterMenus.map((i) => {
          return (
            <div
              key={i.key}
              className={classname(styles.item, i.path === pathname && styles.active)}
              onClick={(e) => toOtherPage(e, i.path)}
            >
              <span className={styles.icon}>{i.icon}</span>
              <span className={styles.text}>{i.name}</span>
            </div>
          );
        })}
      {children}
    </div>
  );
};

export default MenuList;
