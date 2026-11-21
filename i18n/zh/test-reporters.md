---
title: "报告器"
---

# 报告器

## 简介

Playwright Test 附带了几个针对不同需求的内置报告器，并且能够提供自定义报告器。尝试内置报告器的最简单方法是传递 `--reporter` [命令行选项](./test-cli.md)。

```bash
npx playwright test --reporter=line
```

要获得更多控制，你可以在[配置文件](./test-configuration.md)中以编程方式指定报告器。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'line',
});
```

:::

### 多个报告器

你可以同时使用多个报告器。例如，你可以使用 `'list'` 获得美观的终端输出，使用 `'json'` 获得包含测试结果的综合 json 文件。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['json', {  outputFile: 'test-results.json' }]
  ],
});
```

:::

### CI 上的报告器

你可以在本地和 CI 上使用不同的报告器。例如，使用简洁的 `'dot'` 报告器可以避免过多的输出。这是 CI 上的默认设置。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // CI 上使用简洁的 'dot'，本地运行时使用默认的 'list'
  reporter: process.env.CI ? 'dot' : 'list',
});
```

:::

### 仅报告失败

使用 JSON、JUnit 或 HTML 报告器的 `onlyFailures` 选项，仅包含具有意外结果（包括意外通过）、不稳定测试和中断测试的测试。即使不稳定测试在重试时通过也会包含在内。包含的测试的每次尝试都会保留，包括成功的重试：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['html', { onlyFailures: true }]],
});
```

:::

为每个报告器独立配置 `onlyFailures`。要在合并 blob 报告时使用它，请将配置文件传递给 `npx playwright merge-reports --config=playwright.config.ts ./blob-report`。

使用 `failures` 报告器在终端上实时诊断而不输出进度。例如，保留完整的 HTML 报告同时输出简洁的终端内容：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['failures'], ['html']],
});
```

:::

## 内置报告器

所有内置报告器都显示有关失败的详细信息，主要区别在于成功运行的详细程度。

### List 报告器

List 报告器是默认的（除了在 CI 上默认使用 `dot` 报告器）。它为每个正在运行的测试打印一行。

```bash
npx playwright test --reporter=list
```

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'list',
});
```

:::

以下是测试运行中间的示例输出。默认情况下，失败将在最后列出。

```bash
npx playwright test --reporter=list
Running 124 tests using 6 workers

 1  ✓ should access error in env (438ms)
 2  ✓ handle long test names (515ms)
 3  x 1) render expected (691ms)
 4  ✓ should timeout (932ms)
 5    should repeat each:
 6  ✓ should respect enclosing .gitignore (569ms)
 7    should teardown env after timeout:
 8    should respect excluded tests:
 9  ✓ should handle env beforeEach error (638ms)
10    should respect enclosing .gitignore:
```

你可以通过传递以下配置选项来选择步骤渲染：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['list', { printSteps: true }]],
});
```

:::

你可以在失败发生时立即内联打印失败，而不是等到运行结束：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['list', { printFailuresInline: true }]],
});
```

:::

你可以省略自动附加到测试标题的测试标签：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['list', { omitTags: true }]],
});
```

:::

List 报告器支持以下配置选项和环境变量：

| 环境变量名 | 报告器配置选项| 描述 | 默认值
|---|---|---|---|
| `PLAYWRIGHT_LIST_PRINT_STEPS` | `printSteps` | 是否在单独的行上打印每个步骤。 | `false`
| `PLAYWRIGHT_LIST_PRINT_FAILURES_INLINE` | `printFailuresInline` | 是否在测试失败后立即打印失败详情，而不是在最后。 | `false`
| `PLAYWRIGHT_LIST_OMIT_TAGS` | `omitTags` | 是否省略自动附加到测试标题的测试标签。 | `false`
| `PLAYWRIGHT_FORCE_TTY` | | 是否产生适合实时终端的输出。支持 `true`、`1`、`false`、`0`、`[WIDTH]` 和 `[WIDTH]x[HEIGHT]`。`[WIDTH]` 和 `[WIDTH]x[HEIGHT]` 指定 TTY 尺寸。 | 当终端处于 TTY 模式时为 `true`，否则为 `false`。
| `FORCE_COLOR` | | 是否产生彩色输出。 | 当终端处于 TTY 模式时为 `true`，否则为 `false`。
| `NO_COLOR` | | 是否禁用彩色输出（[no-color.org](https://no-color.org/)）。任何非空值都会禁用颜色。 | 未设置

### Line 报告器

Line 报告器比 list 报告器更简洁。它使用一行来报告最后完成的测试，并在失败发生时打印。Line 报告器对于大型测试套件很有用，它显示进度但不会通过列出所有测试来刷屏。

```bash
npx playwright test --reporter=line
```

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'line',
});
```

