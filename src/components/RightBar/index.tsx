import React from 'react';
import classname from 'classname';
import Introduction from './Introduction';
import RecommendArticle from './RecommendArticle';
import styles from './index.less';

interface IProps {
  showRecommendArticle?: boolean;
  className?: string;
  scrollRef?: any;
  themeMode?: string;
  htmlWidth?: number;
}

const RightBar: React.FC<IProps> = ({
  className,
  showRecommendArticle,
  scrollRef,
  themeMode,
  htmlWidth = 0,
}) => {
  return htmlWidth > 960 ? (
    <div className={classname(styles.container, className)}>
      <Introduction showRecommendArticle={showRecommendArticle} themeMode={themeMode} />
      {showRecommendArticle && (
        <RecommendArticle
          scrollRef={scrollRef}
          themeMode={themeMode}
          htmlWidth={htmlWidth}
        />
      )}
    </div>
  ) : null;
};

export default RightBar;
