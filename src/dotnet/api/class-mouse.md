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

Every `page` object has its own Mouse, accessible with [`Page.Mouse`](/dotnet/api/class-page#page-mouse).

```csharp
await Page.Mouse.MoveAsync(0, 0);
await Page.Mouse.DownAsync();
await Page.Mouse.MoveAsync(0, 100);
await Page.Mouse.MoveAsync(100, 100);
await Page.Mouse.MoveAsync(100, 0);
await Page.Mouse.MoveAsync(0, 0);
await Page.Mouse.UpAsync();
```

## Methods

### Mouse.ClickAsync() {#mouse-click}

<Badge type="info" text="Added in: v1.8" />

Shortcut for [`Mouse.MoveAsync()`](/dotnet/api/class-mouse#mouse-move), [`Mouse.DownAsync()`](/dotnet/api/class-mouse#mouse-down), [`Mouse.UpAsync()`](/dotnet/api/class-mouse#mouse-up).

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


### Mouse.DblClickAsyncAsync() {#mouse-dblclick}

<Badge type="info" text="Added in: v1.8" />

Shortcut for [`Mouse.MoveAsync()`](/dotnet/api/class-mouse#mouse-move), [`Mouse.DownAsync()`](/dotnet/api/class-mouse#mouse-down), [`Mouse.UpAsync()`](/dotnet/api/class-mouse#mouse-up), [`Mouse.DownAsync()`](/dotnet/api/class-mouse#mouse-down) and
[`Mouse.UpAsync()`](/dotnet/api/class-mouse#mouse-up).

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


### Mouse.DownAsync() {#mouse-down}

<Badge type="info" text="Added in: v1.8" />

Dispatches a `mousedown` event.

**Arguments**

- <a id="mouse-down-option-options"></a>`options` `Object` *(optional)*

  - <a id="mouse-down-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="mouse-down-option-click-count"></a>`clickCount` `int` *(optional)*

    defaults to 1. See [UIEvent.detail].


### Mouse.MoveAsync() {#mouse-move}

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


### Mouse.UpAsync() {#mouse-up}

<Badge type="info" text="Added in: v1.8" />

Dispatches a `mouseup` event.

**Arguments**

- <a id="mouse-up-option-options"></a>`options` `Object` *(optional)*

  - <a id="mouse-up-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="mouse-up-option-click-count"></a>`clickCount` `int` *(optional)*

    defaults to 1. See [UIEvent.detail].


### Mouse.WheelAsync() {#mouse-wheel}

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

