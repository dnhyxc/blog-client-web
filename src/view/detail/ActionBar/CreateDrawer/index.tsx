import React, { useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Button, Drawer, Input, Radio } from 'antd';
import MIcons from '@/components/Icons';
import styles from './index.less';

interface IProps {
  visible: boolean,
  onCancel: Function
}

const CreateDrawer: React.FC<IProps> = ({ visible, onCancel }) => {
  const [collectName, setCollectName] = useState<string>('');
  const [collectDesc, setCollectDesc] = useState<string>('');
  const [status, setStatus] = useState<number>(1);

  const onCollectNameChange = (e: any) => {
    setCollectName(e.target.value);
  };

  const onCollectDescChange = (e: any) => {
    setCollectDesc(e.target.value);
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    setStatus(e.target.value);
  };

  const onSubmit = () => {
    onCancel && onCancel();
  };

  const renderTitle = (
    <div className={styles.titleWrap}>
      <div onClick={() => onCancel()}>
        <MIcons name="icon-arrow-left-bold" className={styles.addIcon} noStopPropagation />
      </div>
      <div className={styles.title}>新建收藏集</div>
      <Button type="link" onClick={onSubmit} className={styles.submit} disabled={!collectName}>完成</Button>
    </div>
  );

  return (
    <div className={styles.CreateDrawer}>
      <Drawer
        title={renderTitle}
        placement="bottom"
        closable={false}
        onClose={() => onCancel()}
        visible={visible}
        height={432}
        headerStyle={{ padding: '10px' }}
        bodyStyle={{ padding: '0 10px' }}
      >
        <div className={styles.createContent}>
          <Input className={styles.name} placeholder="请输入收藏集名称" bordered={false} value={collectName} onChange={onCollectNameChange} />
          <Input.TextArea autoSize={{ minRows: 2 }} className={styles.desc} placeholder="请输入收藏集描述" bordered={false} value={collectDesc} onChange={onCollectDescChange} />
          <Radio.Group className={styles.radioGroup} onChange={onRadioChange} value={status}>
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
