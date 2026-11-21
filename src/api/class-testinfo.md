---
title: TestInfo
outline: 2
---

# TestInfo

<Badge type="info" text="Added in: v1.10" />

`TestInfo` contains information about currently running test. It is available to test functions, [`test.beforeEach()`](/api/class-test#test-before-each), [`test.afterEach()`](/api/class-test#test-after-each), [`test.beforeAll()`](/api/class-test#test-before-all) and [`test.afterAll()`](/api/class-test#test-after-all) hooks, and test-scoped fixtures. `TestInfo` provides utilities to control test execution: attach files, update test timeout, determine which test is currently running and whether it was retried, etc.

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }, testInfo) => {
  expect(testInfo.title).toBe('basic test');
  await page.screenshot({ path: testInfo.outputPath('screenshot.png') });
});
```

## Methods

### testInfo.attach() {#test-info-attach}

<Badge type="info" text="Added in: v1.10" /> <Badge type="tip" text="async" />

Attach a value or a file from disk to the current test. Some reporters show test attachments. Either [`path`](/api/class-testinfo#test-info-attach-option-path) or [`body`](/api/class-testinfo#test-info-attach-option-body) must be specified, but not both.

For example, you can attach a screenshot to the test:

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }, testInfo) => {
  await page.goto('https://playwright.dev');
  const screenshot = await page.screenshot();
  await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
});
```

Or you can attach files returned by your APIs:

```js
import { test, expect } from '@playwright/test';
import { download } from './my-custom-helpers';

test('basic test', async ({}, testInfo) => {
  const tmpPath = await download('a');
  await testInfo.attach('downloaded', { path: tmpPath });
});
```

