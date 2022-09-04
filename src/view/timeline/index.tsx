import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timeline, message } from 'antd';
import classname from 'classname';
import { ClockCircleOutlined } from '@ant-design/icons';
import Card from '@/components/Card';
import RightBar from '@/components/RightBar';
import Content from '@/components/Content';
import Header from '@/components/Header';
import MAlert from '@/components/Alert';
import Empty from '@/components/Empty';
import BackTop from '@/components/BackTop';
import { useLoginStatus, useLikeArticle, useScrollLoad, useDeleteTimelineArticle } from '@/hooks';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, storage } from '@/utils';
import { TimelineResult } from '@/typings/common';
import styles from './index.less';

const TimeLine: React.FC = () => {
  const [timelineList, setTimelineList] = useState<TimelineResult[]>([]);
  const navigate = useNavigate();

  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { onScroll, scrollRef, scrollTop, scrollbarRef } = useScrollLoad({
    scrollStyle: styles.scrollStyle,
  });

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  useEffect(() => {
    getTimelineList();
  }, []);

  // 获取时间轴列表
  const getTimelineList = async () => {
    const params = { userId: getUserInfo?.userId };
    storage.locSetItem('params', JSON.stringify({ ...params, from: 'timeline' }));
    const res = normalizeResult<TimelineResult[]>(await Service.getTimelineList(params));
    if (res.success) {
      setTimelineList(res.data);
    } else {
      message.error(res.message);
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

  return (
    <div className={styles.TimeLine}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Header>时间轴</Header>
      <Content className={styles.contentWrap} onScroll={onScroll} scrollbarRef={scrollbarRef}>
        <div className={styles.wrap}>
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
                      <div className={styles.date}>{i.date}</div>
                      {i.articles && i.articles.length > 0 && (
                        <Card
                          list={i.articles}
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
            <div
              className={classname(
                styles.emptyWrap,
                timelineList.length > 0 && styles.hasTimeList
              )}
            >
              <Empty />
            </div>
          )}
          {timelineList.length > 0 && <RightBar
            className={styles.rightbar}
            showRecommendArticle={!!timelineList.length}
            scrollRef={scrollRef}
          />}
        </div>
      </Content>
      <BackTop scrollTop={scrollTop} scrollbarRef={scrollbarRef} />
    </div>
  );
};

export default TimeLine;
