/*
 * @Description: 登录页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\login\index.tsx
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Form, Input, Checkbox, Modal } from 'antd';
import useStore from '@/store';
import { register, login, verify, resetPassword } from '@/service';
import { normalizeResult, useCookies, encrypt, decrypt, success, error } from '@/utils';
import { close } from '@/components/Confirm';
import { LoginData } from '@/typings/common';
import styles from './index.less';

const { getCoolie, setCookie, removeCoolie } = useCookies;

const Login = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [resetUname, setResetUname] = useState<string>(getCoolie('uname') as string);
  const [resetPwd, setResetPwd] = useState<string>('');
  const { userInfoStore, commonStore } = useStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [search] = useSearchParams();
  const verifyPath = search.get('verify');

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

  // 校验token是否过期
  const verifyToken = async () => {
    const res = normalizeResult<number>(await verify());
    if (res.success) {
      navigate(`${commonStore.auth.redirectUrl}` || '/home', { replace: true });
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

  const onLogin = async () => {
    const values = await form.validateFields();
    const password = encrypt(values.password);
    const { username } = values;
    const res = normalizeResult<LoginData>(await login({ username, password }));
    if (res.success) {
      const userInfo = { ...res.data };
      delete userInfo.token;
      // 将登录信息保存到store中
      userInfoStore.setUserInfo({
        ...userInfo,
      });
      localStorage.setItem('token', res.data?.token!);
      values?.remember ? setCookie('100', password as string, 7) : removeCoolie('100');
      values?.remember ? setCookie('uname', username, 7) : removeCoolie('uname');
      navigate(`${commonStore.auth.redirectUrl}` || '/home', { replace: true });
    } else {
      res.message && error(res.message);
    }
  };

  const onForget = () => {
    setVisible(true);
  };

  // 重置密码接口
  const onResetPwd = async () => {
    if (!resetPwd || !resetUname) error('账号或新密码不能为空');
    const res = normalizeResult<LoginData>(
      await resetPassword({ username: resetUname, password: encrypt(resetPwd as string) })
    );
    setVisible(false);
    if (res.success) {
      userInfoStore.setUserInfo({
        ...res.data,
      });
      success(res.message);
    }
  };

  const onChangeUname = (e: any) => {
    setResetUname(e.target.value.trim());
  };

  const onChangePwd = (e: any) => {
    setResetPwd(e.target.value.trim());
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
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
              <Input placeholder="请输入用户名" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '密码不能为空!' }]}
              initialValue={
                getCoolie('100') ? decrypt(getCoolie('100') as string) : undefined
              }
            >
              <Input.Password placeholder="请输入密码" size="large" />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked" className={styles.remember}>
              <Checkbox>记住本次登录密码</Checkbox>
            </Form.Item>
            <Form.Item className={styles.actions}>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.login}
                onClick={onLogin}
                size="large"
              >
                登录
              </Button>
              <Button htmlType="submit" size="large" className={styles.login} onClick={onRegister}>
                注册
              </Button>
            </Form.Item>
          </Form>
          <div className={styles.forget}>
            <Button type="link" className={styles.forgetBtn} onClick={onForget}>忘记密码</Button>
          </div>
        </div>
      </div>
      <Modal title="重置密码" centered width={400} visible={visible} onOk={onResetPwd} onCancel={() => setVisible(false)}>
        <div className={styles.resetModel}>
          <div className={styles.resetInfo}>
            <span className={styles.label}>用户名：</span>
            <Input placeholder="请输入用户名" size="large" value={resetUname} onChange={onChangeUname} />
          </div>
          <div className={styles.resetInfo}>
            <span className={styles.label}>新密码：</span>
            <Input.Password placeholder="请输入新密码" size="large" value={resetPwd} onChange={onChangePwd} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
