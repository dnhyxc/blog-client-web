import ReactDOM from 'react-dom/client';
import MAlert from '../MAlert';

class MRender {
  public root: any;

  public audioRoot: any;

  /*
    createRoot：
      - 创建rootFiber和FiberRoot，将他们连接起来，并且初始化rootFiber的updateQueue。
      - 返回一个ReactDOMRoot的实例。
  */
  createRoot = (tagName?: string) => {
    // 创建root时先卸载root，防止控制台报错
    if (this.root) {
      this.root.unmount();
    }
    if (this.audioRoot) {
      this.audioRoot.unmount();
    }
    if (tagName) {
      this.audioRoot = ReactDOM.createRoot(document.getElementById(tagName) as HTMLElement);
    } else {
      this.root = ReactDOM.createRoot(document.getElementById('confirm') as HTMLElement);
    }
  };

  // 将Alert渲染到confirm元素中
  show = () => {
    this.createRoot();
    this.root.render(<MAlert close={this.close} type="render" />);
  };

  // 调用unmount防止出现重复createRoot的报错
  close = () => {
    if (this.root) {
      this.root.unmount();
    }
  };
}

const { show, close } = new MRender();

export { show, close };
