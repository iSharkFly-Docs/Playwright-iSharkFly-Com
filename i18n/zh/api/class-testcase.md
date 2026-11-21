---
title: TestCase
outline: 2
---

# TestCase

<Badge type="info" text="Added in: v1.10" />

`TestCase` 对应于测试文件中的每个 [`test.(call)()`](/api/class-test#test-call) 调用。当单个 [`test.(call)()`](/api/class-test#test-call) 在多个项目中运行或重复多次时，它将在相应项目的套件中具有多个 `TestCase` 对象。

## 方法

### testCase.ok() {#test-case-ok}

<Badge type="info" text="Added in: v1.10" />

测试是否被认为运行良好。非 ok 的测试会使测试运行以非零退出码失败。

**返回值**

- `boolean`


### testCase.outcome() {#test-case-outcome}

<Badge type="info" text="Added in: v1.10" />

此测试的测试结果。注意 outcome 与 [`testResult.status`](/api/class-testresult#test-result-status) 不同：
* 预期失败且实际失败的测试是 `'expected'`。
* 在第二次重试时通过的测试是 `'flaky'`。

**返回值**

- `"skipped" | "expected" | "unexpected" | "flaky"`


### testCase.titlePath() {#test-case-title-path}

<Badge type="info" text="Added in: v1.10" />

返回从根到此测试的标题列表。

**返回值**

- `Array<string>`


## 属性

### testCase.annotations {#test-case-annotations}

<Badge type="info" text="Added in: v1.10" />

最后一次测试运行的 [`testResult.annotations`](/api/class-testresult#test-result-annotations)。

**类型**

- `Array<Object>`


### testCase.expectedStatus {#test-case-expected-status}

<Badge type="info" text="Added in: v1.10" />

预期的测试状态。
* 标记为 [`test.skip()`](/api/class-test#test-skip) 或 [`test.fixme()`](/api/class-test#test-fixme) 的测试预期为 `'skipped'`。
* 标记为 [`test.fail()`](/api/class-test#test-fail) 的测试预期为 `'failed'`。
* 其他测试预期为 `'passed'`。

另请参阅 [`testResult.status`](/api/class-testresult#test-result-status) 获取实际状态。

**类型**

- `"passed" | "failed" | "timedOut" | "skipped" | "interrupted"`


### testCase.id {#test-case-id}

<Badge type="info" text="Added in: v1.25" />

基于测试文件名、测试标题和项目名称计算的测试 ID。该 ID 在 Playwright 会话中是唯一的。

**类型**

- `string`


### testCase.location {#test-case-location}

<Badge type="info" text="Added in: v1.10" />

测试定义在源代码中的位置。

**类型**

- `Location`


### testCase.parent {#test-case-parent}

<Badge type="info" text="Added in: v1.10" />

此测试用例所属的套件。

**类型**

- `Suite`


### testCase.repeatEachIndex {#test-case-repeat-each-index}

<Badge type="info" text="Added in: v1.10" />

在 "repeat each" 模式下运行时包含重复索引。通过向[命令行](../test-cli.md)传递 `--repeat-each` 来启用此模式。

**类型**

- `int`


### testCase.results {#test-case-results}

<Badge type="info" text="Added in: v1.10" />

此测试每次运行的结果。

**类型**

- `Array<TestResult>`


### testCase.retries {#test-case-retries}

<Badge type="info" text="Added in: v1.10" />

配置中给予此测试的最大重试次数。使用条件重试时，每次失败尝试后都会更新为适用于该失败的重试次数。

了解更多关于[测试重试](../test-retries.md#retries)。

**类型**

- `int`


### testCase.tags {#test-case-tags}

<Badge type="info" text="Added in: v1.42" />

通过 [`test.(call)()`](/api/class-test#test-call) 或 [`test.describe()`](/api/class-test#test-describe) 在测试或套件上定义的标签列表，以及从测试和套件标题中提取的 `@` 标记。

了解更多关于[测试标签](../test-annotations.md#tag-tests)。

**类型**

- `Array<string>`


### testCase.timeout {#test-case-timeout}

<Badge type="info" text="Added in: v1.10" />

给予测试的超时时间。受 [`testConfig.timeout`](/api/class-testconfig#test-config-timeout)、[`testProject.timeout`](/api/class-testproject#test-project-timeout)、[`test.setTimeout()`](/api/class-test#test-set-timeout)、[`test.slow()`](/api/class-test#test-slow) 和 [`testInfo.setTimeout()`](/api/class-testinfo#test-info-set-timeout) 影响。

**类型**

- `float`


### testCase.title {#test-case-title}

<Badge type="info" text="Added in: v1.10" />

传递给 [`test.(call)()`](/api/class-test#test-call) 调用的测试标题。

**类型**

- `string`


### testCase.type {#test-case-type}

<Badge type="info" text="Added in: v1.44" />

返回 "test"。对于在 [`suite.entries()`](/api/class-suite#suite-entries) 中检测测试用例很有用。

**类型**

- `"test"`
