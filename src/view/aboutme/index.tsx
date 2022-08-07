/*
 * @Description: About 页面
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\about\index.tsx
 */
import { useEffect, useState } from 'react';
import { Button, Tabs } from 'antd';
import Content from '@/components/Content';
import Image from '@/components/Image';
import Card from '@/components/Card';
import MIcons from '@/components/Icons';
import ABOUTME from '@/assets/images/about_me.jpg';
import Header from '@/components/Header';
import { ArticleListResult, ArticleItem } from '@/typings/common';
import styles from './index.less';

const { TabPane } = Tabs;

const data: any = {
  total: 23,
  list: [
    {
      id: '62eea54efb51f8f262110eae',
      title: '排序bug',
      classify: '代码人生',
      tag: 'Node.js',
      coverImage: 'http://localhost:9112/c9d5921bd366443bd4ddfc800.png',
      abstract: '排序bug修复记录，需要将sort放在分页前面',
      authorId: '62d4224c09462307ebabfeca',
      isLike: true,
      likeCount: 2,
      createTime: 1659807012768
    },
    {
      id: '62eea3486d5a6480adf11401',
      title: '来呀来',
      classify: '代码人生',
      tag: 'JavaScript',
      coverImage: 'http://localhost:9112/db7aa5fb173b607e826fa5404.jpg',
      abstract: '来呀来',
      authorId: '62d4224c09462307ebabfeca',
      isLike: true,
      likeCount: 1,
      createTime: 1659806514968
    },
    {
      id: '62eea2eb6d5a6480adf113e3',
      title: '权限判断',
      classify: '阅读',
      tag: 'Node.js',
      coverImage: 'http://localhost:9112/db7aa5fb173b607e826fa5403.png',
      abstract: '来呀来',
      authorId: '62d4224c09462307ebabfeca',
      isLike: false,
      likeCount: 0,
      createTime: 1659806421374
    },
    {
      id: '62e7efcff65a521c3cdc1148',
      title: '777',
      classify: '阅读',
      tag: '项目部署',
      abstract: '777',
      authorId: '62e2b89eef673e2d00a3f2a9',
      isLike: false,
      createTime: 1659367375785
    }
  ]
};

const tabs = [
  {
    name: '我的文章',
    value: '1'
  },
  {
    name: '点赞文章',
    value: '2'
  },
  {
    name: '我的收藏',
    value: '3'
  },
];

const AboutMe = () => {
  const [selectKey, setSelectKey] = useState<string>('1');
  const [articleList, setArticleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });

  useEffect(() => {
    if (selectKey === '1') {
      setArticleList({
        list: data.list,
        total: 4,
        count: 0,
      });
    }
    if (selectKey === '2') {
      setArticleList({
        list: data.list.slice(0, 3) as any,
        total: 3,
        count: 0,
      });
    }
    if (selectKey === '3') {
      setArticleList({
        list: data.list.slice(0, 2) as any,
        total: 2,
        count: 0,
      });
    }
  }, [selectKey]);

  const onChange = (key: string) => {
    console.log(key);
    setSelectKey(key);
  };

  return (
    <div className={styles.AboutMe}>
      <Header>About</Header>
      <Content className={styles.contentWrap}>
        <div className={styles.content}>
          <div className={styles.wrap}>
            <div className={styles.userInfo}>
              <Image url={ABOUTME} className={styles.image} />
              <div className={styles.user}>
                <div className={styles.userName}>dnhyxc</div>
                <div>职位: 前端工程师</div>
                <div>行到水穷处，坐看云起时</div>
              </div>
              <div className={styles.actions}>
                <div className={styles.icons}>
                  <MIcons
                    name="icon-comment"
                    className={styles.adsIcon}
                    iconWrapClass={styles.iconWrap}
                  />
                  <MIcons
                    name="icon-comment"
                    className={styles.adsIcon}
                    iconWrapClass={styles.iconWrap}
                  />
                  <MIcons
                    name="icon-comment"
                    className={styles.adsIcon}
                    iconWrapClass={styles.iconWrap}
                  />
                </div>
                <Button type="primary" ghost>修改个人资料</Button>
              </div>
            </div>
            <div className={styles.tabsWrap}>
              <Tabs defaultActiveKey="1" onChange={onChange}>
                {
                  tabs.map((i) => {
                    return (
                      <TabPane tab={i.name} key={i.value}>
                        <Card
                          list={articleList.list}
                          wrapClass={styles.wrapClass}
                        // toDetail={toDetail}
                        // deleteArticle={deleteArticle}
                        // likeArticle={likeArticle}
                        // onEditArticle={onEditArticle}
                        // showInfo={
                        //   articleList.list.length > 0 && articleList.list.length === articleList.total
                        // }
                        />
                      </TabPane>
                    );
                  })
                }
              </Tabs>
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default AboutMe;
