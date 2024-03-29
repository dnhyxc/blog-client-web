import React, { useEffect, useRef, useState } from 'react';
import { Button, Input } from 'antd';
import { useParams } from 'react-router-dom';
import classname from 'classname';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, error } from '@/utils';
import Image from '@/components/Image';
import { HEAD_UEL } from '@/constant';
import { sendMessage } from '@/socket';
import { ArticleDetailParams, CommentParams, ReplayCommentResult } from '@/typings/common';
import styles from './index.less';

const { TextArea } = Input;

interface IProps {
  showAvatar?: boolean;
  className?: string;
  selectComment?: CommentParams;
  isThreeTier?: boolean;
  onReplay?: Function;
  getCommentList?: Function;
  onHideInput?: Function;
  getAlertStatus?: Function;
  focus?: boolean;
  onJump?: Function;
  themeMode?: string;
  htmlWidth?: number;
  textAreaWrapH5?: string;
  emojiWrapH5?: string;
  detail?: ArticleDetailParams;
}

const DraftInput: React.FC<IProps> = ({
  showAvatar = true,
  className,
  selectComment,
  isThreeTier,
  onJump,
  onReplay,
  getCommentList,
  onHideInput,
  focus = true,
  getAlertStatus,
  themeMode,
  htmlWidth = 0,
  textAreaWrapH5,
  emojiWrapH5,
  detail,
}) => {
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');

  const { id } = useParams();

  const inputRef: any = useRef();

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  useEffect(() => {
    window.addEventListener('click', onClickNode);
    return () => {
      window.removeEventListener('click', onClickNode);
    };
  }, []);

  useEffect(() => {
    if (inputRef && inputRef.current && focus) {
      inputRef.current.focus({
        cursor: 'end',
      });
    }
  }, [inputRef, focus]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [keyword, inputRef]);

  // 监听是否是ctrl+enter组合键
  const onKeyDown = (event: any) => {
    if (event.ctrlKey && event.keyCode === 13) {
      submitComment();
      inputRef.current.blur();
    }
  };

  // window点击事件，判断点击的元素是否存在id，如果不存在则隐藏相关按钮或输入框
  const onClickNode = (e: any) => {
    if (!e.target.id) {
      setShowIcon(false);
      // 隐藏回复评论的输入框
      onHideInput && onHideInput();
    }
  };

  const onFocus = () => {
    setShowIcon(true);
  };

  // 输入框onchange事件
  const onCommentChange = (e: any) => {
    setKeyword(e.target.value);
  };

  // 发布评论
  const submitComment = async () => {
    if (!keyword.trim()) return;
    if (!getUserInfo) {
      getAlertStatus && getAlertStatus(true);
      onReplay && onReplay({}, true);
      setKeyword('');
      setShowIcon(false);
      return;
    }
    const params = {
      userId: getUserInfo?.userId,
      username: getUserInfo?.username,
      articleId: id || '',
      date: new Date().valueOf(),
      content: keyword,
      commentId: selectComment?.commentId,
      fromUsername: selectComment?.username,
      fromUserId: selectComment?.userId,
      formContent: selectComment?.content,
      fromCommentId: selectComment?.commentId,
    };

    if (!isThreeTier) {
      delete params.fromUsername;
      delete params.fromUserId;
      delete params.formContent;
      delete params.fromCommentId;
    }

    const res = normalizeResult<ReplayCommentResult>(await Service.releaseComment(params));

    onReplay && onReplay({}, true);
    setKeyword('');
    setShowIcon(false);

    if (res.success) {
      getCommentList && getCommentList();
      if (
        !isThreeTier &&
        !selectComment?.commentId &&
        detail &&
        getUserInfo?.userId! !== detail?.authorId &&
        getUserInfo?.userId !== detail?.authorId
      ) {
        const data = { ...detail };
        // @ts-ignore
        delete data.content;
        sendMessage(
          JSON.stringify({
            action: 'push',
            data: {
              ...data,
              toUserId: data?.authorId,
              articleId: data?.id,
              fromUsername: getUserInfo?.username,
              fromUserId: getUserInfo?.userId,
              action: 'COMMENT',
            },
            userId: getUserInfo?.userId,
          })
        );
      }
    }

    if (!res.success && res.code === 409) {
      getAlertStatus && getAlertStatus(true);
    }

    if (!res.success && res.code !== 409 && res.code !== 401) {
      error(res.message);
    }
  };

  return (
    <div className={styles.DraftInput} id="DRAFT_INPUT">
      {showAvatar && (
        <div id="COMMENTS" className={styles.comments}>
          评论
        </div>
      )}
      <div className={classname(className, styles.content)} id="CONTENT">
        {showAvatar && (
          <div className={styles.avatar} id="AVATAR">
            <Image
              url={getUserInfo?.headUrl || HEAD_UEL}
              transitionImg={HEAD_UEL}
              className={styles.image}
              id="IMAGE"
              onClick={onJump}
            />
          </div>
        )}
        <div className={styles.input} id="INPUT">
          <div
            className={classname(styles.textAreaWrap, textAreaWrapH5)}
            id="TEXTAREA_WRAP"
          >
            <TextArea
              placeholder={
                selectComment?.content
                  ? `回复 ${selectComment?.content}...`
                  : '请输入评论（Enter换行，Ctrl + Enter 发送）'
              }
              autoSize={{ minRows: 3 }}
              className={classname(
                styles.textArea,
                themeMode === 'dark' && styles.darkTextArea
              )}
              value={keyword}
              onFocus={onFocus}
              id="TEXTAREA_WRAP"
              ref={inputRef}
              onChange={onCommentChange}
            />
          </div>
          {(showIcon || !showAvatar) && (
            <div className={classname(styles.emojiWrap, emojiWrapH5)} id="EMOJI_WRAP">
              <div id="ICONFONT" className={styles.iconfontWrap}>
                <span
                  className={classname(styles.iconfont, 'iconfont icon-biaoqing-xue')}
                  id="BIAOQING_XUE"
                >
                  <span id="BIAOQING_XUE" className={styles.iconText}>
                    表情
                  </span>
                </span>
                <span
                  className={classname(styles.iconfont, 'iconfont icon-charutupian')}
                  id="CHARUTUPIAN"
                >
                  <span id="CHARUTUPIAN" className={styles.iconText}>
                    图片
                  </span>
                </span>
              </div>
              <div id="ACTION" className={themeMode === 'dark' ? styles.darkBtn : ''}>
                {htmlWidth > 960 && (
                  <span id="ENTER" className={styles.enter}>
                    Ctrl + Enter
                  </span>
                )}
                <Button
                  id="BTN"
                  type="primary"
                  disabled={!keyword.trim()}
                  onClick={submitComment}
                >
                  <span id="BTN">发表评论</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftInput;
