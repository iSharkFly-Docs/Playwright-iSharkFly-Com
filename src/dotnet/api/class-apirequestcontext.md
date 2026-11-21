---
title: APIRequestContext
outline: 2
---

# APIRequestContext

<Badge type="info" text="Added in: v1.16" />

This API is used for the Web API testing. You can use it to trigger API endpoints, configure micro-services, prepare
environment or the service to your e2e test.

Each Playwright browser context has an associated [APIRequestContext](/dotnet/api/class-apirequestcontext), accessible via
[`BrowserContext.APIRequest`](/dotnet/api/class-browsercontext#browser-context-request) or [`Page.APIRequest`](/dotnet/api/class-page#page-request) (these return the

**same instance** — `page.request` is a shortcut for `page.context().request`).
You can also create a standalone, isolated instance with [`ApiRequest.NewContextAsync()`](/dotnet/api/class-apirequest#api-request-new-context).

**Cookie management**

The [APIRequestContext](/dotnet/api/class-apirequestcontext) returned by [`BrowserContext.APIRequest`](/dotnet/api/class-browsercontext#browser-context-request) and

[`Page.APIRequest`](/dotnet/api/class-page#page-request) uses the same cookie jar as its [BrowserContext](/dotnet/api/class-browsercontext):

If you want API requests that do **not** share cookies with the browser, create an
isolated context via [`ApiRequest.NewContextAsync()`](/dotnet/api/class-apirequest#api-request-new-context). Such `APIRequestContext`
object will have its own isolated cookie storage.

## Methods

### ApiRequestContext.AddCookiesAsync() {#api-request-context-add-cookies}

<Badge type="info" text="Added in: v1.64" />

Adds cookies into this request context. They will be sent with matching subsequent requests. For [`BrowserContext.APIRequest`](/dotnet/api/class-browsercontext#browser-context-request)
and [`Page.APIRequest`](/dotnet/api/class-page#page-request), this is equivalent to calling [`BrowserContext.AddCookiesAsync()`](/dotnet/api/class-browsercontext#browser-context-add-cookies) on the corresponding browser context.

**Usage**

```csharp
await request.AddCookiesAsync(new[] { cookie1, cookie2 });
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


### ApiRequestContext.ClearCookiesAsync() {#api-request-context-clear-cookies}

<Badge type="info" text="Added in: v1.64" />

Removes cookies from this request context. Accepts optional filter. For [`BrowserContext.APIRequest`](/dotnet/api/class-browsercontext#browser-context-request)
and [`Page.APIRequest`](/dotnet/api/class-page#page-request), this is equivalent to calling [`BrowserContext.ClearCookiesAsync()`](/dotnet/api/class-browsercontext#browser-context-clear-cookies) on the corresponding browser context.

**Usage**

```csharp
await request.ClearCookiesAsync();
await request.ClearCookiesAsync(new() { Name = "session-id" });
await request.ClearCookiesAsync(new() { Domain = "my-origin.com" });
await request.ClearCookiesAsync(new() { Path = "/api/v1" });
await request.ClearCookiesAsync(new() { Name = "session-id", Domain = "my-origin.com" });
```

**Arguments**

- <a id="api-request-context-clear-cookies-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-clear-cookies-option-domain"></a>`domain` `string` *(optional)*

    Only removes cookies with the given domain.
  - <a id="api-request-context-clear-cookies-option-domain-regex"></a>`domainRegex` `RegExp` *(optional)*

    Only removes cookies with the given domain.
  - <a id="api-request-context-clear-cookies-option-domain-string"></a>`domainString` `string` *(optional)*

    Only removes cookies with the given domain.
  - <a id="api-request-context-clear-cookies-option-name"></a>`name` `string` *(optional)*

    Only removes cookies with the given name.
  - <a id="api-request-context-clear-cookies-option-name-regex"></a>`nameRegex` `RegExp` *(optional)*

    Only removes cookies with the given name.
  - <a id="api-request-context-clear-cookies-option-name-string"></a>`nameString` `string` *(optional)*

    Only removes cookies with the given name.
  - <a id="api-request-context-clear-cookies-option-path"></a>`path` `string` *(optional)*

    Only removes cookies with the given path.
  - <a id="api-request-context-clear-cookies-option-path-regex"></a>`pathRegex` `RegExp` *(optional)*

    Only removes cookies with the given path.
  - <a id="api-request-context-clear-cookies-option-path-string"></a>`pathString` `string` *(optional)*

    Only removes cookies with the given path.


### ApiRequestContext.CookiesAsync() {#api-request-context-cookies}

<Badge type="info" text="Added in: v1.64" />

If no URLs are specified, this method returns all cookies. If URLs are specified, only cookies that affect those URLs
are returned. For [`BrowserContext.APIRequest`](/dotnet/api/class-browsercontext#browser-context-request) and [`Page.APIRequest`](/dotnet/api/class-page#page-request), this is equivalent to calling
[`BrowserContext.CookiesAsync()`](/dotnet/api/class-browsercontext#browser-context-cookies) on the corresponding browser context.

**Arguments**

- <a id="api-request-context-cookies-option-urls"></a>`urls` `string | Array<string>` *(optional)*

  Optional list of URLs.

**Returns**

- `Array<Object>`


### ApiRequestContext.CreateFormData() {#api-request-context-create-form-data}

<Badge type="info" text="Added in: v1.23" />

Creates a new [FormData](/dotnet/api/class-formdata) instance which is used for providing form and multipart data when making HTTP requests.

**Returns**

- `FormData`


### ApiRequestContext.DeleteAsync() {#api-request-context-delete}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-delete-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-delete-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-delete-option-data"></a>`data` `string` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-delete-option-data-byte"></a>`dataByte` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-delete-option-data-object"></a>`dataObject` `Serializable` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-delete-option-data-string"></a>`dataString` `string` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-delete-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-delete-option-form"></a>`form` `FormData` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-delete-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-delete-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-delete-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-delete-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-delete-option-multipart"></a>`multipart` `FormData` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-delete-option-params"></a>`params` `Object<string, Serializable>` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-delete-option-params-string"></a>`paramsString` `string` *(optional)* <Badge type="info" text="Added in: v1.47" />

    Query parameters to be sent with the URL.
  - <a id="api-request-context-delete-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### ApiRequestContext.DisposeAsync() {#api-request-context-dispose}

<Badge type="info" text="Added in: v1.16" />

All responses returned by [`ApiRequestContext.GetAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-get) and similar methods are stored in the memory, so that you can later call [`ApiResponse.BodyAsync()`](/dotnet/api/class-apiresponse#api-response-body).This method discards all its resources, calling any method on disposed [APIRequestContext](/dotnet/api/class-apirequestcontext) will throw an exception.

**Arguments**

- <a id="api-request-context-dispose-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-dispose-option-reason"></a>`reason` `string` *(optional)* <Badge type="info" text="Added in: v1.45" />

    The reason to be reported to the operations interrupted by the context disposal.


### ApiRequestContext.FetchAsync() {#api-request-context-fetch}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) request and returns its response. The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Usage**

JSON objects can be passed directly to the request:

```csharp
var data = new Dictionary<string, object>() {
  { "title", "Book Title" },
  { "body", "John Doe" }
};
await Request.FetchAsync("https://example.com/api/createBook", new() { Method = "post", DataObject = data });
```

The common way to send file(s) in the body of a request is to upload them as form fields with `multipart/form-data` encoding, by specifiying the `multipart` parameter:

```csharp
var file = new FilePayload()
{
    Name = "f.js",
    MimeType = "text/javascript",
    Buffer = System.Text.Encoding.UTF8.GetBytes("console.log(2022);")
};
var multipart = Context.APIRequest.CreateFormData();
multipart.Set("fileField", file);
await Request.FetchAsync("https://example.com/api/uploadScript", new() { Method = "post", Multipart = multipart });
```

**Arguments**

- <a id="api-request-context-fetch-option-url-or-request"></a>`urlOrRequest` `string | Request`

  Target URL or Request to get all parameters from.
- <a id="api-request-context-fetch-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-fetch-option-data"></a>`data` `string` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-fetch-option-data-byte"></a>`dataByte` `Buffer` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-fetch-option-data-object"></a>`dataObject` `Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-fetch-option-data-string"></a>`dataString` `string` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-fetch-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-fetch-option-form"></a>`form` `FormData` *(optional)*

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
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
  - <a id="api-request-context-fetch-option-multipart"></a>`multipart` `FormData` *(optional)*

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-fetch-option-params"></a>`params` `Object<string, Serializable>` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-fetch-option-params-string"></a>`paramsString` `string` *(optional)* <Badge type="info" text="Added in: v1.47" />

    Query parameters to be sent with the URL.
  - <a id="api-request-context-fetch-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### ApiRequestContext.GetAsync() {#api-request-context-get}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Usage**

Request parameters can be configured with `params` option, they will be serialized into the URL search parameters:

```csharp
var queryParams = new Dictionary<string, object>()
{
  { "isbn", "1234" },
  { "page", 23 },
};
await request.GetAsync("https://example.com/api/getText", new() { Params = queryParams });
```

**Arguments**

- <a id="api-request-context-get-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-get-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-get-option-data"></a>`data` `string` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-get-option-data-byte"></a>`dataByte` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-get-option-data-object"></a>`dataObject` `Serializable` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-get-option-data-string"></a>`dataString` `string` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-get-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-get-option-form"></a>`form` `FormData` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-get-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-get-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-get-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-get-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-get-option-multipart"></a>`multipart` `FormData` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-get-option-params"></a>`params` `Object<string, Serializable>` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-get-option-params-string"></a>`paramsString` `string` *(optional)* <Badge type="info" text="Added in: v1.47" />

    Query parameters to be sent with the URL.
  - <a id="api-request-context-get-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### ApiRequestContext.HeadAsync() {#api-request-context-head}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-head-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-head-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-head-option-data"></a>`data` `string` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-head-option-data-byte"></a>`dataByte` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-head-option-data-object"></a>`dataObject` `Serializable` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-head-option-data-string"></a>`dataString` `string` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-head-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-head-option-form"></a>`form` `FormData` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-head-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-head-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-head-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-head-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-head-option-multipart"></a>`multipart` `FormData` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-head-option-params"></a>`params` `Object<string, Serializable>` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-head-option-params-string"></a>`paramsString` `string` *(optional)* <Badge type="info" text="Added in: v1.47" />

    Query parameters to be sent with the URL.
  - <a id="api-request-context-head-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### ApiRequestContext.PatchAsync() {#api-request-context-patch}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-patch-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-patch-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-patch-option-data"></a>`data` `string` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-patch-option-data-byte"></a>`dataByte` `Buffer` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-patch-option-data-object"></a>`dataObject` `Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-patch-option-data-string"></a>`dataString` `string` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-patch-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-patch-option-form"></a>`form` `FormData` *(optional)*

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-patch-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-patch-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-patch-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-patch-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-patch-option-multipart"></a>`multipart` `FormData` *(optional)*

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-patch-option-params"></a>`params` `Object<string, Serializable>` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-patch-option-params-string"></a>`paramsString` `string` *(optional)* <Badge type="info" text="Added in: v1.47" />

    Query parameters to be sent with the URL.
  - <a id="api-request-context-patch-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### ApiRequestContext.PostAsync() {#api-request-context-post}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Usage**

JSON objects can be passed directly to the request:

```csharp
var data = new Dictionary<string, object>() {
  { "firstName", "John" },
  { "lastName", "Doe" }
};
await request.PostAsync("https://example.com/api/createBook", new() { DataObject = data });
```

To send form data to the server use `form` option. Its value will be encoded into the request body with `application/x-www-form-urlencoded` encoding (see below how to use `multipart/form-data` form encoding to send files):

```csharp
var formData = Context.APIRequest.CreateFormData();
formData.Set("title", "Book Title");
formData.Set("body", "John Doe");
await request.PostAsync("https://example.com/api/findBook", new() { Form = formData });
```

The common way to send file(s) in the body of a request is to upload them as form fields with `multipart/form-data` encoding. Use [FormData](/dotnet/api/class-formdata) to construct request body and pass it to the request as `multipart` parameter:

```csharp
var file = new FilePayload()
{
    Name = "f.js",
    MimeType = "text/javascript",
    Buffer = System.Text.Encoding.UTF8.GetBytes("console.log(2022);")
};
var multipart = Context.APIRequest.CreateFormData();
multipart.Set("fileField", file);
await request.PostAsync("https://example.com/api/uploadScript", new() { Multipart = multipart });
```

**Arguments**

- <a id="api-request-context-post-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-post-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-post-option-data"></a>`data` `string` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-post-option-data-byte"></a>`dataByte` `Buffer` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-post-option-data-object"></a>`dataObject` `Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-post-option-data-string"></a>`dataString` `string` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-post-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-post-option-form"></a>`form` `FormData` *(optional)*

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-post-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-post-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-post-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-post-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-post-option-multipart"></a>`multipart` `FormData` *(optional)*

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-post-option-params"></a>`params` `Object<string, Serializable>` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-post-option-params-string"></a>`paramsString` `string` *(optional)* <Badge type="info" text="Added in: v1.47" />

    Query parameters to be sent with the URL.
  - <a id="api-request-context-post-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### ApiRequestContext.PutAsync() {#api-request-context-put}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-put-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-put-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-put-option-data"></a>`data` `string` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-put-option-data-byte"></a>`dataByte` `Buffer` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-put-option-data-object"></a>`dataObject` `Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-put-option-data-string"></a>`dataString` `string` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-put-option-fail-on-status-code"></a>`failOnStatusCode` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-put-option-form"></a>`form` `FormData` *(optional)*

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-put-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-put-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-put-option-max-redirects"></a>`maxRedirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-put-option-max-retries"></a>`maxRetries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-put-option-multipart"></a>`multipart` `FormData` *(optional)*

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.

    An instance of [FormData](/dotnet/api/class-formdata) can be created via [`ApiRequestContext.CreateFormData()`](/dotnet/api/class-apirequestcontext#api-request-context-create-form-data).
  - <a id="api-request-context-put-option-params"></a>`params` `Object<string, Serializable>` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-put-option-params-string"></a>`paramsString` `string` *(optional)* <Badge type="info" text="Added in: v1.47" />

    Query parameters to be sent with the URL.
  - <a id="api-request-context-put-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### ApiRequestContext.StorageStateAsync() {#api-request-context-storage-state}

<Badge type="info" text="Added in: v1.16" />

Returns storage state for this request context, contains current cookies and local storage snapshot if it was passed to the constructor.

**Arguments**

- <a id="api-request-context-storage-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-storage-state-option-indexed-db"></a>`indexedDB` `boolean` *(optional)* <Badge type="info" text="Added in: v1.51" />

    Set to `true` to include IndexedDB in the storage state snapshot.
  - <a id="api-request-context-storage-state-option-opfs"></a>`opfs` `boolean` *(optional)* <Badge type="info" text="Added in: v1.63" />

    Set to `true` to include the origin private file system in the storage state snapshot.
  - <a id="api-request-context-storage-state-option-path"></a>`path` `path` *(optional)*

    The file path to save the storage state to. If [`path`](/dotnet/api/class-apirequestcontext#api-request-context-storage-state-option-path) is a relative path, then it is resolved relative to
    current working directory. If no path is provided, storage
    state is still returned, but won't be saved to the disk.

**Returns**

- `string`


## Properties

### ApiRequestContext.Tracing {#api-request-context-tracing}

<Badge type="info" text="Added in: v1.60" />

Tracing recorder for requests made through this API request context.

**Type**

- `Tracing`

