---
title: ConsoleMessage
outline: 2
---

# ConsoleMessage

<Badge type="info" text="Added in: v1.8" />

[ConsoleMessage](/api/class-consolemessage) objects are dispatched by page via the [`page.on('console')`](/api/class-page#page-event-console) event.
For each console message logged in the page there will be corresponding event in the Playwright
context.

```js
// Listen for all console logs
page.on('console', msg => console.log(msg.text()));

// Listen for all console events and handle errors
page.on('console', msg => {
  if (msg.type() === 'error')
    console.log(`Error text: "${msg.text()}"`);
});

// Get the next console log
const msgPromise = page.waitForEvent('console');
await page.evaluate(() => {
  console.log('hello', 42, { foo: 'bar' });  // Issue console.log inside the page
});
const msg = await msgPromise;

// Deconstruct console log arguments
await msg.args()[0].jsonValue(); // hello
await msg.args()[1].jsonValue(); // 42
```

## Methods

### consoleMessage.args() {#console-message-args}

<Badge type="info" text="Added in: v1.8" />

List of arguments passed to a `console` function call. See also [`page.on('console')`](/api/class-page#page-event-console).

**Returns**

- `Array<JSHandle>`


### consoleMessage.location() {#console-message-location}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `Object`


### consoleMessage.page() {#console-message-page}

<Badge type="info" text="Added in: v1.34" />

The page that produced this console message, if any.

**Returns**

- `null | Page`


### consoleMessage.text() {#console-message-text}

<Badge type="info" text="Added in: v1.8" />

The text of the console message.

**Returns**

- `string`


### consoleMessage.timestamp() {#console-message-timestamp}

<Badge type="info" text="Added in: v1.59" />

The timestamp of the console message in milliseconds since the Unix epoch.

**Returns**

- `float`


### consoleMessage.type() {#console-message-type}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `"log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "time" | "timeEnd"`


### consoleMessage.worker() {#console-message-worker}

<Badge type="info" text="Added in: v1.57" />

The web worker or service worker that produced this console message, if any. Note that console messages from web workers also have non-null [`consoleMessage.page()`](/api/class-consolemessage#console-message-page).

**Returns**

- `null | Worker`

