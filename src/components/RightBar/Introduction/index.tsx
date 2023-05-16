import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classname from 'classname';
import { Button, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { HEAD_UEL } from '@/constant';
import Image from '@/components/Image';
import * as Service from '@/service';
import { info, normalizeResult, error, success, md5HashName } from '@/utils';
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

  const beforeUpload = async (file: RcFile) => {
    const fileType = file.type;
    const isLt500M = file.size / 1024 / 1024 < 500;
    if (fileType !== 'application/x-zip-compressed') {
      error('只能上传 zip 压缩文件');
    }
    if (!isLt500M) {
      error('请上传小于500M的压缩包');
    }
    if (fileType === 'application/x-zip-compressed' && isLt500M) {
      const fileName = (await md5HashName(file)) as string;
      onUpload(file, 0, fileName);
    }
  };

  // 上传pc包
  const onUpload = async (file: RcFile, index?: number, fileName?: string) => {
    const chunkSize = 1024 * 1024 * 10;
    const findIndex = file?.name?.lastIndexOf('.');
    const ext = file.name.slice(findIndex + 1);

    // 获取当前片的起始字节
    const start = index! * chunkSize;

    console.log(start, 'start');

    if (start > file.size) {
      console.log(start, '上传完毕');
      // 当超出文件大小，停止递归上传
      success('上传完毕', start);
      return;
    }

    const blob = file.slice(start, start + chunkSize);

    // 为每片进行命名
    const blobName = `${fileName}_${index}.${ext}`;
    const blobFile = new File([blob], blobName, { type: file.type });
    const formData = new FormData();
    formData.append('file', blobFile);
    formData.append('filename', blobName);
    const res = normalizeResult<{ filePath: string }>(
      await Service.uploadLargeFile(formData)
    );

    if (res.success) {
      onUpload(file, ++index!);
    }
  };

  // 下载pc包
  const onDownload = () => {
    console.log('上传pc包');
  };

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
      <div className={styles.pcActions}>
        <Upload
          name="file"
          headers={{ Authorization: `Bearer ${sessionStorage.getItem('token')}` }}
          listType="text"
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={() => {}} // 覆盖upload action默认的上传行为，改为自定义上传
        >
          上传 PC 客户端
        </Upload>
        <span className={styles.download} onClick={onDownload}>
          下载 PC 客户端
        </span>
      </div>
    </div>
  ) : null;
};

export default Introduction;
