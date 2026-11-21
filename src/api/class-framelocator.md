---
title: FrameLocator
outline: 2
---

# FrameLocator

<Badge type="info" text="Added in: v1.17" />

FrameLocator represents a view to the `iframe` on the page. It captures the logic sufficient to retrieve the `iframe` and locate elements in that iframe. FrameLocator can be created with either [`locator.contentFrame()`](/api/class-locator#locator-content-frame), [`page.frameLocator()`](/api/class-page#page-frame-locator) or [`locator.frameLocator()`](/api/class-locator#locator-frame-locator) method.

```js
const locator = page.locator('#my-frame').contentFrame().getByText('Submit');
await locator.click();
```

**Strictness**

Frame locators are strict. This means that all operations on frame locators will throw if more than one element matches a given selector.

```js
// Throws if there are several frames in DOM:
await page.locator('.result-frame').contentFrame().getByRole('button').click();

// Works because we explicitly tell locator to pick the first frame:
await page.locator('.result-frame').contentFrame().first().getByRole('button').click();
```

**Any frame**

Calling [`page.frameLocator()`](/api/class-page#page-frame-locator) or [`frame.frameLocator()`](/api/class-frame#frame-frame-locator) without a selector creates a frame locator that
starts the search in any frame of the subtree - so that you don't
need to locate the iframe first.

```js
// Finds the button in any frame on the page:
await page.frameLocator().getByRole('button').click();

// Finds the iframe with id "my-frame" anywhere on the page, and clicks the button inside it:
await page.frameLocator().locator('#my-frame').contentFrame().getByRole('button').click();
```

Only the start of the search is affected - the rest of the locator is resolved inside a single frame, just like any
other locator. Following the strictness rules above, an error is thrown when elements are matched in multiple frames.

Such a frame locator does not point to a particular `iframe`, so [`frameLocator.owner()`](/api/class-framelocator#frame-locator-owner),
[`frameLocator.first()`](/api/class-framelocator#frame-locator-first), [`frameLocator.last()`](/api/class-framelocator#frame-locator-last) and [`frameLocator.nth()`](/api/class-framelocator#frame-locator-nth) are not supported on it.

**Converting Locator to FrameLocator**

If you have a [Locator](/api/class-locator) object pointing to an `iframe` it can be converted to [FrameLocator](/api/class-framelocator) using [`locator.contentFrame()`](/api/class-locator#locator-content-frame).

**Converting FrameLocator to Locator**

If you have a [FrameLocator](/api/class-framelocator) object it can be converted to [Locator](/api/class-locator) pointing to the same `iframe` using [`frameLocator.owner()`](/api/class-framelocator#frame-locator-owner).

## Methods

### frameLocator.frameLocator() {#frame-locator-frame-locator}

<Badge type="info" text="Added in: v1.17" />

When working with iframes, you can create a frame locator that will enter the iframe and allow selecting elements
in that iframe.

**Arguments**

- <a id="frame-locator-frame-locator-option-selector"></a>`selector` `string`

  A selector to use when resolving DOM element.

**Returns**

- `FrameLocator`


### frameLocator.getByAltText() {#frame-locator-get-by-alt-text}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements by their alt text.

**Usage**

For example, this method will find the image by alt text "Playwright logo":

```html
<img alt='Playwright logo'>
```

```js
await page.getByAltText('Playwright logo').click();
```

**Arguments**

- <a id="frame-locator-get-by-alt-text-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="frame-locator-get-by-alt-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-locator-get-by-alt-text-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### frameLocator.getByLabel() {#frame-locator-get-by-label}

<Badge type="info" text="Added in: v1.27" />

Allows locating input elements by the text of the associated `<label>` or `aria-labelledby` element, or by the `aria-label` attribute.

Associated `<label>` elements are also supported for form-associated custom elements.

**Usage**

For example, this method will find inputs by label "Username" and "Password" in the following DOM:

```html
<input aria-label="Username">
<label for="password-input">Password:</label>
<input id="password-input">
```

```js
await page.getByLabel('Username').fill('john');
await page.getByLabel('Password').fill('secret');
```

**Arguments**

- <a id="frame-locator-get-by-label-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="frame-locator-get-by-label-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-locator-get-by-label-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### frameLocator.getByPlaceholder() {#frame-locator-get-by-placeholder}

<Badge type="info" text="Added in: v1.27" />

Allows locating input elements by the placeholder text.

**Usage**

For example, consider the following DOM structure.

```html
<input type="email" placeholder="name@example.com" />
```

You can fill the input after locating it by the placeholder text:

```js
await page
    .getByPlaceholder('name@example.com')
    .fill('playwright@microsoft.com');
```

**Arguments**

- <a id="frame-locator-get-by-placeholder-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="frame-locator-get-by-placeholder-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-locator-get-by-placeholder-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### frameLocator.getByRole() {#frame-locator-get-by-role}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements by their [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles), [ARIA attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) and [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).

**Usage**

Consider the following DOM structure.

```html
<h3>Sign up</h3>
<label>
  <input type="checkbox" /> Subscribe
</label>
<br/>
<button>Submit</button>
```

You can locate each element by its implicit role:

```js
await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

await page.getByRole('checkbox', { name: 'Subscribe' }).check();

await page.getByRole('button', { name: /submit/i }).click();
```

**Details**

Role selector **does not replace** accessibility audits and conformance tests, but rather gives early feedback about the ARIA guidelines.

Many html elements have an implicitly [defined role](https://w3c.github.io/html-aam/#html-element-role-mappings) that is recognized by the role selector. You can find all the [supported roles here](https://www.w3.org/TR/wai-aria-1.2/#role_definitions). ARIA guidelines **do not recommend** duplicating implicit roles and attributes by setting `role` and/or `aria-*` attributes to default values.

**Arguments**

- <a id="frame-locator-get-by-role-option-role"></a>`role` `"alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"`

  Required aria role.
- <a id="frame-locator-get-by-role-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-locator-get-by-role-option-checked"></a>`checked` `boolean` *(optional)*

    An attribute that is usually set by `aria-checked` or native `<input type=checkbox>` controls.

    Learn more about [`aria-checked`](https://www.w3.org/TR/wai-aria-1.2/#aria-checked).
  - <a id="frame-locator-get-by-role-option-description"></a>`description` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.60" />

    Option to match the [accessible description](https://w3c.github.io/accname/#dfn-accessible-description). By default, matching is case-insensitive and searches for a substring, use [`exact`](/api/class-framelocator#frame-locator-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible description](https://w3c.github.io/accname/#dfn-accessible-description).
  - <a id="frame-locator-get-by-role-option-disabled"></a>`disabled` `boolean` *(optional)*

    An attribute that is usually set by `aria-disabled` or `disabled`.

    ::: info
    Unlike most other attributes, `disabled` is inherited through the DOM hierarchy.
    Learn more about [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled).
    :::
  - <a id="frame-locator-get-by-role-option-exact"></a>`exact` `boolean` *(optional)* <Badge type="info" text="Added in: v1.28" />

    Whether [`name`](/api/class-framelocator#frame-locator-get-by-role-option-name) and [`description`](/api/class-framelocator#frame-locator-get-by-role-option-description) are matched exactly: case-sensitive and whole-string. Defaults to false. Ignored when the value is a regular expression. Note that exact match still trims whitespace.
  - <a id="frame-locator-get-by-role-option-expanded"></a>`expanded` `boolean` *(optional)*

    An attribute that is usually set by `aria-expanded`.

    Learn more about [`aria-expanded`](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded).
  - <a id="frame-locator-get-by-role-option-include-hidden"></a>`includeHidden` `boolean` *(optional)*

    Option that controls whether hidden elements are matched. By default, only non-hidden elements, as [defined by ARIA](https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion), are matched by role selector.

    Learn more about [`aria-hidden`](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden).
  - <a id="frame-locator-get-by-role-option-level"></a>`level` `int` *(optional)*

    A number attribute that is usually present for roles `heading`, `listitem`, `row`, `treeitem`, with default values for `<h1>-<h6>` elements.

    Learn more about [`aria-level`](https://www.w3.org/TR/wai-aria-1.2/#aria-level).
  - <a id="frame-locator-get-by-role-option-name"></a>`name` `string | RegExp` *(optional)*

    Option to match the [accessible name](https://w3c.github.io/accname/#dfn-accessible-name). By default, matching is case-insensitive and searches for a substring, use [`exact`](/api/class-framelocator#frame-locator-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
  - <a id="frame-locator-get-by-role-option-pressed"></a>`pressed` `boolean` *(optional)*

    An attribute that is usually set by `aria-pressed`.

    Learn more about [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.2/#aria-pressed).
  - <a id="frame-locator-get-by-role-option-selected"></a>`selected` `boolean` *(optional)*

    An attribute that is usually set by `aria-selected`.

    Learn more about [`aria-selected`](https://www.w3.org/TR/wai-aria-1.2/#aria-selected).

**Returns**

- `Locator`


### frameLocator.getByTestId() {#frame-locator-get-by-test-id}

<Badge type="info" text="Added in: v1.27" />

Locate element by the test id.

**Usage**

Consider the following DOM structure.

```html
<button data-testid="directions">Itinéraire</button>
```

You can locate the element by its test id:

```js
await page.getByTestId('directions').click();
```

**Details**

By default, the `data-testid` attribute is used as a test id. Use [`selectors.setTestIdAttribute()`](/api/class-selectors#selectors-set-test-id-attribute) to configure a different test id attribute if necessary.

```js
// Set custom test id attribute from @playwright/test config:
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    testIdAttribute: 'data-pw'
  },
});
```

**Arguments**

- <a id="frame-locator-get-by-test-id-option-test-id"></a>`testId` `string | RegExp`

  Id to locate the element by.

**Returns**

- `Locator`


### frameLocator.getByText() {#frame-locator-get-by-text}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements that contain given text.

See also [`locator.filter()`](/api/class-locator#locator-filter) that allows to match by another criteria, like an accessible role, and then filter by the text content.

**Usage**

Consider the following DOM structure:

```html
<div>Hello <span>world</span></div>
<div>Hello</div>
```

You can locate by text substring, exact string, or a regular expression:

```js
// Matches <span>
page.getByText('world');

// Matches first <div>
page.getByText('Hello world');

// Matches second <div>
page.getByText('Hello', { exact: true });

// Matches both <div>s
page.getByText(/Hello/);

// Matches second <div>
page.getByText(/^hello$/i);
```

**Details**

Matching by text always normalizes whitespace, even with exact match. For example, it turns multiple spaces into one, turns line breaks into spaces and ignores leading and trailing whitespace.

Input elements of the type `button` and `submit` are matched by their `value` instead of the text content. For example, locating by text `"Log in"` matches `<input type=button value="Log in">`.

**Arguments**

- <a id="frame-locator-get-by-text-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="frame-locator-get-by-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-locator-get-by-text-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### frameLocator.getByTitle() {#frame-locator-get-by-title}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements by their title attribute.

**Usage**

Consider the following DOM structure.

```html
<span title='Issues count'>25 issues</span>
```

You can check the issues count after locating it by the title text:

```js
await expect(page.getByTitle('Issues count')).toHaveText('25 issues');
```

**Arguments**

- <a id="frame-locator-get-by-title-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="frame-locator-get-by-title-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-locator-get-by-title-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### frameLocator.locator() {#frame-locator-locator}

<Badge type="info" text="Added in: v1.17" />

The method finds an element matching the specified selector in the locator's subtree. It also accepts filter options, similar to [`locator.filter()`](/api/class-locator#locator-filter) method.

[Learn more about locators](../locators.md).

**Arguments**

- <a id="frame-locator-locator-option-selector-or-locator"></a>`selectorOrLocator` `string | Locator`

  A selector or locator to use when resolving DOM element.
- <a id="frame-locator-locator-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-locator-locator-option-has"></a>`has` `Locator` *(optional)*

    Narrows down the results of the method to those which contain elements matching this relative locator.
    For example, `article` that has `text=Playwright` matches `<article><div>Playwright</div></article>`.

    Inner locator **must be relative** to the outer locator and is queried starting with the outer locator match, not the document root. For example, you can find `content` that has `div` in `<article><content><div>Playwright</div></content></article>`. However, looking for `content` that has `article div` will fail, because the inner locator must be relative and should not use any elements outside the `content`.

    Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator](/api/class-framelocator)s.
  - <a id="frame-locator-locator-option-has-not"></a>`hasNot` `Locator` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the outer one.
    For example, `article` that does not have `div` matches `<article><span>Playwright</span></article>`.

    Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator](/api/class-framelocator)s.
  - <a id="frame-locator-locator-option-has-not-text"></a>`hasNotText` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
  - <a id="frame-locator-locator-option-has-text"></a>`hasText` `string | RegExp` *(optional)*

    Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
    For example, `"Playwright"` matches `<article><div>Playwright</div></article>`.

**Returns**

- `Locator`


### frameLocator.owner() {#frame-locator-owner}

<Badge type="info" text="Added in: v1.43" />

Returns a [Locator](/api/class-locator) object pointing to the same `iframe` as this frame locator.

Useful when you have a [FrameLocator](/api/class-framelocator) object obtained somewhere, and later on would like to interact with the `iframe` element.

For a reverse operation, use [`locator.contentFrame()`](/api/class-locator#locator-content-frame).

**Usage**

```js
const frameLocator = page.locator('iframe[name="embedded"]').contentFrame();
// ...
const locator = frameLocator.owner();
await expect(locator).toBeVisible();
```

**Returns**

- `Locator`


## Deprecated

### frameLocator.first() {#frame-locator-first}

<Badge type="info" text="Added in: v1.17" />

::: danger Deprecated
Use [`locator.first()`](/api/class-locator#locator-first) followed by [`locator.contentFrame()`](/api/class-locator#locator-content-frame) instead.
:::

Returns locator to the first matching frame.

**Returns**

- `FrameLocator`


### frameLocator.last() {#frame-locator-last}

<Badge type="info" text="Added in: v1.17" />

::: danger Deprecated
Use [`locator.last()`](/api/class-locator#locator-last) followed by [`locator.contentFrame()`](/api/class-locator#locator-content-frame) instead.
:::

Returns locator to the last matching frame.

**Returns**

- `FrameLocator`


### frameLocator.nth() {#frame-locator-nth}

<Badge type="info" text="Added in: v1.17" />

::: danger Deprecated
Use [`locator.nth()`](/api/class-locator#locator-nth) followed by [`locator.contentFrame()`](/api/class-locator#locator-content-frame) instead.
:::

Returns locator to the n-th matching frame. It's zero based, `nth(0)` selects the first frame.

**Arguments**

- <a id="frame-locator-nth-option-index"></a>`index` `int`

**Returns**

- `FrameLocator`

