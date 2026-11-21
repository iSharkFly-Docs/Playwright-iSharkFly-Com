---
title: "发行说明"
---

# 发行说明

import LiteYouTube from '@site/src/components/LiteYouTube';

## 版本 1.65

### 🧾 Java 中的定位器代码

来自 [`locator.normalize()`](/java/api/class-locator#locator-normalize) 的定位器现在可以转换为 Java 代码字符串。将其与 [`page.getByRef()`](/java/api/class-page#page-get-by-ref) 一起使用，可以将代理在 `"ai"` 模式下从 [`page.ariaSnapshot()`](/java/api/class-page#page-aria-snapshot) 中选取的元素转换为测试代码：

```java
Locator normalized = page.getByRef("e2").normalize();
System.out.println(normalized.toString());
// getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Submit"))
```

### 新 API
- [`cdpSession.send()`](/java/api/class-cdpsession#cdp-session-send) 中的新选项 [`timeout`](/java/api/class-cdpsession#cdp-session-send-option-timeout)。

### 破坏性变更 ⚠️
- 诸如 [`locator.click()`](/java/api/class-locator#locator-click)、[`locator.check()`](/java/api/class-locator#locator-check)、[`locator.tap()`](/java/api/class-locator#locator-tap)、[`locator.fill()`](/java/api/class-locator#locator-fill)、[`locator.clear()`](/java/api/class-locator#locator-clear) 和 [`locator.selectOption()`](/java/api/class-locator#locator-select-option) 等操作现在会等待元素[不处于惰性状态](./actionability.md#not-inert)。对具有 `inert` 属性的元素或在此类元素内部的操作，如果元素保持惰性状态，现在会超时。
- Cookie 匹配现在遵循 RFC 6265。使用 URL 时，[`browserContext.cookies()`](/java/api/class-browsercontext#browser-context-cookies) 和 [`apiRequestContext.cookies()`](/java/api/class-apirequestcontext#api-request-context-cookies) 不再返回子域名的仅主机 cookie 或 `/apiv2` 的 `Path=/api` cookie，并且 `Path=/foo/` cookie 不匹配 `/foo`。[APIRequestContext](/java/api/class-apirequestcontext) 将没有名称的 cookie 作为 `Cookie: x` 而不是 `Cookie: =x` 发送，并将 `Set-Cookie: token` 存储为没有名称的 cookie。
- 代理凭据不再发送到网站。[`proxy`](/java/api/class-browsertype#browser-type-launch-option-proxy) 选项中的凭据现在只响应代理质询。要在网站上进行身份验证，请使用 [`httpCredentials`](/java/api/class-browser#browser-new-context-option-http-credentials)。
- 浏览器不渲染的文本（例如未分配到插槽的文本或直接位于关闭的 `<details>` 内的文本）不再是可访问名称和 aria 快照的一部分。这可能会改变带有名称的 [`page.getByRole()`](/java/api/class-page#page-get-by-role)、[`locator.ariaSnapshot()`](/java/api/class-locator#locator-aria-snapshot) 和 [`locatorAssertions.matchesAriaSnapshot()`](/java/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) 的结果。

### 浏览器版本
- Chromium 158.0.8127.18
- Mozilla Firefox 159.0
- WebKit 27.2

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 157
- Microsoft Edge 156

## 版本 1.64

### 🧰 WebMCP

新的 [`page.webmcp()`](/java/api/class-page#page-webmcp) 和 [`frame.webmcp()`](/java/api/class-frame#frame-webmcp) 可以访问页面通过实验性 [WebMCP](https://webmachinelearning.github.io/webmcp/) 浏览器 API 注册的工具，因此你可以像测试应用程序的任何其他部分一样测试它们：

```java
Browser browser = chromium.launch(new BrowserType.LaunchOptions()
    .setArgs(Arrays.asList("--enable-features=WebMCP")));
Page page = browser.newPage();
page.navigate("https://example.com");

for (WebMCPTool tool : page.webmcp().tools())
  System.out.println(tool.name + ": " + tool.description);

Object result = page.webmcp().callTool("add", Map.of("a", 2, "b", 40));
System.out.println(result); // {content=[{type=text, text=42}]}
```

[Playwright MCP](https://playwright.dev/mcp/introduction) 默认也支持 WebMCP，页面定义的工具以 `webmcp_<tool>` 的形式提供给代理。传递 `--no-webmcp` 可选择退出。

[`playwright-cli`](https://playwright.dev/agent-cli/introduction) 也暴露了它们：

```bash
playwright-cli webmcp-list
playwright-cli webmcp-call search_catalog --params '{"query":"cats"}'
```

### 🎬 更好的视频

现在可以以自定义帧率录制视频，并且操作的装饰使用纯 CSS 样式：

```java
page.screencast().start(new Screencast.StartOptions()
    .setPath(Paths.get("video.webm"))
    .setSize(1920, 1080)
    .setFps(60));
page.screencast().showActions(new Screencast.ShowActionsOptions()
    .setStyle(new ScreencastActionStyle()
        .setPoint("width: 20px; height: 20px; border-radius: 50%; background: red")
        .setHighlight("outline: 2px solid #333; background: rgba(0, 128, 255, .15)")
        .setTitle("font-size: 16px")));
```
- [`screencast.start()`](/java/api/class-screencast#screencast-start) 中的新 [`recordVideoFps`](/java/api/class-browser#browser-new-context-option-record-video-fps) 选项和新 [`fps`](/java/api/class-screencast#screencast-start-option-fps) 选项。Firefox 和 WebKit 目前最多每秒捕获 25 帧。
- 新 [`style`](/java/api/class-screencast#screencast-show-actions-option-style) 选项接受 `point` 标记、目标 `highlight` 和操作 `title` 的 CSS 声明。它取代了现已弃用的 `fontSize` 选项。
- 光标在最后一个操作点保持可见，在导航中保持存在，并沿着自然的缓动路径移动。
- 视频使用 VP9 而不是 VP8 编码，这占用更少的 CPU 并生成相同或更好质量的更小文件。
- 所有视频选项也可在 [Playwright MCP](https://playwright.dev/mcp/introduction) 和 [`playwright-cli`](https://playwright.dev/agent-cli/introduction) 中使用。

### 🪆 Locator.within()

新的 [`locator.within()`](/java/api/class-locator#locator-within) 组合你已有的两个定位器，按自然顺序读取——"这个按钮，在那个对话框内"：

```java
Locator saveButton = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Save"));
Locator dialog = page.getByTestId("settings-dialog");

saveButton.within(dialog).click();
```

相对定位器（如 [`locator.nth()`](/java/api/class-locator#locator-nth) 或 [`locator.first()`](/java/api/class-locator#locator-first)）在每个父元素内分别解析，这使得类似列的查询变得简单：

```java
// 每行的第三个单元格，而不是表中的第三个单元格。
Locator thirdColumn = page.getByRole(AriaRole.CELL).nth(2).within(page.getByRole(AriaRole.ROW));
assertThat(thirdColumn).hasText(new String[] {"Apple", "Banana", "Cherry"});
```

### 新 API
- 新 [`page.getByRef()`](/java/api/class-page#page-get-by-ref) 通过其 aria ref（如 `e2`）定位元素，该 ref 由 `"ai"` 模式下的 [`page.ariaSnapshot()`](/java/api/class-page#page-aria-snapshot) 报告。
- [`page.content()`](/java/api/class-page#page-content) 和 [`frame.content()`](/java/api/class-frame#frame-content) 中的新选项 [`includeShadow`](/java/api/class-page#page-content-option-include-shadow) 将开放的 shadow root 序列化为[声明式 shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html)。
- 新选项 [`signCount`](/java/api/class-credentials#credentials-create-option-sign-count) 设置虚拟凭据的初始签名计数器。[`credentials.create()`](/java/api/class-credentials#credentials-create) 和 [`credentials.get()`](/java/api/class-credentials#credentials-get) 返回当前的 `signCount`，并且它与存储状态中的凭据一起保存和恢复。
- 新 [`apiRequestContext.addCookies()`](/java/api/class-apirequestcontext#api-request-context-add-cookies)、[`apiRequestContext.cookies()`](/java/api/class-apirequestcontext#api-request-context-cookies) 和 [`apiRequestContext.clearCookies()`](/java/api/class-apirequestcontext#api-request-context-clear-cookies) 管理请求上下文的 cookie，与 [BrowserContext](/java/api/class-browsercontext) 方法一致：
  
  ```java
  request.addCookies(Arrays.asList(
      new Cookie("session-id", "42").setUrl("https://example.com")));
  System.out.println(request.cookies("https://example.com"));
  request.clearCookies(new APIRequestContext.ClearCookiesOptions().setName("session-id"));
  ```

### 破坏性变更 ⚠️
- 隐藏 iframe 内的元素被视为隐藏。不可见的 iframe 内的元素（例如带有 `visibility: hidden` 的 iframe）现在被操作、[`locator.isVisible()`](/java/api/class-locator#locator-is-visible) 和 [`locatorAssertions.isVisible()`](/java/api/class-locatorassertions#locator-assertions-to-be-visible) 视为隐藏。

### 浏览器版本
- Chromium 156.0.8078.4
- Mozilla Firefox 157.0
- WebKit 27.2

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 155
- Microsoft Edge 155

## 版本 1.63

### 🪟 跨帧定位

不带选择器调用的 [`page.frameLocator()`](/java/api/class-page#page-frame-locator) 和 [`frame.frameLocator()`](/java/api/class-frame#frame-frame-locator) 会在子树的任何帧中搜索，因此你不再需要先定位 iframe：

```java
// 在页面的任何帧中找到按钮。
page.frameLocator().getByRole(AriaRole.BUTTON).click();
```

定位器的其余部分在单个帧内解析，就像常规定位器一样，当它匹配多个帧中的元素时会抛出错误。

### 👁️ 仅可见定位器

新的 [`locator.visible()`](/java/api/class-locator#locator-visible) 返回一个仅匹配可见元素的定位器。它是 `:visible` CSS 伪类的推荐替代品：

```java
page.locator("button").visible().click();
```

### 🖼️ 跟踪中的 Aria 和屏幕快照

[`tracing.start()`](/java/api/class-tracing#tracing-start) 的新 [`ariaSnapshots`](/java/api/class-tracing#tracing-start-option-aria-snapshots) 和 [`screenSnapshots`](/java/api/class-tracing#tracing-start-option-screen-snapshots) 选项在每个操作时捕获页面的 aria 快照和屏幕截图：

```java
context.tracing().start(new Tracing.StartOptions()
  .setSnapshots(true)
  .setAriaSnapshots(true)
  .setScreenSnapshots(true));
```

录制了 aria 和屏幕快照后，跟踪查看器中的新**显示 Aria** 模式会将操作屏幕截图与 aria 快照并排显示，悬停在 aria 节点上会在屏幕截图上高亮显示它。

### ☕ 空值注解

公共 API 现在使用 [JSpecify](https://jspecify.dev) 空值注解进行注释。`com.microsoft.playwright`、`com.microsoft.playwright.options` 和 `com.microsoft.playwright.assertions` 包是 `@NullMarked`，可能缺失的值标记为 `@Nullable`，因此空值检查工具（如 NullAway）以及 Kotlin 代码可以在编译时捕获缺失的空值检查。

### 新 API

#### 浏览器和上下文
- [`httpCredentials`](/java/api/class-browser#browser-new-context-option-http-credentials) 现在也接受凭据数组。使用与请求来源匹配的第一个条目，没有来源的条目匹配任何请求。
- 新选项 [`opfs`](/java/api/class-browsercontext#browser-context-storage-state-option-opfs) 在存储状态中包含[源私有文件系统](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)，以便可以持久化并恢复到后续上下文中。
- 新事件 [`page.onDialogClosed()`](/java/api/class-page#page-event-dialog-closed) 和 [`browserContext.onDialogClosed()`](/java/api/class-browsercontext#browser-context-event-dialog-closed) 在 JavaScript 对话框被接受、关闭或被用户关闭时触发。

#### 命令行
- `mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install --no-remove"` 保留其他 Playwright 安装的浏览器，而不是删除它们。
- `mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="codegen --http-credentials"` 对受 HTTP 身份验证保护的页面进行录制。

### 公告
* ⚠️ 不再支持 Ubuntu 20.04。
* 🐧 在 Linux arm64 上，Playwright 现在下载 [Chrome for Testing](https://developer.chrome.com/blog/chrome-for-testing) 版本的 Chromium，与所有其他平台使用的版本相同。

### 浏览器版本
- Chromium 153.0.8010.12
- Mozilla Firefox 155.0
- WebKit 26.6

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 153
- Microsoft Edge 153

## 版本 1.62

### 🖼️ WebP 截图

[`page.screenshot()`](/java/api/class-page#page-screenshot) 和 [`locator.screenshot()`](/java/api/class-locator#locator-screenshot) 现在可以以 WebP 格式捕获截图——Playwright 从 `.webp` 文件扩展名推断格式，或者你可以显式设置 `type`。质量 `100`（默认）是无损的，较低的值使用有损压缩：

```java
page.screenshot(new Page.ScreenshotOptions()
    .setPath(Paths.get("homepage.webp"))
    .setQuality(50));
```

### 新 API
- 操作上的新 `scroll` 选项（`"auto"` | `"none"`）可选择退出 Playwright 的自动滚动到视图。
- 新 [`locator.waitForFunction()`](/java/api/class-locator#locator-wait-for-function) 等待直到函数（使用匹配元素调用）返回真值。
- 新 [`apiResponse.timing()`](/java/api/class-apiresponse#api-response-timing) 返回 API 响应的资源计时信息。

### 公告
* 📋 剪贴板现在在无头模式下与操作系统隔离，因此使用 `navigator.clipboard` 的测试不再读取或覆盖运行它们的机器的剪贴板。
* ⚠️ 不再支持 Debian 11。

### 浏览器版本
- Chromium 151.0.7922.34
- Mozilla Firefox 153.0
- WebKit 26.5

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 151
- Microsoft Edge 151

## 版本 1.61

### 🔑 WebAuthn 通行密钥

新的 [Credentials](/java/api/class-credentials) 虚拟认证器，通过 [`browserContext.credentials()`](/java/api/class-browsercontext#browser-context-credentials) 可用，允许测试注册通行密钥并响应页面中的 `navigator.credentials.create()` / `navigator.credentials.get()` 仪式——无需真实硬件密钥，在所有浏览器中都能工作：

```java
BrowserContext context = browser.newContext();

// 为测试用户播种后端提供的通行密钥。
context.credentials().create("example.com", new Credentials.CreateOptions()
    .setId(credentialId)
    .setUserHandle(userHandle)
    .setPrivateKey(privateKey)
    .setPublicKey(publicKey));
context.credentials().install();

Page page = context.newPage();
page.navigate("https://example.com/login");
// 页面的 navigator.credentials.get() 使用播种的通行密钥响应。
```

你也可以让应用程序在设置测试中注册一次通行密钥，使用 [`credentials.get()`](/java/api/class-credentials#credentials-get) 读取它，并在后续测试中播种它——详见 [Credentials](/java/api/class-credentials)。

### 🗃️ Web 存储

新的 [WebStorage](/java/api/class-webstorage) API，通过 [`page.localStorage()`](/java/api/class-page#page-local-storage) 和 [`page.sessionStorage()`](/java/api/class-page#page-session-storage) 可用，读取和写入当前源的页面存储：

```java
page.localStorage().setItem("token", "abc");
String token = page.localStorage().getItem("token");
List<NameValue> items = page.sessionStorage().items();
```

### 新 API
- [`apiResponse.securityDetails()`](/java/api/class-apiresponse#api-response-security-details) 和 [`apiResponse.serverAddr()`](/java/api/class-apiresponse#api-response-server-addr) 与浏览器端的 [`response.securityDetails()`](/java/api/class-response#response-security-details) 和 [`response.serverAddr()`](/java/api/class-response#response-server-addr) 对应。
- [`browserType.connectOverCDP()`](/java/api/class-browsertype#browser-type-connect-over-cdp) 中的新选项 `artifactsDir` 控制连接到现有浏览器时存储跟踪和下载等工件的位置。
- [`screencast.showActions()`](/java/api/class-screencast#screencast-show-actions) 中的新选项 `cursor` 控制为指针操作渲染的光标装饰。
- [`screencast.start()`](/java/api/class-screencast#screencast-start) 中的 `onFrame` 回调现在接收帧由浏览器呈现时的 `timestamp`。

### 🛠️ 其他改进
- Playwright 现在支持 Ubuntu 26.04。
- HAR 和跟踪录制现在包含 WebSocket 请求。

### 浏览器版本
- Chromium 149.0.7827.55
- Mozilla Firefox 151.0
- WebKit 26.5

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 149
- Microsoft Edge 149

## 版本 1.60

### 🌐 跟踪上的 HAR 录制

[`tracing.startHar()`](/java/api/class-tracing#tracing-start-har) / [`tracing.stopHar()`](/java/api/class-tracing#tracing-stop-har) 将 HAR 录制作为一流的跟踪 API 公开，具有与 `recordHar` 相同的 `content`、`mode` 和 `urlFilter` 选项：

```java
context.tracing().startHar(Paths.get("trace.har"));
Page page = context.newPage();
page.navigate("https://playwright.dev");
context.tracing().stopHar();
```

### 🪝 Drop API

新的 [`locator.drop()`](/java/api/class-locator#locator-drop) 模拟将文件或类似剪贴板的数据外部拖放到元素上。Playwright 在页面上下文中分发 `dragenter`、`dragover` 和 `drop` 以及合成的 [DataTransfer]——跨浏览器工作，非常适合测试上传区域：

```java
page.locator("#dropzone").drop(new Locator.DropPayload()
    .setFiles(new FilePayload("note.txt", "text/plain", "hello".getBytes(StandardCharsets.UTF_8))));

page.locator("#dropzone").drop(new Locator.DropPayload()
    .setData(Map.of(
        "text/plain", "hello world",
        "text/uri-list", "https://example.com")));
```

### 🎯 Aria 快照
- [`pageAssertions.matchesAriaSnapshot()`](/java/api/class-pageassertions#page-assertions-to-match-aria-snapshot) 现在可以在 [Page](/java/api/class-page) 上工作，除了 [Locator](/java/api/class-locator)——等同于对 `page.locator("body")` 进行断言。
- [`locator.ariaSnapshot()`](/java/api/class-locator#locator-aria-snapshot) / [`page.ariaSnapshot()`](/java/api/class-page#page-aria-snapshot) 上的新 `boxes` 选项将每个元素的边界框附加为 `[box=x,y,width,height]`，对 AI 消费很有用。

### 新 API

#### 浏览器、上下文和页面
- 事件 [`browser.onContext()`](/java/api/class-browser#browser-event-context)——在浏览器上创建新上下文时触发。
- [BrowserContext](/java/api/class-browsercontext) 现在镜像其页面的生命周期事件：[`browserContext.onDownload()`](/java/api/class-browsercontext#browser-context-event-download)、[`browserContext.onFrameAttached()`](/java/api/class-browsercontext#browser-context-event-frame-attached)、[`browserContext.onFrameDetached()`](/java/api/class-browsercontext#browser-context-event-frame-detached)、[`browserContext.onFrameNavigated()`](/java/api/class-browsercontext#browser-context-event-frame-navigated)、[`browserContext.onPageClose()`](/java/api/class-browsercontext#browser-context-event-page-close)、[`browserContext.onPageLoad()`](/java/api/class-browsercontext#browser-context-event-page-load)。

#### 定位器和断言
- [`page.getByRole()`](/java/api/class-page#page-get-by-role) / [`locator.getByRole()`](/java/api/class-locator#locator-get-by-role) / [`frame.getByRole()`](/java/api/class-frame#frame-get-by-role) / [`frameLocator.getByRole()`](/java/api/class-framelocator#frame-locator-get-by-role) 中的新选项 `description` 用于匹配[可访问描述](https://www.w3.org/TR/wai-aria-1.2/#dfn-accessible-description)。
- [`locatorAssertions.hasCSS()`](/java/api/class-locatorassertions#locator-assertions-to-have-css) 中的新选项 `pseudo` 从 `::before` 或 `::after` 读取计算样式。
- [`locator.highlight()`](/java/api/class-locator#locator-highlight) 中的新选项 `style` 将额外的内联 CSS 应用于高亮覆盖层，加上新的 [`page.hideHighlight()`](/java/api/class-page#page-hide-highlight) 清除所有高亮。

#### 网络
- [`webSocketRoute.protocols()`](/java/api/class-websocketroute#web-socket-route-protocols) 返回页面请求的 WebSocket 子协议。
- [`browserType.connectOverCDP()`](/java/api/class-browsertype#browser-type-connect-over-cdp) 中的新选项 `noDefaults` 禁用 Playwright 对默认上下文的默认覆盖（下载行为、焦点模拟、媒体模拟），因此连接到用户的日常浏览器不会打扰其状态。

#### 错误
- 新 [`webError.location()`](/java/api/class-weberror#web-error-location) 与 [`consoleMessage.location()`](/java/api/class-consolemessage#console-message-location) 对应。

### 🛠️ 其他改进
- 跟踪查看器在网络详细信息面板中为 JSON / 表单请求和响应正文添加了美化切换。

### 破坏性变更 ⚠️
- 移除了 `BrowserContext.exposeBinding` 和 `Page.exposeBinding` 上长期弃用的 `handle` 选项。

### 浏览器版本
- Chromium 148.0.7778.96
- Mozilla Firefox 150.0.2
- WebKit 26.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 147
- Microsoft Edge 147

## 版本 1.59

### 🎬 屏幕录制

新的 [`page.screencast()`](/java/api/class-page#page-screencast) API 提供了统一的界面来捕获页面内容，包括：
- 屏幕录制
- 操作注释
- 视觉覆盖层
- 实时帧捕获
- 代理视频收据

<center>

<img src="https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/images/release-notes-1.59-screencast-demo.gif" alt="演示" width="500" height="313" />

</center>

**屏幕录制**——使用精确的开始/停止控制录制视频，作为 [`recordVideoDir`](/java/api/class-browser#browser-new-context-option-record-video-dir) 选项的替代：

```java
page.screencast().start(new Screencast.StartOptions().setPath(Paths.get("video.webm")));
// ... 执行操作 ...
page.screencast().stop();
```

**操作注释**——启用内置的视觉注释，在录制期间高亮显示交互的元素并显示操作标题：

```java
page.screencast().showActions(new Screencast.ShowActionsOptions().setPosition("top-right"));
```

[`screencast.showActions()`](/java/api/class-screencast#screencast-show-actions) 接受 `position`（`"top-left"`、`"top"`、`"top-right"`、`"bottom-left"`、`"bottom"`、`"bottom-right"`）、`duration`（每个注释的毫秒数）和 `fontSize`（像素）。返回一个可释放对象以停止显示操作。

**视觉覆盖层**——在页面顶部添加章节标题和自定义 HTML 覆盖层以实现更丰富的叙述：

```java
page.screencast().showChapter("添加待办事项",
    new Screencast.ShowChapterOptions()
        .setDescription("为每个待办事项输入并按回车")
        .setDuration(1000));

page.screencast().showOverlay("<div style=\"color: red\">录制中</div>");
```

**实时帧捕获**——流式传输 JPEG 编码的帧用于自定义处理，如缩略图、实时预览、AI 视觉等：

```java
page.screencast().start(new Screencast.StartOptions()
    .setOnFrame(frame -> sendToVisionModel(frame.data)));
```

**代理视频收据**——编码代理可以生成其工作的视频证据。完成任务后，代理可以录制带有丰富注释的演练视频供人工审查：

```java
page.screencast().start(new Screencast.StartOptions()
    .setPath(Paths.get("receipt.webm")));
page.screencast().showActions(new Screencast.ShowActionsOptions().setPosition("top-right"));

page.screencast().showChapter("验证结账流程",
    new Screencast.ShowChapterOptions()
        .setDescription("根据工单 #1234 添加了优惠券代码支持"));

// 代理执行验证步骤...
page.locator("#coupon").fill("SAVE20");
page.locator("#apply-coupon").click();
assertThat(page.locator(".discount")).containsText("20%");

page.screencast().showChapter("完成",
    new Screencast.ShowChapterOptions()
        .setDescription("优惠券已应用，折扣反映在总计中"));

page.screencast().stop();
```

生成的视频作为收据：章节标题提供上下文，操作注释高亮每个交互，视觉演练比文本日志更快审查。

### 🔍 快照和定位器
- 方法 [`page.ariaSnapshot()`](/java/api/class-page#page-aria-snapshot) 捕获页面的 aria 快照——等同于 `page.locator("body").ariaSnapshot()`。
- [`locator.ariaSnapshot()`](/java/api/class-locator#locator-aria-snapshot) 中的选项 `depth` 和 `mode`。
- 方法 [`locator.normalize()`](/java/api/class-locator#locator-normalize) 将定位器转换为遵循最佳实践，如测试 ID 和 aria 角色。
- 方法 [`page.pickLocator()`](/java/api/class-page#page-pick-locator) 进入交互模式，悬停在元素上会高亮显示它们并显示相应的定位器。单击元素以获取其 [Locator](/java/api/class-locator)。使用 [`page.cancelPickLocator()`](/java/api/class-page#page-cancel-pick-locator) 取消。

### 新 API

#### 屏幕录制
- [`page.screencast()`](/java/api/class-page#page-screencast) 提供视频录制、实时帧流和覆盖层管理。
- 方法 [`screencast.start()`](/java/api/class-screencast#screencast-start) 和 [`screencast.stop()`](/java/api/class-screencast#screencast-stop) 用于录制和帧捕获。
- 方法 [`screencast.showActions()`](/java/api/class-screencast#screencast-show-actions) 和 [`screencast.hideActions()`](/java/api/class-screencast#screencast-hide-actions) 用于操作注释。
- 方法 [`screencast.showChapter()`](/java/api/class-screencast#screencast-show-chapter) 和 [`screencast.showOverlay()`](/java/api/class-screencast#screencast-show-overlay) 用于视觉覆盖层。
- 方法 [`screencast.showOverlays()`](/java/api/class-screencast#screencast-show-overlays) 和 [`screencast.hideOverlays()`](/java/api/class-screencast#screencast-hide-overlays) 用于覆盖层可见性控制。

#### 存储、控制台和错误
- 方法 [`browserContext.setStorageState()`](/java/api/class-browsercontext#browser-context-set-storage-state) 清除所有源的现有 cookie、本地存储和 IndexedDB 并设置新的存储状态——无需创建新上下文。
- 方法 [`page.clearConsoleMessages()`](/java/api/class-page#page-clear-console-messages) 和 [`page.clearPageErrors()`](/java/api/class-page#page-clear-page-errors) 清除存储的消息和错误。
- [`page.consoleMessages()`](/java/api/class-page#page-console-messages) 和 [`page.pageErrors()`](/java/api/class-page#page-page-errors) 中的选项 `filter` 控制返回哪些消息。
- 方法 [`consoleMessage.timestamp()`](/java/api/class-consolemessage#console-message-timestamp)。

#### 其他
- [`browserContext.debugger()`](/java/api/class-browsercontext#browser-context-debugger) 提供对 Playwright 调试器的程序化控制。
- 方法 [`browserContext.isClosed()`](/java/api/class-browsercontext#browser-context-is-closed)。
- 方法 [`request.existingResponse()`](/java/api/class-request#request-existing-response) 返回响应而无需等待。
- 方法 [`response.httpVersion()`](/java/api/class-response#response-http-version) 返回响应使用的 HTTP 版本。
- [`tracing.start()`](/java/api/class-tracing#tracing-start) 中的选项 `live` 用于实时跟踪更新。
- [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch) 中的选项 `artifactsDir` 用于配置工件目录。

### 🔗 互操作性

新的 [`browser.bind()`](/java/api/class-browser#browser-bind) API 使启动的浏览器可供 `playwright-cli`、`@playwright/mcp` 和其他客户端连接。

**绑定浏览器**——启动浏览器并绑定它以便其他人可以连接：

```java
Browser.BindResult serverInfo = browser.bind("my-session",
    new Browser.BindOptions().setWorkspaceDir("/my/project"));
```

**从 playwright-cli 连接**——从你喜欢的编码代理连接到正在运行的浏览器。

```bash
playwright-cli attach my-session
playwright-cli -s my-session snapshot
```

**从 @playwright/mcp 连接**——或将你的 MCP 服务器指向正在运行的浏览器。

```bash
@playwright/mcp --endpoint=my-session
```

**从 Playwright 客户端连接**——使用 API 连接到浏览器。支持同时多个客户端！

```java
Browser browser = chromium.connect(serverInfo.endpoint);
```

传递 `host` 和 `port` 选项以通过 WebSocket 而不是命名管道进行绑定：

```java
Browser.BindResult serverInfo = browser.bind("my-session",
    new Browser.BindOptions().setHost("localhost").setPort(0));
// serverInfo.endpoint 是 ws:// URL
```

调用 [`browser.unbind()`](/java/api/class-browser#browser-unbind) 停止接受新连接。

### 📊 可观察性

运行 `playwright-cli show` 打开仪表板，列出所有绑定的浏览器、它们的状态，并允许与它们交互：
- 查看你的代理在后台浏览器上做什么
- 点击进入会话进行手动干预
- 打开开发者工具检查后台浏览器的页面。

<center>

<img src="https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/images/release-notes-1.59-dashboard.png" alt="演示" width="1169" height="835" />

</center>
- `playwright-cli` 自动绑定其所有浏览器，以便你可以看到代理在做什么。
- 传递 `PLAYWRIGHT_DASHBOARD=1` 环境变量以在仪表板中查看所有 `@playwright/test` 浏览器。

### 破坏性变更 ⚠️
- 移除了 macOS 14 对 WebKit 的支持。我们建议升级你的 macOS 版本，或保持使用较旧的 Playwright 版本。

### 浏览器版本
- Chromium 147.0.7727.15
- Mozilla Firefox 148.0.2
- WebKit 26.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 146
- Microsoft Edge 146

## 版本 1.58

### UI 模式和跟踪查看器改进
- 新的"system"主题选项跟随你的操作系统深色/浅色模式偏好
- 代码编辑器中现在可以使用搜索功能（Cmd/Ctrl+F）
- 网络详细信息面板已重新组织以提高可用性
- JSON 响应现在自动格式化以提高可读性

感谢 [@cpAdm](https://github.com/cpAdm) 贡献这些改进！

### 其他

[`browserType.connectOverCDP()`](/java/api/class-browsertype#browser-type-connect-over-cdp) 现在接受 `isLocal` 选项。当设置为 `true` 时，它告诉 Playwright 它与 CDP 服务器在同一主机上运行，从而启用文件系统优化。

### 破坏性变更 ⚠️
- 移除了 `_react` 和 `_vue` 选择器。请参阅[定位器指南](./locators.md)了解替代方案。
- 移除了 `:light` 选择器引擎后缀。请改用标准 CSS 选择器。
- [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch) 中的 `devtools` 选项已被移除。请改用 `setArgs(Arrays.asList("--auto-open-devtools-for-tabs"))`。
- 移除了 macOS 13 对 WebKit 的支持。我们建议升级你的 macOS 版本，或继续使用较旧的 Playwright 版本。

### 浏览器版本
- Chromium 145.0.7632.6
- Mozilla Firefox 146.0.1
- WebKit 26.0

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 144
- Microsoft Edge 144

## 版本 1.57

### Chrome for Testing

Playwright 现在运行在 [Chrome for Testing](https://googlechromelabs.github.io/chrome-for-testing/) 构建上而不是 Chromium。有头模式使用 `chrome`；无头模式使用 `chrome-headless-shell`。升级到 v1.57 后，现有测试应该继续通过。

我们预计此切换不会带来功能变化。最大的变化是工具栏中的新图标和标题。

![新旧 logo](/images/cft-logo-change.png)

如果你仍然看到意外的行为变化，请[提交问题](https://github.com/microsoft/playwright/issues/new)。

在 Arm64 Linux 上，Playwright 继续使用 Chromium。

### 破坏性变更

在弃用 3 年后，我们从 API 中移除了 `page.accessibility()`。如果你需要测试页面可访问性，请使用其他库，如 [Axe](https://www.deque.com/axe/)。请参阅我们的 Node.js [指南](https://playwright.dev/docs/accessibility-testing)了解与 Axe 的集成。

### 新 API
- [`worker.onConsole()`](/java/api/class-worker#worker-event-console) 事件在 worker 中的 JavaScript 调用控制台 API 方法（如 console.log 或 console.dir）时触发。[`worker.waitForConsoleMessage()`](/java/api/class-worker#worker-wait-for-console-message) 可用于等待它。
- [`locator.description()`](/java/api/class-locator#locator-description) 返回之前使用 [`locator.describe()`](/java/api/class-locator#locator-describe) 设置的定位器描述。
- [`locator.click()`](/java/api/class-locator#locator-click) 和 [`locator.dragTo()`](/java/api/class-locator#locator-drag-to) 中的新选项 [`steps`](/java/api/class-locator#locator-click-option-steps) 配置将鼠标指针移动到目标元素时发出的 `mousemove` 事件数量。

### 浏览器版本
- Chromium 143.0.7499.4
- Mozilla Firefox 144.0.2
- WebKit 26.0

## 版本 1.56

### 新 API
- 新方法 [`page.consoleMessages()`](/java/api/class-page#page-console-messages) 和 [`page.pageErrors()`](/java/api/class-page#page-page-errors) 用于检索页面最近的控制台消息
- 新方法 [`page.requests()`](/java/api/class-page#page-requests) 用于检索页面最近的网络请求

### 破坏性变更
- 事件 [`browserContext.onBackgroundPage()`](/java/api/class-browsercontext#browser-context-event-background-page) 已被弃用，不再触发。方法 [`browserContext.backgroundPages()`](/java/api/class-browsercontext#browser-context-background-pages) 将返回空列表

### 其他
- Aria 快照渲染和比较 `input` 的 `placeholder`

### 浏览器版本
- Chromium 141.0.7390.37
- Mozilla Firefox 142.0.1
- WebKit 26.0

## 版本 1.55

### 代码生成
- 自动 `isVisible()` 断言：代码生成现在可以为常见 UI 交互生成自动 `isVisible()` 断言。可以在代码生成设置 UI 中启用此功能。

### 破坏性变更
- ⚠️ 不再支持 Chromium 扩展 manifest v2。

### 其他
- 添加了对 Debian 13 "Trixie" 的支持。

### 浏览器版本
- Chromium 140.0.7339.16
- Mozilla Firefox 141.0
- WebKit 26.0

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 139
- Microsoft Edge 139

## 版本 1.54

### 亮点
- [`browserContext.cookies()`](/java/api/class-browsercontext#browser-context-cookies) 和 [`browserContext.addCookies()`](/java/api/class-browsercontext#browser-context-add-cookies) 中的新 cookie 属性 `partitionKey`。此属性允许保存和恢复分区 cookie。有关更多信息，请参阅 [CHIPS MDN 文章](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies)。请注意，浏览器对 cookie 分区有不同的支持和默认值。
- 多个命令中的新选项 `--user-data-dir`。你可以指定相同的用户数据目录以在会话之间重用浏览状态，如身份验证。
  
  ```bash
  mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="codegen --user-data-dir=./user-data"
  ```
- `mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args=open` 命令不再打开测试录制器。请改用 `mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args=codegen`。

### 浏览器版本
- Chromium 139.0.7258.5
- Mozilla Firefox 140.0.2
- WebKit 26.0

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 140
- Microsoft Edge 140

## 版本 1.53

### 跟踪查看器和 HTML 报告更新
- 跟踪查看器中的新步骤：
  
  <img src="https://github.com/user-attachments/assets/1963ff7d-4070-41be-a79b-4333176921a2" alt="新跟踪查看器步骤" width="1562" height="1364" />
- 新方法 [`locator.describe()`](/java/api/class-locator#locator-describe) 用于描述定位器。用于跟踪查看器。
  
  ```java
  Locator button = page.getByTestId("btn-sub").describe("订阅按钮");
  button.click();
  ```
- `mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install --list"` 现在将列出所有已安装的浏览器、版本和位置。

### 浏览器版本
- Chromium 138.0.7204.4
- Mozilla Firefox 139.0
- WebKit 18.5

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 137
- Microsoft Edge 137

## 版本 1.52

### 亮点
- 新方法 [`locatorAssertions.containsClass()`](/java/api/class-locatorassertions#locator-assertions-to-contain-class) 用于优雅地断言元素上的各个类名。
  
  ```java
    assertThat(page.getByRole(AriaRole.LISTITEM, new Page.GetByRoleOptions().setName("Ship v1.52"))).containsClass("done");
  ```
- [Aria 快照](./aria-snapshots.md) 获得了两个新属性：用于严格匹配的 [`/children`](./aria-snapshots.md#strict-matching) 和用于链接的 [`/url`](./aria-snapshots.md#links)。
  
  ```java
  assertThat(locator).toMatchAriaSnapshot("""
    - list
      - /children: equal
      - listitem: Feature A
      - listitem:
        - link "Feature B":
          - /url: "https://playwright.dev"
  """);
  ```

### 其他
- [`apiRequest.newContext()`](/java/api/class-apirequest#api-request-new-context) 中的新选项 [`maxRedirects`](/java/api/class-apirequest#api-request-new-context-option-max-redirects) 用于控制最大重定向次数。

### 破坏性变更
- [`page.route()`](/java/api/class-page#page-route) 等方法中的 Glob URL 模式不再支持 `?` 和 `[]`。我们建议改用正则表达式。
- 方法 [`route.resume()`](/java/api/class-route#route-continue) 不再允许覆盖 `Cookie` 头。如果提供了 `Cookie` 头，它将被忽略，cookie 将从浏览器的 cookie 存储中加载。要设置自定义 cookie，请使用 [`browserContext.addCookies()`](/java/api/class-browsercontext#browser-context-add-cookies)。
- macOS 13 现已弃用，将不再接收 WebKit 更新。请升级到更新的 macOS 版本以继续受益于最新的 WebKit 改进。

### 浏览器版本
- Chromium 136.0.7103.25
- Mozilla Firefox 137.0
- WebKit 18.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 135
- Microsoft Edge 135

## 版本 1.51

### 亮点
* [`browserContext.storageState()`](/java/api/class-browsercontext#browser-context-storage-state) 的新选项 [`indexedDB`](/java/api/class-browsercontext#browser-context-storage-state-option-indexed-db) 允许保存和恢复 IndexedDB 内容。当你的应用程序使用 [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 存储身份验证令牌（如 Firebase Authentication）时很有用。
  
  以下是遵循[身份验证指南](./auth.md#reusing-signed-in-state)的示例：
  
  ```java
  // 将存储状态保存到文件中。确保包含 IndexedDB。
  context.storageState(new BrowserContext.StorageStateOptions()
      .setPath(Paths.get("state.json"))
      .setIndexedDB(true));
  
  // 使用保存的存储状态创建新上下文。
  BrowserContext context = browser.newContext(new Browser.NewContextOptions()
      .setStorageStatePath(Paths.get("state.json")));
  ```
* [`locator.filter()`](/java/api/class-locator#locator-filter) 的新选项 [`visible`](/java/api/class-locator#locator-filter-option-visible) 允许仅匹配可见元素。
  
  ```java
  // 忽略不可见的待办事项。
  Locator todoItems = page.getByTestId("todo-item")
      .filter(new Locator.FilterOptions().setVisible(true));
  // 检查正好有 3 个可见项。
  assertThat(todoItems).hasCount(3);
  ```
* 方法 [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) 和 [`browser.newContext()`](/java/api/class-browser#browser-new-context) 的新选项 `setContrast` 允许模拟 `prefers-contrast` 媒体特性。
* 新选项 [`failOnStatusCode`](/java/api/class-apirequest#api-request-new-context-option-fail-on-status-code) 使通过 [APIRequestContext](/java/api/class-apirequestcontext) 发出的所有获取请求在响应代码不是 2xx 和 3xx 时抛出异常。

### 浏览器版本
* Chromium 134.0.6998.35
* Mozilla Firefox 135.0
* WebKit 18.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 133
* Microsoft Edge 133

## 版本 1.50

### 其他
* 添加了方法 [`locatorAssertions.hasAccessibleErrorMessage()`](/java/api/class-locatorassertions#locator-assertions-to-have-accessible-error-message) 来断言定位器指向具有给定 [aria errormessage](https://w3c.github.io/aria/#aria-errormessage) 的元素。

### UI 更新
* 代码生成中用于选取元素以生成 aria 快照的新按钮。
* 跟踪中现在在操作 API 调用旁边显示附加详细信息（如按下的键）。
* 跟踪中 `canvas` 内容的显示容易出错。现在默认禁用显示，可以通过 `Display canvas content` UI 设置启用。
* `Call` 和 `Network` 面板现在显示额外的时间信息。

### 破坏性变更
* [`locatorAssertions.isEditable()`](/java/api/class-locatorassertions#locator-assertions-to-be-editable) 和 [`locator.isEditable()`](/java/api/class-locator#locator-is-editable) 现在如果目标元素不是 `<input>`、`<select>` 或许多其他可编辑元素，将抛出异常。

### 浏览器版本
* Chromium 133.0.6943.16
* Mozilla Firefox 134.0
* WebKit 18.2

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 132
* Microsoft Edge 132

## 版本 1.49

### Aria 快照

新断言 [`locatorAssertions.matchesAriaSnapshot()`](/java/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) 通过与预期的可访问性树（以 YAML 表示）进行比较来验证页面结构。

```java
page.navigate("https://playwright.dev");
assertThat(page.locator("body")).matchesAriaSnapshot("""
  - banner:
    - heading /Playwright enables reliable/ [level=1]
    - link "Get started"
    - link "Star microsoft/playwright on GitHub"
  - main:
    - img "Browsers (Chromium, Firefox, WebKit)"
    - heading "Any browser • Any platform • One API"
""");
```

你可以使用[测试生成器](./codegen)或调用 [`locator.ariaSnapshot()`](/java/api/class-locator#locator-aria-snapshot) 生成此断言。

在 [aria 快照指南](./aria-snapshots)中了解更多。

### 跟踪分组

新方法 [`tracing.group()`](/java/api/class-tracing#tracing-group) 允许你在跟踪查看器中对操作进行可视化分组。

```java
// group 和 groupEnd 之间的所有操作
// 将在跟踪查看器中显示为一个组。
page.context().tracing().group("打开 Playwright.dev > API");
page.navigate("https://playwright.dev/");
page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("API")).click();
page.context().tracing().groupEnd();
```

### 破坏性变更：`chrome` 和 `msedge` 渠道切换到新的无头模式

如果你在 `playwright.config.ts` 中使用以下渠道之一，此更改会影响你：
- `chrome`、`chrome-dev`、`chrome-beta` 或 `chrome-canary`
- `msedge`、`msedge-dev`、`msedge-beta` 或 `msedge-canary`

更新到 Playwright v1.49 后，运行你的测试套件。如果它仍然通过，你就可以了。如果没有，你可能需要更新快照，并围绕 PDF 查看器和扩展调整一些测试代码。有关更多详细信息，请参阅[问题 #33566](https://github.com/microsoft/playwright/issues/33566)。

### 尝试新的 Chromium 无头模式

你可以通过使用 `'chromium'` 渠道选择加入新的无头模式。正如[官方 Chrome 文档所说](https://developer.chrome.com/blog/chrome-headless-shell)：

> 另一方面，新的 Headless 是真正的 Chrome 浏览器，因此更加真实、可靠，并提供更多功能。这使其更适合高精度的端到端 Web 应用测试或浏览器扩展测试。

有关你可能遇到的可能破坏的列表以及 Chromium 无头的更多详细信息，请参阅[问题 #33566](https://github.com/microsoft/playwright/issues/33566)。如果你在选择加入后看到任何问题，请提交问题。

```java
Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setChannel("chromium"));
```

### 其他
- Ubuntu 20.04 和 Debian 11 上的 WebKit 将不再有更新。我们建议将操作系统更新到更新的版本。
- 快照中的 `<canvas>` 元素现在会绘制预览。

### 浏览器版本
- Chromium 131.0.6778.33
- Mozilla Firefox 132.0
- WebKit 18.2

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 130
- Microsoft Edge 130

## 版本 1.48

### WebSocket 路由

新方法 [`page.routeWebSocket()`](/java/api/class-page#page-route-web-socket) 和 [`browserContext.routeWebSocket()`](/java/api/class-browsercontext#browser-context-route-web-socket) 允许拦截、修改和模拟页面中发起的 WebSocket 连接。下面是一个简单的示例，通过用 `"response"` 响应 `"request"` 来模拟 WebSocket 通信。

```java
page.routeWebSocket("/ws", ws -> {
  ws.onMessage(frame -> {
    if ("request".equals(frame.text()))
      ws.send("response");
  });
});
```

有关更多详细信息，请参阅 [WebSocketRoute](/java/api/class-websocketroute)。

### UI 更新
- HTML 报告中注释和测试位置的新"复制"按钮。
- 路由方法调用（如 [`route.fulfill()`](/java/api/class-route#route-fulfill)）不再显示在报告和跟踪查看器中。你可以在网络选项卡中查看哪些网络请求被路由。
- 网络选项卡中请求的新"复制为 cURL"和"复制为 fetch"按钮。

### 其他
- 新方法 [`page.requestGC()`](/java/api/class-page#page-request-gc) 可能有助于检测内存泄漏。
- [APIRequestContext](/java/api/class-apirequestcontext) 发出的请求现在在 HAR 中记录详细的计时和安全信息。

### 浏览器版本
- Chromium 130.0.6723.19
- Mozilla Firefox 130.0
- WebKit 18.0

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 129
- Microsoft Edge 129

## 版本 1.47

### 网络选项卡改进

跟踪查看器中的网络选项卡有几个不错的改进：
- 按资源类型和 URL 过滤
- 更好地显示查询字符串参数
- 字体资源预览

<img src="https://github.com/user-attachments/assets/4bd1b67d-90bd-438b-a227-00b9e86872e2" alt="网络选项卡现在有过滤器" width="1712" height="418" />

### 其他
- `mcr.microsoft.com/playwright/java:v1.47.0` 现在提供基于 Ubuntu 24.04 Noble 的 Playwright 镜像。
  要使用基于 22.02 jammy 的镜像，请改用 `mcr.microsoft.com/playwright/java:v1.47.0-jammy`。
- Playwright Docker 镜像的 `:latest`/`:focal`/`:jammy` 标签不再发布。请固定到特定版本以获得更好的稳定性和可重现性。
- TLS 客户端证书现在可以通过将 [`clientCertificates.cert`](/java/api/class-browser#browser-new-context-option-client-certificates) 和 [`clientCertificates.key`](/java/api/class-browser#browser-new-context-option-client-certificates) 作为字节数组而不是文件路径传递来从内存中传递。
- [`locator.selectOption()`](/java/api/class-locator#locator-select-option) 中的 [`noWaitAfter`](/java/api/class-locator#locator-select-option-option-no-wait-after) 已弃用。
- 我们看到有报告称 WebKit 在 GitHub Actions `macos-13` 上的 WebGL 行为异常。我们建议将 GitHub Actions 升级到 `macos-14`。

### 浏览器版本
- Chromium 129.0.6668.29
- Mozilla Firefox 130.0
- WebKit 18.0

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 128
- Microsoft Edge 128

## 版本 1.46

### TLS 客户端证书

Playwright 现在允许提供客户端证书，以便服务器可以验证它们，如 TLS 客户端身份验证所指定的那样。

你可以将客户端证书作为 [`browser.newContext()`](/java/api/class-browser#browser-new-context) 和 [`apiRequest.newContext()`](/java/api/class-apirequest#api-request-new-context) 的参数提供。以下代码片段为 `https://example.com` 设置了客户端证书：

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
    .setClientCertificates(asList(new ClientCertificate("https://example.com")
          .setCertPath(Paths.get("client-certificates/cert.pem"))
          .setKeyPath(Paths.get("client-certificates/key.pem")))));
```

### 跟踪查看器更新
- 文本附件的内容现在在附件窗格中内联渲染。
- 新设置可显示/隐藏路由操作，如 [`route.resume()`](/java/api/class-route#route-continue)。
- 请求方法和状态显示在网络详细信息选项卡中。
- 新按钮可将源文件位置复制到剪贴板。
- 元数据窗格现在显示 `baseURL`。

### 其他
- [`apiRequestContext.fetch()`](/java/api/class-apirequestcontext#api-request-context-fetch) 中的新 `maxRetries` 选项，在 `ECONNRESET` 网络错误时重试。

### 浏览器版本
- Chromium 128.0.6613.18
- Mozilla Firefox 128.0
- WebKit 18.0

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 127
- Microsoft Edge 127

## 版本 1.45

### Clock

利用新的 [Clock](/java/api/class-clock) API 可以在测试中操纵和控制时间，以验证与时间相关的行为。此 API 涵盖许多常见场景，包括：
* 使用预定义时间进行测试；
* 保持一致的时间和计时器；
* 监控不活动状态；
* 手动推进时间。

```java
// 使用测试时间之前的某个时间初始化时钟，并让页面自然加载。
// 随着计时器触发，`Date.now` 将前进。
page.clock().install(new Clock.InstallOptions().setTime("2024-02-02T08:00:00"));
page.navigate("http://localhost:3333");
Locator locator = page.getByTestId("current-time");

// 假装用户关闭了笔记本电脑盖子，然后在上午 10 点重新打开。
// 到达该点后暂停时间。
page.clock().pauseAt("2024-02-02T10:00:00");

// 断言页面状态。
assertThat(locator).hasText("2/2/2024, 10:00:00 AM");

// 再次关闭笔记本电脑盖子，然后在上午 10:30 打开。
page.clock().fastForward("30:00");
assertThat(locator).hasText("2/2/2024, 10:30:00 AM");
```

有关更多详细信息，请参阅[时钟指南](./clock.md)。

### 其他
- 方法 [`locator.setInputFiles()`](/java/api/class-locator#locator-set-input-files) 现在支持为 `<input type=file webkitdirectory>` 元素上传目录。
  
  ```java
  page.getByLabel("Upload directory").setInputFiles(Paths.get("mydir"));
  ```
- 多个方法（如 [`locator.click()`](/java/api/class-locator#locator-click) 或 [`locator.press()`](/java/api/class-locator#locator-press)）现在支持 `ControlOrMeta` 修饰键。此键在 macOS 上映射到 `Meta`，在 Windows 和 Linux 上映射到 `Control`。
  
  ```java
  // 按下常见键盘快捷键 Control+S 或 Meta+S 触发"保存"操作。
  page.keyboard.press("ControlOrMeta+S");
  ```
- [`apiRequest.newContext()`](/java/api/class-apirequest#api-request-new-context) 中的新属性 `httpCredentials.send`，允许始终发送 `Authorization` 头或仅在响应 `401 Unauthorized` 时发送。
- Playwright 现在支持 Ubuntu 24.04 上的 Chromium、Firefox 和 WebKit。
- v1.45 是最后一个为 macOS 12 Monterey 接收 WebKit 更新的版本。请更新 macOS 以继续使用最新的 WebKit。

### 浏览器版本
* Chromium 127.0.6533.5
* Mozilla Firefox 127.0
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 126
* Microsoft Edge 126

## 版本 1.44

### 新 API

**可访问性断言**
- [`locatorAssertions.hasAccessibleName()`](/java/api/class-locatorassertions#locator-assertions-to-have-accessible-name) 检查元素是否具有指定的可访问名称：
  
  ```java
  Locator locator = page.getByRole(AriaRole.BUTTON);
  assertThat(locator).hasAccessibleName("Submit");
  ```
- [`locatorAssertions.hasAccessibleDescription()`](/java/api/class-locatorassertions#locator-assertions-to-have-accessible-description) 检查元素是否具有指定的可访问描述：
  
  ```java
  Locator locator = page.getByRole(AriaRole.BUTTON);
  assertThat(locator).hasAccessibleDescription("Upload a photo");
  ```
- [`locatorAssertions.hasRole()`](/java/api/class-locatorassertions#locator-assertions-to-have-role) 检查元素是否具有指定的 ARIA 角色：
  
  ```java
  Locator locator = page.getByTestId("save-button");
  assertThat(locator).hasRole(AriaRole.BUTTON);
  ```

**定位器处理程序**
- 使用 [`page.addLocatorHandler()`](/java/api/class-page#page-add-locator-handler) 添加处理程序后，Playwright 现在将等待触发处理程序的覆盖层不再可见。你可以使用新的 `setNoWaitAfter` 选项选择退出此行为。
- 你可以使用 [`page.addLocatorHandler()`](/java/api/class-page#page-add-locator-handler) 中的新 `setTimes` 选项指定处理程序应运行的最大次数。
- [`page.addLocatorHandler()`](/java/api/class-page#page-add-locator-handler) 中的处理程序现在接受定位器作为参数。
- 新 [`page.removeLocatorHandler()`](/java/api/class-page#page-remove-locator-handler) 方法用于移除之前添加的定位器处理程序。

```java
Locator locator = page.getByText("This interstitial covers the button");
page.addLocatorHandler(locator, overlay -> {
  overlay.locator("#close").click();
}, new Page.AddLocatorHandlerOptions().setTimes(3).setNoWaitAfter(true));
// 运行可能被覆盖层中断的测试。
// ...
page.removeLocatorHandler(locator);
```

**其他选项**
- 新方法 [`formData.append()`](/java/api/class-formdata#form-data-append) 允许在 `RequestOptions` 中的 [`setMultipart`](./api/class-requestoptions#request-options-set-multipart) 选项中指定具有相同名称的重复字段：
  
  ```java
  FormData formData = FormData.create();
  formData.append("file", new FilePayload("f1.js", "text/javascript",
  "var x = 2024;".getBytes(StandardCharsets.UTF_8)));
  formData.append("file", new FilePayload("f2.txt", "text/plain",
    "hello".getBytes(StandardCharsets.UTF_8)));
  APIResponse response = context.request().post("https://example.com/uploadFile", RequestOptions.create().setMultipart(formData));
  ```
- `expect(page).toHaveURL(url)` 现在支持 `setIgnoreCase` [选项](./api/class-pageassertions#page-assertions-to-have-url-option-ignore-case)。

### 浏览器版本
* Chromium 125.0.6422.14
* Mozilla Firefox 125.0.1
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 124
* Microsoft Edge 124

## 版本 1.43

### 新 API
- 方法 [`browserContext.clearCookies()`](/java/api/class-browsercontext#browser-context-clear-cookies) 现在支持过滤器以仅移除某些 cookie。
  
  ```java
  // 清除所有 cookie。
  context.clearCookies();
  // 新增：清除具有特定名称的 cookie。
  context.clearCookies(new BrowserContext.ClearCookiesOptions().setName("session-id"));
  // 新增：清除特定域的 cookie。
  context.clearCookies(new BrowserContext.ClearCookiesOptions().setDomain("my-origin.com"));
  ```
- 新方法 [`locator.contentFrame()`](/java/api/class-locator#locator-content-frame) 将 [Locator](/java/api/class-locator) 对象转换为 [FrameLocator](/java/api/class-framelocator)。当你在某处获得了 [Locator](/java/api/class-locator) 对象，后来想要与帧内的内容交互时，这会很有用。
  
  ```java
  Locator locator = page.locator("iframe[name='embedded']");
  // ...
  FrameLocator frameLocator = locator.contentFrame();
  frameLocator.getByRole(AriaRole.BUTTON).click();
  ```
- 新方法 [`frameLocator.owner()`](/java/api/class-framelocator#frame-locator-owner) 将 [FrameLocator](/java/api/class-framelocator) 对象转换为 [Locator](/java/api/class-locator)。当你在某处获得了 [FrameLocator](/java/api/class-framelocator) 对象，后来想要与 `iframe` 元素交互时，这会很有用。
  
  ```java
  FrameLocator frameLocator = page.frameLocator("iframe[name='embedded']");
  // ...
  Locator locator = frameLocator.owner();
  assertThat(locator).isVisible();
  ```

### 浏览器版本
* Chromium 124.0.6367.8
* Mozilla Firefox 124.0
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 123
* Microsoft Edge 123

## 版本 1.42

### 实验性 JUnit 集成

将新的 [`@UsePlaywright`](./junit.md) 注解添加到你的测试类中，开始在测试方法中使用 [Page](/java/api/class-page)、[BrowserContext](/java/api/class-browsercontext)、[Browser](/java/api/class-browser)、[APIRequestContext](/java/api/class-apirequestcontext) 和 [Playwright](/java/api/class-playwright) 的 Playwright fixtures。

```java
package org.example;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.junit.UsePlaywright;
import org.junit.jupiter.api.Test;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@UsePlaywright
public class TestExample {
  void shouldNavigateToInstallationGuide(Page page) {
    page.navigate("https://playwright.dev/java/");
    page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Docs")).click();
    assertThat(page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Installation"))).isVisible();
  }

  @Test
  void shouldCheckTheBox(Page page) {
    page.setContent("<input id='checkbox' type='checkbox'></input>");
    page.locator("input").check();
    assertEquals(true, page.evaluate("window['checkbox'].checked"));
  }

  @Test
  void shouldSearchWiki(Page page) {
    page.navigate("https://www.wikipedia.org/");
    page.locator("input[name=\"search\"]").click();
    page.locator("input[name=\"search\"]").fill("playwright");
    page.locator("input[name=\"search\"]").press("Enter");
    assertThat(page).hasURL("https://en.wikipedia.org/wiki/Playwright");
  }
}
```

在上面的示例中，所有三个测试方法使用相同的 [Browser](/java/api/class-browser)。每个测试使用自己的 [BrowserContext](/java/api/class-browsercontext) 和 [Page](/java/api/class-page)。

**自定义选项**

实现你自己的 `OptionsFactory` 来使用自定义配置初始化 fixtures。

```java
import com.microsoft.playwright.junit.Options;
import com.microsoft.playwright.junit.OptionsFactory;
import com.microsoft.playwright.junit.UsePlaywright;

@UsePlaywright(MyTest.CustomOptions.class)
public class MyTest {

  public static class CustomOptions implements OptionsFactory {
    @Override
    public Options getOptions() {
      return new Options()
          .setHeadless(false)
          .setContextOption(new Browser.NewContextOptions()
              .setBaseURL("https://github.com"))
          .setApiRequestOptions(new APIRequest.NewContextOptions()
              .setBaseURL("https://playwright.dev"));
    }
  }

  @Test
  public void testWithCustomOptions(Page page, APIRequestContext request) {
    page.navigate("/");
    assertThat(page).hasURL(Pattern.compile("github"));

    APIResponse response = request.get("/");
    assertTrue(response.text().contains("Playwright"));
  }
}
```

在我们的 [JUnit 指南](./junit.md)中了解更多关于 fixtures 的信息。

### 新的定位器处理程序

新方法 [`page.addLocatorHandler()`](/java/api/class-page#page-add-locator-handler) 注册一个回调，当指定元素变为可见并可能阻止 Playwright 操作时将被调用。回调可以消除覆盖层。以下是一个在 cookie 对话框出现时关闭它的示例。

```java
// 设置处理程序。
page.addLocatorHandler(
    page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Hej! You are in control of your cookies.")),
    () -> {
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Accept all")).click();
    });
// 像往常一样编写测试。
page.navigate("https://www.ikea.com/");
page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Collection of blue and white")).click();
assertThat(page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Light and easy"))).isVisible();
```

### 新 API
- [`page.pdf()`](/java/api/class-page#page-pdf) 接受两个新选项 [`tagged`](/java/api/class-page#page-pdf-option-tagged) 和 [`outline`](/java/api/class-page#page-pdf-option-outline)。

### 公告
* ⚠️ 不再支持 Ubuntu 18。

### 浏览器版本
* Chromium 123.0.6312.4
* Mozilla Firefox 123.0
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 122
* Microsoft Edge 123

## 版本 1.41

### 新 API
- 新方法 [`page.unrouteAll()`](/java/api/class-page#page-unroute-all) 移除由 [`page.route()`](/java/api/class-page#page-route) 和 [`page.routeFromHAR()`](/java/api/class-page#page-route-from-har) 注册的所有路由。
- 新方法 [`browserContext.unrouteAll()`](/java/api/class-browsercontext#browser-context-unroute-all) 移除由 [`browserContext.route()`](/java/api/class-browsercontext#browser-context-route) 和 [`browserContext.routeFromHAR()`](/java/api/class-browsercontext#browser-context-route-from-har) 注册的所有路由。
- [`page.screenshot()`](/java/api/class-page#page-screenshot) 中的新选项 [`style`](/java/api/class-page#page-screenshot-option-style) 和 [`locator.screenshot()`](/java/api/class-locator#locator-screenshot) 中的 [`style`](/java/api/class-locator#locator-screenshot-option-style) 用于在截图前向页面添加自定义 CSS。

### 浏览器版本
* Chromium 121.0.6167.57
* Mozilla Firefox 121.0
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 120
* Microsoft Edge 120

## 版本 1.40

### 测试生成器更新

<img src="https://github.com/microsoft/playwright/assets/9881434/e8d67e2e-f36d-4301-8631-023948d3e190" alt="Playwright 测试生成器" width="2788" height="1824" />

生成断言的新工具：
- "断言可见性"工具生成 [`locatorAssertions.isVisible()`](/java/api/class-locatorassertions#locator-assertions-to-be-visible)。
- "断言值"工具生成 [`locatorAssertions.hasValue()`](/java/api/class-locatorassertions#locator-assertions-to-have-value)。
- "断言文本"工具生成 [`locatorAssertions.containsText()`](/java/api/class-locatorassertions#locator-assertions-to-contain-text)。

以下是带有断言的生成测试示例：

```java
page.navigate("https://playwright.dev/");
page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Get started")).click();
assertThat(page.getByLabel("Breadcrumbs").getByRole(AriaRole.LIST)).containsText("Installation");
assertThat(page.getByLabel("Search")).isVisible();
page.getByLabel("Search").click();
page.getByPlaceholder("Search docs").fill("locator");
assertThat(page.getByPlaceholder("Search docs")).hasValue("locator");
```

### 新 API
- [`page.close()`](/java/api/class-page#page-close) 中的选项 [`reason`](/java/api/class-page#page-close-option-reason)、[`browserContext.close()`](/java/api/class-browsercontext#browser-context-close) 中的 [`reason`](/java/api/class-browsercontext#browser-context-close-option-reason) 和 [`browser.close()`](/java/api/class-browser#browser-close) 中的 [`reason`](/java/api/class-browser#browser-close-option-reason)。关闭原因会报告给所有被关闭中断的操作。
- [`browserType.launchPersistentContext()`](/java/api/class-browsertype#browser-type-launch-persistent-context) 中的选项 [`firefoxUserPrefs`](/java/api/class-browsertype#browser-type-launch-persistent-context-option-firefox-user-prefs)。

### 其他变更
- 方法 [`download.path()`](/java/api/class-download#download-path) 和 [`download.createReadStream()`](/java/api/class-download#download-create-read-stream) 对于失败和取消的下载会抛出错误。

### 浏览器版本
* Chromium 120.0.6099.28
* Mozilla Firefox 119.0
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 119
* Microsoft Edge 119

## 版本 1.39

常规浏览器更新。

### 浏览器版本
* Chromium 119.0.6045.9
* Mozilla Firefox 118.0.1
* WebKit 17.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 118
* Microsoft Edge 118

## 版本 1.38

### 跟踪查看器更新

<img src="https://github.com/microsoft/playwright/assets/746130/0c41e20d-c54b-4600-8ca8-1cbb6393ddef" alt="Playwright 跟踪查看器" width="1091" height="722" />
1. 缩放到时间范围。
1. 网络面板重新设计。

### 新 API
- [`browserContext.onWebError()`](/java/api/class-browsercontext#browser-context-event-web-error)
- [`locator.pressSequentially()`](/java/api/class-locator#locator-press-sequentially)

### 弃用
* 以下方法已被弃用：[`page.type()`](/java/api/class-page#page-type)、[`frame.type()`](/java/api/class-frame#frame-type)、
  [`locator.type()`](/java/api/class-locator#locator-type) 和 [`elementHandle.type()`](/java/api/class-elementhandle#element-handle-type)。
  请改用 [`locator.fill()`](/java/api/class-locator#locator-fill)，速度更快。仅当页面上有特殊的键盘处理，并且需要逐个按键时，才使用
  [`locator.pressSequentially()`](/java/api/class-locator#locator-press-sequentially)。

### 浏览器版本
* Chromium 117.0.5938.62
* Mozilla Firefox 117.0
* WebKit 17.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 116
* Microsoft Edge 116

## 版本 1.37

### 新 API
- 新方法 [`browserContext.newCDPSession()`](/java/api/class-browsercontext#browser-context-new-cdp-session) 和 [`browser.newBrowserCDPSession()`](/java/api/class-browser#browser-new-browser-cdp-session) 分别为页面和浏览器创建 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) 会话。
  
  ```java
  CDPSession cdpSession = page.context().newCDPSession(page);
  cdpSession.send("Runtime.enable");
  
  JsonObject params = new JsonObject();
  params.addProperty("expression", "window.foo = 'bar'");
  cdpSession.send("Runtime.evaluate", params);
  
  Object foo = page.evaluate("window['foo']");
  assertEquals("bar", foo);
  ```

### 📚 Debian 12 Bookworm 支持

Playwright 现在在 x86_64 和 arm64 上支持 Debian 12 Bookworm 的 Chromium、Firefox 和 WebKit。
如果你遇到任何问题，请告诉我们！

Linux 支持情况如下：

|          | Ubuntu 20.04 | Ubuntu 22.04 | Debian 11 | Debian 12 |
| :--- | :---: | :---: | :---: | :---: |
| Chromium | ✅ | ✅ | ✅ | ✅ |
| WebKit | ✅ | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ | ✅ |

### 浏览器版本
* Chromium 116.0.5845.82
* Mozilla Firefox 115.0
* WebKit 17.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 115
* Microsoft Edge 115

## 版本 1.36

🏝️ 夏季维护版本。

### 浏览器版本
* Chromium 115.0.5790.75
* Mozilla Firefox 115.0
* WebKit 17.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 114
* Microsoft Edge 114

## 版本 1.35

### 亮点
* [`page.screenshot()`](/java/api/class-page#page-screenshot) 和 [`locator.screenshot()`](/java/api/class-locator#locator-screenshot) 的新选项 `maskColor` 用于更改默认遮罩颜色。
* 新的 `uninstall` CLI 命令用于卸载浏览器二进制文件：
  
  ```bash
  $ mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="uninstall" # 移除此安装安装的浏览器
  $ mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="uninstall --all" # 移除所有曾经安装的 Playwright 浏览器
  ```

### 浏览器版本
* Chromium 115.0.5790.13
* Mozilla Firefox 113.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 114
* Microsoft Edge 114

## 版本 1.34

### 亮点
* 新 [`locator.and()`](/java/api/class-locator#locator-and) 用于创建同时匹配两个定位器的定位器。
  
  ```java
  Locator button = page.getByRole(AriaRole.BUTTON).and(page.getByTitle("Subscribe"));
  ```
* 新事件 [`browserContext.onConsoleMessage()`](/java/api/class-browsercontext#browser-context-event-console) 和 [`browserContext.onDialog()`](/java/api/class-browsercontext#browser-context-event-dialog) 用于订阅给定浏览器上下文中任何页面的所有对话框
  和控制台消息。使用新方法 [`consoleMessage.page()`](/java/api/class-consolemessage#console-message-page)
  和 [`dialog.page()`](/java/api/class-dialog#dialog-page) 来精确定位事件源。

### 浏览器版本
* Chromium 114.0.5735.26
* Mozilla Firefox 113.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 113
* Microsoft Edge 113

## 版本 1.33

### 定位器更新
* 使用 [`locator.or()`](/java/api/class-locator#locator-or) 创建匹配两个定位器之一的定位器。
  考虑一个场景，你想单击"新邮件"按钮，但有时会出现安全设置对话框。
  在这种情况下，你可以等待"新邮件"按钮或对话框，并相应地操作：
  
  ```java
  Locator newEmail = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("New email"));
  Locator dialog = page.getByText("Confirm security settings");
  assertThat(newEmail.or(dialog)).isVisible();
  if (dialog.isVisible())
    page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Dismiss")).click();
  newEmail.click();
  ```
* 在 [`locator.filter()`](/java/api/class-locator#locator-filter) 中使用新选项 [`hasNot`](/java/api/class-locator#locator-filter-option-has-not) 和 [`hasNotText`](/java/api/class-locator#locator-filter-option-has-not-text)
  查找**不匹配**某些条件的元素。
  
  ```java
  Locator rowLocator = page.locator("tr");
  rowLocator
      .filter(new Locator.FilterOptions().setHasNotText("text in column 1"))
      .filter(new Locator.FilterOptions().setHasNot(
        page.getByRole(AriaRole.BUTTON,
          new Page.GetByRoleOptions().setName("column 2 button" ))))
      .screenshot();
  ```
* 使用新的 web-first 断言 [`locatorAssertions.isAttached()`](/java/api/class-locatorassertions#locator-assertions-to-be-attached) 确保元素
  存在于页面的 DOM 中。不要与 [`locatorAssertions.isVisible()`](/java/api/class-locatorassertions#locator-assertions-to-be-visible) 混淆，后者确保
  元素既已附加又可见。

### 新 API
- [`locator.or()`](/java/api/class-locator#locator-or)
- [`locator.filter()`](/java/api/class-locator#locator-filter) 中的新选项 [`hasNot`](/java/api/class-locator#locator-filter-option-has-not)
- [`locator.filter()`](/java/api/class-locator#locator-filter) 中的新选项 [`hasNotText`](/java/api/class-locator#locator-filter-option-has-not-text)
- [`locatorAssertions.isAttached()`](/java/api/class-locatorassertions#locator-assertions-to-be-attached)
- [`route.fetch()`](/java/api/class-route#route-fetch) 中的新选项 [`timeout`](/java/api/class-route#route-fetch-option-timeout)

### 其他亮点
- 原生支持 Apple Silicon——Playwright 现在无需 Rosetta 即可运行
- 添加了 Ubuntu 22.04 (Jammy) Docker 镜像

### ⚠️ 破坏性变更
* `mcr.microsoft.com/playwright/java:v1.33.0` 现在提供基于 Ubuntu Jammy 的 Playwright 镜像。
  要使用基于 focal 的镜像，请改用 `mcr.microsoft.com/playwright/java:v1.33.0-focal`。

### 浏览器版本
* Chromium 113.0.5672.53
* Mozilla Firefox 112.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 112
* Microsoft Edge 112

## 版本 1.32

### 新 API
- [`page.routeFromHAR()`](/java/api/class-page#page-route-from-har) 和 [`browserContext.routeFromHAR()`](/java/api/class-browsercontext#browser-context-route-from-har) 中的新选项 [`updateMode`](/java/api/class-page#page-route-from-har-option-update-mode) 和 [`updateContent`](/java/api/class-page#page-route-from-har-option-update-content)。
- 链接现有定位器对象，详见[定位器文档](./locators.md#matching-inside-a-locator)。
- 方法 [`tracing.startChunk()`](/java/api/class-tracing#tracing-start-chunk) 中的新选项 [`name`](/java/api/class-tracing#tracing-start-chunk-option-name)。

### 浏览器版本
* Chromium 112.0.5615.29
* Mozilla Firefox 111.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 111
* Microsoft Edge 111

## 版本 1.31

### 新 API
- 新断言 [`locatorAssertions.isInViewport()`](/java/api/class-locatorassertions#locator-assertions-to-be-in-viewport) 确保定位器指向与视口相交的元素，根据 [intersection observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)。
  
  ```java
  Locator locator = page.getByRole(AriaRole.BUTTON);
  
  // 确保元素的至少某部分与视口相交。
  assertThat(locator).isInViewport();
  
  // 确保元素完全在视口之外。
  assertThat(locator).not().isInViewport();
  
  // 确保元素的至少一半与视口相交。
  assertThat(locator).isInViewport(new LocatorAssertions.IsInViewportOptions().setRatio(0.5));
  ```

### 其他
- 跟踪查看器中的 DOM 快照现在可以在单独的窗口中打开。
- 方法 [`route.fetch()`](/java/api/class-route#route-fetch) 的新选项 [`maxRedirects`](/java/api/class-route#route-fetch-option-max-redirects)。
- Playwright 现在支持 Debian 11 arm64。
- 官方 [docker 镜像](./docker.md) 现在包含 Node 18 而不是 Node 16。

### 浏览器版本
* Chromium 111.0.5563.19
* Mozilla Firefox 109.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 110
* Microsoft Edge 110

## 版本 1.30

### 浏览器版本
* Chromium 110.0.5481.38
* Mozilla Firefox 108.0.2
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 109
* Microsoft Edge 109

## 版本 1.29

### 新 API
- 新方法 [`route.fetch()`](/java/api/class-route#route-fetch)：
  
  ```java
  page.route("**/api/settings", route -> {
    // 获取原始设置。
    APIResponse response = route.fetch();
    // 强制将设置主题设为预定义值。
    String body = response.text().replace("\"theme\":\"default\"",
      "\"theme\":\"Solorized\"");
    // 使用修改后的数据完成请求。
    route.fulfill(new Route.FulfillOptions().setResponse(response).setBody(body));
  });
  ```
- 新方法 [`locator.all()`](/java/api/class-locator#locator-all) 用于遍历所有匹配元素：
  
  ```java
  // 选中所有复选框！
  Locator checkboxes = page.getByRole(AriaRole.CHECKBOX);
  for (Locator checkbox : checkboxes.all())
    checkbox.check();
  ```
- [`locator.selectOption()`](/java/api/class-locator#locator-select-option) 现在按值或标签匹配：
  
  ```html
  <select multiple>
    <option value="red">Red</option>
    <option value="green">Green</option>
    <option value="blue">Blue</option>
  </select>
  ```
  
  ```java
  element.selectOption("Red");
  ```

### 浏览器版本
* Chromium 109.0.5414.46
* Mozilla Firefox 107.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 108
* Microsoft Edge 108

## 版本 1.28

### Playwright 工具
* **代码生成中的实时定位器。** 使用"探索"工具为页面上的任何元素生成定位器。

<img src="https://user-images.githubusercontent.com/9798949/202293631-2f402cc2-35fb-4877-8ea1-82265fbbc232.png" alt="定位器探索器" width="1876" height="1096" />

### 新 API
- [`locator.blur()`](/java/api/class-locator#locator-blur)
- [`locator.clear()`](/java/api/class-locator#locator-clear)

### 浏览器版本
* Chromium 108.0.5359.29
* Mozilla Firefox 106.0
* WebKit 16.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 107
* Microsoft Edge 107

## 版本 1.27

### 定位器

使用这些新 API，编写定位器是一种乐趣：
- [`page.getByText()`](/java/api/class-page#page-get-by-text) 按文本内容定位。
- [`page.getByRole()`](/java/api/class-page#page-get-by-role) 按 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles)、[ARIA 属性](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes)和[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name)定位。
- [`page.getByLabel()`](/java/api/class-page#page-get-by-label) 按关联标签的文本定位表单控件。
- [`page.getByTestId()`](/java/api/class-page#page-get-by-test-id) 根据元素的 `data-testid` 属性定位（可以配置其他属性）。
- [`page.getByPlaceholder()`](/java/api/class-page#page-get-by-placeholder) 按占位符定位输入框。
- [`page.getByAltText()`](/java/api/class-page#page-get-by-alt-text) 按其替代文本定位元素，通常是图像。
- [`page.getByTitle()`](/java/api/class-page#page-get-by-title) 按其标题定位元素。

```java
page.getByLabel("User Name").fill("John");

page.getByLabel("Password").fill("secret-password");

page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign in")).click();

assertThat(page.getByText("Welcome, John!")).isVisible();
```

所有相同的方法也可在 [Locator](/java/api/class-locator)、[FrameLocator](/java/api/class-framelocator) 和 [Frame](/java/api/class-frame) 类上使用。

### 其他亮点
- 如 v1.25 所宣布，从 2022 年 12 月起将不再支持 Ubuntu 18。此外，从下一个 Playwright 版本开始，Ubuntu 18 上将不再有 WebKit 更新。

### 行为变更
- 带有空值的 [`locatorAssertions.hasAttribute()`](/java/api/class-locatorassertions#locator-assertions-to-have-attribute) 不再匹配缺失的属性。例如，以下代码段将在按钮**没有** `disabled` 属性时成功。
  
  ```java
  assertThat(page.getByRole(AriaRole.BUTTON)).hasAttribute("disabled", "");
  ```

### 浏览器版本
* Chromium 107.0.5304.18
* Mozilla Firefox 105.0.1
* WebKit 16.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 106
* Microsoft Edge 106

## 版本 1.26

### 断言
- [`locatorAssertions.isEnabled()`](/java/api/class-locatorassertions#locator-assertions-to-be-enabled) 的新选项 `enabled`。
- [`locatorAssertions.hasText()`](/java/api/class-locatorassertions#locator-assertions-to-have-text) 现在穿透开放的 shadow root。
- [`locatorAssertions.isEditable()`](/java/api/class-locatorassertions#locator-assertions-to-be-editable) 的新选项 `editable`。
- [`locatorAssertions.isVisible()`](/java/api/class-locatorassertions#locator-assertions-to-be-visible) 的新选项 `visible`。

### 其他亮点
- [`apiRequestContext.get()`](/java/api/class-apirequestcontext#api-request-context-get) 等方法的新选项 `setMaxRedirects` 用于限制重定向次数。
- Docker 镜像现在使用 OpenJDK 17。

### 行为变更

许多 Playwright API 已经支持 `setWaitUntil(WaitUntilState.DOMCONTENTLOADED)` 选项。
例如：

```java
page.navigate("https://playwright.dev", new Page.NavigateOptions().setWaitUntil(WaitUntilState.DOMCONTENTLOADED));
```

在 1.26 之前，这会等待所有 iframe 触发 `DOMContentLoaded` 事件。

为了符合 Web 规范，`WaitUntilState.DOMCONTENTLOADED` 值现在只等待目标帧触发 `'DOMContentLoaded'` 事件。使用 `setWaitUntil(WaitUntilState.LOAD)` 来等待所有 iframe。

### 浏览器版本
* Chromium 106.0.5249.30
* Mozilla Firefox 104.0
* WebKit 16.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 105
* Microsoft Edge 105

## 版本 1.25

### 新 API 和变更
- 默认断言超时现在可以使用 [`setDefaultAssertionTimeout`](./api/class-playwrightassertions#playwright-assertions-set-default-assertion-timeout) 更改。

### 公告
* 🪦 这是最后一个支持 macOS 10.15 的版本（自 1.21 起已弃用）。
* ⚠️ Ubuntu 18 现已弃用，从 2022 年 12 月起将不再受支持。

### 浏览器版本
* Chromium 105.0.5195.19
* Mozilla Firefox 103.0
* WebKit 16.0

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 104
* Microsoft Edge 104

## 版本 1.24

<LiteYouTube
id="9F05o1shxcY"
title="Playwright 1.24"
/>

### 🐂 Debian 11 Bullseye 支持

Playwright 现在在 x86_64 上支持 Debian 11 Bullseye 的 Chromium、Firefox 和 WebKit。如果你遇到任何问题，请告诉我们！

Linux 支持情况如下：

|          | Ubuntu 20.04 | Ubuntu 22.04 | Debian 11
| :--- | :---: | :---: | :---: | :---: |
| Chromium | ✅ | ✅ | ✅ |
| WebKit | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |

## 版本 1.23

### 网络重放

现在你可以将网络流量录制到 HAR 文件中，并在测试中重用此流量。

要录制网络到 HAR 文件：

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="open --save-har=example.har --save-har-glob='**/api/**' https://example.com"
```

或者，你可以通过编程方式录制 HAR：

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
    .setRecordHarPath(Paths.get("example.har"))
    .setRecordHarUrlFilter("**/api/**"));

// ... 执行操作 ...

// 关闭上下文以确保 HAR 保存到磁盘。
context.close();
```

使用新方法 [`page.routeFromHAR()`](/java/api/class-page#page-route-from-har) 或 [`browserContext.routeFromHAR()`](/java/api/class-browsercontext#browser-context-route-from-har) 从 [HAR](http://www.softwareishard.com/blog/har-12-spec/) 文件提供匹配的响应：

```java
context.routeFromHAR(Paths.get("example.har"));
```

在我们的[文档](./mock.md#mocking-with-har-files)中了解更多。

### 高级路由

你现在可以使用 [`route.fallback()`](/java/api/class-route#route-fallback) 将路由推迟到其他处理程序。

考虑以下示例：

```java
// 从所有请求中移除标头。
page.route("**/*", route -> {
  Map<String, String> headers = new HashMap<>(route.request().headers());
  headers.remove("X-Secret");
  route.resume(new Route.ResumeOptions().setHeaders(headers));
});

// 中止所有图像。
page.route("**/*", route -> {
  if ("image".equals(route.request().resourceType()))
    route.abort();
  else
    route.fallback();
});
```

请注意，新方法 [`page.routeFromHAR()`](/java/api/class-page#page-route-from-har) 和 [`browserContext.routeFromHAR()`](/java/api/class-browsercontext#browser-context-route-from-har) 也参与路由并可以被推迟。

### Web-First 断言更新
* 新方法 [`locatorAssertions.hasValues()`](/java/api/class-locatorassertions#locator-assertions-to-have-values) 断言 `<select multiple>` 元素的所有选定值。
* 方法 [`locatorAssertions.containsText()`](/java/api/class-locatorassertions#locator-assertions-to-contain-text) 和 [`locatorAssertions.hasText()`](/java/api/class-locatorassertions#locator-assertions-to-have-text) 现在接受 `ignoreCase` 选项。

### 其他
- 如果有 service worker 阻碍你，你现在可以使用新的上下文选项 `serviceWorkers` 轻松禁用它：
  
  ```java
  BrowserContext context = browser.newContext(new Browser.NewContextOptions()
      .setServiceWorkers(ServiceWorkerPolicy.BLOCK));
  ```
- 对 `recordHar` 上下文选项使用 `.zip` 路径会自动压缩生成的 HAR：
  
  ```java
  BrowserContext context = browser.newContext(new Browser.NewContextOptions()
      .setRecordHarPath(Paths.get("example.har.zip")));
  ```
- 如果你打算手动编辑 HAR，请考虑使用 `"minimal"` HAR 录制模式，它只录制重放所需的信息：
  
  ```java
  BrowserContext context = browser.newContext(new Browser.NewContextOptions()
      .setRecordHarPath(Paths.get("example.har"))
      .setRecordHarMode(HarMode.MINIMAL));
  ```
- Playwright 现在在 Ubuntu 22 amd64 和 Ubuntu 22 arm64 上运行。

## 版本 1.22

### 亮点
- 角色选择器允许通过其 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles)、[ARIA 属性](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes)和[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name)选择元素。
  
  ```java
  // 单击具有可访问名称 "log in" 的按钮
  page.locator("role=button[name='log in']").click();
  ```
  
  在我们的[文档](./locators.md#locate-by-role)中了解更多。
- 新 [`locator.filter()`](/java/api/class-locator#locator-filter) API 用于过滤现有定位器
  
  ```java
  Locator buttonsLocator = page.locator("role=button");
  // ...
  Locator submitButton = buttonsLocator.filter(new Locator.FilterOptions().setHasText("Submit"));
  submitButton.click();
  ```
- Playwright for Java 现在支持 **Ubuntu 20.04 ARM64** 和 **Apple M1**。
  你现在可以在 Apple M1 上、Apple M1 上的 Docker 内以及 Raspberry Pi 上运行 Playwright for Java 测试。

## 版本 1.21

### 亮点
- 新角色选择器允许通过其 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles)、[ARIA 属性](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes)和[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name)选择元素。
  
  ```java
  // 单击具有可访问名称 "log in" 的按钮
  page.locator("role=button[name='log in']").click();
  ```
  
  在我们的[文档](./locators.md#locate-by-role)中了解更多。
- [`page.screenshot()`](/java/api/class-page#page-screenshot) 中的新 `scale` 选项用于生成更小尺寸的屏幕截图。
- [`page.screenshot()`](/java/api/class-page#page-screenshot) 中的新 `caret` 选项用于控制文本光标。默认为 `"hide"`。

### 行为变更
- Playwright 现在通过 [`locator.setInputFiles()`](/java/api/class-locator#locator-set-input-files) API 支持大文件上传（数百 MB）。

### 浏览器版本
- Chromium 101.0.4951.26
- Mozilla Firefox 98.0.2
- WebKit 15.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 100
- Microsoft Edge 100

## 版本 1.20

### 亮点
- 方法 [`page.screenshot()`](/java/api/class-page#page-screenshot)、[`locator.screenshot()`](/java/api/class-locator#locator-screenshot) 和 [`elementHandle.screenshot()`](/java/api/class-elementhandle#element-handle-screenshot) 的新选项：
  * 选项 `ScreenshotAnimations.DISABLED` 将所有 CSS 动画和过渡倒回到一致的状态
  * 选项 `mask: Locator[]` 遮罩给定元素，用粉红色 `#FF00FF` 框覆盖它们。
- [跟踪查看器](./trace-viewer) 现在显示 [API 测试请求](./api-testing)。
- [`locator.highlight()`](/java/api/class-locator#locator-highlight) 直观地显示元素以便于调试。

### 公告
- v1.20 是最后一个为 macOS 10.15 Catalina 接收 WebKit 更新的版本。请更新 macOS 以继续使用最新和最好的 WebKit！

### 浏览器版本
- Chromium 101.0.4921.0
- Mozilla Firefox 97.0.1
- WebKit 15.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 99
- Microsoft Edge 99

## 版本 1.19

### 亮点
- 定位器现在支持 `has` 选项，确保其内部包含另一个定位器：
  
  ```java
  page.locator("article", new Page.LocatorOptions().setHas(page.locator(".highlight"))).click();
  ```
  
  在[定位器文档](./api/class-locator#locator-locator)中了解更多
- 新 [`locator.page()`](/java/api/class-locator#locator-page)
- [`page.screenshot()`](/java/api/class-page#page-screenshot) 和 [`locator.screenshot()`](/java/api/class-locator#locator-screenshot) 现在自动隐藏闪烁的光标
- Playwright 代码生成现在生成定位器和帧定位器

### 浏览器版本
- Chromium 100.0.4863.0
- Mozilla Firefox 96.0.1
- WebKit 15.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 98
- Microsoft Edge 98

## 版本 1.18

### API 测试

Playwright for Java 1.18 引入了新的 [API 测试](./api/class-apirequestcontext)，让你直接从 Java 向服务器发送请求！
现在你可以：
- 测试你的服务器 API
- 在测试中访问 Web 应用程序之前准备服务器端状态
- 在浏览器中运行一些操作后验证服务器端后置条件

要代表 Playwright 的 Page 发出请求，使用**新的 [`page.request()`](/java/api/class-page#page-request) API**：

```java
// 代表页面执行 GET 请求
APIResponse res = page.request().get("http://example.com/foo.json");
```

在我们的 [API 测试指南](./api-testing)中了解更多。

### Web-First 断言

Playwright for Java 1.18 引入了 [Web-First 断言](./test-assertions)。

考虑以下示例：

```java
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class TestExample {
  @Test
  void statusBecomesSubmitted() {
    // ...
    page.locator("#submit-button").click();
    assertThat(page.locator(".status")).hasText("Submitted");
  }
}
```

Playwright 将使用选择器 `.status` 重新测试节点，直到获取的节点具有 `"Submitted"` 文本。它将一遍又一遍地重新获取节点并检查它，直到满足条件或达到超时。你可以将此超时作为选项传递。

在我们的[文档](./test-assertions)中了解更多。

### 定位器改进
- [`locator.dragTo()`](/java/api/class-locator#locator-drag-to)
- 每个定位器现在可以选择性地按其包含的文本进行过滤：
  
  ```java
  page.locator("li", new Page.LocatorOptions().setHasText("my item"))
      .locator("button").click();
  ```
  
  在[定位器文档](./api/class-locator#locator-locator)中了解更多

### 跟踪改进

[跟踪](./api/class-tracing.md)现在可以使用新的 [`setSources`](./api/class-tracing#tracing-start-option-sources) 选项将 Java 源代码嵌入到录制的跟踪中。

<img src="https://user-images.githubusercontent.com/746130/150180856-40a7df71-370c-4597-8665-40c77a5e06ad.png" alt="跟踪-java-源代码" width="1517" height="856" />

### 新 API 和变更
- [`acceptDownloads`](./api/class-browser#browser-new-context-option-accept-downloads) 选项现在默认为 `true`。

### 浏览器版本
- Chromium 99.0.4812.0
- Mozilla Firefox 95.0
- WebKit 15.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 97
- Microsoft Edge 97

## 版本 1.17

### 帧定位器

Playwright 1.17 引入了[帧定位器](./api/class-framelocator)——定位页面上的 iframe 的定位器。帧定位器捕获足够的逻辑来检索 `iframe` 然后在该 iframe 中定位元素。帧定位器默认是严格的，会等待 `iframe` 出现，可用于 Web-First 断言。

<img src="https://user-images.githubusercontent.com/746130/142082759-2170db38-370d-43ec-8d41-5f9941f57d83.png" alt="图形" width="600" height="237" />

帧定位器可以使用 [`page.frameLocator()`](/java/api/class-page#page-frame-locator) 或 [`locator.frameLocator()`](/java/api/class-locator#locator-frame-locator) 方法创建。

```java
Locator locator = page.frameLocator("#my-frame").locator("text=Submit");
locator.click();
```

在我们的[文档](./api/class-framelocator)中了解更多。

### 跟踪查看器更新

Playwright 跟踪查看器现在可在 https://trace.playwright.dev/ **在线获得**！只需拖放你的 `trace.zip` 文件即可检查其内容。

> **注意**：跟踪文件不会上传到任何地方；[trace.playwright.dev](https://trace.playwright.dev) 是一个[渐进式 Web 应用程序](https://web.dev/progressive-web-apps/)，在本地处理跟踪。
- Playwright Test 跟踪现在默认包含源代码（可以通过跟踪选项关闭）
- 跟踪查看器现在显示测试名称
- 带有浏览器详细信息的新跟踪元数据选项卡
- 快照现在有 URL 栏

<img src="https://user-images.githubusercontent.com/746130/141877831-29e37cd1-e574-4bd9-aab5-b13a463bb4ae.png" alt="图像" width="2230" height="1562" />

### HTML 报告更新
- HTML 报告现在支持动态过滤
- 报告现在是**单个静态 HTML 文件**，可以通过电子邮件或作为 slack 附件发送。

<img src="https://user-images.githubusercontent.com/746130/141877402-e486643d-72c7-4db3-8844-ed2072c5d676.png" alt="图像" width="2494" height="1624" />

### Ubuntu ARM64 支持等
- Playwright 现在支持 **Ubuntu 20.04 ARM64**。你现在可以在 Apple M1 上的 Docker 内以及 Raspberry Pi 上运行 Playwright 测试。
- 你现在可以使用 Playwright 在 Linux 上安装稳定版的 Edge：
  
  ```bash
  mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install msedge"
  ```

### 新 API
- 跟踪现在支持 [`'title'`](./api/class-tracing#tracing-start-option-title) 选项
- 页面导航支持新的 [`'commit'`](./api/class-page#page-goto) 等待选项

## 版本 1.16

### 🎭 Playwright 库

#### Locator.waitFor

等待定位器解析为具有给定状态的单个元素。
默认为 `state: 'visible'`。

```java
Locator orderSent = page.locator("#order-sent");
orderSent.waitFor();
```

在 [`locator.waitFor()`](/java/api/class-locator#locator-wait-for) 中了解更多。

### 🎭 Playwright 跟踪查看器
- 使用 `mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="show-trace"` 运行跟踪查看器并将跟踪文件拖放到跟踪查看器 PWA
- 更好的操作目标视觉归因

在[跟踪查看器](./trace-viewer)中了解更多。

### 浏览器版本
- Chromium 97.0.4666.0
- Mozilla Firefox 93.0
- WebKit 15.4

此版本的 Playwright 还针对以下稳定渠道进行了测试：
- Google Chrome 94
- Microsoft Edge 94

## 版本 1.15

### 🖱️ 鼠标滚轮

通过使用 [`mouse.wheel()`](/java/api/class-mouse#mouse-wheel)，你现在可以垂直或水平滚动。

### 📜 新标头 API

以前无法获取响应的多个标头值。现在这是可能的，并且有额外的辅助函数可用：
- [`request.allHeaders()`](/java/api/class-request#request-all-headers)
- [`request.headersArray()`](/java/api/class-request#request-headers-array)
- [`request.headerValue()`](/java/api/class-request#request-header-value)
- [`response.allHeaders()`](/java/api/class-response#response-all-headers)
- [`response.headersArray()`](/java/api/class-response#response-headers-array)
- [`response.headerValue()`](/java/api/class-response#response-header-value)
- [`response.headerValues()`](/java/api/class-response#response-header-values)

### 🌈 强制颜色模拟

现在可以通过在 [`browser.newContext()`](/java/api/class-browser#browser-new-context) 中传递或调用 [`page.emulateMedia()`](/java/api/class-page#page-emulate-media) 来模拟 `forced-colors` CSS 媒体特性。

### 新 API
- [`page.route()`](/java/api/class-page#page-route) 接受新的 `times` 选项来指定此路由应匹配多少次。
- 引入了 [`page.setChecked()`](/java/api/class-page#page-set-checked) 和 [`locator.setChecked()`](/java/api/class-locator#locator-set-checked) 来设置复选框的选中状态。
- [`request.sizes()`](/java/api/class-request#request-sizes) 返回给定 http 请求的资源大小信息。
- [`tracing.startChunk()`](/java/api/class-tracing#tracing-start-chunk) - 开始新的跟踪块。
- [`tracing.stopChunk()`](/java/api/class-tracing#tracing-stop-chunk) - 停止新的跟踪块。

### 浏览器版本
- Chromium 96.0.4641.0
- Mozilla Firefox 92.0
- WebKit 15.0

## 版本 1.14

#### ⚡️ 新的 "strict" 模式

选择器歧义是自动化测试中的常见问题。**"strict" 模式**确保你的选择器指向单个元素，否则抛出异常。

在操作调用中设置 `setStrict(true)` 以选择加入。

```java
// 如果你有多个按钮，这将抛出异常！
page.click("button", new Page.ClickOptions().setStrict(true));
```

#### 📍 新的 [**Locators API**](./api/class-locator)

Locator 表示页面上元素的视图。它捕获在任何给定时刻检索元素所需的逻辑。

[Locator](./api/class-locator) 和 [ElementHandle](./api/class-elementhandle) 之间的区别是后者指向特定元素，而 [Locator](./api/class-locator) 捕获如何检索该元素的逻辑。

此外，定位器默认是 **"strict"** 的！

```java
Locator locator = page.locator("button");
locator.click();
```

在[文档](./api/class-locator)中了解更多。

#### 🧩 实验性 [**React**](./other-locators.md) 和 [**Vue**](./other-locators.md) 选择器引擎

React 和 Vue 选择器允许通过其组件名称和/或属性值选择元素。语法与[属性选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)非常相似，并支持所有属性选择器运算符。

```java
page.locator("_react=SubmitButton[enabled=true]").click();
page.locator("_vue=submit-button[enabled=true]").click();
```

在 [react 选择器文档](./other-locators.md) 和 [vue 选择器文档](./other-locators.md)中了解更多。

#### ✨ 新的 [**`nth`**](./other-locators.md#n-th-element-locator) 和 [**`visible`**](./other-locators.md#css-matching-only-visible-elements) 选择器引擎
- [`nth`](./other-locators.md#n-th-element-locator) 选择器引擎等同于 `:nth-match` 伪类，但可以与其他选择器引擎组合。
- [`visible`](./other-locators.md#css-matching-only-visible-elements) 选择器引擎等同于 `:visible` 伪类，但可以与其他选择器引擎组合。

```java
// 在所有按钮中选择第一个按钮
button.click("button >> nth=0");
// 或者如果你使用定位器，可以使用 first()、nth() 和 last()
page.locator("button").first().click();

// 单击可见按钮
button.click("button >> visible=true");
```

### 浏览器版本
- Chromium 94.0.4595.0
- Mozilla Firefox 91.0
- WebKit 15.0

## 版本 1.13

#### Playwright
- **🖖 程序化拖放支持** 通过 [`page.dragAndDrop()`](/java/api/class-page#page-drag-and-drop) API。
- **🔎 增强的 HAR** 带有请求和响应的正文大小。通过 [`browser.newContext()`](/java/api/class-browser#browser-new-context) 中的 `recordHar` 选项使用。

#### 工具
- Playwright 跟踪查看器现在显示参数、返回值和 `console.log()` 调用。

#### 新的和改进的指南
- [简介](./intro.md)
- [身份验证](./auth.md)

#### 浏览器版本
- Chromium 93.0.4576.0
- Mozilla Firefox 90.0
- WebKit 14.2

#### 新 Playwright API
- [`browser.newContext()`](/java/api/class-browser#browser-new-context) 和 [`browser.newPage()`](/java/api/class-browser#browser-new-page) 中的新 `baseURL` 选项
- [`response.securityDetails()`](/java/api/class-response#response-security-details) 和 [`response.serverAddr()`](/java/api/class-response#response-server-addr)
- [`page.dragAndDrop()`](/java/api/class-page#page-drag-and-drop) 和 [`frame.dragAndDrop()`](/java/api/class-frame#frame-drag-and-drop)
- [`download.cancel()`](/java/api/class-download#download-cancel)
- [`page.inputValue()`](/java/api/class-page#page-input-value)、[`frame.inputValue()`](/java/api/class-frame#frame-input-value) 和 [`elementHandle.inputValue()`](/java/api/class-elementhandle#element-handle-input-value)
- [`page.fill()`](/java/api/class-page#page-fill)、[`frame.fill()`](/java/api/class-frame#frame-fill) 和 [`elementHandle.fill()`](/java/api/class-elementhandle#element-handle-fill) 中的新 `force` 选项
- [`page.selectOption()`](/java/api/class-page#page-select-option)、[`frame.selectOption()`](/java/api/class-frame#frame-select-option) 和 [`elementHandle.selectOption()`](/java/api/class-elementhandle#element-handle-select-option) 中的新 `force` 选项

## 版本 1.12

#### 🧟‍♂️ 介绍 Playwright 跟踪查看器

[Playwright 跟踪查看器](./trace-viewer.md) 是一个新的 GUI 工具，帮助在脚本运行后探索录制的 Playwright 跟踪。Playwright 跟踪让你检查：
- 每个 Playwright 操作前后的页面 DOM
- 每个 Playwright 操作前后的页面渲染
- 脚本执行期间的浏览器网络

跟踪使用新的 [`browserContext.tracing()`](/java/api/class-browsercontext#browser-context-tracing) API 录制：

```java
Browser browser = playwright.chromium().launch();
BrowserContext context = browser.newContext();

// 在创建/导航页面之前开始跟踪。
context.tracing().start(new Tracing.StartOptions()
  .setScreenshots(true)
  .setSnapshots(true));

Page page = context.newPage();
page.navigate("https://playwright.dev");

// 停止跟踪并将其导出到 zip 存档。
context.tracing().stop(new Tracing.StopOptions()
  .setPath(Paths.get("trace.zip")));
```

稍后使用 Playwright CLI 检查跟踪：

```sh
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="show-trace trace.zip"
```

这将打开以下 GUI：

<img src="https://user-images.githubusercontent.com/746130/121109654-d66c4480-c7c0-11eb-8d4d-eb70d2b03811.png" alt="图像" width="2424" height="1544" />

👉 在[跟踪查看器文档](./trace-viewer.md)中了解更多。

#### 浏览器版本
- Chromium 93.0.4530.0
- Mozilla Firefox 89.0
- WebKit 14.2

此版本的 Playwright 还针对以下稳定渠道进行了测试：
- Google Chrome 91
- Microsoft Edge 91

#### 新 API
- [`page.emulateMedia()`](/java/api/class-page#page-emulate-media)、[`browserType.launchPersistentContext()`](/java/api/class-browsertype#browser-type-launch-persistent-context)、[`browser.newContext()`](/java/api/class-browser#browser-new-context) 和 [`browser.newPage()`](/java/api/class-browser#browser-new-page) 中的 `reducedMotion` 选项
- [`browserContext.onRequest()`](/java/api/class-browsercontext#browser-context-event-request)
- [`browserContext.onRequestFailed()`](/java/api/class-browsercontext#browser-context-event-request-failed)
- [`browserContext.onRequestFinished()`](/java/api/class-browsercontext#browser-context-event-request-finished)
- [`browserContext.onResponse()`](/java/api/class-browsercontext#browser-context-event-response)
- [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch) 和 [`browserType.launchPersistentContext()`](/java/api/class-browsertype#browser-type-launch-persistent-context) 中的 `tracesDir` 选项
- 新 [`browserContext.tracing()`](/java/api/class-browsercontext#browser-context-tracing) API 命名空间
- 新 [`download.page()`](/java/api/class-download#download-page) 方法

## 版本 1.11

🎥 新视频：[Playwright：现代 Web 的新测试自动化框架](https://youtu.be/_Jla6DyuEu4)（[幻灯片](https://docs.google.com/presentation/d/1xFhZIJrdHkVe2CuMKOrni92HoG2SWslo0DhJJQMR1DI/edit?usp=sharing)）
- 我们讨论了 Playwright
- 展示了幕后的工程工作
- 进行了新功能的现场演示 ✨
- **特别感谢** [applitools](http://applitools.com/) 主办活动并邀请我们！

#### 浏览器版本
- Chromium 92.0.4498.0
- Mozilla Firefox 89.0b6
- WebKit 14.2

#### 新 API
- 在 [`page.waitForRequest()`](/java/api/class-page#page-wait-for-request) 等方法中跨 API 支持**异步谓词**
- 新**模拟设备**：Galaxy S8、Galaxy S9+、Galaxy Tab S4、Pixel 3、Pixel 4
- 新方法：
  * [`page.waitForURL()`](/java/api/class-page#page-wait-for-url) 等待导航到 URL
  * [`video.delete()`](/java/api/class-video#video-delete) 和 [`video.saveAs()`](/java/api/class-video#video-save-as) 管理屏幕录制
- 新选项：
  * [`browser.newContext()`](/java/api/class-browser#browser-new-context) 方法中的 `screen` 选项用于模拟 `window.screen` 维度
  * [`page.check()`](/java/api/class-page#page-check) 和 [`page.uncheck()`](/java/api/class-page#page-uncheck) 方法中的 `position` 选项
  * [`page.check()`](/java/api/class-page#page-check)、[`page.uncheck()`](/java/api/class-page#page-uncheck)、[`page.click()`](/java/api/class-page#page-click)、[`page.dblclick()`](/java/api/class-page#page-dblclick)、[`page.hover()`](/java/api/class-page#page-hover) 和 [`page.tap()`](/java/api/class-page#page-tap) 中的 `trial` 选项用于干运行操作

## 版本 1.10
- [Playwright for Java v1.10](https://github.com/microsoft/playwright-java) 现在**稳定了**！
- 使用[新的渠道 API](./browsers) 对 **Google Chrome** 和 **Microsoft Edge** 稳定渠道运行 Playwright。
- Chromium 屏幕截图在 Mac 和 Windows 上**快速**。

#### 捆绑的浏览器版本
- Chromium 90.0.4430.0
- Mozilla Firefox 87.0b10
- WebKit 14.2

此版本的 Playwright 还针对以下稳定渠道进行了测试：
- Google Chrome 89
- Microsoft Edge 89

#### 新 API
- [`browserType.launch()`](/java/api/class-browsertype#browser-type-launch) 现在接受新的 `'channel'` 选项。在我们的[文档](./browsers)中了解更多。

## 版本 1.9
- [Playwright Inspector](./debug.md) 是一个**新的 GUI 工具**，用于编写和调试你的测试。
  - **逐行调试** 你的 Playwright 脚本，带有播放、暂停和单步执行。
  - 通过**录制用户操作**编写新脚本。
  - 通过将鼠标悬停在元素上为你的脚本**生成元素选择器**。
  - 设置 `PWDEBUG=1` 环境变量以启动 Inspector
- **暂停脚本执行** 使用有头模式下的 [`page.pause()`](/java/api/class-page#page-pause)。暂停页面会启动 [Playwright Inspector](./debug.md) 进行调试。
- CSS 选择器的**新 has-text 伪类**。`:has-text("example")` 匹配内部任何地方包含 `"example"` 的任何元素，可能在子元素或后代元素中。查看[更多示例](./other-locators.md#css-matching-by-text)。
- **页面对话框现在在执行期间自动关闭**，除非配置了 `dialog` 事件的监听器。[了解更多](./dialogs.md)。
- [Playwright for Python](https://github.com/microsoft/playwright-python) 现在**稳定了**，带有惯用的蛇形命名 API 和预构建的 [Docker 镜像](./docker.md) 以在 CI/CD 中运行测试。

#### 浏览器版本
- Chromium 90.0.4421.0
- Mozilla Firefox 86.0b10
- WebKit 14.1

#### 新 API
- [`page.pause()`](/java/api/class-page#page-pause)。

## 版本 1.8
- [基于布局选择元素](./other-locators.md#css-matching-elements-based-on-layout) 使用 `:left-of()`、`:right-of()`、`:above()` 和 `:below()`。
- Playwright 现在包含命令行界面，即之前的 playwright-cli。
  
  ```bash
  mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="--help"
  ```
- [`page.selectOption()`](/java/api/class-page#page-select-option) 现在等待选项出现。
- 新方法[断言元素状态](./actionability#assertions)，如 [`page.isEditable()`](/java/api/class-page#page-is-editable)。

#### 新 API
- [`elementHandle.isChecked()`](/java/api/class-elementhandle#element-handle-is-checked)。
- [`elementHandle.isDisabled()`](/java/api/class-elementhandle#element-handle-is-disabled)。
- [`elementHandle.isEditable()`](/java/api/class-elementhandle#element-handle-is-editable)。
- [`elementHandle.isEnabled()`](/java/api/class-elementhandle#element-handle-is-enabled)。
- [`elementHandle.isHidden()`](/java/api/class-elementhandle#element-handle-is-hidden)。
- [`elementHandle.isVisible()`](/java/api/class-elementhandle#element-handle-is-visible)。
- [`page.isChecked()`](/java/api/class-page#page-is-checked)。
- [`page.isDisabled()`](/java/api/class-page#page-is-disabled)。
- [`page.isEditable()`](/java/api/class-page#page-is-editable)。
- [`page.isEnabled()`](/java/api/class-page#page-is-enabled)。
- [`page.isHidden()`](/java/api/class-page#page-is-hidden)。
- [`page.isVisible()`](/java/api/class-page#page-is-visible)。
- [`elementHandle.waitForElementState()`](/java/api/class-elementhandle#element-handle-wait-for-element-state) 中的新选项 `'editable'`。

#### 浏览器版本
- Chromium 90.0.4392.0
- Mozilla Firefox 85.0b5
- WebKit 14.1

## 版本 1.7
- **新 Java SDK**：[Playwright for Java](https://github.com/microsoft/playwright-java) 现在与 [JavaScript](https://github.com/microsoft/playwright)、[Python](https://github.com/microsoft/playwright-python) 和 [.NET 绑定](https://github.com/microsoft/playwright-dotnet)同等。
- **浏览器存储 API**：新的便捷 API 用于保存和加载浏览器存储状态（cookie、本地存储）以简化需要身份验证的自动化场景。
- **新 CSS 选择器**：我们听取了你对更灵活选择器的反馈，并重新设计了选择器实现。Playwright 1.7 引入了[新的 CSS 扩展](./other-locators.md#css-locator)，还有更多即将推出。
- **新网站**：[playwright.dev](https://playwright.dev/) 的文档网站已更新，现在使用 [Docusaurus](https://v2.docusaurus.io/) 构建。
- **支持 Apple Silicon**：Playwright 的 WebKit 和 Chromium 浏览器二进制文件现在为 Apple Silicon 构建。

#### 新 API
- [`browserContext.storageState()`](/java/api/class-browsercontext#browser-context-storage-state) 获取当前状态以供以后重用。
- [`browser.newContext()`](/java/api/class-browser#browser-new-context) 和 [`browser.newPage()`](/java/api/class-browser#browser-new-page) 中的 `storageState` 选项用于设置浏览器上下文状态。

#### 浏览器版本
- Chromium 89.0.4344.0
- Mozilla Firefox 84.0b9
- WebKit 14.1
