---
title: TestConfig
outline: 2
---

# TestConfig

<Badge type="info" text="Added in: v1.10" />

Playwright Test 提供了许多选项来配置如何收集和执行测试，例如 `timeout` 或 `testDir`。这些选项在[配置文件](../test-configuration.md)中的 [TestConfig](/api/class-testconfig) 对象中描述。此类型描述了配置文件的格式，要在运行时访问已解析的配置参数，请使用 [FullConfig](/api/class-fullconfig)。

Playwright Test 支持同时运行多个测试项目。项目特定的选项应放在 [`testConfig.projects`](/api/class-testconfig#test-config-projects) 中，但顶级 [TestConfig](/api/class-testconfig) 也可以定义所有项目共享的基本选项。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  globalTimeout: 600000,
  reporter: 'list',
  testDir: './tests',
});
```

:::

## 属性

### testConfig.build {#test-config-build}

<Badge type="info" text="Added in: v1.35" />

Playwright 转译器配置。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  build: {
    external: ['**/*bundle.js'],
  },
});
```

:::

**类型**

- `Object`


### testConfig.captureGitInfo {#test-config-capture-git-info}

<Badge type="info" text="Added in: v1.51" />

这些设置控制是否捕获 git 信息并将其存储在配置 [`testConfig.metadata`](/api/class-testconfig#test-config-metadata) 中。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  captureGitInfo: { commit: true, diff: true }
});
```

:::

**详情**
* 当你希望在 HTML（或第三方）报告中看到 git 信息时，捕获 `commit` 信息很有用。
* 捕获 `diff` 信息有助于用实际的源代码差异丰富报告。这些信息可用于提供关于如何修复测试的智能建议。

::: info
这些设置的默认值取决于环境。当测试作为 CI 的一部分运行且可以安全获取 git 信息时，默认值为 `true`，否则为 `false`。
:::

::: info
git 提交元数据的结构可能会发生变化。
:::

**类型**

- `Object`


### testConfig.expect {#test-config-expect}

<Badge type="info" text="Added in: v1.10" />

`expect` 断言库的配置。了解更多关于[各种超时](../test-timeouts.md)的信息。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    timeout: 10000,
    toMatchSnapshot: {
      maxDiffPixels: 10,
    },
  },
});
```

:::

**类型**

- `Object`


### testConfig.failOnFlakyTests {#test-config-fail-on-flaky-tests}

<Badge type="info" text="Added in: v1.52" />

如果有任何测试被标记为不稳定，是否以错误退出。在 CI 中很有用。

也可以在[命令行](../test-cli.md)中使用 `--fail-on-flaky-tests` 选项。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  failOnFlakyTests: !!process.env.CI,
});
```

:::

**类型**

- `boolean`


### testConfig.forbidOnly {#test-config-forbid-only}

<Badge type="info" text="Added in: v1.10" />

如果有任何测试或组被标记为 [`test.only()`](/api/class-test#test-only) 或 [`test.describe.only()`](/api/class-test#test-describe-only)，是否以错误退出。在 CI 中很有用。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  forbidOnly: !!process.env.CI,
});
```

:::

**类型**

- `boolean`


### testConfig.fullyParallel {#test-config-fully-parallel}

<Badge type="info" text="Added in: v1.20" />

Playwright Test 并行运行测试。为了实现这一点，它运行多个同时运行的 worker 进程。
默认情况下，**测试文件**并行运行。单个文件中的测试按顺序在同一个 worker 进程中运行。

你可以使用此选项将整个测试运行配置为并发执行所有文件中的所有测试。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
});
```

:::

**类型**

- `boolean`


### testConfig.globalSetup {#test-config-global-setup}

<Badge type="info" text="Added in: v1.10" />

全局设置文件的路径。此文件将被导入并在所有测试之前运行。它必须导出一个接受 [FullConfig](/api/class-fullconfig) 参数的单个函数。传递路径数组以指定多个全局设置文件。

了解更多关于[全局设置和清理](../test-global-setup-teardown.md)的信息。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './global-setup',
});
```

:::

**类型**

- `string | Array<string>`


### testConfig.globalTeardown {#test-config-global-teardown}

<Badge type="info" text="Added in: v1.10" />

