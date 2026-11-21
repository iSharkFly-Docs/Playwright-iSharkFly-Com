---
title: "截图"
---

# 截图

## 简介

以下是捕获截图并保存到文件的快捷方法：

```js
await page.screenshot({ path: 'screenshot.png' });
```

[截图 API](./api/class-page#page-screenshot) 接受许多参数，包括图片格式、裁剪区域、质量等。请务必查看这些参数。

## 全页截图

全页截图是对整个可滚动页面的截图，就像您有一个非常高的屏幕，页面可以完全容纳其中一样。

```js
await page.screenshot({ path: 'screenshot.png', fullPage: true });
```

## 捕获到缓冲区

您可以获取包含图片的缓冲区并对其进行后处理，或将其传递给第三方像素差异工具，而不是写入文件。

```js
const buffer = await page.screenshot();
console.log(buffer.toString('base64'));
```

## 元素截图

有时对单个元素进行截图是很有用的。

```js
await page.locator('.header').screenshot({ path: 'screenshot.png' });
```
