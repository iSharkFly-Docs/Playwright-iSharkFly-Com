---
title: "定位器"
---

# 定位器

## 简介

[定位器](/api/class-locator) 是 Playwright 自动等待和重试能力的核心。简而言之，定位器代表了一种在任何时刻查找页面上元素的方式。

### 快速指南

以下是推荐的内置定位器。
- [`page.getByRole()`](#locate-by-role) 通过显式和隐式的无障碍属性定位。
- [`page.getByText()`](#locate-by-text) 通过文本内容定位。
- [`page.getByLabel()`](#locate-by-label) 通过关联标签的文本定位表单控件。
- [`page.getByPlaceholder()`](#locate-by-placeholder) 通过占位符定位输入框。
- [`page.getByAltText()`](#locate-by-alt-text) 通过替代文本定位元素，通常是图片。
- [`page.getByTitle()`](#locate-by-title) 通过 title 属性定位元素。
- [`page.getByTestId()`](#locate-by-test-id) 基于 `data-testid` 属性定位元素（可配置其他属性）。

```js
await page.getByLabel('User Name').fill('John');

await page.getByLabel('Password').fill('secret-password');

await page.getByRole('button', { name: 'Sign in' }).click();

await expect(page.getByText('Welcome, John!')).toBeVisible();
```

## 定位元素

Playwright 提供多种内置定位器。为了使测试更具弹性，我们建议优先使用面向用户的属性和显式约定，如 [`page.getByRole()`](/api/class-page#page-get-by-role)。

例如，考虑以下 DOM 结构。

```html
<button>Sign in</button>
```

通过角色 `button` 和名称 "Sign in" 定位元素。

```js
await page.getByRole('button', { name: 'Sign in' }).click();
```

::: info
使用[代码生成器](./codegen.md)生成定位器，然后根据需要进行编辑。
:::

每次使用定位器执行操作时，都会在页面中定位最新的 DOM 元素。在下面的代码片段中，底层 DOM 元素将被定位两次，每次操作之前各一次。这意味着如果由于重新渲染导致调用之间 DOM 发生变化，将使用与定位器对应的新元素。

```js
const locator = page.getByRole('button', { name: 'Sign in' });

await locator.hover();
await locator.click();
```

请注意，所有创建定位器的方法，如 [`page.getByLabel()`](/api/class-page#page-get-by-label)，也可以在 [Locator](/api/class-locator) 和 [FrameLocator](/api/class-framelocator) 类上使用，因此你可以链式调用它们并迭代缩小定位器范围。

```js
const locator = page
    .frameLocator('#my-frame')
    .getByRole('button', { name: 'Sign in' });

await locator.click();
```

### 通过角色定位

[`page.getByRole()`](/api/class-page#page-get-by-role) 定位器反映了用户和辅助技术如何感知页面，例如某个元素是按钮还是复选框。通过角色定位时，通常还应传递无障碍名称，以便定位器精确定位到确切的元素。

例如，考虑以下 DOM 结构。

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

角色定位器包括[按钮、复选框、标题、链接、列表、表格等](https://www.w3.org/TR/html-aria/#docconformance)，遵循 W3C 的 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles)、[ARIA 属性](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes)和[无障碍名称](https://w3c.github.io/accname/#dfn-accessible-name)规范。请注意，许多 html 元素（如 `<button>`）具有[隐式定义的角色](https://w3c.github.io/html-aam/#html-element-role-mappings)，角色定位器可以识别它们。

请注意，角色定位器**不能替代**无障碍审计和合规性测试，而是提供关于 ARIA 指南的早期反馈。

:::note[何时使用角色定位器]

我们建议优先使用角色定位器来定位元素，因为这是最接近用户和辅助技术感知页面的方式。
:::

### 通过标签定位

大多数表单控件通常有专门的标签，可以方便地用于与表单交互。在这种情况下，你可以使用 [`page.getByLabel()`](/api/class-page#page-get-by-label) 通过关联标签定位控件。

例如，考虑以下 DOM 结构。

```html
<label>Password <input type="password" /></label>

```

你可以通过标签文本定位输入框后填充它：

```js
await page.getByLabel('Password').fill('secret');
```

:::note[何时使用标签定位器]

在定位表单字段时使用此定位器。
:::

### 通过占位符定位

输入框可能有占位符属性，提示用户应输入什么值。你可以使用 [`page.getByPlaceholder()`](/api/class-page#page-get-by-placeholder) 定位这样的输入框。

例如，考虑以下 DOM 结构。

```html
<input type="email" placeholder="name@example.com" />
```

你可以通过占位符文本定位输入框后填充它：

```js
await page
    .getByPlaceholder('name@example.com')
    .fill('playwright@microsoft.com');
```

:::note[何时使用占位符定位器]

在定位没有标签但有占位符文本的表单元素时使用此定位器。
:::

### 通过文本定位

通过元素包含的文本查找元素。使用 [`page.getByText()`](/api/class-page#page-get-by-text) 时，可以通过子字符串、精确字符串或正则表达式进行匹配。

例如，考虑以下 DOM 结构。

```html
<span>Welcome, John</span>
```

你可以通过元素包含的文本定位它：

```js
await expect(page.getByText('Welcome, John')).toBeVisible();
```

设置精确匹配：

```js
await expect(page.getByText('Welcome, John', { exact: true })).toBeVisible();
```

使用正则表达式匹配：

```js
await expect(page.getByText(/welcome, [A-Za-z]+$/i)).toBeVisible();
```

::: info
按文本匹配始终会规范化空白，即使是精确匹配也是如此。例如，它会将多个空格转换为一个，将换行符转换为空格，并忽略前导和尾随空白。
:::

:::note[何时使用文本定位器]
我们建议使用文本定位器来查找非交互元素，如 `div`、`span`、`p` 等。对于交互元素，如 `button`、`a`、`input` 等，请使用[角色定位器](#locate-by-role)。
:::

你还可以[按文本过滤](#filter-by-text)，这在尝试在列表中查找特定项目时很有用。

### 通过替代文本定位

所有图片都应该有描述图片的 `alt` 属性。你可以使用 [`page.getByAltText()`](/api/class-page#page-get-by-alt-text) 基于替代文本定位图片。

例如，考虑以下 DOM 结构。

```html
<img alt="playwright logo" src="/img/playwright-logo.svg" width="100" />
```

你可以通过替代文本定位图片后点击它：

```js
await page.getByAltText('playwright logo').click();
```

:::note[何时使用 alt 定位器]

当你的元素支持 alt 文本（如 `img` 和 `area` 元素）时使用此定位器。
:::

### 通过 title 定位

使用 [`page.getByTitle()`](/api/class-page#page-get-by-title) 定位具有匹配 title 属性的元素。

例如，考虑以下 DOM 结构。

```html
<span title='Issues count'>25 issues</span>
```

你可以通过 title 文本定位元素后检查问题数量：

```js
await expect(page.getByTitle('Issues count')).toHaveText('25 issues');
```

:::note[何时使用 title 定位器]

当你的元素具有 `title` 属性时使用此定位器。
:::

### 通过测试 ID 定位

通过测试 ID 测试是最具弹性的测试方式，即使你的文本或属性角色发生变化，测试仍然会通过。QA 和开发人员应定义显式的测试 ID 并使用 [`page.getByTestId()`](/api/class-page#page-get-by-test-id) 查询它们。但是，通过测试 ID 测试不是面向用户的。如果角色或文本值对你很重要，请考虑使用面向用户的定位器，如[角色](#locate-by-role)和[文本定位器](#locate-by-text)。

例如，考虑以下 DOM 结构。

```html
<button data-testid="directions">Itinéraire</button>
```

你可以通过测试 ID 定位元素：

```js
await page.getByTestId('directions').click();
```

:::note[何时使用 testid 定位器]

当你选择使用测试 ID 方法论，或者无法通过[角色](#locate-by-role)或[文本](#locate-by-text)定位时，也可以使用测试 ID。
:::

#### 设置自定义测试 ID 属性

默认情况下，[`page.getByTestId()`](/api/class-page#page-get-by-test-id) 将基于 `data-testid` 属性定位元素，但你可以在测试配置中或通过调用 [`selectors.setTestIdAttribute()`](/api/class-selectors#selectors-set-test-id-attribute) 进行配置。

为你的测试设置使用自定义数据属性的测试 ID。

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    testIdAttribute: 'data-pw'
  }
});
```

:::

在你的 html 中，你现在可以使用 `data-pw` 作为测试 ID，而不是默认的 `data-testid`。

```html
<button data-pw="directions">Itinéraire</button>
```

然后像平常一样定位元素：

```js
await page.getByTestId('directions').click();
```

### 通过 CSS 或 XPath 定位

如果你确实必须使用 CSS 或 XPath 定位器，可以使用 [`page.locator()`](/api/class-page#page-locator) 创建一个定位器，该定位器接受一个描述如何在页面中查找元素的选择器。Playwright 支持 CSS 和 XPath 选择器，如果省略 `css=` 或 `xpath=` 前缀，会自动检测它们。

```js
await page.locator('css=button').click();
await page.locator('xpath=//button').click();

await page.locator('button').click();
await page.locator('//button').click();
```

XPath 和 CSS 选择器可能与 DOM 结构或实现绑定。当 DOM 结构发生变化时，这些选择器可能会失效。下面的长 CSS 或 XPath 链是导致测试不稳定的**不良实践**示例：

```js
await page.locator(
    '#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input'
).click();

await page
    .locator('//*[@id="tsf"]/div[2]/div[1]/div[1]/div/div[2]/input')
    .click();
```

:::note[何时使用]

不推荐使用 CSS 和 XPath，因为 DOM 经常会发生变化，导致测试不具弹性。相反，尝试提出一个接近用户感知页面方式的定位器，如[角色定位器](#locate-by-role)或使用测试 ID [定义显式测试约定](#locate-by-test-id)。
:::

## 在 Shadow DOM 中定位

Playwright 中的所有定位器**默认**都可以处理 Shadow DOM 中的元素。例外情况是：
- 通过 XPath 定位不会穿透 shadow roots。
- 不支持[封闭模式的 shadow roots](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters)。

考虑以下带有自定义 web 组件的示例：

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

你可以像 shadow root 不存在一样进行定位。

点击 `<div>Details</div>`：

```js
await page.getByText('Details').click();
```

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

点击 `<x-details>`：

```js
await page.locator('x-details', { hasText: 'Details' }).click();
```

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

确保 `<x-details>` 包含文本 "Details"：

```js
await expect(page.locator('x-details')).toContainText('Details');
```

## 过滤定位器

考虑以下 DOM 结构，我们想点击第二个产品卡片的购买按钮。我们有几个选项来过滤定位器以获取正确的那个。

```html
<ul>
  <li>
    <h3>Product 1</h3>
    <button>Add to cart</button>
  </li>
  <li>
    <h3>Product 2</h3>
    <button>Add to cart</button>
  </li>
</ul>
```

### 按文本过滤

可以使用 [`locator.filter()`](/api/class-locator#locator-filter) 方法按文本过滤定位器。它会在元素内部（可能在后代元素中）搜索特定字符串，不区分大小写。你也可以传递正则表达式。

```js
await page
    .getByRole('listitem')
    .filter({ hasText: 'Product 2' })
    .getByRole('button', { name: 'Add to cart' })
    .click();
```

使用正则表达式：

```js
await page
    .getByRole('listitem')
    .filter({ hasText: /Product 2/ })
    .getByRole('button', { name: 'Add to cart' })
    .click();
```

### 按不包含文本过滤

或者，按**不包含**文本过滤：

```js
// 5 个有库存的商品
await expect(page.getByRole('listitem').filter({ hasNotText: 'Out of stock' })).toHaveCount(5);
```

### 按子元素/后代元素过滤

定位器支持一个选项，只选择有或没有匹配另一个定位器的后代的元素。因此，你可以按任何其他定位器过滤，如 [`locator.getByRole()`](/api/class-locator#locator-get-by-role)、[`locator.getByTestId()`](/api/class-locator#locator-get-by-test-id)、[`locator.getByText()`](/api/class-locator#locator-get-by-text) 等。

```html
<ul>
  <li>
    <h3>Product 1</h3>
    <button>Add to cart</button>
  </li>
  <li>
    <h3>Product 2</h3>
    <button>Add to cart</button>
  </li>
</ul>
```

```js
await page
    .getByRole('listitem')
    .filter({ has: page.getByRole('heading', { name: 'Product 2' }) })
    .getByRole('button', { name: 'Add to cart' })
    .click();
```

我们还可以断言产品卡片以确保只有一个：

```js
await expect(page
    .getByRole('listitem')
    .filter({ has: page.getByRole('heading', { name: 'Product 2' }) }))
    .toHaveCount(1);
```

过滤定位器**必须相对于**原始定位器，并从原始定位器匹配开始查询，而不是从文档根开始。因此，以下代码将不起作用，因为过滤定位器从 `<ul>` 列表元素开始匹配，而该元素在原始定位器匹配的 `<li>` 列表项之外：

```js
// ✖ 错误
await expect(page
    .getByRole('listitem')
    .filter({ has: page.getByRole('list').getByText('Product 2') }))
    .toHaveCount(1);
```

### 按不包含子元素/后代元素过滤

我们还可以按内部**不包含**匹配元素来过滤。

```js
await expect(page
    .getByRole('listitem')
    .filter({ hasNot: page.getByText('Product 2') }))
    .toHaveCount(1);
```

请注意，内部定位器是从外部定位器开始匹配的，而不是从文档根开始。

## 定位器操作符

### 在定位器内部匹配

你可以链式调用创建定位器的方法，如 [`page.getByText()`](/api/class-page#page-get-by-text) 或 [`locator.getByRole()`](/api/class-locator#locator-get-by-role)，以将搜索范围缩小到页面的特定部分。

在这个示例中，我们首先通过定位角色为 `listitem` 的元素创建一个名为 product 的定位器。然后按文本过滤。我们可以再次使用 product 定位器通过角色获取按钮并点击它，然后使用断言确保只有一个文本为 "Product 2" 的产品。

```js
const product = page.getByRole('listitem').filter({ hasText: 'Product 2' });

await product.getByRole('button', { name: 'Add to cart' }).click();

await expect(product).toHaveCount(1);
```

你还可以使用 [`locator.within()`](/api/class-locator#locator-within) 组合两个定位器，例如在特定对话框中查找 "Save" 按钮：

```js
const saveButton = page.getByRole('button', { name: 'Save' });
// ...
const dialog = page.getByTestId('settings-dialog');
await saveButton.within(dialog).click();
```

### 同时匹配两个定位器

方法 [`locator.and()`](/api/class-locator#locator-and) 通过匹配附加定位器来缩小现有定位器的范围。例如，你可以组合 [`page.getByRole()`](/api/class-page#page-get-by-role) 和 [`page.getByTitle()`](/api/class-page#page-get-by-title) 以同时按角色和标题匹配。

```js
const button = page.getByRole('button').and(page.getByTitle('Subscribe'));
```

### 匹配两个备选定位器之一

如果你想定位两个或更多元素之一，并且不知道会是哪一个，请使用 [`locator.or()`](/api/class-locator#locator-or) 创建一个匹配任一个或两个备选项的定位器。

例如，考虑这样一个场景：你想点击 "New email" 按钮，但有时会弹出安全设置对话框。在这种情况下，你可以等待 "New email" 按钮或对话框，并相应地采取行动。

::: info
如果 "New email" 按钮和安全对话框都出现在屏幕上，"or" 定位器将匹配它们两个，可能会抛出["严格模式违规"错误](#strictness)。在这种情况下，你可以使用 [`locator.first()`](/api/class-locator#locator-first) 只匹配其中一个。
:::

```js
const newEmail = page.getByRole('button', { name: 'New' });
const dialog = page.getByText('Confirm security settings');
await expect(newEmail.or(dialog).first()).toBeVisible();
if (await dialog.isVisible())
  await page.getByRole('button', { name: 'Dismiss' }).click();
await newEmail.click();
```

### 仅匹配可见元素

::: info
通常最好找到一种[更可靠的方式](./locators.md#quick-guide)来唯一标识元素，而不是检查可见性。
:::

考虑一个有两个按钮的页面，第一个不可见，第二个[可见](./actionability.md#visible)。

```html
<button style='display: none'>Invisible</button>
<button>Visible</button>
```
* 这将找到两个按钮并抛出[严格性](./locators.md#strictness)违规错误：
  
  ```js
  await page.locator('button').click();
  ```
* 这将只找到第二个按钮，因为它是可见的，然后点击它。
  
  ```js
  await page.locator('button').visible().click();
  ```

要匹配不可见元素，请使用 [`locator.filter()`](/api/class-locator#locator-filter) 并将 [`visible`](/api/class-locator#locator-filter-option-visible) 选项设置为 `false`。

## 列表

### 计算列表中的项目数

你可以断言定位器以计算列表中的项目数。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

使用计数断言确保列表有 3 个项目。

```js
await expect(page.getByRole('listitem')).toHaveCount(3);
```

### 断言列表中的所有文本

你可以断言定位器以查找列表中的所有文本。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

使用 [`locatorAssertions.toHaveText()`](/api/class-locatorassertions#locator-assertions-to-have-text) 确保列表包含文本 "apple"、"banana" 和 "orange"。

```js
await expect(page
    .getByRole('listitem'))
    .toHaveText(['apple', 'banana', 'orange']);
```

### 获取特定项目

有多种方法可以获取列表中的特定项目。

#### 通过文本获取

使用 [`page.getByText()`](/api/class-page#page-get-by-text) 方法通过文本内容在列表中定位元素，然后点击它。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

通过文本内容定位项目并点击它。

```js
await page.getByText('orange').click();
```

#### 按文本过滤

使用 [`locator.filter()`](/api/class-locator#locator-filter) 在列表中定位特定项目。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

通过角色 "listitem" 定位项目，然后按文本 "orange" 过滤，然后点击它。

```js
await page
    .getByRole('listitem')
    .filter({ hasText: 'orange' })
    .click();
```

#### 通过测试 ID 获取

使用 [`page.getByTestId()`](/api/class-page#page-get-by-test-id) 方法在列表中定位元素。如果你还没有测试 ID，可能需要修改 html 并添加测试 ID。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li data-testid='apple'>apple</li>
  <li data-testid='banana'>banana</li>
  <li data-testid='orange'>orange</li>
</ul>
```

通过测试 ID "orange" 定位项目，然后点击它。

```js
await page.getByTestId('orange').click();
```

#### 通过第 n 个项目获取

如果你有一个相同元素的列表，区分它们的唯一方法是顺序，你可以使用 [`locator.first()`](/api/class-locator#locator-first)、[`locator.last()`](/api/class-locator#locator-last) 或 [`locator.nth()`](/api/class-locator#locator-nth) 从列表中选择特定元素。

```js
const banana = await page.getByRole('listitem').nth(1);
```

但是，请谨慎使用此方法。页面经常会发生变化，定位器可能指向与你预期完全不同的元素。相反，尝试提出一个能通过[严格性标准](#strictness)的唯一定位器。

### 链式过滤

当你有具有各种相似性的元素时，可以使用 [`locator.filter()`](/api/class-locator#locator-filter) 方法选择正确的那个。你还可以链式调用多个过滤器来缩小选择范围。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>
    <div>John</div>
    <div><button>Say hello</button></div>
  </li>
  <li>
    <div>Mary</div>
    <div><button>Say hello</button></div>
  </li>
  <li>
    <div>John</div>
    <div><button>Say goodbye</button></div>
  </li>
  <li>
    <div>Mary</div>
    <div><button>Say goodbye</button></div>
  </li>
</ul>
```

要截取包含 "Mary" 和 "Say goodbye" 的行的屏幕截图：

```js
const rowLocator = page.getByRole('listitem');

await rowLocator
    .filter({ hasText: 'Mary' })
    .filter({ has: page.getByRole('button', { name: 'Say goodbye' }) })
    .screenshot({ path: 'screenshot.png' });
```

你现在应该在项目根目录中有一个 "screenshot.png" 文件。

### 少见用例

#### 对列表中的每个元素执行操作

迭代元素：

```js
for (const row of await page.getByRole('listitem').all())
  console.log(await row.textContent());
```

使用常规 for 循环迭代：

```js
const rows = page.getByRole('listitem');
const count = await rows.count();
for (let i = 0; i < count; ++i)
  console.log(await rows.nth(i).textContent());
```

#### 在页面中执行

[`locator.evaluateAll()`](/api/class-locator#locator-evaluate-all) 中的代码在页面中运行，你可以在那里调用任何 DOM API。

```js
const rows = page.getByRole('listitem');
const texts = await rows.evaluateAll(
    list => list.map(element => element.textContent));
```

## 严格性

定位器是严格的。这意味着所有暗示某个目标 DOM 元素的定位器操作，如果匹配多个元素，将抛出异常。例如，如果 DOM 中有多个按钮，以下调用将抛出异常：

#### 如果匹配多个则抛出错误

```js
await page.getByRole('button').click();
```

另一方面，Playwright 理解你何时执行多元素操作，因此当定位器解析为多个元素时，以下调用完全正常。

#### 对多个元素正常工作

```js
await page.getByRole('button').count();
```

你可以通过告诉 Playwright 在匹配多个元素时使用哪个元素来显式退出严格性检查，通过 [`locator.first()`](/api/class-locator#locator-first)、[`locator.last()`](/api/class-locator#locator-last) 和 [`locator.nth()`](/api/class-locator#locator-nth)。**不推荐**使用这些方法，因为当你的页面发生变化时，Playwright 可能会点击你不想要的元素。相反，遵循上述最佳实践创建一个唯一标识目标元素的定位器。

## 更多定位器

对于不太常用的定位器，请查看[其他定位器](./other-locators.md)指南。
