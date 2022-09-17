// 上传文件
const UPLOAD = '/api/upload';

// 用户注册
const REGISTER = '/api/register';
// 用户登录
const LOGIN = '/api/login';
// 更新用户信息
const UPDATE_INFO = '/api/updateInfo';
// 获取用户信息
const GET_USER_INFO = '/api/getUserInfo';
// 更改密码
const UPDATE_PASSWORD = '/api/updatePassword';
// 重置密码
const RESET_PASSWORD = '/api/resetPassword';

// 创建文章
const CREATE_ARTICLE = '/api/createArticle';
// 更新文章
const UPDATE_ARTICLE = '/api/updateArticle';
// 获取文章列表
const ARTICLE_LIST = '/api/articleList';
// 获取文章详情
const ARTICLE_DETAIL = '/api/articleDetail';
// 获取文章详情
const DELETE_ARTICLE = '/api/deleteArticle';
// 文章点赞
const LIKE_ARTICLE = '/api/likeArticle';
// 文章搜索
const SEARCH_ARTICLE = '/api/searchArticle';
// 文章搜索
const GET_ARTICLE_BY_RANDOM = '/api/getArticleByRandom';
// 文章草稿
const CREATE_DRAFT = '/api/createDraft';
// 更新文章草稿
const UPDATE_DRAFT = '/api/updateDraft';
// 获取草稿列表
const GET_DRAFT_LIST = '/api/getDraftList';
// 获取草稿详情
const GET_DRAFT_BY_ID = '/api/getDraftById';
// 获取草稿详情
const DELETE_DRAFT = '/api/deleteDraft';

// 评论
const COMMENTS = '/api/comments';
// 获取评论
const GET_COMMENT_LIST = '/api/getCommentList';
// 点赞
const GIVE_LIKE = '/api/giveLike';
// 删除评论
const DELETE_COMMENT = '/api/deleteComment';

// 获取文章分类
const GET_CLASSIFY_LIST = '/api/getClassifyList';
// 获取文章标签
const GET_TAG_LIST = '/api/getTagList';
// 获取文章分类
const GET_TIMELINE_LIST = '/api/getTimelineList';

// 获取我发布的文章列表
const GET_MY_ARTICLE_LIST = '/api/getMyArticleList';

// 获取我点赞的文章列表
const GET_LIKE_ARTICLE_LIST = '/api/getLikeArticleList';

// 获取我点赞的文章列表
const GET_AUTHOR_ARTICLE_LIST = '/api/getAuthorArticleList';

// 获取博主点赞的文章列表
const GET_AUTHOR_LIKE_ARTICLES = '/api/getAuthorLikeArticles';

// 获取博主点赞的文章列表
const GET_AUTHOR_TIMELINE = '/api/getAuthorTimeline';

// 获取博主点赞的文章列表
const DEL_ALL_ARTICLE = '/api/delAllArticle';

// 获取博主点赞的文章列表
const GET_PREV_ARTICLE = '/api/getPrevArticle';

// 获取博主点赞的文章列表
const GET_NEXT_ARTICLE = '/api/getNextArticle';

// 校验token是否过期
const VERIFY = '/api/verify';

export {
  REGISTER,
  LOGIN,
  UPDATE_INFO,
  ARTICLE_LIST,
  LIKE_ARTICLE,
  CREATE_ARTICLE,
  UPDATE_ARTICLE,
  UPLOAD,
  ARTICLE_DETAIL,
  COMMENTS,
  GET_COMMENT_LIST,
  GIVE_LIKE,
  DELETE_COMMENT,
  DELETE_ARTICLE,
  SEARCH_ARTICLE,
  CREATE_DRAFT,
  UPDATE_DRAFT,
  GET_DRAFT_LIST,
  GET_DRAFT_BY_ID,
  DELETE_DRAFT,
  GET_CLASSIFY_LIST,
  GET_TAG_LIST,
  GET_TIMELINE_LIST,
  GET_MY_ARTICLE_LIST,
  GET_LIKE_ARTICLE_LIST,
  GET_USER_INFO,
  UPDATE_PASSWORD,
  RESET_PASSWORD,
  GET_ARTICLE_BY_RANDOM,
  GET_AUTHOR_ARTICLE_LIST,
  GET_AUTHOR_LIKE_ARTICLES,
  GET_AUTHOR_TIMELINE,
  DEL_ALL_ARTICLE,
  GET_PREV_ARTICLE,
  GET_NEXT_ARTICLE,
  VERIFY,
};
