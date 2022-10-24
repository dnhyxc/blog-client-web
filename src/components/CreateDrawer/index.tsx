import React, { useState, useEffect } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Button, Drawer, Input, Radio } from 'antd';
import MIcons from '@/components/Icons';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, error, success } from '@/utils';
import { AddCollectionRes } from '@/typings/common';
import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: Function;
  collectInfo?: AddCollectionRes | null;
  showCollection?: Function;
  callback?: Function;
  updateCollection?: Function;
  hideCollectModel?: boolean;
  onCheckedItem?: Function; // 获取新建收藏集的id
}

const CreateDrawer: React.FC<IProps> = ({
  visible,
  onCancel,
  showCollection,
  callback,
  collectInfo = null,
  updateCollection,
  hideCollectModel,
  onCheckedItem,
}) => {
  const [collectName, setCollectName] = useState<string>('');
  const [collectDesc, setCollectDesc] = useState<string>('');
  const [status, setStatus] = useState<number>(1);

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  useEffect(() => {
    if (collectInfo?.name && visible) {
      setCollectName(collectInfo?.name);
    }
    if (collectInfo?.desc && visible) {
      setCollectDesc(collectInfo?.desc);
    }
    if (collectInfo?.status && visible) {
      setStatus(collectInfo?.status);
    }
  }, [collectInfo, visible]);

  const onCollectNameChange = (e: any) => {
    setCollectName(e.target.value);
  };

  const onCollectDescChange = (e: any) => {
    setCollectDesc(e.target.value);
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    setStatus(e.target.value);
  };

  // 新建
  const create = async () => {
    const res = normalizeResult<AddCollectionRes>(
      await Service.createCollection({
        name: collectName,
        desc: collectDesc,
        status,
        userId: getUserInfo?.userId,
      })
    );
    if (!res.success) {
      error(res.message);
    } else {
      success(res.message);
      onCancel();
      showCollection && showCollection();
      callback && callback(res.data);
      onCheckedItem && onCheckedItem(res?.data?.id);
    }
  };

  // 清空表单字段
  const clearFormData = () => {
    setCollectName('');
    setCollectDesc('');
    setStatus(1);
  };

  // 更新
  const update = async () => {
    if (!collectInfo?.id) return;
    const res = normalizeResult<{ id: string }>(
      await Service.updateCollection({
        name: collectName,
        desc: collectDesc,
        status,
        userId: getUserInfo?.userId,
        id: collectInfo?.id,
      })
    );
    if (res.success) {
      success(res.message);
      onCancel();
      updateCollection &&
        updateCollection({
          name: collectName,
          desc: collectDesc,
          status,
          id: collectInfo?.id,
        });
    } else {
      error(res.message);
    }
  };

  const onSubmit = () => {
    if (!getUserInfo?.userId) return;

    if (!collectInfo?.id) {
      create();
    } else {
      update();
    }
    // 编辑创建弹窗时，清空表单字段
    clearFormData();
    onCancel && onCancel();
  };

  const onClose = () => {
    // 编辑创建弹窗时，清空表单字段
    clearFormData();
    onCancel();
    // 当从收藏集详情中点击编辑时不打开创建弹窗
    if (!hideCollectModel) {
      showCollection && showCollection();
    }
  };

  const renderTitle = (
    <div className={styles.titleWrap}>
      <div onClick={() => onCancel()}>
        <MIcons name="icon-arrow-left-bold" className={styles.addIcon} noStopPropagation />
      </div>
      <div className={styles.title}>新建收藏集</div>
      <Button
        type="link"
        onClick={onSubmit}
        className={styles.submit}
        disabled={!collectName}
      >
        完成
      </Button>
    </div>
  );

  return (
    <div className={styles.CreateDrawer}>
      <Drawer
        title={renderTitle}
        placement="bottom"
        closable={false}
        onClose={onClose}
        visible={visible}
        height={427}
        headerStyle={{ padding: '10px' }}
        bodyStyle={{ padding: '0 10px' }}
      >
        <div className={styles.createContent}>
          <Input
            className={styles.name}
            placeholder="请输入收藏集名称"
            maxLength={20}
            bordered={false}
            value={collectName}
            onChange={onCollectNameChange}
          />
          <Input.TextArea
            showCount
            autoSize={{ minRows: 2 }}
            maxLength={100}
            className={styles.desc}
            placeholder="请输入收藏集描述"
            bordered={false}
            value={collectDesc}
            onChange={onCollectDescChange}
          />
          <Radio.Group
            className={styles.radioGroup}
            onChange={onRadioChange}
            value={status}
          >
            <Radio value={1} className={styles.radio}>
              <span>公开</span>
              <span className={styles.info}>当其他人关注此收藏集后不可再更改为隐私</span>
            </Radio>
            <Radio value={2}>
              <span>隐私</span>
              <span className={styles.info}>仅自己可见此收藏集</span>
            </Radio>
          </Radio.Group>
        </div>
      </Drawer>
    </div>
  );
};

export default CreateDrawer;
