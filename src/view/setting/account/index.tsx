import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, Modal } from 'antd';
import classname from 'classname';
import Content from '@/components/Content';
import MDropdown from '@/components/MDropdown';
import ActionIcon from '@/components/ActionIcon';
import useStore from '@/store';
import { useGetTheme, useHtmlWidth, useVerifyToken } from '@/hooks';
import * as Service from '@/service';
import { normalizeResult, encrypt, getSetItemConfig, error, success, verifyPassword } from '@/utils';
import { UPDATE_INFO_API_PATH } from '@/constant';
import { LoginData } from '@/typings/common';
import styles from './index.less';

const Account: React.FC = () => {
  const [selectItem, setSelectItem] = useState<string>('');

  // 校验token是否过期
  useVerifyToken();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const cleararticledebugger = search.get('cleararticledebugger');
  const inputRef = useRef<any>(null);
  const { htmlWidth } = useHtmlWidth();
  const { themeMode } = useGetTheme();
  const { userInfoStore } = useStore();
  const { userId, username, zhihu, juejin, github, blog, auth } = userInfoStore.getUserInfo;

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
    const message = await verifyPassword('', value as string);

    console.log(message, 'message');

    const res = normalizeResult<LoginData>(
      await Service.updateInfo(
        {
          [selectKey || selectItem]:
            selectItem === 'password' ? encrypt(value as string) : value,
          username,
        },
        UPDATE_INFO_API_PATH[selectItem === 'password' ? 2 : 1]
      )
    );
    if (res.success) {
      userInfoStore.setUserInfo({
        ...res.data,
      });
      success(res.message);
      if (selectItem === 'password') {
        navigate('/login');
      }
    } else {
      error(res.message);
    }
  };

  // 清空文章
  const onDeleteArticles = async () => {
    await Service.delAllArticle();
  };

  const onLogout = () => {
    Modal.confirm({
      title: '确定要注销该账号吗？',
      onOk: async () => {
        const res = normalizeResult<string>(await Service.logout({ userId }));
        if (res.success) {
          success(res.message);
          navigate('/login');
        }
      },
    });
  };

  const onSetVisible = (name: string) => {
    setSelectItem(name);
    if (name === 'logout') {
      onLogout();
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
    <div className={classname(styles.Account, themeMode === 'dark' && styles.dark)}>
      <ActionIcon
        noHideMenuIcon
        className={styles.changeIconWrap}
        themeMode={themeMode}
        htmlWidth={htmlWidth}
      />
      <Content
        containerClassName={styles.containerClassName}
        wrapClassName={styles.wrapClassName}
        className={styles.scrollWrap}
        themeMode={themeMode}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.infoText}>
              <span>账号设置</span>
              {htmlWidth < 960 && (
                <MDropdown
                  overlayClassName={themeMode === 'dark' ? styles.overlayClassName : ''}
                />
              )}
            </div>
          </div>
          <div className={styles.setList}>
            {getSetItemConfig(auth, cleararticledebugger).map((i) => {
              return (
                <div className={styles.setItem} key={i.label}>
                  <span className={styles.name}>{i.name}</span>
                  {(selectItem !== i.label ||
                    selectItem === 'logout') && (
                      <Button
                        type="link"
                        className={styles.settingBtn}
                        onClick={() => onSetVisible(i.label)}
                      >
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
