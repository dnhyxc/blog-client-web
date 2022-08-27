import React from 'react';
import classname from 'classname';
import { useHtmlWidth } from '@/hooks';
import Introduction from './Introduction';
import RecommendArticle from './RecommendArticle';
import styles from './index.less';

interface IProps {
  showRecommendArticle?: boolean;
  className?: string;
  scrollRef?: any;
}

const RightBar: React.FC<IProps> = ({ className, showRecommendArticle, scrollRef }) => {
  const { htmlWidth } = useHtmlWidth();

  return (
    htmlWidth > 960 ? (
      <div className={classname(styles.container, className)}>
        <Introduction />
        {showRecommendArticle && <RecommendArticle scrollRef={scrollRef} />}
      </div>
    ) : null
  );
};

export default RightBar;
