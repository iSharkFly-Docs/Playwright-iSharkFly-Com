---
title: AndroidInput
outline: 2
---

# AndroidInput

<Badge type="info" text="添加于: v1.9" />

## 方法

### androidInput.drag() {#android-input-drag}

<Badge type="info" text="添加于: v1.9" /> <Badge type="tip" text="异步" />

在 [`from`](/api/class-androidinput#android-input-drag-option-from) 和 [`to`](/api/class-androidinput#android-input-drag-option-to) 两点之间执行拖拽操作。

**参数**

- <a id="android-input-drag-option-from"></a>`from` `Object`

  拖拽的起始点。

  - `x` `float`
  - `y` `float`
- <a id="android-input-drag-option-to"></a>`to` `Object`

  拖拽的终点。

  - `x` `float`
  - `y` `float`
- <a id="android-input-drag-option-steps"></a>`steps` `int`

  拖拽的步数。每一步需要 5 毫秒完成。


### androidInput.press() {#android-input-press}

<Badge type="info" text="添加于: v1.9" /> <Badge type="tip" text="异步" />

按下 [`key`](/api/class-androidinput#android-input-press-option-key) 键。

**参数**

- <a id="android-input-press-option-key"></a>`key` `AndroidKey`

  要按下的键。


### androidInput.swipe() {#android-input-swipe}

<Badge type="info" text="添加于: v1.9" /> <Badge type="tip" text="异步" />

沿着 [`segments`](/api/class-androidinput#android-input-swipe-option-segments) 定义的路径进行滑动。

**参数**

- <a id="android-input-swipe-option-from"></a>`from` `Object`

  滑动的起始点。

  - `x` `float`
  - `y` `float`
- <a id="android-input-swipe-option-segments"></a>`segments` `Array<Object>`

  滑动手势中跟随 [`from`](/api/class-androidinput#android-input-swipe-option-from) 点之后的各个点。

  - `x` `float`
  - `y` `float`
- <a id="android-input-swipe-option-steps"></a>`steps` `int`

  每个段的步数。每一步需要 5 毫秒完成，所以 100 步意味着每段需要半秒钟。


### androidInput.tap() {#android-input-tap}

<Badge type="info" text="添加于: v1.9" /> <Badge type="tip" text="异步" />

在指定的 [`point`](/api/class-androidinput#android-input-tap-option-point) 位置点击。

**参数**

- <a id="android-input-tap-option-point"></a>`point` `Object`

  点击的位置。

  - `x` `float`
  - `y` `float`


### androidInput.type() {#android-input-type}

<Badge type="info" text="添加于: v1.9" /> <Badge type="tip" text="异步" />

在当前聚焦的组件中输入 [`text`](/api/class-androidinput#android-input-type-option-text)。

**参数**

- <a id="android-input-type-option-text"></a>`text` `string`

  要输入的文本。
