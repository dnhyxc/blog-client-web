import React, { useEffect, useState } from 'react';
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

  return (
    <div className={styles.introductionWrap}>
      <div className={styles.card}>
        <Image url={HEAD_UEL} transitionImg={HEAD_UEL} className={styles.image} />
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
          <span>
            <a href={authorInfo?.juejin} target="_blank" rel="noreferrer">
              掘金
            </a>
          </span>
          <span>
            <a href={authorInfo?.zhihu} target="_blank" rel="noreferrer">
              知乎
            </a>
          </span>
          <span>
            <a href={authorInfo?.blog} target="_blank" rel="noreferrer">
              博客
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
