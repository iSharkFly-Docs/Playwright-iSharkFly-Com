---
title: "Videos"
---

# Videos

## Introduction

With Playwright you can record videos for your tests.

## Record video

Videos are saved upon [browser context](./browser-contexts.md) closure at the end of a test. If you create a browser context manually, make sure to await [`browserContext.close()`](/java/api/class-browsercontext#browser-context-close).

```java
context = browser.newContext(new Browser.NewContextOptions().setRecordVideoDir(Paths.get("videos/")));
// Make sure to close, so that videos are saved.
context.close();
```

You can also specify video size. The video size defaults to the viewport size scaled down to fit 800x800. The video of the viewport is placed in the top-left corner of the output video, scaled down to fit if necessary. You may need to set the viewport size to match your desired video size.

```java
BrowserContext context = browser.newContext(new Browser.NewContextOptions()
  .setRecordVideoDir(Paths.get("videos/"))
  .setRecordVideoSize(640, 480));
```

Saved video files will appear in the specified folder. They all have generated unique names.
For the multi-page scenarios, you can access the video file associated with the page via the
[`page.video()`](/java/api/class-page#page-video).

```java
path = page.video().path();
```

::: info
Note that the video is only available after the page or browser context is closed.
:::
