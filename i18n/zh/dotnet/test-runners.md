---
title: "测试运行器"
---

# 测试运行器

## 简介

虽然 Playwright for .NET 不绑定到特定的测试运行器或测试框架，但根据我们的经验，最简单的入门方式是使用我们为 MSTest、NUnit、xUnit 或 xUnit v3 提供的基类。这些类支持在多个浏览器引擎上运行测试、调整启动/上下文选项，以及开箱即用地为每个测试获取 [Page](/dotnet/api/class-page)/[BrowserContext](/dotnet/api/class-browsercontext) 实例。

为了获得更好的性能，Playwright 和 Browser 实例将在测试之间重用。我们建议在新的 BrowserContext 中运行每个测试用例，这样浏览器状态将在测试之间隔离。

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

Playwright 通过 [`Microsoft.Playwright.NUnit`](https://www.nuget.org/packages/Microsoft.Playwright.NUnit) 包提供基类来编写 NUnit 测试。

</TabItem>

<TabItem value="mstest">

Playwright 通过 [`Microsoft.Playwright.MSTest`](https://www.nuget.org/packages/Microsoft.Playwright.MSTest) 包提供基类来编写 MSTest 测试。

</TabItem>

<TabItem value="xunit">

Playwright 通过 [`Microsoft.Playwright.Xunit`](https://www.nuget.org/packages/Microsoft.Playwright.Xunit) 包提供基类来编写 xUnit 测试。

</TabItem>

<TabItem value="xunit-v3">

Playwright 通过 [`Microsoft.Playwright.Xunit.v3`](https://www.nuget.org/packages/Microsoft.Playwright.Xunit.v3) 包提供基类来编写 xUnit v3 测试。

</TabItem>

</Tabs>

查看[安装指南](./intro.md)以开始使用。

## 并行运行测试

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

默认情况下，NUnit 将并行运行所有测试文件，同时在每个文件内按顺序运行测试（`ParallelScope.Self`）。它将创建与主机系统核心数相同数量的进程。您可以使用 NUnit.NumberOfTestWorkers 参数调整此行为。仅支持 `ParallelScope.Self`。

对于 CPU 密集型测试，我们建议使用与系统核心数相同的工作线程数除以 2。对于 IO 密集型测试，您可以使用与核心数相同的工作线程数。

```bash
dotnet test -- NUnit.NumberOfTestWorkers=5
```

</TabItem>

<TabItem value="mstest">

默认情况下，MSTest 将并行运行所有类，同时在每个类内按顺序运行测试（`ExecutionScope.ClassLevel`）。它将创建与主机系统核心数相同数量的进程。您可以使用以下 CLI 参数或 `.runsettings` 文件来调整此行为，请参见下文。不支持在方法级别（`ExecutionScope.MethodLevel`）并行运行测试。

```bash
dotnet test --settings:.runsettings -- MSTest.Parallelize.Workers=4
```

</TabItem>

<TabItem value="xunit">

默认情况下，xUnit 将并行运行所有类，同时在每个类内按顺序运行测试。默认情况下，它将创建与系统核心数相同数量的进程。您可以使用以下 CLI 参数或 `.runsettings` 文件来调整此行为，请参见下文。

```bash
dotnet test -- xUnit.MaxParallelThreads=5
```

::: info
我们推荐使用 xUnit 2.8+，它默认使用 [`conservative` 并行算法](https://xunit.net/docs/running-tests-in-parallel.html#algorithms)。
:::

</TabItem>

<TabItem value="xunit-v3">

默认情况下，xUnit v3 将并行运行所有类，同时在每个类内按顺序运行测试。默认情况下，它将创建与系统核心数相同数量的进程。您可以使用以下 CLI 参数或 `.runsettings` 文件来调整此行为，请参见下文。

```bash
dotnet test -- xUnit.MaxParallelThreads=5
```

::: info
xUnit v3 默认使用 [`conservative` 并行算法](https://xunit.net/docs/running-tests-in-parallel.html#algorithms)。
:::

</TabItem>

</Tabs>

## 自定义 [BrowserContext](/dotnet/api/class-browsercontext) 选项

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

要自定义上下文选项，您可以重写派生自 `Microsoft.Playwright.NUnit.PageTest` 或 `Microsoft.Playwright.NUnit.ContextTest` 的测试类的 `ContextOptions` 方法。请参见以下示例：

```csharp
using Microsoft.Playwright.NUnit;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class MyTest : PageTest
{
    [Test]
    public async Task TestWithCustomContextOptions()
    {
        // 以下 Page（和 BrowserContext）实例具有自定义的 colorScheme、viewport 和 baseURL 设置：
        await Page.GotoAsync("/login");
    }

    public override BrowserNewContextOptions ContextOptions()
    {
        return new BrowserNewContextOptions()
        {
            ColorScheme = ColorScheme.Light,
            ViewportSize = new()
            {
                Width = 1920,
                Height = 1080
            },
            BaseURL = "https://github.com",
        };
    }
}
```

</TabItem>

<TabItem value="mstest">

要自定义上下文选项，您可以重写派生自 `Microsoft.Playwright.MSTest.PageTest` 或 `Microsoft.Playwright.MSTest.ContextTest` 的测试类的 `ContextOptions` 方法。请参见以下示例：

```csharp
using System.Threading.Tasks;
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PlaywrightTests;

[TestClass]
public class ExampleTest : PageTest
{
    [TestMethod]
    public async Task TestWithCustomContextOptions()
    {
        // 以下 Page（和 BrowserContext）实例具有自定义的 colorScheme、viewport 和 baseURL 设置：
        await Page.GotoAsync("/login");
    }

    public override BrowserNewContextOptions ContextOptions()
    {
        return new BrowserNewContextOptions()
        {
            ColorScheme = ColorScheme.Light,
            ViewportSize = new()
            {
                Width = 1920,
                Height = 1080
            },
            BaseURL = "https://github.com",
        };
    }
}

```

</TabItem>

<TabItem value="xunit">

要自定义上下文选项，您可以重写派生自 `Microsoft.Playwright.Xunit.PageTest` 或 `Microsoft.Playwright.Xunit.ContextTest` 的测试类的 `ContextOptions` 方法。请参见以下示例：

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;

namespace PlaywrightTests;

public class UnitTest1 : PageTest
{
    [Fact]
    public async Task TestWithCustomContextOptions()
    {
        // 以下 Page（和 BrowserContext）实例具有自定义的 colorScheme、viewport 和 baseURL 设置：
        await Page.GotoAsync("/login");
    }
    public override BrowserNewContextOptions ContextOptions()
    {
        return new BrowserNewContextOptions()
        {
            ColorScheme = ColorScheme.Light,
            ViewportSize = new()
            {
                Width = 1920,
                Height = 1080
            },
            BaseURL = "https://github.com",
        };
    }
}
```

</TabItem>

<TabItem value="xunit-v3">

要自定义上下文选项，您可以重写派生自 `Microsoft.Playwright.Xunit.v3.PageTest` 或 `Microsoft.Playwright.Xunit.v3.ContextTest` 的测试类的 `ContextOptions` 方法。请参见以下示例：

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;

namespace PlaywrightTests;

public class UnitTest1 : PageTest
{
    [Fact]
    public async Task TestWithCustomContextOptions()
    {
        // 以下 Page（和 BrowserContext）实例具有自定义的 colorScheme、viewport 和 baseURL 设置：
        await Page.GotoAsync("/login");
    }
    public override BrowserNewContextOptions ContextOptions()
    {
        return new BrowserNewContextOptions()
        {
            ColorScheme = ColorScheme.Light,
            ViewportSize = new()
            {
                Width = 1920,
                Height = 1080
            },
            BaseURL = "https://github.com",
        };
    }
}
```

</TabItem>

</Tabs>

## 自定义 [Browser](/dotnet/api/class-browser)/启动选项

[Browser](/dotnet/api/class-browser)/启动选项可以通过运行设置文件或直接通过 CLI 设置运行设置选项来重写。请参见以下示例：

```xml
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
  <Playwright>
    <BrowserName>chromium</BrowserName>
    <LaunchOptions>
      <Headless>false</Headless>
      <Channel>msedge</Channel>
    </LaunchOptions>
  </Playwright>
</RunSettings>
```

```bash
dotnet test -- Playwright.BrowserName=chromium Playwright.LaunchOptions.Headless=false Playwright.LaunchOptions.Channel=msedge
```

## 重试失败的测试

Playwright for .NET 本身不会重试失败的测试，请使用测试运行器的重试功能。NUnit 和 MSTest 有一个属性可以重试单个测试，而 [Microsoft.Testing.Platform](#使用-microsofttestingplatform-重试) 可以重试运行中所有失败的测试。每次尝试都会获得新的 [BrowserContext](/dotnet/api/class-browsercontext) 和 [Page](/dotnet/api/class-page)。

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

在测试方法上添加 [`Retry`](https://docs.nunit.org/articles/nunit/writing-tests/attributes/retry.html) 属性。其参数是总尝试次数，因此 `[Retry(3)]` 会将失败的测试重试最多两次。

默认情况下，NUnit 只会重试因 NUnit 断言失败而失败的测试。Playwright 断言会抛出 [PlaywrightAssertionException](/dotnet/api/class-playwrightassertionexception)，其他 Playwright 错误会抛出 [PlaywrightException](/dotnet/api/class-playwrightexception)，超时的操作会抛出 `TimeoutException`，因此需要将它们都作为 `RetryExceptions` 传递。此属性需要 NUnit 4.5 或更高版本。

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class MyTest : PageTest
{
    [Test]
    [Retry(3, RetryExceptions = [typeof(PlaywrightException), typeof(PlaywrightAssertionException), typeof(TimeoutException)])]
    public async Task TestWithRetries()
    {
        await Page.GotoAsync("https://playwright.dev");
        await Expect(Page.GetByRole(AriaRole.Link, new() { Name = "Get started" })).ToBeVisibleAsync();
    }
}
```

</TabItem>

<TabItem value="mstest">

在测试方法上添加 [`Retry`](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-mstest-writing-tests-controlling-execution) 属性。需要 MSTest 3.8 或更高版本。其参数是重试次数，因此 `[Retry(2)]` 会将失败的测试运行最多三次。MSTest 会在任何失败后重试，包括失败的 Playwright 断言和超时。

```csharp
using System.Threading.Tasks;
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PlaywrightTests;

[TestClass]
public class ExampleTest : PageTest
{
    [TestMethod]
    [Retry(2)]
    public async Task TestWithRetries()
    {
        await Page.GotoAsync("https://playwright.dev");
        await Expect(Page.GetByRole(AriaRole.Link, new() { Name = "Get started" })).ToBeVisibleAsync();
    }
}
```

</TabItem>

<TabItem value="xunit">

xUnit v2 没有内置的重试失败测试的方法。重试需要 xUnit v3，它运行在 [Microsoft.Testing.Platform](#使用-microsofttestingplatform-重试) 上。

</TabItem>

<TabItem value="xunit-v3">

xUnit v3 没有重试属性。使用 [Microsoft.Testing.Platform](#使用-microsofttestingplatform-重试) 重试失败的测试。

</TabItem>

</Tabs>

### 使用 Microsoft.Testing.Platform 重试

Microsoft.Testing.Platform 的[重试扩展](https://learn.microsoft.com/en-us/dotnet/core/testing/microsoft-testing-platform-retry)会在新进程中重新运行运行中失败的测试，无需更改测试。它适用于 MSTest、NUnit 和 xUnit v3，但不适用于 xUnit v2。

首先，在 Microsoft.Testing.Platform 上运行您的测试。xUnit v3 [开箱即用地支持它](https://xunit.net/docs/getting-started/v3/microsoft-testing-platform)。对于 MSTest，在项目文件中设置 `EnableMSTestRunner`，对于 NUnit 设置 `EnableNUnitRunner`：

```xml
<PropertyGroup>
  <OutputType>Exe</OutputType>
  <EnableMSTestRunner>true</EnableMSTestRunner>
</PropertyGroup>
```

使用 .NET 10 SDK 时，`dotnet test` 还需要以下 `global.json` 文件：

```json
{
  "test": {
    "runner": "Microsoft.Testing.Platform"
  }
}
```

然后将扩展添加到测试项目：

```bash
dotnet add package Microsoft.Testing.Extensions.Retry
```

::: info
包的主版本号必须与测试运行器使用的 Microsoft.Testing.Platform 版本匹配，否则不会运行任何测试。例如，xUnit v3 3.x 需要包的 1.x 版本，而 xUnit v3 4.x 需要 2.x 版本。
:::

现在您可以将每个失败的测试重试最多两次：

```bash
dotnet test --retry-failed-tests 2
```

## 使用详细 API 日志

当您通过 `DEBUG` 环境变量启用[详细 API 日志](./debug.md#verbose-api-logs)时，您将在标准错误流中看到消息。在 Visual Studio 中，这将是 `Output` 窗口的 `Tests` 窗格。它也将显示在每个测试的 `Test Log` 中。

## 使用 .runsettings 文件

从 Visual Studio 运行测试时，您可以利用 `.runsettings` 文件。以下显示了支持的值的参考。

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

例如，要指定工作线程数，您可以使用 `NUnit.NumberOfTestWorkers`，或使用 `RunConfiguration.EnvironmentVariables` 启用 `DEBUG` 日志。

```xml
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
  <!-- NUnit 适配器 -->
  <NUnit>
    <NumberOfTestWorkers>24</NumberOfTestWorkers>
  </NUnit>
  <!-- 通用运行配置 -->
  <RunConfiguration>
    <EnvironmentVariables>
      <!-- 对于调试选择器，建议设置以下环境变量 -->
      <DEBUG>pw:api</DEBUG>
    </EnvironmentVariables>
  </RunConfiguration>
  <!-- Playwright -->
  <Playwright>
    <BrowserName>chromium</BrowserName>
    <ExpectTimeout>5000</ExpectTimeout>
    <LaunchOptions>
      <Headless>false</Headless>
      <Channel>msedge</Channel>
    </LaunchOptions>
  </Playwright>
</RunSettings>
```

</TabItem>

<TabItem value="mstest">

例如，要指定工作线程数，您可以使用 `MSTest.Parallelize.Workers`。您也可以使用 `RunConfiguration.EnvironmentVariables` 启用 `DEBUG` 日志。

```xml
<RunSettings>
  <!-- MSTest 适配器 -->
  <MSTest>
    <Parallelize>
      <Workers>4</Workers>
      <Scope>ClassLevel</Scope>
    </Parallelize>
  </MSTest>
  <!-- 通用运行配置 -->
  <RunConfiguration>
    <EnvironmentVariables>
      <!-- 对于调试选择器，建议设置以下环境变量 -->
      <DEBUG>pw:api</DEBUG>
    </EnvironmentVariables>
  </RunConfiguration>
  <!-- Playwright -->
  <Playwright>
    <BrowserName>chromium</BrowserName>
    <ExpectTimeout>5000</ExpectTimeout>
    <LaunchOptions>
      <Headless>false</Headless>
      <Channel>msedge</Channel>
    </LaunchOptions>
  </Playwright>
</RunSettings>
```

</TabItem>

<TabItem value="xunit">

例如，要指定工作线程数，您可以使用 `xUnit.MaxParallelThreads`。您也可以使用 `RunConfiguration.EnvironmentVariables` 启用 `DEBUG` 日志。

```xml
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
  <!-- 参见 https://xunit.net/docs/runsettings -->
  <xUnit>
    <MaxParallelThreads>1</MaxParallelThreads>
  </xUnit>
  <!-- 通用运行配置 -->
  <RunConfiguration>
    <EnvironmentVariables>
      <!-- 对于调试选择器，建议设置以下环境变量 -->
      <DEBUG>pw:api</DEBUG>
    </EnvironmentVariables>
  </RunConfiguration>
  <!-- Playwright -->
  <Playwright>
    <BrowserName>chromium</BrowserName>
    <ExpectTimeout>5000</ExpectTimeout>
    <LaunchOptions>
      <Headless>false</Headless>
      <Channel>msedge</Channel>
    </LaunchOptions>
  </Playwright>
</RunSettings>
```

</TabItem>

<TabItem value="xunit-v3">

例如，要指定工作线程数，您可以使用 `xUnit.MaxParallelThreads`。您也可以使用 `RunConfiguration.EnvironmentVariables` 启用 `DEBUG` 日志。

```xml
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
  <!-- 参见 https://xunit.net/docs/runsettings -->
  <xUnit>
    <MaxParallelThreads>1</MaxParallelThreads>
  </xUnit>
  <!-- 通用运行配置 -->
  <RunConfiguration>
    <EnvironmentVariables>
      <!-- 对于调试选择器，建议设置以下环境变量 -->
      <DEBUG>pw:api</DEBUG>
    </EnvironmentVariables>
  </RunConfiguration>
  <!-- Playwright -->
  <Playwright>
    <BrowserName>chromium</BrowserName>
    <ExpectTimeout>5000</ExpectTimeout>
    <LaunchOptions>
      <Headless>false</Headless>
      <Channel>msedge</Channel>
    </LaunchOptions>
  </Playwright>
</RunSettings>
```

</TabItem>

</Tabs>

## Playwright 的基类

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

`Microsoft.Playwright.NUnit` 命名空间中有几个可用的基类：

</TabItem>

<TabItem value="mstest">

`Microsoft.Playwright.MSTest` 命名空间中有几个可用的基类：

</TabItem>

<TabItem value="xunit">

`Microsoft.Playwright.Xunit` 命名空间中有几个可用的基类：

</TabItem>

<TabItem value="xunit-v3">

`Microsoft.Playwright.Xunit.v3` 命名空间中有几个可用的基类：

</TabItem>

</Tabs>

|测试类        |描述|
|--------------|-----------|
|PageTest      |每个测试获得一个在其独特的 [BrowserContext](/dotnet/api/class-browsercontext) 中创建的全新 [Page](/dotnet/api/class-page) 副本。扩展此类是编写功能完整的 Playwright 测试的最简单方式。<br></br><br></br>注意：您可以在每个测试文件中重写 `ContextOptions` 方法来控制上下文选项，这些选项通常传递给 [`Browser.NewContextAsync()`](/dotnet/api/class-browser#browser-new-context) 方法。这样您可以为每个测试文件单独指定各种模拟选项。|
|ContextTest   |每个测试将获得一个全新的 [BrowserContext](/dotnet/api/class-browsercontext) 副本。您可以在此上下文中创建任意数量的页面。使用此测试是测试多页面场景的最简单方式，当您需要多个标签页时。<br></br><br></br>注意：您可以在每个测试文件中重写 `ContextOptions` 方法来控制上下文选项，这些选项通常传递给 [`Browser.NewContextAsync()`](/dotnet/api/class-browser#browser-new-context) 方法。这样您可以为每个测试文件单独指定各种模拟选项。|
|BrowserTest   |每个测试将获得一个浏览器，并可以创建任意数量的上下文。每个测试负责清理其创建的所有上下文。|
|PlaywrightTest|这为每个测试提供一个 Playwright 对象，以便测试可以启动和停止任意数量的浏览器。|
