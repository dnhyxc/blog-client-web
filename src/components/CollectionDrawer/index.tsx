import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Drawer, Checkbox } from 'antd';
import classname from 'classname';
import MIcons from '@/components/Icons';
import Content from '@/components/Content';
import useStore from '@/store';
import { useScrollLoad } from '@/hooks';
import * as Service from '@/service';
import { normalizeResult, error, success, info } from '@/utils';
import { DRAWER_STYLES, PAGESIZE } from '@/constant';
import { CollectionListRes, AddCollectionRes } from '@/typings/common';
import CreateDrawer from '../CreateDrawer';
import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: Function;
  getCollectRes?: Function;
  showCollectionDrawer?: Function;
  getSelectCollectIds?: Function;
  moveArticleId?: string;
  selectCollectId?: string; // 用于设置收藏集（collection页面）移动收藏集时设置选中当前收藏集
  createCollectId?: string; // 用于设置收藏集（collection页面）移动收藏集时打开创建收藏集弹窗新创建的收藏集id
  showCreateDrawer?: Function;
  themeMode?: string;
}

const CollectionDrawer: React.FC<IProps> = ({
  visible,
  onCancel,
  showCollectionDrawer,
  getCollectRes,
  getSelectCollectIds,
  moveArticleId,
  selectCollectId,
  createCollectId,
  showCreateDrawer = null,
  themeMode,
}) => {
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [checkedItem, setCheckedItem] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [collectionList, setCollectionList] = useState<CollectionListRes>({
    list: [],
    total: 0,
    count: 0,
  });

  const { id: articleId } = useParams();
  const listRef = useRef<AddCollectionRes[]>([]);
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  // scrollRef：用户设置rightbar的吸顶效果，scrollbarRef：scrollbar 滚动到顶部，scrollTop：回到顶部
  const { pageNo, setPageNo, onScroll } = useScrollLoad({
    data: collectionList,
    loading,
    pageSize: PAGESIZE,
  });

  useEffect(() => {
    if (visible) {
      getCollectionList();
      const selectItems = [];
      if (createCollectId) {
        selectItems.push(createCollectId);
      }
      if (selectCollectId) {
        selectItems.push(selectCollectId);
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
        pageSize: PAGESIZE,
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

  const showCreate = () => {
    setCreateVisible(true);
    // 显示创建收藏集弹窗
    showCreateDrawer && showCreateDrawer(true);
    onCancel && onCancel();
  };

  const onCloseCreate = (hide: boolean) => {
    setCreateVisible(false);
    if (hide) return;
    showCollectionDrawer && showCollectionDrawer();
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
      })
    );
    if (res.success) {
      onCancel();
      success(res.message);
      getCollectRes && getCollectRes(res.data);
    } else {
      error(res.message);
    }
  };

  const renderTitle = (
    <div className={styles.titleWrap}>
      <div className={classname(styles.title, themeMode === 'dark' && styles.darkTitle)}>
        选择收藏集
      </div>
      <Button type="link" onClick={showCreate} className={styles.submit}>
        <MIcons name="icon-add" className={styles.addIcon} noStopPropagation />
        <span>新建收藏集</span>
      </Button>
    </div>
  );

  return (
    <div className={styles.CollectionDrawer}>
      <Drawer
        title={renderTitle}
        placement="bottom"
        closable={false}
        onClose={() => onCancel()}
        visible={visible}
        height={427}
        footer={[
          <Button
            key="submit"
            type="primary"
            className={styles.selectSubmit}
            onClick={onSubmit}
          >
            确定
          </Button>,
        ]}
        headerStyle={
          themeMode === 'dark'
            ? { ...DRAWER_STYLES.headerStyle, padding: '10px', borderRadius: '0' }
            : { padding: '10px', borderRadius: '0' }
        }
        bodyStyle={
          themeMode === 'dark'
            ? { ...DRAWER_STYLES.bodyStyle, padding: '0 0 10px 0', overflow: 'hidden' }
            : { padding: '0 0 10px 0', overflow: 'hidden' }
        }
        footerStyle={
          themeMode === 'dark'
            ? { ...DRAWER_STYLES.bodyStyle }
            : { padding: '10px', height: '60px' }
        }
        maskStyle={themeMode === 'dark' ? { ...DRAWER_STYLES.maskStyle } : {}}
      >
        <Content
          className={styles.scrollWrapStyle}
          wrapClassName={styles.contentStyle}
          containerClassName={classname(
            styles.containerClassName,
            themeMode === 'dark' && styles.darkContainerClassName
          )}
          themeMode={themeMode}
          onScroll={onScroll}
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
                    <div className={styles.collectionCount}>
                      {i.articleIds?.length}篇文章
                    </div>
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
      </Drawer>
      {/* 如果是collection页面唤起的 CreateDrawer 弹窗，则不使用CollectDrawer中的这个CreateDrawer弹窗，使用collection页面自身的CreateDrawer弹窗 */}
      {!showCreateDrawer && (
        <CreateDrawer
          visible={createVisible}
          onCancel={onCloseCreate}
          onCheckedItem={onCheckedItem}
          themeMode={themeMode}
        />
      )}
    </div>
  );
};

export default CollectionDrawer;
