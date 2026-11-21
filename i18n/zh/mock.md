---
title: "Mock API"
---

# Mock API

## 简介

Web API 通常以 HTTP 端点的形式实现。Playwright 提供 API 来**模拟**和**修改**网络流量，包括 HTTP 和 HTTPS。页面发出的任何请求，包括 [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 和 [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 请求，都可以被跟踪、修改和模拟。使用 Playwright，您还可以使用包含页面发出的多个网络请求的 HAR 文件进行模拟。

## 模拟 API 请求

以下代码将拦截所有对 `*/**/api/v1/fruits` 的调用，并返回自定义响应。不会向 API 发出任何请求。测试会导航到使用模拟路由的 URL，并断言页面上存在模拟数据。

```js
test("mocks a fruit and doesn't call api", async ({ page }) => {
  // 在导航之前模拟 api 调用
  await page.route('*/**/api/v1/fruits', async route => {
    const json = [{ name: 'Strawberry', id: 21 }];
    await route.fulfill({ json });
  });
  // 前往页面
  await page.goto('https://demo.playwright.dev/api-mocking');

  // 断言 Strawberry 水果可见
  await expect(page.getByText('Strawberry')).toBeVisible();
});
```

从示例测试的跟踪中可以看到，API 从未被调用，而是用模拟数据完成了响应。

<img src="https://github.com/microsoft/playwright/assets/13063165/3dc14cbf-c100-4efc-ac21-d7b52d698b53" alt="api mocking trace" width="2946" height="1902" />

阅读更多关于[高级网络](./network.md)的内容。

## 修改 API 响应

有时，发出 API 请求是必要的，但需要修改响应以实现可重复的测试。在这种情况下，不是模拟请求，而是执行请求并用修改后的响应完成它。

在下面的示例中，我们拦截对水果 API 的调用，并添加一个名为 'Loquat' 的新水果到数据中。然后我们前往 URL 并断言该数据存在：

```js
test('gets the json from api and adds a new fruit', async ({ page }) => {
  // 获取响应并添加内容
  await page.route('*/**/api/v1/fruits', async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.push({ name: 'Loquat', id: 100 });
    // 使用原始响应完成，同时用给定的 JSON 对象修补响应体。
    await route.fulfill({ response, json });
  });

  // 前往页面
  await page.goto('https://demo.playwright.dev/api-mocking');

  // 断言新水果可见
  await expect(page.getByText('Loquat', { exact: true })).toBeVisible();
});
```

在我们测试的跟踪中，可以看到 API 被调用并且响应被修改了。

<img src="https://github.com/microsoft/playwright/assets/13063165/8b8dd82d-1b3e-428e-871b-840581fed439" alt="trace of test showing api being called and fulfilled" width="2946" height="1902" />

通过检查响应，我们可以看到新水果已添加到列表中。

<img src="https://github.com/microsoft/playwright/assets/13063165/03e6c87c-4ecc-47e8-9ca0-30fface25e9d" alt="trace of test showing the mock response" width="2946" height="1902" />

阅读更多关于[高级网络](./network.md)的内容。

## 使用 HAR 文件进行模拟

HAR 文件是一个 [HTTP 归档](http://www.softwareishard.com/blog/har-12-spec/)文件，其中包含页面加载时发出的所有网络请求的记录。它包含有关请求和响应头、cookie、内容、时间等的信息。您可以在测试中使用 HAR 文件来模拟网络请求。您需要：
1. 录制 HAR 文件。
1. 将 HAR 文件与测试一起提交。
1. 在测试中使用保存的 HAR 文件路由请求。

### 录制 HAR 文件

要录制 HAR 文件，我们使用 [`page.routeFromHAR()`](/api/class-page#page-route-from-har) 或 [`browserContext.routeFromHAR()`](/api/class-browsercontext#browser-context-route-from-har) 方法。此方法接收 HAR 文件的路径和一个可选的选项对象。
选项对象可以包含 URL，这样只有与指定 glob 模式匹配的 URL 的请求才会从 HAR 文件提供服务。如果未指定，所有请求都将从 HAR 文件提供服务。

将 `update` 选项设置为 true 将使用实际网络信息创建或更新 HAR 文件，而不是从 HAR 文件提供请求。在创建测试时使用它来用真实数据填充 HAR。

#### 
或者，您也可以通过在创建浏览器上下文时使用 [`browser.newContext()`](/api/class-browser#browser-new-context) 中的 [`recordHar`](/api/class-browser#browser-new-context-option-record-har) 选项来录制 HAR 文件。这允许您捕获整个上下文的所有网络流量，直到上下文关闭。

### 修改 HAR 文件

录制 HAR 文件后，您可以通过打开 'hars' 文件夹内的哈希 .txt 文件并编辑 JSON 来修改它。此文件应提交到您的源代码控制。每次使用 `update: true` 运行此测试时，它都会用来自 API 的请求更新您的 HAR 文件。

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

现在您已经录制并修改了模拟数据的 HAR 文件，可以在测试中使用它来提供匹配的响应。为此，只需关闭或删除 `update` 选项。这将针对 HAR 文件运行测试，而不是调用 API。

```js
test('gets the json from HAR and checks the new fruit has been added', async ({ page }) => {
  // 从 HAR 重放 API 请求。
  // 使用 HAR 中的匹配响应，
  // 或者如果没有匹配则中止请求。
  await page.routeFromHAR('./hars/fruit.har', {
    url: '*/**/api/v1/fruits',
    update: false,
  });

  // 前往页面
  await page.goto('https://demo.playwright.dev/api-mocking');

  // 断言 Playwright 水果可见
  await expect(page.getByText('Playwright', { exact: true })).toBeVisible();
});
```

在我们测试的跟踪中，可以看到路由是从 HAR 文件完成的，API 没有被调用。

<img src="https://github.com/microsoft/playwright/assets/13063165/1bd7ab66-ea4f-43c2-a4e5-ca17d4837ff1" alt="trace showing the HAR file being used" width="2946" height="1902" />

如果我们检查响应，可以看到我们的新水果已添加到 JSON 中，这是通过手动更新 `hars` 文件夹内的哈希 `.txt` 文件完成的。

<img src="https://github.com/microsoft/playwright/assets/13063165/db3117fc-7b02-4973-9a51-29e213261a6a" alt="trace showing response from HAR file" width="2946" height="1902" />

HAR 重放严格匹配 URL 和 HTTP 方法。对于 POST 请求，它还严格匹配 POST 负载。如果多个录制匹配一个请求，则选择具有最多匹配头的那个。导致重定向的条目将自动跟随。

与录制时类似，如果给定的 HAR 文件名以 `.zip` 结尾，则它被视为包含 HAR 文件以及作为单独条目存储的网络负载的归档。您还可以提取此归档，手动编辑负载或 HAR 日志，并指向提取的 har 文件。所有负载将相对于文件系统上提取的 har 文件解析。

#### 使用 CLI 录制 HAR

我们建议使用 `update` 选项为您的测试录制 HAR 文件。但是，您也可以使用 Playwright CLI 录制 HAR。

使用 Playwright CLI 打开浏览器并传递 `--save-har` 选项以生成 HAR 文件。可选地，使用 `--save-har-glob` 仅保存您感兴趣的请求，例如 API 端点。如果 har 文件名以 `.zip` 结尾，工件将作为单独的文件写入并全部压缩为单个 `zip`。

```bash
# 将 example.com 的 API 请求保存为 "example.har" 归档。
npx playwright open --save-har=example.har --save-har-glob="**/api/**" https://example.com
```

阅读更多关于[高级网络](./network.md)的内容。

## 模拟 WebSockets

以下代码将拦截 WebSocket 连接并模拟整个 WebSocket 通信，而不是连接到服务器。此示例用 `"response"` 响应 `"request"`。

```js
await page.routeWebSocket('wss://example.com/ws', ws => {
  ws.onMessage(message => {
    if (message === 'request')
      ws.send('response');
  });
});
```

或者，您可能想连接到实际服务器，但在中间拦截消息并修改或阻止它们。以下示例修改了页面发送到服务器的一些消息，而其余的保持不变。

```js
await page.routeWebSocket('wss://example.com/ws', ws => {
  const server = ws.connectToServer();
  ws.onMessage(message => {
    if (message === 'request')
      server.send('request2');
    else
      server.send(message);
  });
});
```

有关更多详细信息，请参阅 [WebSocketRoute](/api/class-websocketroute)。
