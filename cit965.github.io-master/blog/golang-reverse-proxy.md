---
slug: Go 中的反向代理
title: Go 中的反向代理
authors: mouuii
tags: [golang]
---

### 反向代理是什么

在计算机网络中，反向代理是一种代理服务器，它代表客户端从一个或多个服务器检索资源。然后，这些资源将返回到客户端，就好像它们源自 Web 服务器本身一样。与正向代理相反，正向代理是其关联客户端联系任何服务器的中介，反向代理是任何客户端联系其关联服务器的中介。有许多工具，例如 提琴手 ， Tinyproxy 可以帮助您做到这一点，主要用于调试网络。

经过一些修改的反向代理可以帮助修改/过滤/路由请求以获取资源。如果在同一实例中运行许多服务，则可以使用 reveres 代理将适当的请求路由到适当的资源。



![](https://raw.githubusercontent.com/mouuii/picture/master/1_fOfQDHWBnAfOwshAYSxTmQ.webp)

### 教程目标

这篇文章是一种教程，将解释开发反向代理所涉及的事情，该代理将拦截http调用，打印请求/响应正文并通过响应时间等帮助进行性能分析。Golang 的 net/http pkg 附带了客户端-服务器通信所需的大多数实现。您需要做的就是了解该功能并在需要时使用它，我们将使用golang这门语言来进行演示。

### 正文

假设您有一个可以通过 http 在某个端口访问的服务，但您不希望它被公开，或者您想添加一些自定义规则，或者您想在接口上进行一些性能分析，那么您可以使用反向代理。

在此示例中，我们将通过将来自服务器 one（在任意 9090 端口上运行）的所有 Web 请求转发到某处的另一个服务器来演示反向代理的作用，假设 http://127.0.0.1:8080

- 反向代理 golang 服务器将在 9090 端口上运行。
- 向服务器发出的所有请求都将透明地转发到目标Web服务器，并将响应发送到第一台服务器。
- 在转发请求之前，将捕获请求正文。感谢ioutil pkg的ReadAll和NopCloseer函数，它有助于复制请求正文而无需修改请求缓冲区。
- 我们还捕获了原始网络服务器为每个路径提供请求所花费的时间。

让我们有一个名为 Prox 的简单结构，它将处理反向代理的业务逻辑。

以下是一些结构体用法和带有 Go 接收器的指针方法接收器的示例。

#### Simple Proxy
```go
type Prox struct {
	target *url.URL
	proxy  *httputil.ReverseProxy
}

func NewProxy(target string) *Prox {
	url, _ := url.Parse(target)
	return &Prox{target: url, proxy: httputil.NewSingleHostReverseProxy(url)}
}
```

func (p *Prox) handle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("X-GoProxy", "GoProxy")
	p.proxy.Transport = &myTransport{}
	p.proxy.ServeHTTP(w, r)
}

如您所见，没有太多代码。我们只需要发送目标网址，NewProxy 函数将返回一个 Prox 结构对象。

```go
func (p *Prox) handle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("X-GoProxy", "GoProxy")
	p.proxy.Transport = &myTransport{}
	p.proxy.ServeHTTP(w, r)
}
```

由于我们想捕获请求/响应正文或为每个请求添加一些自定义规则，因此我们必须更改传输接口。因此，我们创建了自己的传输往返函数，并将其分配给代理。我们之前创建的运输。


```go
type myTransport struct {
}


func (t *myTransport) RoundTrip(request *http.Request) (*http.Response, error) {

  buf, _ := ioutil.ReadAll(request.Body)
	rdr1 := ioutil.NopCloser(bytes.NewBuffer(buf))
	rdr2 := ioutil.NopCloser(bytes.NewBuffer(buf))

	fmt.Println("Request body : ", rdr1)
	request.Body = rdr2

  
	response, err := http.DefaultTransport.RoundTrip(request)
	if err != nil {
		print("\n\ncame in error resp here", err)
		return nil, err //Server is not reachable. Server not working
	}
	
	body, err := httputil.DumpResponse(response, true)
	if err != nil {
		print("\n\nerror in dumb response")
		// copying the response body did not work
		return nil, err
	}

	log.Println("Response Body : ", string(body))
	return response, err
}
```

多亏了 Go 的时间包，我们可以测量函数所花费的时间，在我们的例子中是原始服务器的响应时间。我们修改了往返函数以测量每条路径所花费的时间。我们添加了代码，以便对于特定路径，我们有进行的http调用次数，所有调用所花费的时间，平均时间等。

```go

var globalMap = make(map[string]Montioringpath)

func (t *myTransport) RoundTrip(request *http.Request) (*http.Response, error) {
  start := time.Now()
	response, err := http.DefaultTransport.RoundTrip(request)
	if err != nil {
		print("\n\ncame in error resp here", err)
		return nil, err //Server is not reachable. Server not working
	}
	elapsed := time.Since(start)

	key := request.Method + "-" + request.URL.Path //for example for POST Method with /path1 as url path key=POST-/path1

	if val, ok := globalMap[key]; ok {
		val.Count = val.Count + 1
		val.Duration += elapsed.Nanoseconds()
		val.AverageTime = val.Duration / val.Count
		globalMap[key] = val
		//do something here
	} else {
		var m Montioringpath
		m.Path = request.URL.Path
		m.Count = 1
		m.Duration = elapsed.Nanoseconds()
		m.AverageTime = m.Duration / m.Count
		globalMap[key] = m
	}
	b, err := json.MarshalIndent(globalMap, "", "  ")
	if err != nil {
		fmt.Println("error:", err)
	}

	body, err := httputil.DumpResponse(response, true)
	if err != nil {
		print("\n\nerror in dumb response")
		// copying the response body did not work
		return nil, err
	}

	log.Println("Response Body : ", string(body))
	log.Println("Response Time:", elapsed.Nanoseconds())
}
```

#### main 

Go 的标志 pkg 有助于在运行程序时接受命令行参数。我们可以通过命令行参数设置 http 端口（代理服务器将运行的位置）和重定向 url（需要路由 http 请求的位置）。

```go
func main() {
	const (
		defaultPort        = ":9090"
		defaultPortUsage   = "default server port, ':9090'"
		defaultTarget      = "http://127.0.0.1:8080"
		defaultTargetUsage = "default redirect url, 'http://127.0.0.1:8080'"
	)

	// flags
	port = flag.String("port", defaultPort, defaultPortUsage)
	redirecturl = flag.String("url", defaultTarget, defaultTargetUsage)

	flag.Parse()

	fmt.Println("server will run on :", *port)
	fmt.Println("redirecting to :", *redirecturl)

	// proxy
	proxy := NewProxy(*redirecturl)

	http.HandleFunc("/proxyServer", ProxyServer)

	// server redirection
	http.HandleFunc("/", proxy.handle)
	log.Fatal(http.ListenAndServe(":"+*port, nil))
}
```

如果在运行程序时未设置参数，则默认端口集为 9090，请求将路由到 http://127.0.0.1:8080 。

### 运行

如果要在 9090 上托管反向代理并将请求重定向到端口 5000 ，请运行以下命令

```sh
./ReverseProxy -port=9090 -url=http://localhost:5000
```

当您运行反向代理服务器时，它将打印运行反向代理的端口以及将请求重定向到的位置。

以下屏幕截图显示了通过反向代理发出登录 POST 请求之一后捕获的内容。
![](https://raw.githubusercontent.com/mouuii/picture/master/1_YoVZ_ETluyfay6y7TznTEw.webp)