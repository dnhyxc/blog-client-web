import React from "react";
import IMAGE from "@/assets/images/about_me.jpg";
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
  const bgcStyle = (bgc: string) => {
    return {
      backgroundImage: `url(${bgc})`,
      backgroundPosition: "center",
      backgroundSize: "100% 150px",
      backgroundRepeat: "no-repeat",
      transition: "all 0.3s ease-in-out",
      // filter: "blur(0.5px)",
    };
  };
  return (
    <div className={styles.wrap}>
      {list.map((i) => (
        <div
          className={styles.item}
          key={i.id}
          onClick={() => toDetail && toDetail(i.id)}
        >
          <div className={styles.imgWrap} style={bgcStyle(IMAGE)}>
            <div className={styles.text}>{i.name}</div>
          </div>
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
