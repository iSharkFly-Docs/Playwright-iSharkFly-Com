---
title: "Videos"
---

# Videos

## Introduction

With Playwright you can record videos for your tests.

## Record video

Videos are saved upon [browser context](./browser-contexts.md) closure at the end of a test. If you create a browser context manually, make sure to await [`browser_context.close()`](/python/api/class-browsercontext#browser-context-close).

::: code-group

```python [Async]
context = await browser.new_context(record_video_dir="videos/")
# Make sure to await close, so that videos are saved.
await context.close()
```

```python [Sync]
context = browser.new_context(record_video_dir="videos/")
# Make sure to close, so that videos are saved.
context.close()
```

:::

You can also specify video size. The video size defaults to the viewport size scaled down to fit 800x800. The video of the viewport is placed in the top-left corner of the output video, scaled down to fit if necessary. You may need to set the viewport size to match your desired video size.

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

Saved video files will appear in the specified folder. They all have generated unique names.
For the multi-page scenarios, you can access the video file associated with the page via the
[`page.video()`](/python/api/class-page#page-video).

::: code-group

```python [Async]
path = await page.video.path()
```

```python [Sync]
path = page.video.path()
```

:::

::: info
Note that the video is only available after the page or browser context is closed.
:::
