import React from "react";

import styles from "./index.less";

interface IProps {}

const DraftInput: React.FC<IProps> = () => {
  return (
    <div className={styles.DraftInput}>
      <div>DraftInput</div>
    </div>
  );
};

export default DraftInput;
