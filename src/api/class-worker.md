---
title: Worker
outline: 2
---

# Worker

<Badge type="info" text="Added in: v1.8" />

The Worker class represents a [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API). `worker`
event is emitted on the page object to signal a worker creation. `close` event is emitted on the worker object when the
worker is gone.

```js
page.on('worker', worker => {
  console.log('Worker created: ' + worker.url());
  worker.on('close', worker => console.log('Worker destroyed: ' + worker.url()));
});

console.log('Current workers:');
for (const worker of page.workers())
  console.log('  ' + worker.url());
```

## Methods

### worker.evaluate() {#worker-evaluate}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the return value of [`pageFunction`](/api/class-worker#worker-evaluate-option-expression).

If the function passed to the [`worker.evaluate()`](/api/class-worker#worker-evaluate) returns a [Promise], then [`worker.evaluate()`](/api/class-worker#worker-evaluate) would wait for the promise
to resolve and return its value.

If the function passed to the [`worker.evaluate()`](/api/class-worker#worker-evaluate) returns a non-[Serializable] value, then [`worker.evaluate()`](/api/class-worker#worker-evaluate) returns `undefined`. Playwright also supports transferring some
additional values that are not serializable by `JSON`: `-0`, `NaN`, `Infinity`, `-Infinity`.

**Arguments**

- <a id="worker-evaluate-option-expression"></a>`pageFunction` `function() | string`

  Function to be evaluated in the worker context.
- <a id="worker-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-worker#worker-evaluate-option-expression).

**Returns**

- `Promise<Serializable>`


### worker.evaluateHandle() {#worker-evaluate-handle}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the return value of [`pageFunction`](/api/class-worker#worker-evaluate-handle-option-expression) as a [JSHandle](/api/class-jshandle).

The only difference between [`worker.evaluate()`](/api/class-worker#worker-evaluate) and
[`worker.evaluateHandle()`](/api/class-worker#worker-evaluate-handle) is that [`worker.evaluateHandle()`](/api/class-worker#worker-evaluate-handle)
returns [JSHandle](/api/class-jshandle).

If the function passed to the [`worker.evaluateHandle()`](/api/class-worker#worker-evaluate-handle) returns a [Promise], then [`worker.evaluateHandle()`](/api/class-worker#worker-evaluate-handle) would wait for
the promise to resolve and return its value.

**Arguments**

- <a id="worker-evaluate-handle-option-expression"></a>`pageFunction` `function() | string`

  Function to be evaluated in the worker context.
- <a id="worker-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-worker#worker-evaluate-handle-option-expression).

**Returns**

- `Promise<JSHandle>`


### worker.url() {#worker-url}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `string`


### worker.waitForEvent() {#worker-wait-for-event}

<Badge type="info" text="Added in: v1.57" /> <Badge type="tip" text="async" />

Waits for event to fire and passes its value into the predicate function.
Returns when the predicate returns truthy value.
Will throw an error if the page is closed before the event is fired.
Returns the event data value.

**Usage**

```js
// Start waiting for download before clicking. Note no await.
const consolePromise = worker.waitForEvent('console');
await worker.evaluate('console.log(42)');
const consoleMessage = await consolePromise;
```

**Arguments**

- <a id="worker-wait-for-event-option-event"></a>`event` `string`

  Event name, same one typically passed into `*.on(event)`.
- <a id="worker-wait-for-event-option-options-or-predicate"></a>`optionsOrPredicate` `function() | Object` *(optional)*

  Either a predicate that receives an event or an options object. Optional.

  - `predicate` `function()`

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - `timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `0` - no timeout. The default value can be changed via `actionTimeout` option in the config, or by using the [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) or [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) methods.
- <a id="worker-wait-for-event-option-options"></a>`options` `Object` *(optional)*

  - <a id="worker-wait-for-event-option-predicate"></a>`predicate` `function()` *(optional)*

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - <a id="worker-wait-for-event-option-signal"></a>`signal` `AbortSignal` *(optional)* <Badge type="info" text="Added in: v1.62" />

    Allows to cancel the waiting using an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). If the signal is aborted, the waiting will be aborted and the operation will throw an error.
    Note that providing a signal does not disable the default timeout, which can be changed using [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout); pass `timeout: 0` to disable the timeout entirely.

**Returns**

- `Promise<any>`


## Events

### worker.on('close') {#worker-event-close}

<Badge type="info" text="Added in: v1.8" />

Emitted when this dedicated [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) is terminated.

**Event data**

- `Worker`


### worker.on('console') {#worker-event-console}

<Badge type="info" text="Added in: v1.57" />

Emitted when JavaScript within the worker calls one of console API methods, e.g. `console.log` or `console.dir`.

**Event data**

- `ConsoleMessage`

