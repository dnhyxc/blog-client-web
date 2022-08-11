import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import useStore from '@/store';
import Header from '@/components/Header';
import TuiEditor from '@/components/TuiEditor';
import { useGetArticleDetail } from '@/hooks';
import ReleaseModel from './ReleaseModel';

import styles from './index.less';

interface IProps {}

const CreateArticle: React.FC<IProps> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const { create } = useStore();
  const [search] = useSearchParams();
  const id = search.get('id');
  const { detail } = useGetArticleDetail(id);

  const onGetMackdown = (mackdown: any) => {
    create.createMackdown(mackdown.trim());
  };

  useEffect(() => {
    if (detail?.content) {
      create.createMackdown(detail?.content as string);
    }
  }, [detail]);

  const renderRight = () => {
    return (
      <Button
        type="link"
        className={styles.release}
        disabled={!create?.mackdown}
        onClick={() => setVisible(true)}
      >
        发布文章
      </Button>
    );
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <div className={styles.container}>
      <Header needMenu right={renderRight()}>
        发布文章
      </Header>
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
