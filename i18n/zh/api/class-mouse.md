---
title: Mouse
outline: 2
---

# Mouse

<Badge type="info" text="Added in: v1.8" />

Mouse 类操作在相对于视口左上角的主框架 CSS 像素中。

::: tip
如果你想调试鼠标移动的位置，可以使用 [Trace viewer](../trace-viewer-intro.md) 或 [Playwright Inspector](../running-tests.md)。每个鼠标操作都会显示一个红点表示鼠标的位置。
:::

每个 `page` 对象都有自己的 Mouse，可通过 [`page.mouse`](/api/class-page#page-mouse) 访问。

```js
// 使用 'page.mouse' 绘制一个 100x100 的正方形。
await page.mouse.move(0, 0);
await page.mouse.down();
await page.mouse.move(0, 100);
await page.mouse.move(100, 100);
await page.mouse.move(100, 0);
await page.mouse.move(0, 0);
await page.mouse.up();
```

## 方法

### mouse.click() {#mouse-click}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

[`mouse.move()`](/api/class-mouse#mouse-move)、[`mouse.down()`](/api/class-mouse#mouse-down)、[`mouse.up()`](/api/class-mouse#mouse-up) 的快捷方式。

**参数**

- <a id="mouse-click-option-x"></a>`x` `float`

  相对于主框架视口的 X 坐标（CSS 像素）。
- <a id="mouse-click-option-y"></a>`y` `float`

  相对于主框架视口的 Y 坐标（CSS 像素）。
- <a id="mouse-click-option-options"></a>`options` `Object` *(可选)*

  - <a id="mouse-click-option-button"></a>`button` `"left" | "right" | "middle"` *(可选)*

    默认为 `left`。
  - <a id="mouse-click-option-click-count"></a>`clickCount` `int` *(可选)*

    默认为 1。参见 [UIEvent.detail]。
  - <a id="mouse-click-option-delay"></a>`delay` `float` *(可选)*

    `mousedown` 和 `mouseup` 之间等待的时间（毫秒）。默认为 0。


### mouse.dblclick() {#mouse-dblclick}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

[`mouse.move()`](/api/class-mouse#mouse-move)、[`mouse.down()`](/api/class-mouse#mouse-down)、[`mouse.up()`](/api/class-mouse#mouse-up)、[`mouse.down()`](/api/class-mouse#mouse-down) 和 [`mouse.up()`](/api/class-mouse#mouse-up) 的快捷方式。

**参数**

- <a id="mouse-dblclick-option-x"></a>`x` `float`

  相对于主框架视口的 X 坐标（CSS 像素）。
- <a id="mouse-dblclick-option-y"></a>`y` `float`

  相对于主框架视口的 Y 坐标（CSS 像素）。
- <a id="mouse-dblclick-option-options"></a>`options` `Object` *(可选)*

  - <a id="mouse-dblclick-option-button"></a>`button` `"left" | "right" | "middle"` *(可选)*

    默认为 `left`。
  - <a id="mouse-dblclick-option-delay"></a>`delay` `float` *(可选)*

    `mousedown` 和 `mouseup` 之间等待的时间（毫秒）。默认为 0。


### mouse.down() {#mouse-down}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

触发一个 `mousedown` 事件。

**参数**

- <a id="mouse-down-option-options"></a>`options` `Object` *(可选)*

  - <a id="mouse-down-option-button"></a>`button` `"left" | "right" | "middle"` *(可选)*

    默认为 `left`。
  - <a id="mouse-down-option-click-count"></a>`clickCount` `int` *(可选)*

    默认为 1。参见 [UIEvent.detail]。


### mouse.move() {#mouse-move}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

触发一个 `mousemove` 事件。

**参数**

- <a id="mouse-move-option-x"></a>`x` `float`

  相对于主框架视口的 X 坐标（CSS 像素）。
- <a id="mouse-move-option-y"></a>`y` `float`

  相对于主框架视口的 Y 坐标（CSS 像素）。
- <a id="mouse-move-option-options"></a>`options` `Object` *(可选)*

  - <a id="mouse-move-option-steps"></a>`steps` `int` *(可选)*

    默认为 1。发送 `n` 个插值的 `mousemove` 事件来表示从 Playwright 当前光标位置到提供的目标位置之间的移动。当设置为 1 时，在目标位置发送单个 `mousemove` 事件。


### mouse.up() {#mouse-up}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

触发一个 `mouseup` 事件。

**参数**

- <a id="mouse-up-option-options"></a>`options` `Object` *(可选)*

  - <a id="mouse-up-option-button"></a>`button` `"left" | "right" | "middle"` *(可选)*

    默认为 `left`。
  - <a id="mouse-up-option-click-count"></a>`clickCount` `int` *(可选)*

    默认为 1。参见 [UIEvent.detail]。


### mouse.wheel() {#mouse-wheel}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

触发一个 `wheel` 事件。此方法通常用于手动滚动页面。有关滚动的其他方式，请参阅 [滚动](../input.md#scrolling)。

::: info
滚轮事件如果未被处理可能会导致滚动，此方法不会等待滚动完成后才返回。
:::

**参数**

- <a id="mouse-wheel-option-delta-x"></a>`deltaX` `float`

  水平滚动的像素数。
- <a id="mouse-wheel-option-delta-y"></a>`deltaY` `float`

  垂直滚动的像素数。
