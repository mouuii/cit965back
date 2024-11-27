---
slug: go1.21
title: go1.21
authors: mouuii
tags: [go]
---

大家好，我是南哥。

Go1.21 在8月8日晚上 11 点 30 多的时候，终于发布出来了，这个版本比较重要，加入了很多新特性，下面我带大家尝鲜。

![](https://raw.githubusercontent.com/mouuii/picture/master/%E6%88%AA%E5%B1%8F2023-08-09%20%E4%B8%8A%E5%8D%8810.48.42.png)

### 1.21.0 简介
最新的 Go 1.21版本，在 Go 1.20 六个月后发布。它的大部分更改都在工具链、运行时和库的实现中。与往常一样，该版本保持了Go 1的兼容性承诺。

Go 1.21 对版本的编号进行了一个小的更改。过去，我们使用 Go 1.N 来指代整个 Go 语言版本和发行版系列以及该系列中的第一个版本。从 Go 1.21 开始，第一个版本现在是 Go 1.N.0。今天，我们将发布 Go 1.21 语言及其初始实现 Go 1.21.0 版本。

go 现在支持向后和向前语言兼容性，大家放心升级。

### 语言改变

Go 1.21 为该语言添加了三个新的内置函数。

- 新函数 min 并 max 计算固定数量的给定参数的最小（或最大 max ）值
- 新函数 clear 从 map 中删除所有元素或将 slice 的所有元素归零

对泛型函数的类型推断进行了几项改进。规范中对类型推断的描述已得到扩展和澄清

在 Go 的未来版本中，我们计划解决 Go 编程中最常见的问题之一：循环变量捕获。Go 1.21 附带了此功能的预览，您可以使用环境变量在代码中启用该功能。

### 标准库添加

- 用于结构化日志记录的新日志/日志包 log/slog

- 新的 slice 包，用于对任何元素类型的切片进行常见操作

- 新的 map 包 ，用于对任何键或元素类型的映射进行常见操作

- 新的 cmp 包，带有用于比较有序值的新实用程

### 性能改进

- 启用 PGO 提升编译性能 
- 调整垃圾回收
- 优化对 amd64 和 arm64 对于 trace 的CPU 消耗


### 支持 WASI

Go 1.21 为 WebAssembly System Interface （WASI） 添加了一个实验性端口，预览版 1 （ GOOS=wasip1 ， GOARCH=wasm ）。

### 代码

#### clear
Go 1.21增加了一个clear预定义函数用来做切片和map的clear操作，其原型如下：

```go

// The clear built-in function clears maps and slices.
// For maps, clear deletes all entries, resulting in an empty map.
// For slices, clear sets all elements up to the length of the slice
// to the zero value of the respective element type. If the argument
// type is a type parameter, the type parameter's type set must
// contain only map or slice types, and clear performs the operation
// implied by the type argument.
func clear[T ~[]Type | ~map[Type]Type1](t T)

```

clear是针对map和slice的操作函数，它的语义是什么呢？我们通过一个例子来看一下：

```go
package main

import "fmt"

func main() {
 var sl = []int{1, 2, 3, 4, 5, 6}
 fmt.Printf("before clear, sl=%v, len(sl)=%d, cap(sl)=%d\n", sl, len(sl), cap(sl))
 clear(sl)
 fmt.Printf("after clear, sl=%v, len(sl)=%d, cap(sl)=%d\n", sl, len(sl), cap(sl))

 var m = map[string]int{
  "tony": 13,
  "tom":  14,
  "amy":  15,
 }
 fmt.Printf("before clear, m=%v, len(m)=%d\n", m, len(m))
 clear(m)
 fmt.Printf("after clear, m=%v, len(m)=%d\n", m, len(m))
}
```

#### slog

包 slog 提供结构化日志记录，其中日志记录包括消息、严重性级别和表示为键值对的各种其他属性。

它定义了一个类型，Logger，它提供了几种方法（如 Logger.Info 和Logger.Error）来报告感兴趣的事件。

每个记录器(Logger)都与一个处理程序(Handler)相关联。记录器输出方法从方法参数创建 Record，并将其传递给处理程序，处理程序决定如何处理它。有一个默认记录器，可通过调用相应记录器方法的顶级函数（如信息和错误）访问。

日志记录(Logger)由时间、级别、消息和一组键值对组成，其中键是字符串，值可以是任何类型的。实际使用：

```go
slog.Info("hello", "count", 3)
//2023/08/09 10:36:18 INFO hello count=3
```


#### cmp 


包 cmp 提供与比较有序值相关的类型和函数,原型如下：

```go
// Compare returns
//
//	-1 if x is less than y,
//	 0 if x equals y,
//	+1 if x is greater than y.
//
// For floating-point types, a NaN is considered less than any non-NaN,
// a NaN is considered equal to a NaN, and -0.0 is equal to 0.0.
func Compare[T Ordered](x, y T) int {
	xNaN := isNaN(x)
	yNaN := isNaN(y)
	if xNaN && yNaN {
		return 0
	}
	if xNaN || x < y {
		return -1
	}
	if yNaN || x > y {
		return +1
	}
	return 0
}
```

实际使用如下：

```go

	result := cmp.Compare(2, 3)
	slog.Info("2 cmp 3", "result", result)
    //2023/08/09 10:39:04 INFO 2 cmp 3 result=-1
```    


#### min

```go
	minResult := min(2, 4, 5, 5, 56)
	slog.Info("min 2,3,4,5,56", "result", minResult)
    //2023/08/09 10:42:37 INFO min 2,3,4,5,56 result=2
```    
