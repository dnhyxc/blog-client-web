import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Space } from 'antd';
import classname from 'classname';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { SettingMenu } from '@/constant';

import styles from './index.less';

interface IProps {
  className?: string;
}

const MDropdown: React.FC<IProps> = ({ className }) => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const menu = (
    <Menu
      items={SettingMenu.map((i) => ({
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
      <span className={styles.itemIcon}>
        <Dropdown
          overlayClassName={styles.dropdown}
          placement="bottom"
          overlay={menu}
          onVisibleChange={onVisibleChange}
        >
          <Space className={styles.space}>
            <span className={styles.selectMenu}>
              {/* <MenuOutlined className={styles.menuIcon} /> */}
            </span>
            {menuVisible ? (
              <CaretUpOutlined className={menuVisible ? styles.activeMenu : ''} />
            ) : (
              <CaretDownOutlined />
            )}
          </Space>
        </Dropdown>
      </span>
    </div>
  );
};

export default MDropdown;
