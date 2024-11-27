---
slug: Argo CD
title: Argo CD
authors: mouuii
tags: [devops]
---

### 什么是 Argo CD
ArgoCD 是使用 Kubernetes 持续交付的流行工具。它通过不断协调 repo 的状态与实时工作负载，自动将应用程序部署到 Kubernetes 集群中。

GitOps模型是Argo设计中不可或缺的一部分。它使 repo 成为应用程序所需状态的单一事实来源。应用所需的所有 Kubernetes 清单、Kustomize 模板、Helm charts 和配置文件都应提交到您的存储库。这些资源“声明”应用的成功部署。

Argo 将声明的状态与集群中实际运行的状态进行比较，然后应用正确的更改来解决任何差异。此过程可以配置为自动运行，防止集群偏离存储库。每当出现差异时，Argo 都会重新同步状态，例如在您手动运行 Kubectl 命令之后。

Argo带有CLI和Web UI。它支持多租户和多集群环境，与 SSO 提供程序集成，生成审计跟踪，并可以实施复杂的 rollout 策略，例如 Canary 部署和蓝/绿升级。它还提供集成的回滚功能，因此您可以快速从部署故障中恢复

从历史上看，大多数 CI/CD 实现都依赖于推送驱动行为。这需要您将集群连接到 CI/CD 平台，然后在管道中使用 Kubectl 和 Helm 等工具来应用
Kubernetes 的更改

Argo是一个基于拉动的CI / CD系统。它运行在您的 Kubernetes 集群中，并从您的存储库中提取源代码。然后，Argo 无需手动配置管道即可为您应用更改。

此模型比基于推送的工作流更安全。您不必公开集群的 API 服务器或在 CI/CD 平台中存储 Kubernetes credentials。破坏源存储库只会使攻击者能够访问您的代码，而不是你的集群。

### 为什么选择Argo CD？

应用程序定义、配置和环境应具有声明性和版本控制。应用程序部署和生命周期管理应该是自动化的、可审计的且易于理解的。

### 快速入门 

#### 前置条件
- 安装 kubectl 命令行工具
- 有一个 kubeconfig 文件（默认位置是 ~/.kube/config）

### 安装命令

```sh
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```
这将创建一个新的命名空间 argocd ，Argo CD 服务和应用程序资源将驻留在其中。
:::tip
安装清单包括引用 argocd 命名空间的 ClusterRoleBinding 资源。如果要将Argo CD安装到不同的命名空间中，请确保更新命名空间引用
:::

此默认安装将具有自签名证书，如果不进行一些额外的工作，则无法访问。执行以下操作之一：

- 按照说明配置证书（并确保客户端操作系统信任它）
- 将客户端操作系统配置为信任自签名证书
- 在本指南中的所有 Argo CD CLI 操作上使用 --insecure 标志

Argo的所有组件可能需要几秒钟才能在您的集群中运行。通过使用 Kubectl 列出 argocd 命名空间中的部署来监视进度。

```sh
$ kubectl get deployments -n argocd
NAME                               READY   UP-TO-DATE   AVAILABLE   AGE
argocd-applicationset-controller   1/1     1            1           67s
argocd-dex-server                  1/1     1            1           67s
argocd-notifications-controller    1/1     1            1           67s
argocd-redis                       1/1     1            1           67s
argocd-repo-server                 1/1     1            1           67s
argocd-server                      1/1     1            1           67s
```

Kubectl 端口转发也可用于连接到 API 服务器，而无需公开服务

```sh
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

### 实际示例：使用 Argo CD 部署到 Kubernetes

让我们使用 Argo 在 Kubernetes 中运行一个基本的 NGINX Web 服务器实例。我们假设您已经可以访问 Kubernetes 集群，并且您的机器上已经拥有可用的 Kubectl 和 Helm CLI。

#### 创建应用的 GitHub 存储库

首先，前往 GitHub 并为您的应用程序创建一个新的存储库。之后，将您的存储库克隆到您的计算机，准备提交您的 Kubernetes 清单

```sh
$ git clone https://github.com/<username>/<repo>.git
```

复制以下 YAML 并将其另存为 deployment.yaml 在存储库中

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: argo-demo
  labels:
    app.kubernetes.io/name: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app.kubernetes.io/name: nginx
  template:
    metadata:
      labels:
        app.kubernetes.io/name: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
          - name: http
            containerPort: 80
```   


