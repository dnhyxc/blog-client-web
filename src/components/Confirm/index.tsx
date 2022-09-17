import ReactDOM from 'react-dom/client';
import Alert from './confirm';

class Confirm {
  public root: any;

  /*
    createRoot：
      - 创建rootFiber和FiberRoot，将他们连接起来，并且初始化rootFiber的updateQueue。
      - 返回一个ReactDOMRoot的实例。
  */
  createRoot = (node?: HTMLElement | null) => {
    this.root = ReactDOM.createRoot(
      node || (document.getElementById('confirm') as HTMLElement)
    );
  };

  // 将Alert渲染到confirm元素中
  show = () => {
    const confirm = document.getElementById('confirm');
    if (confirm?.childElementCount) return;
    this.createRoot();
    this.root.render(<Alert close={this.close} />);
  };

  // 调用unmount防止出现重复createRoot的报错
  close = () => {
    if (this.root) {
      this.root.unmount();
    }
  };
}

const { show, close } = new Confirm();

export { show, close };
