---
title: JSHandle
outline: 2
---

# JSHandle

<Badge type="info" text="Added in: v1.8" />

JSHandle represents an in-page JavaScript object. JSHandles can be created with the [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle)
method.

```js
const windowHandle = await page.evaluateHandle(() => window);
// ...
```

JSHandle prevents the referenced JavaScript object being garbage collected unless the handle is exposed with
[`jsHandle.dispose()`](/api/class-jshandle#js-handle-dispose). JSHandles are auto-disposed when their origin frame gets navigated or the parent context
gets destroyed.

JSHandle instances can be used as an argument in [`page.$eval()`](/api/class-page#page-eval-on-selector), [`page.evaluate()`](/api/class-page#page-evaluate) and
[`page.evaluateHandle()`](/api/class-page#page-evaluate-handle) methods.

## Methods

### jsHandle.asElement() {#js-handle-as-element}

<Badge type="info" text="Added in: v1.8" />

Returns either `null` or the object handle itself, if the object handle is an instance of [ElementHandle](/api/class-elementhandle).

**Returns**

- `null | ElementHandle`


### jsHandle.dispose() {#js-handle-dispose}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

The `jsHandle.dispose` method stops referencing the element handle.


### jsHandle.evaluate() {#js-handle-evaluate}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the return value of [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression).

This method passes this handle as the first argument to [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression).

If [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression) returns a [Promise], then `handle.evaluate` would wait for the promise to resolve and return
its value.

**Usage**

```js
const tweetHandle = await page.$('.tweet .retweets');
expect(await tweetHandle.evaluate(node => node.innerText)).toBe('10 retweets');
```

**Arguments**

- <a id="js-handle-evaluate-option-expression"></a>`pageFunction` `function() | string`

  Function to be evaluated in the page context.
- <a id="js-handle-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression).
- <a id="js-handle-evaluate-option-options"></a>`options` `Object` *(optional)*

  - <a id="js-handle-evaluate-option-expose-functions"></a>`exposeFunctions` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    When set to `true`, functions passed inside [`arg`](/api/class-elementhandle#element-handle-evaluate-option-arg) are exposed in the page and can be called from the page function. Calling one returns a [Promise] of its result. Under the hood, each function is exposed via [`page.exposeFunction()`](/api/class-page#page-expose-function), so it is technically accessible from all frames of the page. Exposed functions are cleared upon the top-level navigation. Defaults to `false`, in which case functions are not serializable and passing one throws an error.

**Returns**

- `Promise<Serializable>`


### jsHandle.evaluateHandle() {#js-handle-evaluate-handle}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns the return value of [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-handle-option-expression) as a [JSHandle](/api/class-jshandle).

This method passes this handle as the first argument to [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-handle-option-expression).

The only difference between `jsHandle.evaluate` and `jsHandle.evaluateHandle` is that `jsHandle.evaluateHandle` returns [JSHandle](/api/class-jshandle).

If the function passed to the `jsHandle.evaluateHandle` returns a [Promise], then `jsHandle.evaluateHandle` would wait
for the promise to resolve and return its value.

See [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle) for more details.

**Arguments**

- <a id="js-handle-evaluate-handle-option-expression"></a>`pageFunction` `function() | string`

  Function to be evaluated in the page context.
- <a id="js-handle-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  Optional argument to pass to [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-handle-option-expression).
- <a id="js-handle-evaluate-handle-option-options"></a>`options` `Object` *(optional)*

  - <a id="js-handle-evaluate-handle-option-expose-functions"></a>`exposeFunctions` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    When set to `true`, functions passed inside [`arg`](/api/class-elementhandle#element-handle-evaluate-handle-option-arg) are exposed in the page and can be called from the page function. Calling one returns a [Promise] of its result. Under the hood, each function is exposed via [`page.exposeFunction()`](/api/class-page#page-expose-function), so it is technically accessible from all frames of the page. Exposed functions are cleared upon the top-level navigation. Defaults to `false`, in which case functions are not serializable and passing one throws an error.

**Returns**

- `Promise<JSHandle>`


### jsHandle.getProperties() {#js-handle-get-properties}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

The method returns a map with **own property names** as keys and JSHandle instances for the property values.

**Usage**

```js
const handle = await page.evaluateHandle(() => ({ window, document }));
const properties = await handle.getProperties();
const windowHandle = properties.get('window');
const documentHandle = properties.get('document');
await handle.dispose();
```

**Returns**

- `Promise<Map<string, JSHandle>>`


### jsHandle.getProperty() {#js-handle-get-property}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Fetches a single property from the referenced object.

**Arguments**

- <a id="js-handle-get-property-option-property-name"></a>`propertyName` `string`

  property to get

**Returns**

- `Promise<JSHandle>`


### jsHandle.jsonValue() {#js-handle-json-value}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

Returns a JSON representation of the object. If the object has a `toJSON` function, it **will not be called**.

::: info
The method will return an empty JSON object if the referenced object is not stringifiable. It will throw an error if the
object has circular references.
:::

**Returns**

- `Promise<Serializable>`

