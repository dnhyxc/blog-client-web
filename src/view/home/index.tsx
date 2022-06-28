/*
 * @Description: 首页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\home\index.tsx
 */
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import Content from "@/components/Content";
import Header from "@/components/Header";
import RightBar from "@/components/RightBar";
import Card from "@/components/Card";
import { list } from "../../../mock";
import styles from "./index.less";

const { Search } = Input;

const Home = () => {
  const navigate = useNavigate();

  const toDetail = (id: string) => {
    navigate(`/detail/${id}`);
  };

  const onSearch = (value: string) => {
    console.log(value);
  };

  const rightNode = () => {
    return (
      <div>
        <Search placeholder="请输入搜索内容" enterButton onSearch={onSearch} />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Header right={rightNode()}>文章列表</Header>
      <Content className={styles.contentWrap}>
        <div className={styles.content}>
          <Card list={list} toDetail={toDetail} />
          <RightBar className={styles.rightbar} />
        </div>
      </Content>
    </div>
  );
};

export default Home;
