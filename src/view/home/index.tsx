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
import { list } from "../../../mock";
import styles from "./index.less";

const { Search } = Input;

const Home = () => {
  const navigate = useNavigate();

  const toDetail = (id: string) => {
    navigate(`detail/${id}`);
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
      <Content className={styles.content}>
        <div className={styles.wrap}>
          {list.map((i) => (
            <div
              className={styles.item}
              key={i.id}
              onClick={() => toDetail(i.id)}
            >
              <div className={styles.img}>{i.name}</div>
              <div className={styles.info}>
                <div className={styles.name}>{i.name}</div>
                <div className={styles.desc}>{i.desc}</div>
                <div className={styles.date}>{i.date}</div>
              </div>
            </div>
          ))}
        </div>
        <RightBar className={styles.rightbar} />
      </Content>
    </div>
  );
};

export default Home;
