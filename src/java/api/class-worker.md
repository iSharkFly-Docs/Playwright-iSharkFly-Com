---
title: Worker
outline: 2
---

# Worker

<Badge type="info" text="Added in: v1.8" />

The Worker class represents a [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API). `worker`
event is emitted on the page object to signal a worker creation. `close` event is emitted on the worker object when the
worker is gone.

```java
page.onWorker(worker -> {
  System.out.println("Worker created: " + worker.url());
  worker.onClose(worker1 -> System.out.println("Worker destroyed: " + worker1.url()));
});
System.out.println("Current workers:");
for (Worker worker : page.workers())
  System.out.println("  " + worker.url());
```

## Methods

### worker.evaluate() {#worker-evaluate}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/java/api/class-worker#worker-evaluate-option-expression).

If the function passed to the [`worker.evaluate()`](/java/api/class-worker#worker-evaluate) returns a [Promise], then [`worker.evaluate()`](/java/api/class-worker#worker-evaluate) would wait for the promise
to resolve and return its value.

If the function passed to the [`worker.evaluate()`](/java/api/class-worker#worker-evaluate) returns a non-[Serializable] value, then [`worker.evaluate()`](/java/api/class-worker#worker-evaluate) returns `undefined`. Playwright also supports transferring some
additional values that are not serializable by `JSON`: `-0`, `NaN`, `Infinity`, `-Infinity`.

**Arguments**

- <a id="worker-evaluate-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="worker-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/java/api/class-worker#worker-evaluate-option-expression).

**Returns**

- `Serializable`


### worker.evaluateHandle() {#worker-evaluate-handle}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/java/api/class-worker#worker-evaluate-handle-option-expression) as a [JSHandle](/java/api/class-jshandle).

The only difference between [`worker.evaluate()`](/java/api/class-worker#worker-evaluate) and
[`worker.evaluateHandle()`](/java/api/class-worker#worker-evaluate-handle) is that [`worker.evaluateHandle()`](/java/api/class-worker#worker-evaluate-handle)
returns [JSHandle](/java/api/class-jshandle).

If the function passed to the [`worker.evaluateHandle()`](/java/api/class-worker#worker-evaluate-handle) returns a [Promise], then [`worker.evaluateHandle()`](/java/api/class-worker#worker-evaluate-handle) would wait for
the promise to resolve and return its value.

**Arguments**

- <a id="worker-evaluate-handle-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="worker-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/java/api/class-worker#worker-evaluate-handle-option-expression).

**Returns**

- `JSHandle`


### worker.url() {#worker-url}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `string`


### worker.waitForClose() {#worker-wait-for-close}

<Badge type="info" text="Added in: v1.10" />

Performs action and waits for the Worker to close.

**Arguments**

- <a id="worker-wait-for-close-option-options"></a>`options` `Object` *(optional)*

  - <a id="worker-wait-for-close-option-timeout"></a>`timeout` `float` *(optional)* <Badge type="info" text="Added in: v1.9" />

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout).
- <a id="worker-wait-for-close-option-callback"></a>`callback` `Runnable` <Badge type="info" text="Added in: v1.9" />

  Callback that performs the action triggering the event.

**Returns**

- `Worker`


### worker.waitForConsoleMessage() {#worker-wait-for-console-message}

<Badge type="info" text="Added in: v1.57" />

Performs action and waits for a console message.

**Arguments**

- <a id="worker-wait-for-console-message-option-options"></a>`options` `Object` *(optional)*

  - <a id="worker-wait-for-console-message-option-predicate"></a>`predicate` `function(ConsoleMessage): boolean` *(optional)*

    Receives the [ConsoleMessage](/java/api/class-consolemessage) object and resolves to true when the waiting should resolve.
  - <a id="worker-wait-for-console-message-option-timeout"></a>`timeout` `float` *(optional)*

    Maximum time to wait for in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
    The default value can be changed by using the [`browserContext.setDefaultTimeout()`](/java/api/class-browsercontext#browser-context-set-default-timeout).
- <a id="worker-wait-for-console-message-option-callback"></a>`callback` `Runnable`

  Callback that performs the action triggering the event.

**Returns**

- `ConsoleMessage`


## Events

### worker.onClose() {#worker-event-close}

<Badge type="info" text="Added in: v1.8" />

Emitted when this dedicated [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) is terminated.

**Event data**

- `Worker`


### worker.onConsole() {#worker-event-console}

<Badge type="info" text="Added in: v1.57" />

Emitted when JavaScript within the worker calls one of console API methods, e.g. `console.log` or `console.dir`.

**Event data**

- `ConsoleMessage`

