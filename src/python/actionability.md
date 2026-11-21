---
title: "Auto-waiting"
---

# Auto-waiting

## Introduction

Playwright performs a range of actionability checks on the elements before making actions to ensure these actions
behave as expected. It auto-waits for all the relevant checks to pass and only then performs the requested action. If the required checks do not pass within the given `timeout`, action fails with the `TimeoutError`.

For example, for [`locator.click()`](/python/api/class-locator#locator-click), Playwright will ensure that:
- locator resolves to exactly one element
- element is [Visible]
- element is [Stable], as in not animating or completed animation
- element [Receives Events], as in not obscured by other elements
- element is [Enabled]
- element is [Not Inert]

Here is the complete list of actionability checks performed for each action:

| Action | [Visible] | [Stable] | [Receives Events] | [Enabled] | [Editable] | [Not Inert] |
| :- | :-: | :-: | :-: | :-: | :-: | :-: |
| [`locator.check()`](/python/api/class-locator#locator-check) | Yes | Yes | Yes | Yes | - | Yes |
| [`locator.click()`](/python/api/class-locator#locator-click) | Yes | Yes | Yes | Yes | - | Yes |
| [`locator.dblclick()`](/python/api/class-locator#locator-dblclick) | Yes | Yes | Yes | Yes | - | Yes |
| [`locator.set_checked()`](/python/api/class-locator#locator-set-checked) | Yes | Yes | Yes | Yes | - | Yes |
| [`locator.tap()`](/python/api/class-locator#locator-tap) | Yes | Yes | Yes | Yes | - | Yes |
| [`locator.uncheck()`](/python/api/class-locator#locator-uncheck) | Yes | Yes | Yes | Yes | - | Yes |
| [`locator.hover()`](/python/api/class-locator#locator-hover) | Yes | Yes | Yes | - | - | - |
| [`locator.drag_to()`](/python/api/class-locator#locator-drag-to) | Yes | Yes | Yes | - | - | - |
| [`locator.screenshot()`](/python/api/class-locator#locator-screenshot) | Yes | Yes | - | - | - | - |
| [`locator.fill()`](/python/api/class-locator#locator-fill) | Yes | - | - | Yes | Yes | Yes |
| [`locator.clear()`](/python/api/class-locator#locator-clear) | Yes | - | - | Yes | Yes | Yes |
| [`locator.select_option()`](/python/api/class-locator#locator-select-option) | Yes | - | - | Yes | - | Yes |
| [`locator.select_text()`](/python/api/class-locator#locator-select-text) | Yes | - | - | - | - | - |
| [`locator.scroll_into_view_if_needed()`](/python/api/class-locator#locator-scroll-into-view-if-needed) | - | Yes | - | - | - | - |
| [`locator.blur()`](/python/api/class-locator#locator-blur) | - | - | - | - | - | - |
| [`locator.dispatch_event()`](/python/api/class-locator#locator-dispatch-event) | - | - | - | - | - | - |
| [`locator.focus()`](/python/api/class-locator#locator-focus) | - | - | - | - | - | - |
| [`locator.press()`](/python/api/class-locator#locator-press) | - | - | - | - | - | - |
| [`locator.press_sequentially()`](/python/api/class-locator#locator-press-sequentially) | - | - | - | - | - | - |
| [`locator.set_input_files()`](/python/api/class-locator#locator-set-input-files) | - | - | - | - | - | - |

## Forcing actions

Some actions like [`locator.click()`](/python/api/class-locator#locator-click) support `force` option that disables non-essential actionability checks,
for example passing truthy `force` to [`locator.click()`](/python/api/class-locator#locator-click) method will not check that the target element actually
receives click events.

## Assertions

Playwright includes auto-retrying assertions that remove flakiness by waiting until the condition is met, similarly to auto-waiting before actions.

| Assertion | Description |
| :- | :- |
| [`locator_assertions.to_be_attached()`](/python/api/class-locatorassertions#locator-assertions-to-be-attached) | Element is attached |
| [`locator_assertions.to_be_checked()`](/python/api/class-locatorassertions#locator-assertions-to-be-checked) | Checkbox is checked |
| [`locator_assertions.to_be_disabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-disabled) | Element is disabled |
| [`locator_assertions.to_be_editable()`](/python/api/class-locatorassertions#locator-assertions-to-be-editable) | Element is editable |
| [`locator_assertions.to_be_empty()`](/python/api/class-locatorassertions#locator-assertions-to-be-empty) | Container is empty |
| [`locator_assertions.to_be_enabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-enabled) | Element is enabled |
| [`locator_assertions.to_be_focused()`](/python/api/class-locatorassertions#locator-assertions-to-be-focused) | Element is focused |
| [`locator_assertions.to_be_hidden()`](/python/api/class-locatorassertions#locator-assertions-to-be-hidden) | Element is not visible |
| [`locator_assertions.to_be_in_viewport()`](/python/api/class-locatorassertions#locator-assertions-to-be-in-viewport) | Element intersects viewport |
| [`locator_assertions.to_be_visible()`](/python/api/class-locatorassertions#locator-assertions-to-be-visible) | Element is visible |
| [`locator_assertions.to_contain_text()`](/python/api/class-locatorassertions#locator-assertions-to-contain-text) | Element contains text |
| [`locator_assertions.to_have_attribute()`](/python/api/class-locatorassertions#locator-assertions-to-have-attribute) | Element has a DOM attribute |
| [`locator_assertions.to_have_class()`](/python/api/class-locatorassertions#locator-assertions-to-have-class) | Element has a class property |
| [`locator_assertions.to_have_count()`](/python/api/class-locatorassertions#locator-assertions-to-have-count) | List has exact number of children |
| [`locator_assertions.to_have_css()`](/python/api/class-locatorassertions#locator-assertions-to-have-css) | Element has CSS property |
| [`locator_assertions.to_have_id()`](/python/api/class-locatorassertions#locator-assertions-to-have-id) | Element has an ID |
| [`locator_assertions.to_have_js_property()`](/python/api/class-locatorassertions#locator-assertions-to-have-js-property) | Element has a JavaScript property |
| [`locator_assertions.to_have_text()`](/python/api/class-locatorassertions#locator-assertions-to-have-text) | Element matches text |
| [`locator_assertions.to_have_value()`](/python/api/class-locatorassertions#locator-assertions-to-have-value) | Input has a value |
| [`locator_assertions.to_have_values()`](/python/api/class-locatorassertions#locator-assertions-to-have-values) | Select has options selected |
| [`page_assertions.to_have_title()`](/python/api/class-pageassertions#page-assertions-to-have-title) | Page has a title |
| [`page_assertions.to_have_url()`](/python/api/class-pageassertions#page-assertions-to-have-url) | Page has a URL |
| [`api_response_assertions.to_be_ok()`](/python/api/class-apiresponseassertions#api-response-assertions-to-be-ok) | Response has an OK status |

Learn more in the [assertions guide](./test-assertions.md).

## Visible

Element is considered visible when it has non-empty bounding box and does not have `visibility:hidden` computed style.

Note that according to this definition:
* Elements of zero size **are not** considered visible.
* Elements with `display:none` **are not** considered visible.
* Elements with `opacity:0` **are** considered visible.

## Stable

Element is considered stable when it has maintained the same bounding box for at least two consecutive animation frames.

## Enabled

Element is considered enabled when it is **not disabled**.

Element is **disabled** when:
- it is a `<button>`, `<select>`, `<input>`, `<textarea>`, `<option>` or `<optgroup>` with a `[disabled]` attribute;
- it is a `<button>`, `<select>`, `<input>`, `<textarea>`, `<option>` or `<optgroup>` that is a part of a `<fieldset>` with a `[disabled]` attribute;
- it is a descendant of an element with `[aria-disabled=true]` attribute.

## Editable

Element is considered editable when it is [enabled] and is **not readonly**.

Element is **readonly** when:
- it is a `<select>`, `<input>` or `<textarea>` with a `[readonly]` attribute;
- it has an `[aria-readonly=true]` attribute and an aria role that [supports it](https://w3c.github.io/aria/#aria-readonly).

## Not Inert

Element is considered not inert when it is **not** a part of an inert subtree. Inert elements cannot be focused, clicked or otherwise interacted with.

Element is **inert** when:
- it is an element with the [`inert`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert) attribute, or a descendant of such an element.

## Receives Events

Element is considered receiving pointer events when it is the hit target of the pointer event at the action point. For example, when clicking at the point `(10;10)`, Playwright checks whether some other element (usually an overlay) will instead capture the click at `(10;10)`.

For example, consider a scenario where Playwright will click `Sign Up` button regardless of when the [`locator.click()`](/python/api/class-locator#locator-click) call was made:
- page is checking that user name is unique and `Sign Up` button is disabled;
- after checking with the server, the disabled `Sign Up` button is replaced with another one that is now enabled.

[Visible]: #visible "Visible"
[Stable]: #stable "Stable"
[Enabled]: #enabled "Enabled"
[Editable]: #editable "Editable"
[Receives Events]: #receives-events "Receives Events"
[Not Inert]: #not-inert "Not Inert"
