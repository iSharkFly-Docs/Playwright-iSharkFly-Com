---
title: Android
outline: 2
---

# Android

<Badge type="info" text="Added in: v1.9" />

Playwright 对 Android 自动化提供**实验性**支持。这包括 Chrome for Android 和 Android WebView。

*要求*
* Android 设备或 AVD 模拟器。
* [ADB 守护进程](https://developer.android.com/studio/command-line/adb)正在运行并已在你的设备上认证。通常运行 `adb devices` 就足够了。
* 设备上安装了 [`Chrome 105`](https://play.google.com/store/apps/details?id=com.android.chrome) 或更新版本
* 在 `chrome://flags` 中启用了"Enable command line on non-rooted devices"。

*已知限制*
* 尚不支持原始 USB 操作，所以你需要 ADB。
* 设备需要保持唤醒状态才能生成截图。启用"保持唤醒"开发者模式会有所帮助。
* 我们没有在设备上运行所有测试，所以并非所有功能都能正常工作。

*如何运行*

Android 自动化脚本的示例如下：

```js
const { _android: android } = require('playwright');

(async () => {
  // 连接到设备。
  const [device] = await android.devices();
  console.log(`型号: ${device.model()}`);
  console.log(`序列号: ${device.serial()}`);
  // 截取整个设备的屏幕截图。
  await device.screenshot({ path: 'device.png' });

  {
    // --------------------- WebView -----------------------

    // 启动一个带有 WebView 的应用程序。
    await device.shell('am force-stop org.chromium.webview_shell');
    await device.shell('am start org.chromium.webview_shell/.WebViewBrowserActivity');
    // 获取 WebView。
    const webview = await device.webView({ pkg: 'org.chromium.webview_shell' });

    // 填写输入框。
    await device.fill({
      res: 'org.chromium.webview_shell:id/url_field',
    }, 'github.com/microsoft/playwright');
    await device.press({
      res: 'org.chromium.webview_shell:id/url_field',
    }, 'Enter');

    // 像往常一样操作 WebView 的页面。
    const page = await webview.page();
    await page.waitForURL(/.*microsoft\/playwright.*/);
    console.log(await page.title());
  }

  {
    // --------------------- 浏览器 -----------------------

    // 启动 Chrome 浏览器。
    await device.shell('am force-stop com.android.chrome');
    const context = await device.launchBrowser();

    // 像往常一样使用 BrowserContext。
    const page = await context.newPage();
    await page.goto('https://webkit.org/');
    console.log(await page.evaluate(() => window.location.href));
    await page.screenshot({ path: 'page.png' });

    await context.close();
  }

  // 关闭设备。
  await device.close();
})();
```

## 方法

### android.connect() {#android-connect}

<Badge type="info" text="Added in: v1.28" /> <Badge type="tip" text="async" />

此方法将 Playwright 附加到现有的 Android 设备。
使用 [`android.launchServer()`](/api/class-android#android-launch-server) 启动新的 Android 服务器实例。

**参数**

- <a id="android-connect-option-endpoint"></a>`endpoint` `string`

  要连接的浏览器 websocket 端点。
- <a id="android-connect-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-connect-option-headers"></a>`headers` `Object<string, string>` *(可选)*

    与 web socket 连接请求一起发送的附加 HTTP 头。可选。
  - <a id="android-connect-option-slow-mo"></a>`slowMo` `float` *(可选)*

    将 Playwright 操作减慢指定的毫秒数。这样你就可以看到正在发生什么。默认为 `0`。
  - <a id="android-connect-option-timeout"></a>`timeout` `float` *(可选)*

    等待建立连接的最大时间（毫秒）。默认为 `30000`（30 秒）。传递 `0` 禁用超时。

**返回值**

- `Promise<AndroidDevice>`


### android.devices() {#android-devices}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

返回检测到的 Android 设备列表。

**参数**

- <a id="android-devices-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-devices-option-host"></a>`host` `string` *(可选)* <Badge type="info" text="Added in: v1.22" />

    建立 ADB 服务器连接的可选主机。默认为 `127.0.0.1`。
  - <a id="android-devices-option-omit-driver-install"></a>`omitDriverInstall` `boolean` *(可选)* <Badge type="info" text="Added in: v1.21" />

    阻止在附加时自动安装 playwright 驱动程序。假设驱动程序已经安装。
  - <a id="android-devices-option-port"></a>`port` `int` *(可选)* <Badge type="info" text="Added in: v1.20" />

    建立 ADB 服务器连接的可选端口。默认为 `5037`。

**返回值**

- `Promise<Array<AndroidDevice>>`


### android.launchServer() {#android-launch-server}

<Badge type="info" text="Added in: v1.28" /> <Badge type="tip" text="async" />

启动客户端可以连接的 Playwright Android 服务器。请参见以下示例：

**用法**

服务器端：

```js
const { _android } = require('playwright');

(async () => {
  const browserServer = await _android.launchServer({
    // 如果你连接了多个设备并想使用特定的一个。
    // deviceSerialNumber: '<deviceSerialNumber>',
  });
  const wsEndpoint = browserServer.wsEndpoint();
  console.log(wsEndpoint);
})();
```

客户端：

```js
const { _android } = require('playwright');

(async () => {
  const device = await _android.connect('<wsEndpoint>');

  console.log(device.model());
  console.log(device.serial());
  await device.shell('am force-stop com.android.chrome');
  const context = await device.launchBrowser();

  const page = await context.newPage();
  await page.goto('https://webkit.org/');
  console.log(await page.evaluate(() => window.location.href));
  await page.screenshot({ path: 'page-chrome-1.png' });

  await context.close();
})();
```

**参数**

- <a id="android-launch-server-option-options"></a>`options` `Object` *(可选)*

  - <a id="android-launch-server-option-adb-host"></a>`adbHost` `string` *(可选)*

    建立 ADB 服务器连接的可选主机。默认为 `127.0.0.1`。
  - <a id="android-launch-server-option-adb-port"></a>`adbPort` `int` *(可选)*

    建立 ADB 服务器连接的可选端口。默认为 `5037`。
  - <a id="android-launch-server-option-device-serial-number"></a>`deviceSerialNumber` `string` *(可选)*

    用于启动浏览器的可选设备序列号。如果未指定，当连接多个设备时将抛出错误。
  - <a id="android-launch-server-option-host"></a>`host` `string` *(可选)* <Badge type="info" text="Added in: v1.45" />

    用于 web socket 的主机。这是可选的，默认为 `localhost`，仅接受来自回环接口的连接。传递显式地址（例如 `0.0.0.0`）以接受来自网络的连接 - 请注意，这会将设备 RPC 暴露给任何可以到达监听端口的对象。
  - <a id="android-launch-server-option-omit-driver-install"></a>`omitDriverInstall` `boolean` *(可选)*

    阻止在附加时自动安装 playwright 驱动程序。假设驱动程序已经安装。
  - <a id="android-launch-server-option-port"></a>`port` `int` *(可选)*

    用于 web socket 的端口。默认为 0，即选择任何可用端口。
  - <a id="android-launch-server-option-ws-path"></a>`wsPath` `string` *(可选)*

    提供 Android 服务器的路径。出于安全原因，默认为不可猜测的字符串。

    ::: warning
    任何知道 `wsPath` 的进程或网页（包括在 Playwright 中运行的）都可以控制操作系统用户。因此，使用此选项时应使用不可猜测的令牌。
    :::

**返回值**

- `Promise<BrowserServer>`


### android.setDefaultTimeout() {#android-set-default-timeout}

<Badge type="info" text="Added in: v1.9" />

此设置将更改所有接受 [`timeout`](/api/class-android#android-set-default-timeout-option-timeout) 选项的方法的默认最大时间。

**参数**

- <a id="android-set-default-timeout-option-timeout"></a>`timeout` `float`

  最大时间（毫秒）
