/*
 * @Description: 菜单组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\MenuList\index.tsx
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Menu, Layout } from 'antd';
import classname from 'classname';
import useStore from '@/store';
import Image from '@/components/Image';
import MusicIcon from '@/components/MusicIcon';
import { menuList, settingList } from '@/router/menu';
import { CARD_URL } from '@/constant';
import { EventBus } from '@/event';
import styles from './index.less';

const { Sider } = Layout;

interface IProps {
  type?: string; // type 有值说明是setting
  width?: number;
  className?: string;
}

const MenuList: React.FC<IProps> = ({ type, width = 180, className }) => {
  const {
    userInfoStore: { getUserInfo },
    siderStore,
  } = useStore();

  const [siderVisible, setSiderVisible] = useState<boolean>(
    siderStore?.toggleSider || false
  );
  const [selectMenu, setSelectMenu] = useState<string>('');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [search] = useSearchParams();
  const id = search.get('id');

  useEffect(() => {
    const sliceName = pathname !== '/' ? pathname.slice(1) : pathname;
    // type 有值说明是setting
    if (type) {
      if (sliceName === 'setting') {
        navigate('/setting/profile');
      }
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
      // console.log(pathname, '后置路由守卫');
    };
  }, [pathname, type]);

  // 设置路由守卫
  useEffect(() => {
    if (
      !getUserInfo?.userId &&
      (pathname === '/create' ||
        pathname.includes('setting') ||
        pathname === '/timeline' ||
        ((!id || id.length !== 24) && pathname === '/personal'))
    ) {
      navigate('home');
    }
  }, [pathname, getUserInfo?.userId]);

  const filterMenus = useMemo(() => {
    if (getUserInfo?.userId) {
      return menuList;
    }
    return menuList.filter(
      (i) => i.key !== 'personal' && i.key !== 'create' && i.key !== 'timeline'
    );
  }, [getUserInfo?.userId]);

  const onSelectMenu = (value: { key: string }) => {
    setSelectMenu(value.key);
    navigate(value.key);
  };

  // 切换menu
  const onToggleSider = () => {
    setSiderVisible(!siderVisible);
    siderStore?.onToggleSider(!siderVisible);
    EventBus.toggle(!siderVisible);
  };

  return (
    <div className={styles.siderContainer}>
      <MusicIcon className={styles.changeIconWrap} onClick={onToggleSider} />
      <Sider
        theme="light"
        trigger={null}
        collapsible
        width={width}
        className={classname(
          siderVisible && !type && styles.hideSider,
          className,
          styles.siderWrap,
          type && styles.settingSiderWrap
        )}
      >
        {!type && (
          <div className={styles.logo}>
            <Image url={CARD_URL} transitionImg={CARD_URL} className={styles.icon} />
            <span>DNHYXC</span>
          </div>
        )}
        <Menu
          mode="inline"
          defaultSelectedKeys={type ? ['home'] : ['profile']}
          selectedKeys={[selectMenu]}
          items={type ? settingList : filterMenus}
          onClick={(e) => onSelectMenu(e)}
        />
      </Sider>
    </div>
  );
};

export default MenuList;
