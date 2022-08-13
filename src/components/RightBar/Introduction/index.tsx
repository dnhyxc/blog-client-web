import React from 'react';
import { HEAD_UEL } from '@/constant';
import { Button } from 'antd';
import Image from '@/components/Image';
import styles from './index.less';

interface IProps {
  className?: string;
}

const Introduction: React.FC<IProps> = () => {
  const socialList = [
    {
      id: 1,
      name: '掘金',
      link: 'https://juejin.cn/user/4265760848885368',
    },
    {
      id: 2,
      name: '知乎',
      link: 'https://www.zhihu.com/people/xia-mo-65-57-25',
    },
    {
      id: 3,
      name: '微博',
      link: 'https://m.weibo.cn/profile/3303269305',
    },
  ];

  const tagList = [
    {
      tagName: '文章',
      num: 211,
      id: 1,
    },
    {
      tagName: '标签',
      num: 91,
      id: 2,
    },
    {
      tagName: '分类',
      num: 29,
      id: 3,
    },
  ];

  return (
    <div className={styles.introductionWrap}>
      <div className={styles.card}>
        <Image url={HEAD_UEL} className={styles.image} />
      </div>
      <div className={styles.nameInfo}>
        <div className={styles.name}>dnhyxc</div>
        {/* contentEditable="true"设置当前元素可编辑。suppressContentEditableWarning解决react报错 */}
        <div
          suppressContentEditableWarning
          contentEditable="true"
          className={styles.desc}
        >
          行到水穷处，坐看云起时
        </div>
      </div>
      <div className={styles.articleInfo}>
        {tagList.map((i) => {
          return (
            <div key={i.id} className={styles.statistical}>
              <span>{i.tagName}</span>
              <span>{i.num}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.socialWrap}>
        <Button className={styles.github} type="primary">
          <a href="https://github.com/dnhyxc" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </Button>
        <div className={styles.socialList}>
          {socialList.map((i) => {
            return (
              <span key={i.id}>
                <a href={i.link} target="_blank" rel="noreferrer">
                  {i.name}
                </a>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Introduction;
