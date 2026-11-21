---
title: Browser
outline: 2
---

# Browser

<Badge type="info" text="Added in: v1.8" />

A Browser is created via [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch). An example of using a [Browser](/java/api/class-browser) to create a [Page](/java/api/class-page):

```java
import com.microsoft.playwright.*;

public class Example {
 public static void main(String[] args) {
   try (Playwright playwright = Playwright.create()) {
     BrowserType firefox = playwright.firefox();
     Browser browser = firefox.launch();
     Page page = browser.newPage();
     page.navigate("https://example.com");
     browser.close();
   }
 }
}
```

## Methods

### browser.bind() {#browser-bind}

<Badge type="info" text="Added in: v1.59" />

Binds the browser to a named pipe or web socket, making it available for other clients to connect to.

**Arguments**

- <a id="browser-bind-option-title"></a>`title` `string`

  Title of the browser server, used for identification.
- <a id="browser-bind-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-bind-option-host"></a>`host` `string` *(optional)*

    Host to bind the web socket server to. When specified, a web socket server is created instead of a named pipe.
  - <a id="browser-bind-option-port"></a>`port` `int` *(optional)*

    Port to bind the web socket server to. When specified, a web socket server is created instead of a named pipe. Use `0` to let the OS pick an available port.
  - <a id="browser-bind-option-workspace-dir"></a>`workspaceDir` `string` *(optional)*

    Working directory associated with this browser server.

**Returns**

- `Object`


### browser.browserType() {#browser-browser-type}

<Badge type="info" text="Added in: v1.23" />

Get the browser type (chromium, firefox or webkit) that the browser belongs to.

**Returns**

- `BrowserType`


### browser.close() {#browser-close}

<Badge type="info" text="Added in: v1.8" />

In case this browser is obtained using [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch), closes the browser and all of its pages (if any
were opened).

In case this browser is connected to, clears all created contexts belonging to this browser and disconnects from the
browser server.

