---
title: Touchscreen
outline: 2
---

# Touchscreen

<Badge type="info" text="Added in: v1.8" />

The Touchscreen class operates in main-frame CSS pixels relative to the top-left corner of the viewport. Methods on the
touchscreen can only be used in browser contexts that have been initialized with `hasTouch` set to true.

This class is limited to emulating tap gestures. For examples of other gestures simulated by manually dispatching touch events, see the [emulating legacy touch events](../touch-events.md) page.

## Methods

### touchscreen.tap() {#touchscreen-tap}

<Badge type="info" text="Added in: v1.8" />

Dispatches a `touchstart` and `touchend` event with a single touch at the position ([`x`](/python/api/class-touchscreen#touchscreen-tap-option-x),[`y`](/python/api/class-touchscreen#touchscreen-tap-option-y)).

::: info
[`touchscreen.tap()`](/python/api/class-touchscreen#touchscreen-tap) will throw if the [`has_touch`](/python/api/class-browser#browser-new-context-option-has-touch) option of the browser context is false.
:::

**Arguments**

- <a id="touchscreen-tap-option-x"></a>`x` `float`

  X coordinate relative to the main frame's viewport in CSS pixels.
- <a id="touchscreen-tap-option-y"></a>`y` `float`

  Y coordinate relative to the main frame's viewport in CSS pixels.

