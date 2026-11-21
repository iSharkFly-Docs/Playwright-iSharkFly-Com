---
title: "追踪查看器"
---

# 追踪查看器

import LiteYouTube from '@site/src/components/LiteYouTube';

## 简介

Playwright 追踪查看器是一个 GUI 工具，可帮助您在脚本运行后探索录制的 Playwright 追踪。追踪是调试在 CI 上失败的测试的好方法。您可以[在本地](#打开追踪查看器)打开追踪，或在浏览器中通过 [trace.playwright.dev](https://trace.playwright.dev) 打开。

## 打开追踪查看器

您可以使用 Playwright CLI 或在浏览器中通过 [trace.playwright.dev](https://trace.playwright.dev) 打开保存的追踪。确保添加 `trace.zip` 文件所在位置的完整路径。

```bash
pwsh bin/Debug/netX/playwright.ps1 show-trace trace.zip
```

### 使用 [trace.playwright.dev](https://trace.playwright.dev)

[trace.playwright.dev](https://trace.playwright.dev) 是追踪查看器的静态托管版本。您可以通过拖放或点击 `Select file` 按钮来上传追踪文件。

追踪查看器完全在您的浏览器中加载追踪，不会向外部传输任何数据。

<img height="1684" width="2238" alt="拖放 Playwright 追踪以加载" src="https://user-images.githubusercontent.com/13063165/194577918-b4d45726-2692-4093-8a28-9e73552617ef.png" />

### 查看远程追踪

您可以使用追踪的 URL 直接打开远程追踪。这使得查看远程追踪变得很容易，无需手动从 CI 运行下载文件。

```bash
pwsh bin/Debug/netX/playwright.ps1 show-trace https://example.com/trace.zip
```

使用 [trace.playwright.dev](https://trace.playwright.dev) 时，您也可以将上传到某个可访问存储（例如在您的 CI 内）的追踪 URL 作为查询参数传递。可能会应用 CORS（跨域资源共享）规则。

```txt
https://trace.playwright.dev/?trace=https://demo.playwright.dev/reports/todomvc/data/e6099cadf79aa753d5500aa9508f9d1dbd87b5ee.zip
```

## 录制追踪

可以使用 [`BrowserContext.Tracing`](/dotnet/api/class-browsercontext#browser-context-tracing) API 录制追踪，如下所示：

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
            Title = TestContext.CurrentContext.Test.ClassName + "." + TestContext.CurrentContext.Test.Name,
            Screenshots = true,
            Snapshots = true,
            Sources = true
        });
    }

    [TearDown]
    public async Task TearDown()
    {
        // 这将生成例如：
        // bin/Debug/net8.0/playwright-traces/PlaywrightTests.Tests.Test1.zip
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
    public async Task TestYourOnlineShop()
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

namespace PlaywrightTestsMSTest;

[TestClass]
public class UnitTest1 : PageTest
{
    [TestInitialize]
    public async Task TestInitialize()
    {
         await Context.Tracing.StartAsync(new()
        {
            Title = TestContext.TestName,
            Screenshots = true,
            Snapshots = true,
            Sources = true
        });
    }

    [TestCleanup]
    public async Task TestCleanup()
    {
        // 这将生成例如：
        // bin/Debug/net8.0/playwright-traces/PlaywrightTests.UnitTest1.zip
        await Context.Tracing.StopAsync(new()
        {
            Path = Path.Combine(
                Environment.CurrentDirectory,
                "playwright-traces",
                $"{TestContext.FullyQualifiedTestClassName}.zip"
            )
        });
    }

    [TestMethod]
    public async Task TestYourOnlineShop()
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

这将录制追踪并将其放置在 `bin/Debug/net8.0/playwright-traces/` 目录中。

## 仅在失败时运行追踪

设置您的测试以仅在测试失败时录制追踪：

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

```csharp
namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class ExampleTest : PageTest
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
        var failed = TestContext.CurrentContext.Result.Outcome == NUnit.Framework.Interfaces.ResultState.Error
            || TestContext.CurrentContext.Result.Outcome == NUnit.Framework.Interfaces.ResultState.Failure;

        await Context.Tracing.StopAsync(new()
        {
            Path = failed ? Path.Combine(
                TestContext.CurrentContext.WorkDirectory,
                "playwright-traces",
                $"{TestContext.CurrentContext.Test.ClassName}.{TestContext.CurrentContext.Test.Name}.zip"
            ) : null,
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
        var failed = new[] { UnitTestOutcome.Failed, UnitTestOutcome.Error, UnitTestOutcome.Timeout, UnitTestOutcome.Aborted }.Contains(TestContext.CurrentTestOutcome);

        await Context.Tracing.StopAsync(new()
        {
            Path = failed ? Path.Combine(
                Environment.CurrentDirectory,
                "playwright-traces",
                $"{TestContext.FullyQualifiedTestClassName}.{TestContext.TestName}.zip"
            ) : null,
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
            Path = !TestOk ? Path.Combine(
                Environment.CurrentDirectory,
                "playwright-traces",
               $"{WithTestNameAttribute.CurrentClassName}.{WithTestNameAttribute.CurrentTestName}.zip"
            ) : null
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
            Path = !TestOk ? Path.Combine(
                Environment.CurrentDirectory,
                "playwright-traces",
               $"{WithTestNameAttribute.CurrentClassName}.{WithTestNameAttribute.CurrentTestName}.zip"
            ) : null
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

## 追踪查看器功能

### 操作

在操作标签页中，您可以看到每个操作使用的定位器以及每个操作运行所花费的时间。将鼠标悬停在测试的每个操作上，可以直观地看到 DOM 快照中的变化。在时间中前进和后退，并点击某个操作来检查和调试。使用"之前"和"之后"标签页可以直观地看到操作之前和之后发生了什么。

<img src="https://github.com/microsoft/playwright/assets/13063165/948b65cd-f0fd-4c7f-8e53-2c632b5a07f1" alt="追踪查看器中的操作标签页" width="3598" height="2218" />

**选择每个操作会显示：**
- 操作快照
- 操作日志
- 源代码位置

### 截图

当启用 [`screenshots`](/dotnet/api/class-tracing#tracing-start-option-screenshots) 选项进行追踪时（默认启用），每个追踪都会录制屏幕录像并将其呈现为胶片条。您可以将鼠标悬停在胶片条上以查看每个操作和状态的放大图像，这有助于您轻松找到要检查的操作。

双击某个操作以查看该操作的时间范围。您可以使用时间线中的滑块来增加选定的操作，这些操作将显示在操作标签页中，所有控制台日志和网络日志将被过滤为仅显示所选操作的日志。

<img src="https://github.com/microsoft/playwright/assets/13063165/b04a7d75-54bb-4ab2-9e30-e76f6f74a2c8" alt="追踪查看器中的时间线视图" width="3598" height="2218" />

### 快照

当启用 [`snapshots`](/dotnet/api/class-tracing#tracing-start-option-snapshots) 选项进行追踪时（默认启用），Playwright 会为每个操作捕获一组完整的 DOM 快照。根据操作类型，它将捕获：

| 类型 | 描述 |
|------|-------------|
|之前|调用操作时的快照。|
|操作|执行输入时的快照。这种类型的快照在探索 Playwright 确切点击位置时特别有用。|
|之后|操作后的快照。|

以下是典型的操作快照的样子：

<img src="https://github.com/microsoft/playwright/assets/13063165/7168d549-eb0a-4964-9c93-483f03711fa9" alt="追踪查看器中的操作标签页" width="3598" height="2218" />

注意它如何同时高亮显示 DOM 节点和确切的点击位置。

### 源代码

当您点击侧边栏中的某个操作时，该操作的代码行将在源代码面板中高亮显示。

<img src="https://github.com/microsoft/playwright/assets/13063165/daa8845d-c250-4923-aa7a-5d040da9adc5" alt="在追踪查看器中显示源代码标签页" width="3598" height="2218" />

### 调用

调用标签页显示有关操作的信息，如所花费的时间、使用的定位器、是否处于严格模式以及使用了哪个键。

<img src="https://github.com/microsoft/playwright/assets/13063165/95498580-f9dd-4932-a123-c37fe7cfc3c2" alt="在追踪查看器中显示调用标签页" width="3598" height="2218" />

### 日志

查看测试的完整日志，以更好地了解 Playwright 在幕后做了什么，如滚动到视图中、等待元素变为可见、启用和稳定，以及执行点击、填充、按键等操作。

<img src="https://github.com/microsoft/playwright/assets/13063165/de621461-3bab-4140-b39d-9f02d6672dbf" alt="在追踪查看器中显示测试日志" width="3598" height="2218" />

### 错误

如果您的测试失败，您将在错误标签页中看到每个测试的错误消息。时间线还会显示一条红线，高亮显示错误发生的位置。您也可以点击源代码标签页查看错误发生在源代码的哪一行。

<img src="https://github.com/microsoft/playwright/assets/13063165/e9ef77b3-05d1-4df2-852c-981023723d34" alt="在追踪查看器中显示错误" width="3598" height="2218" />

### 控制台

查看来自浏览器以及测试的控制台日志。不同的图标会显示控制台日志是来自浏览器还是测试文件。

<img src="https://github.com/microsoft/playwright/assets/13063165/4107c08d-1eaf-421c-bdd4-9dd2aa641d4a" alt="在追踪查看器中显示测试日志" width="3598" height="2218" />

在操作侧边栏中双击测试中的某个操作。这将过滤控制台以仅显示该操作期间产生的日志。点击 *Show all* 按钮再次查看所有控制台日志。

使用时间线通过点击起点并拖动到终点来过滤操作。控制台标签页也将被过滤为仅显示所选操作期间产生的日志。

### 网络

网络标签页显示测试期间发出的所有网络请求。您可以按资产类型和 URL 排序、状态代码、方法、请求、内容类型、持续时间和大小进行排序。点击请求以查看更多信息，如请求标头、响应标头、请求体和响应体。

<img src="https://github.com/microsoft/playwright/assets/13063165/0a3d1671-8ccd-4f7a-a844-35f5eb37f236" alt="追踪查看器中的网络请求标签页" width="3598" height="2218" />

在操作侧边栏中双击测试中的某个操作。这将过滤网络请求以仅显示该操作期间发出的请求。点击 *Show all* 按钮再次查看所有网络请求。

使用时间线通过点击起点并拖动到终点来过滤操作。网络标签页也将被过滤为仅显示所选操作期间发出的网络请求。

### 元数据

在操作标签页旁边，您会找到元数据标签页，它将显示有关测试的更多信息，如浏览器、视口大小、测试持续时间等。

<img src="https://github.com/microsoft/playwright/assets/13063165/82ab3d33-1ec9-4b8a-9cf2-30a6e2d59091" alt="追踪查看器中的元数据" width="3598" height="2218" />
