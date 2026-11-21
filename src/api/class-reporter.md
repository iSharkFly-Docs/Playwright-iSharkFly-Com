---
title: Reporter
outline: 2
---

# Reporter

<Badge type="info" text="Added in: v1.10" />

Test runner notifies the reporter about various events during test execution. All methods of the reporter are optional.

You can create a custom reporter by implementing a class with some of the reporter methods. Make sure to export this class as default.

::: code-group

```js [JavaScript]
// @ts-check

/** @implements {import('@playwright/test/reporter').Reporter} */
class MyReporter {
  constructor(options) {
    console.log(`my-awesome-reporter setup with customOption set to ${options.customOption}`);
  }

  onBegin(config, suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test) {
    console.log(`Starting test ${test.title}`);
  }

  onTestEnd(test, result) {
    console.log(`Finished test ${test.title}: ${result.status}`);
  }

  onEnd(result) {
    console.log(`Finished the run: ${result.status}`);
  }
}

module.exports = MyReporter;
```

```js [TypeScript]
import type {
  Reporter, FullConfig, Suite, TestCase, TestResult, FullResult
} from '@playwright/test/reporter';

class MyReporter implements Reporter {
  constructor(options: { customOption?: string } = {}) {
    console.log(`my-awesome-reporter setup with customOption set to ${options.customOption}`);
  }

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase) {
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

Now use this reporter with [`testConfig.reporter`](/api/class-testconfig#test-config-reporter). Learn more about [using reporters](../test-reporters.md).

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['./my-awesome-reporter.ts', { customOption: 'some value' }]],
});
```

:::

