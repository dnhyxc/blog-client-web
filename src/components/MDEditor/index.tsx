import React from 'react';
import { MdEditor, ToolbarNames } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import classname from 'classname';
import * as Service from '@/service';
import { normalizeResult } from '@/utils';
import { toolbars } from './toolbars';
import styles from './index.less';

interface IProps {
  onGetMackdown: Function;
  initialValue?: string;
  onSaveDraft?: Function;
  siderVisible?: boolean;
  themeMode?: string;
  htmlWidth?: number;
}

const MDEditor: React.FC<IProps> = ({
  initialValue,
  onGetMackdown,
  siderVisible,
  onSaveDraft,
  themeMode,
  htmlWidth = 0,
}) => {
  const onUploadImg = (files: File[], callback: Function) => {
    const formData = new FormData();
    files.map(async (i) => {
      formData.append('file', i);
      const res = normalizeResult<{ filePath: string }>(await Service.uploadFile(formData));
      callback([
        {
          url: res.data?.filePath,
          alt: i.name,
        },
      ]);
    });
  };

  const onContentChange = (value: string) => {
    onGetMackdown && onGetMackdown(value);
  };

  return (
    <div
      className={classname(
        styles.editContainer,
        siderVisible && htmlWidth > 960 && styles.hidePadding
      )}
    >
      <MdEditor
        value={initialValue}
        placeholder="请输入内容"
        theme={themeMode as 'dark' | 'light'} // 主题，默认light
        toolbars={toolbars as ToolbarNames[]}
        onChange={onContentChange}
        onUploadImg={onUploadImg}
      />
    </div>
  );
};
export default MDEditor;
