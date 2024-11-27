---
sidebar_label: '8.流程控制语句'
sidebar_position: 6
title: 8.流程控制语句
---

## if else
if 是一个具有布尔条件的表达式，如果该条件的计算结果为 true ，它就会执行一段代码。如果条件的计算结果为 false ，它会执行另一个 else 代码块。在本教程中，我们将了解使用 if 语句的各种语法和方法。

### If statement syntax

if 语句的语法如下所示

```go
if condition {  
}
```

如果 condition 为真，则执行大括号 { 和 } 之间的代码行。与 C 等其他语言不同，大括号 {  } 是必需的，即使大括号 {  } 之间只有一行代码。

### 示例
让我们编写一个简单的程序来判断一个数是偶数还是奇数。
```go
package main

import (  
    "fmt"
)

func main() {  
    num := 10
    if num%2 == 0 { //checks if number is even
        fmt.Println("The number", num, "is even")
        return
    }
    fmt.Println("The number", num, "is odd")
}
```

在上面的程序中， 判断 num 除以 2 的余数是否为零。由于在本例中是 0 ，所以打印文本 The number 10 is even 并且程序返回。

### If else statement

if 语句有一个可选的 else 构造，如果 if 语句中的条件计算为 false ，它将被执行。

```go
if condition {  
} else {
}
```

在上面的代码片段中，如果 condition 的计算结果为 false ，那么 else { 和 } 之间的代码行将被执行。

让我们重写程序以使用 if else 语句查找数字是奇数还是偶数。
```go
package main

import (  
    "fmt"
)

func main() {  
    num := 11
    if num%2 == 0 { //checks if number is even
        fmt.Println("the number", num, "is even")
    } else {
        fmt.Println("the number", num, "is odd")
    }
}
```

在上面的代码中，我们没有像上一节那样在条件为 true 时返回，而是创建了一个 else 语句，如果条件为 false 则将执行该语句。在这种情况下，由于 11 是奇数，if 条件是 false 并且执行 else 语句中的代码行。上面的程序将打印。
```sh
the number 11 is odd  
```

### If ... else if ... else statement

if 语句还有可选的 else if 和 else 组件。下面提供了相同的语法

```go
if condition1 {  
...「1」
} else if condition2 {
...「2」
} else {
...「3」
}
```

在上面的语句中，如果 condition1 为真，则执行 ...「1」中的代码

如果 condition1 为 false 且 condition2 为真，则执行...「2」 中的代码

如果 condition1 和 condition2 都为假，则执行 ...「3」中的代码

可以有任意数量的 else if 语句。

通常，无论 if 或 else if 的条件计算结果为 true ，都会执行相应的代码块。如果条件都不为真，则执行 else 块。

让我们编写一个使用 else if 的程序。

```go
package main

import (  
    "fmt"
)

func main() {  
    num := 99
    if num <= 50 {
        fmt.Println(num, "is less than or equal to 50")
    } else if num >= 51 && num <= 100 {
        fmt.Println(num, "is between 51 and 100")
    } else {
        fmt.Println(num, "is greater than 100")
    }
}

```

在上面的程序中，第 1 行的条件 else if num >= 51 && num <= 100 。 11 是 true ，因此程序将打印
```sh
99 is between 51 and 100  
```
### If with assignment

if 还有一个变体，它包括一个可选的速记赋值语句，它在条件被评估之前执行。它的语法是


```go
if assignment-statement; condition {  
}
```

在上面的代码片段中， assignment-statement 在评估条件之前首先执行。

让我们重写使用上述语法判断数字是偶数还是奇数的程序。

```go
package main

import (  
    "fmt"
)

func main() {  
    if num := 10; num % 2 == 0 { //checks if number is even
        fmt.Println(num,"is even") 
    }  else {
        fmt.Println(num,"is odd")
    }
}
```

