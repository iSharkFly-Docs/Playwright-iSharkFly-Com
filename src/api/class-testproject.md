---
title: TestProject
outline: 2
---

# TestProject

<Badge type="info" text="Added in: v1.10" />

Playwright Test supports running multiple test projects at the same time. This is useful for running tests in multiple configurations. For example, consider running tests against multiple browsers. This type describes format of a project in the configuration file, to access resolved configuration parameters at run time use [FullProject](/api/class-fullproject).

`TestProject` encapsulates configuration specific to a single project. Projects are configured in [`testConfig.projects`](/api/class-testconfig#test-config-projects) specified in the [configuration file](../test-configuration.md). Note that all properties of [TestProject](/api/class-testproject) are available in the top-level [TestConfig](/api/class-testconfig), in which case they are shared between all projects. The exception is [`testProject.webServer`](/api/class-testproject#test-project-web-server): top-level servers are started separately, for the whole run.

Here is an example configuration that runs every test in Chromium, Firefox and WebKit, both Desktop and Mobile versions.

::: code-group

```js [playwright.config.ts]
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Options shared for all projects.
  timeout: 30000,
  use: {
    ignoreHTTPSErrors: true,
  },

  // Options specific to each project.
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

## Properties

### testProject.default {#test-project-default}

<Badge type="info" text="Added in: v1.64" />

Whether the project runs when no `--project` command line option is passed. Defaults to `true`.

To run a project with `default: false`, select it with the `--project` command line option.

A project with `default: false` still runs when another running project lists it in [`testProject.dependencies`](/api/class-testproject#test-project-dependencies) or [`testProject.teardown`](/api/class-testproject#test-project-teardown).

**Usage**

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

Now `npx playwright test` only runs `chromium`, while `npx playwright test --project=slow` runs `slow`.

**Type**

- `boolean`


### testProject.dependencies {#test-project-dependencies}

<Badge type="info" text="Added in: v1.31" />

List of projects that need to run before any test in this project runs. Dependencies can
be useful for configuring the global setup actions in a way that every action is
in a form of a test. Passing `--no-deps` argument ignores the dependencies and
behaves as if they were not specified.

Using dependencies allows global setup to produce traces and other artifacts,
see the setup steps in the test report, etc.

**Usage**

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

**Type**

- `Array<string>`


### testProject.expect {#test-project-expect}

<Badge type="info" text="Added in: v1.10" />

Configuration for the `expect` assertion library.

Use [`testConfig.expect`](/api/class-testconfig#test-config-expect) to change this option for all projects.

**Type**

- `Object`


### testProject.fullyParallel {#test-project-fully-parallel}

<Badge type="info" text="Added in: v1.10" />

Playwright Test runs tests in parallel. In order to achieve that, it runs several worker processes that run at the same time.
By default, **test files** are run in parallel. Tests in a single file are run in order, in the same worker process.

You can configure entire test project to concurrently run all tests in all files using this option.

**Type**

- `boolean`


### testProject.grep {#test-project-grep}

<Badge type="info" text="Added in: v1.10" />

Filter to only run tests with a title matching one of the patterns. For example, passing `grep: /cart/` should only run tests with "cart" in the title. Also available globally and in the [command line](../test-cli.md) with the `-g` option. The regular expression will be tested against the string that consists of the project name, the test file name, the `test.describe` name (if any), the test name and the test tags divided by spaces, e.g. `chromium my-test.spec.ts my-suite my-test`.

`grep` option is also useful for [tagging tests](../test-annotations.md#tag-tests).

**Type**

- `RegExp | Array<RegExp>`


### testProject.grepInvert {#test-project-grep-invert}

<Badge type="info" text="Added in: v1.10" />

Filter to only run tests with a title **not** matching any of the patterns. This is the opposite of [`testProject.grep`](/api/class-testproject#test-project-grep). Also available globally and in the [command line](../test-cli.md) with the `--grep-invert` option.

`grepInvert` option is also useful for [tagging tests](../test-annotations.md#tag-tests).

**Type**

- `RegExp | Array<RegExp>`


### testProject.ignoreSnapshots {#test-project-ignore-snapshots}

<Badge type="info" text="Added in: v1.44" />

Whether to skip snapshot expectations, such as `expect(value).toMatchSnapshot()` and `await expect(page).toHaveScreenshot()`.

**Usage**

The following example will only perform screenshot assertions on Chromium.

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

**Type**

- `boolean`


### testProject.metadata {#test-project-metadata}

<Badge type="info" text="Added in: v1.10" />

Metadata that will be put directly to the test report serialized as JSON.

**Type**

- `Metadata`


### testProject.name {#test-project-name}

<Badge type="info" text="Added in: v1.10" />

Project name is visible in the report and during test execution.

::: warning
Playwright executes the configuration file multiple times. Do not dynamically produce non-stable values in your configuration.
:::

**Type**

- `string`


### testProject.outputDir {#test-project-output-dir}

<Badge type="info" text="Added in: v1.10" />

The output directory for files created during test execution. Defaults to `<package.json-directory>/test-results`.

This directory is cleaned at the start. When running a test, a unique subdirectory inside the [`testProject.outputDir`](/api/class-testproject#test-project-output-dir) is created, guaranteeing that test running in parallel do not conflict. This directory can be accessed by [`testInfo.outputDir`](/api/class-testinfo#test-info-output-dir) and [`testInfo.outputPath()`](/api/class-testinfo#test-info-output-path).

Here is an example that uses [`testInfo.outputPath()`](/api/class-testinfo#test-info-output-path) to create a temporary file.

```js
import { test, expect } from '@playwright/test';
import fs from 'fs';

test('example test', async ({}, testInfo) => {
  const file = testInfo.outputPath('temporary-file.txt');
  await fs.promises.writeFile(file, 'Put some data to the file', 'utf8');
});
```

Use [`testConfig.outputDir`](/api/class-testconfig#test-config-output-dir) to change this option for all projects.

**Type**

- `string`


### testProject.repeatEach {#test-project-repeat-each}

<Badge type="info" text="Added in: v1.10" />

The number of times to repeat each test, useful for debugging flaky tests.

Use [`testConfig.repeatEach`](/api/class-testconfig#test-config-repeat-each) to change this option for all projects.

**Type**

- `int`


### testProject.respectGitIgnore {#test-project-respect-git-ignore}

<Badge type="info" text="Added in: v1.45" />

Whether to skip entries from `.gitignore` when searching for test files. By default, if neither [`testConfig.testDir`](/api/class-testconfig#test-config-test-dir) nor [`testProject.testDir`](/api/class-testproject#test-project-test-dir) are explicitly specified, Playwright will ignore any test files matching `.gitignore` entries. This option allows to override that behavior.

**Type**

- `boolean`


### testProject.retries {#test-project-retries}

<Badge type="info" text="Added in: v1.10" />

The maximum number of retry attempts given to failed tests. Learn more about [test retries](../test-retries.md#retries).

Set to a list to make the number of retries depend on the error, see [`testConfig.retries`](/api/class-testconfig#test-config-retries).

Use [`test.describe.configure()`](/api/class-test#test-describe-configure) to change the number of retries for a specific file or a group of tests.

Use [`testConfig.retries`](/api/class-testconfig#test-config-retries) to change this option for all projects.

**Type**

- `int | Array<Object>`


### testProject.snapshotDir {#test-project-snapshot-dir}

<Badge type="info" text="Added in: v1.10" />

The base directory, relative to the config file, for snapshot files created with `toMatchSnapshot`. Defaults to [`testProject.testDir`](/api/class-testproject#test-project-test-dir).

The directory for each test can be accessed by [`testInfo.snapshotDir`](/api/class-testinfo#test-info-snapshot-dir) and [`testInfo.snapshotPath()`](/api/class-testinfo#test-info-snapshot-path).

This path will serve as the base directory for each test file snapshot directory. Setting `snapshotDir` to `'snapshots'`, the [`testInfo.snapshotDir`](/api/class-testinfo#test-info-snapshot-dir) would resolve to `snapshots/a.spec.js-snapshots`.

**Type**

- `string`


### testProject.snapshotPathTemplate {#test-project-snapshot-path-template}

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


### testProject.teardown {#test-project-teardown}

<Badge type="info" text="Added in: v1.34" />

Name of a project that needs to run after this and all dependent projects have finished. Teardown is useful to cleanup any resources acquired by this project.

Passing `--no-deps` argument ignores [`testProject.teardown`](/api/class-testproject#test-project-teardown) and behaves as if it was not specified.

**Usage**

A common pattern is a "setup" dependency that has a corresponding "teardown":

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

**Type**

- `string`


### testProject.testDir {#test-project-test-dir}

<Badge type="info" text="Added in: v1.10" />

Directory that will be recursively scanned for test files. Defaults to the directory of the configuration file.

Each project can use a different directory. Here is an example that runs smoke tests in three browsers and all other tests in stable Chrome browser.

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

Use [`testConfig.testDir`](/api/class-testconfig#test-config-test-dir) to change this option for all projects.

**Type**

- `string`


### testProject.testIgnore {#test-project-test-ignore}

<Badge type="info" text="Added in: v1.10" />

Files matching one of these patterns are not executed as test files. Matching is performed against the absolute file path. Strings are treated as glob patterns.

For example, `'**/test-assets/**'` will ignore any files in the `test-assets` directory.

Use [`testConfig.testIgnore`](/api/class-testconfig#test-config-test-ignore) to change this option for all projects.

**Type**

- `string | RegExp | Array<string | RegExp>`


### testProject.testMatch {#test-project-test-match}

<Badge type="info" text="Added in: v1.10" />

Only the files matching one of these patterns are executed as test files. Matching is performed against the absolute file path. Strings are treated as glob patterns.

By default, Playwright looks for files matching the following glob pattern: `**/*.@(spec|test).?(c|m)[jt]s?(x)`. This means JavaScript or TypeScript files with `".test"` or `".spec"` suffix, for example `login-screen.wrong-credentials.spec.ts`.

Use [`testConfig.testMatch`](/api/class-testconfig#test-config-test-match) to change this option for all projects.

**Type**

- `string | RegExp | Array<string | RegExp>`


### testProject.timeout {#test-project-timeout}

<Badge type="info" text="Added in: v1.10" />

Timeout for each test in milliseconds. Defaults to 30 seconds.

This is a base timeout for all tests. Each test can configure its own timeout with [`test.setTimeout()`](/api/class-test#test-set-timeout). Each file or a group of tests can configure the timeout with [`test.describe.configure()`](/api/class-test#test-describe-configure).

Use [`testConfig.timeout`](/api/class-testconfig#test-config-timeout) to change this option for all projects.

**Type**

- `int`


### testProject.use {#test-project-use}

<Badge type="info" text="Added in: v1.10" />

Options for all tests in this project, for example [`testOptions.browserName`](/api/class-testoptions#test-options-browser-name). Learn more about [configuration](../test-configuration.md) and see [available options][TestOptions](/api/class-testoptions).

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

Use [`testConfig.use`](/api/class-testconfig#test-config-use) to change this option for all projects.

**Type**

- `TestOptions`


### testProject.webServer {#test-project-web-server}

<Badge type="info" text="Added in: v1.66" />

Launch a development web server (or multiple) for this project. Accepts the same options as
[`testConfig.webServer`](/api/class-testconfig#test-config-web-server).

Project servers are added to the top-level servers, not inherited from them or used to replace them.
They start after `globalSetup` and stop before its returned teardown function and `globalTeardown`.
In the command line, project selection controls which servers start, including servers for
dependencies and teardown projects. Test filters and sharding do not affect server startup.
Listing tests does not start project servers. In UI mode and VS Code, all project servers start
with global setup and stay alive across test runs until global teardown or configuration reload.

[`fullProject.webServer`](/api/class-fullproject#full-project-web-server) exposes these settings as an array, including in `globalSetup`.
Project servers are not available during `globalSetup` or `globalTeardown`.

For a single server with `port` and no `url`, the project's [`testOptions.baseURL`](/api/class-testoptions#test-options-base-url) defaults
to `http://localhost:<port>`. An explicitly configured `baseURL` takes precedence. For arrays or
servers with `url`, configure `baseURL` explicitly.

**Usage**

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

Running `npx playwright test --project=production` does not start the local server.

**Type**

- `Object | Array<Object>`


### testProject.workers {#test-project-workers}

<Badge type="info" text="Added in: v1.52" />

The maximum number of concurrent worker processes to use for parallelizing tests from this project. Can also be set as percentage of logical CPU cores, e.g. `'50%'.`

This could be useful, for example, when all tests from a project share a single resource like a test account, and therefore cannot be executed in parallel. Limiting workers to one for such a project will prevent simultaneous use of the shared resource.

Note that the global [`testConfig.workers`](/api/class-testconfig#test-config-workers) limit applies to the total number of worker processes. However, Playwright will limit the number of workers used for this project by the value of [`testProject.workers`](/api/class-testproject#test-project-workers).

By default, there is no limit per project. See [`testConfig.workers`](/api/class-testconfig#test-config-workers) for the default of the total worker limit.

**Usage**

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 10,  // total workers limit

  projects: [
    {
      name: 'runs in parallel',
    },
    {
      name: 'one at a time',
      workers: 1,  // workers limit for this project
    },
  ],
});
```

:::

**Type**

- `int | string`

