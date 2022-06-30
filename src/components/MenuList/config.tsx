import {
  HomeOutlined,
  CodeOutlined,
  TagsOutlined,
  MenuOutlined,
  NodeExpandOutlined,
} from "@ant-design/icons";

export const items = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "文章列表",
  },
  {
    key: "classify",
    icon: <MenuOutlined />,
    label: "文章分类",
  },
  {
    key: "tag",
    icon: <TagsOutlined />,
    label: "文章标签",
  },
  {
    key: "timeline",
    icon: <NodeExpandOutlined />,
    label: "时间轴线",
  },
  {
    key: "about",
    icon: <HomeOutlined />,
    label: "关于我的",
  },
  {
    key: "create",
    icon: <CodeOutlined />,
    label: "发布文章",
  },
];
