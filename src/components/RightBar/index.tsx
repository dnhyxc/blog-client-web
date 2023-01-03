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
  themeMode?: string;
}

const RightBar: React.FC<IProps> = ({
  className,
  showRecommendArticle,
  scrollRef,
  themeMode,
}) => {
  const { htmlWidth } = useHtmlWidth();

  return htmlWidth > 960 ? (
    <div className={classname(styles.container, className)}>
      <Introduction showRecommendArticle={showRecommendArticle} themeMode={themeMode} />
      {showRecommendArticle && (
        <RecommendArticle scrollRef={scrollRef} themeMode={themeMode} />
      )}
    </div>
  ) : null;
};

export default RightBar;
