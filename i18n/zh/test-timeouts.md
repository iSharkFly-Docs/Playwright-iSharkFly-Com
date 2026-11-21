---
title: "超时"
---

# 超时

Playwright Test 针对各种任务有多个可配置的超时。

|超时    |默认值             |描述                      |
|:----------|:----------------|:--------------------------------|
|测试超时|30_000 毫秒|每个测试的超时<br/><span style="text-transform: uppercase; font-size: smaller; font-weight: bold; opacity: 0.7">在配置中设置</span><br/><code v-pre>{ timeout: 60_000 }</code><br/><span style="text-transform: uppercase; font-size: smaller; font-weight: bold; opacity: 0.7">在测试中覆盖</span><br/>`test.setTimeout(120_000)` |
|Expect 超时|5_000 毫秒|每个断言的超时<br/><span style="text-transform: uppercase; font-size: smaller; font-weight: bold; opacity: 0.7">在配置中设置</span><br/><code v-pre>{ expect: { timeout: 10_000 } }</code><br/><span style="text-transform: uppercase; font-size: smaller; font-weight: bold; opacity: 0.7">在测试中覆盖</span><br/>`expect(locator).toBeVisible({ timeout: 10_000 })` |

## 测试超时

Playwright Test 为每个测试强制执行超时，默认为 30 秒。测试函数、夹具设置和 `beforeEach` 钩子花费的时间都包含在测试超时中。

超时的测试会产生以下错误：

```txt
example.spec.ts:3:1 › basic test ===========================

Test timeout of 30000ms exceeded.
```

额外的单独超时（相同值）在测试函数完成后，由夹具清理和 `afterEach` 钩子共享。

同样的超时值也适用于 `beforeAll` 和 `afterAll` 钩子，但它们不与任何测试共享时间。

### 在配置中设置测试超时

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 120_000,
});
```

:::

API 参考：[`testConfig.timeout`](/api/class-testconfig#test-config-timeout)。

### 为单个测试设置超时

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

test('slow test', async ({ page }) => {
  test.slow(); // 将默认超时增加三倍的简单方法
  // ...
});

test('very slow test', async ({ page }) => {
  test.setTimeout(120_000);
  // ...
});
```

:::

API 参考：[`test.setTimeout()`](/api/class-test#test-set-timeout) 和 [`test.slow()`](/api/class-test#test-slow)。

### 从 `beforeEach` 钩子更改超时

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  // 为运行此钩子的所有测试延长 30 秒超时。
  testInfo.setTimeout(testInfo.timeout + 30_000);
});
```

:::

API 参考：[`testInfo.setTimeout()`](/api/class-testinfo#test-info-set-timeout)。

### 更改 `beforeAll`/`afterAll` 钩子的超时

`beforeAll` 和 `afterAll` 钩子有单独的超时，默认等于测试超时。你可以通过在钩子内部调用 [`testInfo.setTimeout()`](/api/class-testinfo#test-info-set-timeout) 来为每个钩子单独更改它。

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

test.beforeAll(async () => {
  // 为此钩子设置超时。
  test.setTimeout(60000);
});
```

:::

API 参考：[`testInfo.setTimeout()`](/api/class-testinfo#test-info-set-timeout)。

## Expect 超时

像 [`locatorAssertions.toHaveText()`](/api/class-locatorassertions#locator-assertions-to-have-text) 这样的自动重试断言有单独的超时，默认为 5 秒。断言超时与测试超时无关。它会产生以下错误：

```txt
example.spec.ts:3:1 › basic test ===========================

Error: expect(received).toHaveText(expected)

Expected string: "my text"
Received string: ""
Call log:
  - expect.toHaveText with timeout 5000ms
  - waiting for "locator('button')"
```

### 在配置中设置 expect 超时

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
});
```

:::

API 参考：[`testConfig.expect`](/api/class-testconfig#test-config-expect)。

### 为单个断言指定 expect 超时

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

test('example', async ({ page }) => {
  await expect(locator).toHaveText('hello', { timeout: 10_000 });
});
```

