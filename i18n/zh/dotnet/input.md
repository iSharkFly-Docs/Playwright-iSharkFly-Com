---
title: "操作"
---

# 操作

## 简介

Playwright 可以与 HTML 输入元素交互，例如文本输入框、复选框、单选按钮、选择选项、鼠标点击、输入字符、按键和快捷键，还可以上传文件和聚焦元素。

## 文本输入

使用 [`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill) 是填写表单字段最简单的方法。它会聚焦元素并触发带有输入文本的 `input` 事件。它适用于 `<input>`、`<textarea>` 和 `[contenteditable]` 元素。

```csharp
// 文本输入
await page.GetByRole(AriaRole.Textbox).FillAsync("Peter");

// 日期输入
await page.GetByLabel("Birth date").FillAsync("2020-02-02");

// 时间输入
await page.GetByLabel("Appointment time").FillAsync("13:15");

// 本地日期时间输入
await page.GetByLabel("Local time").FillAsync("2020-03-02T05:15");
```

## 复选框和单选按钮

使用 [`Locator.SetCheckedAsync()`](/dotnet/api/class-locator#locator-set-checked) 是选中和取消选中复选框或单选按钮最简单的方法。此方法可用于 `input[type=checkbox]`、`input[type=radio]` 和 `[role=checkbox]` 元素。

```csharp
// 选中复选框
await page.GetByLabel("I agree to the terms above").CheckAsync();

// 断言选中状态
await Expect(page.GetByLabel("Subscribe to newsletter")).ToBeCheckedAsync();

// 选择单选按钮
await page.GetByLabel("XL").CheckAsync();
```

## 选择选项

使用 [`Locator.SelectOptionAsync()`](/dotnet/api/class-locator#locator-select-option) 在 `<select>` 元素中选择一个或多个选项。
你可以指定选项的 `value` 或 `label` 来进行选择。可以选择多个选项。

```csharp
// 单选匹配值或标签
await page.GetByLabel("Choose a color").SelectOptionAsync("blue");

// 单选匹配标签
await page.GetByLabel("Choose a color").SelectOptionAsync(new SelectOptionValue { Label = "blue" });

// 多选项目
await page.GetByLabel("Choose multiple colors").SelectOptionAsync(new[] { "blue", "green", "red" });
```

## 鼠标点击

执行简单的人工点击。

```csharp
// 普通点击
await page.GetByRole(AriaRole.Button).ClickAsync();

// 双击
await page.GetByText("Item").DblClickAsync();

// 右键点击
await page.GetByText("Item").ClickAsync(new() { Button = MouseButton.Right });

// Shift + 点击
await page.GetByText("Item").ClickAsync(new() { Modifiers = new[] { KeyboardModifier.Shift } });

// Windows 和 Linux 上是 Ctrl + 点击
// macOS 上是 Meta + 点击
await page.GetByText("Item").ClickAsync(new() { Modifiers = new[] { KeyboardModifier.ControlOrMeta } });

// 悬停在元素上
await page.GetByText("Item").HoverAsync();

// 点击左上角
await page.GetByText("Item").ClickAsync(new() { position = new Position { X = 0, Y = 0 } });
```

在底层，此方法和其他与指针相关的方法会：
- 等待具有给定选择器的元素出现在 DOM 中
- 等待它变得可见，即非空、没有 `display:none`、没有 `visibility:hidden`
- 等待它停止移动，例如，直到 CSS 过渡完成
- 将元素滚动到视图中
- 等待它在操作点接收指针事件，例如，等待直到元素不再被其他元素遮挡
- 如果在上述任何检查过程中元素被分离，则重试

#### 强制点击

有时，应用程序使用非简单的逻辑，当悬停在元素上时会用另一个元素覆盖它，从而拦截点击。这种行为与元素被覆盖并且点击被分派到其他地方的错误无法区分。如果你知道这种情况正在发生，你可以绕过[可操作性](./actionability.md)检查并强制点击：

```csharp
await page.GetByRole(AriaRole.Button).ClickAsync(new() { Force = true });
```

#### 编程式点击

如果你不想在真实条件下测试你的应用程序，而只想通过任何可能的方式模拟点击，你可以通过 [`Locator.DispatchEventAsync()`](/dotnet/api/class-locator#locator-dispatch-event) 在元素上分派点击事件来触发 [`HTMLElement.click()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click) 行为：

```csharp
await page.GetByRole(AriaRole.Button).DispatchEventAsync("click");
```

## 输入字符

