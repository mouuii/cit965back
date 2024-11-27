---
slug: containerd
title: containerd
authors: mouuii
tags: [docker]
---

### 介绍
> An industry-standard container runtime with an emphasis on simplicity, robustness and portability


- containerd 是什么？

在Containerd官网我们可以看到一个很简单明白的解析，一个工业级的容器运行时，着重于简单性，健壮性和可移植性；通俗点来说：如果你需要开发一个容器编排工具或者要简单地运行一个容器服务，有我就足够了

- containerd 是如何诞生的？

Containerd是脱胎于Docker这个软件的，它的诞生也是由于Docker公司的商业模式一直处于摇摆。起初Docker的出现直接吊打了其他容器技术一家独大，连Google也幸免不了，于是Google想着联合一起退出一个容器运行时作为Docker的底层依赖，但Docker公司并不愿意合作。在此之后，Docker为了进一步扩大影响力将libcontainer捐赠给了（OCI，Open Container Intiative）。
以至于后面Google为了与之抗衡联合了几位行业巨头成立（CNCF，Cloud Native Computing Fundation）想着在底层玩不过就在编排层来抢占市场，后面就上演了前几年的Docker Swarm和Kubernetes之争，结局大家也知道Docker Swarm全面败北。
Docker公司并不甘心只当一个底层的容器运行时，于是花了大力气把自己的核心（Contaienrd）依赖剥离出来捐给了CNCF，只为了标榜自己是一个PaaS平台，这波骚操作让一众巨头们都看不懂。
当初让你一起玩你不玩，现在还捐出来了。
Kubernetes为了表示自己的中立性，故而直接搞了容器运行时标准化（CRI, Container Runtime Interface），后面为了继续突出Docker的重要性继而搞了各种shim来转换接口。其实研究过Containerd的同学们都知道，Containerd完全是可以独立运行容器的况且Kubernetes搞了CNI来应对容器的复杂网络需求。这样做只是为了等待Containerd羽翼丰满之时。
大家也知道Kubernetes 自v1.20后弃用Docker，总而言之Docker这个技术是成功的且开创了一个时代。

### containerd 架构

![](https://raw.githubusercontent.com/mouuii/picture/master/202305051021392.png)

可以看到Containerd是一个C/S模式的，由containerd client通过containerd提供的GRPC接口进行操作。
Containerd是有不同总类的Plugin组成的如上图看到，Services层即Services Plugin类型，以此类推MetaData Plugin，Content Plugin， Snapshotter Plugin，Runtime Plugin。总之每一个核心模块就是会有一个或多个类型的Plugin组成，如果想知道更多containerd的源码分析可以留意后续推出的文章.

### 安装
- 下载

```sh
cd /usr/local/src
wget https://github.com/containerd/containerd/releases/download/v1.4.4/containerd-1.4.4-linux-amd64.tar.gz
tar xvf containerd-1.4.4-linux-amd64.tar.gz
cd containerd-1.4.4
copy -av bin/* /usr/local/bin/
```


- 生成配置文件，配置文件可能看起来比较复杂，但暂时先不太关注，其实都是在配置plugin的参数，这些参数更多的需要跟着源码一起解析；


```sh
mkdir -p /etc/container
containerd config default > /etc/containerd/config.toml
```

- 配置一个镜像加速地址，找到"docker.io" 把endpoint换一下

```sh
cat config.toml
...
[plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
          endpoint = ["https://dockerhub.mirrors.nwafu.edu.cn"]
...

```
- 在config.toml文件中，有两个不同的存储路径，一个用来保存持久化数据，一个用来保存运行时状态。后面推出的文章聊到snapshotter, content等源码内容时再详细介绍。

```sh
root = "/var/lib/containerd"
state = "/run/containerd"
```
- 启动containerd, 输入containerd即可

```sh
containerd 

ctr version
Client:
 Version:  v1.4.1
 Revision: c623d1b36f09f8ef6536a057bd658b3aa8632828
 Go version: go1.13.15

Server:
 Version:  v1.4.1
 Revision: c623d1b36f09f8ef6536a057bd658b3aa8632828
 UUID: 2539c5fb-cf92-4dd5-8d77-2f1c39e6959d
```

### ctr 的使用

```sh
-> ctr -h
COMMANDS:
  plugins, plugin            provides information about containerd plugins
  version                    print the client and server versions
  containers, c, container   manage containers
  content                    manage content
  events, event              display containerd events
  images, image, i           manage images
  leases                     manage leases
  namespaces, namespace, ns  manage namespaces
  pprof                      provide golang pprof outputs for containerd
  run                        run a container
  snapshots, snapshot        manage snapshots
  tasks, t, task             manage tasks
  install                    install a new package
  oci                        OCI tools
  shim                       interact with a shim directly
  help, h                    Shows a list of commands or help for one command

GLOBAL OPTIONS:
  --debug                      enable debug output in logs
  --address value, -a value    address for containerd's GRPC server (default: "/run/containerd/containerd.sock") [$CONTAINERD_ADDRESS]
  --timeout value              total timeout for ctr commands (default: 0s)
  --connect-timeout value      timeout for connecting to containerd (default: 0s)
  --namespace value, -n value  namespace to use with commands (default: "default") [$CONTAINERD_NAMESPACE]
  --help, -h                   show help
  --version, -v                print the version

```

从命令的子模块看来，containerd还是偏向于更专注容器的本身，比如网络模块就没见到身影，所以它更适合开发者或者说程序去使用它，而docker明显对人会更加的友好易用。

### images
```go
-> ctr i -h
NAME:
  ctr images - manage images

USAGE:
  ctr images command [command options] [arguments...]

COMMANDS:
  check       check that an image has all content available locally
  export      export images
  import      import images
  list, ls    list images known to containerd
  mount       mount an image to a target path
  unmount     unmount the image from the target
  pull        pull an image from a remote
  push        push an image to a remote
  remove, rm  remove one or more images by reference
  tag         tag an image
  label       set and clear labels for an image

OPTIONS:
  --help, -h  show help

```

- 可以看到很多和docker类似的命令, 下面先下载镜像
```sh
ctr i pull docker.io/library/nginx:alpine
```

- 将镜像挂载到目录上

```sh
-> ctr i mount docker.io/library/nginx:alpine /mnt
-> tree /mnt
/mnt
├── bin
├── dev
├── docker-entrypoint.d
├── docker-entrypoint.sh
├── etc
├── home
├── lib
├── media
├── mnt
├── opt
├── proc
├── root
├── run
├── sbin
├── srv
├── sys
├── tmp
├── usr
└── var

```
- 将镜像从目录上卸载

```sh
-> ctr i unmounnt /mnt
```
- 创建容器

```sh
ctr c create docker.io/library/nginx:alpine nginx
```

- 进入容器，暂停容器 省略


ps： 作者 shadowyd https://juejin.cn/post/6942502047119835143