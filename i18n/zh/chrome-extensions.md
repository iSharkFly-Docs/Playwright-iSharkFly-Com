---
title: "Chrome 扩展"
---

# Chrome 扩展

## 简介

::: info
扩展仅在使用持久化上下文启动 Chromium 时有效。使用自定义浏览器参数需自行承担风险，因为其中一些可能会破坏 Playwright 功能。

Google Chrome 和 Microsoft Edge [移除了侧载扩展所需的命令行标志](https://groups.google.com/a/chromium.org/g/chromium-extensions/c/FxMU1TvxWWg/m/daZVTYNlBQAJ)，因此请使用 Playwright 捆绑的 Chromium。
:::

以下代码片段获取位于 `./my-extension` 的 [Manifest v3](https://developer.chrome.com/docs/extensions/develop/migrate) 扩展的 [service worker](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers)。

请注意使用 `chromium` 通道，它允许在无头模式下运行扩展。或者，你可以在有头模式下启动浏览器。

```js
const { chromium } = require('playwright');

(async () => {
  const pathToExtension = require('path').join(__dirname, 'my-extension');
  const userDataDir = '/tmp/test-user-data-dir';
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium',
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`
    ]
  });
  let [serviceWorker] = browserContext.serviceWorkers();
  if (!serviceWorker)
    serviceWorker = await browserContext.waitForEvent('serviceworker');

  // 像测试任何其他 worker 一样测试 service worker。
  await browserContext.close();
})();
```

## Service Worker 空闲挂起（MV3）

Chrome MV3 的 service worker 在大约 30 秒不活动后会自动挂起，并按需重新启动。当这种情况发生时，Playwright 会保持**相同的 [Worker](/api/class-worker) 对象存活** — 不会触发新的 `'serviceworker'` 事件。在重启期间发出的新 `evaluate()` 调用会被暂停，直到新的上下文准备就绪，然后自动恢复：

```js
const sw = await context.waitForEvent('serviceworker');

// ... 30 秒不活动后 SW 挂起并被浏览器重新启动 ...

// 现有的句柄在重启过程中是透明的。
await sw.evaluate(() => sendMessage({ type: 'ping' })); // 直接工作
```

::: info
在挂起的确切时刻正在进行的 `evaluate()` 调用将抛出 `"Service worker restarted"` 错误，这与页面导航过程中的行为一致。
:::

## 测试

要在运行测试时加载扩展，你可以使用测试 fixture 来设置上下文。你还可以动态获取扩展 ID，并使用它来加载和测试弹出页面等。

请注意使用 `chromium` 通道，它允许在无头模式下运行扩展。或者，你可以在有头模式下启动浏览器。

首先，添加将加载扩展的 fixture：

::: code-group

```js [fixtures.ts]
import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({ }, use) => {
    const pathToExtension = path.join(__dirname, 'my-extension');
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    // 对于 manifest v3：
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker)
      serviceWorker = await context.waitForEvent('serviceworker');

    const extensionId = serviceWorker.url().split('/')[2];
    await use(extensionId);
  },
});
export const expect = test.expect;
```

:::

然后在测试中使用这些 fixture：

```js
import { test, expect } from './fixtures';

test('example test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('body')).toHaveText('Changed by my-extension');
});

test('popup page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator('body')).toHaveText('my-extension popup');
});
```
