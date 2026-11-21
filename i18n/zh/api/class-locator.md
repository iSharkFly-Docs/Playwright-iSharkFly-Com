---
title: Locator
outline: 2
---

# Locator

<Badge type="info" text="Added in: v1.14" />

Locator 是 Playwright 自动等待和重试能力的核心部分。简而言之，定位器表示一种在任何时刻在页面上找到元素的方法。可以使用 [`page.locator()`](/api/class-page#page-locator) 方法创建定位器。

[了解更多关于定位器](../locators.md)。

## 方法

### locator.all() {#locator-all}

<Badge type="info" text="Added in: v1.29" /> <Badge type="tip" text="async" />

当定位器指向元素列表时，返回指向各自元素的定位器数组。

::: info
[`locator.all()`](/api/class-locator#locator-all) 不会等待元素匹配定位器，而是立即返回页面中存在的任何内容。

当元素列表动态变化时，[`locator.all()`](/api/class-locator#locator-all) 将产生不可预测和不稳定的结果。

当元素列表是稳定的但动态加载时，请在调用 [`locator.all()`](/api/class-locator#locator-all) 之前等待完整列表加载完成。
:::

**用法**

```js
for (const li of await page.getByRole('listitem').all())
  await li.click();
```

**返回**

- `Promise<Array<Locator>>`


### locator.allInnerTexts() {#locator-all-inner-texts}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回所有匹配节点的 `node.innerText` 值数组。

:::warning[断言文本]
如果需要断言页面上的文本，建议使用带 [`useInnerText`](/api/class-locatorassertions#locator-assertions-to-have-text-option-use-inner-text) 选项的 [`locatorAssertions.toHaveText()`](/api/class-locatorassertions#locator-assertions-to-have-text) 以避免不稳定。更多详情请参阅[断言指南](../test-assertions.md)。
:::

**用法**

```js
const texts = await page.getByRole('link').allInnerTexts();
```

**返回**

- `Promise<Array<string>>`


### locator.allTextContents() {#locator-all-text-contents}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回所有匹配节点的 `node.textContent` 值数组。

:::warning[断言文本]
如果需要断言页面上的文本，建议使用 [`locatorAssertions.toHaveText()`](/api/class-locatorassertions#locator-assertions-to-have-text) 以避免不稳定。更多详情请参阅[断言指南](../test-assertions.md)。
:::

**用法**

```js
const texts = await page.getByRole('link').allTextContents();
```

**返回**

- `Promise<Array<string>>`


### locator.and() {#locator-and}

<Badge type="info" text="Added in: v1.34" />

创建一个同时匹配此定位器和参数定位器的定位器。

**用法**

以下示例找到一个具有特定标题的按钮。

```js
const button = page.getByRole('button').and(page.getByTitle('Subscribe'));
```

**参数**

- <a id="locator-and-option-locator"></a>`locator` `Locator`

  要匹配的附加定位器。

**返回**

- `Locator`


### locator.blur() {#locator-blur}

<Badge type="info" text="Added in: v1.28" /> <Badge type="tip" text="async" />

在元素上调用 [blur](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/blur)。

**参数**

- <a id="locator-blur-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-blur-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒）。默认为 `0` - 无超时。


### locator.boundingBox() {#locator-bounding-box}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

此方法返回匹配定位器的元素的边界框，如果元素不可见则返回 `null`。边界框相对于主框架视口计算 - 通常与浏览器窗口相同。

**详情**

滚动会影响返回的边界框，类似于 [Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)。这意味着 `x` 和/或 `y` 可能是负数。

**用法**

```js
const box = await page.getByRole('button').boundingBox();
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
```

**返回**

- `Promise<null | Object>`


### locator.check() {#locator-check}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

确保复选框或单选元素被选中。

**详情**

执行以下步骤：
1. 确保元素是复选框或单选输入。如果不是，此方法抛出异常。如果元素已经被选中，此方法立即返回。
1. 等待元素的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-locator#locator-check-option-force) 选项。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.mouse`](/api/class-page#page-mouse) 点击元素中心。
1. 确保元素现在被选中。如果不是，此方法抛出异常。

**用法**

```js
await page.getByRole('checkbox').check();
```

**参数**

- <a id="locator-check-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-check-option-force"></a>`force` `boolean` *(可选)*

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="locator-check-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒）。默认为 `0` - 无超时。


### locator.clear() {#locator-clear}

<Badge type="info" text="Added in: v1.28" /> <Badge type="tip" text="async" />

清除输入字段。

**详情**

此方法等待[可操作性](../actionability.md)检查，聚焦元素，清除它并在清除后触发 `input` 事件。

如果目标元素不是 `<input>`、`<textarea>` 或 `[contenteditable]` 元素，此方法会抛出错误。但是，如果元素在具有关联[控件](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control)的 `<label>` 元素内，则将清除该控件。

**用法**

```js
await page.getByRole('textbox').clear();
```


### locator.click() {#locator-click}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

点击元素。

**详情**

此方法通过执行以下步骤点击元素：
1. 等待元素的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-locator#locator-click-option-force) 选项。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.mouse`](/api/class-page#page-mouse) 点击元素中心或指定的 [`position`](/api/class-locator#locator-click-option-position)。
1. 等待已启动的导航成功或失败，除非设置了 [`noWaitAfter`](/api/class-locator#locator-click-option-no-wait-after) 选项。

**用法**

点击按钮：

```js
await page.getByRole('button').click();
```

在画布上的特定位置进行 Shift+右键点击：

```js
await page.locator('canvas').click({
  button: 'right',
  modifiers: ['Shift'],
  position: { x: 23, y: 32 },
});
```

**参数**

- <a id="locator-click-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-click-option-button"></a>`button` `"left" | "right" | "middle"` *(可选)*

    默认为 `left`。
  - <a id="locator-click-option-click-count"></a>`clickCount` `int` *(可选)*

    默认为 1。参见 [UIEvent.detail]。
  - <a id="locator-click-option-delay"></a>`delay` `float` *(可选)*

    `mousedown` 和 `mouseup` 之间等待的时间（毫秒）。默认为 0。
  - <a id="locator-click-option-force"></a>`force` `boolean` *(可选)*

    是否绕过[可操作性](../actionability.md)检查。默认为 `false`。
  - <a id="locator-click-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒）。默认为 `0` - 无超时。


### locator.count() {#locator-count}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回匹配定位器的元素数量。

:::warning[断言数量]
如果需要断言页面上的元素数量，建议使用 [`locatorAssertions.toHaveCount()`](/api/class-locatorassertions#locator-assertions-to-have-count) 以避免不稳定。更多详情请参阅[断言指南](../test-assertions.md)。
:::

**用法**

```js
const count = await page.getByRole('listitem').count();
```

**返回**

- `Promise<int>`


### locator.dblclick() {#locator-dblclick}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

双击元素。

**详情**

此方法通过执行以下步骤双击元素：
1. 等待元素的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-locator#locator-dblclick-option-force) 选项。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.mouse`](/api/class-page#page-mouse) 双击元素中心或指定的 [`position`](/api/class-locator#locator-dblclick-option-position)。

::: info
`element.dblclick()` 触发两个 `click` 事件和一个 `dblclick` 事件。
:::


### locator.fill() {#locator-fill}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

设置输入字段的值。

**用法**

```js
await page.getByRole('textbox').fill('example value');
```

**详情**

此方法等待[可操作性](../actionability.md)检查，聚焦元素，填充它并在填充后触发 `input` 事件。请注意，您可以传递空字符串来清除输入字段。

如果目标元素不是 `<input>`、`<textarea>` 或 `[contenteditable]` 元素，此方法会抛出错误。但是，如果元素在具有关联[控件](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control)的 `<label>` 元素内，则将填充该控件。

要发送细粒度的键盘事件，请使用 [`locator.pressSequentially()`](/api/class-locator#locator-press-sequentially)。

**参数**

- <a id="locator-fill-option-value"></a>`value` `string`

  为 `<input>`、`<textarea>` 或 `[contenteditable]` 元素设置的值。
- <a id="locator-fill-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-fill-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒）。默认为 `0` - 无超时。


### locator.filter() {#locator-filter}

<Badge type="info" text="Added in: v1.22" />

此方法根据选项缩小现有定位器，例如按文本过滤。可以链式调用多次过滤。

**用法**

```js
const rowLocator = page.locator('tr');
// ...
await rowLocator
    .filter({ hasText: 'text in column 1' })
    .filter({ has: page.getByRole('button', { name: 'column 2 button' }) })
    .screenshot();
```

**参数**

- <a id="locator-filter-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-filter-option-has"></a>`has` `Locator` *(可选)*

    将方法的结果缩小到包含匹配此相对定位器的元素的那些。
  - <a id="locator-filter-option-has-not"></a>`hasNot` `Locator` *(可选)* <Badge type="info" text="Added in: v1.33" />

    匹配不包含匹配内部定位器的元素的元素。
  - <a id="locator-filter-option-has-not-text"></a>`hasNotText` `string | RegExp` *(可选)* <Badge type="info" text="Added in: v1.33" />

    匹配内部某处不包含指定文本的元素。
  - <a id="locator-filter-option-has-text"></a>`hasText` `string | RegExp` *(可选)*

    匹配内部某处包含指定文本的元素。

**返回**

- `Locator`


### locator.first() {#locator-first}

<Badge type="info" text="Added in: v1.14" />

返回指向第一个匹配元素的定位器。

**返回**

- `Locator`


### locator.focus() {#locator-focus}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

在匹配元素上调用 [focus](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)。


### locator.getAttribute() {#locator-get-attribute}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回匹配元素的属性值。

:::warning[断言属性]
如果需要断言元素的属性，建议使用 [`locatorAssertions.toHaveAttribute()`](/api/class-locatorassertions#locator-assertions-to-have-attribute) 以避免不稳定。更多详情请参阅[断言指南](../test-assertions.md)。
:::

**参数**

- <a id="locator-get-attribute-option-name"></a>`name` `string`

  要获取值的属性名称。

**返回**

- `Promise<null | string>`


### locator.getByAltText() {#locator-get-by-alt-text}

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

- <a id="locator-get-by-alt-text-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。

**返回**

- `Locator`


### locator.getByLabel() {#locator-get-by-label}

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

- <a id="locator-get-by-label-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。

**返回**

- `Locator`


### locator.getByPlaceholder() {#locator-get-by-placeholder}

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

**返回**

- `Locator`


### locator.getByRole() {#locator-get-by-role}

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

- <a id="locator-get-by-role-option-role"></a>`role` `string`

  必需的 aria 角色。
- <a id="locator-get-by-role-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-get-by-role-option-name"></a>`name` `string | RegExp` *(可选)*

    用于匹配[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name)的选项。
  - <a id="locator-get-by-role-option-exact"></a>`exact` `boolean` *(可选)* <Badge type="info" text="Added in: v1.28" />

    [`name`](/api/class-locator#locator-get-by-role-option-name) 是否精确匹配：区分大小写和整个字符串。默认为 false。

**返回**

- `Locator`


### locator.getByTestId() {#locator-get-by-test-id}

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

- <a id="locator-get-by-test-id-option-test-id"></a>`testId` `string | RegExp`

  用于定位元素的 id。

**返回**

- `Locator`


### locator.getByText() {#locator-get-by-text}

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

- <a id="locator-get-by-text-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="locator-get-by-text-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-get-by-text-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写和整个字符串。默认为 false。

**返回**

- `Locator`


### locator.getByTitle() {#locator-get-by-title}

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

**返回**

- `Locator`


### locator.hover() {#locator-hover}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

悬停在匹配元素上。

**用法**

```js
await page.getByRole('link').hover();
```

**详情**

此方法通过执行以下步骤悬停在元素上：
1. 等待元素的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-locator#locator-hover-option-force) 选项。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.mouse`](/api/class-page#page-mouse) 悬停在元素中心或指定的 [`position`](/api/class-locator#locator-hover-option-position)。


### locator.innerHTML() {#locator-inner-html}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回 [`element.innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)。

**返回**

- `Promise<string>`


### locator.innerText() {#locator-inner-text}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回 [`element.innerText`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText)。

:::warning[断言文本]
如果需要断言页面上的文本，建议使用带 [`useInnerText`](/api/class-locatorassertions#locator-assertions-to-have-text-option-use-inner-text) 选项的 [`locatorAssertions.toHaveText()`](/api/class-locatorassertions#locator-assertions-to-have-text) 以避免不稳定。更多详情请参阅[断言指南](../test-assertions.md)。
:::

**返回**

- `Promise<string>`


### locator.inputValue() {#locator-input-value}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回匹配的 `<input>` 或 `<textarea>` 或 `<select>` 元素的值。

:::warning[断言值]
如果需要断言输入值，建议使用 [`locatorAssertions.toHaveValue()`](/api/class-locatorassertions#locator-assertions-to-have-value) 以避免不稳定。更多详情请参阅[断言指南](../test-assertions.md)。
:::

**用法**

```js
const value = await page.getByRole('textbox').inputValue();
```

**返回**

- `Promise<string>`


### locator.isChecked() {#locator-is-checked}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回元素是否被选中。如果元素不是复选框或单选输入，则抛出异常。

**用法**

```js
const checked = await page.getByRole('checkbox').isChecked();
```

**返回**

- `Promise<boolean>`


### locator.isDisabled() {#locator-is-disabled}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回元素是否被禁用，与[已启用](../actionability.md#enabled)相反。

**用法**

```js
const disabled = await page.getByRole('button').isDisabled();
```

**返回**

- `Promise<boolean>`


### locator.isEditable() {#locator-is-editable}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回元素是否[可编辑](../actionability.md#editable)。

**用法**

```js
const editable = await page.getByRole('textbox').isEditable();
```

**返回**

- `Promise<boolean>`


### locator.isEnabled() {#locator-is-enabled}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回元素是否[已启用](../actionability.md#enabled)。

**用法**

```js
const enabled = await page.getByRole('button').isEnabled();
```

**返回**

- `Promise<boolean>`


### locator.isHidden() {#locator-is-hidden}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回元素是否隐藏，与[可见](../actionability.md#visible)相反。

**用法**

```js
const hidden = await page.getByRole('button').isHidden();
```

**返回**

- `Promise<boolean>`


### locator.isVisible() {#locator-is-visible}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回元素是否[可见](../actionability.md#visible)。

**用法**

```js
const visible = await page.getByRole('button').isVisible();
```

**返回**

- `Promise<boolean>`


### locator.last() {#locator-last}

<Badge type="info" text="Added in: v1.14" />

返回指向最后一个匹配元素的定位器。

**用法**

```js
const banana = await page.getByRole('listitem').last();
```

**返回**

- `Locator`


### locator.locator() {#locator-locator}

<Badge type="info" text="Added in: v1.14" />

该方法在定位器的子树中查找与指定选择器匹配的元素。它还接受过滤选项，类似于 [`locator.filter()`](/api/class-locator#locator-filter) 方法。

[了解更多关于定位器](../locators.md)。

**参数**

- <a id="locator-locator-option-selector-or-locator"></a>`selectorOrLocator` `string | Locator`

  解析 DOM 元素时使用的选择器或定位器。

**返回**

- `Locator`


### locator.nth() {#locator-nth}

<Badge type="info" text="Added in: v1.14" />

返回指向第 n 个匹配元素的定位器。它是从零开始的，`nth(0)` 选择第一个元素。

**用法**

```js
const banana = await page.getByRole('listitem').nth(2);
```

**参数**

- <a id="locator-nth-option-index"></a>`index` `int`

**返回**

- `Locator`


### locator.or() {#locator-or}

<Badge type="info" text="Added in: v1.33" />

创建一个匹配一个或两个定位器的定位器。

**用法**

考虑这样一个场景：您想点击 "New email" 按钮，但有时会显示安全设置对话框。在这种情况下，您可以等待 "New email" 按钮或对话框并相应地采取行动。

```js
const newEmail = page.getByRole('button', { name: 'New' });
const dialog = page.getByText('Confirm security settings');
await expect(newEmail.or(dialog).first()).toBeVisible();
if (await dialog.isVisible())
  await page.getByRole('button', { name: 'Dismiss' }).click();
await newEmail.click();
```

**参数**

- <a id="locator-or-option-locator"></a>`locator` `Locator`

  要匹配的替代定位器。

**返回**

- `Locator`


### locator.page() {#locator-page}

<Badge type="info" text="Added in: v1.19" />

此定位器所属的页面。

**返回**

- `Page`


### locator.press() {#locator-press}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

聚焦匹配元素并按下组合键。

**用法**

```js
await page.getByRole('textbox').press('Backspace');
```

**详情**

聚焦元素，然后使用 [`keyboard.down()`](/api/class-keyboard#keyboard-down) 和 [`keyboard.up()`](/api/class-keyboard#keyboard-up)。

**参数**

- <a id="locator-press-option-key"></a>`key` `string`

  要按下的键名或要生成的字符，如 `ArrowLeft` 或 `a`。


### locator.screenshot() {#locator-screenshot}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

截取匹配定位器的元素的截图。

**用法**

```js
await page.getByRole('link').screenshot();
```

禁用动画并将截图保存到文件：

```js
await page.getByRole('link').screenshot({ animations: 'disabled', path: 'link.png' });
```

**详情**

此方法捕获页面的截图，剪裁到匹配定位器的特定元素的大小和位置。如果元素被其他元素覆盖，它将不会在截图中实际可见。如果元素是可滚动容器，则只有当前滚动的内容在截图中可见。

**返回**

- `Promise<Buffer>`


### locator.selectOption() {#locator-select-option}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

在 `<select>` 中选择一个或多个选项。

**详情**

此方法等待[可操作性](../actionability.md)检查，等待所有指定的选项出现在 `<select>` 元素中并选择这些选项。

**用法**

```html
<select multiple>
  <option value="red">Red</option>
  <option value="green">Green</option>
  <option value="blue">Blue</option>
</select>
```

```js
// 匹配值或标签的单选
element.selectOption('blue');

// 匹配标签的单选
element.selectOption({ label: 'Blue' });

// 多选红、绿、蓝选项
element.selectOption(['red', 'green', 'blue']);
```

**返回**

- `Promise<Array<string>>`


### locator.setChecked() {#locator-set-checked}

<Badge type="info" text="Added in: v1.15" /> <Badge type="tip" text="async" />

设置复选框或单选元素的状态。

**用法**

```js
await page.getByRole('checkbox').setChecked(true);
```

**参数**

- <a id="locator-set-checked-option-checked"></a>`checked` `boolean`

  是否选中或取消选中复选框。


### locator.setInputFiles() {#locator-set-input-files}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

将文件或多个文件上传到 `<input type=file>`。

**用法**

```js
// 选择一个文件
await page.getByLabel('Upload file').setInputFiles(path.join(__dirname, 'myfile.pdf'));

// 选择多个文件
await page.getByLabel('Upload files').setInputFiles([
  path.join(__dirname, 'file1.txt'),
  path.join(__dirname, 'file2.txt'),
]);

// 删除所有选定的文件
await page.getByLabel('Upload file').setInputFiles([]);

// 从内存上传缓冲区
await page.getByLabel('Upload file').setInputFiles({
  name: 'file.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('this is test')
});
```


### locator.tap() {#locator-tap}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

在匹配定位器的元素上执行点击手势。

**详情**

此方法通过执行以下步骤点击元素：
1. 等待元素的[可操作性](../actionability.md)检查，除非设置了 [`force`](/api/class-locator#locator-tap-option-force) 选项。
1. 如果需要，将元素滚动到视图中。
1. 使用 [`page.touchscreen`](/api/class-page#page-touchscreen) 点击元素中心或指定的 [`position`](/api/class-locator#locator-tap-option-position)。

::: info
`element.tap()` 要求浏览器上下文的 `hasTouch` 选项设置为 true。
:::


### locator.textContent() {#locator-text-content}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

返回 [`node.textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)。

:::warning[断言文本]
如果需要断言页面上的文本，建议使用 [`locatorAssertions.toHaveText()`](/api/class-locatorassertions#locator-assertions-to-have-text) 以避免不稳定。更多详情请参阅[断言指南](../test-assertions.md)。
:::

**返回**

- `Promise<null | string>`


### locator.uncheck() {#locator-uncheck}

<Badge type="info" text="Added in: v1.14" /> <Badge type="tip" text="async" />

确保复选框或单选元素未被选中。

**用法**

```js
await page.getByRole('checkbox').uncheck();
```


### locator.waitFor() {#locator-wait-for}

<Badge type="info" text="Added in: v1.16" /> <Badge type="tip" text="async" />

当定位器指定的元素满足 [`state`](/api/class-locator#locator-wait-for-option-state) 选项时返回。

如果目标元素已满足条件，该方法立即返回。否则，等待最多 [`timeout`](/api/class-locator#locator-wait-for-option-timeout) 毫秒直到条件满足。

**用法**

```js
const orderSent = page.locator('#order-sent');
await orderSent.waitFor();
```

**参数**

- <a id="locator-wait-for-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-wait-for-option-state"></a>`state` `"attached" | "detached" | "visible" | "hidden"` *(可选)*

    默认为 `'visible'`。可以是：
    * `'attached'` - 等待元素出现在 DOM 中。
    * `'detached'` - 等待元素不在 DOM 中。
    * `'visible'` - 等待元素具有非空边界框且没有 `visibility:hidden`。
    * `'hidden'` - 等待元素与 DOM 分离，或具有空边界框或 `visibility:hidden`。
  - <a id="locator-wait-for-option-timeout"></a>`timeout` `float` *(可选)*

    最大时间（毫秒）。默认为 `0` - 无超时。
