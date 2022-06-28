import React from "react";
import MarkNav from "markdown-navbar"; // markdown 目录
import "markdown-navbar/dist/navbar.css";
import styles from "./index.less";

interface IProps {
  mackdown: string;
}

const Toc: React.FC<IProps> = ({ mackdown }) => {
  return (
    <div className={styles.tocWrap}>
      <div className={styles.tocText}>文章目录</div>
      <MarkNav
        className={styles.tocList}
        source={mackdown}
        headingTopOffset={60}
        declarative={false}
        ordered
      />
    </div>
  );
};

export default Toc;
