---
slug: Kubernetes GitOps：初学者指南和实践教程
title: Kubernetes GitOps：初学者指南和实践教程
authors: mouuii
tags: [devops]
---

### 背景
多年来，Kubernetes 已成为全世界的话题。它彻底改变了容器的编排，并已成为该领域的领导者。许多开发人员喜欢使用 Kubernetes。虽然组织更喜欢在 Kubernetes 上部署应用程序以应对规模和苛刻的资源，但与 Kubernetes 相关的部署正在流行一种新的方法 - GitOps。

是的，GitOps 提供了一种流畅的方法和一组实践来利用 Git 等简单工具来管理基础结构和应用程序部署。通过结合 Kubernetes 和 GitOps，组织可以获得灵活性、敏捷性、规模、性能、效率和更快的功能交付的巨大好处。

在这本 Kubernetes 和 GitOps 指南中，我有一个分步的初学者级教程，用于开始使用 Kubernetes 实现 GitOps。是时候将应用程序部署提升到一个新的水平了。让我们开始吧！

### 简单的 GitOps 工作流

GitOps 基本上的工作原理是让 Git 成为事实的来源，包括将所有内容移动到代码中以及在 Git 中存储和维护所有内容。在部署方面，请使用运算符以声明方式部署在 Git 和 Yaml 中配置的内容。由于所有开发人员主要对 Git 友好，因此 GitOps 简化了他们复杂的工作流程。

