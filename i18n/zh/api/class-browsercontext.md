---
title: BrowserContext
outline: 2
---

# BrowserContext

<Badge type="info" text="Added in: v1.8" />

BrowserContext 提供了一种操作多个独立浏览器会话的方式。

如果一个页面打开另一个页面，例如通过 `window.open` 调用，弹出窗口将属于父页面的浏览器上下文。

Playwright 允许使用 [`browser.newContext()`](/api/class-browser#browser-new-context) 方法创建隔离的非持久化浏览器上下文。非持久化浏览器上下文不会将任何浏览数据写入磁盘。

```js
// 创建一个新的隐身浏览器上下文
const context = await browser.newContext();
// 在上下文中创建一个新页面
const page = await context.newPage();
await page.goto('https://example.com');
// 当不再需要时释放上下文
await context.close();
```

## 方法

### browserContext.addCookies() {#browser-context-add-cookies}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

向此浏览器上下文添加 cookies。此上下文中的所有页面都将安装这些 cookies。可以通过 [`browserContext.cookies()`](/api/class-browsercontext#browser-context-cookies) 获取 cookies。

**用法**

```js
await browserContext.addCookies([cookieObject1, cookieObject2]);
```

**参数**

- <a id="browser-context-add-cookies-option-cookies"></a>`cookies` `Array<Object>`

  - `name` `string`
  - `value` `string`
  - `url` `string` *(可选)*

    需要 `url` 或同时提供 `domain` 和 `path`。可选。
  - `domain` `string` *(可选)*

    要使 cookie 同时应用于所有子域，请在域名前加点，如：".example.com"。需要 `url` 或同时提供 `domain` 和 `path`。可选。
  - `path` `string` *(可选)*

    需要 `url` 或同时提供 `domain` 和 `path`。可选。
  - `expires` `float` *(可选)*

    Unix 时间戳（秒）。可选。
  - `httpOnly` `boolean` *(可选)*

    可选。
  - `secure` `boolean` *(可选)*

    可选。
  - `sameSite` `"Strict" | "Lax" | "None"` *(可选)*

    可选。
  - `partitionKey` `string` *(可选)*

    用于分区的第三方 cookies（即 [CHIPS](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies)）的分区键。可选。


### browserContext.addInitScript() {#browser-context-add-init-script}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

添加一个将在以下场景中执行的脚本：
* 每当在浏览器上下文中创建或导航页面时。
* 每当在浏览器上下文中任何页面的子框架被附加或导航时。在这种情况下，脚本在新附加框架的上下文中执行。

脚本在文档创建之后但在其任何脚本运行之前执行。这对于修改 JavaScript 环境很有用，例如为 `Math.random` 设置种子。

**用法**

在页面加载之前覆盖 `Math.random` 的示例：

```js
// preload.js
Math.random = () => 42;
```

```js
// 在您的 playwright 脚本中，假设 preload.js 文件在同一目录中
await browserContext.addInitScript({
  path: 'preload.js'
});
```

::: info
通过 [`browserContext.addInitScript()`](/api/class-browsercontext#browser-context-add-init-script) 和 [`page.addInitScript()`](/api/class-page#page-add-init-script) 安装的多个脚本的执行顺序是未定义的。
:::

**参数**

- <a id="browser-context-add-init-script-option-script"></a>`script` `function() | string | Object`

  要在浏览器上下文中所有页面执行的脚本。

  - `path` `path` *(可选)*

    JavaScript 文件的路径。如果 `path` 是相对路径，则相对于当前工作目录解析。可选。
  - `content` `string` *(可选)*

    原始脚本内容。可选。
- <a id="browser-context-add-init-script-option-arg"></a>`arg` `Serializable` *(可选)*

  传递给 [`script`](/api/class-browsercontext#browser-context-add-init-script-option-script) 的可选参数（仅在传递函数时支持）。
- <a id="browser-context-add-init-script-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-context-add-init-script-option-expose-functions"></a>`exposeFunctions` `boolean` *(可选)* <Badge type="info" text="Added in: v1.62" />

    当设置为 `true` 时，在 [`arg`](/api/class-browsercontext#browser-context-add-init-script-option-arg) 中传递的函数会在页面中暴露，可以从初始化脚本中调用。调用时返回其结果的 [Promise]。底层实现是通过 [`page.exposeFunction()`](/api/class-page#page-expose-function) 暴露每个函数，因此技术上可以从页面的所有框架访问。与传递给 [`page.evaluate()`](/api/class-page#page-evaluate) 的函数不同，传递给初始化脚本的函数在每个新文档中都会暴露，因此它们在导航后仍然有效。默认为 `false`，在这种情况下函数不可序列化且会被静默丢弃。

**返回值**

- `Promise<Disposable>`


### browserContext.browser() {#browser-context-browser}

<Badge type="info" text="Added in: v1.8" />

获取拥有此上下文的浏览器实例。如果上下文是在正常浏览器之外创建的（例如 Android 或 Electron），则返回 `null`。

**返回值**

- `null | Browser`


### browserContext.clearCookies() {#browser-context-clear-cookies}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

从上下文中删除 cookies。接受可选的过滤器。

**用法**

```js
await context.clearCookies();
await context.clearCookies({ name: 'session-id' });
await context.clearCookies({ domain: 'my-origin.com' });
await context.clearCookies({ domain: /.*my-origin\.com/ });
await context.clearCookies({ path: '/api/v1' });
await context.clearCookies({ name: 'session-id', domain: 'my-origin.com' });
```

**参数**

- <a id="browser-context-clear-cookies-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-context-clear-cookies-option-domain"></a>`domain` `string | RegExp` *(可选)* <Badge type="info" text="Added in: v1.43" />

    仅删除具有给定域的 cookies。
  - <a id="browser-context-clear-cookies-option-name"></a>`name` `string | RegExp` *(可选)* <Badge type="info" text="Added in: v1.43" />

    仅删除具有给定名称的 cookies。
  - <a id="browser-context-clear-cookies-option-path"></a>`path` `string | RegExp` *(可选)* <Badge type="info" text="Added in: v1.43" />

    仅删除具有给定路径的 cookies。


### browserContext.clearPermissions() {#browser-context-clear-permissions}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

清除浏览器上下文的所有权限覆盖。

**用法**

```js
const context = await browser.newContext();
await context.grantPermissions(['clipboard-read']);
// 执行操作...
context.clearPermissions();
```


### browserContext.close() {#browser-context-close}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

关闭浏览器上下文。属于该浏览器上下文的所有页面都将被关闭。

::: info
默认浏览器上下文无法关闭。
:::

**参数**

- <a id="browser-context-close-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-context-close-option-reason"></a>`reason` `string` *(可选)* <Badge type="info" text="Added in: v1.40" />

    报告给因上下文关闭而中断的操作的原因。


### browserContext.cookies() {#browser-context-cookies}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

如果未指定 URL，此方法返回所有 cookies。如果指定了 URL，则仅返回影响这些 URL 的 cookies。

**参数**

- <a id="browser-context-cookies-option-urls"></a>`urls` `string | Array<string>` *(可选)*

  可选的 URL 列表。

**返回值**

- `Promise<Array<Object>>`


### browserContext.exposeBinding() {#browser-context-expose-binding}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

此方法在上下文中每个页面的每个框架的 `window` 对象上添加一个名为 [`name`](/api/class-browsercontext#browser-context-expose-binding-option-name) 的函数。调用时，该函数执行 [`callback`](/api/class-browsercontext#browser-context-expose-binding-option-callback) 并返回一个 [Promise]，解析为 [`callback`](/api/class-browsercontext#browser-context-expose-binding-option-callback) 的返回值。如果 [`callback`](/api/class-browsercontext#browser-context-expose-binding-option-callback) 返回一个 [Promise]，则会等待它。

[`callback`](/api/class-browsercontext#browser-context-expose-binding-option-callback) 函数的第一个参数包含调用者的信息：`{ browserContext: BrowserContext, page: Page, frame: Frame }`。

有关仅限页面的版本，请参阅 [`page.exposeBinding()`](/api/class-page#page-expose-binding)。

**用法**

向上下文中所有页面的所有框架暴露页面 URL 的示例：

```js
const { webkit } = require('playwright');  // 或 'chromium' 或 'firefox'

(async () => {
  const browser = await webkit.launch({ headless: false });
  const context = await browser.newContext();
  await context.exposeBinding('pageURL', ({ page }) => page.url());
  const page = await context.newPage();
  await page.setContent(`
    <script>
      async function onClick() {
        document.querySelector('div').textContent = await window.pageURL();
      }
    </script>
    <button onclick="onClick()">点击我</button>
    <div></div>
  `);
  await page.getByRole('button').click();
})();
```

**参数**

- <a id="browser-context-expose-binding-option-name"></a>`name` `string`

  window 对象上的函数名称。
- <a id="browser-context-expose-binding-option-callback"></a>`callback` `function()`

  将在 Playwright 上下文中调用的回调函数。

**返回值**

- `Promise<Disposable>`


### browserContext.exposeFunction() {#browser-context-expose-function}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

此方法在上下文中每个页面的每个框架的 `window` 对象上添加一个名为 [`name`](/api/class-browsercontext#browser-context-expose-function-option-name) 的函数。调用时，该函数执行 [`callback`](/api/class-browsercontext#browser-context-expose-function-option-callback) 并返回一个 [Promise]，解析为 [`callback`](/api/class-browsercontext#browser-context-expose-function-option-callback) 的返回值。

如果 [`callback`](/api/class-browsercontext#browser-context-expose-function-option-callback) 返回一个 [Promise]，则会等待它。

有关仅限页面的版本，请参阅 [`page.exposeFunction()`](/api/class-page#page-expose-function)。

**用法**

向上下文中所有页面添加 `sha256` 函数的示例：

```js
const { webkit } = require('playwright');  // 或 'chromium' 或 'firefox'
const crypto = require('crypto');

(async () => {
  const browser = await webkit.launch({ headless: false });
  const context = await browser.newContext();
  await context.exposeFunction('sha256', text =>
    crypto.createHash('sha256').update(text).digest('hex'),
  );
  const page = await context.newPage();
  await page.setContent(`
    <script>
      async function onClick() {
        document.querySelector('div').textContent = await window.sha256('PLAYWRIGHT');
      }
    </script>
    <button onclick="onClick()">点击我</button>
    <div></div>
  `);
  await page.getByRole('button').click();
})();
```

**参数**

- <a id="browser-context-expose-function-option-name"></a>`name` `string`

  window 对象上的函数名称。
- <a id="browser-context-expose-function-option-callback"></a>`callback` `function()`

  将在 Playwright 上下文中调用的回调函数。

**返回值**

- `Promise<Disposable>`


### browserContext.grantPermissions() {#browser-context-grant-permissions}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

向浏览器上下文授予指定的权限。如果指定了来源，则仅向给定来源授予相应的权限。

**参数**

- <a id="browser-context-grant-permissions-option-permissions"></a>`permissions` `Array<string>`

  要授予的权限列表。

  ::: danger
  不同浏览器支持的权限不同，即使是同一浏览器的不同版本也可能不同。任何权限都可能在更新后停止工作。
  :::

  以下是一些可能被某些浏览器支持的权限：
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
  * `'midi-sysex'`（系统专用 midi）
  * `'midi'`
  * `'notifications'`
  * `'payment-handler'`
  * `'storage-access'`
  * `'screen-wake-lock'`
- <a id="browser-context-grant-permissions-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-context-grant-permissions-option-origin"></a>`origin` `string` *(可选)*

    要授予权限的 [origin]，例如 "https://example.com"。


### browserContext.isClosed() {#browser-context-is-closed}

<Badge type="info" text="Added in: v1.59" />

指示浏览器上下文正在关闭过程中或已经关闭。

**返回值**

- `boolean`


### browserContext.newCDPSession() {#browser-context-new-cdp-session}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

::: info
CDP 会话仅在基于 Chromium 的浏览器上支持。
:::

返回新创建的会话。

**参数**

- <a id="browser-context-new-cdp-session-option-page"></a>`page` `Page | Frame`

  要为其创建新会话的目标。为了向后兼容，此参数命名为 `page`，但它可以是 `Page` 或 `Frame` 类型。

**返回值**

- `Promise<CDPSession>`


### browserContext.newPage() {#browser-context-new-page}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

在浏览器上下文中创建新页面。

**返回值**

- `Promise<Page>`


### browserContext.pages() {#browser-context-pages}

<Badge type="info" text="Added in: v1.8" />

返回上下文中所有打开的页面。

**返回值**

- `Array<Page>`


### browserContext.removeAllListeners() {#browser-context-remove-all-listeners}

<Badge type="info" text="Added in: v1.47" /> <Badge type="tip" text="async" />

移除给定类型的所有监听器（如果未给定类型，则移除所有已注册的监听器）。允许等待异步监听器完成或忽略这些监听器的后续错误。

**参数**

- <a id="browser-context-remove-all-listeners-option-type"></a>`type` `string` *(可选)*
- <a id="browser-context-remove-all-listeners-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-context-remove-all-listeners-option-behavior"></a>`behavior` `"wait" | "ignoreErrors" | "default"` *(可选)*

    指定是否等待正在运行的监听器以及如果它们抛出错误该怎么办：
    * `'default'` - 不等待当前监听器调用（如果有）完成，如果监听器抛出异常，可能导致未处理的错误
    * `'wait'` - 等待当前监听器调用（如果有）完成
    * `'ignoreErrors'` - 不等待当前监听器调用（如果有）完成，移除后监听器抛出的所有错误都会被静默捕获


### browserContext.route() {#browser-context-route}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

路由提供了修改浏览器上下文中任何页面发出的网络请求的能力。一旦启用路由，每个匹配 url 模式的请求都会暂停，除非它被继续、完成或中止。

::: info
[`browserContext.route()`](/api/class-browsercontext#browser-context-route) 不会拦截被 Service Worker 拦截的请求。请参阅[此问题](https://github.com/microsoft/playwright/issues/1090)。我们建议在使用请求拦截时通过将 [`serviceWorkers`](/api/class-browser#browser-new-context-option-service-workers) 设置为 `'block'` 来禁用 Service Workers。
:::

**用法**

中止所有图片请求的简单处理程序示例：

```js
const context = await browser.newContext();
await context.route('**/*.{png,jpg,jpeg}', route => route.abort());
const page = await context.newPage();
await page.goto('https://example.com');
await browser.close();
```

或者使用正则表达式模式的相同代码片段：

```js
const context = await browser.newContext();
await context.route(/(\.png$)|(\.jpg$)/, route => route.abort());
const page = await context.newPage();
await page.goto('https://example.com');
await browser.close();
```

可以检查请求以决定路由操作。例如，模拟所有包含某些 post 数据的请求，而保持所有其他请求不变：

```js
await context.route('/api/**', async route => {
  if (route.request().postData().includes('my-string'))
    await route.fulfill({ body: 'mocked-data' });
  else
    await route.continue();
});
```

当请求同时匹配两个处理程序时，页面路由（使用 [`page.route()`](/api/class-page#page-route) 设置）优先于浏览器上下文路由。

要删除路由及其处理程序，可以使用 [`browserContext.unroute()`](/api/class-browsercontext#browser-context-unroute)。

::: info
启用路由会禁用 http 缓存。
:::

**参数**

- <a id="browser-context-route-option-url"></a>`url` `string | RegExp | URLPattern | function(URL): boolean`

  在路由期间用于匹配的 glob 模式、正则表达式模式、URL 模式或接收 [URL] 的谓词。如果在上下文选项中设置了 [`baseURL`](/api/class-browser#browser-new-context-option-base-url) 且提供的 URL 是不以 `*` 开头的字符串，则使用 [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数解析。
- <a id="browser-context-route-option-handler"></a>`handler` `function(Route, Request): Promise<any> | any`

  用于路由请求的处理函数。
- <a id="browser-context-route-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-context-route-option-times"></a>`times` `int` *(可选)* <Badge type="info" text="Added in: v1.15" />

    路由应该使用的次数。默认情况下每次都会使用。

**返回值**

- `Promise<Disposable>`


### browserContext.routeFromHAR() {#browser-context-route-from-har}

<Badge type="info" text="Added in: v1.23" /> <Badge type="tip" text="async" />

如果指定，上下文中发出的网络请求将从 HAR 文件提供。阅读更多关于[从 HAR 重放](../mock.md#replaying-from-har)的内容。

Playwright 不会从 HAR 文件提供被 Service Worker 拦截的请求。请参阅[此问题](https://github.com/microsoft/playwright/issues/1090)。我们建议在使用请求拦截时通过将 [`serviceWorkers`](/api/class-browser#browser-new-context-option-service-workers) 设置为 `'block'` 来禁用 Service Workers。

**参数**

- <a id="browser-context-route-from-har-option-har"></a>`har` `path`

  包含预录网络数据的 [HAR](http://www.softwareishard.com/blog/har-12-spec) 文件路径。如果 `path` 是相对路径，则相对于当前工作目录解析。
- <a id="browser-context-route-from-har-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-context-route-from-har-option-not-found"></a>`notFound` `"abort" | "fallback"` *(可选)*

    * 如果设置为 'abort'，则 HAR 文件中未找到的任何请求都将被中止。
    * 如果设置为 'fallback'，则回退到处理程序链中的下一个路由处理程序。

    默认为 abort。
  - <a id="browser-context-route-from-har-option-update"></a>`update` `boolean` *(可选)*

    如果指定，则使用实际网络信息更新给定的 HAR，而不是从文件提供。调用 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 时文件将写入磁盘。
  - <a id="browser-context-route-from-har-option-update-content"></a>`updateContent` `"embed" | "attach"` *(可选)* <Badge type="info" text="Added in: v1.32" />

    用于控制资源内容管理的可选设置。如果指定 `attach`，资源将作为单独的文件或 ZIP 存档中的条目保存。如果指定 `embed`，内容将内联存储在 HAR 文件中。
  - <a id="browser-context-route-from-har-option-update-mode"></a>`updateMode` `"full" | "minimal"` *(可选)* <Badge type="info" text="Added in: v1.32" />

    当设置为 `minimal` 时，仅记录从 HAR 路由所需的信息。这会省略从 HAR 重放时不使用的大小、时间、页面、cookies、安全和其他类型的 HAR 信息。默认为 `minimal`。
  - <a id="browser-context-route-from-har-option-url"></a>`url` `string | RegExp` *(可选)*

    用于匹配请求 URL 的 glob 模式、正则表达式或谓词。只有 URL 匹配模式的请求才会从 HAR 文件提供。如果未指定，则所有请求都从 HAR 文件提供。


### browserContext.routeWebSocket() {#browser-context-route-web-socket}

<Badge type="info" text="Added in: v1.48" /> <Badge type="tip" text="async" />

此方法允许修改浏览器上下文中任何页面建立的 websocket 连接。

注意只有在调用此方法之后创建的 `WebSocket` 才会被路由。建议在创建任何页面之前调用此方法。

**用法**

以下是一个阻止某些 websocket 消息的简单处理程序示例。有关更多详情和示例，请参阅 [WebSocketRoute](/api/class-websocketroute)。

```js
await context.routeWebSocket('/ws', ws => {
  const server = ws.connectToServer();
  ws.onMessage(message => {
    if (message === 'to-be-blocked')
      return;
    server.send(message);
  });
});
```

**参数**

- <a id="browser-context-route-web-socket-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  只有 url 匹配此模式的 WebSocket 才会被路由。字符串模式可以相对于 [`baseURL`](/api/class-browser#browser-new-context-option-base-url) 上下文选项。
- <a id="browser-context-route-web-socket-option-handler"></a>`handler` `function(WebSocketRoute): Promise<any> | any`

  用于路由 WebSocket 的处理函数。


### browserContext.serviceWorkers() {#browser-context-service-workers}

<Badge type="info" text="Added in: v1.11" />

::: info
Service workers 仅在基于 Chromium 的浏览器上支持。
:::

上下文中所有现有的 service workers。

**返回值**

- `Array<Worker>`


### browserContext.setDefaultNavigationTimeout() {#browser-context-set-default-navigation-timeout}

<Badge type="info" text="Added in: v1.8" />

此设置将更改以下方法和相关快捷方式的默认最大导航时间：
* [`page.goBack()`](/api/class-page#page-go-back)
* [`page.goForward()`](/api/class-page#page-go-forward)
* [`page.goto()`](/api/class-page#page-goto)
* [`page.reload()`](/api/class-page#page-reload)
* [`page.setContent()`](/api/class-page#page-set-content)
* [`page.waitForNavigation()`](/api/class-page#page-wait-for-navigation)

::: info
[`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) 和 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 优先于 [`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout)。
:::

**参数**

- <a id="browser-context-set-default-navigation-timeout-option-timeout"></a>`timeout` `float`

  最大导航时间（毫秒）


### browserContext.setDefaultTimeout() {#browser-context-set-default-timeout}

<Badge type="info" text="Added in: v1.8" />

此设置将更改所有接受 [`timeout`](/api/class-browsercontext#browser-context-set-default-timeout-option-timeout) 选项的方法的默认最大时间。

::: info
[`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout)、[`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 和 [`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout) 优先于 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout)。
:::

**参数**

- <a id="browser-context-set-default-timeout-option-timeout"></a>`timeout` `float`

  最大时间（毫秒）。传递 `0` 禁用超时。


### browserContext.setExtraHTTPHeaders() {#browser-context-set-extra-http-headers}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

额外的 HTTP 头将随上下文中任何页面发起的每个请求一起发送。这些头与使用 [`page.setExtraHTTPHeaders()`](/api/class-page#page-set-extra-http-headers) 设置的页面特定额外 HTTP 头合并。如果页面覆盖了特定头，将使用页面特定的头值而不是浏览器上下文头值。

::: info
[`browserContext.setExtraHTTPHeaders()`](/api/class-browsercontext#browser-context-set-extra-http-headers) 不保证传出请求中头的顺序。
:::

**参数**

- <a id="browser-context-set-extra-http-headers-option-headers"></a>`headers` `Object<string, string>`

  包含要随每个请求发送的附加 HTTP 头的对象。所有头值必须是字符串。


### browserContext.setGeolocation() {#browser-context-set-geolocation}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

设置上下文的地理位置。传递 `null` 或 `undefined` 模拟位置不可用。

**用法**

```js
await browserContext.setGeolocation({ latitude: 59.95, longitude: 30.31667 });
```

::: info
考虑使用 [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions) 授予浏览器上下文页面读取其地理位置的权限。
:::

**参数**

- <a id="browser-context-set-geolocation-option-geolocation"></a>`geolocation` `null | Object`

  - `latitude` `float`

    纬度，-90 到 90 之间。
  - `longitude` `float`

    经度，-180 到 180 之间。
  - `accuracy` `float` *(可选)*

    非负精度值。默认为 `0`。


### browserContext.setHTTPCredentials() {#browser-context-set-http-credentials}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

为此浏览器上下文设置 HTTP 身份验证的凭据。

::: info
浏览器可能会在成功身份验证后按来源缓存凭据，因此更改已通过身份验证的来源的凭据可能不会生效。
:::

**参数**

- <a id="browser-context-set-http-credentials-option-http-credentials"></a>`httpCredentials` `null | Object | Array<Object>`

  传递数组以为不同来源使用不同凭据。匹配请求来源的第一个条目将被使用，没有来源的条目匹配任何请求。

  - `username` `string`
  - `password` `string`
  - `origin` `string` *(可选)*

    限制仅在特定来源（scheme://host:port）发送 http 凭据。


### browserContext.setOffline() {#browser-context-set-offline}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

**参数**

- <a id="browser-context-set-offline-option-offline"></a>`offline` `boolean`

  是否为浏览器上下文模拟网络离线。

  ::: info
  离线模拟影响 HTTP 请求，如页面导航、`fetch()` 和 `XMLHttpRequest`。

  WebSocket 行为取决于浏览器以及连接是否已建立。Chromium 和 Firefox 在离线时会使新的 WebSocket 连接失败，但不会关闭已打开的连接。Chromium 可以延迟传入的消息直到上下文恢复在线，而不是丢失它们；Firefox 可以在离线时继续传递消息。WebKit 可以在离线时允许新的 WebSocket 连接和已建立连接上的流量。不要依赖离线模拟来测试 WebSocket 消息丢失或连接关闭。

  离线模拟不影响 WebRTC 流量：已建立的 `RTCPeerConnection` 会继续通过 UDP 发送和接收媒体。要测试 WebRTC 连接丢失，请在浏览器外部中断连接，例如停止 TURN 服务器或使用操作系统级防火墙。
  :::


### browserContext.setStorageState() {#browser-context-set-storage-state}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

清除现有的 cookies、本地存储、IndexedDB 条目、来源私有文件系统条目和虚拟 WebAuthn 凭据，并设置新的存储状态。当存储状态包含凭据时，将安装虚拟 WebAuthn 认证器（相当于 [`credentials.install()`](/api/class-credentials#credentials-install)），阻止所有真实认证器在此上下文中工作。

**用法**

```js
// 从文件加载存储状态并应用到上下文
await context.setStorageState('state.json');
```

**参数**

- <a id="browser-context-set-storage-state-option-storage-state"></a>`storageState` `path | Object`

  了解更多关于[存储状态和身份验证](../auth.md)的内容。

  使用给定的存储状态填充上下文。此选项可用于使用通过 [`browserContext.storageState()`](/api/class-browsercontext#browser-context-storage-state) 获取的登录信息初始化上下文。

  - `cookies` `Array<Object>`

    要为上下文设置的 Cookies

    - `name` `string`
    - `value` `string`
    - `domain` `string`

      域和路径是必需的。要使 cookie 同时应用于所有子域，请在域名前加点，如：".example.com"
    - `path` `string`

      域和路径是必需的
    - `expires` `float`

      Unix 时间戳（秒）。
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


### browserContext.storageState() {#browser-context-storage-state}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回此浏览器上下文的存储状态，包含当前 cookies、本地存储快照、IndexedDB 快照、来源私有文件系统快照和虚拟 WebAuthn 凭据。

**参数**

- <a id="browser-context-storage-state-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-context-storage-state-option-credentials"></a>`credentials` `boolean` *(可选)* <Badge type="info" text="Added in: v1.62" />

    设置为 `true` 以在存储状态快照中包含上下文的虚拟 WebAuthn [`browserContext.credentials`](/api/class-browsercontext#browser-context-credentials)（passkeys）。捕获的凭据携带其私钥和签名计数器，因此可以通过 [`storageState`](/api/class-browser#browser-new-context-option-storage-state) 选项或 [`browserContext.setStorageState()`](/api/class-browsercontext#browser-context-set-storage-state) 重新设置到后续上下文中。
    注意恢复包含凭据的存储状态将自动安装虚拟 WebAuthn 认证器（参见 [`credentials.install()`](/api/class-credentials#credentials-install)），并阻止所有真实认证器在此上下文中工作。
  - <a id="browser-context-storage-state-option-indexed-db"></a>`indexedDB` `boolean` *(可选)* <Badge type="info" text="Added in: v1.51" />

    设置为 `true` 以在存储状态快照中包含 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)。
    如果您的应用程序使用 IndexedDB 存储身份验证令牌（如 Firebase Authentication），请启用此选项。
  - <a id="browser-context-storage-state-option-opfs"></a>`opfs` `boolean` *(可选)* <Badge type="info" text="Added in: v1.63" />

    设置为 `true` 以在存储状态快照中包含[来源私有文件系统](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)。

    ::: info
    OPFS 目前在临时 WebKit 上下文中不支持。
    :::
  - <a id="browser-context-storage-state-option-path"></a>`path` `path` *(可选)*

    保存存储状态的文件路径。如果 [`path`](/api/class-browsercontext#browser-context-storage-state-option-path) 是相对路径，则相对于当前工作目录解析。如果未提供路径，仍会返回存储状态，但不会保存到磁盘。

**返回值**

- `Promise<Object>`


### browserContext.unroute() {#browser-context-unroute}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

删除使用 [`browserContext.route()`](/api/class-browsercontext#browser-context-route) 创建的路由。当未指定 [`handler`](/api/class-browsercontext#browser-context-unroute-option-handler) 时，删除 [`url`](/api/class-browsercontext#browser-context-unroute-option-url) 的所有路由。

**参数**

- <a id="browser-context-unroute-option-url"></a>`url` `string | RegExp | URLPattern | function(URL): boolean`

  用于通过 [`browserContext.route()`](/api/class-browsercontext#browser-context-route) 注册路由的 glob 模式、正则表达式模式、URL 模式或接收 [URL] 的谓词。
- <a id="browser-context-unroute-option-handler"></a>`handler` `function(Route, Request): Promise<any> | any` *(可选)*

  用于通过 [`browserContext.route()`](/api/class-browsercontext#browser-context-route) 注册路由的可选处理函数。


### browserContext.unrouteAll() {#browser-context-unroute-all}

<Badge type="info" text="Added in: v1.41" /> <Badge type="tip" text="async" />

删除使用 [`browserContext.route()`](/api/class-browsercontext#browser-context-route) 和 [`browserContext.routeFromHAR()`](/api/class-browsercontext#browser-context-route-from-har) 创建的所有路由。

**参数**

- <a id="browser-context-unroute-all-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-context-unroute-all-option-behavior"></a>`behavior` `"wait" | "ignoreErrors" | "default"` *(可选)*

    指定是否等待正在运行的处理程序以及如果它们抛出错误该怎么办：
    * `'default'` - 不等待当前处理程序调用（如果有）完成，如果取消路由的处理程序抛出异常，可能导致未处理的错误
    * `'wait'` - 等待当前处理程序调用（如果有）完成
    * `'ignoreErrors'` - 不等待当前处理程序调用（如果有）完成，取消路由后处理程序抛出的所有错误都会被静默捕获


### browserContext.waitForEvent() {#browser-context-wait-for-event}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

等待事件触发并将其值传递给谓词函数。当谓词返回真值时返回。如果在事件触发之前上下文关闭，将抛出错误。返回事件数据值。

**用法**

```js
const pagePromise = context.waitForEvent('page');
await page.getByRole('button').click();
const page = await pagePromise;
```

**参数**

- <a id="browser-context-wait-for-event-option-event"></a>`event` `string`

  事件名称，与传递给 `browserContext.on(event)` 的相同。
- <a id="browser-context-wait-for-event-option-options-or-predicate"></a>`optionsOrPredicate` `function() | Object` *(可选)*

  接收事件的谓词或选项对象。可选。

  - `predicate` `function()`

    接收事件数据，当等待应该解决时解析为真值。
  - `timeout` `float` *(可选)*

    最大等待时间（毫秒）。默认为 `0` - 无超时。默认值可以通过配置中的 `actionTimeout` 选项更改，或通过使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 方法更改。
- <a id="browser-context-wait-for-event-option-options"></a>`options` `Object` *(可选)*

  - <a id="browser-context-wait-for-event-option-predicate"></a>`predicate` `function()` *(可选)*

    接收事件数据，当等待应该解决时解析为真值。
  - <a id="browser-context-wait-for-event-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消等待。如果信号被中止，等待将被中止且操作将抛出错误。
    注意提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。

**返回值**

- `Promise<any>`


## 属性

### browserContext.clock {#browser-context-clock}

<Badge type="info" text="Added in: v1.45" />

Playwright 具有模拟时钟和时间流逝的能力。

**类型**

- `Clock`


### browserContext.credentials {#browser-context-credentials}

<Badge type="info" text="Added in: v1.61" />

此上下文的虚拟 WebAuthn 认证器。让测试可以设置凭据并拦截 `navigator.credentials.create()` / `navigator.credentials.get()` 仪式。

**类型**

- `Credentials`


### browserContext.debugger {#browser-context-debugger}

<Badge type="info" text="Added in: v1.59" />

调试器允许暂停和恢复执行。

**类型**

- `Debugger`


### browserContext.request {#browser-context-request}

<Badge type="info" text="Added in: v1.16" />

与此上下文关联的 API 测试助手。使用此 API 发出的请求将使用上下文 cookies。

**类型**

- `APIRequestContext`


### browserContext.tracing {#browser-context-tracing}

<Badge type="info" text="Added in: v1.12" />

**类型**

- `Tracing`


## 事件

### browserContext.on('close') {#browser-context-event-close}

<Badge type="info" text="Added in: v1.8" />

当浏览器上下文关闭时触发。这可能由于以下原因之一发生：
* 浏览器上下文被关闭。
* 浏览器应用程序被关闭或崩溃。
* 调用了 [`browser.close()`](/api/class-browser#browser-close) 方法。

**事件数据**

- `BrowserContext`


### browserContext.on('console') {#browser-context-event-console}

<Badge type="info" text="Added in: v1.34" />

当页面内的 JavaScript 调用控制台 API 方法之一时触发，例如 `console.log` 或 `console.dir`。

传递给 `console.log` 的参数和页面在 [ConsoleMessage](/api/class-consolemessage) 事件处理程序参数上可用。

**用法**

```js
context.on('console', async msg => {
  const values = [];
  for (const arg of msg.args())
    values.push(await arg.jsonValue());
  console.log(...values);
});
await page.evaluate(() => console.log('hello', 5, { foo: 'bar' }));
```

**事件数据**

- `ConsoleMessage`


### browserContext.on('dialog') {#browser-context-event-dialog}

<Badge type="info" text="Added in: v1.34" />

当出现 JavaScript 对话框时触发，例如 `alert`、`prompt`、`confirm` 或 `beforeunload`。监听器**必须**调用 [`dialog.accept()`](/api/class-dialog#dialog-accept) 或 [`dialog.dismiss()`](/api/class-dialog#dialog-dismiss) 来处理对话框 - 否则页面将[冻结](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#never_blocking)等待对话框，点击等操作将永远不会完成。

**用法**

```js
context.on('dialog', dialog => {
  dialog.accept();
});
```

::: info
当没有 [`page.on('dialog')`](/api/class-page#page-event-dialog) 或 [`browserContext.on('dialog')`](/api/class-browsercontext#browser-context-event-dialog) 监听器时，所有对话框都会自动关闭。
:::

**事件数据**

- `Dialog`


### browserContext.on('dialogClosed') {#browser-context-event-dialog-closed}

<Badge type="info" text="Added in: v1.63" />

当属于此上下文的任何页面中的 JavaScript 对话框已关闭时触发，无论是通过 [`dialog.accept()`](/api/class-dialog#dialog-accept)、[`dialog.dismiss()`](/api/class-dialog#dialog-dismiss) 还是用户在有界面的浏览器中手动关闭。

**事件数据**

- `Dialog`


### browserContext.on('download') {#browser-context-event-download}

<Badge type="info" text="Added in: v1.60" />

当属于此上下文的任何页面中开始附件下载时触发。用户可以通过传递的 [Download](/api/class-download) 实例访问已下载内容的基本文件操作。另请参阅 [`page.on('download')`](/api/class-page#page-event-download) 以接收特定页面的事件。

**事件数据**

- `Download`


### browserContext.on('frameAttached') {#browser-context-event-frame-attached}

<Badge type="info" text="Added in: v1.60" />

当属于此上下文的任何页面中附加框架时触发。另请参阅 [`page.on('frameAttached')`](/api/class-page#page-event-frame-attached) 以接收特定页面的事件。

**事件数据**

- `Frame`


### browserContext.on('frameDetached') {#browser-context-event-frame-detached}

<Badge type="info" text="Added in: v1.60" />

当属于此上下文的任何页面中分离框架时触发。另请参阅 [`page.on('frameDetached')`](/api/class-page#page-event-frame-detached) 以接收特定页面的事件。

**事件数据**

- `Frame`


### browserContext.on('frameNavigated') {#browser-context-event-frame-navigated}

<Badge type="info" text="Added in: v1.60" />

当属于此上下文的任何页面中的框架导航到新 URL 时触发。另请参阅 [`page.on('frameNavigated')`](/api/class-page#page-event-frame-navigated) 以接收特定页面中导航的事件。

**事件数据**

- `Frame`


### browserContext.on('page') {#browser-context-event-page}

<Badge type="info" text="Added in: v1.8" />

当在 BrowserContext 中创建新页面时触发此事件。页面可能仍在加载中。该事件也会为弹出页面触发。另请参阅 [`page.on('popup')`](/api/class-page#page-event-popup) 以接收与特定页面相关的弹出窗口事件。

页面可用的最早时刻是当它已导航到初始 URL 时。例如，当使用 `window.open('http://example.com')` 打开弹出窗口时，此事件将在对 "http://example.com" 的网络请求完成并且其响应已开始在弹出窗口中加载时触发。如果您想路由/监听此网络请求，请分别使用 [`browserContext.route()`](/api/class-browsercontext#browser-context-route) 和 [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) 而不是 [Page](/api/class-page) 上的类似方法。

```js
const newPagePromise = context.waitForEvent('page');
await page.getByText('open new page').click();
const newPage = await newPagePromise;
console.log(await newPage.evaluate('location.href'));
```

::: info
使用 [`page.waitForLoadState()`](/api/class-page#page-wait-for-load-state) 等待页面达到特定状态（大多数情况下您应该不需要它）。
:::

**事件数据**

- `Page`


### browserContext.on('pageClose') {#browser-context-event-page-close}

<Badge type="info" text="Added in: v1.60" />

当此上下文中的页面关闭时触发。另请参阅 [`page.on('close')`](/api/class-page#page-event-close) 以接收特定页面的事件。

**事件数据**

- `Page`


### browserContext.on('pageLoad') {#browser-context-event-page-load}

<Badge type="info" text="Added in: v1.60" />

当属于此上下文的任何页面中调度 JavaScript [`load`](https://developer.mozilla.org/en-US/docs/Web/Events/load) 事件时触发。另请参阅 [`page.on('load')`](/api/class-page#page-event-load) 以接收特定页面的事件。

**事件数据**

- `Page`


### browserContext.on('request') {#browser-context-event-request}

<Badge type="info" text="Added in: v1.12" />

当通过此上下文创建的任何页面发出请求时触发。[request] 对象是只读的。要仅监听来自特定页面的请求，请使用 [`page.on('request')`](/api/class-page#page-event-request)。

要拦截和修改请求，请参阅 [`browserContext.route()`](/api/class-browsercontext#browser-context-route) 或 [`page.route()`](/api/class-page#page-route)。

**事件数据**

- `Request`


### browserContext.on('requestFailed') {#browser-context-event-request-failed}

<Badge type="info" text="Added in: v1.12" />

当请求失败时触发，例如超时。要仅监听来自特定页面的失败请求，请使用 [`page.on('requestFailed')`](/api/class-page#page-event-request-failed)。

::: info
HTTP 错误响应（如 404 或 503）从 HTTP 角度来看仍然是成功的响应，因此请求将以 [`browserContext.on('requestFinished')`](/api/class-browsercontext#browser-context-event-request-finished) 事件完成，而不是 [`browserContext.on('requestFailed')`](/api/class-browsercontext#browser-context-event-request-failed)。
:::

**事件数据**

- `Request`


### browserContext.on('requestFinished') {#browser-context-event-request-finished}

<Badge type="info" text="Added in: v1.12" />

当请求在下载响应体后成功完成时触发。对于成功的响应，事件序列为 `request`、`response` 和 `requestfinished`。要监听来自特定页面的成功请求，请使用 [`page.on('requestFinished')`](/api/class-page#page-event-request-finished)。

**事件数据**

- `Request`


### browserContext.on('response') {#browser-context-event-response}

<Badge type="info" text="Added in: v1.12" />

当收到请求的 [response] 状态和头时触发。对于成功的响应，事件序列为 `request`、`response` 和 `requestfinished`。要监听来自特定页面的响应事件，请使用 [`page.on('response')`](/api/class-page#page-event-response)。

**事件数据**

- `Response`


### browserContext.on('serviceWorker') {#browser-context-event-service-worker}

<Badge type="info" text="Added in: v1.11" />

::: info
Service workers 仅在基于 Chromium 的浏览器上支持。
:::

当在上下文中创建新的 service worker 时触发。

**事件数据**

- `Worker`


### browserContext.on('webError') {#browser-context-event-web-error}

<Badge type="info" text="Added in: v1.38" />

当此上下文中任何页面出现未处理的异常时触发。要监听来自特定页面的错误，请改用 [`page.on('pageError')`](/api/class-page#page-event-page-error)。

**事件数据**

- `WebError`


## 已弃用

### browserContext.on('backgroundPage') {#browser-context-event-background-page}

<Badge type="info" text="Added in: v1.11" />

::: danger 已弃用
后台页面已随 Manifest V2 扩展一起从 Chromium 中删除。
:::

此事件不再触发。

**事件数据**

- `Page`


### browserContext.backgroundPages() {#browser-context-background-pages}

<Badge type="info" text="Added in: v1.11" />

::: danger 已弃用
后台页面已随 Manifest V2 扩展一起从 Chromium 中删除。
:::

返回空列表。

**返回值**

- `Array<Page>`
