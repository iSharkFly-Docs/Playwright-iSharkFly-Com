---
title: "配置 (use)"
---

# 配置 (use)

## 介绍

除了配置测试运行器外，你还可以为 [Browser](/api/class-browser) 或 [BrowserContext](/api/class-browsercontext) 配置[模拟](#模拟选项)、[网络](#网络选项)和[录制](#录制选项)选项。这些选项通过 Playwright 配置中的 `use: {}` 对象传递。

### 基本选项

为所有测试设置基础 URL 和存储状态：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // 在 `await page.goto('/')` 等操作中使用的基础 URL。
    baseURL: 'http://localhost:3000',

    // 使用给定的存储状态填充上下文。
    storageState: 'state.json',
  },
});
```

:::

| 选项 | 描述 |
| :- | :- |
| [`testOptions.baseURL`](/api/class-testoptions#test-options-base-url) | 上下文中所有页面使用的基础 URL。允许仅使用路径导航，例如 `page.goto('/settings')`。 |
| [`testOptions.storageState`](/api/class-testoptions#test-options-storage-state) | 使用给定的存储状态填充上下文。对于简单认证很有用，[了解更多](./auth.md)。 |

### 模拟选项

使用 Playwright 你可以模拟真实设备，如手机或平板电脑。有关模拟设备的更多信息，请参阅我们的[项目指南](./test-projects.md)。你还可以为所有测试或特定测试模拟 `"geolocation"`、`"locale"` 和 `"timezone"`，以及设置 `"permissions"` 来显示通知或更改 `"colorScheme"`。请参阅我们的[模拟](./emulation.md)指南了解更多。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // 模拟 `'prefers-colors-scheme'` 媒体特性。
    colorScheme: 'dark',

    // 上下文地理位置。
    geolocation: { longitude: 12.492507, latitude: 41.889938 },

    // 模拟用户区域设置。
    locale: 'en-GB',

    // 授予浏览器上下文指定的权限。
    permissions: ['geolocation'],

    // 模拟用户时区。
    timezoneId: 'Europe/Paris',

    // 上下文中所有页面使用的视口。
    viewport: { width: 1280, height: 720 },
  },
});
```

:::

