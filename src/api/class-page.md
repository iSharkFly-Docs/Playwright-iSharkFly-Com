---
title: Page
outline: 2
---

# Page

<Badge type="info" text="Added in: v1.8" />

Page provides methods to interact with a single tab in a [Browser](/api/class-browser), or an
[extension background page](https://developer.chrome.com/extensions/background_pages) in Chromium. One [Browser](/api/class-browser)
instance might have multiple [Page](/api/class-page) instances.

This example creates a page, navigates it to a URL, and then saves a screenshot:

```js
const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.

(async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
```

The Page class emits various events (described below) which can be handled using any of Node's native
[`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) methods, such as `on`, `once` or
`removeListener`.

This example logs a message for a single page `load` event:

```js
page.once('load', () => console.log('Page loaded!'));
```

To unsubscribe from events use the `removeListener` method:

```js
function logRequest(interceptedRequest) {
  console.log('A request was made:', interceptedRequest.url());
}
page.on('request', logRequest);
// Sometime later...
page.removeListener('request', logRequest);
```

## Methods

### page.$() {#page-query-selector}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`page.locator()`](/api/class-page#page-locator) instead. Read more about [locators](../locators.md).
:::

The method finds an element matching the specified selector within the page. If no elements match the selector, the
return value resolves to `null`. To wait for an element on the page, use [`locator.waitFor()`](/api/class-locator#locator-wait-for).

**Arguments**

- <a id="page-query-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="page-query-selector-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-query-selector-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.

**Returns**

- `Promise<null | ElementHandle>`


### page.$$() {#page-query-selector-all}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`page.locator()`](/api/class-page#page-locator) instead. Read more about [locators](../locators.md).
:::

The method finds all elements matching the specified selector within the page. If no elements match the selector, the
return value resolves to `[]`.

**Arguments**

- <a id="page-query-selector-all-option-selector"></a>`selector` `string`

  A selector to query for.

**Returns**

- `Promise<Array<ElementHandle>>`


### page.$$eval() {#page-eval-on-selector-all}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning Discouraged
In most cases, [`locator.evaluateAll()`](/api/class-locator#locator-evaluate-all),↵other [Locator](/api/class-locator) helper methods and web-first assertions do a better job.
:::

The method finds all elements matching the specified selector within the page and passes an array of matched elements as
a first argument to [`pageFunction`](/api/class-page#page-eval-on-selector-all-option-expression). Returns the result of [`pageFunction`](/api/class-page#page-eval-on-selector-all-option-expression) invocation.

If [`pageFunction`](/api/class-page#page-eval-on-selector-all-option-expression) returns a [Promise], then [`page.$$eval()`](/api/class-page#page-eval-on-selector-all) would wait for the promise to resolve and
return its value.

**Usage**

```js
const divCounts = await page.$$eval('div', (divs, min) => divs.length >= min, 10);
```

**Arguments**

- <a id="page-eval-on-selector-all-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="page-eval-on-selector-all-option-expression"></a>`pageFunction` `function(Array<Element>) | string`

  Function to be evaluated in the page context.
- <a id="page-eval-on-selector-all-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-page#page-eval-on-selector-all-option-expression).

**Returns**

- `Promise<Serializable>`


### page.$eval() {#page-eval-on-selector}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning Discouraged
This method does not wait for the element to pass actionability↵checks and therefore can lead to the flaky tests. Use [`locator.evaluate()`](/api/class-locator#locator-evaluate),↵other [Locator](/api/class-locator) helper methods or web-first assertions instead.
:::

The method finds an element matching the specified selector within the page and passes it as a first argument to
[`pageFunction`](/api/class-page#page-eval-on-selector-option-expression). If no elements match the selector, the method throws an error. Returns the value of
[`pageFunction`](/api/class-page#page-eval-on-selector-option-expression).

If [`pageFunction`](/api/class-page#page-eval-on-selector-option-expression) returns a [Promise], then [`page.$eval()`](/api/class-page#page-eval-on-selector) would wait for the promise to resolve and
return its value.

**Usage**

```js
const searchValue = await page.$eval('#search', el => el.value);
const preloadHref = await page.$eval('link[rel=preload]', el => el.href);
const html = await page.$eval('.main-container', (e, suffix) => e.outerHTML + suffix, 'hello');
// In TypeScript, this example requires an explicit type annotation (HTMLLinkElement) on el:
const preloadHrefTS = await page.$eval('link[rel=preload]', (el: HTMLLinkElement) => el.href);
```

**Arguments**

- <a id="page-eval-on-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="page-eval-on-selector-option-expression"></a>`pageFunction` `function(Element) | string`

  Function to be evaluated in the page context.
- <a id="page-eval-on-selector-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-page#page-eval-on-selector-option-expression).
- <a id="page-eval-on-selector-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-eval-on-selector-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.

**Returns**

- `Promise<Serializable>`


### page.addInitScript() {#page-add-init-script}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Adds a script which would be evaluated in one of the following scenarios:
* Whenever the page is navigated.
* Whenever the child frame is attached or navigated. In this case, the script is evaluated in the context of the newly
  attached frame.

The script is evaluated after the document was created but before any of its scripts were run. This is useful to amend
the JavaScript environment, e.g. to seed `Math.random`.

**Usage**

An example of overriding `Math.random` before the page loads:

```js
// preload.js
Math.random = () => 42;
```

```js
// In your playwright script, assuming the preload.js file is in same directory
await page.addInitScript({ path: './preload.js' });
```

```js
await page.addInitScript(mock => {
  window.mock = mock;
}, mock);
```

::: info
The order of evaluation of multiple scripts installed via [`browserContext.addInitScript()`](/api/class-browsercontext#browser-context-add-init-script) and
[`page.addInitScript()`](/api/class-page#page-add-init-script) is not defined.
:::

**Arguments**

- <a id="page-add-init-script-option-script"></a>`script` `function() | string | Object`

  Script to be evaluated in the page.

  - `path` `path` *(optional)*

    Path to the JavaScript file. If `path` is a relative path, then it is resolved relative to the
    current working directory. Optional.
  - `content` `string` *(optional)*

    Raw script content. Optional.
- <a id="page-add-init-script-option-arg"></a>`arg` `Serializable` *(optional)*

  Optional argument to pass to [`script`](/api/class-page#page-add-init-script-option-script) (only supported when passing a function).
- <a id="page-add-init-script-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-add-init-script-option-expose-functions"></a>`exposeFunctions` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    When set to `true`, functions passed inside [`arg`](/api/class-page#page-add-init-script-option-arg) are exposed in the page and can be called from the init script. Calling one returns a [Promise] of its result. Under the hood, each function is exposed via [`page.exposeFunction()`](/api/class-page#page-expose-function), so it is technically accessible from all frames of the page. Unlike functions passed to [`page.evaluate()`](/api/class-page#page-evaluate), functions passed to an init script are exposed in every new document, so they survive navigations. Defaults to `false`, in which case functions are not serializable and are silently dropped.

**Returns**

- `Promise<Disposable>`


### page.addLocatorHandler() {#page-add-locator-handler}

<Badge type="info" text="Added in: v1.42" /> <Badge type="tip" text="async" />

When testing a web page, sometimes unexpected overlays like a "Sign up" dialog appear and block actions you want to automate, e.g. clicking a button. These overlays don't always show up in the same way or at the same time, making them tricky to handle in automated tests.

This method lets you set up a special function, called a handler, that activates when it detects that overlay is visible. The handler's job is to remove the overlay, allowing your test to continue as if the overlay wasn't there.

Things to keep in mind:
* When an overlay is shown predictably, we recommend explicitly waiting for it in your test and dismissing it as a part of your normal test flow, instead of using [`page.addLocatorHandler()`](/api/class-page#page-add-locator-handler).
* Playwright checks for the overlay every time before executing or retrying an action that requires an [actionability check](../actionability.md), or before performing an auto-waiting assertion check. When overlay is visible, Playwright calls the handler first, and then proceeds with the action/assertion. Note that the handler is only called when you perform an action/assertion - if the overlay becomes visible but you don't perform any actions, the handler will not be triggered.
* After executing the handler, Playwright will ensure that overlay that triggered the handler is not visible anymore. You can opt-out of this behavior with [`noWaitAfter`](/api/class-page#page-add-locator-handler-option-no-wait-after).
* The execution time of the handler counts towards the timeout of the action/assertion that executed the handler. If your handler takes too long, it might cause timeouts.
* You can register multiple handlers. However, only a single handler will be running at a time. Make sure the actions within a handler don't depend on another handler.

::: warning
Running the handler will alter your page state mid-test. For example it will change the currently focused element and move the mouse. Make sure that actions that run after the handler are self-contained and do not rely on the focus and mouse state being unchanged.

For example, consider a test that calls [`locator.focus()`](/api/class-locator#locator-focus) followed by [`keyboard.press()`](/api/class-keyboard#keyboard-press). If your handler clicks a button between these two actions, the focused element most likely will be wrong, and key press will happen on the unexpected element. Use [`locator.press()`](/api/class-locator#locator-press) instead to avoid this problem.

Another example is a series of mouse actions, where [`mouse.move()`](/api/class-mouse#mouse-move) is followed by [`mouse.down()`](/api/class-mouse#mouse-down). Again, when the handler runs between these two actions, the mouse position will be wrong during the mouse down. Prefer self-contained actions like [`locator.click()`](/api/class-locator#locator-click) that do not rely on the state being unchanged by a handler.
:::

**Usage**

An example that closes a "Sign up to the newsletter" dialog when it appears:

```js
// Setup the handler.
await page.addLocatorHandler(page.getByText('Sign up to the newsletter'), async () => {
  await page.getByRole('button', { name: 'No thanks' }).click();
});

// Write the test as usual.
await page.goto('https://example.com');
await page.getByRole('button', { name: 'Start here' }).click();
```

An example that skips the "Confirm your security details" page when it is shown:

```js
// Setup the handler.
await page.addLocatorHandler(page.getByText('Confirm your security details'), async () => {
  await page.getByRole('button', { name: 'Remind me later' }).click();
});

// Write the test as usual.
await page.goto('https://example.com');
await page.getByRole('button', { name: 'Start here' }).click();
```

An example with a custom callback on every actionability check. It uses a `<body>` locator that is always visible, so the handler is called before every actionability check. It is important to specify [`noWaitAfter`](/api/class-page#page-add-locator-handler-option-no-wait-after), because the handler does not hide the `<body>` element.

```js
// Setup the handler.
await page.addLocatorHandler(page.locator('body'), async () => {
  await page.evaluate(() => window.removeObstructionsForTestIfNeeded());
}, { noWaitAfter: true });

// Write the test as usual.
await page.goto('https://example.com');
await page.getByRole('button', { name: 'Start here' }).click();
```

Handler takes the original locator as an argument. You can also automatically remove the handler after a number of invocations by setting [`times`](/api/class-page#page-add-locator-handler-option-times):

```js
await page.addLocatorHandler(page.getByLabel('Close'), async locator => {
  await locator.click();
}, { times: 1 });
```

**Arguments**

- <a id="page-add-locator-handler-option-locator"></a>`locator` `Locator`

  Locator that triggers the handler.
- <a id="page-add-locator-handler-option-handler"></a>`handler` `function(Locator): Promise<any>`

  Function that should be run once [`locator`](/api/class-page#page-add-locator-handler-option-locator) appears. This function should get rid of the element that blocks actions like click.
- <a id="page-add-locator-handler-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-add-locator-handler-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)* <Badge type="info" text="Added in: v1.44" />

    By default, after calling the handler Playwright will wait until the overlay becomes hidden, and only then Playwright will continue with the action/assertion that triggered the handler. This option allows to opt-out of this behavior, so that overlay can stay visible after the handler has run.
  - <a id="page-add-locator-handler-option-times"></a>`times` `int` *(optional)* <Badge type="info" text="Added in: v1.44" />

    Specifies the maximum number of times this handler should be called. Unlimited by default.


### page.addScriptTag() {#page-add-script-tag}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Adds a `<script>` tag into the page with the desired url or content. Returns the added tag when the script's onload
fires or when the script content was injected into frame.

**Arguments**

- <a id="page-add-script-tag-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-add-script-tag-option-content"></a>`content` `string` *(optional)*

    Raw JavaScript content to be injected into frame.
  - <a id="page-add-script-tag-option-path"></a>`path` `path` *(optional)*

    Path to the JavaScript file to be injected into frame. If `path` is a relative path, then it is resolved relative to the
    current working directory.
  - <a id="page-add-script-tag-option-type"></a>`type` `string` *(optional)*

    Script type. Use 'module' in order to load a JavaScript ES6 module. See
    [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) for more details.
  - <a id="page-add-script-tag-option-url"></a>`url` `string` *(optional)*

    URL of a script to be added.

**Returns**

- `Promise<ElementHandle>`


### page.addStyleTag() {#page-add-style-tag}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Adds a `<link rel="stylesheet">` tag into the page with the desired url or a `<style type="text/css">` tag with the
content. Returns the added tag when the stylesheet's onload fires or when the CSS content was injected into frame.

**Arguments**

- <a id="page-add-style-tag-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-add-style-tag-option-content"></a>`content` `string` *(optional)*

    Raw CSS content to be injected into frame.
  - <a id="page-add-style-tag-option-path"></a>`path` `path` *(optional)*

    Path to the CSS file to be injected into frame. If `path` is a relative path, then it is resolved relative to the
    current working directory.
  - <a id="page-add-style-tag-option-url"></a>`url` `string` *(optional)*

    URL of the `<link>` tag.

**Returns**

- `Promise<ElementHandle>`


### page.ariaSnapshot() {#page-aria-snapshot}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

Captures the aria snapshot of the page. Read more about [aria snapshots](../aria-snapshots.md).

**Arguments**

- <a id="page-aria-snapshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-aria-snapshot-option-boxes"></a>`boxes` `boolean` *(optional)* <Badge type="info" text="Added in: v1.60" />

    When `true`, appends each element's bounding box as `[box=x,y,width,height]` to the snapshot. Coordinates are
    relative to the viewport, in CSS pixels, as returned by [`Element.getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
    Defaults to `false`.
  - <a id="page-aria-snapshot-option-depth"></a>`depth` `int` *(optional)*

    When specified, limits the depth of the snapshot.
  - <a id="page-aria-snapshot-option-mode"></a>`mode` `"ai" | "default"` *(optional)*

    When set to `"ai"`, returns a snapshot optimized for AI consumption: including element references like `[ref=e2]` and snapshots of `<iframe>`s. Defaults to `"default"`.
  - <a id="page-aria-snapshot-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-aria-snapshot-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<string>`


### page.ariaSnapshotJSON() {#page-aria-snapshot-json}

<Badge type="info" text="Added in: v1.63" /> <Badge type="tip" text="async" />

Captures the aria snapshot of the page as a free form JSON object.
Returns the same tree as [`page.ariaSnapshot()`](/api/class-page#page-aria-snapshot), serialized as a JSON value instead of YAML markup.
See [`locator.ariaSnapshotJSON()`](/api/class-locator#locator-aria-snapshot-json) for the details of the format.

**Arguments**

- <a id="page-aria-snapshot-json-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-aria-snapshot-json-option-boxes"></a>`boxes` `boolean` *(optional)*

    When `true`, includes each element's bounding box as a `box` property with `x`, `y`, `width` and `height`. Coordinates are
    relative to the viewport, in CSS pixels, as returned by [`Element.getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
    Defaults to `false`.
  - <a id="page-aria-snapshot-json-option-depth"></a>`depth` `int` *(optional)*

    When specified, limits the depth of the snapshot.
  - <a id="page-aria-snapshot-json-option-mode"></a>`mode` `"ai" | "default"` *(optional)*

    When set to `"ai"`, returns a snapshot optimized for AI consumption: including element references like `[ref=e2]` and snapshots of `<iframe>`s. Defaults to `"default"`.
  - <a id="page-aria-snapshot-json-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-aria-snapshot-json-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<Serializable>`


### page.bringToFront() {#page-bring-to-front}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Brings page to front (activates tab).


### page.cancelPickLocator() {#page-cancel-pick-locator}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

Cancels an ongoing [`page.pickLocator()`](/api/class-page#page-pick-locator) call by deactivating pick locator mode.
If no pick locator mode is active, this method is a no-op.


### page.check() {#page-check}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.check()`](/api/class-locator#locator-check) instead. Read more about [locators](../locators.md).
:::

This method checks an element matching [`selector`](/api/class-page#page-check-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/api/class-page#page-check-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Ensure that matched element is a checkbox or a radio input. If not, this method throws. If the element is already
   checked, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/api/class-page#page-check-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now checked. If not, this method throws.

When all steps combined have not finished during the specified [`timeout`](/api/class-page#page-check-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="page-check-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-check-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-check-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="page-check-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="page-check-option-position"></a>`position` `Object` *(optional)* <Badge type="info" text="Added in: v1.11" />

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float` <Badge type="info" text="Added in: v1.11" />
    - `y` `float` <Badge type="info" text="Added in: v1.11" />
  - <a id="page-check-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="page-check-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-check-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-check-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-check-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### page.clearConsoleMessages() {#page-clear-console-messages}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

Clears all stored console messages from this page. Subsequent calls to [`page.consoleMessages()`](/api/class-page#page-console-messages) will only return messages logged after the clear.


### page.clearPageErrors() {#page-clear-page-errors}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

Clears all stored page errors from this page. Subsequent calls to [`page.pageErrors()`](/api/class-page#page-page-errors) will only return errors thrown after the clear.


### page.click() {#page-click}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.click()`](/api/class-locator#locator-click) instead. Read more about [locators](../locators.md).
:::

This method clicks an element matching [`selector`](/api/class-page#page-click-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/api/class-page#page-click-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/api/class-page#page-click-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/api/class-page#page-mouse) to click in the center of the element, or the specified [`position`](/api/class-page#page-click-option-position).
1. Wait for initiated navigations to either succeed or fail, unless [`noWaitAfter`](/api/class-page#page-click-option-no-wait-after) option is set.

When all steps combined have not finished during the specified [`timeout`](/api/class-page#page-click-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="page-click-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-click-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-click-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="page-click-option-click-count"></a>`clickCount` `int` *(optional)*

    defaults to 1. See [UIEvent.detail].
  - <a id="page-click-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.
  - <a id="page-click-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="page-click-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="page-click-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can
    opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating
    to inaccessible pages. Defaults to `false`.
  - <a id="page-click-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="page-click-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="page-click-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-click-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-click-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-click-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### page.close() {#page-close}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

If [`runBeforeUnload`](/api/class-page#page-close-option-run-before-unload) is `false`, does not run any unload handlers and waits for the page to be closed. If
[`runBeforeUnload`](/api/class-page#page-close-option-run-before-unload) is `true` the method will run unload handlers, but will **not** wait for the page to close.

By default, `page.close()` **does not** run `beforeunload` handlers.

::: info
if [`runBeforeUnload`](/api/class-page#page-close-option-run-before-unload) is passed as true, a `beforeunload` dialog might be summoned and should be handled
manually via [`page.on('dialog')`](/api/class-page#page-event-dialog) event.
:::

**Arguments**

- <a id="page-close-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-close-option-reason"></a>`reason` `string` *(optional)* <Badge type="info" text="Added in: v1.40" />

    The reason to be reported to the operations interrupted by the page closure.
  - <a id="page-close-option-run-before-unload"></a>`runBeforeUnload` `boolean` *(optional)*

    Defaults to `false`. Whether to run the
    [before unload](https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload) page handlers.


### page.consoleMessages() {#page-console-messages}

<Badge type="info" text="Added in: v1.56" /> <Badge type="tip" text="async" />

Returns up to (currently) 200 last console messages from this page. See [`page.on('console')`](/api/class-page#page-event-console) for more details.

**Arguments**

- <a id="page-console-messages-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-console-messages-option-filter"></a>`filter` `"all" | "since-navigation"` *(optional)* <Badge type="info" text="Added in: v1.59" />

    Controls which messages are returned:

**Returns**

- `Promise<Array<ConsoleMessage>>`


### page.content() {#page-content}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Gets the full HTML contents of the page, including the doctype.

**Arguments**

- <a id="page-content-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-content-option-include-shadow"></a>`includeShadow` `boolean` *(optional)* <Badge type="info" text="Added in: v1.64" />

    When true, contents of open shadow roots are included as [declarative shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html),
    i.e. `<template shadowrootmode="open">` elements nested inside their host elements. Closed shadow roots are never included. Defaults to `false`.

**Returns**

- `Promise<string>`


### page.context() {#page-context}

<Badge type="info" text="Added in: v1.8" />

Get the browser context that the page belongs to.

**Returns**

- `BrowserContext`


### page.dblclick() {#page-dblclick}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.dblclick()`](/api/class-locator#locator-dblclick) instead. Read more about [locators](../locators.md).
:::

This method double clicks an element matching [`selector`](/api/class-page#page-dblclick-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/api/class-page#page-dblclick-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/api/class-page#page-dblclick-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/api/class-page#page-mouse) to double click in the center of the element, or the specified [`position`](/api/class-page#page-dblclick-option-position).

When all steps combined have not finished during the specified [`timeout`](/api/class-page#page-dblclick-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

::: info
`page.dblclick()` dispatches two `click` events and a single `dblclick` event.
:::

**Arguments**

- <a id="page-dblclick-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-dblclick-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-dblclick-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="page-dblclick-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.
  - <a id="page-dblclick-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="page-dblclick-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="page-dblclick-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="page-dblclick-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="page-dblclick-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="page-dblclick-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-dblclick-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-dblclick-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-dblclick-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### page.dispatchEvent() {#page-dispatch-event}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.dispatchEvent()`](/api/class-locator#locator-dispatch-event) instead. Read more about [locators](../locators.md).
:::

The snippet below dispatches the `click` event on the element. Regardless of the visibility state of the element, `click`
is dispatched. This is equivalent to calling
[element.click()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click).

**Usage**

```js
await page.dispatchEvent('button#submit', 'click');
```

Under the hood, it creates an instance of an event based on the given [`type`](/api/class-page#page-dispatch-event-option-type), initializes it with
[`eventInit`](/api/class-page#page-dispatch-event-option-event-init) properties and dispatches it on the element. Events are `composed`, `cancelable` and bubble by
default.

Since [`eventInit`](/api/class-page#page-dispatch-event-option-event-init) is event-specific, please refer to the events documentation for the lists of initial
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
await page.dispatchEvent('#source', 'dragstart', { dataTransfer });
```

**Arguments**

- <a id="page-dispatch-event-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-dispatch-event-option-type"></a>`type` `string`

  DOM event type: `"click"`, `"dragstart"`, etc.
- <a id="page-dispatch-event-option-event-init"></a>`eventInit` `EvaluationArgument` *(optional)*

  Optional event-specific initialization properties.
- <a id="page-dispatch-event-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-dispatch-event-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-dispatch-event-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-dispatch-event-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### page.dragAndDrop() {#page-drag-and-drop}

<Badge type="info" text="Added in: v1.13" /> <Badge type="tip" text="async" />

This method drags the source element to the target element.
It will first move to the source element, perform a `mousedown`,
then move to the target element and perform a `mouseup`.

**Usage**

```js
await page.dragAndDrop('#source', '#target');
// or specify exact positions relative to the top-left corners of the elements:
await page.dragAndDrop('#source', '#target', {
  sourcePosition: { x: 34, y: 7 },
  targetPosition: { x: 10, y: 20 },
});
```

**Arguments**

- <a id="page-drag-and-drop-option-source"></a>`source` `string`

  A selector to search for an element to drag. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-drag-and-drop-option-target"></a>`target` `string`

  A selector to search for an element to drop onto. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-drag-and-drop-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-drag-and-drop-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="page-drag-and-drop-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="page-drag-and-drop-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="page-drag-and-drop-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-drag-and-drop-option-source-position"></a>`sourcePosition` `Object` *(optional)* <Badge type="info" text="Added in: v1.14" />

    Clicks on the source element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.

    - `x` `float` <Badge type="info" text="Added in: v1.14" />
    - `y` `float` <Badge type="info" text="Added in: v1.14" />
  - <a id="page-drag-and-drop-option-steps"></a>`steps` `int` *(optional)* <Badge type="info" text="Added in: v1.57" />

    Defaults to 1. Sends `n` interpolated `mousemove` events to represent travel between the `mousedown` and `mouseup` of the drag. When set to 1, emits a single `mousemove` event at the destination location.
  - <a id="page-drag-and-drop-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-drag-and-drop-option-target-position"></a>`targetPosition` `Object` *(optional)* <Badge type="info" text="Added in: v1.14" />

    Drops on the target element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.

    - `x` `float` <Badge type="info" text="Added in: v1.14" />
    - `y` `float` <Badge type="info" text="Added in: v1.14" />
  - <a id="page-drag-and-drop-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-drag-and-drop-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### page.emulateMedia() {#page-emulate-media}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

This method changes the `CSS media type` through the `media` argument, and/or the `'prefers-colors-scheme'` media feature, using the `colorScheme` argument.

**Usage**

```js
await page.evaluate(() => matchMedia('screen').matches);
// → true
await page.evaluate(() => matchMedia('print').matches);
// → false

await page.emulateMedia({ media: 'print' });
await page.evaluate(() => matchMedia('screen').matches);
// → false
await page.evaluate(() => matchMedia('print').matches);
// → true

await page.emulateMedia({});
await page.evaluate(() => matchMedia('screen').matches);
// → true
await page.evaluate(() => matchMedia('print').matches);
// → false
```

```js
await page.emulateMedia({ colorScheme: 'dark' });
await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches);
// → true
await page.evaluate(() => matchMedia('(prefers-color-scheme: light)').matches);
// → false
```

**Arguments**

- <a id="page-emulate-media-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-emulate-media-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(optional)* <Badge type="info" text="Added in: v1.9" />

    Emulates [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media feature, supported values are `'light'` and `'dark'`. Passing
    `null` disables color scheme emulation. `'no-preference'` is deprecated.
  - <a id="page-emulate-media-option-contrast"></a>`contrast` `null | "no-preference" | "more"` *(optional)* <Badge type="info" text="Added in: v1.51" />

    Emulates `'prefers-contrast'` media feature, supported values are `'no-preference'`, `'more'`. Passing `null` disables contrast emulation.
  - <a id="page-emulate-media-option-forced-colors"></a>`forcedColors` `null | "active" | "none"` *(optional)* <Badge type="info" text="Added in: v1.15" />

    Emulates `'forced-colors'` media feature, supported values are `'active'` and `'none'`. Passing `null` disables forced colors emulation.
  - <a id="page-emulate-media-option-media"></a>`media` `null | "screen" | "print"` *(optional)* <Badge type="info" text="Added in: v1.9" />

    Changes the CSS media type of the page. The only allowed values are `'screen'`, `'print'` and `null`.
    Passing `null` disables CSS media emulation.
  - <a id="page-emulate-media-option-reduced-motion"></a>`reducedMotion` `null | "reduce" | "no-preference"` *(optional)* <Badge type="info" text="Added in: v1.12" />

    Emulates `'prefers-reduced-motion'` media feature, supported values are `'reduce'`, `'no-preference'`. Passing `null` disables reduced motion emulation.


### page.evaluate() {#page-evaluate}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the value of the [`pageFunction`](/api/class-page#page-evaluate-option-expression) invocation.

If the function passed to the [`page.evaluate()`](/api/class-page#page-evaluate) returns a [Promise], then [`page.evaluate()`](/api/class-page#page-evaluate) would wait
for the promise to resolve and return its value.

If the function passed to the [`page.evaluate()`](/api/class-page#page-evaluate) returns a non-[Serializable] value, then
[`page.evaluate()`](/api/class-page#page-evaluate) resolves to `undefined`. Playwright also supports transferring some
additional values that are not serializable by `JSON`: `-0`, `NaN`, `Infinity`, `-Infinity`.

**Usage**

Passing argument to [`pageFunction`](/api/class-page#page-evaluate-option-expression):

```js
const result = await page.evaluate(([x, y]) => {
  return Promise.resolve(x * y);
}, [7, 8]);
console.log(result); // prints "56"
```

A string can also be passed in instead of a function:

```js
console.log(await page.evaluate('1 + 2')); // prints "3"
const x = 10;
console.log(await page.evaluate(`1 + ${x}`)); // prints "11"
```

[ElementHandle](/api/class-elementhandle) instances can be passed as an argument to the [`page.evaluate()`](/api/class-page#page-evaluate):

```js
const bodyHandle = await page.evaluateHandle('document.body');
const html = await page.evaluate<string, HTMLElement>(([body, suffix]) =>
  body.innerHTML + suffix, [bodyHandle, 'hello']
);
await bodyHandle.dispose();
```

**Arguments**

- <a id="page-evaluate-option-expression"></a>`pageFunction` `function() | string`

  Function to be evaluated in the page context.
- <a id="page-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-page#page-evaluate-option-expression).
- <a id="page-evaluate-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-evaluate-option-expose-functions"></a>`exposeFunctions` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    When set to `true`, functions passed inside [`arg`](/api/class-page#page-evaluate-option-arg) are exposed in the page and can be called from the page function. Calling one returns a [Promise] of its result. Under the hood, each function is exposed via [`page.exposeFunction()`](/api/class-page#page-expose-function), so it is technically accessible from all frames of the page. Exposed functions are cleared upon the top-level navigation. Defaults to `false`, in which case functions are not serializable and passing one throws an error.

**Returns**

- `Promise<Serializable>`


### page.evaluateHandle() {#page-evaluate-handle}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the value of the [`pageFunction`](/api/class-page#page-evaluate-handle-option-expression) invocation as a [JSHandle](/api/class-jshandle).

The only difference between [`page.evaluate()`](/api/class-page#page-evaluate) and [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle) is that [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle) returns [JSHandle](/api/class-jshandle).

If the function passed to the [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle) returns a [Promise], then [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle) would wait for the
promise to resolve and return its value.

**Usage**

```js
// Handle for the window object.
const aWindowHandle = await page.evaluateHandle(() => Promise.resolve(window));
```

A string can also be passed in instead of a function:

```js
const aHandle = await page.evaluateHandle('document'); // Handle for the 'document'
```

[JSHandle](/api/class-jshandle) instances can be passed as an argument to the [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle):

```js
const aHandle = await page.evaluateHandle(() => document.body);
const resultHandle = await page.evaluateHandle(body => body.innerHTML, aHandle);
console.log(await resultHandle.jsonValue());
await resultHandle.dispose();
```

**Arguments**

- <a id="page-evaluate-handle-option-expression"></a>`pageFunction` `function() | string`

  Function to be evaluated in the page context.
- <a id="page-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-page#page-evaluate-handle-option-expression).
- <a id="page-evaluate-handle-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-evaluate-handle-option-expose-functions"></a>`exposeFunctions` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    When set to `true`, functions passed inside [`arg`](/api/class-page#page-evaluate-handle-option-arg) are exposed in the page and can be called from the page function. Calling one returns a [Promise] of its result. Under the hood, each function is exposed via [`page.exposeFunction()`](/api/class-page#page-expose-function), so it is technically accessible from all frames of the page. Exposed functions are cleared upon the top-level navigation. Defaults to `false`, in which case functions are not serializable and passing one throws an error.

**Returns**

- `Promise<JSHandle>`


### page.exposeBinding() {#page-expose-binding}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

The method adds a function called [`name`](/api/class-page#page-expose-binding-option-name) on the `window` object of every frame in this page. When called, the
function executes [`callback`](/api/class-page#page-expose-binding-option-callback) and returns a [Promise] which resolves to the return value of [`callback`](/api/class-page#page-expose-binding-option-callback).
If the [`callback`](/api/class-page#page-expose-binding-option-callback) returns a [Promise], it will be awaited.

The first argument of the [`callback`](/api/class-page#page-expose-binding-option-callback) function contains information about the caller: `{ browserContext:
BrowserContext, page: Page, frame: Frame }`.

See [`browserContext.exposeBinding()`](/api/class-browsercontext#browser-context-expose-binding) for the context-wide version.

::: info
Functions installed via [`page.exposeBinding()`](/api/class-page#page-expose-binding) survive navigations.
:::

**Usage**

An example of exposing page URL to all frames in a page:

```js
const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.

(async () => {
  const browser = await webkit.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.exposeBinding('pageURL', ({ page }) => page.url());
  await page.setContent(`
    <script>
      async function onClick() {
        document.querySelector('div').textContent = await window.pageURL();
      }
    </script>
    <button onclick="onClick()">Click me</button>
    <div></div>
  `);
  await page.click('button');
})();
```

**Arguments**

- <a id="page-expose-binding-option-name"></a>`name` `string`

  Name of the function on the window object.
- <a id="page-expose-binding-option-callback"></a>`callback` `function()`

  Callback function that will be called in the Playwright's context.

**Returns**

- `Promise<Disposable>`


### page.exposeFunction() {#page-expose-function}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

The method adds a function called [`name`](/api/class-page#page-expose-function-option-name) on the `window` object of every frame in the page. When called, the
function executes [`callback`](/api/class-page#page-expose-function-option-callback) and returns a [Promise] which resolves to the return value of [`callback`](/api/class-page#page-expose-function-option-callback).

If the [`callback`](/api/class-page#page-expose-function-option-callback) returns a [Promise], it will be awaited.

See [`browserContext.exposeFunction()`](/api/class-browsercontext#browser-context-expose-function) for context-wide exposed function.

::: info
Functions installed via [`page.exposeFunction()`](/api/class-page#page-expose-function) survive navigations.
:::

**Usage**

An example of adding a `sha256` function to the page:

```js
const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.
const crypto = require('crypto');

(async () => {
  const browser = await webkit.launch({ headless: false });
  const page = await browser.newPage();
  await page.exposeFunction('sha256', text =>
    crypto.createHash('sha256').update(text).digest('hex'),
  );
  await page.setContent(`
    <script>
      async function onClick() {
        document.querySelector('div').textContent = await window.sha256('PLAYWRIGHT');
      }
    </script>
    <button onclick="onClick()">Click me</button>
    <div></div>
  `);
  await page.click('button');
})();
```

**Arguments**

- <a id="page-expose-function-option-name"></a>`name` `string`

  Name of the function on the window object
- <a id="page-expose-function-option-callback"></a>`callback` `function()`

  Callback function which will be called in Playwright's context.

**Returns**

- `Promise<Disposable>`


### page.fill() {#page-fill}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.fill()`](/api/class-locator#locator-fill) instead. Read more about [locators](../locators.md).
:::

This method waits for an element matching [`selector`](/api/class-page#page-fill-option-selector), waits for [actionability](../actionability.md) checks, focuses the element, fills it and triggers an `input` event after filling. Note that you can pass an empty string to clear the input field.

If the target element is not an `<input>`, `<textarea>` or `[contenteditable]` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be filled instead.

To send fine-grained keyboard events, use [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially).

**Arguments**

- <a id="page-fill-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-fill-option-value"></a>`value` `string`

  Value to fill for the `<input>`, `<textarea>` or `[contenteditable]` element.
- <a id="page-fill-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-fill-option-force"></a>`force` `boolean` *(optional)* <Badge type="info" text="Added in: v1.13" />

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="page-fill-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="page-fill-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-fill-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-fill-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### page.focus() {#page-focus}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.focus()`](/api/class-locator#locator-focus) instead. Read more about [locators](../locators.md).
:::

This method fetches an element with [`selector`](/api/class-page#page-focus-option-selector) and focuses it. If there's no element matching
[`selector`](/api/class-page#page-focus-option-selector), the method waits until a matching element appears in the DOM.

**Arguments**

- <a id="page-focus-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-focus-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-focus-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-focus-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-focus-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### page.frame() {#page-frame}

<Badge type="info" text="Added in: v1.8" />

Returns frame matching the specified criteria. Either `name` or `url` must be specified.

**Usage**

```js
const frame = page.frame('frame-name');
```

```js
const frame = page.frame({ url: /.*domain.*/ });
```

**Arguments**

- <a id="page-frame-option-frame-selector"></a>`frameSelector` `string | Object`

  Frame name or other frame lookup options.

  - `name` `string` *(optional)*

    Frame name specified in the `iframe`'s `name` attribute. Optional.
  - `url` `string | RegExp | URLPattern | function(URL): boolean` *(optional)*

    A glob pattern, regex pattern, URL pattern, or predicate receiving
    frame's `url` as a [URL] object. Optional.

**Returns**

- `null | Frame`


### page.frameLocator() {#page-frame-locator}

<Badge type="info" text="Added in: v1.17" />

When working with iframes, you can create a frame locator that will enter the iframe and allow selecting elements
in that iframe.

When called without [`selector`](/api/class-page#page-frame-locator-option-selector), the search starts in any frame on the page - the main frame or any of
the iframes - so that you don't need to locate each iframe first. Note that the rest of the locator is resolved
inside a single frame, just like any other locator. If it matches elements inside multiple frames, an error is thrown.

**Usage**

Following snippet locates element with text "Submit" in the iframe with id `my-frame`,
like `<iframe id="my-frame">`:

```js
const locator = page.frameLocator('#my-iframe').getByText('Submit');
await locator.click();
```

Following snippet locates a button, either in the main frame or in one of the iframes:

```js
const locator = page.frameLocator().getByRole('button');
await locator.click();
```

**Arguments**

- <a id="page-frame-locator-option-selector"></a>`selector` `string` *(optional)*

  A selector that matches the frame element. When not specified, locator is matched in any frame on the page.

**Returns**

- `FrameLocator`


### page.frames() {#page-frames}

<Badge type="info" text="Added in: v1.8" />

An array of all frames attached to the page.

**Returns**

- `Array<Frame>`


### page.getAttribute() {#page-get-attribute}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.getAttribute()`](/api/class-locator#locator-get-attribute) instead. Read more about [locators](../locators.md).
:::

Returns element attribute value.

**Arguments**

- <a id="page-get-attribute-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-get-attribute-option-name"></a>`name` `string`

  Attribute name to get the value for.
- <a id="page-get-attribute-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-get-attribute-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-get-attribute-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-get-attribute-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<null | string>`


### page.getByAltText() {#page-get-by-alt-text}

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

- <a id="page-get-by-alt-text-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="page-get-by-alt-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-get-by-alt-text-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### page.getByLabel() {#page-get-by-label}

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

- <a id="page-get-by-label-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="page-get-by-label-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-get-by-label-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### page.getByPlaceholder() {#page-get-by-placeholder}

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

- <a id="page-get-by-placeholder-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="page-get-by-placeholder-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-get-by-placeholder-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### page.getByRef() {#page-get-by-ref}

<Badge type="info" text="Added in: v1.64" />

Locate element by its aria ref. Refs like `[ref=e2]` are reported by [`page.ariaSnapshot()`](/api/class-page#page-aria-snapshot) when called with
the `"ai"` mode, and resolve against the latest snapshot taken in the element's frame.

**Usage**

Consider the following aria snapshot.

```yaml
- button "Submit" [ref=e2]
```

You can locate the button by its ref:

```js
await page.getByRef('e2').click();
```

**Arguments**

- <a id="page-get-by-ref-option-ref"></a>`ref` `string`

  Aria ref of the element, for example `e2` or `f1e3`.

**Returns**

- `Locator`


### page.getByRole() {#page-get-by-role}

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

- <a id="page-get-by-role-option-role"></a>`role` `"alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"`

  Required aria role.
- <a id="page-get-by-role-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-get-by-role-option-checked"></a>`checked` `boolean` *(optional)*

    An attribute that is usually set by `aria-checked` or native `<input type=checkbox>` controls.

    Learn more about [`aria-checked`](https://www.w3.org/TR/wai-aria-1.2/#aria-checked).
  - <a id="page-get-by-role-option-description"></a>`description` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.60" />

    Option to match the [accessible description](https://w3c.github.io/accname/#dfn-accessible-description). By default, matching is case-insensitive and searches for a substring, use [`exact`](/api/class-page#page-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible description](https://w3c.github.io/accname/#dfn-accessible-description).
  - <a id="page-get-by-role-option-disabled"></a>`disabled` `boolean` *(optional)*

    An attribute that is usually set by `aria-disabled` or `disabled`.

    ::: info
    Unlike most other attributes, `disabled` is inherited through the DOM hierarchy.
    Learn more about [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled).
    :::
  - <a id="page-get-by-role-option-exact"></a>`exact` `boolean` *(optional)* <Badge type="info" text="Added in: v1.28" />

    Whether [`name`](/api/class-page#page-get-by-role-option-name) and [`description`](/api/class-page#page-get-by-role-option-description) are matched exactly: case-sensitive and whole-string. Defaults to false. Ignored when the value is a regular expression. Note that exact match still trims whitespace.
  - <a id="page-get-by-role-option-expanded"></a>`expanded` `boolean` *(optional)*

    An attribute that is usually set by `aria-expanded`.

    Learn more about [`aria-expanded`](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded).
  - <a id="page-get-by-role-option-include-hidden"></a>`includeHidden` `boolean` *(optional)*

    Option that controls whether hidden elements are matched. By default, only non-hidden elements, as [defined by ARIA](https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion), are matched by role selector.

    Learn more about [`aria-hidden`](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden).
  - <a id="page-get-by-role-option-level"></a>`level` `int` *(optional)*

    A number attribute that is usually present for roles `heading`, `listitem`, `row`, `treeitem`, with default values for `<h1>-<h6>` elements.

    Learn more about [`aria-level`](https://www.w3.org/TR/wai-aria-1.2/#aria-level).
  - <a id="page-get-by-role-option-name"></a>`name` `string | RegExp` *(optional)*

    Option to match the [accessible name](https://w3c.github.io/accname/#dfn-accessible-name). By default, matching is case-insensitive and searches for a substring, use [`exact`](/api/class-page#page-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
  - <a id="page-get-by-role-option-pressed"></a>`pressed` `boolean` *(optional)*

    An attribute that is usually set by `aria-pressed`.

    Learn more about [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.2/#aria-pressed).
  - <a id="page-get-by-role-option-selected"></a>`selected` `boolean` *(optional)*

    An attribute that is usually set by `aria-selected`.

    Learn more about [`aria-selected`](https://www.w3.org/TR/wai-aria-1.2/#aria-selected).

**Returns**

- `Locator`


### page.getByTestId() {#page-get-by-test-id}

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

- <a id="page-get-by-test-id-option-test-id"></a>`testId` `string | RegExp`

  Id to locate the element by.

**Returns**

- `Locator`


### page.getByText() {#page-get-by-text}

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

- <a id="page-get-by-text-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="page-get-by-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-get-by-text-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### page.getByTitle() {#page-get-by-title}

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

- <a id="page-get-by-title-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="page-get-by-title-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-get-by-title-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### page.goBack() {#page-go-back}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the
last redirect. If cannot go back, returns `null`.

Navigate to the previous page in history.

::: warning
**Testing Back/Forward Cache (BFCache) is not supported.**
By default, Playwright disables the Back/Forward Cache across all browsers. Even if explicitly enabled, Playwright's internal state relies on network-level navigation events. Because BFCache restores unfreeze the DOM without firing these events, using `page.goBack()` or `page.goForward()` to trigger a BFCache restore will result in timeouts and a desynchronized `Page` state.
:::

**Arguments**

- <a id="page-go-back-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-go-back-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-go-back-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `navigationTimeout` option in the config, or by using the [`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-go-back-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.

**Returns**

- `Promise<null | Response>`


### page.goForward() {#page-go-forward}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the
last redirect. If cannot go forward, returns `null`.

Navigate to the next page in history.

::: warning
**Testing Back/Forward Cache (BFCache) is not supported.**
By default, Playwright disables the Back/Forward Cache across all browsers. Even if explicitly enabled, Playwright's internal state relies on network-level navigation events. Because BFCache restores unfreeze the DOM without firing these events, using `page.goBack()` or `page.goForward()` to trigger a BFCache restore will result in timeouts and a desynchronized `Page` state.
:::

**Arguments**

- <a id="page-go-forward-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-go-forward-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-go-forward-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `navigationTimeout` option in the config, or by using the [`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-go-forward-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.

**Returns**

- `Promise<null | Response>`


### page.goto() {#page-goto}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the main resource response. In case of multiple redirects, the navigation will resolve with the first
non-redirect response.

The method will throw an error if:
* there's an SSL error (e.g. in case of self-signed certificates).
* target URL is invalid.
* the [`timeout`](/api/class-page#page-goto-option-timeout) is exceeded during navigation.
* the remote server does not respond or is unreachable.
* the main resource failed to load.

The method will not throw an error when any valid HTTP status code is returned by the remote server, including 404 "Not
Found" and 500 "Internal Server Error".  The status code for such responses can be retrieved by calling
[`response.status()`](/api/class-response#response-status).

::: info
The method either throws an error or returns a main resource response. The only exceptions are navigation to
`about:blank` or navigation to the same URL with a different hash, which would succeed and return `null`.
:::

::: info
Headless mode doesn't support navigation to a PDF document. See the
[upstream issue](https://bugs.chromium.org/p/chromium/issues/detail?id=761295).
:::

**Arguments**

- <a id="page-goto-option-url"></a>`url` `string`

  URL to navigate page to. The url should include scheme, e.g. `https://`.
  When a [`baseURL`](/api/class-browser#browser-new-context-option-base-url) via the context options was provided and the passed URL is a path,
  it gets merged via the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
- <a id="page-goto-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-goto-option-referer"></a>`referer` `string` *(optional)*

    Referer header value. If provided it will take preference over the referer header value set by
    [`page.setExtraHTTPHeaders()`](/api/class-page#page-set-extra-http-headers).
  - <a id="page-goto-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-goto-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `navigationTimeout` option in the config, or by using the [`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-goto-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.

**Returns**

- `Promise<null | Response>`


### page.hideHighlight() {#page-hide-highlight}

<Badge type="info" text="Added in: v1.60" /> <Badge type="tip" text="async" />

Hide all locator highlight overlays previously added by [`locator.highlight()`](/api/class-locator#locator-highlight) on this page.


### page.hover() {#page-hover}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.hover()`](/api/class-locator#locator-hover) instead. Read more about [locators](../locators.md).
:::

This method hovers over an element matching [`selector`](/api/class-page#page-hover-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/api/class-page#page-hover-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/api/class-page#page-hover-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/api/class-page#page-mouse) to hover over the center of the element, or the specified [`position`](/api/class-page#page-hover-option-position).

When all steps combined have not finished during the specified [`timeout`](/api/class-page#page-hover-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="page-hover-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-hover-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-hover-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="page-hover-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="page-hover-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)* <Badge type="info" text="Added in: v1.28" />

    This option has no effect.
  - <a id="page-hover-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="page-hover-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="page-hover-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-hover-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-hover-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-hover-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### page.innerHTML() {#page-inner-html}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.innerHTML()`](/api/class-locator#locator-inner-html) instead. Read more about [locators](../locators.md).
:::

Returns `element.innerHTML`.

**Arguments**

- <a id="page-inner-html-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-inner-html-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-inner-html-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-inner-html-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-inner-html-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<string>`


### page.innerText() {#page-inner-text}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.innerText()`](/api/class-locator#locator-inner-text) instead. Read more about [locators](../locators.md).
:::

Returns `element.innerText`.

**Arguments**

- <a id="page-inner-text-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-inner-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-inner-text-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-inner-text-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-inner-text-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<string>`


### page.inputValue() {#page-input-value}

<Badge type="info" text="Added in: v1.13" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.inputValue()`](/api/class-locator#locator-input-value) instead. Read more about [locators](../locators.md).
:::

Returns `input.value` for the selected `<input>` or `<textarea>` or `<select>` element.

Throws for non-input elements. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), returns the value of the control.

**Arguments**

- <a id="page-input-value-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-input-value-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-input-value-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-input-value-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-input-value-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<string>`


### page.isChecked() {#page-is-checked}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.isChecked()`](/api/class-locator#locator-is-checked) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is checked. Throws if the element is not a checkbox or radio input.

**Arguments**

- <a id="page-is-checked-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-is-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-is-checked-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-is-checked-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-is-checked-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<boolean>`


### page.isClosed() {#page-is-closed}

<Badge type="info" text="Added in: v1.8" />

Indicates that the page has been closed.

**Returns**

- `boolean`


### page.isDisabled() {#page-is-disabled}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.isDisabled()`](/api/class-locator#locator-is-disabled) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is disabled, the opposite of [enabled](../actionability.md#enabled).

**Arguments**

- <a id="page-is-disabled-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-is-disabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-is-disabled-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-is-disabled-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-is-disabled-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<boolean>`


### page.isEditable() {#page-is-editable}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.isEditable()`](/api/class-locator#locator-is-editable) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [editable](../actionability.md#editable).

**Arguments**

- <a id="page-is-editable-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-is-editable-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-is-editable-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-is-editable-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-is-editable-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<boolean>`


### page.isEnabled() {#page-is-enabled}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.isEnabled()`](/api/class-locator#locator-is-enabled) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [enabled](../actionability.md#enabled).

**Arguments**

- <a id="page-is-enabled-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-is-enabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-is-enabled-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-is-enabled-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-is-enabled-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<boolean>`


### page.isHidden() {#page-is-hidden}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.isHidden()`](/api/class-locator#locator-is-hidden) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is hidden, the opposite of [visible](../actionability.md#visible).  [`selector`](/api/class-page#page-is-hidden-option-selector) that does not match any elements is considered hidden.

**Arguments**

- <a id="page-is-hidden-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-is-hidden-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-is-hidden-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-is-hidden-option-timeout"></a>`timeout` `float` *(optional)*

**Returns**

- `Promise<boolean>`


### page.isVisible() {#page-is-visible}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.isVisible()`](/api/class-locator#locator-is-visible) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [visible](../actionability.md#visible). [`selector`](/api/class-page#page-is-visible-option-selector) that does not match any elements is considered not visible.

**Arguments**

- <a id="page-is-visible-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-is-visible-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-is-visible-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-is-visible-option-timeout"></a>`timeout` `float` *(optional)*

**Returns**

- `Promise<boolean>`


### page.locator() {#page-locator}

<Badge type="info" text="Added in: v1.14" />

The method returns an element locator that can be used to perform actions on this page / frame.
Locator is resolved to the element immediately before performing an action, so a series of actions on the same locator can in fact be performed on different DOM elements. That would happen if the DOM structure between those actions has changed.

[Learn more about locators](../locators.md).

**Arguments**

- <a id="page-locator-option-selector"></a>`selector` `string`

  A selector to use when resolving DOM element.
- <a id="page-locator-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-locator-option-has"></a>`has` `Locator` *(optional)*

    Narrows down the results of the method to those which contain elements matching this relative locator.
    For example, `article` that has `text=Playwright` matches `<article><div>Playwright</div></article>`.

    Inner locator **must be relative** to the outer locator and is queried starting with the outer locator match, not the document root. For example, you can find `content` that has `div` in `<article><content><div>Playwright</div></content></article>`. However, looking for `content` that has `article div` will fail, because the inner locator must be relative and should not use any elements outside the `content`.

    Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator](/api/class-framelocator)s.
  - <a id="page-locator-option-has-not"></a>`hasNot` `Locator` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the outer one.
    For example, `article` that does not have `div` matches `<article><span>Playwright</span></article>`.

    Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator](/api/class-framelocator)s.
  - <a id="page-locator-option-has-not-text"></a>`hasNotText` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
  - <a id="page-locator-option-has-text"></a>`hasText` `string | RegExp` *(optional)*

    Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
    For example, `"Playwright"` matches `<article><div>Playwright</div></article>`.

**Returns**

- `Locator`


### page.mainFrame() {#page-main-frame}

<Badge type="info" text="Added in: v1.8" />

The page's main frame. Page is guaranteed to have a main frame which persists during navigations.

**Returns**

- `Frame`


### page.opener() {#page-opener}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the opener for popup pages and `null` for others. If the opener has been closed already the returns `null`.

**Returns**

- `Promise<null | Page>`


### page.pageErrors() {#page-page-errors}

<Badge type="info" text="Added in: v1.56" /> <Badge type="tip" text="async" />

Returns up to (currently) 200 last page errors from this page. See [`page.on('pageError')`](/api/class-page#page-event-page-error) for more details.

**Arguments**

- <a id="page-page-errors-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-page-errors-option-filter"></a>`filter` `"all" | "since-navigation"` *(optional)* <Badge type="info" text="Added in: v1.59" />

    Controls which errors are returned:

**Returns**

- `Promise<Array<Error>>`


### page.pause() {#page-pause}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Pauses script execution. Playwright will stop executing the script and wait for the user to either press the 'Resume'
button in the page overlay or to call `playwright.resume()` in the DevTools console.

User can inspect selectors or perform manual steps while paused. Resume will continue running the original script from
the place it was paused.

::: info
This method requires Playwright to be started in a headed mode, with a falsy [`headless`](/api/class-browsertype#browser-type-launch-option-headless) option.
:::


### page.pdf() {#page-pdf}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the PDF buffer.

`page.pdf()` generates a pdf of the page with `print` css media. To generate a pdf with `screen` media, call
[`page.emulateMedia()`](/api/class-page#page-emulate-media) before calling `page.pdf()`:

::: info
By default, `page.pdf()` generates a pdf with modified colors for printing. Use the
[`-webkit-print-color-adjust`](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-print-color-adjust) property to
force rendering of exact colors.
:::

**Usage**

```js
// Generates a PDF with 'screen' media type.
await page.emulateMedia({ media: 'screen' });
await page.pdf({ path: 'page.pdf' });
```

The [`width`](/api/class-page#page-pdf-option-width), [`height`](/api/class-page#page-pdf-option-height), and [`margin`](/api/class-page#page-pdf-option-margin) options accept values labeled with units. Unlabeled
values are treated as pixels.

A few examples:
* `page.pdf({width: 100})` - prints with width set to 100 pixels
* `page.pdf({width: '100px'})` - prints with width set to 100 pixels
* `page.pdf({width: '10cm'})` - prints with width set to 10 centimeters.

All possible units are:
* `px` - pixel
* `in` - inch
* `cm` - centimeter
* `mm` - millimeter

The [`format`](/api/class-page#page-pdf-option-format) options are:
* `Letter`: 8.5in x 11in
* `Legal`: 8.5in x 14in
* `Tabloid`: 11in x 17in
* `Ledger`: 17in x 11in
* `A0`: 33.1in x 46.8in
* `A1`: 23.4in x 33.1in
* `A2`: 16.54in x 23.4in
* `A3`: 11.7in x 16.54in
* `A4`: 8.27in x 11.7in
* `A5`: 5.83in x 8.27in
* `A6`: 4.13in x 5.83in

::: info
[`headerTemplate`](/api/class-page#page-pdf-option-header-template) and [`footerTemplate`](/api/class-page#page-pdf-option-footer-template) markup have the following limitations: > 1. Script tags inside
templates are not evaluated. > 2. Page styles are not visible inside templates.
:::

**Arguments**

- <a id="page-pdf-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-pdf-option-display-header-footer"></a>`displayHeaderFooter` `boolean` *(optional)*

    Display header and footer. Defaults to `false`.
  - <a id="page-pdf-option-footer-template"></a>`footerTemplate` `string` *(optional)*

    HTML template for the print footer. Should use the same format as the [`headerTemplate`](/api/class-page#page-pdf-option-header-template).
  - <a id="page-pdf-option-format"></a>`format` `string` *(optional)*

    Paper format. If set, takes priority over [`width`](/api/class-page#page-pdf-option-width) or [`height`](/api/class-page#page-pdf-option-height) options. Defaults to 'Letter'.
  - <a id="page-pdf-option-header-template"></a>`headerTemplate` `string` *(optional)*

    HTML template for the print header. Should be valid HTML markup with following classes used to inject printing values
    into them:
    * `'date'` formatted print date
    * `'title'` document title
    * `'url'` document location
    * `'pageNumber'` current page number
    * `'totalPages'` total pages in the document
  - <a id="page-pdf-option-height"></a>`height` `string | float` *(optional)*

    Paper height, accepts values labeled with units.
  - <a id="page-pdf-option-landscape"></a>`landscape` `boolean` *(optional)*

    Paper orientation. Defaults to `false`.
  - <a id="page-pdf-option-margin"></a>`margin` `Object` *(optional)*

    Paper margins, defaults to none.

    - `top` `string | float` *(optional)*

      Top margin, accepts values labeled with units. Defaults to `0`.
    - `right` `string | float` *(optional)*

      Right margin, accepts values labeled with units. Defaults to `0`.
    - `bottom` `string | float` *(optional)*

      Bottom margin, accepts values labeled with units. Defaults to `0`.
    - `left` `string | float` *(optional)*

      Left margin, accepts values labeled with units. Defaults to `0`.
  - <a id="page-pdf-option-outline"></a>`outline` `boolean` *(optional)* <Badge type="info" text="Added in: v1.42" />

    Whether or not to embed the document outline into the PDF. Defaults to `false`.
  - <a id="page-pdf-option-page-ranges"></a>`pageRanges` `string` *(optional)*

    Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means print all pages.
  - <a id="page-pdf-option-path"></a>`path` `path` *(optional)*

    The file path to save the PDF to. If [`path`](/api/class-page#page-pdf-option-path) is a relative path, then it is resolved relative to the current
    working directory. If no path is provided, the PDF won't be saved to the disk.
  - <a id="page-pdf-option-prefer-css-page-size"></a>`preferCSSPageSize` `boolean` *(optional)*

    Give any CSS `@page` size declared in the page priority over what is declared in [`width`](/api/class-page#page-pdf-option-width) and
    [`height`](/api/class-page#page-pdf-option-height) or [`format`](/api/class-page#page-pdf-option-format) options. Defaults to `false`, which will scale the content to fit the paper
    size.
  - <a id="page-pdf-option-print-background"></a>`printBackground` `boolean` *(optional)*

    Print background graphics. Defaults to `false`.
  - <a id="page-pdf-option-scale"></a>`scale` `float` *(optional)*

    Scale of the webpage rendering. Defaults to `1`. Scale amount must be between 0.1 and 2.
  - <a id="page-pdf-option-tagged"></a>`tagged` `boolean` *(optional)* <Badge type="info" text="Added in: v1.42" />

    Whether or not to generate tagged (accessible) PDF. Defaults to `false`.
  - <a id="page-pdf-option-width"></a>`width` `string | float` *(optional)*

    Paper width, accepts values labeled with units.

**Returns**

- `Promise<Buffer>`


### page.pickLocator() {#page-pick-locator}

<Badge type="info" text="Added in: v1.59" /> <Badge type="tip" text="async" />

Enters pick locator mode where hovering over page elements highlights them and shows the corresponding locator.
Once the user clicks an element, the mode is deactivated and the [Locator](/api/class-locator) for the picked element is returned.

**Usage**

```js
const locator = await page.pickLocator();
console.log(locator);
```

**Returns**

- `Promise<Locator>`


### page.press() {#page-press}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.press()`](/api/class-locator#locator-press) instead. Read more about [locators](../locators.md).
:::

Focuses the element, and then uses [`keyboard.down()`](/api/class-keyboard#keyboard-down) and [`keyboard.up()`](/api/class-keyboard#keyboard-up).

[`key`](/api/class-page#page-press-option-key) can specify the intended
[keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value or a single character to
generate the text for. A superset of the [`key`](/api/class-page#page-press-option-key) values can be found
[here](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:

`F1` - `F12`, `Digit0`- `Digit9`, `KeyA`- `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
`Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.

Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`, `ShiftLeft`, `ControlOrMeta`.
`ControlOrMeta` resolves to `Control` on Windows and Linux and to `Meta` on macOS.

Holding down `Shift` will type the text that corresponds to the [`key`](/api/class-page#page-press-option-key) in the upper case.

If [`key`](/api/class-page#page-press-option-key) is a single character, it is case-sensitive, so the values `a` and `A` will generate different
respective texts.

Shortcuts such as `key: "Control+o"`, `key: "Control++` or `key: "Control+Shift+T"` are supported as well. When specified with the
modifier, modifier is pressed and being held while the subsequent key is being pressed.

**Usage**

```js
const page = await browser.newPage();
await page.goto('https://keycode.info');
await page.press('body', 'A');
await page.screenshot({ path: 'A.png' });
await page.press('body', 'ArrowLeft');
await page.screenshot({ path: 'ArrowLeft.png' });
await page.press('body', 'Shift+O');
await page.screenshot({ path: 'O.png' });
await browser.close();
```

**Arguments**

- <a id="page-press-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-press-option-key"></a>`key` `string`

  Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
- <a id="page-press-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-press-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `keydown` and `keyup` in milliseconds. Defaults to 0.
  - <a id="page-press-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can
    opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating
    to inaccessible pages. Defaults to `false`.
  - <a id="page-press-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-press-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-press-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### page.reload() {#page-reload}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

This method reloads the current page, in the same way as if the user had triggered a browser refresh.
Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the
last redirect.

**Arguments**

- <a id="page-reload-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-reload-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-reload-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `navigationTimeout` option in the config, or by using the [`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-reload-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.

**Returns**

- `Promise<null | Response>`


### page.removeAllListeners() {#page-remove-all-listeners}

<Badge type="info" text="Added in: v1.47" /> <Badge type="tip" text="async" />

Removes all the listeners of the given type (or all registered listeners if no type given).
Allows to wait for async listeners to complete or to ignore subsequent errors from these listeners.

**Usage**

```js
page.on('request', async request => {
  const response = await request.response();
  const body = await response.body();
  console.log(body.byteLength);
});
await page.goto('https://playwright.dev', { waitUntil: 'domcontentloaded' });
// Waits for all the reported 'request' events to resolve.
await page.removeAllListeners('request', { behavior: 'wait' });
```

**Arguments**

- <a id="page-remove-all-listeners-option-type"></a>`type` `string` *(optional)*
- <a id="page-remove-all-listeners-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-remove-all-listeners-option-behavior"></a>`behavior` `"wait" | "ignoreErrors" | "default"` *(optional)*

    Specifies whether to wait for already running listeners and what to do if they throw errors:
    * `'default'` - do not wait for current listener calls (if any) to finish, if the listener throws, it may result in unhandled error
    * `'wait'` - wait for current listener calls (if any) to finish
    * `'ignoreErrors'` - do not wait for current listener calls (if any) to finish, all errors thrown by the listeners after removal are silently caught


### page.removeLocatorHandler() {#page-remove-locator-handler}

<Badge type="info" text="Added in: v1.44" /> <Badge type="tip" text="async" />

Removes all locator handlers added by [`page.addLocatorHandler()`](/api/class-page#page-add-locator-handler) for a specific locator.

**Arguments**

- <a id="page-remove-locator-handler-option-locator"></a>`locator` `Locator`

  Locator passed to [`page.addLocatorHandler()`](/api/class-page#page-add-locator-handler).


### page.requestGC() {#page-request-gc}

<Badge type="info" text="Added in: v1.48" /> <Badge type="tip" text="async" />

Request the page to perform garbage collection. Note that there is no guarantee that all unreachable objects will be collected.

This is useful to help detect memory leaks. For example, if your page has a large object `'suspect'` that might be leaked, you can check that it does not leak by using a [`WeakRef`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef).

```js
// 1. In your page, save a WeakRef for the "suspect".
await page.evaluate(() => globalThis.suspectWeakRef = new WeakRef(suspect));
// 2. Request garbage collection.
await page.requestGC();
// 3. Check that weak ref does not deref to the original object.
expect(await page.evaluate(() => !globalThis.suspectWeakRef.deref())).toBe(true);
```


### page.requests() {#page-requests}

<Badge type="info" text="Added in: v1.56" /> <Badge type="tip" text="async" />

Returns up to (currently) 100 last network request from this page. See [`page.on('request')`](/api/class-page#page-event-request) for more details.

Returned requests should be accessed immediately, otherwise they might be collected to prevent unbounded memory growth as new requests come in. Once collected, retrieving most information about the request is impossible.

Note that requests reported through the [`page.on('request')`](/api/class-page#page-event-request) request are not collected, so there is a trade off between efficient memory usage with [`page.requests()`](/api/class-page#page-requests) and the amount of available information reported through [`page.on('request')`](/api/class-page#page-event-request).

**Returns**

- `Promise<Array<Request>>`


### page.route() {#page-route}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Routing provides the capability to modify network requests that are made by a page.

Once routing is enabled, every request matching the url pattern will stall unless it's continued, fulfilled or aborted.

::: info
The handler will only be called for the first url if the response is a redirect.
:::

::: info
[`page.route()`](/api/class-page#page-route) will not intercept requests intercepted by Service Worker. See [this](https://github.com/microsoft/playwright/issues/1090) issue. We recommend disabling Service Workers when using request interception by setting [`serviceWorkers`](/api/class-browser#browser-new-context-option-service-workers) to `'block'`.
:::

::: info
[`page.route()`](/api/class-page#page-route) will not intercept the first request of a popup page. Use [`browserContext.route()`](/api/class-browsercontext#browser-context-route) instead.
:::

**Usage**

An example of a naive handler that aborts all image requests:

```js
const page = await browser.newPage();
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());
await page.goto('https://example.com');
await browser.close();
```

or the same snippet using a regex pattern instead:

```js
const page = await browser.newPage();
await page.route(/(\.png$)|(\.jpg$)/, route => route.abort());
await page.goto('https://example.com');
await browser.close();
```

It is possible to examine the request to decide the route action. For example, mocking all requests that contain some post data, and leaving all other requests as is:

```js
await page.route('/api/**', async route => {
  if (route.request().postData().includes('my-string'))
    await route.fulfill({ body: 'mocked-data' });
  else
    await route.continue();
});
```

If a request matches multiple registered routes, the most recently registered route takes precedence.

Page routes take precedence over browser context routes (set up with [`browserContext.route()`](/api/class-browsercontext#browser-context-route)) when request
matches both handlers.

To remove a route with its handler you can use [`page.unroute()`](/api/class-page#page-unroute).

::: info
Enabling routing disables http cache.
:::

**Arguments**

- <a id="page-route-option-url"></a>`url` `string | RegExp | URLPattern | function(URL): boolean`

  A glob pattern, regex pattern, URL pattern, or predicate that receives a [URL] to match during routing. If [`baseURL`](/api/class-browser#browser-new-context-option-base-url) is set in the context options and the provided URL is a string that does not start with `*`, it is resolved using the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
- <a id="page-route-option-handler"></a>`handler` `function(Route, Request): Promise<any> | any`

  handler function to route the request.
- <a id="page-route-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-route-option-times"></a>`times` `int` *(optional)* <Badge type="info" text="Added in: v1.15" />

    How often a route should be used. By default it will be used every time.

**Returns**

- `Promise<Disposable>`


### page.routeFromHAR() {#page-route-from-har}

<Badge type="info" text="Added in: v1.23" /> <Badge type="tip" text="async" />

If specified the network requests that are made in the page will be served from the HAR file. Read more about [Replaying from HAR](../mock.md#replaying-from-har).

Playwright will not serve requests intercepted by Service Worker from the HAR file. See [this](https://github.com/microsoft/playwright/issues/1090) issue. We recommend disabling Service Workers when using request interception by setting [`serviceWorkers`](/api/class-browser#browser-new-context-option-service-workers) to `'block'`.

**Arguments**

- <a id="page-route-from-har-option-har"></a>`har` `path`

  Path to a [HAR](http://www.softwareishard.com/blog/har-12-spec) file with prerecorded network data. If `path` is a relative path, then it is resolved relative to the current working directory.
- <a id="page-route-from-har-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-route-from-har-option-not-found"></a>`notFound` `"abort" | "fallback"` *(optional)*

    * If set to 'abort' any request not found in the HAR file will be aborted.
    * If set to 'fallback' missing requests will be sent to the network.

    Defaults to abort.
  - <a id="page-route-from-har-option-update"></a>`update` `boolean` *(optional)*

    If specified, updates the given HAR with the actual network information instead of serving from file. The file is written to disk when [`browserContext.close()`](/api/class-browsercontext#browser-context-close) is called.
  - <a id="page-route-from-har-option-update-content"></a>`updateContent` `"embed" | "attach"` *(optional)* <Badge type="info" text="Added in: v1.32" />

    Optional setting to control resource content management. If `attach` is specified, resources are persisted as separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file.
  - <a id="page-route-from-har-option-update-mode"></a>`updateMode` `"full" | "minimal"` *(optional)* <Badge type="info" text="Added in: v1.32" />

    When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `minimal`.
  - <a id="page-route-from-har-option-url"></a>`url` `string | RegExp` *(optional)*

    A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.


### page.routeWebSocket() {#page-route-web-socket}

<Badge type="info" text="Added in: v1.48" /> <Badge type="tip" text="async" />

This method allows to modify websocket connections that are made by the page.

Note that only `WebSocket`s created after this method was called will be routed. It is recommended to call this method before navigating the page.

**Usage**

Below is an example of a simple mock that responds to a single message. See [WebSocketRoute](/api/class-websocketroute) for more details and examples.

```js
await page.routeWebSocket('/ws', ws => {
  ws.onMessage(message => {
    if (message === 'request')
      ws.send('response');
  });
});
```

**Arguments**

- <a id="page-route-web-socket-option-url"></a>`url` `string | RegExp | URLPattern | function(URL): boolean`

  Only WebSockets with the url matching this pattern will be routed. A string pattern can be relative to the [`baseURL`](/api/class-browser#browser-new-context-option-base-url) context option.
- <a id="page-route-web-socket-option-handler"></a>`handler` `function(WebSocketRoute): Promise<any> | any`

  Handler function to route the WebSocket.


### page.screenshot() {#page-screenshot}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the buffer with the captured screenshot.

**Arguments**

- <a id="page-screenshot-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-screenshot-option-animations"></a>`animations` `"disabled" | "allow"` *(optional)*

    When set to `"disabled"`, stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
    * finite animations are fast-forwarded to completion, so they'll fire `transitionend` event.
    * infinite animations are canceled to initial state, and then played over after the screenshot.

    Defaults to `"allow"` that leaves animations untouched.
  - <a id="page-screenshot-option-caret"></a>`caret` `"hide" | "initial"` *(optional)*

    When set to `"hide"`, screenshot will hide text caret. When set to `"initial"`, text caret behavior will not be changed.  Defaults to `"hide"`.
  - <a id="page-screenshot-option-clip"></a>`clip` `Object` *(optional)*

    An object which specifies clipping of the resulting image.

    - `x` `float`

      x-coordinate of top-left corner of clip area
    - `y` `float`

      y-coordinate of top-left corner of clip area
    - `width` `float`

      width of clipping area
    - `height` `float`

      height of clipping area
  - <a id="page-screenshot-option-full-page"></a>`fullPage` `boolean` *(optional)*

    When true, takes a screenshot of the full scrollable page, instead of the currently visible viewport. Defaults to
    `false`.
  - <a id="page-screenshot-option-mask"></a>`mask` `Array<Locator>` *(optional)*

    Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with
    a pink box `#FF00FF` (customized by [`maskColor`](/api/class-page#page-screenshot-option-mask-color)) that completely covers its bounding box.
    The mask is also applied to invisible elements, see [Matching only visible elements](../locators.md#matching-only-visible-elements) to disable that.
  - <a id="page-screenshot-option-mask-color"></a>`maskColor` `string` *(optional)* <Badge type="info" text="Added in: v1.35" />

    Specify the color of the overlay box for masked elements, in [CSS color format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Default color is pink `#FF00FF`.
  - <a id="page-screenshot-option-omit-background"></a>`omitBackground` `boolean` *(optional)*

    Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images.
    Defaults to `false`.
  - <a id="page-screenshot-option-path"></a>`path` `path` *(optional)*

    The file path to save the image to. The screenshot type will be inferred from file extension. If [`path`](/api/class-page#page-screenshot-option-path) is a
    relative path, then it is resolved relative to the current working directory. If no path is provided, the image won't be
    saved to the disk.
  - <a id="page-screenshot-option-quality"></a>`quality` `int` *(optional)*

    The quality of the image, between 0-100. Not applicable to `png` images. For `jpeg` the default is `80`.
    For `webp`, a quality of `100` (the default) produces a lossless image, while lower values use lossy compression.
  - <a id="page-screenshot-option-scale"></a>`scale` `"css" | "device"` *(optional)*

    When set to `"css"`, screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using `"device"` option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.

    Defaults to `"device"`.
  - <a id="page-screenshot-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-screenshot-option-style"></a>`style` `string` *(optional)* <Badge type="info" text="Added in: v1.41" />

    Text of the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible
    or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies
    to the inner frames.
  - <a id="page-screenshot-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-screenshot-option-type"></a>`type` `"png" | "jpeg" | "webp"` *(optional)*

    Specify screenshot type, defaults to `png`.

**Returns**

- `Promise<Buffer>`


### page.selectOption() {#page-select-option}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.selectOption()`](/api/class-locator#locator-select-option) instead. Read more about [locators](../locators.md).
:::

This method waits for an element matching [`selector`](/api/class-page#page-select-option-option-selector), waits for [actionability](../actionability.md) checks, waits until all specified options are present in the `<select>` element and selects these options.

If the target element is not a `<select>` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be used instead.

Returns the array of option values that have been successfully selected.

Triggers a `change` and `input` event once all the provided options have been selected.

**Usage**

```js
// Single selection matching the value or label
page.selectOption('select#colors', 'blue');

// single selection matching the label
page.selectOption('select#colors', { label: 'Blue' });

// multiple selection
page.selectOption('select#colors', ['red', 'green', 'blue']);

```

**Arguments**

- <a id="page-select-option-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-select-option-option-values"></a>`values` `null | string | ElementHandle | Array<string> | Object | Array<ElementHandle> | Array<Object>`

  Options to select. If the `<select>` has the `multiple` attribute, all matching options are selected, otherwise only the
  first option matching one of the passed options is selected. String values are matching both values and labels. Option
  is considered matching if all specified properties match.

  - `value` `string` *(optional)*

    Matches by `option.value`. Optional.
  - `label` `string` *(optional)*

    Matches by `option.label`. Optional.
  - `index` `int` *(optional)*

    Matches by the index. Optional.
- <a id="page-select-option-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-select-option-option-force"></a>`force` `boolean` *(optional)* <Badge type="info" text="Added in: v1.13" />

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="page-select-option-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="page-select-option-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-select-option-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-select-option-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<Array<string>>`


### page.setChecked() {#page-set-checked}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.setChecked()`](/api/class-locator#locator-set-checked) instead. Read more about [locators](../locators.md).
:::

This method checks or unchecks an element matching [`selector`](/api/class-page#page-set-checked-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/api/class-page#page-set-checked-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Ensure that matched element is a checkbox or a radio input. If not, this method throws.
1. If the element already has the right checked state, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/api/class-page#page-set-checked-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now checked or unchecked. If not, this method throws.

When all steps combined have not finished during the specified [`timeout`](/api/class-page#page-set-checked-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="page-set-checked-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-set-checked-option-checked"></a>`checked` `boolean`

  Whether to check or uncheck the checkbox.
- <a id="page-set-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-set-checked-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="page-set-checked-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="page-set-checked-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="page-set-checked-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="page-set-checked-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-set-checked-option-strict"></a>`strict` `boolean` *(optional)*

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-set-checked-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-set-checked-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### page.setContent() {#page-set-content}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

This method internally calls [document.write()](https://developer.mozilla.org/en-US/docs/Web/API/Document/write), inheriting all its specific characteristics and behaviors.

**Arguments**

- <a id="page-set-content-option-html"></a>`html` `string`

  HTML markup to assign to the page.
- <a id="page-set-content-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-set-content-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-set-content-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `navigationTimeout` option in the config, or by using the [`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-set-content-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.


### page.setDefaultNavigationTimeout() {#page-set-default-navigation-timeout}

<Badge type="info" text="Added in: v1.8" />

This setting will change the default maximum navigation time for the following methods and related shortcuts:
* [`page.goBack()`](/api/class-page#page-go-back)
* [`page.goForward()`](/api/class-page#page-go-forward)
* [`page.goto()`](/api/class-page#page-goto)
* [`page.reload()`](/api/class-page#page-reload)
* [`page.setContent()`](/api/class-page#page-set-content)
* [`page.waitForNavigation()`](/api/class-page#page-wait-for-navigation)
* [`page.waitForURL()`](/api/class-page#page-wait-for-url)

::: info
[`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) takes priority over [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout),
[`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) and [`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout).
:::

**Arguments**

- <a id="page-set-default-navigation-timeout-option-timeout"></a>`timeout` `float`

  Maximum navigation time in milliseconds


### page.setDefaultTimeout() {#page-set-default-timeout}

<Badge type="info" text="Added in: v1.8" />

This setting will change the default maximum time for all the methods accepting [`timeout`](/api/class-page#page-set-default-timeout-option-timeout) option.

::: info
[`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) takes priority over [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout).
:::

**Arguments**

- <a id="page-set-default-timeout-option-timeout"></a>`timeout` `float`

  Maximum time in milliseconds. Pass `0` to disable timeout.


### page.setExtraHTTPHeaders() {#page-set-extra-http-headers}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

The extra HTTP headers will be sent with every request the page initiates.

::: info
[`page.setExtraHTTPHeaders()`](/api/class-page#page-set-extra-http-headers) does not guarantee the order of headers in the outgoing requests.
:::

**Arguments**

- <a id="page-set-extra-http-headers-option-headers"></a>`headers` `Object<string, string>`

  An object containing additional HTTP headers to be sent with every request. All header values must be strings.


### page.setInputFiles() {#page-set-input-files}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.setInputFiles()`](/api/class-locator#locator-set-input-files) instead. Read more about [locators](../locators.md).
:::

Sets the value of the file input to these file paths or files. If some of the `filePaths` are relative paths, then they
are resolved relative to the current working directory. For empty array, clears the selected files.
For inputs with a `[webkitdirectory]` attribute, only a single directory path is supported.

This method expects [`selector`](/api/class-page#page-set-input-files-option-selector) to point to an
[input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input). However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), targets the control instead.

**Arguments**

- <a id="page-set-input-files-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-set-input-files-option-files"></a>`files` `path | Array<path> | Object | Array<Object>`

  - `name` `string`

    File name
  - `mimeType` `string`

    File type
  - `buffer` `Buffer`

    File content
- <a id="page-set-input-files-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-set-input-files-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="page-set-input-files-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-set-input-files-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-set-input-files-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### page.setViewportSize() {#page-set-viewport-size}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

In the case of multiple pages in a single browser, each page can have its own viewport size. However,
[`browser.newContext()`](/api/class-browser#browser-new-context) allows to set viewport size (and more) for all pages in the context at once.

[`page.setViewportSize()`](/api/class-page#page-set-viewport-size) will resize the page. A lot of websites don't expect phones to change size, so you should set the
viewport size before navigating to the page. [`page.setViewportSize()`](/api/class-page#page-set-viewport-size) will also reset `screen` size, use [`browser.newContext()`](/api/class-browser#browser-new-context) with `screen` and `viewport` parameters if you need better control of these properties.

**Usage**

```js
const page = await browser.newPage();
await page.setViewportSize({
  width: 640,
  height: 480,
});
await page.goto('https://example.com');
```

**Arguments**

- <a id="page-set-viewport-size-option-viewport-size"></a>`viewportSize` `Object`

  - `width` `int`

    page width in pixels.
  - `height` `int`

    page height in pixels.


### page.tap() {#page-tap}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.tap()`](/api/class-locator#locator-tap) instead. Read more about [locators](../locators.md).
:::

This method taps an element matching [`selector`](/api/class-page#page-tap-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/api/class-page#page-tap-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/api/class-page#page-tap-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.touchscreen`](/api/class-page#page-touchscreen) to tap the center of the element, or the specified [`position`](/api/class-page#page-tap-option-position).

When all steps combined have not finished during the specified [`timeout`](/api/class-page#page-tap-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

::: info
[`page.tap()`](/api/class-page#page-tap) will throw if the [`hasTouch`](/api/class-browser#browser-new-context-option-has-touch) option of the browser context is false.
:::

**Arguments**

- <a id="page-tap-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-tap-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-tap-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="page-tap-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="page-tap-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="page-tap-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="page-tap-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="page-tap-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-tap-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-tap-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-tap-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### page.textContent() {#page-text-content}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.textContent()`](/api/class-locator#locator-text-content) instead. Read more about [locators](../locators.md).
:::

Returns `element.textContent`.

**Arguments**

- <a id="page-text-content-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-text-content-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-text-content-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-text-content-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-text-content-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<null | string>`


### page.title() {#page-title}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the page's title.

**Returns**

- `Promise<string>`


### page.uncheck() {#page-uncheck}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use locator-based [`locator.uncheck()`](/api/class-locator#locator-uncheck) instead. Read more about [locators](../locators.md).
:::

This method unchecks an element matching [`selector`](/api/class-page#page-uncheck-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/api/class-page#page-uncheck-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Ensure that matched element is a checkbox or a radio input. If not, this method throws. If the element is already
   unchecked, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/api/class-page#page-uncheck-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse`](/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now unchecked. If not, this method throws.

When all steps combined have not finished during the specified [`timeout`](/api/class-page#page-uncheck-option-timeout), this method throws a
[TimeoutError](/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="page-uncheck-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-uncheck-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-uncheck-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="page-uncheck-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="page-uncheck-option-position"></a>`position` `Object` *(optional)* <Badge type="info" text="Added in: v1.11" />

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float` <Badge type="info" text="Added in: v1.11" />
    - `y` `float` <Badge type="info" text="Added in: v1.11" />
  - <a id="page-uncheck-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="page-uncheck-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-uncheck-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-uncheck-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-uncheck-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### page.unroute() {#page-unroute}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Removes a route created with [`page.route()`](/api/class-page#page-route). When [`handler`](/api/class-page#page-unroute-option-handler) is not specified, removes all routes for
the [`url`](/api/class-page#page-unroute-option-url).

**Arguments**

- <a id="page-unroute-option-url"></a>`url` `string | RegExp | URLPattern | function(URL): boolean`

  A glob pattern, regex pattern, URL pattern, or predicate receiving [URL] to match while routing.
- <a id="page-unroute-option-handler"></a>`handler` `function(Route, Request): Promise<any> | any` *(optional)*

  Optional handler function to route the request.


### page.unrouteAll() {#page-unroute-all}

<Badge type="info" text="Added in: v1.41" /> <Badge type="tip" text="async" />

Removes all routes created with [`page.route()`](/api/class-page#page-route) and [`page.routeFromHAR()`](/api/class-page#page-route-from-har).

**Arguments**

- <a id="page-unroute-all-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-unroute-all-option-behavior"></a>`behavior` `"wait" | "ignoreErrors" | "default"` *(optional)*

    Specifies whether to wait for already running handlers and what to do if they throw errors:
    * `'default'` - do not wait for current handler calls (if any) to finish, if unrouted handler throws, it may result in unhandled error
    * `'wait'` - wait for current handler calls (if any) to finish
    * `'ignoreErrors'` - do not wait for current handler calls (if any) to finish, all errors thrown by the handlers after unrouting are silently caught


### page.url() {#page-url}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `string`


### page.video() {#page-video}

<Badge type="info" text="Added in: v1.8" />

Video object associated with this page. Can be used to access the video file when using the `recordVideo` context option.

**Returns**

- `null | Video`


### page.viewportSize() {#page-viewport-size}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `null | Object`


### page.waitForEvent() {#page-wait-for-event}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Waits for event to fire and passes its value into the predicate function. Returns when the predicate returns truthy
value. Will throw an error if the page is closed before the event is fired. Returns the event data value.

**Usage**

```js
// Start waiting for download before clicking. Note no await.
const downloadPromise = page.waitForEvent('download');
await page.getByText('Download file').click();
const download = await downloadPromise;
```

**Arguments**

- <a id="page-wait-for-event-option-event"></a>`event` `string`

  Event name, same one typically passed into `*.on(event)`.
- <a id="page-wait-for-event-option-options-or-predicate"></a>`optionsOrPredicate` `function() | Object` *(optional)*

  Either a predicate that receives an event or an options object. Optional.

  - `predicate` `function()`

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - `timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
- <a id="page-wait-for-event-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-event-option-predicate"></a>`predicate` `function()` *(optional)*

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - <a id="page-wait-for-event-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the waiting using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the waiting will be aborted and the operation will throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.

**Returns**

- `Promise<any>`


### page.waitForFunction() {#page-wait-for-function}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns when the [`pageFunction`](/api/class-page#page-wait-for-function-option-expression) returns a truthy value. It resolves to a JSHandle of the truthy value.

**Usage**

The [`page.waitForFunction()`](/api/class-page#page-wait-for-function) can be used to observe viewport size change:

```js
const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.

(async () => {
  const browser = await webkit.launch();
  const page = await browser.newPage();
  const watchDog = page.waitForFunction(() => window.innerWidth < 100);
  await page.setViewportSize({ width: 50, height: 50 });
  await watchDog;
  await browser.close();
})();
```

To pass an argument to the predicate of [`page.waitForFunction()`](/api/class-page#page-wait-for-function) function:

```js
const selector = '.foo';
await page.waitForFunction(selector => !!document.querySelector(selector), selector);
```

**Arguments**

- <a id="page-wait-for-function-option-expression"></a>`pageFunction` `function() | string`

  Function to be evaluated in the page context.
- <a id="page-wait-for-function-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-page#page-wait-for-function-option-expression).
- <a id="page-wait-for-function-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-function-option-polling"></a>`polling` `float | "raf"` *(optional)*

    If [`polling`](/api/class-page#page-wait-for-function-option-polling) is `'raf'`, then [`pageFunction`](/api/class-page#page-wait-for-function-option-expression) is constantly executed in `requestAnimationFrame`
    callback. If [`polling`](/api/class-page#page-wait-for-function-option-polling) is a number, then it is treated as an interval in milliseconds at which the function
    would be executed. Defaults to `raf`.
  - <a id="page-wait-for-function-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-wait-for-function-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<JSHandle>`


### page.waitForLoadState() {#page-wait-for-load-state}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns when the required load state has been reached.

This resolves when the page reaches a required load state, `load` by default. The navigation must have been committed
when this method is called. If current document has already reached the required state, resolves immediately.

::: info
Most of the time, this method is not needed because Playwright [auto-waits before every action](../actionability.md).
:::

**Usage**

```js
await page.getByRole('button').click(); // Click triggers navigation.
await page.waitForLoadState(); // The promise resolves after 'load' event.
```

```js
const popupPromise = page.waitForEvent('popup');
await page.getByRole('button').click(); // Click triggers a popup.
const popup = await popupPromise;
await popup.waitForLoadState('domcontentloaded'); // Wait for the 'DOMContentLoaded' event.
console.log(await popup.title()); // Popup is ready to use.
```

**Arguments**

- <a id="page-wait-for-load-state-option-state"></a>`state` `"load" | "domcontentloaded" | "networkidle"` *(optional)*

  Optional load state to wait for, defaults to `load`. If the state has been already reached while loading current document, the
  method resolves immediately. Can be one of:
  * `'load'` - wait for the `load` event to be fired.
  * `'domcontentloaded'` - wait for the `DOMContentLoaded` event to be fired.
  * `'networkidle'` - **DISCOURAGED** wait until there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
- <a id="page-wait-for-load-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-load-state-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the waiting using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the waiting will be aborted and the operation will throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-wait-for-load-state-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `navigationTimeout` option in the config, or by using the [`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### page.waitForRequest() {#page-wait-for-request}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Waits for the matching request and returns it. See [waiting for event](../events.md#waiting-for-event) for more details about events.

**Usage**

```js
// Start waiting for request before clicking. Note no await.
const requestPromise = page.waitForRequest('https://example.com/resource');
await page.getByText('trigger request').click();
const request = await requestPromise;

// Alternative way with a predicate. Note no await.
const requestPromise = page.waitForRequest(request =>
  request.url() === 'https://example.com' && request.method() === 'GET',
);
await page.getByText('trigger request').click();
const request = await requestPromise;
```

**Arguments**

- <a id="page-wait-for-request-option-url-or-predicate"></a>`urlOrPredicate` `string | RegExp | function(Request): boolean | Promise<boolean>`

  Request URL string, regex or predicate receiving [Request](/api/class-request) object.
  When a [`baseURL`](/api/class-browser#browser-new-context-option-base-url) via the context options was provided and the passed URL is a path,
  it gets merged via the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
- <a id="page-wait-for-request-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-request-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the waiting using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the waiting will be aborted and the operation will throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-wait-for-request-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum wait time in milliseconds, defaults to 30 seconds, pass `0` to disable the timeout. The default value can be
    changed by using the [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) method.

**Returns**

- `Promise<Request>`


### page.waitForResponse() {#page-wait-for-response}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the matched response. See [waiting for event](../events.md#waiting-for-event) for more details about events.

**Usage**

```js
// Start waiting for response before clicking. Note no await.
const responsePromise = page.waitForResponse('https://example.com/resource');
await page.getByText('trigger response').click();
const response = await responsePromise;

// Alternative way with a predicate. Note no await.
const responsePromise = page.waitForResponse(response =>
  response.url() === 'https://example.com' && response.status() === 200
      && response.request().method() === 'GET'
);
await page.getByText('trigger response').click();
const response = await responsePromise;
```

**Arguments**

- <a id="page-wait-for-response-option-url-or-predicate"></a>`urlOrPredicate` `string | RegExp | function(Response): boolean | Promise<boolean>`

  Request URL string, regex or predicate receiving [Response](/api/class-response) object.
  When a [`baseURL`](/api/class-browser#browser-new-context-option-base-url) via the context options was provided and the passed URL is a path,
  it gets merged via the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
- <a id="page-wait-for-response-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-response-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the waiting using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the waiting will be aborted and the operation will throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-wait-for-response-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum wait time in milliseconds, defaults to 30 seconds, pass `0` to disable the timeout. The default value can be
    changed by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<Response>`


### page.waitForSelector() {#page-wait-for-selector}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Use web assertions that assert visibility or a locator-based [`locator.waitFor()`](/api/class-locator#locator-wait-for) instead.↵Read more about [locators](../locators.md).
:::

Returns when element specified by selector satisfies [`state`](/api/class-page#page-wait-for-selector-option-state) option. Returns `null` if waiting for `hidden` or
`detached`.

::: info
Playwright automatically waits for element to be ready before performing an action. Using
[Locator](/api/class-locator) objects and web-first assertions makes the code wait-for-selector-free.
:::

Wait for the [`selector`](/api/class-page#page-wait-for-selector-option-selector) to satisfy [`state`](/api/class-page#page-wait-for-selector-option-state) option (either appear/disappear from dom, or become
visible/hidden). If at the moment of calling the method [`selector`](/api/class-page#page-wait-for-selector-option-selector) already satisfies the condition, the method
will return immediately. If the selector doesn't satisfy the condition for the [`timeout`](/api/class-page#page-wait-for-selector-option-timeout) milliseconds, the
function will throw.

**Usage**

This method works across navigations:

```js
const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const currentURL of ['https://google.com', 'https://bbc.com']) {
    await page.goto(currentURL);
    const element = await page.waitForSelector('img');
    console.log('Loaded image: ' + await element.getAttribute('src'));
  }
  await browser.close();
})();
```

**Arguments**

- <a id="page-wait-for-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="page-wait-for-selector-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-selector-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-wait-for-selector-option-state"></a>`state` `"attached" | "detached" | "visible" | "hidden"` *(optional)*

    Defaults to `'visible'`. Can be either:
    * `'attached'` - wait for element to be present in DOM.
    * `'detached'` - wait for element to not be present in DOM.
    * `'visible'` - wait for element to have non-empty bounding box and no `visibility:hidden`. Note that element without
      any content or with `display:none` has an empty bounding box and is not considered visible.
    * `'hidden'` - wait for element to be either detached from DOM, or have an empty bounding box or `visibility:hidden`.
      This is opposite to the `'visible'` option.
  - <a id="page-wait-for-selector-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-wait-for-selector-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Promise<null | ElementHandle>`


### page.waitForTimeout() {#page-wait-for-timeout}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning Discouraged
Never wait for timeout in production. Tests that wait for time are↵inherently flaky. Use [Locator](/api/class-locator) actions and web assertions that wait automatically.
:::

Waits for the given [`timeout`](/api/class-page#page-wait-for-timeout-option-timeout) in milliseconds.

Note that `page.waitForTimeout()` should only be used for debugging. Tests using the timer in production are going to be
flaky. Use signals such as network events, selectors becoming visible and others instead.

**Usage**

```js
// wait for 1 second
await page.waitForTimeout(1000);
```

**Arguments**

- <a id="page-wait-for-timeout-option-timeout"></a>`timeout` `float`

  A timeout to wait for


### page.waitForURL() {#page-wait-for-url}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

Waits for the main frame to navigate to the given URL.

**Usage**

```js
await page.click('a.delayed-navigation'); // Clicking the link will indirectly cause a navigation
await page.waitForURL('**/target.html');
```

**Arguments**

- <a id="page-wait-for-url-option-url"></a>`url` `string | RegExp | URLPattern | function(URL): boolean`

  A glob pattern, regex pattern, URL pattern, or predicate receiving [URL] to match while waiting for the navigation. Note that if
  the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly
  equal to the string.
- <a id="page-wait-for-url-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-url-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the waiting using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the waiting will be aborted and the operation will throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-wait-for-url-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `navigationTimeout` option in the config, or by using the [`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-wait-for-url-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.


### page.workers() {#page-workers}

<Badge type="info" text="Added in: v1.8" />

This method returns all of the dedicated [WebWorkers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
associated with the page.

::: info
This does not contain ServiceWorkers
:::

**Returns**

- `Array<Worker>`


## Properties

### page.clock {#page-clock}

<Badge type="info" text="Added in: v1.45" />

Playwright has ability to mock clock and passage of time.

**Type**

- `Clock`


### page.coverage {#page-coverage}

<Badge type="info" text="Added in: v1.8" />

::: info
Only available for Chromium atm.
:::

Browser-specific Coverage implementation. See [Coverage](./class-coverage) for more details.

**Type**

- `Coverage`


### page.keyboard {#page-keyboard}

<Badge type="info" text="Added in: v1.8" />

**Type**

- `Keyboard`


### page.localStorage {#page-local-storage}

<Badge type="info" text="Added in: v1.61" />

Provides access to the page's `localStorage` for the current origin. See [WebStorage](/api/class-webstorage).

```js
await page.localStorage.setItem('token', 'abc');
const token = await page.localStorage.getItem('token');
```

**Type**

- `WebStorage`


### page.mouse {#page-mouse}

<Badge type="info" text="Added in: v1.8" />

**Type**

- `Mouse`


### page.request {#page-request}

<Badge type="info" text="Added in: v1.16" />

API testing helper associated with this page. This method returns the same instance as
[`browserContext.request`](/api/class-browsercontext#browser-context-request) on the page's context. See [`browserContext.request`](/api/class-browsercontext#browser-context-request) for more details.

**Type**

- `APIRequestContext`


### page.screencast {#page-screencast}

<Badge type="info" text="Added in: v1.59" />

[Screencast](/api/class-screencast) object associated with this page.

**Usage**

```js
await page.screencast.start({
  onFrame: ({ data }) => {
    console.log('received frame, jpeg size:', data.length);
  },
});
// ... perform actions ...
await page.screencast.stop();
```

**Type**

- `Screencast`


### page.sessionStorage {#page-session-storage}

<Badge type="info" text="Added in: v1.61" />

Provides access to the page's `sessionStorage` for the current origin. See [WebStorage](/api/class-webstorage).

```js
await page.sessionStorage.setItem('flag', '1');
const flag = await page.sessionStorage.getItem('flag');
```

**Type**

- `WebStorage`


### page.touchscreen {#page-touchscreen}

<Badge type="info" text="Added in: v1.8" />

**Type**

- `Touchscreen`


### page.webmcp {#page-webmcp}

<Badge type="info" text="Added in: v1.64" />

Tools that the main frame registers through the experimental [WebMCP](https://webmachinelearning.github.io/webmcp/) browser API. Shortcut for [`frame.webmcp`](/api/class-frame#frame-webmcp) of [`page.mainFrame()`](/api/class-page#page-main-frame), see [WebMCP](/api/class-webmcp) for details.

**Usage**

```js
const tools = await page.webmcp.tools();
const result = await page.webmcp.callTool('add', { a: 2, b: 40 });
```

**Type**

- `WebMCP`


## Events

### page.on('close') {#page-event-close}

<Badge type="info" text="Added in: v1.8" />

Emitted when the page closes.

**Event data**

- `Page`


### page.on('console') {#page-event-console}

<Badge type="info" text="Added in: v1.8" />

Emitted when JavaScript within the page calls one of console API methods, e.g. `console.log` or `console.dir`.

The arguments passed into `console.log` are available on the [ConsoleMessage](/api/class-consolemessage) event handler argument.

**Usage**

```js
page.on('console', async msg => {
  const values = [];
  for (const arg of msg.args())
    values.push(await arg.jsonValue());
  console.log(...values);
});
await page.evaluate(() => console.log('hello', 5, { foo: 'bar' }));
```

**Event data**

- `ConsoleMessage`


### page.on('crash') {#page-event-crash}

<Badge type="info" text="Added in: v1.8" />

Emitted when the page crashes. Browser pages might crash if they try to allocate too much memory. When the page crashes,
ongoing and subsequent operations will throw.

The most common way to deal with crashes is to catch an exception:

```js
try {
  // Crash might happen during a click.
  await page.click('button');
  // Or while waiting for an event.
  await page.waitForEvent('popup');
} catch (e) {
  // When the page crashes, exception message contains 'crash'.
}
```

**Event data**

- `Page`


### page.on('dialog') {#page-event-dialog}

<Badge type="info" text="Added in: v1.8" />

Emitted when a JavaScript dialog appears, such as `alert`, `prompt`, `confirm` or `beforeunload`. Listener **must** either [`dialog.accept()`](/api/class-dialog#dialog-accept) or [`dialog.dismiss()`](/api/class-dialog#dialog-dismiss) the dialog - otherwise the page will [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#never_blocking) waiting for the dialog, and actions like click will never finish.

**Usage**

```js
page.on('dialog', dialog => dialog.accept());
```

::: info
When no [`page.on('dialog')`](/api/class-page#page-event-dialog) or [`browserContext.on('dialog')`](/api/class-browsercontext#browser-context-event-dialog) listeners are present, all dialogs are automatically dismissed.
:::

**Event data**

- `Dialog`


### page.on('dialogClosed') {#page-event-dialog-closed}

<Badge type="info" text="Added in: v1.63" />

Emitted when a JavaScript dialog has been closed, either by [`dialog.accept()`](/api/class-dialog#dialog-accept), by [`dialog.dismiss()`](/api/class-dialog#dialog-dismiss), or manually by the user in the headed browser.

**Event data**

- `Dialog`


### page.on('DOMContentLoaded') {#page-event-dom-content-loaded}

<Badge type="info" text="Added in: v1.9" />

Emitted when the JavaScript [`DOMContentLoaded`](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded)
event is dispatched.

**Event data**

- `Page`


### page.on('download') {#page-event-download}

<Badge type="info" text="Added in: v1.8" />

Emitted when attachment download started. User can access basic file operations on downloaded content via the passed
[Download](/api/class-download) instance.

**Event data**

- `Download`


### page.on('fileChooser') {#page-event-file-chooser}

<Badge type="info" text="Added in: v1.9" />

Emitted when a file chooser is supposed to appear, such as after clicking the  `<input type=file>`. Playwright can
respond to it via setting the input files using [`fileChooser.setFiles()`](/api/class-filechooser#file-chooser-set-files) that can be uploaded after that.

```js
page.on('filechooser', async fileChooser => {
  await fileChooser.setFiles(path.join(__dirname, '/tmp/myfile.pdf'));
});
```

**Event data**

- `FileChooser`


### page.on('frameAttached') {#page-event-frame-attached}

<Badge type="info" text="Added in: v1.9" />

Emitted when a frame is attached.

**Event data**

- `Frame`


### page.on('frameDetached') {#page-event-frame-detached}

<Badge type="info" text="Added in: v1.9" />

Emitted when a frame is detached.

**Event data**

- `Frame`


### page.on('frameNavigated') {#page-event-frame-navigated}

<Badge type="info" text="Added in: v1.9" />

Emitted when a frame is navigated to a new url.

**Event data**

- `Frame`


### page.on('load') {#page-event-load}

<Badge type="info" text="Added in: v1.8" />

Emitted when the JavaScript [`load`](https://developer.mozilla.org/en-US/docs/Web/Events/load) event is dispatched.

**Event data**

- `Page`


### page.on('pageError') {#page-event-page-error}

<Badge type="info" text="Added in: v1.9" />

Emitted when an uncaught exception happens within the page.

```js
// Log all uncaught errors to the terminal
page.on('pageerror', exception => {
  console.log(`Uncaught exception: "${exception}"`);
});

// Navigate to a page with an exception.
await page.goto('data:text/html,<script>throw new Error("Test")</script>');
```

**Event data**

- `Error`


### page.on('popup') {#page-event-popup}

<Badge type="info" text="Added in: v1.8" />

Emitted when the page opens a new tab or window. This event is emitted in addition to the
[`browserContext.on('page')`](/api/class-browsercontext#browser-context-event-page), but only for popups relevant to this page.

The earliest moment that page is available is when it has navigated to the initial url. For example, when opening a
popup with `window.open('http://example.com')`, this event will fire when the network request to "http://example.com" is
done and its response has started loading in the popup. If you would like to route/listen to this network request, use [`browserContext.route()`](/api/class-browsercontext#browser-context-route) and [`browserContext.on('request')`](/api/class-browsercontext#browser-context-event-request) respectively instead of similar methods on the [Page](/api/class-page).

```js
// Start waiting for popup before clicking. Note no await.
const popupPromise = page.waitForEvent('popup');
await page.getByText('open the popup').click();
const popup = await popupPromise;
console.log(await popup.evaluate('location.href'));
```

::: info
Use [`page.waitForLoadState()`](/api/class-page#page-wait-for-load-state) to wait until the page gets to a particular state (you should not need it in most
cases).
:::

**Event data**

- `Page`


### page.on('request') {#page-event-request}

<Badge type="info" text="Added in: v1.8" />

Emitted when a page issues a request. The [request] object is read-only. In order to intercept and mutate requests, see
[`page.route()`](/api/class-page#page-route) or [`browserContext.route()`](/api/class-browsercontext#browser-context-route).

**Event data**

- `Request`


### page.on('requestFailed') {#page-event-request-failed}

<Badge type="info" text="Added in: v1.9" />

Emitted when a request fails, for example by timing out.

```js
page.on('requestfailed', request => {
  console.log(request.url() + ' ' + request.failure().errorText);
});
```

::: info
HTTP Error responses, such as 404 or 503, are still successful responses from HTTP standpoint, so request will complete
with [`page.on('requestFinished')`](/api/class-page#page-event-request-finished) event and not with [`page.on('requestFailed')`](/api/class-page#page-event-request-failed). A request will only be considered
failed when the client cannot get an HTTP response from the server, e.g. due to network error net::ERR_FAILED.
:::

**Event data**

- `Request`


### page.on('requestFinished') {#page-event-request-finished}

<Badge type="info" text="Added in: v1.9" />

Emitted when a request finishes successfully after downloading the response body. For a successful response, the
sequence of events is `request`, `response` and `requestfinished`.

**Event data**

- `Request`


### page.on('response') {#page-event-response}

<Badge type="info" text="Added in: v1.8" />

Emitted when [response] status and headers are received for a request. For a successful response, the sequence of events
is `request`, `response` and `requestfinished`.

**Event data**

- `Response`


### page.on('webSocket') {#page-event-web-socket}

<Badge type="info" text="Added in: v1.9" />

Emitted when [WebSocket](/api/class-websocket) request is sent.

**Event data**

- `WebSocket`


### page.on('worker') {#page-event-worker}

<Badge type="info" text="Added in: v1.8" />

Emitted when a dedicated [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) is spawned by the
page.

**Event data**

- `Worker`


## Deprecated

### page.type() {#page-type}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: danger Deprecated
In most cases, you should use [`locator.fill()`](/api/class-locator#locator-fill) instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially).
:::

Sends a `keydown`, `keypress`/`input`, and `keyup` event for each character in the text. `page.type` can be used to send
fine-grained keyboard events. To fill values in form fields, use [`page.fill()`](/api/class-page#page-fill).

To press a special key, like `Control` or `ArrowDown`, use [`keyboard.press()`](/api/class-keyboard#keyboard-press).

**Usage**

**Arguments**

- <a id="page-type-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-type-option-text"></a>`text` `string`

  A text to type into a focused element.
- <a id="page-type-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-type-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between key presses in milliseconds. Defaults to 0.
  - <a id="page-type-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="page-type-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the operation using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the operation will be aborted and throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-type-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-type-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.


### page.waitForNavigation() {#page-wait-for-navigation}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: danger Deprecated
This method is inherently racy, please use [`page.waitForURL()`](/api/class-page#page-wait-for-url) instead.
:::

Waits for the main frame navigation and returns the main resource response. In case of multiple redirects, the navigation
will resolve with the response of the last redirect. In case of navigation to a different anchor or navigation due to
History API usage, the navigation will resolve with `null`.

**Usage**

This resolves when the page navigates to a new URL or reloads. It is useful for when you run code which will indirectly
cause the page to navigate. e.g. The click target has an `onclick` handler that triggers navigation from a `setTimeout`.
Consider this example:

```js
// Start waiting for navigation before clicking. Note no await.
const navigationPromise = page.waitForNavigation();
await page.getByText('Navigate after timeout').click();
await navigationPromise;
```

::: info
Usage of the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) to change the URL is considered
a navigation.
:::

**Arguments**

- <a id="page-wait-for-navigation-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-navigation-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the waiting using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the waiting will be aborted and the operation will throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.
  - <a id="page-wait-for-navigation-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `navigationTimeout` option in the config, or by using the [`browserContext.setDefaultNavigationTimeout()`](/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
  - <a id="page-wait-for-navigation-option-url"></a>`url` `string | RegExp | URLPattern | function(URL): boolean` *(optional)*

    A glob pattern, regex pattern, URL pattern, or predicate receiving [URL] to match while waiting for the navigation. Note that if
    the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly
    equal to the string.
  - <a id="page-wait-for-navigation-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.

**Returns**

- `Promise<null | Response>`

