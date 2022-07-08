/*
 * @Description: webpack 公共配置
 * @Author: dnh
 * @Date: 2022-06-10 15:13:32
 * @LastEditors: dnh
 * @FilePath: \config\webpack.common.config.js
 * @LastEditTime: 2022-06-13 11:40:24
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const WebpackBar = require("webpackbar");

module.exports = {
  entry: {
    index: "./src/index.tsx",
  },
  output: {
    filename: "js/[name]-bundle-[contenthash:6].js",
    path: path.resolve(__dirname, "../dist"),
    // 防止刷新页面后出现页面丢失报错！GET http://localhost:9000/home/js/bundle.js net::ERR_ABORTED 404 (Not Found)
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react", "mobx"],
              plugins: [
                "@babel/plugin-transform-runtime",
                "@babel/plugin-proposal-class-properties",
              ],
            },
          },
        ],
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                [
                  "import",
                  {
                    libraryName: "antd",
                    libraryDirectory: "es",
                    style: true,
                  },
                ],
              ],
            },
          },
          "ts-loader",
        ],
      },
      {
        test: /\.(bmp|png|jpe?g|gif)$/,
        exclude: /node_modules/,
        loader: "url-loader",
        options: {
          name: "[name].[contenthash:8].[ext]",
          outputPath: "assets/images",
          limit: 8192,
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name].[contenthash:8].[ext]",
              outputPath: "assets/fonts",
            },
          },
        ],
      },
      {
        test: /\.md$/,
        exclude: /node_modules/,
        use: "raw-loader",
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
      template: "public/index.html",
      filename: "index.html",
      // 配置浏览器标签图标
      favicon: "public/favicon.png",
      inject: "body",
      hash: false,
      minify: {
        removeComments: true,
      },
    }),
    new ESLintPlugin(),
    new WebpackBar(),
    new FriendlyErrorsWebpackPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      "@styles": path.resolve(__dirname, "../src/styles"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".less", ".scss"],
  },
  // 精简控制台编译输出信息
  stats: {
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  },
  // stats: "errors-only",
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
};

/**
 * babel-loader：使用 Babel 和 webpack 来转译 JavaScript 文件。
 *  @babel/core：babel 的核心模块
 *  @babel/preset-env：转译 ES2015+的语法
 *  @babel/preset-react：转译 react 的 JSX
 *  @babel/plugin-proposal-class-properties：用来编译类(class)
 *  @babel/plugin-transform-runtime：防止污染全局，代码复用和减少打包体积
 *  babel-plugin-import 能够帮助我们在引入组件的时候自动加载相关样式。
 *
 * file-loader url-loader 说明：
 *  后缀为 jpg,png,gif 的文件，使用 url-loader 进行预处理；
 *  options 中的[name].[ext]表示，输出的文件名为 原来的文件名；
 *  outputPath 是输出到 dist 目录下的路径，即 dist/images；
 *  limit: 8192，指定文件的最大体积（以字节为单位）。 如果文件体积等于或大于限制，默认情况下将使用 file-loader 并将所有参数传递给它。若是小于了 8kb，将图片打包成 base64 的图片格式插入到 bundle.js 文件中，这样做的好处是，减少了 http 请求，但是如果文件过大，js 文件也会过大，得不偿失，这是为什么有 limit 的原因。(但是，DataURL 形式的图片不会被浏览器缓存)
 *
 * resolve 配置别名说明：
 *  extensions: 如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。使用此选项会 覆盖默认数组，这就意味着 webpack 将不再尝试使用默认扩展来解析模块。
 *  modules: 如果你想要添加一个目录到模块搜索目录，此目录优先于 node_modules/ 搜索。
 *  alias: 创建 import 或 require 的别名，来确保模块引入变得更简单。例如，一些位于 src/ 文件夹下的常用模块
 */
