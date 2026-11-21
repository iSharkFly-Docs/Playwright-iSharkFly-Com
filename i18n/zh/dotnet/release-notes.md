---
title: "发行说明"
---

# 发行说明

import LiteYouTube from '@site/src/components/LiteYouTube';

## 版本 1.65

### 🧾 C# 中的定位器代码

来自 [`Locator.NormalizeAsync()`](/dotnet/api/class-locator#locator-normalize) 的定位器现在可以转换为 C# 代码字符串。将其与 [`Page.GetByRef()`](/dotnet/api/class-page#page-get-by-ref) 一起使用，可以将代理在 `"ai"` 模式下从 [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) 中选取的元素转换为测试代码：

```csharp
var normalized = await page.GetByRef("e2").NormalizeAsync();
Console.WriteLine(normalized.ToString());
// GetByRole(AriaRole.Button, new() { Name = "Submit" })
```

### 新 API
- [`CdpSession.SendAsync()`](/dotnet/api/class-cdpsession#cdp-session-send) 中的新选项 [`timeout`](/dotnet/api/class-cdpsession#cdp-session-send-option-timeout)。
- 当 Playwright 断言不满足时，会抛出新的 [PlaywrightAssertionException](/dotnet/api/class-playwrightassertionexception)。它扩展了 [PlaywrightException](/dotnet/api/class-playwrightexception)，因此 `catch (PlaywrightException)` 块也会捕获它。
- 新的 `ActionTimeout` 和 `NavigationTimeout` 运行设置设置 NUnit、MSTest、xUnit 和 xUnit v3 基类创建的每个上下文的默认超时。在 [`.runsettings` 文件](./test-runners.md#using-the-runsettings-file) 中或在命令行上设置它们：
  
  ```xml
  <RunSettings>
    <Playwright>
      <ActionTimeout>10000</ActionTimeout>
      <NavigationTimeout>60000</NavigationTimeout>
    </Playwright>
  </RunSettings>
  ```
  
  ```bash
  dotnet test -- Playwright.ActionTimeout=10000 Playwright.NavigationTimeout=60000
  ```

### 破坏性变更 ⚠️
- 诸如 [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click)、[`Locator.CheckAsync()`](/dotnet/api/class-locator#locator-check)、[`Locator.TapAsync()`](/dotnet/api/class-locator#locator-tap)、[`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill)、[`Locator.ClearAsync()`](/dotnet/api/class-locator#locator-clear) 和 [`Locator.SelectOptionAsync()`](/dotnet/api/class-locator#locator-select-option) 等操作现在会等待元素[不处于惰性状态](./actionability.md#not-inert)。对具有 `inert` 属性的元素或在此类元素内部的操作，如果元素保持惰性状态，现在会超时。
- Cookie 匹配现在遵循 RFC 6265。使用 URL 时，[`BrowserContext.CookiesAsync()`](/dotnet/api/class-browsercontext#browser-context-cookies) 和 [`ApiRequestContext.CookiesAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-cookies) 不再返回子域名的仅主机 cookie 或 `/apiv2` 的 `Path=/api` cookie，并且 `Path=/foo/` cookie 不匹配 `/foo`。[APIRequestContext](/dotnet/api/class-apirequestcontext) 将没有名称的 cookie 作为 `Cookie: x` 而不是 `Cookie: =x` 发送，并将 `Set-Cookie: token` 存储为没有名称的 cookie。
- 代理凭据不再发送到网站。[`proxy`](/dotnet/api/class-browsertype#browser-type-launch-option-proxy) 选项中的凭据现在只响应代理质询。要在网站上进行身份验证，请使用 [`httpCredentials`](/dotnet/api/class-browser#browser-new-context-option-http-credentials)。
- 浏览器不渲染的文本（例如未分配到插槽的文本或直接位于关闭的 `<details>` 内的文本）不再是可访问名称和 aria 快照的一部分。这可能会改变带有名称的 [`Page.GetByRole()`](/dotnet/api/class-page#page-get-by-role)、[`Locator.AriaSnapshotAsync()`](/dotnet/api/class-locator#locator-aria-snapshot) 和 [`LocatorAssertions.ToMatchAriaSnapshotAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) 的结果。
- [APIRequestContext](/dotnet/api/class-apirequestcontext) 请求中的 `ParamsString` 选项现在会附加到 URL 已有的查询中，而不是替换它。

### 公告
* ⚠️ Playwright for .NET 现在捆绑 Node.js 26 而不是 Node.js 24。在 Linux 上，Node.js 26 需要 `libatomic1` 库。

### 浏览器版本
- Chromium 158.0.8127.18
- Mozilla Firefox 159.0
- WebKit 27.2

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 157
- Microsoft Edge 156

## 版本 1.64

### 🧰 WebMCP

新的 [`Page.Webmcp`](/dotnet/api/class-page#page-webmcp) 和 [`Frame.Webmcp`](/dotnet/api/class-frame#frame-webmcp) 可以访问页面通过实验性 [WebMCP](https://webmachinelearning.github.io/webmcp/) 浏览器 API 注册的工具，因此你可以像测试应用程序的任何其他部分一样测试它们：

```csharp
var browser = await playwright.Chromium.LaunchAsync(new() { Args = new[] { "--enable-features=WebMCP" } });
var page = await browser.NewPageAsync();
await page.GotoAsync("https://example.com");

foreach (var tool in await page.Webmcp.ToolsAsync())
    Console.WriteLine($"{tool.Name}: {tool.Description}");

var result = await page.Webmcp.CallToolAsync("add", new { a = 2, b = 40 });
Console.WriteLine(result?.GetProperty("content")[0].GetProperty("text")); // "42"
```

[Playwright MCP](https://playwright.dev/mcp/introduction) 默认也支持 WebMCP，页面定义的工具以 `webmcp_<tool>` 的形式提供给代理。传递 `--no-webmcp` 可选择退出。

[`playwright-cli`](https://playwright.dev/agent-cli/introduction) 也暴露了它们：

```bash
playwright-cli webmcp-list
playwright-cli webmcp-call search_catalog --params '{"query":"cats"}'
```

### 🎬 更好的视频

现在可以以自定义帧率录制视频，并且操作的装饰使用纯 CSS 样式：

```csharp
await page.Screencast.StartAsync(new()
{
    Path = "video.webm",
    Size = new() { Width = 1920, Height = 1080 },
    Fps = 60,
});
await page.Screencast.ShowActionsAsync(new()
{
    Style = new()
    {
        Point = "width: 20px; height: 20px; border-radius: 50%; background: red",
        Highlight = "outline: 2px solid #333; background: rgba(0, 128, 255, .15)",
        Title = "font-size: 16px",
    },
});
```
- [`Screencast.StartAsync()`](/dotnet/api/class-screencast#screencast-start) 中的新 [`recordVideoFps`](/dotnet/api/class-browser#browser-new-context-option-record-video-fps) 选项和新 [`fps`](/dotnet/api/class-screencast#screencast-start-option-fps) 选项。Firefox 和 WebKit 目前最多每秒捕获 25 帧。
- 新 [`style`](/dotnet/api/class-screencast#screencast-show-actions-option-style) 选项接受 `point` 标记、目标 `highlight` 和操作 `title` 的 CSS 声明。它取代了现已弃用的 `FontSize` 选项。
- 光标在最后一个操作点保持可见，在导航中保持存在，并沿着自然的缓动路径移动。
- 视频使用 VP9 而不是 VP8 编码，这占用更少的 CPU 并生成相同或更好质量的更小文件。
- 所有视频选项也可在 [Playwright MCP](https://playwright.dev/mcp/introduction) 和 [`playwright-cli`](https://playwright.dev/agent-cli/introduction) 中使用。

### 🪆 Locator.within()

新的 [`Locator.Within()`](/dotnet/api/class-locator#locator-within) 组合你已有的两个定位器，按自然顺序读取——"这个按钮，在那个对话框内"：

```csharp
var saveButton = page.GetByRole(AriaRole.Button, new() { Name = "Save" });
var dialog = page.GetByTestId("settings-dialog");

await saveButton.Within(dialog).ClickAsync();
```

相对定位器（如 [`Locator.Nth()`](/dotnet/api/class-locator#locator-nth) 或 [`Locator.First()`](/dotnet/api/class-locator#locator-first)）在每个父元素内分别解析，这使得类似列的查询变得简单：

```csharp
// 每行的第三个单元格，而不是表中的第三个单元格。
var thirdColumn = page.GetByRole(AriaRole.Cell).Nth(2).Within(page.GetByRole(AriaRole.Row));
await Expect(thirdColumn).ToHaveTextAsync(new[] { "Apple", "Banana", "Cherry" });
```

### 新 API
- 新 [`Page.GetByRef()`](/dotnet/api/class-page#page-get-by-ref) 通过其 aria ref（如 `e2`）定位元素，该 ref 由 `"ai"` 模式下的 [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) 报告。
- [`Page.ContentAsync()`](/dotnet/api/class-page#page-content) 和 [`Frame.ContentAsync()`](/dotnet/api/class-frame#frame-content) 中的新选项 [`includeShadow`](/dotnet/api/class-page#page-content-option-include-shadow) 将开放的 shadow root 序列化为[声明式 shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html)。
- 新选项 [`signCount`](/dotnet/api/class-credentials#credentials-create-option-sign-count) 设置虚拟凭据的初始签名计数器。[`Credentials.CreateAsync()`](/dotnet/api/class-credentials#credentials-create) 和 [`Credentials.GetAsync()`](/dotnet/api/class-credentials#credentials-get) 返回当前的 `SignCount`，并且它与存储状态中的凭据一起保存和恢复。
- 新 [`ApiRequestContext.AddCookiesAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-add-cookies)、[`ApiRequestContext.CookiesAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-cookies) 和 [`ApiRequestContext.ClearCookiesAsync()`](/dotnet/api/class-apirequestcontext#api-request-context-clear-cookies) 管理请求上下文的 cookie，与 [BrowserContext](/dotnet/api/class-browsercontext) 方法一致：
  
  ```csharp
  await request.AddCookiesAsync(new[]
  {
      new Cookie { Name = "session-id", Value = "42", Url = "https://example.com" },
  });
  Console.WriteLine(await request.CookiesAsync("https://example.com"));
  await request.ClearCookiesAsync(new() { Name = "session-id" });
  ```

### 破坏性变更 ⚠️
- 隐藏 iframe 内的元素被视为隐藏。不可见的 iframe 内的元素（例如带有 `visibility: hidden` 的 iframe）现在被操作、[`Locator.IsVisibleAsync()`](/dotnet/api/class-locator#locator-is-visible) 和 [`LocatorAssertions.ToBeVisibleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-visible) 视为隐藏。

### 浏览器版本
- Chromium 156.0.8078.4
- Mozilla Firefox 157.0
- WebKit 27.2

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 155
- Microsoft Edge 155

## 版本 1.63

### 🪟 跨帧定位

不带选择器调用的 [`Page.FrameLocator()`](/dotnet/api/class-page#page-frame-locator) 和 [`Frame.FrameLocator()`](/dotnet/api/class-frame#frame-frame-locator) 会在子树的任何帧中搜索，因此你不再需要先定位 iframe：

```csharp
// 在页面的任何帧中找到按钮。
await page.FrameLocator().GetByRole(AriaRole.Button).ClickAsync();
```

定位器的其余部分在单个帧内解析，就像常规定位器一样，当它匹配多个帧中的元素时会抛出错误。

### 👁️ 仅可见定位器

新的 [`Locator.Visible()`](/dotnet/api/class-locator#locator-visible) 返回一个仅匹配可见元素的定位器。它是 `:visible` CSS 伪类的推荐替代品：

```csharp
await page.Locator("button").Visible.ClickAsync();
```

### 🖼️ 跟踪中的 Aria 和屏幕快照

[`Tracing.StartAsync()`](/dotnet/api/class-tracing#tracing-start) 的新 [`ariaSnapshots`](/dotnet/api/class-tracing#tracing-start-option-aria-snapshots) 和 [`screenSnapshots`](/dotnet/api/class-tracing#tracing-start-option-screen-snapshots) 选项在每个操作时捕获页面的 aria 快照和屏幕截图：

```csharp
await context.Tracing.StartAsync(new()
{
  Snapshots = true,
  AriaSnapshots = true,
  ScreenSnapshots = true
});
```

录制了 aria 和屏幕快照后，跟踪查看器中的新**显示 Aria** 模式会将操作屏幕截图与 aria 快照并排显示，悬停在 aria 节点上会在屏幕截图上高亮显示它。

### 新 API

#### 浏览器和上下文
- [`httpCredentials`](/dotnet/api/class-browser#browser-new-context-option-http-credentials) 现在也接受凭据数组。使用与请求来源匹配的第一个条目，没有来源的条目匹配任何请求。
- 新选项 [`opfs`](/dotnet/api/class-browsercontext#browser-context-storage-state-option-opfs) 在存储状态中包含[源私有文件系统](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)，以便可以持久化并恢复到后续上下文中。
- 新事件 [`Page.DialogClosed`](/dotnet/api/class-page#page-event-dialog-closed) 和 [`BrowserContext.DialogClosed`](/dotnet/api/class-browsercontext#browser-context-event-dialog-closed) 在 JavaScript 对话框被接受、关闭或被用户关闭时触发。

#### 命令行
- `pwsh bin/Debug/netX/playwright.ps1 install --no-remove` 保留其他 Playwright 安装的浏览器，而不是删除它们。
- `pwsh bin/Debug/netX/playwright.ps1 codegen --http-credentials` 对受 HTTP 身份验证保护的页面进行录制。

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

[`Page.ScreenshotAsync()`](/dotnet/api/class-page#page-screenshot) 和 [`Locator.ScreenshotAsync()`](/dotnet/api/class-locator#locator-screenshot) 现在可以以 WebP 格式捕获截图——Playwright 从 `.webp` 文件扩展名推断格式，或者你可以显式设置 `type`。质量 `100`（默认）是无损的，较低的值使用有损压缩：

```csharp
await page.ScreenshotAsync(new() { Path = "homepage.webp", Quality = 50 });
```

### 新 API
- 操作上的新 `scroll` 选项（`"auto"` | `"none"`）可选择退出 Playwright 的自动滚动到视图。
- 新 [`Locator.WaitForFunctionAsync()`](/dotnet/api/class-locator#locator-wait-for-function) 等待直到函数（使用匹配元素调用）返回真值。
- 新 [`ApiResponse.Timing()`](/dotnet/api/class-apiresponse#api-response-timing) 返回 API 响应的资源计时信息。

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

新的 [Credentials](/dotnet/api/class-credentials) 虚拟认证器，通过 [`BrowserContext.Credentials`](/dotnet/api/class-browsercontext#browser-context-credentials) 可用，允许测试注册通行密钥并响应页面中的 `navigator.credentials.create()` / `navigator.credentials.get()` 仪式——无需真实硬件密钥，在所有浏览器中都能工作：

```csharp
var context = await browser.NewContextAsync();

// 为测试用户播种后端提供的通行密钥。
await context.Credentials.CreateAsync("example.com", new()
{
    Id = credentialId,
    UserHandle = userHandle,
    PrivateKey = privateKey,
    PublicKey = publicKey,
});
await context.Credentials.InstallAsync();

var page = await context.NewPageAsync();
await page.GotoAsync("https://example.com/login");
// 页面的 navigator.credentials.get() 使用播种的通行密钥响应。
```

你也可以让应用程序在设置测试中注册一次通行密钥，使用 [`Credentials.GetAsync()`](/dotnet/api/class-credentials#credentials-get) 读取它，并在后续测试中播种它——详见 [Credentials](/dotnet/api/class-credentials)。

### 🗃️ Web 存储

新的 [WebStorage](/dotnet/api/class-webstorage) API，通过 [`Page.LocalStorage`](/dotnet/api/class-page#page-local-storage) 和 [`Page.SessionStorage`](/dotnet/api/class-page#page-session-storage) 可用，读取和写入当前源的页面存储：

```csharp
await page.LocalStorage.SetItemAsync("token", "abc");
var token = await page.LocalStorage.GetItemAsync("token");
var items = await page.SessionStorage.ItemsAsync();
```

### 新 API
- [`ApiResponse.SecurityDetailsAsync()`](/dotnet/api/class-apiresponse#api-response-security-details) 和 [`ApiResponse.ServerAddrAsync()`](/dotnet/api/class-apiresponse#api-response-server-addr) 与浏览器端的 [`Response.SecurityDetailsAsync()`](/dotnet/api/class-response#response-security-details) 和 [`Response.ServerAddrAsync()`](/dotnet/api/class-response#response-server-addr) 对应。
- [`BrowserType.ConnectOverCDPAsync()`](/dotnet/api/class-browsertype#browser-type-connect-over-cdp) 中的新选项 `ArtifactsDir` 控制连接到现有浏览器时存储跟踪和下载等工件的位置。
- [`Screencast.ShowActionsAsync()`](/dotnet/api/class-screencast#screencast-show-actions) 中的新选项 `Cursor` 控制为指针操作渲染的光标装饰。
- [`Screencast.StartAsync()`](/dotnet/api/class-screencast#screencast-start) 中的 `OnFrame` 回调现在接收帧由浏览器呈现时的 `Timestamp`。

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

[`Tracing.StartHarAsync()`](/dotnet/api/class-tracing#tracing-start-har) / [`Tracing.StopHarAsync()`](/dotnet/api/class-tracing#tracing-stop-har) 将 HAR 录制作为一流的跟踪 API 公开，具有与 `RecordHar` 相同的 `Content`、`Mode` 和 `UrlFilter` 选项：

```csharp
await context.Tracing.StartHarAsync("trace.har");
var page = await context.NewPageAsync();
await page.GotoAsync("https://playwright.dev");
await context.Tracing.StopHarAsync();
```

### 🪝 Drop API

新的 [`Locator.DropAsync()`](/dotnet/api/class-locator#locator-drop) 模拟将文件或类似剪贴板的数据外部拖放到元素上。Playwright 在页面上下文中分发 `dragenter`、`dragover` 和 `drop` 以及合成的 [DataTransfer]——跨浏览器工作，非常适合测试上传区域：

```csharp
await page.Locator("#dropzone").DropAsync(new() {
    Files = new FilePayload() {
        Name = "note.txt",
        MimeType = "text/plain",
        Buffer = Encoding.UTF8.GetBytes("hello"),
    },
});

await page.Locator("#dropzone").DropAsync(new() {
    Data = new Dictionary<string, string> {
        ["text/plain"] = "hello world",
        ["text/uri-list"] = "https://example.com",
    },
});
```

### 🎯 Aria 快照
- [`PageAssertions.ToMatchAriaSnapshotAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-match-aria-snapshot) 现在可以在 [Page](/dotnet/api/class-page) 上工作，除了 [Locator](/dotnet/api/class-locator)——等同于对 `Page.Locator("body")` 进行断言。
- [`Locator.AriaSnapshotAsync()`](/dotnet/api/class-locator#locator-aria-snapshot) / [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) 上的新 `Boxes` 选项将每个元素的边界框附加为 `[box=x,y,width,height]`，对 AI 消费很有用。

### 新 API

#### 浏览器、上下文和页面
- 事件 [`Browser.Context`](/dotnet/api/class-browser#browser-event-context)——在浏览器上创建新上下文时触发。
- [BrowserContext](/dotnet/api/class-browsercontext) 现在镜像其页面的生命周期事件：[`BrowserContext.Download`](/dotnet/api/class-browsercontext#browser-context-event-download)、[`BrowserContext.FrameAttached`](/dotnet/api/class-browsercontext#browser-context-event-frame-attached)、[`BrowserContext.FrameDetached`](/dotnet/api/class-browsercontext#browser-context-event-frame-detached)、[`BrowserContext.FrameNavigated`](/dotnet/api/class-browsercontext#browser-context-event-frame-navigated)、[`BrowserContext.PageClose`](/dotnet/api/class-browsercontext#browser-context-event-page-close)、[`BrowserContext.PageLoad`](/dotnet/api/class-browsercontext#browser-context-event-page-load)。

#### 定位器和断言
- [`Page.GetByRole()`](/dotnet/api/class-page#page-get-by-role) / [`Locator.GetByRole()`](/dotnet/api/class-locator#locator-get-by-role) / [`Frame.GetByRole()`](/dotnet/api/class-frame#frame-get-by-role) / [`FrameLocator.GetByRole()`](/dotnet/api/class-framelocator#frame-locator-get-by-role) 中的新选项 `Description` 用于匹配[可访问描述](https://www.w3.org/TR/wai-aria-1.2/#dfn-accessible-description)。
- [`LocatorAssertions.ToHaveCSSAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-css) 中的新选项 `Pseudo` 从 `::before` 或 `::after` 读取计算样式。
- [`Locator.HighlightAsync()`](/dotnet/api/class-locator#locator-highlight) 中的新选项 `Style` 将额外的内联 CSS 应用于高亮覆盖层，加上新的 [`Page.HideHighlightAsync()`](/dotnet/api/class-page#page-hide-highlight) 清除所有高亮。

#### 网络
- [`WebSocketRoute.Protocols()`](/dotnet/api/class-websocketroute#web-socket-route-protocols) 返回页面请求的 WebSocket 子协议。
- [`BrowserType.ConnectOverCDPAsync()`](/dotnet/api/class-browsertype#browser-type-connect-over-cdp) 中的新选项 `NoDefaults` 禁用 Playwright 对默认上下文的默认覆盖（下载行为、焦点模拟、媒体模拟），因此连接到用户的日常浏览器不会打扰其状态。

#### 错误
- 新 [`WebError.Location()`](/dotnet/api/class-weberror#web-error-location) 与 [`ConsoleMessage.Location()`](/dotnet/api/class-consolemessage#console-message-location) 对应。

### 🛠️ 其他改进
- 跟踪查看器在网络详细信息面板中为 JSON / 表单请求和响应正文添加了美化切换。

### 破坏性变更 ⚠️
- 移除了 `BrowserContext.ExposeBindingAsync` 和 `Page.ExposeBindingAsync` 上长期弃用的 `Handle` 选项。

### 浏览器版本
- Chromium 148.0.7778.96
- Mozilla Firefox 150.0.2
- WebKit 26.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 147
- Microsoft Edge 147

## 版本 1.59

### 🎬 屏幕录制

新的 [`Page.Screencast`](/dotnet/api/class-page#page-screencast) API 提供了一个统一的界面来捕获页面内容：
- 屏幕录制
- 操作注释
- 视觉覆盖层
- 实时帧捕获
- 代理视频收据

<center>

<img src="https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/images/release-notes-1.59-screencast-demo.gif" alt="Demo" width="500" height="313" />

</center>

**屏幕录制** — 以精确的开始/停止控制录制视频，作为 [`recordVideoDir`](/dotnet/api/class-browser#browser-new-context-option-record-video-dir) 选项的替代：

```csharp
await page.Screencast.StartAsync(new() { Path = "video.webm" });
// ... 执行操作 ...
await page.Screencast.StopAsync();
```

**操作注释** — 启用内置视觉注释，在录制期间高亮显示交互元素并显示操作标题：

```csharp
await page.Screencast.ShowActionsAsync(new() { Position = "top-right" });
```

`ShowActionsAsync` 接受 `Position`（`"top-left"`、`"top"`、`"top-right"`、`"bottom-left"`、`"bottom"`、`"bottom-right"`）、`Duration`（每个注释的毫秒数）和 `FontSize`（像素）。返回一个可处理对象以停止显示操作。

**视觉覆盖层** — 在页面顶部添加章节标题和自定义 HTML 覆盖层，以提供更丰富的叙述：

```csharp
await page.Screencast.ShowChapterAsync("Adding TODOs", new() {
    Description = "Type and press enter for each TODO",
    Duration = 1000,
});

await page.Screencast.ShowOverlayAsync("<div style=\"color: red\">Recording</div>");
```

**实时帧捕获** — 流式传输 JPEG 编码的帧以进行自定义处理，如缩略图、实时预览、AI 视觉等：

```csharp
await page.Screencast.StartAsync(new() {
    OnFrame = frame => SendToVisionModel(frame.Data),
});
```

**代理视频收据** — 编码代理可以生成其工作的视频证据。完成任务后，代理可以录制带有丰富注释的演练视频供人工审查：

```csharp
await page.Screencast.StartAsync(new() { Path = "receipt.webm" });
await page.Screencast.ShowActionsAsync(new() { Position = "top-right" });

await page.Screencast.ShowChapterAsync("Verifying checkout flow", new() {
    Description = "Added coupon code support per ticket #1234",
});

// 代理执行验证步骤...
await page.Locator("#coupon").FillAsync("SAVE20");
await page.Locator("#apply-coupon").ClickAsync();
await Expect(page.Locator(".discount")).ToContainTextAsync("20%");

await page.Screencast.ShowChapterAsync("Done", new() {
    Description = "Coupon applied, discount reflected in total",
});

await page.Screencast.StopAsync();
```

生成的视频作为收据：章节标题提供上下文，操作注释高亮显示每个交互，视觉演练比文本日志更快审查。

### 🔍 快照和定位器
- 方法 [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) 捕获页面的 aria 快照——等同于 `Page.Locator("body").AriaSnapshotAsync()`。
- [`Locator.AriaSnapshotAsync()`](/dotnet/api/class-locator#locator-aria-snapshot) 中的选项 `Depth` 和 `Mode`。
- 方法 [`Locator.NormalizeAsync()`](/dotnet/api/class-locator#locator-normalize) 将定位器转换为遵循最佳实践，如测试 ID 和 aria 角色。
- 方法 [`Page.PickLocatorAsync()`](/dotnet/api/class-page#page-pick-locator) 进入交互模式，悬停在元素上会高亮显示它们并显示相应的定位器。单击元素以获取其 [Locator](/dotnet/api/class-locator)。使用 [`Page.CancelPickLocatorAsync()`](/dotnet/api/class-page#page-cancel-pick-locator) 取消。

### 新 API

#### 屏幕录制
- [`Page.Screencast`](/dotnet/api/class-page#page-screencast) 提供视频录制、实时帧流和覆盖层管理。
- 方法 [`Screencast.StartAsync()`](/dotnet/api/class-screencast#screencast-start) 和 [`Screencast.StopAsync()`](/dotnet/api/class-screencast#screencast-stop) 用于录制和帧捕获。
- 方法 [`Screencast.ShowActionsAsync()`](/dotnet/api/class-screencast#screencast-show-actions) 和 [`Screencast.HideActionsAsync()`](/dotnet/api/class-screencast#screencast-hide-actions) 用于操作注释。
- 方法 [`Screencast.ShowChapterAsync()`](/dotnet/api/class-screencast#screencast-show-chapter) 和 [`Screencast.ShowOverlayAsync()`](/dotnet/api/class-screencast#screencast-show-overlay) 用于视觉覆盖层。
- 方法 [`Screencast.ShowOverlaysAsync()`](/dotnet/api/class-screencast#screencast-show-overlays) 和 [`Screencast.HideOverlaysAsync()`](/dotnet/api/class-screencast#screencast-hide-overlays) 用于覆盖层可见性控制。

#### 存储、控制台和错误
- 方法 [`BrowserContext.SetStorageStateAsync()`](/dotnet/api/class-browsercontext#browser-context-set-storage-state) 清除所有源的现有 cookie、本地存储和 IndexedDB，并设置新的存储状态——无需创建新上下文。
- 方法 [`Page.ClearConsoleMessagesAsync()`](/dotnet/api/class-page#page-clear-console-messages) 和 [`Page.ClearPageErrorsAsync()`](/dotnet/api/class-page#page-clear-page-errors) 清除存储的消息和错误。
- [`Page.ConsoleMessagesAsync()`](/dotnet/api/class-page#page-console-messages) 和 [`Page.PageErrorsAsync()`](/dotnet/api/class-page#page-page-errors) 中的选项 `Filter` 控制返回哪些消息。
- 方法 [`ConsoleMessage.Timestamp()`](/dotnet/api/class-consolemessage#console-message-timestamp)。

#### 其他
- [`BrowserContext.Debugger`](/dotnet/api/class-browsercontext#browser-context-debugger) 提供对 Playwright 调试器的程序化控制。
- 方法 [`BrowserContext.IsClosed()`](/dotnet/api/class-browsercontext#browser-context-is-closed)。
- 方法 [`Request.ExistingResponse()`](/dotnet/api/class-request#request-existing-response) 返回响应而不等待。
- 方法 [`Response.HttpVersionAsync()`](/dotnet/api/class-response#response-http-version) 返回响应使用的 HTTP 版本。
- [`Tracing.StartAsync()`](/dotnet/api/class-tracing#tracing-start) 中的选项 `Live` 用于实时跟踪更新。
- [`BrowserType.LaunchAsync()`](/dotnet/api/class-browsertype#browser-type-launch) 中的选项 `ArtifactsDir` 配置工件目录。

### 🔗 互操作性

新的 [`Browser.BindAsync()`](/dotnet/api/class-browser#browser-bind) API 使启动的浏览器可供 `playwright-cli`、`@playwright/mcp` 和其他客户端连接。

**绑定浏览器** — 启动浏览器并绑定它，以便其他人可以连接：

```csharp
var serverInfo = await browser.BindAsync("my-session", new() {
    WorkspaceDir = "/my/project",
});
```

**从 playwright-cli 连接** — 从你喜欢的编码代理连接到正在运行的浏览器。

```bash
playwright-cli attach my-session
playwright-cli -s my-session snapshot
```

**从 @playwright/mcp 连接** — 或将你的 MCP 服务器指向正在运行的浏览器。

```bash
@playwright/mcp --endpoint=my-session
```

**从 Playwright 客户端连接** — 使用 API 连接到浏览器。同时支持多个客户端！

```csharp
var browser = await chromium.ConnectAsync(serverInfo.Endpoint);
```

传递 `Host` 和 `Port` 选项以通过 WebSocket 而不是命名管道绑定：

```csharp
var serverInfo = await browser.BindAsync("my-session", new() {
    Host = "localhost",
    Port = 0,
});
// serverInfo.Endpoint 是一个 ws:// URL
```

调用 [`Browser.UnbindAsync()`](/dotnet/api/class-browser#browser-unbind) 停止接受新连接。

### 📊 可观察性

运行 `playwright-cli show` 打开仪表板，列出所有绑定的浏览器、它们的状态，并允许与它们交互：
- 查看你的代理在后台浏览器上做什么
- 点击进入会话进行手动干预
- 打开 DevTools 检查后台浏览器的页面。

<center>

<img src="https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/images/release-notes-1.59-dashboard.png" alt="Demo" width="1169" height="835" />

</center>
- `playwright-cli` 自动绑定其所有浏览器，因此你可以看到你的代理在做什么。
- 传递 `PLAYWRIGHT_DASHBOARD=1` 环境变量以在仪表板中查看所有 `@playwright/test` 浏览器。

### 破坏性变更 ⚠️
- 移除了 WebKit 对 macOS 14 的支持。我们建议升级你的 macOS 版本，或保持使用较旧的 Playwright 版本。

### 浏览器版本
- Chromium 147.0.7727.15
- Mozilla Firefox 148.0.2
- WebKit 26.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 146
- Microsoft Edge 146

## 版本 1.58

### UI 模式和跟踪查看器改进
- 新的 'system' 主题选项跟随你的操作系统暗/亮模式偏好
- 搜索功能（Cmd/Ctrl+F）现在可在代码编辑器中使用
- 网络详细信息面板已重新组织以提高可用性
- JSON 响应现在自动格式化以提高可读性

感谢 [@cpAdm](https://github.com/cpAdm) 贡献这些改进！

### 其他

[`BrowserType.ConnectOverCDPAsync()`](/dotnet/api/class-browsertype#browser-type-connect-over-cdp) 现在接受 `IsLocal` 选项。设置为 `true` 时，它告诉 Playwright 它与 CDP 服务器在同一主机上运行，从而启用文件系统优化。

### 破坏性变更 ⚠️
- 移除了 `_react` 和 `_vue` 选择器。有关替代方案，请参阅[定位器指南](./locators.md)。
- 移除了 `:light` 选择器引擎后缀。请改用标准 CSS 选择器。
- [`BrowserType.LaunchAsync()`](/dotnet/api/class-browsertype#browser-type-launch) 中的 `Devtools` 选项已移除。请改用 `Args = new[] { "--auto-open-devtools-for-tabs" }`。
- 移除了 WebKit 对 macOS 13 的支持。我们建议升级你的 macOS 版本，或继续使用较旧的 Playwright 版本。

### 浏览器版本
- Chromium 145.0.7632.6
- Mozilla Firefox 146.0.1
- WebKit 26.0

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 144
- Microsoft Edge 144

## 版本 1.57

### Chrome for Testing

Playwright 现在运行在 [Chrome for Testing](https://googlechromelabs.github.io/chrome-for-testing/) 构建上，而不是 Chromium。有头模式使用 `chrome`；无头模式使用 `chrome-headless-shell`。升级到 v1.57 后，现有测试应该继续通过。

我们预计此切换不会带来功能变化。最大的变化是工具栏中的新图标和标题。

![new and old logo](/images/cft-logo-change.png)

如果你仍然看到意外的行为变化，请[提交问题](https://github.com/microsoft/playwright/issues/new)。

在 Arm64 Linux 上，Playwright 继续使用 Chromium。

### 破坏性变更

在弃用 3 年后，我们从 API 中移除了 `Page.Accessibility`。如果你需要测试页面可访问性，请使用其他库，如 [Axe](https://www.deque.com/axe/)。有关与 Axe 的集成，请参阅我们的 Node.js [指南](https://playwright.dev/docs/accessibility-testing)。

### 新 API
- 当 worker 内的 JavaScript 调用控制台 API 方法（如 console.log 或 console.dir）时，会触发 [`Worker.Console`](/dotnet/api/class-worker#worker-event-console) 事件。
- [`Locator.Description()`](/dotnet/api/class-locator#locator-description) 返回之前用 [`Locator.Describe()`](/dotnet/api/class-locator#locator-describe) 设置的定位器描述。
- [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) 和 [`Locator.DragToAsync()`](/dotnet/api/class-locator#locator-drag-to) 中的新选项 [`steps`](/dotnet/api/class-locator#locator-click-option-steps) 配置在将鼠标指针移动到目标元素时发出的 `mousemove` 事件数。

### 浏览器版本
- Chromium 143.0.7499.4
- Mozilla Firefox 144.0.2
- WebKit 26.0

## 版本 1.56

### 新 API
- 新方法 [`Page.ConsoleMessagesAsync()`](/dotnet/api/class-page#page-console-messages) 和 [`Page.PageErrorsAsync()`](/dotnet/api/class-page#page-page-errors) 用于获取页面最近的控制台消息
- 新方法 [`Page.RequestsAsync()`](/dotnet/api/class-page#page-requests) 用于获取页面最近的网络请求

### 破坏性变更
- 事件 [`BrowserContext.BackgroundPage`](/dotnet/api/class-browsercontext#browser-context-event-background-page) 已弃用，不会再触发。方法 [`BrowserContext.BackgroundPages()`](/dotnet/api/class-browsercontext#browser-context-background-pages) 将返回空列表

### 其他
- Aria 快照渲染和比较 `input` 的 `placeholder`

### 浏览器版本
- Chromium 141.0.7390.37
- Mozilla Firefox 142.0.1
- WebKit 26.0

## 版本 1.55

### Codegen
- 自动 `ToBeVisibleAsync()` 断言：Codegen 现在可以为常见的 UI 交互生成自动 `ToBeVisibleAsync()` 断言。此功能可以在 Codegen 设置 UI 中启用。

### 破坏性变更
- ⚠️ 放弃对 Chromium 扩展清单 v2 的支持。

### 其他
- 添加了对 Debian 13 "Trixie" 的支持。
- 添加了对 Xunit v3 的支持，作为 [`Microsoft.Playwright.Xunit.v3`](https://www.nuget.org/packages/Microsoft.Playwright.Xunit.v3) 的一部分
- 添加了对 MSTest v4 的支持，作为 [`Microsoft.Playwright.MSTest.v4`](https://www.nuget.org/packages/Microsoft.Playwright.MSTest.v4) 的一部分

### 浏览器版本
- Chromium 140.0.7339.16
- Mozilla Firefox 141.0
- WebKit 26.0

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 139
- Microsoft Edge 139
