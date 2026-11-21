---
title: "安装"
---

# 安装

## 简介

Playwright 专门为满足端到端测试的需求而创建。Playwright 支持所有现代渲染引擎，包括 Chromium、WebKit 和 Firefox。可在 Windows、Linux 和 macOS 上进行测试，支持本地或 CI 环境，支持无头模式或有头模式，并具备原生移动设备模拟功能。

你可以选择使用 Playwright 提供的 MSTest、NUnit 或 xUnit [基类](./test-runners.md)来编写端到端测试。这些基类支持在多个浏览器引擎上运行测试、并行化测试、调整启动/上下文选项，并为每个测试开箱即用地提供 [Page](/dotnet/api/class-page)/[BrowserContext](/dotnet/api/class-browsercontext) 实例。或者，你也可以使用[库](./library.md)手动编写测试基础设施。

1. 首先使用 `dotnet new` 创建一个新项目。这将创建 `PlaywrightTests` 目录，其中包含一个 `UnitTest1.cs` 文件：

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

```bash
dotnet new nunit -n PlaywrightTests
cd PlaywrightTests
```

</TabItem>

<TabItem value="mstest">

```bash
dotnet new mstest -n PlaywrightTests
cd PlaywrightTests
```

</TabItem>

<TabItem value="xunit">

```bash
dotnet new xunit -n PlaywrightTests
cd PlaywrightTests
```

</TabItem>

<TabItem value="xunit-v3">

```bash
dotnet new xunit3 -n PlaywrightTests
cd PlaywrightTests
```

</TabItem>

</Tabs>

2. 安装必要的 Playwright 依赖项：

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

```bash
dotnet add package Microsoft.Playwright.NUnit
```

</TabItem>

<TabItem value="mstest">

```bash
dotnet add package Microsoft.Playwright.MSTest
```

</TabItem>

<TabItem value="xunit">

```bash
dotnet add package Microsoft.Playwright.Xunit
```

</TabItem>

<TabItem value="xunit-v3">

```bash
dotnet add package Microsoft.Playwright.Xunit.v3
```

</TabItem>

</Tabs>

3. 构建项目，使 `playwright.ps1` 在 `bin` 目录中可用：

```bash
dotnet build
```
4. 安装所需的浏览器。此示例使用 `net8.0`，如果你使用的是不同版本的 .NET，需要调整命令并将 `net8.0` 更改为你的版本。

```bash
pwsh bin/Debug/net8.0/playwright.ps1 install
```

如果 `pwsh` 不可用，你需要[安装 PowerShell](https://docs.microsoft.com/powershell/scripting/install/installing-powershell)。

## 添加示例测试

使用以下代码编辑 `UnitTest1.cs` 文件，创建一个示例端到端测试：

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

::: code-group

```csharp [UnitTest1.cs]
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class ExampleTest : PageTest
{
    [Test]
    public async Task HasTitle()
    {
        await Page.GotoAsync("https://playwright.dev");

        // 期望标题"包含"某个子字符串。
        await Expect(Page).ToHaveTitleAsync(new Regex("Playwright"));
    }

    [Test]
    public async Task GetStartedLink()
    {
        await Page.GotoAsync("https://playwright.dev");

        // 点击"开始使用"链接。
        await Page.GetByRole(AriaRole.Link, new() { Name = "Get started" }).ClickAsync();

        // 期望页面有一个名为 Installation 的标题。
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Installation" })).ToBeVisibleAsync();
    } 
}
```

:::

</TabItem>

<TabItem value="mstest">

::: code-group

```csharp [UnitTest1.cs]
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class ExampleTest : PageTest
{
    [TestMethod]
    public async Task HasTitle()
    {
        await Page.GotoAsync("https://playwright.dev");

        // 期望标题"包含"某个子字符串。
        await Expect(Page).ToHaveTitleAsync(new Regex("Playwright"));
    }

    [TestMethod]
    public async Task GetStartedLink()
    {
        await Page.GotoAsync("https://playwright.dev");

        // 点击"开始使用"链接。
        await Page.GetByRole(AriaRole.Link, new() { Name = "Get started" }).ClickAsync();

        // 期望页面有一个名为 Installation 的标题。
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Installation" })).ToBeVisibleAsync();
    } 
}
```

:::

</TabItem>

<TabItem value="xunit">

::: code-group

```csharp [UnitTest1.cs]
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;

namespace PlaywrightTests;

public class UnitTest1: PageTest
{
    [Fact]
    public async Task HasTitle()
    {
        await Page.GotoAsync("https://playwright.dev");

        // 期望标题"包含"某个子字符串。
        await Expect(Page).ToHaveTitleAsync(new Regex("Playwright"));
    }

    [Fact]
    public async Task GetStartedLink()
    {
        await Page.GotoAsync("https://playwright.dev");

        // 点击"开始使用"链接。
        await Page.GetByRole(AriaRole.Link, new() { Name = "Get started" }).ClickAsync();

        // 期望页面有一个名为 Installation 的标题。
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Installation" })).ToBeVisibleAsync();
    } 
}
```

:::

</TabItem>

<TabItem value="xunit-v3">

::: code-group

```csharp [UnitTest1.cs]
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;

namespace PlaywrightTests;

public class UnitTest1: PageTest
{
    [Fact]
    public async Task HasTitle()
    {
        await Page.GotoAsync("https://playwright.dev");

        // 期望标题"包含"某个子字符串。
        await Expect(Page).ToHaveTitleAsync(new Regex("Playwright"));
    }

    [Fact]
    public async Task GetStartedLink()
    {
        await Page.GotoAsync("https://playwright.dev");

        // 点击"开始使用"链接。
        await Page.GetByRole(AriaRole.Link, new() { Name = "Get started" }).ClickAsync();

        // 期望页面有一个名为 Installation 的标题。
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Installation" })).ToBeVisibleAsync();
    } 
}
```

:::

</TabItem>

</Tabs>

## 运行示例测试

默认情况下，测试将在 Chromium 上运行。这可以通过 `BROWSER` 环境变量进行配置，或通过调整[启动配置选项](./running-tests.md)来设置。测试以无头模式运行，这意味着运行测试时不会打开浏览器窗口。测试结果和测试日志将显示在终端中。

```bash
dotnet test
```

请参阅我们关于[运行和调试测试](./running-tests.md)的文档，了解更多关于以有头模式运行测试、运行多个测试、运行特定配置等内容。

## 系统要求
- Playwright 作为 .NET Standard 2.0 库发布。我们推荐使用 .NET 8。
- Windows 11+、Windows Server 2019+ 或 Windows 子系统 Linux (WSL)。
- macOS 14 (Sonoma) 或更高版本。
- Debian 12 / 13、Ubuntu 22.04 / 24.04 / 26.04（x86-64 或 arm64）。

## 下一步
- [使用 Web 优先断言、页面固定装置和定位器编写测试](./writing-tests.md)
- [运行单个测试、多个测试、有头模式](./running-tests.md)
- [使用 Codegen 生成测试](./codegen-intro.md)
- [查看测试的跟踪](./trace-viewer-intro.md)
- [在 CI 上运行测试](./ci-intro.md)
- [了解更多关于 MSTest、NUnit、xUnit 和 xUnit v3 基类的信息](./test-runners.md)
