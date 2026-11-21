---
title: Request
outline: 2
---

# Request

<Badge type="info" text="Added in: v1.8" />

Whenever the page sends a request for a network resource the following sequence of events are emitted by [Page](/dotnet/api/class-page):
* [`Page.Request`](/dotnet/api/class-page#page-event-request) emitted when the request is issued by the page.
* [`Page.Response`](/dotnet/api/class-page#page-event-response) emitted when/if the response status and headers are received for the request.
* [`Page.RequestFinished`](/dotnet/api/class-page#page-event-request-finished) emitted when the response body is downloaded and the request is complete.

If request fails at some point, then instead of `'requestfinished'` event (and possibly instead of 'response' event),
the  [`Page.RequestFailed`](/dotnet/api/class-page#page-event-request-failed) event is emitted.

::: info
HTTP Error responses, such as 404 or 503, are still successful responses from HTTP standpoint, so request will complete
with `'requestfinished'` event.
:::

If request gets a 'redirect' response, the request is successfully finished with the `requestfinished` event, and a new
request is  issued to a redirected url.

## Methods

### Request.AllHeadersAsync() {#request-all-headers}

<Badge type="info" text="Added in: v1.15" />

An object with all the request HTTP headers associated with this request. The header names are lower-cased.

**Returns**

- `Object<string, string>`


### Request.ExistingResponse() {#request-existing-response}

<Badge type="info" text="Added in: v1.59" />

Returns the [Response](/dotnet/api/class-response) object if the response has already been received, `null` otherwise.

Unlike [`Request.ResponseAsync()`](/dotnet/api/class-request#request-response), this method does not wait for the response to arrive. It returns
immediately with the response object if the response has been received, or `null` if the response
has not been received yet.

**Returns**

- `null | Response`


### Request.Failure() {#request-failure}

<Badge type="info" text="Added in: v1.8" />

The method returns `null` unless this request has failed, as reported by `requestfailed` event.

**Usage**

Example of logging of all the failed requests:

```csharp
page.RequestFailed += (_, request) =>
{
    Console.WriteLine(request.Failure);
};
```

**Returns**

- `null | string`


### Request.Frame() {#request-frame}

<Badge type="info" text="Added in: v1.8" />

Returns the [Frame](/dotnet/api/class-frame) that initiated this request.

**Usage**

```csharp
var frameUrl = request.Frame.Url;
```

**Details**

Note that in some cases the frame is not available, and this method will throw.
* When request originates in the Service Worker. You can use `request.serviceWorker()` to check that.
* When navigation request is issued before the corresponding frame is created. You can use [`Request.IsNavigationRequest()`](/dotnet/api/class-request#request-is-navigation-request) to check that.

Here is an example that handles all the cases:

**Returns**

- `Frame`


### Request.Headers() {#request-headers}

<Badge type="info" text="Added in: v1.8" />

An object with the request HTTP headers. The header names are lower-cased.
Note that this method does not return security-related headers, including cookie-related ones.
You can use [`Request.AllHeadersAsync()`](/dotnet/api/class-request#request-all-headers) for complete list of headers that include `cookie` information.

**Returns**

- `Object<string, string>`


### Request.HeadersArrayAsync() {#request-headers-array}

<Badge type="info" text="Added in: v1.15" />

An array with all the request HTTP headers associated with this request. Unlike [`Request.AllHeadersAsync()`](/dotnet/api/class-request#request-all-headers), header names are NOT lower-cased.
Headers with multiple entries, such as `Set-Cookie`, appear in the array multiple times.

**Returns**

- `Array<Object>`


### Request.HeaderValueAsync() {#request-header-value}

<Badge type="info" text="Added in: v1.15" />

Returns the value of the header matching the name. The name is case-insensitive.

**Arguments**

- <a id="request-header-value-option-name"></a>`name` `string`

  Name of the header.

**Returns**

- `null | string`


### Request.IsNavigationRequest() {#request-is-navigation-request}

<Badge type="info" text="Added in: v1.8" />

Whether this request is driving frame's navigation.

Some navigation requests are issued before the corresponding frame is created, and therefore
do not have [`Request.Frame()`](/dotnet/api/class-request#request-frame) available.

**Returns**

- `boolean`


### Request.Method() {#request-method}

<Badge type="info" text="Added in: v1.8" />

Request's method (GET, POST, etc.)

**Returns**

- `string`


### Request.PostData() {#request-post-data}

<Badge type="info" text="Added in: v1.8" />

Request's post body, if any.

**Returns**

- `null | string`


### Request.PostDataBuffer() {#request-post-data-buffer}

<Badge type="info" text="Added in: v1.8" />

Request's post body in a binary form, if any.

**Returns**

- `null | Buffer`


### Request.PostDataJSON() {#request-post-data-json}

<Badge type="info" text="Added in: v1.12" />

Returns parsed request's body for `form-urlencoded` and JSON as a fallback if any.

When the response is `application/x-www-form-urlencoded` then a key/value object of the values will be returned.
Otherwise it will be parsed as JSON.

**Returns**

- `null | JsonElement`


### Request.RedirectedFrom() {#request-redirected-from}

<Badge type="info" text="Added in: v1.8" />

Request that was redirected by the server to this one, if any.

When the server responds with a redirect, Playwright creates a new [Request](/dotnet/api/class-request) object. The two requests are connected by
`redirectedFrom()` and `redirectedTo()` methods. When multiple server redirects has happened, it is possible to
construct the whole redirect chain by repeatedly calling `redirectedFrom()`.

**Usage**

For example, if the website `http://example.com` redirects to `https://example.com`:

```csharp
var response = await page.GotoAsync("http://www.microsoft.com");
Console.WriteLine(response.Request.RedirectedFrom?.Url); // http://www.microsoft.com
```

If the website `https://google.com` has no redirects:

```csharp
var response = await page.GotoAsync("https://www.google.com");
Console.WriteLine(response.Request.RedirectedFrom?.Url); // null
```

**Returns**

- `null | Request`


### Request.RedirectedTo() {#request-redirected-to}

<Badge type="info" text="Added in: v1.8" />

New request issued by the browser if the server responded with redirect.

**Usage**

This method is the opposite of [`Request.RedirectedFrom()`](/dotnet/api/class-request#request-redirected-from):

```csharp
Console.WriteLine(request.RedirectedFrom?.RedirectedTo == request); // True
```

**Returns**

- `null | Request`


### Request.ResourceType() {#request-resource-type}

<Badge type="info" text="Added in: v1.8" />

Contains the request's resource type as it was perceived by the rendering engine. ResourceType will be one of the
following: `document`, `stylesheet`, `image`, `media`, `font`, `script`, `texttrack`, `xhr`, `fetch`, `eventsource`,
`websocket`, `manifest`, `beacon`, `ping`, `cspreport`, `other`.

**Returns**

- `string`


### Request.ResponseAsync() {#request-response}

<Badge type="info" text="Added in: v1.8" />

Returns the matching [Response](/dotnet/api/class-response) object, or `null` if the response was not received due to error.

**Returns**

- `null | Response`


### Request.SizesAsync() {#request-sizes}

<Badge type="info" text="Added in: v1.15" />

Returns resource size information for given request.

**Returns**

- `Object`


### Request.Timing() {#request-timing}

<Badge type="info" text="Added in: v1.8" />

Returns resource timing information for given request. Most of the timing values become available upon the response,
`responseEnd` becomes available when request finishes. Find more information at
[Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming).

**Usage**

```csharp
var request = await page.RunAndWaitForRequestFinishedAsync(async () =>
{
    await page.GotoAsync("https://www.microsoft.com");
});
Console.WriteLine(request.Timing.ResponseEnd);
```

**Returns**

- `Object`


### Request.Url() {#request-url}

<Badge type="info" text="Added in: v1.8" />

URL of the request.

**Returns**

- `string`

