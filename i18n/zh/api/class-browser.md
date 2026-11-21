---
title: Browser
outline: 2
---

# Browser

<Badge type="info" text="Added in: v1.8" />

Browser 是通过 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 创建的。使用 [Browser](/api/class-browser) 创建 [Page](/api/class-page) 的示例：

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

将浏览器绑定到命名管道或 Web Socket，使其可供其他客户端连接。

**参数**

- <a id="browser-bind-option-title"></a>`title` `string`

  浏览器服务器的标题，用于标识。
- <a id="browser-bind-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-bind-option-host"></a>`host` `string` *(可选)*

    绑定 Web Socket 服务器的主机。指定时，将创建 Web Socket 服务器而不是命名管道。
  - <a id="browser-bind-option-metadata"></a>`metadata` `Object<string, any>` *(可选)*

    与浏览器服务器关联的附加元数据。
  - <a id="browser-bind-option-port"></a>`port` `int` *(可选)*

    绑定 Web Socket 服务器的端口。指定时，将创建 Web Socket 服务器而不是命名管道。使用 `0` 让操作系统选��可用端口。
  - <a id="browser-bind-option-workspace-dir"></a>`workspaceDir` `string` *(可选)*

    与此浏览器服务器关联的工作目录。

**返回**

- `Promise<Object>`


### browser.browserType() {#browser-browser-type}

<Badge type="info" text="Added in: v1.23" />

获取浏览器所属的浏览器类型（chromium、firefox 或 webkit）。

**返回**

- `BrowserType`


### browser.close() {#browser-close}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

如果此浏览器是使用 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 获取的，则关闭浏览器及其所有页面（如果有打开的页面）。

如果此浏览器是连接的，则清除属于此浏览器的所有已创建上下文并断开与浏览器服务器的连接。

