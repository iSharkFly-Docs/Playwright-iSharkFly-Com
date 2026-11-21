---
title: Response
outline: 2
---

# Response

<Badge type="info" text="Added in: v1.8" />

[Response](/python/api/class-response) class represents responses which are received by page.

## Methods

### response.all_headers() {#response-all-headers}

<Badge type="info" text="Added in: v1.15" />

An object with all the response HTTP headers associated with this response.

**Returns**

- `Object<string, string>`


### response.body() {#response-body}

<Badge type="info" text="Added in: v1.8" />

Returns the buffer with response body.

**Returns**

- `Buffer`


### response.finished() {#response-finished}

<Badge type="info" text="Added in: v1.8" />

Waits for this response to finish, returns always `null`.


### response.frame() {#response-frame}

<Badge type="info" text="Added in: v1.8" />

Returns the [Frame](/python/api/class-frame) that initiated this response.

**Returns**

- `Frame`


### response.from_service_worker() {#response-from-service-worker}

<Badge type="info" text="Added in: v1.23" />

Indicates whether this Response was fulfilled by a Service Worker's Fetch Handler (i.e. via [FetchEvent.respondWith](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith)).

**Returns**

- `boolean`


### response.headers() {#response-headers}

<Badge type="info" text="Added in: v1.8" />

An object with the response HTTP headers. The header names are lower-cased.
Note that this method does not return security-related headers, including cookie-related ones.
You can use [`response.all_headers()`](/python/api/class-response#response-all-headers) for complete list of headers that include `cookie` information.

**Returns**

- `Object<string, string>`


### response.headers_array() {#response-headers-array}

<Badge type="info" text="Added in: v1.15" />

An array with all the response HTTP headers associated with this response. Unlike [`response.all_headers()`](/python/api/class-response#response-all-headers), header names are NOT lower-cased.
Headers with multiple entries, such as `Set-Cookie`, appear in the array multiple times.
Some browser network stacks combine multiple field values before reporting them, so separate entries are not always available.

**Returns**

- `Array<Object>`


### response.header_value() {#response-header-value}

<Badge type="info" text="Added in: v1.15" />

Returns the value of the header matching the name. The name is case-insensitive. If multiple headers have
the same name (except `set-cookie`), they are returned as a list separated by `, `. For `set-cookie`, the `\n` separator is used. If no headers are found, `null` is returned.

**Arguments**

- <a id="response-header-value-option-name"></a>`name` `string`

  Name of the header.

**Returns**

- `null | string`


### response.header_values() {#response-header-values}

<Badge type="info" text="Added in: v1.15" />

Returns all values of the headers matching the name, for example `set-cookie`. The name is case-insensitive.

**Arguments**

- <a id="response-header-values-option-name"></a>`name` `string`

  Name of the header.

**Returns**

- `Array<string>`


### response.http_version() {#response-http-version}

<Badge type="info" text="Added in: v1.59" />

Returns the http version used by the response.

**Returns**

- `string`


### response.json() {#response-json}

<Badge type="info" text="Added in: v1.8" />

Returns the JSON representation of response body.

This method will throw if the response body is not parsable via `JSON.parse`.

**Returns**

- `Serializable`


### response.ok() {#response-ok}

<Badge type="info" text="Added in: v1.8" />

Contains a boolean stating whether the response was successful (status in the range 200-299) or not.

**Returns**

- `boolean`


### response.request() {#response-request}

<Badge type="info" text="Added in: v1.8" />

Returns the matching [Request](/python/api/class-request) object.

**Returns**

- `Request`


### response.security_details() {#response-security-details}

<Badge type="info" text="Added in: v1.13" />

Returns SSL and other security information.

**Returns**

- `null | Object`


### response.server_addr() {#response-server-addr}

<Badge type="info" text="Added in: v1.13" />

Returns the IP address and port of the server.

**Returns**

- `null | Object`


### response.status() {#response-status}

<Badge type="info" text="Added in: v1.8" />

Contains the status code of the response (e.g., 200 for a success).

**Returns**

- `int`


### response.status_text() {#response-status-text}

<Badge type="info" text="Added in: v1.8" />

Contains the status text of the response (e.g. usually an "OK" for a success).

**Returns**

- `string`


### response.text() {#response-text}

<Badge type="info" text="Added in: v1.8" />

Returns the text representation of response body.

**Returns**

- `string`


### response.url() {#response-url}

<Badge type="info" text="Added in: v1.8" />

Contains the URL of the response.

**Returns**

- `string`

