---
sidebar_label: 10.切片
sidebar_position: 6
title: 10.切片
---

### 介绍

切片也叫slice ，是对数组的一种方便、灵活和强大的包装器。切片本身不拥有任何数据。它们只是对现有数组的引用。

### 创建slice

具有类型 T 元素的切片由 []T 表示

```go
package main

import (  
    "fmt"
)

func main() {  
    a := [5]int{76, 77, 78, 79, 80}
    var b []int = a[1:4] //creates a slice from a[1] to a[3]
    fmt.Println(b)
}
```

语法 a[start:end] 从数组 a 从索引 start 开始到索引 end - 1 创建一个切片。所以在第一行。上述程序 a[1:4] 从索引 1 到 3 开始创建数组 a 的切片表示。因此切片 b 具有值 [77 78 79] 。

让我们看看另一种创建切片的方法。

```go
package main

import (  
    "fmt"
)

func main() {  
    c := []int{6, 7, 8} //creates and array and returns a slice reference
    fmt.Println(c)
}
```

在上面的程序中， c := []int{6, 7, 8} 创建一个包含 3 个整数的数组，并返回一个存储在 c 中的切片引用。

### 修改切片

切片不拥有自己的任何数据。它只是底层数组的表示。对切​​片所做的任何修改都将反映在底层数组中。

```go
package main

import (  
    "fmt"
)

func main() {  
    darr := [...]int{57, 89, 90, 82, 100, 78, 67, 69, 59}
    dslice := darr[2:5]
    fmt.Println("array before",darr)
    for i := range dslice {
        dslice[i]++
    }
    fmt.Println("array after",darr) 
}
```

上述程序，我们从数组的索引 2、3、4 创建了 dslice 。 for 循环将这些索引中的值递增 1。当我们在 for 循环之后打印数组时，我们可以看到对切片的更改反映在数组中。该程序的输出是
```sh
array before [57 89 90 82 100 78 67 69 59]  
array after [57 89 91 83 101 78 67 69 59]  
```

当多个切片共享同一个底层数组时，每个切片所做的更改都将反映在数组中。

```go
package main

import (  
    "fmt"
)

func main() {  
    numa := [3]int{78, 79 ,80}
    nums1 := numa[:] //creates a slice which contains all elements of the array
    nums2 := numa[:]
    fmt.Println("array before change 1",numa)
    nums1[0] = 100
    fmt.Println("array after modification to slice nums1", numa)
    nums2[1] = 101
    fmt.Println("array after modification to slice nums2", numa)
}
```

numa[:] 中缺少起始值和结束值。开始和结束的默认值分别是 0 和 len(numa) 。 nums1 和 nums2 切片共享同一个数组。该程序的输出是

```sh
array before change 1 [78 79 80]  
array after modification to slice nums1 [100 79 80]  
array after modification to slice nums2 [100 101 80]  
```

从输出中可以清楚地看出，当切片共享同一个数组时。对切​​片所做的修改反映在数组中。

### 切片的长度和容量

切片的长度是切片中元素的数量。切片的容量是基础数组中从创建切片的索引开始的元素数。

让我们写一些代码来更好地理解这一点。

```go
package main

import (  
    "fmt"
)

func main() {  
    fruitarray := [...]string{"apple", "orange", "grape", "mango", "water melon", "pine apple", "chikoo"}
    fruitslice := fruitarray[1:3]
    fmt.Printf("length of slice %d capacity %d", len(fruitslice), cap(fruitslice)) //length of fruitslice is 2 and capacity is 6
}
```

在上面的程序中， fruitslice 是从 fruitarray 的索引 1 和 2 创建的。因此 fruitslice 的长度是2。

fruitarray 的长度是 7。 fruiteslice 是从 fruitarray 的索引 1 创建的。因此， fruitslice 的容量是 fruitarray 中从索引 1 开始的元素数，即从 orange 开始，该值为 6 。因此 fruitslice 的容量是 6。程序打印 slice 2 的容量为 6 的长度。

切片可以重新切片到它的容量。超出此范围的任何内容都会导致程序抛出运行时错误。

```go
package main

import (  
    "fmt"
)

func main() {  
    fruitarray := [...]string{"apple", "orange", "grape", "mango", "water melon", "pine apple", "chikoo"}
    fruitslice := fruitarray[1:3]
    fmt.Printf("length of slice %d capacity %d\n", len(fruitslice), cap(fruitslice)) //length of is 2 and capacity is 6
    fruitslice = fruitslice[:cap(fruitslice)] //re-slicing furitslice till its capacity
    fmt.Println("After re-slicing length is",len(fruitslice), "and capacity is",cap(fruitslice))
}
```

在行号上述程序的 11， fruitslice 被重新切片到它的容量。上面的程序输出，

```sh
length of slice 2 capacity 6  
After re-slicing length is 6 and capacity is 6  
```

### 使用 make 创建切片

