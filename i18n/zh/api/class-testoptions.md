---
title: TestOptions
outline: 2
---

# TestOptions

<Badge type="info" text="Added in: v1.10" />

Playwright Test 提供了许多选项来配置测试环境、[Browser](/api/class-browser)、[BrowserContext](/api/class-browsercontext) 等。

这些选项通常在[配置文件](../test-configuration.md)中通过 [`testConfig.use`](/api/class-testconfig#test-config-use) 和 [`testProject.use`](/api/class-testproject#test-project-use) 提供。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
  },
});
```

:::

或者，使用 [`test.use()`](/api/class-test#test-use) 你可以为文件覆盖某些选项。

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

// 使用类似纵向的视口运行此文件中的测试。
test.use({ viewport: { width: 600, height: 900 } });

test('my portrait test', async ({ page }) => {
  // ...
});
```

:::

## 属性

### testOptions.acceptDownloads {#test-options-accept-downloads}

<Badge type="info" text="Added in: v1.10" />

是否自动下载所有附件。默认为 `true`，即接受所有下载。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    acceptDownloads: false,
  },
});
```

:::

**类型**

- `boolean`


### testOptions.actionTimeout {#test-options-action-timeout}

<Badge type="info" text="Added in: v1.10" />

每个 Playwright 操作的默认超时时间（以毫秒为单位），默认为 0（无超时）。

这是所有 Playwright 操作的默认超时，与通过 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 配置的相同。

**用法**

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    /* 每个操作（如 `click()`）的最大时间。默认为 0（无限制）。 */
    actionTimeout: 0,
  },
});
```

了解更多关于[各种超时](../test-timeouts.md)。

**类型**

- `int`


### testOptions.baseURL {#test-options-base-url}

<Badge type="info" text="Added in: v1.10" />

当使用 [`page.goto()`](/api/class-page#page-goto)、[`page.route()`](/api/class-page#page-route)、[`page.waitForURL()`](/api/class-page#page-wait-for-url)、[`page.waitForRequest()`](/api/class-page#page-wait-for-request) 或 [`page.waitForResponse()`](/api/class-page#page-wait-for-response) 时，它会使用 [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数构建相应的 URL 时考虑基础 URL。默认未设置。示例：
* baseURL: `http://localhost:3000` 且导航到 `/bar.html` 结果为 `http://localhost:3000/bar.html`
* baseURL: `http://localhost:3000/foo/` 且导航到 `./bar.html` 结果为 `http://localhost:3000/foo/bar.html`
* baseURL: `http://localhost:3000/foo`（无尾斜杠）且导航到 `./bar.html` 结果为 `http://localhost:3000/bar.html`

**用法**

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    /* 在操作中使用的基础 URL，如 `await page.goto('/')`。 */
    baseURL: 'http://localhost:3000',
  },
});
```

**类型**

- `string`


### testOptions.browserName {#test-options-browser-name}

<Badge type="info" text="Added in: v1.10" />

运行测试的浏览器名称。默认为 `'chromium'`。大多数时候你应该在 [TestConfig](/api/class-testconfig) 中设置 `browserName`：

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    browserName: 'firefox',
  },
});
```

:::

**类型**

- `"chromium" | "firefox" | "webkit"`


### testOptions.bypassCSP {#test-options-bypass-csp}

<Badge type="info" text="Added in: v1.10" />

切换是否绕过页面的内容安全策略。默认为 `false`。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    bypassCSP: true,
  }
});
```

:::

**类型**

- `boolean`


### testOptions.channel {#test-options-channel}

<Badge type="info" text="Added in: v1.10" />

浏览器分发渠道。

使用 "chromium" 来[选择新的无头模式](../browsers.md#chromium-new-headless-mode)。

使用 "chrome"、"chrome-beta"、"chrome-dev"、"chrome-canary"、"msedge"、"msedge-beta"、"msedge-dev" 或 "msedge-canary" 来使用品牌版 [Google Chrome 和 Microsoft Edge](../browsers.md#google-chrome--microsoft-edge)。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge'
      },
    },
  ]
});
```

:::

**类型**

- `string`


### testOptions.clientCertificates {#test-options-client-certificates}

<Badge type="info" text="Added in: v1.46" />

TLS 客户端认证允许服务器请求客户端证书并验证它。

**详情**

