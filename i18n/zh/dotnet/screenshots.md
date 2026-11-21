---
title: "截图"
---

# 截图

## 简介

以下是捕获截图并保存到文件的快速方法：

```csharp
await Page.ScreenshotAsync(new()
{
    Path = "screenshot.png",
});
```

[截图 API](./api/class-page#page-screenshot) 接受许多参数，包括图像格式、裁剪区域、质量等。请务必查看这些参数。

## 全页面截图

全页面截图是完整可滚动页面的截图，就像您有一个非常高的屏幕，页面可以完全放入其中一样。

```csharp
await Page.ScreenshotAsync(new()
{
    Path = "screenshot.png",
    FullPage = true,
});
```

## 捕获到缓冲区

您可以获取包含图像的缓冲区并对其进行后处理，或将其传递给第三方像素差异工具，而不是写入文件。

```csharp
var bytes = await page.ScreenshotAsync();
Console.WriteLine(Convert.ToBase64String(bytes));
```

## 元素截图

有时对单个元素进行截图很有用。

```csharp
await page.Locator(".header").ScreenshotAsync(new() { Path = "screenshot.png" });
```
