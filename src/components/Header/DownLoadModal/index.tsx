import React from 'react';
import { Modal } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import * as Service from '@/service';
import { normalizeResult } from '@/utils';
import Image from '@/components/Image';
import { SSM, PREVIEW_IMGS } from '@/constant';
import { PrevImgPrams } from '@/typings/component';
import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: Function;
  onShowPrev: Function;
}

const DownloadModal: React.FC<IProps> = ({ visible, onCancel, onShowPrev }) => {
  const onClose = () => {
    onCancel && onCancel();
  };

  const onPreview = (item: PrevImgPrams) => {
    onShowPrev && onShowPrev(item);
  };

  // 下载pc包
  const onDownload = async (system: string) => {
    const res = normalizeResult<{ filePath: string }>(await Service.downloadFile(system));
    if (res.success) {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = res.data.filePath;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Modal
      visible={visible}
      width={1100}
      title="客户端下载"
      onCancel={onClose}
      footer={null}
      centered
      bodyStyle={{ padding: '20px' }}
    >
      <div className={styles.downloadModalContent}>
        <div className={styles.downloadActions}>
          <div className={styles.downLodaBtn} onClick={() => onDownload('windows')}>
            <i className={`${styles.icon} iconfont icon-windows`} />
            Windows 版
          </div>
          <div className={styles.downLodaBtn} onClick={() => onDownload('mac')}>
            <i className={`${styles.icon} iconfont icon-mac`} />
            MacOS 版
          </div>
        </div>
        <div className={styles.downloadInfo}>
          为了提供更好的用户体验和更多的功能，诚挚地邀请您下载客户端。下载后，您将享受到更快速、更稳定的服务。
        </div>
        <div className={styles.previewHeader}>PC 端页面预览</div>
        <Scrollbars
          autoHide
          autoHeight
          autoHeightMax="calc(100vh - 340px)"
          className={styles.scrollbar}
        >
          <div className={styles.preview}>
            {PREVIEW_IMGS.map((i, index) => {
              return (
                <div key={index} className={styles.prevItem} onClick={() => onPreview(i)}>
                  <div className={styles.title}>{i.name}</div>
                  <div className={styles.imageWrap}>
                    <Image
                      url={i.url || SSM}
                      transitionImg={SSM}
                      className={styles.image}
                      imageScaleStyle={styles.imageScaleStyle}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Scrollbars>
      </div>
    </Modal>
  );
};

export default DownloadModal;
