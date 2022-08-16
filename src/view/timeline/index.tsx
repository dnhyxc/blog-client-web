import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timeline, message } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import Card from '@/components/Card';
import RightBar from '@/components/RightBar';
import Content from '@/components/Content';
import Header from '@/components/Header';
import MAlert from '@/components/Alert';
import Empty from '@/components/Empty';
import { useLoginStatus, useLikeArticle } from '@/hooks';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { TimelineResult } from '@/typings/common';
import styles from './index.less';

interface IProps {}

const TimeLine: React.FC<IProps> = () => {
  const [timelineList, setTimelineList] = useState<TimelineResult[]>([]);
  const navigate = useNavigate();

  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  useEffect(() => {
    getTimelineList();
  }, []);

  // 获取时间轴列表
  const getTimelineList = async () => {
    const res = normalizeResult<TimelineResult[]>(
      await Service.getTimelineList({ userId: getUserInfo?.userId })
    );
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
      <Header needMenu>时间轴</Header>
      <Content className={styles.contentWrap}>
        <div className={styles.wrap}>
          {timelineList.length > 0 ? (
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
            <div className={styles.emptyWrap}>
              <Empty />
            </div>
          )}
          <RightBar className={styles.rightbar} />
        </div>
      </Content>
    </div>
  );
};

export default TimeLine;
