---
title: Electron
outline: 2
---

# Electron

<Badge type="info" text="Added in: v1.9" />

Playwright 对 Electron 自动化提供**实验性**支持。你可以通过以下方式访问 electron 命名空间：

```js
const { _electron } = require('playwright');
```

Electron 自动化脚本的示例如下：

```js
const { _electron: electron } = require('playwright');

(async () => {
  // 启动 Electron 应用。
  const electronApp = await electron.launch({ args: ['main.js'] });

  // 在 Electron 上下文中执行表达式。
  const appPath = await electronApp.evaluate(async ({ app }) => {
    // 这在 Electron 主进程中运行，这里的参数始终是
    // 主应用脚本中 require('electron') 的结果。
    return app.getAppPath();
  });
  console.log(appPath);

  // 获取应用打开的第一个窗口，如有必要则等待。
  const window = await electronApp.firstWindow();
  // 打印标题。
  console.log(await window.title());
  // 捕获截图。
  await window.screenshot({ path: 'intro.png' });
  // 将 Electron 控制台输出定向到 Node 终端。
  window.on('console', console.log);
  // 点击按钮。
  await window.click('text=Click me');
  // 退出应用。
  await electronApp.close();
})();
```

**支持的 Electron 版本：**
* v21+

**已知问题：**

