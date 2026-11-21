---
title: BrowserContext
outline: 2
---

# BrowserContext

<Badge type="info" text="Added in: v1.8" />

BrowserContexts provide a way to operate multiple independent browser sessions.

If a page opens another page, e.g. with a `window.open` call, the popup will belong to the parent page's browser
context.

Playwright allows creating isolated non-persistent browser contexts with [`browser.new_context()`](/python/api/class-browser#browser-new-context) method. Non-persistent browser
contexts don't write any browsing data to disk.

::: code-group

```python [Async]
# create a new incognito browser context
context = await browser.new_context()
# create a new page inside context.
page = await context.new_page()
await page.goto("https://example.com")
# dispose context once it is no longer needed.
await context.close()
```

```python [Sync]
# create a new incognito browser context
context = browser.new_context()
# create a new page inside context.
page = context.new_page()
page.goto("https://example.com")
# dispose context once it is no longer needed.
context.close()
```

:::

## Methods

### browser_context.add_cookies() {#browser-context-add-cookies}

<Badge type="info" text="Added in: v1.8" />

Adds cookies into this browser context. All pages within this context will have these cookies installed. Cookies can be
obtained via [`browser_context.cookies()`](/python/api/class-browsercontext#browser-context-cookies).

**Usage**

::: code-group

```python [Async]
await browser_context.add_cookies([cookie_object1, cookie_object2])
```

```python [Sync]
browser_context.add_cookies([cookie_object1, cookie_object2])
```

:::

**Arguments**

- <a id="browser-context-add-cookies-option-cookies"></a>`cookies` `Array<Object>`

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


### browser_context.add_init_script() {#browser-context-add-init-script}

<Badge type="info" text="Added in: v1.8" />

Adds a script which would be evaluated in one of the following scenarios:
* Whenever a page is created in the browser context or is navigated.
* Whenever a child frame is attached or navigated in any page in the browser context. In this case, the script is
  evaluated in the context of the newly attached frame.

The script is evaluated after the document was created but before any of its scripts were run. This is useful to amend
the JavaScript environment, e.g. to seed `Math.random`.

**Usage**

An example of overriding `Math.random` before the page loads:

::: code-group

```python [Async]
# in your playwright script, assuming the preload.js file is in same directory.
await browser_context.add_init_script(path="preload.js")
```

```python [Sync]
# in your playwright script, assuming the preload.js file is in same directory.
browser_context.add_init_script(path="preload.js")
```

:::

::: info
The order of evaluation of multiple scripts installed via [`browser_context.add_init_script()`](/python/api/class-browsercontext#browser-context-add-init-script) and
[`page.add_init_script()`](/python/api/class-page#page-add-init-script) is not defined.
:::

**Arguments**

- <a id="browser-context-add-init-script-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-add-init-script-option-path"></a>`path` `path` *(optional)*

    Path to the JavaScript file. If `path` is a relative path, then it is resolved relative to the current working directory. Optional.
- <a id="browser-context-add-init-script-option-script"></a>`script` `string` *(optional)*

  Script to be evaluated in all pages in the browser context. Optional.

**Returns**

- `Disposable`


### browser_context.browser() {#browser-context-browser}

<Badge type="info" text="Added in: v1.8" />

Gets the browser instance that owns the context. Returns `null` if the context is created outside of normal browser, e.g. Android or Electron.

**Returns**

- `null | Browser`


### browser_context.clear_cookies() {#browser-context-clear-cookies}

<Badge type="info" text="Added in: v1.8" />

Removes cookies from context. Accepts optional filter.

**Usage**

::: code-group

```python [Async]
await context.clear_cookies()
await context.clear_cookies(name="session-id")
await context.clear_cookies(domain="my-origin.com")
await context.clear_cookies(path="/api/v1")
await context.clear_cookies(name="session-id", domain="my-origin.com")
```

```python [Sync]
context.clear_cookies()
context.clear_cookies(name="session-id")
context.clear_cookies(domain="my-origin.com")
context.clear_cookies(path="/api/v1")
context.clear_cookies(name="session-id", domain="my-origin.com")
```

:::

**Arguments**

- <a id="browser-context-clear-cookies-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-clear-cookies-option-domain"></a>`domain` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given domain.
  - <a id="browser-context-clear-cookies-option-name"></a>`name` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given name.
  - <a id="browser-context-clear-cookies-option-path"></a>`path` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given path.


### browser_context.clear_permissions() {#browser-context-clear-permissions}

<Badge type="info" text="Added in: v1.8" />

Clears all permission overrides for the browser context.

**Usage**

::: code-group

```python [Async]
context = await browser.new_context()
await context.grant_permissions(["clipboard-read"])
# do stuff ..
context.clear_permissions()
```

```python [Sync]
context = browser.new_context()
context.grant_permissions(["clipboard-read"])
# do stuff ..
context.clear_permissions()
```

:::


### browser_context.close() {#browser-context-close}

<Badge type="info" text="Added in: v1.8" />

Closes the browser context. All the pages that belong to the browser context will be closed.

::: info
The default browser context cannot be closed.
:::

**Arguments**

- <a id="browser-context-close-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-close-option-reason"></a>`reason` `string` *(optional)* <Badge type="info" text="Added in: v1.40" />

    The reason to be reported to the operations interrupted by the context closure.


### browser_context.cookies() {#browser-context-cookies}

<Badge type="info" text="Added in: v1.8" />

If no URLs are specified, this method returns all cookies. If URLs are specified, only cookies that affect those URLs
are returned.

**Arguments**

- <a id="browser-context-cookies-option-urls"></a>`urls` `string | Array<string>` *(optional)*

  Optional list of URLs.

**Returns**

- `Array<Object>`


### browser_context.expect_console_message() {#browser-context-wait-for-console-message}

<Badge type="info" text="Added in: v1.34" />

Performs action and waits for a [ConsoleMessage](/python/api/class-consolemessage) to be logged by in the pages in the context. If predicate is provided, it passes
[ConsoleMessage](/python/api/class-consolemessage) value into the `predicate` function and waits for `predicate(message)` to return a truthy value.
Will throw an error if the page is closed before the [`browserContext.on("console")`](/python/api/class-browsercontext#browser-context-event-console) event is fired.

**Arguments**

- <a id="browser-context-wait-for-console-message-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-wait-for-console-message-option-predicate"></a>`predicate` `function(ConsoleMessage): boolean` *(optional)*

    Receives the [ConsoleMessage](/python/api/class-consolemessage) object and resolves to truthy value when the waiting should resolve.
  - <a id="browser-context-wait-for-console-message-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `EventContextManager<ConsoleMessage>`


### browser_context.expect_event() {#browser-context-wait-for-event}

<Badge type="info" text="Added in: v1.8" />

Waits for event to fire and passes its value into the predicate function. Returns when the predicate returns truthy
value. Will throw an error if the context closes before the event is fired. Returns the event data value.

**Usage**

::: code-group

```python [Async]
async with context.expect_event("page") as event_info:
    await page.get_by_role("button").click()
page = await event_info.value
```

```python [Sync]
with context.expect_event("page") as event_info:
    page.get_by_role("button").click()
page = event_info.value
```

:::

**Arguments**

- <a id="browser-context-wait-for-event-option-event"></a>`event` `string`

  Event name, same one would pass into `browserContext.on(event)`.
- <a id="browser-context-wait-for-event-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-wait-for-event-option-predicate"></a>`predicate` `function()` *(optional)*

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - <a id="browser-context-wait-for-event-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `EventContextManager`


### browser_context.expect_page() {#browser-context-wait-for-page}

<Badge type="info" text="Added in: v1.9" />

Performs action and waits for a new [Page](/python/api/class-page) to be created in the context. If predicate is provided, it passes
[Page](/python/api/class-page) value into the `predicate` function and waits for `predicate(event)` to return a truthy value.
Will throw an error if the context closes before new [Page](/python/api/class-page) is created.

**Arguments**

- <a id="browser-context-wait-for-page-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-wait-for-page-option-predicate"></a>`predicate` `function(Page): boolean` *(optional)*

    Receives the [Page](/python/api/class-page) object and resolves to truthy value when the waiting should resolve.
  - <a id="browser-context-wait-for-page-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `EventContextManager<Page>`


### browser_context.expose_binding() {#browser-context-expose-binding}

<Badge type="info" text="Added in: v1.8" />

The method adds a function called [`name`](/python/api/class-browsercontext#browser-context-expose-binding-option-name) on the `window` object of every frame in every page in the context.
When called, the function executes [`callback`](/python/api/class-browsercontext#browser-context-expose-binding-option-callback) and returns a [Promise] which resolves to the return value of
[`callback`](/python/api/class-browsercontext#browser-context-expose-binding-option-callback). If the [`callback`](/python/api/class-browsercontext#browser-context-expose-binding-option-callback) returns a [Promise], it will be awaited.

The first argument of the [`callback`](/python/api/class-browsercontext#browser-context-expose-binding-option-callback) function contains information about the caller: `{ browserContext:
BrowserContext, page: Page, frame: Frame }`.

See [`page.expose_binding()`](/python/api/class-page#page-expose-binding) for page-only version.

**Usage**

An example of exposing page URL to all frames in all pages in the context:

::: code-group

```python [Async]
import asyncio
from playwright.async_api import async_playwright, Playwright

async def run(playwright: Playwright):
    webkit = playwright.webkit
    browser = await webkit.launch(headless=False)
    context = await browser.new_context()
    await context.expose_binding("pageURL", lambda source: source["page"].url)
    page = await context.new_page()
    await page.set_content("""
    <script>
      async function onClick() {
        document.querySelector('div').textContent = await window.pageURL();
      }
    </script>
    <button onclick="onClick()">Click me</button>
    <div></div>
    """)
    await page.get_by_role("button").click()

async def main():
    async with async_playwright() as playwright:
        await run(playwright)
asyncio.run(main())
```

```python [Sync]
from playwright.sync_api import sync_playwright, Playwright

def run(playwright: Playwright):
    webkit = playwright.webkit
    browser = webkit.launch(headless=False)
    context = browser.new_context()
    context.expose_binding("pageURL", lambda source: source["page"].url)
    page = context.new_page()
    page.set_content("""
    <script>
      async function onClick() {
        document.querySelector('div').textContent = await window.pageURL();
      }
    </script>
    <button onclick="onClick()">Click me</button>
    <div></div>
    """)
    page.get_by_role("button").click()

with sync_playwright() as playwright:
    run(playwright)
```

:::

**Arguments**

- <a id="browser-context-expose-binding-option-name"></a>`name` `string`

  Name of the function on the window object.
- <a id="browser-context-expose-binding-option-callback"></a>`callback` `function()`

  Callback function that will be called in the Playwright's context.

**Returns**

- `Disposable`


### browser_context.expose_function() {#browser-context-expose-function}

<Badge type="info" text="Added in: v1.8" />

The method adds a function called [`name`](/python/api/class-browsercontext#browser-context-expose-function-option-name) on the `window` object of every frame in every page in the context.
When called, the function executes [`callback`](/python/api/class-browsercontext#browser-context-expose-function-option-callback) and returns a [Promise] which resolves to the return value of
[`callback`](/python/api/class-browsercontext#browser-context-expose-function-option-callback).

If the [`callback`](/python/api/class-browsercontext#browser-context-expose-function-option-callback) returns a [Promise], it will be awaited.

See [`page.expose_function()`](/python/api/class-page#page-expose-function) for page-only version.

**Usage**

An example of adding a `sha256` function to all pages in the context:

::: code-group

```python [Async]
import asyncio
import hashlib
from playwright.async_api import async_playwright, Playwright

def sha256(text: str) -> str:
    m = hashlib.sha256()
    m.update(bytes(text, "utf8"))
    return m.hexdigest()


async def run(playwright: Playwright):
    webkit = playwright.webkit
    browser = await webkit.launch(headless=False)
    context = await browser.new_context()
    await context.expose_function("sha256", sha256)
    page = await context.new_page()
    await page.set_content("""
        <script>
          async function onClick() {
            document.querySelector('div').textContent = await window.sha256('PLAYWRIGHT');
          }
        </script>
        <button onclick="onClick()">Click me</button>
        <div></div>
    """)
    await page.get_by_role("button").click()

async def main():
    async with async_playwright() as playwright:
        await run(playwright)
asyncio.run(main())
```

```python [Sync]
import hashlib
from playwright.sync_api import sync_playwright

def sha256(text: str) -> str:
    m = hashlib.sha256()
    m.update(bytes(text, "utf8"))
    return m.hexdigest()


def run(playwright: Playwright):
    webkit = playwright.webkit
    browser = webkit.launch(headless=False)
    context = browser.new_context()
    context.expose_function("sha256", sha256)
    page = context.new_page()
    page.set_content("""
        <script>
          async function onClick() {
            document.querySelector('div').textContent = await window.sha256('PLAYWRIGHT');
          }
        </script>
        <button onclick="onClick()">Click me</button>
        <div></div>
    """)
    page.get_by_role("button").click()

with sync_playwright() as playwright:
    run(playwright)
```

:::

**Arguments**

- <a id="browser-context-expose-function-option-name"></a>`name` `string`

  Name of the function on the window object.
- <a id="browser-context-expose-function-option-callback"></a>`callback` `function()`

  Callback function that will be called in the Playwright's context.

**Returns**

- `Disposable`


### browser_context.grant_permissions() {#browser-context-grant-permissions}

<Badge type="info" text="Added in: v1.8" />

Grants specified permissions to the browser context. Only grants corresponding permissions to the given origin if
specified.

**Arguments**

- <a id="browser-context-grant-permissions-option-permissions"></a>`permissions` `Array<string>`

  A list of permissions to grant.

  ::: danger
  Supported permissions differ between browsers, and even between different versions of the same browser. Any permission may stop working after an update.
  :::

  Here are some permissions that may be supported by some browsers:
  * `'accelerometer'`
  * `'ambient-light-sensor'`
  * `'background-sync'`
  * `'camera'`
  * `'clipboard-read'`
  * `'clipboard-write'`
  * `'geolocation'`
  * `'gyroscope'`
  * `'local-fonts'`
  * `'local-network-access'`
  * `'magnetometer'`
  * `'microphone'`
  * `'midi-sysex'` (system-exclusive midi)
  * `'midi'`
  * `'notifications'`
  * `'payment-handler'`
  * `'storage-access'`
  * `'screen-wake-lock'`
- <a id="browser-context-grant-permissions-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-grant-permissions-option-origin"></a>`origin` `string` *(optional)*

    The [origin] to grant permissions to, e.g. "https://example.com".


### browser_context.is_closed() {#browser-context-is-closed}

<Badge type="info" text="Added in: v1.59" />

Indicates that the browser context is in the process of closing or has already been closed.

**Returns**

- `boolean`


### browser_context.new_cdp_session() {#browser-context-new-cdp-session}

<Badge type="info" text="Added in: v1.11" />

::: info
CDP sessions are only supported on Chromium-based browsers.
:::

Returns the newly created session.

**Arguments**

- <a id="browser-context-new-cdp-session-option-page"></a>`page` `Page | Frame`

  Target to create new session for. For backwards-compatibility, this parameter is
  named `page`, but it can be a `Page` or `Frame` type.

**Returns**

- `CDPSession`


### browser_context.new_page() {#browser-context-new-page}

<Badge type="info" text="Added in: v1.8" />

Creates a new page in the browser context.

**Returns**

- `Page`


### browser_context.pages() {#browser-context-pages}

<Badge type="info" text="Added in: v1.8" />

Returns all open pages in the context.

**Returns**

- `Array<Page>`


### browser_context.route() {#browser-context-route}

<Badge type="info" text="Added in: v1.8" />

Routing provides the capability to modify network requests that are made by any page in the browser context. Once route
is enabled, every request matching the url pattern will stall unless it's continued, fulfilled or aborted.

::: info
[`browser_context.route()`](/python/api/class-browsercontext#browser-context-route) will not intercept requests intercepted by Service Worker. See [this](https://github.com/microsoft/playwright/issues/1090) issue. We recommend disabling Service Workers when using request interception by setting [`service_workers`](/python/api/class-browser#browser-new-context-option-service-workers) to `'block'`.
:::

**Usage**

An example of a naive handler that aborts all image requests:

::: code-group

```python [Async]
context = await browser.new_context()
page = await context.new_page()
await context.route("**/*.{png,jpg,jpeg}", lambda route: route.abort())
await page.goto("https://example.com")
await browser.close()
```

```python [Sync]
context = browser.new_context()
page = context.new_page()
context.route("**/*.{png,jpg,jpeg}", lambda route: route.abort())
page.goto("https://example.com")
browser.close()
```

:::

or the same snippet using a regex pattern instead:

::: code-group

```python [Async]
context = await browser.new_context()
page = await context.new_page()
await context.route(re.compile(r"(\.png$)|(\.jpg$)"), lambda route: route.abort())
page = await context.new_page()
await page.goto("https://example.com")
await browser.close()
```

```python [Sync]
context = browser.new_context()
page = context.new_page()
context.route(re.compile(r"(\.png$)|(\.jpg$)"), lambda route: route.abort())
page = await context.new_page()
page = context.new_page()
page.goto("https://example.com")
browser.close()
```

:::

It is possible to examine the request to decide the route action. For example, mocking all requests that contain some post data, and leaving all other requests as is:

::: code-group

```python [Async]
async def handle_route(route: Route):
  if ("my-string" in route.request.post_data):
    await route.fulfill(body="mocked-data")
  else:
    await route.continue_()
await context.route("/api/**", handle_route)
```

```python [Sync]
def handle_route(route: Route):
  if ("my-string" in route.request.post_data):
    route.fulfill(body="mocked-data")
  else:
    route.continue_()
context.route("/api/**", handle_route)
```

:::

Page routes (set up with [`page.route()`](/python/api/class-page#page-route)) take precedence over browser context routes when request matches both
handlers.

To remove a route with its handler you can use [`browser_context.unroute()`](/python/api/class-browsercontext#browser-context-unroute).

::: info
Enabling routing disables http cache.
:::

**Arguments**

- <a id="browser-context-route-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  A glob pattern, regex pattern, or predicate that receives a [URL] to match during routing. If [`base_url`](/python/api/class-browser#browser-new-context-option-base-url) is set in the context options and the provided URL is a string that does not start with `*`, it is resolved using the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
- <a id="browser-context-route-option-handler"></a>`handler` `function(Route) | function(Route, Request)`

  handler function to route the request.
- <a id="browser-context-route-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-route-option-times"></a>`times` `int` *(optional)* <Badge type="info" text="Added in: v1.15" />

    How often a route should be used. By default it will be used every time.

**Returns**

- `Disposable`


### browser_context.route_from_har() {#browser-context-route-from-har}

<Badge type="info" text="Added in: v1.23" />

If specified the network requests that are made in the context will be served from the HAR file. Read more about [Replaying from HAR](../mock.md#replaying-from-har).

Playwright will not serve requests intercepted by Service Worker from the HAR file. See [this](https://github.com/microsoft/playwright/issues/1090) issue. We recommend disabling Service Workers when using request interception by setting [`service_workers`](/python/api/class-browser#browser-new-context-option-service-workers) to `'block'`.

**Arguments**

- <a id="browser-context-route-from-har-option-har"></a>`har` `path`

  Path to a [HAR](http://www.softwareishard.com/blog/har-12-spec) file with prerecorded network data. If `path` is a relative path, then it is resolved relative to the current working directory.
- <a id="browser-context-route-from-har-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-route-from-har-option-not-found"></a>`not_found` `"abort" | "fallback"` *(optional)*

    * If set to 'abort' any request not found in the HAR file will be aborted.
    * If set to 'fallback' falls through to the next route handler in the handler chain.

    Defaults to abort.
  - <a id="browser-context-route-from-har-option-update"></a>`update` `boolean` *(optional)*

    If specified, updates the given HAR with the actual network information instead of serving from file. The file is written to disk when [`browser_context.close()`](/python/api/class-browsercontext#browser-context-close) is called.
  - <a id="browser-context-route-from-har-option-update-content"></a>`update_content` `"embed" | "attach"` *(optional)* <Badge type="info" text="Added in: v1.32" />

    Optional setting to control resource content management. If `attach` is specified, resources are persisted as separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file.
  - <a id="browser-context-route-from-har-option-update-mode"></a>`update_mode` `"full" | "minimal"` *(optional)* <Badge type="info" text="Added in: v1.32" />

    When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `minimal`.
  - <a id="browser-context-route-from-har-option-url"></a>`url` `string | RegExp` *(optional)*

    A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.


### browser_context.route_web_socket() {#browser-context-route-web-socket}

<Badge type="info" text="Added in: v1.48" />

This method allows to modify websocket connections that are made by any page in the browser context.

Note that only `WebSocket`s created after this method was called will be routed. It is recommended to call this method before creating any pages.

**Usage**

Below is an example of a simple handler that blocks some websocket messages.
See [WebSocketRoute](/python/api/class-websocketroute) for more details and examples.

::: code-group

```python [Async]
def message_handler(server: WebSocketRoute, message: Union[str, bytes]):
  if message == "to-be-blocked":
    return
  server.send(message)

def handler(ws: WebSocketRoute):
  server = ws.connect_to_server()
  ws.on_message(lambda message: message_handler(server, message))

await context.route_web_socket("/ws", handler)
```

```python [Sync]
def message_handler(server: WebSocketRoute, message: Union[str, bytes]):
  if message == "to-be-blocked":
    return
  server.send(message)

def handler(ws: WebSocketRoute):
  server = ws.connect_to_server()
  ws.on_message(lambda message: message_handler(server, message))

context.route_web_socket("/ws", handler)
```

:::

**Arguments**

- <a id="browser-context-route-web-socket-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  Only WebSockets with the url matching this pattern will be routed. A string pattern can be relative to the [`base_url`](/python/api/class-browser#browser-new-context-option-base-url) context option.
- <a id="browser-context-route-web-socket-option-handler"></a>`handler` `function(WebSocketRoute): Promise<any> | any`

  Handler function to route the WebSocket.


### browser_context.service_workers() {#browser-context-service-workers}

<Badge type="info" text="Added in: v1.11" />

::: info
Service workers are only supported on Chromium-based browsers.
:::

All existing service workers in the context.

**Returns**

- `Array<Worker>`


### browser_context.set_default_navigation_timeout() {#browser-context-set-default-navigation-timeout}

<Badge type="info" text="Added in: v1.8" />

This setting will change the default maximum navigation time for the following methods and related shortcuts:
* [`page.go_back()`](/python/api/class-page#page-go-back)
* [`page.go_forward()`](/python/api/class-page#page-go-forward)
* [`page.goto()`](/python/api/class-page#page-goto)
* [`page.reload()`](/python/api/class-page#page-reload)
* [`page.set_content()`](/python/api/class-page#page-set-content)
* [`page.expect_navigation()`](/python/api/class-page#page-wait-for-navigation)

::: info
[`page.set_default_navigation_timeout()`](/python/api/class-page#page-set-default-navigation-timeout) and [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) take priority over
[`browser_context.set_default_navigation_timeout()`](/python/api/class-browsercontext#browser-context-set-default-navigation-timeout).
:::

**Arguments**

- <a id="browser-context-set-default-navigation-timeout-option-timeout"></a>`timeout` `float`

  Maximum navigation time in milliseconds


### browser_context.set_default_timeout() {#browser-context-set-default-timeout}

<Badge type="info" text="Added in: v1.8" />

This setting will change the default maximum time for all the methods accepting [`timeout`](/python/api/class-browsercontext#browser-context-set-default-timeout-option-timeout) option.

::: info
[`page.set_default_navigation_timeout()`](/python/api/class-page#page-set-default-navigation-timeout), [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) and
[`browser_context.set_default_navigation_timeout()`](/python/api/class-browsercontext#browser-context-set-default-navigation-timeout) take priority over [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout).
:::

**Arguments**

- <a id="browser-context-set-default-timeout-option-timeout"></a>`timeout` `float`

  Maximum time in milliseconds. Pass `0` to disable timeout.


### browser_context.set_extra_http_headers() {#browser-context-set-extra-http-headers}

<Badge type="info" text="Added in: v1.8" />

The extra HTTP headers will be sent with every request initiated by any page in the context. These headers are merged
with page-specific extra HTTP headers set with [`page.set_extra_http_headers()`](/python/api/class-page#page-set-extra-http-headers). If page overrides a particular
header, page-specific header value will be used instead of the browser context header value.

::: info
[`browser_context.set_extra_http_headers()`](/python/api/class-browsercontext#browser-context-set-extra-http-headers) does not guarantee the order of headers in the outgoing requests.
:::

**Arguments**

- <a id="browser-context-set-extra-http-headers-option-headers"></a>`headers` `Object<string, string>`

  An object containing additional HTTP headers to be sent with every request. All header values must be strings.


### browser_context.set_geolocation() {#browser-context-set-geolocation}

<Badge type="info" text="Added in: v1.8" />

Sets the context's geolocation. Passing `null` or `undefined` emulates position unavailable.

**Usage**

::: code-group

```python [Async]
await browser_context.set_geolocation({"latitude": 59.95, "longitude": 30.31667})
```

```python [Sync]
browser_context.set_geolocation({"latitude": 59.95, "longitude": 30.31667})
```

:::

::: info
Consider using [`browser_context.grant_permissions()`](/python/api/class-browsercontext#browser-context-grant-permissions) to grant permissions for the browser context pages to read
its geolocation.
:::

**Arguments**

- <a id="browser-context-set-geolocation-option-geolocation"></a>`geolocation` `null | Object`

  - `latitude` `float`

    Latitude between -90 and 90.
  - `longitude` `float`

    Longitude between -180 and 180.
  - `accuracy` `float` *(optional)*

    Non-negative accuracy value. Defaults to `0`.


### browser_context.set_offline() {#browser-context-set-offline}

<Badge type="info" text="Added in: v1.8" />

**Arguments**

- <a id="browser-context-set-offline-option-offline"></a>`offline` `boolean`

  Whether to emulate network being offline for the browser context.

  ::: info
  Offline emulation affects HTTP requests, such as page navigations, `fetch()` and `XMLHttpRequest`.

  WebSocket behavior depends on the browser and whether the connection is already established. Chromium and Firefox fail new WebSocket connections while offline, but do not close already-open connections. Chromium can defer incoming messages until the context goes back online, rather than lose them; Firefox can continue delivering messages while offline. WebKit can allow both new WebSocket connections and traffic on established connections while offline. Do not rely on offline emulation to test WebSocket message loss or connection closure.

  Offline emulation does not affect WebRTC traffic: established `RTCPeerConnection`s keep sending and receiving media over UDP. To test WebRTC connection loss, interrupt the connection outside the browser, for example by stopping the TURN server or using an OS-level firewall.
  :::


### browser_context.set_storage_state() {#browser-context-set-storage-state}

<Badge type="info" text="Added in: v1.59" />

Clears the existing cookies, local storage, IndexedDB entries, origin private file system entries and virtual WebAuthn credentials, and sets the new storage
state. When the storage state contains credentials, the virtual WebAuthn authenticator is installed (equivalent to
[`credentials.install()`](/python/api/class-credentials#credentials-install)), preventing all real authenticators from working in this context.

**Usage**

::: code-group

```python [Async]
# Load storage state from a file and apply it to the context.
await context.set_storage_state("state.json")
```

```python [Sync]
# Load storage state from a file and apply it to the context.
context.set_storage_state("state.json")
```

:::

**Arguments**

- <a id="browser-context-set-storage-state-option-storage-state"></a>`storage_state` `path | Object`

  Learn more about [storage state and auth](../auth.md).

  Populates context with given storage state. This option can be used to initialize context with logged-in information obtained via [`browser_context.storage_state()`](/python/api/class-browsercontext#browser-context-storage-state).

  - `cookies` `Array<Object>`

    Cookies to set for context

    - `name` `string`
    - `value` `string`
    - `domain` `string`

      Domain and path are required. For the cookie to apply to all subdomains as well, prefix domain with a dot, like this: ".example.com"
    - `path` `string`

      Domain and path are required
    - `expires` `float`

      Unix time in seconds.
    - `http_only` `boolean`
    - `secure` `boolean`
    - `same_site` `"Strict" | "Lax" | "None"`

      sameSite flag
  - `origins` `Array<Object>`

    - `origin` `string`
    - `local_storage` `Array<Object>`

      localStorage to set for context

      - `name` `string`
      - `value` `string`


### browser_context.storage_state() {#browser-context-storage-state}

<Badge type="info" text="Added in: v1.8" />

Returns storage state for this browser context, contains current cookies, local storage snapshot, IndexedDB snapshot, origin private file system snapshot and virtual WebAuthn credentials.

**Arguments**

- <a id="browser-context-storage-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-storage-state-option-credentials"></a>`credentials` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Set to `true` to include the context's virtual WebAuthn [`browser_context.credentials`](/python/api/class-browsercontext#browser-context-credentials) (passkeys) in the storage
    state snapshot. The captured credentials carry their private keys and signature counters, so they can be re-seeded into a later context via the
    [`storage_state`](/python/api/class-browser#browser-new-context-option-storage-state) option or [`browser_context.set_storage_state()`](/python/api/class-browsercontext#browser-context-set-storage-state).
    Note that restoring the storage state that contains credentials will automatically install the virtual WebAuthn authenticator (see [`credentials.install()`](/python/api/class-credentials#credentials-install)), and prevent all real authenticators from working in this context.
  - <a id="browser-context-storage-state-option-indexed-db"></a>`indexed_db` `boolean` *(optional)* <Badge type="info" text="Added in: v1.51" />

    Set to `true` to include [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) in the storage state snapshot.
    If your application uses IndexedDB to store authentication tokens, like Firebase Authentication, enable this.
  - <a id="browser-context-storage-state-option-opfs"></a>`opfs` `boolean` *(optional)* <Badge type="info" text="Added in: v1.63" />

    Set to `true` to include the [origin private file system](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)
    in the storage state snapshot.

    ::: info
    OPFS is currently not supported in ephemeral WebKit contexts.
    :::
  - <a id="browser-context-storage-state-option-path"></a>`path` `path` *(optional)*

    The file path to save the storage state to. If [`path`](/python/api/class-browsercontext#browser-context-storage-state-option-path) is a relative path, then it is resolved relative to
    current working directory. If no path is provided, storage
    state is still returned, but won't be saved to the disk.

**Returns**

- `Object`


### browser_context.unroute() {#browser-context-unroute}

<Badge type="info" text="Added in: v1.8" />

Removes a route created with [`browser_context.route()`](/python/api/class-browsercontext#browser-context-route). When [`handler`](/python/api/class-browsercontext#browser-context-unroute-option-handler) is not specified, removes all
routes for the [`url`](/python/api/class-browsercontext#browser-context-unroute-option-url).

**Arguments**

- <a id="browser-context-unroute-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  A glob pattern, regex pattern, or predicate receiving [URL] used to register a routing with
  [`browser_context.route()`](/python/api/class-browsercontext#browser-context-route).
- <a id="browser-context-unroute-option-handler"></a>`handler` `function(Route) | function(Route, Request)` *(optional)*

  Optional handler function used to register a routing with [`browser_context.route()`](/python/api/class-browsercontext#browser-context-route).


### browser_context.unroute_all() {#browser-context-unroute-all}

<Badge type="info" text="Added in: v1.41" />

Removes all routes created with [`browser_context.route()`](/python/api/class-browsercontext#browser-context-route) and [`browser_context.route_from_har()`](/python/api/class-browsercontext#browser-context-route-from-har).

**Arguments**

- <a id="browser-context-unroute-all-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-unroute-all-option-behavior"></a>`behavior` `"wait" | "ignoreErrors" | "default"` *(optional)*

    Specifies whether to wait for already running handlers and what to do if they throw errors:
    * `'default'` - do not wait for current handler calls (if any) to finish, if unrouted handler throws, it may result in unhandled error
    * `'wait'` - wait for current handler calls (if any) to finish
    * `'ignoreErrors'` - do not wait for current handler calls (if any) to finish, all errors thrown by the handlers after unrouting are silently caught


### browser_context.wait_for_event() {#browser-context-wait-for-event-2}

<Badge type="info" text="Added in: v1.8" />

::: info
In most cases, you should use [`browser_context.expect_event()`](/python/api/class-browsercontext#browser-context-wait-for-event).
:::

Waits for given `event` to fire. If predicate is provided, it passes
event's value into the `predicate` function and waits for `predicate(event)` to return a truthy value.
Will throw an error if the browser context is closed before the `event` is fired.

**Arguments**

- <a id="browser-context-wait-for-event-2-option-event"></a>`event` `string`

  Event name, same one typically passed into `*.on(event)`.
- <a id="browser-context-wait-for-event-2-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-wait-for-event-2-option-predicate"></a>`predicate` `function()` *(optional)*

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - <a id="browser-context-wait-for-event-2-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `any`


## Properties

### browser_context.clock {#browser-context-clock}

<Badge type="info" text="Added in: v1.45" />

Playwright has ability to mock clock and passage of time.

**Type**

- `Clock`


### browser_context.credentials {#browser-context-credentials}

<Badge type="info" text="Added in: v1.61" />

Virtual WebAuthn authenticator for this context. Lets tests seed credentials and intercept
`navigator.credentials.create()` / `navigator.credentials.get()` ceremonies.

**Type**

- `Credentials`


### browser_context.debugger {#browser-context-debugger}

<Badge type="info" text="Added in: v1.59" />

Debugger allows to pause and resume the execution.

**Type**

- `Debugger`


### browser_context.request {#browser-context-request}

<Badge type="info" text="Added in: v1.16" />

API testing helper associated with this context. Requests made with this API will use context cookies.

**Type**

- `APIRequestContext`


### browser_context.tracing {#browser-context-tracing}

<Badge type="info" text="Added in: v1.12" />

**Type**

- `Tracing`


## Events

### browserContext.on("close") {#browser-context-event-close}

<Badge type="info" text="Added in: v1.8" />

Emitted when Browser context gets closed. This might happen because of one of the following:
* Browser context is closed.
* Browser application is closed or crashed.
* The [`browser.close()`](/python/api/class-browser#browser-close) method was called.

**Event data**

- `BrowserContext`


### browserContext.on("console") {#browser-context-event-console}

<Badge type="info" text="Added in: v1.34" />

Emitted when JavaScript within the page calls one of console API methods, e.g. `console.log` or `console.dir`.

The arguments passed into `console.log` and the page are available on the [ConsoleMessage](/python/api/class-consolemessage) event handler argument.

**Usage**

::: code-group

```python [Async]
async def print_args(msg):
    values = []
    for arg in msg.args:
        values.append(await arg.json_value())
    print(values)

context.on("console", print_args)
await page.evaluate("console.log('hello', 5, { foo: 'bar' })")
```

```python [Sync]
def print_args(msg):
    for arg in msg.args:
        print(arg.json_value())

context.on("console", print_args)
page.evaluate("console.log('hello', 5, { foo: 'bar' })")
```

:::

**Event data**

- `ConsoleMessage`


### browserContext.on("dialog") {#browser-context-event-dialog}

<Badge type="info" text="Added in: v1.34" />

Emitted when a JavaScript dialog appears, such as `alert`, `prompt`, `confirm` or `beforeunload`. Listener **must** either [`dialog.accept()`](/python/api/class-dialog#dialog-accept) or [`dialog.dismiss()`](/python/api/class-dialog#dialog-dismiss) the dialog - otherwise the page will [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#never_blocking) waiting for the dialog, and actions like click will never finish.

**Usage**

```python
context.on("dialog", lambda dialog: dialog.accept())
```

::: info
When no [`page.on("dialog")`](/python/api/class-page#page-event-dialog) or [`browserContext.on("dialog")`](/python/api/class-browsercontext#browser-context-event-dialog) listeners are present, all dialogs are automatically dismissed.
:::

**Event data**

- `Dialog`


### browserContext.on("dialogClosed") {#browser-context-event-dialog-closed}

<Badge type="info" text="Added in: v1.63" />

Emitted when a JavaScript dialog in any page belonging to this context has been closed, either by [`dialog.accept()`](/python/api/class-dialog#dialog-accept), by [`dialog.dismiss()`](/python/api/class-dialog#dialog-dismiss), or manually by the user in the headed browser.

**Event data**

- `Dialog`


### browserContext.on("download") {#browser-context-event-download}

<Badge type="info" text="Added in: v1.60" />

Emitted when attachment download started in any page belonging to this context. User can access basic file operations on downloaded content via the passed [Download](/python/api/class-download) instance. See also [`page.on("download")`](/python/api/class-page#page-event-download) to receive events about a specific page.

**Event data**

- `Download`


### browserContext.on("frameAttached") {#browser-context-event-frame-attached}

<Badge type="info" text="Added in: v1.60" />

Emitted when a frame is attached in any page belonging to this context. See also [`page.on("frameAttached")`](/python/api/class-page#page-event-frame-attached) to receive events about a specific page.

**Event data**

- `Frame`


### browserContext.on("frameDetached") {#browser-context-event-frame-detached}

<Badge type="info" text="Added in: v1.60" />

Emitted when a frame is detached in any page belonging to this context. See also [`page.on("frameDetached")`](/python/api/class-page#page-event-frame-detached) to receive events about a specific page.

**Event data**

- `Frame`


### browserContext.on("frameNavigated") {#browser-context-event-frame-navigated}

<Badge type="info" text="Added in: v1.60" />

Emitted when a frame is navigated to a new url in any page belonging to this context. See also [`page.on("frameNavigated")`](/python/api/class-page#page-event-frame-navigated) to receive events about navigations in a specific page.

**Event data**

- `Frame`


### browserContext.on("page") {#browser-context-event-page}

<Badge type="info" text="Added in: v1.8" />

The event is emitted when a new Page is created in the BrowserContext. The page may still be loading. The event will
also fire for popup pages. See also [`page.on("popup")`](/python/api/class-page#page-event-popup) to receive events about popups relevant to a specific page.

The earliest moment that page is available is when it has navigated to the initial url. For example, when opening a
popup with `window.open('http://example.com')`, this event will fire when the network request to "http://example.com" is
done and its response has started loading in the popup. If you would like to route/listen to this network request, use [`browser_context.route()`](/python/api/class-browsercontext#browser-context-route) and [`browserContext.on("request")`](/python/api/class-browsercontext#browser-context-event-request) respectively instead of similar methods on the [Page](/python/api/class-page).

::: code-group

```python [Async]
async with context.expect_page() as page_info:
    await page.get_by_text("open new page").click(),
page = await page_info.value
print(await page.evaluate("location.href"))
```

```python [Sync]
with context.expect_page() as page_info:
    page.get_by_text("open new page").click(),
page = page_info.value
print(page.evaluate("location.href"))
```

:::

::: info
Use [`page.wait_for_load_state()`](/python/api/class-page#page-wait-for-load-state) to wait until the page gets to a particular state (you should not need it in most
cases).
:::

**Event data**

- `Page`


### browserContext.on("pageClose") {#browser-context-event-page-close}

<Badge type="info" text="Added in: v1.60" />

Emitted when a page in this context is closed. See also [`page.on("close")`](/python/api/class-page#page-event-close) to receive events about a specific page.

**Event data**

- `Page`


### browserContext.on("pageLoad") {#browser-context-event-page-load}

<Badge type="info" text="Added in: v1.60" />

Emitted when the JavaScript [`load`](https://developer.mozilla.org/en-US/docs/Web/Events/load) event is dispatched in any page belonging to this context. See also [`page.on("load")`](/python/api/class-page#page-event-load) to receive events about a specific page.

**Event data**

- `Page`


### browserContext.on("request") {#browser-context-event-request}

<Badge type="info" text="Added in: v1.12" />

Emitted when a request is issued from any pages created through this context.
The [request] object is read-only. To only listen for requests from a particular
page, use [`page.on("request")`](/python/api/class-page#page-event-request).

In order to intercept and mutate requests, see [`browser_context.route()`](/python/api/class-browsercontext#browser-context-route)
or [`page.route()`](/python/api/class-page#page-route).

**Event data**

- `Request`


### browserContext.on("requestFailed") {#browser-context-event-request-failed}

<Badge type="info" text="Added in: v1.12" />

Emitted when a request fails, for example by timing out. To only listen for
failed requests from a particular page, use [`page.on("requestFailed")`](/python/api/class-page#page-event-request-failed).

::: info
HTTP Error responses, such as 404 or 503, are still successful responses from HTTP standpoint, so request will complete
with [`browserContext.on("requestFinished")`](/python/api/class-browsercontext#browser-context-event-request-finished) event and not with [`browserContext.on("requestFailed")`](/python/api/class-browsercontext#browser-context-event-request-failed).
:::

**Event data**

- `Request`


### browserContext.on("requestFinished") {#browser-context-event-request-finished}

<Badge type="info" text="Added in: v1.12" />

Emitted when a request finishes successfully after downloading the response body. For a successful response, the
sequence of events is `request`, `response` and `requestfinished`. To listen for
successful requests from a particular page, use [`page.on("requestFinished")`](/python/api/class-page#page-event-request-finished).

**Event data**

- `Request`


### browserContext.on("response") {#browser-context-event-response}

<Badge type="info" text="Added in: v1.12" />

Emitted when [response] status and headers are received for a request. For a successful response, the sequence of events
is `request`, `response` and `requestfinished`. To listen for response events
from a particular page, use [`page.on("response")`](/python/api/class-page#page-event-response).

**Event data**

- `Response`


### browserContext.on("serviceWorker") {#browser-context-event-service-worker}

<Badge type="info" text="Added in: v1.11" />

::: info
Service workers are only supported on Chromium-based browsers.
:::

Emitted when new service worker is created in the context.

**Event data**

- `Worker`


### browserContext.on("webError") {#browser-context-event-web-error}

<Badge type="info" text="Added in: v1.38" />

Emitted when exception is unhandled in any of the pages in this
context. To listen for errors from a particular page, use [`page.on("pageError")`](/python/api/class-page#page-event-page-error) instead.

**Event data**

- `WebError`


## Deprecated

### browserContext.on("backgroundPage") {#browser-context-event-background-page}

<Badge type="info" text="Added in: v1.11" />

::: danger Deprecated
Background pages have been removed from Chromium together with Manifest V2 extensions.
:::

This event is not emitted.

**Event data**

- `Page`


### browser_context.background_pages() {#browser-context-background-pages}

<Badge type="info" text="Added in: v1.11" />

::: danger Deprecated
Background pages have been removed from Chromium together with Manifest V2 extensions.
:::

Returns an empty list.

**Returns**

- `Array<Page>`