客户端证书数组。每个证书对象必须同时具有 `certPath` 和 `keyPath`，或单个 `pfxPath`，或它们对应的直接值等价物（`cert` 和 `key`，或 `pfx`）。如果证书已加密，可选地应提供 `passphrase` 属性。`origin` 属性应提供与证书有效的请求源完全匹配的值。

客户端证书认证仅在提供至少一个客户端证书时处于活动状态。如果你想拒绝服务器发送的所有客户端证书，你需要提供一个 `origin` 与你计划访问的任何域都不匹配的客户端证书。

::: info
在 macOS 上使用 WebKit 时，访问 `localhost` 不会获取客户端证书。你可以通过将 `localhost` 替换为 `local.playwright` 来使其工作。
:::

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    clientCertificates: [{
      origin: 'https://example.com',
      certPath: './cert.pem',
      keyPath: './key.pem',
      passphrase: 'mysecretpassword',
    }],
  },
});
```

:::

**类型**

- `Array<Object>`


### testOptions.colorScheme {#test-options-color-scheme}

<Badge type="info" text="Added in: v1.10" />

模拟 [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 媒体特性，支持的值有 `'light'` 和 `'dark'`。更多详情请参阅
[`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 会将模拟重置为系统默认值。默认为 `'light'`。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    colorScheme: 'dark',
  },
});
```

:::

**类型**

- `null | "light" | "dark" | "no-preference"`


### testOptions.connectOptions {#test-options-connect-options}

<Badge type="info" text="Added in: v1.10" />

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    connectOptions: {
      wsEndpoint: 'ws://localhost:5678',
    },
  },
});
```

:::

当指定连接选项时，默认的 [`fixtures.browser`](/api/class-fixtures#fixtures-browser)、[`fixtures.context`](/api/class-fixtures#fixtures-context) 和 [`fixtures.page`](/api/class-fixtures#fixtures-page) 使用远程浏览器而不是本地启动浏览器。

**类型**

- `void | Object`


### testOptions.contextOptions {#test-options-context-options}

<Badge type="info" text="Added in: v1.10" />

用于创建上下文的选项，与传递给 [`browser.newContext()`](/api/class-browser#browser-new-context) 的选项相同。特定选项如 [`testOptions.viewport`](/api/class-testoptions#test-options-viewport) 优先于此。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
});
```

:::

**类型**

- `Object`


### testOptions.contrast {#test-options-contrast}

<Badge type="info" text="Added in: v1.50" />

模拟 `'prefers-contrast'` 媒体特性，支持的值有 `'no-preference'`、`'more'`。更多详情请参阅 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 会将模拟重置为系统默认值。默认为 `'no-preference'`。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    contrast: 'more',
  },
});
```

:::

**类型**

- `null | "no-preference" | "more"`


### testOptions.deviceScaleFactor {#test-options-device-scale-factor}

<Badge type="info" text="Added in: v1.10" />

指定设备比例因子（可以理解为 dpr）。默认为 `1`。了解更多关于[使用设备比例因子模拟设备](../emulation.md#devices)。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    viewport: { width: 2560, height: 1440 },
    deviceScaleFactor: 2,
  },
});
```

:::

**类型**

- `float`


### testOptions.extraHTTPHeaders {#test-options-extra-http-headers}

<Badge type="info" text="Added in: v1.10" />

包含要与每个请求一起发送的附加 HTTP 头的对象。默认为无。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    extraHTTPHeaders: {
      'X-My-Header': 'value',
    },
  },
});
```

:::

**类型**

- `Object<string, string>`


### testOptions.forcedColors {#test-options-forced-colors}

<Badge type="info" text="Added in: v1.50" />

模拟 `'forced-colors'` 媒体特性，支持的值有 `'active'`、`'none'`。更多详情请参阅 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 会将模拟重置为系统默认值。默认为 `'none'`。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    forcedColors: 'active',
  },
});
```

:::

**类型**

- `null | "active" | "none"`


### testOptions.geolocation {#test-options-geolocation}

<Badge type="info" text="Added in: v1.10" />

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    geolocation: { longitude: 12.492507, latitude: 41.889938 },
  },
});
```

:::

