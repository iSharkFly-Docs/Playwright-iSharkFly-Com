---
title: "Actions"
---

# Actions

## Introduction

Playwright can interact with HTML Input elements such as text inputs, checkboxes, radio buttons, select options, mouse clicks, type characters, keys and shortcuts as well as upload files and focus elements.

## Text input

Using [`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill) is the easiest way to fill out the form fields. It focuses the element and triggers an `input` event with the entered text. It works for `<input>`, `<textarea>` and `[contenteditable]` elements.

```csharp
// Text input
await page.GetByRole(AriaRole.Textbox).FillAsync("Peter");

// Date input
await page.GetByLabel("Birth date").FillAsync("2020-02-02");

// Time input
await page.GetByLabel("Appointment time").FillAsync("13:15");

// Local datetime input
await page.GetByLabel("Local time").FillAsync("2020-03-02T05:15");
```

## Checkboxes and radio buttons

Using [`Locator.SetCheckedAsync()`](/dotnet/api/class-locator#locator-set-checked) is the easiest way to check and uncheck a checkbox or a radio button. This method can be used with `input[type=checkbox]`, `input[type=radio]` and `[role=checkbox]` elements.

```csharp
// Check the checkbox
await page.GetByLabel("I agree to the terms above").CheckAsync();

// Assert the checked state
await Expect(page.GetByLabel("Subscribe to newsletter")).ToBeCheckedAsync();

// Select the radio button
await page.GetByLabel("XL").CheckAsync();
```

## Select options

Selects one or multiple options in the `<select>` element with [`Locator.SelectOptionAsync()`](/dotnet/api/class-locator#locator-select-option).
You can specify option `value`, or `label` to select. Multiple options can be selected.

```csharp
// Single selection matching the value or label
await page.GetByLabel("Choose a color").SelectOptionAsync("blue");

// Single selection matching the label
await page.GetByLabel("Choose a color").SelectOptionAsync(new SelectOptionValue { Label = "blue" });

// Multiple selected items
await page.GetByLabel("Choose multiple colors").SelectOptionAsync(new[] { "blue", "green", "red" });
```

## Mouse click

Performs a simple human click.

```csharp
// Generic click
await page.GetByRole(AriaRole.Button).ClickAsync();

// Double click
await page.GetByText("Item").DblClickAsync();

// Right click
await page.GetByText("Item").ClickAsync(new() { Button = MouseButton.Right });

// Shift + click
await page.GetByText("Item").ClickAsync(new() { Modifiers = new[] { KeyboardModifier.Shift } });

// Ctrl + click on Windows and Linux
// Meta + click on macOS
await page.GetByText("Item").ClickAsync(new() { Modifiers = new[] { KeyboardModifier.ControlOrMeta } });

// Hover over element
await page.GetByText("Item").HoverAsync();

// Click the top left corner
await page.GetByText("Item").ClickAsync(new() { position = new Position { X = 0, Y = 0 } });
```

Under the hood, this and other pointer-related methods:
- wait for element with given selector to be in DOM
- wait for it to become displayed, i.e. not empty, no `display:none`, no `visibility:hidden`
- wait for it to stop moving, for example, until css transition finishes
- scroll the element into view
- wait for it to receive pointer events at the action point, for example, waits until element becomes non-obscured by other elements
- retry if the element is detached during any of the above checks

#### Forcing the click

Sometimes, apps use non-trivial logic where hovering the element overlays it with another element that intercepts the click. This behavior is indistinguishable from a bug where element gets covered and the click is dispatched elsewhere. If you know this is taking place, you can bypass the [actionability](./actionability.md) checks and force the click:

```csharp
await page.GetByRole(AriaRole.Button).ClickAsync(new() { Force = true });
```

#### Programmatic click

If you are not interested in testing your app under the real conditions and want to simulate the click by any means possible, you can trigger the [`HTMLElement.click()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click) behavior via simply dispatching a click event on the element with [`Locator.DispatchEventAsync()`](/dotnet/api/class-locator#locator-dispatch-event):

```csharp
await page.GetByRole(AriaRole.Button).DispatchEventAsync("click");
```

## Type characters

::: warning
Most of the time, you should input text with [`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill). See the [Text input](#text-input) section above. You only need to type characters if there is special keyboard handling on the page.
:::

Type into the field character by character, as if it was a user with a real keyboard with [`Locator.PressSequentiallyAsync()`](/dotnet/api/class-locator#locator-press-sequentially).

```csharp
// Press keys one by one
await Page.Locator("#area").PressSequentiallyAsync("Hello World!");
```

This method will emit all the necessary keyboard events, with all the `keydown`, `keyup`, `keypress` events in place. You can even specify the optional `delay` between the key presses to simulate real user behavior.

## Keys and shortcuts

```csharp
// Hit Enter
await page.GetByText("Submit").PressAsync("Enter");

// Dispatch Control+Right
await page.GetByRole(AriaRole.Textbox).PressAsync("Control+ArrowRight");

// Press $ sign on keyboard
await page.GetByRole(AriaRole.Textbox).PressAsync("$");
```

The [`Locator.PressAsync()`](/dotnet/api/class-locator#locator-press) method focuses the selected element and produces a single keystroke. It accepts the logical key names that are emitted in the [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) property of the keyboard events:

```txt
Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape,
ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight,
ArrowUp, F1 - F12, Digit0 - Digit9, KeyA - KeyZ, etc.
```
- You can alternatively specify a single character you'd like to produce such as `"a"` or `"#"`.
- Following modification shortcuts are also supported: `Shift, Control, Alt, Meta`.

Simple version produces a single character. This character is case-sensitive, so `"a"` and `"A"` will produce different results.

```csharp
// <input id=name>
await page.Locator("#name").PressAsync("Shift+A");

// <input id=name>
await page.Locator("#name").PressAsync("Shift+ArrowLeft");
```

Shortcuts such as `"Control+o"` or `"Control+Shift+T"` are supported as well. When specified with the modifier, modifier is pressed and being held while the subsequent key is being pressed.

Note that you still need to specify the capital `A` in `Shift-A` to produce the capital character. `Shift-a` produces a lower-case one as if you had the `CapsLock` toggled.

## Upload files

You can select input files for upload using the [`Locator.SetInputFilesAsync()`](/dotnet/api/class-locator#locator-set-input-files) method. It expects first argument to point to an [input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) with the type `"file"`. Multiple files can be passed in the array. If some of the file paths are relative, they are resolved relative to the current working directory. Empty array clears the selected files.

```csharp
// Select one file
await page.GetByLabel("Upload file").SetInputFilesAsync("myfile.pdf");

// Select multiple files
await page.GetByLabel("Upload files").SetInputFilesAsync(new[] { "file1.txt", "file12.txt" });

// Select a directory
await page.GetByLabel("Upload directory").SetInputFilesAsync("mydir");

// Remove all the selected files
await page.GetByLabel("Upload file").SetInputFilesAsync(new[] {});

// Upload buffer from memory
await page.GetByLabel("Upload file").SetInputFilesAsync(new FilePayload
{
    Name = "file.txt",
    MimeType = "text/plain",
    Buffer = System.Text.Encoding.UTF8.GetBytes("this is a test"),
});
```

If you don't have input element in hand (it is created dynamically), you can handle the [`Page.FileChooser`](/dotnet/api/class-page#page-event-file-chooser) event
or use a corresponding waiting method upon your action:

```csharp
var fileChooser = page.RunAndWaitForFileChooserAsync(async () =>
{
    await page.GetByLabel("Upload file").ClickAsync();
});
await fileChooser.SetFilesAsync("myfile.pdf");
```

## Focus element

For the dynamic pages that handle focus events, you can focus the given element with [`Locator.FocusAsync()`](/dotnet/api/class-locator#locator-focus).

```csharp
await page.GetByLabel("Password").FocusAsync();
```

## Drag and Drop

You can perform drag&drop operation with [`Locator.DragToAsync()`](/dotnet/api/class-locator#locator-drag-to). This method will:
- Hover the element that will be dragged.
- Press left mouse button.
- Move mouse to the element that will receive the drop.
- Release left mouse button.

```csharp
await page.Locator("#item-to-be-dragged").DragToAsync(page.Locator("#item-to-drop-at"));
```

### Dragging manually

If you want precise control over the drag operation, use lower-level methods like [`Locator.HoverAsync()`](/dotnet/api/class-locator#locator-hover), [`Mouse.DownAsync()`](/dotnet/api/class-mouse#mouse-down), [`Mouse.MoveAsync()`](/dotnet/api/class-mouse#mouse-move) and [`Mouse.UpAsync()`](/dotnet/api/class-mouse#mouse-up).

```csharp
await page.Locator("#item-to-be-dragged").HoverAsync();
await page.Mouse.DownAsync();
await page.Locator("#item-to-drop-at").HoverAsync();
await page.Mouse.UpAsync();
```

::: info
If your page relies on the `dragover` event being dispatched, you need at least two mouse moves to trigger it in all browsers. To reliably issue the second mouse move, repeat your [`Mouse.MoveAsync()`](/dotnet/api/class-mouse#mouse-move) or [`Locator.HoverAsync()`](/dotnet/api/class-locator#locator-hover) twice. The sequence of operations would be: hover the drag element, mouse down, hover the drop element, hover the drop element second time, mouse up.
:::

## Scrolling

Most of the time, Playwright will automatically scroll for you before doing any actions. Therefore, you do not need to scroll explicitly.

```csharp
// Scrolls automatically so that button is visible
await page.GetByRole(AriaRole.Button).ClickAsync();
```

However, in rare cases you might need to manually scroll. For example, you might want to force an "infinite list" to load more elements, or position the page for a specific screenshot. In such a case, the most reliable way is to find an element that you want to make visible at the bottom, and scroll it into view.

```csharp
// Scroll the footer into view, forcing an "infinite list" to load more content
await page.GetByText("Footer text").ScrollIntoViewIfNeededAsync();
```

If you would like to control the scrolling more precisely, use [`Mouse.WheelAsync()`](/dotnet/api/class-mouse#mouse-wheel) or [`Locator.EvaluateAsync()`](/dotnet/api/class-locator#locator-evaluate):

```csharp
// Position the mouse and scroll with the mouse wheel
await page.GetByTestId("scrolling-container").HoverAsync();
await page.Mouse.WheelAsync(0, 10);

// Alternatively, programmatically scroll a specific element
await page.GetByTestId("scrolling-container").EvaluateAsync("e => e.scrollTop += 100");
```
