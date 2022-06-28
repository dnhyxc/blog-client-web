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
        <div className={classname(styles.scrollWrap, className)}>
          <Scrollbars autoHide>{children}</Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default Content;
