/*
 * @Description: About 页面
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\about\index.tsx
 */
import { Button } from 'antd';
import Content from '@/components/Content';
import Header from '@/components/Header';
import styles from './index.less';

const AboutMe = () => {
  const onAddItem = () => {
    console.log('添加～～～');
  };

  const headerRight = () => {
    return (
      <div className={styles.left}>
        <Button onClick={onAddItem}>添加</Button>
      </div>
    );
  };

  return (
    <div className={styles.AboutMe}>
      <Header right={headerRight()}>About</Header>
      <Content>
        <div className={styles.wrap}>
          <div className={styles.test}>关于我的</div>
        </div>
      </Content>
    </div>
  );
};

export default AboutMe;
