import React from 'react';
import classname from 'classname';
import Introduction from './Introduction';
import RecommendArticle from './RecommendArticle';
import styles from './index.less';

interface IProps {
  showRecommendArticle?: boolean;
  className?: string;
}

const RightBar: React.FC<IProps> = ({ className, showRecommendArticle }) => {
  return (
    <div className={classname(styles.container, className)}>
      <Introduction />
      {showRecommendArticle && <RecommendArticle />}
    </div>
  );
};

export default RightBar;
