### 初始化项目

使用 `npm init -y` 生成 package.json 文件。

### 安装 webpack

```json
yarn add webpack webpack-cli webpack-dev-server -D
```

#### 创建 config 文件夹

在根目录创建 `config` 文件夹，并在其中创建如下文件：

- `webpack.common.config.js`：用于编写 webpack 公共配置。

- `webpack.dev.config.js`：用于配置 webpack 开发环境配置。

- `webpack.prod.config.js`：用于 webpack 打包配置。

#### 创建 public 文件夹

在根目录中创建 public 文件夹，并在其中创建 `index.html` 文件：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using create-react-app" />
    <title>dnhyxc</title>
  </head>
  <body translate="no">
    <div id="root"></div>
  </body>
</html>
```

#### 安装初始化所需插件

**webpack-merge**：用于合并两个 webpack 配置，如下用于在 webpack.dev.config.js 中合并 webpack.common.config.js 中的配置。

**html-webpack-plugin**：用于在指定的 html 模板文件中自动导入打包出来的 js 文件。

```json
yarn add webpack-merge html-webpack-plugin -D
```

### webpack 初始配置

#### 打包公共配置

webpack.common.config.js 文件初始内容：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    // 设置打包出来的 js 文件放置在 js 目录下
    filename: 'js/[name]-bundle-[contenthash:6].js',
    path: path.resolve(__dirname, '../dist'),
    // 防止刷新页面后出现页面丢失报错！GET http://localhost:9000/home/js/bundle.js net::ERR_ABORTED 404 (Not Found)
    publicPath: '/',
  },
  plugins: [
    /**
     * HtmlWebpackPlugin 配置说明：
     *  template：基于我们自己定义的 html 文件为模板生成 html 文件
     *  filename：打包之后的 html 文件名字
     *  inject：将 js 文件注入到 body 最底部
     *  minify：压缩 html 文件时的配置
     *   - removeComments：去除注释
     */
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      // 配置浏览器标签图标
      favicon: 'public/favicon.png',
      inject: 'body',
      minify: {
        removeComments: true,
      },
    }),
  ],
};
```

- 在根目录中创建 src 文件夹，并在其中创建 `index.js` 文件：

```js
const root = document.getElementById('root');
console.log(root);
root.textContent = 'hello word';
```

#### 生产打包配置

webpack.prod.config.js 文件初始内容：

```js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'production',
});
```

#### 开发打包配置

webpack.dev.config.js 文件初始内容：

```js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.js');
module.exports = merge(common, {
  mode: 'development',
  devServer: {
    port: 9102,
    compress: true,
    // 设置 browserHistory 路由模式时，防止出现404的情况
    historyApiFallback: true,
    // 不将错误信息显示在浏览器中
    client: {
      overlay: false,
    },
  },
});
```

#### 修改 package.json 文件

在 scripts 属性中增加如下配置：

```json
"scripts": {
  "start": "webpack serve --config ./config/webpack.dev.config.js",
  "build": "webpack --config ./config/webpack.prod.config.js"
},
```

使用 `npm start` 命令启动项目，以及使用 `npm run build` 打包，看是否能正常运行。

### 安装相关 babel 插件

**@babel/core**：是 Babel 的核心库，所有的核心 Api 都在这个库里，这些 Api 供 babel-loader 调用。

**babel-loader**：@babel/core 在做 es6 的语法转换和弥补缺失的功能，但是在使用 webpack 打包 js 时，webpack 并不知道应该怎么去调用这些规则去编译 js。这时就需要 babel-loader 了，它作为一个中间桥梁，通过调用 babel/core 中的 api 来告诉 webpack 要如何处理 js。

**@babel/preset-react**：预设了一些 Babel 插件，主要负责编译 React 语法。

**@babel/preset-env**：转译 ES2015+ 语法转义为 ES2015 支持的语法。

**@babel/plugin-proposal-class-properties**：用来编译类(class)。

**@babel/plugin-transform-runtime**：防止污染全局，代码复用和减少打包体积。

```json
yarn add babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/plugin-transform-runtime @babel/plugin-proposal-class-properties -D
```

#### 更新 webpack.common.config.js

在 `module {}` 中的 `rules []` 配置中增加编译 js 及 jsx 的配置：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties',
              ],
            },
          },
        ],
      },
    ],
  },
};
```

除了上述写法之外，如果觉得 options 配置过于冗余，可以将 options 中的 presets 配置放到 **.babelrc** 文件中，此时就需要在项目根目录下创建一个 `.babelrc` 文件了，配置如下：

- .babelrc 配置：

```js
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
  ]
}
```

修改 webpack.common.config.js 文件，将 `babel-loader` 下的 options 配置去除：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
};
```

### 安装 React

```json
yarn add react react-dom
```

#### 修改 src/index.js

在 src/index.js 文件中加入 react 相关内容：

