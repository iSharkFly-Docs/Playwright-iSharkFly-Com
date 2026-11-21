---
title: TestProject
outline: 2
---

# TestProject

<Badge type="info" text="Added in: v1.10" />

Playwright Test 支持同时运行多个测试项目。这对于在多种配置下运行测试非常有用。例如，考虑针对多个浏览器运行测试。此类型描述配置文件中项目的格式，要在运行时访问已解析的配置参数，请使用 [FullProject](/api/class-fullproject)。

`TestProject` 封装了特定于单个项目的配置。项目在[配置文件](../test-configuration.md)中指定的 [`testConfig.projects`](/api/class-testconfig#test-config-projects) 中配置。请注意，[TestProject](/api/class-testproject) 的所有属性在顶级 [TestConfig](/api/class-testconfig) 中也可用，在这种情况下它们在所有项目之间共享。例外是 [`testProject.webServer`](/api/class-testproject#test-project-web-server)：顶级服务器是单独启动的，用于整个运行。

以下是一个在 Chromium、Firefox 和 WebKit 的桌面和移动版本中运行每个测试的示例配置。

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 所有项目共享的选项。
  timeout: 30000,
  use: {
    ignoreHTTPSErrors: true,
  },

  // 每个项目特定的选项。
  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
    },
    {
      name: 'firefox',
      use: devices['Desktop Firefox'],
    },
    {
      name: 'webkit',
      use: devices['Desktop Safari'],
    },
    {
      name: 'Mobile Chrome',
      use: devices['Pixel 5'],
    },
    {
      name: 'Mobile Safari',
      use: devices['iPhone 12'],
    },
  ],
});
```

:::

## 属性

### testProject.default {#test-project-default}

<Badge type="info" text="Added in: v1.64" />

当没有传递 `--project` 命令行选项时，项目是否运行。默认为 `true`。

要运行 `default: false` 的项目，请使用 `--project` 命令行选项选择它。

具有 `default: false` 的项目在另一个正在运行的项目将其列在 [`testProject.dependencies`](/api/class-testproject#test-project-dependencies) 或 [`testProject.teardown`](/api/class-testproject#test-project-teardown) 中时仍会运行。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
    },
    {
      name: 'slow',
      testDir: './slow-tests',
      default: false,
    },
  ],
});
```

:::

现在 `npx playwright test` 只运行 `chromium`，而 `npx playwright test --project=slow` 运行 `slow`。

**类型**

- `boolean`


### testProject.dependencies {#test-project-dependencies}

<Badge type="info" text="Added in: v1.31" />

需要在此项目中的任何测试运行之前运行的项目列表。依赖项对于以测试形式配置全局设置操作很有用。传递 `--no-deps` 参数会忽略依赖项，其行为就像未指定它们一样。

