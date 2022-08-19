import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, message, Modal } from 'antd';
import Content from '@/components/Content';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, encrypt, getSetItemConfig } from '@/utils';
import { UPDATE_INFO_API_PATH } from '@/constant';
import { LoginData } from '@/typings/common';
import styles from './index.less';

interface IProps {}

const Account: React.FC<IProps> = () => {
  const [selectItem, setSelectItem] = useState<string>('');

  const navigate = useNavigate();
  const [search] = useSearchParams();
  const cleararticledebugger = search.get('cleararticledebugger');
  const inputRef = useRef<any>(null);
  const { userInfoStore } = useStore();
  const { userId, zhihu, juejin, github, blog, auth } = userInfoStore.getUserInfo;

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
  const onUpdateUserInfo = async (value: string | number, selectKey?: string) => {
    if (!value) return;
    const res = normalizeResult<LoginData>(
      await Service.updateInfo(
        {
          [selectKey || selectItem]:
            selectItem === 'password' ? encrypt(value as string) : value,
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

  // 清空文章
  const onDeleteArticles = async () => {
    await Service.delAllArticle();
  };

  const showSetAuthConfirm = (key: string) => {
    Modal.confirm({
      title: '确定设置为管理员权限吗？',
      onOk: () => {
        onUpdateUserInfo(1, key);
      },
    });
  };

  const onSetVisible = (name: string) => {
    setSelectItem(name);
    if (name === 'auth') {
      showSetAuthConfirm('auth');
    }
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
            {getSetItemConfig(auth, cleararticledebugger).map((i) => {
              return (
                <div className={styles.setItem} key={i.label}>
                  <span className={styles.name}>{i.name}</span>
                  {(selectItem !== i.label ||
                    selectItem === 'auth' ||
                    selectItem === 'logout') && (
                    <Button type="link" onClick={() => onSetVisible(i.label)}>
                      {i.action}
                    </Button>
                  )}
                  {selectItem === i.label &&
                    selectItem !== 'auth' &&
                    selectItem !== 'logout' && (
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
      {cleararticledebugger === 'DELETE__ALL__ARTICLE' && (
        <Button type="link" onClick={onDeleteArticles} className={styles.deleteAll}>
          清空缓存
        </Button>
      )}
    </div>
  );
};

export default Account;
