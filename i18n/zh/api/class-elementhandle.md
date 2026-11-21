---
title: ElementHandle
outline: 2
---

# ElementHandle

<Badge type="info" text="Added in: v1.8" />

继承自: [JSHandle](./class-jshandle)

* extends: [JSHandle](/api/class-jshandle)

ElementHandle 表示页面内的 DOM 元素。可以使用 [`page.$()`](/api/class-page#page-query-selector) 方法创建 ElementHandle。

:::warning[不推荐使用]

不推荐使用 ElementHandle，请改用 [Locator](/api/class-locator) 对象和 web-first 断言。
:::

```js
const hrefElement = await page.$('a');
await hrefElement.click();
```

ElementHandle 可以防止 DOM 元素被垃圾回收，除非使用
[`jsHandle.dispose()`](/api/class-jshandle#js-handle-dispose) 释放句柄。当其所属的 frame 发生导航时，ElementHandle 会自动释放。

ElementHandle 实例可以作为参数传递给 [`page.$eval()`](/api/class-page#page-eval-on-selector) 和 [`page.evaluate()`](/api/class-page#page-evaluate) 方法。

[Locator](/api/class-locator) 和 ElementHandle 的区别在于，ElementHandle 指向特定的元素，而 [Locator](/api/class-locator) 捕获的是如何获取元素的逻辑。

在下面的示例中，handle 指向页面上的特定 DOM 元素。如果该元素的文本发生变化，或者 React 用它来渲染一个完全不同的组件，handle 仍然指向那个 DOM 元素。这可能导致意外的行为。

```js
const handle = await page.$('text=Submit');
// ...
await handle.hover();
await handle.click();
```

使用 locator 时，每次使用 `element` 时，都会使用选择器在页面中定位最新的 DOM 元素。因此在下面的代码片段中，底层 DOM 元素将被定位两次。

```js
const locator = page.getByText('Submit');
// ...
await locator.hover();
await locator.click();
```

## 方法

### elementHandle.$() {#element-handle-query-selector}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`page.locator()`](/api/class-page#page-locator)。阅读更多关于 [locators](../locators.md) 的内容。
:::

该方法在 `ElementHandle` 的子树中查找匹配指定选择器的元素。如果没有元素匹配该选择器，则返回 `null`。

**参数**

- <a id="element-handle-query-selector-option-selector"></a>`selector` `string`

  要查询的选择器。

**返回值**

- `Promise<null | ElementHandle>`


### elementHandle.$$() {#element-handle-query-selector-all}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`page.locator()`](/api/class-page#page-locator)。阅读更多关于 [locators](../locators.md) 的内容。
:::

该方法在 `ElementHandle` 的子树中查找所有匹配指定选择器的元素。如果没有元素匹配该选择器，则返回空数组。

**参数**

- <a id="element-handle-query-selector-all-option-selector"></a>`selector` `string`

  要查询的选择器。

**返回值**

- `Promise<Array<ElementHandle>>`


### elementHandle.$$eval() {#element-handle-eval-on-selector-all}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
在大多数情况下，[`locator.evaluateAll()`](/api/class-locator#locator-evaluate-all)、其他 [Locator](/api/class-locator) 辅助方法和 web-first 断言能更好地完成任务。
:::

返回 [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-all-option-expression) 的返回值。

该方法在 `ElementHandle` 的子树中查找所有匹配指定选择器的元素，并将匹配元素的数组作为第一个参数传递给 [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-all-option-expression)。

如果 [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-all-option-expression) 返回 [Promise]，则 [`elementHandle.$$eval()`](/api/class-elementhandle#element-handle-eval-on-selector-all) 将等待 promise 解析并返回其值。

**用法**

```html
<div class="feed">
  <div class="tweet">Hello!</div>
  <div class="tweet">Hi!</div>
</div>
```

```js
const feedHandle = await page.$('.feed');
expect(await feedHandle.$$eval('.tweet', nodes =>
  nodes.map(n => n.innerText))).toEqual(['Hello!', 'Hi!'],
);
```

**参数**

- <a id="element-handle-eval-on-selector-all-option-selector"></a>`selector` `string`

  要查询的选择器。
- <a id="element-handle-eval-on-selector-all-option-expression"></a>`pageFunction` `function(Array<Element>) | string`

  要在页面上下文中执行的函数。
- <a id="element-handle-eval-on-selector-all-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-all-option-expression) 的可选参数。

**返回值**

- `Promise<Serializable>`


### elementHandle.$eval() {#element-handle-eval-on-selector}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
此方法不等待元素通过可操作性检查，因此可能导致测试不稳定。请改用 [`locator.evaluate()`](/api/class-locator#locator-evaluate)、其他 [Locator](/api/class-locator) 辅助方法或 web-first 断言。
:::

返回 [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-option-expression) 的返回值。

该方法在 `ElementHandle` 的子树中查找匹配指定选择器的元素，并将其作为第一个参数传递给 [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-option-expression)。如果没有元素匹配该选择器，该方法将抛出错误。

如果 [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-option-expression) 返回 [Promise]，则 [`elementHandle.$eval()`](/api/class-elementhandle#element-handle-eval-on-selector) 将等待 promise 解析并返回其值。

**用法**

```js
const tweetHandle = await page.$('.tweet');
expect(await tweetHandle.$eval('.like', node => node.innerText)).toBe('100');
expect(await tweetHandle.$eval('.retweets', node => node.innerText)).toBe('10');
```

**参数**

- <a id="element-handle-eval-on-selector-option-selector"></a>`selector` `string`

  要查询的选择器。
- <a id="element-handle-eval-on-selector-option-expression"></a>`pageFunction` `function(Element) | string`

  要在页面上下文中执行的函数。
- <a id="element-handle-eval-on-selector-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-elementhandle#element-handle-eval-on-selector-option-expression) 的可选参数。

**返回值**

- `Promise<Serializable>`


### elementHandle.asElement() {#element-handle-as-element}

<Badge type="info" text="Added in: v1.8" />

如果对象句柄是 [ElementHandle](/api/class-elementhandle) 的实例，则返回对象句柄本身，否则返回 `null`。

**返回值**

- `null | ElementHandle`


### elementHandle.boundingBox() {#element-handle-bounding-box}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

此方法返回元素的边界框，如果元素不可见则返回 `null`。边界框是相对于主 frame 视口计算的 - 通常与浏览器窗口相同。

滚动会影响返回的边界框，类似于
[Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)。这意味着 `x` 和/或 `y` 可能为负值。

子 frame 中的元素返回相对于主 frame 的边界框，这与
[Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) 不同。

假设页面是静态的，使用边界框坐标执行输入是安全的。例如，以下代码片段应该点击元素的中心。

**用法**

```js
const box = await elementHandle.boundingBox();
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
```

**返回值**

- `Promise<null | Object>`


### elementHandle.check() {#element-handle-check}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.check()`](/api/class-locator#locator-check)。阅读更多关于 [locators](../locators.md) 的内容。
:::

此方法通过执行以下步骤来勾选元素：
1. 确保元素是复选框或单选按钮输入框。如果不是，此方法将抛出错误。如果元素已经被勾选，此方法会立即返回。
1. 等待元素的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-elementhandle#element-handle-check-option-force) 选项。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.mouse`](/api/class-page#page-mouse) 点击元素的中心。
1. 确保元素现在已被勾选。如果没有，此方法将抛出错误。

如果在操作过程中的任何时刻元素从 DOM 中分离，此方法将抛出错误。

当所有步骤组合在一起没有在指定的 [`timeout`](/api/class-elementhandle#element-handle-check-option-timeout) 内完成时，此方法将抛出
[TimeoutError](/api/class-timeouterror)。传递零超时将禁用此功能。

**参数**

- <a id="element-handle-check-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-check-option-force"></a>`force` `boolean` *(可选)*

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="element-handle-check-option-no-wait-after"></a>`noWaitAfter` `boolean` *(可选)*

    此选项无效。
  - <a id="element-handle-check-option-position"></a>`position` `Object` *(可选)* <Badge type="info" text="Added in: v1.11" />

    相对于元素内边距框左上角使用的点。如果未指定，则使用元素的某个可见点。

    - `x` `float` <Badge type="info" text="Added in: v1.11" />
    - `y` `float` <Badge type="info" text="Added in: v1.11" />
  - <a id="element-handle-check-option-scroll"></a>`scroll` `"auto" | "none"` *(可选)* <Badge type="info" text="Added in: v1.62" />

    控制 Playwright 在执行操作前是否将元素滚动到视图中。默认为 `"auto"`，这会在必要时将元素滚动到视图中，包括滚动嵌套的可滚动容器。设置为 `"none"` 时，Playwright 不会滚动元素，如果元素不在视口中，操作将失败。这对于断言用户无需额外滚动即可访问元素很有用。
  - <a id="element-handle-check-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-check-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。
  - <a id="element-handle-check-option-trial"></a>`trial` `boolean` *(可选)* <Badge type="info" text="Added in: v1.11" />

    设置后，此方法仅执行[可操作性](../actionability.md)检查并跳过操作。默认为 `false`。用于等待元素准备好执行操作而不实际执行它。


### elementHandle.click() {#element-handle-click}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.click()`](/api/class-locator#locator-click)。阅读更多关于 [locators](../locators.md) 的内容。
:::

此方法通过执行以下步骤来点击元素：
1. 等待元素的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-elementhandle#element-handle-click-option-force) 选项。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.mouse`](/api/class-page#page-mouse) 点击元素的中心，或指定的 [`position`](/api/class-elementhandle#element-handle-click-option-position)。
1. 等待发起的导航成功或失败，除非设置了 [`noWaitAfter`](/api/class-elementhandle#element-handle-click-option-no-wait-after) 选项。

如果在操作过程中的任何时刻元素从 DOM 中分离，此方法将抛出错误。

当所有步骤组合在一起没有在指定的 [`timeout`](/api/class-elementhandle#element-handle-click-option-timeout) 内完成时，此方法将抛出
[TimeoutError](/api/class-timeouterror)。传递零超时将禁用此功能。

**参数**

- <a id="element-handle-click-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-click-option-button"></a>`button` `"left" | "right" | "middle"` *(可选)*

    默认为 `left`。
  - <a id="element-handle-click-option-click-count"></a>`clickCount` `int` *(可选)*

    默认为 1。参见 [UIEvent.detail]。
  - <a id="element-handle-click-option-delay"></a>`delay` `float` *(可选)*

    `mousedown` 和 `mouseup` 之间等待的时间（毫秒）。默认为 0。
  - <a id="element-handle-click-option-force"></a>`force` `boolean` *(可选)*

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="element-handle-click-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(可选)*

    要按下的修饰键。确保在操作期间仅按下这些修饰键，然后恢复当前修饰键。如果未指定，则使用当前按下的修饰键。"ControlOrMeta" 在 Windows 和 Linux 上解析为 "Control"，在 macOS 上解析为 "Meta"。
  - <a id="element-handle-click-option-no-wait-after"></a>`noWaitAfter` `boolean` *(可选)*

    发起导航的操作正在等待这些导航发生并等待页面开始加载。您可以通过设置此标志来选择不等待。只有在特殊情况下才需要此选项，例如导航到无法访问的页面。默认为 `false`。
  - <a id="element-handle-click-option-position"></a>`position` `Object` *(可选)*

    相对于元素内边距框左上角使用的点。如果未指定，则使用元素的某个可见点。

    - `x` `float`
    - `y` `float`
  - <a id="element-handle-click-option-scroll"></a>`scroll` `"auto" | "none"` *(可选)* <Badge type="info" text="Added in: v1.62" />

    控制 Playwright 在执行操作前是否将元素滚动到视图中。默认为 `"auto"`，这会在必要时将元素滚动到视图中，包括滚动嵌套的可滚动容器。设置为 `"none"` 时，Playwright 不会滚动元素，如果元素不在视口中，操作将失败。这对于断言用户无需额外滚动即可访问元素很有用。
  - <a id="element-handle-click-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-click-option-steps"></a>`steps` `int` *(可选)* <Badge type="info" text="Added in: v1.57" />

    默认为 1。发送 `n` 个插值的 `mousemove` 事件来表示从 Playwright 当前光标位置到提供的目标位置之间的移动。设置为 1 时，在目标位置发出单个 `mousemove` 事件。
  - <a id="element-handle-click-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。
  - <a id="element-handle-click-option-trial"></a>`trial` `boolean` *(可选)* <Badge type="info" text="Added in: v1.11" />

    设置后，此方法仅执行[可操作性](../actionability.md)检查并跳过操作。默认为 `false`。用于等待元素准备好执行操作而不实际执行它。


### elementHandle.contentFrame() {#element-handle-content-frame}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

对于引用 iframe 节点的元素句柄返回内容 frame，否则返回 `null`。

**返回值**

- `Promise<null | Frame>`


### elementHandle.dblclick() {#element-handle-dblclick}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.dblclick()`](/api/class-locator#locator-dblclick)。阅读更多关于 [locators](../locators.md) 的内容。
:::

此方法通过执行以下步骤来双击元素：
1. 等待元素的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-elementhandle#element-handle-dblclick-option-force) 选项。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.mouse`](/api/class-page#page-mouse) 双击元素的中心，或指定的 [`position`](/api/class-elementhandle#element-handle-dblclick-option-position)。

如果在操作过程中的任何时刻元素从 DOM 中分离，此方法将抛出错误。

当所有步骤组合在一起没有在指定的 [`timeout`](/api/class-elementhandle#element-handle-dblclick-option-timeout) 内完成时，此方法将抛出
[TimeoutError](/api/class-timeouterror)。传递零超时将禁用此功能。

::: info
`elementHandle.dblclick()` 会触发两个 `click` 事件和一个 `dblclick` 事件。
:::

**参数**

- <a id="element-handle-dblclick-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-dblclick-option-button"></a>`button` `"left" | "right" | "middle"` *(可选)*

    默认为 `left`。
  - <a id="element-handle-dblclick-option-delay"></a>`delay` `float` *(可选)*

    `mousedown` 和 `mouseup` 之间等待的时间（毫秒）。默认为 0。
  - <a id="element-handle-dblclick-option-force"></a>`force` `boolean` *(可选)*

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="element-handle-dblclick-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(可选)*

    要按下的修饰键。确保在操作期间仅按下这些修饰键，然后恢复当前修饰键。如果未指定，则使用当前按下的修饰键。"ControlOrMeta" 在 Windows 和 Linux 上解析为 "Control"，在 macOS 上解析为 "Meta"。
  - <a id="element-handle-dblclick-option-no-wait-after"></a>`noWaitAfter` `boolean` *(可选)*

    此选项无效。
  - <a id="element-handle-dblclick-option-position"></a>`position` `Object` *(可选)*

    相对于元素内边距框左上角使用的点。如果未指定，则使用元素的某个可见点。

    - `x` `float`
    - `y` `float`
  - <a id="element-handle-dblclick-option-scroll"></a>`scroll` `"auto" | "none"` *(可选)* <Badge type="info" text="Added in: v1.62" />

    控制 Playwright 在执行操作前是否将元素滚动到视图中。默认为 `"auto"`，这会在必要时将元素滚动到视图中，包括滚动嵌套的可滚动容器。设置为 `"none"` 时，Playwright 不会滚动元素，如果元素不在视口中，操作将失败。这对于断言用户无需额外滚动即可访问元素很有用。
  - <a id="element-handle-dblclick-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-dblclick-option-steps"></a>`steps` `int` *(可选)* <Badge type="info" text="Added in: v1.57" />

    默认为 1。发送 `n` 个插值的 `mousemove` 事件来表示从 Playwright 当前光标位置到提供的目标位置之间的移动。设置为 1 时，在目标位置发出单个 `mousemove` 事件。
  - <a id="element-handle-dblclick-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。
  - <a id="element-handle-dblclick-option-trial"></a>`trial` `boolean` *(可选)* <Badge type="info" text="Added in: v1.11" />

    设置后，此方法仅执行[可操作性](../actionability.md)检查并跳过操作。默认为 `false`。用于等待元素准备好执行操作而不实际执行它。


### elementHandle.dispatchEvent() {#element-handle-dispatch-event}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.dispatchEvent()`](/api/class-locator#locator-dispatch-event)。阅读更多关于 [locators](../locators.md) 的内容。
:::

下面的代码片段在元素上触发 `click` 事件。无论元素的可见性状态如何，都会触发 `click`。这等同于调用
[element.click()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click)。

**用法**

```js
await elementHandle.dispatchEvent('click');
```

在底层，它根据给定的 [`type`](/api/class-elementhandle#element-handle-dispatch-event-option-type) 创建一个事件实例，使用
[`eventInit`](/api/class-elementhandle#element-handle-dispatch-event-option-event-init) 属性初始化它，并在元素上触发它。事件默认是 `composed`、`cancelable` 且会冒泡的。

由于 [`eventInit`](/api/class-elementhandle#element-handle-dispatch-event-option-event-init) 是事件特定的，请参阅事件文档以获取初始属性列表：
* [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/DeviceMotionEvent)
* [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/DeviceOrientationEvent)
* [DragEvent](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/DragEvent)
* [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event)
* [FocusEvent](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/FocusEvent)
* [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent)
* [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent)
* [PointerEvent](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/PointerEvent)
* [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent)
* [WheelEvent](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/WheelEvent)

如果您想将活动对象传递到事件中，也可以将 `JSHandle` 指定为属性值：

```js
// 注意：您只能在 Chromium 和 Firefox 中创建 DataTransfer
const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
await elementHandle.dispatchEvent('dragstart', { dataTransfer });
```

**参数**

- <a id="element-handle-dispatch-event-option-type"></a>`type` `string`

  DOM 事件类型：`"click"`、`"dragstart"` 等。
- <a id="element-handle-dispatch-event-option-event-init"></a>`eventInit` `EvaluationArgument` *(可选)*

  可选的事件特定初始化属性。


### elementHandle.dispose() {#element-handle-dispose}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

`jsHandle.dispose` 方法停止引用元素句柄。


### elementHandle.evaluate() {#element-handle-evaluate}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression) 的返回值。

此方法将此句柄作为第一个参数传递给 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression)。

如果 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression) 返回 [Promise]，则 `handle.evaluate` 会等待 promise 解析并返回其值。

**用法**

```js
const tweetHandle = await page.$('.tweet .retweets');
expect(await tweetHandle.evaluate(node => node.innerText)).toBe('10 retweets');
```

**参数**

- <a id="element-handle-evaluate-option-expression"></a>`pageFunction` `function() | string`

  要在页面上下文中执行的函数。
- <a id="element-handle-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-option-expression) 的可选参数。
- <a id="element-handle-evaluate-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-evaluate-option-expose-functions"></a>`exposeFunctions` `boolean` *(可选)* <Badge type="info" text="Added in: v1.62" />

    设置为 `true` 时，[`arg`](/api/class-elementhandle#element-handle-evaluate-option-arg) 中传递的函数会暴露在页面中，可以从页面函数中调用。调用时返回其结果的 [Promise]。在底层，每个函数通过 [`page.exposeFunction()`](/api/class-page#page-expose-function) 暴露，因此技术上可以从页面的所有 frame 访问。暴露的函数在顶级导航时清除。默认为 `false`，在这种情况下，函数不可序列化，传递函数会抛出错误。

**返回值**

- `Promise<Serializable>`


### elementHandle.evaluateHandle() {#element-handle-evaluate-handle}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

以 [JSHandle](/api/class-jshandle) 形式返回 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-handle-option-expression) 的返回值。

此方法将此句柄作为第一个参数传递给 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-handle-option-expression)。

`jsHandle.evaluate` 和 `jsHandle.evaluateHandle` 之间的唯一区别是 `jsHandle.evaluateHandle` 返回 [JSHandle](/api/class-jshandle)。

如果传递给 `jsHandle.evaluateHandle` 的函数返回 [Promise]，则 `jsHandle.evaluateHandle` 会等待 promise 解析并返回其值。

有关更多详细信息，请参阅 [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle)。

**参数**

- <a id="element-handle-evaluate-handle-option-expression"></a>`pageFunction` `function() | string`

  要在页面上下文中执行的函数。
- <a id="element-handle-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-elementhandle#element-handle-evaluate-handle-option-expression) 的可选参数。
- <a id="element-handle-evaluate-handle-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-evaluate-handle-option-expose-functions"></a>`exposeFunctions` `boolean` *(可选)* <Badge type="info" text="Added in: v1.62" />

    设置为 `true` 时，[`arg`](/api/class-elementhandle#element-handle-evaluate-handle-option-arg) 中传递的函数会暴露在页面中，可以从页面函数中调用。调用时返回其结果的 [Promise]。在底层，每个函数通过 [`page.exposeFunction()`](/api/class-page#page-expose-function) 暴露，因此技术上可以从页面的所有 frame 访问。暴露的函数在顶级导航时清除。默认为 `false`，在这种情况下，函数不可序列化，传递函数会抛出错误。

**返回值**

- `Promise<JSHandle>`


### elementHandle.fill() {#element-handle-fill}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.fill()`](/api/class-locator#locator-fill)。阅读更多关于 [locators](../locators.md) 的内容。
:::

此方法等待[可操作性](../actionability.md)检查，聚焦元素，填充它并在填充后触发 `input` 事件。请注意，您可以传递空字符串来清除输入字段。

如果目标元素不是 `<input>`、`<textarea>` 或 `[contenteditable]` 元素，此方法会抛出错误。但是，如果元素位于具有关联[控件](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control)的 `<label>` 元素内，则会改为填充控件。

要发送细粒度的键盘事件，请使用 [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially)。

**参数**

- <a id="element-handle-fill-option-value"></a>`value` `string`

  要为 `<input>`、`<textarea>` 或 `[contenteditable]` 元素设置的值。
- <a id="element-handle-fill-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-fill-option-force"></a>`force` `boolean` *(可选)* <Badge type="info" text="Added in: v1.13" />

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="element-handle-fill-option-no-wait-after"></a>`noWaitAfter` `boolean` *(可选)*

    此选项无效。
  - <a id="element-handle-fill-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-fill-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。


### elementHandle.focus() {#element-handle-focus}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.focus()`](/api/class-locator#locator-focus)。阅读更多关于 [locators](../locators.md) 的内容。
:::

在元素上调用 [focus](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)。


### elementHandle.getAttribute() {#element-handle-get-attribute}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.getAttribute()`](/api/class-locator#locator-get-attribute)。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回元素属性值。

**参数**

- <a id="element-handle-get-attribute-option-name"></a>`name` `string`

  要获取值的属性名称。

**返回值**

- `Promise<null | string>`


### elementHandle.getProperties() {#element-handle-get-properties}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

该方法返回一个以**自有属性名称**为键、JSHandle 实例为属性值的 map。

**用法**

```js
const handle = await page.evaluateHandle(() => ({ window, document }));
const properties = await handle.getProperties();
const windowHandle = properties.get('window');
const documentHandle = properties.get('document');
await handle.dispose();
```

**返回值**

- `Promise<Map<string, JSHandle>>`


### elementHandle.getProperty() {#element-handle-get-property}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

从引用的对象获取单个属性。

**参数**

- <a id="element-handle-get-property-option-property-name"></a>`propertyName` `string`

  要获取的属性

**返回值**

- `Promise<JSHandle>`


### elementHandle.hover() {#element-handle-hover}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.hover()`](/api/class-locator#locator-hover)。阅读更多关于 [locators](../locators.md) 的内容。
:::

此方法通过执行以下步骤来悬停在元素上：
1. 等待元素的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-elementhandle#element-handle-hover-option-force) 选项。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.mouse`](/api/class-page#page-mouse) 悬停在元素的中心，或指定的 [`position`](/api/class-elementhandle#element-handle-hover-option-position)。

如果在操作过程中的任何时刻元素从 DOM 中分离，此方法将抛出错误。

当所有步骤组合在一起没有在指定的 [`timeout`](/api/class-elementhandle#element-handle-hover-option-timeout) 内完成时，此方法将抛出
[TimeoutError](/api/class-timeouterror)。传递零超时将禁用此功能。

**参数**

- <a id="element-handle-hover-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-hover-option-force"></a>`force` `boolean` *(可选)*

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="element-handle-hover-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(可选)*

    要按下的修饰键。确保在操作期间仅按下这些修饰键，然后恢复当前修饰键。如果未指定，则使用当前按下的修饰键。"ControlOrMeta" 在 Windows 和 Linux 上解析为 "Control"，在 macOS 上解析为 "Meta"。
  - <a id="element-handle-hover-option-no-wait-after"></a>`noWaitAfter` `boolean` *(可选)* <Badge type="info" text="Added in: v1.28" />

    此选项无效。
  - <a id="element-handle-hover-option-position"></a>`position` `Object` *(可选)*

    相对于元素内边距框左上角使用的点。如果未指定，则使用元素的某个可见点。

    - `x` `float`
    - `y` `float`
  - <a id="element-handle-hover-option-scroll"></a>`scroll` `"auto" | "none"` *(可选)* <Badge type="info" text="Added in: v1.62" />

    控制 Playwright 在执行操作前是否将元素滚动到视图中。默认为 `"auto"`，这会在必要时将元素滚动到视图中，包括滚动嵌套的可滚动容器。设置为 `"none"` 时，Playwright 不会滚动元素，如果元素不在视口中，操作将失败。这对于断言用户无需额外滚动即可访问元素很有用。
  - <a id="element-handle-hover-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-hover-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。
  - <a id="element-handle-hover-option-trial"></a>`trial` `boolean` *(可选)* <Badge type="info" text="Added in: v1.11" />

    设置后，此方法仅执行[可操作性](../actionability.md)检查并跳过操作。默认为 `false`。用于等待元素准备好执行操作而不实际执行它。


### elementHandle.innerHTML() {#element-handle-inner-html}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.innerHTML()`](/api/class-locator#locator-inner-html)。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回 `element.innerHTML`。

**返回值**

- `Promise<string>`


### elementHandle.innerText() {#element-handle-inner-text}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.innerText()`](/api/class-locator#locator-inner-text)。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回 `element.innerText`。

**返回值**

- `Promise<string>`


### elementHandle.inputValue() {#element-handle-input-value}

<Badge type="info" text="Added in: v1.13" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.inputValue()`](/api/class-locator#locator-input-value)。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回所选 `<input>` 或 `<textarea>` 或 `<select>` 元素的 `input.value`。

对于非输入元素会抛出错误。但是，如果元素位于具有关联[控件](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control)的 `<label>` 元素内，则返回控件的值。

**参数**

- <a id="element-handle-input-value-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-input-value-option-timeout"></a>`timeout` `float` *(可选)*

**返回值**

- `Promise<string>`


### elementHandle.isChecked() {#element-handle-is-checked}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.isChecked()`](/api/class-locator#locator-is-checked)。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回元素是否被勾选。如果元素不是复选框或单选按钮输入框，则抛出错误。

**返回值**

- `Promise<boolean>`


### elementHandle.isDisabled() {#element-handle-is-disabled}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.isDisabled()`](/api/class-locator#locator-is-disabled)。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回元素是否被禁用，与[启用](../actionability.md#enabled)相反。

**返回值**

- `Promise<boolean>`


### elementHandle.isEditable() {#element-handle-is-editable}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.isEditable()`](/api/class-locator#locator-is-editable)。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回元素是否[可编辑](../actionability.md#editable)。

**返回值**

- `Promise<boolean>`


### elementHandle.isEnabled() {#element-handle-is-enabled}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.isEnabled()`](/api/class-locator#locator-is-enabled)。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回元素是否[启用](../actionability.md#enabled)。

**返回值**

- `Promise<boolean>`


### elementHandle.isHidden() {#element-handle-is-hidden}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.isHidden()`](/api/class-locator#locator-is-hidden)。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回元素是否隐藏，与[可见](../actionability.md#visible)相反。

**返回值**

- `Promise<boolean>`


### elementHandle.isVisible() {#element-handle-is-visible}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.isVisible()`](/api/class-locator#locator-is-visible)。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回元素是否[可见](../actionability.md#visible)。

**返回值**

- `Promise<boolean>`


### elementHandle.jsonValue() {#element-handle-json-value}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回对象的 JSON 表示。如果对象有 `toJSON` 函数，它**不会被调用**。

::: info
如果引用的对象不可字符串化，该方法将返回空 JSON 对象。如果对象有循环引用，将抛出错误。
:::

**返回值**

- `Promise<Serializable>`


### elementHandle.ownerFrame() {#element-handle-owner-frame}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回包含给定元素的 frame。

**返回值**

- `Promise<null | Frame>`


### elementHandle.press() {#element-handle-press}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.press()`](/api/class-locator#locator-press)。阅读更多关于 [locators](../locators.md) 的内容。
:::

聚焦元素，然后使用 [`keyboard.down()`](/api/class-keyboard#keyboard-down) 和 [`keyboard.up()`](/api/class-keyboard#keyboard-up)。

[`key`](/api/class-elementhandle#element-handle-press-option-key) 可以指定预期的
[keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) 值或单个字符来生成文本。[`key`](/api/class-elementhandle#element-handle-press-option-key) 值的超集可以在
[这里](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)找到。键的示例包括：

`F1` - `F12`、`Digit0`- `Digit9`、`KeyA`- `KeyZ`、`Backquote`、`Minus`、`Equal`、`Backslash`、`Backspace`、`Tab`、`Delete`、`Escape`、`ArrowDown`、`End`、`Enter`、`Home`、`Insert`、`PageDown`、`PageUp`、`ArrowRight`、`ArrowUp` 等。

还支持以下修饰快捷键：`Shift`、`Control`、`Alt`、`Meta`、`ShiftLeft`、`ControlOrMeta`。

按住 `Shift` 将输入对应于 [`key`](/api/class-elementhandle#element-handle-press-option-key) 的大写文本。

如果 [`key`](/api/class-elementhandle#element-handle-press-option-key) 是单个字符，则区分大小写，因此值 `a` 和 `A` 将生成不同的文本。

也支持 `key: "Control+o"`、`key: "Control++` 或 `key: "Control+Shift+T"` 等快捷键。指定修饰符时，修饰符会被按下并保持，同时按下后续键。

**参数**

- <a id="element-handle-press-option-key"></a>`key` `string`

  要按下的键名或要生成的字符，例如 `ArrowLeft` 或 `a`。
- <a id="element-handle-press-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-press-option-delay"></a>`delay` `float` *(可选)*

    `keydown` 和 `keyup` 之间等待的时间（毫秒）。默认为 0。
  - <a id="element-handle-press-option-no-wait-after"></a>`noWaitAfter` `boolean` *(可选)*

    发起导航的操作正在等待这些导航发生并等待页面开始加载。您可以通过设置此标志来选择不等待。只有在特殊情况下才需要此选项，例如导航到无法访问的页面。默认为 `false`。
  - <a id="element-handle-press-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-press-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。


### elementHandle.screenshot() {#element-handle-screenshot}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.screenshot()`](/api/class-locator#locator-screenshot)。阅读更多关于 [locators](../locators.md) 的内容。
:::

此方法捕获页面的截图，裁剪到此特定元素的大小和位置。如果元素被其他元素覆盖，它在截图中实际上不可见。如果元素是可滚动容器，只有当前滚动的内容会在截图中可见。

此方法等待[可操作性](../actionability.md)检查，然后在截图前将元素滚动到视图中。如果元素从 DOM 中分离，该方法将抛出错误。

返回包含捕获截图的 buffer。

**参数**

- <a id="element-handle-screenshot-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-screenshot-option-animations"></a>`animations` `"disabled" | "allow"` *(可选)*

    设置为 `"disabled"` 时，停止 CSS 动画、CSS 过渡和 Web 动画。动画根据其持续时间获得不同的处理：
    * 有限动画会快进到完成，因此它们会触发 `transitionend` 事件。
    * 无限动画会取消到初始状态，然后在截图后重新播放。

    默认为 `"allow"`，保持动画不变。
  - <a id="element-handle-screenshot-option-caret"></a>`caret` `"hide" | "initial"` *(可选)*

    设置为 `"hide"` 时，截图将隐藏文本光标。设置为 `"initial"` 时，文本光标行为不会改变。默认为 `"hide"`。
  - <a id="element-handle-screenshot-option-mask"></a>`mask` `Array<Locator>` *(可选)*

    指定截图时应被遮罩的定位器。被遮罩的元素将被粉色框 `#FF00FF`（由 [`maskColor`](/api/class-elementhandle#element-handle-screenshot-option-mask-color) 自定义）覆盖，完全覆盖其边界框。遮罩也应用于不可见元素，请参阅[仅匹配可见元素](../locators.md#matching-only-visible-elements)以禁用该功能。
  - <a id="element-handle-screenshot-option-mask-color"></a>`maskColor` `string` *(可选)* <Badge type="info" text="Added in: v1.35" />

    指定被遮罩元素的覆盖框颜色，使用 [CSS 颜色格式](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)。默认颜色是粉色 `#FF00FF`。
  - <a id="element-handle-screenshot-option-omit-background"></a>`omitBackground` `boolean` *(可选)*

    隐藏默认白色背景并允许捕获透明截图。不适用于 `jpeg` 图像。默认为 `false`。
  - <a id="element-handle-screenshot-option-path"></a>`path` `path` *(可选)*

    保存图像的文件路径。截图类型将从文件扩展名推断。如果 [`path`](/api/class-elementhandle#element-handle-screenshot-option-path) 是相对路径，则相对于当前工作目录解析。如果未提供路径，图像不会保存到磁盘。
  - <a id="element-handle-screenshot-option-quality"></a>`quality` `int` *(可选)*

    图像质量，介于 0-100 之间。不适用于 `png` 图像。对于 `jpeg`，默认为 `80`。对于 `webp`，质量为 `100`（默认）会生成无损图像，较低的值使用有损压缩。
  - <a id="element-handle-screenshot-option-scale"></a>`scale` `"css" | "device"` *(可选)*

    设置为 `"css"` 时，截图每个 css 像素对应页面上的一个像素。对于高 dpi 设备，这将保持截图较小。使用 `"device"` 选项将每个设备像素对应一个像素，因此高 dpi 设备的截图将是两倍或更大。

    默认为 `"device"`。
  - <a id="element-handle-screenshot-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-screenshot-option-style"></a>`style` `string` *(可选)* <Badge type="info" text="Added in: v1.41" />

    截图时要应用的样式表文本。您可以在此隐藏动态元素、使元素不可见或更改它们的属性以帮助创建可重复的截图。此样式表会穿透 Shadow DOM 并应用于内部 frame。
  - <a id="element-handle-screenshot-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。
  - <a id="element-handle-screenshot-option-type"></a>`type` `"png" | "jpeg" | "webp"` *(可选)*

    指定截图类型，默认为 `png`。

**返回值**

- `Promise<Buffer>`


### elementHandle.scrollIntoViewIfNeeded() {#element-handle-scroll-into-view-if-needed}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.scrollIntoViewIfNeeded()`](/api/class-locator#locator-scroll-into-view-if-needed)。阅读更多关于 [locators](../locators.md) 的内容。
:::

此方法等待[可操作性](../actionability.md)检查，然后尝试将元素滚动到视图中，除非它已完全可见（由
[IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 的 `ratio` 定义）。

当 `elementHandle` 没有指向一个
[连接](https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected)到 Document 或 ShadowRoot 的元素时抛出错误。

有关滚动的其他方式，请参阅[滚动](../input.md#scrolling)。

**参数**

- <a id="element-handle-scroll-into-view-if-needed-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-scroll-into-view-if-needed-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-scroll-into-view-if-needed-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。


### elementHandle.selectOption() {#element-handle-select-option}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.selectOption()`](/api/class-locator#locator-select-option)。阅读更多关于 [locators](../locators.md) 的内容。
:::

此方法等待[可操作性](../actionability.md)检查，等待所有指定的选项都出现在 `<select>` 元素中并选择这些选项。

如果目标元素不是 `<select>` 元素，此方法会抛出错误。但是，如果元素位于具有关联[控件](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control)的 `<label>` 元素内，则会改用控件。

返回已成功选择的选项值数组。

一旦所有提供的选项都被选中，就会触发 `change` 和 `input` 事件。

**用法**

```js
// 单选匹配值或标签
handle.selectOption('blue');

// 单选匹配标签
handle.selectOption({ label: 'Blue' });

// 多选
handle.selectOption(['red', 'green', 'blue']);
```

**参数**

- <a id="element-handle-select-option-option-values"></a>`values` `null | string | ElementHandle | Array<string> | Object | Array<ElementHandle> | Array<Object>`

  要选择的选项。如果 `<select>` 具有 `multiple` 属性，则选择所有匹配的选项，否则只选择匹配传递选项之一的第一个选项。字符串值同时匹配值和标签。如果所有指定的属性都匹配，则认为选项匹配。

  - `value` `string` *(可选)*

    按 `option.value` 匹配。可选。
  - `label` `string` *(可选)*

    按 `option.label` 匹配。可选。
  - `index` `int` *(可选)*

    按索引匹配。可选。
- <a id="element-handle-select-option-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-select-option-option-force"></a>`force` `boolean` *(可选)* <Badge type="info" text="Added in: v1.13" />

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="element-handle-select-option-option-no-wait-after"></a>`noWaitAfter` `boolean` *(可选)*

    此选项无效。
  - <a id="element-handle-select-option-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-select-option-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。

**返回值**

- `Promise<Array<string>>`


### elementHandle.selectText() {#element-handle-select-text}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.selectText()`](/api/class-locator#locator-select-text)。阅读更多关于 [locators](../locators.md) 的内容。
:::

此方法等待[可操作性](../actionability.md)检查，然后聚焦元素并选择其所有文本内容。

如果元素位于具有关联[控件](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control)的 `<label>` 元素内，则改为聚焦并选择控件中的文本。

**参数**

- <a id="element-handle-select-text-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-select-text-option-force"></a>`force` `boolean` *(可选)* <Badge type="info" text="Added in: v1.13" />

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="element-handle-select-text-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-select-text-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。


### elementHandle.setChecked() {#element-handle-set-checked}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.setChecked()`](/api/class-locator#locator-set-checked)。阅读更多关于 [locators](../locators.md) 的内容。
:::

此方法通过执行以下步骤来勾选或取消勾选元素：
1. 确保元素是复选框或单选按钮输入框。如果不是，此方法将抛出错误。
1. 如果元素已经具有正确的勾选状态，此方法会立即返回。
1. 等待匹配元素的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-elementhandle#element-handle-set-checked-option-force) 选项。如果元素在检查期间分离，整个操作将重试。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.mouse`](/api/class-page#page-mouse) 点击元素的中心。
1. 确保元素现在已勾选或未勾选。如果没有，此方法将抛出错误。

当所有步骤组合在一起没有在指定的 [`timeout`](/api/class-elementhandle#element-handle-set-checked-option-timeout) 内完成时，此方法将抛出
[TimeoutError](/api/class-timeouterror)。传递零超时将禁用此功能。

**参数**

- <a id="element-handle-set-checked-option-checked"></a>`checked` `boolean`

  是勾选还是取消勾选复选框。
- <a id="element-handle-set-checked-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-set-checked-option-force"></a>`force` `boolean` *(可选)*

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="element-handle-set-checked-option-no-wait-after"></a>`noWaitAfter` `boolean` *(可选)*

    此选项无效。
  - <a id="element-handle-set-checked-option-position"></a>`position` `Object` *(可选)*

    相对于元素内边距框左上角使用的点。如果未指定，则使用元素的某个可见点。

    - `x` `float`
    - `y` `float`
  - <a id="element-handle-set-checked-option-scroll"></a>`scroll` `"auto" | "none"` *(可选)* <Badge type="info" text="Added in: v1.62" />

    控制 Playwright 在执行操作前是否将元素滚动到视图中。默认为 `"auto"`，这会在必要时将元素滚动到视图中，包括滚动嵌套的可滚动容器。设置为 `"none"` 时，Playwright 不会滚动元素，如果元素不在视口中，操作将失败。这对于断言用户无需额外滚动即可访问元素很有用。
  - <a id="element-handle-set-checked-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-set-checked-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。
  - <a id="element-handle-set-checked-option-trial"></a>`trial` `boolean` *(可选)*

    设置后，此方法仅执行[可操作性](../actionability.md)检查并跳过操作。默认为 `false`。用于等待元素准备好执行操作而不实际执行它。


### elementHandle.setInputFiles() {#element-handle-set-input-files}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.setInputFiles()`](/api/class-locator#locator-set-input-files)。阅读更多关于 [locators](../locators.md) 的内容。
:::

将文件输入的值设置为这些文件路径或文件。如果某些 `filePaths` 是相对路径，则它们相对于当前工作目录解析。对于空数组，清除所选文件。
对于具有 `[webkitdirectory]` 属性的输入，仅支持单个目录路径。

此方法期望 [ElementHandle](/api/class-elementhandle) 指向一个
[input 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)。但是，如果元素位于具有关联[控件](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control)的 `<label>` 元素内，则改为定位控件。

**参数**

- <a id="element-handle-set-input-files-option-files"></a>`files` `path | Array<path> | Object | Array<Object>`

  - `name` `string`

    文件名
  - `mimeType` `string`

    文件类型
  - `buffer` `Buffer`

    文件内容
- <a id="element-handle-set-input-files-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-set-input-files-option-no-wait-after"></a>`noWaitAfter` `boolean` *(可选)*

    此选项无效。
  - <a id="element-handle-set-input-files-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-set-input-files-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。


### elementHandle.tap() {#element-handle-tap}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.tap()`](/api/class-locator#locator-tap)。阅读更多关于 [locators](../locators.md) 的内容。
:::

此方法通过执行以下步骤来点击元素：
1. 等待元素的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-elementhandle#element-handle-tap-option-force) 选项。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.touchscreen`](/api/class-page#page-touchscreen) 点击元素的中心，或指定的 [`position`](/api/class-elementhandle#element-handle-tap-option-position)。

如果在操作过程中的任何时刻元素从 DOM 中分离，此方法将抛出错误。

当所有步骤组合在一起没有在指定的 [`timeout`](/api/class-elementhandle#element-handle-tap-option-timeout) 内完成时，此方法将抛出
[TimeoutError](/api/class-timeouterror)。传递零超时将禁用此功能。

::: info
`elementHandle.tap()` 要求浏览器上下文的 `hasTouch` 选项设置为 true。
:::

**参数**

- <a id="element-handle-tap-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-tap-option-force"></a>`force` `boolean` *(可选)*

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="element-handle-tap-option-modifiers"></a>`modifiers` `Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift">` *(可选)*

    要按下的修饰键。确保在操作期间仅按下这些修饰键，然后恢复当前修饰键。如果未指定，则使用当前按下的修饰键。"ControlOrMeta" 在 Windows 和 Linux 上解析为 "Control"，在 macOS 上解析为 "Meta"。
  - <a id="element-handle-tap-option-no-wait-after"></a>`noWaitAfter` `boolean` *(可选)*

    此选项无效。
  - <a id="element-handle-tap-option-position"></a>`position` `Object` *(可选)*

    相对于元素内边距框左上角使用的点。如果未指定，则使用元素的某个可见点。

    - `x` `float`
    - `y` `float`
  - <a id="element-handle-tap-option-scroll"></a>`scroll` `"auto" | "none"` *(可选)* <Badge type="info" text="Added in: v1.62" />

    控制 Playwright 在执行操作前是否将元素滚动到视图中。默认为 `"auto"`，这会在必要时将元素滚动到视图中，包括滚动嵌套的可滚动容器。设置为 `"none"` 时，Playwright 不会滚动元素，如果元素不在视口中，操作将失败。这对于断言用户无需额外滚动即可访问元素很有用。
  - <a id="element-handle-tap-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-tap-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。
  - <a id="element-handle-tap-option-trial"></a>`trial` `boolean` *(可选)* <Badge type="info" text="Added in: v1.11" />

    设置后，此方法仅执行[可操作性](../actionability.md)检查并跳过操作。默认为 `false`。用于等待元素准备好执行操作而不实际执行它。


### elementHandle.textContent() {#element-handle-text-content}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.textContent()`](/api/class-locator#locator-text-content)。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回 `node.textContent`。

**返回值**

- `Promise<null | string>`


### elementHandle.uncheck() {#element-handle-uncheck}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用基于 locator 的 [`locator.uncheck()`](/api/class-locator#locator-uncheck)。阅读更多关于 [locators](../locators.md) 的内容。
:::

此方法通过执行以下步骤来取消勾选元素：
1. 确保元素是复选框或单选按钮输入框。如果不是，此方法将抛出错误。如果元素已经未勾选，此方法会立即返回。
1. 等待元素的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-elementhandle#element-handle-uncheck-option-force) 选项。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.mouse`](/api/class-page#page-mouse) 点击元素的中心。
1. 确保元素现在已取消勾选。如果没有，此方法将抛出错误。

如果在操作过程中的任何时刻元素从 DOM 中分离，此方法将抛出错误。

当所有步骤组合在一起没有在指定的 [`timeout`](/api/class-elementhandle#element-handle-uncheck-option-timeout) 内完成时，此方法将抛出
[TimeoutError](/api/class-timeouterror)。传递零超时将禁用此功能。

**参数**

- <a id="element-handle-uncheck-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-uncheck-option-force"></a>`force` `boolean` *(可选)*

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="element-handle-uncheck-option-no-wait-after"></a>`noWaitAfter` `boolean` *(可选)*

    此选项无效。
  - <a id="element-handle-uncheck-option-position"></a>`position` `Object` *(可选)* <Badge type="info" text="Added in: v1.11" />

    相对于元素内边距框左上角使用的点。如果未指定，则使用元素的某个可见点。

    - `x` `float` <Badge type="info" text="Added in: v1.11" />
    - `y` `float` <Badge type="info" text="Added in: v1.11" />
  - <a id="element-handle-uncheck-option-scroll"></a>`scroll` `"auto" | "none"` *(可选)* <Badge type="info" text="Added in: v1.62" />

    控制 Playwright 在执行操作前是否将元素滚动到视图中。默认为 `"auto"`，这会在必要时将元素滚动到视图中，包括滚动嵌套的可滚动容器。设置为 `"none"` 时，Playwright 不会滚动元素，如果元素不在视口中，操作将失败。这对于断言用户无需额外滚动即可访问元素很有用。
  - <a id="element-handle-uncheck-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-uncheck-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。
  - <a id="element-handle-uncheck-option-trial"></a>`trial` `boolean` *(可选)* <Badge type="info" text="Added in: v1.11" />

    设置后，此方法仅执行[可操作性](../actionability.md)检查并跳过操作。默认为 `false`。用于等待元素准备好执行操作而不实际执行它。


### elementHandle.waitForElementState() {#element-handle-wait-for-element-state}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

当元素满足 [`state`](/api/class-elementhandle#element-handle-wait-for-element-state-option-state) 条件时返回。

根据 [`state`](/api/class-elementhandle#element-handle-wait-for-element-state-option-state) 参数，此方法等待[可操作性](../actionability.md)检查之一通过。当等待 `"hidden"` 状态以外的状态时，如果元素在等待时分离，此方法会抛出错误。
* `"visible"` 等待元素[可见](../actionability.md#visible)。
* `"hidden"` 等待元素[不可见](../actionability.md#visible)或未附加。请注意，等待 hidden 在元素分离时不会抛出错误。
* `"stable"` 等待元素同时[可见](../actionability.md#visible)和[稳定](../actionability.md#stable)。
* `"enabled"` 等待元素[启用](../actionability.md#enabled)。
* `"disabled"` 等待元素[未启用](../actionability.md#enabled)。
* `"editable"` 等待元素[可编辑](../actionability.md#editable)。

如果元素在 [`timeout`](/api/class-elementhandle#element-handle-wait-for-element-state-option-timeout) 毫秒内不满足条件，此方法将抛出错误。

**参数**

- <a id="element-handle-wait-for-element-state-option-state"></a>`state` `"visible" | "hidden" | "stable" | "enabled" | "disabled" | "editable"`

  要等待的状态，详见下文。
- <a id="element-handle-wait-for-element-state-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-wait-for-element-state-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-wait-for-element-state-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。


### elementHandle.waitForSelector() {#element-handle-wait-for-selector}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐使用
请改用断言可见性的 web 断言或基于 locator 的 [`locator.waitFor()`](/api/class-locator#locator-wait-for)。
:::

当选择器指定的元素满足 [`state`](/api/class-elementhandle#element-handle-wait-for-selector-option-state) 选项时返回该元素。如果等待 `hidden` 或 `detached`，则返回 `null`。

等待相对于元素句柄的 [`selector`](/api/class-elementhandle#element-handle-wait-for-selector-option-selector) 满足 [`state`](/api/class-elementhandle#element-handle-wait-for-selector-option-state) 选项（从 dom 中出现/消失，或变为可见/隐藏）。如果在调用方法时 [`selector`](/api/class-elementhandle#element-handle-wait-for-selector-option-selector) 已经满足条件，该方法将立即返回。如果选择器在 [`timeout`](/api/class-elementhandle#element-handle-wait-for-selector-option-timeout) 毫秒内不满足条件，该函数将抛出错误。

**用法**

```js
await page.setContent(`<div><span></span></div>`);
const div = await page.$('div');
// 等待相对于 div 的 'span' 选择器。
const span = await div.waitForSelector('span', { state: 'attached' });
```

::: info
此方法在导航期间不起作用，请改用 [`page.waitForSelector()`](/api/class-page#page-wait-for-selector)。
:::

**参数**

- <a id="element-handle-wait-for-selector-option-selector"></a>`selector` `string`

  要查询的选择器。
- <a id="element-handle-wait-for-selector-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-wait-for-selector-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-wait-for-selector-option-state"></a>`state` `"attached" | "detached" | "visible" | "hidden"` *(可选)*

    默认为 `'visible'`。可以是：
    * `'attached'` - 等待元素出现在 DOM 中。
    * `'detached'` - 等待元素不在 DOM 中。
    * `'visible'` - 等待元素具有非空边界框且没有 `visibility:hidden`。请注意，没有任何内容或 `display:none` 的元素具有空边界框，不被视为可见。
    * `'hidden'` - 等待元素从 DOM 分离，或具有空边界框或 `visibility:hidden`。这与 `'visible'` 选项相反。
  - <a id="element-handle-wait-for-selector-option-strict"></a>`strict` `boolean` *(可选)* <Badge type="info" text="Added in: v1.15" />

    为 true 时，调用要求选择器解析为单个元素。如果给定的选择器解析为多个元素，调用将抛出异常。
  - <a id="element-handle-wait-for-selector-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。

**返回值**

- `Promise<null | ElementHandle>`


## 已弃用

### elementHandle.type() {#element-handle-type}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: danger 已弃用
在大多数情况下，您应该改用 [`locator.fill()`](/api/class-locator#locator-fill)。只有当页面上有特殊的键盘处理时，才需要逐个按键 - 在这种情况下使用 [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially)。
:::

聚焦元素，然后为文本中的每个字符发送 `keydown`、`keypress`/`input` 和 `keyup` 事件。

要按特殊键，如 `Control` 或 `ArrowDown`，请使用 [`elementHandle.press()`](/api/class-elementhandle#element-handle-press)。

**用法**

**参数**

- <a id="element-handle-type-option-text"></a>`text` `string`

  要输入到聚焦元素中的文本。
- <a id="element-handle-type-option-options"></a>`options` `Object` *(可选)*

  - <a id="element-handle-type-option-delay"></a>`delay` `float` *(可选)*

    按键之间等待的时间（毫秒）。默认为 0。
  - <a id="element-handle-type-option-no-wait-after"></a>`noWaitAfter` `boolean` *(可选)*

    此选项无效。
  - <a id="element-handle-type-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    允许使用 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 取消操作。如果信号被中止，操作将被中止并抛出错误。请注意，提供信号不会禁用默认超时，可以使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 更改默认超时；传递 `timeout: 0` 可完全禁用超时。
  - <a id="element-handle-type-option-timeout"></a>`timeout` `float` *(可选)*

    最大超时时间（毫秒）。默认为 `0` - 无超时。可以通过配置中的 `actionTimeout` 选项或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法更改默认值。
