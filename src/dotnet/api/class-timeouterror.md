---
title: TimeoutError
outline: 2
---

# TimeoutError

<Badge type="info" text="Added in: v1.8" />

Extends: [Error](./class-error)

* extends: [Error]

TimeoutError is emitted whenever certain operations are terminated due to timeout, e.g. [`Locator.WaitForAsync()`](/dotnet/api/class-locator#locator-wait-for) or [`BrowserType.LaunchAsync()`](/dotnet/api/class-browsertype#browser-type-launch).

```csharp
using Microsoft.Playwright;

using var playwright = await Playwright.CreateAsync();
await using var browser = await playwright.Chromium.LaunchAsync();
var page = await browser.NewPageAsync();
try
{
    await page.ClickAsync("text=Example", new() { Timeout = 100 });
}
catch (TimeoutException)
{
    Console.WriteLine("Timeout!");
}
```
