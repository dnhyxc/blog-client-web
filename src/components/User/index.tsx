import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import classname from 'classname';
import useStore from '@/store';
import Image from '@/components/Image';
import MIcons from '@/components/Icons';
import { HEAD_UEL, USER_MENU } from '@/constant';
import { storage } from '@/utils';
import styles from './index.less';

interface IProps {
  themeMode?: string;
}

const User: React.FC<IProps> = ({ themeMode }) => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const {
    userInfoStore: { getUserInfo },
    commonStore,
  } = useStore();

  const onJump = (path: string) => {
    if (path === '/login') {
      commonStore.setAuth({ redirectUrl: `${pathname}${search}` });
      storage.ssnRemoveItem('token');
      storage.ssnRemoveItem('userInfo');
      navigate(`${path}?verify=${pathname.slice(1)}`);
    } else {
      navigate(path);
    }
  };

  const menu = (
    <Menu
      items={USER_MENU.map((i) => ({
        key: i.key,
        label: (
          <div
            className={classname(
              styles.userMenuItem,
              themeMode === 'dark' && styles.darkUserMenuItem
            )}
          >
            <MIcons
              name={i.icon}
              text={i.text}
              iconWrapClass={styles.iconWrap}
              onClick={() => onJump(i.path)}
            />
          </div>
        ),
      }))}
    />
  );

  return (
    <div className={styles.User}>
      {getUserInfo?.userId ? (
        <Dropdown
          overlay={menu}
          placement="bottomRight"
          arrow
          trigger={['click']}
          overlayClassName={themeMode === 'dark' ? styles.overlayClassName : ''}
        >
          <div className={styles.headImg}>
            <Image
              url={getUserInfo?.headUrl || HEAD_UEL}
              transitionImg={HEAD_UEL}
              className={styles.image}
            />
          </div>
        </Dropdown>
      ) : (
        <Button onClick={() => onJump('/login')} type="primary" ghost>
          登录/注册
        </Button>
      )}
    </div>
  );
};

export default User;
