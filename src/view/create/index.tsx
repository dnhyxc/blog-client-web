import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import useStore from '@/store';
import Header from '@/components/Header';
import TuiEditor from '@/components/TuiEditor';
import { useGetArticleDetail, useDebounce } from '@/hooks';
import * as Server from '@/service';
import { normalizeResult, info, success, error } from '@/utils';
import { ARTICLE_DRAFT } from '@/constant';
import {
  CreateArticleParams,
  CreateDraftParams,
  CreateDraftParamsResult,
} from '@/typings/common';
import ReleaseModel from './ReleaseModel';
import DraftPopover from './DraftPopover';

import styles from './index.less';

interface IProps {}

const CreateArticle: React.FC<IProps> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [draftArticleId, setDraftArticleId] = useState<string>('');

  const {
    create,
    userInfoStore: { getUserInfo },
  } = useStore();
  const [search] = useSearchParams();
  const id = search.get('id');
  const draftId = search.get('draftId');
  const { detail } = useGetArticleDetail(id, draftId);

  const onGetMackdown = (mackdown: any) => {
    setContent(mackdown.trim());
    create.createMackdown(mackdown.trim());
  };

  useEffect(() => {
    if (detail?.content) {
      create.createMackdown(detail?.content as string);
    }
  }, [detail]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [content]);

  // 监听是否是ctrl+enter组合键
  const onKeyDown = (event: any) => {
    if (event.ctrlKey && event.keyCode === 13) {
      onSaveDraft();
    }
  };

  // 文章草稿的创建及更新接口
  const articleDraft = async (params: CreateArticleParams, path: string) => {
    const res = normalizeResult<CreateDraftParamsResult>(
      await Server.articleDraft(params, path)
    );
    if (res.message) {
      const { id } = res.data;
      setDraftArticleId(id);
      success(res.message);
    } else {
      error(res.message);
    }
  };

  // 保存草稿
  const onSaveDraft = useDebounce(
    async (values: CreateArticleParams) => {
      if (!create.mackdown) {
        info('嘿，醒醒！文章还一个字没写呢...');
        return;
      }

      const params: CreateDraftParams = {
        ...values,
        content: create.mackdown,
        createTime: values?.createTime?.valueOf() || new Date().valueOf(),
        authorId: getUserInfo?.userId,
        articleId: draftArticleId,
      };

      if (!draftArticleId) delete params.articleId;
      articleDraft(params, ARTICLE_DRAFT[draftArticleId ? 2 : 1]);
    },
    500,
    [],
    true
  );

  const renderRight = () => {
    return (
      <span>
        <Button
          type="link"
          className={styles.release}
          disabled={!create?.mackdown}
          onClick={() => setVisible(true)}
        >
          发布文章
        </Button>
        <DraftPopover />
      </span>
    );
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <div className={styles.container}>
      <Header right={renderRight()}>发布文章</Header>
      <div className={styles.tuiEditorWrap}>
        <TuiEditor onGetMackdown={onGetMackdown} initialValue={detail?.content} />
      </div>
      {visible && (
        <ReleaseModel
          visible={visible}
          onCancel={onCancel}
          initialValue={detail}
          articleId={id}
          draftId={draftId}
          onSaveDraft={onSaveDraft}
        />
      )}
    </div>
  );
};

export default observer(CreateArticle);
