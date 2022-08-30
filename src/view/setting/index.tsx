import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Header from '@/components/Header';
import MenuList from '@/components/MenuList';
import styles from './index.less';

const { Content } = Layout;

interface IProps { }

const Setting: React.FC<IProps> = () => {
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
      </Layout>
    </div>
  );
};

export default Setting;
