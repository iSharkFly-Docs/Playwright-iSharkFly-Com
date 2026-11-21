---
title: BrowserType
outline: 2
---

# BrowserType

<Badge type="info" text="Added in: v1.8" />

BrowserType provides methods to launch a specific browser instance or connect to an existing one. The following is a
typical example of using Playwright to drive automation:

```js
const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  // other actions...
  await browser.close();
})();
```

## Methods

### browserType.connect() {#browser-type-connect}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

This method attaches Playwright to an existing browser instance created via `BrowserType.launchServer` in Node.js.

::: info
The major and minor version of the Playwright instance that connects needs to match the version of Playwright that launches the browser (1.2.3 → is compatible with 1.2.x).
:::

**Arguments**

- <a id="browser-type-connect-option-endpoint"></a>`endpoint` `string` <Badge type="info" text="Added in: v1.10" />

  A Playwright browser websocket endpoint to connect to. You obtain this endpoint via `BrowserServer.wsEndpoint`.
- <a id="browser-type-connect-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-connect-option-expose-network"></a>`exposeNetwork` `string` *(optional)* <Badge type="info" text="Added in: v1.37" />

    This option exposes network available on the connecting client to the browser being connected to. Consists of a list of rules separated by comma.

    Available rules:
    1. Hostname pattern, for example: `example.com`, `*.org:99`, `x.*.y.com`, `*foo.org`.
    1. IP literal, for example: `127.0.0.1`, `0.0.0.0:99`, `[::1]`, `[0:0::1]:99`.
    1. `<loopback>` that matches local loopback interfaces: `localhost`, `*.localhost`, `127.0.0.1`, `[::1]`.

    Some common examples:
    1. `"*"` to expose all network.
    1. `"<loopback>"` to expose localhost network.
    1. `"*.test.internal-domain,*.staging.internal-domain,<loopback>"` to expose test/staging deployments and localhost.
  - <a id="browser-type-connect-option-headers"></a>`headers` `Object<string, string>` *(optional)* <Badge type="info" text="Added in: v1.11" />

    Additional HTTP headers to be sent with web socket connect request. Optional.
  - <a id="browser-type-connect-option-launch-options"></a>`launchOptions` `LaunchOptions` *(optional)* <Badge type="info" text="Added in: v1.66" />

    Options used to launch the browser, as passed to [`browserType.launch()`](/api/class-browsertype#browser-type-launch). Only applies when the server
    launches a browser for each connection. The server ignores the options that it does not allow.
  - <a id="browser-type-connect-option-slow-mo"></a>`slowMo` `float` *(optional)* <Badge type="info" text="Added in: v1.10" />

    Slows down Playwright operations by the specified amount of milliseconds. Useful so that you
    can see what is going on. Defaults to 0.
  - <a id="browser-type-connect-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.10" />

    Maximum time in milliseconds to wait for the connection to be established. Defaults to
    `0` (no timeout).

**Returns**

- `Promise<Browser>`


### browserType.connectOverCDP() {#browser-type-connect-over-cdp}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

This method attaches Playwright to an existing browser instance using the Chrome DevTools Protocol.

The default browser context is accessible via [`browser.contexts()`](/api/class-browser#browser-contexts).

::: info
Connecting over the Chrome DevTools Protocol is only supported for Chromium-based browsers.
:::

::: info
This connection is significantly lower fidelity than the Playwright protocol connection via [`browserType.connect()`](/api/class-browsertype#browser-type-connect). If you are experiencing issues or attempting to use advanced functionality, you probably want to use [`browserType.connect()`](/api/class-browsertype#browser-type-connect).
:::

::: warning
Playwright maintains a curated list of arguments for launching the browser. If you launch the browser without Playwright and do not pass the exact same arguments, some of Playwright functionality may be broken upon connecting to the browser.
:::

**Usage**

```js
const browser = await playwright.chromium.connectOverCDP('http://localhost:9222');
const defaultContext = browser.contexts()[0];
const page = defaultContext.pages()[0];
```

**Arguments**

- <a id="browser-type-connect-over-cdp-option-endpoint-url"></a>`endpointURL` `string` <Badge type="info" text="Added in: v1.11" />

  A CDP websocket endpoint or http url to connect to. For example `http://localhost:9222/` or `ws://127.0.0.1:9222/devtools/browser/387adf4c-243f-4051-a181-46798f4a46f4`.

  Alternatively, a URL that tells which running browser to connect to:
  * `remote-debugging://<channel>` - a browser with remote debugging enabled, for example `remote-debugging://msedge`. The optional `userDataDir` parameter is the user data directory of the browser, when it is not the default one: `remote-debugging://chrome?userDataDir=/path/to/data`. A bare channel name such as `chrome` is the same as `remote-debugging://chrome`.
  * `extension://<channel>/<profile directory>` - the tabs of a browser profile, through the [Playwright Extension](https://chromewebstore.google.com/detail/playwright-extension/mmlmfjhmonkocbjadbfplnigmagldckm), for example `extension://chrome/Profile 1`. Playwright opens the connect page of the extension in that profile, and the user selects the tabs to share. Without the profile directory, Playwright uses the `Default` profile. The optional parameters are `userDataDir`, the user data directory of the browser when it is not the default one, and `executablePath`, the path to the browser executable when it is not at the standard location: `extension://chromium?executablePath=/path/to/chrome&userDataDir=/path/to/data`. Pass the other options of this connection in [`headers`](/api/class-browsertype#browser-type-connect-over-cdp-option-headers).

  The values of `userDataDir` and `executablePath` must be URL-encoded, for example with `encodeURIComponent` or `URLSearchParams`. The channel is a browser channel name such as `chrome`, `chrome-beta` or `msedge`. The default user data directory of the channel is where the browser keeps its data. On Linux, Playwright uses `CHROME_USER_DATA_DIR` when set. Otherwise, it uses `CHROME_CONFIG_HOME`, then `XDG_CONFIG_HOME`, then `~/.config` to locate that directory.
- <a id="browser-type-connect-over-cdp-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-connect-over-cdp-option-artifacts-dir"></a>`artifactsDir` `path` *(optional)* <Badge type="info" text="Added in: v1.61" />

    If specified, browser artifacts (such as traces and downloads) are saved into this directory.
  - <a id="browser-type-connect-over-cdp-option-endpoint-url"></a>`endpointURL` `string` *(optional)* <Badge type="info" text="Added in: v1.14" />
  - <a id="browser-type-connect-over-cdp-option-headers"></a>`headers` `Object<string, string>` *(optional)* <Badge type="info" text="Added in: v1.11" />

    Additional HTTP headers to be sent with connect request. Optional.

    When [`endpointURL`](/api/class-browsertype#browser-type-connect-over-cdp-option-endpoint-url) is an extension URL such as `extension://chrome`, the headers are not sent. They are the options of the connection:
    * `x-playwright-extension-token` - the token of the extension. With the token, the user does not have to approve the connection. Without the token, the user must approve the connection before [`timeout`](/api/class-browsertype#browser-type-connect-over-cdp-option-timeout) expires, so set it to a value that gives the user enough time.
    * `x-playwright-extension-client-name` - the name of the client that the extension shows to the user.
    * `x-playwright-extension-tab-group` - pass `false` to keep the tabs out of a tab group.
    * `x-playwright-extension-tab-group-title` - the title of the tab group.
    * `x-playwright-extension-tab-group-color` - the color of the tab group: `green`, `blue`, `purple`, `orange`, `pink`, `cyan`, `yellow` or `red`.
    * `x-playwright-extension-background` - pass `true` to keep the tabs from becoming active.
  - <a id="browser-type-connect-over-cdp-option-is-local"></a>`isLocal` `boolean` *(optional)* <Badge type="info" text="Added in: v1.58" />

    Tells Playwright that it runs on the same host as the CDP server. It will enable certain optimizations that rely upon
    the file system being the same between Playwright and the Browser.
  - <a id="browser-type-connect-over-cdp-option-no-defaults"></a>`noDefaults` `boolean` *(optional)* <Badge type="info" text="Added in: v1.60" />

    When true, Playwright will not apply its default overrides to the existing default browser context.
    Specifically, [`acceptDownloads`](/api/class-browser#browser-new-context-option-accept-downloads) and font families are left at the browser's
    settings, focus emulation is not enabled, and media emulation options (such as [`colorScheme`](/api/class-browser#browser-new-context-option-color-scheme),
    [`reducedMotion`](/api/class-browser#browser-new-context-option-reduced-motion), [`forcedColors`](/api/class-browser#browser-new-context-option-forced-colors), and
    [`contrast`](/api/class-browser#browser-new-context-option-contrast)) are not applied. Useful when attaching to a user's daily-driver
    browser where these overrides would interfere with existing browser state. New contexts created via
    [`browser.newContext()`](/api/class-browser#browser-new-context) are not affected. Defaults to `false`.
  - <a id="browser-type-connect-over-cdp-option-slow-mo"></a>`slowMo` `float` *(optional)* <Badge type="info" text="Added in: v1.11" />

    Slows down Playwright operations by the specified amount of milliseconds. Useful so that you
    can see what is going on. Defaults to 0.
  - <a id="browser-type-connect-over-cdp-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.11" />

    Maximum time in milliseconds to wait for the connection to be established. Defaults to
    `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `Promise<Browser>`


### browserType.executablePath() {#browser-type-executable-path}

<Badge type="info" text="Added in: v1.8" />

A path where Playwright expects to find a bundled browser executable.

**Returns**

- `string`


### browserType.launch() {#browser-type-launch}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the browser instance.

**Usage**

You can use [`ignoreDefaultArgs`](/api/class-browsertype#browser-type-launch-option-ignore-default-args) to filter out `--mute-audio` from default arguments:

```js
const browser = await chromium.launch({  // Or 'firefox' or 'webkit'.
  ignoreDefaultArgs: ['--mute-audio']
});
```

> **Chromium-only** Playwright can also be used to control the Google Chrome or Microsoft Edge browsers, but it works best with the version of
Chromium it is bundled with. There is no guarantee it will work with any other version. Use [`executablePath`](/api/class-browsertype#browser-type-launch-option-executable-path)
option with extreme caution.
>
> If Google Chrome (rather than Chromium) is preferred, a
[Chrome Canary](https://www.google.com/chrome/browser/canary.html) or
[Dev Channel](https://www.chromium.org/getting-involved/dev-channel) build is suggested.
>
> Stock browsers like Google Chrome and Microsoft Edge are suitable for tests that require proprietary media codecs for video playback. See [this article](https://www.howtogeek.com/202825/what%E2%80%99s-the-difference-between-chromium-and-chrome/) for other differences between Chromium and Chrome.
[This article](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/chromium_browser_vs_google_chrome.md)
describes some differences for Linux users.

**Arguments**

- <a id="browser-type-launch-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-launch-option-args"></a>`args` `Array<string>` *(optional)*

    ::: warning
    Use custom browser args at your own risk, as some of them may break Playwright functionality.
    :::

    Additional arguments to pass to the browser instance. The list of Chromium flags can be found
    [here](https://peter.sh/experiments/chromium-command-line-switches/).
  - <a id="browser-type-launch-option-artifacts-dir"></a>`artifactsDir` `path` *(optional)*

    If specified, artifacts (traces, videos, downloads, HAR files, etc.) are saved into this directory. The directory is not cleaned up when the browser closes. If not specified, a temporary directory is used and cleaned up when the browser closes.
  - <a id="browser-type-launch-option-channel"></a>`channel` `string` *(optional)*

    Browser distribution channel.

    Use "chromium" to [opt in to new headless mode](../browsers.md#chromium-new-headless-mode).

    Use "chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge", "msedge-beta", "msedge-dev", or "msedge-canary" to use branded [Google Chrome and Microsoft Edge](../browsers.md#google-chrome--microsoft-edge).
  - <a id="browser-type-launch-option-chromium-sandbox"></a>`chromiumSandbox` `boolean` *(optional)*

    Enable Chromium sandboxing. Defaults to `false`.
  - <a id="browser-type-launch-option-downloads-path"></a>`downloadsPath` `path` *(optional)*

    If specified, accepted downloads are downloaded into this directory. Otherwise, temporary directory is created and is
    deleted when browser is closed. In either case, the downloads are deleted when the browser context they were created in
    is closed.
  - <a id="browser-type-launch-option-env"></a>`env` `Object<string, string | undefined>` *(optional)*
  - <a id="browser-type-launch-option-executable-path"></a>`executablePath` `path` *(optional)*

    Path to a browser executable to run instead of the bundled one. If [`executablePath`](/api/class-browsertype#browser-type-launch-option-executable-path) is a relative path, then
    it is resolved relative to the current working directory. Note that Playwright only works with the bundled Chromium,
    Firefox or WebKit, use at your own risk.
  - <a id="browser-type-launch-option-firefox-user-prefs"></a>`firefoxUserPrefs` `Object<string, string | float | boolean>` *(optional)*

    Firefox user preferences. Learn more about the Firefox user preferences at
    [`about:config`](https://support.mozilla.org/en-US/kb/about-config-editor-firefox).

    You can also provide a path to a custom [`policies.json` file](https://mozilla.github.io/policy-templates/) via `PLAYWRIGHT_FIREFOX_POLICIES_JSON` environment variable.
  - <a id="browser-type-launch-option-handle-sighup"></a>`handleSIGHUP` `boolean` *(optional)*

    Close the browser process on SIGHUP. Defaults to `true`.
  - <a id="browser-type-launch-option-handle-sigint"></a>`handleSIGINT` `boolean` *(optional)*

    Close the browser process on Ctrl-C. Defaults to `true`.
  - <a id="browser-type-launch-option-handle-sigterm"></a>`handleSIGTERM` `boolean` *(optional)*

    Close the browser process on SIGTERM. Defaults to `true`.
  - <a id="browser-type-launch-option-headless"></a>`headless` `boolean` *(optional)*

    Whether to run browser in headless mode. More details for
    [Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) and
    [Firefox](https://hacks.mozilla.org/2017/12/using-headless-mode-in-firefox/). Defaults to `true`.
  - <a id="browser-type-launch-option-ignore-default-args"></a>`ignoreDefaultArgs` `boolean | Array<string>` *(optional)*

    If `true`, Playwright does not pass its own configurations args and only uses the ones from [`args`](/api/class-browsertype#browser-type-launch-option-args). If an
    array is given, then filters out the given default arguments. Dangerous option; use with care. Defaults to `false`.
  - <a id="browser-type-launch-option-logger"></a>`logger` `Logger` *(optional)*

    Logger sink for Playwright logging.
  - <a id="browser-type-launch-option-proxy"></a>`proxy` `Object` *(optional)*

    Network proxy settings.

    - `server` `string`

      Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example
      `http://myproxy.com:3128` or `socks5://myproxy.com:3128`. Short form `myproxy.com:3128` is considered an HTTP
      proxy.
    - `bypass` `string` *(optional)*

      Optional comma-separated domains to bypass proxy, for example `".com, chromium.org,
      .domain.com"`.
    - `username` `string` *(optional)*

      Optional username to use if HTTP proxy requires authentication.
    - `password` `string` *(optional)*

      Optional password to use if HTTP proxy requires authentication.
  - <a id="browser-type-launch-option-slow-mo"></a>`slowMo` `float` *(optional)*

    Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on.
  - <a id="browser-type-launch-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds to wait for the browser instance to start. Defaults to `180000` (3 minutes). Pass `0` to
    disable timeout.
  - <a id="browser-type-launch-option-traces-dir"></a>`tracesDir` `path` *(optional)*

    If specified, traces are saved into this directory.

**Returns**

- `Promise<Browser>`


### browserType.launchPersistentContext() {#browser-type-launch-persistent-context}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the persistent browser context instance.

Launches browser that uses persistent storage located at [`userDataDir`](/api/class-browsertype#browser-type-launch-persistent-context-option-user-data-dir) and returns the only context. Closing
this context will automatically close the browser.

**Arguments**

- <a id="browser-type-launch-persistent-context-option-user-data-dir"></a>`userDataDir` `path`

  Path to a User Data Directory, which stores browser session data like cookies and local storage. Pass an empty string to create a temporary directory.

  More details for
  [Chromium](https://chromium.googlesource.com/chromium/src/+/master/docs/user_data_dir.md#introduction) and
  [Firefox](https://wiki.mozilla.org/Firefox/CommandLineOptions#User_profile). Chromium's user data directory is the **parent** directory of the "Profile Path" seen at `chrome://version`.

  Note that browsers do not allow launching multiple instances with the same User Data Directory.

  ::: warning
  Chromium/Chrome: Due to recent Chrome policy changes, automating the default Chrome user profile is not supported. Pointing `userDataDir` to Chrome's main "User Data" directory (the profile used for your regular browsing) may result in pages not loading or the browser exiting. Create and use a separate directory (for example, an empty folder) as your automation profile instead. See https://developer.chrome.com/blog/remote-debugging-port for details.
  :::
- <a id="browser-type-launch-persistent-context-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-launch-persistent-context-option-accept-downloads"></a>`acceptDownloads` `boolean` *(optional)*

    Whether to automatically download all the attachments. Defaults to `true` where all the downloads are accepted.
  - <a id="browser-type-launch-persistent-context-option-args"></a>`args` `Array<string>` *(optional)*

    ::: warning
    Use custom browser args at your own risk, as some of them may break Playwright functionality.
    :::

    Additional arguments to pass to the browser instance. The list of Chromium flags can be found
    [here](https://peter.sh/experiments/chromium-command-line-switches/).
  - <a id="browser-type-launch-persistent-context-option-artifacts-dir"></a>`artifactsDir` `path` *(optional)*

    If specified, artifacts (traces, videos, downloads, HAR files, etc.) are saved into this directory. The directory is not cleaned up when the browser closes. If not specified, a temporary directory is used and cleaned up when the browser closes.
  - <a id="browser-type-launch-persistent-context-option-base-url"></a>`baseURL` `string` *(optional)*

    When using [`page.goto()`](/api/class-page#page-goto), [`page.route()`](/api/class-page#page-route), [`page.waitForURL()`](/api/class-page#page-wait-for-url), [`page.waitForRequest()`](/api/class-page#page-wait-for-request), or [`page.waitForResponse()`](/api/class-page#page-wait-for-response) it takes the base URL in consideration by using the [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor for building the corresponding URL. Unset by default. Examples:
    * baseURL: `http://localhost:3000` and navigating to `/bar.html` results in `http://localhost:3000/bar.html`
    * baseURL: `http://localhost:3000/foo/` and navigating to `./bar.html` results in `http://localhost:3000/foo/bar.html`
    * baseURL: `http://localhost:3000/foo` (without trailing slash) and navigating to `./bar.html` results in `http://localhost:3000/bar.html`
  - <a id="browser-type-launch-persistent-context-option-bypass-csp"></a>`bypassCSP` `boolean` *(optional)*

    Toggles bypassing page's Content-Security-Policy. Defaults to `false`.
  - <a id="browser-type-launch-persistent-context-option-channel"></a>`channel` `string` *(optional)*

    Browser distribution channel.

    Use "chromium" to [opt in to new headless mode](../browsers.md#chromium-new-headless-mode).

    Use "chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge", "msedge-beta", "msedge-dev", or "msedge-canary" to use branded [Google Chrome and Microsoft Edge](../browsers.md#google-chrome--microsoft-edge).
  - <a id="browser-type-launch-persistent-context-option-chromium-sandbox"></a>`chromiumSandbox` `boolean` *(optional)*

    Enable Chromium sandboxing. Defaults to `false`.
  - <a id="browser-type-launch-persistent-context-option-client-certificates"></a>`clientCertificates` `Array<Object>` *(optional)* <Badge type="info" text="Added in: v1.46" />

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
  - <a id="browser-type-launch-persistent-context-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(optional)*

    Emulates [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media feature, supported values are `'light'` and `'dark'`. See
    [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'light'`.
  - <a id="browser-type-launch-persistent-context-option-contrast"></a>`contrast` `null | "no-preference" | "more"` *(optional)*

    Emulates `'prefers-contrast'` media feature, supported values are `'no-preference'`, `'more'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="browser-type-launch-persistent-context-option-device-scale-factor"></a>`deviceScaleFactor` `float` *(optional)*

    Specify device scale factor (can be thought of as dpr). Defaults to `1`. Learn more about [emulating devices with device scale factor](../emulation.md#devices).
  - <a id="browser-type-launch-persistent-context-option-downloads-path"></a>`downloadsPath` `path` *(optional)*

    If specified, accepted downloads are downloaded into this directory. Otherwise, temporary directory is created and is
    deleted when browser is closed. In either case, the downloads are deleted when the browser context they were created in
    is closed.
  - <a id="browser-type-launch-persistent-context-option-env"></a>`env` `Object<string, string | undefined>` *(optional)*
  - <a id="browser-type-launch-persistent-context-option-executable-path"></a>`executablePath` `path` *(optional)*

    Path to a browser executable to run instead of the bundled one. If [`executablePath`](/api/class-browsertype#browser-type-launch-persistent-context-option-executable-path) is a relative path, then
    it is resolved relative to the current working directory. Note that Playwright only works with the bundled Chromium,
    Firefox or WebKit, use at your own risk.
  - <a id="browser-type-launch-persistent-context-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(optional)*

    An object containing additional HTTP headers to be sent with every request. Defaults to none.
  - <a id="browser-type-launch-persistent-context-option-firefox-user-prefs"></a>`firefoxUserPrefs` `Object<string, string | float | boolean>` *(optional)* <Badge type="info" text="Added in: v1.40" />

    Firefox user preferences. Learn more about the Firefox user preferences at
    [`about:config`](https://support.mozilla.org/en-US/kb/about-config-editor-firefox).

    You can also provide a path to a custom [`policies.json` file](https://mozilla.github.io/policy-templates/) via `PLAYWRIGHT_FIREFOX_POLICIES_JSON` environment variable.
  - <a id="browser-type-launch-persistent-context-option-forced-colors"></a>`forcedColors` `null | "active" | "none"` *(optional)*

    Emulates `'forced-colors'` media feature, supported values are `'active'`, `'none'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'none'`.
  - <a id="browser-type-launch-persistent-context-option-geolocation"></a>`geolocation` `Object` *(optional)*

    - `latitude` `float`

      Latitude between -90 and 90.
    - `longitude` `float`

      Longitude between -180 and 180.
    - `accuracy` `float` *(optional)*

      Non-negative accuracy value. Defaults to `0`.
  - <a id="browser-type-launch-persistent-context-option-handle-sighup"></a>`handleSIGHUP` `boolean` *(optional)*

    Close the browser process on SIGHUP. Defaults to `true`.
  - <a id="browser-type-launch-persistent-context-option-handle-sigint"></a>`handleSIGINT` `boolean` *(optional)*

    Close the browser process on Ctrl-C. Defaults to `true`.
  - <a id="browser-type-launch-persistent-context-option-handle-sigterm"></a>`handleSIGTERM` `boolean` *(optional)*

    Close the browser process on SIGTERM. Defaults to `true`.
  - <a id="browser-type-launch-persistent-context-option-has-touch"></a>`hasTouch` `boolean` *(optional)*

    Specifies if viewport supports touch events. Defaults to false. Learn more about [mobile emulation](../emulation.md#devices).
  - <a id="browser-type-launch-persistent-context-option-headless"></a>`headless` `boolean` *(optional)*

    Whether to run browser in headless mode. More details for
    [Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) and
    [Firefox](https://hacks.mozilla.org/2017/12/using-headless-mode-in-firefox/). Defaults to `true`.
  - <a id="browser-type-launch-persistent-context-option-http-credentials"></a>`httpCredentials` `Object | Array<Object>` *(optional)*

    Credentials for [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).
    If no origin is specified, the username and password are sent to any servers upon unauthorized responses.

    Pass an array to use different credentials for different origins. The first entry that matches the request origin is used, and entries with no origin match any request.

    - `username` `string`
    - `password` `string`
    - `origin` `string` *(optional)*

      Restrain sending http credentials on specific origin (scheme://host:port).
    - `send` `"unauthorized" | "always"` *(optional)*

      This option only applies to the requests sent from corresponding [APIRequestContext](/api/class-apirequestcontext) and does not affect requests sent from the browser. `'always'` - `Authorization` header with basic authentication credentials will be sent with the each API request. `'unauthorized` - the credentials are only sent when 401 (Unauthorized) response with `WWW-Authenticate` header is received. Defaults to `'unauthorized'`.
  - <a id="browser-type-launch-persistent-context-option-ignore-default-args"></a>`ignoreDefaultArgs` `boolean | Array<string>` *(optional)*

    If `true`, Playwright does not pass its own configurations args and only uses the ones from [`args`](/api/class-browsertype#browser-type-launch-persistent-context-option-args). If an
    array is given, then filters out the given default arguments. Dangerous option; use with care. Defaults to `false`.
  - <a id="browser-type-launch-persistent-context-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="browser-type-launch-persistent-context-option-is-mobile"></a>`isMobile` `boolean` *(optional)*

    Whether the `meta viewport` tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to `false`. Learn more about [mobile emulation](../emulation.md#ismobile).
  - <a id="browser-type-launch-persistent-context-option-java-script-enabled"></a>`javaScriptEnabled` `boolean` *(optional)*

    Whether or not to enable JavaScript in the context. Defaults to `true`. Learn more about [disabling JavaScript](../emulation.md#javascript-enabled).
  - <a id="browser-type-launch-persistent-context-option-locale"></a>`locale` `string` *(optional)*

    Specify user locale, for example `en-GB`, `de-DE`, etc. Locale will affect `navigator.language` value, `Accept-Language` request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our [emulation guide](../emulation.md#locale--timezone).
  - <a id="browser-type-launch-persistent-context-option-locate-only-visible"></a>`locateOnlyVisible` `boolean` *(optional)*

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
  - <a id="browser-type-launch-persistent-context-option-logger"></a>`logger` `Logger` *(optional)*

    Logger sink for Playwright logging.
  - <a id="browser-type-launch-persistent-context-option-offline"></a>`offline` `boolean` *(optional)*

    Whether to emulate network being offline. Defaults to `false`. Learn more about [network emulation](../emulation.md#offline).
  - <a id="browser-type-launch-persistent-context-option-permissions"></a>`permissions` `Array<string>` *(optional)*

    A list of permissions to grant to all pages in this context. See
    [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions) for more details. Defaults to none.
  - <a id="browser-type-launch-persistent-context-option-proxy"></a>`proxy` `Object` *(optional)*

    Network proxy settings.

    - `server` `string`

      Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example
      `http://myproxy.com:3128` or `socks5://myproxy.com:3128`. Short form `myproxy.com:3128` is considered an HTTP
      proxy.
    - `bypass` `string` *(optional)*

      Optional comma-separated domains to bypass proxy, for example `".com, chromium.org,
      .domain.com"`.
    - `username` `string` *(optional)*

      Optional username to use if HTTP proxy requires authentication.
    - `password` `string` *(optional)*

      Optional password to use if HTTP proxy requires authentication.
  - <a id="browser-type-launch-persistent-context-option-record-har"></a>`recordHar` `Object` *(optional)*

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
  - <a id="browser-type-launch-persistent-context-option-record-video"></a>`recordVideo` `Object` *(optional)*

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
  - <a id="browser-type-launch-persistent-context-option-reduced-motion"></a>`reducedMotion` `null | "reduce" | "no-preference"` *(optional)*

    Emulates `'prefers-reduced-motion'` media feature, supported values are `'reduce'`, `'no-preference'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="browser-type-launch-persistent-context-option-screen"></a>`screen` `Object` *(optional)*

    Emulates consistent window screen size available inside web page via `window.screen`. Is only used when the
    [`viewport`](/api/class-browsertype#browser-type-launch-persistent-context-option-viewport) is set.

    - `width` `int`

      page width in pixels.
    - `height` `int`

      page height in pixels.
  - <a id="browser-type-launch-persistent-context-option-service-workers"></a>`serviceWorkers` `"allow" | "block"` *(optional)*

    Whether to allow sites to register Service workers. Defaults to `'allow'`.
    * `'allow'`: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) can be registered.
    * `'block'`: Playwright will block all registration of Service Workers.
  - <a id="browser-type-launch-persistent-context-option-slow-mo"></a>`slowMo` `float` *(optional)*

    Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on.
  - <a id="browser-type-launch-persistent-context-option-strict-selectors"></a>`strictSelectors` `boolean` *(optional)*

    If set to true, enables strict selectors mode for this context. In the strict selectors mode all operations
    on selectors that imply single target DOM element will throw when more than one element matches the selector.
    This option does not affect any Locator APIs (Locators are always strict). Defaults to `false`.
    See [Locator](/api/class-locator) to learn more about the strict mode.
  - <a id="browser-type-launch-persistent-context-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds to wait for the browser instance to start. Defaults to `180000` (3 minutes). Pass `0` to
    disable timeout.
  - <a id="browser-type-launch-persistent-context-option-timezone-id"></a>`timezoneId` `string` *(optional)*

    Changes the timezone of the context. See [ICU's metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)
    for a list of supported timezone IDs. Defaults to the system timezone.
  - <a id="browser-type-launch-persistent-context-option-traces-dir"></a>`tracesDir` `path` *(optional)*

    If specified, traces are saved into this directory.
  - <a id="browser-type-launch-persistent-context-option-user-agent"></a>`userAgent` `string` *(optional)*

    Specific user agent to use in this context.
  - <a id="browser-type-launch-persistent-context-option-viewport"></a>`viewport` `null | Object` *(optional)*

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


### browserType.launchServer() {#browser-type-launch-server}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the browser app instance. You can connect to it via [`browserType.connect()`](/api/class-browsertype#browser-type-connect), which requires the major/minor client/server version to match (1.2.3 → is compatible with 1.2.x).

**Usage**

Launches browser server that client can connect to. An example of launching a browser executable and connecting to it
later:

```js
const { chromium } = require('playwright');  // Or 'webkit' or 'firefox'.

(async () => {
  const browserServer = await chromium.launchServer();
  const wsEndpoint = browserServer.wsEndpoint();
  // Use web socket endpoint later to establish a connection.
  const browser = await chromium.connect(wsEndpoint);
  // Close browser instance.
  await browserServer.close();
})();
```

**Arguments**

- <a id="browser-type-launch-server-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-launch-server-option-args"></a>`args` `Array<string>` *(optional)*

    ::: warning
    Use custom browser args at your own risk, as some of them may break Playwright functionality.
    :::

    Additional arguments to pass to the browser instance. The list of Chromium flags can be found
    [here](https://peter.sh/experiments/chromium-command-line-switches/).
  - <a id="browser-type-launch-server-option-artifacts-dir"></a>`artifactsDir` `path` *(optional)*

    If specified, artifacts (traces, videos, downloads, HAR files, etc.) are saved into this directory. The directory is not cleaned up when the browser closes. If not specified, a temporary directory is used and cleaned up when the browser closes.
  - <a id="browser-type-launch-server-option-channel"></a>`channel` `string` *(optional)*

    Browser distribution channel.

    Use "chromium" to [opt in to new headless mode](../browsers.md#chromium-new-headless-mode).

    Use "chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge", "msedge-beta", "msedge-dev", or "msedge-canary" to use branded [Google Chrome and Microsoft Edge](../browsers.md#google-chrome--microsoft-edge).
  - <a id="browser-type-launch-server-option-chromium-sandbox"></a>`chromiumSandbox` `boolean` *(optional)*

    Enable Chromium sandboxing. Defaults to `false`.
  - <a id="browser-type-launch-server-option-downloads-path"></a>`downloadsPath` `path` *(optional)*

    If specified, accepted downloads are downloaded into this directory. Otherwise, temporary directory is created and is
    deleted when browser is closed. In either case, the downloads are deleted when the browser context they were created in
    is closed.
  - <a id="browser-type-launch-server-option-env"></a>`env` `Object<string, string | undefined>` *(optional)*
  - <a id="browser-type-launch-server-option-executable-path"></a>`executablePath` `path` *(optional)*

    Path to a browser executable to run instead of the bundled one. If [`executablePath`](/api/class-browsertype#browser-type-launch-server-option-executable-path) is a relative path, then
    it is resolved relative to the current working directory. Note that Playwright only works with the bundled Chromium,
    Firefox or WebKit, use at your own risk.
  - <a id="browser-type-launch-server-option-firefox-user-prefs"></a>`firefoxUserPrefs` `Object<string, string | float | boolean>` *(optional)*

    Firefox user preferences. Learn more about the Firefox user preferences at
    [`about:config`](https://support.mozilla.org/en-US/kb/about-config-editor-firefox).

    You can also provide a path to a custom [`policies.json` file](https://mozilla.github.io/policy-templates/) via `PLAYWRIGHT_FIREFOX_POLICIES_JSON` environment variable.
  - <a id="browser-type-launch-server-option-handle-sighup"></a>`handleSIGHUP` `boolean` *(optional)*

    Close the browser process on SIGHUP. Defaults to `true`.
  - <a id="browser-type-launch-server-option-handle-sigint"></a>`handleSIGINT` `boolean` *(optional)*

    Close the browser process on Ctrl-C. Defaults to `true`.
  - <a id="browser-type-launch-server-option-handle-sigterm"></a>`handleSIGTERM` `boolean` *(optional)*

    Close the browser process on SIGTERM. Defaults to `true`.
  - <a id="browser-type-launch-server-option-headless"></a>`headless` `boolean` *(optional)*

    Whether to run browser in headless mode. More details for
    [Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) and
    [Firefox](https://hacks.mozilla.org/2017/12/using-headless-mode-in-firefox/). Defaults to `true`.
  - <a id="browser-type-launch-server-option-host"></a>`host` `string` *(optional)* <Badge type="info" text="Added in: v1.45" />

    Host to use for the web socket. It is optional and defaults to `localhost`, accepting connections only from the loopback interface. Pass an explicit address (e.g. `0.0.0.0`) to accept connections from the network.

    ::: warning
    The Browser Server has no authentication. A client that can reach the listening port and knows the [`wsPath`](/api/class-browsertype#browser-type-launch-server-option-ws-path) gets full control of the browser and can act as the OS user that started the server. When you pass an explicit host, restrict access to the port with your network configuration, for example a firewall, a private network or an authenticating proxy. Do not rely on the `wsPath` alone.
    :::
  - <a id="browser-type-launch-server-option-ignore-default-args"></a>`ignoreDefaultArgs` `boolean | Array<string>` *(optional)*

    If `true`, Playwright does not pass its own configurations args and only uses the ones from [`args`](/api/class-browsertype#browser-type-launch-server-option-args). If an
    array is given, then filters out the given default arguments. Dangerous option; use with care. Defaults to `false`.
  - <a id="browser-type-launch-server-option-logger"></a>`logger` `Logger` *(optional)*

    Logger sink for Playwright logging.
  - <a id="browser-type-launch-server-option-port"></a>`port` `int` *(optional)*

    Port to use for the web socket. Defaults to 0 that picks any available port.
  - <a id="browser-type-launch-server-option-proxy"></a>`proxy` `Object` *(optional)*

    Network proxy settings.

    - `server` `string`

      Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example
      `http://myproxy.com:3128` or `socks5://myproxy.com:3128`. Short form `myproxy.com:3128` is considered an HTTP
      proxy.
    - `bypass` `string` *(optional)*

      Optional comma-separated domains to bypass proxy, for example `".com, chromium.org,
      .domain.com"`.
    - `username` `string` *(optional)*

      Optional username to use if HTTP proxy requires authentication.
    - `password` `string` *(optional)*

      Optional password to use if HTTP proxy requires authentication.
  - <a id="browser-type-launch-server-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds to wait for the browser instance to start. Defaults to `180000` (3 minutes). Pass `0` to
    disable timeout.
  - <a id="browser-type-launch-server-option-traces-dir"></a>`tracesDir` `path` *(optional)*

    If specified, traces are saved into this directory.
  - <a id="browser-type-launch-server-option-ws-path"></a>`wsPath` `string` *(optional)* <Badge type="info" text="Added in: v1.15" />

    Path at which to serve the Browser Server. For security, this defaults to an
    unguessable string.

    ::: warning
    Any process or web page (including those running in Playwright) with knowledge
    of the `wsPath` can take control of the OS user. For this reason, you should
    use an unguessable token when using this option.

    The unguessable path protects a server on the loopback interface from web pages and
    from other local processes. It is not a replacement for network access control: the path
    is a part of the URL and is sent in plain text over `ws://`. See [`host`](/api/class-browsertype#browser-type-launch-server-option-host).
    :::

**Returns**

- `Promise<BrowserServer>`


### browserType.name() {#browser-type-name}

<Badge type="info" text="Added in: v1.8" />

Returns browser name. For example: `'chromium'`, `'webkit'` or `'firefox'`.

**Returns**

- `string`

