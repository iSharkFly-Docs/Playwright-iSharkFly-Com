---
title: TestInfo
outline: 2
---

# TestInfo

<Badge type="info" text="Added in: v1.10" />

`TestInfo` 包含有关当前运行测试的信息。它对测试函数、[`test.beforeEach()`](/api/class-test#test-before-each)、[`test.afterEach()`](/api/class-test#test-after-each)、[`test.beforeAll()`](/api/class-test#test-before-all) 和 [`test.afterAll()`](/api/class-test#test-after-all) 钩子以及测试范围的 fixtures 可用。`TestInfo` 提供用于控制测试执行的实用程序：附加文件、更新测试超时、确定当前正在运行哪个测试以及它是否被重试等。

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }, testInfo) => {
  expect(testInfo.title).toBe('basic test');
  await page.screenshot({ path: testInfo.outputPath('screenshot.png') });
});
```

## 方法

### testInfo.attach() {#test-info-attach}

<Badge type="info" text="Added in: v1.10" /> <Badge type="tip" text="async" />

将值或磁盘上的文件附加到当前测试。一些报告器会显示测试附件。必须指定 [`path`](/api/class-testinfo#test-info-attach-option-path) 或 [`body`](/api/class-testinfo#test-info-attach-option-body) 之一，但不能同时指定两者。

例如，你可以将屏幕截图附加到测试：

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }, testInfo) => {
  await page.goto('https://playwright.dev');
  const screenshot = await page.screenshot();
  await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
});
```

或者你可以附加 API 返回的文件：

```js
import { test, expect } from '@playwright/test';
import { download } from './my-custom-helpers';

test('basic test', async ({}, testInfo) => {
  const tmpPath = await download('a');
  await testInfo.attach('downloaded', { path: tmpPath });
});
```

