---
title: Reporter
outline: 2
---

# Reporter

<Badge type="info" text="Added in: v1.10" />

测试运行器会在测试执行期间通过各种事件通知报告器。报告器的所有方法都是可选的。

你可以通过实现一个包含部分报告器方法的类来创建自定义报告器。确保将这个类作为默认导出。

::: code-group

```js [JavaScript]
// @ts-check

/** @implements {import('@playwright/test/reporter').Reporter} */
class MyReporter {
  constructor(options) {
    console.log(`my-awesome-reporter 初始化，customOption 设置为 ${options.customOption}`);
  }

  onBegin(config, suite) {
    console.log(`开始运行，共有 ${suite.allTests().length} 个测试`);
  }

  onTestBegin(test) {
    console.log(`开始测试 ${test.title}`);
  }

  onTestEnd(test, result) {
    console.log(`完成测试 ${test.title}: ${result.status}`);
  }

  onEnd(result) {
    console.log(`运行完成: ${result.status}`);
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
    console.log(`my-awesome-reporter 初始化，customOption 设置为 ${options.customOption}`);
  }

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`开始运行，共有 ${suite.allTests().length} 个测试`);
  }

  onTestBegin(test: TestCase) {
    console.log(`开始测试 ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`完成测试 ${test.title}: ${result.status}`);
  }

  onEnd(result: FullResult) {
    console.log(`运行完成: ${result.status}`);
  }
}
export default MyReporter;
```

:::

现在可以通过 [`testConfig.reporter`](/api/class-testconfig#test-config-reporter) 使用这个报告器。了解更多关于[使用报告器](../test-reporters.md)的信息。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['./my-awesome-reporter.ts', { customOption: 'some value' }]],
});
```

:::