```js
import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div>
      <h2>hello word</h2>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### 安装 TypeScript

#### 安装 @babel/preset-typescript

**@babel/preset-typescript**：该插件预设了一些 Babel 插件，主要负责编译 TypeScript 语法。

```json
yarn add @babel/preset-typescript @types/react @types/react-dom -D

yarn add typescript
```

#### 增加 tsconfig.json 文件

在项目根目录下增加 tsconfig.json 文件，内容如下：

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "noImplicitAny": true, // 不允许隐式any类型
    "module": "esnext", // 模块引入方式
    "target": "es5", // 打包后编译成什么形式
    "jsx": "react-jsx", // 引入react
    "allowJs": true, // 在ts文件中允许引入js文件
    "moduleResolution": "node",
    "baseUrl": ".", // 引入模块的方式
    // 路径别名配置
    "paths": {
      "@/*": ["src/*"],
      "@styles/*": ["src/styles/*"]
    }
  },
  "include": ["./src/**/*", "./src/styles/**/*", "react-app-env.d.ts"],
  "exclude": ["node_modules", "dist"]
}
```

#### 修改 .babelrc 文件

在 presets 配置中增加编译 ts 的 @babel/preset-typescript 插件：

```js
{
  "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
  ]
}
```

#### 修改 src/index.js 文件

将 src/index.js 文件改为 `src/index.tsx` 文件，同时将 webpack.common.config.js 文件中的 `entry` 入口改为：`./src/index.tsx`。

- src/index.tsx：

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
```

在 src 中新增 `App.tsx` 文件，内容如下：

```js
import React from 'react';

const App = () => {
  return (
    <div>
      <h2>hello word</h2>
    </div>
  );
};

export default App;
```

#### 修改 webpack.common.config.js 文件

修改 `entry` 配置，并且增加编译 `ts | tsx` 的配置。

```js
module.exports = {
  entry: {
    index: './src/index.tsx',
  },
  // ...
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
};
```

在与 plugins 配置同级配置下增加 **resolve** 配置，增加了该配置，在引入文件时就不需要写后缀了。就如上述 `src/index.tsx` 中导入 `./App` 文件一样，可以将 `.tsx` 后缀省略。

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.tsx',
  },
  // ...
  plugins: [
    // ...
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.less', '.scss'],
  },
};
```

> 此时重启项目看是否能正常运行。

### 编译 css | less | sass 配置

#### 安装 css 相关插件

**style-loader**：通过一个 js 脚本创建一个 style 标签，里面包含一些样式。style-loader 是不能单独使用的，需要与 `css-loader` 一起使用。因为它并不负责解析 css 之前的依赖关系，每个 loader 的功能都是单一的，各自拆分独立。

**css-loader**：要在 js 中导入 css，就需要使用 css-loader 来识别这个模块，通过特定的语法规则进行转换内容最后导出。

```json
yarn add style-loader css-loader less less-loader sass sass-loader -D
```

#### 修改 webpack.dev.config.js 文件

在 webpack.common.config.js 文件中增加编译 css 的配置，如下：

```js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.js');
module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(css)$/,
        exclude: [/node_modules/],
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(less)$/,
        exclude: [/node_modules/],
        use: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader'],
      },
      {
        test: /\.(scss)$/,
        exclude: [/node_modules/],
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },
    ],
  },
  devServer: {
    port: 9102,
    compress: true,
    // 设置 browserHistory 路由模式时，防止出现404的情况
    historyApiFallback: true,
    // 不将错误信息显示在浏览器中
    client: {
      overlay: false,
    },
  },
});
```

#### 新建 Home.tsx 文件

在 src 目录中新建 src/Home.tsx 文件及 src/Home.css 文件：

- Home.tsx 文件内容如下：

```js
import React from 'react';
import './Home.css';

interface IProps {}

const Home: React.FC<IProps> = () => {
  return <div className="Home">Home Page</div>;
};

export default Home;
```

- Home.css 文件内容：

```css
.Home {
  font-size: 22px;
  color: red;
}
```

#### 新建 App.less 文件

在 src 目录下创建 App.less 文件，并在 App.tsx 中导入，内容如下：

- App.less 内容：

```css
.App {
  background-color: #efefef;

  .h2 {
    color: skyblue;
  }
}
```

- App.tsx 内容：

```js
import React from 'react';
import Home from './Home';
import './App.less';

const App = () => {
  return (
    <div className="App">
      <h2 className="h2">hello word</h2>
      <h2>hello TypeScript</h2>
      <Home />
    </div>
  );
};

export default App;
```

#### 新建 index.scss 文件

在 src 目录下创建 index.less 文件，并在 index.tsx 中导入，内容如下：

- index.scss 内容：

```css
body {
  margin: 0;
  padding: 0;

  #root {
    border: 1px solid rgb(255, 0, 183);
  }
}
```