了解更多关于[地理位置](../emulation.md#color-scheme-and-media)。

**类型**

- `Object`


### testOptions.hasTouch {#test-options-has-touch}

<Badge type="info" text="Added in: v1.10" />

指定视口是否支持触摸事件。默认为 false。了解更多关于[移动端模拟](../emulation.md#devices)。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    hasTouch: true
  },
});
```

:::

**类型**

- `boolean`


### testOptions.headless {#test-options-headless}

<Badge type="info" text="Added in: v1.10" />

是否以无头模式运行浏览器。更多详情请参阅
[Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) 和
[Firefox](https://hacks.mozilla.org/2017/12/using-headless-mode-in-firefox/)。默认为 `true`。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false
  },
});
```

:::

**类型**

- `boolean`


### testOptions.httpCredentials {#test-options-http-credentials}

<Badge type="info" text="Added in: v1.10" />

[HTTP 认证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)的凭据。
如果未指定 origin，则在收到未授权响应时将用户名和密码发送到任何服务器。

传递数组以对不同的源使用不同的凭据。匹配请求源的第一个条目将被使用，没有 origin 的条目匹配任何请求。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    httpCredentials: {
      username: 'user',
      password: 'pass',
    },
  },
});
```

:::

将凭据数组传递给 [`test.use()`](/api/class-test#test-use) 时，将其包装在额外的数组中，请参阅[夹具选项](../test-fixtures.md#fixtures-options)。

::: code-group

```js [example.spec.ts]
test.use({
  httpCredentials: [[
    { username: 'alice', password: 'alice-pass', origin: 'https://a.example.com' },
    { username: 'bob', password: 'bob-pass', origin: 'https://b.example.com' },
  ], { scope: 'test' }],
});
```

:::

**类型**

- `Object | Array<Object>`


### testOptions.ignoreHTTPSErrors {#test-options-ignore-https-errors}

<Badge type="info" text="Added in: v1.10" />

发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    ignoreHTTPSErrors: true,
  },
});
```

:::

**类型**

- `boolean`


### testOptions.isMobile {#test-options-is-mobile}

<Badge type="info" text="Added in: v1.10" />

是否考虑 `meta viewport` 标签并启用触摸事件。isMobile 是设备的一部分，所以你实际上不需要手动设置它。默认为 `false`。了解更多关于[移动端模拟](../emulation.md#ismobile)。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    isMobile: false,
  },
});
```

:::

**类型**

- `boolean`


### testOptions.javaScriptEnabled {#test-options-java-script-enabled}

<Badge type="info" text="Added in: v1.10" />

是否在上下文中启用 JavaScript。默认为 `true`。了解更多关于[禁用 JavaScript](../emulation.md#javascript-enabled)。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    javaScriptEnabled: false,
  },
});
```

:::

**类型**

- `boolean`


### testOptions.launchOptions {#test-options-launch-options}

<Badge type="info" text="Added in: v1.10" />

用于启动浏览器的选项，与传递给 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 的选项相同。特定选项 [`testOptions.headless`](/api/class-testoptions#test-options-headless) 和 [`testOptions.channel`](/api/class-testoptions#test-options-channel) 优先于此。

::: warning
使用自定义浏览器参数需自担风险，因为其中一些可能会破坏 Playwright 的功能。
:::

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--start-maximized']
        }
      }
    }
  ]
});
```

:::

**类型**

- `Object`


### testOptions.locale {#test-options-locale}

<Badge type="info" text="Added in: v1.10" />

指定用户区域设置，例如 `en-GB`、`de-DE` 等。区域设置将影响 `navigator.language` 值、`Accept-Language` 请求头值以及数字和日期格式规则。默认为 `en-US`。在我们的[模拟指南](../emulation.md#locale--timezone)中了解更多关于模拟。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    locale: 'it-IT',
  },
});
```

:::

**类型**

- `string`


### testOptions.locateOnlyVisible {#test-options-locate-only-visible}

<Badge type="info" text="Added in: v1.66" />

