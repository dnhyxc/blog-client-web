import React, { useEffect, useState, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, Dropdown, Space } from "antd";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import classname from "classname";
import { ReactNode } from "react-markdown/lib/react-markdown";

import styles from "./index.less";

interface IProps {
  className?: string;
  children?: ReactNode;
}

const menuConfig = [
  {
    name: "主页",
    path: "/home",
  },
  {
    name: "分类",
    path: "/classify",
  },
  {
    name: "标签",
    path: "/tag",
  },
  {
    name: "时间轴",
    path: "/timeline",
  },
  {
    name: "关于我",
    path: "/about",
  },
  {
    name: "发布文章",
    path: "/create",
  },
];

const MenuList: React.FC<IProps> = ({ className, children }) => {
  const navigate = useNavigate();
  const [documentWidth, setDocumentWidth] = useState<number>(0);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onResize = () => {
    const width = document.documentElement.clientWidth;
    setDocumentWidth(width);
  };

  const toOtherPage = (e: any, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  const menu = (
    <Menu
      items={[
        {
          key: "home",
          label: (
            <Link to="/home" className={styles.menu_label}>
              首页
            </Link>
          ),
        },
        {
          key: "classify",
          label: (
            <Link to="/classify" className={styles.menu_label}>
              分类
            </Link>
          ),
        },
        {
          key: "tag",
          label: (
            <Link to="/tag" className={styles.menu_label}>
              标签
            </Link>
          ),
        },
        {
          key: "timeline",
          label: (
            <Link to="/timeline" className={styles.menu_label}>
              时间轴
            </Link>
          ),
        },
        {
          key: "about",
          label: (
            <Link to="/about" className={styles.menu_label}>
              关于我
            </Link>
          ),
        },
        {
          key: "create",
          label: (
            <Link to="/create" className={styles.menu_label}>
              发布文章
            </Link>
          ),
        },
      ]}
    />
  );

  const onVisibleChange = (visible: boolean) => {
    setMenuVisible(visible);
  };

  return (
    <div className={classname(styles.MenuList, className)}>
      {documentWidth < 590 ? (
        <span className={styles.itemIcon}>
          <Dropdown
            overlayClassName={styles.dropdown}
            placement="bottom"
            overlay={menu}
            onVisibleChange={onVisibleChange}
          >
            <Space className={styles.space}>
              <span className={styles.selectMenu}>
                <MenuOutlined />
              </span>
              {menuVisible ? (
                <CaretUpOutlined />
              ) : (
                <CaretDownOutlined
                  className={menuVisible ? styles.activeMenu : null}
                />
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