:::

以下是测试运行中间的示例输出。失败是内联报告的。

```bash
npx playwright test --reporter=line
Running 124 tests using 6 workers
  1) dot-reporter.spec.ts:20:1 › render expected ===================================================

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

[23/124] gitignore.spec.ts - should respect nested .gitignore
```

Line 报告器支持以下配置选项和环境变量：

| 环境变量名 | 报告器配置选项| 描述 | 默认值
|---|---|---|---|
| `PLAYWRIGHT_LINE_OMIT_TAGS` | `omitTags` | 是否省略自动附加到测试标题的测试标签。 | `false`
| `PLAYWRIGHT_FORCE_TTY` | | 是否产生适合实时终端的输出。支持 `true`、`1`、`false`、`0`、`[WIDTH]` 和 `[WIDTH]x[HEIGHT]`。`[WIDTH]` 和 `[WIDTH]x[HEIGHT]` 指定 TTY 尺寸。 | 当终端处于 TTY 模式时为 `true`，否则为 `false`。
| `FORCE_COLOR` | | 是否产生彩色输出。 | 当终端处于 TTY 模式时为 `true`，否则为 `false`。
| `NO_COLOR` | | 是否禁用彩色输出（[no-color.org](https://no-color.org/)）。任何非空值都会禁用颜色。 | 未设置

### Dot 报告器

Dot 报告器非常简洁 - 它每次成功的测试运行只产生一个字符。它是 CI 上的默认设置，当你不想要大量输出时很有用。

```bash
npx playwright test --reporter=dot
```

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'dot',
});
```

:::

以下是测试运行中间的示例输出。失败将在最后列出。

```bash
npx playwright test --reporter=dot
Running 124 tests using 6 workers
······F·············································
```

每个已运行的测试显示一个字符，表示其状态：

| 字符 | 描述
|---|---|
| `·` | 通过
| `F` | 失败
| `×` | 失败或超时 - 将重试
| `±` | 重试后通过（不稳定）
| `T` | 超时
| `°` | 跳过

Dot 报告器支持以下配置选项和环境变量：

| 环境变量名 | 报告器配置选项| 描述 | 默认值
|---|---|---|---|
| `PLAYWRIGHT_DOT_OMIT_TAGS` | `omitTags` | 是否省略自动附加到测试标题的测试标签。 | `false`
| `PLAYWRIGHT_FORCE_TTY` | | 是否产生适合实时终端的输出。支持 `true`、`1`、`false`、`0`、`[WIDTH]` 和 `[WIDTH]x[HEIGHT]`。`[WIDTH]` 和 `[WIDTH]x[HEIGHT]` 指定 TTY 尺寸。 | 当终端处于 TTY 模式时为 `true`，否则为 `false`。
| `FORCE_COLOR` | | 是否产生彩色输出。 | 当终端处于 TTY 模式时为 `true`，否则为 `false`。
| `NO_COLOR` | | 是否禁用彩色输出（[no-color.org](https://no-color.org/)）。任何非空值都会禁用颜色。 | 未设置

### Failures 报告器

failures 报告器在失败和成功重试发生时打印它们，然后是摘要。

```bash
npx playwright test --reporter=failures
```

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'failures',
});
```

:::

