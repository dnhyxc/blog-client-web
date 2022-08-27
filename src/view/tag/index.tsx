import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import Content from '@/components/Content';
import Header from '@/components/Header';
import WordCloud from '@/components/WordCloud';
import { useGetBodyWidth } from '@/hooks';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import WordList from '@/components/WordList';
import { TagResult } from '@/typings/common';
import styles from './index.less';

const Tag: React.FC = () => {
  const [tagList, setTagList] = useState<TagResult[]>([]);
  const navigate = useNavigate();
  const { bodyWidth } = useGetBodyWidth();

  useEffect(() => {
    getTagList();
  }, []);

  console.log(bodyWidth, 'bodyWidth');

  const getTagList = async () => {
    const res = normalizeResult<TagResult[]>(await Service.getTagList());
    if (res.success) {
      setTagList(res.data);
    } else {
      message.error(res.message);
    }
  };

  const toTagList = (name: string) => {
    navigate(`/tag/list?tagName=${name}`);
  };

  return (
    <div className={styles.Tag}>
      <Header needMenu>文章标签</Header>
      <Content>
        <div className={styles.wrap}>
          {tagList.length > 0 && bodyWidth > 960 ? (
            <WordCloud data={tagList} callback={toTagList} />
          ) : (
            <WordList data={tagList} callback={toTagList} />
          )}
        </div>
      </Content>
    </div>
  );
};

export default Tag;