::: info
[`testInfo.attach()`](/api/class-testinfo#test-info-attach) 会自动将附加的文件复制到报告器可以访问的位置。你可以在等待 attach 调用后安全地删除附件。
:::

**参数**

- <a id="test-info-attach-option-name"></a>`name` `string`

  附件名称。该名称也将被清理并用作保存到磁盘时的文件名前缀。
- <a id="test-info-attach-option-options"></a>`options` `Object` *(可选)*

  - <a id="test-info-attach-option-body"></a>`body` `string | Buffer` *(可选)*

    附件正文。与 [`path`](/api/class-testinfo#test-info-attach-option-path) 互斥。
  - <a id="test-info-attach-option-content-type"></a>`contentType` `string` *(可选)*

    此附件的内容类型，以便在报告中正确呈现，例如 `'application/json'` 或 `'image/png'`。如果省略，内容类型将根据 [`path`](/api/class-testinfo#test-info-attach-option-path) 推断，或者对于 [string] 附件默认为 `text/plain`，对于 [Buffer] 附件默认为 `application/octet-stream`。
  - <a id="test-info-attach-option-path"></a>`path` `string` *(可选)*

    文件系统上附加文件的路径。与 [`body`](/api/class-testinfo#test-info-attach-option-body) 互斥。


### testInfo.fail() {#test-info-fail-1}

<Badge type="info" text="Added in: v1.10" />

将当前运行的测试标记为"应该失败"。Playwright Test 会运行此测试并确保它实际失败。这对于文档目的很有用，可以承认某些功能在修复之前是损坏的。这类似于 [`test.fail()`](/api/class-test#test-fail)。


### testInfo.fail() {#test-info-fail-2}

<Badge type="info" text="Added in: v1.10" />

有条件地将当前运行的测试标记为"应该失败"，可选地带有描述。这类似于 [`test.fail()`](/api/class-test#test-fail)。

**参数**

- <a id="test-info-fail-2-option-condition"></a>`condition` `boolean`

  当条件为 `true` 时，测试被标记为"应该失败"。
- <a id="test-info-fail-2-option-description"></a>`description` `string` *(可选)*

  将反映在测试报告中的可选描述。


### testInfo.fixme() {#test-info-fixme-1}

<Badge type="info" text="Added in: v1.10" />

将测试标记为 "fixme"，意图是稍后修复它。测试会立即中止。这类似于 [`test.fixme()`](/api/class-test#test-fixme)。


### testInfo.fixme() {#test-info-fixme-2}

<Badge type="info" text="Added in: v1.10" />

有条件地将当前运行的测试标记为 "fixme"，可选地带有描述。这类似于 [`test.fixme()`](/api/class-test#test-fixme)。

**参数**

- <a id="test-info-fixme-2-option-condition"></a>`condition` `boolean`

  当条件为 `true` 时，测试被标记为 "fixme"。
- <a id="test-info-fixme-2-option-description"></a>`description` `string` *(可选)*

  将反映在测试报告中的可选描述。


### testInfo.outputPath() {#test-info-output-path}

<Badge type="info" text="Added in: v1.10" />

返回 [`testInfo.outputDir`](/api/class-testinfo#test-info-output-dir) 内的路径，测试可以安全地在其中放置临时文件。保证并行运行的测试不会相互干扰。

```js
import { test, expect } from '@playwright/test';
import fs from 'fs';

test('example test', async ({}, testInfo) => {
  const file = testInfo.outputPath('dir', 'temporary-file.txt');
  await fs.promises.writeFile(file, 'Put some data to the dir/temporary-file.txt', 'utf8');
});
```

> 注意 `pathSegments` 接受到测试输出目录的路径段，例如 `testInfo.outputPath('relative', 'path', 'to', 'output')`。
> 但是，此路径必须保持在每个测试的 [`testInfo.outputDir`](/api/class-testinfo#test-info-output-dir) 目录内（即 `test-results/a-test-title`），否则会抛出错误。

**参数**

- <a id="test-info-output-path-option-path-segments"></a>`...pathSegments` `Array<string>`

  要追加到结果路径末尾的路径段。

**返回值**

- `string`


### testInfo.setTimeout() {#test-info-set-timeout}

<Badge type="info" text="Added in: v1.10" />

更改当前运行测试的超时时间。零表示无超时。了解更多关于[各种超时](../test-timeouts.md)的信息。

超时通常在[配置文件](../test-configuration.md)中指定，但在某些情况下更改超时可能很有用：

```js
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  // 将运行此钩子的所有测试的超时时间延长 30 秒。
  testInfo.setTimeout(testInfo.timeout + 30000);
});
```

**参数**

- <a id="test-info-set-timeout-option-timeout"></a>`timeout` `int`

  超时时间（毫秒）。


### testInfo.skip() {#test-info-skip-1}

<Badge type="info" text="Added in: v1.10" />

无条件跳过当前运行的测试。测试会立即中止。这类似于 [`test.skip()`](/api/class-test#test-skip)。


### testInfo.skip() {#test-info-skip-2}

<Badge type="info" text="Added in: v1.10" />

有条件地跳过当前运行的测试，可选地带有描述。这类似于 [`test.skip()`](/api/class-test#test-skip)。

**参数**

- <a id="test-info-skip-2-option-condition"></a>`condition` `boolean`

  跳过条件。当条件为 `true` 时跳过测试。
- <a id="test-info-skip-2-option-description"></a>`description` `string` *(可选)*

  将反映在测试报告中的可选描述。


### testInfo.slow() {#test-info-slow-1}

<Badge type="info" text="Added in: v1.10" />

将当前运行的测试标记为"慢速"，给它三倍的默认超时时间。这类似于 [`test.slow()`](/api/class-test#test-slow)。


### testInfo.slow() {#test-info-slow-2}

<Badge type="info" text="Added in: v1.10" />

有条件地将当前运行的测试标记为"慢速"，可选地带有描述，给它三倍的默认超时时间。这类似于 [`test.slow()`](/api/class-test#test-slow)。

**参数**

- <a id="test-info-slow-2-option-condition"></a>`condition` `boolean`

  当条件为 `true` 时，测试被标记为"慢速"。
- <a id="test-info-slow-2-option-description"></a>`description` `string` *(可选)*

  将反映在测试报告中的可选描述。


### testInfo.snapshotPath() {#test-info-snapshot-path}

<Badge type="info" text="Added in: v1.10" />

返回给定 `name` 的快照文件路径。传递 [`kind`](/api/class-testinfo#test-info-snapshot-path-option-kind) 以获取特定路径：
* `kind: 'screenshot'` 用于 [`pageAssertions.toHaveScreenshot()`](/api/class-pageassertions#page-assertions-to-have-screenshot-1)；
* `kind: 'aria'` 用于 [`locatorAssertions.toMatchAriaSnapshot()`](/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot)；
* `kind: 'snapshot'` 用于 [`snapshotAssertions.toMatchSnapshot()`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1)。

**用法**

```js
await expect(page).toHaveScreenshot('header.png');
// 上面的屏幕截图断言期望屏幕截图在此路径：
const screenshotPath = test.info().snapshotPath('header.png', { kind: 'screenshot' });

await expect(page.getByRole('main')).toMatchAriaSnapshot({ name: 'main.aria.yml' });
// 上面的 Aria 快照断言期望快照在此路径：
const ariaSnapshotPath = test.info().snapshotPath('main.aria.yml', { kind: 'aria' });

expect('some text').toMatchSnapshot('snapshot.txt');
// 上面的快照断言期望快照在此路径：
const snapshotPath = test.info().snapshotPath('snapshot.txt');

expect('some text').toMatchSnapshot(['dir', 'subdir', 'snapshot.txt']);
// 上面的快照断言期望快照在此路径：
const nestedPath = test.info().snapshotPath('dir', 'subdir', 'snapshot.txt');
```

**参数**

- <a id="test-info-snapshot-path-option-name"></a>`...name` `Array<string>`

  快照的名称或定义快照文件路径的路径段。同一测试文件中具有相同名称的快照应该是相同的。

  当传递 [`kind`](/api/class-testinfo#test-info-snapshot-path-option-kind) 时，不支持多个名称段。
- <a id="test-info-snapshot-path-option-options"></a>`options` `Object` *(可选)*

  - <a id="test-info-snapshot-path-option-kind"></a>`kind` `"snapshot" | "screenshot" | "aria"` *(可选)* <Badge type="info" text="Added in: v1.53" />

    快照类型控制使用哪个快照路径模板。有关更多详情，请参阅 [`testConfig.snapshotPathTemplate`](/api/class-testconfig#test-config-snapshot-path-template)。默认为 `'snapshot'`。

**返回值**

- `string`


## 属性

### testInfo.annotations {#test-info-annotations}

<Badge type="info" text="Added in: v1.10" />

适用于当前测试的注解列表。包括测试的注解、测试所属的所有 [`test.describe()`](/api/class-test#test-describe) 组的注解以及测试文件的文件级注解。

了解更多关于[测试注解](../test-annotations.md)的信息。

**类型**

- `Array<Object>`


### testInfo.attachments {#test-info-attachments}

<Badge type="info" text="Added in: v1.10" />

附加到当前测试的文件或缓冲区列表。一些报告器会显示测试附件。

要添加附件，请使用 [`testInfo.attach()`](/api/class-testinfo#test-info-attach) 而不是直接推送到此数组。

**类型**

- `Array<Object>`


### testInfo.column {#test-info-column}

<Badge type="info" text="Added in: v1.10" />

当前运行测试声明的列号。

**类型**

- `int`


### testInfo.config {#test-info-config}

<Badge type="info" text="Added in: v1.10" />

来自[配置文件](../test-configuration.md)的已处理配置。

**类型**

- `FullConfig`


### testInfo.duration {#test-info-duration}

<Badge type="info" text="Added in: v1.10" />

测试完成所花费的毫秒数。在测试完成之前始终为零，无论成功与否。可以在 [`test.afterEach()`](/api/class-test#test-after-each) 钩子中使用。

**类型**

- `int`


### testInfo.error {#test-info-error}

<Badge type="info" text="Added in: v1.10" />

测试执行期间抛出的第一个错误（如果有）。这等于 [`testInfo.errors`](/api/class-testinfo#test-info-errors) 中的第一个元素。

**类型**

- `TestInfoError`


### testInfo.errors {#test-info-errors}

<Badge type="info" text="Added in: v1.10" />

测试执行期间抛出的错误（如果有）。

**类型**

- `Array<TestInfoError>`


### testInfo.expectedStatus {#test-info-expected-status}

<Badge type="info" text="Added in: v1.10" />

当前运行测试的预期状态。通常是 `'passed'`，除了少数情况：
* `'skipped'` 用于跳过的测试，例如使用 [`test.skip()`](/api/class-test#test-skip)；
* `'failed'` 用于使用 [`test.fail()`](/api/class-test#test-fail) 标记为失败的测试。

预期状态通常与实际的 [`testInfo.status`](/api/class-testinfo#test-info-status) 进行比较：

```js
import { test, expect } from '@playwright/test';

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus)
    console.log(`${testInfo.title} did not run as expected!`);
});
```

**类型**

- `"passed" | "failed" | "timedOut" | "skipped" | "interrupted"`


### testInfo.file {#test-info-file}

<Badge type="info" text="Added in: v1.10" />

当前运行测试声明的文件的绝对路径。

**类型**

- `string`


### testInfo.fn {#test-info-fn}

<Badge type="info" text="Added in: v1.10" />

传递给 `test(title, testFunction)` 的测试函数。

**类型**

- `function()`


### testInfo.line {#test-info-line}

<Badge type="info" text="Added in: v1.10" />

当前运行测试声明的行号。

**类型**

- `int`


### testInfo.outputDir {#test-info-output-dir}

<Badge type="info" text="Added in: v1.10" />

此特定测试运行的输出目录的绝对路径。每个测试运行都有自己的目录，因此它们不会冲突。

**类型**

- `string`


### testInfo.parallelIndex {#test-info-parallel-index}

<Badge type="info" text="Added in: v1.10" />

`0` 到 `workers - 1` 之间的 worker 索引。保证同时运行的 worker 具有不同的 `parallelIndex`。当 worker 重启时，例如在失败后，新的 worker 进程具有相同的 `parallelIndex`。

也可作为 `process.env.TEST_PARALLEL_INDEX` 使用。了解更多关于使用 Playwright Test 的[并行和分片](../test-parallel.md)。

**类型**

- `int`


### testInfo.project {#test-info-project}

<Badge type="info" text="Added in: v1.10" />

来自[配置文件](../test-configuration.md)的已处理项目配置。

**类型**

- `FullProject`


### testInfo.repeatEachIndex {#test-info-repeat-each-index}

<Badge type="info" text="Added in: v1.10" />

在"每次重复"模式下运行时指定唯一的重复索引。通过向[命令行](../test-cli.md)传递 `--repeat-each` 来启用此模式。

**类型**

- `int`


### testInfo.retry {#test-info-retry}

<Badge type="info" text="Added in: v1.10" />

指定测试在失败后重试时的重试次数。第一次测试运行时 [`testInfo.retry`](/api/class-testinfo#test-info-retry) 等于零，第一次重试时等于一，依此类推。了解更多关于[重试](../test-retries.md#retries)的信息。

```js
import { test, expect } from '@playwright/test';

test.beforeEach(async ({}, testInfo) => {
  // 你可以在任何钩子或 fixture 中访问 testInfo.retry。
  if (testInfo.retry > 0)
    console.log(`Retrying!`);
});

test('my test', async ({ page }, testInfo) => {
  // 这里我们在重试时清除一些服务器端状态。
  if (testInfo.retry)
    await cleanSomeCachesOnTheServer();
  // ...
});
```

**类型**

- `int`


### testInfo.snapshotDir {#test-info-snapshot-dir}

<Badge type="info" text="Added in: v1.10" />

此特定测试的快照输出目录的绝对路径。每个测试套件都有自己的目录，因此它们不会冲突。

此属性不考虑 [`testProject.snapshotPathTemplate`](/api/class-testproject#test-project-snapshot-path-template) 配置。

**类型**

- `string`


### testInfo.snapshotSuffix {#test-info-snapshot-suffix}

<Badge type="info" text="Added in: v1.10" />

::: info
不建议使用 [`testInfo.snapshotSuffix`](/api/class-testinfo#test-info-snapshot-suffix)。请使用 [`testConfig.snapshotPathTemplate`](/api/class-testconfig#test-config-snapshot-path-template) 配置快照路径。
:::

用于区分多个测试配置之间快照的后缀。例如，如果快照取决于平台，你可以将 `testInfo.snapshotSuffix` 设置为等于 `process.platform`。在这种情况下，`expect(value).toMatchSnapshot(snapshotName)` 将根据平台使用不同的快照。了解更多关于[快照](../test-snapshots.md)的信息。

**类型**

- `string`


### testInfo.status {#test-info-status}

<Badge type="info" text="Added in: v1.10" />

当前运行测试的实际状态。在测试完成后的 [`test.afterEach()`](/api/class-test#test-after-each) 钩子和 fixtures 中可用。

状态通常与 [`testInfo.expectedStatus`](/api/class-testinfo#test-info-expected-status) 进行比较：

```js
import { test, expect } from '@playwright/test';

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus)
    console.log(`${testInfo.title} did not run as expected!`);
});
```

**类型**

- `"passed" | "failed" | "timedOut" | "skipped" | "interrupted"`


### testInfo.tags {#test-info-tags}

<Badge type="info" text="Added in: v1.43" />

适用于测试的标签。了解更多关于[标签](../test-annotations.md#tag-tests)的信息。

::: info
在测试运行期间对此列表所做的任何更改将对测试报告器不可见。
:::

**类型**

- `Array<string>`


### testInfo.testId {#test-info-test-id}

<Badge type="info" text="Added in: v1.32" />

与报告器 API 中的测试用例 id 匹配的测试 id。

**类型**

- `string`


### testInfo.timeout {#test-info-timeout}

<Badge type="info" text="Added in: v1.10" />

当前运行测试的超时时间（毫秒）。零表示无超时。了解更多关于[各种超时](../test-timeouts.md)的信息。

超时通常在[配置文件](../test-configuration.md)中指定

```js
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  // 将运行此钩子的所有测试的超时时间延长 30 秒。
  testInfo.setTimeout(testInfo.timeout + 30000);
});
```

**类型**

- `int`


### testInfo.title {#test-info-title}

<Badge type="info" text="Added in: v1.10" />

传递给 `test(title, testFunction)` 的当前运行测试的标题。

**类型**

- `string`


### testInfo.titlePath {#test-info-title-path}

<Badge type="info" text="Added in: v1.10" />

从测试文件名开始的完整标题路径。

**类型**

- `Array<string>`


### testInfo.workerIndex {#test-info-worker-index}

<Badge type="info" text="Added in: v1.10" />

运行测试的 worker 进程的唯一索引。当 worker 重启时，例如在失败后，新的 worker 进程获得一个新的唯一 `workerIndex`。

也可作为 `process.env.TEST_WORKER_INDEX` 使用。了解更多关于使用 Playwright Test 的[并行和分片](../test-parallel.md)。

**类型**

- `int`
