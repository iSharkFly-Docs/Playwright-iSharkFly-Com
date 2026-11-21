---
title: "库"
---

# 库

## 简介

Playwright 库提供了用于启动和与浏览器交互的统一 API，而 Playwright Test 除了提供这些功能外，还提供了一个完全托管的端到端测试运行器和体验。

在大多数情况下，对于端到端测试，你会想要使用 `@playwright/test`（Playwright Test），而不是直接使用 `playwright`（Playwright 库）。要开始使用 Playwright Test，请遵循[入门指南](./intro.md)。

## 使用库时的差异

### 库示例

以下是使用 Playwright 库直接启动 Chromium、访问页面并检查其标题的示例：

::: code-group

```js [TypeScript]
import { chromium, devices } from 'playwright';
import assert from 'node:assert';

(async () => {
  // 设置
  const browser = await chromium.launch();
  const context = await browser.newContext(devices['iPhone 11']);
  const page = await context.newPage();

  // 实际有趣的部分
  await context.route('**.jpg', route => route.abort());
  await page.goto('https://example.com/');

  assert(await page.title() === 'Example Domain'); // 👎 不是 Web 优先断言

  // 清理
  await context.close();
  await browser.close();
})();
```

```js [JavaScript]
const assert = require('node:assert');
const { chromium, devices } = require('playwright');

(async () => {
  // 设置
  const browser = await chromium.launch();
  const context = await browser.newContext(devices['iPhone 11']);
  const page = await context.newPage();

  // 实际有趣的部分
  await context.route('**.jpg', route => route.abort());
  await page.goto('https://example.com/');

  assert(await page.title() === 'Example Domain'); // 👎 不是 Web 优先断言

  // 清理
  await context.close();
  await browser.close();
})();
```

:::

使用 `node my-script.js` 运行。

### 测试示例

实现类似行为的测试如下所示：

::: code-group

```js [TypeScript]
import { expect, test, devices } from '@playwright/test';

test.use(devices['iPhone 11']);

test('should be titled', async ({ page, context }) => {
  await context.route('**.jpg', route => route.abort());
  await page.goto('https://example.com/');

  await expect(page).toHaveTitle('Example');
});
```

```js [JavaScript]
const { expect, test, devices } = require('@playwright/test');

test.use(devices['iPhone 11']);

test('should be titled', async ({ page, context }) => {
  await context.route('**.jpg', route => route.abort());
  await page.goto('https://example.com/');

  await expect(page).toHaveTitle('Example');
});
```

:::

使用 `npx playwright test` 运行。

### 主要差异

需要注意的主要差异如下：

