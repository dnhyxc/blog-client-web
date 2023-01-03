/*
 * @Description: 布局组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\layout\index.tsx
 */
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import classname from 'classname';
import MenuList from '@/components/MenuList';
import Footer from '@/components/Footer';
import User from '@/components/User';
import Decorator from '@/components/Decorator';
import { useGetTheme } from '@/hooks';
import styles from './index.less';

const { Content } = Layout;

const AppLayout = () => {
  const { themeMode } = useGetTheme();

  return (
    <div className={styles.container}>
      <MenuList themeMode={themeMode} />
      <div className={styles.user}>
        <User themeMode={themeMode} />
      </div>
      <Layout className={classname(styles.layout, themeMode === 'dark' && styles.dark)}>
        <Content>
          <Outlet />
        </Content>
        <Footer themeMode={themeMode} />
      </Layout>
      <Decorator themeMode={themeMode} />
    </div>
  );
};

export default AppLayout;
