---
title: "自动等待"
---

# 自动等待

## 简介

Playwright 在执行操作之前会对元素进行一系列可操作性检查，以确保这些操作按预期执行。它会自动等待所有相关检查通过后才执行请求的操作。如果在给定的 `timeout` 内所需检查未能通过，操作将失败并抛出 `TimeoutError`。

例如，对于 [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click)，Playwright 将确保：
- 定位器精确解析到一个元素
- 元素是[可见的]
- 元素是[稳定的]，即没有动画或动画已完成
- 元素[可接收事件]，即没有被其他元素遮挡
- 元素是[启用的]
- 元素[非惰性]

以下是每个操作执行的可操作性检查完整列表：

| 操作 | [可见的] | [稳定的] | [可接收事件] | [启用的] | [可编辑] | [非惰性] |
| :- | :-: | :-: | :-: | :-: | :-: | :-: |
| [`Locator.CheckAsync()`](/dotnet/api/class-locator#locator-check) | 是 | 是 | 是 | 是 | - | 是 |
| [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) | 是 | 是 | 是 | 是 | - | 是 |
| [`Locator.DblClickAsyncAsync()`](/dotnet/api/class-locator#locator-dblclick) | 是 | 是 | 是 | 是 | - | 是 |
| [`Locator.SetCheckedAsync()`](/dotnet/api/class-locator#locator-set-checked) | 是 | 是 | 是 | 是 | - | 是 |
| [`Locator.TapAsync()`](/dotnet/api/class-locator#locator-tap) | 是 | 是 | 是 | 是 | - | 是 |
| [`Locator.UncheckAsync()`](/dotnet/api/class-locator#locator-uncheck) | 是 | 是 | 是 | 是 | - | 是 |
| [`Locator.HoverAsync()`](/dotnet/api/class-locator#locator-hover) | 是 | 是 | 是 | - | - | - |
| [`Locator.DragToAsync()`](/dotnet/api/class-locator#locator-drag-to) | 是 | 是 | 是 | - | - | - |
| [`Locator.ScreenshotAsync()`](/dotnet/api/class-locator#locator-screenshot) | 是 | 是 | - | - | - | - |
| [`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill) | 是 | - | - | 是 | 是 | 是 |
| [`Locator.ClearAsync()`](/dotnet/api/class-locator#locator-clear) | 是 | - | - | 是 | 是 | 是 |
| [`Locator.SelectOptionAsync()`](/dotnet/api/class-locator#locator-select-option) | 是 | - | - | 是 | - | 是 |
| [`Locator.SelectTextAsync()`](/dotnet/api/class-locator#locator-select-text) | 是 | - | - | - | - | - |
| [`Locator.ScrollIntoViewIfNeededAsync()`](/dotnet/api/class-locator#locator-scroll-into-view-if-needed) | - | 是 | - | - | - | - |
| [`Locator.BlurAsync()`](/dotnet/api/class-locator#locator-blur) | - | - | - | - | - | - |
| [`Locator.DispatchEventAsync()`](/dotnet/api/class-locator#locator-dispatch-event) | - | - | - | - | - | - |
| [`Locator.FocusAsync()`](/dotnet/api/class-locator#locator-focus) | - | - | - | - | - | - |
| [`Locator.PressAsync()`](/dotnet/api/class-locator#locator-press) | - | - | - | - | - | - |
| [`Locator.PressSequentiallyAsync()`](/dotnet/api/class-locator#locator-press-sequentially) | - | - | - | - | - | - |
| [`Locator.SetInputFilesAsync()`](/dotnet/api/class-locator#locator-set-input-files) | - | - | - | - | - | - |

## 强制操作

某些操作如 [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) 支持 `force` 选项，可禁用非必要的可操作性检查。例如，向 [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) 方法传递 truthy 的 `force` 将不会检查目标元素是否实际接收点击事件。

## 断言

Playwright 包含自动重试断言，通过等待条件满足来消除不稳定性，类似于操作前的自动等待。

| 断言 | 描述 |
| :- | :- |
| [`LocatorAssertions.ToBeAttachedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-attached) | 元素已附加 |
| [`LocatorAssertions.ToBeCheckedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-checked) | 复选框已选中 |
| [`LocatorAssertions.ToBeDisabledAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-disabled) | 元素已禁用 |
| [`LocatorAssertions.ToBeEditableAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-editable) | 元素可编辑 |
| [`LocatorAssertions.ToBeEmptyAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-empty) | 容器为空 |
| [`LocatorAssertions.ToBeEnabledAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-enabled) | 元素已启用 |
| [`LocatorAssertions.ToBeFocusedAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-focused) | 元素已获得焦点 |
| [`LocatorAssertions.ToBeHiddenAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-hidden) | 元素不可见 |
| [`LocatorAssertions.ToBeInViewportAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-in-viewport) | 元素与视口相交 |
| [`LocatorAssertions.ToBeVisibleAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-be-visible) | 元素可见 |
| [`LocatorAssertions.ToContainTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-contain-text) | 元素包含文本 |
| [`LocatorAssertions.ToHaveAttributeAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-attribute) | 元素具有 DOM 属性 |
| [`LocatorAssertions.ToHaveClassAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-class) | 元素具有 class 属性 |
| [`LocatorAssertions.ToHaveCountAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-count) | 列表有精确数量的子元素 |
| [`LocatorAssertions.ToHaveCSSAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-css) | 元素具有 CSS 属性 |
| [`LocatorAssertions.ToHaveIdAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-id) | 元素具有 ID |
| [`LocatorAssertions.ToHaveJSPropertyAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-js-property) | 元素具有 JavaScript 属性 |
| [`LocatorAssertions.ToHaveTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text) | 元素匹配文本 |
| [`LocatorAssertions.ToHaveValueAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-value) | 输入框有值 |
| [`LocatorAssertions.ToHaveValuesAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-values) | 选择框有选中的选项 |
| [`PageAssertions.ToHaveTitleAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-have-title) | 页面有标题 |
| [`PageAssertions.ToHaveURLAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-have-url) | 页面有 URL |
| [`ApiResponseAssertions.ToBeOKAsync()`](/dotnet/api/class-apiresponseassertions#api-response-assertions-to-be-ok) | 响应状态为 OK |

在[断言指南](./test-assertions.md)中了解更多。

## 可见的

当元素具有非空边界框且没有 `visibility:hidden` 计算样式时，该元素被认为是可见的。

请注意，根据此定义：
* 零尺寸的元素**不被**认为是可见的。
* 具有 `display:none` 的元素**不被**认为是可见的。
* 具有 `opacity:0` 的元素**被**认为是可见的。

## 稳定的

当元素在至少两个连续的动画帧中保持相同的边界框时，该元素被认为是稳定的。

## 启用的

当元素**未被禁用**时，该元素被认为是启用的。

元素在以下情况下**被禁用**：
- 它是带有 `[disabled]` 属性的 `<button>`、`<select>`、`<input>`、`<textarea>`、`<option>` 或 `<optgroup>`；
- 它是带有 `[disabled]` 属性的 `<fieldset>` 的一部分的 `<button>`、`<select>`、`<input>`、`<textarea>`、`<option>` 或 `<optgroup>`；
- 它是具有 `[aria-disabled=true]` 属性的元素的后代。

## 可编辑

当元素是[启用的]且**不是只读**时，该元素被认为是可编辑的。

元素在以下情况下是**只读**的：
- 它是带有 `[readonly]` 属性的 `<select>`、`<input>` 或 `<textarea>`；
- 它具有 `[aria-readonly=true]` 属性和[支持它](https://w3c.github.io/aria/#aria-readonly)的 aria 角色。

## 非惰性

当元素**不是**惰性子树的一部分时，该元素被认为是非惰性的。惰性元素无法获得焦点、点击或进行其他交互。

元素在以下情况下是**惰性**的：
- 它是具有 [`inert`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert) 属性的元素，或此类元素的后代。

## 可接收事件

当元素是操作点处指针事件的命中目标时，该元素被认为可接收指针事件。例如，在点 `(10;10)` 处点击时，Playwright 会检查是否有其他元素（通常是遮罩层）会在 `(10;10)` 处捕获点击。

例如，考虑一个场景，无论何时调用 [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click)，Playwright 都将点击 `Sign Up` 按钮：
- 页面正在检查用户名是否唯一，且 `Sign Up` 按钮被禁用；
- 在与服务器检查后，被禁用的 `Sign Up` 按钮被替换为另一个现在启用的按钮。

[可见的]: #可见的 "可见的"
[稳定的]: #稳定的 "稳定的"
[启用的]: #启用的 "启用的"
[可编辑]: #可编辑 "可编辑"
[可接收事件]: #可接收事件 "可接收事件"
[非惰性]: #非惰性 "非惰性"