:::

## 全局超时

Playwright Test 支持整个测试运行的超时。这可以防止一切出错时过度使用资源。没有默认的全局超时，但你可以在配置中设置一个合理的值，例如一小时。全局超时会产生以下错误：

```txt
Running 1000 tests using 10 workers

  514 skipped
  486 passed
  Timed out waiting 3600s for the test suite to run
```

你可以在配置中设置全局超时。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalTimeout: 3_600_000,
});
```

:::

API 参考：[`testConfig.globalTimeout`](/api/class-testconfig#test-config-global-timeout)。

## 高级：低级超时

这些是由测试运行器预配置的低级超时，你不应该需要更改它们。
如果你恰好在本节中因为测试不稳定，你很可能应该在其他地方寻找解决方案。

|超时    |默认值             |描述                      |
|:----------|:----------------|:--------------------------------|
|操作超时| 无超时 |每个操作的超时<br/><span style="text-transform: uppercase; font-size: smaller; font-weight: bold; opacity: 0.7">在配置中设置</span><br/><code v-pre>{ use: { actionTimeout: 10_000 } }</code><br/><span style="text-transform: uppercase; font-size: smaller; font-weight: bold; opacity: 0.7">在测试中覆盖</span><br/>`locator.click({ timeout: 10_000 })` |
|导航超时| 无超时 |每个导航操作的超时<br/><span style="text-transform: uppercase; font-size: smaller; font-weight: bold; opacity: 0.7">在配置中设置</span><br/><code v-pre>{ use: { navigationTimeout: 30_000 } }</code><br/><span style="text-transform: uppercase; font-size: smaller; font-weight: bold; opacity: 0.7">在测试中覆盖</span><br/>`page.goto('/', { timeout: 30_000 })` |
|全局超时|无超时 |整个测试运行的全局超时<br/><span style="text-transform: uppercase; font-size: smaller; font-weight: bold; opacity: 0.7">在配置中设置</span><br/>`{ globalTimeout: 3_600_000 }`<br/> |
|`beforeAll`/`afterAll` 超时|30_000 毫秒|钩子的超时<br/><span style="text-transform: uppercase; font-size: smaller; font-weight: bold; opacity: 0.7">在钩子中设置</span><br/>`test.setTimeout(60_000)`<br/> |
|夹具超时|无超时 |单个夹具的超时<br/><span style="text-transform: uppercase; font-size: smaller; font-weight: bold; opacity: 0.7">在夹具中设置</span><br/>`{ scope: 'test', timeout: 30_000 }`<br/> |

### 在配置中设置操作和导航超时

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },
});
```

:::

API 参考：[`testOptions.actionTimeout`](/api/class-testoptions#test-options-action-timeout) 和 [`testOptions.navigationTimeout`](/api/class-testoptions#test-options-navigation-timeout)。

### 为单个操作设置超时

::: code-group

```js [example.spec.ts]
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev', { timeout: 30000 });
  await page.getByText('Get Started').click({ timeout: 10000 });
});
```

:::

## 夹具超时

默认情况下，[夹具](./test-fixtures)与测试共享超时。但是，对于慢速夹具，特别是[工作进程作用域](./test-fixtures#工作进程作用域的夹具)的夹具，有一个单独的超时很方便。这样你可以保持整体测试超时较小，并给慢速夹具更多时间。

::: code-group

```js [example.spec.ts]
import { test as base, expect } from '@playwright/test';

const test = base.extend<{ slowFixture: string }>({
  slowFixture: [async ({}, use) => {
    // ... 执行慢速操作 ...
    await use('hello');
  }, { timeout: 60_000 }]
});

test('example test', async ({ slowFixture }) => {
  // ...
});
```

:::

API 参考：[`test.extend()`](/api/class-test#test-extend)。
