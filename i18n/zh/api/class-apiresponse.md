---
title: APIResponse
outline: 2
---

# APIResponse

<Badge type="info" text="Added in: v1.16" />

[APIResponse](/api/class-apiresponse) 类表示由 [`apiRequestContext.get()`](/api/class-apirequestcontext#api-request-context-get) 和类似方法返回的响应。

## 方法

### apiResponse.body() {#api-response-body}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

返回包含响应体的缓冲区。

**返回值**

- `Promise<Buffer>`


### apiResponse.dispose() {#api-response-dispose}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

释放此响应的响应体。如果不调用，响应体将保留在内存中直到上下文关闭。


### apiResponse.headers() {#api-response-headers}

<Badge type="info" text="Added in: v1.16" />

包含与此响应关联的所有响应 HTTP 头的对象。

**返回值**

- `Object<string, string>`


### apiResponse.headersArray() {#api-response-headers-array}

<Badge type="info" text="Added in: v1.16" />

包含与此响应关联的所有响应 HTTP 头的数组。头名称不会转换为小写。
具有多个条目的头（如 `Set-Cookie`）会在数组中多次出现。

**返回值**

- `Array<Object>`


### apiResponse.json() {#api-response-json}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

返回响应体的 JSON 表示形式。

如果响应体无法通过 `JSON.parse` 解析，此方法将抛出异常。

**返回值**

- `Promise<Serializable>`


### apiResponse.ok() {#api-response-ok}

<Badge type="info" text="Added in: v1.16" />

包含一个布尔值，表示响应是否成功（状态码在 200-299 范围内）。

**返回值**

- `boolean`


### apiResponse.securityDetails() {#api-response-security-details}

<Badge type="info" text="Added in: v1.61" /> <Badge type="tip" text="async" />

返回 SSL 和其他安全信息。对于非 HTTPS 响应，解析为 `null`。对于重定向请求，返回重定向链中最后一个请求的信息。

**返回值**

- `Promise<null | Object>`


### apiResponse.serverAddr() {#api-response-server-addr}

<Badge type="info" text="Added in: v1.61" /> <Badge type="tip" text="async" />

返回服务器的 IP 地址和端口。如果服务器地址不可用，解析为 `null`。对于重定向请求，返回重定向链中最后一个请求的信息。

**返回值**

- `Promise<null | Object>`


### apiResponse.status() {#api-response-status}

<Badge type="info" text="Added in: v1.16" />

包含响应的状态码（例如，成功时为 200）。

**返回值**

- `int`


### apiResponse.statusText() {#api-response-status-text}

<Badge type="info" text="Added in: v1.16" />

包含响应的状态文本（例如，成功时通常为 "OK"）。

**返回值**

- `string`


### apiResponse.text() {#api-response-text}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

返回响应体的文本表示形式。

**返回值**

- `Promise<string>`


### apiResponse.timing() {#api-response-timing}

<Badge type="info" text="Added in: v1.62" />

返回给定响应的资源计时信息。对于重定向请求，返回重定向链中最后一个请求的信息。当响应[从 HAR 文件](../mock.md#replaying-from-har)提供时，计时信息不可用，所有值都是 -1。在
[Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming) 中查找更多信息。

**返回值**

- `Object`


### apiResponse.url() {#api-response-url}

<Badge type="info" text="Added in: v1.16" />

包含响应的 URL。

**返回值**

- `string`
