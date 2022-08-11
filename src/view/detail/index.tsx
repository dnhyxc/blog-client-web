/*
 * @Description: 详情页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\detail\index.tsx
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Affix, BackTop, Spin, Button } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import Preview from '@/components/Preview';
import Header from '@/components/Header';
import Image from '@/components/Image';
import RightBar from '@/components/RightBar';
import Toc from '@/components/ArticleToc';
import Comments from '@/components/Comments';
import { useGetArticleDetail } from '@/hooks';
import useStore from '@/store';
import { formatDate, decrypt } from '@/utils';
import { ArticleDetailParams } from '@/typings/common';
import styles from './index.less';

const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detail } = useGetArticleDetail(id);
  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  // 编辑文章
  const onEditArticle = () => {
    navigate(`/create?id=${id}`);
  };

  const renderCoverImg = (detail: ArticleDetailParams) => {
    return (
      <div className={styles.titleWrap}>
        <div className={styles.title}>{detail?.title}</div>
        <div className={styles.userInfo}>
          <Image url={detail?.coverImage} className={styles.herdImg} id="IMAGE" />
          <div className={styles.createInfo}>
            <div className={styles.username}>
              {(detail?.authorName && decrypt(detail?.authorName)) || detail?.authorName}
            </div>
            <div>
              <span>{formatDate(detail?.createTime)}</span>
              {getUserInfo?.userId === detail?.authorId && (
                <Button type="link" onClick={onEditArticle}>
                  编辑
                </Button>
              )}
            </div>
          </div>
        </div>
        {detail?.coverImage && <Image url={detail?.coverImage} className={styles.image} />}
        <p className={styles.desc}>{detail.abstract}</p>
      </div>
    );
  };

  return (
    <div>
      <div className={styles.detailContainer}>
        <div className={styles.headerWrap}>
          <Header needLeft needMenu excludesWidth>
            <div className={styles.headerContent}>
              <div>文章详情</div>
            </div>
          </Header>
        </div>
        <div className={styles.content}>
          <div className={styles.preview}>
            {detail ? (
              <Preview
                className={styles.previewContent}
                mackdown={detail.content}
                coverImg={renderCoverImg(detail)}
              >
                <div className={styles.tagWrap}>
                  <div className={styles.tagList}>
                    <span className={styles.label}>分类：</span>
                    <div className={styles.tagItemWrap}>
                      <span className={styles.tag}>{detail.classify}</span>
                    </div>
                  </div>
                  <div className={styles.tagList}>
                    <span className={styles.label}>标签：</span>
                    <div className={styles.tagItemWrap}>
                      <span className={styles.tag}>{detail.tag}</span>
                    </div>
                  </div>
                </div>
              </Preview>
            ) : (
              <div className={styles.preview}>
                <Spin className={styles.spin} />
              </div>
            )}
            {detail && (
              <div className={styles.commentList}>
                <Comments authorId={detail.authorId} />
              </div>
            )}
          </div>
          <div className={styles.rightBar}>
            <RightBar />
            {detail && (
              <Affix offsetTop={50}>
                <Toc mackdown={detail.content} />
              </Affix>
            )}
          </div>
        </div>
      </div>
      <BackTop className={styles.backTopWrap}>
        <div className={styles.backTop}>
          <ArrowUpOutlined className={styles.topIcon} />
        </div>
      </BackTop>
    </div>
  );
};

export default ArticleDetail;
