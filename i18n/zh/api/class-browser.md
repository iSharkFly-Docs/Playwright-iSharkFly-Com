---
title: Browser
outline: 2
---

# Browser

<Badge type="info" text="Added in: v1.8" />

Browser 通过 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 创建。以下是使用 [Browser](/api/class-browser) 创建 [Page](/api/class-page) 的示例：

```js
const { firefox } = require('playwright');  // 或 'chromium' 或 'webkit'。

(async () => {
  const browser = await firefox.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await browser.close();
})();
```

## 方法

### browser.bind() {#browser-bind}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

将浏览器绑定到命名管道或 WebSocket，使其可供其他客户端连接。

**参数**

- <a id="browser-bind-option-title"></a>`title` `string`

  浏览器服务器的标题，用于标识。
- <a id="browser-bind-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-bind-option-host"></a>`host` `string` *(可选)*

    绑定 WebSocket 服务器的主机。指定时，将创建 WebSocket 服务器而非命名管道。
  - <a id="browser-bind-option-metadata"></a>`metadata` `Object<string, any>` *(可选)*

    与浏览器服务器关联的额外元数据。
  - <a id="browser-bind-option-port"></a>`port` `int` *(可选)*

    绑定 WebSocket 服务器的端口。指定时，将创建 WebSocket 服务器而非命名管道。使用 `0` 让操作系统选择可用端口。
  - <a id="browser-bind-option-workspace-dir"></a>`workspaceDir` `string` *(可选)*

    与此浏览器服务器关联的工作目录。

**返回值**

- `Promise<Object>`


### browser.browserType() {#browser-browser-type}

<Badge type="info" text="Added in: v1.23" />

获取浏览器所属的浏览器类型（chromium、firefox 或 webkit）。

**返回值**

- `BrowserType`


### browser.close() {#browser-close}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

如果此浏览器是通过 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 获取的，则关闭浏览器及其所有页面（如果已打开）。

如果此浏览器是已连接的，则清除属于此浏览器的所有已创建上下文，并断开与浏览器服务器的连接。

