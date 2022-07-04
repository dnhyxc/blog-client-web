import React from "react";
import { useNavigate } from "react-router-dom";
import Content from "@/components/Content";
import Header from "@/components/Header";
import WordCloud from "@/components/WordCloud";
import { tagList } from "../../../mock";
import styles from "./index.less";

interface IProps {}

const Tag: React.FC<IProps> = () => {
  const navigate = useNavigate();

  const toTagList = (name: string) => {
    navigate(`/tag/list?name=${name}`);
  };

  return (
    <div className={styles.Tag}>
      <Header>文章标签</Header>
      <Content>
        <div className={styles.wrap}>
          <WordCloud data={tagList} callback={toTagList} />
        </div>
      </Content>
    </div>
  );
};

export default Tag;
