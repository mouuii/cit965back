---
sidebar_label: 12.map
sidebar_position: 12
title: 12.map
---

### 什么是Map？
Map是Go语言中的一种内置类型，用于存储键值对。让我们以一个拥有几名员工的初创公司为例。为简单起见，假设所有这些员工的名字是唯一的。我们需要一种数据结构来存储每个员工的薪水。Map非常适合这种情况。员工的姓名可以作为键，薪水可以作为值。Map类似于其他语言（如Python）中的字典。

如何创建Map？
可以通过将键和值的类型传递给make函数来创建Map。以下是创建新Map的语法。

make(map[键类型]值类型)
employeeSalary := make(map[string]int)
上面的代码创建了一个名为employeeSalary的Map，它具有字符串键和整数值。

```go

package main

import (  
    "fmt"
)

func main() {  
    employeeSalary := make(map[string]int)
    fmt.Println(employeeSalary)
}
```



上面的程序创建了一个名为employeeSalary的Map，其键类型为字符串，值类型为整数。上面的程序将打印：

```arduino

map[]
```



由于我们还没有向Map中添加任何元素，因此它是空的。

向Map中添加元素
向Map中添加新元素的语法与数组相同。下面的程序向employeeSalary Map中添加了一些新员工。

```go

package main

import (  
    "fmt"
)

func main() {  
    employeeSalary := make(map[string]int)
    employeeSalary["steve"] = 12000
    employeeSalary["jamie"] = 15000
    employeeSalary["mike"] = 9000
    fmt.Println("employeeSalary map contents:", employeeSalary)
}
```



我们添加了三个员工：steve、jamie和mike，以及他们对应的薪水。

上面的程序将打印：

```arduino

employeeSalary map contents: map[steve:12000 jamie:15000 mike:9000]
```



在声明时初始化Map也是可行的。

```go

package main

import (  
    "fmt"
)

func main() {  
    employeeSalary := map[string]int {
        "steve": 12000,
        "jamie": 15000,
    }
    employeeSalary["mike"] = 9000
    fmt.Println("employeeSalary map contents:", employeeSalary)
}
```



上面的程序声明了employeeSalary并在声明时向其中添加了两个元素。稍后又添加了一个键为mike的元素。该程序将打印：

```arduino

employeeSalary map contents: map[jamie:15000 mike:9000 steve:12000]
```



