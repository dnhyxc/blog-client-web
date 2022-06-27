// import React, { ReactNode } from "react";
// import { Scrollbars } from "react-custom-scrollbars";
// import classname from "classname";
// import styles from "./index.less";

// interface IProps {
//   children?: ReactNode;
//   height?: string;
//   needScroll?: boolean;
//   needPadding?: boolean;
//   autoHide?: boolean;
//   contentPadding?: string;
//   onScrollFrame?: Function;
//   scrollRef?: any;
//   noRightPadding?: boolean;
//   className?: string;
// }

// const Content: React.FC<IProps> = ({
//   children,
//   height,
//   needScroll = true,
//   needPadding = true,
//   autoHide = true,
//   contentPadding,
//   onScrollFrame,
//   scrollRef,
//   noRightPadding,
//   className,
// }) => {
//   return (
//     <div className={styles.container}>
//       <div
//         className={styles.wrap}
//         style={{
//           height,
//           padding: !needPadding ? 0 : noRightPadding ? "6px 0 6px 6px" : "6px",
//         }}
//       >
//         <div className={styles.content} style={{ padding: contentPadding }}>
//           {needScroll ? (
//             <Scrollbars
//               autoHide={autoHide}
//               className={styles.scroll}
//               onScrollFrame={onScrollFrame && onScrollFrame}
//               ref={scrollRef}
//             >
//               <div className={classname(styles.scrollContent, className)}>
//                 {children}
//               </div>
//             </Scrollbars>
//           ) : (
//             <div className={styles.noScroll}>{children}</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Content;

import React, { ReactNode } from "react";
import classname from "classname";
import { Scrollbars } from "react-custom-scrollbars";

import styles from "./index.less";

interface IProps {
  children: ReactNode;
  className?: string;
  wrapClassName?: string;
}

const Content: React.FC<IProps> = ({ children, className, wrapClassName }) => {
  return (
    <div className={styles.container}>
      <div className={classname(styles.wrap, wrapClassName)}>
        <Scrollbars autoHide>
          <div className={classname(styles.scrollWrap, className)}>
            {children}
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default Content;
