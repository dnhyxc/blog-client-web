import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Content from '@/components/Content';
import Header from '@/components/Header';
import WordCloud from '@/components/WordCloud';
import { useGetBodyWidth } from '@/hooks';
import * as Service from '@/service';
import { normalizeResult, error } from '@/utils';
import WordList from '@/components/WordList';
import MIcons from '@/components/Icons';
import { TagResult } from '@/typings/common';
import styles from './index.less';

const Tag: React.FC = () => {
  const [tagList, setTagList] = useState<TagResult[]>([]);
  const navigate = useNavigate();
  const { bodyWidth } = useGetBodyWidth();

  useEffect(() => {
    getTagList();
  }, []);

  const getTagList = async () => {
    const res = normalizeResult<TagResult[]>(await Service.getTagList());
    if (res.success) {
      setTagList(res.data);
    } else {
      error(res.message);
    }
  };

  const toTagList = (name: string) => {
    navigate(`/tag/list?tagName=${name}`);
  };

  // 高级搜索
  const toSearch = () => {
    navigate('/search');
  };

  // 渲染右侧搜索
  const rightNode = () => (
    <div className={styles.searchWrap}>
      <MIcons name="icon-sousuo2" className={styles.iconWrap} onClick={toSearch} />
    </div>
  );

  return (
    <div className={styles.Tag}>
      <Header right={rightNode()}>文章标签</Header>
      <Content>
        <div className={styles.wrap}>
          {tagList.length > 0 && bodyWidth > 960 ? (
            <WordCloud data={tagList} callback={toTagList} key={Math.random()} />
          ) : (
            <WordList data={tagList} callback={toTagList} />
          )}
        </div>
      </Content>
    </div>
  );
};

export default Tag;
