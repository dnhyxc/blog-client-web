import React from "react";
import Content from "@/components/Content";
import Header from "@/components/Header";
import styles from "./index.less";

interface IProps {}

const TimeLine: React.FC<IProps> = () => {
  return (
    <div className={styles.TimeLine}>
      <Header>TimeLine</Header>
      <Content>
        <div className={styles.wrap}>时间轴线</div>
      </Content>
    </div>
  );
};

export default TimeLine;
