---
title: Playwright
outline: 2
---

# Playwright

<Badge type="info" text="Added in: v1.8" />

Playwright module provides a method to launch a browser instance. The following is a typical example of using Playwright
to drive automation:

```csharp
using Microsoft.Playwright;
using System.Threading.Tasks;

class PlaywrightExample
{
    public static async Task Main()
    {
        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync();
        var page = await browser.NewPageAsync();

        await page.GotoAsync("https://www.microsoft.com");
        // other actions...
    }
}
```

## Properties

### Playwright.APIRequest {#playwright-request}

<Badge type="info" text="Added in: v1.16" />

Exposes API that can be used for the Web API testing.

**Type**

- `APIRequest`


### Playwright.Chromium {#playwright-chromium}

<Badge type="info" text="Added in: v1.8" />

This object can be used to launch or connect to Chromium, returning instances of [Browser](/dotnet/api/class-browser).

**Type**

- `BrowserType`


### Playwright.Devices {#playwright-devices}

<Badge type="info" text="Added in: v1.8" />

Returns a dictionary of devices to be used with [`Browser.NewContextAsync()`](/dotnet/api/class-browser#browser-new-context) or [`Browser.NewPageAsync()`](/dotnet/api/class-browser#browser-new-page).

```csharp
using Microsoft.Playwright;
using System.Threading.Tasks;

class PlaywrightExample
{
    public static async Task Main()
    {
        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Webkit.LaunchAsync();
        await using var context = await browser.NewContextAsync(playwright.Devices["iPhone 6"]);

        var page = await context.NewPageAsync();
        await page.GotoAsync("https://www.theverge.com");
        // other actions...
    }
}
```

**Type**

- `IReadOnlyDictionary<string, BrowserNewContextOptions>`


### Playwright.Firefox {#playwright-firefox}

<Badge type="info" text="Added in: v1.8" />

This object can be used to launch or connect to Firefox, returning instances of [Browser](/dotnet/api/class-browser).

**Type**

- `BrowserType`


### Playwright.Selectors {#playwright-selectors}

<Badge type="info" text="Added in: v1.8" />

Selectors can be used to install custom selector engines. See
[extensibility](../extensibility.md) for more information.

**Type**

- `Selectors`


### Playwright.Webkit {#playwright-webkit}

<Badge type="info" text="Added in: v1.8" />

This object can be used to launch or connect to WebKit, returning instances of [Browser](/dotnet/api/class-browser).

**Type**

- `BrowserType`

