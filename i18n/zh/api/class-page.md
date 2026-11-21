---
title: Page
outline: 2
---

# Page

<Badge type="info" text="Added in: v1.8" />

Page 提供与 [Browser](/api/class-browser) 中单个标签页或 Chromium 中的[扩展后台页面](https://developer.chrome.com/extensions/background_pages)交互的方法。一个 [Browser](/api/class-browser) 实例可能有多个 [Page](/api/class-page) 实例。

此示例创建一个页面，导航到一个 URL，然后保存截图：

```js
const { webkit } = require('playwright');  // 或 'chromium' 或 'firefox'。

(async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
```

Page 类发出各种事件（如下所述），可以使用 Node 的原生 [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) 方法处理，如 `on`、`once` 或 `removeListener`。

此示例为单个页面 `load` 事件记录消息：

```js
page.once('load', () => console.log('页面已加载！'));
```

要取消订阅事件，请使用 `removeListener` 方法：

```js
function logRequest(interceptedRequest) {
  console.log('发出了请求：', interceptedRequest.url());
}
page.on('request', logRequest);
// 稍后...
page.removeListener('request', logRequest);
```

## 方法

### page.$() {#page-query-selector}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning 不推荐
使用基于定位器的 [`page.locator()`](/api/class-page#page-locator) 替代。阅读更多关于[定位器](../locators.md)。
:::

该方法在页面中查找与指定选择器匹配的元素。如果没有元素匹配选择器，返回值解析为 `null`。要等待页面上的元素，请使用 [`locator.waitFor()`](/api/class-locator#locator-wait-for)。

**参数**

- <a id="page-query-selector-option-selector"></a>`selector` `string`

  要查询的选择器。
- <a id="page-query-selector-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-query-selector-option-strict"></a>`strict` `boolean` *(可选)* <Badge type="info" text="Added in: v1.14" />

    当为 true 时，调用要求选择器解析为单个元素。如果给定的选择器解析为多个元素，调用将抛出异常。

**返回**

- `Promise<null | ElementHandle>`


### page.$$() {#page-query-selector-all}

<Badge type="info" text="Added in: v1.9" /> <Badge type="tip" text="async" />

::: warning 不推荐
使用基于定位器的 [`page.locator()`](/api/class-page#page-locator) 替代。阅读更多关于[定位器](../locators.md)。
:::

该方法在页面中查找与指定选择器匹配的所有元素。如果没有元素匹配选择器，返回值解析为 `[]`。

**参数**

- <a id="page-query-selector-all-option-selector"></a>`selector` `string`

  要查询的选择器。

**返回**

- `Promise<Array<ElementHandle>>`


### page.addInitScript() {#page-add-init-script}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

添加将在以下场景之一中执行的脚本：
* 每当页面被导航时。
* 每当子框架被附加或导航时。在这种情况下，脚本在新附加框架的上下文中执行。

脚本在文档创建后但在其任何脚本运行之前执行。这对于修改 JavaScript 环境很有用，例如为 `Math.random` 设置种子。

**用法**

在页面加载前覆盖 `Math.random` 的示例：

```js
// preload.js
Math.random = () => 42;
```

```js
// 在您的 playwright 脚本中，假设 preload.js 文件在同一目录
await page.addInitScript({ path: './preload.js' });
```

```js
await page.addInitScript(mock => {
  window.mock = mock;
}, mock);
```

::: info
通过 [`browserContext.addInitScript()`](/api/class-browsercontext#browser-context-add-init-script) 和 [`page.addInitScript()`](/api/class-page#page-add-init-script) 安装的多个脚本的执行顺序是未定义的。
:::

**参数**

- <a id="page-add-init-script-option-script"></a>`script` `function() | string | Object`

  要在页面中执行的脚本。

  - `path` `path` *(可选)*

    JavaScript 文件的路径。如果 `path` 是相对路径，则相对于当前工作目录解析。可选。
  - `content` `string` *(可选)*

    原始脚本内容。可选。
- <a id="page-add-init-script-option-arg"></a>`arg` `Serializable` *(可选)*

  传递给 [`script`](/api/class-page#page-add-init-script-option-script) 的可选参数（仅在传递函数时支持）。

**返回**

- `Promise<Disposable>`


### page.bringToFront() {#page-bring-to-front}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

将页面带到前台（激活标签）。


### page.click() {#page-click}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐
使用基于定位器的 [`locator.click()`](/api/class-locator#locator-click) 替代。阅读更多关于[定位器](../locators.md)。
:::

此方法通过执行以下步骤点击与 [`selector`](/api/class-page#page-click-option-selector) 匹配的元素：
1. 找到与 [`selector`](/api/class-page#page-click-option-selector) 匹配的元素。如果没有，等待直到匹配的元素附加到 DOM。
1. 等待匹配元素上的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-page#page-click-option-force) 选项。如果在检查期间元素被分离，整个操作将重试。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.mouse`](/api/class-page#page-mouse) 点击元素的中心或指定的 [`position`](/api/class-page#page-click-option-position)。
1. 等待已启动的导航成功或失败，除非设置了 [`noWaitAfter`](/api/class-page#page-click-option-no-wait-after) 选项。

当所有步骤组合在指定的 [`timeout`](/api/class-page#page-click-option-timeout) 内未完成时，此方法会抛出 [TimeoutError](/api/class-timeouterror)。传递零超时将禁用此功能。

**参数**

- <a id="page-click-option-selector"></a>`selector` `string`

  用于搜索元素的选择器。如果有多个元素满足选择器，将使用第一个。
- <a id="page-click-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-click-option-button"></a>`button` `"left" | "right" | "middle"` *(可选)*

    默认为 `left`。
  - <a id="page-click-option-click-count"></a>`clickCount` `int` *(可选)*

    默认为 1。参见 [UIEvent.detail]。
  - <a id="page-click-option-delay"></a>`delay` `float` *(可选)*

    `mousedown` 和 `mouseup` 之间等待的时间（毫秒）。默认为 0。
  - <a id="page-click-option-force"></a>`force` `boolean` *(可选)*

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="page-click-option-position"></a>`position` `Object` *(可选)*

    相对于元素内边距框左上角使用的点。如果未指定，使用元素的某个可见点。

    - `x` `float`
    - `y` `float`
  - <a id="page-click-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒）。默认为 `0` - 无超时。默认值可以通过配置中的 `actionTimeout` 选项更改，或使用 [`browserContext.setDefaultTimeout()`](/api/class-browsercontext#browser-context-set-default-timeout) 或 [`page.setDefaultTimeout()`](/api/class-page#page-set-default-timeout) 方法。


### page.close() {#page-close}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

如果 [`runBeforeUnload`](/api/class-page#page-close-option-run-before-unload) 为 `false`，不运行任何卸载处理程序并等待页面关闭。如果 [`runBeforeUnload`](/api/class-page#page-close-option-run-before-unload) 为 `true`，该方法将运行卸载处理程序，但**不会**等待页面关闭。

默认情况下，`page.close()` **不**运行 `beforeunload` 处理程序。

::: info
如果 [`runBeforeUnload`](/api/class-page#page-close-option-run-before-unload) 作为 true 传递，可能会出现 `beforeunload` 对话框，应通过 [`page.on('dialog')`](/api/class-page#page-event-dialog) 事件手动处理。
:::

**参数**

- <a id="page-close-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-close-option-reason"></a>`reason` `string` *(可选)* <Badge type="info" text="Added in: v1.40" />

    要报告给因页面关闭而中断的操作的原因。
  - <a id="page-close-option-run-before-unload"></a>`runBeforeUnload` `boolean` *(可选)*

    默认为 `false`。是否运行 [before unload](https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload) 页面处理程序。


### page.content() {#page-content}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

获取页面的完整 HTML 内容，包括 doctype。

**返回**

- `Promise<string>`


### page.context() {#page-context}

<Badge type="info" text="Added in: v1.8" />

获取页面所属的浏览器上下文。

**返回**

- `BrowserContext`


### page.emulateMedia() {#page-emulate-media}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

此方法通过 `media` 参数更改 `CSS media type`，和/或使用 `colorScheme` 参数更改 `'prefers-colors-scheme'` 媒体特性。

**用法**

```js
await page.evaluate(() => matchMedia('screen').matches);
// → true
await page.evaluate(() => matchMedia('print').matches);
// → false

await page.emulateMedia({ media: 'print' });
await page.evaluate(() => matchMedia('screen').matches);
// → false
await page.evaluate(() => matchMedia('print').matches);
// → true

await page.emulateMedia({});
await page.evaluate(() => matchMedia('screen').matches);
// → true
await page.evaluate(() => matchMedia('print').matches);
// → false
```

```js
await page.emulateMedia({ colorScheme: 'dark' });
await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches);
// → true
await page.evaluate(() => matchMedia('(prefers-color-scheme: light)').matches);
// → false
```

**参数**

- <a id="page-emulate-media-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-emulate-media-option-color-scheme"></a>`colorScheme` `null | "light" | "dark" | "no-preference"` *(可选)* <Badge type="info" text="Added in: v1.9" />

    模拟 [prefers-colors-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 媒体特性，支持的值为 `'light'` 和 `'dark'`。传递 `null` 禁用颜色方案模拟。`'no-preference'` 已弃用。
  - <a id="page-emulate-media-option-media"></a>`media` `null | "screen" | "print"` *(可选)* <Badge type="info" text="Added in: v1.9" />

    更改页面的 CSS 媒体类型。仅允许的值是 `'screen'`、`'print'` 和 `null`。传递 `null` 禁用 CSS 媒体模拟。
  - <a id="page-emulate-media-option-reduced-motion"></a>`reducedMotion` `null | "reduce" | "no-preference"` *(可选)* <Badge type="info" text="Added in: v1.12" />

    模拟 `'prefers-reduced-motion'` 媒体特性，支持的值为 `'reduce'`、`'no-preference'`。传递 `null` 禁用减少动画模拟。


### page.evaluate() {#page-evaluate}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回 [`pageFunction`](/api/class-page#page-evaluate-option-expression) 调用的值。

如果传递给 [`page.evaluate()`](/api/class-page#page-evaluate) 的函数返回一个 [Promise]，则 [`page.evaluate()`](/api/class-page#page-evaluate) 会等待 promise 解析并返回其值。

如果传递给 [`page.evaluate()`](/api/class-page#page-evaluate) 的函数返回一个非[可序列化]值，则 [`page.evaluate()`](/api/class-page#page-evaluate) 解析为 `undefined`。Playwright 还支持传输一些不能由 `JSON` 序列化的额外值：`-0`、`NaN`、`Infinity`、`-Infinity`。

**用法**

向 [`pageFunction`](/api/class-page#page-evaluate-option-expression) 传递参数：

```js
const result = await page.evaluate(([x, y]) => {
  return Promise.resolve(x * y);
}, [7, 8]);
console.log(result); // 输出 "56"
```

也可以传递字符串而不是函数：

```js
console.log(await page.evaluate('1 + 2')); // 输出 "3"
const x = 10;
console.log(await page.evaluate(`1 + ${x}`)); // 输出 "11"
```

[ElementHandle](/api/class-elementhandle) 实例可以作为参数传递给 [`page.evaluate()`](/api/class-page#page-evaluate)：

```js
const bodyHandle = await page.evaluateHandle('document.body');
const html = await page.evaluate<string, HTMLElement>(([body, suffix]) =>
  body.innerHTML + suffix, [bodyHandle, 'hello']
);
await bodyHandle.dispose();
```

**参数**

- <a id="page-evaluate-option-expression"></a>`pageFunction` `function() | string`

  要在页面上下文中执行的函数。
- <a id="page-evaluate-option-arg"></a>`arg` `EvaluationArgument` *(可选)*

  传递给 [`pageFunction`](/api/class-page#page-evaluate-option-expression) 的可选参数。

**返回**

- `Promise<Serializable>`


### page.fill() {#page-fill}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐
使用基于定位器的 [`locator.fill()`](/api/class-locator#locator-fill) 替代。阅读更多关于[定位器](../locators.md)。
:::

此方法等待与 [`selector`](/api/class-page#page-fill-option-selector) 匹配的元素，等待[可操作性](../actionability.md)检查，聚焦元素，填充它并在填充后触发 `input` 事件。请注意，您可以传递空字符串来清除输入字段。

如果目标元素不是 `<input>`、`<textarea>` 或 `[contenteditable]` 元素，此方法会抛出错误。但是，如果元素在具有关联[控件](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control)的 `<label>` 元素内，则将填充该控件。

要发送细粒度的键盘事件，请使用 [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially)。

**参数**

- <a id="page-fill-option-selector"></a>`selector` `string`

  用于搜索元素的选择器。如果有多个元素满足选择器，将使用第一个。
- <a id="page-fill-option-value"></a>`value` `string`

  为 `<input>`、`<textarea>` 或 `[contenteditable]` 元素填充的值。
- <a id="page-fill-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-fill-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒）。默认为 `0` - 无超时。


### page.focus() {#page-focus}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐
使用基于定位器的 [`locator.focus()`](/api/class-locator#locator-focus) 替代。阅读更多关于[定位器](../locators.md)。
:::

此方法使用 [`selector`](/api/class-page#page-focus-option-selector) 获取元素并聚焦它。如果没有元素匹配 [`selector`](/api/class-page#page-focus-option-selector)，该方法会等待直到匹配的元素出现在 DOM 中。

**参数**

- <a id="page-focus-option-selector"></a>`selector` `string`

  用于搜索元素的选择器。如果有多个元素满足选择器，将使用第一个。


### page.frame() {#page-frame}

<Badge type="info" text="Added in: v1.8" />

返回匹配指定条件的框架。必须指定 `name` 或 `url`。

**用法**

```js
const frame = page.frame('frame-name');
```

```js
const frame = page.frame({ url: /.*domain.*/ });
```

**参数**

- <a id="page-frame-option-frame-selector"></a>`frameSelector` `string | Object`

  框架名称或其他框架查找选项。

  - `name` `string` *(可选)*

    在 `iframe` 的 `name` 属性中指定的框架名称。可选。
  - `url` `string | RegExp | URLPattern | function(URL): boolean` *(可选)*

    接收框架 `url` 作为 [URL] 对象的 glob 模式、正则表达式模式、URL 模式或谓词。可选。

**返回**

- `null | Frame`


### page.frameLocator() {#page-frame-locator}

<Badge type="info" text="Added in: v1.17" />

使用 iframe 时，您可以创建一个框架定位器，该定位器将进入 iframe 并允许在该 iframe 中选择元素。

当不带 [`selector`](/api/class-page#page-frame-locator-option-selector) 调用时，搜索从页面上的任何框架开始 - 主框架或任何 iframe - 因此您不需要先定位每个 iframe。请注意，定位器的其余部分在单个框架内解析，就像任何其他定位器一样。如果它匹配多个框架内的元素，将抛出错误。

**用法**

以下代码片段在 id 为 `my-frame` 的 iframe 中定位带有文本 "Submit" 的元素，如 `<iframe id="my-frame">`：

```js
const locator = page.frameLocator('#my-iframe').getByText('Submit');
await locator.click();
```

以下代码片段定位一个按钮，无论是在主框架还是在其中一个 iframe 中：

```js
const locator = page.frameLocator().getByRole('button');
await locator.click();
```

**参数**

- <a id="page-frame-locator-option-selector"></a>`selector` `string` *(可选)*

  匹配框架元素的选择器。未指定时，定位器匹配页面上的任何框架。

**返回**

- `FrameLocator`


### page.frames() {#page-frames}

<Badge type="info" text="Added in: v1.8" />

附加到页面的所有框架的数组。

**返回**

- `Array<Frame>`


### page.getByAltText() {#page-get-by-alt-text}

<Badge type="info" text="Added in: v1.27" />

允许通过替代文本定位元素。

**用法**

例如，此方法将通过替代文本 "Playwright logo" 找到图像：

```html
<img alt='Playwright logo'>
```

```js
await page.getByAltText('Playwright logo').click();
```

**参数**

- <a id="page-get-by-alt-text-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="page-get-by-alt-text-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-get-by-alt-text-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写和整个字符串。默认为 false。通过正则表达式定位时忽略。请注意，精确匹配仍会修剪空白。

**返回**

- `Locator`


### page.getByLabel() {#page-get-by-label}

<Badge type="info" text="Added in: v1.27" />

允许通过关联的 `<label>` 或 `aria-labelledby` 元素的文本或通过 `aria-label` 属性定位输入元素。

**用法**

例如，此方法将在以下 DOM 中通过标签 "Username" 和 "Password" 找到输入：

```html
<input aria-label="Username">
<label for="password-input">Password:</label>
<input id="password-input">
```

```js
await page.getByLabel('Username').fill('john');
await page.getByLabel('Password').fill('secret');
```

**参数**

- <a id="page-get-by-label-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="page-get-by-label-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-get-by-label-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写和整个字符串。默认为 false。

**返回**

- `Locator`


### page.getByPlaceholder() {#page-get-by-placeholder}

<Badge type="info" text="Added in: v1.27" />

允许通过占位符文本定位输入元素。

**用法**

例如，考虑以下 DOM 结构：

```html
<input type="email" placeholder="name@example.com" />
```

您可以通过占位符文本定位输入后填充它：

```js
await page
    .getByPlaceholder('name@example.com')
    .fill('playwright@microsoft.com');
```

**参数**

- <a id="page-get-by-placeholder-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。

**返回**

- `Locator`


### page.getByRole() {#page-get-by-role}

<Badge type="info" text="Added in: v1.27" />

允许通过元素的 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles)、[ARIA 属性](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes)和[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name)定位元素。

**用法**

考虑以下 DOM 结构：

```html
<h3>Sign up</h3>
<label>
  <input type="checkbox" /> Subscribe
</label>
<br/>
<button>Submit</button>
```

您可以通过隐式角色定位每个元素：

```js
await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

await page.getByRole('checkbox', { name: 'Subscribe' }).check();

await page.getByRole('button', { name: /submit/i }).click();
```

**参数**

- <a id="page-get-by-role-option-role"></a>`role` `string`

  必需的 aria 角色。
- <a id="page-get-by-role-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-get-by-role-option-name"></a>`name` `string | RegExp` *(可选)*

    用于匹配[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name)的选项。默认情况下，匹配不区分大小写并搜索子字符串，使用 [`exact`](/api/class-page#page-get-by-role-option-exact) 控制此行为。
  - <a id="page-get-by-role-option-exact"></a>`exact` `boolean` *(可选)* <Badge type="info" text="Added in: v1.28" />

    [`name`](/api/class-page#page-get-by-role-option-name) 是否精确匹配：区分大小写和整个字符串。默认为 false。

**返回**

- `Locator`


### page.getByTestId() {#page-get-by-test-id}

<Badge type="info" text="Added in: v1.27" />

通过测试 id 定位元素。

**用法**

考虑以下 DOM 结构：

```html
<button data-testid="directions">Itinéraire</button>
```

您可以通过测试 id 定位元素：

```js
await page.getByTestId('directions').click();
```

**参数**

- <a id="page-get-by-test-id-option-test-id"></a>`testId` `string | RegExp`

  用于定位元素的 id。

**返回**

- `Locator`


### page.getByText() {#page-get-by-text}

<Badge type="info" text="Added in: v1.27" />

允许定位包含给定文本的元素。

**用法**

考虑以下 DOM 结构：

```html
<div>Hello <span>world</span></div>
<div>Hello</div>
```

您可以通过文本子字符串、精确字符串或正则表达式定位：

```js
// 匹配 <span>
page.getByText('world');

// 匹配第一个 <div>
page.getByText('Hello world');

// 匹配第二个 <div>
page.getByText('Hello', { exact: true });

// 匹配两个 <div>
page.getByText(/Hello/);

// 匹配第二个 <div>
page.getByText(/^hello$/i);
```

**参数**

- <a id="page-get-by-text-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="page-get-by-text-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-get-by-text-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写和整个字符串。默认为 false。

**返回**

- `Locator`


### page.getByTitle() {#page-get-by-title}

<Badge type="info" text="Added in: v1.27" />

允许通过 title 属性定位元素。

**用法**

考虑以下 DOM 结构：

```html
<span title='Issues count'>25 issues</span>
```

您可以通过标题文本定位后检查问题计数：

```js
await expect(page.getByTitle('Issues count')).toHaveText('25 issues');
```

**参数**

- <a id="page-get-by-title-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。

**返回**

- `Locator`


### page.goto() {#page-goto}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回主资源响应。在多次重定向的情况下，导航将解析为最后一次重定向的响应。

如果出现以下情况，该方法将抛出错误：
* 存在 SSL 错误（例如，在自签名证书的情况下）。
* 目标 URL 无效。
* 导航期间超过 [`timeout`](/api/class-page#page-goto-option-timeout)。
* 远程服务器没有响应或无法访问。
* 主资源加载失败。

当远程服务器返回任何有效的 HTTP 状态码时，该方法不会抛出错误，包括 404 "Not Found" 和 500 "Internal Server Error"。此类响应的状态码可以通过调用 [`response.status()`](/api/class-response#response-status) 检索。

**用法**

```js
await page.goto('https://example.com');
```

**参数**

- <a id="page-goto-option-url"></a>`url` `string`

  要导航到的 URL。URL 应包含方案，例如 `https://`。
- <a id="page-goto-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-goto-option-timeout"></a>`timeout` `float` *(可选)*

    最大操作时间（毫秒）。默认为 `0` - 无超时。
  - <a id="page-goto-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(可选)*

    何时认为操作成功，默认为 `load`。事件可以是：
    * `'domcontentloaded'` - 当 `DOMContentLoaded` 事件触发时认为操作完成。
    * `'load'` - 当 `load` 事件触发时认为操作完成。
    * `'networkidle'` - **不推荐** 当至少 `500` 毫秒没有网络连接时认为操作完成。不要将此方法用于测试，而是依靠 web 断言来评估就绪状态。
    * `'commit'` - 当收到网络响应并开始加载文档时认为操作完成。

**返回**

- `Promise<null | Response>`


### page.locator() {#page-locator}

<Badge type="info" text="Added in: v1.14" />

该方法返回一个元素定位器，可用于在此页面/框架上执行操作。在执行操作之前，定位器会解析为匹配的元素，因此同一定位器上的一系列操作实际上可以在不同的 DOM 元素上执行。如果在操作期间 DOM 结构发生变化，那会没问题。

[了解更多关于定位器](../locators.md)。

**用法**

```js
const locator = page.locator('text=Submit');
await locator.click();
```

**参数**

- <a id="page-locator-option-selector"></a>`selector` `string`

  解析 DOM 元素时使用的选择器。
- <a id="page-locator-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-locator-option-has"></a>`has` `Locator` *(可选)*

    将方法的结果缩小到包含匹配此相对定位器的元素的那些。
  - <a id="page-locator-option-has-not"></a>`hasNot` `Locator` *(可选)* <Badge type="info" text="Added in: v1.33" />

    匹配不包含匹配内部定位器的元素的元素。
  - <a id="page-locator-option-has-not-text"></a>`hasNotText` `string | RegExp` *(可选)* <Badge type="info" text="Added in: v1.33" />

    匹配内部某处不包含指定文本的元素。
  - <a id="page-locator-option-has-text"></a>`hasText` `string | RegExp` *(可选)*

    匹配内部某处包含指定文本的元素。

**返回**

- `Locator`


### page.reload() {#page-reload}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

此方法重新加载当前页面，方式与用户触发浏览器刷新相同。返回主资源响应。在多次重定向的情况下，导航将解析为最后一次重定向的响应。

**参数**

- <a id="page-reload-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-reload-option-timeout"></a>`timeout` `float` *(可选)*

    最大操作时间（毫秒）。默认为 `0` - 无超时。
  - <a id="page-reload-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(可选)*

    何时认为操作成功，默认为 `load`。

**返回**

- `Promise<null | Response>`


### page.screenshot() {#page-screenshot}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回带有捕获截图的缓冲区。

**参数**

- <a id="page-screenshot-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-screenshot-option-full-page"></a>`fullPage` `boolean` *(可选)*

    当为 true 时，截取完整可滚动页面的截图，而不是当前可见的视口。默认为 `false`。
  - <a id="page-screenshot-option-path"></a>`path` `path` *(可选)*

    保存图像的文件路径。截图类型将从文件扩展名推断。如果 [`path`](/api/class-page#page-screenshot-option-path) 是相对路径，则相对于当前工作目录解析。如果未提供路径，图像将不会保存到磁盘。
  - <a id="page-screenshot-option-quality"></a>`quality` `int` *(可选)*

    图像质量，介于 0-100 之间。不适用于 `png` 图像。
  - <a id="page-screenshot-option-type"></a>`type` `"png" | "jpeg" | "webp"` *(可选)*

    指定截图类型，默认为 `png`。

**返回**

- `Promise<Buffer>`


### page.setContent() {#page-set-content}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

此方法在内部调用 [document.write()](https://developer.mozilla.org/en-US/docs/Web/API/Document/write)，继承其所有特定特征和行为。

**参数**

- <a id="page-set-content-option-html"></a>`html` `string`

  要分配给页面的 HTML 标记。
- <a id="page-set-content-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-set-content-option-timeout"></a>`timeout` `float` *(可选)*

    最大操作时间（毫秒）。默认为 `0` - 无超时。
  - <a id="page-set-content-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(可选)*

    何时认为操作成功，默认为 `load`。


### page.setDefaultNavigationTimeout() {#page-set-default-navigation-timeout}

<Badge type="info" text="Added in: v1.8" />

此设置将更改以下方法和相关快捷方式的默认最大导航时间：
* [`page.goBack()`](/api/class-page#page-go-back)
* [`page.goForward()`](/api/class-page#page-go-forward)
* [`page.goto()`](/api/class-page#page-goto)
* [`page.reload()`](/api/class-page#page-reload)
* [`page.setContent()`](/api/class-page#page-set-content)
* [`page.waitForNavigation()`](/api/class-page#page-wait-for-navigation)
* [`page.waitForURL()`](/api/class-page#page-wait-for-url)

**参数**

- <a id="page-set-default-navigation-timeout-option-timeout"></a>`timeout` `float`

  最大导航时间（毫秒）


### page.setDefaultTimeout() {#page-set-default-timeout}

<Badge type="info" text="Added in: v1.8" />

此设置将更改所有接受 [`timeout`](/api/class-page#page-set-default-timeout-option-timeout) 选项的方法的默认最大时间。

**参数**

- <a id="page-set-default-timeout-option-timeout"></a>`timeout` `float`

  最大时间（毫秒）。传递 `0` 禁用超时。


### page.title() {#page-title}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

返回页面标题。

**返回**

- `Promise<string>`


### page.url() {#page-url}

<Badge type="info" text="Added in: v1.8" />

**返回**

- `string`


### page.waitForLoadState() {#page-wait-for-load-state}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

当达到所需的加载状态时返回。

当页面达到所需的加载状态时（默认为 `load`），此方法解析。导航必须在调用此方法时已提交。如果当前文档已达到所需状态，立即解析。

**用法**

```js
await page.getByRole('button').click(); // 点击触发导航。
await page.waitForLoadState(); // 等待 'load' 状态。
```

**参数**

- <a id="page-wait-for-load-state-option-state"></a>`state` `"load" | "domcontentloaded" | "networkidle"` *(可选)*

  要等待的可选加载状态，默认为 `load`。


### page.waitForSelector() {#page-wait-for-selector}

<Badge type="info" text="Added in: v1.8" /> <Badge type="tip" text="async" />

::: warning 不推荐
使用断言可见性的 web 断言或基于定位器的 [`locator.waitFor()`](/api/class-locator#locator-wait-for) 替代。
:::

当选择器指定的元素满足 [`state`](/api/class-page#page-wait-for-selector-option-state) 选项时返回。如果等待 `hidden` 或 `detached`，返回 `null`。

**参数**

- <a id="page-wait-for-selector-option-selector"></a>`selector` `string`

  要查询的选择器。
- <a id="page-wait-for-selector-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-wait-for-selector-option-state"></a>`state` `"attached" | "detached" | "visible" | "hidden"` *(可选)*

    默认为 `'visible'`。可以是：
    * `'attached'` - 等待元素出现在 DOM 中。
    * `'detached'` - 等待元素不在 DOM 中。
    * `'visible'` - 等待元素具有非空边界框且没有 `visibility:hidden`。
    * `'hidden'` - 等待元素与 DOM 分离，或具有空边界框或 `visibility:hidden`。
  - <a id="page-wait-for-selector-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒）。默认为 `0` - 无超时。

**返回**

- `Promise<null | ElementHandle>`


### page.waitForURL() {#page-wait-for-url}

<Badge type="info" text="Added in: v1.11" /> <Badge type="tip" text="async" />

等待主框架导航到给定的 URL。

**用法**

```js
await page.click('a.delayed-navigation'); // 点击链接间接导致导航
await page.waitForURL('**/target.html');
```

**参数**

- <a id="page-wait-for-url-option-url"></a>`url` `string | RegExp | function(URL): boolean`

  等待时匹配的 glob 模式、正则表达式模式或接收 [URL] 的谓词。
- <a id="page-wait-for-url-option-options"></a>`options` `Object` *(可选)*

  - <a id="page-wait-for-url-option-timeout"></a>`timeout` `float` *(可选)*

    最大操作时间（毫秒）。默认为 `0` - 无超时。
  - <a id="page-wait-for-url-option-wait-until"></a>`waitUntil` `"load" | "domcontentloaded" | "networkidle" | "commit"` *(可选)*

    何时认为操作成功，默认为 `load`。


## 属性

### page.keyboard {#page-keyboard}

<Badge type="info" text="Added in: v1.8" />

**类型**

- `Keyboard`


### page.mouse {#page-mouse}

<Badge type="info" text="Added in: v1.8" />

**类型**

- `Mouse`


### page.touchscreen {#page-touchscreen}

<Badge type="info" text="Added in: v1.8" />

**类型**

- `Touchscreen`


## 事件

### page.on('close') {#page-event-close}

<Badge type="info" text="Added in: v1.8" />

当页面关闭时发出。

**事件数据**

- `Page`


### page.on('console') {#page-event-console}

<Badge type="info" text="Added in: v1.8" />

当页面内的 JavaScript 调用控制台 API 方法之一（例如 `console.log` 或 `console.dir`）时发出。

传递给 `console.log` 的参数在 [ConsoleMessage](/api/class-consolemessage) 事件处理程序参数上可用。

**用法**

```js
page.on('console', async msg => {
  const values = [];
  for (const arg of msg.args())
    values.push(await arg.jsonValue());
  console.log(...values);
});
await page.evaluate(() => console.log('hello', 5, { foo: 'bar' }));
```

**事件数据**

- `ConsoleMessage`


### page.on('dialog') {#page-event-dialog}

<Badge type="info" text="Added in: v1.8" />

当出现 JavaScript 对话框（如 `alert`、`prompt`、`confirm` 或 `beforeunload`）时发出。监听器**必须**要么 [`dialog.accept()`](/api/class-dialog#dialog-accept) 要么 [`dialog.dismiss()`](/api/class-dialog#dialog-dismiss) 对话框 - 否则页面将[冻结](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#never_blocking)等待对话框，并且像点击这样的操作将永远不会完成。

**事件数据**

- `Dialog`


### page.on('load') {#page-event-load}

<Badge type="info" text="Added in: v1.8" />

当 JavaScript [`load`](https://developer.mozilla.org/en-US/docs/Web/Events/load) 事件被调度时发出。

**事件数据**

- `Page`


### page.on('request') {#page-event-request}

<Badge type="info" text="Added in: v1.8" />

当页面发出请求时发出。[request] 对象是只读的。要拦截和修改请求，请参阅 [`page.route()`](/api/class-page#page-route) 或 [`browserContext.route()`](/api/class-browsercontext#browser-context-route)。

**事件数据**

- `Request`


### page.on('response') {#page-event-response}

<Badge type="info" text="Added in: v1.8" />

当收到请求的 [response] 状态和头时发出。对于成功的响应，事件顺序是 `request`、`response` 和 `requestfinished`。

**事件数据**

- `Response`
