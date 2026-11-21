---
title: Response
outline: 2
---

# Response

<Badge type="info" text="Added in: v1.8" />

[Response](/dotnet/api/class-response) class represents responses which are received by page.

## Methods

### Response.AllHeadersAsync() {#response-all-headers}

<Badge type="info" text="Added in: v1.15" />

An object with all the response HTTP headers associated with this response.

**Returns**

- `Object<string, string>`


### Response.BodyAsync() {#response-body}

<Badge type="info" text="Added in: v1.8" />

Returns the buffer with response body.

**Returns**

- `Buffer`


### Response.FinishedAsync() {#response-finished}

<Badge type="info" text="Added in: v1.8" />

Waits for this response to finish, returns always `null`.

**Returns**

- `null | string`


### Response.Frame() {#response-frame}

<Badge type="info" text="Added in: v1.8" />

Returns the [Frame](/dotnet/api/class-frame) that initiated this response.

**Returns**

- `Frame`


### Response.FromServiceWorker() {#response-from-service-worker}

<Badge type="info" text="Added in: v1.23" />

Indicates whether this Response was fulfilled by a Service Worker's Fetch Handler (i.e. via [FetchEvent.respondWith](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith)).

**Returns**

- `boolean`


### Response.Headers() {#response-headers}

<Badge type="info" text="Added in: v1.8" />

An object with the response HTTP headers. The header names are lower-cased.
Note that this method does not return security-related headers, including cookie-related ones.
You can use [`Response.AllHeadersAsync()`](/dotnet/api/class-response#response-all-headers) for complete list of headers that include `cookie` information.

**Returns**

- `Object<string, string>`


### Response.HeadersArrayAsync() {#response-headers-array}

<Badge type="info" text="Added in: v1.15" />

An array with all the response HTTP headers associated with this response. Unlike [`Response.AllHeadersAsync()`](/dotnet/api/class-response#response-all-headers), header names are NOT lower-cased.
Headers with multiple entries, such as `Set-Cookie`, appear in the array multiple times.
Some browser network stacks combine multiple field values before reporting them, so separate entries are not always available.

**Returns**

- `Array<Object>`


### Response.HeaderValueAsync() {#response-header-value}

<Badge type="info" text="Added in: v1.15" />

Returns the value of the header matching the name. The name is case-insensitive. If multiple headers have
the same name (except `set-cookie`), they are returned as a list separated by `, `. For `set-cookie`, the `\n` separator is used. If no headers are found, `null` is returned.

**Arguments**

- <a id="response-header-value-option-name"></a>`name` `string`

  Name of the header.

**Returns**

- `null | string`


### Response.HeaderValuesAsync() {#response-header-values}

<Badge type="info" text="Added in: v1.15" />

Returns all values of the headers matching the name, for example `set-cookie`. The name is case-insensitive.

**Arguments**

- <a id="response-header-values-option-name"></a>`name` `string`

  Name of the header.

**Returns**

- `Array<string>`


### Response.HttpVersionAsync() {#response-http-version}

<Badge type="info" text="Added in: v1.59" />

Returns the http version used by the response.

**Returns**

- `string`


### Response.JsonAsync() {#response-json}

<Badge type="info" text="Added in: v1.8" />

Returns the JSON representation of response body.

This method will throw if the response body is not parsable via `JSON.parse`.

**Returns**

- `null | JsonElement`


### Response.Ok() {#response-ok}

<Badge type="info" text="Added in: v1.8" />

Contains a boolean stating whether the response was successful (status in the range 200-299) or not.

**Returns**

- `boolean`


### Response.Request() {#response-request}

<Badge type="info" text="Added in: v1.8" />

Returns the matching [Request](/dotnet/api/class-request) object.

**Returns**

- `Request`


### Response.SecurityDetailsAsync() {#response-security-details}

<Badge type="info" text="Added in: v1.13" />

Returns SSL and other security information.

**Returns**

- `null | Object`


### Response.ServerAddrAsync() {#response-server-addr}

<Badge type="info" text="Added in: v1.13" />

Returns the IP address and port of the server.

**Returns**

- `null | Object`


### Response.Status() {#response-status}

<Badge type="info" text="Added in: v1.8" />

Contains the status code of the response (e.g., 200 for a success).

**Returns**

- `int`


### Response.StatusText() {#response-status-text}

<Badge type="info" text="Added in: v1.8" />

Contains the status text of the response (e.g. usually an "OK" for a success).

**Returns**

- `string`


### Response.TextAsync() {#response-text}

<Badge type="info" text="Added in: v1.8" />

Returns the text representation of response body.

**Returns**

- `string`


### Response.Url() {#response-url}

<Badge type="info" text="Added in: v1.8" />

Contains the URL of the response.

**Returns**

- `string`

