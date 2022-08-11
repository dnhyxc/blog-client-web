import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import classname from 'classname';
import styles from './index.less';

interface IProps {
  url: string;
  urls?: string[];
  className?: string;
  id?: string;
  onClick?: Function;
}

const Image: React.FC<IProps> = ({ id, url, urls = [], className, onClick }) => {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    if (urls.length) {
      urls.forEach((src: string) => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => {
          images.push(img);
          setImages([...images]);
        };
      });
    } else {
      const img = new window.Image();
      img.src = url;
      img.onload = () => {
        images.push(img);
        setImages([...images]);
      };
    }
  }, []);

  const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

  return (
    <div className={styles.Image} id={id} onClick={() => onClick && onClick()}>
      {urls.length > 0 &&
        images.length === urls.length &&
        urls.map((i) => (
          <img id={id} src={i} alt="" className={classname(styles.imageItem, className)} />
        ))}
      {!urls.length && images.length > 0 && (
        <img id={id} src={url} alt="" className={classname(styles.imageItem, className)} />
      )}
      {!images.length && (
        <div className={classname(styles.loadingImg, className)}>
          <Spin size="small" indicator={antIcon} />
        </div>
      )}
    </div>
  );
};

export default Image;
