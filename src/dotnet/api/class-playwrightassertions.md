---
title: PlaywrightAssertions
outline: 2
---

# PlaywrightAssertions

<Badge type="info" text="Added in: v1.17" />

Playwright gives you Web-First Assertions with convenience methods for creating assertions that will wait and retry until the expected condition is met.

Consider the following example:

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class ExampleTests : PageTest
{
    [TestMethod]
    public async Task StatusBecomesSubmitted()
    {
        await Page.GetByRole(AriaRole.Button, new() { Name = "Submit" }).ClickAsync();
        await Expect(Page.Locator(".status")).ToHaveTextAsync("Submitted");
    }
}
```

Playwright will be re-testing the node with the selector `.status` until fetched Node has the `"Submitted"`
text. It will be re-fetching the node and checking it over and over, until the condition is met or until the timeout is
reached. You can pass this timeout as an option.

By default, the timeout for assertions is set to 5 seconds.

## Methods

### PlaywrightAssertions.Expect() {#playwright-assertions-expect-api-response}

<Badge type="info" text="Added in: v1.18" />

Creates a [APIResponseAssertions](/dotnet/api/class-apiresponseassertions) object for the given [APIResponse](/dotnet/api/class-apiresponse).

**Usage**

**Arguments**

- <a id="playwright-assertions-expect-api-response-option-response"></a>`response` `APIResponse`

  [APIResponse](/dotnet/api/class-apiresponse) object to use for assertions.

**Returns**

- `APIResponseAssertions`


### PlaywrightAssertions.Expect() {#playwright-assertions-expect-function}

<Badge type="info" text="Added in: v1.66" />

Creates a [FunctionAssertions](/dotnet/api/class-functionassertions) object for the given callback.

**Usage**

```csharp
await Expect(async () =>
{
    var response = await Page.APIRequest.GetAsync("https://api.example.com");
    Assert.AreEqual(200, response.Status);
}).ToPassAsync();
```

**Arguments**

- <a id="playwright-assertions-expect-function-option-callback"></a>`callback` `Func<Task>`

  Callback to retry. A synchronous `Action` is accepted as well.

**Returns**

- `FunctionAssertions`


### PlaywrightAssertions.Expect() {#playwright-assertions-expect-locator}

<Badge type="info" text="Added in: v1.18" />

Creates a [LocatorAssertions](/dotnet/api/class-locatorassertions) object for the given [Locator](/dotnet/api/class-locator).

**Usage**

```csharp
await Expect(locator).ToBeVisibleAsync();
```

**Arguments**

- <a id="playwright-assertions-expect-locator-option-locator"></a>`locator` `Locator`

  [Locator](/dotnet/api/class-locator) object to use for assertions.

**Returns**

- `LocatorAssertions`


### PlaywrightAssertions.Expect() {#playwright-assertions-expect-page}

<Badge type="info" text="Added in: v1.18" />

Creates a [PageAssertions](/dotnet/api/class-pageassertions) object for the given [Page](/dotnet/api/class-page).

**Usage**

```csharp
await Expect(Page).ToHaveTitleAsync("News");
```

**Arguments**

- <a id="playwright-assertions-expect-page-option-page"></a>`page` `Page`

  [Page](/dotnet/api/class-page) object to use for assertions.

**Returns**

- `PageAssertions`

