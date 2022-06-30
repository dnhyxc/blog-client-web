import React from "react";
import Content from "@/components/Content";
import Header from "@/components/Header";
import styles from "./index.less";

interface IProps {}

const Classify: React.FC<IProps> = () => {
  return (
    <div className={styles.Classify}>
      <Header>Classify</Header>
      <Content>
        <div className={styles.wrap}>
          <div className={styles.timelineTitle}>文章总览</div>
          <div className={styles.timelineWrap}>时间轴</div>
        </div>
      </Content>
    </div>
  );
};

export default Classify;
