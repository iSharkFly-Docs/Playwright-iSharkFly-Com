---
title: Request
outline: 2
---

# Request

<Badge type="info" text="Added in: v1.8" />

每当页面发送网络资源请求时，[Page](/api/class-page) 会按以下顺序触发事件：
* [`page.on('request')`](/api/class-page#page-event-request) 在页面发起请求时触发。
* [`page.on('response')`](/api/class-page#page-event-response) 在收到请求的响应状态和头信息时触发。
* [`page.on('requestFinished')`](/api/class-page#page-event-request-finished) 在响应体下载完成且请求结束时触发。

如果请求在某个阶段失败，则会触发 [`page.on('requestFailed')`](/api/class-page#page-event-request-failed) 事件，而不是 `'requestfinished'` 事件（也可能不触发 'response' 事件）。

::: info
HTTP 错误响应（如 404 或 503）从 HTTP 角度来看仍然是成功的响应，因此请求会以 `'requestfinished'` 事件完成。
:::

如果请求收到重定向响应，则请求会以 `requestfinished` 事件成功完成，并向重定向的 URL 发起新请求。

## 方法

### request.allHeaders() {#request-all-headers}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

返回一个包含此请求所有 HTTP 请求头的对象。头名称为小写。

**返回值**

- `Promise<Object<string, string>>`


### request.existingResponse() {#request-existing-response}

<Badge type="info" text="Added in: v1.59" />

如果已收到响应则返回 [Response](/api/class-response) 对象，否则返回 `null`。

与 [`request.response()`](/api/class-request#request-response) 不同，此方法不会等待响应到达。如果已收到响应，它会立即返回响应对象；如果尚未收到响应，则返回 `null`。

**返回值**

- `null | Response`


### request.failure() {#request-failure}

<Badge type="info" text="Added in: v1.8" />

除非此请求失败（由 `requestfailed` 事件报告），否则该方法返回 `null`。

**用法**

记录所有失败请求的示例：

```js
page.on('requestfailed', request => {
  console.log(request.url() + ' ' + request.failure().errorText);
});
```

**返回值**

- `null | Object`


### request.frame() {#request-frame}

<Badge type="info" text="Added in: v1.8" />

返回发起此请求的 [Frame](/api/class-frame)。

**用法**

```js
const frameUrl = request.frame().url();
```

**详情**

请注意，在某些情况下 frame 不可用，此方法会抛出异常。
* 当请求源自 Service Worker 时。你可以使用 `request.serviceWorker()` 来检查这种情况。
* 当导航请求在对应的 frame 创建之前发起时。你可以使用 [`request.isNavigationRequest()`](/api/class-request#request-is-navigation-request) 来检查这种情况。

以下示例处理了所有情况：

```js
if (request.serviceWorker())
  console.log(`请求 ${request.url()} 来自 service worker`);
else if (request.isNavigationRequest())
  console.log(`请求 ${request.url()} 是一个导航请求`);
else
  console.log(`请求 ${request.url()} 来自 frame ${request.frame().url()}`);
```

**返回值**

- `Frame`


### request.headers() {#request-headers}

<Badge type="info" text="Added in: v1.8" />

返回一个包含请求 HTTP 头的对象。头名称为小写。
请注意，此方法不返回与安全相关的头，包括与 cookie 相关的头。
你可以使用 [`request.allHeaders()`](/api/class-request#request-all-headers) 获取包含 `cookie` 信息的完整头列表。

**返回值**

- `Object<string, string>`


### request.headersArray() {#request-headers-array}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

返回一个包含此请求所有 HTTP 请求头的数组。与 [`request.allHeaders()`](/api/class-request#request-all-headers) 不同，头名称不会转换为小写。
具有多个条目的头（如 `Set-Cookie`）会在数组中出现多次。

**返回值**

- `Promise<Array<Object>>`


### request.headerValue() {#request-header-value}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

返回与名称匹配的头的值。名称不区分大小写。

**参数**

- <a id="request-header-value-option-name"></a>`name` `string`

  头的名称。

**返回值**

- `Promise<null | string>`


### request.isNavigationRequest() {#request-is-navigation-request}

<Badge type="info" text="Added in: v1.8" />

此请求是否驱动 frame 的导航。

某些导航请求在对应的 frame 创建之前发起，因此没有可用的 [`request.frame()`](/api/class-request#request-frame)。

**返回值**

- `boolean`


### request.method() {#request-method}

<Badge type="info" text="Added in: v1.8" />

请求的方法（GET、POST 等）

**返回值**

- `string`


### request.postData() {#request-post-data}

<Badge type="info" text="Added in: v1.8" />

请求的 post body（如果有）。

**返回值**

- `null | string`


### request.postDataBuffer() {#request-post-data-buffer}

<Badge type="info" text="Added in: v1.8" />

请求的 post body 的二进制形式（如果有）。

**返回值**

- `null | Buffer`


### request.postDataJSON() {#request-post-data-json}

<Badge type="info" text="Added in: v1.8" />

返回解析后的请求体，用于 `form-urlencoded` 格式，如果解析失败则尝试作为 JSON 解析。

当响应是 `application/x-www-form-urlencoded` 时，将返回一个键值对对象。
否则将作为 JSON 解析。

**返回值**

- `null | Serializable`


### request.redirectedFrom() {#request-redirected-from}

<Badge type="info" text="Added in: v1.8" />

服务器重定向到此请求的原始请求（如果有）。

当服务器响应重定向时，Playwright 会创建一个新的 [Request](/api/class-request) 对象。这两个请求通过 `redirectedFrom()` 和 `redirectedTo()` 方法连接。当发生多次服务器重定向时，可以通过重复调用 `redirectedFrom()` 来构建整个重定向链。

**用法**

例如，如果网站 `http://example.com` 重定向到 `https://example.com`：

```js
const response = await page.goto('http://example.com');
console.log(response.request().redirectedFrom().url()); // 'http://example.com'
```

如果网站 `https://google.com` 没有重定向：

```js
const response = await page.goto('https://google.com');
console.log(response.request().redirectedFrom()); // null
```

**返回值**

- `null | Request`


### request.redirectedTo() {#request-redirected-to}

<Badge type="info" text="Added in: v1.8" />

如果服务器响应重定向，则返回浏览器发起的新请求。

**用法**

此方法与 [`request.redirectedFrom()`](/api/class-request#request-redirected-from) 相反：

```js
console.log(request.redirectedFrom().redirectedTo() === request); // true
```

**返回值**

- `null | Request`


### request.resourceType() {#request-resource-type}

<Badge type="info" text="Added in: v1.8" />

包含渲染引擎感知的请求资源类型。ResourceType 将是以下之一：`document`、`stylesheet`、`image`、`media`、`font`、`script`、`texttrack`、`xhr`、`fetch`、`eventsource`、`websocket`、`manifest`、`beacon`、`ping`、`cspreport`、`other`。

**返回值**

- `string`


### request.response() {#request-response}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回匹配的 [Response](/api/class-response) 对象，如果由于错误未收到响应则返回 `null`。

**返回值**

- `Promise<null | Response>`


### request.serviceWorker() {#request-service-worker}

<Badge type="info" text="Added in: v1.24" />

正在执行请求的 Service [Worker](/api/class-worker)。

**详情**

此方法仅限 Chromium。在使用其他浏览器时调用是安全的，但始终返回 `null`。

源自 Service Worker 的请求没有可用的 [`request.frame()`](/api/class-request#request-frame)。

**返回值**

- `null | Worker`


### request.sizes() {#request-sizes}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

返回给定请求的资源大小信息。

**返回值**

- `Promise<Object>`


### request.timing() {#request-timing}

<Badge type="info" text="Added in: v1.8" />

返回给定请求的资源时间信息。大多数时间值在响应时可用，`responseEnd` 在请求完成时可用。更多信息请参阅 [Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming)。

**用法**

```js
const requestFinishedPromise = page.waitForEvent('requestfinished');
await page.goto('http://example.com');
const request = await requestFinishedPromise;
console.log(request.timing());
```

**返回值**

- `Object`


### request.url() {#request-url}

<Badge type="info" text="Added in: v1.8" />

请求的 URL。

**返回值**

- `string`
