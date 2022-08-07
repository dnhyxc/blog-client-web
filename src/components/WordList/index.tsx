import React from 'react';
import { TAG_STYLES } from '@/constant';
import styles from './index.less';

interface IProps {
  data: { name: string; value: number }[];
  callback?: Function;
}

const WordList: React.FC<IProps> = ({ data, callback }) => {
  return (
    <div className={styles.WordList}>
      <div className={styles.tagList}>
        {data.map((i, index) => {
          return (
            <span
              key={index as any}
              className={styles.tag}
              style={TAG_STYLES[i.value] || TAG_STYLES[20]}
              onClick={() => callback && callback(i.name)}
            >
              {i.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default WordList;