使用依赖项允许全局设置生成跟踪和其他产物，在测试报告中查看设置步骤等。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /global.setup\.ts/,
    },
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: devices['Desktop Firefox'],
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: devices['Desktop Safari'],
      dependencies: ['setup'],
    },
  ],
});
```

:::

**类型**

- `Array<string>`


### testProject.expect {#test-project-expect}

<Badge type="info" text="Added in: v1.10" />

`expect` 断言库的配置。

使用 [`testConfig.expect`](/api/class-testconfig#test-config-expect) 为所有项目更改此选项。

**类型**

- `Object`


### testProject.fullyParallel {#test-project-fully-parallel}

<Badge type="info" text="Added in: v1.10" />

Playwright Test 并行运行测试。为了实现这一点，它运行多个同时工作的工作进程。
默认情况下，**测试文件**并行运行。单个文件中的测试按顺序在同一工作进程中运行。

您可以使用此选项配置整个测试项目以并发运行所有文件中的所有测试。

**类型**

- `boolean`


### testProject.grep {#test-project-grep}

<Badge type="info" text="Added in: v1.10" />

过滤器，仅运行标题与其中一个模式匹配的测试。例如，传递 `grep: /cart/` 应该只运行标题中包含 "cart" 的测试。也可以在全局和[命令行](../test-cli.md)中使用 `-g` 选项。正则表达式将针对由项目名称、测试文件名、`test.describe` 名称（如果有）、测试名称和测试标签组成的字符串进行测试，各部分用空格分隔，例如 `chromium my-test.spec.ts my-suite my-test`。

`grep` 选项对于[标记测试](../test-annotations.md#tag-tests)也很有用。

**类型**

- `RegExp | Array<RegExp>`


### testProject.grepInvert {#test-project-grep-invert}

<Badge type="info" text="Added in: v1.10" />

过滤器，仅运行标题**不**与任何模式匹配的测试。这是 [`testProject.grep`](/api/class-testproject#test-project-grep) 的相反。也可以在全局和[命令行](../test-cli.md)中使用 `--grep-invert` 选项。

`grepInvert` 选项对于[标记测试](../test-annotations.md#tag-tests)也很有用。

**类型**

- `RegExp | Array<RegExp>`


### testProject.ignoreSnapshots {#test-project-ignore-snapshots}

<Badge type="info" text="Added in: v1.44" />

是否跳过快照期望，例如 `expect(value).toMatchSnapshot()` 和 `await expect(page).toHaveScreenshot()`。

**用法**

以下示例仅在 Chromium 上执行截图断言。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
    },
    {
      name: 'firefox',
      use: devices['Desktop Firefox'],
      ignoreSnapshots: true,
    },
    {
      name: 'webkit',
      use: devices['Desktop Safari'],
      ignoreSnapshots: true,
    },
  ],
});
```

:::

**类型**

- `boolean`


### testProject.metadata {#test-project-metadata}

<Badge type="info" text="Added in: v1.10" />

将直接以 JSON 序列化形式放入测试报告的元数据。

**类型**

- `Metadata`


### testProject.name {#test-project-name}

<Badge type="info" text="Added in: v1.10" />

项目名称在报告中和测试执行期间可见。

::: warning
Playwright 会多次执行配置文件。不要在配置中动态生成不稳定的值。
:::

**类型**

- `string`


### testProject.outputDir {#test-project-output-dir}

<Badge type="info" text="Added in: v1.10" />

测试执行期间创建的文件的输出目录。默认为 `<package.json-directory>/test-results`。

