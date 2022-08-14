import { register, login, updateInfo, getUserInfo, updatePassword } from './user';
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
import { uploadFile } from './upload';

import { getMyArticleList } from './userInfo';

export {
  register,
  login,
  updateInfo,
  getUserInfo,
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
  uploadFile,
  updatePassword,
};
