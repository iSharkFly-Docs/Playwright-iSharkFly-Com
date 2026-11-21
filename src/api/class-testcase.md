---
title: TestCase
outline: 2
---

# TestCase

<Badge type="info" text="Added in: v1.10" />

`TestCase` corresponds to every [`test.(call)()`](/api/class-test#test-call) call in a test file. When a single [`test.(call)()`](/api/class-test#test-call) is running in multiple projects or repeated multiple times, it will have multiple `TestCase` objects in corresponding projects' suites.

## Methods

### testCase.ok() {#test-case-ok}

<Badge type="info" text="Added in: v1.10" />

Whether the test is considered running fine. Non-ok tests fail the test run with non-zero exit code.

**Returns**

- `boolean`


### testCase.outcome() {#test-case-outcome}

<Badge type="info" text="Added in: v1.10" />

Testing outcome for this test. Note that outcome is not the same as [`testResult.status`](/api/class-testresult#test-result-status):
* Test that is expected to fail and actually fails is `'expected'`.
* Test that passes on a second retry is `'flaky'`.

**Returns**

- `"skipped" | "expected" | "unexpected" | "flaky"`


### testCase.titlePath() {#test-case-title-path}

<Badge type="info" text="Added in: v1.10" />

Returns a list of titles from the root down to this test.

**Returns**

- `Array<string>`


## Properties

### testCase.annotations {#test-case-annotations}

<Badge type="info" text="Added in: v1.10" />

[`testResult.annotations`](/api/class-testresult#test-result-annotations) of the last test run.

**Type**

- `Array<Object>`


### testCase.expectedStatus {#test-case-expected-status}

<Badge type="info" text="Added in: v1.10" />

Expected test status.
* Tests marked as [`test.skip()`](/api/class-test#test-skip) or [`test.fixme()`](/api/class-test#test-fixme) are expected to be `'skipped'`.
* Tests marked as [`test.fail()`](/api/class-test#test-fail) are expected to be `'failed'`.
* Other tests are expected to be `'passed'`.

See also [`testResult.status`](/api/class-testresult#test-result-status) for the actual status.

**Type**

- `"passed" | "failed" | "timedOut" | "skipped" | "interrupted"`


### testCase.id {#test-case-id}

<Badge type="info" text="Added in: v1.25" />

A test ID that is computed based on the test file name, test title and project name. The ID is unique within Playwright session.

**Type**

- `string`


### testCase.location {#test-case-location}

<Badge type="info" text="Added in: v1.10" />

Location in the source where the test is defined.

**Type**

- `Location`


### testCase.parent {#test-case-parent}

<Badge type="info" text="Added in: v1.10" />

Suite this test case belongs to.

**Type**

- `Suite`


### testCase.repeatEachIndex {#test-case-repeat-each-index}

<Badge type="info" text="Added in: v1.10" />

Contains the repeat index when running in "repeat each" mode. This mode is enabled by passing `--repeat-each` to the [command line](../test-cli.md).

**Type**

- `int`


### testCase.results {#test-case-results}

<Badge type="info" text="Added in: v1.10" />

Results for each run of this test.

**Type**

- `Array<TestResult>`


### testCase.retries {#test-case-retries}

<Badge type="info" text="Added in: v1.10" />

The maximum number of retries given to this test in the configuration. With conditional retries, this is updated after each failed attempt to the number of retries that applies to that failure.

Learn more about [test retries](../test-retries.md#retries).

**Type**

- `int`


### testCase.tags {#test-case-tags}

<Badge type="info" text="Added in: v1.42" />

The list of tags defined on the test or suite via [`test.(call)()`](/api/class-test#test-call) or [`test.describe()`](/api/class-test#test-describe), as well as `@`-tokens extracted from test and suite titles.

Learn more about [test tags](../test-annotations.md#tag-tests).

**Type**

- `Array<string>`


### testCase.timeout {#test-case-timeout}

<Badge type="info" text="Added in: v1.10" />

The timeout given to the test. Affected by [`testConfig.timeout`](/api/class-testconfig#test-config-timeout), [`testProject.timeout`](/api/class-testproject#test-project-timeout), [`test.setTimeout()`](/api/class-test#test-set-timeout), [`test.slow()`](/api/class-test#test-slow) and [`testInfo.setTimeout()`](/api/class-testinfo#test-info-set-timeout).

**Type**

- `float`


### testCase.title {#test-case-title}

<Badge type="info" text="Added in: v1.10" />

Test title as passed to the [`test.(call)()`](/api/class-test#test-call) call.

**Type**

- `string`


### testCase.type {#test-case-type}

<Badge type="info" text="Added in: v1.44" />

Returns "test". Useful for detecting test cases in [`suite.entries()`](/api/class-suite#suite-entries).

**Type**

- `"test"`

