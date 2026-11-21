---
title: "隔离"
---

# 隔离

## 简介

使用 Playwright 编写的测试在称为浏览器上下文的隔离洁净环境中执行。这种隔离模型提高了可重复性并防止测试失败的连锁反应。

## 什么是测试隔离？

测试隔离是指每个测试与其他测试完全隔离。每个测试独立运行，不受其他测试影响。这意味着每个测试都有自己的本地存储、会话存储、cookie 等。Playwright 使用 [BrowserContext](/dotnet/api/class-browsercontext) 来实现这一点，它们相当于类似隐身模式的配置文件。它们创建快速且成本低廉，完全隔离，即使在单个浏览器中运行也是如此。Playwright 为每个测试创建一个上下文，并在该上下文中提供一个默认的 [Page](/dotnet/api/class-page)。

## 为什么测试隔离很重要？
- 没有失败传递。如果一个测试失败，它不会影响其他测试。
- 容易调试错误或不稳定性，因为你可以根据需要多次运行单个测试。
- 在并行运行、分片等情况下不必考虑顺序。

## 测试隔离的两种方式

测试隔离有两种不同的策略：从头开始或在测试之间清理。在测试之间清理的问题是很容易忘记清理，而且有些东西是无法清理的，比如"已访问的链接"。一个测试的状态可能泄漏到下一个测试，这可能导致测试失败，并使调试变得更加困难，因为问题来自另一个测试。从头开始意味着一切都是新的，所以如果测试失败，你只需要在该测试内部查找调试。

## Playwright 如何实现测试隔离

Playwright 使用浏览器上下文来实现测试隔离。每个测试都有自己的浏览器上下文。运行测试时每次都会创建一个新的浏览器上下文。当使用 Playwright 作为测试运行器时，浏览器上下文默认创建。否则，你可以手动创建浏览器上下文。

```csharp
using var playwright = await Playwright.CreateAsync();
var browser = await playwright.Chromium.LaunchAsync();
var context = await browser.NewContextAsync();
var page = await context.NewPageAsync();
```

浏览器上下文还可以用于模拟涉及移动设备、权限、语言环境和配色方案的多页面场景。查看我们的[模拟](./emulation.md)指南了解更多详情。

## 单个测试中的多个上下文

Playwright 可以在单个场景中创建多个浏览器上下文。当你想要测试多用户功能（如聊天）时，这很有用。

```csharp
using Microsoft.Playwright;
using System.Threading.Tasks;

class Program
{
    public static async Task Main()
    {
        using var playwright = await Playwright.CreateAsync();
        // 创建 Chromium 浏览器实例
        await using var browser = await playwright.Chromium.LaunchAsync();
        await using var userContext = await browser.NewContextAsync();
        await using var adminContext = await browser.NewContextAsync();
        // 创建页面并独立与上下文交互。
    }
}
```
