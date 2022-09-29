import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Menu, Slider } from 'antd';
import classname from 'classname';
import { CYWL_URL, MUSIC_PATHS, MUSIC_ORDER_ICONS } from '@/constant';
import { formatTime } from '@/utils';
// import { formatTime, formatName } from '@/utils';
import { AudioInfo } from '@/typings/component';
import { player } from './util/play';
import MIcons from '../Icons';
import styles from './index.less';

// https://cloud.tencent.com/developer/article/2098058
// https://segmentfault.com/a/1190000017090438

const Audio: React.FC = () => {
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [curPosition, setCurPosition] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [hoverTime, setHoverTime] = useState<number>(0);
  const [playIconIndex, setPlayIconIndex] = useState<number>(0);
  const [audioInfo, setAudioInfo] = useState<AudioInfo>({
    position: 0,
    duration: 0.001,
    progress: '',
  });

  const coverRef = useRef<HTMLImageElement | null>(null);
  const insTimeRef = useRef<HTMLDivElement | null>(null);
  const musicInfoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number>(0);
  const timerRef = useRef<any>(null);
  const playIconNoRef = useRef<number>(0);
  const playIndexRef = useRef<number>(player.playIndex || 0);

  useEffect(() => {
    // 当播放状态为单曲循环时，记录当前播放歌曲的索引
    if (playIconIndex === 2) {
      playIndexRef.current = player.playIndex;
    }

    MUSIC_PATHS.forEach((i) => {
      player.append(i);
    });

    player.onReady.listen(() => {
      // this.changeCover();
      setIsReady(true);
    });

    // 切换事件触发时，动态更改当前播放歌曲的索引，以达到随机播放及单曲循环的效果
    player.onChange.listen(() => {
      // this.changeCover();
      player.stochastic(playIconNoRef.current, playIndexRef.current);
    });

    player.onPlay.listen(() => {
      setIsPlay(true);
    });

    player.onPause.listen(() => {
      setIsPlay(false);
    });

    player.onVolume.listen(() => { });

    // 滑动时间轴时关闭声音
    player.onSetPosition.listen(() => {
      player.volume(0);
    });

    player.onStochastic.listen(() => { });

    player.onClose.listen(() => { });
  }, [playIconIndex]);

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

  // 监听volume，设置音量
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
    if (player.isEmpty) return;
    player.prev();
  };

  // 下一首
  const onPlayNext = () => {
    if (player.isEmpty) return;
    player.next();
  };

  // 设置时间
  const onChangePosition = (value: number) => {
    setCurPosition(value);
    const currentPosition = player.duration * (value / 100);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // 设置当前position
    player.setPosition(currentPosition);
  };

  // 计算鼠标位于左侧的距离
  const onHoverProgress = (e: any) => {
    const musicInfoOffsetleft = musicInfoRef.current?.offsetLeft || 0;
    const playerOffsetleft = playerRef.current?.offsetLeft || 0;
    // 115 为progress元素的marginLeft
    const offsetLeftSum = musicInfoOffsetleft + playerOffsetleft + 116;
    const position = e.pageX - offsetLeftSum || 0;
    // 设置insTime的偏移量
    insTimeRef.current!.style.left = `${position - 18}px`;
    // 计算当前位置的比例，145为progress元素的总长度
    const currentPercentage = position / 145;
    // 计算position
    const currentPosition = player.duration * currentPercentage;
    setHoverTime(currentPosition);
  };

  const onSliderChange = (value: number) => {
    setVolume(value);
  };

  // 鼠标抬起时恢复声音
  const onAfterChange = () => {
    player.volume(volume / 100);
  };

  // 切换播放图标
  const onChangePlayIcon = () => {
    if (playIconNoRef.current >= 2) {
      playIconNoRef.current = 0;
      setPlayIconIndex(0);
    } else {
      playIconNoRef.current += 1;
      setPlayIconIndex(playIconIndex + 1);
    }
  };

  // 音量气泡框
  const volumeContent = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <div className={styles.volume}>
              <div className={styles.sliderWrap}>
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
        <div className={styles.progress} onMouseMove={onHoverProgress}>
          <div className={styles.insTime} ref={insTimeRef}>
            {formatTime(hoverTime < 0 ? 0 : hoverTime)}
          </div>
          <Slider
            className={styles.timeSlider}
            value={curPosition}
            onChange={onChangePosition}
            onAfterChange={onAfterChange}
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
              name={MUSIC_ORDER_ICONS[playIconIndex]}
              className={styles.controlBtn}
              onClick={() => onChangePlayIcon()}
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
