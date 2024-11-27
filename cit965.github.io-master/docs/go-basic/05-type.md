---
sidebar_label: '5.类型'
sidebar_position: 5
title: 5.类型
---

### 类型

下面是go语言中的基本类型：

```go
bool
Numeric Types
int8, int16, int32, int64, int
uint8, uint16, uint32, uint64, uint
float32, float64
complex64, complex128
byte
rune
string
```

### bool 类型

Bool 类型表示一个 boolean，它可以为 true 或 false。
```go
package main

import "fmt"

func main() {  
    a := true
    b := false
    fmt.Println("a:", a, "b:", b)
    c := a && b
    fmt.Println("c:", c)
    d := a || b
    fmt.Println("d:", d)
}
```

在上面的程序中，a 被赋值为 true，b 被赋值为 false。

c 被赋予 a & b 的值。&& 操作符只有在 a 和 b 都为真时才返回 true。所以在这个例子中，c 是 false 。

当 a 或 b 为 true 时，| | 运算符返回 true。在这种情况下，d 被赋值为 true，因为 a 为 true。我们将得到这个程序的以下输出。


```sh
a: true b: false  
c: false  
d: true  
```
### 有符号整数
```go
int8: represents 8 bit signed integers
size: 8 bits
range: -128 to 127

int16: represents 16 bit signed integers
size: 16 bits
range: -32768 to 32767

int32: represents 32 bit signed integers
size: 32 bits
range: -2147483648 to 2147483647

int64: represents 64 bit signed integers
size: 64 bits
range: -9223372036854775808 to 9223372036854775807

int: represents 32 or 64 bit integers depending on the underlying platform. You should generally be using int to represent integers unless there is a need to use a specific sized integer.
size: 32 bits in 32 bit systems and 64 bit in 64 bit systems.
range: -2147483648 to 2147483647 in 32 bit systems and -9223372036854775808 to 9223372036854775807 in 64 bit systems
```

```go
package main

import "fmt"

func main() {  
    var a int = 89
    b := 95
    fmt.Println("value of a is", a, "and b is", b)
}
```

上面的程序将打印值 a 为89，b 为95

在上面的程序中，a 的类型是 int，b 的类型是从赋给它的值(95)推断出来的。如前所述，int 的大小在32位系统中为32位，在64位系统中为64位。我们来核实一下这个说法。

可以在 Printf 函数中使用 %T 格式打印变量的类型。Go 有一个不安全的包，它有一个 Sizeof 函数，以字节为单位返回传递给它的变量的大小。不安全的包应该谨慎使用，因为使用它的代码可能存在可移植性问题，但是为了本教程的目的，我们可以使用它。

下面的程序输出变量 a 和 b 的类型和大小。%T 是用于打印类型的格式说明符, %d 用于打印大小。

```go
package main

import (  
    "fmt"
    "unsafe"
)

func main() {  
    var a int = 89
    b := 95
    fmt.Println("value of a is", a, "and b is", b)
    fmt.Printf("type of a is %T, size of a is %d", a, unsafe.Sizeof(a)) //type and size of a
    fmt.Printf("\ntype of b is %T, size of b is %d", b, unsafe.Sizeof(b)) //type and size of b
}
```
上述程序将产生输出
```sh
value of a is 89 and b is 95  
type of a is int, size of a is 4  
type of b is int, size of b is 4  
```

我们可以从上面的输出推断出 a 和 b 的类型为 int，它们的大小为32位(4字节)。如果在64位系统上运行上述程序，则输出将有所不同。在64位系统中，a 和 b 占用64位(8字节)。


### 无符号整数
```go
uint8: represents 8 bit unsigned integers
size: 8 bits
range: 0 to 255

uint16: represents 16 bit unsigned integers
size: 16 bits
range: 0 to 65535

uint32: represents 32 bit unsigned integers
size: 32 bits
range: 0 to 4294967295

uint64: represents 64 bit unsigned integers
size: 64 bits
range: 0 to 18446744073709551615

uint : represents 32 or 64 bit unsigned integers depending on the underlying platform.
size : 32 bits in 32 bit systems and 64 bits in 64 bit systems.
range : 0 to 4294967295 in 32 bit systems and 0 to 18446744073709551615 in 64 bit systems
```

### 浮点类型
```go
float32: 32 bit floating point numbers
float64: 64 bit floating point numbers
```


下面是一个演示整数和浮点类型的简单程序

