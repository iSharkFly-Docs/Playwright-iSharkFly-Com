---
title: "Trace Viewer"
---

# Trace Viewer

## 介绍

Playwright Trace Viewer 是一个 GUI 工具，让你可以探索测试的 Playwright 追踪记录，这意味着你可以前后浏览测试的每个操作，并直观地看到每个操作期间发生了什么。

**你将学到**
- 如何录制追踪
- 如何打开 trace viewer

## 录制追踪

可以通过使用 `--tracing` 标志运行测试来录制追踪。

```bash
pytest --tracing on
```

追踪选项包括：
- `on`：为每个测试录制追踪
- `off`：不录制追踪。（默认）
- `retain-on-failure`：为每个测试录制追踪，但删除成功测试运行的所有追踪。

这将录制追踪并将其放入 `test-results` 目录中名为 `trace.zip` 的文件中。

<details>

<summary>如果你没有使用 Pytest，点击这里了解如何录制追踪。</summary>

::: code-group

```python [Async]
browser = await chromium.launch()
context = await browser.new_context()

# 在创建/导航页面之前开始追踪。
await context.tracing.start(screenshots=True, snapshots=True, sources=True)

page = await context.new_page()
await page.goto("https://playwright.dev")

# 停止追踪并将其导出到 zip 存档。
await context.tracing.stop(path = "trace.zip")
```

```python [Sync]
browser = chromium.launch()
context = browser.new_context()

# 在创建/导航页面之前开始追踪。
context.tracing.start(screenshots=True, snapshots=True, sources=True)

page = context.new_page()
page.goto("https://playwright.dev")

# 停止追踪并将其导出到 zip 存档。
context.tracing.stop(path = "trace.zip")
```

:::

</details>

## 打开追踪

你可以使用 Playwright CLI 或在浏览器中通过 [`trace.playwright.dev`](https://trace.playwright.dev) 打开保存的追踪。确保添加追踪 zip 文件所在位置的完整路径。打开后，你可以点击每个操作或使用时间线查看每个操作之前和之后的页面状态。你还可以在测试的每个步骤中检查日志、源代码和网络。trace viewer 创建 DOM 快照，因此你可以与之完全交互、打开 devtools 等。

```bash
playwright show-trace trace.zip
```

###### 
<img src="https://github.com/microsoft/playwright/assets/13063165/10fe3585-8401-4051-b1c2-b2e92ac4c274" alt="playwright trace viewer" width="3598" height="2218" />

要了解更多信息，请查看我们关于 [Trace Viewer](/trace-viewer.md) 的详细指南。

## 下一步
- [使用 GitHub Actions 在 CI 上运行测试](/ci-intro.md)
- [了解更多关于 Trace Viewer](/trace-viewer.md)
