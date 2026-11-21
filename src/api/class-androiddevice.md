---
title: AndroidDevice
outline: 2
---

# AndroidDevice

<Badge type="info" text="Added in: v1.9" />

[AndroidDevice](/api/class-androiddevice) represents a connected device, either real hardware or emulated. Devices can be obtained using [`android.devices()`](/api/class-android#android-devices).

## Methods

### androidDevice.close() {#android-device-close}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Disconnects from the device.


### androidDevice.drag() {#android-device-drag}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Drags the widget defined by [`selector`](/api/class-androiddevice#android-device-drag-option-selector) towards [`dest`](/api/class-androiddevice#android-device-drag-option-dest) point.

**Arguments**

- <a id="android-device-drag-option-selector"></a>`selector` `AndroidSelector`

  Selector to drag.
- <a id="android-device-drag-option-dest"></a>`dest` `Object`

  Point to drag to.

  - `x` `float`
  - `y` `float`
- <a id="android-device-drag-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-drag-option-speed"></a>`speed` `float` *(optional)*

    Optional speed of the drag in pixels per second.
  - <a id="android-device-drag-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
    using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) method.


### androidDevice.fill() {#android-device-fill}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Fills the specific [`selector`](/api/class-androiddevice#android-device-fill-option-selector) input box with [`text`](/api/class-androiddevice#android-device-fill-option-text).

**Arguments**

- <a id="android-device-fill-option-selector"></a>`selector` `AndroidSelector`

  Selector to fill.
- <a id="android-device-fill-option-text"></a>`text` `string`

  Text to be filled in the input box.
- <a id="android-device-fill-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-fill-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
    using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) method.


### androidDevice.fling() {#android-device-fling}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Flings the widget defined by [`selector`](/api/class-androiddevice#android-device-fling-option-selector) in  the specified [`direction`](/api/class-androiddevice#android-device-fling-option-direction).

**Arguments**

- <a id="android-device-fling-option-selector"></a>`selector` `AndroidSelector`

  Selector to fling.
- <a id="android-device-fling-option-direction"></a>`direction` `"down" | "up" | "left" | "right"`

  Fling direction.
- <a id="android-device-fling-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-fling-option-speed"></a>`speed` `float` *(optional)*

    Optional speed of the fling in pixels per second.
  - <a id="android-device-fling-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
    using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) method.


### androidDevice.info() {#android-device-info}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Returns information about a widget defined by [`selector`](/api/class-androiddevice#android-device-info-option-selector).

**Arguments**

- <a id="android-device-info-option-selector"></a>`selector` `AndroidSelector`

  Selector to return information about.

**Returns**

- `Promise<AndroidElementInfo>`


### androidDevice.installApk() {#android-device-install-apk}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Installs an apk on the device.

**Arguments**

- <a id="android-device-install-apk-option-file"></a>`file` `string | Buffer`

  Either a path to the apk file, or apk file content.
- <a id="android-device-install-apk-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-install-apk-option-args"></a>`args` `Array<string>` *(optional)*

    Optional arguments to pass to the `shell:cmd package install` call. Defaults to `-r -t -S`.


### androidDevice.launchBrowser() {#android-device-launch-browser}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Launches Chrome browser on the device, and returns its persistent context.

**Arguments**

