import React from "react";
import classname from "classname";
import ABOUTME from "@/assets/images/about_me.jpg";
import styles from "./index.less";

interface IProps {
  className?: string;
}

const RightBar: React.FC<IProps> = ({ className }) => {
  return (
    <div className={classname(styles.container, className)}>
      <div className={styles.about_me}>
        <div className={styles.title}>个人名片</div>
        <div className={styles.card}>
          <img className={styles.image} src={ABOUTME} alt="关于我" />
        </div>
        <div>
          name：
          <span className={styles.name}>dnhyxc</span>
        </div>
        <div>
          job：
          <span className={styles.name}>前端开发</span>
        </div>
        <div>
          github：
          <a
            href="https://github.com/dnhyxc"
            target="_blank"
            className={styles.name}
            rel="noreferrer"
          >
            github.com/dnhyxc
          </a>
        </div>
        <div className={styles.skill_wrap}>
          skill：
          <span className={styles.skill}>
            JS、HTML、CSS、React、Vue、Webpack、node、mobx、TypeScript
          </span>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
