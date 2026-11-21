---
title: "模拟 API"
---

# 模拟 API

## 简介

Web API 通常以 HTTP 端点的形式实现。Playwright 提供 API 来**模拟**和**修改**网络流量，包括 HTTP 和 HTTPS。页面发出的任何请求，包括 [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 和 [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 请求，都可以被追踪、修改和模拟。使用 Playwright，你还可以使用包含页面发出的多个网络请求的 HAR 文件进行模拟。

## 模拟 API 请求

以下代码将拦截所有对 `*/**/api/v1/fruits` 的调用，并返回自定义响应。不会向 API 发出任何请求。测试导航到使用模拟路由的 URL，并断言模拟数据存在于页面上。

::: code-group

```python [Async]
async def test_mock_the_fruit_api(page: Page):
    async def handle(route: Route):
        json = [{"name": "Strawberry", "id": 21}]
        # 使用模拟数据完成路由
        await route.fulfill(json=json)

    # 拦截到水果 API 的路由
    await page.route("*/**/api/v1/fruits", handle)

    # 进入页面
    await page.goto("https://demo.playwright.dev/api-mocking")

    # 断言 Strawberry 水果可见
    await expect(page.get_by_text("Strawberry")).to_be_visible()
```

```python [Sync]
def test_mock_the_fruit_api(page: Page):
    def handle(route: Route):
        json = [{"name": "Strawberry", "id": 21}]
        # 使用模拟数据完成路由
        route.fulfill(json=json)

    # 拦截到水果 API 的路由
    page.route("*/**/api/v1/fruits", handle)

    # 进入页面
    page.goto("https://demo.playwright.dev/api-mocking")

    # 断言 Strawberry 水果可见
    expect(page.get_by_text("Strawberry")).to_be_visible()
```

:::

你可以从示例测试的追踪中看到，API 从未被调用，但是被模拟数据所完成。

<img src="https://github.com/microsoft/playwright/assets/13063165/3dc14cbf-c100-4efc-ac21-d7b52d698b53" alt="api 模拟追踪" width="2946" height="1902" />

阅读更多关于[高级网络](./network.md)的内容。

## 修改 API 响应

有时，执行 API 请求是必要的，但需要修改响应以允许可重现的测试。在这种情况下，不是模拟请求，而是执行请求并用修改后的响应来完成它。

在下面的示例中，我们拦截对水果 API 的调用，并向数据中添加一个名为 'Loquat' 的新水果。然后我们转到 URL 并断言此数据存在：

::: code-group

```python [Async]
async def test_gets_the_json_from_api_and_adds_a_new_fruit(page: Page):
    async def handle(route: Route):
        response = await route.fetch()
        json = await response.json()
        json.append({ "name": "Loquat", "id": 100})
        # 使用原始响应完成，同时用给定的 JSON 对象修补响应体。
        await route.fulfill(response=response, json=json)

    await page.route("https://demo.playwright.dev/api-mocking/api/v1/fruits", handle)

    # 进入页面
    await page.goto("https://demo.playwright.dev/api-mocking")

    # 断言新水果可见
    await expect(page.get_by_text("Loquat", exact=True)).to_be_visible()
```

```python [Sync]
def test_gets_the_json_from_api_and_adds_a_new_fruit(page: Page):
    def handle(route: Route):
        response = route.fetch()
        json = response.json()
        json.append({ "name": "Loquat", "id": 100})
        # 使用原始响应完成，同时用给定的 JSON 对象修补响应体。
        route.fulfill(response=response, json=json)

    page.route("https://demo.playwright.dev/api-mocking/api/v1/fruits", handle)

    # 进入页面
    page.goto("https://demo.playwright.dev/api-mocking")

    # 断言新水果可见
    expect(page.get_by_text("Loquat", exact=True)).to_be_visible()
```

:::

在测试的追踪中，我们可以看到 API 被调用，响应被修改。

<img src="https://github.com/microsoft/playwright/assets/13063165/8b8dd82d-1b3e-428e-871b-840581fed439" alt="显示 API 被调用和完成的测试追踪" width="2946" height="1902" />

通过检查响应，我们可以看到我们的新水果被添加到了列表中。

<img src="https://github.com/microsoft/playwright/assets/13063165/03e6c87c-4ecc-47e8-9ca0-30fface25e9d" alt="显示模拟响应的测试追踪" width="2946" height="1902" />

阅读更多关于[高级网络](./network.md)的内容。

## 使用 HAR 文件进行模拟

HAR 文件是一个 [HTTP 存档](http://www.softwareishard.com/blog/har-12-spec/)文件，包含页面加载时发出的所有网络请求的记录。它包含有关请求和响应头、cookie、内容、时间等的信息。你可以使用 HAR 文件在测试中模拟网络请求。你需要：
1. 录制 HAR 文件。
1. 将 HAR 文件与测试一起提交。
1. 在测试中使用保存的 HAR 文件路由请求。

### 录制 HAR 文件

要录制 HAR 文件，我们使用 [`page.route_from_har()`](/python/api/class-page#page-route-from-har) 或 [`browser_context.route_from_har()`](/python/api/class-browsercontext#browser-context-route-from-har) 方法。此方法接收 HAR 文件的路径和一个可选的选项对象。
选项对象可以包含 URL，以便只有 URL 匹配指定 glob 模式的请求才会从 HAR 文件提供。如果未指定，所有请求都将从 HAR 文件提供。

将 `update` 选项设置为 true 将使用实际网络信息创建或更新 HAR 文件，而不是从 HAR 文件提供请求。在创建测试以使用真实数据填充 HAR 时使用它。

#### 
另外，你也可以在创建浏览器上下文时使用 [`browser.new_context()`](/python/api/class-browser#browser-new-context) 中的 [`record_har_path`](/python/api/class-browser#browser-new-context-option-record-har-path) 选项来录制 HAR 文件。这允许你捕获整个上下文的所有网络流量，直到上下文关闭。

::: code-group

```python [Async]
async def test_records_or_updates_the_har_file(page: Page):
    # 从 HAR 文件获取响应
    await page.route_from_har("./hars/fruit.har", url="*/**/api/v1/fruits", update=True)

    # 进入页面
    await page.goto("https://demo.playwright.dev/api-mocking")

    # 断言水果可见
    await expect(page.get_by_text("Strawberry")).to_be_visible()
```

```python [Sync]
def test_records_or_updates_the_har_file(page: Page):
    # 从 HAR 文件获取响应
    page.route_from_har("./hars/fruit.har", url="*/**/api/v1/fruits", update=True)

    # 进入页面
    page.goto("https://demo.playwright.dev/api-mocking")

    # 断言水果可见
    expect(page.get_by_text("Strawberry")).to_be_visible()
```

:::

### 修改 HAR 文件

录制 HAR 文件后，你可以通过打开 'hars' 文件夹内的哈希 .txt 文件并编辑 JSON 来修改它。此文件应提交到你的源代码管理。每次使用 `update: true` 运行此测试时，它将使用来自 API 的请求更新你的 HAR 文件。

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

现在你已经录制并修改了模拟数据的 HAR 文件，可以在测试中使用它来提供匹配的响应。为此，只需关闭或简单删除 `update` 选项。这将针对 HAR 文件而不是实际 API 运行测试。

::: code-group

```python [Async]
async def test_gets_the_json_from_har_and_checks_the_new_fruit_has_been_added(page: Page):
    # 从 HAR 重放 API 请求。
    # 使用 HAR 中的匹配响应，
    # 或者如果没有匹配则中止请求。
    await page.route_from_har("./hars/fruit.har", url="*/**/api/v1/fruits", update=False)

    # 进入页面
    await page.goto("https://demo.playwright.dev/api-mocking")

    # 断言 Playwright 水果可见
    await expect(page.get_by_text("Playwright", exact=True)).to_be_visible()
```

```python [Sync]
def test_gets_the_json_from_har_and_checks_the_new_fruit_has_been_added(page: Page):
    # 从 HAR 重放 API 请求。
    # 使用 HAR 中的匹配响应，
    # 或者如果没有匹配则中止请求。
    page.route_from_har("./hars/fruit.har", url="*/**/api/v1/fruits", update=False)

    # 进入页面
    page.goto("https://demo.playwright.dev/api-mocking")

    # 断言 Playwright 水果可见
    expect(page.get_by_text("Playwright", exact=True)).to_be_visible()
```

:::

在测试的追踪中，我们可以看到路由是从 HAR 文件完成的，API 没有被调用。

<img src="https://github.com/microsoft/playwright/assets/13063165/1bd7ab66-ea4f-43c2-a4e5-ca17d4837ff1" alt="显示使用 HAR 文件的追踪" width="2946" height="1902" />

如果我们检查响应，可以看到我们的新水果被添加到了 JSON 中，这是通过手动更新 `hars` 文件夹内的哈希 `.txt` 文件完成的。

<img src="https://github.com/microsoft/playwright/assets/13063165/db3117fc-7b02-4973-9a51-29e213261a6a" alt="显示来自 HAR 文件的响应的追踪" width="2946" height="1902" />

HAR 重放严格匹配 URL 和 HTTP 方法。对于 POST 请求，它还严格匹配 POST 负载。如果多个录制与一个请求匹配，则选择具有最多匹配头的那个。导致重定向的条目将被自动跟随。

与录制类似，如果给定的 HAR 文件名以 `.zip` 结尾，则将其视为包含 HAR 文件以及作为单独条目存储的网络负载的存档。你也可以提取此存档，手动编辑负载或 HAR 日志，然后指向提取的 HAR 文件。所有负载将相对于文件系统上提取的 HAR 文件解析。

#### 使用 CLI 录制 HAR

我们建议使用 `update` 选项为你的测试录制 HAR 文件。但是，你也可以使用 Playwright CLI 录制 HAR。

使用 Playwright CLI 打开浏览器并传递 `--save-har` 选项以生成 HAR 文件。可选地，使用 `--save-har-glob` 仅保存你感兴趣的请求，例如 API 端点。如果 HAR 文件名以 `.zip` 结尾，产物将作为单独的文件写入，并全部压缩到单个 `zip` 中。

```bash
# 将来自 example.com 的 API 请求保存为 "example.har" 存档。
playwright open --save-har=example.har --save-har-glob="**/api/**" https://example.com
```

阅读更多关于[高级网络](./network.md)的内容。

## 模拟 WebSocket

以下代码将拦截 WebSocket 连接并模拟整个 WebSocket 通信，而不是连接到服务器。此示例用 `"response"` 响应 `"request"`。

::: code-group

```python [Async]
def message_handler(ws: WebSocketRoute, message: Union[str, bytes]):
  if message == "request":
    ws.send("response")

await page.route_web_socket("wss://example.com/ws", lambda ws: ws.on_message(
    lambda message: message_handler(ws, message)
))
```

```python [Sync]
def message_handler(ws: WebSocketRoute, message: Union[str, bytes]):
  if message == "request":
    ws.send("response")

page.route_web_socket("wss://example.com/ws", lambda ws: ws.on_message(
    lambda message: message_handler(ws, message)
))
```

:::

或者，你可能想连接到实际的服务器，但在中间拦截消息并修改或阻止它们。以下示例修改了页面发送到服务器的一些消息，其余保持不变。

::: code-group

```python [Async]
def message_handler(server: WebSocketRoute, message: Union[str, bytes]):
  if message == "request":
    server.send("request2")
  else:
    server.send(message)

def handler(ws: WebSocketRoute):
  server = ws.connect_to_server()
  ws.on_message(lambda message: message_handler(server, message))

await page.route_web_socket("wss://example.com/ws", handler)
```

```python [Sync]
def message_handler(server: WebSocketRoute, message: Union[str, bytes]):
  if message == "request":
    server.send("request2")
  else:
    server.send(message)

def handler(ws: WebSocketRoute):
  server = ws.connect_to_server()
  ws.on_message(lambda message: message_handler(server, message))

page.route_web_socket("wss://example.com/ws", handler)
```

:::

更多详情，请参阅 [WebSocketRoute](/python/api/class-websocketroute)。
