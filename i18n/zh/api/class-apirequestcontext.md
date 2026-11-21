---
title: APIRequestContext
outline: 2
---

# APIRequestContext

<Badge type="info" text="Added in: v1.16" />

此 API 用于 Web API 测试。你可以使用它来触发 API 端点、配置微服务、为端到端测试准备环境或服务。

每个 Playwright 浏览器上下文都有一个关联的 [APIRequestContext](/api/class-apirequestcontext)，可以通过
[`browserContext.request`](/api/class-browsercontext#browser-context-request) 或 [`page.request`](/api/class-page#page-request) 访问（它们返回

**同一个实例** — `page.request` 是 `page.context().request` 的快捷方式）。
你也可以使用 [`apiRequest.newContext()`](/api/class-apirequest#api-request-new-context) 创建一个独立的隔离实例。

**Cookie 管理**

[`browserContext.request`](/api/class-browsercontext#browser-context-request) 和

[`page.request`](/api/class-page#page-request) 返回的 [APIRequestContext](/api/class-apirequestcontext) 与其 [BrowserContext](/api/class-browsercontext) 使用相同的 cookie jar：

如果你希望 API 请求**不**与浏览器共享 cookie，请通过 [`apiRequest.newContext()`](/api/class-apirequest#api-request-new-context) 创建一个隔离的上下文。这样的 `APIRequestContext` 对象将拥有自己独立的 cookie 存储。

## 方法

### apiRequestContext.addCookies() {#api-request-context-add-cookies}

<Badge type="info" text="Added in: v1.64" /> <Badge type="tip" text="async" />

向此请求上下文添加 cookie。它们将随匹配的后续请求一起发送。对于 [`browserContext.request`](/api/class-browsercontext#browser-context-request)
和 [`page.request`](/api/class-page#page-request)，这等同于在相应的浏览器上下文上调用 [`browserContext.addCookies()`](/api/class-browsercontext#browser-context-add-cookies)。

**用法**

```js
await request.addCookies([cookieObject1, cookieObject2]);
```

**参数**

- <a id="api-request-context-add-cookies-option-cookies"></a>`cookies` `Array<Object>`

  - `name` `string`
  - `value` `string`
  - `url` `string` *(可选)*

    需要 `url` 或同时提供 `domain` 和 `path`。可选。
  - `domain` `string` *(可选)*

    要使 cookie 也应用于所有子域，请在域名前加上点号，例如：".example.com"。需要 `url` 或同时提供 `domain` 和 `path`。可选。
  - `path` `string` *(可选)*

    需要 `url` 或同时提供 `domain` 和 `path`。可选。
  - `expires` `float` *(可选)*

    Unix 时间戳（秒）。可选。
  - `httpOnly` `boolean` *(可选)*

    可选。
  - `secure` `boolean` *(可选)*

    可选。
  - `sameSite` `"Strict" | "Lax" | "None"` *(可选)*

    可选。
  - `partitionKey` `string` *(可选)*

    用于分区第三方 cookie（又称 [CHIPS](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies)）的分区键。可选。


### apiRequestContext.clearCookies() {#api-request-context-clear-cookies}

<Badge type="info" text="Added in: v1.64" /> <Badge type="tip" text="async" />

从此请求上下文中移除 cookie。接受可选的过滤器。对于 [`browserContext.request`](/api/class-browsercontext#browser-context-request)
和 [`page.request`](/api/class-page#page-request)，这等同于在相应的浏览器上下文上调用 [`browserContext.clearCookies()`](/api/class-browsercontext#browser-context-clear-cookies)。

**用法**

```js
await request.clearCookies();
await request.clearCookies({ name: 'session-id' });
await request.clearCookies({ domain: 'my-origin.com' });
await request.clearCookies({ domain: /.*my-origin\.com/ });
await request.clearCookies({ path: '/api/v1' });
await request.clearCookies({ name: 'session-id', domain: 'my-origin.com' });
```

**参数**

- <a id="api-request-context-clear-cookies-option-options"></a>`options` `Object` *(可选)*

  - <a id="api-request-context-clear-cookies-option-domain"></a>`domain` `string | RegExp` *(可选)*

    仅移除具有给定域的 cookie。
  - <a id="api-request-context-clear-cookies-option-name"></a>`name` `string | RegExp` *(可选)*

    仅移除具有给定名称的 cookie。
  - <a id="api-request-context-clear-cookies-option-path"></a>`path` `string | RegExp` *(可选)*

    仅移除具有给定路径的 cookie。


### apiRequestContext.cookies() {#api-request-context-cookies}

<Badge type="info" text="Added in: v1.64" /> <Badge type="tip" text="async" />

如果未指定 URL，此方法返回所有 cookie。如果指定了 URL，则只返回影响这些 URL 的 cookie。对于 [`browserContext.request`](/api/class-browsercontext#browser-context-request) 和 [`page.request`](/api/class-page#page-request)，这等同于在相应的浏览器上下文上调用
[`browserContext.cookies()`](/api/class-browsercontext#browser-context-cookies)。

**参数**

- <a id="api-request-context-cookies-option-urls"></a>`urls` `string | Array<string>` *(可选)*

  可选的 URL 列表。

**返回值**

- `Promise<Array<Object>>`


### apiRequestContext.delete() {#api-request-context-delete}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

发送 HTTP(S) [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE) 请求并返回其响应。
该方法会从上下文填充请求 cookie，并从响应更新上下文 cookie。该方法会自动跟随重定向。

**参数**

- <a id="api-request-context-delete-option-url"></a>`url` `string`

  目标 URL。
- <a id="api-request-context-delete-option-options"></a>`options` `Object` *(可选)*

  - <a id="api-request-context-delete-option-data"></a>`data` `string | Buffer | Serializable` *(可选)* <Badge type="info" text="Added in: v1.17" />

    允许设置请求的 post data。如果 data 参数是 [Buffer] 以外的对象，它将被序列化为 JSON，
    并且如果未显式设置，`content-type` 头将被设置为 `application/json`。

    如果 data 参数是字符串且显式设置的 `content-type` 是 `application/json`（不区分大小写，
    可带可选参数如 `charset=utf-8`），如果字符串可以解析为 JSON，则按原样发送。
    否则，它将被 JSON 编码为字符串，包括引号和转义。其他 content type 的字符串
    按原样发送。

    传入 [Buffer]（如 `Buffer.from(body, 'utf8')`）可发送精确的字节而无需 JSON 编码，
    例如发送故意格式错误的 JSON 或用于计算签名的请求体。
    对于字符串和 buffer，如果未显式设置，`content-type` 头默认为 `application/octet-stream`。
  - <a id="api-request-context-delete-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(可选)*

    是否在响应码不是 2xx 和 3xx 时抛出异常。默认情况下，对所有状态码都返回响应对象。
  - <a id="api-request-context-delete-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(可选)* <Badge type="info" text="Added in: v1.17" />

    提供一个对象，该对象将使用 `application/x-www-form-urlencoded` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `application/x-www-form-urlencoded`。
  - <a id="api-request-context-delete-option-headers"></a>`headers` `Object<string, string>` *(可选)*

    允许设置 HTTP 头。这些头将应用于获取的请求以及它发起的任何重定向。
  - <a id="api-request-context-delete-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="api-request-context-delete-option-max-redirects"></a>`maxRedirects` `int` *(可选)* <Badge type="info" text="Added in: v1.26" />

    将自动跟随的最大请求重定向次数。如果超过此数量将抛出错误。
    默认为 `20`。传入 `0` 则不跟随重定向。
  - <a id="api-request-context-delete-option-max-retries"></a>`maxRetries` `int` *(可选)* <Badge type="info" text="Added in: v1.46" />

    网络错误应重试的最大次数。目前仅重试 `ECONNRESET` 错误。不基于 HTTP 响应码重试。如果超过限制将抛出错误。默认为 `0` - 不重试。
  - <a id="api-request-context-delete-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(可选)* <Badge type="info" text="Added in: v1.17" />

    提供一个对象，该对象将使用 `multipart/form-data` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `multipart/form-data`。文件值可以作为 [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream) 传递，或作为包含文件名、mime 类型及其内容的类文件对象传递。

    - `name` `string` <Badge type="info" text="Added in: v1.17" />

      文件名
    - `mimeType` `string` <Badge type="info" text="Added in: v1.17" />

      文件类型
    - `buffer` `Buffer` <Badge type="info" text="Added in: v1.17" />

      文件内容
  - <a id="api-request-context-delete-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(可选)*

    随 URL 一起发送的查询参数。
  - <a id="api-request-context-delete-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。
    请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改超时；传入 `timeout: 0` 可完全禁用超时。
  - <a id="api-request-context-delete-option-timeout"></a>`timeout` `float` *(可选)*

    请求超时（毫秒）。默认为 `30000`（30 秒）。传入 `0` 禁用超时。

**返回值**

- `Promise<APIResponse>`


### apiRequestContext.dispose() {#api-request-context-dispose}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

[`apiRequestContext.get()`](/api/class-apirequestcontext#api-request-context-get) 和类似方法返回的所有响应都存储在内存中，以便你稍后可以调用 [`apiResponse.body()`](/api/class-apiresponse#api-response-body)。此方法释放所有资源，在已释放的 [APIRequestContext](/api/class-apirequestcontext) 上调用任何方法都会抛出异常。

**参数**

- <a id="api-request-context-dispose-option-options"></a>`options` `Object` *(可选)*

  - <a id="api-request-context-dispose-option-reason"></a>`reason` `string` *(可选)* <Badge type="info" text="Added in: v1.45" />

    向被上下文释放中断的操作报告的原因。


### apiRequestContext.fetch() {#api-request-context-fetch}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

发送 HTTP(S) 请求并返回其响应。该方法会从上下文填充请求 cookie，并从响应更新上下文 cookie。该方法会自动跟随重定向。

**用法**

JSON 对象可以直接传递给请求：

```js
await request.fetch('https://example.com/api/createBook', {
  method: 'post',
  data: {
    title: 'Book Title',
    author: 'John Doe',
  }
});
```

在请求体中发送文件的常见方式是使用 `multipart/form-data` 编码将它们作为表单字段上传，通过指定 `multipart` 参数：

```js
const form = new FormData();
form.set('name', 'John');
form.append('name', 'Doe');
// 发送两个同名的文件字段。
form.append('file', new File(['console.log(2024);'], 'f1.js', { type: 'text/javascript' }));
form.append('file', new File(['hello'], 'f2.txt', { type: 'text/plain' }));
await request.fetch('https://example.com/api/uploadForm', {
  multipart: form
});
```

**参数**

- <a id="api-request-context-fetch-option-url-or-request"></a>`urlOrRequest` `string | Request`

  目标 URL 或从中获取所有参数的 Request。
- <a id="api-request-context-fetch-option-options"></a>`options` `Object` *(可选)*

  - <a id="api-request-context-fetch-option-data"></a>`data` `string | Buffer | Serializable` *(可选)*

    允许设置请求的 post data。如果 data 参数是 [Buffer] 以外的对象，它将被序列化为 JSON，
    并且如果未显式设置，`content-type` 头将被设置为 `application/json`。

    如果 data 参数是字符串且显式设置的 `content-type` 是 `application/json`（不区分大小写，
    可带可选参数如 `charset=utf-8`），如果字符串可以解析为 JSON，则按原样发送。
    否则，它将被 JSON 编码为字符串，包括引号和转义。其他 content type 的字符串
    按原样发送。

    传入 [Buffer]（如 `Buffer.from(body, 'utf8')`）可发送精确的字节而无需 JSON 编码，
    例如发送故意格式错误的 JSON 或用于计算签名的请求体。
    对于字符串和 buffer，如果未显式设置，`content-type` 头默认为 `application/octet-stream`。
  - <a id="api-request-context-fetch-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(可选)*

    是否在响应码不是 2xx 和 3xx 时抛出异常。默认情况下，对所有状态码都返回响应对象。
  - <a id="api-request-context-fetch-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(可选)*

    提供一个对象，该对象将使用 `application/x-www-form-urlencoded` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `application/x-www-form-urlencoded`。
  - <a id="api-request-context-fetch-option-headers"></a>`headers` `Object<string, string>` *(可选)*

    允许设置 HTTP 头。这些头将应用于获取的请求以及它发起的任何重定向。
  - <a id="api-request-context-fetch-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="api-request-context-fetch-option-max-redirects"></a>`maxRedirects` `int` *(可选)* <Badge type="info" text="Added in: v1.26" />

    将自动跟随的最大请求重定向次数。如果超过此数量将抛出错误。
    默认为 `20`。传入 `0` 则不跟随重定向。
  - <a id="api-request-context-fetch-option-max-retries"></a>`maxRetries` `int` *(可选)* <Badge type="info" text="Added in: v1.46" />

    网络错误应重试的最大次数。目前仅重试 `ECONNRESET` 错误。不基于 HTTP 响应码重试。如果超过限制将抛出错误。默认为 `0` - 不重试。
  - <a id="api-request-context-fetch-option-method"></a>`method` `string` *(可选)*

    如果设置，则更改 fetch 方法（例如 [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) 或
    [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)）。如果未指定，使用 GET 方法。
  - <a id="api-request-context-fetch-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(可选)*

    提供一个对象，该对象将使用 `multipart/form-data` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `multipart/form-data`。文件值可以作为 [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream) 传递，或作为包含文件名、mime 类型及其内容的类文件对象传递。

    - `name` `string`

      文件名
    - `mimeType` `string`

      文件类型
    - `buffer` `Buffer`

      文件内容
  - <a id="api-request-context-fetch-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(可选)*

    随 URL 一起发送的查询参数。
  - <a id="api-request-context-fetch-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。
    请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改超时；传入 `timeout: 0` 可完全禁用超时。
  - <a id="api-request-context-fetch-option-timeout"></a>`timeout` `float` *(可选)*

    请求超时（毫秒）。默认为 `30000`（30 秒）。传入 `0` 禁用超时。

**返回值**

- `Promise<APIResponse>`


### apiRequestContext.get() {#api-request-context-get}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

发送 HTTP(S) [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) 请求并返回其响应。
该方法会从上下文填充请求 cookie，并从响应更新上下文 cookie。该方法会自动跟随重定向。

**用法**

可以使用 `params` 选项配置请求参数，它们将被序列化到 URL 搜索参数中：

```js
// 将 params 作为对象传递
await request.get('https://example.com/api/getText', {
  params: {
    'isbn': '1234',
    'page': 23,
  }
});

// 将 params 作为 URLSearchParams 传递
const searchParams = new URLSearchParams();
searchParams.set('isbn', '1234');
searchParams.append('page', 23);
searchParams.append('page', 24);
await request.get('https://example.com/api/getText', { params: searchParams });

// 将 params 作为字符串传递
const queryString = 'isbn=1234&page=23&page=24';
await request.get('https://example.com/api/getText', { params: queryString });
```

**参数**

- <a id="api-request-context-get-option-url"></a>`url` `string`

  目标 URL。
- <a id="api-request-context-get-option-options"></a>`options` `Object` *(可选)*

  - <a id="api-request-context-get-option-data"></a>`data` `string | Buffer | Serializable` *(可选)* <Badge type="info" text="Added in: v1.26" />

    允许设置请求的 post data。如果 data 参数是 [Buffer] 以外的对象，它将被序列化为 JSON，
    并且如果未显式设置，`content-type` 头将被设置为 `application/json`。

    如果 data 参数是字符串且显式设置的 `content-type` 是 `application/json`（不区分大小写，
    可带可选参数如 `charset=utf-8`），如果字符串可以解析为 JSON，则按原样发送。
    否则，它将被 JSON 编码为字符串，包括引号和转义。其他 content type 的字符串
    按原样发送。

    传入 [Buffer]（如 `Buffer.from(body, 'utf8')`）可发送精确的字节而无需 JSON 编码，
    例如发送故意格式错误的 JSON 或用于计算签名的请求体。
    对于字符串和 buffer，如果未显式设置，`content-type` 头默认为 `application/octet-stream`。
  - <a id="api-request-context-get-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(可选)*

    是否在响应码不是 2xx 和 3xx 时抛出异常。默认情况下，对所有状态码都返回响应对象。
  - <a id="api-request-context-get-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(可选)* <Badge type="info" text="Added in: v1.26" />

    提供一个对象，该对象将使用 `application/x-www-form-urlencoded` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `application/x-www-form-urlencoded`。
  - <a id="api-request-context-get-option-headers"></a>`headers` `Object<string, string>` *(可选)*

    允许设置 HTTP 头。这些头将应用于获取的请求以及它发起的任何重定向。
  - <a id="api-request-context-get-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="api-request-context-get-option-max-redirects"></a>`maxRedirects` `int` *(可选)* <Badge type="info" text="Added in: v1.26" />

    将自动跟随的最大请求重定向次数。如果超过此数量将抛出错误。
    默认为 `20`。传入 `0` 则不跟随重定向。
  - <a id="api-request-context-get-option-max-retries"></a>`maxRetries` `int` *(可选)* <Badge type="info" text="Added in: v1.46" />

    网络错误应重试的最大次数。目前仅重试 `ECONNRESET` 错误。不基于 HTTP 响应码重试。如果超过限制将抛出错误。默认为 `0` - 不重试。
  - <a id="api-request-context-get-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(可选)* <Badge type="info" text="Added in: v1.26" />

    提供一个对象，该对象将使用 `multipart/form-data` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `multipart/form-data`。文件值可以作为 [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream) 传递，或作为包含文件名、mime 类型及其内容的类文件对象传递。

    - `name` `string` <Badge type="info" text="Added in: v1.26" />

      文件名
    - `mimeType` `string` <Badge type="info" text="Added in: v1.26" />

      文件类型
    - `buffer` `Buffer` <Badge type="info" text="Added in: v1.26" />

      文件内容
  - <a id="api-request-context-get-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(可选)*

    随 URL 一起发送的查询参数。
  - <a id="api-request-context-get-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。
    请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改超时；传入 `timeout: 0` 可完全禁用超时。
  - <a id="api-request-context-get-option-timeout"></a>`timeout` `float` *(可选)*

    请求超时（毫秒）。默认为 `30000`（30 秒）。传入 `0` 禁用超时。

**返回值**

- `Promise<APIResponse>`


### apiRequestContext.head() {#api-request-context-head}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

发送 HTTP(S) [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD) 请求并返回其响应。
该方法会从上下文填充请求 cookie，并从响应更新上下文 cookie。该方法会自动跟随重定向。

**参数**

- <a id="api-request-context-head-option-url"></a>`url` `string`

  目标 URL。
- <a id="api-request-context-head-option-options"></a>`options` `Object` *(可选)*

  - <a id="api-request-context-head-option-data"></a>`data` `string | Buffer | Serializable` *(可选)* <Badge type="info" text="Added in: v1.26" />

    允许设置请求的 post data。如果 data 参数是 [Buffer] 以外的对象，它将被序列化为 JSON，
    并且如果未显式设置，`content-type` 头将被设置为 `application/json`。

    如果 data 参数是字符串且显式设置的 `content-type` 是 `application/json`（不区分大小写，
    可带可选参数如 `charset=utf-8`），如果字符串可以解析为 JSON，则按原样发送。
    否则，它将被 JSON 编码为字符串，包括引号和转义。其他 content type 的字符串
    按原样发送。

    传入 [Buffer]（如 `Buffer.from(body, 'utf8')`）可发送精确的字节而无需 JSON 编码，
    例如发送故意格式错误的 JSON 或用于计算签名的请求体。
    对于字符串和 buffer，如果未显式设置，`content-type` 头默认为 `application/octet-stream`。
  - <a id="api-request-context-head-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(可选)*

    是否在响应码不是 2xx 和 3xx 时抛出异常。默认情况下，对所有状态码都返回响应对象。
  - <a id="api-request-context-head-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(可选)* <Badge type="info" text="Added in: v1.26" />

    提供一个对象，该对象将使用 `application/x-www-form-urlencoded` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `application/x-www-form-urlencoded`。
  - <a id="api-request-context-head-option-headers"></a>`headers` `Object<string, string>` *(可选)*

    允许设置 HTTP 头。这些头将应用于获取的请求以及它发起的任何重定向。
  - <a id="api-request-context-head-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="api-request-context-head-option-max-redirects"></a>`maxRedirects` `int` *(可选)* <Badge type="info" text="Added in: v1.26" />

    将自动跟随的最大请求重定向次数。如果超过此数量将抛出错误。
    默认为 `20`。传入 `0` 则不跟随重定向。
  - <a id="api-request-context-head-option-max-retries"></a>`maxRetries` `int` *(可选)* <Badge type="info" text="Added in: v1.46" />

    网络错误应重试的最大次数。目前仅重试 `ECONNRESET` 错误。不基于 HTTP 响应码重试。如果超过限制将抛出错误。默认为 `0` - 不重试。
  - <a id="api-request-context-head-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(可选)* <Badge type="info" text="Added in: v1.26" />

    提供一个对象，该对象将使用 `multipart/form-data` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `multipart/form-data`。文件值可以作为 [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream) 传递，或作为包含文件名、mime 类型及其内容的类文件对象传递。

    - `name` `string` <Badge type="info" text="Added in: v1.26" />

      文件名
    - `mimeType` `string` <Badge type="info" text="Added in: v1.26" />

      文件类型
    - `buffer` `Buffer` <Badge type="info" text="Added in: v1.26" />

      文件内容
  - <a id="api-request-context-head-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(可选)*

    随 URL 一起发送的查询参数。
  - <a id="api-request-context-head-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。
    请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改超时；传入 `timeout: 0` 可完全禁用超时。
  - <a id="api-request-context-head-option-timeout"></a>`timeout` `float` *(可选)*

    请求超时（毫秒）。默认为 `30000`（30 秒）。传入 `0` 禁用超时。

**返回值**

- `Promise<APIResponse>`


### apiRequestContext.patch() {#api-request-context-patch}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

发送 HTTP(S) [PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH) 请求并返回其响应。
该方法会从上下文填充请求 cookie，并从响应更新上下文 cookie。该方法会自动跟随重定向。

**参数**

- <a id="api-request-context-patch-option-url"></a>`url` `string`

  目标 URL。
- <a id="api-request-context-patch-option-options"></a>`options` `Object` *(可选)*

  - <a id="api-request-context-patch-option-data"></a>`data` `string | Buffer | Serializable` *(可选)*

    允许设置请求的 post data。如果 data 参数是 [Buffer] 以外的对象，它将被序列化为 JSON，
    并且如果未显式设置，`content-type` 头将被设置为 `application/json`。

    如果 data 参数是字符串且显式设置的 `content-type` 是 `application/json`（不区分大小写，
    可带可选参数如 `charset=utf-8`），如果字符串可以解析为 JSON，则按原样发送。
    否则，它将被 JSON 编码为字符串，包括引号和转义。其他 content type 的字符串
    按原样发送。

    传入 [Buffer]（如 `Buffer.from(body, 'utf8')`）可发送精确的字节而无需 JSON 编码，
    例如发送故意格式错误的 JSON 或用于计算签名的请求体。
    对于字符串和 buffer，如果未显式设置，`content-type` 头默认为 `application/octet-stream`。
  - <a id="api-request-context-patch-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(可选)*

    是否在响应码不是 2xx 和 3xx 时抛出异常。默认情况下，对所有状态码都返回响应对象。
  - <a id="api-request-context-patch-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(可选)*

    提供一个对象，该对象将使用 `application/x-www-form-urlencoded` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `application/x-www-form-urlencoded`。
  - <a id="api-request-context-patch-option-headers"></a>`headers` `Object<string, string>` *(可选)*

    允许设置 HTTP 头。这些头将应用于获取的请求以及它发起的任何重定向。
  - <a id="api-request-context-patch-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="api-request-context-patch-option-max-redirects"></a>`maxRedirects` `int` *(可选)* <Badge type="info" text="Added in: v1.26" />

    将自动跟随的最大请求重定向次数。如果超过此数量将抛出错误。
    默认为 `20`。传入 `0` 则不跟随重定向。
  - <a id="api-request-context-patch-option-max-retries"></a>`maxRetries` `int` *(可选)* <Badge type="info" text="Added in: v1.46" />

    网络错误应重试的最大次数。目前仅重试 `ECONNRESET` 错误。不基于 HTTP 响应码重试。如果超过限制将抛出错误。默认为 `0` - 不重试。
  - <a id="api-request-context-patch-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(可选)*

    提供一个对象，该对象将使用 `multipart/form-data` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `multipart/form-data`。文件值可以作为 [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream) 传递，或作为包含文件名、mime 类型及其内容的类文件对象传递。

    - `name` `string`

      文件名
    - `mimeType` `string`

      文件类型
    - `buffer` `Buffer`

      文件内容
  - <a id="api-request-context-patch-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(可选)*

    随 URL 一起发送的查询参数。
  - <a id="api-request-context-patch-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。
    请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改超时；传入 `timeout: 0` 可完全禁用超时。
  - <a id="api-request-context-patch-option-timeout"></a>`timeout` `float` *(可选)*

    请求超时（毫秒）。默认为 `30000`（30 秒）。传入 `0` 禁用超时。

**返回值**

- `Promise<APIResponse>`


### apiRequestContext.post() {#api-request-context-post}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

发送 HTTP(S) [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) 请求并返回其响应。
该方法会从上下文填充请求 cookie，并从响应更新上下文 cookie。该方法会自动跟随重定向。

**用法**

JSON 对象可以直接传递给请求：

```js
await request.post('https://example.com/api/createBook', {
  data: {
    title: 'Book Title',
    author: 'John Doe',
  }
});
```

要向服务器发送表单数据，请使用 `form` 选项。其值将使用 `application/x-www-form-urlencoded` 编码编码到请求体中（参见下面如何使用 `multipart/form-data` 表单编码发送文件）：

```js
await request.post('https://example.com/api/findBook', {
  form: {
    title: 'Book Title',
    author: 'John Doe',
  }
});
```

在请求体中发送文件的常见方式是使用 `multipart/form-data` 编码将它们作为表单字段上传。使用 [FormData] 构造请求体并将其作为 `multipart` 参数传递给请求：

```js
const form = new FormData();
form.set('name', 'John');
form.append('name', 'Doe');
// 发送两个同名的文件字段。
form.append('file', new File(['console.log(2024);'], 'f1.js', { type: 'text/javascript' }));
form.append('file', new File(['hello'], 'f2.txt', { type: 'text/plain' }));
await request.post('https://example.com/api/uploadForm', {
  multipart: form
});
```

**参数**

- <a id="api-request-context-post-option-url"></a>`url` `string`

  目标 URL。
- <a id="api-request-context-post-option-options"></a>`options` `Object` *(可选)*

  - <a id="api-request-context-post-option-data"></a>`data` `string | Buffer | Serializable` *(可选)*

    允许设置请求的 post data。如果 data 参数是 [Buffer] 以外的对象，它将被序列化为 JSON，
    并且如果未显式设置，`content-type` 头将被设置为 `application/json`。

    如果 data 参数是字符串且显式设置的 `content-type` 是 `application/json`（不区分大小写，
    可带可选参数如 `charset=utf-8`），如果字符串可以解析为 JSON，则按原样发送。
    否则，它将被 JSON 编码为字符串，包括引号和转义。其他 content type 的字符串
    按原样发送。

    传入 [Buffer]（如 `Buffer.from(body, 'utf8')`）可发送精确的字节而无需 JSON 编码，
    例如发送故意格式错误的 JSON 或用于计算签名的请求体。
    对于字符串和 buffer，如果未显式设置，`content-type` 头默认为 `application/octet-stream`。
  - <a id="api-request-context-post-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(可选)*

    是否在响应码不是 2xx 和 3xx 时抛出异常。默认情况下，对所有状态码都返回响应对象。
  - <a id="api-request-context-post-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(可选)*

    提供一个对象，该对象将使用 `application/x-www-form-urlencoded` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `application/x-www-form-urlencoded`。
  - <a id="api-request-context-post-option-headers"></a>`headers` `Object<string, string>` *(可选)*

    允许设置 HTTP 头。这些头将应用于获取的请求以及它发起的任何重定向。
  - <a id="api-request-context-post-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="api-request-context-post-option-max-redirects"></a>`maxRedirects` `int` *(可选)* <Badge type="info" text="Added in: v1.26" />

    将自动跟随的最大请求重定向次数。如果超过此数量将抛出错误。
    默认为 `20`。传入 `0` 则不跟随重定向。
  - <a id="api-request-context-post-option-max-retries"></a>`maxRetries` `int` *(可选)* <Badge type="info" text="Added in: v1.46" />

    网络错误应重试的最大次数。目前仅重试 `ECONNRESET` 错误。不基于 HTTP 响应码重试。如果超过限制将抛出错误。默认为 `0` - 不重试。
  - <a id="api-request-context-post-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(可选)*

    提供一个对象，该对象将使用 `multipart/form-data` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `multipart/form-data`。文件值可以作为 [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream) 传递，或作为包含文件名、mime 类型及其内容的类文件对象传递。

    - `name` `string`

      文件名
    - `mimeType` `string`

      文件类型
    - `buffer` `Buffer`

      文件内容
  - <a id="api-request-context-post-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(可选)*

    随 URL 一起发送的查询参数。
  - <a id="api-request-context-post-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。
    请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改超时；传入 `timeout: 0` 可完全禁用超时。
  - <a id="api-request-context-post-option-timeout"></a>`timeout` `float` *(可选)*

    请求超时（毫秒）。默认为 `30000`（30 秒）。传入 `0` 禁用超时。

**返回值**

- `Promise<APIResponse>`


### apiRequestContext.put() {#api-request-context-put}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

发送 HTTP(S) [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) 请求并返回其响应。
该方法会从上下文填充请求 cookie，并从响应更新上下文 cookie。该方法会自动跟随重定向。

**参数**

- <a id="api-request-context-put-option-url"></a>`url` `string`

  目标 URL。
- <a id="api-request-context-put-option-options"></a>`options` `Object` *(可选)*

  - <a id="api-request-context-put-option-data"></a>`data` `string | Buffer | Serializable` *(可选)*

    允许设置请求的 post data。如果 data 参数是 [Buffer] 以外的对象，它将被序列化为 JSON，
    并且如果未显式设置，`content-type` 头将被设置为 `application/json`。

    如果 data 参数是字符串且显式设置的 `content-type` 是 `application/json`（不区分大小写，
    可带可选参数如 `charset=utf-8`），如果字符串可以解析为 JSON，则按原样发送。
    否则，它将被 JSON 编码为字符串，包括引号和转义。其他 content type 的字符串
    按原样发送。

    传入 [Buffer]（如 `Buffer.from(body, 'utf8')`）可发送精确的字节而无需 JSON 编码，
    例如发送故意格式错误的 JSON 或用于计算签名的请求体。
    对于字符串和 buffer，如果未显式设置，`content-type` 头默认为 `application/octet-stream`。
  - <a id="api-request-context-put-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(可选)*

    是否在响应码不是 2xx 和 3xx 时抛出异常。默认情况下，对所有状态码都返回响应对象。
  - <a id="api-request-context-put-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(可选)*

    提供一个对象，该对象将使用 `application/x-www-form-urlencoded` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `application/x-www-form-urlencoded`。
  - <a id="api-request-context-put-option-headers"></a>`headers` `Object<string, string>` *(可选)*

    允许设置 HTTP 头。这些头将应用于获取的请求以及它发起的任何重定向。
  - <a id="api-request-context-put-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="api-request-context-put-option-max-redirects"></a>`maxRedirects` `int` *(可选)* <Badge type="info" text="Added in: v1.26" />

    将自动跟随的最大请求重定向次数。如果超过此数量将抛出错误。
    默认为 `20`。传入 `0` 则不跟随重定向。
  - <a id="api-request-context-put-option-max-retries"></a>`maxRetries` `int` *(可选)* <Badge type="info" text="Added in: v1.46" />

    网络错误应重试的最大次数。目前仅重试 `ECONNRESET` 错误。不基于 HTTP 响应码重试。如果超过限制将抛出错误。默认为 `0` - 不重试。
  - <a id="api-request-context-put-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(可选)*

    提供一个对象，该对象将使用 `multipart/form-data` 编码序列化为 html 表单并作为此请求体发送。如果指定了此参数，除非显式提供，否则 `content-type` 头将被设置为 `multipart/form-data`。文件值可以作为 [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream) 传递，或作为包含文件名、mime 类型及其内容的类文件对象传递。

    - `name` `string`

      文件名
    - `mimeType` `string`

      文件类型
    - `buffer` `Buffer`

      文件内容
  - <a id="api-request-context-put-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(可选)*

    随 URL 一起发送的查询参数。
  - <a id="api-request-context-put-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。
    请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改超时；传入 `timeout: 0` 可完全禁用超时。
  - <a id="api-request-context-put-option-timeout"></a>`timeout` `float` *(可选)*

    请求超时（毫秒）。默认为 `30000`（30 秒）。传入 `0` 禁用超时。

**返回值**

- `Promise<APIResponse>`


### apiRequestContext.storageState() {#api-request-context-storage-state}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

返回此请求上下文的存储状态，包含当前 cookie 和本地存储快照（如果传递给构造函数）。

**参数**

- <a id="api-request-context-storage-state-option-options"></a>`options` `Object` *(可选)*

  - <a id="api-request-context-storage-state-option-indexed-db"></a>`indexedDB` `boolean` *(可选)* <Badge type="info" text="Added in: v1.51" />

    设置为 `true` 以在存储状态快照中包含 IndexedDB。
  - <a id="api-request-context-storage-state-option-opfs"></a>`opfs` `boolean` *(可选)* <Badge type="info" text="Added in: v1.63" />

    设置为 `true` 以在存储状态快照中包含源私有文件系统。
  - <a id="api-request-context-storage-state-option-path"></a>`path` `path` *(可选)*

    保存存储状态的文件路径。如果 [`path`](/api/class-apirequestcontext#api-request-context-storage-state-option-path) 是相对路径，则相对于当前工作目录解析。如果未提供路径，仍会返回存储状态，但不会保存到磁盘。

**返回值**

- `Promise<Object>`


## 属性

### apiRequestContext.tracing {#api-request-context-tracing}

<Badge type="info" text="Added in: v1.60" />

通过此 API 请求上下文发出的请求的追踪记录器。

**类型**

- `Tracing`
