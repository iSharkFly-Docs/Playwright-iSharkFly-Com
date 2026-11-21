---
title: Route
outline: 2
---

# Route

<Badge type="info" text="Added in: v1.8" />

每当使用 [`page.route()`](/api/class-page#page-route) 或 [`browserContext.route()`](/api/class-browsercontext#browser-context-route) 设置网络路由时，`Route` 对象允许处理该路由。

了解更多关于 [网络](../network.md) 的信息。

## 方法

### route.abort() {#route-abort}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

中止路由的请求。

**参数**

- <a id="route-abort-option-error-code"></a>`errorCode` `string` *(可选)*

  可选的错误码。默认为 `failed`，可以是以下之一：
  * `'aborted'` - 操作被中止（由于用户操作）
  * `'accessdenied'` - 访问网络以外的资源的权限被拒绝
  * `'addressunreachable'` - IP 地址不可达。这通常意味着没有到指定主机或网络的路由。
  * `'blockedbyclient'` - 客户端选择阻止请求。
  * `'blockedbyresponse'` - 请求失败，因为响应附带了未满足的要求（例如 'X-Frame-Options' 和 'Content-Security-Policy' 祖先检查）。
  * `'connectionaborted'` - 由于未收到发送数据的 ACK，连接超时。
  * `'connectionclosed'` - 连接已关闭（对应 TCP FIN）。
  * `'connectionfailed'` - 连接尝试失败。
  * `'connectionrefused'` - 连接尝试被拒绝。
  * `'connectionreset'` - 连接被重置（对应 TCP RST）。
  * `'internetdisconnected'` - 互联网连接已断开。
  * `'namenotresolved'` - 主机名无法解析。
  * `'timedout'` - 操作超时。
  * `'failed'` - 发生通用故障。


### route.continue() {#route-continue}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

将路由的请求发送到网络，可选择覆盖某些参数。

**用法**

```js
await page.route('**/*', async (route, request) => {
  // 覆盖头信息
  const headers = {
    ...request.headers(),
    foo: 'foo-value', // 设置 "foo" 头
    bar: undefined, // 移除 "bar" 头
  };
  await route.continue({ headers });
});
```

**详情**

[`headers`](/api/class-route#route-continue-option-headers) 选项适用于路由的请求及其发起的任何重定向。但是，[`url`](/api/class-route#route-continue-option-url)、[`method`](/api/class-route#route-continue-option-method) 和 [`postData`](/api/class-route#route-continue-option-post-data) 仅适用于原始请求，不会传递到重定向的请求。

[`route.continue()`](/api/class-route#route-continue) 会立即将请求发送到网络，其他匹配的处理程序不会被调用。如果你希望链中的下一个匹配处理程序被调用，请使用 [`route.fallback()`](/api/class-route#route-fallback)。

::: warning
某些请求头是**禁止的**，无法被覆盖（例如 `Cookie`、`Host`、`Content-Length` 等，完整列表请参阅[此 MDN 页面](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_request_header)）。
如果为禁止的头提供了覆盖值，它将被忽略，并使用原始请求头。

要设置自定义 cookie，请使用 [`browserContext.addCookies()`](/api/class-browsercontext#browser-context-add-cookies)。
:::

**参数**

- <a id="route-continue-option-options"></a>`options` `Object` *(可选)*

  - <a id="route-continue-option-headers"></a>`headers` `Object<string, string>` *(可选)*

    如果设置，则更改请求 HTTP 头。头值将被转换为字符串。
  - <a id="route-continue-option-method"></a>`method` `string` *(可选)*

    如果设置，则更改请求方法（例如 GET 或 POST）。
  - <a id="route-continue-option-post-data"></a>`postData` `string | Buffer | Serializable` *(可选)*

    如果设置，则更改请求的 post data。
  - <a id="route-continue-option-url"></a>`url` `string` *(可选)*

    如果设置，则更改请求 URL。新 URL 必须与原 URL 使用相同的协议。


### route.fallback() {#route-fallback}

<Badge type="info" text="Added in: v1.23" /> <Badge type="tip" text="async" />

继续路由的请求，可选择覆盖某些参数。该方法与 [`route.continue()`](/api/class-route#route-continue) 类似，不同之处在于在发送请求之前会调用其他匹配的处理程序。

**用法**

当多个路由匹配给定模式时，它们按照与注册顺序相反的顺序运行。
这样，最后注册的路由可以始终覆盖所有之前的路由。在下面的示例中，
请求将首先由最底部的处理程序处理，然后回退到前一个处理程序，
最后被第一个注册的路由中止。

```js
await page.route('**/*', async route => {
  // 最后运行。
  await route.abort();
});
await page.route('**/*', async route => {
  // 第二个运行。
  await route.fallback();
});
await page.route('**/*', async route => {
  // 第一个运行。
  await route.fallback();
});
```

注册多个路由在你想要分离处理程序来处理不同类型的请求时很有用，例如 API 调用与页面资源，或如下例所示的 GET 请求与 POST 请求。

```js
// 处理 GET 请求。
await page.route('**/*', async route => {
  if (route.request().method() !== 'GET') {
    await route.fallback();
    return;
  }
  // 仅处理 GET。
  // ...
});

// 处理 POST 请求。
await page.route('**/*', async route => {
  if (route.request().method() !== 'POST') {
    await route.fallback();
    return;
  }
  // 仅处理 POST。
  // ...
});
```

还可以在回退到后续处理程序时修改请求，这样中间路由处理程序可以修改请求的 url、method、headers 和 postData。

```js
await page.route('**/*', async (route, request) => {
  // 覆盖头信息
  const headers = {
    ...request.headers(),
    foo: 'foo-value', // 设置 "foo" 头
    bar: undefined, // 移除 "bar" 头
  };
  await route.fallback({ headers });
});
```

使用 [`route.continue()`](/api/class-route#route-continue) 立即将请求发送到网络，在这种情况下不会调用其他匹配的处理程序。

**参数**

- <a id="route-fallback-option-options"></a>`options` `Object` *(可选)*

  - <a id="route-fallback-option-headers"></a>`headers` `Object<string, string>` *(可选)*

    如果设置，则更改请求 HTTP 头。头值将被转换为字符串。
  - <a id="route-fallback-option-method"></a>`method` `string` *(可选)*

    如果设置，则更改请求方法（例如 GET 或 POST）。
  - <a id="route-fallback-option-post-data"></a>`postData` `string | Buffer | Serializable` *(可选)*

    如果设置，则更改请求的 post data。
  - <a id="route-fallback-option-url"></a>`url` `string` *(可选)*

    如果设置，则更改请求 URL。新 URL 必须与原 URL 使用相同的协议。更改 URL 不会影响路由匹配，所有路由都使用原始请求 URL 进行匹配。


### route.fetch() {#route-fetch}

<Badge type="info" text="Added in: v1.29" /> <Badge type="tip" text="async" />

执行请求并获取结果但不完成请求，这样可以修改响应然后再完成。

**用法**

```js
await page.route('https://dog.ceo/api/breeds/list/all', async route => {
  const response = await route.fetch();
  const json = await response.json();
  json.message['big_red_dog'] = [];
  await route.fulfill({ response, json });
});
```

**详情**

请注意，[`headers`](/api/class-route#route-fetch-option-headers) 选项将应用于获取的请求以及它发起的任何重定向。如果你只想将 [`headers`](/api/class-route#route-fetch-option-headers) 应用于原始请求而不是重定向，请改用 [`route.continue()`](/api/class-route#route-continue)。

**参数**

- <a id="route-fetch-option-options"></a>`options` `Object` *(可选)*

  - <a id="route-fetch-option-headers"></a>`headers` `Object<string, string>` *(可选)*

    如果设置，则更改请求 HTTP 头。头值将被转换为字符串。
  - <a id="route-fetch-option-max-redirects"></a>`maxRedirects` `int` *(可选)* <Badge type="info" text="Added in: v1.31" />

    将自动跟随的最大请求重定向次数。如果超过此数量将抛出错误。
    默认为 `20`。传入 `0` 则不跟随重定向。
  - <a id="route-fetch-option-max-retries"></a>`maxRetries` `int` *(可选)* <Badge type="info" text="Added in: v1.46" />

    网络错误应重试的最大次数。目前仅重试 `ECONNRESET` 错误。不基于 HTTP 响应码重试。如果超过限制将抛出错误。默认为 `0` - 不重试。
  - <a id="route-fetch-option-method"></a>`method` `string` *(可选)*

    如果设置，则更改请求方法（例如 GET 或 POST）。
  - <a id="route-fetch-option-post-data"></a>`postData` `string | Buffer | Serializable` *(可选)*

    允许设置请求的 post data。如果 data 参数是对象，它将被序列化为 json 字符串，
    并且如果未显式设置，`content-type` 头将被设置为 `application/json`。否则，如果未显式设置，`content-type` 头将被设置为 `application/octet-stream`。
  - <a id="route-fetch-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。
    请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改超时；传入 `timeout: 0` 可完全禁用超时。
  - <a id="route-fetch-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.33" />

    请求超时（毫秒）。默认为 `30000`（30 秒）。传入 `0` 禁用超时。
  - <a id="route-fetch-option-url"></a>`url` `string` *(可选)*

    如果设置，则更改请求 URL。新 URL 必须与原 URL 使用相同的协议。

**返回值**

- `Promise<APIResponse>`


### route.fulfill() {#route-fulfill}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

使用给定的响应完成路由的请求。

**用法**

返回所有请求 404 响应的示例：

```js
await page.route('**/*', async route => {
  await route.fulfill({
    status: 404,
    contentType: 'text/plain',
    body: 'Not Found!'
  });
});
```

提供静态文件的示例：

```js
await page.route('**/xhr_endpoint', route => route.fulfill({ path: 'mock_data.json' }));
```

**参数**

- <a id="route-fulfill-option-options"></a>`options` `Object` *(可选)*

  - <a id="route-fulfill-option-body"></a>`body` `string | Buffer` *(可选)*

    响应体。
  - <a id="route-fulfill-option-content-type"></a>`contentType` `string` *(可选)*

    如果设置，等同于设置 `Content-Type` 响应头。
  - <a id="route-fulfill-option-headers"></a>`headers` `Object<string, string>` *(可选)*

    响应头。头值将被转换为字符串。
  - <a id="route-fulfill-option-json"></a>`json` `Serializable` *(可选)* <Badge type="info" text="Added in: v1.29" />

    JSON 响应。如果未设置，此方法会将 content type 设置为 `application/json`。
  - <a id="route-fulfill-option-path"></a>`path` `path` *(可选)*

    用于响应的文件路径。content type 将从文件扩展名推断。如果 `path` 是相对路径，则相对于当前工作目录解析。
  - <a id="route-fulfill-option-response"></a>`response` `APIResponse` *(可选)* <Badge type="info" text="Added in: v1.15" />

    用于完成路由请求的 [APIResponse](/api/class-apiresponse)。响应的各个字段（如 headers）可以使用 fulfill 选项覆盖。
  - <a id="route-fulfill-option-status"></a>`status` `int` *(可选)*

    响应状态码，默认为 `200`。


### route.request() {#route-request}

<Badge type="info" text="Added in: v1.8" />

要路由的请求。

**返回值**

- `Request`