- <a id="android-device-launch-browser-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-launch-browser-option-accept-downloads"></a>`acceptDownloads` `boolean` *(optional)*

    Whether to automatically download all the attachments. Defaults to `true` where all the downloads are accepted.
  - <a id="android-device-launch-browser-option-args"></a>`args` `Array<string>` *(optional)* <Badge type="info" text="Added in: v1.29" />

    ::: warning
    Use custom browser args at your own risk, as some of them may break Playwright functionality.
    :::

    Additional arguments to pass to the browser instance. The list of Chromium flags can be found
    [here](https://peter.sh/experiments/chromium-command-line-switches/).
  - <a id="android-device-launch-browser-option-base-url"></a>`baseURL` `string` *(optional)*

    When using [`page.goto()`](/api/class-page#page-goto), [`page.route()`](/api/class-page#page-route), [`page.waitForURL()`](/api/class-page#page-wait-for-url), [`page.waitForRequest()`](/api/class-page#page-wait-for-request), or [`page.waitForResponse()`](/api/class-page#page-wait-for-response) it takes the base URL in consideration by using the [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor for building the corresponding URL. Unset by default. Examples:
    * baseURL: `http://localhost:3000` and navigating to `/bar.html` results in `http://localhost:3000/bar.html`
    * baseURL: `http://localhost:3000/foo/` and navigating to `./bar.html` results in `http://localhost:3000/foo/bar.html`
    * baseURL: `http://localhost:3000/foo` (without trailing slash) and navigating to `./bar.html` results in `http://localhost:3000/bar.html`
  - <a id="android-device-launch-browser-option-bypass-csp"></a>`bypassCSP` `boolean` *(optional)*

    Toggles bypassing page's Content-Security-Policy. Defaults to `false`.
  - <a id="android-device-launch-browser-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(optional)*

    Emulates [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media feature, supported values are `'light'` and `'dark'`. See
    [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'light'`.
  - <a id="android-device-launch-browser-option-contrast"></a>`contrast` `null | "no-preference" | "more"` *(optional)*

    Emulates `'prefers-contrast'` media feature, supported values are `'no-preference'`, `'more'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="android-device-launch-browser-option-device-scale-factor"></a>`deviceScaleFactor` `float` *(optional)*

    Specify device scale factor (can be thought of as dpr). Defaults to `1`. Learn more about [emulating devices with device scale factor](../emulation.md#devices).
  - <a id="android-device-launch-browser-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(optional)*

    An object containing additional HTTP headers to be sent with every request. Defaults to none.
  - <a id="android-device-launch-browser-option-forced-colors"></a>`forcedColors` `null | "active" | "none"` *(optional)*

    Emulates `'forced-colors'` media feature, supported values are `'active'`, `'none'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'none'`.
  - <a id="android-device-launch-browser-option-geolocation"></a>`geolocation` `Object` *(optional)*

    - `latitude` `float`

      Latitude between -90 and 90.
    - `longitude` `float`

      Longitude between -180 and 180.
    - `accuracy` `float` *(optional)*

      Non-negative accuracy value. Defaults to `0`.
  - <a id="android-device-launch-browser-option-has-touch"></a>`hasTouch` `boolean` *(optional)*

    Specifies if viewport supports touch events. Defaults to false. Learn more about [mobile emulation](../emulation.md#devices).
  - <a id="android-device-launch-browser-option-http-credentials"></a>`httpCredentials` `Object | Array<Object>` *(optional)*

    Credentials for [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).
    If no origin is specified, the username and password are sent to any servers upon unauthorized responses.

    Pass an array to use different credentials for different origins. The first entry that matches the request origin is used, and entries with no origin match any request.

    - `username` `string`
    - `password` `string`
    - `origin` `string` *(optional)*

      Restrain sending http credentials on specific origin (scheme://host:port).
    - `send` `"unauthorized" | "always"` *(optional)*

      This option only applies to the requests sent from corresponding [APIRequestContext](/api/class-apirequestcontext) and does not affect requests sent from the browser. `'always'` - `Authorization` header with basic authentication credentials will be sent with the each API request. `'unauthorized` - the credentials are only sent when 401 (Unauthorized) response with `WWW-Authenticate` header is received. Defaults to `'unauthorized'`.
  - <a id="android-device-launch-browser-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(optional)*

    Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
  - <a id="android-device-launch-browser-option-is-mobile"></a>`isMobile` `boolean` *(optional)*

    Whether the `meta viewport` tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to `false`. Learn more about [mobile emulation](../emulation.md#ismobile).
  - <a id="android-device-launch-browser-option-java-script-enabled"></a>`javaScriptEnabled` `boolean` *(optional)*

    Whether or not to enable JavaScript in the context. Defaults to `true`. Learn more about [disabling JavaScript](../emulation.md#javascript-enabled).
  - <a id="android-device-launch-browser-option-locale"></a>`locale` `string` *(optional)*

    Specify user locale, for example `en-GB`, `de-DE`, etc. Locale will affect `navigator.language` value, `Accept-Language` request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our [emulation guide](../emulation.md#locale--timezone).
  - <a id="android-device-launch-browser-option-locate-only-visible"></a>`locateOnlyVisible` `boolean` *(optional)*

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
  - <a id="android-device-launch-browser-option-logger"></a>`logger` `Logger` *(optional)*

    Logger sink for Playwright logging.
  - <a id="android-device-launch-browser-option-offline"></a>`offline` `boolean` *(optional)*

    Whether to emulate network being offline. Defaults to `false`. Learn more about [network emulation](../emulation.md#offline).
  - <a id="android-device-launch-browser-option-permissions"></a>`permissions` `Array<string>` *(optional)*

    A list of permissions to grant to all pages in this context. See
    [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions) for more details. Defaults to none.
  - <a id="android-device-launch-browser-option-pkg"></a>`pkg` `string` *(optional)*

    Optional package name to launch instead of default Chrome for Android.
  - <a id="android-device-launch-browser-option-proxy"></a>`proxy` `Object` *(optional)* <Badge type="info" text="Added in: v1.29" />

    Network proxy settings.

    - `server` `string` <Badge type="info" text="Added in: v1.29" />

      Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example
      `http://myproxy.com:3128` or `socks5://myproxy.com:3128`. Short form `myproxy.com:3128` is considered an HTTP
      proxy.
    - `bypass` `string` *(optional)* <Badge type="info" text="Added in: v1.29" />

      Optional comma-separated domains to bypass proxy, for example `".com, chromium.org,
      .domain.com"`.
    - `username` `string` *(optional)* <Badge type="info" text="Added in: v1.29" />

      Optional username to use if HTTP proxy requires authentication.
    - `password` `string` *(optional)* <Badge type="info" text="Added in: v1.29" />

      Optional password to use if HTTP proxy requires authentication.
  - <a id="android-device-launch-browser-option-record-har"></a>`recordHar` `Object` *(optional)*

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
  - <a id="android-device-launch-browser-option-record-video"></a>`recordVideo` `Object` *(optional)*

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
  - <a id="android-device-launch-browser-option-reduced-motion"></a>`reducedMotion` `null | "reduce" | "no-preference"` *(optional)*

    Emulates `'prefers-reduced-motion'` media feature, supported values are `'reduce'`, `'no-preference'`. See [`page.emulateMedia()`](/api/class-page#page-emulate-media) for more details. Passing `null` resets emulation to system defaults. Defaults to `'no-preference'`.
  - <a id="android-device-launch-browser-option-screen"></a>`screen` `Object` *(optional)*

    Emulates consistent window screen size available inside web page via `window.screen`. Is only used when the
    [`viewport`](/api/class-androiddevice#android-device-launch-browser-option-viewport) is set.

    - `width` `int`

      page width in pixels.
    - `height` `int`

      page height in pixels.
  - <a id="android-device-launch-browser-option-service-workers"></a>`serviceWorkers` `"allow" | "block"` *(optional)*

    Whether to allow sites to register Service workers. Defaults to `'allow'`.
    * `'allow'`: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) can be registered.
    * `'block'`: Playwright will block all registration of Service Workers.
  - <a id="android-device-launch-browser-option-strict-selectors"></a>`strictSelectors` `boolean` *(optional)*

    If set to true, enables strict selectors mode for this context. In the strict selectors mode all operations
    on selectors that imply single target DOM element will throw when more than one element matches the selector.
    This option does not affect any Locator APIs (Locators are always strict). Defaults to `false`.
    See [Locator](/api/class-locator) to learn more about the strict mode.
  - <a id="android-device-launch-browser-option-timezone-id"></a>`timezoneId` `string` *(optional)*

    Changes the timezone of the context. See [ICU's metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)
    for a list of supported timezone IDs. Defaults to the system timezone.
  - <a id="android-device-launch-browser-option-user-agent"></a>`userAgent` `string` *(optional)*

    Specific user agent to use in this context.
  - <a id="android-device-launch-browser-option-viewport"></a>`viewport` `null | Object` *(optional)*

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


### androidDevice.longTap() {#android-device-long-tap}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Performs a long tap on the widget defined by [`selector`](/api/class-androiddevice#android-device-long-tap-option-selector).

**Arguments**

- <a id="android-device-long-tap-option-selector"></a>`selector` `AndroidSelector`

  Selector to tap on.
- <a id="android-device-long-tap-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-long-tap-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
    using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) method.


### androidDevice.model() {#android-device-model}

<Badge type="info" text="Added in: v1.9" />

Device model.

**Returns**

- `string`


### androidDevice.open() {#android-device-open}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Launches a process in the shell on the device and returns a socket to communicate with the launched process.

**Arguments**

- <a id="android-device-open-option-command"></a>`command` `string`

  Shell command to execute.

**Returns**

- `Promise<AndroidSocket>`


### androidDevice.pinchClose() {#android-device-pinch-close}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Pinches the widget defined by [`selector`](/api/class-androiddevice#android-device-pinch-close-option-selector) in the closing direction.

**Arguments**

- <a id="android-device-pinch-close-option-selector"></a>`selector` `AndroidSelector`

  Selector to pinch close.
- <a id="android-device-pinch-close-option-percent"></a>`percent` `float`

  The size of the pinch as a percentage of the widget's size.
- <a id="android-device-pinch-close-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-pinch-close-option-speed"></a>`speed` `float` *(optional)*

    Optional speed of the pinch in pixels per second.
  - <a id="android-device-pinch-close-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
    using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) method.


### androidDevice.pinchOpen() {#android-device-pinch-open}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Pinches the widget defined by [`selector`](/api/class-androiddevice#android-device-pinch-open-option-selector) in the open direction.

**Arguments**

- <a id="android-device-pinch-open-option-selector"></a>`selector` `AndroidSelector`

  Selector to pinch open.
- <a id="android-device-pinch-open-option-percent"></a>`percent` `float`

  The size of the pinch as a percentage of the widget's size.
- <a id="android-device-pinch-open-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-pinch-open-option-speed"></a>`speed` `float` *(optional)*

    Optional speed of the pinch in pixels per second.
  - <a id="android-device-pinch-open-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
    using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) method.


### androidDevice.press() {#android-device-press}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Presses the specific [`key`](/api/class-androiddevice#android-device-press-option-key) in the widget defined by [`selector`](/api/class-androiddevice#android-device-press-option-selector).

**Arguments**

- <a id="android-device-press-option-selector"></a>`selector` `AndroidSelector`

  Selector to press the key in.
- <a id="android-device-press-option-key"></a>`key` `AndroidKey`

  The key to press.
- <a id="android-device-press-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-press-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
    using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) method.


### androidDevice.push() {#android-device-push}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Copies a file to the device.

**Arguments**

- <a id="android-device-push-option-file"></a>`file` `string | Buffer`

  Either a path to the file, or file content.
- <a id="android-device-push-option-path"></a>`path` `string`

  Path to the file on the device.
- <a id="android-device-push-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-push-option-mode"></a>`mode` `int` *(optional)*

    Optional file mode, defaults to `644` (`rw-r--r--`).


### androidDevice.screenshot() {#android-device-screenshot}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Returns the buffer with the captured screenshot of the device.

**Arguments**

- <a id="android-device-screenshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-screenshot-option-path"></a>`path` `path` *(optional)*

    The file path to save the image to. If [`path`](/api/class-androiddevice#android-device-screenshot-option-path) is a
    relative path, then it is resolved relative to the current working directory. If no path is provided, the image won't be
    saved to the disk.

**Returns**

- `Promise<Buffer>`


### androidDevice.scroll() {#android-device-scroll}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Scrolls the widget defined by [`selector`](/api/class-androiddevice#android-device-scroll-option-selector) in  the specified [`direction`](/api/class-androiddevice#android-device-scroll-option-direction).

**Arguments**

- <a id="android-device-scroll-option-selector"></a>`selector` `AndroidSelector`

  Selector to scroll.
- <a id="android-device-scroll-option-direction"></a>`direction` `"down" | "up" | "left" | "right"`

  Scroll direction.
- <a id="android-device-scroll-option-percent"></a>`percent` `float`

  Distance to scroll as a percentage of the widget's size.
- <a id="android-device-scroll-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-scroll-option-speed"></a>`speed` `float` *(optional)*

    Optional speed of the scroll in pixels per second.
  - <a id="android-device-scroll-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
    using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) method.


### androidDevice.serial() {#android-device-serial}

<Badge type="info" text="Added in: v1.9" />

Device serial number.

**Returns**

- `string`


### androidDevice.setDefaultTimeout() {#android-device-set-default-timeout}

<Badge type="info" text="Added in: v1.9" />

This setting will change the default maximum time for all the methods accepting [`timeout`](/api/class-androiddevice#android-device-set-default-timeout-option-timeout) option.

**Arguments**

- <a id="android-device-set-default-timeout-option-timeout"></a>`timeout` `float`

  Maximum time in milliseconds


### androidDevice.shell() {#android-device-shell}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Executes a shell command on the device and returns its output.

**Arguments**

- <a id="android-device-shell-option-command"></a>`command` `string`

  Shell command to execute.

**Returns**

- `Promise<Buffer>`


### androidDevice.swipe() {#android-device-swipe}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Swipes the widget defined by [`selector`](/api/class-androiddevice#android-device-swipe-option-selector) in  the specified [`direction`](/api/class-androiddevice#android-device-swipe-option-direction).

**Arguments**

- <a id="android-device-swipe-option-selector"></a>`selector` `AndroidSelector`

  Selector to swipe.
- <a id="android-device-swipe-option-direction"></a>`direction` `"down" | "up" | "left" | "right"`

  Swipe direction.
- <a id="android-device-swipe-option-percent"></a>`percent` `float`

  Distance to swipe as a percentage of the widget's size.
- <a id="android-device-swipe-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-swipe-option-speed"></a>`speed` `float` *(optional)*

    Optional speed of the swipe in pixels per second.
  - <a id="android-device-swipe-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
    using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) method.


### androidDevice.tap() {#android-device-tap}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Taps on the widget defined by [`selector`](/api/class-androiddevice#android-device-tap-option-selector).

**Arguments**

- <a id="android-device-tap-option-selector"></a>`selector` `AndroidSelector`

  Selector to tap on.
- <a id="android-device-tap-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-tap-option-duration"></a>`duration` `float` *(optional)*

    Optional duration of the tap in milliseconds.
  - <a id="android-device-tap-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
    using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) method.


### androidDevice.wait() {#android-device-wait}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Waits for the specific [`selector`](/api/class-androiddevice#android-device-wait-option-selector) to either appear or disappear, depending on the [`state`](/api/class-androiddevice#android-device-wait-option-state).

**Arguments**

- <a id="android-device-wait-option-selector"></a>`selector` `AndroidSelector`

  Selector to wait for.
- <a id="android-device-wait-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-wait-option-state"></a>`state` `"gone"` *(optional)*

    Optional state. Can be either:
    * default - wait for element to be present.
    * `'gone'` - wait for element to not be present.
  - <a id="android-device-wait-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
    using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) method.


### androidDevice.waitForEvent() {#android-device-wait-for-event}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Waits for event to fire and passes its value into the predicate function. Returns when the predicate returns truthy value.

**Arguments**

- <a id="android-device-wait-for-event-option-event"></a>`event` `string`

  Event name, same one typically passed into `*.on(event)`.
- <a id="android-device-wait-for-event-option-options-or-predicate"></a>`optionsOrPredicate` `function() | Object` *(optional)*

  Either a predicate that receives an event or an options object. Optional.

  - `predicate` `function()`

    receives the event data and resolves to truthy value when the waiting should resolve.
  - `timeout` `float` *(optional)*

    maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to
    disable timeout. The default value can be changed by using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout).

**Returns**

- `Promise<any>`


### androidDevice.webView() {#android-device-web-view}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

This method waits until [AndroidWebView](/api/class-androidwebview) matching the [`selector`](/api/class-androiddevice#android-device-web-view-option-selector) is opened and returns it. If there is already an open [AndroidWebView](/api/class-androidwebview) matching the [`selector`](/api/class-androiddevice#android-device-web-view-option-selector), returns immediately.

**Arguments**

- <a id="android-device-web-view-option-selector"></a>`selector` `Object`

  - `pkg` `string` *(optional)*

    Optional Package identifier.
  - `socketName` `string` *(optional)*

    Optional webview socket name.
- <a id="android-device-web-view-option-options"></a>`options` `Object` *(optional)*

  - <a id="android-device-web-view-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by
    using the [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) method.

**Returns**

- `Promise<AndroidWebView>`


### androidDevice.webViews() {#android-device-web-views}

<Badge type="info" text="Added in: v1.9" />

Currently open WebViews.

**Returns**

- `Array<AndroidWebView>`


## Properties

### androidDevice.input {#android-device-input}

<Badge type="info" text="Added in: v1.9" />

**Type**

- `AndroidInput`


## Events

### androidDevice.on('close') {#android-device-event-close}

<Badge type="info" text="Added in: v1.28" />

Emitted when the device connection gets closed.

**Event data**

- `AndroidDevice`


### androidDevice.on('webView') {#android-device-event-web-view}

<Badge type="info" text="Added in: v1.9" />

Emitted when a new WebView instance is detected.

**Event data**

- `AndroidWebView`

