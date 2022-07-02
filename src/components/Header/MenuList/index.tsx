import React, { useState, Fragment, ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, Dropdown, Space } from "antd";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import classname from "classname";
import { useHtmlWidth } from "@/hooks";

import styles from "./index.less";

interface IProps {
  className?: string;
  children?: ReactNode;
}

const menuConfig = [
  {
    key: "home",
    name: "主页",
    path: "/home",
  },
  {
    key: "classify",
    name: "分类",
    path: "/classify",
  },
  {
    key: "tag",
    name: "标签",
    path: "/tag",
  },
  {
    key: "timeline",
    name: "时间轴",
    path: "/timeline",
  },
  {
    key: "about",
    name: "关于我",
    path: "/about",
  },
  {
    key: "create",
    name: "发布文章",
    path: "/create",
  },
];

// const menuName = {
//   "/home": "首页",
//   "/classify": "分类",
//   "/tag": "标签",
//   "/timeline": "时间轴",
//   "/about": "关于我",
//   "/create": "发布文章",
// };

const MenuList: React.FC<IProps> = ({ className, children }) => {
  const navigate = useNavigate();
  const { htmlWidth } = useHtmlWidth();
  // const { pathname } = useLocation();
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  // const [selectName, setSelectName] = useState<string>("");

  // useEffect(() => {
  //   // @ts-ignore
  //   const name = menuName[pathname];
  //   if (name) {
  //     setSelectName(name);
  //   } else {
  //     setSelectName("详情");
  //   }
  // }, [pathname]);
  const toOtherPage = (e: any, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  const menu = (
    <Menu
      items={menuConfig.map((i) => ({
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
                <CaretUpOutlined
                  className={menuVisible ? styles.activeMenu : ""}
                />
              ) : (
                <CaretDownOutlined />
              )}
            </Space>
          </Dropdown>
        </span>
      ) : (
        menuConfig.map((i) => {
          return (
            <Fragment key={i.name}>
              <span
                className={styles.item}
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
