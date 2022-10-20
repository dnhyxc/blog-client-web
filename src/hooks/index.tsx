import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from 'antd';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, Result } from '@/utils/tools';
import { error } from '@/utils';
import { PAGESIZE } from '@/constant';
import { close } from '@/components/Render';
import {
  ArticleDetailParams,
  ScrollEvent,
  useScrollLoadParams,
  useDeleteArticleParams,
  useDeleteTimelineParams,
  ArticleItem,
  TimelineResult,
  useLikeArticleParams,
  UseGetArticleDetailParams,
  ArticleListResult,
  UserInfoParams,
} from '@/typings/common';

// 防抖函数
export const useDebounce = (
  fn: Function,
  delay: number,
  dep?: any[],
  immediate: boolean = false
) => {
  const { current } = useRef<any>({ fn, timer: null, count: 0 });

  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  return useCallback((...args: any[]) => {
    if (immediate && current.count === 0) {
      current.fn(...args);
      current.count += 1;
    } else {
      if (current.timer) {
        clearTimeout(current.timer);
        // current.count = 0;
      }
      current.timer = setTimeout(() => {
        current.fn(...args);
        current.count += 1;
      }, delay);
    }
  }, dep || []);
};

// 节流函数
export const useThrottle = (fn: Function, delay: number, dep: any[] = []) => {
  const { current } = useRef<any>({ fn, timer: null });

  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  return useCallback((...args: any[]) => {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        delete current.timer;
      }, delay);
      current.fn(...args);
    }
  }, dep || []);
};

// 实时获取页面宽度的hooks
export const useHtmlWidth = () => {
  const [htmlWidth, setHtmlWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const onResize = useDebounce(
    () => {
      const width = window.innerWidth;
      setHtmlWidth(width);
    },
    100,
    []
  );

  return { htmlWidth };
};

export const useGetBodyWidth = () => {
  const [bodyWidth, setBodyWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    setBodyWidth(window.innerWidth);
  }, []);

  return { bodyWidth };
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
    if (!res.success && res.code !== 409 && res.code !== 401) {
      error(res.message);
    }
  };

  return { showAlert, toLogin, onCloseAlert, setAlertStatus, setResult };
};

// 是否需要滚动到评论输入框位置hooks
export const useScroll = (needScroll: string | null) => {
  const [commentOffsetTop, setCommentOffsetTop] = useState<number>(0);

  const commentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (commentRef && commentRef.current) {
      setCommentOffsetTop(commentRef.current.offsetTop);
    }
  }, [commentRef]);

  useEffect(() => {
    let timer: any = null;
    if (needScroll === '1') {
      if (timer) {
        clearInterval(timer);
      }
      timer = setTimeout(() => {
        document.documentElement.scrollTop = commentOffsetTop;
      }, 100);
    }
    return () => {
      clearInterval(timer);
    };
  }, [commentOffsetTop, needScroll]);

  return { commentRef, commentOffsetTop };
};

// 获取详情的hooks
export const useGetArticleDetail = ({
  id,
  draftArticleId,
  draftId,
  visible,
}: UseGetArticleDetailParams) => {
  const [detail, setDetail] = useState<ArticleDetailParams>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      getArticleDetail();
      return;
    }
    if (draftId) {
      getDraftById();
    }
  }, [id, draftId]);

  useEffect(() => {
    if (visible) {
      getDraftById();
    }
  }, [visible]);

  const getArticleDetail = async () => {
    setLoading(true);
    const res = normalizeResult<ArticleDetailParams>(
      await Service.getArticleDetail({ id: id! })
    );
    setLoading(false);
    if (res.success) {
      setDetail(res.data);
    } else {
      error(res.message);
    }
  };

  const getDraftById = async () => {
    setLoading(true);
    if (!draftId && !draftArticleId) return;
    const res = normalizeResult<ArticleDetailParams>(
      await Service.getDraftById({ id: draftId! || draftArticleId! })
    );
    setLoading(false);
    if (res.success) {
      setDetail(res.data);
    } else {
      error(res.message);
    }
  };

  return { detail, loading };
};

// 点赞hooks
export const useLikeArticle = ({
  setAlertStatus,
  articleList,
  updateList,
  isTimeLine,
  isAboutMe,
  listRef,
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

        listRef.current = list;

        // isAboutMe为true，就是用户自己的主页或博主自己进入博主主页，此时点赞需要删除取消点赞的文章
        if (isAboutMe) {
          const likes = list.filter((i) => i.isLike);
          listRef.current = likes;
          updateList({
            ...articleList,
            list: listRef.current,
          });
        } else {
          updateList({
            ...articleList,
            list: listRef.current,
          });
        }
      }
    }
    if (!res.success && res.code === 409) {
      setAlertStatus(true);
    }
    if (!res.success && res.code !== 409 && res.code !== 401) {
      error(res.message);
    }
  };

  return { likeArticle };
};

// 滚动加载自定义hooks
export const useScrollLoad = ({
  data,
  loading,
  pageSize,
  scrollStyle, // 如果需要吸顶，组件必须设置ref=scrollRef，且必须传入scrollStyle参数
}: useScrollLoadParams<any>) => {
  const [pageNo, setPageNo] = useState<number>(1);
  const [suckTop, setSuckTop] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState<number>(0);

  const scrollRef = useRef<any>(null);
  const scrollbarRef = useRef<any>(null);

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
    setScrollTop(scrollTop);
    if (
      !loading &&
      data?.count === pageSize &&
      data?.list?.length < data?.total &&
      Math.round(scrollTop) + clientHeight + 1 >= scrollHeight
    ) {
      setPageNo(pageNo + 1);
    }
  };

  return { pageNo, setPageNo, onScroll, scrollRef, suckTop, scrollbarRef, scrollTop };
};