全局清理文件的路径。此文件将被导入并在所有测试之后运行。它必须导出一个单个函数。另请参阅 [`testConfig.globalSetup`](/api/class-testconfig#test-config-global-setup)。传递路径数组以指定多个全局清理文件。

了解更多关于[全局设置和清理](../test-global-setup-teardown.md)的信息。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalTeardown: './global-teardown',
});
```

:::

**类型**

- `string | Array<string>`


### testConfig.globalTimeout {#test-config-global-timeout}

<Badge type="info" text="Added in: v1.10" />

整个测试套件可以运行的最大时间（毫秒）。零超时（默认）禁用此行为。在 CI 中很有用，可以防止损坏的设置运行太久并浪费资源。了解更多关于[各种超时](../test-timeouts.md)的信息。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined,
});
```

:::

**类型**

- `int`


### testConfig.grep {#test-config-grep}

<Badge type="info" text="Added in: v1.10" />

过滤以仅运行标题与模式之一匹配的测试。例如，传递 `grep: /cart/` 应该只运行标题中包含 "cart" 的测试。也可以在[命令行](../test-cli.md)中使用 `-g` 选项。正则表达式将针对由项目名称、测试文件名、`test.describe` 名称（如果有）、测试名称和测试标签组成的字符串进行测试，这些部分用空格分隔，例如 `chromium my-test.spec.ts my-suite my-test`。

`grep` 选项对于[标记测试](../test-annotations.md#tag-tests)也很有用。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  grep: /smoke/,
});
```

:::

**类型**

- `RegExp | Array<RegExp>`


### testConfig.grepInvert {#test-config-grep-invert}

<Badge type="info" text="Added in: v1.10" />

过滤以仅运行标题**不**与模式之一匹配的测试。这与 [`testConfig.grep`](/api/class-testconfig#test-config-grep) 相反。也可以在[命令行](../test-cli.md)中使用 `--grep-invert` 选项。

`grepInvert` 选项对于[标记测试](../test-annotations.md#tag-tests)也很有用。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  grepInvert: /manual/,
});
```

:::

**类型**

- `RegExp | Array<RegExp>`


### testConfig.ignoreSnapshots {#test-config-ignore-snapshots}

<Badge type="info" text="Added in: v1.26" />

是否跳过快照期望，例如 `expect(value).toMatchSnapshot()` 和 `await expect(page).toHaveScreenshot()`。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  ignoreSnapshots: !process.env.CI,
});
```

:::

**类型**

- `boolean`


### testConfig.maxFailures {#test-config-max-failures}

<Badge type="info" text="Added in: v1.10" />

整个测试套件运行的最大测试失败数。达到此数字后，测试将停止并以错误退出。设置为零（默认）禁用此行为。

也可以在[命令行](../test-cli.md)中使用 `--max-failures` 和 `-x` 选项。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  maxFailures: process.env.CI ? 1 : 0,
});
```

:::

**类型**

- `int`


### testConfig.metadata {#test-config-metadata}

<Badge type="info" text="Added in: v1.10" />

包含要包含在报告中的键值对的元数据。例如，JSON 报告将包含序列化为 JSON 的元数据。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  metadata: { title: 'acceptance tests' },
});
```

:::

**类型**

- `Metadata`


### testConfig.name {#test-config-name}

<Badge type="info" text="Added in: v1.10" />

配置名称在报告和测试执行期间可见，除非被 [`testProject.name`](/api/class-testproject#test-project-name) 覆盖。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  name: 'acceptance tests',
});
```

:::

**类型**

- `string`


### testConfig.outputDir {#test-config-output-dir}

<Badge type="info" text="Added in: v1.10" />

测试执行期间创建的文件的输出目录。默认为 `<package.json-directory>/test-results`。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  outputDir: './test-results',
});
```

:::

**详情**

此目录在开始时会被清理。运行测试时，会在 [`testConfig.outputDir`](/api/class-testconfig#test-config-output-dir) 内创建一个唯一的子目录，确保并行运行的测试不会冲突。可以通过 [`testInfo.outputDir`](/api/class-testinfo#test-info-output-dir) 和 [`testInfo.outputPath()`](/api/class-testinfo#test-info-output-path) 访问此目录。

这是一个使用 [`testInfo.outputPath()`](/api/class-testinfo#test-info-output-path) 创建临时文件的示例。

```js
import { test, expect } from '@playwright/test';
import fs from 'fs';

