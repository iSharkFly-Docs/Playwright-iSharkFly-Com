---
title: "项目"
---

# 项目

## 简介

项目是使用相同配置运行的一组逻辑测试。我们使用项目以便可以在不同的浏览器和设备上运行测试。项目在 `playwright.config.ts` 文件中配置，配置完成后，你可以在所有项目上运行测试，也可以只在特定项目上运行。你还可以使用项目在不同的配置中运行相同的测试。例如，你可以在已登录和未登录状态下运行相同的测试。

通过设置项目，你还可以运行一组具有不同超时时间或重试次数的测试，或者针对不同环境（如预发布和生产）运行一组测试，按功能包拆分测试等等。

## 为多个浏览器配置项目

通过使用**项目**，你可以在多个浏览器（如 chromium、webkit 和 firefox）以及品牌浏览器（如 Google Chrome 和 Microsoft Edge）上运行测试。Playwright 还可以在模拟的平板电脑和移动设备上运行。查看[设备参数注册表](https://github.com/microsoft/playwright/blob/main/packages/isomorphic/deviceDescriptorsSource.json)以获取所选桌面、平板和移动设备的完整列表。

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* 针对移动视口进行测试。 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* 针对品牌浏览器进行测试。 */
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge'
      },
    },
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
    },
  ],
});
```

## 运行项目

Playwright 默认会运行所有项目。

```bash
npx playwright test

Running 7 tests using 5 workers

  ✓ [chromium] › example.spec.ts:3:1 › basic test (2s)
  ✓ [firefox] › example.spec.ts:3:1 › basic test (2s)
  ✓ [webkit] › example.spec.ts:3:1 › basic test (2s)
  ✓ [Mobile Chrome] › example.spec.ts:3:1 › basic test (2s)
  ✓ [Mobile Safari] › example.spec.ts:3:1 › basic test (2s)
  ✓ [Microsoft Edge] › example.spec.ts:3:1 › basic test (2s)
  ✓ [Google Chrome] › example.spec.ts:3:1 › basic test (2s)
```

使用 `--project` 命令行选项运行单个项目。

```bash
npx playwright test --project=firefox

Running 1 test using 1 worker

  ✓ [firefox] › example.spec.ts:3:1 › basic test (2s)
```

VS Code 测试运行器默认在 Chrome 浏览器上运行测试。要在其他/多个浏览器上运行，请从测试侧边栏点击播放按钮的下拉菜单并选择另一个配置文件，或点击**选择默认配置文件**修改默认配置文件，选择你希望运行测试的浏览器。

<img height="1594" width="2928" alt="选择浏览器" src="https://user-images.githubusercontent.com/13063165/221136731-9d4bc18f-38a4-4adb-997b-5b98c98aec7f.png" />

选择特定配置文件、多个配置文件或所有配置文件来运行测试。

<img height="1760" width="3072" alt="选择默认配置文件" src="https://user-images.githubusercontent.com/13063165/221669537-e5df8672-f50d-4ff1-96f9-141cd67e12f8.png" />

## 为多个环境配置项目

通过设置项目，我们还可以运行一组具有不同超时时间或重试次数的测试，或者针对不同环境运行一组测试。例如，我们可以针对预发布环境运行测试并设置 2 次重试，同时针对生产环境运行测试并设置 0 次重试。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000, // 超时时间在所有测试之间共享。
  projects: [
    {
      name: 'staging',
      use: {
        baseURL: 'staging.example.com',
      },
      retries: 2,
    },
    {
      name: 'production',
      use: {
        baseURL: 'production.example.com',
      },
      retries: 0,
    },
  ],
});
```

:::

## 将测试拆分到项目中

我们可以将测试拆分到项目中，并使用过滤器运行测试子集。例如，我们可以创建一个项目，使用匹配具有特定文件名的所有测试的过滤器来运行测试。然后我们可以有另一组测试忽略特定的测试文件。

这是一个定义通用超时时间和两个项目的示例。"Smoke" 项目运行一小部分测试且不重试，"Default" 项目运行所有其他测试并重试。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000, // 超时时间在所有测试之间共享。
  projects: [
    {
      name: 'Smoke',
      testMatch: /.*smoke.spec.ts/,
      retries: 0,
    },
    {
      name: 'Default',
      testIgnore: /.*smoke.spec.ts/,
      retries: 2,
    },
  ],
});
```

:::

## 依赖项

依赖项是需要在另一个项目中的测试运行之前运行的项目列表。它们对于配置全局设置操作很有用，这样一个项目依赖于首先运行它。当使用项目依赖项时，[测试报告器](./test-reporters.md)将显示设置测试，[跟踪查看器](/trace-viewer.md)将记录设置的跟踪。你可以使用检查器检查设置测试跟踪的 DOM 快照，也可以在设置中使用[夹具](./test-fixtures.md)。

在这个示例中，chromium、firefox 和 webkit 项目依赖于 setup 项目。

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
  ],
});
```

:::

### 运行顺序

当处理有依赖项的测试时，依赖项将始终首先运行，一旦该项目的所有测试都通过，然后其他项目将并行运行。

运行顺序：
1. 'setup' 项目中的测试运行。一旦该项目的所有测试都通过，依赖项目中的测试将开始运行。

2. 'chromium'、'webkit' 和 'firefox' 项目中的测试一起运行。默认情况下，这些项目将[并行运行](./test-parallel.md)，受最大工作进程数限制。

<img width="2048" height="1116" style="display: flex; margin: auto; width: 70%" alt="chromium、webkit 和 firefox 项目依赖于 setup 项目" loading="lazy" src="https://user-images.githubusercontent.com/13063165/225937080-327b1e63-431f-40e0-90d7-35f21d7a92cb.jpg" />

如果有多个依赖项，那么这些项目依赖项将首先并行运行。如果来自依赖项的测试失败，那么依赖于此项目的测试将不会运行。

运行顺序：
1. 'Browser Login' 和 'DataBase' 项目中的测试并行运行：
   - 'Browser Login' 通过
   - ❌ 'DataBase' 失败！
1. 'e2e tests' 项目不会运行！

<img width="991" height="717" style="display: flex; margin: auto; width: 70%" alt="Browser login 项目为蓝色，database 为红色，e2e tests 依赖于两者" loading="lazy" src="https://user-images.githubusercontent.com/13063165/225938262-33c1b78f-f092-4762-a478-7f8cbc1e3b21.jpg" />

### 拆卸

你还可以通过向设置项目添加 [`testProject.teardown`](/api/class-testproject#test-project-teardown) 属性来拆卸你的设置。拆卸将在所有依赖项目运行后运行。有关更多信息，请参阅[拆卸指南](./test-global-setup-teardown.md#teardown)。

<img height="622" width="391" style="display: flex; margin: auto" alt="全局设置和拆卸" loading="lazy" src="https://github.com/microsoft/playwright/assets/13063165/dfcf10a9-f601-4d0c-bd8d-9490e6efbf7a" />

### 测试过滤

所有测试过滤选项，如 `--grep`/`--grep-invert`、`--shard`、在命令行中直接按位置过滤，或使用 [`test.only()`](./api/class-test.md#test-only)，直接选择要运行的主要测试。如果这些测试属于有依赖项的项目，那些依赖项中的所有测试也将运行。

你可以传递 `--no-deps` 命令行选项来忽略所有依赖项和拆卸。只有你直接选择的项目会运行。

## 自定义项目参数

项目还可以用于使用自定义配置对测试进行参数化 - 请查看[这个单独的指南](./test-parameterize.md#parameterized-projects)。