// 删除文章hooks
export const useDeleteArticle = ({
  articleList,
  setArticleList,
  setAlertStatus,
  delType,
  listRef,
  pageNo,
  keyword, // 首页搜索输入内容
  filterList, // 高级搜索列表
  classify, // 文章分类页面搜索条件
  tagName, // 标签页选中的标签
  authorId, // 我的主页作者id
  accessUserId, // 我的主页登录人id
  authorPage, // 代表博主页面
  authorLike, // 代表博主页面博主点赞列表
  getCollectionTotal, // 获取收藏集总数的方法
}: useDeleteArticleParams) => {
  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  const deleteArticle = (id: string) => {
    Modal.confirm(modalConfig(id));
  };

  // 删除收藏集
  const delCollection = async (id: string) => {
    const res = normalizeResult<ArticleListResult>(
      await Service.delCollection({
        id,
        userId: getUserInfo?.userId,
        pageNo,
        pageSize: PAGESIZE,
      })
    );
    if (res.success) {
      const nextPageOne = res?.data?.list[0] || '';
      const list = articleList.list.filter((i) => i.id !== id);
      listRef.current = nextPageOne ? [...list, nextPageOne] : list;
      setArticleList({
        ...articleList,
        total: articleList.total - 1,
        list: listRef.current,
      });
      // 如果是收藏集tab，getCollectionTotal有值，需要实时获取删除后的收藏集总条数
      getCollectionTotal && getCollectionTotal();
    }
    return res;
  };

  // 删除文章
  const delArticle = async (articleId: string) => {
    const res = normalizeResult<ArticleListResult>(
      await Service.deleteArticle({
        articleId,
        pageNo,
        pageSize: PAGESIZE,
        keyword,
        classify,
        tagName,
        userId: authorId || getUserInfo?.userId,
        accessUserId,
        delType: delType === '2' ? delType : '',
        authorPage,
        authorLike,
        filterList,
      })
    );

    if (res.success) {
      const nextPageOne = res?.data?.list[0] || '';
      const list = articleList.list.filter((i) => i.id !== articleId);
      listRef.current = nextPageOne ? [...list, nextPageOne] : list;
      setArticleList({
        ...articleList,
        total: articleList.total - 1,
        list: listRef.current,
      });
    }
    return res;
  };

  const modalConfig = (articleId: string) => {
    return {
      title: delType !== '3' ? '确定删除该文章吗？' : '确定删除该收藏集吗？',
      content: delType === '3' ? '删除收藏集同时也会移除收藏集中的文章' : null,
      async onOk() {
        let res = {} as Result<{ id: string } | ArticleListResult>;
        if (delType !== '3') {
          res = await delArticle(articleId);
        } else {
          res = await delCollection(articleId);
        }

        if (!res.success && res.code === 409) {
          setAlertStatus(true);
        }
        if (!res.success && res.code !== 409 && res.code !== 401) {
          error(res.message);
        }
      },
    };
  };

  return { deleteArticle };
};

// 删除timeline文章hooks
export const useDeleteTimelineArticle = ({
  timelineList,
  setTimelineList,
  setAlertStatus,
}: useDeleteTimelineParams) => {
  const deleteTimeline = (articleId: string) => {
    Modal.confirm(modalConfig(articleId));
  };

  const modalConfig = (articleId: string) => {
    return {
      title: '确定删除该文章吗？',
      async onOk() {
        const res = normalizeResult<{ id: string }>(
          await Service.deleteArticle({ articleId, type: 'timeline' })
        );
        if (res.success) {
          const list = timelineList.map((i) => {
            if (i.articles.length) {
              const filterList = i.articles.filter((j) => j.id !== articleId);
              return {
                ...i,
                count: filterList.length,
                articles: filterList,
              };
            }
            return { ...i };
          });
          setTimelineList(list);
        }
        if (!res.success && res.code === 409) {
          setAlertStatus(true);
        }
        if (!res.success && res.code !== 409 && res.code !== 401) {
          error(res.message);
        }
      },
    };
  };

  return { deleteTimeline };
};

// 校验token是否过期的hook
export const useVerifyToken = () => {
  const { commonStore } = useStore();

  const navigate = useNavigate();

  const { pathname, search } = useLocation();

  useEffect(() => {
    verifyToken();

    let timer: any = null;
    timer = setTimeout(() => close(), 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const verifyToken = async () => {
    const res = normalizeResult<number>(await Service.verify());
    if (!res.success) {
      commonStore.setAuth({ redirectUrl: `${pathname}${search}` });
      navigate(`/login?verify=${pathname.slice(1)}`);
    }
  };
};

// 获取用户信息hook
export const useGetUserInfo = ({
  userId,
  authorId,
  clearInfo,
}: {
  userId: string;
  authorId: string;
  clearInfo?: boolean;
}) => {
  const [userInfo, setUserInfo] = useState<UserInfoParams | null>({ userId: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if ((userId === authorId || !userId) && clearInfo) {
      setUserInfo(null);
      return;
    }
    if (!userId) return;
    onGetPersonalInfo();
  }, [userId, authorId, clearInfo]);

  // 获取用户信息
  const onGetPersonalInfo = async () => {
    if (!userId) return;
    const res = normalizeResult<UserInfoParams>(
      await Service.getUserInfo({
        userId,
      })
    );
    if (res.success) {
      setUserInfo(res.data);
      return;
    }
    if (res.code === 406) {
      error(res.message);
      navigate('home');
    }
  };

  return { userInfo };
};