::: info
这类似于强制退出浏览器。要优雅地关闭页面并确保收到页面关闭事件，请在调用 [`browser.close()`](/api/class-browser#browser-close) **之前**，对之前通过 [`browser.newContext()`](/api/class-browser#browser-new-context) 显式创建的任何 [BrowserContext](/api/class-browsercontext) 实例调用 [`browserContext.close()`](/api/class-browsercontext#browser-context-close)。
:::

[Browser](/api/class-browser) 对象本身被视为已释放，无法再使用。

**参数**

- <a id="browser-close-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-close-option-reason"></a>`reason` `string` *(可选)* <Badge type="info" text="Added in: v1.40" />

    要报告给被浏览器关闭中断的操作的原因。


### browser.contexts() {#browser-contexts}

<Badge type="info" text="Added in: v1.8" />

返回所有打开的浏览器上下文的数组。在新创建的浏览器中，这将返回零个浏览器上下文。

**用法**

```js
const browser = await pw.webkit.launch();
console.log(browser.contexts().length); // 输出 `0`

const context = await browser.newContext();
console.log(browser.contexts().length); // 输出 `1`
```

**返回值**

- `Array<BrowserContext>`


### browser.isConnected() {#browser-is-connected}

<Badge type="info" text="Added in: v1.8" />

指示浏览器是否已连接。

**返回值**

- `boolean`


### browser.newBrowserCDPSession() {#browser-new-browser-cdp-session}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

::: info
CDP 会话仅在基于 Chromium 的浏览器上受支持。
:::

返回新创建的浏览器会话。

**返回值**

- `Promise<CDPSession>`


### browser.newContext() {#browser-new-context}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

创建新的浏览器上下文。它不会与其他浏览器上下文共享 cookie/缓存。

::: info
如果直接使用此方法创建 [BrowserContext](/api/class-browsercontext)，最佳实践是在代码完成 [BrowserContext](/api/class-browsercontext) 使用后，通过 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 显式关闭返回的上下文，并在调用 [`browser.close()`](/api/class-browser#browser-close) 之前执行此操作。这将确保 `context` 被优雅关闭，任何产物（如 HAR 和视频）都被完全刷新和保存。
:::

**用法**

```js
(async () => {
  const browser = await playwright.firefox.launch();  // 或 'chromium' 或 'webkit'。
  // 创建一个新的隐私浏览器上下文。
  const context = await browser.newContext();
  // 在干净的上下文中创建新页面。
  const page = await context.newPage();
  await page.goto('https://example.com');

  // 优雅地关闭所有内容
  await context.close();
  await browser.close();
})();
```

**参数**

- <a id="browser-new-context-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-new-context-option-accept-downloads"></a>`acceptDownloads` `boolean` *(可选)*

    是否自动下载所有附件。默认为 `true`，接受所有下载。
  - <a id="browser-new-context-option-base-url"></a>`baseURL` `string` *(可选)*

    当使用 [`page.goto()`](/api/class-page#page-goto)、[`page.route()`](/api/class-page#page-route)、[`page.waitForURL()`](/api/class-page#page-wait-for-url)、[`page.waitForRequest()`](/api/class-page#page-wait-for-request) 或 [`page.waitForResponse()`](/api/class-page#page-wait-for-response) 时，会使用 [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数构建相应的 URL 时考虑基础 URL。默认未设置。示例：
    * baseURL: `http://localhost:3000` 且导航到 `/bar.html` 结果为 `http://localhost:3000/bar.html`
    * baseURL: `http://localhost:3000/foo/` 且导航到 `./bar.html` 结果为 `http://localhost:3000/foo/bar.html`
    * baseURL: `http://localhost:3000/foo`（无尾部斜杠）且导航到 `./bar.html` 结果为 `http://localhost:3000/bar.html`
  - <a id="browser-new-context-option-bypass-csp"></a>`bypassCSP` `boolean` *(可选)*

    切换绕过页面的内容安全策略。默认为 `false`。
  - <a id="browser-new-context-option-client-certificates"></a>`clientCertificates` `Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.46" />

    TLS 客户端身份验证允许服务器请求客户端证书并进行验证。

    **详情**

    要使用的客户端证书数组。每个证书对象必须同时具有 `certPath` 和 `keyPath`，或单个 `pfxPath`，或其相应的直接值等效项（`cert` 和 `key`，或 `pfx`）。如果证书已加密，可选择提供 `passphrase` 属性。`origin` 属性应提供与证书有效的请求来源完全匹配的值。

    客户端证书身份验证仅在提供至少一个客户端证书时才处于活动状态。如果要拒绝服务器发送的所有客户端证书，需要提供一个 `origin` 与您计划访问的任何域都不匹配的客户端证书。

    ::: info
    在 macOS 上使用 WebKit 时，访问 `localhost` 不会选取客户端证书。您可以通过将 `localhost` 替换为 `local.playwright` 来使其正常工作。
    :::

    - `origin` `string` <Badge type="info" text="Added in: v1.46" />

      证书有效的确切来源。来源包括 `https` 协议、主机名和可选的端口。
    - `certPath` `path` *(可选)* <Badge type="info" text="Added in: v1.46" />

      PEM 格式证书文件的路径。
    - `cert` `Buffer` *(可选)* <Badge type="info" text="Added in: v1.46" />

      PEM 格式证书的直接值。
    - `keyPath` `path` *(可选)* <Badge type="info" text="Added in: v1.46" />

      PEM 格式私钥文件的路径。
    - `key` `Buffer` *(可选)* <Badge type="info" text="Added in: v1.46" />

      PEM 格式私钥的直接值。
    - `pfxPath` `path` *(可选)* <Badge type="info" text="Added in: v1.46" />

      PFX 或 PKCS12 编码的私钥和证书链文件的路径。
    - `pfx` `Buffer` *(可选)* <Badge type="info" text="Added in: v1.46" />

      PFX 或 PKCS12 编码的私钥和证书链的直接值。
    - `passphrase` `string` *(可选)* <Badge type="info" text="Added in: v1.46" />

      私钥的密码短语（PEM 或 PFX）。
  - <a id="browser-new-context-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(可选)*

    模拟 [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 媒体功能，支持的值为 `'light'` 和 `'dark'`。详见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 会将模拟重置为系统默认值。默认为 `'light'`。
  - <a id="browser-new-context-option-contrast"></a>`contrast` `null | "no-preference" | "more"` *(可选)*

    模拟 `'prefers-contrast'` 媒体功能，支持的值为 `'no-preference'`、`'more'`。详见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 会将模拟重置为系统默认值。默认为 `'no-preference'`。
  - <a id="browser-new-context-option-device-scale-factor"></a>`deviceScaleFactor` `float` *(可选)*

    指定设备缩放因子（可以理解为 dpr）。默认为 `1`。了解更多关于[使用设备缩放因子模拟设备](../emulation.md#devices)。
  - <a id="browser-new-context-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(可选)*

    包含要与每个请求一起发送的附加 HTTP 标头的对象。默认为无。
  - <a id="browser-new-context-option-forced-colors"></a>`forcedColors` `null | "active" | "none"` *(可选)*

    模拟 `'forced-colors'` 媒体功能，支持的值为 `'active'`、`'none'`。详见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 会将模拟重置为系统默认值。默认为 `'none'`。
  - <a id="browser-new-context-option-geolocation"></a>`geolocation` `Object` *(可选)*

    - `latitude` `float`

      纬度，介于 -90 和 90 之间。
    - `longitude` `float`

      经度，介于 -180 和 180 之间。
    - `accuracy` `float` *(可选)*

      非负精度值。默认为 `0`。
  - <a id="browser-new-context-option-has-touch"></a>`hasTouch` `boolean` *(可选)*

    指定视口是否支持触摸事件。默认为 false。了解更多关于[移动端模拟](../emulation.md#devices)。
  - <a id="browser-new-context-option-http-credentials"></a>`httpCredentials` `Object | Array<Object>` *(可选)*

    用于 [HTTP 身份验证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)的凭据。
    如果未指定来源，用户名和密码将在未授权响应时发送到任何服务器。

    传递数组以对不同来源使用不同的凭据。使用第一个与请求来源匹配的条目，没有来源的条目匹配任何请求。

    - `username` `string`
    - `password` `string`
    - `origin` `string` *(可选)*

      限制在特定来源（scheme://host:port）发送 http 凭据。
    - `send` `"unauthorized" | "always"` *(可选)*

      此选项仅适用于从相应的 [APIRequestContext](/api/class-apirequestcontext) 发送的请求，不影响从浏览器发送的请求。`'always'` - 带有基本身份验证凭据的 `Authorization` 标头将随每个 API 请求一起发送。`'unauthorized'` - 仅在收到带有 `WWW-Authenticate` 标头的 401（未授权）响应时才发送凭据。默认为 `'unauthorized'`。
  - <a id="browser-new-context-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="browser-new-context-option-is-mobile"></a>`isMobile` `boolean` *(可选)*

    是否考虑 `meta viewport` 标签并启用触摸事件。isMobile 是设备的一部分，因此您实际上不需要手动设置它。默认为 `false`。了解更多关于[移动端模拟](../emulation.md#ismobile)。
  - <a id="browser-new-context-option-java-script-enabled"></a>`javaScriptEnabled` `boolean` *(可选)*

    是否在上下文中启用 JavaScript。默认为 `true`。了解更多关于[禁用 JavaScript](../emulation.md#javascript-enabled)。
  - <a id="browser-new-context-option-locale"></a>`locale` `string` *(可选)*

    指定用户区域设置，例如 `en-GB`、`de-DE` 等。区域设置将影响 `navigator.language` 值、`Accept-Language` 请求标头值以及数字和日期格式规则。默认为系统默认区域设置。了解更多关于我们[模拟指南](../emulation.md#locale--timezone)中的模拟。
  - <a id="browser-new-context-option-locate-only-visible"></a>`locateOnlyVisible` `boolean` *(可选)*

    此上下文中的定位器是否仅查找[可见](../actionability.md#visible)元素。
    默认为 `false`。

    启用时，Playwright 应用两条规则：
    1. 定位器找到的元素必须是可见的。操作、断言和查询的行为就像在定位器链的末尾调用了 [`locator.visible()`](/api/class-locator#locator-visible)。
    1. [`locator.first()`](/api/class-locator#locator-first)、[`locator.last()`](/api/class-locator#locator-last) 和 [`locator.nth()`](/api/class-locator#locator-nth) 在可见元素中选择。它们的行为就像在它们之前立即调用了 [`locator.visible()`](/api/class-locator#locator-visible)。

    ```js
    // <div hidden>One</div> <div>Two</div> <div>Three</div>
    await expect(page.locator('div')).toHaveCount(2);
    await expect(page.locator('div').first()).toHaveText('Two');
    await expect(page.locator('div').last()).toHaveText('Three');
    ```

    显式的可见性过滤器始终具有优先级。Playwright 不会在已有过滤器的位置添加自己的过滤器。例如，`page.locator('div').filter({ visible: false }).first()` 查找第一个隐藏元素。

    定位器链的所有其他部分不会被过滤。在 `page.locator('section').getByRole('button')` 中，按钮必须是可见的，但 section 可以根据[可见性](../actionability.md#visible)规则是隐藏的，例如因为它的大小为零。同样适用于 [`locator.filter()`](/api/class-locator#locator-filter)、[`locator.and()`](/api/class-locator#locator-and) 和 [`locator.or()`](/api/class-locator#locator-or) 的内部定位器：只有第二条规则适用于它们。

    此选项不会更改 [`page.getByRole()`](/api/class-page#page-get-by-role) 的无障碍规则或基于选择器的方法（如 [`page.$()`](/api/class-page#page-query-selector)）的行为。
  - <a id="browser-new-context-option-logger"></a>`logger` `Logger` *(可选)*

    用于 Playwright 日志记录的日志接收器。
  - <a id="browser-new-context-option-offline"></a>`offline` `boolean` *(可选)*

    是否模拟网络离线。默认为 `false`。了解更多关于[网络模拟](../emulation.md#offline)。
  - <a id="browser-new-context-option-permissions"></a>`permissions` `Array<string>` *(可选)*

    要授予此上下文中所有页面的权限列表。详见 [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions)。默认为无。
  - <a id="browser-new-context-option-proxy"></a>`proxy` `Object` *(可选)*

    与此上下文一起使用的网络代理设置。默认为无。

    - `server` `string`

      用于所有请求的代理。支持 HTTP 和 SOCKS 代理，例如 `http://myproxy.com:3128` 或 `socks5://myproxy.com:3128`。简写形式 `myproxy.com:3128` 被视为 HTTP 代理。
    - `bypass` `string` *(可选)*

      可选的逗号分隔域名以绕过代理，例如 `".com, chromium.org, .domain.com"`。
    - `username` `string` *(可选)*

      如果 HTTP 代理需要身份验证时使用的可选用户名。
    - `password` `string` *(可选)*

      如果 HTTP 代理需要身份验证时使用的可选密码。
  - <a id="browser-new-context-option-record-har"></a>`recordHar` `Object` *(可选)*

    为所有页面启用 [HAR](http://www.softwareishard.com/blog/har-12-spec) 记录到 `recordHar.path` 文件。如果未指定，则不记录 HAR。确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 以保存 HAR。

    - `omitContent` `boolean` *(可选)*

      控制是否从 HAR 中省略请求内容的可选设置。默认为 `false`。已弃用，请改用 `content` 策略。
    - `content` `"omit" | "embed" | "attach"` *(可选)*

      控制资源内容管理的可选设置。如果指定 `omit`，则不持久化内容。如果指定 `attach`，则资源作为单独的文件或 ZIP 存档中的条目持久化。如果指定 `embed`，则内容按照 HAR 规范内联存储在 HAR 文件中。对于 `.zip` 输出文件默认为 `attach`，对于所有其他文件扩展名默认为 `embed`。
    - `path` `path`

      写入 HAR 文件的文件系统路径。如果文件名以 `.zip` 结尾，则默认使用 `content: 'attach'`。
    - `mode` `"full" | "minimal"` *(可选)*

      当设置为 `minimal` 时，仅记录从 HAR 路由所需的信息。这会省略大小、时间、页面、cookie、安全性和其他从 HAR 重放时不使用的 HAR 信息类型。默认为 `full`。
    - `urlFilter` `string | RegExp` *(可选)*

      用于过滤存储在 HAR 中的请求的 glob 或正则表达式模式。当通过上下文选项提供了 [`baseURL`](/api/class-browser#browser-new-context-option-base-url) 且传递的 URL 是路径时，它会通过 [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数合并。默认为无。
  - <a id="browser-new-context-option-record-video"></a>`recordVideo` `Object` *(可选)*

    为所有页面启用视频录制到 `recordVideo.dir` 目录。如果未指定，则不录制视频。确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 以保存视频。

    - `dir` `path` *(可选)*

      放置视频的目录路径。如果未指定，视频将存储在 `artifactsDir` 中（参见 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 选项）。
    - `size` `Object` *(可选)*

      录制视频的可选尺寸。如果未指定，大小将等于 `viewport` 缩小以适应 800x800。如果未显式配置 `viewport`，视频大小默认为 800x450。如果需要，每个页面的实际图片将按比例缩小以适应指定的大小。

      - `width` `int`

        视频帧宽度。
      - `height` `int`

        视频帧高度。
    - `fps` `int` *(可选)*

      录制视频的帧率，以每秒帧数为单位。默认为 `25`。Firefox 和 WebKit 目前最多捕获每秒 25 帧。
    - `showActions` `Object` *(可选)*

      如果指定，在视频录制期间对交互元素启用视觉注释。

      - `duration` `float` *(可选)*

        每个注释显示的持续时间（毫秒）。默认为 `500`。
      - `position` `"top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right"` *(可选)*

        操作标题覆盖层的位置。默认为 `"top-right"`。
      - `fontSize` `int` *(可选)*

        操作标题的字体大小（像素）。默认为 `24`。已弃用，请改用 `style.title`。
      - `cursor` `"none" | "pointer"` *(可选)*

        指针操作显示的光标装饰。`"pointer"`（默认）渲染一个从上一个操作点动画到下一个操作点的鼠标指针。`"none"` 禁用光标装饰。
      - `style` `Object` *(可选)*

        操作装饰的样式。

        - `point` `string` *(可选)*

          居中于操作点的零大小标记的 CSS 声明。省略时不显示。
        - `highlight` `string` *(可选)*

          覆盖目标元素的框的 CSS 声明。省略时不显示。
        - `title` `string` *(可选)*

          操作标题的 CSS 声明。
  - <a id="browser-new-context-option-reduced-motion"></a>`reducedMotion` `null | "reduce" | "no-preference"` *(可选)*

    模拟 `'prefers-reduced-motion'` 媒体功能，支持的值为 `'reduce'`、`'no-preference'`。详见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 会将模拟重置为系统默认值。默认为 `'no-preference'`。
  - <a id="browser-new-context-option-screen"></a>`screen` `Object` *(可选)*

    模拟网页内通过 `window.screen` 可用的一致窗口屏幕大小。仅在设置了 [`viewport`](/api/class-browser#browser-new-context-option-viewport) 时使用。

    - `width` `int`

      页面宽度（像素）。
    - `height` `int`

      页面高度（像素）。
  - <a id="browser-new-context-option-service-workers"></a>`serviceWorkers` `"allow" | "block"` *(可选)*

    是否允许站点注册 Service Worker。默认为 `'allow'`。
    * `'allow'`：可以注册 [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)。
    * `'block'`：Playwright 将阻止所有 Service Workers 的注册。
  - <a id="browser-new-context-option-storage-state"></a>`storageState` `path | Object` *(可选)*

    了解更多关于[存储状态和身份验证](../auth.md)。

    使用给定的存储状态填充上下文。此选项可用于使用通过 [`browserContext.storageState()`](/api/class-browsercontext#browser-context-storage-state) 获取的登录信息初始化上下文。

    - `cookies` `Array<Object>`

      要为上下文设置的 Cookie

      - `name` `string`
      - `value` `string`
      - `domain` `string`

        域名和路径是必需的。要使 cookie 也应用于所有子域，请在域名前加上点，如：".example.com"
      - `path` `string`

        域名和路径是必需的
      - `expires` `float`

        Unix 时间（秒）。
      - `httpOnly` `boolean`
      - `secure` `boolean`
      - `sameSite` `"Strict" | "Lax" | "None"`

        sameSite 标志
    - `origins` `Array<Object>`

      - `origin` `string`
      - `localStorage` `Array<Object>`

        要为上下文设置的 localStorage

        - `name` `string`
        - `value` `string`
  - <a id="browser-new-context-option-strict-selectors"></a>`strictSelectors` `boolean` *(可选)*

    如果设置为 true，则为此上下文启用严格选择器模式。在严格选择器模式下，当多个元素匹配选择器时，所有暗示单个目标 DOM 元素的选择器操作都会抛出异常。此选项不影响任何 Locator API（Locator 始终是严格的）。默认为 `false`。请参阅 [Locator](/api/class-locator) 了解更多关于严格模式的信息。
  - <a id="browser-new-context-option-timezone-id"></a>`timezoneId` `string` *(可选)*

    更改上下文的时区。有关支持的时区 ID 列表，请参阅 [ICU 的 metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)。默认为系统时区。
  - <a id="browser-new-context-option-user-agent"></a>`userAgent` `string` *(可选)*

    在此上下文中使用的特定用户代理。
  - <a id="browser-new-context-option-viewport"></a>`viewport` `null | Object` *(可选)*

    为每个页面模拟一致的视口。默认为 1280x720 视口。使用 `null` 禁用一致的视口模拟。了解更多关于[视口模拟](../emulation#viewport)。

    ::: info
    `null` 值选择退出默认预设，使视口依赖于操作系统定义的主机窗口大小。这会使测试的执行变得不确定。
    :::

    - `width` `int`

      页面宽度（像素）。
    - `height` `int`

      页面高度（像素）。

**返回值**

- `Promise<BrowserContext>`


### browser.newPage() {#browser-new-page}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

在新的浏览器上下文中创建新页面。关闭此页面也会关闭上下文。

这是一个便捷 API，仅应用于单页场景和简短代码片段。生产代码和测试框架应显式创建 [`browser.newContext()`](/api/class-browser#browser-new-context)，然后创建 [`browserContext.newPage()`](/api/class-browsercontext#browser-context-new-page) 以控制其确切的生命周期。

**参数**

- <a id="browser-new-page-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-new-page-option-accept-downloads"></a>`acceptDownloads` `boolean` *(可选)*

    是否自动下载所有附件。默认为 `true`，接受所有下载。
  - <a id="browser-new-page-option-base-url"></a>`baseURL` `string` *(可选)*

    当使用 [`page.goto()`](/api/class-page#page-goto)、[`page.route()`](/api/class-page#page-route)、[`page.waitForURL()`](/api/class-page#page-wait-for-url)、[`page.waitForRequest()`](/api/class-page#page-wait-for-request) 或 [`page.waitForResponse()`](/api/class-page#page-wait-for-response) 时，会使用 [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数构建相应的 URL 时考虑基础 URL。默认未设置。示例：
    * baseURL: `http://localhost:3000` 且导航到 `/bar.html` 结果为 `http://localhost:3000/bar.html`
    * baseURL: `http://localhost:3000/foo/` 且导航到 `./bar.html` 结果为 `http://localhost:3000/foo/bar.html`
    * baseURL: `http://localhost:3000/foo`（无尾部斜杠）且导航到 `./bar.html` 结果为 `http://localhost:3000/bar.html`
  - <a id="browser-new-page-option-bypass-csp"></a>`bypassCSP` `boolean` *(可选)*

    切换绕过页面的内容安全策略。默认为 `false`。
  - <a id="browser-new-page-option-client-certificates"></a>`clientCertificates` `Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.46" />

    TLS 客户端身份验证允许服务器请求客户端证书并进行验证。

    **详情**

    要使用的客户端证书数组。每个证书对象必须同时具有 `certPath` 和 `keyPath`，或单个 `pfxPath`，或其相应的直接值等效项（`cert` 和 `key`，或 `pfx`）。如果证书已加密，可选择提供 `passphrase` 属性。`origin` 属性应提供与证书有效的请求来源完全匹配的值。

    客户端证书身份验证仅在提供至少一个客户端证书时才处于活动状态。如果要拒绝服务器发送的所有客户端证书，需要提供一个 `origin` 与您计划访问的任何域都不匹配的客户端证书。

    ::: info
    在 macOS 上使用 WebKit 时，访问 `localhost` 不会选取客户端证书。您可以通过将 `localhost` 替换为 `local.playwright` 来使其正常工作。
    :::

    - `origin` `string` <Badge type="info" text="Added in: v1.46" />

      证书有效的确切来源。来源包括 `https` 协议、主机名和可选的端口。
    - `certPath` `path` *(可选)* <Badge type="info" text="Added in: v1.46" />

      PEM 格式证书文件的路径。
    - `cert` `Buffer` *(可选)* <Badge type="info" text="Added in: v1.46" />

      PEM 格式证书的直接值。
    - `keyPath` `path` *(可选)* <Badge type="info" text="Added in: v1.46" />

      PEM 格式私钥文件的路径。
    - `key` `Buffer` *(可选)* <Badge type="info" text="Added in: v1.46" />

      PEM 格式私钥的直接值。
    - `pfxPath` `path` *(可选)* <Badge type="info" text="Added in: v1.46" />

      PFX 或 PKCS12 编码的私钥和证书链文件的路径。
    - `pfx` `Buffer` *(可选)* <Badge type="info" text="Added in: v1.46" />

      PFX 或 PKCS12 编码的私钥和证书链的直接值。
    - `passphrase` `string` *(可选)* <Badge type="info" text="Added in: v1.46" />

      私钥的密码短语（PEM 或 PFX）。
  - <a id="browser-new-page-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(可选)*

    模拟 [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 媒体功能，支持的值为 `'light'` 和 `'dark'`。详见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 会将模拟重置为系统默认值。默认为 `'light'`。
  - <a id="browser-new-page-option-contrast"></a>`contrast` `null | "no-preference" | "more"` *(可选)*

    模拟 `'prefers-contrast'` 媒体功能，支持的值为 `'no-preference'`、`'more'`。详见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 会将模拟重置为系统默认值。默认为 `'no-preference'`。
  - <a id="browser-new-page-option-device-scale-factor"></a>`deviceScaleFactor` `float` *(可选)*

    指定设备缩放因子（可以理解为 dpr）。默认为 `1`。了解更多关于[使用设备缩放因子模拟设备](../emulation.md#devices)。
  - <a id="browser-new-page-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(可选)*

    包含要与每个请求一起发送的附加 HTTP 标头的对象。默认为无。
  - <a id="browser-new-page-option-forced-colors"></a>`forcedColors` `null | "active" | "none"` *(可选)*

    模拟 `'forced-colors'` 媒体功能，支持的值为 `'active'`、`'none'`。详见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 会将模拟重置为系统默认值。默认为 `'none'`。
  - <a id="browser-new-page-option-geolocation"></a>`geolocation` `Object` *(可选)*

    - `latitude` `float`

      纬度，介于 -90 和 90 之间。
    - `longitude` `float`

      经度，介于 -180 和 180 之间。
    - `accuracy` `float` *(可选)*

      非负精度值。默认为 `0`。
  - <a id="browser-new-page-option-has-touch"></a>`hasTouch` `boolean` *(可选)*

    指定视口是否支持触摸事件。默认为 false。了解更多关于[移动端模拟](../emulation.md#devices)。
  - <a id="browser-new-page-option-http-credentials"></a>`httpCredentials` `Object | Array<Object>` *(可选)*

    用于 [HTTP 身份验证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)的凭据。
    如果未指定来源，用户名和密码将在未授权响应时发送到任何服务器。

    传递数组以对不同来源使用不同的凭据。使用第一个与请求来源匹配的条目，没有来源的条目匹配任何请求。

    - `username` `string`
    - `password` `string`
    - `origin` `string` *(可选)*

      限制在特定来源（scheme://host:port）发送 http 凭据。
    - `send` `"unauthorized" | "always"` *(可选)*

      此选项仅适用于从相应的 [APIRequestContext](/api/class-apirequestcontext) 发送的请求，不影响从浏览器发送的请求。`'always'` - 带有基本身份验证凭据的 `Authorization` 标头将随每个 API 请求一起发送。`'unauthorized'` - 仅在收到带有 `WWW-Authenticate` 标头的 401（未授权）响应时才发送凭据。默认为 `'unauthorized'`。
  - <a id="browser-new-page-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="browser-new-page-option-is-mobile"></a>`isMobile` `boolean` *(可选)*

    是否考虑 `meta viewport` 标签并启用触摸事件。isMobile 是设备的一部分，因此您实际上不需要手动设置它。默认为 `false`。了解更多关于[移动端模拟](../emulation.md#ismobile)。
  - <a id="browser-new-page-option-java-script-enabled"></a>`javaScriptEnabled` `boolean` *(可选)*

    是否在上下文中启用 JavaScript。默认为 `true`。了解更多关于[禁用 JavaScript](../emulation.md#javascript-enabled)。
  - <a id="browser-new-page-option-locale"></a>`locale` `string` *(可选)*

    指定用户区域设置，例如 `en-GB`、`de-DE` 等。区域设置将影响 `navigator.language` 值、`Accept-Language` 请求标头值以及数字和日期格式规则。默认为系统默认区域设置。了解更多关于我们[模拟指南](../emulation.md#locale--timezone)中的模拟。
  - <a id="browser-new-page-option-locate-only-visible"></a>`locateOnlyVisible` `boolean` *(可选)*

    此上下文中的定位器是否仅查找[可见](../actionability.md#visible)元素。
    默认为 `false`。

    启用时，Playwright 应用两条规则：
    1. 定位器找到的元素必须是可见的。操作、断言和查询的行为就像在定位器链的末尾调用了 [`locator.visible()`](/api/class-locator#locator-visible)。
    1. [`locator.first()`](/api/class-locator#locator-first)、[`locator.last()`](/api/class-locator#locator-last) 和 [`locator.nth()`](/api/class-locator#locator-nth) 在可见元素中选择。它们的行为就像在它们之前立即调用了 [`locator.visible()`](/api/class-locator#locator-visible)。

    ```js
    // <div hidden>One</div> <div>Two</div> <div>Three</div>
    await expect(page.locator('div')).toHaveCount(2);
    await expect(page.locator('div').first()).toHaveText('Two');
    await expect(page.locator('div').last()).toHaveText('Three');
    ```

    显式的可见性过滤器始终具有优先级。Playwright 不会在已有过滤器的位置添加自己的过滤器。例如，`page.locator('div').filter({ visible: false }).first()` 查找第一个隐藏元素。

    定位器链的所有其他部分不会被过滤。在 `page.locator('section').getByRole('button')` 中，按钮必须是可见的，但 section 可以根据[可见性](../actionability.md#visible)规则是隐藏的，例如因为它的大小为零。同样适用于 [`locator.filter()`](/api/class-locator#locator-filter)、[`locator.and()`](/api/class-locator#locator-and) 和 [`locator.or()`](/api/class-locator#locator-or) 的内部定位器：只有第二条规则适用于它们。

    此选项不会更改 [`page.getByRole()`](/api/class-page#page-get-by-role) 的无障碍规则或基于选择器的方法（如 [`page.$()`](/api/class-page#page-query-selector)）的行为。
  - <a id="browser-new-page-option-logger"></a>`logger` `Logger` *(可选)*

    用于 Playwright 日志记录的日志接收器。
  - <a id="browser-new-page-option-offline"></a>`offline` `boolean` *(可选)*

    是否模拟网络离线。默认为 `false`。了解更多关于[网络模拟](../emulation.md#offline)。
  - <a id="browser-new-page-option-permissions"></a>`permissions` `Array<string>` *(可选)*

    要授予此上下文中所有页面的权限列表。详见 [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions)。默认为无。
  - <a id="browser-new-page-option-proxy"></a>`proxy` `Object` *(可选)*

    与此上下文一起使用的网络代理设置。默认为无。

    - `server` `string`

      用于所有请求的代理。支持 HTTP 和 SOCKS 代理，例如 `http://myproxy.com:3128` 或 `socks5://myproxy.com:3128`。简写形式 `myproxy.com:3128` 被视为 HTTP 代理。
    - `bypass` `string` *(可选)*

      可选的逗号分隔域名以绕过代理，例如 `".com, chromium.org, .domain.com"`。
    - `username` `string` *(可选)*

      如果 HTTP 代理需要身份验证时使用的可选用户名。
    - `password` `string` *(可选)*

      如果 HTTP 代理需要身份验证时使用的可选密码。
  - <a id="browser-new-page-option-record-har"></a>`recordHar` `Object` *(可选)*

    为所有页面启用 [HAR](http://www.softwareishard.com/blog/har-12-spec) 记录到 `recordHar.path` 文件。如果未指定，则不记录 HAR。确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 以保存 HAR。

    - `omitContent` `boolean` *(可选)*

      控制是否从 HAR 中省略请求内容的可选设置。默认为 `false`。已弃用，请改用 `content` 策略。
    - `content` `"omit" | "embed" | "attach"` *(可选)*

      控制资源内容管理的可选设置。如果指定 `omit`，则不持久化内容。如果指定 `attach`，则资源作为单独的文件或 ZIP 存档中的条目持久化。如果指定 `embed`，则内容按照 HAR 规范内联存储在 HAR 文件中。对于 `.zip` 输出文件默认为 `attach`，对于所有其他文件扩展名默认为 `embed`。
    - `path` `path`

      写入 HAR 文件的文件系统路径。如果文件名以 `.zip` 结尾，则默认使用 `content: 'attach'`。
    - `mode` `"full" | "minimal"` *(可选)*

      当设置为 `minimal` 时，仅记录从 HAR 路由所需的信息。这会省略大小、时间、页面、cookie、安全性和其他从 HAR 重放时不使用的 HAR 信息类型。默认为 `full`。
    - `urlFilter` `string | RegExp` *(可选)*

      用于过滤存储在 HAR 中的请求的 glob 或正则表达式模式。当通过上下文选项提供了 [`baseURL`](/api/class-browser#browser-new-context-option-base-url) 且传递的 URL 是路径时，它会通过 [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数合并。默认为无。
  - <a id="browser-new-page-option-record-video"></a>`recordVideo` `Object` *(可选)*

    为所有页面启用视频录制到 `recordVideo.dir` 目录。如果未指定，则不录制视频。确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 以保存视频。

    - `dir` `path` *(可选)*

      放置视频的目录路径。如果未指定，视频将存储在 `artifactsDir` 中（参见 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 选项）。
    - `size` `Object` *(可选)*

      录制视频的可选尺寸。如果未指定，大小将等于 `viewport` 缩小以适应 800x800。如果未显式配置 `viewport`，视频大小默认为 800x450。如果需要，每个页面的实际图片将按比例缩小以适应指定的大小。

      - `width` `int`

        视频帧宽度。
      - `height` `int`

        视频帧高度。
    - `fps` `int` *(可选)*

      录制视频的帧率，以每秒帧数为单位。默认为 `25`。Firefox 和 WebKit 目前最多捕获每秒 25 帧。
    - `showActions` `Object` *(可选)*

      如果指定，在视频录制期间对交互元素启用视觉注释。

      - `duration` `float` *(可选)*

        每个注释显示的持续时间（毫秒）。默认为 `500`。
      - `position` `"top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right"` *(可选)*

        操作标题覆盖层的位置。默认为 `"top-right"`。
      - `fontSize` `int` *(可选)*

        操作标题的字体大小（像素）。默认为 `24`。已弃用，请改用 `style.title`。
      - `cursor` `"none" | "pointer"` *(可选)*

        指针操作显示的光标装饰。`"pointer"`（默认）渲染一个从上一个操作点动画到下一个操作点的鼠标指针。`"none"` 禁用光标装饰。
      - `style` `Object` *(可选)*

        操作装饰的样式。

        - `point` `string` *(可选)*

          居中于操作点的零大小标记的 CSS 声明。省略时不显示。
        - `highlight` `string` *(可选)*

          覆盖目标元素的框的 CSS 声明。省略时不显示。
        - `title` `string` *(可选)*

          操作标题的 CSS 声明。
  - <a id="browser-new-page-option-reduced-motion"></a>`reducedMotion` `null | "reduce" | "no-preference"` *(可选)*

    模拟 `'prefers-reduced-motion'` 媒体功能，支持的值为 `'reduce'`、`'no-preference'`。详见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 会将模拟重置为系统默认值。默认为 `'no-preference'`。
  - <a id="browser-new-page-option-screen"></a>`screen` `Object` *(可选)*

    模拟网页内通过 `window.screen` 可用的一致窗口屏幕大小。仅在设置了 [`viewport`](/api/class-browser#browser-new-page-option-viewport) 时使用。

    - `width` `int`

      页面宽度（像素）。
    - `height` `int`

      页面高度（像素）。
  - <a id="browser-new-page-option-service-workers"></a>`serviceWorkers` `"allow" | "block"` *(可选)*

    是否允许站点注册 Service Worker。默认为 `'allow'`。
    * `'allow'`：可以注册 [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)。
    * `'block'`：Playwright 将阻止所有 Service Workers 的注册。
  - <a id="browser-new-page-option-storage-state"></a>`storageState` `path | Object` *(可选)*

    了解更多关于[存储状态和身份验证](../auth.md)。

    使用给定的存储状态填充上下文。此选项可用于使用通过 [`browserContext.storageState()`](/api/class-browsercontext#browser-context-storage-state) 获取的登录信息初始化上下文。

    - `cookies` `Array<Object>`

      要为上下文设置的 Cookie

      - `name` `string`
      - `value` `string`
      - `domain` `string`

        域名和路径是必需的。要使 cookie 也应用于所有子域，请在域名前加上点，如：".example.com"
      - `path` `string`

        域名和路径是必需的
      - `expires` `float`

        Unix 时间（秒）。
      - `httpOnly` `boolean`
      - `secure` `boolean`
      - `sameSite` `"Strict" | "Lax" | "None"`

        sameSite 标志
    - `origins` `Array<Object>`

      - `origin` `string`
      - `localStorage` `Array<Object>`

        要为上下文设置的 localStorage

        - `name` `string`
        - `value` `string`
  - <a id="browser-new-page-option-strict-selectors"></a>`strictSelectors` `boolean` *(可选)*

    如果设置为 true，则为此上下文启用严格选择器模式。在严格选择器模式下，当多个元素匹配选择器时，所有暗示单个目标 DOM 元素的选择器操作都会抛出异常。此选项不影响任何 Locator API（Locator 始终是严格的）。默认为 `false`。请参阅 [Locator](/api/class-locator) 了解更多关于严格模式的信息。
  - <a id="browser-new-page-option-timezone-id"></a>`timezoneId` `string` *(可选)*

    更改上下文的时区。有关支持的时区 ID 列表，请参阅 [ICU 的 metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)。默认为系统时区。
  - <a id="browser-new-page-option-user-agent"></a>`userAgent` `string` *(可选)*

    在此上下文中使用的特定用户代理。
  - <a id="browser-new-page-option-viewport"></a>`viewport` `null | Object` *(可选)*

    为每个页面模拟一致的视口。默认为 1280x720 视口。使用 `null` 禁用一致的视口模拟。了解更多关于[视口模拟](../emulation#viewport)。

    ::: info
    `null` 值选择退出默认预设，使视口依赖于操作系统定义的主机窗口大小。这会使测试的执行变得不确定。
    :::

    - `width` `int`

      页面宽度（像素）。
    - `height` `int`

      页面高度（像素）。

**返回值**

- `Promise<Page>`


### browser.removeAllListeners() {#browser-remove-all-listeners}

<Badge type="info" text="Added in: v1.47" /> <Badge type="tip" text="async" />

移除给定类型的所有监听器（如果未给定类型，则移除所有已注册的监听器）。
允许等待异步监听器完成或忽略这些监听器的后续错误。

**参数**

- <a id="browser-remove-all-listeners-option-type"></a>`type` `string` *(可选)*
- <a id="browser-remove-all-listeners-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-remove-all-listeners-option-behavior"></a>`behavior` `"wait" | "ignoreErrors" | "default"` *(可选)*

    指定是否等待已运行的监听器以及如果它们抛出错误该怎么办：
    * `'default'` - 不等待当前监听器调用（如果有）完成，如果监听器抛出异常，可能会导致未处理的错误
    * `'wait'` - 等待当前监听器调用（如果有）完成
    * `'ignoreErrors'` - 不等待当前监听器调用（如果有）完成，移除后监听器抛出的所有错误都会被静默捕获


### browser.startTracing() {#browser-start-tracing}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

::: info
此 API 控制 [Chromium 跟踪](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool)，这是一个低级别的 chromium 特定调试工具。控制 [Playwright 跟踪](../trace-viewer) 的 API 可以在[这里](./class-tracing)找到。
:::

您可以使用 [`browser.startTracing()`](/api/class-browser#browser-start-tracing) 和 [`browser.stopTracing()`](/api/class-browser#browser-stop-tracing) 创建可在 Chrome DevTools 性能面板中打开的跟踪文件。

**用法**

```js
await browser.startTracing(page, { path: 'trace.json' });
await page.goto('https://www.google.com');
await browser.stopTracing();
```

**参数**

- <a id="browser-start-tracing-option-page"></a>`page` `Page` *(可选)*

  可选，如果指定，跟踪将包含给定页面的屏幕截图。
- <a id="browser-start-tracing-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-start-tracing-option-categories"></a>`categories` `Array<string>` *(可选)*

    指定自定义类别以代替默认类别。
  - <a id="browser-start-tracing-option-path"></a>`path` `path` *(可选)*

    写入跟踪文件的路径。
  - <a id="browser-start-tracing-option-screenshots"></a>`screenshots` `boolean` *(可选)*

    在跟踪中捕获屏幕截图。


### browser.stopTracing() {#browser-stop-tracing}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

::: info
此 API 控制 [Chromium 跟踪](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool)，这是一个低级别的 chromium 特定调试工具。控制 [Playwright 跟踪](../trace-viewer) 的 API 可以在[这里](./class-tracing)找到。
:::

返回包含跟踪数据的缓冲区。

**返回值**

- `Promise<Buffer>`


### browser.unbind() {#browser-unbind}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

解绑之前通过 [`browser.bind()`](/api/class-browser#browser-bind) 绑定的浏览器服务器。


### browser.version() {#browser-version}

<Badge type="info" text="Added in: v1.8" />

返回浏览器版本。

**返回值**

- `string`


## 事件

### browser.on('context') {#browser-event-context}

<Badge type="info" text="Added in: v1.60" />

当创建新的浏览器上下文时触发。

**事件数据**

- `BrowserContext`


### browser.on('disconnected') {#browser-event-disconnected}

<Badge type="info" text="Added in: v1.8" />

当 Browser 与浏览器应用程序断开连接时触发。这可能由于以下原因之一发生：
* 浏览器应用程序已关闭或崩溃。
* 调用了 [`browser.close()`](/api/class-browser#browser-close) 方法。

**事件数据**

- `Browser`