在上面的程序中， num 在第 1 行的 if 语句中被初始化。 8. 需要注意的一件事是 num 只能从 if 和 else 内部访问。即 num 的范围仅限于 if else 块。如果我们尝试从 if 或 else 之外访问 num ，编译器会报错。当我们仅仅为了 if else 构造的目的声明一个变量时，这种语法通常会派上用场。在这种情况下使用此语法可确保变量的范围仅在 if else 语句内。

### Idiomatic Go

我们已经看到了各种 if-else 结构，实际上我们已经看到了编写同一程序的多种方法。例如，我们已经看到使用不同的 if else 结构编写检查数字是偶数还是奇数的程序的多种方法。哪一种是 Go 中惯用的编码方式？在 Go 的哲学中，最好避免不必要的分支和代码缩进，早点返回。我已经在下面的上一节中提供了程序，

```go
package main

import (  
    "fmt"
)

func main() {  
    if num := 10; num % 2 == 0 { //checks if number is even
        fmt.Println(num,"is even") 
    }  else {
        fmt.Println(num,"is odd")
    }
}
```

按照 Go 哲学编写上述程序的惯用方式是避免 else 并在条件为真时从 if 返回。

```go
package main

import (  
    "fmt"
)

func main() {  
    num := 10;
    if num%2 == 0 { //checks if number is even
        fmt.Println(num, "is even")
        return
    }
    fmt.Println(num, "is odd")

}
```

在上面的程序中，一旦发现是偶数，就立即返回。这避免了不必要的 else 代码分支。这就是 Go 编程习惯😃。请在编写 Go 程序时牢记这一点。


## Loops

循环语句用于重复执行一段代码。for 是 Go 中唯一可用的循环。 Go 没有 while 或 do while 循环，而这些循环存在于其他语言（如 C）中。

### for loop syntax
```go
for initialisation; condition; post {  
}
```

初始化语句只会执行一次。循环初始化后，将检查条件。如果条件的计算结果为真， { } 内的循环体将在 post 语句之后执行。 post 语句将在循环的每次成功迭代后执行。 post 语句执行后，将重新检查条件。如果为真，循环将继续执行，否则 for 循环终止。

### Example

```go
package main

import (  
    "fmt"
)

func main() {  
    for i := 1; i <= 10; i++ {
        fmt.Printf(" %d",i)
    }
}
```

在上面的程序中， i 被初始化为 1。条件语句将检查是否为 i <= 10 。如果条件为真，则打印 i 的值，否则循环终止。 post 语句在每次迭代结束时将 i 递增 1。一旦 i 大于 10，循环终止。

上面的程序会打印 1 2 3 4 5 6 7 8 9 10

for 循环中声明的变量仅在循环范围内可用。因此 i 不能在 for 循环体之外访问。

### break

break 语句用于在 for 循环完成正常执行之前突然终止它，并将控制权移至 for 循环之后的代码行

让我们编写一个程序，使用 break 打印从 1 到 5 的数字。
```go
package main

import (  
    "fmt"
)

func main() {  
    for i := 1; i <= 10; i++ {
        if i > 5 {
            break //loop is terminated if i > 5
        }
        fmt.Printf("%d ", i)
    }
    fmt.Printf("\nline after for loop")
}
```

在上面的程序中，每次迭代都会检查 i 的值。如果 i 大于 5，则执行 break 并终止循环。然后执行 for 循环之后的 print 语句。上面的程序会输出，

```sh
1 2 3 4 5  
line after for loop  
```

### continue

continue 语句用于跳过 for 循环的当前迭代。在 continue 语句之后的 for 循环中出现的所有代码都不会在当前迭代中执行。循环将继续进行下一次迭代。

让我们编写一个程序，使用 continue 打印从 1 到 10 的所有奇数

```go
package main

import (  
    "fmt"
)

func main() {  
    for i := 1; i <= 10; i++ {
        if i%2 == 0 {
            continue
        }
        fmt.Printf("%d ", i)
    }
}
```

