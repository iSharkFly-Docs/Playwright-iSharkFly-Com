---
title: FunctionAssertions
outline: 2
---

# FunctionAssertions

<Badge type="info" text="Added in: v1.66" />

The [FunctionAssertions](/dotnet/api/class-functionassertions) class provides assertion methods that retry a block of code. A new instance of [FunctionAssertions](/dotnet/api/class-functionassertions) is created by calling [`PlaywrightAssertions.Expect()`](/dotnet/api/class-playwrightassertions#playwright-assertions-expect-function):

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class ExampleTests : PageTest
{
    [TestMethod]
    public async Task ApiEventuallySucceeds()
    {
        await Expect(async () =>
        {
            var response = await Page.APIRequest.GetAsync("https://api.example.com");
            Assert.AreEqual(200, response.Status);
        }).ToPassAsync();
    }
}
```

## Methods

### FunctionAssertions.ToPassAsync() {#function-assertions-to-pass}

<Badge type="info" text="Added in: v1.66" />

Retries the callback until it completes without throwing an exception, or until the timeout is reached. When the timeout is reached, throws a [PlaywrightAssertionException](/dotnet/api/class-playwrightassertionexception) with the last exception that the callback has thrown.

**Usage**

```csharp
await Expect(async () =>
{
    var response = await Page.APIRequest.GetAsync("https://api.example.com");
    Assert.AreEqual(200, response.Status);
}).ToPassAsync(new()
{
    // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe
    Intervals = [1_000, 2_000, 10_000],
    Timeout = 60_000,
});
```

**Arguments**

- <a id="function-assertions-to-pass-option-options"></a>`options` `Object` *(optional)*

  - <a id="function-assertions-to-pass-option-intervals"></a>`intervals` `Array<int>` *(optional)*

    Time to wait between the retries in milliseconds. The last interval is used for all the following retries. Defaults to `[100, 250, 500, 1000]`.
  - <a id="function-assertions-to-pass-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the callback for in milliseconds. Defaults to `30000`, change the default with `SetDefaultExpectToPassTimeout`. Pass `0` to disable the timeout.

