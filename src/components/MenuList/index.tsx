/*
 * @Description: 菜单组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\MenuList\index.tsx
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Layout } from 'antd';
import classname from 'classname';
import Image from '@/components/Image';
import { menuList, settingList } from '@/router/menu';
import ICON from '@/assets/images/about_me.jpg';
import styles from './index.less';

const { Sider } = Layout;

interface IProps {
  type?: string; // type 有值说明是setting
}

const MenuList: React.FC<IProps> = ({ type }) => {
  const [selectMenu, setSelectMenu] = useState<string>('');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const sliceName = pathname !== '/' ? pathname.slice(1) : pathname;
    // type 有值说明是setting
    if (type) {
      if (sliceName.includes('setting/')) {
        const path = sliceName.replace('setting/', '');
        setSelectMenu(path);
      }
      return;
    }
    // type 没有值说明不是setting，走正常的路由设置
    if (sliceName === '/') {
      setSelectMenu('home');
      navigate('home');
    } else {
      const index = sliceName.indexOf('/', 1);
      if (index > -1) {
        const path = sliceName.slice(0, index);
        setSelectMenu(path);
      } else {
        setSelectMenu(sliceName);
      }
    }
    return () => {
      // console.log(pathname, "后置路由守卫");
    };
  }, [pathname, type]);

  const onSelectMenu = (value: { key: string }) => {
    setSelectMenu(value.key);
    navigate(value.key);
  };

  return (
    <Sider
      theme="light"
      trigger={null}
      collapsible
      width={180}
      className={classname(styles.siderWrap, type && styles.settingSiderWrap)}
    >
      {!type && (
        <div className={styles.logo}>
          <Image url={ICON} className={styles.icon} />
          <span>DNHYXC</span>
        </div>
      )}
      <Menu
        mode="inline"
        defaultSelectedKeys={type ? ['home'] : ['profile']}
        selectedKeys={[selectMenu]}
        items={type ? settingList : menuList}
        onClick={(e) => onSelectMenu(e)}
      />
    </Sider>
  );
};

export default MenuList;
