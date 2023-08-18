/*
 * @Description: 下载客户端
 * @Author: dnh
 * @Date: 2022-08-18 09:19:29
 * @LastEditors: dnh
 * @FilePath: \src\view\download\index.tsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackTop } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import classname from 'classname';
import * as Service from '@/service';
import { normalizeResult } from '@/utils';
import Header from '@/components/Header';
import MIcons from '@/components/Icons';
import Image from '@/components/Image';
import ActionIcon from '@/components/ActionIcon';
import { useGetTheme, useHtmlWidth } from '@/hooks';
import ImagePreview from '@/components/ImagePreview';
import { SSM, PREVIEW_IMGS } from '@/constant';
import { PrevImgPrams } from '@/typings/component';
import styles from './index.less';

interface IProps {}

const DownloadClient: React.FC<IProps> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [prevImgInfo, setPrevImgInfo] = useState<PrevImgPrams>({} as PrevImgPrams);

  const navigate = useNavigate();
  const { themeMode } = useGetTheme();
  const { htmlWidth } = useHtmlWidth();

  useEffect(() => {
    if (htmlWidth <= 960) {
      navigate('/home');
    }
  }, [htmlWidth]);

  const onCancel = () => {
    setVisible(false);
  };

  const onPreview = (item: PrevImgPrams) => {
    setPrevImgInfo(item);
    setVisible(true);
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

  // 高级搜索
  const toSearch = () => {
    navigate('/search');
  };

  // 渲染右侧搜索
  const rightNode = () => (
    <div className={styles.searchWrap}>
      <MIcons name="icon-sousuo2" className={styles.iconWrap} onClick={toSearch} />
    </div>
  );

  return (
    <div className={classname(styles.DownloadClient, themeMode === 'dark' && styles.dark)}>
      <ActionIcon
        noHideMenuIcon
        className={styles.changeIconWrap}
        themeMode={themeMode}
        htmlWidth={htmlWidth}
      />
      <div className={styles.headerWrap}>
        <Header needLeft excludesWidth right={rightNode()} needUser themeMode={themeMode}>
          下载客户端
        </Header>
      </div>
      <ImagePreview visible={visible} onCancel={onCancel} prevImgInfo={prevImgInfo} />
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
      </div>
      <BackTop className={styles.backTopWrap}>
        <div className={styles.backTop}>
          <ArrowUpOutlined className={styles.topIcon} />
        </div>
      </BackTop>
    </div>
  );
};

export default DownloadClient;
