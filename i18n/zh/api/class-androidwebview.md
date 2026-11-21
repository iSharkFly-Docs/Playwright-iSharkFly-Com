---
title: AndroidWebView
outline: 2
---

# AndroidWebView

<Badge type="info" text="添加于: v1.9" />

[AndroidWebView](/api/class-androidwebview) 表示在 [AndroidDevice](/api/class-androiddevice) 上打开的 WebView。WebView 通常通过 [`androidDevice.webView()`](/api/class-androiddevice#android-device-web-view) 获取。

## 方法

### androidWebView.page() {#android-web-view-page}

<Badge type="info" text="添加于: v1.9" /> <Badge type="tip" text="异步" />

连接到 WebView 并返回一个常规的 Playwright [Page](/api/class-page) 用于交互。

**返回值**

- `Promise<Page>`


### androidWebView.pid() {#android-web-view-pid}

<Badge type="info" text="添加于: v1.9" />

WebView 进程 PID。

**返回值**

- `int`


### androidWebView.pkg() {#android-web-view-pkg}

<Badge type="info" text="添加于: v1.9" />

WebView 包标识符。

**返回值**

- `string`


## 事件

### androidWebView.on('close') {#android-web-view-event-close}

<Badge type="info" text="添加于: v1.9" />

当 WebView 关闭时触发。

**事件数据**

- `void`
