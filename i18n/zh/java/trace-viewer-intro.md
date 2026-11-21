---
title: "Trace Viewer"
---

# Trace Viewer

## 简介

Playwright Trace Viewer 是一个 GUI 工具，可让您浏览记录的 Playwright 测试追踪，这意味着您可以前进和后退测试的每个操作，并直观地看到每个操作期间发生的情况。

**您将学习**
- 如何录制追踪
- 如何打开 Trace Viewer

## 录制追踪

可以使用 [`browserContext.tracing()`](/java/api/class-browsercontext#browser-context-tracing) API 录制追踪，如下所示：

```java
Browser browser = browserType.launch();
BrowserContext context = browser.newContext();

// 在创建/导航页面之前开始追踪。
context.tracing().start(new Tracing.StartOptions()
  .setScreenshots(true)
  .setSnapshots(true)
  .setSources(true));

Page page = context.newPage();
page.navigate("https://playwright.dev");

// 停止追踪并将其导出到 zip 存档。
context.tracing().stop(new Tracing.StopOptions()
  .setPath(Paths.get("trace.zip")));
```

这将录制追踪并将其放入名为 `trace.zip` 的文件中。

## 打开追踪

您可以使用 Playwright CLI 或在浏览器中通过 [`trace.playwright.dev`](https://trace.playwright.dev) 打开保存的追踪。确保添加追踪 zip 文件所在位置的完整路径。打开后，您可以点击每个操作或使用时间线查看每个操作前后的页面状态。您还可以在测试的每个步骤中检查日志、源代码和网络。Trace Viewer 会创建 DOM 快照，因此您可以完全与之交互、打开开发者工具等。

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="show-trace trace.zip"
```

###### 
<img src="https://github.com/microsoft/playwright/assets/13063165/10fe3585-8401-4051-b1c2-b2e92ac4c274" alt="Playwright Trace Viewer" width="3598" height="2218" />

要了解更多信息，请查看我们关于 [Trace Viewer](/trace-viewer.md) 的详细指南。

## 下一步
- [使用 GitHub Actions 在 CI 上运行测试](/ci-intro.md)
- [了解更多关于 Trace Viewer 的信息](/trace-viewer.md)
