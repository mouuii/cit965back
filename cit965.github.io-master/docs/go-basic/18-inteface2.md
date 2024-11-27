---
sidebar_label: 18-interface2
sidebar_position: 18
title: 18-interface2
---
Welcome to tutorial no. 19 in [Golang tutorial series](https://golangbot.com/learn-golang-series/). This is the second part in our 2 part interface tutorial. In case you missed the first part, you can read it from here [https://golangbot.com/interfaces-part-1/](https://golangbot.com/interfaces-part-1/)

### Implementing interfaces using pointer receivers vs value receivers

All the example interfaces we discussed in [part 1](https://golangbot.com/interfaces-part-1/) were implemented using value receivers. It is also possible to implement interfaces using pointer receivers. There is a subtlety to be noted while implementing interfaces using pointer receivers. Lets understand that using the following program.

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

func (p Person) Describe() { //implemented using value receiver  
    fmt.Printf("%s is %d years old\n", p.name, p.age)
}

type Address struct {  
    state   string
    country string
}

func (a *Address) Describe() { //implemented using pointer receiver  
    fmt.Printf("State %s Country %s", a.state, a.country)
}

func main() {  
    var d1 Describer
    p1 := Person{"Sam", 25}
    d1 = p1
    d1.Describe()
    p2 := Person{"James", 32}
    d1 = &p2
    d1.Describe()

    var d2 Describer
    a := Address{"Washington", "USA"}

    /* compilation error if the following line is
       uncommented
       cannot use a (type Address) as type Describer
       in assignment: Address does not implement
       Describer (Describe method has pointer
       receiver)
    */
    //d2 = a

    d2 = &a //This works since Describer interface
    //is implemented by Address pointer in line 22
    d2.Describe()

}
```

[Run in playground](https://play.golang.org/p/IzspYiAQ82)

In the program above, the `Person` struct implements the `Describer` interface using value receiver in line no. 13.

As we have already learnt during our discussion about [methods](https://golangbot.com/methods#valuereceiversinmethodsvsvalueargumentsinfunctions), methods with value receivers accept both pointer and value receivers. _It is legal to call a value method on anything which is a value or whose value can be dereferenced._

_p1_ is a value of type `Person` and it is assigned to `d1` in line no. 29. `Person` implements the `Describer` interface and hence line no. 30 will print `Sam is 25 years old`.

Similarly `d1` is assigned to `&p2` in line no. 32 and hence line no. 33 will print `James is 32 years old`. Awesome :).

The `Address` struct implements the `Describer` interface using pointer receiver in line no. 22.

If line. no 45 of the program above is uncommented, we will get the compilation error **main.go:42: cannot use a (type Address) as type Describer in assignment: Address does not implement Describer (Describe method has pointer receiver)**. This is because, the `Describer` interface is implemented using a Address Pointer receiver in line 22 and we are trying to assign `a` which is a value type and it has not implemented the `Describer` interface. This will definitely surprise you since we learnt earlier that [methods](https://golangbot.com/methods/#pointerreceiversinmethodsvspointerargumentsinfunctions) with pointer receivers will accept both pointer and value receivers. Then why isn't the code in line no. 45 working.

**The reason is that it is legal to call a pointer-valued method on anything that is already a pointer or whose address can be taken. The concrete value stored in an interface is not addressable and hence it is not possible for the compiler to automatically take the address of `a` in line no. 45 and hence this code fails.**

Line no. 47 works because we are assigning the address of a `&a` to `d2`.

The rest of the program is self explanatory. This program will print,

```
Sam is 25 years old  
James is 32 years old  
State Washington Country USA  
```

### Implementing multiple interfaces

A type can implement more than one interface. Lets see how this is done in the following program.

```
package main

import (  
    "fmt"
)

type SalaryCalculator interface {  
    DisplaySalary()
}

type LeaveCalculator interface {  
    CalculateLeavesLeft() int
}

type Employee struct {  
    firstName string
    lastName string
    basicPay int
    pf int
    totalLeaves int
    leavesTaken int
}

func (e Employee) DisplaySalary() {  
    fmt.Printf("%s %s has salary $%d", e.firstName, e.lastName, (e.basicPay + e.pf))
}

func (e Employee) CalculateLeavesLeft() int {  
    return e.totalLeaves - e.leavesTaken
}

func main() {  
    e := Employee {
        firstName: "Naveen",
        lastName: "Ramanathan",
        basicPay: 5000,
        pf: 200,
        totalLeaves: 30,
        leavesTaken: 5,
    }
    var s SalaryCalculator = e
    s.DisplaySalary()
    var l LeaveCalculator = e
    fmt.Println("\nLeaves left =", l.CalculateLeavesLeft())
}
```

[Run in playground](https://play.golang.org/p/DJxS5zxBcV)

The program above has two interfaces `SalaryCalculator` and `LeaveCalculator` declared in lines 7 and 11 respectively.

The `Employee` struct defined in line no. 15 provides implementations for the `DisplaySalary` method of `SalaryCalculator` interface in line no. 24 and the `CalculateLeavesLeft` method of `LeaveCalculator` interface interface in line no. 28. Now `Employee` implements both `SalaryCalculator` and `LeaveCalculator` interfaces.

In line no. 41 we assign `e` to a variable of type `SalaryCalculator` interface and in line no. 43 we assign the same variable `e` to a variable of type `LeaveCalculator`. This is possible since `e` which of type `Employee` implements both `SalaryCalculator` and `LeaveCalculator` interfaces.

This program outputs,

```
Naveen Ramanathan has salary $5200  
Leaves left = 25  
```

### Embedding interfaces

Although go does not offer inheritance, it is possible to create a new interfaces by embedding other interfaces.

Lets see how this is done.

```
package main

import (  
    "fmt"
)

type SalaryCalculator interface {  
    DisplaySalary()
}

type LeaveCalculator interface {  
    CalculateLeavesLeft() int
}

type EmployeeOperations interface {  
    SalaryCalculator
    LeaveCalculator
}

type Employee struct {  
    firstName string
    lastName string
    basicPay int
    pf int
    totalLeaves int
    leavesTaken int
}

func (e Employee) DisplaySalary() {  
    fmt.Printf("%s %s has salary $%d", e.firstName, e.lastName, (e.basicPay + e.pf))
}

func (e Employee) CalculateLeavesLeft() int {  
    return e.totalLeaves - e.leavesTaken
}

func main() {  
    e := Employee {
        firstName: "Naveen",
        lastName: "Ramanathan",
        basicPay: 5000,
        pf: 200,
        totalLeaves: 30,
        leavesTaken: 5,
    }
    var empOp EmployeeOperations = e
    empOp.DisplaySalary()
    fmt.Println("\nLeaves left =", empOp.CalculateLeavesLeft())
}
```

[Run in playground](https://play.golang.org/p/Hia7D-WbZp)

_EmployeeOperations_ interface in line 15 of the program above is created by embedding _SalaryCalculator_ and _LeaveCalculator_ interfaces.

Any type is said to implement `EmployeeOperations` interface if it provides method definitions for the methods present in both _SalaryCalculator_ and _LeaveCalculator_ interfaces.

The `Employee` struct implements `EmployeeOperations` interface since it provides definition for both `DisplaySalary` and `CalculateLeavesLeft` methods in lines 29 and 33 respectively.

In line 46, `e` of type `Employee` is assigned to `empOp` of type `EmployeeOperations`. In the next two lines, the `DisplaySalary()` and `CalculateLeavesLeft()` methods are called on `empOp`.

This program will output

```
Naveen Ramanathan has salary $5200  
Leaves left = 25  
```

### Zero value of Interface

The zero value of a interface is nil. A nil interface has both its underlying value and as well as concrete type as nil.

```
package main

import "fmt"

type Describer interface {  
    Describe()
}

func main() {  
    var d1 Describer
    if d1 == nil {
        fmt.Printf("d1 is nil and has type %T value %v\n", d1, d1)
    }
}
```

[Run in playground](https://play.golang.org/p/vwYHC6Y78H)

_d1_ in the above program is `nil` and this program will output

```
d1 is nil and has type <nil> value <nil>  
```

If we try to call a method on the `nil` interface, the program will panic since the `nil` interface neither has a underlying value nor a concrete type.

```
package main

type Describer interface {  
    Describe()
}

func main() {  
    var d1 Describer
    d1.Describe()
}
```

[Run in playground](https://play.golang.org/p/rM-rY0uGTI)

Since `d1` in the program above is `nil`, this program will panic with runtime error **panic: runtime error: invalid memory address or nil pointer dereference  
\[signal SIGSEGV: segmentation violation code=0xffffffff addr=0x0 pc=0xc8527\]"**

Thats it for interfaces. Have a good day.

**Next tutorial - [Introduction to Concurrency](https://golangbot.com/concurrency/)**