此上下文中的定位器是否只查找[可见](../actionability.md#visible)元素。
默认为 `false`。

启用后，Playwright 应用两条规则：
1. 定位器找到的元素必须是可见的。操作、断言和查询的行为就像在定位器链的末尾调用了
   [`locator.visible()`](/api/class-locator#locator-visible)。
1. [`locator.first()`](/api/class-locator#locator-first)、[`locator.last()`](/api/class-locator#locator-last) 和 [`locator.nth()`](/api/class-locator#locator-nth) 在可见
   元素中选择。它们的行为就像在它们之前立即调用了 [`locator.visible()`](/api/class-locator#locator-visible)。

```js
// <div hidden>One</div> <div>Two</div> <div>Three</div>
await expect(page.locator('div')).toHaveCount(2);
await expect(page.locator('div').first()).toHaveText('Two');
await expect(page.locator('div').last()).toHaveText('Three');
```

显式的可见性过滤器始终具有优先级。Playwright 不会在已经有过滤器的位置添加自己的过滤器。例如，`page.locator('div').filter({ visible: false }).first()` 会找到第一个隐藏元素。

定位器链的所有其他部分不会被过滤。在 `page.locator('section').getByRole('button')` 中，
按钮必须是可见的，但 section 可以根据[可见性](../actionability.md#visible)规则隐藏，
例如因为它的尺寸为零。这同样适用于 [`locator.filter()`](/api/class-locator#locator-filter) 的内部定位器，

[`locator.and()`](/api/class-locator#locator-and) 和 [`locator.or()`](/api/class-locator#locator-or)：只有第二条规则适用于它们。

此选项不会改变 [`page.getByRole()`](/api/class-page#page-get-by-role) 的可访问性规则
或基于选择器方法（如 [`page.$()`](/api/class-page#page-query-selector)）的行为。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    locateOnlyVisible: true,
  },
});
```

:::

**类型**

- `boolean`


### testOptions.navigationTimeout {#test-options-navigation-timeout}

<Badge type="info" text="Added in: v1.10" />

每个导航操作的超时时间，以毫秒为单位。默认为 0（无超时）。

这是默认的导航超时，与通过 [`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) 配置的相同。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    navigationTimeout: 3000,
  },
});
```

:::

了解更多关于[各种超时](../test-timeouts.md)。

**类型**

- `int`


### testOptions.offline {#test-options-offline}

<Badge type="info" text="Added in: v1.10" />

是否模拟网络离线。默认为 `false`。了解更多关于[网络模拟](../emulation.md#offline)。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    offline: true
  },
});
```

:::

**类型**

- `boolean`


### testOptions.permissions {#test-options-permissions}

<Badge type="info" text="Added in: v1.10" />

授予此上下文中所有页面的权限列表。更多详情请参阅
[`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions)。默认为无。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    permissions: ['notifications'],
  },
});
```

:::

**类型**

- `Array<string>`


### testOptions.proxy {#test-options-proxy}

<Badge type="info" text="Added in: v1.10" />

网络代理设置。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    proxy: {
      server: 'http://myproxy.com:3128',
      bypass: 'localhost',
    },
  },
});
```

:::

**类型**

- `Object`


### testOptions.reducedMotion {#test-options-reduced-motion}

<Badge type="info" text="Added in: v1.50" />

模拟 `'prefers-reduced-motion'` 媒体特性，支持的值有 `'reduce'`、`'no-preference'`。更多详情请参阅 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 会将模拟重置为系统默认值。默认为 `'no-preference'`。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    reducedMotion: 'reduce',
  },
});
```

:::

**类型**

- `null | "reduce" | "no-preference"`


### testOptions.reuseContext {#test-options-reuse-context}

<Badge type="info" text="Added in: v1.62" />

::: warning 不推荐
此选项以牺牲测试隔离来换取速度，旨在用于驱动 story gallery 的组件测试。对于端到端测试，请保持未设置 - 每个测试一个全新的浏览器上下文是 Playwright Test 的核心保证之一。
:::

**实验性。** 当设置为 `true` 时，worker 进程中的所有测试都在单个浏览器上下文中运行，该上下文在测试之间重用，而不是每个测试获得一个全新的上下文。默认为 `false`。

在测试之间，Playwright 会重置组件测试通常会触及的状态：它清除访问过的源的 cookies、缓存、本地存储和 IndexedDB，注销 service workers，关闭额外的页面，删除路由、绑定和初始化脚本，并重新应用配置的存储状态、视口和模拟选项。

