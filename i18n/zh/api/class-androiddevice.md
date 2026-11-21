---
title: AndroidDevice
outline: 2
---

# AndroidDevice

<Badge type="info" text="Added in: v1.9" />

[AndroidDevice](/api/class-androiddevice) 表示已连接的设备，可以是真实硬件或模拟器。可以使用 [`android.devices()`](/api/class-android#android-devices) 获取设备。

## 方法

### androidDevice.close() {#android-device-close}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

断开与设备的连接。


### androidDevice.drag() {#android-device-drag}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

将 [`selector`](/api/class-androiddevice#android-device-drag-option-selector) 定义的控件拖动到 [`dest`](/api/class-androiddevice#android-device-drag-option-dest) 点。

**参数**

- <a id="android-device-drag-option-selector"></a>`selector` `AndroidSelector`

  要拖动的选择器。
- <a id="android-device-drag-option-dest"></a>`dest` `Object`

  拖动到的目标点。

  - `x` `float`
  - `y` `float`
- <a id="android-device-drag-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-drag-option-speed"></a>`speed` `float` *(可选)*

    可选的拖动速度，以每秒像素为单位。
  - <a id="android-device-drag-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒），默认为 30 秒，传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 方法更改默认值。


### androidDevice.fill() {#android-device-fill}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

用 [`text`](/api/class-androiddevice#android-device-fill-option-text) 填充指定的 [`selector`](/api/class-androiddevice#android-device-fill-option-selector) 输入框。

**参数**

- <a id="android-device-fill-option-selector"></a>`selector` `AndroidSelector`

  要填充的选择器。
- <a id="android-device-fill-option-text"></a>`text` `string`

  要在输入框中填充的文本。
- <a id="android-device-fill-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-fill-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒），默认为 30 秒，传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 方法更改默认值。


### androidDevice.fling() {#android-device-fling}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

在指定的 [`direction`](/api/class-androiddevice#android-device-fling-option-direction) 方向快速滑动 [`selector`](/api/class-androiddevice#android-device-fling-option-selector) 定义的控件。

**参数**

- <a id="android-device-fling-option-selector"></a>`selector` `AndroidSelector`

  要快速滑动的选择器。
- <a id="android-device-fling-option-direction"></a>`direction` `"down" | "up" | "left" | "right"`

  快速滑动方向。
- <a id="android-device-fling-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-fling-option-speed"></a>`speed` `float` *(可选)*

    可选的快速滑动速度，以每秒像素为单位。
  - <a id="android-device-fling-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒），默认为 30 秒，传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 方法更改默认值。


### androidDevice.info() {#android-device-info}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

返回 [`selector`](/api/class-androiddevice#android-device-info-option-selector) 定义的控件的信息。

**参数**

- <a id="android-device-info-option-selector"></a>`selector` `AndroidSelector`

  要返回信息的选择器。

**返回值**

- `Promise<AndroidElementInfo>`


### androidDevice.installApk() {#android-device-install-apk}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

在设备上安装 apk。

**参数**

- <a id="android-device-install-apk-option-file"></a>`file` `string | Buffer`

  apk 文件的路径或 apk 文件内容。
- <a id="android-device-install-apk-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-install-apk-option-args"></a>`args` `Array<string>` *(可选)*

    传递给 `shell:cmd package install` 调用的可选参数。默认为 `-r -t -S`。


### androidDevice.launchBrowser() {#android-device-launch-browser}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

在设备上启动 Chrome 浏览器，并返回其持久化上下文。

**参数**

- <a id="android-device-launch-browser-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-launch-browser-option-accept-downloads"></a>`acceptDownloads` `boolean` *(可选)*

    是否自动下载所有附件。默认为 `true`，即接受所有下载。
  - <a id="android-device-launch-browser-option-args"></a>`args` `Array<string>` *(可选)* <Badge type="info" text="Added in: v1.29" />

    ::: warning
    使用自定义浏览器参数需自行承担风险，因为其中一些可能会破坏 Playwright 功能。
    :::

    传递给浏览器实例的附加参数。Chromium 标志列表可以在[这里](https://peter.sh/experiments/chromium-command-line-switches/)找到。
  - <a id="android-device-launch-browser-option-base-url"></a>`baseURL` `string` *(可选)*

    使用 [`page.goto()`](/api/class-page#page-goto)、[`page.route()`](/api/class-page#page-route)、[`page.waitForURL()`](/api/class-page#page-wait-for-url)、[`page.waitForRequest()`](/api/class-page#page-wait-for-request) 或 [`page.waitForResponse()`](/api/class-page#page-wait-for-response) 时，会使用 [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数考虑基础 URL 来构建相应的 URL。默认未设置。示例：
    * baseURL: `http://localhost:3000` 并导航到 `/bar.html` 结果为 `http://localhost:3000/bar.html`
    * baseURL: `http://localhost:3000/foo/` 并导航到 `./bar.html` 结果为 `http://localhost:3000/foo/bar.html`
    * baseURL: `http://localhost:3000/foo`（没有尾部斜杠）并导航到 `./bar.html` 结果为 `http://localhost:3000/bar.html`
  - <a id="android-device-launch-browser-option-bypass-csp"></a>`bypassCSP` `boolean` *(可选)*

    切换绕过页面的内容安全策略。默认为 `false`。
  - <a id="android-device-launch-browser-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(可选)*

    模拟 [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 媒体特性，支持的值为 `'light'` 和 `'dark'`。有关更多详细信息，请参见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 将模拟重置为系统默认值。默认为 `'light'`。
  - <a id="android-device-launch-browser-option-contrast"></a>`contrast` `null | "no-preference" | "more"` *(可选)*

    模拟 `'prefers-contrast'` 媒体特性，支持的值为 `'no-preference'`、`'more'`。有关更多详细信息，请参见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 将模拟重置为系统默认值。默认为 `'no-preference'`。
  - <a id="android-device-launch-browser-option-device-scale-factor"></a>`deviceScaleFactor` `float` *(可选)*

    指定设备缩放因子（可以理解为 dpr）。默认为 `1`。了解更多关于[使用设备缩放因子模拟设备](../emulation.md#devices)。
  - <a id="android-device-launch-browser-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(可选)*

    包含随每个请求发送的附加 HTTP 头的对象。默认为无。
  - <a id="android-device-launch-browser-option-forced-colors"></a>`forcedColors` `null | "active" | "none"` *(可选)*

    模拟 `'forced-colors'` 媒体特性，支持的值为 `'active'`、`'none'`。有关更多详细信息，请参见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 将模拟重置为系统默认值。默认为 `'none'`。
  - <a id="android-device-launch-browser-option-geolocation"></a>`geolocation` `Object` *(可选)*

    - `latitude` `float`

      纬度，介于 -90 和 90 之间。
    - `longitude` `float`

      经度，介于 -180 和 180 之间。
    - `accuracy` `float` *(可选)*

      非负精度值。默认为 `0`。
  - <a id="android-device-launch-browser-option-has-touch"></a>`hasTouch` `boolean` *(可选)*

    指定视口是否支持触摸事件。默认为 false。了解更多关于[移动端模拟](../emulation.md#devices)。
  - <a id="android-device-launch-browser-option-http-credentials"></a>`httpCredentials` `Object | Array<Object>` *(可选)*

    用于 [HTTP 认证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)的凭据。
    如果未指定来源，用户名和密码将在收到未授权响应时发送到任何服务器。

    传递数组以为不同的来源使用不同的凭据。第一个与请求来源匹配的条目将被使用，没有来源的条目匹配任何请求。

    - `username` `string`
    - `password` `string`
    - `origin` `string` *(可选)*

      限制在特定来源（scheme://host:port）发送 http 凭据。
    - `send` `"unauthorized" | "always"` *(可选)*

      此选项仅适用于从相应 [APIRequestContext](/api/class-apirequestcontext) 发送的请求，不影响从浏览器发送的请求。`'always'` - 每个 API 请求都会发送带有基本认证凭据的 `Authorization` 头。`'unauthorized'` - 仅在收到带有 `WWW-Authenticate` 头的 401（未授权）响应时发送凭据。默认为 `'unauthorized'`。
  - <a id="android-device-launch-browser-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="android-device-launch-browser-option-is-mobile"></a>`isMobile` `boolean` *(可选)*

    是否考虑 `meta viewport` 标签并启用触摸事件。isMobile 是设备的一部分，因此你实际上不需要手动设置它。默认为 `false`。了解更多关于[移动端模拟](../emulation.md#ismobile)。
  - <a id="android-device-launch-browser-option-java-script-enabled"></a>`javaScriptEnabled` `boolean` *(可选)*

    是否在上下文中启用 JavaScript。默认为 `true`。了解更多关于[禁用 JavaScript](../emulation.md#javascript-enabled)。
  - <a id="android-device-launch-browser-option-locale"></a>`locale` `string` *(可选)*

    指定用户区域设置，例如 `en-GB`、`de-DE` 等。区域设置将影响 `navigator.language` 值、`Accept-Language` 请求头值以及数字和日期格式规则。默认为系统默认区域设置。在我们的[模拟指南](../emulation.md#locale--timezone)中了解更多关于模拟的信息。
  - <a id="android-device-launch-browser-option-locate-only-visible"></a>`locateOnlyVisible` `boolean` *(可选)*

    此上下文中的定位器是否只查找[可见](../actionability.md#visible)元素。
    默认为 `false`。

    启用后，Playwright 应用两条规则：
    1. 定位器找到的元素必须可见。操作、断言和查询的行为就像在定位器链末尾调用了 [`locator.visible()`](/api/class-locator#locator-visible)。
    1. [`locator.first()`](/api/class-locator#locator-first)、[`locator.last()`](/api/class-locator#locator-last) 和 [`locator.nth()`](/api/class-locator#locator-nth) 在可见元素中选择。它们的行为就像在它们之前立即调用了 [`locator.visible()`](/api/class-locator#locator-visible)。

    ```js
    // <div hidden>One</div> <div>Two</div> <div>Three</div>
    await expect(page.locator('div')).toHaveCount(2);
    await expect(page.locator('div').first()).toHaveText('Two');
    await expect(page.locator('div').last()).toHaveText('Three');
    ```

    显式的可见性过滤器始终具有优先级。Playwright 不会在已有过滤器的位置添加自己的过滤器。例如，`page.locator('div').filter({ visible: false }).first()` 会找到第一个隐藏元素。

    定位器链的所有其他部分不会被过滤。在 `page.locator('section').getByRole('button')` 中，按钮必须可见，但根据[可见性](../actionability.md#visible)规则，section 可以是隐藏的，例如因为它的大小为零。同样适用于 [`locator.filter()`](/api/class-locator#locator-filter)、[`locator.and()`](/api/class-locator#locator-and) 和 [`locator.or()`](/api/class-locator#locator-or) 的内部定位器：只有第二条规则适用于它们。

    此选项不会改变 [`page.getByRole()`](/api/class-page#page-get-by-role) 的可访问性规则或基于选择器的方法（如 [`page.$()`](/api/class-page#page-query-selector)）的行为。
  - <a id="android-device-launch-browser-option-logger"></a>`logger` `Logger` *(可选)*

    Playwright 日志记录的日志接收器。
  - <a id="android-device-launch-browser-option-offline"></a>`offline` `boolean` *(可选)*

    是否模拟网络离线。默认为 `false`。了解更多关于[网络模拟](../emulation.md#offline)。
  - <a id="android-device-launch-browser-option-permissions"></a>`permissions` `Array<string>` *(可选)*

    授予此上下文中所有页面的权限列表。有关更多详细信息，请参见 [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions)。默认为无。
  - <a id="android-device-launch-browser-option-pkg"></a>`pkg` `string` *(可选)*

    要启动的可选包名，而不是默认的 Chrome for Android。
  - <a id="android-device-launch-browser-option-proxy"></a>`proxy` `Object` *(可选)* <Badge type="info" text="Added in: v1.29" />

    网络代理设置。

    - `server` `string` <Badge type="info" text="Added in: v1.29" />

      用于所有请求的代理。支持 HTTP 和 SOCKS 代理，例如 `http://myproxy.com:3128` 或 `socks5://myproxy.com:3128`。短格式 `myproxy.com:3128` 被视为 HTTP 代理。
    - `bypass` `string` *(可选)* <Badge type="info" text="Added in: v1.29" />

      可选的逗号分隔域名，绕过代理，例如 `".com, chromium.org, .domain.com"`。
    - `username` `string` *(可选)* <Badge type="info" text="Added in: v1.29" />

      如果 HTTP 代理需要认证，可选的用户名。
    - `password` `string` *(可选)* <Badge type="info" text="Added in: v1.29" />

      如果 HTTP 代理需要认证，可选的密码。
  - <a id="android-device-launch-browser-option-record-har"></a>`recordHar` `Object` *(可选)*

    启用将所有页面的 [HAR](http://www.softwareishard.com/blog/har-12-spec) 记录到 `recordHar.path` 文件。如果未指定，则不记录 HAR。确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 以保存 HAR。

    - `omitContent` `boolean` *(可选)*

      控制是否从 HAR 中省略请求内容的可选设置。默认为 `false`。已弃用，请改用 `content` 策略。
    - `content` `"omit" | "embed" | "attach"` *(可选)*

      控制资源内容管理的可选设置。如果指定 `omit`，则不持久化内容。如果指定 `attach`，则资源作为单独的文件或 ZIP 存档中的条目持久化。如果指定 `embed`，则根据 HAR 规范将内容存储在 HAR 文件内联。`.zip` 输出文件默认为 `attach`，所有其他文件扩展名默认为 `embed`。
    - `path` `path`

      写入 HAR 文件的文件系统路径。如果文件名以 `.zip` 结尾，默认使用 `content: 'attach'`。
    - `mode` `"full" | "minimal"` *(可选)*

      当设置为 `minimal` 时，只记录从 HAR 路由所需的信息。这会省略大小、时间、页面、cookie、安全性和其他在从 HAR 重放时不使用的 HAR 信息类型。默认为 `full`。
    - `urlFilter` `string | RegExp` *(可选)*

      用于过滤存储在 HAR 中的请求的 glob 或正则表达式模式。当通过上下文选项提供 [`baseURL`](/api/class-browser#browser-new-context-option-base-url) 且传递的 URL 是路径时，它会通过 [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数合并。默认为无。
  - <a id="android-device-launch-browser-option-record-video"></a>`recordVideo` `Object` *(可选)*

    启用将所有页面的视频录制到 `recordVideo.dir` 目录。如果未指定，则不录制视频。确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 以保存视频。

    - `dir` `path` *(可选)*

      放置视频的目录路径。如果未指定，视频将存储在 `artifactsDir` 中（参见 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 选项）。
    - `size` `Object` *(可选)*

      录制视频的可选尺寸。如果未指定，大小将等于缩放到适合 800x800 的 `viewport`。如果未显式配置 `viewport`，视频大小默认为 800x450。如果需要，每个页面的实际图片将缩小以适应指定的大小。

      - `width` `int`

        视频帧宽度。
      - `height` `int`

        视频帧高度。
    - `fps` `int` *(可选)*

      录制视频的帧率（每秒帧数）。默认为 `25`。Firefox 和 WebKit 目前最多捕获每秒 25 帧。
    - `showActions` `Object` *(可选)*

      如果指定，在视频录制期间对交互元素启用视觉注释。

      - `duration` `float` *(可选)*

        每个注释显示的时长（毫秒）。默认为 `500`。
      - `position` `"top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right"` *(可选)*

        操作标题覆盖层的位置。默认为 `"top-right"`。
      - `fontSize` `int` *(可选)*

        操作标题的字体大小（像素）。默认为 `24`。已弃用，请改用 `style.title`。
      - `cursor` `"none" | "pointer"` *(可选)*

        指针操作显示的光标装饰。`"pointer"`（默认）渲染一个从上一个操作点动画到下一个操作点的鼠标指针。`"none"` 禁用光标装饰。
      - `style` `Object` *(可选)*

        操作装饰的样式。

        - `point` `string` *(可选)*

          以操作点为中心的零大小标记的 CSS 声明。省略时不显示。
        - `highlight` `string` *(可选)*

          覆盖目标元素的框的 CSS 声明。省略时不显示。
        - `title` `string` *(可选)*

          操作标题的 CSS 声明。
  - <a id="android-device-launch-browser-option-reduced-motion"></a>`reducedMotion` `null | "reduce" | "no-preference"` *(可选)*

    模拟 `'prefers-reduced-motion'` 媒体特性，支持的值为 `'reduce'`、`'no-preference'`。有关更多详细信息，请参见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 将模拟重置为系统默认值。默认为 `'no-preference'`。
  - <a id="android-device-launch-browser-option-screen"></a>`screen` `Object` *(可选)*

    模拟网页内通过 `window.screen` 可用的一致窗口屏幕大小。仅在设置了 [`viewport`](/api/class-androiddevice#android-device-launch-browser-option-viewport) 时使用。

    - `width` `int`

      页面宽度（像素）。
    - `height` `int`

      页面高度（像素）。
  - <a id="android-device-launch-browser-option-service-workers"></a>`serviceWorkers` `"allow" | "block"` *(可选)*

    是否允许站点注册 Service Worker。默认为 `'allow'`。
    * `'allow'`: 可以注册 [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)。
    * `'block'`: Playwright 将阻止所有 Service Worker 的注册。
  - <a id="android-device-launch-browser-option-strict-selectors"></a>`strictSelectors` `boolean` *(可选)*

    如果设置为 true，则为此上下文启用严格选择器模式。在严格选择器模式下，所有暗示单个目标 DOM 元素的选择器操作在有多个元素匹配选择器时将抛出错误。此选项不影响任何 Locator API（Locator 始终是严格的）。默认为 `false`。参见 [Locator](/api/class-locator) 了解更多关于严格模式的信息。
  - <a id="android-device-launch-browser-option-timezone-id"></a>`timezoneId` `string` *(可选)*

    更改上下文的时区。有关支持的时区 ID 列表，请参见 [ICU 的 metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)。默认为系统时区。
  - <a id="android-device-launch-browser-option-user-agent"></a>`userAgent` `string` *(可选)*

    在此上下文中使用的特定用户代理。
  - <a id="android-device-launch-browser-option-viewport"></a>`viewport` `null | Object` *(可选)*

    为每个页面模拟一致的视口。默认为 1280x720 视口。
    使用 `null` 禁用一致的视口模拟。了解更多关于[视口模拟](../emulation#viewport)。

    ::: info
    `null` 值选择退出默认预设，使视口取决于操作系统定义的主机窗口大小。这使得测试执行不确定。
    :::

    - `width` `int`

      页面宽度（像素）。
    - `height` `int`

      页面高度（像素）。

**返回值**

- `Promise<BrowserContext>`


### androidDevice.longTap() {#android-device-long-tap}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

对 [`selector`](/api/class-androiddevice#android-device-long-tap-option-selector) 定义的控件执行长按。

**参数**

- <a id="android-device-long-tap-option-selector"></a>`selector` `AndroidSelector`

  要点击的选择器。
- <a id="android-device-long-tap-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-long-tap-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒），默认为 30 秒，传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 方法更改默认值。


### androidDevice.model() {#android-device-model}

<Badge type="info" text="Added in: v1.9" />

设备型号。

**返回值**

- `string`


### androidDevice.open() {#android-device-open}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

在设备的 shell 中启动一个进程，并返回一个用于与启动的进程通信的套接字。

**参数**

- <a id="android-device-open-option-command"></a>`command` `string`

  要执行的 shell 命令。

**返回值**

- `Promise<AndroidSocket>`


### androidDevice.pinchClose() {#android-device-pinch-close}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

在关闭方向对 [`selector`](/api/class-androiddevice#android-device-pinch-close-option-selector) 定义的控件执行捏合。

**参数**

- <a id="android-device-pinch-close-option-selector"></a>`selector` `AndroidSelector`

  要执行捏合关闭的选择器。
- <a id="android-device-pinch-close-option-percent"></a>`percent` `float`

  捏合大小占控件大小的百分比。
- <a id="android-device-pinch-close-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-pinch-close-option-speed"></a>`speed` `float` *(可选)*

    可选的捏合速度，以每秒像素为单位。
  - <a id="android-device-pinch-close-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒），默认为 30 秒，传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 方法更改默认值。


### androidDevice.pinchOpen() {#android-device-pinch-open}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

在打开方向对 [`selector`](/api/class-androiddevice#android-device-pinch-open-option-selector) 定义的控件执行捏合。

**参数**

- <a id="android-device-pinch-open-option-selector"></a>`selector` `AndroidSelector`

  要执行捏合打开的选择器。
- <a id="android-device-pinch-open-option-percent"></a>`percent` `float`

  捏合大小占控件大小的百分比。
- <a id="android-device-pinch-open-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-pinch-open-option-speed"></a>`speed` `float` *(可选)*

    可选的捏合速度，以每秒像素为单位。
  - <a id="android-device-pinch-open-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒），默认为 30 秒，传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 方法更改默认值。


### androidDevice.press() {#android-device-press}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

在 [`selector`](/api/class-androiddevice#android-device-press-option-selector) 定义的控件中按下指定的 [`key`](/api/class-androiddevice#android-device-press-option-key)。

**参数**

- <a id="android-device-press-option-selector"></a>`selector` `AndroidSelector`

  要在其中按键的选择器。
- <a id="android-device-press-option-key"></a>`key` `AndroidKey`

  要按的键。
- <a id="android-device-press-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-press-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒），默认为 30 秒，传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 方法更改默认值。


### androidDevice.push() {#android-device-push}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

将文件复制到设备。

**参数**

- <a id="android-device-push-option-file"></a>`file` `string | Buffer`

  文件路径或文件内容。
- <a id="android-device-push-option-path"></a>`path` `string`

  设备上的文件路径。
- <a id="android-device-push-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-push-option-mode"></a>`mode` `int` *(可选)*

    可选的文件模式，默认为 `644`（`rw-r--r--`）。


### androidDevice.screenshot() {#android-device-screenshot}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

返回包含设备截图的缓冲区。

**参数**

- <a id="android-device-screenshot-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-screenshot-option-path"></a>`path` `path` *(可选)*

    保存图像的文件路径。如果 [`path`](/api/class-androiddevice#android-device-screenshot-option-path) 是相对路径，则相对于当前工作目录解析。如果未提供路径，图像将不会保存到磁盘。

**返回值**

- `Promise<Buffer>`


### androidDevice.scroll() {#android-device-scroll}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

在指定的 [`direction`](/api/class-androiddevice#android-device-scroll-option-direction) 方向滚动 [`selector`](/api/class-androiddevice#android-device-scroll-option-selector) 定义的控件。

**参数**

- <a id="android-device-scroll-option-selector"></a>`selector` `AndroidSelector`

  要滚动的选择器。
- <a id="android-device-scroll-option-direction"></a>`direction` `"down" | "up" | "left" | "right"`

  滚动方向。
- <a id="android-device-scroll-option-percent"></a>`percent` `float`

  滚动距离占控件大小的百分比。
- <a id="android-device-scroll-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-scroll-option-speed"></a>`speed` `float` *(可选)*

    可选的滚动速度，以每秒像素为单位。
  - <a id="android-device-scroll-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒），默认为 30 秒，传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 方法更改默认值。


### androidDevice.serial() {#android-device-serial}

<Badge type="info" text="Added in: v1.9" />

设备序列号。

**返回值**

- `string`


### androidDevice.setDefaultTimeout() {#android-device-set-default-timeout}

<Badge type="info" text="Added in: v1.9" />

此设置将更改所有接受 [`timeout`](/api/class-androiddevice#android-device-set-default-timeout-option-timeout) 选项的方法的默认最大时间。

**参数**

- <a id="android-device-set-default-timeout-option-timeout"></a>`timeout` `float`

  最大时间（毫秒）


### androidDevice.shell() {#android-device-shell}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

在设备上执行 shell 命令并返回其输出。

**参数**

- <a id="android-device-shell-option-command"></a>`command` `string`

  要执行的 shell 命令。

**返回值**

- `Promise<Buffer>`


### androidDevice.swipe() {#android-device-swipe}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

在指定的 [`direction`](/api/class-androiddevice#android-device-swipe-option-direction) 方向滑动 [`selector`](/api/class-androiddevice#android-device-swipe-option-selector) 定义的控件。

**参数**

- <a id="android-device-swipe-option-selector"></a>`selector` `AndroidSelector`

  要滑动的选择器。
- <a id="android-device-swipe-option-direction"></a>`direction` `"down" | "up" | "left" | "right"`

  滑动方向。
- <a id="android-device-swipe-option-percent"></a>`percent` `float`

  滑动距离占控件大小的百分比。
- <a id="android-device-swipe-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-swipe-option-speed"></a>`speed` `float` *(可选)*

    可选的滑动速度，以每秒像素为单位。
  - <a id="android-device-swipe-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒），默认为 30 秒，传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 方法更改默认值。


### androidDevice.tap() {#android-device-tap}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

点击 [`selector`](/api/class-androiddevice#android-device-tap-option-selector) 定义的控件。

**参数**

- <a id="android-device-tap-option-selector"></a>`selector` `AndroidSelector`

  要点击的选择器。
- <a id="android-device-tap-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-tap-option-duration"></a>`duration` `float` *(可选)*

    可选的点击持续时间（毫秒）。
  - <a id="android-device-tap-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒），默认为 30 秒，传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 方法更改默认值。


### androidDevice.wait() {#android-device-wait}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

等待指定的 [`selector`](/api/class-androiddevice#android-device-wait-option-selector) 出现或消失，取决于 [`state`](/api/class-androiddevice#android-device-wait-option-state)。

**参数**

- <a id="android-device-wait-option-selector"></a>`selector` `AndroidSelector`

  要等待的选择器。
- <a id="android-device-wait-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-wait-option-state"></a>`state` `"gone"` *(可选)*

    可选状态。可以是：
    * 默认 - 等待元素出现。
    * `'gone'` - 等待元素消失。
  - <a id="android-device-wait-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒），默认为 30 秒，传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 方法更改默认值。


### androidDevice.waitForEvent() {#android-device-wait-for-event}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

等待事件触发并将其值传递给谓词函数。当谓词返回真值时返回。

**参数**

- <a id="android-device-wait-for-event-option-event"></a>`event` `string`

  事件名称，与通常传递给 `*.on(event)` 的相同。
- <a id="android-device-wait-for-event-option-options-or-predicate"></a>`optionsOrPredicate` `function() | Object` *(可选)*

  接收事件的谓词或选项对象。可选。

  - `predicate` `function()`

    接收事件数据，当等待应该解析时返回真值。
  - `timeout` `float` *(可选)*

    最大等待时间（毫秒）。默认为 `30000`（30 秒）。传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 更改默认值。

**返回值**

- `Promise<any>`


### androidDevice.webView() {#android-device-web-view}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

此方法等待匹配 [`selector`](/api/class-androiddevice#android-device-web-view-option-selector) 的 [AndroidWebView](/api/class-androidwebview) 打开并返回它。如果已经有一个打开的匹配 [`selector`](/api/class-androiddevice#android-device-web-view-option-selector) 的 [AndroidWebView](/api/class-androidwebview)，则立即返回。

**参数**

- <a id="android-device-web-view-option-selector"></a>`selector` `Object`

  - `pkg` `string` *(可选)*

    可选的包标识符。
  - `socketName` `string` *(可选)*

    可选的 webview 套接字名称。
- <a id="android-device-web-view-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-device-web-view-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒），默认为 30 秒，传递 `0` 禁用超时。可以使用 [`androidDevice.setDefaultTimeout()`](/api/class-androiddevice#android-device-set-default-timeout) 方法更改默认值。

**返回值**

- `Promise<AndroidWebView>`


### androidDevice.webViews() {#android-device-web-views}

<Badge type="info" text="Added in: v1.9" />

当前打开的 WebView。

**返回值**

- `Array<AndroidWebView>`


## 属性

### androidDevice.input {#android-device-input}

<Badge type="info" text="Added in: v1.9" />

**类型**

- `AndroidInput`


## 事件

### androidDevice.on('close') {#android-device-event-close}

<Badge type="info" text="Added in: v1.28" />

当设备连接关闭时触发。

**事件数据**

- `AndroidDevice`


### androidDevice.on('webView') {#android-device-event-web-view}

<Badge type="info" text="Added in: v1.9" />

当检测到新的 WebView 实例时触发。

**事件数据**

- `AndroidWebView`
