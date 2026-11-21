---
title: Touchscreen
outline: 2
---

# Touchscreen

<Badge type="info" text="Added in: v1.8" />

Touchscreen 类操作在相对于视口左上角的主框架 CSS 像素中。触摸屏上的方法只能在已将 `hasTouch` 设置为 true 进行初始化的浏览器上下文中使用。

此类仅限于模拟点击手势。有关通过手动触发触摸事件模拟其他手势的示例，请参阅 [模拟旧式触摸事件](../touch-events.md) 页面。

## 方法

### touchscreen.tap() {#touchscreen-tap}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

在位置（[`x`](/api/class-touchscreen#touchscreen-tap-option-x),[`y`](/api/class-touchscreen#touchscreen-tap-option-y)）触发一个带有单点触摸的 `touchstart` 和 `touchend` 事件。

::: info
如果浏览器上下文的 [`hasTouch`](/api/class-browser#browser-new-context-option-has-touch) 选项为 false，[`touchscreen.tap()`](/api/class-touchscreen#touchscreen-tap) 将抛出异常。
:::

**参数**

- <a id="touchscreen-tap-option-x"></a>`x` `float`

  相对于主框架视口的 X 坐标（CSS 像素）。
- <a id="touchscreen-tap-option-y"></a>`y` `float`

  相对于主框架视口的 Y 坐标（CSS 像素）。
