import React, { useState, Fragment, ReactNode, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, Dropdown, Space } from 'antd';
import classname from 'classname';
import { CaretUpOutlined, CaretDownOutlined, AppstoreOutlined } from '@ant-design/icons';
import { menuList } from '@/router/menu';
import useStore from '@/store';
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
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  const toOtherPage = (e: any, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  const filterMenus = useMemo(() => {
    if (getUserInfo?.userId) {
      return menuList;
    }
    return menuList.filter(
      (i) => i.key !== 'personal' && i.key !== 'create' && i.key !== 'timeline'
    );
  }, [getUserInfo?.userId]);

  const menu = (
    <Menu
      items={filterMenus.map((i) => ({
        key: i.key,
        label: (
          <Link to={i.path} className={styles.menu_label}>
            {i.name}
          </Link>
        ),
      }))}
    />
  );

  const onVisibleChange = (visible: boolean) => {
    setMenuVisible(visible);
  };

  return (
    <div className={classname(styles.MenuList, className)}>
      {htmlWidth < 960 ? (
        <span className={styles.itemIcon}>
          <Dropdown
            overlayClassName={styles.dropdown}
            placement="bottom"
            overlay={menu}
            onVisibleChange={onVisibleChange}
          >
            <Space className={styles.space}>
              <span className={styles.selectMenu}>
                <AppstoreOutlined className={styles.menuIcon} />
              </span>
              {menuVisible ? (
                <CaretUpOutlined className={menuVisible ? styles.activeMenu : ''} />
              ) : (
                <CaretDownOutlined />
              )}
            </Space>
          </Dropdown>
        </span>
      ) : (
        filterMenus.map((i) => {
          return (
            <Fragment key={i.name}>
              <span
                className={classname(styles.item, i.path === pathname && styles.active)}
                onClick={(e) => toOtherPage(e, i.path)}
              >
                {i.name}
              </span>
              {children}
            </Fragment>
          );
        })
      )}
    </div>
  );
};

export default MenuList;
