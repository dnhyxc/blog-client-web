import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Drawer,
  Menu,
  Space,
  Dropdown,
  Button,
  Radio,
  DatePicker,
} from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import UploadFile from '@/components/Upload';
import MAlert from '@/components/Alert';
import useStore from '@/store';
import { useLoginStatus, useHtmlWidth } from '@/hooks';
import * as Server from '@/service';
import { normalizeResult, success, error, info } from '@/utils';
import { ARTICLE_CLASSIFY, ARTICLE_TAG, CARD_URL } from '@/constant';
import { CreateArticleParams, CreateResult } from '@/typings/common';

import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: Function;
  initialValue?: CreateArticleParams;
  articleId?: string | null;
  onSaveDraft?: Function;
  // eslint-disable-next-line no-unused-vars
  deleteDraft?: (id?: string, needMessage?: boolean) => void;
}

const { TextArea } = Input;

const ReleaseModel: React.FC<IProps> = ({
  visible = true,
  articleId,
  initialValue,
  onCancel,
  onSaveDraft,
  deleteDraft
}) => {
  const [filePath, setFilePath] = useState<string>('');
  const [tagValue, setTagValue] = useState<string>();

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {
    create,
    userInfoStore: { getUserInfo },
  } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const { htmlWidth } = useHtmlWidth();

  useEffect(() => {
    if (initialValue?.coverImage) {
      setFilePath(initialValue?.coverImage);
    }
    setTagValue(initialValue?.tag);
  }, [initialValue]);

  const onClose = () => {
    onCancel && onCancel();
  };

  // 调用创建文章的接口
  const createArticle = async (params: CreateArticleParams) => {
    const res = normalizeResult<CreateResult>(await Server.createArticle(params));
    if (res.success) {
      deleteDraft && deleteDraft();
    }
    getResult(res);
  };

  // 调用创建文章的接口
  const updateArticle = async (params: CreateArticleParams) => {
    const res = normalizeResult<CreateResult>(await Server.updateArticle(params));
    getResult(res);
  };

  const getResult = (res: any) => {
    if (res.success) {
      success(res.message);
      navigate('/home');
    }

    if (!res.success && res.code === 409) {
      setAlertStatus(true);
    }

    if (!res.success && res.code !== 409 && res.code !== 401) {
      error(res.message);
    }
  };

  // 提交表单
  const onFinish = async () => {
    if (!create.mackdown) {
      info('嘿，醒醒！文章还一个字没写呢...');
      return;
    }
    const values = await form.validateFields();
    const params = {
      ...values,
      content: create.mackdown,
      createTime: values?.createTime?.valueOf() || new Date().valueOf(),
      authorId: getUserInfo?.userId,
      articleId,
    };
    if (articleId) {
      updateArticle(params);
    } else {
      delete params.articleId;
      createArticle(params);
    }
  };

  // 保存草稿
  const onCreateDraft = async () => {
    const values = await form.validateFields();
    onSaveDraft && onSaveDraft(values);
  };

  // 校验标题是否包含特殊字符
  const checkTitle = (rule: any, value: string) => {
    const titleReg = /([*.?+$^(){}|\\/])/;
    if (value && titleReg.test(value)) {
      // 此处使用callback('标题不能包含特殊字符')控制台会报错
      return Promise.reject('标题不能包含特殊字符');
    }
    // 此处使用callback()控制台会报错
    return Promise.resolve();
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const tagName = ARTICLE_TAG.find((i) => i.key === e.key);
    setTagValue(tagName?.label);
    form.setFieldsValue({ tag: tagName?.label });
  };

  const onChangeTagValue = (e: any) => {
    setTagValue(e.target.value);
  };

  const menu = (
    <Menu onClick={handleMenuClick} items={ARTICLE_TAG} className={styles.tagMenu} />
  );

  return (
    <div className={styles.ReleaseModel}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Drawer
        title="发布文章"
        placement="right"
        width={htmlWidth > 500 ? 500 : 'calc(100vw - 50px)'}
        closable={false}
        onClose={onClose}
        visible={visible}
        extra={
          <div>
            <Button
              type="primary"
              ghost
              className={styles.saveDraft}
              onClick={onCreateDraft}
            >
              保存草稿
            </Button>
            <Button type="primary" onClick={onFinish}>
              发布
            </Button>
          </div>
        }
      >
        <div className={styles.ReleaseModel}>
          <Form
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 22 }}
            layout="horizontal"
            form={form}
            name="form"
          >
            <Form.Item
              label="标题"
              name="title"
              initialValue={initialValue?.title}
              rules={[
                { required: true, message: '请先输入文章标题' },
                {
                  validator: checkTitle,
                },
              ]}
            >
              <Input placeholder="请输入文章标题" maxLength={50} />
            </Form.Item>
            <Form.Item
              label="分类"
              name="classify"
              initialValue={initialValue?.classify}
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Radio.Group buttonStyle="solid">
                {ARTICLE_CLASSIFY.map((i) => {
                  return (
                    <Radio.Button className={styles.tag} key={i} value={i}>
                      {i}
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="标签"
              name="tag"
              initialValue={initialValue?.tag}
              rules={[{ required: true, message: '请输入文章标签' }]}
            >
              <div className={styles.tagList}>
                <Input
                  placeholder="请输入文章标签"
                  value={tagValue}
                  onChange={onChangeTagValue}
                  maxLength={50}
                  className={styles.tagInp}
                />
                <Dropdown overlay={menu} autoFocus>
                  <Button className={styles.tagBtn} type="primary">
                    <Space>
                      选择标签
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
            </Form.Item>
            <Form.Item
              label="时间"
              name="createTime"
              initialValue={moment(initialValue?.createTime)}
            >
              <DatePicker
                className={styles.datePicker}
                format="YYYY/MM/DD HH:mm:ss"
                showTime
              />
            </Form.Item>
            <Form.Item
              label="封面"
              valuePropName="fileList"
              name="coverImage"
              initialValue={initialValue?.coverImage}
            >
              <UploadFile
                filePath={filePath}
                setFilePath={setFilePath}
                uploadStyle={styles.uploadStyle}
                transitionImg={CARD_URL}
                form={form}
                imgStyle={styles.uploadImg}
                setAlertStatus={setAlertStatus}
                aspectRatio={780 / 443}
              />
            </Form.Item>
            <Form.Item
              label="摘要"
              name="abstract"
              initialValue={initialValue?.abstract}
              rules={[{ required: true, message: '请先输入文章摘要' }]}
            >
              <TextArea
                placeholder="请输入文章摘要"
                rows={3}
                autoSize={{ minRows: 3, maxRows: 10 }}
                maxLength={100}
                showCount
              />
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </div>
  );
};

export default ReleaseModel;
