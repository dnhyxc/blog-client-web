import React, { useEffect, useRef, useState } from 'react';
import classname from 'classname';
import { ARTICLE_CLASSIFY } from '@/constant';
import styles from './index.less';

interface IProps {
  // eslint-disable-next-line no-unused-vars
  onClick: (tagName: string) => void;
  // eslint-disable-next-line no-unused-vars
  getOffsetHeight?: (height: number) => void;
  className?: string;
}

const MSegmented: React.FC<IProps> = ({ onClick, className, getOffsetHeight }) => {
  const [tagIndex, setTagIndex] = useState<number>(0);
  const [offsetTop, setOffsetTop] = useState<number>(0);
  const [offsetLeft, setOffsetLeft] = useState<number>(0);
  const [clientWidth, setClientWidth] = useState<number>(0);

  const tagRef = useRef<any>(null);

  useEffect(() => {
    const defaultTag = tagRef?.current?.firstElementChild;
    const { offsetTop, offsetLeft, clientWidth } = defaultTag;
    setSelectSize({ offsetTop, offsetLeft, clientWidth });
    getOffsetHeight && getOffsetHeight(tagRef?.current?.offsetHeight);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [tagIndex]);

  const onSelectTag = (e: any, tag: string, index: number) => {
    const { offsetTop, offsetLeft, clientWidth } = e.target;
    setSelectSize({ offsetTop, offsetLeft, clientWidth });
    setTagIndex(index);
    onClick && onClick(tag);
  };

  const setSelectSize = ({
    offsetTop,
    offsetLeft,
    clientWidth,
  }: {
    offsetTop: number;
    offsetLeft: number;
    clientWidth: number;
  }) => {
    setOffsetTop(offsetTop);
    setOffsetLeft(offsetLeft);
    setClientWidth(clientWidth);
  };

  const onResize = () => {
    const defaultTags = tagRef?.current?.children;
    const selectTag = defaultTags?.[tagIndex];
    const { offsetTop, offsetLeft, clientWidth } = selectTag;
    setSelectSize({ offsetTop, offsetLeft, clientWidth });
    getOffsetHeight && getOffsetHeight(tagRef?.current?.offsetHeight);
  };

  return (
    <div className={classname(styles.MSegmented, className)} ref={tagRef}>
      {ARTICLE_CLASSIFY.map((i, index) => {
        return (
          <span key={i} className={styles.tag} onClick={(e) => onSelectTag(e, i, index)}>
            {i}
          </span>
        );
      })}
      <span
        className={styles.activeTag}
        style={{ top: offsetTop, left: offsetLeft, width: clientWidth }}
      />
    </div>
  );
};

export default MSegmented;
