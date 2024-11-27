---
sidebar_label: 02-写第一个api
sidebar_position: 2
title: 02-写第一个api
---

## 学习目标
在上一节，我们初始化了一个helloword项目并成功访问 *localhost:8000/helloworld/{name}* 接口，这章我们来学习下如何自己写一个接口并且访问数据库。

## 定义 API ，生成文档、代码

API 与用户的通信协议，通常是 REST API 和 RPC API 作为传输层协议，而 Kratos 主要参考 Google API 指南，实现了对应通信协议支持，并且遵守了 gRPC API 使用 HTTP 映射功能进行 JSON/HTTP 的支持。也就是通过定义 proto 即可使用 REST API 和 RPC API，通过类似 Google API 的仓库方式进行 API Schema 的管理。

我们打开 api 目录 ，打开 api/agent/v1/agent.proto 文件。

![](https://raw.githubusercontent.com/mouuii/picture/master/%E6%88%AA%E5%B1%8F2023-06-15%20%E4%B8%8B%E5%8D%886.33.53.png)


上面使用了 proto 来定义 api ，如果你没接触过 proto 语法也没事，我来讲解一下。

图片上 `agent.proto` 文件是我们用来定义接口的，我们看下 `CreateAgent` 这个 rpc 函数，该函数接收 `CreateAgentRequest` 结构体，返回 `CreateAgentReply` 结构体。

我们引用了 *google/api/annotations.proto* 这个 grpc 插件，它能够通过写注释的方式来生成 http 相关的代码，比如帮我们把前端传过来的参数解析到结构体 `CreateAgentRequest` 上，帮我们注册路由等。

我们来看下 gprc 插件 `google.api.http` 中我们能定义的成员：

```proto

extend google.protobuf.MethodOptions {
  // See `HttpRule`.
  HttpRule http = 72295728;
}

message HttpRule {

  // Determines the URL pattern is matched by this rules. This pattern can be
  // used with any of the {get|put|post|delete|patch} methods. A custom method
  // can be defined using the 'custom' field.
  oneof pattern {
    // Maps to HTTP GET. Used for listing and getting information about
    // resources.
    string get = 2;

    // Maps to HTTP PUT. Used for replacing a resource.
    string put = 3;

    // Maps to HTTP POST. Used for creating a resource or performing an action.
    string post = 4;

    // Maps to HTTP DELETE. Used for deleting a resource.
    string delete = 5;

    // Maps to HTTP PATCH. Used for updating a resource.
    string patch = 6;
  }

  // The name of the request field whose value is mapped to the HTTP request
  // body, or `*` for mapping all request fields not captured by the path
  // pattern to the HTTP body, or omitted for not having any HTTP request body.
  //
  // NOTE: the referred field must be present at the top-level of the request
  // message type.
  string body = 7;
}
```

我们可以定义 http 方法，url，如果我们需要使用 post 方法并绑定参数，我们可以这样写：
```proto
    rpc Login (LoginRequest) returns (LoginResponse) {
        option (google.api.http) = {
            post: "/account/login"
            body: "*"
        };
    }
```


### 生成OpenAPi【接口文档】

OpenAPI 文档是一份可交付的技术内容，其中包含了如何使用和集成 API 的说明，OpenAPI 文档中，包含了集成 OpenAPI 所需的完整信息，如请求参数，返回参数等。在实际的项目开发过程中，对于程序员来说，OpenAPI 文档是再熟悉不过的东西，大多数开发团队中，只要涉及到前后端交互，OpenAPI 文档就会作为沟通前后端开发的桥梁，所以需要一个简单，高效，便捷的 OpenAPI 文档生成工具。

kratos 已经帮我们安装好了OpenAPI插件，我们只需要在根目录执行在根目录运行 `make api`

成功执行上述命令后，会生成 openapi.yaml 文件。您可以将其导入到支持 OpenAPI 规范以供浏览的任何平台中，例如 apifox

```yaml
# Generated with protoc-gen-openapi
# https://github.com/google/gnostic/tree/master/apps/protoc-gen-openapi

openapi: 3.0.3
info:
    title: Greeter
    description: The greeting service definition.
    version: 0.0.1
paths:
    /helloworld/{name}:
        get:
            summary: Sends a greeting
            operationId: Greeter_SayHello
            parameters:
                - name: name
                  in: query
                  schema:
                    type: string
            responses:
                "200":
                    description: OK
                    content:
                        application/json:
                            schema:
                                $ref: '#/components/schemas/HelloReply'
components:
    schemas:
        HelloReply:
            properties:
                message:
                    type: string
            description: The response message containing the greetings
```

### 生成go代码【*】

使用生成代码的方式来统一团队代码风格以及提高开发效率，执行上述命令，命令执行完后就能看到目录生成了多个 go 源文件：

```shell
# 生成 proto 模板
kratos proto add api/agent/v1/agent.proto
# 生成 client 源码
kratos proto client api/agent/v1/agent.proto
# 生成 server 源码
kratos proto server  api/agent/v1/agent.proto -t internal/service
```



### 删除示例代码

由于我们是使用 wire 来自动生成构造函数，因此我们想要将原来的 helloword api service 替换成 agent 需要修改点代码。

1. service 目录下 service.go

修改 internal/service/service.go 里依赖注入部分:

![](https://raw.githubusercontent.com/mouuii/picture/master/%E6%88%AA%E5%B1%8F2023-06-17%20%E4%B8%8A%E5%8D%889.52.20.png)

2. 在 internal/server 目录下，修改 http.go, grpc.go

![](https://raw.githubusercontent.com/mouuii/picture/master/%E6%88%AA%E5%B1%8F2023-06-17%20%E4%B8%8A%E5%8D%889.52.47.png)

![](https://raw.githubusercontent.com/mouuii/picture/master/%E6%88%AA%E5%B1%8F2023-06-17%20%E4%B8%8A%E5%8D%889.52.54.png)

3. 执行 `make all` , 有地方报错的话再修改下细节，如果你还不清楚的话，可以看下代码仓库中的提交历史记录。


## 接入 ORM

### 什么是 ORM？

面向对象编程和关系型数据库，都是目前最流行的技术，但是它们的模型是不一样的。

面向对象编程把所有实体看成对象（object），关系型数据库则是采用实体之间的关系（relation）连接数据。很早就有人提出，关系也可以用对象表达，这样的话，就能使用面向对象编程，来操作关系型数据库。

简单说，ORM 就是通过实例对象的语法，完成关系型数据库的操作的技术，是"对象-关系映射"（Object/Relational Mapping） 的缩写。

ORM 把数据库映射成对象。

- 数据库的表（table） --> 类（class）
- 记录（record，行数据）--> 对象（object）
- 字段（field）--> 对象的属性（attribute）
举例来说，下面是一行 SQL 语句。

```sql
SELECT id, first_name, last_name, phone, birth_date, sex
FROM persons
WHERE id = 10
```
程序直接运行 SQL，操作数据库的写法如下。
```go
res = db.execSql(sql);
name = res[0]["FIRST_NAME"];
```
改成 ORM 的写法如下。

```go
p = Person.get(10);
name = p.first_name;
```
一比较就可以发现，ORM 使用对象，封装了数据库操作，因此可以不碰 SQL 语言。开发者只使用面向对象编程，与数据对象直接交互，不用关心底层数据库。

ORM 有下面这些优点:

- 数据模型都在一个地方定义，更容易更新和维护，也利于重用代码。
- ORM 有现成的工具，很多功能都可以自动完成，比如数据消毒、预处理、事务等等。
- 它迫使你使用 MVC 架构，ORM 就是天然的 Model，最终使代码更清晰。
- 基于 ORM 的业务代码比较简单，代码量少，语义性好，容易理解。
- 你不必编写性能不佳的 SQL。

ORM 也有很突出的缺点：

- ORM 库不是轻量级工具，需要花很多精力学习和设置。
- 对于复杂的查询，ORM 要么是无法表达，要么是性能不如原生的 SQL。
- ORM 抽象掉了数据库层，开发者无法了解底层的数据库操作，也无法定制一些特殊的 SQL。

### 什么是 ent

ent 是 Facebook 开源的一个 ORM 框架，其结合 Facebook 的业务风格而诞生，比较新颖地使用节点和线条构建出数据流图来表示数据库中字段、表、之间的关系，现在已经被 Facebook 用在了生产环境(虽然 GitHub 上说该项目是 experimental 的),概括来说具有以下特色：

- 图就是代码 - 将任何数据库表建模为 Go 对象。
轻松地遍历任何图形 - 可以轻松地运行查询、聚合和遍历任何图形结构。
静态类型和显式 API - 使用代码生成静态类型和显式 API，查询数据更加便捷。
多存储驱动程序 - 支持 MySQL、PostgreSQL、SQLite 和 Gremlin。
可扩展 - 简单地扩展和使用 Go 模板自定义。

### 安装脚手架工具 entc

go install entgo.io/ent/cmd/ent@latest

### 创建实体

schema 相当于数据库的表，有两种方法可以实现：

### 使用 ent init 生成

```shell
ent init User
````
将会在 {当前目录}/ent/schema/ 下生成一个user.go文件:

```go
package schema

import "entgo.io/ent"

// User holds the schema definition for the User entity.
type User struct {
    ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
    return nil
}

// Edges of the User.
func (User) Edges() []ent.Edge {
    return nil
}
```

### sql 转换工具

网上有人好心的制作了一个工具，可以将 SQL 转换成 schema 代码，非常方便！

SQL 转 Schema 工具： https://printlove.cn/tools/sql2ent

比如我们有一个创建表的 SQL

```sql
CREATE TABLE `user`  (
`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
`type` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;
```

转换之后，生成如下代码：

```go
package schema

import (
 "entgo.io/ent"
 "entgo.io/ent/dialect"
 "entgo.io/ent/schema/field"
)

// User holds the schema definition for the User entity.
type User struct {
 ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {

 return []ent.Field{

  field.Int32("id").SchemaType(map[string]string{
   dialect.MySQL: "int(10)UNSIGNED", // Override MySQL.
  }).NonNegative().Unique(),

  field.String("email").SchemaType(map[string]string{
   dialect.MySQL: "varchar(50)", // Override MySQL.
  }),

  field.String("type").SchemaType(map[string]string{
   dialect.MySQL: "varchar(20)", // Override MySQL.
  }),

  field.Time("created_at").SchemaType(map[string]string{
   dialect.MySQL: "timestamp", // Override MySQL.
  }).Optional(),

  field.Time("updated_at").SchemaType(map[string]string{
   dialect.MySQL: "timestamp", // Override MySQL.
  }).Optional(),
 }

}

// Edges of the User.
func (User) Edges() []ent.Edge {
 return nil
}
```

### 生成代码

有了以上的 Schema，我们就可以生成代码了。

我们命令行进入 ent 的上一层文件夹，然后执行以下命令：

```shell
ent generate ./ent/schema
```

但是用命令行的方式其实是很不方便的，主要是有时候需要带一些特殊的参数，比如：--feature sql/modifier，这就很麻烦了。但好在 go 有一个很赞的特性go:generate，我们可以在 ent 文件夹下面创建一个generate.go文件：

```go
package ent

//go:generate go run -mod=mod entgo.io/ent/cmd/ent generate --feature privacy --feature sql/modifier --feature entql --feature sql/upsert ./schema
```

接着我们可以在项目的根目录下运行命令执行整个项目的go:generate：
```shell
go generate ./...
```

或者指定执行这一个generate.go文件：
```shell
go generate ./ent
```

自此所有的预备工作就做好了。

### ent 的一些数据库基本操作
```go
// 增
pedro := client.Pet.    // PetClient.
    Create().           // Pet create builder.
    SetName("pedro").   // Set field value.
    SetOwner(a8m).      // Set owner (unique edge).
    SaveX(ctx)          // Create and return.

// 删
err := client.User.
    DeleteOneID(id).
    Exec(ctx)

// 查
names, err := client.Pet.
    Query().
    Select(pet.FieldName).
    Strings(ctx)    
```    

## 整合进 kratos

官方推荐的包结构是这样的：

```shell
|- data
|- biz
|- service
|- server
```

那么，我们可以把 ent 放进 data 文件夹下面去：

```shell
|- data
| |- ent
|- biz
|- service
|- server
```

### 创建数据库客户端

接着在 data.go 文件中添加创建数据库客户端的代码，使用 **wire** 将之注入到ProviderSet：
```go
// ProviderSet is data providers.
var ProviderSet = wire.NewSet(
    NewEntClient,
    ...
)

// Data .
type Data struct {
    db  *ent.Client
}

// NewEntClient 创建数据库客户端
func NewEntClient(conf *conf.Data, logger log.Logger) *ent.Client {
 l := log.NewHelper(log.With(logger, "module", "ent/data"))

 client, err := ent.Open(
  conf.Database.Driver,
  conf.Database.Source,
 )
 if err != nil {
  l.Fatalf("failed opening connection to db: %v", err)
 }
 // 运行数据库迁移工具
 if true {
  if err := client.Schema.Create(context.Background(), migrate.WithForeignKeys(false)); err != nil {
   l.Fatalf("failed creating schema resources: %v", err)
  }
 }
 return client
}
```

需要说明的是数据库迁移工具，如果数据库中不存在表，迁移工具会创建一个；如果字段存在改变，迁移工具会对字段进行修改。

### 创建 UseCase

在 biz 文件夹下创建user.go：

```go
package biz

type UserRepo interface {
 List(ctx context.Context, req *pagination.PagingRequest) (*v1.ListUserResponse, error)
 Get(ctx context.Context, req *v1.GetUserRequest) (*v1.User, error)
 Create(ctx context.Context, req *v1.CreateUserRequest) (*v1.User, error)
 Update(ctx context.Context, req *v1.UpdateUserRequest) (*v1.User, error)
 Delete(ctx context.Context, req *v1.DeleteUserRequest) (bool, error)
}

type UserUseCase struct {
 repo UserRepo
 log  *log.Helper
}

func NewUserUseCase(repo UserRepo, logger log.Logger) *UserUseCase {
 l := log.NewHelper(log.With(logger, "module", "user/usecase"))
 return &UserUseCase{repo: repo, log: l}
}

func (uc *UserUseCase) List(ctx context.Context, req *pagination.PagingRequest) (*v1.ListUserResponse, error) {
 return uc.repo.ListUser(ctx, req)
}

func (uc *UserUseCase) Get(ctx context.Context, req *v1.GetUserRequest) (*v1.User, error) {
 return uc.repo.GetUser(ctx, req)
}

func (uc *UserUseCase) Create(ctx context.Context, req *v1.CreateUserRequest) (*v1.User, error) {
 return uc.repo.CreateUser(ctx, req)
}

func (uc *UserUseCase) Update(ctx context.Context, req *v1.UpdateUserRequest) (*v1.User, error) {
 return uc.repo.UpdateUser(ctx, req)
}

func (uc *UserUseCase) Delete(ctx context.Context, req *v1.DeleteUserRequest) (bool, error) {
 return uc.repo.DeleteUser(ctx, req)
}
```

注入到biz.ProviderSet

```go
// ProviderSet is biz providers.
var ProviderSet = wire.NewSet(
    NewUserUseCase,
    ...
)
```

### 创建 repo

在 data 文件夹下创建user.go文件，实际操作数据库客户端的操作都在此做。

```go
package data

var _ biz.UserRepo = (*UserRepo)(nil)

type UserRepo struct {
 data *Data
 log  *log.Helper
}

func NewUserRepo(data *Data, logger log.Logger) biz.UserRepo {
 l := log.NewHelper(log.With(logger, "module", "User/repo"))
 return &UserRepo{
  data: data,
  log:  l,
 }
}

func (r *userRepo) Delete(ctx context.Context, req *v1.DeleteUserRequest) (bool, error) {
 err := r.data.db.User.
  DeleteOneID(req.GetId()).
  Exec(ctx)
 return err != nil, err
}
```

注入到data.ProviderSet

```go

// ProviderSet is data providers.
var ProviderSet = wire.NewSet(
    NewUserRepo,
    ...
)
```

### 修改配置文件

修改 configs/config.yaml ，保障mysql能连接上。

```yaml
server:
  http:
    addr: 0.0.0.0:8000
    timeout: 1s
  grpc:
    addr: 0.0.0.0:9000
    timeout: 1s
data:
  database:
    driver: mysql
    source: root:root@tcp(127.0.0.1:3306)/shop_user?charset=utf8mb4&parseTime=True&loc=Local
  redis:
    addr: 127.0.0.1:6379
    dial_timeout: 1s
    read_timeout: 0.2s
    write_timeout: 0.2s
```
### wire

Wire 是一个灵活的依赖注入工具，通过自动生成代码的方式在编译期完成依赖注入。

在各个组件之间的依赖关系中，通常鼓励显式初始化，而不是全局变量传递。

所以通过 Wire 进行初始化代码，可以很好地解决组件之间的耦合，以及提高代码维护性。

#### 工作原理
Wire 具有两个基本概念：Provider 和 Injector。

Provider 是一个普通的 Go Func ，这个方法也可以接收其它 Provider 的返回值，从而形成了依赖注入；

```go
// 提供一个配置文件（也可能是配置文件）
func NewConfig() *conf.Data {...}

// 提供数据组件，依赖了数据配置（初始化 Database、Cache 等）
func NewData(c *conf.Data) (*Data, error) {...}

// 提供持久化组件，依赖数据组件（实现 CURD 持久化层）
func NewUserRepo(d *data.Data) (*UserRepo, error) {...}
```

#### 使用方式
在 Kratos 中，主要分为 server、service、biz、data 服务模块，会通过 Wire 进行模块顺序的初始化；

![](https://go-kratos.dev/images/wire.png)
在每个模块中，只需要一个 ProviderSet 提供者集合，就可以在 wire 中进行依赖注入；

并且我们在每个组件提供入口即可，不需要其它依赖，例如：

```shell
-data
--data.go    // var ProviderSet = wire.NewSet(NewData, NewGreeterRepo)
--greeter.go // func NewGreeterRepo(data *Data, logger log.Logger) biz.GreeterRepo {...}
```
然后通过 wire.go 中定义所有 ProviderSet 可以完成依赖注入配置。

#### 初始化组件

通过 wire 初始化组件，需要定义对应的 wire.go，以及 kratos application 用于启动管理。

```go
// 应用程序入口
cmd
-main.go
-wire.go
-wire_gen.go

// main.go 创建 kratos 应用生命周期管理
func newApp(logger log.Logger, hs *http.Server, gs *grpc.Server, greeter *service.GreeterService) *kratos.App {
    pb.RegisterGreeterServer(gs, greeter)
    pb.RegisterGreeterHTTPServer(hs, greeter)
    return kratos.New(
        kratos.Name(Name),
        kratos.Version(Version),
        kratos.Logger(logger),
        kratos.Server(
            hs,
            gs,
        ),
    )
}

// wire.go 初始化模块
func initApp(*conf.Server, *conf.Data, log.Logger) (*kratos.App, error) {
    // 构建所有模块中的 ProviderSet，用于生成 wire_gen.go 自动依赖注入文件
    panic(wire.Build(server.ProviderSet, data.ProviderSet, biz.ProviderSet, service.ProviderSet, newApp))
}
```
在项目的 main 目录中，运行 `make all` 进行生成编译期依赖注入代码：

## 课后实践

- 下载示例代码切换到对应 commit
- 运行 `make all`
- 运行 `kratos run`
- 访问接口
- 查看数据库是否变更


## 参考资料

- 示例代码： https://github.com/mouuii/kratos-tutorial  (commit: ae3560)
- wire：https://go.dev/blog/wire
- ent：https://entgo.io/docs/getting-started/
- grpc、proto: https://grpc.io/
- 公众号：https://mp.weixin.qq.com/s/73uUa65GBEokYcEk-5aO4Q
- api定义：https://cloud.google.com/apis/design
- proto规范：https://go-kratos.dev/docs/guide/api-protobuf/