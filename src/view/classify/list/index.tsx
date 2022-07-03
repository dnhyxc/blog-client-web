import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Content from "@/components/Content";
import Card from "@/components/Card";
import RightBar from "@/components/RightBar";
import styles from "./index.less";

interface IProps {}

const data = [
  {
    id: "1",
    name: "文章名称1",
    desc: "文章描述啊",
    date: "2022-02-09",
  },
  {
    id: "2",
    name: "文章名称2",
    desc: "文章描述啊2222222222222",
    date: "2022-09-02",
  },
  {
    id: "3",
    name: "react",
    desc: "react 项目搭建",
    date: "2022-11-01",
  },
  {
    id: "4",
    name: "webpack",
    desc: "webpack 项目搭建",
    date: "2022-06-13",
  },
  {
    id: "5",
    name: "babel",
    desc: "babel 项目搭建",
    date: "2022-06-13",
  },
];

const ClassifyList: React.FC<IProps> = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const name = search.get("name");
  const tagName = search.get("tagName");

  console.log(name, "name");
  console.log(tagName, "tagName");

  const toDetail = (id: string) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className={styles.ClassifyList}>
      <Header needLeft>{name} 分类</Header>
      <Content className={styles.contentWrap}>
        <div className={styles.content}>
          <Card list={data} toDetail={toDetail} />
          <RightBar className={styles.rightbar} />
        </div>
      </Content>
    </div>
  );
};

export default ClassifyList;
