### 初始化项目

使用 `npm init -y` 生成 package.json 文件。

### 安装 webpack

```json
yarn add webpack webpack-cli webpack-dev-server -D
```

#### 创建 config 文件夹

在根目录创建 `config` 文件夹，并在其中创建如下文件：

- `webpack.common.js`：用于编写 webpack 公共配置。

- `webpack.dev.js`：用于配置 webpack 开发环境配置。

- `webpack.prod.js`：用于 webpack 打包配置。

#### 创建 public 文件夹

在根目录中创建 public 文件夹，并在其中创建 `index.html` 文件：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <title>dnhyxc</title>
  </head>
  <body translate="no">
    <div id="root"></div>
  </body>
</html>
```

#### 安装初始化所需插件

**webpack-merge**：用于合并两个 webpack 配置，如下用于在 webpack.dev.js 中合并 webpack.common.js 中的配置。

**html-webpack-plugin**：用于在指定的 html 模板文件中自动导入打包出来的 js 文件。

```json
yarn add webpack-merge html-webpack-plugin -D
```

### webpack 初始配置

#### 打包公共配置

webpack.common.config.js 文件初始内容：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    // 设置打包出来的 js 文件放置在 js 目录下
    filename: "js/[name]-bundle-[contenthash:6].js",
    path: path.resolve(__dirname, "../dist"),
    // 防止刷新页面后出现页面丢失报错！GET http://localhost:9000/home/js/bundle.js net::ERR_ABORTED 404 (Not Found)
    publicPath: "/",
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
      template: "public/index.html",
      filename: "index.html",
      // 配置浏览器标签图标
      favicon: "public/favicon.png",
      inject: "body",
      minify: {
        removeComments: true,
      },
    }),
  ],
};
```

- 在根目录中创建 src 文件夹，并在其中创建 `index.js` 文件：

```js
const root = document.getElementById("root");
console.log(root);
root.textContent = "hello word";
```

#### 生产打包配置

webpack.prod.js 文件初始内容：

```js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.config.js");

module.exports = merge(common, {
  mode: "production",
});
```

#### 开发打包配置

webpack.dev.js 文件初始内容：

```js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.config.js");
module.exports = merge(common, {
  mode: "development",
  devServer: {
    host: "localhost",
    port: "9102",
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
yarn add babel-loader @babel/core @babel/preset-react -D
```

#### 更新 webpack.common.config.js

在 `module {}` 中的 `rules []` 配置中增加编译 js 及 jsx 的配置：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"],
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
  "presets": ["@babel/preset-react"]
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
        use: ["babel-loader"],
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
import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  return (
    <div>
      <h2>hello word</h2>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
```

### 安装 TypeScript

#### 安装 @babel/preset-typescript

**@babel/preset-typescript**：该插件预设了一些 Babel 插件，主要负责编译 TypeScript 语法。

```json
yarn add @babel/preset-typescript @types/react @types/react-dom -D
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
  "presets": ["@babel/preset-react", "@babel/preset-typescript"]
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
import React from "react";

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
    index: "./src/index.tsx",
  },
  // ...
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
};
```

在与 plugins 配置同级配置下增加 **resolve** 配置，增加了该配置，在引入文件时就不需要写后缀了。就如上述 `src/index.tsx` 中导入 `./App` 文件一样，可以将 `.tsx` 后缀省略。

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.tsx",
  },
  // ...
  plugins: [
    // ...
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".less", ".scss"],
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
const { merge } = require("webpack-merge");
const common = require("./webpack.common.config.js");
module.exports = merge(common, {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(less)$/,
        use: ["style-loader", "css-loader", "less-loader", "postcss-loader"],
      },
      {
        test: /\.(scss)$/,
        use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
      },
    ],
  },
  devServer: {
    host: "localhost",
    port: "9102",
  },
});
```

#### 新建 Home.tsx 文件

在 src 目录中新建 src/Home.tsx 文件及 src/Home.css 文件：

- Home.tsx 文件内容如下：

```js
import React from "react";
import "./Home.css";

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
import React from "react";
import Home from "./Home";
import "./App.less";

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
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(less)$/,
        use: ["style-loader", "css-loader", "less-loader", "postcss-loader"],
      },
      {
        test: /\.(scss)$/,
        use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
      },
    ],
  },
  devServer: {
    host: "localhost",
    port: "9102",
  },
});
```

> postcss 需要在 css-loader 之前使用，由于 webpack loader 的使用顺序是遵循从右到左、从下到上的。所以 postcss-loader 必须要放在 css-loader 之后。放在 less-loader 或者 scss-loader 之前或者之后都可以。

#### 新增 postcss.config.js 文件

在根目录中增加 `postcss.config.js` 文件，具体内容如下：

```js
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8",
      ],
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
      use: ["style-loader", "css-loader", "postcss-loader"],
    },
    {
      test: /\.(less)$/,
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

> 如果你想为 CSS 也配置模块化导入，只需要在匹配 css 的地方加上与 less 下相同的配置即可。但这可能会引起第三方库时，使用非模块化导入其样式无法生效的问题。

#### 修改 App.tsx 文件

将样式的引入方式由原来的 `import "./App.less"` 改为：`import styles from "./App.less"`

```js
import React from "react";
import Home from "./Home";
import styles from "./App.less";

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

### 文件与字体引入配置

在开发过程中需要使用一些图片或者自定义字体，有的需求是直接引用静态服务器，有的是直接打包在工程中。所以需要对引入的图片后者字体做一些处理。

#### 安装相关依赖

**url-loader**：url-loader 会将引入的文件进行编码，生成 DataURL，相当于把文件翻译成了一串字符串，再把这个字符串打包到 JavaScript。

```json
yarn add file-loader url-loader -D
```

#### 新建 assets/images 文件夹

在 `assets/images` 文件夹下放入一张本地不图片，并在 `App.tsx` 中导入：

```js
import React from "react";
import Home from "./Home";
import styles from "./App.less";
import TEST_IMG from "./assets/images/test.jpg";

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

> 设置完毕之后，重启项目看是否能正常显示图片。

### 打包生成单独 css 文件

#### 安装 mini-css-extract-plugin

**mini-css-extract-plugin**：将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。

```json
yarn add mini-css-extract-plugin -D
```

#### 修改 webpack.prod.config.js

在生产打包配置中增加导入 `"mini-css-extract-plugin`：

```js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.config.js");

module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
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
        test: /\.less$/,
        exclude: [/node_modules/],
        use: [
          MiniCssExtractPlugin.loader,
          // 配置less模块化导入
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
              importLoaders: 1,
            },
          },
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 配置scss模块化导入
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: "local",
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
              importLoaders: 1,
            },
          },
          "postcss-loader",
          "sass-loader",
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
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  // ...
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style/[name].[hash:6].css",
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
const TerserPlugin = require("terser-webpack-plugin");

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
