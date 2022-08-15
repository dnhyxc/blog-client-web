import React, { useState } from 'react';
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
  transitionImg?: string;
}

const Image: React.FC<IProps> = ({
  id,
  url,
  urls = [],
  className,
  onClick,
  transitionImg,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

  const onLoad = (e: any) => {
    setLoaded(true);
  };

  const onError = () => {
    setLoaded(false);
  };

  return (
    <div className={styles.Image} id={id} onClick={() => onClick && onClick()}>
      {url ? (
        <img
          id={id}
          src={loaded ? url : transitionImg}
          alt=""
          className={classname(styles.imageItem, className)}
          onLoad={onLoad}
          onError={onError}
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
