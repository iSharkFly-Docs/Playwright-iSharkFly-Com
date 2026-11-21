---
title: ElectronApplication
outline: 2
---

# ElectronApplication

<Badge type="info" text="Added in: v1.9" />

Electron 应用程序表示。你可以使用 [`electron.launch()`](/api/class-electron#electron-launch) 获取应用程序实例。使用此实例可以控制 Electron 主进程以及操作 Electron 窗口：

```js
const { _electron: electron } = require('playwright');

(async () => {
  // 启动 Electron 应用。
  const electronApp = await electron.launch({ args: ['main.js'] });

  // 在 Electron 上下文中执行表达式。
  const appPath = await electronApp.evaluate(async ({ app }) => {
    // 这在 Electron 主进程中运行，这里的参数始终是
    // 主应用脚本中 require('electron') 的结果。
    return app.getAppPath();
  });
  console.log(appPath);

  // 获取应用打开的第一个窗口，如有必要则等待。
  const window = await electronApp.firstWindow();
  // 打印标题。
  console.log(await window.title());
  // 捕获截图。
  await window.screenshot({ path: 'intro.png' });
  // 将 Electron 控制台输出定向到 Node 终端。
  window.on('console', console.log);
  // 点击按钮。
  await window.click('text=Click me');
  // 退出应用。
  await electronApp.close();
})();
```

## 方法

### electronApplication.browserWindow() {#electron-application-browser-window}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

返回与给定 Playwright 页面对应的 BrowserWindow 对象。

**参数**

- <a id="electron-application-browser-window-option-page"></a>`page` `Page`

  要检索窗口的页面。

**返回值**

- `Promise<JSHandle>`


### electronApplication.close() {#electron-application-close}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

关闭 Electron 应用程序。


### electronApplication.context() {#electron-application-context}

<Badge type="info" text="Added in: v1.9" />

此方法返回可用于设置上下文级别路由等的浏览器上下文。

**返回值**

- `BrowserContext`


### electronApplication.evaluate() {#electron-application-evaluate}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

返回 [`pageFunction`](/api/class-electronapplication#electron-application-evaluate-option-expression) 的返回值。

如果传递给 [`electronApplication.evaluate()`](/api/class-electronapplication#electron-application-evaluate) 的函数返回 [Promise]，则 [`electronApplication.evaluate()`](/api/class-electronapplication#electron-application-evaluate) 将等待 promise 解析并返回其值。

如果传递给 [`electronApplication.evaluate()`](/api/class-electronapplication#electron-application-evaluate) 的函数返回非[可序列化]值，则 [`electronApplication.evaluate()`](/api/class-electronapplication#electron-application-evaluate) 返回 `undefined`。Playwright 还支持传输一些 `JSON` 不可序列化的附加值：`-0`、`NaN`、`Infinity`、`-Infinity`。

**参数**

- <a id="electron-application-evaluate-option-expression"></a>`pageFunction` `function() | Electron`

  要在 Electron 主进程中执行的函数。
- <a id="electron-application-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-electronapplication#electron-application-evaluate-option-expression) 的可选参数。

**返回值**

- `Promise<Serializable>`


### electronApplication.evaluateHandle() {#electron-application-evaluate-handle}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

返回 [`pageFunction`](/api/class-electronapplication#electron-application-evaluate-handle-option-expression) 的返回值作为 [JSHandle](/api/class-jshandle)。

[`electronApplication.evaluate()`](/api/class-electronapplication#electron-application-evaluate) 和 [`electronApplication.evaluateHandle()`](/api/class-electronapplication#electron-application-evaluate-handle) 之间的唯一区别是 [`electronApplication.evaluateHandle()`](/api/class-electronapplication#electron-application-evaluate-handle) 返回 [JSHandle](/api/class-jshandle)。

如果传递给 [`electronApplication.evaluateHandle()`](/api/class-electronapplication#electron-application-evaluate-handle) 的函数返回 [Promise]，则 [`electronApplication.evaluateHandle()`](/api/class-electronapplication#electron-application-evaluate-handle) 将等待 promise 解析并返回其值。

**参数**

- <a id="electron-application-evaluate-handle-option-expression"></a>`pageFunction` `function() | Electron`

  要在 Electron 主进程中执行的函数。
- <a id="electron-application-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-electronapplication#electron-application-evaluate-handle-option-expression) 的可选参数。

**返回值**

- `Promise<JSHandle>`


### electronApplication.firstWindow() {#electron-application-first-window}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

等待应用程序打开第一个窗口的便捷方法。

**用法**

```js
const electronApp = await electron.launch({
  args: ['main.js']
});
const window = await electronApp.firstWindow();
// ...
```

**参数**

- <a id="electron-application-first-window-option-options"></a>`options` `Object` *(可选)*

  - <a id="electron-application-first-window-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.33" />

    最大等待时间（毫秒）。默认为 `30000`（30 秒）。
    传递 `0` 禁用超时。可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 更改默认值。

**返回值**

- `Promise<Page>`


### electronApplication.process() {#electron-application-process}

<Badge type="info" text="Added in: v1.21" />

返回此 Electron 应用程序的主进程。

**返回值**

- `ChildProcess`


### electronApplication.waitForEvent() {#electron-application-wait-for-event}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

等待事件触发并将其值传递给谓词函数。当谓词返回真值时返回。如果应用程序在事件触发之前关闭，将抛出错误。返回事件数据值。

**用法**

```js
const windowPromise = electronApp.waitForEvent('window');
await mainWindow.click('button');
const window = await windowPromise;
```

**参数**

- <a id="electron-application-wait-for-event-option-event"></a>`event` `string`

  事件名称，与通常传递给 `*.on(event)` 的相同。
- <a id="electron-application-wait-for-event-option-options-or-predicate"></a>`optionsOrPredicate` `function() | Object` *(可选)*

  接收事件的谓词或选项对象。可选。

  - `predicate` `function()`

    接收事件数据，当等待应该解析时返回真值。
  - `timeout` `float` *(可选)*

    最大等待时间（毫秒）。默认为 `30000`（30 秒）。传递 `0` 禁用超时。可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 更改默认值。

**返回值**

- `Promise<any>`


### electronApplication.windows() {#electron-application-windows}

<Badge type="info" text="Added in: v1.9" />

返回所有已打开窗口的便捷方法。

**返回值**

- `Array<Page>`


## 事件

### electronApplication.on('close') {#electron-application-event-close}

<Badge type="info" text="Added in: v1.9" />

当应用程序进程已终止时发出此事件。

**事件数据**

- `void`


### electronApplication.on('console') {#electron-application-event-console}

<Badge type="info" text="Added in: v1.42" />

当 Electron 主进程中的 JavaScript 调用控制台 API 方法之一时发出，例如 `console.log` 或 `console.dir`。

传递给 `console.log` 的参数可在 [ConsoleMessage](/api/class-consolemessage) 事件处理程序参数上获得。

**用法**

```js
electronApp.on('console', async msg => {
  const values = [];
  for (const arg of msg.args())
    values.push(await arg.jsonValue());
  console.log(...values);
});
await electronApp.evaluate(() => console.log('hello', 5, { foo: 'bar' }));
```

**事件数据**

- `ConsoleMessage`


### electronApplication.on('window') {#electron-application-event-window}

<Badge type="info" text="Added in: v1.9" />

为在 Electron 中创建**并加载**的每个窗口发出此事件。它包含可用于 Playwright 自动化的 [Page](/api/class-page)。

**事件数据**

- `Page`
