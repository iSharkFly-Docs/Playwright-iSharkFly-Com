---
title: TestConfig
outline: 2
---

# TestConfig

<Badge type="info" text="Added in: v1.10" />

Playwright Test provides many options to configure how your tests are collected and executed, for example `timeout` or `testDir`. These options are described in the [TestConfig](/api/class-testconfig) object in the [configuration file](../test-configuration.md). This type describes format of the configuration file, to access resolved configuration parameters at run time use [FullConfig](/api/class-fullconfig).

Playwright Test supports running multiple test projects at the same time. Project-specific options should be put to [`testConfig.projects`](/api/class-testconfig#test-config-projects), but top-level [TestConfig](/api/class-testconfig) can also define base options shared between all projects.

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

## Properties

### testConfig.build {#test-config-build}

<Badge type="info" text="Added in: v1.35" />

Playwright transpiler configuration.

**Usage**

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

**Type**

- `Object`


### testConfig.captureGitInfo {#test-config-capture-git-info}

<Badge type="info" text="Added in: v1.51" />

These settings control whether git information is captured and stored in the config [`testConfig.metadata`](/api/class-testconfig#test-config-metadata).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  captureGitInfo: { commit: true, diff: true }
});
```

:::

**Details**
* Capturing `commit` information is useful when you'd like to see it in your HTML (or a third party) report.
* Capturing `diff` information is useful to enrich the report with the actual source diff. This information can be used to provide intelligent advice on how to fix the test.

::: info
Default values for these settings depend on the environment. When tests run as a part of CI where it is safe to obtain git information, the default value is `true`, `false` otherwise.
:::

::: info
The structure of the git commit metadata is subject to change.
:::

**Type**

- `Object`


### testConfig.expect {#test-config-expect}

<Badge type="info" text="Added in: v1.10" />

Configuration for the `expect` assertion library. Learn more about [various timeouts](../test-timeouts.md).

**Usage**

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

**Type**

- `Object`


### testConfig.failOnFlakyTests {#test-config-fail-on-flaky-tests}

<Badge type="info" text="Added in: v1.52" />

Whether to exit with an error if any tests are marked as flaky. Useful on CI.

Also available in the [command line](../test-cli.md) with the `--fail-on-flaky-tests` option.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  failOnFlakyTests: !!process.env.CI,
});
```

:::

**Type**

- `boolean`


### testConfig.forbidOnly {#test-config-forbid-only}

<Badge type="info" text="Added in: v1.10" />

Whether to exit with an error if any tests or groups are marked as [`test.only()`](/api/class-test#test-only) or [`test.describe.only()`](/api/class-test#test-describe-only). Useful on CI.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  forbidOnly: !!process.env.CI,
});
```

:::

**Type**

- `boolean`


### testConfig.fullyParallel {#test-config-fully-parallel}

<Badge type="info" text="Added in: v1.20" />

Playwright Test runs tests in parallel. In order to achieve that, it runs several worker processes that run at the same time.
By default, **test files** are run in parallel. Tests in a single file are run in order, in the same worker process.

You can configure entire test run to concurrently execute all tests in all files using this option.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
});
```

:::

**Type**

- `boolean`


### testConfig.globalSetup {#test-config-global-setup}

<Badge type="info" text="Added in: v1.10" />

Path to the global setup file. This file will be required and run before all the tests. It must export a single function that takes a [FullConfig](/api/class-fullconfig) argument. Pass an array of paths to specify multiple global setup files.

Learn more about [global setup and teardown](../test-global-setup-teardown.md).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './global-setup',
});
```

:::

**Type**

- `string | Array<string>`


### testConfig.globalTeardown {#test-config-global-teardown}

<Badge type="info" text="Added in: v1.10" />

Path to the global teardown file. This file will be required and run after all the tests. It must export a single function. See also [`testConfig.globalSetup`](/api/class-testconfig#test-config-global-setup). Pass an array of paths to specify multiple global teardown files.

Learn more about [global setup and teardown](../test-global-setup-teardown.md).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalTeardown: './global-teardown',
});
```

