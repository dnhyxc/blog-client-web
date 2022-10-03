import { getRandomNumber } from '@/utils';
import { MUSIC_PATHS } from '@/constant';
import { Dispatcher } from './dispatcher';

class Player {
  audioContext: AudioContext;

  playList: any[];

  playIndex: number;

  playOrder: number;

  emptyNode: any;

  onPlay: Dispatcher;

  onPause: Dispatcher;

  onChange: Dispatcher;

  onReady: Dispatcher;

  onSetPosition: Dispatcher;

  onVolume: Dispatcher;

  onStochastic: Dispatcher;

  onClose: Dispatcher;

  onSelectMusic: Dispatcher;

  constructor() {
    this.audioContext = new AudioContext();
    this.playList = [];
    this.playIndex = 0;
    this.playOrder = 0;

    this.emptyNode = {
      file: null,
      offset: 0,
      start: null,
      source: null,
      buffer: null,
      gainNode: null,
    };

    this.onPlay = new Dispatcher();
    this.onPause = new Dispatcher();
    this.onChange = new Dispatcher();
    this.onReady = new Dispatcher();
    this.onVolume = new Dispatcher();
    this.onSetPosition = new Dispatcher();
    this.onStochastic = new Dispatcher();
    this.onClose = new Dispatcher();
    this.onSelectMusic = new Dispatcher();
  }

  get isEmpty() {
    return this.current === this.emptyNode;
  }

  get current() {
    return this.playList[this.playIndex] || this.emptyNode;
  }

  get position() {
    if (!this.playList.length) {
      return 0;
    }
    return (
      this.current.offset +
      (this.current.start !== null ? this.audioContext.currentTime - this.current.start : 0)
    );
  }

  get duration() {
    return this.current.buffer ? this.current.buffer.duration : 0.001;
  }

  readAudioBuffer = (url: string) => {
    const request = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = () => {
        this.audioContext.decodeAudioData(request.response, (buffer) => {
          return buffer ? resolve(buffer) : reject('decoding error');
        });
      };
      request.onerror = (error) => reject(error);
      request.send();
    });
  };

  async append(url: string) {
    const { isEmpty } = this;
    this.playList.push({
      url,
      offset: 0,
      start: null,
      source: null,
      buffer: await this.readAudioBuffer(url),
      gainNode: this.audioContext.createGain(), // 创建音频处理模块
    });
    if (isEmpty) {
      this.onReady.emit(this);
    }
  }

  play() {
    const { buffer, gainNode, offset } = this.current;
    if (!this.playList.length || this.current.source || !gainNode) return;
    // 创建音频容器对象
    const bufferSource = this.audioContext.createBufferSource();
    bufferSource.buffer = buffer;
    // 播放结束后，自动播放下一首
    bufferSource.onended = this.next.bind(this);
    // 连接音频对象
    bufferSource.connect(gainNode);
    this.current.gainNode.connect(this.audioContext.destination);
    bufferSource.start(0, offset);
    this.current.source = bufferSource;
    this.current.start = this.audioContext.currentTime;
    this.onPlay.emit(this);
  }

  pause() {
    if (!this.playList.length || !this.current.source) return;
    this.current.source.stop(0);
    this.current.source.disconnect(0);
    this.current.source.onended = null;
    this.current.source = null;
    this.current.offset = this.position;
    this.current.start = null;
    this.onPause.emit(this);
  }

  stop() {
    this.pause();
    this.current.offset = 0;
    this.current.start = null;
  }

  next() {
    this.stop();
    this.playIndex++;
    if (this.playIndex >= this.playList.length) {
      this.playIndex = 0;
    }
    this.play();
    this.onChange.emit(this);
  }

  prev() {
    this.stop();
    this.playIndex--;
    if (this.playIndex < 0) {
      this.playIndex = Math.max(this.playList.length - 1, 0);
    }
    this.play();
    this.onChange.emit(this);
  }

  // 设置随机播放
  stochastic(value: number, playIndex: number) {
    this.stop();
    switch (value) {
      case 0: // 顺序播放
        if (this.playIndex >= MUSIC_PATHS.length) {
          this.playIndex = 0;
        } else {
          const index = this.playIndex;
          this.playIndex = index;
        }
        break;
      case 1: // 随机播放
        const count = getRandomNumber(0, 5);
        this.playIndex = count;
        break;
      case 2: // 单曲循环
        this.playIndex = playIndex;
        break;
      default:
        break;
    }
    this.play();
    this.onStochastic.emit(this);
  }

  selectMusic(value: number) {
    this.stop();
    this.playIndex = value;
    this.play();
    this.onSelectMusic.emit(this);
  }

  setPosition(val: number) {
    if (!this.playList.length) {
      return;
    }
    this.stop();
    this.current.offset = val;
    this.current.start = null;
    this.play();
    this.onSetPosition.emit(this);
  }

  // 设置声音大小
  volume(value: number) {
    if (!this.current.gainNode) return;
    this.current.gainNode.gain.value = value;
    this.onVolume.emit(this);
  }

  close() {
    this.audioContext.close();
    this.onClose.emit(this);
  }
}

export const player = new Player();