::: info
这类似于强制退出浏览器。要优雅地关闭页面并确保收到页面关闭事件，请在调用 [`browser.close()`](/api/class-browser#browser-close) **之前**，对使用 [`browser.newContext()`](/api/class-browser#browser-new-context) 显式创建的任何 [BrowserContext](/api/class-browsercontext) 实例调用 [`browserContext.close()`](/api/class-browsercontext#browser-context-close)。
:::

[Browser](/api/class-browser) 对象本身被视为已释放，不能再使用。

**参数**

- <a id="browser-close-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-close-option-reason"></a>`reason` `string` *(可选)* <Badge type="info" text="Added in: v1.40" />

    要报告给因浏览器关闭而中断的操作的原因。


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

**返回**

- `Array<BrowserContext>`


### browser.isConnected() {#browser-is-connected}

<Badge type="info" text="Added in: v1.8" />

指示浏览器是否已连接。

**返回**

- `boolean`


### browser.newBrowserCDPSession() {#browser-new-browser-cdp-session}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

::: info
CDP 会话仅在基于 Chromium 的浏览器上受支持。
:::

返回新创建的浏览器会话。

**返回**

- `Promise<CDPSession>`


### browser.newContext() {#browser-new-context}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

创建一个新的浏览器上下文。它不会与其他浏览器上下文共享 cookie/缓存。

::: info
如果直接使用此方法创建 [BrowserContext](/api/class-browsercontext)，最佳实践是在代码使用完 [BrowserContext](/api/class-browsercontext) 后，通过 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 显式关闭返回的上下文，并在调用 [`browser.close()`](/api/class-browser#browser-close) 之前执行此操作。这将确保 `context` 被优雅关闭，并且任何工件（如 HAR 和视频）都被完全刷新和保存。
:::

**用法**

```js
(async () => {
  const browser = await playwright.firefox.launch();  // 或 'chromium' 或 'webkit'。
  // 创建一个新的隐身浏览器上下文。
  const context = await browser.newContext();
  // 在干净的上下文中创建一个新页面。
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

    使用 [`page.goto()`](/api/class-page#page-goto)、[`page.route()`](/api/class-page#page-route)、[`page.waitForURL()`](/api/class-page#page-wait-for-url)、[`page.waitForRequest()`](/api/class-page#page-wait-for-request) 或 [`page.waitForResponse()`](/api/class-page#page-wait-for-response) 时，使用 [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数构建相应的 URL 时会考虑基础 URL。默认未设置。示例：
    * baseURL: `http://localhost:3000`，导航到 `/bar.html` 结果为 `http://localhost:3000/bar.html`
    * baseURL: `http://localhost:3000/foo/`，导航到 `./bar.html` 结果为 `http://localhost:3000/foo/bar.html`
    * baseURL: `http://localhost:3000/foo`（无尾部斜杠），导航到 `./bar.html` 结果为 `http://localhost:3000/bar.html`
  - <a id="browser-new-context-option-bypass-csp"></a>`bypassCSP` `boolean` *(可选)*

    切换绕过页面的内容安全策略。默认为 `false`。
  - <a id="browser-new-context-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(可选)*

    模拟 [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 媒体特性，支持的值为 `'light'` 和 `'dark'`。有关更多详细信息，请参阅 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 将模拟重置为系统默认值。默认为 `'light'`。
  - <a id="browser-new-context-option-device-scale-factor"></a>`deviceScaleFactor` `float` *(可选)*

    指定设备缩放因子（可以理解为 dpr）。默认为 `1`。了解更多关于[使用设备缩放因子模拟设备](../emulation.md#devices)。
  - <a id="browser-new-context-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(可选)*

    包含要与每个请求一起发送的附加 HTTP 头的对象。默认为无。
  - <a id="browser-new-context-option-geolocation"></a>`geolocation` `Object` *(可选)*

    - `latitude` `float`

      纬度，介于 -90 和 90 之间。
    - `longitude` `float`

      经度，介于 -180 和 180 之间。
    - `accuracy` `float` *(可选)*

      非负精度值。默认为 `0`。
  - <a id="browser-new-context-option-has-touch"></a>`hasTouch` `boolean` *(可选)*

    指定视口是否支持触摸事件。默认为 false。了解更多关于[移动端模拟](../emulation.md#devices)。
  - <a id="browser-new-context-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)*

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="browser-new-context-option-is-mobile"></a>`isMobile` `boolean` *(可选)*

    是否考虑 `meta viewport` 标签并启用触摸事件。isMobile 是设备的一部分，因此您实际上不需要手动设置它。默认为 `false`。了解更多关于[移动端模拟](../emulation.md#ismobile)。
  - <a id="browser-new-context-option-java-script-enabled"></a>`javaScriptEnabled` `boolean` *(可选)*

    是否在上下文中启用 JavaScript。默认为 `true`。了解更多关于[禁用 JavaScript](../emulation.md#javascript-enabled)。
  - <a id="browser-new-context-option-locale"></a>`locale` `string` *(可选)*

    指定用户区域设置，例如 `en-GB`、`de-DE` 等。区域设置将影响 `navigator.language` 值、`Accept-Language` 请求头值以及数字和日期格式规则。默认为系统默认区域设置。在我们的[模拟指南](../emulation.md#locale--timezone)中了解更多关于模拟的信息。
  - <a id="browser-new-context-option-offline"></a>`offline` `boolean` *(可选)*

    是否模拟网络离线。默认为 `false`。了解更多关于[网络模拟](../emulation.md#offline)。
  - <a id="browser-new-context-option-permissions"></a>`permissions` `Array<string>` *(可选)*

    授予此上下文中所有页面的权限列表。有关更多详细信息，请参阅 [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions)。默认为无。
  - <a id="browser-new-context-option-record-har"></a>`recordHar` `Object` *(可选)*

    启用将所有页面的 [HAR](http://www.softwareishard.com/blog/har-12-spec) 记录到 `recordHar.path` 文件。如果未指定，则不记录 HAR。确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 以保存 HAR。

    - `path` `path`

      文件系统上写入 HAR 文件的路径。如果文件名以 `.zip` 结尾，默认使用 `content: 'attach'`。
    - `mode` `"full" | "minimal"` *(可选)*

      设置为 `minimal` 时，仅记录从 HAR 路由所需的信息。这会省略大小、时间、页面、cookie、安全性和其他从 HAR 重放时不使用的 HAR 信息类型。默认为 `full`。
  - <a id="browser-new-context-option-record-video"></a>`recordVideo` `Object` *(可选)*

    启用将所有页面的视频录制到 `recordVideo.dir` 目录。如果未指定，则不录制视频。确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 以保存视频。

    - `dir` `path` *(可选)*

      存放视频的目录路径。如果未指定，视频将存储在 `artifactsDir`（参见 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 选项）。
    - `size` `Object` *(可选)*

      录制视频的可选尺寸。如果未指定，大小将等于缩小以适应 800x800 的 `viewport`。如果未显式配置 `viewport`，视频大小默认为 800x450。如有必要，每个页面的实际图片将缩小以适应指定的大小。

      - `width` `int`

        视频帧宽度。
      - `height` `int`

        视频帧高度。
  - <a id="browser-new-context-option-storage-state"></a>`storageState` `path | Object` *(可选)*

    了解更多关于[存储状态和身份验证](../auth.md)。

    使用给定的存储状态填充上下文。此选项可用于使用通过 [`browserContext.storageState()`](/api/class-browsercontext#browser-context-storage-state) 获取的登录信息初始化上下文。

    - `cookies` `Array<Object>`

      为上下文设置的 Cookie

      - `name` `string`
      - `value` `string`
      - `domain` `string`

        域和路径是必需的。要使 cookie 也适用于所有子域，请在域前加上点，如：".example.com"
      - `path` `string`

        域和路径是必需的
      - `expires` `float`

        Unix 时间（秒）。
      - `httpOnly` `boolean`
      - `secure` `boolean`
      - `sameSite` `"Strict" | "Lax" | "None"`

        sameSite 标志
    - `origins` `Array<Object>`

      - `origin` `string`
      - `localStorage` `Array<Object>`

        为上下文设置的 localStorage

        - `name` `string`
        - `value` `string`
  - <a id="browser-new-context-option-timezone-id"></a>`timezoneId` `string` *(可选)*

    更改上下文的时区。有关支持的时区 ID 列表，请参阅 [ICU 的 metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)。默认为系统时区。
  - <a id="browser-new-context-option-user-agent"></a>`userAgent` `string` *(可选)*

    在此上下文中使用的特定用户代理。
  - <a id="browser-new-context-option-viewport"></a>`viewport` `null | Object` *(可选)*

    为每个页面模拟一致的视口。默认为 1280x720 视口。使用 `null` 禁用一致的视口模拟。了解更多关于[视口模拟](../emulation#viewport)。

    ::: info
    `null` 值选择退出默认预设，使视口取决于操作系统定义的宿主窗口大小。这使测试执行变得不确定。
    :::

    - `width` `int`

      页面宽度（像素）。
    - `height` `int`

      页面高度（像素）。

**返回**

- `Promise<BrowserContext>`


### browser.newPage() {#browser-new-page}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

在新的浏览器上下文中创建一个新页面。关闭此页面也将关闭上下文。

这是一个便捷 API，仅应用于单页场景和简短代码片段。生产代码和测试框架应显式创建 [`browser.newContext()`](/api/class-browser#browser-new-context)，然后创建 [`browserContext.newPage()`](/api/class-browsercontext#browser-context-new-page) 来控制它们的确切生命周期。

**参数**

- <a id="browser-new-page-option-options"></a>`options` `Object` *(可选)*

  参数与 [`browser.newContext()`](#browser-new-context) 相同。

**返回**

- `Promise<Page>`


### browser.removeAllListeners() {#browser-remove-all-listeners}

<Badge type="info" text="Added in: v1.47" /> <Badge type="tip" text="async" />

移除给定类型的所有监听器（如果未给定类型，则移除所有已注册的监听器）。允许等待异步监听器完成或忽略这些监听器的后续错误。

**参数**

- <a id="browser-remove-all-listeners-option-type"></a>`type` `string` *(可选)*
- <a id="browser-remove-all-listeners-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-remove-all-listeners-option-behavior"></a>`behavior` `"wait" | "ignoreErrors" | "default"` *(可选)*

    指定是否等待已运行的监听器以及如果它们抛出错误该怎么办：
    * `'default'` - 不等待当前监听器调用（如果有）完成，如果监听器抛出异常，可能导致未处理的错误
    * `'wait'` - 等待当前监听器调用（如果有）完成
    * `'ignoreErrors'` - 不等待当前监听器调用（如果有）完成，移除后监听器抛出的所有错误都会被静默捕获


### browser.startTracing() {#browser-start-tracing}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

::: info
此 API 控制 [Chromium Tracing](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool)，这是一个低级别的 chromium 特定调试工具。控制 [Playwright Tracing](../trace-viewer) 的 API 可以在[这里](./class-tracing)找到。
:::

您可以使用 [`browser.startTracing()`](/api/class-browser#browser-start-tracing) 和 [`browser.stopTracing()`](/api/class-browser#browser-stop-tracing) 创建一个可在 Chrome DevTools 性能面板中打开的跟踪文件。

**用法**

```js
await browser.startTracing(page, { path: 'trace.json' });
await page.goto('https://www.google.com');
await browser.stopTracing();
```

**参数**

- <a id="browser-start-tracing-option-page"></a>`page` `Page` *(可选)*

  可选，如果指定，跟踪将包含给定页面的截图。
- <a id="browser-start-tracing-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-start-tracing-option-categories"></a>`categories` `Array<string>` *(可选)*

    指定要使用的自定义类别，而不是默认类别。
  - <a id="browser-start-tracing-option-path"></a>`path` `path` *(可选)*

    写入跟踪文件的路径。
  - <a id="browser-start-tracing-option-screenshots"></a>`screenshots` `boolean` *(可选)*

    在跟踪中捕获截图。


### browser.stopTracing() {#browser-stop-tracing}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

::: info
此 API 控制 [Chromium Tracing](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool)，这是一个低级别的 chromium 特定调试工具。控制 [Playwright Tracing](../trace-viewer) 的 API 可以在[这里](./class-tracing)找到。
:::

返回包含跟踪数据的缓冲区。

**返回**

- `Promise<Buffer>`


### browser.unbind() {#browser-unbind}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

取消绑定之前使用 [`browser.bind()`](/api/class-browser#browser-bind) 绑定的浏览器服务器。


### browser.version() {#browser-version}

<Badge type="info" text="Added in: v1.8" />

返回浏览器版本。

**返回**

- `string`


## 事件

### browser.on('context') {#browser-event-context}

<Badge type="info" text="Added in: v1.60" />

当创建新的浏览器上下文时发出。

**事件数据**

- `BrowserContext`


### browser.on('disconnected') {#browser-event-disconnected}

<Badge type="info" text="Added in: v1.8" />

当 Browser 与浏览器应用程序断开连接时发出。这可能是由于以下原因之一：
* 浏览器应用程序已关闭或崩溃。
* 调用了 [`browser.close()`](/api/class-browser#browser-close) 方法。

**事件数据**

- `Browser`
