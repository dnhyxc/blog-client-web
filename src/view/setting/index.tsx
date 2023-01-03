import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import classname from 'classname';
import Header from '@/components/Header';
import MenuList from '@/components/MenuList';
import Footer from '@/components/Footer';
import { useGetTheme, useHtmlWidth } from '@/hooks';
import styles from './index.less';

const { Content } = Layout;

interface IProps {}

const Setting: React.FC<IProps> = () => {
  const { htmlWidth } = useHtmlWidth();
  const { themeMode } = useGetTheme();

  return (
    <div className={classname(styles.Setting, themeMode === 'dark' && styles.dark)}>
      <div className={styles.headerWrap}>
        <Header needLeft excludesWidth needUser themeMode={themeMode}>
          <div className={styles.headerContent}>我的主页</div>
        </Header>
      </div>
      <Layout className={styles.layout}>
        <MenuList
          type="setting"
          width={200}
          className={styles.menuListWrap}
          themeMode={themeMode}
        />
        <Content>
          <Outlet />
        </Content>
        {htmlWidth <= 960 && <Footer themeMode={themeMode} />}
      </Layout>
    </div>
  );
};

export default Setting;
