import React, { useState, useEffect, useRef } from 'react';
import { Popover, Button } from 'antd';
import Content from '@/components/Content';
import { useNavigate } from 'react-router-dom';
import { useScrollLoad } from '@/hooks';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, error, formatGapTime } from '@/utils';
import { PAGESIZE } from '@/constant';
import { ArticleListResult, ArticleItem } from '@/typings/common';
import styles from './index.less';

interface IProps {
  // eslint-disable-next-line no-unused-vars
  deleteDraft?: (id?: string, needMessage?: boolean) => void;
}

const DraftPopover: React.FC<IProps> = ({ deleteDraft }) => {
  const [draftList, setDraftList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const listRef = useRef<ArticleItem[]>([]);
  const navigate = useNavigate();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  // scrollRef：用户设置rightbar的吸顶效果，scrollbarRef：scrollbar 滚动到顶部，scrollTop：回到顶部
  const { pageNo, setPageNo, onScroll } = useScrollLoad({
    data: draftList,
    loading,
    pageSize: PAGESIZE,
    scrollStyle: styles.scrollStyle,
  });

  useEffect(() => {
    if (visible) {
      getDraftList();
    }
  }, [pageNo, visible]);

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

  // Popover onVisibleChange 事件
  const onVisibleChange = (visible: boolean) => {
    setVisible(visible);
    setPageNo(1);
    listRef.current = [];
    setDraftList({
      list: listRef.current,
      total: 0,
      count: 0,
    });
  };

  // 编辑
  const onEditDraft = (item: ArticleItem) => {
    navigate(`/create?draftId=${item.id}`);
    setVisible(false);
  };

  // 删除
  const onDelDraft = (item: ArticleItem) => {
    const list = draftList.list.filter((i) => i.id !== item.id);
    setDraftList({
      ...draftList,
      total: draftList.total - 1,
      list,
    });
    deleteDraft && deleteDraft(item.id, true);
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
            <div key={i.id} className={styles.draftItem}>
              <span className={styles.title}>
                {i.title ||
                  `${i.content?.slice(0, 26).replace(/#/g, '')}${
                    i.content && i.content.slice(0, 26).length > 20 ? '...' : ''
                  }`}
              </span>
              <span className={styles.actions}>
                <span className={styles.createTime}>{formatGapTime(i.createTime)}</span>
                <Button
                  className={styles.editBtn}
                  type="link"
                  onClick={() => onEditDraft(i)}
                >
                  编辑
                </Button>
                <Button className={styles.delBtn} type="link" onClick={() => onDelDraft(i)}>
                  删除
                </Button>
              </span>
            </div>
          );
        })}
      </Content>
    </div>
  );

  const title = <div className={styles.modalTitle}>草稿列表</div>;

  return (
    <Popover
      className={styles.draftPop}
      placement="bottomRight"
      title={title}
      content={content}
      trigger="click"
      visible={visible}
      onVisibleChange={onVisibleChange}
    >
      <Button type="link" className={styles.draftBtn}>
        草稿箱
      </Button>
    </Popover>
  );
};

export default DraftPopover;
