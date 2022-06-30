import React from "react";
import Content from "@/components/Content";
import Header from "@/components/Header";
import styles from "./index.less";

interface IProps {}

const Tag: React.FC<IProps> = () => {
  return (
    <div className={styles.Tag}>
      <Header>Tag</Header>
      <Content>
        <div className={styles.wrap}>文章标签</div>
      </Content>
    </div>
  );
};

export default Tag;
