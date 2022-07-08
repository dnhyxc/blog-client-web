import React from "react";
import { Skeleton } from "antd";
import classname from "classname";
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
  wrapClass?: string;
  itemClass?: string;
  imgWrapClass?: string;
  imgBgcSize?: string;
  descClass?: string;
}

const Card: React.FC<IProps> = ({
  list,
  toDetail,
  wrapClass,
  itemClass,
  imgWrapClass,
  imgBgcSize = "100% 150px",
  descClass,
}) => {
  const bgcStyle = (bgc: string) => {
    return {
      backgroundImage: `url(${bgc})`,
      backgroundPosition: "center",
      backgroundSize: imgBgcSize,
      backgroundRepeat: "no-repeat",
      transition: "all 0.3s ease-in-out",
      // filter: "blur(0.5px)",
    };
  };
  return (
    <div className={classname(styles.wrap, wrapClass)}>
      {list && list.length < 0 ? (
        list.map((i) => (
          <div
            className={classname(styles.item, itemClass)}
            key={i.id}
            onClick={() => toDetail && toDetail(i.id)}
          >
            <div
              className={classname(styles.imgWrap, imgWrapClass)}
              style={bgcStyle(IMAGE)}
            >
              <div className={styles.text}>{i.name}</div>
            </div>
            <div className={styles.info}>
              <div className={styles.name}>{i.name}</div>
              <div className={descClass || styles.desc}>{i.desc}</div>
              <div className={styles.date}>{i.date}</div>
            </div>
          </div>
        ))
      ) : (
        <div className={classname(styles.item, itemClass, styles.skeletonWrap)}>
          <Skeleton active paragraph={{ rows: 1 }} />
        </div>
      )}
    </div>
  );
};

export default Card;
