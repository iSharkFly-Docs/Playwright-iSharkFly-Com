---
title: "截图"
---

# 截图

## 简介

这是一种快速捕获截图并保存到文件的方法：

::: code-group

```python [Async]
await page.screenshot(path="screenshot.png")
```

```python [Sync]
page.screenshot(path="screenshot.png")
```

:::

[截图 API](./api/class-page#page-screenshot) 接受许多参数，如图像格式、裁剪区域、质量等。请务必查看这些参数。

## 全页截图

全页截图是对整个可滚动页面的截图，就像您有一个非常高的屏幕，页面可以完全适应它一样。

::: code-group

```python [Async]
await page.screenshot(path="screenshot.png", full_page=True)
```

```python [Sync]
page.screenshot(path="screenshot.png", full_page=True)
```

:::

## 捕获到缓冲区

您可以获取包含图像的缓冲区并对其进行后处理或传递给第三方像素差异工具，而不是写入文件。

::: code-group

```python [Async]
# 捕获到图像
screenshot_bytes = await page.screenshot()
print(base64.b64encode(screenshot_bytes).decode())
```

```python [Sync]
screenshot_bytes = page.screenshot()
print(base64.b64encode(screenshot_bytes).decode())
```

:::

## 元素截图

有时对单个元素进行截图很有用。

::: code-group

```python [Async]
await page.locator(".header").screenshot(path="screenshot.png")
```

```python [Sync]
page.locator(".header").screenshot(path="screenshot.png")
```

:::