:::

**Type**

- `string | Array<string>`


### testConfig.globalTimeout {#test-config-global-timeout}

<Badge type="info" text="Added in: v1.10" />

Maximum time in milliseconds the whole test suite can run. Zero timeout (default) disables this behavior. Useful on CI to prevent broken setup from running too long and wasting resources. Learn more about [various timeouts](../test-timeouts.md).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined,
});
```

:::

**Type**

- `int`


### testConfig.grep {#test-config-grep}

<Badge type="info" text="Added in: v1.10" />

Filter to only run tests with a title matching one of the patterns. For example, passing `grep: /cart/` should only run tests with "cart" in the title. Also available in the [command line](../test-cli.md) with the `-g` option. The regular expression will be tested against the string that consists of the project name, the test file name, the `test.describe` name (if any), the test name and the test tags divided by spaces, e.g. `chromium my-test.spec.ts my-suite my-test`.

`grep` option is also useful for [tagging tests](../test-annotations.md#tag-tests).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  grep: /smoke/,
});
```

:::

**Type**

- `RegExp | Array<RegExp>`


### testConfig.grepInvert {#test-config-grep-invert}

<Badge type="info" text="Added in: v1.10" />

Filter to only run tests with a title **not** matching one of the patterns. This is the opposite of [`testConfig.grep`](/api/class-testconfig#test-config-grep). Also available in the [command line](../test-cli.md) with the `--grep-invert` option.

`grepInvert` option is also useful for [tagging tests](../test-annotations.md#tag-tests).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  grepInvert: /manual/,
});
```

:::

**Type**

- `RegExp | Array<RegExp>`


### testConfig.ignoreSnapshots {#test-config-ignore-snapshots}

<Badge type="info" text="Added in: v1.26" />

Whether to skip snapshot expectations, such as `expect(value).toMatchSnapshot()` and `await expect(page).toHaveScreenshot()`.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  ignoreSnapshots: !process.env.CI,
});
```

:::

**Type**

- `boolean`


### testConfig.maxFailures {#test-config-max-failures}

<Badge type="info" text="Added in: v1.10" />

The maximum number of test failures for the whole test suite run. After reaching this number, testing will stop and exit with an error. Setting to zero (default) disables this behavior.

Also available in the [command line](../test-cli.md) with the `--max-failures` and `-x` options.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  maxFailures: process.env.CI ? 1 : 0,
});
```

:::

**Type**

- `int`


### testConfig.metadata {#test-config-metadata}

<Badge type="info" text="Added in: v1.10" />

Metadata contains key-value pairs to be included in the report. For example, the JSON report will include metadata serialized as JSON.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  metadata: { title: 'acceptance tests' },
});
```

:::

**Type**

- `Metadata`


### testConfig.name {#test-config-name}

<Badge type="info" text="Added in: v1.10" />

Config name is visible in the report and during test execution, unless overridden by [`testProject.name`](/api/class-testproject#test-project-name).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  name: 'acceptance tests',
});
```

:::

**Type**

- `string`


### testConfig.outputDir {#test-config-output-dir}

<Badge type="info" text="Added in: v1.10" />

The output directory for files created during test execution. Defaults to `<package.json-directory>/test-results`.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  outputDir: './test-results',
});
```

:::

**Details**

