import React from 'react';
import { Input } from 'antd';
import styles from './index.less';

interface IProps {
  inputRef: any;
  placeholder?: string;
  onSearch: Function;
  onBlur?: Function;
}

const MSearch: React.FC<IProps> = ({ inputRef, placeholder, onSearch, onBlur }) => {
  return (
    <div className={styles.MSearch}>
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
