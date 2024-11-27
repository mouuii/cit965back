---
sidebar_label: '4.变量'
sidebar_position: 4
title: 4.变量
---

### 什么是变量

变量是指定存储特定类型值的内存位置的名称。在 Go 中声明变量有多种语法。我们一个一个来看。

### 声明单个变量
var name type 是声明单个变量的语法

```go
package main

import "fmt"

func main() {  
    var age int // variable declaration
    fmt.Println("My age is", age)
}
```
[run in playground](https://go.dev/play/p/VpdY-HWVPW1)

语句 var age int 声明了一个名为 age 的 int 类型变量。我们没有给这个变量赋任何值。如果一个变量没有分配任何值，Go 会自动将其初始化为该变量类型的零值。在本例中，age 被赋值为0，即 int 的零值。如果运行此程序，可以看到以下输出:
```sh
My age is 0 
```
可以将变量赋给其类型的任何值。在上面的程序中，年龄可以分配任何整数值。

```go
package main

import "fmt"

func main() {  
    var age int // variable declaration
    fmt.Println("My age is", age)
    age = 29 //assignment
    fmt.Println("My age is", age)
    age = 54 //assignment
    fmt.Println("My new age is", age)
}
```
[run in playground](https://go.dev/play/p/dP8hG83Gj3K)

上面的程序将打印以下输出。

```sh
My age is  0  
My age is 29  
My new age is 54 
```

### 声明具有初始值的变量

声明变量时，还可以提供初始值。下面是用初始值声明变量的语法。
```go
var name type = initialvalue  
```

```go
package main

import "fmt"

func main() {  
    var age int = 29 // variable declaration with initial value

    fmt.Println("My age is", age)
}
```

[run in playground](https://go.dev/play/p/QDRFFUDUF7C)

在上面的程序中，age 是 int 类型的变量，初始值为29。上面的程序将打印以下输出。

```sh
My age is 29  
```

它显示 age 已经用值29初始化。

### 类型推断

如果一个变量有一个初始值，Go 将能够使用该初始值自动推断该变量的类型。因此，如果变量具有初始值，则可以删除变量声明中的类型。

如果使用以下语法声明变量

```go
var name = initialvalue 
```

Go 将从初始值自动推断该变量的类型。

在下面的示例中，我们可以看到在第6行中删除了变量 age 的 int 类型。由于变量的初始值为29，Go 可以推断它的类型为 int。

```go
package main

import "fmt"

func main() {  
    var age = 29 // type will be inferred
    fmt.Println("My age is", age)
}
```

### 多变量声明
可以使用单个语句声明多个变量。
var name1，name2 type = initialvalue1，initialvalue2是多变量声明的语法。
```go
package main

import "fmt"

func main() {  
    var width, height int = 100, 50 //declaring multiple variables

    fmt.Println("width is", width, "height is", height)
}
```
[run in playground](https://go.dev/play/p/L0BCJVDPsMG)

如果变量具有初始值，则可以删除该类型。因为上面的程序有变量的初始值，所以可以删除 int 类型。

```go
package main

import "fmt"

func main() {  
    var width, height = 100, 50 //"int" is dropped

    fmt.Println("width is", width, "height is", height)
}
```
以上程序将打印宽度是100高度是50作为输出。

正如您现在可能已经猜到的，如果初始值没有为 width 和 height 指定，那么它们的初始值将为0。

```go
package main

import "fmt"

func main() {  
    var width, height int
    fmt.Println("width is", width, "height is", height)
    width = 100
    height = 50
    fmt.Println("new width is", width, "new height is", height)
}
```

[run in playground](https://go.dev/play/p/hi33JLWnl-7)

在某些情况下，我们可能希望在一个语句中声明属于不同类型的变量，这叫做块声明。
```go
var (  
      name1 = initialvalue1
      name2 = initialvalue2
)
```

下面的程序使用上述语法声明不同类型的变量。
```go
package main

import "fmt"

func main() {  
    var (
        name   = "naveen"
        age    = 29
        height int
    )
    fmt.Println("my name is", name, ", age is", age, "and height is", height)
}
```

在这里，我们声明一个类型为 string 的变量名，以及类型为 int 的 age 和 height。(我们将在下一篇教程中讨论 Golang 提供的各种类型)。运行上述程序将打印
```sh
my name is naveen , age is 29 and height is 0  
```

### 简短声明

Go 还提供了另一种声明变量的简洁方法。这称为简写声明，它使用: = 操作符。

name: = initialvalue 是声明变量的简写语法。

下面的程序使用简短语法来声明初始化为10的变量计数。Go 将自动推断 count 的类型为 int，因为它是用整数值10初始化的。

```go
package main

import "fmt"

func main() {  
    count := 10
    fmt.Println("Count =",count)
}
```
[run in playground](https://go.dev/play/p/RJ26H03bAR9)

以上程序将打印 `Count = 10`

还可以使用简短的语法在一行中声明多个变量。

```go
package main

import "fmt"

func main() {  
    name, age := "naveen", 29 //short hand declaration

    fmt.Println("my name is", name, "age is", age)
}
```

上面的程序分别声明了 string 和 int 类型的两个变量 name 和 age。

如果你运行上面的程序，你可以看到我的名字是 Naveen 年龄是29打印

简写声明需要赋值左边的所有变量的初始值。下面的程序将打印错误分配不匹配: 2个变量但1个值。这是因为没有为 age 赋值。

```go
package main

import "fmt"

func main() {  
    name, age := "naveen" //error

    fmt.Println("my name is", name, "age is", age)
}
```

只有当: = 左侧的至少一个变量是新声明的时候，才能使用简短语法。考虑下面的程序,

```go
package main

import "fmt"

func main() {  
    a, b := 20, 30 // declare variables a and b
    fmt.Println("a is", a, "b is", b)
    b, c := 40, 50 // b is already declared but c is new
    fmt.Println("b is", b, "c is", c)
    b, c = 80, 90 // assign new values to already declared variables b and c
    fmt.Println("changed b is", b, "c is", c)
}
```

[run in playground](https://go.dev/play/p/sSm_pUxrk-V)

在上面的程序中，在第8行中，b 已经被声明，但 c 是新声明的，因此它可以工作并输出
```sh
a is 20 b is 30  
b is 40 c is 50  
changed b is 80 c is 90  
```

然而如果我们运行下面的程序,
```go
package main

import "fmt"

func main() {  
    a, b := 20, 30 //a and b declared
    fmt.Println("a is", a, "b is", b)
    a, b := 40, 50 //error, no new variables
}
```

它会打印 `error/pro.go: 8:10: 在 := 的左边没有新变量` , 这是因为变量 a 和 b 都已经声明过了，在第8行 := 的左边没有新变量

变量也可以被赋值，这些值是在运行时计算的,

```go
package main

import (  
    "fmt"
    "math"
)

func main() {  
    a, b := 145.8, 543.8
    c := math.Min(a, b)
    fmt.Println("Minimum value is", c)
}
```

在上面的程序中，数学是一个包，Min 是该包中的一个函数。现在不要担心，我们将在接下来的教程中详细讨论软件包和函数。我们需要知道的是，c 的值是在运行时计算的，它是 a 和 b 的最小值。上面的程序将打印 `Minimum value is  145.8  `

因为 Go 是强类型的，所以声明为属于一种类型的变量不能被赋予另一种类型的值。下面的程序将打印一个错误，不能使用“ naveen”(类型字符串)作为类型 int 的赋值，因为 age 被声明为类型 int，我们正在尝试给它赋一个字符串值。

```go
package main

func main() {  
    age := 29      // age is int
    age = "naveen" // error since we are trying to assign a string to a variable of type int
}
```

喜欢我的教程吗? 请支持内容:)