- index.tsx 内容：

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
```

> 此时可以重启项目看是否正常运行了。

### 配置 PostCSS

PostCSS 是一个用 JavaScript 工具和插件转换 CSS 代码的工具，具体可点击 [postcss 官方文档](https://github.com/postcss/postcss/blob/main/docs/README-cn.md) 查看

#### 安装 postcss 相应依赖

**autoprefixer**：该插件能自动获取浏览器的流行度和能够支持的属性，并根据这些数据帮你自动为 CSS 规则添加前缀。如下：

```css
display: -webkit-box;
display: -webkit-flex;
display: -ms-flexbox;
display: flex;
-webkit-box-pack: justify;
// ...
```

```json
yarn add postcss-loader autoprefixer -D
```

#### 修改 webpack.dev.config.js

在编译 css | less | scss 的配置中分别增加 postcss-loader：

```js
module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(css)$/,
        exclude: [/node_modules/],
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(less)$/,
        exclude: [/node_modules/],
        use: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader'],
      },
      {
        test: /\.(scss)$/,
        exclude: [/node_modules/],
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },
    ],
  },
  devServer: {
    port: 9102,
    compress: true,
    // 设置 browserHistory 路由模式时，防止出现404的情况
    historyApiFallback: true,
    // 不将错误信息显示在浏览器中
    client: {
      overlay: false,
    },
  },
});
```

> **说明**：postcss 需要在 css-loader 之前使用，由于 webpack loader 的使用顺序是遵循从右到左、从下到上的。所以 postcss-loader 必须要放在 css-loader 之后。如果需要配置 antd 自定义主题，那么 postcss-loader 就必须放在 less-loader 之前，如果没有自定义 antd 主题的需求，则放在 less-loader 或者 scss-loader 之前或者之后都可以。

#### 新增 postcss.config.js 文件

在根目录中增加 `postcss.config.js` 文件，具体内容如下：

```js
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8'],
    },
  },
};
```

### 配置 less | scss 模块化导入

#### 修改 webpack.dev.config.js

在编译 `less` 及 `scss` 的 `css-loader` 下配置模块化，具体如下：

```js
module: {
  rules: [
    {
      test: /\.(css)$/,
      exclude: [/node_modules/],
      use: ["style-loader", "css-loader", "postcss-loader"],
    },
    {
      test: /\.(less)$/,
      exclude: [/node_modules/],
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "less-loader",
          // css 模块化配置
          options: {
            modules: {
              localIdentName: "[name]__[local]--[hash:base64:5]",
            },
            importLoaders: 1,
          },
        },
        "postcss-loader",
      ],
    },
    {
      test: /\.(scss)$/,
      exclude: [/node_modules/],
      use: [
        "style-loader",
        {
          loader: "css-loader",
          // css 模块化配置
          options: {
            modules: {
              localIdentName: "[name]__[local]--[hash:base64:5]",
            },
            importLoaders: 1,
          },
        },
        "less-loader",
        "postcss-loader",
      ],
    },
  ],
},
```

> 如果你想为 css 也配置模块化导入，只需要在匹配 css 的地方加上与 less 下相同的配置即可。但这可能会引起第三方库时，使用非模块化导入其样式无法生效的问题。

#### 修改 App.tsx 文件

将样式的引入方式由原来的 `import "./App.less"` 改为：`import styles from "./App.less"`

```js
import React from 'react';
import Home from './Home';
import styles from './App.less';

const App = () => {
  return (
    <div className={styles.App}>
      <h2 className={styles.h2}>hello word</h2>
      <h2>hello TypeScript</h2>
      <Home />
    </div>
  );
};

export default App;
```

#### 处理模块化导入样式引起的 ts 报错

使用模块化导入样式之后，ts 会报 “找不到模块“./App.less”或其相应的类型声明。ts(2307)” 的错误，此时需要在根目录下新建一个 `typescript.d.ts` 文件，文件名称可以随便取，但是必须以 `.d.ts` 结尾。文件建好之后，需要在其中定义如下声明：

```js
declare module "*.less";

declare module "*.scss";

declare module "*.css";
```

> 加上上述定义之后，报错就会消失，重启项目看是否能正常运行。

### 图片与字体引入配置

在开发过程中需要使用一些图片或者自定义字体，有的需求是直接引用静态服务器，有的是直接打包在工程中。所以需要对引入的图片后者字体做一些处理。

#### 资源模块

资源模块 (asset module) 是一种模块类型，它允许使用资源文件（字体，图标等）而**无需配置额外 loader**。

在 webpack 5 之前，通常使用：

- raw-loader 将文件导入为字符串。

- url-loader 将文件作为 data URI 内联到 bundle 中。

- file-loader 将文件发送到输出目录。

资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：

- asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。该配置可以用来加载图片资源或者 fonts 字体等，如加载 png、jpg、jpeg 或者 woff、woff2、eot、tff、otf 等。

- asset/inline 导出一个资源的 data URI（base64 格式）。之前通过使用 url-loader 实现。该配置可以用来加载 svg 图。

- asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。该配置可以用来加载 text 等文本文件。

- asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。小于 8kb 的文件，将会被视为 inline 模块类型，否则会被视为 resource 模块类型，可以在 webpack 配置的 module rule 层级中设置 Rule.parser.dataUrlCondition.maxSize 选项来修改此条件：

```js
module: {
  rules: [
    test: /\.jpg$/,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 4 * 1024 // 4kb
      }
    }
  ]
}

