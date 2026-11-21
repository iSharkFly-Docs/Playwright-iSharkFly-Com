---
title: "操作"
---

# 操作

## 简介

Playwright 可以与 HTML 输入元素进行交互，包括文本输入框、复选框、单选按钮、下拉选择框、鼠标点击、字符输入、按键和快捷键，以及上传文件和聚焦元素。

## 文本输入

使用 [`locator.fill()`](/api/class-locator#locator-fill) 是填写表单字段最简单的方式。它会聚焦元素并触发带有输入文本的 `input` 事件。它适用于 `<input>`、`<textarea>` 和 `[contenteditable]` 元素。

```js
// 文本输入
await page.getByRole('textbox').fill('Peter');

// 日期输入
await page.getByLabel('Birth date').fill('2020-02-02');

// 时间输入
await page.getByLabel('Appointment time').fill('13:15');

// 本地日期时间输入
await page.getByLabel('Local time').fill('2020-03-02T05:15');
```

## 复选框和单选按钮

使用 [`locator.setChecked()`](/api/class-locator#locator-set-checked) 是选中和取消选中复选框或单选按钮最简单的方式。此方法可用于 `input[type=checkbox]`、`input[type=radio]` 和 `[role=checkbox]` 元素。

```js
// 选中复选框
await page.getByLabel('I agree to the terms above').check();

// 断言选中状态
expect(page.getByLabel('Subscribe to newsletter')).toBeChecked();

// 选择单选按钮
await page.getByLabel('XL').check();
```

## 下拉选择

使用 [`locator.selectOption()`](/api/class-locator#locator-select-option) 在 `<select>` 元素中选择一个或多个选项。
您可以指定选项的 `value` 或 `label` 来选择。可以选择多个选项。

```js
// 通过值或标签匹配进行单选
await page.getByLabel('Choose a color').selectOption('blue');

// 通过标签匹配进行单选
await page.getByLabel('Choose a color').selectOption({ label: 'Blue' });

// 多选
await page.getByLabel('Choose multiple colors').selectOption(['red', 'green', 'blue']);
```

## 鼠标点击

执行简单的人工点击。

```js
// 普通点击
await page.getByRole('button').click();

// 双击
await page.getByText('Item').dblclick();

// 右键点击
await page.getByText('Item').click({ button: 'right' });

// Shift + 点击
await page.getByText('Item').click({ modifiers: ['Shift'] });

// Windows 和 Linux 上的 Ctrl + 点击
// macOS 上的 Meta + 点击
await page.getByText('Item').click({ modifiers: ['ControlOrMeta'] });

// 悬停在元素上
await page.getByText('Item').hover();

// 点击左上角
await page.getByText('Item').click({ position: { x: 0, y: 0 } });
```

在底层，这个方法和其他指针相关的方法会：
- 等待具有给定选择器的元素出现在 DOM 中
- 等待元素变得可见，即不为空、没有 `display:none`、没有 `visibility:hidden`
- 等待元素停止移动，例如等待 CSS 过渡完成
- 将元素滚动到视图中
- 等待元素在操作点接收指针事件，例如等待元素不被其他元素遮挡
- 如果在上述任何检查过程中元素被分离，则重试

#### 强制点击

有时，应用程序使用复杂的逻辑，当悬停在元素上时会用另一个元素覆盖它，从而拦截点击。这种行为与元素被覆盖导致点击被分派到其他地方的 bug 无法区分。如果您知道这种情况正在发生，可以绕过[可操作性](./actionability.md)检查并强制点击：

```js
await page.getByRole('button').click({ force: true });
```

#### 程序化点击

如果您不想在真实条件下测试应用程序，而是想通过任何可能的方式模拟点击，您可以使用 [`locator.dispatchEvent()`](/api/class-locator#locator-dispatch-event) 在元素上简单地分派点击事件来触发 [`HTMLElement.click()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click) 行为：

```js
await page.getByRole('button').dispatchEvent('click');
```

## 输入字符

::: warning
大多数情况下，您应该使用 [`locator.fill()`](/api/class-locator#locator-fill) 输入文本。请参阅上面的[文本输入](#文本输入)部分。只有当页面上有特殊的键盘处理时，才需要输入字符。
:::

使用 [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially) 逐个字符地输入到字段中，就像使用真实键盘的用户一样。

```js
// 逐个按键
await page.locator('#area').pressSequentially('Hello World!');
```

此方法将触发所有必要的键盘事件，包括所有的 `keydown`、`keyup`、`keypress` 事件。您甚至可以指定按键之间的可选 `delay` 来模拟真实用户行为。

## 按键和快捷键

```js
// 按 Enter 键
await page.getByText('Submit').press('Enter');

// 分派 Control+Right
await page.getByRole('textbox').press('Control+ArrowRight');

// 按键盘上的 $ 符号
await page.getByRole('textbox').press('$');
```

[`locator.press()`](/api/class-locator#locator-press) 方法聚焦选定的元素并产生单个按键。它接受在键盘事件的 [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) 属性中发出的逻辑键名：

```txt
Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape,
ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight,
ArrowUp, F1 - F12, Digit0 - Digit9, KeyA - KeyZ, 等。
```
- 您也可以指定要产生的单个字符，如 `"a"` 或 `"#"`。
- 还支持以下修饰符快捷键：`Shift、Control、Alt、Meta`。

简单版本产生单个字符。此字符区分大小写，所以 `"a"` 和 `"A"` 会产生不同的结果。

```js
// <input id=name>
await page.locator('#name').press('Shift+A');

// <input id=name>
await page.locator('#name').press('Shift+ArrowLeft');
```

快捷键如 `"Control+o"` 或 `"Control+Shift+T"` 也受支持。当与修饰符一起指定时，修饰符会被按下并保持，同时按下后续的键。

请注意，您仍然需要在 `Shift-A` 中指定大写 `A` 来产生大写字符。`Shift-a` 会产生小写字符，就像您打开了 `CapsLock` 一样。

## 上传文件

您可以使用 [`locator.setInputFiles()`](/api/class-locator#locator-set-input-files) 方法选择要上传的输入文件。它期望第一个参数指向类型为 `"file"` 的 [input 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)。可以在数组中传递多个文件。如果某些文件路径是相对的，它们会相对于当前工作目录解析。空数组会清除选中的文件。

```js
// 选择一个文件
await page.getByLabel('Upload file').setInputFiles(path.join(__dirname, 'myfile.pdf'));

// 选择多个文件
await page.getByLabel('Upload files').setInputFiles([
  path.join(__dirname, 'file1.txt'),
  path.join(__dirname, 'file2.txt'),
]);

// 选择一个目录
await page.getByLabel('Upload directory').setInputFiles(path.join(__dirname, 'mydir'));

// 移除所有选中的文件
await page.getByLabel('Upload file').setInputFiles([]);

// 从内存上传缓冲区
await page.getByLabel('Upload file').setInputFiles({
  name: 'file.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('this is test')
});
```

如果您手头没有 input 元素（它是动态创建的），您可以处理 [`page.on('fileChooser')`](/api/class-page#page-event-file-chooser) 事件或在操作时使用相应的等待方法：

```js
// 在点击之前开始等待文件选择器。注意没有 await。
const fileChooserPromise = page.waitForEvent('filechooser');
await page.getByLabel('Upload file').click();
const fileChooser = await fileChooserPromise;
await fileChooser.setFiles(path.join(__dirname, 'myfile.pdf'));
```

## 聚焦元素

对于处理焦点事件的动态页面，您可以使用 [`locator.focus()`](/api/class-locator#locator-focus) 聚焦给定的元素。

```js
await page.getByLabel('Password').focus();
```

## 拖放

您可以使用 [`locator.dragTo()`](/api/class-locator#locator-drag-to) 执行拖放操作。此方法将：
- 悬停在将被拖动的元素上。
- 按下鼠标左键。
- 将鼠标移动到将接收放置的元素。
- 释放鼠标左键。

```js
await page.locator('#item-to-be-dragged').dragTo(page.locator('#item-to-drop-at'));
```

### 手动拖动

如果您想精确控制拖动操作，可以使用较低级别的方法，如 [`locator.hover()`](/api/class-locator#locator-hover)、[`mouse.down()`](/api/class-mouse#mouse-down)、[`mouse.move()`](/api/class-mouse#mouse-move) 和 [`mouse.up()`](/api/class-mouse#mouse-up)。

```js
await page.locator('#item-to-be-dragged').hover();
await page.mouse.down();
await page.locator('#item-to-drop-at').hover();
await page.mouse.up();
```

::: info
如果您的页面依赖于 `dragover` 事件被分派，您需要至少两次鼠标移动才能在所有浏览器中触发它。为了可靠地发出第二次鼠标移动，请重复执行 [`mouse.move()`](/api/class-mouse#mouse-move) 或 [`locator.hover()`](/api/class-locator#locator-hover) 两次。操作顺序应该是：悬停在拖动元素上、鼠标按下、悬停在放置元素上、第二次悬停在放置元素上、鼠标松开。
:::

## 滚动

大多数情况下，Playwright 会在执行任何操作之前自动为您滚动。因此，您无需显式滚动。

```js
// 自动滚动使按钮可见
await page.getByRole('button').click();
```

但是，在极少数情况下，您可能需要手动滚动。例如，您可能希望强制"无限列表"加载更多元素，或为特定截图定位页面。在这种情况下，最可靠的方法是找到您想在底部使其可见的元素，并将其滚动到视图中。

```js
// 将页脚滚动到视图中，强制"无限列表"加载更多内容
await page.getByText('Footer text').scrollIntoViewIfNeeded();
```

如果您想更精确地控制滚动，可以使用 [`mouse.wheel()`](/api/class-mouse#mouse-wheel) 或 [`locator.evaluate()`](/api/class-locator#locator-evaluate)：

```js
// 定位鼠标并使用鼠标滚轮滚动
await page.getByTestId('scrolling-container').hover();
await page.mouse.wheel(0, 10);

// 或者，以编程方式滚动特定元素
await page.getByTestId('scrolling-container').evaluate(e => e.scrollTop += 100);
```
