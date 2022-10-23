import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Dropdown, Menu, Slider } from 'antd';
import classname from 'classname';
import ActionIcon from '@/components/ActionIcon';
import { MUSIC_PATHS, MUSIC_ORDER_ICONS, MUSIC_LIST_INFO } from '@/constant';
import { formatTime } from '@/utils';
import { AudioInfo } from '@/typings/component';
import { player } from './util/play';
import MIcons from '../Icons';
import styles from './index.less';

const Audio: React.FC = () => {
  const [toggleAudio, setToggleAudio] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [curPosition, setCurPosition] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [hoverTime, setHoverTime] = useState<number>(0);
  const [playIconIndex, setPlayIconIndex] = useState<number>(0);
  const [showMusicMenu, setShowMusicMenu] = useState<boolean>(false);
  const [currentLrc, setCurrentLrc] = useState<{ time: number; line: number }>({
    time: 0,
    line: 0,
  });
  const [audioInfo, setAudioInfo] = useState<AudioInfo>({
    position: 0,
    duration: 0.001,
  });
  const [showLrc, setShowLrc] = useState<boolean>(false);

  const coverRef = useRef<HTMLImageElement | null>(null);
  const insTimeRef = useRef<HTMLDivElement | null>(null);
  const musicInfoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number>(0);
  const timerRef = useRef<any>(null);
  const playIconNoRef = useRef<number>(0);
  const playIndexRef = useRef<number>(player.playIndex || 0);
  const lrcRef = useRef<HTMLDivElement | null>(null);
  const volumeRef = useRef<number>(50);

  // 计算当前播放的索引
  const playIndex = useMemo(() => {
    if (player.current.url) {
      const index = MUSIC_PATHS.findIndex((i) => i === player.current.url);
      return index;
    }
    return 0;
  }, [player.current.url]);

  useEffect(() => {
    // 当播放状态为单曲循环时，记录当前播放歌曲的索引
    if (playIconIndex === 2) {
      playIndexRef.current = player.playIndex;
    }

    MUSIC_PATHS.forEach((i) => {
      player.append(i);
    });

    player.onReady.listen(() => {
      setIsReady(true);
    });

    // 切换事件触发时，动态更改当前播放歌曲的索引，以达到随机播放及单曲循环的效果
    player.onChange.listen(() => {
      player.stochastic(playIconNoRef.current, playIndexRef.current);
      player.volume(volumeRef.current / 100);
    });

    player.onPlay.listen(() => {
      setIsPlay(true);
    });

    player.onPause.listen(() => {
      setIsPlay(false);
    });

    // 滑动时间轴时关闭声音
    player.onSetPosition.listen(() => {
      player.volume(0);
    });
  }, [playIconIndex, playIndex]);

  useEffect(() => {
    player.current?.lrc?.ms?.forEach((i: any, index: number) => {
      if (i.t <= player.position) {
        setCurrentLrc({
          time: i.t,
          line: index,
        });
      }
    });
  }, [lrcRef, player.current.lrc, player.position]);

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
    const { position, duration } = player;
    setAudioInfo({
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
    // 124 为progress元素的marginLeft
    const offsetLeftSum = musicInfoOffsetleft + playerOffsetleft + 124;
    const position = e.pageX - offsetLeftSum || 0;
    // 设置insTime的偏移量
    insTimeRef.current!.style.left = `${position - 18}px`;
    // 计算当前位置的比例，136 为progress元素的总长度
    const currentPercentage = position / 136;
    // 计算position
    const currentPosition = player.duration * currentPercentage;
    setHoverTime(currentPosition);
  };

  const onSliderChange = (value: number) => {
    volumeRef.current = value;
    player.volume(volumeRef.current / 100);
  };

  // 鼠标抬起时恢复声音
  const onAfterChange = () => {
    player.volume(volumeRef.current / 100);
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

  // 切换Audio
  const onToggleAudio = () => {
    setToggleAudio(!toggleAudio);
  };

  const onShowMusicNemu = () => {
    setShowMusicMenu(!showMusicMenu);
  };

  const onSelectItem = (path: string) => {
    const index = player.playList.findIndex((i) => i.url === path);
    player.selectMusic(index);
    setShowMusicMenu(!showMusicMenu);
  };

  const onShowLrc = () => {
    setShowLrc(!showLrc);
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
              <div className={styles.count}>{volumeRef.current}%</div>
            </div>
          ),
        },
      ]}
    />
  );

  return (
    <>
      <ActionIcon onClick={onToggleAudio} />
      <div
        className={classname(!toggleAudio && styles.toggle, styles.player)}
        ref={playerRef}
      >
        <div
          className={classname(styles.musicInfo, !isPlay && styles.hideMusicInfo)}
          ref={musicInfoRef}
        >
          <div className={styles.nameInfo}>
            <div className={styles.musicName}>
              {player.current.lrc && !showLrc ? (
                <div
                  className={styles.musicLrcList}
                  style={{
                    transform: `translateY(${-(currentLrc.line * 25)}px)`,
                  }}
                >
                  {player?.current?.lrc?.ms?.map((i: any, index: number) => (
                    <div
                      className={classname(
                        styles.musicLrcItem,
                        currentLrc.time === i.t && styles.currentLine
                      )}
                      key={index}
                    >
                      {i.c}
                    </div>
                  ))}
                </div>
              ) : (
                MUSIC_LIST_INFO[playIndex]?.name
              )}
            </div>
            <div className={styles.artistName}>{MUSIC_LIST_INFO[playIndex]?.author}</div>
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
        {isPlay && (
          <div className={classname(styles.lrcInfo, showLrc && styles.showLrcInfo)}>
            <div className={styles.lrcHeader}>
              <div className={styles.musicTitle}>{MUSIC_LIST_INFO[playIndex]?.name}</div>
              <div className={styles.authorName}>{MUSIC_LIST_INFO[playIndex]?.author}</div>
            </div>
            <div className={classname(styles.musicLrcWrap)} ref={lrcRef}>
              <div
                className={styles.musicLrcList}
                style={{
                  transform: `translateY(${-(currentLrc.line * 25 - 175)}px)`,
                }}
              >
                {player?.current?.lrc?.ms?.map((i: any, index: number) => (
                  <div
                    className={classname(
                      styles.musicLrcItem,
                      currentLrc.time === i.t && styles.currentLine
                    )}
                    key={index}
                    title={i.c}
                  >
                    {i.c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div
          className={classname(styles.musicList, !showMusicMenu && styles.hideMusicList)}
        >
          {MUSIC_LIST_INFO.map((i) => (
            <div
              className={styles.musicItem}
              key={i.key}
              onClick={() => onSelectItem(i.path)}
            >
              {i.name}
            </div>
          ))}
        </div>
        <div className={styles.playerContent}>
          <div className={classname(styles.musicMenu)}>
            <MIcons
              name="icon-icon_mulu"
              className={styles.controlBtn}
              onClick={() => onShowMusicNemu()}
            />
          </div>
          <div className={styles.musicImgs}>
            {isPlay && (
              <div className={styles.lrcMenu}>
                <MIcons
                  name={showLrc ? 'icon-shuangjiantou-xia' : 'icon-shuangjiantou-shang'}
                  className={styles.lrcBtn}
                  onClick={() => onShowLrc()}
                  customStyle
                />
              </div>
            )}
            <div className={styles.img}>
              <img
                src={MUSIC_LIST_INFO[playIndex]?.cover}
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
            <div className={classname(styles.btn, volumeRef.current === 0 && styles.mute)}>
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
    </>
  );
};

export default Audio;
