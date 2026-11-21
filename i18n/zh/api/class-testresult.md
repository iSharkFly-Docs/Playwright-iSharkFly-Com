---
title: TestResult
outline: 2
---

# TestResult

<Badge type="info" text="Added in: v1.10" />

单个 [TestCase](/api/class-testcase) 运行的结果。

## 属性

### testResult.annotations {#test-result-annotations}

<Badge type="info" text="Added in: v1.52" />

适用于当前测试的注解列表。包括：
* 通过 [`test.(call)()`](/api/class-test#test-call) 和 [`test.describe()`](/api/class-test#test-describe) 在测试或套件上定义的注解；
* 通过 [`test.skip()`](/api/class-test#test-skip)、[`test.fixme()`](/api/class-test#test-fixme) 和 [`test.fail()`](/api/class-test#test-fail) 方法隐式添加的注解；
* 在测试执行期间附加到 [`testInfo.annotations`](/api/class-testinfo#test-info-annotations) 的注解。

在测试执行期间，可以通过 [`testInfo.annotations`](/api/class-testinfo#test-info-annotations) 获取注解。

了解更多关于[测试注解](../test-annotations.md)。

**类型**

- `Array<Object>`


### testResult.attachments {#test-result-attachments}

<Badge type="info" text="Added in: v1.10" />

测试执行期间通过 [`testInfo.attachments`](/api/class-testinfo#test-info-attachments) 附加的文件或缓冲区列表。

**类型**

- `Array<Object>`


### testResult.duration {#test-result-duration}

<Badge type="info" text="Added in: v1.10" />

运行时间，以毫秒为单位。

**类型**

- `float`


### testResult.error {#test-result-error}

<Badge type="info" text="Added in: v1.10" />

测试执行期间抛出的第一个错误（如果有）。这等于 [`testResult.errors`](/api/class-testresult#test-result-errors) 中的第一个元素。

**类型**

- `TestError`


### testResult.errors {#test-result-errors}

<Badge type="info" text="Added in: v1.10" />

测试执行期间抛出的错误。

**类型**

- `Array<TestError>`


### testResult.parallelIndex {#test-result-parallel-index}

<Badge type="info" text="Added in: v1.30" />

worker 的索引，在 `0` 和 `workers - 1` 之间。保证同时运行的 worker 具有不同的 `parallelIndex`。

**类型**

- `int`


### testResult.retry {#test-result-retry}

<Badge type="info" text="Added in: v1.10" />

当测试被多次重试时，每次重试尝试都会被分配一个序号。

了解更多关于[测试重试](../test-retries.md#retries)。

**类型**

- `int`


### testResult.startTime {#test-result-start-time}

<Badge type="info" text="Added in: v1.10" />

此特定测试运行的开始时间。

**类型**

- `Date`


### testResult.status {#test-result-status}

<Badge type="info" text="Added in: v1.10" />

此测试结果的状态。另请参阅 [`testCase.expectedStatus`](/api/class-testcase#test-case-expected-status)。

**类型**

- `"passed" | "failed" | "timedOut" | "skipped" | "interrupted"`


### testResult.stderr {#test-result-stderr}

<Badge type="info" text="Added in: v1.10" />

测试运行期间写入标准错误的任何内容。

**类型**

- `Array<string | Buffer>`


### testResult.stdout {#test-result-stdout}

<Badge type="info" text="Added in: v1.10" />

测试运行期间写入标准输出的任何内容。

**类型**

- `Array<string | Buffer>`


### testResult.steps {#test-result-steps}

<Badge type="info" text="Added in: v1.10" />

此测试运行内的步骤列表。

**类型**

- `Array<TestStep>`


### testResult.workerIndex {#test-result-worker-index}

<Badge type="info" text="Added in: v1.10" />

运行测试的 worker 的索引。如果测试没有运行过一次，例如用户中断了测试，唯一的结果将具有等于 `-1` 的 `workerIndex`。

了解更多关于 Playwright Test 的[并行和分片](../test-parallel.md)。

**类型**

- `int`
