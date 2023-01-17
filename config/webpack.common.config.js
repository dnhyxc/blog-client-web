const os = require('os');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
const HappyPack = require('happypack');
// const PurgeCSSPlugin = require('purgecss-webpack-plugin'); // css优化去重复无效代码
// const glob = require('glob');

// 开辟一个线程池，拿到系统CPU的核数，happypack 将编译工作利用所有线程
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

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
        type: 'asset',
        parser: {
          // 转base64的条件
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
        generator: {
          // 与output.assetModuleFilename是相同的,这个写法引入的时候也会添加好这个路径
          filename: 'assets/images/[name].[contenthash:6][ext]',
          // 打包后对资源的引入，文件命名已经有/img了
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf|mp3|lrc|mp4)$/,
        type: 'asset/resource',
        exclude: /node_modules/,
        generator: {
          filename: 'assets/font/[name].[contenthash:8][ext]', // 指定打包后文件存放的文件夹和文件名
        },
      },
      {
        test: /\.(mp3|lrc|mp4)$/,
        type: 'asset/resource',
        exclude: /node_modules/,
        generator: {
          filename: 'assets/music/[name].[contenthash:8][ext]', // 指定打包后文件存放的文件夹和文件名
        },
      },
      {
        test: /\.md$/,
        type: 'asset/source',
        exclude: /node_modules/,
        generator: {
          filename: 'assets/file/[name].[contenthash:8][ext]', // 指定打包后文件存放的文件夹和文件名
        },
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
      favicon: path.resolve(__dirname, '../public/favicon.png'),
      minify: {
        removeComments: true,
      },
    }),
    new ESLintPlugin(),
    new FriendlyErrorsWebpackPlugin(),
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
    // 排除moment无用语言包
    new MomentLocalesPlugin({ localesToKeep: ['zh-cn'] }),
    // new CompressionPlugin({
    //   test: /\.(js|css)(\?.*)?$/i, // 需要压缩的文件正则
    //   threshold: 1024, // 文件大小大于这个值时启用压缩
    //   deleteOriginalAssets: false, // 压缩后保留原文件
    // }),
    new HappyPack({
      id: 'happybabel',
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
    }),
    // 打包时排除没有用到的 css 代码，这个需要谨慎使用，用的不好会导致打包出的css没有内容
    // new PurgeCSSPlugin({
    //   paths: glob.sync(path.join(__dirname, 'index.html')),
    // }),
  ],
  // 精简控制台编译输出信息
  stats: {
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    assets: false,
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
  // 缓存配置
  optimization: {
    splitChunks: {
      cacheGroups: {
        antd: {
          name: 'chunk-antd', // 分割出的js名
          priority: 20, // 权重，需要比libs和app的配置大，不然会分到libs或app里面去
          test: /[\\/]node_modules[\\/]_?antd(.*)/, // 匹配node_modules下的目录
        },
        echarts: {
          name: 'chunk-echarts', // 分割出的js名
          priority: 20, // 权重，需要比libs和app的配置大，不然会分到libs或app里面去
          test: /[\\/]node_modules[\\/]_?echarts(.*)/, // 匹配node_modules下的目录
        },
        '@toast-ui': {
          name: 'chunk-toast-ui', // 分割出的js名
          priority: 20, // 权重，需要比libs和app的配置大，不然会分到libs或app里面去
          test: /[\\/]node_modules[\\/]_?@toast-ui(.*)/, // 匹配node_modules下的目录
        },
        'markdown-navbar': {
          name: 'chunk-markdown-navbar', // 分割出的js名
          priority: 20, // 权重，需要比libs和app的配置大，不然会分到libs或app里面去
          test: /[\\/]node_modules[\\/]_?markdown-navbar(.*)/, // 匹配node_modules下的目录
        },
        'react-markdown': {
          name: 'chunk-react-markdown', // 分割出的js名
          priority: 20, // 权重，需要比libs和app的配置大，不然会分到libs或app里面去
          test: /[\\/]node_modules[\\/]_?react-markdown(.*)/, // 匹配node_modules下的目录
        },
        'react-router-dom': {
          name: 'chunk-react-router-dom', // 分割出的js名
          priority: 20, // 权重，需要比libs和app的配置大，不然会分到libs或app里面去
          test: /[\\/]node_modules[\\/]_?react-router-dom(.*)/, // 匹配node_modules下的目录
        },
      },
    },
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
