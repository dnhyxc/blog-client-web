import React from "react";
import { useNavigate } from "react-router-dom";
import Content from "@/components/Content";
import Header from "@/components/Header";
import WordCloud from "@/components/wordCloud";
import { tagList } from "../../../mock";
import { TAG_STYLES } from "./style";
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
          <div className={styles.tagList}>
            {tagList.map((i) => {
              return (
                <span
                  key={i.id}
                  className={styles.tag}
                  style={TAG_STYLES[i.count] || TAG_STYLES[20]}
                  onClick={() => toTagList(i.name)}
                >
                  {i.name}
                </span>
              );
            })}
            <WordCloud />
          </div>
        </div>
      </Content>
    </div>
  );
};

export default Tag;
