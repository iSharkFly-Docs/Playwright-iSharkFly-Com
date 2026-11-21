---
title: APIRequestContext
outline: 2
---

# APIRequestContext

<Badge type="info" text="Added in: v1.16" />

This API is used for the Web API testing. You can use it to trigger API endpoints, configure micro-services, prepare
environment or the service to your e2e test.

Each Playwright browser context has an associated [APIRequestContext](/api/class-apirequestcontext), accessible via
[`browserContext.request`](/api/class-browsercontext#browser-context-request) or [`page.request`](/api/class-page#page-request) (these return the

**same instance** — `page.request` is a shortcut for `page.context().request`).
You can also create a standalone, isolated instance with [`apiRequest.newContext()`](/api/class-apirequest#api-request-new-context).

**Cookie management**

The [APIRequestContext](/api/class-apirequestcontext) returned by [`browserContext.request`](/api/class-browsercontext#browser-context-request) and

[`page.request`](/api/class-page#page-request) uses the same cookie jar as its [BrowserContext](/api/class-browsercontext):

If you want API requests that do **not** share cookies with the browser, create an
isolated context via [`apiRequest.newContext()`](/api/class-apirequest#api-request-new-context). Such `APIRequestContext`
object will have its own isolated cookie storage.

## Methods

### apiRequestContext.addCookies() {#api-request-context-add-cookies}

<Badge type="info" text="Added in: v1.64" /> <Badge type="tip" text="async" />

Adds cookies into this request context. They will be sent with matching subsequent requests. For [`browserContext.request`](/api/class-browsercontext#browser-context-request)
and [`page.request`](/api/class-page#page-request), this is equivalent to calling [`browserContext.addCookies()`](/api/class-browsercontext#browser-context-add-cookies) on the corresponding browser context.

**Usage**

```js
await request.addCookies([cookieObject1, cookieObject2]);
```

**Arguments**

- <a id="api-request-context-add-cookies-option-cookies"></a>`cookies` `Array<Object>`

  - `name` `string`
  - `value` `string`
  - `url` `string` *(optional)*

    Either `url` or both `domain` and `path` are required. Optional.
  - `domain` `string` *(optional)*

    For the cookie to apply to all subdomains as well, prefix domain with a dot, like this: ".example.com". Either `url` or both `domain` and `path` are required. Optional.
  - `path` `string` *(optional)*

    Either `url` or both `domain` and `path` are required. Optional.
  - `expires` `float` *(optional)*

    Unix time in seconds. Optional.
  - `httpOnly` `boolean` *(optional)*

    Optional.
  - `secure` `boolean` *(optional)*

    Optional.
  - `sameSite` `"Strict" | "Lax" | "None"` *(optional)*

    Optional.
  - `partitionKey` `string` *(optional)*

    For partitioned third-party cookies (aka [CHIPS](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies)), the partition key. Optional.


### apiRequestContext.clearCookies() {#api-request-context-clear-cookies}

<Badge type="info" text="Added in: v1.64" /> <Badge type="tip" text="async" />

Removes cookies from this request context. Accepts optional filter. For [`browserContext.request`](/api/class-browsercontext#browser-context-request)
and [`page.request`](/api/class-page#page-request), this is equivalent to calling [`browserContext.clearCookies()`](/api/class-browsercontext#browser-context-clear-cookies) on the corresponding browser context.

**Usage**

```js
await request.clearCookies();
await request.clearCookies({ name: 'session-id' });
await request.clearCookies({ domain: 'my-origin.com' });
await request.clearCookies({ domain: /.*my-origin\.com/ });
await request.clearCookies({ path: '/api/v1' });
await request.clearCookies({ name: 'session-id', domain: 'my-origin.com' });
```

**Arguments**

- <a id="api-request-context-clear-cookies-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-clear-cookies-option-domain"></a>`domain` `string | RegExp` *(optional)*

    Only removes cookies with the given domain.
  - <a id="api-request-context-clear-cookies-option-name"></a>`name` `string | RegExp` *(optional)*

    Only removes cookies with the given name.
  - <a id="api-request-context-clear-cookies-option-path"></a>`path` `string | RegExp` *(optional)*

    Only removes cookies with the given path.


### apiRequestContext.cookies() {#api-request-context-cookies}

<Badge type="info" text="Added in: v1.64" /> <Badge type="tip" text="async" />

If no URLs are specified, this method returns all cookies. If URLs are specified, only cookies that affect those URLs
are returned. For [`browserContext.request`](/api/class-browsercontext#browser-context-request) and [`page.request`](/api/class-page#page-request), this is equivalent to calling
[`browserContext.cookies()`](/api/class-browsercontext#browser-context-cookies) on the corresponding browser context.

**Arguments**

- <a id="api-request-context-cookies-option-urls"></a>`urls` `string | Array<string>` *(optional)*

  Optional list of URLs.

**Returns**

- `Promise<Array<Object>>`


### apiRequestContext.delete() {#api-request-context-delete}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

Sends HTTP(S) [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-delete-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-delete-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-delete-option-data"></a>`data` `string | Buffer | Serializable` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Allows to set post data of the request. If the data parameter is an object other than a [Buffer], it will be serialized to JSON
    and the `content-type` header will be set to `application/json` if not explicitly set.

    If the data parameter is a string and the explicitly set `content-type` is `application/json` (case-insensitive,
    with optional parameters such as `charset=utf-8`), the string is sent as is if it parses as JSON.
    Otherwise, it is JSON-encoded as a string, including quotes and escaping. Strings with other content types
    are sent as is.

    Pass a [Buffer], such as `Buffer.from(body, 'utf8')`, to send exact bytes without JSON encoding,
    for example to send deliberately malformed JSON or a body used to compute a signature.
    For strings and buffers, the `content-type` header defaults to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-delete-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-delete-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.
  - <a id="api-request-context-delete-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-delete-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-delete-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-delete-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-delete-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed either as [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream)
    or as file-like object containing file name, mime-type and its content.

    - `name` `string` <Badge type="info" text="Added in: v1.17" />

      File name
    - `mimeType` `string` <Badge type="info" text="Added in: v1.17" />

      File type
    - `buffer` `Buffer` <Badge type="info" text="Added in: v1.17" />

      File content
  - <a id="api-request-context-delete-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-delete-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="api-request-context-delete-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `Promise<APIResponse>`


### apiRequestContext.dispose() {#api-request-context-dispose}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

All responses returned by [`apiRequestContext.get()`](/api/class-apirequestcontext#api-request-context-get) and similar methods are stored in the memory, so that you can later call [`apiResponse.body()`](/api/class-apiresponse#api-response-body).This method discards all its resources, calling any method on disposed [APIRequestContext](/api/class-apirequestcontext) will throw an exception.

**Arguments**

- <a id="api-request-context-dispose-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-dispose-option-reason"></a>`reason` `string` *(optional)* <Badge type="info" text="Added in: v1.45" />

    The reason to be reported to the operations interrupted by the context disposal.


### apiRequestContext.fetch() {#api-request-context-fetch}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

Sends HTTP(S) request and returns its response. The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Usage**

JSON objects can be passed directly to the request:

```js
await request.fetch('https://example.com/api/createBook', {
  method: 'post',
  data: {
    title: 'Book Title',
    author: 'John Doe',
  }
});
```

The common way to send file(s) in the body of a request is to upload them as form fields with `multipart/form-data` encoding, by specifiying the `multipart` parameter:

```js
const form = new FormData();
form.set('name', 'John');
form.append('name', 'Doe');
// Send two file fields with the same name.
form.append('file', new File(['console.log(2024);'], 'f1.js', { type: 'text/javascript' }));
form.append('file', new File(['hello'], 'f2.txt', { type: 'text/plain' }));
await request.fetch('https://example.com/api/uploadForm', {
  multipart: form
});
```

**Arguments**

- <a id="api-request-context-fetch-option-url-or-request"></a>`urlOrRequest` `string | Request`

  Target URL or Request to get all parameters from.
- <a id="api-request-context-fetch-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-fetch-option-data"></a>`data` `string | Buffer | Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object other than a [Buffer], it will be serialized to JSON
    and the `content-type` header will be set to `application/json` if not explicitly set.

    If the data parameter is a string and the explicitly set `content-type` is `application/json` (case-insensitive,
    with optional parameters such as `charset=utf-8`), the string is sent as is if it parses as JSON.
    Otherwise, it is JSON-encoded as a string, including quotes and escaping. Strings with other content types
    are sent as is.

    Pass a [Buffer], such as `Buffer.from(body, 'utf8')`, to send exact bytes without JSON encoding,
    for example to send deliberately malformed JSON or a body used to compute a signature.
    For strings and buffers, the `content-type` header defaults to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-fetch-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-fetch-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)*

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.
  - <a id="api-request-context-fetch-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-fetch-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-fetch-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-fetch-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-fetch-option-method"></a>`method` `string` *(optional)*

    If set changes the fetch method (e.g. [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) or
    [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)). If not specified, GET method is used.
  - <a id="api-request-context-fetch-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(optional)*

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed either as [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream)
    or as file-like object containing file name, mime-type and its content.

    - `name` `string`

      File name
    - `mimeType` `string`

      File type
    - `buffer` `Buffer`

      File content
  - <a id="api-request-context-fetch-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-fetch-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="api-request-context-fetch-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `Promise<APIResponse>`


### apiRequestContext.get() {#api-request-context-get}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

Sends HTTP(S) [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Usage**

Request parameters can be configured with `params` option, they will be serialized into the URL search parameters:

```js
// Passing params as object
await request.get('https://example.com/api/getText', {
  params: {
    'isbn': '1234',
    'page': 23,
  }
});

// Passing params as URLSearchParams
const searchParams = new URLSearchParams();
searchParams.set('isbn', '1234');
searchParams.append('page', 23);
searchParams.append('page', 24);
await request.get('https://example.com/api/getText', { params: searchParams });

// Passing params as string
const queryString = 'isbn=1234&page=23&page=24';
await request.get('https://example.com/api/getText', { params: queryString });
```

**Arguments**

- <a id="api-request-context-get-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-get-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-get-option-data"></a>`data` `string | Buffer | Serializable` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Allows to set post data of the request. If the data parameter is an object other than a [Buffer], it will be serialized to JSON
    and the `content-type` header will be set to `application/json` if not explicitly set.

    If the data parameter is a string and the explicitly set `content-type` is `application/json` (case-insensitive,
    with optional parameters such as `charset=utf-8`), the string is sent as is if it parses as JSON.
    Otherwise, it is JSON-encoded as a string, including quotes and escaping. Strings with other content types
    are sent as is.

    Pass a [Buffer], such as `Buffer.from(body, 'utf8')`, to send exact bytes without JSON encoding,
    for example to send deliberately malformed JSON or a body used to compute a signature.
    For strings and buffers, the `content-type` header defaults to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-get-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-get-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.
  - <a id="api-request-context-get-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-get-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-get-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-get-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-get-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed either as [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream)
    or as file-like object containing file name, mime-type and its content.

    - `name` `string` <Badge type="info" text="Added in: v1.26" />

      File name
    - `mimeType` `string` <Badge type="info" text="Added in: v1.26" />

      File type
    - `buffer` `Buffer` <Badge type="info" text="Added in: v1.26" />

      File content
  - <a id="api-request-context-get-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-get-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="api-request-context-get-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `Promise<APIResponse>`


### apiRequestContext.head() {#api-request-context-head}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

Sends HTTP(S) [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-head-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-head-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-head-option-data"></a>`data` `string | Buffer | Serializable` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Allows to set post data of the request. If the data parameter is an object other than a [Buffer], it will be serialized to JSON
    and the `content-type` header will be set to `application/json` if not explicitly set.

    If the data parameter is a string and the explicitly set `content-type` is `application/json` (case-insensitive,
    with optional parameters such as `charset=utf-8`), the string is sent as is if it parses as JSON.
    Otherwise, it is JSON-encoded as a string, including quotes and escaping. Strings with other content types
    are sent as is.

    Pass a [Buffer], such as `Buffer.from(body, 'utf8')`, to send exact bytes without JSON encoding,
    for example to send deliberately malformed JSON or a body used to compute a signature.
    For strings and buffers, the `content-type` header defaults to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-head-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-head-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.
  - <a id="api-request-context-head-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-head-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-head-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-head-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-head-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed either as [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream)
    or as file-like object containing file name, mime-type and its content.

    - `name` `string` <Badge type="info" text="Added in: v1.26" />

      File name
    - `mimeType` `string` <Badge type="info" text="Added in: v1.26" />

      File type
    - `buffer` `Buffer` <Badge type="info" text="Added in: v1.26" />

      File content
  - <a id="api-request-context-head-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-head-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="api-request-context-head-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `Promise<APIResponse>`


### apiRequestContext.patch() {#api-request-context-patch}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

Sends HTTP(S) [PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-patch-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-patch-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-patch-option-data"></a>`data` `string | Buffer | Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object other than a [Buffer], it will be serialized to JSON
    and the `content-type` header will be set to `application/json` if not explicitly set.

    If the data parameter is a string and the explicitly set `content-type` is `application/json` (case-insensitive,
    with optional parameters such as `charset=utf-8`), the string is sent as is if it parses as JSON.
    Otherwise, it is JSON-encoded as a string, including quotes and escaping. Strings with other content types
    are sent as is.

    Pass a [Buffer], such as `Buffer.from(body, 'utf8')`, to send exact bytes without JSON encoding,
    for example to send deliberately malformed JSON or a body used to compute a signature.
    For strings and buffers, the `content-type` header defaults to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-patch-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-patch-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)*

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.
  - <a id="api-request-context-patch-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-patch-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-patch-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-patch-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-patch-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(optional)*

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed either as [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream)
    or as file-like object containing file name, mime-type and its content.

    - `name` `string`

      File name
    - `mimeType` `string`

      File type
    - `buffer` `Buffer`

      File content
  - <a id="api-request-context-patch-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-patch-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="api-request-context-patch-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `Promise<APIResponse>`


### apiRequestContext.post() {#api-request-context-post}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

Sends HTTP(S) [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Usage**

JSON objects can be passed directly to the request:

```js
await request.post('https://example.com/api/createBook', {
  data: {
    title: 'Book Title',
    author: 'John Doe',
  }
});
```

To send form data to the server use `form` option. Its value will be encoded into the request body with `application/x-www-form-urlencoded` encoding (see below how to use `multipart/form-data` form encoding to send files):

```js
await request.post('https://example.com/api/findBook', {
  form: {
    title: 'Book Title',
    author: 'John Doe',
  }
});
```

The common way to send file(s) in the body of a request is to upload them as form fields with `multipart/form-data` encoding. Use [FormData] to construct request body and pass it to the request as `multipart` parameter:

```js
const form = new FormData();
form.set('name', 'John');
form.append('name', 'Doe');
// Send two file fields with the same name.
form.append('file', new File(['console.log(2024);'], 'f1.js', { type: 'text/javascript' }));
form.append('file', new File(['hello'], 'f2.txt', { type: 'text/plain' }));
await request.post('https://example.com/api/uploadForm', {
  multipart: form
});
```

**Arguments**

- <a id="api-request-context-post-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-post-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-post-option-data"></a>`data` `string | Buffer | Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object other than a [Buffer], it will be serialized to JSON
    and the `content-type` header will be set to `application/json` if not explicitly set.

    If the data parameter is a string and the explicitly set `content-type` is `application/json` (case-insensitive,
    with optional parameters such as `charset=utf-8`), the string is sent as is if it parses as JSON.
    Otherwise, it is JSON-encoded as a string, including quotes and escaping. Strings with other content types
    are sent as is.

    Pass a [Buffer], such as `Buffer.from(body, 'utf8')`, to send exact bytes without JSON encoding,
    for example to send deliberately malformed JSON or a body used to compute a signature.
    For strings and buffers, the `content-type` header defaults to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-post-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-post-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)*

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.
  - <a id="api-request-context-post-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-post-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-post-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-post-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-post-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(optional)*

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed either as [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream)
    or as file-like object containing file name, mime-type and its content.

    - `name` `string`

      File name
    - `mimeType` `string`

      File type
    - `buffer` `Buffer`

      File content
  - <a id="api-request-context-post-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-post-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="api-request-context-post-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `Promise<APIResponse>`


### apiRequestContext.put() {#api-request-context-put}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

Sends HTTP(S) [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-put-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-put-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-put-option-data"></a>`data` `string | Buffer | Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object other than a [Buffer], it will be serialized to JSON
    and the `content-type` header will be set to `application/json` if not explicitly set.

    If the data parameter is a string and the explicitly set `content-type` is `application/json` (case-insensitive,
    with optional parameters such as `charset=utf-8`), the string is sent as is if it parses as JSON.
    Otherwise, it is JSON-encoded as a string, including quotes and escaping. Strings with other content types
    are sent as is.

    Pass a [Buffer], such as `Buffer.from(body, 'utf8')`, to send exact bytes without JSON encoding,
    for example to send deliberately malformed JSON or a body used to compute a signature.
    For strings and buffers, the `content-type` header defaults to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-put-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-put-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)*

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.
  - <a id="api-request-context-put-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-put-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-put-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-put-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-put-option-multipart"></a>`multipart` `FormData | Object<string, string | float | boolean | ReadStream | Object>` *(optional)*

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed either as [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream)
    or as file-like object containing file name, mime-type and its content.

    - `name` `string`

      File name
    - `mimeType` `string`

      File type
    - `buffer` `Buffer`

      File content
  - <a id="api-request-context-put-option-params"></a>`params` `Object<string, string | float | boolean> | URLSearchParams | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-put-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="api-request-context-put-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `Promise<APIResponse>`


### apiRequestContext.storageState() {#api-request-context-storage-state}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

Returns storage state for this request context, contains current cookies and local storage snapshot if it was passed to the constructor.

**Arguments**

- <a id="api-request-context-storage-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-storage-state-option-indexed-db"></a>`indexedDB` `boolean` *(optional)* <Badge type="info" text="Added in: v1.51" />

    Set to `true` to include IndexedDB in the storage state snapshot.
  - <a id="api-request-context-storage-state-option-opfs"></a>`opfs` `boolean` *(optional)* <Badge type="info" text="Added in: v1.63" />

    Set to `true` to include the origin private file system in the storage state snapshot.
  - <a id="api-request-context-storage-state-option-path"></a>`path` `path` *(optional)*

    The file path to save the storage state to. If [`path`](/api/class-apirequestcontext#api-request-context-storage-state-option-path) is a relative path, then it is resolved relative to
    current working directory. If no path is provided, storage
    state is still returned, but won't be saved to the disk.

**Returns**

- `Promise<Object>`


## Properties

### apiRequestContext.tracing {#api-request-context-tracing}

<Badge type="info" text="Added in: v1.60" />

Tracing recorder for requests made through this API request context.

**Type**

- `Tracing`

