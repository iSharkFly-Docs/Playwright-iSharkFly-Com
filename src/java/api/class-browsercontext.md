---
title: BrowserContext
outline: 2
---

# BrowserContext

<Badge type="info" text="Added in: v1.8" />

BrowserContexts provide a way to operate multiple independent browser sessions.

If a page opens another page, e.g. with a `window.open` call, the popup will belong to the parent page's browser
context.

Playwright allows creating isolated non-persistent browser contexts with [`browser.newContext()`](/java/api/class-browser#browser-new-context) method. Non-persistent browser
contexts don't write any browsing data to disk.

```java
// Create a new incognito browser context
BrowserContext context = browser.newContext();
// Create a new page inside context.
Page page = context.newPage();
page.navigate("https://example.com");
// Dispose context once it is no longer needed.
context.close();
```

## Methods

### browserContext.addCookies() {#browser-context-add-cookies}

<Badge type="info" text="Added in: v1.8" />

Adds cookies into this browser context. All pages within this context will have these cookies installed. Cookies can be
obtained via [`browserContext.cookies()`](/java/api/class-browsercontext#browser-context-cookies).

**Usage**

```java
browserContext.addCookies(Arrays.asList(cookieObject1, cookieObject2));
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

<Badge type="info" text="Added in: v1.8" />

Adds a script which would be evaluated in one of the following scenarios:
* Whenever a page is created in the browser context or is navigated.
* Whenever a child frame is attached or navigated in any page in the browser context. In this case, the script is
  evaluated in the context of the newly attached frame.

The script is evaluated after the document was created but before any of its scripts were run. This is useful to amend
the JavaScript environment, e.g. to seed `Math.random`.

**Usage**

An example of overriding `Math.random` before the page loads:

```java
// In your playwright script, assuming the preload.js file is in same directory.
browserContext.addInitScript(Paths.get("preload.js"));
```

::: info
The order of evaluation of multiple scripts installed via [`browserContext.addInitScript()`](/java/api/class-browsercontext#browser-context-add-init-script) and
[`page.addInitScript()`](/java/api/class-page#page-add-init-script) is not defined.
:::

**Arguments**

- <a id="browser-context-add-init-script-option-script"></a>`script` `string | path`

  Script to be evaluated in all pages in the browser context.

**Returns**

- `Disposable`


### browserContext.browser() {#browser-context-browser}

<Badge type="info" text="Added in: v1.8" />

Gets the browser instance that owns the context. Returns `null` if the context is created outside of normal browser, e.g. Android or Electron.

**Returns**

- `null | Browser`


### browserContext.clearCookies() {#browser-context-clear-cookies}

<Badge type="info" text="Added in: v1.8" />

Removes cookies from context. Accepts optional filter.

**Usage**

```java
context.clearCookies();
context.clearCookies(new BrowserContext.ClearCookiesOptions().setName("session-id"));
context.clearCookies(new BrowserContext.ClearCookiesOptions().setDomain("my-origin.com"));
context.clearCookies(new BrowserContext.ClearCookiesOptions().setPath("/api/v1"));
context.clearCookies(new BrowserContext.ClearCookiesOptions()
                         .setName("session-id")
                         .setDomain("my-origin.com"));
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

<Badge type="info" text="Added in: v1.8" />

Clears all permission overrides for the browser context.

**Usage**

```java
BrowserContext context = browser.newContext();
context.grantPermissions(Arrays.asList("clipboard-read"));
// do stuff ..
context.clearPermissions();
```


### browserContext.close() {#browser-context-close}

<Badge type="info" text="Added in: v1.8" />

Closes the browser context. All the pages that belong to the browser context will be closed.

::: info
The default browser context cannot be closed.
:::

**Arguments**

- <a id="browser-context-close-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-close-option-reason"></a>`reason` `string` *(optional)* <Badge type="info" text="Added in: v1.40" />

    The reason to be reported to the operations interrupted by the context closure.


### browserContext.cookies() {#browser-context-cookies}

<Badge type="info" text="Added in: v1.8" />

If no URLs are specified, this method returns all cookies. If URLs are specified, only cookies that affect those URLs
are returned.

**Arguments**

- <a id="browser-context-cookies-option-urls"></a>`urls` `string | Array<string>` *(optional)*

  Optional list of URLs.

**Returns**

- `Array<Object>`


### browserContext.exposeBinding() {#browser-context-expose-binding}

<Badge type="info" text="Added in: v1.8" />

The method adds a function called [`name`](/java/api/class-browsercontext#browser-context-expose-binding-option-name) on the `window` object of every frame in every page in the context.
When called, the function executes [`callback`](/java/api/class-browsercontext#browser-context-expose-binding-option-callback) and returns a [Promise] which resolves to the return value of
[`callback`](/java/api/class-browsercontext#browser-context-expose-binding-option-callback). If the [`callback`](/java/api/class-browsercontext#browser-context-expose-binding-option-callback) returns a [Promise], it will be awaited.

The first argument of the [`callback`](/java/api/class-browsercontext#browser-context-expose-binding-option-callback) function contains information about the caller: `{ browserContext:
BrowserContext, page: Page, frame: Frame }`.

See [`page.exposeBinding()`](/java/api/class-page#page-expose-binding) for page-only version.

**Usage**

An example of exposing page URL to all frames in all pages in the context:

```java
import com.microsoft.playwright.*;

public class Example {
  public static void main(String[] args) {
    try (Playwright playwright = Playwright.create()) {
      BrowserType webkit = playwright.webkit();
      Browser browser = webkit.launch(new BrowserType.LaunchOptions().setHeadless(false));
      BrowserContext context = browser.newContext();
      context.exposeBinding("pageURL", (source, args) -> source.page().url());
      Page page = context.newPage();
      page.setContent("<script>\n" +
        "  async function onClick() {\n" +
        "    document.querySelector('div').textContent = await window.pageURL();\n" +
        "  }\n" +
        "</script>\n" +
        "<button onclick=\"onClick()\">Click me</button>\n" +
        "<div></div>");
      page.getByRole(AriaRole.BUTTON).click();
    }
  }
}
```

**Arguments**

- <a id="browser-context-expose-binding-option-name"></a>`name` `string`

  Name of the function on the window object.
- <a id="browser-context-expose-binding-option-callback"></a>`callback` `function()`

  Callback function that will be called in the Playwright's context.

**Returns**

- `Disposable`


### browserContext.exposeFunction() {#browser-context-expose-function}

<Badge type="info" text="Added in: v1.8" />

The method adds a function called [`name`](/java/api/class-browsercontext#browser-context-expose-function-option-name) on the `window` object of every frame in every page in the context.
When called, the function executes [`callback`](/java/api/class-browsercontext#browser-context-expose-function-option-callback) and returns a [Promise] which resolves to the return value of
[`callback`](/java/api/class-browsercontext#browser-context-expose-function-option-callback).

If the [`callback`](/java/api/class-browsercontext#browser-context-expose-function-option-callback) returns a [Promise], it will be awaited.

See [`page.exposeFunction()`](/java/api/class-page#page-expose-function) for page-only version.

**Usage**

An example of adding a `sha256` function to all pages in the context:

```java
import com.microsoft.playwright.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class Example {
  public static void main(String[] args) {
    try (Playwright playwright = Playwright.create()) {
      BrowserType webkit = playwright.webkit();
      Browser browser = webkit.launch(new BrowserType.LaunchOptions().setHeadless(false));
      BrowserContext context = browser.newContext();
      context.exposeFunction("sha256", args -> {
        String text = (String) args[0];
        MessageDigest crypto;
        try {
          crypto = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
          return null;
        }
        byte[] token = crypto.digest(text.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(token);
      });
      Page page = context.newPage();
      page.setContent("<script>\n" +
        "  async function onClick() {\n" +
        "    document.querySelector('div').textContent = await window.sha256('PLAYWRIGHT');\n" +
        "  }\n" +
        "</script>\n" +
        "<button onclick=\"onClick()\">Click me</button>\n" +
        "<div></div>\n");
      page.getByRole(AriaRole.BUTTON).click();
    }
  }
}
```

**Arguments**

- <a id="browser-context-expose-function-option-name"></a>`name` `string`

  Name of the function on the window object.
- <a id="browser-context-expose-function-option-callback"></a>`callback` `function()`

  Callback function that will be called in the Playwright's context.

**Returns**

- `Disposable`


### browserContext.grantPermissions() {#browser-context-grant-permissions}

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


### browserContext.isClosed() {#browser-context-is-closed}

<Badge type="info" text="Added in: v1.59" />

Indicates that the browser context is in the process of closing or has already been closed.

**Returns**

- `boolean`


### browserContext.newCDPSession() {#browser-context-new-cdp-session}

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


### browserContext.newPage() {#browser-context-new-page}

<Badge type="info" text="Added in: v1.8" />

Creates a new page in the browser context.

**Returns**

- `Page`


### browserContext.pages() {#browser-context-pages}

<Badge type="info" text="Added in: v1.8" />

Returns all open pages in the context.

**Returns**

- `Array<Page>`


### browserContext.route() {#browser-context-route}

<Badge type="info" text="Added in: v1.8" />

Routing provides the capability to modify network requests that are made by any page in the browser context. Once route
is enabled, every request matching the url pattern will stall unless it's continued, fulfilled or aborted.

::: info
[`browserContext.route()`](/java/api/class-browsercontext#browser-context-route) will not intercept requests intercepted by Service Worker. See [this](https://github.com/microsoft/playwright/issues/1090) issue. We recommend disabling Service Workers when using request interception by setting [`serviceWorkers`](/java/api/class-browser#browser-new-context-option-service-workers) to `'block'`.
:::

**Usage**

An example of a naive handler that aborts all image requests:

```java
BrowserContext context = browser.newContext();
context.route("**/*.{png,jpg,jpeg}", route -> route.abort());
Page page = context.newPage();
page.navigate("https://example.com");
browser.close();
```

or the same snippet using a regex pattern instead:

```java
BrowserContext context = browser.newContext();
context.route(Pattern.compile("(\\.png$)|(\\.jpg$)"), route -> route.abort());
Page page = context.newPage();
page.navigate("https://example.com");
browser.close();
```

It is possible to examine the request to decide the route action. For example, mocking all requests that contain some post data, and leaving all other requests as is:

```java
context.route("/api/**", route -> {
  if (route.request().postData().contains("my-string"))
    route.fulfill(new Route.FulfillOptions().setBody("mocked-data"));
  else
    route.resume();
});
```

Page routes (set up with [`page.route()`](/java/api/class-page#page-route)) take precedence over browser context routes when request matches both
handlers.

To remove a route with its handler you can use [`browserContext.unroute()`](/java/api/class-browsercontext#browser-context-unroute).

::: info
Enabling routing disables http cache.
:::

**Arguments**

- <a id="browser-context-route-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  A glob pattern, regex pattern, or predicate that receives a [URL] to match during routing. If [`baseURL`](/java/api/class-browser#browser-new-context-option-base-url) is set in the context options and the provided URL is a string that does not start with `*`, it is resolved using the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
- <a id="browser-context-route-option-handler"></a>`handler` `function(Route)`

  handler function to route the request.
- <a id="browser-context-route-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-route-option-times"></a>`times` `int` *(optional)* <Badge type="info" text="Added in: v1.15" />

    How often a route should be used. By default it will be used every time.

**Returns**

- `Disposable`


### browserContext.routeFromHAR() {#browser-context-route-from-har}

<Badge type="info" text="Added in: v1.23" />

If specified the network requests that are made in the context will be served from the HAR file. Read more about [Replaying from HAR](../mock.md#replaying-from-har).

Playwright will not serve requests intercepted by Service Worker from the HAR file. See [this](https://github.com/microsoft/playwright/issues/1090) issue. We recommend disabling Service Workers when using request interception by setting [`serviceWorkers`](/java/api/class-browser#browser-new-context-option-service-workers) to `'block'`.

**Arguments**

- <a id="browser-context-route-from-har-option-har"></a>`har` `path`

  Path to a [HAR](http://www.softwareishard.com/blog/har-12-spec) file with prerecorded network data. If `path` is a relative path, then it is resolved relative to the current working directory.
- <a id="browser-context-route-from-har-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-route-from-har-option-not-found"></a>`notFound` `"abort" | "fallback"` *(optional)*

    * If set to 'abort' any request not found in the HAR file will be aborted.
    * If set to 'fallback' falls through to the next route handler in the handler chain.

    Defaults to abort.
  - <a id="browser-context-route-from-har-option-update"></a>`update` `boolean` *(optional)*

    If specified, updates the given HAR with the actual network information instead of serving from file. The file is written to disk when [`browserContext.close()`](/java/api/class-browsercontext#browser-context-close) is called.
  - <a id="browser-context-route-from-har-option-update-content"></a>`updateContent` `"embed" | "attach"` *(optional)* <Badge type="info" text="Added in: v1.32" />

    Optional setting to control resource content management. If `attach` is specified, resources are persisted as separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file.
  - <a id="browser-context-route-from-har-option-update-mode"></a>`updateMode` `"full" | "minimal"` *(optional)* <Badge type="info" text="Added in: v1.32" />

    When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `minimal`.
  - <a id="browser-context-route-from-har-option-url"></a>`url` `string | RegExp` *(optional)*

    A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.


### browserContext.routeWebSocket() {#browser-context-route-web-socket}

<Badge type="info" text="Added in: v1.48" />

This method allows to modify websocket connections that are made by any page in the browser context.

Note that only `WebSocket`s created after this method was called will be routed. It is recommended to call this method before creating any pages.

**Usage**

Below is an example of a simple handler that blocks some websocket messages.
See [WebSocketRoute](/java/api/class-websocketroute) for more details and examples.

```java
context.routeWebSocket("/ws", ws -> {
  WebSocketRoute server = ws.connectToServer();
  ws.onMessage(frame -> {
    if ("to-be-blocked".equals(frame.text()))
      return;
    server.send(frame.text());
  });
});
```

**Arguments**

- <a id="browser-context-route-web-socket-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  Only WebSockets with the url matching this pattern will be routed. A string pattern can be relative to the [`baseURL`](/java/api/class-browser#browser-new-context-option-base-url) context option.
- <a id="browser-context-route-web-socket-option-handler"></a>`handler` `function(WebSocketRoute)`

  Handler function to route the WebSocket.


### browserContext.setDefaultNavigationTimeout() {#browser-context-set-default-navigation-timeout}

<Badge type="info" text="Added in: v1.8" />

This setting will change the default maximum navigation time for the following methods and related shortcuts:
* [`page.goBack()`](/java/api/class-page#page-go-back)
* [`page.goForward()`](/java/api/class-page#page-go-forward)
* [`page.navigate()`](/java/api/class-page#page-goto)
* [`page.reload()`](/java/api/class-page#page-reload)
* [`page.setContent()`](/java/api/class-page#page-set-content)
* [`page.waitForNavigation()`](/java/api/class-page#page-wait-for-navigation)

::: info
[`page.setDefaultNavigationTimeout()`](/java/api/class-page#page-set-default-navigation-timeout) and [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) take priority over
[`browserContext.setDefaultNavigationTimeout()`](/java/api/class-browsercontext#browser-context-set-default-navigation-timeout).
:::

**Arguments**

- <a id="browser-context-set-default-navigation-timeout-option-timeout"></a>`timeout` `float`

  Maximum navigation time in milliseconds


### browserContext.setDefaultTimeout() {#browser-context-set-default-timeout}

<Badge type="info" text="Added in: v1.8" />

This setting will change the default maximum time for all the methods accepting [`timeout`](/java/api/class-browsercontext#browser-context-set-default-timeout-option-timeout) option.

::: info
[`page.setDefaultNavigationTimeout()`](/java/api/class-page#page-set-default-navigation-timeout), [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) and
[`browserContext.setDefaultNavigationTimeout()`](/java/api/class-browsercontext#browser-context-set-default-navigation-timeout) take priority over [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout).
:::

**Arguments**

- <a id="browser-context-set-default-timeout-option-timeout"></a>`timeout` `float`

  Maximum time in milliseconds. Pass `0` to disable timeout.


### browserContext.setExtraHTTPHeaders() {#browser-context-set-extra-http-headers}

<Badge type="info" text="Added in: v1.8" />

The extra HTTP headers will be sent with every request initiated by any page in the context. These headers are merged
with page-specific extra HTTP headers set with [`page.setExtraHTTPHeaders()`](/java/api/class-page#page-set-extra-http-headers). If page overrides a particular
header, page-specific header value will be used instead of the browser context header value.

::: info
[`browserContext.setExtraHTTPHeaders()`](/java/api/class-browsercontext#browser-context-set-extra-http-headers) does not guarantee the order of headers in the outgoing requests.
:::

**Arguments**

- <a id="browser-context-set-extra-http-headers-option-headers"></a>`headers` `Object<string, string>`

  An object containing additional HTTP headers to be sent with every request. All header values must be strings.


### browserContext.setGeolocation() {#browser-context-set-geolocation}

<Badge type="info" text="Added in: v1.8" />

Sets the context's geolocation. Passing `null` or `undefined` emulates position unavailable.

**Usage**

```java
browserContext.setGeolocation(new Geolocation(59.95, 30.31667));
```

::: info
Consider using [`browserContext.grantPermissions()`](/java/api/class-browsercontext#browser-context-grant-permissions) to grant permissions for the browser context pages to read
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


### browserContext.setOffline() {#browser-context-set-offline}

<Badge type="info" text="Added in: v1.8" />

**Arguments**

- <a id="browser-context-set-offline-option-offline"></a>`offline` `boolean`

  Whether to emulate network being offline for the browser context.

  ::: info
  Offline emulation affects HTTP requests, such as page navigations, `fetch()` and `XMLHttpRequest`.

  WebSocket behavior depends on the browser and whether the connection is already established. Chromium and Firefox fail new WebSocket connections while offline, but do not close already-open connections. Chromium can defer incoming messages until the context goes back online, rather than lose them; Firefox can continue delivering messages while offline. WebKit can allow both new WebSocket connections and traffic on established connections while offline. Do not rely on offline emulation to test WebSocket message loss or connection closure.

  Offline emulation does not affect WebRTC traffic: established `RTCPeerConnection`s keep sending and receiving media over UDP. To test WebRTC connection loss, interrupt the connection outside the browser, for example by stopping the TURN server or using an OS-level firewall.
  :::


### browserContext.setStorageState() {#browser-context-set-storage-state}

<Badge type="info" text="Added in: v1.59" />

Clears the existing cookies, local storage, IndexedDB entries, origin private file system entries and virtual WebAuthn credentials, and sets the new storage
state. When the storage state contains credentials, the virtual WebAuthn authenticator is installed (equivalent to
[`credentials.install()`](/java/api/class-credentials#credentials-install)), preventing all real authenticators from working in this context.

**Usage**

```java
// Load storage state from a file and apply it to the context.
context.setStorageState(Paths.get("state.json"));
```

**Arguments**

- <a id="browser-context-set-storage-state-option-storage-state"></a>`storageStatePath` `path`

  Populates context with given storage state. This option can be used to initialize context with logged-in information
  obtained via [`browserContext.storageState()`](/java/api/class-browsercontext#browser-context-storage-state). Path to the file with saved storage state.


### browserContext.storageState() {#browser-context-storage-state}

<Badge type="info" text="Added in: v1.8" />

Returns storage state for this browser context, contains current cookies, local storage snapshot, IndexedDB snapshot, origin private file system snapshot and virtual WebAuthn credentials.

**Arguments**

- <a id="browser-context-storage-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-storage-state-option-credentials"></a>`credentials` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Set to `true` to include the context's virtual WebAuthn [`browserContext.credentials()`](/java/api/class-browsercontext#browser-context-credentials) (passkeys) in the storage
    state snapshot. The captured credentials carry their private keys and signature counters, so they can be re-seeded into a later context via the
    [`storageState`](/java/api/class-browser#browser-new-context-option-storage-state) option or [`browserContext.setStorageState()`](/java/api/class-browsercontext#browser-context-set-storage-state).
    Note that restoring the storage state that contains credentials will automatically install the virtual WebAuthn authenticator (see [`credentials.install()`](/java/api/class-credentials#credentials-install)), and prevent all real authenticators from working in this context.
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

    The file path to save the storage state to. If [`path`](/java/api/class-browsercontext#browser-context-storage-state-option-path) is a relative path, then it is resolved relative to
    current working directory. If no path is provided, storage
    state is still returned, but won't be saved to the disk.

**Returns**

- `string`


### browserContext.unroute() {#browser-context-unroute}

<Badge type="info" text="Added in: v1.8" />

Removes a route created with [`browserContext.route()`](/java/api/class-browsercontext#browser-context-route). When [`handler`](/java/api/class-browsercontext#browser-context-unroute-option-handler) is not specified, removes all
routes for the [`url`](/java/api/class-browsercontext#browser-context-unroute-option-url).

**Arguments**

- <a id="browser-context-unroute-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  A glob pattern, regex pattern, or predicate receiving [URL] used to register a routing with
  [`browserContext.route()`](/java/api/class-browsercontext#browser-context-route).
- <a id="browser-context-unroute-option-handler"></a>`handler` `function(Route)` *(optional)*

  Optional handler function used to register a routing with [`browserContext.route()`](/java/api/class-browsercontext#browser-context-route).


### browserContext.unrouteAll() {#browser-context-unroute-all}

<Badge type="info" text="Added in: v1.41" />

Removes all routes created with [`browserContext.route()`](/java/api/class-browsercontext#browser-context-route) and [`browserContext.routeFromHAR()`](/java/api/class-browsercontext#browser-context-route-from-har).


### browserContext.waitForCondition() {#browser-context-wait-for-condition}

<Badge type="info" text="Added in: v1.32" />

The method will block until the condition returns true. All Playwright events will
be dispatched while the method is waiting for the condition.

**Usage**

Use the method to wait for a condition that depends on page events:

```java
List<String> failedUrls = new ArrayList<>();
context.onResponse(response -> {
  if (!response.ok()) {
    failedUrls.add(response.url());
  }
});
page1.getByText("Create user").click();
page2.getByText("Submit button").click();
context.waitForCondition(() -> failedUrls.size() > 3);
```

**Arguments**

- <a id="browser-context-wait-for-condition-option-condition"></a>`condition` `BooleanSupplier`

  Condition to wait for.
- <a id="browser-context-wait-for-condition-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-wait-for-condition-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default
    value can be changed by using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.


### browserContext.waitForConsoleMessage() {#browser-context-wait-for-console-message}

<Badge type="info" text="Added in: v1.34" />

Performs action and waits for a [ConsoleMessage](/java/api/class-consolemessage) to be logged by in the pages in the context. If predicate is provided, it passes
[ConsoleMessage](/java/api/class-consolemessage) value into the `predicate` function and waits for `predicate(message)` to return a truthy value.
Will throw an error if the page is closed before the [`browserContext.onConsoleMessage()`](/java/api/class-browsercontext#browser-context-event-console) event is fired.

**Arguments**

- <a id="browser-context-wait-for-console-message-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-wait-for-console-message-option-predicate"></a>`predicate` `function(ConsoleMessage): boolean` *(optional)*

    Receives the [ConsoleMessage](/java/api/class-consolemessage) object and resolves to truthy value when the waiting should resolve.
  - <a id="browser-context-wait-for-console-message-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout).
- <a id="browser-context-wait-for-console-message-option-callback"></a>`callback` `Runnable`

  Callback that performs the action triggering the event.

**Returns**

- `ConsoleMessage`


### browserContext.waitForPage() {#browser-context-wait-for-page}

<Badge type="info" text="Added in: v1.9" />

Performs action and waits for a new [Page](/java/api/class-page) to be created in the context. If predicate is provided, it passes
[Page](/java/api/class-page) value into the `predicate` function and waits for `predicate(event)` to return a truthy value.
Will throw an error if the context closes before new [Page](/java/api/class-page) is created.

**Arguments**

- <a id="browser-context-wait-for-page-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-wait-for-page-option-predicate"></a>`predicate` `function(Page): boolean` *(optional)*

    Receives the [Page](/java/api/class-page) object and resolves to truthy value when the waiting should resolve.
  - <a id="browser-context-wait-for-page-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout).
- <a id="browser-context-wait-for-page-option-callback"></a>`callback` `Runnable`

  Callback that performs the action triggering the event.

**Returns**

- `Page`


## Properties

### browserContext.clock() {#browser-context-clock}

<Badge type="info" text="Added in: v1.45" />

Playwright has ability to mock clock and passage of time.

**Type**

- `Clock`


### browserContext.credentials() {#browser-context-credentials}

<Badge type="info" text="Added in: v1.61" />

Virtual WebAuthn authenticator for this context. Lets tests seed credentials and intercept
`navigator.credentials.create()` / `navigator.credentials.get()` ceremonies.

**Type**

- `Credentials`


### browserContext.debugger() {#browser-context-debugger}

<Badge type="info" text="Added in: v1.59" />

Debugger allows to pause and resume the execution.

**Type**

- `Debugger`


### browserContext.request() {#browser-context-request}

<Badge type="info" text="Added in: v1.16" />

API testing helper associated with this context. Requests made with this API will use context cookies.

**Type**

- `APIRequestContext`


### browserContext.tracing() {#browser-context-tracing}

<Badge type="info" text="Added in: v1.12" />

**Type**

- `Tracing`


## Events

### browserContext.onClose() {#browser-context-event-close}

<Badge type="info" text="Added in: v1.8" />

Emitted when Browser context gets closed. This might happen because of one of the following:
* Browser context is closed.
* Browser application is closed or crashed.
* The [`browser.close()`](/java/api/class-browser#browser-close) method was called.

**Event data**

- `BrowserContext`


### browserContext.onConsoleMessage() {#browser-context-event-console}

<Badge type="info" text="Added in: v1.34" />

Emitted when JavaScript within the page calls one of console API methods, e.g. `console.log` or `console.dir`.

The arguments passed into `console.log` and the page are available on the [ConsoleMessage](/java/api/class-consolemessage) event handler argument.

**Usage**

```java
context.onConsoleMessage(msg -> {
  for (int i = 0; i < msg.args().size(); ++i)
    System.out.println(i + ": " + msg.args().get(i).jsonValue());
});
page.evaluate("() => console.log('hello', 5, { foo: 'bar' })");
```

**Event data**

- `ConsoleMessage`


### browserContext.onDialog() {#browser-context-event-dialog}

<Badge type="info" text="Added in: v1.34" />

Emitted when a JavaScript dialog appears, such as `alert`, `prompt`, `confirm` or `beforeunload`. Listener **must** either [`dialog.accept()`](/java/api/class-dialog#dialog-accept) or [`dialog.dismiss()`](/java/api/class-dialog#dialog-dismiss) the dialog - otherwise the page will [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#never_blocking) waiting for the dialog, and actions like click will never finish.

**Usage**

```java
context.onDialog(dialog -> {
  dialog.accept();
});
```

::: info
When no [`page.onDialog()`](/java/api/class-page#page-event-dialog) or [`browserContext.onDialog()`](/java/api/class-browsercontext#browser-context-event-dialog) listeners are present, all dialogs are automatically dismissed.
:::

**Event data**

- `Dialog`


### browserContext.onDialogClosed() {#browser-context-event-dialog-closed}

<Badge type="info" text="Added in: v1.63" />

Emitted when a JavaScript dialog in any page belonging to this context has been closed, either by [`dialog.accept()`](/java/api/class-dialog#dialog-accept), by [`dialog.dismiss()`](/java/api/class-dialog#dialog-dismiss), or manually by the user in the headed browser.

**Event data**

- `Dialog`


### browserContext.onDownload() {#browser-context-event-download}

<Badge type="info" text="Added in: v1.60" />

Emitted when attachment download started in any page belonging to this context. User can access basic file operations on downloaded content via the passed [Download](/java/api/class-download) instance. See also [`page.onDownload()`](/java/api/class-page#page-event-download) to receive events about a specific page.

**Event data**

- `Download`


### browserContext.onFrameAttached() {#browser-context-event-frame-attached}

<Badge type="info" text="Added in: v1.60" />

Emitted when a frame is attached in any page belonging to this context. See also [`page.onFrameAttached()`](/java/api/class-page#page-event-frame-attached) to receive events about a specific page.

**Event data**

- `Frame`


### browserContext.onFrameDetached() {#browser-context-event-frame-detached}

<Badge type="info" text="Added in: v1.60" />

Emitted when a frame is detached in any page belonging to this context. See also [`page.onFrameDetached()`](/java/api/class-page#page-event-frame-detached) to receive events about a specific page.

**Event data**

- `Frame`


### browserContext.onFrameNavigated() {#browser-context-event-frame-navigated}

<Badge type="info" text="Added in: v1.60" />

Emitted when a frame is navigated to a new url in any page belonging to this context. See also [`page.onFrameNavigated()`](/java/api/class-page#page-event-frame-navigated) to receive events about navigations in a specific page.

**Event data**

- `Frame`


### browserContext.onPage() {#browser-context-event-page}

<Badge type="info" text="Added in: v1.8" />

The event is emitted when a new Page is created in the BrowserContext. The page may still be loading. The event will
also fire for popup pages. See also [`page.onPopup()`](/java/api/class-page#page-event-popup) to receive events about popups relevant to a specific page.

The earliest moment that page is available is when it has navigated to the initial url. For example, when opening a
popup with `window.open('http://example.com')`, this event will fire when the network request to "http://example.com" is
done and its response has started loading in the popup. If you would like to route/listen to this network request, use [`browserContext.route()`](/java/api/class-browsercontext#browser-context-route) and [`browserContext.onRequest()`](/java/api/class-browsercontext#browser-context-event-request) respectively instead of similar methods on the [Page](/java/api/class-page).

```java
Page newPage = context.waitForPage(() -> {
  page.getByText("open new page").click();
});
System.out.println(newPage.evaluate("location.href"));
```

::: info
Use [`page.waitForLoadState()`](/java/api/class-page#page-wait-for-load-state) to wait until the page gets to a particular state (you should not need it in most
cases).
:::

**Event data**

- `Page`


### browserContext.onPageClose() {#browser-context-event-page-close}

<Badge type="info" text="Added in: v1.60" />

Emitted when a page in this context is closed. See also [`page.onClose()`](/java/api/class-page#page-event-close) to receive events about a specific page.

**Event data**

- `Page`


### browserContext.onPageLoad() {#browser-context-event-page-load}

<Badge type="info" text="Added in: v1.60" />

Emitted when the JavaScript [`load`](https://developer.mozilla.org/en-US/docs/Web/Events/load) event is dispatched in any page belonging to this context. See also [`page.onLoad()`](/java/api/class-page#page-event-load) to receive events about a specific page.

**Event data**

- `Page`


### browserContext.onRequest() {#browser-context-event-request}

<Badge type="info" text="Added in: v1.12" />

Emitted when a request is issued from any pages created through this context.
The [request] object is read-only. To only listen for requests from a particular
page, use [`page.onRequest()`](/java/api/class-page#page-event-request).

In order to intercept and mutate requests, see [`browserContext.route()`](/java/api/class-browsercontext#browser-context-route)
or [`page.route()`](/java/api/class-page#page-route).

**Event data**

- `Request`


### browserContext.onRequestFailed() {#browser-context-event-request-failed}

<Badge type="info" text="Added in: v1.12" />

Emitted when a request fails, for example by timing out. To only listen for
failed requests from a particular page, use [`page.onRequestFailed()`](/java/api/class-page#page-event-request-failed).

::: info
HTTP Error responses, such as 404 or 503, are still successful responses from HTTP standpoint, so request will complete
with [`browserContext.onRequestFinished()`](/java/api/class-browsercontext#browser-context-event-request-finished) event and not with [`browserContext.onRequestFailed()`](/java/api/class-browsercontext#browser-context-event-request-failed).
:::

**Event data**

- `Request`


### browserContext.onRequestFinished() {#browser-context-event-request-finished}

<Badge type="info" text="Added in: v1.12" />

Emitted when a request finishes successfully after downloading the response body. For a successful response, the
sequence of events is `request`, `response` and `requestfinished`. To listen for
successful requests from a particular page, use [`page.onRequestFinished()`](/java/api/class-page#page-event-request-finished).

**Event data**

- `Request`


### browserContext.onResponse() {#browser-context-event-response}

<Badge type="info" text="Added in: v1.12" />

Emitted when [response] status and headers are received for a request. For a successful response, the sequence of events
is `request`, `response` and `requestfinished`. To listen for response events
from a particular page, use [`page.onResponse()`](/java/api/class-page#page-event-response).

**Event data**

- `Response`


### browserContext.onWebError() {#browser-context-event-web-error}

<Badge type="info" text="Added in: v1.38" />

Emitted when exception is unhandled in any of the pages in this
context. To listen for errors from a particular page, use [`page.onPageError()`](/java/api/class-page#page-event-page-error) instead.

**Event data**

- `WebError`


## Deprecated

### browserContext.onBackgroundPage() {#browser-context-event-background-page}

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

