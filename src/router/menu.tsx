import {
  HomeOutlined,
  ReadOutlined,
  TagsOutlined,
  UserOutlined,
  FolderOpenOutlined,
  FieldTimeOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import styles from './index.less';

const menuList = [
  {
    key: 'home',
    icon: <HomeOutlined className={styles.menu_icon} />,
    label: '文章列表',
    name: '主页',
    path: '/home',
  },
  {
    key: 'classify',
    icon: <FolderOpenOutlined className={styles.menu_icon} />,
    label: '文章分类',
    name: '分类',
    path: '/classify',
  },
  {
    key: 'tag',
    icon: <TagsOutlined className={styles.menu_icon} />,
    label: '文章标签',
    name: '标签',
    path: '/tag',
  },
  {
    key: 'timeline',
    icon: <FieldTimeOutlined className={styles.menu_icon} />,
    label: '时间轴线',
    name: '时间轴',
    path: '/timeline',
  },
  {
    key: 'personal',
    icon: <UserOutlined className={styles.menu_icon} />,
    label: '我的主页',
    name: '我的主页',
    path: '/personal',
  },
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
];

const settingList = [
  {
    key: 'profile',
    icon: <HomeOutlined className={styles.menu_icon} />,
    label: '个人资料',
    name: '个人资料',
    path: '/profile',
  },
  {
    key: 'account',
    icon: <HomeOutlined className={styles.menu_icon} />,
    label: '账号设置',
    name: '账号设置',
    path: '/account',
  },
];

export { menuList, settingList };
