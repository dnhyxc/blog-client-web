import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import useStore from '@/store';
import Header from '@/components/Header';
import TuiEditor from '@/components/TuiEditor';
import { useGetArticleDetail, useDebounce } from '@/hooks';
// import * as Server from '@/service';
import { info } from '@/utils';
// import { normalizeResult, info } from '@/utils';
// import { ARTICLE_DRAFT } from '@/constant';
// import { CreateArticleParams, CreateResult } from '@/typings/common';
import ReleaseModel from './ReleaseModel';
import DraftPopover from './DraftPopover';

import styles from './index.less';

interface IProps { }

const CreateArticle: React.FC<IProps> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [draftId] = useState<string>();
  // const [draftId, setDraftId] = useState<string>();

  const {
    create,
    userInfoStore: { getUserInfo },
  } = useStore();
  const [search] = useSearchParams();
  const id = search.get('id');
  const { detail } = useGetArticleDetail(id);

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
  // const articleDraft = async (params: CreateArticleParams, path: string) => {
  //   const res = normalizeResult<CreateResult>(await Server.articleDraft(params, path));
  //   console.log(res, 'res');
  // };

  console.log(content, 'content');

  // 保存草稿
  const onSaveDraft = useDebounce(async () => {
    if (!create.mackdown) {
      info('嘿，醒醒！文章还一个字没写呢...');
      return;
    }

    const params = {
      content: create.mackdown,
      createTime: new Date().valueOf(),
      authorId: getUserInfo?.userId,
      articleId: draftId,
    };
    if (!draftId) delete params.articleId;
    console.log(params, 'params');

    // articleDraft(params, ARTICLE_DRAFT[draftId ? 2 : 1]);
  }, 500, [], true);

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
      <ReleaseModel
        visible={visible}
        onCancel={onCancel}
        initialValue={detail}
        articleId={id}
      />
    </div>
  );
};

export default observer(CreateArticle);
