import React from "react";
import { useNavigate } from "react-router-dom";
import Content from "@/components/Content";
import Header from "@/components/Header";
import RightBar from "@/components/RightBar";
import { data } from "../../../mock";
import styles from "./index.less";

interface IProps {}

const Classify: React.FC<IProps> = () => {
  const navigate = useNavigate();

  const toTagList = (tagName: string, name: string) => {
    navigate(`/classify/list?tagName=${tagName}&name=${name}`);
  };

  return (
    <div className={styles.Classify}>
      <Header needMenu>文章分类</Header>
      <Content className={styles.contentWrap}>
        <div className={styles.wrap}>
          <div className={styles.tagList}>
            {data.map((i) => (
              <div key={i.tagName} className={styles.tagListWrap}>
                <div className={styles.tagName}>{i.tagName}</div>
                <div className={styles.tagList}>
                  {i.child.length &&
                    i.child.map((j) => (
                      <span
                        key={j.id}
                        className={styles.tagItem}
                        onClick={() => toTagList(i.tagName, j.name)}
                      >
                        {j.name}
                        {`(${j.count})`}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <RightBar />
        </div>
      </Content>
    </div>
  );
};

export default Classify;
