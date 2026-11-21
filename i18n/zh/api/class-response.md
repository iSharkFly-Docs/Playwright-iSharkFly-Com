---
title: Response
outline: 2
---

# Response

<Badge type="info" text="Added in: v1.8" />

[Response](/api/class-response) 类表示页面接收到的响应。

## 方法

### response.allHeaders() {#response-all-headers}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

返回一个包含此响应所有 HTTP 响应头的对象。

**返回值**

- `Promise<Object<string, string>>`


### response.body() {#response-body}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回包含响应体的 buffer。

**返回值**

- `Promise<Buffer>`


### response.finished() {#response-finished}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

等待此响应完成，始终返回 `null`。

**返回值**

- `Promise<null | Error>`


### response.frame() {#response-frame}

<Badge type="info" text="Added in: v1.8" />

返回发起此响应的 [Frame](/api/class-frame)。

**返回值**

- `Frame`


### response.fromServiceWorker() {#response-from-service-worker}

<Badge type="info" text="Added in: v1.23" />

指示此响应是否由 Service Worker 的 Fetch Handler 完成（即通过 [FetchEvent.respondWith](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith)）。

**返回值**

- `boolean`


### response.headers() {#response-headers}

<Badge type="info" text="Added in: v1.8" />

返回一个包含响应 HTTP 头的对象。头名称为小写。
请注意，此方法不返回与安全相关的头，包括与 cookie 相关的头。
你可以使用 [`response.allHeaders()`](/api/class-response#response-all-headers) 获取包含 `cookie` 信息的完整头列表。

**返回值**

- `Object<string, string>`


### response.headersArray() {#response-headers-array}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

返回一个包含此响应所有 HTTP 响应头的数组。与 [`response.allHeaders()`](/api/class-response#response-all-headers) 不同，头名称不会转换为小写。
具有多个条目的头（如 `Set-Cookie`）会在数组中出现多次。
某些浏览器网络栈会在报告之前合并多个字段值，因此不一定总能获取到单独的条目。

**返回值**

- `Promise<Array<Object>>`


### response.headerValue() {#response-header-value}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

返回与名称匹配的头的值。名称不区分大小写。如果多个头具有相同的名称（`set-cookie` 除外），它们将以 `, ` 分隔的列表形式返回。对于 `set-cookie`，使用 `\n` 分隔符。如果未找到头，则返回 `null`。

**参数**

- <a id="response-header-value-option-name"></a>`name` `string`

  头的名称。

**返回值**

- `Promise<null | string>`


### response.headerValues() {#response-header-values}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

返回与名称匹配的所有头的值，例如 `set-cookie`。名称不区分大小写。

**参数**

- <a id="response-header-values-option-name"></a>`name` `string`

  头的名称。

**返回值**

- `Promise<Array<string>>`


### response.httpVersion() {#response-http-version}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

返回响应使用的 HTTP 版本。

**返回值**

- `Promise<string>`


### response.json() {#response-json}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回响应体的 JSON 表示形式。

如果响应体无法通过 `JSON.parse` 解析，此方法将抛出异常。

**返回值**

- `Promise<Serializable>`


### response.ok() {#response-ok}

<Badge type="info" text="Added in: v1.8" />

包含一个布尔值，表示响应是否成功（状态码在 200-299 范围内）。

**返回值**

- `boolean`


### response.request() {#response-request}

<Badge type="info" text="Added in: v1.8" />

返回匹配的 [Request](/api/class-request) 对象。

**返回值**

- `Request`


### response.securityDetails() {#response-security-details}

<Badge type="info" text="Added in: v1.13" /> <Badge type="tip" text="async" />

返回 SSL 和其他安全信息。

**返回值**

- `Promise<null | Object>`


### response.serverAddr() {#response-server-addr}

<Badge type="info" text="Added in: v1.13" /> <Badge type="tip" text="async" />

返回服务器的 IP 地址和端口。

**返回值**

- `Promise<null | Object>`


### response.status() {#response-status}

<Badge type="info" text="Added in: v1.8" />

包含响应的状态码（例如，成功时为 200）。

**返回值**

- `int`


### response.statusText() {#response-status-text}

<Badge type="info" text="Added in: v1.8" />

包含响应的状态文本（例如，成功时通常为 "OK"）。

**返回值**

- `string`


### response.text() {#response-text}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回响应体的文本表示形式。

**返回值**

- `Promise<string>`


### response.url() {#response-url}

<Badge type="info" text="Added in: v1.8" />

包含响应的 URL。

**返回值**

- `string`
