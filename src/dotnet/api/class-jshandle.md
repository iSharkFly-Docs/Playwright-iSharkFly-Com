---
title: JSHandle
outline: 2
---

# JSHandle

<Badge type="info" text="Added in: v1.8" />

JSHandle represents an in-page JavaScript object. JSHandles can be created with the [`Page.EvaluateHandleAsync()`](/dotnet/api/class-page#page-evaluate-handle)
method.

```csharp
var windowHandle = await page.EvaluateHandleAsync("() => window");
```

JSHandle prevents the referenced JavaScript object being garbage collected unless the handle is exposed with
[`JsHandle.DisposeAsync()`](/dotnet/api/class-jshandle#js-handle-dispose). JSHandles are auto-disposed when their origin frame gets navigated or the parent context
gets destroyed.

JSHandle instances can be used as an argument in [`Page.EvalOnSelectorAsync()`](/dotnet/api/class-page#page-eval-on-selector), [`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) and
[`Page.EvaluateHandleAsync()`](/dotnet/api/class-page#page-evaluate-handle) methods.

## Methods

### JsHandle.AsElement() {#js-handle-as-element}

<Badge type="info" text="Added in: v1.8" />

Returns either `null` or the object handle itself, if the object handle is an instance of [ElementHandle](/dotnet/api/class-elementhandle).

**Returns**

- `null | ElementHandle`


### JsHandle.DisposeAsync() {#js-handle-dispose}

<Badge type="info" text="Added in: v1.8" />

The `jsHandle.dispose` method stops referencing the element handle.


### JsHandle.EvaluateAsync() {#js-handle-evaluate}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/dotnet/api/class-elementhandle#element-handle-evaluate-option-expression).

This method passes this handle as the first argument to [`expression`](/dotnet/api/class-elementhandle#element-handle-evaluate-option-expression).

If [`expression`](/dotnet/api/class-elementhandle#element-handle-evaluate-option-expression) returns a [Promise], then `handle.evaluate` would wait for the promise to resolve and return
its value.

**Usage**

```csharp
var tweetHandle = await page.QuerySelectorAsync(".tweet .retweets");
Assert.AreEqual("10 retweets", await tweetHandle.EvaluateAsync("node => node.innerText"));
```

**Arguments**

- <a id="js-handle-evaluate-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="js-handle-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/dotnet/api/class-elementhandle#element-handle-evaluate-option-expression).

**Returns**

- `Serializable`


### JsHandle.EvaluateHandleAsync() {#js-handle-evaluate-handle}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/dotnet/api/class-elementhandle#element-handle-evaluate-handle-option-expression) as a [JSHandle](/dotnet/api/class-jshandle).

This method passes this handle as the first argument to [`expression`](/dotnet/api/class-elementhandle#element-handle-evaluate-handle-option-expression).

The only difference between `jsHandle.evaluate` and `jsHandle.evaluateHandle` is that `jsHandle.evaluateHandle` returns [JSHandle](/dotnet/api/class-jshandle).

If the function passed to the `jsHandle.evaluateHandle` returns a [Promise], then `jsHandle.evaluateHandle` would wait
for the promise to resolve and return its value.

See [`Page.EvaluateHandleAsync()`](/dotnet/api/class-page#page-evaluate-handle) for more details.

**Arguments**

- <a id="js-handle-evaluate-handle-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="js-handle-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/dotnet/api/class-elementhandle#element-handle-evaluate-handle-option-expression).

**Returns**

- `JSHandle`


### JsHandle.GetPropertiesAsync() {#js-handle-get-properties}

<Badge type="info" text="Added in: v1.8" />

The method returns a map with **own property names** as keys and JSHandle instances for the property values.

**Usage**

```csharp
var handle = await page.EvaluateHandleAsync("() => ({ window, document })");
var properties = await handle.GetPropertiesAsync();
var windowHandle = properties["window"];
var documentHandle = properties["document"];
await handle.DisposeAsync();
```

**Returns**

- `Map<string, JSHandle>`


### JsHandle.GetPropertyAsync() {#js-handle-get-property}

<Badge type="info" text="Added in: v1.8" />

Fetches a single property from the referenced object.

**Arguments**

- <a id="js-handle-get-property-option-property-name"></a>`propertyName` `string`

  property to get

**Returns**

- `JSHandle`


### JsHandle.JsonValueAsync() {#js-handle-json-value}

<Badge type="info" text="Added in: v1.8" />

Returns a JSON representation of the object. If the object has a `toJSON` function, it **will not be called**.

::: info
The method will return an empty JSON object if the referenced object is not stringifiable. It will throw an error if the
object has circular references.
:::

**Returns**

- `Serializable`

