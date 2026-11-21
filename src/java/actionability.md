---
title: "Auto-waiting"
---

# Auto-waiting

## Introduction

Playwright performs a range of actionability checks on the elements before making actions to ensure these actions
behave as expected. It auto-waits for all the relevant checks to pass and only then performs the requested action. If the required checks do not pass within the given `timeout`, action fails with the `TimeoutError`.

For example, for [`locator.click()`](/java/api/class-locator#locator-click), Playwright will ensure that:
- locator resolves to exactly one element
- element is [Visible]
- element is [Stable], as in not animating or completed animation
- element [Receives Events], as in not obscured by other elements
- element is [Enabled]
- element is [Not Inert]

Here is the complete list of actionability checks performed for each action:

| Action | [Visible] | [Stable] | [Receives Events] | [Enabled] | [Editable] | [Not Inert] |
| :- | :-: | :-: | :-: | :-: | :-: | :-: |
| [`locator.check()`](/java/api/class-locator#locator-check) | Yes | Yes | Yes | Yes | - | Yes |
| [`locator.click()`](/java/api/class-locator#locator-click) | Yes | Yes | Yes | Yes | - | Yes |
| [`locator.dblclick()`](/java/api/class-locator#locator-dblclick) | Yes | Yes | Yes | Yes | - | Yes |
| [`locator.setChecked()`](/java/api/class-locator#locator-set-checked) | Yes | Yes | Yes | Yes | - | Yes |
| [`locator.tap()`](/java/api/class-locator#locator-tap) | Yes | Yes | Yes | Yes | - | Yes |
| [`locator.uncheck()`](/java/api/class-locator#locator-uncheck) | Yes | Yes | Yes | Yes | - | Yes |
| [`locator.hover()`](/java/api/class-locator#locator-hover) | Yes | Yes | Yes | - | - | - |
| [`locator.dragTo()`](/java/api/class-locator#locator-drag-to) | Yes | Yes | Yes | - | - | - |
| [`locator.screenshot()`](/java/api/class-locator#locator-screenshot) | Yes | Yes | - | - | - | - |
| [`locator.fill()`](/java/api/class-locator#locator-fill) | Yes | - | - | Yes | Yes | Yes |
| [`locator.clear()`](/java/api/class-locator#locator-clear) | Yes | - | - | Yes | Yes | Yes |
| [`locator.selectOption()`](/java/api/class-locator#locator-select-option) | Yes | - | - | Yes | - | Yes |
| [`locator.selectText()`](/java/api/class-locator#locator-select-text) | Yes | - | - | - | - | - |
| [`locator.scrollIntoViewIfNeeded()`](/java/api/class-locator#locator-scroll-into-view-if-needed) | - | Yes | - | - | - | - |
| [`locator.blur()`](/java/api/class-locator#locator-blur) | - | - | - | - | - | - |
| [`locator.dispatchEvent()`](/java/api/class-locator#locator-dispatch-event) | - | - | - | - | - | - |
| [`locator.focus()`](/java/api/class-locator#locator-focus) | - | - | - | - | - | - |
| [`locator.press()`](/java/api/class-locator#locator-press) | - | - | - | - | - | - |
| [`locator.pressSequentially()`](/java/api/class-locator#locator-press-sequentially) | - | - | - | - | - | - |
| [`locator.setInputFiles()`](/java/api/class-locator#locator-set-input-files) | - | - | - | - | - | - |

## Forcing actions

Some actions like [`locator.click()`](/java/api/class-locator#locator-click) support `force` option that disables non-essential actionability checks,
for example passing truthy `force` to [`locator.click()`](/java/api/class-locator#locator-click) method will not check that the target element actually
receives click events.

## Assertions

Playwright includes auto-retrying assertions that remove flakiness by waiting until the condition is met, similarly to auto-waiting before actions.

| Assertion | Description |
| :- | :- |
| [`locatorAssertions.isAttached()`](/java/api/class-locatorassertions#locator-assertions-to-be-attached) | Element is attached |
| [`locatorAssertions.isChecked()`](/java/api/class-locatorassertions#locator-assertions-to-be-checked) | Checkbox is checked |
| [`locatorAssertions.isDisabled()`](/java/api/class-locatorassertions#locator-assertions-to-be-disabled) | Element is disabled |
| [`locatorAssertions.isEditable()`](/java/api/class-locatorassertions#locator-assertions-to-be-editable) | Element is editable |
| [`locatorAssertions.isEmpty()`](/java/api/class-locatorassertions#locator-assertions-to-be-empty) | Container is empty |
| [`locatorAssertions.isEnabled()`](/java/api/class-locatorassertions#locator-assertions-to-be-enabled) | Element is enabled |
| [`locatorAssertions.isFocused()`](/java/api/class-locatorassertions#locator-assertions-to-be-focused) | Element is focused |
| [`locatorAssertions.isHidden()`](/java/api/class-locatorassertions#locator-assertions-to-be-hidden) | Element is not visible |
| [`locatorAssertions.isInViewport()`](/java/api/class-locatorassertions#locator-assertions-to-be-in-viewport) | Element intersects viewport |
| [`locatorAssertions.isVisible()`](/java/api/class-locatorassertions#locator-assertions-to-be-visible) | Element is visible |
| [`locatorAssertions.containsText()`](/java/api/class-locatorassertions#locator-assertions-to-contain-text) | Element contains text |
| [`locatorAssertions.hasAttribute()`](/java/api/class-locatorassertions#locator-assertions-to-have-attribute) | Element has a DOM attribute |
| [`locatorAssertions.hasClass()`](/java/api/class-locatorassertions#locator-assertions-to-have-class) | Element has a class property |
| [`locatorAssertions.hasCount()`](/java/api/class-locatorassertions#locator-assertions-to-have-count) | List has exact number of children |
| [`locatorAssertions.hasCSS()`](/java/api/class-locatorassertions#locator-assertions-to-have-css) | Element has CSS property |
| [`locatorAssertions.hasId()`](/java/api/class-locatorassertions#locator-assertions-to-have-id) | Element has an ID |
| [`locatorAssertions.hasJSProperty()`](/java/api/class-locatorassertions#locator-assertions-to-have-js-property) | Element has a JavaScript property |
| [`locatorAssertions.hasText()`](/java/api/class-locatorassertions#locator-assertions-to-have-text) | Element matches text |
| [`locatorAssertions.hasValue()`](/java/api/class-locatorassertions#locator-assertions-to-have-value) | Input has a value |
| [`locatorAssertions.hasValues()`](/java/api/class-locatorassertions#locator-assertions-to-have-values) | Select has options selected |
| [`pageAssertions.hasTitle()`](/java/api/class-pageassertions#page-assertions-to-have-title) | Page has a title |
| [`pageAssertions.hasURL()`](/java/api/class-pageassertions#page-assertions-to-have-url) | Page has a URL |
| [`apiResponseAssertions.isOK()`](/java/api/class-apiresponseassertions#api-response-assertions-to-be-ok) | Response has an OK status |

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

For example, consider a scenario where Playwright will click `Sign Up` button regardless of when the [`locator.click()`](/java/api/class-locator#locator-click) call was made:
- page is checking that user name is unique and `Sign Up` button is disabled;
- after checking with the server, the disabled `Sign Up` button is replaced with another one that is now enabled.

[Visible]: #visible "Visible"
[Stable]: #stable "Stable"
[Enabled]: #enabled "Enabled"
[Editable]: #editable "Editable"
[Receives Events]: #receives-events "Receives Events"
[Not Inert]: #not-inert "Not Inert"
