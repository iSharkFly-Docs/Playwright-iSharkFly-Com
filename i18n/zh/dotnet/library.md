---
title: "入门指南 - 库"
---

# 入门指南 - 库

## 简介

Playwright 可以与 [MSTest、NUnit、xUnit 或 xUnit v3 基类](./test-runners.md)一起使用，也可以作为 Playwright 库使用（本指南）。如果你正在开发一个利用 Playwright 功能的应用程序，或者你正在将 Playwright 与另一个测试运行器一起使用，请继续阅读。

## 使用方法

创建一个控制台项目并添加 Playwright 依赖。

```bash
# 创建项目
dotnet new console -n PlaywrightDemo
cd PlaywrightDemo

# 添加项目依赖
dotnet add package Microsoft.Playwright
# 构建项目
dotnet build
# 安装所需的浏览器 - 将 netX 替换为实际的输出文件夹名称，例如 net8.0。
pwsh bin/Debug/netX/playwright.ps1 install

# 如果 pwsh 命令不起作用（抛出 TypeNotFound），请确保使用最新版本的 PowerShell。
dotnet tool update --global PowerShell
```

创建一个 `Program.cs`，它将导航到 `https://playwright.dev/dotnet` 并在 Chromium 中截取屏幕截图。

```csharp
using Microsoft.Playwright;

using var playwright = await Playwright.CreateAsync();
await using var browser = await playwright.Chromium.LaunchAsync();
var page = await browser.NewPageAsync();
await page.GotoAsync("https://playwright.dev/dotnet");
await page.ScreenshotAsync(new()
{
    Path = "screenshot.png"
});
```

现在运行它。

```bash
dotnet run
```

默认情况下，Playwright 以无头模式运行浏览器。要查看浏览器 UI，将 [`headless`](/dotnet/api/class-browsertype#browser-type-launch-option-headless) 选项设置为 `false`。你还可以使用 [`slowMo`](/dotnet/api/class-browsertype#browser-type-launch-option-slow-mo) 来减慢执行速度。在[调试工具](./debug.md)部分了解更多信息。

```csharp
await using var browser = await playwright.Firefox.LaunchAsync(new()
{
    Headless = false,
    SlowMo = 50,
});
```

## 使用断言

当你使用自己的测试框架时，你可以执行以下操作来利用 Playwright 的 Web 优先断言。这些断言将自动重试，直到满足条件，例如元素具有某个文本或达到超时：

```csharp
using Microsoft.Playwright;
using static Microsoft.Playwright.Assertions;

// 如果你想更改默认的 5 秒超时。
SetDefaultExpectTimeout(10_000);

using var playwright = await Playwright.CreateAsync();
await using var browser = await playwright.Chromium.LaunchAsync();
var page = await browser.NewPageAsync();
await page.GotoAsync("https://playwright.dev/dotnet");
await Expect(page.GetByRole(AriaRole.Link, new() { Name = "Get started" })).ToBeVisibleAsync();
```

## 为不同平台打包驱动程序

默认情况下，Playwright 只为 .NET 发布目标运行时打包驱动程序。如果你想为其他平台打包，可以在项目文件中使用 `all`、`none` 或 `linux`、`win`、`osx` 来覆盖此行为。

```xml
<PropertyGroup>
  <PlaywrightPlatform>all</PlaywrightPlatform>
</PropertyGroup>
```

或者：

```xml
<PropertyGroup>
  <PlaywrightPlatform>osx;linux</PlaywrightPlatform>
</PropertyGroup>
```
