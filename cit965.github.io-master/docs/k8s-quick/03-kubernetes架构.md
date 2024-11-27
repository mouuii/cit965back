---
sidebar_label: 03-kubernetes架构
sidebar_position: 3
title: 03-kubernetes架构
---

### 架构层次


我们已经说过Kubernetes是云的操作系统，它位于应用程序和基础设施之间。Kubernetes运行在基础设施上，应用程序运行在Kubernetes上。如图 3.1 所示

![](https://raw.githubusercontent.com/mouuii/picture/master/%E6%88%AA%E5%B1%8F2023-07-16%20%E4%B8%8B%E5%8D%884.11.02.png)

图 3.1 显示了运行在4个不同基础设施平台上的4个Kubernetes安装。由于Kubernetes抽象了底层基础设施，因此图中顶部的应用程序可以在任何Kubernetes安装上运行。您还可以将它从一个Kubernetes迁移到另一个Kubernetes。



### 控制平面节点和工作节点


Kubernetes集群是安装了Kubernetes的一台或多台机器。这些机器可以是物理服务器、虚拟机(VM)、云实例、笔记本电脑等等。在这些机器上安装Kubernetes并将它们连接在一起将创建一个Kubernetes集群。然后可以将应用程序部署到集群。

我们通常将Kubernetes集群中的机器称为节点。说到节点，Kubernetes集群有两种类型:
- 控制节点
- 工作节点

控制平面节点承载内部Kubernetes服务，而工作节点是用户应用程序运行的地方。图3.2显示了一个6节点的Kubernetes集群，其中有3个控制平面节点和3个工作节点。防止用户应用程序在控制平面节点上运行而只在工作节点上运行是一种很好的做法。

![](https://raw.githubusercontent.com/mouuii/picture/master/%E6%88%AA%E5%B1%8F2023-07-16%20%E4%B8%8B%E5%8D%884.16.27.png)


### 控制平面节点

控制平面节点承载 Kubernetes 运行所需的内部系统服务。我们把它们统称为控制平面。控制平面需要高可用，如果其中一个节点发生故障，集群可以保持运行。生产集群中通常有3或5个控制平面节点，并将它们分散到不同的故障域上。

![](https://raw.githubusercontent.com/mouuii/picture/master/%E6%88%AA%E5%B1%8F2023-07-16%20%E4%B8%8B%E5%8D%884.20.33.png)



图3.3控制平面节点运行以下服务，构成控制平面(集群的大脑):

- API 服务器


API 服务器是Kubernetes集群中唯一与您直接交互的部分。例如，当您向集群发送命令时，它们将转到 API 服务器。当您收到响应时，它们来自API服务器。

- 调度器

调度器决定在哪些工作节点上运行用户应用程序。

- 存储器

存储器是存储集群状态和所有应用程序的地方。

- 云控制器

云控制器允许Kubernetes与云服务集成

- 。。。

Kubernetes控制平面中还有更多的服务，但这些都是本书中重要的服务。



### 工作节点

是用户应用程序运行的地方，可以是Linux或Windows。