This directory is cleaned at the start. When running a test, a unique subdirectory inside the [`testConfig.outputDir`](/api/class-testconfig#test-config-output-dir) is created, guaranteeing that test running in parallel do not conflict. This directory can be accessed by [`testInfo.outputDir`](/api/class-testinfo#test-info-output-dir) and [`testInfo.outputPath()`](/api/class-testinfo#test-info-output-path).

Here is an example that uses [`testInfo.outputPath()`](/api/class-testinfo#test-info-output-path) to create a temporary file.

```js
import { test, expect } from '@playwright/test';
import fs from 'fs';

test('example test', async ({}, testInfo) => {
  const file = testInfo.outputPath('temporary-file.txt');
  await fs.promises.writeFile(file, 'Put some data to the file', 'utf8');
});
```

**Type**

- `string`


### testConfig.preserveOutput {#test-config-preserve-output}

<Badge type="info" text="Added in: v1.10" />

Whether to preserve test output in the [`testConfig.outputDir`](/api/class-testconfig#test-config-output-dir). Defaults to `'always'`.
* `'always'` - preserve output for all tests;
* `'never'` - do not preserve output for any tests;
* `'failures-only'` - only preserve output for failed tests.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  preserveOutput: 'always',
});
```

:::

**Type**

- `"always" | "never" | "failures-only"`


### testConfig.projects {#test-config-projects}

<Badge type="info" text="Added in: v1.10" />

Playwright Test supports running multiple test projects at the same time. See [TestProject](/api/class-testproject) for more information.

**Usage**

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

**Type**

- `Array<TestProject>`


### testConfig.quiet {#test-config-quiet}

<Badge type="info" text="Added in: v1.10" />

Whether to suppress stdio and stderr output from the tests.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  quiet: !!process.env.CI,
});
```

:::

**Type**

- `boolean`


### testConfig.repeatEach {#test-config-repeat-each}

<Badge type="info" text="Added in: v1.10" />

The number of times to repeat each test, useful for debugging flaky tests.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  repeatEach: 3,
});
```

:::

**Type**

- `int`


### testConfig.reporter {#test-config-reporter}

<Badge type="info" text="Added in: v1.10" />

The list of reporters to use. Each reporter can be:
* A builtin reporter name like `'list'` or `'json'`.
* A module name like `'my-awesome-reporter'`.
* A relative path to the reporter like `'./reporters/my-awesome-reporter.js'`.

You can pass options to the reporter in a tuple like `['json', { outputFile: './report.json' }]`. If the property is not specified, Playwright uses the `'dot'` reporter when the CI environment variable is set, and the `'list'` reporter otherwise.

Learn more in the [reporters guide](../test-reporters.md).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'line',
});
```

:::

**Type**

- `string | Array<Object> | "list" | "dot" | "failures" | "line" | "github" | "json" | "junit" | "null" | "html" | "blob" | "perfetto"`


### testConfig.reportSlowTests {#test-config-report-slow-tests}

<Badge type="info" text="Added in: v1.10" />

Whether to report slow test files. Pass `null` to disable this feature.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reportSlowTests: null,
});
```

:::

**Details**

Test files that took more than `threshold` milliseconds are considered slow, and the slowest ones are reported, no more than `max` number of them. Passing zero as `max` reports all test files that exceed the threshold.

**Type**

- `null | Object`


### testConfig.respectGitIgnore {#test-config-respect-git-ignore}

<Badge type="info" text="Added in: v1.45" />

Whether to skip entries from `.gitignore` when searching for test files. By default, if neither [`testConfig.testDir`](/api/class-testconfig#test-config-test-dir) nor [`testProject.testDir`](/api/class-testproject#test-project-test-dir) are explicitly specified, Playwright will ignore any test files matching `.gitignore` entries.

**Type**

- `boolean`


### testConfig.retries {#test-config-retries}

<Badge type="info" text="Added in: v1.10" />

The maximum number of retry attempts given to failed tests. By default failing tests are not retried. Learn more about [test retries](../test-retries.md#retries).

When set to a list, the number of retries depends on the error. After each failed attempt, Playwright takes the largest `count` among the entries that apply, and retries the test when it has run fewer times than that. The latest failed attempt decides: a test that first fails with a matching error and then with a different one only gets the retries of the latter. Worker crashes and timeouts are matched by their error message like any other failure.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: 2,
});
```

:::

Retry any failure once, and up to three times when the browser or the worker crashed:

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

**Type**

- `int | Array<Object>`


### testConfig.retryStrategy {#test-config-retry-strategy}

<Badge type="info" text="Added in: v1.62" />

