/*
 * @Description: 头部组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\Header\index.tsx
 */
import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classname from 'classname';
import { LeftOutlined } from '@ant-design/icons';
import User from '@/components/User';
import useStore from '@/store';
import { useHtmlWidth, useGetSiderVisible } from '@/hooks';
import { PrevImgPrams } from '@/typings/component';
import ImagePreview from '../ImagePreview';
import MIcons from '../Icons';
import HeadMenu from '../HeadMenu';
import DownloadModal from './DownLoadModal';
import styles from './index.less';

interface IProps {
  children?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  needLeft?: boolean;
  excludesWidth?: boolean;
  className?: string;
  itemStyles?: string; // header item 的样式
  iconStyles?: string; // 左侧 icon 的样式
  headerRef?: any;
  needUser?: boolean;
  activeMenuStyle?: string;
  themeMode?: string;
}

const Header: React.FC<IProps> = ({
  children,
  left,
  right,
  needLeft = true,
  excludesWidth = false,
  className,
  headerRef,
  itemStyles,
  iconStyles,
  needUser,
  activeMenuStyle,
  themeMode,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [showPrev, setShowPrev] = useState<boolean>(false);
  const [prevImgInfo, setPrevImgInfo] = useState<PrevImgPrams>({} as PrevImgPrams);
  const navigate = useNavigate();
  const { siderVisible } = useGetSiderVisible();
  const { htmlWidth } = useHtmlWidth();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  const goBack = (e: Event) => {
    e.stopPropagation();
    navigate(-1);
  };

  const goHome = () => {
    navigate('/home');
  };

  const onShowDownloadModal = () => {
    setVisible(true);
  };

  const onCloseDownLoadModal = () => {
    setVisible(false);
  };

  const onShowPrev = (item: PrevImgPrams) => {
    setPrevImgInfo(item);
    setShowPrev(true);
    setVisible(false);
  };

  const onHidePrev = () => {
    setShowPrev(false);
    setVisible(true);
  };

  return (
    <>
      {visible && (
        <DownloadModal
          visible={visible}
          onCancel={onCloseDownLoadModal}
          onShowPrev={onShowPrev}
        />
      )}
      {showPrev && (
        <ImagePreview visible={showPrev} onCancel={onHidePrev} prevImgInfo={prevImgInfo} />
      )}
      <div
        className={classname(
          className,
          styles.herderWrap,
          themeMode === 'dark' && styles.dark
        )}
        ref={headerRef}
      >
        <div className={styles.left}>
          {needLeft &&
            (left || (
              <div className={styles.back} onClick={(e: any) => goBack(e)}>
                <LeftOutlined className={styles.leftIcon} />
                <MIcons
                  name="icon-haidao_"
                  className={classname(styles.iconWrap, iconStyles)}
                  onClick={goHome}
                />
              </div>
            ))}
          <div className={styles.child}>{children}</div>
          {(excludesWidth || siderVisible) && htmlWidth > 960 && (
            <HeadMenu
              itemStyles={itemStyles}
              activeMenuStyle={activeMenuStyle}
              htmlWidth={htmlWidth}
            />
          )}
        </div>
        <div
          className={classname(
            styles.right,
            needUser && styles.clearPadding,
            !getUserInfo?.userId && styles.noLogin
          )}
        >
          {right && <span>{right}</span>}
          <span className={styles.download} onClick={onShowDownloadModal}>
            下载客户端
          </span>
          {needUser && <User themeMode={themeMode} />}
        </div>
      </div>
    </>
  );
};

export default Header;
