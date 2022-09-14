### 项目目录结构

```
blog-client-web
├─ .babelrc babel配置
├─ .eslintrc.json eslint配置文件
├─ .gitignore
├─ .husky husky配置
│  ├─ pre-commit
│  └─ _
│     ├─ .gitignore
│     └─ husky.sh
├─ .prettierrc  prettier代码格式化配置
├─ config webpack配置
│  ├─ webpack.common.config.js
│  ├─ webpack.dev.config.js
│  └─ webpack.prod.config.js
├─ config.md
├─ package.json
├─ postcss.config.js  postcss配置
├─ public
│  ├─ favicon.png
│  └─ index.html
├─ README.md
├─ release.md
├─ src
│  ├─ assets  静态资源
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
│  │  ├─ Access 权鉴组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Alert  alert组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ AnotherArticle 上下篇文章组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ ArticleToc 文章目录组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ BackTop  回到顶部
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Card 卡片组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Comments 评论组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Confirm  自定义confirm组件
│  │  │  ├─ confirm.tsx
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Content  容器组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Decorator  装饰组件
│  │  │  ├─ index.scss
│  │  │  └─ index.tsx
│  │  ├─ DraftInput 富文本输入框组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Empty  空状态组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Footer 页脚组件
│  │  │  ├─ index.less
│  │  │  ├─ index.tsx
│  │  │  └─ Menu
│  │  │     ├─ index.less
│  │  │     └─ index.tsx
│  │  ├─ Header 头部组件
│  │  │  ├─ index.less
│  │  │  ├─ index.tsx
│  │  │  ├─ Menu
│  │  │  │  ├─ index.less
│  │  │  │  └─ index.tsx
│  │  │  └─ User  头部头像组件
│  │  │     ├─ index.less
│  │  │     └─ index.tsx
│  │  ├─ Icons  图标组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Image  图片展示组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ MDropdown  下拉选择组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ MenuList 左侧菜单组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ MSearch  搜索组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ Preview  富文本预览组件
│  │  │  ├─ index.less
│  │  │  ├─ index.tsx
│  │  │  └─ readme.md
│  │  ├─ RightBar 右侧展示列组件
│  │  │  ├─ AboutMe
│  │  │  │  ├─ index.less
│  │  │  │  └─ index.tsx
│  │  │  ├─ index.less
│  │  │  ├─ index.tsx
│  │  │  ├─ Introduction  博主信息组件
│  │  │  │  ├─ index.less
│  │  │  │  └─ index.tsx
│  │  │  └─ RecommendArticle  文章推荐组件
│  │  │     ├─ index.less
│  │  │     └─ index.tsx
│  │  ├─ Segmented  分段控制器组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ TuiEditor  markdown编辑组件
│  │  │  ├─ index.less
│  │  │  ├─ index.md
│  │  │  ├─ index.tsx
│  │  │  └─ toobars.ts
│  │  ├─ Upload  文件上传组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  ├─ WordCloud  词云组件
│  │  │  ├─ index.less
│  │  │  └─ index.tsx
│  │  └─ WordList  h5词云组件
│  │     ├─ index.less
│  │     └─ index.tsx
│  ├─ constant  全局通用变量声明文件
│  │  └─ index.ts
│  ├─ hooks  自定义hooks
│  │  └─ index.tsx
│  ├─ index.less
│  ├─ index.tsx 项目入口文件
│  ├─ layout  项目布局组件
│  │  ├─ index.less
│  │  └─ index.tsx
│  ├─ router  项目路由配置
│  │  ├─ config.tsx
│  │  ├─ index.less
│  │  ├─ index.tsx
│  │  └─ menu.tsx
│  ├─ service  API文件
│  │  ├─ api.ts
│  │  ├─ article.ts
│  │  ├─ index.ts
│  │  ├─ upload.ts
│  │  ├─ user.ts
│  │  └─ userInfo.ts
│  ├─ store  mobx状态管理组件
│  │  ├─ common.ts
│  │  ├─ create.ts
│  │  ├─ detail.ts
│  │  ├─ index.ts
│  │  └─ user.ts
│  ├─ styles  全局公共样式配置
│  │  ├─ common.less
│  │  └─ layout.less
│  ├─ typings  ts全局类型声明文件
│  │  ├─ common.d.ts
│  │  ├─ component.d.ts
│  │  └─ index.d.ts
│  ├─ utils  全局公共工具文件
│  │  ├─ crypto.ts
│  │  ├─ index.ts
│  │  ├─ message.ts
│  │  ├─ request.ts
│  │  ├─ storage.ts
│  │  ├─ tools.ts
│  │  └─ urlTool.ts
│  └─ view
│     ├─ author  关于作者页面
│     │  ├─ index.less
│     │  └─ index.tsx
│     ├─ classify  文章分类页面
│     │  ├─ index.less
│     │  └─ index.tsx
│     ├─ create  文章创建页面
│     │  ├─ DraftPopover
│     │  │  ├─ index.less
│     │  │  └─ index.tsx
│     │  ├─ index.less
│     │  ├─ index.tsx
│     │  └─ ReleaseModel
│     │     ├─ index.less
│     │     └─ index.tsx
│     ├─ detail  文章详情页面
│     │  ├─ index.less
│     │  └─ index.tsx
│     ├─ home  首页页面
│     │  ├─ index.less
│     │  └─ index.tsx
│     ├─ login  登录页面
│     │  ├─ index.less
│     │  └─ index.tsx
│     ├─ personal  我的主页页面
│     │  ├─ index.less
│     │  └─ index.tsx
│     ├─ setting  设置页面
│     │  ├─ account  账号设置页面
│     │  │  ├─ index.less
│     │  │  └─ index.tsx
│     │  ├─ index.less
│     │  ├─ index.tsx
│     │  └─ profile  个人设置页面
│     │     ├─ index.less
│     │     └─ index.tsx
│     ├─ tag  标签分类页面
│     │  ├─ index.less
│     │  ├─ index.tsx
│     │  └─ List
│     │     ├─ index.less
│     │     └─ index.tsx
│     └─ timeline  时间轴页面
│        ├─ index.less
│        └─ index.tsx
├─ tsconfig.json  ts配置页面
└─ yarn.lock

```