Controls when failed tests are retried. Defaults to `'immediate'`.
* `'immediate'` - A failed test is retried as soon as a worker is available, interleaved with the rest of the run. This is the default.
* `'deferred'` - Retries are queued after tests that have not yet run. They can run in parallel with other tests and retries, up to the configured number of [`testConfig.workers`](/api/class-testconfig#test-config-workers).
* `'isolated'` - Retries are run at the end, after all other tests have finished, one by one in a single worker. This minimizes the interference between retried tests and the rest of the suite, at the expense of the total run time.

Learn more about [test retries](../test-retries.md#retries).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: 2,
  retryStrategy: 'isolated',
});
```

:::

**Type**

- `"immediate" | "deferred" | "isolated"`


### testConfig.shard {#test-config-shard}

<Badge type="info" text="Added in: v1.10" />

Shard tests and execute only the selected shard. Specify in the one-based form like `{ total: 5, current: 2 }`.

Learn more about [parallelism and sharding](../test-parallel.md) with Playwright Test.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  shard: { total: 10, current: 3 },
});
```

:::

**Type**

- `null | Object`


### testConfig.snapshotDir {#test-config-snapshot-dir}

<Badge type="info" text="Added in: v1.10" />

::: warning Discouraged
Use [`testConfig.snapshotPathTemplate`](/api/class-testconfig#test-config-snapshot-path-template) to configure snapshot paths.
:::

The base directory, relative to the config file, for snapshot files created with `toMatchSnapshot`. Defaults to [`testConfig.testDir`](/api/class-testconfig#test-config-test-dir).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  snapshotDir: './snapshots',
});
```

:::

**Details**

The directory for each test can be accessed by [`testInfo.snapshotDir`](/api/class-testinfo#test-info-snapshot-dir) and [`testInfo.snapshotPath()`](/api/class-testinfo#test-info-snapshot-path).

This path will serve as the base directory for each test file snapshot directory. Setting `snapshotDir` to `'snapshots'`, the [`testInfo.snapshotDir`](/api/class-testinfo#test-info-snapshot-dir) would resolve to `snapshots/a.spec.js-snapshots`.

**Type**

- `string`


### testConfig.snapshotPathTemplate {#test-config-snapshot-path-template}

<Badge type="info" text="Added in: v1.28" />

This option configures a template controlling location of snapshots generated by [`pageAssertions.toHaveScreenshot()`](/api/class-pageassertions#page-assertions-to-have-screenshot-1), [`locatorAssertions.toMatchAriaSnapshot()`](/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot-2) and [`snapshotAssertions.toMatchSnapshot()`](/api/class-snapshotassertions#snapshot-assertions-to-match-snapshot-1).

You can configure templates for each assertion separately in [`testConfig.expect`](/api/class-testconfig#test-config-expect).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Single template for all assertions
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',

  // Assertion-specific templates
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

**Details**

The value might include some "tokens" that will be replaced with actual values during test execution.

Consider the following file structure:

```txt
playwright.config.ts
tests/
└── page/
    └── page-click.spec.ts
