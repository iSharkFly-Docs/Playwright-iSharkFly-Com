---
title: LocatorAssertions
outline: 2
---

# LocatorAssertions

<Badge type="info" text="Added in: v1.17" />

The [LocatorAssertions](/python/api/class-locatorassertions) class provides assertion methods that can be used to make assertions about the [Locator](/python/api/class-locator) state in the tests.

::: code-group

```python [Async]
from playwright.async_api import Page, expect

async def test_status_becomes_submitted(page: Page) -> None:
    # ..
    await page.get_by_role("button").click()
    await expect(page.locator(".status")).to_have_text("Submitted")
```

```python [Sync]
from playwright.sync_api import Page, expect

def test_status_becomes_submitted(page: Page) -> None:
    # ..
    page.get_by_role("button").click()
    expect(page.locator(".status")).to_have_text("Submitted")
```

:::

## Methods

### locator_assertions.not_to_be_attached() {#locator-assertions-not-to-be-attached}

<Badge type="info" text="Added in: v1.33" />

The opposite of [`locator_assertions.to_be_attached()`](/python/api/class-locatorassertions#locator-assertions-to-be-attached).

**Arguments**

- <a id="locator-assertions-not-to-be-attached-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-be-attached-option-attached"></a>`attached` `boolean` *(optional)*
  - <a id="locator-assertions-not-to-be-attached-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_be_checked() {#locator-assertions-not-to-be-checked}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_be_checked()`](/python/api/class-locatorassertions#locator-assertions-to-be-checked).

**Arguments**

- <a id="locator-assertions-not-to-be-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-be-checked-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_be_disabled() {#locator-assertions-not-to-be-disabled}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_be_disabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-disabled).

**Arguments**

- <a id="locator-assertions-not-to-be-disabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-be-disabled-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_be_editable() {#locator-assertions-not-to-be-editable}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_be_editable()`](/python/api/class-locatorassertions#locator-assertions-to-be-editable).

**Arguments**

- <a id="locator-assertions-not-to-be-editable-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-be-editable-option-editable"></a>`editable` `boolean` *(optional)* <Badge type="info" text="Added in: v1.26" />
  - <a id="locator-assertions-not-to-be-editable-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_be_empty() {#locator-assertions-not-to-be-empty}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_be_empty()`](/python/api/class-locatorassertions#locator-assertions-to-be-empty).

**Arguments**

- <a id="locator-assertions-not-to-be-empty-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-be-empty-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_be_enabled() {#locator-assertions-not-to-be-enabled}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_be_enabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-enabled).

**Arguments**

- <a id="locator-assertions-not-to-be-enabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-be-enabled-option-enabled"></a>`enabled` `boolean` *(optional)* <Badge type="info" text="Added in: v1.26" />
  - <a id="locator-assertions-not-to-be-enabled-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_be_focused() {#locator-assertions-not-to-be-focused}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_be_focused()`](/python/api/class-locatorassertions#locator-assertions-to-be-focused).

**Arguments**

- <a id="locator-assertions-not-to-be-focused-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-be-focused-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_be_hidden() {#locator-assertions-not-to-be-hidden}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_be_hidden()`](/python/api/class-locatorassertions#locator-assertions-to-be-hidden).

**Arguments**

- <a id="locator-assertions-not-to-be-hidden-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-be-hidden-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_be_in_viewport() {#locator-assertions-not-to-be-in-viewport}

<Badge type="info" text="Added in: v1.31" />

The opposite of [`locator_assertions.to_be_in_viewport()`](/python/api/class-locatorassertions#locator-assertions-to-be-in-viewport).

**Arguments**

- <a id="locator-assertions-not-to-be-in-viewport-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-be-in-viewport-option-ratio"></a>`ratio` `float` *(optional)*
  - <a id="locator-assertions-not-to-be-in-viewport-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_be_visible() {#locator-assertions-not-to-be-visible}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_be_visible()`](/python/api/class-locatorassertions#locator-assertions-to-be-visible).

**Arguments**

- <a id="locator-assertions-not-to-be-visible-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-be-visible-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.
  - <a id="locator-assertions-not-to-be-visible-option-visible"></a>`visible` `boolean` *(optional)* <Badge type="info" text="Added in: v1.26" />


### locator_assertions.not_to_contain_class() {#locator-assertions-not-to-contain-class}

<Badge type="info" text="Added in: v1.52" />

The opposite of [`locator_assertions.to_contain_class()`](/python/api/class-locatorassertions#locator-assertions-to-contain-class).

**Arguments**

- <a id="locator-assertions-not-to-contain-class-option-expected"></a>`expected` `string | Array<string>`

  Expected class or RegExp or a list of those.
- <a id="locator-assertions-not-to-contain-class-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-contain-class-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_contain_text() {#locator-assertions-not-to-contain-text}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_contain_text()`](/python/api/class-locatorassertions#locator-assertions-to-contain-text).

**Arguments**

- <a id="locator-assertions-not-to-contain-text-option-expected"></a>`expected` `string | RegExp | Array<string> | Array<RegExp> | Array<string | RegExp>` <Badge type="info" text="Added in: v1.18" />

  Expected substring or RegExp or a list of those.
- <a id="locator-assertions-not-to-contain-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-contain-text-option-ignore-case"></a>`ignore_case` `boolean` *(optional)* <Badge type="info" text="Added in: v1.23" />

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-locatorassertions#locator-assertions-not-to-contain-text-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-not-to-contain-text-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.
  - <a id="locator-assertions-not-to-contain-text-option-use-inner-text"></a>`use_inner_text` `boolean` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Whether to use `element.innerText` instead of `element.textContent` when retrieving DOM node text.


### locator_assertions.not_to_have_accessible_description() {#locator-assertions-not-to-have-accessible-description}

<Badge type="info" text="Added in: v1.44" />

The opposite of [`locator_assertions.to_have_accessible_description()`](/python/api/class-locatorassertions#locator-assertions-to-have-accessible-description).

**Arguments**

- <a id="locator-assertions-not-to-have-accessible-description-option-description"></a>`description` `string | RegExp`

  Expected accessible description.
- <a id="locator-assertions-not-to-have-accessible-description-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-accessible-description-option-ignore-case"></a>`ignore_case` `boolean` *(optional)*

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-locatorassertions#locator-assertions-not-to-have-accessible-description-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-not-to-have-accessible-description-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_have_accessible_error_message() {#locator-assertions-not-to-have-accessible-error-message}

<Badge type="info" text="Added in: v1.50" />

The opposite of [`locator_assertions.to_have_accessible_error_message()`](/python/api/class-locatorassertions#locator-assertions-to-have-accessible-error-message).

**Arguments**

- <a id="locator-assertions-not-to-have-accessible-error-message-option-error-message"></a>`error_message` `string | RegExp`

  Expected accessible error message.
- <a id="locator-assertions-not-to-have-accessible-error-message-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-accessible-error-message-option-ignore-case"></a>`ignore_case` `boolean` *(optional)*

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-locatorassertions#locator-assertions-not-to-have-accessible-error-message-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-not-to-have-accessible-error-message-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_have_accessible_name() {#locator-assertions-not-to-have-accessible-name}

<Badge type="info" text="Added in: v1.44" />

The opposite of [`locator_assertions.to_have_accessible_name()`](/python/api/class-locatorassertions#locator-assertions-to-have-accessible-name).

**Arguments**

- <a id="locator-assertions-not-to-have-accessible-name-option-name"></a>`name` `string | RegExp`

  Expected accessible name.
- <a id="locator-assertions-not-to-have-accessible-name-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-accessible-name-option-ignore-case"></a>`ignore_case` `boolean` *(optional)*

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-locatorassertions#locator-assertions-not-to-have-accessible-name-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-not-to-have-accessible-name-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_have_attribute() {#locator-assertions-not-to-have-attribute}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_have_attribute()`](/python/api/class-locatorassertions#locator-assertions-to-have-attribute).

**Arguments**

- <a id="locator-assertions-not-to-have-attribute-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  Attribute name.
- <a id="locator-assertions-not-to-have-attribute-option-value"></a>`value` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.62" />

  Expected attribute value. If not specified, the assertion verifies that the attribute is absent.
- <a id="locator-assertions-not-to-have-attribute-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-attribute-option-ignore-case"></a>`ignore_case` `boolean` *(optional)* <Badge type="info" text="Added in: v1.40" />

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-locatorassertions#locator-assertions-not-to-have-attribute-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-not-to-have-attribute-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_have_class() {#locator-assertions-not-to-have-class}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_have_class()`](/python/api/class-locatorassertions#locator-assertions-to-have-class).

**Arguments**

- <a id="locator-assertions-not-to-have-class-option-expected"></a>`expected` `string | RegExp | Array<string> | Array<RegExp> | Array<string | RegExp>` <Badge type="info" text="Added in: v1.18" />

  Expected class or RegExp or a list of those.
- <a id="locator-assertions-not-to-have-class-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-class-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_have_count() {#locator-assertions-not-to-have-count}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_have_count()`](/python/api/class-locatorassertions#locator-assertions-to-have-count).

**Arguments**

- <a id="locator-assertions-not-to-have-count-option-count"></a>`count` `int` <Badge type="info" text="Added in: v1.18" />

  Expected count.
- <a id="locator-assertions-not-to-have-count-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-count-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_have_css() {#locator-assertions-not-to-have-css}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_have_css()`](/python/api/class-locatorassertions#locator-assertions-to-have-css).

**Arguments**

- <a id="locator-assertions-not-to-have-css-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  CSS property name.
- <a id="locator-assertions-not-to-have-css-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  CSS property value.
- <a id="locator-assertions-not-to-have-css-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-css-option-pseudo"></a>`pseudo` `"before" | "after"` *(optional)* <Badge type="info" text="Added in: v1.65" />

    Pseudo-element to read computed styles from.
  - <a id="locator-assertions-not-to-have-css-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_have_id() {#locator-assertions-not-to-have-id}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_have_id()`](/python/api/class-locatorassertions#locator-assertions-to-have-id).

**Arguments**

- <a id="locator-assertions-not-to-have-id-option-id"></a>`id` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Element id.
- <a id="locator-assertions-not-to-have-id-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-id-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_have_js_property() {#locator-assertions-not-to-have-js-property}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_have_js_property()`](/python/api/class-locatorassertions#locator-assertions-to-have-js-property).

**Arguments**

- <a id="locator-assertions-not-to-have-js-property-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  Property name.
- <a id="locator-assertions-not-to-have-js-property-option-value"></a>`value` `any` <Badge type="info" text="Added in: v1.18" />

  Property value.
- <a id="locator-assertions-not-to-have-js-property-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-js-property-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_have_role() {#locator-assertions-not-to-have-role}

<Badge type="info" text="Added in: v1.44" />

The opposite of [`locator_assertions.to_have_role()`](/python/api/class-locatorassertions#locator-assertions-to-have-role).

**Arguments**

- <a id="locator-assertions-not-to-have-role-option-role"></a>`role` `"alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"`

  Required aria role.
- <a id="locator-assertions-not-to-have-role-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-role-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_have_text() {#locator-assertions-not-to-have-text}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_have_text()`](/python/api/class-locatorassertions#locator-assertions-to-have-text).

**Arguments**

- <a id="locator-assertions-not-to-have-text-option-expected"></a>`expected` `string | RegExp | Array<string> | Array<RegExp> | Array<string | RegExp>` <Badge type="info" text="Added in: v1.18" />

  Expected string or RegExp or a list of those.
- <a id="locator-assertions-not-to-have-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-text-option-ignore-case"></a>`ignore_case` `boolean` *(optional)* <Badge type="info" text="Added in: v1.23" />

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-locatorassertions#locator-assertions-not-to-have-text-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-not-to-have-text-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.
  - <a id="locator-assertions-not-to-have-text-option-use-inner-text"></a>`use_inner_text` `boolean` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Whether to use `element.innerText` instead of `element.textContent` when retrieving DOM node text.


### locator_assertions.not_to_have_value() {#locator-assertions-not-to-have-value}

<Badge type="info" text="Added in: v1.20" />

The opposite of [`locator_assertions.to_have_value()`](/python/api/class-locatorassertions#locator-assertions-to-have-value).

**Arguments**

- <a id="locator-assertions-not-to-have-value-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected value.
- <a id="locator-assertions-not-to-have-value-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-value-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_have_values() {#locator-assertions-not-to-have-values}

<Badge type="info" text="Added in: v1.23" />

The opposite of [`locator_assertions.to_have_values()`](/python/api/class-locatorassertions#locator-assertions-to-have-values).

**Arguments**

- <a id="locator-assertions-not-to-have-values-option-values"></a>`values` `Array<string> | Array<RegExp> | Array<string | RegExp>`

  Expected options currently selected.
- <a id="locator-assertions-not-to-have-values-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-have-values-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.not_to_match_aria_snapshot() {#locator-assertions-not-to-match-aria-snapshot}

<Badge type="info" text="Added in: v1.49" />

The opposite of [`locator_assertions.to_match_aria_snapshot()`](/python/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot).

**Arguments**

- <a id="locator-assertions-not-to-match-aria-snapshot-option-expected"></a>`expected` `string`
- <a id="locator-assertions-not-to-match-aria-snapshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-not-to-match-aria-snapshot-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_be_attached() {#locator-assertions-to-be-attached}

<Badge type="info" text="Added in: v1.33" />

Ensures that [Locator](/python/api/class-locator) points to an element that is [connected](https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected) to a Document or a ShadowRoot.

**Usage**

::: code-group

```python [Async]
await expect(page.get_by_text("Hidden text")).to_be_attached()
```

```python [Sync]
expect(page.get_by_text("Hidden text")).to_be_attached()
```

:::

**Arguments**

- <a id="locator-assertions-to-be-attached-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-attached-option-attached"></a>`attached` `boolean` *(optional)*
  - <a id="locator-assertions-to-be-attached-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_be_checked() {#locator-assertions-to-be-checked}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to a checked input.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.get_by_label("Subscribe to newsletter")
await expect(locator).to_be_checked()
```

```python [Sync]
from playwright.sync_api import expect

locator = page.get_by_label("Subscribe to newsletter")
expect(locator).to_be_checked()
```

:::

**Arguments**

- <a id="locator-assertions-to-be-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-checked-option-checked"></a>`checked` `boolean` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Provides state to assert for. Asserts for input to be checked by default.
    This option can't be used when [`indeterminate`](/python/api/class-locatorassertions#locator-assertions-to-be-checked-option-indeterminate) is set to true.
  - <a id="locator-assertions-to-be-checked-option-indeterminate"></a>`indeterminate` `boolean` *(optional)* <Badge type="info" text="Added in: v1.50" />

    Asserts that the element is in the indeterminate (mixed) state. Only supported for checkboxes and radio buttons.
    This option can't be true when [`checked`](/python/api/class-locatorassertions#locator-assertions-to-be-checked-option-checked) is provided.
  - <a id="locator-assertions-to-be-checked-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_be_disabled() {#locator-assertions-to-be-disabled}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to a disabled element. Element is disabled if it has "disabled" attribute
or is disabled via ['aria-disabled'](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).
Note that only native control elements such as HTML `button`, `input`, `select`, `textarea`, `option`, `optgroup`
can be disabled by setting "disabled" attribute. "disabled" attribute on other elements is ignored
by the browser.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.locator("button.submit")
await expect(locator).to_be_disabled()
```

```python [Sync]
from playwright.sync_api import expect

locator = page.locator("button.submit")
expect(locator).to_be_disabled()
```

:::

**Arguments**

- <a id="locator-assertions-to-be-disabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-disabled-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_be_editable() {#locator-assertions-to-be-editable}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to an editable element.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.get_by_role("textbox")
await expect(locator).to_be_editable()
```

```python [Sync]
from playwright.sync_api import expect

locator = page.get_by_role("textbox")
expect(locator).to_be_editable()
```

:::

**Arguments**

- <a id="locator-assertions-to-be-editable-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-editable-option-editable"></a>`editable` `boolean` *(optional)* <Badge type="info" text="Added in: v1.26" />
  - <a id="locator-assertions-to-be-editable-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_be_empty() {#locator-assertions-to-be-empty}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to an empty editable element or to a DOM node that has no text.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.locator("div.warning")
await expect(locator).to_be_empty()
```

```python [Sync]
from playwright.sync_api import expect

locator = page.locator("div.warning")
expect(locator).to_be_empty()
```

:::

**Arguments**

- <a id="locator-assertions-to-be-empty-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-empty-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_be_enabled() {#locator-assertions-to-be-enabled}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to an enabled element.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.locator("button.submit")
await expect(locator).to_be_enabled()
```

```python [Sync]
from playwright.sync_api import expect

locator = page.locator("button.submit")
expect(locator).to_be_enabled()
```

:::

**Arguments**

- <a id="locator-assertions-to-be-enabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-enabled-option-enabled"></a>`enabled` `boolean` *(optional)* <Badge type="info" text="Added in: v1.26" />
  - <a id="locator-assertions-to-be-enabled-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_be_focused() {#locator-assertions-to-be-focused}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to a focused DOM node.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.get_by_role("textbox")
await expect(locator).to_be_focused()
```

```python [Sync]
from playwright.sync_api import expect

locator = page.get_by_role("textbox")
expect(locator).to_be_focused()
```

:::

**Arguments**

- <a id="locator-assertions-to-be-focused-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-focused-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_be_hidden() {#locator-assertions-to-be-hidden}

<Badge type="info" text="Added in: v1.20" />

Ensures that [Locator](/python/api/class-locator) either does not resolve to any DOM node, or resolves to a [non-visible](../actionability.md#visible) one.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.locator('.my-element')
await expect(locator).to_be_hidden()
```

```python [Sync]
from playwright.sync_api import expect

locator = page.locator('.my-element')
expect(locator).to_be_hidden()
```

:::

**Arguments**

- <a id="locator-assertions-to-be-hidden-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-hidden-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_be_in_viewport() {#locator-assertions-to-be-in-viewport}

<Badge type="info" text="Added in: v1.31" />

Ensures the [Locator](/python/api/class-locator) points to an element that intersects viewport, according to the [intersection observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.get_by_role("button")
# Make sure at least some part of element intersects viewport.
await expect(locator).to_be_in_viewport()
# Make sure element is fully outside of viewport.
await expect(locator).not_to_be_in_viewport()
# Make sure that at least half of the element intersects viewport.
await expect(locator).to_be_in_viewport(ratio=0.5)
```

```python [Sync]
from playwright.sync_api import expect

locator = page.get_by_role("button")
# Make sure at least some part of element intersects viewport.
expect(locator).to_be_in_viewport()
# Make sure element is fully outside of viewport.
expect(locator).not_to_be_in_viewport()
# Make sure that at least half of the element intersects viewport.
expect(locator).to_be_in_viewport(ratio=0.5)
```

:::

**Arguments**

- <a id="locator-assertions-to-be-in-viewport-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-in-viewport-option-ratio"></a>`ratio` `float` *(optional)*

    The minimal ratio of the element to intersect viewport. If equals to `0`, then
    element should intersect viewport at any positive ratio. Defaults to `0`.
  - <a id="locator-assertions-to-be-in-viewport-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_be_visible() {#locator-assertions-to-be-visible}

<Badge type="info" text="Added in: v1.20" />

Ensures that [Locator](/python/api/class-locator) points to an attached and [visible](../actionability.md#visible) DOM node.

To check that at least one element from the list is visible, use [`locator.first()`](/python/api/class-locator#locator-first).

**Usage**

::: code-group

```python [Async]
# A specific element is visible.
await expect(page.get_by_text("Welcome")).to_be_visible()

# At least one item in the list is visible.
await expect(page.get_by_test_id("todo-item").first).to_be_visible()

# At least one of the two elements is visible, possibly both.
await expect(
    page.get_by_role("button", name="Sign in")
    .or_(page.get_by_role("button", name="Sign up"))
    .first
).to_be_visible()
```

```python [Sync]
# A specific element is visible.
expect(page.get_by_text("Welcome")).to_be_visible()

# At least one item in the list is visible.
expect(page.get_by_test_id("todo-item").first).to_be_visible()

# At least one of the two elements is visible, possibly both.
expect(
    page.get_by_role("button", name="Sign in")
    .or_(page.get_by_role("button", name="Sign up"))
    .first
).to_be_visible()
```

:::

**Arguments**

- <a id="locator-assertions-to-be-visible-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-visible-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.
  - <a id="locator-assertions-to-be-visible-option-visible"></a>`visible` `boolean` *(optional)* <Badge type="info" text="Added in: v1.26" />


### locator_assertions.to_contain_class() {#locator-assertions-to-contain-class}

<Badge type="info" text="Added in: v1.52" />

Ensures the [Locator](/python/api/class-locator) points to an element with given CSS classes. All classes from the asserted value, separated by spaces, must be present in the [Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) in any order.

**Usage**

```html
<div class='middle selected row' id='component'></div>
```

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.locator("#component")
await expect(locator).to_contain_class("middle selected row")
await expect(locator).to_contain_class("selected")
await expect(locator).to_contain_class("row middle")
```

```python [Sync]
from playwright.sync_api import expect

locator = page.locator("#component")
expect(locator).to_contain_class("middle selected row")
expect(locator).to_contain_class("selected")
expect(locator).to_contain_class("row middle")
```

:::

When an array is passed, the method asserts that the list of elements located matches the corresponding list of expected class lists. Each element's class attribute is matched against the corresponding class in the array:

```html
<div class='list'>
  <div class='component inactive'></div>
  <div class='component active'></div>
  <div class='component inactive'></div>
</div>
```

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.locator(".list > .component")
await expect(locator).to_contain_class(["inactive", "active", "inactive"])
```

```python [Sync]
from playwright.sync_api import expect

locator = page.locator(".list > .component")
await expect(locator).to_contain_class(["inactive", "active", "inactive"])
```

:::

**Arguments**

- <a id="locator-assertions-to-contain-class-option-expected"></a>`expected` `string | Array<string>`

  A string containing expected class names, separated by spaces, or a list of such strings to assert multiple elements.
- <a id="locator-assertions-to-contain-class-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-contain-class-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_contain_text() {#locator-assertions-to-contain-text}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to an element that contains the given text. All nested elements will be considered when computing the text content of the element. You can use regular expressions for the value as well.

**Details**

When `expected` parameter is a string, Playwright will normalize whitespaces and line breaks both in the actual text and
in the expected string before matching. When regular expression is used, the actual text is matched as is.

**Usage**

::: code-group

```python [Async]
import re
from playwright.async_api import expect

locator = page.locator('.title')
await expect(locator).to_contain_text("substring")
await expect(locator).to_contain_text(re.compile(r"\d messages"))
```

```python [Sync]
import re
from playwright.sync_api import expect

locator = page.locator('.title')
expect(locator).to_contain_text("substring")
expect(locator).to_contain_text(re.compile(r"\d messages"))
```

:::

If you pass an array as an expected value, the expectations are:
1. Locator resolves to a list of elements.
1. Elements from a **subset** of this list contain text from the expected array, respectively.
1. The matching subset of elements has the same order as the expected array.
1. Each text value from the expected array is matched by some element from the list.

For example, consider the following list:

```html
<ul>
  <li>Item Text 1</li>
  <li>Item Text 2</li>
  <li>Item Text 3</li>
</ul>
```

Let's see how we can use the assertion:

::: code-group

```python [Async]
from playwright.async_api import expect

# ✓ Contains the right items in the right order
await expect(page.locator("ul > li")).to_contain_text(["Text 1", "Text 3"])

# ✖ Wrong order
await expect(page.locator("ul > li")).to_contain_text(["Text 3", "Text 2"])

# ✖ No item contains this text
await expect(page.locator("ul > li")).to_contain_text(["Some 33"])

# ✖ Locator points to the outer list element, not to the list items
await expect(page.locator("ul")).to_contain_text(["Text 3"])
```

```python [Sync]
from playwright.sync_api import expect

# ✓ Contains the right items in the right order
expect(page.locator("ul > li")).to_contain_text(["Text 1", "Text 3"])

# ✖ Wrong order
expect(page.locator("ul > li")).to_contain_text(["Text 3", "Text 2"])

# ✖ No item contains this text
expect(page.locator("ul > li")).to_contain_text(["Some 33"])

# ✖ Locator points to the outer list element, not to the list items
expect(page.locator("ul")).to_contain_text(["Text 3"])
```

:::

**Arguments**

- <a id="locator-assertions-to-contain-text-option-expected"></a>`expected` `string | RegExp | Array<string> | Array<RegExp> | Array<string | RegExp>` <Badge type="info" text="Added in: v1.18" />

  Expected substring or RegExp or a list of those.
- <a id="locator-assertions-to-contain-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-contain-text-option-ignore-case"></a>`ignore_case` `boolean` *(optional)* <Badge type="info" text="Added in: v1.23" />

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-locatorassertions#locator-assertions-to-contain-text-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-contain-text-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.
  - <a id="locator-assertions-to-contain-text-option-use-inner-text"></a>`use_inner_text` `boolean` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Whether to use `element.innerText` instead of `element.textContent` when retrieving DOM node text.


### locator_assertions.to_have_accessible_description() {#locator-assertions-to-have-accessible-description}

<Badge type="info" text="Added in: v1.44" />

Ensures the [Locator](/python/api/class-locator) points to an element with a given [accessible description](https://w3c.github.io/accname/#dfn-accessible-description).

**Usage**

::: code-group

```python [Async]
locator = page.get_by_test_id("save-button")
await expect(locator).to_have_accessible_description("Save results to disk")
```

```python [Sync]
locator = page.get_by_test_id("save-button")
expect(locator).to_have_accessible_description("Save results to disk")
```

:::

**Arguments**

- <a id="locator-assertions-to-have-accessible-description-option-description"></a>`description` `string | RegExp`

  Expected accessible description.
- <a id="locator-assertions-to-have-accessible-description-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-accessible-description-option-ignore-case"></a>`ignore_case` `boolean` *(optional)*

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-locatorassertions#locator-assertions-to-have-accessible-description-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-accessible-description-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_have_accessible_error_message() {#locator-assertions-to-have-accessible-error-message}

<Badge type="info" text="Added in: v1.50" />

Ensures the [Locator](/python/api/class-locator) points to an element with a given [aria errormessage](https://w3c.github.io/aria/#aria-errormessage).

**Usage**

::: code-group

```python [Async]
locator = page.get_by_test_id("username-input")
await expect(locator).to_have_accessible_error_message("Username is required.")
```

```python [Sync]
locator = page.get_by_test_id("username-input")
expect(locator).to_have_accessible_error_message("Username is required.")
```

:::

**Arguments**

- <a id="locator-assertions-to-have-accessible-error-message-option-error-message"></a>`error_message` `string | RegExp`

  Expected accessible error message.
- <a id="locator-assertions-to-have-accessible-error-message-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-accessible-error-message-option-ignore-case"></a>`ignore_case` `boolean` *(optional)*

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-locatorassertions#locator-assertions-to-have-accessible-error-message-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-accessible-error-message-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_have_accessible_name() {#locator-assertions-to-have-accessible-name}

<Badge type="info" text="Added in: v1.44" />

Ensures the [Locator](/python/api/class-locator) points to an element with a given [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).

**Usage**

::: code-group

```python [Async]
locator = page.get_by_test_id("save-button")
await expect(locator).to_have_accessible_name("Save to disk")
```

```python [Sync]
locator = page.get_by_test_id("save-button")
expect(locator).to_have_accessible_name("Save to disk")
```

:::

**Arguments**

- <a id="locator-assertions-to-have-accessible-name-option-name"></a>`name` `string | RegExp`

  Expected accessible name.
- <a id="locator-assertions-to-have-accessible-name-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-accessible-name-option-ignore-case"></a>`ignore_case` `boolean` *(optional)*

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-locatorassertions#locator-assertions-to-have-accessible-name-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-accessible-name-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_have_attribute() {#locator-assertions-to-have-attribute}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to an element with given attribute.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.locator("input")
await expect(locator).to_have_attribute("type", "text")
await expect(locator).to_have_attribute("disabled")
await expect(locator).not_to_have_attribute("readonly")
```

```python [Sync]
from playwright.sync_api import expect

locator = page.locator("input")
expect(locator).to_have_attribute("type", "text")
expect(locator).to_have_attribute("disabled")
expect(locator).not_to_have_attribute("readonly")
```

:::

**Arguments**

- <a id="locator-assertions-to-have-attribute-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  Attribute name.
- <a id="locator-assertions-to-have-attribute-option-value"></a>`value` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.62" />

  Expected attribute value. If not specified, the assertion verifies that the attribute is present.
- <a id="locator-assertions-to-have-attribute-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-attribute-option-ignore-case"></a>`ignore_case` `boolean` *(optional)* <Badge type="info" text="Added in: v1.40" />

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-locatorassertions#locator-assertions-to-have-attribute-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-attribute-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_have_class() {#locator-assertions-to-have-class}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to an element with given CSS classes. When a string is provided, it must fully match the element's `class` attribute. To match individual classes use [`locator_assertions.to_contain_class()`](/python/api/class-locatorassertions#locator-assertions-to-contain-class).

**Usage**

```html
<div class='middle selected row' id='component'></div>
```

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.locator("#component")
await expect(locator).to_have_class("middle selected row")
await expect(locator).to_have_class(re.compile(r"(^|\\s)selected(\\s|$)"))
```

```python [Sync]
from playwright.sync_api import expect

locator = page.locator("#component")
expect(locator).to_have_class("middle selected row")
expect(locator).to_have_class(re.compile(r"(^|\\s)selected(\\s|$)"))
```

:::

When an array is passed, the method asserts that the list of elements located matches the corresponding list of expected class values. Each element's class attribute is matched against the corresponding string or regular expression in the array:

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.locator(".list > .component")
await expect(locator).to_have_class(["component", "component selected", "component"])
```

```python [Sync]
from playwright.sync_api import expect

locator = page.locator(".list > .component")
expect(locator).to_have_class(["component", "component selected", "component"])
```

:::

**Arguments**

- <a id="locator-assertions-to-have-class-option-expected"></a>`expected` `string | RegExp | Array<string> | Array<RegExp> | Array<string | RegExp>` <Badge type="info" text="Added in: v1.18" />

  Expected class or RegExp or a list of those.
- <a id="locator-assertions-to-have-class-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-class-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_have_count() {#locator-assertions-to-have-count}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) resolves to an exact number of DOM nodes.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.locator("list > .component")
await expect(locator).to_have_count(3)
```

```python [Sync]
from playwright.sync_api import expect

locator = page.locator("list > .component")
expect(locator).to_have_count(3)
```

:::

**Arguments**

- <a id="locator-assertions-to-have-count-option-count"></a>`count` `int` <Badge type="info" text="Added in: v1.18" />

  Expected count.
- <a id="locator-assertions-to-have-count-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-count-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_have_css() {#locator-assertions-to-have-css}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) resolves to an element with the given computed CSS style.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.get_by_role("button")
await expect(locator).to_have_css("display", "flex")
```

```python [Sync]
from playwright.sync_api import expect

locator = page.get_by_role("button")
expect(locator).to_have_css("display", "flex")
```

:::

**Arguments**

- <a id="locator-assertions-to-have-css-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  CSS property name.
- <a id="locator-assertions-to-have-css-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  CSS property value.
- <a id="locator-assertions-to-have-css-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-css-option-pseudo"></a>`pseudo` `"before" | "after"` *(optional)* <Badge type="info" text="Added in: v1.60" />

    Pseudo-element to read computed styles from.
  - <a id="locator-assertions-to-have-css-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_have_id() {#locator-assertions-to-have-id}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to an element with the given DOM Node ID.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.get_by_role("textbox")
await expect(locator).to_have_id("lastname")
```

```python [Sync]
from playwright.sync_api import expect

locator = page.get_by_role("textbox")
expect(locator).to_have_id("lastname")
```

:::

**Arguments**

- <a id="locator-assertions-to-have-id-option-id"></a>`id` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Element id.
- <a id="locator-assertions-to-have-id-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-id-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_have_js_property() {#locator-assertions-to-have-js-property}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to an element with given JavaScript property. Note that this property can be
of a primitive type as well as a plain serializable JavaScript object.

**Usage**

::: code-group

```python [Async]
from playwright.async_api import expect

locator = page.locator(".component")
await expect(locator).to_have_js_property("loaded", True)
```

```python [Sync]
from playwright.sync_api import expect

locator = page.locator(".component")
expect(locator).to_have_js_property("loaded", True)
```

:::

**Arguments**

- <a id="locator-assertions-to-have-js-property-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  Property name.
- <a id="locator-assertions-to-have-js-property-option-value"></a>`value` `any` <Badge type="info" text="Added in: v1.18" />

  Property value.
- <a id="locator-assertions-to-have-js-property-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-js-property-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_have_role() {#locator-assertions-to-have-role}

<Badge type="info" text="Added in: v1.44" />

Ensures the [Locator](/python/api/class-locator) points to an element with a given [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles).

Note that role is matched as a string, disregarding the ARIA role hierarchy. For example, asserting  a superclass role `"checkbox"` on an element with a subclass role `"switch"` will fail.

**Usage**

::: code-group

```python [Async]
locator = page.get_by_test_id("save-button")
await expect(locator).to_have_role("button")
```

```python [Sync]
locator = page.get_by_test_id("save-button")
expect(locator).to_have_role("button")
```

:::

**Arguments**

- <a id="locator-assertions-to-have-role-option-role"></a>`role` `"alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"`

  Required aria role.
- <a id="locator-assertions-to-have-role-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-role-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_have_text() {#locator-assertions-to-have-text}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to an element with the given text. All nested elements will be considered when computing the text content of the element. You can use regular expressions for the value as well.

**Details**

When `expected` parameter is a string, Playwright will normalize whitespaces and line breaks both in the actual text and
in the expected string before matching. When regular expression is used, the actual text is matched as is.

**Usage**

::: code-group

```python [Async]
import re
from playwright.async_api import expect

locator = page.locator(".title")
await expect(locator).to_have_text(re.compile(r"Welcome, Test User"))
await expect(locator).to_have_text(re.compile(r"Welcome, .*"))
```

```python [Sync]
import re
from playwright.sync_api import expect

locator = page.locator(".title")
expect(locator).to_have_text(re.compile(r"Welcome, Test User"))
expect(locator).to_have_text(re.compile(r"Welcome, .*"))
```

:::

If you pass an array as an expected value, the expectations are:
1. Locator resolves to a list of elements.
1. The number of elements equals the number of expected values in the array.
1. Elements from the list have text matching expected array values, one by one, in order.

For example, consider the following list:

```html
<ul>
  <li>Text 1</li>
  <li>Text 2</li>
  <li>Text 3</li>
</ul>
```

Let's see how we can use the assertion:

::: code-group

```python [Async]
from playwright.async_api import expect

# ✓ Has the right items in the right order
await expect(page.locator("ul > li")).to_have_text(["Text 1", "Text 2", "Text 3"])

# ✖ Wrong order
await expect(page.locator("ul > li")).to_have_text(["Text 3", "Text 2", "Text 1"])

# ✖ Last item does not match
await expect(page.locator("ul > li")).to_have_text(["Text 1", "Text 2", "Text"])

# ✖ Locator points to the outer list element, not to the list items
await expect(page.locator("ul")).to_have_text(["Text 1", "Text 2", "Text 3"])
```

```python [Sync]
from playwright.sync_api import expect

# ✓ Has the right items in the right order
expect(page.locator("ul > li")).to_have_text(["Text 1", "Text 2", "Text 3"])

# ✖ Wrong order
expect(page.locator("ul > li")).to_have_text(["Text 3", "Text 2", "Text 1"])

# ✖ Last item does not match
expect(page.locator("ul > li")).to_have_text(["Text 1", "Text 2", "Text"])

# ✖ Locator points to the outer list element, not to the list items
expect(page.locator("ul")).to_have_text(["Text 1", "Text 2", "Text 3"])
```

:::

**Arguments**

- <a id="locator-assertions-to-have-text-option-expected"></a>`expected` `string | RegExp | Array<string> | Array<RegExp> | Array<string | RegExp>` <Badge type="info" text="Added in: v1.18" />

  Expected string or RegExp or a list of those.
- <a id="locator-assertions-to-have-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-text-option-ignore-case"></a>`ignore_case` `boolean` *(optional)* <Badge type="info" text="Added in: v1.23" />

    Whether to perform case-insensitive match. [`ignore_case`](/python/api/class-locatorassertions#locator-assertions-to-have-text-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-text-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.
  - <a id="locator-assertions-to-have-text-option-use-inner-text"></a>`use_inner_text` `boolean` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Whether to use `element.innerText` instead of `element.textContent` when retrieving DOM node text.


### locator_assertions.to_have_value() {#locator-assertions-to-have-value}

<Badge type="info" text="Added in: v1.20" />

Ensures the [Locator](/python/api/class-locator) points to an element with the given input value. You can use regular expressions for the value as well.

**Usage**

::: code-group

```python [Async]
import re
from playwright.async_api import expect

locator = page.locator("input[type=number]")
await expect(locator).to_have_value(re.compile(r"[0-9]"))
```

```python [Sync]
import re
from playwright.sync_api import expect

locator = page.locator("input[type=number]")
expect(locator).to_have_value(re.compile(r"[0-9]"))
```

:::

**Arguments**

- <a id="locator-assertions-to-have-value-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected value.
- <a id="locator-assertions-to-have-value-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-value-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_have_values() {#locator-assertions-to-have-values}

<Badge type="info" text="Added in: v1.23" />

Ensures the [Locator](/python/api/class-locator) points to multi-select/combobox (i.e. a `select` with the `multiple` attribute) and the specified values are selected.

**Usage**

For example, given the following element:

```html
<select id="favorite-colors" multiple>
  <option value="R">Red</option>
  <option value="G">Green</option>
  <option value="B">Blue</option>
</select>
```

::: code-group

```python [Async]
import re
from playwright.async_api import expect

locator = page.locator("id=favorite-colors")
await locator.select_option(["R", "G"])
await expect(locator).to_have_values([re.compile(r"R"), re.compile(r"G")])
```

```python [Sync]
import re
from playwright.sync_api import expect

locator = page.locator("id=favorite-colors")
locator.select_option(["R", "G"])
expect(locator).to_have_values([re.compile(r"R"), re.compile(r"G")])
```

:::

**Arguments**

- <a id="locator-assertions-to-have-values-option-values"></a>`values` `Array<string> | Array<RegExp> | Array<string | RegExp>`

  Expected options currently selected.
- <a id="locator-assertions-to-have-values-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-values-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.


### locator_assertions.to_match_aria_snapshot() {#locator-assertions-to-match-aria-snapshot}

<Badge type="info" text="Added in: v1.49" />

Asserts that the target element matches the given [accessibility snapshot](../aria-snapshots.md).

**Usage**

::: code-group

```python [Async]
await page.goto("https://demo.playwright.dev/todomvc/")
await expect(page.locator('body')).to_match_aria_snapshot('''
  - heading "todos"
  - textbox "What needs to be done?"
''')
```

```python [Sync]
page.goto("https://demo.playwright.dev/todomvc/")
expect(page.locator('body')).to_match_aria_snapshot('''
  - heading "todos"
  - textbox "What needs to be done?"
''')
```

:::

**Arguments**

- <a id="locator-assertions-to-match-aria-snapshot-option-expected"></a>`expected` `string`
- <a id="locator-assertions-to-match-aria-snapshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-match-aria-snapshot-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `5000`.

