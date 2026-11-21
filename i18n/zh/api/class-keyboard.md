---
title: Keyboard
outline: 2
---

# Keyboard

<Badge type="info" text="Added in: v1.8" />

Keyboard 提供了一个用于管理虚拟键盘的 API。高级 API 是 [`keyboard.type()`](/api/class-keyboard#keyboard-type)，它接收原始字符并在页面上生成适当的 `keydown`、`keypress`/`input` 和 `keyup` 事件。

为了更精细的控制，你可以使用 [`keyboard.down()`](/api/class-keyboard#keyboard-down)、[`keyboard.up()`](/api/class-keyboard#keyboard-up) 和 [`keyboard.insertText()`](/api/class-keyboard#keyboard-insert-text) 手动触发事件，就像它们是从真实键盘生成的一样。

::: info
不支持 Caps Lock 状态模拟。按下 `CapsLock` 会触发键盘事件，但不会使后续的小写输入变为大写。要输入大写文本，请将大写字符传递给 [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially) 或 [`keyboard.type()`](/api/class-keyboard#keyboard-type)。
:::

按住 `Shift` 键来选择和删除一些文本的示例：

```js
await page.keyboard.type('Hello World!');
await page.keyboard.press('ArrowLeft');

await page.keyboard.down('Shift');
for (let i = 0; i < ' World'.length; i++)
  await page.keyboard.press('ArrowLeft');
await page.keyboard.up('Shift');

await page.keyboard.press('Backspace');
// 结果文本将是 'Hello!'
```

按下大写 `A` 的示例

```js
await page.keyboard.press('Shift+KeyA');
// 或
await page.keyboard.press('Shift+A');
```

使用键盘触发全选的示例

```js
await page.keyboard.press('ControlOrMeta+A');
```

## 方法

### keyboard.down() {#keyboard-down}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

触发一个 `keydown` 事件。

[`key`](/api/class-keyboard#keyboard-down-option-key) 可以指定预期的 [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) 值或单个字符来生成文本。可以在[这里](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)找到 [`key`](/api/class-keyboard#keyboard-down-option-key) 值的超集。按键示例：

`F1` - `F12`、`Digit0`- `Digit9`、`KeyA`- `KeyZ`、`Backquote`、`Minus`、`Equal`、`Backslash`、`Backspace`、`Tab`、`Delete`、`Escape`、`ArrowDown`、`End`、`Enter`、`Home`、`Insert`、`PageDown`、`PageUp`、`ArrowRight`、`ArrowUp` 等。

还支持以下修饰键快捷方式：`Shift`、`Control`、`Alt`、`Meta`、`ShiftLeft`、`ControlOrMeta`。
`ControlOrMeta` 在 Windows 和 Linux 上解析为 `Control`，在 macOS 上解析为 `Meta`。

按住 `Shift` 将输入与 [`key`](/api/class-keyboard#keyboard-down-option-key) 对应的大写文本。

如果 [`key`](/api/class-keyboard#keyboard-down-option-key) 是单个字符，则区分大小写，因此值 `a` 和 `A` 将生成不同的文本。

如果 [`key`](/api/class-keyboard#keyboard-down-option-key) 是修饰键（`Shift`、`Meta`、`Control` 或 `Alt`），后续的按键将在该修饰键激活的情况下发送。要释放修饰键，请使用 [`keyboard.up()`](/api/class-keyboard#keyboard-up)。

按下一次按键后，后续调用 [`keyboard.down()`](/api/class-keyboard#keyboard-down) 将把 [repeat](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat) 设置为 true。要释放按键，请使用 [`keyboard.up()`](/api/class-keyboard#keyboard-up)。

::: info
修饰键会影响 `keyboard.down`。按住 `Shift` 将输入大写文本。
:::

**参数**

- <a id="keyboard-down-option-key"></a>`key` `string`

  要按下的键的名称或要生成的字符，例如 `ArrowLeft` 或 `a`。


### keyboard.insertText() {#keyboard-insert-text}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

仅触发 `input` 事件，不触发 `keydown`、`keyup` 或 `keypress` 事件。

**用法**

```js
await page.keyboard.insertText('嗨');
```

::: info
修饰键不会影响 `keyboard.insertText`。按住 `Shift` 不会使文本输入为大写。
:::

**参数**

- <a id="keyboard-insert-text-option-text"></a>`text` `string`

  将输入设置为指定的文本值。


### keyboard.press() {#keyboard-press}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: tip
在大多数情况下，你应该使用 [`locator.press()`](/api/class-locator#locator-press) 代替。
:::

[`key`](/api/class-keyboard#keyboard-press-option-key) 可以指定预期的 [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) 值或单个字符来生成文本。可以在[这里](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)找到 [`key`](/api/class-keyboard#keyboard-press-option-key) 值的超集。按键示例：

`F1` - `F12`、`Digit0`- `Digit9`、`KeyA`- `KeyZ`、`Backquote`、`Minus`、`Equal`、`Backslash`、`Backspace`、`Tab`、`Delete`、`Escape`、`ArrowDown`、`End`、`Enter`、`Home`、`Insert`、`PageDown`、`PageUp`、`ArrowRight`、`ArrowUp` 等。

还支持以下修饰键快捷方式：`Shift`、`Control`、`Alt`、`Meta`、`ShiftLeft`、`ControlOrMeta`。
`ControlOrMeta` 在 Windows 和 Linux 上解析为 `Control`，在 macOS 上解析为 `Meta`。

按住 `Shift` 将输入与 [`key`](/api/class-keyboard#keyboard-press-option-key) 对应的大写文本。

如果 [`key`](/api/class-keyboard#keyboard-press-option-key) 是单个字符，则区分大小写，因此值 `a` 和 `A` 将生成不同的文本。

还支持像 `key: "Control+o"`、`key: "Control++` 或 `key: "Control+Shift+T"` 这样的快捷方式。当与修饰键一起指定时，修饰键会被按下并保持，同时按下后续的键。

**用法**

```js
const page = await browser.newPage();
await page.goto('https://keycode.info');
await page.keyboard.press('A');
await page.screenshot({ path: 'A.png' });
await page.keyboard.press('ArrowLeft');
await page.screenshot({ path: 'ArrowLeft.png' });
await page.keyboard.press('Shift+O');
await page.screenshot({ path: 'O.png' });
await browser.close();
```

[`keyboard.down()`](/api/class-keyboard#keyboard-down) 和 [`keyboard.up()`](/api/class-keyboard#keyboard-up) 的快捷方式。

**参数**

- <a id="keyboard-press-option-key"></a>`key` `string`

  要按下的键的名称或要生成的字符，例如 `ArrowLeft` 或 `a`。
- <a id="keyboard-press-option-options"></a>`options` `Object` *(可选)*

  - <a id="keyboard-press-option-delay"></a>`delay` `float` *(可选)*

    `keydown` 和 `keyup` 之间等待的时间（毫秒）。默认为 0。


### keyboard.type() {#keyboard-type}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning
在大多数情况下，你应该使用 [`locator.fill()`](/api/class-locator#locator-fill) 代替。只有当页面上有特殊的键盘处理时，你才需要逐个按键 - 在这种情况下请使用 [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially)。
:::

为文本中的每个字符发送 `keydown`、`keypress`/`input` 和 `keyup` 事件。

要按下特殊键（如 `Control` 或 `ArrowDown`），请使用 [`keyboard.press()`](/api/class-keyboard#keyboard-press)。

**用法**

```js
await page.keyboard.type('Hello'); // 立即输入
await page.keyboard.type('World', { delay: 100 }); // 较慢地输入，像用户一样
```

::: info
修饰键不会影响 `keyboard.type`。按住 `Shift` 不会使文本输入为大写。
:::

::: info
对于不在美式键盘上的字符，只会发送 `input` 事件。
:::

**参数**

- <a id="keyboard-type-option-text"></a>`text` `string`

  要输入到聚焦元素中的文本。
- <a id="keyboard-type-option-options"></a>`options` `Object` *(可选)*

  - <a id="keyboard-type-option-delay"></a>`delay` `float` *(可选)*

    按键之间等待的时间（毫秒）。默认为 0。


### keyboard.up() {#keyboard-up}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

触发一个 `keyup` 事件。

**参数**

- <a id="keyboard-up-option-key"></a>`key` `string`

  要按下的键的名称或要生成的字符，例如 `ArrowLeft` 或 `a`。
