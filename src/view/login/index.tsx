/*
 * @Description: 登录页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\login\index.tsx
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Form, Input, Checkbox } from 'antd';
import classname from 'classname';
import useStore from '@/store';
import { register, login, verify, resetPassword } from '@/service';
import { normalizeResult, useCookies, encrypt, decrypt, success, error } from '@/utils';
import { close } from '@/components/Render';
import { LoginData } from '@/typings/common';
import styles from './index.less';

const { getCoolie, setCookie, removeCoolie } = useCookies;

const Login = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [resetUname, setResetUname] = useState<string>(getCoolie('uname') as string);
  const [resetPwd, setResetPwd] = useState<string>('');
  const [verifyPwd, setVerifyPwd] = useState<string>('');
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const { userInfoStore, commonStore } = useStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [search] = useSearchParams();
  const verifyPath = search.get('verify');
  const query = search.get('search');
  const pathname = search.get('pathname');

  useEffect(() => {
    let timer: any = null;
    timer = setTimeout(() => close(), 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!verifyPath) {
      verifyToken();
    }
  }, [verifyPath]);

  useEffect(() => {
    if (resetPwd && verifyPwd && resetPwd !== verifyPwd) {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  }, [resetPwd, verifyPwd]);

  // 校验token是否过期
  const verifyToken = async () => {
    const res = normalizeResult<number>(await verify());
    if (res.success) {
      navigate(`${commonStore.auth.redirectUrl}` || `${pathname}${query}` || '/home', {
        replace: true,
      });
    }
  };

  const onRegister = async () => {
    const values = await form.validateFields();
    const password = encrypt(values.password);
    const { username } = values;
    const res = normalizeResult<LoginData>(await register({ username, password }));
    if (res.success) {
      success(res.message);
    } else {
      res.message && error(res.message);
    }
  };

  const onLogin = async (newValues?: {
    username: string;
    password: string;
    remember: boolean;
  }) => {
    const values = newValues || (await form.validateFields());
    const password = values?.password && encrypt(values.password);
    const username = values?.username;
    const res = normalizeResult<LoginData>(await login({ username, password }));
    if (res.success) {
      const userInfo = { ...res.data };
      delete userInfo.token;
      // 将登录信息保存到store中
      userInfoStore.setUserInfo({
        ...userInfo,
      });
      localStorage.setItem('token', res.data?.token!);
      values?.remember ? setCookie('100', password as string, 1) : removeCoolie('100');
      values?.remember
        ? username && setCookie('uname', username, 1)
        : removeCoolie('uname');
      navigate(`${commonStore.auth.redirectUrl}` || `${pathname}${query}` || '/home', {
        replace: true,
      });
    } else {
      res.message && error(res.message);
    }
  };

  const onBackHome = () => {
    navigate('/home');
  };

  const onForget = () => {
    setVisible(true);
  };

  const onBackLogin = () => {
    setVisible(false);
  };

  // 重置密码接口
  const onResetPwd = async () => {
    if (!resetUname) {
      error('账号不能为空');
      return;
    }
    if (!resetPwd) {
      error('新密码不能为空');
      return;
    }
    if (!verifyPwd) {
      error('确认密码不能为空');
      return;
    }
    if (resetPwd !== verifyPwd) {
      error('两次密码不一致');
      return;
    }
    const res = normalizeResult<LoginData>(
      await resetPassword({ username: resetUname, password: encrypt(resetPwd as string) })
    );
    if (res.success) {
      userInfoStore.setUserInfo({
        ...res.data,
      });
      success(res.message);
      const remember = form.getFieldValue('remember');
      onLogin({
        username: resetUname,
        password: resetPwd,
        remember,
      });
    }
  };

  const onChangeUname = (e: any) => {
    setResetUname(e.target.value.trim());
  };

  const onChangePwd = (e: any) => {
    setResetPwd(e.target.value.trim());
  };

  const onChangeVerifyPwd = (e: any) => {
    setVerifyPwd(e.target.value.trim());
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        {!visible ? (
          <div className={styles.content}>
            <div className={styles.title}>账号密码登录</div>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              className={styles.form}
              form={form}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '用户名不能为空！' }]}
                initialValue={getCoolie('uname')}
              >
                <Input placeholder="请输入用户名" size="large" maxLength={20} />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '密码不能为空!' }]}
                initialValue={
                  getCoolie('100') ? decrypt(getCoolie('100') as string) : undefined
                }
              >
                <Input.Password placeholder="请输入密码" size="large" maxLength={20} />
              </Form.Item>
              <Form.Item
                name="remember"
                valuePropName="checked"
                className={styles.remember}
              >
                <Checkbox>记住本次登录密码</Checkbox>
              </Form.Item>
              <Form.Item className={styles.actions}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.login}
                  onClick={() => onLogin()}
                  size="large"
                >
                  登录
                </Button>
                <Button
                  htmlType="submit"
                  size="large"
                  className={styles.login}
                  onClick={onRegister}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
            <div className={styles.forget}>
              <Button type="link" className={styles.backBtn} onClick={onBackHome}>
                返回首页
              </Button>
              <Button type="link" className={styles.forgetBtn} onClick={onForget}>
                忘记密码
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.resetModel}>
              <div className={styles.title}>重置用户密码</div>
              <div className={styles.resetInfo}>
                <span className={styles.label}>用户名：</span>
                <Input
                  placeholder="请输入用户名"
                  size="large"
                  value={resetUname}
                  onChange={onChangeUname}
                  maxLength={20}
                />
              </div>
              <div className={styles.resetInfo}>
                <span className={styles.label}>新密码：</span>
                <Input.Password
                  placeholder="请输入新密码"
                  size="large"
                  maxLength={20}
                  value={resetPwd}
                  onChange={onChangePwd}
                />
              </div>
              <div className={styles.verifyInfo}>
                <span className={styles.label}>确认密码：</span>
                <Input.Password
                  placeholder="请输入确认密码"
                  size="large"
                  maxLength={20}
                  value={verifyPwd}
                  onChange={onChangeVerifyPwd}
                />
                <span className={classname(styles.errMsg, showInfo && styles.showErrMsg)}>
                  两次密码不一致
                </span>
              </div>
              <div className={styles.resetBtnWrap}>
                <Button
                  type="primary"
                  size="large"
                  className={styles.resetSubmitBtn}
                  onClick={onResetPwd}
                >
                  重置并登录
                </Button>
                <Button
                  htmlType="submit"
                  size="large"
                  className={styles.backLogin}
                  onClick={onBackLogin}
                >
                  返回登录
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