此重置是尽力而为的，不是隔离的保证。**不会**重置的状态包括：
* 测试期间使用 [`browserContext.grantPermissions()`](/api/class-browsercontext#browser-context-grant-permissions) 授予的权限。
* 通过 [`browserContext.setGeolocation()`](/api/class-browsercontext#browser-context-set-geolocation)、[`browserContext.setOffline()`](/api/class-browsercontext#browser-context-set-offline) 和 [`browserContext.setExtraHTTPHeaders()`](/api/class-browsercontext#browser-context-set-extra-http-headers) 进行的运行时更改。
* 浏览历史、`window.name` 和任何浏览器进程范围的状态。

额外限制：
* 启用 [`testOptions.video`](/api/class-testoptions#test-options-video) 录制时，此选项会被忽略。
* 只有少数上下文选项可以在连续测试之间不同：`colorScheme`、`forcedColors`、`reducedMotion`、`contrast`、`screen`、`userAgent`、`viewport` 和 `testIdAttribute`。在 [`test.use()`](/api/class-test#test-use) 中更改任何其他选项，例如 `locale` 或 `storageState`，会静默强制创建新上下文并抵消加速效果。
* 不要与指向共享浏览器的多个 worker 的 [`testOptions.connectOptions`](/api/class-testoptions#test-options-connect-options) 组合使用 - worker 会竞争单个可重用上下文。
* [`testOptions.contextOptions`](/api/class-testoptions#test-options-context-options) 中的 `recordHar` 不受支持，不会生成 HAR 文件。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'components',
      testDir: './tests/components',
      use: { reuseContext: true },
    },
  ],
});
```

:::

**类型**

- `boolean`


### testOptions.screen {#test-options-screen}

<Badge type="info" text="Added in: v1.64" />

模拟通过 `window.screen` 在网页内可用的一致窗口屏幕大小。仅在设置了 [`testOptions.viewport`](/api/class-testoptions#test-options-viewport) 时使用。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    viewport: { width: 390, height: 664 },
    screen: { width: 390, height: 844 },
  },
});
```

:::

**类型**

- `Object`


### testOptions.screenshot {#test-options-screenshot}

<Badge type="info" text="Added in: v1.10" />

是否在每个测试后自动截取屏幕截图。默认为 `'off'`。
* `'off'`: 不截取屏幕截图。
* `'on'`: 每个测试后截取屏幕截图。
* `'only-on-failure'`: 每个测试失败后截取屏幕截图。
* `'on-first-failure'`: 每个测试首次失败后截取屏幕截图。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
  },
});
```

:::

了解更多关于[自动屏幕截图](../test-use-options.md#recording-options)。

**类型**

- `Object | "off" | "on" | "only-on-failure" | "on-first-failure"`


### testOptions.serviceWorkers {#test-options-service-workers}

<Badge type="info" text="Added in: v1.10" />

是否允许站点注册 Service workers。默认为 `'allow'`。
* `'allow'`: 可以注册 [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)。
* `'block'`: Playwright 将阻止所有 Service Workers 的注册。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    serviceWorkers: 'allow'
  },
});
```

:::

**类型**

- `"allow" | "block"`


### testOptions.storageState {#test-options-storage-state}

<Badge type="info" text="Added in: v1.10" />

了解更多关于[存储状态和认证](../auth.md)。

使用给定的存储状态填充上下文。此选项可用于使用通过 [`browserContext.storageState()`](/api/class-browsercontext#browser-context-storage-state) 获取的已登录信息初始化上下文。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    storageState: 'storage-state.json',
  },
});
```

:::

**详情**

在配置中设置存储状态后，可以为文件重置存储状态：

::: code-group

```js [not-signed-in.spec.ts]
import { test } from '@playwright/test';

// 重置此文件的存储状态以避免已认证
test.use({ storageState: { cookies: [], origins: [] } });

test('not signed in test', async ({ page }) => {
  // ...
});
```

:::

**类型**

- `path | Object`


### testOptions.testIdAttribute {#test-options-test-id-attribute}

<Badge type="info" text="Added in: v1.27" />

在 [`page.getByTestId()`](/api/class-page#page-get-by-test-id) 中使用的自定义属性。默认使用 `data-testid`。要匹配
具有多个属性之一的元素，请将它们作为逗号分隔的列表传递。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    testIdAttribute: 'pw-test-id',
  },
});
```

:::

多个属性：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    testIdAttribute: 'data-pw,data-ti',
  },
});
```

:::

**类型**

- `void`


### testOptions.timezoneId {#test-options-timezone-id}

<Badge type="info" text="Added in: v1.10" />

更改上下文的时区。有关支持的时区 ID 列表，请参阅 [ICU 的 metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)。
默认为系统时区。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    timezoneId: 'Europe/Rome',
  },
});
```

:::

**类型**

- `string`


### testOptions.trace {#test-options-trace}

<Badge type="info" text="Added in: v1.10" />

