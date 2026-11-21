---
title: Worker
outline: 2
---

# Worker

<Badge type="info" text="Added in: v1.8" />

The Worker class represents a [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API). `worker`
event is emitted on the page object to signal a worker creation. `close` event is emitted on the worker object when the
worker is gone.

```csharp
page.Worker += (_, worker) =>
{
    Console.WriteLine($"Worker created: {worker.Url}");
    worker.Close += (_, _) => Console.WriteLine($"Worker closed {worker.Url}");
};

Console.WriteLine("Current Workers:");
foreach(var pageWorker in page.Workers)
{
    Console.WriteLine($"\tWorker: {pageWorker.Url}");
}
```

## Methods

### Worker.EvaluateAsync() {#worker-evaluate}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/dotnet/api/class-worker#worker-evaluate-option-expression).

If the function passed to the [`Worker.EvaluateAsync()`](/dotnet/api/class-worker#worker-evaluate) returns a [Promise], then [`Worker.EvaluateAsync()`](/dotnet/api/class-worker#worker-evaluate) would wait for the promise
to resolve and return its value.

If the function passed to the [`Worker.EvaluateAsync()`](/dotnet/api/class-worker#worker-evaluate) returns a non-[Serializable] value, then [`Worker.EvaluateAsync()`](/dotnet/api/class-worker#worker-evaluate) returns `undefined`. Playwright also supports transferring some
additional values that are not serializable by `JSON`: `-0`, `NaN`, `Infinity`, `-Infinity`.

**Arguments**

- <a id="worker-evaluate-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="worker-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/dotnet/api/class-worker#worker-evaluate-option-expression).

**Returns**

- `Serializable`


### Worker.EvaluateHandleAsync() {#worker-evaluate-handle}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/dotnet/api/class-worker#worker-evaluate-handle-option-expression) as a [JSHandle](/dotnet/api/class-jshandle).

The only difference between [`Worker.EvaluateAsync()`](/dotnet/api/class-worker#worker-evaluate) and
[`Worker.EvaluateHandleAsync()`](/dotnet/api/class-worker#worker-evaluate-handle) is that [`Worker.EvaluateHandleAsync()`](/dotnet/api/class-worker#worker-evaluate-handle)
returns [JSHandle](/dotnet/api/class-jshandle).

If the function passed to the [`Worker.EvaluateHandleAsync()`](/dotnet/api/class-worker#worker-evaluate-handle) returns a [Promise], then [`Worker.EvaluateHandleAsync()`](/dotnet/api/class-worker#worker-evaluate-handle) would wait for
the promise to resolve and return its value.

**Arguments**

- <a id="worker-evaluate-handle-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="worker-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/dotnet/api/class-worker#worker-evaluate-handle-option-expression).

**Returns**

- `JSHandle`


### Worker.Url() {#worker-url}

<Badge type="info" text="Added in: v1.8" />

**Returns**

- `string`


## Events

### Worker.Close {#worker-event-close}

<Badge type="info" text="Added in: v1.8" />

Emitted when this dedicated [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) is terminated.

**Event data**

- `Worker`


### Worker.Console {#worker-event-console}

<Badge type="info" text="Added in: v1.57" />

Emitted when JavaScript within the worker calls one of console API methods, e.g. `console.log` or `console.dir`.

**Event data**

- `ConsoleMessage`

