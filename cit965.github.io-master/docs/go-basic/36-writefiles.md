---
sidebar_label: 36-writefiles
sidebar_position: 36
title: 36-writefiles
---
![](https://golangbot.com/content/images/2018/12/golang-write-files.png)

Welcome to tutorial no. 37 in [Golang tutorial series](https://golangbot.com/learn-golang-series/).

In this tutorial, we will learn how to write data to files using Go. We will also learn how to write to a file concurrently.

This tutorial has the following sections

-   Writing string to a file
-   Writing bytes to a file
-   Writing data to a file line by line
-   Appending to a file
-   Writing to a file concurrently

Please run all the programs of this tutorial in your local system as playground doesn't support file operations.

### Writing string to a file

One of the most common file writing operations is writing a string to a file. This is quite simple to do. It consists of the following steps.

1.  Create the file
2.  Write the string to the file

Let's get to the code right away.

```
package main

import (  
    "fmt"
    "os"
)

func main() {  
    f, err := os.Create("test.txt")
    if err != nil {
        fmt.Println(err)
        return
    }
    l, err := f.WriteString("Hello World")
    if err != nil {
        fmt.Println(err)
        f.Close()
        return
    }
    fmt.Println(l, "bytes written successfully")
    err = f.Close()
    if err != nil {
        fmt.Println(err)
        return
    }
}
```

The `create` function in line no. 9 of the program above creates a file named _test.txt_. If a file with that name already exists, then the create function truncates the file. This function returns a [File descriptor](https://golang.org/pkg/os/#File).

In line no 14, we write the string **Hello World** to the file using the `WriteString` method. This method returns the number of bytes written and error if any.

Finally, we close the file in line no. 21.

The above program will print

```
11 bytes written successfully  
```

You can find a file named **test.txt** created in the directory from which this program was executed. If you open the file using any text editor, you can find that it contains the text **Hello World**.

### Writing bytes to a file

Writing bytes to a file is quite similar to writing a string to a file. We will use the [Write](https://golang.org/pkg/os/#File.Write) method to write bytes to a file. The following program writes a slice of bytes to a file.

```
package main

import (  
    "fmt"
    "os"
)

func main() {  
    f, err := os.Create("/home/naveen/bytes")
    if err != nil {
        fmt.Println(err)
        return
    }
    d2 := []byte{104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100}
    n2, err := f.Write(d2)
    if err != nil {
        fmt.Println(err)
        f.Close()
        return
    }
    fmt.Println(n2, "bytes written successfully")
    err = f.Close()
    if err != nil {
        fmt.Println(err)
        return
    }
}
```

In the program above, in line no. 15 we use the **Write** method to write a slice of bytes to a file named `bytes` in the directory `/home/naveen`. You can change this directory to a different one. The remaining program is self-explanatory. This program will print `11 bytes written successfully` and it will create a file named `bytes`. Open the file and you can see that it contains the text `hello bytes`

Another common file operation is the need to write strings to a file line by line. In this section, we will write a program to create a file with the following content.

```
Welcome to the world of Go.  
Go is a compiled language.  
It is easy to learn Go.  
```

Let's get to the code right away.

```
package main

import (  
    "fmt"
    "os"
)

func main() {  
    f, err := os.Create("lines")
    if err != nil {
        fmt.Println(err)
                f.Close()
        return
    }
    d := []string{"Welcome to the world of Go1.", "Go is a compiled language.", "It is easy to learn Go."}

    for _, v := range d {
        fmt.Fprintln(f, v)
        if err != nil {
            fmt.Println(err)
            return
        }
    }
    err = f.Close()
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println("file written successfully")
}
```

In line no.9 of the program above, we create a new file named **lines**. In line no. 17 we iterate through the array using a for range loop and use the [Fprintln](https://golang.org/pkg/fmt/#Fprintln) function to write the lines to a file. The **Fprintln** function takes a io.writer as parameter and appends a new line, just what we wanted. Running this program will print `file written successfully` and a file `lines` will be created in the current directory. The content of the file `lines` is provided below.

```
Welcome to the world of Go1.  
Go is a compiled language.  
It is easy to learn Go.  
```

### Appending to a file

In this section, we will append one more line to the `lines` file which we created in the previous section. We will append the line **File handling is easy** to the `lines` file.

The file has to be opened in append and write only mode. These flags are passed parameters are passed to the [Open](https://golang.org/pkg/os/#OpenFile) function. After the file is opened in append mode, we add the new line to the file.

```
package main

import (  
    "fmt"
    "os"
)

func main() {  
    f, err := os.OpenFile("lines", os.O_APPEND|os.O_WRONLY, 0644)
    if err != nil {
        fmt.Println(err)
        return
    }
    newLine := "File handling is easy."
    _, err = fmt.Fprintln(f, newLine)
    if err != nil {
        fmt.Println(err)
                f.Close()
        return
    }
    err = f.Close()
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println("file appended successfully")
}
```

In line no. 9 of the program above, we open the file in append and write only mode. After the file is opened successfully, we add a new line to the file in line no. 15. This program will print `file appended successfully`. After running this program, the contents of the `lines` file will be,

```
Welcome to the world of Go1.  
Go is a compiled language.  
It is easy to learn Go.  
File handling is easy.  
```

### Writing to file concurrently

When multiple goroutines write to a file concurrently, we will end up with a [race condition](https://golangbot.com/mutex/#criticalsection). Hence concurrent writes to a file should be coordinated using a channel.

We will write a program that creates 100 goroutines. Each of this goroutine will generate a random number concurrently, thus generating hundred random numbers in total. These random numbers will be written to a file. We will solve this problem by using the following approach.

1.  Create a channel that will be used to read and write the generated random numbers.
2.  Create 100 producer goroutines. Each goroutine will generate a random number and will also write the random number to a channel.
3.  Create a consumer goroutine that will read from the channel and write the generated random number to the file. Thus we have only one goroutine writing to a file concurrently thereby avoiding race condition :)
4.  Close the file once done.

Let's write the `produce` function first which generates the random numbers.

```
func produce(data chan int, wg *sync.WaitGroup) {  
    n := rand.Intn(999)
    data <- n
    wg.Done()
}
```

The function above generates a random number and writes it to the channel `data` and then calls `Done` on the [waitgroup](https://golangbot.com/buffered-channels-worker-pools/#waitgroup) to notify that it is done with its task.

Let's move to the function which writes to the file now.

```
func consume(data chan int, done chan bool) {  
    f, err := os.Create("concurrent")
    if err != nil {
        fmt.Println(err)
        return
    }
    for d := range data {
        _, err = fmt.Fprintln(f, d)
        if err != nil {
            fmt.Println(err)
            f.Close()
            done <- false
            return
        }
    }
    err = f.Close()
    if err != nil {
        fmt.Println(err)
        done <- false
        return
    }
    done <- true
}
```

The `consume` function creates a file named `concurrent`. It then reads the random numbers from the `data` channel and writes to the file. Once it has read and written all the random numbers, it writes `true` to the `done` channel to notify that it's done with its task.

Let's write the `main` function and complete this program. I have provided the entire program below.

```
package main

import (  
    "fmt"
    "math/rand"
    "os"
    "sync"
)

func produce(data chan int, wg *sync.WaitGroup) {  
    n := rand.Intn(999)
    data <- n
    wg.Done()
}

func consume(data chan int, done chan bool) {  
    f, err := os.Create("concurrent")
    if err != nil {
        fmt.Println(err)
        return
    }
    for d := range data {
        _, err = fmt.Fprintln(f, d)
        if err != nil {
            fmt.Println(err)
            f.Close()
            done <- false
            return
        }
    }
    err = f.Close()
    if err != nil {
        fmt.Println(err)
        done <- false
        return
    }
    done <- true
}

func main() {  
    data := make(chan int)
    done := make(chan bool)
    wg := sync.WaitGroup{}
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go produce(data, &wg)
    }
    go consume(data, done)
    go func() {
        wg.Wait()
        close(data)
    }()
    d := <-done
    if d == true {
        fmt.Println("File written successfully")
    } else {
        fmt.Println("File writing failed")
    }
}
```

The main function creates the `data` channel in line no. 41 from which random numbers are read from and written. The `done` channel in line no. 42 is used by the `consume` goroutine to notify `main` that it is done with its task. The `wg` waitgroup in line no. 43 is used to wait for all the 100 goroutines to finish generating random numbers.

The `for` loop in line no. 44 creates 100 goroutines. The goroutine call in line no. 49 calls `wait()` on the waitgroup to wait for all 100 goroutines to finish creating random numbers. After that, it closes the channel. Once the channel is closed and the `consume` goroutine has finished writing all generated random numbers to the file, it writes `true` to the `done` channel in line no. 37 and the main goroutine is unblocked and prints `File written successfully`.

Now you can open the file **concurrent** in any text editor and see the 100 generated random numbers :)

This brings us to the end of this tutorial. Hope you enjoyed reading. Have a great day.

Previous tutorial - [Reading Files](https://golangbot.com/read-files/)