func make([]T, len, cap) []T 可用于通过传递类型、长度和容量来创建切片。容量参数是可选的，默认为长度。 make 函数创建一个数组并返回对它的切片引用。

```go
package main

import (  
    "fmt"
)

func main() {  
    i := make([]int, 5, 5)
    fmt.Println(i)
}
```
当使用 make 创建切片时，这些值默认为零。上面的程序会输出 [0 0 0 0 0] 。


###  附加到切片

正如我们已经知道的那样，数组的长度是固定的，并且它们的长度不能增加。切片是动态的，可以使用 append 函数将新元素附加到切片。 append 函数的定义是 func append(s []T, x ...T) []T 。

函数定义中的 x ...T 意味着该函数接受参数 x 的可变数量的参数。这些类型的函数称为可变参数函数。

有一个问题可能会困扰你。如果切片由数组支持并且数组本身是固定长度的，那么切片为什么是动态长度的。那么在幕后发生的事情是，当新元素附加到切片时，会创建一个新数组。现有数组的元素被复制到这个新数组，并返回这个新数组的新切片引用。新片的容量现在是旧片的两倍。很酷吧:)。下面的程序会让事情变得清晰。

```go
package main

import (  
    "fmt"
)

func main() {  
    cars := []string{"Ferrari", "Honda", "Ford"}
    fmt.Println("cars:", cars, "has old length", len(cars), "and capacity", cap(cars)) //capacity of cars is 3
    cars = append(cars, "Toyota")
    fmt.Println("cars:", cars, "has new length", len(cars), "and capacity", cap(cars)) //capacity of cars is doubled to 6
}
```

在上面的程序中， cars 的容量初始为3。我们向 cars 添加了一个新元素。 将 append(cars, "Toyota") 返回的切片再次赋值给cars。现在汽车的容量增加一倍，变成6辆。上面程序的输出是

```sh
cars: [Ferrari Honda Ford] has old length 3 and capacity 3  
cars: [Ferrari Honda Ford Toyota] has new length 4 and capacity 6  
```

切片类型的零值是 nil 。 nil 切片的长度和容量为 0。可以使用 append 函数将值附加到 nil 切片。

```go
package main

import (  
    "fmt"
)

func main() {  
    var names []string //zero value of a slice is nil
    if names == nil {
        fmt.Println("slice is nil going to append")
        names = append(names, "John", "Sebastian", "Vinay")
        fmt.Println("names contents:",names)
    }
}
```

在上面的程序中， names 是 nil，我们在 names 上附加了 3 个字符串。该程序的输出是

```sh
slice is nil going to append  
names contents: [John Sebastian Vinay]  
```

也可以使用 ... 运算符将一个切片附加到另一个切片。您可以在可变参数函数教程中了解有关此运算符的更多信息。

```go
package main

import (  
    "fmt"
)

func main() {  
    veggies := []string{"potatoes","tomatoes","brinjal"}
    fruits := []string{"oranges","apples"}
    food := append(veggies, fruits...)
    fmt.Println("food:",food)
}
```

在行号上面的 10 个程序食物是通过将 fruits 附加到 veggies 创建的。程序的输出是 food: [potatoes tomatoes brinjal oranges apples]


### 将切片传递给函数

切片可以被认为是在内部由结构类型表示的。这是它的样子，

```go
type slice struct {  
    Length        int
    Capacity      int
    ZerothElement *byte
}
```

切片包含长度、容量和指向数组第零个元素的指针。当一个切片被传递给一个函数时，即使它是按值传递的，指针变量也会引用相同的底层数组。因此，当切片作为参数传递给函数时，函数内部所做的更改在函数外部也是可见的。让我们编写一个程序来检查一下。

```go
package main

import (  
    "fmt"
)

func subtactOne(numbers []int) {  
    for i := range numbers {
        numbers[i] -= 2
    }

}
func main() {  
    nos := []int{8, 7, 6}
    fmt.Println("slice before function call", nos)
    subtactOne(nos)                               //function modifies the slice
    fmt.Println("slice after function call", nos) //modifications are visible outside
}
```

上述程序函数subtactOne调用将切片的每个元素递减 2。在函数调用后打印切片时，这些更改是可见的。如果您还记得的话，这与数组不同，数组在函数内部对数组所做的更改在函数外部不可见。上述程序的输出是，

```sh
slice before function call [8 7 6]  
slice after function call [6 5 4]  
```

###  多维切片
类似于数组，切片可以有多个维度。

```go
package main

import (  
    "fmt"
)


func main() {  
     pls := [][]string {
            {"C", "C++"},
            {"JavaScript"},
            {"Go", "Rust"},
            }
    for _, v1 := range pls {
        for _, v2 := range v1 {
            fmt.Printf("%s ", v2)
        }
        fmt.Printf("\n")
    }
}
```

该程序的输出是，

```sh
C C++  
JavaScript  
Go Rust 
```

### 更多

更多关于go基础的内容，请 访问社区官网 cit965.com ：）