它定义了一个运行三个 NGINX 副本的基本 Kubernetes 部署对象

接下来，复制第二个 YAML 文件并将其保存到 service.yaml 。它会设置负载均衡器服务以在群集外部公开部署

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  namespace: argo-demo
spec:
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: http
```      
最后，添加一个将创建应用程序命名空间的清单：

```yaml 
apiVersion: v1
kind: Namespace
metadata:
  name: argo-demo
```

将更改提交到存储库，然后将其推送到 GitHub：
```sh
$ git add .
$ git commit -m "Added initial Kubernetes YAML files"
$ git push
```

您已准备好安装 Argo 并开始部署您的应用程序。
![](https://raw.githubusercontent.com/mouuii/picture/master/install-argo-cd.png)

#### 获取 Argo 命令行界面

Argo的CLI允许您从终端与应用程序进行交互。稍后您将需要它来向 Argo 实例注册您的应用程序。

您可以从 GitHub 下载最新的 CLI 版本。为您的平台选择正确的二进制文件，然后使其可执行并将其移动到路径中的某个位置。以下步骤适用于大多数 Linux 系统 - 首先替换最新版本号而不是下面的 2.6.1：
```sh
$ wget https://github.com/argoproj/argo-cd/releases/download/v2.6.1/argocd-linux-amd64
$ chmod +x argocd-linux-amd64
$ mv argocd-linux-amd64 /usr/bin/argocd
```

在登录之前，您需要检索默认管理员用户的密码。这是在Argo的安装过程中自动生成的。可以通过运行以下 argocd 命令来访问它：

使用这些凭据登录到Argo

进入后，直接转到左侧边栏中的“用户信息”项，然后单击屏幕顶部的“更新密码”按钮。按照提示将您的密码更改为唯一的密码

![](https://raw.githubusercontent.com/mouuii/picture/master/argo-cd-Update-Password.png)

#### Login to the CLI 登录到命令行界面

要登录到 Argo CLI，请运行 argocd login 并提供 API 服务器的 URL 作为参数：

```sh
$ argocd login localhost:8080
```

与上面遇到的浏览器警告类似，如果您尚未配置自己的TLS，系统将提示您接受Argo的内置自签名证书：

通过键入 y 并按回车键接受提示。然后，系统会要求您输入用户名和密码。CLI 应成功向您的 Argo 实例进行身份验证：

```sh
'admin:login' logged in successfully
Context 'localhost:8080' updated
```

#### 使用 Argo 部署您的应用程序

一切准备就绪，可以开始将应用程序部署到 Argo！首先，运行以下 CLI 命令来注册应用：

```sh
$ argocd app create argo-demo \
  --repo https://github.com/<username>/<repo>.git \
  --path . \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace argo-demo
application 'argo-demo' created
```

让我们解释这里发生的事情：
- --repo 标志指定 Git 存储库的 URL。
- --path 标志指示 Argo 在存储库的此路径中搜索 Kubernetes 清单、Helm 图表和其他可部署资产。 此处使用 . 是因为示例清单存储在存储库的根目录中。
- --dest-server 标志指定要部署到的 Kubernetes 群集的 URL。在部署到运行 Argo 的同一群集时，可以使用 kubernetes.default.svc 。
- --dest-namespace 设置应用将部署到的 Kubernetes 命名空间。这应与资源上设置的 metadata.namespace 字段匹配。


您的应用程序现在将在 Argo 中注册。您可以使用 argocd app list 命令检索其详细信息：

```sh
NAME              CLUSTER                         NAMESPACE   PROJECT  STATUS     HEALTH   SYNCPOLICY  CONDITIONS  REPO                                                   PATH  TARGET
argocd/argo-demo  https://kubernetes.default.svc  argo-demo   default  OutOfSync  Missing  <none>      <none>      https://github.com/ilmiont/spacelift-argo-cd-demo.git
```

该应用程序还显示在Argo UI中：

![](https://raw.githubusercontent.com/mouuii/picture/master/argo-cd-ui.png)

#### Your First Sync 您的首次同步

应用显示为“缺失”和“不同步”。创建应用不会自动将其同步到群集中。立即执行同步，让 Argo 应用存储库内容当前定义的目标状态：

```sh
$ argocd app sync argo-demo
...
GROUP  KIND        NAMESPACE  NAME       STATUS   HEALTH       HOOK  MESSAGE
       Namespace   argo-demo  argo-demo  Running  Synced             namespace/argo-demo created
       Service     argo-demo  nginx      Synced   Progressing        service/nginx created
