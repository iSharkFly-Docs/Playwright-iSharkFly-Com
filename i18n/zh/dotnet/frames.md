---
title: "框架"
---

# 框架

## 简介

[Page](/dotnet/api/class-page) 可以有一个或多个附加的 [Frame](/dotnet/api/class-frame) 对象。每个页面都有一个主框架，页面级别的交互（如 `click`）假定在主框架中操作。

页面可以使用 `iframe` HTML 标签附加额外的框架。可以访问这些框架以在框架内进行交互。

```csharp
// 定位框架内的元素
var username = await page.FrameLocator(".frame-class").GetByLabel("User Name");
await username.FillAsync("John");
```

## 框架对象

可以使用 [`Page.Frame()`](/dotnet/api/class-page#page-frame) API 访问框架对象：

```csharp
// 创建页面。
var page = await context.NewPageAsync();

// 使用框架的 name 属性获取框架
var frame = page.Frame("frame-login");

// 使用框架的 URL 获取框架
var frame = page.FrameByUrl("*domain.");

// 使用任何其他选择器获取框架
var frameElementHandle = await page.EvaluateAsync("window.frames[1]");
var frame = await frameElementHandle.ContentFrameAsync();

// 与框架交互
await frame.FillAsync("#username-input", "John");
```
