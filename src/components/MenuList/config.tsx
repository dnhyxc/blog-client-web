import {
  DesktopOutlined,
  HomeOutlined,
  FormOutlined,
  ReadOutlined,
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
    label: (
      <div>
        <span style={{ marginRight: "7px" }}>时</span>
        <span style={{ marginRight: "7px" }}>间</span>
        <span>轴</span>
      </div>
    ),
  },
  {
    key: "aboutme",
    icon: <HomeOutlined />,
    label: (
      <div>
        <span style={{ marginRight: "7px" }}>关</span>
        <span style={{ marginRight: "7px" }}>于</span>
        <span>我</span>
      </div>
    ),
  },
  {
    key: "about",
    icon: <DesktopOutlined />,
    label: "about",
  },
  {
    key: "create",
    icon: <FormOutlined />,
    label: "create",
  },
  {
    key: "preview",
    icon: <ReadOutlined />,
    label: "preview",
  },
  {
    key: "mackdown",
    icon: <CodeOutlined />,
    label: "mackdown",
  },
];
