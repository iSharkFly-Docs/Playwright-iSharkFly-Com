---
title: "框架"
---

# 框架

## 简介

一个 [Page](/api/class-page) 可以附加一个或多个 [Frame](/api/class-frame) 对象。每个页面都有一个主框架，页面级别的交互操作（如 `click`）默认在主框架中执行。

页面可以通过 `iframe` HTML 标签附加额外的框架。这些框架可以被访问以进行框架内部的交互操作。

```js
// 在框架内定位元素
const username = await page.frameLocator('.frame-class').getByLabel('User Name');
await username.fill('John');
```

## Frame 对象

可以使用 [`page.frame()`](/api/class-page#page-frame) API 来访问 frame 对象：

```js
// 使用框架的 name 属性获取框架
const frame = page.frame('frame-login');

// 使用框架的 URL 获取框架
const frame = page.frame({ url: /.*domain.*/ });

// 与框架交互
await frame.fill('#username-input', 'John');
```
