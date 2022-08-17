import React from 'react';
import { Affix, BackTop } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import Header from '@/components/Header';
import Image from '@/components/Image';
import { HEAD_UEL, MAIN_COVER } from '@/constant';
import RightBar from '@/components/RightBar';
// import useStore from '@/store';
import styles from './index.less';

interface IProps {}

const Author: React.FC<IProps> = () => {
  // const {
  //   userInfoStore: { getUserInfo },
  // } = useStore();

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
            <div className={styles.tabList}>tabs</div>
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
