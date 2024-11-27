---
sidebar_label: 16-methods
sidebar_position: 16
title: 16-methods
---

Welcome to tutorial no. 17 in [Golang tutorial series](https://golangbot.com/learn-golang-series/).

### Introduction

A method is just a [function](https://golangbot.com/functions/) with a special receiver type between the `func` keyword and the method name. The receiver can either be a struct type or non-struct type.

The syntax of a method declaration is provided below.

```
func (t Type) methodName(parameter list) {  
}
```

The above snippet creates a method named `methodName` with receiver type `Type`. `t` is called as the receiver and it can be accessed within the method.

### Sample Method

Let's write a simple program that creates a method on a [struct](https://golangbot.com/structs/) type and calls it.

```
package main

import (  
    "fmt"
)

type Employee struct {  
    name     string
    salary   int
    currency string
}

/*
 displaySalary() method has Employee as the receiver type
*/
func (e Employee) displaySalary() {  
    fmt.Printf("Salary of %s is %s%d", e.name, e.currency, e.salary)
}

func main() {  
    emp1 := Employee {
        name:     "Sam Adolf",
        salary:   5000,
        currency: "$",
    }
    emp1.displaySalary() //Calling displaySalary() method of Employee type
}
```

[Run program in playground](https://play.golang.org/p/rRsI_sWAOZ)

In line no. 16 of the program above, we have created a method `displaySalary` on `Employee` struct type. The `displaySalary()` method has access to the receiver `e` inside it. In line no. 17, we are using the receiver `e` and printing the name, currency and salary of the employee.

In line no. 26 we have called the method using syntax `emp1.displaySalary()`.

This program prints `Salary of Sam Adolf is $5000`.

### Methods vs Functions

The above program can be rewritten using only functions and without methods.

```
package main

import (  
    "fmt"
)

type Employee struct {  
    name     string
    salary   int
    currency string
}

/*
 displaySalary() method converted to function with Employee as parameter
*/
func displaySalary(e Employee) {  
    fmt.Printf("Salary of %s is %s%d", e.name, e.currency, e.salary)
}

func main() {  
    emp1 := Employee{
        name:     "Sam Adolf",
        salary:   5000,
        currency: "$",
    }
    displaySalary(emp1)
}
```

[Run program in playground](https://play.golang.org/p/dFwObgCUU0)

In the program above, the `displaySalary` method is converted to a function and the `Employee` struct is passed as a parameter to it. This program also produces the exact same output `Salary of Sam Adolf is $5000`.

So why do we have methods when we can write the same program using functions. There are a couple of reasons for this. Let's look at them one by one.

-   [Go is not a pure object-oriented programming language](https://golang.org/doc/faq#Is_Go_an_object-oriented_language) and it does not support classes. Hence methods on types are a way to achieve behaviour similar to classes. Methods allow a logical grouping of behaviour related to a type similar to classes. In the above sample program, all behaviours related to the `Employee` type can be grouped by creating methods using `Employee` receiver type. For example, we can add methods like `calculatePension`, `calculateLeaves` and so on.
    
-   Methods with the same name can be defined on different types whereas functions with the same names are not allowed. Let's assume that we have a `Square` and `Circle` structure. It's possible to define a method named `Area` on both `Square` and `Circle`. This is done in the program below.
    

```
package main

import (  
    "fmt"
    "math"
)

type Rectangle struct {  
    length int
    width  int
}

type Circle struct {  
    radius float64
}

func (r Rectangle) Area() int {  
    return r.length * r.width
}

func (c Circle) Area() float64 {  
    return math.Pi * c.radius * c.radius
}

func main() {  
    r := Rectangle{
        length: 10,
        width:  5,
    }
    fmt.Printf("Area of rectangle %d\n", r.Area())
    c := Circle{
        radius: 12,
    }
    fmt.Printf("Area of circle %f", c.Area())
}
```

[Run program in playground](https://play.golang.org/p/0hDM3E3LiP)

This program prints

```
Area of rectangle 50  
Area of circle 452.389342  
```

The above property of methods is used to implement interfaces. We will discuss this in detail in the next tutorial when we deal with [interfaces](https://golangbot.com/interfaces-part-1/).

### Pointer Receivers vs Value Receivers

So far we have seen methods only with value receivers. It is possible to create methods with pointer receivers. The difference between value and pointer receiver is, changes made inside a method with a pointer receiver is visible to the caller whereas this is not the case in value receiver. Let's understand this with the help of a program.

```
package main

import (  
    "fmt"
)

type Employee struct {  
    name string
    age  int
}

/*
Method with value receiver  
*/
func (e Employee) changeName(newName string) {  
    e.name = newName
}

/*
Method with pointer receiver  
*/
func (e *Employee) changeAge(newAge int) {  
    e.age = newAge
}

func main() {  
    e := Employee{
        name: "Mark Andrew",
        age:  50,
    }
    fmt.Printf("Employee name before change: %s", e.name)
    e.changeName("Michael Andrew")
    fmt.Printf("\nEmployee name after change: %s", e.name)

    fmt.Printf("\n\nEmployee age before change: %d", e.age)
    (&e).changeAge(51)
    fmt.Printf("\nEmployee age after change: %d", e.age)
}
```

[Run program in playground](https://play.golang.org/p/tTO100HmUX)

In the program above, the `changeName` method has a value receiver `(e Employee)` whereas the `changeAge` method has a pointer receiver `(e *Employee)`. Changes made to `Employee` struct's `name` field inside `changeName` will not be visible to the caller and hence the program prints the same name before and after the method `e.changeName("Michael Andrew")` is called in line no. 32. Since `changeAge` method has a pointer receiver `(e *Employee)`, changes made to `age` field after the method call `(&e).changeAge(51)` will be visible to the caller. This program prints,

```
Employee name before change: Mark Andrew  
Employee name after change: Mark Andrew

Employee age before change: 50  
Employee age after change: 51  
```

In line no. 36 of the program above, we use `(&e).changeAge(51)` to call the `changeAge` method. Since `changeAge` has a pointer receiver, we have used `(&e)` to call the method. This is not needed and the language gives us the option to just use `e.changeAge(51)`. `e.changeAge(51)` will be interpreted as `(&e).changeAge(51)` by the language.

The following program is rewritten to use `e.changeAge(51)` instead of `(&e).changeAge(51)` and it prints the same output.

```
package main

import (  
    "fmt"
)

type Employee struct {  
    name string
    age  int
}

/*
Method with value receiver  
*/
func (e Employee) changeName(newName string) {  
    e.name = newName
}

/*
Method with pointer receiver  
*/
func (e *Employee) changeAge(newAge int) {  
    e.age = newAge
}

func main() {  
    e := Employee{
        name: "Mark Andrew",
        age:  50,
    }
    fmt.Printf("Employee name before change: %s", e.name)
    e.changeName("Michael Andrew")
    fmt.Printf("\nEmployee name after change: %s", e.name)

    fmt.Printf("\n\nEmployee age before change: %d", e.age)
    e.changeAge(51)
    fmt.Printf("\nEmployee age after change: %d", e.age)
}
```

[Run program in playground](https://play.golang.org/p/nnXBsR3Uc8)

### When to use pointer receiver and when to use value receiver

Generally, pointer receivers can be used when changes made to the receiver inside the method should be visible to the caller.

Pointers receivers can also be used in places where it's expensive to copy a data structure. Consider a struct that has many fields. Using this struct as a value receiver in a method will need the entire struct to be copied which will be expensive. In this case, if a pointer receiver is used, the struct will not be copied and only a pointer to it will be used in the method.

In all other situations, value receivers can be used.

### Methods of anonymous struct fields

Methods belonging to anonymous fields of a struct can be called as if they belong to the structure where the anonymous field is defined.

```
package main

import (  
    "fmt"
)

type address struct {  
    city  string
    state string
}

func (a address) fullAddress() {  
    fmt.Printf("Full address: %s, %s", a.city, a.state)
}

type person struct {  
    firstName string
    lastName  string
    address
}

func main() {  
    p := person{
        firstName: "Elon",
        lastName:  "Musk",
        address: address {
            city:  "Los Angeles",
            state: "California",
        },
    }

    p.fullAddress() //accessing fullAddress method of address struct

}
```

[Run program in playground](https://play.golang.org/p/vURnImw4_9)

In line no. 32 of the program above, we call the `fullAddress()` method of the `address` struct using `p.fullAddress()`. The explicit direction `p.address.fullAddress()` is not needed. This program prints

```
Full address: Los Angeles, California  
```

### Value receivers in methods vs Value arguments in functions

This topic trips most go newbies. I will try to make it as clear as possible 😀.

When a function has a value argument, it will accept only a value argument.

When a method has a value receiver, it will accept both pointer and value receivers.

Let's understand this by means of an example.

```
package main

import (  
    "fmt"
)

type rectangle struct {  
    length int
    width  int
}

func area(r rectangle) {  
    fmt.Printf("Area Function result: %d\n", (r.length * r.width))
}

func (r rectangle) area() {  
    fmt.Printf("Area Method result: %d\n", (r.length * r.width))
}

func main() {  
    r := rectangle{
        length: 10,
        width:  5,
    }
    area(r)
    r.area()

    p := &r
    /*
       compilation error, cannot use p (type *rectangle) as type rectangle 
       in argument to area  
    */
    //area(p)

    p.area()//calling value receiver with a pointer
}
```

[Run program in playground](https://play.golang.org/p/gLyHMd2iie)

function `func area(r rectangle)` in line no.12 accepts a value argument and method `func (r rectangle) area()` in line no. 16 accepts a value receiver.

In line no. 25, we call the area function with a value argument `area(r)` and it will work. Similarly, we call the area method `r.area()` using a value receiver and this will work too.

We create a pointer `p` to `r` in line no. 28. If we try to pass this pointer to the function area which accepts only a value, the compiler will complain. I have commented line no. 33 which does this. If you uncomment this line, then the compiler will throw error **compilation error, cannot use p (type \*rectangle) as type rectangle in argument to area**. This works as expected.

Now comes the tricky part, line no. 35 of the code `p.area()` calls the method `area` which accepts only a value receiver using the pointer receiver `p`. This is perfectly valid. The reason is that the line `p.area()`, for convenience will be interpreted by Go as `(*p).area()` since `area` has a value receiver.

This program will output,

```
Area Function result: 50  
Area Method result: 50  
Area Method result: 50  
```

### Pointer receivers in methods vs Pointer arguments in functions

Similar to value arguments, functions with pointer arguments will accept only pointers whereas methods with pointer receivers will accept both pointer and value receiver.

```
package main

import (  
    "fmt"
)

type rectangle struct {  
    length int
    width  int
}

func perimeter(r *rectangle) {  
    fmt.Println("perimeter function output:", 2*(r.length+r.width))

}

func (r *rectangle) perimeter() {  
    fmt.Println("perimeter method output:", 2*(r.length+r.width))
}

func main() {  
    r := rectangle{
        length: 10,
        width:  5,
    }
    p := &r //pointer to r
    perimeter(p)
    p.perimeter()

    /*
        cannot use r (type rectangle) as type *rectangle in argument to perimeter
    */
    //perimeter(r)

    r.perimeter()//calling pointer receiver with a value

}
```

[Run program in playground](https://play.golang.org/p/Xy5wW9YZMJ)

Line no. 12 of the above program defines a function `perimeter` which accepts a pointer argument and line no. 17 defines a method that has a pointer receiver.

In line no. 27 we call the perimeter function with a pointer argument and in line no.28 we call the perimeter method on a pointer receiver. All is good.

In the commented line no.33, we try to call the perimeter function with a value argument `r`. This is not allowed since a function with a pointer argument will not accept value arguments. If this line is uncommented and the program is run, the compilation will fail with error **main.go:33: cannot use r (type rectangle) as type \*rectangle in argument to perimeter**.

In line no.35 we call the pointer receiver method `perimeter` with a value receiver `r`. This is allowed and the line of code `r.perimeter()` will be interpreted by the language as `(&r).perimeter()` for convenience. This program will output,

```
perimeter function output: 30  
perimeter method output: 30  
perimeter method output: 30  
```

### Methods with non-struct receivers

So far we have defined methods only on struct types. It is also possible to define methods on non-struct types, but there is a catch. **To define a method on a type, the definition of the receiver type and the definition of the method should be present in the same package.** So far, all the structs and the methods on structs we defined were all located in the same `main` package and hence they worked.

```
package main

func (a int) add(b int) {  
}

func main() {

}
```

[Run program in playground](https://play.golang.org/p/ybXLf5o_lA)

In the program above, in line no. 3 we are trying to add a method named `add` on the built-in type `int`. This is not allowed since the definition of the method `add` and the definition of type `int` is not in the same package. This program will throw compilation error **cannot define new methods on non-local type int**

The way to get this working is to create a type alias for the built-in type `int` and then create a method with this type alias as the receiver.

```
package main

import "fmt"

type myInt int

func (a myInt) add(b myInt) myInt {  
    return a + b
}

func main() {  
    num1 := myInt(5)
    num2 := myInt(10)
    sum := num1.add(num2)
    fmt.Println("Sum is", sum)
}
```

[Run program in playground](https://play.golang.org/p/sTe7i1qAng)

In line no.5 of the above program, we have created a type alias `myInt` for `int`. In line no. 7, we have defined a method `add` with `myInt` as the receiver.

This program will print `Sum is 15`.

I have created a program with all the concepts we discussed so far and it's available in [github](https://github.com/golangbot/methods).

That's it for methods in Go. Have a good day.

**Next tutorial - [Interfaces - I](https://golangbot.com/interfaces-part-1/)**