---
title: "全局设置和清理"
---

# 全局设置和清理

## 介绍

配置全局设置和清理有两种方式：使用全局设置文件并在配置中的 [`globalSetup`](#选项-2-配置-globalsetup-和-globalteardown) 下设置，或使用[项目依赖](#选项-1-项目依赖)。使用项目依赖，你可以定义一个在所有其他项目之前运行的项目。这是推荐的方法，因为它与 Playwright 测试运行器集成得更好：你的 HTML 报告将包含全局设置，跟踪将被录制，并且可以使用夹具。有关两种方法的详细比较，请参见下表。

| 功能                          | 项目依赖（推荐） | `globalSetup`（配置选项）      |
|----------------------------------|-------------------------------------|-----------------------------------|
| 在所有测试之前运行            | ✅ 是                              | ✅ 是         |
| HTML 报告可见性           | ✅ 显示为单独的项目      | ❌ 不显示                       |
| 跟踪录制                  | ✅ 完整跟踪可用             | ❌ 不支持                   |
| Playwright 夹具              | ✅ 完全支持                  | ❌ 不支持                   |
| 浏览器管理               | ✅ 通过 `browser` 夹具            | ❌ 需要通过 `browserType.launch()` 手动管理 |
| 并行和重试          | ✅ 通过标准配置支持    | ❌ 不适用                  |
| 配置选项如 `headless` 或 `testIdAttribute`  | ✅ 自动应用            | ❌ 被忽略                              |

## 选项 1: 项目依赖

[项目依赖](./api/class-testproject#test-project-dependencies)是需要在另一个项目中的测试运行之前运行的项目列表。它们可用于配置全局设置操作，以便一个项目依赖于首先运行此操作。使用依赖允许全局设置生成跟踪和其他产物。

### 设置

首先，我们添加一个名为 'setup db' 的新项目。然后我们给它一个 [`testProject.testMatch`](/api/class-testproject#test-project-test-match) 属性以匹配名为 `global.setup.ts` 的文件：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // ...
  projects: [
    {
      name: 'setup db',
      testMatch: /global\.setup\.ts/,
    },
    // {
    //   其他项目
    // }
  ]
});
```

:::

然后我们将 [`testProject.dependencies`](/api/class-testproject#test-project-dependencies) 属性添加到依赖于设置项目的项目中，并将依赖项目的名称（我们在上一步中定义的）传入数组：

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // ...
  projects: [
    {
      name: 'setup db',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'chromium with db',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup db'],
    },
  ]
});
```

:::

在此示例中，'chromium with db' 项目依赖于 'setup db' 项目。然后我们创建一个存储在项目根级别的设置测试（注意设置和清理代码必须通过调用 [test()](./api/class-test#test-call) 函数定义为常规测试）：

::: code-group

```js [tests/global.setup.ts]
import { test as setup } from '@playwright/test';

setup('create new database', async ({ }) => {
  console.log('creating new database...');
  // 初始化数据库
});
```

:::

::: code-group

```js [tests/menu.spec.ts]
import { test, expect } from '@playwright/test';

test('menu', async ({ page }) => {
  // 依赖于数据库的测试
});
```

:::

### 清理

你可以通过向设置项目添加 [`testProject.teardown`](/api/class-testproject#test-project-teardown) 属性来清理设置。这将在所有依赖项目运行后运行。

首先，我们将 [`testProject.teardown`](/api/class-testproject#test-project-teardown) 属性添加到设置项目，名称为 'cleanup db'，这是我们在上一步中给清理项目起的名字：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // ...
  projects: [
    {
      name: 'setup db',
      testMatch: /global\.setup\.ts/,
      teardown: 'cleanup db',
    },
    {
      name: 'cleanup db',
      testMatch: /global\.teardown\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup db'],
    },
  ]
});
```

:::

然后我们在项目的 tests 目录中创建一个 `global.teardown.ts` 文件。这将用于在所有测试运行后从数据库中删除数据。

::: code-group

```js [tests/global.teardown.ts]
import { test as teardown } from '@playwright/test';

teardown('delete database', async ({ }) => {
  console.log('deleting test database...');
  // 删除数据库
});
```

:::

### 测试过滤

所有测试过滤选项，如 `--grep`/`--grep-invert`、`--shard`、在命令行中直接按位置过滤，或使用 [`test.only()`](./api/class-test.md#test-only)，都直接选择要运行的主要测试。如果这些测试属于有依赖的项目，那么这些依赖中的所有测试也将运行。

你可以传递 `--no-deps` 命令行选项来忽略所有依赖和清理。只有你直接选择的项目将运行。

### 更多示例

有关更详细的示例，请查看：
- 我们的[认证](./auth.md)指南
- 我们的博客文章 [A better global setup in Playwright reusing login with project dependencies](https://dev.to/playwright/a-better-global-setup-in-playwright-reusing-login-with-project-dependencies-14)
- [v1.31 发布视频](https://youtu.be/PI50YAPTAs4)查看演示

## 选项 2: 配置 globalSetup 和 globalTeardown

你可以使用[配置文件](./test-configuration.md#advanced-configuration)中的 `globalSetup` 选项在运行所有测试之前设置一些东西。全局设置文件必须导出一个接受配置对象的单一函数。此函数将在所有测试之前运行一次。

类似地，使用 `globalTeardown` 在所有测试之后运行一次某些操作。或者，让 `globalSetup` 返回一个函数，该函数将用作全局清理。你可以使用环境变量从全局设置向测试传递数据，如端口号、认证令牌等。

::: info
请注意 `globalSetup` 和 `globalTeardown` 缺少一些功能——参见[介绍](#介绍)部分的详细比较。考虑使用[项目依赖](#选项-1-项目依赖)以获得完整的功能支持。
:::

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});
```

:::

### 示例

这是一个全局设置示例，它进行一次认证并在测试中重用认证状态。它使用配置文件中的 `baseURL` 和 `storageState` 选项。

::: code-group

```js [global-setup.ts]
import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(baseURL!);
  await page.getByLabel('User Name').fill('user');
  await page.getByLabel('Password').fill('password');
  await page.getByText('Sign in').click();
  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;
```

:::

在配置文件中指定 `globalSetup`、`baseURL` 和 `storageState`。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  use: {
    baseURL: 'http://localhost:3000/',
    storageState: 'state.json',
  },
});
```

:::

测试启动时已经认证，因为我们指定了由全局设置填充的 `storageState`。

```js
import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/');
  // 你已登录！
});
```

你可以通过 `process.env` 将任意数据从全局设置文件传递给测试，方法是将它们设置为环境变量。

::: code-group

```js [global-setup.ts]
import type { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  process.env.FOO = 'some data';
  // 或者以 JSON 形式传递更复杂的数据结构：
  process.env.BAR = JSON.stringify({ some: 'data' });
}

