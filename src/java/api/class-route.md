---
title: Route
outline: 2
---

# Route

<Badge type="info" text="Added in: v1.8" />

Whenever a network route is set up with [`page.route()`](/java/api/class-page#page-route) or [`browserContext.route()`](/java/api/class-browsercontext#browser-context-route), the `Route` object
allows to handle the route.

Learn more about [networking](../network.md).

## Methods

### route.abort() {#route-abort}

<Badge type="info" text="Added in: v1.8" />

Aborts the route's request.

**Arguments**

- <a id="route-abort-option-error-code"></a>`errorCode` `string` *(optional)*

  Optional error code. Defaults to `failed`, could be one of the following:
  * `'aborted'` - An operation was aborted (due to user action)
  * `'accessdenied'` - Permission to access a resource, other than the network, was denied
  * `'addressunreachable'` - The IP address is unreachable. This usually means that there is no route to the specified
    host or network.
  * `'blockedbyclient'` - The client chose to block the request.
  * `'blockedbyresponse'` - The request failed because the response was delivered along with requirements which are not
    met ('X-Frame-Options' and 'Content-Security-Policy' ancestor checks, for instance).
  * `'connectionaborted'` - A connection timed out as a result of not receiving an ACK for data sent.
  * `'connectionclosed'` - A connection was closed (corresponding to a TCP FIN).
  * `'connectionfailed'` - A connection attempt failed.
  * `'connectionrefused'` - A connection attempt was refused.
  * `'connectionreset'` - A connection was reset (corresponding to a TCP RST).
  * `'internetdisconnected'` - The Internet connection has been lost.
  * `'namenotresolved'` - The host name could not be resolved.
  * `'timedout'` - An operation timed out.
  * `'failed'` - A generic failure occurred.


### route.fallback() {#route-fallback}

<Badge type="info" text="Added in: v1.23" />

Continues route's request with optional overrides. The method is similar to [`route.resume()`](/java/api/class-route#route-continue) with the difference that other matching handlers will be invoked before sending the request.

**Usage**

When several routes match the given pattern, they run in the order opposite to their registration.
That way the last registered route can always override all the previous ones. In the example below,
request will be handled by the bottom-most handler first, then it'll fall back to the previous one and
in the end will be aborted by the first registered route.

```java
page.route("**/*", route -> {
  // Runs last.
  route.abort();
});

page.route("**/*", route -> {
  // Runs second.
  route.fallback();
});

page.route("**/*", route -> {
  // Runs first.
  route.fallback();
});
```

Registering multiple routes is useful when you want separate handlers to
handle different kinds of requests, for example API calls vs page resources or
GET requests vs POST requests as in the example below.

```java
// Handle GET requests.
page.route("**/*", route -> {
  if (!route.request().method().equals("GET")) {
    route.fallback();
    return;
  }
  // Handling GET only.
  // ...
});

// Handle POST requests.
page.route("**/*", route -> {
  if (!route.request().method().equals("POST")) {
    route.fallback();
    return;
  }
  // Handling POST only.
  // ...
});
```

One can also modify request while falling back to the subsequent handler, that way intermediate
route handler can modify url, method, headers and postData of the request.

```java
page.route("**/*", route -> {
  // Override headers
  Map<String, String> headers = new HashMap<>(route.request().headers());
  headers.put("foo", "foo-value"); // set "foo" header
  headers.remove("bar"); // remove "bar" header
  route.fallback(new Route.ResumeOptions().setHeaders(headers));
});
```

Use [`route.resume()`](/java/api/class-route#route-continue) to immediately send the request to the network, other matching handlers won't be invoked in that case.

**Arguments**

- <a id="route-fallback-option-options"></a>`options` `Object` *(optional)*

  - <a id="route-fallback-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    If set changes the request HTTP headers. Header values will be converted to a string.
  - <a id="route-fallback-option-method"></a>`method` `string` *(optional)*

    If set changes the request method (e.g. GET or POST).
  - <a id="route-fallback-option-post-data"></a>`postData` `string | Buffer` *(optional)*

    If set changes the post data of request.
  - <a id="route-fallback-option-url"></a>`url` `string` *(optional)*

    If set changes the request URL. New URL must have same protocol as original one. Changing the URL won't
    affect the route matching, all the routes are matched using the original request URL.


### route.fetch() {#route-fetch}

<Badge type="info" text="Added in: v1.29" />

Performs the request and fetches result without fulfilling it, so that the response
could be modified and then fulfilled.

**Usage**

```java
page.route("https://dog.ceo/api/breeds/list/all", route -> {
  APIResponse response = route.fetch();
  JsonObject json = new Gson().fromJson(response.text(), JsonObject.class);
  JsonObject message = itemObj.get("json").getAsJsonObject();
  message.set("big_red_dog", new JsonArray());
  route.fulfill(new Route.FulfillOptions()
    .setResponse(response)
    .setBody(json.toString()));
});
```

**Details**

Note that [`headers`](/java/api/class-route#route-fetch-option-headers) option will apply to the fetched request as well as any redirects initiated by it. If you want to only apply [`headers`](/java/api/class-route#route-fetch-option-headers) to the original request, but not to redirects, look into [`route.resume()`](/java/api/class-route#route-continue) instead.

**Arguments**

- <a id="route-fetch-option-options"></a>`options` `Object` *(optional)*

  - <a id="route-fetch-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    If set changes the request HTTP headers. Header values will be converted to a string.
  - <a id="route-fetch-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.31" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="route-fetch-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="route-fetch-option-method"></a>`method` `string` *(optional)*

    If set changes the request method (e.g. GET or POST).
  - <a id="route-fetch-option-post-data"></a>`postData` `string | Buffer` *(optional)*

    If set changes the post data of request.
  - <a id="route-fetch-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
  - <a id="route-fetch-option-url"></a>`url` `string` *(optional)*

    If set changes the request URL. New URL must have same protocol as original one.

**Returns**

- `APIResponse`


### route.fulfill() {#route-fulfill}

<Badge type="info" text="Added in: v1.8" />

Fulfills route's request with given response.

**Usage**

An example of fulfilling all requests with 404 responses:

```java
page.route("**/*", route -> {
  route.fulfill(new Route.FulfillOptions()
    .setStatus(404)
    .setContentType("text/plain")
    .setBody("Not Found!"));
});
```

An example of serving static file:

```java
page.route("**/xhr_endpoint", route -> route.fulfill(
  new Route.FulfillOptions().setPath(Paths.get("mock_data.json"))));
```

**Arguments**

- <a id="route-fulfill-option-options"></a>`options` `Object` *(optional)*

  - <a id="route-fulfill-option-body"></a>`body` `string` *(optional)*

    Optional response body as text.
  - <a id="route-fulfill-option-body-bytes"></a>`bodyBytes` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.9" />

    Optional response body as raw bytes.
  - <a id="route-fulfill-option-content-type"></a>`contentType` `string` *(optional)*

    If set, equals to setting `Content-Type` response header.
  - <a id="route-fulfill-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Response headers. Header values will be converted to a string.
  - <a id="route-fulfill-option-path"></a>`path` `path` *(optional)*

    File path to respond with. The content type will be inferred from file extension. If `path` is a relative path, then it
    is resolved relative to the current working directory.
  - <a id="route-fulfill-option-response"></a>`response` `APIResponse` *(optional)* <Badge type="info" text="Added in: v1.15" />

    [APIResponse](/java/api/class-apiresponse) to fulfill route's request with. Individual fields of the response (such as headers) can be overridden using fulfill options.
  - <a id="route-fulfill-option-status"></a>`status` `int` *(optional)*

    Response status code, defaults to `200`.


### route.request() {#route-request}

<Badge type="info" text="Added in: v1.8" />

A request to be routed.

**Returns**

- `Request`


### route.resume() {#route-continue}

<Badge type="info" text="Added in: v1.8" />

Sends route's request to the network with optional overrides.

**Usage**

```java
page.route("**/*", route -> {
  // Override headers
  Map<String, String> headers = new HashMap<>(route.request().headers());
  headers.put("foo", "foo-value"); // set "foo" header
  headers.remove("bar"); // remove "bar" header
  route.resume(new Route.ResumeOptions().setHeaders(headers));
});
```

**Details**

The [`headers`](/java/api/class-route#route-continue-option-headers) option applies to both the routed request and any redirects it initiates. However, [`url`](/java/api/class-route#route-continue-option-url), [`method`](/java/api/class-route#route-continue-option-method), and [`postData`](/java/api/class-route#route-continue-option-post-data) only apply to the original request and are not carried over to redirected requests.

[`route.resume()`](/java/api/class-route#route-continue) will immediately send the request to the network, other matching handlers won't be invoked. Use [`route.fallback()`](/java/api/class-route#route-fallback) If you want next matching handler in the chain to be invoked.

::: warning
Some request headers are **forbidden** and cannot be overridden (for example, `Cookie`, `Host`, `Content-Length` and others, see [this MDN page](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_request_header) for full list).
If an override is provided for a forbidden header, it will be ignored and the original request header will be used.

To set custom cookies, use [`browserContext.addCookies()`](/java/api/class-browsercontext#browser-context-add-cookies).
:::

**Arguments**

- <a id="route-continue-option-options"></a>`options` `Object` *(optional)*

  - <a id="route-continue-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    If set changes the request HTTP headers. Header values will be converted to a string.
  - <a id="route-continue-option-method"></a>`method` `string` *(optional)*

    If set changes the request method (e.g. GET or POST).
  - <a id="route-continue-option-post-data"></a>`postData` `string | Buffer` *(optional)*

    If set changes the post data of request.
  - <a id="route-continue-option-url"></a>`url` `string` *(optional)*

    If set changes the request URL. New URL must have same protocol as original one.

