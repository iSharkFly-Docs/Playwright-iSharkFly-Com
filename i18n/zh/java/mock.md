---
title: "API 模拟"
---

# API 模拟

## 简介

Web API 通常以 HTTP 端点的形式实现。Playwright 提供 API 来**模拟**和**修改**网络流量，包括 HTTP 和 HTTPS。页面发起的任何请求，包括 [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 和
[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 请求，都可以被追踪、修改和模拟。使用 Playwright，你还可以使用包含页面发起的多个网络请求的 HAR 文件进行模拟。

## 模拟 API 请求

以下代码将拦截所有对 `*/**/api/v1/fruits` 的调用，并返回自定义响应。不会向 API 发起任何请求。测试会导航到使用模拟路由的 URL，并断言模拟数据出现在页面上。

```java
// 拦截水果 API 的路由
page.route("*/**/api/v1/fruits", route -> {
    List<Dictionary<String, Object>> data = new ArrayList<Dictionary<String, Object>>();
    Hashtable<String, Object> dict = new Hashtable<String, Object>();
    dict.put("name", "Strawberry");
    dict.put("id", 21);
    data.add(dict);
  // 使用模拟数据完成路由
  route.fulfill(RequestOptions.create().setData(data));
});

// 导航到页面
page.navigate("https://demo.playwright.dev/api-mocking");

// 断言草莓水果可见
assertThat(page.getByText("Strawberry")).isVisible();
```

你可以从示例测试的跟踪中看到，API 从未被调用，但使用了模拟数据完成。

<img src="https://github.com/microsoft/playwright/assets/13063165/3dc14cbf-c100-4efc-ac21-d7b52d698b53" alt="API 模拟跟踪" width="2946" height="1902" />

阅读更多关于[高级网络](./network.md)的内容。

## 修改 API 响应

有时，必须发起 API 请求，但需要修改响应以实现可重复的测试。在这种情况下，不是模拟请求，而是执行请求并使用修改后的响应来完成它。

在下面的示例中，我们拦截对水果 API 的调用，并向数据中添加一个名为"Loquat"的新水果。然后我们导航到 URL 并断言该数据存在：

```java
page.route("*/**/api/v1/fruits", route -> {
  Response response = route.fetch();
  byte[] json = response.body();
  JsonObject parsed = new Gson().fromJson(new String(json), JsonObject.class);
  parsed.add(new JsonObject().add("name", "Loquat").add("id", 100));
  // 使用原始响应完成，同时用给定的 JSON 对象修补响应体。
  route.fulfill(new Route.FulfillOptions().setResponse(response).setBody(parsed.toString()));
});

// 导航到页面
page.navigate("https://demo.playwright.dev/api-mocking");

// 断言枇杷水果可见
assertThat(page.getByText("Loquat", new Page.GetByTextOptions().setExact(true))).isVisible();
```

在测试跟踪中，我们可以看到 API 被调用，响应被修改了。

<img src="https://github.com/microsoft/playwright/assets/13063165/8b8dd82d-1b3e-428e-871b-840581fed439" alt="显示 API 被调用和完成的测试跟踪" width="2946" height="1902" />

通过检查响应，我们可以看到我们的新水果已添加到列表中。

<img src="https://github.com/microsoft/playwright/assets/13063165/03e6c87c-4ecc-47e8-9ca0-30fface25e9d" alt="显示模拟响应的测试跟踪" width="2946" height="1902" />

阅读更多关于[高级网络](./network.md)的内容。

## 使用 HAR 文件模拟

HAR 文件是一个 [HTTP 归档](http://www.softwareishard.com/blog/har-12-spec/)文件，包含页面加载时发起的所有网络请求的记录。它包含有关请求和响应头、cookie、内容、时间等信息。你可以使用 HAR 文件在测试中模拟网络请求。你需要：
1. 录制一个 HAR 文件。
1. 将 HAR 文件与测试一起提交。
1. 在测试中使用保存的 HAR 文件路由请求。

### 录制 HAR 文件

要录制 HAR 文件，我们使用 [`page.routeFromHAR()`](/java/api/class-page#page-route-from-har) 或 [`browserContext.routeFromHAR()`](/java/api/class-browsercontext#browser-context-route-from-har) 方法。此方法接收 HAR 文件的路径和一个可选的选项对象。
选项对象可以包含 URL，这样只有与指定 glob 模式匹配的 URL 的请求才会从 HAR 文件提供服务。如果未指定，所有请求都将从 HAR 文件提供服务。

将 `update` 选项设置为 true 将使用实际的网络信息创建或更新 HAR 文件，而不是从 HAR 文件提供请求。在创建测试时使用它来用真实数据填充 HAR。

#### 
另外，你也可以通过在创建浏览器上下文时使用 [`browser.newContext()`](/java/api/class-browser#browser-new-context) 中的 [`recordHarPath`](/java/api/class-browser#browser-new-context-option-record-har-path) 选项来录制 HAR 文件。这允许你捕获整个上下文的所有网络流量，直到上下文关闭。

```java
// 从 HAR 文件获取响应
page.routeFromHAR(Path.of("./hars/fruit.har"), new RouteFromHAROptions()
  .setUrl("*/**/api/v1/fruits")
  .setUpdate(true)
);

// 导航到页面
page.navigate("https://demo.playwright.dev/api-mocking");

// 断言水果可见
assertThat(page.getByText("Strawberry")).isVisible();
```

### 修改 HAR 文件

录制 HAR 文件后，你可以通过打开"hars"文件夹中的哈希 .txt 文件并编辑 JSON 来修改它。此文件应该提交到你的源代码控制中。每次使用 `update: true` 运行此测试时，它都会用来自 API 的请求更新你的 HAR 文件。

```json
[
  {
    "name": "Playwright",
    "id": 100
  },
  // ... 其他水果
]
```

### 从 HAR 回放

现在你已经录制并修改了 HAR 文件的模拟数据，它可以用于在测试中提供匹配的响应。为此，只需关闭或简单地删除 `update` 选项。这将针对 HAR 文件运行测试，而不是访问 API。

```java
// 从 HAR 回放 API 请求。
// 使用 HAR 中的匹配响应，
// 或者如果没有匹配则中止请求。
page.routeFromHAR(Path.of("./hars/fruit.har"), new RouteFromHAROptions()
  .setUrl("*/**/api/v1/fruits")
  .setUpdate(false)
);

// 导航到页面
page.navigate("https://demo.playwright.dev/api-mocking");

// 断言 Playwright 水果可见
assertThat(page.getByText("Playwright", new Page.GetByTextOptions()
  .setExact(true))).isVisible();
```

在测试跟踪中，我们可以看到路由从 HAR 文件完成，API 没有被调用。

<img src="https://github.com/microsoft/playwright/assets/13063165/1bd7ab66-ea4f-43c2-a4e5-ca17d4837ff1" alt="显示使用 HAR 文件的跟踪" width="2946" height="1902" />

如果我们检查响应，可以看到我们的新水果已添加到 JSON 中，这是通过手动更新 `hars` 文件夹中的哈希 `.txt` 文件完成的。

<img src="https://github.com/microsoft/playwright/assets/13063165/db3117fc-7b02-4973-9a51-29e213261a6a" alt="显示来自 HAR 文件的响应的跟踪" width="2946" height="1902" />

HAR 回放严格匹配 URL 和 HTTP 方法。对于 POST 请求，它还严格匹配 POST 负载。如果多个录制匹配一个请求，则选择匹配请求头最多的那个。导致重定向的条目将被自动跟随。

与录制时类似，如果给定的 HAR 文件名以 `.zip` 结尾，它被视为包含 HAR 文件和作为单独条目存储的网络负载的归档。你也可以提取此归档，手动编辑负载或 HAR 日志，然后指向提取的 har 文件。所有负载将相对于文件系统上提取的 har 文件解析。

#### 使用 CLI 录制 HAR

我们建议使用 `update` 选项为你的测试录制 HAR 文件。但是，你也可以使用 Playwright CLI 录制 HAR。

使用 Playwright CLI 打开浏览器并传递 `--save-har` 选项来生成 HAR 文件。可选地，使用 `--save-har-glob` 只保存你感兴趣的请求，例如 API 端点。如果 har 文件名以 `.zip` 结尾，工件将作为单独的文件写入，并全部压缩到一个 `zip` 中。

```bash
# 将 example.com 的 API 请求保存为 "example.har" 归档。
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="open --save-har=example.har --save-har-glob='**/api/**' https://example.com"
```

阅读更多关于[高级网络](./network.md)的内容。

## 模拟 WebSocket

以下代码将拦截 WebSocket 连接并模拟整个 WebSocket 通信，而不是连接到服务器。此示例用 `"response"` 响应 `"request"`。

```java
page.routeWebSocket("wss://example.com/ws", ws -> {
  ws.onMessage(frame -> {
    if ("request".equals(frame.text()))
      ws.send("response");
  });
});
```

或者，你可能想要连接到实际的服务器，但在中间拦截消息并修改或阻止它们。以下是一个示例，它修改了页面发送到服务器的一些消息，并保持其余消息不变。

```java
page.routeWebSocket("wss://example.com/ws", ws -> {
  WebSocketRoute server = ws.connectToServer();
  ws.onMessage(frame -> {
    if ("request".equals(frame.text()))
      server.send("request2");
    else
      server.send(frame.text());
  });
});
```

有关更多详细信息，请参阅 [WebSocketRoute](/java/api/class-websocketroute)。
