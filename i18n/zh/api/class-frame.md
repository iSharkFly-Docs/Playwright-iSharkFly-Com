---
title: Frame
outline: 2
---

# Frame

<Badge type="info" text="Added in: v1.8" />

在任何时间点，页面都通过 [`page.mainFrame()`](/api/class-page#page-main-frame) 和 [`frame.childFrames()`](/api/class-frame#frame-child-frames) 方法暴露其当前的框架树。

[Frame](/api/class-frame) 对象的生命周期由三个事件控制，这些事件在页面对象上分发：
* [`page.on('frameAttached')`](/api/class-page#page-event-frame-attached) - 当框架附加到页面时触发。一个 Frame 只能附加到页面一次。
* [`page.on('frameNavigated')`](/api/class-page#page-event-frame-navigated) - 当框架导航到不同的 URL 时触发。
* [`page.on('frameDetached')`](/api/class-page#page-event-frame-detached) - 当框架从页面分离时触发。一个 Frame 只能从页面分离一次。

输出框架树的示例：

```js
const { firefox } = require('playwright');  // 或 'chromium' 或 'webkit'

(async () => {
  const browser = await firefox.launch();
  const page = await browser.newPage();
  await page.goto('https://www.google.com/chrome/browser/canary.html');
  dumpFrameTree(page.mainFrame(), '');
  await browser.close();

  function dumpFrameTree(frame, indent) {
    console.log(indent + frame.url());
    for (const child of frame.childFrames())
      dumpFrameTree(child, indent + '  ');
  }
})();
```

## 方法

### frame.$() {#frame-query-selector}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning 不推荐
请使用基于定位器的 [`frame.locator()`](/api/class-frame#frame-locator) 代替。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回指向框架元素的 ElementHandle。

::: warning
不推荐使用 [ElementHandle](/api/class-elementhandle)，请使用 [Locator](/api/class-locator) 对象和 web-first 断言代替。
:::

该方法在框架内查找与指定选择器匹配的元素。如果没有元素匹配选择器，则返回 `null`。

**参数**

- <a id="frame-query-selector-option-selector"></a>`selector` `string`

  要查询的选择器。
- <a id="frame-query-selector-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-query-selector-option-strict"></a>`strict` `boolean` *(可选)* <Badge type="info" text="Added in: v1.14" />

    当为 true 时，调用要求选择器解析为单个元素。如果给定的选择器解析为多个元素，调用将抛出异常。

**返回值**

- `Promise<null | ElementHandle>`


### frame.$$() {#frame-query-selector-all}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning 不推荐
请使用基于定位器的 [`frame.locator()`](/api/class-frame#frame-locator) 代替。阅读更多关于 [locators](../locators.md) 的内容。
:::

返回指向框架元素的 ElementHandles。

::: warning
不推荐使用 [ElementHandle](/api/class-elementhandle)，请使用 [Locator](/api/class-locator) 对象代替。
:::

该方法在框架内查找所有与指定选择器匹配的元素。如果没有元素匹配选择器，则返回空数组。

**参数**

- <a id="frame-query-selector-all-option-selector"></a>`selector` `string`

  要查询的选择器。

**返回值**

- `Promise<Array<ElementHandle>>`


### frame.$$eval() {#frame-eval-on-selector-all}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning 不推荐
在大多数情况下，[`locator.evaluateAll()`](/api/class-locator#locator-evaluate-all)、其他 [Locator](/api/class-locator) 辅助方法和 web-first 断言可以更好地完成任务。
:::

返回 [`pageFunction`](/api/class-frame#frame-eval-on-selector-all-option-expression) 的返回值。

该方法在框架内查找所有与指定选择器匹配的元素，并将匹配元素的数组作为第一个参数传递给 [`pageFunction`](/api/class-frame#frame-eval-on-selector-all-option-expression)。

如果 [`pageFunction`](/api/class-frame#frame-eval-on-selector-all-option-expression) 返回一个 [Promise]，则 [`frame.$$eval()`](/api/class-frame#frame-eval-on-selector-all) 将等待 promise 解析并返回其值。

**用法**

```js
const divsCounts = await frame.$$eval('div', (divs, min) => divs.length >= min, 10);
```

**参数**

- <a id="frame-eval-on-selector-all-option-selector"></a>`selector` `string`

  要查询的选择器。
- <a id="frame-eval-on-selector-all-option-expression"></a>`pageFunction` `function(Array<Element>) | string`

  要在页面上下文中执行的函数。
- <a id="frame-eval-on-selector-all-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-frame#frame-eval-on-selector-all-option-expression) 的可选参数。

**返回值**

- `Promise<Serializable>`


### frame.$eval() {#frame-eval-on-selector}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning 不推荐
此方法不会等待元素通过可操作性检查，因此可能导致不稳定的测试。请使用 [`locator.evaluate()`](/api/class-locator#locator-evaluate)、其他 [Locator](/api/class-locator) 辅助方法或 web-first 断言代替。
:::

返回 [`pageFunction`](/api/class-frame#frame-eval-on-selector-option-expression) 的返回值。

该方法在框架内查找与指定选择器匹配的元素，并将其作为第一个参数传递给 [`pageFunction`](/api/class-frame#frame-eval-on-selector-option-expression)。如果没有元素匹配选择器，该方法将抛出错误。

如果 [`pageFunction`](/api/class-frame#frame-eval-on-selector-option-expression) 返回一个 [Promise]，则 [`frame.$eval()`](/api/class-frame#frame-eval-on-selector) 将等待 promise 解析并返回其值。

**用法**

```js
const searchValue = await frame.$eval('#search', el => el.value);
const preloadHref = await frame.$eval('link[rel=preload]', el => el.href);
const html = await frame.$eval('.main-container', (e, suffix) => e.outerHTML + suffix, 'hello');
```

**参数**

- <a id="frame-eval-on-selector-option-selector"></a>`selector` `string`

  要查询的选择器。
- <a id="frame-eval-on-selector-option-expression"></a>`pageFunction` `function(Element) | string`

  要在页面上下文中执行的函数。
- <a id="frame-eval-on-selector-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-frame#frame-eval-on-selector-option-expression) 的可选参数。
- <a id="frame-eval-on-selector-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-eval-on-selector-option-strict"></a>`strict` `boolean` *(可选)* <Badge type="info" text="Added in: v1.14" />

    当为 true 时，调用要求选择器解析为单个元素。如果给定的选择器解析为多个元素，调用将抛出异常。

**返回值**

- `Promise<Serializable>`


### frame.addScriptTag() {#frame-add-script-tag}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

当脚本的 onload 触发或脚本内容被注入到框架时，返回添加的标签。

向页面添加一个具有所需 url 或内容的 `<script>` 标签。

**参数**

- <a id="frame-add-script-tag-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-add-script-tag-option-content"></a>`content` `string` *(可选)*

    要注入到框架的原始 JavaScript 内容。
  - <a id="frame-add-script-tag-option-path"></a>`path` `path` *(可选)*

    要注入到框架的 JavaScript 文件路径。如果 `path` 是相对路径，则相对于当前工作目录解析。
  - <a id="frame-add-script-tag-option-type"></a>`type` `string` *(可选)*

    脚本类型。使用 'module' 以加载 JavaScript ES6 模块。有关更多详细信息，请参阅 [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)。
  - <a id="frame-add-script-tag-option-url"></a>`url` `string` *(可选)*

    要添加的脚本的 URL。

**返回值**

- `Promise<ElementHandle>`


### frame.addStyleTag() {#frame-add-style-tag}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

当样式表的 onload 触发或 CSS 内容被注入到框架时，返回添加的标签。

向页面添加一个具有所需 url 的 `<link rel="stylesheet">` 标签或一个具有内容的 `<style type="text/css">` 标签。

**参数**

- <a id="frame-add-style-tag-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-add-style-tag-option-content"></a>`content` `string` *(可选)*

    要注入到框架的原始 CSS 内容。
  - <a id="frame-add-style-tag-option-path"></a>`path` `path` *(可选)*

    要注入到框架的 CSS 文件路径。如果 `path` 是相对路径，则相对于当前工作目录解析。
  - <a id="frame-add-style-tag-option-url"></a>`url` `string` *(可选)*

    `<link>` 标签的 URL。

**返回值**

- `Promise<ElementHandle>`


### frame.childFrames() {#frame-child-frames}

<Badge type="info" text="Added in: v1.8" />

**返回值**

- `Array<Frame>`


### frame.content() {#frame-content}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

获取框架的完整 HTML 内容，包括 doctype。

**返回值**

- `Promise<string>`


### frame.evaluate() {#frame-evaluate}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回 [`pageFunction`](/api/class-frame#frame-evaluate-option-expression) 的返回值。

如果传递给 [`frame.evaluate()`](/api/class-frame#frame-evaluate) 的函数返回一个 [Promise]，则 [`frame.evaluate()`](/api/class-frame#frame-evaluate) 将等待 promise 解析并返回其值。

如果传递给 [`frame.evaluate()`](/api/class-frame#frame-evaluate) 的函数返回一个非 [Serializable] 的值，则 [`frame.evaluate()`](/api/class-frame#frame-evaluate) 返回 `undefined`。Playwright 还支持传输一些 `JSON` 无法序列化的其他值：`-0`、`NaN`、`Infinity`、`-Infinity`。

**用法**

```js
const result = await frame.evaluate(([x, y]) => {
  return Promise.resolve(x * y);
}, [7, 8]);
console.log(result); // 打印 "56"
```

也可以传递字符串而不是函数。

```js
console.log(await frame.evaluate('1 + 2')); // 打印 "3"
```

**参数**

- <a id="frame-evaluate-option-expression"></a>`pageFunction` `function() | string`

  要在页面上下文中执行的函数。
- <a id="frame-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-frame#frame-evaluate-option-expression) 的可选参数。

**返回值**

- `Promise<Serializable>`


### frame.evaluateHandle() {#frame-evaluate-handle}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回 [`pageFunction`](/api/class-frame#frame-evaluate-handle-option-expression) 的返回值作为 [JSHandle](/api/class-jshandle)。

[`frame.evaluate()`](/api/class-frame#frame-evaluate) 和 [`frame.evaluateHandle()`](/api/class-frame#frame-evaluate-handle) 之间的唯一区别是 [`frame.evaluateHandle()`](/api/class-frame#frame-evaluate-handle) 返回 [JSHandle](/api/class-jshandle)。

**用法**

```js
// window 对象的句柄
const aWindowHandle = await frame.evaluateHandle(() => Promise.resolve(window));
```

**参数**

- <a id="frame-evaluate-handle-option-expression"></a>`pageFunction` `function() | string`

  要在页面上下文中执行的函数。
- <a id="frame-evaluate-handle-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-frame#frame-evaluate-handle-option-expression) 的可选参数。

**返回值**

- `Promise<JSHandle>`


### frame.frameElement() {#frame-frame-element}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回对应于此框架的 `frame` 或 `iframe` 元素句柄。

这是 [`elementHandle.contentFrame()`](/api/class-elementhandle#element-handle-content-frame) 的逆操作。请注意，返回的句柄实际上属于父框架。

如果在 `frameElement()` 返回之前框架已被分离，此方法将抛出错误。

**用法**

```js
const frameElement = await frame.frameElement();
const contentFrame = await frameElement.contentFrame();
console.log(frame === contentFrame);  // -> true
```

**返回值**

- `Promise<ElementHandle>`


### frame.frameLocator() {#frame-frame-locator}

<Badge type="info" text="Added in: v1.17" />

当使用 iframe 时，您可以创建一个框架定位器，它将进入 iframe 并允许在该 iframe 中选择元素。

**用法**

以下代码片段在 id 为 `my-frame` 的 iframe 中定位文本为 "Submit" 的元素：

```js
const locator = frame.frameLocator('#my-iframe').getByText('Submit');
await locator.click();
```

**参数**

- <a id="frame-frame-locator-option-selector"></a>`selector` `string` *(可选)*

  匹配框架元素的选择器。

**返回值**

- `FrameLocator`


### frame.getByAltText() {#frame-get-by-alt-text}

<Badge type="info" text="Added in: v1.27" />

允许通过元素的 alt 文本定位元素。

**用法**

例如，此方法将通过 alt 文本 "Playwright logo" 找到图像：

```html
<img alt='Playwright logo'>
```

```js
await page.getByAltText('Playwright logo').click();
```

**参数**

- <a id="frame-get-by-alt-text-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="frame-get-by-alt-text-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-get-by-alt-text-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写和整个字符串。默认为 false。

**返回值**

- `Locator`


### frame.getByLabel() {#frame-get-by-label}

<Badge type="info" text="Added in: v1.27" />

允许通过关联的 `<label>` 或 `aria-labelledby` 元素的文本，或通过 `aria-label` 属性定位输入元素。

**用法**

```js
await page.getByLabel('Username').fill('john');
await page.getByLabel('Password').fill('secret');
```

**参数**

- <a id="frame-get-by-label-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="frame-get-by-label-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-get-by-label-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写和整个字符串。默认为 false。

**返回值**

- `Locator`


### frame.getByPlaceholder() {#frame-get-by-placeholder}

<Badge type="info" text="Added in: v1.27" />

允许通过占位符文本定位输入元素。

**用法**

```js
await page
    .getByPlaceholder('name@example.com')
    .fill('playwright@microsoft.com');
```

**参数**

- <a id="frame-get-by-placeholder-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="frame-get-by-placeholder-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-get-by-placeholder-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写和整个字符串。默认为 false。

**返回值**

- `Locator`


### frame.getByRole() {#frame-get-by-role}

<Badge type="info" text="Added in: v1.27" />

允许通过元素的 [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles)、[ARIA attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) 和 [accessible name](https://w3c.github.io/accname/#dfn-accessible-name) 定位元素。

**用法**

```js
await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
await page.getByRole('checkbox', { name: 'Subscribe' }).check();
await page.getByRole('button', { name: /submit/i }).click();
```

**参数**

- <a id="frame-get-by-role-option-role"></a>`role` `string`

  必需的 aria role。
- <a id="frame-get-by-role-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-get-by-role-option-name"></a>`name` `string | RegExp` *(可选)*

    匹配 [accessible name](https://w3c.github.io/accname/#dfn-accessible-name) 的选项。
  - <a id="frame-get-by-role-option-exact"></a>`exact` `boolean` *(可选)*

    是否精确匹配 `name`。默认为 false。

**返回值**

- `Locator`


### frame.getByTestId() {#frame-get-by-test-id}

<Badge type="info" text="Added in: v1.27" />

通过测试 id 定位元素。

**用法**

```js
await page.getByTestId('directions').click();
```

**参数**

- <a id="frame-get-by-test-id-option-test-id"></a>`testId` `string | RegExp`

  用于定位元素的 id。

**返回值**

- `Locator`


### frame.getByText() {#frame-get-by-text}

<Badge type="info" text="Added in: v1.27" />

允许定位包含给定文本的元素。

**用法**

```js
// 匹配 <span>
page.getByText('world');

// 匹配第一个 <div>
page.getByText('Hello world');

// 匹配第二个 <div>
page.getByText('Hello', { exact: true });
```

**参数**

- <a id="frame-get-by-text-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="frame-get-by-text-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-get-by-text-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写和整个字符串。默认为 false。

**返回值**

- `Locator`


### frame.getByTitle() {#frame-get-by-title}

<Badge type="info" text="Added in: v1.27" />

允许通过元素的 title 属性定位元素。

**用法**

```js
await expect(page.getByTitle('Issues count')).toHaveText('25 issues');
```

**参数**

- <a id="frame-get-by-title-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="frame-get-by-title-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-get-by-title-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写和整个字符串。默认为 false。

**返回值**

- `Locator`


### frame.goto() {#frame-goto}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回主资源响应。在多次重定向的情况下，导航将使用最后一次重定向的响应解析。

该方法将在以下情况下抛出错误：
* 存在 SSL 错误（例如，自签名证书的情况）。
* 目标 URL 无效。
* 导航期间超过 `timeout`。
* 远程服务器不响应或不可达。
* 主资源加载失败。

**参数**

- <a id="frame-goto-option-url"></a>`url` `string`

  框架要导航到的 URL。URL 应包含协议，例如 `https://`。
- <a id="frame-goto-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-goto-option-timeout"></a>`timeout` `float` *(可选)*

    最大操作时间（毫秒）。默认为 `0` - 无超时。
  - <a id="frame-goto-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(可选)*

    何时认为操作成功，默认为 `load`。

**返回值**

- `Promise<null | Response>`


### frame.isDetached() {#frame-is-detached}

<Badge type="info" text="Added in: v1.8" />

如果框架已被分离，则返回 `true`，否则返回 `false`。

**返回值**

- `boolean`


### frame.locator() {#frame-locator}

<Badge type="info" text="Added in: v1.14" />

该方法返回一个元素定位器，可用于在此页面/框架上执行操作。

[了解更多关于定位器的内容](../locators.md)。

**参数**

- <a id="frame-locator-option-selector"></a>`selector` `string`

  解析 DOM 元素时使用的选择器。
- <a id="frame-locator-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-locator-option-has"></a>`has` `Locator` *(可选)*

    将方法的结果缩小到包含匹配此相对定位器的元素的那些。
  - <a id="frame-locator-option-has-text"></a>`hasText` `string | RegExp` *(可选)*

    匹配内部某处包含指定文本的元素。

**返回值**

- `Locator`


### frame.name() {#frame-name}

<Badge type="info" text="Added in: v1.8" />

返回标签中指定的框架的 name 属性。

如果名称为空，则返回 id 属性。

**返回值**

- `string`


### frame.page() {#frame-page}

<Badge type="info" text="Added in: v1.8" />

返回包含此框架的页面。

**返回值**

- `Page`


### frame.parentFrame() {#frame-parent-frame}

<Badge type="info" text="Added in: v1.8" />

父框架（如果有）。分离的框架和主框架返回 `null`。

**返回值**

- `null | Frame`


### frame.setContent() {#frame-set-content}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

此方法在内部调用 [document.write()](https://developer.mozilla.org/en-US/docs/Web/API/Document/write)，继承其所有特定特性和行为。

**参数**

- <a id="frame-set-content-option-html"></a>`html` `string`

  要分配给页面的 HTML 标记。
- <a id="frame-set-content-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-set-content-option-timeout"></a>`timeout` `float` *(可选)*

    最大操作时间（毫秒）。默认为 `0` - 无超时。
  - <a id="frame-set-content-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(可选)*

    何时认为操作成功，默认为 `load`。


### frame.title() {#frame-title}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回页面标题。

**返回值**

- `Promise<string>`


### frame.url() {#frame-url}

<Badge type="info" text="Added in: v1.8" />

返回框架的 url。

**返回值**

- `string`


### frame.waitForFunction() {#frame-wait-for-function}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

当 [`pageFunction`](/api/class-frame#frame-wait-for-function-option-expression) 返回真值时返回，返回该值。

**用法**

```js
const selector = '.foo';
await frame.waitForFunction(selector => !!document.querySelector(selector), selector);
```

**参数**

- <a id="frame-wait-for-function-option-expression"></a>`pageFunction` `function() | string`

  要在页面上下文中执行的函数。
- <a id="frame-wait-for-function-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-frame#frame-wait-for-function-option-expression) 的可选参数。
- <a id="frame-wait-for-function-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-wait-for-function-option-polling"></a>`polling` `float | "raf"` *(可选)*

    如果是 `'raf'`，则在 `requestAnimationFrame` 回调中不断执行。如果是数字，则作为执行间隔（毫秒）。默认为 `raf`。
  - <a id="frame-wait-for-function-option-timeout"></a>`timeout` `float` *(可选)*

    最大等待时间（毫秒）。默认为 `0` - 无超时。

**返回值**

- `Promise<JSHandle>`


### frame.waitForLoadState() {#frame-wait-for-load-state}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

等待达到所需的加载状态。

**用法**

```js
await frame.click('button'); // 点击触发导航
await frame.waitForLoadState(); // 默认等待 'load' 状态
```

**参数**

- <a id="frame-wait-for-load-state-option-state"></a>`state` `"load" | "domcontentloaded" | "networkidle"` *(可选)*

  要等待的可选加载状态，默认为 `load`。
- <a id="frame-wait-for-load-state-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-wait-for-load-state-option-timeout"></a>`timeout` `float` *(可选)*

    最大操作时间（毫秒）。默认为 `0` - 无超时。


### frame.waitForURL() {#frame-wait-for-url}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

等待框架导航到给定的 URL。

**用法**

```js
await frame.click('a.delayed-navigation'); // 点击链接将间接导致导航
await frame.waitForURL('**/target.html');
```

**参数**

- <a id="frame-wait-for-url-option-url"></a>`url` `string | RegExp | URLPattern | function(URL): boolean`

  等待导航时匹配的 glob 模式、正则表达式模式、URL 模式或接收 URL 的谓词。
- <a id="frame-wait-for-url-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-wait-for-url-option-timeout"></a>`timeout` `float` *(可选)*

    最大操作时间（毫秒）。默认为 `0` - 无超时。
  - <a id="frame-wait-for-url-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(可选)*

    何时认为操作成功，默认为 `load`。
