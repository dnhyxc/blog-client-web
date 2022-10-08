import ReactDOM from 'react-dom/client';
import Audio from '@/components/Audio';
import App from './router';
import '@/assets/iconfont/iconfont.css';
import './index.less';

const audioRoot = ReactDOM.createRoot(document.getElementById('audio') as HTMLElement);
audioRoot.render(<Audio />);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
