import React, { useState, useEffect, memo } from "react";
import { Spin } from "antd";
import classnames from "classnames";
import WordCloudChart from "bizcharts/lib/plots/WordCloudChart";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import styles from "./index.less";

const GhostData = [{ value: ".", weight: 0 }]; // 第一条数据有时候画不出来
interface IProps {
  onSelect?: Function;
}

const Wordcloud: React.FC<IProps> = ({ onSelect }) => {
  const [data, setData] = useState<any[]>([]);
  const getDataList = (word: any): any[] => {
    // @ts-ignore
    return word.map((d, i) => ({
      word: d.value,
      weight: d.weight,
      id: i + 1,
    }));
  };
  const getRandomColor = () => {
    const arr = [
      "#5B8FF9",
      "#5AD8A6",
      "#5D7092",
      "#F6BD16",
      "#E8684A",
      "#6DC8EC",
      "#9270CA",
      "#FF9D4D",
      "#269A99",
      "#FF99C3",
    ];
    return arr[Math.floor(Math.random() * (arr.length - 1))];
  };

  const onClick = (item: any) => {
    const { word } = item;
    if (onSelect && word) {
      onSelect(word);
    }
    return {};
  };

  const loadData = async () => {
    const words = [
      {
        value: "JavaScript",
        weight: 2,
      },
      {
        value: "CSS",
        weight: 2,
      },
      {
        value: "HTML",
        weight: 6,
      },
      {
        value: "React",
        weight: 10,
      },
      {
        value: "Node",
        weight: 5,
      },
    ];

    setData(getDataList(GhostData.concat(words)));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div
      className={classnames(
        data.length > 0 ? styles.canvasContainer : styles.emptyContainer
      )}
    >
      <Spin>
        {data.length > 1 ? (
          <WordCloudChart
            data={data}
            forceFit
            pixelRatio={1}
            wordStyle={{
              rotation: [-Math.PI / 2, Math.PI / 2],
              rotateRatio: 0.5,
              rotationSteps: 2,
              fontSize: [26, 50],
              color: (word: any, weight: number) => {
                if (weight === 0) {
                  return "#FFFFFE";
                }
                return getRandomColor();
              },
              active: {
                shadowColor: "#CCC",
                shadowBlur: 2,
              },
              gridSize: 14,
            }}
            shape="square"
            shuffle
            backgroundColor="#fff"
            onWordCloudClick={onClick}
          />
        ) : (
          <div>暂无标签</div>
        )}
      </Spin>
    </div>
  );
};

export default memo(Wordcloud);

/**
 *      <WordCloud onSelect={onKeywordSelect} />
 */
