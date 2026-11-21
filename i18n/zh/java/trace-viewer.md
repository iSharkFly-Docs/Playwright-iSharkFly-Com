---
title: "跟踪查看器"
---

# 跟踪查看器

import LiteYouTube from '@site/src/components/LiteYouTube';

## 简介

Playwright 跟踪查看器是一个 GUI 工具，可帮助你在脚本运行后探索录制的 Playwright 跟踪。跟踪是在 CI 上测试失败时调试测试的好方法。你可以[在本地](#opening-trace-viewer)打开跟踪，或在浏览器中通过 [trace.playwright.dev](https://trace.playwright.dev) 打开。

## 打开跟踪查看器

你可以使用 Playwright CLI 或在浏览器中通过 [trace.playwright.dev](https://trace.playwright.dev) 打开保存的跟踪。确保添加 `trace.zip` 文件所在位置的完整路径。

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="show-trace trace.zip"
```

### 使用 [trace.playwright.dev](https://trace.playwright.dev)

[trace.playwright.dev](https://trace.playwright.dev) 是跟踪查看器的静态托管版本。你可以通过拖放或通过 `Select file` 按钮上传跟踪文件。

跟踪查看器完全在你的浏览器中加载跟踪，不会向外部传输任何数据。

<img height="1684" width="2238" alt="拖放 Playwright 跟踪以加载" src="https://user-images.githubusercontent.com/13063165/194577918-b4d45726-2692-4093-8a28-9e73552617ef.png" />

### 查看远程跟踪

你可以直接使用 URL 打开远程跟踪。这使得查看远程跟踪变得很容易，而无需手动从 CI 运行中下载文件。

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="show-trace https://example.com/trace.zip"
```

当使用 [trace.playwright.dev](https://trace.playwright.dev) 时，你还可以将上传到某个可访问存储（例如在 CI 中）的跟踪的 URL 作为查询参数传递。可能适用 CORS（跨源资源共享）规则。

```txt
https://trace.playwright.dev/?trace=https://demo.playwright.dev/reports/todomvc/data/e6099cadf79aa753d5500aa9508f9d1dbd87b5ee.zip
```

## 录制跟踪

可以使用 [`browserContext.tracing()`](/java/api/class-browsercontext#browser-context-tracing) API 录制跟踪，如下所示：

```java
Browser browser = browserType.launch();
BrowserContext context = browser.newContext();

// 在创建/导航页面之前开始跟踪。
context.tracing().start(new Tracing.StartOptions()
  .setScreenshots(true)
  .setSnapshots(true)
  .setSources(true));

Page page = context.newPage();
page.navigate("https://playwright.dev");

// 停止跟踪并将其导出到 zip 存档。
context.tracing().stop(new Tracing.StopOptions()
  .setPath(Paths.get("trace.zip")));
```

这将录制跟踪并将其放入名为 `trace.zip` 的文件中。

## 跟踪查看器功能

### 操作

在操作选项卡中，你可以看到每个操作使用的定位器以及每个操作运行所需的时间。将鼠标悬停在测试的每个操作上，可以直观地看到 DOM 快照中的变化。在时间上前后移动并单击操作以检查和调试。使用"之前"和"之后"选项卡可以直观地看到操作之前和之后发生了什么。

<img src="https://github.com/microsoft/playwright/assets/13063165/948b65cd-f0fd-4c7f-8e53-2c632b5a07f1" alt="跟踪查看器中的操作选项卡" width="3598" height="2218" />

**选择每个操作会显示：**
- 操作快照
- 操作日志
- 源代码位置

### 屏幕截图

当开启 [`screenshots`](/java/api/class-tracing#tracing-start-option-screenshots) 选项进行跟踪时（默认开启），每个跟踪都会录制屏幕录像并将其渲染为胶片条。你可以将鼠标悬停在胶片条上，查看每个操作和状态的放大图像，这有助于你轻松找到要检查的操作。

双击操作以查看该操作的时间范围。你可以使用时间轴中的滑块来增加选定的操作，这些操作将显示在操作选项卡中，所有控制台日志和网络日志将被过滤为仅显示所选操作的日志。

<img src="https://github.com/microsoft/playwright/assets/13063165/b04a7d75-54bb-4ab2-9e30-e76f6f74a2c8" alt="跟踪查看器中的时间轴视图" width="3598" height="2218" />

### 快照

当开启 [`snapshots`](/java/api/class-tracing#tracing-start-option-snapshots) 选项进行跟踪时（默认开启），Playwright 会为每个操作捕获一组完整的 DOM 快照。根据操作类型，它将捕获：

| 类型 | 描述 |
|------|-------------|
|之前|调用操作时的快照。|
|操作|执行输入时的快照。这种类型的快照在探索 Playwright 确切点击位置时特别有用。|
|之后|操作后的快照。|

以下是典型的操作快照的样子：

<img src="https://github.com/microsoft/playwright/assets/13063165/7168d549-eb0a-4964-9c93-483f03711fa9" alt="跟踪查看器中的操作选项卡" width="3598" height="2218" />

注意它如何同时高亮显示 DOM 节点和确切的点击位置。

### 源代码

当你在侧边栏中单击某个操作时，该操作的代码行将在源代码面板中高亮显示。

<img src="https://github.com/microsoft/playwright/assets/13063165/daa8845d-c250-4923-aa7a-5d040da9adc5" alt="在跟踪查看器中显示源代码选项卡" width="3598" height="2218" />

### 调用

调用选项卡显示有关操作的信息，例如所花费的时间、使用的定位器、是否处于严格模式以及使用的键。

<img src="https://github.com/microsoft/playwright/assets/13063165/95498580-f9dd-4932-a123-c37fe7cfc3c2" alt="在跟踪查看器中显示调用选项卡" width="3598" height="2218" />

### 日志

查看测试的完整日志，以更好地了解 Playwright 在幕后执行的操作，例如滚动到视图、等待元素可见、启用和稳定以及执行点击、填充、按下等操作。

<img src="https://github.com/microsoft/playwright/assets/13063165/de621461-3bab-4140-b39d-9f02d6672dbf" alt="在跟踪查看器中显示测试日志" width="3598" height="2218" />

### 错误

如果测试失败，你将在错误选项卡中看到每个测试的错误消息。时间轴还将显示一条红线，高亮显示错误发生的位置。你还可以单击源代码选项卡以查看错误发生在源代码的哪一行。

<img src="https://github.com/microsoft/playwright/assets/13063165/e9ef77b3-05d1-4df2-852c-981023723d34" alt="在跟踪查看器中显示错误" width="3598" height="2218" />

### 控制台

查看来自浏览器以及测试的控制台日志。显示不同的图标以指示控制台日志是来自浏览器还是测试文件。

<img src="https://github.com/microsoft/playwright/assets/13063165/4107c08d-1eaf-421c-bdd4-9dd2aa641d4a" alt="在跟踪查看器中显示测试日志" width="3598" height="2218" />

双击操作侧边栏中测试的某个操作。这将过滤控制台以仅显示在该操作期间生成的日志。单击 *Show all* 按钮可再次查看所有控制台日志。

使用时间轴过滤操作，方法是单击起点并拖动到终点。控制台选项卡也将被过滤为仅显示在所选操作期间生成的日志。

### 网络

网络选项卡显示测试期间发出的所有网络请求。你可以按不同类型的请求、状态代码、方法、请求、内容类型、持续时间和大小进行排序。单击请求以查看有关它的更多信息，例如请求头、响应头、请求正文和响应正文。

<img src="https://github.com/microsoft/playwright/assets/13063165/0a3d1671-8ccd-4f7a-a844-35f5eb37f236" alt="跟踪查看器中的网络请求选项卡" width="3598" height="2218" />

双击操作侧边栏中测试的某个操作。这将过滤网络请求以仅显示在该操作期间发出的请求。单击 *Show all* 按钮可再次查看所有网络请求。

使用时间轴过滤操作，方法是单击起点并拖动到终点。网络选项卡也将被过滤为仅显示在所选操作期间发出的网络请求。

### 元数据

在操作选项卡旁边，你会找到元数据选项卡，它将显示有关测试的更多信息，例如浏览器、视口大小、测试持续时间等。

<img src="https://github.com/microsoft/playwright/assets/13063165/82ab3d33-1ec9-4b8a-9cf2-30a6e2d59091" alt="跟踪查看器中的元数据" width="3598" height="2218" />
