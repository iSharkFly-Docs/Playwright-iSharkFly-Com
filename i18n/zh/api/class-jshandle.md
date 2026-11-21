---
title: JSHandle
outline: 2
---

# JSHandle

<Badge type="info" text="Added in: v1.8" />

JSHandle 表示页面内的 JavaScript 对象。JSHandle 可以使用 [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle) 方法创建。

```js
const windowHandle = await page.evaluateHandle(() => window);
// ...
```

JSHandle 防止被引用的 JavaScript 对象被垃圾回收，除非句柄通过 [`jsHandle.dispose()`](/api/class-jshandle#js-handle-dispose) 被释放。当它们的源框架被导航或父上下文被销毁时，JSHandle 会自动释放。

JSHandle 实例可以用作 [`page.$eval()`](/api/class-page#page-eval-on-selector)、[`page.evaluate()`](/api/class-page#page-evaluate) 和 [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle) 方法中的参数。

## Methods

### jsHandle.asElement() {#js-handle-as-element}

<Badge type="info" text="Added in: v1.8" />

返回 `null` 或对象句柄本身，如果对象句柄是 [ElementHandle](/api/class-elementhandle) 的实例。

**Returns**

- `null | ElementHandle`


### jsHandle.dispose() {#js-handle-dispose}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

`jsHandle.dispose` 方法停止引用元素句柄。


### jsHandle.evaluate() {#js-handle-evaluate}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression) 的返回值。

此方法将此句柄作为第一个参数传递给 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression)。

如果 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression) 返回 [Promise]，则 `handle.evaluate` 会等待 promise 解析并返回其值。

**Usage**

```js
const tweetHandle = await page.$('.tweet .retweets');
expect(await tweetHandle.evaluate(node => node.innerText)).toBe('10 retweets');
```

**Arguments**

- <a id="js-handle-evaluate-option-expression"></a>`pageFunction` `function() | string`

  要在页面上下文中执行的函数。
- <a id="js-handle-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  传递给 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression) 的可选参数。
- <a id="js-handle-evaluate-option-options"></a>`options` `Object` *(optional)*

  - <a id="js-handle-evaluate-option-expose-functions"></a>`exposeFunctions` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    当设置为 `true` 时，传递在 [`arg`](/api/class-elementhandle#element-handle-evaluate-option-arg) 内部的函数会在页面中暴露，并可以从页面函数调用。调用函数返回其结果的 [Promise]。在底层，每个函数通过 [`page.exposeFunction()`](/api/class-page#page-expose-function) 暴露，因此从技术上讲它可以从页面的所有框架访问。暴露的函数在顶级导航时被清除。默认为 `false`，在这种情况下函数不可序列化，传递函数会抛出错误。

**Returns**

- `Promise<Serializable>`


### jsHandle.evaluateHandle() {#js-handle-evaluate-handle}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-handle-option-expression) 的返回值作为 [JSHandle](/api/class-jshandle)。

此方法将此句柄作为第一个参数传递给 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-handle-option-expression)。

`jsHandle.evaluate` 和 `jsHandle.evaluateHandle` 之间唯一的区别是 `jsHandle.evaluateHandle` 返回 [JSHandle](/api/class-jshandle)。

如果传递给 `jsHandle.evaluateHandle` 的函数返回 [Promise]，则 `jsHandle.evaluateHandle` 会等待 promise 解析并返回其值。

有关更多详情，请参阅 [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle)。

**Arguments**

- <a id="js-handle-evaluate-handle-option-expression"></a>`pageFunction` `function() | string`

  要在页面上下文中执行的函数。
- <a id="js-handle-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(optional)*

  传递给 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-handle-option-expression) 的可选参数。
- <a id="js-handle-evaluate-handle-option-options"></a>`options` `Object` *(optional)*

  - <a id="js-handle-evaluate-handle-option-expose-functions"></a>`exposeFunctions` `boolean` *(optional)* <Badge type="info" text="Added in: v1.62" />

    当设置为 `true` 时，传递在 [`arg`](/api/class-elementhandle#element-handle-evaluate-handle-option-arg) 内部的函数会在页面中暴露，并可以从页面函数调用。调用函数返回其结果的 [Promise]。在底层，每个函数通过 [`page.exposeFunction()`](/api/class-page#page-expose-function) 暴露，因此从技术上讲它可以从页面的所有框架访问。暴露的函数在顶级导航时被清除。默认为 `false`，在这种情况下函数不可序列化，传递函数会抛出错误。

**Returns**

- `Promise<JSHandle>`


### jsHandle.getProperties() {#js-handle-get-properties}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

该方法返回一个以**自有属性名**为键、以属性值的 JSHandle 实例为值的映射。

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

从引用的对象获取单个属性。

**Arguments**

- <a id="js-handle-get-property-option-property-name"></a>`propertyName` `string`

  要获取的属性

**Returns**

- `Promise<JSHandle>`


### jsHandle.jsonValue() {#js-handle-json-value}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回对象的 JSON 表示。如果对象有 `toJSON` 函数，它**不会被调用**。

::: info
如果引用的对象不可字符串化，该方法将返回空的 JSON 对象。如果对象有循环引用，它将抛出错误。
:::

**Returns**

- `Promise<Serializable>`