```

资源模块类型(asset module type) 基本配置：

- parser：用于指定转 base64 的条件。

- generator：用于指定文件打包输出的路径及文件名称。

```js
module: {
  rules: [
    {
      test: /\.(png|jpe?g|gif)$/i,
      exclude: /node_modules/,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 8 * 1024, // 8kb
        },
      },
      generator: {
        filename: 'assets/images/[name].[hash:6][ext]',
      },
    },
  ];
}
```

> 特别提示：上述加载图片、字体等资源的配置，不需要而外安装其它 loader。

#### 修改 webpack.common.config.js

```js
module: {
  // ...
  rules: [
    // ...
    {
      test: /\.(png|jpe?g|gif)$/i,
      exclude: /node_modules/,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 8 * 1024,
        },
      },
      generator: {
        filename: 'assets/images/[name].[contenthash:6][ext]',
      },
    },
    {
      test: /\.(ttf|woff|woff2|eot|otf)$/,
      type: 'asset/resource',
      exclude: /node_modules/,
      generator: {
        filename: 'assets/font/[name].[contenthash:8][ext]',
      },
    },
  ];
}
```

#### 新建 assets/images 文件夹

在 `assets/images` 文件夹下放入一张本地不图片，并在 `App.tsx` 中导入：

```js
import React from 'react';
import Home from './Home';
import styles from './App.less';
import TEST_IMG from './assets/images/test.jpg';

const App = () => {
  return (
    <div className={styles.App}>
      <h2 className={styles.h2}>hello word</h2>
      <h2>hello TypeScript</h2>
      <img src={TEST_IMG} alt="" />
      <Home />
    </div>
  );
};

export default App;
```

#### 修改 App.less 文件

在 `App.less` 文件中设置背景图片样式：

```css
.App {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #efefef;
  background: url('./assets/images/test.jpg');

  .h2 {
    color: skyblue;
  }
}
```

> 设置完毕之后，重启项目看 `App.tex` 及 `App.less` 中导入的图片是否都能正常显示图片。

#### 图片资源打包特别说明

如果打包图片资源时，依旧使用 `url-loader` 或者 `file-loader` 进行打包时，会导致在样式中采用 `background: url('./xxx')` 的方式导入背景图片失效，只能通过 js 导入背景图片才能生效，具体打包配置如下：

```js
module: {
  // ...
  rules: [
    // ...
    {
      test: /\.(png|jpe?g|gif)$/i,
      exclude: /node_modules/,
      loader: 'url-loader',
      options: {
        name: '[name].[contenthash:8].[ext]',
        outputPath: 'assets/images',
        limit: 8192,
      },
    },
  ];
}
```

`App.less` 样式配置如下：

```css
.App {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #efefef;
  background: url('./assets/images/test.jpg');

  .h2 {
    color: skyblue;
  }
}
```

`App.tsx` 内容如下：

```js
import React from 'react';
import Home from './Home';
import styles from './App.less';
import TEST_IMG from './assets/images/test.jpg';

const App = () => {
  return (
    <div className={styles.App}>
      <h2 className={styles.h2}>hello word</h2>
      <h2>hello TypeScript</h2>
      <img src={TEST_IMG} alt="" />
      <Home />
    </div>
  );
};

export default App;
```

> 此时启动项目，发现只有在 `App.tsx` 中导入的图片才嫩正常显示，而在 `App.less` 中导入的图片并未生效，此时查看打包出来的图片，发现在样式中打包出来的图片显示是一个二进制的图片无法显示。因此，**在 webpack5 中尽量使用资源模块去编译图片等资源**。

### 打包生成单独 css 文件

#### 安装 mini-css-extract-plugin

**mini-css-extract-plugin**：将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。

```json
yarn add mini-css-extract-plugin -D
```

#### 修改 webpack.prod.config.js

在生产打包配置中增加导入 `"mini-css-extract-plugin`：

```js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.less$/,
        exclude: [/node_modules/],
        use: [
          MiniCssExtractPlugin.loader,
          // 配置less模块化导入
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(sass|scss)$/,
        exclude: [/node_modules/],
        use: [
          MiniCssExtractPlugin.loader,
          // 配置scss模块化导入
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
});
```

#### 安装 rimraf

**rimraf**：以包的形式包装 rm -rf 命令，就是用来删除文件和文件夹的，不管文件夹是否为空，都可以删除。

