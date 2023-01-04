import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import '@toast-ui/editor/dist/i18n/zh-cn';
import 'highlight.js/styles/github.css';
import 'prismjs/themes/prism-solarizedlight.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
// toolbar 文字颜色选项样式
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/chart/dist/toastui-chart.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import chart from '@toast-ui/editor-plugin-chart';
// import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import React, { useEffect } from 'react';
import classname from 'classname';
import Editor from '@toast-ui/editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import uml from '@toast-ui/editor-plugin-uml';
import Prism from 'prismjs';
import * as Service from '@/service';
import { normalizeResult } from '@/utils';
import { toolbars } from './toobars';
import styles from './index.less';

interface IProps {
  onGetMackdown: Function;
  initialValue?: string;
  onSaveDraft?: Function;
  siderVisible?: boolean;
  themeMode?: string;
  htmlWidth?: number;
}

const TuiEditor: React.FC<IProps> = ({
  initialValue,
  onGetMackdown,
  siderVisible,
  onSaveDraft,
  themeMode,
  htmlWidth = 0,
}) => {
  useEffect(() => {
    const editor: any = new Editor({
      el: document.querySelector('#editor')!,
      placeholder: '请输入文章内容',
      initialValue: initialValue || '',
      initialEditType: 'markdown',
      previewStyle: htmlWidth > 960 ? 'vertical' : 'tab', // 预览方式
      // previewStyle: "tab", // 预览方式
      language: 'zh-CN',
      height: '100%',
      previewHighlight: false, // 输入时是否高亮显示右侧预览区
      hideModeSwitch: true, // 不展示底部tab切换
      toolbarItems: toolbars,
      // theme: "dark",
      plugins: [
        chart,
        [codeSyntaxHighlight, { highlighter: Prism }],
        tableMergedCell,
        uml,
        colorSyntax,
      ],
      events: {
        change: () => {
          onGetMackdown && onGetMackdown(editor.getMarkdown());
        },
      },
      hooks: {
        addImageBlobHook: (fileOrBlob, callback) => {
          uploadImage(fileOrBlob, callback);
        },
      },
    });

    editor.insertToolbarItem(
      { groupIndex: htmlWidth > 960 ? 1 : 0, itemIndex: htmlWidth > 960 ? 6 : 1 },
      {
        name: 'myItem',
        // command: "code",
        el: createLastButton(),
      }
    );

    function createLastButton() {
      const button = document.createElement('button');
      button.className = 'toastui-editor-toolbar-icons last';
      button.style.backgroundImage = 'none';
      button.style.margin = '0';
      button.innerHTML = `<b style="font-size: 14px; color: #868686;">${
        htmlWidth > 960 ? 'JS' : '保存'
      }</b>`;
      button.addEventListener('click', () => {
        if (htmlWidth > 960) {
          // console.log(editor, '========');
          // const wwSelection = editor.getSelection();
          // console.log(wwSelection, 'wwSelection');
          editor.insertText('```js\n\n```');
          editor.moveCursorToStart(0);
          // editor.exec("code");
        } else {
          onSaveDraft && onSaveDraft();
        }
      });
      return button;
    }
  }, [initialValue, htmlWidth]);

  const uploadImage = async (file: Blob, callback: Function) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = normalizeResult<{ filePath: string }>(await Service.uploadFile(formData));
    if (res.success) {
      callback(res.data.filePath);
    }
  };

  return (
    <div
      className={classname(
        styles.editContainer,
        siderVisible && htmlWidth > 960 && styles.hidePadding,
        themeMode === 'dark' && styles.dark
      )}
      id="editor"
    />
  );
};

export default TuiEditor;
