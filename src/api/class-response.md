---
title: Response
outline: 2
---

# Response

<Badge type="info" text="Added in: v1.8" />

[Response](/api/class-response) class represents responses which are received by page.

## Methods

### response.allHeaders() {#response-all-headers}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

An object with all the response HTTP headers associated with this response.

**Returns**

- `Promise<Object<string, string>>`


### response.body() {#response-body}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the buffer with response body.

**Returns**

- `Promise<Buffer>`


### response.finished() {#response-finished}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Waits for this response to finish, returns always `null`.

**Returns**

- `Promise<null | Error>`


### response.frame() {#response-frame}

<Badge type="info" text="Added in: v1.8" />

Returns the [Frame](/api/class-frame) that initiated this response.

**Returns**

- `Frame`


### response.fromServiceWorker() {#response-from-service-worker}

<Badge type="info" text="Added in: v1.23" />

Indicates whether this Response was fulfilled by a Service Worker's Fetch Handler (i.e. via [FetchEvent.respondWith](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith)).

**Returns**

- `boolean`


### response.headers() {#response-headers}

<Badge type="info" text="Added in: v1.8" />

An object with the response HTTP headers. The header names are lower-cased.
Note that this method does not return security-related headers, including cookie-related ones.
You can use [`response.allHeaders()`](/api/class-response#response-all-headers) for complete list of headers that include `cookie` information.

**Returns**

- `Object<string, string>`


### response.headersArray() {#response-headers-array}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

An array with all the response HTTP headers associated with this response. Unlike [`response.allHeaders()`](/api/class-response#response-all-headers), header names are NOT lower-cased.
Headers with multiple entries, such as `Set-Cookie`, appear in the array multiple times.
Some browser network stacks combine multiple field values before reporting them, so separate entries are not always available.

**Returns**

- `Promise<Array<Object>>`


### response.headerValue() {#response-header-value}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

Returns the value of the header matching the name. The name is case-insensitive. If multiple headers have
the same name (except `set-cookie`), they are returned as a list separated by `, `. For `set-cookie`, the `\n` separator is used. If no headers are found, `null` is returned.

**Arguments**

- <a id="response-header-value-option-name"></a>`name` `string`

  Name of the header.

**Returns**

- `Promise<null | string>`


### response.headerValues() {#response-header-values}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

Returns all values of the headers matching the name, for example `set-cookie`. The name is case-insensitive.

**Arguments**

- <a id="response-header-values-option-name"></a>`name` `string`

  Name of the header.

**Returns**

- `Promise<Array<string>>`


### response.httpVersion() {#response-http-version}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

Returns the http version used by the response.

**Returns**

- `Promise<string>`


### response.json() {#response-json}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the JSON representation of response body.

This method will throw if the response body is not parsable via `JSON.parse`.

**Returns**

- `Promise<Serializable>`


### response.ok() {#response-ok}

<Badge type="info" text="Added in: v1.8" />

Contains a boolean stating whether the response was successful (status in the range 200-299) or not.

**Returns**

- `boolean`


### response.request() {#response-request}

<Badge type="info" text="Added in: v1.8" />

Returns the matching [Request](/api/class-request) object.

**Returns**

- `Request`


### response.securityDetails() {#response-security-details}

<Badge type="info" text="Added in: v1.13" /> <Badge type="tip" text="async" />

Returns SSL and other security information.

**Returns**

- `Promise<null | Object>`


### response.serverAddr() {#response-server-addr}

<Badge type="info" text="Added in: v1.13" /> <Badge type="tip" text="async" />

Returns the IP address and port of the server.

**Returns**

- `Promise<null | Object>`


### response.status() {#response-status}

<Badge type="info" text="Added in: v1.8" />

Contains the status code of the response (e.g., 200 for a success).

**Returns**

- `int`


### response.statusText() {#response-status-text}

<Badge type="info" text="Added in: v1.8" />

Contains the status text of the response (e.g. usually an "OK" for a success).

**Returns**

- `string`


### response.text() {#response-text}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the text representation of response body.

**Returns**

- `Promise<string>`


### response.url() {#response-url}

<Badge type="info" text="Added in: v1.8" />

Contains the URL of the response.

**Returns**

- `string`

