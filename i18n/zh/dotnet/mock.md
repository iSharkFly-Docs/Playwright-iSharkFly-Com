---
title: "Mock API"
---

# Mock API

## 简介

Web API 通常实现为 HTTP 端点。Playwright 提供 API 来 **mock** 和 **修改** 网络流量，包括 HTTP 和 HTTPS。页面发出的任何请求，包括 [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 和
[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 请求，都可以被跟踪、修改和 mock。使用 Playwright，你还可以使用包含页面发出的多个网络请求的 HAR 文件进行 mock。

## Mock API 请求

以下代码将拦截所有对 `*/**/api/v1/fruits` 的调用，并返回自定义响应。不会向 API 发出实际请求。测试导航到使用 mock 路由的 URL，并断言页面上存在 mock 数据。

```csharp
// 拦截到水果 API 的路由
await page.RouteAsync("*/**/api/v1/fruits", async route => {
  var json = new[] { new { name = "Strawberry", id = 21 } };
  // 使用 mock 数据完成路由
  await route.FulfillAsync(new()
  {
    Json = json
  });
});

// 转到页面
await page.GotoAsync("https://demo.playwright.dev/api-mocking");

// 断言 Strawberry 水果可见
await Expect(page.GetByText("Strawberry")).ToBeVisibleAsync();
```

你可以从示例测试的跟踪中看到 API 从未被调用，但却用 mock 数据完成了。

<img src="https://github.com/microsoft/playwright/assets/13063165/3dc14cbf-c100-4efc-ac21-d7b52d698b53" alt="api mocking 跟踪" width="2946" height="1902" />

阅读更多关于[高级网络](./network.md)的内容。

## 修改 API 响应

有时，发出 API 请求是必要的，但需要修补响应以进行可重现的测试。在这种情况下，不是 mock 请求，而是可以执行请求并用修改后的响应来完成它。

在下面的示例中，我们拦截对水果 API 的调用并添加一个名为 'Loquat' 的新水果到数据中。然后我们转到 URL 并断言这些数据存在：

```csharp
await page.RouteAsync("*/**/api/v1/fruits", async (route) => {
    var response = await route.FetchAsync();
    var fruits = await response.JsonAsync<Fruit[]>();
    fruits.Add(new Fruit() { Name = "Loquat", Id = 100 });
    // 使用原始响应完成，同时用给定的 JSON 对象修补响应体。
    await route.FulfillAsync(new ()
    {
      Response = response,
      Json = fruits
    });
  }
);
// 转到页面
await page.GotoAsync("https://demo.playwright.dev/api-mocking");

// 断言 Loquat 水果可见
await Expect(page.GetByText("Loquat", new () { Exact = true })).ToBeVisibleAsync();
```

在我们测试的跟踪中，我们可以看到 API 被调用，响应被修改。

<img src="https://github.com/microsoft/playwright/assets/13063165/8b8dd82d-1b3e-428e-871b-840581fed439" alt="显示 api 被调用和完成的测试跟踪" width="2946" height="1902" />

通过检查响应，我们可以看到我们的新水果已添加到列表中。

<img src="https://github.com/microsoft/playwright/assets/13063165/03e6c87c-4ecc-47e8-9ca0-30fface25e9d" alt="显示 mock 响应的测试跟踪" width="2946" height="1902" />

阅读更多关于[高级网络](./network.md)的内容。

## 使用 HAR 文件进行 Mock

HAR 文件是一个 [HTTP 存档](http://www.softwareishard.com/blog/har-12-spec/)文件，包含页面加载时发出的所有网络请求的记录。它包含有关请求和响应头、cookie、内容、时间等的信息。你可以使用 HAR 文件在测试中 mock 网络请求。你需要：
1. 录制 HAR 文件。
1. 将 HAR 文件与测试一起提交。
1. 在测试中使用保存的 HAR 文件来路由请求。

### 录制 HAR 文件

要录制 HAR 文件，我们使用 [`Page.RouteFromHARAsync()`](/dotnet/api/class-page#page-route-from-har) 或 [`BrowserContext.RouteFromHARAsync()`](/dotnet/api/class-browsercontext#browser-context-route-from-har) 方法。此方法接受 HAR 文件的路径和可选的选项对象。
选项对象可以包含 URL，这样只有与指定 glob 模式匹配的 URL 的请求才会从 HAR 文件提供。如果未指定，所有请求都将从 HAR 文件提供。

设置 `update` 选项为 true 将使用实际网络信息创建或更新 HAR 文件，而不是从 HAR 文件提供请求。创建测试时使用它来用真实数据填充 HAR。

#### 
或者，你也可以通过在 [`Browser.NewContextAsync()`](/dotnet/api/class-browser#browser-new-context) 中创建浏览器上下文时使用 [`recordHarPath`](/dotnet/api/class-browser#browser-new-context-option-record-har-path) 选项来录制 HAR 文件。这允许你捕获整个上下文的所有网络流量，直到上下文关闭。

```csharp
// 从 HAR 文件获取响应
await page.RouteFromHARAsync("./hars/fruit.har", new () {
  Url = "*/**/api/v1/fruits",
  Update = true,
});

// 转到页面
await page.GotoAsync("https://demo.playwright.dev/api-mocking");

// 断言水果可见
await Expect(page.GetByText("Strawberry")).ToBeVisibleAsync();
```

### 修改 HAR 文件

录制 HAR 文件后，你可以通过打开 'hars' 文件夹中的哈希 .txt 文件并编辑 JSON 来修改它。此文件应提交到源代码控制。每次你使用 `update: true` 运行此测试时，它将使用来自 API 的请求更新你的 HAR 文件。

```json
[
  {
    "name": "Playwright",
    "id": 100
  },
  // ... 其他水果
]
```

### 从 HAR 重放

现在你已经录制并修改了 mock 数据的 HAR 文件，它可以用于在测试中提供匹配的响应。为此，只需关闭或简单地删除 `update` 选项。这将针对 HAR 文件运行测试，而不是访问 API。

```csharp
// 从 HAR 重放 API 请求。
// 使用 HAR 中的匹配响应，
// 或者如果没有匹配项则中止请求。
await page.RouteFromHARAsync("./hars/fruit.har", new ()
  {
    Url = "*/**/api/v1/fruits",
    Update = false,
  }
);

// 转到页面
await page.GotoAsync("https://demo.playwright.dev/api-mocking");

// 断言 Playwright 水果可见
await page.ExpectByTextAsync("Playwright", new() { Exact = true }).ToBeVisibleAsync();
```

在我们测试的跟踪中，我们可以看到路由是从 HAR 文件完成的，API 没有被调用。

<img src="https://github.com/microsoft/playwright/assets/13063165/1bd7ab66-ea4f-43c2-a4e5-ca17d4837ff1" alt="显示正在使用 HAR 文件的跟踪" width="2946" height="1902" />

如果我们检查响应，我们可以看到我们的新水果已添加到 JSON 中，这是通过手动更新 `hars` 文件夹中的哈希 `.txt` 文件完成的。

<img src="https://github.com/microsoft/playwright/assets/13063165/db3117fc-7b02-4973-9a51-29e213261a6a" alt="显示来自 HAR 文件响应的跟踪" width="2946" height="1902" />

HAR 重放严格匹配 URL 和 HTTP 方法。对于 POST 请求，它还严格匹配 POST 负载。如果多个录制匹配一个请求，则选择具有最多匹配头的那个。导致重定向的条目将自动跟踪。

与录制时类似，如果给定的 HAR 文件名以 `.zip` 结尾，则认为它是一个存档，包含 HAR 文件以及作为单独条目存储的网络负载。你也可以解压此存档，手动编辑负载或 HAR 日志，并指向解压后的 har 文件。所有负载将相对于文件系统上解压后的 har 文件解析。

#### 使用 CLI 录制 HAR

我们建议使用 `update` 选项来录制测试的 HAR 文件。但是，你也可以使用 Playwright CLI 录制 HAR。

使用 Playwright CLI 打开浏览器并传递 `--save-har` 选项来生成 HAR 文件。可选地，使用 `--save-har-glob` 仅保存你感兴趣的请求，例如 API 端点。如果 har 文件名以 `.zip` 结尾，工件将作为单独的文件写入，并全部压缩到单个 `zip` 中。

```bash
# 将 example.com 的 API 请求保存为 "example.har" 存档。
pwsh bin/Debug/netX/playwright.ps1 open --save-har=example.har --save-har-glob="**/api/**" https://example.com
```

阅读更多关于[高级网络](./network.md)的内容。

## Mock WebSocket

以下代码将拦截 WebSocket 连接并 mock 整个 WebSocket 上的通信，而不是连接到服务器。此示例用 `"response"` 响应 `"request"`。

```csharp
await page.RouteWebSocketAsync("wss://example.com/ws", ws => {
  ws.OnMessage(frame => {
    if (frame.Text == "request")
      ws.Send("response");
  });
});
```

或者，你可能想连接到实际服务器，但拦截中间的消息并修改或阻止它们。以下示例修改了页面发送到服务器的一些消息，其余的保持不变。

```csharp
await page.RouteWebSocketAsync("wss://example.com/ws", ws => {
  var server = ws.ConnectToServer();
  ws.OnMessage(frame => {
    if (frame.Text == "request")
      server.Send("request2");
    else
      server.Send(frame.Text);
  });
});
```

有关更多详细信息，请参阅 [WebSocketRoute](/dotnet/api/class-websocketroute)。
