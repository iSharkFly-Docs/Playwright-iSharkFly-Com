---
title: "视频"
---

# 视频

## 简介

使用 Playwright，您可以为测试录制视频。

## 录制视频

视频在测试结束时[浏览器上下文](./browser-contexts.md)关闭时保存。如果您手动创建浏览器上下文，请确保等待 [`browser_context.close()`](/python/api/class-browsercontext#browser-context-close)。

::: code-group

```python [Async]
context = await browser.new_context(record_video_dir="videos/")
# 确保等待关闭，以便保存视频。
await context.close()
```

```python [Sync]
context = browser.new_context(record_video_dir="videos/")
# 确保关闭，以便保存视频。
context.close()
```

:::

您还可以指定视频大小。视频大小默认为缩小以适应 800x800 的视口大小。视口的视频放置在输出视频的左上角，必要时缩小以适应。您可能需要设置视口大小以匹配所需的视频大小。

::: code-group

```python [Async]
context = await browser.new_context(
    record_video_dir="videos/",
    record_video_size={"width": 640, "height": 480}
)
```

```python [Sync]
context = browser.new_context(
    record_video_dir="videos/",
    record_video_size={"width": 640, "height": 480}
)
```

:::

保存的视频文件将出现在指定的文件夹中。它们都有生成的唯一名称。
对于多页场景，您可以通过 [`page.video()`](/python/api/class-page#page-video) 访问与页面关联的视频文件。

::: code-group

```python [Async]
path = await page.video.path()
```

```python [Sync]
path = page.video.path()
```

:::

::: info
请注意，视频仅在页面或浏览器上下文关闭后才可用。
:::
