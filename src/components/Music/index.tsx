import React, { useEffect, useRef } from 'react';
import classname from 'classname';
import styles from './index.less';

// https://github.com/zoyoy1203/musicPlayer/blob/master/js/index.js

const Audio: React.FC = () => {
  const Audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    Audio.current = new window.Audio(); // 创建Audio对象
  }, []);

  // hover 进度条
  const onHoverProgress = () => {
    console.log('hover进度条');
  };

  // 上一首/下一首
  const onSelectTrack = (count: number) => {
    console.log('上下首', count);
  };

  // 播放
  const onPlay = () => {
    console.log('播放');
  };

  return (
    <div id="player" className={styles.player}>
      {/* 歌曲信息模块 */}
      <div className={styles.playerContent1}>
        {/* 歌曲名 */}
        <div className={styles.musicName} />
        {/* 歌手名 */}
        <div className={styles.artistName} />
        {/* 歌曲时间 */}
        <div className={styles.time}>
          {/* 当前播放的时间 */}
          <div className={styles.currentTime} />
          {/* 歌曲总时长 */}
          <div className={styles.totalTime} />
        </div>
        {/* 进度条 */}
        <div id="s-area" className={styles.sArea} onMouseMove={onHoverProgress}>
          {/* 鼠标移动到进度条上，显示的时间信息 */}
          <div id="ins-time" className={styles.insTime} />
          {/* 鼠标移动到进度条上，进度条变暗部分 */}
          <div id="s-hover" className={styles.sHover} />
          {/* 表示当前歌曲播放进度的蓝色进度条 */}
          <div id="seek-bar" className={styles.seekBar} />
        </div>
      </div>
      {/* 控制模块 */}
      <div id="player-content2" className={styles.playerContent2}>
        {/*  左侧歌曲封面旋转模块  */}
        <div className={styles.musicImgs}>
          {/*  封面图  */}
          <div className={styles.img} />
          {/*  歌曲缓冲时的提示文字  */}
          <div id="buffer-box" className={styles.bufferBox}>
            缓冲…
          </div>
        </div>
        {/* 右侧歌曲操作模块 */}
        <div className={styles.playerControls}>
          {/* 上一首按钮 */}
          <div
            className={classname(styles.btn, 'prev iconfont')}
            onClick={() => onSelectTrack(-1)}
          >
            上
          </div>
          {/* 暂停/播放 按钮 */}
          <div
            className={classname(styles.btn, 'play-pause icon-jiediankaishi iconfont')}
            onClick={onPlay}
          >
            放
          </div>
          {/* 下一首按钮 */}
          <div
            className={classname(styles.btn, 'next iconfont')}
            onClick={() => onSelectTrack(1)}
          >
            下
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audio;
