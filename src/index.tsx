import ReactDOM from 'react-dom/client';
import Audio from '@/components/Music';
import App from './router';
import '@/assets/iconfont/iconfont.css';
import './index.less';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

const audioRoot = ReactDOM.createRoot(document.getElementById('audio') as HTMLElement);
audioRoot.render(<Audio />);
