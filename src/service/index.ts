import { register, login, updateInfo } from './user';
import {
  getArticleList,
  createArticle,
  updateArticle,
  searchArticle,
  getArticleDetail,
  releaseComment,
  getCommentList,
  giveLike,
  deleteComment,
  deleteArticle,
  likeArticle,
  getClassifyList,
  getTagList,
  getTimelineList,
} from './article';

import { getMyArticleList } from './userInfo';

export {
  register,
  login,
  updateInfo,
  getArticleList,
  createArticle,
  updateArticle,
  searchArticle,
  getArticleDetail,
  releaseComment,
  getCommentList,
  giveLike,
  deleteComment,
  deleteArticle,
  likeArticle,
  getClassifyList,
  getTagList,
  getTimelineList,
  getMyArticleList,
};

export const upload = (params: any) => {
  console.log(params, 'params');
  return 'https://dnhyxc.gitee.io/img/dnhyxc.jpg';
};
