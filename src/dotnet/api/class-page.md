---
title: Page
outline: 2
---

# Page

<Badge type="info" text="Added in: v1.8" />

Page provides methods to interact with a single tab in a [Browser](/dotnet/api/class-browser), or an
[extension background page](https://developer.chrome.com/extensions/background_pages) in Chromium. One [Browser](/dotnet/api/class-browser)
instance might have multiple [Page](/dotnet/api/class-page) instances.

This example creates a page, navigates it to a URL, and then saves a screenshot:

```csharp
using Microsoft.Playwright;
using System.Threading.Tasks;

class PageExamples
{
    public static async Task Run()
    {
        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Webkit.LaunchAsync();
        var page = await browser.NewPageAsync();
        await page.GotoAsync("https://www.theverge.com");
        await page.ScreenshotAsync(new() { Path = "theverge.png" });
    }
}
```

The Page class emits various events (described below) which can be handled using any of Node's native
[`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) methods, such as `on`, `once` or
`removeListener`.

This example logs a message for a single page `load` event:

```csharp
page.Load += (_, _) => Console.WriteLine("Page loaded!");
```

To unsubscribe from events use the `removeListener` method:

```csharp
void PageLoadHandler(object _, IPage p) {
    Console.WriteLine("Page loaded!");
};

page.Load += PageLoadHandler;
// Do some work...
page.Load -= PageLoadHandler;
```

## Methods

### Page.AddInitScriptAsync() {#page-add-init-script}

<Badge type="info" text="Added in: v1.8" />

Adds a script which would be evaluated in one of the following scenarios:
* Whenever the page is navigated.
* Whenever the child frame is attached or navigated. In this case, the script is evaluated in the context of the newly
  attached frame.

The script is evaluated after the document was created but before any of its scripts were run. This is useful to amend
the JavaScript environment, e.g. to seed `Math.random`.

**Usage**

An example of overriding `Math.random` before the page loads:

```csharp
await Page.AddInitScriptAsync(scriptPath: "./preload.js");
```

::: info
The order of evaluation of multiple scripts installed via [`BrowserContext.AddInitScriptAsync()`](/dotnet/api/class-browsercontext#browser-context-add-init-script) and
[`Page.AddInitScriptAsync()`](/dotnet/api/class-page#page-add-init-script) is not defined.
:::

**Arguments**

- <a id="page-add-init-script-option-script"></a>`script` `string | path`

  Script to be evaluated in all pages in the browser context.

**Returns**

- `Disposable`


### Page.AddLocatorHandlerAsync() {#page-add-locator-handler}

<Badge type="info" text="Added in: v1.42" />

When testing a web page, sometimes unexpected overlays like a "Sign up" dialog appear and block actions you want to automate, e.g. clicking a button. These overlays don't always show up in the same way or at the same time, making them tricky to handle in automated tests.

This method lets you set up a special function, called a handler, that activates when it detects that overlay is visible. The handler's job is to remove the overlay, allowing your test to continue as if the overlay wasn't there.

Things to keep in mind:
* When an overlay is shown predictably, we recommend explicitly waiting for it in your test and dismissing it as a part of your normal test flow, instead of using [`Page.AddLocatorHandlerAsync()`](/dotnet/api/class-page#page-add-locator-handler).
* Playwright checks for the overlay every time before executing or retrying an action that requires an [actionability check](../actionability.md), or before performing an auto-waiting assertion check. When overlay is visible, Playwright calls the handler first, and then proceeds with the action/assertion. Note that the handler is only called when you perform an action/assertion - if the overlay becomes visible but you don't perform any actions, the handler will not be triggered.
* After executing the handler, Playwright will ensure that overlay that triggered the handler is not visible anymore. You can opt-out of this behavior with [`noWaitAfter`](/dotnet/api/class-page#page-add-locator-handler-option-no-wait-after).
* The execution time of the handler counts towards the timeout of the action/assertion that executed the handler. If your handler takes too long, it might cause timeouts.
* You can register multiple handlers. However, only a single handler will be running at a time. Make sure the actions within a handler don't depend on another handler.

::: warning
Running the handler will alter your page state mid-test. For example it will change the currently focused element and move the mouse. Make sure that actions that run after the handler are self-contained and do not rely on the focus and mouse state being unchanged.

For example, consider a test that calls [`Locator.FocusAsync()`](/dotnet/api/class-locator#locator-focus) followed by [`Keyboard.PressAsync()`](/dotnet/api/class-keyboard#keyboard-press). If your handler clicks a button between these two actions, the focused element most likely will be wrong, and key press will happen on the unexpected element. Use [`Locator.PressAsync()`](/dotnet/api/class-locator#locator-press) instead to avoid this problem.

Another example is a series of mouse actions, where [`Mouse.MoveAsync()`](/dotnet/api/class-mouse#mouse-move) is followed by [`Mouse.DownAsync()`](/dotnet/api/class-mouse#mouse-down). Again, when the handler runs between these two actions, the mouse position will be wrong during the mouse down. Prefer self-contained actions like [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) that do not rely on the state being unchanged by a handler.
:::

**Usage**

An example that closes a "Sign up to the newsletter" dialog when it appears:

```csharp
// Setup the handler.
await page.AddLocatorHandlerAsync(page.GetByText("Sign up to the newsletter"), async () => {
  await page.GetByRole(AriaRole.Button, new() { Name = "No thanks" }).ClickAsync();
});

// Write the test as usual.
await page.GotoAsync("https://example.com");
await page.GetByRole("button", new() { Name = "Start here" }).ClickAsync();
```

An example that skips the "Confirm your security details" page when it is shown:

```csharp
// Setup the handler.
await page.AddLocatorHandlerAsync(page.GetByText("Confirm your security details"), async () => {
  await page.GetByRole(AriaRole.Button, new() { Name = "Remind me later" }).ClickAsync();
});

// Write the test as usual.
await page.GotoAsync("https://example.com");
await page.GetByRole("button", new() { Name = "Start here" }).ClickAsync();
```

An example with a custom callback on every actionability check. It uses a `<body>` locator that is always visible, so the handler is called before every actionability check. It is important to specify [`noWaitAfter`](/dotnet/api/class-page#page-add-locator-handler-option-no-wait-after), because the handler does not hide the `<body>` element.

```csharp
// Setup the handler.
await page.AddLocatorHandlerAsync(page.Locator("body"), async () => {
  await page.EvaluateAsync("window.removeObstructionsForTestIfNeeded()");
}, new() { NoWaitAfter = true });

// Write the test as usual.
await page.GotoAsync("https://example.com");
await page.GetByRole("button", new() { Name = "Start here" }).ClickAsync();
```

Handler takes the original locator as an argument. You can also automatically remove the handler after a number of invocations by setting [`times`](/dotnet/api/class-page#page-add-locator-handler-option-times):

```csharp
await page.AddLocatorHandlerAsync(page.GetByText("Sign up to the newsletter"), async locator => {
  await locator.ClickAsync();
}, new() { Times = 1 });
```

**Arguments**

- <a id="page-add-locator-handler-option-locator"></a>`locator` `Locator`

  Locator that triggers the handler.
- <a id="page-add-locator-handler-option-handler"></a>`handler` `function(Locator): Promise<any>`

  Function that should be run once [`locator`](/dotnet/api/class-page#page-add-locator-handler-option-locator) appears. This function should get rid of the element that blocks actions like click.
- <a id="page-add-locator-handler-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-add-locator-handler-option-no-wait-after"></a>`noWaitAfter` `boolean` *(optional)* <Badge type="info" text="Added in: v1.44" />

    By default, after calling the handler Playwright will wait until the overlay becomes hidden, and only then Playwright will continue with the action/assertion that triggered the handler. This option allows to opt-out of this behavior, so that overlay can stay visible after the handler has run.
  - <a id="page-add-locator-handler-option-times"></a>`times` `int` *(optional)* <Badge type="info" text="Added in: v1.44" />

    Specifies the maximum number of times this handler should be called. Unlimited by default.


### Page.AddScriptTagAsync() {#page-add-script-tag}

<Badge type="info" text="Added in: v1.8" />

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

- `ElementHandle`


### Page.AddStyleTagAsync() {#page-add-style-tag}

<Badge type="info" text="Added in: v1.8" />

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

- `ElementHandle`


### Page.AriaSnapshotAsync() {#page-aria-snapshot}

<Badge type="info" text="Added in: v1.59" />

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
  - <a id="page-aria-snapshot-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `string`


### Page.BringToFrontAsync() {#page-bring-to-front}

<Badge type="info" text="Added in: v1.8" />

Brings page to front (activates tab).


### Page.CancelPickLocatorAsync() {#page-cancel-pick-locator}

<Badge type="info" text="Added in: v1.59" />

Cancels an ongoing [`Page.PickLocatorAsync()`](/dotnet/api/class-page#page-pick-locator) call by deactivating pick locator mode.
If no pick locator mode is active, this method is a no-op.


### Page.CheckAsync() {#page-check}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.CheckAsync()`](/dotnet/api/class-locator#locator-check) instead. Read more about [locators](../locators.md).
:::

This method checks an element matching [`selector`](/dotnet/api/class-page#page-check-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/dotnet/api/class-page#page-check-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Ensure that matched element is a checkbox or a radio input. If not, this method throws. If the element is already
   checked, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/dotnet/api/class-page#page-check-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`Page.Mouse`](/dotnet/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now checked. If not, this method throws.

When all steps combined have not finished during the specified [`timeout`](/dotnet/api/class-page#page-check-option-timeout), this method throws a
[TimeoutError](/dotnet/api/class-timeouterror). Passing zero timeout disables this.

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
  - <a id="page-check-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-check-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-check-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### Page.ClearConsoleMessagesAsync() {#page-clear-console-messages}

<Badge type="info" text="Added in: v1.59" />

Clears all stored console messages from this page. Subsequent calls to [`Page.ConsoleMessagesAsync()`](/dotnet/api/class-page#page-console-messages) will only return messages logged after the clear.


### Page.ClearPageErrorsAsync() {#page-clear-page-errors}

<Badge type="info" text="Added in: v1.59" />

Clears all stored page errors from this page. Subsequent calls to [`Page.PageErrorsAsync()`](/dotnet/api/class-page#page-page-errors) will only return errors thrown after the clear.


### Page.ClickAsync() {#page-click}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) instead. Read more about [locators](../locators.md).
:::

This method clicks an element matching [`selector`](/dotnet/api/class-page#page-click-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/dotnet/api/class-page#page-click-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/dotnet/api/class-page#page-click-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`Page.Mouse`](/dotnet/api/class-page#page-mouse) to click in the center of the element, or the specified [`position`](/dotnet/api/class-page#page-click-option-position).
1. Wait for initiated navigations to either succeed or fail, unless [`noWaitAfter`](/dotnet/api/class-page#page-click-option-no-wait-after) option is set.

When all steps combined have not finished during the specified [`timeout`](/dotnet/api/class-page#page-click-option-timeout), this method throws a
[TimeoutError](/dotnet/api/class-timeouterror). Passing zero timeout disables this.

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
  - <a id="page-click-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-click-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-click-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### Page.CloseAsync() {#page-close}

<Badge type="info" text="Added in: v1.8" />

If [`runBeforeUnload`](/dotnet/api/class-page#page-close-option-run-before-unload) is `false`, does not run any unload handlers and waits for the page to be closed. If
[`runBeforeUnload`](/dotnet/api/class-page#page-close-option-run-before-unload) is `true` the method will run unload handlers, but will **not** wait for the page to close.

By default, `page.close()` **does not** run `beforeunload` handlers.

::: info
if [`runBeforeUnload`](/dotnet/api/class-page#page-close-option-run-before-unload) is passed as true, a `beforeunload` dialog might be summoned and should be handled
manually via [`Page.Dialog`](/dotnet/api/class-page#page-event-dialog) event.
:::

**Arguments**

- <a id="page-close-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-close-option-reason"></a>`reason` `string` *(optional)* <Badge type="info" text="Added in: v1.40" />

    The reason to be reported to the operations interrupted by the page closure.
  - <a id="page-close-option-run-before-unload"></a>`runBeforeUnload` `boolean` *(optional)*

    Defaults to `false`. Whether to run the
    [before unload](https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload) page handlers.


### Page.ConsoleMessagesAsync() {#page-console-messages}

<Badge type="info" text="Added in: v1.56" />

Returns up to (currently) 200 last console messages from this page. See [`Page.Console`](/dotnet/api/class-page#page-event-console) for more details.

**Arguments**

- <a id="page-console-messages-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-console-messages-option-filter"></a>`filter` `"all" | "since-navigation"` *(optional)* <Badge type="info" text="Added in: v1.59" />

    Controls which messages are returned:

**Returns**

- `Array<ConsoleMessage>`


### Page.ContentAsync() {#page-content}

<Badge type="info" text="Added in: v1.8" />

Gets the full HTML contents of the page, including the doctype.

**Arguments**

- <a id="page-content-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-content-option-include-shadow"></a>`includeShadow` `boolean` *(optional)* <Badge type="info" text="Added in: v1.64" />

    When true, contents of open shadow roots are included as [declarative shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html),
    i.e. `<template shadowrootmode="open">` elements nested inside their host elements. Closed shadow roots are never included. Defaults to `false`.

**Returns**

- `string`


### Page.Context() {#page-context}

<Badge type="info" text="Added in: v1.8" />

Get the browser context that the page belongs to.

**Returns**

- `BrowserContext`


### Page.DblClickAsyncAsync() {#page-dblclick}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.DblClickAsyncAsync()`](/dotnet/api/class-locator#locator-dblclick) instead. Read more about [locators](../locators.md).
:::

This method double clicks an element matching [`selector`](/dotnet/api/class-page#page-dblclick-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/dotnet/api/class-page#page-dblclick-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/dotnet/api/class-page#page-dblclick-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`Page.Mouse`](/dotnet/api/class-page#page-mouse) to double click in the center of the element, or the specified [`position`](/dotnet/api/class-page#page-dblclick-option-position).

When all steps combined have not finished during the specified [`timeout`](/dotnet/api/class-page#page-dblclick-option-timeout), this method throws a
[TimeoutError](/dotnet/api/class-timeouterror). Passing zero timeout disables this.

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
  - <a id="page-dblclick-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-dblclick-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-dblclick-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### Page.DispatchEventAsync() {#page-dispatch-event}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.DispatchEventAsync()`](/dotnet/api/class-locator#locator-dispatch-event) instead. Read more about [locators](../locators.md).
:::

The snippet below dispatches the `click` event on the element. Regardless of the visibility state of the element, `click`
is dispatched. This is equivalent to calling
[element.click()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click).

**Usage**

```csharp
await page.DispatchEventAsync("button#submit", "click");
```

Under the hood, it creates an instance of an event based on the given [`type`](/dotnet/api/class-page#page-dispatch-event-option-type), initializes it with
[`eventInit`](/dotnet/api/class-page#page-dispatch-event-option-event-init) properties and dispatches it on the element. Events are `composed`, `cancelable` and bubble by
default.

Since [`eventInit`](/dotnet/api/class-page#page-dispatch-event-option-event-init) is event-specific, please refer to the events documentation for the lists of initial
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

```csharp
var dataTransfer = await page.EvaluateHandleAsync("() => new DataTransfer()");
await page.DispatchEventAsync("#source", "dragstart", new { dataTransfer });
```

**Arguments**

- <a id="page-dispatch-event-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-dispatch-event-option-type"></a>`type` `string`

  DOM event type: `"click"`, `"dragstart"`, etc.
- <a id="page-dispatch-event-option-event-init"></a>`eventInit` `EvaluationArgument` *(optional)*

  Optional event-specific initialization properties.
- <a id="page-dispatch-event-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-dispatch-event-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-dispatch-event-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.


### Page.DragAndDropAsync() {#page-drag-and-drop}

<Badge type="info" text="Added in: v1.13" />

This method drags the source element to the target element.
It will first move to the source element, perform a `mousedown`,
then move to the target element and perform a `mouseup`.

**Usage**

```csharp
await Page.DragAndDropAsync("#source", "#target");
// or specify exact positions relative to the top-left corners of the elements:
await Page.DragAndDropAsync("#source", "#target", new()
{
    SourcePosition = new() { X = 34, Y = 7 },
    TargetPosition = new() { X = 10, Y = 20 },
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

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-drag-and-drop-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### Page.EmulateMediaAsync() {#page-emulate-media}

<Badge type="info" text="Added in: v1.8" />

This method changes the `CSS media type` through the `media` argument, and/or the `'prefers-colors-scheme'` media feature, using the `colorScheme` argument.

**Usage**

```csharp
await page.EvaluateAsync("() => matchMedia('screen').matches");
// → true
await page.EvaluateAsync("() => matchMedia('print').matches");
// → false

await page.EmulateMediaAsync(new() { Media = Media.Print });
await page.EvaluateAsync("() => matchMedia('screen').matches");
// → false
await page.EvaluateAsync("() => matchMedia('print').matches");
// → true

await page.EmulateMediaAsync(new() { Media = Media.Screen });
await page.EvaluateAsync("() => matchMedia('screen').matches");
// → true
await page.EvaluateAsync("() => matchMedia('print').matches");
// → false
```

```csharp
await page.EmulateMediaAsync(new() { ColorScheme = ColorScheme.Dark });
await page.EvaluateAsync("matchMedia('(prefers-color-scheme: dark)').matches");
// → true
await page.EvaluateAsync("matchMedia('(prefers-color-scheme: light)').matches");
// → false
```

**Arguments**

- <a id="page-emulate-media-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-emulate-media-option-color-scheme"></a>`colorScheme` `"light" | "dark" | "no-preference" | "null"` *(optional)* <Badge type="info" text="Added in: v1.9" />

    Emulates [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media feature, supported values are `'light'` and `'dark'`. Passing
    `'Null'` disables color scheme emulation. `'no-preference'` is deprecated.
  - <a id="page-emulate-media-option-contrast"></a>`contrast` `"no-preference" | "more" | "null"` *(optional)* <Badge type="info" text="Added in: v1.51" />
  - <a id="page-emulate-media-option-forced-colors"></a>`forcedColors` `"active" | "none" | "null"` *(optional)* <Badge type="info" text="Added in: v1.15" />
  - <a id="page-emulate-media-option-media"></a>`media` `"screen" | "print" | "null"` *(optional)* <Badge type="info" text="Added in: v1.9" />

    Changes the CSS media type of the page. The only allowed values are `'Screen'`, `'Print'` and `'Null'`.
    Passing `'Null'` disables CSS media emulation.
  - <a id="page-emulate-media-option-reduced-motion"></a>`reducedMotion` `"reduce" | "no-preference" | "null"` *(optional)* <Badge type="info" text="Added in: v1.12" />

    Emulates `'prefers-reduced-motion'` media feature, supported values are `'reduce'`, `'no-preference'`. Passing `null` disables reduced motion emulation.


### Page.EvalOnSelectorAsync() {#page-eval-on-selector}

<Badge type="info" text="Added in: v1.9" />

::: warning Discouraged
This method does not wait for the element to pass actionability↵checks and therefore can lead to the flaky tests. Use [`Locator.EvaluateAsync()`](/dotnet/api/class-locator#locator-evaluate),↵other [Locator](/dotnet/api/class-locator) helper methods or web-first assertions instead.
:::

The method finds an element matching the specified selector within the page and passes it as a first argument to
[`expression`](/dotnet/api/class-page#page-eval-on-selector-option-expression). If no elements match the selector, the method throws an error. Returns the value of
[`expression`](/dotnet/api/class-page#page-eval-on-selector-option-expression).

If [`expression`](/dotnet/api/class-page#page-eval-on-selector-option-expression) returns a [Promise], then [`Page.EvalOnSelectorAsync()`](/dotnet/api/class-page#page-eval-on-selector) would wait for the promise to resolve and
return its value.

**Usage**

```csharp
var searchValue = await page.EvalOnSelectorAsync<string>("#search", "el => el.value");
var preloadHref = await page.EvalOnSelectorAsync<string>("link[rel=preload]", "el => el.href");
var html = await page.EvalOnSelectorAsync(".main-container", "(e, suffix) => e.outerHTML + suffix", "hello");
```

**Arguments**

- <a id="page-eval-on-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="page-eval-on-selector-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="page-eval-on-selector-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/dotnet/api/class-page#page-eval-on-selector-option-expression).
- <a id="page-eval-on-selector-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-eval-on-selector-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.

**Returns**

- `Serializable`


### Page.EvalOnSelectorAllAsync() {#page-eval-on-selector-all}

<Badge type="info" text="Added in: v1.9" />

::: warning Discouraged
In most cases, [`Locator.EvaluateAllAsync()`](/dotnet/api/class-locator#locator-evaluate-all),↵other [Locator](/dotnet/api/class-locator) helper methods and web-first assertions do a better job.
:::

The method finds all elements matching the specified selector within the page and passes an array of matched elements as
a first argument to [`expression`](/dotnet/api/class-page#page-eval-on-selector-all-option-expression). Returns the result of [`expression`](/dotnet/api/class-page#page-eval-on-selector-all-option-expression) invocation.

If [`expression`](/dotnet/api/class-page#page-eval-on-selector-all-option-expression) returns a [Promise], then [`Page.EvalOnSelectorAllAsync()`](/dotnet/api/class-page#page-eval-on-selector-all) would wait for the promise to resolve and
return its value.

**Usage**

```csharp
var divsCount = await page.EvalOnSelectorAllAsync<bool>("div", "(divs, min) => divs.length >= min", 10);
```

**Arguments**

- <a id="page-eval-on-selector-all-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="page-eval-on-selector-all-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="page-eval-on-selector-all-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/dotnet/api/class-page#page-eval-on-selector-all-option-expression).

**Returns**

- `Serializable`


### Page.EvaluateAsync() {#page-evaluate}

<Badge type="info" text="Added in: v1.8" />

Returns the value of the [`expression`](/dotnet/api/class-page#page-evaluate-option-expression) invocation.

If the function passed to the [`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) returns a [Promise], then [`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) would wait
for the promise to resolve and return its value.

If the function passed to the [`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) returns a non-[Serializable] value, then
[`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) resolves to `undefined`. Playwright also supports transferring some
additional values that are not serializable by `JSON`: `-0`, `NaN`, `Infinity`, `-Infinity`.

**Usage**

Passing argument to [`expression`](/dotnet/api/class-page#page-evaluate-option-expression):

```csharp
var result = await page.EvaluateAsync<int>("([x, y]) => Promise.resolve(x * y)", new[] { 7, 8 });
Console.WriteLine(result);
```

A string can also be passed in instead of a function:

```csharp
Console.WriteLine(await page.EvaluateAsync<int>("1 + 2")); // prints "3"
```

[ElementHandle](/dotnet/api/class-elementhandle) instances can be passed as an argument to the [`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate):

```csharp
var bodyHandle = await page.EvaluateHandleAsync("document.body");
var html = await page.EvaluateAsync<string>("([body, suffix]) => body.innerHTML + suffix", new object [] { bodyHandle, "hello" });
await bodyHandle.DisposeAsync();
```

**Arguments**

- <a id="page-evaluate-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="page-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/dotnet/api/class-page#page-evaluate-option-expression).

**Returns**

- `Serializable`


### Page.EvaluateHandleAsync() {#page-evaluate-handle}

<Badge type="info" text="Added in: v1.8" />

Returns the value of the [`expression`](/dotnet/api/class-page#page-evaluate-handle-option-expression) invocation as a [JSHandle](/dotnet/api/class-jshandle).

The only difference between [`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) and [`Page.EvaluateHandleAsync()`](/dotnet/api/class-page#page-evaluate-handle) is that [`Page.EvaluateHandleAsync()`](/dotnet/api/class-page#page-evaluate-handle) returns [JSHandle](/dotnet/api/class-jshandle).

If the function passed to the [`Page.EvaluateHandleAsync()`](/dotnet/api/class-page#page-evaluate-handle) returns a [Promise], then [`Page.EvaluateHandleAsync()`](/dotnet/api/class-page#page-evaluate-handle) would wait for the
promise to resolve and return its value.

**Usage**

```csharp
// Handle for the window object.
var aWindowHandle = await page.EvaluateHandleAsync("() => Promise.resolve(window)");
```

A string can also be passed in instead of a function:

```csharp
var docHandle = await page.EvaluateHandleAsync("document"); // Handle for the `document`
```

[JSHandle](/dotnet/api/class-jshandle) instances can be passed as an argument to the [`Page.EvaluateHandleAsync()`](/dotnet/api/class-page#page-evaluate-handle):

```csharp
var handle = await page.EvaluateHandleAsync("() => document.body");
var resultHandle = await page.EvaluateHandleAsync("([body, suffix]) => body.innerHTML + suffix", new object[] { handle, "hello" });
Console.WriteLine(await resultHandle.JsonValueAsync<string>());
await resultHandle.DisposeAsync();
```

**Arguments**

- <a id="page-evaluate-handle-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="page-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/dotnet/api/class-page#page-evaluate-handle-option-expression).

**Returns**

- `JSHandle`


### Page.ExposeBindingAsync() {#page-expose-binding}

<Badge type="info" text="Added in: v1.8" />

The method adds a function called [`name`](/dotnet/api/class-page#page-expose-binding-option-name) on the `window` object of every frame in this page. When called, the
function executes [`callback`](/dotnet/api/class-page#page-expose-binding-option-callback) and returns a [Promise] which resolves to the return value of [`callback`](/dotnet/api/class-page#page-expose-binding-option-callback).
If the [`callback`](/dotnet/api/class-page#page-expose-binding-option-callback) returns a [Promise], it will be awaited.

The first argument of the [`callback`](/dotnet/api/class-page#page-expose-binding-option-callback) function contains information about the caller: `{ browserContext:
BrowserContext, page: Page, frame: Frame }`.

See [`BrowserContext.ExposeBindingAsync()`](/dotnet/api/class-browsercontext#browser-context-expose-binding) for the context-wide version.

::: info
Functions installed via [`Page.ExposeBindingAsync()`](/dotnet/api/class-page#page-expose-binding) survive navigations.
:::

**Usage**

An example of exposing page URL to all frames in a page:

```csharp
using Microsoft.Playwright;
using System.Threading.Tasks;

class PageExamples
{
    public static async Task Main()
    {
        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Webkit.LaunchAsync(new()
        {
            Headless = false,
        });
        var page = await browser.NewPageAsync();

        await page.ExposeBindingAsync("pageUrl", (source) => source.Page.Url);
        await page.SetContentAsync("<script>\n" +
        "  async function onClick() {\n" +
        "    document.querySelector('div').textContent = await window.pageURL();\n" +
        "  }\n" +
        "</script>\n" +
        "<button onclick=\"onClick()\">Click me</button>\n" +
        "<div></div>");

        await page.ClickAsync("button");
    }
}
```

**Arguments**

- <a id="page-expose-binding-option-name"></a>`name` `string`

  Name of the function on the window object.
- <a id="page-expose-binding-option-callback"></a>`callback` `function()`

  Callback function that will be called in the Playwright's context.

**Returns**

- `Disposable`


### Page.ExposeFunctionAsync() {#page-expose-function}

<Badge type="info" text="Added in: v1.8" />

The method adds a function called [`name`](/dotnet/api/class-page#page-expose-function-option-name) on the `window` object of every frame in the page. When called, the
function executes [`callback`](/dotnet/api/class-page#page-expose-function-option-callback) and returns a [Promise] which resolves to the return value of [`callback`](/dotnet/api/class-page#page-expose-function-option-callback).

If the [`callback`](/dotnet/api/class-page#page-expose-function-option-callback) returns a [Promise], it will be awaited.

See [`BrowserContext.ExposeFunctionAsync()`](/dotnet/api/class-browsercontext#browser-context-expose-function) for context-wide exposed function.

::: info
Functions installed via [`Page.ExposeFunctionAsync()`](/dotnet/api/class-page#page-expose-function) survive navigations.
:::

**Usage**

An example of adding a `sha256` function to the page:

```csharp
using Microsoft.Playwright;
using System;
using System.Security.Cryptography;
using System.Threading.Tasks;

class PageExamples
{
    public static async Task Main()
    {
        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Webkit.LaunchAsync(new()
        {
            Headless = false
        });
        var page = await browser.NewPageAsync();

        await page.ExposeFunctionAsync("sha256", (string input) =>
        {
            return Convert.ToBase64String(
                SHA256.Create().ComputeHash(System.Text.Encoding.UTF8.GetBytes(input)));
        });

        await page.SetContentAsync("<script>\n" +
        "  async function onClick() {\n" +
        "    document.querySelector('div').textContent = await window.sha256('PLAYWRIGHT');\n" +
        "  }\n" +
        "</script>\n" +
        "<button onclick=\"onClick()\">Click me</button>\n" +
        "<div></div>");

        await page.ClickAsync("button");
        Console.WriteLine(await page.TextContentAsync("div"));
    }
}
```

**Arguments**

- <a id="page-expose-function-option-name"></a>`name` `string`

  Name of the function on the window object
- <a id="page-expose-function-option-callback"></a>`callback` `function()`

  Callback function which will be called in Playwright's context.

**Returns**

- `Disposable`


### Page.FillAsync() {#page-fill}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill) instead. Read more about [locators](../locators.md).
:::

This method waits for an element matching [`selector`](/dotnet/api/class-page#page-fill-option-selector), waits for [actionability](../actionability.md) checks, focuses the element, fills it and triggers an `input` event after filling. Note that you can pass an empty string to clear the input field.

If the target element is not an `<input>`, `<textarea>` or `[contenteditable]` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be filled instead.

To send fine-grained keyboard events, use [`Locator.PressSequentiallyAsync()`](/dotnet/api/class-locator#locator-press-sequentially).

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
  - <a id="page-fill-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-fill-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.


### Page.FocusAsync() {#page-focus}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.FocusAsync()`](/dotnet/api/class-locator#locator-focus) instead. Read more about [locators](../locators.md).
:::

This method fetches an element with [`selector`](/dotnet/api/class-page#page-focus-option-selector) and focuses it. If there's no element matching
[`selector`](/dotnet/api/class-page#page-focus-option-selector), the method waits until a matching element appears in the DOM.

**Arguments**

- <a id="page-focus-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-focus-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-focus-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-focus-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.


### Page.Frame() {#page-frame}

<Badge type="info" text="Added in: v1.8" />

Returns frame matching the specified criteria. Either `name` or `url` must be specified.

**Usage**

```csharp
var frame = page.Frame("frame-name");
```

```csharp
var frame = page.FrameByUrl(".*domain.*");
```

**Arguments**

- <a id="page-frame-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.9" />

  Frame name specified in the `iframe`'s `name` attribute.

**Returns**

- `null | Frame`


### Page.FrameByUrl() {#page-frame-by-url}

<Badge type="info" text="Added in: v1.9" />

Returns frame with matching URL.

**Arguments**

- <a id="page-frame-by-url-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  A glob pattern, regex pattern or predicate receiving frame's `url` as a [URL] object.

**Returns**

- `null | Frame`


### Page.FrameLocator() {#page-frame-locator}

<Badge type="info" text="Added in: v1.17" />

When working with iframes, you can create a frame locator that will enter the iframe and allow selecting elements
in that iframe.

When called without [`selector`](/dotnet/api/class-page#page-frame-locator-option-selector), the search starts in any frame on the page - the main frame or any of
the iframes - so that you don't need to locate each iframe first. Note that the rest of the locator is resolved
inside a single frame, just like any other locator. If it matches elements inside multiple frames, an error is thrown.

**Usage**

Following snippet locates element with text "Submit" in the iframe with id `my-frame`,
like `<iframe id="my-frame">`:

```csharp
var locator = page.FrameLocator("#my-iframe").GetByText("Submit");
await locator.ClickAsync();
```

Following snippet locates a button, either in the main frame or in one of the iframes:

```csharp
var locator = page.FrameLocator().GetByRole(AriaRole.Button);
await locator.ClickAsync();
```

**Arguments**

- <a id="page-frame-locator-option-selector"></a>`selector` `string` *(optional)*

  A selector that matches the frame element. When not specified, locator is matched in any frame on the page.

**Returns**

- `FrameLocator`


### Page.Frames() {#page-frames}

<Badge type="info" text="Added in: v1.8" />

An array of all frames attached to the page.

**Returns**

- `Array<Frame>`


### Page.GetAttributeAsync() {#page-get-attribute}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.GetAttributeAsync()`](/dotnet/api/class-locator#locator-get-attribute) instead. Read more about [locators](../locators.md).
:::

Returns element attribute value.

**Arguments**

- <a id="page-get-attribute-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-get-attribute-option-name"></a>`name` `string`

  Attribute name to get the value for.
- <a id="page-get-attribute-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-get-attribute-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-get-attribute-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `null | string`


### Page.GetByAltText() {#page-get-by-alt-text}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements by their alt text.

**Usage**

For example, this method will find the image by alt text "Playwright logo":

```html
<img alt='Playwright logo'>
```

```csharp
await page.GetByAltText("Playwright logo").ClickAsync();
```

**Arguments**

- <a id="page-get-by-alt-text-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="page-get-by-alt-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-get-by-alt-text-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### Page.GetByLabel() {#page-get-by-label}

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

```csharp
await page.GetByLabel("Username").FillAsync("john");
await page.GetByLabel("Password").FillAsync("secret");
```

**Arguments**

- <a id="page-get-by-label-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="page-get-by-label-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-get-by-label-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### Page.GetByPlaceholder() {#page-get-by-placeholder}

<Badge type="info" text="Added in: v1.27" />

Allows locating input elements by the placeholder text.

**Usage**

For example, consider the following DOM structure.

```html
<input type="email" placeholder="name@example.com" />
```

You can fill the input after locating it by the placeholder text:

```csharp
await page
    .GetByPlaceholder("name@example.com")
    .FillAsync("playwright@microsoft.com");
```

**Arguments**

- <a id="page-get-by-placeholder-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="page-get-by-placeholder-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-get-by-placeholder-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### Page.GetByRef() {#page-get-by-ref}

<Badge type="info" text="Added in: v1.64" />

Locate element by its aria ref. Refs like `[ref=e2]` are reported by [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) when called with
the `"ai"` mode, and resolve against the latest snapshot taken in the element's frame.

**Usage**

Consider the following aria snapshot.

```yaml
- button "Submit" [ref=e2]
```

You can locate the button by its ref:

```csharp
await page.GetByRef("e2").ClickAsync();
```

**Arguments**

- <a id="page-get-by-ref-option-ref"></a>`ref` `string`

  Aria ref of the element, for example `e2` or `f1e3`.

**Returns**

- `Locator`


### Page.GetByRole() {#page-get-by-role}

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

```csharp
await Expect(Page
    .GetByRole(AriaRole.Heading, new() { Name = "Sign up" }))
    .ToBeVisibleAsync();

await page
    .GetByRole(AriaRole.Checkbox, new() { Name = "Subscribe" })
    .CheckAsync();

await page
    .GetByRole(AriaRole.Button, new() {
        NameRegex = new Regex("submit", RegexOptions.IgnoreCase)
    })
    .ClickAsync();
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
  - <a id="page-get-by-role-option-description"></a>`description` `string` *(optional)* <Badge type="info" text="Added in: v1.60" />

    Option to match the [accessible description](https://w3c.github.io/accname/#dfn-accessible-description). By default, matching is case-insensitive and searches for a substring, use [`exact`](/dotnet/api/class-page#page-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible description](https://w3c.github.io/accname/#dfn-accessible-description).
  - <a id="page-get-by-role-option-description-regex"></a>`descriptionRegex` `RegExp` *(optional)* <Badge type="info" text="Added in: v1.60" />

    Option to match the [accessible description](https://w3c.github.io/accname/#dfn-accessible-description). By default, matching is case-insensitive and searches for a substring, use [`exact`](/dotnet/api/class-page#page-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible description](https://w3c.github.io/accname/#dfn-accessible-description).
  - <a id="page-get-by-role-option-description-string"></a>`descriptionString` `string` *(optional)* <Badge type="info" text="Added in: v1.60" />

    Option to match the [accessible description](https://w3c.github.io/accname/#dfn-accessible-description). By default, matching is case-insensitive and searches for a substring, use [`exact`](/dotnet/api/class-page#page-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible description](https://w3c.github.io/accname/#dfn-accessible-description).
  - <a id="page-get-by-role-option-disabled"></a>`disabled` `boolean` *(optional)*

    An attribute that is usually set by `aria-disabled` or `disabled`.

    ::: info
    Unlike most other attributes, `disabled` is inherited through the DOM hierarchy.
    Learn more about [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled).
    :::
  - <a id="page-get-by-role-option-exact"></a>`exact` `boolean` *(optional)* <Badge type="info" text="Added in: v1.28" />

    Whether [`name`](/dotnet/api/class-page#page-get-by-role-option-name) and [`description`](/dotnet/api/class-page#page-get-by-role-option-description) are matched exactly: case-sensitive and whole-string. Defaults to false. Ignored when the value is a regular expression. Note that exact match still trims whitespace.
  - <a id="page-get-by-role-option-expanded"></a>`expanded` `boolean` *(optional)*

    An attribute that is usually set by `aria-expanded`.

    Learn more about [`aria-expanded`](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded).
  - <a id="page-get-by-role-option-include-hidden"></a>`includeHidden` `boolean` *(optional)*

    Option that controls whether hidden elements are matched. By default, only non-hidden elements, as [defined by ARIA](https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion), are matched by role selector.

    Learn more about [`aria-hidden`](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden).
  - <a id="page-get-by-role-option-level"></a>`level` `int` *(optional)*

    A number attribute that is usually present for roles `heading`, `listitem`, `row`, `treeitem`, with default values for `<h1>-<h6>` elements.

    Learn more about [`aria-level`](https://www.w3.org/TR/wai-aria-1.2/#aria-level).
  - <a id="page-get-by-role-option-name"></a>`name` `string` *(optional)*

    Option to match the [accessible name](https://w3c.github.io/accname/#dfn-accessible-name). By default, matching is case-insensitive and searches for a substring, use [`exact`](/dotnet/api/class-page#page-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
  - <a id="page-get-by-role-option-name-regex"></a>`nameRegex` `RegExp` *(optional)*

    Option to match the [accessible name](https://w3c.github.io/accname/#dfn-accessible-name). By default, matching is case-insensitive and searches for a substring, use [`exact`](/dotnet/api/class-page#page-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
  - <a id="page-get-by-role-option-name-string"></a>`nameString` `string` *(optional)*

    Option to match the [accessible name](https://w3c.github.io/accname/#dfn-accessible-name). By default, matching is case-insensitive and searches for a substring, use [`exact`](/dotnet/api/class-page#page-get-by-role-option-exact) to control this behavior.

    Learn more about [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
  - <a id="page-get-by-role-option-pressed"></a>`pressed` `boolean` *(optional)*

    An attribute that is usually set by `aria-pressed`.

    Learn more about [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.2/#aria-pressed).
  - <a id="page-get-by-role-option-selected"></a>`selected` `boolean` *(optional)*

    An attribute that is usually set by `aria-selected`.

    Learn more about [`aria-selected`](https://www.w3.org/TR/wai-aria-1.2/#aria-selected).

**Returns**

- `Locator`


### Page.GetByTestId() {#page-get-by-test-id}

<Badge type="info" text="Added in: v1.27" />

Locate element by the test id.

**Usage**

Consider the following DOM structure.

```html
<button data-testid="directions">Itinéraire</button>
```

You can locate the element by its test id:

```csharp
await page.GetByTestId("directions").ClickAsync();
```

**Details**

By default, the `data-testid` attribute is used as a test id. Use [`Selectors.SetTestIdAttribute()`](/dotnet/api/class-selectors#selectors-set-test-id-attribute) to configure a different test id attribute if necessary.

**Arguments**

- <a id="page-get-by-test-id-option-test-id"></a>`testId` `string | RegExp`

  Id to locate the element by.

**Returns**

- `Locator`


### Page.GetByText() {#page-get-by-text}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements that contain given text.

See also [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter) that allows to match by another criteria, like an accessible role, and then filter by the text content.

**Usage**

Consider the following DOM structure:

```html
<div>Hello <span>world</span></div>
<div>Hello</div>
```

You can locate by text substring, exact string, or a regular expression:

```csharp
// Matches <span>
page.GetByText("world");

// Matches first <div>
page.GetByText("Hello world");

// Matches second <div>
page.GetByText("Hello", new() { Exact = true });

// Matches both <div>s
page.GetByText(new Regex("Hello"));

// Matches second <div>
page.GetByText(new Regex("^hello$", RegexOptions.IgnoreCase));
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


### Page.GetByTitle() {#page-get-by-title}

<Badge type="info" text="Added in: v1.27" />

Allows locating elements by their title attribute.

**Usage**

Consider the following DOM structure.

```html
<span title='Issues count'>25 issues</span>
```

You can check the issues count after locating it by the title text:

```csharp
await Expect(Page.GetByTitle("Issues count")).toHaveText("25 issues");
```

**Arguments**

- <a id="page-get-by-title-option-text"></a>`text` `string | RegExp`

  Text to locate the element for.
- <a id="page-get-by-title-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-get-by-title-option-exact"></a>`exact` `boolean` *(optional)*

    Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.

**Returns**

- `Locator`


### Page.GoBackAsync() {#page-go-back}

<Badge type="info" text="Added in: v1.8" />

Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the
last redirect. If cannot go back, returns `null`.

Navigate to the previous page in history.

::: warning
**Testing Back/Forward Cache (BFCache) is not supported.**
By default, Playwright disables the Back/Forward Cache across all browsers. Even if explicitly enabled, Playwright's internal state relies on network-level navigation events. Because BFCache restores unfreeze the DOM without firing these events, using `page.goBack()` or `page.goForward()` to trigger a BFCache restore will result in timeouts and a desynchronized `Page` state.
:::

**Arguments**

- <a id="page-go-back-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-go-back-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`BrowserContext.SetDefaultNavigationTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout),
    [`Page.SetDefaultNavigationTimeout()`](/dotnet/api/class-page#page-set-default-navigation-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-go-back-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.

**Returns**

- `null | Response`


### Page.GoForwardAsync() {#page-go-forward}

<Badge type="info" text="Added in: v1.8" />

Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the
last redirect. If cannot go forward, returns `null`.

Navigate to the next page in history.

::: warning
**Testing Back/Forward Cache (BFCache) is not supported.**
By default, Playwright disables the Back/Forward Cache across all browsers. Even if explicitly enabled, Playwright's internal state relies on network-level navigation events. Because BFCache restores unfreeze the DOM without firing these events, using `page.goBack()` or `page.goForward()` to trigger a BFCache restore will result in timeouts and a desynchronized `Page` state.
:::

**Arguments**

- <a id="page-go-forward-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-go-forward-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`BrowserContext.SetDefaultNavigationTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout),
    [`Page.SetDefaultNavigationTimeout()`](/dotnet/api/class-page#page-set-default-navigation-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-go-forward-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.

**Returns**

- `null | Response`


### Page.GotoAsync() {#page-goto}

<Badge type="info" text="Added in: v1.8" />

Returns the main resource response. In case of multiple redirects, the navigation will resolve with the first
non-redirect response.

The method will throw an error if:
* there's an SSL error (e.g. in case of self-signed certificates).
* target URL is invalid.
* the [`timeout`](/dotnet/api/class-page#page-goto-option-timeout) is exceeded during navigation.
* the remote server does not respond or is unreachable.
* the main resource failed to load.

The method will not throw an error when any valid HTTP status code is returned by the remote server, including 404 "Not
Found" and 500 "Internal Server Error".  The status code for such responses can be retrieved by calling
[`Response.Status()`](/dotnet/api/class-response#response-status).

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
  When a [`baseURL`](/dotnet/api/class-browser#browser-new-context-option-base-url) via the context options was provided and the passed URL is a path,
  it gets merged via the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
- <a id="page-goto-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-goto-option-referer"></a>`referer` `string` *(optional)*

    Referer header value. If provided it will take preference over the referer header value set by
    [`Page.SetExtraHTTPHeadersAsync()`](/dotnet/api/class-page#page-set-extra-http-headers).
  - <a id="page-goto-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`BrowserContext.SetDefaultNavigationTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout),
    [`Page.SetDefaultNavigationTimeout()`](/dotnet/api/class-page#page-set-default-navigation-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-goto-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.

**Returns**

- `null | Response`


### Page.HideHighlightAsync() {#page-hide-highlight}

<Badge type="info" text="Added in: v1.60" />

Hide all locator highlight overlays previously added by [`Locator.HighlightAsync()`](/dotnet/api/class-locator#locator-highlight) on this page.


### Page.HoverAsync() {#page-hover}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.HoverAsync()`](/dotnet/api/class-locator#locator-hover) instead. Read more about [locators](../locators.md).
:::

This method hovers over an element matching [`selector`](/dotnet/api/class-page#page-hover-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/dotnet/api/class-page#page-hover-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/dotnet/api/class-page#page-hover-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`Page.Mouse`](/dotnet/api/class-page#page-mouse) to hover over the center of the element, or the specified [`position`](/dotnet/api/class-page#page-hover-option-position).

When all steps combined have not finished during the specified [`timeout`](/dotnet/api/class-page#page-hover-option-timeout), this method throws a
[TimeoutError](/dotnet/api/class-timeouterror). Passing zero timeout disables this.

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
  - <a id="page-hover-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-hover-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-hover-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### Page.InnerHTMLAsync() {#page-inner-html}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.InnerHTMLAsync()`](/dotnet/api/class-locator#locator-inner-html) instead. Read more about [locators](../locators.md).
:::

Returns `element.innerHTML`.

**Arguments**

- <a id="page-inner-html-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-inner-html-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-inner-html-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-inner-html-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `string`


### Page.InnerTextAsync() {#page-inner-text}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.InnerTextAsync()`](/dotnet/api/class-locator#locator-inner-text) instead. Read more about [locators](../locators.md).
:::

Returns `element.innerText`.

**Arguments**

- <a id="page-inner-text-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-inner-text-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-inner-text-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-inner-text-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `string`


### Page.InputValueAsync() {#page-input-value}

<Badge type="info" text="Added in: v1.13" />

::: warning Discouraged
Use locator-based [`Locator.InputValueAsync()`](/dotnet/api/class-locator#locator-input-value) instead. Read more about [locators](../locators.md).
:::

Returns `input.value` for the selected `<input>` or `<textarea>` or `<select>` element.

Throws for non-input elements. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), returns the value of the control.

**Arguments**

- <a id="page-input-value-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-input-value-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-input-value-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-input-value-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `string`


### Page.IsCheckedAsync() {#page-is-checked}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.IsCheckedAsync()`](/dotnet/api/class-locator#locator-is-checked) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is checked. Throws if the element is not a checkbox or radio input.

**Arguments**

- <a id="page-is-checked-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-is-checked-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-is-checked-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-is-checked-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `boolean`


### Page.IsClosed() {#page-is-closed}

<Badge type="info" text="Added in: v1.8" />

Indicates that the page has been closed.

**Returns**

- `boolean`


### Page.IsDisabledAsync() {#page-is-disabled}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.IsDisabledAsync()`](/dotnet/api/class-locator#locator-is-disabled) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is disabled, the opposite of [enabled](../actionability.md#enabled).

**Arguments**

- <a id="page-is-disabled-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-is-disabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-is-disabled-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-is-disabled-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `boolean`


### Page.IsEditableAsync() {#page-is-editable}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.IsEditableAsync()`](/dotnet/api/class-locator#locator-is-editable) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [editable](../actionability.md#editable).

**Arguments**

- <a id="page-is-editable-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-is-editable-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-is-editable-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-is-editable-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `boolean`


### Page.IsEnabledAsync() {#page-is-enabled}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.IsEnabledAsync()`](/dotnet/api/class-locator#locator-is-enabled) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [enabled](../actionability.md#enabled).

**Arguments**

- <a id="page-is-enabled-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-is-enabled-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-is-enabled-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-is-enabled-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `boolean`


### Page.IsHiddenAsync() {#page-is-hidden}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.IsHiddenAsync()`](/dotnet/api/class-locator#locator-is-hidden) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is hidden, the opposite of [visible](../actionability.md#visible).  [`selector`](/dotnet/api/class-page#page-is-hidden-option-selector) that does not match any elements is considered hidden.

**Arguments**

- <a id="page-is-hidden-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-is-hidden-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-is-hidden-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-is-hidden-option-timeout"></a>`timeout` `float` *(optional)*

**Returns**

- `boolean`


### Page.IsVisibleAsync() {#page-is-visible}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.IsVisibleAsync()`](/dotnet/api/class-locator#locator-is-visible) instead. Read more about [locators](../locators.md).
:::

Returns whether the element is [visible](../actionability.md#visible). [`selector`](/dotnet/api/class-page#page-is-visible-option-selector) that does not match any elements is considered not visible.

**Arguments**

- <a id="page-is-visible-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-is-visible-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-is-visible-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-is-visible-option-timeout"></a>`timeout` `float` *(optional)*

**Returns**

- `boolean`


### Page.Locator() {#page-locator}

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

    Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator](/dotnet/api/class-framelocator)s.
  - <a id="page-locator-option-has-not"></a>`hasNot` `Locator` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the outer one.
    For example, `article` that does not have `div` matches `<article><span>Playwright</span></article>`.

    Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator](/dotnet/api/class-framelocator)s.
  - <a id="page-locator-option-has-not-text"></a>`hasNotText` `string` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
  - <a id="page-locator-option-has-not-text-regex"></a>`hasNotTextRegex` `RegExp` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
  - <a id="page-locator-option-has-not-text-string"></a>`hasNotTextString` `string` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
  - <a id="page-locator-option-has-text"></a>`hasText` `string` *(optional)*

    Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
    For example, `"Playwright"` matches `<article><div>Playwright</div></article>`.
  - <a id="page-locator-option-has-text-regex"></a>`hasTextRegex` `RegExp` *(optional)*

    Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
    For example, `"Playwright"` matches `<article><div>Playwright</div></article>`.
  - <a id="page-locator-option-has-text-string"></a>`hasTextString` `string` *(optional)*

    Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a [string], matching is case-insensitive and searches for a substring.
    For example, `"Playwright"` matches `<article><div>Playwright</div></article>`.

**Returns**

- `Locator`


### Page.MainFrame() {#page-main-frame}

<Badge type="info" text="Added in: v1.8" />

The page's main frame. Page is guaranteed to have a main frame which persists during navigations.

**Returns**

- `Frame`


### Page.OpenerAsync() {#page-opener}

<Badge type="info" text="Added in: v1.8" />

Returns the opener for popup pages and `null` for others. If the opener has been closed already the returns `null`.

**Returns**

- `null | Page`


### Page.PageErrorsAsync() {#page-page-errors}

<Badge type="info" text="Added in: v1.56" />

Returns up to (currently) 200 last page errors from this page. See [`Page.PageError`](/dotnet/api/class-page#page-event-page-error) for more details.

**Returns**

- `Array<string>`


### Page.PauseAsync() {#page-pause}

<Badge type="info" text="Added in: v1.9" />

Pauses script execution. Playwright will stop executing the script and wait for the user to either press the 'Resume'
button in the page overlay or to call `playwright.resume()` in the DevTools console.

User can inspect selectors or perform manual steps while paused. Resume will continue running the original script from
the place it was paused.

::: info
This method requires Playwright to be started in a headed mode, with a falsy [`headless`](/dotnet/api/class-browsertype#browser-type-launch-option-headless) option.
:::


### Page.PdfAsync() {#page-pdf}

<Badge type="info" text="Added in: v1.8" />

Returns the PDF buffer.

`page.pdf()` generates a pdf of the page with `print` css media. To generate a pdf with `screen` media, call
[`Page.EmulateMediaAsync()`](/dotnet/api/class-page#page-emulate-media) before calling `page.pdf()`:

::: info
By default, `page.pdf()` generates a pdf with modified colors for printing. Use the
[`-webkit-print-color-adjust`](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-print-color-adjust) property to
force rendering of exact colors.
:::

**Usage**

```csharp
// Generates a PDF with 'screen' media type
await page.EmulateMediaAsync(new() { Media = Media.Screen });
await page.PdfAsync(new() { Path = "page.pdf" });
```

The [`width`](/dotnet/api/class-page#page-pdf-option-width), [`height`](/dotnet/api/class-page#page-pdf-option-height), and [`margin`](/dotnet/api/class-page#page-pdf-option-margin) options accept values labeled with units. Unlabeled
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

The [`format`](/dotnet/api/class-page#page-pdf-option-format) options are:
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
[`headerTemplate`](/dotnet/api/class-page#page-pdf-option-header-template) and [`footerTemplate`](/dotnet/api/class-page#page-pdf-option-footer-template) markup have the following limitations: > 1. Script tags inside
templates are not evaluated. > 2. Page styles are not visible inside templates.
:::

**Arguments**

- <a id="page-pdf-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-pdf-option-display-header-footer"></a>`displayHeaderFooter` `boolean` *(optional)*

    Display header and footer. Defaults to `false`.
  - <a id="page-pdf-option-footer-template"></a>`footerTemplate` `string` *(optional)*

    HTML template for the print footer. Should use the same format as the [`headerTemplate`](/dotnet/api/class-page#page-pdf-option-header-template).
  - <a id="page-pdf-option-format"></a>`format` `string` *(optional)*

    Paper format. If set, takes priority over [`width`](/dotnet/api/class-page#page-pdf-option-width) or [`height`](/dotnet/api/class-page#page-pdf-option-height) options. Defaults to 'Letter'.
  - <a id="page-pdf-option-header-template"></a>`headerTemplate` `string` *(optional)*

    HTML template for the print header. Should be valid HTML markup with following classes used to inject printing values
    into them:
    * `'date'` formatted print date
    * `'title'` document title
    * `'url'` document location
    * `'pageNumber'` current page number
    * `'totalPages'` total pages in the document
  - <a id="page-pdf-option-height"></a>`height` `string` *(optional)*

    Paper height, accepts values labeled with units.
  - <a id="page-pdf-option-landscape"></a>`landscape` `boolean` *(optional)*

    Paper orientation. Defaults to `false`.
  - <a id="page-pdf-option-margin"></a>`margin` `Object` *(optional)*

    Paper margins, defaults to none.

    - `top` `string` *(optional)*

      Top margin, accepts values labeled with units. Defaults to `0`.
    - `right` `string` *(optional)*

      Right margin, accepts values labeled with units. Defaults to `0`.
    - `bottom` `string` *(optional)*

      Bottom margin, accepts values labeled with units. Defaults to `0`.
    - `left` `string` *(optional)*

      Left margin, accepts values labeled with units. Defaults to `0`.
  - <a id="page-pdf-option-outline"></a>`outline` `boolean` *(optional)* <Badge type="info" text="Added in: v1.42" />

    Whether or not to embed the document outline into the PDF. Defaults to `false`.
  - <a id="page-pdf-option-page-ranges"></a>`pageRanges` `string` *(optional)*

    Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means print all pages.
  - <a id="page-pdf-option-path"></a>`path` `path` *(optional)*

    The file path to save the PDF to. If [`path`](/dotnet/api/class-page#page-pdf-option-path) is a relative path, then it is resolved relative to the current
    working directory. If no path is provided, the PDF won't be saved to the disk.
  - <a id="page-pdf-option-prefer-css-page-size"></a>`preferCSSPageSize` `boolean` *(optional)*

    Give any CSS `@page` size declared in the page priority over what is declared in [`width`](/dotnet/api/class-page#page-pdf-option-width) and
    [`height`](/dotnet/api/class-page#page-pdf-option-height) or [`format`](/dotnet/api/class-page#page-pdf-option-format) options. Defaults to `false`, which will scale the content to fit the paper
    size.
  - <a id="page-pdf-option-print-background"></a>`printBackground` `boolean` *(optional)*

    Print background graphics. Defaults to `false`.
  - <a id="page-pdf-option-scale"></a>`scale` `float` *(optional)*

    Scale of the webpage rendering. Defaults to `1`. Scale amount must be between 0.1 and 2.
  - <a id="page-pdf-option-tagged"></a>`tagged` `boolean` *(optional)* <Badge type="info" text="Added in: v1.42" />

    Whether or not to generate tagged (accessible) PDF. Defaults to `false`.
  - <a id="page-pdf-option-width"></a>`width` `string` *(optional)*

    Paper width, accepts values labeled with units.

**Returns**

- `Buffer`


### Page.PickLocatorAsync() {#page-pick-locator}

<Badge type="info" text="Added in: v1.59" />

Enters pick locator mode where hovering over page elements highlights them and shows the corresponding locator.
Once the user clicks an element, the mode is deactivated and the [Locator](/dotnet/api/class-locator) for the picked element is returned.

**Usage**

```csharp
var locator = await page.PickLocatorAsync();
Console.WriteLine(locator);
```

**Returns**

- `Locator`


### Page.PressAsync() {#page-press}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.PressAsync()`](/dotnet/api/class-locator#locator-press) instead. Read more about [locators](../locators.md).
:::

Focuses the element, and then uses [`Keyboard.DownAsync()`](/dotnet/api/class-keyboard#keyboard-down) and [`Keyboard.UpAsync()`](/dotnet/api/class-keyboard#keyboard-up).

[`key`](/dotnet/api/class-page#page-press-option-key) can specify the intended
[keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value or a single character to
generate the text for. A superset of the [`key`](/dotnet/api/class-page#page-press-option-key) values can be found
[here](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values). Examples of the keys are:

`F1` - `F12`, `Digit0`- `Digit9`, `KeyA`- `KeyZ`, `Backquote`, `Minus`, `Equal`, `Backslash`, `Backspace`, `Tab`,
`Delete`, `Escape`, `ArrowDown`, `End`, `Enter`, `Home`, `Insert`, `PageDown`, `PageUp`, `ArrowRight`, `ArrowUp`, etc.

Following modification shortcuts are also supported: `Shift`, `Control`, `Alt`, `Meta`, `ShiftLeft`, `ControlOrMeta`.
`ControlOrMeta` resolves to `Control` on Windows and Linux and to `Meta` on macOS.

Holding down `Shift` will type the text that corresponds to the [`key`](/dotnet/api/class-page#page-press-option-key) in the upper case.

If [`key`](/dotnet/api/class-page#page-press-option-key) is a single character, it is case-sensitive, so the values `a` and `A` will generate different
respective texts.

Shortcuts such as `key: "Control+o"`, `key: "Control++` or `key: "Control+Shift+T"` are supported as well. When specified with the
modifier, modifier is pressed and being held while the subsequent key is being pressed.

**Usage**

```csharp
var page = await browser.NewPageAsync();
await page.GotoAsync("https://keycode.info");
await page.PressAsync("body", "A");
await page.ScreenshotAsync(new() { Path = "A.png" });
await page.PressAsync("body", "ArrowLeft");
await page.ScreenshotAsync(new() { Path = "ArrowLeft.png" });
await page.PressAsync("body", "Shift+O");
await page.ScreenshotAsync(new() { Path = "O.png" });
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
  - <a id="page-press-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-press-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.


### Page.QuerySelectorAsync() {#page-query-selector}

<Badge type="info" text="Added in: v1.9" />

::: warning Discouraged
Use locator-based [`Page.Locator()`](/dotnet/api/class-page#page-locator) instead. Read more about [locators](../locators.md).
:::

The method finds an element matching the specified selector within the page. If no elements match the selector, the
return value resolves to `null`. To wait for an element on the page, use [`Locator.WaitForAsync()`](/dotnet/api/class-locator#locator-wait-for).

**Arguments**

- <a id="page-query-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="page-query-selector-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-query-selector-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.

**Returns**

- `null | ElementHandle`


### Page.QuerySelectorAllAsync() {#page-query-selector-all}

<Badge type="info" text="Added in: v1.9" />

::: warning Discouraged
Use locator-based [`Page.Locator()`](/dotnet/api/class-page#page-locator) instead. Read more about [locators](../locators.md).
:::

The method finds all elements matching the specified selector within the page. If no elements match the selector, the
return value resolves to `[]`.

**Arguments**

- <a id="page-query-selector-all-option-selector"></a>`selector` `string`

  A selector to query for.

**Returns**

- `Array<ElementHandle>`


### Page.ReloadAsync() {#page-reload}

<Badge type="info" text="Added in: v1.8" />

This method reloads the current page, in the same way as if the user had triggered a browser refresh.
Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the
last redirect.

**Arguments**

- <a id="page-reload-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-reload-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`BrowserContext.SetDefaultNavigationTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout),
    [`Page.SetDefaultNavigationTimeout()`](/dotnet/api/class-page#page-set-default-navigation-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-reload-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.

**Returns**

- `null | Response`


### Page.RemoveLocatorHandlerAsync() {#page-remove-locator-handler}

<Badge type="info" text="Added in: v1.44" />

Removes all locator handlers added by [`Page.AddLocatorHandlerAsync()`](/dotnet/api/class-page#page-add-locator-handler) for a specific locator.

**Arguments**

- <a id="page-remove-locator-handler-option-locator"></a>`locator` `Locator`

  Locator passed to [`Page.AddLocatorHandlerAsync()`](/dotnet/api/class-page#page-add-locator-handler).


### Page.RequestGCAsync() {#page-request-gc}

<Badge type="info" text="Added in: v1.48" />

Request the page to perform garbage collection. Note that there is no guarantee that all unreachable objects will be collected.

This is useful to help detect memory leaks. For example, if your page has a large object `'suspect'` that might be leaked, you can check that it does not leak by using a [`WeakRef`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef).

```csharp
// 1. In your page, save a WeakRef for the "suspect".
await Page.EvaluateAsync("globalThis.suspectWeakRef = new WeakRef(suspect)");
// 2. Request garbage collection.
await Page.RequestGCAsync();
// 3. Check that weak ref does not deref to the original object.
Assert.True(await Page.EvaluateAsync("!globalThis.suspectWeakRef.deref()"));
```


### Page.RequestsAsync() {#page-requests}

<Badge type="info" text="Added in: v1.56" />

Returns up to (currently) 100 last network request from this page. See [`Page.Request`](/dotnet/api/class-page#page-event-request) for more details.

Returned requests should be accessed immediately, otherwise they might be collected to prevent unbounded memory growth as new requests come in. Once collected, retrieving most information about the request is impossible.

Note that requests reported through the [`Page.Request`](/dotnet/api/class-page#page-event-request) request are not collected, so there is a trade off between efficient memory usage with [`Page.RequestsAsync()`](/dotnet/api/class-page#page-requests) and the amount of available information reported through [`Page.Request`](/dotnet/api/class-page#page-event-request).

**Returns**

- `Array<Request>`


### Page.RouteAsync() {#page-route}

<Badge type="info" text="Added in: v1.8" />

Routing provides the capability to modify network requests that are made by a page.

Once routing is enabled, every request matching the url pattern will stall unless it's continued, fulfilled or aborted.

::: info
The handler will only be called for the first url if the response is a redirect.
:::

::: info
[`Page.RouteAsync()`](/dotnet/api/class-page#page-route) will not intercept requests intercepted by Service Worker. See [this](https://github.com/microsoft/playwright/issues/1090) issue. We recommend disabling Service Workers when using request interception by setting [`serviceWorkers`](/dotnet/api/class-browser#browser-new-context-option-service-workers) to `'block'`.
:::

::: info
[`Page.RouteAsync()`](/dotnet/api/class-page#page-route) will not intercept the first request of a popup page. Use [`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route) instead.
:::

**Usage**

An example of a naive handler that aborts all image requests:

```csharp
var page = await browser.NewPageAsync();
await page.RouteAsync("**/*.{png,jpg,jpeg}", async r => await r.AbortAsync());
await page.GotoAsync("https://www.microsoft.com");
```

or the same snippet using a regex pattern instead:

```csharp
var page = await browser.NewPageAsync();
await page.RouteAsync(new Regex("(\\.png$)|(\\.jpg$)"), async r => await r.AbortAsync());
await page.GotoAsync("https://www.microsoft.com");
```

It is possible to examine the request to decide the route action. For example, mocking all requests that contain some post data, and leaving all other requests as is:

```csharp
await page.RouteAsync("/api/**", async r =>
{
  if (r.Request.PostData.Contains("my-string"))
      await r.FulfillAsync(new() { Body = "mocked-data" });
  else
      await r.ContinueAsync();
});
```

If a request matches multiple registered routes, the most recently registered route takes precedence.

Page routes take precedence over browser context routes (set up with [`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route)) when request
matches both handlers.

To remove a route with its handler you can use [`Page.UnrouteAsync()`](/dotnet/api/class-page#page-unroute).

::: info
Enabling routing disables http cache.
:::

**Arguments**

- <a id="page-route-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  A glob pattern, regex pattern, or predicate that receives a [URL] to match during routing. If [`baseURL`](/dotnet/api/class-browser#browser-new-context-option-base-url) is set in the context options and the provided URL is a string that does not start with `*`, it is resolved using the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
- <a id="page-route-option-handler"></a>`handler` `function(Route)`

  handler function to route the request.
- <a id="page-route-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-route-option-times"></a>`times` `int` *(optional)* <Badge type="info" text="Added in: v1.15" />

    How often a route should be used. By default it will be used every time.

**Returns**

- `Disposable`


### Page.RouteFromHARAsync() {#page-route-from-har}

<Badge type="info" text="Added in: v1.23" />

If specified the network requests that are made in the page will be served from the HAR file. Read more about [Replaying from HAR](../mock.md#replaying-from-har).

Playwright will not serve requests intercepted by Service Worker from the HAR file. See [this](https://github.com/microsoft/playwright/issues/1090) issue. We recommend disabling Service Workers when using request interception by setting [`serviceWorkers`](/dotnet/api/class-browser#browser-new-context-option-service-workers) to `'block'`.

**Arguments**

- <a id="page-route-from-har-option-har"></a>`har` `path`

  Path to a [HAR](http://www.softwareishard.com/blog/har-12-spec) file with prerecorded network data. If `path` is a relative path, then it is resolved relative to the current working directory.
- <a id="page-route-from-har-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-route-from-har-option-not-found"></a>`notFound` `"abort" | "fallback"` *(optional)*

    * If set to 'abort' any request not found in the HAR file will be aborted.
    * If set to 'fallback' missing requests will be sent to the network.

    Defaults to abort.
  - <a id="page-route-from-har-option-update"></a>`update` `boolean` *(optional)*

    If specified, updates the given HAR with the actual network information instead of serving from file. The file is written to disk when [`BrowserContext.CloseAsync()`](/dotnet/api/class-browsercontext#browser-context-close) is called.
  - <a id="page-route-from-har-option-update-content"></a>`updateContent` `"embed" | "attach"` *(optional)* <Badge type="info" text="Added in: v1.32" />

    Optional setting to control resource content management. If `attach` is specified, resources are persisted as separate files or entries in the ZIP archive. If `embed` is specified, content is stored inline the HAR file.
  - <a id="page-route-from-har-option-update-mode"></a>`updateMode` `"full" | "minimal"` *(optional)* <Badge type="info" text="Added in: v1.32" />

    When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to `minimal`.
  - <a id="page-route-from-har-option-url"></a>`url` `string` *(optional)*

    A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.
  - <a id="page-route-from-har-option-url-regex"></a>`urlRegex` `RegExp` *(optional)*

    A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.
  - <a id="page-route-from-har-option-url-string"></a>`urlString` `string` *(optional)*

    A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.


### Page.RouteWebSocketAsync() {#page-route-web-socket}

<Badge type="info" text="Added in: v1.48" />

This method allows to modify websocket connections that are made by the page.

Note that only `WebSocket`s created after this method was called will be routed. It is recommended to call this method before navigating the page.

**Usage**

Below is an example of a simple mock that responds to a single message. See [WebSocketRoute](/dotnet/api/class-websocketroute) for more details and examples.

```csharp
await page.RouteWebSocketAsync("/ws", ws => {
  ws.OnMessage(frame => {
    if (frame.Text == "request")
      ws.Send("response");
  });
});
```

**Arguments**

- <a id="page-route-web-socket-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  Only WebSockets with the url matching this pattern will be routed. A string pattern can be relative to the [`baseURL`](/dotnet/api/class-browser#browser-new-context-option-base-url) context option.
- <a id="page-route-web-socket-option-handler"></a>`handler` `function(WebSocketRoute)`

  Handler function to route the WebSocket.


### Page.RunAndWaitForConsoleMessageAsync() {#page-wait-for-console-message}

<Badge type="info" text="Added in: v1.9" />

Performs action and waits for a [ConsoleMessage](/dotnet/api/class-consolemessage) to be logged by in the page. If predicate is provided, it passes
[ConsoleMessage](/dotnet/api/class-consolemessage) value into the `predicate` function and waits for `predicate(message)` to return a truthy value.
Will throw an error if the page is closed before the [`Page.Console`](/dotnet/api/class-page#page-event-console) event is fired.

**Arguments**

- <a id="page-wait-for-console-message-option-action"></a>`action` `Func<Task>` <Badge type="info" text="Added in: v1.12" />

  Action that triggers the event.
- <a id="page-wait-for-console-message-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-console-message-option-predicate"></a>`predicate` `function(ConsoleMessage): boolean` *(optional)*

    Receives the [ConsoleMessage](/dotnet/api/class-consolemessage) object and resolves to truthy value when the waiting should resolve.
  - <a id="page-wait-for-console-message-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `ConsoleMessage`


### Page.RunAndWaitForDownloadAsync() {#page-wait-for-download}

<Badge type="info" text="Added in: v1.9" />

Performs action and waits for a new [Download](/dotnet/api/class-download). If predicate is provided, it passes
[Download](/dotnet/api/class-download) value into the `predicate` function and waits for `predicate(download)` to return a truthy value.
Will throw an error if the page is closed before the download event is fired.

**Arguments**

- <a id="page-wait-for-download-option-action"></a>`action` `Func<Task>` <Badge type="info" text="Added in: v1.12" />

  Action that triggers the event.
- <a id="page-wait-for-download-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-download-option-predicate"></a>`predicate` `function(Download): boolean` *(optional)*

    Receives the [Download](/dotnet/api/class-download) object and resolves to truthy value when the waiting should resolve.
  - <a id="page-wait-for-download-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `Download`


### Page.RunAndWaitForFileChooserAsync() {#page-wait-for-file-chooser}

<Badge type="info" text="Added in: v1.9" />

Performs action and waits for a new [FileChooser](/dotnet/api/class-filechooser) to be created. If predicate is provided, it passes
[FileChooser](/dotnet/api/class-filechooser) value into the `predicate` function and waits for `predicate(fileChooser)` to return a truthy value.
Will throw an error if the page is closed before the file chooser is opened.

**Arguments**

- <a id="page-wait-for-file-chooser-option-action"></a>`action` `Func<Task>` <Badge type="info" text="Added in: v1.12" />

  Action that triggers the event.
- <a id="page-wait-for-file-chooser-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-file-chooser-option-predicate"></a>`predicate` `function(FileChooser): boolean` *(optional)*

    Receives the [FileChooser](/dotnet/api/class-filechooser) object and resolves to truthy value when the waiting should resolve.
  - <a id="page-wait-for-file-chooser-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `FileChooser`


### Page.RunAndWaitForPopupAsync() {#page-wait-for-popup}

<Badge type="info" text="Added in: v1.9" />

Performs action and waits for a popup [Page](/dotnet/api/class-page). If predicate is provided, it passes
[Popup] value into the `predicate` function and waits for `predicate(page)` to return a truthy value.
Will throw an error if the page is closed before the popup event is fired.

**Arguments**

- <a id="page-wait-for-popup-option-action"></a>`action` `Func<Task>` <Badge type="info" text="Added in: v1.12" />

  Action that triggers the event.
- <a id="page-wait-for-popup-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-popup-option-predicate"></a>`predicate` `function(Page): boolean` *(optional)*

    Receives the [Page](/dotnet/api/class-page) object and resolves to truthy value when the waiting should resolve.
  - <a id="page-wait-for-popup-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `Page`


### Page.RunAndWaitForRequestAsync() {#page-wait-for-request}

<Badge type="info" text="Added in: v1.8" />

Waits for the matching request and returns it. See [waiting for event](../events.md#waiting-for-event) for more details about events.

**Usage**

```csharp
// Waits for the next request with the specified url.
await page.RunAndWaitForRequestAsync(async () =>
{
    await page.GetByText("trigger request").ClickAsync();
}, "http://example.com/resource");

// Alternative way with a predicate.
await page.RunAndWaitForRequestAsync(async () =>
{
    await page.GetByText("trigger request").ClickAsync();
}, request => request.Url == "https://example.com" && request.Method == "GET");
```

**Arguments**

- <a id="page-wait-for-request-option-action"></a>`action` `Func<Task>` <Badge type="info" text="Added in: v1.12" />

  Action that triggers the event.
- <a id="page-wait-for-request-option-url-or-predicate"></a>`urlOrPredicate` `string | RegExp | function(Request): boolean`

  Request URL string, regex or predicate receiving [Request](/dotnet/api/class-request) object.
  When a [`baseURL`](/dotnet/api/class-browser#browser-new-context-option-base-url) via the context options was provided and the passed URL is a path,
  it gets merged via the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
- <a id="page-wait-for-request-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-request-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum wait time in milliseconds, defaults to 30 seconds, pass `0` to disable the timeout. The default value can be
    changed by using the [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) method.

**Returns**

- `Request`


### Page.RunAndWaitForRequestFinishedAsync() {#page-wait-for-request-finished}

<Badge type="info" text="Added in: v1.12" />

Performs action and waits for a [Request](/dotnet/api/class-request) to finish loading. If predicate is provided, it passes
[Request](/dotnet/api/class-request) value into the `predicate` function and waits for `predicate(request)` to return a truthy value.
Will throw an error if the page is closed before the [`Page.RequestFinished`](/dotnet/api/class-page#page-event-request-finished) event is fired.

**Arguments**

- <a id="page-wait-for-request-finished-option-action"></a>`action` `Func<Task>`

  Action that triggers the event.
- <a id="page-wait-for-request-finished-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-request-finished-option-predicate"></a>`predicate` `function(Request): boolean` *(optional)*

    Receives the [Request](/dotnet/api/class-request) object and resolves to truthy value when the waiting should resolve.
  - <a id="page-wait-for-request-finished-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `Request`


### Page.RunAndWaitForResponseAsync() {#page-wait-for-response}

<Badge type="info" text="Added in: v1.8" />

Returns the matched response. See [waiting for event](../events.md#waiting-for-event) for more details about events.

**Usage**

```csharp
// Waits for the next response with the specified url.
await page.RunAndWaitForResponseAsync(async () =>
{
    await page.GetByText("trigger response").ClickAsync();
}, "http://example.com/resource");

// Alternative way with a predicate.
await page.RunAndWaitForResponseAsync(async () =>
{
    await page.GetByText("trigger response").ClickAsync();
}, response => response.Url == "https://example.com" && response.Status == 200 && response.Request.Method == "GET");
```

**Arguments**

- <a id="page-wait-for-response-option-action"></a>`action` `Func<Task>` <Badge type="info" text="Added in: v1.12" />

  Action that triggers the event.
- <a id="page-wait-for-response-option-url-or-predicate"></a>`urlOrPredicate` `string | RegExp | function(Response): boolean`

  Request URL string, regex or predicate receiving [Response](/dotnet/api/class-response) object.
  When a [`baseURL`](/dotnet/api/class-browser#browser-new-context-option-base-url) via the context options was provided and the passed URL is a path,
  it gets merged via the [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
- <a id="page-wait-for-response-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-response-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum wait time in milliseconds, defaults to 30 seconds, pass `0` to disable the timeout. The default value can be
    changed by using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Response`


### Page.RunAndWaitForWebSocketAsync() {#page-wait-for-web-socket}

<Badge type="info" text="Added in: v1.9" />

Performs action and waits for a new [WebSocket](/dotnet/api/class-websocket). If predicate is provided, it passes
[WebSocket](/dotnet/api/class-websocket) value into the `predicate` function and waits for `predicate(webSocket)` to return a truthy value.
Will throw an error if the page is closed before the WebSocket event is fired.

**Arguments**

- <a id="page-wait-for-web-socket-option-action"></a>`action` `Func<Task>` <Badge type="info" text="Added in: v1.12" />

  Action that triggers the event.
- <a id="page-wait-for-web-socket-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-web-socket-option-predicate"></a>`predicate` `function(WebSocket): boolean` *(optional)*

    Receives the [WebSocket](/dotnet/api/class-websocket) object and resolves to truthy value when the waiting should resolve.
  - <a id="page-wait-for-web-socket-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `WebSocket`


### Page.RunAndWaitForWorkerAsync() {#page-wait-for-worker}

<Badge type="info" text="Added in: v1.9" />

Performs action and waits for a new [Worker](/dotnet/api/class-worker). If predicate is provided, it passes
[Worker](/dotnet/api/class-worker) value into the `predicate` function and waits for `predicate(worker)` to return a truthy value.
Will throw an error if the page is closed before the worker event is fired.

**Arguments**

- <a id="page-wait-for-worker-option-action"></a>`action` `Func<Task>` <Badge type="info" text="Added in: v1.12" />

  Action that triggers the event.
- <a id="page-wait-for-worker-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-worker-option-predicate"></a>`predicate` `function(Worker): boolean` *(optional)*

    Receives the [Worker](/dotnet/api/class-worker) object and resolves to truthy value when the waiting should resolve.
  - <a id="page-wait-for-worker-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `Worker`


### Page.ScreenshotAsync() {#page-screenshot}

<Badge type="info" text="Added in: v1.8" />

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
    a pink box `#FF00FF` (customized by [`maskColor`](/dotnet/api/class-page#page-screenshot-option-mask-color)) that completely covers its bounding box.
    The mask is also applied to invisible elements, see [Matching only visible elements](../locators.md#matching-only-visible-elements) to disable that.
  - <a id="page-screenshot-option-mask-color"></a>`maskColor` `string` *(optional)* <Badge type="info" text="Added in: v1.35" />

    Specify the color of the overlay box for masked elements, in [CSS color format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Default color is pink `#FF00FF`.
  - <a id="page-screenshot-option-omit-background"></a>`omitBackground` `boolean` *(optional)*

    Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images.
    Defaults to `false`.
  - <a id="page-screenshot-option-path"></a>`path` `path` *(optional)*

    The file path to save the image to. The screenshot type will be inferred from file extension. If [`path`](/dotnet/api/class-page#page-screenshot-option-path) is a
    relative path, then it is resolved relative to the current working directory. If no path is provided, the image won't be
    saved to the disk.
  - <a id="page-screenshot-option-quality"></a>`quality` `int` *(optional)*

    The quality of the image, between 0-100. Not applicable to `png` images. For `jpeg` the default is `80`.
    For `webp`, a quality of `100` (the default) produces a lossless image, while lower values use lossy compression.
  - <a id="page-screenshot-option-scale"></a>`scale` `"css" | "device"` *(optional)*

    When set to `"css"`, screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using `"device"` option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.

    Defaults to `"device"`.
  - <a id="page-screenshot-option-style"></a>`style` `string` *(optional)* <Badge type="info" text="Added in: v1.41" />

    Text of the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible
    or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies
    to the inner frames.
  - <a id="page-screenshot-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-screenshot-option-type"></a>`type` `"png" | "jpeg" | "webp"` *(optional)*

    Specify screenshot type, defaults to `png`.

**Returns**

- `Buffer`


### Page.SelectOptionAsync() {#page-select-option}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.SelectOptionAsync()`](/dotnet/api/class-locator#locator-select-option) instead. Read more about [locators](../locators.md).
:::

This method waits for an element matching [`selector`](/dotnet/api/class-page#page-select-option-option-selector), waits for [actionability](../actionability.md) checks, waits until all specified options are present in the `<select>` element and selects these options.

If the target element is not a `<select>` element, this method throws an error. However, if the element is inside the `<label>` element that has an associated [control](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control), the control will be used instead.

Returns the array of option values that have been successfully selected.

Triggers a `change` and `input` event once all the provided options have been selected.

**Usage**

```csharp
// Single selection matching the value or label
await page.SelectOptionAsync("select#colors", new[] { "blue" });
// single selection matching both the value and the label
await page.SelectOptionAsync("select#colors", new[] { new SelectOptionValue() { Label = "blue" } });
// multiple
await page.SelectOptionAsync("select#colors", new[] { "red", "green", "blue" });
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
  - <a id="page-select-option-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-select-option-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `Array<string>`


### Page.SetCheckedAsync() {#page-set-checked}

<Badge type="info" text="Added in: v1.15" />

::: warning Discouraged
Use locator-based [`Locator.SetCheckedAsync()`](/dotnet/api/class-locator#locator-set-checked) instead. Read more about [locators](../locators.md).
:::

This method checks or unchecks an element matching [`selector`](/dotnet/api/class-page#page-set-checked-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/dotnet/api/class-page#page-set-checked-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Ensure that matched element is a checkbox or a radio input. If not, this method throws.
1. If the element already has the right checked state, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/dotnet/api/class-page#page-set-checked-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`Page.Mouse`](/dotnet/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now checked or unchecked. If not, this method throws.

When all steps combined have not finished during the specified [`timeout`](/dotnet/api/class-page#page-set-checked-option-timeout), this method throws a
[TimeoutError](/dotnet/api/class-timeouterror). Passing zero timeout disables this.

**Arguments**

- <a id="page-set-checked-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-set-checked-option-checked"></a>`checkedState` `boolean`

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
  - <a id="page-set-checked-option-strict"></a>`strict` `boolean` *(optional)*

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-set-checked-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-set-checked-option-trial"></a>`trial` `boolean` *(optional)*

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### Page.SetContentAsync() {#page-set-content}

<Badge type="info" text="Added in: v1.8" />

This method internally calls [document.write()](https://developer.mozilla.org/en-US/docs/Web/API/Document/write), inheriting all its specific characteristics and behaviors.

**Arguments**

- <a id="page-set-content-option-html"></a>`html` `string`

  HTML markup to assign to the page.
- <a id="page-set-content-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-set-content-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`BrowserContext.SetDefaultNavigationTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout),
    [`Page.SetDefaultNavigationTimeout()`](/dotnet/api/class-page#page-set-default-navigation-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-set-content-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.


### Page.SetDefaultNavigationTimeout() {#page-set-default-navigation-timeout}

<Badge type="info" text="Added in: v1.8" />

This setting will change the default maximum navigation time for the following methods and related shortcuts:
* [`Page.GoBackAsync()`](/dotnet/api/class-page#page-go-back)
* [`Page.GoForwardAsync()`](/dotnet/api/class-page#page-go-forward)
* [`Page.GotoAsync()`](/dotnet/api/class-page#page-goto)
* [`Page.ReloadAsync()`](/dotnet/api/class-page#page-reload)
* [`Page.SetContentAsync()`](/dotnet/api/class-page#page-set-content)
* [`Page.RunAndWaitForNavigationAsync()`](/dotnet/api/class-page#page-wait-for-navigation)
* [`Page.WaitForURLAsync()`](/dotnet/api/class-page#page-wait-for-url)

::: info
[`Page.SetDefaultNavigationTimeout()`](/dotnet/api/class-page#page-set-default-navigation-timeout) takes priority over [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout),
[`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) and [`BrowserContext.SetDefaultNavigationTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-navigation-timeout).
:::

**Arguments**

- <a id="page-set-default-navigation-timeout-option-timeout"></a>`timeout` `float`

  Maximum navigation time in milliseconds


### Page.SetDefaultTimeout() {#page-set-default-timeout}

<Badge type="info" text="Added in: v1.8" />

This setting will change the default maximum time for all the methods accepting [`timeout`](/dotnet/api/class-page#page-set-default-timeout-option-timeout) option.

::: info
[`Page.SetDefaultNavigationTimeout()`](/dotnet/api/class-page#page-set-default-navigation-timeout) takes priority over [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout).
:::

**Arguments**

- <a id="page-set-default-timeout-option-timeout"></a>`timeout` `float`

  Maximum time in milliseconds. Pass `0` to disable timeout.


### Page.SetExtraHTTPHeadersAsync() {#page-set-extra-http-headers}

<Badge type="info" text="Added in: v1.8" />

The extra HTTP headers will be sent with every request the page initiates.

::: info
[`Page.SetExtraHTTPHeadersAsync()`](/dotnet/api/class-page#page-set-extra-http-headers) does not guarantee the order of headers in the outgoing requests.
:::

**Arguments**

- <a id="page-set-extra-http-headers-option-headers"></a>`headers` `Object<string, string>`

  An object containing additional HTTP headers to be sent with every request. All header values must be strings.


### Page.SetInputFilesAsync() {#page-set-input-files}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.SetInputFilesAsync()`](/dotnet/api/class-locator#locator-set-input-files) instead. Read more about [locators](../locators.md).
:::

Sets the value of the file input to these file paths or files. If some of the `filePaths` are relative paths, then they
are resolved relative to the current working directory. For empty array, clears the selected files.
For inputs with a `[webkitdirectory]` attribute, only a single directory path is supported.

This method expects [`selector`](/dotnet/api/class-page#page-set-input-files-option-selector) to point to an
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
  - <a id="page-set-input-files-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-set-input-files-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.


### Page.SetViewportSizeAsync() {#page-set-viewport-size}

<Badge type="info" text="Added in: v1.8" />

In the case of multiple pages in a single browser, each page can have its own viewport size. However,
[`Browser.NewContextAsync()`](/dotnet/api/class-browser#browser-new-context) allows to set viewport size (and more) for all pages in the context at once.

[`Page.SetViewportSizeAsync()`](/dotnet/api/class-page#page-set-viewport-size) will resize the page. A lot of websites don't expect phones to change size, so you should set the
viewport size before navigating to the page. [`Page.SetViewportSizeAsync()`](/dotnet/api/class-page#page-set-viewport-size) will also reset `screen` size, use [`Browser.NewContextAsync()`](/dotnet/api/class-browser#browser-new-context) with `screen` and `viewport` parameters if you need better control of these properties.

**Usage**

```csharp
var page = await browser.NewPageAsync();
await page.SetViewportSizeAsync(640, 480);
await page.GotoAsync("https://www.microsoft.com");
```

**Arguments**

- <a id="page-set-viewport-size-option-width"></a>`width` `int` <Badge type="info" text="Added in: v1.10" />

  Page width in pixels.
- <a id="page-set-viewport-size-option-height"></a>`height` `int` <Badge type="info" text="Added in: v1.10" />

  Page height in pixels.


### Page.TapAsync() {#page-tap}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.TapAsync()`](/dotnet/api/class-locator#locator-tap) instead. Read more about [locators](../locators.md).
:::

This method taps an element matching [`selector`](/dotnet/api/class-page#page-tap-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/dotnet/api/class-page#page-tap-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/dotnet/api/class-page#page-tap-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`Page.Touchscreen`](/dotnet/api/class-page#page-touchscreen) to tap the center of the element, or the specified [`position`](/dotnet/api/class-page#page-tap-option-position).

When all steps combined have not finished during the specified [`timeout`](/dotnet/api/class-page#page-tap-option-timeout), this method throws a
[TimeoutError](/dotnet/api/class-timeouterror). Passing zero timeout disables this.

::: info
[`Page.TapAsync()`](/dotnet/api/class-page#page-tap) will throw if the [`hasTouch`](/dotnet/api/class-browser#browser-new-context-option-has-touch) option of the browser context is false.
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
  - <a id="page-tap-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-tap-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-tap-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it. Note that keyboard `modifiers` will be pressed regardless of `trial` to allow testing elements which are only visible when those keys are pressed.


### Page.TextContentAsync() {#page-text-content}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.TextContentAsync()`](/dotnet/api/class-locator#locator-text-content) instead. Read more about [locators](../locators.md).
:::

Returns `element.textContent`.

**Arguments**

- <a id="page-text-content-option-selector"></a>`selector` `string`

  A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
- <a id="page-text-content-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-text-content-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-text-content-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `null | string`


### Page.TitleAsync() {#page-title}

<Badge type="info" text="Added in: v1.8" />

Returns the page's title.

**Returns**

- `string`


### Page.UncheckAsync() {#page-uncheck}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use locator-based [`Locator.UncheckAsync()`](/dotnet/api/class-locator#locator-uncheck) instead. Read more about [locators](../locators.md).
:::

This method unchecks an element matching [`selector`](/dotnet/api/class-page#page-uncheck-option-selector) by performing the following steps:
1. Find an element matching [`selector`](/dotnet/api/class-page#page-uncheck-option-selector). If there is none, wait until a matching element is attached to
   the DOM.
1. Ensure that matched element is a checkbox or a radio input. If not, this method throws. If the element is already
   unchecked, this method returns immediately.
1. Wait for [actionability](../actionability.md) checks on the matched element, unless [`force`](/dotnet/api/class-page#page-uncheck-option-force) option is
   set. If the element is detached during the checks, the whole action is retried.
1. Scroll the element into view if needed.
1. Use [`Page.Mouse`](/dotnet/api/class-page#page-mouse) to click in the center of the element.
1. Ensure that the element is now unchecked. If not, this method throws.

When all steps combined have not finished during the specified [`timeout`](/dotnet/api/class-page#page-uncheck-option-timeout), this method throws a
[TimeoutError](/dotnet/api/class-timeouterror). Passing zero timeout disables this.

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
  - <a id="page-uncheck-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-uncheck-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-uncheck-option-trial"></a>`trial` `boolean` *(optional)* <Badge type="info" text="Added in: v1.11" />

    When set, this method only performs the [actionability](../actionability.md) checks and skips the action. Defaults to `false`. Useful to wait until the element is ready for the action without performing it.


### Page.UnrouteAsync() {#page-unroute}

<Badge type="info" text="Added in: v1.8" />

Removes a route created with [`Page.RouteAsync()`](/dotnet/api/class-page#page-route). When [`handler`](/dotnet/api/class-page#page-unroute-option-handler) is not specified, removes all routes for
the [`url`](/dotnet/api/class-page#page-unroute-option-url).

**Arguments**

- <a id="page-unroute-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  A glob pattern, regex pattern, or predicate receiving [URL] to match while routing.
- <a id="page-unroute-option-handler"></a>`handler` `function(Route)` *(optional)*

  Optional handler function to route the request.


### Page.UnrouteAllAsync() {#page-unroute-all}

<Badge type="info" text="Added in: v1.41" />

Removes all routes created with [`Page.RouteAsync()`](/dotnet/api/class-page#page-route) and [`Page.RouteFromHARAsync()`](/dotnet/api/class-page#page-route-from-har).

**Arguments**

- <a id="page-unroute-all-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-unroute-all-option-behavior"></a>`behavior` `"wait" | "ignoreErrors" | "default"` *(optional)*

    Specifies whether to wait for already running handlers and what to do if they throw errors:
    * `'default'` - do not wait for current handler calls (if any) to finish, if unrouted handler throws, it may result in unhandled error
    * `'wait'` - wait for current handler calls (if any) to finish
    * `'ignoreErrors'` - do not wait for current handler calls (if any) to finish, all errors thrown by the handlers after unrouting are silently caught


### Page.Url() {#page-url}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `string`


### Page.Video() {#page-video}

<Badge type="info" text="Added in: v1.8" />

Video object associated with this page. Can be used to access the video file when using the `recordVideo` context option.

**Returns**

- `null | Video`


### Page.ViewportSize() {#page-viewport-size}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `null | Object`


### Page.WaitForFunctionAsync() {#page-wait-for-function}

<Badge type="info" text="Added in: v1.8" />

Returns when the [`expression`](/dotnet/api/class-page#page-wait-for-function-option-expression) returns a truthy value. It resolves to a JSHandle of the truthy value.

**Usage**

The [`Page.WaitForFunctionAsync()`](/dotnet/api/class-page#page-wait-for-function) can be used to observe viewport size change:

```csharp
using Microsoft.Playwright;
using System.Threading.Tasks;

class FrameExamples
{
  public static async Task WaitForFunction()
  {
    using var playwright = await Playwright.CreateAsync();
    await using var browser = await playwright.Webkit.LaunchAsync();
    var page = await browser.NewPageAsync();
    await page.SetViewportSizeAsync(50, 50);
    await page.MainFrame.WaitForFunctionAsync("window.innerWidth < 100");
  }
}
```

To pass an argument to the predicate of [`Page.WaitForFunctionAsync()`](/dotnet/api/class-page#page-wait-for-function) function:

```csharp
var selector = ".foo";
await page.WaitForFunctionAsync("selector => !!document.querySelector(selector)", selector);
```

**Arguments**

- <a id="page-wait-for-function-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="page-wait-for-function-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/dotnet/api/class-page#page-wait-for-function-option-expression).
- <a id="page-wait-for-function-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-function-option-polling-interval"></a>`pollingInterval` `float` *(optional)*

    If specified, then it is treated as an interval in milliseconds at which the function would be executed. By default if the option is not specified [`expression`](/dotnet/api/class-page#page-wait-for-function-option-expression) is executed in `requestAnimationFrame` callback.
  - <a id="page-wait-for-function-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default
    value can be changed by using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `JSHandle`


### Page.WaitForLoadStateAsync() {#page-wait-for-load-state}

<Badge type="info" text="Added in: v1.8" />

Returns when the required load state has been reached.

This resolves when the page reaches a required load state, `load` by default. The navigation must have been committed
when this method is called. If current document has already reached the required state, resolves immediately.

::: info
Most of the time, this method is not needed because Playwright [auto-waits before every action](../actionability.md).
:::

**Usage**

```csharp
await page.GetByRole(AriaRole.Button).ClickAsync(); // Click triggers navigation.
await page.WaitForLoadStateAsync(); // The promise resolves after 'load' event.
```

```csharp
var popup = await page.RunAndWaitForPopupAsync(async () =>
{
    await page.GetByRole(AriaRole.Button).ClickAsync(); // click triggers the popup
});
// Wait for the "DOMContentLoaded" event.
await popup.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
Console.WriteLine(await popup.TitleAsync()); // popup is ready to use.
```

**Arguments**

- <a id="page-wait-for-load-state-option-state"></a>`state` `"load" | "domcontentloaded" | "networkidle"` *(optional)*

  Optional load state to wait for, defaults to `load`. If the state has been already reached while loading current document, the
  method resolves immediately. Can be one of:
  * `'load'` - wait for the `load` event to be fired.
  * `'domcontentloaded'` - wait for the `DOMContentLoaded` event to be fired.
  * `'networkidle'` - **DISCOURAGED** wait until there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
- <a id="page-wait-for-load-state-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-load-state-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`BrowserContext.SetDefaultNavigationTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout),
    [`Page.SetDefaultNavigationTimeout()`](/dotnet/api/class-page#page-set-default-navigation-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.


### Page.WaitForSelectorAsync() {#page-wait-for-selector}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Use web assertions that assert visibility or a locator-based [`Locator.WaitForAsync()`](/dotnet/api/class-locator#locator-wait-for) instead.↵Read more about [locators](../locators.md).
:::

Returns when element specified by selector satisfies [`state`](/dotnet/api/class-page#page-wait-for-selector-option-state) option. Returns `null` if waiting for `hidden` or
`detached`.

::: info
Playwright automatically waits for element to be ready before performing an action. Using
[Locator](/dotnet/api/class-locator) objects and web-first assertions makes the code wait-for-selector-free.
:::

Wait for the [`selector`](/dotnet/api/class-page#page-wait-for-selector-option-selector) to satisfy [`state`](/dotnet/api/class-page#page-wait-for-selector-option-state) option (either appear/disappear from dom, or become
visible/hidden). If at the moment of calling the method [`selector`](/dotnet/api/class-page#page-wait-for-selector-option-selector) already satisfies the condition, the method
will return immediately. If the selector doesn't satisfy the condition for the [`timeout`](/dotnet/api/class-page#page-wait-for-selector-option-timeout) milliseconds, the
function will throw.

**Usage**

This method works across navigations:

```csharp
using Microsoft.Playwright;
using System;
using System.Threading.Tasks;

class FrameExamples
{
  public static async Task Images()
  {
      using var playwright = await Playwright.CreateAsync();
      await using var browser = await playwright.Chromium.LaunchAsync();
      var page = await browser.NewPageAsync();

      foreach (var currentUrl in new[] { "https://www.google.com", "https://bbc.com" })
      {
          await page.GotoAsync(currentUrl);
          var element = await page.WaitForSelectorAsync("img");
          Console.WriteLine($"Loaded image: {await element.GetAttributeAsync("src")}");
      }

      await browser.CloseAsync();
  }
}
```

**Arguments**

- <a id="page-wait-for-selector-option-selector"></a>`selector` `string`

  A selector to query for.
- <a id="page-wait-for-selector-option-options"></a>`options` `Object` *(optional)*

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

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

**Returns**

- `null | ElementHandle`


### Page.WaitForTimeoutAsync() {#page-wait-for-timeout}

<Badge type="info" text="Added in: v1.8" />

::: warning Discouraged
Never wait for timeout in production. Tests that wait for time are↵inherently flaky. Use [Locator](/dotnet/api/class-locator) actions and web assertions that wait automatically.
:::

Waits for the given [`timeout`](/dotnet/api/class-page#page-wait-for-timeout-option-timeout) in milliseconds.

Note that `page.waitForTimeout()` should only be used for debugging. Tests using the timer in production are going to be
flaky. Use signals such as network events, selectors becoming visible and others instead.

**Usage**

```csharp
// Wait for 1 second
await page.WaitForTimeoutAsync(1000);
```

**Arguments**

- <a id="page-wait-for-timeout-option-timeout"></a>`timeout` `float`

  A timeout to wait for


### Page.WaitForURLAsync() {#page-wait-for-url}

<Badge type="info" text="Added in: v1.11" />

Waits for the main frame to navigate to the given URL.

**Usage**

```csharp
await page.ClickAsync("a.delayed-navigation"); // clicking the link will indirectly cause a navigation
await page.WaitForURLAsync("**/target.html");
```

**Arguments**

- <a id="page-wait-for-url-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  A glob pattern, regex pattern, or predicate receiving [URL] to match while waiting for the navigation. Note that if
  the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly
  equal to the string.
- <a id="page-wait-for-url-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-url-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`BrowserContext.SetDefaultNavigationTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout),
    [`Page.SetDefaultNavigationTimeout()`](/dotnet/api/class-page#page-set-default-navigation-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-wait-for-url-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.


### Page.Workers() {#page-workers}

<Badge type="info" text="Added in: v1.8" />

This method returns all of the dedicated [WebWorkers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
associated with the page.

::: info
This does not contain ServiceWorkers
:::

**Returns**

- `Array<Worker>`


## Properties

### Page.APIRequest {#page-request}

<Badge type="info" text="Added in: v1.16" />

API testing helper associated with this page. This method returns the same instance as
[`BrowserContext.APIRequest`](/dotnet/api/class-browsercontext#browser-context-request) on the page's context. See [`BrowserContext.APIRequest`](/dotnet/api/class-browsercontext#browser-context-request) for more details.

**Type**

- `APIRequestContext`


### Page.Clock {#page-clock}

<Badge type="info" text="Added in: v1.45" />

Playwright has ability to mock clock and passage of time.

**Type**

- `Clock`


### Page.Keyboard {#page-keyboard}

<Badge type="info" text="Added in: v1.8" />

**Type**

- `Keyboard`


### Page.LocalStorage {#page-local-storage}

<Badge type="info" text="Added in: v1.61" />

Provides access to the page's `localStorage` for the current origin. See [WebStorage](/dotnet/api/class-webstorage).

**Type**

- `WebStorage`


### Page.Mouse {#page-mouse}

<Badge type="info" text="Added in: v1.8" />

**Type**

- `Mouse`


### Page.Screencast {#page-screencast}

<Badge type="info" text="Added in: v1.59" />

[Screencast](/dotnet/api/class-screencast) object associated with this page.

**Usage**

**Type**

- `Screencast`


### Page.SessionStorage {#page-session-storage}

<Badge type="info" text="Added in: v1.61" />

Provides access to the page's `sessionStorage` for the current origin. See [WebStorage](/dotnet/api/class-webstorage).

**Type**

- `WebStorage`


### Page.Touchscreen {#page-touchscreen}

<Badge type="info" text="Added in: v1.8" />

**Type**

- `Touchscreen`


### Page.Webmcp {#page-webmcp}

<Badge type="info" text="Added in: v1.64" />

Tools that the main frame registers through the experimental [WebMCP](https://webmachinelearning.github.io/webmcp/) browser API. Shortcut for [`Frame.Webmcp`](/dotnet/api/class-frame#frame-webmcp) of [`Page.MainFrame()`](/dotnet/api/class-page#page-main-frame), see [WebMCP](/dotnet/api/class-webmcp) for details.

**Usage**

**Type**

- `WebMCP`


## Events

### Page.Close {#page-event-close}

<Badge type="info" text="Added in: v1.8" />

Emitted when the page closes.

**Event data**

- `Page`


### Page.Console {#page-event-console}

<Badge type="info" text="Added in: v1.8" />

Emitted when JavaScript within the page calls one of console API methods, e.g. `console.log` or `console.dir`.

The arguments passed into `console.log` are available on the [ConsoleMessage](/dotnet/api/class-consolemessage) event handler argument.

**Usage**

```csharp
page.Console += async (_, msg) =>
{
    foreach (var arg in msg.Args)
        Console.WriteLine(await arg.JsonValueAsync<object>());
};

await page.EvaluateAsync("console.log('hello', 5, { foo: 'bar' })");
```

**Event data**

- `ConsoleMessage`


### Page.Crash {#page-event-crash}

<Badge type="info" text="Added in: v1.8" />

Emitted when the page crashes. Browser pages might crash if they try to allocate too much memory. When the page crashes,
ongoing and subsequent operations will throw.

The most common way to deal with crashes is to catch an exception:

```csharp
try {
  // Crash might happen during a click.
  await page.ClickAsync("button");
  // Or while waiting for an event.
  await page.WaitForPopup();
} catch (PlaywrightException e) {
  // When the page crashes, exception message contains "crash".
}
```

**Event data**

- `Page`


### Page.Dialog {#page-event-dialog}

<Badge type="info" text="Added in: v1.8" />

Emitted when a JavaScript dialog appears, such as `alert`, `prompt`, `confirm` or `beforeunload`. Listener **must** either [`Dialog.AcceptAsync()`](/dotnet/api/class-dialog#dialog-accept) or [`Dialog.DismissAsync()`](/dotnet/api/class-dialog#dialog-dismiss) the dialog - otherwise the page will [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#never_blocking) waiting for the dialog, and actions like click will never finish.

**Usage**

```csharp
page.RequestFailed += (_, request) =>
{
    Console.WriteLine(request.Url + " " + request.Failure);
};
```

::: info
When no [`Page.Dialog`](/dotnet/api/class-page#page-event-dialog) or [`BrowserContext.Dialog`](/dotnet/api/class-browsercontext#browser-context-event-dialog) listeners are present, all dialogs are automatically dismissed.
:::

**Event data**

- `Dialog`


### Page.DialogClosed {#page-event-dialog-closed}

<Badge type="info" text="Added in: v1.63" />

Emitted when a JavaScript dialog has been closed, either by [`Dialog.AcceptAsync()`](/dotnet/api/class-dialog#dialog-accept), by [`Dialog.DismissAsync()`](/dotnet/api/class-dialog#dialog-dismiss), or manually by the user in the headed browser.

**Event data**

- `Dialog`


### Page.DOMContentLoaded {#page-event-dom-content-loaded}

<Badge type="info" text="Added in: v1.9" />

Emitted when the JavaScript [`DOMContentLoaded`](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded)
event is dispatched.

**Event data**

- `Page`


### Page.Download {#page-event-download}

<Badge type="info" text="Added in: v1.8" />

Emitted when attachment download started. User can access basic file operations on downloaded content via the passed
[Download](/dotnet/api/class-download) instance.

**Event data**

- `Download`


### Page.FileChooser {#page-event-file-chooser}

<Badge type="info" text="Added in: v1.9" />

Emitted when a file chooser is supposed to appear, such as after clicking the  `<input type=file>`. Playwright can
respond to it via setting the input files using [`FileChooser.SetFilesAsync()`](/dotnet/api/class-filechooser#file-chooser-set-files) that can be uploaded after that.

```csharp
page.FileChooser += (_, fileChooser) =>
{
    fileChooser.SetFilesAsync(@"C:\temp\myfile.pdf");
};
```

**Event data**

- `FileChooser`


### Page.FrameAttached {#page-event-frame-attached}

<Badge type="info" text="Added in: v1.9" />

Emitted when a frame is attached.

**Event data**

- `Frame`


### Page.FrameDetached {#page-event-frame-detached}

<Badge type="info" text="Added in: v1.9" />

Emitted when a frame is detached.

**Event data**

- `Frame`


### Page.FrameNavigated {#page-event-frame-navigated}

<Badge type="info" text="Added in: v1.9" />

Emitted when a frame is navigated to a new url.

**Event data**

- `Frame`


### Page.Load {#page-event-load}

<Badge type="info" text="Added in: v1.8" />

Emitted when the JavaScript [`load`](https://developer.mozilla.org/en-US/docs/Web/Events/load) event is dispatched.

**Event data**

- `Page`


### Page.PageError {#page-event-page-error}

<Badge type="info" text="Added in: v1.9" />

Emitted when an uncaught exception happens within the page.

```csharp
// Log all uncaught errors to the terminal
page.PageError += (_, exception) =>
{
  Console.WriteLine("Uncaught exception: " + exception);
};
```

**Event data**

- `string`


### Page.Popup {#page-event-popup}

<Badge type="info" text="Added in: v1.8" />

Emitted when the page opens a new tab or window. This event is emitted in addition to the
[`BrowserContext.Page`](/dotnet/api/class-browsercontext#browser-context-event-page), but only for popups relevant to this page.

The earliest moment that page is available is when it has navigated to the initial url. For example, when opening a
popup with `window.open('http://example.com')`, this event will fire when the network request to "http://example.com" is
done and its response has started loading in the popup. If you would like to route/listen to this network request, use [`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route) and [`BrowserContext.Request`](/dotnet/api/class-browsercontext#browser-context-event-request) respectively instead of similar methods on the [Page](/dotnet/api/class-page).

```csharp
var popup = await page.RunAndWaitForPopupAsync(async () =>
{
    await page.GetByText("open the popup").ClickAsync();
});
Console.WriteLine(await popup.EvaluateAsync<string>("location.href"));
```

::: info
Use [`Page.WaitForLoadStateAsync()`](/dotnet/api/class-page#page-wait-for-load-state) to wait until the page gets to a particular state (you should not need it in most
cases).
:::

**Event data**

- `Page`


### Page.Request {#page-event-request}

<Badge type="info" text="Added in: v1.8" />

Emitted when a page issues a request. The [request] object is read-only. In order to intercept and mutate requests, see
[`Page.RouteAsync()`](/dotnet/api/class-page#page-route) or [`BrowserContext.RouteAsync()`](/dotnet/api/class-browsercontext#browser-context-route).

**Event data**

- `Request`


### Page.RequestFailed {#page-event-request-failed}

<Badge type="info" text="Added in: v1.9" />

Emitted when a request fails, for example by timing out.

::: info
HTTP Error responses, such as 404 or 503, are still successful responses from HTTP standpoint, so request will complete
with [`Page.RequestFinished`](/dotnet/api/class-page#page-event-request-finished) event and not with [`Page.RequestFailed`](/dotnet/api/class-page#page-event-request-failed). A request will only be considered
failed when the client cannot get an HTTP response from the server, e.g. due to network error net::ERR_FAILED.
:::

**Event data**

- `Request`


### Page.RequestFinished {#page-event-request-finished}

<Badge type="info" text="Added in: v1.9" />

Emitted when a request finishes successfully after downloading the response body. For a successful response, the
sequence of events is `request`, `response` and `requestfinished`.

**Event data**

- `Request`


### Page.Response {#page-event-response}

<Badge type="info" text="Added in: v1.8" />

Emitted when [response] status and headers are received for a request. For a successful response, the sequence of events
is `request`, `response` and `requestfinished`.

**Event data**

- `Response`


### Page.WebSocket {#page-event-web-socket}

<Badge type="info" text="Added in: v1.9" />

Emitted when [WebSocket](/dotnet/api/class-websocket) request is sent.

**Event data**

- `WebSocket`


### Page.Worker {#page-event-worker}

<Badge type="info" text="Added in: v1.8" />

Emitted when a dedicated [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) is spawned by the
page.

**Event data**

- `Worker`


## Deprecated

### Page.RunAndWaitForNavigationAsync() {#page-wait-for-navigation}

<Badge type="info" text="Added in: v1.8" />

::: danger Deprecated
This method is inherently racy, please use [`Page.WaitForURLAsync()`](/dotnet/api/class-page#page-wait-for-url) instead.
:::

Waits for the main frame navigation and returns the main resource response. In case of multiple redirects, the navigation
will resolve with the response of the last redirect. In case of navigation to a different anchor or navigation due to
History API usage, the navigation will resolve with `null`.

**Usage**

This resolves when the page navigates to a new URL or reloads. It is useful for when you run code which will indirectly
cause the page to navigate. e.g. The click target has an `onclick` handler that triggers navigation from a `setTimeout`.
Consider this example:

```csharp
await page.RunAndWaitForNavigationAsync(async () =>
{
    // This action triggers the navigation after a timeout.
    await page.GetByText("Navigate after timeout").ClickAsync();
});

// The method continues after navigation has finished
```

::: info
Usage of the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) to change the URL is considered
a navigation.
:::

**Arguments**

- <a id="page-wait-for-navigation-option-action"></a>`action` `Func<Task>` <Badge type="info" text="Added in: v1.12" />

  Action that triggers the event.
- <a id="page-wait-for-navigation-option-options"></a>`options` `Object` *(optional)*

  - <a id="page-wait-for-navigation-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum operation time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout.
    The default value can be changed by using the
    [`BrowserContext.SetDefaultNavigationTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-navigation-timeout),
    [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout),
    [`Page.SetDefaultNavigationTimeout()`](/dotnet/api/class-page#page-set-default-navigation-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.
  - <a id="page-wait-for-navigation-option-url"></a>`url` `string` *(optional)*

    A glob pattern, regex pattern, or predicate receiving [URL] to match while waiting for the navigation. Note that if
    the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly
    equal to the string.
  - <a id="page-wait-for-navigation-option-url-func"></a>`urlFunc` `function(URL): boolean` *(optional)*

    A glob pattern, regex pattern, or predicate receiving [URL] to match while waiting for the navigation. Note that if
    the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly
    equal to the string.
  - <a id="page-wait-for-navigation-option-url-regex"></a>`urlRegex` `RegExp` *(optional)*

    A glob pattern, regex pattern, or predicate receiving [URL] to match while waiting for the navigation. Note that if
    the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly
    equal to the string.
  - <a id="page-wait-for-navigation-option-url-string"></a>`urlString` `string` *(optional)*

    A glob pattern, regex pattern, or predicate receiving [URL] to match while waiting for the navigation. Note that if
    the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly
    equal to the string.
  - <a id="page-wait-for-navigation-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(optional)*

    When to consider operation succeeded, defaults to `load`. Events can be either:
    * `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
    * `'load'` - consider operation to be finished when the `load` event is fired.
    * `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
    * `'commit'` - consider operation to be finished when network response is received and the document started loading.

**Returns**

- `null | Response`


### Page.TypeAsync() {#page-type}

<Badge type="info" text="Added in: v1.8" />

::: danger Deprecated
In most cases, you should use [`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill) instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use [`Locator.PressSequentiallyAsync()`](/dotnet/api/class-locator#locator-press-sequentially).
:::

Sends a `keydown`, `keypress`/`input`, and `keyup` event for each character in the text. `page.type` can be used to send
fine-grained keyboard events. To fill values in form fields, use [`Page.FillAsync()`](/dotnet/api/class-page#page-fill).

To press a special key, like `Control` or `ArrowDown`, use [`Keyboard.PressAsync()`](/dotnet/api/class-keyboard#keyboard-press).

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
  - <a id="page-type-option-strict"></a>`strict` `boolean` *(optional)* <Badge type="info" text="Added in: v1.14" />

    When true, the call requires selector to resolve to a single element. If given selector resolves to more
    than one element, the call throws an exception.
  - <a id="page-type-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default value can be changed by
    using the [`BrowserContext.SetDefaultTimeout()`](/dotnet/api/class-browsercontext#browser-context-set-default-timeout) or
    [`Page.SetDefaultTimeout()`](/dotnet/api/class-page#page-set-default-timeout) methods.

