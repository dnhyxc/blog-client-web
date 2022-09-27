import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Menu, Slider } from 'antd';
import classname from 'classname';
import { CYWL_URL, MUSIC_PATHS } from '@/constant';
import { formatTime } from '@/utils';
// import { formatTime, formatName } from '@/utils';
import { AudioInfo } from '@/typings/component';
import { player } from './util/play';
import MIcons from '../Icons';
import styles from './index.less';

// https://cloud.tencent.com/developer/article/2098058

const Audio: React.FC = () => {
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [pageLeft] = useState<number>(0);
  // const [pageLeft, setPageLeft] = useState<number>(0);
  const [curPosition, setCurPosition] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [audioInfo, setAudioInfo] = useState<AudioInfo>({
    position: 0,
    duration: 0.001,
    progress: '',
  });

  const coverRef = useRef<HTMLImageElement | null>(null);
  // const seekBarRef = useRef<HTMLDivElement | null>(null);
  // const hoverBarRef = useRef<HTMLDivElement | null>(null);
  const insTimeRef = useRef<HTMLDivElement | null>(null);
  const musicInfoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    MUSIC_PATHS.forEach((i) => {
      player.append(i);
    });

    player.onReady.listen(() => {
      // this.changeCover();
      setIsReady(true);
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

    player.onVolume.listen(() => {
      console.log('set volume');
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

  useEffect(() => {
    player.volume(volume / 100);
  }, [volume]);

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
    setCurPosition((position / duration) * 100);
  };

  // 播放
  const onPlay = () => {
    if (!isReady) return;
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

  // 设置时间
  const onChangePosition = (value: number) => {
    setCurPosition(value);
  };

  const onPositionAfterChange = (value: number) => {
    console.log(value, 'onPositionAfterChange');
    setCurPosition(value);
    // 计算position
    const currentPosition = player.duration * (value / 100);
    console.log(currentPosition, 'currentPosition');
    // 设置当前position
    player.position = currentPosition;
  };

  // 计算鼠标位于左侧的距离
  // const onHoverProgress = (e: any) => {
  //   const musicInfoOffsetleft = musicInfoRef.current?.offsetLeft || 0;
  //   const playerOffsetleft = playerRef.current?.offsetLeft || 0;
  //   // 115 为progress元素的marginLeft
  //   const offsetLeftSum = musicInfoOffsetleft + playerOffsetleft + 115;
  //   const position = e.pageX - offsetLeftSum || 0;
  //   setPageLeft(position);
  //   // 设置insTime的偏移量
  //   insTimeRef.current!.style.left = `${position - 18}px`;
  //   // 计算当前位置的比例，145为progress元素的总长度
  //   const currentPercentage = pageLeft / 145;
  //   // 计算position
  //   const currentPosition = player.duration * currentPercentage;
  //   setCurPosition(currentPosition);
  //   // 计算progress
  //   const progress = `${(currentPercentage * 100).toFixed(2)}%`;
  //   // 设置进度条的宽度
  //   hoverBarRef.current!.style.width = progress;
  // };

  // 设置播放位置
  const setPosition = () => {
    // 计算当前位置的比例，145为progress元素的总长度
    const currentPercentage = pageLeft / 145;
    // 计算position
    const currentPosition = player.duration * currentPercentage;
    // 设置当前position
    player.position = currentPosition;
    // 计算progress
    // const progress = `${(currentPercentage * 100).toFixed(2)}%`;
    // 设置进度条的宽度
    // seekBarRef.current!.style.width = progress;
  };

  const style: React.CSSProperties = {
    display: 'inline-block',
    height: 300,
  };

  const onSliderChange = (value: number) => {
    console.log(value, 'sssss');
    setVolume(value);
  };

  // 音量气泡框
  const volumeContent = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <div className={styles.volume}>
              <div style={style}>
                <Slider vertical onChange={onSliderChange} defaultValue={50} />
              </div>
              <div className={styles.count}>{volume}%</div>
            </div>
          ),
        },
      ]}
    />
  );

  return (
    <div id="player" className={styles.player} ref={playerRef}>
      <div className={styles.musicInfo} ref={musicInfoRef}>
        <div className={styles.nameInfo}>
          <div className={styles.musicName}>on a slow boat to china</div>
          <div className={styles.artistName}>dnhyxc</div>
        </div>
        <div
          id="s-area"
          className={styles.sArea}
          onClick={setPosition}
          // onMouseMove={onHoverProgress}
        >
          <div className={styles.insTime} ref={insTimeRef}>
            {formatTime(curPosition)}
          </div>
          {/* <div className={styles.sHover} ref={hoverBarRef} />
          <div
            className={styles.seekBar}
            ref={seekBarRef}
            style={{ width: audioInfo.progress }}
          /> */}
          <Slider
            className={styles.timeSlider}
            value={curPosition}
            onChange={onChangePosition}
            onAfterChange={onPositionAfterChange}
          />
        </div>
        <div className={styles.time}>
          <div className={styles.currentTime}>{formatTime(audioInfo.position)}</div>
          <div className={styles.totalTime}>{formatTime(audioInfo.duration)}</div>
        </div>
      </div>
      <div className={styles.playerContent}>
        <div className={styles.musicImgs}>
          <div className={styles.img}>
            <img
              src={CYWL_URL}
              alt=""
              ref={coverRef}
              className={classname(styles.cover, isPlay && styles.coverRotate)}
            />
          </div>
          {!isReady && <div className={styles.bufferBox}>缓冲中...</div>}
        </div>
        <div className={styles.playerControls}>
          <div className={classname(styles.btn)}>
            <MIcons
              name="icon-24gl-repeat2"
              className={styles.controlBtn}
              onClick={() => onPlayNext()}
            />
          </div>
          <div className={classname(styles.btn, styles.prevBtn)}>
            <MIcons
              name="icon-shangyishou"
              className={styles.prev}
              onClick={() => onPlayPrev()}
            />
          </div>
          <div className={classname(styles.btn)}>
            <MIcons
              name={!isPlay ? 'icon-play-filling' : 'icon-pause-fill'}
              className={styles.play}
              onClick={onPlay}
            />
          </div>
          <div className={classname(styles.btn, styles.nextBtn)}>
            <MIcons
              name="icon-xiayishou"
              className={styles.next}
              onClick={() => onPlayNext()}
            />
          </div>
          <div className={classname(styles.btn)}>
            <Dropdown
              overlayClassName={styles.dropdown}
              overlay={volumeContent}
              placement="top"
              trigger={['click']}
              arrow
            >
              <MIcons name="icon-yinliang-jianshao" className={styles.controlBtn} />
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audio;
