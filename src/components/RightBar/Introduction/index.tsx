import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HEAD_UEL } from '@/constant';
import { Button } from 'antd';
import Image from '@/components/Image';
import * as Service from '@/service';
import { normalizeResult, decrypt } from '@/utils';
import { UserInfoParams } from '@/typings/common';
import styles from './index.less';

interface IProps {
  className?: string;
}

const Introduction: React.FC<IProps> = () => {
  const [authorInfo, setAuthorInfo] = useState<UserInfoParams>({
    userId: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    onGetPersonalInfo();
  }, []);

  // 获取博主信息
  const onGetPersonalInfo = async () => {
    const res = normalizeResult<UserInfoParams>(
      await Service.getUserInfo({
        auth: 1,
        needTotal: true,
      })
    );
    if (res.success) {
      setAuthorInfo(res.data);
    }
  };

  const toGithub = () => {
    window.open(authorInfo?.github);
  };

  const toJuejin = () => {
    window.open(authorInfo?.juejin);
  };

  const toZhihu = () => {
    window.open(authorInfo?.zhihu);
  };

  const toBlog = () => {
    window.open(authorInfo?.blog);
  };

  const toAuthor = () => {
    navigate('/author');
  };

  return (
    <div className={styles.introductionWrap}>
      <div className={styles.card}>
        <Image
          url={authorInfo?.headUrl || HEAD_UEL}
          transitionImg={HEAD_UEL}
          className={styles.image}
          onClick={toAuthor}
        />
      </div>
      <div className={styles.nameInfo}>
        <div className={styles.name}>
          {authorInfo?.username && decrypt(authorInfo?.username)}
        </div>
        {/* contentEditable="true"设置当前元素可编辑。suppressContentEditableWarning解决react报错 */}
        <div suppressContentEditableWarning contentEditable="true" className={styles.desc}>
          {authorInfo?.motto}
        </div>
      </div>
      <div className={styles.articleInfo}>
        <div className={styles.statistical}>
          共发表
          <span className={styles.articleTotal}>{authorInfo?.articleTotal}</span>
          篇文章
        </div>
      </div>
      <div className={styles.socialWrap}>
        <Button className={styles.github} type="primary" onClick={toGithub}>
          GitHub
        </Button>
        <div className={styles.socialList}>
          {authorInfo?.juejin && <span onClick={toJuejin}>掘金</span>}
          {authorInfo?.zhihu && <span onClick={toZhihu}>知乎</span>}
          {authorInfo?.blog && <span onClick={toBlog}>博客</span>}
        </div>
      </div>
    </div>
  );
};

export default Introduction;
