import React from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import classname from 'classname';
import type { RcFile, UploadProps } from 'antd/es/upload';
import MIcons from '@/components/Icons';
import { FILETYPE, UPLOADURL } from '@/constant';
import styles from './index.less';

interface IProps {
  filePath: string | undefined;
  form: any;
  showPreview?: (visible: boolean) => void;
  setFilePath?: (url: string) => void;
}

const UploadFile: React.FC<IProps> = ({ filePath, form, showPreview, setFilePath }) => {
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
  };

  // 预览图片
  const onPreview = () => {
    showPreview && showPreview(true);
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
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={onUploadFile}
      >
        {!filePath && <PlusOutlined />}
      </Upload>
      {filePath && (
        <div className={styles.uploadImgWrap}>
          <div className={styles.mark}>
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
          <img className={styles.uploadImg} src={filePath} alt="" />
        </div>
      )}
    </div>
  );
};

export default UploadFile;
