---
title: "自动等待"
---

# 自动等待

## 简介

Playwright 在执行操作之前会对元素执行一系列可操作性检查，以确保这些操作按预期运行。它会自动等待所有相关检查通过，然后才执行请求的操作。如果所需的检查在给定的 `timeout` 内未通过，操作将失败并抛出 `TimeoutError`。

例如，对于 [`locator.click()`](/python/api/class-locator#locator-click)，Playwright 将确保：
- locator 精确解析到一个元素
- 元素是[可见的]
- 元素是[稳定的]，即没有在动画中或已完成动画
- 元素[可接收事件]，即没有被其他元素遮挡
- 元素是[启用的]
- 元素[非惰性]

以下是每个操作执行的可操作性检查的完整列表：

| 操作 | [可见的] | [稳定的] | [可接收事件] | [启用的] | [可编辑的] | [非惰性] |
| :- | :-: | :-: | :-: | :-: | :-: | :-: |
| [`locator.check()`](/python/api/class-locator#locator-check) | 是 | 是 | 是 | 是 | - | 是 |
| [`locator.click()`](/python/api/class-locator#locator-click) | 是 | 是 | 是 | 是 | - | 是 |
| [`locator.dblclick()`](/python/api/class-locator#locator-dblclick) | 是 | 是 | 是 | 是 | - | 是 |
| [`locator.set_checked()`](/python/api/class-locator#locator-set-checked) | 是 | 是 | 是 | 是 | - | 是 |
| [`locator.tap()`](/python/api/class-locator#locator-tap) | 是 | 是 | 是 | 是 | - | 是 |
| [`locator.uncheck()`](/python/api/class-locator#locator-uncheck) | 是 | 是 | 是 | 是 | - | 是 |
| [`locator.hover()`](/python/api/class-locator#locator-hover) | 是 | 是 | 是 | - | - | - |
| [`locator.drag_to()`](/python/api/class-locator#locator-drag-to) | 是 | 是 | 是 | - | - | - |
| [`locator.screenshot()`](/python/api/class-locator#locator-screenshot) | 是 | 是 | - | - | - | - |
| [`locator.fill()`](/python/api/class-locator#locator-fill) | 是 | - | - | 是 | 是 | 是 |
| [`locator.clear()`](/python/api/class-locator#locator-clear) | 是 | - | - | 是 | 是 | 是 |
| [`locator.select_option()`](/python/api/class-locator#locator-select-option) | 是 | - | - | 是 | - | 是 |
| [`locator.select_text()`](/python/api/class-locator#locator-select-text) | 是 | - | - | - | - | - |
| [`locator.scroll_into_view_if_needed()`](/python/api/class-locator#locator-scroll-into-view-if-needed) | - | 是 | - | - | - | - |
| [`locator.blur()`](/python/api/class-locator#locator-blur) | - | - | - | - | - | - |
| [`locator.dispatch_event()`](/python/api/class-locator#locator-dispatch-event) | - | - | - | - | - | - |
| [`locator.focus()`](/python/api/class-locator#locator-focus) | - | - | - | - | - | - |
| [`locator.press()`](/python/api/class-locator#locator-press) | - | - | - | - | - | - |
| [`locator.press_sequentially()`](/python/api/class-locator#locator-press-sequentially) | - | - | - | - | - | - |
| [`locator.set_input_files()`](/python/api/class-locator#locator-set-input-files) | - | - | - | - | - | - |

## 强制执行操作

某些操作如 [`locator.click()`](/python/api/class-locator#locator-click) 支持 `force` 选项，该选项会禁用非必要的可操作性检查，例如将 `force` 设为 true 传递给 [`locator.click()`](/python/api/class-locator#locator-click) 方法将不会检查目标元素是否实际接收点击事件。

## 断言

Playwright 包含自动重试的断言，通过等待直到条件满足来消除不稳定性，类似于操作前的自动等待。

| 断言 | 描述 |
| :- | :- |
| [`locator_assertions.to_be_attached()`](/python/api/class-locatorassertions#locator-assertions-to-be-attached) | 元素已附加 |
| [`locator_assertions.to_be_checked()`](/python/api/class-locatorassertions#locator-assertions-to-be-checked) | 复选框已选中 |
| [`locator_assertions.to_be_disabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-disabled) | 元素已禁用 |
| [`locator_assertions.to_be_editable()`](/python/api/class-locatorassertions#locator-assertions-to-be-editable) | 元素可编辑 |
| [`locator_assertions.to_be_empty()`](/python/api/class-locatorassertions#locator-assertions-to-be-empty) | 容器为空 |
| [`locator_assertions.to_be_enabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-enabled) | 元素已启用 |
| [`locator_assertions.to_be_focused()`](/python/api/class-locatorassertions#locator-assertions-to-be-focused) | 元素已聚焦 |
| [`locator_assertions.to_be_hidden()`](/python/api/class-locatorassertions#locator-assertions-to-be-hidden) | 元素不可见 |
| [`locator_assertions.to_be_in_viewport()`](/python/api/class-locatorassertions#locator-assertions-to-be-in-viewport) | 元素与视口相交 |
| [`locator_assertions.to_be_visible()`](/python/api/class-locatorassertions#locator-assertions-to-be-visible) | 元素可见 |
| [`locator_assertions.to_contain_text()`](/python/api/class-locatorassertions#locator-assertions-to-contain-text) | 元素包含文本 |
| [`locator_assertions.to_have_attribute()`](/python/api/class-locatorassertions#locator-assertions-to-have-attribute) | 元素有 DOM 属性 |
| [`locator_assertions.to_have_class()`](/python/api/class-locatorassertions#locator-assertions-to-have-class) | 元素有 class 属性 |
| [`locator_assertions.to_have_count()`](/python/api/class-locatorassertions#locator-assertions-to-have-count) | 列表有确切数量的子元素 |
| [`locator_assertions.to_have_css()`](/python/api/class-locatorassertions#locator-assertions-to-have-css) | 元素有 CSS 属性 |
| [`locator_assertions.to_have_id()`](/python/api/class-locatorassertions#locator-assertions-to-have-id) | 元素有 ID |
| [`locator_assertions.to_have_js_property()`](/python/api/class-locatorassertions#locator-assertions-to-have-js-property) | 元素有 JavaScript 属性 |
| [`locator_assertions.to_have_text()`](/python/api/class-locatorassertions#locator-assertions-to-have-text) | 元素匹配文本 |
| [`locator_assertions.to_have_value()`](/python/api/class-locatorassertions#locator-assertions-to-have-value) | 输入框有值 |
| [`locator_assertions.to_have_values()`](/python/api/class-locatorassertions#locator-assertions-to-have-values) | 选择框有选中的选项 |
| [`page_assertions.to_have_title()`](/python/api/class-pageassertions#page-assertions-to-have-title) | 页面有标题 |
| [`page_assertions.to_have_url()`](/python/api/class-pageassertions#page-assertions-to-have-url) | 页面有 URL |
| [`api_response_assertions.to_be_ok()`](/python/api/class-apiresponseassertions#api-response-assertions-to-be-ok) | 响应状态为 OK |

在[断言指南](./test-assertions.md)中了解更多。

## 可见的

当元素具有非空边界框且没有 `visibility:hidden` 计算样式时，被认为是可见的。

请注意，根据此定义：
* 零尺寸的元素**不被**认为是可见的。
* 具有 `display:none` 的元素**不被**认为是可见的。
* 具有 `opacity:0` 的元素**被**认为是可见的。

## 稳定的

当元素在至少两个连续动画帧中保持相同的边界框时，被认为是稳定的。

## 启用的

当元素**未禁用**时，被认为是启用的。

元素在以下情况下是**禁用的**：
- 它是具有 `[disabled]` 属性的 `<button>`、`<select>`、`<input>`、`<textarea>`、`<option>` 或 `<optgroup>`；
- 它是具有 `[disabled]` 属性的 `<fieldset>` 的一部分的 `<button>`、`<select>`、`<input>`、`<textarea>`、`<option>` 或 `<optgroup>`；
- 它是具有 `[aria-disabled=true]` 属性的元素的后代。

## 可编辑的

当元素是[启用的]且**非只读**时，被认为是可编辑的。

元素在以下情况下是**只读的**：
- 它是具有 `[readonly]` 属性的 `<select>`、`<input>` 或 `<textarea>`；
- 它具有 `[aria-readonly=true]` 属性和[支持它](https://w3c.github.io/aria/#aria-readonly)的 aria 角色。

## 非惰性

当元素**不是**惰性子树的一部分时，被认为是非惰性的。惰性元素无法被聚焦、点击或以其他方式交互。

元素在以下情况下是**惰性的**：
- 它是具有 [`inert`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert) 属性的元素，或此类元素的后代。

## 可接收事件

当元素是操作点处指针事件的命中目标时，被认为可以接收指针事件。例如，当在点 `(10;10)` 处点击时，Playwright 会检查是否有其他元素（通常是覆盖层）会在 `(10;10)` 处捕获点击。

例如，考虑一个场景，无论 [`locator.click()`](/python/api/class-locator#locator-click) 调用是在什么时候进行的，Playwright 都会点击 `Sign Up` 按钮：
- 页面正在检查用户名是否唯一，`Sign Up` 按钮被禁用；
- 在与服务器检查后，禁用的 `Sign Up` 按钮被替换为另一个现在启用的按钮。

[可见的]: #可见的 "可见的"
[稳定的]: #稳定的 "稳定的"
[启用的]: #启用的 "启用的"
[可编辑的]: #可编辑的 "可编辑的"
[可接收事件]: #可接收事件 "可接收事件"
[非惰性]: #非惰性 "非惰性"
