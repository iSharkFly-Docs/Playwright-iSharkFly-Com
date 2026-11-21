---
title: "Writing tests"
---

# Writing tests

## Introduction

Playwright tests are simple, they
- **perform actions**, and
- **assert the state** against expectations.

There is no need to wait for anything prior to performing an action: Playwright
automatically waits for the wide range of [actionability](./actionability.md)
checks to pass prior to performing each action.

There is also no need to deal with the race conditions when performing the checks -
Playwright assertions are designed in a way that they describe the expectations
that need to be eventually met.

That's it! These design choices allow Playwright users to forget about flaky
timeouts and racy checks in their tests altogether.

**You will learn**
- [How to write the first test](/writing-tests.md#first-test)
- [How to perform actions](/writing-tests.md#actions)
- [How to use assertions](/writing-tests.md#assertions)
- [How tests run in isolation](/writing-tests.md#test-isolation)
- [How to use test hooks](/writing-tests.md#using-test-hooks)

## First test

Take a look at the following example to see how to write a test.

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

        // Expect a title "to contain" a substring.
        await Expect(Page).ToHaveTitleAsync(new Regex("Playwright"));
    }

    [Test]
    public async Task GetStartedLink()
    {
        await Page.GotoAsync("https://playwright.dev");

        // Click the get started link.
        await Page.GetByRole(AriaRole.Link, new() { Name = "Get started" }).ClickAsync();

        // Expects page to have a heading with the name of Installation.
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

        // Expect a title "to contain" a substring.
        await Expect(Page).ToHaveTitleAsync(new Regex("Playwright"));
    }

    [TestMethod]
    public async Task GetStartedLink()
    {
        await Page.GotoAsync("https://playwright.dev");

        // Click the get started link.
        await Page.GetByRole(AriaRole.Link, new() { Name = "Get started" }).ClickAsync();

        // Expects page to have a heading with the name of Installation.
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

        // Expect a title "to contain" a substring.
        await Expect(Page).ToHaveTitleAsync(new Regex("Playwright"));
    }

    [Fact]
    public async Task GetStartedLink()
    {
        await Page.GotoAsync("https://playwright.dev");

        // Click the get started link.
        await Page.GetByRole(AriaRole.Link, new() { Name = "Get started" }).ClickAsync();

        // Expects page to have a heading with the name of Installation.
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

        // Expect a title "to contain" a substring.
        await Expect(Page).ToHaveTitleAsync(new Regex("Playwright"));
    }

    [Fact]
    public async Task GetStartedLink()
    {
        await Page.GotoAsync("https://playwright.dev");

        // Click the get started link.
        await Page.GetByRole(AriaRole.Link, new() { Name = "Get started" }).ClickAsync();

        // Expects page to have a heading with the name of Installation.
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Installation" })).ToBeVisibleAsync();
    } 
}
```

:::

</TabItem>

</Tabs>

## Actions

### Navigation

Most of the tests will start by navigating the page to a URL. After that, the test
will be able to interact with the page elements.

```csharp
await Page.GotoAsync("https://playwright.dev");
```

Playwright will wait for the page to reach the load state prior to moving forward.
Learn more about the [`Page.GotoAsync()`](/dotnet/api/class-page#page-goto) options.

### Interactions

Performing actions starts with locating the elements. Playwright uses [Locators API](./locators.md) for that. Locators represent a way to find element(s) on the page at any moment, learn more about the [different types](./locators.md) of locators available. Playwright will wait for the element to be [actionable](./actionability.md) prior to performing the action, so there is no need to wait for it to become available.

```csharp
// Create a locator.
var getStarted = Page.GetByRole(AriaRole.Link, new() { Name = "Get started" });

// Click it.
await getStarted.ClickAsync();
```

In most cases, it'll be written in one line:

```csharp
await Page.GetByRole(AriaRole.Link, new() { Name = "Get started" }).ClickAsync();
```

### Basic actions

This is the list of the most popular Playwright actions. Note that there are many more, so make sure to check the [Locator API](./api/class-locator.md) section to
learn more about them.

| Action | Description |
| :- | :- |
| [`Locator.CheckAsync()`](/dotnet/api/class-locator#locator-check) | Check the input checkbox |
| [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) | Click the element |
| [`Locator.UncheckAsync()`](/dotnet/api/class-locator#locator-uncheck) | Uncheck the input checkbox |
| [`Locator.HoverAsync()`](/dotnet/api/class-locator#locator-hover) | Hover mouse over the element |
| [`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill) | Fill the form field, input text |
| [`Locator.FocusAsync()`](/dotnet/api/class-locator#locator-focus) | Focus the element |
| [`Locator.PressAsync()`](/dotnet/api/class-locator#locator-press) | Press single key |
| [`Locator.SetInputFilesAsync()`](/dotnet/api/class-locator#locator-set-input-files) | Pick files to upload |
| [`Locator.SelectOptionAsync()`](/dotnet/api/class-locator#locator-select-option) | Select option in the drop down |

## Assertions

Playwright provides an async function called [Expect](./test-assertions) to assert and wait until the expected condition is met.

```csharp
await Expect(Page).ToHaveTitleAsync(new Regex("Playwright"));
```

Here is the list of the most popular async assertions. Note that there are [many more](./test-assertions.md) to get familiar with:

| Assertion | Description |
| :- | :- |
| [`LocatorAssertions.ToBeCheckedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-checked) | Checkbox is checked |
| [`LocatorAssertions.ToBeEnabledAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-enabled) | Control is enabled |
| [`LocatorAssertions.ToBeVisibleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-visible) | Element is visible |
| [`LocatorAssertions.ToContainTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-contain-text) | Element contains text |
| [`LocatorAssertions.ToHaveAttributeAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-attribute) | Element has attribute |
| [`LocatorAssertions.ToHaveCountAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-count) | List of elements has given length |
| [`LocatorAssertions.ToHaveTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text) | Element matches text |
| [`LocatorAssertions.ToHaveValueAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-value) | Input element has value |
| [`PageAssertions.ToHaveTitleAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-have-title) | Page has title |
| [`PageAssertions.ToHaveURLAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-have-url) | Page has URL |

## Test Isolation

The Playwright NUnit, MSTest, xUnit, and xUnit v3 test framework base classes will isolate each test from each other by providing a separate `Page` instance. Pages are isolated between tests due to the Browser Context, which is equivalent to a brand new browser profile, where every test gets a fresh environment, even when multiple tests run in a single Browser.

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

## Using Test Hooks

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

You can use `SetUp`/`TearDown` to prepare and clean up your test environment:

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
        // Assertions use the expect API.
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

You can use `TestInitialize`/`TestCleanup` to prepare and clean up your test environment:

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
        // Assertions use the expect API.
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

You can use `InitializeAsync`/`DisposeAsync` to prepare and clean up your test environment:

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
        // Assertions use the expect API.
        await Expect(Page).ToHaveURLAsync("https://playwright.dev/");
    }

    override public async Task InitializeAsync()
    {
        await base.InitializeAsync();
        await Page.GotoAsync("https://playwright.dev");
    }

    public override async Task DisposeAsync()
    {
        Console.WriteLine("After each test cleanup");
        await base.DisposeAsync();
    }
}
```

:::

</TabItem>

<TabItem value="xunit-v3">

You can use `InitializeAsync`/`DisposeAsync` to prepare and clean up your test environment:

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
        // Assertions use the expect API.
        await Expect(Page).ToHaveURLAsync("https://playwright.dev/");
    }

    override public async Task InitializeAsync()
    {
        await base.InitializeAsync();
        await Page.GotoAsync("https://playwright.dev");
    }

    public override async Task DisposeAsync()
    {
        Console.WriteLine("After each test cleanup");
        await base.DisposeAsync();
    }
}
```

:::

</TabItem>

</Tabs>

## What's Next
- [Run single test, multiple tests, headed mode](./running-tests.md)
- [Generate tests with Codegen](./codegen-intro.md)
- [See a trace of your tests](./trace-viewer-intro.md)
- [Run tests on CI](./ci-intro.md)
- [Learn more about the MSTest, NUnit, xUnit, or xUnit v3 base classes](./test-runners.md)
