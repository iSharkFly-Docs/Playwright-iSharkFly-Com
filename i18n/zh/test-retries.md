---
title: "重试"
---

# 重试

## 简介

测试重试是一种在测试失败时自动重新运行测试的方式。这在测试不稳定且间歇性失败时很有用。测试重试在[配置文件](./test-configuration.md)中配置。

## 失败

Playwright Test 在工作进程中运行测试。这些进程是操作系统进程，独立运行，由测试运行器协调。所有工作进程具有相同的环境，每个进程都启动自己的浏览器。

考虑以下代码片段：

```js
import { test } from '@playwright/test';

test.describe('测试套件', () => {
  test.beforeAll(async () => { /* ... */ });
  test('第一个正常', async ({ page }) => { /* ... */ });
  test('第二个不稳定', async ({ page }) => { /* ... */ });
  test('第三个正常', async ({ page }) => { /* ... */ });
  test.afterAll(async () => { /* ... */ });
});
```

当**所有测试通过**时，它们将按顺序在同一个工作进程中运行。
* 工作进程启动
  * `beforeAll` 钩子运行
  * `第一个正常` 通过
  * `第二个不稳定` 通过
  * `第三个正常` 通过
  * `afterAll` 钩子运行

如果**任何测试失败**，Playwright Test 将丢弃整个工作进程以及浏览器，并启动一个新的。测试将从下一个测试开始在新的工作进程中继续。
* 工作进程 #1 启动
  * `beforeAll` 钩子运行
  * `第一个正常` 通过
  * `第二个不稳定` 失败
  * `afterAll` 钩子运行
* 工作进程 #2 启动
  * `beforeAll` 钩子再次运行
  * `第三个正常` 通过
  * `afterAll` 钩子运行

如果你**启用[重试](#重试)**，第二个工作进程将从重试失败的测试开始，然后从那里继续。
* 工作进程 #1 启动
  * `beforeAll` 钩子运行
  * `第一个正常` 通过
  * `第二个不稳定` 失败
  * `afterAll` 钩子运行
* 工作进程 #2 启动
  * `beforeAll` 钩子再次运行
  * `第二个不稳定` 重试并通过
  * `第三个正常` 通过
  * `afterAll` 钩子运行

这种方案非常适合独立测试，并保证失败的测试不会影响健康的测试。

## 重试

Playwright 支持**测试重试**。启用后，失败的测试将重试多次，直到通过或达到最大重试次数。默认情况下，失败的测试不会重试。

```bash
# 给失败的测试 3 次重试机会
npx playwright test --retries=3
```

你可以在配置文件中配置重试：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 给失败的测试 3 次重试机会
  retries: 3,
});
```

:::

Playwright Test 将按以下方式对测试进行分类：
- "passed" - 第一次运行就通过的测试；
- "flaky" - 第一次运行失败，但重试后通过的测试；
- "failed" - 第一次运行失败，所有重试也都失败的测试。

```bash
Running 3 tests using 1 worker

  ✓ example.spec.ts:4:2 › first passes (438ms)
  x example.spec.ts:5:2 › second flaky (691ms)
  ✓ example.spec.ts:5:2 › second flaky (522ms)
  ✓ example.spec.ts:6:2 › third passes (932ms)

  1 flaky
    example.spec.ts:5:2 › second flaky
  2 passed (4s)
```

你可以在运行时使用 [`testInfo.retry`](/api/class-testinfo#test-info-retry) 检测重试，它可以在任何测试、钩子或夹具中访问。这是一个在重试前清除服务器端状态的示例。

```js
import { test, expect } from '@playwright/test';

test('我的测试', async ({ page }, testInfo) => {
  if (testInfo.retry)
    await cleanSomeCachesOnTheServer();
  // ...
});
```

你可以使用 [`test.describe.configure()`](/api/class-test#test-describe-configure) 为特定的测试组或单个文件指定重试次数。

```js
import { test, expect } from '@playwright/test';

test.describe(() => {
  // 这个 describe 组中的所有测试将获得 2 次重试机会。
  test.describe.configure({ retries: 2 });

  test('测试 1', async ({ page }) => {
    // ...
  });

  test('测试 2', async ({ page }) => {
    // ...
  });
});
```

### 条件重试

重试次数可以根据错误而不同。提供一个条目列表，每个条目有一个 `count` 和一个可选的 `condition` 正则表达式。每次失败尝试后，条件匹配该尝试错误消息的条目中最大的 `count` 将被应用。没有条件的条目总是适用。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: [
    // 任何失败重试一次。
    { count: 1 },
    // 当浏览器或工作进程崩溃时最多重试三次。
    { count: 3, condition: /Target crashed|worker process exited unexpectedly/ },
  ],
});
```

:::

工作进程崩溃和超时会像任何其他失败一样通过其错误消息进行匹配。最后一次失败的尝试决定结果：一个先崩溃后断言失败的测试只会获得断言失败的重试次数。

## 串行模式

使用 [`test.describe.serial()`](/api/class-test#test-describe-serial) 将依赖的测试分组，以确保它们始终一起按顺序运行。如果其中一个测试失败，所有后续测试都会被跳过。组中的所有测试会一起重试。

考虑以下使用 `test.describe.serial` 的代码片段：

```js
import { test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => { /* ... */ });
test('第一个正常', async ({ page }) => { /* ... */ });
test('第二个不稳定', async ({ page }) => { /* ... */ });
test('第三个正常', async ({ page }) => { /* ... */ });
```

在没有[重试](#重试)的情况下运行时，失败后的所有测试都会被跳过：
* 工作进程 #1：
  * `beforeAll` 钩子运行
  * `第一个正常` 通过
  * `第二个不稳定` 失败
  * `第三个正常` 被完全跳过

在启用[重试](#重试)的情况下运行时，所有测试会一起重试：
* 工作进程 #1：
  * `beforeAll` 钩子运行
  * `第一个正常` 通过
  * `第二个不稳定` 失败
  * `第三个正常` 被跳过
* 工作进程 #2：
  * `beforeAll` 钩子再次运行
  * `第一个正常` 再次通过
  * `第二个不稳定` 通过
  * `第三个正常` 通过

::: info
通常最好让你的测试保持隔离，这样它们可以高效地独立运行和重试。
:::

## 在测试之间重用单个页面

Playwright Test 为每个测试创建一个隔离的 [Page](/api/class-page) 对象。但是，如果你想在多个测试之间重用单个 [Page](/api/class-page) 对象，你可以在 [`test.beforeAll()`](/api/class-test#test-before-all) 中创建它，并在 [`test.afterAll()`](/api/class-test#test-after-all) 中关闭它。

::: code-group

```js [JavaScript]
// @ts-check

const { test } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

/** @type {import('@playwright/test').Page} */
let page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('首先运行', async () => {
  await page.goto('https://playwright.dev/');
});

test('其次运行', async () => {
  await page.getByText('Get Started').click();
});
```

```js [TypeScript]
import { test, type Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('首先运行', async () => {
  await page.goto('https://playwright.dev/');
});

test('其次运行', async () => {
  await page.getByText('Get Started').click();
});
```

:::
