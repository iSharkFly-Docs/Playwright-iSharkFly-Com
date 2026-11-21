---
title: "定位器"
---

# 定位器

## 介绍

[定位器](/python/api/class-locator)是 Playwright 自动等待和重试能力的核心部分。简而言之，定位器代表一种在任何时刻在页面上查找元素的方法。

### 快速指南

以下是推荐的内置定位器。
- [`page.get_by_role()`](#locate-by-role) 通过显式和隐式的可访问性属性定位。
- [`page.get_by_text()`](#locate-by-text) 通过文本内容定位。
- [`page.get_by_label()`](#locate-by-label) 通过关联标签的文本定位表单控件。
- [`page.get_by_placeholder()`](#locate-by-placeholder) 通过占位符定位输入框。
- [`page.get_by_alt_text()`](#locate-by-alt-text) 通过文本替代内容定位元素，通常是图片。
- [`page.get_by_title()`](#locate-by-title) 通过 title 属性定位元素。
- [`page.get_by_test_id()`](#locate-by-test-id) 基于 `data-testid` 属性定位元素（可以配置其他属性）。

::: code-group

```python [Async]
await page.get_by_label("User Name").fill("John")

await page.get_by_label("Password").fill("secret-password")

await page.get_by_role("button", name="Sign in").click()

await expect(page.get_by_text("Welcome, John!")).to_be_visible()
```

```python [Sync]
page.get_by_label("User Name").fill("John")

page.get_by_label("Password").fill("secret-password")

page.get_by_role("button", name="Sign in").click()

expect(page.get_by_text("Welcome, John!")).to_be_visible()
```

:::

## 定位元素

Playwright 附带多个内置定位器。为了使测试具有弹性，我们建议优先使用面向用户的属性和显式约定，如 [`page.get_by_role()`](/python/api/class-page#page-get-by-role)。

例如，考虑以下 DOM 结构。

```html
<button>Sign in</button>
```

通过 `button` 角色和名称"Sign in"定位元素。

::: code-group

```python [Async]
await page.get_by_role("button", name="Sign in").click()
```

```python [Sync]
page.get_by_role("button", name="Sign in").click()
```

:::

::: info
使用[代码生成器](./codegen.md)生成定位器，然后根据需要编辑它。
:::

每次使用定位器执行操作时，都会在页面中定位到最新的 DOM 元素。在下面的代码片段中，底层 DOM 元素将被定位两次，每次操作之前一次。这意味着如果 DOM 在调用之间因重新渲染而发生变化，将使用与定位器对应的新元素。

::: code-group

```python [Async]
locator = page.get_by_role("button", name="Sign in")

await locator.hover()
await locator.click()
```

```python [Sync]
locator = page.get_by_role("button", name="Sign in")

locator.hover()
locator.click()
```

:::

请注意，所有创建定位器的方法，如 [`page.get_by_label()`](/python/api/class-page#page-get-by-label)，也可在 [Locator](/python/api/class-locator) 和 [FrameLocator](/python/api/class-framelocator) 类上使用，因此你可以链接它们并逐步缩小定位器的范围。

::: code-group

```python [Async]
locator = page.frame_locator("#my-frame").get_by_role("button", name="Sign in")

await locator.click()
```

```python [Sync]
locator = page.frame_locator("my-frame").get_by_role("button", name="Sign in")

locator.click()
```

:::

### 通过角色定位

[`page.get_by_role()`](/python/api/class-page#page-get-by-role) 定位器反映了用户和辅助技术如何感知页面，例如某个元素是按钮还是复选框。通过角色定位时，通常还应传递可访问名称，以便定位器精确定位到具体元素。

例如，考虑以下 DOM 结构。

```html
<h3>Sign up</h3>
<label>
  <input type="checkbox" /> Subscribe
</label>
<br/>
<button>Submit</button>
```

你可以通过其隐式角色定位每个元素：

::: code-group

```python [Async]
await expect(page.get_by_role("heading", name="Sign up")).to_be_visible()

await page.get_by_role("checkbox", name="Subscribe").check()

await page.get_by_role("button", name=re.compile("submit", re.IGNORECASE)).click()
```

```python [Sync]
expect(page.get_by_role("heading", name="Sign up")).to_be_visible()

page.get_by_role("checkbox", name="Subscribe").check()

page.get_by_role("button", name=re.compile("submit", re.IGNORECASE)).click()
```

:::

角色定位器包括[按钮、复选框、标题、链接、列表、表格等](https://www.w3.org/TR/html-aria/#docconformance)，并遵循 W3C 关于 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles)、[ARIA 属性](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes)和[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name)的规范。请注意，许多 HTML 元素如 `<button>` 具有[隐式定义的角色](https://w3c.github.io/html-aam/#html-element-role-mappings)，角色定位器可以识别这些角色。

请注意，角色定位器**不能替代**可访问性审计和一致性测试，而是提供关于 ARIA 指南的早期反馈。

:::note[何时使用角色定位器]

我们建议优先使用角色定位器来定位元素，因为这是最接近用户和辅助技术感知页面的方式。
:::

### 通过标签定位

大多数表单控件通常都有专用标签，可以方便地用于与表单交互。在这种情况下，你可以使用 [`page.get_by_label()`](/python/api/class-page#page-get-by-label) 通过关联的标签定位控件。

例如，考虑以下 DOM 结构。

```html
<label>Password <input type="password" /></label>

```

你可以在通过标签文本定位后填写输入框：

::: code-group

```python [Async]
await page.get_by_label("Password").fill("secret")
```

```python [Sync]
page.get_by_label("Password").fill("secret")
```

:::

:::note[何时使用标签定位器]

在定位表单字段时使用此定位器。
:::

### 通过占位符定位

输入框可能有一个 placeholder 属性来提示用户应该输入什么值。你可以使用 [`page.get_by_placeholder()`](/python/api/class-page#page-get-by-placeholder) 定位这样的输入框。

例如，考虑以下 DOM 结构。

```html
<input type="email" placeholder="name@example.com" />
```

你可以在通过占位符文本定位后填写输入框：

::: code-group

```python [Async]
await page.get_by_placeholder("name@example.com").fill("playwright@microsoft.com")
```

```python [Sync]
page.get_by_placeholder("name@example.com").fill("playwright@microsoft.com")
```

:::

:::note[何时使用占位符定位器]

在定位没有标签但有占位符文本的表单元素时使用此定位器。
:::

### 通过文本定位

通过元素包含的文本查找元素。使用 [`page.get_by_text()`](/python/api/class-page#page-get-by-text) 时，可以通过子字符串、精确字符串或正则表达式进行匹配。

例如，考虑以下 DOM 结构。

```html
<span>Welcome, John</span>
```

你可以通过元素包含的文本来定位它：

::: code-group

```python [Async]
await expect(page.get_by_text("Welcome, John")).to_be_visible()
```

```python [Sync]
expect(page.get_by_text("Welcome, John")).to_be_visible()
```

:::

设置精确匹配：

::: code-group

```python [Async]
await expect(page.get_by_text("Welcome, John", exact=True)).to_be_visible()
```

```python [Sync]
expect(page.get_by_text("Welcome, John", exact=True)).to_be_visible()
```

:::

使用正则表达式匹配：

::: code-group

```python [Async]
await expect(
    page.get_by_text(re.compile("welcome, john", re.IGNORECASE))
).to_be_visible()
```

```python [Sync]
expect(page.get_by_text(re.compile("welcome, john", re.IGNORECASE))).to_be_visible()
```

:::

::: info
文本匹配始终会规范化空白，即使是精确匹配。例如，它会将多个空格转换为一个，将换行符转换为空格，并忽略前导和尾随空白。
:::

:::note[何时使用文本定位器]
我们建议使用文本定位器来查找非交互元素，如 `div`、`span`、`p` 等。对于交互元素如 `button`、`a`、`input` 等，请使用[角色定位器](#locate-by-role)。
:::

你还可以[按文本过滤](#filter-by-text)，这在尝试查找列表中的特定项时非常有用。

### 通过替代文本定位

所有图片都应有一个描述图片的 `alt` 属性。你可以使用 [`page.get_by_alt_text()`](/python/api/class-page#page-get-by-alt-text) 基于文本替代内容定位图片。

例如，考虑以下 DOM 结构。

```html
<img alt="playwright logo" src="/img/playwright-logo.svg" width="100" />
```

你可以在通过文本替代内容定位后点击图片：

::: code-group

```python [Async]
await page.get_by_alt_text("playwright logo").click()
```

```python [Sync]
page.get_by_alt_text("playwright logo").click()
```

:::

:::note[何时使用 alt 定位器]

当你的元素支持替代文本（如 `img` 和 `area` 元素）时使用此定位器。
:::

### 通过标题定位

使用 [`page.get_by_title()`](/python/api/class-page#page-get-by-title) 定位具有匹配 title 属性的元素。

例如，考虑以下 DOM 结构。

```html
<span title='Issues count'>25 issues</span>
```

你可以在通过标题文本定位后检查问题数量：

::: code-group

```python [Async]
await expect(page.get_by_title("Issues count")).to_have_text("25 issues")
```

```python [Sync]
expect(page.get_by_title("Issues count")).to_have_text("25 issues")
```

:::

:::note[何时使用 title 定位器]

当你的元素具有 `title` 属性时使用此定位器。
:::

### 通过测试 ID 定位

通过测试 ID 进行测试是最具弹性的测试方式，因为即使文本或属性的角色发生变化，测试仍然会通过。QA 和开发人员应定义显式的测试 ID，并使用 [`page.get_by_test_id()`](/python/api/class-page#page-get-by-test-id) 查询它们。但是，通过测试 ID 进行测试不是面向用户的。如果角色或文本值对你很重要，请考虑使用面向用户的定位器，如[角色](#locate-by-role)和[文本定位器](#locate-by-text)。

例如，考虑以下 DOM 结构。

```html
<button data-testid="directions">Itinéraire</button>
```

你可以通过测试 ID 定位元素：

::: code-group

```python [Async]
await page.get_by_test_id("directions").click()
```

```python [Sync]
page.get_by_test_id("directions").click()
```

:::

:::note[何时使用 testid 定位器]

当你选择使用测试 ID 方法论，或者无法通过[角色](#locate-by-role)或[文本](#locate-by-text)定位时，也可以使用测试 ID。
:::

#### 设置自定义测试 ID 属性

默认情况下，[`page.get_by_test_id()`](/python/api/class-page#page-get-by-test-id) 将基于 `data-testid` 属性定位元素，但你可以在测试配置中或通过调用 [`selectors.set_test_id_attribute()`](/python/api/class-selectors#selectors-set-test-id-attribute) 进行配置。

设置测试 ID 以使用自定义数据属性进行测试。

::: code-group

```python [Async]
playwright.selectors.set_test_id_attribute("data-pw")
```

```python [Sync]
playwright.selectors.set_test_id_attribute("data-pw")
```

:::

在你的 HTML 中，现在可以使用 `data-pw` 作为测试 ID，而不是默认的 `data-testid`。

```html
<button data-pw="directions">Itinéraire</button>
```

然后像平常一样定位元素：

::: code-group

```python [Async]
await page.get_by_test_id("directions").click()
```

```python [Sync]
page.get_by_test_id("directions").click()
```

:::

### 通过 CSS 或 XPath 定位

如果你绝对必须使用 CSS 或 XPath 定位器，可以使用 [`page.locator()`](/python/api/class-page#page-locator) 创建一个定位器，该定位器接受一个选择器来描述如何在页面中查找元素。Playwright 支持 CSS 和 XPath 选择器，如果你省略 `css=` 或 `xpath=` 前缀，它会自动检测。

::: code-group

```python [Async]
await page.locator("css=button").click()
await page.locator("xpath=//button").click()

await page.locator("button").click()
await page.locator("//button").click()
```

```python [Sync]
page.locator("css=button").click()
page.locator("xpath=//button").click()

page.locator("button").click()
page.locator("//button").click()
```

:::

XPath 和 CSS 选择器可能与 DOM 结构或实现相关联。当 DOM 结构发生变化时，这些选择器可能会失效。下面长长的 CSS 或 XPath 链是**不良实践**的示例，会导致不稳定的测试：

::: code-group

```python [Async]
await page.locator(
    "#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input"
).click()

await page.locator('//*[@id="tsf"]/div[2]/div[1]/div[1]/div/div[2]/input').click()
```

```python [Sync]
page.locator(
    "#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input"
).click()

page.locator('//*[@id="tsf"]/div[2]/div[1]/div[1]/div/div[2]/input').click()
```

:::

:::note[何时使用此方法]

不推荐使用 CSS 和 XPath，因为 DOM 经常变化会导致测试不稳定。相反，尝试想出一个接近用户感知页面方式的定位器，如[角色定位器](#locate-by-role)或使用测试 ID [定义显式测试约定](#locate-by-test-id)。
:::

## 在 Shadow DOM 中定位

Playwright 中的所有定位器**默认**都可以处理 Shadow DOM 中的元素。例外情况是：
- 通过 XPath 定位不会穿透 shadow root。
- 不支持[关闭模式的 shadow root](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters)。

考虑以下具有自定义 Web 组件的示例：

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

你可以像 shadow root 不存在一样定位。

点击 `<div>Details</div>`：

::: code-group

```python [Async]
await page.get_by_text("Details").click()
```

```python [Sync]
page.get_by_text("Details").click()
```

:::

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

点击 `<x-details>`：

::: code-group

```python [Async]
await page.locator("x-details", has_text="Details").click()
```

```python [Sync]
page.locator("x-details", has_text="Details").click()
```

:::

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

确保 `<x-details>` 包含文本"Details"：

::: code-group

```python [Async]
await expect(page.locator("x-details")).to_contain_text("Details")
```

```python [Sync]
expect(page.locator("x-details")).to_contain_text("Details")
```

:::

## 过滤定位器

考虑以下 DOM 结构，我们想要点击第二个产品卡片的购买按钮。我们有几种选项来过滤定位器以获取正确的那个。

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

可以使用 [`locator.filter()`](/python/api/class-locator#locator-filter) 方法按文本过滤定位器。它将在元素内部某处搜索特定字符串，可能在后代元素中，不区分大小写。你也可以传递正则表达式。

::: code-group

```python [Async]
await page.get_by_role("listitem").filter(has_text="Product 2").get_by_role(
    "button", name="Add to cart"
).click()
```

```python [Sync]
page.get_by_role("listitem").filter(has_text="Product 2").get_by_role(
    "button", name="Add to cart"
).click()
```

:::

使用正则表达式：

::: code-group

```python [Async]
await page.get_by_role("listitem").filter(has_text=re.compile("Product 2")).get_by_role(
    "button", name="Add to cart"
).click()
```

```python [Sync]
page.get_by_role("listitem").filter(has_text=re.compile("Product 2")).get_by_role(
    "button", name="Add to cart"
).click()
```

:::

### 按不包含文本过滤

或者，按**不包含**文本过滤：

::: code-group

```python [Async]
# 5 个有库存的商品
await expect(page.get_by_role("listitem").filter(has_not_text="Out of stock")).to_have_count(5)
```

```python [Sync]
# 5 个有库存的商品
expect(page.get_by_role("listitem").filter(has_not_text="Out of stock")).to_have_count(5)
```

:::

### 按子元素/后代元素过滤

定位器支持一个选项，仅选择具有或不具有匹配另一个定位器的后代的元素。因此，你可以按任何其他定位器过滤，如 [`locator.get_by_role()`](/python/api/class-locator#locator-get-by-role)、[`locator.get_by_test_id()`](/python/api/class-locator#locator-get-by-test-id)、[`locator.get_by_text()`](/python/api/class-locator#locator-get-by-text) 等。

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

::: code-group

```python [Async]
await page.get_by_role("listitem").filter(
    has=page.get_by_role("heading", name="Product 2")
).get_by_role("button", name="Add to cart").click()
```

```python [Sync]
page.get_by_role("listitem").filter(
    has=page.get_by_role("heading", name="Product 2")
).get_by_role("button", name="Add to cart").click()
```

:::

我们还可以断言产品卡片以确保只有一个：

::: code-group

```python [Async]
await expect(
    page.get_by_role("listitem").filter(
        has=page.get_by_role("heading", name="Product 2")
    )
).to_have_count(1)
```

```python [Sync]
expect(
    page.get_by_role("listitem").filter(
        has=page.get_by_role("heading", name="Product 2")
    )
).to_have_count(1)
```

:::

过滤定位器**必须相对于**原始定位器，并且从原始定位器匹配开始查询，而不是从文档根开始。因此，以下代码将不起作用，因为过滤定位器从 `<ul>` 列表元素开始匹配，而它在原始定位器匹配的 `<li>` 列表项之外：

::: code-group

```python [Async]
# 错误示例
await expect(
    page.get_by_role("listitem").filter(
        has=page.get_by_role("list").get_by_role("heading", name="Product 2")
    )
).to_have_count(1)
```

```python [Sync]
# 错误示例
expect(
    page.get_by_role("listitem").filter(
        has=page.get_by_role("list").get_by_role("heading", name="Product 2")
    )
).to_have_count(1)
```

:::

### 按不包含子元素/后代元素过滤

我们还可以按**不包含**匹配元素来过滤。

::: code-group

```python [Async]
await expect(
    page.get_by_role("listitem").filter(
        has_not=page.get_by_role("heading", name="Product 2")
    )
).to_have_count(1)
```

```python [Sync]
expect(
    page.get_by_role("listitem").filter(
        has_not=page.get_by_role("heading", name="Product 2")
    )
).to_have_count(1)
```

:::

请注意，内部定位器是从外部定位器开始匹配的，而不是从文档根开始。

## 定位器运算符

### 在定位器内部匹配

你可以链接创建定位器的方法，如 [`page.get_by_text()`](/python/api/class-page#page-get-by-text) 或 [`locator.get_by_role()`](/python/api/class-locator#locator-get-by-role)，将搜索范围缩小到页面的特定部分。

在这个示例中，我们首先通过定位 `listitem` 角色创建一个名为 product 的定位器。然后按文本过滤。我们可以再次使用 product 定位器通过 button 角色获取并点击它，然后使用断言确保只有一个产品带有"Product 2"文本。

::: code-group

```python [Async]
product = page.get_by_role("listitem").filter(has_text="Product 2")

await product.get_by_role("button", name="Add to cart").click()
```

```python [Sync]
product = page.get_by_role("listitem").filter(has_text="Product 2")

product.get_by_role("button", name="Add to cart").click()
```

:::

你还可以使用 [`locator.within()`](/python/api/class-locator#locator-within) 组合两个定位器，例如在特定对话框中查找"保存"按钮：

::: code-group

```python [Async]
save_button = page.get_by_role("button", name="Save")
# ...
dialog = page.get_by_test_id("settings-dialog")
await save_button.within(dialog).click()
```

```python [Sync]
save_button = page.get_by_role("button", name="Save")
# ...
dialog = page.get_by_test_id("settings-dialog")
save_button.within(dialog).click()
```

:::

### 同时匹配两个定位器

方法 [`locator.and_()`](/python/api/class-locator#locator-and) 通过匹配额外的定位器来缩小现有定位器的范围。例如，你可以组合 [`page.get_by_role()`](/python/api/class-page#page-get-by-role) 和 [`page.get_by_title()`](/python/api/class-page#page-get-by-title) 来同时按角色和标题匹配。

::: code-group

```python [Async]
button = page.get_by_role("button").and_(page.get_by_title("Subscribe"))
```

```python [Sync]
button = page.get_by_role("button").and_(page.get_by_title("Subscribe"))
```

:::

### 匹配两个可选定位器之一

如果你想要定位两个或更多元素之一，并且不知道会是哪一个，可以使用 [`locator.or_()`](/python/api/class-locator#locator-or) 创建一个匹配任一或两个可选项的定位器。

例如，考虑一个场景，你想点击"新邮件"按钮，但有时会出现安全设置对话框。在这种情况下，你可以等待"新邮件"按钮或对话框，并相应地操作。

::: info
如果"新邮件"按钮和安全对话框同时出现在屏幕上，"or"定位器将同时匹配它们，可能会抛出["严格模式违规"错误](#strictness)。在这种情况下，你可以使用 [`locator.first()`](/python/api/class-locator#locator-first) 只匹配其中一个。
:::

::: code-group

```python [Async]
new_email = page.get_by_role("button", name="New")
dialog = page.get_by_text("Confirm security settings")
await expect(new_email.or_(dialog).first).to_be_visible()
if (await dialog.is_visible()):
  await page.get_by_role("button", name="Dismiss").click()
await new_email.click()
```

```python [Sync]
new_email = page.get_by_role("button", name="New")
dialog = page.get_by_text("Confirm security settings")
expect(new_email.or_(dialog).first).to_be_visible()
if (dialog.is_visible()):
  page.get_by_role("button", name="Dismiss").click()
new_email.click()
```

:::

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
  
  ::: code-group
  
  ```python [Async]
  await page.locator("button").click()
  ```
  
  ```python [Sync]
  page.locator("button").click()
  ```
  
  :::
* 这将只找到第二个按钮，因为它是可见的，然后点击它。
  
  ::: code-group
  
  ```python [Async]
  await page.locator("button").visible.click()
  ```
  
  ```python [Sync]
  page.locator("button").visible.click()
  ```
  
  :::

要匹配不可见元素，请使用 [`locator.filter()`](/python/api/class-locator#locator-filter)，并将 [`visible`](/python/api/class-locator#locator-filter-option-visible) 选项设置为 `false`。

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

使用 count 断言确保列表有 3 个项目。

::: code-group

```python [Async]
await expect(page.get_by_role("listitem")).to_have_count(3)
```

```python [Sync]
expect(page.get_by_role("listitem")).to_have_count(3)
```

:::

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

使用 [`locator_assertions.to_have_text()`](/python/api/class-locatorassertions#locator-assertions-to-have-text) 确保列表包含文本"apple"、"banana"和"orange"。

::: code-group

```python [Async]
await expect(page.get_by_role("listitem")).to_have_text(["apple", "banana", "orange"])
```

```python [Sync]
expect(page.get_by_role("listitem")).to_have_text(["apple", "banana", "orange"])
```

:::

### 获取特定项目

有多种方法可以获取列表中的特定项目。

#### 通过文本获取

使用 [`page.get_by_text()`](/python/api/class-page#page-get-by-text) 方法通过文本内容定位列表中的元素，然后点击它。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

通过文本内容定位项目并点击它。

::: code-group

```python [Async]
await page.get_by_text("orange").click()
```

```python [Sync]
page.get_by_text("orange").click()
```

:::

#### 按文本过滤

使用 [`locator.filter()`](/python/api/class-locator#locator-filter) 在列表中定位特定项目。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

通过"listitem"角色定位项目，然后按"orange"文本过滤，然后点击它。

::: code-group

```python [Async]
await page.get_by_role("listitem").filter(has_text="orange").click()
```

```python [Sync]
page.get_by_role("listitem").filter(has_text="orange").click()
```

:::

#### 通过测试 ID 获取

使用 [`page.get_by_test_id()`](/python/api/class-page#page-get-by-test-id) 方法在列表中定位元素。如果还没有测试 ID，你可能需要修改 HTML 并添加一个。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li data-testid='apple'>apple</li>
  <li data-testid='banana'>banana</li>
  <li data-testid='orange'>orange</li>
</ul>
```

通过"orange"测试 ID 定位项目，然后点击它。

::: code-group

```python [Async]
await page.get_by_test_id("orange").click()
```

```python [Sync]
page.get_by_test_id("orange").click()
```

:::

#### 通过第 n 个项目获取

如果你有一个相同元素的列表，并且区分它们的唯一方法是顺序，你可以使用 [`locator.first()`](/python/api/class-locator#locator-first)、[`locator.last()`](/python/api/class-locator#locator-last) 或 [`locator.nth()`](/python/api/class-locator#locator-nth) 从列表中选择特定元素。

::: code-group

```python [Async]
banana = await page.get_by_role("listitem").nth(1)
```

```python [Sync]
banana = page.get_by_role("listitem").nth(1)
```

:::

但是，请谨慎使用此方法。通常，页面可能会更改，定位器将指向与你预期完全不同的元素。相反，尝试想出一个唯一的定位器，它将通过[严格性标准](#strictness)。

### 链接过滤器

当你有具有各种相似性的元素时，可以使用 [`locator.filter()`](/python/api/class-locator#locator-filter) 方法选择正确的那个。你还可以链接多个过滤器来缩小选择范围。

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

要截取包含"Mary"和"Say goodbye"的行的屏幕截图：

::: code-group

```python [Async]
row_locator = page.get_by_role("listitem")

await row_locator.filter(has_text="Mary").filter(
    has=page.get_by_role("button", name="Say goodbye")
).screenshot(path="screenshot.png")
```

```python [Sync]
row_locator = page.get_by_role("listitem")

row_locator.filter(has_text="Mary").filter(
    has=page.get_by_role("button", name="Say goodbye")
).screenshot(path="screenshot.png")
```

:::

你现在应该在项目根目录中有一个"screenshot.png"文件。

### 罕见用例

#### 对列表中的每个元素执行操作

迭代元素：

::: code-group

```python [Async]
for row in await page.get_by_role("listitem").all():
    print(await row.text_content())
```

```python [Sync]
for row in page.get_by_role("listitem").all():
    print(row.text_content())
```

:::

使用常规 for 循环迭代：

::: code-group

```python [Async]
rows = page.get_by_role("listitem")
count = await rows.count()
for i in range(count):
    print(await rows.nth(i).text_content())
```

```python [Sync]
rows = page.get_by_role("listitem")
count = rows.count()
for i in range(count):
    print(rows.nth(i).text_content())
```

:::

#### 在页面中执行

[`locator.evaluate_all()`](/python/api/class-locator#locator-evaluate-all) 中的代码在页面中运行，你可以在那里调用任何 DOM API。

::: code-group

```python [Async]
rows = page.get_by_role("listitem")
texts = await rows.evaluate_all("list => list.map(element => element.textContent)")
```

```python [Sync]
rows = page.get_by_role("listitem")
texts = rows.evaluate_all("list => list.map(element => element.textContent)")
```

:::

## 严格性

定位器是严格的。这意味着所有暗示某个目标 DOM 元素的定位器操作，如果有多个元素匹配，将抛出异常。例如，如果 DOM 中有多个按钮，以下调用将抛出异常：

#### 如果有多个元素会抛出错误

::: code-group

```python [Async]
await page.get_by_role("button").click()
```

```python [Sync]
page.get_by_role("button").click()
```

:::

另一方面，Playwright 理解你何时执行多元素操作，因此当定位器解析为多个元素时，以下调用工作正常。

#### 对多个元素正常工作

::: code-group

```python [Async]
await page.get_by_role("button").count()
```

```python [Sync]
page.get_by_role("button").count()
```

:::

你可以通过告诉 Playwright 当多个元素匹配时使用哪个元素，显式地退出严格性检查，通过 [`locator.first()`](/python/api/class-locator#locator-first)、[`locator.last()`](/python/api/class-locator#locator-last) 和 [`locator.nth()`](/python/api/class-locator#locator-nth)。这些方法**不推荐**使用，因为当你的页面更改时，Playwright 可能会点击你不想要的元素。相反，遵循上面的最佳实践来创建一个唯一标识目标元素的定位器。

## 更多定位器

有关不太常用的定位器，请查看[其他定位器](./other-locators.md)指南。
