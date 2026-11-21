---
title: FrameLocator
outline: 2
---

# FrameLocator

<Badge type="info" text="Added in: v1.17" />

FrameLocator 表示页面上 `iframe` 的视图。它封装了获取 `iframe` 并在该 iframe 中定位元素的逻辑。FrameLocator 可以通过 [`locator.contentFrame()`](/api/class-locator#locator-content-frame)、[`page.frameLocator()`](/api/class-page#page-frame-locator) 或 [`locator.frameLocator()`](/api/class-locator#locator-frame-locator) 方法创建。

```js
const locator = page.locator('#my-frame').contentFrame().getByText('Submit');
await locator.click();
```

**严格模式**

Frame locators 是严格的。这意味着如果有多个元素匹配给定的选择器，所有在 frame locators 上的操作都会抛出异常。

```js
// 如果 DOM 中有多个 frame 则会抛出异常:
await page.locator('.result-frame').contentFrame().getByRole('button').click();

// 可以正常工作，因为我们明确告诉 locator 选择第一个 frame:
await page.locator('.result-frame').contentFrame().first().getByRole('button').click();
```

**任意 frame**

调用 [`page.frameLocator()`](/api/class-page#page-frame-locator) 或 [`frame.frameLocator()`](/api/class-frame#frame-frame-locator) 时不带选择器会创建一个 frame locator，该 locator 会在子树的任意 frame 中开始搜索——这样你就不需要先定位 iframe。

```js
// 在页面的任意 frame 中查找按钮:
await page.frameLocator().getByRole('button').click();

// 在页面的任意位置查找 id 为 "my-frame" 的 iframe，并点击其中的按钮:
await page.frameLocator().locator('#my-frame').contentFrame().getByRole('button').click();
```

只有搜索的起点会受到影响——locator 的其余部分在单个 frame 内解析，就像任何其他 locator 一样。遵循上述严格模式规则，当元素在多个 frame 中匹配时会抛出错误。

这样的 frame locator 不指向特定的 `iframe`，因此不支持 [`frameLocator.owner()`](/api/class-framelocator#frame-locator-owner)、[`frameLocator.first()`](/api/class-framelocator#frame-locator-first)、[`frameLocator.last()`](/api/class-framelocator#frame-locator-last) 和 [`frameLocator.nth()`](/api/class-framelocator#frame-locator-nth)。

**将 Locator 转换为 FrameLocator**

如果你有一个指向 `iframe` 的 [Locator](/api/class-locator) 对象，可以使用 [`locator.contentFrame()`](/api/class-locator#locator-content-frame) 将其转换为 [FrameLocator](/api/class-framelocator)。

**将 FrameLocator 转换为 Locator**

如果你有一个 [FrameLocator](/api/class-framelocator) 对象，可以使用 [`frameLocator.owner()`](/api/class-framelocator#frame-locator-owner) 将其转换为指向同一 `iframe` 的 [Locator](/api/class-locator)。

## 方法

### frameLocator.frameLocator() {#frame-locator-frame-locator}

<Badge type="info" text="Added in: v1.17" />

当处理 iframe 时，你可以创建一个 frame locator，它将进入 iframe 并允许在该 iframe 中选择元素。

**参数**

- <a id="frame-locator-frame-locator-option-selector"></a>`selector` `string`

  解析 DOM 元素时使用的选择器。

**返回值**

- `FrameLocator`


### frameLocator.getByAltText() {#frame-locator-get-by-alt-text}

<Badge type="info" text="Added in: v1.27" />

允许通过 alt 文本定位元素。

**用法**

例如，此方法将通过 alt 文本 "Playwright logo" 找到图片：

```html
<img alt='Playwright logo'>
```

```js
await page.getByAltText('Playwright logo').click();
```

**参数**

- <a id="frame-locator-get-by-alt-text-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="frame-locator-get-by-alt-text-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-locator-get-by-alt-text-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写且匹配整个字符串。默认为 false。使用正则表达式定位时会被忽略。注意精确匹配仍会修剪空白字符。

**返回值**

- `Locator`


### frameLocator.getByLabel() {#frame-locator-get-by-label}

<Badge type="info" text="Added in: v1.27" />

允许通过关联的 `<label>` 或 `aria-labelledby` 元素的文本，或通过 `aria-label` 属性来定位输入元素。

表单关联的自定义元素也支持关联的 `<label>` 元素。

**用法**

例如，此方法将在以下 DOM 中通过标签 "Username" 和 "Password" 找到输入框：

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

- <a id="frame-locator-get-by-label-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="frame-locator-get-by-label-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-locator-get-by-label-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写且匹配整个字符串。默认为 false。使用正则表达式定位时会被忽略。注意精确匹配仍会修剪空白字符。

**返回值**

- `Locator`


### frameLocator.getByPlaceholder() {#frame-locator-get-by-placeholder}

<Badge type="info" text="Added in: v1.27" />

允许通过占位符文本定位输入元素。

**用法**

例如，考虑以下 DOM 结构。

```html
<input type="email" placeholder="name@example.com" />
```

你可以通过占位符文本定位后填充输入框：

```js
await page
    .getByPlaceholder('name@example.com')
    .fill('playwright@microsoft.com');
```

**参数**

- <a id="frame-locator-get-by-placeholder-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="frame-locator-get-by-placeholder-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-locator-get-by-placeholder-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写且匹配整个字符串。默认为 false。使用正则表达式定位时会被忽略。注意精确匹配仍会修剪空白字符。

**返回值**

- `Locator`


### frameLocator.getByRole() {#frame-locator-get-by-role}

<Badge type="info" text="Added in: v1.27" />

允许通过 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles)、[ARIA 属性](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) 和 [可访问名称](https://w3c.github.io/accname/#dfn-accessible-name) 定位元素。

**用法**

考虑以下 DOM 结构。

```html
<h3>Sign up</h3>
<label>
  <input type="checkbox" /> Subscribe
</label>
<br/>
<button>Submit</button>
```

你可以通过隐式角色定位每个元素：

```js
await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

await page.getByRole('checkbox', { name: 'Subscribe' }).check();

await page.getByRole('button', { name: /submit/i }).click();
```

**详情**

角色选择器**不能替代**无障碍审计和一致性测试，而是为 ARIA 指南提供早期反馈。

许多 HTML 元素具有隐式[定义的角色](https://w3c.github.io/html-aam/#html-element-role-mappings)，角色选择器可以识别这些角色。你可以在[这里找到所有支持的角色](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)。ARIA 指南**不建议**通过设置 `role` 和/或 `aria-*` 属性为默认值来复制隐式角色和属性。

**参数**

- <a id="frame-locator-get-by-role-option-role"></a>`role` `"alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"`

  必需的 aria 角色。
- <a id="frame-locator-get-by-role-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-locator-get-by-role-option-checked"></a>`checked` `boolean` *(可选)*

    通常由 `aria-checked` 或原生 `<input type=checkbox>` 控件设置的属性。

    了解更多关于 [`aria-checked`](https://www.w3.org/TR/wai-aria-1.2/#aria-checked)。
  - <a id="frame-locator-get-by-role-option-description"></a>`description` `string | RegExp` *(可选)* <Badge type="info" text="Added in: v1.60" />

    匹配[可访问描述](https://w3c.github.io/accname/#dfn-accessible-description)的选项。默认情况下，匹配不区分大小写且搜索子字符串，使用 [`exact`](/api/class-framelocator#frame-locator-get-by-role-option-exact) 来控制此行为。

    了解更多关于[可访问描述](https://w3c.github.io/accname/#dfn-accessible-description)。
  - <a id="frame-locator-get-by-role-option-disabled"></a>`disabled` `boolean` *(可选)*

    通常由 `aria-disabled` 或 `disabled` 设置的属性。

    ::: info
    与大多数其他属性不同，`disabled` 通过 DOM 层级继承。
    了解更多关于 [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled)。
    :::
  - <a id="frame-locator-get-by-role-option-exact"></a>`exact` `boolean` *(可选)* <Badge type="info" text="Added in: v1.28" />

    [`name`](/api/class-framelocator#frame-locator-get-by-role-option-name) 和 [`description`](/api/class-framelocator#frame-locator-get-by-role-option-description) 是否精确匹配：区分大小写且匹配整个字符串。默认为 false。当值是正则表达式时会被忽略。注意精确匹配仍会修剪空白字符。
  - <a id="frame-locator-get-by-role-option-expanded"></a>`expanded` `boolean` *(可选)*

    通常由 `aria-expanded` 设置的属性。

    了解更多关于 [`aria-expanded`](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded)。
  - <a id="frame-locator-get-by-role-option-include-hidden"></a>`includeHidden` `boolean` *(可选)*

    控制是否匹配隐藏元素的选项。默认情况下，根据 [ARIA 的定义](https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion)，角色选择器只匹配非隐藏元素。

    了解更多关于 [`aria-hidden`](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden)。
  - <a id="frame-locator-get-by-role-option-level"></a>`level` `int` *(可选)*

    通常用于 `heading`、`listitem`、`row`、`treeitem` 角色的数字属性，对于 `<h1>-<h6>` 元素有默认值。

    了解更多关于 [`aria-level`](https://www.w3.org/TR/wai-aria-1.2/#aria-level)。
  - <a id="frame-locator-get-by-role-option-name"></a>`name` `string | RegExp` *(可选)*

    匹配[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name)的选项。默认情况下，匹配不区分大小写且搜索子字符串，使用 [`exact`](/api/class-framelocator#frame-locator-get-by-role-option-exact) 来控制此行为。

    了解更多关于[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name)。
  - <a id="frame-locator-get-by-role-option-pressed"></a>`pressed` `boolean` *(可选)*

    通常由 `aria-pressed` 设置的属性。

    了解更多关于 [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.2/#aria-pressed)。
  - <a id="frame-locator-get-by-role-option-selected"></a>`selected` `boolean` *(可选)*

    通常由 `aria-selected` 设置的属性。

    了解更多关于 [`aria-selected`](https://www.w3.org/TR/wai-aria-1.2/#aria-selected)。

**返回值**

- `Locator`


### frameLocator.getByTestId() {#frame-locator-get-by-test-id}

<Badge type="info" text="Added in: v1.27" />

通过测试 id 定位元素。

**用法**

考虑以下 DOM 结构。

```html
<button data-testid="directions">Itinéraire</button>
```

你可以通过测试 id 定位元素：

```js
await page.getByTestId('directions').click();
```

**详情**

默认情况下，`data-testid` 属性用作测试 id。如有需要，使用 [`selectors.setTestIdAttribute()`](/api/class-selectors#selectors-set-test-id-attribute) 配置不同的测试 id 属性。

```js
// 在 @playwright/test 配置中设置自定义测试 id 属性:
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    testIdAttribute: 'data-pw'
  },
});
```

**参数**

- <a id="frame-locator-get-by-test-id-option-test-id"></a>`testId` `string | RegExp`

  用于定位元素的 id。

**返回值**

- `Locator`


### frameLocator.getByText() {#frame-locator-get-by-text}

<Badge type="info" text="Added in: v1.27" />

允许定位包含给定文本的元素。

另请参阅 [`locator.filter()`](/api/class-locator#locator-filter)，它允许按其他条件（如可访问角色）进行匹配，然后按文本内容进行筛选。

**用法**

考虑以下 DOM 结构：

```html
<div>Hello <span>world</span></div>
<div>Hello</div>
```

你可以通过文本子字符串、精确字符串或正则表达式进行定位：

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

**详情**

文本匹配始终会规范化空白字符，即使是精确匹配也是如此。例如，它会将多个空格转换为一个空格，将换行符转换为空格，并忽略前导和尾随空白字符。

`button` 和 `submit` 类型的输入元素通过它们的 `value` 而不是文本内容进行匹配。例如，通过文本 `"Log in"` 定位会匹配 `<input type=button value="Log in">`。

**参数**

- <a id="frame-locator-get-by-text-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="frame-locator-get-by-text-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-locator-get-by-text-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写且匹配整个字符串。默认为 false。使用正则表达式定位时会被忽略。注意精确匹配仍会修剪空白字符。

**返回值**

- `Locator`


### frameLocator.getByTitle() {#frame-locator-get-by-title}

<Badge type="info" text="Added in: v1.27" />

允许通过 title 属性定位元素。

**用法**

考虑以下 DOM 结构。

```html
<span title='Issues count'>25 issues</span>
```

你可以通过 title 文本定位后检查问题计数：

```js
await expect(page.getByTitle('Issues count')).toHaveText('25 issues');
```

**参数**

- <a id="frame-locator-get-by-title-option-text"></a>`text` `string | RegExp`

  用于定位元素的文本。
- <a id="frame-locator-get-by-title-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-locator-get-by-title-option-exact"></a>`exact` `boolean` *(可选)*

    是否查找精确匹配：区分大小写且匹配整个字符串。默认为 false。使用正则表达式定位时会被忽略。注意精确匹配仍会修剪空白字符。

**返回值**

- `Locator`


### frameLocator.locator() {#frame-locator-locator}

<Badge type="info" text="Added in: v1.17" />

该方法在 locator 的子树中查找匹配指定选择器的元素。它还接受筛选选项，类似于 [`locator.filter()`](/api/class-locator#locator-filter) 方法。

[了解更多关于定位器](../locators.md)。

**参数**

- <a id="frame-locator-locator-option-selector-or-locator"></a>`selectorOrLocator` `string | Locator`

  解析 DOM 元素时使用的选择器或定位器。
- <a id="frame-locator-locator-option-options"></a>`options` `Object` *(可选)*

  - <a id="frame-locator-locator-option-has"></a>`has` `Locator` *(可选)*

    将方法结果缩小到包含匹配此相对定位器的元素的结果。
    例如，`article` 且包含 `text=Playwright` 会匹配 `<article><div>Playwright</div></article>`。

    内部定位器**必须是相对于**外部定位器的，并且从外部定位器匹配开始查询，而不是从文档根开始。例如，你可以在 `<article><content><div>Playwright</div></content></article>` 中找到包含 `div` 的 `content`。但是，查找包含 `article div` 的 `content` 会失败，因为内部定位器必须是相对的，不应使用 `content` 外部的任何元素。

    注意外部和内部定位器必须属于同一个 frame。内部定位器不能包含 [FrameLocator](/api/class-framelocator)。
  - <a id="frame-locator-locator-option-has-not"></a>`hasNot` `Locator` *(可选)* <Badge type="info" text="Added in: v1.33" />

    匹配不包含匹配内部定位器的元素的元素。内部定位器针对外部定位器进行查询。
    例如，`article` 且不包含 `div` 会匹配 `<article><span>Playwright</span></article>`。

    注意外部和内部定位器必须属于同一个 frame。内部定位器不能包含 [FrameLocator](/api/class-framelocator)。
  - <a id="frame-locator-locator-option-has-not-text"></a>`hasNotText` `string | RegExp` *(可选)* <Badge type="info" text="Added in: v1.33" />

    匹配内部某处不包含指定文本的元素，可能在子元素或后代元素中。当传入 [string] 时，匹配不区分大小写且搜索子字符串。
  - <a id="frame-locator-locator-option-has-text"></a>`hasText` `string | RegExp` *(可选)*

    匹配内部某处包含指定文本的元素，可能在子元素或后代元素中。当传入 [string] 时，匹配不区分大小写且搜索子字符串。
    例如，`"Playwright"` 会匹配 `<article><div>Playwright</div></article>`。

**返回值**

- `Locator`


### frameLocator.owner() {#frame-locator-owner}

<Badge type="info" text="Added in: v1.43" />

返回一个指向与此 frame locator 相同的 `iframe` 的 [Locator](/api/class-locator) 对象。

当你在某处获得了一个 [FrameLocator](/api/class-framelocator) 对象，之后想要与 `iframe` 元素进行交互时很有用。

对于反向操作，使用 [`locator.contentFrame()`](/api/class-locator#locator-content-frame)。

**用法**

```js
const frameLocator = page.locator('iframe[name="embedded"]').contentFrame();
// ...
const locator = frameLocator.owner();
await expect(locator).toBeVisible();
```

**返回值**

- `Locator`


## 已弃用

### frameLocator.first() {#frame-locator-first}

<Badge type="info" text="Added in: v1.17" />

::: danger 已弃用
请改用 [`locator.first()`](/api/class-locator#locator-first) 后跟 [`locator.contentFrame()`](/api/class-locator#locator-content-frame)。
:::

返回第一个匹配 frame 的定位器。

**返回值**

- `FrameLocator`


### frameLocator.last() {#frame-locator-last}

<Badge type="info" text="Added in: v1.17" />

::: danger 已弃用
请改用 [`locator.last()`](/api/class-locator#locator-last) 后跟 [`locator.contentFrame()`](/api/class-locator#locator-content-frame)。
:::

返回最后一个匹配 frame 的定位器。

**返回值**

- `FrameLocator`


### frameLocator.nth() {#frame-locator-nth}

<Badge type="info" text="Added in: v1.17" />

::: danger 已弃用
请改用 [`locator.nth()`](/api/class-locator#locator-nth) 后跟 [`locator.contentFrame()`](/api/class-locator#locator-content-frame)。
:::

返回第 n 个匹配 frame 的定位器。从零开始计数，`nth(0)` 选择第一个 frame。

**参数**

- <a id="frame-locator-nth-option-index"></a>`index` `int`

**返回值**

- `FrameLocator`
