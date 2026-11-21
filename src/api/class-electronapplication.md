---
title: ElectronApplication
outline: 2
---

# ElectronApplication

<Badge type="info" text="Added in: v1.9" />

Electron application representation. You can use [`electron.launch()`](/api/class-electron#electron-launch) to
obtain the application instance. This instance you can control main electron process
as well as work with Electron windows:

```js
const { _electron: electron } = require('playwright');

(async () => {
  // Launch Electron app.
  const electronApp = await electron.launch({ args: ['main.js'] });

  // Evaluation expression in the Electron context.
  const appPath = await electronApp.evaluate(async ({ app }) => {
    // This runs in the main Electron process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.getAppPath();
  });
  console.log(appPath);

  // Get the first window that the app opens, wait if necessary.
  const window = await electronApp.firstWindow();
  // Print the title.
  console.log(await window.title());
  // Capture a screenshot.
  await window.screenshot({ path: 'intro.png' });
  // Direct Electron console to Node terminal.
  window.on('console', console.log);
  // Click button.
  await window.click('text=Click me');
  // Exit app.
  await electronApp.close();
})();
```

## Methods

### electronApplication.browserWindow() {#electron-application-browser-window}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

Returns the BrowserWindow object that corresponds to the given Playwright page.

**Arguments**

- <a id="electron-application-browser-window-option-page"></a>`page` `Page`

  Page to retrieve the window for.

**Returns**

- `Promise<JSHandle>`


### electronApplication.close() {#electron-application-close}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Closes Electron application.


### electronApplication.context() {#electron-application-context}

<Badge type="info" text="Added in: v1.9" />

This method returns browser context that can be used for setting up context-wide routing, etc.

**Returns**

- `BrowserContext`


### electronApplication.evaluate() {#electron-application-evaluate}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Returns the return value of [`pageFunction`](/api/class-electronapplication#electron-application-evaluate-option-expression).

If the function passed to the [`electronApplication.evaluate()`](/api/class-electronapplication#electron-application-evaluate) returns a [Promise], then
[`electronApplication.evaluate()`](/api/class-electronapplication#electron-application-evaluate) would wait for the promise to resolve and return its value.

If the function passed to the [`electronApplication.evaluate()`](/api/class-electronapplication#electron-application-evaluate) returns a non-[Serializable] value, then
[`electronApplication.evaluate()`](/api/class-electronapplication#electron-application-evaluate) returns `undefined`. Playwright also supports transferring
some additional values that are not serializable by `JSON`: `-0`, `NaN`, `Infinity`, `-Infinity`.

**Arguments**

- <a id="electron-application-evaluate-option-expression"></a>`pageFunction` `function() | Electron`

  Function to be evaluated in the main Electron process.
- <a id="electron-application-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-electronapplication#electron-application-evaluate-option-expression).

**Returns**

- `Promise<Serializable>`


### electronApplication.evaluateHandle() {#electron-application-evaluate-handle}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Returns the return value of [`pageFunction`](/api/class-electronapplication#electron-application-evaluate-handle-option-expression) as a [JSHandle](/api/class-jshandle).

The only difference between [`electronApplication.evaluate()`](/api/class-electronapplication#electron-application-evaluate) and [`electronApplication.evaluateHandle()`](/api/class-electronapplication#electron-application-evaluate-handle) is that [`electronApplication.evaluateHandle()`](/api/class-electronapplication#electron-application-evaluate-handle) returns [JSHandle](/api/class-jshandle).

If the function passed to the [`electronApplication.evaluateHandle()`](/api/class-electronapplication#electron-application-evaluate-handle) returns a [Promise], then
[`electronApplication.evaluateHandle()`](/api/class-electronapplication#electron-application-evaluate-handle) would wait for the promise to resolve and return its value.

**Arguments**

- <a id="electron-application-evaluate-handle-option-expression"></a>`pageFunction` `function() | Electron`

  Function to be evaluated in the main Electron process.
- <a id="electron-application-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-electronapplication#electron-application-evaluate-handle-option-expression).

**Returns**

- `Promise<JSHandle>`


### electronApplication.firstWindow() {#electron-application-first-window}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Convenience method that waits for the first application window to be opened.

**Usage**

```js
const electronApp = await electron.launch({
  args: ['main.js']
});
const window = await electronApp.firstWindow();
// ...
```

**Arguments**

- <a id="electron-application-first-window-option-options"></a>`options` `Object` *(optional)*

  - <a id="electron-application-first-window-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.33" />

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds).
    Pass `0` to disable timeout. The default value can be changed by using the
    [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `Promise<Page>`


### electronApplication.process() {#electron-application-process}

<Badge type="info" text="Added in: v1.21" />

Returns the main process for this Electron Application.

**Returns**

- `ChildProcess`


### electronApplication.waitForEvent() {#electron-application-wait-for-event}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

Waits for event to fire and passes its value into the predicate function. Returns when the predicate returns truthy value. Will throw an error if the application is closed before the event is fired. Returns the event data value.

**Usage**

```js
const windowPromise = electronApp.waitForEvent('window');
await mainWindow.click('button');
const window = await windowPromise;
```

**Arguments**

- <a id="electron-application-wait-for-event-option-event"></a>`event` `string`

  Event name, same one typically passed into `*.on(event)`.
- <a id="electron-application-wait-for-event-option-options-or-predicate"></a>`optionsOrPredicate` `function() | Object` *(optional)*

  Either a predicate that receives an event or an options object. Optional.

  - `predicate` `function()`

    receives the event data and resolves to truthy value when the waiting should resolve.
  - `timeout` `float` *(optional)*

    maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to
    disable timeout. The default value can be changed by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `Promise<any>`


### electronApplication.windows() {#electron-application-windows}

<Badge type="info" text="Added in: v1.9" />

Convenience method that returns all the opened windows.

**Returns**

- `Array<Page>`


## Events

### electronApplication.on('close') {#electron-application-event-close}

<Badge type="info" text="Added in: v1.9" />

This event is issued when the application process has been terminated.

**Event data**

- `void`


### electronApplication.on('console') {#electron-application-event-console}

<Badge type="info" text="Added in: v1.42" />

Emitted when JavaScript within the Electron main process calls one of console API methods, e.g. `console.log` or `console.dir`.

The arguments passed into `console.log` are available on the [ConsoleMessage](/api/class-consolemessage) event handler argument.

**Usage**

```js
electronApp.on('console', async msg => {
  const values = [];
  for (const arg of msg.args())
    values.push(await arg.jsonValue());
  console.log(...values);
});
await electronApp.evaluate(() => console.log('hello', 5, { foo: 'bar' }));
```

**Event data**

- `ConsoleMessage`


### electronApplication.on('window') {#electron-application-event-window}

<Badge type="info" text="Added in: v1.9" />

This event is issued for every window that is created **and loaded** in Electron. It contains a [Page](/api/class-page) that can
be used for Playwright automation.

**Event data**

- `Page`

