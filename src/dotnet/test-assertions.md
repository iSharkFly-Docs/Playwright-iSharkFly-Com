---
title: "Assertions"
---

# Assertions

## Introduction

Playwright includes web-specific assertions that automatically retry until the expected condition is met.  Consider the following example:

```csharp
await Expect(Page.GetByTestId("status")).ToHaveTextAsync("Submitted");
```

Playwright will re-test the element with the test ID of `status` until it has the `"Submitted"` text.  It will re-fetch the element and check it repeatedly until the condition is met or the timeout is reached.

By default, the timeout for assertions is 5 seconds.

## Auto-retrying assertions

The following assertions will retry until the assertion passes or the assertion timeout is reached.

| Assertion | Description |
| :- | :- |
| [`LocatorAssertions.ToBeAttachedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-attached) | Element is attached |
| [`LocatorAssertions.ToBeCheckedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-checked) | Checkbox is checked |
| [`LocatorAssertions.ToBeDisabledAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-disabled) | Element is disabled |
| [`LocatorAssertions.ToBeEditableAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-editable) | Element is editable |
| [`LocatorAssertions.ToBeEmptyAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-empty) | Container is empty |
| [`LocatorAssertions.ToBeEnabledAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-enabled) | Element is enabled |
| [`LocatorAssertions.ToBeFocusedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-focused) | Element is focused |
| [`LocatorAssertions.ToBeHiddenAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-hidden) | Element is not visible |
| [`LocatorAssertions.ToBeInViewportAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-in-viewport) | Element intersects viewport |
| [`LocatorAssertions.ToBeVisibleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-visible) | Element is visible |
| [`LocatorAssertions.ToContainClassAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-contain-class) | Element has specified CSS classes |
| [`LocatorAssertions.ToContainTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-contain-text) | Element contains text |
| [`LocatorAssertions.ToHaveAccessibleDescriptionAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-accessible-description) | Element has a matching [accessible description](https://w3c.github.io/accname/#dfn-accessible-description) |
| [`LocatorAssertions.ToHaveAccessibleNameAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-accessible-name) | Element has a matching [accessible name](https://w3c.github.io/accname/#dfn-accessible-name) |
| [`LocatorAssertions.ToHaveAttributeAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-attribute) | Element has a DOM attribute |
| [`LocatorAssertions.ToHaveClassAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-class) | Element has a class property |
| [`LocatorAssertions.ToHaveCountAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-count) | List has exact number of children |
| [`LocatorAssertions.ToHaveCSSAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-css) | Element has CSS property |
| [`LocatorAssertions.ToHaveIdAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-id) | Element has an ID |
| [`LocatorAssertions.ToHaveJSPropertyAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-js-property) | Element has a JavaScript property |
| [`LocatorAssertions.ToHaveRoleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-role) | Element has a specific [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles) |
| [`LocatorAssertions.ToHaveTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text) | Element matches text |
| [`LocatorAssertions.ToHaveValueAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-value) | Input has a value |
| [`LocatorAssertions.ToHaveValuesAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-values) | Select has options selected |
| [`LocatorAssertions.ToMatchAriaSnapshotAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) | Element matches provided Aria snapshot |
| [`PageAssertions.ToHaveTitleAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-have-title) | Page has a title |
| [`PageAssertions.ToHaveURLAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-have-url) | Page has a URL |
| [`ApiResponseAssertions.ToBeOKAsync()`](/dotnet/api/class-apiresponseassertions#api-response-assertions-to-be-ok) | Response has an OK status |

## Expect.ToPassAsync

Prefer auto-retrying assertions whenever possible. For more complex checks, retry a block of code until it passes with [`FunctionAssertions.ToPassAsync()`](/dotnet/api/class-functionassertions#function-assertions-to-pass).

```csharp
await Expect(async () =>
{
    var response = await Page.APIRequest.GetAsync("https://api.example.com");
    Assert.AreEqual(200, response.Status);
}).ToPassAsync();
```

You can also specify custom timeout and retry intervals:

```csharp
await Expect(async () =>
{
    var response = await Page.APIRequest.GetAsync("https://api.example.com");
    Assert.AreEqual(200, response.Status);
}).ToPassAsync(new()
{
    // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe
    // ... Defaults to [100, 250, 500, 1000].
    Intervals = [1_000, 2_000, 10_000],
    Timeout = 60_000,
});
```

By default, `ToPassAsync` retries for 30 seconds. `SetDefaultExpectTimeout` does not change this timeout, use `SetDefaultExpectToPassTimeout` instead:

```csharp
SetDefaultExpectToPassTimeout(60_000);
```

## Custom Expect Message

You can specify a custom expect message as a second argument to the `expect` function, for example:

```csharp
await Expect(Page.GetByText("Name"), "should be logged in").ToBeVisibleAsync();
```

When expect fails, the error would look like this:

```bash
Microsoft.Playwright.PlaywrightAssertionException : should be logged in

Locator expected to be visible
Call log:
- Expect "ToBeVisibleAsync" with timeout 5000ms
- waiting for GetByText("Name")
```

## Setting a custom timeout

You can specify a custom timeout for assertions either globally or per assertion. The default timeout is 5 seconds.

### Global timeout

<Tabs group-id="test-runners" default-value="mstest" :tabs='[{"label":"MSTest","value":"mstest"},{"label":"NUnit","value":"nunit"},{"label":"xUnit","value":"xunit"},{"label":"xUnit v3","value":"xunit-v3"}]'>

<TabItem value="nunit">

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework;

namespace PlaywrightTests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class Tests : PageTest
{
    [OneTimeSetUp]
    public void GlobalSetup()
    {
        SetDefaultExpectTimeout(10_000);
    }
    // ...
}
```

:::

</TabItem>

<TabItem value="mstest">

::: code-group

```csharp [UnitTest1.cs]
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PlaywrightTests;

[TestClass]
public class UnitTest1 : PageTest
{
    [ClassInitialize]
    public static void GlobalSetup(TestContext context)
    {
        SetDefaultExpectTimeout(10_000);
    }
    // ...
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
    UnitTest1()
    {
        SetDefaultExpectTimeout(10_000);
    }
    // ...
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
    UnitTest1()
    {
        SetDefaultExpectTimeout(10_000);
    }
    // ...
}
```

:::

</TabItem>

</Tabs>

### Per assertion timeout

::: code-group

```csharp [UnitTest1.cs]
await Expect(Page.GetByText("Name")).ToBeVisibleAsync(new() { Timeout = 10_000 });
```

:::
