import { message } from 'antd';

class Message {
  success = (content: string, top?: number) => {
    message.success({
      content,
      style: {
        marginTop: `${top || 42}px`,
      },
    });
  };

  error = (content: string, top?: number) => {
    message.error({
      content,
      style: {
        marginTop: `${top || 42}px`,
      },
    });
  };

  info = (content: string, top?: number) => {
    message.info({
      content,
      style: {
        position: 'relative',
        marginTop: `${top || 42}px`,
      },
    });
  };

  warn = (content: string, top?: number) => {
    message.warn({
      content,
      style: {
        position: 'relative',
        marginTop: `${top || 42}px`,
      },
    });
  };
}

const { success, error, info, warn } = new Message();

export { success, error, info, warn };
