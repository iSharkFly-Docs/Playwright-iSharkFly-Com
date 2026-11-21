---
title: "隔离"
---

# 隔离

## 简介

使用 Playwright 编写的测试在称为浏览器上下文的隔离、干净的环境中执行。这种隔离模型提高了可重复性并防止级联测试失败。

## 什么是测试隔离？

测试隔离是指每个测试与其他测试完全隔离。每个测试独立于任何其他测试运行。这意味着每个测试都有自己的本地存储、会话存储、cookies 等。Playwright 使用 [BrowserContext](/python/api/class-browsercontext) 来实现这一点，它们相当于隐身模式配置文件。它们创建快速且成本低，即使在单个浏览器中运行也是完全隔离的。Playwright 为每个测试创建一个上下文，并在该上下文中提供一个默认的 [Page](/python/api/class-page)。

## 为什么测试隔离很重要？
- 没有失败传递。如果一个测试失败，不会影响其他测试。
- 易于调试错误或不稳定性，因为您可以根据需要多次运行单个测试。
- 在并行运行、分片等情况下不必考虑顺序。

## 测试隔离的两种方式

测试隔离有两种不同的策略：从头开始或在测试之间清理。在测试之间清理的问题是容易忘记清理，并且有些东西无法清理，如"访问过的链接"。一个测试的状态可能泄漏到下一个测试中，这可能导致您的测试失败并使调试更加困难，因为问题来自另一个测试。从头开始意味着一切都是新的，所以如果测试失败，您只需在该测试内部查找进行调试。

## Playwright 如何实现测试隔离

Playwright 使用浏览器上下文来实现测试隔离。每个测试都有自己的浏览器上下文。运行测试每次都会创建一个新的浏览器上下文。当使用 Playwright 作为测试运行器时，默认会创建浏览器上下文。否则，您可以手动创建浏览器上下文。

::: code-group

```python [Async]
browser = await playwright.chromium.launch()
context = await browser.new_context()
page = await context.new_page()
```

```python [Sync]
browser = playwright.chromium.launch()
context = browser.new_context()
page = context.new_page()
```

:::

浏览器上下文还可用于模拟涉及移动设备、权限、语言环境和配色方案的多页面场景。查看我们的[模拟](./emulation.md)指南了解更多详情。

## 单个测试中的多个上下文

Playwright 可以在单个场景中创建多个浏览器上下文。这在您想测试多用户功能（如聊天）时非常有用。

::: code-group

```python [Async]
import asyncio
from playwright.async_api import async_playwright, Playwright

async def run(playwright: Playwright):
    # 创建一个 chromium 浏览器实例
    chromium = playwright.chromium
    browser = await chromium.launch()

    # 创建两个隔离的浏览器上下文
    user_context = await browser.new_context()
    admin_context = await browser.new_context()

    # 创建页面并独立与上下文交互

async def main():
    async with async_playwright() as playwright:
        await run(playwright)
asyncio.run(main())
```

```python [Sync]
from playwright.sync_api import sync_playwright, Playwright

def run(playwright: Playwright):
    # 创建一个 chromium 浏览器实例
    chromium = playwright.chromium
    browser = chromium.launch()

    # 创建两个隔离的浏览器上下文
    user_context = browser.new_context()
    admin_context = browser.new_context()

    # 创建页面并独立与上下文交互

with sync_playwright() as playwright:
    run(playwright)
```

:::
