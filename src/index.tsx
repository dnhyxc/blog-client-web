import ReactDOM from 'react-dom/client';
import { showAudio } from '@/components/Render';
import App from './router';
import '@/assets/iconfont/iconfont.css';
import './index.less';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

showAudio();
