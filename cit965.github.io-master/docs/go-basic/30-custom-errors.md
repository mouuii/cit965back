---
sidebar_label: 30-custom-errors
sidebar_position: 30
title: 30-custom-errors
---
Welcome to tutorial no. 31 in our [Golang tutorial series](https://golangbot.com/learn-golang-series/).

In the [last tutorial](https://golangbot.com/error-handling/) we learnt about error representation in Go and how to handle errors from the standard library. We also learnt how to extract more information from the errors.

This tutorial deals with how to create our own custom errors which we can use in our functions and packages. We will also use the same techniques employed by the standard library to provide more details about our custom errors.

### Creating custom errors using the New function

The simplest way to create a custom error is to use the [New](https://pkg.go.dev/errors#New) function of the [errors](https://pkg.go.dev/errors) package.

Before we use the New [function](https://golangbot.com/functions/) to create a custom error, let's understand how it is implemented. The implementation of the New function in the [errors package](https://go.dev/src/errors/errors.go?s=293:320#L58) is provided below.

```
package errors

// New returns an error that formats as the given text.
// Each call to New returns a distinct error value even if the text is identical.
func New(text string) error {  
        return &errorString{text}
}

// errorString is a trivial implementation of error.
type errorString struct {  
        s string
}

func (e *errorString) Error() string {  
        return e.s
}
```

The implementation is pretty simple. `errorString` is a [struct](https://golangbot.com/structs/) type with a single string field `s`. The `Error() string` [method](https://golangbot.com/methods/) of the `error` interface is implemented using a `errorString` [pointer receiver](https://golangbot.com/methods/#pointerreceiversvsvaluereceivers) in line no. 14.

The `New` function in line no. 5 takes a `string` parameter, creates a value of type `errorString` using that parameter and returns the address of it. Thus a new error is created and returned.

Now that we know how the `New` function works, lets use it in a program of our own to create a custom error.

We will create a simple program which calculates the area of a circle and will return an error if the radius is negative.

```
package main

import (  
    "errors"
    "fmt"
    "math"
)

func circleArea(radius float64) (float64, error) {  
    if radius < 0 {
        return 0, errors.New("Area calculation failed, radius is less than zero")
    }
    return math.Pi * radius * radius, nil
}

func main() {  
    radius := -20.0
    area, err := circleArea(radius)
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Printf("Area of circle %0.2f", area)
}
```

[Run in playground](https://go.dev/play/p/_vuf6fgkqm)

In the program above, we check whether the radius is less than zero in line no. 10. If so we return zero for the area along with the corresponding error message. If the radius is greater than 0, then the area is calculated and `nil` is returned as the error in line no. 13.

In the main function, we check whether the error is not `nil` in line no. 19. If it's not `nil`, we print the error and return, else the area of the circle is printed.

In this program the radius is less than zero and hence it will print,

```
Area calculation failed, radius is less than zero  
```

### Adding more information to the error using Errorf

The above program works well but wouldn't it be nice if we print the actual radius which caused the error. This is where the [Errorf](https://pkg.go.dev/fmt#Errorf) function of the [fmt](https://pkg.go.dev/fmt) package comes in handy. This function formats the error according to a format specifier and returns a [string](https://golangbot.com/strings/) as value that satisfies the `error` interface.

Let's use the `Errorf` function and make the program better.

```
package main

import (  
    "fmt"
    "math"
)

func circleArea(radius float64) (float64, error) {  
    if radius < 0 {
        return 0, fmt.Errorf("Area calculation failed, radius %0.2f is less than zero", radius)
    }
    return math.Pi * radius * radius, nil
}

func main() {  
    radius := -20.0
    area, err := circleArea(radius)
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Printf("Area of circle %0.2f", area)
}
```

[Run in playground](https://go.dev/play/p/HQ7bvjT4o2)

  

In the program above, the `Errorf` is used in line no. 10 to print the actual radius which caused the error. Running this program will output,

```
Area calculation failed, radius -20.00 is less than zero  
```

### Providing more information about the error using struct type and fields

It is also possible to use struct types which implement the error [interface](https://golangbot.com/interfaces-part-1/) as errors. This gives us more flexibility with error handling. In our previous example, if we want to access the radius which caused the error, the only way now is to parse the error description `Area calculation failed, radius -20.00 is less than zero`. This is not a proper way to do this since if the description changes, our code will break.

We will use the strategy followed by the standard library explained in the previous tutorial under the section "[Converting the error to the underlying type and retrieving more information from the struct fields](https://golangbot.com/error-handling/#1convertingtheerrortotheunderlyingtypeandretrievingmoreinformationfromthestructfields)" and use struct fields to provide access to the radius which caused the error. We will create a struct type that implements the error interface and use its fields to provide more information about the error.

The first step would be create a struct type to represent the error. The naming convention for error types is that the name should end with the text `Error`. So let's name our struct type as `areaError`

```
type areaError struct {  
    err    string
    radius float64
}
```

The above struct type has a field `radius` which stores the value of the radius responsible for the error and `err` field stores the actual error message.

The next step is to implement the error interface.

```
func (e *areaError) Error() string {  
    return fmt.Sprintf("radius %0.2f: %s", e.radius, e.err)
}
```

In the above snippet, we implement the `Error() string` method of the error interface using a pointer receiver `*areaError`. This method prints the radius and the error description.

Let's complete the program by writing the `main` function and `circleArea` function.

```
package main

import (  
    "errors"
    "fmt"
    "math"
)

type areaError struct {  
    err    string
    radius float64
}

func (e *areaError) Error() string {  
    return fmt.Sprintf("radius %0.2f: %s", e.radius, e.err)
}

func circleArea(radius float64) (float64, error) {  
    if radius < 0 {
        return 0, &areaError{
            err:    "radius is negative",
            radius: radius,
        }
    }
    return math.Pi * radius * radius, nil
}

func main() {  
    radius := -20.0
    area, err := circleArea(radius)
    if err != nil {
        var areaError *areaError
        if errors.As(err, &areaError) {
            fmt.Printf("Area calculation failed, radius %0.2f is less than zero", areaError.radius)
            return
        }
        fmt.Println(err)
        return
    }
    fmt.Printf("Area of rectangle %0.2f", area)
}
```

[Run in playground](https://go.dev/play/p/X4GvrehVTGA)

In the program above, `circleArea` in line no. 18 is used to calculate the area of the circle. This function first checks if the radius is less than zero, if so it creates a value of type `areaError` using the radius responsible for the error and the corresponding error message and then returns the address of it in line no. 20 along with `0` as area. **Thus we have provided more information about the error, in this case the radius which caused the error using the fields of a custom error struct.**

If the radius is not negative, this function calculates and returns the area along with a `nil` error in line no. 25.

In line no. 30 of the main function, we are trying to find the area of a circle with radius -20. Since the radius is less than zero, an error will be returned.

We check whether the error is not `nil` in line no. 31 and in line no. 33 line we try to convert it to type `*areaError`. **If the error is of type `*areaError`, we get the radius which caused the error in line no. 34 using `areaError.radius`, print a custom error message and return from the program.**

If the error is not of type `*areaError`, we simply print the error in line no. 37 and return. If there is no error, the area will be printed in line no.40.

The program will print,

```
Area calculation failed, radius -20.00 is less than zero  
```

Now lets use the [second strategy](https://golangbot.com/error-handling/#2retrievingmoreinformationusingmethods) described in the previous tutorial and use methods on custom error types to provide more information about the error.

  

  

### Providing more information about the error using methods on struct types

In this section we will write a program which calculates the area of a rectangle. This program will print an error if either the length or width is less than zero.

The first step would be create a struct to represent the error.

```
type areaError struct {  
    err    string //error description
    length float64 //length which caused the error
    width  float64 //width which caused the error
}
```

The above error struct type contains an error description field along with the length and width which caused the error.

Now that we have the error type, lets implement the error interface and add a couple of methods on the error type to provide more information about the error.

```
func (e *areaError) Error() string {  
    return e.err
}

func (e *areaError) lengthNegative() bool {  
    return e.length < 0
}

func (e *areaError) widthNegative() bool {  
    return e.width < 0
}
```

In the above snippet, we return the description of the error from the `Error() string` method. The `lengthNegative() bool` method returns true when the length is less than zero and `widthNegative() bool` method returns true when the width is less than zero. **These two methods provide more information about the error, in this case they say whether the area calculation failed because of the length being negative or width being negative. Thus we have used methods on struct error types to provide more information about the error.**

The next step is to write the area calculation function.

```
func rectArea(length, width float64) (float64, error) {  
    err := ""
    if length < 0 {
        err += "length is less than zero"
    }
    if width < 0 {
        if err == "" {
            err = "width is less than zero"
        } else {
            err += ", width is less than zero"
        }
    }
    if err != "" {
        return 0, &areaError{
            err:    err,
            length: length,
            width:  width,
        }
    }
    return length * width, nil
}
```

The `rectArea` function above checks if either the length or width is less than zero, if so it returns an error of type `*areaError`, else it returns the area of the rectangle with `nil` as error.

Let's finish this program by creating the main function.

```
func main() {  
    length, width := -5.0, -9.0
    area, err := rectArea(length, width)
    if err != nil {
        var areaError *areaError
        if errors.As(err, &areaError) {
            if areaError.lengthNegative() {
                fmt.Printf("error: length %0.2f is less than zero\n", areaError.length)

            }
            if areaError.widthNegative() {
                fmt.Printf("error: width %0.2f is less than zero\n", areaError.width)

            }
            return
        }
        fmt.Println(err)
        return
    }
    fmt.Println("area of rect", area)
}
```

In the main function, we check whether the error is not `nil` in line no. 4. If it is not nil, we try to convert it to type `*areaError`. Then using the `lengthNegative()` and `widthNegative()` methods, we check whether the error is because of the fact that the length is negative or width is negative. We print the corresponding error message and return from the program. _Thus we have used the methods on the error struct type to provide more information about the error._

If there is no error, the area of the rectangle will be printed.

Here is the full program for your reference.

```
package main

import (  
    "errors"
    "fmt"
)

type areaError struct {  
    err    string  //error description
    length float64 //length which caused the error
    width  float64 //width which caused the error
}

func (e *areaError) Error() string {  
    return e.err
}

func (e *areaError) lengthNegative() bool {  
    return e.length < 0
}

func (e *areaError) widthNegative() bool {  
    return e.width < 0
}

func rectArea(length, width float64) (float64, error) {  
    err := ""
    if length < 0 {
        err += "length is less than zero"
    }
    if width < 0 {
        if err == "" {
            err = "width is less than zero"
        } else {
            err += ", width is less than zero"
        }
    }
    if err != "" {
        return 0, &areaError{
            err:    err,
            length: length,
            width:  width,
        }
    }
    return length * width, nil
}

func main() {  
    length, width := -5.0, -9.0
    area, err := rectArea(length, width)
    if err != nil {
        var areaError *areaError
        if errors.As(err, &areaError) {
            if areaError.lengthNegative() {
                fmt.Printf("error: length %0.2f is less than zero\n", areaError.length)

            }
            if areaError.widthNegative() {
                fmt.Printf("error: width %0.2f is less than zero\n", areaError.width)

            }
            return
        }
        fmt.Println(err)
        return
    }
    fmt.Println("area of rect", area)
}
```

[Run in playground](https://go.dev/play/p/9xxF9fVw1fe)

This program will print the output,

```
error: length -5.00 is less than zero  
error: width -9.00 is less than zero  
```

We have seen examples for two of the three ways described in the [error handling](https://golangbot.com/error-handling/) tutorial to provide more information about the errors.

The third way using [direct comparison](https://golangbot.com/error-handling/#3directcomparison) is pretty straightforward. I would leave it as an exercise for you to figure out how to use this strategy to provide more information about our custom errors.

This brings us to an end of this tutorial.

Here is a quick recap of what we learnt in this tutorial,

-   Creating custom errors using the New function
-   Adding more information to the error using Errorf
-   Providing more information about the error using struct type and fields
-   Providing more information about the error using methods on struct types

Have a good day.

**Next tutorial - [Panic and Recover](https://golangbot.com/panic-and-recover/)**