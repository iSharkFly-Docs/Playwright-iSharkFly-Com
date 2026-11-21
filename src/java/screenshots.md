---
title: "Screenshots"
---

# Screenshots

## Introduction

Here is a quick way to capture a screenshot and save it into a file:

```java
page.screenshot(new Page.ScreenshotOptions()
      .setPath(Paths.get("screenshot.png")));
```

[Screenshots API](./api/class-page#page-screenshot) accepts many parameters for image format, clip area, quality, etc. Make sure to check them out.

## Full page screenshots

Full page screenshot is a screenshot of a full scrollable page, as if you had a very
tall screen and the page could fit it entirely.

```java
page.screenshot(new Page.ScreenshotOptions()
  .setPath(Paths.get("screenshot.png"))
  .setFullPage(true));
```

## Capture into buffer

Rather than writing into a file, you can get a buffer with the image and post-process it or pass it to a third party pixel diff facility.

```java
byte[] buffer = page.screenshot();
System.out.println(Base64.getEncoder().encodeToString(buffer));
```

## Element screenshot

Sometimes it is useful to take a screenshot of a single element.

```java
page.locator(".header").screenshot(new Locator.ScreenshotOptions().setPath(Paths.get("screenshot.png")));
```
