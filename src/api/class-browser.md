---
title: Browser
outline: 2
---

# Browser

<Badge type="info" text="Added in: v1.8" />

A Browser is created via [`browserType.launch()`](/api/class-browsertype#browser-type-launch). An example of using a [Browser](/api/class-browser) to create a [Page](/api/class-page):

```js
const { firefox } = require('playwright');  // Or 'chromium' or 'webkit'.

(async () => {
  const browser = await firefox.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await browser.close();
})();
```

## Methods

### browser.bind() {#browser-bind}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

Binds the browser to a named pipe or web socket, making it available for other clients to connect to.

**Arguments**

- <a id="browser-bind-option-title"></a>`title` `string`

  Title of the browser server, used for identification.
- <a id="browser-bind-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-bind-option-host"></a>`host` `string` *(optional)*

    Host to bind the web socket server to. When specified, a web socket server is created instead of a named pipe.
  - <a id="browser-bind-option-metadata"></a>`metadata` `Object<string, any>` *(optional)*

    Additional metadata to associate with the browser server.
  - <a id="browser-bind-option-port"></a>`port` `int` *(optional)*

    Port to bind the web socket server to. When specified, a web socket server is created instead of a named pipe. Use `0` to let the OS pick an available port.
  - <a id="browser-bind-option-workspace-dir"></a>`workspaceDir` `string` *(optional)*

    Working directory associated with this browser server.

**Returns**

- `Promise<Object>`


### browser.browserType() {#browser-browser-type}

<Badge type="info" text="Added in: v1.23" />

Get the browser type (chromium, firefox or webkit) that the browser belongs to.

**Returns**

- `BrowserType`


### browser.close() {#browser-close}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

In case this browser is obtained using [`browserType.launch()`](/api/class-browsertype#browser-type-launch), closes the browser and all of its pages (if any
were opened).

In case this browser is connected to, clears all created contexts belonging to this browser and disconnects from the
browser server.

::: info
This is similar to force-quitting the browser. To close pages gracefully and ensure you receive page close events, call [`browserContext.close()`](/api/class-browsercontext#browser-context-close) on any [BrowserContext](/api/class-browsercontext) instances you explicitly created earlier using [`browser.newContext()`](/api/class-browser#browser-new-context) **before** calling [`browser.close()`](/api/class-browser#browser-close).
:::

The [Browser](/api/class-browser) object itself is considered to be disposed and cannot be used anymore.

**Arguments**

- <a id="browser-close-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-close-option-reason"></a>`reason` `string` *(optional)* <Badge type="info" text="Added in: v1.40" />

    The reason to be reported to the operations interrupted by the browser closure.


### browser.contexts() {#browser-contexts}

<Badge type="info" text="Added in: v1.8" />

Returns an array of all open browser contexts. In a newly created browser, this will return zero browser contexts.

**Usage**

```js
const browser = await pw.webkit.launch();
console.log(browser.contexts().length); // prints `0`

const context = await browser.newContext();
console.log(browser.contexts().length); // prints `1`
```

**Returns**

- `Array<BrowserContext>`


### browser.isConnected() {#browser-is-connected}

<Badge type="info" text="Added in: v1.8" />

Indicates that the browser is connected.

**Returns**

- `boolean`


### browser.newBrowserCDPSession() {#browser-new-browser-cdp-session}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

::: info
CDP Sessions are only supported on Chromium-based browsers.
:::

Returns the newly created browser session.

**Returns**

- `Promise<CDPSession>`


### browser.newContext() {#browser-new-context}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Creates a new browser context. It won't share cookies/cache with other browser contexts.

::: info
If directly using this method to create [BrowserContext](/api/class-browsercontext)s, it is best practice to explicitly close the returned context via [`browserContext.close()`](/api/class-browsercontext#browser-context-close) when your code is done with the [BrowserContext](/api/class-browsercontext),
and before calling [`browser.close()`](/api/class-browser#browser-close). This will ensure the `context` is closed gracefully and any artifacts—like HARs and videos—are fully flushed and saved.
:::

**Usage**

```js
(async () => {
  const browser = await playwright.firefox.launch();  // Or 'chromium' or 'webkit'.
  // Create a new incognito browser context.
  const context = await browser.newContext();
  // Create a new page in a pristine context.
  const page = await context.newPage();
  await page.goto('https://example.com');

  // Gracefully close up everything
  await context.close();
  await browser.close();
})();
```

**Arguments**

- <a id="browser-new-context-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-new-context-option-accept-downloads"></a>`acceptDownloads` `boolean` *(optional)*

    Whether to automatically download all the attachments. Defaults to `true` where all the downloads are accepted.
  - <a id="browser-new-context-option-base-url"></a>`baseURL` `string` *(optional)*

    When using [`page.goto()`](/api/class-page#page-goto), [`page.route()`](/api/class-page#page-route), [`page.waitForURL()`](/api/class-page#page-wait-for-url), [`page.waitForRequest()`](/api/class-page#page-wait-for-request), or [`page.waitForResponse()`](/api/class-page#page-wait-for-response) it takes the base URL in consideration by using the [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor for building the corresponding URL. Unset by default. Examples:
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
    [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'light'`.
  - <a id="browser-new-context-option-contrast"></a>`contrast` `null | "no-preference" | "more"` *(optional)*

    Emulates `'prefers-contrast'` media feature, supported values are `'no-preference'`, `'more'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="browser-new-context-option-device-scale-factor"></a>`deviceScaleFactor` `float` *(optional)*

    Specify device scale factor (can be thought of as dpr). Defaults to `1`. Learn more about [emulating devices with device scale factor](../emulation.md#devices).
  - <a id="browser-new-context-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(optional)*

    An object containing additional HTTP headers to be sent with every request. Defaults to none.
  - <a id="browser-new-context-option-forced-colors"></a>`forcedColors` `null | "active" | "none"` *(optional)*

    Emulates `'forced-colors'` media feature, supported values are `'active'`, `'none'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'none'`.
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

      This option only applies to the requests sent from corresponding [APIRequestContext](/api/class-apirequestcontext) and does not affect requests sent from the browser. `'always'` - `Authorization` header with basic authentication credentials will be sent with the each API request. `'unauthorized` - the credentials are only sent when 401 (Unauthorized) response with `WWW-Authenticate` header is received. Defaults to `'unauthorized'`.
  - <a id="browser-new-context-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="browser-new-context-option-is-mobile"></a>`isMobile` `boolean` *(optional)*

    Whether the `meta viewport` tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to `false`. Learn more about [mobile emulation](../emulation.md#ismobile).
  - <a id="browser-new-context-option-java-script-enabled"></a>`javaScriptEnabled` `boolean` *(optional)*

    Whether or not to enable JavaScript in the context. Defaults to `true`. Learn more about [disabling JavaScript](../emulation.md#javascript-enabled).
  - <a id="browser-new-context-option-locale"></a>`locale` `string` *(optional)*

    Specify user locale, for example `en-GB`, `de-DE`, etc. Locale will affect `navigator.language` value, `Accept-Language` request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our [emulation guide](../emulation.md#locale--timezone).
  - <a id="browser-new-context-option-locate-only-visible"></a>`locateOnlyVisible` `boolean` *(optional)*

    Whether locators in this context find only [visible](../actionability.md#visible) elements.
    Defaults to `false`.

    When enabled, Playwright applies two rules:
    1. The element that a locator finds must be visible. Actions, assertions and queries behave as if
       [`locator.visible()`](/api/class-locator#locator-visible) was called at the end of the locator chain.
    1. [`locator.first()`](/api/class-locator#locator-first), [`locator.last()`](/api/class-locator#locator-last) and [`locator.nth()`](/api/class-locator#locator-nth) select among visible
       elements. They behave as if [`locator.visible()`](/api/class-locator#locator-visible) was called immediately before them.

    ```js
    // <div hidden>One</div> <div>Two</div> <div>Three</div>
    await expect(page.locator('div')).toHaveCount(2);
    await expect(page.locator('div').first()).toHaveText('Two');
    await expect(page.locator('div').last()).toHaveText('Three');
    ```

    An explicit visibility filter always has priority. Playwright does not add its own filter in a position
    that already has one. For example, `page.locator('div').filter({ visible: false }).first()` finds the first
    hidden element.

    All other parts of the locator chain are not filtered. In `page.locator('section').getByRole('button')`,
    the button must be visible, but the section can be hidden by the [visibility](../actionability.md#visible) rules,
    for example because it has zero size. The same applies to the inner locators of [`locator.filter()`](/api/class-locator#locator-filter),

    [`locator.and()`](/api/class-locator#locator-and) and [`locator.or()`](/api/class-locator#locator-or): only the second rule applies to them.

    This option does not change the accessibility rules of [`page.getByRole()`](/api/class-page#page-get-by-role)
    or the behavior of selector-based methods such as [`page.$()`](/api/class-page#page-query-selector).
  - <a id="browser-new-context-option-logger"></a>`logger` `Logger` *(optional)*

    Logger sink for Playwright logging.
  - <a id="browser-new-context-option-offline"></a>`offline` `boolean` *(optional)*

    Whether to emulate network being offline. Defaults to `false`. Learn more about [network emulation](../emulation.md#offline).
  - <a id="browser-new-context-option-permissions"></a>`permissions` `Array<string>` *(optional)*

    A list of permissions to grant to all pages in this context. See
    [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions) for more details. Defaults to none.
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
  - <a id="browser-new-context-option-record-har"></a>`recordHar` `Object` *(optional)*

    Enables [HAR](http://www.softwareishard.com/blog/har-12-spec) recording for all pages into `recordHar.path` file. If not
    specified, the HAR is not recorded. Make sure to await [`browserContext.close()`](/api/class-browsercontext#browser-context-close) for the HAR to be
    saved.

    - `omitContent` `boolean` *(optional)*

      Optional setting to control whether to omit request content from the HAR. Defaults to
      `false`. Deprecated, use `content` policy instead.
    - `content` `"omit" | "embed" | "attach"` *(optional)*

      Optional setting to control resource content management. If `omit` is specified, content is not persisted. If `attach` is specified, resources are persisted as separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file as per HAR specification. Defaults to `attach` for `.zip` output files and to `embed` for all other file extensions.
    - `path` `path`

      Path on the filesystem to write the HAR file to. If the file name ends with `.zip`, `content: 'attach'` is used by default.
    - `mode` `"full" | "minimal"` *(optional)*

      When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `full`.
    - `urlFilter` `string | RegExp` *(optional)*

      A glob or regex pattern to filter requests that are stored in the HAR. When a [`baseURL`](/api/class-browser#browser-new-context-option-base-url) via the context options was provided and the passed URL is a path, it gets merged via the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor. Defaults to none.
  - <a id="browser-new-context-option-record-video"></a>`recordVideo` `Object` *(optional)*

    Enables video recording for all pages into `recordVideo.dir` directory. If not specified videos are not recorded. Make
    sure to await [`browserContext.close()`](/api/class-browsercontext#browser-context-close) for videos to be saved.

    - `dir` `path` *(optional)*

      Path to the directory to put videos into. If not specified, the videos will be stored in `artifactsDir` (see [`browserType.launch()`](/api/class-browsertype#browser-type-launch) options).
    - `size` `Object` *(optional)*

      Optional dimensions of the recorded videos. If not specified the size will be equal to `viewport`
      scaled down to fit into 800x800. If `viewport` is not configured explicitly the video size defaults to 800x450.
      Actual picture of each page will be scaled down if necessary to fit the specified size.

      - `width` `int`

        Video frame width.
      - `height` `int`

        Video frame height.
    - `fps` `int` *(optional)*

      Frame rate of the recorded videos in frames per second. Defaults to `25`. Firefox and WebKit currently capture up to 25 frames per second.
    - `showActions` `Object` *(optional)*

      If specified, enables visual annotations on interacted elements during video recording.

      - `duration` `float` *(optional)*

        How long each annotation is displayed in milliseconds. Defaults to `500`.
      - `position` `"top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right"` *(optional)*

        Position of the action title overlay. Defaults to `"top-right"`.
      - `fontSize` `int` *(optional)*

        Font size of the action title in pixels. Defaults to `24`. Deprecated, use `style.title` instead.
      - `cursor` `"none" | "pointer"` *(optional)*

        Cursor decoration shown for pointer actions. `"pointer"` (the default) renders a mouse pointer that animates from the previous action point to the next one. `"none"` disables the cursor decoration.
      - `style` `Object` *(optional)*

        Styles of the action decorations.

        - `point` `string` *(optional)*

          CSS declarations for the zero-sized marker centered on the action point. Not shown when omitted.
        - `highlight` `string` *(optional)*

          CSS declarations for the box that covers the target element. Not shown when omitted.
        - `title` `string` *(optional)*

          CSS declarations for the action title.
  - <a id="browser-new-context-option-reduced-motion"></a>`reducedMotion` `null | "reduce" | "no-preference"` *(optional)*

    Emulates `'prefers-reduced-motion'` media feature, supported values are `'reduce'`, `'no-preference'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="browser-new-context-option-screen"></a>`screen` `Object` *(optional)*

    Emulates consistent window screen size available inside web page via `window.screen`. Is only used when the
    [`viewport`](/api/class-browser#browser-new-context-option-viewport) is set.

    - `width` `int`

      page width in pixels.
    - `height` `int`

      page height in pixels.
  - <a id="browser-new-context-option-service-workers"></a>`serviceWorkers` `"allow" | "block"` *(optional)*

    Whether to allow sites to register Service workers. Defaults to `'allow'`.
    * `'allow'`: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) can be registered.
    * `'block'`: Playwright will block all registration of Service Workers.
  - <a id="browser-new-context-option-storage-state"></a>`storageState` `path | Object` *(optional)*

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
  - <a id="browser-new-context-option-strict-selectors"></a>`strictSelectors` `boolean` *(optional)*

    If set to true, enables strict selectors mode for this context. In the strict selectors mode all operations
    on selectors that imply single target DOM element will throw when more than one element matches the selector.
    This option does not affect any Locator APIs (Locators are always strict). Defaults to `false`.
    See [Locator](/api/class-locator) to learn more about the strict mode.
  - <a id="browser-new-context-option-timezone-id"></a>`timezoneId` `string` *(optional)*

    Changes the timezone of the context. See [ICU's metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)
    for a list of supported timezone IDs. Defaults to the system timezone.
  - <a id="browser-new-context-option-user-agent"></a>`userAgent` `string` *(optional)*

    Specific user agent to use in this context.
  - <a id="browser-new-context-option-viewport"></a>`viewport` `null | Object` *(optional)*

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

- `Promise<BrowserContext>`


### browser.newPage() {#browser-new-page}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Creates a new page in a new browser context. Closing this page will close the context as well.

This is a convenience API that should only be used for the single-page scenarios and short snippets. Production code and
testing frameworks should explicitly create [`browser.newContext()`](/api/class-browser#browser-new-context) followed by the
[`browserContext.newPage()`](/api/class-browsercontext#browser-context-new-page) to control their exact life times.

**Arguments**

- <a id="browser-new-page-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-new-page-option-accept-downloads"></a>`acceptDownloads` `boolean` *(optional)*

    Whether to automatically download all the attachments. Defaults to `true` where all the downloads are accepted.
  - <a id="browser-new-page-option-base-url"></a>`baseURL` `string` *(optional)*

    When using [`page.goto()`](/api/class-page#page-goto), [`page.route()`](/api/class-page#page-route), [`page.waitForURL()`](/api/class-page#page-wait-for-url), [`page.waitForRequest()`](/api/class-page#page-wait-for-request), or [`page.waitForResponse()`](/api/class-page#page-wait-for-response) it takes the base URL in consideration by using the [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor for building the corresponding URL. Unset by default. Examples:
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
    [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'light'`.
  - <a id="browser-new-page-option-contrast"></a>`contrast` `null | "no-preference" | "more"` *(optional)*

    Emulates `'prefers-contrast'` media feature, supported values are `'no-preference'`, `'more'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="browser-new-page-option-device-scale-factor"></a>`deviceScaleFactor` `float` *(optional)*

    Specify device scale factor (can be thought of as dpr). Defaults to `1`. Learn more about [emulating devices with device scale factor](../emulation.md#devices).
  - <a id="browser-new-page-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(optional)*

    An object containing additional HTTP headers to be sent with every request. Defaults to none.
  - <a id="browser-new-page-option-forced-colors"></a>`forcedColors` `null | "active" | "none"` *(optional)*

    Emulates `'forced-colors'` media feature, supported values are `'active'`, `'none'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'none'`.
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

      This option only applies to the requests sent from corresponding [APIRequestContext](/api/class-apirequestcontext) and does not affect requests sent from the browser. `'always'` - `Authorization` header with basic authentication credentials will be sent with the each API request. `'unauthorized` - the credentials are only sent when 401 (Unauthorized) response with `WWW-Authenticate` header is received. Defaults to `'unauthorized'`.
  - <a id="browser-new-page-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="browser-new-page-option-is-mobile"></a>`isMobile` `boolean` *(optional)*

    Whether the `meta viewport` tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to `false`. Learn more about [mobile emulation](../emulation.md#ismobile).
  - <a id="browser-new-page-option-java-script-enabled"></a>`javaScriptEnabled` `boolean` *(optional)*

    Whether or not to enable JavaScript in the context. Defaults to `true`. Learn more about [disabling JavaScript](../emulation.md#javascript-enabled).
  - <a id="browser-new-page-option-locale"></a>`locale` `string` *(optional)*

    Specify user locale, for example `en-GB`, `de-DE`, etc. Locale will affect `navigator.language` value, `Accept-Language` request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our [emulation guide](../emulation.md#locale--timezone).
  - <a id="browser-new-page-option-locate-only-visible"></a>`locateOnlyVisible` `boolean` *(optional)*

    Whether locators in this context find only [visible](../actionability.md#visible) elements.
    Defaults to `false`.

    When enabled, Playwright applies two rules:
    1. The element that a locator finds must be visible. Actions, assertions and queries behave as if
       [`locator.visible()`](/api/class-locator#locator-visible) was called at the end of the locator chain.
    1. [`locator.first()`](/api/class-locator#locator-first), [`locator.last()`](/api/class-locator#locator-last) and [`locator.nth()`](/api/class-locator#locator-nth) select among visible
       elements. They behave as if [`locator.visible()`](/api/class-locator#locator-visible) was called immediately before them.

    ```js
    // <div hidden>One</div> <div>Two</div> <div>Three</div>
    await expect(page.locator('div')).toHaveCount(2);
    await expect(page.locator('div').first()).toHaveText('Two');
    await expect(page.locator('div').last()).toHaveText('Three');
    ```

    An explicit visibility filter always has priority. Playwright does not add its own filter in a position
    that already has one. For example, `page.locator('div').filter({ visible: false }).first()` finds the first
    hidden element.

    All other parts of the locator chain are not filtered. In `page.locator('section').getByRole('button')`,
    the button must be visible, but the section can be hidden by the [visibility](../actionability.md#visible) rules,
    for example because it has zero size. The same applies to the inner locators of [`locator.filter()`](/api/class-locator#locator-filter),

    [`locator.and()`](/api/class-locator#locator-and) and [`locator.or()`](/api/class-locator#locator-or): only the second rule applies to them.

    This option does not change the accessibility rules of [`page.getByRole()`](/api/class-page#page-get-by-role)
    or the behavior of selector-based methods such as [`page.$()`](/api/class-page#page-query-selector).
  - <a id="browser-new-page-option-logger"></a>`logger` `Logger` *(optional)*

    Logger sink for Playwright logging.
  - <a id="browser-new-page-option-offline"></a>`offline` `boolean` *(optional)*

    Whether to emulate network being offline. Defaults to `false`. Learn more about [network emulation](../emulation.md#offline).
  - <a id="browser-new-page-option-permissions"></a>`permissions` `Array<string>` *(optional)*

    A list of permissions to grant to all pages in this context. See
    [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions) for more details. Defaults to none.
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
  - <a id="browser-new-page-option-record-har"></a>`recordHar` `Object` *(optional)*

    Enables [HAR](http://www.softwareishard.com/blog/har-12-spec) recording for all pages into `recordHar.path` file. If not
    specified, the HAR is not recorded. Make sure to await [`browserContext.close()`](/api/class-browsercontext#browser-context-close) for the HAR to be
    saved.

    - `omitContent` `boolean` *(optional)*

      Optional setting to control whether to omit request content from the HAR. Defaults to
      `false`. Deprecated, use `content` policy instead.
    - `content` `"omit" | "embed" | "attach"` *(optional)*

      Optional setting to control resource content management. If `omit` is specified, content is not persisted. If `attach` is specified, resources are persisted as separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file as per HAR specification. Defaults to `attach` for `.zip` output files and to `embed` for all other file extensions.
    - `path` `path`

      Path on the filesystem to write the HAR file to. If the file name ends with `.zip`, `content: 'attach'` is used by default.
    - `mode` `"full" | "minimal"` *(optional)*

      When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `full`.
    - `urlFilter` `string | RegExp` *(optional)*

      A glob or regex pattern to filter requests that are stored in the HAR. When a [`baseURL`](/api/class-browser#browser-new-context-option-base-url) via the context options was provided and the passed URL is a path, it gets merged via the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor. Defaults to none.
  - <a id="browser-new-page-option-record-video"></a>`recordVideo` `Object` *(optional)*

    Enables video recording for all pages into `recordVideo.dir` directory. If not specified videos are not recorded. Make
    sure to await [`browserContext.close()`](/api/class-browsercontext#browser-context-close) for videos to be saved.

    - `dir` `path` *(optional)*

      Path to the directory to put videos into. If not specified, the videos will be stored in `artifactsDir` (see [`browserType.launch()`](/api/class-browsertype#browser-type-launch) options).
    - `size` `Object` *(optional)*

      Optional dimensions of the recorded videos. If not specified the size will be equal to `viewport`
      scaled down to fit into 800x800. If `viewport` is not configured explicitly the video size defaults to 800x450.
      Actual picture of each page will be scaled down if necessary to fit the specified size.

      - `width` `int`

        Video frame width.
      - `height` `int`

        Video frame height.
    - `fps` `int` *(optional)*

      Frame rate of the recorded videos in frames per second. Defaults to `25`. Firefox and WebKit currently capture up to 25 frames per second.
    - `showActions` `Object` *(optional)*

      If specified, enables visual annotations on interacted elements during video recording.

      - `duration` `float` *(optional)*

        How long each annotation is displayed in milliseconds. Defaults to `500`.
      - `position` `"top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right"` *(optional)*

        Position of the action title overlay. Defaults to `"top-right"`.
      - `fontSize` `int` *(optional)*

        Font size of the action title in pixels. Defaults to `24`. Deprecated, use `style.title` instead.
      - `cursor` `"none" | "pointer"` *(optional)*

        Cursor decoration shown for pointer actions. `"pointer"` (the default) renders a mouse pointer that animates from the previous action point to the next one. `"none"` disables the cursor decoration.
      - `style` `Object` *(optional)*

        Styles of the action decorations.

        - `point` `string` *(optional)*

          CSS declarations for the zero-sized marker centered on the action point. Not shown when omitted.
        - `highlight` `string` *(optional)*

          CSS declarations for the box that covers the target element. Not shown when omitted.
        - `title` `string` *(optional)*

          CSS declarations for the action title.
  - <a id="browser-new-page-option-reduced-motion"></a>`reducedMotion` `null | "reduce" | "no-preference"` *(optional)*

    Emulates `'prefers-reduced-motion'` media feature, supported values are `'reduce'`, `'no-preference'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="browser-new-page-option-screen"></a>`screen` `Object` *(optional)*

    Emulates consistent window screen size available inside web page via `window.screen`. Is only used when the
    [`viewport`](/api/class-browser#browser-new-page-option-viewport) is set.

    - `width` `int`

      page width in pixels.
    - `height` `int`

      page height in pixels.
  - <a id="browser-new-page-option-service-workers"></a>`serviceWorkers` `"allow" | "block"` *(optional)*

    Whether to allow sites to register Service workers. Defaults to `'allow'`.
    * `'allow'`: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) can be registered.
    * `'block'`: Playwright will block all registration of Service Workers.
  - <a id="browser-new-page-option-storage-state"></a>`storageState` `path | Object` *(optional)*

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
  - <a id="browser-new-page-option-strict-selectors"></a>`strictSelectors` `boolean` *(optional)*

    If set to true, enables strict selectors mode for this context. In the strict selectors mode all operations
    on selectors that imply single target DOM element will throw when more than one element matches the selector.
    This option does not affect any Locator APIs (Locators are always strict). Defaults to `false`.
    See [Locator](/api/class-locator) to learn more about the strict mode.
  - <a id="browser-new-page-option-timezone-id"></a>`timezoneId` `string` *(optional)*

    Changes the timezone of the context. See [ICU's metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)
    for a list of supported timezone IDs. Defaults to the system timezone.
  - <a id="browser-new-page-option-user-agent"></a>`userAgent` `string` *(optional)*

    Specific user agent to use in this context.
  - <a id="browser-new-page-option-viewport"></a>`viewport` `null | Object` *(optional)*

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

- `Promise<Page>`


### browser.removeAllListeners() {#browser-remove-all-listeners}

<Badge type="info" text="Added in: v1.47" /> <Badge type="tip" text="async" />

Removes all the listeners of the given type (or all registered listeners if no type given).
Allows to wait for async listeners to complete or to ignore subsequent errors from these listeners.

**Arguments**

- <a id="browser-remove-all-listeners-option-type"></a>`type` `string` *(optional)*
- <a id="browser-remove-all-listeners-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-remove-all-listeners-option-behavior"></a>`behavior` `"wait" | "ignoreErrors" | "default"` *(optional)*

    Specifies whether to wait for already running listeners and what to do if they throw errors:
    * `'default'` - do not wait for current listener calls (if any) to finish, if the listener throws, it may result in unhandled error
    * `'wait'` - wait for current listener calls (if any) to finish
    * `'ignoreErrors'` - do not wait for current listener calls (if any) to finish, all errors thrown by the listeners after removal are silently caught


### browser.startTracing() {#browser-start-tracing}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

::: info
This API controls [Chromium Tracing](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) which is a low-level chromium-specific debugging tool. API to control [Playwright Tracing](../trace-viewer) could be found [here](./class-tracing).
:::

You can use [`browser.startTracing()`](/api/class-browser#browser-start-tracing) and [`browser.stopTracing()`](/api/class-browser#browser-stop-tracing) to create a trace file that can
be opened in Chrome DevTools performance panel.

**Usage**

```js
await browser.startTracing(page, { path: 'trace.json' });
await page.goto('https://www.google.com');
await browser.stopTracing();
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

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

::: info
This API controls [Chromium Tracing](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) which is a low-level chromium-specific debugging tool. API to control [Playwright Tracing](../trace-viewer) could be found [here](./class-tracing).
:::

Returns the buffer with trace data.

**Returns**

- `Promise<Buffer>`


### browser.unbind() {#browser-unbind}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

Unbinds the browser server previously bound with [`browser.bind()`](/api/class-browser#browser-bind).


### browser.version() {#browser-version}

<Badge type="info" text="Added in: v1.8" />

Returns the browser version.

**Returns**

- `string`


## Events

### browser.on('context') {#browser-event-context}

<Badge type="info" text="Added in: v1.60" />

Emitted when a new browser context is created.

**Event data**

- `BrowserContext`


### browser.on('disconnected') {#browser-event-disconnected}

<Badge type="info" text="Added in: v1.8" />

Emitted when Browser gets disconnected from the browser application. This might happen because of one of the following:
* Browser application is closed or crashed.
* The [`browser.close()`](/api/class-browser#browser-close) method was called.

**Event data**

- `Browser`

