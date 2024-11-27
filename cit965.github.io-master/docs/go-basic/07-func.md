---
sidebar_label: '7.函数'
sidebar_position: 5
title: 7.函数
---

### 什么是函数？

函数是执行特定任务的代码块。函数接受输入，对输入执行一些计算，然后生成输出。

### 函数声明

在 go 中声明一个函数的语法是
```go
func functionname(parametername type) returntype {  
 //function body
}
```

函数声明以 func 关键字开头，后跟 functionname 。参数在 ( 和 ) 之间指定，后跟函数的 returntype 。指定参数的语法是，参数名称后跟类型。可以指定任意数量的参数，例如 (parameter1 type, parameter2 type) 。然后在 { 和 } 之间有一段代码是函数体

参数和返回类型在函数中是可选的。因此，以下语法也是有效的函数声明。

```go
func functionname() {  
}
```

### Sample Function

让我们编写一个函数，将单个产品的价格和产品数量作为输入参数，将这两个值相乘计算总价格并返回输出。

```go
func calculateBill(price int, no int) int {  
    var totalPrice = price * no
    return totalPrice
}
```

上面的函数有两个int类型的输入参数 price 和 no ，它返回 totalPrice ，即price和no的乘积。返回值也是int类型。

如果连续的参数是同一类型，可以避免每次都写类型，最后写一次就可以了。即 price int, no int 可以写成 price, no int 。因此，上述函数可以重写为

```go
func calculateBill(price, no int) int {  
    var totalPrice = price * no
    return totalPrice
}
```

现在我们已经准备好一个函数，让我们从代码中的某个地方调用它。调用函数的语法是 functionname(parameters) 。可以使用代码调用上述函数。

```go
calculateBill(10, 5)  
```

这是使用上述功能并打印总价的完整程序。

```go
package main

import (  
    "fmt"
)

func calculateBill(price, no int) int {  
    var totalPrice = price * no
    return totalPrice
}

func main() {  
    price, no := 90, 6
    totalPrice := calculateBill(price, no)
    fmt.Println("Total price is", totalPrice)
}

```

上面的程序会打印

```sh
Total price is 540  
```

### 多个返回值

一个函数可以返回多个值。让我们编写一个函数 rectProps ，它接受矩形的 length 和 width ，并返回矩形的 area 和 perimeter 。长方形的面积是长和宽的乘积，周长是长和宽之和的两倍。

```go
package main

import (  
    "fmt"
)

func rectProps(length, width float64)(float64, float64) {  
    var area = length * width
    var perimeter = (length + width) * 2
    return area, perimeter
}

func main() {  
     area, perimeter := rectProps(10.8, 5.6)
    fmt.Printf("Area %f Perimeter %f", area, perimeter) 
}
```


如果函数返回多个返回值，则必须在 ( 和 ) 之间指定它们。 func rectProps(length, width float64)(float64, float64) 有两个 float64 参数 length and width 并且还返回两个 float64 值。以上程序打印
```sh
Area 60.480000 Perimeter 32.800000  
```

### 命名的返回值

可以从函数返回命名值。如果一个返回值被命名，它可以被认为是在函数的第一行被声明为一个变量。

上面的 rectProps 可以使用命名的返回值重写为

```go
func rectProps(length, width float64)(area, perimeter float64) {  
    area = length * width
    perimeter = (length + width) * 2
    return //no explicit return value
}
```

area 和 perimeter 是上述函数中的命名返回值。请注意，函数中的 return 语句不会显式返回任何值。由于 area 和 perimeter 在函数声明中指定为返回值，因此当遇到return 语句时，它们会自动从函数中返回。

### 空白标识符

_ 在 Go 中被称为空白标识符。它可以用来代替任何类型的任何值。让我们看看这个空白标识符有什么用。

rectProps 函数返回矩形的面积和周长。如果我们只需要 area 并想丢弃 perimeter 怎么办。这就是 _ 的用处。

下面的程序仅使用从 rectProps 函数返回的 area 

```go
package main

import (  
    "fmt"
)

func rectProps(length, width float64) (float64, float64) {  
    var area = length * width
    var perimeter = (length + width) * 2
    return area, perimeter
}
func main() {  
    area, _ := rectProps(10.8, 5.6) // perimeter is discarded
    fmt.Printf("Area %f ", area)
}
```

我们只使用 area , _ 标识符用于丢弃 perimeter 。