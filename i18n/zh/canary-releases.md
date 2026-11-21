---
title: "金丝雀版本"
---

# 金丝雀版本

## 简介

Playwright for Node.js 有一个金丝雀版本发布系统。

它允许你**测试未发布的新功能**，而不用等待正式发布。这些版本每天在 Playwright 的 `next` NPM 标签下发布。

这是**向维护者提供反馈**的好方法，确保新实现的功能按预期工作。

::: info
在生产环境中使用金丝雀版本可能看起来有风险，但实际上并非如此。

金丝雀版本通过了所有自动化测试，并用于通过端到端测试来测试 HTML 报告、Trace Viewer 或 Playwright Inspector 等功能。
:::

## Next npm Dist 标签

对于 `main` 分支上任何与代码相关的提交，持续集成将在 `@next` npm dist 标签下发布每日金丝雀版本。

你可以在 [npm](https://www.npmjs.com/package/@playwright/test?activeTab=versions) 上看到当前的 dist 标签：
- `latest`：稳定版本
- `next`：下一版本，每日发布
- `beta`：在发布分支被切出后，通常在稳定版本发布前一周，每次提交都会在此标签下发布

## 使用金丝雀版本

```bash
npm install -D @playwright/test@next
```

## 文档

稳定版和 `next` 版本的文档发布在 [playwright.dev](https://playwright.dev)。要查看 `next` 版本的文档，在键盘上按 <kbd>Shift</kbd> 键 5 次。
