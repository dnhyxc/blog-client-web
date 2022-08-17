import React from 'react';
import { Affix, BackTop, Tabs } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Image from '@/components/Image';
import { HEAD_UEL, MAIN_COVER, AUTHOR_TABS } from '@/constant';
import RightBar from '@/components/RightBar';
// import useStore from '@/store';
import styles from './index.less';

const data = [
  {
    abstract: 'react webpack5 项目搭建',
    authorId: '62f8daba89f22210039e4316',
    classify: '架构',
    coverImage: 'http://localhost:9112/fa5f5639aa0df7696a68b8b00.png',
    createTime: 1660658271716,
    id: '62fba29d6b29a6ee26bee560',
    isLike: false,
    likeCount: 0,
    tag: '前端框架',
    title: 'react webpack5 项目搭建',
  },
  {
    abstract: '项目部署',
    authorId: '62f8daba89f22210039e4316',
    classify: '架构',
    coverImage: 'http://localhost:9112/fa5f5639aa0df7696a68b8b01.png',
    createTime: 1660580859625,
    id: '62fa74003bdadf8910bf01f6',
    isLike: false,
    likeCount: 1,
    tag: '后端',
    title: '项目部署',
  },
  {
    abstract: '项目部署222',
    authorId: '62f8daba89f22210039e4316',
    classify: '架构',
    coverImage: 'http://localhost:9112/fa5f5639aa0df7696a68b8b01.png',
    createTime: 1660580859625,
    id: '62fa74003bdadf8910bf01128',
    isLike: false,
    likeCount: 1,
    tag: '后端',
    title: '项目部署',
  },
];

const { TabPane } = Tabs;

interface IProps {}

const Author: React.FC<IProps> = () => {
  // const {
  //   userInfoStore: { getUserInfo },
  // } = useStore();

  const onChangeTabs = (key: string) => {
    console.log(key, '-----key');
  };

  return (
    <>
      <div className={styles.AuthorContainer}>
        <div className={styles.headerWrap}>
          <Header needLeft needMenu excludesWidth>
            <div className={styles.headerContent}>
              <div>关于博主</div>
            </div>
          </Header>
        </div>
        <div className={styles.wrap}>
          <div className={styles.infoWrap}>
            <div className={styles.mainCover}>
              <Image
                url={MAIN_COVER}
                transitionImg={MAIN_COVER}
                className={styles.image}
                imageWrapStyle={styles.imageWrapStyle}
              />
            </div>
            <div className={styles.headImg}>
              <Image url={HEAD_UEL} transitionImg={HEAD_UEL} className={styles.image} />
            </div>
            <div className={styles.mainInfo}>dnhyxc</div>
          </div>
          <div className={styles.content}>
            <div className={styles.tabList}>
              <div className={styles.tab}>
                <Tabs defaultActiveKey="1" onChange={onChangeTabs}>
                  {AUTHOR_TABS.map((i) => {
                    return (
                      <TabPane tab={i.name} key={i.value}>
                        <Card
                          list={data}
                          wrapClass={styles.wrapClass}
                          // toDetail={toDetail}
                          // deleteArticle={deleteArticle}
                          // likeArticle={likeArticle}
                          // onEditArticle={onEditArticle}
                          // showInfo={articleList.list.length === articleList.total}
                          showInfo
                        />
                      </TabPane>
                    );
                  })}
                </Tabs>
              </div>
            </div>
            <Affix offsetTop={60}>
              <div className={styles.rightBar}>
                <RightBar />
              </div>
            </Affix>
          </div>
        </div>
      </div>
      <BackTop className={styles.backTopWrap}>
        <div className={styles.backTop}>
          <ArrowUpOutlined className={styles.topIcon} />
        </div>
      </BackTop>
    </>
  );
};

export default Author;
