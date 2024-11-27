---
sidebar_label: '9.函数'
sidebar_position: 6
title: 9.函数
---

### 数组
数组是属于同一类型的元素的集合。例如，整数 5、8、9、79、76 的集合构成一个数组。混合不同类型的值，例如，在 Go 中不允许同时包含字符串和整数的数组。

### 声明

数组属于 [n]T 类型。 n 表示数组中元素的数量， T 表示每个元素的类型。 n 元素的个数也是类型的一部分（稍后我们将对此进行更详细的讨论。

有不同的方法来声明数组。让我们一一看看。

```go
package main

import (  
    "fmt"
)


func main() {  
    var a [3]int //int array with length 3
    fmt.Println(a)
}
```

var a [3]int 声明一个长度为 3 的整数数组。数组中的所有元素都自动分配数组类型的零值。在这种情况下， a 是一个整数数组，因此 a 的所有元素都分配给 0 ，即 int 的零值。运行上面的程序会打印

```sh
[0 0 0]
```

数组的索引从 0 开始，到 length - 1 结束。让我们为上面的数组分配一些值

```go
package main

import (  
    "fmt"
)


func main() {  
    var a [3]int //int array with length 3
    a[0] = 12 // array index starts at 0
    a[1] = 78
    a[2] = 50
    fmt.Println(a)
}
```

a[0] 将值赋给数组的第一个元素。程序会打印 `[12 78 50]`

让我们使用简写声明创建相同的数组。

```go
package main 

import (  
    "fmt"
)

func main() {  
    a := [3]int{12, 78, 50} // short hand declaration to create array
    fmt.Println(a)
}
```

上面的程序将打印相同的输出`[12 78 50]`

不必为数组中的所有元素都分配一个值。

```go
package main

import (  
    "fmt"
)

func main() {  
    a := [3]int{12} 
    fmt.Println(a)
}
```

在上面的程序中，第 1 行。 8 a := [3]int{12} 声明了一个长度为 3 的数组，但只提供了一个值 12 。其余 2 个元素自动分配 0 。这个程序会打印 `[12 0 0]`

您甚至可以忽略声明中数组的长度，将其替换为 ... ，让编译器为您找到长度。这是在以下程序中完成的。

```go
package main

import (  
    "fmt"
)

func main() {  
    a := [...]int{12, 78, 50} // ... makes the compiler determine the length
    fmt.Println(a)
}
```

数组的大小是类型的一部分。因此 [5]int 和 [25]int 是不同的类型。因此，无法调整数组的大小。不要担心这个限制，因为 slices 的存在就是为了克服这个问题。

```go
package main

func main() {  
    a := [3]int{5, 78, 8}
    var b [5]int
    b = a //not possible since [3]int and [5]int are distinct types
}
```

上面程序中，我们试图将 [3]int 类型的变量分配给 [5]int 类型的变量，这是不允许的，因此编译器将打印以下错误

```sh
./prog.go:6:7: cannot use a (type [3]int) as type [5]int in assignment
```

### 数组是值类型

Go 中的数组是值类型而不是引用类型。这意味着当它们被分配给一个新变量时，原始数组的副本被分配给新变量。如果对新变量进行了更改，它不会反映在原始数组中。

```go
package main

import "fmt"

func main() {  
    a := [...]string{"USA", "China", "India", "Germany", "France"}
    b := a // a copy of a is assigned to b
    b[0] = "Singapore"
    fmt.Println("a is ", a)
    fmt.Println("b is ", b) 
}
```

在上面的程序中，将 a 的副本分配给 b 。将 b 的第一个元素改为 Singapore 。这不会反映在原始数组 a 中。该程序将打印

```sh
a is [USA China India Germany France]  
b is [Singapore China India Germany France]  
```

同样，数组作为参数传递给函数时，也是按值传递，原数组不变。

```go
package main

import "fmt"

func changeLocal(num [5]int) {  
    num[0] = 55
    fmt.Println("inside function ", num)

}
func main() {  
    num := [...]int{5, 6, 7, 8, 8}
    fmt.Println("before passing to function ", num)
    changeLocal(num) //num is passed by value
    fmt.Println("after passing to function ", num)
}
```

