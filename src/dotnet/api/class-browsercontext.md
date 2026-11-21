---
title: BrowserContext
outline: 2
---

# BrowserContext

<Badge type="info" text="Added in: v1.8" />

BrowserContexts provide a way to operate multiple independent browser sessions.

If a page opens another page, e.g. with a `window.open` call, the popup will belong to the parent page's browser
context.

Playwright allows creating isolated non-persistent browser contexts with [`Browser.NewContextAsync()`](/dotnet/api/class-browser#browser-new-context) method. Non-persistent browser
contexts don't write any browsing data to disk.

```csharp
using var playwright = await Playwright.CreateAsync();
var browser = await playwright.Firefox.LaunchAsync(new() { Headless = false });
// Create a new incognito browser context
var context = await browser.NewContextAsync();
// Create a new page inside context.
var page = await context.NewPageAsync();
await page.GotoAsync("https://bing.com");
// Dispose context once it is no longer needed.
await context.CloseAsync();
```

## Methods

### BrowserContext.AddCookiesAsync() {#browser-context-add-cookies}

<Badge type="info" text="Added in: v1.8" />

Adds cookies into this browser context. All pages within this context will have these cookies installed. Cookies can be
obtained via [`BrowserContext.CookiesAsync()`](/dotnet/api/class-browsercontext#browser-context-cookies).

**Usage**

```csharp
await context.AddCookiesAsync(new[] { cookie1, cookie2 });
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


### BrowserContext.AddInitScriptAsync() {#browser-context-add-init-script}

<Badge type="info" text="Added in: v1.8" />

Adds a script which would be evaluated in one of the following scenarios:
* Whenever a page is created in the browser context or is navigated.
* Whenever a child frame is attached or navigated in any page in the browser context. In this case, the script is
  evaluated in the context of the newly attached frame.

The script is evaluated after the document was created but before any of its scripts were run. This is useful to amend
the JavaScript environment, e.g. to seed `Math.random`.

**Usage**

An example of overriding `Math.random` before the page loads:

```csharp
await Context.AddInitScriptAsync(scriptPath: "preload.js");
```

::: info
The order of evaluation of multiple scripts installed via [`BrowserContext.AddInitScriptAsync()`](/dotnet/api/class-browsercontext#browser-context-add-init-script) and
[`Page.AddInitScriptAsync()`](/dotnet/api/class-page#page-add-init-script) is not defined.
:::

**Arguments**

- <a id="browser-context-add-init-script-option-script"></a>`script` `string | path`

  Script to be evaluated in all pages in the browser context.

**Returns**

- `Disposable`


### BrowserContext.Browser() {#browser-context-browser}

<Badge type="info" text="Added in: v1.8" />

Gets the browser instance that owns the context. Returns `null` if the context is created outside of normal browser, e.g. Android or Electron.

**Returns**

- `null | Browser`


### BrowserContext.ClearCookiesAsync() {#browser-context-clear-cookies}

<Badge type="info" text="Added in: v1.8" />

Removes cookies from context. Accepts optional filter.

**Usage**

```csharp
await context.ClearCookiesAsync();
await context.ClearCookiesAsync(new() { Name = "session-id" });
await context.ClearCookiesAsync(new() { Domain = "my-origin.com" });
await context.ClearCookiesAsync(new() { Path = "/api/v1" });
await context.ClearCookiesAsync(new() { Name = "session-id", Domain = "my-origin.com" });
```

**Arguments**

- <a id="browser-context-clear-cookies-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-clear-cookies-option-domain"></a>`domain` `string` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given domain.
  - <a id="browser-context-clear-cookies-option-domain-regex"></a>`domainRegex` `RegExp` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given domain.
  - <a id="browser-context-clear-cookies-option-domain-string"></a>`domainString` `string` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given domain.
  - <a id="browser-context-clear-cookies-option-name"></a>`name` `string` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given name.
  - <a id="browser-context-clear-cookies-option-name-regex"></a>`nameRegex` `RegExp` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given name.
  - <a id="browser-context-clear-cookies-option-name-string"></a>`nameString` `string` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given name.
  - <a id="browser-context-clear-cookies-option-path"></a>`path` `string` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given path.
  - <a id="browser-context-clear-cookies-option-path-regex"></a>`pathRegex` `RegExp` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given path.
  - <a id="browser-context-clear-cookies-option-path-string"></a>`pathString` `string` *(optional)* <Badge type="info" text="Added in: v1.43" />

    Only removes cookies with the given path.


### BrowserContext.ClearPermissionsAsync() {#browser-context-clear-permissions}

<Badge type="info" text="Added in: v1.8" />

Clears all permission overrides for the browser context.

**Usage**

```csharp
var context = await browser.NewContextAsync();
await context.GrantPermissionsAsync(new[] { "clipboard-read" });
// Alternatively, you can use the helper class ContextPermissions
//  to specify the permissions...
// do stuff ...
await context.ClearPermissionsAsync();
```


### BrowserContext.CloseAsync() {#browser-context-close}

<Badge type="info" text="Added in: v1.8" />

Closes the browser context. All the pages that belong to the browser context will be closed.

::: info
The default browser context cannot be closed.
:::

**Arguments**

- <a id="browser-context-close-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-close-option-reason"></a>`reason` `string` *(optional)* <Badge type="info" text="Added in: v1.40" />

    The reason to be reported to the operations interrupted by the context closure.


### BrowserContext.CookiesAsync() {#browser-context-cookies}

<Badge type="info" text="Added in: v1.8" />

If no URLs are specified, this method returns all cookies. If URLs are specified, only cookies that affect those URLs
are returned.

**Arguments**

- <a id="browser-context-cookies-option-urls"></a>`urls` `string | Array<string>` *(optional)*

  Optional list of URLs.

**Returns**

- `Array<Object>`


### BrowserContext.ExposeBindingAsync() {#browser-context-expose-binding}

<Badge type="info" text="Added in: v1.8" />

The method adds a function called [`name`](/dotnet/api/class-browsercontext#browser-context-expose-binding-option-name) on the `window` object of every frame in every page in the context.
When called, the function executes [`callback`](/dotnet/api/class-browsercontext#browser-context-expose-binding-option-callback) and returns a [Promise] which resolves to the return value of
[`callback`](/dotnet/api/class-browsercontext#browser-context-expose-binding-option-callback). If the [`callback`](/dotnet/api/class-browsercontext#browser-context-expose-binding-option-callback) returns a [Promise], it will be awaited.

The first argument of the [`callback`](/dotnet/api/class-browsercontext#browser-context-expose-binding-option-callback) function contains information about the caller: `{ browserContext:
BrowserContext, page: Page, frame: Frame }`.

See [`Page.ExposeBindingAsync()`](/dotnet/api/class-page#page-expose-binding) for page-only version.

**Usage**

An example of exposing page URL to all frames in all pages in the context:

```csharp
using Microsoft.Playwright;

using var playwright = await Playwright.CreateAsync();
var browser = await playwright.Webkit.LaunchAsync(new() { Headless = false });
var context = await browser.NewContextAsync();

await context.ExposeBindingAsync("pageURL", source => source.Page.Url);
var page = await context.NewPageAsync();
await page.SetContentAsync("<script>\n" +
"  async function onClick() {\n" +
"    document.querySelector('div').textContent = await window.pageURL();\n" +
"  }\n" +
"</script>\n" +
"<button onclick=\"onClick()\">Click me</button>\n" +
"<div></div>");
await page.GetByRole(AriaRole.Button).ClickAsync();
```

**Arguments**

- <a id="browser-context-expose-binding-option-name"></a>`name` `string`

  Name of the function on the window object.
- <a id="browser-context-expose-binding-option-callback"></a>`callback` `function()`

  Callback function that will be called in the Playwright's context.

**Returns**

- `Disposable`


### BrowserContext.ExposeFunctionAsync() {#browser-context-expose-function}

<Badge type="info" text="Added in: v1.8" />

The method adds a function called [`name`](/dotnet/api/class-browsercontext#browser-context-expose-function-option-name) on the `window` object of every frame in every page in the context.
When called, the function executes [`callback`](/dotnet/api/class-browsercontext#browser-context-expose-function-option-callback) and returns a [Promise] which resolves to the return value of
[`callback`](/dotnet/api/class-browsercontext#browser-context-expose-function-option-callback).

If the [`callback`](/dotnet/api/class-browsercontext#browser-context-expose-function-option-callback) returns a [Promise], it will be awaited.

See [`Page.ExposeFunctionAsync()`](/dotnet/api/class-page#page-expose-function) for page-only version.

**Usage**

An example of adding a `sha256` function to all pages in the context:

```csharp
using Microsoft.Playwright;
using System;
using System.Security.Cryptography;
using System.Threading.Tasks;

class BrowserContextExamples
{
    public static async Task Main()
    {
        using var playwright = await Playwright.CreateAsync();
        var browser = await playwright.Webkit.LaunchAsync(new() { Headless = false });
        var context = await browser.NewContextAsync();

        await context.ExposeFunctionAsync("sha256", (string input) =>
        {
            return Convert.ToBase64String(
                SHA256.Create().ComputeHash(System.Text.Encoding.UTF8.GetBytes(input)));
        });

        var page = await context.NewPageAsync();
        await page.SetContentAsync("<script>\n" +
        "  async function onClick() {\n" +
        "    document.querySelector('div').textContent = await window.sha256('PLAYWRIGHT');\n" +
        "  }\n" +
        "</script>\n" +
        "<button onclick=\"onClick()\">Click me</button>\n" +
        "<div></div>");

        await page.GetByRole(AriaRole.Button).ClickAsync();
        Console.WriteLine(await page.TextContentAsync("div"));
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


### BrowserContext.GrantPermissionsAsync() {#browser-context-grant-permissions}

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


### BrowserContext.IsClosed() {#browser-context-is-closed}

<Badge type="info" text="Added in: v1.59" />

Indicates that the browser context is in the process of closing or has already been closed.

**Returns**

- `boolean`


### BrowserContext.NewCDPSessionAsync() {#browser-context-new-cdp-session}

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


### BrowserContext.NewPageAsync() {#browser-context-new-page}

<Badge type="info" text="Added in: v1.8" />

Creates a new page in the browser context.

**Returns**

- `Page`


### BrowserContext.Pages() {#browser-context-pages}

<Badge type="info" text="Added in: v1.8" />

Returns all open pages in the context.

**Returns**

- `Array<Page>`


### BrowserContext.RouteAsync() {#browser-context-route}

<Badge type="info" text="Added in: v1.8" />

Routing provides the capability to modify network requests that are made by any page in the browser context. Once route
is enabled, every request matching the url pattern will stall unless it's continued, fulfilled or aborted.

::: info
[`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route) will not intercept requests intercepted by Service Worker. See [this](https://github.com/microsoft/playwright/issues/1090) issue. We recommend disabling Service Workers when using request interception by setting [`serviceWorkers`](/dotnet/api/class-browser#browser-new-context-option-service-workers) to `'block'`.
:::

**Usage**

An example of a naive handler that aborts all image requests:

```csharp
var context = await browser.NewContextAsync();
var page = await context.NewPageAsync();
await context.RouteAsync("**/*.{png,jpg,jpeg}", r => r.AbortAsync());
await page.GotoAsync("https://theverge.com");
await browser.CloseAsync();
```

or the same snippet using a regex pattern instead:

```csharp
var context = await browser.NewContextAsync();
var page = await context.NewPageAsync();
await context.RouteAsync(new Regex("(\\.png$)|(\\.jpg$)"), r => r.AbortAsync());
await page.GotoAsync("https://theverge.com");
await browser.CloseAsync();
```

It is possible to examine the request to decide the route action. For example, mocking all requests that contain some post data, and leaving all other requests as is:

```csharp
await page.RouteAsync("/api/**", async r =>
{
    if (r.Request.PostData.Contains("my-string"))
        await r.FulfillAsync(new() { Body = "mocked-data" });
    else
        await r.ContinueAsync();
});
```

Page routes (set up with [`Page.RouteAsync()`](/dotnet/api/class-page#page-route)) take precedence over browser context routes when request matches both
handlers.

To remove a route with its handler you can use [`BrowserContext.UnrouteAsync()`](/dotnet/api/class-browsercontext#browser-context-unroute).

::: info
Enabling routing disables http cache.
:::

**Arguments**

- <a id="browser-context-route-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  A glob pattern, regex pattern, or predicate that receives a [URL] to match during routing. If [`baseURL`](/dotnet/api/class-browser#browser-new-context-option-base-url) is set in the context options and the provided URL is a string that does not start with `*`, it is resolved using the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
- <a id="browser-context-route-option-handler"></a>`handler` `function(Route)`

  handler function to route the request.
- <a id="browser-context-route-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-route-option-times"></a>`times` `int` *(optional)* <Badge type="info" text="Added in: v1.15" />

    How often a route should be used. By default it will be used every time.

**Returns**

- `Disposable`


### BrowserContext.RouteFromHARAsync() {#browser-context-route-from-har}

<Badge type="info" text="Added in: v1.23" />

If specified the network requests that are made in the context will be served from the HAR file. Read more about [Replaying from HAR](../mock.md#replaying-from-har).

Playwright will not serve requests intercepted by Service Worker from the HAR file. See [this](https://github.com/microsoft/playwright/issues/1090) issue. We recommend disabling Service Workers when using request interception by setting [`serviceWorkers`](/dotnet/api/class-browser#browser-new-context-option-service-workers) to `'block'`.

**Arguments**

- <a id="browser-context-route-from-har-option-har"></a>`har` `path`

  Path to a [HAR](http://www.softwareishard.com/blog/har-12-spec) file with prerecorded network data. If `path` is a relative path, then it is resolved relative to the current working directory.
- <a id="browser-context-route-from-har-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-route-from-har-option-not-found"></a>`notFound` `"abort" | "fallback"` *(optional)*

    * If set to 'abort' any request not found in the HAR file will be aborted.
    * If set to 'fallback' falls through to the next route handler in the handler chain.

    Defaults to abort.
  - <a id="browser-context-route-from-har-option-update"></a>`update` `boolean` *(optional)*

    If specified, updates the given HAR with the actual network information instead of serving from file. The file is written to disk when [`BrowserContext.CloseAsync()`](/dotnet/api/class-browsercontext#browser-context-close) is called.
  - <a id="browser-context-route-from-har-option-update-content"></a>`updateContent` `"embed" | "attach"` *(optional)* <Badge type="info" text="Added in: v1.32" />

    Optional setting to control resource content management. If `attach` is specified, resources are persisted as separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file.
  - <a id="browser-context-route-from-har-option-update-mode"></a>`updateMode` `"full" | "minimal"` *(optional)* <Badge type="info" text="Added in: v1.32" />

    When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `minimal`.
  - <a id="browser-context-route-from-har-option-url"></a>`url` `string` *(optional)*

    A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.
  - <a id="browser-context-route-from-har-option-url-regex"></a>`urlRegex` `RegExp` *(optional)*

    A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.
  - <a id="browser-context-route-from-har-option-url-string"></a>`urlString` `string` *(optional)*

    A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.


### BrowserContext.RouteWebSocketAsync() {#browser-context-route-web-socket}

<Badge type="info" text="Added in: v1.48" />

This method allows to modify websocket connections that are made by any page in the browser context.

Note that only `WebSocket`s created after this method was called will be routed. It is recommended to call this method before creating any pages.

**Usage**

Below is an example of a simple handler that blocks some websocket messages.
See [WebSocketRoute](/dotnet/api/class-websocketroute) for more details and examples.

```csharp
await context.RouteWebSocketAsync("/ws", ws => {
  var server = ws.ConnectToServer();
  ws.OnMessage(frame => {
    if (frame.Text == "to-be-blocked")
      return;
    server.Send(frame.Text);
  });
});
```

**Arguments**

- <a id="browser-context-route-web-socket-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  Only WebSockets with the url matching this pattern will be routed. A string pattern can be relative to the [`baseURL`](/dotnet/api/class-browser#browser-new-context-option-base-url) context option.
- <a id="browser-context-route-web-socket-option-handler"></a>`handler` `function(WebSocketRoute)`

  Handler function to route the WebSocket.


### BrowserContext.RunAndWaitForConsoleMessageAsync() {#browser-context-wait-for-console-message}

<Badge type="info" text="Added in: v1.34" />

Performs action and waits for a [ConsoleMessage](/dotnet/api/class-consolemessage) to be logged by in the pages in the context. If predicate is provided, it passes
[ConsoleMessage](/dotnet/api/class-consolemessage) value into the `predicate` function and waits for `predicate(message)` to return a truthy value.
Will throw an error if the page is closed before the [`BrowserContext.Console`](/dotnet/api/class-browsercontext#browser-context-event-console) event is fired.

**Arguments**

- <a id="browser-context-wait-for-console-message-option-action"></a>`action` `Func<Task>`

  Action that triggers the event.
- <a id="browser-context-wait-for-console-message-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-wait-for-console-message-option-predicate"></a>`predicate` `function(ConsoleMessage): boolean` *(optional)*

    Receives the [ConsoleMessage](/dotnet/api/class-consolemessage) object and resolves to truthy value when the waiting should resolve.
  - <a id="browser-context-wait-for-console-message-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `ConsoleMessage`


### BrowserContext.RunAndWaitForPageAsync() {#browser-context-wait-for-page}

<Badge type="info" text="Added in: v1.9" />

Performs action and waits for a new [Page](/dotnet/api/class-page) to be created in the context. If predicate is provided, it passes
[Page](/dotnet/api/class-page) value into the `predicate` function and waits for `predicate(event)` to return a truthy value.
Will throw an error if the context closes before new [Page](/dotnet/api/class-page) is created.

**Arguments**

- <a id="browser-context-wait-for-page-option-action"></a>`action` `Func<Task>` <Badge type="info" text="Added in: v1.12" />

  Action that triggers the event.
- <a id="browser-context-wait-for-page-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-wait-for-page-option-predicate"></a>`predicate` `function(Page): boolean` *(optional)*

    Receives the [Page](/dotnet/api/class-page) object and resolves to truthy value when the waiting should resolve.
  - <a id="browser-context-wait-for-page-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `Page`


### BrowserContext.SetDefaultNavigationTimeout() {#browser-context-set-default-navigation-timeout}

<Badge type="info" text="Added in: v1.8" />

This setting will change the default maximum navigation time for the following methods and related shortcuts:
* [`Page.GoBackAsync()`](/dotnet/api/class-page#page-go-back)
* [`Page.GoForwardAsync()`](/dotnet/api/class-page#page-go-forward)
* [`Page.GotoAsync()`](/dotnet/api/class-page#page-goto)
* [`Page.ReloadAsync()`](/dotnet/api/class-page#page-reload)
* [`Page.SetContentAsync()`](/dotnet/api/class-page#page-set-content)
* [`Page.RunAndWaitForNavigationAsync()`](/dotnet/api/class-page#page-wait-for-navigation)

::: info
[`Page.SetDefaultNavigationTimeout()`](/dotnet/api/class-page#page-set-default-navigation-timeout) and [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) take priority over
[`BrowserContext.SetDefaultNavigationTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-navigation-timeout).
:::

**Arguments**

- <a id="browser-context-set-default-navigation-timeout-option-timeout"></a>`timeout` `float`

  Maximum navigation time in milliseconds


### BrowserContext.SetDefaultTimeout() {#browser-context-set-default-timeout}

<Badge type="info" text="Added in: v1.8" />

This setting will change the default maximum time for all the methods accepting [`timeout`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout-option-timeout) option.

::: info
[`Page.SetDefaultNavigationTimeout()`](/dotnet/api/class-page#page-set-default-navigation-timeout), [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) and
[`BrowserContext.SetDefaultNavigationTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-navigation-timeout) take priority over [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout).
:::

**Arguments**

- <a id="browser-context-set-default-timeout-option-timeout"></a>`timeout` `float`

  Maximum time in milliseconds. Pass `0` to disable timeout.


### BrowserContext.SetExtraHTTPHeadersAsync() {#browser-context-set-extra-http-headers}

<Badge type="info" text="Added in: v1.8" />

The extra HTTP headers will be sent with every request initiated by any page in the context. These headers are merged
with page-specific extra HTTP headers set with [`Page.SetExtraHTTPHeadersAsync()`](/dotnet/api/class-page#page-set-extra-http-headers). If page overrides a particular
header, page-specific header value will be used instead of the browser context header value.

::: info
[`BrowserContext.SetExtraHTTPHeadersAsync()`](/dotnet/api/class-browsercontext#browser-context-set-extra-http-headers) does not guarantee the order of headers in the outgoing requests.
:::

**Arguments**

- <a id="browser-context-set-extra-http-headers-option-headers"></a>`headers` `Object<string, string>`

  An object containing additional HTTP headers to be sent with every request. All header values must be strings.


### BrowserContext.SetGeolocationAsync() {#browser-context-set-geolocation}

<Badge type="info" text="Added in: v1.8" />

Sets the context's geolocation. Passing `null` or `undefined` emulates position unavailable.

**Usage**

```csharp
await context.SetGeolocationAsync(new Geolocation()
{
    Latitude = 59.95f,
    Longitude = 30.31667f
});
```

::: info
Consider using [`BrowserContext.GrantPermissionsAsync()`](/dotnet/api/class-browsercontext#browser-context-grant-permissions) to grant permissions for the browser context pages to read
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


### BrowserContext.SetOfflineAsync() {#browser-context-set-offline}

<Badge type="info" text="Added in: v1.8" />

**Arguments**

- <a id="browser-context-set-offline-option-offline"></a>`offline` `boolean`

  Whether to emulate network being offline for the browser context.

  ::: info
  Offline emulation affects HTTP requests, such as page navigations, `fetch()` and `XMLHttpRequest`.

  WebSocket behavior depends on the browser and whether the connection is already established. Chromium and Firefox fail new WebSocket connections while offline, but do not close already-open connections. Chromium can defer incoming messages until the context goes back online, rather than lose them; Firefox can continue delivering messages while offline. WebKit can allow both new WebSocket connections and traffic on established connections while offline. Do not rely on offline emulation to test WebSocket message loss or connection closure.

  Offline emulation does not affect WebRTC traffic: established `RTCPeerConnection`s keep sending and receiving media over UDP. To test WebRTC connection loss, interrupt the connection outside the browser, for example by stopping the TURN server or using an OS-level firewall.
  :::


### BrowserContext.SetStorageStateAsync() {#browser-context-set-storage-state}

<Badge type="info" text="Added in: v1.59" />

Clears the existing cookies, local storage, IndexedDB entries, origin private file system entries and virtual WebAuthn credentials, and sets the new storage
state. When the storage state contains credentials, the virtual WebAuthn authenticator is installed (equivalent to
[`Credentials.InstallAsync()`](/dotnet/api/class-credentials#credentials-install)), preventing all real authenticators from working in this context.

**Usage**

```csharp
// Load storage state from a file and apply it to the context.
await context.SetStorageStateAsync("state.json");
```

**Arguments**

- <a id="browser-context-set-storage-state-option-storage-state"></a>`storageStatePath` `path`

  Populates context with given storage state. This option can be used to initialize context with logged-in information
  obtained via [`BrowserContext.StorageStateAsync()`](/dotnet/api/class-browsercontext#browser-context-storage-state). Path to the file with saved storage state.


### BrowserContext.StorageStateAsync() {#browser-context-storage-state}

<Badge type="info" text="Added in: v1.8" />

Returns storage state for this browser context, contains current cookies, local storage snapshot, IndexedDB snapshot, origin private file system snapshot and virtual WebAuthn credentials.

**Arguments**

- <a id="browser-context-storage-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-storage-state-option-credentials"></a>`credentials` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Set to `true` to include the context's virtual WebAuthn [`BrowserContext.Credentials`](/dotnet/api/class-browsercontext#browser-context-credentials) (passkeys) in the storage
    state snapshot. The captured credentials carry their private keys and signature counters, so they can be re-seeded into a later context via the
    [`storageState`](/dotnet/api/class-browser#browser-new-context-option-storage-state) option or [`BrowserContext.SetStorageStateAsync()`](/dotnet/api/class-browsercontext#browser-context-set-storage-state).
    Note that restoring the storage state that contains credentials will automatically install the virtual WebAuthn authenticator (see [`Credentials.InstallAsync()`](/dotnet/api/class-credentials#credentials-install)), and prevent all real authenticators from working in this context.
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

    The file path to save the storage state to. If [`path`](/dotnet/api/class-browsercontext#browser-context-storage-state-option-path) is a relative path, then it is resolved relative to
    current working directory. If no path is provided, storage
    state is still returned, but won't be saved to the disk.

**Returns**

- `string`


### BrowserContext.UnrouteAsync() {#browser-context-unroute}

<Badge type="info" text="Added in: v1.8" />

Removes a route created with [`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route). When [`handler`](/dotnet/api/class-browsercontext#browser-context-unroute-option-handler) is not specified, removes all
routes for the [`url`](/dotnet/api/class-browsercontext#browser-context-unroute-option-url).

**Arguments**

- <a id="browser-context-unroute-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  A glob pattern, regex pattern, or predicate receiving [URL] used to register a routing with
  [`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route).
- <a id="browser-context-unroute-option-handler"></a>`handler` `function(Route)` *(optional)*

  Optional handler function used to register a routing with [`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route).


### BrowserContext.UnrouteAllAsync() {#browser-context-unroute-all}

<Badge type="info" text="Added in: v1.41" />

Removes all routes created with [`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route) and [`BrowserContext.RouteFromHARAsync()`](/dotnet/api/class-browsercontext#browser-context-route-from-har).

**Arguments**

- <a id="browser-context-unroute-all-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-context-unroute-all-option-behavior"></a>`behavior` `"wait" | "ignoreErrors" | "default"` *(optional)*

    Specifies whether to wait for already running handlers and what to do if they throw errors:
    * `'default'` - do not wait for current handler calls (if any) to finish, if unrouted handler throws, it may result in unhandled error
    * `'wait'` - wait for current handler calls (if any) to finish
    * `'ignoreErrors'` - do not wait for current handler calls (if any) to finish, all errors thrown by the handlers after unrouting are silently caught


## Properties

### BrowserContext.APIRequest {#browser-context-request}

<Badge type="info" text="Added in: v1.16" />

API testing helper associated with this context. Requests made with this API will use context cookies.

**Type**

- `APIRequestContext`


### BrowserContext.Clock {#browser-context-clock}

<Badge type="info" text="Added in: v1.45" />

Playwright has ability to mock clock and passage of time.

**Type**

- `Clock`


### BrowserContext.Credentials {#browser-context-credentials}

<Badge type="info" text="Added in: v1.61" />

Virtual WebAuthn authenticator for this context. Lets tests seed credentials and intercept
`navigator.credentials.create()` / `navigator.credentials.get()` ceremonies.

**Type**

- `Credentials`


### BrowserContext.Debugger {#browser-context-debugger}

<Badge type="info" text="Added in: v1.59" />

Debugger allows to pause and resume the execution.

**Type**

- `Debugger`


### BrowserContext.Tracing {#browser-context-tracing}

<Badge type="info" text="Added in: v1.12" />

**Type**

- `Tracing`


## Events

### BrowserContext.Close {#browser-context-event-close}

<Badge type="info" text="Added in: v1.8" />

Emitted when Browser context gets closed. This might happen because of one of the following:
* Browser context is closed.
* Browser application is closed or crashed.
* The [`Browser.CloseAsync()`](/dotnet/api/class-browser#browser-close) method was called.

**Event data**

- `BrowserContext`


### BrowserContext.Console {#browser-context-event-console}

<Badge type="info" text="Added in: v1.34" />

Emitted when JavaScript within the page calls one of console API methods, e.g. `console.log` or `console.dir`.

The arguments passed into `console.log` and the page are available on the [ConsoleMessage](/dotnet/api/class-consolemessage) event handler argument.

**Usage**

```csharp
context.Console += async (_, msg) =>
{
    foreach (var arg in msg.Args)
        Console.WriteLine(await arg.JsonValueAsync<object>());
};

await page.EvaluateAsync("console.log('hello', 5, { foo: 'bar' })");
```

**Event data**

- `ConsoleMessage`


### BrowserContext.Dialog {#browser-context-event-dialog}

<Badge type="info" text="Added in: v1.34" />

Emitted when a JavaScript dialog appears, such as `alert`, `prompt`, `confirm` or `beforeunload`. Listener **must** either [`Dialog.AcceptAsync()`](/dotnet/api/class-dialog#dialog-accept) or [`Dialog.DismissAsync()`](/dotnet/api/class-dialog#dialog-dismiss) the dialog - otherwise the page will [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#never_blocking) waiting for the dialog, and actions like click will never finish.

**Usage**

```csharp
Context.Dialog += async (_, dialog) =>
{
    await dialog.AcceptAsync();
};
```

::: info
When no [`Page.Dialog`](/dotnet/api/class-page#page-event-dialog) or [`BrowserContext.Dialog`](/dotnet/api/class-browsercontext#browser-context-event-dialog) listeners are present, all dialogs are automatically dismissed.
:::

**Event data**

- `Dialog`


### BrowserContext.DialogClosed {#browser-context-event-dialog-closed}

<Badge type="info" text="Added in: v1.63" />

Emitted when a JavaScript dialog in any page belonging to this context has been closed, either by [`Dialog.AcceptAsync()`](/dotnet/api/class-dialog#dialog-accept), by [`Dialog.DismissAsync()`](/dotnet/api/class-dialog#dialog-dismiss), or manually by the user in the headed browser.

**Event data**

- `Dialog`


### BrowserContext.Download {#browser-context-event-download}

<Badge type="info" text="Added in: v1.60" />

Emitted when attachment download started in any page belonging to this context. User can access basic file operations on downloaded content via the passed [Download](/dotnet/api/class-download) instance. See also [`Page.Download`](/dotnet/api/class-page#page-event-download) to receive events about a specific page.

**Event data**

- `Download`


### BrowserContext.FrameAttached {#browser-context-event-frame-attached}

<Badge type="info" text="Added in: v1.60" />

Emitted when a frame is attached in any page belonging to this context. See also [`Page.FrameAttached`](/dotnet/api/class-page#page-event-frame-attached) to receive events about a specific page.

**Event data**

- `Frame`


### BrowserContext.FrameDetached {#browser-context-event-frame-detached}

<Badge type="info" text="Added in: v1.60" />

Emitted when a frame is detached in any page belonging to this context. See also [`Page.FrameDetached`](/dotnet/api/class-page#page-event-frame-detached) to receive events about a specific page.

**Event data**

- `Frame`


### BrowserContext.FrameNavigated {#browser-context-event-frame-navigated}

<Badge type="info" text="Added in: v1.60" />

Emitted when a frame is navigated to a new url in any page belonging to this context. See also [`Page.FrameNavigated`](/dotnet/api/class-page#page-event-frame-navigated) to receive events about navigations in a specific page.

**Event data**

- `Frame`


### BrowserContext.Page {#browser-context-event-page}

<Badge type="info" text="Added in: v1.8" />

The event is emitted when a new Page is created in the BrowserContext. The page may still be loading. The event will
also fire for popup pages. See also [`Page.Popup`](/dotnet/api/class-page#page-event-popup) to receive events about popups relevant to a specific page.

The earliest moment that page is available is when it has navigated to the initial url. For example, when opening a
popup with `window.open('http://example.com')`, this event will fire when the network request to "http://example.com" is
done and its response has started loading in the popup. If you would like to route/listen to this network request, use [`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route) and [`BrowserContext.Request`](/dotnet/api/class-browsercontext#browser-context-event-request) respectively instead of similar methods on the [Page](/dotnet/api/class-page).

```csharp
var popup = await context.RunAndWaitForPageAsync(async =>
{
    await page.GetByText("open new page").ClickAsync();
});
Console.WriteLine(await popup.EvaluateAsync<string>("location.href"));
```

::: info
Use [`Page.WaitForLoadStateAsync()`](/dotnet/api/class-page#page-wait-for-load-state) to wait until the page gets to a particular state (you should not need it in most
cases).
:::

**Event data**

- `Page`


### BrowserContext.PageClose {#browser-context-event-page-close}

<Badge type="info" text="Added in: v1.60" />

Emitted when a page in this context is closed. See also [`Page.Close`](/dotnet/api/class-page#page-event-close) to receive events about a specific page.

**Event data**

- `Page`


### BrowserContext.PageLoad {#browser-context-event-page-load}

<Badge type="info" text="Added in: v1.60" />

Emitted when the JavaScript [`load`](https://developer.mozilla.org/en-US/docs/Web/Events/load) event is dispatched in any page belonging to this context. See also [`Page.Load`](/dotnet/api/class-page#page-event-load) to receive events about a specific page.

**Event data**

- `Page`


### BrowserContext.Request {#browser-context-event-request}

<Badge type="info" text="Added in: v1.12" />

Emitted when a request is issued from any pages created through this context.
The [request] object is read-only. To only listen for requests from a particular
page, use [`Page.Request`](/dotnet/api/class-page#page-event-request).

In order to intercept and mutate requests, see [`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route)
or [`Page.RouteAsync()`](/dotnet/api/class-page#page-route).

**Event data**

- `Request`


### BrowserContext.RequestFailed {#browser-context-event-request-failed}

<Badge type="info" text="Added in: v1.12" />

Emitted when a request fails, for example by timing out. To only listen for
failed requests from a particular page, use [`Page.RequestFailed`](/dotnet/api/class-page#page-event-request-failed).

::: info
HTTP Error responses, such as 404 or 503, are still successful responses from HTTP standpoint, so request will complete
with [`BrowserContext.RequestFinished`](/dotnet/api/class-browsercontext#browser-context-event-request-finished) event and not with [`BrowserContext.RequestFailed`](/dotnet/api/class-browsercontext#browser-context-event-request-failed).
:::

**Event data**

- `Request`


### BrowserContext.RequestFinished {#browser-context-event-request-finished}

<Badge type="info" text="Added in: v1.12" />

Emitted when a request finishes successfully after downloading the response body. For a successful response, the
sequence of events is `request`, `response` and `requestfinished`. To listen for
successful requests from a particular page, use [`Page.RequestFinished`](/dotnet/api/class-page#page-event-request-finished).

**Event data**

- `Request`


### BrowserContext.Response {#browser-context-event-response}

<Badge type="info" text="Added in: v1.12" />

Emitted when [response] status and headers are received for a request. For a successful response, the sequence of events
is `request`, `response` and `requestfinished`. To listen for response events
from a particular page, use [`Page.Response`](/dotnet/api/class-page#page-event-response).

**Event data**

- `Response`


### BrowserContext.WebError {#browser-context-event-web-error}

<Badge type="info" text="Added in: v1.38" />

Emitted when exception is unhandled in any of the pages in this
context. To listen for errors from a particular page, use [`Page.PageError`](/dotnet/api/class-page#page-event-page-error) instead.

**Event data**

- `WebError`


## Deprecated

### BrowserContext.BackgroundPage {#browser-context-event-background-page}

<Badge type="info" text="Added in: v1.11" />

::: danger Deprecated
Background pages have been removed from Chromium together with Manifest V2 extensions.
:::

This event is not emitted.

**Event data**

- `Page`


### BrowserContext.BackgroundPages() {#browser-context-background-pages}

<Badge type="info" text="Added in: v1.11" />

::: danger Deprecated
Background pages have been removed from Chromium together with Manifest V2 extensions.
:::

Returns an empty list.

**Returns**

- `Array<Page>`

