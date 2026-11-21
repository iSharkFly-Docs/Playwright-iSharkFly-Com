---
title: Worker
outline: 2
---

# Worker

<Badge type="info" text="新增于: v1.8" />

Worker 类表示一个 [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)。当 worker 创建时，会在页面对象上触发 `worker` 事件。当 worker 关闭时，会在 worker 对象上触发 `close` 事件。

```js
page.on('worker', worker => {
  console.log('Worker 已创建: ' + worker.url());
  worker.on('close', worker => console.log('Worker 已销毁: ' + worker.url()));
});

console.log('当前的 workers:');
for (const worker of page.workers())
  console.log('  ' + worker.url());
```

## 方法

### worker.evaluate() {#worker-evaluate}

<Badge type="info" text="新增于: v1.8" /> <Badge type="tip" text="async" />

返回 [`pageFunction`](/api/class-worker#worker-evaluate-option-expression) 的返回值。

如果传递给 [`worker.evaluate()`](/api/class-worker#worker-evaluate) 的函数返回一个 [Promise]，则 [`worker.evaluate()`](/api/class-worker#worker-evaluate) 将等待 promise 解析并返回其值。

如果传递给 [`worker.evaluate()`](/api/class-worker#worker-evaluate) 的函数返回一个非[可序列化]的值，则 [`worker.evaluate()`](/api/class-worker#worker-evaluate) 返回 `undefined`。Playwright 还支持传输一些不能被 `JSON` 序列化的额外值：`-0`、`NaN`、`Infinity`、`-Infinity`。

**参数**

- <a id="worker-evaluate-option-expression"></a>`pageFunction` `function() | string`

  要在 worker 上下文中执行的函数。
- <a id="worker-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-worker#worker-evaluate-option-expression) 的可选参数。

**返回值**

- `Promise<Serializable>`


### worker.evaluateHandle() {#worker-evaluate-handle}

<Badge type="info" text="新增于: v1.8" /> <Badge type="tip" text="async" />

将 [`pageFunction`](/api/class-worker#worker-evaluate-handle-option-expression) 的返回值作为 [JSHandle](/api/class-jshandle) 返回。

[`worker.evaluate()`](/api/class-worker#worker-evaluate) 和 [`worker.evaluateHandle()`](/api/class-worker#worker-evaluate-handle) 之间唯一的区别是 [`worker.evaluateHandle()`](/api/class-worker#worker-evaluate-handle) 返回 [JSHandle](/api/class-jshandle)。

如果传递给 [`worker.evaluateHandle()`](/api/class-worker#worker-evaluate-handle) 的函数返回一个 [Promise]，则 [`worker.evaluateHandle()`](/api/class-worker#worker-evaluate-handle) 将等待 promise 解析并返回其值。

**参数**

- <a id="worker-evaluate-handle-option-expression"></a>`pageFunction` `function() | string`

  要在 worker 上下文中执行的函数。
- <a id="worker-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-worker#worker-evaluate-handle-option-expression) 的可选参数。

**返回值**

- `Promise<JSHandle>`


### worker.url() {#worker-url}

<Badge type="info" text="新增于: v1.8" />

**返回值**

- `string`


### worker.waitForEvent() {#worker-wait-for-event}

<Badge type="info" text="新增于: v1.57" /> <Badge type="tip" text="async" />

等待事件触发并将其值传递给谓词函数。当谓词返回真值时返回。如果在事件触发之前页面关闭，将抛出错误。返回事件数据值。

**用法**

```js
// 在点击之前开始等待下载。注意没有 await。
const consolePromise = worker.waitForEvent('console');
await worker.evaluate('console.log(42)');
const consoleMessage = await consolePromise;
```

**参数**

- <a id="worker-wait-for-event-option-event"></a>`event` `string`

  事件名称，与通常传递给 `*.on(event)` 的名称相同。
- <a id="worker-wait-for-event-option-options-or-predicate"></a>`optionsOrPredicate` `function() | Object` *(可选)*

  接收事件的谓词或选项对象。可选。

  - `predicate` `function()`

    接收事件数据，当等待应该解析时返回真值。
  - `timeout` `float` *(可选)*

    最大等待时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。
- <a id="worker-wait-for-event-option-options"></a>`options` `Object` *(可选)*

  - <a id="worker-wait-for-event-option-predicate"></a>`predicate` `function()` *(可选)*

    接收事件数据，当等待应该解析时返回真值。
  - <a id="worker-wait-for-event-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="新增于: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消等待。如果信号被中止，等待将被中止，操作将抛出错误。
    请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。

**返回值**

- `Promise<any>`


## 事件

### worker.on('close') {#worker-event-close}

<Badge type="info" text="新增于: v1.8" />

当此专用 [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) 终止时触发。

**事件数据**

- `Worker`


### worker.on('console') {#worker-event-console}

<Badge type="info" text="新增于: v1.57" />

当 worker 内的 JavaScript 调用控制台 API 方法之一时触发，例如 `console.log` 或 `console.dir`。

**事件数据**

- `ConsoleMessage`
