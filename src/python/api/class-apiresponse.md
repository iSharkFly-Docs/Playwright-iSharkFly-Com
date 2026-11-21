---
title: APIResponse
outline: 2
---

# APIResponse

<Badge type="info" text="Added in: v1.16" />

[APIResponse](/python/api/class-apiresponse) class represents responses returned by [`api_request_context.get()`](/python/api/class-apirequestcontext#api-request-context-get) and similar methods.

::: code-group

```python [Async]
import asyncio
from playwright.async_api import async_playwright, Playwright

async def run(playwright: Playwright):
    context = await playwright.request.new_context()
    response = await context.get("https://example.com/user/repos")
    assert response.ok
    assert response.status == 200
    assert response.headers["content-type"] == "application/json; charset=utf-8"
    json_data = await response.json()
    assert json_data["name"] == "foobar"
    assert await response.body() == '{"status": "ok"}'


async def main():
    async with async_playwright() as playwright:
        await run(playwright)

asyncio.run(main())
```

```python [Sync]
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    context = playwright.request.new_context()
    response = context.get("https://example.com/user/repos")
    assert response.ok
    assert response.status == 200
    assert response.headers["content-type"] == "application/json; charset=utf-8"
    assert response.json()["name"] == "foobar"
    assert response.body() == '{"status": "ok"}'
```

:::

## Methods

### api_response.body() {#api-response-body}

<Badge type="info" text="Added in: v1.16" />

Returns the buffer with response body.

**Returns**

- `Buffer`


### api_response.dispose() {#api-response-dispose}

<Badge type="info" text="Added in: v1.16" />

Disposes the body of this response. If not called then the body will stay in memory until the context closes.


### api_response.headers() {#api-response-headers}

<Badge type="info" text="Added in: v1.16" />

An object with all the response HTTP headers associated with this response.

**Returns**

- `Object<string, string>`


### api_response.headers_array() {#api-response-headers-array}

<Badge type="info" text="Added in: v1.16" />

An array with all the response HTTP headers associated with this response. Header names are not lower-cased.
Headers with multiple entries, such as `Set-Cookie`, appear in the array multiple times.

**Returns**

- `Array<Object>`


### api_response.json() {#api-response-json}

<Badge type="info" text="Added in: v1.16" />

Returns the JSON representation of response body.

This method will throw if the response body is not parsable via `JSON.parse`.

**Returns**

- `Serializable`


### api_response.ok() {#api-response-ok}

<Badge type="info" text="Added in: v1.16" />

Contains a boolean stating whether the response was successful (status in the range 200-299) or not.

**Returns**

- `boolean`


### api_response.security_details() {#api-response-security-details}

<Badge type="info" text="Added in: v1.61" />

Returns SSL and other security information. Resolves to `null` for non-HTTPS responses. For redirected requests, returns the information for the last request in the redirect chain.

**Returns**

- `null | Object`


### api_response.server_addr() {#api-response-server-addr}

<Badge type="info" text="Added in: v1.61" />

Returns the IP address and port of the server. Resolves to `null` if the server address is not available. For redirected requests, returns the information for the last request in the redirect chain.

**Returns**

- `null | Object`


### api_response.status() {#api-response-status}

<Badge type="info" text="Added in: v1.16" />

Contains the status code of the response (e.g., 200 for a success).

**Returns**

- `int`


### api_response.status_text() {#api-response-status-text}

<Badge type="info" text="Added in: v1.16" />

Contains the status text of the response (e.g. usually an "OK" for a success).

**Returns**

- `string`


### api_response.text() {#api-response-text}

<Badge type="info" text="Added in: v1.16" />

Returns the text representation of response body.

**Returns**

- `string`


### api_response.timing() {#api-response-timing}

<Badge type="info" text="Added in: v1.62" />

Returns resource timing information for given response. For redirected requests, returns the information for the last
request in the redirect chain. When the response is served [from the HAR file](../mock.md#replaying-from-har), timing
information is not available and all the values are -1. Find more information at
[Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming).

**Returns**

- `Object`


### api_response.url() {#api-response-url}

<Badge type="info" text="Added in: v1.16" />

Contains the URL of the response.

**Returns**

- `string`

