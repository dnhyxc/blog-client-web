/*
 * @Description: 路由组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\router\index.tsx
 */
import React from 'react';
import { useRoutes, BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Music from '@/components/Music';
import zhCN from 'antd/lib/locale/zh_CN';
import routeConfig from './config';

const RouterConfig = () => {
  return useRoutes(routeConfig);
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Music />
      <BrowserRouter>
        <RouterConfig />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
