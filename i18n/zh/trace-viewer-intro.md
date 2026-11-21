---
title: "跟踪查看器"
---

# 跟踪查看器

import LiteYouTube from '@site/src/components/LiteYouTube';

## 介绍

Playwright 跟踪查看器是一个 GUI 工具，可让您浏览测试录制的 Playwright 跟踪记录，这意味着您可以前后浏览测试的每个操作，并直观地查看每个操作期间发生的情况。

**您将学习**
- [如何录制跟踪](/trace-viewer-intro.md#recording-a-trace)
- [如何打开 HTML 报告](/trace-viewer-intro.md#opening-the-html-report)
- [如何打开和查看跟踪](/trace-viewer-intro.md#opening-the-trace)

<LiteYouTube
id="yP6AnTxC34s"
title="Viewing Playwright Traces"
/>

## 录制跟踪

默认情况下，[playwright.config](./trace-viewer.md#tracing-on-ci) 文件包含为每个测试创建 `trace.zip` 文件所需的配置。跟踪设置为 `on-first-retry` 运行，这意味着它们在失败测试的第一次重试时运行。此外，在 CI 上运行时 `retries` 设置为 2，在本地运行时设置为 0。这意味着跟踪在失败测试的第一次重试时录制，而不是在第一次运行时，也不是在第二次重试时。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';
export default defineConfig({
  retries: process.env.CI ? 2 : 0, // 在 CI 上运行时设置为 2
  // ...
  use: {
    trace: 'on-first-retry', // 在每个测试的第一次重试时录制跟踪
  },
});
```

:::

要了解有关录制跟踪的可用选项的更多信息，请查看我们关于[跟踪查看器](/trace-viewer.md)的详细指南。

跟踪通常在持续集成（CI）环境中运行，因为在本地您可以使用 [UI 模式](/test-ui-mode.md)来开发和调试测试。但是，如果您想在本地运行跟踪而不使用 [UI 模式](/test-ui-mode.md)，可以使用 `--trace on` 强制开启跟踪。

```bash
npx playwright test --trace on
```

## 打开 HTML 报告

HTML 报告向您显示所有已运行测试的报告，包括在哪些浏览器上运行以及耗时多长。可以按通过的测试、失败的测试、不稳定的测试或跳过的测试进行筛选。您还可以搜索特定的测试。点击测试会打开详细视图，您可以在其中查看有关测试的更多信息，例如错误、测试步骤和跟踪。

```bash
npx playwright show-report
```

## 打开跟踪

在 HTML 报告中，点击测试文件名旁边的跟踪图标，可直接打开所需测试的跟踪。

![playwright html report](/images/getting-started/html-report-failed-tests.png)

您也可以点击打开测试的详细视图，向下滚动到 `'Traces'` 标签页，然后点击跟踪截图来打开跟踪。

![playwright html report detailed view](/images/getting-started/html-report-trace.png)

要了解有关报告器的更多信息，请查看我们关于报告器的详细指南，包括 [HTML 报告器](/test-reporters.md#html-reporter)。

## 查看跟踪

通过点击每个操作或使用时间轴悬停来查看测试的跟踪，并查看操作前后页面的状态。在测试的每个步骤中检查日志、源代码和网络、错误和控制台。跟踪查看器会创建 DOM 快照，因此您可以完全与其交互并打开浏览器开发者工具来检查 HTML、CSS 等。

![playwright trace viewer](/images/getting-started/trace-viewer-failed-test.png)

要了解有关跟踪的更多信息，请查看我们关于[跟踪查看器](/trace-viewer.md)的详细指南。

## 下一步
- [使用 GitHub Actions 在 CI 上运行测试](/ci-intro.md)
- [了解更多关于跟踪查看器的信息](/trace-viewer.md)
