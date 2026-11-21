---
title: LocatorAssertions
outline: 2
---

# LocatorAssertions

<Badge type="info" text="Added in: v1.17" />

The [LocatorAssertions](/api/class-locatorassertions) class provides assertion methods that can be used to make assertions about the [Locator](/api/class-locator) state in the tests.

```js
import { test, expect } from '@playwright/test';

test('status becomes submitted', async ({ page }) => {
  // ...
  await page.getByRole('button').click();
  await expect(page.locator('.status')).toHaveText('Submitted');
});
```

## Methods

### locatorAssertions.toBeAttached() {#locator-assertions-to-be-attached}

<Badge type="info" text="Added in: v1.33" /> <Badge type="tip" text="async" />

Ensures that [Locator](/api/class-locator) points to an element that is [connected](https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected) to a Document or a ShadowRoot.

**Usage**

```js
await expect(page.getByText('Hidden text')).toBeAttached();
```

**Arguments**

- <a id="locator-assertions-to-be-attached-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-attached-option-attached"></a>`attached` `boolean` *(optional)*
  - <a id="locator-assertions-to-be-attached-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-be-attached-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toBeChecked() {#locator-assertions-to-be-checked}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to a checked input.

**Usage**

```js
const locator = page.getByLabel('Subscribe to newsletter');
await expect(locator).toBeChecked();
```

**Arguments**

- <a id="locator-assertions-to-be-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-checked-option-checked"></a>`checked` `boolean` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Provides state to assert for. Asserts for input to be checked by default.
    This option can't be used when [`indeterminate`](/api/class-locatorassertions#locator-assertions-to-be-checked-option-indeterminate) is set to true.
  - <a id="locator-assertions-to-be-checked-option-indeterminate"></a>`indeterminate` `boolean` *(optional)* <Badge type="info" text="Added in: v1.50" />

    Asserts that the element is in the indeterminate (mixed) state. Only supported for checkboxes and radio buttons.
    This option can't be true when [`checked`](/api/class-locatorassertions#locator-assertions-to-be-checked-option-checked) is provided.
  - <a id="locator-assertions-to-be-checked-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-be-checked-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toBeDisabled() {#locator-assertions-to-be-disabled}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to a disabled element. Element is disabled if it has "disabled" attribute
or is disabled via ['aria-disabled'](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled).
Note that only native control elements such as HTML `button`, `input`, `select`, `textarea`, `option`, `optgroup`
can be disabled by setting "disabled" attribute. "disabled" attribute on other elements is ignored
by the browser.

**Usage**

```js
const locator = page.locator('button.submit');
await expect(locator).toBeDisabled();
```

**Arguments**

- <a id="locator-assertions-to-be-disabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-disabled-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-be-disabled-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toBeEditable() {#locator-assertions-to-be-editable}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an editable element.

**Usage**

```js
const locator = page.getByRole('textbox');
await expect(locator).toBeEditable();
```

**Arguments**

- <a id="locator-assertions-to-be-editable-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-editable-option-editable"></a>`editable` `boolean` *(optional)* <Badge type="info" text="Added in: v1.26" />
  - <a id="locator-assertions-to-be-editable-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-be-editable-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toBeEmpty() {#locator-assertions-to-be-empty}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an empty editable element or to a DOM node that has no text.

**Usage**

```js
const locator = page.locator('div.warning');
await expect(locator).toBeEmpty();
```

**Arguments**

- <a id="locator-assertions-to-be-empty-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-empty-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-be-empty-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toBeEnabled() {#locator-assertions-to-be-enabled}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an enabled element.

**Usage**

```js
const locator = page.locator('button.submit');
await expect(locator).toBeEnabled();
```

**Arguments**

- <a id="locator-assertions-to-be-enabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-enabled-option-enabled"></a>`enabled` `boolean` *(optional)* <Badge type="info" text="Added in: v1.26" />
  - <a id="locator-assertions-to-be-enabled-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-be-enabled-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toBeFocused() {#locator-assertions-to-be-focused}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to a focused DOM node.

**Usage**

```js
const locator = page.getByRole('textbox');
await expect(locator).toBeFocused();
```

**Arguments**

- <a id="locator-assertions-to-be-focused-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-focused-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-be-focused-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toBeHidden() {#locator-assertions-to-be-hidden}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures that [Locator](/api/class-locator) either does not resolve to any DOM node, or resolves to a [non-visible](../actionability.md#visible) one.

