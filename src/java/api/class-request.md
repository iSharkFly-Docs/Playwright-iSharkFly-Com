---
title: Request
outline: 2
---

# Request

<Badge type="info" text="Added in: v1.8" />

Whenever the page sends a request for a network resource the following sequence of events are emitted by [Page](/java/api/class-page):
* [`page.onRequest()`](/java/api/class-page#page-event-request) emitted when the request is issued by the page.
* [`page.onResponse()`](/java/api/class-page#page-event-response) emitted when/if the response status and headers are received for the request.
* [`page.onRequestFinished()`](/java/api/class-page#page-event-request-finished) emitted when the response body is downloaded and the request is complete.

If request fails at some point, then instead of `'requestfinished'` event (and possibly instead of 'response' event),
the  [`page.onRequestFailed()`](/java/api/class-page#page-event-request-failed) event is emitted.

::: info
HTTP Error responses, such as 404 or 503, are still successful responses from HTTP standpoint, so request will complete
with `'requestfinished'` event.
:::

If request gets a 'redirect' response, the request is successfully finished with the `requestfinished` event, and a new
request is  issued to a redirected url.

## Methods

### request.allHeaders() {#request-all-headers}

<Badge type="info" text="Added in: v1.15" />

An object with all the request HTTP headers associated with this request. The header names are lower-cased.

**Returns**

- `Object<string, string>`


### request.existingResponse() {#request-existing-response}

<Badge type="info" text="Added in: v1.59" />

Returns the [Response](/java/api/class-response) object if the response has already been received, `null` otherwise.

Unlike [`request.response()`](/java/api/class-request#request-response), this method does not wait for the response to arrive. It returns
immediately with the response object if the response has been received, or `null` if the response
has not been received yet.

**Returns**

- `null | Response`


### request.failure() {#request-failure}

<Badge type="info" text="Added in: v1.8" />

The method returns `null` unless this request has failed, as reported by `requestfailed` event.

**Usage**

Example of logging of all the failed requests:

```java
page.onRequestFailed(request -> {
  System.out.println(request.url() + " " + request.failure());
});
```

**Returns**

- `null | string`


### request.frame() {#request-frame}

<Badge type="info" text="Added in: v1.8" />

Returns the [Frame](/java/api/class-frame) that initiated this request.

**Usage**

```java
String frameUrl = request.frame().url();
```

**Details**

Note that in some cases the frame is not available, and this method will throw.
* When request originates in the Service Worker. You can use `request.serviceWorker()` to check that.
* When navigation request is issued before the corresponding frame is created. You can use [`request.isNavigationRequest()`](/java/api/class-request#request-is-navigation-request) to check that.

Here is an example that handles all the cases:

**Returns**

- `Frame`


### request.headers() {#request-headers}

<Badge type="info" text="Added in: v1.8" />

An object with the request HTTP headers. The header names are lower-cased.
Note that this method does not return security-related headers, including cookie-related ones.
You can use [`request.allHeaders()`](/java/api/class-request#request-all-headers) for complete list of headers that include `cookie` information.

**Returns**

- `Object<string, string>`


### request.headersArray() {#request-headers-array}

<Badge type="info" text="Added in: v1.15" />

An array with all the request HTTP headers associated with this request. Unlike [`request.allHeaders()`](/java/api/class-request#request-all-headers), header names are NOT lower-cased.
Headers with multiple entries, such as `Set-Cookie`, appear in the array multiple times.

**Returns**

- `Array<Object>`


### request.headerValue() {#request-header-value}

<Badge type="info" text="Added in: v1.15" />

Returns the value of the header matching the name. The name is case-insensitive.

**Arguments**

- <a id="request-header-value-option-name"></a>`name` `string`

  Name of the header.

**Returns**

- `null | string`


### request.isNavigationRequest() {#request-is-navigation-request}

<Badge type="info" text="Added in: v1.8" />

Whether this request is driving frame's navigation.

Some navigation requests are issued before the corresponding frame is created, and therefore
do not have [`request.frame()`](/java/api/class-request#request-frame) available.

**Returns**

- `boolean`


### request.method() {#request-method}

<Badge type="info" text="Added in: v1.8" />

Request's method (GET, POST, etc.)

**Returns**

- `string`


### request.postData() {#request-post-data}

<Badge type="info" text="Added in: v1.8" />

Request's post body, if any.

**Returns**

- `null | string`


### request.postDataBuffer() {#request-post-data-buffer}

<Badge type="info" text="Added in: v1.8" />

Request's post body in a binary form, if any.

**Returns**

- `null | Buffer`


### request.redirectedFrom() {#request-redirected-from}

<Badge type="info" text="Added in: v1.8" />

Request that was redirected by the server to this one, if any.

When the server responds with a redirect, Playwright creates a new [Request](/java/api/class-request) object. The two requests are connected by
`redirectedFrom()` and `redirectedTo()` methods. When multiple server redirects has happened, it is possible to
construct the whole redirect chain by repeatedly calling `redirectedFrom()`.

**Usage**

For example, if the website `http://example.com` redirects to `https://example.com`:

```java
Response response = page.navigate("http://example.com");
System.out.println(response.request().redirectedFrom().url()); // "http://example.com"
```

If the website `https://google.com` has no redirects:

```java
Response response = page.navigate("https://google.com");
System.out.println(response.request().redirectedFrom()); // null
```

**Returns**

- `null | Request`


### request.redirectedTo() {#request-redirected-to}

<Badge type="info" text="Added in: v1.8" />

New request issued by the browser if the server responded with redirect.

**Usage**

This method is the opposite of [`request.redirectedFrom()`](/java/api/class-request#request-redirected-from):

```java
System.out.println(request.redirectedFrom().redirectedTo() == request); // true
```

**Returns**

- `null | Request`


### request.resourceType() {#request-resource-type}

<Badge type="info" text="Added in: v1.8" />

Contains the request's resource type as it was perceived by the rendering engine. ResourceType will be one of the
following: `document`, `stylesheet`, `image`, `media`, `font`, `script`, `texttrack`, `xhr`, `fetch`, `eventsource`,
`websocket`, `manifest`, `beacon`, `ping`, `cspreport`, `other`.

**Returns**

- `string`


### request.response() {#request-response}

<Badge type="info" text="Added in: v1.8" />

Returns the matching [Response](/java/api/class-response) object, or `null` if the response was not received due to error.

**Returns**

- `null | Response`


### request.sizes() {#request-sizes}

<Badge type="info" text="Added in: v1.15" />

Returns resource size information for given request.

**Returns**

- `Object`


### request.timing() {#request-timing}

<Badge type="info" text="Added in: v1.8" />

Returns resource timing information for given request. Most of the timing values become available upon the response,
`responseEnd` becomes available when request finishes. Find more information at
[Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming).

**Usage**

```java
page.onRequestFinished(request -> {
  Timing timing = request.timing();
  System.out.println(timing.responseEnd - timing.startTime);
});
page.navigate("http://example.com");
```

**Returns**

- `Object`


### request.url() {#request-url}

<Badge type="info" text="Added in: v1.8" />

URL of the request.

**Returns**

- `string`

