---
title: Worker
outline: 2
---

# Worker

<Badge type="info" text="Added in: v1.8" />

The Worker class represents a [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API). `worker`
event is emitted on the page object to signal a worker creation. `close` event is emitted on the worker object when the
worker is gone.

```python
def handle_worker(worker):
    print("worker created: " + worker.url)
    worker.on("close", lambda: print("worker destroyed: " + worker.url))

page.on('worker', handle_worker)

print("current workers:")
for worker in page.workers:
    print("    " + worker.url)
```

## Methods

### worker.evaluate() {#worker-evaluate}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/python/api/class-worker#worker-evaluate-option-expression).

If the function passed to the [`worker.evaluate()`](/python/api/class-worker#worker-evaluate) returns a [Promise], then [`worker.evaluate()`](/python/api/class-worker#worker-evaluate) would wait for the promise
to resolve and return its value.

If the function passed to the [`worker.evaluate()`](/python/api/class-worker#worker-evaluate) returns a non-[Serializable] value, then [`worker.evaluate()`](/python/api/class-worker#worker-evaluate) returns `undefined`. Playwright also supports transferring some
additional values that are not serializable by `JSON`: `-0`, `NaN`, `Infinity`, `-Infinity`.

**Arguments**

- <a id="worker-evaluate-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="worker-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/python/api/class-worker#worker-evaluate-option-expression).

**Returns**

- `Serializable`


### worker.evaluate_handle() {#worker-evaluate-handle}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/python/api/class-worker#worker-evaluate-handle-option-expression) as a [JSHandle](/python/api/class-jshandle).

The only difference between [`worker.evaluate()`](/python/api/class-worker#worker-evaluate) and
[`worker.evaluate_handle()`](/python/api/class-worker#worker-evaluate-handle) is that [`worker.evaluate_handle()`](/python/api/class-worker#worker-evaluate-handle)
returns [JSHandle](/python/api/class-jshandle).

If the function passed to the [`worker.evaluate_handle()`](/python/api/class-worker#worker-evaluate-handle) returns a [Promise], then [`worker.evaluate_handle()`](/python/api/class-worker#worker-evaluate-handle) would wait for
the promise to resolve and return its value.

**Arguments**

- <a id="worker-evaluate-handle-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="worker-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/python/api/class-worker#worker-evaluate-handle-option-expression).

**Returns**

- `JSHandle`


### worker.expect_event() {#worker-wait-for-event}

<Badge type="info" text="Added in: v1.57" />

Waits for event to fire and passes its value into the predicate function.
Returns when the predicate returns truthy value.
Will throw an error if the page is closed before the event is fired.
Returns the event data value.

**Usage**

::: code-group

```python [Async]
async with worker.expect_event("console") as event_info:
    await worker.evaluate("console.log(42)")
message = await event_info.value
```

```python [Sync]
with worker.expect_event("console") as event_info:
    worker.evaluate("console.log(42)")
message = event_info.value
```

:::

**Arguments**

- <a id="worker-wait-for-event-option-event"></a>`event` `string`

  Event name, same one typically passed into `*.on(event)`.
- <a id="worker-wait-for-event-option-options"></a>`options` `Object` *(optional)*

  - <a id="worker-wait-for-event-option-predicate"></a>`predicate` `function()` *(optional)*

    Receives the event data and resolves to truthy value when the waiting should resolve.
  - <a id="worker-wait-for-event-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browser_context.set_default_timeout()`](/python/api/class-browsercontext#browser-context-set-default-timeout).

**Returns**

- `EventContextManager`


### worker.url() {#worker-url}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `string`


## Events

### worker.on("close") {#worker-event-close}

<Badge type="info" text="Added in: v1.8" />

Emitted when this dedicated [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) is terminated.

**Event data**

- `Worker`


### worker.on("console") {#worker-event-console}

<Badge type="info" text="Added in: v1.57" />

Emitted when JavaScript within the worker calls one of console API methods, e.g. `console.log` or `console.dir`.

**Event data**

- `ConsoleMessage`