![](https://raw.githubusercontent.com/mouuii/picture/master/xolzvw5562ewy0a26emj.png)

因此，当涉及到 Kubernetes 时，应用程序代码、容器映像和所有相关清单文件都将存储在 Git 中，任何更改都将通过 Git 作为单一事实来源进行。

今天，我们将在下面的教程中向您展示如何开始使用应用程序的 GitOps 方法。

### 先决条件
- 在本教程中，我们将使用持续交付工具（如 Harness）来执行 GitOps。因此，创建一个免费的Harness帐户。它使用Argo CD-as-a-Service。
- GitHub 帐户和要试验的示例存储库。我有一个[示例存储库](https://github.com/pavanbelagatti/argocd-example-apps)，您可以fork并使用。

### 教程

注册到 harness 帐户，验证电子邮件，然后重新登录以设置 GitOps Pipeline 。您将看到以下部署选项 - Kubernetes 和 Kubernetes with GitOps。选择“Kubernetes with GitOps”并继续。

![](https://raw.githubusercontent.com/mouuii/picture/master/354716di5f5c27n1rn0m.png)

您不必担心任何设置和安装。安全带可以照顾一切。它通过预配托管代理连接到 Harness。
您可以单击“配置”并等待一段时间，以便为您的代理显示绿色复选框。

![](https://raw.githubusercontent.com/mouuii/picture/master/ij7zkohxdhfgplrsqcqr.png)

![](https://raw.githubusercontent.com/mouuii/picture/master/lmq2gg8ex8fhn567rz83.png)

成功安装代理后，请转到下一个配置，在这里，我们提供简单的详细信息，例如源，身份验证和Git详细信息。

从选项中选择 Git 并拥有源代码。添加我们的 Git 存储库链接 - https://github.com/pavanbelagatti/argocd-example-apps

注意：上面显示的是我的 GitHub 存储库链接，您应该添加您的存储库链接，即您在本教程开头 fork 的链接。

添加这些详细信息后，请确保添加“匿名”以验证您的详细信息。[顺便说一句，这是一个公共存储库，因此不需要用户名和密码进行身份验证]

![](https://raw.githubusercontent.com/mouuii/picture/master/daw25b7gf5p9r3kosz3s.jpeg)

确保身份验证成功。

接下来，让我们添加其他必需的 Git 详细信息，如下所示。
![](https://raw.githubusercontent.com/mouuii/picture/master/uwwgv8htrqa3ha1jzpps.png)

选择“Target revision”作为“master”，选择“Path”作为“helm-guestbook”
![](https://raw.githubusercontent.com/mouuii/picture/master/5gzqloilmt7wm5g41ofd.png)

接下来，选择“Harness Hosted”以测试 GitOps 工作流。您也可以选择自我管理。但在本教程中，我们将选择“Harness Hosted”。
![](https://raw.githubusercontent.com/mouuii/picture/master/jtym7hmxdkddygtte2d0.png)

单击“Connect to Cluster”按钮并确保连接成功。

![](https://raw.githubusercontent.com/mouuii/picture/master/7ayjw2is97g71ixke0z4.png)

接下来，您将看到最后一步，我们将全部准备好部署应用程序。

![](https://raw.githubusercontent.com/mouuii/picture/master/i3h6lxak4rtqo0zqux6r.png)

单击“Create and Sync Application”。

这是您将输入的 GitOps 仪表板，所有 GitOps 详细信息都将在其中显示。

![](https://raw.githubusercontent.com/mouuii/picture/master/mj9e344qn7krdls7et8e.png)

您将看到“Sync”状态正在运行。

在一两分钟内，我们可以看到成功消息。

您可以从“Resource View”开始检查每个选项卡

![](https://raw.githubusercontent.com/mouuii/picture/master/9t18anv3il18804y68h7.png)

这些是下面显示的“App Details”选项卡功能。

![](https://raw.githubusercontent.com/mouuii/picture/master/5g52zdvj6oazo6m0a10h.png)

在同一选项卡中，您可以看到同步策略，它设置为“手动”，将其更改为“自动”。

![](https://raw.githubusercontent.com/mouuii/picture/master/csxbwmi6akuqowir60r3.jpeg)

这意味着，当 GitHub 存储库发生任何更改时，GitOps 代理将自动选择这些更改，并以自动方式进行同步。

下一个选项卡显示应用程序的同步状态。
![](https://raw.githubusercontent.com/mouuii/picture/master/x2k2jqfak2fqems3c7k3.png)


你可以看到集群实时应用拓扑图。
![](https://raw.githubusercontent.com/mouuii/picture/master/vsy71d0eee5gxk3spahy.jpeg)

这是我们来自示例存储库的 values.yaml 文件。

```yaml
# Default values for helm-guestbook.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

replicaCount: 4

image:
  repository: gcr.io/heptio-images/ks-guestbook-demo
  tag: 0.1
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  path: /
  hosts:
    - chart-example.local
  tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local

resources: {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with little
  # resources, such as Minikube. If you do want to specify resources, uncomment the following
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #  cpu: 100m
  #  memory: 128Mi
  # requests:
  #  cpu: 100m
  #  memory: 128Mi

nodeSelector: {}

tolerations: []

affinity: {}
```

现在，将 replicaCount: 4 从 4 更改为 5。

您应该看到 GitOps 代理将看到此差异并将应用此差异。突然，应用程序配置不同步。需要一些时间来匹配并返回到正常且成功的同步状态。

![](https://raw.githubusercontent.com/mouuii/picture/master/cil27c7smh2xstbp2m4h.jpeg)

可以看到第二个部署为“自动化”，因为我们将同步策略更改为自动化。

![](https://raw.githubusercontent.com/mouuii/picture/master/b18d2bp6ds4trg6w7g5h.png)

![](https://raw.githubusercontent.com/mouuii/picture/master/vxigyqovclx2z1gur1ad.jpeg)

在上面的资源视图中，您可以看到副本已匹配到 5，因为我们想要 5 个副本。

由于 GitOps 使用 Git 作为事实来源，它会记录谁提交了什么代码，以及是否有人更改了存储库中的某些内容。您可以从我们的 GitOps 仪表板中看到这一点。


![](https://raw.githubusercontent.com/mouuii/picture/master/55zrkgqb1cc5orqci3p8.jpeg)

这就是使用 Harness CD 通过 GitOps 方式部署应用程序的直观和简单之处。


Kubernetes GitOps 是处理复杂云原生应用程序部署的绝佳方法。由于它使用开发人员已经知道的像 Git 这样的简单工具，因此可以轻松学习和简化应用程序部署方法。使用 Kubernetes GitOps 使您的应用程序更加稳定、敏捷和高效。立即开始使用 GitOps！