---
title: "发行说明"
---

# 发行说明

import LiteYouTube from '@site/src/components/LiteYouTube';

## 版本 1.65

### 🧾 Python 中的定位器代码

来自 [`locator.normalize()`](/python/api/class-locator#locator-normalize) 的定位器现在可以转换为 Python 代码字符串。将其与 [`page.get_by_ref()`](/python/api/class-page#page-get-by-ref) 一起使用，可以将代理在 `"ai"` 模式下从 [`page.aria_snapshot()`](/python/api/class-page#page-aria-snapshot) 中选取的元素转换为测试代码：

```python
normalized = page.get_by_ref("e2").normalize()
print(str(normalized))
# get_by_role("button", name="Submit")
```

### 新 API
- [`cdp_session.send()`](/python/api/class-cdpsession#cdp-session-send) 中的新选项 [`timeout`](/python/api/class-cdpsession#cdp-session-send-option-timeout)。

### 破坏性变更 ⚠️
- 诸如 [`locator.click()`](/python/api/class-locator#locator-click)、[`locator.check()`](/python/api/class-locator#locator-check)、[`locator.tap()`](/python/api/class-locator#locator-tap)、[`locator.fill()`](/python/api/class-locator#locator-fill)、[`locator.clear()`](/python/api/class-locator#locator-clear) 和 [`locator.select_option()`](/python/api/class-locator#locator-select-option) 等操作现在会等待元素[不处于惰性状态](./actionability.md#not-inert)。对具有 `inert` 属性的元素或在此类元素内部的操作，如果元素保持惰性状态，现在会超时。
- Cookie 匹配现在遵循 RFC 6265。使用 URL 时，[`browser_context.cookies()`](/python/api/class-browsercontext#browser-context-cookies) 和 [`api_request_context.cookies()`](/python/api/class-apirequestcontext#api-request-context-cookies) 不再返回子域名的仅主机 cookie 或 `/apiv2` 的 `Path=/api` cookie，并且 `Path=/foo/` cookie 不匹配 `/foo`。[APIRequestContext](/python/api/class-apirequestcontext) 将没有名称的 cookie 作为 `Cookie: x` 而不是 `Cookie: =x` 发送，并将 `Set-Cookie: token` 存储为没有名称的 cookie。
- 代理凭据不再发送到网站。[`proxy`](/python/api/class-browsertype#browser-type-launch-option-proxy) 选项中的凭据现在只响应代理质询。要在网站上进行身份验证，请使用 [`http_credentials`](/python/api/class-browser#browser-new-context-option-http-credentials)。
- 浏览器不渲染的文本（例如未分配到插槽的文本或直接位于关闭的 `<details>` 内的文本）不再是可访问名称和 aria 快照的一部分。这可能会改变带有名称的 [`page.get_by_role()`](/python/api/class-page#page-get-by-role)、[`locator.aria_snapshot()`](/python/api/class-locator#locator-aria-snapshot) 和 [`locator_assertions.to_match_aria_snapshot()`](/python/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) 的结果。
- [APIRequestContext](/python/api/class-apirequestcontext) 请求中 `params` 选项的字符串值现在会附加到 URL 已有的查询中，而不是替换它。

### 公告
- Playwright for Python 现在捆绑 Node.js 26 而不是 Node.js 24。在 Linux 上，Node.js 26 需要 `libatomic.so.1`。精简镜像（包括 `python:*-slim`）可能需要在运行 Playwright 之前[安装 `libatomic1`](./intro.md#linux-system-dependency)，包括 `playwright install --with-deps`。

### 浏览器版本
- Chromium 158.0.8127.18
- Mozilla Firefox 159.0
- WebKit 27.2

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 157
- Microsoft Edge 156

## 版本 1.64

### 🧰 WebMCP

新的 [`page.webmcp`](/python/api/class-page#page-webmcp) 和 [`frame.webmcp`](/python/api/class-frame#frame-webmcp) 可以访问页面通过实验性 [WebMCP](https://webmachinelearning.github.io/webmcp/) 浏览器 API 注册的工具，因此你可以像测试应用程序的任何其他部分一样测试它们：

```python
browser = chromium.launch(args=["--enable-features=WebMCP"])
page = browser.new_page()
page.goto("https://example.com")

for tool in page.webmcp.tools():
    print(tool["name"], tool["description"])

result = page.webmcp.call_tool("add", {"a": 2, "b": 40})
print(result["content"][0]["text"])  # "42"
```

[Playwright MCP](https://playwright.dev/mcp/introduction) 默认也支持 WebMCP，页面定义的工具以 `webmcp_<tool>` 的形式提供给代理。传递 `--no-webmcp` 可选择退出。

[`playwright-cli`](https://playwright.dev/agent-cli/introduction) 也暴露了它们：

```bash
playwright-cli webmcp-list
playwright-cli webmcp-call search_catalog --params '{"query":"cats"}'
```

### 🎬 更好的视频

现在可以以自定义帧率录制视频，并且操作的装饰使用纯 CSS 样式：

```python
page.screencast.start(path="video.webm", size={"width": 1920, "height": 1080}, fps=60)
page.screencast.show_actions(
    style={
        "point": "width: 20px; height: 20px; border-radius: 50%; background: red",
        "highlight": "outline: 2px solid #333; background: rgba(0, 128, 255, .15)",
        "title": "font-size: 16px",
    }
)
```
- [`screencast.start()`](/python/api/class-screencast#screencast-start) 中的新 [`record_video_fps`](/python/api/class-browser#browser-new-context-option-record-video-fps) 选项和新 [`fps`](/python/api/class-screencast#screencast-start-option-fps) 选项。Firefox 和 WebKit 目前最多每秒捕获 25 帧。
- 新 [`style`](/python/api/class-screencast#screencast-show-actions-option-style) 选项接受 `point` 标记、目标 `highlight` 和操作 `title` 的 CSS 声明。它取代了现已弃用的 `font_size` 选项。
- 光标在最后一个操作点保持可见，在导航中保持存在，并沿着自然的缓动路径移动。
- 视频使用 VP9 而不是 VP8 编码，这占用更少的 CPU 并生成相同或更好质量的更小文件。
- 所有视频选项也可在 [Playwright MCP](https://playwright.dev/mcp/introduction) 和 [`playwright-cli`](https://playwright.dev/agent-cli/introduction) 中使用。

### 🪆 Locator.within()

新的 [`locator.within()`](/python/api/class-locator#locator-within) 组合你已有的两个定位器，按自然顺序读取——"这个按钮，在那个对话框内"：

```python
save_button = page.get_by_role("button", name="Save")
dialog = page.get_by_test_id("settings-dialog")

save_button.within(dialog).click()
```

相对定位器（如 [`locator.nth()`](/python/api/class-locator#locator-nth) 或 [`locator.first()`](/python/api/class-locator#locator-first)）在每个父元素内分别解析，这使得类似列的查询变得简单：

```python
# 每行的第三个单元格，而不是表中的第三个单元格。
third_column = page.get_by_role("cell").nth(2).within(page.get_by_role("row"))
expect(third_column).to_have_text(["Apple", "Banana", "Cherry"])
```

### 新 API
- 新 [`page.get_by_ref()`](/python/api/class-page#page-get-by-ref) 通过其 aria ref（如 `e2`）定位元素，该 ref 由 `"ai"` 模式下的 [`page.aria_snapshot()`](/python/api/class-page#page-aria-snapshot) 报告。
- [`page.content()`](/python/api/class-page#page-content) 和 [`frame.content()`](/python/api/class-frame#frame-content) 中的新选项 [`include_shadow`](/python/api/class-page#page-content-option-include-shadow) 将开放的 shadow root 序列化为[声明式 shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html)。
- 新选项 [`sign_count`](/python/api/class-credentials#credentials-create-option-sign-count) 设置虚拟凭据的初始签名计数器。[`credentials.create()`](/python/api/class-credentials#credentials-create) 和 [`credentials.get()`](/python/api/class-credentials#credentials-get) 返回当前的 `sign_count`，并且它与存储状态中的凭据一起保存和恢复。
- 新 [`api_request_context.add_cookies()`](/python/api/class-apirequestcontext#api-request-context-add-cookies)、[`api_request_context.cookies()`](/python/api/class-apirequestcontext#api-request-context-cookies) 和 [`api_request_context.clear_cookies()`](/python/api/class-apirequestcontext#api-request-context-clear-cookies) 管理请求上下文的 cookie，与 [BrowserContext](/python/api/class-browsercontext) 方法一致：
  
  ```python
  request.add_cookies(
      [{"name": "session-id", "value": "42", "url": "https://example.com"}]
  )
  print(request.cookies("https://example.com"))
  request.clear_cookies(name="session-id")
  ```

### 破坏性变更 ⚠️
- 隐藏 iframe 内的元素被视为隐藏。不可见的 iframe 内的元素（例如带有 `visibility: hidden` 的 iframe）现在被操作、[`locator.is_visible()`](/python/api/class-locator#locator-is-visible) 和 [`locator_assertions.to_be_visible()`](/python/api/class-locatorassertions#locator-assertions-to-be-visible) 视为隐藏。

### 浏览器版本
- Chromium 156.0.8078.4
- Mozilla Firefox 157.0
- WebKit 27.2

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 155
- Microsoft Edge 155

## 版本 1.63

### 🪟 跨帧定位

不带选择器调用的 [`page.frame_locator()`](/python/api/class-page#page-frame-locator) 和 [`frame.frame_locator()`](/python/api/class-frame#frame-frame-locator) 会在子树的任何帧中搜索，因此你不再需要先定位 iframe：

```python
# 在页面的任何帧中找到按钮。
page.frame_locator().get_by_role("button").click()
```

定位器的其余部分在单个帧内解析，就像常规定位器一样，当它匹配多个帧中的元素时会抛出错误。

### 👁️ 仅可见定位器

新的 [`locator.visible()`](/python/api/class-locator#locator-visible) 返回一个仅匹配可见元素的定位器。它是 `:visible` CSS 伪类的推荐替代品：

```python
page.locator("button").visible.click()
```

### 🖼️ 跟踪中的 Aria 和屏幕快照

[`tracing.start()`](/python/api/class-tracing#tracing-start) 的新 [`aria_snapshots`](/python/api/class-tracing#tracing-start-option-aria-snapshots) 和 [`screen_snapshots`](/python/api/class-tracing#tracing-start-option-screen-snapshots) 选项在每个操作时捕获页面的 aria 快照和屏幕截图：

```python
context.tracing.start(snapshots=True, aria_snapshots=True, screen_snapshots=True)
```

录制了 aria 和屏幕快照后，跟踪查看器中的新**显示 Aria** 模式会将操作屏幕截图与 aria 快照并排显示，悬停在 aria 节点上会在屏幕截图上高亮显示它。

### 新 API

#### 浏览器和上下文
- [`http_credentials`](/python/api/class-browser#browser-new-context-option-http-credentials) 现在也接受凭据数组。使用与请求来源匹配的第一个条目，没有来源的条目匹配任何请求。
- 新选项 [`opfs`](/python/api/class-browsercontext#browser-context-storage-state-option-opfs) 在存储状态中包含[源私有文件系统](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)，以便可以持久化并恢复到后续上下文中。
- 新事件 [`page.on("dialogClosed")`](/python/api/class-page#page-event-dialog-closed) 和 [`browserContext.on("dialogClosed")`](/python/api/class-browsercontext#browser-context-event-dialog-closed) 在 JavaScript 对话框被接受、关闭或被用户关闭时触发。

#### 命令行
- `playwright install --no-remove` 保留其他 Playwright 安装的浏览器，而不是删除它们。
- `playwright codegen --http-credentials` 对受 HTTP 身份验证保护的页面进行录制。

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

[`page.screenshot()`](/python/api/class-page#page-screenshot) 和 [`locator.screenshot()`](/python/api/class-locator#locator-screenshot) 现在可以以 WebP 格式捕获截图——Playwright 从 `.webp` 文件扩展名推断格式，或者你可以显式设置 `type`。质量 `100`（默认）是无损的，较低的值使用有损压缩：

```python
page.screenshot(path="homepage.webp", quality=50)
```

### 新 API
- 操作上的新 `scroll` 选项（`"auto"` | `"none"`）可选择退出 Playwright 的自动滚动到视图。
- 新 [`locator.wait_for_function()`](/python/api/class-locator#locator-wait-for-function) 等待直到函数（使用匹配元素调用）返回真值。
- 新 [`api_response.timing()`](/python/api/class-apiresponse#api-response-timing) 返回 API 响应的资源计时信息。

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

新的 [Credentials](/python/api/class-credentials) 虚拟认证器，通过 [`browser_context.credentials`](/python/api/class-browsercontext#browser-context-credentials) 可用，允许测试注册通行密钥并响应页面中的 `navigator.credentials.create()` / `navigator.credentials.get()` 仪式——无需真实硬件密钥，在所有浏览器中都能工作：

```python
context = browser.new_context()

# 为测试用户播种后端提供的通行密钥。
context.credentials.create("example.com",
    id=credential_id,
    user_handle=user_handle,
    private_key=private_key,
    public_key=public_key,
)
context.credentials.install()

page = context.new_page()
page.goto("https://example.com/login")
# 页面的 navigator.credentials.get() 使用播种的通行密钥响应。
```

你也可以让应用程序在设置测试中注册一次通行密钥，使用 [`credentials.get()`](/python/api/class-credentials#credentials-get) 读取它，并在后续测试中播种它——详见 [Credentials](/python/api/class-credentials)。

### 🗃️ Web 存储

新的 [WebStorage](/python/api/class-webstorage) API，通过 [`page.local_storage`](/python/api/class-page#page-local-storage) 和 [`page.session_storage`](/python/api/class-page#page-session-storage) 可用，读取和写入当前源的页面存储：

```python
page.local_storage.set_item("token", "abc")
token = page.local_storage.get_item("token")
items = page.session_storage.items()
```

### 新 API
- [`api_response.security_details()`](/python/api/class-apiresponse#api-response-security-details) 和 [`api_response.server_addr()`](/python/api/class-apiresponse#api-response-server-addr) 与浏览器端的 [`response.security_details()`](/python/api/class-response#response-security-details) 和 [`response.server_addr()`](/python/api/class-response#response-server-addr) 对应。
- [`browser_type.connect_over_cdp()`](/python/api/class-browsertype#browser-type-connect-over-cdp) 中的新选项 `artifacts_dir` 控制连接到现有浏览器时存储跟踪和下载等工件的位置。
- [`screencast.show_actions()`](/python/api/class-screencast#screencast-show-actions) 中的新选项 `cursor` 控制为指针操作渲染的光标装饰。
- [`screencast.start()`](/python/api/class-screencast#screencast-start) 中的 `on_frame` 回调现在接收帧由浏览器呈现时的 `timestamp`。

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

[`tracing.start_har()`](/python/api/class-tracing#tracing-start-har) / [`tracing.stop_har()`](/python/api/class-tracing#tracing-stop-har) 将 HAR 录制作为一流的跟踪 API 公开，具有与 `record_har` 相同的 `content`、`mode` 和 `url_filter` 选项：

```python
context.tracing.start_har("trace.har")
page = context.new_page()
page.goto("https://playwright.dev")
context.tracing.stop_har()
```

### 🪝 Drop API

新的 [`locator.drop()`](/python/api/class-locator#locator-drop) 模拟将文件或类似剪贴板的数据外部拖放到元素上。Playwright 在页面上下文中分发 `dragenter`、`dragover` 和 `drop` 以及合成的 [DataTransfer]——跨浏览器工作，非常适合测试上传区域：

```python
page.locator("#dropzone").drop(
    files={"name": "note.txt", "mime_type": "text/plain", "buffer": b"hello"},
)

page.locator("#dropzone").drop(
    data={
        "text/plain": "hello world",
        "text/uri-list": "https://example.com",
    },
)
```

### 🎯 Aria 快照
- [`page_assertions.to_match_aria_snapshot()`](/python/api/class-pageassertions#page-assertions-to-match-aria-snapshot) 现在可以在 [Page](/python/api/class-page) 上工作，除了 [Locator](/python/api/class-locator)——等同于对 `page.locator("body")` 进行断言。
- [`locator.aria_snapshot()`](/python/api/class-locator#locator-aria-snapshot) / [`page.aria_snapshot()`](/python/api/class-page#page-aria-snapshot) 上的新 `boxes` 选项将每个元素的边界框附加为 `[box=x,y,width,height]`，对 AI 消费很有用。

### 新 API

#### 浏览器、上下文和页面
- 事件 [`browser.on("context")`](/python/api/class-browser#browser-event-context)——在浏览器上创建新上下文时触发。
- [BrowserContext](/python/api/class-browsercontext) 现在镜像其页面的生命周期事件：[`browserContext.on("download")`](/python/api/class-browsercontext#browser-context-event-download)、[`browserContext.on("frameAttached")`](/python/api/class-browsercontext#browser-context-event-frame-attached)、[`browserContext.on("frameDetached")`](/python/api/class-browsercontext#browser-context-event-frame-detached)、[`browserContext.on("frameNavigated")`](/python/api/class-browsercontext#browser-context-event-frame-navigated)、[`browserContext.on("pageClose")`](/python/api/class-browsercontext#browser-context-event-page-close)、[`browserContext.on("pageLoad")`](/python/api/class-browsercontext#browser-context-event-page-load)。

#### 定位器和断言
- [`page.get_by_role()`](/python/api/class-page#page-get-by-role) / [`locator.get_by_role()`](/python/api/class-locator#locator-get-by-role) / [`frame.get_by_role()`](/python/api/class-frame#frame-get-by-role) / [`frame_locator.get_by_role()`](/python/api/class-framelocator#frame-locator-get-by-role) 中的新选项 `description` 用于匹配[可访问描述](https://www.w3.org/TR/wai-aria-1.2/#dfn-accessible-description)。
- [`locator_assertions.to_have_css()`](/python/api/class-locatorassertions#locator-assertions-to-have-css) 中的新选项 `pseudo` 从 `::before` 或 `::after` 读取计算样式。
- [`locator.highlight()`](/python/api/class-locator#locator-highlight) 中的新选项 `style` 将额外的内联 CSS 应用于高亮覆盖层，加上新的 [`page.hide_highlight()`](/python/api/class-page#page-hide-highlight) 清除所有高亮。

#### 网络
- [`web_socket_route.protocols()`](/python/api/class-websocketroute#web-socket-route-protocols) 返回页面请求的 WebSocket 子协议。
- [`browser_type.connect_over_cdp()`](/python/api/class-browsertype#browser-type-connect-over-cdp) 中的新选项 `no_defaults` 禁用 Playwright 对默认上下文的默认覆盖（下载行为、焦点模拟、媒体模拟），因此连接到用户的日常浏览器不会打扰其状态。

#### 错误
- 新 [`web_error.location()`](/python/api/class-weberror#web-error-location) 与 [`console_message.location()`](/python/api/class-consolemessage#console-message-location) 对应。
- [`console_message.location()`](/python/api/class-consolemessage#console-message-location) 现在暴露 `line` / `column` 属性（`line_number` / `column_number` 已弃用）。

### 🛠️ 其他改进
- 跟踪查看器在网络详细信息面板中为 JSON / 表单请求和响应正文添加了美化切换。

### 破坏性变更 ⚠️
- 移除了 `BrowserContext.expose_binding` 和 `Page.expose_binding` 上长期弃用的 `handle` 选项。

### 浏览器版本
- Chromium 148.0.7778.96
- Mozilla Firefox 150.0.2
- WebKit 26.4

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 147
- Microsoft Edge 147

## 版本 1.59

### 🎬 屏幕录制

新的 [`page.screencast`](/python/api/class-page#page-screencast) API 提供了一个统一的界面来捕获页面内容：
- 屏幕录制
- 操作注释
- 视觉覆盖层
- 实时帧捕获
- 代理视频收据

<center>

<img src="https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/images/release-notes-1.59-screencast-demo.gif" alt="Demo" width="500" height="313" />

</center>

**屏幕录制** — 以精确的开始/停止控制录制视频，作为 [`record_video_dir`](/python/api/class-browser#browser-new-context-option-record-video-dir) 选项的替代：

```python
page.screencast.start(path="video.webm")
# ... 执行操作 ...
page.screencast.stop()
```

**操作注释** — 启用内置视觉注释，在录制期间高亮显示交互元素并显示操作标题：

```python
page.screencast.show_actions(position="top-right")
```

[`screencast.show_actions()`](/python/api/class-screencast#screencast-show-actions) 接受 `position`（`'top-left'`、`'top'`、`'top-right'`、`'bottom-left'`、`'bottom'`、`'bottom-right'`）、`duration`（每个注释的毫秒数）和 `font_size`（像素）。返回一个可处理对象以停止显示操作。

**视觉覆盖层** — 在页面顶部添加章节标题和自定义 HTML 覆盖层，以提供更丰富的叙述：

```python
page.screencast.show_chapter("Adding TODOs",
    description="Type and press enter for each TODO",
    duration=1000,
)

page.screencast.show_overlay('<div style="color: red">Recording</div>')
```

**实时帧捕获** — 流式传输 JPEG 编码的帧以进行自定义处理，如缩略图、实时预览、AI 视觉等：

```python
page.screencast.start(
    on_frame=lambda frame: send_to_vision_model(frame["data"]),
)
```

**代理视频收据** — 编码代理可以生成其工作的视频证据。完成任务后，代理可以录制带有丰富注释的演练视频供人工审查：

```python
page.screencast.start(path="receipt.webm")
page.screencast.show_actions(position="top-right")

page.screencast.show_chapter("Verifying checkout flow",
    description="Added coupon code support per ticket #1234",
)

# 代理执行验证步骤...
page.locator("#coupon").fill("SAVE20")
page.locator("#apply-coupon").click()
expect(page.locator(".discount")).to_contain_text("20%")

page.screencast.show_chapter("Done",
    description="Coupon applied, discount reflected in total",
)

page.screencast.stop()
```

生成的视频作为收据：章节标题提供上下文，操作注释高亮显示每个交互，视觉演练比文本日志更快审查。

### 🔍 快照和定位器
- 方法 [`page.aria_snapshot()`](/python/api/class-page#page-aria-snapshot) 捕获页面的 aria 快照——等同于 `page.locator('body').aria_snapshot()`。
- [`locator.aria_snapshot()`](/python/api/class-locator#locator-aria-snapshot) 中的选项 `depth` 和 `mode`。
- 方法 [`locator.normalize()`](/python/api/class-locator#locator-normalize) 将定位器转换为遵循最佳实践，如测试 ID 和 aria 角色。
- 方法 [`page.pick_locator()`](/python/api/class-page#page-pick-locator) 进入交互模式，悬停在元素上会高亮显示它们并显示相应的定位器。单击元素以获取其 [Locator](/python/api/class-locator)。使用 [`page.cancel_pick_locator()`](/python/api/class-page#page-cancel-pick-locator) 取消。

### 新 API

#### 屏幕录制
- [`page.screencast`](/python/api/class-page#page-screencast) 提供视频录制、实时帧流和覆盖层管理。
- 方法 [`screencast.start()`](/python/api/class-screencast#screencast-start) 和 [`screencast.stop()`](/python/api/class-screencast#screencast-stop) 用于录制和帧捕获。
- 方法 [`screencast.show_actions()`](/python/api/class-screencast#screencast-show-actions) 和 [`screencast.hide_actions()`](/python/api/class-screencast#screencast-hide-actions) 用于操作注释。
- 方法 [`screencast.show_chapter()`](/python/api/class-screencast#screencast-show-chapter) 和 [`screencast.show_overlay()`](/python/api/class-screencast#screencast-show-overlay) 用于视觉覆盖层。
- 方法 [`screencast.show_overlays()`](/python/api/class-screencast#screencast-show-overlays) 和 [`screencast.hide_overlays()`](/python/api/class-screencast#screencast-hide-overlays) 用于覆盖层可见性控制。

#### 存储、控制台和错误
- 方法 [`browser_context.set_storage_state()`](/python/api/class-browsercontext#browser-context-set-storage-state) 清除所有源的现有 cookie、本地存储和 IndexedDB，并设置新的存储状态——无需创建新上下文。
- 方法 [`page.clear_console_messages()`](/python/api/class-page#page-clear-console-messages) 和 [`page.clear_page_errors()`](/python/api/class-page#page-clear-page-errors) 清除存储的消息和错误。
- [`page.console_messages()`](/python/api/class-page#page-console-messages) 和 [`page.page_errors()`](/python/api/class-page#page-page-errors) 中的选项 `filter` 控制返回哪些消息。
- 方法 [`console_message.timestamp()`](/python/api/class-consolemessage#console-message-timestamp)。

#### 其他
- [`browser_context.debugger`](/python/api/class-browsercontext#browser-context-debugger) 提供对 Playwright 调试器的程序化控制。
- 方法 [`browser_context.is_closed()`](/python/api/class-browsercontext#browser-context-is-closed)。
- 方法 [`request.existing_response()`](/python/api/class-request#request-existing-response) 返回响应而不等待。
- 方法 [`response.http_version()`](/python/api/class-response#response-http-version) 返回响应使用的 HTTP 版本。
- [`tracing.start()`](/python/api/class-tracing#tracing-start) 中的选项 `live` 用于实时跟踪更新。
- [`browser_type.launch()`](/python/api/class-browsertype#browser-type-launch) 中的选项 `artifacts_dir` 配置工件目录。

### 🔗 互操作性

新的 [`browser.bind()`](/python/api/class-browser#browser-bind) API 使启动的浏览器可供 `playwright-cli`、`@playwright/mcp` 和其他客户端连接。

**绑定浏览器** — 启动浏览器并绑定它，以便其他人可以连接：

```python
server_info = await browser.bind("my-session",
    workspace_dir="/my/project",
)
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

```python
browser = await chromium.connect(server_info["endpoint"])
```

传递 `host` 和 `port` 选项以通过 WebSocket 而不是命名管道绑定：

```python
server_info = await browser.bind("my-session",
    host="localhost",
    port=0,
)
# server_info["endpoint"] 是一个 ws:// URL
```

调用 [`browser.unbind()`](/python/api/class-browser#browser-unbind) 停止接受新连接。

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

[`browser_type.connect_over_cdp()`](/python/api/class-browsertype#browser-type-connect-over-cdp) 现在接受 `is_local` 选项。设置为 `True` 时，它告诉 Playwright 它与 CDP 服务器在同一主机上运行，从而启用文件系统优化。

### 破坏性变更 ⚠️
- 移除了 `_react` 和 `_vue` 选择器。有关替代方案，请参阅[定位器指南](./locators.md)。
- 移除了 `:light` 选择器引擎后缀。请改用标准 CSS 选择器。
- [`browser_type.launch()`](/python/api/class-browsertype#browser-type-launch) 中的 `devtools` 选项已移除。请改用 `args=['--auto-open-devtools-for-tabs']`。
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

在弃用 3 年后，我们从 API 中移除了 `page.accessibility`。如果你需要测试页面可访问性，请使用其他库，如 [Axe](https://www.deque.com/axe/)。有关与 Axe 的集成，请参阅我们的 Node.js [指南](https://playwright.dev/docs/accessibility-testing)。

### 新 API
- 当 worker 内的 JavaScript 调用控制台 API 方法（如 console.log 或 console.dir）时，会触发 [`worker.on("console")`](/python/api/class-worker#worker-event-console) 事件。可以使用 [`worker.expect_event()`](/python/api/class-worker#worker-wait-for-event) 等待它。
- [`locator.description()`](/python/api/class-locator#locator-description) 返回之前用 [`locator.describe()`](/python/api/class-locator#locator-describe) 设置的定位器描述。
- [`locator.click()`](/python/api/class-locator#locator-click) 和 [`locator.drag_to()`](/python/api/class-locator#locator-drag-to) 中的新选项 [`steps`](/python/api/class-locator#locator-click-option-steps) 配置在将鼠标指针移动到目标元素时发出的 `mousemove` 事件数。
- [Service Workers](./service-workers.md#network-events-and-routing) 发出的网络请求现在会报告，并且可以通过 [BrowserContext](./api/class-browsercontext.md) 路由，仅在 Chromium 中。你可以使用 `PLAYWRIGHT_DISABLE_SERVICE_WORKER_NETWORK` 环境变量选择退出。
- Service Workers 的控制台消息通过 [`worker.on("console")`](/python/api/class-worker#worker-event-console) 分发。你可以使用 `PLAYWRIGHT_DISABLE_SERVICE_WORKER_CONSOLE` 环境变量选择退出。

### 浏览器版本
- Chromium 143.0.7499.4
- Mozilla Firefox 144.0.2
- WebKit 26.0

## 版本 1.56

### 新 API
- 新方法 [`page.console_messages()`](/python/api/class-page#page-console-messages) 和 [`page.page_errors()`](/python/api/class-page#page-page-errors) 用于获取页面最近的控制台消息
- 新方法 [`page.requests()`](/python/api/class-page#page-requests) 用于获取页面最近的网络请求

### 破坏性变更
- 事件 [`browserContext.on("backgroundPage")`](/python/api/class-browsercontext#browser-context-event-background-page) 已弃用，不会再触发。方法 [`browser_context.background_pages()`](/python/api/class-browsercontext#browser-context-background-pages) 将返回空列表

### 其他
- Aria 快照渲染和比较 `input` 的 `placeholder`

### 浏览器版本
- Chromium 141.0.7390.37
- Mozilla Firefox 142.0.1
- WebKit 26.0

## 版本 1.55

### Codegen
- 自动 `to_be_visible()` 断言：Codegen 现在可以为常见的 UI 交互生成自动 `to_be_visible()` 断言。此功能可以在 Codegen 设置 UI 中启用。

### 破坏性变更
- ⚠️ 放弃对 Chromium 扩展清单 v2 的支持。

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
- [`browser_context.cookies()`](/python/api/class-browsercontext#browser-context-cookies) 和 [`browser_context.add_cookies()`](/python/api/class-browsercontext#browser-context-add-cookies) 中的新 cookie 属性 `partition_key`。此属性允许保存和恢复分区 cookie。有关更多信息，请参阅 [CHIPS MDN 文章](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies)。请注意，浏览器对 cookie 分区有不同的支持和默认设置。
- 多个命令中的新选项 `--user-data-dir`。你可以指定相同的用户数据目录以在会话之间重用浏览状态，如身份验证。
  
  ```bash
  playwright codegen --user-data-dir=./user-data
  ```
- `playwright open` 不再打开测试录制器。请改用 `playwright codegen`。

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
  
  <img src="https://github.com/user-attachments/assets/1963ff7d-4070-41be-a79b-4333176921a2" alt="New Trace Viewer Steps" width="1562" height="1364" />
- 新方法 [`locator.describe()`](/python/api/class-locator#locator-describe) 用于描述定位器。用于跟踪查看器。
  
  ```python
  button = page.get_by_test_id("btn-sub").describe("Subscribe button")
  button.click()
  ```
- `python -m playwright install --list` 现在将列出所有已安装的浏览器、版本和位置。

### 浏览器版本
- Chromium 138.0.7204.4
- Mozilla Firefox 139.0
- WebKit 18.5

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 137
- Microsoft Edge 137

## 版本 1.52

### 亮点
- 新方法 [`locator_assertions.to_contain_class()`](/python/api/class-locatorassertions#locator-assertions-to-contain-class) 用于方便地断言元素上的单个类名。
  
  ```python
    expect(page.get_by_role('listitem', name='Ship v1.52')).to_contain_class('done')
  ```
- [Aria 快照](./aria-snapshots.md) 获得了两个新属性：用于严格匹配的 [`/children`](./aria-snapshots.md#strict-matching) 和用于链接的 [`/url`](./aria-snapshots.md#links)。
  
  ```python
  expect(locator).to_match_aria_snapshot("""
    - list
      - /children: equal
      - listitem: Feature A
      - listitem:
        - link "Feature B":
          - /url: "https://playwright.dev"
  """)
  ```

### 其他
- [`api_request.new_context()`](/python/api/class-apirequest#api-request-new-context) 中的新选项 [`max_redirects`](/python/api/class-apirequest#api-request-new-context-option-max-redirects) 用于控制最大重定向次数。

### 破坏性变更
- [`page.route()`](/python/api/class-page#page-route) 等方法中的 Glob URL 模式不再支持 `?` 和 `[]`。我们建议改用正则表达式。
- 方法 [`route.continue_()`](/python/api/class-route#route-continue) 不再允许覆盖 `Cookie` 头。如果提供了 `Cookie` 头，它将被忽略，cookie 将从浏览器的 cookie 存储中加载。要设置自定义 cookie，请使用 [`browser_context.add_cookies()`](/python/api/class-browsercontext#browser-context-add-cookies)。
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
* [`browser_context.storage_state()`](/python/api/class-browsercontext#browser-context-storage-state) 的新选项 [`indexed_db`](/python/api/class-browsercontext#browser-context-storage-state-option-indexed-db) 允许保存和恢复 IndexedDB 内容。当你的应用程序使用 [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 存储身份验证令牌（如 Firebase Authentication）时很有用。
  
  以下是遵循[身份验证指南](./auth.md#reusing-signed-in-state)的示例：
  
  ```python
  # 将存储状态保存到文件。确保包含 IndexedDB。
  storage = await context.storage_state(path="state.json", indexed_db=True)
  
  # 使用保存的存储状态创建新上下文。
  context = await browser.new_context(storage_state="state.json")
  ```
* [`locator.filter()`](/python/api/class-locator#locator-filter) 的新选项 [`visible`](/python/api/class-locator#locator-filter-option-visible) 允许仅匹配可见元素。
  
  ```python
  # 忽略不可见的待办事项。
  todo_items = page.get_by_test_id("todo-item").filter(visible=True)
  # 检查正好有 3 个可见的。
  await expect(todo_items).to_have_count(3)
  ```
* [`page.emulate_media()`](/python/api/class-page#page-emulate-media) 和 [`browser.new_context()`](/python/api/class-browser#browser-new-context) 方法的新选项 `contrast` 允许模拟 `prefers-contrast` 媒体特性。
* 新选项 [`fail_on_status_code`](/python/api/class-apirequest#api-request-new-context-option-fail-on-status-code) 使通过 [APIRequestContext](/python/api/class-apirequestcontext) 发出的所有 fetch 请求在响应代码不是 2xx 和 3xx 时抛出异常。

### 浏览器版本
* Chromium 134.0.6998.35
* Mozilla Firefox 135.0
* WebKit 18.4

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 133
* Microsoft Edge 133

## 版本 1.50

### 异步 Pytest 插件
* [Playwright 的 Pytest 插件](./test-runners.md) 现在支持 [异步 Fixtures](https://playwright.dev/python/docs/test-runners#async-fixtures)。

### 其他
* 添加了方法 [`locator_assertions.to_have_accessible_error_message()`](/python/api/class-locatorassertions#locator-assertions-to-have-accessible-error-message) 用于断言定位器指向具有给定 [aria errormessage](https://w3c.github.io/aria/#aria-errormessage) 的元素。

### UI 更新
* Codegen 中用于选择元素以生成 aria 快照的新按钮。
* 现在在跟踪中的操作 API 调用旁边显示额外详细信息（如按下的键）。
* 跟踪中 `canvas` 内容的显示容易出错。默认情况下现已禁用显示，可以通过 `Display canvas content` UI 设置启用。
* `Call` 和 `Network` 面板现在显示额外的时间信息。

### 破坏性变更
* [`locator_assertions.to_be_editable()`](/python/api/class-locatorassertions#locator-assertions-to-be-editable) 和 [`locator.is_editable()`](/python/api/class-locator#locator-is-editable) 如果目标元素不是 `<input>`、`<select>` 或其他一些可编辑元素，现在会抛出异常。

### 浏览器版本
* Chromium 133.0.6943.16
* Mozilla Firefox 134.0
* WebKit 18.2

此版本还针对以下稳定渠道进行了测试：
* Google Chrome 132
* Microsoft Edge 132

## 版本 1.49

### Aria 快照

新断言 [`locator_assertions.to_match_aria_snapshot()`](/python/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) 通过与预期的可访问性树（表示为 YAML）进行比较来验证页面结构。

```python
page.goto("https://playwright.dev")
expect(page.locator('body')).to_match_aria_snapshot('''
  - banner:
    - heading /Playwright enables reliable/ [level=1]
    - link "Get started"
    - link "Star microsoft/playwright on GitHub"
  - main:
    - img "Browsers (Chromium, Firefox, WebKit)"
    - heading "Any browser • Any platform • One API"
''')
```

你可以使用[测试生成器](./codegen)或调用 [`locator.aria_snapshot()`](/python/api/class-locator#locator-aria-snapshot) 生成此断言。

在 [aria 快照指南](./aria-snapshots) 中了解更多信息。

### 跟踪分组

新方法 [`tracing.group()`](/python/api/class-tracing#tracing-group) 允许你在跟踪查看器中可视化地分组操作。

```python
# group 和 group_end 之间的所有操作
# 将在跟踪查看器中显示为一个组。
page.context.tracing.group("Open Playwright.dev > API")
page.goto("https://playwright.dev/")
page.get_by_role("link", name="API").click()
page.context.tracing.group_end()
```

### 破坏性变更：`chrome` 和 `msedge` 渠道切换到新的无头模式

如果你在 `playwright.config.ts` 中使用以下渠道之一，此更改会影响你：
- `chrome`、`chrome-dev`、`chrome-beta` 或 `chrome-canary`
- `msedge`、`msedge-dev`、`msedge-beta` 或 `msedge-canary`

更新到 Playwright v1.49 后，运行你的测试套件。如果它仍然通过，你就可以了。如果不是，你可能需要更新快照，并调整围绕 PDF 查看器和扩展的一些测试代码。有关更多详细信息，请参阅 [issue #33566](https://github.com/microsoft/playwright/issues/33566)。

### 尝试新的 Chromium 无头

你可以通过使用 `'chromium'` 渠道选择加入新的无头模式。正如[官方 Chrome 文档所说](https://developer.chrome.com/blog/chrome-headless-shell)：

> New Headless 是真正的 Chrome 浏览器，因此更真实、更可靠，并提供更多功能。这使其更适合高精度端到端 Web 应用测试或浏览器扩展测试。

有关你可能遇到的可能中断列表和有关 Chromium 无头的更多详细信息，请参阅 [issue #33566](https://github.com/microsoft/playwright/issues/33566)。如果你在选择加入后看到任何问题，请提交问题。

```bash
pytest test_login.py --browser-channel chromium
```

### 其他
- Ubuntu 20.04 和 Debian 11 上的 WebKit 将不再有更新。我们建议将你的操作系统更新到较新版本。
- 快照内的 `<canvas>` 元素现在绘制预览。
- 不再支持 Python 3.8。

### 浏览器版本
- Chromium 131.0.6778.33
- Mozilla Firefox 132.0
- WebKit 18.2

此版本还针对以下稳定渠道进行了测试：
- Google Chrome 130
- Microsoft Edge 130
