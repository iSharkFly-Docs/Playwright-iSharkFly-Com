---
title: APIResponse
outline: 2
---

# APIResponse

<Badge type="info" text="Added in: v1.16" />

[APIResponse](/dotnet/api/class-apiresponse) class represents responses returned by [`ApiRequestContext.GetAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-get) and similar methods.

## Methods

### ApiResponse.BodyAsync() {#api-response-body}

<Badge type="info" text="Added in: v1.16" />

Returns the buffer with response body.

**Returns**

- `Buffer`


### ApiResponse.DisposeAsync() {#api-response-dispose}

<Badge type="info" text="Added in: v1.16" />

Disposes the body of this response. If not called then the body will stay in memory until the context closes.


### ApiResponse.Headers() {#api-response-headers}

<Badge type="info" text="Added in: v1.16" />

An object with all the response HTTP headers associated with this response.

**Returns**

- `Object<string, string>`


### ApiResponse.HeadersArray() {#api-response-headers-array}

<Badge type="info" text="Added in: v1.16" />

An array with all the response HTTP headers associated with this response. Header names are not lower-cased.
Headers with multiple entries, such as `Set-Cookie`, appear in the array multiple times.

**Returns**

- `Array<Object>`


### ApiResponse.JsonAsync() {#api-response-json}

<Badge type="info" text="Added in: v1.16" />

Returns the JSON representation of response body.

This method will throw if the response body is not parsable via `JSON.parse`.

**Returns**

- `null | JsonElement`


### ApiResponse.Ok() {#api-response-ok}

<Badge type="info" text="Added in: v1.16" />

Contains a boolean stating whether the response was successful (status in the range 200-299) or not.

**Returns**

- `boolean`


### ApiResponse.SecurityDetailsAsync() {#api-response-security-details}

<Badge type="info" text="Added in: v1.61" />

Returns SSL and other security information. Resolves to `null` for non-HTTPS responses. For redirected requests, returns the information for the last request in the redirect chain.

**Returns**

- `null | Object`


### ApiResponse.ServerAddrAsync() {#api-response-server-addr}

<Badge type="info" text="Added in: v1.61" />

Returns the IP address and port of the server. Resolves to `null` if the server address is not available. For redirected requests, returns the information for the last request in the redirect chain.

**Returns**

- `null | Object`


### ApiResponse.Status() {#api-response-status}

<Badge type="info" text="Added in: v1.16" />

Contains the status code of the response (e.g., 200 for a success).

**Returns**

- `int`


### ApiResponse.StatusText() {#api-response-status-text}

<Badge type="info" text="Added in: v1.16" />

Contains the status text of the response (e.g. usually an "OK" for a success).

**Returns**

- `string`


### ApiResponse.TextAsync() {#api-response-text}

<Badge type="info" text="Added in: v1.16" />

Returns the text representation of response body.

**Returns**

- `string`


### ApiResponse.Timing() {#api-response-timing}

<Badge type="info" text="Added in: v1.62" />

Returns resource timing information for given response. For redirected requests, returns the information for the last
request in the redirect chain. When the response is served [from the HAR file](../mock.md#replaying-from-har), timing
information is not available and all the values are -1. Find more information at
[Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming).

**Returns**

- `Object`


### ApiResponse.Url() {#api-response-url}

<Badge type="info" text="Added in: v1.16" />

Contains the URL of the response.

**Returns**

- `string`

