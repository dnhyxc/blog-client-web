import ReactDOM from 'react-dom/client';
import MAlert from '../MAlert';

class MRender {
  public root: any;

  /*
    createRoot：
      - 创建rootFiber和FiberRoot，将他们连接起来，并且初始化rootFiber的updateQueue。
      - 返回一个ReactDOMRoot的实例。
  */
  createRoot = (node?: HTMLElement | null) => {
    // 创建root时先卸载root，防止控制台报错
    if (this.root) {
      this.root.unmount();
    }
    this.root = ReactDOM.createRoot(
      node || (document.getElementById('confirm') as HTMLElement)
    );
  };

  // 将Alert渲染到confirm元素中
  show = (node?: string) => {
    const confirm = document.getElementById(node || 'confirm');
    if (confirm?.childElementCount) return;
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