上面的程序中，数组 num 实际上是按值传递给函数 changeLocal ，因此不会因为函数调用而改变。该程序将打印
```sh
before passing to function  [5 6 7 8 8]  
inside function  [55 6 7 8 8]  
after passing to function  [5 6 7 8 8]  
```

### 数组的长度

通过将数组作为参数传递给 len 函数来找到数组的长度。

```go
package main

import "fmt"

func main() {  
    a := [...]float64{67.7, 89.8, 21, 78}
    fmt.Println("length of a is",len(a))

}
```

上面程序的输出是

```sh
length of a is 4  
```

### 使用 range 迭代数组

for 循环可用于迭代数组的元素。

```go
package main

import "fmt"

func main() {  
    a := [...]float64{67.7, 89.8, 21, 78}
    for i := 0; i < len(a); i++ { //looping from 0 to the length of the array
        fmt.Printf("%d th element of a is %.2f\n", i, a[i])
    }
}
```

上面的程序使用 for 循环迭代数组中从索引 0 到 length of the array - 1 的元素。该程序有效并将打印，

```sh
0 th element of a is 67.70  
1 th element of a is 89.80  
2 th element of a is 21.00  
3 th element of a is 78.00  
```

Go 通过使用 range 来代替 for 循环，range 提供了一种更好、更简洁的方法来迭代数组。 range 返回索引和该索引处的值。让我们使用范围重写上面的代码。我们还将找到数组所有元素的总和。

```go
package main

import "fmt"

func main() {  
    a := [...]float64{67.7, 89.8, 21, 78}
    sum := float64(0)
    for i, v := range a {//range returns both the index and value
        fmt.Printf("%d the element of a is %.2f\n", i, v)
        sum += v
    }
    fmt.Println("\nsum of all elements of a",sum)
}
```

上面程序的 for i, v := range a 就是for循环的range形式。它将返回索引和该索引处的值。我们打印值并计算数组 a 的所有元素的总和。该程序的输出是，

```sh
0 the element of a is 67.70  
1 the element of a is 89.80  
2 the element of a is 21.00  
3 the element of a is 78.00

sum of all elements of a 256.5 
```

如果您只需要值而忽略索引，可以通过将索引替换为 _ 空白标识符来实现。

```go
for _, v := range a { //ignores index  
}
```

上面的 for 循环忽略了索引。同样，该值也可以忽略。

### 多维数组
到目前为止我们创建的数组都是一维的。可以创建多维数组

```go

package main

import (  
    "fmt"
)

func printarray(a [3][2]string) {  
    for _, v1 := range a {
        for _, v2 := range v1 {
            fmt.Printf("%s ", v2)
        }
        fmt.Printf("\n")
    }
}

func main() {  
    a := [3][2]string{
        {"lion", "tiger"},
        {"cat", "dog"},
        {"pigeon", "peacock"}, //this comma is necessary. The compiler will complain if you omit this comma
    }
    printarray(a)
    var b [3][2]string
    b[0][0] = "apple"
    b[0][1] = "samsung"
    b[1][0] = "microsoft"
    b[1][1] = "google"
    b[2][0] = "AT&T"
    b[2][1] = "T-Mobile"
    fmt.Printf("\n")
    printarray(b)
}

```

在上面的程序中，二维字符串数组 a 已使用简写语法声明。行号末尾的逗号是必要的。

另一个二维数组 b 声明和赋值分开了，每个索引一个一个地添加到数组，这是另一种初始化二维数组的方法。


printarray 函数使用两个 for range 循环来打印二维数组的内容。上面的程序会打印


```sh
lion tiger  
cat dog  
pigeon peacock 

apple samsung  
microsoft google  
AT&T T-Mobile  
```

这就是数组。虽然数组看起来足够灵活，但它们有固定长度的限制。不可能增加数组的长度。这就是切片发挥作用的地方。事实上在 Go 中，切片比常规数组更常见。

### 更多内容

更多内容请加粉丝群【微信+mkjnnm】，免费领取教程！！