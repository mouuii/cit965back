---
sidebar_label: 29-error-handling
sidebar_position: 29
title: 29-error-handling
---
Welcome to tutorial no. 30 in [Golang tutorial series](https://golangbot.com/learn-golang-series/).

### What are errors?

Errors indicate any abnormal condition occurring in the program. Let's say we are trying to open a file and the file does not exist in the file system. This is an abnormal condition and it's represented as an error.

Errors in Go are plain old values. Just like any other built-in [type](https://golangbot.com/types/) such as int, float64, ... error values can be stored in [variables](https://golangbot.com/variables/), passed as parameters to functions, returned from [functions](https://golangbot.com/functions/), and so on.

Errors are represented using the built-in `error` type. We will learn more about the `error` type later in this tutorial.

### Example

Let's start right away with an example program that tries to open a file that does not exist.

```
package main

import (  
    "fmt"
    "os"
)

func main() {  
    f, err := os.Open("/test.txt")
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println(f.Name(), "opened successfully")
}
```

[Run in playground](https://go.dev/play/p/yOhAviFM05)

In line no. 9 of the program above, we are trying to open the file at path `/test.txt`(which will obviously not exist in the playground). The _[Open](https://pkg.go.dev/os#Open)_ function of the `os` package has the following signature,

**func Open(name string) (\*File, error)**

If the file has been opened successfully, then the Open function will return the file handler and error will be nil. If there is an error while opening the file, a non-nil error will be returned.

If a [function](https://golangbot.com/functions/) or [method](https://golangbot.com/methods/) returns an error, then by convention it has to be the last value returned from the function. Hence the `Open` function returns `error` as the last value.

**The idiomatic way of handling errors in Go is to compare the returned error to `nil`. A nil value indicates that no error has occurred and a non-nil value indicates the presence of an error.** In our case, we check whether the error is not `nil` in line no. 10. If it is not `nil`, we simply print the error and return from the main function.

Running this program will print

```
open /test.txt: No such file or directory  
```

Perfect 😃. We get an error stating that the file does not exist.

### Error type representation

Let's dig a little deeper and see how the built in `error` type is defined. _error_ is an [interface](https://golangbot.com/interfaces-part-1/) type with the following definition,

```
type error interface {  
    Error() string
}
```

It contains a single method with the signature `Error() string`. Any type which implements this interface can be used as an error. This method provides the description of the error.

When printing the error, `fmt.Println` function calls the `Error() string` method internally to get the description of the error. This is how the error description was printed in line no. 11 of the above [sample program](https://golangbot.com/error-handling/#example).

  

Now that we know `error` is an interface type, let's see how we can extract more information about an error.

In the [example](https://golangbot.com/error-handling/#example) we saw above, we have just printed the description of the error. What if we wanted the actual path of the file which caused the error. One possible way to get this is to parse the error string. This was the output of our program,

```
open /test.txt: No such file or directory  
```

_We can parse this error message and get the file path "/test.txt" of the file which caused the error, but this is a dirty way of doing it. The error description can change at any time in newer versions of Go and our code will break._

Is there a better way to get the file name 🤔? The answer is yes, it can be done and the Go standard library uses different ways to provide more information about errors. Let's look at them one by one.

#### 1\. Converting the error to the underlying type and retrieving more information from the struct fields

If you read the documentation of the [Open](https://pkg.go.dev/os#Open) function carefully, you can see that it returns an error of type `*PathError.` [PathError](https://pkg.go.dev/os#PathError) is a [struct](https://golangbot.com/structs/) type and its implementation in the standard library is as follows,

```
type PathError struct {  
    Op   string
    Path string
    Err  error
}

func (e *PathError) Error() string { return e.Op + " " + e.Path + ": " + e.Err.Error() }  
```

In case you are interested to know where the above source code exists, it can be found here [https://cs.opensource.google/go/go/+/refs/tags/go1.19:src/io/fs/fs.go;l=250](https://cs.opensource.google/go/go/+/refs/tags/go1.19:src/io/fs/fs.go;l=250)

From the above code, you can understand that `*PathError` implements the `error interface` by declaring the `Error() string` method. This method concatenates the operation, path, and the actual error and returns it. Thus we got the error message,

```
open /test.txt: No such file or directory  
```

The `Path` field of `PathError` struct contains the path of the file which caused the error.

We can use the [As](https://pkg.go.dev/errors#As) function from errors package to convert the error to its underlying type. The `As` function's description talks about error chain. Please ignore it for now. We will understand how error chain and wrapping works in a [separate tutorial](https://golangbot.com/error-wrapping/).  
A simple description of `As` is that it tries to convert the error to a error type and returns either true or false indicating whether the conversion is successful or not.

A program will make things clear. Let's modify the program we wrote above and print the path using the `As` function.

```
package main

import (  
    "errors"
    "fmt"
    "os"
)

func main() {  
    f, err := os.Open("test.txt")
    if err != nil {
        var pErr *os.PathError
        if errors.As(err, &pErr) {
            fmt.Println("Failed to open file at path", pErr.Path)
            return
        }
        fmt.Println("Generic error", err)
        return
    }
    fmt.Println(f.Name(), "opened successfully")
}
```

[Run in Playground](https://go.dev/play/p/znhBV-QC7Nk)

In the above program, we first check whether the error is not `nil` in line no. 11 and then we use the `As` function in line no. 13 to convert `err` to `*os.PathError`. If the conversion is successful, `As` will return `true`. Then we print the path using `pErr.Path` in line no. 14.

If you are wondering why `pErr` is a pointer, the reason is, the error interface is implemented by the pointer of `PathError` and hence `pErr` is a pointer. The below code shows that `*PathError` implements the error interface.

```
func (e *PathError) Error() string { return e.Op + " " + e.Path + ": " + e.Err.Error() }  
```

The `As` function requires the second argument to be a pointer to the type that implements the error. Hence we pass `&perr`.

This program outputs,

```
Failed to open file at path test.txt  
```

In case the underlying error is not of type `*os.PathError`, the control will reach line no. 17 and a generic error message will be printed.

Great 😃. We have successfully used the `As` function to get the file path from the error.

#### 2\. Retrieving more information using methods

The second way to get more information from the error is to find out the underlying type and get more information by calling [methods](https://golangbot.com/methods/) on the [struct](https://golangbot.com/structs) type.

Let's understand this better by means of an example.

The _[DNSError](https://golang.org/pkg/net/#DNSError)_ struct type in the standard library is defined as follows,

```
type DNSError struct {  
    ...
}

func (e *DNSError) Error() string {  
    ...
}
func (e *DNSError) Timeout() bool {  
    ... 
}
func (e *DNSError) Temporary() bool {  
    ... 
}
```

The `DNSError` struct has two methods `Timeout() bool` and `Temporary() bool` which return a boolean value that indicates whether the error is because of a timeout or is it a temporary one.

Let's write a program that converts the error to `*DNSError` type and calls the above mentioned methods to determine whether the error is temporary or due to timeout.

```
package main

import (  
    "errors"
    "fmt"
    "net"
)

func main() {  
    addr, err := net.LookupHost("golangbot123.com")
    if err != nil {
        var dnsErr *net.DNSError
        if errors.As(err, &dnsErr) {
            if dnsErr.Timeout() {
                fmt.Println("operation timed out")
                return
            }
            if dnsErr.Temporary() {
                fmt.Println("temporary error")
                return
            }
            fmt.Println("Generic DNS error", err)
            return
        }
        fmt.Println("Generic error", err)
        return
    }
    fmt.Println(addr)
}
```

_Note: DNS lookups do not work in the playground. Please run this program in your local machine._

In the program above, in line no. 9, we are trying to get the IP address of an invalid domain name `golangbot123.com`. In line no. 13 we get the underlying value of the error by using the `As` function and converting it to `*net.DNSError`. Then we check whether the error is due to timeout or is temporary in line nos. 14 and 18 respectively.

In our case, the error is neither _temporary_ nor due to _timeout_ and hence the program will print,

```
Generic DNS error lookup golangbot123.com: no such host  
```

If the error was temporary or due to a timeout, then the corresponding if statement would have executed and we can handle it appropriately.

#### 3\. Direct comparison

The third way to get more details about an error is the direct comparison with a variable of type `error`. Let's understand this by means of an example.

The [Glob](https://golang.org/pkg/path/filepath/#Glob) function of the `filepath` package is used to return the names of all files that matches a pattern. This function returns an error `ErrBadPattern` when the pattern is malformed.

_ErrBadPattern_ is defined in the `filepath` package as a global variable.

```
var ErrBadPattern = errors.New("syntax error in pattern")  
```

errors.New() is used to create a new error. We will discuss this in detail in the [next tutorial](https://golangbot.com/custom-errors/).

_ErrBadPattern_ is returned by the Glob function when the pattern is malformed.

Let's write a small program to check for this error.

```
package main

import (  
    "errors"
    "fmt"
    "path/filepath"
)

func main() {  
    files, err := filepath.Glob("[")
    if err != nil {
        if errors.Is(err, filepath.ErrBadPattern) {
            fmt.Println("Bad pattern error:", err)
            return
        }
        fmt.Println("Generic error:", err)
        return
    }
    fmt.Println("matched files", files)
}
```

[Run in playground](https://go.dev/play/p/_JLFsjIPBuw)

In the program above we search for files of pattern `[` which is a malformed pattern. We check whether the error is not nil. To get more information about the error, we directly compare it to `filepath.ErrBadPattern` in line. no 11 using the [Is](https://pkg.go.dev/errors#Is) function. Similar to `As`, the `Is` function works on an error chain. We will learn more about this in our [next tutorial](https://golangbot.com/custom-errors/).  
For the purposes of this tutorial, the `Is` function can be thought of as returning `true` if both the errors passed to it are the same.

The `Is` returns true in line no. 12 since the error is due to a malformed pattern. This program will print,

```
Bad pattern error: syntax error in pattern  
```

The standard library uses any of the above-mentioned ways to provide more information about an error. We will use these ways in the next tutorial to create our own [custom errors](https://golangbot.com/custom-errors/).

  

  

### Do not ignore errors

Never ever ignore an error. Ignoring errors is inviting for trouble. Let me rewrite the [example](https://go.dev/play/p/_JLFsjIPBuw) which lists the name of all files that match a pattern ignoring errors.

```
package main

import (  
    "fmt"
    "path/filepath"
)

func main() {  
    files, _ := filepath.Glob("[")
    fmt.Println("matched files", files)
}
```

[Run in playground](https://play.golang.org/p/2k8r_Qg_lc)

We already know from the [previous example](https://play.golang.org/p/KqhxmlLVFT6) that the pattern is invalid. I have ignored the error returned by the `Glob` function by using the `_` blank identifier in line no. 9. I simply print the matched files in line no. 10. This program will print,

```
matched files []  
```

Since we ignored the error, the output seems as if no files have matched the pattern but actually the pattern itself is malformed. So never ignore errors.

This brings us to the end of this tutorial.

In this tutorial, we discussed how to handle errors that occur in our program and also how to inspect the errors to get more information from them. A quick recap of what we discussed in this tutorial,

-   What are errors?
-   Error representation
-   Various ways of extracting more information from errors
-   Do not ignore errors

In the [next tutorial](https://golangbot.com/custom-errors/), we will create our own custom errors and also add more context to our custom errors.

Thanks for reading. Please leave your comments and feedback.

**Next tutorial - [Custom Errors](https://golangbot.com/custom-errors/)**