test('example test', async ({}, testInfo) => {
  const file = testInfo.outputPath('temporary-file.txt');
  await fs.promises.writeFile(file, 'Put some data to the file', 'utf8');
});
```

**类型**

- `string`


### testConfig.preserveOutput {#test-config-preserve-output}

<Badge type="info" text="Added in: v1.10" />

是否在 [`testConfig.outputDir`](/api/class-testconfig#test-config-output-dir) 中保留测试输出。默认为 `'always'`。
* `'always'` - 保留所有测试的输出；
* `'never'` - 不保留任何测试的输出；
* `'failures-only'` - 仅保留失败测试的输出。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  preserveOutput: 'always',
});
```

:::

**类型**

- `"always" | "never" | "failures-only"`


### testConfig.projects {#test-config-projects}

<Badge type="info" text="Added in: v1.10" />

Playwright Test 支持同时运行多个测试项目。有关更多信息，请参阅 [TestProject](/api/class-testproject)。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] }
  ]
});
```

:::

**类型**

- `Array<TestProject>`


### testConfig.quiet {#test-config-quiet}

<Badge type="info" text="Added in: v1.10" />

是否抑制测试的 stdio 和 stderr 输出。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  quiet: !!process.env.CI,
});
```

:::

**类型**

- `boolean`


### testConfig.repeatEach {#test-config-repeat-each}

<Badge type="info" text="Added in: v1.10" />

每个测试重复的次数，对于调试不稳定测试很有用。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  repeatEach: 3,
});
```

:::

**类型**

- `int`


### testConfig.reporter {#test-config-reporter}

<Badge type="info" text="Added in: v1.10" />

要使用的报告器列表。每个报告器可以是：
* 内置报告器名称，如 `'list'` 或 `'json'`。
* 模块名称，如 `'my-awesome-reporter'`。
* 报告器的相对路径，如 `'./reporters/my-awesome-reporter.js'`。

你可以在元组中传递选项给报告器，如 `['json', { outputFile: './report.json' }]`。如果未指定该属性，当设置了 CI 环境变量时 Playwright 使用 `'dot'` 报告器，否则使用 `'list'` 报告器。

在[报告器指南](../test-reporters.md)中了解更多。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'line',
});
```

:::

**类型**

- `string | Array<Object> | "list" | "dot" | "failures" | "line" | "github" | "json" | "junit" | "null" | "html" | "blob" | "perfetto"`


### testConfig.reportSlowTests {#test-config-report-slow-tests}

<Badge type="info" text="Added in: v1.10" />

是否报告慢测试文件。传递 `null` 禁用此功能。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reportSlowTests: null,
});
```

:::

**详情**

耗时超过 `threshold` 毫秒的测试文件被视为慢速，会报告最慢的文件，数量不超过 `max`。将 `max` 设为零会报告所有超过阈值的测试文件。

**类型**

- `null | Object`


### testConfig.respectGitIgnore {#test-config-respect-git-ignore}

<Badge type="info" text="Added in: v1.45" />

搜索测试文件时是否跳过 `.gitignore` 中的条目。默认情况下，如果既没有显式指定 [`testConfig.testDir`](/api/class-testconfig#test-config-test-dir) 也没有指定 [`testProject.testDir`](/api/class-testproject#test-project-test-dir)，Playwright 将忽略任何与 `.gitignore` 条目匹配的测试文件。

**类型**

- `boolean`


### testConfig.retries {#test-config-retries}

<Badge type="info" text="Added in: v1.10" />

给予失败测试的最大重试次数。默认情况下，失败的测试不会重试。了解更多关于[测试重试](../test-retries.md#retries)的信息。

当设置为列表时，重试次数取决于错误。每次失败尝试后，Playwright 会取适用条目中最大的 `count`，并在测试运行次数少于该数时重试测试。最后一次失败尝试决定：先因匹配错误失败然后因不同错误失败的测试只会获得后者的重试次数。Worker 崩溃和超时会像其他失败一样根据其错误消息进行匹配。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: 2,
});
```

:::

