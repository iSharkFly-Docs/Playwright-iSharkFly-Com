---
title: "操作"
---

# 操作

## 简介

Playwright 可以与 HTML 输入元素交互，包括文本输入框、复选框、单选按钮、下拉选择、鼠标点击、输入字符、按键和快捷键，以及上传文件和聚焦元素。

## 文本输入

使用 [`locator.fill()`](/python/api/class-locator#locator-fill) 是填写表单字段最简单的方式。它会聚焦元素并触发带有输入文本的 `input` 事件。该方法适用于 `<input>`、`<textarea>` 和 `[contenteditable]` 元素。

::: code-group

```python [Async]
# 文本输入
await page.get_by_role("textbox").fill("Peter")

# 日期输入
await page.get_by_label("Birth date").fill("2020-02-02")

# 时间输入
await page.get_by_label("Appointment time").fill("13:15")

# 本地日期时间输入
await page.get_by_label("Local time").fill("2020-03-02T05:15")
```

```python [Sync]
# 文本输入
page.get_by_role("textbox").fill("Peter")

# 日期输入
page.get_by_label("Birth date").fill("2020-02-02")

# 时间输入
page.get_by_label("Appointment time").fill("13:15")

# 本地日期时间输入
page.get_by_label("Local time").fill("2020-03-02T05:15")
```

:::

## 复选框和单选按钮

使用 [`locator.set_checked()`](/python/api/class-locator#locator-set-checked) 是勾选和取消勾选复选框或单选按钮最简单的方式。此方法可用于 `input[type=checkbox]`、`input[type=radio]` 和 `[role=checkbox]` 元素。

::: code-group

```python [Async]
# 勾选复选框
await page.get_by_label('I agree to the terms above').check()

# 断言勾选状态
await expect(page.get_by_label('Subscribe to newsletter')).to_be_checked()

# 选择单选按钮
await page.get_by_label('XL').check()
```

```python [Sync]
# 勾选复选框
page.get_by_label('I agree to the terms above').check()

# 断言勾选状态
expect(page.get_by_label('Subscribe to newsletter')).to_be_checked()

# 选择单选按钮
page.get_by_label('XL').check()
```

:::

## 下拉选择

使用 [`locator.select_option()`](/python/api/class-locator#locator-select-option) 在 `<select>` 元素中选择一个或多个选项。
您可以指定选项的 `value` 或 `label` 来进行选择。可以选择多个选项。

::: code-group

```python [Async]
# 根据值或标签进行单选
await page.get_by_label('Choose a color').select_option('blue')

# 根据标签进行单选
await page.get_by_label('Choose a color').select_option(label='Blue')

# 多选
await page.get_by_label('Choose multiple colors').select_option(['red', 'green', 'blue'])
```

```python [Sync]
# 根据值或标签进行单选
page.get_by_label('Choose a color').select_option('blue')

# 根据标签进行单选
page.get_by_label('Choose a color').select_option(label='Blue')

# 多选
page.get_by_label('Choose multiple colors').select_option(['red', 'green', 'blue'])
```

:::

## 鼠标点击

执行简单的人工点击。

::: code-group

```python [Async]
# 普通点击
await page.get_by_role("button").click()

# 双击
await page.get_by_text("Item").dblclick()

# 右键点击
await page.get_by_text("Item").click(button="right")

# Shift + 点击
await page.get_by_text("Item").click(modifiers=["Shift"])

# 在 Windows 和 Linux 上是 Ctrl + 点击
# 在 macOS 上是 Meta + 点击
await page.get_by_text("Item").click(modifiers=["ControlOrMeta"])

# 悬停在元素上
await page.get_by_text("Item").hover()

# 点击左上角
await page.get_by_text("Item").click(position={ "x": 0, "y": 0})
```

```python [Sync]
# 普通点击
page.get_by_role("button").click()

# 双击
page.get_by_text("Item").dblclick()

# 右键点击
page.get_by_text("Item").click(button="right")

# Shift + 点击
page.get_by_text("Item").click(modifiers=["Shift"])

# 悬停在元素上
page.get_by_text("Item").hover()

# 点击左上角
page.get_by_text("Item").click(position={ "x": 0, "y": 0})
```

:::

在底层，这个方法和其他指针相关的方法会：
- 等待具有给定选择器的元素出现在 DOM 中
- 等待元素变为可见状态，即非空、没有 `display:none`、没有 `visibility:hidden`
- 等待元素停止移动，例如，等待 CSS 过渡完成
- 将元素滚动到可视区域
- 等待元素在操作点接收指针事件，例如，等待元素不被其他元素遮挡
- 如果在上述任何检查过程中元素被分离，则重试

#### 强制点击

有时，应用程序使用非常规的逻辑，当鼠标悬停在元素上时会用另一个元素覆盖它来拦截点击。这种行为与元素被覆盖导致点击被分发到其他地方的错误无法区分。如果您知道这种情况正在发生，可以绕过[可操作性](./actionability.md)检查并强制点击：

::: code-group

```python [Async]
await page.get_by_role("button").click(force=True)
```

```python [Sync]
page.get_by_role("button").click(force=True)
```

:::

#### 编程式点击

如果您不想在真实条件下测试应用程序，而是想通过任何可能的方式模拟点击，您可以通过 [`locator.dispatch_event()`](/python/api/class-locator#locator-dispatch-event) 在元素上直接分发点击事件来触发 [`HTMLElement.click()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click) 行为：

::: code-group

```python [Async]
await page.get_by_role("button").dispatch_event('click')
```

```python [Sync]
page.get_by_role("button").dispatch_event('click')
```

:::

## 逐字符输入

::: warning
大多数情况下，您应该使用 [`locator.fill()`](/python/api/class-locator#locator-fill) 输入文本。请参阅上面的[文本输入](#文本输入)部分。只有当页面有特殊的键盘处理时，您才需要逐字符输入。
:::

使用 [`locator.press_sequentially()`](/python/api/class-locator#locator-press-sequentially) 逐字符输入到字段中，就像使用真实键盘的用户一样。

::: code-group

```python [Async]
# 逐个按键
await page.locator('#area').press_sequentially('Hello World!')
```

```python [Sync]
# 逐个按键
page.locator('#area').press_sequentially('Hello World!')
```

:::

此方法会触发所有必要的键盘事件，包括所有的 `keydown`、`keyup`、`keypress` 事件。您甚至可以指定可选的按键间隔 `delay` 来模拟真实用户行为。

## 按键和快捷键

::: code-group

```python [Async]
# 按 Enter 键
await page.get_by_text("Submit").press("Enter")

# 分发 Control+Right
await page.get_by_role("textbox").press("Control+ArrowRight")

# 按键盘上的 $ 符号
await page.get_by_role("textbox").press("$")
```

```python [Sync]
# 按 Enter 键
page.get_by_text("Submit").press("Enter")

# 分发 Control+Right
page.get_by_role("textbox").press("Control+ArrowRight")

# 按键盘上的 $ 符号
page.get_by_role("textbox").press("$")
```

:::

[`locator.press()`](/python/api/class-locator#locator-press) 方法会聚焦选定的元素并产生一次按键。它接受在键盘事件的 [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) 属性中发出的逻辑键名称：

```txt
Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape,
ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight,
ArrowUp, F1 - F12, Digit0 - Digit9, KeyA - KeyZ, 等等。
```
- 您也可以指定要产生的单个字符，例如 `"a"` 或 `"#"`。
- 还支持以下修饰键快捷键：`Shift, Control, Alt, Meta`。

简单版本产生单个字符。这个字符是区分大小写的，所以 `"a"` 和 `"A"` 会产生不同的结果。

::: code-group

```python [Async]
# <input id=name>
await page.locator('#name').press('Shift+A')

# <input id=name>
await page.locator('#name').press('Shift+ArrowLeft')
```

```python [Sync]
# <input id=name>
page.locator('#name').press('Shift+A')

# <input id=name>
page.locator('#name').press('Shift+ArrowLeft')
```

:::

也支持 `"Control+o"` 或 `"Control+Shift+T"` 等快捷键。当使用修饰键时，修饰键会被按下并保持，同时按下后续的键。

注意，在 `Shift-A` 中您仍然需要指定大写的 `A` 来产生大写字符。`Shift-a` 会产生小写字符，就像您开启了 `CapsLock` 一样。

## 上传文件

您可以使用 [`locator.set_input_files()`](/python/api/class-locator#locator-set-input-files) 方法选择要上传的输入文件。它期望第一个参数指向类型为 `"file"` 的[输入元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)。可以在数组中传递多个文件。如果某些文件路径是相对的，它们会相对于当前工作目录解析。空数组会清除选定的文件。

::: code-group

```python [Async]
# 选择一个文件
await page.get_by_label("Upload file").set_input_files('myfile.pdf')

# 选择多个文件
await page.get_by_label("Upload files").set_input_files(['file1.txt', 'file2.txt'])

# 选择一个目录
await page.get_by_label("Upload directory").set_input_files('mydir')

# 移除所有选定的文件
await page.get_by_label("Upload file").set_input_files([])

# 从内存上传缓冲区
await page.get_by_label("Upload file").set_input_files(
    files=[
        {"name": "test.txt", "mimeType": "text/plain", "buffer": b"this is a test"}
    ],
)
```

```python [Sync]
# 选择一个文件
page.get_by_label("Upload file").set_input_files('myfile.pdf')

# 选择多个文件
page.get_by_label("Upload files").set_input_files(['file1.txt', 'file2.txt'])

# 选择一个目录
page.get_by_label("Upload directory").set_input_files('mydir')

# 移除所有选定的文件
page.get_by_label("Upload file").set_input_files([])

# 从内存上传缓冲区
page.get_by_label("Upload file").set_input_files(
    files=[
        {"name": "test.txt", "mimeType": "text/plain", "buffer": b"this is a test"}
    ],
)
```

:::

如果您手头没有输入元素（它是动态创建的），您可以处理 [`page.on("fileChooser")`](/python/api/class-page#page-event-file-chooser) 事件，或者在您的操作时使用相应的等待方法：

::: code-group

```python [Async]
async with page.expect_file_chooser() as fc_info:
    await page.get_by_label("Upload file").click()
file_chooser = await fc_info.value
await file_chooser.set_files("myfile.pdf")
```

```python [Sync]
with page.expect_file_chooser() as fc_info:
    page.get_by_label("Upload file").click()
file_chooser = fc_info.value
file_chooser.set_files("myfile.pdf")
```

:::

## 聚焦元素

对于处理焦点事件的动态页面，您可以使用 [`locator.focus()`](/python/api/class-locator#locator-focus) 聚焦给定元素。

::: code-group

```python [Async]
await page.get_by_label('password').focus()
```

```python [Sync]
page.get_by_label('password').focus()
```

:::

## 拖放

您可以使用 [`locator.drag_to()`](/python/api/class-locator#locator-drag-to) 执行拖放操作。此方法会：
- 悬停在要拖动的元素上。
- 按下鼠标左键。
- 将鼠标移动到将接收放置的元素上。
- 释放鼠标左键。

::: code-group

```python [Async]
await page.locator("#item-to-be-dragged").drag_to(page.locator("#item-to-drop-at"))
```

```python [Sync]
page.locator("#item-to-be-dragged").drag_to(page.locator("#item-to-drop-at"))
```

:::

### 手动拖动

如果您想精确控制拖动操作，可以使用较低级别的方法，如 [`locator.hover()`](/python/api/class-locator#locator-hover)、[`mouse.down()`](/python/api/class-mouse#mouse-down)、[`mouse.move()`](/python/api/class-mouse#mouse-move) 和 [`mouse.up()`](/python/api/class-mouse#mouse-up)。

::: code-group

```python [Async]
await page.locator("#item-to-be-dragged").hover()
await page.mouse.down()
await page.locator("#item-to-drop-at").hover()
await page.mouse.up()
```

```python [Sync]
page.locator("#item-to-be-dragged").hover()
page.mouse.down()
page.locator("#item-to-drop-at").hover()
page.mouse.up()
```

:::

::: info
如果您的页面依赖于 `dragover` 事件被分发，您需要至少两次鼠标移动才能在所有浏览器中触发它。为了可靠地执行第二次鼠标移动，请重复您的 [`mouse.move()`](/python/api/class-mouse#mouse-move) 或 [`locator.hover()`](/python/api/class-locator#locator-hover) 两次。操作顺序应该是：悬停在拖动元素上、鼠标按下、悬停在放置元素上、第二次悬停在放置元素上、鼠标松开。
:::

## 滚动

大多数情况下，Playwright 会在执行任何操作之前自动为您滚动。因此，您不需要显式滚动。

::: code-group

```python [Async]
# 自动滚动使按钮可见
await page.get_by_role("button").click()
```

```python [Sync]
# 自动滚动使按钮可见
page.get_by_role("button").click()
```

:::

但是，在极少数情况下，您可能需要手动滚动。例如，您可能想要强制"无限列表"加载更多元素，或者为特定截图定位页面。在这种情况下，最可靠的方法是找到您想要在底部可见的元素，并将其滚动到视图中。

::: code-group

```python [Async]
# 将页脚滚动到视图中，强制"无限列表"加载更多内容
await page.get_by_text("Footer text").scroll_into_view_if_needed()
```

```python [Sync]
# 将页脚滚动到视图中，强制"无限列表"加载更多内容
page.get_by_text("Footer text").scroll_into_view_if_needed()
```

:::

如果您想更精确地控制滚动，可以使用 [`mouse.wheel()`](/python/api/class-mouse#mouse-wheel) 或 [`locator.evaluate()`](/python/api/class-locator#locator-evaluate)：

::: code-group

```python [Async]
# 定位鼠标并使用鼠标滚轮滚动
await page.get_by_test_id("scrolling-container").hover()
await page.mouse.wheel(0, 10)

# 或者，以编程方式滚动特定元素
await page.get_by_test_id("scrolling-container").evaluate("e => e.scrollTop += 100")
```

```python [Sync]
# 定位鼠标并使用鼠标滚轮滚动
page.get_by_test_id("scrolling-container").hover()
page.mouse.wheel(0, 10)

# 或者，以编程方式滚动特定元素
page.get_by_test_id("scrolling-container").evaluate("e => e.scrollTop += 100")
```

:::
