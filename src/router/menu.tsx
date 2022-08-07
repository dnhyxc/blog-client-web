import {
  HomeOutlined,
  ReadOutlined,
  TagsOutlined,
  UserOutlined,
  FolderOpenOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import userInfoParams from '@/store/user';
import styles from './index.less';

const { getUserInfo } = userInfoParams;

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
    key: 'about',
    icon: <UserOutlined className={styles.menu_icon} />,
    label: '关于我的',
    name: '关于我',
    path: '/about',
  },
];

if (getUserInfo?.username !== 'cx') {
  menuList.push({
    key: 'create',
    icon: <ReadOutlined className={styles.menu_icon} />,
    label: '发布文章',
    name: '发布文章',
    path: '/create',
  });
}

export { menuList };
