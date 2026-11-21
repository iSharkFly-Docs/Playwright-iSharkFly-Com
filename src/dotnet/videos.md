---
title: "Videos"
---

# Videos

## Introduction

With Playwright you can record videos for your tests.

## Record video

Videos are saved upon [browser context](./browser-contexts.md) closure at the end of a test. If you create a browser context manually, make sure to await [`BrowserContext.CloseAsync()`](/dotnet/api/class-browsercontext#browser-context-close).

```csharp
var context = await browser.NewContextAsync(new()
{
    RecordVideoDir = "videos/"
});
// Make sure to close, so that videos are saved.
await context.CloseAsync();
```

You can also specify video size. The video size defaults to the viewport size scaled down to fit 800x800. The video of the viewport is placed in the top-left corner of the output video, scaled down to fit if necessary. You may need to set the viewport size to match your desired video size.

```csharp
var context = await browser.NewContextAsync(new()
{
    RecordVideoDir = "videos/",
    RecordVideoSize = new RecordVideoSize() { Width = 640, Height = 480 }
});
// Make sure to close, so that videos are saved.
await context.CloseAsync();
```

Saved video files will appear in the specified folder. They all have generated unique names.
For the multi-page scenarios, you can access the video file associated with the page via the
[`Page.Video()`](/dotnet/api/class-page#page-video).

```csharp
var path = await page.Video.PathAsync();
```

::: info
Note that the video is only available after the page or browser context is closed.
:::