此目录在开始时会被清理。运行测试时，会在 [`testProject.outputDir`](/api/class-testproject#test-project-output-dir) 内创建一个唯一的子目录，保证并行运行的测试不会冲突。此目录可以通过 [`testInfo.outputDir`](/api/class-testinfo#test-info-output-dir) 和 [`testInfo.outputPath()`](/api/class-testinfo#test-info-output-path) 访问。

以下是一个使用 [`testInfo.outputPath()`](/api/class-testinfo#test-info-output-path) 创建临时文件的示例。

```js
import { test, expect } from '@playwright/test';
import fs from 'fs';

test('example test', async ({}, testInfo) => {
  const file = testInfo.outputPath('temporary-file.txt');
  await fs.promises.writeFile(file, 'Put some data to the file', 'utf8');
});
```

使用 [`testConfig.outputDir`](/api/class-testconfig#test-config-output-dir) 为所有项目更改此选项。

**类型**

- `string`


### testProject.repeatEach {#test-project-repeat-each}

<Badge type="info" text="Added in: v1.10" />

重复每个测试的次数，对于调试不稳定的测试很有用。

使用 [`testConfig.repeatEach`](/api/class-testconfig#test-config-repeat-each) 为所有项目更改此选项。

**类型**

- `int`


### testProject.respectGitIgnore {#test-project-respect-git-ignore}

<Badge type="info" text="Added in: v1.45" />

搜索测试文件时是否跳过 `.gitignore` 中的条目。默认情况下，如果既没有显式指定 [`testConfig.testDir`](/api/class-testconfig#test-config-test-dir) 也没有显式指定 [`testProject.testDir`](/api/class-testproject#test-project-test-dir)，Playwright 将忽略任何与 `.gitignore` 条目匹配的测试文件。此选项允许覆盖该行为。

**类型**

- `boolean`


### testProject.retries {#test-project-retries}

<Badge type="info" text="Added in: v1.10" />

给失败测试的最大重试次数。了解更多关于[测试重试](../test-retries.md#retries)的信息。

设置为列表可使重试次数取决于错误，请参阅 [`testConfig.retries`](/api/class-testconfig#test-config-retries)。

使用 [`test.describe.configure()`](/api/class-test#test-describe-configure) 更改特定文件或测试组的重试次数。

使用 [`testConfig.retries`](/api/class-testconfig#test-config-retries) 为所有项目更改此选项。

**类型**

- `int | Array<Object>`


### testProject.snapshotDir {#test-project-snapshot-dir}

<Badge type="info" text="Added in: v1.10" />

使用 `toMatchSnapshot` 创建的快照文件的基目录，相对于配置文件。默认为 [`testProject.testDir`](/api/class-testproject#test-project-test-dir)。

每个测试的目录可以通过 [`testInfo.snapshotDir`](/api/class-testinfo#test-info-snapshot-dir) 和 [`testInfo.snapshotPath()`](/api/class-testinfo#test-info-snapshot-path) 访问。

此路径将作为每个测试文件快照目录的基目录。将 `snapshotDir` 设置为 `'snapshots'`，[`testInfo.snapshotDir`](/api/class-testinfo#test-info-snapshot-dir) 将解析为 `snapshots/a.spec.js-snapshots`。

**类型**

- `string`


### testProject.snapshotPathTemplate {#test-project-snapshot-path-template}

<Badge type="info" text="Added in: v1.28" />

此选项配置一个模板，控制由 [`pageAssertions.toHaveScreenshot()`](/api/class-pageassertions#page-assertions-to-have-screenshot-1)、[`locatorAssertions.toMatchAriaSnapshot()`](/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot-2) 和 [`snapshotAssertions.toMatchSnapshot()`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1) 生成的快照的位置。

您可以在 [`testConfig.expect`](/api/class-testconfig#test-config-expect) 中为每个断言单独配置模板。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // 所有断言的单一模板
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',

  // 特定断言的模板
  expect: {
    toHaveScreenshot: {
      pathTemplate: '{testDir}/__screenshots__{/projectName}/{testFilePath}/{arg}{ext}',
    },
    toMatchAriaSnapshot: {
      pathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
    },
  },
});
```

:::

**详情**

该值可能包含一些"标记"，这些标记将在测试执行期间被实际值替换。

考虑以下文件结构：

```txt
playwright.config.ts
tests/
└── page/
    └── page-click.spec.ts
```

以及以下使用 `toHaveScreenshot()` 调用的 `page-click.spec.ts`：

::: code-group

```js [page-click.spec.ts]
import { test, expect } from '@playwright/test';

test.describe('suite', () => {
  test('test should work', async ({ page }) => {
    await expect(page).toHaveScreenshot(['foo', 'bar', 'baz.png']);
  });
});
```

:::

支持的标记列表：
* `{arg}` - 不带扩展名的相对快照路径。这来自传递给 `toHaveScreenshot()`、`toMatchAriaSnapshot()` 或 `toMatchSnapshot()` 的参数；如果不带参数调用，这将是自动生成的快照名称。
  * 值：`foo/bar/baz`
* `{ext}` - 快照扩展名（带前导点）。
  * 值：`.png`
* `{platform}` - `process.platform` 的值。
* `{projectName}` - 项目的文件系统安全名称（如果有）。
  * 值：`''`（空字符串）。
* `{snapshotDir}` - 项目的 [`testProject.snapshotDir`](/api/class-testproject#test-project-snapshot-dir)。
  * 值：`/home/playwright/tests`（因为配置中未提供 `snapshotDir`，默认为 `testDir`）
* `{testDir}` - 项目的 [`testProject.testDir`](/api/class-testproject#test-project-test-dir)。
  * 值：`/home/playwright/tests`（绝对路径，因为 `testDir` 相对于配置文件所在目录解析）
* `{testFileDir}` - 从 `testDir` 到**测试文件**的相对路径中的目录。
  * 值：`page`
* `{testFileBaseName}` - 不带最后一个扩展名的测试文件名。
  * 值：`page-click.spec`
* `{testFileName}` - 带扩展名的测试文件名。
  * 值：`page-click.spec.ts`
* `{testFilePath}` - 从 `testDir` 到**测试文件**的相对路径。
  * 值：`page/page-click.spec.ts`
* `{testName}` - 文件系统安全的测试标题，包括父 describe 但不包括文件名。
  * 值：`suite-test-should-work`

每个标记可以在前面加一个单字符，**仅当**此标记有非空值时才使用该字符。

考虑以下配置：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  snapshotPathTemplate: '__screenshots__{/projectName}/{testFilePath}/{arg}{ext}',
  testMatch: 'example.spec.ts',
  projects: [
    { use: { browserName: 'firefox' } },
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
```

:::

在此配置中：
1. 第一个项目**没有**名称，因此其快照将存储在 `<configDir>/__screenshots__/example.spec.ts/...`。
1. 第二个项目**有**名称，因此其快照将存储在 `<configDir>/__screenshots__/chromium/example.spec.ts/..`。
1. 由于 `snapshotPathTemplate` 解析为相对路径，它将相对于 `configDir` 解析。
1. 正斜杠 `"/"` 可以在任何平台上用作路径分隔符。

**类型**

- `string`


### testProject.teardown {#test-project-teardown}

<Badge type="info" text="Added in: v1.34" />

需要在此项目及所有依赖项目完成后运行的项目名称。Teardown 用于清理此项目获取的任何资源。

传递 `--no-deps` 参数会忽略 [`testProject.teardown`](/api/class-testproject#test-project-teardown)，其行为就像未指定它一样。

**用法**

一个常见的模式是"setup"依赖项有一个对应的"teardown"：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /global.setup\.ts/,
      teardown: 'teardown',
    },
    {
      name: 'teardown',
      testMatch: /global.teardown\.ts/,
    },
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: devices['Desktop Firefox'],
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: devices['Desktop Safari'],
      dependencies: ['setup'],
    },
  ],
});
```

:::

**类型**

- `string`


### testProject.testDir {#test-project-test-dir}

<Badge type="info" text="Added in: v1.10" />

将递归扫描测试文件的目录。默认为配置文件所在目录。

每个项目可以使用不同的目录。以下是一个在三个浏览器中运行冒烟测试，在稳定的 Chrome 浏览器中运行所有其他测试的示例。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Smoke Chromium',
      testDir: './smoke-tests',
      use: {
        browserName: 'chromium',
      }
    },
    {
      name: 'Smoke WebKit',
      testDir: './smoke-tests',
      use: {
        browserName: 'webkit',
      }
    },
    {
      name: 'Smoke Firefox',
      testDir: './smoke-tests',
      use: {
        browserName: 'firefox',
      }
    },
    {
      name: 'Chrome Stable',
      testDir: './',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
      }
    },
  ],
});
```

:::

使用 [`testConfig.testDir`](/api/class-testconfig#test-config-test-dir) 为所有项目更改此选项。

**类型**

- `string`


### testProject.testIgnore {#test-project-test-ignore}

<Badge type="info" text="Added in: v1.10" />

匹配这些模式之一的文件不会作为测试文件执行。匹配针对绝对文件路径进行。字符串被视为 glob 模式。

例如，`'**/test-assets/**'` 将忽略 `test-assets` 目录中的任何文件。

使用 [`testConfig.testIgnore`](/api/class-testconfig#test-config-test-ignore) 为所有项目更改此选项。

**类型**

- `string | RegExp | Array<string | RegExp>`


### testProject.testMatch {#test-project-test-match}

<Badge type="info" text="Added in: v1.10" />

只有匹配这些模式之一的文件才会作为测试文件执行。匹配针对绝对文件路径进行。字符串被视为 glob 模式。

默认情况下，Playwright 查找匹配以下 glob 模式的文件：`**/*.@(spec|test).?(c|m)[jt]s?(x)`。这意味着带有 `".test"` 或 `".spec"` 后缀的 JavaScript 或 TypeScript 文件，例如 `login-screen.wrong-credentials.spec.ts`。

使用 [`testConfig.testMatch`](/api/class-testconfig#test-config-test-match) 为所有项目更改此选项。

**类型**

- `string | RegExp | Array<string | RegExp>`


### testProject.timeout {#test-project-timeout}

<Badge type="info" text="Added in: v1.10" />

每个测试的超时时间（毫秒）。默认为 30 秒。

这是所有测试的基本超时时间。每个测试可以使用 [`test.setTimeout()`](/api/class-test#test-set-timeout) 配置自己的超时时间。每个文件或测试组可以使用 [`test.describe.configure()`](/api/class-test#test-describe-configure) 配置超时时间。

使用 [`testConfig.timeout`](/api/class-testconfig#test-config-timeout) 为所有项目更改此选项。

**类型**

- `int`


### testProject.use {#test-project-use}

<Badge type="info" text="Added in: v1.10" />

此项目中所有测试的选项，例如 [`testOptions.browserName`](/api/class-testoptions#test-options-browser-name)。了解更多关于[配置](../test-configuration.md)的信息并查看可用选项 [TestOptions](/api/class-testoptions)。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});
```

:::

使用 [`testConfig.use`](/api/class-testconfig#test-config-use) 为所有项目更改此选项。

**类型**

- `TestOptions`


### testProject.webServer {#test-project-web-server}

<Badge type="info" text="Added in: v1.66" />

为此项目启动一个（或多个）开发 Web 服务器。接受与 [`testConfig.webServer`](/api/class-testconfig#test-config-web-server) 相同的选项。

项目服务器是添加到顶级服务器的，而不是从它们继承或用于替换它们。
它们在 `globalSetup` 之后启动，在其返回的清理函数和 `globalTeardown` 之前停止。
在命令行中，项目选择控制哪些服务器启动，包括依赖项目和清理项目的服务器。测试过滤器和分片不影响服务器启动。
列出测试不会启动项目服务器。在 UI 模式和 VS Code 中，所有项目服务器随全局设置一起启动，并在测试运行期间保持活动状态，直到全局清理或配置重新加载。

[`fullProject.webServer`](/api/class-fullproject#full-project-web-server) 将这些设置公开为数组，包括在 `globalSetup` 中。
项目服务器在 `globalSetup` 或 `globalTeardown` 期间不可用。

对于具有 `port` 且没有 `url` 的单个服务器，项目的 [`testOptions.baseURL`](/api/class-testoptions#test-options-base-url) 默认为 `http://localhost:<port>`。显式配置的 `baseURL` 优先。对于数组或具有 `url` 的服务器，请显式配置 `baseURL`。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'local',
      webServer: {
        command: 'npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
      },
      use: { baseURL: 'http://localhost:3000' },
    },
    {
      name: 'production',
      use: { baseURL: 'https://production.example' },
    },
  ],
});
```

:::

运行 `npx playwright test --project=production` 不会启动本地服务器。

**类型**

- `Object | Array<Object>`


### testProject.workers {#test-project-workers}

<Badge type="info" text="Added in: v1.52" />

用于并行化此项目测试的最大并发工作进程数。也可以设置为逻辑 CPU 核心的百分比，例如 `'50%'`。

例如，当项目中的所有测试共享单个资源（如测试账户）因此无法并行执行时，这会很有用。将此类项目的工作进程限制为一个将防止同时使用共享资源。

请注意，全局 [`testConfig.workers`](/api/class-testconfig#test-config-workers) 限制适用于工作进程的总数。但是，Playwright 将通过 [`testProject.workers`](/api/class-testproject#test-project-workers) 的值限制用于此项目的工作进程数。

默认情况下，每个项目没有限制。有关工作进程总数限制的默认值，请参阅 [`testConfig.workers`](/api/class-testconfig#test-config-workers)。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 10,  // 工作进程总数限制

  projects: [
    {
      name: 'runs in parallel',
    },
    {
      name: 'one at a time',
      workers: 1,  // 此项目的工作进程限制
    },
  ],
});
```

:::

**类型**

- `int | string`
