---
title: Keyboard
outline: 2
---

# Keyboard

<Badge type="info" text="Added in: v1.8" />

Keyboard provides an api for managing a virtual keyboard. The high level api is [`keyboard.type()`](/python/api/class-keyboard#keyboard-type), which takes
raw characters and generates proper `keydown`, `keypress`/`input`, and `keyup` events on your page.

For finer control, you can use [`keyboard.down()`](/python/api/class-keyboard#keyboard-down), [`keyboard.up()`](/python/api/class-keyboard#keyboard-up), and [`keyboard.insert_text()`](/python/api/class-keyboard#keyboard-insert-text)
to manually fire events as if they were generated from a real keyboard.

::: info
Caps Lock state emulation is not supported. Pressing `CapsLock` dispatches keyboard events, but does not make subsequent
lowercase input uppercase. To type uppercase text, pass uppercase characters to [`locator.press_sequentially()`](/python/api/class-locator#locator-press-sequentially) or
[`keyboard.type()`](/python/api/class-keyboard#keyboard-type).
:::

An example of holding down `Shift` in order to select and delete some text:

::: code-group

```python [Async]
await page.keyboard.type("Hello World!")
await page.keyboard.press("ArrowLeft")
await page.keyboard.down("Shift")
for i in range(6):
    await page.keyboard.press("ArrowLeft")
await page.keyboard.up("Shift")
await page.keyboard.press("Backspace")
# result text will end up saying "Hello!"
```

```python [Sync]
page.keyboard.type("Hello World!")
page.keyboard.press("ArrowLeft")
page.keyboard.down("Shift")
for i in range(6):
    page.keyboard.press("ArrowLeft")
page.keyboard.up("Shift")
page.keyboard.press("Backspace")
# result text will end up saying "Hello!"
```

:::

An example of pressing uppercase `A`

::: code-group

```python [Async]
await page.keyboard.press("Shift+KeyA")
# or
await page.keyboard.press("Shift+A")
```

```python [Sync]
page.keyboard.press("Shift+KeyA")
# or
page.keyboard.press("Shift+A")
```

:::

An example to trigger select-all with the keyboard

::: code-group

```python [Async]
await page.keyboard.press("ControlOrMeta+A")
```

```python [Sync]
page.keyboard.press("ControlOrMeta+A")
```

:::

## Methods

### keyboard.down() {#keyboard-down}

<Badge type="info" text="Added in: v1.8" />

Dispatches a `keydown` event.

[`key`](/python/api/class-keyboard#keyboard-down-option-key) can specify the intended
[keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value or a single character to
generate the text for. A superset of the [`key`](/python/api/class-keyboard#keyboard-down-option-key) values can be found
[here](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:

`F1` - `F12`, `Digit0`- `Digit9`, `KeyA`- `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
`Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.

Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`, `ShiftLeft`, `ControlOrMeta`.
`ControlOrMeta` resolves to `Control` on Windows and Linux and to `Meta` on macOS.

Holding down `Shift` will type the text that corresponds to the [`key`](/python/api/class-keyboard#keyboard-down-option-key) in the upper case.

If [`key`](/python/api/class-keyboard#keyboard-down-option-key) is a single character, it is case-sensitive, so the values `a` and `A` will generate different
respective texts.

If [`key`](/python/api/class-keyboard#keyboard-down-option-key) is a modifier key, `Shift`, `Meta`, `Control`, or `Alt`, subsequent key presses will be sent with that
modifier active. To release the modifier key, use [`keyboard.up()`](/python/api/class-keyboard#keyboard-up).

After the key is pressed once, subsequent calls to [`keyboard.down()`](/python/api/class-keyboard#keyboard-down) will have
[repeat](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat) set to true. To release the key, use
[`keyboard.up()`](/python/api/class-keyboard#keyboard-up).

::: info
Modifier keys DO influence `keyboard.down`. Holding down `Shift` will type the text in upper case.
:::

**Arguments**

- <a id="keyboard-down-option-key"></a>`key` `string`

  Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.


### keyboard.insert_text() {#keyboard-insert-text}

<Badge type="info" text="Added in: v1.8" />

Dispatches only `input` event, does not emit the `keydown`, `keyup` or `keypress` events.

**Usage**

::: code-group

```python [Async]
await page.keyboard.insert_text("嗨")
```

```python [Sync]
page.keyboard.insert_text("嗨")
```

:::

::: info
Modifier keys DO NOT effect `keyboard.insertText`. Holding down `Shift` will not type the text in upper case.
:::

**Arguments**

- <a id="keyboard-insert-text-option-text"></a>`text` `string`

  Sets input to the specified text value.


### keyboard.press() {#keyboard-press}

<Badge type="info" text="Added in: v1.8" />

::: tip
In most cases, you should use [`locator.press()`](/python/api/class-locator#locator-press) instead.
:::

[`key`](/python/api/class-keyboard#keyboard-press-option-key) can specify the intended
[keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value or a single character to
generate the text for. A superset of the [`key`](/python/api/class-keyboard#keyboard-press-option-key) values can be found
[here](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:

`F1` - `F12`, `Digit0`- `Digit9`, `KeyA`- `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
`Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.

Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`, `ShiftLeft`, `ControlOrMeta`.
`ControlOrMeta` resolves to `Control` on Windows and Linux and to `Meta` on macOS.

Holding down `Shift` will type the text that corresponds to the [`key`](/python/api/class-keyboard#keyboard-press-option-key) in the upper case.

If [`key`](/python/api/class-keyboard#keyboard-press-option-key) is a single character, it is case-sensitive, so the values `a` and `A` will generate different
respective texts.

Shortcuts such as `key: "Control+o"`, `key: "Control++` or `key: "Control+Shift+T"` are supported as well. When specified with the
modifier, modifier is pressed and being held while the subsequent key is being pressed.

**Usage**

::: code-group

```python [Async]
page = await browser.new_page()
await page.goto("https://keycode.info")
await page.keyboard.press("a")
await page.screenshot(path="a.png")
await page.keyboard.press("ArrowLeft")
await page.screenshot(path="arrow_left.png")
await page.keyboard.press("Shift+O")
await page.screenshot(path="o.png")
await browser.close()
```

```python [Sync]
page = browser.new_page()
page.goto("https://keycode.info")
page.keyboard.press("a")
page.screenshot(path="a.png")
page.keyboard.press("ArrowLeft")
page.screenshot(path="arrow_left.png")
page.keyboard.press("Shift+O")
page.screenshot(path="o.png")
browser.close()
```

:::

Shortcut for [`keyboard.down()`](/python/api/class-keyboard#keyboard-down) and [`keyboard.up()`](/python/api/class-keyboard#keyboard-up).

**Arguments**

- <a id="keyboard-press-option-key"></a>`key` `string`

  Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
- <a id="keyboard-press-option-options"></a>`options` `Object` *(optional)*

  - <a id="keyboard-press-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `keydown` and `keyup` in milliseconds. Defaults to 0.


### keyboard.type() {#keyboard-type}

<Badge type="info" text="Added in: v1.8" />

::: warning
In most cases, you should use [`locator.fill()`](/python/api/class-locator#locator-fill) instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use [`locator.press_sequentially()`](/python/api/class-locator#locator-press-sequentially).
:::

Sends a `keydown`, `keypress`/`input`, and `keyup` event for each character in the text.

To press a special key, like `Control` or `ArrowDown`, use [`keyboard.press()`](/python/api/class-keyboard#keyboard-press).

**Usage**

::: code-group

```python [Async]
await page.keyboard.type("Hello") # types instantly
await page.keyboard.type("World", delay=100) # types slower, like a user
```

```python [Sync]
page.keyboard.type("Hello") # types instantly
page.keyboard.type("World", delay=100) # types slower, like a user
```

:::

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

<Badge type="info" text="Added in: v1.8" />

Dispatches a `keyup` event.

**Arguments**

- <a id="keyboard-up-option-key"></a>`key` `string`

  Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.

