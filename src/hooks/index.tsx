import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message, Modal } from 'antd';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import {
  ArticleDetailParams,
  ScrollEvent,
  useScrollLoadParams,
  useDeleteArticleParams,
  ArticleItem,
  TimelineResult,
} from '@/typings/common';

// 实时获取页面宽度的hooks
export const useHtmlWidth = () => {
  const [htmlWidth, setHtmlWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const onResize = () => {
    const width = window.innerWidth;
    setHtmlWidth(width);
  };

  return { htmlWidth };
};

// 获取登录状态的hooks
export const useLoginStatus = () => {
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { commonStore } = useStore();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const onCloseAlert = () => {
    setShowAlert(false);
  };

  const setAlertStatus = (status: boolean) => {
    setShowAlert(status);
  };

  const toLogin = () => {
    commonStore.setAuth({ redirectUrl: `${pathname}${search}` });
    navigate('/login', { replace: true });
  };

  const setResult = (res: any, callback?: Function) => {
    if (res.success) {
      callback && callback();
    }
    if (!res.success && res.code === 409) {
      setAlertStatus(true);
    }
    if (!res.success && res.code !== 409) {
      message.error(res.message);
    }
  };

  return { showAlert, toLogin, onCloseAlert, setAlertStatus, setResult };
};

// 是否需要滚动到评论输入框位置hooks
export const useScroll = (needScroll: string | null) => {
  const [commentOffsetTop, setCommentOffsetTop] = useState<number>(0);

  const commentRef: any = useRef(null);

  useEffect(() => {
    if (commentRef && commentRef.current) {
      setCommentOffsetTop(commentRef.current.offsetTop);
    }
  }, [commentRef]);

  useEffect(() => {
    if (needScroll === '1') {
      document.documentElement.scrollTop = commentOffsetTop;
    }
  }, [commentOffsetTop, needScroll]);

  return { commentRef, commentOffsetTop };
};

// 获取详情的hooks
export const useGetArticleDetail = (id: string | null | undefined) => {
  const [detail, setDetail] = useState<ArticleDetailParams>();

  useEffect(() => {
    if (id) {
      getArticleDetail();
    }
  }, [id]);

  const getArticleDetail = async () => {
    const res = normalizeResult<ArticleDetailParams>(
      await Service.getArticleDetail({ id: id! })
    );
    if (res.success) {
      setDetail(res.data);
    } else {
      message.error(res.message);
    }
  };

  return { detail };
};

interface useLikeArticleParams {
  // eslint-disable-next-line no-unused-vars
  setAlertStatus: (status: boolean) => void;
  articleList: any;
  updateList: Function;
  isTimeLine?: boolean;
  isAboutMe?: boolean;
}

// 点赞hooks
export const useLikeArticle = ({
  setAlertStatus,
  articleList,
  updateList,
  isTimeLine,
  isAboutMe,
}: useLikeArticleParams) => {
  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  // 文章点赞
  const likeArticle = async (id: string) => {
    if (!getUserInfo) {
      setAlertStatus(true);
      return;
    }

    const res = normalizeResult<{ id: string; isLike: boolean }>(
      await Service.likeArticle({ id, userId: getUserInfo.userId })
    );

    if (res.success) {
      const { id, isLike } = res.data;
      if (isTimeLine) {
        const cloneArticles: TimelineResult[] = JSON.parse(JSON.stringify(articleList));

        const timelineList = cloneArticles.map((i) => {
          i.articles.forEach((j) => {
            if (j.id === id) {
              j.isLike = res.data.isLike;
              if (isLike) {
                j.likeCount += 1;
              } else {
                j.likeCount > 0 ? (j.likeCount -= 1) : (j.likeCount = 0);
              }
            }
          });
          return i;
        });

        updateList(timelineList);
      } else {
        const cloneList: ArticleItem[] = JSON.parse(JSON.stringify(articleList.list));

        const list = cloneList.map((i) => {
          if (i.id === id) {
            i.isLike = res.data.isLike;
            if (isLike) {
              i.likeCount += 1;
            } else {
              i.likeCount > 0 ? (i.likeCount -= 1) : (i.likeCount = 0);
            }
          }
          return i;
        });

        if (isAboutMe) {
          const likes = list.filter((i) => i.isLike);
          updateList({
            ...articleList,
            total: likes.length,
            list: likes,
          });
        } else {
          updateList({
            ...articleList,
            list,
          });
        }
      }
    }
    if (!res.success && res.code === 409) {
      setAlertStatus(true);
    }
    if (!res.success && res.code !== 409) {
      message.error(res.message);
    }
  };

  return { likeArticle };
};

// 滚动加载自定义hooks
export const useScrollLoad = ({
  data,
  loading,
  pageSize,
  scrollStyle,
}: useScrollLoadParams<any>) => {
  const [pageNo, setPageNo] = useState<number>(1);
  const [suckTop, setSuckTop] = useState<boolean>(false);

  const scrollRef = useRef<any>(null);

  const addClassName = (scrollTop: number, scrollRef: any) => {
    if (!scrollStyle) return;
    if (scrollTop >= scrollRef?.current?.offsetTop) {
      setSuckTop(true);
      scrollRef?.current?.classList?.add(scrollStyle);
    } else {
      setSuckTop(false);
      scrollRef?.current?.classList?.remove(scrollStyle);
    }
  };

  // 滚动加载
  const onScroll = (event: ScrollEvent) => {
    const { scrollTop, scrollHeight, clientHeight } = event;
    // 元素吸顶控制器
    addClassName(scrollTop, scrollRef);
    if (
      !loading &&
      data?.count === pageSize &&
      data?.list?.length < data?.total &&
      Math.round(scrollTop) + clientHeight + 1 >= scrollHeight
    ) {
      setPageNo(pageNo + 1);
    }
  };

  return { pageNo, setPageNo, onScroll, scrollRef, suckTop };
};

// 删除文章hooks
export const useDeleteArticle = ({
  articleList,
  setArticleList,
  getArticleList,
  setAlertStatus,
}: useDeleteArticleParams) => {
  const deleteArticle = (articleId: string) => {
    Modal.confirm(modalConfig(articleId));
  };

  const modalConfig = (articleId: string) => {
    return {
      title: '确定删除该文章吗？',
      async onOk() {
        const res = normalizeResult<{ id: string }>(
          await Service.deleteArticle({ articleId })
        );
        if (res.success) {
          const list = articleList.list.filter((i) => i.id !== articleId);
          setArticleList({
            ...articleList,
            total: articleList.total - 1,
            list,
          });
        } else {
          if (res.success) {
            getArticleList && getArticleList();
          }
          if (!res.success && res.code === 409) {
            setAlertStatus(true);
          }
          if (!res.success && res.code !== 409) {
            message.error(res.message);
          }
        }
      },
    };
  };

  return { deleteArticle };
};