任何失败重试一次，当浏览器或 worker 崩溃时最多重试三次：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: [
    { count: 1 },
    { count: 3, condition: /Target crashed|worker process exited unexpectedly/ },
  ],
});
```

:::

**类型**

- `int | Array<Object>`


### testConfig.retryStrategy {#test-config-retry-strategy}

<Badge type="info" text="Added in: v1.62" />

控制何时重试失败的测试。默认为 `'immediate'`。
* `'immediate'` - 失败的测试在有 worker 可用时立即重试，与其余运行交错。这是默认值。
* `'deferred'` - 重试在尚未运行的测试之后排队。它们可以与其他测试和重试并行运行，最多达到配置的 [`testConfig.workers`](/api/class-testconfig#test-config-workers) 数量。
* `'isolated'` - 重试在最后运行，在所有其他测试完成后，在单个 worker 中逐个运行。这最大限度地减少了重试测试与套件其余部分之间的干扰，但代价是总运行时间增加。

了解更多关于[测试重试](../test-retries.md#retries)的信息。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: 2,
  retryStrategy: 'isolated',
});
```

:::

**类型**

- `"immediate" | "deferred" | "isolated"`


### testConfig.shard {#test-config-shard}

<Badge type="info" text="Added in: v1.10" />

分片测试并仅执行选定的分片。以从一开始的形式指定，如 `{ total: 5, current: 2 }`。

了解更多关于使用 Playwright Test 的[并行和分片](../test-parallel.md)。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  shard: { total: 10, current: 3 },
});
```

:::

**类型**

- `null | Object`


### testConfig.snapshotDir {#test-config-snapshot-dir}

<Badge type="info" text="Added in: v1.10" />

::: warning 不推荐
使用 [`testConfig.snapshotPathTemplate`](/api/class-testconfig#test-config-snapshot-path-template) 配置快照路径。
:::

使用 `toMatchSnapshot` 创建的快照文件的基目录，相对于配置文件。默认为 [`testConfig.testDir`](/api/class-testconfig#test-config-test-dir)。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  snapshotDir: './snapshots',
});
```

:::

**详情**