```json
yarn add rimraf -D
```

#### 修改 package.json

在 `scripts` 脚本中增加开发环境打包配置，以及配置 `rimraf` 命令，在打包时先删除原有得 dist 包。

```json
"scripts": {
  "start": "webpack serve --config ./config/webpack.dev.config.js",
  "build": "rimraf dist && webpack --config ./config/webpack.prod.config.js",
  "build:dev": "rimraf dist && webpack --config ./config/webpack.dev.config.js",
},
```

> 上述所有配置都设置完毕之后，即可运行 `npm run build` 及 `npm run build:dev` 看是否能够普正常打包了，同时对比生产配置与开发配置得打包产物是否符合预期。

### CSS 代码压缩

#### 安装 css-minimizer-webpack-plugin

**css-minimizer-webpack-plugin**：该插件用于对 CSS 进行压缩。

- filename 属性：用与设置打包出来 css 文件放置在 style 目录下。

```json
yarn add css-minimizer-webpack-plugin -D
```

#### 修改 webpack.prod.config.js

在 `webpack.prod.config.js` 文件中导入 css-minimizer-webpack-plugin：

```js
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  // ...
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style/[name].[hash:6].css',
    }),
    new CssMinimizerWebpackPlugin(),
  ],
});
```

> 设置完毕之后，重新运行 `npm run build` 看样式是否被压缩。

### 压缩 JS

#### 安装 terser-webpack-plugin

**terser-webpack-plugin**：该插件用于压缩 js 文件。

```json
yarn add terser-webpack-plugin -D
```

#### 修改 webpack.prod.config.js

