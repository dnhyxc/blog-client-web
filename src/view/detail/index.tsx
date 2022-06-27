/*
 * @Description: 详情页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\detail\index.tsx
 */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import Content from "@/components/Content";
import Content from "@/components/Content";
import Preview from "@/components/Preview";
import Header from "@/components/Header";
import { getMackdownById } from "@/controller/index";
import RightBar from "@/components/RightBar";
import styles from "./index.less";

interface DetailParams {
  name: string;
  desc: string;
  mackdown: any;
  date: string;
}

const CreateMackdown: React.FC = () => {
  const [detail, setDetail] = useState<DetailParams | undefined>({
    name: "",
    desc: "",
    mackdown: "",
    date: "",
  });

  const { id } = useParams();

  useEffect(() => {
    const res = getMackdownById(id);
    setDetail(res?.detail);
  }, [id]);

  return (
    <div className={styles.detailContainer}>
      <Header>Preview mackdown</Header>
      <Content className={styles.content} wrapClassName={styles.wrapClassName}>
        <Preview className={styles.preview} mackdown={detail?.mackdown} />
        <RightBar />
      </Content>
    </div>
  );
};

export default CreateMackdown;
