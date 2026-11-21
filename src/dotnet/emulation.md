---
title: "Emulation"
---

# Emulation

## Introduction

With Playwright you can test your app on any browser as well as emulate a real device such as a mobile phone or tablet. Simply configure the devices you would like to emulate and Playwright will simulate the browser behavior such as `"userAgent"`, `"screenSize"`, `"viewport"` and if it `"hasTouch"` enabled. You can also emulate the `"geolocation"`, `"locale"` and `"timezone"` for all tests or for a specific test as well as set the `"permissions"` to show notifications or change the `"colorScheme"`.

## Devices

Playwright comes with a [registry of device parameters](https://github.com/microsoft/playwright/blob/main/packages/isomorphic/deviceDescriptorsSource.json) using [`Playwright.Devices`](/dotnet/api/class-playwright#playwright-devices) for selected desktop, tablet and mobile devices. It can be used to simulate browser behavior for a specific device such as user agent, screen size, viewport and if it has touch enabled. All tests will run with the specified device parameters.

```csharp
using Microsoft.Playwright;
using System.Threading.Tasks;

using var playwright = await Playwright.CreateAsync();
await using var browser = await playwright.Chromium.LaunchAsync(new()
{
    Headless = false
});
var iphone13 = playwright.Devices["iPhone 13"];
await using var context = await browser.NewContextAsync(iphone13);
```

<img height="1582" width="916" alt="playwright.dev website emulated for iPhone 13" src="https://user-images.githubusercontent.com/13063165/220411073-76fe59f9-9a2d-463d-8e30-c19a7deca133.png" />

**Note**: Pre-configured devices assume a specific platform. For example, "Desktop Chrome" will provide a Windows-specific user agent string.

If you would like to use the user agent specific to the platform that is running the tests, we recommend unsetting the user agent property.

```csharp
var desktopChrome = playwright.Devices["Desktop Chrome"];
desktopChrome.UserAgent = null;
var context = await browser.NewContextAsync(desktopChrome);
```

## Viewport

The viewport is included in the device but you can override it for some tests with [`Page.SetViewportSizeAsync()`](/dotnet/api/class-page#page-set-viewport-size).

Test file:

The same works inside a test file.

```csharp
// Create context with given viewport
await using var context = await browser.NewContextAsync(new()
{
    ViewportSize = new ViewportSize() { Width = 1280, Height = 1024 }
});

// Resize viewport for individual page
await page.SetViewportSizeAsync(1600, 1200);

// Emulate high-DPI
await using var context = await browser.NewContextAsync(new()
{
    ViewportSize = new ViewportSize() { Width = 2560, Height = 1440 },
    DeviceScaleFactor = 2
});
```

## isMobile

Whether the meta viewport tag is taken into account and touch events are enabled.

```csharp
await using var context = await browser.NewContextAsync(new()
{
    IsMobile = false
});
```

## Locale & Timezone

Emulate the browser Locale and Timezone which can be set globally for all tests in the config and then overridden for particular tests.

```csharp
await using var context = await browser.NewContextAsync(new()
{
    Locale = "de-DE",
    TimezoneId = "Europe/Berlin"
});
```

<img height="1824" width="2788" alt="Bing in german lang and timezone" src="https://user-images.githubusercontent.com/13063165/220416571-ccc96ab1-44bb-4579-8430-64502fc24a15.png" />

## Permissions

Allow app to show system notifications.

Allow notifications for a specific domain.

```csharp
await context.GrantPermissionsAsync(new[] { "notifications" }, origin: "https://skype.com");
```

Revoke all permissions with [`BrowserContext.ClearPermissionsAsync()`](/dotnet/api/class-browsercontext#browser-context-clear-permissions).

```csharp
await context.ClearPermissionsAsync();
```

## Geolocation

Grant `"geolocation"` permissions and set geolocation to a specific area.

```csharp
await using var context = await browser.NewContextAsync(new()
{
    Permissions = new[] { "geolocation" },
    Geolocation = new Geolocation() { Longitude = 41.890221, Latitude = 12.492348 }
});
```

<img height="1824" width="2788" alt="geolocation for italy on bing maps" src="https://user-images.githubusercontent.com/13063165/220417670-bb22d815-f5cd-47c4-8562-0b88165eac27.png" />

Change the location later:

```csharp
await context.SetGeolocationAsync(new Geolocation() { Longitude = 48.858455, Latitude = 2.294474 });
```

**Note** you can only change geolocation for all pages in the context.

## Color Scheme and Media

Emulate the users `"colorScheme"`. Supported values are 'light', 'dark', and 'no-preference'. You can also emulate the media type with [`Page.EmulateMediaAsync()`](/dotnet/api/class-page#page-emulate-media).

```csharp
// Create context with dark mode
await using var context = await browser.NewContextAsync(new()
{
    ColorScheme = ColorScheme.Dark
});

// Create page with dark mode
var page = await browser.NewPageAsync(new()
{
    ColorScheme = ColorScheme.Dark
});

// Change color scheme for the page
await page.EmulateMediaAsync(new()
{
    ColorScheme = ColorScheme.Dark
});

// Change media for page
await page.EmulateMediaAsync(new()
{
    Media = Media.Print
});
```

<img height="1824" width="2788" alt="playwright web in dark mode" src="https://user-images.githubusercontent.com/13063165/220411638-55d2b051-4678-4da7-9f0b-ed22f5a3c47c.png" />

The `"reducedMotion"`, `"forcedColors"` and `"contrast"` options emulate the `prefers-reduced-motion`, `forced-colors` and `prefers-contrast` media features the same way. Supported values are `'reduce'` and `'no-preference'` for reduced motion, `'active'` and `'none'` for forced colors, and `'more'` and `'no-preference'` for contrast. [`Page.EmulateMediaAsync()`](/dotnet/api/class-page#page-emulate-media) changes them for a single page.

```csharp
// Create context with reduced motion, forced colors and more contrast
await using var context = await browser.NewContextAsync(new()
{
    ReducedMotion = ReducedMotion.Reduce, // or NoPreference
    ForcedColors = ForcedColors.Active, // or None
    Contrast = Contrast.More // or NoPreference
});

// Change the media features for the page
await page.EmulateMediaAsync(new()
{
    ReducedMotion = ReducedMotion.Reduce,
    ForcedColors = ForcedColors.Active,
    Contrast = Contrast.More
});
```

## User Agent

The User Agent is included in the device and therefore you  will rarely need to change it however if you do need to test a different user agent you can override it with the `userAgent` property.

```csharp
var context = await browser.NewContextAsync(new() { UserAgent = "My User Agent" });
```

## Offline

Emulate the network being offline.

```csharp
var context = await browser.NewContextAsync(new() { Offline = true });
```

::: info
Offline emulation affects HTTP requests, such as page navigations, `fetch()` and `XMLHttpRequest`.

WebSocket behavior depends on the browser and whether the connection is already established. Chromium and Firefox fail new WebSocket connections while offline, but do not close already-open connections. Chromium can defer incoming messages until the context goes back online, rather than lose them; Firefox can continue delivering messages while offline. WebKit can allow both new WebSocket connections and traffic on established connections while offline. Do not rely on offline emulation to test WebSocket message loss or connection closure.

Offline emulation does not affect WebRTC traffic: established `RTCPeerConnection`s keep sending and receiving media over UDP. To test WebRTC connection loss, interrupt the connection outside the browser, for example by stopping the TURN server or using an OS-level firewall.
:::

## JavaScript Enabled

Emulate a user scenario where JavaScript is disabled.

```csharp
var context = await browser.NewContextAsync(new() { JavaScriptEnabled = false });
```
