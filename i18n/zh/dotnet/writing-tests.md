---
title: "编写测试"
---

# 编写测试

## 简介

Playwright 测试很简单，它们
- **执行操作**，并且
- **根据预期断言状态**。

在执行操作之前无需等待任何内容：Playwright 会在执行每个操作之前自动等待各种[可操作性](./actionability.md)检查通过。

在执行检查时也无需处理竞态条件 - Playwright 断言的设计方式使它们能够描述最终需要满足的预期。

就是这样！这些设计选择让 Playwright 用户可以完全不用担心测试中的不稳定超时和竞态检查。

**你将学习**
- [如何编写第一个测试](/writing-tests.md#first-test)
- [如何执行操作](/writing-tests.md#actions)
- [如何使用断言](/writing-tests.md#assertions)
- [测试如何隔离运行](/writing-tests.md#test-isolation)
- [如何使用测试钩子](/writing-tests.md#using-test-hooks)

## 第一个测试

看看下面的示例，了解如何编写测试。

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
using System.Threading.Tasks;
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;
using Microsoft.VisualStudio.TestTools.UnitTesting;

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

## 操作

### 导航

大多数测试将从导航页面到某个 URL 开始。之后，测试将能够与页面元素进行交互。

```csharp
await Page.GotoAsync("https://playwright.dev");
```

Playwright 会等待页面达到加载状态后再继续执行。了解更多关于 [`Page.GotoAsync()`](/dotnet/api/class-page#page-goto) 选项的信息。

### 交互

执行操作从定位元素开始。Playwright 使用 [Locators API](./locators.md) 来实现这一点。定位器代表一种在任何时刻在页面上查找元素的方式，了解更多关于可用的[不同类型](./locators.md)定位器。Playwright 会在执行操作之前等待元素变为[可操作](./actionability.md)状态，因此无需等待它变得可用。

```csharp
// 创建一个定位器。
var getStarted = Page.GetByRole(AriaRole.Link, new() { Name = "Get started" });

// 点击它。
await getStarted.ClickAsync();
```

在大多数情况下，可以写成一行：

```csharp
await Page.GetByRole(AriaRole.Link, new() { Name = "Get started" }).ClickAsync();
```

### 基本操作

这是最常用的 Playwright 操作列表。请注意还有更多操作，请务必查看 [Locator API](./api/class-locator.md) 部分以了解更多。

| 操作 | 描述 |
| :- | :- |
| [`Locator.CheckAsync()`](/dotnet/api/class-locator#locator-check) | 勾选输入复选框 |
| [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) | 点击元素 |
| [`Locator.UncheckAsync()`](/dotnet/api/class-locator#locator-uncheck) | 取消勾选输入复选框 |
| [`Locator.HoverAsync()`](/dotnet/api/class-locator#locator-hover) | 将鼠标悬停在元素上 |
| [`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill) | 填写表单字段，输入文本 |
| [`Locator.FocusAsync()`](/dotnet/api/class-locator#locator-focus) | 聚焦元素 |
| [`Locator.PressAsync()`](/dotnet/api/class-locator#locator-press) | 按下单个按键 |
| [`Locator.SetInputFilesAsync()`](/dotnet/api/class-locator#locator-set-input-files) | 选择要上传的文件 |
| [`Locator.SelectOptionAsync()`](/dotnet/api/class-locator#locator-select-option) | 在下拉菜单中选择选项 |

## 断言

Playwright 提供了一个名为 [Expect](./test-assertions) 的异步函数来断言并等待直到满足预期条件。

```csharp
await Expect(Page).ToHaveTitleAsync(new Regex("Playwright"));
```

以下是最常用的异步断言列表。请注意还有[更多](./test-assertions.md)断言需要熟悉：

| 断言 | 描述 |
| :- | :- |
| [`LocatorAssertions.ToBeCheckedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-checked) | 复选框已勾选 |
| [`LocatorAssertions.ToBeEnabledAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-enabled) | 控件已启用 |
| [`LocatorAssertions.ToBeVisibleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-visible) | 元素可见 |
| [`LocatorAssertions.ToContainTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-contain-text) | 元素包含文本 |
| [`LocatorAssertions.ToHaveAttributeAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-attribute) | 元素具有属性 |
| [`LocatorAssertions.ToHaveCountAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-count) | 元素列表具有给定长度 |
| [`LocatorAssertions.ToHaveTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text) | 元素匹配文本 |
| [`LocatorAssertions.ToHaveValueAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-value) | 输入元素具有值 |
| [`PageAssertions.ToHaveTitleAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-have-title) | 页面具有标题 |
| [`PageAssertions.ToHaveURLAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-have-url) | 页面具有 URL |

## 测试隔离

Playwright NUnit、MSTest、xUnit 和 xUnit v3 测试框架基类通过为每个测试提供单独的 `Page` 实例来隔离每个测试。由于浏览器上下文（Browser Context）的存在，页面在测试之间是隔离的，这相当于一个全新的浏览器配置文件，每个测试都获得一个全新的环境，即使多个测试在单个浏览器中运行也是如此。

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

::: code-group

```csharp [UnitTest1.cs]
using System.Threading.Tasks;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class ExampleTest : PageTest
{
    [Test]
    public async Task BasicTest()
    {
        await Page.GotoAsync("https://playwright.dev");
    }
}
```

:::

</TabItem>

<TabItem value="mstest">

::: code-group

```csharp [UnitTest1.cs]
using System.Threading.Tasks;
using Microsoft.Playwright.MSTest;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PlaywrightTests;

[TestClass]
public class ExampleTest : PageTest
{
    [TestMethod]
    public async Task BasicTest()
    {
        await Page.GotoAsync("https://playwright.dev");
    }
}
```

:::

</TabItem>

<TabItem value="xunit">

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;

namespace PlaywrightTests;

public class UnitTest1: PageTest
{
    [Fact]
    public async Task BasicTest()
    {
        await Page.GotoAsync("https://playwright.dev");
    }
}
```

:::

</TabItem>

<TabItem value="xunit-v3">

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;

namespace PlaywrightTests;

public class UnitTest1: PageTest
{
    [Fact]
    public async Task BasicTest()
    {
        await Page.GotoAsync("https://playwright.dev");
    }
}
```

:::

</TabItem>

</Tabs>

## 使用测试钩子

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

你可以使用 `SetUp`/`TearDown` 来准备和清理测试环境：

::: code-group

```csharp [UnitTest1.cs]
using System.Threading.Tasks;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class ExampleTest : PageTest
{
    [Test]
    public async Task MainNavigation()
    {
        // 断言使用 expect API。
        await Expect(Page).ToHaveURLAsync("https://playwright.dev/");
    }

    [SetUp]
    public async Task SetUp()
    {
        await Page.GotoAsync("https://playwright.dev");
    }
}
```

:::

</TabItem>

<TabItem value="mstest">

你可以使用 `TestInitialize`/`TestCleanup` 来准备和清理测试环境：

::: code-group

```csharp [UnitTest1.cs]
using System.Threading.Tasks;
using Microsoft.Playwright.MSTest;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PlaywrightTests;

[TestClass]
public class ExampleTest : PageTest
{
    [TestMethod]
    public async Task MainNavigation()
    {
        // 断言使用 expect API。
        await Expect(Page).ToHaveURLAsync("https://playwright.dev/");
    }

    [TestInitialize]
    public async Task TestInitialize()
    {
        await Page.GotoAsync("https://playwright.dev");
    }
}
```

:::

</TabItem>

<TabItem value="xunit">

你可以使用 `InitializeAsync`/`DisposeAsync` 来准备和清理测试环境：

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;

namespace PlaywrightTests;

public class UnitTest1: PageTest
{
    [Fact]
    public async Task MainNavigation()
    {
        // 断言使用 expect API。
        await Expect(Page).ToHaveURLAsync("https://playwright.dev/");
    }

    override public async Task InitializeAsync()
    {
        await base.InitializeAsync();
        await Page.GotoAsync("https://playwright.dev");
    }

    public override async Task DisposeAsync()
    {
        Console.WriteLine("每个测试之后的清理");
        await base.DisposeAsync();
    }
}
```

:::

</TabItem>

<TabItem value="xunit-v3">

你可以使用 `InitializeAsync`/`DisposeAsync` 来准备和清理测试环境：

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;

namespace PlaywrightTests;

public class UnitTest1: PageTest
{
    [Fact]
    public async Task MainNavigation()
    {
        // 断言使用 expect API。
        await Expect(Page).ToHaveURLAsync("https://playwright.dev/");
    }

    override public async Task InitializeAsync()
    {
        await base.InitializeAsync();
        await Page.GotoAsync("https://playwright.dev");
    }

    public override async Task DisposeAsync()
    {
        Console.WriteLine("每个测试之后的清理");
        await base.DisposeAsync();
    }
}
```

:::

</TabItem>

</Tabs>

## 下一步
- [运行单个测试、多个测试、有头模式](./running-tests.md)
- [使用 Codegen 生成测试](./codegen-intro.md)
- [查看测试的跟踪](./trace-viewer-intro.md)
- [在 CI 上运行测试](./ci-intro.md)
- [了解更多关于 MSTest、NUnit、xUnit 或 xUnit v3 基类的信息](./test-runners.md)
