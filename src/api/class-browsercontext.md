---
title: BrowserContext
outline: 2
---

# BrowserContext

<Badge type="info" text="Added in: v1.8" />

BrowserContexts provide a way to operate multiple independent browser sessions.

If a page opens another page, e.g. with a `window.open` call, the popup will belong to the parent page's browser
context.

Playwright allows creating isolated non-persistent browser contexts with [`browser.newContext()`](/api/class-browser#browser-new-context) method. Non-persistent browser
contexts don't write any browsing data to disk.

```js
// Create a new incognito browser context
const context = await browser.newContext();
// Create a new page inside context.
const page = await context.newPage();
await page.goto('https://example.com');
// Dispose context once it's no longer needed.
await context.close();
```

## Methods

### browserContext.addCookies() {#browser-context-add-cookies}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Adds cookies into this browser context. All pages within this context will have these cookies installed. Cookies can be
obtained via [`browserContext.cookies()`](/api/class-browsercontext#browser-context-cookies).

**Usage**

```js
await browserContext.addCookies([cookieObject1, cookieObject2]);
```

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
  - `httpOnly` `boolean` *(optional)*

    Optional.
  - `secure` `boolean` *(optional)*

    Optional.
  - `sameSite` `"Strict" | "Lax" | "None"` *(optional)*

    Optional.
  - `partitionKey` `string` *(optional)*

    For partitioned third-party cookies (aka [CHIPS](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies)), the partition key. Optional.


### browserContext.addInitScript() {#browser-context-add-init-script}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Adds a script which would be evaluated in one of the following scenarios:
* Whenever a page is created in the browser context or is navigated.
* Whenever a child frame is attached or navigated in any page in the browser context. In this case, the script is
  evaluated in the context of the newly attached frame.

The script is evaluated after the document was created but before any of its scripts were run. This is useful to amend
the JavaScript environment, e.g. to seed `Math.random`.

**Usage**

An example of overriding `Math.random` before the page loads:

```js
// preload.js
Math.random = () => 42;
```

```js
// In your playwright script, assuming the preload.js file is in same directory.
await browserContext.addInitScript({
  path: 'preload.js'
});
```

::: info
The order of evaluation of multiple scripts installed via [`browserContext.addInitScript()`](/api/class-browsercontext#browser-context-add-init-script) and
[`page.addInitScript()`](/api/class-page#page-add-init-script) is not defined.
:::

**Arguments**

- <a id="browser-context-add-init-script-option-script"></a>`script` `function() | string | Object`

  Script to be evaluated in all pages in the browser context.

  - `path` `path` *(optional)*

    Path to the JavaScript file. If `path` is a relative path, then it is resolved relative to the
    current working directory. Optional.
  - `content` `string` *(optional)*

    Raw script content. Optional.
- <a id="browser-context-add-init-script-option-arg"></a>`arg` `Serializable` *(optional)*

  Optional argument to pass to [`script`](/api/class-browsercontext#browser-context-add-init-script-option-script) (only supported when passing a function).
- <a id="browser-context-add-init-script-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-add-init-script-option-expose-functions"></a>`exposeFunctions` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    When set to `true`, functions passed inside [`arg`](/api/class-browsercontext#browser-context-add-init-script-option-arg) are exposed in the page and can be called from the init script. Calling one returns a [Promise] of its result. Under the hood, each function is exposed via [`page.exposeFunction()`](/api/class-page#page-expose-function), so it is technically accessible from all frames of the page. Unlike functions passed to [`page.evaluate()`](/api/class-page#page-evaluate), functions passed to an init script are exposed in every new document, so they survive navigations. Defaults to `false`, in which case functions are not serializable and are silently dropped.

**Returns**

- `Promise<Disposable>`


### browserContext.browser() {#browser-context-browser}

<Badge type="info" text="Added in: v1.8" />

Gets the browser instance that owns the context. Returns `null` if the context is created outside of normal browser, e.g. Android or Electron.

**Returns**

- `null | Browser`


### browserContext.clearCookies() {#browser-context-clear-cookies}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Removes cookies from context. Accepts optional filter.

**Usage**

```js
await context.clearCookies();
await context.clearCookies({ name: 'session-id' });
await context.clearCookies({ domain: 'my-origin.com' });
await context.clearCookies({ domain: /.*my-origin\.com/ });
await context.clearCookies({ path: '/api/v1' });
await context.clearCookies({ name: 'session-id', domain: 'my-origin.com' });
```

**Arguments**

- <a id="browser-context-clear-cookies-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-clear-cookies-option-domain"></a>`domain` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given domain.
  - <a id="browser-context-clear-cookies-option-name"></a>`name` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given name.
  - <a id="browser-context-clear-cookies-option-path"></a>`path` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given path.


### browserContext.clearPermissions() {#browser-context-clear-permissions}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Clears all permission overrides for the browser context.

**Usage**

```js
const context = await browser.newContext();
await context.grantPermissions(['clipboard-read']);
// do stuff ..
context.clearPermissions();
```


### browserContext.close() {#browser-context-close}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Closes the browser context. All the pages that belong to the browser context will be closed.

::: info
The default browser context cannot be closed.
:::

**Arguments**

- <a id="browser-context-close-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-close-option-reason"></a>`reason` `string` *(optional)* <Badge type="info" text="Added in: v1.40" />

    The reason to be reported to the operations interrupted by the context closure.


### browserContext.cookies() {#browser-context-cookies}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

If no URLs are specified, this method returns all cookies. If URLs are specified, only cookies that affect those URLs
are returned.

**Arguments**

- <a id="browser-context-cookies-option-urls"></a>`urls` `string | Array<string>` *(optional)*

  Optional list of URLs.

**Returns**

- `Promise<Array<Object>>`


### browserContext.exposeBinding() {#browser-context-expose-binding}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

The method adds a function called [`name`](/api/class-browsercontext#browser-context-expose-binding-option-name) on the `window` object of every frame in every page in the context.
When called, the function executes [`callback`](/api/class-browsercontext#browser-context-expose-binding-option-callback) and returns a [Promise] which resolves to the return value of
[`callback`](/api/class-browsercontext#browser-context-expose-binding-option-callback). If the [`callback`](/api/class-browsercontext#browser-context-expose-binding-option-callback) returns a [Promise], it will be awaited.

The first argument of the [`callback`](/api/class-browsercontext#browser-context-expose-binding-option-callback) function contains information about the caller: `{ browserContext:
BrowserContext, page: Page, frame: Frame }`.

See [`page.exposeBinding()`](/api/class-page#page-expose-binding) for page-only version.

**Usage**

An example of exposing page URL to all frames in all pages in the context:

```js
const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.

(async () => {
  const browser = await webkit.launch({ headless: false });
  const context = await browser.newContext();
  await context.exposeBinding('pageURL', ({ page }) => page.url());
  const page = await context.newPage();
  await page.setContent(`
    <script>
      async function onClick() {
        document.querySelector('div').textContent = await window.pageURL();
      }
    </script>
    <button onclick="onClick()">Click me</button>
    <div></div>
  `);
  await page.getByRole('button').click();
})();
```

**Arguments**

- <a id="browser-context-expose-binding-option-name"></a>`name` `string`

  Name of the function on the window object.
- <a id="browser-context-expose-binding-option-callback"></a>`callback` `function()`

  Callback function that will be called in the Playwright's context.

**Returns**

- `Promise<Disposable>`


### browserContext.exposeFunction() {#browser-context-expose-function}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

The method adds a function called [`name`](/api/class-browsercontext#browser-context-expose-function-option-name) on the `window` object of every frame in every page in the context.
When called, the function executes [`callback`](/api/class-browsercontext#browser-context-expose-function-option-callback) and returns a [Promise] which resolves to the return value of
[`callback`](/api/class-browsercontext#browser-context-expose-function-option-callback).

If the [`callback`](/api/class-browsercontext#browser-context-expose-function-option-callback) returns a [Promise], it will be awaited.

See [`page.exposeFunction()`](/api/class-page#page-expose-function) for page-only version.

**Usage**

An example of adding a `sha256` function to all pages in the context:

```js
const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.
const crypto = require('crypto');

(async () => {
  const browser = await webkit.launch({ headless: false });
  const context = await browser.newContext();
  await context.exposeFunction('sha256', text =>
    crypto.createHash('sha256').update(text).digest('hex'),
  );
  const page = await context.newPage();
  await page.setContent(`
    <script>
      async function onClick() {
        document.querySelector('div').textContent = await window.sha256('PLAYWRIGHT');
      }
    </script>
    <button onclick="onClick()">Click me</button>
    <div></div>
  `);
  await page.getByRole('button').click();
})();
```

**Arguments**

- <a id="browser-context-expose-function-option-name"></a>`name` `string`

  Name of the function on the window object.
- <a id="browser-context-expose-function-option-callback"></a>`callback` `function()`

  Callback function that will be called in the Playwright's context.

**Returns**

- `Promise<Disposable>`


### browserContext.grantPermissions() {#browser-context-grant-permissions}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

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


### browserContext.isClosed() {#browser-context-is-closed}

<Badge type="info" text="Added in: v1.59" />

Indicates that the browser context is in the process of closing or has already been closed.

**Returns**

- `boolean`


### browserContext.newCDPSession() {#browser-context-new-cdp-session}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

::: info
CDP sessions are only supported on Chromium-based browsers.
:::

Returns the newly created session.

**Arguments**

- <a id="browser-context-new-cdp-session-option-page"></a>`page` `Page | Frame`

  Target to create new session for. For backwards-compatibility, this parameter is
  named `page`, but it can be a `Page` or `Frame` type.

**Returns**

- `Promise<CDPSession>`


### browserContext.newPage() {#browser-context-new-page}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Creates a new page in the browser context.

**Returns**

- `Promise<Page>`


### browserContext.pages() {#browser-context-pages}

<Badge type="info" text="Added in: v1.8" />

Returns all open pages in the context.

**Returns**

- `Array<Page>`


### browserContext.removeAllListeners() {#browser-context-remove-all-listeners}

<Badge type="info" text="Added in: v1.47" /> <Badge type="tip" text="async" />

Removes all the listeners of the given type (or all registered listeners if no type given).
Allows to wait for async listeners to complete or to ignore subsequent errors from these listeners.

**Arguments**

- <a id="browser-context-remove-all-listeners-option-type"></a>`type` `string` *(optional)*
- <a id="browser-context-remove-all-listeners-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-remove-all-listeners-option-behavior"></a>`behavior` `"wait" | "ignoreErrors" | "default"` *(optional)*

    Specifies whether to wait for already running listeners and what to do if they throw errors:
    * `'default'` - do not wait for current listener calls (if any) to finish, if the listener throws, it may result in unhandled error
    * `'wait'` - wait for current listener calls (if any) to finish
    * `'ignoreErrors'` - do not wait for current listener calls (if any) to finish, all errors thrown by the listeners after removal are silently caught


### browserContext.route() {#browser-context-route}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Routing provides the capability to modify network requests that are made by any page in the browser context. Once route
is enabled, every request matching the url pattern will stall unless it's continued, fulfilled or aborted.

::: info
[`browserContext.route()`](/api/class-browsercontext#browser-context-route) will not intercept requests intercepted by Service Worker. See [this](https://github.com/microsoft/playwright/issues/1090) issue. We recommend disabling Service Workers when using request interception by setting [`serviceWorkers`](/api/class-browser#browser-new-context-option-service-workers) to `'block'`.
:::

**Usage**

An example of a naive handler that aborts all image requests:

```js
const context = await browser.newContext();
await context.route('**/*.{png,jpg,jpeg}', route => route.abort());
const page = await context.newPage();
await page.goto('https://example.com');
await browser.close();
```

or the same snippet using a regex pattern instead:

```js
const context = await browser.newContext();
await context.route(/(\.png$)|(\.jpg$)/, route => route.abort());
const page = await context.newPage();
await page.goto('https://example.com');
await browser.close();
```

It is possible to examine the request to decide the route action. For example, mocking all requests that contain some post data, and leaving all other requests as is:

```js
await context.route('/api/**', async route => {
  if (route.request().postData().includes('my-string'))
    await route.fulfill({ body: 'mocked-data' });
  else
    await route.continue();
});
```

Page routes (set up with [`page.route()`](/api/class-page#page-route)) take precedence over browser context routes when request matches both
handlers.

To remove a route with its handler you can use [`browserContext.unroute()`](/api/class-browsercontext#browser-context-unroute).

::: info
Enabling routing disables http cache.
:::

**Arguments**

- <a id="browser-context-route-option-url"></a>`url` `string | RegExp | URLPattern | function(URL): boolean`

  A glob pattern, regex pattern, URL pattern, or predicate that receives a [URL] to match during routing. If [`baseURL`](/api/class-browser#browser-new-context-option-base-url) is set in the context options and the provided URL is a string that does not start with `*`, it is resolved using the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
- <a id="browser-context-route-option-handler"></a>`handler` `function(Route, Request): Promise<any> | any`

  handler function to route the request.
- <a id="browser-context-route-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-route-option-times"></a>`times` `int` *(optional)* <Badge type="info" text="Added in: v1.15" />

    How often a route should be used. By default it will be used every time.

**Returns**

- `Promise<Disposable>`


### browserContext.routeFromHAR() {#browser-context-route-from-har}

<Badge type="info" text="Added in: v1.23" /> <Badge type="tip" text="async" />

If specified the network requests that are made in the context will be served from the HAR file. Read more about [Replaying from HAR](../mock.md#replaying-from-har).

Playwright will not serve requests intercepted by Service Worker from the HAR file. See [this](https://github.com/microsoft/playwright/issues/1090) issue. We recommend disabling Service Workers when using request interception by setting [`serviceWorkers`](/api/class-browser#browser-new-context-option-service-workers) to `'block'`.

**Arguments**

- <a id="browser-context-route-from-har-option-har"></a>`har` `path`

  Path to a [HAR](http://www.softwareishard.com/blog/har-12-spec) file with prerecorded network data. If `path` is a relative path, then it is resolved relative to the current working directory.
- <a id="browser-context-route-from-har-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-route-from-har-option-not-found"></a>`notFound` `"abort" | "fallback"` *(optional)*

    * If set to 'abort' any request not found in the HAR file will be aborted.
    * If set to 'fallback' falls through to the next route handler in the handler chain.

    Defaults to abort.
  - <a id="browser-context-route-from-har-option-update"></a>`update` `boolean` *(optional)*

    If specified, updates the given HAR with the actual network information instead of serving from file. The file is written to disk when [`browserContext.close()`](/api/class-browsercontext#browser-context-close) is called.
  - <a id="browser-context-route-from-har-option-update-content"></a>`updateContent` `"embed" | "attach"` *(optional)* <Badge type="info" text="Added in: v1.32" />

    Optional setting to control resource content management. If `attach` is specified, resources are persisted as separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file.
  - <a id="browser-context-route-from-har-option-update-mode"></a>`updateMode` `"full" | "minimal"` *(optional)* <Badge type="info" text="Added in: v1.32" />

    When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `minimal`.
  - <a id="browser-context-route-from-har-option-url"></a>`url` `string | RegExp` *(optional)*

    A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.


### browserContext.routeWebSocket() {#browser-context-route-web-socket}

<Badge type="info" text="Added in: v1.48" /> <Badge type="tip" text="async" />

This method allows to modify websocket connections that are made by any page in the browser context.

Note that only `WebSocket`s created after this method was called will be routed. It is recommended to call this method before creating any pages.

**Usage**

Below is an example of a simple handler that blocks some websocket messages.
See [WebSocketRoute](/api/class-websocketroute) for more details and examples.

```js
await context.routeWebSocket('/ws', ws => {
  const server = ws.connectToServer();
  ws.onMessage(message => {
    if (message === 'to-be-blocked')
      return;
    server.send(message);
  });
});
```

**Arguments**

- <a id="browser-context-route-web-socket-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  Only WebSockets with the url matching this pattern will be routed. A string pattern can be relative to the [`baseURL`](/api/class-browser#browser-new-context-option-base-url) context option.
- <a id="browser-context-route-web-socket-option-handler"></a>`handler` `function(WebSocketRoute): Promise<any> | any`

  Handler function to route the WebSocket.


### browserContext.serviceWorkers() {#browser-context-service-workers}

<Badge type="info" text="Added in: v1.11" />

::: info
Service workers are only supported on Chromium-based browsers.
:::

All existing service workers in the context.

**Returns**

- `Array<Worker>`


### browserContext.setDefaultNavigationTimeout() {#browser-context-set-default-navigation-timeout}

<Badge type="info" text="Added in: v1.8" />

This setting will change the default maximum navigation time for the following methods and related shortcuts:
* [`page.goBack()`](/api/class-page#page-go-back)
* [`page.goForward()`](/api/class-page#page-go-forward)
* [`page.goto()`](/api/class-page#page-goto)
* [`page.reload()`](/api/class-page#page-reload)
* [`page.setContent()`](/api/class-page#page-set-content)
* [`page.waitForNavigation()`](/api/class-page#page-wait-for-navigation)

::: info
[`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) and [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) take priority over
[`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout).
:::

**Arguments**

- <a id="browser-context-set-default-navigation-timeout-option-timeout"></a>`timeout` `float`

  Maximum navigation time in milliseconds


### browserContext.setDefaultTimeout() {#browser-context-set-default-timeout}

<Badge type="info" text="Added in: v1.8" />

This setting will change the default maximum time for all the methods accepting [`timeout`](/api/class-browsercontext#browser-context-set-default-timeout-option-timeout) option.

::: info
[`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout), [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) and
[`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout) take priority over [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout).
:::

**Arguments**

- <a id="browser-context-set-default-timeout-option-timeout"></a>`timeout` `float`

  Maximum time in milliseconds. Pass `0` to disable timeout.


### browserContext.setExtraHTTPHeaders() {#browser-context-set-extra-http-headers}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

The extra HTTP headers will be sent with every request initiated by any page in the context. These headers are merged
with page-specific extra HTTP headers set with [`page.setExtraHTTPHeaders()`](/api/class-page#page-set-extra-http-headers). If page overrides a particular
header, page-specific header value will be used instead of the browser context header value.

::: info
[`browserContext.setExtraHTTPHeaders()`](/api/class-browsercontext#browser-context-set-extra-http-headers) does not guarantee the order of headers in the outgoing requests.
:::

**Arguments**

- <a id="browser-context-set-extra-http-headers-option-headers"></a>`headers` `Object<string, string>`

  An object containing additional HTTP headers to be sent with every request. All header values must be strings.


### browserContext.setGeolocation() {#browser-context-set-geolocation}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Sets the context's geolocation. Passing `null` or `undefined` emulates position unavailable.

**Usage**

```js
await browserContext.setGeolocation({ latitude: 59.95, longitude: 30.31667 });
```

::: info
Consider using [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions) to grant permissions for the browser context pages to read
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


### browserContext.setHTTPCredentials() {#browser-context-set-http-credentials}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Sets the credentials for HTTP authentication for this browser context.

::: info
Browsers may cache credentials per origin after a successful authentication, so changing credentials for an origin that has already been authenticated may have no effect.
:::

**Arguments**

- <a id="browser-context-set-http-credentials-option-http-credentials"></a>`httpCredentials` `null | Object | Array<Object>`

  Pass an array to use different credentials for different origins. The first entry that matches the request origin is used, and entries with no origin match any request.

  - `username` `string`
  - `password` `string`
  - `origin` `string` *(optional)*

    Restrain sending http credentials on specific origin (scheme://host:port).


### browserContext.setOffline() {#browser-context-set-offline}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

**Arguments**

- <a id="browser-context-set-offline-option-offline"></a>`offline` `boolean`

  Whether to emulate network being offline for the browser context.

  ::: info
  Offline emulation affects HTTP requests, such as page navigations, `fetch()` and `XMLHttpRequest`.

  WebSocket behavior depends on the browser and whether the connection is already established. Chromium and Firefox fail new WebSocket connections while offline, but do not close already-open connections. Chromium can defer incoming messages until the context goes back online, rather than lose them; Firefox can continue delivering messages while offline. WebKit can allow both new WebSocket connections and traffic on established connections while offline. Do not rely on offline emulation to test WebSocket message loss or connection closure.

  Offline emulation does not affect WebRTC traffic: established `RTCPeerConnection`s keep sending and receiving media over UDP. To test WebRTC connection loss, interrupt the connection outside the browser, for example by stopping the TURN server or using an OS-level firewall.
  :::


### browserContext.setStorageState() {#browser-context-set-storage-state}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

Clears the existing cookies, local storage, IndexedDB entries, origin private file system entries and virtual WebAuthn credentials, and sets the new storage
state. When the storage state contains credentials, the virtual WebAuthn authenticator is installed (equivalent to
[`credentials.install()`](/api/class-credentials#credentials-install)), preventing all real authenticators from working in this context.

**Usage**

```js
// Load storage state from a file and apply it to the context.
await context.setStorageState('state.json');
```

**Arguments**

- <a id="browser-context-set-storage-state-option-storage-state"></a>`storageState` `path | Object`

  Learn more about [storage state and auth](../auth.md).

  Populates context with given storage state. This option can be used to initialize context with logged-in information obtained via [`browserContext.storageState()`](/api/class-browsercontext#browser-context-storage-state).

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
    - `httpOnly` `boolean`
    - `secure` `boolean`
    - `sameSite` `"Strict" | "Lax" | "None"`

      sameSite flag
  - `origins` `Array<Object>`

    - `origin` `string`
    - `localStorage` `Array<Object>`

      localStorage to set for context

      - `name` `string`
      - `value` `string`


### browserContext.storageState() {#browser-context-storage-state}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns storage state for this browser context, contains current cookies, local storage snapshot, IndexedDB snapshot, origin private file system snapshot and virtual WebAuthn credentials.

**Arguments**

- <a id="browser-context-storage-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-storage-state-option-credentials"></a>`credentials` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Set to `true` to include the context's virtual WebAuthn [`browserContext.credentials`](/api/class-browsercontext#browser-context-credentials) (passkeys) in the storage
    state snapshot. The captured credentials carry their private keys and signature counters, so they can be re-seeded into a later context via the
    [`storageState`](/api/class-browser#browser-new-context-option-storage-state) option or [`browserContext.setStorageState()`](/api/class-browsercontext#browser-context-set-storage-state).
    Note that restoring the storage state that contains credentials will automatically install the virtual WebAuthn authenticator (see [`credentials.install()`](/api/class-credentials#credentials-install)), and prevent all real authenticators from working in this context.
  - <a id="browser-context-storage-state-option-indexed-db"></a>`indexedDB` `boolean` *(optional)* <Badge type="info" text="Added in: v1.51" />

    Set to `true` to include [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) in the storage state snapshot.
    If your application uses IndexedDB to store authentication tokens, like Firebase Authentication, enable this.
  - <a id="browser-context-storage-state-option-opfs"></a>`opfs` `boolean` *(optional)* <Badge type="info" text="Added in: v1.63" />

    Set to `true` to include the [origin private file system](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)
    in the storage state snapshot.

    ::: info
    OPFS is currently not supported in ephemeral WebKit contexts.
    :::
  - <a id="browser-context-storage-state-option-path"></a>`path` `path` *(optional)*

    The file path to save the storage state to. If [`path`](/api/class-browsercontext#browser-context-storage-state-option-path) is a relative path, then it is resolved relative to
    current working directory. If no path is provided, storage
    state is still returned, but won't be saved to the disk.

**Returns**

- `Promise<Object>`


### browserContext.unroute() {#browser-context-unroute}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Removes a route created with [`browserContext.route()`](/api/class-browsercontext#browser-context-route). When [`handler`](/api/class-browsercontext#browser-context-unroute-option-handler) is not specified, removes all
routes for the [`url`](/api/class-browsercontext#browser-context-unroute-option-url).

**Arguments**

- <a id="browser-context-unroute-option-url"></a>`url` `string | RegExp | URLPattern | function(URL): boolean`

  A glob pattern, regex pattern, URL pattern, or predicate receiving [URL] used to register a routing with
  [`browserContext.route()`](/api/class-browsercontext#browser-context-route).
- <a id="browser-context-unroute-option-handler"></a>`handler` `function(Route, Request): Promise<any> | any` *(optional)*

  Optional handler function used to register a routing with [`browserContext.route()`](/api/class-browsercontext#browser-context-route).


### browserContext.unrouteAll() {#browser-context-unroute-all}

<Badge type="info" text="Added in: v1.41" /> <Badge type="tip" text="async" />

Removes all routes created with [`browserContext.route()`](/api/class-browsercontext#browser-context-route) and [`browserContext.routeFromHAR()`](/api/class-browsercontext#browser-context-route-from-har).

**Arguments**

- <a id="browser-context-unroute-all-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-unroute-all-option-behavior"></a>`behavior` `"wait" | "ignoreErrors" | "default"` *(optional)*

    Specifies whether to wait for already running handlers and what to do if they throw errors:
    * `'default'` - do not wait for current handler calls (if any) to finish, if unrouted handler throws, it may result in unhandled error
    * `'wait'` - wait for current handler calls (if any) to finish
    * `'ignoreErrors'` - do not wait for current handler calls (if any) to finish, all errors thrown by the handlers after unrouting are silently caught


### browserContext.waitForEvent() {#browser-context-wait-for-event}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Waits for event to fire and passes its value into the predicate function. Returns when the predicate returns truthy
value. Will throw an error if the context closes before the event is fired. Returns the event data value.

**Usage**

```js
const pagePromise = context.waitForEvent('page');
await page.getByRole('button').click();
const page = await pagePromise;
```

**Arguments**

- <a id="browser-context-wait-for-event-option-event"></a>`event` `string`

  Event name, same one would pass into `browserContext.on(event)`.
- <a id="browser-context-wait-for-event-option-options-or-predicate"></a>`optionsOrPredicate` `function() | Object` *(optional)*

  Either a predicate that receives an event or an options object. Optional.

  - `predicate` `function()`

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - `timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) method.
- <a id="browser-context-wait-for-event-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-wait-for-event-option-predicate"></a>`predicate` `function()` *(optional)*

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - <a id="browser-context-wait-for-event-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the waiting using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the waiting will be aborted and the operation will throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.

**Returns**

- `Promise<any>`


## Properties

### browserContext.clock {#browser-context-clock}

<Badge type="info" text="Added in: v1.45" />

Playwright has ability to mock clock and passage of time.

**Type**

- `Clock`


### browserContext.credentials {#browser-context-credentials}

<Badge type="info" text="Added in: v1.61" />

Virtual WebAuthn authenticator for this context. Lets tests seed credentials and intercept
`navigator.credentials.create()` / `navigator.credentials.get()` ceremonies.

**Type**

- `Credentials`


### browserContext.debugger {#browser-context-debugger}

<Badge type="info" text="Added in: v1.59" />

Debugger allows to pause and resume the execution.

**Type**

- `Debugger`


### browserContext.request {#browser-context-request}

<Badge type="info" text="Added in: v1.16" />

API testing helper associated with this context. Requests made with this API will use context cookies.

**Type**

- `APIRequestContext`


### browserContext.tracing {#browser-context-tracing}

<Badge type="info" text="Added in: v1.12" />

**Type**

- `Tracing`


## Events

### browserContext.on('close') {#browser-context-event-close}

<Badge type="info" text="Added in: v1.8" />

Emitted when Browser context gets closed. This might happen because of one of the following:
* Browser context is closed.
* Browser application is closed or crashed.
* The [`browser.close()`](/api/class-browser#browser-close) method was called.

**Event data**

- `BrowserContext`


### browserContext.on('console') {#browser-context-event-console}

<Badge type="info" text="Added in: v1.34" />

Emitted when JavaScript within the page calls one of console API methods, e.g. `console.log` or `console.dir`.

The arguments passed into `console.log` and the page are available on the [ConsoleMessage](/api/class-consolemessage) event handler argument.

**Usage**

```js
context.on('console', async msg => {
  const values = [];
  for (const arg of msg.args())
    values.push(await arg.jsonValue());
  console.log(...values);
});
await page.evaluate(() => console.log('hello', 5, { foo: 'bar' }));
```

**Event data**

- `ConsoleMessage`


### browserContext.on('dialog') {#browser-context-event-dialog}

<Badge type="info" text="Added in: v1.34" />

Emitted when a JavaScript dialog appears, such as `alert`, `prompt`, `confirm` or `beforeunload`. Listener **must** either [`dialog.accept()`](/api/class-dialog#dialog-accept) or [`dialog.dismiss()`](/api/class-dialog#dialog-dismiss) the dialog - otherwise the page will [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#never_blocking) waiting for the dialog, and actions like click will never finish.

**Usage**

```js
context.on('dialog', dialog => {
  dialog.accept();
});
```

::: info
When no [`page.on('dialog')`](/api/class-page#page-event-dialog) or [`browserContext.on('dialog')`](/api/class-browsercontext#browser-context-event-dialog) listeners are present, all dialogs are automatically dismissed.
:::

**Event data**

- `Dialog`


### browserContext.on('dialogClosed') {#browser-context-event-dialog-closed}

<Badge type="info" text="Added in: v1.63" />

Emitted when a JavaScript dialog in any page belonging to this context has been closed, either by [`dialog.accept()`](/api/class-dialog#dialog-accept), by [`dialog.dismiss()`](/api/class-dialog#dialog-dismiss), or manually by the user in the headed browser.

**Event data**

- `Dialog`


### browserContext.on('download') {#browser-context-event-download}

<Badge type="info" text="Added in: v1.60" />

Emitted when attachment download started in any page belonging to this context. User can access basic file operations on downloaded content via the passed [Download](/api/class-download) instance. See also [`page.on('download')`](/api/class-page#page-event-download) to receive events about a specific page.

**Event data**

- `Download`


### browserContext.on('frameAttached') {#browser-context-event-frame-attached}

<Badge type="info" text="Added in: v1.60" />

Emitted when a frame is attached in any page belonging to this context. See also [`page.on('frameAttached')`](/api/class-page#page-event-frame-attached) to receive events about a specific page.

**Event data**

- `Frame`


### browserContext.on('frameDetached') {#browser-context-event-frame-detached}

<Badge type="info" text="Added in: v1.60" />

Emitted when a frame is detached in any page belonging to this context. See also [`page.on('frameDetached')`](/api/class-page#page-event-frame-detached) to receive events about a specific page.

**Event data**

- `Frame`


### browserContext.on('frameNavigated') {#browser-context-event-frame-navigated}

<Badge type="info" text="Added in: v1.60" />

Emitted when a frame is navigated to a new url in any page belonging to this context. See also [`page.on('frameNavigated')`](/api/class-page#page-event-frame-navigated) to receive events about navigations in a specific page.

**Event data**

- `Frame`


### browserContext.on('page') {#browser-context-event-page}

<Badge type="info" text="Added in: v1.8" />

The event is emitted when a new Page is created in the BrowserContext. The page may still be loading. The event will
also fire for popup pages. See also [`page.on('popup')`](/api/class-page#page-event-popup) to receive events about popups relevant to a specific page.

The earliest moment that page is available is when it has navigated to the initial url. For example, when opening a
popup with `window.open('http://example.com')`, this event will fire when the network request to "http://example.com" is
done and its response has started loading in the popup. If you would like to route/listen to this network request, use [`browserContext.route()`](/api/class-browsercontext#browser-context-route) and [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) respectively instead of similar methods on the [Page](/api/class-page).

```js
const newPagePromise = context.waitForEvent('page');
await page.getByText('open new page').click();
const newPage = await newPagePromise;
console.log(await newPage.evaluate('location.href'));
```

::: info
Use [`page.waitForLoadState()`](/api/class-page#page-wait-for-load-state) to wait until the page gets to a particular state (you should not need it in most
cases).
:::

**Event data**

- `Page`


### browserContext.on('pageClose') {#browser-context-event-page-close}

<Badge type="info" text="Added in: v1.60" />

Emitted when a page in this context is closed. See also [`page.on('close')`](/api/class-page#page-event-close) to receive events about a specific page.

**Event data**

- `Page`


### browserContext.on('pageLoad') {#browser-context-event-page-load}

<Badge type="info" text="Added in: v1.60" />

Emitted when the JavaScript [`load`](https://developer.mozilla.org/en-US/docs/Web/Events/load) event is dispatched in any page belonging to this context. See also [`page.on('load')`](/api/class-page#page-event-load) to receive events about a specific page.

**Event data**

- `Page`


### browserContext.on('request') {#browser-context-event-request}

<Badge type="info" text="Added in: v1.12" />

Emitted when a request is issued from any pages created through this context.
The [request] object is read-only. To only listen for requests from a particular
page, use [`page.on('request')`](/api/class-page#page-event-request).

In order to intercept and mutate requests, see [`browserContext.route()`](/api/class-browsercontext#browser-context-route)
or [`page.route()`](/api/class-page#page-route).

**Event data**

- `Request`


### browserContext.on('requestFailed') {#browser-context-event-request-failed}

<Badge type="info" text="Added in: v1.12" />

Emitted when a request fails, for example by timing out. To only listen for
failed requests from a particular page, use [`page.on('requestFailed')`](/api/class-page#page-event-request-failed).

::: info
HTTP Error responses, such as 404 or 503, are still successful responses from HTTP standpoint, so request will complete
with [`browserContext.on('requestFinished')`](/api/class-browsercontext#browser-context-event-request-finished) event and not with [`browserContext.on('requestFailed')`](/api/class-browsercontext#browser-context-event-request-failed).
:::

**Event data**

- `Request`


### browserContext.on('requestFinished') {#browser-context-event-request-finished}

<Badge type="info" text="Added in: v1.12" />

Emitted when a request finishes successfully after downloading the response body. For a successful response, the
sequence of events is `request`, `response` and `requestfinished`. To listen for
successful requests from a particular page, use [`page.on('requestFinished')`](/api/class-page#page-event-request-finished).

**Event data**

- `Request`


### browserContext.on('response') {#browser-context-event-response}

<Badge type="info" text="Added in: v1.12" />

Emitted when [response] status and headers are received for a request. For a successful response, the sequence of events
is `request`, `response` and `requestfinished`. To listen for response events
from a particular page, use [`page.on('response')`](/api/class-page#page-event-response).

**Event data**

- `Response`


### browserContext.on('serviceWorker') {#browser-context-event-service-worker}

<Badge type="info" text="Added in: v1.11" />

::: info
Service workers are only supported on Chromium-based browsers.
:::

Emitted when new service worker is created in the context.

**Event data**

- `Worker`


### browserContext.on('webError') {#browser-context-event-web-error}

<Badge type="info" text="Added in: v1.38" />

Emitted when exception is unhandled in any of the pages in this
context. To listen for errors from a particular page, use [`page.on('pageError')`](/api/class-page#page-event-page-error) instead.

**Event data**

- `WebError`


## Deprecated

### browserContext.on('backgroundPage') {#browser-context-event-background-page}

<Badge type="info" text="Added in: v1.11" />

::: danger Deprecated
Background pages have been removed from Chromium together with Manifest V2 extensions.
:::

This event is not emitted.

**Event data**

- `Page`


### browserContext.backgroundPages() {#browser-context-background-pages}

<Badge type="info" text="Added in: v1.11" />

::: danger Deprecated
Background pages have been removed from Chromium together with Manifest V2 extensions.
:::

Returns an empty list.

**Returns**

- `Array<Page>`