使用 [`testConfig.quiet`](/api/class-testconfig#test-config-quiet) 来抑制测试的 stdout 和 stderr。

Failures 报告器支持以下配置选项和环境变量：

| 环境变量名 | 报告器配置选项 | 描述 | 默认值 |
|---|---|---|---|
| `PLAYWRIGHT_FAILURES_OMIT_TAGS` | `omitTags` | 是否省略附加到测试标题的测试标签。 | `false` |
| `PLAYWRIGHT_FORCE_TTY` | | 是否产生适合实时终端的输出。 | 当终端处于 TTY 模式时为 `true`，否则为 `false` |
| `FORCE_COLOR` | | 是否产生彩色输出。 | 当终端处于 TTY 模式时为 `true`，否则为 `false` |
| `NO_COLOR` | | 是否禁用彩色输出。 | 未设置 |

### HTML 报告器

HTML 报告器生成一个自包含的文件夹，其中包含可以作为网页提供的测试运行报告。

```bash
npx playwright test --reporter=html
```

默认情况下，如果某些测试失败，HTML 报告会自动打开。你可以通过 Playwright 配置中的 `open` 属性或 `PLAYWRIGHT_HTML_OPEN` 环境变量来控制此行为。该属性的可能值为 `always`、`never` 和 `on-failure`（默认）。

你还可以配置用于提供 HTML 报告的 `host` 和 `port`。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['html', { open: 'never' }]],
});
```

:::

默认情况下，报告写入 package.json 目录或当前工作目录（如果没有找到 package.json）中的 `playwright-report` 文件夹。可以使用 `PLAYWRIGHT_HTML_OUTPUT_DIR` 环境变量或报告器配置覆盖该位置。

在配置文件中，直接传递选项：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['html', { outputFolder: 'my-report' }]],
});
```

:::

如果你要将附件从数据文件夹上传到另一个位置，可以使用 `attachmentsBaseURL` 选项让 html 报告知道在哪里查找它们。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['html', { attachmentsBaseURL: 'https://external-storage.com/' }]],
});
```

:::

快速打开最后一次测试运行报告的方法是：

```bash
npx playwright show-report
```

或者如果有自定义文件夹名称：

```bash
npx playwright show-report my-report
```

你也可以传递一个 `.zip` 归档文件 —— 例如从 CI 产物下载的。归档文件的顶层必须包含 `index.html`。Playwright 将其解压到临时目录并提供报告：

```bash
npx playwright show-report playwright-report.zip
```

HTML 报告器支持以下配置选项和环境变量：

| 环境变量名 | 报告器配置选项| 描述 | 默认值
|---|---|---|---|
| `PLAYWRIGHT_HTML_TITLE` | `title` | 在生成的报告中显示的标题。 | 默认不显示标题
| `PLAYWRIGHT_HTML_ONLY_FAILURES` | `onlyFailures` | 仅包含具有意外结果、不稳定测试（包括成功重试）和中断测试的测试。参见[仅报告失败](#仅报告失败)。 | `false`
| `PLAYWRIGHT_HTML_OUTPUT_DIR` | `outputFolder` | 保存报告的目录。 | `playwright-report`
| `PLAYWRIGHT_HTML_OPEN` | `open` | 何时在浏览器中打开 html 报告，可以是 `'always'`、`'never'` 或 `'on-failure'` 之一 | `'on-failure'`
| `PLAYWRIGHT_HTML_HOST` | `host` | 当报告在浏览器中打开时，它将绑定到此主机名。 | `localhost`
| `PLAYWRIGHT_HTML_PORT` | `port` | 当报告在浏览器中打开时，它将在此端口上提供服务。 | `9323` 或当 `9323` 不可用时的任何可用端口。
| `PLAYWRIGHT_HTML_ATTACHMENTS_BASE_URL` | `attachmentsBaseURL` | 从 `data` 子目录上传附件的单独位置。仅当你将报告和 `data` 分别上传到不同位置时需要。 | `data/`
| `PLAYWRIGHT_HTML_NO_COPY_PROMPT` | `noCopyPrompt` | 如果为 true，禁用渲染错误的复制提示。支持 `true`、`1`、`false` 和 `0`。 | `false`
| `PLAYWRIGHT_HTML_NO_SNIPPETS` | `noSnippets` | 如果为 true，禁用在操作日志中渲染代码片段。如果有顶级错误，带代码片段的报告部分仍会渲染。支持 `true`、`1`、`false` 和 `0`。 | `false`
| `PLAYWRIGHT_HTML_DO_NOT_INLINE_ASSETS` | `doNotInlineAssets` | 如果为 true，JavaScript、CSS 和报告数据将作为单独的文件写入 `index.html` 旁边，而不是内联嵌入。当在禁止内联脚本和样式的严格[内容安全策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)下提供报告时使用此选项。支持 `true`、`1`、`false` 和 `0`。 | `false`
| `PLAYWRIGHT_HTML_MERGE_FILES` | `mergeFiles` | 如果为 true，测试按其顶级 `test.describe()` 标题分组，而不是按它们所属的文件分组。支持 `true`、`1`、`false` 和 `0`。 | `false`

### Blob 报告器

Blob 报告包含有关测试运行的所有详细信息，可用于稍后生成任何其他报告。它们的主要功能是便于合并来自[分片测试](./test-sharding.md)的报告。

```bash
npx playwright test --reporter=blob
```

默认情况下，报告写入 package.json 目录或当前工作目录（如果没有找到 package.json）中的 `blob-report` 目录。

报告文件名看起来像 `report-<hash>.zip` 或使用[分片](./test-sharding.md)时的 `report-<hash>-<shard_number>.zip`。哈希是从 `--grep`、`--grep-invert`、`--project`、[`testConfig.tag`](/api/class-testconfig#test-config-tag) 和作为命令行参数传递的文件过滤器计算的可选值。哈希保证使用不同命令行选项运行 Playwright 将产生不同但在运行之间稳定的报告名称。输出文件名可以在配置文件中覆盖或作为 `'PLAYWRIGHT_BLOB_OUTPUT_FILE'` 环境变量传递。

<Tabs group-id="blob-report" default-value="shards" :tabs='[{"label":"分片","value":"shards"},{"label":"环境","value":"environments"}]'>

<TabItem value="shards">

使用 blob 报告合并多个分片时，你不需要传递任何选项。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'blob',
});
```

