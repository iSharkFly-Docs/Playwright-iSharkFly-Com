---
title: APIRequestContext
outline: 2
---

# APIRequestContext

<Badge type="info" text="Added in: v1.16" />

This API is used for the Web API testing. You can use it to trigger API endpoints, configure micro-services, prepare
environment or the service to your e2e test.

Each Playwright browser context has an associated [APIRequestContext](/python/api/class-apirequestcontext), accessible via
[`browser_context.request`](/python/api/class-browsercontext#browser-context-request) or [`page.request`](/python/api/class-page#page-request) (these return the

**same instance** — `page.request` is a shortcut for `page.context().request`).
You can also create a standalone, isolated instance with [`api_request.new_context()`](/python/api/class-apirequest#api-request-new-context).

**Cookie management**

The [APIRequestContext](/python/api/class-apirequestcontext) returned by [`browser_context.request`](/python/api/class-browsercontext#browser-context-request) and

[`page.request`](/python/api/class-page#page-request) uses the same cookie jar as its [BrowserContext](/python/api/class-browsercontext):

If you want API requests that do **not** share cookies with the browser, create an
isolated context via [`api_request.new_context()`](/python/api/class-apirequest#api-request-new-context). Such `APIRequestContext`
object will have its own isolated cookie storage.

::: code-group

```python [Async]
import os
import asyncio
from playwright.async_api import async_playwright, Playwright

REPO = "test-repo-1"
USER = "github-username"
API_TOKEN = os.getenv("GITHUB_API_TOKEN")

async def run(playwright: Playwright):
    # This will launch a new browser, create a context and page. When making HTTP
    # requests with the internal APIRequestContext (e.g. `context.request` or `page.request`)
    # it will automatically set the cookies to the browser page and vice versa.
    browser = await playwright.chromium.launch()
    context = await browser.new_context(base_url="https://api.github.com")
    api_request_context = context.request
    page = await context.new_page()

    # Alternatively you can create a APIRequestContext manually without having a browser context attached:
    # api_request_context = await playwright.request.new_context(base_url="https://api.github.com")

    # Create a repository.
    response = await api_request_context.post(
        "/user/repos",
        headers={
            "Accept": "application/vnd.github.v3+json",
            # Add GitHub personal access token.
            "Authorization": f"token {API_TOKEN}",
        },
        data={"name": REPO},
    )
    assert response.ok
    assert response.json()["name"] == REPO

    # Delete a repository.
    response = await api_request_context.delete(
        f"/repos/{USER}/{REPO}",
        headers={
            "Accept": "application/vnd.github.v3+json",
            # Add GitHub personal access token.
            "Authorization": f"token {API_TOKEN}",
        },
    )
    assert response.ok
    assert await response.body() == '{"status": "ok"}'

async def main():
    async with async_playwright() as playwright:
        await run(playwright)

asyncio.run(main())
```

```python [Sync]
import os
from playwright.sync_api import sync_playwright

REPO = "test-repo-1"
USER = "github-username"
API_TOKEN = os.getenv("GITHUB_API_TOKEN")

with sync_playwright() as p:
    # This will launch a new browser, create a context and page. When making HTTP
    # requests with the internal APIRequestContext (e.g. `context.request` or `page.request`)
    # it will automatically set the cookies to the browser page and vice versa.
    browser = p.chromium.launch()
    context = browser.new_context(base_url="https://api.github.com")
    api_request_context = context.request
    page = context.new_page()

    # Alternatively you can create a APIRequestContext manually without having a browser context attached:
    # api_request_context = p.request.new_context(base_url="https://api.github.com")


    # Create a repository.
    response = api_request_context.post(
        "/user/repos",
        headers={
            "Accept": "application/vnd.github.v3+json",
            # Add GitHub personal access token.
            "Authorization": f"token {API_TOKEN}",
        },
        data={"name": REPO},
    )
    assert response.ok
    assert response.json()["name"] == REPO

    # Delete a repository.
    response = api_request_context.delete(
        f"/repos/{USER}/{REPO}",
        headers={
            "Accept": "application/vnd.github.v3+json",
            # Add GitHub personal access token.
            "Authorization": f"token {API_TOKEN}",
        },
    )
    assert response.ok
    assert await response.body() == '{"status": "ok"}'
```

:::

## Methods

### api_request_context.add_cookies() {#api-request-context-add-cookies}

<Badge type="info" text="Added in: v1.64" />

Adds cookies into this request context. They will be sent with matching subsequent requests. For [`browser_context.request`](/python/api/class-browsercontext#browser-context-request)
and [`page.request`](/python/api/class-page#page-request), this is equivalent to calling [`browser_context.add_cookies()`](/python/api/class-browsercontext#browser-context-add-cookies) on the corresponding browser context.

**Usage**

::: code-group

```python [Async]
await request.add_cookies([cookie_object1, cookie_object2])
```

```python [Sync]
request.add_cookies([cookie_object1, cookie_object2])
```

:::

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
  - `http_only` `boolean` *(optional)*

    Optional.
  - `secure` `boolean` *(optional)*

    Optional.
  - `same_site` `"Strict" | "Lax" | "None"` *(optional)*

    Optional.
  - `partition_key` `string` *(optional)*

    For partitioned third-party cookies (aka [CHIPS](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies)), the partition key. Optional.


### api_request_context.clear_cookies() {#api-request-context-clear-cookies}

<Badge type="info" text="Added in: v1.64" />

Removes cookies from this request context. Accepts optional filter. For [`browser_context.request`](/python/api/class-browsercontext#browser-context-request)
and [`page.request`](/python/api/class-page#page-request), this is equivalent to calling [`browser_context.clear_cookies()`](/python/api/class-browsercontext#browser-context-clear-cookies) on the corresponding browser context.

**Usage**

::: code-group

```python [Async]
await request.clear_cookies()
await request.clear_cookies(name="session-id")
await request.clear_cookies(domain="my-origin.com")
await request.clear_cookies(path="/api/v1")
await request.clear_cookies(name="session-id", domain="my-origin.com")
```

```python [Sync]
request.clear_cookies()
request.clear_cookies(name="session-id")
request.clear_cookies(domain="my-origin.com")
request.clear_cookies(path="/api/v1")
request.clear_cookies(name="session-id", domain="my-origin.com")
```

:::

**Arguments**

- <a id="api-request-context-clear-cookies-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-clear-cookies-option-domain"></a>`domain` `string | RegExp` *(optional)*

    Only removes cookies with the given domain.
  - <a id="api-request-context-clear-cookies-option-name"></a>`name` `string | RegExp` *(optional)*

    Only removes cookies with the given name.
  - <a id="api-request-context-clear-cookies-option-path"></a>`path` `string | RegExp` *(optional)*

    Only removes cookies with the given path.


### api_request_context.cookies() {#api-request-context-cookies}

<Badge type="info" text="Added in: v1.64" />

If no URLs are specified, this method returns all cookies. If URLs are specified, only cookies that affect those URLs
are returned. For [`browser_context.request`](/python/api/class-browsercontext#browser-context-request) and [`page.request`](/python/api/class-page#page-request), this is equivalent to calling
[`browser_context.cookies()`](/python/api/class-browsercontext#browser-context-cookies) on the corresponding browser context.

**Arguments**

- <a id="api-request-context-cookies-option-urls"></a>`urls` `string | Array<string>` *(optional)*

  Optional list of URLs.

**Returns**

- `Array<Object>`


### api_request_context.delete() {#api-request-context-delete}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-delete-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-delete-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-delete-option-data"></a>`data` `string | Buffer | Serializable` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-delete-option-fail-on-status-code"></a>`fail_on_status_code` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-delete-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided. Use [FormData](/python/api/class-formdata) to send multiple values for the same field.
  - <a id="api-request-context-delete-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-delete-option-ignore-https-errors"></a>`ignore_https_errors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-delete-option-max-redirects"></a>`max_redirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-delete-option-max-retries"></a>`max_retries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-delete-option-multipart"></a>`multipart` `Object<string, string | float | boolean | ReadStream | Object> | FormData` *(optional)* <Badge type="info" text="Added in: v1.17" />

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.
    Use [FormData](/python/api/class-formdata) to send multiple files in the same field.

    - `name` `string` <Badge type="info" text="Added in: v1.17" />

      File name
    - `mime_type` `string` <Badge type="info" text="Added in: v1.17" />

      File type
    - `buffer` `Buffer` <Badge type="info" text="Added in: v1.17" />

      File content
  - <a id="api-request-context-delete-option-params"></a>`params` `Object<string, string | float | boolean> | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-delete-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### api_request_context.dispose() {#api-request-context-dispose}

<Badge type="info" text="Added in: v1.16" />

All responses returned by [`api_request_context.get()`](/python/api/class-apirequestcontext#api-request-context-get) and similar methods are stored in the memory, so that you can later call [`api_response.body()`](/python/api/class-apiresponse#api-response-body).This method discards all its resources, calling any method on disposed [APIRequestContext](/python/api/class-apirequestcontext) will throw an exception.

**Arguments**

- <a id="api-request-context-dispose-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-dispose-option-reason"></a>`reason` `string` *(optional)* <Badge type="info" text="Added in: v1.45" />

    The reason to be reported to the operations interrupted by the context disposal.


### api_request_context.fetch() {#api-request-context-fetch}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) request and returns its response. The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Usage**

JSON objects can be passed directly to the request:

```python
data = {
    "title": "Book Title",
    "body": "John Doe",
}
api_request_context.fetch("https://example.com/api/createBook", method="post", data=data)
```

The common way to send file(s) in the body of a request is to upload them as form fields with `multipart/form-data` encoding, by specifiying the `multipart` parameter:

```python
api_request_context.fetch(
  "https://example.com/api/uploadScript",  method="post",
  multipart={
    "fileField": {
      "name": "f.js",
      "mimeType": "text/javascript",
      "buffer": b"console.log(2022);",
    },
  })
```

**Arguments**

- <a id="api-request-context-fetch-option-url-or-request"></a>`url_or_request` `string | Request`

  Target URL or Request to get all parameters from.
- <a id="api-request-context-fetch-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-fetch-option-data"></a>`data` `string | Buffer | Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-fetch-option-fail-on-status-code"></a>`fail_on_status_code` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-fetch-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)*

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided. Use [FormData](/python/api/class-formdata) to send multiple values for the same field.
  - <a id="api-request-context-fetch-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-fetch-option-ignore-https-errors"></a>`ignore_https_errors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-fetch-option-max-redirects"></a>`max_redirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-fetch-option-max-retries"></a>`max_retries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-fetch-option-method"></a>`method` `string` *(optional)*

    If set changes the fetch method (e.g. [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) or
    [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)). If not specified, GET method is used.
  - <a id="api-request-context-fetch-option-multipart"></a>`multipart` `Object<string, string | float | boolean | ReadStream | Object> | FormData` *(optional)*

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.
    Use [FormData](/python/api/class-formdata) to send multiple files in the same field.

    - `name` `string`

      File name
    - `mime_type` `string`

      File type
    - `buffer` `Buffer`

      File content
  - <a id="api-request-context-fetch-option-params"></a>`params` `Object<string, string | float | boolean> | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-fetch-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### api_request_context.get() {#api-request-context-get}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Usage**

Request parameters can be configured with `params` option, they will be serialized into the URL search parameters:

```python
query_params = {
  "isbn": "1234",
  "page": "23"
}
api_request_context.get("https://example.com/api/getText", params=query_params)
```

**Arguments**

- <a id="api-request-context-get-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-get-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-get-option-data"></a>`data` `string | Buffer | Serializable` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-get-option-fail-on-status-code"></a>`fail_on_status_code` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-get-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided. Use [FormData](/python/api/class-formdata) to send multiple values for the same field.
  - <a id="api-request-context-get-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-get-option-ignore-https-errors"></a>`ignore_https_errors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-get-option-max-redirects"></a>`max_redirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-get-option-max-retries"></a>`max_retries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-get-option-multipart"></a>`multipart` `Object<string, string | float | boolean | ReadStream | Object> | FormData` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.
    Use [FormData](/python/api/class-formdata) to send multiple files in the same field.

    - `name` `string` <Badge type="info" text="Added in: v1.26" />

      File name
    - `mime_type` `string` <Badge type="info" text="Added in: v1.26" />

      File type
    - `buffer` `Buffer` <Badge type="info" text="Added in: v1.26" />

      File content
  - <a id="api-request-context-get-option-params"></a>`params` `Object<string, string | float | boolean> | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-get-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### api_request_context.head() {#api-request-context-head}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-head-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-head-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-head-option-data"></a>`data` `string | Buffer | Serializable` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-head-option-fail-on-status-code"></a>`fail_on_status_code` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-head-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided. Use [FormData](/python/api/class-formdata) to send multiple values for the same field.
  - <a id="api-request-context-head-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-head-option-ignore-https-errors"></a>`ignore_https_errors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-head-option-max-redirects"></a>`max_redirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-head-option-max-retries"></a>`max_retries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-head-option-multipart"></a>`multipart` `Object<string, string | float | boolean | ReadStream | Object> | FormData` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.
    Use [FormData](/python/api/class-formdata) to send multiple files in the same field.

    - `name` `string` <Badge type="info" text="Added in: v1.26" />

      File name
    - `mime_type` `string` <Badge type="info" text="Added in: v1.26" />

      File type
    - `buffer` `Buffer` <Badge type="info" text="Added in: v1.26" />

      File content
  - <a id="api-request-context-head-option-params"></a>`params` `Object<string, string | float | boolean> | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-head-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### api_request_context.patch() {#api-request-context-patch}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-patch-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-patch-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-patch-option-data"></a>`data` `string | Buffer | Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-patch-option-fail-on-status-code"></a>`fail_on_status_code` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-patch-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)*

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided. Use [FormData](/python/api/class-formdata) to send multiple values for the same field.
  - <a id="api-request-context-patch-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-patch-option-ignore-https-errors"></a>`ignore_https_errors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-patch-option-max-redirects"></a>`max_redirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-patch-option-max-retries"></a>`max_retries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-patch-option-multipart"></a>`multipart` `Object<string, string | float | boolean | ReadStream | Object> | FormData` *(optional)*

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.
    Use [FormData](/python/api/class-formdata) to send multiple files in the same field.

    - `name` `string`

      File name
    - `mime_type` `string`

      File type
    - `buffer` `Buffer`

      File content
  - <a id="api-request-context-patch-option-params"></a>`params` `Object<string, string | float | boolean> | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-patch-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### api_request_context.post() {#api-request-context-post}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Usage**

JSON objects can be passed directly to the request:

```python
data = {
    "title": "Book Title",
    "body": "John Doe",
}
api_request_context.post("https://example.com/api/createBook", data=data)
```

To send form data to the server use `form` option. Its value will be encoded into the request body with `application/x-www-form-urlencoded` encoding (see below how to use `multipart/form-data` form encoding to send files):

```python
formData = {
    "title": "Book Title",
    "body": "John Doe",
}
api_request_context.post("https://example.com/api/findBook", form=formData)
```

The common way to send file(s) in the body of a request is to upload them as form fields with `multipart/form-data` encoding. Use [FormData](/python/api/class-formdata) to construct request body and pass it to the request as `multipart` parameter:

```python
api_request_context.post(
  "https://example.com/api/uploadScript'",
  multipart={
    "fileField": {
      "name": "f.js",
      "mimeType": "text/javascript",
      "buffer": b"console.log(2022);",
    },
  })
```

**Arguments**

- <a id="api-request-context-post-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-post-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-post-option-data"></a>`data` `string | Buffer | Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-post-option-fail-on-status-code"></a>`fail_on_status_code` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-post-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)*

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided. Use [FormData](/python/api/class-formdata) to send multiple values for the same field.
  - <a id="api-request-context-post-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-post-option-ignore-https-errors"></a>`ignore_https_errors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-post-option-max-redirects"></a>`max_redirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-post-option-max-retries"></a>`max_retries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-post-option-multipart"></a>`multipart` `Object<string, string | float | boolean | ReadStream | Object> | FormData` *(optional)*

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.
    Use [FormData](/python/api/class-formdata) to send multiple files in the same field.

    - `name` `string`

      File name
    - `mime_type` `string`

      File type
    - `buffer` `Buffer`

      File content
  - <a id="api-request-context-post-option-params"></a>`params` `Object<string, string | float | boolean> | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-post-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### api_request_context.put() {#api-request-context-put}

<Badge type="info" text="Added in: v1.16" />

Sends HTTP(S) [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) request and returns its response.
The method will populate request cookies from the context and update
context cookies from the response. The method will automatically follow redirects.

**Arguments**

- <a id="api-request-context-put-option-url"></a>`url` `string`

  Target URL.
- <a id="api-request-context-put-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-put-option-data"></a>`data` `string | Buffer | Serializable` *(optional)*

    Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
    and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will be
    set to `application/octet-stream` if not explicitly set.
  - <a id="api-request-context-put-option-fail-on-status-code"></a>`fail_on_status_code` `boolean` *(optional)*

    Whether to throw on response codes other than 2xx and 3xx. By default response object is returned
    for all status codes.
  - <a id="api-request-context-put-option-form"></a>`form` `Object<string, string | float | boolean> | FormData` *(optional)*

    Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `application/x-www-form-urlencoded`
    unless explicitly provided. Use [FormData](/python/api/class-formdata) to send multiple values for the same field.
  - <a id="api-request-context-put-option-headers"></a>`headers` `Object<string, string>` *(optional)*

    Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by it.
  - <a id="api-request-context-put-option-ignore-https-errors"></a>`ignore_https_errors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="api-request-context-put-option-max-redirects"></a>`max_redirects` `int` *(optional)* <Badge type="info" text="Added in: v1.26" />

    Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded.
    Defaults to `20`. Pass `0` to not follow redirects.
  - <a id="api-request-context-put-option-max-retries"></a>`max_retries` `int` *(optional)* <Badge type="info" text="Added in: v1.46" />

    Maximum number of times network errors should be retried. Currently only `ECONNRESET` error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to `0` - no retries.
  - <a id="api-request-context-put-option-multipart"></a>`multipart` `Object<string, string | float | boolean | ReadStream | Object> | FormData` *(optional)*

    Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as
    this request body. If this parameter is specified `content-type` header will be set to `multipart/form-data`
    unless explicitly provided. File values can be passed as file-like object containing file name, mime-type and its content.
    Use [FormData](/python/api/class-formdata) to send multiple files in the same field.

    - `name` `string`

      File name
    - `mime_type` `string`

      File type
    - `buffer` `Buffer`

      File content
  - <a id="api-request-context-put-option-params"></a>`params` `Object<string, string | float | boolean> | string` *(optional)*

    Query parameters to be sent with the URL.
  - <a id="api-request-context-put-option-timeout"></a>`timeout` `float` *(optional)*

    Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `APIResponse`


### api_request_context.storage_state() {#api-request-context-storage-state}

<Badge type="info" text="Added in: v1.16" />

Returns storage state for this request context, contains current cookies and local storage snapshot if it was passed to the constructor.

**Arguments**

- <a id="api-request-context-storage-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="api-request-context-storage-state-option-indexed-db"></a>`indexed_db` `boolean` *(optional)* <Badge type="info" text="Added in: v1.51" />

    Set to `true` to include IndexedDB in the storage state snapshot.
  - <a id="api-request-context-storage-state-option-opfs"></a>`opfs` `boolean` *(optional)* <Badge type="info" text="Added in: v1.63" />

    Set to `true` to include the origin private file system in the storage state snapshot.
  - <a id="api-request-context-storage-state-option-path"></a>`path` `path` *(optional)*

    The file path to save the storage state to. If [`path`](/python/api/class-apirequestcontext#api-request-context-storage-state-option-path) is a relative path, then it is resolved relative to
    current working directory. If no path is provided, storage
    state is still returned, but won't be saved to the disk.

**Returns**

- `Object`


## Properties

### api_request_context.tracing {#api-request-context-tracing}

<Badge type="info" text="Added in: v1.60" />

Tracing recorder for requests made through this API request context.

**Type**

- `Tracing`

