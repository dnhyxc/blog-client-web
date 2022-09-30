/*
 * @Description: 路由组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\router\index.tsx
 */
import React, { useState } from 'react';
import { useRoutes, BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Audio from '@/components/Music';
import MusicIcon from '@/components/Music/MusicIcon';
import zhCN from 'antd/lib/locale/zh_CN';
import routeConfig from './config';

const RouterConfig = () => {
  return useRoutes(routeConfig);
};

const App: React.FC = () => {
  const [toggleAudio, setToggleAudio] = useState<boolean>(false);

  const onToggleAudio = () => {
    setToggleAudio(!toggleAudio);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Audio toggleAudio={toggleAudio} />
      <BrowserRouter>
        <RouterConfig />
      </BrowserRouter>
      <MusicIcon onClick={onToggleAudio} />
    </ConfigProvider>
  );
};

export default App;
