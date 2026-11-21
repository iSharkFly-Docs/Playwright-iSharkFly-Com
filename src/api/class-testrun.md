---
title: TestRun
outline: 2
---

# TestRun

<Badge type="info" text="Added in: v1.62" />

Controls which tests will run and their expected status, and provides information about suite execution modes. A [TestRun](/api/class-testrun) is available during [`reporter.preprocess()`](/api/class-reporter#reporter-preprocess). Setup and teardown projects cannot be changed.

## Methods

### testRun.exclude() {#test-run-exclude}

<Badge type="info" text="Added in: v1.62" />

Excludes a test or suite from the run. Excluded tests do not appear in the report and their bodies are not executed.

**Arguments**

- <a id="test-run-exclude-option-test"></a>`test` `TestCase | Suite`

  Test or suite to exclude. The root suite cannot be excluded.


### testRun.fail() {#test-run-fail}

<Badge type="info" text="Added in: v1.62" />

Marks a test or every test in a suite as "should fail". Playwright runs the tests and ensures they are actually failing, useful for documenting broken functionality until it is fixed.

**Arguments**

- <a id="test-run-fail-option-test"></a>`test` `TestCase | Suite`

  Test or suite to mark as expected-to-fail.
- <a id="test-run-fail-option-reason"></a>`reason` `string` *(optional)*

  Optional explanation surfaced as the annotation description.


### testRun.fixme() {#test-run-fixme}

<Badge type="info" text="Added in: v1.62" />

Marks a test or every test in a suite as fixme. The test bodies are not executed and the tests are reported as skipped, with the intention to fix them.

**Arguments**

- <a id="test-run-fixme-option-test"></a>`test` `TestCase | Suite`

  Test or suite to mark as fixme.
- <a id="test-run-fixme-option-reason"></a>`reason` `string` *(optional)*

  Optional explanation surfaced as the annotation description.


### testRun.mode() {#test-run-mode}

<Badge type="info" text="Added in: v1.65" />

Returns the execution mode configured for a suite with [`test.describe.configure()`](/api/class-test#test-describe-configure), [`test.describe.serial()`](/api/class-test#test-describe-serial) or [`test.describe.parallel()`](/api/class-test#test-describe-parallel).
If the suite does not configure a mode, it inherits its parent's mode. Project suites use `"parallel"` when [`testProject.fullyParallel`](/api/class-testproject#test-project-fully-parallel) is enabled, and `"default"` otherwise. The root suite uses `"default"`.

An explicit `"default"` suite does not inherit `"parallel"` from its parent: its tests run in order in the same worker. The mode alone does not describe complete test groups, which also depend on worker fixtures and hooks.

This method can only be called during [`reporter.preprocess()`](/api/class-reporter#reporter-preprocess), and can also inspect setup and teardown projects.

**Arguments**

- <a id="test-run-mode-option-suite"></a>`suite` `Suite`

  Suite to inspect.

**Returns**

- `"serial" | "parallel" | "default"`


### testRun.skip() {#test-run-skip}

<Badge type="info" text="Added in: v1.62" />

Skips a test or every test in a suite. The test bodies are not executed and the tests are reported as skipped.

**Arguments**

- <a id="test-run-skip-option-test"></a>`test` `TestCase | Suite`

  Test or suite to skip.
- <a id="test-run-skip-option-reason"></a>`reason` `string` *(optional)*

  Optional explanation surfaced as the annotation description.


### testRun.skipSharding() {#test-run-skip-sharding}

<Badge type="info" text="Added in: v1.62" />

Disables Playwright's built-in shard filter for this run, leaving sharding to the reporter. Reporters typically implement their own sharding by calling [`testRun.exclude()`](/api/class-testrun#test-run-exclude) on out-of-shard tests.