::: warning
大多数情况下，你应该使用 [`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill) 输入文本。请参阅上面的[文本输入](#文本输入)部分。只有当页面上有特殊的键盘处理时，你才需要逐字符输入。
:::

使用 [`Locator.PressSequentiallyAsync()`](/dotnet/api/class-locator#locator-press-sequentially) 逐字符输入到字段中，就像使用真实键盘的用户一样。

```csharp
// 逐个按键
await Page.Locator("#area").PressSequentiallyAsync("Hello World!");
```

此方法将发出所有必要的键盘事件，包括所有适当的 `keydown`、`keyup`、`keypress` 事件。你甚至可以指定可选的按键之间的 `delay` 来模拟真实用户行为。

## 按键和快捷键

```csharp
// 按 Enter
await page.GetByText("Submit").PressAsync("Enter");

// 分派 Control+Right
await page.GetByRole(AriaRole.Textbox).PressAsync("Control+ArrowRight");

// 在键盘上按 $ 符号
await page.GetByRole(AriaRole.Textbox).PressAsync("$");
```

[`Locator.PressAsync()`](/dotnet/api/class-locator#locator-press) 方法聚焦所选元素并产生单个按键。它接受在键盘事件的 [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) 属性中发出的逻辑键名：

```txt
Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape,
ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight,
ArrowUp, F1 - F12, Digit0 - Digit9, KeyA - KeyZ, 等。
```
- 你也可以指定要产生的单个字符，例如 `"a"` 或 `"#"`。
- 还支持以下修饰快捷键：`Shift, Control, Alt, Meta`。

简单版本产生单个字符。此字符区分大小写，因此 `"a"` 和 `"A"` 将产生不同的结果。

```csharp
// <input id=name>
await page.Locator("#name").PressAsync("Shift+A");

// <input id=name>
await page.Locator("#name").PressAsync("Shift+ArrowLeft");
```

还支持诸如 `"Control+o"` 或 `"Control+Shift+T"` 之类的快捷键。当与修饰键一起指定时，修饰键被按下并保持按下状态，同时按下后续键。

注意，你仍然需要在 `Shift-A` 中指定大写的 `A` 来产生大写字符。`Shift-a` 会产生一个小写字符，就像你打开了 `CapsLock` 一样。

## 上传文件

你可以使用 [`Locator.SetInputFilesAsync()`](/dotnet/api/class-locator#locator-set-input-files) 方法选择要上传的输入文件。它期望第一个参数指向类型为 `"file"` 的[输入元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)。可以在数组中传递多个文件。如果某些文件路径是相对的，它们将相对于当前工作目录解析。空数组清除所选文件。

```csharp
// 选择一个文件
await page.GetByLabel("Upload file").SetInputFilesAsync("myfile.pdf");

// 选择多个文件
await page.GetByLabel("Upload files").SetInputFilesAsync(new[] { "file1.txt", "file12.txt" });

// 选择一个目录
await page.GetByLabel("Upload directory").SetInputFilesAsync("mydir");

// 移除所有选择的文件
await page.GetByLabel("Upload file").SetInputFilesAsync(new[] {});

// 从内存上传缓冲区
await page.GetByLabel("Upload file").SetInputFilesAsync(new FilePayload
{
    Name = "file.txt",
    MimeType = "text/plain",
    Buffer = System.Text.Encoding.UTF8.GetBytes("this is a test"),
});
```

如果你手头没有输入元素（它是动态创建的），你可以处理 [`Page.FileChooser`](/dotnet/api/class-page#page-event-file-chooser) 事件，或在执行操作时使用相应的等待方法：

```csharp
var fileChooser = page.RunAndWaitForFileChooserAsync(async () =>
{
    await page.GetByLabel("Upload file").ClickAsync();
});
await fileChooser.SetFilesAsync("myfile.pdf");
```

## 聚焦元素

对于处理聚焦事件的动态页面，你可以使用 [`Locator.FocusAsync()`](/dotnet/api/class-locator#locator-focus) 聚焦给定元素。

```csharp
await page.GetByLabel("Password").FocusAsync();
```

## 拖放

你可以使用 [`Locator.DragToAsync()`](/dotnet/api/class-locator#locator-drag-to) 执行拖放操作。此方法将：
- 悬停在将被拖动的元素上。
- 按下鼠标左键。
- 将鼠标移动到将接收放置的元素上。
- 释放鼠标左键。

```csharp
await page.Locator("#item-to-be-dragged").DragToAsync(page.Locator("#item-to-drop-at"));
```

### 手动拖动

如果你想对拖动操作进行精确控制，请使用较低级别的方法，如 [`Locator.HoverAsync()`](/dotnet/api/class-locator#locator-hover)、[`Mouse.DownAsync()`](/dotnet/api/class-mouse#mouse-down)、[`Mouse.MoveAsync()`](/dotnet/api/class-mouse#mouse-move) 和 [`Mouse.UpAsync()`](/dotnet/api/class-mouse#mouse-up)。

```csharp
await page.Locator("#item-to-be-dragged").HoverAsync();
await page.Mouse.DownAsync();
await page.Locator("#item-to-drop-at").HoverAsync();
await page.Mouse.UpAsync();
```

::: info
如果你的页面依赖于 `dragover` 事件被分派，你需要至少两次鼠标移动才能在所有浏览器中触发它。要可靠地发出第二次鼠标移动，请重复你的 [`Mouse.MoveAsync()`](/dotnet/api/class-mouse#mouse-move) 或 [`Locator.HoverAsync()`](/dotnet/api/class-locator#locator-hover) 两次。操作序列将是：悬停在拖动元素上、鼠标按下、悬停在放置元素上、第二次悬停在放置元素上、鼠标松开。
:::

## 滚动

大多数情况下，Playwright 会在执行任何操作之前自动为你滚动。因此，你不需要显式滚动。

```csharp
// 自动滚动使按钮可见
await page.GetByRole(AriaRole.Button).ClickAsync();
```

但是，在极少数情况下，你可能需要手动滚动。例如，你可能想强制"无限列表"加载更多元素，或为特定截图定位页面。在这种情况下，最可靠的方法是找到你想使其在底部可见的元素，并将其滚动到视图中。

```csharp
// 将页脚滚动到视图中，强制"无限列表"加载更多内容
await page.GetByText("Footer text").ScrollIntoViewIfNeededAsync();
```

如果你想更精确地控制滚动，请使用 [`Mouse.WheelAsync()`](/dotnet/api/class-mouse#mouse-wheel) 或 [`Locator.EvaluateAsync()`](/dotnet/api/class-locator#locator-evaluate)：

```csharp
// 定位鼠标并使用鼠标滚轮滚动
await page.GetByTestId("scrolling-container").HoverAsync();
await page.Mouse.WheelAsync(0, 10);

// 或者，以编程方式滚动特定元素
await page.GetByTestId("scrolling-container").EvaluateAsync("e => e.scrollTop += 100");
```
