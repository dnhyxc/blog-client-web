import React from 'react';
import { Dropdown, Menu } from 'antd';
import useStore from '@/store';
import Image from '@/components/Image';
import MIcons from '@/components/Icons';
import { HEAD_UEL } from '@/constant';
// import { decrypt } from '@/utils';
import styles from './index.less';

interface IProps { }

const User: React.FC<IProps> = () => {
  const { userInfoStore: { getUserInfo } } = useStore();

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <div className={styles.userMenuItem}>
              <MIcons
                name="icon-gerenzhongxin"
                text="我的主页"
                iconWrapClass={styles.iconWrap}
              />
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <div className={styles.userMenuItem}>
              <MIcons
                name="icon-shezhi3"
                text="个人设置"
                iconWrapClass={styles.iconWrap}
              />
            </div>
          ),
        },
        {
          key: '3',
          label: (
            <div className={styles.userMenuItem}>
              <MIcons
                name="icon-tuichu1"
                text="退出登录"
                iconWrapClass={styles.iconWrap}
              />
            </div>
          ),
        },
      ]}
    />
  );

  return (
    getUserInfo.userId ? (
      <div className={styles.User}>
        <Dropdown overlay={menu} placement="bottomRight" arrow trigger={['click']}>
          <div className={styles.headImg}>
            <Image
              url={getUserInfo?.headUrl || HEAD_UEL}
              transitionImg={HEAD_UEL}
              className={styles.image}
            />
          </div>
        </Dropdown>
      </div>
    ) : null
  );
};

export default User;