在上面的程序中， if i%2 == 0 行检查 i 除以 2 的余数是否为 0。如果为零，则数字为偶数，然后执行 continue 语句，控制移动到循环的下一次迭代。因此 continue 之后的 print 语句将不会被调用，循环继续进行下一次迭代。上面程序的输出是 1 3 5 7 9

### Nested for loops

内部有另一个 for 循环的 for 循环称为嵌套for 循环。

让我们通过编写一个打印以下序列的程序来理解嵌套 for 循环。

```sh
*
**
***
****
*****
```

下面的程序使用嵌套的 for 循环来打印序列。行号中的变量 n 。 8 存储序列中的行数。在我们的例子中是 5 。外部 for 循环将 i 从 0 迭代到 4 ，内部 for 循环将 j 从 0 迭代到 i 的当前值。内部循环为每次迭代打印 * ，外部循环在每次迭代结束时打印一个新行。运行该程序，您会看到输出的序列。

```go
package main

import (  
    "fmt"
)

func main() {  
    n := 5
    for i := 0; i < n; i++ {
        for j := 0; j <= i; j++ {
            fmt.Print("*")
        }
        fmt.Println()
    }
}
```

### More examples

下面的程序打印从 0 到 10 的所有偶数。

```go
package main

import (  
    "fmt"
)

func main() {  
    i := 0
    for ;i <= 10; { // initialisation and post are omitted
        fmt.Printf("%d ", i)
        i += 2
    }
}
```

for 循环有 两个 “；” ， 分为三部分，initialisation, condition and post 。即初始化、条件和 Post ，他们都是可选的。在上面的程序中，省略了初始化和post。 i 在 for 循环外被初始化为 0 。只要 i <= 10 就会执行循环。 i 在 for 循环中递增 2。上面的程序输出 0 2 4 6 8 10 。

上面程序的for循环中的分号也可以省略。这种格式可以被认为是 while 循环的替代方法。上面的程序可以改写为，

```go
package main

import (  
    "fmt"
)

func main() {  
    i := 0
    for i <= 10 { //semicolons are ommitted and only condition is present
        fmt.Printf("%d ", i)
        i += 2
    }
}
```

## Switch Statement

switch 是一个条件语句，它计算表达式并将其与可能匹配列表进行比较，然后执行相应的代码块。它可以被视为替换复杂 if else 子句的惯用方式。

### Example 
一个示例程序抵得上一百个单词。让我们从一个简单的示例开始，它将一个手指编号作为输入并输出该手指的名称。例如，1 是拇指，2 是索引，依此类推。

```go
package main

import (  
    "fmt"
)

func main() {  
    finger := 4
    fmt.Printf("Finger %d is ", finger)
    switch finger {
    case 1:
        fmt.Println("Thumb")
    case 2:
        fmt.Println("Index")
    case 3:
        fmt.Println("Middle")
    case 4:
        fmt.Println("Ring")
    case 5:
        fmt.Println("Pinky")

    }
}
```

在上面的程序 switch finger 中，将 finger 的值与每个 case 语句进行比较。从上到下评估案例，并执行与表达式匹配的第一个案例。在这种情况下， finger 的值为 4 ，输出：

```sh
Finger 4 is Ring  
```

### Default case

我们手上只有5根手指。如果我们输入错误的手指号码会怎样？这就是默认情况出现的地方。当没有其他情况匹配时，将执行默认情况。

```go
package main

import (  
    "fmt"
)

func main() {  
    switch finger := 8; finger {
    case 1:
        fmt.Println("Thumb")
    case 2:
        fmt.Println("Index")
    case 3:
        fmt.Println("Middle")
    case 4:
        fmt.Println("Ring")
    case 5:
        fmt.Println("Pinky")
    default: //default case
        fmt.Println("incorrect finger number")
    }
}
```

在上面的程序中， finger 是 8 ，它不匹配任何情况，因此打印默认情况下的 incorrect finger number 。 default 不一定是 switch 语句中的最后一个 case。它可以出现在交换机的任何位置。

