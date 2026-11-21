---
title: "WebView2"
---

# WebView2

## 简介

以下将解释如何将 Playwright 与 [Microsoft Edge WebView2](https://docs.microsoft.com/en-us/microsoft-edge/webview2/) 一起使用。WebView2 是一个 WinForms 控件，它在底层使用 Microsoft Edge 来呈现 Web 内容。它是 Microsoft Edge 浏览器的一部分，可在 Windows 10 和 Windows 11 上使用。Playwright 可用于自动化 WebView2 应用程序，并可用于测试 WebView2 中的 Web 内容。为了连接到 WebView2，Playwright 使用 [`BrowserType.ConnectOverCDPAsync()`](/dotnet/api/class-browsertype#browser-type-connect-over-cdp) 通过 Chrome DevTools 协议（CDP）连接到它。

## 概述

可以通过设置 `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` 环境变量为 `--remote-debugging-port=9222` 或调用带有 `--remote-debugging-port=9222` 参数的 [EnsureCoreWebView2Async](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22) 来指示 WebView2 控件监听传入的 CDP 连接。这将启动启用了 Chrome DevTools 协议的 WebView2 进程，从而允许 Playwright 进行自动化。在此示例中 9222 是一个示例端口，但也可以使用任何其他未使用的端口。

```csharp
await this.webView.EnsureCoreWebView2Async(await CoreWebView2Environment.CreateAsync(null, null, new CoreWebView2EnvironmentOptions()
{
  AdditionalBrowserArguments = "--remote-debugging-port=9222",
})).ConfigureAwait(false);
```

一旦您的带有 WebView2 控件的应用程序运行起来，您就可以通过 Playwright 连接到它：

```csharp
var browser = await playwright.Chromium.ConnectOverCDPAsync("http://localhost:9222");
var context = browser.Contexts[0];
var page = context.Pages[0];
```

为确保 WebView2 控件已准备就绪，您可以等待 [`CoreWebView2InitializationCompleted`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.corewebview2initializationcompleted?view=webview2-dotnet-1.0.1343.22) 事件：

```csharp
this.webView.CoreWebView2InitializationCompleted += (_, e) =>
{
    if (e.IsSuccess)
    {
        Console.WriteLine("WebView2 initialized");
    }
};
```

## 编写和运行测试

默认情况下，WebView2 控件将对所有实例使用相同的用户数据目录。这意味着如果您并行运行多个测试，它们将相互干扰。为避免这种情况，您应该为每个测试设置 `WEBVIEW2_USER_DATA_FOLDER` 环境变量（或使用 [WebView2.EnsureCoreWebView2Async 方法](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22)）指向不同的文件夹。这将确保每个测试在其自己的用户数据目录中运行。

使用以下方法，Playwright 将作为子进程运行您的 WebView2 应用程序，为其分配唯一的用户数据目录，并将 [Page](/dotnet/api/class-page) 实例提供给您的测试：

### 测试基类

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="mstest">

::: code-group

```csharp [WebView2Test.cs]
using System.Diagnostics;
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

public class WebView2Test : PlaywrightTest
{
    public IBrowser Browser { get; internal set; } = null!;
    public IBrowserContext Context { get; internal set; } = null!;
    public IPage Page { get; internal set; } = null!;
    private Process? _webView2Process = null;
    private string _userDataDir = null!;
    private string _executablePath = Path.Join(Directory.GetCurrentDirectory(), @"..\..\..\..\webview2-app\bin\Debug\net8.0-windows\webview2.exe");

    [TestInitialize]
    public async Task BrowserTestInitialize()
    {
        var cdpPort = 10000 + WorkerIndex;
        Assert.IsTrue(File.Exists(_executablePath), "Make sure that the executable exists");
        _userDataDir = Path.Join(Path.GetTempPath(), $"playwright-webview2-tests/user-data-dir-{WorkerIndex}");
        // WebView2 在关闭时会进行一些延迟清理，所以我们不能在每次测试后清理它
        if (Directory.Exists(_userDataDir))
        {
            Directory.Delete(_userDataDir, true);
        }
        _webView2Process = Process.Start(new ProcessStartInfo(_executablePath)
        {
            EnvironmentVariables =
        {
            ["WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS"] = $"--remote-debugging-port={cdpPort}",
            ["WEBVIEW2_USER_DATA_FOLDER"] = _userDataDir,
        },
            RedirectStandardOutput = true,
        });
        while (!_webView2Process!.HasExited)
        {
            var output = await _webView2Process!.StandardOutput.ReadLineAsync();
            if (_webView2Process!.HasExited)
            {
                throw new Exception("WebView2 process exited unexpectedly");
            }
            if (output != null && output.Contains("WebView2 initialized"))
            {
                break;
            }
        }
        var cdpAddress = $"http://127.0.0.1:{cdpPort}";
        Browser = await Playwright.Chromium.ConnectOverCDPAsync(cdpAddress);
        Context = Browser.Contexts[0];
        Page = Context.Pages[0];
    }

    [TestCleanup]
    public async Task BrowserTestCleanup()
    {
        _webView2Process!.Kill(true);
        await Browser.CloseAsync();
    }
}
```

:::

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class ExampleTest : WebView2Test
{
    [TestMethod]
    public async Task HomepageHasPlaywrightInTitleAndGetStartedLinkLinkingtoTheIntroPage()
    {
        await Page.GotoAsync("https://playwright.dev");
        var getStarted = Page.GetByText("Get Started");
        await Expect(getStarted).ToBeVisibleAsync();
    }
}
```

:::

</TabItem>

<TabItem value="nunit">

::: code-group

```csharp [WebView2Test.cs]
using System.Diagnostics;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests;

public class WebView2Test : PlaywrightTest
{
    public IBrowser Browser { get; internal set; } = null!;
    public IBrowserContext Context { get; internal set; } = null!;
    public IPage Page { get; internal set; } = null!;
    private Process? _webView2Process = null;
    private string _userDataDir = null!;
    private string _executablePath = Path.Join(Directory.GetCurrentDirectory(), @"..\..\..\..\webview2-app\bin\Debug\net8.0-windows\webview2.exe");

    [SetUp]
    public async Task BrowserTestSetUp()
    {
        var cdpPort = 10000 + WorkerIndex;
        Assert.That(File.Exists(_executablePath), Is.True, "Make sure that the executable exists");
        _userDataDir = Path.Join(Path.GetTempPath(), $"playwright-webview2-tests/user-data-dir-{WorkerIndex}");
        // WebView2 在关闭时会进行一些延迟清理，所以我们不能在每次测试后清理它
        if (Directory.Exists(_userDataDir))
        {
            Directory.Delete(_userDataDir, true);
        }
        _webView2Process = Process.Start(new ProcessStartInfo(_executablePath)
        {
            EnvironmentVariables =
        {
            ["WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS"] = $"--remote-debugging-port={cdpPort}",
            ["WEBVIEW2_USER_DATA_FOLDER"] = _userDataDir,
        },
            RedirectStandardOutput = true,
        });
        while (!_webView2Process!.HasExited)
        {
            var output = await _webView2Process!.StandardOutput.ReadLineAsync();
            if (_webView2Process!.HasExited)
            {
                throw new Exception("WebView2 process exited unexpectedly");
            }
            if (output != null && output.Contains("WebView2 initialized"))
            {
                break;
            }
        }
        var cdpAddress = $"http://127.0.0.1:{cdpPort}";
        Browser = await Playwright.Chromium.ConnectOverCDPAsync(cdpAddress);
        Context = Browser.Contexts[0];
        Page = Context.Pages[0];
    }

    [TearDown]
    public async Task BrowserTestTearDown()
    {
        _webView2Process!.Kill(true);
        await Browser.CloseAsync();
    }
}
```

:::

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class ExampleTest : WebView2Test
{
    [Test]
    public async Task HomepageHasPlaywrightInTitleAndGetStartedLinkLinkingtoTheIntroPage()
    {
        await Page.GotoAsync("https://playwright.dev");
        var getStarted = Page.GetByText("Get Started");
        await Expect(getStarted).ToBeVisibleAsync();
    }
}
```

:::

</TabItem>

<TabItem value="xunit">

::: code-group

```csharp [WebView2Test.cs]
using System.Diagnostics;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;

namespace PlaywrightTests;

public class WebView2Test : PlaywrightTest
{
    public IBrowser Browser { get; internal set; } = null!;
    public IBrowserContext Context { get; internal set; } = null!;
    public IPage Page { get; internal set; } = null!;
    private Process? _webView2Process = null;
    private string _userDataDir = null!;
    private string _executablePath = Path.Join(Directory.GetCurrentDirectory(), @"..\..\..\..\webview2-app\bin\Debug\net8.0-windows\webview2.exe");

    public override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        var cdpPort = 10000 + WorkerIndex;
        Assert.True(File.Exists(_executablePath), "Make sure that the executable exists");
        _userDataDir = Path.Join(Path.GetTempPath(), $"playwright-webview2-tests/user-data-dir-{WorkerIndex}");
        // WebView2 在关闭时会进行一些延迟清理，所以我们不能在每次测试后清理它
        if (Directory.Exists(_userDataDir))
        {
            Directory.Delete(_userDataDir, true);
        }
        _webView2Process = Process.Start(new ProcessStartInfo(_executablePath)
        {
            EnvironmentVariables =
        {
            ["WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS"] = $"--remote-debugging-port={cdpPort}",
            ["WEBVIEW2_USER_DATA_FOLDER"] = _userDataDir,
        },
            RedirectStandardOutput = true,
        });
        while (!_webView2Process!.HasExited)
        {
            var output = await _webView2Process!.StandardOutput.ReadLineAsync();
            if (_webView2Process!.HasExited)
            {
                throw new Exception("WebView2 process exited unexpectedly");
            }
            if (output != null && output.Contains("WebView2 initialized"))
            {
                break;
            }
        }
        var cdpAddress = $"http://127.0.0.1:{cdpPort}";
        Browser = await Playwright.Chromium.ConnectOverCDPAsync(cdpAddress);
        Context = Browser.Contexts[0];
        Page = Context.Pages[0];
    }

    public override async Task DisposeAsync()
    {
        _webView2Process!.Kill(true);
        await Browser.CloseAsync();
        await base.DisposeAsync();
    }
}
```

:::

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;

namespace PlaywrightTests;

public class ExampleTest : WebView2Test
{
    [Fact]
    public async Task HomepageHasPlaywrightInTitleAndGetStartedLinkLinkingtoTheIntroPage()
    {
        await Page.GotoAsync("https://playwright.dev");
        var getStarted = Page.GetByText("Get Started");
        await Expect(getStarted).ToBeVisibleAsync();
    }
}
```

:::

</TabItem>

<TabItem value="xunit-v3">

::: code-group

```csharp [WebView2Test.cs]
using System.Diagnostics;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;

namespace PlaywrightTests;

public class WebView2Test : PlaywrightTest
{
    public IBrowser Browser { get; internal set; } = null!;
    public IBrowserContext Context { get; internal set; } = null!;
    public IPage Page { get; internal set; } = null!;
    private Process? _webView2Process = null;
    private string _userDataDir = null!;
    private string _executablePath = Path.Join(Directory.GetCurrentDirectory(), @"..\..\..\..\webview2-app\bin\Debug\net8.0-windows\webview2.exe");

    public override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        var cdpPort = 10000 + WorkerIndex;
        Assert.True(File.Exists(_executablePath), "Make sure that the executable exists");
        _userDataDir = Path.Join(Path.GetTempPath(), $"playwright-webview2-tests/user-data-dir-{WorkerIndex}");
        // WebView2 在关闭时会进行一些延迟清理，所以我们不能在每次测试后清理它
        if (Directory.Exists(_userDataDir))
        {
            Directory.Delete(_userDataDir, true);
        }
        _webView2Process = Process.Start(new ProcessStartInfo(_executablePath)
        {
            EnvironmentVariables =
        {
            ["WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS"] = $"--remote-debugging-port={cdpPort}",
            ["WEBVIEW2_USER_DATA_FOLDER"] = _userDataDir,
        },
            RedirectStandardOutput = true,
        });
        while (!_webView2Process!.HasExited)
        {
            var output = await _webView2Process!.StandardOutput.ReadLineAsync();
            if (_webView2Process!.HasExited)
            {
                throw new Exception("WebView2 process exited unexpectedly");
            }
            if (output != null && output.Contains("WebView2 initialized"))
            {
                break;
            }
        }
        var cdpAddress = $"http://127.0.0.1:{cdpPort}";
        Browser = await Playwright.Chromium.ConnectOverCDPAsync(cdpAddress);
        Context = Browser.Contexts[0];
        Page = Context.Pages[0];
    }

    public override async Task DisposeAsync()
    {
        _webView2Process!.Kill(true);
        await Browser.CloseAsync();
        await base.DisposeAsync();
    }
}
```

:::

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;

namespace PlaywrightTests;

public class ExampleTest : WebView2Test
{
    [Fact]
    public async Task HomepageHasPlaywrightInTitleAndGetStartedLinkLinkingtoTheIntroPage()
    {
        await Page.GotoAsync("https://playwright.dev");
        var getStarted = Page.GetByText("Get Started");
        await Expect(getStarted).ToBeVisibleAsync();
    }
}
```

:::

</TabItem>

</Tabs>

## 调试

在您的 WebView2 控件内，您可以右键单击打开上下文菜单并选择"检查"来打开 DevTools，或按 <kbd>F12</kbd>。您也可以使用 [WebView2.CoreWebView2.OpenDevToolsWindow](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.opendevtoolswindow?view=webview2-dotnet-1.0.1462.37) 方法以编程方式打开 DevTools。

有关调试测试，请参阅 Playwright [调试指南](./debug)。