以下是报告器调用的典型顺序：
* [`reporter.onBegin()`](/api/class-reporter#reporter-on-begin) 在运行测试之前调用一次，传入包含所有其他测试套件和测试的根套件。了解更多关于[套件层次结构][Suite](/api/class-suite)的信息。
* [`reporter.onTestBegin()`](/api/class-reporter#reporter-on-test-begin) 为每个测试运行调用。它接收正在执行的 [TestCase](/api/class-testcase) 和几乎为空的 [TestResult](/api/class-testresult)。测试结果会在测试运行过程中被填充（例如，步骤和标准输入输出），并在测试完成后获得最终的 `status`。
* [`reporter.onStepBegin()`](/api/class-reporter#reporter-on-step-begin) 和 [`reporter.onStepEnd()`](/api/class-reporter#reporter-on-step-end) 在测试内部为每个执行的步骤调用。当步骤执行时，测试运行尚未完成。
* [`reporter.onTestEnd()`](/api/class-reporter#reporter-on-test-end) 在测试运行完成时调用。此时，[TestResult](/api/class-testresult) 已完成，你可以使用 [`testResult.status`](/api/class-testresult#test-result-status)、[`testResult.error`](/api/class-testresult#test-result-error) 等属性。
* [`reporter.onEnd()`](/api/class-reporter#reporter-on-end) 在所有应该运行的测试完成后调用一次。
* [`reporter.onExit()`](/api/class-reporter#reporter-on-exit) 在测试运行器退出之前立即调用。

此外，[`reporter.onStdOut()`](/api/class-reporter#reporter-on-std-out) 和 [`reporter.onStdErr()`](/api/class-reporter#reporter-on-std-err) 在工作进程中产生标准输出时调用，可能在测试执行期间，
而 [`reporter.onError()`](/api/class-reporter#reporter-on-error) 在测试执行之外发生错误时调用。

如果你的自定义报告器不向终端打印任何内容，请实现 [`reporter.printsToStdio()`](/api/class-reporter#reporter-prints-to-stdio) 并返回 `false`。这样，Playwright 将除了使用你的自定义报告器外，还会使用标准终端报告器之一来增强用户体验。

**报告器错误**

Playwright 会吞掉自定义报告器方法中抛出的任何错误。如果你需要检测或在报告器错误时失败，必须自己包装和处理它们。

**合并报告 API 说明**

当通过 [`merge-reports`](../test-sharding#merge-reports-cli) CLI 命令合并多个 [`blob`](../test-reporters#blob-reporter) 报告时，会调用相同的 [Reporter](/api/class-reporter) API 来生成最终报告，所有现有的报告器应该无需任何更改即可工作。但有一些细微的差异可能会影响某些自定义报告器。
* 来自不同分片的项目始终保持为独立的 [TestProject](/api/class-testproject) 对象。例如，如果项目 'Desktop Chrome' 被分片到 5 台机器上，那么传递给 [`reporter.onBegin()`](/api/class-reporter#reporter-on-begin) 的配置中将有 5 个同名项目的实例。

## 方法

### reporter.onBegin() {#reporter-on-begin}

<Badge type="info" text="Added in: v1.10" />

在运行测试之前调用一次。所有测试都已被发现并放入 [Suite](/api/class-suite) 层次结构中。

**参数**

- <a id="reporter-on-begin-option-config"></a>`config` `FullConfig`

  已解析的配置。
- <a id="reporter-on-begin-option-suite"></a>`suite` `Suite`

  包含所有项目、文件和测试用例的根套件。


### reporter.onEnd() {#reporter-on-end}

<Badge type="info" text="Added in: v1.10" /> <Badge type="tip" text="async" />

在所有测试运行完成或测试被中断后调用。注意此方法可能返回一个 [Promise]，Playwright Test 会等待它完成。
报告器可以覆盖状态，从而影响测试运行器的退出代码。

**参数**

- <a id="reporter-on-end-option-result"></a>`result` `Object`

  完整测试运行的结果，`status` 可以是以下之一：
  * `'passed'` - 一切按预期进行。
  * `'failed'` - 有测试失败。
  * `'timedout'` - 达到了 [`testConfig.globalTimeout`](/api/class-testconfig#test-config-global-timeout)。
  * `'interrupted'` - 被用户中断。

  - `status` `"passed" | "failed" | "timedout" | "interrupted"`

    测试运行状态。
  - `startTime` `Date`

    测试运行开始的墙钟时间。
  - `duration` `int`

    测试运行持续时间（毫秒）。

**返回值**

- `Promise<Object>`


### reporter.onError() {#reporter-on-error}

<Badge type="info" text="Added in: v1.10" />

在发生某些全局错误时调用，例如工作进程中的未处理异常。

**参数**

- <a id="reporter-on-error-option-error"></a>`error` `TestError`

  错误对象。
- <a id="reporter-on-error-option-worker-info"></a>`workerInfo` `WorkerInfo` *(可选)* <Badge type="info" text="Added in: v1.60" />

  包含产生此错误的工作进程的信息。对于与特定工作进程无关的错误为 `undefined`。


### reporter.onExit() {#reporter-on-exit}

<Badge type="info" text="Added in: v1.33" /> <Badge type="tip" text="async" />

在测试运行器退出之前立即调用。此时所有报告器都已收到 [`reporter.onEnd()`](/api/class-reporter#reporter-on-end) 信号，因此所有报告都应该已构建完成。你可以在这个钩子中运行上传报告的代码。


### reporter.onStdErr() {#reporter-on-std-err}

<Badge type="info" text="Added in: v1.10" />

当工作进程的标准错误输出有内容写入时调用。

**参数**

- <a id="reporter-on-std-err-option-chunk"></a>`chunk` `string | Buffer`

  输出块。
- <a id="reporter-on-std-err-option-test"></a>`test` `void | TestCase`

  正在运行的测试。注意输出可能在没有测试运行时发生，在这种情况下这将是 [void]。
- <a id="reporter-on-std-err-option-result"></a>`result` `void | TestResult`

  测试运行的结果，此对象在测试运行过程中被填充。


### reporter.onStdOut() {#reporter-on-std-out}

<Badge type="info" text="Added in: v1.10" />

当工作进程的标准输出有内容写入时调用。

**参数**

- <a id="reporter-on-std-out-option-chunk"></a>`chunk` `string | Buffer`

  输出块。
- <a id="reporter-on-std-out-option-test"></a>`test` `void | TestCase`

  正在运行的测试。注意输出可能在没有测试运行时发生，在这种情况下这将是 [void]。
- <a id="reporter-on-std-out-option-result"></a>`result` `void | TestResult`

  测试运行的结果，此对象在测试运行过程中被填充。


### reporter.onStepBegin() {#reporter-on-step-begin}

<Badge type="info" text="Added in: v1.10" />

当工作进程中的测试步骤开始时调用。

**参数**

- <a id="reporter-on-step-begin-option-test"></a>`test` `TestCase`

  该步骤所属的测试。
- <a id="reporter-on-step-begin-option-result"></a>`result` `TestResult`

  测试运行的结果，此对象在测试运行过程中被填充。
- <a id="reporter-on-step-begin-option-step"></a>`step` `TestStep`

  已开始的测试步骤实例。


### reporter.onStepEnd() {#reporter-on-step-end}

<Badge type="info" text="Added in: v1.10" />

当工作进程中的测试步骤完成时调用。

**参数**

- <a id="reporter-on-step-end-option-test"></a>`test` `TestCase`

  该步骤所属的测试。
- <a id="reporter-on-step-end-option-result"></a>`result` `TestResult`

  测试运行的结果。
- <a id="reporter-on-step-end-option-step"></a>`step` `TestStep`

  已完成的测试步骤实例。


### reporter.onTestBegin() {#reporter-on-test-begin}

<Badge type="info" text="Added in: v1.10" />

在工作进程中测试开始后调用。

**参数**

- <a id="reporter-on-test-begin-option-test"></a>`test` `TestCase`

  已开始的测试。
- <a id="reporter-on-test-begin-option-result"></a>`result` `TestResult`

  测试运行的结果，此对象在测试运行过程中被填充。


### reporter.onTestEnd() {#reporter-on-test-end}

<Badge type="info" text="Added in: v1.10" />

在工作进程中测试完成后调用。

**参数**

- <a id="reporter-on-test-end-option-test"></a>`test` `TestCase`

  已完成的测试。
- <a id="reporter-on-test-end-option-result"></a>`result` `TestResult`

  测试运行的结果。


### reporter.preprocess() {#reporter-preprocess}

<Badge type="info" text="Added in: v1.62" /> <Badge type="tip" text="async" />

在配置解析后、[`reporter.onBegin()`](/api/class-reporter#reporter-on-begin) 之前调用。允许报告器将单个测试标记为跳过、排除、修复或失败。

**参数**

- <a id="reporter-preprocess-option-params"></a>`params` `Object`

  套件反映了 `--project`、`--grep`/`--grep-invert` 和 `.only` 过滤，因此它只包含与当前调用匹配的测试。设置和依赖项目是只读的，不能通过 [TestRun](/api/class-testrun) 更改。

  套件忽略 `--shard` 参数：它始终包含完整的、未分片的语料库。Playwright 在 [`reporter.preprocess()`](/api/class-reporter#reporter-preprocess) 返回后应用其内置分片，除非报告器调用 [`testRun.skipSharding()`](/api/class-testrun#test-run-skip-sharding)。

  - `config` `FullConfig`

    已解析的配置。
  - `suite` `Suite`

    包含将要运行的项目、文件和测试用例的根套件。
  - `testRun` `TestRun`

    控制哪些测试将运行以及它们的预期状态。


### reporter.printsToStdio() {#reporter-prints-to-stdio}

<Badge type="info" text="Added in: v1.10" />

此报告器是否使用标准输入输出进行报告。当不使用时，Playwright Test 可能会添加一些输出来增强用户体验。如果你的报告器不向终端打印内容，强烈建议返回 `false`。

**返回值**

- `boolean`
