---
title: BrowserType
outline: 2
---

# BrowserType

<Badge type="info" text="Added in: v1.8" />

BrowserType provides methods to launch a specific browser instance or connect to an existing one. The following is a
typical example of using Playwright to drive automation:

::: code-group

```python [Async]
import asyncio
from playwright.async_api import async_playwright, Playwright

async def run(playwright: Playwright):
    chromium = playwright.chromium
    browser = await chromium.launch()
    page = await browser.new_page()
    await page.goto("https://example.com")
    # other actions...
    await browser.close()

async def main():
    async with async_playwright() as playwright:
        await run(playwright)
asyncio.run(main())
```

```python [Sync]
from playwright.sync_api import sync_playwright, Playwright

def run(playwright: Playwright):
    chromium = playwright.chromium
    browser = chromium.launch()
    page = browser.new_page()
    page.goto("https://example.com")
    # other actions...
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
```

:::

## Methods

### browser_type.connect() {#browser-type-connect}

<Badge type="info" text="Added in: v1.8" />

This method attaches Playwright to an existing browser instance created via `BrowserType.launchServer` in Node.js.

::: info
The major and minor version of the Playwright instance that connects needs to match the version of Playwright that launches the browser (1.2.3 → is compatible with 1.2.x).
:::

**Arguments**

- <a id="browser-type-connect-option-endpoint"></a>`endpoint` `string` <Badge type="info" text="Added in: v1.10" />

  A Playwright browser websocket endpoint to connect to. You obtain this endpoint via `BrowserServer.wsEndpoint`.
- <a id="browser-type-connect-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-connect-option-expose-network"></a>`expose_network` `string` *(optional)* <Badge type="info" text="Added in: v1.37" />

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
  - <a id="browser-type-connect-option-slow-mo"></a>`slow_mo` `float` *(optional)* <Badge type="info" text="Added in: v1.10" />

    Slows down Playwright operations by the specified amount of milliseconds. Useful so that you
    can see what is going on. Defaults to 0.
  - <a id="browser-type-connect-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.10" />

    Maximum time in milliseconds to wait for the connection to be established. Defaults to
    `0` (no timeout).

**Returns**

- `Browser`


### browser_type.connect_over_cdp() {#browser-type-connect-over-cdp}

<Badge type="info" text="Added in: v1.9" />

This method attaches Playwright to an existing browser instance using the Chrome DevTools Protocol.

