import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Header from '@/components/Header';
import MenuList from '@/components/MenuList';
import Footer from '@/components/Footer';
import { useHtmlWidth } from '@/hooks';
import styles from './index.less';

const { Content } = Layout;

interface IProps {}

const Setting: React.FC<IProps> = () => {
  const { htmlWidth } = useHtmlWidth();

  return (
    <div className={styles.Setting}>
      <div className={styles.headerWrap}>
        <Header needLeft excludesWidth>
          <div className={styles.headerContent}>
            <div>我的主页</div>
          </div>
        </Header>
      </div>
      <Layout className={styles.layout}>
        <MenuList type="setting" width={200} />
        <Content>
          <Outlet />
        </Content>
        {htmlWidth <= 960 && <Footer />}
      </Layout>
    </div>
  );
};

export default Setting;
