### mac 连接远程服务器

首先输入 `ssh root@47.97.107.28`，47.97.107.28 为服务器公网 IP。接着输入密码即可完成连接。

### 安装 lrzsz

lrzsz 安装之后，就能使用`rz`命令上传本地文件到服务器上了。

```
yum -y install lrzsz
```

### 安装 node

在 node 官网下载 linux 版本的 node 压缩包。：

输入命令`cd /usr/local`进入到 local 文件夹中。进入到 local 文件夹中后，输入命令`mkdir node`创建一个 node 文件夹。在node目录下输入命令`rz`将下载的 node 包放入`/usr/local/node`文件夹中。

输入`tar -vxf node-vxxx.tar.xz`将 node 进行解压。

`cd node-vxxx.tar.xz cd bin`到 node-vxxx.tar.xz 下的 bin 目录中，接着输入命令`ln -s /usr/local/node/node-vxxx.tar.xz/bin/node /usr/local/bin/node`设置 node 环境变量。

`cd node-vxxx.tar.xz cd bin`到 node-vxxx.tar.xz 下的 bin 目录中，接着输入命令`ln -s /usr/local/node/node-vxxx.tar.xz/bin/npm /usr/local/bin/npm`设置 node 环境变量。

`cd node-vxxx.tar.xz cd bin`到 node-vxxx.tar.xz 下的 bin 目录中，接着输入命令`ln -s /usr/local/node/node-vxxx.tar.xz/bin/yarn /usr/local/bin/yarn`设置 node 环境变量。

`cd node-vxxx.tar.xz cd bin`到 node-vxxx.tar.xz 下的 bin 目录中，接着输入命令`ln -s /usr/local/node/node-vxxx.tar.xz/bin/pm2 /usr/local/bin/pm2`设置 node 环境变量。

### node 项目部署

`cd /usr/local`到 local 文件夹中，接着输入`mkdir server`创建一个 server 文件夹。

`cd server`进入到 server 目录下，接着输入命令`rz`回车后，选择压缩好的服务包。

输入`unzip xxx.zip`将项目解压。

在 server 目录下执行`npm install`安装项目所需依赖。依赖安装完毕之后，执行`npm start`启动项目。

### 安装 pm2

全局安装 pm2：

```js
npm install -g pm2
```

### pm2 常用命令

`pm2 start ./src/main.js`：启动项目。

`pm2 list`：显示所有进程信息。

`pm2 info 进程 id（如：0）`：显示 id 为 0 的进程详细信息。

`pm2 monit`：进入监视页面，监视每个 node 进程的 CPU 和内存的使用情况。

`pm2 stop/delete 0`：停止/删除 id 为 0 的进程。

`pm2 stop/delete all`：停止/删除所有进程。

`pm2 restart 0`：0 秒停机重载 id 为 11 进程（用于 NETWORKED 进程）。

`pm2 reload 0`：重启 id 为 0 的进程。

`pm2 restart all`：重启所有进程。

`pm2 restart all`：重载所有进程。

`pm2 logs`：显示所有进程的日志。

`pm2 logs 0`：显示进程 id 为 0 的日志。

`pm2 flush`：清空所有日志文件。

`pm2 reloadLogs`：重载所有日志。

`pm2 startup`：产生 init 脚本，保持进程活着。

### 解决 pm2 启动项目时 status 为 error 的情况

在服务器中依次执行下列命令即可：

```js
ps aux | grep pm2

kill -9  pm2项目对应的进程

pm2 update
```

### 安装 Mongodb

首先到官网根据自己的服务器下载对应的 Mongodb 压缩包。

`cd /usr/local`目录下，使用`mkdir mongodb`创建 mongodb 文件夹。

`cd /`到根目录，使用命令`mkdir -p /data/db`创建 db 文件夹。再使用`mkdir -p /data/log`创建 log 文件夹。

`cd mongodb`文件夹下，使用`rz`命令将我下载好的压缩包通过了`tar -vxf mongodb-xxx.tgz`进行解压。

`cd mongodb-linux-xxx/bin`目录，在使用`./mongod`启动 mongodb。

### 配置 mongodb 环境变量

首先在 mongodb/mongodb-xxx/bin 目录执行`pwd`获取 mongodb 的所在路径。

`cs etc`到 etc 目录下。执行`vi profile`命令。接着输入`export PATH=/usr/local/mongodb/mongodb-linux-x86_64-rhel80-5.0.10/bin:$PATH`，设置完毕后保存。之后输入`source profile`让配置生效。

### 创建 data 及 log 文件

```js
cd mongdb/mongodb-linux-x86_64-rhel70-5.0.12

mkdir data

cd data

mkdir log

cd log

touch mongod.log
```

### 启动 mongodb

```js
cd mongodb/bin
./mongod --dbpath=/data  --logpath=/data/log/mongod.log --fork
```

### 链接数据库

```js
cd mongodb/bin
./mongo
```

### 安装 nginx