:::

</TabItem>

<TabItem value="environments">

在不同环境中运行测试时，你可能想使用 [`testConfig.tag`](/api/class-testconfig#test-config-tag) 添加与环境对应的全局标签。此标签将为合并报告带来清晰度，并将用于生成唯一的 blob 报告名称。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'blob',
  tag: process.env.CI_ENVIRONMENT_NAME,  // 例如 "@APIv2" 或 "@linux"
});
```

:::

</TabItem>

</Tabs>

Blob 报告器支持以下配置选项和环境变量：

| 环境变量名 | 报告器配置选项| 描述 | 默认值
|---|---|---|---|
| `PLAYWRIGHT_BLOB_OUTPUT_DIR` | `outputDir` | 保存输出的目录。在写入新报告之前删除现有内容。 | `blob-report`
| `PLAYWRIGHT_BLOB_OUTPUT_NAME` | `fileName` | 报告文件名。 | `report-<hash>-<shard_number>.zip`
| `PLAYWRIGHT_BLOB_OUTPUT_FILE` | `outputFile` | 输出文件的完整路径。如果定义，`outputDir` 和 `fileName` 将被忽略。 | `undefined`

### JSON 报告器

JSON 报告器生成一个包含所有测试运行信息的对象。

你很可能想将 JSON 写入文件。使用 `--reporter=json` 运行时，使用 `PLAYWRIGHT_JSON_OUTPUT_NAME` 环境变量：

::: code-group

```bash [Bash]
PLAYWRIGHT_JSON_OUTPUT_NAME=results.json npx playwright test --reporter=json
```

```bat [Batch]
set PLAYWRIGHT_JSON_OUTPUT_NAME=results.json
npx playwright test --reporter=json
```

```powershell [PowerShell]
$env:PLAYWRIGHT_JSON_OUTPUT_NAME="results.json"
npx playwright test --reporter=json
```

:::

在配置文件中，直接传递选项：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['json', { outputFile: 'results.json' }]],
});
```

:::

JSON 报告器支持以下配置选项和环境变量：