```

And the following `page-click.spec.ts` that uses `toHaveScreenshot()` call:

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

The list of supported tokens:
* `{arg}` - Relative snapshot path **without extension**. This comes from the arguments passed to `toHaveScreenshot()`, `toMatchAriaSnapshot()` or `toMatchSnapshot()`; if called without arguments, this will be an auto-generated snapshot name.
  * Value: `foo/bar/baz`
* `{ext}` - Snapshot extension (with the leading dot).
  * Value: `.png`
* `{platform}` - The value of `process.platform`.
* `{projectName}` - Project's file-system-sanitized name, if any.
  * Value: `''` (empty string).
* `{snapshotDir}` - Project's [`testProject.snapshotDir`](/api/class-testproject#test-project-snapshot-dir).
  * Value: `/home/playwright/tests` (since `snapshotDir` is not provided in config, it defaults to `testDir`)
* `{testDir}` - Project's [`testProject.testDir`](/api/class-testproject#test-project-test-dir).
  * Value: `/home/playwright/tests` (absolute path since `testDir` is resolved relative to directory with config)
* `{testFileDir}` - Directories in relative path from `testDir` to **test file**.
  * Value: `page`
* `{testFileBaseName}` - Test file name without the last extension.
  * Value: `page-click.spec`
* `{testFileName}` - Test file name with extension.
  * Value: `page-click.spec.ts`
* `{testFilePath}` - Relative path from `testDir` to **test file**.
  * Value: `page/page-click.spec.ts`
* `{testName}` - File-system-sanitized test title, including parent describes but excluding file name.
  * Value: `suite-test-should-work`

Each token can be preceded with a single character that will be used **only if** this token has non-empty value.

Consider the following config:

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

In this config:
1. First project **does not** have a name, so its snapshots will be stored in `<configDir>/__screenshots__/example.spec.ts/...`.
1. Second project **does** have a name, so its snapshots will be stored in `<configDir>/__screenshots__/chromium/example.spec.ts/..`.
1. Since `snapshotPathTemplate` resolves to relative path, it will be resolved relative to `configDir`.
1. Forward slashes `"/"` can be used as path separators on any platform.

**Type**

- `string`


### testConfig.tag {#test-config-tag}

<Badge type="info" text="Added in: v1.57" />

Tag or tags prepended to each test in the report. Useful for tagging your test run to differentiate between [CI environments](../test-sharding.md#merging-reports-from-multiple-environments).

Note that each tag must start with `@` symbol. Learn more about [tagging](../test-annotations.md#tag-tests).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  tag: process.env.CI_ENVIRONMENT_NAME,  // for example "@APIv2"
});
```

:::

**Type**

- `string | Array<string>`


### testConfig.testDir {#test-config-test-dir}

<Badge type="info" text="Added in: v1.10" />

Directory that will be recursively scanned for test files. Defaults to the directory of the configuration file.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
});
```

:::

**Type**

- `string`


### testConfig.testIgnore {#test-config-test-ignore}

<Badge type="info" text="Added in: v1.10" />

Files matching one of these patterns are not executed as test files. Matching is performed against the absolute file path. Strings are treated as glob patterns.

For example, `'**/test-assets/**'` will ignore any files in the `test-assets` directory.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testIgnore: '**/test-assets/**',
});
```

:::

**Type**

- `string | RegExp | Array<string | RegExp>`


### testConfig.testMatch {#test-config-test-match}

<Badge type="info" text="Added in: v1.10" />

Only the files matching one of these patterns are executed as test files. Matching is performed against the absolute file path. Strings are treated as glob patterns.

By default, Playwright looks for files matching the following glob pattern: `**/*.@(spec|test).?(c|m)[jt]s?(x)`. This means JavaScript or TypeScript files with `".test"` or `".spec"` suffix, for example `login-screen.wrong-credentials.spec.ts`.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: /.*\.e2e\.js/,
});
```

:::

**Type**

- `string | RegExp | Array<string | RegExp>`


### testConfig.timeout {#test-config-timeout}

<Badge type="info" text="Added in: v1.10" />

Timeout for each test in milliseconds. Defaults to 30 seconds.

This is a base timeout for all tests. In addition, each test can configure its own timeout with [`test.setTimeout()`](/api/class-test#test-set-timeout). Learn more about [various timeouts](../test-timeouts.md).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 5 * 60 * 1000,
});
```

:::

**Type**

- `int`


### testConfig.tsconfig {#test-config-tsconfig}

<Badge type="info" text="Added in: v1.49" />

