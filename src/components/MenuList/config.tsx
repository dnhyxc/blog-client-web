import {
  HomeOutlined,
  ReadOutlined,
  TagsOutlined,
  UserOutlined,
  FolderOpenOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import styles from "./index.less";

export const items = [
  {
    key: "home",
    icon: <HomeOutlined className={styles.menu_icon} />,
    label: "文章列表",
  },
  {
    key: "classify",
    icon: <FolderOpenOutlined className={styles.menu_icon} />,
    label: "文章分类",
  },
  {
    key: "tag",
    icon: <TagsOutlined className={styles.menu_icon} />,
    label: "文章标签",
  },
  {
    key: "timeline",
    icon: <FieldTimeOutlined className={styles.menu_icon} />,
    label: "时间轴线",
  },
  {
    key: "about",
    icon: <UserOutlined className={styles.menu_icon} />,
    label: "关于我的",
  },
  {
    key: "create",
    icon: <ReadOutlined className={styles.menu_icon} />,
    label: "发布文章",
  },
];