| 环境变量名 | 报告器配置选项| 描述 | 默认值
|---|---|---|---|
| `PLAYWRIGHT_JSON_OUTPUT_DIR` | | 保存输出文件的目录。如果指定了输出文件则忽略。 | `cwd` 或配置目录。
| `PLAYWRIGHT_JSON_ONLY_FAILURES` | `onlyFailures` | 仅包含具有意外结果、不稳定测试（包括成功重试）和中断测试的测试。参见[仅报告失败](#仅报告失败)。 | `false`
| `PLAYWRIGHT_JSON_OUTPUT_NAME` | | 输出的基本文件名，相对于输出目录。 | JSON 报告打印到 stdout。
| `PLAYWRIGHT_JSON_OUTPUT_FILE` | `outputFile` | 输出文件的完整路径。如果定义，`PLAYWRIGHT_JSON_OUTPUT_DIR` 和 `PLAYWRIGHT_JSON_OUTPUT_NAME` 将被忽略。 | JSON 报告打印到 stdout。

### JUnit 报告器

JUnit 报告器生成 JUnit 风格的 xml 报告。

你很可能想将报告写入 xml 文件。使用 `--reporter=junit` 运行时，使用 `PLAYWRIGHT_JUNIT_OUTPUT_NAME` 环境变量：

::: code-group

```bash [Bash]
PLAYWRIGHT_JUNIT_OUTPUT_NAME=results.xml npx playwright test --reporter=junit
```

```bat [Batch]
set PLAYWRIGHT_JUNIT_OUTPUT_NAME=results.xml
npx playwright test --reporter=junit
```

```powershell [PowerShell]
$env:PLAYWRIGHT_JUNIT_OUTPUT_NAME="results.xml"
npx playwright test --reporter=junit
```

:::

在配置文件中，直接传递选项：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['junit', { outputFile: 'results.xml' }]],
});
```

:::

JUnit 报告器支持以下配置选项和环境变量：

| 环境变量名 | 报告器配置选项| 描述 | 默认值
|---|---|---|---|
| `PLAYWRIGHT_JUNIT_OUTPUT_DIR` | | 保存输出文件的目录。如果指定了输出文件则忽略。 | `cwd` 或配置目录。
| `PLAYWRIGHT_JUNIT_ONLY_FAILURES` | `onlyFailures` | 仅包含具有意外结果、不稳定测试（包括成功重试）和中断测试的测试。无论 `includeRetries` 如何，保留每次尝试。参见[仅报告失败](#仅报告失败)。 | `false`
| `PLAYWRIGHT_JUNIT_OUTPUT_NAME` | | 输出的基本文件名，相对于输出目录。 | JUnit 报告打印到 stdout。
| `PLAYWRIGHT_JUNIT_OUTPUT_FILE` | `outputFile` | 输出文件的完整路径。如果定义，`PLAYWRIGHT_JUNIT_OUTPUT_DIR` 和 `PLAYWRIGHT_JUNIT_OUTPUT_NAME` 将被忽略。 | JUnit 报告打印到 stdout。
| `PLAYWRIGHT_JUNIT_STRIP_ANSI` | `stripANSIControlSequences` | 是否在写入报告之前从文本中删除 ANSI 控制序列。 | 默认情况下，输出文本按原样添加。
| `PLAYWRIGHT_JUNIT_INCLUDE_PROJECT_IN_TEST_NAME` | `includeProjectInTestName` | 是否在每个测试用例中包含 Playwright 项目名称作为名称前缀。 | 默认不包含。
| `PLAYWRIGHT_JUNIT_OMIT_TAGS` | `omitTags` | 是否省略自动附加到失败详情的测试标签。 | `false`
| `PLAYWRIGHT_JUNIT_ADD_FILE_ATTRIBUTE` | `addFileAttribute` | 是否向每个测试用例添加 `file` 属性，其值为测试文件相对于 `fileRoot` 的路径。 | `false`
| `PLAYWRIGHT_JUNIT_FILE_ROOT` | `fileRoot` | `file` 属性相对的目录，例如 monorepo 中的仓库根目录。该选项相对于配置目录解析，环境变量相对于 `cwd` 解析。 | 配置目录。
| `PLAYWRIGHT_JUNIT_SUITE_ID` |  | 根 `<testsuites/>` 报告条目上 `id` 属性的值。 | 空字符串。
| `PLAYWRIGHT_JUNIT_SUITE_NAME` |  | 根 `<testsuites/>` 报告条目上 `name` 属性的值。 | 空字符串。

### Perfetto 报告器

Perfetto 报告器生成一个[跟踪事件格式](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview) json 文件，可以在 [Perfetto UI](https://ui.perfetto.dev) 或 `chrome://tracing` 中打开。它将测试运行渲染为时间线，每个工作进程一个泳道，每个测试是一个包含其 before/after 钩子、夹具和步骤作为嵌套切片的切片。每个切片在其跟踪事件参数中携带测试或步骤的详细信息，包括源位置、[`testStep.params`](/api/class-teststep#test-step-params)、标签、注释、错误、stdio 和附件文件的路径。

