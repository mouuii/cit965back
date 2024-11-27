---
sidebar_label: 28-defer
sidebar_position: 28
title: 28-defer
---
Welcome to tutorial no. 29 in [Golang tutorial series](https://golangbot.com/learn-golang-series/).

### What is Defer?

**Defer statement is used to execute a [function](https://golangbot.com/functions/) call just before the surrounding function where the defer statement is present returns.** The definition might seem complex but it's pretty simple to understand by means of an example.

### Example

```
package main

import (  
    "fmt"
)

func finished() {  
    fmt.Println("Finished finding largest")
}

func largest(nums []int) {  
    defer finished()    
    fmt.Println("Started finding largest")
    max := nums[0]
    for _, v := range nums {
        if v > max {
            max = v
        }
    }
    fmt.Println("Largest number in", nums, "is", max)
}

func main() {  
    nums := []int{78, 109, 2, 563, 300}
    largest(nums)
}
```

[Run in playground](https://play.golang.org/p/IlccOsuSUE)

The above is a simple program to find the largest number of a given slice. The `largest` functions takes a _int [slice](https://golangbot.com/arrays-and-slices/#slices)_ as parameter and prints the largest number of this slice. The first line of the largest function contains the statement `defer finished()`. This means that the `finished()` function will be called just before the `largest` function returns. Run this program and you can see the following output printed.

```
Started finding largest  
Largest number in [78 109 2 563 300] is 563  
Finished finding largest  
```

The largest function starts executing and prints the first two lines of the above output. And before it could return, our deferred function `finished` executes and prints the text `Finished finding largest` :)

### Deferred methods

Defer is not restricted only to [functions](https://golangbot.com/functions/). It is perfectly legal to defer a [method](https://golangbot.com/methods/) call too. Let's write a small program to test this.

```
package main

import (  
    "fmt"
)


type person struct {  
    firstName string
    lastName string
}

func (p person) fullName() {  
    fmt.Printf("%s %s",p.firstName,p.lastName)
}

func main() {  
    p := person {
        firstName: "John",
        lastName: "Smith",
    }
    defer p.fullName()
    fmt.Printf("Welcome ")  
}
```

[Run in playground](https://play.golang.org/p/lZ74OAwnRD)

In the above program we have deferred a method call in line no. 22. The rest of the program is self explanatory. This program outputs,

```
Welcome John Smith  
```

### Arguments evaluation

The arguments of a deferred function are evaluated when the `defer` statement is executed and not when the actual function call is done.

Let's understand this by means of an example.

```
package main

import (  
    "fmt"
)

func printA(a int) {  
    fmt.Println("value of a in deferred function", a)
}
func main() {  
    a := 5
    defer printA(a)
    a = 10
    fmt.Println("value of a before deferred function call", a)

}
```

[Run in playground](https://play.golang.org/p/sBnwrUgObd)

In the program above `a` initially has a value of `5` in line no. 11. When the defer statement is executed in line no. 12, the value of `a` is 5 and hence this will be the argument to the `printA` function which is deferred. We change the value of `a` to 10 in line no. 13. The next line prints the value of `a`. This program outputs,

```
value of a before deferred function call 10  
value of a in deferred function 5  
```

From the above output it can be understood that although the value of `a` changes to `10` after the defer statement is executed, the actual deferred function call `printA(a)` still prints `5`.

### Stack of defers

When a function has multiple defer calls, they are pushed on to a stack and executed in Last In First Out (LIFO) order.

We will write a small program which prints a string in reverse using a stack of defers.

```
package main

import (  
    "fmt"
)

func main() {  
    name := "Naveen"
    fmt.Printf("Original String: %s\n", string(name))
    fmt.Printf("Reversed String: ")
    for _, v := range name {
        defer fmt.Printf("%c", v)
    }
}
```

[Run in playground](https://go.dev/play/p/Aa5Lr65xcvC)

In the program above, the `for range` loop in line no. 11, iterates the string and calls `defer fmt.Printf("%c", v)` in line no. 12. These deferred calls will be added to a stack.

![stack of defers](https://golangbot.com/content/images/2020/02/defer-stack.png)

The above image represents the content of the stack after the defer calls are added. The [stack](https://en.wikipedia.org/wiki/Stack_%28abstract_data_type%29_) is a last in first out datastructure. The defer call that is pushed to the stack last will be pulled out and executed first. In this case `defer fmt.Printf("%c", 'n')` will be executed first and hence the string will be printed in reverse order.

This program will output,

```
Original String: Naveen  
Reversed String: neevaN  
```

### Practical use of defer

The code samples we saw so far don't show the practical use of defer. In this section we will look into some practical uses of defer.

Defer is used in places where a function call should be executed irrespective of the code flow. Let's understand this with the example of a program which makes use of [WaitGroup](https://golangbot.com/buffered-channels-worker-pools/#waitgroup). We will first write the program without using defer and then we will modify it to use defer and understand how useful defer is.

```
package main

import (  
    "fmt"
    "sync"
)

type rect struct {  
    length int
    width  int
}

func (r rect) area(wg *sync.WaitGroup) {  
    if r.length < 0 {
        fmt.Printf("rect %v's length should be greater than zero\n", r)
        wg.Done()
        return
    }
    if r.width < 0 {
        fmt.Printf("rect %v's width should be greater than zero\n", r)
        wg.Done()
        return
    }
    area := r.length * r.width
    fmt.Printf("rect %v's area %d\n", r, area)
    wg.Done()
}

func main() {  
    var wg sync.WaitGroup
    r1 := rect{-67, 89}
    r2 := rect{5, -67}
    r3 := rect{8, 9}
    rects := []rect{r1, r2, r3}
    for _, v := range rects {
        wg.Add(1)
        go v.area(&wg)
    }
    wg.Wait()
    fmt.Println("All go routines finished executing")
}
```

[Run in playground](https://play.golang.org/p/kXL85U0Dd_)

In the program above, we have created a `rect` struct in line no. 8 and a method `area` on `rect` in line no. 13 which calculates the area of the rectangle. This method checks whether the length and width of the rectangle is less than zero. If it is so, it prints a corresponding message else it prints the area of the rectangle.

The `main` function creates 3 variables `r1`, `r2` and `r3` of type `rect`. They are then added to the `rects` slice in line no. 34. This slice is then iterated using a `for range` loop and the `area` method is called as a concurrent [Goroutine](https://golangbot.com/goroutines/) in line no. 37. The [WaitGroup](https://golangbot.com/buffered-channels-worker-pools#waitgroup) `wg` is used to ensure that the main function is blocked until all Goroutines finish executing. This WaitGroup is passed to the area method as an argument and the area method calls `wg.Done()` in line nos. 16, 21 and 26 to notify the main function that the Goroutine is done with its job. _If you notice closely, you can see that these calls happen just before the area method returns. wg.Done() should be called before the method returns irrespective of the path the code flow takes and hence these calls can be effectively replaced by a single `defer` call._

Let's rewrite the above program using defer.

In the program below, we have removed the 3 `wg.Done()` calls in the above program and replaced it with a single `defer wg.Done()` call in line no. 14. This makes the code more simple and understandable.

```
package main

import (  
    "fmt"
    "sync"
)

type rect struct {  
    length int
    width  int
}

func (r rect) area(wg *sync.WaitGroup) {  
    defer wg.Done()
    if r.length < 0 {
        fmt.Printf("rect %v's length should be greater than zero\n", r)
        return
    }
    if r.width < 0 {
        fmt.Printf("rect %v's width should be greater than zero\n", r)
        return
    }
    area := r.length * r.width
    fmt.Printf("rect %v's area %d\n", r, area)
}

func main() {  
    var wg sync.WaitGroup
    r1 := rect{-67, 89}
    r2 := rect{5, -67}
    r3 := rect{8, 9}
    rects := []rect{r1, r2, r3}
    for _, v := range rects {
        wg.Add(1)
        go v.area(&wg)
    }
    wg.Wait()
    fmt.Println("All go routines finished executing")
}
```

[Run in playground](https://play.golang.org/p/JuUvytLfBv)

This program outputs,

```
rect {8 9}'s area 72  
rect {-67 89}'s length should be greater than zero  
rect {5 -67}'s width should be greater than zero  
All go routines finished executing  
```

There is one more advantage of using defer in the above program. Let's say we add another return path to the `area` method using a new `if` condition. If the call to `wg.Done()` was not deferred, we have to be careful and ensure that we call `wg.Done()` in this new return path. But since the call to `wg.Done()` is defered, we need not worry about adding new return paths to this method.

This brings us to the end of this tutorial. Have a good day.

**Next tutorial - [Error Handling](https://golangbot.com/error-handling/)**