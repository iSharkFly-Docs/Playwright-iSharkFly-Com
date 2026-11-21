---
title: TestRun
outline: 2
---

# TestRun

<Badge type="info" text="Added in: v1.62" />

控制哪些测试将运行及其预期状态，并提供有关套件执行模式的信息。[TestRun](/api/class-testrun) 在 [`reporter.preprocess()`](/api/class-reporter#reporter-preprocess) 期间可用。设置和清理项目无法更改。

## 方法

### testRun.exclude() {#test-run-exclude}

<Badge type="info" text="Added in: v1.62" />

从运行中排除测试或套件。排除的测试不会出现在报告中，其主体也不会执行。

**参数**

- <a id="test-run-exclude-option-test"></a>`test` `TestCase | Suite`

  要排除的测试或套件。根套件不能被排除。


### testRun.fail() {#test-run-fail}

<Badge type="info" text="Added in: v1.62" />

将测试或套件中的每个测试标记为"应该失败"。Playwright 运行这些测试并确保它们确实失败，这对于记录已损坏的功能直到修复为止很有用。

**参数**

- <a id="test-run-fail-option-test"></a>`test` `TestCase | Suite`

  要标记为预期失败的测试或套件。
- <a id="test-run-fail-option-reason"></a>`reason` `string` *(可选)*

  作为注解描述显示的可选解释。


### testRun.fixme() {#test-run-fixme}

<Badge type="info" text="Added in: v1.62" />

将测试或套件中的每个测试标记为 fixme。测试主体不会执行，测试将报告为跳过，意图是修复它们。

**参数**

- <a id="test-run-fixme-option-test"></a>`test` `TestCase | Suite`

  要标记为 fixme 的测试或套件。
- <a id="test-run-fixme-option-reason"></a>`reason` `string` *(可选)*

  作为注解描述显示的可选解释。


### testRun.mode() {#test-run-mode}

<Badge type="info" text="Added in: v1.65" />

返回使用 [`test.describe.configure()`](/api/class-test#test-describe-configure)、[`test.describe.serial()`](/api/class-test#test-describe-serial) 或 [`test.describe.parallel()`](/api/class-test#test-describe-parallel) 为套件配置的执行模式。
如果套件未配置模式，则继承其父级的模式。当启用 [`testProject.fullyParallel`](/api/class-testproject#test-project-fully-parallel) 时，项目套件使用 `"parallel"`，否则使用 `"default"`。根套件使用 `"default"`。

显式的 `"default"` 套件不会从其父级继承 `"parallel"`：其测试在同一工作进程中按顺序运行。仅模式本身不能描述完整的测试组，这还取决于工作进程 fixture 和钩子。

此方法只能在 [`reporter.preprocess()`](/api/class-reporter#reporter-preprocess) 期间调用，也可以检查设置和清理项目。

**参数**

- <a id="test-run-mode-option-suite"></a>`suite` `Suite`

  要检查的套件。

**返回**

- `"serial" | "parallel" | "default"`


### testRun.skip() {#test-run-skip}

<Badge type="info" text="Added in: v1.62" />

跳过测试或套件中的每个测试。测试主体不会执行，测试将报告为跳过。

**参数**

- <a id="test-run-skip-option-test"></a>`test` `TestCase | Suite`

  要跳过的测试或套件。
- <a id="test-run-skip-option-reason"></a>`reason` `string` *(可选)*

  作为注解描述显示的可选解释。


### testRun.skipSharding() {#test-run-skip-sharding}

<Badge type="info" text="Added in: v1.62" />

禁用此次运行的 Playwright 内置分片过滤器，将分片留给报告器。报告器通常通过对分片外的测试调用 [`testRun.exclude()`](/api/class-testrun#test-run-exclude) 来实现自己的分片。
