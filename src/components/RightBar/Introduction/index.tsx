import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classname from 'classname';
import { Button } from 'antd';
import { HEAD_UEL, DOMAIN_URL } from '@/constant';
import Image from '@/components/Image';
import * as Service from '@/service';
import { info, normalizeResult } from '@/utils';
import { UserInfoParams } from '@/typings/common';
import styles from './index.less';

interface IProps {
  className?: string;
  showRecommendArticle?: boolean;
  themeMode?: string;
}

const Introduction: React.FC<IProps> = ({ className, showRecommendArticle, themeMode }) => {
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
    if (authorInfo?.github) {
      window.open(authorInfo?.github);
    } else {
      info('还没设置github地址');
    }
  };

  const toJuejin = () => {
    if (authorInfo?.juejin) {
      window.open(authorInfo?.juejin);
    } else {
      info('还没设置掘金地址');
    }
  };

  const toZhihu = () => {
    if (authorInfo?.juejin) {
      window.open(authorInfo?.zhihu);
    } else {
      info('还没设置知乎地址');
    }
  };

  const toBlog = () => {
    if (authorInfo?.juejin) {
      window.open(authorInfo?.blog);
    } else {
      info('还没设置博客地址');
    }
  };

  const toAuthor = () => {
    navigate('/author');
  };

  // const onShowDownloadModal = () => {
  //   setVisible(true);
  // };

  // const onCloseDownLoadModal = () => {
  //   setVisible(false);
  // };

  // // 下载pc包
  // const onDownload = async (system: string) => {
  //   const res = normalizeResult<{ filePath: string }>(await Service.downloadFile(system));
  //   if (res.success) {
  //     const a = document.createElement('a');
  //     a.style.display = 'none';
  //     a.href = res.data.filePath;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   }
  // };

  return authorInfo.userId ? (
    <div
      className={classname(
        styles.introductionWrap,
        className,
        showRecommendArticle && styles.needMarginBottom,
        themeMode === 'dark' && styles.dark
      )}
    >
      <div className={styles.card}>
        <Image
          url={authorInfo?.headUrl || HEAD_UEL}
          transitionImg={HEAD_UEL}
          className={styles.image}
          onClick={toAuthor}
        />
      </div>
      <div className={styles.nameInfo}>
        <div className={styles.name}>{authorInfo?.username}</div>
        {/* contentEditable="true"设置当前元素可编辑。suppressContentEditableWarning解决react报错 */}
        <div
          suppressContentEditableWarning
          contentEditable="true"
          className={styles.desc}
          title={authorInfo?.motto}
        >
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
        <a
          href={`http://${DOMAIN_URL}:8090`}
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          墨客管理后台
        </a>
        <Button className={styles.github} type="primary" onClick={toGithub}>
          GitHub
        </Button>
        <div className={styles.socialList}>
          {authorInfo?.juejin && <span onClick={toJuejin}>掘金</span>}
          {authorInfo?.zhihu && <span onClick={toZhihu}>知乎</span>}
          {authorInfo?.blog && <span onClick={toBlog}>博客</span>}
        </div>
      </div>
      {/* <div className={styles.pcActions} onClick={onShowDownloadModal}>
        下载客户端
        <span className={styles.download} onClick={() => onDownload('windows')}>
          下载 Windows PC 客户端
        </span>
        <span className={styles.download} onClick={() => onDownload('mac')}>
          下载 MacOS PC 客户端
        </span>
      </div> */}
      {/* <DownloadModal visible={visible} onCancel={onCloseDownLoadModal} /> */}
    </div>
  ) : null;
};

export default Introduction;