apps   Deployment  argo-demo  nginx      Synced   Progressing        deployment.apps/nginx created
       Namespace              argo-demo  Synced                      
```       

同步结果显示在您的终端中。应会看到命名空间、服务和部署对象都同步到群集中，如上面的命令输出所示。所有三个对象的消息都确认它们已成功创建。

重复 apps list 命令以检查应用的新状态

```sh
$ argocd app list
NAME              CLUSTER                         NAMESPACE  PROJECT  STATUS  HEALTH   SYNCPOLICY  CONDITIONS  REPO                                                   PATH  TARGET
argocd/argo-demo  https://kubernetes.default.svc  argo-demo  default  Synced  Healthy  <none>      <none>      https://github.com/ilmiont/spacelift-argo-cd-demo.git  .   
```

现在应用程序已同步且健康！它在Argo UI中也是绿色的：

![](https://raw.githubusercontent.com/mouuii/picture/master/argo-cd-synced-app.png)

作为最终证明，请使用 Kubectl 检查应用命名空间中的部署。这应确认 nginx 已启动并运行三个副本：

```sh
$ kubectl get deployment -n argo-demo
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
nginx   3/3     3            3           7m56s
```

#### Syncing App Updates 同步应用更新

现在，让我们对应用进行更改。修改 deployment.yaml 中的 spec.replicas 字段，以便部署中现在有五个 Pod：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: argo-demo
  labels:
    app.kubernetes.io/name: nginx
spec:
  replicas: 5
  ...
```  
提交并推送更改
```sh
$ git add .
$ git commit -m "Run 5 replicas"
$ git push
```

接下来，重复 argocd app sync 命令以将更改应用于群集。或者，您可以单击用户界面中的“同步”按钮。

Argo 从存储库刷新应用的目标状态，然后执行操作来转换实时状态。部署已重新配置，现在运行五个 Pod：

```sh
$ kubectl get deployment -n argo-demo
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
nginx   5/5     5            5           12m
```

#### 启用自动同步

在重复同步命令之前，对五个副本的更改不适用。不过，Argo 可以自动同步存储库中的更改，无需每次都发出命令。这完全自动化了您的交付工作流程。

您可以通过单击用户界面中的“应用程序详细信息”按钮并向下滚动到“同步策略”部分来激活应用程序的自动同步。单击“启用自动同步”按钮。

![](https://raw.githubusercontent.com/mouuii/picture/master/argo-cd-Enabling-Auto-Sync.png)

还可以通过运行以下命令使用 CLI 启用自动同步：`$ argocd app set argo-demo --sync-policy automated`

默认情况下，自动同步每三分钟运行一次。如果需要更频繁的部署，您可以通过修改 Argo 的配置映射来更改此值。


### 总结

Argo CD 是 Kubernetes 的持续交付工具。它提供基于拉取的 GitOps 工作流，用于自动将源存储库与群集内部署同步。虽然本文只介绍了基础知识，但 Argo 为您提供了一个完整的工具包，用于部署应用程序、检查其运行状况以及快速回滚任何失败的更改。

ps: 友情链接 ： https://spacelift.io/blog/argocd