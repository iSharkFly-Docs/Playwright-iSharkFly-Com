---
title: JSHandle
outline: 2
---

# JSHandle

<Badge type="info" text="Added in: v1.8" />

JSHandle represents an in-page JavaScript object. JSHandles can be created with the [`page.evaluate_handle()`](/python/api/class-page#page-evaluate-handle)
method.

::: code-group

```python [Async]
window_handle = await page.evaluate_handle("window")
# ...
```

```python [Sync]
window_handle = page.evaluate_handle("window")
# ...
```

:::

JSHandle prevents the referenced JavaScript object being garbage collected unless the handle is exposed with
[`js_handle.dispose()`](/python/api/class-jshandle#js-handle-dispose). JSHandles are auto-disposed when their origin frame gets navigated or the parent context
gets destroyed.

JSHandle instances can be used as an argument in [`page.eval_on_selector()`](/python/api/class-page#page-eval-on-selector), [`page.evaluate()`](/python/api/class-page#page-evaluate) and
[`page.evaluate_handle()`](/python/api/class-page#page-evaluate-handle) methods.

## Methods

### js_handle.as_element() {#js-handle-as-element}

<Badge type="info" text="Added in: v1.8" />

Returns either `null` or the object handle itself, if the object handle is an instance of [ElementHandle](/python/api/class-elementhandle).

**Returns**

- `null | ElementHandle`


### js_handle.dispose() {#js-handle-dispose}

<Badge type="info" text="Added in: v1.8" />

The `jsHandle.dispose` method stops referencing the element handle.


### js_handle.evaluate() {#js-handle-evaluate}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/python/api/class-elementhandle#element-handle-evaluate-option-expression).

This method passes this handle as the first argument to [`expression`](/python/api/class-elementhandle#element-handle-evaluate-option-expression).

If [`expression`](/python/api/class-elementhandle#element-handle-evaluate-option-expression) returns a [Promise], then `handle.evaluate` would wait for the promise to resolve and return
its value.

**Usage**

::: code-group

```python [Async]
tweet_handle = await page.query_selector(".tweet .retweets")
assert await tweet_handle.evaluate("node => node.innerText") == "10 retweets"
```

```python [Sync]
tweet_handle = page.query_selector(".tweet .retweets")
assert tweet_handle.evaluate("node => node.innerText") == "10 retweets"
```

:::

**Arguments**

- <a id="js-handle-evaluate-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="js-handle-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/python/api/class-elementhandle#element-handle-evaluate-option-expression).

**Returns**

- `Serializable`


### js_handle.evaluate_handle() {#js-handle-evaluate-handle}

<Badge type="info" text="Added in: v1.8" />

Returns the return value of [`expression`](/python/api/class-elementhandle#element-handle-evaluate-handle-option-expression) as a [JSHandle](/python/api/class-jshandle).

This method passes this handle as the first argument to [`expression`](/python/api/class-elementhandle#element-handle-evaluate-handle-option-expression).

The only difference between `jsHandle.evaluate` and `jsHandle.evaluateHandle` is that `jsHandle.evaluateHandle` returns [JSHandle](/python/api/class-jshandle).

If the function passed to the `jsHandle.evaluateHandle` returns a [Promise], then `jsHandle.evaluateHandle` would wait
for the promise to resolve and return its value.

See [`page.evaluate_handle()`](/python/api/class-page#page-evaluate-handle) for more details.

**Arguments**

- <a id="js-handle-evaluate-handle-option-expression"></a>`expression` `string`

  JavaScript expression to be evaluated in the browser context. If the expression evaluates
  to a function, the function is automatically invoked.
- <a id="js-handle-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`expression`](/python/api/class-elementhandle#element-handle-evaluate-handle-option-expression).

**Returns**

- `JSHandle`


### js_handle.get_properties() {#js-handle-get-properties}

<Badge type="info" text="Added in: v1.8" />

The method returns a map with **own property names** as keys and JSHandle instances for the property values.

**Usage**

::: code-group

```python [Async]
handle = await page.evaluate_handle("({ window, document })")
properties = await handle.get_properties()
window_handle = properties.get("window")
document_handle = properties.get("document")
await handle.dispose()
```

```python [Sync]
handle = page.evaluate_handle("({ window, document })")
properties = handle.get_properties()
window_handle = properties.get("window")
document_handle = properties.get("document")
handle.dispose()
```

:::

**Returns**

- `Map<string, JSHandle>`


### js_handle.get_property() {#js-handle-get-property}

<Badge type="info" text="Added in: v1.8" />

Fetches a single property from the referenced object.

**Arguments**

- <a id="js-handle-get-property-option-property-name"></a>`property_name` `string`

  property to get

**Returns**

- `JSHandle`


### js_handle.json_value() {#js-handle-json-value}

<Badge type="info" text="Added in: v1.8" />

Returns a JSON representation of the object. If the object has a `toJSON` function, it **will not be called**.

::: info
The method will return an empty JSON object if the referenced object is not stringifiable. It will throw an error if the
object has circular references.
:::

**Returns**

- `Serializable`