The default browser context is accessible via [`browser.contexts()`](/python/api/class-browser#browser-contexts).

::: info
Connecting over the Chrome DevTools Protocol is only supported for Chromium-based browsers.
:::

::: info
This connection is significantly lower fidelity than the Playwright protocol connection via [`browser_type.connect()`](/python/api/class-browsertype#browser-type-connect). If you are experiencing issues or attempting to use advanced functionality, you probably want to use [`browser_type.connect()`](/python/api/class-browsertype#browser-type-connect).
:::

::: warning
Playwright maintains a curated list of arguments for launching the browser. If you launch the browser without Playwright and do not pass the exact same arguments, some of Playwright functionality may be broken upon connecting to the browser.
:::

**Usage**

::: code-group

```python [Async]
browser = await playwright.chromium.connect_over_cdp("http://localhost:9222")
default_context = browser.contexts[0]
page = default_context.pages[0]
```

```python [Sync]
browser = playwright.chromium.connect_over_cdp("http://localhost:9222")
default_context = browser.contexts[0]
page = default_context.pages[0]
```

:::

**Arguments**

- <a id="browser-type-connect-over-cdp-option-endpoint-url"></a>`endpoint_url` `string` <Badge type="info" text="Added in: v1.11" />

  A CDP websocket endpoint or http url to connect to. For example `http://localhost:9222/` or `ws://127.0.0.1:9222/devtools/browser/387adf4c-243f-4051-a181-46798f4a46f4`.

  Alternatively, a URL that tells which running browser to connect to:
  * `remote-debugging://<channel>` - a browser with remote debugging enabled, for example `remote-debugging://msedge`. The optional `userDataDir` parameter is the user data directory of the browser, when it is not the default one: `remote-debugging://chrome?userDataDir=/path/to/data`. A bare channel name such as `chrome` is the same as `remote-debugging://chrome`.
  * `extension://<channel>/<profile directory>` - the tabs of a browser profile, through the [Playwright Extension](https://chromewebstore.google.com/detail/playwright-extension/mmlmfjhmonkocbjadbfplnigmagldckm), for example `extension://chrome/Profile 1`. Playwright opens the connect page of the extension in that profile, and the user selects the tabs to share. Without the profile directory, Playwright uses the `Default` profile. The optional parameters are `userDataDir`, the user data directory of the browser when it is not the default one, and `executablePath`, the path to the browser executable when it is not at the standard location: `extension://chromium?executablePath=/path/to/chrome&userDataDir=/path/to/data`. Pass the other options of this connection in [`headers`](/python/api/class-browsertype#browser-type-connect-over-cdp-option-headers).

  The values of `userDataDir` and `executablePath` must be URL-encoded, for example with `encodeURIComponent` or `URLSearchParams`. The channel is a browser channel name such as `chrome`, `chrome-beta` or `msedge`. The default user data directory of the channel is where the browser keeps its data. On Linux, Playwright uses `CHROME_USER_DATA_DIR` when set. Otherwise, it uses `CHROME_CONFIG_HOME`, then `XDG_CONFIG_HOME`, then `~/.config` to locate that directory.
- <a id="browser-type-connect-over-cdp-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-connect-over-cdp-option-artifacts-dir"></a>`artifacts_dir` `path` *(optional)* <Badge type="info" text="Added in: v1.61" />

    If specified, browser artifacts (such as traces and downloads) are saved into this directory.
  - <a id="browser-type-connect-over-cdp-option-headers"></a>`headers` `Object<string, string>` *(optional)* <Badge type="info" text="Added in: v1.11" />

    Additional HTTP headers to be sent with connect request. Optional.

    When [`endpoint_url`](/python/api/class-browsertype#browser-type-connect-over-cdp-option-endpoint-url) is an extension URL such as `extension://chrome`, the headers are not sent. They are the options of the connection:
    * `x-playwright-extension-token` - the token of the extension. With the token, the user does not have to approve the connection. Without the token, the user must approve the connection before [`timeout`](/python/api/class-browsertype#browser-type-connect-over-cdp-option-timeout) expires, so set it to a value that gives the user enough time.
    * `x-playwright-extension-client-name` - the name of the client that the extension shows to the user.
    * `x-playwright-extension-tab-group` - pass `false` to keep the tabs out of a tab group.
    * `x-playwright-extension-tab-group-title` - the title of the tab group.
    * `x-playwright-extension-tab-group-color` - the color of the tab group: `green`, `blue`, `purple`, `orange`, `pink`, `cyan`, `yellow` or `red`.
    * `x-playwright-extension-background` - pass `true` to keep the tabs from becoming active.
  - <a id="browser-type-connect-over-cdp-option-is-local"></a>`is_local` `boolean` *(optional)* <Badge type="info" text="Added in: v1.58" />

    Tells Playwright that it runs on the same host as the CDP server. It will enable certain optimizations that rely upon
    the file system being the same between Playwright and the Browser.
  - <a id="browser-type-connect-over-cdp-option-no-defaults"></a>`no_defaults` `boolean` *(optional)* <Badge type="info" text="Added in: v1.60" />

    When true, Playwright will not apply its default overrides to the existing default browser context.
    Specifically, [`accept_downloads`](/python/api/class-browser#browser-new-context-option-accept-downloads) and font families are left at the browser's
    settings, focus emulation is not enabled, and media emulation options (such as [`color_scheme`](/python/api/class-browser#browser-new-context-option-color-scheme),
    [`reduced_motion`](/python/api/class-browser#browser-new-context-option-reduced-motion), [`forced_colors`](/python/api/class-browser#browser-new-context-option-forced-colors), and
    [`contrast`](/python/api/class-browser#browser-new-context-option-contrast)) are not applied. Useful when attaching to a user's daily-driver
    browser where these overrides would interfere with existing browser state. New contexts created via
    [`browser.new_context()`](/python/api/class-browser#browser-new-context) are not affected. Defaults to `false`.
  - <a id="browser-type-connect-over-cdp-option-slow-mo"></a>`slow_mo` `float` *(optional)* <Badge type="info" text="Added in: v1.11" />

    Slows down Playwright operations by the specified amount of milliseconds. Useful so that you
    can see what is going on. Defaults to 0.
  - <a id="browser-type-connect-over-cdp-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.11" />

    Maximum time in milliseconds to wait for the connection to be established. Defaults to
    `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `Browser`


### browser_type.executable_path() {#browser-type-executable-path}

<Badge type="info" text="Added in: v1.8" />

A path where Playwright expects to find a bundled browser executable.

**Returns**

- `string`


### browser_type.launch() {#browser-type-launch}

<Badge type="info" text="Added in: v1.8" />

Returns the browser instance.

**Usage**

You can use [`ignore_default_args`](/python/api/class-browsertype#browser-type-launch-option-ignore-default-args) to filter out `--mute-audio` from default arguments:

::: code-group

```python [Async]
browser = await playwright.chromium.launch( # or "firefox" or "webkit".
    ignore_default_args=["--mute-audio"]
)
```

```python [Sync]
browser = playwright.chromium.launch( # or "firefox" or "webkit".
    ignore_default_args=["--mute-audio"]
)
```

:::

> **Chromium-only** Playwright can also be used to control the Google Chrome or Microsoft Edge browsers, but it works best with the version of
Chromium it is bundled with. There is no guarantee it will work with any other version. Use [`executable_path`](/python/api/class-browsertype#browser-type-launch-option-executable-path)
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
  - <a id="browser-type-launch-option-artifacts-dir"></a>`artifacts_dir` `path` *(optional)*

    If specified, artifacts (traces, videos, downloads, HAR files, etc.) are saved into this directory. The directory is not cleaned up when the browser closes. If not specified, a temporary directory is used and cleaned up when the browser closes.
  - <a id="browser-type-launch-option-channel"></a>`channel` `string` *(optional)*

    Browser distribution channel.

    Use "chromium" to [opt in to new headless mode](../browsers.md#chromium-new-headless-mode).

    Use "chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge", "msedge-beta", "msedge-dev", or "msedge-canary" to use branded [Google Chrome and Microsoft Edge](../browsers.md#google-chrome--microsoft-edge).
  - <a id="browser-type-launch-option-chromium-sandbox"></a>`chromium_sandbox` `boolean` *(optional)*

    Enable Chromium sandboxing. Defaults to `false`.
  - <a id="browser-type-launch-option-downloads-path"></a>`downloads_path` `path` *(optional)*

    If specified, accepted downloads are downloaded into this directory. Otherwise, temporary directory is created and is
    deleted when browser is closed. In either case, the downloads are deleted when the browser context they were created in
    is closed.
  - <a id="browser-type-launch-option-env"></a>`env` `Object<string, string | float | boolean>` *(optional)*

    Specify environment variables that will be visible to the browser. Defaults to `process.env`.
  - <a id="browser-type-launch-option-executable-path"></a>`executable_path` `path` *(optional)*

    Path to a browser executable to run instead of the bundled one. If [`executable_path`](/python/api/class-browsertype#browser-type-launch-option-executable-path) is a relative path, then
    it is resolved relative to the current working directory. Note that Playwright only works with the bundled Chromium,
    Firefox or WebKit, use at your own risk.
  - <a id="browser-type-launch-option-firefox-user-prefs"></a>`firefox_user_prefs` `Object<string, string | float | boolean>` *(optional)*

    Firefox user preferences. Learn more about the Firefox user preferences at
    [`about:config`](https://support.mozilla.org/en-US/kb/about-config-editor-firefox).

    You can also provide a path to a custom [`policies.json` file](https://mozilla.github.io/policy-templates/) via `PLAYWRIGHT_FIREFOX_POLICIES_JSON` environment variable.
  - <a id="browser-type-launch-option-handle-sighup"></a>`handle_sighup` `boolean` *(optional)*

    Close the browser process on SIGHUP. Defaults to `true`.
  - <a id="browser-type-launch-option-handle-sigint"></a>`handle_sigint` `boolean` *(optional)*

    Close the browser process on Ctrl-C. Defaults to `true`.
  - <a id="browser-type-launch-option-handle-sigterm"></a>`handle_sigterm` `boolean` *(optional)*

    Close the browser process on SIGTERM. Defaults to `true`.
  - <a id="browser-type-launch-option-headless"></a>`headless` `boolean` *(optional)*

    Whether to run browser in headless mode. More details for
    [Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) and
    [Firefox](https://hacks.mozilla.org/2017/12/using-headless-mode-in-firefox/). Defaults to `true`.
  - <a id="browser-type-launch-option-ignore-default-args"></a>`ignore_default_args` `boolean | Array<string>` *(optional)*

    If `true`, Playwright does not pass its own configurations args and only uses the ones from [`args`](/python/api/class-browsertype#browser-type-launch-option-args). If an
    array is given, then filters out the given default arguments. Dangerous option; use with care. Defaults to `false`.
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
  - <a id="browser-type-launch-option-slow-mo"></a>`slow_mo` `float` *(optional)*

    Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on.
  - <a id="browser-type-launch-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds to wait for the browser instance to start. Defaults to `180000` (3 minutes). Pass `0` to
    disable timeout.
  - <a id="browser-type-launch-option-traces-dir"></a>`traces_dir` `path` *(optional)*

    If specified, traces are saved into this directory.

**Returns**

- `Browser`


### browser_type.launch_persistent_context() {#browser-type-launch-persistent-context}

<Badge type="info" text="Added in: v1.8" />

Returns the persistent browser context instance.

Launches browser that uses persistent storage located at [`user_data_dir`](/python/api/class-browsertype#browser-type-launch-persistent-context-option-user-data-dir) and returns the only context. Closing
this context will automatically close the browser.

**Arguments**

- <a id="browser-type-launch-persistent-context-option-user-data-dir"></a>`user_data_dir` `path`

  Path to a User Data Directory, which stores browser session data like cookies and local storage. Pass an empty string to create a temporary directory.

  More details for
  [Chromium](https://chromium.googlesource.com/chromium/src/+/master/docs/user_data_dir.md#introduction) and
  [Firefox](https://wiki.mozilla.org/Firefox/CommandLineOptions#User_profile). Chromium's user data directory is the **parent** directory of the "Profile Path" seen at `chrome://version`.

  Note that browsers do not allow launching multiple instances with the same User Data Directory.

  ::: warning
  Chromium/Chrome: Due to recent Chrome policy changes, automating the default Chrome user profile is not supported. Pointing `userDataDir` to Chrome's main "User Data" directory (the profile used for your regular browsing) may result in pages not loading or the browser exiting. Create and use a separate directory (for example, an empty folder) as your automation profile instead. See https://developer.chrome.com/blog/remote-debugging-port for details.
  :::
- <a id="browser-type-launch-persistent-context-option-options"></a>`options` `Object` *(optional)*

  - <a id="browser-type-launch-persistent-context-option-accept-downloads"></a>`accept_downloads` `boolean` *(optional)*

    Whether to automatically download all the attachments. Defaults to `true` where all the downloads are accepted.
  - <a id="browser-type-launch-persistent-context-option-args"></a>`args` `Array<string>` *(optional)*

    ::: warning
    Use custom browser args at your own risk, as some of them may break Playwright functionality.
    :::

    Additional arguments to pass to the browser instance. The list of Chromium flags can be found
    [here](https://peter.sh/experiments/chromium-command-line-switches/).
  - <a id="browser-type-launch-persistent-context-option-artifacts-dir"></a>`artifacts_dir` `path` *(optional)*

    If specified, artifacts (traces, videos, downloads, HAR files, etc.) are saved into this directory. The directory is not cleaned up when the browser closes. If not specified, a temporary directory is used and cleaned up when the browser closes.
  - <a id="browser-type-launch-persistent-context-option-base-url"></a>`base_url` `string` *(optional)*

    When using [`page.goto()`](/python/api/class-page#page-goto), [`page.route()`](/python/api/class-page#page-route), [`page.wait_for_url()`](/python/api/class-page#page-wait-for-url), [`page.expect_request()`](/python/api/class-page#page-wait-for-request), or [`page.expect_response()`](/python/api/class-page#page-wait-for-response) it takes the base URL in consideration by using the [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor for building the corresponding URL. Unset by default. Examples:
    * baseURL: `http://localhost:3000` and navigating to `/bar.html` results in `http://localhost:3000/bar.html`
    * baseURL: `http://localhost:3000/foo/` and navigating to `./bar.html` results in `http://localhost:3000/foo/bar.html`
    * baseURL: `http://localhost:3000/foo` (without trailing slash) and navigating to `./bar.html` results in `http://localhost:3000/bar.html`
  - <a id="browser-type-launch-persistent-context-option-bypass-csp"></a>`bypass_csp` `boolean` *(optional)*

    Toggles bypassing page's Content-Security-Policy. Defaults to `false`.
  - <a id="browser-type-launch-persistent-context-option-channel"></a>`channel` `string` *(optional)*

    Browser distribution channel.

    Use "chromium" to [opt in to new headless mode](../browsers.md#chromium-new-headless-mode).

    Use "chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge", "msedge-beta", "msedge-dev", or "msedge-canary" to use branded [Google Chrome and Microsoft Edge](../browsers.md#google-chrome--microsoft-edge).
  - <a id="browser-type-launch-persistent-context-option-chromium-sandbox"></a>`chromium_sandbox` `boolean` *(optional)*

    Enable Chromium sandboxing. Defaults to `false`.
  - <a id="browser-type-launch-persistent-context-option-client-certificates"></a>`client_certificates` `Array<Object>` *(optional)* <Badge type="info" text="Added in: v1.46" />

    TLS Client Authentication allows the server to request a client certificate and verify it.

    **Details**

    An array of client certificates to be used. Each certificate object must have either both `certPath` and `keyPath`, a single `pfxPath`, or their corresponding direct value equivalents (`cert` and `key`, or `pfx`). Optionally, `passphrase` property should be provided if the certificate is encrypted. The `origin` property should be provided with an exact match to the request origin that the certificate is valid for.

    Client certificate authentication is only active when at least one client certificate is provided. If you want to reject all client certificates sent by the server, you need to provide a client certificate with an `origin` that does not match any of the domains you plan to visit.

    ::: info
    When using WebKit on macOS, accessing `localhost` will not pick up client certificates. You can make it work by replacing `localhost` with `local.playwright`.
    :::

    - `origin` `string` <Badge type="info" text="Added in: v1.46" />

      Exact origin that the certificate is valid for. Origin includes `https` protocol, a hostname and optionally a port.
    - `cert_path` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Path to the file with the certificate in PEM format.
    - `cert` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Direct value of the certificate in PEM format.
    - `key_path` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Path to the file with the private key in PEM format.
    - `key` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Direct value of the private key in PEM format.
    - `pfx_path` `path` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Path to the PFX or PKCS12 encoded private key and certificate chain.
    - `pfx` `Buffer` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Direct value of the PFX or PKCS12 encoded private key and certificate chain.
    - `passphrase` `string` *(optional)* <Badge type="info" text="Added in: v1.46" />

      Passphrase for the private key (PEM or PFX).
  - <a id="browser-type-launch-persistent-context-option-color-scheme"></a>`color_scheme` `"light" | "dark" | "no-preference" | "null"` *(optional)*

    Emulates [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media feature, supported values are `'light'` and `'dark'`. See
    [`page.emulate_media()`](/python/api/class-page#page-emulate-media) for more details. Passing `'null'` resets emulation to system defaults. Defaults to `'light'`.
  - <a id="browser-type-launch-persistent-context-option-contrast"></a>`contrast` `"no-preference" | "more" | "null"` *(optional)*

    Emulates `'prefers-contrast'` media feature, supported values are `'no-preference'`, `'more'`. See [`page.emulate_media()`](/python/api/class-page#page-emulate-media) for more details. Passing `'null'` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="browser-type-launch-persistent-context-option-device-scale-factor"></a>`device_scale_factor` `float` *(optional)*

    Specify device scale factor (can be thought of as dpr). Defaults to `1`. Learn more about [emulating devices with device scale factor](../emulation.md#devices).
  - <a id="browser-type-launch-persistent-context-option-downloads-path"></a>`downloads_path` `path` *(optional)*

    If specified, accepted downloads are downloaded into this directory. Otherwise, temporary directory is created and is
    deleted when browser is closed. In either case, the downloads are deleted when the browser context they were created in
    is closed.
  - <a id="browser-type-launch-persistent-context-option-env"></a>`env` `Object<string, string | float | boolean>` *(optional)*

    Specify environment variables that will be visible to the browser. Defaults to `process.env`.
  - <a id="browser-type-launch-persistent-context-option-executable-path"></a>`executable_path` `path` *(optional)*

    Path to a browser executable to run instead of the bundled one. If [`executable_path`](/python/api/class-browsertype#browser-type-launch-persistent-context-option-executable-path) is a relative path, then
    it is resolved relative to the current working directory. Note that Playwright only works with the bundled Chromium,
    Firefox or WebKit, use at your own risk.
  - <a id="browser-type-launch-persistent-context-option-extra-http-headers"></a>`extra_http_headers` `Object<string, string>` *(optional)*

    An object containing additional HTTP headers to be sent with every request. Defaults to none.
  - <a id="browser-type-launch-persistent-context-option-firefox-user-prefs"></a>`firefox_user_prefs` `Object<string, string | float | boolean>` *(optional)* <Badge type="info" text="Added in: v1.40" />

    Firefox user preferences. Learn more about the Firefox user preferences at
    [`about:config`](https://support.mozilla.org/en-US/kb/about-config-editor-firefox).

    You can also provide a path to a custom [`policies.json` file](https://mozilla.github.io/policy-templates/) via `PLAYWRIGHT_FIREFOX_POLICIES_JSON` environment variable.
  - <a id="browser-type-launch-persistent-context-option-forced-colors"></a>`forced_colors` `"active" | "none" | "null"` *(optional)*

    Emulates `'forced-colors'` media feature, supported values are `'active'`, `'none'`. See [`page.emulate_media()`](/python/api/class-page#page-emulate-media) for more details. Passing `'null'` resets emulation to system defaults. Defaults to `'none'`.
  - <a id="browser-type-launch-persistent-context-option-geolocation"></a>`geolocation` `Object` *(optional)*

    - `latitude` `float`

      Latitude between -90 and 90.
    - `longitude` `float`

      Longitude between -180 and 180.
    - `accuracy` `float` *(optional)*

      Non-negative accuracy value. Defaults to `0`.
  - <a id="browser-type-launch-persistent-context-option-handle-sighup"></a>`handle_sighup` `boolean` *(optional)*

    Close the browser process on SIGHUP. Defaults to `true`.
  - <a id="browser-type-launch-persistent-context-option-handle-sigint"></a>`handle_sigint` `boolean` *(optional)*

    Close the browser process on Ctrl-C. Defaults to `true`.
  - <a id="browser-type-launch-persistent-context-option-handle-sigterm"></a>`handle_sigterm` `boolean` *(optional)*

    Close the browser process on SIGTERM. Defaults to `true`.
  - <a id="browser-type-launch-persistent-context-option-has-touch"></a>`has_touch` `boolean` *(optional)*

    Specifies if viewport supports touch events. Defaults to false. Learn more about [mobile emulation](../emulation.md#devices).
  - <a id="browser-type-launch-persistent-context-option-headless"></a>`headless` `boolean` *(optional)*

    Whether to run browser in headless mode. More details for
    [Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) and
    [Firefox](https://hacks.mozilla.org/2017/12/using-headless-mode-in-firefox/). Defaults to `true`.
  - <a id="browser-type-launch-persistent-context-option-http-credentials"></a>`http_credentials` `Object | Array<Object>` *(optional)*

    Credentials for [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).
    If no origin is specified, the username and password are sent to any servers upon unauthorized responses.

    Pass an array to use different credentials for different origins. The first entry that matches the request origin is used, and entries with no origin match any request.

    - `username` `string`
    - `password` `string`
    - `origin` `string` *(optional)*

      Restrain sending http credentials on specific origin (scheme://host:port).
    - `send` `"unauthorized" | "always"` *(optional)*

      This option only applies to the requests sent from corresponding [APIRequestContext](/python/api/class-apirequestcontext) and does not affect requests sent from the browser. `'always'` - `Authorization` header with basic authentication credentials will be sent with the each API request. `'unauthorized` - the credentials are only sent when 401 (Unauthorized) response with `WWW-Authenticate` header is received. Defaults to `'unauthorized'`.
  - <a id="browser-type-launch-persistent-context-option-ignore-default-args"></a>`ignore_default_args` `boolean | Array<string>` *(optional)*

    If `true`, Playwright does not pass its own configurations args and only uses the ones from [`args`](/python/api/class-browsertype#browser-type-launch-persistent-context-option-args). If an
    array is given, then filters out the given default arguments. Dangerous option; use with care. Defaults to `false`.
  - <a id="browser-type-launch-persistent-context-option-ignore-https-errors"></a>`ignore_https_errors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="browser-type-launch-persistent-context-option-is-mobile"></a>`is_mobile` `boolean` *(optional)*

    Whether the `meta viewport` tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to `false`. Learn more about [mobile emulation](../emulation.md#ismobile).
  - <a id="browser-type-launch-persistent-context-option-java-script-enabled"></a>`java_script_enabled` `boolean` *(optional)*

    Whether or not to enable JavaScript in the context. Defaults to `true`. Learn more about [disabling JavaScript](../emulation.md#javascript-enabled).
  - <a id="browser-type-launch-persistent-context-option-locale"></a>`locale` `string` *(optional)*

    Specify user locale, for example `en-GB`, `de-DE`, etc. Locale will affect `navigator.language` value, `Accept-Language` request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our [emulation guide](../emulation.md#locale--timezone).
  - <a id="browser-type-launch-persistent-context-option-no-viewport"></a>`no_viewport` `boolean` *(optional)*

    Does not enforce fixed viewport, allows resizing window in the headed mode.
  - <a id="browser-type-launch-persistent-context-option-offline"></a>`offline` `boolean` *(optional)*

    Whether to emulate network being offline. Defaults to `false`. Learn more about [network emulation](../emulation.md#offline).
  - <a id="browser-type-launch-persistent-context-option-permissions"></a>`permissions` `Array<string>` *(optional)*

    A list of permissions to grant to all pages in this context. See
    [`browser_context.grant_permissions()`](/python/api/class-browsercontext#browser-context-grant-permissions) for more details. Defaults to none.
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
  - <a id="browser-type-launch-persistent-context-option-record-har-content"></a>`record_har_content` `"omit" | "embed" | "attach"` *(optional)*

    Optional setting to control resource content management. If `omit` is specified, content is not persisted. If `attach` is specified, resources are persisted as separate files and all of these files are archived along with the HAR file. Defaults to `embed`, which stores content inline the HAR file as per HAR specification.
  - <a id="browser-type-launch-persistent-context-option-record-har-mode"></a>`record_har_mode` `"full" | "minimal"` *(optional)*

    When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `full`.
  - <a id="browser-type-launch-persistent-context-option-record-har-omit-content"></a>`record_har_omit_content` `boolean` *(optional)*

    Optional setting to control whether to omit request content from the HAR. Defaults to `false`.
  - <a id="browser-type-launch-persistent-context-option-record-har-path"></a>`record_har_path` `path` *(optional)*

    Enables [HAR](http://www.softwareishard.com/blog/har-12-spec) recording for all pages into the
    specified HAR file on the filesystem. If not specified, the HAR is not recorded. Make sure to
    call [`browser_context.close()`](/python/api/class-browsercontext#browser-context-close) for the HAR to be saved.
  - <a id="browser-type-launch-persistent-context-option-record-har-url-filter"></a>`record_har_url_filter` `string | RegExp` *(optional)*
  - <a id="browser-type-launch-persistent-context-option-record-video-dir"></a>`record_video_dir` `path` *(optional)*

    Enables video recording for all pages into the specified directory. If not specified videos are
    not recorded. Make sure to call [`browser_context.close()`](/python/api/class-browsercontext#browser-context-close) for videos to be saved.
  - <a id="browser-type-launch-persistent-context-option-record-video-fps"></a>`record_video_fps` `int` *(optional)* <Badge type="info" text="Added in: v1.64" />

    Frame rate of the recorded videos in frames per second. Defaults to `25`. Firefox and WebKit currently capture up to 25 frames per second.
  - <a id="browser-type-launch-persistent-context-option-record-video-size"></a>`record_video_size` `Object` *(optional)*

    Dimensions of the recorded videos. If not specified the size will be equal to `viewport`
    scaled down to fit into 800x800. If `viewport` is not configured explicitly the video size defaults to 800x450.
    Actual picture of each page will be scaled down if necessary to fit the specified size.

    - `width` `int`

      Video frame width.
    - `height` `int`

      Video frame height.
  - <a id="browser-type-launch-persistent-context-option-reduced-motion"></a>`reduced_motion` `"reduce" | "no-preference" | "null"` *(optional)*

    Emulates `'prefers-reduced-motion'` media feature, supported values are `'reduce'`, `'no-preference'`. See [`page.emulate_media()`](/python/api/class-page#page-emulate-media) for more details. Passing `'null'` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="browser-type-launch-persistent-context-option-screen"></a>`screen` `Object` *(optional)*

    Emulates consistent window screen size available inside web page via `window.screen`. Is only used when the
    [`viewport`](/python/api/class-browsertype#browser-type-launch-persistent-context-option-viewport) is set.

    - `width` `int`

      page width in pixels.
    - `height` `int`

      page height in pixels.
  - <a id="browser-type-launch-persistent-context-option-service-workers"></a>`service_workers` `"allow" | "block"` *(optional)*

    Whether to allow sites to register Service workers. Defaults to `'allow'`.
    * `'allow'`: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) can be registered.
    * `'block'`: Playwright will block all registration of Service Workers.
  - <a id="browser-type-launch-persistent-context-option-slow-mo"></a>`slow_mo` `float` *(optional)*

    Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on.
  - <a id="browser-type-launch-persistent-context-option-strict-selectors"></a>`strict_selectors` `boolean` *(optional)*

    If set to true, enables strict selectors mode for this context. In the strict selectors mode all operations
    on selectors that imply single target DOM element will throw when more than one element matches the selector.
    This option does not affect any Locator APIs (Locators are always strict). Defaults to `false`.
    See [Locator](/python/api/class-locator) to learn more about the strict mode.
  - <a id="browser-type-launch-persistent-context-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds to wait for the browser instance to start. Defaults to `180000` (3 minutes). Pass `0` to
    disable timeout.
  - <a id="browser-type-launch-persistent-context-option-timezone-id"></a>`timezone_id` `string` *(optional)*

    Changes the timezone of the context. See [ICU's metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)
    for a list of supported timezone IDs. Defaults to the system timezone.
  - <a id="browser-type-launch-persistent-context-option-traces-dir"></a>`traces_dir` `path` *(optional)*

    If specified, traces are saved into this directory.
  - <a id="browser-type-launch-persistent-context-option-user-agent"></a>`user_agent` `string` *(optional)*

    Specific user agent to use in this context.
  - <a id="browser-type-launch-persistent-context-option-viewport"></a>`viewport` `null | Object` *(optional)*

    Sets a consistent viewport for each page. Defaults to an 1280x720 viewport. `no_viewport` disables the fixed viewport. Learn more about [viewport emulation](../emulation.md#viewport).

    - `width` `int`

      page width in pixels.
    - `height` `int`

      page height in pixels.

**Returns**

- `BrowserContext`


### browser_type.name() {#browser-type-name}

<Badge type="info" text="Added in: v1.8" />

Returns browser name. For example: `'chromium'`, `'webkit'` or `'firefox'`.

**Returns**

- `string`

