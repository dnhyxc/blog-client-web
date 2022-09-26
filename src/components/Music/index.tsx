import React, { useEffect, useState, useRef } from 'react';
import { CYWL_URL, MUSIC_PATHS } from '@/constant';
import classname from 'classname';
import { formatTime } from '@/utils';
// import { formatTime, formatName } from '@/utils';
import { AudioInfo } from '@/typings/component';
import { player } from './util/play';
import MIcons from '../Icons';
import styles from './index.less';

// https://cloud.tencent.com/developer/article/2098058

const Audio: React.FC = () => {
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [pageLeft, setPageLeft] = useState<number>(0);
  const [curPosition, setCurPosition] = useState<number>(0);
  const [audioInfo, setAudioInfo] = useState<AudioInfo>({
    position: 0,
    duration: 0.001,
    progress: ''
  });

  const coverRef = useRef<HTMLImageElement | null>(null);
  const seekBarRef = useRef<HTMLDivElement | null>(null);
  const hoverBarRef = useRef<HTMLDivElement | null>(null);
  const insTimeRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number>(0);

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
    });

    player.onPause.listen(() => {
      setIsPlay(false);
    });
  }, []);

  useEffect(() => {
    if (isPlay) {
      draw();
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlay]);

  const draw = () => {
    animationRef.current = requestAnimationFrame(draw);
    const time = player.position / player.duration;
    const progress = `${(time * 100).toFixed(2)}%`;
    const { position } = player;
    const { duration } = player;
    setAudioInfo({
      progress,
      position,
      duration,
    });
  };

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

  // 计算鼠标位于左侧的距离
  const onHoverProgress = (e: any) => {
    // 减去135是因为鼠标hover的元素本身向左偏移了135
    const pageX = e.pageX - 135;
    setPageLeft(pageX);
    // 设置insTime的偏移量
    insTimeRef.current!.style.left = `${pageX - 18}px`;
    // 计算当前位置的比例
    const currentPercentage = pageLeft / 140;
    // 计算position
    const currentPosition = player.duration * currentPercentage;
    setCurPosition(currentPosition);
    // 计算progress
    const progress = `${(currentPercentage * 100).toFixed(2)}%`;
    // 设置进度条的宽度
    hoverBarRef.current!.style.width = progress;
  };

  // 设置播放位置
  const setPosition = () => {
    // 计算当前位置的比例
    const currentPercentage = pageLeft / 140;
    // 计算position
    const currentPosition = player.duration * currentPercentage;
    // 设置当前position
    player.position = currentPosition;
    // 计算progress
    const progress = `${(currentPercentage * 100).toFixed(2)}%`;
    // 设置进度条的宽度
    seekBarRef.current!.style.width = progress;
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
          <div className={styles.insTime} ref={insTimeRef}>{formatTime(curPosition)}</div>
          {/* 鼠标移动到进度条上，进度条变暗部分 */}
          <div className={styles.sHover} ref={hoverBarRef} />
          {/* 表示当前歌曲播放进度的蓝色进度条 */}
          <div className={styles.seekBar} ref={seekBarRef} style={{ width: audioInfo.progress }} />
        </div>
        {/* 歌曲时间 */}
        <div className={styles.time}>
          {/* 当前播放的时间 */}
          <div className={styles.currentTime}>{formatTime(audioInfo.position)}</div>
          {/* 歌曲总时长 */}
          <div className={styles.totalTime}>{formatTime(audioInfo.duration)}</div>
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
