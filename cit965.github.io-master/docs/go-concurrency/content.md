---
sidebar_label: '课程介绍'
sidebar_position: 1
title: 课程介绍
---

## 课程大纲

### 并发并行概念

并发（Concurrency）是独立的两个或多个任务，可以在重叠的时间范围内处理。并行（Parallelism）则是在同一时间处理两个或多个任务。

例如：在普通的餐厅中，服务员（单一线程）可以同时处理多个桌子（任务），这就是并发；而在自助餐厅中，每个人（线程）都在自己的速度上取菜、支付，这就是并行。

### 基本原语

Go 语言并发编程的基本原语，包括 goroutine 和 channels。goroutine 是 Go 语言中的轻量级线程，而 channels 则可以用来在 goroutines 之间进行数据共享和同步。

通过简单的示例代码来讲解如何启动 goroutine，以及如何使用 channels 进行数据传递。

### channel 设计模式 

- Unbuffered Channel（非缓冲型）和 Buffered Channel（缓冲型）
- Close Channel 和 Range Over Channels
- Select 和 Default
- Pipeline pattern（管道模式）
- Fan-out, Fan-in pattern（扩散和收束模式）

### 实战

通过一个复杂的实际问题来演示 Go 语言的并发特性。例如，设计一个 Web 爬虫项目，展示如何使用 goroutines 和 channels 来提高网络 IO 操作的效率。

### 并发陷阱

讲解一些常见的并发编程陷阱，例如数据竞争，死锁，资源泄漏等，并展示如何避免这些问题。这部分应该强调在编写并发代码时的最佳实践。

### 库源码分析

选取 Go 标准库中的一些关于并发的源代码进行分析，例如 sync.Mutex，sync.WaitGroup，或者是 channel 的实现。通过分析源代码，学生可以更深入地理解 Go 的并发机制。

### K8S中的源码

真实项目中如何使用并发，有什么需要注意的。

## 课程周期

课程2周时间，20节课

