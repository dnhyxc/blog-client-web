// 自定义工具栏类型
export type CustomToolbar = {
    id: 'clear' | 'draft' | 'save' | 'create' | 'preview' | 'runcode' | 'vscode';
    icon: string;
    title: string;
};

export const customToolbars: CustomToolbar[] = [
    {
        id: 'clear',
        title: '清空内容',
        icon: 'icon-youxiang5',
    },
    {
        id: 'draft',
        title: '草稿箱',
        icon: 'icon-youxiang5',
    },
    {
        id: 'save',
        title: '保存草稿',
        icon: 'icon-baocun',
    },
    {
        id: 'create',
        title: '创建文章',
        icon: 'icon-outline-designtools',
    },
    {
        id: 'preview',
        title: '预览文章',
        icon: 'icon-preview',
    },
    {
        id: 'runcode',
        title: '代码测试',
        icon: 'icon-debug-alt',
    },
    {
        id: 'vscode',
        title: '切换为vscode',
        icon: 'icon-codesandbox',
    },
];

export const toolbars = [
    'revoke',
    'next',
    '-',
    'title',
    'bold',
    'underline',
    'italic',
    'strikeThrough',
    '-',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    'sub',
    'sup',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    'emoji',
    '-',
    'preview',
    'previewOnly',
    '=',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
];
