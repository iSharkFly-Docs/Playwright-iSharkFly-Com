---
title: "操作"
---

# 操作

## 简介

Playwright 可以与 HTML 输入元素交互，包括文本输入框、复选框、单选按钮、下拉选择、鼠标点击、输入字符、按键和快捷键，以及上传文件和聚焦元素。

## 文本输入

使用 [`locator.fill()`](/java/api/class-locator#locator-fill) 是填写表单字段最简单的方式。它会聚焦元素并触发带有输入文本的 `input` 事件。该方法适用于 `<input>`、`<textarea>` 和 `[contenteditable]` 元素。

```java
// 文本输入
page.getByRole(AriaRole.TEXTBOX).fill("Peter");

// 日期输入
page.getByLabel("Birth date").fill("2020-02-02");

// 时间输入
page.getByLabel("Appointment time").fill("13:15");

// 本地日期时间输入
page.getByLabel("Local time").fill("2020-03-02T05:15");
```

## 复选框和单选按钮

使用 [`locator.setChecked()`](/java/api/class-locator#locator-set-checked) 是勾选和取消勾选复选框或单选按钮最简单的方式。此方法可用于 `input[type=checkbox]`、`input[type=radio]` 和 `[role=checkbox]` 元素。

```java
// 勾选复选框
page.getByLabel("I agree to the terms above").check();

// 断言勾选状态
assertThat(page.getByLabel("Subscribe to newsletter")).isChecked();

// 选择单选按钮
page.getByLabel("XL").check();
```

## 下拉选择

使用 [`locator.selectOption()`](/java/api/class-locator#locator-select-option) 在 `<select>` 元素中选择一个或多个选项。
您可以指定选项的 `value` 或 `label` 来进行选择。可以选择多个选项。

```java
// 根据值或标签进行单选
page.getByLabel("Choose a color").selectOption("blue");

// 根据标签进行单选
page.getByLabel("Choose a color").selectOption(new SelectOption().setLabel("Blue"));

// 多选
page.getByLabel("Choose multiple colors").selectOption(new String[] {"red", "green", "blue"});
```

## 鼠标点击

执行简单的人工点击。

```java
// 普通点击
page.getByRole(AriaRole.BUTTON).click();

// 双击
page.getByText("Item").dblclick();

// 右键点击
page.getByText("Item").click(new Locator.ClickOptions().setButton(MouseButton.RIGHT));

// Shift + 点击
page.getByText("Item").click(new Locator.ClickOptions().setModifiers(Arrays.asList(KeyboardModifier.SHIFT)));

// 在 Windows 和 Linux 上是 Ctrl + 点击
// 在 macOS 上是 Meta + 点击
page.getByText("Item").click(new Locator.ClickOptions().setModifiers(Arrays.asList(KeyboardModifier.CONTROL_OR_META)));

// 悬停在元素上
page.getByText("Item").hover();

// 点击左上角
page.getByText("Item").click(new Locator.ClickOptions().setPosition(0, 0));
```

在底层，这个方法和其他指针相关的方法会：
- 等待具有给定选择器的元素出现在 DOM 中
- 等待元素变为可见状态，即非空、没有 `display:none`、没有 `visibility:hidden`
- 等待元素停止移动，例如，等待 CSS 过渡完成
- 将元素滚动到可视区域
- 等待元素在操作点接收指针事件，例如，等待元素不被其他元素遮挡
- 如果在上述任何检查过程中元素被分离，则重试

#### 强制点击

有时，应用程序使用非常规的逻辑，当鼠标悬停在元素上时会用另一个元素覆盖它来拦截点击。这种行为与元素被覆盖导致点击被分发到其他地方的错误无法区分。如果您知道这种情况正在发生，可以绕过[可操作性](./actionability.md)检查并强制点击：

```java
page.getByRole(AriaRole.BUTTON).click(new Locator.ClickOptions().setForce(true));
```

#### 编程式点击

如果您不想在真实条件下测试应用程序，而是想通过任何可能的方式模拟点击，您可以通过 [`locator.dispatchEvent()`](/java/api/class-locator#locator-dispatch-event) 在元素上直接分发点击事件来触发 [`HTMLElement.click()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click) 行为：

```java
page.getByRole(AriaRole.BUTTON).dispatchEvent("click");
```

## 逐字符输入

::: warning
大多数情况下，您应该使用 [`locator.fill()`](/java/api/class-locator#locator-fill) 输入文本。请参阅上面的[文本输入](#文本输入)部分。只有当页面有特殊的键盘处理时，您才需要逐字符输入。
:::

使用 [`locator.pressSequentially()`](/java/api/class-locator#locator-press-sequentially) 逐字符输入到字段中，就像使用真实键盘的用户一样。

```java
// 逐个按键
page.locator("#area").pressSequentially("Hello World!");
```

此方法会触发所有必要的键盘事件，包括所有的 `keydown`、`keyup`、`keypress` 事件。您甚至可以指定可选的按键间隔 `delay` 来模拟真实用户行为。

## 按键和快捷键

```java
// 按 Enter 键
page.getByText("Submit").press("Enter");

// 分发 Control+Right
page.getByRole(AriaRole.TEXTBOX).press("Control+ArrowRight");

// 按键盘上的 $ 符号
page.getByRole(AriaRole.TEXTBOX).press("$");
```

[`locator.press()`](/java/api/class-locator#locator-press) 方法会聚焦选定的元素并产生一次按键。它接受在键盘事件的 [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) 属性中发出的逻辑键名称：

```txt
Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape,
ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight,
ArrowUp, F1 - F12, Digit0 - Digit9, KeyA - KeyZ, 等等。
```
- 您也可以指定要产生的单个字符，例如 `"a"` 或 `"#"`。
- 还支持以下修饰键快捷键：`Shift, Control, Alt, Meta`。

简单版本产生单个字符。这个字符是区分大小写的，所以 `"a"` 和 `"A"` 会产生不同的结果。

```java
// <input id=name>
page.locator("#name").press("Shift+A");

// <input id=name>
page.locator("#name").press("Shift+ArrowLeft");
```

也支持 `"Control+o"` 或 `"Control+Shift+T"` 等快捷键。当使用修饰键时，修饰键会被按下并保持，同时按下后续的键。

注意，在 `Shift-A` 中您仍然需要指定大写的 `A` 来产生大写字符。`Shift-a` 会产生小写字符，就像您开启了 `CapsLock` 一样。

## 上传文件

您可以使用 [`locator.setInputFiles()`](/java/api/class-locator#locator-set-input-files) 方法选择要上传的输入文件。它期望第一个参数指向类型为 `"file"` 的[输入元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)。可以在数组中传递多个文件。如果某些文件路径是相对的，它们会相对于当前工作目录解析。空数组会清除选定的文件。

```java
// 选择一个文件
page.getByLabel("Upload file").setInputFiles(Paths.get("myfile.pdf"));

// 选择多个文件
page.getByLabel("Upload files").setInputFiles(new Path[] {Paths.get("file1.txt"), Paths.get("file2.txt")});

// 选择一个目录
page.getByLabel("Upload directory").setInputFiles(Paths.get("mydir"));

// 移除所有选定的文件
page.getByLabel("Upload file").setInputFiles(new Path[0]);

// 从内存上传缓冲区
page.getByLabel("Upload file").setInputFiles(new FilePayload(
  "file.txt", "text/plain", "this is test".getBytes(StandardCharsets.UTF_8)));
```

如果您手头没有输入元素（它是动态创建的），您可以处理 [`page.onFileChooser()`](/java/api/class-page#page-event-file-chooser) 事件，或者在您的操作时使用相应的等待方法：

```java
FileChooser fileChooser = page.waitForFileChooser(() -> {
  page.getByLabel("Upload file").click();
});
fileChooser.setFiles(Paths.get("myfile.pdf"));
```

## 聚焦元素

对于处理焦点事件的动态页面，您可以使用 [`locator.focus()`](/java/api/class-locator#locator-focus) 聚焦给定元素。

```java
page.getByLabel("Password").focus();
```

## 拖放

您可以使用 [`locator.dragTo()`](/java/api/class-locator#locator-drag-to) 执行拖放操作。此方法会：
- 悬停在要拖动的元素上。
- 按下鼠标左键。
- 将鼠标移动到将接收放置的元素上。
- 释放鼠标左键。

```java
page.locator("#item-to-be-dragged").dragTo(page.locator("#item-to-drop-at"));
```

### 手动拖动

如果您想精确控制拖动操作，可以使用较低级别的方法，如 [`locator.hover()`](/java/api/class-locator#locator-hover)、[`mouse.down()`](/java/api/class-mouse#mouse-down)、[`mouse.move()`](/java/api/class-mouse#mouse-move) 和 [`mouse.up()`](/java/api/class-mouse#mouse-up)。

```java
page.locator("#item-to-be-dragged").hover();
page.mouse().down();
page.locator("#item-to-drop-at").hover();
page.mouse().up();
```

::: info
如果您的页面依赖于 `dragover` 事件被分发，您需要至少两次鼠标移动才能在所有浏览器中触发它。为了可靠地执行第二次鼠标移动，请重复您的 [`mouse.move()`](/java/api/class-mouse#mouse-move) 或 [`locator.hover()`](/java/api/class-locator#locator-hover) 两次。操作顺序应该是：悬停在拖动元素上、鼠标按下、悬停在放置元素上、第二次悬停在放置元素上、鼠标松开。
:::

## 滚动

大多数情况下，Playwright 会在执行任何操作之前自动为您滚动。因此，您不需要显式滚动。

```java
// 自动滚动使按钮可见
page.getByRole(AriaRole.BUTTON).click();
```

但是，在极少数情况下，您可能需要手动滚动。例如，您可能想要强制"无限列表"加载更多元素，或者为特定截图定位页面。在这种情况下，最可靠的方法是找到您想要在底部可见的元素，并将其滚动到视图中。

```java
// 将页脚滚动到视图中，强制"无限列表"加载更多内容
page.getByText("Footer text").scrollIntoViewIfNeeded();
```

如果您想更精确地控制滚动，可以使用 [`mouse.wheel()`](/java/api/class-mouse#mouse-wheel) 或 [`locator.evaluate()`](/java/api/class-locator#locator-evaluate)：

```java
// 定位鼠标并使用鼠标滚轮滚动
page.getByTestId("scrolling-container").hover();
page.mouse.wheel(0, 10);

// 或者，以编程方式滚动特定元素
page.getByTestId("scrolling-container").evaluate("e => e.scrollTop += 100");
```
