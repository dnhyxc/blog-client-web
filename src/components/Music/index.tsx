import React, { useEffect, useState, useRef } from 'react';
import { CYWL_URL, MUSIC_PATHS } from '@/constant';
import { useDebounce } from '@/hooks';
import classname from 'classname';
import { player } from './util/play';
import MIcons from '../Icons';
import styles from './index.less';

// https://cloud.tencent.com/developer/article/2098058

const Audio: React.FC = () => {
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [pageLeft, setPageLeft] = useState<number>(0);

  const coverRef = useRef<HTMLImageElement | null>(null);
  const seekBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    MUSIC_PATHS.forEach((i) => {
      player.append(i);
    });

    player.onReady.listen(() => {
      // this.changeCover();
      console.log('onReady');
    });
    player.onChange.listen(() => {
      // this.changeCover();
      console.log('onChange');
    });
    player.onPlay.listen(() => {
      setIsPlay(true);
      console.log(player.position);
    });
    player.onPause.listen(() => {
      setIsPlay(false);
    });
  }, []);

  // 播放
  const onPlay = () => {
    setIsPlay(!isPlay);
    if (isPlay) {
      player.pause();
    } else {
      player.play();
    }
  };

  // 上一首
  const onPlayPrev = () => {
    player.prev();
  };

  // 下一首
  const onPlayNext = () => {
    player.next();
  };

  // 进度条
  const onHoverProgress = useDebounce((e: any) => {
    const pageX = e.pageX - 136;
    setPageLeft(pageX);
  }, 100);

  // 设置播放位置
  const setPosition = () => {
    player.position = pageLeft;
    seekBarRef.current!.style.width = `${pageLeft}px`;
  };

  return (
    <div id="player" className={styles.player}>
      {/* 歌曲信息模块 */}
      <div className={styles.playerContent1}>
        <div className={styles.nameInfo}>
          {/* 歌曲名 */}
          <div className={styles.musicName}>on a slow boat to china</div>
          {/* 歌手名 */}
          <div className={styles.artistName}>dnhyxc</div>
        </div>
        {/* 进度条 */}
        <div
          id="s-area"
          className={styles.sArea}
          onClick={setPosition}
          onMouseMove={onHoverProgress}
        >
          {/* 鼠标移动到进度条上，显示的时间信息 */}
          <div id="ins-time" className={styles.insTime} />
          {/* 鼠标移动到进度条上，进度条变暗部分 */}
          <div id="s-hover" className={styles.sHover} />
          {/* 表示当前歌曲播放进度的蓝色进度条 */}
          <div id="seek-bar" className={styles.seekBar} ref={seekBarRef} />
        </div>
        {/* 歌曲时间 */}
        <div className={styles.time}>
          {/* 当前播放的时间 */}
          <div className={styles.currentTime}>{player.position}</div>
          {/* 歌曲总时长 */}
          <div className={styles.totalTime}>{player.duration}</div>
        </div>
      </div>
      {/* 控制模块 */}
      <div id="player-content2" className={styles.playerContent2}>
        {/*  左侧歌曲封面旋转模块  */}
        <div className={styles.musicImgs}>
          {/*  封面图  */}
          <div className={styles.img}>
            <img
              src={CYWL_URL}
              alt=""
              ref={coverRef}
              className={classname(styles.cover, isPlay && styles.coverRotate)}
            />
          </div>
          {/*  歌曲缓冲时的提示文字  */}
          <div id="buffer-box" className={styles.bufferBox}>
            缓冲…
          </div>
        </div>
        {/* 右侧歌曲操作模块 */}
        <div className={styles.playerControls}>
          {/* 上一首按钮 */}
          <div className={classname(styles.btn, styles.prevBtn)}>
            <MIcons
              name="icon-shangyishou"
              className={styles.prev}
              onClick={() => onPlayPrev()}
            />
          </div>
          {/* 暂停/播放 按钮 */}
          <div className={classname(styles.btn)}>
            <MIcons
              name={!isPlay ? 'icon-play-filling' : 'icon-pause-fill'}
              className={styles.play}
              onClick={onPlay}
            />
          </div>
          {/* 下一首按钮 */}
          <div className={classname(styles.btn, styles.nextBtn)}>
            <MIcons
              name="icon-xiayishou"
              className={styles.next}
              onClick={() => onPlayNext()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audio;
