---
title: "视频"
---

# 视频

## 简介

使用 Playwright，您可以为测试录制视频。

## 录制视频

视频在测试结束时[浏览器上下文](./browser-contexts.md)关闭时保存。如果您手动创建浏览器上下文，请确保等待 [`BrowserContext.CloseAsync()`](/dotnet/api/class-browsercontext#browser-context-close)。

```csharp
var context = await browser.NewContextAsync(new()
{
    RecordVideoDir = "videos/"
});
// 确保关闭，以便保存视频。
await context.CloseAsync();
```

您还可以指定视频大小。视频大小默认为缩放以适应 800x800 的视口大小。视口的视频放置在输出视频的左上角，必要时会缩小以适应。您可能需要设置视口大小以匹配所需的视频大小。

```csharp
var context = await browser.NewContextAsync(new()
{
    RecordVideoDir = "videos/",
    RecordVideoSize = new RecordVideoSize() { Width = 640, Height = 480 }
});
// 确保关闭，以便保存视频。
await context.CloseAsync();
```

保存的视频文件将出现在指定的文件夹中。它们都有生成的唯一名称。
对于多页面场景，您可以通过 [`Page.Video()`](/dotnet/api/class-page#page-video) 访问与页面关联的视频文件。

```csharp
var path = await page.Video.PathAsync();
```

::: info
请注意，视频只有在页面或浏览器上下文关闭后才可用。
:::
