import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import useStore from '@/store';
import { useLoginStatus } from '@/hooks';
import * as Service from '@/service';
import { normalizeResult, encrypt } from '@/utils';
import MAlert from '@/components/Alert';
import Content from '@/components/Content';
import UploadFile from '@/components/Upload';
import { LoginData } from '@/typings/common';
import styles from './index.less';

interface IProps { }

const { TextArea } = Input;

const Profile: React.FC<IProps> = () => {
  const [filePath, setFilePath] = useState<string>('http://localhost:9112/6f147dff8fabb62e91abdf606.png');

  const [form] = Form.useForm();
  const { userInfoStore } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();

  // 修改用户信息
  const onUpdateUserInfo = async () => {
    const values = await form.validateFields();
    const info = {
      ...values,
      username: encrypt(values.username),
    };
    const res = normalizeResult<LoginData>(
      await Service.updateInfo({
        ...info,
        userId: userInfoStore?.getUserInfo?.userId,
      })
    );
    if (res.success) {
      userInfoStore.setUserInfo({
        ...res.data,
      });
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  };

  return (
    <div className={styles.Profile}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Content
        containerClassName={styles.containerClassName}
        wrapClassName={styles.wrapClassName}
      >
        <div className={styles.header}>
          <div className={styles.title}>
            <span>个人资料</span>
            <Button ghost className={styles.changeCover}>
              编辑封面图片
            </Button>
          </div>
          <div className={styles.headerWrap}>
            <UploadFile form={form} filePath={filePath} setFilePath={setFilePath} setAlertStatus={setAlertStatus} imgStyle={styles.uploadImg} markStyle={styles.markStyle} uploadWrapStyle={styles.uploadWrapStyle} needPreview={false} />
            <div className={styles.username}>DNHYXC</div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.formWrap}>
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 13 }}
              layout="horizontal"
              form={form}
              name="form"
            >
              <Form.Item
                label="用户名"
                name="username"
                initialValue={userInfoStore?.getUserInfo?.username}
                rules={[{ required: true, message: '请先输入用户名' }]}
              >
                <Input placeholder="请输入用户名" maxLength={50} />
              </Form.Item>
              <Form.Item
                label="职位"
                name="job"
                initialValue={userInfoStore?.getUserInfo?.job}
                rules={[{ required: true, message: '请先输入职位' }]}
              >
                <Input placeholder="请输入职位" maxLength={50} />
              </Form.Item>
              <Form.Item
                label="座右铭"
                name="motto"
                initialValue={userInfoStore?.getUserInfo?.motto}
                rules={[{ required: true, message: '请先输入座右铭' }]}
              >
                <Input placeholder="请输入座右铭" maxLength={50} />
              </Form.Item>
              <Form.Item
                label="个人介绍"
                name="introduce"
                initialValue={userInfoStore?.getUserInfo?.introduce}
                rules={[{ required: true, message: '请先输入个人介绍' }]}
              >
                <TextArea
                  placeholder="请输入个人介绍"
                  rows={3}
                  autoSize={{ minRows: 4, maxRows: 10 }}
                  maxLength={100}
                  showCount
                />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 6, span: 13 }}>
                <Button type="primary" className={styles.submit} onClick={onUpdateUserInfo}>
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default Profile;
