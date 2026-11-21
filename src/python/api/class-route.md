---
title: Route
outline: 2
---

# Route

<Badge type="info" text="Added in: v1.8" />

Whenever a network route is set up with [`page.route()`](/python/api/class-page#page-route) or [`browser_context.route()`](/python/api/class-browsercontext#browser-context-route), the `Route` object
allows to handle the route.

Learn more about [networking](../network.md).

## Methods

### route.abort() {#route-abort}

<Badge type="info" text="Added in: v1.8" />

Aborts the route's request.

**Arguments**

- <a id="route-abort-option-error-code"></a>`error_code` `string` *(optional)*

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


### route.continue_() {#route-continue}

<Badge type="info" text="Added in: v1.8" />

Sends route's request to the network with optional overrides.

**Usage**

::: code-group

```python [Async]
async def handle(route, request):
    # override headers
    headers = {
        **request.headers,
        "foo": "foo-value", # set "foo" header
        "bar": None # remove "bar" header
    }
    await route.continue_(headers=headers)

await page.route("**/*", handle)
```

```python [Sync]
def handle(route, request):
    # override headers
    headers = {
        **request.headers,
        "foo": "foo-value", # set "foo" header
        "bar": None # remove "bar" header
    }
    route.continue_(headers=headers)

page.route("**/*", handle)
```

:::

**Details**

The [`headers`](/python/api/class-route#route-continue-option-headers) option applies to both the routed request and any redirects it initiates. However, [`url`](/python/api/class-route#route-continue-option-url), [`method`](/python/api/class-route#route-continue-option-method), and [`post_data`](/python/api/class-route#route-continue-option-post-data) only apply to the original request and are not carried over to redirected requests.

[`route.continue_()`](/python/api/class-route#route-continue) will immediately send the request to the network, other matching handlers won't be invoked. Use [`route.fallback()`](/python/api/class-route#route-fallback) If you want next matching handler in the chain to be invoked.

::: warning
Some request headers are **forbidden** and cannot be overridden (for example, `Cookie`, `Host`, `Content-Length` and others, see [this MDN page](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_request_header) for full list).
If an override is provided for a forbidden header, it will be ignored and the original request header will be used.

To set custom cookies, use [`browser_context.add_cookies()`](/python/api/class-browsercontext#browser-context-add-cookies).
:::

**Arguments**

- <a id="route-continue-option-options"></a>`options` `Object` *(optional)*

  - <a id="route-continue-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    If set changes the request HTTP headers. Header values will be converted to a string.
  - <a id="route-continue-option-method"></a>`method` `string` *(optional)*

    If set changes the request method (e.g. GET or POST).
  - <a id="route-continue-option-post-data"></a>`post_data` `string | Buffer | Serializable` *(optional)*

    If set changes the post data of request.
  - <a id="route-continue-option-url"></a>`url` `string` *(optional)*

    If set changes the request URL. New URL must have same protocol as original one.


### route.fallback() {#route-fallback}

<Badge type="info" text="Added in: v1.23" />

Continues route's request with optional overrides. The method is similar to [`route.continue_()`](/python/api/class-route#route-continue) with the difference that other matching handlers will be invoked before sending the request.

**Usage**

When several routes match the given pattern, they run in the order opposite to their registration.
That way the last registered route can always override all the previous ones. In the example below,
request will be handled by the bottom-most handler first, then it'll fall back to the previous one and
in the end will be aborted by the first registered route.

::: code-group

```python [Async]
await page.route("**/*", lambda route: route.abort())  # Runs last.
await page.route("**/*", lambda route: route.fallback())  # Runs second.
await page.route("**/*", lambda route: route.fallback())  # Runs first.
```

```python [Sync]
page.route("**/*", lambda route: route.abort())  # Runs last.
page.route("**/*", lambda route: route.fallback())  # Runs second.
page.route("**/*", lambda route: route.fallback())  # Runs first.
```

:::

Registering multiple routes is useful when you want separate handlers to
handle different kinds of requests, for example API calls vs page resources or
GET requests vs POST requests as in the example below.

::: code-group

```python [Async]
# Handle GET requests.
async def handle_get(route):
    if route.request.method != "GET":
        await route.fallback()
        return
  # Handling GET only.
  # ...

# Handle POST requests.
async def handle_post(route):
    if route.request.method != "POST":
        await route.fallback()
        return
  # Handling POST only.
  # ...

await page.route("**/*", handle_get)
await page.route("**/*", handle_post)
```

```python [Sync]
# Handle GET requests.
def handle_get(route):
    if route.request.method != "GET":
        route.fallback()
        return
  # Handling GET only.
  # ...

# Handle POST requests.
def handle_post(route):
    if route.request.method != "POST":
        route.fallback()
        return
  # Handling POST only.
  # ...

page.route("**/*", handle_get)
page.route("**/*", handle_post)
```

:::

One can also modify request while falling back to the subsequent handler, that way intermediate
route handler can modify url, method, headers and postData of the request.

::: code-group

```python [Async]
async def handle(route, request):
    # override headers
    headers = {
        **request.headers,
        "foo": "foo-value", # set "foo" header
        "bar": None # remove "bar" header
    }
    await route.fallback(headers=headers)

await page.route("**/*", handle)
```

```python [Sync]
def handle(route, request):
    # override headers
    headers = {
        **request.headers,
        "foo": "foo-value", # set "foo" header
        "bar": None # remove "bar" header
    }
    route.fallback(headers=headers)

page.route("**/*", handle)
```

:::

Use [`route.continue_()`](/python/api/class-route#route-continue) to immediately send the request to the network, other matching handlers won't be invoked in that case.

**Arguments**

- <a id="route-fallback-option-options"></a>`options` `Object` *(optional)*

  - <a id="route-fallback-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    If set changes the request HTTP headers. Header values will be converted to a string.
  - <a id="route-fallback-option-method"></a>`method` `string` *(optional)*

    If set changes the request method (e.g. GET or POST).
  - <a id="route-fallback-option-post-data"></a>`post_data` `string | Buffer | Serializable` *(optional)*

    If set changes the post data of request.
  - <a id="route-fallback-option-url"></a>`url` `string` *(optional)*

    If set changes the request URL. New URL must have same protocol as original one. Changing the URL won't
    affect the route matching, all the routes are matched using the original request URL.


### route.fetch() {#route-fetch}

<Badge type="info" text="Added in: v1.29" />

Performs the request and fetches result without fulfilling it, so that the response
could be modified and then fulfilled.

**Usage**

::: code-group

```python [Async]
async def handle(route):
    response = await route.fetch()
    json = await response.json()
    json["message"]["big_red_dog"] = []
    await route.fulfill(response=response, json=json)

await page.route("https://dog.ceo/api/breeds/list/all", handle)
```

```python [Sync]
def handle(route):
    response = route.fetch()
    json = response.json()
    json["message"]["big_red_dog"] = []
    route.fulfill(response=response, json=json)

page.route("https://dog.ceo/api/breeds/list/all", handle)
```

:::

**Details**

Note that [`headers`](/python/api/class-route#route-fetch-option-headers) option will apply to the fetched request as well as any redirects initiated by it. If you want to only apply [`headers`](/python/api/class-route#route-fetch-option-headers) to the original request, but not to redirects, look into [`route.continue_()`](/python/api/class-route#route-continue) instead.

**Arguments**

- <a id="route-fetch-option-options"></a>`options` `Object` *(optional)*

  - <a id="route-fetch-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    If set changes the request HTTP headers. Header values will be converted to a string.
  - <a id="route-fetch-option-max-redirects"></a>`max_redirects` `int` *(optional)* <Badge type="info" text="Added in: v1.31" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="route-fetch-option-max-retries"></a>`max_retries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="route-fetch-option-method"></a>`method` `string` *(optional)*

    If set changes the request method (e.g. GET or POST).
  - <a id="route-fetch-option-post-data"></a>`post_data` `string | Buffer | Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
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

::: code-group

```python [Async]
await page.route("**/*", lambda route: route.fulfill(
    status=404,
    content_type="text/plain",
    body="not found!"))
```

```python [Sync]
page.route("**/*", lambda route: route.fulfill(
    status=404,
    content_type="text/plain",
    body="not found!"))
```

:::

An example of serving static file:

::: code-group

```python [Async]
await page.route("**/xhr_endpoint", lambda route: route.fulfill(path="mock_data.json"))
```

```python [Sync]
page.route("**/xhr_endpoint", lambda route: route.fulfill(path="mock_data.json"))
```

:::

**Arguments**

- <a id="route-fulfill-option-options"></a>`options` `Object` *(optional)*

  - <a id="route-fulfill-option-body"></a>`body` `string | Buffer` *(optional)*

    Response body.
  - <a id="route-fulfill-option-content-type"></a>`content_type` `string` *(optional)*

    If set, equals to setting `Content-Type` response header.
  - <a id="route-fulfill-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Response headers. Header values will be converted to a string.
  - <a id="route-fulfill-option-json"></a>`json` `Serializable` *(optional)* <Badge type="info" text="Added in: v1.29" />

    JSON response. This method will set the content type to `application/json` if not set.
  - <a id="route-fulfill-option-path"></a>`path` `path` *(optional)*

    File path to respond with. The content type will be inferred from file extension. If `path` is a relative path, then it
    is resolved relative to the current working directory.
  - <a id="route-fulfill-option-response"></a>`response` `APIResponse` *(optional)* <Badge type="info" text="Added in: v1.15" />

    [APIResponse](/python/api/class-apiresponse) to fulfill route's request with. Individual fields of the response (such as headers) can be overridden using fulfill options.
  - <a id="route-fulfill-option-status"></a>`status` `int` *(optional)*

    Response status code, defaults to `200`.


### route.request() {#route-request}

<Badge type="info" text="Added in: v1.8" />

A request to be routed.

**Returns**

- `Request`

