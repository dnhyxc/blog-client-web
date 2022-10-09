/*
 * @Description: 详情页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\detail\index.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Affix, BackTop, Spin, Button, Popover } from 'antd';
import classname from 'classname';
import { ArrowUpOutlined } from '@ant-design/icons';
import Preview from '@/components/Preview';
import Header from '@/components/Header';
import Image from '@/components/Image';
import Footer from '@/components/Footer';
import MIcons from '@/components/Icons';
import { HEAD_UEL, CARD_URL } from '@/constant';
import RightBar from '@/components/RightBar';
import Toc from '@/components/ArticleToc';
import Comments from '@/components/Comments';
import AnotherArticle from '@/components/AnotherArticle';
import Qrcode from '@/components/Qrcode';
import { useGetArticleDetail, useHtmlWidth } from '@/hooks';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { formatGapTime, shareQQ, shareSinaWeiBo } from '@/utils';
import { ArticleDetailParams, CommentParams } from '@/typings/common';
import styles from './index.less';

const ArticleDetail: React.FC = () => {
  const [commentCount, setCommentCount] = useState<number>(0);
  const [likeCount, setLikeCount] = useState<number | undefined>(0);
  const [isLike, setIsLike] = useState<boolean | undefined>(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { detail, loading } = useGetArticleDetail({ id });
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { htmlWidth } = useHtmlWidth();
  const commentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLikeCount(detail?.likeCount);
    setIsLike(detail?.isLike);
  }, [detail]);

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

  // 文章点赞
  const onLikeArticle = async () => {
    if (!id) return;
    const res = normalizeResult<{ id: string; isLike: boolean }>(
      await Service.likeArticle({ id, userId: getUserInfo.userId })
    );
    if (!res.success) return;
    setIsLike(res.data.isLike);
    if (isLike) {
      setLikeCount(likeCount! - 1);
    } else {
      setLikeCount(likeCount! + 1);
    }
  };

  // 获取评论数
  const getCommentLength = (comments: CommentParams[]) => {
    let count = 0;
    comments.forEach((i) => {
      const length: number = i.replyList?.length || 0;
      count += length + 1;
    });
    setCommentCount(count);
  };

  // 编辑文章
  const onEditArticle = () => {
    navigate(`/create?id=${id}`);
  };

  // 去我的主页
  const toSetting = (authorId: string | undefined) => {
    navigate(`/personal?id=${authorId}`);
  };

  // 滚动到评论
  const onScrollToComment = () => {
    if (!commentRef.current) return;
    const { offsetTop } = commentRef.current;
    document.documentElement.scrollTop = offsetTop;
  };

  const shareContent = (
    <div className={styles.shareContent}>
      <Popover
        placement="top"
        trigger="hover"
        getPopupContainer={(triggerNode) => triggerNode as HTMLElement}
        content={<Qrcode />}
        overlayClassName={styles.overlayClassName}
      >
        <div className={styles.wechart}>
          <div>
            <MIcons name="icon-weixin1" className={styles.wechartIcon} />
          </div>
          <span>微信</span>
        </div>
      </Popover>
      <div
        className={styles.weibo}
        onClick={() => shareSinaWeiBo(detail?.title!, detail?.coverImage)}
      >
        <div>
          <MIcons
            name="icon-xinlangweibo"
            className={styles.weiboIcon}
            onClick={() => shareSinaWeiBo(detail?.title!, detail?.coverImage)}
          />
        </div>
        <span>新浪微博</span>
      </div>
      <div
        className={styles.shareQZon}
        onClick={() => shareQQ(detail?.title!, detail?.coverImage)}
      >
        <div>
          <MIcons
            name="icon-qq"
            className={styles.qqIcon}
            onClick={() => shareQQ(detail?.title!, detail?.coverImage)}
          />
        </div>
        <span>QQ</span>
      </div>
    </div>
  );

  const renderCoverImg = (detail: ArticleDetailParams) => {
    return (
      <div className={styles.titleWrap}>
        <div className={styles.title}>{detail?.title}</div>
        <div className={styles.userInfo}>
          <Image
            url={detail?.headUrl || HEAD_UEL}
            transitionImg={HEAD_UEL}
            className={styles.herdImg}
            onClick={() => toSetting(detail?.authorId)}
          />
          <div className={styles.createInfo}>
            <div className={styles.username}>{detail?.authorName}</div>
            <div>
              <span>{formatGapTime(detail?.createTime)}</span>
              {getUserInfo?.userId === detail?.authorId && (
                <Button type="link" onClick={onEditArticle}>
                  编辑
                </Button>
              )}
            </div>
          </div>
        </div>
        {detail?.coverImage && (
          <Image
            url={detail?.coverImage || CARD_URL}
            transitionImg={CARD_URL}
            className={styles.image}
          />
        )}
        <p className={styles.desc}>{detail.abstract}</p>
      </div>
    );
  };

  return (
    <Spin spinning={loading} className={styles.spinWrap} tip="正在卖力加载中...">
      <div
        className={classname(
          styles.detailContainer,
          detail?.content.includes('#') && styles.hanToc
        )}
      >
        <div className={styles.headerWrap}>
          <Header needLeft excludesWidth right={rightNode()}>
            <div className={styles.headerContent}>文章详情</div>
          </Header>
        </div>
        {detail && (
          <div className={styles.content}>
            <div className={styles.preview}>
              <div className={styles.multibar}>
                <div className={styles.actionBtn}>
                  <MIcons
                    name="icon-24gf-thumbsUp2"
                    className={styles.actionIcon}
                    onClick={onLikeArticle}
                    customStyle
                  />
                  <span className={styles.likeCount}>{likeCount}</span>
                </div>
                <div className={styles.actionBtn}>
                  <MIcons
                    name="icon-pinglun1"
                    className={styles.commentIcon}
                    onClick={onScrollToComment}
                    customStyle
                  />
                  <span className={styles.likeCount}>
                    {commentCount > 999 ? (
                      <span title={(commentCount && JSON.stringify(commentCount)) || ''}>
                        999+
                      </span>
                    ) : (
                      commentCount
                    )}
                  </span>
                </div>
                <Popover
                  placement="rightTop"
                  trigger="hover"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                  content={shareContent}
                  overlayClassName={styles.shareOverlayClassName}
                >
                  <div className={styles.actionBtn}>
                    <MIcons
                      name="icon-tiaoguofenxiang"
                      className={styles.shareIcon}
                      customStyle
                    />
                  </div>
                </Popover>
              </div>
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
              <div className={styles.anotherArticle}>
                <AnotherArticle id={id} />
              </div>
              <div ref={commentRef}>
                <Comments authorId={detail.authorId} getCommentLength={getCommentLength} />
              </div>
            </div>
            <div className={styles.rightBar}>
              <RightBar />
              <Affix offsetTop={50}>
                <Toc mackdown={detail.content} />
              </Affix>
            </div>
          </div>
        )}
        {htmlWidth <= 960 && <Footer />}
      </div>
      {htmlWidth > 960 && (
        <BackTop className={styles.backTopWrap}>
          <div className={styles.backTop}>
            <ArrowUpOutlined className={styles.topIcon} />
          </div>
        </BackTop>
      )}
    </Spin>
  );
};

export default ArticleDetail;
