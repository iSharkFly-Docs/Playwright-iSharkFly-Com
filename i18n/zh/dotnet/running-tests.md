---
title: "运行和调试测试"
---

# 运行和调试测试

## 简介

你可以运行单个测试、一组测试或所有测试。测试可以在不同的浏览器上运行。默认情况下，测试以无头模式运行，这意味着在运行测试时不会打开浏览器窗口，结果将显示在终端中。如果你愿意，可以使用 `headless` 测试运行参数以有头模式运行测试。

**你将学习**
- [如何运行测试](#running-tests)
- [如何调试测试](#debugging-tests)

## 运行测试

### 运行所有测试

使用以下命令运行所有测试。

```bash
dotnet test
```

### 以有头模式运行测试

使用以下命令以有头模式运行测试，为每个测试打开一个浏览器窗口。

::: code-group

```bash [Bash]
HEADED=1 dotnet test
```

```bat [Batch]
set HEADED=1
dotnet test
```

```powershell [PowerShell]
$env:HEADED="1"
dotnet test
```

:::

### 在不同浏览器上运行测试：Browser 环境变量

通过 `BROWSER` 环境变量指定你希望在哪个浏览器上运行测试。

::: code-group

```bash [Bash]
BROWSER=webkit dotnet test
```

```bat [Batch]
set BROWSER=webkit
dotnet test
```

```powershell [PowerShell]
$env:BROWSER="webkit"
dotnet test
```

:::

### 在不同浏览器上运行测试：启动配置

通过调整启动配置选项来指定你希望在哪个浏览器上运行测试：

```bash
dotnet test -- Playwright.BrowserName=webkit
```

要在多个浏览器或配置上运行测试，你需要多次调用 `dotnet test` 命令。然后你可以指定 `BROWSER` 环境变量或通过 runsettings 文件设置 `Playwright.BrowserName`：

```bash
dotnet test --settings:chromium.runsettings
dotnet test --settings:firefox.runsettings
dotnet test --settings:webkit.runsettings
```

```xml
<?xml version="1.0" encoding="utf-8"?>
  <RunSettings>
    <Playwright>
      <BrowserName>chromium</BrowserName>
    </Playwright>
  </RunSettings>
```

有关更多信息，请参阅 Microsoft 文档中的[选择性单元测试](https://docs.microsoft.com/en-us/dotnet/core/testing/selective-unit-tests?pivots=mstest)。

### 运行特定测试

要运行单个测试文件，使用 filter 标志后跟你要运行的测试类名。

```bash
dotnet test --filter "ExampleTest"
```

要运行一组测试文件，使用 filter 标志后跟你要运行的测试类名。

```bash
dotnet test --filter "ExampleTest1|ExampleTest2"
```

要运行具有特定标题的测试，使用 filter 标志后跟 *Name~* 和测试的标题。

```bash
dotnet test --filter "Name~GetStartedLink"
```

### 使用多个工作线程运行测试：

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

```bash
dotnet test -- NUnit.NumberOfTestWorkers=5
```

</TabItem>

<TabItem value="mstest">

```bash
dotnet test -- MSTest.Parallelize.Workers=5
```

</TabItem>

<TabItem value="xunit">

```bash
dotnet test -- xUnit.MaxParallelThreads=5
```

请参阅[此处](https://xunit.net/docs/running-tests-in-parallel.html)了解更多关于使用 xUnit 并行运行测试的信息。

::: info
我们推荐使用 xUnit 2.8+，它默认使用 [`conservative` 并行算法](https://xunit.net/docs/running-tests-in-parallel.html#algorithms)。
:::

</TabItem>

<TabItem value="xunit-v3">

```bash
dotnet test -- xUnit.MaxParallelThreads=5
```

请参阅[此处](https://xunit.net/docs/running-tests-in-parallel.html)了解更多关于使用 xUnit v3 并行运行测试的信息。

::: info
xUnit v3 默认使用 [`conservative` 并行算法](https://xunit.net/docs/running-tests-in-parallel.html#algorithms)。
:::

</TabItem>

</Tabs>

## 调试测试

由于 Playwright 在 .NET 中运行，你可以使用你选择的调试器进行调试，例如在 Visual Studio Code 或 Visual Studio 中。Playwright 附带 Playwright Inspector，它允许你逐步执行 Playwright API 调用，查看它们的调试日志并探索[定位器](./locators.md)。

::: code-group

```bash [Bash]
PWDEBUG=1 dotnet test
```

```bat [Batch]
set PWDEBUG=1
dotnet test
```

```powershell [PowerShell]
$env:PWDEBUG=1
dotnet test
```

:::

<img src="https://github.com/microsoft/playwright/assets/13063165/a1e758d3-d379-414f-be0b-7339f12bb635" alt="使用 playwright inspector 调试测试" width="2700" height="1736" />

查看我们的[调试指南](./debug.md)以了解更多关于 [Playwright Inspector](./debug.md#playwright-inspector) 以及使用[浏览器开发者工具](./debug.md#browser-developer-tools)调试的信息。

## 下一步
- [使用 Codegen 生成测试](./codegen-intro.md)
- [查看测试的跟踪](./trace-viewer-intro.md)
- [在 CI 上运行测试](./ci-intro.md)
- [了解更多关于 MSTest、NUnit、xUnit 和 xUnit v3 基类的信息](./test-runners.md)