| | 库 | 测试 |
| - | - | - |
| 安装 | `npm install playwright` | `npm init playwright@latest` - 注意 `install` 与 `init` 的区别 |
| 安装浏览器 | 安装 `@playwright/browser-chromium`、`@playwright/browser-firefox` 和/或 `@playwright/browser-webkit` | `npx playwright install` 或 `npx playwright install chromium` 安装单个浏览器 |
| `import` 来源 | `playwright` | `@playwright/test` |
| 初始化 | 需要显式地：<ol><li>选择要使用的浏览器，例如 `chromium`</li><li>使用 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 启动浏览器</li><li>使用 [`browser.newContext()`](/api/class-browser#browser-new-context) 创建上下文，<em>并</em>显式传递任何上下文选项，例如 `devices['iPhone 11']`</li><li>使用 [`browserContext.newPage()`](/api/class-browsercontext#browser-context-new-page) 创建页面</li></ol> | 每个测试都开箱即用地提供独立的 `page` 和 `context`，以及其他[内置 fixture](./test-fixtures.md#built-in-fixtures)。无需显式创建。如果测试在其参数中引用它们，测试运行器将为测试创建它们。（即延迟初始化）|
| 断言 | 没有内置的 Web 优先断言 | [Web 优先断言](./test-assertions.md) 如：<ul><li>[`pageAssertions.toHaveTitle()`](/api/class-pageassertions#page-assertions-to-have-title)</li><li>[`pageAssertions.toHaveScreenshot()`](/api/class-pageassertions#page-assertions-to-have-screenshot-1)</li></ul> 自动等待并重试直到条件满足。|
| 超时 | 大多数操作默认 30 秒。 | 大多数操作不会超时，但每个测试都有一个使其失败的超时（默认 30 秒）。 |
| 清理 | 需要显式地：<ol><li>使用 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 关闭上下文</li><li>使用 [`browser.close()`](/api/class-browser#browser-close) 关闭浏览器</li></ol> | 无需显式关闭[内置 fixture](./test-fixtures.md#built-in-fixtures)；测试运行器会处理它。
| 运行 | 使用库时，你将代码作为 node 脚本运行，可能需要先进行一些编译。 | 使用测试运行器时，你使用 `npx playwright test` 命令。配合你的[配置](./test-configuration.md)，测试运行器会处理任何编译以及选择运行什么和如何运行。 |

除了上述内容，Playwright Test 作为一个功能完整的测试运行器，还包括：
- [配置矩阵和项目](./test-configuration.md)：在上面的示例中，在 Playwright 库版本中，如果我们想用不同的设备或浏览器运行，我们必须修改脚本并传递信息。使用 Playwright Test，我们只需在一个地方指定[配置矩阵](./test-configuration.md)，它就会在每个配置下运行这一个测试。
- [并行化](./test-parallel.md)
- [Web 优先断言](./test-assertions.md)
- [报告](./test-reporters.md)
- [重试](./test-retries.md)
- [轻松启用追踪](./trace-viewer-intro.md)
- 更多...

## 使用方法

使用 npm 或 Yarn 在你的 Node.js 项目中安装 Playwright 库。参见[系统要求](./intro.md#system-requirements)。

```bash
npm i -D playwright
```

你还需要安装浏览器 - 手动安装或添加一个会自动为你安装的包。

```bash
# 下载 Chromium、Firefox 和 WebKit 浏览器
npx playwright install chromium firefox webkit

# 或者，添加在 npm install 时会下载浏览器的包
npm i -D @playwright/browser-chromium @playwright/browser-firefox @playwright/browser-webkit
```

参见[管理浏览器](./browsers.md#managing-browser-binaries)了解更多选项。

安装完成后，你可以在 Node.js 脚本中导入 Playwright，并启动 3 种浏览器中的任何一种（`chromium`、`firefox` 和 `webkit`）。

```js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  // 创建页面，与 UI 元素交互，断言值
  await browser.close();
})();
```

Playwright API 是异步的，返回 Promise 对象。我们的代码示例使用 [async/await 模式](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await) 以提高可读性。代码被包装在一个调用自身的匿名异步箭头函数中。

```js
(async () => { // 异步箭头函数开始
  // 函数代码
  // ...
})(); // 函数结束并 () 调用自身
```

## 第一个脚本

在我们的第一个脚本中，我们将导航到 `https://playwright.dev/` 并在 WebKit 中截取屏幕截图。

```js
const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch();
  const page = await browser.newPage();
  await page.goto('https://playwright.dev/');
  await page.screenshot({ path: `example.png` });
  await browser.close();
})();
```

默认情况下，Playwright 以无头模式运行浏览器。要查看浏览器 UI，在启动浏览器时传递 `headless: false` 标志。你还可以使用 `slowMo` 来减慢执行速度。在调试工具[部分](./debug.md)了解更多。

```js
firefox.launch({ headless: false, slowMo: 50 });
```

## 录制脚本

[命令行工具](./test-cli.md)可用于录制用户交互并生成 JavaScript 代码。

```bash
npx playwright codegen wikipedia.org
```

## 浏览器下载

要下载 Playwright 浏览器，运行：

```bash
# 显式下载浏览器
npx playwright install
```

或者，你可以添加 `@playwright/browser-chromium`、`@playwright/browser-firefox` 和 `@playwright/browser-webkit` 包，以在包安装期间自动下载相应的浏览器。

```bash
# 使用在 npm install 时下载浏览器的辅助包
npm install @playwright/browser-chromium
```

**通过防火墙或代理下载**

传递 `HTTPS_PROXY` 环境变量以通过代理下载。

::: code-group

```bash [Bash]
# 手动
HTTPS_PROXY=https://192.0.2.1 npx playwright install

# 通过 @playwright/browser-chromium、@playwright/browser-firefox
# 和 @playwright/browser-webkit 辅助包
HTTPS_PROXY=https://192.0.2.1 npm install
```

```bat [Batch]
# 手动
set HTTPS_PROXY=https://192.0.2.1
npx playwright install

# 通过 @playwright/browser-chromium、@playwright/browser-firefox
# 和 @playwright/browser-webkit 辅助包
set HTTPS_PROXY=https://192.0.2.1
npm install
```

```powershell [PowerShell]
# 手动
$Env:HTTPS_PROXY=https://192.0.2.1
npx playwright install

# 通过 @playwright/browser-chromium、@playwright/browser-firefox
# 和 @playwright/browser-webkit 辅助包
$Env:HTTPS_PROXY=https://192.0.2.1
npm install
```

:::

**从制品仓库下载**

默认情况下，Playwright 从 Microsoft 的 CDN 下载浏览器。传递 `PLAYWRIGHT_DOWNLOAD_HOST` 环境变量以从内部制品仓库下载。

::: code-group

```bash [Bash]
# 手动
PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1 npx playwright install

# 通过 @playwright/browser-chromium、@playwright/browser-firefox
# 和 @playwright/browser-webkit 辅助包
PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1 npm install
```

```bat [Batch]
# 手动
set PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1
npx playwright install

# 通过 @playwright/browser-chromium、@playwright/browser-firefox
# 和 @playwright/browser-webkit 辅助包
set PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1
npm install
```

```powershell [PowerShell]
# 手动
$Env:PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1
npx playwright install

# 通过 @playwright/browser-chromium、@playwright/browser-firefox
# 和 @playwright/browser-webkit 辅助包
$Env:PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1
npm install
```

:::

**跳过浏览器下载**

在某些情况下，需要完全避免浏览器下载，因为浏览器二进制文件是单独管理的。这可以通过在安装包之前设置 `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` 变量来实现。

::: code-group

```bash [Bash]
# 当使用 @playwright/browser-chromium、@playwright/browser-firefox
# 和 @playwright/browser-webkit 辅助包时
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install
```

```bat [Batch]
# 当使用 @playwright/browser-chromium、@playwright/browser-firefox
# 和 @playwright/browser-webkit 辅助包时
set PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
npm install
```

```powershell [PowerShell]
# 当使用 @playwright/browser-chromium、@playwright/browser-firefox
# 和 @playwright/browser-webkit 辅助包时
$Env:PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
npm install
```

:::

## TypeScript 支持

Playwright 包含对 TypeScript 的内置支持。类型定义将自动导入。建议使用类型检查以改善 IDE 体验。

### 在 JavaScript 中

在 JavaScript 文件顶部添加以下内容以在 VS Code 或 WebStorm 中获得类型检查。

```js
// @ts-check
// ...
```

或者，你可以使用 JSDoc 为变量设置类型。

```js
/** @type {import('playwright').Page} */
let page;
```

### 在 TypeScript 中

TypeScript 支持开箱即用。类型也可以显式导入。

```js
let page: import('playwright').Page;
```