在 `webpack.prod.config.js` 文件中与 `plugins []` 同层级下增加 `optimization` 配置，具体如下：

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 多进程
        extractComments: false, // 删除注释
        terserOptions: {
          compress: {
            drop_console: true, // 去除log
          },
        },
      }),
    ],
  },
};
```

> 运行 `npm run build` 看 js 资源是否进行了压缩。

### 打包优化

#### 使用 Externals 减小打包体积

**Externals**：严格来说使用 Externals 并不是优化代码，而是将一些代码从输出的 bundle 中排除。因为 bundle 将代码排除，所以 bundle 体积会变小，但是 bundle 代码时需要这些依赖的。**这些依赖包需要通过 script 标签的形势引入到 html 文件中**。否则 bundle 将不能正常运行。

#### 修改 webpack.common.config.js

使用 `externals` 配置将 `react`、`react-dom` 从打包中排除：

```js
module.exports = {
  // ...
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
```

#### 修改 public/index.html

将 `react`、`react-dom` 同过 cdn 的形式引入，同时通过环境变量判断导入生产资源还是开发资源：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using create-react-app" />
    <title>dnhyxc</title>
    <% if (process.env.NODE_ENV === 'development') { %>
    <script src="https://cdn.staticfile.org/react/18.2.0/umd/react.development.js"></script>
    <script src="https://cdn.staticfile.org/react-dom/18.2.0/umd/react-dom.development.js"></script>
    <% } else { %>
    <script src="https://cdn.staticfile.org/react/18.2.0/umd/react.production.min.js"></script>
    <script src="https://cdn.staticfile.org/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
    <% } %>
  </head>
  <body translate="no">
    <div id="root"></div>
  </body>
</html>
```

### 缓存

#### 缓存第三方库

将第三方库（如 react）提取到单独的 vendor chunk 文件中是比较推荐的做法，这是因为它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用 client 的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资源，同时还能保证 client 代码和 server 代码版本一致。

#### 修改 webpack.common.config.js

在 webpack.common.config.js 中，与 `externals` 配置同级下增加 `optimization` 配置：

```js
module.exports = {
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  // 缓存配置
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
};
```

### antd 按需加载

#### 安装所需插件

```json
yarn add babel-plugin-import -D

yarn add antd
```

#### 修改 .babelrc 文件

在 `presets []` 配置同级下增加 `plugins []` 配置实现按需加载：

```js
{
  "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
    [
      "import",
      {
        "libraryName": "antd",
        "libraryDirectory": "es", // libraryDirectory 默认为 lib
        "style": true
      }
    ]
  ]
}
```

> 配置完毕之后，重启项目看按钮样式是否正常展示。

### 配置 antd 自定义主题

#### 修改 webpack.dev.config.js

在原有 `lees-loader` 下方新增加一个 `less-loader`，同时在匹配 `less` 资源的 loader 中加入自定义主题的相关配置。

使用两个 `less-loader` 的原因是因为：当同时开启 **less 模块化** 与 **antd 自定义主题** 时，会导致 antd 自定义主题失效，所以需要使用两个 less-loader 解决此问题。同时开启 antd 自定义主题的这个 less-loader 必须设置 `include: [/node_modules/]`，开启模块化的则设置为 `exclude: [/node_modules/]`，具体配置如下：

```js
module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      // ...
      /**
       * 该 less-loader 使用 exclude 排除 node_modules 中的组件库，只针对自己的代码开启 css 模块化
       */
      {
        test: /\.(less)$/,
        exclude: [/node_modules/],
        use: [
          'style-loader',
          // 配置less模块化导入
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.less$/,
        include: [/node_modules/],
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: true,
                modifyVars: {
                  'primary-color': '#1DA57A',
                  'link-color': '#1DA57A',
                  'border-radius-base': '2px',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      // ...
    ],
  },
});
```

> 说明：开启 antd 自定义主题时，`postcss-loader` 必须放在 `less-loader` 之上，否则将无法开启自定义主题，控制台将会报错。

#### 修改 webpack.prod.config.js

在 webpack.prod.config.js 之中加上与 webpack.dev.config.js 同样的 antd 自定义主题的配置，如下：

```js
module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      // ...
      /**
       * 该 less-loader 使用 exclude 排除 node_modules 中的组件库，只针对自己的代码开启 css 模块化
       */
      {
        test: /\.(less)$/,
        exclude: [/node_modules/],
        use: [
          MiniCssExtractPlugin.loader,
          // 配置less模块化导入
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.less$/,
        include: [/node_modules/],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: true,
                modifyVars: {
                  'primary-color': '#1DA57A',
                  'link-color': '#1DA57A',
                  'border-radius-base': '2px',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      // ...
    ],
  },
});
```

以上 antd 相关配置全部配置完毕之后，即可在 `Home.tsx` 中导入 antd 相关组件进行验证了：

```js
import React from 'react';
import { Button } from 'antd';
import './Home.css';

interface IProps {}

const Home: React.FC<IProps> = () => {
  return (
    <div className="Home">
      <Button type="primary">Home Page</Button>
    </div>
  );
};

export default Home;
```

> 以上设置都设置完毕之后，重启项目，看 antd 按钮样式是否生效，颜色如果为**绿色**而不是蓝色，那就说明自定义主题及 antd 按需加载都生效了。

### 配置路径别名

#### 修改 webpack.common.config.js 文件

在 webpack.common.config.js 中的 `resolve` 配置中增加 `alias` 配置：

```js
module.exports = {
  // ...
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@styles': path.resolve(__dirname, '../src/styles'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.less', '.scss'],
  },
};
```

#### 创建 src/components 文件

在 src 目录下 创建 `components` 文件，并在其中创建一个 `Test` 文件夹，在 Test 文件夹下新建一个 `index.tsx` 文件，文件内容如下：

```js
import React from 'react';
import { Button } from 'antd';

interface IProps {}

const Test: React.FC<IProps> = () => {
  return <Button type="link">Test</Button>;
};

export default Test;
```

在 `App.tsx` 中导入 `Test` 组件：

```js
// 通过路径别名导入 Test 组件
import Test from '@/components/Test';
import Home from './Home';
import styles from './App.less';
import TEST_IMG from './assets/images/test.jpg';

const App = () => {
  return (
    <div className={styles.App}>
      <h2 className={styles.h2}>hello word</h2>
      <h2>hello TypeScript</h2>
      <img src={TEST_IMG} alt="" />
      <Home />
      <Test />
    </div>
  );
};

export default App;
```

> 上述配置设置完毕之后，重启项目，看项目是否能正常运行。

### 配置 ESLint

#### 安装 eslint 相关插件

```json
yarn add eslint@latest eslint-loader eslint-webpack-plugin -D
```

#### 修改 webpack.common.config.js

在 webpack.common.config.js 增加 `ESLintPlugin`：

```js
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    // ...
    new ESLintPlugin(),
  ],
};
```

#### 新增 .eslintrc.json 文件

在根目录下新增 `.eslintrc.json` 文件，可以手动进行创建，也可以使用如下命令自动生成：

```json
npx eslint --init
```

运行 `npx eslint --init` 之后，具体选项选择如下：

- 第一步选择：> To check syntax, find problems, and enforce code style。

- 第二步选择：> JavaScript modules (import/export)。

- 第三步选择：> React。

- 第四步选择：> Does your project use TypeScript? » No / Yes，注意：选择 yes。

- 第五步选择：> Browser。

- 第六步选择：> Use a popular style guide。

- 第七步选择：> Airbnb。

- 第八步选择：> JSON。

- 第九步选择：> Would you like to install them now? » No / Yes，注意：选择 yes。

- 第十步选择：> Which package manager do you want to use? 自己根据情况选择 npm | yarn | pnpm。

> 执行完上述步骤之后，等待所需包安装完即可。

如果选择手动创建 `.eslintrc.json` 文件的话，需要自己手动安装如下插件：

```json
yarn add eslint-config-airbnb eslint-loader eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
```

> 上述两种方式，推荐使用 `npx eslint --init` 的方式自动生成 `.eslintrc.json` 文件，这样不容易遗漏安装所需要的插件。

#### 增加 .prettierrc 文件

在根目录下新增一个 `.prettierrc` 文件，用于设置 Prettier 格式化规则，使格式化好的内容不与 eslint 校验产生冲突，具体可自行根据 eslint 错误提示增加，如下：设置保存时使用单引号：

- .prettierrc 内容：

```json
{
  "singleQuote": true
}
```

#### 修改 .eslint.json 文件

.eslint.json 文件增加如下设置，其余设置可根据 eslint 提示自行决定是否开启校验，`0` 表示关闭校验。

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  // "plugin:import/typescript"：导入 ts|tsx 文件时，允许省略后缀
  "extends": ["plugin:react/recommended", "airbnb", "plugin:import/typescript"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint"],
  "rules": {
    // 关闭 This line has a length of 129. Maximum allowed is 100.
    "max-len": 0,
    // 关闭 'webpack-merge' should be listed in the project's dependencies, not devDependencies.
    "import/no-extraneous-dependencies": 0,
    // 关闭 Unexpected use of file extension "js" for "./webpack.common.config.js"
    "import/extensions": 0,
    // 关闭 Function component is not a function declaration
    "react/function-component-definition": [
      2,
      {
        "namedComponents": "arrow-function",
        "unnamedComponents": "arrow-function"
      }
    ],
    // 关闭 JSX not allowed in files with extension '.tsx'
    "react/jsx-filename-extension": [
      "error",
      { "extensions": [".ts", ".tsx", ".js", ".jsx"] }
    ],
    // 关闭 Unexpected block statement surrounding arrow body; move the returned value immediately after the `=>`.
    "arrow-body-style": 0,
    // 关闭结尾逗号校验
    "comma-dangle": 0
  }
}
```

#### 解决路径别名 eslint 报错

当通过路径别名引入组件时，eslint 会报 `Unable to resolve path to module`，为了解决该问题，需要借助如下插件：

```json
yarn add eslint-import-resolver-webpack -D
```

修改 `.eslint.json` 文件，增加一个与 `rules` 配置同级的 `settings` 配置：

```json
"settings": {
  "import/parsers": {
    "@typescript-eslint/parser": [".ts", ".tsx", ".jsx", ".js"]
  },
  "import/resolver": {
    "webpack": {
      "config": "./config/webpack.common.config.js"
    }
  }
}
```

#### eslint 编写过程中校验 TS

eslint 在代码编写时，默认不会对 ts 代码进行校验，如果需要在编写 ts 代码时，让 eslint 实时给出错误提示，需要进行如下设置：

- 打开 vscode 设置，在搜索栏中搜索 `Eslint: validate`，搜索到之后，点击 `Edit in setting.json`。

- 打开 Edit in setting.json 之后，在其中增加如下设置：

```json
{
  // ...
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

> 以上设置都设置完毕之后，关闭 vscode 重启，看是否有 eslint 错误提示。

### 配置 husky

#### 安装 husky

husky 可用于提交代码时进行 eslint 校验，如果有 eslint 报错可阻止代码提交。

```json
yarn add husky -D
```

#### 生成 .husky 文件

在 `package.json` 文件中增加如下两条脚本：

```json
{
  "scripts": {
    // ...
+   "prepare": "husky install",
+   "test": "npx eslint ./src  --ext ts,tsx,js,jsx"
  }
}
```

> 注意：`npx eslint ./src` 命令之后必须加上 `--ext ts,tsx,js,jsx` 配置，否则运行脚本时会出现找不到 src 的情况。

执行如下命令生成 `.husky` 文件，并在该文件夹下生成 `pre-commit` 文件：

> 注意：执行下述命令之前，必须要先使用 git init 创建 .git 文件，否则将会执行失败。

```json
npm run prepare

npx husky add .husky/pre-commit "npm test"
```

自动修复部分 eslint 报错，只需要在上述脚本的末尾加上 `--fix` 即可：

```js
npx eslint ./src --ext ts,tsx,js,jsx --fix
```

### webpack 其它配置

#### 

[代码分割](https://webpack.docschina.org/configuration/optimization/#optimizationsplitchunks)可将第三方库的代码进行分割，防止重复导入，从而减小打包体积，基本配置如下：

```js
// 缓存配置
optimization: {
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /node_modules/,
        name: 'vendor',
        chunks: 'all',
      },
    },
  },
},
```

#### 设置 webpack 控制台输出友好提示

安装 `friendly-errors-webpack-plugin` 插件：

```js
yarn add friendly-errors-webpack-plugin -D
```

修改 webpack.common.config.js 文件，增加 `FriendlyErrorsWebpackPlugin` 配置：

```js
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  plugins: [
    // ...
    new FriendlyErrorsWebpackPlugin(),
  ],

  // 精简控制台编译输出信息
  stats: {
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  },
};
```

#### webpack 编译百分比进度条

该配置不需要安装任何插件，只需要修改 `webpack.common.config.js`，增加如下 `plugins` 配置即可：

```js
const webpack = require('webpack');

module.exports = {
  plugins: [
    // ...
    new webpack.ProgressPlugin({
      activeModules: false,
      entries: true,
      modules: true,
      modulesCount: 5000,
      profile: false,
      dependencies: true,
      dependenciesCount: 10000,
      percentBy: 'entries',
    }),
  ],
};
```

#### webpack 编译条形进度条

安装如插件：

```json
yarn add webpackbar -D
```

修改 webpack.common.config.js 文件，增加 `WebpackBar` plugins 配置：

```js
const WebpackBar = require('webpackbar');

module.exports = {
  plugins: [
    // ...
    new WebpackBar(),
  ],
};
```

> 相比条形进度条，个人更推荐百分比进度条。

### webpack 完整代码

#### webpack.common.config.js

```js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// const WebpackBar = require('webpackbar');

module.exports = {
  entry: {
    index: './src/index.tsx',
  },
  output: {
    // 设置打包出来的 js 文件放置在 js 目录下
    filename: 'js/[name]-bundle-[contenthash:6].js',
    path: path.resolve(__dirname, '../dist'),
    // 防止刷新页面后出现页面丢失报错！GET http://localhost:9000/home/js/bundle.js net::ERR_ABORTED 404 (Not Found)
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          name: '[name].[contenthash:8].[ext]',
          outputPath: 'assets/images',
          limit: 8192,
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[contenthash:8].[ext]',
              outputPath: 'assets/fonts',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    /**
     * HtmlWebpackPlugin 配置说明：
     *  template：基于我们自己定义的 html 文件为模板生成 html 文件
     *  filename：打包之后的 html 文件名字
     *  inject：将 js 文件注入到 body 最底部
     *  minify：压缩 html 文件时的配置
     *   - removeComments：去除注释
     */
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      inject: 'body',
      minify: {
        removeComments: true,
      },
    }),
    new ESLintPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    // new WebpackBar(),
    new webpack.ProgressPlugin({
      activeModules: false,
      entries: true,
      modules: true,
      modulesCount: 5000,
      profile: false,
      dependencies: true,
      dependenciesCount: 10000,
      percentBy: 'entries',
    }),
  ],
  // 精简控制台编译输出信息
  stats: {
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@styles': path.resolve(__dirname, '../src/styles'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.less', '.scss'],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  // 解决警告：You can limit the size of your bundles by using import() or require.ensure to lazy load some parts of your application.
  performance: {
    hints: 'warning',
    // 入口起点的最大体积
    maxEntrypointSize: 50000000,
    // 生成文件的最大体积
    maxAssetSize: 30000000,
    // 只给出 js 文件的性能提示
    assetFilter(assetFilename) {
      return assetFilename.endsWith('.js');
    },
  },
};
```

#### webpack.dev.config.js

```js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(css)$/,
        exclude: [/node_modules/],
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      /**
       * 该 less-loader 使用 exclude 排除 node_modules 中的组件库，只针对自己的代码开启 css 模块化
       */
      {
        test: /\.(less)$/,
        exclude: [/node_modules/],
        use: [
          'style-loader',
          // 配置less模块化导入
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.less$/,
        include: [/node_modules/],
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: true,
                modifyVars: {
                  'primary-color': '#1DA57A',
                  'link-color': '#1DA57A',
                  'border-radius-base': '2px',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(scss)$/,
        exclude: [/node_modules/],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            // css 模块化配置
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
    ],
  },
  devServer: {
    port: 9102,
    compress: true,
    // 设置 browserHistory 路由模式时，防止出现404的情况
    historyApiFallback: true,
    // 不将错误信息显示在浏览器中
    client: {
      overlay: false,
    },
  },
});
```

#### webpack.prod.config.js

```js
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.less$/,
        exclude: [/node_modules/],
        use: [
          MiniCssExtractPlugin.loader,
          // 配置less模块化导入
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.less$/,
        include: [/node_modules/],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: true,
                modifyVars: {
                  'primary-color': '#1DA57A',
                  'link-color': '#1DA57A',
                  'border-radius-base': '2px',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 配置scss模块化导入
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 设置打包出来css文件放置在 style 目录下
      filename: 'style/[name].[hash:6].css',
    }),
    new CssMinimizerWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 多进程
        extractComments: false, // 删除注释
        terserOptions: {
          compress: {
            drop_console: true, // 去除log
          },
        },
      }),
    ],
  },
});
```

### 写在最后

[项目 git 地址：https://github.com/dnhyxc/webpack-config](https://github.com/dnhyxc/webpack-config)

文章到此就全部结束了，写的略微有点粗糙，请各位看官多多包含，如果有错误的地方，欢迎大家踊跃指正，在下感激不尽！
