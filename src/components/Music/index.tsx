import React, { useState } from 'react';
import classname from 'classname';
import { BOAT_TO_CHINA_MP3, BOAT_TO_CHINA_LRC } from '@/constant';
import styles from './index.less';

const Music: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const showAudio = () => {
    setVisible(!visible);
  };
  return (
    <div className={styles.music}>
      <span className={styles.switch} onClick={showAudio}>
        开
      </span>
      <audio
        className={classname(styles.audio, visible ? styles.show : styles.hide)}
        src={BOAT_TO_CHINA_MP3}
        autoPlay={false}
        controls={false}
        preload="auto"
      >
        <track default kind="captions" srcLang="en" src={BOAT_TO_CHINA_LRC} />
      </audio>
      <div className={styles.musicControl}>music</div>
    </div>
  );
};

export default Music;
