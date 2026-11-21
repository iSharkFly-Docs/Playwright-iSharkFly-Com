---
title: Frame
outline: 2
---

# Frame

<Badge type="info" text="Added in: v1.8" />

At every point of time, page exposes its current frame tree via the [`page.mainFrame()`](/java/api/class-page#page-main-frame) and
[`frame.childFrames()`](/java/api/class-frame#frame-child-frames) methods.

[Frame](/java/api/class-frame) object's lifecycle is controlled by three events, dispatched on the page object:
* [`page.onFrameAttached()`](/java/api/class-page#page-event-frame-attached) - fired when the frame gets attached to the page. A Frame can be attached to the page
  only once.
* [`page.onFrameNavigated()`](/java/api/class-page#page-event-frame-navigated) - fired when the frame commits navigation to a different URL.
* [`page.onFrameDetached()`](/java/api/class-page#page-event-frame-detached) - fired when the frame gets detached from the page.  A Frame can be detached from the
  page only once.

An example of dumping frame tree:

```java
import com.microsoft.playwright.*;

public class Example {
  public static void main(String[] args) {
    try (Playwright playwright = Playwright.create()) {
      BrowserType firefox = playwright.firefox();
      Browser browser = firefox.launch();
      Page page = browser.newPage();
      page.navigate("https://www.google.com/chrome/browser/canary.html");
      dumpFrameTree(page.mainFrame(), "");
      browser.close();
    }
  }
  static void dumpFrameTree(Frame frame, String indent) {
    System.out.println(indent + frame.url());
    for (Frame child : frame.childFrames()) {
      dumpFrameTree(child, indent + "  ");
    }
  }
}
```

## Methods

### frame.addScriptTag() {#frame-add-script-tag}

<Badge type="info" text="Added in: v1.8" />

Returns the added tag when the script's onload fires or when the script content was injected into frame.

Adds a `<script>` tag into the page with the desired url or content.

**Arguments**

- <a id="frame-add-script-tag-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-add-script-tag-option-content"></a>`content` `string` *(optional)*

    Raw JavaScript content to be injected into frame.
  - <a id="frame-add-script-tag-option-path"></a>`path` `path` *(optional)*

    Path to the JavaScript file to be injected into frame. If `path` is a relative path, then it is resolved relative to the
    current working directory.
  - <a id="frame-add-script-tag-option-type"></a>`type` `string` *(optional)*

    Script type. Use 'module' in order to load a JavaScript ES6 module. See
    [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) for more details.
  - <a id="frame-add-script-tag-option-url"></a>`url` `string` *(optional)*

    URL of a script to be added.

**Returns**

- `ElementHandle`


### frame.addStyleTag() {#frame-add-style-tag}

<Badge type="info" text="Added in: v1.8" />

Returns the added tag when the stylesheet's onload fires or when the CSS content was injected into frame.

Adds a `<link rel="stylesheet">` tag into the page with the desired url or a `<style type="text/css">` tag with the
content.

**Arguments**

- <a id="frame-add-style-tag-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-add-style-tag-option-content"></a>`content` `string` *(optional)*

    Raw CSS content to be injected into frame.
  - <a id="frame-add-style-tag-option-path"></a>`path` `path` *(optional)*

    Path to the CSS file to be injected into frame. If `path` is a relative path, then it is resolved relative to the
    current working directory.
  - <a id="frame-add-style-tag-option-url"></a>`url` `string` *(optional)*

    URL of the `<link>` tag.

**Returns**

- `ElementHandle`


### frame.check() {#frame-check}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.check()`](/java/api/class-locator#locator-check) instead. Read more about [locators](../locators.md).
:::

This method checks an element matching [`selector`](/java/api/class-frame#frame-check-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/java/api/class-frame#frame-check-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Ensure that matched element is a checkbox or a radio input. If not, this method throws. If the element is already
   checked, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/java/api/class-frame#frame-check-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse()`](/java/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now checked. If not, this method throws.

When all steps combined have not finished during the specified [`timeout`](/java/api/class-frame#frame-check-option-timeout), this method throws a
[TimeoutError](/java/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="frame-check-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-check-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-check-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="frame-check-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="frame-check-option-position"></a>`position` `Object` *(optional)* <Badge type="info" text="Added in: v1.11" />

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float` <Badge type="info" text="Added in: v1.11" />
    - `y` `float` <Badge type="info" text="Added in: v1.11" />
  - <a id="frame-check-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="frame-check-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-check-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.
  - <a id="frame-check-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### frame.childFrames() {#frame-child-frames}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `Array<Frame>`


### frame.click() {#frame-click}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.click()`](/java/api/class-locator#locator-click) instead. Read more about [locators](../locators.md).
:::

This method clicks an element matching [`selector`](/java/api/class-frame#frame-click-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/java/api/class-frame#frame-click-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/java/api/class-frame#frame-click-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse()`](/java/api/class-page#page-mouse) to click in the center of the element, or the specified [`position`](/java/api/class-frame#frame-click-option-position).
1. Wait for initiated navigations to either succeed or fail, unless [`noWaitAfter`](/java/api/class-frame#frame-click-option-no-wait-after) option is set.

When all steps combined have not finished during the specified [`timeout`](/java/api/class-frame#frame-click-option-timeout), this method throws a
[TimeoutError](/java/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="frame-click-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-click-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-click-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="frame-click-option-click-count"></a>`clickCount` `int` *(optional)*

    defaults to 1. See [UIEvent.detail].
  - <a id="frame-click-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.
  - <a id="frame-click-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="frame-click-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="frame-click-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can
    opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating
    to inaccessible pages. Defaults to `false`.
  - <a id="frame-click-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="frame-click-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="frame-click-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-click-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.
  - <a id="frame-click-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### frame.content() {#frame-content}

<Badge type="info" text="Added in: v1.8" />

Gets the full HTML contents of the frame, including the doctype.

**Arguments**

- <a id="frame-content-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-content-option-include-shadow"></a>`includeShadow` `boolean` *(optional)* <Badge type="info" text="Added in: v1.64" />

    When true, contents of open shadow roots are included as [declarative shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html),
    i.e. `<template shadowrootmode="open">` elements nested inside their host elements. Closed shadow roots are never included. Defaults to `false`.

**Returns**

- `string`


### frame.dblclick() {#frame-dblclick}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.dblclick()`](/java/api/class-locator#locator-dblclick) instead. Read more about [locators](../locators.md).
:::

This method double clicks an element matching [`selector`](/java/api/class-frame#frame-dblclick-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/java/api/class-frame#frame-dblclick-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/java/api/class-frame#frame-dblclick-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse()`](/java/api/class-page#page-mouse) to double click in the center of the element, or the specified [`position`](/java/api/class-frame#frame-dblclick-option-position).
   if the first click of the `dblclick()` triggers a navigation event, this method will throw.

When all steps combined have not finished during the specified [`timeout`](/java/api/class-frame#frame-dblclick-option-timeout), this method throws a
[TimeoutError](/java/api/class-timeouterror). Passing zero timeout disables this.

::: info
`frame.dblclick()` dispatches two `click` events and a single `dblclick` event.
:::

**Arguments**

- <a id="frame-dblclick-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-dblclick-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-dblclick-option-button"></a>`button` `"left" | "right" | "middle"` *(optional)*

    Defaults to `left`.
  - <a id="frame-dblclick-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.
  - <a id="frame-dblclick-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="frame-dblclick-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="frame-dblclick-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="frame-dblclick-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="frame-dblclick-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="frame-dblclick-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-dblclick-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.
  - <a id="frame-dblclick-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### frame.dispatchEvent() {#frame-dispatch-event}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.dispatchEvent()`](/java/api/class-locator#locator-dispatch-event) instead. Read more about [locators](../locators.md).
:::

The snippet below dispatches the `click` event on the element. Regardless of the visibility state of the element, `click`
is dispatched. This is equivalent to calling
[element.click()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click).

**Usage**

```java
frame.dispatchEvent("button#submit", "click");
```

Under the hood, it creates an instance of an event based on the given [`type`](/java/api/class-frame#frame-dispatch-event-option-type), initializes it with
[`eventInit`](/java/api/class-frame#frame-dispatch-event-option-event-init) properties and dispatches it on the element. Events are `composed`, `cancelable` and bubble by
default.

Since [`eventInit`](/java/api/class-frame#frame-dispatch-event-option-event-init) is event-specific, please refer to the events documentation for the lists of initial
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

```java
// Note you can only create DataTransfer in Chromium and Firefox
JSHandle dataTransfer = frame.evaluateHandle("() => new DataTransfer()");
Map<String, Object> arg = new HashMap<>();
arg.put("dataTransfer", dataTransfer);
frame.dispatchEvent("#source", "dragstart", arg);
```

**Arguments**

- <a id="frame-dispatch-event-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-dispatch-event-option-type"></a>`type` `string`

  DOM event type: `"click"`, `"dragstart"`, etc.
- <a id="frame-dispatch-event-option-event-init"></a>`eventInit` `EvaluationArgument` *(optional)*

  Optional event-specific initialization properties.
- <a id="frame-dispatch-event-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-dispatch-event-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-dispatch-event-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.


### frame.dragAndDrop() {#frame-drag-and-drop}

<Badge type="info" text="Added in: v1.13" />

**Arguments**

- <a id="frame-drag-and-drop-option-source"></a>`source` `string`

  A selector to search for an element to drag. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-drag-and-drop-option-target"></a>`target` `string`

  A selector to search for an element to drop onto. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-drag-and-drop-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-drag-and-drop-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="frame-drag-and-drop-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="frame-drag-and-drop-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="frame-drag-and-drop-option-source-position"></a>`sourcePosition` `Object` *(optional)* <Badge type="info" text="Added in: v1.14" />

    Clicks on the source element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.

    - `x` `float` <Badge type="info" text="Added in: v1.14" />
    - `y` `float` <Badge type="info" text="Added in: v1.14" />
  - <a id="frame-drag-and-drop-option-steps"></a>`steps` `int` *(optional)* <Badge type="info" text="Added in: v1.57" />

    Defaults to 1. Sends `n` interpolated `mousemove` events to represent travel between the `mousedown` and `mouseup` of the drag. When set to 1, emits a single `mousemove` event at the destination location.
  - <a id="frame-drag-and-drop-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-drag-and-drop-option-target-position"></a>`targetPosition` `Object` *(optional)* <Badge type="info" text="Added in: v1.14" />

    Drops on the target element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.

    - `x` `float` <Badge type="info" text="Added in: v1.14" />
    - `y` `float` <Badge type="info" text="Added in: v1.14" />
  - <a id="frame-drag-and-drop-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.
  - <a id="frame-drag-and-drop-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### frame.evalOnSelector() {#frame-eval-on-selector}

<Badge type="info" text="Added in: v1.9" />

::: warning Discouraged
This method does not wait for the element to pass the actionability↵checks and therefore can lead to the flaky tests. Use [`locator.evaluate()`](/java/api/class-locator#locator-evaluate), other [Locator](/java/api/class-locator) helper methods or web-first assertions instead.
:::

Returns the return value of [`expression`](/java/api/class-frame#frame-eval-on-selector-option-expression).

The method finds an element matching the specified selector within the frame and passes it as a first argument to
[`expression`](/java/api/class-frame#frame-eval-on-selector-option-expression). If no
elements match the selector, the method throws an error.

If [`expression`](/java/api/class-frame#frame-eval-on-selector-option-expression) returns a [Promise], then [`frame.evalOnSelector()`](/java/api/class-frame#frame-eval-on-selector) would wait for the promise to resolve and return its
value.

**Usage**

```java
String searchValue = (String) frame.evalOnSelector("#search", "el => el.value");
String preloadHref = (String) frame.evalOnSelector("link[rel=preload]", "el => el.href");
String html = (String) frame.evalOnSelector(".main-container", "(e, suffix) => e.outerHTML + suffix", "hello");
```

**Arguments**

- <a id="frame-eval-on-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="frame-eval-on-selector-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="frame-eval-on-selector-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/java/api/class-frame#frame-eval-on-selector-option-expression).
- <a id="frame-eval-on-selector-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-eval-on-selector-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.

**Returns**

- `Serializable`


### frame.evalOnSelectorAll() {#frame-eval-on-selector-all}

<Badge type="info" text="Added in: v1.9" />

::: warning Discouraged
In most cases, [`locator.evaluateAll()`](/java/api/class-locator#locator-evaluate-all),↵other [Locator](/java/api/class-locator) helper methods and web-first assertions do a better job.
:::

Returns the return value of [`expression`](/java/api/class-frame#frame-eval-on-selector-all-option-expression).

The method finds all elements matching the specified selector within the frame and passes an array of matched elements
as a first argument to [`expression`](/java/api/class-frame#frame-eval-on-selector-all-option-expression).

If [`expression`](/java/api/class-frame#frame-eval-on-selector-all-option-expression) returns a [Promise], then [`frame.evalOnSelectorAll()`](/java/api/class-frame#frame-eval-on-selector-all) would wait for the promise to resolve and return its
value.

**Usage**

```java
boolean divsCounts = (boolean) page.evalOnSelectorAll("div", "(divs, min) => divs.length >= min", 10);
```

**Arguments**

- <a id="frame-eval-on-selector-all-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="frame-eval-on-selector-all-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="frame-eval-on-selector-all-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/java/api/class-frame#frame-eval-on-selector-all-option-expression).

**Returns**

- `Serializable`


### frame.evaluate() {#frame-evaluate}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/java/api/class-frame#frame-evaluate-option-expression).

If the function passed to the [`frame.evaluate()`](/java/api/class-frame#frame-evaluate) returns a [Promise], then [`frame.evaluate()`](/java/api/class-frame#frame-evaluate) would wait for the promise to
resolve and return its value.

If the function passed to the [`frame.evaluate()`](/java/api/class-frame#frame-evaluate) returns a non-[Serializable] value, then
[`frame.evaluate()`](/java/api/class-frame#frame-evaluate) returns `undefined`. Playwright also supports transferring some
additional values that are not serializable by `JSON`: `-0`, `NaN`, `Infinity`, `-Infinity`.

**Usage**

```java
Object result = frame.evaluate("([x, y]) => {\n" +
  "  return Promise.resolve(x * y);\n" +
  "}", Arrays.asList(7, 8));
System.out.println(result); // prints "56"
```

A string can also be passed in instead of a function.

```java
System.out.println(frame.evaluate("1 + 2")); // prints "3"
```

[ElementHandle](/java/api/class-elementhandle) instances can be passed as an argument to the [`frame.evaluate()`](/java/api/class-frame#frame-evaluate):

```java
ElementHandle bodyHandle = frame.evaluateHandle("document.body");
String html = (String) frame.evaluate("([body, suffix]) => body.innerHTML + suffix", Arrays.asList(bodyHandle, "hello"));
bodyHandle.dispose();
```

**Arguments**

- <a id="frame-evaluate-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="frame-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/java/api/class-frame#frame-evaluate-option-expression).

**Returns**

- `Serializable`


### frame.evaluateHandle() {#frame-evaluate-handle}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/java/api/class-frame#frame-evaluate-handle-option-expression) as a [JSHandle](/java/api/class-jshandle).

The only difference between [`frame.evaluate()`](/java/api/class-frame#frame-evaluate) and [`frame.evaluateHandle()`](/java/api/class-frame#frame-evaluate-handle) is that
[`frame.evaluateHandle()`](/java/api/class-frame#frame-evaluate-handle) returns [JSHandle](/java/api/class-jshandle).

If the function, passed to the [`frame.evaluateHandle()`](/java/api/class-frame#frame-evaluate-handle), returns a [Promise], then
[`frame.evaluateHandle()`](/java/api/class-frame#frame-evaluate-handle) would wait for the promise to resolve and return its value.

**Usage**

```java
// Handle for the window object.
JSHandle aWindowHandle = frame.evaluateHandle("() => Promise.resolve(window)");
```

A string can also be passed in instead of a function.

```java
JSHandle aHandle = frame.evaluateHandle("document"); // Handle for the "document".
```

[JSHandle](/java/api/class-jshandle) instances can be passed as an argument to the [`frame.evaluateHandle()`](/java/api/class-frame#frame-evaluate-handle):

```java
JSHandle aHandle = frame.evaluateHandle("() => document.body");
JSHandle resultHandle = frame.evaluateHandle("([body, suffix]) => body.innerHTML + suffix", Arrays.asList(aHandle, "hello"));
System.out.println(resultHandle.jsonValue());
resultHandle.dispose();
```

**Arguments**

- <a id="frame-evaluate-handle-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="frame-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/java/api/class-frame#frame-evaluate-handle-option-expression).

**Returns**

- `JSHandle`


### frame.fill() {#frame-fill}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.fill()`](/java/api/class-locator#locator-fill) instead. Read more about [locators](../locators.md).
:::

This method waits for an element matching [`selector`](/java/api/class-frame#frame-fill-option-selector), waits for [actionability](../actionability.md) checks, focuses the element, fills it and triggers an `input` event after filling. Note that you can pass an empty string to clear the input field.

If the target element is not an `<input>`, `<textarea>` or `[contenteditable]` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be filled instead.

To send fine-grained keyboard events, use [`locator.pressSequentially()`](/java/api/class-locator#locator-press-sequentially).

**Arguments**

- <a id="frame-fill-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-fill-option-value"></a>`value` `string`

  Value to fill for the `<input>`, `<textarea>` or `[contenteditable]` element.
- <a id="frame-fill-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-fill-option-force"></a>`force` `boolean` *(optional)* <Badge type="info" text="Added in: v1.13" />

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="frame-fill-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="frame-fill-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-fill-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.


### frame.focus() {#frame-focus}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.focus()`](/java/api/class-locator#locator-focus) instead. Read more about [locators](../locators.md).
:::

This method fetches an element with [`selector`](/java/api/class-frame#frame-focus-option-selector) and focuses it. If there's no element matching
[`selector`](/java/api/class-frame#frame-focus-option-selector), the method waits until a matching element appears in the DOM.

**Arguments**

- <a id="frame-focus-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-focus-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-focus-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-focus-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.


### frame.frameElement() {#frame-frame-element}

<Badge type="info" text="Added in: v1.8" />

Returns the `frame` or `iframe` element handle which corresponds to this frame.

This is an inverse of [`elementHandle.contentFrame()`](/java/api/class-elementhandle#element-handle-content-frame). Note that returned handle actually belongs to the parent
frame.

This method throws an error if the frame has been detached before `frameElement()` returns.

**Usage**

```java
ElementHandle frameElement = frame.frameElement();
Frame contentFrame = frameElement.contentFrame();
System.out.println(frame == contentFrame);  // -> true
```

**Returns**

- `ElementHandle`


### frame.frameLocator() {#frame-frame-locator}

<Badge type="info" text="Added in: v1.17" />

When working with iframes, you can create a frame locator that will enter the iframe and allow selecting elements
in that iframe.

When called without [`selector`](/java/api/class-frame#frame-frame-locator-option-selector), the search starts in this frame or in any of the iframes inside it,
so that you don't need to locate each iframe first. Note that the rest of the locator is resolved inside a single
frame, just like any other locator. If it matches elements inside multiple frames, an error is thrown.

**Usage**

Following snippet locates element with text "Submit" in the iframe with id `my-frame`, like `<iframe id="my-frame">`:

```java
Locator locator = frame.frameLocator("#my-iframe").getByText("Submit");
locator.click();
```

Following snippet locates a button, either in the frame or in one of the iframes inside it:

```java
Locator locator = frame.frameLocator().getByRole(AriaRole.BUTTON);
locator.click();
```

**Arguments**

- <a id="frame-frame-locator-option-selector"></a>`selector` `string` *(optional)*

  A selector that matches the frame element. When not specified, locator is matched in this frame or in any of the iframes inside it.

**Returns**

- `FrameLocator`


### frame.getAttribute() {#frame-get-attribute}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.getAttribute()`](/java/api/class-locator#locator-get-attribute) instead. Read more about [locators](../locators.md).
:::

Returns element attribute value.

**Arguments**

- <a id="frame-get-attribute-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-get-attribute-option-name"></a>`name` `string`

  Attribute name to get the value for.
- <a id="frame-get-attribute-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-get-attribute-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-get-attribute-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.

**Returns**

- `null | string`


### frame.getByAltText() {#frame-get-by-alt-text}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements by their alt text.

**Usage**

For example, this method will find the image by alt text "Playwright logo":

```html
<img alt='Playwright logo'>
```

```java
page.getByAltText("Playwright logo").click();
```

**Arguments**

- <a id="frame-get-by-alt-text-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="frame-get-by-alt-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-get-by-alt-text-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### frame.getByLabel() {#frame-get-by-label}

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

```java
page.getByLabel("Username").fill("john");
page.getByLabel("Password").fill("secret");
```

**Arguments**

- <a id="frame-get-by-label-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="frame-get-by-label-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-get-by-label-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### frame.getByPlaceholder() {#frame-get-by-placeholder}

<Badge type="info" text="Added in: v1.27" />

Allows locating input elements by the placeholder text.

**Usage**

For example, consider the following DOM structure.

```html
<input type="email" placeholder="name@example.com" />
```

You can fill the input after locating it by the placeholder text:

```java
page.getByPlaceholder("name@example.com").fill("playwright@microsoft.com");
```

**Arguments**

- <a id="frame-get-by-placeholder-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="frame-get-by-placeholder-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-get-by-placeholder-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### frame.getByRole() {#frame-get-by-role}

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

```java
assertThat(page
    .getByRole(AriaRole.HEADING,
               new Page.GetByRoleOptions().setName("Sign up")))
    .isVisible();

page.getByRole(AriaRole.CHECKBOX,
               new Page.GetByRoleOptions().setName("Subscribe"))
    .check();

page.getByRole(AriaRole.BUTTON,
               new Page.GetByRoleOptions().setName(
                   Pattern.compile("submit", Pattern.CASE_INSENSITIVE)))
    .click();
```

**Details**

Role selector **does not replace** accessibility audits and conformance tests, but rather gives early feedback about the ARIA guidelines.

Many html elements have an implicitly [defined role](https://w3c.github.io/html-aam/#html-element-role-mappings) that is recognized by the role selector. You can find all the [supported roles here](https://www.w3.org/TR/wai-aria-1.2/#role_definitions). ARIA guidelines **do not recommend** duplicating implicit roles and attributes by setting `role` and/or `aria-*` attributes to default values.

**Arguments**

- <a id="frame-get-by-role-option-role"></a>`role` `"alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"`

  Required aria role.
- <a id="frame-get-by-role-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-get-by-role-option-checked"></a>`checked` `boolean` *(optional)*

    An attribute that is usually set by `aria-checked` or native `<input type=checkbox>` controls.

    Learn more about [`aria-checked`](https://www.w3.org/TR/wai-aria-1.2/#aria-checked).
  - <a id="frame-get-by-role-option-description"></a>`description` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.60" />

    Option to match the [accessible description](https://w3c.github.io/accname/#dfn-accessible-description). By default, matching is case-insensitive and searches for a substring, use [`exact`](/java/api/class-frame#frame-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible description](https://w3c.github.io/accname/#dfn-accessible-description).
  - <a id="frame-get-by-role-option-disabled"></a>`disabled` `boolean` *(optional)*

    An attribute that is usually set by `aria-disabled` or `disabled`.

    ::: info
    Unlike most other attributes, `disabled` is inherited through the DOM hierarchy.
    Learn more about [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled).
    :::
  - <a id="frame-get-by-role-option-exact"></a>`exact` `boolean` *(optional)* <Badge type="info" text="Added in: v1.28" />

    Whether [`name`](/java/api/class-frame#frame-get-by-role-option-name) and [`description`](/java/api/class-frame#frame-get-by-role-option-description) are matched exactly: case-sensitive and whole-string. Defaults to false. Ignored when the value is a regular expression. Note that exact match still trims whitespace.
  - <a id="frame-get-by-role-option-expanded"></a>`expanded` `boolean` *(optional)*

    An attribute that is usually set by `aria-expanded`.

    Learn more about [`aria-expanded`](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded).
  - <a id="frame-get-by-role-option-include-hidden"></a>`includeHidden` `boolean` *(optional)*

    Option that controls whether hidden elements are matched. By default, only non-hidden elements, as [defined by ARIA](https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion), are matched by role selector.

    Learn more about [`aria-hidden`](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden).
  - <a id="frame-get-by-role-option-level"></a>`level` `int` *(optional)*

    A number attribute that is usually present for roles `heading`, `listitem`, `row`, `treeitem`, with default values for `<h1>-<h6>` elements.

    Learn more about [`aria-level`](https://www.w3.org/TR/wai-aria-1.2/#aria-level).
  - <a id="frame-get-by-role-option-name"></a>`name` `string | RegExp` *(optional)*

    Option to match the [accessible name](https://w3c.github.io/accname/#dfn-accessible-name). By default, matching is case-insensitive and searches for a substring, use [`exact`](/java/api/class-frame#frame-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
  - <a id="frame-get-by-role-option-pressed"></a>`pressed` `boolean` *(optional)*

    An attribute that is usually set by `aria-pressed`.

    Learn more about [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.2/#aria-pressed).
  - <a id="frame-get-by-role-option-selected"></a>`selected` `boolean` *(optional)*

    An attribute that is usually set by `aria-selected`.

    Learn more about [`aria-selected`](https://www.w3.org/TR/wai-aria-1.2/#aria-selected).

**Returns**

- `Locator`


### frame.getByTestId() {#frame-get-by-test-id}

<Badge type="info" text="Added in: v1.27" />

Locate element by the test id.

**Usage**

Consider the following DOM structure.

```html
<button data-testid="directions">Itinéraire</button>
```

You can locate the element by its test id:

```java
page.getByTestId("directions").click();
```

**Details**

By default, the `data-testid` attribute is used as a test id. Use [`selectors.setTestIdAttribute()`](/java/api/class-selectors#selectors-set-test-id-attribute) to configure a different test id attribute if necessary.

**Arguments**

- <a id="frame-get-by-test-id-option-test-id"></a>`testId` `string | RegExp`

  Id to locate the element by.

**Returns**

- `Locator`


### frame.getByText() {#frame-get-by-text}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements that contain given text.

See also [`locator.filter()`](/java/api/class-locator#locator-filter) that allows to match by another criteria, like an accessible role, and then filter by the text content.

**Usage**

Consider the following DOM structure:

```html
<div>Hello <span>world</span></div>
<div>Hello</div>
```

You can locate by text substring, exact string, or a regular expression:

```java
// Matches <span>
page.getByText("world");

// Matches first <div>
page.getByText("Hello world");

// Matches second <div>
page.getByText("Hello", new Page.GetByTextOptions().setExact(true));

// Matches both <div>s
page.getByText(Pattern.compile("Hello"));

// Matches second <div>
page.getByText(Pattern.compile("^hello$", Pattern.CASE_INSENSITIVE));
```

**Details**

Matching by text always normalizes whitespace, even with exact match. For example, it turns multiple spaces into one, turns line breaks into spaces and ignores leading and trailing whitespace.

Input elements of the type `button` and `submit` are matched by their `value` instead of the text content. For example, locating by text `"Log in"` matches `<input type=button value="Log in">`.

**Arguments**

- <a id="frame-get-by-text-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="frame-get-by-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-get-by-text-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### frame.getByTitle() {#frame-get-by-title}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements by their title attribute.

**Usage**

Consider the following DOM structure.

```html
<span title='Issues count'>25 issues</span>
```

You can check the issues count after locating it by the title text:

```java
assertThat(page.getByTitle("Issues count")).hasText("25 issues");
```

**Arguments**

- <a id="frame-get-by-title-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="frame-get-by-title-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-get-by-title-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### frame.hover() {#frame-hover}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.hover()`](/java/api/class-locator#locator-hover) instead. Read more about [locators](../locators.md).
:::

This method hovers over an element matching [`selector`](/java/api/class-frame#frame-hover-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/java/api/class-frame#frame-hover-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/java/api/class-frame#frame-hover-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse()`](/java/api/class-page#page-mouse) to hover over the center of the element, or the specified [`position`](/java/api/class-frame#frame-hover-option-position).

When all steps combined have not finished during the specified [`timeout`](/java/api/class-frame#frame-hover-option-timeout), this method throws a
[TimeoutError](/java/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="frame-hover-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-hover-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-hover-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="frame-hover-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="frame-hover-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)* <Badge type="info" text="Added in: v1.28" />

    This option has no effect.
  - <a id="frame-hover-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="frame-hover-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="frame-hover-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-hover-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.
  - <a id="frame-hover-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### frame.innerHTML() {#frame-inner-html}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.innerHTML()`](/java/api/class-locator#locator-inner-html) instead. Read more about [locators](../locators.md).
:::

Returns `element.innerHTML`.

**Arguments**

- <a id="frame-inner-html-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-inner-html-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-inner-html-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-inner-html-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.

**Returns**

- `string`


### frame.innerText() {#frame-inner-text}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.innerText()`](/java/api/class-locator#locator-inner-text) instead. Read more about [locators](../locators.md).
:::

Returns `element.innerText`.

**Arguments**

- <a id="frame-inner-text-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-inner-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-inner-text-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-inner-text-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.

**Returns**

- `string`


### frame.inputValue() {#frame-input-value}

<Badge type="info" text="Added in: v1.13" />

::: warning Discouraged
Use locator-based [`locator.inputValue()`](/java/api/class-locator#locator-input-value) instead. Read more about [locators](../locators.md).
:::

Returns `input.value` for the selected `<input>` or `<textarea>` or `<select>` element.

Throws for non-input elements. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), returns the value of the control.

**Arguments**

- <a id="frame-input-value-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-input-value-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-input-value-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-input-value-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.

**Returns**

- `string`


### frame.isChecked() {#frame-is-checked}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.isChecked()`](/java/api/class-locator#locator-is-checked) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is checked. Throws if the element is not a checkbox or radio input.

**Arguments**

- <a id="frame-is-checked-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-is-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-is-checked-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-is-checked-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.

**Returns**

- `boolean`


### frame.isDetached() {#frame-is-detached}

<Badge type="info" text="Added in: v1.8" />

Returns `true` if the frame has been detached, or `false` otherwise.

**Returns**

- `boolean`


### frame.isDisabled() {#frame-is-disabled}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.isDisabled()`](/java/api/class-locator#locator-is-disabled) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is disabled, the opposite of [enabled](../actionability.md#enabled).

**Arguments**

- <a id="frame-is-disabled-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-is-disabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-is-disabled-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-is-disabled-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.

**Returns**

- `boolean`


### frame.isEditable() {#frame-is-editable}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.isEditable()`](/java/api/class-locator#locator-is-editable) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [editable](../actionability.md#editable).

**Arguments**

- <a id="frame-is-editable-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-is-editable-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-is-editable-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-is-editable-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.

**Returns**

- `boolean`


### frame.isEnabled() {#frame-is-enabled}

<Badge type="info" text="Added in: v1.8" />

Returns whether the element is [enabled](../actionability.md#enabled).

**Arguments**

- <a id="frame-is-enabled-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-is-enabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-is-enabled-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-is-enabled-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.

**Returns**

- `boolean`


### frame.isHidden() {#frame-is-hidden}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.isHidden()`](/java/api/class-locator#locator-is-hidden) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is hidden, the opposite of [visible](../actionability.md#visible).  [`selector`](/java/api/class-frame#frame-is-hidden-option-selector) that does not match any elements is considered hidden.

**Arguments**

- <a id="frame-is-hidden-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-is-hidden-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-is-hidden-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-is-hidden-option-timeout"></a>`timeout` `float` *(optional)*

**Returns**

- `boolean`


### frame.isVisible() {#frame-is-visible}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.isVisible()`](/java/api/class-locator#locator-is-visible) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [visible](../actionability.md#visible). [`selector`](/java/api/class-frame#frame-is-visible-option-selector) that does not match any elements is considered not visible.

**Arguments**

- <a id="frame-is-visible-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-is-visible-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-is-visible-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-is-visible-option-timeout"></a>`timeout` `float` *(optional)*

**Returns**

- `boolean`


### frame.locator() {#frame-locator}

<Badge type="info" text="Added in: v1.14" />

The method returns an element locator that can be used to perform actions on this page / frame.
Locator is resolved to the element immediately before performing an action, so a series of actions on the same locator can in fact be performed on different DOM elements. That would happen if the DOM structure between those actions has changed.

[Learn more about locators](../locators.md).

[Learn more about locators](../locators.md).

**Arguments**

- <a id="frame-locator-option-selector"></a>`selector` `string`

  A selector to use when resolving DOM element.
- <a id="frame-locator-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-locator-option-has"></a>`has` `Locator` *(optional)*

    Narrows down the results of the method to those which contain elements matching this relative locator.
    For example, `article` that has `text=Playwright` matches `<article><div>Playwright</div></article>`.

    Inner locator **must be relative** to the outer locator and is queried starting with the outer locator match, not the document root. For example, you can find `content` that has `div` in `<article><content><div>Playwright</div></content></article>`. However, looking for `content` that has `article div` will fail, because the inner locator must be relative and should not use any elements outside the `content`.

    Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator](/java/api/class-framelocator)s.
  - <a id="frame-locator-option-has-not"></a>`hasNot` `Locator` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the outer one.
    For example, `article` that does not have `div` matches `<article><span>Playwright</span></article>`.

    Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator](/java/api/class-framelocator)s.
  - <a id="frame-locator-option-has-not-text"></a>`hasNotText` `string | RegExp` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
  - <a id="frame-locator-option-has-text"></a>`hasText` `string | RegExp` *(optional)*

    Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
    For example, `"Playwright"` matches `<article><div>Playwright</div></article>`.

**Returns**

- `Locator`


### frame.name() {#frame-name}

<Badge type="info" text="Added in: v1.8" />

Returns frame's name attribute as specified in the tag.

If the name is empty, returns the id attribute instead.

::: info
This value is calculated once when the frame is created, and will not update if the attribute is changed later.
:::

**Returns**

- `string`


### frame.navigate() {#frame-goto}

<Badge type="info" text="Added in: v1.8" />

Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the
last redirect.

The method will throw an error if:
* there's an SSL error (e.g. in case of self-signed certificates).
* target URL is invalid.
* the [`timeout`](/java/api/class-frame#frame-goto-option-timeout) is exceeded during navigation.
* the remote server does not respond or is unreachable.
* the main resource failed to load.

The method will not throw an error when any valid HTTP status code is returned by the remote server, including 404
"Not Found" and 500 "Internal Server Error".  The status code for such responses can be retrieved by calling
[`response.status()`](/java/api/class-response#response-status).

::: info
The method either throws an error or returns a main resource response. The only exceptions are navigation to
`about:blank` or navigation to the same URL with a different hash, which would succeed and return `null`.
:::

::: info
Headless mode doesn't support navigation to a PDF document. See the
[upstream issue](https://bugs.chromium.org/p/chromium/issues/detail?id=761295).
:::

**Arguments**

- <a id="frame-goto-option-url"></a>`url` `string`

  URL to navigate frame to. The url should include scheme, e.g. `https://`.
- <a id="frame-goto-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-goto-option-referer"></a>`referer` `string` *(optional)*

    Referer header value. If provided it will take preference over the referer header value set by
    [`page.setExtraHTTPHeaders()`](/java/api/class-page#page-set-extra-http-headers).
  - <a id="frame-goto-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`browserContext.setDefaultNavigationTimeout()`](/java/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/java/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.
  - <a id="frame-goto-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.

**Returns**

- `null | Response`


### frame.page() {#frame-page}

<Badge type="info" text="Added in: v1.8" />

Returns the page containing this frame.

**Returns**

- `Page`


### frame.parentFrame() {#frame-parent-frame}

<Badge type="info" text="Added in: v1.8" />

Parent frame, if any. Detached frames and main frames return `null`.

**Returns**

- `null | Frame`


### frame.press() {#frame-press}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.press()`](/java/api/class-locator#locator-press) instead. Read more about [locators](../locators.md).
:::

[`key`](/java/api/class-frame#frame-press-option-key) can specify the intended
[keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value or a single character to
generate the text for. A superset of the [`key`](/java/api/class-frame#frame-press-option-key) values can be found
[here](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:

`F1` - `F12`, `Digit0`- `Digit9`, `KeyA`- `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
`Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.

Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`, `ShiftLeft`, `ControlOrMeta`.
`ControlOrMeta` resolves to `Control` on Windows and Linux and to `Meta` on macOS.

Holding down `Shift` will type the text that corresponds to the [`key`](/java/api/class-frame#frame-press-option-key) in the upper case.

If [`key`](/java/api/class-frame#frame-press-option-key) is a single character, it is case-sensitive, so the values `a` and `A` will generate different
respective texts.

Shortcuts such as `key: "Control+o"`, `key: "Control++` or `key: "Control+Shift+T"` are supported as well. When specified with the
modifier, modifier is pressed and being held while the subsequent key is being pressed.

**Arguments**

- <a id="frame-press-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-press-option-key"></a>`key` `string`

  Name of the key to press or a character to generate, such as `ArrowLeft` or `a`.
- <a id="frame-press-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-press-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between `keydown` and `keyup` in milliseconds. Defaults to 0.
  - <a id="frame-press-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can
    opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating
    to inaccessible pages. Defaults to `false`.
  - <a id="frame-press-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-press-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.


### frame.querySelector() {#frame-query-selector}

<Badge type="info" text="Added in: v1.9" />

::: warning Discouraged
Use locator-based [`frame.locator()`](/java/api/class-frame#frame-locator) instead. Read more about [locators](../locators.md).
:::

Returns the ElementHandle pointing to the frame element.

::: warning
The use of [ElementHandle](/java/api/class-elementhandle) is discouraged, use [Locator](/java/api/class-locator) objects and web-first assertions instead.
:::

The method finds an element matching the specified selector within the frame. If no elements match the selector,
returns `null`.

**Arguments**

- <a id="frame-query-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="frame-query-selector-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-query-selector-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.

**Returns**

- `null | ElementHandle`


### frame.querySelectorAll() {#frame-query-selector-all}

<Badge type="info" text="Added in: v1.9" />

::: warning Discouraged
Use locator-based [`frame.locator()`](/java/api/class-frame#frame-locator) instead. Read more about [locators](../locators.md).
:::

Returns the ElementHandles pointing to the frame elements.

::: warning
The use of [ElementHandle](/java/api/class-elementhandle) is discouraged, use [Locator](/java/api/class-locator) objects instead.
:::

The method finds all elements matching the specified selector within the frame. If no elements match the selector,
returns empty array.

**Arguments**

- <a id="frame-query-selector-all-option-selector"></a>`selector` `string`

  A selector to query for.

**Returns**

- `Array<ElementHandle>`


### frame.selectOption() {#frame-select-option}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.selectOption()`](/java/api/class-locator#locator-select-option) instead. Read more about [locators](../locators.md).
:::

This method waits for an element matching [`selector`](/java/api/class-frame#frame-select-option-option-selector), waits for [actionability](../actionability.md) checks, waits until all specified options are present in the `<select>` element and selects these options.

If the target element is not a `<select>` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be used instead.

Returns the array of option values that have been successfully selected.

Triggers a `change` and `input` event once all the provided options have been selected.

**Usage**

```java
// Single selection matching the value or label
frame.selectOption("select#colors", "blue");
// single selection matching both the value and the label
frame.selectOption("select#colors", new SelectOption().setLabel("Blue"));
// multiple selection
frame.selectOption("select#colors", new String[] {"red", "green", "blue"});
```

**Arguments**

- <a id="frame-select-option-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="frame-select-option-option-values"></a>`values` `null | string | ElementHandle | Array<string> | Object | Array<ElementHandle> | Array<Object>`

  Options to select. If the `<select>` has the `multiple` attribute, all matching options are selected, otherwise only the
  first option matching one of the passed options is selected. String values are matching both values and labels. Option
  is considered matching if all specified properties match.

  - `value` `string` *(optional)*

    Matches by `option.value`. Optional.
  - `label` `string` *(optional)*

    Matches by `option.label`. Optional.
  - `index` `int` *(optional)*

    Matches by the index. Optional.
- <a id="frame-select-option-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-select-option-option-force"></a>`force` `boolean` *(optional)* <Badge type="info" text="Added in: v1.13" />

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="frame-select-option-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="frame-select-option-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-select-option-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Array<string>`


### frame.setChecked() {#frame-set-checked}

<Badge type="info" text="Added in: v1.15" />

::: warning Discouraged
Use locator-based [`locator.setChecked()`](/java/api/class-locator#locator-set-checked) instead. Read more about [locators](../locators.md).
:::

This method checks or unchecks an element matching [`selector`](/java/api/class-frame#frame-set-checked-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/java/api/class-frame#frame-set-checked-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Ensure that matched element is a checkbox or a radio input. If not, this method throws.
1. If the element already has the right checked state, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/java/api/class-frame#frame-set-checked-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse()`](/java/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now checked or unchecked. If not, this method throws.

When all steps combined have not finished during the specified [`timeout`](/java/api/class-frame#frame-set-checked-option-timeout), this method throws a
[TimeoutError](/java/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="frame-set-checked-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-set-checked-option-checked"></a>`checked` `boolean`

  Whether to check or uncheck the checkbox.
- <a id="frame-set-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-set-checked-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="frame-set-checked-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="frame-set-checked-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="frame-set-checked-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="frame-set-checked-option-strict"></a>`strict` `boolean` *(optional)*

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-set-checked-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.
  - <a id="frame-set-checked-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### frame.setContent() {#frame-set-content}

<Badge type="info" text="Added in: v1.8" />

This method internally calls [document.write()](https://developer.mozilla.org/en-US/docs/Web/API/Document/write), inheriting all its specific characteristics and behaviors.

**Arguments**

- <a id="frame-set-content-option-html"></a>`html` `string`

  HTML markup to assign to the page.
- <a id="frame-set-content-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-set-content-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`browserContext.setDefaultNavigationTimeout()`](/java/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/java/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.
  - <a id="frame-set-content-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.


### frame.setInputFiles() {#frame-set-input-files}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.setInputFiles()`](/java/api/class-locator#locator-set-input-files) instead. Read more about [locators](../locators.md).
:::

Sets the value of the file input to these file paths or files. If some of the `filePaths` are relative paths, then they
are resolved relative to the current working directory. For empty array, clears the selected files.

This method expects [`selector`](/java/api/class-frame#frame-set-input-files-option-selector) to point to an
[input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input). However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), targets the control instead.

**Arguments**

- <a id="frame-set-input-files-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-set-input-files-option-files"></a>`files` `path | Array<path> | Object | Array<Object>`

  - `name` `string`

    File name
  - `mimeType` `string`

    File type
  - `buffer` `Buffer`

    File content
- <a id="frame-set-input-files-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-set-input-files-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="frame-set-input-files-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-set-input-files-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.


### frame.tap() {#frame-tap}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.tap()`](/java/api/class-locator#locator-tap) instead. Read more about [locators](../locators.md).
:::

This method taps an element matching [`selector`](/java/api/class-frame#frame-tap-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/java/api/class-frame#frame-tap-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/java/api/class-frame#frame-tap-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.touchscreen()`](/java/api/class-page#page-touchscreen) to tap the center of the element, or the specified [`position`](/java/api/class-frame#frame-tap-option-position).

When all steps combined have not finished during the specified [`timeout`](/java/api/class-frame#frame-tap-option-timeout), this method throws a
[TimeoutError](/java/api/class-timeouterror). Passing zero timeout disables this.

::: info
`frame.tap()` requires that the `hasTouch` option of the browser context be set to true.
:::

**Arguments**

- <a id="frame-tap-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-tap-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-tap-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="frame-tap-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(optional)*

    Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current
    modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows
    and Linux and to "Meta" on macOS.
  - <a id="frame-tap-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="frame-tap-option-position"></a>`position` `Object` *(optional)*

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float`
    - `y` `float`
  - <a id="frame-tap-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="frame-tap-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-tap-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.
  - <a id="frame-tap-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### frame.textContent() {#frame-text-content}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.textContent()`](/java/api/class-locator#locator-text-content) instead. Read more about [locators](../locators.md).
:::

Returns `element.textContent`.

**Arguments**

- <a id="frame-text-content-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-text-content-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-text-content-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-text-content-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.

**Returns**

- `null | string`


### frame.title() {#frame-title}

<Badge type="info" text="Added in: v1.8" />

Returns the page title.

**Returns**

- `string`


### frame.uncheck() {#frame-uncheck}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`locator.uncheck()`](/java/api/class-locator#locator-uncheck) instead. Read more about [locators](../locators.md).
:::

This method checks an element matching [`selector`](/java/api/class-frame#frame-uncheck-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/java/api/class-frame#frame-uncheck-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Ensure that matched element is a checkbox or a radio input. If not, this method throws. If the element is already
   unchecked, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/java/api/class-frame#frame-uncheck-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`page.mouse()`](/java/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now unchecked. If not, this method throws.

When all steps combined have not finished during the specified [`timeout`](/java/api/class-frame#frame-uncheck-option-timeout), this method throws a
[TimeoutError](/java/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="frame-uncheck-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-uncheck-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-uncheck-option-force"></a>`force` `boolean` *(optional)*

    Whether to bypass the [actionability](../actionability.md) checks. Defaults to `false`.
  - <a id="frame-uncheck-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="frame-uncheck-option-position"></a>`position` `Object` *(optional)* <Badge type="info" text="Added in: v1.11" />

    A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the
    element.

    - `x` `float` <Badge type="info" text="Added in: v1.11" />
    - `y` `float` <Badge type="info" text="Added in: v1.11" />
  - <a id="frame-uncheck-option-scroll"></a>`scroll` `"auto" | "none"` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Controls whether Playwright scrolls the element into view before performing the action. Defaults to `"auto"`,
    which scrolls the element into view when necessary, including scrolling nested scrollable containers. When set to
    `"none"`, Playwright does not scroll the element and the action fails if the element is not already in the viewport.
    This is useful to assert that an element is reachable by the user without additional scrolling.
  - <a id="frame-uncheck-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-uncheck-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.
  - <a id="frame-uncheck-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### frame.url() {#frame-url}

<Badge type="info" text="Added in: v1.8" />

Returns frame's url.

**Returns**

- `string`


### frame.waitForFunction() {#frame-wait-for-function}

<Badge type="info" text="Added in: v1.8" />

Returns when the [`expression`](/java/api/class-frame#frame-wait-for-function-option-expression) returns a truthy value, returns that value.

**Usage**

The [`frame.waitForFunction()`](/java/api/class-frame#frame-wait-for-function) can be used to observe viewport size change:

```java
import com.microsoft.playwright.*;

public class Example {
  public static void main(String[] args) {
    try (Playwright playwright = Playwright.create()) {
      BrowserType firefox = playwright.firefox();
      Browser browser = firefox.launch();
      Page page = browser.newPage();
      page.setViewportSize(50, 50);
      page.mainFrame().waitForFunction("window.innerWidth < 100");
      browser.close();
    }
  }
}
```

To pass an argument to the predicate of `frame.waitForFunction` function:

```java
String selector = ".foo";
frame.waitForFunction("selector => !!document.querySelector(selector)", selector);
```

**Arguments**

- <a id="frame-wait-for-function-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="frame-wait-for-function-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/java/api/class-frame#frame-wait-for-function-option-expression).
- <a id="frame-wait-for-function-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-wait-for-function-option-polling-interval"></a>`pollingInterval` `float` *(optional)*

    If specified, then it is treated as an interval in milliseconds at which the function would be executed. By default if the option is not specified [`expression`](/java/api/class-frame#frame-wait-for-function-option-expression) is executed in `requestAnimationFrame` callback.
  - <a id="frame-wait-for-function-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default
    value can be changed by using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.

**Returns**

- `JSHandle`


### frame.waitForLoadState() {#frame-wait-for-load-state}

<Badge type="info" text="Added in: v1.8" />

Waits for the required load state to be reached.

This returns when the frame reaches a required load state, `load` by default. The navigation must have been committed
when this method is called. If current document has already reached the required state, resolves immediately.

::: info
Most of the time, this method is not needed because Playwright [auto-waits before every action](../actionability.md).
:::

**Usage**

```java
frame.click("button"); // Click triggers navigation.
frame.waitForLoadState(); // Waits for "load" state by default.
```

**Arguments**

- <a id="frame-wait-for-load-state-option-state"></a>`state` `"load" | "domcontentloaded" | "networkidle"` *(optional)*

  Optional load state to wait for, defaults to `load`. If the state has been already reached while loading current document, the
  method resolves immediately. Can be one of:
  * `'load'` - wait for the `load` event to be fired.
  * `'domcontentloaded'` - wait for the `DOMContentLoaded` event to be fired.
  * `'networkidle'` - **DISCOURAGED** wait until there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
- <a id="frame-wait-for-load-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-wait-for-load-state-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`browserContext.setDefaultNavigationTimeout()`](/java/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/java/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.


### frame.waitForSelector() {#frame-wait-for-selector}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use web assertions that assert visibility or a locator-based [`locator.waitFor()`](/java/api/class-locator#locator-wait-for) instead.↵Read more about [locators](../locators.md).
:::

Returns when element specified by selector satisfies [`state`](/java/api/class-frame#frame-wait-for-selector-option-state) option. Returns `null` if waiting for `hidden` or
`detached`.

::: info
Playwright automatically waits for element to be ready before performing an action. Using
[Locator](/java/api/class-locator) objects and web-first assertions make the code wait-for-selector-free.
:::

Wait for the [`selector`](/java/api/class-frame#frame-wait-for-selector-option-selector) to satisfy [`state`](/java/api/class-frame#frame-wait-for-selector-option-state) option (either appear/disappear from dom, or become
visible/hidden). If at the moment of calling the method [`selector`](/java/api/class-frame#frame-wait-for-selector-option-selector) already satisfies the condition, the method
will return immediately. If the selector doesn't satisfy the condition for the [`timeout`](/java/api/class-frame#frame-wait-for-selector-option-timeout) milliseconds, the
function will throw.

**Usage**

This method works across navigations:

```java
import com.microsoft.playwright.*;

public class Example {
  public static void main(String[] args) {
    try (Playwright playwright = Playwright.create()) {
      BrowserType chromium = playwright.chromium();
      Browser browser = chromium.launch();
      Page page = browser.newPage();
      for (String currentURL : Arrays.asList("https://google.com", "https://bbc.com")) {
        page.navigate(currentURL);
        ElementHandle element = page.mainFrame().waitForSelector("img");
        System.out.println("Loaded image: " + element.getAttribute("src"));
      }
      browser.close();
    }
  }
}
```

**Arguments**

- <a id="frame-wait-for-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="frame-wait-for-selector-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-wait-for-selector-option-state"></a>`state` `"attached" | "detached" | "visible" | "hidden"` *(optional)*

    Defaults to `'visible'`. Can be either:
    * `'attached'` - wait for element to be present in DOM.
    * `'detached'` - wait for element to not be present in DOM.
    * `'visible'` - wait for element to have non-empty bounding box and no `visibility:hidden`. Note that element without
      any content or with `display:none` has an empty bounding box and is not considered visible.
    * `'hidden'` - wait for element to be either detached from DOM, or have an empty bounding box or `visibility:hidden`.
      This is opposite to the `'visible'` option.
  - <a id="frame-wait-for-selector-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-wait-for-selector-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.

**Returns**

- `null | ElementHandle`


### frame.waitForTimeout() {#frame-wait-for-timeout}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Never wait for timeout in production. Tests that wait for time are↵inherently flaky. Use [Locator](/java/api/class-locator) actions and web assertions that wait automatically.
:::

Waits for the given [`timeout`](/java/api/class-frame#frame-wait-for-timeout-option-timeout) in milliseconds.

Note that `frame.waitForTimeout()` should only be used for debugging. Tests using the timer in production are going to
be flaky. Use signals such as network events, selectors becoming visible and others instead.

**Arguments**

- <a id="frame-wait-for-timeout-option-timeout"></a>`timeout` `float`

  A timeout to wait for


### frame.waitForURL() {#frame-wait-for-url}

<Badge type="info" text="Added in: v1.11" />

Waits for the frame to navigate to the given URL.

**Usage**

```java
frame.click("a.delayed-navigation"); // Clicking the link will indirectly cause a navigation
frame.waitForURL("**/target.html");
```

**Arguments**

- <a id="frame-wait-for-url-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  A glob pattern, regex pattern, or predicate receiving [URL] to match while waiting for the navigation. Note that if
  the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly
  equal to the string.
- <a id="frame-wait-for-url-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-wait-for-url-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`browserContext.setDefaultNavigationTimeout()`](/java/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/java/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.
  - <a id="frame-wait-for-url-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.


## Properties

### frame.webmcp() {#frame-webmcp}

<Badge type="info" text="Added in: v1.64" />

Tools that the frame registers through the experimental [WebMCP](https://webmachinelearning.github.io/webmcp/) browser API. See [WebMCP](/java/api/class-webmcp) for details.

**Type**

- `WebMCP`


## Deprecated

### frame.type() {#frame-type}

<Badge type="info" text="Added in: v1.8" />

::: danger Deprecated
In most cases, you should use [`locator.fill()`](/java/api/class-locator#locator-fill) instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use [`locator.pressSequentially()`](/java/api/class-locator#locator-press-sequentially).
:::

Sends a `keydown`, `keypress`/`input`, and `keyup` event for each character in the text. `frame.type` can be used to
send fine-grained keyboard events. To fill values in form fields, use [`frame.fill()`](/java/api/class-frame#frame-fill).

To press a special key, like `Control` or `ArrowDown`, use [`keyboard.press()`](/java/api/class-keyboard#keyboard-press).

**Usage**

**Arguments**

- <a id="frame-type-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="frame-type-option-text"></a>`text` `string`

  A text to type into a focused element.
- <a id="frame-type-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-type-option-delay"></a>`delay` `float` *(optional)*

    Time to wait between key presses in milliseconds. Defaults to 0.
  - <a id="frame-type-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)*

    This option has no effect.
  - <a id="frame-type-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="frame-type-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.


### frame.waitForNavigation() {#frame-wait-for-navigation}

<Badge type="info" text="Added in: v1.8" />

::: danger Deprecated
This method is inherently racy, please use [`frame.waitForURL()`](/java/api/class-frame#frame-wait-for-url) instead.
:::

Waits for the frame navigation and returns the main resource response. In case of multiple redirects, the navigation
will resolve with the response of the last redirect. In case of navigation to a different anchor or navigation due to
History API usage, the navigation will resolve with `null`.

**Usage**

This method waits for the frame to navigate to a new URL. It is useful for when you run code which will indirectly cause
the frame to navigate. Consider this example:

```java
// The method returns after navigation has finished
frame.waitForNavigation(() -> {
  // Clicking the link will indirectly cause a navigation
  frame.click("a.delayed-navigation");
});
```

::: info
Usage of the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) to change the URL is considered
a navigation.
:::

**Arguments**

- <a id="frame-wait-for-navigation-option-options"></a>`options` `Object` *(optional)*

  - <a id="frame-wait-for-navigation-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`browserContext.setDefaultNavigationTimeout()`](/java/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout),
    [`page.setDefaultNavigationTimeout()`](/java/api/class-page#page-set-default-navigation-timeout) or
    [`page.setDefaultTimeout()`](/java/api/class-page#page-set-default-timeout) methods.
  - <a id="frame-wait-for-navigation-option-url"></a>`url` `string | RegExp | function(URL): boolean` *(optional)*

    A glob pattern, regex pattern, or predicate receiving [URL] to match while waiting for the navigation. Note that if
    the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly
    equal to the string.
  - <a id="frame-wait-for-navigation-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.
- <a id="frame-wait-for-navigation-option-callback"></a>`callback` `Runnable` <Badge type="info" text="Added in: v1.9" />

  Callback that performs the action triggering the event.

**Returns**

- `null | Response`

