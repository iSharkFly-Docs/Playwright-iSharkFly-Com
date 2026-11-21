---
title: "框架"
---

# 框架

## 简介

[Page](/java/api/class-page) 可以附加一个或多个 [Frame](/java/api/class-frame) 对象。每个页面都有一个主框架，页面级别的交互（如 `click`）被假定在主框架中操作。

页面可以通过 `iframe` HTML 标签附加额外的框架。可以访问这些框架以在框架内进行交互。

```java
// 在框架内定位元素
Locator username = page.frameLocator(".frame-class").getByLabel("User Name");
username.fill("John");
```

## 框架对象

可以使用 [`page.frame()`](/java/api/class-page#page-frame) API 访问框架对象：

```java
// 使用框架的 name 属性获取框架
Frame frame = page.frame("frame-login");

// 使用框架的 URL 获取框架
Frame frame = page.frameByUrl(Pattern.compile(".*domain.*"));

// 与框架交互
frame.fill("#username-input", "John");
```
