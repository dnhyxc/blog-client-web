import React, { useState, useEffect, useRef } from 'react';
import { Popover, Button } from 'antd';
import Content from '@/components/Content';
import { useScrollLoad } from '@/hooks';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, error, formatGapTime } from '@/utils';
import { PAGESIZE } from '@/constant';
import { ArticleListResult, ArticleItem } from '@/typings/common';
import styles from './index.less';

interface IProps {}

const DraftPopover: React.FC<IProps> = () => {
  const [draftList, setDraftList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const listRef = useRef<ArticleItem[]>([]);
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  // scrollRef：用户设置rightbar的吸顶效果，scrollbarRef：scrollbar 滚动到顶部，scrollTop：回到顶部
  const { pageNo, onScroll } = useScrollLoad({
    data: draftList,
    loading,
    pageSize: PAGESIZE,
    scrollStyle: styles.scrollStyle,
  });

  useEffect(() => {
    getDraftList();
  }, [pageNo]);

  // 获取文章列表
  const getDraftList = async () => {
    setLoading(true);
    const res = normalizeResult<ArticleListResult>(
      await Service.getDraftList({
        pageNo,
        pageSize: PAGESIZE,
        userId: getUserInfo?.userId,
      })
    );
    setLoading(false);
    if (res.success) {
      const { total, list } = res.data;
      // 使用ref暂存list，防止滚动加载时，list添加错乱问题
      listRef.current = [...listRef.current, ...list];
      setDraftList({
        list: listRef.current,
        total,
        count: list.length,
      });
    } else {
      error(res.message);
    }
  };

  const content = (
    <div className={styles.draftContent}>
      <Content
        containerClassName={styles.containerClassName}
        wrapClassName={styles.wrapClassName}
        autoHeight
        autoHeightMax="300px"
        onScroll={onScroll}
      >
        {draftList?.list?.map((i) => {
          return (
            <div className={styles.draftList}>
              <span>{i.title}</span>
              <span>
                <span>{formatGapTime(i.createTime)}</span>
                <span>{i.title}</span>
              </span>
            </div>
          );
        })}
      </Content>
    </div>
  );

  return (
    <Popover
      className={styles.draftPop}
      placement="bottomRight"
      title="草稿列表"
      content={content}
      trigger="click"
    >
      <Button type="link" className={styles.draftBtn}>
        草稿箱
      </Button>
    </Popover>
  );
};

export default DraftPopover;
