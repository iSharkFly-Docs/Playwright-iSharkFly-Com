---
title: TestResult
outline: 2
---

# TestResult

<Badge type="info" text="Added in: v1.10" />

A result of a single [TestCase](/api/class-testcase) run.

## Properties

### testResult.annotations {#test-result-annotations}

<Badge type="info" text="Added in: v1.52" />

The list of annotations applicable to the current test. Includes:
* annotations defined on the test or suite via [`test.(call)()`](/api/class-test#test-call) and [`test.describe()`](/api/class-test#test-describe);
* annotations implicitly added by methods [`test.skip()`](/api/class-test#test-skip), [`test.fixme()`](/api/class-test#test-fixme) and [`test.fail()`](/api/class-test#test-fail);
* annotations appended to [`testInfo.annotations`](/api/class-testinfo#test-info-annotations) during the test execution.

Annotations are available during test execution through [`testInfo.annotations`](/api/class-testinfo#test-info-annotations).

Learn more about [test annotations](../test-annotations.md).

**Type**

- `Array<Object>`


### testResult.attachments {#test-result-attachments}

<Badge type="info" text="Added in: v1.10" />

The list of files or buffers attached during the test execution through [`testInfo.attachments`](/api/class-testinfo#test-info-attachments).

**Type**

- `Array<Object>`


### testResult.duration {#test-result-duration}

<Badge type="info" text="Added in: v1.10" />

Running time in milliseconds.

**Type**

- `float`


### testResult.error {#test-result-error}

<Badge type="info" text="Added in: v1.10" />

First error thrown during test execution, if any. This is equal to the first
element in [`testResult.errors`](/api/class-testresult#test-result-errors).

**Type**

- `TestError`


### testResult.errors {#test-result-errors}

<Badge type="info" text="Added in: v1.10" />

Errors thrown during the test execution.

**Type**

- `Array<TestError>`


### testResult.parallelIndex {#test-result-parallel-index}

<Badge type="info" text="Added in: v1.30" />

The index of the worker between `0` and `workers - 1`. It is guaranteed that workers running at the same time have a different `parallelIndex`.

**Type**

- `int`


### testResult.retry {#test-result-retry}

<Badge type="info" text="Added in: v1.10" />

When test is retried multiple times, each retry attempt is given a sequential number.

Learn more about [test retries](../test-retries.md#retries).

**Type**

- `int`


### testResult.startTime {#test-result-start-time}

<Badge type="info" text="Added in: v1.10" />

Start time of this particular test run.

**Type**

- `Date`


### testResult.status {#test-result-status}

<Badge type="info" text="Added in: v1.10" />

The status of this test result. See also [`testCase.expectedStatus`](/api/class-testcase#test-case-expected-status).

**Type**

- `"passed" | "failed" | "timedOut" | "skipped" | "interrupted"`


### testResult.stderr {#test-result-stderr}

<Badge type="info" text="Added in: v1.10" />

Anything written to the standard error during the test run.

**Type**

- `Array<string | Buffer>`


### testResult.stdout {#test-result-stdout}

<Badge type="info" text="Added in: v1.10" />

Anything written to the standard output during the test run.

**Type**

- `Array<string | Buffer>`


### testResult.steps {#test-result-steps}

<Badge type="info" text="Added in: v1.10" />

List of steps inside this test run.

**Type**

- `Array<TestStep>`


### testResult.workerIndex {#test-result-worker-index}

<Badge type="info" text="Added in: v1.10" />

Index of the worker where the test was run. If the test was not run a single time, for example when the user interrupted testing, the only result will have a `workerIndex` equal to `-1`.

Learn more about [parallelism and sharding](../test-parallel.md) with Playwright Test.

**Type**

- `int`

