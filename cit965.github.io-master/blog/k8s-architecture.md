---
slug: 深入了解 Kubernetes 架构和组件
title: 深入了解 Kubernetes 架构和组件
authors: mouuii
tags: [k8s]
---

### 导言

Kubernetes 是一个容器编排系统，可自动部署、扩展和管理容器化应用程序。Kubernetes 的架构旨在为运行和管理容器化工作负载提供一个灵活且可扩展的平台。

在本文中，我们将深入探讨 Kubernetes 的架构，包括构成系统的各种组件，以及它们如何协同工作，为容器编排提供强大且可扩展的平台。

在高层次上，Kubernetes 的架构基于管理工作节点集群的主节点。主节点为 Kubernetes 集群提供控制平面，而工作节点提供用于运行容器化应用程序的计算资源。

### 主节点组件

Kubernetes 主节点由多个组件组成，这些组件协同工作，为集群提供控制平面。这些组件包括：

#### API Server
API 服务器提供了一个 RESTful 接口，用于与 Kubernetes 集群进行交互。它接收来自各种客户端（如 kubectl）的请求，并将其转换为由控制平面中的其他组件执行的操作
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers:
  - name: nginx
    image: nginx
```
#### etcd 
etcd 是一个分布式键值存储，被 Kubernetes 用来存储集群状态信息。etcd 数据存储用于存储集群中对象的配置数据、机密和元数据。
```sh
etcdctl get /registry/pods/default/test-pod -w json
```

#### 控制器管理器

控制器管理器负责管理监视和管理集群中对象的各种控制器。这些控制器包括管理 Pod 部署的复制控制器和管理网络终结点的终结点控制器。

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
 ```

#### Scheduler

调度程序负责将 Pod 调度到集群中的工作节点上。调度程序根据 Pod 的资源需求以及工作节点上资源的可用性做出决策。


```sh
                                            +-----------+
                                            |           |
                                            | etcd      |
                                            |           |
                                            +-----------+
                                                   ^
                                                   |
                                                   |
                                                   |
+-----------+    +--------------+    +------------------------+
|           |    |              |    |                        |
| kube-apis |<---|  Controller  |<---|        Scheduler       |
|  -erver   |    |   Manager    |    |                        |
|           |    |              |    +------------------------+
+-----------+    +--------------+
```

从图中可以看出，API 服务器是接收来自各种客户端的请求并与控制平面中的其他组件交互的中心组件。API 服务器使用 etcd 数据存储来存储有关集群中对象的配置数据、机密和元数据。控制器管理器负责管理监视和管理集群中对象的各种控制器，调度程序负责将 Pod 调度到集群中的工作器节点上。所有这些组件协同工作，为 Kubernetes 集群提供控制平面。

### 工作节点组件

Kubernetes 集群中的工作节点为运行容器化应用程序提供计算资源。每个工作节点都由多个组件组成，这些组件协同工作以管理在该节点上运行的容器。这些组件包括

#### kubelet
kubelet 是在每个工作节点上运行的代理，负责管理该节点上的容器。它与主节点通信，并接收有关运行哪些容器并管理其生命周期的指令。kubelet 负责以下任务


- 从镜像仓库拉取容器映像
- 启动和停止容器
- 监视容器的运行状况并在必要时重新启动它们
- 将卷装载到容器
- 日志记录容器输出

kubelet 与容器运行时密切合作，以确保容器正常运行。它还与其他 Kubernetes 组件配合使用，以管理网络连接和存储资源。

#### kube-proxy

kube-proxy 是在每个工作节点上运行的网络代理，负责管理与在该节点上运行的容器的网络连接。它维护网络规则并管理每个容器的网络接口。kube 代理负责以下任务：

- 将流量路由到相应的容器
- 为服务实现负载平衡
- 管理网络策略

kube-proxy 与 kubelet 和其他 Kubernetes 组件密切合作，以确保保持网络连接并正确路由流量。

#### Container Runtime

容器运行时是在工作器节点上运行容器的软件。Kubernetes 支持多个容器运行时，包括 Docker、containerd 和 CRI-O。容器运行时负责以下任务：

- 从仓库拉取容器映像
- 启动和停止容器
- 管理容器资源，例如 CPU 和内存
- 管理容器网络

容器运行时与 kubelet 密切合作，以确保容器正常运行并有效利用资源。

### 示例

让我们看一些示例，说明这些工作节点组件如何协同工作以管理在 Kubernetes 集群中工作节点上运行的容器

1. 创建具有单个容器的 Pod：

要创建具有单个容器的 pod，我们需要创建一个描述 pod 规范的 YAML 文件。下面是一个示例 YAML 文件：
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: nginx
    ports:
    - containerPort: 80
 ```   

此 YAML 文件指定一个具有单个容器的 pod，该容器运行 nginx 映像并公开端口 80。当 kubelet 收到这个 YAML 文件时，它会从注册表中提取 nginx 镜像，启动容器，并挂载必要的卷

2. 创建服务以公开 Pod：

要公开在工作节点上运行的 Pod，我们需要创建一个将网络端口映射到 Pod 端口的服务。下面是一个示例 YAML 文件：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```  

此 YAML 文件指定一个service，该服务将服务上的端口 80 映射到容器上的端口 80，标签为 app=my-app。服务类型为 LoadBalancer，这意味着 Kubernetes 集群将创建一个外部负载均衡器来将流量路由到 Pod。当 kube-proxy 收到此 YAML 文件时，它会创建必要的网络规则并管理每个 Pod 的网络接口。kube-proxy 还实现了服务的负载均衡并管理网络策略。

3. 扩展deployment

若要在 Kubernetes 中缩放deployment，我们需要更新部署的 YAML 文件以指定所需的副本数。下面是一个示例 YAML 文件
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-container
        image: nginx
        ports:
        - containerPort: 80
 ```       
 此 YAML 文件指定一个deployment，其中包含在工作器节点上运行的 nginx 容器的三个副本。当 kubelet 收到这个 YAML 文件时，它会创建三个相同的 pod，每个 pod 都运行 nginx 容器。然后，kube-proxy 更新其网络规则，将流量路由到三个 Pod 中的每一个。

 4. 更新deployment：

若要更新 Kubernetes 中的部署，我们需要更新部署的 YAML 文件以指定新的容器映像或其他配置更改。下面是一个示例 YAML 文件

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-container
        image: nginx:latest
        ports:
        - containerPort: 80
 ```       

 此 YAML 文件指定使用最新版本的 nginx 映像的更新部署。当 kubelet 收到此 YAML 文件时，它会更新 Pod 以使用新映像并管理容器生命周期。kube-proxy 还会更新其网络规则，以将流量路由到更新的 Pod。

 ### 总结

 总之，了解 Kubernetes 架构对于任何使用 Kubernetes 的人来说都是至关重要的，从开发人员到系统管理员。该架构由两个主要组件组成：控制平面和工作节点。控制平面包括几个关键组件，这些组件为 Kubernetes 集群提供中央命令和控制。工作节点负责在集群中运行容器化应用程序和服务。

 通过了解不同的组件以及它们之间的交互方式，您可以更好地解决问题、优化性能并设计满足您特定需求的 Kubernetes 集群。此外，随着 Kubernetes 的不断发展和新功能的添加，对架构有深入的了解将帮助您及时了解最新的发展和最佳实践。