| 选项 | 描述 |
| :- | :- |
| [`testOptions.colorScheme`](/api/class-testoptions#test-options-color-scheme) | [模拟](./emulation.md#color-scheme-and-media) `'prefers-colors-scheme'` 媒体特性，支持的值为 `'light'` 和 `'dark'` |
| [`testOptions.contrast`](/api/class-testoptions#test-options-contrast) | [模拟](./emulation.md#color-scheme-and-media) `'prefers-contrast'` 媒体特性，支持的值为 `'no-preference'` 和 `'more'` |
| [`testOptions.forcedColors`](/api/class-testoptions#test-options-forced-colors) | [模拟](./emulation.md#color-scheme-and-media) `'forced-colors'` 媒体特性，支持的值为 `'active'` 和 `'none'` |
| [`testOptions.geolocation`](/api/class-testoptions#test-options-geolocation) | 上下文[地理位置](./emulation.md#geolocation)。 |
| [`testOptions.locale`](/api/class-testoptions#test-options-locale) | [模拟](./emulation.md#locale--timezone)用户区域设置，例如 `en-GB`、`de-DE` 等。 |
| [`testOptions.permissions`](/api/class-testoptions#test-options-permissions) | 授予上下文中所有页面的[权限](./emulation.md#permissions)列表。 |
| [`testOptions.reducedMotion`](/api/class-testoptions#test-options-reduced-motion) | [模拟](./emulation.md#color-scheme-and-media) `'prefers-reduced-motion'` 媒体特性，支持的值为 `'reduce'` 和 `'no-preference'` |
| [`testOptions.timezoneId`](/api/class-testoptions#test-options-timezone-id) | 更改上下文的[时区](./emulation.md#locale--timezone)。 |
| [`testOptions.viewport`](/api/class-testoptions#test-options-viewport) | 上下文中所有页面使用的[视口](./emulation.md#viewport)。 |

### 网络选项

可用于配置网络的选项：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // 是否自动下载所有附件。
    acceptDownloads: false,

    // 包含要随每个请求发送的额外 HTTP 头的对象。
    extraHTTPHeaders: {
      'X-My-Header': 'value',
    },

    // HTTP 认证的凭据。
    httpCredentials: {
      username: 'user',
      password: 'pass',
    },

    // 是否在导航期间忽略 HTTPS 错误。
    ignoreHTTPSErrors: true,

    // 是否模拟网络离线。
    offline: true,

    // 测试中所有页面使用的代理设置。
    proxy: {
      server: 'http://myproxy.com:3128',
      bypass: 'localhost',
    },
  },
});
```

:::

| 选项 | 描述 |
| :- | :- |
| [`testOptions.acceptDownloads`](/api/class-testoptions#test-options-accept-downloads) | 是否自动下载所有附件，默认为 `true`。[了解更多](./downloads.md)关于处理下载。 |
| [`testOptions.clientCertificates`](/api/class-testoptions#test-options-client-certificates) | TLS 客户端认证允许服务器请求客户端证书并验证它。 |
| [`testOptions.extraHTTPHeaders`](/api/class-testoptions#test-options-extra-http-headers) | 包含要随每个请求发送的额外 HTTP 头的对象。所有头值必须是字符串。 |
| [`testOptions.httpCredentials`](/api/class-testoptions#test-options-http-credentials) | [HTTP 认证](./network.md#http-authentication)的凭据。 |
| [`testOptions.ignoreHTTPSErrors`](/api/class-testoptions#test-options-ignore-https-errors) | 是否在导航期间忽略 HTTPS 错误。 |
| [`testOptions.offline`](/api/class-testoptions#test-options-offline) | 是否模拟网络离线。 |
| [`testOptions.proxy`](/api/class-testoptions#test-options-proxy) | 测试中所有页面使用的[代理设置](./network.md#http-proxy)。 |
| [`testOptions.serviceWorkers`](/api/class-testoptions#test-options-service-workers) | 是否允许站点注册 Service workers，默认为 `'allow'`。[了解更多](./network.md#missing-network-events-and-service-workers)关于 Service Workers 和网络模拟。 |

::: info
你不需要配置任何东西来模拟网络请求。只需定义一个自定义 [Route](/api/class-route) 来为浏览器上下文模拟网络。请参阅我们的[网络模拟指南](./network.md)了解更多。
:::

### 录制选项

使用 Playwright 你可以捕获截图、录制视频以及测试的跟踪。默认情况下这些是关闭的，但你可以通过在 `playwright.config.js` 文件中设置 `screenshot`、`video` 和 `trace` 选项来启用它们。

跟踪文件、截图和视频将出现在测试输出目录中，通常是 `test-results`。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // 在每次测试失败后捕获截图。
    screenshot: 'only-on-failure',

    // 仅在首次重试测试时录制跟踪。
    trace: 'on-first-retry',

    // 仅在首次重试测试时录制视频。
    video: 'on-first-retry'
  },
});
```

:::

| 选项 | 描述 |
| :- | :- |
| [`testOptions.screenshot`](/api/class-testoptions#test-options-screenshot) | 捕获测试的[截图](./screenshots.md)。选项包括 `'off'`、`'on'` 和 `'only-on-failure'` |
| [`testOptions.trace`](/api/class-testoptions#test-options-trace) | Playwright 可以在运行测试时生成测试跟踪。之后，你可以查看跟踪并通过打开[跟踪查看器](./trace-viewer.md)获取有关 Playwright 执行的详细信息。选项包括：`'off'`、`'on'`、`'retain-on-failure'` 和 `'on-first-retry'` |
| [`testOptions.video`](/api/class-testoptions#test-options-video) | Playwright 可以为你的测试录制[视频](./videos.md)。选项包括：`'off'`、`'on'`、`'retain-on-failure'` 和 `'on-first-retry'` |

#### 跟踪模式

`trace` 选项支持多种模式，它们在**哪些运行被录制**和**哪些录制在测试结束后被保留**方面有所不同。测试的初始运行是"首次运行"；由[重试](./test-retries.md)引起的后续运行是"重试"。

| 模式 | 在以下情况录制跟踪 | 在以下情况保留跟踪 |
| :- | :- | :- |
| `'off'` | 从不 | — |
| `'on'` | 每次运行 | 总是 |
| `'retain-on-failure'` | 每次运行 | 该运行失败 |
| `'retain-on-first-failure'` | 仅首次运行 | 首次运行失败 |
| `'retain-on-failure-and-retries'` | 每次运行 | 该运行失败，或者是重试 |
| `'on-first-retry'` | 仅首次重试 | 总是 |
| `'on-all-retries'` | 每次重试 | 总是 |

下表显示了在一些常见场景中保留哪些跟踪，假设配置了 `retries: 2`：

| 模式 | 首次运行通过 | 失败，然后重试通过 | 每次运行都失败 |
| :- | :- | :- | :- |
| `'off'` | — | — | — |
| `'on'` | 首次运行 | 首次运行 + 重试 | 所有三次运行 |
| `'retain-on-failure'` | — | 首次运行 | 所有三次运行 |
| `'retain-on-first-failure'` | — | 首次运行 | 首次运行 |
| `'retain-on-failure-and-retries'` | — | 首次运行 + 重试 | 所有三次运行 |
| `'on-first-retry'` | — | 首次重试 | 首次重试 |
| `'on-all-retries'` | — | 首次重试 | 两次重试 |

#### 视频模式

`video` 选项支持与 `trace` 相同的模式集，它们使用相同的规则录制和保留录像。

| 模式 | 在以下情况录制视频 | 在以下情况保留视频 |
| :- | :- | :- |
| `'off'` | 从不 | — |
| `'on'` | 每次运行 | 总是 |
| `'retain-on-failure'` | 每次运行 | 该运行失败 |
| `'retain-on-first-failure'` | 仅首次运行 | 首次运行失败 |
| `'retain-on-failure-and-retries'` | 每次运行 | 该运行失败，或者是重试 |
| `'on-first-retry'` | 仅首次重试 | 总是 |
| `'on-all-retries'` | 每次重试 | 总是 |

下表显示了在一些常见场景中保留哪些视频，假设配置了 `retries: 2`：

| 模式 | 首次运行通过 | 失败，然后重试通过 | 每次运行都失败 |
| :- | :- | :- | :- |
| `'off'` | — | — | — |
| `'on'` | 首次运行 | 首次运行 + 重试 | 所有三次运行 |
| `'retain-on-failure'` | — | 首次运行 | 所有三次运行 |
| `'retain-on-first-failure'` | — | 首次运行 | 首次运行 |
| `'retain-on-failure-and-retries'` | — | 首次运行 + 重试 | 所有三次运行 |
| `'on-first-retry'` | — | 首次重试 | 首次重试 |
| `'on-all-retries'` | — | 首次重试 | 两次重试 |

### 其他选项

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // 每个操作（如 `click()`）可以花费的最长时间。默认为 0（无限制）。
    actionTimeout: 0,

    // 运行测试的浏览器名称。例如 `chromium`、`firefox`、`webkit`。
    browserName: 'chromium',

    // 切换绕过内容安全策略。
    bypassCSP: true,

    // 要使用的通道，例如 "chrome"、"chrome-beta"、"msedge"、"msedge-beta"。
    channel: 'chrome',

    // 在无界面模式下运行浏览器。
    headless: false,

    // 更改默认的 data-testid 属性。
    testIdAttribute: 'pw-test-id',
  },
});
```

:::

| 选项 | 描述 |
| :- | :- |
| [`testOptions.actionTimeout`](/api/class-testoptions#test-options-action-timeout) | 每个 Playwright 操作的超时时间（毫秒）。默认为 `0`（无超时）。了解更多关于[超时](./test-timeouts.md)以及如何为单个测试设置它们。 |
| [`testOptions.browserName`](/api/class-testoptions#test-options-browser-name) | 运行测试的浏览器名称。默认为 'chromium'。选项包括 `chromium`、`firefox` 或 `webkit`。 |
| [`testOptions.bypassCSP`](/api/class-testoptions#test-options-bypass-csp) | 切换绕过内容安全策略。当 CSP 包含生产源时很有用。默认为 `false`。 |
| [`testOptions.channel`](/api/class-testoptions#test-options-channel) | 要使用的浏览器通道。[了解更多](./browsers.md)关于不同浏览器和通道。 |
| [`testOptions.headless`](/api/class-testoptions#test-options-headless) | 是否在无界面模式下运行浏览器，意味着运行测试时不显示浏览器。默认为 `true`。 |
| [`testOptions.navigationTimeout`](/api/class-testoptions#test-options-navigation-timeout) | 每个导航操作的超时时间（毫秒）。默认为 `0`（无超时）。了解更多关于[超时](./test-timeouts.md)。 |
| [`testOptions.testIdAttribute`](/api/class-testoptions#test-options-test-id-attribute) | 更改 Playwright 定位器使用的默认 [`data-testid` 属性](./locators.md#locate-by-test-id)。 |

### 更多浏览器和上下文选项

[`browserType.launch()`](/api/class-browsertype#browser-type-launch)、[`browser.newContext()`](/api/class-browser#browser-new-context) 或 [`browserType.connect()`](/api/class-browsertype#browser-type-connect) 接受的任何选项都可以分别放入 `use` 部分的 `launchOptions`、`contextOptions` 或 `connectOptions` 中。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    launchOptions: {
      slowMo: 50,
    },
  },
});
```

:::

然而，最常见的选项如 `headless` 或 `viewport` 可以直接在 `use` 部分中使用——参见[基本选项](#基本选项)、[模拟](#模拟选项)或[网络](#网络选项)。

### 显式上下文创建和选项继承

当测试或钩子运行时，通过测试运行器使用的 Playwright 实例创建的每个浏览器上下文都会继承 `use` 部分的上下文选项。这包括使用内置 `browser` 夹具创建的上下文、单独启动的浏览器、[`browserType.launchPersistentContext()`](/api/class-browsertype#browser-type-launch-persistent-context)，或解析到同一实例的直接 `playwright-core` 导入。显式上下文选项优先：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    userAgent: 'some custom ua',
    viewport: { width: 100, height: 100 },
  },
});
```

:::

一个示例测试说明了初始上下文选项是如何设置的：

```js
test('should inherit use options on context when using built-in browser fixture', async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  expect(await page.evaluate(() => navigator.userAgent)).toBe('some custom ua');
  expect(await page.evaluate(() => window.innerWidth)).toBe(100);
  await context.close();
});
```

### 配置作用域

你可以全局、按项目或按测试配置 Playwright。例如，你可以通过将 `locale` 添加到 Playwright 配置的 `use` 选项来设置全局使用的区域设置，然后使用配置中的 `project` 选项为特定项目覆盖它。你还可以通过在测试文件中添加 `test.use({})` 并传入选项来为特定测试覆盖它。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    locale: 'en-GB'
  },
});
```

:::

你可以使用 Playwright 配置中的 `project` 选项为特定项目覆盖选项。

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'de-DE',
      },
    },
  ],
});
```

你可以使用 `test.use()` 方法并传入选项来为特定测试文件覆盖选项。例如，要使用法语区域设置运行特定测试：

```js
import { test, expect } from '@playwright/test';

