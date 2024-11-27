---
sidebar_label: kustomize
sidebar_position: 1
title: kustomize
---


## 介绍
Kustomize 是一个 Kubernetes 原生配置管理工具，可以轻松安装和使用。如果您是为组织编写 Kubernetes 清单文件的 DevOps 工程师，您可能已经知道处理多个环境的应用程序清单文件是一项繁琐的任务。当我第一次开始使用 Kubernetes 时，我曾经为不同的环境（如开发、暂存、生产等）创建同一清单文件的多个副本。在大多数情况下，不同环境的清单文件中的唯一更改是其资源名称、命名空间值、标签和图像。除此之外，大多数值在所有环境中都是相同的。如果我们使用这种方法，缺点是，如果我们想添加一个新容器或将端口号更改为我们现有的清单文件，我们需要在每个环境的清单文件中更改/添加该值。这个过程也很容易出错。如果我们忘记在任何环境中进行该更改，则该环境将在我们应用该更改时失败。下面给出了我们之前用于不同环境的目录结构的示例：

https://miro.medium.com/v2/resize:fit:790/format:webp/1*oBF30ogXqriJb2M_pQlcww.png

像Kustomize和Helm这样的工具可以用来避免这些困难。Kustomize 遍历 Kubernetes 清单以添加、删除或更新配置选项。Kustomize 可用于从基本清单文件为每个环境创建清单文件。即，如果我们有一组用于某个环境的清单文件，我们可以使用 Kustomize 对这些清单文件进行必要的更改并将其用于其他环境，而无需创建基本清单文件的多个副本。

## 用例

考虑一个简单的应用程序部署，我们随身携带了它的“deployment.yaml”文件。此外，我们需要将此应用程序部署到 3 个环境（即开发、暂存和生产）。在所有这 3 个环境中，deployment.yaml 文件的基础结构是相同的，并且部署名称、命名空间以及我们使用的图像都发生了变化。在正常情况下，我们的选择是为 3 个环境创建 3 个 deployment.yaml 清单文件。但是，通过使用 Kustomize 工具，我们可以使用现有的 deployment.yaml 文件作为基础，然后使用一个名为“kustomization.yaml”的文件，其中包含 3 个环境的更改/补丁。通过这种方式，我们避免了为每个环境创建和管理单独的清单文件的困难。

## 安装 kustomize

我们可以使用官方文档直接安装 Kustomize。它可以使用源代码，二进制文件，作为Docker映像，自制软件，巧克力味等进行安装。下面给出了根据您的操作系统安装 Kustomize 的链接。

Link: https://kubectl.docs.kubernetes.io/installation/kustomize/

## 什么是 kustomization.yaml

kustomization文件是一个称为Kustomization的Kubernetes资源模型（KRM）对象的YAML规范。kustomization 描述了如何生成或转换其他 KRM 对象。

尽管大多数实用的 kustomization 文件实际上并不看起来像这样，但 kustomization.yaml 文件基本上是四个列表：

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- {pathOrUrl}
- ...

generators:
- {pathOrUrl}
- ...

transformers:
- {pathOrUrl}
- ...

validators:
- {pathOrUrl}
- ...
```

在所有情况下， {pathOrUrl} 列表条目都可以指定
- 包含一个或多个 KRM 对象的 YAML 文件的文件系统路径
- 包含 kustomization.yaml 文件的目录（本地或远程 Git 存储库中）。

在后一种情况下，kustomization被递归构建（也称为水合）到 KRM 对象的平面列表中，这些对象按顺序有效地注入到封装列表中。当这种情况发生时，encapsulating kustomization可以称为 overlay，它所指的可以称为 base。

典型布局：
```shell
app1/
  kustomization.yaml
    | resources:
    | - ../base
    | patches:
    | - patch1.yaml
  patch1.yaml

app2/
  kustomization.yaml
    | resources:
    | - ../base
    | patches:
    | - patch2.yaml
  patch2.yaml

base/
  kustomization.yaml
    | resources:
    | - deployment.yaml
    | - configMap.yaml
  deployment.yaml
  configMap.yaml
```  

在 resources 下，读取 KRM yaml 文件或执行递归库切的结果将成为当前构建阶段的输入对象列表。

在 generators 、 transformers 和 validators 下，读取/冻结的结果是 KRM 对象列表，这些对象配置了 kustomize 预期执行的操作。

这些配置指定了一些可执行文件（例如插件）以及该可执行文件的配置。例如，副本计数转换器的配置必须指定能够解析和修改部署的可执行文件，以及要在部署的 replicas 字段中使用的实际数值（或增量）。

构建阶段首先处理 resources ，然后处理 generators ，添加到正在考虑的资源列表中，然后处理 transformers 以修改列表，最后运行 validators 以检查列表是否存在任何错误。