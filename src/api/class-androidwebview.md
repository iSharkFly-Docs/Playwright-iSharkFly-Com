---
title: AndroidWebView
outline: 2
---

# AndroidWebView

<Badge type="info" text="Added in: v1.9" />

[AndroidWebView](/api/class-androidwebview) represents a WebView open on the [AndroidDevice](/api/class-androiddevice). WebView is usually obtained using [`androidDevice.webView()`](/api/class-androiddevice#android-device-web-view).

## Methods

### androidWebView.page() {#android-web-view-page}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Connects to the WebView and returns a regular Playwright [Page](/api/class-page) to interact with.

**Returns**

- `Promise<Page>`


### androidWebView.pid() {#android-web-view-pid}

<Badge type="info" text="Added in: v1.9" />

WebView process PID.

**Returns**

- `int`


### androidWebView.pkg() {#android-web-view-pkg}

<Badge type="info" text="Added in: v1.9" />

WebView package identifier.

**Returns**

- `string`


## Events

### androidWebView.on('close') {#android-web-view-event-close}

<Badge type="info" text="Added in: v1.9" />

Emitted when the WebView is closed.

**Event data**

- `void`