您可能还注意到 finger 声明中的一个小变化。它在开关本身中声明。 switch 可以包含在计算表达式之前执行的可选语句。在行号8、 finger 先声明，再在表达式中使用。在这种情况下， finger 的范围仅限于 switch 块。

### Multiple expressions in case

通过用逗号分隔，可以在一个案例中包含多个表达式。

```go
package main

import (  
    "fmt"
)

func main() {  
    letter := "i"
    fmt.Printf("Letter %s is a ", letter)
    switch letter {
    case "a", "e", "i", "o", "u": //multiple expressions in case
        fmt.Println("vowel")
    default:
        fmt.Println("not a vowel")
    }
}
```

上面的程序判断 letter 是否是元音字母。第 1 行中的代码 case "a", "e", "i", "o", "u": 。 11 匹配任何元音。因为 i 是一个元音字母，所以这个程序打印

```sh
Letter i is a vowel 
```

### Fallthrough

在 Go 中，控制在 case 执行后立即从 switch 语句中出来。 fallthrough 语句用于将控制权转移到紧跟在已执行案例之后的案例的第一条语句

让我们编写一个程序来理解fallthrough。我们的程序将检查输入的数字是否小于 50、100 或 200。例如，如果我们输入 75，程序将打印 75 小于 100 和 200。我们将使用 fallthrough 实现此目的。

```go
package main

import (  
    "fmt"
)

func number() int {  
        num := 15 * 5 
        return num
}

func main() {

    switch num := number(); { //num is not a constant
    case num < 50:
        fmt.Printf("%d is lesser than 50\n", num)
        fallthrough
    case num < 100:
        fmt.Printf("%d is lesser than 100\n", num)
        fallthrough
    case num < 200:
        fmt.Printf("%d is lesser than 200", num)
    }

}
```

switch 和 case 表达式不必只是常量。它们也可以在运行时进行评估。在上面的程序中， num 被初始化为函数 number() 的返回值 case num < 100: 为真，程序打印 75 is lesser than 100 。下一条语句是 fallthrough 。当遇到 fallthrough 时，控制移动到下一个 case 的第一条语句并打印 75 is lesser than 200

ps: fallthrough 应该是 case 中的最后一条语句。如果它出现在中间某处，编译器会抱怨 fallthrough statement out of place 。

使用 fallthrough 时需要考虑一个微妙之处。即使条件为假，也会发生 Fallthrough。

```go
package main

import (  
    "fmt"
)

func main() {  
    switch num := 25; { 
    case num < 50:
        fmt.Printf("%d is lesser than 50\n", num)
        fallthrough
    case num > 100:
        fmt.Printf("%d is greater than 100\n", num)     
    }

}
```

在上面的程序中， num 是 25，小于 50，因此第 1 行的情况就是这样。

下一个案例 case num > 100:  是错误的，因为 num < 100。但是 fallthrough 不考虑这一点。即使 case 评估为 false，Fallthrough 也会发生。因此，请确保您在使用 fallthrough 时了解自己在做什么。

上面的程序将打印

```sh
25 is lesser than 50  
25 is greater than 100  
```



### Breaking switch

break 语句可用于在开关完成之前尽早终止它。让我们添加一个条件，如果 num 小于 0，则 swwitch 应该终止。

```go
package main

import (  
    "fmt"
)

func main() {  
    switch num := -5; {
    case num < 50:
        if num < 0 {
            break
        }
        fmt.Printf("%d is lesser than 50\n", num)
        fallthrough
    case num < 100:
        fmt.Printf("%d is lesser than 100\n", num)
        fallthrough
    case num < 200:
        fmt.Printf("%d is lesser than 200", num)
    }

}
```

在上面的程序中， num 是 -5 ，因为 num < 0，break 语句在 switch 完成之前终止它，程序不打印任何内容:)