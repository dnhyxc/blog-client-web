import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classname from 'classname';
import { menuList } from '@/router/menu';
import { useHtmlWidth } from '@/hooks';

import styles from './index.less';

// const menuList = [
//   {
//     key: 'home',
//     icon: <HomeOutlined className={styles.menu_icon} />,
//     label: '文章列表',
//     name: '文章列表',
//     path: '/home',
//   },
//   {
//     key: 'classify',
//     icon: <FolderOpenOutlined className={styles.menu_icon} />,
//     label: '文章分类',
//     name: '文章分类',
//     path: '/classify',
//   },
//   {
//     key: 'tag',
//     icon: <TagsOutlined className={styles.menu_icon} />,
//     label: '文章标签',
//     name: '文章标签',
//     path: '/tag',
//   },
//   {
//     key: 'timeline',
//     icon: <FieldTimeOutlined className={styles.menu_icon} />,
//     label: '时间轴线',
//     name: '时间轴',
//     path: '/timeline',
//   },
//   // {
//   //   key: 'personal',
//   //   icon: <UserOutlined className={styles.menu_icon} />,
//   //   label: '我的主页',
//   //   name: '我的主页',
//   //   path: '/personal',
//   // },
//   {
//     key: 'create',
//     icon: <ReadOutlined className={styles.menu_icon} />,
//     label: '发布文章',
//     name: '发布文章',
//     path: '/create',
//   },
//   {
//     key: 'author',
//     icon: <IdcardOutlined className={styles.menu_icon} />,
//     label: '关于博主',
//     name: '关于博主',
//     path: '/author',
//   },
// ];

interface IProps {
  className?: string;
  children?: ReactNode;
}

const MenuList: React.FC<IProps> = ({ className, children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { htmlWidth } = useHtmlWidth();

  const toOtherPage = (e: any, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <div className={classname(styles.MenuList, className)}>
      {
        htmlWidth < 960 && menuList.map((i) => {
          return (
            <div
              key={i.key}
              className={classname(
                styles.item,
                i.path === pathname && styles.active
              )}
              onClick={(e) => toOtherPage(e, i.path)}
            >
              <span className={styles.icon}>{i.icon}</span>
              <span className={styles.text}>{i.name}</span>
            </div>
          );
        })
      }
      {children}
    </div>
  );
};

export default MenuList;
