import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, useCookies, encrypt, decrypt } from '@/utils';
import Content from '@/components/Content';
import styles from './index.less';

interface IProps { }

const { TextArea } = Input;

const Profile: React.FC<IProps> = () => {
  const [form] = Form.useForm();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  useEffect(() => {
    getAccountInfo();
  }, []);

  /**
   *  job: String,
  motto: String,
  headUrl: String,
  github: String,
  juejin: String,
  zhihu: String,
  blog: String,
  introduce: String,
   */

  // 获取用户信息
  const getAccountInfo = async () => {
    const res = await Service.getUserInfo({ userId: getUserInfo.userId });
    console.log(res);
  };

  // 修改用户信息
  const onUpdateUserInfo = async () => {
    const values = await form.validateFields();
    const info = {
      ...values,
      username: encrypt(values.username)
    };
    const res = await Service.updateInfo({
      ...info,
      userId: getUserInfo.userId
    });
    console.log(res);
  };

  return (
    <div className={styles.Profile}>
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
            <div className={styles.uploadWrap}>upload</div>
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
                rules={[{ required: true, message: '请先输入用户名' }]}
              >
                <Input placeholder="请输入用户名" maxLength={50} />
              </Form.Item>
              <Form.Item
                label="职位"
                name="job"
                rules={[{ required: true, message: '请先输入职位' }]}
              >
                <Input placeholder="请输入职位" maxLength={50} />
              </Form.Item>
              <Form.Item
                label="座右铭"
                name="motto"
                rules={[{ required: true, message: '请先输入座右铭' }]}
              >
                <Input placeholder="请输入座右铭" maxLength={50} />
              </Form.Item>
              <Form.Item
                label="个人介绍"
                name="introduce"
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
