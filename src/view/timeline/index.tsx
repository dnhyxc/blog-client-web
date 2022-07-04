import React from "react";
import { useNavigate } from "react-router-dom";
import { Timeline } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import Card from "@/components/Card";
import RightBar from "@/components/RightBar";
import Content from "@/components/Content";
import Header from "@/components/Header";
import styles from "./index.less";

interface IProps {}

const data = [
  {
    date: 2022,
    child: [
      {
        id: "1",
        name: "文章名称1",
        desc: "文章描述啊",
        date: "2022-02-09",
      },
      {
        id: "2",
        name: "文章名称2",
        desc: "文章描述啊2222222222222",
        date: "2022-09-02",
      },
    ],
  },
  {
    date: 2020,
    child: [
      {
        id: "1",
        name: "文章名称1",
        desc: "文章描述啊",
        date: "2022-02-09",
      },
      {
        id: "2",
        name: "文章名称2",
        desc: "文章描述啊2222222222222",
        date: "2022-09-02",
      },
      {
        id: "3",
        name: "react",
        desc: "react 项目搭建",
        date: "2022-11-01",
      },
      {
        id: "4",
        name: "webpack",
        desc: "webpack 项目搭建",
        date: "2022-06-13",
      },
    ],
  },
  {
    date: 2019,
    child: [
      {
        id: "3",
        name: "react",
        desc: "react 项目搭建",
        date: "2022-11-01",
      },
      {
        id: "4",
        name: "webpack",
        desc: "webpack 项目搭建",
        date: "2022-06-13",
      },
      {
        id: "5",
        name: "babel",
        desc: "babel 项目搭建",
        date: "2022-06-13",
      },
    ],
  },
];

const TimeLine: React.FC<IProps> = () => {
  const navigate = useNavigate();

  const toDetail = (id: string) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className={styles.TimeLine}>
      <Header needMenu>TimeLine</Header>
      <Content className={styles.contentWrap}>
        <div className={styles.wrap}>
          <Timeline className={styles.timelineContent}>
            {data.map((i) => {
              return (
                <Timeline.Item
                  className={styles.timelineItem}
                  key={i.date}
                  color="green"
                  dot={<ClockCircleOutlined style={{ fontSize: "16px" }} />}
                >
                  <div className={styles.cardList}>
                    <div className={styles.date}>{i.date}</div>
                    {i.child && i.child.length > 0 && (
                      <Card
                        list={i.child}
                        wrapClass={styles.wrapClass}
                        itemClass={styles.itemClass}
                        imgWrapClass={styles.imgWrapClass}
                        descClass={styles.descClass}
                        imgBgcSize="100% 100px"
                        toDetail={toDetail}
                      />
                    )}
                  </div>
                </Timeline.Item>
              );
            })}
          </Timeline>
          <RightBar className={styles.rightbar} />
        </div>
      </Content>
    </div>
  );
};

export default TimeLine;
