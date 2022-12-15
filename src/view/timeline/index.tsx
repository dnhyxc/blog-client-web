import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timeline } from 'antd';
import classname from 'classname';
import { ClockCircleOutlined } from '@ant-design/icons';
import Card from '@/components/Card';
import RightBar from '@/components/RightBar';
import Content from '@/components/Content';
import Header from '@/components/Header';
import MAlert from '@/components/MAlert';
import BackTop from '@/components/BackTop';
import MIcons from '@/components/Icons';
import MSkeleton from '@/components/MSkeleton';
import {
  useLoginStatus,
  useLikeArticle,
  useScrollLoad,
  useDeleteTimelineArticle,
  useVerifyToken,
  useGetSiderVisible,
  useHtmlWidth,
  useGetTheme,
} from '@/hooks';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, storage, error } from '@/utils';
import { TimelineResult } from '@/typings/common';
import styles from './index.less';

const TimeLine: React.FC = () => {
  const [timelineList, setTimelineList] = useState<TimelineResult[]>([]);

  // 校验token是否过期
  useVerifyToken();
  const navigate = useNavigate();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { onScroll, scrollRef, scrollTop, scrollbarRef } = useScrollLoad({});
  const { themeMode } = useGetTheme();

  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { siderVisible } = useGetSiderVisible();
  const { htmlWidth } = useHtmlWidth();

  useEffect(() => {
    getTimelineList();
  }, []);

  // 获取时间轴列表
  const getTimelineList = async () => {
    const params = { userId: getUserInfo?.userId };
    // 保存至storage用于根据不同页面进入详情时，针对性的进行上下篇文章的获取（如：分类页面上下篇、标签页面上下篇）
    storage.locSetItem('params', JSON.stringify({ ...params, from: 'timeline' }));
    const res = normalizeResult<TimelineResult[]>(await Service.getTimelineList(params));
    if (res.success) {
      setTimelineList(res.data);
    } else {
      error(res.message);
    }
  };

  // 文章点赞
  const { likeArticle } = useLikeArticle({
    setAlertStatus,
    articleList: timelineList,
    updateList: setTimelineList,
    isTimeLine: true,
  });

  // 删除文章
  const { deleteTimeline } = useDeleteTimelineArticle({
    timelineList,
    setTimelineList,
    setAlertStatus,
  });

  // 编辑文章
  const onEditArticle = (id: string) => {
    navigate(`/create?id=${id}`);
  };

  const toDetail = (id: string, needScroll: boolean): void => {
    if (needScroll) {
      navigate(`/detail/${id}?needScroll=1`);
    } else {
      navigate(`/detail/${id}`);
    }
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
    <div className={styles.TimeLine}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Header right={rightNode()}>时间轴线</Header>
      <Content
        className={styles.contentWrap}
        onScroll={onScroll}
        scrollbarRef={scrollbarRef}
      >
        <div
          className={classname(
            styles.wrap,
            siderVisible && htmlWidth > 960 && styles.changeWidth
          )}
        >
          {timelineList.length > 0 && timelineList[0].articles.length > 0 ? (
            <Timeline className={styles.timelineContent}>
              {timelineList.map((i) => {
                return (
                  <Timeline.Item
                    className={styles.timelineItem}
                    key={i.date}
                    color="green"
                    dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}
                  >
                    <div className={styles.cardList}>
                      <div
                        className={classname(
                          styles.date,
                          themeMode === 'dark' && styles.dark
                        )}
                      >
                        {i.date}
                      </div>
                      {i.articles && i.articles.length > 0 && (
                        <Card
                          list={i.articles}
                          total={i.articles.length}
                          wrapClass={styles.wrapClass}
                          imgWrapStyle={styles.imgWrapStyle}
                          itemClass={styles.itemClass}
                          imgWrapClass={styles.imgWrapClass}
                          cardImgWrapStyle={styles.cardImgWrapStyle}
                          descClass={styles.descClass}
                          deleteArticle={deleteTimeline}
                          onEditArticle={onEditArticle}
                          toDetail={toDetail}
                          skeletonRows={2}
                          skeletonAvatar={styles.skeletonAvatar}
                          likeArticle={likeArticle}
                        />
                      )}
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          ) : (
            <div className={classname(styles.emptyWrap)}>
              <MSkeleton
                rows={htmlWidth > 960 ? 2 : 3}
                terminal={htmlWidth > 960 ? 'web' : 'h5'}
                skeletonWrapStyle={themeMode === 'dark' && styles.darkSkeleton}
                textStyle={themeMode === 'dark' && styles.darkTextStyle}
              />
            </div>
          )}
          {timelineList.length > 0 && (
            <RightBar
              className={styles.rightbar}
              showRecommendArticle={!!timelineList.length}
              scrollRef={scrollRef}
            />
          )}
        </div>
      </Content>
      <BackTop scrollTop={scrollTop} scrollbarRef={scrollbarRef} />
    </div>
  );
};

export default TimeLine;
