### mac 连接阿里云远程服务器

首先输入 `ssh root@47.97.107.28`，47.97.107.28 为服务器公网 IP。接着输入密码即可完成连接。

### 安装 lrzsz

lrzsz 安装之后，就能使用`rz`命令上传本地文件到服务器上了。

```
yum -y install lrzsz
```

### 安装 node

在 node 官网下载 linux 版本的 node 压缩包。：

在 xshell 中输入命令`rz`将下载的 node 包放入服务器中。

输入命令`cd /usr/local`进入到 local 文件夹中。

进入到 local 文件夹中后，输入命令`mkdir node`创建一个 node 文件夹。

`cd node`进入到 node 文件夹，输入命令`mv /root/node-vxxx.tar.xz ./`将 root 下的 node 拷贝到 local 下的 node 目录下。

输入`tar -vxf node-vxxx.tar.xz`将 node 进行解压。

`cd node-vxxx.tar.xz cd bin`到 node-vxxx.tar.xz 下的 bin 目录中，接着输入命令`ln -s /usr/local/node/node-vxxx.tar.xz/bin/node /usr/local/bin/node`设置 node 环境变量。

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

`cs etc`到 etc 目录下。执行`vi profile`命令。接着输入`export PATH=/usr/local/mongodb/mongodb-xxx/bin:$PATH`，设置完毕后保存。之后输入`source profile`让配置生效。
