---
title: "Emulation"
---

# Emulation

## Introduction

With Playwright you can test your app on any browser as well as emulate a real device such as a mobile phone or tablet. Simply configure the devices you would like to emulate and Playwright will simulate the browser behavior such as `"userAgent"`, `"screenSize"`, `"viewport"` and if it `"hasTouch"` enabled. You can also emulate the `"geolocation"`, `"locale"` and `"timezone"` for all tests or for a specific test as well as set the `"permissions"` to show notifications or change the `"colorScheme"`.

## Devices

Playwright can emulate various devices by specifying `setDeviceScaleFactor`, `setHasTouch`, `setIsMobile`, `setScreenSize`, `setUserAgent` and `setViewportSize` options when creating a context with [`browser.newContext()`](/java/api/class-browser#browser-new-context).

## Viewport

The viewport is included in the device but you can override it for some tests with [`page.setViewportSize()`](/java/api/class-page#page-set-viewport-size).

Test file:

The same works inside a test file.

```java
// Create context with given viewport
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setViewportSize(1280, 1024));

// Resize viewport for individual page
page.setViewportSize(1600, 1200);

// Emulate high-DPI
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setViewportSize(2560, 1440)
  .setDeviceScaleFactor(2));
```

## isMobile

Whether the meta viewport tag is taken into account and touch events are enabled.

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .isMobile(false));
```

## Locale & Timezone

Emulate the browser Locale and Timezone which can be set globally for all tests in the config and then overridden for particular tests.

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setLocale("de-DE")
  .setTimezoneId("Europe/Berlin"));
```

<img height="1824" width="2788" alt="Bing in german lang and timezone" src="https://user-images.githubusercontent.com/13063165/220416571-ccc96ab1-44bb-4579-8430-64502fc24a15.png" />

## Permissions

Allow app to show system notifications.

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setPermissions(Arrays.asList("notifications")));
```

Allow notifications for a specific domain.

```java
context.grantPermissions(Arrays.asList("notifications"),
  new BrowserContext.GrantPermissionsOptions().setOrigin("https://skype.com"));
```

Revoke all permissions with [`browserContext.clearPermissions()`](/java/api/class-browsercontext#browser-context-clear-permissions).

```java
context.clearPermissions();
```

## Geolocation

Grant `"geolocation"` permissions and set geolocation to a specific area.

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setGeolocation(41.890221, 12.492348)
  .setPermissions(Arrays.asList("geolocation")));
```

<img height="1824" width="2788" alt="geolocation for italy on bing maps" src="https://user-images.githubusercontent.com/13063165/220417670-bb22d815-f5cd-47c4-8562-0b88165eac27.png" />

Change the location later:

```java
context.setGeolocation(new Geolocation(48.858455, 2.294474));
```

**Note** you can only change geolocation for all pages in the context.

## Color Scheme and Media

Emulate the users `"colorScheme"`. Supported values are 'light', 'dark', and 'no-preference'. You can also emulate the media type with [`page.emulateMedia()`](/java/api/class-page#page-emulate-media).

```java
// Create context with dark mode
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setColorScheme(ColorScheme.DARK)); // or "light"

// Create page with dark mode
Page page = browser.newPage(new Browser.NewPageOptions()
  .setColorScheme(ColorScheme.DARK)); // or "light"

// Change color scheme for the page
page.emulateMedia(new Page.EmulateMediaOptions().setColorScheme(ColorScheme.DARK));

// Change media for page
page.emulateMedia(new Page.EmulateMediaOptions().setMedia(Media.PRINT));
```

<img height="1824" width="2788" alt="playwright web in dark mode" src="https://user-images.githubusercontent.com/13063165/220411638-55d2b051-4678-4da7-9f0b-ed22f5a3c47c.png" />

The `"reducedMotion"`, `"forcedColors"` and `"contrast"` options emulate the `prefers-reduced-motion`, `forced-colors` and `prefers-contrast` media features the same way. Supported values are `'reduce'` and `'no-preference'` for reduced motion, `'active'` and `'none'` for forced colors, and `'more'` and `'no-preference'` for contrast. [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) changes them for a single page.

```java
// Create context with reduced motion, forced colors and more contrast
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setReducedMotion(ReducedMotion.REDUCE) // or NO_PREFERENCE
  .setForcedColors(ForcedColors.ACTIVE) // or NONE
  .setContrast(Contrast.MORE)); // or NO_PREFERENCE

// Change the media features for the page
page.emulateMedia(new Page.EmulateMediaOptions()
  .setReducedMotion(ReducedMotion.REDUCE)
  .setForcedColors(ForcedColors.ACTIVE)
  .setContrast(Contrast.MORE));
```

## User Agent

The User Agent is included in the device and therefore you  will rarely need to change it however if you do need to test a different user agent you can override it with the `userAgent` property.

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setUserAgent("My user agent"));
```

## Offline

Emulate the network being offline.

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setOffline(true));
```

::: info
Offline emulation affects HTTP requests, such as page navigations, `fetch()` and `XMLHttpRequest`.

WebSocket behavior depends on the browser and whether the connection is already established. Chromium and Firefox fail new WebSocket connections while offline, but do not close already-open connections. Chromium can defer incoming messages until the context goes back online, rather than lose them; Firefox can continue delivering messages while offline. WebKit can allow both new WebSocket connections and traffic on established connections while offline. Do not rely on offline emulation to test WebSocket message loss or connection closure.

Offline emulation does not affect WebRTC traffic: established `RTCPeerConnection`s keep sending and receiving media over UDP. To test WebRTC connection loss, interrupt the connection outside the browser, for example by stopping the TURN server or using an OS-level firewall.
:::

## JavaScript Enabled

Emulate a user scenario where JavaScript is disabled.

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .javaScriptEnabled(false));
```