Here is a typical order of reporter calls:
* [`reporter.onBegin()`](/api/class-reporter#reporter-on-begin) is called once with a root suite that contains all other suites and tests. Learn more about [suites hierarchy][Suite](/api/class-suite).
* [`reporter.onTestBegin()`](/api/class-reporter#reporter-on-test-begin) is called for each test run. It is given a [TestCase](/api/class-testcase) that is executed, and a [TestResult](/api/class-testresult) that is almost empty. Test result will be populated while the test runs (for example, with steps and stdio) and will get final `status` once the test finishes.
* [`reporter.onStepBegin()`](/api/class-reporter#reporter-on-step-begin) and [`reporter.onStepEnd()`](/api/class-reporter#reporter-on-step-end) are called for each executed step inside the test. When steps are executed, test run has not finished yet.
* [`reporter.onTestEnd()`](/api/class-reporter#reporter-on-test-end) is called when test run has finished. By this time, [TestResult](/api/class-testresult) is complete and you can use [`testResult.status`](/api/class-testresult#test-result-status), [`testResult.error`](/api/class-testresult#test-result-error) and more.
* [`reporter.onEnd()`](/api/class-reporter#reporter-on-end) is called once after all tests that should run had finished.
* [`reporter.onExit()`](/api/class-reporter#reporter-on-exit) is called immediately before the test runner exits.

Additionally, [`reporter.onStdOut()`](/api/class-reporter#reporter-on-std-out) and [`reporter.onStdErr()`](/api/class-reporter#reporter-on-std-err) are called when standard output is produced in the worker process, possibly during a test execution,
and [`reporter.onError()`](/api/class-reporter#reporter-on-error) is called when something went wrong outside of the test execution.

If your custom reporter does not print anything to the terminal, implement [`reporter.printsToStdio()`](/api/class-reporter#reporter-prints-to-stdio) and return `false`. This way, Playwright will use one of the standard terminal reporters in addition to your custom reporter to enhance user experience.

**Reporter errors**

Playwright will swallow any errors thrown in your custom reporter methods. If you need to detect or fail on reporter
errors, you must wrap and handle them yourself.

**Merged report API notes**

When merging multiple [`blob`](../test-reporters#blob-reporter) reports via [`merge-reports`](../test-sharding#merge-reports-cli) CLI
command, the same [Reporter](/api/class-reporter) API is called to produce final reports and all existing reporters
should work without any changes. There some subtle differences though which might affect some custom
reporters.
* Projects from different shards are always kept as separate [TestProject](/api/class-testproject) objects. E.g. if project 'Desktop Chrome' was sharded across 5 machines then there will be 5 instances of projects with the same name in the config passed to [`reporter.onBegin()`](/api/class-reporter#reporter-on-begin).

## Methods

### reporter.onBegin() {#reporter-on-begin}

<Badge type="info" text="Added in: v1.10" />

Called once before running tests. All tests have been already discovered and put into a hierarchy of [Suite](/api/class-suite)s.

**Arguments**

- <a id="reporter-on-begin-option-config"></a>`config` `FullConfig`

  Resolved configuration.
- <a id="reporter-on-begin-option-suite"></a>`suite` `Suite`

  The root suite that contains all projects, files and test cases.


### reporter.onEnd() {#reporter-on-end}

<Badge type="info" text="Added in: v1.10" /> <Badge type="tip" text="async" />

Called after all tests have been run, or testing has been interrupted. Note that this method may return a [Promise] and Playwright Test will await it.
Reporter is allowed to override the status and hence affect the exit code of the test runner.

**Arguments**

- <a id="reporter-on-end-option-result"></a>`result` `Object`

  Result of the full test run, `status` can be one of:
  * `'passed'` - Everything went as expected.
  * `'failed'` - Any test has failed.
  * `'timedout'` - The [`testConfig.globalTimeout`](/api/class-testconfig#test-config-global-timeout) has been reached.
  * `'interrupted'` - Interrupted by the user.

  - `status` `"passed" | "failed" | "timedout" | "interrupted"`

    Test run status.
  - `startTime` `Date`

    Test run start wall time.
  - `duration` `int`

    Test run duration in milliseconds.

**Returns**

- `Promise<Object>`


### reporter.onError() {#reporter-on-error}

<Badge type="info" text="Added in: v1.10" />

Called on some global error, for example unhandled exception in the worker process.

**Arguments**

- <a id="reporter-on-error-option-error"></a>`error` `TestError`

  The error.
- <a id="reporter-on-error-option-worker-info"></a>`workerInfo` `WorkerInfo` *(optional)* <Badge type="info" text="Added in: v1.60" />

  Contains information about the worker that produced this error. `undefined` for errors that are not associated with a specific worker.


### reporter.onExit() {#reporter-on-exit}

<Badge type="info" text="Added in: v1.33" /> <Badge type="tip" text="async" />

Called immediately before test runner exists. At this point all the reporters
have received the [`reporter.onEnd()`](/api/class-reporter#reporter-on-end) signal, so all the reports should
be build. You can run the code that uploads the reports in this hook.


### reporter.onStdErr() {#reporter-on-std-err}

<Badge type="info" text="Added in: v1.10" />

Called when something has been written to the standard error in the worker process.

**Arguments**

- <a id="reporter-on-std-err-option-chunk"></a>`chunk` `string | Buffer`

  Output chunk.
- <a id="reporter-on-std-err-option-test"></a>`test` `void | TestCase`

  Test that was running. Note that output may happen when no test is running, in which case this will be [void].
- <a id="reporter-on-std-err-option-result"></a>`result` `void | TestResult`

  Result of the test run, this object gets populated while the test runs.


### reporter.onStdOut() {#reporter-on-std-out}

<Badge type="info" text="Added in: v1.10" />

Called when something has been written to the standard output in the worker process.

**Arguments**

- <a id="reporter-on-std-out-option-chunk"></a>`chunk` `string | Buffer`

  Output chunk.
- <a id="reporter-on-std-out-option-test"></a>`test` `void | TestCase`

  Test that was running. Note that output may happen when no test is running, in which case this will be [void].
- <a id="reporter-on-std-out-option-result"></a>`result` `void | TestResult`

  Result of the test run, this object gets populated while the test runs.


### reporter.onStepBegin() {#reporter-on-step-begin}

<Badge type="info" text="Added in: v1.10" />

Called when a test step started in the worker process.

**Arguments**

- <a id="reporter-on-step-begin-option-test"></a>`test` `TestCase`

  Test that the step belongs to.
- <a id="reporter-on-step-begin-option-result"></a>`result` `TestResult`

  Result of the test run, this object gets populated while the test runs.
- <a id="reporter-on-step-begin-option-step"></a>`step` `TestStep`

  Test step instance that has started.


### reporter.onStepEnd() {#reporter-on-step-end}

<Badge type="info" text="Added in: v1.10" />

Called when a test step finished in the worker process.

**Arguments**

- <a id="reporter-on-step-end-option-test"></a>`test` `TestCase`

  Test that the step belongs to.
- <a id="reporter-on-step-end-option-result"></a>`result` `TestResult`

  Result of the test run.
- <a id="reporter-on-step-end-option-step"></a>`step` `TestStep`

  Test step instance that has finished.


### reporter.onTestBegin() {#reporter-on-test-begin}

<Badge type="info" text="Added in: v1.10" />

Called after a test has been started in the worker process.

**Arguments**

- <a id="reporter-on-test-begin-option-test"></a>`test` `TestCase`

  Test that has been started.
- <a id="reporter-on-test-begin-option-result"></a>`result` `TestResult`

  Result of the test run, this object gets populated while the test runs.


### reporter.onTestEnd() {#reporter-on-test-end}

<Badge type="info" text="Added in: v1.10" />

Called after a test has been finished in the worker process.

**Arguments**

- <a id="reporter-on-test-end-option-test"></a>`test` `TestCase`

  Test that has been finished.
- <a id="reporter-on-test-end-option-result"></a>`result` `TestResult`

  Result of the test run.


### reporter.preprocess() {#reporter-preprocess}

<Badge type="info" text="Added in: v1.62" /> <Badge type="tip" text="async" />

Called after the configuration has been resolved and before [`reporter.onBegin()`](/api/class-reporter#reporter-on-begin). Allows a reporter to mark individual tests as skipped, excluded, fixed or failing.

**Arguments**

- <a id="reporter-preprocess-option-params"></a>`params` `Object`

  The suite reflects `--project`, `--grep`/`--grep-invert` and `.only` filtering, so it only contains tests that match the current invocation. Setup and dependency projects are readonly and cannot be changed through [TestRun](/api/class-testrun).

  The suite ignores the `--shard` argument: it always contains the full, un-sharded corpus. Playwright applies its built-in sharding after [`reporter.preprocess()`](/api/class-reporter#reporter-preprocess) returns, unless the reporter calls [`testRun.skipSharding()`](/api/class-testrun#test-run-skip-sharding).

  - `config` `FullConfig`

    Resolved configuration.
  - `suite` `Suite`

    The root suite that contains the projects, files and test cases that will run.
  - `testRun` `TestRun`

    Control which tests will run and their expected status.


### reporter.printsToStdio() {#reporter-prints-to-stdio}

<Badge type="info" text="Added in: v1.10" />

Whether this reporter uses stdio for reporting. When it does not, Playwright Test could add some output to enhance user experience. If your reporter does not print to the terminal, it is strongly recommended to return `false`.

**Returns**

- `boolean`

