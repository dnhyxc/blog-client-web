import React, { useState } from 'react';
import { Input, Button } from 'antd';
import useStore from '@/store';
import { sendMessage } from '@/socket';
import Header from '@/components/Header';
import styles from './index.less';

const { TextArea } = Input;

interface IProps {}

const Chat: React.FC<IProps> = () => {
  const [content, setContent] = useState('');

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  const onSendMessage = (userId: string) => {
    send(userId);
  };

  const send = (from = getUserInfo?.userId) => {
    // const to = '642f043db47853baa1c9f85e';
    const to = '630da8cef24c2b18524a296a';
    const chatId = [from, to].sort().join('_');
    sendMessage(
      JSON.stringify({
        action: 'chat',
        data: {
          from,
          to,
          content,
          chatId,
          createTime: new Date().valueOf(),
          action: 'CHAT',
          toUserId: to, // 用于提示消息
        },
        userId: from || getUserInfo?.userId,
      })
    );
  };

  const onChange = (e: any) => {
    setContent(e.target.value);
  };

  const onPressEnter = (e: any) => {
    setContent(e.target.value);
  };

  return (
    <div className={styles.Chat}>
      <div className={styles.headerWrap}>
        <Header needLeft excludesWidth>
          下载客户端
        </Header>
      </div>
      <div className={styles.content}>
        <TextArea
          showCount
          maxLength={100}
          onChange={onChange}
          onPressEnter={onPressEnter}
        />
        <div className={styles.actions}>
          <Button
            className={styles.btn}
            type="primary"
            onClick={() => onSendMessage('6449d137e5fe6b620b205192')}
          >
            FROM: 夏陌 192
          </Button>
          <Button
            className={styles.btn}
            type="primary"
            onClick={() => onSendMessage('6447c43efad309875e3c1bb5')}
          >
            FROM: 墨客 bb5
          </Button>
          <Button
            className={styles.btn}
            type="primary"
            onClick={() => onSendMessage('640722005fdedd2ce901959e')}
          >
            FROM: 春风拂面 59e
          </Button>
          <Button
            className={styles.btn}
            type="primary"
            onClick={() => onSendMessage('6432bdf2c96690db3679ffd0')}
          >
            FROM: 春风吹拂 fd0
          </Button>
          <Button
            className={styles.btn}
            type="primary"
            onClick={() => onSendMessage('642f043db47853baa1c9f85e')}
          >
            FROM: 春风沐雨 148
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