并非只有字符串类型才能作为键。所有可比较的类型，如布尔型、整数型、浮点型、复数型、字符串型等，都可以作为键。甚至用户自定义的类型（如结构体）也可以作为键。如果您想了解更多可比较类型的信息，请访问[http://golang.org/ref/spec#Comparison_operators。](http://golang.org/ref/spec#Comparison_operators%E3%80%82) 

Map的零值
Map的零值是nil。


 如果尝试向nil的Map添加元素，将会导致运行时发生panic错误。因此，在添加元素之前必须初始化Map。

```go

package main

func main() {  
    var employeeSalary map[string]int
    employeeSalary["steve"] = 12000
}
```



在上面的程序中，employeeSalary是nil，我们试图向Map中添加一个新的键。该程序将抛出错误：

```go

panic: assignment to entry in nil map
```



从Map中检索键的值
现在我们已经向Map中添加了一些元素，让我们学习如何检索它们。使用map[key]的语法可以检索Map的元素。

```go

package main

import (  
    "fmt"
)

func main() {  
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,
        "mike": 9000,
    }
    employee := "jamie"
    salary := employeeSalary[employee]
```

上述程序非常简单。检索并打印了员工Jamie的薪水。程序输出：

Jamie的薪水是15000
如果元素不存在会发生什么？Map将返回该元素类型的零值。对于employeeSalary map而言，如果我们尝试访问不存在的元素，将返回int类型的零值，即0。

```go

package main

import (  
    "fmt"
)

func main() {  
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,
    }
    fmt.Println("Joe的薪水是", employeeSalary["joe"])
}
```



上述程序的输出为：

Joe的薪水是0
上述程序将Joe的薪水返回为0。当我们尝试检索一个在map中不存在的键的值时，不会出现运行时错误。

检查键是否存在
在上一节中，我们了解到当键不存在时，将返回该类型的零值。但是，当我们想要确定键是否实际存在于map中时，这并没有帮助。

例如，我们想要知道employeeSalary map中是否存在一个键。

```go

value, ok := map[key]
```



以上是用于判断特定键是否存在于map中的语法。如果ok为true，则表示该键存在，其值存储在变量value中；否则，该键不存在。

```go

package main

import (  
    "fmt"
)

func main() {  
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,
    }
    newEmp := "joe"
    value, ok := employeeSalary[newEmp]
    if ok == true {
        fmt.Println(newEmp, "的薪水是", value)
        return
    }
    fmt.Println(newEmp, "未找到")
}
```



以上程序中，在第13行，由于joe不存在，ok将为false。因此，程序将打印：

未找到Joe
遍历map中的所有元素
可以使用for循环的range形式来遍历map中的所有元素。

```go

package main

import (  
    "fmt"
)

func main() {  
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,
        "mike":  9000,
    }
    fmt.Println("map的内容")
    for key, value := range employeeSalary {
        fmt.Printf("employeeSalary[%s] = %d\n", key, value)
    }
}
```



以上程序输出：

map的内容
employeeSalary[mike] = 9000
employeeSalary[steve] = 12000
employeeSalary[jamie] = 15000
重要的一点是，当使用for range从map中检索值时，无法保证每次执行程序时检索的顺序相同。它也不会与将元素添加到map中的顺序相同。

### 从map中删除元素
delete(map, key)是删除map中的键的语法。delete函数不返回任何值。

```go
package main

import (  
    "fmt"
)

func main() {  
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,     
        "mike": 9000,
    }
    fmt.Println("map before deletion", employeeSalary)
    delete(employeeSalary, "steve")
    fmt.Println("map after deletion", employeeSalary)

}
```

上面的程序删除密钥 steve 并打印

```sh
map before deletion map[steve:12000 jamie:15000 mike:9000]  
map after deletion map[mike:9000 jamie:15000] 
```

如果我们尝试删除映射中不存在的键，则不会有运行时错误。

### map of structs

到目前为止，我们只在地图上存储员工的工资。如果我们也能在地图上存储每个员工的国家/地区，那不是很好吗？这可以通过使用结构映射来实现。员工可以表示为包含字段工资和国家/地区的结构，它们将使用字符串键和结构值存储在地图中。让我们编写一个程序来了解如何做到这一点。

```go
package main

import (  
    "fmt"
)

type employee struct {  
    salary  int
    country string
}

func main() {  
    emp1 := employee{
        salary:  12000,
        country: "USA",
    }
    emp2 := employee{
        salary:  14000,
        country: "Canada",
    }
    emp3 := employee{
        salary:  13000,
        country: "India",
    }
    employeeInfo := map[string]employee{
        "Steve": emp1,
        "Jamie": emp2,
        "Mike":  emp3,
    }

    for name, info := range employeeInfo {
        fmt.Printf("Employee: %s Salary:$%d  Country: %s\n", name, info.salary, info.country)
    }

}
```

在上面的程序中， employee 结构包含字段 salary 和 country 。我们创建了3、 emp2 和 emp3 名员工。

在第 25 行中，我们使用我们创建的三个员工初始化一个键类型 string 和值类型 employee 的映射。

地图在第 31 行进行迭代，员工详细信息打印在下一行。该程序将打印，

```sh
Employee: Mike Salary:$13000  Country: India  
Employee: Steve Salary:$12000  Country: USA  
Employee: Jamie Salary:$14000  Country: Canada  
```

### length of the map
地图的长度可以使用 len 函数确定。

```go
package main

import (  
    "fmt"
)

func main() {  
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,
    }
    fmt.Println("length is", len(employeeSalary))

}
```

在上面的程序中，len（员工薪水）返回地图的长度。上面的程序打印，

```sh
length is 2  
```

### Maps are reference types

与切片类似，map是引用类型。将映射分配给新变量时，它们都指向相同的内部数据结构。因此，一个中所做的更改将反映在另一个中。

```go
package main

import (  
    "fmt"
)

func main() {  
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,     
        "mike": 9000,
    }
    fmt.Println("Original employee salary", employeeSalary)
    modified := employeeSalary
    modified["mike"] = 18000
    fmt.Println("Employee salary changed", employeeSalary)

}
```

在上述程序的第 14 行中， employeeSalary 分配给 modified 。在下一行中， mike 的薪水在 modified 地图中变为 18000 。迈克的薪水现在也将是 18000 分之一的 employeeSalary 。程序输出，

```sh
Original employee salary map[jamie:15000 mike:9000 steve:12000]  
Employee salary changed map[jamie:15000 mike:18000 steve:12000] 
```

当映射作为参数传递给函数时，情况也是如此。当对函数内的映射进行任何更改时，调用方也将看到它。

### Maps equality

无法使用 == 运算符比较地图。 == 只能用于检查地图是否为 nil 。

```go
package main

func main() {  
    map1 := map[string]int{
        "one": 1,
        "two": 2,
    }

    map2 := map1

    if map1 == map2 {
    }
}
```

上述程序将无法编译并显示错误

```sh
invalid operation: map1 == map2 (map can only be compared to nil)  
```

检查两个映射是否相等的一种方法是逐个比较每个映射的各个元素。另一种方法是使用反射。我鼓励你为此编写一个程序，并使其:)工作。

我已经在一个程序中编译了我们讨论过的所有概念。你可以从github下载它。

本教程到此结束。希望你喜欢它。请留下您的意见。