export default globalSetup;
```

:::

测试可以访问在全局设置中设置的 `process.env` 属性。

```js
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // 在 globalSetup 中设置的环境变量仅在 test() 内部可用。
  const { FOO, BAR } = process.env;

  // FOO 和 BAR 属性已填充。
  expect(FOO).toEqual('some data');

  const complexData = JSON.parse(BAR);
  expect(complexData).toEqual({ some: 'data' });
});
```

### 在全局设置期间捕获失败的跟踪

在某些情况下，捕获全局设置期间遇到的失败的跟踪可能很有用。为此，你必须在设置中[开始跟踪](./api/class-tracing.md#tracing-start)，并且必须确保在抛出错误之前[停止跟踪](./api/class-tracing.md#tracing-stop)。这可以通过将设置包装在 `try...catch` 块中来实现。以下是扩展全局设置示例以捕获跟踪的示例。

::: code-group

```js [global-setup.ts]
import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await context.tracing.start({ screenshots: true, snapshots: true });
    await page.goto(baseURL!);
    await page.getByLabel('User Name').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByText('Sign in').click();
    await context.storageState({ path: storageState as string });
    await context.tracing.stop({
      path: './test-results/setup-trace.zip',
    });
    await browser.close();
  } catch (error) {
    await context.tracing.stop({
      path: './test-results/failed-setup-trace.zip',
    });
    await browser.close();
    throw error;
  }
}

export default globalSetup;
```

:::
