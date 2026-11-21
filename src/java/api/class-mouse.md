---
title: Mouse
outline: 2
---

# Mouse

<Badge type="info" text="Added in: v1.8" />

The Mouse class operates in main-frame CSS pixels relative to the top-left corner of the viewport.

::: tip
If you want to debug where the mouse moved, you can use the [Trace viewer](../trace-viewer-intro.md) or [Playwright Inspector](../running-tests.md). A red dot showing the location of the mouse will be shown for every mouse action.
:::

Every `page` object has its own Mouse, accessible with [`page.mouse()`](/java/api/class-page#page-mouse).

```java
// Using ‘page.mouse’ to trace a 100x100 square.
page.mouse().move(0, 0);
page.mouse().down();
page.mouse().move(0, 100);
page.mouse().move(100, 100);
page.mouse().move(100, 0);
page.mouse().move(0, 0);
page.mouse().up();
```

## Methods

### mouse.click() {#mouse-click}

<Badge type="info" text="Added in: v1.8" />

Shortcut for [`mouse.move()`](/java/api/class-mouse#mouse-move), [`mouse.down()`](/java/api/class-mouse#mouse-down), [`mouse.up()`](/java/api/class-mouse#mouse-up).

**Arguments**

- <a id="mouse-click-option-x"></a>`x` `float`

  X coordinate relative to the main frame's viewport in CSS pixels.
- <a id="mouse-click-option-y"></a>`y` `float`

  Y coordinate relative to the main frame's viewport in CSS pixels.
- <a id="mouse-click-option-options"></a>`options` `Object` *(optional)*

  - <a id="mouse-click-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="mouse-click-option-click-count"></a>`clickCount` `int` *(optional)*

    defaults to 1. See [UIEvent.detail].
  - <a id="mouse-click-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.


### mouse.dblclick() {#mouse-dblclick}

<Badge type="info" text="Added in: v1.8" />

Shortcut for [`mouse.move()`](/java/api/class-mouse#mouse-move), [`mouse.down()`](/java/api/class-mouse#mouse-down), [`mouse.up()`](/java/api/class-mouse#mouse-up), [`mouse.down()`](/java/api/class-mouse#mouse-down) and
[`mouse.up()`](/java/api/class-mouse#mouse-up).

**Arguments**

- <a id="mouse-dblclick-option-x"></a>`x` `float`

  X coordinate relative to the main frame's viewport in CSS pixels.
- <a id="mouse-dblclick-option-y"></a>`y` `float`

  Y coordinate relative to the main frame's viewport in CSS pixels.
- <a id="mouse-dblclick-option-options"></a>`options` `Object` *(optional)*

  - <a id="mouse-dblclick-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="mouse-dblclick-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.


### mouse.down() {#mouse-down}

<Badge type="info" text="Added in: v1.8" />

Dispatches a `mousedown` event.

**Arguments**

- <a id="mouse-down-option-options"></a>`options` `Object` *(optional)*

  - <a id="mouse-down-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="mouse-down-option-click-count"></a>`clickCount` `int` *(optional)*

    defaults to 1. See [UIEvent.detail].


### mouse.move() {#mouse-move}

<Badge type="info" text="Added in: v1.8" />

Dispatches a `mousemove` event.

**Arguments**

- <a id="mouse-move-option-x"></a>`x` `float`

  X coordinate relative to the main frame's viewport in CSS pixels.
- <a id="mouse-move-option-y"></a>`y` `float`

  Y coordinate relative to the main frame's viewport in CSS pixels.
- <a id="mouse-move-option-options"></a>`options` `Object` *(optional)*

  - <a id="mouse-move-option-steps"></a>`steps` `int` *(optional)*

    Defaults to 1. Sends `n` interpolated `mousemove` events to represent travel between Playwright's current cursor position and the provided destination. When set to 1, emits a single `mousemove` event at the destination location.


### mouse.up() {#mouse-up}

<Badge type="info" text="Added in: v1.8" />

Dispatches a `mouseup` event.

**Arguments**

- <a id="mouse-up-option-options"></a>`options` `Object` *(optional)*

  - <a id="mouse-up-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="mouse-up-option-click-count"></a>`clickCount` `int` *(optional)*

    defaults to 1. See [UIEvent.detail].


### mouse.wheel() {#mouse-wheel}

<Badge type="info" text="Added in: v1.15" />

Dispatches a `wheel` event. This method is usually used to manually scroll the page. See [scrolling](../input.md#scrolling) for alternative ways to scroll.

::: info
Wheel events may cause scrolling if they are not handled, and this method does not
wait for the scrolling to finish before returning.
:::

**Arguments**

- <a id="mouse-wheel-option-delta-x"></a>`deltaX` `float`

  Pixels to scroll horizontally.
- <a id="mouse-wheel-option-delta-y"></a>`deltaY` `float`

  Pixels to scroll vertically.

