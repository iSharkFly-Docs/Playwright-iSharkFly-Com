---
title: "模拟"
---

# 模拟

## 简介

使用 Playwright，您可以在任何浏览器上测试您的应用程序，还可以模拟真实设备，如手机或平板电脑。只需配置您想要模拟的设备，Playwright 就会模拟浏览器行为，如 `"userAgent"`、`"screenSize"`、`"viewport"` 以及是否启用了 `"hasTouch"`。您还可以为所有测试或特定测试模拟 `"geolocation"`、`"locale"` 和 `"timezone"`，以及设置 `"permissions"` 来显示通知或更改 `"colorScheme"`。

## 设备

Playwright 附带一个[设备参数注册表](https://github.com/microsoft/playwright/blob/main/packages/isomorphic/deviceDescriptorsSource.json)，使用 [`playwright.devices`](/api/class-playwright#playwright-devices) 用于选定的桌面、平板和移动设备。它可以用于模拟特定设备的浏览器行为，如用户代理、屏幕大小、视口以及是否启用触摸。所有测试将使用指定的设备参数运行。

::: code-group

```js [Test]
import { defineConfig, devices } from '@playwright/test'; // 导入 devices

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],
});
```

```js [Library]
const { chromium, devices } = require('playwright');
const browser = await chromium.launch();

const iphone13 = devices['iPhone 13'];
const context = await browser.newContext({
  ...iphone13,
});
```

:::

<img height="1582" width="916" alt="playwright.dev 网站模拟 iPhone 13" src="https://user-images.githubusercontent.com/13063165/220411073-76fe59f9-9a2d-463d-8e30-c19a7deca133.png" />

**注意**：预配置的设备假定特定平台。例如，"Desktop Chrome" 将提供 Windows 特定的用户代理字符串。

如果您想使用运行测试的平台特定的用户代理，我们建议取消设置用户代理属性。

```js
const context = await browser.newContext({
  ...devices['Desktop Chrome'],
  userAgent: undefined,
});
```

## 视口

视口包含在设备中，但您可以使用 [`page.setViewportSize()`](/api/class-page#page-set-viewport-size) 为某些测试覆盖它。

::: code-group

```js [Test]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // 在解构 `devices` 之后定义 `viewport` 属性很重要，
        // 因为 devices 也为该设备定义了 `viewport`。
        viewport: { width: 1280, height: 720 },
      },
    },
  ]
});
```

```js [Library]
// 使用给定视口创建上下文
const context = await browser.newContext({
  viewport: { width: 1280, height: 1024 }
});
```

:::

测试文件：

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 1600, height: 1200 },
});

test('my test', async ({ page }) => {
  // ...
});
```

```js [Library]
// 使用给定视口创建上下文
const context = await browser.newContext({
  viewport: { width: 1280, height: 1024 }
});

// 为单个页面调整视口大小
await page.setViewportSize({ width: 1600, height: 1200 });

// 模拟高 DPI
const context = await browser.newContext({
  viewport: { width: 2560, height: 1440 },
  deviceScaleFactor: 2,
});
```

:::

同样的方法也适用于测试文件内部。

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.describe('specific viewport block', () => {
  test.use({ viewport: { width: 1600, height: 1200 } });

  test('my test', async ({ page }) => {
    // ...
  });
});
```

```js [Library]
// 使用给定视口创建上下文
const context = await browser.newContext({
  viewport: { width: 1600, height: 1200 }
});
const page = await context.newPage();
```

:::

## isMobile

是否考虑 meta viewport 标签并启用触摸事件。

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // 在解构 `devices` 之后定义 `isMobile` 属性很重要，
        // 因为 devices 也为该设备定义了 `isMobile`。
        isMobile: false,
      },
    },
  ]
});
```

:::

## 区域设置和时区

模拟浏览器的区域设置和时区，可以在配置中为所有测试全局设置，然后为特定测试覆盖。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // 模拟浏览器区域设置。
    locale: 'en-GB',

    // 模拟浏览器时区。
    timezoneId: 'Europe/Paris',
  },
});
```

:::

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
});

test('my test for de lang in Berlin timezone', async ({ page }) => {
  await page.goto('https://www.bing.com');
  // ...
});
```

```js [Library]
const context = await browser.newContext({
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
});
```

:::

<img height="1824" width="2788" alt="Bing 德语语言和时区" src="https://user-images.githubusercontent.com/13063165/220416571-ccc96ab1-44bb-4579-8430-64502fc24a15.png" />

###### 
请注意，这只影响浏览器时区和区域设置，不影响测试运行器时区。
要设置测试运行器时区，您可以使用 [`TZ` 环境变量](https://nodejs.org/api/cli.html#tz)。

## 权限

允许应用程序显示系统通知。

::: code-group

```js [Test]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // 向浏览器上下文授予指定权限。
    permissions: ['notifications'],
  },
});
```

```js [Library]
const context = await browser.newContext({
  permissions: ['notifications'],
});
```

:::

允许特定域的通知。

::: code-group

```js [Test]
import { test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  // 在每个测试之前运行并登录每个页面。
  await context.grantPermissions(['notifications'], { origin: 'https://skype.com' });
});

