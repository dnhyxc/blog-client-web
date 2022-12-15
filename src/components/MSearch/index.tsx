import React from 'react';
import { Input } from 'antd';
import classname from 'classname';
import styles from './index.less';

interface IProps {
  inputRef: any;
  placeholder?: string;
  onSearch: Function;
  onBlur?: Function;
  className?: string;
}

const MSearch: React.FC<IProps> = ({
  inputRef,
  placeholder,
  onSearch,
  onBlur,
  className,
}) => {
  return (
    <div className={classname(styles.MSearch, className)}>
      <Input.Search
        ref={inputRef}
        enterButton
        className={styles.searhInp}
        placeholder={placeholder || '请输入搜索内容'}
        onSearch={(e) => onSearch && onSearch(e)}
        onBlur={(e) => onBlur && onBlur(e)}
      />
    </div>
  );
};

export default MSearch;
