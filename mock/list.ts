import COVERIMG from "@/assets/images/about_me.jpg";
import reactTemplate from "./react-template.md";
import JSON from "./test.md";
import eslint from "./eslint.md";
import react from "./react.md";

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
  {
    id: "4",
    name: "react",
    desc: "react 配置",
    date: "2020-06-16",
  },
  {
    id: "5",
    name: "react18",
    desc: "react18 配置",
    date: "2020-06-17",
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
      img: COVERIMG,
    },
  },
  {
    id: "2",
    detail: {
      name: "JSON",
      desc: "JSON 数据测试",
      mackdown: JSON,
      date: "2020-06-14",
      img: COVERIMG,
    },
  },
  {
    id: "3",
    detail: {
      name: "JSON",
      desc: "JSON 数据测试",
      mackdown: eslint,
      date: "2020-06-15",
      img: COVERIMG,
    },
  },
  {
    id: "4",
    detail: {
      name: "react",
      desc: "react 数据测试",
      mackdown: react,
      date: "2020-06-16",
      img: COVERIMG,
    },
  },
  {
    id: "5",
    detail: {
      name: "react18",
      desc: "react18 配置",
      mackdown: react,
      date: "2020-06-17",
      img: COVERIMG,
    },
  },
];
