// import React from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import classname from 'classname';
// import Image from '@/components/Image';
// import MIcons from '@/components/Icons';
// import useStore from '@/store';
// import { SSM } from '@/constant';
// import { ArticleItem } from '@/typings/common';
// import styles from './index.less';

// interface IProps {
//   list: ArticleItem[];
//   total?: number;
//   loading?: boolean;
//   toDetail?: Function;
//   deleteArticle?: Function;
//   likeArticle?: Function;
//   // eslint-disable-next-line no-unused-vars
//   removeArticle?: (id: string) => void;
//   onEditArticle?: Function;
//   // eslint-disable-next-line no-unused-vars
//   moveTo?(id: string): void;
//   skeletonRows?: number;
//   skeletonAvatar?: string;
//   noMoreStyle?: string;
//   htmlWidth?: number;
//   themeMode?: string;
//   fromPage?: boolean;
// }

// const CardItem: React.FC<IProps> = ({
//   list,
//   total,
//   loading,
//   toDetail,
//   likeArticle,
//   deleteArticle,
//   onEditArticle,
//   removeArticle,
//   moveTo,
//   themeMode,
//   htmlWidth = 0,
//   noMoreStyle,
//   skeletonRows = 3,
//   skeletonAvatar,
//   fromPage,
// }) => {
//   const {
//     userInfoStore: { getUserInfo },
//   } = useStore();
//   const navigate = useNavigate();
//   const [search] = useSearchParams();
//   const authorId = search.get('authorId');

//   const onEdit = (e: any, item: ArticleItem) => {
//     e.stopPropagation();
//     onEditArticle && onEditArticle(item.id);
//   };

//   const onDelete = (e: any, item: ArticleItem) => {
//     e.stopPropagation();
//     deleteArticle && deleteArticle(item.id);
//   };

//   const toClassify = (e: Event, classify: string) => {
//     e.stopPropagation();
//     navigate(`/classify?classify=${classify}`);
//   };

//   const toTagList = (e: MouseEvent, tag: string) => {
//     e.stopPropagation();
//     navigate(`/tag/list?tagName=${tag}`);
//   };

//   const toPersonal = (e: MouseEvent, id: string) => {
//     e.stopPropagation();
//     if (fromPage || id !== getUserInfo?.userId) {
//       window.location.href = `/personal?id=${id}`;
//       // navigate(`/personal?id=${id}&tab=1`);
//     } else {
//       navigate(`/personal?id=${id}`);
//     }
//   };

//   // 点击已下架文章
//   const onClickDelete = useDebounce(() => {
//     warn('该文章已下架');
//   }, 200);

//   return (
//     <div className={styles.itemWrap}>
//       {list?.length > 0 &&
//         list.map((i) => (
//           <div className={styles.cardItem}>
//             <div className={styles.imageWrap}>
//               <Image
//                 className={classname(styles.image)}
//                 url={i.coverImage || SSM}
//                 transitionImg={SSM}
//               />
//               <div className={styles.articleInfo}>
//                 <div className={styles.title}>title</div>
//                 <div className={styles.title}>desc</div>
//                 <div>info</div>
//                 <div className={styles.action}>
//                   <div className={styles.icons}>
//                     <div className={styles.iconList}>
//                       <MIcons
//                         name={`${i.isLike ? 'icon-24gf-thumbsUp2' : 'icon-24gl-thumbsUp2'}`}
//                         text={i.likeCount > 0 ? i.likeCount : '点赞'}
//                         iconWrapClass={styles.iconWrap}
//                         className={classname(
//                           i.isLike ? styles.isLike : null,
//                           themeMode === 'dark' && styles.darkText
//                         )}
//                         textStyle={themeMode === 'dark' && styles.darkText}
//                         onClick={() => likeArticle && likeArticle(i.id)}
//                       />
//                       <MIcons
//                         name="icon-comment"
//                         text={i.commentCount ? i.commentCount : '评论'}
//                         iconWrapClass={styles.iconWrap}
//                         onClick={() => toDetail && toDetail(i.id, true)}
//                         className={classname(themeMode === 'dark' && styles.darkText)}
//                         textStyle={themeMode === 'dark' && styles.darkText}
//                       />
//                       <MIcons
//                         name="icon-yanjing"
//                         text={i.readCount > 0 ? i.readCount : '阅读'}
//                         iconWrapClass={styles.iconWrap}
//                         className={(styles.eyes, themeMode === 'dark' && styles.darkText)}
//                         textStyle={themeMode === 'dark' && styles.darkText}
//                       />
//                     </div>
//                     {htmlWidth < 960 && (
//                       <div className={styles.classifyWrap}>
//                         <span
//                           onClick={(e) =>
//                             toPersonal(e as unknown as MouseEvent, i.authorId)
//                           }
//                         >
//                           {i?.authorName?.length > 10
//                             ? `${i?.authorName.slice(0, 10)}...`
//                             : i?.authorName}
//                         </span>
//                         <span
//                           className={classname(
//                             styles.classifyTag,
//                             themeMode === 'dark' && styles.darkClassifyTag
//                           )}
//                           onClick={(e) =>
//                             toClassify(e as unknown as MouseEvent, i.classify)
//                           }
//                         >
//                           {i.classify}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//     </div>
//   );
// };

// export default CardItem;
