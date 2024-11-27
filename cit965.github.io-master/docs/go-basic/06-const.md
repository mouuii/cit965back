---
sidebar_label: '6.常量'
sidebar_position: 5
title: 6.常量
---

### 什么是常量

Go 中的术语常量用于表示固定值，例如
```go
95  
"I love Go" 
67.89 
```
### 声明一个常量
关键字 const 用于声明常量。让我们看看如何使用示例声明常量。
```go
package main

import (  
    "fmt"
)

func main() {  
    const a = 50
    fmt.Println(a)
}
```

在上面的代码中， a 是一个常量，它被赋予了值 50 。
### 声明一组常量

还有另一种语法可以使用单个语句定义一组常量。下面提供了使用此语法定义一组常量的示例

```go
package main

import (  
    "fmt"
)

func main() {  
    const (
        name = "John"
        age = 50
        country = "Canada"
    )
    fmt.Println(name)
    fmt.Println(age)
    fmt.Println(country)

}
```
在上面的程序中，我们声明了 3 个常量 name 、 age 和 country 。上面的程序打印
```sh
John  
50  
Canada
```

常量，顾名思义，不能重新分配给任何其他值。在下面的程序中，我们试图将另一个值 89 分配给 a 。这是不允许的，因为 a 是常量。该程序将无法运行，编译错误无法分配给 a。

```go
package main

func main() {  
    const a = 55 //allowed
    a = 89 //reassignment not allowed
}
```

常量的值应该在编译时已知。因此，它不能分配给函数调用返回的值，因为函数调用发生在运行时

```go
package main

import (  
    "math"
)

func main() {  
    var a = math.Sqrt(4)   //allowed
    const b = math.Sqrt(4) //not allowed
}
```

在上面的程序中， a 是一个变量，因此它可以赋值给函数 math.Sqrt(4) 的结果（我们将在单独的教程中更详细地讨论函数）。

b 是一个常量，b 的值需要在编译时知道。函数 math.Sqrt(4) 将仅在运行时进行评估，因此 const b = math.Sqrt(4) 无法编译并出现错误

### 布尔常量与字符串常量
```go
const typedhello string = "Hello World"
```

上面代码中的typedhello是一个string类型的常量

布尔常量与字符串常量没有区别。下面是一个简单的程序来解释布尔常量。

```go
package main

func main() {  
    const trueConst = true
    type myBool bool
    var defaultBool = trueConst //allowed
    var customBool myBool = trueConst //allowed
    defaultBool = customBool //not allowed
}
```
### 数值常量
数值常量包括整数、浮点数和复数常量。数字常量有一些微妙之处。

让我们看一些例子来弄清楚。

```go
package main

import (  
    "fmt"
)

func main() {  
    const a = 5
    var intVar int = a
    var int32Var int32 = a
    var float64Var float64 = a
    var complex64Var complex64 = a
    fmt.Println("intVar",intVar, "\nint32Var", int32Var, "\nfloat64Var", float64Var, "\ncomplex64Var",complex64Var)
}
```

在上面的程序中，常量 a 是 untyped 并且具有值 5 。你可能想知道 a 的默认类型是什么，如果它有，我们如何将它分配给不同类型的变量。答案在于 a 的语法。下面的程序会让事情变得更清楚

```go
package main

import (  
    "fmt"
)

func main() {  
    var i = 5
    var f = 5.6
    var c = 5 + 6i
    fmt.Printf("i's type is %T, f's type is %T, c's type is %T", i, f, c)

}
```

在上面的程序中，每个变量的类型由数值常量的语法决定。 5 在语法上是一个整数，5.6 是一个浮点数，5 + 6i 在语法上是一个复数。当上面的程序运行时，它会打印

```sh
i's type is int, f's type is float64, c's type is complex128 
```

有了这些知识，让我们试着理解下面的程序是如何工作的
```go
package main

import (  
    "fmt"
)

func main() {  
    const a = 5
    var intVar int = a
    var int32Var int32 = a
    var float64Var float64 = a
    var complex64Var complex64 = a
    fmt.Println("intVar",intVar, "\nint32Var", int32Var, "\nfloat64Var", float64Var, "\ncomplex64Var",complex64Var)
}
```

在上面的程序中， a 的值是 5 ， a 的语法是通用的。它可以表示浮点数、整数甚至没有虚部的复数。因此可以分配给任何兼容类型。这些常量的默认类型可以被认为是根据上下文动态生成的。 var intVar int = a 要求 a 为整数，因此它成为 int 常量。 var complex64Var complex64 = a 要求 a 是一个复数，因此它成为一个复常量。很简约 ：）。