**Usage**

```js
const locator = page.locator('.my-element');
await expect(locator).toBeHidden();
```

**Arguments**

- <a id="locator-assertions-to-be-hidden-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-hidden-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-be-hidden-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toBeInViewport() {#locator-assertions-to-be-in-viewport}

<Badge type="info" text="Added in: v1.31" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element that intersects viewport, according to the [intersection observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

**Usage**

```js
const locator = page.getByRole('button');
// Make sure at least some part of element intersects viewport.
await expect(locator).toBeInViewport();
// Make sure element is fully outside of viewport.
await expect(locator).not.toBeInViewport();
// Make sure that at least half of the element intersects viewport.
await expect(locator).toBeInViewport({ ratio: 0.5 });
```

**Arguments**

- <a id="locator-assertions-to-be-in-viewport-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-in-viewport-option-ratio"></a>`ratio` `float` *(optional)*

    The minimal ratio of the element to intersect viewport. If equals to `0`, then
    element should intersect viewport at any positive ratio. Defaults to `0`.
  - <a id="locator-assertions-to-be-in-viewport-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-be-in-viewport-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toBeVisible() {#locator-assertions-to-be-visible}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures that [Locator](/api/class-locator) points to an attached and [visible](../actionability.md#visible) DOM node.

To check that at least one element from the list is visible, use [`locator.first()`](/api/class-locator#locator-first).

**Usage**

```js
// A specific element is visible.
await expect(page.getByText('Welcome')).toBeVisible();

// At least one item in the list is visible.
await expect(page.getByTestId('todo-item').first()).toBeVisible();

// At least one of the two elements is visible, possibly both.
await expect(
    page.getByRole('button', { name: 'Sign in' })
        .or(page.getByRole('button', { name: 'Sign up' }))
        .first()
).toBeVisible();
```

**Arguments**

- <a id="locator-assertions-to-be-visible-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-be-visible-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-be-visible-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.
  - <a id="locator-assertions-to-be-visible-option-visible"></a>`visible` `boolean` *(optional)* <Badge type="info" text="Added in: v1.26" />


### locatorAssertions.toContainClass() {#locator-assertions-to-contain-class}

<Badge type="info" text="Added in: v1.52" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element with given CSS classes. All classes from the asserted value, separated by spaces, must be present in the [Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) in any order.

**Usage**

```html
<div class='middle selected row' id='component'></div>
```

```js
const locator = page.locator('#component');
await expect(locator).toContainClass('middle selected row');
await expect(locator).toContainClass('selected');
await expect(locator).toContainClass('row middle');
```

When an array is passed, the method asserts that the list of elements located matches the corresponding list of expected class lists. Each element's class attribute is matched against the corresponding class in the array:

```html
<div class='list'>
  <div class='component inactive'></div>
  <div class='component active'></div>
  <div class='component inactive'></div>
</div>
```

```js
const locator = page.locator('.list > .component');
await expect(locator).toContainClass(['inactive', 'active', 'inactive']);
```

**Arguments**

- <a id="locator-assertions-to-contain-class-option-expected"></a>`expected` `string | Array<string>`

  A string containing expected class names, separated by spaces, or a list of such strings to assert multiple elements.
- <a id="locator-assertions-to-contain-class-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-contain-class-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-contain-class-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toContainText() {#locator-assertions-to-contain-text}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element that contains the given text. All nested elements will be considered when computing the text content of the element. You can use regular expressions for the value as well.

**Details**

When `expected` parameter is a string, Playwright will normalize whitespaces and line breaks both in the actual text and
in the expected string before matching. When regular expression is used, the actual text is matched as is.

**Usage**

```js
const locator = page.locator('.title');
await expect(locator).toContainText('substring');
await expect(locator).toContainText(/\d messages/);
```

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

```js
// ✓ Contains the right items in the right order
await expect(page.locator('ul > li')).toContainText(['Text 1', 'Text 3']);

// ✖ Wrong order
await expect(page.locator('ul > li')).toContainText(['Text 3', 'Text 2']);

// ✖ No item contains this text
await expect(page.locator('ul > li')).toContainText(['Some 33']);

// ✖ Locator points to the outer list element, not to the list items
await expect(page.locator('ul')).toContainText(['Text 3']);
```

**Arguments**

- <a id="locator-assertions-to-contain-text-option-expected"></a>`expected` `string | RegExp | Array<string | RegExp>` <Badge type="info" text="Added in: v1.18" />

  Expected substring or RegExp or a list of those.
- <a id="locator-assertions-to-contain-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-contain-text-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)* <Badge type="info" text="Added in: v1.23" />

    Whether to perform case-insensitive match. [`ignoreCase`](/api/class-locatorassertions#locator-assertions-to-contain-text-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-contain-text-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-contain-text-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.
  - <a id="locator-assertions-to-contain-text-option-use-inner-text"></a>`useInnerText` `boolean` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Whether to use `element.innerText` instead of `element.textContent` when retrieving DOM node text.


### locatorAssertions.toHaveAccessibleDescription() {#locator-assertions-to-have-accessible-description}

<Badge type="info" text="Added in: v1.44" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element with a given [accessible description](https://w3c.github.io/accname/#dfn-accessible-description).

**Usage**

```js
const locator = page.getByTestId('save-button');
await expect(locator).toHaveAccessibleDescription('Save results to disk');
```

**Arguments**

- <a id="locator-assertions-to-have-accessible-description-option-description"></a>`description` `string | RegExp`

  Expected accessible description.
- <a id="locator-assertions-to-have-accessible-description-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-accessible-description-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)*

    Whether to perform case-insensitive match. [`ignoreCase`](/api/class-locatorassertions#locator-assertions-to-have-accessible-description-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-accessible-description-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-accessible-description-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveAccessibleErrorMessage() {#locator-assertions-to-have-accessible-error-message}

<Badge type="info" text="Added in: v1.50" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element with a given [aria errormessage](https://w3c.github.io/aria/#aria-errormessage).

**Usage**

```js
const locator = page.getByTestId('username-input');
await expect(locator).toHaveAccessibleErrorMessage('Username is required.');
```

**Arguments**

- <a id="locator-assertions-to-have-accessible-error-message-option-error-message"></a>`errorMessage` `string | RegExp`

  Expected accessible error message.
- <a id="locator-assertions-to-have-accessible-error-message-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-accessible-error-message-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)*

    Whether to perform case-insensitive match. [`ignoreCase`](/api/class-locatorassertions#locator-assertions-to-have-accessible-error-message-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-accessible-error-message-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-accessible-error-message-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveAccessibleName() {#locator-assertions-to-have-accessible-name}

<Badge type="info" text="Added in: v1.44" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element with a given [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).

**Usage**

```js
const locator = page.getByTestId('save-button');
await expect(locator).toHaveAccessibleName('Save to disk');
```

**Arguments**

- <a id="locator-assertions-to-have-accessible-name-option-name"></a>`name` `string | RegExp`

  Expected accessible name.
- <a id="locator-assertions-to-have-accessible-name-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-accessible-name-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)*

    Whether to perform case-insensitive match. [`ignoreCase`](/api/class-locatorassertions#locator-assertions-to-have-accessible-name-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-accessible-name-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-accessible-name-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveAttribute() {#locator-assertions-to-have-attribute}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element with given attribute.

**Usage**

```js
const locator = page.locator('input');
await expect(locator).toHaveAttribute('type', 'text');
```

**Arguments**

- <a id="locator-assertions-to-have-attribute-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  Attribute name.
- <a id="locator-assertions-to-have-attribute-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected attribute value.
- <a id="locator-assertions-to-have-attribute-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-attribute-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)* <Badge type="info" text="Added in: v1.40" />

    Whether to perform case-insensitive match. [`ignoreCase`](/api/class-locatorassertions#locator-assertions-to-have-attribute-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-attribute-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-attribute-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveAttribute() {#locator-assertions-to-have-attribute-2}

<Badge type="info" text="Added in: v1.39" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element with given attribute. The method will assert attribute
presence.

```js
const locator = page.locator('input');
// Assert attribute existence.
await expect(locator).toHaveAttribute('disabled');
await expect(locator).not.toHaveAttribute('open');
```

**Arguments**

- <a id="locator-assertions-to-have-attribute-2-option-name"></a>`name` `string`

  Attribute name.
- <a id="locator-assertions-to-have-attribute-2-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-attribute-2-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-attribute-2-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveClass() {#locator-assertions-to-have-class}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element with given CSS classes. When a string is provided, it must fully match the element's `class` attribute. To match individual classes use [`locatorAssertions.toContainClass()`](/api/class-locatorassertions#locator-assertions-to-contain-class).

**Usage**

```html
<div class='middle selected row' id='component'></div>
```

```js
const locator = page.locator('#component');
await expect(locator).toHaveClass('middle selected row');
await expect(locator).toHaveClass(/(^|\s)selected(\s|$)/);
```

When an array is passed, the method asserts that the list of elements located matches the corresponding list of expected class values. Each element's class attribute is matched against the corresponding string or regular expression in the array:

```js
const locator = page.locator('.list > .component');
await expect(locator).toHaveClass(['component', 'component selected', 'component']);
```

**Arguments**

- <a id="locator-assertions-to-have-class-option-expected"></a>`expected` `string | RegExp | Array<string | RegExp>` <Badge type="info" text="Added in: v1.18" />

  Expected class or RegExp or a list of those.
- <a id="locator-assertions-to-have-class-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-class-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-class-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveCount() {#locator-assertions-to-have-count}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) resolves to an exact number of DOM nodes.

**Usage**

```js
const list = page.locator('list > .component');
await expect(list).toHaveCount(3);
```

**Arguments**

- <a id="locator-assertions-to-have-count-option-count"></a>`count` `int` <Badge type="info" text="Added in: v1.18" />

  Expected count.
- <a id="locator-assertions-to-have-count-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-count-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-count-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveCSS() {#locator-assertions-to-have-css}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) resolves to an element with the given computed CSS style.

**Usage**

```js
const locator = page.getByRole('button');
await expect(locator).toHaveCSS('display', 'flex');
```

**Arguments**

- <a id="locator-assertions-to-have-css-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  CSS property name.
- <a id="locator-assertions-to-have-css-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  CSS property value.
- <a id="locator-assertions-to-have-css-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-css-option-pseudo"></a>`pseudo` `"before" | "after"` *(optional)* <Badge type="info" text="Added in: v1.60" />

    Pseudo-element to read computed styles from.
  - <a id="locator-assertions-to-have-css-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-css-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveId() {#locator-assertions-to-have-id}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element with the given DOM Node ID.

**Usage**

```js
const locator = page.getByRole('textbox');
await expect(locator).toHaveId('lastname');
```

**Arguments**

- <a id="locator-assertions-to-have-id-option-id"></a>`id` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Element id.
- <a id="locator-assertions-to-have-id-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-id-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-id-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveJSProperty() {#locator-assertions-to-have-js-property}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element with given JavaScript property. Note that this property can be
of a primitive type as well as a plain serializable JavaScript object.

**Usage**

```js
const locator = page.locator('.component');
await expect(locator).toHaveJSProperty('loaded', true);
```

**Arguments**

- <a id="locator-assertions-to-have-js-property-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  Property name.
- <a id="locator-assertions-to-have-js-property-option-value"></a>`value` `any` <Badge type="info" text="Added in: v1.18" />

  Property value.
- <a id="locator-assertions-to-have-js-property-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-js-property-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-js-property-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveRole() {#locator-assertions-to-have-role}

<Badge type="info" text="Added in: v1.44" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element with a given [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles).

Note that role is matched as a string, disregarding the ARIA role hierarchy. For example, asserting  a superclass role `"checkbox"` on an element with a subclass role `"switch"` will fail.

**Usage**

```js
const locator = page.getByTestId('save-button');
await expect(locator).toHaveRole('button');
```

**Arguments**

- <a id="locator-assertions-to-have-role-option-role"></a>`role` `"alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"`

  Required aria role.
- <a id="locator-assertions-to-have-role-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-role-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-role-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveScreenshot() {#locator-assertions-to-have-screenshot-1}

<Badge type="info" text="Added in: v1.23" /> <Badge type="tip" text="async" />

This function will wait until two consecutive locator screenshots
yield the same result, and then compare the last screenshot with the expectation.

**Usage**

```js
const locator = page.getByRole('button');
await expect(locator).toHaveScreenshot('image.png');

// Store the snapshot in the WebP format.
await expect(locator).toHaveScreenshot('image.webp');
```

Note that screenshot assertions only work with Playwright test runner.

**Arguments**

- <a id="locator-assertions-to-have-screenshot-1-option-name"></a>`name` `string | Array<string>`

  Snapshot name. Must have a `.png` or `.webp` extension, the screenshot is captured in the corresponding format. Both formats are lossless.
- <a id="locator-assertions-to-have-screenshot-1-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-screenshot-1-option-animations"></a>`animations` `"disabled" | "allow"` *(optional)*

    When set to `"disabled"`, stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
    * finite animations are fast-forwarded to completion, so they'll fire `transitionend` event.
    * infinite animations are canceled to initial state, and then played over after the screenshot.

    Defaults to `"disabled"` that disables animations.
  - <a id="locator-assertions-to-have-screenshot-1-option-caret"></a>`caret` `"hide" | "initial"` *(optional)*

    When set to `"hide"`, screenshot will hide text caret. When set to `"initial"`, text caret behavior will not be changed.  Defaults to `"hide"`.
  - <a id="locator-assertions-to-have-screenshot-1-option-mask"></a>`mask` `Array<Locator>` *(optional)*

    Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with
    a pink box `#FF00FF` (customized by [`maskColor`](/api/class-locatorassertions#locator-assertions-to-have-screenshot-1-option-mask-color)) that completely covers its bounding box.
    The mask is also applied to invisible elements, see [Matching only visible elements](../locators.md#matching-only-visible-elements) to disable that.
  - <a id="locator-assertions-to-have-screenshot-1-option-mask-color"></a>`maskColor` `string` *(optional)* <Badge type="info" text="Added in: v1.35" />

    Specify the color of the overlay box for masked elements, in [CSS color format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Default color is pink `#FF00FF`.
  - <a id="locator-assertions-to-have-screenshot-1-option-max-diff-pixel-ratio"></a>`maxDiffPixelRatio` `float` *(optional)*

    An acceptable ratio of pixels that are different to the total amount of pixels, between `0` and `1`. Default is configurable with `TestConfig.expect`. Note that [`threshold`](/api/class-locatorassertions#locator-assertions-to-have-screenshot-1-option-threshold) defines which pixels are considered different.
  - <a id="locator-assertions-to-have-screenshot-1-option-max-diff-pixels"></a>`maxDiffPixels` `int` *(optional)*

    An acceptable amount of pixels that could be different. Default is configurable with `TestConfig.expect`. Note that [`threshold`](/api/class-locatorassertions#locator-assertions-to-have-screenshot-1-option-threshold) defines which pixels are considered different.
  - <a id="locator-assertions-to-have-screenshot-1-option-omit-background"></a>`omitBackground` `boolean` *(optional)*

    Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images.
    Defaults to `false`.
  - <a id="locator-assertions-to-have-screenshot-1-option-scale"></a>`scale` `"css" | "device"` *(optional)*

    When set to `"css"`, screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using `"device"` option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.

    Defaults to `"css"`.
  - <a id="locator-assertions-to-have-screenshot-1-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-screenshot-1-option-style-path"></a>`stylePath` `string | Array<string>` *(optional)* <Badge type="info" text="Added in: v1.41" />

    File name containing the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies to the inner frames.
  - <a id="locator-assertions-to-have-screenshot-1-option-threshold"></a>`threshold` `float` *(optional)*

    An acceptable perceived color difference in the [YIQ color space](https://en.wikipedia.org/wiki/YIQ)
    between the same pixel in compared images, between zero (strict) and one (lax), default is configurable with
    `TestConfig.expect`. Defaults to `0.2`.
  - <a id="locator-assertions-to-have-screenshot-1-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveScreenshot() {#locator-assertions-to-have-screenshot-2}

<Badge type="info" text="Added in: v1.23" /> <Badge type="tip" text="async" />

This function will wait until two consecutive locator screenshots
yield the same result, and then compare the last screenshot with the expectation.

The snapshot is stored in the PNG format. To store it in the WebP format instead, pass a snapshot name with the `.webp` extension.

**Usage**

```js
const locator = page.getByRole('button');
await expect(locator).toHaveScreenshot();
```

Note that screenshot assertions only work with Playwright test runner.

**Arguments**

- <a id="locator-assertions-to-have-screenshot-2-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-screenshot-2-option-animations"></a>`animations` `"disabled" | "allow"` *(optional)*

    When set to `"disabled"`, stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
    * finite animations are fast-forwarded to completion, so they'll fire `transitionend` event.
    * infinite animations are canceled to initial state, and then played over after the screenshot.

    Defaults to `"disabled"` that disables animations.
  - <a id="locator-assertions-to-have-screenshot-2-option-caret"></a>`caret` `"hide" | "initial"` *(optional)*

    When set to `"hide"`, screenshot will hide text caret. When set to `"initial"`, text caret behavior will not be changed.  Defaults to `"hide"`.
  - <a id="locator-assertions-to-have-screenshot-2-option-mask"></a>`mask` `Array<Locator>` *(optional)*

    Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with
    a pink box `#FF00FF` (customized by [`maskColor`](/api/class-locatorassertions#locator-assertions-to-have-screenshot-2-option-mask-color)) that completely covers its bounding box.
    The mask is also applied to invisible elements, see [Matching only visible elements](../locators.md#matching-only-visible-elements) to disable that.
  - <a id="locator-assertions-to-have-screenshot-2-option-mask-color"></a>`maskColor` `string` *(optional)* <Badge type="info" text="Added in: v1.35" />

    Specify the color of the overlay box for masked elements, in [CSS color format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Default color is pink `#FF00FF`.
  - <a id="locator-assertions-to-have-screenshot-2-option-max-diff-pixel-ratio"></a>`maxDiffPixelRatio` `float` *(optional)*

    An acceptable ratio of pixels that are different to the total amount of pixels, between `0` and `1`. Default is configurable with `TestConfig.expect`. Note that [`threshold`](/api/class-locatorassertions#locator-assertions-to-have-screenshot-2-option-threshold) defines which pixels are considered different.
  - <a id="locator-assertions-to-have-screenshot-2-option-max-diff-pixels"></a>`maxDiffPixels` `int` *(optional)*

    An acceptable amount of pixels that could be different. Default is configurable with `TestConfig.expect`. Note that [`threshold`](/api/class-locatorassertions#locator-assertions-to-have-screenshot-2-option-threshold) defines which pixels are considered different.
  - <a id="locator-assertions-to-have-screenshot-2-option-omit-background"></a>`omitBackground` `boolean` *(optional)*

    Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images.
    Defaults to `false`.
  - <a id="locator-assertions-to-have-screenshot-2-option-scale"></a>`scale` `"css" | "device"` *(optional)*

    When set to `"css"`, screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using `"device"` option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.

    Defaults to `"css"`.
  - <a id="locator-assertions-to-have-screenshot-2-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-screenshot-2-option-style-path"></a>`stylePath` `string | Array<string>` *(optional)* <Badge type="info" text="Added in: v1.41" />

    File name containing the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies to the inner frames.
  - <a id="locator-assertions-to-have-screenshot-2-option-threshold"></a>`threshold` `float` *(optional)*

    An acceptable perceived color difference in the [YIQ color space](https://en.wikipedia.org/wiki/YIQ)
    between the same pixel in compared images, between zero (strict) and one (lax), default is configurable with
    `TestConfig.expect`. Defaults to `0.2`.
  - <a id="locator-assertions-to-have-screenshot-2-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveText() {#locator-assertions-to-have-text}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element with the given text. All nested elements will be considered when computing the text content of the element. You can use regular expressions for the value as well.

**Details**

When `expected` parameter is a string, Playwright will normalize whitespaces and line breaks both in the actual text and
in the expected string before matching. When regular expression is used, the actual text is matched as is.

**Usage**

```js
const locator = page.locator('.title');
await expect(locator).toHaveText(/Welcome, Test User/);
await expect(locator).toHaveText(/Welcome, .*/);
```

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

```js
// ✓ Has the right items in the right order
await expect(page.locator('ul > li')).toHaveText(['Text 1', 'Text 2', 'Text 3']);

// ✖ Wrong order
await expect(page.locator('ul > li')).toHaveText(['Text 3', 'Text 2', 'Text 1']);

// ✖ Last item does not match
await expect(page.locator('ul > li')).toHaveText(['Text 1', 'Text 2', 'Text']);

// ✖ Locator points to the outer list element, not to the list items
await expect(page.locator('ul')).toHaveText(['Text 1', 'Text 2', 'Text 3']);
```

**Arguments**

- <a id="locator-assertions-to-have-text-option-expected"></a>`expected` `string | RegExp | Array<string | RegExp>` <Badge type="info" text="Added in: v1.18" />

  Expected string or RegExp or a list of those.
- <a id="locator-assertions-to-have-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-text-option-ignore-case"></a>`ignoreCase` `boolean` *(optional)* <Badge type="info" text="Added in: v1.23" />

    Whether to perform case-insensitive match. [`ignoreCase`](/api/class-locatorassertions#locator-assertions-to-have-text-option-ignore-case) option takes precedence over the corresponding regular expression flag if specified.
  - <a id="locator-assertions-to-have-text-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-text-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.
  - <a id="locator-assertions-to-have-text-option-use-inner-text"></a>`useInnerText` `boolean` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Whether to use `element.innerText` instead of `element.textContent` when retrieving DOM node text.


### locatorAssertions.toHaveValue() {#locator-assertions-to-have-value}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to an element with the given input value. You can use regular expressions for the value as well.

**Usage**

```js
const locator = page.locator('input[type=number]');
await expect(locator).toHaveValue(/[0-9]/);
```

**Arguments**

- <a id="locator-assertions-to-have-value-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  Expected value.
- <a id="locator-assertions-to-have-value-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-value-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-value-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.18" />

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toHaveValues() {#locator-assertions-to-have-values}

<Badge type="info" text="Added in: v1.23" /> <Badge type="tip" text="async" />

Ensures the [Locator](/api/class-locator) points to multi-select/combobox (i.e. a `select` with the `multiple` attribute) and the specified values are selected.

**Usage**

For example, given the following element:

```html
<select id="favorite-colors" multiple>
  <option value="R">Red</option>
  <option value="G">Green</option>
  <option value="B">Blue</option>
</select>
```

```js
const locator = page.locator('id=favorite-colors');
await locator.selectOption(['R', 'G']);
await expect(locator).toHaveValues([/R/, /G/]);
```

**Arguments**

- <a id="locator-assertions-to-have-values-option-values"></a>`values` `Array<string | RegExp>`

  Expected options currently selected.
- <a id="locator-assertions-to-have-values-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-have-values-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-have-values-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toMatchAriaSnapshot() {#locator-assertions-to-match-aria-snapshot}

<Badge type="info" text="Added in: v1.49" /> <Badge type="tip" text="async" />

Asserts that the target element matches the given [accessibility snapshot](../aria-snapshots.md).

**Usage**

```js
await page.goto('https://demo.playwright.dev/todomvc/');
await expect(page.locator('body')).toMatchAriaSnapshot(`
  - heading "todos"
  - textbox "What needs to be done?"
`);
```

**Arguments**

- <a id="locator-assertions-to-match-aria-snapshot-option-expected"></a>`expected` `string`
- <a id="locator-assertions-to-match-aria-snapshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-match-aria-snapshot-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-match-aria-snapshot-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


### locatorAssertions.toMatchAriaSnapshot() {#locator-assertions-to-match-aria-snapshot-2}

<Badge type="info" text="Added in: v1.50" /> <Badge type="tip" text="async" />

Asserts that the target element matches the given [accessibility snapshot](../aria-snapshots.md).

Snapshot is stored in a separate `.aria.yml` file in a location configured by `expect.toMatchAriaSnapshot.pathTemplate` and/or `snapshotPathTemplate` properties in the configuration file.

**Usage**

```js
await expect(page.locator('body')).toMatchAriaSnapshot();
await expect(page.locator('body')).toMatchAriaSnapshot({ name: 'body.aria.yml' });
```

**Arguments**

- <a id="locator-assertions-to-match-aria-snapshot-2-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-assertions-to-match-aria-snapshot-2-option-name"></a>`name` `string` *(optional)*

    Name of the snapshot to store in the snapshot folder corresponding to this test.
    Generates sequential names if not specified.
  - <a id="locator-assertions-to-match-aria-snapshot-2-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    An optional [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that
    can cancel the assertion. Aborting the signal fails the assertion like a timeout: if the signal
    is aborted while the assertion is retrying, or is already aborted before the assertion starts,
    the assertion fails without retrying further.
  - <a id="locator-assertions-to-match-aria-snapshot-2-option-timeout"></a>`timeout` `float` *(optional)*

    Time to retry the assertion for in milliseconds. Defaults to `timeout` in `TestConfig.expect`.


## Properties

### locatorAssertions.not {#locator-assertions-not}

<Badge type="info" text="Added in: v1.20" />

Makes the assertion check for the opposite condition.

**Usage**

For example, this code tests that the Locator doesn't contain text `"error"`:

```js
await expect(locator).not.toContainText('error');
```

**Type**

- `LocatorAssertions`

