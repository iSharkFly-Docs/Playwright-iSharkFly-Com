---
title: ConsoleMessage
outline: 2
---

# ConsoleMessage

<Badge type="info" text="Added in: v1.8" />

[ConsoleMessage](/api/class-consolemessage) 对象通过 [`page.on('console')`](/api/class-page#page-event-console) 事件由页面派发。
对于页面中记录的每条控制台消息，Playwright 上下文中都会有相应的事件。

```js
// 监听所有控制台日志
page.on('console', msg => console.log(msg.text()));

// 监听所有控制台事件并处理错误
page.on('console', msg => {
  if (msg.type() === 'error')
    console.log(`错误文本: "${msg.text()}"`);
});

// 获取下一条控制台日志
const msgPromise = page.waitForEvent('console');
await page.evaluate(() => {
  console.log('hello', 42, { foo: 'bar' });  // 在页面内部执行 console.log
});
const msg = await msgPromise;

// 解构控制台日志参数
await msg.args()[0].jsonValue(); // hello
await msg.args()[1].jsonValue(); // 42
```

## Methods

### consoleMessage.args() {#console-message-args}

<Badge type="info" text="Added in: v1.8" />

传递给 `console` 函数调用的参数列表。另请参阅 [`page.on('console')`](/api/class-page#page-event-console)。

**Returns**

- `Array<JSHandle>`


### consoleMessage.location() {#console-message-location}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `Object`


### consoleMessage.page() {#console-message-page}

<Badge type="info" text="Added in: v1.34" />

产生此控制台消息的页面（如果有）。

**Returns**

- `null | Page`


### consoleMessage.text() {#console-message-text}

<Badge type="info" text="Added in: v1.8" />

控制台消息的文本。

**Returns**

- `string`


### consoleMessage.timestamp() {#console-message-timestamp}

<Badge type="info" text="Added in: v1.59" />

控制台消息的时间戳，以自 Unix 纪元以来的毫秒数表示。

**Returns**

- `float`


### consoleMessage.type() {#console-message-type}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `"log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "time" | "timeEnd"`


### consoleMessage.worker() {#console-message-worker}

<Badge type="info" text="Added in: v1.57" />

产生此控制台消息的 web worker 或 service worker（如果有）。请注意，来自 web worker 的控制台消息也具有非空的 [`consoleMessage.page()`](/api/class-consolemessage#console-message-page)。

**Returns**

- `null | Worker`