[去官网下载 nginx：](https://nginx.org/en/download.html)

选择下载 Stable version 下的第二个版本：nginx-1.22.0 pgp

### 创建 nginx 并将 nginx tar 包放到 nginx 文件夹中

```js
cd /usr/local

mkdir nginx

cd nginx

rz

tar -vxf nginx-1.22.0
```

### 执行如下命令

```js
./configure

make

make install
```

### nginx 上传报错

413 Request Entity Too Large：这是由于请求实体过大，需要在 nginx 的 http 配置中增加如下设置：

```js
http {
  client_max_body_size 20m;
}
```

上述设置设置完成之后， 在 nginx 下的 sbin 目录下执行 `./nginx -s reload` 重启 nginx 服务即可。

### 部署前端项目

进入 `/usr/local/nginx/html/dist`，之后将打包好的前端资源包 dist.zip 使用 `rz` 命令上传到 html下的dist 文件夹中，接着使用 `unzip dist.zip` 将 dist.zip 解压即可。

### 部署后端项目

进入 `/usr/local/server` 文件夹下，使用 `rz` 命令将压缩好的后端资源上传到 server 文件夹中，接着使用 `unzip dist.zip` 将 dist.zip 解压。解压完成之后，在 server 文件目录下执行 `yarn` 下载项目依赖。

### 重启服务

使用 `pm2 list` 查看项目是否在启动状态，如果在启动状态的化，使用 `pm2 delete 项目启动id` 关闭原本启动的项目。接着使用 `pm2 ./src/main.js` 重新启动项目。

### 重启 nginx

前端资源部署完成之后，需要重启 nginx 使部署的资源生效。进入 `/usr/local/nginx/sbin` 目录下，执行 `./nginx -s reload` 即可重启项目。此时即可去浏览器中查看资源是否生效了。

### nginx 配置

当需要在一台 nginx 服务器上配置多个前端项目时，需要在 `/usr/local/nginx/` 目录下创建一个 `html_admin` 文件夹，同时更改 nginx 中另一个 server 中监听的端口号，具体如下：

```conf
worker_processes  1;

events {
  worker_connections  1024;
}

http {
  include   mime.types;
  default_type  application/octet-stream;
  sendfile  on;
  keepalive_timeout   65;
  client_max_body_size  20m;  #上传size改为20m，防止文件过大无法上传

  server {
    listen  80; 监听80端口
    server_name   43.143.120.87; #服务器公网域名，或者设置为localhost

    location / {
      root  /usr/local/nginx/html/dist; #设置前端资源包的路径
      index   index.html  index.htm;  #设置前端资源入口html文件
      try_files   $uri  $uri/ /index.html;  #解决 browserRouter 页面刷新后出现404
    }

    #为前台项目代理服务接口
    location /api/ {
      proxy_set_header  Host  $http_host;
      proxy_set_header  X-Real-IP $remote_addr;
      proxy_set_header  REMOTE-HOST $remote_addr;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass  http://localhost:9112;
    }

    #设置服务器图片资源的代理
    location /image/ {
      root  /usr/local/server/src/upload/image;
      rewrite  ^/usr/local/server/src/upload/(.*) /$1 break;
      proxy_pass  http://localhost:9112;
    }

    error_page  500 502 503 504 /50x.html;
    location = /50x.html {
      root  html;
    }
  }

  #为后台项目代理服务接口
  server {
    listen  8090;
    server_name  localhost;

    location / {
      root  /usr/local/nginx/html_admin/dist; #设置前端资源包的路径
      index   index.html  index.htm;  #设置前端资源入口html文件
      try_files   $uri  $uri/ /index.html;  #解决 browserRouter 页面刷新后出现404
    }

    #为后台项目代理服务接口
    location /admin/ {
      proxy_set_header  Host  $http_host;
      proxy_set_header  X-Real-IP $remote_addr;
      proxy_set_header  REMOTE-HOST $remote_addr;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass  http://localhost:9112;
    }
  }
}
```

### nginx 报错处理

解决nginx: [error] open() ＂/usr/local/nginx/logs/nginx.pid＂ failed错误，具体操作如下：

```js
cd /usr/local/nginx

/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

### 复制 upload 资源

将 upload 资源复制到 server 中：

```json
cp -r /usr/local/server/src/upload /usr/local/server/

cp -r /usr/local/server/src/upload /usr/local/   // 复制到local
```

将 upload 资源从 server 复制到 src 中：

```json
cp -r /usr/local/server/upload /usr/local/server/src/

cp -r /usr/local/upload /usr/local/server/src/  // 从local复制到src
```

### mac 终止占用的端口

查询占用端口的 PID：

```conf
lsof -i tcp:port(如：9012)

#COMMAND   PID   USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
#node    56185 dnhyxc   24u  IPv6 0x6acfe600190c69b3      0t0  TCP *:9012 (LISTEN)
```

终止端口对应的进程：

```conf
kill -9 PID #PID，如 56185
```