可以通过 [`testInfo.snapshotDir`](/api/class-testinfo#test-info-snapshot-dir) 和 [`testInfo.snapshotPath()`](/api/class-testinfo#test-info-snapshot-path) 访问每个测试的目录。

此路径将作为每个测试文件快照目录的基目录。将 `snapshotDir` 设置为 `'snapshots'`，[`testInfo.snapshotDir`](/api/class-testinfo#test-info-snapshot-dir) 将解析为 `snapshots/a.spec.js-snapshots`。

**类型**

- `string`


### testConfig.snapshotPathTemplate {#test-config-snapshot-path-template}

<Badge type="info" text="Added in: v1.28" />

此选项配置一个模板，控制 [`pageAssertions.toHaveScreenshot()`](/api/class-pageassertions#page-assertions-to-have-screenshot-1)、[`locatorAssertions.toMatchAriaSnapshot()`](/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot-2) 和 [`snapshotAssertions.toMatchSnapshot()`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1) 生成的快照的位置。

你可以在 [`testConfig.expect`](/api/class-testconfig#test-config-expect) 中为每个断言分别配置模板。

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

该值可能包含一些"令牌"，这些令牌将在测试执行期间被实际值替换。

考虑以下文件结构：

```txt
playwright.config.ts
tests/
└── page/
    └── page-click.spec.ts
```

以及使用 `toHaveScreenshot()` 调用的 `page-click.spec.ts`：

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

支持的令牌列表：
* `{arg}` - **不带扩展名**的相对快照路径。这来自传递给 `toHaveScreenshot()`、`toMatchAriaSnapshot()` 或 `toMatchSnapshot()` 的参数；如果不带参数调用，这将是自动生成的快照名称。
  * 值：`foo/bar/baz`
* `{ext}` - 快照扩展名（带前导点）。
  * 值：`.png`
* `{platform}` - `process.platform` 的值。
* `{projectName}` - 项目的文件系统安全名称（如果有）。
  * 值：`''`（空字符串）。
* `{snapshotDir}` - 项目的 [`testProject.snapshotDir`](/api/class-testproject#test-project-snapshot-dir)。
  * 值：`/home/playwright/tests`（因为配置中未提供 `snapshotDir`，默认为 `testDir`）
* `{testDir}` - 项目的 [`testProject.testDir`](/api/class-testproject#test-project-test-dir)。
  * 值：`/home/playwright/tests`（绝对路径，因为 `testDir` 相对于配置目录解析）
* `{testFileDir}` - 从 `testDir` 到**测试文件**的相对路径中的目录。
  * 值：`page`
* `{testFileBaseName}` - 不带最后扩展名的测试文件名。
  * 值：`page-click.spec`
* `{testFileName}` - 带扩展名的测试文件名。
  * 值：`page-click.spec.ts`
* `{testFilePath}` - 从 `testDir` 到**测试文件**的相对路径。
  * 值：`page/page-click.spec.ts`
* `{testName}` - 文件系统安全的测试标题，包括父 describes 但不包括文件名。
  * 值：`suite-test-should-work`

每个令牌前面可以有一个单字符，**仅当**此令牌具有非空值时才会使用该字符。

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
1. 第一个项目**没有**名称，因此其快照将存储在 `<configDir>/__screenshots__/example.spec.ts/...` 中。
1. 第二个项目**有**名称，因此其快照将存储在 `<configDir>/__screenshots__/chromium/example.spec.ts/..` 中。
1. 由于 `snapshotPathTemplate` 解析为相对路径，它将相对于 `configDir` 解析。
1. 正斜杠 `"/"` 可以在任何平台上用作路径分隔符。

**类型**

- `string`


### testConfig.tag {#test-config-tag}

<Badge type="info" text="Added in: v1.57" />

添加到报告中每个测试前面的标签。用于标记测试运行以区分 [CI 环境](../test-sharding.md#merging-reports-from-multiple-environments)。

注意每个标签必须以 `@` 符号开头。了解更多关于[标签](../test-annotations.md#tag-tests)的信息。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  tag: process.env.CI_ENVIRONMENT_NAME,  // 例如 "@APIv2"
});
```

:::

**类型**

- `string | Array<string>`


### testConfig.testDir {#test-config-test-dir}

<Badge type="info" text="Added in: v1.10" />

将递归扫描测试文件的目录。默认为配置文件所在的目录。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
});
```

:::

**类型**

- `string`


### testConfig.testIgnore {#test-config-test-ignore}

<Badge type="info" text="Added in: v1.10" />

与这些模式之一匹配的文件不会作为测试文件执行。匹配是针对绝对文件路径执行的。字符串被视为 glob 模式。

例如，`'**/test-assets/**'` 将忽略 `test-assets` 目录中的任何文件。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testIgnore: '**/test-assets/**',
});
```

:::

**类型**

- `string | RegExp | Array<string | RegExp>`


### testConfig.testMatch {#test-config-test-match}

<Badge type="info" text="Added in: v1.10" />

只有与这些模式之一匹配的文件才作为测试文件执行。匹配是针对绝对文件路径执行的。字符串被视为 glob 模式。

默认情况下，Playwright 查找与以下 glob 模式匹配的文件：`**/*.@(spec|test).?(c|m)[jt]s?(x)`。这意味着带有 `".test"` 或 `".spec"` 后缀的 JavaScript 或 TypeScript 文件，例如 `login-screen.wrong-credentials.spec.ts`。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: /.*\.e2e\.js/,
});
```

:::

**类型**

- `string | RegExp | Array<string | RegExp>`


### testConfig.timeout {#test-config-timeout}

<Badge type="info" text="Added in: v1.10" />

每个测试的超时时间（毫秒）。默认为 30 秒。

这是所有测试的基本超时时间。此外，每个测试可以使用 [`test.setTimeout()`](/api/class-test#test-set-timeout) 配置自己的超时时间。了解更多关于[各种超时](../test-timeouts.md)的信息。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 5 * 60 * 1000,
});
```

:::

**类型**

- `int`


### testConfig.tsconfig {#test-config-tsconfig}

<Badge type="info" text="Added in: v1.49" />

适用于所有导入文件的单个 `tsconfig` 的路径。默认情况下，会分别查找每个导入文件的 `tsconfig`。注意 `tsconfig` 属性在加载配置文件或其任何依赖项时无效。当指定 `--tsconfig` 命令行选项时忽略。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  tsconfig: './tsconfig.test.json',
});
```

:::

**类型**

- `string`


### testConfig.updateSnapshots {#test-config-update-snapshots}

<Badge type="info" text="Added in: v1.10" />

是否用测试运行产生的实际结果更新预期的快照。默认为 `'default'`。
* `'all'` - 所有执行的测试都将更新快照。
* `'changed'` - 所有执行的测试都将更新不匹配的快照。匹配的快照不会被更新。还会创建缺失的快照。
* `'missing'` - 创建缺失的快照，例如在编写新测试并首次运行它时。仅创建缺失快照的测试通过。
* `'none'` - 不更新任何快照。
* `'default'` - 创建缺失的快照，但创建它们的测试会失败，这样运行不会在 CI 中静默通过。这是默认值。

了解更多关于[快照](../test-snapshots.md)的信息。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  updateSnapshots: 'default',
});
```

:::

**类型**

- `"all" | "changed" | "missing" | "none" | "default"`


### testConfig.updateSourceMethod {#test-config-update-source-method}

<Badge type="info" text="Added in: v1.50" />

定义如何在源代码中更新快照。
* `'patch'` - 创建一个统一差异文件，可以稍后用于更新源代码。这是默认值。
* `'3way'` - 在源代码中生成合并冲突标记。这允许用户手动选择相关更改，就像在 IDE 中解决合并冲突一样。
* `'overwrite'` - 用新的快照值覆盖源代码。

**类型**

- `"overwrite" | "3way" | "patch"`


### testConfig.use {#test-config-use}

<Badge type="info" text="Added in: v1.10" />

所有测试的全局选项，例如 [`testOptions.browserName`](/api/class-testoptions#test-options-browser-name)。了解更多关于[配置](../test-configuration.md)以及查看可用选项 [TestOptions](/api/class-testoptions)。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    browserName: 'chromium',
  },
});
```

:::

**类型**

- `TestOptions`


### testConfig.webServer {#test-config-web-server}

<Badge type="info" text="Added in: v1.10" />

在测试期间启动开发 Web 服务器（或多个）。

顶级服务器在 `globalSetup` 之前启动，在 `globalTeardown` 之后停止，与项目选择无关。要仅为特定项目启动服务器，请使用 [`testProject.webServer`](/api/class-testproject#test-project-web-server)。

**详情**

如果指定了端口，Playwright Test 将在运行测试之前等待它在 `127.0.0.1` 或 `::1` 上可用。如果指定了 url，Playwright Test 将在运行测试之前等待 URL 返回 2xx、3xx、400、401、402 或 403 状态码。

对于持续集成，你可能希望使用 `reuseExistingServer: !process.env.CI` 选项，该选项不会在 CI 上使用现有服务器。要查看 stdout，可以设置 `DEBUG=pw:webserver` 环境变量。

`port`（但不是 `url`）作为 [`testOptions.baseURL`](/api/class-testoptions#test-options-base-url) 传递给 Playwright。例如，端口 `8080` 产生 `baseURL` 等于 `http://localhost:8080`。如果 `webServer` 被指定为数组，则必须显式配置 `baseURL`（即使它只有一个条目）。

::: info
还建议在配置中指定 [`testOptions.baseURL`](/api/class-testoptions#test-options-base-url)，以便测试可以使用相对 URL。
:::

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000/',
  },
});
```

:::

现在你可以在导航页面时使用相对路径：

::: code-group

```js [test.spec.ts]
import { test } from '@playwright/test';

test('test', async ({ page }) => {
  // 这将导航到 http://localhost:3000/foo
  await page.goto('/foo');
});
```

:::

可以启动多个 Web 服务器（或后台进程）：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  webServer: [
    {
      command: 'npm run start',
      url: 'http://localhost:3000',
      name: 'Frontend',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run backend',
      url: 'http://localhost:3333',
      name: 'Backend',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    }
  ],
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

:::

如果你的 webserver 运行在不同的端口上，使用 `wait` 来捕获端口：

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run start',
    wait: {
      stdout: /Listening on port (?<my_server_port>\d+)/
    },
  },
});
```

```js
import { test, expect } from '@playwright/test';

test.use({ baseURL: `http://localhost:${process.env.MY_SERVER_PORT ?? 3000}` });

test('homepage', async ({ page }) => {
  await page.goto('/');
});
```

**类型**

- `Object | Array<Object>`


### testConfig.workers {#test-config-workers}

<Badge type="info" text="Added in: v1.10" />

用于并行化测试的最大并发 worker 进程数。也可以设置为逻辑 CPU 核心的百分比，例如 `'50%'`。

Playwright Test 使用 worker 进程来运行测试。始终至少有一个 worker 进程，但可以使用更多来加速测试执行。

默认为逻辑 CPU 核心数的一半。了解更多关于使用 Playwright Test 的[并行和分片](../test-parallel.md)。

**用法**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 3,
});
```

:::

**类型**

- `int | string`
