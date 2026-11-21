---
title: "模拟"
---

# 模拟

## 简介

使用 Playwright，您可以在任何浏览器上测试您的应用程序，还可以模拟真实设备，如手机或平板电脑。只需配置您想要模拟的设备，Playwright 就会模拟浏览器行为，如 `"userAgent"`、`"screenSize"`、`"viewport"` 以及是否启用 `"hasTouch"`。您还可以为所有测试或特定测试模拟 `"geolocation"`、`"locale"` 和 `"timezone"`，以及设置 `"permissions"` 来显示通知或更改 `"colorScheme"`。

## 设备

Playwright 可以通过在使用 [`browser.newContext()`](/java/api/class-browser#browser-new-context) 创建上下文时指定 `setDeviceScaleFactor`、`setHasTouch`、`setIsMobile`、`setScreenSize`、`setUserAgent` 和 `setViewportSize` 选项来模拟各种设备。

## 视口

视口包含在设备中，但您可以使用 [`page.setViewportSize()`](/java/api/class-page#page-set-viewport-size) 为某些测试覆盖它。

测试文件：

在测试文件中同样适用。

```java
// 使用给定视口创建上下文
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setViewportSize(1280, 1024));

// 为单个页面调整视口大小
page.setViewportSize(1600, 1200);

// 模拟高 DPI
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setViewportSize(2560, 1440)
  .setDeviceScaleFactor(2));
```

## isMobile

是否考虑 meta viewport 标签并启用触摸事件。

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .isMobile(false));
```

## 语言环境和时区

模拟浏览器的语言环境和时区，可以在配置中为所有测试全局设置，然后为特定测试覆盖。

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setLocale("de-DE")
  .setTimezoneId("Europe/Berlin"));
```

<img height="1824" width="2788" alt="德语和时区的必应" src="https://user-images.githubusercontent.com/13063165/220416571-ccc96ab1-44bb-4579-8430-64502fc24a15.png" />

## 权限

允许应用程序显示系统通知。

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setPermissions(Arrays.asList("notifications")));
```

允许特定域名的通知。

```java
context.grantPermissions(Arrays.asList("notifications"),
  new BrowserContext.GrantPermissionsOptions().setOrigin("https://skype.com"));
```

使用 [`browserContext.clearPermissions()`](/java/api/class-browsercontext#browser-context-clear-permissions) 撤销所有权限。

```java
context.clearPermissions();
```

## 地理位置

授予 `"geolocation"` 权限并将地理位置设置为特定区域。

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setGeolocation(41.890221, 12.492348)
  .setPermissions(Arrays.asList("geolocation")));
```

<img height="1824" width="2788" alt="必应地图上意大利的地理位置" src="https://user-images.githubusercontent.com/13063165/220417670-bb22d815-f5cd-47c4-8562-0b88165eac27.png" />

稍后更改位置：

```java
context.setGeolocation(new Geolocation(48.858455, 2.294474));
```

**注意**：您只能为上下文中的所有页面更改地理位置。

## 颜色方案和媒体

模拟用户的 `"colorScheme"`。支持的值有 'light'、'dark' 和 'no-preference'。您还可以使用 [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) 模拟媒体类型。

```java
// 创建深色模式的上下文
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setColorScheme(ColorScheme.DARK)); // 或 "light"

// 创建深色模式的页面
Page page = browser.newPage(new Browser.NewPageOptions()
  .setColorScheme(ColorScheme.DARK)); // 或 "light"

// 更改页面的颜色方案
page.emulateMedia(new Page.EmulateMediaOptions().setColorScheme(ColorScheme.DARK));

// 更改页面的媒体
page.emulateMedia(new Page.EmulateMediaOptions().setMedia(Media.PRINT));
```

<img height="1824" width="2788" alt="深色模式下的 playwright 网站" src="https://user-images.githubusercontent.com/13063165/220411638-55d2b051-4678-4da7-9f0b-ed22f5a3c47c.png" />

`"reducedMotion"`、`"forcedColors"` 和 `"contrast"` 选项以相同的方式模拟 `prefers-reduced-motion`、`forced-colors` 和 `prefers-contrast` 媒体功能。减少动画的支持值为 `'reduce'` 和 `'no-preference'`，强制颜色的支持值为 `'active'` 和 `'none'`，对比度的支持值为 `'more'` 和 `'no-preference'`。[`page.emulateMedia()`](/java/api/class-page#page-emulate-media) 可为单个页面更改这些设置。

```java
// 创建减少动画、强制颜色和更高对比度的上下文
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setReducedMotion(ReducedMotion.REDUCE) // 或 NO_PREFERENCE
  .setForcedColors(ForcedColors.ACTIVE) // 或 NONE
  .setContrast(Contrast.MORE)); // 或 NO_PREFERENCE

// 更改页面的媒体功能
page.emulateMedia(new Page.EmulateMediaOptions()
  .setReducedMotion(ReducedMotion.REDUCE)
  .setForcedColors(ForcedColors.ACTIVE)
  .setContrast(Contrast.MORE));
```

## 用户代理

用户代理包含在设备中，因此您很少需要更改它，但如果您确实需要测试不同的用户代理，可以使用 `userAgent` 属性覆盖它。

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setUserAgent("My user agent"));
```

## 离线

模拟网络离线状态。

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setOffline(true));
```

::: info
离线模拟影响 HTTP 请求，如页面导航、`fetch()` 和 `XMLHttpRequest`。

WebSocket 的行为取决于浏览器以及连接是否已建立。Chromium 和 Firefox 在离线时会使新的 WebSocket 连接失败，但不会关闭已打开的连接。Chromium 可以推迟传入消息直到上下文恢复在线，而不是丢失它们；Firefox 可以在离线时继续传递消息。WebKit 可以在离线时允许新的 WebSocket 连接和已建立连接的流量。不要依赖离线模拟来测试 WebSocket 消息丢失或连接关闭。

离线模拟不影响 WebRTC 流量：已建立的 `RTCPeerConnection` 会继续通过 UDP 发送和接收媒体。要测试 WebRTC 连接丢失，请在浏览器外部中断连接，例如停止 TURN 服务器或使用操作系统级防火墙。
:::

## 启用 JavaScript

模拟禁用 JavaScript 的用户场景。

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .javaScriptEnabled(false));
```
