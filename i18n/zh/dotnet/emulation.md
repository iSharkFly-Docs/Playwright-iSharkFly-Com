---
title: "模拟"
---

# 模拟

## 简介

使用 Playwright，您可以在任何浏览器上测试您的应用程序，也可以模拟真实设备，如手机或平板电脑。只需配置您想要模拟的设备，Playwright 就会模拟浏览器行为，包括 `"userAgent"`、`"screenSize"`、`"viewport"` 以及是否启用 `"hasTouch"`。您还可以为所有测试或特定测试模拟 `"geolocation"`、`"locale"` 和 `"timezone"`，以及设置 `"permissions"` 来显示通知或更改 `"colorScheme"`。

## 设备

Playwright 附带一个[设备参数注册表](https://github.com/microsoft/playwright/blob/main/packages/isomorphic/deviceDescriptorsSource.json)，使用 [`Playwright.Devices`](/dotnet/api/class-playwright#playwright-devices) 提供选定的桌面、平板和移动设备配置。它可用于模拟特定设备的浏览器行为，如用户代理、屏幕尺寸、视口以及是否启用触摸。所有测试将使用指定的设备参数运行。

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

**注意**：预配置的设备假定使用特定平台。例如，"Desktop Chrome" 将提供 Windows 特定的用户代理字符串。

如果您想使用运行测试的平台特定的用户代理，我们建议取消设置用户代理属性。

```csharp
var desktopChrome = playwright.Devices["Desktop Chrome"];
desktopChrome.UserAgent = null;
var context = await browser.NewContextAsync(desktopChrome);
```

## 视口

视口包含在设备中，但您可以在某些测试中使用 [`Page.SetViewportSizeAsync()`](/dotnet/api/class-page#page-set-viewport-size) 覆盖它。

测试文件：

同样的方法也适用于测试文件内部。

```csharp
// 使用给定的视口创建上下文
await using var context = await browser.NewContextAsync(new()
{
    ViewportSize = new ViewportSize() { Width = 1280, Height = 1024 }
});

// 为单个页面调整视口大小
await page.SetViewportSizeAsync(1600, 1200);

// 模拟高 DPI
await using var context = await browser.NewContextAsync(new()
{
    ViewportSize = new ViewportSize() { Width = 2560, Height = 1440 },
    DeviceScaleFactor = 2
});
```

## isMobile

是否考虑 meta viewport 标签并启用触摸事件。

```csharp
await using var context = await browser.NewContextAsync(new()
{
    IsMobile = false
});
```

## 区域设置和时区

模拟浏览器的区域设置和时区，可以在配置中为所有测试全局设置，然后为特定测试覆盖。

```csharp
await using var context = await browser.NewContextAsync(new()
{
    Locale = "de-DE",
    TimezoneId = "Europe/Berlin"
});
```

<img height="1824" width="2788" alt="Bing in german lang and timezone" src="https://user-images.githubusercontent.com/13063165/220416571-ccc96ab1-44bb-4579-8430-64502fc24a15.png" />

## 权限

允许应用显示系统通知。

为特定域允许通知。

```csharp
await context.GrantPermissionsAsync(new[] { "notifications" }, origin: "https://skype.com");
```

使用 [`BrowserContext.ClearPermissionsAsync()`](/dotnet/api/class-browsercontext#browser-context-clear-permissions) 撤销所有权限。

```csharp
await context.ClearPermissionsAsync();
```

## 地理位置

授予 `"geolocation"` 权限并将地理位置设置为特定区域。

```csharp
await using var context = await browser.NewContextAsync(new()
{
    Permissions = new[] { "geolocation" },
    Geolocation = new Geolocation() { Longitude = 41.890221, Latitude = 12.492348 }
});
```

<img height="1824" width="2788" alt="geolocation for italy on bing maps" src="https://user-images.githubusercontent.com/13063165/220417670-bb22d815-f5cd-47c4-8562-0b88165eac27.png" />

稍后更改位置：

```csharp
await context.SetGeolocationAsync(new Geolocation() { Longitude = 48.858455, Latitude = 2.294474 });
```

**注意**：您只能更改上下文中所有页面的地理位置。

## 颜色方案和媒体

模拟用户的 `"colorScheme"`。支持的值有 'light'、'dark' 和 'no-preference'。您还可以使用 [`Page.EmulateMediaAsync()`](/dotnet/api/class-page#page-emulate-media) 模拟媒体类型。

```csharp
// 创建深色模式的上下文
await using var context = await browser.NewContextAsync(new()
{
    ColorScheme = ColorScheme.Dark
});

// 创建深色模式的页面
var page = await browser.NewPageAsync(new()
{
    ColorScheme = ColorScheme.Dark
});

// 更改页面的颜色方案
await page.EmulateMediaAsync(new()
{
    ColorScheme = ColorScheme.Dark
});

// 更改页面的媒体类型
await page.EmulateMediaAsync(new()
{
    Media = Media.Print
});
```

<img height="1824" width="2788" alt="playwright web in dark mode" src="https://user-images.githubusercontent.com/13063165/220411638-55d2b051-4678-4da7-9f0b-ed22f5a3c47c.png" />

`"reducedMotion"`、`"forcedColors"` 和 `"contrast"` 选项以相同方式模拟 `prefers-reduced-motion`、`forced-colors` 和 `prefers-contrast` 媒体特性。支持的值分别是：减少动画的 `'reduce'` 和 `'no-preference'`，强制颜色的 `'active'` 和 `'none'`，以及对比度的 `'more'` 和 `'no-preference'`。[`Page.EmulateMediaAsync()`](/dotnet/api/class-page#page-emulate-media) 为单个页面更改这些设置。

```csharp
// 创建具有减少动画、强制颜色和更高对比度的上下文
await using var context = await browser.NewContextAsync(new()
{
    ReducedMotion = ReducedMotion.Reduce, // 或 NoPreference
    ForcedColors = ForcedColors.Active, // 或 None
    Contrast = Contrast.More // 或 NoPreference
});

// 更改页面的媒体特性
await page.EmulateMediaAsync(new()
{
    ReducedMotion = ReducedMotion.Reduce,
    ForcedColors = ForcedColors.Active,
    Contrast = Contrast.More
});
```

## 用户代理

用户代理包含在设备中，因此您很少需要更改它，但是如果您确实需要测试不同的用户代理，可以使用 `userAgent` 属性覆盖它。

```csharp
var context = await browser.NewContextAsync(new() { UserAgent = "My User Agent" });
```

## 离线

模拟网络离线状态。

```csharp
var context = await browser.NewContextAsync(new() { Offline = true });
```

::: info
离线模拟影响 HTTP 请求，如页面导航、`fetch()` 和 `XMLHttpRequest`。

WebSocket 行为取决于浏览器以及连接是否已建立。Chromium 和 Firefox 在离线时会使新的 WebSocket 连接失败，但不会关闭已打开的连接。Chromium 可以延迟传入的消息直到上下文恢复在线，而不是丢失它们；Firefox 可以在离线时继续传递消息。WebKit 可以在离线时允许新的 WebSocket 连接和已建立连接上的流量。不要依赖离线模拟来测试 WebSocket 消息丢失或连接关闭。

离线模拟不影响 WebRTC 流量：已建立的 `RTCPeerConnection` 会继续通过 UDP 发送和接收媒体。要测试 WebRTC 连接丢失，请在浏览器外部中断连接，例如停止 TURN 服务器或使用操作系统级别的防火墙。
:::

## JavaScript 启用

模拟禁用 JavaScript 的用户场景。

```csharp
var context = await browser.NewContextAsync(new() { JavaScriptEnabled = false });
```
