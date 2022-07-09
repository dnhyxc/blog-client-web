### 模块化简介

#### 什么是模块化

将一个复杂的程序依据一定的规则（规范）封装成几个块（文件），并组合在一起。

模块的内部数据是私有的，只是向外暴露一些接口（方法，API）与外部其它模块进行通信。

#### 使用模块化的原因

为了降低复杂度，提高解耦性（降低耦合度），还有为了部署简单。

#### 模块化的好处

避免命名冲突，减少对命名空间的污染。

更好的分离，按需加载。

使代码具有更高的复用性。

提高各个模块内代码的可维护性。

#### 模块化所带来的问题

引入依赖文件多，导致请求过多。

各个文件之间的依赖模糊。

由于依赖关系复杂，导致项目难以维护。

### 模块化规范

#### CommonJS

规范说明：

- 官方参考文档：[戳这里查看](https://javascript.ruanyifeng.com/nodejs/module.html)

- 每个文件都可当作一个模块。

- 在服务器端：模块的加载是运行时同步加载（同步会阻塞代码运行）的。

- 在浏览器端：模块需要提前编译打包，否则浏览器将解析不出来。

基本语法：

- 暴露模块：

  - `module.exports` = '任意数据类型'

  - `exports.xxx` = '任意数据类型'

  - 暴露模块的本质：其实就是向外暴露 exports 对象。exports 原本是一个空对象，使用 `module.exports` 的方式其实就是用`等号` 右边的值覆盖原本空的对象。而`exports.xxx` 的方式就是向 exports 对象中添加 xxx 属性。

- 引入模块 require(xxx)：

      - 引入第三方模块：xxx 为模块名。

      - 引入自定义模块：xxx 为模块文件的路径。

服务端实现方式：

- 使用 Node.js 实现。

浏览器端实现：

- 需要使用 **[Browserify](http://browserify.org/)** 第三方库进行编译。

- Browserify 即为 CommonJS 浏览器端的打包工具。

- browserify 安装方式：

  - 使用 npm i browserify -g 进行全局安装。

  - 使用 npm i browserify --save-dev 进行局部安装。

  - **注意**：首次安装既要在全局安装，也要在局部进行安装。

- 使用 browserify 在终端进行打包的命令为：browserify js/src/app.js -o js/dist/bundle.js

      - browserify js/src/app.js 为入口文件。

      - js/dist/bundle.js 为打包完成后的输出文件。

      - 入口与出口使用 -o 进行分隔。

基本使用示例：

- module1.js 内容：

```js
module.exports = {
  foo() {
    console.log("module1 foo");
  },
};
```

- module2.js 内容：

```js
module.exports = function () {
  console.log("module2()");
};
```

- module3.js 内容：

```js
exports.foo = function () {
  console.log("module3 foo()");
};

exports.bar = function () {
  console.log("module3 bar()");
};
```

- app.js 内容：

```js
let module1 = require("./module1");
let module2 = require("./module2");
let module3 = require("./module3");

module1.foo(); // module1 foo
module2(); // module2()
module3.foo(); // module3 foo()
module3.bar(); // module3 bar()
```

- index.html 内容：

```html
<body>
  <h2>使用browserify打包命令</h2>
  <p>browserify js/src/app.js -o js/dist/bundle.js</p>
  <script src="./js/dist/bundle.js"></script>
</body>
```

#### AMD

AMD 规范说明：

- AMD 全称为：Asynchronous Module Definition（异步模块定义）。

- 官方参考文档：[戳这里查看](https://github.com/amdjs/amdjs-api)。

- AMD 是专门用于浏览器端的，且模块的加载是异步的（即不会阻塞代码运行）。

基本语法：

- 定义暴露模块：

  - 定义没有依赖的模块：

  ```js
  define(function () {
    return 模块;
  });
  ```

  - 定义有依赖的模块：

  ```js
  define(["module1", "module2"], function (m1, m2) {
    return 模块;
  });
  ```

- 引入使用模块：

```js
require(['module1', 'module2'], function(m1, m2) {
    使用 m1/m2
})
```

浏览器端实现：

- 需要依赖于 [Require.js](https://requirejs.org/) 实现。

基本使用示例：

- dataService.js 内容：

```js
// 定义没有依赖的模块
define(function () {
  let name = "dataService.js__require.js";
  function getName() {
    return name;
  }

  // 向外暴露模块
  return { getName };
});
```

- data.js 内容：

```js
// 定义有依赖的模块
define(// 参数一为：一个数组，数组中保存的就是依赖模块，为字符串类型
["dataService"], function (dataService) {
  // 参数二为：一个函数，参数为依赖的模块
  let msg = "data.js——AMD";
  function showMsg() {
    console.log(msg, dataService.getName());
  }
  return { showMsg };
});
```

- main.js 内容：

```js
(function () {
  requirejs.config({
    baseUrl: "js/", // 表示基本路径
    paths: {
      // 配置路径，注意不能加 .js 后缀，否则会报错
      dataService: "./modules/dataService",
      data: "./modules/data",
    },
  });
  requirejs(["data"], function (data) {
    data.showMsg();
  });
})();
```

- index.html 内容：

```html
<body>
  <h3>使用 Require.js 规范实现模块化</h3>
  <!-- 使用CDN引入require.js -->
  <script src="https://cdn.bootcdn.net/ajax/libs/require.js/2.3.5/require.min.js"></script>
  <script src="./js/main.js"></script>
</body>
```

#### ES6 模块化

ES6 模块化规范说明：

- 依赖模块需要编译打包处理。

语法：

- 导出模块使用：export。

- 引入模块使用：import。

浏览器端实现：

- 需要依赖于 [Babel](https://babeljs.io/) 实现。

Babel 基本使用：

- 需要安装：babel-cli，babel-preset-es2015 和 browserify。
- **注意**：需要在全局安装 babel-cli。

  - npm i babel-cli browserify -g

  - npm i babel-preset-es2015 --save-dev

- 配置 .babelrc 文件：

```
{
  "presets": ["es2015"]
}
```

- 编译命令：

  - 使用 **babel js/src -d js/build** 将模块内容转化为 ES5 的格式。
  - 在使用 **browserify js/build/main.js -o js/dist/bundle.js** 将模块内容编译成浏览器能够识别的内容。

基本使用示例：

- module1.js 内容：

```js
// 暴露模块
export function foo() {
  console.log("foo() module1__ES6");
}

export function bar() {
  console.log("bar() module1__ES6");
}

export let arr = [1, 2, 3, 4, 5];
```

- module2.js 内容：

```js
function fun() {
  console.log("fun() module2");
}

function fun2() {
  console.log("fun2() module2");
}

export { fun, fun2 };
```

- module3.js 内容：

```js
export default () => {
  console.log("使用 export default 默认暴露");
};
```

- module4.js 内容：

```js
// 暴露模块
export function fn() {
  console.log("fn() module1__ES6");
}

export function fn2() {
  console.log("fn2() module1__ES6");
}

export let obj = { name: "snsn" };
```

- main.js 内容：

```js
import { foo, bar, arr } from "./module1";
import { fun, fun2 } from "./module2";
import module3 from "./module3";
// 一次性导入全部
import * as module4 from "./module4";

foo(); // foo() module1__ES6
bar(); // bar() module1__ES6
console.log(arr); // [1, 2, 3, 4, 5]
fun(); // fun() module2
fun2(); // fun2() module2
module3(); // 使用 export default 默认暴露
console.log(module4); // Object{fn,fn2,obj}
module4.fn(); // fn() module1__ES6
module4.fn2(); // fn2() module1__ES6
console.log(module4.obj.name); // snsn
```

- index.html 内容：

```html
<body>
  <h2>使用ES6实现模块化</h2>
  <script src="./js/dist/bundle.js"></script>
</body>
```
