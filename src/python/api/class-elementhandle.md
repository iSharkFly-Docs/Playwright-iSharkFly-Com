---
title: ElementHandle
outline: 2
---

# ElementHandle

<Badge type="info" text="Added in: v1.8" />

Extends: [JSHandle](./class-jshandle)

* extends: [JSHandle](/python/api/class-jshandle)

ElementHandle represents an in-page DOM element. ElementHandles can be created with the [`page.query_selector()`](/python/api/class-page#page-query-selector) method.

:::warning[Discouraged]

The use of ElementHandle is discouraged, use [Locator](/python/api/class-locator) objects and web-first assertions instead.
:::

::: code-group

```python [Async]
href_element = await page.query_selector("a")
await href_element.click()
```

```python [Sync]
href_element = page.query_selector("a")
href_element.click()
```

:::

ElementHandle prevents DOM element from garbage collection unless the handle is disposed with
[`js_handle.dispose()`](/python/api/class-jshandle#js-handle-dispose). ElementHandles are auto-disposed when their origin frame gets navigated.

ElementHandle instances can be used as an argument in [`page.eval_on_selector()`](/python/api/class-page#page-eval-on-selector) and [`page.evaluate()`](/python/api/class-page#page-evaluate) methods.

The difference between the [Locator](/python/api/class-locator) and ElementHandle is that the ElementHandle points to a particular element, while [Locator](/python/api/class-locator) captures the logic of how to retrieve an element.

In the example below, handle points to a particular DOM element on page. If that element changes text or is used by React to render an entirely different component, handle is still pointing to that very DOM element. This can lead to unexpected behaviors.

::: code-group

```python [Async]
handle = await page.query_selector("text=Submit")
await handle.hover()
await handle.click()
```

```python [Sync]
handle = page.query_selector("text=Submit")
handle.hover()
handle.click()
```

:::

With the locator, every time the `element` is used, up-to-date DOM element is located in the page using the selector. So in the snippet below, underlying DOM element is going to be located twice.

::: code-group

```python [Async]
locator = page.get_by_text("Submit")
await locator.hover()
await locator.click()
```

```python [Sync]
locator = page.get_by_text("Submit")
locator.hover()
locator.click()
```

:::

## Methods

### element_handle.as_element() {#element-handle-as-element}

<Badge type="info" text="Added in: v1.8" />

Returns either `null` or the object handle itself, if the object handle is an instance of [ElementHandle](/python/api/class-elementhandle).

**Returns**

- `null | ElementHandle`


### element_handle.bounding_box() {#element-handle-bounding-box}

<Badge type="info" text="Added in: v1.8" />

This method returns the bounding box of the element, or `null` if the element is not visible. The bounding box is
calculated relative to the main frame viewport - which is usually the same as the browser window.

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
box = await element_handle.bounding_box()
await page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
```

```python [Sync]
box = element_handle.bounding_box()
page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
```

:::

**Returns**

- `null | Object`


### element_handle.check() {#element-handle-check}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.check()`](/python/api/class-locator#locator-check) instead. Read more about [locators](../locators.md).
:::

This method checks the element by performing the following steps:
1. Ensure that element is a checkbox or a radio input. If not, this method throws. If the element is already
   checked, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/python/api/class-elementhandle#element-handle-check-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/python/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now checked. If not, this method throws.

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-elementhandle#element-handle-check-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="element-handle-check-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-check-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-check-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-check-option-position"></a>`position` `Object` *(optional)* <Badge type="info" text="Added in: v1.11" />

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float` <Badge type="info" text="Added in: v1.11" />
    - `y` `float` <Badge type="info" text="Added in: v1.11" />
  - <a id="element-handle-check-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="element-handle-check-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-check-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### element_handle.click() {#element-handle-click}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.click()`](/python/api/class-locator#locator-click) instead. Read more about [locators](../locators.md).
:::

This method clicks the element by performing the following steps:
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/python/api/class-elementhandle#element-handle-click-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/python/api/class-page#page-mouse) to click in the center of the element, or the specified [`position`](/python/api/class-elementhandle#element-handle-click-option-position).
1. Wait for initiated navigations to either succeed or fail, unless [`no_wait_after`](/python/api/class-elementhandle#element-handle-click-option-no-wait-after) option is set.

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-elementhandle#element-handle-click-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="element-handle-click-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-click-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="element-handle-click-option-click-count"></a>`click_count` `int` *(optional)*

    defaults to 1. See [UIEvent.detail].
  - <a id="element-handle-click-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.
  - <a id="element-handle-click-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-click-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="element-handle-click-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can
    opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating
    to inaccessible pages. Defaults to `false`.
  - <a id="element-handle-click-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="element-handle-click-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="element-handle-click-option-steps"></a>`steps` `int` *(optional)* <Badge type="info" text="Added in: v1.57" />

    Defaults to 1. Sends `n` interpolated `mousemove` events to represent travel between Playwright's current cursor position and the provided destination. When set to 1, emits a single `mousemove` event at the destination location.
  - <a id="element-handle-click-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-click-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### element_handle.content_frame() {#element-handle-content-frame}

<Badge type="info" text="Added in: v1.8" />

Returns the content frame for element handles referencing iframe nodes, or `null` otherwise

**Returns**

- `null | Frame`


### element_handle.dblclick() {#element-handle-dblclick}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.dblclick()`](/python/api/class-locator#locator-dblclick) instead. Read more about [locators](../locators.md).
:::

This method double clicks the element by performing the following steps:
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/python/api/class-elementhandle#element-handle-dblclick-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/python/api/class-page#page-mouse) to double click in the center of the element, or the specified [`position`](/python/api/class-elementhandle#element-handle-dblclick-option-position).

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-elementhandle#element-handle-dblclick-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

::: info
`elementHandle.dblclick()` dispatches two `click` events and a single `dblclick` event.
:::

**Arguments**

- <a id="element-handle-dblclick-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-dblclick-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="element-handle-dblclick-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.
  - <a id="element-handle-dblclick-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-dblclick-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="element-handle-dblclick-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-dblclick-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="element-handle-dblclick-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="element-handle-dblclick-option-steps"></a>`steps` `int` *(optional)* <Badge type="info" text="Added in: v1.57" />

    Defaults to 1. Sends `n` interpolated `mousemove` events to represent travel between Playwright's current cursor position and the provided destination. When set to 1, emits a single `mousemove` event at the destination location.
  - <a id="element-handle-dblclick-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-dblclick-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### element_handle.dispatch_event() {#element-handle-dispatch-event}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.dispatch_event()`](/python/api/class-locator#locator-dispatch-event) instead. Read more about [locators](../locators.md).
:::

The snippet below dispatches the `click` event on the element. Regardless of the visibility state of the element, `click`
is dispatched. This is equivalent to calling
[element.click()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click).

**Usage**

::: code-group

```python [Async]
await element_handle.dispatch_event("click")
```

```python [Sync]
element_handle.dispatch_event("click")
```

:::

Under the hood, it creates an instance of an event based on the given [`type`](/python/api/class-elementhandle#element-handle-dispatch-event-option-type), initializes it with
[`event_init`](/python/api/class-elementhandle#element-handle-dispatch-event-option-event-init) properties and dispatches it on the element. Events are `composed`, `cancelable` and bubble by
default.

Since [`event_init`](/python/api/class-elementhandle#element-handle-dispatch-event-option-event-init) is event-specific, please refer to the events documentation for the lists of initial
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

You can also specify `JSHandle` as the property value if you want live objects to be passed into the event:

::: code-group

```python [Async]
# note you can only create data_transfer in chromium and firefox
data_transfer = await page.evaluate_handle("new DataTransfer()")
await element_handle.dispatch_event("#source", "dragstart", {"dataTransfer": data_transfer})
```

```python [Sync]
# note you can only create data_transfer in chromium and firefox
data_transfer = page.evaluate_handle("new DataTransfer()")
element_handle.dispatch_event("#source", "dragstart", {"dataTransfer": data_transfer})
```

:::

**Arguments**

- <a id="element-handle-dispatch-event-option-type"></a>`type` `string`

  DOM event type: `"click"`, `"dragstart"`, etc.
- <a id="element-handle-dispatch-event-option-event-init"></a>`event_init` `EvaluationArgument` *(optional)*

  Optional event-specific initialization properties.


### element_handle.dispose() {#element-handle-dispose}

<Badge type="info" text="Added in: v1.8" />

The `jsHandle.dispose` method stops referencing the element handle.


### element_handle.eval_on_selector() {#element-handle-eval-on-selector}

<Badge type="info" text="Added in: v1.9" />

::: warning Discouraged
This method does not wait for the element to pass actionability↵checks and therefore can lead to the flaky tests. Use [`locator.evaluate()`](/python/api/class-locator#locator-evaluate),↵other [Locator](/python/api/class-locator) helper methods or web-first assertions instead.
:::

Returns the return value of [`expression`](/python/api/class-elementhandle#element-handle-eval-on-selector-option-expression).

The method finds an element matching the specified selector in the `ElementHandle`s subtree and passes it as a first
argument to [`expression`](/python/api/class-elementhandle#element-handle-eval-on-selector-option-expression). If no elements match the selector, the method throws an error.

If [`expression`](/python/api/class-elementhandle#element-handle-eval-on-selector-option-expression) returns a [Promise], then [`element_handle.eval_on_selector()`](/python/api/class-elementhandle#element-handle-eval-on-selector) would wait for the promise to resolve and return its
value.

**Usage**

::: code-group

```python [Async]
tweet_handle = await page.query_selector(".tweet")
assert await tweet_handle.eval_on_selector(".like", "node => node.innerText") == "100"
assert await tweet_handle.eval_on_selector(".retweets", "node => node.innerText") == "10"
```

```python [Sync]
tweet_handle = page.query_selector(".tweet")
assert tweet_handle.eval_on_selector(".like", "node => node.innerText") == "100"
assert tweet_handle.eval_on_selector(".retweets", "node => node.innerText") == "10"
```

:::

**Arguments**

- <a id="element-handle-eval-on-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="element-handle-eval-on-selector-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="element-handle-eval-on-selector-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/python/api/class-elementhandle#element-handle-eval-on-selector-option-expression).

**Returns**

- `Serializable`


### element_handle.eval_on_selector_all() {#element-handle-eval-on-selector-all}

<Badge type="info" text="Added in: v1.9" />

::: warning Discouraged
In most cases, [`locator.evaluate_all()`](/python/api/class-locator#locator-evaluate-all),↵other [Locator](/python/api/class-locator) helper methods and web-first assertions do a better job.
:::

Returns the return value of [`expression`](/python/api/class-elementhandle#element-handle-eval-on-selector-all-option-expression).

The method finds all elements matching the specified selector in the `ElementHandle`'s subtree and passes an array of
matched elements as a first argument to [`expression`](/python/api/class-elementhandle#element-handle-eval-on-selector-all-option-expression).

If [`expression`](/python/api/class-elementhandle#element-handle-eval-on-selector-all-option-expression) returns a [Promise], then [`element_handle.eval_on_selector_all()`](/python/api/class-elementhandle#element-handle-eval-on-selector-all) would wait for the promise to resolve and return its
value.

**Usage**

```html
<div class="feed">
  <div class="tweet">Hello!</div>
  <div class="tweet">Hi!</div>
</div>
```

::: code-group

```python [Async]
feed_handle = await page.query_selector(".feed")
assert await feed_handle.eval_on_selector_all(".tweet", "nodes => nodes.map(n => n.innerText)") == ["hello!", "hi!"]
```

```python [Sync]
feed_handle = page.query_selector(".feed")
assert feed_handle.eval_on_selector_all(".tweet", "nodes => nodes.map(n => n.innerText)") == ["hello!", "hi!"]
```

:::

**Arguments**

- <a id="element-handle-eval-on-selector-all-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="element-handle-eval-on-selector-all-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="element-handle-eval-on-selector-all-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/python/api/class-elementhandle#element-handle-eval-on-selector-all-option-expression).

**Returns**

- `Serializable`


### element_handle.evaluate() {#element-handle-evaluate}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/python/api/class-elementhandle#element-handle-evaluate-option-expression).

This method passes this handle as the first argument to [`expression`](/python/api/class-elementhandle#element-handle-evaluate-option-expression).

If [`expression`](/python/api/class-elementhandle#element-handle-evaluate-option-expression) returns a [Promise], then `handle.evaluate` would wait for the promise to resolve and return
its value.

**Usage**

::: code-group

```python [Async]
tweet_handle = await page.query_selector(".tweet .retweets")
assert await tweet_handle.evaluate("node => node.innerText") == "10 retweets"
```

```python [Sync]
tweet_handle = page.query_selector(".tweet .retweets")
assert tweet_handle.evaluate("node => node.innerText") == "10 retweets"
```

:::

**Arguments**

- <a id="element-handle-evaluate-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="element-handle-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/python/api/class-elementhandle#element-handle-evaluate-option-expression).

**Returns**

- `Serializable`


### element_handle.evaluate_handle() {#element-handle-evaluate-handle}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/python/api/class-elementhandle#element-handle-evaluate-handle-option-expression) as a [JSHandle](/python/api/class-jshandle).

This method passes this handle as the first argument to [`expression`](/python/api/class-elementhandle#element-handle-evaluate-handle-option-expression).

The only difference between `jsHandle.evaluate` and `jsHandle.evaluateHandle` is that `jsHandle.evaluateHandle` returns [JSHandle](/python/api/class-jshandle).

If the function passed to the `jsHandle.evaluateHandle` returns a [Promise], then `jsHandle.evaluateHandle` would wait
for the promise to resolve and return its value.

See [`page.evaluate_handle()`](/python/api/class-page#page-evaluate-handle) for more details.

**Arguments**

- <a id="element-handle-evaluate-handle-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="element-handle-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/python/api/class-elementhandle#element-handle-evaluate-handle-option-expression).

**Returns**

- `JSHandle`


### element_handle.fill() {#element-handle-fill}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.fill()`](/python/api/class-locator#locator-fill) instead. Read more about [locators](../locators.md).
:::

This method waits for [actionability](../actionability.md) checks, focuses the element, fills it and triggers an `input` event after filling. Note that you can pass an empty string to clear the input field.

If the target element is not an `<input>`, `<textarea>` or `[contenteditable]` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be filled instead.

To send fine-grained keyboard events, use [`locator.press_sequentially()`](/python/api/class-locator#locator-press-sequentially).

**Arguments**

- <a id="element-handle-fill-option-value"></a>`value` `string`

  Value to set for the `<input>`, `<textarea>` or `[contenteditable]` element.
- <a id="element-handle-fill-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-fill-option-force"></a>`force` `boolean` *(optional)* <Badge type="info" text="Added in: v1.13" />

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-fill-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-fill-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### element_handle.focus() {#element-handle-focus}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.focus()`](/python/api/class-locator#locator-focus) instead. Read more about [locators](../locators.md).
:::

Calls [focus](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) on the element.


### element_handle.get_attribute() {#element-handle-get-attribute}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.get_attribute()`](/python/api/class-locator#locator-get-attribute) instead. Read more about [locators](../locators.md).
:::

Returns element attribute value.

**Arguments**

- <a id="element-handle-get-attribute-option-name"></a>`name` `string`

  Attribute name to get the value for.

**Returns**

- `null | string`


### element_handle.get_properties() {#element-handle-get-properties}

<Badge type="info" text="Added in: v1.8" />

The method returns a map with **own property names** as keys and JSHandle instances for the property values.

**Usage**

::: code-group

```python [Async]
handle = await page.evaluate_handle("({ window, document })")
properties = await handle.get_properties()
window_handle = properties.get("window")
document_handle = properties.get("document")
await handle.dispose()
```

```python [Sync]
handle = page.evaluate_handle("({ window, document })")
properties = handle.get_properties()
window_handle = properties.get("window")
document_handle = properties.get("document")
handle.dispose()
```

:::

**Returns**

- `Map<string, JSHandle>`


### element_handle.get_property() {#element-handle-get-property}

<Badge type="info" text="Added in: v1.8" />

Fetches a single property from the referenced object.

**Arguments**

- <a id="element-handle-get-property-option-property-name"></a>`property_name` `string`

  property to get

**Returns**

- `JSHandle`


### element_handle.hover() {#element-handle-hover}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.hover()`](/python/api/class-locator#locator-hover) instead. Read more about [locators](../locators.md).
:::

This method hovers over the element by performing the following steps:
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/python/api/class-elementhandle#element-handle-hover-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/python/api/class-page#page-mouse) to hover over the center of the element, or the specified [`position`](/python/api/class-elementhandle#element-handle-hover-option-position).

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-elementhandle#element-handle-hover-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="element-handle-hover-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-hover-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-hover-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="element-handle-hover-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)* <Badge type="info" text="Added in: v1.28" />

    This option has no effect.
  - <a id="element-handle-hover-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="element-handle-hover-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="element-handle-hover-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-hover-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### element_handle.inner_html() {#element-handle-inner-html}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.inner_html()`](/python/api/class-locator#locator-inner-html) instead. Read more about [locators](../locators.md).
:::

Returns the `element.innerHTML`.

**Returns**

- `string`


### element_handle.inner_text() {#element-handle-inner-text}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.inner_text()`](/python/api/class-locator#locator-inner-text) instead. Read more about [locators](../locators.md).
:::

Returns the `element.innerText`.

**Returns**

- `string`


### element_handle.input_value() {#element-handle-input-value}

<Badge type="info" text="Added in: v1.13" />

::: warning Discouraged
Use locator-based [`locator.input_value()`](/python/api/class-locator#locator-input-value) instead. Read more about [locators](../locators.md).
:::

Returns `input.value` for the selected `<input>` or `<textarea>` or `<select>` element.

Throws for non-input elements. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), returns the value of the control.

**Arguments**

- <a id="element-handle-input-value-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-input-value-option-timeout"></a>`timeout` `float` *(optional)*

**Returns**

- `string`


### element_handle.is_checked() {#element-handle-is-checked}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.is_checked()`](/python/api/class-locator#locator-is-checked) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is checked. Throws if the element is not a checkbox or radio input.

**Returns**

- `boolean`


### element_handle.is_disabled() {#element-handle-is-disabled}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.is_disabled()`](/python/api/class-locator#locator-is-disabled) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is disabled, the opposite of [enabled](../actionability.md#enabled).

**Returns**

- `boolean`


### element_handle.is_editable() {#element-handle-is-editable}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.is_editable()`](/python/api/class-locator#locator-is-editable) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [editable](../actionability.md#editable).

**Returns**

- `boolean`


### element_handle.is_enabled() {#element-handle-is-enabled}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.is_enabled()`](/python/api/class-locator#locator-is-enabled) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [enabled](../actionability.md#enabled).

**Returns**

- `boolean`


### element_handle.is_hidden() {#element-handle-is-hidden}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.is_hidden()`](/python/api/class-locator#locator-is-hidden) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is hidden, the opposite of [visible](../actionability.md#visible).

**Returns**

- `boolean`


### element_handle.is_visible() {#element-handle-is-visible}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.is_visible()`](/python/api/class-locator#locator-is-visible) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [visible](../actionability.md#visible).

**Returns**

- `boolean`


### element_handle.json_value() {#element-handle-json-value}

<Badge type="info" text="Added in: v1.8" />

Returns a JSON representation of the object. If the object has a `toJSON` function, it **will not be called**.

::: info
The method will return an empty JSON object if the referenced object is not stringifiable. It will throw an error if the
object has circular references.
:::

**Returns**

- `Serializable`


### element_handle.owner_frame() {#element-handle-owner-frame}

<Badge type="info" text="Added in: v1.8" />

Returns the frame containing the given element.

**Returns**

- `null | Frame`


### element_handle.press() {#element-handle-press}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.press()`](/python/api/class-locator#locator-press) instead. Read more about [locators](../locators.md).
:::

Focuses the element, and then uses [`keyboard.down()`](/python/api/class-keyboard#keyboard-down) and [`keyboard.up()`](/python/api/class-keyboard#keyboard-up).

[`key`](/python/api/class-elementhandle#element-handle-press-option-key) can specify the intended
[keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value or a single character to
generate the text for. A superset of the [`key`](/python/api/class-elementhandle#element-handle-press-option-key) values can be found
[here](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:

`F1` - `F12`, `Digit0`- `Digit9`, `KeyA`- `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
`Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.

Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`, `ShiftLeft`, `ControlOrMeta`.

Holding down `Shift` will type the text that corresponds to the [`key`](/python/api/class-elementhandle#element-handle-press-option-key) in the upper case.

If [`key`](/python/api/class-elementhandle#element-handle-press-option-key) is a single character, it is case-sensitive, so the values `a` and `A` will generate different
respective texts.

Shortcuts such as `key: "Control+o"`, `key: "Control++` or `key: "Control+Shift+T"` are supported as well. When specified with the
modifier, modifier is pressed and being held while the subsequent key is being pressed.

**Arguments**

- <a id="element-handle-press-option-key"></a>`key` `string`

  Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
- <a id="element-handle-press-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-press-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `keydown` and `keyup` in milliseconds. Defaults to 0.
  - <a id="element-handle-press-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can
    opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating
    to inaccessible pages. Defaults to `false`.
  - <a id="element-handle-press-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### element_handle.query_selector() {#element-handle-query-selector}

<Badge type="info" text="Added in: v1.9" />

::: warning Discouraged
Use locator-based [`page.locator()`](/python/api/class-page#page-locator) instead. Read more about [locators](../locators.md).
:::

The method finds an element matching the specified selector in the `ElementHandle`'s subtree. If no elements match the selector,
returns `null`.

**Arguments**

- <a id="element-handle-query-selector-option-selector"></a>`selector` `string`

  A selector to query for.

**Returns**

- `null | ElementHandle`


### element_handle.query_selector_all() {#element-handle-query-selector-all}

<Badge type="info" text="Added in: v1.9" />

::: warning Discouraged
Use locator-based [`page.locator()`](/python/api/class-page#page-locator) instead. Read more about [locators](../locators.md).
:::

The method finds all elements matching the specified selector in the `ElementHandle`s subtree. If no elements match the selector,
returns empty array.

**Arguments**

- <a id="element-handle-query-selector-all-option-selector"></a>`selector` `string`

  A selector to query for.

**Returns**

- `Array<ElementHandle>`


### element_handle.screenshot() {#element-handle-screenshot}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.screenshot()`](/python/api/class-locator#locator-screenshot) instead. Read more about [locators](../locators.md).
:::

This method captures a screenshot of the page, clipped to the size and position of this particular element. If the element is covered by other elements, it will not be actually visible on the screenshot. If the element is a scrollable container, only the currently scrolled content will be visible on the screenshot.

This method waits for the [actionability](../actionability.md) checks, then scrolls element into view before taking a
screenshot. If the element is detached from DOM, the method throws an error.

Returns the buffer with the captured screenshot.

**Arguments**

- <a id="element-handle-screenshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-screenshot-option-animations"></a>`animations` `"disabled" | "allow"` *(optional)*

    When set to `"disabled"`, stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
    * finite animations are fast-forwarded to completion, so they'll fire `transitionend` event.
    * infinite animations are canceled to initial state, and then played over after the screenshot.

    Defaults to `"allow"` that leaves animations untouched.
  - <a id="element-handle-screenshot-option-caret"></a>`caret` `"hide" | "initial"` *(optional)*

    When set to `"hide"`, screenshot will hide text caret. When set to `"initial"`, text caret behavior will not be changed.  Defaults to `"hide"`.
  - <a id="element-handle-screenshot-option-mask"></a>`mask` `Array<Locator>` *(optional)*

    Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with
    a pink box `#FF00FF` (customized by [`mask_color`](/python/api/class-elementhandle#element-handle-screenshot-option-mask-color)) that completely covers its bounding box.
    The mask is also applied to invisible elements, see [Matching only visible elements](../locators.md#matching-only-visible-elements) to disable that.
  - <a id="element-handle-screenshot-option-mask-color"></a>`mask_color` `string` *(optional)* <Badge type="info" text="Added in: v1.35" />

    Specify the color of the overlay box for masked elements, in [CSS color format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Default color is pink `#FF00FF`.
  - <a id="element-handle-screenshot-option-omit-background"></a>`omit_background` `boolean` *(optional)*

    Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images.
    Defaults to `false`.
  - <a id="element-handle-screenshot-option-path"></a>`path` `path` *(optional)*

    The file path to save the image to. The screenshot type will be inferred from file extension. If [`path`](/python/api/class-elementhandle#element-handle-screenshot-option-path) is a
    relative path, then it is resolved relative to the current working directory. If no path is provided, the image won't be
    saved to the disk.
  - <a id="element-handle-screenshot-option-quality"></a>`quality` `int` *(optional)*

    The quality of the image, between 0-100. Not applicable to `png` images. For `jpeg` the default is `80`.
    For `webp`, a quality of `100` (the default) produces a lossless image, while lower values use lossy compression.
  - <a id="element-handle-screenshot-option-scale"></a>`scale` `"css" | "device"` *(optional)*

    When set to `"css"`, screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using `"device"` option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.

    Defaults to `"device"`.
  - <a id="element-handle-screenshot-option-style"></a>`style` `string` *(optional)* <Badge type="info" text="Added in: v1.41" />

    Text of the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible
    or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies
    to the inner frames.
  - <a id="element-handle-screenshot-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-screenshot-option-type"></a>`type` `"png" | "jpeg" | "webp"` *(optional)*

    Specify screenshot type, defaults to `png`.

**Returns**

- `Buffer`


### element_handle.scroll_into_view_if_needed() {#element-handle-scroll-into-view-if-needed}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.scroll_into_view_if_needed()`](/python/api/class-locator#locator-scroll-into-view-if-needed) instead. Read more about [locators](../locators.md).
:::

This method waits for [actionability](../actionability.md) checks, then tries to scroll element into view, unless it is
completely visible as defined by
[IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)'s `ratio`.

Throws when `elementHandle` does not point to an element
[connected](https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected) to a Document or a ShadowRoot.

See [scrolling](../input.md#scrolling) for alternative ways to scroll.

**Arguments**

- <a id="element-handle-scroll-into-view-if-needed-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-scroll-into-view-if-needed-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### element_handle.select_option() {#element-handle-select-option}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.select_option()`](/python/api/class-locator#locator-select-option) instead. Read more about [locators](../locators.md).
:::

This method waits for [actionability](../actionability.md) checks, waits until all specified options are present in the `<select>` element and selects these options.

If the target element is not a `<select>` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be used instead.

Returns the array of option values that have been successfully selected.

Triggers a `change` and `input` event once all the provided options have been selected.

**Usage**

::: code-group

```python [Async]
# Single selection matching the value or label
await handle.select_option("blue")
# single selection matching the label
await handle.select_option(label="blue")
# multiple selection
await handle.select_option(value=["red", "green", "blue"])
```

```python [Sync]
# Single selection matching the value or label
handle.select_option("blue")
# single selection matching both the label
handle.select_option(label="blue")
# multiple selection
handle.select_option(value=["red", "green", "blue"])
```

:::

**Arguments**

- <a id="element-handle-select-option-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-select-option-option-element"></a>`element` `ElementHandle | Array<ElementHandle>` *(optional)*

    Option elements to select. Optional.
  - <a id="element-handle-select-option-option-force"></a>`force` `boolean` *(optional)* <Badge type="info" text="Added in: v1.13" />

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-select-option-option-index"></a>`index` `int | Array<int>` *(optional)*

    Options to select by index. Optional.
  - <a id="element-handle-select-option-option-label"></a>`label` `string | Array<string>` *(optional)*

    Options to select by label. If the `<select>` has the `multiple` attribute, all given options are selected, otherwise
    only the first option matching one of the passed options is selected. Optional.
  - <a id="element-handle-select-option-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-select-option-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
- <a id="element-handle-select-option-option-value"></a>`value` `string | Array<string>` *(optional)*

  Options to select by value. If the `<select>` has the `multiple` attribute, all given options are selected, otherwise
  only the first option matching one of the passed options is selected. Optional.

**Returns**

- `Array<string>`


### element_handle.select_text() {#element-handle-select-text}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.select_text()`](/python/api/class-locator#locator-select-text) instead. Read more about [locators](../locators.md).
:::

This method waits for [actionability](../actionability.md) checks, then focuses the element and selects all its text
content.

If the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), focuses and selects text in the control instead.

**Arguments**

- <a id="element-handle-select-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-select-text-option-force"></a>`force` `boolean` *(optional)* <Badge type="info" text="Added in: v1.13" />

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-select-text-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### element_handle.set_checked() {#element-handle-set-checked}

<Badge type="info" text="Added in: v1.15" />

::: warning Discouraged
Use locator-based [`locator.set_checked()`](/python/api/class-locator#locator-set-checked) instead. Read more about [locators](../locators.md).
:::

This method checks or unchecks an element by performing the following steps:
1. Ensure that element is a checkbox or a radio input. If not, this method throws.
1. If the element already has the right checked state, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/python/api/class-elementhandle#element-handle-set-checked-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/python/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now checked or unchecked. If not, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-elementhandle#element-handle-set-checked-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="element-handle-set-checked-option-checked"></a>`checked` `boolean`

  Whether to check or uncheck the checkbox.
- <a id="element-handle-set-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-set-checked-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-set-checked-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-set-checked-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="element-handle-set-checked-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="element-handle-set-checked-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-set-checked-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### element_handle.set_input_files() {#element-handle-set-input-files}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.set_input_files()`](/python/api/class-locator#locator-set-input-files) instead. Read more about [locators](../locators.md).
:::

Sets the value of the file input to these file paths or files. If some of the `filePaths` are relative paths, then they
are resolved relative to the current working directory. For empty array, clears the selected files.
For inputs with a `[webkitdirectory]` attribute, only a single directory path is supported.

This method expects [ElementHandle](/python/api/class-elementhandle) to point to an
[input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input). However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), targets the control instead.

**Arguments**

- <a id="element-handle-set-input-files-option-files"></a>`files` `path | Array<path> | Object | Array<Object>`

  - `name` `string`

    File name
  - `mime_type` `string`

    File type
  - `buffer` `Buffer`

    File content
- <a id="element-handle-set-input-files-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-set-input-files-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-set-input-files-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### element_handle.tap() {#element-handle-tap}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.tap()`](/python/api/class-locator#locator-tap) instead. Read more about [locators](../locators.md).
:::

This method taps the element by performing the following steps:
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/python/api/class-elementhandle#element-handle-tap-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.touchscreen`](/python/api/class-page#page-touchscreen) to tap the center of the element, or the specified [`position`](/python/api/class-elementhandle#element-handle-tap-option-position).

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-elementhandle#element-handle-tap-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

::: info
`elementHandle.tap()` requires that the `hasTouch` option of the browser context be set to true.
:::

**Arguments**

- <a id="element-handle-tap-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-tap-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-tap-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="element-handle-tap-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-tap-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="element-handle-tap-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="element-handle-tap-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-tap-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### element_handle.text_content() {#element-handle-text-content}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.text_content()`](/python/api/class-locator#locator-text-content) instead. Read more about [locators](../locators.md).
:::

Returns the `node.textContent`.

**Returns**

- `null | string`


### element_handle.uncheck() {#element-handle-uncheck}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.uncheck()`](/python/api/class-locator#locator-uncheck) instead. Read more about [locators](../locators.md).
:::

This method checks the element by performing the following steps:
1. Ensure that element is a checkbox or a radio input. If not, this method throws. If the element is already
   unchecked, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/python/api/class-elementhandle#element-handle-uncheck-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/python/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now unchecked. If not, this method throws.

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/python/api/class-elementhandle#element-handle-uncheck-option-timeout), this method throws a
[TimeoutError](/python/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="element-handle-uncheck-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-uncheck-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-uncheck-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-uncheck-option-position"></a>`position` `Object` *(optional)* <Badge type="info" text="Added in: v1.11" />

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float` <Badge type="info" text="Added in: v1.11" />
    - `y` `float` <Badge type="info" text="Added in: v1.11" />
  - <a id="element-handle-uncheck-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="element-handle-uncheck-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-uncheck-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### element_handle.wait_for_element_state() {#element-handle-wait-for-element-state}

<Badge type="info" text="Added in: v1.8" />

Returns when the element satisfies the [`state`](/python/api/class-elementhandle#element-handle-wait-for-element-state-option-state).

Depending on the [`state`](/python/api/class-elementhandle#element-handle-wait-for-element-state-option-state) parameter, this method waits for one of the [actionability](../actionability.md) checks
to pass. This method throws when the element is detached while waiting, unless waiting for the `"hidden"` state.
* `"visible"` Wait until the element is [visible](../actionability.md#visible).
* `"hidden"` Wait until the element is [not visible](../actionability.md#visible) or
  not attached. Note that waiting for hidden does not throw when the element detaches.
* `"stable"` Wait until the element is both [visible](../actionability.md#visible) and
  [stable](../actionability.md#stable).
* `"enabled"` Wait until the element is [enabled](../actionability.md#enabled).
* `"disabled"` Wait until the element is [not enabled](../actionability.md#enabled).
* `"editable"` Wait until the element is [editable](../actionability.md#editable).

If the element does not satisfy the condition for the [`timeout`](/python/api/class-elementhandle#element-handle-wait-for-element-state-option-timeout) milliseconds, this method will throw.

**Arguments**

- <a id="element-handle-wait-for-element-state-option-state"></a>`state` `"visible" | "hidden" | "stable" | "enabled" | "disabled" | "editable"`

  A state to wait for, see below for more details.
- <a id="element-handle-wait-for-element-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-wait-for-element-state-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.


### element_handle.wait_for_selector() {#element-handle-wait-for-selector}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use web assertions that assert visibility or a locator-based [`locator.wait_for()`](/python/api/class-locator#locator-wait-for) instead.
:::

Returns element specified by selector when it satisfies [`state`](/python/api/class-elementhandle#element-handle-wait-for-selector-option-state) option. Returns `null` if waiting for `hidden`
or `detached`.

Wait for the [`selector`](/python/api/class-elementhandle#element-handle-wait-for-selector-option-selector) relative to the element handle to satisfy [`state`](/python/api/class-elementhandle#element-handle-wait-for-selector-option-state) option (either
appear/disappear from dom, or become visible/hidden). If at the moment of calling the method [`selector`](/python/api/class-elementhandle#element-handle-wait-for-selector-option-selector) already
satisfies the condition, the method will return immediately. If the selector doesn't satisfy the condition for the
[`timeout`](/python/api/class-elementhandle#element-handle-wait-for-selector-option-timeout) milliseconds, the function will throw.

**Usage**

::: code-group

```python [Async]
await page.set_content("<div><span></span></div>")
div = await page.query_selector("div")
# waiting for the "span" selector relative to the div.
span = await div.wait_for_selector("span", state="attached")
```

```python [Sync]
page.set_content("<div><span></span></div>")
div = page.query_selector("div")
# waiting for the "span" selector relative to the div.
span = div.wait_for_selector("span", state="attached")
```

:::

::: info
This method does not work across navigations, use [`page.wait_for_selector()`](/python/api/class-page#page-wait-for-selector) instead.
:::

**Arguments**

- <a id="element-handle-wait-for-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="element-handle-wait-for-selector-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-wait-for-selector-option-state"></a>`state` `"attached" | "detached" | "visible" | "hidden"` *(optional)*

    Defaults to `'visible'`. Can be either:
    * `'attached'` - wait for element to be present in DOM.
    * `'detached'` - wait for element to not be present in DOM.
    * `'visible'` - wait for element to have non-empty bounding box and no `visibility:hidden`. Note that element without
      any content or with `display:none` has an empty bounding box and is not considered visible.
    * `'hidden'` - wait for element to be either detached from DOM, or have an empty bounding box or `visibility:hidden`.
      This is opposite to the `'visible'` option.
  - <a id="element-handle-wait-for-selector-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.15" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="element-handle-wait-for-selector-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

**Returns**

- `null | ElementHandle`


## Deprecated

### element_handle.type() {#element-handle-type}

<Badge type="info" text="Added in: v1.8" />

::: danger Deprecated
In most cases, you should use [`locator.fill()`](/python/api/class-locator#locator-fill) instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use [`locator.press_sequentially()`](/python/api/class-locator#locator-press-sequentially).
:::

Focuses the element, and then sends a `keydown`, `keypress`/`input`, and `keyup` event for each character in the text.

To press a special key, like `Control` or `ArrowDown`, use [`element_handle.press()`](/python/api/class-elementhandle#element-handle-press).

**Usage**

**Arguments**

- <a id="element-handle-type-option-text"></a>`text` `string`

  A text to type into a focused element.
- <a id="element-handle-type-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-type-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between key presses in milliseconds. Defaults to 0.
  - <a id="element-handle-type-option-no-wait-after"></a>`no_wait_after` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-type-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.set_default_timeout()`](/python/api/class-page#page-set-default-timeout) methods.