```go
package main

import (  
    "fmt"
)

func main() {  
    a, b := 5.67, 8.97
    fmt.Printf("type of a %T b %T\n", a, b)
    sum := a + b
    diff := a - b
    fmt.Println("sum", sum, "diff", diff)

    no1, no2 := 56, 89
    fmt.Println("sum", no1+no2, "diff", no1-no2)
}
```

a 和 b 的类型是从分配给它们的值推断出来的。在这种情况下，a 和 b 的类型为 float64(float64是浮点值的默认类型)。我们加上 a 和 b，然后把它赋给一个变量 sum。我们从 a 中减去 b，然后把它赋给 diff。然后输出 sum 和 diff。对 no1和 no2进行了类似的计算。以上程序将打印

```sh
type of a float64 b float64  
sum 14.64 diff -3.3000000000000007  
sum 145 diff -33 
```

### 复杂的类型

```go
complex64: complex numbers which have float32 real and imaginary parts
complex128: complex numbers with float64 real and imaginary parts
```
内置函数 **complex** 用于构造具有实部和虚部的复数。**complex** 函数具有以下定义
`func complex(r, i FloatType) ComplexType  `

它接受一个实部和虚部作为参数，并返回一个复杂类型。真实部分和想象部分必须是同一类型的。浮动32或浮动64。如果实部分和虚部分都是 float32，那么该函数返回的复数值类型为 complex64。如果实部分和虚部分都是 float64类型的，那么该函数返回一个复数值，类型为 compolx128

也可以使用简写语法创建复数

c := 6 + 7i 

让我们编写一个小程序来理解复数。

```go
package main

import (  
    "fmt"
)

func main() {  
    c1 := complex(5, 7)
    c2 := 8 + 27i
    cadd := c1 + c2
    fmt.Println("sum:", cadd)
    cmul := c1 * c2
    fmt.Println("product:", cmul)
}
```

在上面的程序中，c1和 c2是两个复数。c1有5作为实部，7作为虚部。c2有实部分8和虚部分27。cadd 被赋予 c1和 c2的和，cmul 被赋予 c1和 c2的乘积。这个程序将输出

```go
sum: (13+34i)  
product: (-149+191i)  
```

### 其他数字类型

byte is an alias of uint8
rune is an alias of int3

在学习字符串时，我们将更详细地讨论字节和符号。

### 字符串类型

字符串是 Go 中的字节集合。如果这个定义没有任何意义，也没关系。现在，我们可以假设字符串是字符的集合。我们将在单独的字符串教程中详细了解字符串

让我们用字符串编写一个程序

```go
package main

import (  
    "fmt"
)

func main() {  
    first := "Naveen"
    last := "Ramanathan"
    name := first +" "+ last
    fmt.Println("My name is",name)
}
```

在上面的程序中，首先分配字符串“ Naveen”，最后分配字符串“ Ramanathan”。字符串可以使用 + 运算符进行连接。Name 被赋值为 first 连接到最后一个空格的值。以上程序将输出我的名字是 Naveen Ramanathan。

还有一些操作可以在字符串上执行。我们将在单独的教程中看到这些操作。


Go 对显式输入非常严格。不存在自动类型提升或转换。让我们通过一个例子来看看这意味着什么。

```go
package main

import (  
    "fmt"
)

func main() {  
    i := 55      //int
    j := 67.8    //float64
    sum := i + j //int + float64 not allowed
    fmt.Println(sum)
}
```

以上代码在 C 语言中是完全合法的。但是如果要走的话，这个不管用。I 是 int 类型，j 是 float64类型。我们试图增加2个不同类型的数字，这是不允许的。当您运行程序时，您将获得。`无效操作: i + j (不匹配的 int 和 float64类型)`

要修复这个错误，i 和 j 应该是相同的类型。让我们把 j 转换成 int。T (v)是将值 v 转换为 T 类型的语法

```go
package main

import (  
    "fmt"
)

func main() {  
    i := 55      //int
    j := 67.8    //float64
    sum := i + int(j) //j is converted to int
    fmt.Println(sum)
}
```

现在，当您运行上面的程序时，您可以看到122作为输出。

赋值也是如此。将一种类型的变量分配给另一种类型的变量时，需要进行显式类型转换。这在下面的程序中解释。

```go
package main

import (  
    "fmt"
)

func main() {  
    i := 10
    var j float64 = float64(i) //this statement will not work without explicit conversion
    fmt.Println("j", j)
}
```

在上述代码中，i 转换为 float64，然后分配给 j。当您尝试在没有任何类型转换的情况下将 i 赋值给 j 时，编译器将抛出一个错误。