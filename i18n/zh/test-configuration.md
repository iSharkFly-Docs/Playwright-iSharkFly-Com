---
title: "配置"
---

# 配置

## 简介

Playwright 有许多选项来配置测试的运行方式。你可以在配置文件中指定这些选项。注意，测试运行器选项是**顶级**的，不要将它们放在 `use` 部分。

## 基本配置

以下是一些最常见的配置选项。

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 在相对于此配置文件的 "tests" 目录中查找测试文件。
  testDir: 'tests',

  // 并行运行所有测试。
  fullyParallel: true,

  // 如果你在源代码中意外留下了 test.only，则在 CI 上构建失败。
  forbidOnly: !!process.env.CI,

  // 仅在 CI 上重试。
  retries: process.env.CI ? 2 : 0,

  // 在 CI 上不使用并行测试。
  workers: process.env.CI ? 1 : undefined,

  // 限制整个测试运行，使其以报告失败而不是挂起。
  globalTimeout: 60 * 60 * 1000,

  // 要使用的报告器
  reporter: 'html',

  use: {
    // 用于 `await page.goto('/')` 等操作的基础 URL。
    baseURL: 'http://localhost:3000',

    // 在重试失败测试时收集跟踪。
    trace: 'on-first-retry',
  },
  // 为主要浏览器配置项目。
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // 在开始测试之前运行本地开发服务器。
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

| 选项 | 描述 |
| :- | :- |
| [`testConfig.forbidOnly`](/api/class-testconfig#test-config-forbid-only) | 如果任何测试被标记为 `test.only`，是否以错误退出。在 CI 上很有用。|
| [`testConfig.fullyParallel`](/api/class-testconfig#test-config-fully-parallel) | 让所有文件中的所有测试并行运行。有关更多详情，请参阅[并行性](./test-parallel)和[分片](./test-sharding)。|
| [`testConfig.globalTimeout`](/api/class-testconfig#test-config-global-timeout) | 整个测试运行可以花费的最长时间。当达到此时间时，Playwright 停止运行，报告器仍会生成报告。有关更多信息，请参阅[超时](./test-timeouts.md)。|
| [`testConfig.projects`](/api/class-testconfig#test-config-projects) | 在多个配置或多个浏览器中运行测试 |
| [`testConfig.reporter`](/api/class-testconfig#test-config-reporter) | 要使用的报告器。有关可用报告器的更多信息，请参阅[测试报告器](/test-reporters.md)。|
| [`testConfig.retries`](/api/class-testconfig#test-config-retries) | 每个测试的最大重试次数。有关重试的更多信息，请参阅[测试重试](/test-retries.md)。|
| [`testConfig.testDir`](/api/class-testconfig#test-config-test-dir) | 包含测试文件的目录。|
| [`testConfig.use`](/api/class-testconfig#test-config-use) | `use{}` 中的选项 |
| [`testConfig.webServer`](/api/class-testconfig#test-config-web-server) | 要在测试期间启动服务器，请使用 `webServer` 选项 |
| [`testConfig.workers`](/api/class-testconfig#test-config-workers) | 用于并行化测试的最大并发工作进程数。也可以设置为逻辑 CPU 核心的百分比，例如 `'50%'`。有关更多详情，请参阅[并行性](./test-parallel)和[分片](./test-sharding)。|

## 过滤测试

通过 glob 模式或正则表达式过滤测试。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 要忽略测试文件的 Glob 模式或正则表达式。
  testIgnore: '*test-assets',

  // 匹配测试文件的 Glob 模式或正则表达式。
  testMatch: '*todo-tests/*.spec.ts',
});
```

:::

| 选项 | 描述 |
| :- | :- |
| [`testConfig.testIgnore`](/api/class-testconfig#test-config-test-ignore) | 在查找测试文件时应忽略的 Glob 模式或正则表达式。例如，`'*test-assets'` |
| [`testConfig.testMatch`](/api/class-testconfig#test-config-test-match) | 匹配测试文件的 Glob 模式或正则表达式。例如，`'*todo-tests/*.spec.ts'`。默认情况下，Playwright 运行 <code>**/*.@(spec&#124;test).?(c&#124;m)[jt]s?(x)</code> 文件。|

## 高级配置

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 用于测试产物（如截图、视频、跟踪等）的文件夹。
  outputDir: 'test-results',

  // 全局设置文件的路径。
  globalSetup: require.resolve('./global-setup'),

  // 全局清理文件的路径。
  globalTeardown: require.resolve('./global-teardown'),

  // 每个测试有 30 秒。
  timeout: 30000,

});
```

:::

| 选项 | 描述 |
| :- | :- |
| [`testConfig.globalSetup`](/api/class-testconfig#test-config-global-setup) | 全局设置文件的路径。此文件将被引入并在所有测试之前运行。它必须导出一个函数。|
| [`testConfig.globalTeardown`](/api/class-testconfig#test-config-global-teardown) | 全局清理文件的路径。此文件将被引入并在所有测试之后运行。它必须导出一个函数。|
| [`testConfig.outputDir`](/api/class-testconfig#test-config-output-dir) | 用于测试产物（如截图、视频、跟踪等）的文件夹。|
| [`testConfig.timeout`](/api/class-testconfig#test-config-timeout) | Playwright 为每个测试强制执行[超时](./test-timeouts.md)，默认为 30 秒。测试函数、测试夹具和 beforeEach 钩子花费的时间都包含在测试超时中。|

## Expect 选项

expect 断言库的配置。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    // expect() 应等待条件满足的最长时间。
    timeout: 5000,

    toHaveScreenshot: {
      // 可接受的不同像素数量，默认未设置。
      maxDiffPixels: 10,
    },

    toMatchSnapshot: {
      // 不同像素与总像素的可接受比率，
      // 介于 0 和 1 之间。
      maxDiffPixelRatio: 0.1,
    },
  },

});
```

:::

| 选项 | 描述 |
| :- | :- |
| [`testConfig.expect`](/api/class-testconfig#test-config-expect) | 像 `expect(locator).toHaveText()` 这样的 [Web 优先断言](./test-assertions.md)默认有 5 秒的单独超时。这是 `expect()` 应等待条件满足的最长时间。了解更多关于[测试和 expect 超时](./test-timeouts.md)以及如何为单个测试设置它们。|
| [`pageAssertions.toHaveScreenshot()`](/api/class-pageassertions#page-assertions-to-have-screenshot-1) | `expect(locator).toHaveScreenshot()` 方法的配置。|
| [`snapshotAssertions.toMatchSnapshot()`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1)| `expect(locator).toMatchSnapshot()` 方法的配置。|
