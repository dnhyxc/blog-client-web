export const toolbars = [
  ['heading', 'bold', 'italic'],
  ['code', 'codeblock'],
  ['hr', 'quote', 'strike'],
  ['table', 'image', 'link'],
  ['ul', 'ol', 'indent', 'outdent', 'task'],
  ['scrollSync'],
  [
    {
      name: 'myItem',
      tooltip: 'myItem',
      command: 'italic',
      text: '@',
      className: 'toastui-editor-toolbar-icons',
      style: { backgroundImage: 'none', color: '#333', fontSize: '20px' },
    },
  ],
];