::: info
This is similar to force-quitting the browser. To close pages gracefully and ensure you receive page close events, call [`browserContext.close()`](/java/api/class-browsercontext#browser-context-close) on any [BrowserContext](/java/api/class-browsercontext) instances you explicitly created earlier using [`browser.newContext()`](/java/api/class-browser#browser-new-context) **before** calling [`browser.close()`](/java/api/class-browser#browser-close).
:::

The [Browser](/java/api/class-browser) object itself is considered to be disposed and cannot be used anymore.

**Arguments**

- <a id="browser-close-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-close-option-reason"></a>`reason` `string` *(optional)* <Badge type="info" text="Added in: v1.40" />

    The reason to be reported to the operations interrupted by the browser closure.


### browser.contexts() {#browser-contexts}

<Badge type="info" text="Added in: v1.8" />

Returns an array of all open browser contexts. In a newly created browser, this will return zero browser contexts.

**Usage**

```java
Browser browser = pw.webkit().launch();
System.out.println(browser.contexts().size()); // prints "0"
BrowserContext context = browser.newContext();
System.out.println(browser.contexts().size()); // prints "1"
```

**Returns**

- `Array<BrowserContext>`


### browser.isConnected() {#browser-is-connected}

<Badge type="info" text="Added in: v1.8" />

Indicates that the browser is connected.

**Returns**

- `boolean`


### browser.newBrowserCDPSession() {#browser-new-browser-cdp-session}

<Badge type="info" text="Added in: v1.11" />

::: info
CDP Sessions are only supported on Chromium-based browsers.
:::

Returns the newly created browser session.

**Returns**

- `CDPSession`


### browser.newContext() {#browser-new-context}

<Badge type="info" text="Added in: v1.8" />

Creates a new browser context. It won't share cookies/cache with other browser contexts.

::: info
If directly using this method to create [BrowserContext](/java/api/class-browsercontext)s, it is best practice to explicitly close the returned context via [`browserContext.close()`](/java/api/class-browsercontext#browser-context-close) when your code is done with the [BrowserContext](/java/api/class-browsercontext),
and before calling [`browser.close()`](/java/api/class-browser#browser-close). This will ensure the `context` is closed gracefully and any artifacts—like HARs and videos—are fully flushed and saved.
:::

**Usage**

```java
Browser browser = playwright.firefox().launch();  // Or 'chromium' or 'webkit'.
// Create a new incognito browser context.
BrowserContext context = browser.newContext();
// Create a new page in a pristine context.
Page page = context.newPage();
page.navigate("https://example.com");

// Graceful close up everything
context.close();
browser.close();
```

**Arguments**

- <a id="browser-new-context-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-new-context-option-accept-downloads"></a>`acceptDownloads` `boolean` *(optional)*

    Whether to automatically download all the attachments. Defaults to `true` where all the downloads are accepted.
  - <a id="browser-new-context-option-base-url"></a>`baseURL` `string` *(optional)*

    When using [`page.navigate()`](/java/api/class-page#page-goto), [`page.route()`](/java/api/class-page#page-route), [`page.waitForURL()`](/java/api/class-page#page-wait-for-url), [`page.waitForRequest()`](/java/api/class-page#page-wait-for-request), or [`page.waitForResponse()`](/java/api/class-page#page-wait-for-response) it takes the base URL in consideration by using the [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor for building the corresponding URL. Unset by default. Examples:
    * baseURL: `http://localhost:3000` and navigating to `/bar.html` results in `http://localhost:3000/bar.html`
    * baseURL: `http://localhost:3000/foo/` and navigating to `./bar.html` results in `http://localhost:3000/foo/bar.html`
    * baseURL: `http://localhost:3000/foo` (without trailing slash) and navigating to `./bar.html` results in `http://localhost:3000/bar.html`
  - <a id="browser-new-context-option-bypass-csp"></a>`bypassCSP` `boolean` *(optional)*

    Toggles bypassing page's Content-Security-Policy. Defaults to `false`.
  - <a id="browser-new-context-option-client-certificates"></a>`clientCertificates` `Array<Object>` *(optional)* <Badge type="info" text="Added in: v1.46" />

    TLS Client Authentication allows the server to request a client certificate and verify it.

    **Details**

    An array of client certificates to be used. Each certificate object must have either both `certPath` and `keyPath`, a single `pfxPath`, or their corresponding direct value equivalents (`cert` and `key`, or `pfx`). Optionally, `passphrase` property should be provided if the certificate is encrypted. The `origin` property should be provided with an exact match to the request origin that the certificate is valid for.

    Client certificate authentication is only active when at least one client certificate is provided. If you want to reject all client certificates sent by the server, you need to provide a client certificate with an `origin` that does not match any of the domains you plan to visit.

    ::: info
    When using WebKit on macOS, accessing `localhost` will not pick up client certificates. You can make it work by replacing `localhost` with `local.playwright`.
    :::

    - `origin` `string` <Badge type="info" text="Added in: v1.46" />

      Exact origin that the certificate is valid for. Origin includes `https` protocol, a hostname and optionally a port.
    - `certPath` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Path to the file with the certificate in PEM format.
    - `cert` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Direct value of the certificate in PEM format.
    - `keyPath` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Path to the file with the private key in PEM format.
    - `key` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Direct value of the private key in PEM format.
    - `pfxPath` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Path to the PFX or PKCS12 encoded private key and certificate chain.
    - `pfx` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Direct value of the PFX or PKCS12 encoded private key and certificate chain.
    - `passphrase` `string` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Passphrase for the private key (PEM or PFX).
  - <a id="browser-new-context-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(optional)*

    Emulates [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media feature, supported values are `'light'` and `'dark'`. See
    [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'light'`.
  - <a id="browser-new-context-option-contrast"></a>`contrast` `null | "no-preference" | "more"` *(optional)*

    Emulates `'prefers-contrast'` media feature, supported values are `'no-preference'`, `'more'`. See [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="browser-new-context-option-device-scale-factor"></a>`deviceScaleFactor` `float` *(optional)*

    Specify device scale factor (can be thought of as dpr). Defaults to `1`. Learn more about [emulating devices with device scale factor](../emulation.md#devices).
  - <a id="browser-new-context-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(optional)*

    An object containing additional HTTP headers to be sent with every request. Defaults to none.
  - <a id="browser-new-context-option-forced-colors"></a>`forcedColors` `null | "active" | "none"` *(optional)*

    Emulates `'forced-colors'` media feature, supported values are `'active'`, `'none'`. See [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'none'`.
  - <a id="browser-new-context-option-geolocation"></a>`geolocation` `Object` *(optional)*

    - `latitude` `float`

      Latitude between -90 and 90.
    - `longitude` `float`

      Longitude between -180 and 180.
    - `accuracy` `float` *(optional)*

      Non-negative accuracy value. Defaults to `0`.
  - <a id="browser-new-context-option-has-touch"></a>`hasTouch` `boolean` *(optional)*

    Specifies if viewport supports touch events. Defaults to false. Learn more about [mobile emulation](../emulation.md#devices).
  - <a id="browser-new-context-option-http-credentials"></a>`httpCredentials` `Object | Array<Object>` *(optional)*

    Credentials for [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).
    If no origin is specified, the username and password are sent to any servers upon unauthorized responses.

    Pass an array to use different credentials for different origins. The first entry that matches the request origin is used, and entries with no origin match any request.

    - `username` `string`
    - `password` `string`
    - `origin` `string` *(optional)*

      Restrain sending http credentials on specific origin (scheme://host:port).
    - `send` `"unauthorized" | "always"` *(optional)*

      This option only applies to the requests sent from corresponding [APIRequestContext](/java/api/class-apirequestcontext) and does not affect requests sent from the browser. `'always'` - `Authorization` header with basic authentication credentials will be sent with the each API request. `'unauthorized` - the credentials are only sent when 401 (Unauthorized) response with `WWW-Authenticate` header is received. Defaults to `'unauthorized'`.
  - <a id="browser-new-context-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="browser-new-context-option-is-mobile"></a>`isMobile` `boolean` *(optional)*

    Whether the `meta viewport` tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to `false`. Learn more about [mobile emulation](../emulation.md#ismobile).
  - <a id="browser-new-context-option-java-script-enabled"></a>`javaScriptEnabled` `boolean` *(optional)*

    Whether or not to enable JavaScript in the context. Defaults to `true`. Learn more about [disabling JavaScript](../emulation.md#javascript-enabled).
  - <a id="browser-new-context-option-locale"></a>`locale` `string` *(optional)*

    Specify user locale, for example `en-GB`, `de-DE`, etc. Locale will affect `navigator.language` value, `Accept-Language` request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our [emulation guide](../emulation.md#locale--timezone).
  - <a id="browser-new-context-option-offline"></a>`offline` `boolean` *(optional)*

    Whether to emulate network being offline. Defaults to `false`. Learn more about [network emulation](../emulation.md#offline).
  - <a id="browser-new-context-option-permissions"></a>`permissions` `Array<string>` *(optional)*

    A list of permissions to grant to all pages in this context. See
    [`browserContext.grantPermissions()`](/java/api/class-browsercontext#browser-context-grant-permissions) for more details. Defaults to none.
  - <a id="browser-new-context-option-proxy"></a>`proxy` `Object` *(optional)*

    Network proxy settings to use with this context. Defaults to none.

    - `server` `string`

      Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example
      `http://myproxy.com:3128` or `socks5://myproxy.com:3128`. Short form `myproxy.com:3128` is considered an HTTP proxy.
    - `bypass` `string` *(optional)*

      Optional comma-separated domains to bypass proxy, for example `".com, chromium.org, .domain.com"`.
    - `username` `string` *(optional)*

      Optional username to use if HTTP proxy requires authentication.
    - `password` `string` *(optional)*

      Optional password to use if HTTP proxy requires authentication.
  - <a id="browser-new-context-option-record-har-content"></a>`recordHarContent` `"omit" | "embed" | "attach"` *(optional)*

    Optional setting to control resource content management. If `omit` is specified, content is not persisted. If `attach` is specified, resources are persisted as separate files and all of these files are archived along with the HAR file. Defaults to `embed`, which stores content inline the HAR file as per HAR specification.
  - <a id="browser-new-context-option-record-har-mode"></a>`recordHarMode` `"full" | "minimal"` *(optional)*

    When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `full`.
  - <a id="browser-new-context-option-record-har-omit-content"></a>`recordHarOmitContent` `boolean` *(optional)*

    Optional setting to control whether to omit request content from the HAR. Defaults to `false`.
  - <a id="browser-new-context-option-record-har-path"></a>`recordHarPath` `path` *(optional)*

    Enables [HAR](http://www.softwareishard.com/blog/har-12-spec) recording for all pages into the
    specified HAR file on the filesystem. If not specified, the HAR is not recorded. Make sure to
    call [`browserContext.close()`](/java/api/class-browsercontext#browser-context-close) for the HAR to be saved.
  - <a id="browser-new-context-option-record-har-url-filter"></a>`recordHarUrlFilter` `string | RegExp` *(optional)*
  - <a id="browser-new-context-option-record-video-dir"></a>`recordVideoDir` `path` *(optional)*

    Enables video recording for all pages into the specified directory. If not specified videos are
    not recorded. Make sure to call [`browserContext.close()`](/java/api/class-browsercontext#browser-context-close) for videos to be saved.
  - <a id="browser-new-context-option-record-video-fps"></a>`recordVideoFps` `int` *(optional)* <Badge type="info" text="Added in: v1.64" />

    Frame rate of the recorded videos in frames per second. Defaults to `25`. Firefox and WebKit currently capture up to 25 frames per second.
  - <a id="browser-new-context-option-record-video-size"></a>`recordVideoSize` `Object` *(optional)*

    Dimensions of the recorded videos. If not specified the size will be equal to `viewport`
    scaled down to fit into 800x800. If `viewport` is not configured explicitly the video size defaults to 800x450.
    Actual picture of each page will be scaled down if necessary to fit the specified size.

    - `width` `int`

      Video frame width.
    - `height` `int`

      Video frame height.
  - <a id="browser-new-context-option-reduced-motion"></a>`reducedMotion` `null | "reduce" | "no-preference"` *(optional)*

    Emulates `'prefers-reduced-motion'` media feature, supported values are `'reduce'`, `'no-preference'`. See [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="browser-new-context-option-screen"></a>`screenSize` `Object` *(optional)*

    Emulates consistent window screen size available inside web page via `window.screen`. Is only used when the
    [`viewportSize`](/java/api/class-browser#browser-new-context-option-viewport) is set.

    - `width` `int`

      page width in pixels.
    - `height` `int`

      page height in pixels.
  - <a id="browser-new-context-option-service-workers"></a>`serviceWorkers` `"allow" | "block"` *(optional)*

    Whether to allow sites to register Service workers. Defaults to `'allow'`.
    * `'allow'`: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) can be registered.
    * `'block'`: Playwright will block all registration of Service Workers.
  - <a id="browser-new-context-option-storage-state"></a>`storageState` `string` *(optional)*

    Populates context with given storage state. This option can be used to initialize context with logged-in information
    obtained via [`browserContext.storageState()`](/java/api/class-browsercontext#browser-context-storage-state).
  - <a id="browser-new-context-option-storage-state-path"></a>`storageStatePath` `path` *(optional)* <Badge type="info" text="Added in: v1.9" />

    Populates context with given storage state. This option can be used to initialize context with logged-in information
    obtained via [`browserContext.storageState()`](/java/api/class-browsercontext#browser-context-storage-state). Path to the file with saved storage state.
  - <a id="browser-new-context-option-strict-selectors"></a>`strictSelectors` `boolean` *(optional)*

    If set to true, enables strict selectors mode for this context. In the strict selectors mode all operations
    on selectors that imply single target DOM element will throw when more than one element matches the selector.
    This option does not affect any Locator APIs (Locators are always strict). Defaults to `false`.
    See [Locator](/java/api/class-locator) to learn more about the strict mode.
  - <a id="browser-new-context-option-timezone-id"></a>`timezoneId` `string` *(optional)*

    Changes the timezone of the context. See [ICU's metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)
    for a list of supported timezone IDs. Defaults to the system timezone.
  - <a id="browser-new-context-option-user-agent"></a>`userAgent` `string` *(optional)*

    Specific user agent to use in this context.
  - <a id="browser-new-context-option-viewport"></a>`viewportSize` `null | Object` *(optional)*

    Emulates consistent viewport for each page. Defaults to an 1280x720 viewport.
    Use `null` to disable the consistent viewport emulation. Learn more about [viewport emulation](../emulation#viewport).

    ::: info
    The `null` value opts out from the default presets, makes viewport depend on the
    host window size defined by the operating system. It makes the execution of the
    tests non-deterministic.
    :::

    - `width` `int`

      page width in pixels.
    - `height` `int`

      page height in pixels.

**Returns**

- `BrowserContext`


### browser.newPage() {#browser-new-page}

<Badge type="info" text="Added in: v1.8" />

Creates a new page in a new browser context. Closing this page will close the context as well.

This is a convenience API that should only be used for the single-page scenarios and short snippets. Production code and
testing frameworks should explicitly create [`browser.newContext()`](/java/api/class-browser#browser-new-context) followed by the
[`browserContext.newPage()`](/java/api/class-browsercontext#browser-context-new-page) to control their exact life times.

**Arguments**

- <a id="browser-new-page-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-new-page-option-accept-downloads"></a>`acceptDownloads` `boolean` *(optional)*

    Whether to automatically download all the attachments. Defaults to `true` where all the downloads are accepted.
  - <a id="browser-new-page-option-base-url"></a>`baseURL` `string` *(optional)*

    When using [`page.navigate()`](/java/api/class-page#page-goto), [`page.route()`](/java/api/class-page#page-route), [`page.waitForURL()`](/java/api/class-page#page-wait-for-url), [`page.waitForRequest()`](/java/api/class-page#page-wait-for-request), or [`page.waitForResponse()`](/java/api/class-page#page-wait-for-response) it takes the base URL in consideration by using the [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor for building the corresponding URL. Unset by default. Examples:
    * baseURL: `http://localhost:3000` and navigating to `/bar.html` results in `http://localhost:3000/bar.html`
    * baseURL: `http://localhost:3000/foo/` and navigating to `./bar.html` results in `http://localhost:3000/foo/bar.html`
    * baseURL: `http://localhost:3000/foo` (without trailing slash) and navigating to `./bar.html` results in `http://localhost:3000/bar.html`
  - <a id="browser-new-page-option-bypass-csp"></a>`bypassCSP` `boolean` *(optional)*

    Toggles bypassing page's Content-Security-Policy. Defaults to `false`.
  - <a id="browser-new-page-option-client-certificates"></a>`clientCertificates` `Array<Object>` *(optional)* <Badge type="info" text="Added in: v1.46" />

    TLS Client Authentication allows the server to request a client certificate and verify it.

    **Details**

    An array of client certificates to be used. Each certificate object must have either both `certPath` and `keyPath`, a single `pfxPath`, or their corresponding direct value equivalents (`cert` and `key`, or `pfx`). Optionally, `passphrase` property should be provided if the certificate is encrypted. The `origin` property should be provided with an exact match to the request origin that the certificate is valid for.

    Client certificate authentication is only active when at least one client certificate is provided. If you want to reject all client certificates sent by the server, you need to provide a client certificate with an `origin` that does not match any of the domains you plan to visit.

    ::: info
    When using WebKit on macOS, accessing `localhost` will not pick up client certificates. You can make it work by replacing `localhost` with `local.playwright`.
    :::

    - `origin` `string` <Badge type="info" text="Added in: v1.46" />

      Exact origin that the certificate is valid for. Origin includes `https` protocol, a hostname and optionally a port.
    - `certPath` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Path to the file with the certificate in PEM format.
    - `cert` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Direct value of the certificate in PEM format.
    - `keyPath` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Path to the file with the private key in PEM format.
    - `key` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Direct value of the private key in PEM format.
    - `pfxPath` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Path to the PFX or PKCS12 encoded private key and certificate chain.
    - `pfx` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Direct value of the PFX or PKCS12 encoded private key and certificate chain.
    - `passphrase` `string` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Passphrase for the private key (PEM or PFX).
  - <a id="browser-new-page-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(optional)*

    Emulates [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media feature, supported values are `'light'` and `'dark'`. See
    [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'light'`.
  - <a id="browser-new-page-option-contrast"></a>`contrast` `null | "no-preference" | "more"` *(optional)*

    Emulates `'prefers-contrast'` media feature, supported values are `'no-preference'`, `'more'`. See [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="browser-new-page-option-device-scale-factor"></a>`deviceScaleFactor` `float` *(optional)*

    Specify device scale factor (can be thought of as dpr). Defaults to `1`. Learn more about [emulating devices with device scale factor](../emulation.md#devices).
  - <a id="browser-new-page-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(optional)*

    An object containing additional HTTP headers to be sent with every request. Defaults to none.
  - <a id="browser-new-page-option-forced-colors"></a>`forcedColors` `null | "active" | "none"` *(optional)*

    Emulates `'forced-colors'` media feature, supported values are `'active'`, `'none'`. See [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'none'`.
  - <a id="browser-new-page-option-geolocation"></a>`geolocation` `Object` *(optional)*

    - `latitude` `float`

      Latitude between -90 and 90.
    - `longitude` `float`

      Longitude between -180 and 180.
    - `accuracy` `float` *(optional)*

      Non-negative accuracy value. Defaults to `0`.
  - <a id="browser-new-page-option-has-touch"></a>`hasTouch` `boolean` *(optional)*

    Specifies if viewport supports touch events. Defaults to false. Learn more about [mobile emulation](../emulation.md#devices).
  - <a id="browser-new-page-option-http-credentials"></a>`httpCredentials` `Object | Array<Object>` *(optional)*

    Credentials for [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).
    If no origin is specified, the username and password are sent to any servers upon unauthorized responses.

    Pass an array to use different credentials for different origins. The first entry that matches the request origin is used, and entries with no origin match any request.

    - `username` `string`
    - `password` `string`
    - `origin` `string` *(optional)*

      Restrain sending http credentials on specific origin (scheme://host:port).
    - `send` `"unauthorized" | "always"` *(optional)*

      This option only applies to the requests sent from corresponding [APIRequestContext](/java/api/class-apirequestcontext) and does not affect requests sent from the browser. `'always'` - `Authorization` header with basic authentication credentials will be sent with the each API request. `'unauthorized` - the credentials are only sent when 401 (Unauthorized) response with `WWW-Authenticate` header is received. Defaults to `'unauthorized'`.
  - <a id="browser-new-page-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="browser-new-page-option-is-mobile"></a>`isMobile` `boolean` *(optional)*

    Whether the `meta viewport` tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to `false`. Learn more about [mobile emulation](../emulation.md#ismobile).
  - <a id="browser-new-page-option-java-script-enabled"></a>`javaScriptEnabled` `boolean` *(optional)*

    Whether or not to enable JavaScript in the context. Defaults to `true`. Learn more about [disabling JavaScript](../emulation.md#javascript-enabled).
  - <a id="browser-new-page-option-locale"></a>`locale` `string` *(optional)*

    Specify user locale, for example `en-GB`, `de-DE`, etc. Locale will affect `navigator.language` value, `Accept-Language` request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our [emulation guide](../emulation.md#locale--timezone).
  - <a id="browser-new-page-option-offline"></a>`offline` `boolean` *(optional)*

    Whether to emulate network being offline. Defaults to `false`. Learn more about [network emulation](../emulation.md#offline).
  - <a id="browser-new-page-option-permissions"></a>`permissions` `Array<string>` *(optional)*

    A list of permissions to grant to all pages in this context. See
    [`browserContext.grantPermissions()`](/java/api/class-browsercontext#browser-context-grant-permissions) for more details. Defaults to none.
  - <a id="browser-new-page-option-proxy"></a>`proxy` `Object` *(optional)*

    Network proxy settings to use with this context. Defaults to none.

    - `server` `string`

      Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example
      `http://myproxy.com:3128` or `socks5://myproxy.com:3128`. Short form `myproxy.com:3128` is considered an HTTP proxy.
    - `bypass` `string` *(optional)*

      Optional comma-separated domains to bypass proxy, for example `".com, chromium.org, .domain.com"`.
    - `username` `string` *(optional)*

      Optional username to use if HTTP proxy requires authentication.
    - `password` `string` *(optional)*

      Optional password to use if HTTP proxy requires authentication.
  - <a id="browser-new-page-option-record-har-content"></a>`recordHarContent` `"omit" | "embed" | "attach"` *(optional)*

    Optional setting to control resource content management. If `omit` is specified, content is not persisted. If `attach` is specified, resources are persisted as separate files and all of these files are archived along with the HAR file. Defaults to `embed`, which stores content inline the HAR file as per HAR specification.
  - <a id="browser-new-page-option-record-har-mode"></a>`recordHarMode` `"full" | "minimal"` *(optional)*

    When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `full`.
  - <a id="browser-new-page-option-record-har-omit-content"></a>`recordHarOmitContent` `boolean` *(optional)*

    Optional setting to control whether to omit request content from the HAR. Defaults to `false`.
  - <a id="browser-new-page-option-record-har-path"></a>`recordHarPath` `path` *(optional)*

    Enables [HAR](http://www.softwareishard.com/blog/har-12-spec) recording for all pages into the
    specified HAR file on the filesystem. If not specified, the HAR is not recorded. Make sure to
    call [`browserContext.close()`](/java/api/class-browsercontext#browser-context-close) for the HAR to be saved.
  - <a id="browser-new-page-option-record-har-url-filter"></a>`recordHarUrlFilter` `string | RegExp` *(optional)*
  - <a id="browser-new-page-option-record-video-dir"></a>`recordVideoDir` `path` *(optional)*

    Enables video recording for all pages into the specified directory. If not specified videos are
    not recorded. Make sure to call [`browserContext.close()`](/java/api/class-browsercontext#browser-context-close) for videos to be saved.
  - <a id="browser-new-page-option-record-video-fps"></a>`recordVideoFps` `int` *(optional)* <Badge type="info" text="Added in: v1.64" />

    Frame rate of the recorded videos in frames per second. Defaults to `25`. Firefox and WebKit currently capture up to 25 frames per second.
  - <a id="browser-new-page-option-record-video-size"></a>`recordVideoSize` `Object` *(optional)*

    Dimensions of the recorded videos. If not specified the size will be equal to `viewport`
    scaled down to fit into 800x800. If `viewport` is not configured explicitly the video size defaults to 800x450.
    Actual picture of each page will be scaled down if necessary to fit the specified size.

    - `width` `int`

      Video frame width.
    - `height` `int`

      Video frame height.
  - <a id="browser-new-page-option-reduced-motion"></a>`reducedMotion` `null | "reduce" | "no-preference"` *(optional)*

    Emulates `'prefers-reduced-motion'` media feature, supported values are `'reduce'`, `'no-preference'`. See [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="browser-new-page-option-screen"></a>`screenSize` `Object` *(optional)*

    Emulates consistent window screen size available inside web page via `window.screen`. Is only used when the
    [`viewportSize`](/java/api/class-browser#browser-new-page-option-viewport) is set.

    - `width` `int`

      page width in pixels.
    - `height` `int`

      page height in pixels.
  - <a id="browser-new-page-option-service-workers"></a>`serviceWorkers` `"allow" | "block"` *(optional)*

    Whether to allow sites to register Service workers. Defaults to `'allow'`.
    * `'allow'`: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) can be registered.
    * `'block'`: Playwright will block all registration of Service Workers.
  - <a id="browser-new-page-option-storage-state"></a>`storageState` `string` *(optional)*

    Populates context with given storage state. This option can be used to initialize context with logged-in information
    obtained via [`browserContext.storageState()`](/java/api/class-browsercontext#browser-context-storage-state).
  - <a id="browser-new-page-option-storage-state-path"></a>`storageStatePath` `path` *(optional)* <Badge type="info" text="Added in: v1.9" />

    Populates context with given storage state. This option can be used to initialize context with logged-in information
    obtained via [`browserContext.storageState()`](/java/api/class-browsercontext#browser-context-storage-state). Path to the file with saved storage state.
  - <a id="browser-new-page-option-strict-selectors"></a>`strictSelectors` `boolean` *(optional)*

    If set to true, enables strict selectors mode for this context. In the strict selectors mode all operations
    on selectors that imply single target DOM element will throw when more than one element matches the selector.
    This option does not affect any Locator APIs (Locators are always strict). Defaults to `false`.
    See [Locator](/java/api/class-locator) to learn more about the strict mode.
  - <a id="browser-new-page-option-timezone-id"></a>`timezoneId` `string` *(optional)*

    Changes the timezone of the context. See [ICU's metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)
    for a list of supported timezone IDs. Defaults to the system timezone.
  - <a id="browser-new-page-option-user-agent"></a>`userAgent` `string` *(optional)*

    Specific user agent to use in this context.
  - <a id="browser-new-page-option-viewport"></a>`viewportSize` `null | Object` *(optional)*

    Emulates consistent viewport for each page. Defaults to an 1280x720 viewport.
    Use `null` to disable the consistent viewport emulation. Learn more about [viewport emulation](../emulation#viewport).

    ::: info
    The `null` value opts out from the default presets, makes viewport depend on the
    host window size defined by the operating system. It makes the execution of the
    tests non-deterministic.
    :::

    - `width` `int`

      page width in pixels.
    - `height` `int`

      page height in pixels.

**Returns**

- `Page`


### browser.startTracing() {#browser-start-tracing}

<Badge type="info" text="Added in: v1.11" />

::: info
This API controls [Chromium Tracing](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) which is a low-level chromium-specific debugging tool. API to control [Playwright Tracing](../trace-viewer) could be found [here](./class-tracing).
:::

You can use [`browser.startTracing()`](/java/api/class-browser#browser-start-tracing) and [`browser.stopTracing()`](/java/api/class-browser#browser-stop-tracing) to create a trace file that can
be opened in Chrome DevTools performance panel.

**Usage**

```java
browser.startTracing(page, new Browser.StartTracingOptions()
  .setPath(Paths.get("trace.json")));
page.navigate("https://www.google.com");
browser.stopTracing();
```

**Arguments**

- <a id="browser-start-tracing-option-page"></a>`page` `Page` *(optional)*

  Optional, if specified, tracing includes screenshots of the given page.
- <a id="browser-start-tracing-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-start-tracing-option-categories"></a>`categories` `Array<string>` *(optional)*

    specify custom categories to use instead of default.
  - <a id="browser-start-tracing-option-path"></a>`path` `path` *(optional)*

    A path to write the trace file to.
  - <a id="browser-start-tracing-option-screenshots"></a>`screenshots` `boolean` *(optional)*

    captures screenshots in the trace.


### browser.stopTracing() {#browser-stop-tracing}

<Badge type="info" text="Added in: v1.11" />

::: info
This API controls [Chromium Tracing](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) which is a low-level chromium-specific debugging tool. API to control [Playwright Tracing](../trace-viewer) could be found [here](./class-tracing).
:::

Returns the buffer with trace data.

**Returns**

- `Buffer`


### browser.unbind() {#browser-unbind}

<Badge type="info" text="Added in: v1.59" />

Unbinds the browser server previously bound with [`browser.bind()`](/java/api/class-browser#browser-bind).


### browser.version() {#browser-version}

<Badge type="info" text="Added in: v1.8" />

Returns the browser version.

**Returns**

- `string`


## Events

### browser.onContext() {#browser-event-context}

<Badge type="info" text="Added in: v1.60" />

Emitted when a new browser context is created.

**Event data**

- `BrowserContext`


### browser.onDisconnected() {#browser-event-disconnected}

<Badge type="info" text="Added in: v1.8" />

Emitted when Browser gets disconnected from the browser application. This might happen because of one of the following:
* Browser application is closed or crashed.
* The [`browser.close()`](/java/api/class-browser#browser-close) method was called.

**Event data**

- `Browser`

