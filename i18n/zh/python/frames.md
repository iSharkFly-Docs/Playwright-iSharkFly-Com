---
title: "框架"
---

# 框架

## 简介

一个 [Page](/python/api/class-page) 可以附加一个或多个 [Frame](/python/api/class-frame) 对象。每个页面都有一个主框架，页面级别的交互（如 `click`）被假定在主框架中操作。

页面可以通过 `iframe` HTML 标签附加额外的框架。这些框架可以被访问以在框架内部进行交互。

::: code-group

```python [Async]
# 在框架内定位元素
username = await page.frame_locator('.frame-class').get_by_label('User Name')
await username.fill('John')
```

```python [Sync]
# 在框架内定位元素
# 使用任何其他选择器获取框架
username = page.frame_locator('.frame-class').get_by_label('User Name')
username.fill('John')
```

:::

## 框架对象

可以使用 [`page.frame()`](/python/api/class-page#page-frame) API 访问框架对象：

::: code-group

```python [Async]
# 使用框架的 name 属性获取框架
frame = page.frame('frame-login')

# 使用框架的 URL 获取框架
frame = page.frame(url=r'.*domain.*')

# 与框架交互
await frame.fill('#username-input', 'John')
```

```python [Sync]
# 使用框架的 name 属性获取框架
frame = page.frame('frame-login')

# 使用框架的 URL 获取框架
frame = page.frame(url=r'.*domain.*')

# 与框架交互
frame.fill('#username-input', 'John')
```

:::
