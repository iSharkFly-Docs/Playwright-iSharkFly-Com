---
title: PageAssertions
outline: 2
---

# PageAssertions

<Badge type="info" text="Added in: v1.17" />

The [PageAssertions](/dotnet/api/class-pageassertions) class provides assertion methods that can be used to make assertions about the [Page](/dotnet/api/class-page) state in the tests.

```csharp
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class ExampleTests : PageTest
{
    [TestMethod]
    public async Task NavigateToLoginPage()
    {
        await Page.GetByRole(AriaRole.Button, new() { Name = "Sign In" }).ClickAsync();
        await Expect(Page).ToHaveURLAsync(new Regex(".*/login"));
    }
}
```

## Methods

### PageAssertions.ToHaveTitleAsync() {#page-assertions-to-have-title}

<Badge type="info" text="Added in: v1.20" />

Ensures the page has the given title.

**Usage**

```csharp
await Expect(Page).ToHaveTitleAsync("Playwright");
```

**Arguments**

- <a id="page-assertions-to-have-title-option-title-or-reg-exp"></a>`titleOrRegExp` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected title or RegExp.
- <a id="page-assertions-to-have-title-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-have-title-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### PageAssertions.ToHaveURLAsync() {#page-assertions-to-have-url}

<Badge type="info" text="Added in: v1.20" />

Ensures the page is navigated to the given URL.

**Usage**

```csharp
await Expect(Page).ToHaveURLAsync(new Regex(".*checkout"));
```

**Arguments**

- <a id="page-assertions-to-have-url-option-url-or-reg-exp"></a>`urlOrRegExp` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected URL string or RegExp.
- <a id="page-assertions-to-have-url-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-have-url-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)* <Badge type="info" text="Added in: v1.44" />

    Whether to perform case-insensitive match. [`ignoreCase`](/dotnet/api/class-pageassertions#page-assertions-to-have-url-option-ignore-case) option takes precedence over the corresponding regular expression parameter if specified. A provided predicate ignores this flag.
  - <a id="page-assertions-to-have-url-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### PageAssertions.ToMatchAriaSnapshotAsync() {#page-assertions-to-match-aria-snapshot}

<Badge type="info" text="Added in: v1.60" />

Asserts that the page body matches the given [accessibility snapshot](../aria-snapshots.md).

**Usage**

```csharp
await page.GotoAsync("https://demo.playwright.dev/todomvc/");
await Expect(page).ToMatchAriaSnapshotAsync(@"
  - heading ""todos""
  - textbox ""What needs to be done?""
");
```

**Arguments**

- <a id="page-assertions-to-match-aria-snapshot-option-expected"></a>`expected` `string`
- <a id="page-assertions-to-match-aria-snapshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-assertions-to-match-aria-snapshot-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


## Properties

### PageAssertions.Not {#page-assertions-not}

<Badge type="info" text="Added in: v1.20" />

Makes the assertion check for the opposite condition.

**Usage**

For example, this code tests that the page URL doesn't contain `"error"`:

```csharp
await Expect(Page).Not.ToHaveURLAsync("error");
```

**Type**

- `PageAssertions`

