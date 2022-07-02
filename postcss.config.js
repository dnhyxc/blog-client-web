/*
 * @Description: postcss 配置
 * @Author: dnh
 * @Date: 2022-06-10 16:12:17
 * @LastEditors: dnh
 * @FilePath: \example\react\mobx\postcss.config.js
 * @LastEditTime: 2022-06-10 16:13:40
 */
const path = require("path");

module.exports = ({ file }) => {
  return {
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
      // flexible配置
      "postcss-pxtorem": {
        rootValue: 75, // 设计稿宽度的1/10
        // rootValue: 23.4375, // 650
        propList: ["*"], // 需要做转化处理的属性，如`hight`、`width`、`margin`等，`*`表示全部
      },
    },
  };
};

// module.exports = {
//   plugins: [
//     require("autoprefixer")({
//       overrideBrowserslist: [
//         "Android 4.1",
//         "iOS 7.1",
//         "Chrome > 31",
//         "ff > 31",
//         "ie >= 8",
//       ],
//     }),
//     {
//       // flexible配置
//       "postcss-pxtorem": {
//         rootValue: 75, // 设计稿宽度的1/10
//         propList: ["*"], // 需要做转化处理的属性，如`hight`、`width`、`margin`等，`*`表示全部
//       },
//     },
//   ],
// };

/**
 * postcss 一种对 css 编译的工具，类似 babel 对 js 的处理。
 *
 * CSS 规则添加特定厂商的前缀。 Autoprefixer 自动获取浏览器的流行度和能够支持的属性，并根据这些数据帮你自动为 CSS 规则添加前缀。
 * postcss 只是一个工具，本身不会对 css 一顿操作，它通过插件实现功能，autoprefixer 就是其一。
 *
 * npm install postcss postcss-loader autoprefixer --save-dev
 */