是否为每个测试录制追踪。默认为 `'off'`。测试的初始运行是"首次运行"；由[重试](../test-retries.md)引起的后续运行是"重试"。
* `'off'`: 不录制追踪。
* `'on'`: 为每次运行录制并保留追踪。
* `'on-first-retry'`: 仅为测试的首次重试录制并保留追踪。
* `'on-all-retries'`: 为每次重试录制并保留追踪。
* `'retain-on-failure'`: 为每次运行录制追踪，但仅保留失败运行的追踪。即使后续重试通过，失败运行的追踪也会保留。
* `'retain-on-first-failure'`: 仅为测试的首次运行（不包括重试）录制追踪，且仅在该运行失败时保留。
* `'retain-on-failure-and-retries'`: 为每次运行录制追踪，并为任何失败或重试的运行保留它。

有关每种模式录制和保留内容的并排比较，请参阅[追踪模式](../test-use-options.md#trace-modes)。

要进行更多控制，传递一个指定 `mode` 和要启用的追踪功能的对象。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    trace: 'on-first-retry'
  },
});
```

:::

了解更多关于[录制追踪](../test-use-options.md#recording-options)。

**类型**

- `Object | "off" | "on" | "on-first-retry" | "on-all-retries" | "retain-on-failure" | "retain-on-first-failure" | "retain-on-failure-and-retries"`


### testOptions.userAgent {#test-options-user-agent}

<Badge type="info" text="Added in: v1.10" />

在此上下文中使用的特定用户代理。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    userAgent: 'some custom ua',
  },
});
```

:::

**类型**

- `string`


### testOptions.video {#test-options-video}

<Badge type="info" text="Added in: v1.10" />

是否为每个测试录制视频。默认为 `'off'`。测试的初始运行是"首次运行"；由[重试](../test-retries.md)引起的后续运行是"重试"。
* `'off'`: 不录制视频。
* `'on'`: 为每次运行录制并保留视频。
* `'on-first-retry'`: 仅为测试的首次重试录制并保留视频。
* `'on-all-retries'`: 为每次重试录制并保留视频。
* `'retain-on-failure'`: 为每次运行录制视频，但仅保留失败运行的视频。即使后续重试通过，失败运行的视频也会保留。
* `'retain-on-first-failure'`: 仅为测试的首次运行（不包括重试）录制视频，且仅在该运行失败时保留。
* `'retain-on-failure-and-retries'`: 为每次运行录制视频，并为任何失败或重试的运行保留它。

有关每种模式录制和保留内容的并排比较，请参阅[视频模式](../test-use-options.md#video-modes)。

要控制视频大小，传递一个具有 `mode` 和 `size` 属性的对象。如果未指定视频大小，它将等于 [`testOptions.viewport`](/api/class-testoptions#test-options-viewport) 缩小到适合 800x800。如果未明确配置 `viewport`，视频大小默认为 800x450。如有必要，每个页面的实际画面将被缩小以适合指定的大小。

要录制更流畅的动画和滚动视频，请传递 `fps`，例如 `{ mode: 'on', size: { width: 1920, height: 1080 }, fps: 60 }`。更高的帧率和尺寸会使用更多的 CPU 进行编码。Firefox 和 WebKit 目前最多每秒捕获 25 帧。

要在视频中注释操作，请传递带有 `actions` 和/或 `test` 子选项的 `show`。`actions` 选项控制交互元素上的视觉高亮，每个高亮显示一个可选的 `duration`（以毫秒为单位，默认为 `500`）。`test` 选项控制显示哪些测试信息作为状态覆盖层。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    video: 'on-first-retry',
  },
});
```

:::

了解更多关于[录制视频](../test-use-options.md#recording-options)。

**类型**

- `Object | "off" | "on" | "retain-on-failure" | "on-first-retry" | "on-all-retries" | "retain-on-first-failure" | "retain-on-failure-and-retries"`


### testOptions.viewport {#test-options-viewport}

<Badge type="info" text="Added in: v1.10" />

为每个页面模拟一致的视口。默认为 1280x720 视口。
使用 `null` 禁用一致的视口模拟。了解更多关于[视口模拟](../emulation#viewport)。

::: info
`null` 值选择退出默认预设，使视口取决于
操作系统定义的主机窗口大小。这使得测试
的执行变得不确定。
:::

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    viewport: { width: 100, height: 100 },
  },
});
```

:::

**类型**

- `null | Object`