::: info
[`testInfo.attach()`](/api/class-testinfo#test-info-attach) automatically takes care of copying attached files to a
location that is accessible to reporters. You can safely remove the attachment
after awaiting the attach call.
:::

**Arguments**

- <a id="test-info-attach-option-name"></a>`name` `string`

  Attachment name. The name will also be sanitized and used as the prefix of file name
  when saving to disk.
- <a id="test-info-attach-option-options"></a>`options` `Object` *(optional)*

  - <a id="test-info-attach-option-body"></a>`body` `string | Buffer` *(optional)*

    Attachment body. Mutually exclusive with [`path`](/api/class-testinfo#test-info-attach-option-path).
  - <a id="test-info-attach-option-content-type"></a>`contentType` `string` *(optional)*

    Content type of this attachment to properly present in the report, for example `'application/json'` or `'image/png'`. If omitted, content type is inferred based on the [`path`](/api/class-testinfo#test-info-attach-option-path), or defaults to `text/plain` for [string] attachments and `application/octet-stream` for [Buffer] attachments.
  - <a id="test-info-attach-option-path"></a>`path` `string` *(optional)*

    Path on the filesystem to the attached file. Mutually exclusive with [`body`](/api/class-testinfo#test-info-attach-option-body).


### testInfo.fail() {#test-info-fail-1}

<Badge type="info" text="Added in: v1.10" />

Marks the currently running test as "should fail". Playwright Test runs this test and ensures that it is actually failing. This is useful for documentation purposes to acknowledge that some functionality is broken until it is fixed. This is similar to [`test.fail()`](/api/class-test#test-fail).


### testInfo.fail() {#test-info-fail-2}

<Badge type="info" text="Added in: v1.10" />

Conditionally mark the currently running test as "should fail" with an optional description. This is similar to [`test.fail()`](/api/class-test#test-fail).

**Arguments**

- <a id="test-info-fail-2-option-condition"></a>`condition` `boolean`

  Test is marked as "should fail" when the condition is `true`.
- <a id="test-info-fail-2-option-description"></a>`description` `string` *(optional)*

  Optional description that will be reflected in a test report.


### testInfo.fixme() {#test-info-fixme-1}

<Badge type="info" text="Added in: v1.10" />

Mark a test as "fixme", with the intention to fix it. Test is immediately aborted. This is similar to [`test.fixme()`](/api/class-test#test-fixme).


### testInfo.fixme() {#test-info-fixme-2}

<Badge type="info" text="Added in: v1.10" />

Conditionally mark the currently running test as "fixme" with an optional description. This is similar to [`test.fixme()`](/api/class-test#test-fixme).

**Arguments**

- <a id="test-info-fixme-2-option-condition"></a>`condition` `boolean`

  Test is marked as "fixme" when the condition is `true`.
- <a id="test-info-fixme-2-option-description"></a>`description` `string` *(optional)*

  Optional description that will be reflected in a test report.


### testInfo.outputPath() {#test-info-output-path}

<Badge type="info" text="Added in: v1.10" />

Returns a path inside the [`testInfo.outputDir`](/api/class-testinfo#test-info-output-dir) where the test can safely put a temporary file. Guarantees that tests running in parallel will not interfere with each other.

```js
import { test, expect } from '@playwright/test';
import fs from 'fs';

test('example test', async ({}, testInfo) => {
  const file = testInfo.outputPath('dir', 'temporary-file.txt');
  await fs.promises.writeFile(file, 'Put some data to the dir/temporary-file.txt', 'utf8');
});
```

> Note that `pathSegments` accepts path segments to the test output directory such as `testInfo.outputPath('relative', 'path', 'to', 'output')`.
> However, this path must stay within the [`testInfo.outputDir`](/api/class-testinfo#test-info-output-dir) directory for each test (i.e. `test-results/a-test-title`), otherwise it will throw.

**Arguments**

- <a id="test-info-output-path-option-path-segments"></a>`...pathSegments` `Array<string>`

  Path segments to append at the end of the resulting path.

**Returns**

- `string`


### testInfo.setTimeout() {#test-info-set-timeout}

<Badge type="info" text="Added in: v1.10" />

Changes the timeout for the currently running test. Zero means no timeout. Learn more about [various timeouts](../test-timeouts.md).

Timeout is usually specified in the [configuration file](../test-configuration.md), but it could be useful to change the timeout in certain scenarios:

```js
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  // Extend timeout for all tests running this hook by 30 seconds.
  testInfo.setTimeout(testInfo.timeout + 30000);
});
```

**Arguments**

- <a id="test-info-set-timeout-option-timeout"></a>`timeout` `int`

  Timeout in milliseconds.


### testInfo.skip() {#test-info-skip-1}

<Badge type="info" text="Added in: v1.10" />

Unconditionally skip the currently running test. Test is immediately aborted. This is similar to [`test.skip()`](/api/class-test#test-skip).


### testInfo.skip() {#test-info-skip-2}

<Badge type="info" text="Added in: v1.10" />

Conditionally skips the currently running test with an optional description. This is similar to [`test.skip()`](/api/class-test#test-skip).

**Arguments**

- <a id="test-info-skip-2-option-condition"></a>`condition` `boolean`

  A skip condition. Test is skipped when the condition is `true`.
- <a id="test-info-skip-2-option-description"></a>`description` `string` *(optional)*

  Optional description that will be reflected in a test report.


### testInfo.slow() {#test-info-slow-1}

<Badge type="info" text="Added in: v1.10" />

Marks the currently running test as "slow", giving it triple the default timeout. This is similar to [`test.slow()`](/api/class-test#test-slow).


### testInfo.slow() {#test-info-slow-2}

<Badge type="info" text="Added in: v1.10" />

Conditionally mark the currently running test as "slow" with an optional description, giving it triple the default timeout. This is similar to [`test.slow()`](/api/class-test#test-slow).

**Arguments**

- <a id="test-info-slow-2-option-condition"></a>`condition` `boolean`

  Test is marked as "slow" when the condition is `true`.
- <a id="test-info-slow-2-option-description"></a>`description` `string` *(optional)*

  Optional description that will be reflected in a test report.


### testInfo.snapshotPath() {#test-info-snapshot-path}

<Badge type="info" text="Added in: v1.10" />

Returns a path to a snapshot file with the given `name`. Pass [`kind`](/api/class-testinfo#test-info-snapshot-path-option-kind) to obtain a specific path:
* `kind: 'screenshot'` for [`pageAssertions.toHaveScreenshot()`](/api/class-pageassertions#page-assertions-to-have-screenshot-1);
* `kind: 'aria'` for [`locatorAssertions.toMatchAriaSnapshot()`](/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot);
* `kind: 'snapshot'` for [`snapshotAssertions.toMatchSnapshot()`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1).

**Usage**

```js
await expect(page).toHaveScreenshot('header.png');
// Screenshot assertion above expects screenshot at this path:
const screenshotPath = test.info().snapshotPath('header.png', { kind: 'screenshot' });

await expect(page.getByRole('main')).toMatchAriaSnapshot({ name: 'main.aria.yml' });
// Aria snapshot assertion above expects snapshot at this path:
const ariaSnapshotPath = test.info().snapshotPath('main.aria.yml', { kind: 'aria' });

expect('some text').toMatchSnapshot('snapshot.txt');
// Snapshot assertion above expects snapshot at this path:
const snapshotPath = test.info().snapshotPath('snapshot.txt');

expect('some text').toMatchSnapshot(['dir', 'subdir', 'snapshot.txt']);
// Snapshot assertion above expects snapshot at this path:
const nestedPath = test.info().snapshotPath('dir', 'subdir', 'snapshot.txt');
```

**Arguments**

- <a id="test-info-snapshot-path-option-name"></a>`...name` `Array<string>`

  The name of the snapshot or the path segments to define the snapshot file path. Snapshots with the same name in the same test file are expected to be the same.

  When passing [`kind`](/api/class-testinfo#test-info-snapshot-path-option-kind), multiple name segments are not supported.
- <a id="test-info-snapshot-path-option-options"></a>`options` `Object` *(optional)*

  - <a id="test-info-snapshot-path-option-kind"></a>`kind` `"snapshot" | "screenshot" | "aria"` *(optional)* <Badge type="info" text="Added in: v1.53" />

    The snapshot kind controls which snapshot path template is used. See [`testConfig.snapshotPathTemplate`](/api/class-testconfig#test-config-snapshot-path-template) for more details. Defaults to `'snapshot'`.

**Returns**

- `string`


## Properties

### testInfo.annotations {#test-info-annotations}

<Badge type="info" text="Added in: v1.10" />

The list of annotations applicable to the current test. Includes annotations from the test, annotations from all [`test.describe()`](/api/class-test#test-describe) groups the test belongs to and file-level annotations for the test file.

Learn more about [test annotations](../test-annotations.md).

**Type**

- `Array<Object>`


### testInfo.attachments {#test-info-attachments}

<Badge type="info" text="Added in: v1.10" />

The list of files or buffers attached to the current test. Some reporters show test attachments.

To add an attachment, use [`testInfo.attach()`](/api/class-testinfo#test-info-attach) instead of directly pushing onto this array.

**Type**

- `Array<Object>`


### testInfo.column {#test-info-column}

<Badge type="info" text="Added in: v1.10" />

Column number where the currently running test is declared.

**Type**

- `int`


### testInfo.config {#test-info-config}

<Badge type="info" text="Added in: v1.10" />

Processed configuration from the [configuration file](../test-configuration.md).

**Type**

- `FullConfig`


### testInfo.duration {#test-info-duration}

<Badge type="info" text="Added in: v1.10" />

The number of milliseconds the test took to finish. Always zero before the test finishes, either successfully or not. Can be used in [`test.afterEach()`](/api/class-test#test-after-each) hook.

**Type**

- `int`


### testInfo.error {#test-info-error}

<Badge type="info" text="Added in: v1.10" />

First error thrown during test execution, if any. This is equal to the first
element in [`testInfo.errors`](/api/class-testinfo#test-info-errors).

**Type**

- `TestInfoError`


### testInfo.errors {#test-info-errors}

<Badge type="info" text="Added in: v1.10" />

Errors thrown during test execution, if any.

**Type**

- `Array<TestInfoError>`


### testInfo.expectedStatus {#test-info-expected-status}

<Badge type="info" text="Added in: v1.10" />

Expected status for the currently running test. This is usually `'passed'`, except for a few cases:
* `'skipped'` for skipped tests, e.g. with [`test.skip()`](/api/class-test#test-skip);
* `'failed'` for tests marked as failed with [`test.fail()`](/api/class-test#test-fail).

Expected status is usually compared with the actual [`testInfo.status`](/api/class-testinfo#test-info-status):

```js
import { test, expect } from '@playwright/test';

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus)
    console.log(`${testInfo.title} did not run as expected!`);
});
```

**Type**

- `"passed" | "failed" | "timedOut" | "skipped" | "interrupted"`


### testInfo.file {#test-info-file}

<Badge type="info" text="Added in: v1.10" />

Absolute path to a file where the currently running test is declared.

**Type**

- `string`


### testInfo.fn {#test-info-fn}

<Badge type="info" text="Added in: v1.10" />

Test function as passed to `test(title, testFunction)`.

**Type**

- `function()`


### testInfo.line {#test-info-line}

<Badge type="info" text="Added in: v1.10" />

Line number where the currently running test is declared.

**Type**

- `int`


### testInfo.outputDir {#test-info-output-dir}

<Badge type="info" text="Added in: v1.10" />

Absolute path to the output directory for this specific test run. Each test run gets its own directory so they cannot conflict.

**Type**

- `string`


### testInfo.parallelIndex {#test-info-parallel-index}

<Badge type="info" text="Added in: v1.10" />

The index of the worker between `0` and `workers - 1`. It is guaranteed that workers running at the same time have a different `parallelIndex`. When a worker is restarted, for example after a failure, the new worker process has the same `parallelIndex`.

Also available as `process.env.TEST_PARALLEL_INDEX`. Learn more about [parallelism and sharding](../test-parallel.md) with Playwright Test.

**Type**

- `int`


### testInfo.project {#test-info-project}

<Badge type="info" text="Added in: v1.10" />

Processed project configuration from the [configuration file](../test-configuration.md).

**Type**

- `FullProject`


### testInfo.repeatEachIndex {#test-info-repeat-each-index}

<Badge type="info" text="Added in: v1.10" />

Specifies a unique repeat index when running in "repeat each" mode. This mode is enabled by passing `--repeat-each` to the [command line](../test-cli.md).

**Type**

- `int`


### testInfo.retry {#test-info-retry}

<Badge type="info" text="Added in: v1.10" />

Specifies the retry number when the test is retried after a failure. The first test run has [`testInfo.retry`](/api/class-testinfo#test-info-retry) equal to zero, the first retry has it equal to one, and so on. Learn more about [retries](../test-retries.md#retries).

```js
import { test, expect } from '@playwright/test';

test.beforeEach(async ({}, testInfo) => {
  // You can access testInfo.retry in any hook or fixture.
  if (testInfo.retry > 0)
    console.log(`Retrying!`);
});

test('my test', async ({ page }, testInfo) => {
  // Here we clear some server-side state when retrying.
  if (testInfo.retry)
    await cleanSomeCachesOnTheServer();
  // ...
});
```

**Type**

- `int`


### testInfo.snapshotDir {#test-info-snapshot-dir}

<Badge type="info" text="Added in: v1.10" />

Absolute path to the snapshot output directory for this specific test. Each test suite gets its own directory so they cannot conflict.

This property does not account for the [`testProject.snapshotPathTemplate`](/api/class-testproject#test-project-snapshot-path-template) configuration.

**Type**

- `string`


### testInfo.snapshotSuffix {#test-info-snapshot-suffix}

<Badge type="info" text="Added in: v1.10" />

::: info
Use of [`testInfo.snapshotSuffix`](/api/class-testinfo#test-info-snapshot-suffix) is discouraged. Please use [`testConfig.snapshotPathTemplate`](/api/class-testconfig#test-config-snapshot-path-template) to configure
snapshot paths.
:::

Suffix used to differentiate snapshots between multiple test configurations. For example, if snapshots depend on the platform, you can set `testInfo.snapshotSuffix` equal to `process.platform`. In this case `expect(value).toMatchSnapshot(snapshotName)` will use different snapshots depending on the platform. Learn more about [snapshots](../test-snapshots.md).

**Type**

- `string`


### testInfo.status {#test-info-status}

<Badge type="info" text="Added in: v1.10" />

Actual status for the currently running test. Available after the test has finished in [`test.afterEach()`](/api/class-test#test-after-each) hook and fixtures.

Status is usually compared with the [`testInfo.expectedStatus`](/api/class-testinfo#test-info-expected-status):

```js
import { test, expect } from '@playwright/test';

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus)
    console.log(`${testInfo.title} did not run as expected!`);
});
```

**Type**

- `"passed" | "failed" | "timedOut" | "skipped" | "interrupted"`


### testInfo.tags {#test-info-tags}

<Badge type="info" text="Added in: v1.43" />

Tags that apply to the test. Learn more about [tags](../test-annotations.md#tag-tests).

::: info
Any changes made to this list while the test is running will not be visible to test reporters.
:::

**Type**

- `Array<string>`


### testInfo.testId {#test-info-test-id}

<Badge type="info" text="Added in: v1.32" />

Test id matching the test case id in the reporter API.

**Type**

- `string`


### testInfo.timeout {#test-info-timeout}

<Badge type="info" text="Added in: v1.10" />

Timeout in milliseconds for the currently running test. Zero means no timeout. Learn more about [various timeouts](../test-timeouts.md).

Timeout is usually specified in the [configuration file](../test-configuration.md)

```js
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  // Extend timeout for all tests running this hook by 30 seconds.
  testInfo.setTimeout(testInfo.timeout + 30000);
});
```

**Type**

- `int`


### testInfo.title {#test-info-title}

<Badge type="info" text="Added in: v1.10" />

The title of the currently running test as passed to `test(title, testFunction)`.

**Type**

- `string`


### testInfo.titlePath {#test-info-title-path}

<Badge type="info" text="Added in: v1.10" />

The full title path starting with the test file name.

**Type**

- `Array<string>`


### testInfo.workerIndex {#test-info-worker-index}

<Badge type="info" text="Added in: v1.10" />

The unique index of the worker process that is running the test. When a worker is restarted, for example after a failure, the new worker process gets a new unique `workerIndex`.

Also available as `process.env.TEST_WORKER_INDEX`. Learn more about [parallelism and sharding](../test-parallel.md) with Playwright Test.

**Type**

- `int`

