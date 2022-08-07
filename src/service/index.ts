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
};

export const upload = (params: any) => {
  console.log(params, 'params');
  return 'https://dnhyxc.gitee.io/img/dnhyxc.jpg';
};