test('first', async ({ page }) => {
  // 页面对 https://skype.com 有通知权限。
});
```

```js [Library]
await context.grantPermissions(['notifications'], { origin: 'https://skype.com' });
```

:::

使用 [`browserContext.clearPermissions()`](/api/class-browsercontext#browser-context-clear-permissions) 撤销所有权限。

```js
// Library
await context.clearPermissions();
```

## 地理位置

授予 `"geolocation"` 权限并将地理位置设置为特定区域。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // 上下文地理位置
    geolocation: { longitude: 12.492507, latitude: 41.889938 },
    permissions: ['geolocation'],
  },
});
```

:::

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({
  geolocation: { longitude: 41.890221, latitude: 12.492348 },
  permissions: ['geolocation'],
});

test('my test with geolocation', async ({ page }) => {
  // ...
});
```

```js [Library]
const context = await browser.newContext({
  geolocation: { longitude: 41.890221, latitude: 12.492348 },
  permissions: ['geolocation']
});

```

:::

<img height="1824" width="2788" alt="Bing 地图上意大利的地理位置" src="https://user-images.githubusercontent.com/13063165/220417670-bb22d815-f5cd-47c4-8562-0b88165eac27.png" />

稍后更改位置：

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({
  geolocation: { longitude: 41.890221, latitude: 12.492348 },
  permissions: ['geolocation'],
});

test('my test with geolocation', async ({ page, context }) => {
  // 为此测试覆盖位置
  await context.setGeolocation({ longitude: 48.858455, latitude: 2.294474 });
});
```

```js [Library]
await context.setGeolocation({ longitude: 48.858455, latitude: 2.294474 });
```

:::

**注意**：您只能更改上下文中所有页面的地理位置。

## 配色方案和媒体

模拟用户的 `"colorScheme"`。支持的值为 'light'、'dark' 和 'no-preference'。您还可以使用 [`page.emulateMedia()`](/api/class-page#page-emulate-media) 模拟媒体类型。

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

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({
  colorScheme: 'dark' // 或 'light'
});

test('my test with dark mode', async ({ page }) => {
  // ...
});
```

```js [Library]
// 使用深色模式创建上下文
const context = await browser.newContext({
  colorScheme: 'dark' // 或 'light'
});

// 使用深色模式创建页面
const page = await browser.newPage({
  colorScheme: 'dark' // 或 'light'
});

// 更改页面的配色方案
await page.emulateMedia({ colorScheme: 'dark' });

// 更改页面的媒体
await page.emulateMedia({ media: 'print' });
```

:::

<img height="1824" width="2788" alt="深色模式下的 playwright 网站" src="https://user-images.githubusercontent.com/13063165/220411638-55d2b051-4678-4da7-9f0b-ed22f5a3c47c.png" />

`"reducedMotion"`、`"forcedColors"` 和 `"contrast"` 选项以相同方式模拟 `prefers-reduced-motion`、`forced-colors` 和 `prefers-contrast` 媒体特性。支持的值为：减少动画为 `'reduce'` 和 `'no-preference'`，强制颜色为 `'active'` 和 `'none'`，对比度为 `'more'` 和 `'no-preference'`。[`page.emulateMedia()`](/api/class-page#page-emulate-media) 可以为单个页面更改这些设置。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    reducedMotion: 'reduce',
    forcedColors: 'active',
    contrast: 'more',
  },
});
```

:::

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({
  reducedMotion: 'reduce', // 或 'no-preference'
  forcedColors: 'active', // 或 'none'
  contrast: 'more', // 或 'no-preference'
});

test('my test with reduced motion, forced colors and more contrast', async ({ page }) => {
  // ...
});
```

```js [Library]
// 使用减少动画、强制颜色和更高对比度创建上下文
const context = await browser.newContext({
  reducedMotion: 'reduce', // 或 'no-preference'
  forcedColors: 'active', // 或 'none'
  contrast: 'more', // 或 'no-preference'
});

// 更改页面的媒体特性
await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active', contrast: 'more' });
```

:::

## 用户代理

用户代理包含在设备中，因此您很少需要更改它，但是如果您确实需要测试不同的用户代理，您可以使用 `userAgent` 属性覆盖它。

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({ userAgent: 'My user agent' });

test('my user agent test', async ({ page }) => {
  // ...
});
```

```js [Library]
const context = await browser.newContext({
  userAgent: 'My user agent'
});
```

:::

## 离线

模拟网络离线状态。

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

::: info
离线模拟影响 HTTP 请求，如页面导航、`fetch()` 和 `XMLHttpRequest`。

WebSocket 行为取决于浏览器以及连接是否已建立。Chromium 和 Firefox 在离线时会使新的 WebSocket 连接失败，但不会关闭已打开的连接。Chromium 可以将传入消息延迟到上下文重新上线，而不是丢失它们；Firefox 可以在离线时继续传递消息。WebKit 可以在离线时允许新的 WebSocket 连接和已建立连接上的流量。不要依赖离线模拟来测试 WebSocket 消息丢失或连接关闭。

离线模拟不影响 WebRTC 流量：已建立的 `RTCPeerConnection` 继续通过 UDP 发送和接收媒体。要测试 WebRTC 连接丢失，请在浏览器外部中断连接，例如停止 TURN 服务器或使用操作系统级防火墙。
:::

## JavaScript 启用

模拟禁用 JavaScript 的用户场景。

::: code-group

```js [Test]
import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('test with no JavaScript', async ({ page }) => {
  // ...
});
```

```js [Library]
const context = await browser.newContext({
  javaScriptEnabled: false
});
```

:::
