---
title: "Frames"
---

# Frames

## Introduction

A [Page](/python/api/class-page) can have one or more [Frame](/python/api/class-frame) objects attached to it. Each page has a main frame and page-level interactions
(like `click`) are assumed to operate in the main frame.

A page can have additional frames attached with the `iframe` HTML tag. These frames can be accessed for interactions
inside the frame.

::: code-group

```python [Async]
# Locate element inside frame
username = await page.frame_locator('.frame-class').get_by_label('User Name')
await username.fill('John')
```

```python [Sync]
# Locate element inside frame
# Get frame using any other selector
username = page.frame_locator('.frame-class').get_by_label('User Name')
username.fill('John')
```

:::

## Frame objects

One can access frame objects using the [`page.frame()`](/python/api/class-page#page-frame) API:

::: code-group

```python [Async]
# Get frame using the frame's name attribute
frame = page.frame('frame-login')

# Get frame using frame's URL
frame = page.frame(url=r'.*domain.*')

# Interact with the frame
await frame.fill('#username-input', 'John')
```

```python [Sync]
# Get frame using the frame's name attribute
frame = page.frame('frame-login')

# Get frame using frame's URL
frame = page.frame(url=r'.*domain.*')

# Interact with the frame
frame.fill('#username-input', 'John')
```

:::
