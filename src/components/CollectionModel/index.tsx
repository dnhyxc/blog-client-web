import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Checkbox, Modal, Button } from 'antd';
import classname from 'classname';
import Content from '@/components/Content';
import MIcons from '@/components/Icons';
import useStore from '@/store';
import { useScrollLoad } from '@/hooks';
import * as Service from '@/service';
import { normalizeResult, error, success, info } from '@/utils';
import { DRAWER_STYLES } from '@/constant';
import { CollectionListRes, AddCollectionRes } from '@/typings/common';
import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: Function;
  getAddVisible: Function;
  getCollectRes?: Function;
  getSelectCollectIds?: Function;
  sendMsg?: Function;
  moveArticleId?: string;
  selectCollectId?: string; // 用于设置收藏集（collection页面）移动收藏集时设置选中当前收藏集
  createCollectId?: string; // 用于设置收藏集（collection页面）移动收藏集时设置选中当前收藏集
  themeMode?: string;
}

const CollectionModal: React.FC<IProps> = ({
  visible,
  onCancel,
  getAddVisible,
  getCollectRes,
  moveArticleId,
  getSelectCollectIds,
  selectCollectId,
  createCollectId,
  themeMode,
  sendMsg,
}) => {
  const [checkedItem, setCheckedItem] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [collectionList, setCollectionList] = useState<CollectionListRes>({
    list: [],
    total: 0,
    count: 0,
  });

  const { id: articleId } = useParams();
  const { pathname } = useLocation();
  const listRef = useRef<AddCollectionRes[]>([]);
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  // scrollRef：用户设置rightbar的吸顶效果，scrollbarRef：scrollbar 滚动到顶部，scrollTop：回到顶部
  const { pageNo, setPageNo, onScroll } = useScrollLoad({
    data: collectionList,
    loading,
    pageSize: 10,
  });

  useEffect(() => {
    if (visible) {
      getCollectionList();
      const selectItems = [];
      if (selectCollectId) {
        selectItems.push(selectCollectId);
      }
      if (createCollectId) {
        selectItems.push(createCollectId);
      }
      setCheckedItem([...selectItems, ...checkedItem]);
    } else {
      setPageNo(1);
      listRef.current = [];
      setCollectionList({
        list: listRef.current,
        total: 0,
        count: 0,
      });
      setCheckedItem([]);
    }
  }, [visible, pageNo, selectCollectId, createCollectId]);

  useEffect(() => {
    getSelectCollectIds && getSelectCollectIds(checkedItem);
  }, [checkedItem]);

  // 获取收藏集列表
  const getCollectionList = async () => {
    if (!getUserInfo?.userId) return;
    setLoading(true);
    const res = normalizeResult<CollectionListRes>(
      await Service.getCollectionList({
        pageNo,
        pageSize: 10,
        userId: getUserInfo?.userId,
      })
    );
    setLoading(false);
    if (res.success) {
      const { total, list } = res.data;
      // 使用ref暂存list，防止滚动加载时，list添加错乱问题
      listRef.current = [...listRef.current, ...list];
      setCollectionList({
        list: listRef.current,
        total,
        count: list.length,
      });
    } else {
      error(res.message);
    }
  };

  // 选择需要加入的收藏夹
  const onCheckedItem = (id: string) => {
    const res = checkedItem.find((i) => i === id);
    if (res) {
      const filter = checkedItem.filter((i) => i !== id);
      setCheckedItem([...filter]);
    } else {
      checkedItem.push(id);
      setCheckedItem([...checkedItem]);
    }
  };

  // 点击创建收藏夹打开新建弹窗，同时关闭当前弹窗
  const onCreate = () => {
    getAddVisible(true);
    onCancel();
  };

  // 收藏文章
  const onSubmit = async () => {
    if (!checkedItem.length) info('请选择一个收藏集');
    if (!getUserInfo?.userId || !articleId || !checkedItem.length) return;
    const res = normalizeResult<string>(
      await Service.collectArticles({
        ids: checkedItem,
        articleId: moveArticleId || articleId,
        userId: getUserInfo?.userId,
        isMove: pathname.includes('/collect'), // 如果是true，说明是从我的收藏集中点的转移按钮进行文章的转移
      })
    );
    if (res.success) {
      onCancel();
      success(res.message);
      if (pathname.includes('/collect')) {
        getCollectRes && getCollectRes(res.data, true);
      } else {
        getCollectRes && getCollectRes(res.data);
      }
      sendMsg && sendMsg('COLLECT');
    } else {
      error(res.message);
    }
  };

  const renderTitle = (
    <div className={classname(styles.title, themeMode === 'dark' && styles.darkTitle)}>
      <span>选择收藏集</span>
      <span className={styles.info}>（创建或选择你想添加的收藏集）</span>
    </div>
  );

  return (
    <Modal
      title={renderTitle}
      width={520}
      visible={visible}
      centered
      wrapClassName={classname(
        styles.wrapClassName,
        themeMode === 'dark' && styles.darkWrapClassName
      )}
      onCancel={() => onCancel()}
      footer={[
        <div key="1" className={styles.actions}>
          <Button type="link" onClick={onCreate}>
            <MIcons name="icon-add" className={styles.addIcon} noStopPropagation />
            <span>新建收藏集</span>
          </Button>
          <div>
            <Button
              key="back"
              type="primary"
              ghost
              className={styles.action}
              onClick={() => onCancel()}
            >
              取消
            </Button>
            <Button
              key="submit"
              type="primary"
              className={styles.action}
              onClick={onSubmit}
            >
              确定
            </Button>
          </div>
        </div>,
      ]}
      bodyStyle={themeMode === 'dark' ? { ...DRAWER_STYLES.bodyStyle } : {}}
    >
      <Content
        className={styles.scrollWrapStyle}
        wrapClassName={styles.contentStyle}
        containerClassName={classname(
          styles.containerClassName,
          themeMode === 'dark' && styles.darkContainerClassName
        )}
        onScroll={onScroll}
        themeMode={themeMode}
      >
        <div className={styles.collectionList}>
          {collectionList?.list.map((i) => {
            return (
              <div key={i.id} className={styles.collectionItem}>
                <div className={styles.desc} onClick={() => onCheckedItem(i.id)}>
                  <div className={styles.collectionName}>
                    <span>{i.name}</span>
                    {i.status === 2 && (
                      <MIcons name="icon-lock-full" className={styles.lockIcon} />
                    )}
                  </div>
                  <div className={styles.collectionCount}>{i.articleIds?.length}篇文章</div>
                </div>
                <Checkbox
                  checked={checkedItem.includes(i.id)}
                  onChange={() => onCheckedItem(i.id)}
                />
              </div>
            );
          })}
          {collectionList?.list.length === collectionList?.total && !loading ? (
            <div className={styles.noMore}>
              {`共(${collectionList?.total})条，没有更多了～～～`}
            </div>
          ) : (
            <div className={styles.noMore}>loading...</div>
          )}
        </div>
      </Content>
    </Modal>
  );
};

export default CollectionModal;
