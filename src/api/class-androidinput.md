---
title: AndroidInput
outline: 2
---

# AndroidInput

<Badge type="info" text="Added in: v1.9" />

## Methods

### androidInput.drag() {#android-input-drag}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Performs a drag between [`from`](/api/class-androidinput#android-input-drag-option-from) and [`to`](/api/class-androidinput#android-input-drag-option-to) points.

**Arguments**

- <a id="android-input-drag-option-from"></a>`from` `Object`

  The start point of the drag.

  - `x` `float`
  - `y` `float`
- <a id="android-input-drag-option-to"></a>`to` `Object`

  The end point of the drag.

  - `x` `float`
  - `y` `float`
- <a id="android-input-drag-option-steps"></a>`steps` `int`

  The number of steps in the drag. Each step takes 5 milliseconds to complete.


### androidInput.press() {#android-input-press}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Presses the [`key`](/api/class-androidinput#android-input-press-option-key).

**Arguments**

- <a id="android-input-press-option-key"></a>`key` `AndroidKey`

  Key to press.


### androidInput.swipe() {#android-input-swipe}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Swipes following the path defined by [`segments`](/api/class-androidinput#android-input-swipe-option-segments).

**Arguments**

- <a id="android-input-swipe-option-from"></a>`from` `Object`

  The point to start swiping from.

  - `x` `float`
  - `y` `float`
- <a id="android-input-swipe-option-segments"></a>`segments` `Array<Object>`

  Points following the [`from`](/api/class-androidinput#android-input-swipe-option-from) point in the swipe gesture.

  - `x` `float`
  - `y` `float`
- <a id="android-input-swipe-option-steps"></a>`steps` `int`

  The number of steps for each segment. Each step takes 5 milliseconds to complete, so 100 steps means half a second per each segment.


### androidInput.tap() {#android-input-tap}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Taps at the specified [`point`](/api/class-androidinput#android-input-tap-option-point).

**Arguments**

- <a id="android-input-tap-option-point"></a>`point` `Object`

  The point to tap at.

  - `x` `float`
  - `y` `float`


### androidInput.type() {#android-input-type}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Types [`text`](/api/class-androidinput#android-input-type-option-text) into currently focused widget.

**Arguments**

- <a id="android-input-type-option-text"></a>`text` `string`

  Text to type.

