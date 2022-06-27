import reactTemplate from "./react-template.md";
import JSON from "./test.md";
import eslint from "./eslint.md";

export const list = [
  {
    id: "1",
    name: "react template",
    desc: "react + webpack + typescript + eslint 项目搭建",
    date: "2020-06-13",
  },
  {
    id: "2",
    name: "JSON",
    desc: "JSON 数据测试",
    date: "2020-06-14",
  },
  {
    id: "3",
    name: "eslint",
    desc: "eslint 配置",
    date: "2020-06-15",
  },
];

export const detail = [
  {
    id: "1",
    detail: {
      name: "react template",
      desc: "react + webpack + typescript + eslint 项目搭建",
      mackdown: reactTemplate,
      date: "2020-06-13",
    },
  },
  {
    id: "2",
    detail: {
      name: "JSON",
      desc: "JSON 数据测试",
      mackdown: JSON,
      date: "2020-06-14",
    },
  },
  {
    id: "3",
    detail: {
      name: "JSON",
      desc: "JSON 数据测试",
      mackdown: eslint,
      date: "2020-06-15",
    },
  },
];
