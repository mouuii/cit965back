---
sidebar_label: 02-study-10
sidebar_position: 2
title: 02-study-10
---

### 第一课：初始化项目

初始化项目，由于我们使用的是 kratos 框架，我们可以在官网下载 kratos 脚手架工具，执行 `kratos new kubecit` 来拉取项目模版。

### 第二课：运行项目

拉取完项目后，我们 运行 `make init` 来安装必要的依赖，比如 proto 、wire 等工具，使用 `kratos run` 在 localhost:8000 启动服务，启动后访问
web 页面 `localhost:8000/helloworld/hellocit ` 可以得到返回结果如下图：

![](https://raw.githubusercontent.com/mouuii/picture/master/%E6%88%AA%E5%B1%8F2023-08-10%20%E4%B8%8B%E5%8D%883.49.04.png)

### 第三课：解决proto爆红&初次提交代码

IDE中 import "google/api/annotations.proto";等proto文件有错误提示（被画波浪线）

IDE中的这个提示不会影响项目的正常编译，如果您需要解决这个报错，请将项目中的thrid_party目录加入Protobuf的custom include paths下。请参照如下文档操作：

![](https://raw.githubusercontent.com/mouuii/picture/master/goland-protobuf.png)

### 第四课：fork代码&提交pr

点击项目的 fork 选项，复制到自己的仓库，修改代码并提交到自己的仓库，然后提交pr到原始项目仓库

### 第五课：写第一个接口

在项目目录 api/helloworld/greeter.proto 文件中定义用户接口，运行 `make all` 生成相关代码，在 internal/service/greeter.go 中实现接口。

### 第六课：集成数据库

数据库我们选用 ent ，相比于 gorm 的反射实现，ent 采用了代码生成的方式来帮我们更好的操作数据库，我们在 data 中添加 entClient ，数据库我们使用 sqlite3 ，减少项目初期成本。 

### 第七课：实现用户注册接口

kratos 框架的核心思想是 ddd ，我们的数据库操作都必须在 data 层实现，业务实现在 biz 层实现。下面我们来分别看看各自代码：

```go
// internal/data/user.go 所有对数据库的操作都封装在 data 层
func (u *userRepo) Register(ctx context.Context, user *biz.User) (*biz.User, error) {
    // 此方法实现了定义在 biz 层的 userRepo 接口
	return &biz.User{}, nil
}
```

```go
// internal/biz/user.go 所有业务都封装在 biz 层 ，biz层不依赖于data层，data层依赖于biz层，此称为依赖反转。
func (u *UserUsecase) RegisterUser(ctx context.Context, user *User) (*User, error) {
	userResult, err := u.repo.Register(ctx, user)
	if err != nil {
		return nil, err
	}
	return userResult, nil
}
```


### 第八课：优化用户注册接口

使用前端传入的真实参数来注册用户。

### 第九课：用户列表

添加用户列表接口，返回用户数组

### 第十课：生成 swagger 文档

使用 kratos 提供的 swagger 插件，支持本地启动 swagger 文档，方便我们对接前端、

### 第十一课：实现单元测试

使用 dockertest 库，实现data层单元测试，执行测试前拉起数据库镜像，测试完毕销毁。

### 第十二课：实现biz层集成测试

使用 gomock 来 mock 掉 repo 层，方便我们进行 biz 逻辑层的集成测试

### 第十三课：添加 github action 

添加 github action 来进行代码提交后的编译测试校验