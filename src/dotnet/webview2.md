---
title: "WebView2"
---

# WebView2

## Introduction

The following will explain how to use Playwright with [Microsoft Edge WebView2](https://docs.microsoft.com/en-us/microsoft-edge/webview2/). WebView2 is a WinForms control, which will use Microsoft Edge under the hood to render web content. It is a part of the Microsoft Edge browser and is available on Windows 10 and Windows 11. Playwright can be used to automate WebView2 applications and can be used to test web content in WebView2. For connecting to WebView2, Playwright uses [`BrowserType.ConnectOverCDPAsync()`](/dotnet/api/class-browsertype#browser-type-connect-over-cdp) which connects to it via the Chrome DevTools Protocol (CDP).

## Overview

A WebView2 control can be instructed to listen to incoming CDP connections by setting either the `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` environment variable with `--remote-debugging-port=9222` or calling [EnsureCoreWebView2Async](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22) with the `--remote-debugging-port=9222` argument. This will start the WebView2 process with the Chrome DevTools Protocol enabled which allows the automation by Playwright. 9222 is an example port in this case, but any other unused port can be used as well.

```csharp
await this.webView.EnsureCoreWebView2Async(await CoreWebView2Environment.CreateAsync(null, null, new CoreWebView2EnvironmentOptions()
{
  AdditionalBrowserArguments = "--remote-debugging-port=9222",
})).ConfigureAwait(false);
```

Once your application with the WebView2 control is running, you can connect to it via Playwright:

```csharp
var browser = await playwright.Chromium.ConnectOverCDPAsync("http://localhost:9222");
var context = browser.Contexts[0];
var page = context.Pages[0];
```

To ensure that the WebView2 control is ready, you can wait for the [`CoreWebView2InitializationCompleted`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.corewebview2initializationcompleted?view=webview2-dotnet-1.0.1343.22) event:

```csharp
this.webView.CoreWebView2InitializationCompleted += (_, e) =>
{
    if (e.IsSuccess)
    {
        Console.WriteLine("WebView2 initialized");
    }
};
```

## Writing and running tests

By default, the WebView2 control will use the same user data directory for all instances. This means that if you run multiple tests in parallel, they will interfere with each other. To avoid this, you should set the `WEBVIEW2_USER_DATA_FOLDER` environment variable (or use [WebView2.EnsureCoreWebView2Async Method](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22)) to a different folder for each test. This will make sure that each test runs in its own user data directory.

Using the following, Playwright will run your WebView2 application as a sub-process, assign a unique user data directory to it and provide the [Page](/dotnet/api/class-page) instance to your test:

### Test base class

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
        // WebView2 does some lazy cleanups on shutdown so we can't clean it up after each test
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
        // WebView2 does some lazy cleanups on shutdown so we can't clean it up after each test
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
        // WebView2 does some lazy cleanups on shutdown so we can't clean it up after each test
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
        // WebView2 does some lazy cleanups on shutdown so we can't clean it up after each test
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

## Debugging

Inside your webview2 control, you can just right-click to open the context menu and select "Inspect" to open the DevTools or press <kbd>F12</kbd>. You can also use the [WebView2.CoreWebView2.OpenDevToolsWindow](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.opendevtoolswindow?view=webview2-dotnet-1.0.1462.37) method to open the DevTools programmatically.

For debugging tests, see the Playwright [Debugging guide](./debug).
