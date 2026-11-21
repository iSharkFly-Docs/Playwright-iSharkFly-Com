---
title: Locator
outline: 2
---

# Locator

<Badge type="info" text="Added in: v1.14" />

Locators are the central piece of Playwright's auto-waiting and retry-ability. In a nutshell, locators represent
a way to find element(s) on the page at any moment. A locator can be created with the [`page.locator()`](/python/api/class-page#page-locator) method.

[Learn more about locators](../locators.md).

## Methods

### locator.all() {#locator-all}

<Badge type="info" text="Added in: v1.29" />

When the locator points to a list of elements, this returns an array of locators, pointing to their respective elements.

::: info
[`locator.all()`](/python/api/class-locator#locator-all) does not wait for elements to match the locator, and instead immediately returns whatever is present in the page.

When the list of elements changes dynamically, [`locator.all()`](/python/api/class-locator#locator-all) will produce unpredictable and flaky results.

When the list of elements is stable, but loaded dynamically, wait for the full list to finish loading before calling [`locator.all()`](/python/api/class-locator#locator-all).
:::

**Usage**

::: code-group

```python [Async]
for li in await page.get_by_role('listitem').all():
  await li.click();
```

```python [Sync]
for li in page.get_by_role('listitem').all():
  li.click();
```

:::

**Returns**

- `Array<Locator>`


### locator.all_inner_texts() {#locator-all-inner-texts}

<Badge type="info" text="Added in: v1.14" />

Returns an array of `node.innerText` values for all matching nodes.

:::warning[Asserting text]

If you need to assert text on the page, prefer [`locator_assertions.to_have_text()`](/python/api/class-locatorassertions#locator-assertions-to-have-text) with [`use_inner_text`](/python/api/class-locatorassertions#locator-assertions-to-have-text-option-use-inner-text) option to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Usage**

::: code-group

```python [Async]
texts = await page.get_by_role("link").all_inner_texts()
```

```python [Sync]
texts = page.get_by_role("link").all_inner_texts()
```

:::

**Returns**

- `Array<string>`


### locator.all_text_contents() {#locator-all-text-contents}

<Badge type="info" text="Added in: v1.14" />

Returns an array of `node.textContent` values for all matching nodes.

:::warning[Asserting text]

If you need to assert text on the page, prefer [`locator_assertions.to_have_text()`](/python/api/class-locatorassertions#locator-assertions-to-have-text) to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Usage**

::: code-group

```python [Async]
texts = await page.get_by_role("link").all_text_contents()
```

```python [Sync]
texts = page.get_by_role("link").all_text_contents()
```

:::

**Returns**

- `Array<string>`


### locator.and_() {#locator-and}

<Badge type="info" text="Added in: v1.34" />

Creates a locator that matches both this locator and the argument locator.

**Usage**

The following example finds a button with a specific title.

::: code-group

```python [Async]
button = page.get_by_role("button").and_(page.get_by_title("Subscribe"))
```

```python [Sync]
button = page.get_by_role("button").and_(page.get_by_title("Subscribe"))
```

:::

**Arguments**

- <a id="locator-and-option-locator"></a>`locator` `Locator`

  Additional locator to match.

**Returns**

- `Locator`


### locator.aria_snapshot() {#locator-aria-snapshot}

<Badge type="info" text="Added in: v1.49" />

Captures the aria snapshot of the given element.
Read more about [aria snapshots](../aria-snapshots.md) and [`locator_assertions.to_match_aria_snapshot()`](/python/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) for the corresponding assertion.

**Usage**

::: code-group

```python [Async]
await page.get_by_role("link").aria_snapshot()
```

```python [Sync]
page.get_by_role("link").aria_snapshot()
```

:::

**Details**

This method captures the aria snapshot of the given element. The snapshot is a string that represents the state of the element and its children.
The snapshot can be used to assert the state of the element in the test, or to compare it to state in the future.

The ARIA snapshot is represented using [YAML](https://yaml.org/spec/1.2.2/) markup language:
* The keys of the objects are the roles and optional accessible names of the elements.
* The values are either text content or an array of child elements.
* Generic static text can be represented with the `text` key.

Below is the HTML markup and the respective ARIA snapshot:

```html
<ul aria-label="Links">
  <li><a href="/">Home</a></li>
  <li><a href="/about">About</a></li>
<ul>
```

```yml
- list "Links":
  - listitem:
    - link "Home"
  - listitem:
    - link "About"
```

An AI-optimized snapshot, controlled by [`mode`](/python/api/class-locator#locator-aria-snapshot-option-mode), is different from a default snapshot:
1. Includes element references `[ref=e2]`.
   2. Does not wait for an element matching the locator, and throws when no elements match.
   3. Includes snapshots of `<iframe>`s inside the target.
   4. Can omit names that repeat printed descendants, such as a heading containing a link. Names that identify dialogs, landmarks, groups, tables and table headers are retained.

**Arguments**

- <a id="locator-aria-snapshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-aria-snapshot-option-boxes"></a>`boxes` `boolean` *(optional)* <Badge type="info" text="Added in: v1.60" />

    When `true`, appends each element's bounding box as `[box=x,y,width,height]` to the snapshot. Coordinates are
    relative to the viewport, in CSS pixels, as returned by [`Element.getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
    Defaults to `false`.
  - <a id="locator-aria-snapshot-option-depth"></a>`depth` `int` *(optional)* <Badge type="info" text="Added in: v1.59" />

    When specified, limits the depth of the snapshot.
  - <a id="locator-aria-snapshot-option-mode"></a>`mode` `"ai" | "default"` *(optional)* <Badge type="info" text="Added in: v1.59" />

    When set to `"ai"`, returns a snapshot optimized for AI consumption. Defaults to `"default"`. See details for more information.
  - <a id="locator-aria-snapshot-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `string`


### locator.blur() {#locator-blur}

<Badge type="info" text="Added in: v1.28" />

Calls [blur](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/blur) on the element.

**Arguments**

- <a id="locator-blur-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-blur-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.bounding_box() {#locator-bounding-box}

<Badge type="info" text="Added in: v1.14" />

This method returns the bounding box of the element matching the locator, or `null` if the element is not visible. The bounding box is
calculated relative to the main frame viewport - which is usually the same as the browser window.

**Details**

Scrolling affects the returned bounding box, similarly to
[Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect). That
means `x` and/or `y` may be negative.

Elements from child frames return the bounding box relative to the main frame, unlike the
[Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).

Assuming the page is static, it is safe to use bounding box coordinates to perform input. For example, the following
snippet should click the center of the element.

**Usage**

::: code-group

```python [Async]
box = await page.get_by_role("button").bounding_box()
await page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
```

```python [Sync]
box = page.get_by_role("button").bounding_box()
page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
```

:::

**Arguments**

- <a id="locator-bounding-box-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-bounding-box-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `null | Object`


### locator.check() {#locator-check}

<Badge type="info" text="Added in: v1.14" />

Ensure that checkbox or radio element is checked.

**Details**

Performs the following steps:
1. Ensure that element is a checkbox or a radio input. If not, this method throws. If the element is already
   checked, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/python/api/class-locator#locator-check-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/python/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now checked. If not, this method throws.

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-locator#locator-check-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

**Usage**

::: code-group

```python [Async]
await page.get_by_role("checkbox").check()
```

```python [Sync]
page.get_by_role("checkbox").check()
```

:::

**Arguments**

- <a id="locator-check-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-check-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="locator-check-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="locator-check-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="locator-check-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="locator-check-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="locator-check-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### locator.clear() {#locator-clear}

<Badge type="info" text="Added in: v1.28" />

Clear the input field.

**Details**

This method waits for [actionability](../actionability.md) checks, focuses the element, clears it and triggers an `input` event after clearing.

If the target element is not an `<input>`, `<textarea>` or `[contenteditable]` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be cleared instead.

**Usage**

::: code-group

```python [Async]
await page.get_by_role("textbox").clear()
```

```python [Sync]
page.get_by_role("textbox").clear()
```

:::

**Arguments**

- <a id="locator-clear-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-clear-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="locator-clear-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="locator-clear-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.click() {#locator-click}

<Badge type="info" text="Added in: v1.14" />

Click an element.

**Details**

This method clicks the element by performing the following steps:
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/python/api/class-locator#locator-click-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/python/api/class-page#page-mouse) to click in the center of the element, or the specified [`position`](/python/api/class-locator#locator-click-option-position).
1. Wait for initiated navigations to either succeed or fail, unless [`no_wait_after`](/python/api/class-locator#locator-click-option-no-wait-after) option is set.

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-locator#locator-click-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

**Usage**

Click a button:

::: code-group

```python [Async]
await page.get_by_role("button").click()
```

```python [Sync]
page.get_by_role("button").click()
```

:::

Shift-right-click at a specific position on a canvas:

::: code-group

```python [Async]
await page.locator("canvas").click(
    button="right", modifiers=["Shift"], position={"x": 23, "y": 32}
)
```

```python [Sync]
page.locator("canvas").click(
    button="right", modifiers=["Shift"], position={"x": 23, "y": 32}
)
```

:::

**Arguments**

- <a id="locator-click-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-click-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="locator-click-option-click-count"></a>`click_count` `int` *(optional)*

    defaults to 1. See [UIEvent.detail].
  - <a id="locator-click-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.
  - <a id="locator-click-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="locator-click-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="locator-click-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can
    opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating
    to inaccessible pages. Defaults to `false`.
  - <a id="locator-click-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="locator-click-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="locator-click-option-steps"></a>`steps` `int` *(optional)* <Badge type="info" text="Added in: v1.57" />

    Defaults to 1. Sends `n` interpolated `mousemove` events to represent travel between Playwright's current cursor position and the provided destination. When set to 1, emits a single `mousemove` event at the destination location.
  - <a id="locator-click-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="locator-click-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### locator.content_frame() {#locator-content-frame}

<Badge type="info" text="Added in: v1.43" />

Returns a [FrameLocator](/python/api/class-framelocator) object pointing to the same `iframe` as this locator.

Useful when you have a [Locator](/python/api/class-locator) object obtained somewhere, and later on would like to interact with the content inside the frame.

For a reverse operation, use [`frame_locator.owner()`](/python/api/class-framelocator#frame-locator-owner).

**Usage**

::: code-group

```python [Async]
locator = page.locator("iframe[name=\"embedded\"]")
# ...
frame_locator = locator.content_frame
await frame_locator.get_by_role("button").click()
```

```python [Sync]
locator = page.locator("iframe[name=\"embedded\"]")
# ...
frame_locator = locator.content_frame
frame_locator.get_by_role("button").click()
```

:::

**Returns**

- `FrameLocator`


### locator.count() {#locator-count}

<Badge type="info" text="Added in: v1.14" />

Returns the number of elements matching the locator.

:::warning[Asserting count]

If you need to assert the number of elements on the page, prefer [`locator_assertions.to_have_count()`](/python/api/class-locatorassertions#locator-assertions-to-have-count) to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Usage**

::: code-group

```python [Async]
count = await page.get_by_role("listitem").count()
```

```python [Sync]
count = page.get_by_role("listitem").count()
```

:::

**Returns**

- `int`


### locator.dblclick() {#locator-dblclick}

<Badge type="info" text="Added in: v1.14" />

Double-click an element.

**Details**

This method double clicks the element by performing the following steps:
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/python/api/class-locator#locator-dblclick-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/python/api/class-page#page-mouse) to double click in the center of the element, or the specified [`position`](/python/api/class-locator#locator-dblclick-option-position).

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-locator#locator-dblclick-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

::: info
`element.dblclick()` dispatches two `click` events and a single `dblclick` event.
:::

**Arguments**

- <a id="locator-dblclick-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-dblclick-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="locator-dblclick-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.
  - <a id="locator-dblclick-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="locator-dblclick-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="locator-dblclick-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="locator-dblclick-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="locator-dblclick-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="locator-dblclick-option-steps"></a>`steps` `int` *(optional)* <Badge type="info" text="Added in: v1.57" />

    Defaults to 1. Sends `n` interpolated `mousemove` events to represent travel between Playwright's current cursor position and the provided destination. When set to 1, emits a single `mousemove` event at the destination location.
  - <a id="locator-dblclick-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="locator-dblclick-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### locator.describe() {#locator-describe}

<Badge type="info" text="Added in: v1.53" />

Describes the locator, description is used in the trace viewer and reports.
Returns the locator pointing to the same element.

**Usage**

::: code-group

```python [Async]
button = page.get_by_test_id("btn-sub").describe("Subscribe button")
await button.click()
```

```python [Sync]
button = page.get_by_test_id("btn-sub").describe("Subscribe button")
button.click()
```

:::

**Arguments**

- <a id="locator-describe-option-description"></a>`description` `string`

  Locator description.

**Returns**

- `Locator`


### locator.description() {#locator-description}

<Badge type="info" text="Added in: v1.57" />

Returns locator description previously set with [`locator.describe()`](/python/api/class-locator#locator-describe). Returns `null` if no custom description has been set.

**Usage**

::: code-group

```python [Async]
button = page.get_by_role("button").describe("Subscribe button")
print(button.description())  # "Subscribe button"

input = page.get_by_role("textbox")
print(input.description())  # None
```

```python [Sync]
button = page.get_by_role("button").describe("Subscribe button")
print(button.description())  # "Subscribe button"

input = page.get_by_role("textbox")
print(input.description())  # None
```

:::

**Returns**

- `null | string`


### locator.dispatch_event() {#locator-dispatch-event}

<Badge type="info" text="Added in: v1.14" />

Programmatically dispatch an event on the matching element.

**Usage**

::: code-group

```python [Async]
await locator.dispatch_event("click")
```

```python [Sync]
locator.dispatch_event("click")
```

:::

**Details**

The snippet above dispatches the `click` event on the element. Regardless of the visibility state of the element, `click`
is dispatched. This is equivalent to calling
[element.click()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click).

Under the hood, it creates an instance of an event based on the given [`type`](/python/api/class-locator#locator-dispatch-event-option-type), initializes it with
[`event_init`](/python/api/class-locator#locator-dispatch-event-option-event-init) properties and dispatches it on the element. Events are `composed`, `cancelable` and bubble by
default.

Since [`event_init`](/python/api/class-locator#locator-dispatch-event-option-event-init) is event-specific, please refer to the events documentation for the lists of initial
properties:
* [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/DeviceMotionEvent)
* [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/DeviceOrientationEvent)
* [DragEvent](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/DragEvent)
* [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event)
* [FocusEvent](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/FocusEvent)
* [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent)
* [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent)
* [PointerEvent](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/PointerEvent)
* [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent)
* [WheelEvent](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/WheelEvent)

You can also specify [JSHandle](/python/api/class-jshandle) as the property value if you want live objects to be passed into the event:

::: code-group

```python [Async]
data_transfer = await page.evaluate_handle("new DataTransfer()")
await locator.dispatch_event("#source", "dragstart", {"dataTransfer": data_transfer})
```

```python [Sync]
data_transfer = page.evaluate_handle("new DataTransfer()")
locator.dispatch_event("#source", "dragstart", {"dataTransfer": data_transfer})
```

:::

**Arguments**

- <a id="locator-dispatch-event-option-type"></a>`type` `string`

  DOM event type: `"click"`, `"dragstart"`, etc.
- <a id="locator-dispatch-event-option-event-init"></a>`event_init` `EvaluationArgument` *(optional)*

  Optional event-specific initialization properties.
- <a id="locator-dispatch-event-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-dispatch-event-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.drag_to() {#locator-drag-to}

<Badge type="info" text="Added in: v1.18" />

Drag the source element towards the target element and drop it.

**Details**

This method drags the locator to another target locator or target position. It will
first move to the source element, perform a `mousedown`, then move to the target
element or position and perform a `mouseup`.

**Usage**

::: code-group

```python [Async]
source = page.locator("#source")
target = page.locator("#target")

await source.drag_to(target)
# or specify exact positions relative to the top-left corners of the elements:
await source.drag_to(
  target,
  source_position={"x": 34, "y": 7},
  target_position={"x": 10, "y": 20}
)
```

```python [Sync]
source = page.locator("#source")
target = page.locator("#target")

source.drag_to(target)
# or specify exact positions relative to the top-left corners of the elements:
source.drag_to(
  target,
  source_position={"x": 34, "y": 7},
  target_position={"x": 10, "y": 20}
)
```

:::

**Arguments**

- <a id="locator-drag-to-option-target"></a>`target` `Locator`

  Locator of the element to drag to.
- <a id="locator-drag-to-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-drag-to-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="locator-drag-to-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="locator-drag-to-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="locator-drag-to-option-source-position"></a>`source_position` `Object` *(optional)*

    Clicks on the source element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.

    - `x` `float`
    - `y` `float`
  - <a id="locator-drag-to-option-steps"></a>`steps` `int` *(optional)* <Badge type="info" text="Added in: v1.57" />

    Defaults to 1. Sends `n` interpolated `mousemove` events to represent travel between the `mousedown` and `mouseup` of the drag. When set to 1, emits a single `mousemove` event at the destination location.
  - <a id="locator-drag-to-option-target-position"></a>`target_position` `Object` *(optional)*

    Drops on the target element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.

    - `x` `float`
    - `y` `float`
  - <a id="locator-drag-to-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="locator-drag-to-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### locator.drop() {#locator-drop}

<Badge type="info" text="Added in: v1.60" />

Simulate an external drag-and-drop of files or clipboard-like data onto this locator.

**Details**

Dispatches the native `dragenter`, `dragover`, and `drop` events at the center of the
target element with a synthetic [DataTransfer] carrying the provided files and/or data
entries. Works cross-browser by constructing the [DataTransfer] in the page context.

If the target element's `dragover` listener does not call `preventDefault()`, the target
is considered to have rejected the drop: Playwright dispatches `dragleave` and this
method throws.

**Usage**

Drop a file buffer onto an upload area:

Drop plain text and a URL together:

**Arguments**

- <a id="locator-drop-option-payload"></a>`payload` `Object`

  Data to drop onto the target. Provide `files` (file paths or in-memory buffers), `data`
  (a mime-type → string map for clipboard-like content such as `text/plain`, `text/html`,
  `text/uri-list`), or both.

  - `files` `path | Array<path> | Object | Array<Object>` *(optional)*

    - `name` `string`

      File name
    - `mime_type` `string`

      File type
    - `buffer` `Buffer`

      File content
  - `data` `Object<string, string>` *(optional)*
- <a id="locator-drop-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-drop-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="locator-drop-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.element_handle() {#locator-element-handle}

<Badge type="info" text="Added in: v1.14" />

::: warning Discouraged
Always prefer using [Locator](/python/api/class-locator)s and web assertions over [ElementHandle](/python/api/class-elementhandle)s because latter are inherently racy.
:::

Resolves given locator to the first matching DOM element. If there are no matching elements, waits for one. If multiple elements match the locator, throws.

**Arguments**

- <a id="locator-element-handle-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-element-handle-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `ElementHandle`


### locator.element_handles() {#locator-element-handles}

<Badge type="info" text="Added in: v1.14" />

::: warning Discouraged
Always prefer using [Locator](/python/api/class-locator)s and web assertions over [ElementHandle](/python/api/class-elementhandle)s because latter are inherently racy.
:::

Resolves given locator to all matching DOM elements. If there are no matching elements, returns an empty list.

**Returns**

- `Array<ElementHandle>`


### locator.evaluate() {#locator-evaluate}

<Badge type="info" text="Added in: v1.14" />

Execute JavaScript code in the page, taking the matching element as an argument.

**Details**

Returns the return value of [`expression`](/python/api/class-locator#locator-evaluate-option-expression), called with the matching element as a first argument, and [`arg`](/python/api/class-locator#locator-evaluate-option-arg) as a second argument.

If [`expression`](/python/api/class-locator#locator-evaluate-option-expression) returns a [Promise], this method will wait for the promise to resolve and return its value.

If [`expression`](/python/api/class-locator#locator-evaluate-option-expression) throws or rejects, this method throws.

**Usage**

Passing argument to [`expression`](/python/api/class-locator#locator-evaluate-option-expression):

::: code-group

```python [Async]
result = await page.get_by_testid("myId").evaluate("(element, [x, y]) => element.textContent + ' ' + x * y", [7, 8])
print(result) # prints "myId text 56"
```

```python [Sync]
result = page.get_by_testid("myId").evaluate("(element, [x, y]) => element.textContent + ' ' + x * y", [7, 8])
print(result) # prints "myId text 56"
```

:::

**Arguments**

- <a id="locator-evaluate-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="locator-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/python/api/class-locator#locator-evaluate-option-expression).
- <a id="locator-evaluate-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-evaluate-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds to wait for the locator before evaluating. Note that after locator is resolved, evaluation itself is not limited by the timeout. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `Serializable`


### locator.evaluate_all() {#locator-evaluate-all}

<Badge type="info" text="Added in: v1.14" />

Execute JavaScript code in the page, taking all matching elements as an argument.

**Details**

Returns the return value of [`expression`](/python/api/class-locator#locator-evaluate-all-option-expression), called with an array of all matching elements as a first argument, and [`arg`](/python/api/class-locator#locator-evaluate-all-option-arg) as a second argument.

If [`expression`](/python/api/class-locator#locator-evaluate-all-option-expression) returns a [Promise], this method will wait for the promise to resolve and return its value.

If [`expression`](/python/api/class-locator#locator-evaluate-all-option-expression) throws or rejects, this method throws.

**Usage**

::: code-group

```python [Async]
locator = page.locator("div")
more_than_ten = await locator.evaluate_all("(divs, min) => divs.length > min", 10)
```

```python [Sync]
locator = page.locator("div")
more_than_ten = locator.evaluate_all("(divs, min) => divs.length > min", 10)
```

:::

**Arguments**

- <a id="locator-evaluate-all-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="locator-evaluate-all-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/python/api/class-locator#locator-evaluate-all-option-expression).

**Returns**

- `Serializable`


### locator.evaluate_handle() {#locator-evaluate-handle}

<Badge type="info" text="Added in: v1.14" />

Execute JavaScript code in the page, taking the matching element as an argument, and return a [JSHandle](/python/api/class-jshandle) with the result.

**Details**

Returns the return value of [`expression`](/python/api/class-locator#locator-evaluate-handle-option-expression) as a[JSHandle](/python/api/class-jshandle), called with the matching element as a first argument, and [`arg`](/python/api/class-locator#locator-evaluate-handle-option-arg) as a second argument.

The only difference between [`locator.evaluate()`](/python/api/class-locator#locator-evaluate) and [`locator.evaluate_handle()`](/python/api/class-locator#locator-evaluate-handle) is that [`locator.evaluate_handle()`](/python/api/class-locator#locator-evaluate-handle) returns [JSHandle](/python/api/class-jshandle).

If [`expression`](/python/api/class-locator#locator-evaluate-handle-option-expression) returns a [Promise], this method will wait for the promise to resolve and return its value.

If [`expression`](/python/api/class-locator#locator-evaluate-handle-option-expression) throws or rejects, this method throws.

See [`page.evaluate_handle()`](/python/api/class-page#page-evaluate-handle) for more details.

**Arguments**

- <a id="locator-evaluate-handle-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="locator-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/python/api/class-locator#locator-evaluate-handle-option-expression).
- <a id="locator-evaluate-handle-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-evaluate-handle-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds to wait for the locator before evaluating. Note that after locator is resolved, evaluation itself is not limited by the timeout. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.

**Returns**

- `JSHandle`


### locator.fill() {#locator-fill}

<Badge type="info" text="Added in: v1.14" />

Set a value to the input field.

**Usage**

::: code-group

```python [Async]
await page.get_by_role("textbox").fill("example value")
```

```python [Sync]
page.get_by_role("textbox").fill("example value")
```

:::

**Details**

This method waits for [actionability](../actionability.md) checks, focuses the element, fills it and triggers an `input` event after filling. Note that you can pass an empty string to clear the input field.

If the target element is not an `<input>`, `<textarea>` or `[contenteditable]` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be filled instead.

To send fine-grained keyboard events, use [`locator.press_sequentially()`](/python/api/class-locator#locator-press-sequentially).

**Arguments**

- <a id="locator-fill-option-value"></a>`value` `string`

  Value to set for the `<input>`, `<textarea>` or `[contenteditable]` element.
- <a id="locator-fill-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-fill-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="locator-fill-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="locator-fill-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.filter() {#locator-filter}

<Badge type="info" text="Added in: v1.22" />

This method narrows existing locator according to the options, for example filters by text.
It can be chained to filter multiple times.

**Usage**

::: code-group

```python [Async]
row_locator = page.locator("tr")
# ...
await row_locator.filter(has_text="text in column 1").filter(
    has=page.get_by_role("button", name="column 2 button")
).screenshot()

```

```python [Sync]
row_locator = page.locator("tr")
# ...
row_locator.filter(has_text="text in column 1").filter(
    has=page.get_by_role("button", name="column 2 button")
).screenshot()
```

:::

**Arguments**

- <a id="locator-filter-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-filter-option-has"></a>`has` `Locator` *(optional)*

    Narrows down the results of the method to those which contain elements matching this relative locator.
    For example, `article` that has `text=Playwright` matches `<article><div>Playwright</div></article>`.

    Inner locator **must be relative** to the outer locator and is queried starting with the outer locator match, not the document root. For example, you can find `content` that has `div` in `<article><content><div>Playwright</div></content></article>`. However, looking for `content` that has `article div` will fail, because the inner locator must be relative and should not use any elements outside the `content`.

    Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator](/python/api/class-framelocator)s.
  - <a id="locator-filter-option-has-not"></a>`has_not` `Locator` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the outer one.
    For example, `article` that does not have `div` matches `<article><span>Playwright</span></article>`.

    Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator](/python/api/class-framelocator)s.
  - <a id="locator-filter-option-has-not-text"></a>`has_not_text` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
  - <a id="locator-filter-option-has-text"></a>`has_text` `string | RegExp` *(optional)*

    Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
    For example, `"Playwright"` matches `<article><div>Playwright</div></article>`.
  - <a id="locator-filter-option-visible"></a>`visible` `boolean` *(optional)* <Badge type="info" text="Added in: v1.51" />

    Only matches visible or invisible elements. Prefer the [`locator.visible()`](/python/api/class-locator#locator-visible) shortcut when matching only visible elements.

**Returns**

- `Locator`


### locator.first() {#locator-first}

<Badge type="info" text="Added in: v1.14" />

Returns locator to the first matching element.

**Returns**

- `Locator`


### locator.focus() {#locator-focus}

<Badge type="info" text="Added in: v1.14" />

Calls [focus](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) on the matching element.

**Arguments**

- <a id="locator-focus-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-focus-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.frame_locator() {#locator-frame-locator}

<Badge type="info" text="Added in: v1.17" />

When working with iframes, you can create a frame locator that will enter the iframe and allow locating elements
in that iframe:

**Usage**

::: code-group

```python [Async]
locator = page.frame_locator("iframe").get_by_text("Submit")
await locator.click()
```

```python [Sync]
locator = page.frame_locator("iframe").get_by_text("Submit")
locator.click()
```

:::

**Arguments**

- <a id="locator-frame-locator-option-selector"></a>`selector` `string`

  A selector to use when resolving DOM element.

**Returns**

- `FrameLocator`


### locator.get_attribute() {#locator-get-attribute}

<Badge type="info" text="Added in: v1.14" />

Returns the matching element's attribute value.

:::warning[Asserting attributes]

If you need to assert an element's attribute, prefer [`locator_assertions.to_have_attribute()`](/python/api/class-locatorassertions#locator-assertions-to-have-attribute) to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Arguments**

- <a id="locator-get-attribute-option-name"></a>`name` `string`

  Attribute name to get the value for.
- <a id="locator-get-attribute-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-get-attribute-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `null | string`


### locator.get_by_alt_text() {#locator-get-by-alt-text}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements by their alt text.

**Usage**

For example, this method will find the image by alt text "Playwright logo":

```html
<img alt='Playwright logo'>
```

::: code-group

```python [Async]
await page.get_by_alt_text("Playwright logo").click()
```

```python [Sync]
page.get_by_alt_text("Playwright logo").click()
```

:::

**Arguments**

- <a id="locator-get-by-alt-text-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="locator-get-by-alt-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-get-by-alt-text-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### locator.get_by_label() {#locator-get-by-label}

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

::: code-group

```python [Async]
await page.get_by_label("Username").fill("john")
await page.get_by_label("Password").fill("secret")
```

```python [Sync]
page.get_by_label("Username").fill("john")
page.get_by_label("Password").fill("secret")
```

:::

**Arguments**

- <a id="locator-get-by-label-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="locator-get-by-label-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-get-by-label-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### locator.get_by_placeholder() {#locator-get-by-placeholder}

<Badge type="info" text="Added in: v1.27" />

Allows locating input elements by the placeholder text.

**Usage**

For example, consider the following DOM structure.

```html
<input type="email" placeholder="name@example.com" />
```

You can fill the input after locating it by the placeholder text:

::: code-group

```python [Async]
await page.get_by_placeholder("name@example.com").fill("playwright@microsoft.com")
```

```python [Sync]
page.get_by_placeholder("name@example.com").fill("playwright@microsoft.com")
```

:::

**Arguments**

- <a id="locator-get-by-placeholder-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="locator-get-by-placeholder-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-get-by-placeholder-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### locator.get_by_role() {#locator-get-by-role}

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

::: code-group

```python [Async]
await expect(page.get_by_role("heading", name="Sign up")).to_be_visible()

await page.get_by_role("checkbox", name="Subscribe").check()

await page.get_by_role("button", name=re.compile("submit", re.IGNORECASE)).click()
```

```python [Sync]
expect(page.get_by_role("heading", name="Sign up")).to_be_visible()

page.get_by_role("checkbox", name="Subscribe").check()

page.get_by_role("button", name=re.compile("submit", re.IGNORECASE)).click()
```

:::

**Details**

Role selector **does not replace** accessibility audits and conformance tests, but rather gives early feedback about the ARIA guidelines.

Many html elements have an implicitly [defined role](https://w3c.github.io/html-aam/#html-element-role-mappings) that is recognized by the role selector. You can find all the [supported roles here](https://www.w3.org/TR/wai-aria-1.2/#role_definitions). ARIA guidelines **do not recommend** duplicating implicit roles and attributes by setting `role` and/or `aria-*` attributes to default values.

**Arguments**

- <a id="locator-get-by-role-option-role"></a>`role` `"alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"`

  Required aria role.
- <a id="locator-get-by-role-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-get-by-role-option-checked"></a>`checked` `boolean` *(optional)*

    An attribute that is usually set by `aria-checked` or native `<input type=checkbox>` controls.

    Learn more about [`aria-checked`](https://www.w3.org/TR/wai-aria-1.2/#aria-checked).
  - <a id="locator-get-by-role-option-description"></a>`description` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.60" />

    Option to match the [accessible description](https://w3c.github.io/accname/#dfn-accessible-description). By default, matching is case-insensitive and searches for a substring, use [`exact`](/python/api/class-locator#locator-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible description](https://w3c.github.io/accname/#dfn-accessible-description).
  - <a id="locator-get-by-role-option-disabled"></a>`disabled` `boolean` *(optional)*

    An attribute that is usually set by `aria-disabled` or `disabled`.

    ::: info
    Unlike most other attributes, `disabled` is inherited through the DOM hierarchy.
    Learn more about [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled).
    :::
  - <a id="locator-get-by-role-option-exact"></a>`exact` `boolean` *(optional)* <Badge type="info" text="Added in: v1.28" />

    Whether [`name`](/python/api/class-locator#locator-get-by-role-option-name) and [`description`](/python/api/class-locator#locator-get-by-role-option-description) are matched exactly: case-sensitive and whole-string. Defaults to false. Ignored when the value is a regular expression. Note that exact match still trims whitespace.
  - <a id="locator-get-by-role-option-expanded"></a>`expanded` `boolean` *(optional)*

    An attribute that is usually set by `aria-expanded`.

    Learn more about [`aria-expanded`](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded).
  - <a id="locator-get-by-role-option-include-hidden"></a>`include_hidden` `boolean` *(optional)*

    Option that controls whether hidden elements are matched. By default, only non-hidden elements, as [defined by ARIA](https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion), are matched by role selector.

    Learn more about [`aria-hidden`](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden).
  - <a id="locator-get-by-role-option-level"></a>`level` `int` *(optional)*

    A number attribute that is usually present for roles `heading`, `listitem`, `row`, `treeitem`, with default values for `<h1>-<h6>` elements.

    Learn more about [`aria-level`](https://www.w3.org/TR/wai-aria-1.2/#aria-level).
  - <a id="locator-get-by-role-option-name"></a>`name` `string | RegExp` *(optional)*

    Option to match the [accessible name](https://w3c.github.io/accname/#dfn-accessible-name). By default, matching is case-insensitive and searches for a substring, use [`exact`](/python/api/class-locator#locator-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
  - <a id="locator-get-by-role-option-pressed"></a>`pressed` `boolean` *(optional)*

    An attribute that is usually set by `aria-pressed`.

    Learn more about [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.2/#aria-pressed).
  - <a id="locator-get-by-role-option-selected"></a>`selected` `boolean` *(optional)*

    An attribute that is usually set by `aria-selected`.

    Learn more about [`aria-selected`](https://www.w3.org/TR/wai-aria-1.2/#aria-selected).

**Returns**

- `Locator`


### locator.get_by_test_id() {#locator-get-by-test-id}

<Badge type="info" text="Added in: v1.27" />

Locate element by the test id.

**Usage**

Consider the following DOM structure.

```html
<button data-testid="directions">Itinéraire</button>
```

You can locate the element by its test id:

::: code-group

```python [Async]
await page.get_by_test_id("directions").click()
```

```python [Sync]
page.get_by_test_id("directions").click()
```

:::

**Details**

By default, the `data-testid` attribute is used as a test id. Use [`selectors.set_test_id_attribute()`](/python/api/class-selectors#selectors-set-test-id-attribute) to configure a different test id attribute if necessary.

**Arguments**

- <a id="locator-get-by-test-id-option-test-id"></a>`test_id` `string | RegExp`

  Id to locate the element by.

**Returns**

- `Locator`


### locator.get_by_text() {#locator-get-by-text}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements that contain given text.

See also [`locator.filter()`](/python/api/class-locator#locator-filter) that allows to match by another criteria, like an accessible role, and then filter by the text content.

**Usage**

Consider the following DOM structure:

```html
<div>Hello <span>world</span></div>
<div>Hello</div>
```

You can locate by text substring, exact string, or a regular expression:

::: code-group

```python [Async]
# Matches <span>
page.get_by_text("world")

# Matches first <div>
page.get_by_text("Hello world")

# Matches second <div>
page.get_by_text("Hello", exact=True)

# Matches both <div>s
page.get_by_text(re.compile("Hello"))

# Matches second <div>
page.get_by_text(re.compile("^hello$", re.IGNORECASE))
```

```python [Sync]
# Matches <span>
page.get_by_text("world")

# Matches first <div>
page.get_by_text("Hello world")

# Matches second <div>
page.get_by_text("Hello", exact=True)

# Matches both <div>s
page.get_by_text(re.compile("Hello"))

# Matches second <div>
page.get_by_text(re.compile("^hello$", re.IGNORECASE))
```

:::

**Details**

Matching by text always normalizes whitespace, even with exact match. For example, it turns multiple spaces into one, turns line breaks into spaces and ignores leading and trailing whitespace.

Input elements of the type `button` and `submit` are matched by their `value` instead of the text content. For example, locating by text `"Log in"` matches `<input type=button value="Log in">`.

**Arguments**

- <a id="locator-get-by-text-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="locator-get-by-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-get-by-text-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### locator.get_by_title() {#locator-get-by-title}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements by their title attribute.

**Usage**

Consider the following DOM structure.

```html
<span title='Issues count'>25 issues</span>
```

You can check the issues count after locating it by the title text:

::: code-group

```python [Async]
await expect(page.get_by_title("Issues count")).to_have_text("25 issues")
```

```python [Sync]
expect(page.get_by_title("Issues count")).to_have_text("25 issues")
```

:::

**Arguments**

- <a id="locator-get-by-title-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="locator-get-by-title-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-get-by-title-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### locator.hide_highlight() {#locator-hide-highlight}

<Badge type="info" text="Added in: v1.60" />

Hides the element highlight previously added by [`locator.highlight()`](/python/api/class-locator#locator-highlight).


### locator.highlight() {#locator-highlight}

<Badge type="info" text="Added in: v1.20" />

Highlight the corresponding element(s) on the screen. Useful for debugging, don't commit the code that uses [`locator.highlight()`](/python/api/class-locator#locator-highlight).

**Arguments**

- <a id="locator-highlight-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-highlight-option-style"></a>`style` `string` *(optional)* <Badge type="info" text="Added in: v1.60" />

    Additional inline CSS applied to the highlight overlay, e.g. `"outline: 2px dashed red"`.

**Returns**

- `Disposable`


### locator.hover() {#locator-hover}

<Badge type="info" text="Added in: v1.14" />

Hover over the matching element.

**Usage**

::: code-group

```python [Async]
await page.get_by_role("link").hover()
```

```python [Sync]
page.get_by_role("link").hover()
```

:::

**Details**

This method hovers over the element by performing the following steps:
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/python/api/class-locator#locator-hover-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/python/api/class-page#page-mouse) to hover over the center of the element, or the specified [`position`](/python/api/class-locator#locator-hover-option-position).

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-locator#locator-hover-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="locator-hover-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-hover-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="locator-hover-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="locator-hover-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)* <Badge type="info" text="Added in: v1.28" />

    This option has no effect.
  - <a id="locator-hover-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="locator-hover-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="locator-hover-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="locator-hover-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### locator.inner_html() {#locator-inner-html}

<Badge type="info" text="Added in: v1.14" />

Returns the [`element.innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML).

**Arguments**

- <a id="locator-inner-html-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-inner-html-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `string`


### locator.inner_text() {#locator-inner-text}

<Badge type="info" text="Added in: v1.14" />

Returns the [`element.innerText`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText).

:::warning[Asserting text]

If you need to assert text on the page, prefer [`locator_assertions.to_have_text()`](/python/api/class-locatorassertions#locator-assertions-to-have-text) with [`use_inner_text`](/python/api/class-locatorassertions#locator-assertions-to-have-text-option-use-inner-text) option to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Arguments**

- <a id="locator-inner-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-inner-text-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `string`


### locator.input_value() {#locator-input-value}

<Badge type="info" text="Added in: v1.14" />

Returns the value for the matching `<input>` or `<textarea>` or `<select>` element.

:::warning[Asserting value]

If you need to assert input value, prefer [`locator_assertions.to_have_value()`](/python/api/class-locatorassertions#locator-assertions-to-have-value) to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Usage**

::: code-group

```python [Async]
value = await page.get_by_role("textbox").input_value()
```

```python [Sync]
value = page.get_by_role("textbox").input_value()
```

:::

**Details**

Throws elements that are not an input, textarea or a select. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), returns the value of the control.

**Arguments**

- <a id="locator-input-value-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-input-value-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `string`


### locator.is_checked() {#locator-is-checked}

<Badge type="info" text="Added in: v1.14" />

Returns whether the element is checked. Throws if the element is not a checkbox or radio input.

:::warning[Asserting checked state]

If you need to assert that checkbox is checked, prefer [`locator_assertions.to_be_checked()`](/python/api/class-locatorassertions#locator-assertions-to-be-checked) to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Usage**

::: code-group

```python [Async]
checked = await page.get_by_role("checkbox").is_checked()
```

```python [Sync]
checked = page.get_by_role("checkbox").is_checked()
```

:::

**Arguments**

- <a id="locator-is-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-is-checked-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `boolean`


### locator.is_disabled() {#locator-is-disabled}

<Badge type="info" text="Added in: v1.14" />

Returns whether the element is disabled, the opposite of [enabled](../actionability.md#enabled).

:::warning[Asserting disabled state]

If you need to assert that an element is disabled, prefer [`locator_assertions.to_be_disabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-disabled) to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Usage**

::: code-group

```python [Async]
disabled = await page.get_by_role("button").is_disabled()
```

```python [Sync]
disabled = page.get_by_role("button").is_disabled()
```

:::

**Arguments**

- <a id="locator-is-disabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-is-disabled-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `boolean`


### locator.is_editable() {#locator-is-editable}

<Badge type="info" text="Added in: v1.14" />

Returns whether the element is [editable](../actionability.md#editable). If the target element is not an `<input>`, `<textarea>`, `<select>`, `[contenteditable]` and does not have a role allowing `[aria-readonly]`, this method throws an error.

:::warning[Asserting editable state]

If you need to assert that an element is editable, prefer [`locator_assertions.to_be_editable()`](/python/api/class-locatorassertions#locator-assertions-to-be-editable) to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Usage**

::: code-group

```python [Async]
editable = await page.get_by_role("textbox").is_editable()
```

```python [Sync]
editable = page.get_by_role("textbox").is_editable()
```

:::

**Arguments**

- <a id="locator-is-editable-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-is-editable-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `boolean`


### locator.is_enabled() {#locator-is-enabled}

<Badge type="info" text="Added in: v1.14" />

Returns whether the element is [enabled](../actionability.md#enabled).

:::warning[Asserting enabled state]

If you need to assert that an element is enabled, prefer [`locator_assertions.to_be_enabled()`](/python/api/class-locatorassertions#locator-assertions-to-be-enabled) to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Usage**

::: code-group

```python [Async]
enabled = await page.get_by_role("button").is_enabled()
```

```python [Sync]
enabled = page.get_by_role("button").is_enabled()
```

:::

**Arguments**

- <a id="locator-is-enabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-is-enabled-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `boolean`


### locator.is_hidden() {#locator-is-hidden}

<Badge type="info" text="Added in: v1.14" />

Returns whether the element is hidden, the opposite of [visible](../actionability.md#visible).

:::warning[Asserting visibility]

If you need to assert that element is hidden, prefer [`locator_assertions.to_be_hidden()`](/python/api/class-locatorassertions#locator-assertions-to-be-hidden) to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Usage**

::: code-group

```python [Async]
hidden = await page.get_by_role("button").is_hidden()
```

```python [Sync]
hidden = page.get_by_role("button").is_hidden()
```

:::

**Arguments**

- <a id="locator-is-hidden-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-is-hidden-option-timeout"></a>`timeout` `float` *(optional)*

**Returns**

- `boolean`


### locator.is_visible() {#locator-is-visible}

<Badge type="info" text="Added in: v1.14" />

Returns whether the element is [visible](../actionability.md#visible).

:::warning[Asserting visibility]

If you need to assert that element is visible, prefer [`locator_assertions.to_be_visible()`](/python/api/class-locatorassertions#locator-assertions-to-be-visible) to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Usage**

::: code-group

```python [Async]
visible = await page.get_by_role("button").is_visible()
```

```python [Sync]
visible = page.get_by_role("button").is_visible()
```

:::

**Arguments**

- <a id="locator-is-visible-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-is-visible-option-timeout"></a>`timeout` `float` *(optional)*

**Returns**

- `boolean`


### locator.last() {#locator-last}

<Badge type="info" text="Added in: v1.14" />

Returns locator to the last matching element.

**Usage**

::: code-group

```python [Async]
banana = await page.get_by_role("listitem").last
```

```python [Sync]
banana = page.get_by_role("listitem").last
```

:::

**Returns**

- `Locator`


### locator.locator() {#locator-locator}

<Badge type="info" text="Added in: v1.14" />

The method finds an element matching the specified selector in the locator's subtree. It also accepts filter options, similar to [`locator.filter()`](/python/api/class-locator#locator-filter) method.

[Learn more about locators](../locators.md).

**Arguments**

- <a id="locator-locator-option-selector-or-locator"></a>`selector_or_locator` `string | Locator`

  A selector or locator to use when resolving DOM element.
- <a id="locator-locator-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-locator-option-has"></a>`has` `Locator` *(optional)*

    Narrows down the results of the method to those which contain elements matching this relative locator.
    For example, `article` that has `text=Playwright` matches `<article><div>Playwright</div></article>`.

    Inner locator **must be relative** to the outer locator and is queried starting with the outer locator match, not the document root. For example, you can find `content` that has `div` in `<article><content><div>Playwright</div></content></article>`. However, looking for `content` that has `article div` will fail, because the inner locator must be relative and should not use any elements outside the `content`.

    Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator](/python/api/class-framelocator)s.
  - <a id="locator-locator-option-has-not"></a>`has_not` `Locator` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the outer one.
    For example, `article` that does not have `div` matches `<article><span>Playwright</span></article>`.

    Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator](/python/api/class-framelocator)s.
  - <a id="locator-locator-option-has-not-text"></a>`has_not_text` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
  - <a id="locator-locator-option-has-text"></a>`has_text` `string | RegExp` *(optional)*

    Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
    For example, `"Playwright"` matches `<article><div>Playwright</div></article>`.

**Returns**

- `Locator`


### locator.normalize() {#locator-normalize}

<Badge type="info" text="Added in: v1.59" />

Returns a new locator that uses best practices for referencing the matched element, prioritizing test ids,
aria roles, and other user-facing attributes over CSS selectors. This is useful for converting implementation-detail selectors into more resilient, human-readable locators.

**Usage**

An agent can pick an element by its ref from an [`page.aria_snapshot()`](/python/api/class-page#page-aria-snapshot) taken in the `"ai"` mode. Refs only
work for the latest snapshot. Normalize the ref locator and convert it to a string to get resilient locator code
in your language, the same way `codegen` does.

Consider the following aria snapshot.

```yaml
- button "Submit" [ref=e2]
```

You can turn the ref into locator code:

::: code-group

```python [Async]
normalized = await page.get_by_ref("e2").normalize()
print(str(normalized))
# get_by_role("button", name="Submit")
```

```python [Sync]
normalized = page.get_by_ref("e2").normalize()
print(str(normalized))
# get_by_role("button", name="Submit")
```

:::

**Returns**

- `Locator`


### locator.nth() {#locator-nth}

<Badge type="info" text="Added in: v1.14" />

Returns locator to the n-th matching element. It's zero based, `nth(0)` selects the first element.

**Usage**

::: code-group

```python [Async]
banana = await page.get_by_role("listitem").nth(2)
```

```python [Sync]
banana = page.get_by_role("listitem").nth(2)
```

:::

**Arguments**

- <a id="locator-nth-option-index"></a>`index` `int`

**Returns**

- `Locator`


### locator.or_() {#locator-or}

<Badge type="info" text="Added in: v1.33" />

Creates a locator matching all elements that match one or both of the two locators.

Note that when both locators match something, the resulting locator will have multiple matches, potentially causing a [locator strictness](../locators.md#strictness) violation.

**Usage**

Consider a scenario where you'd like to click on a "New email" button, but sometimes a security settings dialog shows up instead. In this case, you can wait for either a "New email" button, or a dialog and act accordingly.

::: info
If both "New email" button and security dialog appear on screen, the "or" locator will match both of them,
possibly throwing the ["strict mode violation" error](../locators.md#strictness). In this case, you can use [`locator.first()`](/python/api/class-locator#locator-first) to only match one of them.
:::

::: code-group

```python [Async]
new_email = page.get_by_role("button", name="New")
dialog = page.get_by_text("Confirm security settings")
await expect(new_email.or_(dialog).first).to_be_visible()
if (await dialog.is_visible()):
  await page.get_by_role("button", name="Dismiss").click()
await new_email.click()
```

```python [Sync]
new_email = page.get_by_role("button", name="New")
dialog = page.get_by_text("Confirm security settings")
expect(new_email.or_(dialog).first).to_be_visible()
if (dialog.is_visible()):
  page.get_by_role("button", name="Dismiss").click()
new_email.click()
```

:::

**Arguments**

- <a id="locator-or-option-locator"></a>`locator` `Locator`

  Alternative locator to match.

**Returns**

- `Locator`


### locator.page() {#locator-page}

<Badge type="info" text="Added in: v1.19" />

A page this locator belongs to.

**Returns**

- `Page`


### locator.press() {#locator-press}

<Badge type="info" text="Added in: v1.14" />

Focuses the matching element and presses a combination of the keys.

**Usage**

::: code-group

```python [Async]
await page.get_by_role("textbox").press("Backspace")
```

```python [Sync]
page.get_by_role("textbox").press("Backspace")
```

:::

**Details**

Focuses the element, and then uses [`keyboard.down()`](/python/api/class-keyboard#keyboard-down) and [`keyboard.up()`](/python/api/class-keyboard#keyboard-up).

[`key`](/python/api/class-locator#locator-press-option-key) can specify the intended
[keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value or a single character to
generate the text for. A superset of the [`key`](/python/api/class-locator#locator-press-option-key) values can be found
[here](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:

`F1` - `F12`, `Digit0`- `Digit9`, `KeyA`- `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
`Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.

Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`, `ShiftLeft`, `ControlOrMeta`.
`ControlOrMeta` resolves to `Control` on Windows and Linux and to `Meta` on macOS.

Holding down `Shift` will type the text that corresponds to the [`key`](/python/api/class-locator#locator-press-option-key) in the upper case.

If [`key`](/python/api/class-locator#locator-press-option-key) is a single character, it is case-sensitive, so the values `a` and `A` will generate different
respective texts.

Shortcuts such as `key: "Control+o"`, `key: "Control++` or `key: "Control+Shift+T"` are supported as well. When specified with the
modifier, modifier is pressed and being held while the subsequent key is being pressed.

**Arguments**

- <a id="locator-press-option-key"></a>`key` `string`

  Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
- <a id="locator-press-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-press-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `keydown` and `keyup` in milliseconds. Defaults to 0.
  - <a id="locator-press-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can
    opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating
    to inaccessible pages. Defaults to `false`.
  - <a id="locator-press-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.press_sequentially() {#locator-press-sequentially}

<Badge type="info" text="Added in: v1.38" />

::: tip
In most cases, you should use [`locator.fill()`](/python/api/class-locator#locator-fill) instead. You only need to press keys one by one if there is special keyboard handling on the page.
:::

Focuses the element, and then sends a `keydown`, `keypress`/`input`, and `keyup` event for each character in the text.

To press a special key, like `Control` or `ArrowDown`, use [`locator.press()`](/python/api/class-locator#locator-press).

**Usage**

::: code-group

```python [Async]
await locator.press_sequentially("hello") # types instantly
await locator.press_sequentially("world", delay=100) # types slower, like a user
```

```python [Sync]
locator.press_sequentially("hello") # types instantly
locator.press_sequentially("world", delay=100) # types slower, like a user
```

:::

An example of typing into a text field and then submitting the form:

::: code-group

```python [Async]
locator = page.get_by_label("Password")
await locator.press_sequentially("my password")
await locator.press("Enter")
```

```python [Sync]
locator = page.get_by_label("Password")
locator.press_sequentially("my password")
locator.press("Enter")
```

:::

**Arguments**

- <a id="locator-press-sequentially-option-text"></a>`text` `string`

  String of characters to sequentially press into a focused element.
- <a id="locator-press-sequentially-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-press-sequentially-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between key presses in milliseconds. Defaults to 0.
  - <a id="locator-press-sequentially-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="locator-press-sequentially-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.screenshot() {#locator-screenshot}

<Badge type="info" text="Added in: v1.14" />

Take a screenshot of the element matching the locator.

**Usage**

::: code-group

```python [Async]
await page.get_by_role("link").screenshot()
```

```python [Sync]
page.get_by_role("link").screenshot()
```

:::

Disable animations and save screenshot to a file:

::: code-group

```python [Async]
await page.get_by_role("link").screenshot(animations="disabled", path="link.png")
```

```python [Sync]
page.get_by_role("link").screenshot(animations="disabled", path="link.png")
```

:::

**Details**

This method captures a screenshot of the page, clipped to the size and position of a particular element matching the locator. If the element is covered by other elements, it will not be actually visible on the screenshot. If the element is a scrollable container, only the currently scrolled content will be visible on the screenshot.

This method waits for the [actionability](../actionability.md) checks, then scrolls element into view before taking a
screenshot. If the element is detached from DOM, the method throws an error.

Returns the buffer with the captured screenshot.

**Arguments**

- <a id="locator-screenshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-screenshot-option-animations"></a>`animations` `"disabled" | "allow"` *(optional)*

    When set to `"disabled"`, stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
    * finite animations are fast-forwarded to completion, so they'll fire `transitionend` event.
    * infinite animations are canceled to initial state, and then played over after the screenshot.

    Defaults to `"allow"` that leaves animations untouched.
  - <a id="locator-screenshot-option-caret"></a>`caret` `"hide" | "initial"` *(optional)*

    When set to `"hide"`, screenshot will hide text caret. When set to `"initial"`, text caret behavior will not be changed.  Defaults to `"hide"`.
  - <a id="locator-screenshot-option-mask"></a>`mask` `Array<Locator>` *(optional)*

    Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with
    a pink box `#FF00FF` (customized by [`mask_color`](/python/api/class-locator#locator-screenshot-option-mask-color)) that completely covers its bounding box.
    The mask is also applied to invisible elements, see [Matching only visible elements](../locators.md#matching-only-visible-elements) to disable that.
  - <a id="locator-screenshot-option-mask-color"></a>`mask_color` `string` *(optional)* <Badge type="info" text="Added in: v1.35" />

    Specify the color of the overlay box for masked elements, in [CSS color format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Default color is pink `#FF00FF`.
  - <a id="locator-screenshot-option-omit-background"></a>`omit_background` `boolean` *(optional)*

    Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images.
    Defaults to `false`.
  - <a id="locator-screenshot-option-path"></a>`path` `path` *(optional)*

    The file path to save the image to. The screenshot type will be inferred from file extension. If [`path`](/python/api/class-locator#locator-screenshot-option-path) is a
    relative path, then it is resolved relative to the current working directory. If no path is provided, the image won't be
    saved to the disk.
  - <a id="locator-screenshot-option-quality"></a>`quality` `int` *(optional)*

    The quality of the image, between 0-100. Not applicable to `png` images. For `jpeg` the default is `80`.
    For `webp`, a quality of `100` (the default) produces a lossless image, while lower values use lossy compression.
  - <a id="locator-screenshot-option-scale"></a>`scale` `"css" | "device"` *(optional)*

    When set to `"css"`, screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using `"device"` option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.

    Defaults to `"device"`.
  - <a id="locator-screenshot-option-style"></a>`style` `string` *(optional)* <Badge type="info" text="Added in: v1.41" />

    Text of the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible
    or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies
    to the inner frames.
  - <a id="locator-screenshot-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="locator-screenshot-option-type"></a>`type` `"png" | "jpeg" | "webp"` *(optional)*

    Specify screenshot type, defaults to `png`.

**Returns**

- `Buffer`


### locator.scroll_into_view_if_needed() {#locator-scroll-into-view-if-needed}

<Badge type="info" text="Added in: v1.14" />

This method waits for [actionability](../actionability.md) checks, then tries to scroll element into view, unless it is
completely visible as defined by
[IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)'s `ratio`.

See [scrolling](../input.md#scrolling) for alternative ways to scroll.

**Arguments**

- <a id="locator-scroll-into-view-if-needed-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-scroll-into-view-if-needed-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.select_option() {#locator-select-option}

<Badge type="info" text="Added in: v1.14" />

Selects option or options in `<select>`.

**Details**

This method waits for [actionability](../actionability.md) checks, waits until all specified options are present in the `<select>` element and selects these options.

If the target element is not a `<select>` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be used instead.

Returns the array of option values that have been successfully selected.

Triggers a `change` and `input` event once all the provided options have been selected.

**Usage**

```html
<select multiple>
  <option value="red">Red</option>
  <option value="green">Green</option>
  <option value="blue">Blue</option>
</select>
```

::: code-group

```python [Async]
# single selection matching the value or label
await element.select_option("blue")
# single selection matching the label
await element.select_option(label="blue")
# multiple selection for blue, red and second option
await element.select_option(value=["red", "green", "blue"])
```

```python [Sync]
# single selection matching the value or label
element.select_option("blue")
# single selection matching the label
element.select_option(label="blue")
# multiple selection for blue, red and second option
element.select_option(value=["red", "green", "blue"])
```

:::

**Arguments**

- <a id="locator-select-option-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-select-option-option-element"></a>`element` `ElementHandle | Array<ElementHandle>` *(optional)*

    Option elements to select. Optional.
  - <a id="locator-select-option-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="locator-select-option-option-index"></a>`index` `int | Array<int>` *(optional)*

    Options to select by index. Optional.
  - <a id="locator-select-option-option-label"></a>`label` `string | Array<string>` *(optional)*

    Options to select by label. If the `<select>` has the `multiple` attribute, all given options are selected, otherwise
    only the first option matching one of the passed options is selected. Optional.
  - <a id="locator-select-option-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="locator-select-option-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
- <a id="locator-select-option-option-value"></a>`value` `string | Array<string>` *(optional)*

  Options to select by value. If the `<select>` has the `multiple` attribute, all given options are selected, otherwise
  only the first option matching one of the passed options is selected. Optional.

**Returns**

- `Array<string>`


### locator.select_text() {#locator-select-text}

<Badge type="info" text="Added in: v1.14" />

This method waits for [actionability](../actionability.md) checks, then focuses the element and selects all its text
content.

If the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), focuses and selects text in the control instead.

**Arguments**

- <a id="locator-select-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-select-text-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="locator-select-text-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.set_checked() {#locator-set-checked}

<Badge type="info" text="Added in: v1.15" />

Set the state of a checkbox or a radio element.

**Usage**

::: code-group

```python [Async]
await page.get_by_role("checkbox").set_checked(True)
```

```python [Sync]
page.get_by_role("checkbox").set_checked(True)
```

:::

**Details**

This method checks or unchecks an element by performing the following steps:
1. Ensure that matched element is a checkbox or a radio input. If not, this method throws.
1. If the element already has the right checked state, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/python/api/class-locator#locator-set-checked-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/python/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now checked or unchecked. If not, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-locator#locator-set-checked-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="locator-set-checked-option-checked"></a>`checked` `boolean`

  Whether to check or uncheck the checkbox.
- <a id="locator-set-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-set-checked-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="locator-set-checked-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="locator-set-checked-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="locator-set-checked-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="locator-set-checked-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="locator-set-checked-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### locator.set_input_files() {#locator-set-input-files}

<Badge type="info" text="Added in: v1.14" />

Upload file or multiple files into `<input type=file>`.
For inputs with a `[webkitdirectory]` attribute, only a single directory path is supported.

**Usage**

::: code-group

```python [Async]
# Select one file
await page.get_by_label("Upload file").set_input_files('myfile.pdf')

# Select multiple files
await page.get_by_label("Upload files").set_input_files(['file1.txt', 'file2.txt'])

# Select a directory
await page.get_by_label("Upload directory").set_input_files('mydir')

# Remove all the selected files
await page.get_by_label("Upload file").set_input_files([])

# Upload buffer from memory
await page.get_by_label("Upload file").set_input_files(
    files=[
        {"name": "test.txt", "mimeType": "text/plain", "buffer": b"this is a test"}
    ],
)
```

```python [Sync]
# Select one file
page.get_by_label("Upload file").set_input_files('myfile.pdf')

# Select multiple files
page.get_by_label("Upload files").set_input_files(['file1.txt', 'file2.txt'])

# Select a directory
page.get_by_label("Upload directory").set_input_files('mydir')

# Remove all the selected files
page.get_by_label("Upload file").set_input_files([])

# Upload buffer from memory
page.get_by_label("Upload file").set_input_files(
    files=[
        {"name": "test.txt", "mimeType": "text/plain", "buffer": b"this is a test"}
    ],
)
```

:::

**Details**

Sets the value of the file input to these file paths or files. If some of the `filePaths` are relative paths, then they
are resolved relative to the current working directory. For empty array, clears the selected files.

This method expects [Locator](/python/api/class-locator) to point to an
[input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input). However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), targets the control instead.

**Arguments**

- <a id="locator-set-input-files-option-files"></a>`files` `path | Array<path> | Object | Array<Object>`

  - `name` `string`

    File name
  - `mime_type` `string`

    File type
  - `buffer` `Buffer`

    File content
- <a id="locator-set-input-files-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-set-input-files-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="locator-set-input-files-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.tap() {#locator-tap}

<Badge type="info" text="Added in: v1.14" />

Perform a tap gesture on the element matching the locator. For examples of emulating other gestures by manually dispatching touch events, see the [emulating legacy touch events](../touch-events.md) page.

**Details**

This method taps the element by performing the following steps:
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/python/api/class-locator#locator-tap-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.touchscreen`](/python/api/class-page#page-touchscreen) to tap the center of the element, or the specified [`position`](/python/api/class-locator#locator-tap-option-position).

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-locator#locator-tap-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

::: info
`element.tap()` requires that the `hasTouch` option of the browser context be set to true.
:::

**Arguments**

- <a id="locator-tap-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-tap-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="locator-tap-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="locator-tap-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="locator-tap-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="locator-tap-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="locator-tap-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="locator-tap-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### locator.text_content() {#locator-text-content}

<Badge type="info" text="Added in: v1.14" />

Returns the [`node.textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent).

:::warning[Asserting text]

If you need to assert text on the page, prefer [`locator_assertions.to_have_text()`](/python/api/class-locatorassertions#locator-assertions-to-have-text) to avoid flakiness. See [assertions guide](../test-assertions.md) for more details.
:::

**Arguments**

- <a id="locator-text-content-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-text-content-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `null | string`


### locator.uncheck() {#locator-uncheck}

<Badge type="info" text="Added in: v1.14" />

Ensure that checkbox or radio element is unchecked.

**Usage**

::: code-group

```python [Async]
await page.get_by_role("checkbox").uncheck()
```

```python [Sync]
page.get_by_role("checkbox").uncheck()
```

:::

**Details**

This method unchecks the element by performing the following steps:
1. Ensure that element is a checkbox or a radio input. If not, this method throws. If the element is already
   unchecked, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/python/api/class-locator#locator-uncheck-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/python/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now unchecked. If not, this method throws.

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-locator#locator-uncheck-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="locator-uncheck-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-uncheck-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="locator-uncheck-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="locator-uncheck-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="locator-uncheck-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="locator-uncheck-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="locator-uncheck-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### locator.visible() {#locator-visible}

<Badge type="info" text="Added in: v1.63" />

Returns a locator that matches only [visible](../actionability.md#visible) elements, ignoring the invisible ones. This is the recommended way to distinguish elements by visibility, as opposed to the `:visible` CSS pseudo-class.

Note that visibility is checked every time the locator is used, and not at the moment of the [`locator.visible()`](/python/api/class-locator#locator-visible) call.

**Usage**

Consider a page with two buttons, the first invisible and the second visible.

```html
<button style='display: none'>Invisible</button>
<button>Visible</button>
```

This will only find the second button, because it is visible, and then click it.

::: code-group

```python [Async]
await page.locator("button").visible.click()
```

```python [Sync]
page.locator("button").visible.click()
```

:::

To match invisible elements instead, use [`locator.filter()`](/python/api/class-locator#locator-filter) with the [`visible`](/python/api/class-locator#locator-filter-option-visible) option set to `false`.

**Returns**

- `Locator`


### locator.wait_for() {#locator-wait-for}

<Badge type="info" text="Added in: v1.16" />

Returns when element specified by locator satisfies the [`state`](/python/api/class-locator#locator-wait-for-option-state) option.

If target element already satisfies the condition, the method returns immediately. Otherwise, waits for up to
[`timeout`](/python/api/class-locator#locator-wait-for-option-timeout) milliseconds until the condition is met.

**Usage**

::: code-group

```python [Async]
order_sent = page.locator("#order-sent")
await order_sent.wait_for()
```

```python [Sync]
order_sent = page.locator("#order-sent")
order_sent.wait_for()
```

:::

**Arguments**

- <a id="locator-wait-for-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-wait-for-option-state"></a>`state` `"attached" | "detached" | "visible" | "hidden"` *(optional)*

    Defaults to `'visible'`. Can be either:
    * `'attached'` - wait for element to be present in DOM.
    * `'detached'` - wait for element to not be present in DOM.
    * `'visible'` - wait for element to have non-empty bounding box and no `visibility:hidden`. Note that element without
      any content or with `display:none` has an empty bounding box and is not considered visible.
    * `'hidden'` - wait for element to be either detached from DOM, or have an empty bounding box or `visibility:hidden`.
      This is opposite to the `'visible'` option.
  - <a id="locator-wait-for-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.wait_for_function() {#locator-wait-for-function}

<Badge type="info" text="Added in: v1.62" />

Returns when [`expression`](/python/api/class-locator#locator-wait-for-function-option-expression) returns a truthy value, called with the matching element as a first argument, and [`arg`](/python/api/class-locator#locator-wait-for-function-option-arg) as a second argument.

This is a generic way to wait for an element to reach a custom condition without asserting it. The locator is re-resolved on each retry, so it tolerates the element being re-rendered while waiting.

If [`expression`](/python/api/class-locator#locator-wait-for-function-option-expression) returns a [Promise], this method will wait for the promise to resolve before checking its value.

If [`expression`](/python/api/class-locator#locator-wait-for-function-option-expression) throws or rejects, this method throws.

**Usage**

Wait for an attribute to appear:

Passing argument to [`expression`](/python/api/class-locator#locator-wait-for-function-option-expression):

**Arguments**

- <a id="locator-wait-for-function-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="locator-wait-for-function-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-wait-for-function-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

    Optional argument to pass to [`expression`](/python/api/class-locator#locator-wait-for-function-option-expression).
  - <a id="locator-wait-for-function-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default
    value can be changed by using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### locator.within() {#locator-within}

<Badge type="info" text="Added in: v1.64" />

Returns a locator that matches this locator's elements inside each element matched by [`locator`](/python/api/class-locator#locator-within-option-locator).

Note that relative locators, such as [`locator.nth()`](/python/api/class-locator#locator-nth) or [`locator.first()`](/python/api/class-locator#locator-first), are resolved separately inside each matched parent. In the example below, `page.getByRole('cell').nth(2)` picks the third cell of every row, not the third cell in the whole table.

**Usage**

::: code-group

```python [Async]
third_column = page.get_by_role("cell").nth(2).within(page.get_by_role("row"))
await expect(third_column).to_have_text(["Apple", "Banana", "Cherry"])
```

```python [Sync]
third_column = page.get_by_role("cell").nth(2).within(page.get_by_role("row"))
expect(third_column).to_have_text(["Apple", "Banana", "Cherry"])
```

:::

**Arguments**

- <a id="locator-within-option-locator"></a>`locator` `Locator`

  Locator matching the parent elements to search within.

**Returns**

- `Locator`


## Deprecated

### locator.type() {#locator-type}

<Badge type="info" text="Added in: v1.14" />

::: danger Deprecated
In most cases, you should use [`locator.fill()`](/python/api/class-locator#locator-fill) instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use [`locator.press_sequentially()`](/python/api/class-locator#locator-press-sequentially).
:::

Focuses the element, and then sends a `keydown`, `keypress`/`input`, and `keyup` event for each character in the text.

To press a special key, like `Control` or `ArrowDown`, use [`locator.press()`](/python/api/class-locator#locator-press).

**Usage**

**Arguments**

- <a id="locator-type-option-text"></a>`text` `string`

  A text to type into a focused element.
- <a id="locator-type-option-options"></a>`options` `Object` *(optional)*

  - <a id="locator-type-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between key presses in milliseconds. Defaults to 0.
  - <a id="locator-type-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="locator-type-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

