---
sidebar_label: 03-swagger文档
sidebar_position: 3
title: 03-swagger文档
---

## Swagger-ui

在上一节我们介绍了 openapi，在运行 `make api` 命令时，我们使用 proto openapi 插件在当前文件生成了 openapi.yaml 文件，我们把该文件导入到 apifox 软件能够得到 api文档，这种方式可以进行 api 文档交付。但是有些同学比较喜欢 swagger-ui，想要在服务上提供 swagger 接口，下面我们来介绍下如何实现：

- 安装

首先安装插件到项目中
```shell
go get -u github.com/go-kratos/swagger-api
```
然后在internal/server/http.go的NewHTTPServer中进行初始化和注册，请尽量将这个路由注册放在最前面，以免匹配不到。

```go
import "github.com/go-kratos/swagger-api/openapiv2"

openAPIhandler := openapiv2.NewHandler()
srv.HandlePrefix("/q/", openAPIhandler)
```
- 使用

浏览器中访问服务的/q/swagger-ui/路径即可打开Swagger UI

![](https://raw.githubusercontent.com/mouuii/picture/master/%E6%88%AA%E5%B1%8F2023-06-27%20%E4%B8%8B%E5%8D%886.13.31.png)


## 修改 user 接口

如上图 swagger-ui 中所示，我们将原来的 helloword 接口改为 user/register, get 方法改成 post 方法， 在 body 中传用户名和年龄，并判断用户名是否重复，如果重复的话，返回错误信息。下图为调用用户注册接口，返回用户已注册错误截图：

![](https://raw.githubusercontent.com/mouuii/picture/master/%E6%88%AA%E5%B1%8F2023-06-27%20%E4%B8%8B%E5%8D%887.22.28.png)


使用 kratos 框架实现一个用户注册接口需要修改的文件有哪些呢？其中最主要的三层是 api 层 ，service 层， biz 层 ，data 层。
- api: 定义接口路径参数返回值



```go
// api/agent/v1/agent.proto 
	rpc RegistryUser (CreateUserRequest) returns (CreateUserReply){
		option (google.api.http) = {
			post: "/user/register"
			body: "*"
		};
	};
```

- service： 实现了 api 定义的服务层，类似 DDD 的 application 层，处理 DTO 到 biz 领域实体的转换(DTO -> DO)，同时协同各类 biz 交互，但是不应处理复杂逻辑

```go
// internal/service/agent.go
func (s *AgentService) CreateAgent(ctx context.Context, req *pb.CreateUserRequest) (*pb.CreateUserReply, error) {
	user, err := s.uc.Register(ctx, &biz.User{req.Name, req.Age})
	if err != nil {
		return nil, err
	}
	return &pb.CreateUserReply{
		Result: "hello" + user.Name,
	}, nil
}
```

- biz： 业务逻辑的组装层，类似 DDD 的 domain 层，data 类似 DDD 的 repo，而 repo 接口在这里定义，使用依赖倒置的原则。


```go
// internal/biz/user.go 判断用户是否重复，重复的话返回 ErrUserAlreadyExist
// Register creates a User, and returns the new User.
func (uc *UserUsecase) Register(ctx context.Context, u *User) (*User, error) {
	// 查询数据库是否有相同的用户名，如果有返回错误
	uc.log.WithContext(ctx).Infof("Register: %v", u.Name)
	isExist, err := uc.repo.ListByUserName(ctx, u.Name)
	if err != nil {
		return nil, err
	}
	if isExist {
		return nil, ErrUserAlreadyExist
	}
	return uc.repo.Save(ctx, u)
}

```

- data： 业务数据访问，包含 cache、db 等封装，实现了 biz 的 repo 接口。我们可能会把 data 与 dao 混淆在一起，data 偏重业务的含义，它所要做的是将领域对象重新拿出来，我们去掉了 DDD 的 infra层。

```go
// internal/data/user.go repo 层操作数据库
func (r *userRepo) Save(ctx context.Context, u *biz.User) (*biz.User, error) {
	_, err := r.data.db.User.Create().SetName(u.Name).SetAge(int(u.Age)).Save(ctx)
	return u, err
}


func (r *userRepo) ListByUserName(ctx context.Context, s string) (bool, error) {
	return r.data.db.User.Query().Where(user.NameEQ(s)).Exist(ctx)
}

```
## DDD

有些同学可能写完第一个接口一脸懵逼，不知道改哪里，也不清楚为什么要改这些地方，代码里或者官方文档突然冒出来的 biz，usecase，repo 究竟是个什么东西？kratos 的设计理念和传统 web 框架的 mvc模式，dao，service层有什么区别呢？不要着急，笔者来给大家解惑！


我们先来了解下什么是DDD，DDD代表领域驱动设计（Domain-Driven Design），它是一种软件开发方法论，旨在解决复杂领域的软件设计和开发问题。DDD的核心理念是将软件系统建模为一个由领域对象和领域概念组成的模型，这些对象和概念反映了真实世界中的业务领域。通过DDD，开发团队可以更好地应对需求变化和复杂性，提供高质量的软件解决方案。

kratos 中有两个概念需要我们明确，一个是 usecase，一个是 repo,一个是依赖倒置：

- usecase 

对某个领域的抽象，包含多个 repo，能够组成业务功能

- repo

对某个数据仓库的抽象，举个例子，一个repo代表一张表数据的封装，提供 crud 方法

- 依赖倒置
  
我们在 biz 层会定义 repo interface，这样 biz 包不用直接和 repo 耦合（不引用repo包），而是repo 包向上引用 biz包，这样当底层数据库发生变化时候，无需修改 biz层侧代码， 如下所示：

```go
// biz层 ，没有引用 repo层
import (
	"context"

	v1 "devops-agent/api/agent/v1"

	"github.com/go-kratos/kratos/v2/errors"
	"github.com/go-kratos/kratos/v2/log"
)

// UserRepo is a Greater repo.
type UserRepo interface {
	Save(context.Context, *User) (*User, error)
	Update(context.Context, *User) (*User, error)
	FindByID(context.Context, int64) (*User, error)
	ListByUserName(context.Context, string) (bool, error)
	ListAll(context.Context) ([]*User, error)
}
```

### 总结

这讲主要给大家讲解了 swagger-ui 以及 用户注册接口设计实现，同学们掌握了 kratos 领域涉及的核心思想，后面我们正式开发我们的项目！本节具体的代码，大家可以访问：https://github.com/mouuii/kratos-tutorial/tree/03-swagger-user 获取！