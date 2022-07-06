### 初始化项目

使用 `npm init -y` 生成 package.json 文件。

### 安装 webpack

```json
yarn add webpack webpack-cli webpack-dev-server -D
```

### 创建 config 文件夹

在根目录创建 `config` 文件夹，并在其中创建如下文件：

- `webpack.common.js`：用于编写 webpack 公共配置。

- `webpack.dev.js`：用于配置 webpack 开发环境配置。

- `webpack.prod.js`：用于 webpack 打包配置。

### 创建 public 文件夹

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

### 安装初始化所需插件

**webpack-merge**：用于合并两个 webpack 配置，如下用于在 webpack.dev.js 中合并 webpack.common.js 中的配置。

**html-webpack-plugin**：用于在指定的 html 模板文件中自动导入打包出来的 js 文件。

```json
yarn add webpack-merge html-webpack-plugin -D
```

### webpack 初始配置

webpack.common.js 文件初始内容：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
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

webpack.prod.js 文件初始内容：

```js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.config.js");

module.exports = merge(common, {
  mode: "production",
});
```

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

### 修改 package.json 文件

在 scripts 属性中增加如下配置：

```json
"scripts": {
  "start": "webpack serve --config ./config/webpack.dev.config.js",
  "build": "webpack --config ./config/webpack.prod.config.js"
},
```

使用 `npm start` 命令启动项目。
