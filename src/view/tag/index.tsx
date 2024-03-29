import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classname from 'classname';
import Content from '@/components/Content';
import Header from '@/components/Header';
import WordCloud from '@/components/WordCloud';
import { useGetBodyWidth, useGetTheme, useHtmlWidth } from '@/hooks';
import * as Service from '@/service';
import { normalizeResult, error } from '@/utils';
import WordList from '@/components/WordList';
import ActionIcon from '@/components/ActionIcon';
import MIcons from '@/components/Icons';
import { TagResult } from '@/typings/common';
import styles from './index.less';

const Tag: React.FC = () => {
  const [tagList, setTagList] = useState<TagResult[]>([]);
  const navigate = useNavigate();
  const { bodyWidth } = useGetBodyWidth();
  const { themeMode } = useGetTheme();
  const { htmlWidth } = useHtmlWidth();

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
      <MIcons
        name="icon-sousuo2"
        className={classname(styles.iconWrap, themeMode === 'dark' && styles.darkIcon)}
        onClick={toSearch}
      />
    </div>
  );

  return (
    <div className={styles.Tag}>
      {htmlWidth <= 960 && (
        <ActionIcon
          noHideMenuIcon
          className={styles.changeIconWrap}
          themeMode={themeMode}
          htmlWidth={htmlWidth}
        />
      )}
      <Header right={rightNode()} themeMode={themeMode}>
        文章标签
      </Header>
      <Content className={styles.tagContentWrap} themeMode={themeMode}>
        <div className={classname(styles.wrap, themeMode === 'dark' && styles.dark)}>
          {tagList.length > 0 && bodyWidth > 960 ? (
            <WordCloud data={tagList} callback={toTagList} key={Math.random()} />
          ) : (
            <WordList data={tagList} callback={toTagList} className={styles.wordListWrap} />
          )}
        </div>
      </Content>
    </div>
  );
};

export default Tag;
