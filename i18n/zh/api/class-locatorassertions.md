---
title: LocatorAssertions
outline: 2
---

# LocatorAssertions

<Badge type="info" text="Added in: v1.17" />

[LocatorAssertions](/api/class-locatorassertions) 类提供了可用于在测试中对 [Locator](/api/class-locator) 状态进行断言的断言方法。

```js
import { test, expect } from '@playwright/test';

test('status becomes submitted', async ({ page }) => {
  // ...
  await page.getByRole('button').click();
  await expect(page.locator('.status')).toHaveText('Submitted');
});
```

## 方法

### locatorAssertions.toBeAttached() {#locator-assertions-to-be-attached}

<Badge type="info" text="Added in: v1.33" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个[已连接](https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected)到 Document 或 ShadowRoot 的元素。

**用法**

```js
await expect(page.getByText('Hidden text')).toBeAttached();
```

**参数**

- <a id="locator-assertions-to-be-attached-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-be-attached-option-attached"></a>`attached` `boolean` *(可选)*
  - <a id="locator-assertions-to-be-attached-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。中止信号���像超时一样使断言失败：如果信号在断言重试时被中止，或者在断言开始之前已被中止，则断言会失败而不再重试。
  - <a id="locator-assertions-to-be-attached-option-timeout"></a>`timeout` `float` *(可选)*

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toBeChecked() {#locator-assertions-to-be-checked}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个已选中的输入框。

**用法**

```js
const locator = page.getByLabel('Subscribe to newsletter');
await expect(locator).toBeChecked();
```

**参数**

- <a id="locator-assertions-to-be-checked-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-be-checked-option-checked"></a>`checked` `boolean` *(可选)* <Badge type="info" text="Added in: v1.18" />

    提供要断言的状态。默认断言输入框已选中。
    当 [`indeterminate`](/api/class-locatorassertions#locator-assertions-to-be-checked-option-indeterminate) 设置为 true 时，此选项不能使用。
  - <a id="locator-assertions-to-be-checked-option-indeterminate"></a>`indeterminate` `boolean` *(可选)* <Badge type="info" text="Added in: v1.50" />

    断言元素处于不确定（混合）状态。仅支持复选框和单选按钮。
    当提供 [`checked`](/api/class-locatorassertions#locator-assertions-to-be-checked-option-checked) 时，此选项不能为 true。
  - <a id="locator-assertions-to-be-checked-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。中止信号会像超时一样使断言失败：如果信号在断言重试时被中止，或者在断言开始之前已被中止，则断言会失败而不再重试。
  - <a id="locator-assertions-to-be-checked-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toBeDisabled() {#locator-assertions-to-be-disabled}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个禁用的元素。如果元素具有 "disabled" 属性或通过 ['aria-disabled'](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled) 禁用，则该元素是禁用的。
注意只有原生控制元素如 HTML `button`、`input`、`select`、`textarea`、`option`、`optgroup` 可以通过设置 "disabled" 属性来禁用。其他元素上的 "disabled" 属性会被浏览器忽略。

**用法**

```js
const locator = page.locator('button.submit');
await expect(locator).toBeDisabled();
```

**参数**

- <a id="locator-assertions-to-be-disabled-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-be-disabled-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。
  - <a id="locator-assertions-to-be-disabled-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toBeEditable() {#locator-assertions-to-be-editable}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个可编辑的元素。

**用法**

```js
const locator = page.getByRole('textbox');
await expect(locator).toBeEditable();
```

**参数**

- <a id="locator-assertions-to-be-editable-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-be-editable-option-editable"></a>`editable` `boolean` *(可选)* <Badge type="info" text="Added in: v1.26" />
  - <a id="locator-assertions-to-be-editable-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。
  - <a id="locator-assertions-to-be-editable-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toBeEmpty() {#locator-assertions-to-be-empty}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个空的可编辑元素或没有文本的 DOM 节点。

**用法**

```js
const locator = page.locator('div.warning');
await expect(locator).toBeEmpty();
```

**参数**

- <a id="locator-assertions-to-be-empty-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-be-empty-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。
  - <a id="locator-assertions-to-be-empty-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toBeEnabled() {#locator-assertions-to-be-enabled}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个启用的元素。

**用法**

```js
const locator = page.locator('button.submit');
await expect(locator).toBeEnabled();
```

**参数**

- <a id="locator-assertions-to-be-enabled-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-be-enabled-option-enabled"></a>`enabled` `boolean` *(可选)* <Badge type="info" text="Added in: v1.26" />
  - <a id="locator-assertions-to-be-enabled-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。
  - <a id="locator-assertions-to-be-enabled-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toBeFocused() {#locator-assertions-to-be-focused}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个获得焦点的 DOM 节点。

**用法**

```js
const locator = page.getByRole('textbox');
await expect(locator).toBeFocused();
```

**参数**

- <a id="locator-assertions-to-be-focused-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-be-focused-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。
  - <a id="locator-assertions-to-be-focused-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toBeHidden() {#locator-assertions-to-be-hidden}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 不解析为任何 DOM 节点，或解析为[不可见](../actionability.md#visible)的节点。

**用法**

```js
const locator = page.locator('.my-element');
await expect(locator).toBeHidden();
```

**参数**

- <a id="locator-assertions-to-be-hidden-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-be-hidden-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。
  - <a id="locator-assertions-to-be-hidden-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toBeInViewport() {#locator-assertions-to-be-in-viewport}

<Badge type="info" text="Added in: v1.31" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向的元素与视口相交，根据[交叉观察器 API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)。

**用法**

```js
const locator = page.getByRole('button');
// 确保元素的至少一部分与视口相交。
await expect(locator).toBeInViewport();
// 确保元素完全在视口之外。
await expect(locator).not.toBeInViewport();
// 确保元素的至少一半与视口相交。
await expect(locator).toBeInViewport({ ratio: 0.5 });
```

**参数**

- <a id="locator-assertions-to-be-in-viewport-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-be-in-viewport-option-ratio"></a>`ratio` `float` *(可选)*

    元素与视口相交的最小比率。如果等于 `0`，则元素应与视口以任何正比率相交。默认为 `0`。
  - <a id="locator-assertions-to-be-in-viewport-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。
  - <a id="locator-assertions-to-be-in-viewport-option-timeout"></a>`timeout` `float` *(可选)*

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toBeVisible() {#locator-assertions-to-be-visible}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个已附加且[可见](../actionability.md#visible)的 DOM 节点。

要检查列表中至少有一个元素可见，请使用 [`locator.first()`](/api/class-locator#locator-first)。

**用法**

```js
// 特定元素可见。
await expect(page.getByText('Welcome')).toBeVisible();

// 列表中至少有一项可见。
await expect(page.getByTestId('todo-item').first()).toBeVisible();

// 两个元素中至少有一个可见，可能两个都可见。
await expect(
    page.getByRole('button', { name: 'Sign in' })
        .or(page.getByRole('button', { name: 'Sign up' }))
        .first()
).toBeVisible();
```

**参数**

- <a id="locator-assertions-to-be-visible-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-be-visible-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。
  - <a id="locator-assertions-to-be-visible-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。
  - <a id="locator-assertions-to-be-visible-option-visible"></a>`visible` `boolean` *(可选)* <Badge type="info" text="Added in: v1.26" />


### locatorAssertions.toContainText() {#locator-assertions-to-contain-text}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个包含给定文本的元素。在计算元素的文本内容时，将考虑所有嵌套元素。你也可以为该值使用正则表达式。

**详情**

当 `expected` 参数是字符串时，Playwright 会在匹配之前规范化实际文本和预期字符串中的空格和换行符。当使用正则表达式时，实际文本按原样匹配。

**用法**

```js
const locator = page.locator('.title');
await expect(locator).toContainText('substring');
await expect(locator).toContainText(/\d messages/);
```

如果你传递一个数组作为预期值，则期望是：
1. Locator 解析为元素列表。
1. 此列表中的**子集**元素分别包含来自预期数组的文本。
1. 匹配的元素子集与预期数组具有相同的顺序。
1. 预期数组中的每个文本值都与列表中的某个元素匹配。

例如，考虑以下列表：

```html
<ul>
  <li>Item Text 1</li>
  <li>Item Text 2</li>
  <li>Item Text 3</li>
</ul>
```

让我们看看如何使用断言：

```js
// ✓ 按正确顺序包含正确的项目
await expect(page.locator('ul > li')).toContainText(['Text 1', 'Text 3']);

// ✖ 顺序错误
await expect(page.locator('ul > li')).toContainText(['Text 3', 'Text 2']);

// ✖ 没有项目包含此文本
await expect(page.locator('ul > li')).toContainText(['Some 33']);

// ✖ Locator 指向外部列表元素，而不是列表项
await expect(page.locator('ul')).toContainText(['Text 3']);
```

**参数**

- <a id="locator-assertions-to-contain-text-option-expected"></a>`expected` `string | RegExp | Array<string | RegExp>` <Badge type="info" text="Added in: v1.18" />

  预期的子字符串或正则表达式或它们的列表。
- <a id="locator-assertions-to-contain-text-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-contain-text-option-ignore-case"></a>`ignoreCase` `boolean` *(可选)* <Badge type="info" text="Added in: v1.23" />

    是否执行不区分大小写的匹配。如果指定，[`ignoreCase`](/api/class-locatorassertions#locator-assertions-to-contain-text-option-ignore-case) 选项优先于相应的正则表达式标志。
  - <a id="locator-assertions-to-contain-text-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。
  - <a id="locator-assertions-to-contain-text-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。
  - <a id="locator-assertions-to-contain-text-option-use-inner-text"></a>`useInnerText` `boolean` *(可选)* <Badge type="info" text="Added in: v1.18" />

    检索 DOM 节点文本时是否使用 `element.innerText` 而不是 `element.textContent`。


### locatorAssertions.toHaveAttribute() {#locator-assertions-to-have-attribute}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个具有给定属性的元素。

**用法**

```js
const locator = page.locator('input');
await expect(locator).toHaveAttribute('type', 'text');
```

**参数**

- <a id="locator-assertions-to-have-attribute-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  属性名称。
- <a id="locator-assertions-to-have-attribute-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  预期的属性值。
- <a id="locator-assertions-to-have-attribute-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-have-attribute-option-ignore-case"></a>`ignoreCase` `boolean` *(可选)* <Badge type="info" text="Added in: v1.40" />

    是否执行不区分大小写的匹配。
  - <a id="locator-assertions-to-have-attribute-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。
  - <a id="locator-assertions-to-have-attribute-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toHaveClass() {#locator-assertions-to-have-class}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个具有给定 CSS 类的元素。当提供字符串时，它必须完全匹配元素的 `class` 属性。要匹配单个类，请使用 [`locatorAssertions.toContainClass()`](/api/class-locatorassertions#locator-assertions-to-contain-class)。

**用法**

```html
<div class='middle selected row' id='component'></div>
```

```js
const locator = page.locator('#component');
await expect(locator).toHaveClass('middle selected row');
await expect(locator).toHaveClass(/(^|\s)selected(\s|$)/);
```

当传递数组时，该方法断言定位的元素列表与对应的预期类值列表匹配：

```js
const locator = page.locator('.list > .component');
await expect(locator).toHaveClass(['component', 'component selected', 'component']);
```

**参数**

- <a id="locator-assertions-to-have-class-option-expected"></a>`expected` `string | RegExp | Array<string | RegExp>` <Badge type="info" text="Added in: v1.18" />

  预期的类或正则表达式或它们的列表。
- <a id="locator-assertions-to-have-class-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-have-class-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。
  - <a id="locator-assertions-to-have-class-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toHaveCount() {#locator-assertions-to-have-count}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 解析为精确数量的 DOM 节点。

**用法**

```js
const list = page.locator('list > .component');
await expect(list).toHaveCount(3);
```

**参数**

- <a id="locator-assertions-to-have-count-option-count"></a>`count` `int` <Badge type="info" text="Added in: v1.18" />

  预期数量。
- <a id="locator-assertions-to-have-count-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-have-count-option-signal"></a>`signal` `AbortSignal` *(可选)* <Badge type="info" text="Added in: v1.62" />

    一个可选的 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以取消断言。
  - <a id="locator-assertions-to-have-count-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toHaveCSS() {#locator-assertions-to-have-css}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 解析为一个具有给定计算 CSS 样式的元素。

**用法**

```js
const locator = page.getByRole('button');
await expect(locator).toHaveCSS('display', 'flex');
```

**参数**

- <a id="locator-assertions-to-have-css-option-name"></a>`name` `string` <Badge type="info" text="Added in: v1.18" />

  CSS 属性名称。
- <a id="locator-assertions-to-have-css-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  CSS 属性值。
- <a id="locator-assertions-to-have-css-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-have-css-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toHaveId() {#locator-assertions-to-have-id}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个具有给定 DOM Node ID 的元素。

**用法**

```js
const locator = page.getByRole('textbox');
await expect(locator).toHaveId('lastname');
```

**参数**

- <a id="locator-assertions-to-have-id-option-id"></a>`id` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  元素 id。
- <a id="locator-assertions-to-have-id-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-have-id-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toHaveText() {#locator-assertions-to-have-text}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个具有给定文本的元素。在计算元素的文本内容时，将考虑所有嵌套元素。你也可以为该值使用正则表达式。

**详情**

当 `expected` 参数是字符串时，Playwright 会在匹配之前规范化实际文本和预期字符串中的空格和换行符。当使用正则表达式时，实际文本按原样匹配。

**用法**

```js
const locator = page.locator('.title');
await expect(locator).toHaveText(/Welcome, Test User/);
await expect(locator).toHaveText(/Welcome, .*/);
```

如果你传递一个数组作为预期值，则期望是：
1. Locator 解析为元素列表。
1. 元素数量等于数组中预期值的数量。
1. 列表中的元素具有与预期数组值一一对应的文本。

例如，考虑以下列表：

```html
<ul>
  <li>Text 1</li>
  <li>Text 2</li>
  <li>Text 3</li>
</ul>
```

让我们看看如何使用断言：

```js
// ✓ 按正确顺序有正确的项目
await expect(page.locator('ul > li')).toHaveText(['Text 1', 'Text 2', 'Text 3']);

// ✖ 顺序错误
await expect(page.locator('ul > li')).toHaveText(['Text 3', 'Text 2', 'Text 1']);

// ✖ 最后一项不匹配
await expect(page.locator('ul > li')).toHaveText(['Text 1', 'Text 2', 'Text']);

// ✖ Locator 指向外部列表元素，而不是列表项
await expect(page.locator('ul')).toHaveText(['Text 1', 'Text 2', 'Text 3']);
```

**参数**

- <a id="locator-assertions-to-have-text-option-expected"></a>`expected` `string | RegExp | Array<string | RegExp>` <Badge type="info" text="Added in: v1.18" />

  预期的字符串或正则表达式或它们的列表。
- <a id="locator-assertions-to-have-text-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-have-text-option-ignore-case"></a>`ignoreCase` `boolean` *(可选)* <Badge type="info" text="Added in: v1.23" />

    是否执行不区分大小写的匹配。
  - <a id="locator-assertions-to-have-text-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。
  - <a id="locator-assertions-to-have-text-option-use-inner-text"></a>`useInnerText` `boolean` *(可选)* <Badge type="info" text="Added in: v1.18" />

    检索 DOM 节点文本时是否使用 `element.innerText` 而不是 `element.textContent`。


### locatorAssertions.toHaveValue() {#locator-assertions-to-have-value}

<Badge type="info" text="Added in: v1.20" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向一个具有给定输入值的元素。你也可以为该值使用正则表达式。

**用法**

```js
const locator = page.locator('input[type=number]');
await expect(locator).toHaveValue(/[0-9]/);
```

**参数**

- <a id="locator-assertions-to-have-value-option-value"></a>`value` `string | RegExp` <Badge type="info" text="Added in: v1.18" />

  预期值。
- <a id="locator-assertions-to-have-value-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-have-value-option-timeout"></a>`timeout` `float` *(可选)* <Badge type="info" text="Added in: v1.18" />

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toHaveValues() {#locator-assertions-to-have-values}

<Badge type="info" text="Added in: v1.23" /> <Badge type="tip" text="async" />

确保 [Locator](/api/class-locator) 指向多选/组合框（即具有 `multiple` 属性的 `select`）并且指定的值已被选中。

**用法**

例如，给定以下元素：

```html
<select id="favorite-colors" multiple>
  <option value="R">Red</option>
  <option value="G">Green</option>
  <option value="B">Blue</option>
</select>
```

```js
const locator = page.locator('id=favorite-colors');
await locator.selectOption(['R', 'G']);
await expect(locator).toHaveValues([/R/, /G/]);
```

**参数**

- <a id="locator-assertions-to-have-values-option-values"></a>`values` `Array<string | RegExp>`

  当前选中的预期选项。
- <a id="locator-assertions-to-have-values-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-have-values-option-timeout"></a>`timeout` `float` *(可选)*

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


### locatorAssertions.toMatchAriaSnapshot() {#locator-assertions-to-match-aria-snapshot}

<Badge type="info" text="Added in: v1.49" /> <Badge type="tip" text="async" />

断言目标元素匹配给定的[无障碍快照](../aria-snapshots.md)。

**用法**

```js
await page.goto('https://demo.playwright.dev/todomvc/');
await expect(page.locator('body')).toMatchAriaSnapshot(`
  - heading "todos"
  - textbox "What needs to be done?"
`);
```

**参数**

- <a id="locator-assertions-to-match-aria-snapshot-option-expected"></a>`expected` `string`
- <a id="locator-assertions-to-match-aria-snapshot-option-options"></a>`options` `Object` *(可选)*

  - <a id="locator-assertions-to-match-aria-snapshot-option-timeout"></a>`timeout` `float` *(可选)*

    断言重试的时间（毫秒）。默认为 `TestConfig.expect` 中的 `timeout`。


## 属性

### locatorAssertions.not {#locator-assertions-not}

<Badge type="info" text="Added in: v1.20" />

使断言检查相反的条件。

**用法**

例如，此代码测试 Locator 不包含文本 `"error"`：

```js
await expect(locator).not.toContainText('error');
```

**类型**

- `LocatorAssertions`
