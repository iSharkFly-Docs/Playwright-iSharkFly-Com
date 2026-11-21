---
title: "跟踪查看器"
---

# 跟踪查看器

## 简介

Playwright 跟踪查看器是一个 GUI 工具，可让你探索测试的录制 Playwright 跟踪，这意味着你可以前后浏览测试的每个操作，并直观地看到每个操作期间发生了什么。

**你将学习**
- 如何录制跟踪
- 如何打开跟踪查看器

## 录制跟踪

可以使用 [`BrowserContext.Tracing`](/dotnet/api/class-browsercontext#browser-context-tracing) API 录制跟踪，如下所示：

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

```csharp
namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class Tests : PageTest
{
    [SetUp]
    public async Task Setup()
    {
        await Context.Tracing.StartAsync(new()
        {
            Title = $"{TestContext.CurrentContext.Test.ClassName}.{TestContext.CurrentContext.Test.Name}",
            Screenshots = true,
            Snapshots = true,
            Sources = true
        });
    }

    [TearDown]
    public async Task TearDown()
    {
        await Context.Tracing.StopAsync(new()
        {
            Path = Path.Combine(
                TestContext.CurrentContext.WorkDirectory,
                "playwright-traces",
                $"{TestContext.CurrentContext.Test.ClassName}.{TestContext.CurrentContext.Test.Name}.zip"
            )
        });
    }

    [Test]
    public async Task GetStartedLink()
    {
        // ..
    }
}
```

</TabItem>

<TabItem value="mstest">

```csharp
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class ExampleTest : PageTest
{
    [TestInitialize]
    public async Task TestInitialize()
    {
         await Context.Tracing.StartAsync(new()
        {
            Title = $"{TestContext.FullyQualifiedTestClassName}.{TestContext.TestName}",
            Screenshots = true,
            Snapshots = true,
            Sources = true
        });
    }

    [TestCleanup]
    public async Task TestCleanup()
    {
        await Context.Tracing.StopAsync(new()
        {
            Path = Path.Combine(
                Environment.CurrentDirectory,
                "playwright-traces",
                $"{TestContext.FullyQualifiedTestClassName}.{TestContext.TestName}.zip"
            )
        });
    }

    [TestMethod]
    public async Task GetStartedLink()
    {
        // ...
    }
}
```

</TabItem>

<TabItem value="xunit">

```csharp
using System.Reflection;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using Xunit.Sdk;

namespace PlaywrightTests;

[WithTestName]
public class UnitTest1 : PageTest
{
    public override async Task InitializeAsync()
    {
        await base.InitializeAsync().ConfigureAwait(false);
        await Context.Tracing.StartAsync(new()
        {
            Title = $"{WithTestNameAttribute.CurrentClassName}.{WithTestNameAttribute.CurrentTestName}",
            Screenshots = true,
            Snapshots = true,
            Sources = true
        });
    }

    public override async Task DisposeAsync()
    {
        await Context.Tracing.StopAsync(new()
        {
            Path = Path.Combine(
                Environment.CurrentDirectory,
                "playwright-traces",
               $"{WithTestNameAttribute.CurrentClassName}.{WithTestNameAttribute.CurrentTestName}.zip"
            )
        });
        await base.DisposeAsync().ConfigureAwait(false);
    }

    [Fact]
    public async Task GetStartedLink()
    {
        // ...
        await Page.GotoAsync("https://playwright.dev/dotnet/docs/intro");
    }
}

public class WithTestNameAttribute : BeforeAfterTestAttribute
{
    public static string CurrentTestName = string.Empty;
    public static string CurrentClassName = string.Empty;

    public override void Before(MethodInfo methodInfo)
    {
        CurrentTestName = methodInfo.Name;
        CurrentClassName = methodInfo.DeclaringType!.Name;
    }

    public override void After(MethodInfo methodInfo)
    {
    }
}
```

</TabItem>

<TabItem value="xunit-v3">

```csharp
using System.Reflection;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;
using Xunit.Sdk;

namespace PlaywrightTests;

[WithTestName]
public class UnitTest1 : PageTest
{
    public override async Task InitializeAsync()
    {
        await base.InitializeAsync().ConfigureAwait(false);
        await Context.Tracing.StartAsync(new()
        {
            Title = $"{WithTestNameAttribute.CurrentClassName}.{WithTestNameAttribute.CurrentTestName}",
            Screenshots = true,
            Snapshots = true,
            Sources = true
        });
    }

    public override async Task DisposeAsync()
    {
        await Context.Tracing.StopAsync(new()
        {
            Path = Path.Combine(
                Environment.CurrentDirectory,
                "playwright-traces",
               $"{WithTestNameAttribute.CurrentClassName}.{WithTestNameAttribute.CurrentTestName}.zip"
            )
        });
        await base.DisposeAsync().ConfigureAwait(false);
    }

    [Fact]
    public async Task GetStartedLink()
    {
        // ...
        await Page.GotoAsync("https://playwright.dev/dotnet/docs/intro");
    }
}

public class WithTestNameAttribute : BeforeAfterTestAttribute
{
    public static string CurrentTestName = string.Empty;
    public static string CurrentClassName = string.Empty;

    public override void Before(MethodInfo methodInfo)
    {
        CurrentTestName = methodInfo.Name;
        CurrentClassName = methodInfo.DeclaringType!.Name;
    }

    public override void After(MethodInfo methodInfo)
    {
    }
}
```

</TabItem>

</Tabs>

这将为每个测试录制一个 zip 文件，例如 `PlaywrightTests.ExampleTest.GetStartedLink.zip`，并将其放置在 `bin/Debug/net8.0/playwright-traces/` 目录中。

## 打开跟踪

你可以使用 Playwright CLI 或在浏览器中的 [`trace.playwright.dev`](https://trace.playwright.dev) 打开保存的跟踪。确保添加跟踪 zip 文件所在位置的完整路径。打开后，你可以点击每个操作或使用时间线查看每个操作前后页面的状态。你还可以在测试的每个步骤中检查日志、源代码和网络。跟踪查看器创建 DOM 快照，因此你可以与其完全交互，打开开发者工具等。

```bash
pwsh bin/Debug/net8.0/playwright.ps1 show-trace bin/Debug/net8.0/playwright-traces/PlaywrightTests.ExampleTest.GetStartedLink.zip
```

<img src="https://github.com/microsoft/playwright/assets/13063165/4372d661-5bfa-4e1f-be65-0d2fe165a75c" alt="playwright 跟踪查看器 dotnet" width="3436" height="2106" />

查看我们关于[跟踪查看器](/trace-viewer.md)的详细指南，了解更多关于跟踪查看器以及如何设置测试仅在测试失败时录制跟踪的信息。

## 下一步
- [使用 GitHub Actions 在 CI 上运行测试](/ci-intro.md)
- [了解更多关于 MSTest、NUnit、xUnit 和 xUnit v3 基类的信息](./test-runners.md)