Path to a single `tsconfig` applicable to all imported files. By default, `tsconfig` for each imported file is looked up separately. Note that `tsconfig` property has no effect while the configuration file or any of its dependencies are loaded. Ignored when `--tsconfig` command line option is specified.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  tsconfig: './tsconfig.test.json',
});
```

:::

**Type**

- `string`


### testConfig.updateSnapshots {#test-config-update-snapshots}

<Badge type="info" text="Added in: v1.10" />

Whether to update expected snapshots with the actual results produced by the test run. Defaults to `'default'`.
* `'all'` - All tests that are executed will update snapshots.
* `'changed'` - All tests that are executed will update snapshots that did not match. Matching snapshots will not be updated. Also creates missing snapshots.
* `'missing'` - Missing snapshots are created, for example when authoring a new test and running it for the first time. Tests that only create missing snapshots pass.
* `'none'` - No snapshots are updated.
* `'default'` - Missing snapshots are created, but the tests that create them fail, so that the run does not silently pass in CI. This is the default.

Learn more about [snapshots](../test-snapshots.md).

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  updateSnapshots: 'default',
});
```

:::

**Type**

- `"all" | "changed" | "missing" | "none" | "default"`


### testConfig.updateSourceMethod {#test-config-update-source-method}

<Badge type="info" text="Added in: v1.50" />

Defines how to update snapshots in the source code.
* `'patch'` - Create a unified diff file that can be used to update the source code later. This is the default.
* `'3way'` - Generate merge conflict markers in source code. This allows user to manually pick relevant changes, as if they are resolving a merge conflict in the IDE.
* `'overwrite'` - Overwrite the source code with the new snapshot values.

**Type**

- `"overwrite" | "3way" | "patch"`


### testConfig.use {#test-config-use}

<Badge type="info" text="Added in: v1.10" />

Global options for all tests, for example [`testOptions.browserName`](/api/class-testoptions#test-options-browser-name). Learn more about [configuration](../test-configuration.md) and see [available options][TestOptions](/api/class-testoptions).

**Usage**

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

**Type**

- `TestOptions`


### testConfig.webServer {#test-config-web-server}

<Badge type="info" text="Added in: v1.10" />

Launch a development web server (or multiple) during the tests.

Top-level servers start before `globalSetup` and stop after `globalTeardown`, regardless of project
selection. To start servers only for particular projects, use [`testProject.webServer`](/api/class-testproject#test-project-web-server).

**Details**

If the port is specified, Playwright Test will wait for it to be available on `127.0.0.1` or `::1`, before running the tests. If the url is specified, Playwright Test will wait for the URL to return a 2xx, 3xx, 400, 401, 402, or 403 status code before running the tests.

For continuous integration, you may want to use the `reuseExistingServer: !process.env.CI` option which does not use an existing server on the CI. To see the stdout, you can set the `DEBUG=pw:webserver` environment variable.

The `port` (but not the `url`) gets passed over to Playwright as a [`testOptions.baseURL`](/api/class-testoptions#test-options-base-url). For example port `8080` produces `baseURL` equal `http://localhost:8080`. If `webServer` is specified as an array, you must explicitly configure the `baseURL` (even if it only has one entry).

::: info
It is also recommended to specify [`testOptions.baseURL`](/api/class-testoptions#test-options-base-url) in the config, so that tests could use relative urls.
:::

**Usage**

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

Now you can use a relative path when navigating the page:

::: code-group

```js [test.spec.ts]
import { test } from '@playwright/test';

test('test', async ({ page }) => {
  // This will result in http://localhost:3000/foo
  await page.goto('/foo');
});
```

:::

Multiple web servers (or background processes) can be launched:

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

If your webserver runs on varying ports, use `wait` to capture the port:

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

**Type**

- `Object | Array<Object>`


### testConfig.workers {#test-config-workers}

<Badge type="info" text="Added in: v1.10" />

The maximum number of concurrent worker processes to use for parallelizing tests. Can also be set as percentage of logical CPU cores, e.g. `'50%'.`

Playwright Test uses worker processes to run tests. There is always at least one worker process, but more can be used to speed up test execution.

Defaults to half of the number of logical CPU cores. Learn more about [parallelism and sharding](../test-parallel.md) with Playwright Test.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 3,
});
```

:::

**Type**

- `int | string`

