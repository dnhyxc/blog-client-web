import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import Content from '@/components/Content';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, encrypt } from '@/utils';
import { SET_ITEM_CONFIG, UPDATE_INFO_API_PATH } from '@/constant';
import { LoginData } from '@/typings/common';
import styles from './index.less';

interface IProps {}

const Account: React.FC<IProps> = () => {
  const [selectItem, setSelectItem] = useState<string>('');

  const navigate = useNavigate();
  const inputRef = useRef<any>(null);
  const { userInfoStore } = useStore();
  const { userId, zhihu, juejin, github, blog } = userInfoStore.getUserInfo;

  const INPUT_INIT_VALUE = {
    juejin,
    zhihu,
    github,
    blog,
  };

  useEffect(() => {
    if (inputRef && inputRef.current && selectItem) {
      inputRef.current.focus({
        cursor: 'end',
      });
    }
  }, [inputRef, selectItem]);

  // 修改用户信息
  const onUpdateUserInfo = async (value: string) => {
    if (!value) return;
    const res = normalizeResult<LoginData>(
      await Service.updateInfo(
        {
          [selectItem]: selectItem === 'password' ? encrypt(value) : value,
          userId,
        },
        UPDATE_INFO_API_PATH[selectItem === 'password' ? 2 : 1]
      )
    );
    if (res.success) {
      userInfoStore.setUserInfo({
        ...res.data,
      });
      message.success(res.message);
      if (selectItem === 'password') {
        navigate('/login');
      }
    } else {
      message.error(res.message);
    }
  };

  const onSetVisible = (name: string) => {
    setSelectItem(name);
  };

  const onSearch = (value: string) => {
    onUpdateUserInfo(value);
    setSelectItem('');
  };

  const onBlur = () => {
    setSelectItem('');
  };

  return (
    <div className={styles.Account}>
      <Content
        containerClassName={styles.containerClassName}
        wrapClassName={styles.wrapClassName}
      >
        <div className={styles.content}>
          <div className={styles.header}>账号管理</div>
          <div className={styles.setList}>
            {SET_ITEM_CONFIG.map((i) => {
              return (
                <div className={styles.setItem} key={i.label}>
                  <span className={styles.name}>{i.name}</span>
                  {selectItem !== i.label && (
                    <Button type="link" onClick={() => onSetVisible(i.label)}>
                      {i.action}
                    </Button>
                  )}
                  {selectItem === i.label && (
                    <Input.Search
                      ref={inputRef}
                      placeholder={`请输入${i.name}`}
                      defaultValue={INPUT_INIT_VALUE[i.label]}
                      className={styles.input}
                      enterButton={<span>确定</span>}
                      onSearch={onSearch}
                      onBlur={onBlur}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Content>
    </div>
  );
};

export default Account;