test.use({ locale: 'fr-FR' });

test('example', async ({ page }) => {
  // ...
});
```

这在 describe 块中同样有效。例如，要在 describe 块中使用法语区域设置运行测试：

```js
import { test, expect } from '@playwright/test';

test.describe('french language block', () => {

  test.use({ locale: 'fr-FR' });

  test('example', async ({ page }) => {
    // ...
  });
});
```

### 重置选项

你可以将选项重置为配置文件中定义的值。考虑以下设置 `baseURL` 的配置：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://playwright.dev',
  },
});
```

:::

现在你可以为文件配置 `baseURL`，也可以为单个测试选择退出。

::: code-group

```js [intro.spec.ts]
import { test } from '@playwright/test';

// 为此文件配置 baseURL。
test.use({ baseURL: 'https://playwright.dev/docs/intro' });

test('check intro contents', async ({ page }) => {
  // 此测试将使用上面定义的 "https://playwright.dev/docs/intro" 基础 url。
});

test.describe(() => {
  // 将值重置为配置中定义的值。
  test.use({ baseURL: undefined });

  test('can navigate to intro from the home page', async ({ page }) => {
    // 此测试将使用配置中定义的 "https://playwright.dev" 基础 url。
  });
});
```

:::

如果你想将值完全重置为 `undefined`，请使用长形式夹具表示法。

::: code-group

```js [intro.spec.ts]
import { test } from '@playwright/test';

// 完全取消此文件的 baseURL 设置。
test.use({
  baseURL: [async ({}, use) => use(undefined), { scope: 'test' }],
});

test('no base url', async ({ page }) => {
  // 此测试将没有基础 url。
});
```

:::
