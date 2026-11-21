---
title: "自动等待"
---

# 自动等待

## 简介

Playwright 在执行操作之前会对元素执行一系列可操作性检查，以确保这些操作按预期运行。它会自动等待所有相关检查通过，然后才执行请求的操作。如果所需的检查在给定的 `timeout` 内没有通过，操作将失败并抛出 `TimeoutError`。

例如，对于 [`locator.click()`](/api/class-locator#locator-click)，Playwright 会确保：
- locator 解析到恰好一个元素
- 元素是[可见的]
- 元素是[稳定的]，即没有在执行动画或动画已完成
- 元素[接收事件]，即没有被其他元素遮挡
- 元素是[启用的]
- 元素[非惰性]

以下是每个操作执行的可操作性检查的完整列表：

| 操作 | [可见的] | [稳定的] | [接收事件] | [启用的] | [可编辑的] | [非惰性] |
| :- | :-: | :-: | :-: | :-: | :-: | :-: |
| [`locator.check()`](/api/class-locator#locator-check) | 是 | 是 | 是 | 是 | - | 是 |
| [`locator.click()`](/api/class-locator#locator-click) | 是 | 是 | 是 | 是 | - | 是 |
| [`locator.dblclick()`](/api/class-locator#locator-dblclick) | 是 | 是 | 是 | 是 | - | 是 |
| [`locator.setChecked()`](/api/class-locator#locator-set-checked) | 是 | 是 | 是 | 是 | - | 是 |
| [`locator.tap()`](/api/class-locator#locator-tap) | 是 | 是 | 是 | 是 | - | 是 |
| [`locator.uncheck()`](/api/class-locator#locator-uncheck) | 是 | 是 | 是 | 是 | - | 是 |
| [`locator.hover()`](/api/class-locator#locator-hover) | 是 | 是 | 是 | - | - | - |
| [`locator.dragTo()`](/api/class-locator#locator-drag-to) | 是 | 是 | 是 | - | - | - |
| [`locator.screenshot()`](/api/class-locator#locator-screenshot) | 是 | 是 | - | - | - | - |
| [`locator.fill()`](/api/class-locator#locator-fill) | 是 | - | - | 是 | 是 | 是 |
| [`locator.clear()`](/api/class-locator#locator-clear) | 是 | - | - | 是 | 是 | 是 |
| [`locator.selectOption()`](/api/class-locator#locator-select-option) | 是 | - | - | 是 | - | 是 |
| [`locator.selectText()`](/api/class-locator#locator-select-text) | 是 | - | - | - | - | - |
| [`locator.scrollIntoViewIfNeeded()`](/api/class-locator#locator-scroll-into-view-if-needed) | - | 是 | - | - | - | - |
| [`locator.blur()`](/api/class-locator#locator-blur) | - | - | - | - | - | - |
| [`locator.dispatchEvent()`](/api/class-locator#locator-dispatch-event) | - | - | - | - | - | - |
| [`locator.focus()`](/api/class-locator#locator-focus) | - | - | - | - | - | - |
| [`locator.press()`](/api/class-locator#locator-press) | - | - | - | - | - | - |
| [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially) | - | - | - | - | - | - |
| [`locator.setInputFiles()`](/api/class-locator#locator-set-input-files) | - | - | - | - | - | - |

## 强制操作

一些操作如 [`locator.click()`](/api/class-locator#locator-click) 支持 `force` 选项，该选项禁用非必要的可操作性检查。例如，向 [`locator.click()`](/api/class-locator#locator-click) 方法传递 truthy 的 `force` 值将不检查目标元素是否实际接收点击事件。

## 断言

Playwright 包含自动重试的断言，通过等待条件满足来消除测试的不稳定性，类似于操作前的自动等待。

| 断言 | 描述 |
| :- | :- |
| [`locatorAssertions.toBeAttached()`](/api/class-locatorassertions#locator-assertions-to-be-attached) | 元素已附加到 DOM |
| [`locatorAssertions.toBeChecked()`](/api/class-locatorassertions#locator-assertions-to-be-checked) | 复选框已选中 |
| [`locatorAssertions.toBeDisabled()`](/api/class-locatorassertions#locator-assertions-to-be-disabled) | 元素已禁用 |
| [`locatorAssertions.toBeEditable()`](/api/class-locatorassertions#locator-assertions-to-be-editable) | 元素可编辑 |
| [`locatorAssertions.toBeEmpty()`](/api/class-locatorassertions#locator-assertions-to-be-empty) | 容器为空 |
| [`locatorAssertions.toBeEnabled()`](/api/class-locatorassertions#locator-assertions-to-be-enabled) | 元素已启用 |
| [`locatorAssertions.toBeFocused()`](/api/class-locatorassertions#locator-assertions-to-be-focused) | 元素已获得焦点 |
| [`locatorAssertions.toBeHidden()`](/api/class-locatorassertions#locator-assertions-to-be-hidden) | 元素不可见 |
| [`locatorAssertions.toBeInViewport()`](/api/class-locatorassertions#locator-assertions-to-be-in-viewport) | 元素与视口相交 |
| [`locatorAssertions.toBeVisible()`](/api/class-locatorassertions#locator-assertions-to-be-visible) | 元素可见 |
| [`locatorAssertions.toContainText()`](/api/class-locatorassertions#locator-assertions-to-contain-text) | 元素包含文本 |
| [`locatorAssertions.toHaveAttribute()`](/api/class-locatorassertions#locator-assertions-to-have-attribute) | 元素具有 DOM 属性 |
| [`locatorAssertions.toHaveClass()`](/api/class-locatorassertions#locator-assertions-to-have-class) | 元素具有 class 属性 |
| [`locatorAssertions.toHaveCount()`](/api/class-locatorassertions#locator-assertions-to-have-count) | 列表具有确切数量的子元素 |
| [`locatorAssertions.toHaveCSS()`](/api/class-locatorassertions#locator-assertions-to-have-css) | 元素具有 CSS 属性 |
| [`locatorAssertions.toHaveId()`](/api/class-locatorassertions#locator-assertions-to-have-id) | 元素具有 ID |
| [`locatorAssertions.toHaveJSProperty()`](/api/class-locatorassertions#locator-assertions-to-have-js-property) | 元素具有 JavaScript 属性 |
| [`locatorAssertions.toHaveText()`](/api/class-locatorassertions#locator-assertions-to-have-text) | 元素匹配文本 |
| [`locatorAssertions.toHaveValue()`](/api/class-locatorassertions#locator-assertions-to-have-value) | 输入框具有值 |
| [`locatorAssertions.toHaveValues()`](/api/class-locatorassertions#locator-assertions-to-have-values) | 选择框已选择选项 |
| [`pageAssertions.toHaveTitle()`](/api/class-pageassertions#page-assertions-to-have-title) | 页面具有标题 |
| [`pageAssertions.toHaveURL()`](/api/class-pageassertions#page-assertions-to-have-url) | 页面具有 URL |
| [`apiResponseAssertions.toBeOK()`](/api/class-apiresponseassertions#api-response-assertions-to-be-ok) | 响应具有 OK 状态 |

在[断言指南](./test-assertions.md)中了解更多。

## 可见的

当元素具有非空边界框且没有 `visibility:hidden` 计算样式时，该元素被认为是可见的。

请注意，根据此定义：
* 大小为零的元素**不**被认为是可见的。
* 具有 `display:none` 的元素**不**被认为是可见的。
* 具有 `opacity:0` 的元素**被**认为是可见的。

## 稳定的

当元素在至少两个连续的动画帧中保持相同的边界框时，该元素被认为是稳定的。

## 启用的

当元素**未被禁用**时，该元素被认为是启用的。

元素在以下情况下**被禁用**：
- 它是具有 `[disabled]` 属性的 `<button>`、`<select>`、`<input>`、`<textarea>`、`<option>` 或 `<optgroup>`；
- 它是属于具有 `[disabled]` 属性的 `<fieldset>` 的 `<button>`、`<select>`、`<input>`、`<textarea>`、`<option>` 或 `<optgroup>`；
- 它是具有 `[aria-disabled=true]` 属性的元素的后代。

## 可编辑的

当元素是[启用的]且**不是只读的**时，该元素被认为是可编辑的。

元素在以下情况下**是只读的**：
- 它是具有 `[readonly]` 属性的 `<select>`、`<input>` 或 `<textarea>`；
- 它具有 `[aria-readonly=true]` 属性和[支持该属性](https://w3c.github.io/aria/#aria-readonly)的 aria 角色。

## 非惰性

当元素**不是**惰性子树的一部分时，该元素被认为是非惰性的。惰性元素无法被聚焦、点击或进行其他交互。

元素在以下情况下**是惰性的**：
- 它是具有 [`inert`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert) 属性的元素，或此类元素的后代。

## 接收事件

当元素是操作点处指针事件的命中目标时，该元素被认为能够接收指针事件。例如，当在点 `(10;10)` 处点击时，Playwright 会检查是否有其他元素（通常是遮罩层）会在 `(10;10)` 处捕获点击。

例如，考虑这样一个场景，无论 [`locator.click()`](/api/class-locator#locator-click) 调用是何时发起的，Playwright 都会点击 `Sign Up` 按钮：
- 页面正在检查用户名是否唯一，`Sign Up` 按钮被禁用；
- 在与服务器确认后，被禁用的 `Sign Up` 按钮被替换为另一个现在已启用的按钮。

[可见的]: #可见的 "可见的"
[稳定的]: #稳定的 "稳定的"
[启用的]: #启用的 "启用的"
[可编辑的]: #可编辑的 "可编辑的"
[接收事件]: #接收事件 "接收事件"
[非惰性]: #非惰性 "非惰性"
