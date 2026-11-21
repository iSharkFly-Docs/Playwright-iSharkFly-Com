---
title: Keyboard
outline: 2
---

# Keyboard

<Badge type="info" text="Added in: v1.8" />

Keyboard provides an api for managing a virtual keyboard. The high level api is [`keyboard.type()`](/api/class-keyboard#keyboard-type), which takes
raw characters and generates proper `keydown`, `keypress`/`input`, and `keyup` events on your page.

For finer control, you can use [`keyboard.down()`](/api/class-keyboard#keyboard-down), [`keyboard.up()`](/api/class-keyboard#keyboard-up), and [`keyboard.insertText()`](/api/class-keyboard#keyboard-insert-text)
to manually fire events as if they were generated from a real keyboard.

::: info
Caps Lock state emulation is not supported. Pressing `CapsLock` dispatches keyboard events, but does not make subsequent
lowercase input uppercase. To type uppercase text, pass uppercase characters to [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially) or
[`keyboard.type()`](/api/class-keyboard#keyboard-type).
:::

An example of holding down `Shift` in order to select and delete some text:

```js
await page.keyboard.type('Hello World!');
await page.keyboard.press('ArrowLeft');

await page.keyboard.down('Shift');
for (let i = 0; i < ' World'.length; i++)
  await page.keyboard.press('ArrowLeft');
await page.keyboard.up('Shift');

await page.keyboard.press('Backspace');
// Result text will end up saying 'Hello!'
```

An example of pressing uppercase `A`

```js
await page.keyboard.press('Shift+KeyA');
// or
await page.keyboard.press('Shift+A');
```

An example to trigger select-all with the keyboard

```js
await page.keyboard.press('ControlOrMeta+A');
```

## Methods

### keyboard.down() {#keyboard-down}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Dispatches a `keydown` event.

[`key`](/api/class-keyboard#keyboard-down-option-key) can specify the intended
[keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value or a single character to
generate the text for. A superset of the [`key`](/api/class-keyboard#keyboard-down-option-key) values can be found
[here](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:

`F1` - `F12`, `Digit0`- `Digit9`, `KeyA`- `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
`Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.

Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`, `ShiftLeft`, `ControlOrMeta`.
`ControlOrMeta` resolves to `Control` on Windows and Linux and to `Meta` on macOS.

Holding down `Shift` will type the text that corresponds to the [`key`](/api/class-keyboard#keyboard-down-option-key) in the upper case.

If [`key`](/api/class-keyboard#keyboard-down-option-key) is a single character, it is case-sensitive, so the values `a` and `A` will generate different
respective texts.

If [`key`](/api/class-keyboard#keyboard-down-option-key) is a modifier key, `Shift`, `Meta`, `Control`, or `Alt`, subsequent key presses will be sent with that
modifier active. To release the modifier key, use [`keyboard.up()`](/api/class-keyboard#keyboard-up).

After the key is pressed once, subsequent calls to [`keyboard.down()`](/api/class-keyboard#keyboard-down) will have
[repeat](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat) set to true. To release the key, use
[`keyboard.up()`](/api/class-keyboard#keyboard-up).

::: info
Modifier keys DO influence `keyboard.down`. Holding down `Shift` will type the text in upper case.
:::

**Arguments**

- <a id="keyboard-down-option-key"></a>`key` `string`

  Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.


### keyboard.insertText() {#keyboard-insert-text}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Dispatches only `input` event, does not emit the `keydown`, `keyup` or `keypress` events.

**Usage**

```js
await page.keyboard.insertText('嗨');
```

::: info
Modifier keys DO NOT effect `keyboard.insertText`. Holding down `Shift` will not type the text in upper case.
:::

**Arguments**

- <a id="keyboard-insert-text-option-text"></a>`text` `string`

  Sets input to the specified text value.


### keyboard.press() {#keyboard-press}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: tip
In most cases, you should use [`locator.press()`](/api/class-locator#locator-press) instead.
:::

[`key`](/api/class-keyboard#keyboard-press-option-key) can specify the intended
[keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value or a single character to
generate the text for. A superset of the [`key`](/api/class-keyboard#keyboard-press-option-key) values can be found
[here](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:

`F1` - `F12`, `Digit0`- `Digit9`, `KeyA`- `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
`Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.

Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`, `ShiftLeft`, `ControlOrMeta`.
`ControlOrMeta` resolves to `Control` on Windows and Linux and to `Meta` on macOS.

Holding down `Shift` will type the text that corresponds to the [`key`](/api/class-keyboard#keyboard-press-option-key) in the upper case.

If [`key`](/api/class-keyboard#keyboard-press-option-key) is a single character, it is case-sensitive, so the values `a` and `A` will generate different
respective texts.

Shortcuts such as `key: "Control+o"`, `key: "Control++` or `key: "Control+Shift+T"` are supported as well. When specified with the
modifier, modifier is pressed and being held while the subsequent key is being pressed.

**Usage**

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

Shortcut for [`keyboard.down()`](/api/class-keyboard#keyboard-down) and [`keyboard.up()`](/api/class-keyboard#keyboard-up).

**Arguments**

- <a id="keyboard-press-option-key"></a>`key` `string`

  Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
- <a id="keyboard-press-option-options"></a>`options` `Object` *(optional)*

  - <a id="keyboard-press-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `keydown` and `keyup` in milliseconds. Defaults to 0.


### keyboard.type() {#keyboard-type}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning
In most cases, you should use [`locator.fill()`](/api/class-locator#locator-fill) instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially).
:::

Sends a `keydown`, `keypress`/`input`, and `keyup` event for each character in the text.

To press a special key, like `Control` or `ArrowDown`, use [`keyboard.press()`](/api/class-keyboard#keyboard-press).

**Usage**

```js
await page.keyboard.type('Hello'); // Types instantly
await page.keyboard.type('World', { delay: 100 }); // Types slower, like a user
```

::: info
Modifier keys DO NOT effect `keyboard.type`. Holding down `Shift` will not type the text in upper case.
:::

::: info
For characters that are not on a US keyboard, only an `input` event will be sent.
:::

**Arguments**

- <a id="keyboard-type-option-text"></a>`text` `string`

  A text to type into a focused element.
- <a id="keyboard-type-option-options"></a>`options` `Object` *(optional)*

  - <a id="keyboard-type-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between key presses in milliseconds. Defaults to 0.


### keyboard.up() {#keyboard-up}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Dispatches a `keyup` event.

**Arguments**

- <a id="keyboard-up-option-key"></a>`key` `string`

  Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.

