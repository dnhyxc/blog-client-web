import {
  HomeOutlined,
  ReadOutlined,
  TagsOutlined,
  SolutionOutlined,
  FolderOpenOutlined,
  FieldTimeOutlined,
  IdcardOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import styles from './index.less';

const menuList = [
  {
    key: 'home',
    icon: <HomeOutlined className={styles.menu_icon} />,
    label: '文章列表',
    name: '文章列表',
    path: '/home',
  },
  {
    key: 'classify',
    icon: <FolderOpenOutlined className={styles.menu_icon} />,
    label: '文章分类',
    name: '文章分类',
    path: '/classify',
  },
  {
    key: 'tag',
    icon: <TagsOutlined className={styles.menu_icon} />,
    label: '文章标签',
    name: '文章标签',
    path: '/tag',
  },
  {
    key: 'timeline',
    icon: <FieldTimeOutlined className={styles.menu_icon} />,
    label: '时间轴线',
    name: '时间轴线',
    path: '/timeline',
  },
  // {
  //   key: 'personal',
  //   icon: <UserOutlined className={styles.menu_icon} />,
  //   label: '我的主页',
  //   name: '我的主页',
  //   path: '/personal',
  // },
  {
    key: 'create',
    icon: <ReadOutlined className={styles.menu_icon} />,
    label: '发布文章',
    name: '发布文章',
    path: '/create',
  },
  {
    key: 'author',
    icon: <IdcardOutlined className={styles.menu_icon} />,
    label: '关于博主',
    name: '关于博主',
    path: '/author',
  },
  {
    key: 'download',
    icon: <IdcardOutlined className={styles.menu_icon} />,
    label: '客户端下载',
    name: '客户端下载',
    path: '/download',
  },
];

const settingList = [
  {
    key: 'profile',
    icon: <SolutionOutlined className={styles.menu_icon} />,
    label: '个人资料',
    name: '个人资料',
    path: '/profile',
  },
  {
    key: 'account',
    icon: <SettingOutlined className={styles.menu_icon} />,
    label: '账号设置',
    name: '账号设置',
    path: '/account',
  },
];

export { menuList, settingList };
