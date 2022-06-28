/*
 * @Description: 详情页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\detail\index.tsx
 */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Affix } from "antd";
import Preview from "@/components/Preview";
import Header from "@/components/Header";
import { getMackdownById } from "@/controller/index";
import RightBar from "@/components/RightBar";
import Toc from "@/components/ArticleToc";
import styles from "./index.less";

interface DetailParams {
  name: string;
  desc: string;
  mackdown: any;
  date: string;
  img: string;
}

const ArticleDetail: React.FC = () => {
  const [detail, setDetail] = useState<DetailParams>({
    name: "",
    desc: "",
    mackdown: "",
    date: "",
    img: "",
  });

  const { id } = useParams();

  useEffect(() => {
    const res = getMackdownById(id);
    setDetail(res?.detail!);
  }, [id]);

  const renderCoverImg = (data: DetailParams) => (
    <div className={styles.titleWrap}>
      <div className={styles.title}>{data.name}</div>
      <img alt="封面" src={data.img} />
      <p className={styles.desc}>{data.desc}</p>
    </div>
  );

  return (
    <div className={styles.detailContainer}>
      <div className={styles.headerWrap}>
        <Header>detail</Header>
      </div>
      <div className={styles.content}>
        <Preview
          className={styles.preview}
          mackdown={detail?.mackdown}
          coverImg={renderCoverImg(detail!)}
        >
          <div className={styles.tagWrap}>
            <div className={styles.tagList}>
              分类：
              {["前端", "后端"].map((i) => (
                <span className={styles.tag} key={i}>
                  {i}
                </span>
              ))}
            </div>
            <div className={styles.tagList}>
              标签：
              {["标签1", "标签2", "标签3"].map((i) => (
                <span className={styles.tag} key={i}>
                  {i}
                </span>
              ))}
            </div>
          </div>
        </Preview>
        <div className={styles.rightBar}>
          <RightBar />
          <Affix offsetTop={50}>
            <Toc mackdown={detail?.mackdown} />
          </Affix>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