```bash
npx playwright test --reporter=perfetto
```

默认情况下，报告写入 `test-results/perfetto.json`。当输出文件名以 `.gz` 结尾时，报告会即时 gzip 压缩，两个查看器都接受这种格式，对于大型测试运行来说是值得的。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['perfetto', { outputFile: 'perfetto.json.gz' }]],
});
```

:::

Perfetto 报告器支持以下配置选项和环境变量：

| 环境变量名 | 报告器配置选项| 描述 | 默认值
|---|---|---|---|
| `PLAYWRIGHT_PERFETTO_OUTPUT_DIR` | | 保存输出文件的目录。如果指定了输出文件则忽略。 | `test-results`
| `PLAYWRIGHT_PERFETTO_OUTPUT_NAME` | | 输出的基本文件名，相对于输出目录。 | `perfetto.json`
| `PLAYWRIGHT_PERFETTO_OUTPUT_FILE` | `outputFile` | 输出文件的完整路径。如果定义，`PLAYWRIGHT_PERFETTO_OUTPUT_DIR` 和 `PLAYWRIGHT_PERFETTO_OUTPUT_NAME` 将被忽略。 | `undefined`

### GitHub Actions 注释

你可以使用内置的 `github` 报告器在 GitHub actions 中运行时获得自动失败注释。

注意，所有其他报告器也可以在 GitHub Actions 上工作，但不提供注释。此外，如果使用矩阵策略运行测试，不建议使用此注释类型，因为堆栈跟踪失败将成倍增加并遮挡 GitHub 文件视图。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // GitHub Actions CI 使用 'github' 生成注释，加上简洁的 'dot'
  // 本地运行时使用默认的 'list'
  reporter: process.env.CI ? 'github' : 'list',
});
```

:::

`github` 报告器接受 `omitTags`（或 `PLAYWRIGHT_GITHUB_OMIT_TAGS` 环境变量）来抑制其注释中的测试标签，例如 `reporter: [['github', { omitTags: true }]]`。

## 自定义报告器

你可以通过实现一个具有一些报告器方法的类来创建自定义报告器。了解更多关于 [Reporter](/api/class-reporter) API。

::: code-group

```js [my-awesome-reporter.ts]
import type {
  FullConfig, FullResult, Reporter, Suite, TestCase, TestResult
} from '@playwright/test/reporter';

class MyReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase, result: TestResult) {
    console.log(`Starting test ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test ${test.title}: ${result.status}`);
  }

  onEnd(result: FullResult) {
    console.log(`Finished the run: ${result.status}`);
  }
}

export default MyReporter;
```

:::

现在使用 [`testConfig.reporter`](/api/class-testconfig#test-config-reporter) 使用此报告器。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: './my-awesome-reporter.ts',
});
```

:::

或者只需将报告器文件路径作为 `--reporter` 命令行选项传递：

```bash
npx playwright test --reporter="./myreporter/my-awesome-reporter.ts"
```

以下是一些开源报告器实现的简短列表，你可以在编写自己的报告器时参考：
* [Allure Reporter](https://github.com/allure-framework/allure-js/tree/main/packages/allure-playwright)
* [Github Actions Reporter](https://github.com/estruyf/playwright-github-actions-reporter)
* [Mail Reporter](https://github.com/estruyf/playwright-mail-reporter)
* [ReportPortal](https://github.com/reportportal/agent-js-playwright)
* [Monocart](https://github.com/cenfun/monocart-reporter)
