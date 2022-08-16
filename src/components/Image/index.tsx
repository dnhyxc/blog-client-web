import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import classname from 'classname';
import styles from './index.less';

interface IProps {
  url: string;
  urls?: string[];
  className?: string;
  imageWrapStyle?: string;
  id?: string;
  onClick?: Function;
  transitionImg?: string;
  imageScaleStyle?: string;
}

const Image: React.FC<IProps> = ({
  id,
  url,
  urls = [],
  className,
  imageWrapStyle,
  onClick,
  transitionImg,
  imageScaleStyle,
}) => {
  const [loadUrl, setLoadUrl] = useState<string | undefined>('');
  const [loaded, setLoaded] = useState<boolean>(false);

  const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

  useEffect(() => {
    loadImage();
  }, [url]);

  const loadImage = () => {
    const img = new window.Image();
    if (img.complete) {
      setLoaded(true);
      setLoadUrl(transitionImg);
    }
    img.onload = () => {
      setLoaded(true);
      setLoadUrl(url);
    };
    img.src = url;
  };

  return (
    <div
      className={classname(imageWrapStyle, styles.Image)}
      id={id}
      onClick={() => onClick && onClick()}
    >
      {url ? (
        <img
          id={id}
          src={loaded ? loadUrl : transitionImg}
          alt=""
          className={classname(styles.imageItem, className, imageScaleStyle)}
        />
      ) : (
        <div className={classname(styles.loadingImg, className)}>
          <Spin size="small" indicator={antIcon} />
        </div>
      )}
      {urls.length > 0 &&
        urls?.map((i) => (
          <img id={id} src={i} alt="" className={classname(styles.imageItem, className)} />
        ))}
    </div>
  );
};

export default Image;
