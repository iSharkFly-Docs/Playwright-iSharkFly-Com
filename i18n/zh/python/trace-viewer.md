---
title: "跟踪查看器"
---

# 跟踪查看器

import LiteYouTube from '@site/src/components/LiteYouTube';

## 简介

Playwright 跟踪查看器是一个 GUI 工具，帮助您在脚本运行后探索录制的 Playwright 跟踪。跟踪是调试测试在 CI 上失败时的绝佳方式。您可以[在本地](#opening-trace-viewer)打开跟踪，或在浏览器中访问 [trace.playwright.dev](https://trace.playwright.dev)。

## 打开跟踪查看器

您可以使用 Playwright CLI 或在浏览器中访问 [trace.playwright.dev](https://trace.playwright.dev) 来打开保存的跟踪。确保添加 `trace.zip` 文件所在位置的完整路径。

```bash
playwright show-trace trace.zip
```

### 使用 [trace.playwright.dev](https://trace.playwright.dev)

[trace.playwright.dev](https://trace.playwright.dev) 是跟踪查看器的静态托管版本。您可以通过拖放或通过 `Select file` 按钮上传跟踪文件。

跟踪查看器完全在浏览器中加载跟踪，不会将任何数据传输到外部。

<img height="1684" width="2238" alt="拖放 Playwright 跟踪以加载" src="https://user-images.githubusercontent.com/13063165/194577918-b4d45726-2692-4093-8a28-9e73552617ef.png" />

### 查看远程跟踪

您可以使用 URL 直接打开远程跟踪。这使得无需手动从 CI 运行下载文件即可轻松查看远程跟踪。

```bash
playwright show-trace https://example.com/trace.zip
```

使用 [trace.playwright.dev](https://trace.playwright.dev) 时，您还可以将上传到某个可访问存储（例如在 CI 中）的跟踪 URL 作为查询参数传递。可能需要遵循 CORS（跨源资源共享）规则。

```txt
https://trace.playwright.dev/?trace=https://demo.playwright.dev/reports/todomvc/data/e6099cadf79aa753d5500aa9508f9d1dbd87b5ee.zip
```

## 录制跟踪

可以通过使用 `--tracing` 标志运行测试来录制跟踪。

```bash
pytest --tracing on
```

跟踪选项：
- `on`：为每个测试录制跟踪
- `off`：不录制跟踪。（默认）
- `retain-on-failure`：为每个测试录制跟踪，但从成功的测试运行中删除所有跟踪。

这将录制跟踪并将其放置在 `test-results` 目录中名为 `trace.zip` 的文件中。

<details>

<summary>如果您不使用 Pytest，点击这里了解如何录制跟踪。</summary>

::: code-group

```python [Async]
browser = await chromium.launch()
context = await browser.new_context()

# 在创建/导航页面之前开始跟踪。
await context.tracing.start(screenshots=True, snapshots=True, sources=True)

page = await context.new_page()
await page.goto("https://playwright.dev")

# 停止跟踪并将其导出到 zip 存档。
await context.tracing.stop(path = "trace.zip")
```

```python [Sync]
browser = chromium.launch()
context = browser.new_context()

# 在创建/导航页面之前开始跟踪。
context.tracing.start(screenshots=True, snapshots=True, sources=True)

page = context.new_page()
page.goto("https://playwright.dev")

# 停止跟踪并将其导出到 zip 存档。
context.tracing.stop(path = "trace.zip")
```

:::

</details>

## 跟踪查看器功能

### 操作

在操作选项卡中，您可以看到每个操作使用的定位器以及每个操作运行所花费的时间。将鼠标悬停在测试的每个操作上，可以直观地看到 DOM 快照中的变化。在时间线上前后移动并点击操作进行检查和调试。使用 Before 和 After 选项卡直观地查看操作前后发生了什么。

<img src="https://github.com/microsoft/playwright/assets/13063165/948b65cd-f0fd-4c7f-8e53-2c632b5a07f1" alt="跟踪查看器中的操作选项卡" width="3598" height="2218" />

**选择每个操作可显示：**
- 操作快照
- 操作日志
- 源代码位置

### 截图

当启用 [`screenshots`](/python/api/class-tracing#tracing-start-option-screenshots) 选项进行跟踪时（默认），每个跟踪都会录制屏幕录像并将其渲染为胶片条。您可以将鼠标悬停在胶片条上，查看每个操作和状态的放大图像，这有助于您轻松找到要检查的操作。

双击操作以查看该操作的时间范围。您可以使用时间线中的滑块来增加选定的操作，这些操作将显示在操作选项卡中，所有控制台日志和网络日志将被过滤以仅显示所选操作的日志。

<img src="https://github.com/microsoft/playwright/assets/13063165/b04a7d75-54bb-4ab2-9e30-e76f6f74a2c8" alt="跟踪查看器中的时间线视图" width="3598" height="2218" />

### 快照

当启用 [`snapshots`](/python/api/class-tracing#tracing-start-option-snapshots) 选项进行跟踪时（默认），Playwright 会为每个操作捕获一组完整的 DOM 快照。根据操作的类型，它将捕获：

| 类型 | 描述 |
|------|-------------|
|Before|调用操作时的快照。|
|Action|执行输入时的快照。这种类型的快照在探索 Playwright 确切点击位置时特别有用。|
|After|操作后的快照。|

以下是典型的 Action 快照的样子：

<img src="https://github.com/microsoft/playwright/assets/13063165/7168d549-eb0a-4964-9c93-483f03711fa9" alt="跟踪查看器中的操作选项卡" width="3598" height="2218" />

注意它如何同时高亮显示 DOM 节点和确切的点击位置。

### 源代码

当您在侧边栏中点击操作时，该操作的代码行将在源代码面板中高亮显示。

<img src="https://github.com/microsoft/playwright/assets/13063165/daa8845d-c250-4923-aa7a-5d040da9adc5" alt="跟踪查看器中的源代码选项卡" width="3598" height="2218" />

### 调用

调用选项卡显示有关操作的信息，例如花费的时间、使用的定位器、是否处于严格模式以及使用的键。

<img src="https://github.com/microsoft/playwright/assets/13063165/95498580-f9dd-4932-a123-c37fe7cfc3c2" alt="跟踪查看器中的调用选项卡" width="3598" height="2218" />

### 日志

查看测试的完整日志，以更好地了解 Playwright 在幕后做什么，例如滚动到视图中、等待元素可见、启用和稳定，以及执行点击、填充、按键等操作。

<img src="https://github.com/microsoft/playwright/assets/13063165/de621461-3bab-4140-b39d-9f02d6672dbf" alt="跟踪查看器中的测试日志" width="3598" height="2218" />

### 错误

如果您的测试失败，您将在错误选项卡中看到每个测试的错误消息。时间线还将显示一条红线，高亮显示错误发生的位置。您还可以点击源代码选项卡查看错误发生在源代码的哪一行。

<img src="https://github.com/microsoft/playwright/assets/13063165/e9ef77b3-05d1-4df2-852c-981023723d34" alt="跟踪查看器中的错误" width="3598" height="2218" />

### 控制台

查看来自浏览器和测试的控制台日志。显示不同的图标以指示控制台日志是来自浏览器还是测试文件。

<img src="https://github.com/microsoft/playwright/assets/13063165/4107c08d-1eaf-421c-bdd4-9dd2aa641d4a" alt="跟踪查看器中的测试日志" width="3598" height="2218" />

双击操作侧边栏中测试的操作。这将过滤控制台以仅显示该操作期间产生的日志。点击*显示全部*按钮再次查看所有控制台日志。

使用时间线过滤操作，通过点击起点并拖动到终点。控制台选项卡也将被过滤以仅显示所选操作期间产生的日志。

### 网络

网络选项卡显示测试期间发出的所有网络请求。您可以按不同类型的请求、状态码、方法、请求、内容类型、持续时间和大小进行排序。点击请求以查看更多信息，例如请求头、响应头、请求体和响应体。

<img src="https://github.com/microsoft/playwright/assets/13063165/0a3d1671-8ccd-4f7a-a844-35f5eb37f236" alt="跟踪查看器中的网络请求选项卡" width="3598" height="2218" />

双击操作侧边栏中测试的操作。这将过滤网络请求以仅显示该操作期间发出的请求。点击*显示全部*按钮再次查看所有网络请求。

使用时间线过滤操作，通过点击起点并拖动到终点。网络选项卡也将被过滤以仅显示所选操作期间发出的网络请求。

### 元数据

在操作选项卡旁边，您会找到元数据选项卡，它将显示有关测试的更多信息，例如浏览器、视口大小、测试持续时间等。

<img src="https://github.com/microsoft/playwright/assets/13063165/82ab3d33-1ec9-4b8a-9cf2-30a6e2d59091" alt="跟踪查看器中的元数据" width="3598" height="2218" />
