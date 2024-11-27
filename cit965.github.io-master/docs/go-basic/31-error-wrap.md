---
sidebar_label: 31-error-wrap
sidebar_position: 31
title: 31-error-wrap
---
Welcome to tutorial no. 32 in our [Golang tutorial series](https://golangbot.com/learn-golang-series/).

In this tutorial we will learn about error wrapping in Go and why do we even need error wrapping. Let's get started.

### What is error wrapping?

Error wrapping is the process of encapsulating one error into another. Let's say we have a web server which accesses a database and tries to fetch a record from the DB. If the database call returns an error, we can decide whether to wrap this error or send our own custom error from the webservice. Let's write a small program to understand this.

```
package main

import (  
    "errors"
    "fmt"
)

var noRows = errors.New("no rows found")

func getRecord() error {  
    return noRows
}

func webService() error {  
    if err := getRecord(); err != nil {
        return fmt.Errorf("Error %s when calling DB", err)
    }
    return nil
}

func main() {  
    if err := webService(); err != nil {
        fmt.Printf("Error: %s when calling webservice\n", err)
        return
    }
    fmt.Println("webservice call successful")

}
```

[Run in playground](https://go.dev/play/p/0kVGzdt47GW)

In the above program, in line no. 16, we send the string description of the error that occurs when making the `getRecord` function call. While this may actually seem like error wrapping, it is not :). Let's understand how to wrap errors in the next section.

### Error wrapping and the Is function

The [Is](https://pkg.go.dev/errors#Is) function in the [errors](https://pkg.go.dev/errors) package reports whether any of the errors in the chain matches the target. In our case, we return `noRows` error from the `getRecord` function in line no. 11. The string format of this error is returned from the `webService` function in line no. 16. Let's modify the `main` function of this program and use the `Is` function to check whether any error in the chain matches the `noRows` error.

```
func main() {  
    if err := webService(); err != nil {
        if errors.Is(err, noRows) {
            fmt.Printf("The searched record cannot be found. Error returned from DB is %s", err)
            return
        }
        fmt.Println("unknown error when searching record")
        return

    }
    fmt.Println("webservice call successful")

}
```

In the above main function, in line no. 3, the `Is` function will check whether any error in the error chain that `err` holds  
contains a `noRows` error. The code in it's current state won't work and the `if` condition in line no. 3 of the above main function will fail. To make it work, we need to wrap the `noRows` error when it is returned from the `webService` function. One way to do this is to use the `%w` format specifier when returning the error instead of `%s`. So if we modify the line returning the error to

```
        return fmt.Errorf("Error %w when calling DB", err)
```

it means that the newly returned error wraps the original `noRows` and the `if` condition in line no. 3 of the above main function will succeed. The complete program with the error wrapping is provided below.

```
package main

import (  
    "errors"
    "fmt"
)

var noRows = errors.New("no rows found")

func getRecord() error {  
    return noRows
}

func webService() error {  
    if err := getRecord(); err != nil {
        return fmt.Errorf("Error %w when calling DB", err)
    }
    return nil
}

func main() {  
    if err := webService(); err != nil {
        if errors.Is(err, noRows) {
            fmt.Printf("The searched record cannot be found. Error returned from DB is %s", err)
            return
        }
        fmt.Println("unknown error when searching record")
        return

    }
    fmt.Println("webservice call successful")

}
```

[Run in playground](https://go.dev/play/p/t0h3WtJ5fu5)

When this program is run, it will print.

```
The searched record cannot be found. Error returned from DB is Error no rows found when calling DB  
```

### As function

The [As](https://pkg.go.dev/errors#As) in the errors package will try to convert the error that is passed as input to the target error type. It will succeed if any of the error in the error chain matches the target. If it's successful it will return true, and it will set the target to the first error in the error chain that matches. A program will make things easier to understand :)

```
package main

import (  
    "errors"
    "fmt"
)

type DBError struct {  
    desc string
}

func (dbError DBError) Error() string {  
    return dbError.desc
}

func getRecord() error {  
    return DBError{
        desc: "no rows found",
    }
}

func webService() error {  
    if err := getRecord(); err != nil {
        return fmt.Errorf("Error %w when calling DB", err)
    }
    return nil
}

func main() {  
    if err := webService(); err != nil {
        var dbError DBError
        if errors.As(err, &dbError) {
            fmt.Printf("The searched record cannot be found. Error returned from DB is %s", dbError)
            return
        }
        fmt.Println("unknown error when searching record")
        return

    }
    fmt.Println("webservice call successful")

}
```

[Run in playground](https://go.dev/play/p/I268pAa4NyR)

In the above program, we have modified the `getRecord` function in line no. 16 to return a [custom error](https://golangbot.com/custom-errors/) of type `DBError`.

In line no. 32 in the main function, we try to convert the error returned from the `webService()` function call to the type `DBError`. The `if` statement in line no. 32 will succeed since we have wrapped the `DBError` when returning error from the `webService()` function in line no. 24. Running this program will print

```
The searched record cannot be found. Error returned from DB is no rows found  
```

### Should we wrap errors?

The answer to this question is, it depends. If we wrap the error, we are exposing it to callers of our library/function. We generally do not want to wrap errors which contain the internal implementation details of a function. One more important thing to remember is, if we return a wrapped error and later decide to remove the error wrapping, the code which uses our library will start failing. So wrapped errors should be considered as part of the API and appropriate version changes should be done if we decide to modify the error that we return.

I hope you like this tutorial. Have a great day :)