如果你无法启动 Electron 并且在启动期间超时，请尝试以下操作：
* 确保 `nodeCliInspect`（[FuseV1Options.EnableNodeCliInspectArguments](https://www.electronjs.org/docs/latest/tutorial/fuses#nodecliinspect)）fuse **没有**设置为 `false`。

**模拟原生对话框：**

Playwright 不会拦截原生 Electron [dialog](https://www.electronjs.org/docs/latest/api/dialog) API
（`dialog.showOpenDialog`、`dialog.showSaveDialog`、`dialog.showMessageBox` 等），因为这些调用发生在 Electron 主进程中并直接转到操作系统 API。使用 [`electronApplication.evaluate()`](/api/class-electronapplication#electron-application-evaluate) 替换主进程中的相关方法，以便测试可以确定性地运行，而无需任何操作系统级别的 UI：

```js
// 模拟打开对话框，始终返回固定路径。
await electronApp.evaluate(({ dialog }, filePaths) => {
  dialog.showOpenDialog = () => Promise.resolve({ canceled: false, filePaths });
}, ['/path/to/file.txt']);

// 模拟保存对话框。
await electronApp.evaluate(({ dialog }, filePath) => {
  dialog.showSaveDialog = () => Promise.resolve({ canceled: false, filePath });
}, '/path/to/saved.txt');

// 模拟 showMessageBox，点击第一个按钮。
await electronApp.evaluate(({ dialog }) => {
  dialog.showMessageBox = () => Promise.resolve({ response: 0, checkboxChecked: false });
});
```

替换会持续到应用关闭。同步变体（`showOpenDialogSync`、`showSaveDialogSync`、`showMessageBoxSync`）可以以相同的方式模拟 - 只需直接返回值而不是 `Promise`。

## 方法

### electron.launch() {#electron-launch}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

启动由 [`executablePath`](/api/class-electron#electron-launch-option-executable-path) 指定的 electron 应用程序。

**参数**

- <a id="electron-launch-option-options"></a>`options` `Object` *(可选)*

  - <a id="electron-launch-option-accept-downloads"></a>`acceptDownloads` `boolean` *(可选)* <Badge type="info" text="Added in: v1.12" />

    是否自动下载所有附件。默认为 `true`，即接受所有下载。
  - <a id="electron-launch-option-args"></a>`args` `Array<string>` *(可选)*

    启动时传递给应用程序的附加参数。通常在这里传递主脚本名称。
  - <a id="electron-launch-option-artifacts-dir"></a>`artifactsDir` `path` *(可选)* <Badge type="info" text="Added in: v1.59" />

    如果指定，工件（trace、视频、下载、HAR 文件等）将保存到此目录。浏览器关闭时不会清理该目录。如果未指定，则使用临时目录，浏览器关闭时会清理。
  - <a id="electron-launch-option-bypass-csp"></a>`bypassCSP` `boolean` *(可选)* <Badge type="info" text="Added in: v1.12" />

    切换绕过页面的内容安全策略。默认为 `false`。
  - <a id="electron-launch-option-chromium-sandbox"></a>`chromiumSandbox` `boolean` *(可选)* <Badge type="info" text="Added in: v1.59" />

    启用 Chromium 沙箱。默认为 `false`。
  - <a id="electron-launch-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(可选)* <Badge type="info" text="Added in: v1.12" />

    模拟 [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 媒体特性，支持的值为 `'light'` 和 `'dark'`。有关更多详细信息，请参见 [`page.emulateMedia()`](/api/class-page#page-emulate-media)。传递 `null` 将模拟重置为系统默认值。默认为 `'light'`。
  - <a id="electron-launch-option-cwd"></a>`cwd` `string` *(可选)*

    启动应用程序的当前工作目录。
  - <a id="electron-launch-option-env"></a>`env` `Object<string, string>` *(可选)*

    指定对 Electron 可见的环境变量。默认为 `process.env`。
  - <a id="electron-launch-option-executable-path"></a>`executablePath` `string` *(可选)*

    启动给定的 Electron 应用程序。如果未指定，则启动此包中安装的默认 Electron 可执行文件，位于 `node_modules/.bin/electron`。
  - <a id="electron-launch-option-extra-http-headers"></a>`extraHTTPHeaders` `Object<string, string>` *(可选)* <Badge type="info" text="Added in: v1.12" />

    包含随每个请求发送的附加 HTTP 头的对象。默认为无。
  - <a id="electron-launch-option-geolocation"></a>`geolocation` `Object` *(可选)* <Badge type="info" text="Added in: v1.12" />

    - `latitude` `float` <Badge type="info" text="Added in: v1.12" />

      纬度，介于 -90 和 90 之间。
    - `longitude` `float` <Badge type="info" text="Added in: v1.12" />

      经度，介于 -180 和 180 之间。
    - `accuracy` `float` *(可选)* <Badge type="info" text="Added in: v1.12" />

      非负精度值。默认为 `0`。
  - <a id="electron-launch-option-http-credentials"></a>`httpCredentials` `Object | Array<Object>` *(可选)* <Badge type="info" text="Added in: v1.12" />

    用于 [HTTP 认证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)的凭据。
    如果未指定来源，用户名和密码将在收到未授权响应时发送到任何服务器。

    传递数组以为不同的来源使用不同的凭据。第一个与请求来源匹配的条目将被使用，没有来源的条目匹配任何请求。

    - `username` `string` <Badge type="info" text="Added in: v1.12" />
    - `password` `string` <Badge type="info" text="Added in: v1.12" />
    - `origin` `string` *(可选)* <Badge type="info" text="Added in: v1.12" />

      限制在特定来源（scheme://host:port）发送 http 凭据。
    - `send` `"unauthorized" | "always"` *(可选)* <Badge type="info" text="Added in: v1.12" />

      此选项仅适用于从相应 [APIRequestContext](/api/class-apirequestcontext) 发送的请求，不影响从浏览器发送的请求。`'always'` - 每个 API 请求都会发送带有基本认证凭据的 `Authorization` 头。`'unauthorized'` - 仅在收到带有 `WWW-Authenticate` 头的 401（未授权）响应时发送凭据。默认为 `'unauthorized'`。
  - <a id="electron-launch-option-ignore-https-errors"></a>`ignoreHTTPSErrors` `boolean` *(可选)* <Badge type="info" text="Added in: v1.12" />

    发送网络请求时是否忽略 HTTPS 错误。默认为 `false`。
  - <a id="electron-launch-option-locale"></a>`locale` `string` *(可选)* <Badge type="info" text="Added in: v1.12" />

    指定用户区域设置，例如 `en-GB`、`de-DE` 等。区域设置将影响 `navigator.language` 值、`Accept-Language` 请求头值以及数字和日期格式规则。默认为系统默认区域设置。在我们的[模拟指南](../emulation.md#locale--timezone)中了解更多关于模拟的信息。
  - <a id="electron-launch-option-offline"></a>`offline` `boolean` *(可选)* <Badge type="info" text="Added in: v1.12" />

    是否模拟网络离线。默认为 `false`。了解更多关于[网络模拟](../emulation.md#offline)。
  - <a id="electron-launch-option-record-har"></a>`recordHar` `Object` *(可选)* <Badge type="info" text="Added in: v1.12" />

    启用将所有页面的 [HAR](http://www.softwareishard.com/blog/har-12-spec) 记录到 `recordHar.path` 文件。如果未指定，则不记录 HAR。确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 以保存 HAR。

    - `omitContent` `boolean` *(可选)* <Badge type="info" text="Added in: v1.12" />

      控制是否从 HAR 中省略请求内容的可选设置。默认为 `false`。已弃用，请改用 `content` 策略。
    - `content` `"omit" | "embed" | "attach"` *(可选)* <Badge type="info" text="Added in: v1.12" />

      控制资源内容管理的可选设置。如果指定 `omit`，则不持久化内容。如果指定 `attach`，则资源作为单独的文件或 ZIP 存档中的条目持久化。如果指定 `embed`，则根据 HAR 规范将内容存储在 HAR 文件内联。`.zip` 输出文件默认为 `attach`，所有其他文件扩展名默认为 `embed`。
    - `path` `path` <Badge type="info" text="Added in: v1.12" />

      写入 HAR 文件的文件系统路径。如果文件名以 `.zip` 结尾，默认使用 `content: 'attach'`。
    - `mode` `"full" | "minimal"` *(可选)* <Badge type="info" text="Added in: v1.12" />

      当设置为 `minimal` 时，只记录从 HAR 路由所需的信息。这会省略大小、时间、页面、cookie、安全性和其他在从 HAR 重放时不使用的 HAR 信息类型。默认为 `full`。
    - `urlFilter` `string | RegExp` *(可选)* <Badge type="info" text="Added in: v1.12" />

      用于过滤存储在 HAR 中的请求的 glob 或正则表达式模式。当通过上下文选项提供 [`baseURL`](/api/class-browser#browser-new-context-option-base-url) 且传递的 URL 是路径时，它会通过 [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) 构造函数合并。默认为无。
  - <a id="electron-launch-option-record-video"></a>`recordVideo` `Object` *(可选)* <Badge type="info" text="Added in: v1.12" />

    启用将所有页面的视频录制到 `recordVideo.dir` 目录。如果未指定，则不录制视频。确保等待 [`browserContext.close()`](/api/class-browsercontext#browser-context-close) 以保存视频。

    - `dir` `path` *(可选)* <Badge type="info" text="Added in: v1.12" />

      放置视频的目录路径。如果未指定，视频将存储在 `artifactsDir` 中（参见 [`browserType.launch()`](/api/class-browsertype#browser-type-launch) 选项）。
    - `size` `Object` *(可选)* <Badge type="info" text="Added in: v1.12" />

      录制视频的可选尺寸。如果未指定，大小将等于缩放到适合 800x800 的 `viewport`。如果未显式配置 `viewport`，视频大小默认为 800x450。如果需要，每个页面的实际图片将缩小以适应指定的大小。

      - `width` `int` <Badge type="info" text="Added in: v1.12" />

        视频帧宽度。
      - `height` `int` <Badge type="info" text="Added in: v1.12" />

        视频帧高度。
    - `fps` `int` *(可选)* <Badge type="info" text="Added in: v1.12" />

      录制视频的帧率（每秒帧数）。默认为 `25`。Firefox 和 WebKit 目前最多捕获每秒 25 帧。
    - `showActions` `Object` *(可选)* <Badge type="info" text="Added in: v1.12" />

      如果指定，在视频录制期间对交互元素启用视觉注释。

      - `duration` `float` *(可选)* <Badge type="info" text="Added in: v1.12" />

        每个注释显示的时长（毫秒）。默认为 `500`。
      - `position` `"top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right"` *(可选)* <Badge type="info" text="Added in: v1.12" />

        操作标题覆盖层的位置。默认为 `"top-right"`。
      - `fontSize` `int` *(可选)* <Badge type="info" text="Added in: v1.12" />

        操作标题的字体大小（像素）。默认为 `24`。已弃用，请改用 `style.title`。
      - `cursor` `"none" | "pointer"` *(可选)* <Badge type="info" text="Added in: v1.12" />

        指针操作显示的光标装饰。`"pointer"`（默认）渲染一个从上一个操作点动画到下一个操作点的鼠标指针。`"none"` 禁用光标装饰。
      - `style` `Object` *(可选)* <Badge type="info" text="Added in: v1.12" />

        操作装饰的样式。

        - `point` `string` *(可选)* <Badge type="info" text="Added in: v1.12" />

          以操作点为中心的零大小标记的 CSS 声明。省略时不显示。
        - `highlight` `string` *(可选)* <Badge type="info" text="Added in: v1.12" />

          覆盖目标元素的框的 CSS 声明。省略时不显示。
        - `title` `string` *(可选)* <Badge type="info" text="Added in: v1.12" />

          操作标题的 CSS 声明。
  - <a id="electron-launch-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.15" />

    等待应用程序启动的最大时间（毫秒）。默认为 `30000`（30 秒）。传递 `0` 禁用超时。
  - <a id="electron-launch-option-timezone-id"></a>`timezoneId` `string` *(可选)* <Badge type="info" text="Added in: v1.12" />

    更改上下文的时区。有关支持的时区 ID 列表，请参见 [ICU 的 metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)。默认为系统时区。
  - <a id="electron-launch-option-traces-dir"></a>`tracesDir` `path` *(可选)* <Badge type="info" text="Added in: v1.36" />

    如果指定，trace 将保存到此目录。

**返回值**

- `Promise<ElectronApplication>`
