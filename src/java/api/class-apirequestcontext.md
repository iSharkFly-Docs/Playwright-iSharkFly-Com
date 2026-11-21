---
title: APIRequestContext
outline: 2
---

# APIRequestContext

<Badge type="info" text="Added in: v1.16" />

This API is used for the Web API testing. You can use it to trigger API endpoints, configure micro-services, prepare
environment or the service to your e2e test.

Each Playwright browser context has an associated [APIRequestContext](/java/api/class-apirequestcontext), accessible via
[`browserContext.request()`](/java/api/class-browsercontext#browser-context-request) or [`page.request()`](/java/api/class-page#page-request) (these return the

**same instance** — `page.request` is a shortcut for `page.context().request`).
You can also create a standalone, isolated instance with [`apiRequest.newContext()`](/java/api/class-apirequest#api-request-new-context).

**Cookie management**

The [APIRequestContext](/java/api/class-apirequestcontext) returned by [`browserContext.request()`](/java/api/class-browsercontext#browser-context-request) and

[`page.request()`](/java/api/class-page#page-request) uses the same cookie jar as its [BrowserContext](/java/api/class-browsercontext):

If you want API requests that do **not** share cookies with the browser, create an
isolated context via [`apiRequest.newContext()`](/java/api/class-apirequest#api-request-new-context). Such `APIRequestContext`
object will have its own isolated cookie storage.

## Methods

### apiRequestContext.addCookies() {#api-request-context-add-cookies}

<Badge type="info" text="Added in: v1.64" />

Adds cookies into this request context. They will be sent with matching subsequent requests. For [`browserContext.request()`](/java/api/class-browsercontext#browser-context-request)
and [`page.request()`](/java/api/class-page#page-request), this is equivalent to calling [`browserContext.addCookies()`](/java/api/class-browsercontext#browser-context-add-cookies) on the corresponding browser context.

**Usage**

```java
request.addCookies(Arrays.asList(cookieObject1, cookieObject2));
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

<Badge type="info" text="Added in: v1.64" />

Removes cookies from this request context. Accepts optional filter. For [`browserContext.request()`](/java/api/class-browsercontext#browser-context-request)
and [`page.request()`](/java/api/class-page#page-request), this is equivalent to calling [`browserContext.clearCookies()`](/java/api/class-browsercontext#browser-context-clear-cookies) on the corresponding browser context.

**Usage**

```java
request.clearCookies();
request.clearCookies(new APIRequestContext.ClearCookiesOptions().setName("session-id"));
request.clearCookies(new APIRequestContext.ClearCookiesOptions().setDomain("my-origin.com"));
request.clearCookies(new APIRequestContext.ClearCookiesOptions().setPath("/api/v1"));
request.clearCookies(new APIRequestContext.ClearCookiesOptions()
                         .setName("session-id")
                         .setDomain("my-origin.com"));
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

<Badge type="info" text="Added in: v1.64" />

If no URLs are specified, this method returns all cookies. If URLs are specified, only cookies that affect those URLs
are returned. For [`browserContext.request()`](/java/api/class-browsercontext#browser-context-request) and [`page.request()`](/java/api/class-page#page-request), this is equivalent to calling
[`browserContext.cookies()`](/java/api/class-browsercontext#browser-context-cookies) on the corresponding browser context.

**Arguments**

- <a id="api-request-context-cookies-option-urls"></a>`urls` `string | Array<string>` *(optional)*

  Optional list of URLs.

**Returns**

- `Array<Object>`


### apiRequestContext.delete() {#api-request-context-delete}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-delete-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-delete-option-params"></a>`options` `RequestOptions` *(optional)* <Badge type="info" text="Added in: v1.18" />

  Optional request parameters.

**Returns**

- `APIResponse`


### apiRequestContext.dispose() {#api-request-context-dispose}

<Badge type="info" text="Added in: v1.16" />

All responses returned by [`apiRequestContext.get()`](/java/api/class-apirequestcontext#api-request-context-get) and similar methods are stored in the memory, so that you can later call [`apiResponse.body()`](/java/api/class-apiresponse#api-response-body).This method discards all its resources, calling any method on disposed [APIRequestContext](/java/api/class-apirequestcontext) will throw an exception.

**Arguments**

- <a id="api-request-context-dispose-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-dispose-option-reason"></a>`reason` `string` *(optional)* <Badge type="info" text="Added in: v1.45" />

    The reason to be reported to the operations interrupted by the context disposal.


### apiRequestContext.fetch() {#api-request-context-fetch}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) request and returns its response. The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Usage**

JSON objects can be passed directly to the request:

```java
Map<String, Object> data = new HashMap();
data.put("title", "Book Title");
data.put("body", "John Doe");
request.fetch("https://example.com/api/createBook", RequestOptions.create().setMethod("post").setData(data));
```

The common way to send file(s) in the body of a request is to upload them as form fields with `multipart/form-data` encoding, by specifiying the `multipart` parameter:

```java
// Pass file path to the form data constructor:
Path file = Paths.get("team.csv");
APIResponse response = request.fetch("https://example.com/api/uploadTeamList",
  RequestOptions.create().setMethod("post").setMultipart(
    FormData.create().set("fileField", file)));

// Or you can pass the file content directly as FilePayload object:
FilePayload filePayload = new FilePayload("f.js", "text/javascript",
      "console.log(2022);".getBytes(StandardCharsets.UTF_8));
APIResponse response = request.fetch("https://example.com/api/uploadScript",
  RequestOptions.create().setMethod("post").setMultipart(
    FormData.create().set("fileField", filePayload)));
```

**Arguments**

- <a id="api-request-context-fetch-option-url-or-request"></a>`urlOrRequest` `string | Request`

  Target URL or Request to get all parameters from.
- <a id="api-request-context-fetch-option-params"></a>`options` `RequestOptions` *(optional)* <Badge type="info" text="Added in: v1.18" />

  Optional request parameters.

**Returns**

- `APIResponse`


### apiRequestContext.get() {#api-request-context-get}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Usage**

Request parameters can be configured with `params` option, they will be serialized into the URL search parameters:

```java
request.get("https://example.com/api/getText", RequestOptions.create()
  .setQueryParam("isbn", "1234")
  .setQueryParam("page", 23));
```

**Arguments**

- <a id="api-request-context-get-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-get-option-params"></a>`options` `RequestOptions` *(optional)* <Badge type="info" text="Added in: v1.18" />

  Optional request parameters.

**Returns**

- `APIResponse`


### apiRequestContext.head() {#api-request-context-head}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-head-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-head-option-params"></a>`options` `RequestOptions` *(optional)* <Badge type="info" text="Added in: v1.18" />

  Optional request parameters.

**Returns**

- `APIResponse`


### apiRequestContext.patch() {#api-request-context-patch}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-patch-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-patch-option-params"></a>`options` `RequestOptions` *(optional)* <Badge type="info" text="Added in: v1.18" />

  Optional request parameters.

**Returns**

- `APIResponse`


### apiRequestContext.post() {#api-request-context-post}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Usage**

JSON objects can be passed directly to the request:

```java
Map<String, Object> data = new HashMap();
data.put("title", "Book Title");
data.put("body", "John Doe");
request.post("https://example.com/api/createBook", RequestOptions.create().setData(data));
```

To send form data to the server use `form` option. Its value will be encoded into the request body with `application/x-www-form-urlencoded` encoding (see below how to use `multipart/form-data` form encoding to send files):

```java
request.post("https://example.com/api/findBook", RequestOptions.create().setForm(
    FormData.create().set("title", "Book Title").set("body", "John Doe")
));
```

The common way to send file(s) in the body of a request is to upload them as form fields with `multipart/form-data` encoding. Use [FormData](/java/api/class-formdata) to construct request body and pass it to the request as `multipart` parameter:

```java
// Pass file path to the form data constructor:
Path file = Paths.get("team.csv");
APIResponse response = request.post("https://example.com/api/uploadTeamList",
  RequestOptions.create().setMultipart(
    FormData.create().set("fileField", file)));

// Or you can pass the file content directly as FilePayload object:
FilePayload filePayload1 = new FilePayload("f1.js", "text/javascript",
      "console.log(2022);".getBytes(StandardCharsets.UTF_8));
APIResponse response = request.post("https://example.com/api/uploadScript",
  RequestOptions.create().setMultipart(
    FormData.create().set("fileField", filePayload)));
```

**Arguments**

- <a id="api-request-context-post-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-post-option-params"></a>`options` `RequestOptions` *(optional)* <Badge type="info" text="Added in: v1.18" />

  Optional request parameters.

**Returns**

- `APIResponse`


### apiRequestContext.put() {#api-request-context-put}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-put-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-put-option-params"></a>`options` `RequestOptions` *(optional)* <Badge type="info" text="Added in: v1.18" />

  Optional request parameters.

**Returns**

- `APIResponse`


### apiRequestContext.storageState() {#api-request-context-storage-state}

<Badge type="info" text="Added in: v1.16" />

Returns storage state for this request context, contains current cookies and local storage snapshot if it was passed to the constructor.

**Arguments**

- <a id="api-request-context-storage-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-storage-state-option-indexed-db"></a>`indexedDB` `boolean` *(optional)* <Badge type="info" text="Added in: v1.51" />

    Set to `true` to include IndexedDB in the storage state snapshot.
  - <a id="api-request-context-storage-state-option-opfs"></a>`opfs` `boolean` *(optional)* <Badge type="info" text="Added in: v1.63" />

    Set to `true` to include the origin private file system in the storage state snapshot.
  - <a id="api-request-context-storage-state-option-path"></a>`path` `path` *(optional)*

    The file path to save the storage state to. If [`path`](/java/api/class-apirequestcontext#api-request-context-storage-state-option-path) is a relative path, then it is resolved relative to
    current working directory. If no path is provided, storage
    state is still returned, but won't be saved to the disk.

**Returns**

- `string`


## Properties

### apiRequestContext.tracing() {#api-request-context-tracing}

<Badge type="info" text="Added in: v1.60" />

Tracing recorder for requests made through this API request context.

**Type**

- `Tracing`

