---
title: ElementHandle
outline: 2
---

# ElementHandle

<Badge type="info" text="Added in: v1.8" />

Extends: [JSHandle](./class-jshandle)

* extends: [JSHandle](/api/class-jshandle)

ElementHandle represents an in-page DOM element. ElementHandles can be created with the [`page.$()`](/api/class-page#page-query-selector) method.

:::warning[Discouraged]

The use of ElementHandle is discouraged, use [Locator](/api/class-locator) objects and web-first assertions instead.
:::

```js
const hrefElement = await page.$('a');
await hrefElement.click();
```

ElementHandle prevents DOM element from garbage collection unless the handle is disposed with
[`jsHandle.dispose()`](/api/class-jshandle#js-handle-dispose). ElementHandles are auto-disposed when their origin frame gets navigated.

ElementHandle instances can be used as an argument in [`page.$eval()`](/api/class-page#page-eval-on-selector) and [`page.evaluate()`](/api/class-page#page-evaluate) methods.

The difference between the [Locator](/api/class-locator) and ElementHandle is that the ElementHandle points to a particular element, while [Locator](/api/class-locator) captures the logic of how to retrieve an element.

In the example below, handle points to a particular DOM element on page. If that element changes text or is used by React to render an entirely different component, handle is still pointing to that very DOM element. This can lead to unexpected behaviors.

```js
const handle = await page.$('text=Submit');
// ...
await handle.hover();
await handle.click();
```

With the locator, every time the `element` is used, up-to-date DOM element is located in the page using the selector. So in the snippet below, underlying DOM element is going to be located twice.

```js
const locator = page.getByText('Submit');
// ...
await locator.hover();
await locator.click();
```

## Methods

### elementHandle.$() {#element-handle-query-selector}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`page.locator()`](/api/class-page#page-locator) instead. Read more about [locators](../locators.md).
:::

The method finds an element matching the specified selector in the `ElementHandle`'s subtree. If no elements match the selector,
returns `null`.

**Arguments**

- <a id="element-handle-query-selector-option-selector"></a>`selector` `string`

  A selector to query for.

**Returns**

- `Promise<null | ElementHandle>`


### elementHandle.$$() {#element-handle-query-selector-all}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`page.locator()`](/api/class-page#page-locator) instead. Read more about [locators](../locators.md).
:::

The method finds all elements matching the specified selector in the `ElementHandle`s subtree. If no elements match the selector,
returns empty array.

**Arguments**

- <a id="element-handle-query-selector-all-option-selector"></a>`selector` `string`

  A selector to query for.

**Returns**

- `Promise<Array<ElementHandle>>`


### elementHandle.$$eval() {#element-handle-eval-on-selector-all}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning Discouraged
In most cases, [`locator.evaluateAll()`](/api/class-locator#locator-evaluate-all),↵other [Locator](/api/class-locator) helper methods and web-first assertions do a better job.
:::

Returns the return value of [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-all-option-expression).

The method finds all elements matching the specified selector in the `ElementHandle`'s subtree and passes an array of
matched elements as a first argument to [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-all-option-expression).

If [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-all-option-expression) returns a [Promise], then [`elementHandle.$$eval()`](/api/class-elementhandle#element-handle-eval-on-selector-all) would wait for the promise to resolve and return its
value.

**Usage**

```html
<div class="feed">
  <div class="tweet">Hello!</div>
  <div class="tweet">Hi!</div>
</div>
```

```js
const feedHandle = await page.$('.feed');
expect(await feedHandle.$$eval('.tweet', nodes =>
  nodes.map(n => n.innerText))).toEqual(['Hello!', 'Hi!'],
);
```

**Arguments**

- <a id="element-handle-eval-on-selector-all-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="element-handle-eval-on-selector-all-option-expression"></a>`pageFunction` `function(Array<Element>) | string`

  Function to be evaluated in the page context.
- <a id="element-handle-eval-on-selector-all-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-all-option-expression).

**Returns**

- `Promise<Serializable>`


### elementHandle.$eval() {#element-handle-eval-on-selector}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning Discouraged
This method does not wait for the element to pass actionability↵checks and therefore can lead to the flaky tests. Use [`locator.evaluate()`](/api/class-locator#locator-evaluate),↵other [Locator](/api/class-locator) helper methods or web-first assertions instead.
:::

Returns the return value of [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-option-expression).

The method finds an element matching the specified selector in the `ElementHandle`s subtree and passes it as a first
argument to [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-option-expression). If no elements match the selector, the method throws an error.

If [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-option-expression) returns a [Promise], then [`elementHandle.$eval()`](/api/class-elementhandle#element-handle-eval-on-selector) would wait for the promise to resolve and return its
value.

**Usage**

```js
const tweetHandle = await page.$('.tweet');
expect(await tweetHandle.$eval('.like', node => node.innerText)).toBe('100');
expect(await tweetHandle.$eval('.retweets', node => node.innerText)).toBe('10');
```

**Arguments**

- <a id="element-handle-eval-on-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="element-handle-eval-on-selector-option-expression"></a>`pageFunction` `function(Element) | string`

  Function to be evaluated in the page context.
- <a id="element-handle-eval-on-selector-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-option-expression).

**Returns**

- `Promise<Serializable>`


### elementHandle.asElement() {#element-handle-as-element}

<Badge type="info" text="Added in: v1.8" />

Returns either `null` or the object handle itself, if the object handle is an instance of [ElementHandle](/api/class-elementhandle).

**Returns**

- `null | ElementHandle`


### elementHandle.boundingBox() {#element-handle-bounding-box}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

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

```js
const box = await elementHandle.boundingBox();
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
```

**Returns**

- `Promise<null | Object>`


### elementHandle.check() {#element-handle-check}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.check()`](/api/class-locator#locator-check) instead. Read more about [locators](../locators.md).
:::

This method checks the element by performing the following steps:
1. Ensure that element is a checkbox or a radio input. If not, this method throws. If the element is already
   checked, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/api/class-elementhandle#element-handle-check-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now checked. If not, this method throws.

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/api/class-elementhandle#element-handle-check-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="element-handle-check-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-check-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-check-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

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
  - <a id="element-handle-check-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-check-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-check-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### elementHandle.click() {#element-handle-click}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.click()`](/api/class-locator#locator-click) instead. Read more about [locators](../locators.md).
:::

This method clicks the element by performing the following steps:
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/api/class-elementhandle#element-handle-click-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/api/class-page#page-mouse) to click in the center of the element, or the specified [`position`](/api/class-elementhandle#element-handle-click-option-position).
1. Wait for initiated navigations to either succeed or fail, unless [`noWaitAfter`](/api/class-elementhandle#element-handle-click-option-no-wait-after) option is set.

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/api/class-elementhandle#element-handle-click-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="element-handle-click-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-click-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="element-handle-click-option-click-count"></a>`clickCount` `int` *(optional)*

    defaults to 1. See [UIEvent.detail].
  - <a id="element-handle-click-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.
  - <a id="element-handle-click-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-click-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="element-handle-click-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

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
  - <a id="element-handle-click-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-click-option-steps"></a>`steps` `int` *(optional)* <Badge type="info" text="Added in: v1.57" />

    Defaults to 1. Sends `n` interpolated `mousemove` events to represent travel between Playwright's current cursor position and the provided destination. When set to 1, emits a single `mousemove` event at the destination location.
  - <a id="element-handle-click-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-click-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### elementHandle.contentFrame() {#element-handle-content-frame}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the content frame for element handles referencing iframe nodes, or `null` otherwise

**Returns**

- `Promise<null | Frame>`


### elementHandle.dblclick() {#element-handle-dblclick}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.dblclick()`](/api/class-locator#locator-dblclick) instead. Read more about [locators](../locators.md).
:::

This method double clicks the element by performing the following steps:
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/api/class-elementhandle#element-handle-dblclick-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/api/class-page#page-mouse) to double click in the center of the element, or the specified [`position`](/api/class-elementhandle#element-handle-dblclick-option-position).

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/api/class-elementhandle#element-handle-dblclick-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

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
  - <a id="element-handle-dblclick-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

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
  - <a id="element-handle-dblclick-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-dblclick-option-steps"></a>`steps` `int` *(optional)* <Badge type="info" text="Added in: v1.57" />

    Defaults to 1. Sends `n` interpolated `mousemove` events to represent travel between Playwright's current cursor position and the provided destination. When set to 1, emits a single `mousemove` event at the destination location.
  - <a id="element-handle-dblclick-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-dblclick-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### elementHandle.dispatchEvent() {#element-handle-dispatch-event}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.dispatchEvent()`](/api/class-locator#locator-dispatch-event) instead. Read more about [locators](../locators.md).
:::

The snippet below dispatches the `click` event on the element. Regardless of the visibility state of the element, `click`
is dispatched. This is equivalent to calling
[element.click()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click).

**Usage**

```js
await elementHandle.dispatchEvent('click');
```

Under the hood, it creates an instance of an event based on the given [`type`](/api/class-elementhandle#element-handle-dispatch-event-option-type), initializes it with
[`eventInit`](/api/class-elementhandle#element-handle-dispatch-event-option-event-init) properties and dispatches it on the element. Events are `composed`, `cancelable` and bubble by
default.

Since [`eventInit`](/api/class-elementhandle#element-handle-dispatch-event-option-event-init) is event-specific, please refer to the events documentation for the lists of initial
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

```js
// Note you can only create DataTransfer in Chromium and Firefox
const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
await elementHandle.dispatchEvent('dragstart', { dataTransfer });
```

**Arguments**

- <a id="element-handle-dispatch-event-option-type"></a>`type` `string`

  DOM event type: `"click"`, `"dragstart"`, etc.
- <a id="element-handle-dispatch-event-option-event-init"></a>`eventInit` `EvaluationArgument` *(optional)*

  Optional event-specific initialization properties.


### elementHandle.dispose() {#element-handle-dispose}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

The `jsHandle.dispose` method stops referencing the element handle.


### elementHandle.evaluate() {#element-handle-evaluate}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the return value of [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression).

This method passes this handle as the first argument to [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression).

If [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression) returns a [Promise], then `handle.evaluate` would wait for the promise to resolve and return
its value.

**Usage**

```js
const tweetHandle = await page.$('.tweet .retweets');
expect(await tweetHandle.evaluate(node => node.innerText)).toBe('10 retweets');
```

**Arguments**

- <a id="element-handle-evaluate-option-expression"></a>`pageFunction` `function() | string`

  Function to be evaluated in the page context.
- <a id="element-handle-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression).
- <a id="element-handle-evaluate-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-evaluate-option-expose-functions"></a>`exposeFunctions` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    When set to `true`, functions passed inside [`arg`](/api/class-elementhandle#element-handle-evaluate-option-arg) are exposed in the page and can be called from the page function. Calling one returns a [Promise] of its result. Under the hood, each function is exposed via [`page.exposeFunction()`](/api/class-page#page-expose-function), so it is technically accessible from all frames of the page. Exposed functions are cleared upon the top-level navigation. Defaults to `false`, in which case functions are not serializable and passing one throws an error.

**Returns**

- `Promise<Serializable>`


### elementHandle.evaluateHandle() {#element-handle-evaluate-handle}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the return value of [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-handle-option-expression) as a [JSHandle](/api/class-jshandle).

This method passes this handle as the first argument to [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-handle-option-expression).

The only difference between `jsHandle.evaluate` and `jsHandle.evaluateHandle` is that `jsHandle.evaluateHandle` returns [JSHandle](/api/class-jshandle).

If the function passed to the `jsHandle.evaluateHandle` returns a [Promise], then `jsHandle.evaluateHandle` would wait
for the promise to resolve and return its value.

See [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle) for more details.

**Arguments**

- <a id="element-handle-evaluate-handle-option-expression"></a>`pageFunction` `function() | string`

  Function to be evaluated in the page context.
- <a id="element-handle-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-handle-option-expression).
- <a id="element-handle-evaluate-handle-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-evaluate-handle-option-expose-functions"></a>`exposeFunctions` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    When set to `true`, functions passed inside [`arg`](/api/class-elementhandle#element-handle-evaluate-handle-option-arg) are exposed in the page and can be called from the page function. Calling one returns a [Promise] of its result. Under the hood, each function is exposed via [`page.exposeFunction()`](/api/class-page#page-expose-function), so it is technically accessible from all frames of the page. Exposed functions are cleared upon the top-level navigation. Defaults to `false`, in which case functions are not serializable and passing one throws an error.

**Returns**

- `Promise<JSHandle>`


### elementHandle.fill() {#element-handle-fill}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.fill()`](/api/class-locator#locator-fill) instead. Read more about [locators](../locators.md).
:::

This method waits for [actionability](../actionability.md) checks, focuses the element, fills it and triggers an `input` event after filling. Note that you can pass an empty string to clear the input field.

If the target element is not an `<input>`, `<textarea>` or `[contenteditable]` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be filled instead.

To send fine-grained keyboard events, use [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially).

**Arguments**

- <a id="element-handle-fill-option-value"></a>`value` `string`

  Value to set for the `<input>`, `<textarea>` or `[contenteditable]` element.
- <a id="element-handle-fill-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-fill-option-force"></a>`force` `boolean` *(optional)* <Badge type="info" text="Added in: v1.13" />

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-fill-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-fill-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-fill-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### elementHandle.focus() {#element-handle-focus}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.focus()`](/api/class-locator#locator-focus) instead. Read more about [locators](../locators.md).
:::

Calls [focus](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) on the element.


### elementHandle.getAttribute() {#element-handle-get-attribute}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.getAttribute()`](/api/class-locator#locator-get-attribute) instead. Read more about [locators](../locators.md).
:::

Returns element attribute value.

**Arguments**

- <a id="element-handle-get-attribute-option-name"></a>`name` `string`

  Attribute name to get the value for.

**Returns**

- `Promise<null | string>`


### elementHandle.getProperties() {#element-handle-get-properties}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

The method returns a map with **own property names** as keys and JSHandle instances for the property values.

**Usage**

```js
const handle = await page.evaluateHandle(() => ({ window, document }));
const properties = await handle.getProperties();
const windowHandle = properties.get('window');
const documentHandle = properties.get('document');
await handle.dispose();
```

**Returns**

- `Promise<Map<string, JSHandle>>`


### elementHandle.getProperty() {#element-handle-get-property}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Fetches a single property from the referenced object.

**Arguments**

- <a id="element-handle-get-property-option-property-name"></a>`propertyName` `string`

  property to get

**Returns**

- `Promise<JSHandle>`


### elementHandle.hover() {#element-handle-hover}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.hover()`](/api/class-locator#locator-hover) instead. Read more about [locators](../locators.md).
:::

This method hovers over the element by performing the following steps:
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/api/class-elementhandle#element-handle-hover-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/api/class-page#page-mouse) to hover over the center of the element, or the specified [`position`](/api/class-elementhandle#element-handle-hover-option-position).

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/api/class-elementhandle#element-handle-hover-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="element-handle-hover-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-hover-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-hover-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="element-handle-hover-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)* <Badge type="info" text="Added in: v1.28" />

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
  - <a id="element-handle-hover-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-hover-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-hover-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### elementHandle.innerHTML() {#element-handle-inner-html}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.innerHTML()`](/api/class-locator#locator-inner-html) instead. Read more about [locators](../locators.md).
:::

Returns the `element.innerHTML`.

**Returns**

- `Promise<string>`


### elementHandle.innerText() {#element-handle-inner-text}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.innerText()`](/api/class-locator#locator-inner-text) instead. Read more about [locators](../locators.md).
:::

Returns the `element.innerText`.

**Returns**

- `Promise<string>`


### elementHandle.inputValue() {#element-handle-input-value}

<Badge type="info" text="Added in: v1.13" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.inputValue()`](/api/class-locator#locator-input-value) instead. Read more about [locators](../locators.md).
:::

Returns `input.value` for the selected `<input>` or `<textarea>` or `<select>` element.

Throws for non-input elements. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), returns the value of the control.

**Arguments**

- <a id="element-handle-input-value-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-input-value-option-timeout"></a>`timeout` `float` *(optional)*

**Returns**

- `Promise<string>`


### elementHandle.isChecked() {#element-handle-is-checked}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.isChecked()`](/api/class-locator#locator-is-checked) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is checked. Throws if the element is not a checkbox or radio input.

**Returns**

- `Promise<boolean>`


### elementHandle.isDisabled() {#element-handle-is-disabled}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.isDisabled()`](/api/class-locator#locator-is-disabled) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is disabled, the opposite of [enabled](../actionability.md#enabled).

**Returns**

- `Promise<boolean>`


### elementHandle.isEditable() {#element-handle-is-editable}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.isEditable()`](/api/class-locator#locator-is-editable) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [editable](../actionability.md#editable).

**Returns**

- `Promise<boolean>`


### elementHandle.isEnabled() {#element-handle-is-enabled}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.isEnabled()`](/api/class-locator#locator-is-enabled) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [enabled](../actionability.md#enabled).

**Returns**

- `Promise<boolean>`


### elementHandle.isHidden() {#element-handle-is-hidden}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.isHidden()`](/api/class-locator#locator-is-hidden) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is hidden, the opposite of [visible](../actionability.md#visible).

**Returns**

- `Promise<boolean>`


### elementHandle.isVisible() {#element-handle-is-visible}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.isVisible()`](/api/class-locator#locator-is-visible) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [visible](../actionability.md#visible).

**Returns**

- `Promise<boolean>`


### elementHandle.jsonValue() {#element-handle-json-value}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns a JSON representation of the object. If the object has a `toJSON` function, it **will not be called**.

::: info
The method will return an empty JSON object if the referenced object is not stringifiable. It will throw an error if the
object has circular references.
:::

**Returns**

- `Promise<Serializable>`


### elementHandle.ownerFrame() {#element-handle-owner-frame}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the frame containing the given element.

**Returns**

- `Promise<null | Frame>`


### elementHandle.press() {#element-handle-press}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.press()`](/api/class-locator#locator-press) instead. Read more about [locators](../locators.md).
:::

Focuses the element, and then uses [`keyboard.down()`](/api/class-keyboard#keyboard-down) and [`keyboard.up()`](/api/class-keyboard#keyboard-up).

[`key`](/api/class-elementhandle#element-handle-press-option-key) can specify the intended
[keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value or a single character to
generate the text for. A superset of the [`key`](/api/class-elementhandle#element-handle-press-option-key) values can be found
[here](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:

`F1` - `F12`, `Digit0`- `Digit9`, `KeyA`- `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
`Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.

Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`, `ShiftLeft`, `ControlOrMeta`.

Holding down `Shift` will type the text that corresponds to the [`key`](/api/class-elementhandle#element-handle-press-option-key) in the upper case.

If [`key`](/api/class-elementhandle#element-handle-press-option-key) is a single character, it is case-sensitive, so the values `a` and `A` will generate different
respective texts.

Shortcuts such as `key: "Control+o"`, `key: "Control++` or `key: "Control+Shift+T"` are supported as well. When specified with the
modifier, modifier is pressed and being held while the subsequent key is being pressed.

**Arguments**

- <a id="element-handle-press-option-key"></a>`key` `string`

  Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
- <a id="element-handle-press-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-press-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `keydown` and `keyup` in milliseconds. Defaults to 0.
  - <a id="element-handle-press-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can
    opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating
    to inaccessible pages. Defaults to `false`.
  - <a id="element-handle-press-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-press-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### elementHandle.screenshot() {#element-handle-screenshot}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.screenshot()`](/api/class-locator#locator-screenshot) instead. Read more about [locators](../locators.md).
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
    a pink box `#FF00FF` (customized by [`maskColor`](/api/class-elementhandle#element-handle-screenshot-option-mask-color)) that completely covers its bounding box.
    The mask is also applied to invisible elements, see [Matching only visible elements](../locators.md#matching-only-visible-elements) to disable that.
  - <a id="element-handle-screenshot-option-mask-color"></a>`maskColor` `string` *(optional)* <Badge type="info" text="Added in: v1.35" />

    Specify the color of the overlay box for masked elements, in [CSS color format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Default color is pink `#FF00FF`.
  - <a id="element-handle-screenshot-option-omit-background"></a>`omitBackground` `boolean` *(optional)*

    Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images.
    Defaults to `false`.
  - <a id="element-handle-screenshot-option-path"></a>`path` `path` *(optional)*

    The file path to save the image to. The screenshot type will be inferred from file extension. If [`path`](/api/class-elementhandle#element-handle-screenshot-option-path) is a
    relative path, then it is resolved relative to the current working directory. If no path is provided, the image won't be
    saved to the disk.
  - <a id="element-handle-screenshot-option-quality"></a>`quality` `int` *(optional)*

    The quality of the image, between 0-100. Not applicable to `png` images. For `jpeg` the default is `80`.
    For `webp`, a quality of `100` (the default) produces a lossless image, while lower values use lossy compression.
  - <a id="element-handle-screenshot-option-scale"></a>`scale` `"css" | "device"` *(optional)*

    When set to `"css"`, screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using `"device"` option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.

    Defaults to `"device"`.
  - <a id="element-handle-screenshot-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-screenshot-option-style"></a>`style` `string` *(optional)* <Badge type="info" text="Added in: v1.41" />

    Text of the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible
    or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies
    to the inner frames.
  - <a id="element-handle-screenshot-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-screenshot-option-type"></a>`type` `"png" | "jpeg" | "webp"` *(optional)*

    Specify screenshot type, defaults to `png`.

**Returns**

- `Promise<Buffer>`


### elementHandle.scrollIntoViewIfNeeded() {#element-handle-scroll-into-view-if-needed}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.scrollIntoViewIfNeeded()`](/api/class-locator#locator-scroll-into-view-if-needed) instead. Read more about [locators](../locators.md).
:::

This method waits for [actionability](../actionability.md) checks, then tries to scroll element into view, unless it is
completely visible as defined by
[IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)'s `ratio`.

Throws when `elementHandle` does not point to an element
[connected](https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected) to a Document or a ShadowRoot.

See [scrolling](../input.md#scrolling) for alternative ways to scroll.

**Arguments**

- <a id="element-handle-scroll-into-view-if-needed-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-scroll-into-view-if-needed-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-scroll-into-view-if-needed-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### elementHandle.selectOption() {#element-handle-select-option}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.selectOption()`](/api/class-locator#locator-select-option) instead. Read more about [locators](../locators.md).
:::

This method waits for [actionability](../actionability.md) checks, waits until all specified options are present in the `<select>` element and selects these options.

If the target element is not a `<select>` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be used instead.

Returns the array of option values that have been successfully selected.

Triggers a `change` and `input` event once all the provided options have been selected.

**Usage**

```js
// Single selection matching the value or label
handle.selectOption('blue');

// single selection matching the label
handle.selectOption({ label: 'Blue' });

// multiple selection
handle.selectOption(['red', 'green', 'blue']);
```

**Arguments**

- <a id="element-handle-select-option-option-values"></a>`values` `null | string | ElementHandle | Array<string> | Object | Array<ElementHandle> | Array<Object>`

  Options to select. If the `<select>` has the `multiple` attribute, all matching options are selected, otherwise only the
  first option matching one of the passed options is selected. String values are matching both values and labels. Option
  is considered matching if all specified properties match.

  - `value` `string` *(optional)*

    Matches by `option.value`. Optional.
  - `label` `string` *(optional)*

    Matches by `option.label`. Optional.
  - `index` `int` *(optional)*

    Matches by the index. Optional.
- <a id="element-handle-select-option-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-select-option-option-force"></a>`force` `boolean` *(optional)* <Badge type="info" text="Added in: v1.13" />

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-select-option-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-select-option-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-select-option-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<Array<string>>`


### elementHandle.selectText() {#element-handle-select-text}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.selectText()`](/api/class-locator#locator-select-text) instead. Read more about [locators](../locators.md).
:::

This method waits for [actionability](../actionability.md) checks, then focuses the element and selects all its text
content.

If the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), focuses and selects text in the control instead.

**Arguments**

- <a id="element-handle-select-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-select-text-option-force"></a>`force` `boolean` *(optional)* <Badge type="info" text="Added in: v1.13" />

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-select-text-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-select-text-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### elementHandle.setChecked() {#element-handle-set-checked}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.setChecked()`](/api/class-locator#locator-set-checked) instead. Read more about [locators](../locators.md).
:::

This method checks or unchecks an element by performing the following steps:
1. Ensure that element is a checkbox or a radio input. If not, this method throws.
1. If the element already has the right checked state, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/api/class-elementhandle#element-handle-set-checked-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now checked or unchecked. If not, this method throws.

When all steps combined have not finished during the specified [`timeout`](/api/class-elementhandle#element-handle-set-checked-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="element-handle-set-checked-option-checked"></a>`checked` `boolean`

  Whether to check or uncheck the checkbox.
- <a id="element-handle-set-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-set-checked-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-set-checked-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

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
  - <a id="element-handle-set-checked-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-set-checked-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-set-checked-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### elementHandle.setInputFiles() {#element-handle-set-input-files}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.setInputFiles()`](/api/class-locator#locator-set-input-files) instead. Read more about [locators](../locators.md).
:::

Sets the value of the file input to these file paths or files. If some of the `filePaths` are relative paths, then they
are resolved relative to the current working directory. For empty array, clears the selected files.
For inputs with a `[webkitdirectory]` attribute, only a single directory path is supported.

This method expects [ElementHandle](/api/class-elementhandle) to point to an
[input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input). However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), targets the control instead.

**Arguments**

- <a id="element-handle-set-input-files-option-files"></a>`files` `path | Array<path> | Object | Array<Object>`

  - `name` `string`

    File name
  - `mimeType` `string`

    File type
  - `buffer` `Buffer`

    File content
- <a id="element-handle-set-input-files-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-set-input-files-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-set-input-files-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-set-input-files-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### elementHandle.tap() {#element-handle-tap}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.tap()`](/api/class-locator#locator-tap) instead. Read more about [locators](../locators.md).
:::

This method taps the element by performing the following steps:
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/api/class-elementhandle#element-handle-tap-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.touchscreen`](/api/class-page#page-touchscreen) to tap the center of the element, or the specified [`position`](/api/class-elementhandle#element-handle-tap-option-position).

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/api/class-elementhandle#element-handle-tap-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

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
  - <a id="element-handle-tap-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

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
  - <a id="element-handle-tap-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-tap-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-tap-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### elementHandle.textContent() {#element-handle-text-content}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.textContent()`](/api/class-locator#locator-text-content) instead. Read more about [locators](../locators.md).
:::

Returns the `node.textContent`.

**Returns**

- `Promise<null | string>`


### elementHandle.uncheck() {#element-handle-uncheck}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.uncheck()`](/api/class-locator#locator-uncheck) instead. Read more about [locators](../locators.md).
:::

This method checks the element by performing the following steps:
1. Ensure that element is a checkbox or a radio input. If not, this method throws. If the element is already
   unchecked, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the element, unless [`force`](/api/class-elementhandle#element-handle-uncheck-option-force) option is set.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now unchecked. If not, this method throws.

If the element is detached from the DOM at any moment during the action, this method throws.

When all steps combined have not finished during the specified [`timeout`](/api/class-elementhandle#element-handle-uncheck-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="element-handle-uncheck-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-uncheck-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="element-handle-uncheck-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

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
  - <a id="element-handle-uncheck-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-uncheck-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="element-handle-uncheck-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### elementHandle.waitForElementState() {#element-handle-wait-for-element-state}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns when the element satisfies the [`state`](/api/class-elementhandle#element-handle-wait-for-element-state-option-state).

Depending on the [`state`](/api/class-elementhandle#element-handle-wait-for-element-state-option-state) parameter, this method waits for one of the [actionability](../actionability.md) checks
to pass. This method throws when the element is detached while waiting, unless waiting for the `"hidden"` state.
* `"visible"` Wait until the element is [visible](../actionability.md#visible).
* `"hidden"` Wait until the element is [not visible](../actionability.md#visible) or
  not attached. Note that waiting for hidden does not throw when the element detaches.
* `"stable"` Wait until the element is both [visible](../actionability.md#visible) and
  [stable](../actionability.md#stable).
* `"enabled"` Wait until the element is [enabled](../actionability.md#enabled).
* `"disabled"` Wait until the element is [not enabled](../actionability.md#enabled).
* `"editable"` Wait until the element is [editable](../actionability.md#editable).

If the element does not satisfy the condition for the [`timeout`](/api/class-elementhandle#element-handle-wait-for-element-state-option-timeout) milliseconds, this method will throw.

**Arguments**

- <a id="element-handle-wait-for-element-state-option-state"></a>`state` `"visible" | "hidden" | "stable" | "enabled" | "disabled" | "editable"`

  A state to wait for, see below for more details.
- <a id="element-handle-wait-for-element-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-wait-for-element-state-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-wait-for-element-state-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### elementHandle.waitForSelector() {#element-handle-wait-for-selector}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use web assertions that assert visibility or a locator-based [`locator.waitFor()`](/api/class-locator#locator-wait-for) instead.
:::

Returns element specified by selector when it satisfies [`state`](/api/class-elementhandle#element-handle-wait-for-selector-option-state) option. Returns `null` if waiting for `hidden`
or `detached`.

Wait for the [`selector`](/api/class-elementhandle#element-handle-wait-for-selector-option-selector) relative to the element handle to satisfy [`state`](/api/class-elementhandle#element-handle-wait-for-selector-option-state) option (either
appear/disappear from dom, or become visible/hidden). If at the moment of calling the method [`selector`](/api/class-elementhandle#element-handle-wait-for-selector-option-selector) already
satisfies the condition, the method will return immediately. If the selector doesn't satisfy the condition for the
[`timeout`](/api/class-elementhandle#element-handle-wait-for-selector-option-timeout) milliseconds, the function will throw.

**Usage**

```js
await page.setContent(`<div><span></span></div>`);
const div = await page.$('div');
// Waiting for the 'span' selector relative to the div.
const span = await div.waitForSelector('span', { state: 'attached' });
```

::: info
This method does not work across navigations, use [`page.waitForSelector()`](/api/class-page#page-wait-for-selector) instead.
:::

**Arguments**

- <a id="element-handle-wait-for-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="element-handle-wait-for-selector-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-wait-for-selector-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
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

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<null | ElementHandle>`


## Deprecated

### elementHandle.type() {#element-handle-type}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: danger Deprecated
In most cases, you should use [`locator.fill()`](/api/class-locator#locator-fill) instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially).
:::

Focuses the element, and then sends a `keydown`, `keypress`/`input`, and `keyup` event for each character in the text.

To press a special key, like `Control` or `ArrowDown`, use [`elementHandle.press()`](/api/class-elementhandle#element-handle-press).

**Usage**

**Arguments**

- <a id="element-handle-type-option-text"></a>`text` `string`

  A text to type into a focused element.
- <a id="element-handle-type-option-options"></a>`options` `Object` *(optional)*

  - <a id="element-handle-type-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between key presses in milliseconds. Defaults to 0.
  - <a id="element-handle-type-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="element-handle-type-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="element-handle-type-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

