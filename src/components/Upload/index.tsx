import 'cropperjs/dist/cropper.css';
import React, { ReactNode, useRef, useState } from 'react';
import { Upload, Modal } from 'antd';
import { UploadListType } from 'antd/lib/upload/interface';
import Cropper from 'react-cropper';
import { PlusOutlined } from '@ant-design/icons';
import classname from 'classname';
import type { RcFile } from 'antd/es/upload';
import MIcons from '@/components/Icons';
import MImage from '@/components/Image';
import * as Service from '@/service';
import { normalizeResult, success, error } from '@/utils';
import { FILETYPE } from '@/constant';
import styles from './index.less';

interface IProps {
  formLabel?: string;
  filePath: string | undefined;
  form: any;
  // eslint-disable-next-line no-unused-vars
  setFilePath?: (url: string) => void;
  imgStyle?: string;
  markStyle?: string;
  uploadWrapStyle?: string;
  needPreview?: boolean;
  setAlertStatus?: Function;
  aspectRatio?: number;
  uploadStyle?: string;
  transitionImg?: string;
  uploadNode?: ReactNode;
  listType?: UploadListType;
}

const UploadFile: React.FC<IProps> = ({
  formLabel,
  needPreview = true,
  filePath,
  transitionImg,
  form,
  setFilePath,
  imgStyle,
  markStyle,
  uploadWrapStyle,
  setAlertStatus,
  aspectRatio = 1 / 1,
  uploadStyle,
  uploadNode,
  listType = 'picture-card',
}) => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [cropperUrl, setCropperUrl] = useState<{ url: any; filename: string }>({
    url: '',
    filename: '',
  });

  const cropperRef = useRef<any>(null);

  const beforeUpload = (file: RcFile) => {
    const fileType = file.type;
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!FILETYPE.includes(fileType)) {
      error('请上传 png、jpg、jpeg、gif 格式的图片');
    }
    if (!isLt20M) {
      error('请上传小于20M的图片');
    }

    const reader = new FileReader();
    const image = new Image();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      // onload 事件在图片加载完成后立即执行。
      image.src = reader.result as any;
      image.onload = () => {
        setCropperUrl({
          url: e.target?.result,
          filename: file.name,
        });
        setShowCropper(true);
      };
    };

    return FILETYPE.includes(fileType) && isLt20M;
  };

  const onUpload = () => {
    if (cropperRef.current) {
      cropperRef.current.getCroppedCanvas().toBlob(async (blob: string | Blob) => {
        const formData = new FormData();
        formData.append('file', blob, cropperUrl.filename);
        const res = normalizeResult<{ filePath: string }>(
          await Service.uploadFile(formData)
        );
        setShowCropper(false);
        if (res.success) {
          setFilePath && setFilePath(res?.data?.filePath);
          form.setFieldsValue(
            formLabel
              ? { mainCover: res?.data?.filePath }
              : { coverImage: res?.data?.filePath }
          );
          success(res.message);
        }
        if (!res.success && res.code === 409) {
          setAlertStatus && setAlertStatus(true);
        }
        if (!res.success && res.code !== 409) {
          error(res.message);
        }
      });
    }
  };

  const onCropperInit = (cropper: any) => {
    cropperRef.current = cropper;
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
    <div className={classname(uploadStyle, styles.Upload)}>
      {showCropper && (
        <Modal
          title="请选择剪裁区域"
          className={styles.cropperModalWrap}
          visible={showCropper}
          width={820}
          onCancel={() => setShowCropper(false)}
          onOk={onUpload}
        >
          <Cropper
            src={cropperUrl.url} // 图片路径，即是base64的值，在Upload上传的时候获取到的
            ref={cropperRef}
            onInitialized={onCropperInit}
            preview=".uploadCrop"
            viewMode={1} // 定义cropper的视图模式
            zoomable // 是否允许放大图像
            // movable
            guides={false} // 显示在裁剪框上方的虚线
            background={false} // 是否显示背景的马赛克
            rotatable={false} // 是否旋转
            autoCropArea={1} // 默认值0.8（图片的80%）。--0-1之间的数值，定义自动剪裁区域的大小
            style={{ width: 'auto', height: '100%' }}
            aspectRatio={aspectRatio} // 固定为1:1  可以自己设置比例, 默认情况为自由比例
            cropBoxResizable // 默认true ,是否允许拖动 改变裁剪框大小
            cropBoxMovable // 是否可以拖拽裁剪框 默认true
            dragMode="move" // 拖动模式, 默认crop当鼠标 点击一处时根据这个点重新生成一个 裁剪框，move可以拖动图片，none:图片不能拖动
            center
          />
        </Modal>
      )}
      <Upload
        name="file"
        headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
        listType={listType!}
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={() => { }} // 覆盖upload action默认的上传行为，改为自定义上传
      >
        {uploadNode || (!filePath && <PlusOutlined />)}
      </Upload>
      {!uploadNode && filePath && (
        <div className={classname(uploadWrapStyle, styles.uploadImgWrap)}>
          <div className={classname(markStyle, styles.mark)}>
            {needPreview && (
              <MIcons
                name="icon-browse"
                className={classname(styles.iconWrap, styles.iconLeft)}
                onClick={onPreview}
              />
            )}
            <MIcons
              name="icon-shanchu"
              className={styles.iconWrap}
              onClick={onDeleteFile}
            />
          </div>
          <MImage
            url={filePath}
            transitionImg={transitionImg}
            className={imgStyle}
            imageWrapStyle={styles.imageWrapStyle}
          />
        </div>
      )}
      {needPreview && filePath && (
        <Modal
          visible={previewVisible}
          centered
          closable={false}
          width={600}
          footer={null}
          onCancel={handleCancel}
        >
          <MImage
            url={filePath}
            transitionImg={transitionImg}
            className={styles.imgStyle}
          />
        </Modal>
      )}
    </div>
  );
};

export default UploadFile;
