---
sidebar_label: 17-interface1
sidebar_position: 17
title: 17-interface1
---

Welcome to tutorial no. 18 in [Golang tutorial series](https://golangbot.com/learn-golang-series/). This is the first part in our 2 part interface tutorial.

### What is an interface?

**In Go, an interface is a set of method signatures. When a type provides definition for all the methods in the interface, it is said to implement the interface.** It is much similar to the OOP world. Interface specifies what [methods](https://golangbot.com/methods/) a type should have and the type decides how to implement these methods.

For example _WashingMachine_ can be an interface with [method](https://golangbot.com/methods/) signatures _Cleaning()_ and _Drying()_. Any type which provides definition for _Cleaning()_ and _Drying()_ methods is said to implement the _WashingMachine_ interface.

### Declaring and implementing an interface

Let's dive right into a program that creates an interface and implements it.

```
package main

import (  
    "fmt"
)

//interface definition
type VowelsFinder interface {  
    FindVowels() []rune
}

type MyString string

//MyString implements VowelsFinder
func (ms MyString) FindVowels() []rune {  
    var vowels []rune
    for _, rune := range ms {
        if rune == 'a' || rune == 'e' || rune == 'i' || rune == 'o' || rune == 'u' {
            vowels = append(vowels, rune)
        }
    }
    return vowels
}

func main() {  
    name := MyString("Sam Anderson")
    var v VowelsFinder
    v = name // possible since MyString implements VowelsFinder
    fmt.Printf("Vowels are %c", v.FindVowels())

}
```

[Run in playground](https://play.golang.org/p/F-T3S_wNNB)

Line no. 8 of the program above creates a interface type named `VowelsFinder` which has one method `FindVowels() []rune`.

In the next line, a type `MyString` is created.

**In line no. 15 we add the method `FindVowels() []rune` to the receiver type `MyString`. Now `MyString` is said to implement the interface `VowelsFinder`.** This is quite different from other languages like Java where a class has to explicitly state that it implements an interface using the `implements` keyword. **This is not needed in Go and Go interfaces are implemented implicitly if a type contains all the methods declared in the interface.**

In line no.28, we assign `name` which is of type `MyString` to v of type `VowelsFinder`. This is possible since `MyString` implements the `VowelsFinder` interface. `v.FindVowels()` in the next line calls the FindVowels method on `MyString` type and prints all the vowels in the string `Sam Anderson`. This program outputs

```
Vowels are [a e o]  
```

Congrats! You have created and implemented your first interface.

### Practical use of an interface

The above example taught us how to create and implement interfaces, but it didn't really show the practical use of an interface. Instead of `v.FindVowels()`, if we used `name.FindVowels()` in the program above, it would have also worked and there would have been no use for interface.

Now let's look at a practical use of interface.

We will write a simple program that calculates the total expense for a company based on the individual salaries of the employees. For brevity, we have assumed that all expenses are in USD.

```
package main

import (  
    "fmt"
)

type SalaryCalculator interface {  
    CalculateSalary() int
}

type Permanent struct {  
    empId    int
    basicpay int
    pf       int
}

type Contract struct {  
    empId    int
    basicpay int
}

//salary of permanent employee is the sum of basic pay and pf
func (p Permanent) CalculateSalary() int {  
    return p.basicpay + p.pf
}

//salary of contract employee is the basic pay alone
func (c Contract) CalculateSalary() int {  
    return c.basicpay
}

/*
total expense is calculated by iterating through the SalaryCalculator slice and summing  
the salaries of the individual employees  
*/
func totalExpense(s []SalaryCalculator) {  
    expense := 0
    for _, v := range s {
        expense = expense + v.CalculateSalary()
    }
    fmt.Printf("Total Expense Per Month $%d", expense)
}

func main() {  
    pemp1 := Permanent{
        empId:    1,
        basicpay: 5000,
        pf:       20,
    }
    pemp2 := Permanent{
        empId:    2,
        basicpay: 6000,
        pf:       30,
    }
    cemp1 := Contract{
        empId:    3,
        basicpay: 3000,
    }
    employees := []SalaryCalculator{pemp1, pemp2, cemp1}
    totalExpense(employees)

}
```

[Run in playground](https://play.golang.org/p/3DZQH_Xh_Pl)

Line no. 7 of the above program declares the `SalaryCalculator` interface with a single method `CalculateSalary() int`.

We have two kinds of employees in the company, `Permanent` and `Contract` defined by [structs](https://golangbot.com/structs/) in line no. 11 and 17. The salary of permanent employees is the sum of the `basicpay` and `pf` whereas for contract employees it's just the basic pay `basicpay`. This is expressed in the corresponding `CalculateSalary` methods in line. no 23 and 28 respectively. By declaring this method, both `Permanent` and `Contract` structs now implement the `SalaryCalculator` interface.

The `totalExpense` [function](https://golangbot.com/functions/) declared in line no.36 expresses the beauty of interfaces. This method takes a [slice](https://golangbot.com/arrays-and-slices/) of SalaryCalculator interface `[]SalaryCalculator` as a parameter. In line no. 59 we pass a slice that contains both `Permanent` and `Contract` types to the `totalExpense` function. The `totalExpense` function calculates the expense by calling the `CalculateSalary` method of the corresponding type. This is done in line. no 39.

The program outputs

```
Total Expense Per Month $14050  
```

The biggest advantage of this is that `totalExpense` can be extended to any new employee type without any code changes. Let's say the company adds a new type of employee `Freelancer` with a different salary structure. This `Freelancer` can just be passed in the slice argument to `totalExpense` without even a single line of code change to the `totalExpense` function. This method will do what it's supposed to do as `Freelancer` will also implement the `SalaryCalculator` interface :).

Let's modify this program and add the new `Freelancer` employee. Salary for the Freelancer is the product of rate per hour and total no of hours worked.

```
package main

import (  
    "fmt"
)

type SalaryCalculator interface {  
    CalculateSalary() int
}

type Permanent struct {  
    empId    int
    basicpay int
    pf       int
}

type Contract struct {  
    empId    int
    basicpay int
}

type Freelancer struct {  
    empId       int
    ratePerHour int
    totalHours  int
}

//salary of permanent employee is sum of basic pay and pf
func (p Permanent) CalculateSalary() int {  
    return p.basicpay + p.pf
}

//salary of contract employee is the basic pay alone
func (c Contract) CalculateSalary() int {  
    return c.basicpay
}

//salary of freelancer
func (f Freelancer) CalculateSalary() int {  
    return f.ratePerHour * f.totalHours
}

/*
total expense is calculated by iterating through the SalaryCalculator slice and summing  
the salaries of the individual employees  
*/
func totalExpense(s []SalaryCalculator) {  
    expense := 0
    for _, v := range s {
        expense = expense + v.CalculateSalary()
    }
    fmt.Printf("Total Expense Per Month $%d", expense)
}

func main() {  
    pemp1 := Permanent{
        empId:    1,
        basicpay: 5000,
        pf:       20,
    }
    pemp2 := Permanent{
        empId:    2,
        basicpay: 6000,
        pf:       30,
    }
    cemp1 := Contract{
        empId:    3,
        basicpay: 3000,
    }
    freelancer1 := Freelancer{
        empId:       4,
        ratePerHour: 70,
        totalHours:  120,
    }
    freelancer2 := Freelancer{
        empId:       5,
        ratePerHour: 100,
        totalHours:  100,
    }
    employees := []SalaryCalculator{pemp1, pemp2, cemp1, freelancer1, freelancer2}
    totalExpense(employees)

}
```

[Run in playground](https://play.golang.org/p/J48P5g8ArLn)

We have added the `Freelancer` struct in line no. 22 and declared the `CalculateSalary` method in line no. 39. No other code change is required in the `totalExpense` method since `Freelancer` struct also implements the `SalaryCalculator` interface. We added a couple of `Freelancer` employees in the `main` method. This program prints,

```
Total Expense Per Month $32450  
```

### Interface internal representation

An interface can be thought of as being represented internally by a tuple `(type, value)`. `type` is the underlying concrete type of the interface and `value` holds the value of the concrete type.

Let's write a program to understand better.

```
package main

import (  
    "fmt"
)

type Worker interface {  
    Work()
}

type Person struct {  
    name string
}

func (p Person) Work() {  
    fmt.Println(p.name, "is working")
}

func describe(w Worker) {  
    fmt.Printf("Interface type %T value %v\n", w, w)
}

func main() {  
    p := Person{
        name: "Naveen",
    }
    var w Worker = p
    describe(w)
    w.Work()
}
```

[Run in playground](https://play.golang.org/p/kweC7_oELzE)

_Worker_ interface has one method `Work()` and _Person_ struct type implements that interface. In line no. 27, we assign the [variable](https://golangbot.com/variables/) `p` of type `Person` to `w` which is of type `Worker`. Now the concrete type of `w` is `Person` and it contains a `Person` with `name` field `Naveen`. The `describe` function in line no.17 prints the value and concrete type of the interface. This program outputs

```
Interface type main.Person value {Naveen}  
Naveen is working  
```

We discuss more on how to extract the underlying value of the interface in the upcoming sections.

### Empty interface

**An interface that has zero methods is called an empty interface. It is represented as `interface{}`.** Since the empty interface has zero methods, all types implement the empty interface.

```
package main

import (  
    "fmt"
)

func describe(i interface{}) {  
    fmt.Printf("Type = %T, value = %v\n", i, i)
}

func main() {  
    s := "Hello World"
    describe(s)
    i := 55
    describe(i)
    strt := struct {
        name string
    }{
        name: "Naveen R",
    }
    describe(strt)
}
```

[Run in playground](https://play.golang.org/p/Fm5KescoJb)

In the program above, in line no.7, the `describe(i interface{})` function takes an empty interface as an argument and hence any type can be passed.

We pass `string`, `int` and `struct` to the `describe` function in line nos. 13, 15 and 21 respectively. This program prints,

```
Type = string, value = Hello World  
Type = int, value = 55  
Type = struct { name string }, value = {Naveen R}  
```

### Type assertion

Type assertion is used to extract the underlying value of the interface.

**i.(T)** is the syntax which is used to get the underlying value of interface `i` whose concrete type is `T`.

A program is worth a thousand words 😀. Let's write one for type assertion.

```
package main

import (  
    "fmt"
)

func assert(i interface{}) {  
    s := i.(int) //get the underlying int value from i
    fmt.Println(s)
}
func main() {  
    var s interface{} = 56
    assert(s)
}
```

[Run in playground](https://play.golang.org/p/YstKXEeSBL)

The concrete type of `s` in line no. 12 is `int`. We use the syntax `i.(int)` in line no. 8 to fetch the underlying int value of i. This program prints `56`.

What will happen if the concrete type in the above program is not int? Well, let's find out.

```
package main

import (  
    "fmt"
)

func assert(i interface{}) {  
    s := i.(int) 
    fmt.Println(s)
}
func main() {  
    var s interface{} = "Steven Paul"
    assert(s)
}
```

[Run in playground](https://play.golang.org/p/88KflSceHK)

In the program above we pass `s` of concrete type `string` to the `assert` function which tries to extract a int value from it. This program will panic with the message `panic: interface conversion: interface {} is string, not int`.

To solve the above problem, we can use the syntax

```
v, ok := i.(T)  
```

If the concrete type of `i` is `T` then `v` will have the underlying value of `i` and `ok` will be true.

If the concrete type of `i` is not `T` then `ok` will be false and `v` will have the zero value of type `T` and **the program will not panic**.

```
package main

import (  
    "fmt"
)

func assert(i interface{}) {  
    v, ok := i.(int)
    fmt.Println(v, ok)
}
func main() {  
    var s interface{} = 56
    assert(s)
    var i interface{} = "Steven Paul"
    assert(i)
}
```

[Run in playground](https://play.golang.org/p/0sB-KlVw8A)

When `Steven Paul` is passed to the `assert` function, `ok` will be false since the concrete type of `i` is not `int` and `v` will have the value 0 which is the zero value of `int`. This program will print,

```
56 true  
0 false  
```

### Type switch

**A type switch is used to compare the concrete type of an interface against multiple types specified in various case statements. It is similar to [switch case](https://golangbot.com/switch/). The only difference being the cases specify types and not values as in normal switch.**

The syntax for type switch is similar to Type assertion. In the syntax `i.(T)` for Type assertion, the type `T` should be replaced by the keyword `type` for type switch. Let's see how this works in the program below.

```
package main

import (  
    "fmt"
)

func findType(i interface{}) {  
    switch i.(type) {
    case string:
        fmt.Printf("I am a string and my value is %s\n", i.(string))
    case int:
        fmt.Printf("I am an int and my value is %d\n", i.(int))
    default:
        fmt.Printf("Unknown type\n")
    }
}
func main() {  
    findType("Naveen")
    findType(77)
    findType(89.98)
}
```

[Run in playground](https://play.golang.org/p/XYPDwOvoCh)

In line no. 8 of the above program, `switch i.(type)` specifies a type switch. Each of the case statements compare the concrete type of `i` to a specific type. If any case matches, the corresponding statement is printed. This program outputs,

```
I am a string and my value is Naveen  
I am an int and my value is 77  
Unknown type  
```

_89.98_ in line no. 20 is of type `float64` and does not match any of the cases and hence `Unknown type` is printed in the last line.

**It is also possible to compare a type to an interface. If we have a type and if that type implements an interface, it is possible to compare this type with the interface it implements.**

Let's write a program for more clarity.

```
package main

import "fmt"

type Describer interface {  
    Describe()
}
type Person struct {  
    name string
    age  int
}

func (p Person) Describe() {  
    fmt.Printf("%s is %d years old", p.name, p.age)
}

func findType(i interface{}) {  
    switch v := i.(type) {
    case Describer:
        v.Describe()
    default:
        fmt.Printf("unknown type\n")
    }
}

func main() {  
    findType("Naveen")
    p := Person{
        name: "Naveen R",
        age:  25,
    }
    findType(p)
}
```

[Run in playground](https://play.golang.org/p/o6aHzIz4wC)

In the program above, the `Person` struct implements the `Describer` interface. In the case statement in line no. 19, `v` is compared to the `Describer` interface type. `p` implements `Describer` and hence this case is satisfied and `Describe()` method is called.

This program prints

```
unknown type  
Naveen R is 25 years old  
```

This brings us to the end of Interfaces Part I. We will continue our discussion about interfaces in Part II. Please leave your valuable feedback in the comments.

**Next tutorial - [Interfaces - II](https://golangbot.com/interfaces-part-2/)**