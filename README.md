### 项目目录结构

```
blog-client-web
├─ .babelrc
├─ .eslintrc.json
├─ .gitignore
├─ .husky
│  ├─ pre-commit
│  └─ _
│     ├─ .gitignore
│     └─ husky.sh
├─ .prettierrc
├─ config
│  ├─ webpack.common.config.js
│  ├─ webpack.dev.config.js
│  └─ webpack.prod.config.js
├─ config.md
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ favicon.png
│  └─ index.html
├─ README.md
├─ release.md
├─ src
│  ├─ assets
│  │  ├─ iconfont
│  │  │  ├─ iconfont.css
│  │  │  ├─ iconfont.ttf
│  │  │  ├─ iconfont.woff
│  │  │  └─ iconfont.woff2
│  │  └─ images
│  │     ├─ about_me.jpg
│  │     ├─ card.png
│  │     ├─ empty.jpg
│  │     ├─ header.jpg
│  │     └─ mainCover.png
│  ├─ components
│  │  ├─ Access
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Alert
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ AnotherArticle
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ ArticleToc
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ BackTop
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Card
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Comments
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Confirm
│  │  │  ├─ confirm.tsx
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Content
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Decorator
│  │  │  ├─ index.scss
│  │  │  └─ index.tsx
│  │  ├─ DraftInput
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Empty
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Footer
│  │  │  ├─ index.less
│  │  │  ├─ index.tsx
│  │  │  └─ Menu
│  │  │     ├─ index.less
│  │  │     └─ index.tsx
│  │  ├─ Header
│  │  │  ├─ index.less
│  │  │  ├─ index.tsx
│  │  │  ├─ Menu
│  │  │  │  ├─ index.less
│  │  │  │  └─ index.tsx
│  │  │  └─ User
│  │  │     ├─ index.less
│  │  │     └─ index.tsx
│  │  ├─ Icons
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Image
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ MDropdown
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ MenuList
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ MSearch
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Preview
│  │  │  ├─ index.less
│  │  │  ├─ index.tsx
│  │  │  └─ readme.md
│  │  ├─ RightBar
│  │  │  ├─ AboutMe
│  │  │  │  ├─ index.less
│  │  │  │  └─ index.tsx
│  │  │  ├─ index.less
│  │  │  ├─ index.tsx
│  │  │  ├─ Introduction
│  │  │  │  ├─ index.less
│  │  │  │  └─ index.tsx
│  │  │  └─ RecommendArticle
│  │  │     ├─ index.less
│  │  │     └─ index.tsx
│  │  ├─ Segmented
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ TuiEditor
│  │  │  ├─ index.less
│  │  │  ├─ index.md
│  │  │  ├─ index.tsx
│  │  │  └─ toobars.ts
│  │  ├─ Upload
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ WordCloud
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  └─ WordList
│  │     ├─ index.less
│  │     └─ index.tsx
│  ├─ constant
│  │  └─ index.ts
│  ├─ hooks
│  │  └─ index.tsx
│  ├─ index.less
│  ├─ index.tsx
│  ├─ layout
│  │  ├─ index.less
│  │  └─ index.tsx
│  ├─ router
│  │  ├─ config.tsx
│  │  ├─ index.less
│  │  ├─ index.tsx
│  │  └─ menu.tsx
│  ├─ service
│  │  ├─ api.ts
│  │  ├─ article.ts
│  │  ├─ index.ts
│  │  ├─ upload.ts
│  │  ├─ user.ts
│  │  └─ userInfo.ts
│  ├─ store
│  │  ├─ common.ts
│  │  ├─ create.ts
│  │  ├─ detail.ts
│  │  ├─ index.ts
│  │  └─ user.ts
│  ├─ styles
│  │  ├─ common.less
│  │  └─ layout.less
│  ├─ typings
│  │  ├─ common.d.ts
│  │  ├─ component.d.ts
│  │  └─ index.d.ts
│  ├─ utils
│  │  ├─ crypto.ts
│  │  ├─ index.ts
│  │  ├─ message.ts
│  │  ├─ request.ts
│  │  ├─ storage.ts
│  │  ├─ tools.ts
│  │  └─ urlTool.ts
│  └─ view
│     ├─ author
│     │  ├─ index.less
│     │  └─ index.tsx
│     ├─ classify
│     │  ├─ index.less
│     │  └─ index.tsx
│     ├─ create
│     │  ├─ DraftPopover
│     │  │  ├─ index.less
│     │  │  └─ index.tsx
│     │  ├─ index.less
│     │  ├─ index.tsx
│     │  └─ ReleaseModel
│     │     ├─ index.less
│     │     └─ index.tsx
│     ├─ detail
│     │  ├─ index.less
│     │  └─ index.tsx
│     ├─ home
│     │  ├─ index.less
│     │  └─ index.tsx
│     ├─ login
│     │  ├─ index.less
│     │  └─ index.tsx
│     ├─ personal
│     │  ├─ index.less
│     │  └─ index.tsx
│     ├─ setting
│     │  ├─ account
│     │  │  ├─ index.less
│     │  │  └─ index.tsx
│     │  ├─ index.less
│     │  ├─ index.tsx
│     │  └─ profile
│     │     ├─ index.less
│     │     └─ index.tsx
│     ├─ tag
│     │  ├─ index.less
│     │  ├─ index.tsx
│     │  └─ List
│     │     ├─ index.less
│     │     └─ index.tsx
│     └─ timeline
│        ├─ index.less
│        └─ index.tsx
├─ tsconfig.json
└─ yarn.lock

```
