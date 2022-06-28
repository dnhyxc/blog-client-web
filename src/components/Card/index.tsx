import React from "react";

import styles from "./index.less";

interface ListParams {
  id: string;
  name: string;
  desc: string;
  date: string;
}

interface IProps {
  list: ListParams[];
  toDetail?: Function;
}

const Card: React.FC<IProps> = ({ list, toDetail }) => {
  return (
    <div className={styles.wrap}>
      {list.map((i) => (
        <div
          className={styles.item}
          key={i.id}
          onClick={() => toDetail && toDetail(i.id)}
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
  );
};

export default Card;
