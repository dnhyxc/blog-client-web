import React, { useState } from 'react';
import { Upload, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import classname from 'classname';
import type { RcFile, UploadProps } from 'antd/es/upload';
import MIcons from '@/components/Icons';
import { FILETYPE, UPLOADURL } from '@/constant';
import styles from './index.less';

interface IProps {
  filePath: string | undefined;
  form: any;
  setFilePath?: (url: string) => void;
  imgStyle?: string
  markStyle?: string
  uploadWrapStyle?: string
  needPreview?: boolean
  setAlertStatus?: Function
}

const UploadFile: React.FC<IProps> = ({ needPreview = true, filePath, form, setFilePath, imgStyle, markStyle, uploadWrapStyle, setAlertStatus }) => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);

  const beforeUpload = (file: RcFile) => {
    const fileType = file.type;
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!FILETYPE.includes(fileType)) {
      message.error('请上传 png、jpg、jpeg、gif 格式的图片');
    }
    if (!isLt20M) {
      message.error('请上传小于20M的图片');
    }
    return FILETYPE.includes(fileType) && isLt20M;
  };

  const onUploadFile: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'done') {
      const path = file.response.data.filePath;
      // 获取filePath
      setFilePath && setFilePath(path);
      form.setFieldsValue({ coverImage: path });
      message.success(file.response.message);
    }
    if (file.status === 'error') {
      setAlertStatus && setAlertStatus(true);
    }
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  // 预览图片
  const onPreview = () => {
    setPreviewVisible(true);
  };

  // 删除图片
  const onDeleteFile = () => {
    setFilePath && setFilePath('');
  };

  return (
    <div className={styles.Upload}>
      <Upload
        name="file"
        action={UPLOADURL}
        headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={onUploadFile}
      >
        {!filePath && <PlusOutlined />}
      </Upload>
      {
        filePath && (
          <div className={classname(uploadWrapStyle, styles.uploadImgWrap)}>
            <div className={classname(markStyle, styles.mark)}>
              <MIcons
                name="icon-browse"
                className={classname(styles.iconWrap, styles.iconLeft)}
                onClick={onPreview}
              />
              <MIcons
                name="icon-shanchu"
                className={styles.iconWrap}
                onClick={onDeleteFile}
              />
            </div>
            <img className={imgStyle} src={filePath} alt="" />
          </div>
        )
      }
      <Modal
        visible={previewVisible}
        centered
        closable={false}
        width={600}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="" style={{ width: '100%' }} src={filePath} />
      </Modal>
    </div>
  );
};

export default UploadFile;
