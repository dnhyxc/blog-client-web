import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { SSM, PREVIEW_IMGS } from '@/constant';
import { PrevImgPrams } from '@/typings/component';
import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: Function;
  prevImgInfo: PrevImgPrams;
  padding?: string;
  width?: string;
  themeMode?: string;
}

const ImagePreview: React.FC<IProps> = ({
  visible,
  onCancel,
  prevImgInfo,
  padding,
  width,
  themeMode,
}) => {
  const [currentImgInfo, setCurrentImgInfo] = useState<PrevImgPrams>({
    id: '',
    url: '',
    name: '',
  });

  useEffect(() => {
    if (visible) {
      setCurrentImgInfo(prevImgInfo);
    } else {
      setCurrentImgInfo({ id: '', url: '', name: '' });
    }
  }, [prevImgInfo, visible]);

  const onClose = () => {
    onCancel && onCancel();
  };

  const onPrev = () => {
    const findIndex = PREVIEW_IMGS.findIndex((i) => i.id === currentImgInfo.id);
    let current;
    if (findIndex === 0) {
      current = PREVIEW_IMGS.length - 1;
    } else {
      current = findIndex - 1;
    }
    setCurrentImgInfo(PREVIEW_IMGS[current]);
  };

  const onNext = () => {
    const findIndex = PREVIEW_IMGS.findIndex((i) => i.id === currentImgInfo.id);
    let current;
    if (findIndex === PREVIEW_IMGS.length - 1) {
      current = 0;
    } else {
      current = findIndex + 1;
    }
    setCurrentImgInfo(PREVIEW_IMGS[current]);
  };

  return (
    <Modal
      visible={visible}
      width={width || 912}
      title="图片预览"
      onCancel={onClose}
      footer={null}
      bodyStyle={{ padding: padding || '0 0 10px' }}
      centered
      wrapClassName={themeMode === 'dark' && styles.darkWrapClassName}
    >
      <div className={styles.ImagePreview}>
        <span className={styles.prev} onClick={onPrev}>
          <i className="iconfont icon-arrow-left-bold" />
        </span>
        <div className={styles.preview}>
          <img src={currentImgInfo.url || SSM} alt="" className={styles.image} />
        </div>
        <span className={styles.next} onClick={onNext}>
          <i className="iconfont icon-arrow-right-bold" />
        </span>
      </div>
    </Modal>
  );
};

export default ImagePreview;
