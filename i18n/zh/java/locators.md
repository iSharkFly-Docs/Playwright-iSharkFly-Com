---
title: "定位器"
---

# 定位器

## 简介

[Locator](/java/api/class-locator)（定位器）是 Playwright 自动等待和重试能力的核心部分。简而言之，定位器表示一种在任何时刻查找页面上元素的方法。

### 快速指南

以下是推荐的内置定位器。
- [`page.getByRole()`](#locate-by-role) 通过显式和隐式无障碍属性定位。
- [`page.getByText()`](#locate-by-text) 通过文本内容定位。
- [`page.getByLabel()`](#locate-by-label) 通过关联标签的文本定位表单控件。
- [`page.getByPlaceholder()`](#locate-by-placeholder) 通过占位符定位输入框。
- [`page.getByAltText()`](#locate-by-alt-text) 通过替代文本定位元素，通常是图片。
- [`page.getByTitle()`](#locate-by-title) 通过 title 属性定位元素。
- [`page.getByTestId()`](#locate-by-test-id) 基于 `data-testid` 属性定位元素（可配置其他属性）。

```java
page.getByLabel("User Name").fill("John");

page.getByLabel("Password").fill("secret-password");

page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign in"))
    .click();

assertThat(page.getByText("Welcome, John!")).isVisible();
```

## 定位元素

Playwright 提供多种内置定位器。为了使测试更具弹性，我们建议优先使用面向用户的属性和显式契约，如 [`page.getByRole()`](/java/api/class-page#page-get-by-role)。

例如，考虑以下 DOM 结构。

```html
<button>Sign in</button>
```

通过角色 `button` 和名称 "Sign in" 定位该元素。

```java
page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign in"))
    .click();
```

::: info
使用[代码生成器](./codegen.md)生成定位器，然后根据需要编辑它。
:::

每次使用定位器执行操作时，都会在页面中定位最新的 DOM 元素。在下面的代码片段中，底层 DOM 元素将被定位两次，每次操作之前各一次。这意味着如果 DOM 在调用之间由于重新渲染而发生变化，将使用与定位器对应的新元素。

```java
Locator locator = page.getByRole(AriaRole.BUTTON,
                                 new Page.GetByRoleOptions().setName("Sign in"));

locator.hover();
locator.click();
```

请注意，创建定位器的所有方法，如 [`page.getByLabel()`](/java/api/class-page#page-get-by-label)，也可在 [Locator](/java/api/class-locator) 和 [FrameLocator](/java/api/class-framelocator) 类上使用，因此您可以链式调用它们并逐步缩小定位器范围。

```java
Locator locator = page
    .frameLocator("#my-frame")
    .getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign in"));

locator.click();
```

### 通过角色定位

[`page.getByRole()`](/java/api/class-page#page-get-by-role) 定位器反映了用户和辅助技术如何感知页面，例如某个元素是按钮还是复选框。通过角色定位时，通常还应传递可访问名称，以便定位器精确定位到确切的元素。

例如，考虑以下 DOM 结构。

```html
<h3>Sign up</h3>
<label>
  <input type="checkbox" /> Subscribe
</label>
<br/>
<button>Submit</button>
```

您可以通过其隐式角色定位每个元素：

```java
assertThat(page
    .getByRole(AriaRole.HEADING,
               new Page.GetByRoleOptions().setName("Sign up")))
    .isVisible();

page.getByRole(AriaRole.CHECKBOX,
               new Page.GetByRoleOptions().setName("Subscribe"))
    .check();

page.getByRole(AriaRole.BUTTON,
               new Page.GetByRoleOptions().setName(
                   Pattern.compile("submit", Pattern.CASE_INSENSITIVE)))
    .click();
```

角色定位器包括[按钮、复选框、标题、链接、列表、表格等](https://www.w3.org/TR/html-aria/#docconformance)，并遵循 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles)、[ARIA 属性](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes)和[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name)的 W3C 规范。请注意，许多 HTML 元素（如 `<button>`）具有角色定位器可识别的[隐式定义角色](https://w3c.github.io/html-aam/#html-element-role-mappings)。

请注意，角色定位器**不能替代**无障碍审计和一致性测试，而是提供关于 ARIA 指南的早期反馈。

:::note[何时使用角色定位器]

我们建议优先使用角色定位器来定位元素，因为这是最接近用户和辅助技术感知页面的方式。
:::

### 通过标签定位

大多数表单控件通常都有专用标签，可以方便地用于与表单交互。在这种情况下，您可以使用 [`page.getByLabel()`](/java/api/class-page#page-get-by-label) 通过其关联标签定位控件。

例如，考虑以下 DOM 结构。

```html
<label>Password <input type="password" /></label>

```

您可以在通过标签文本定位后填充输入框：

```java
page.getByLabel("Password").fill("secret");
```

:::note[何时使用标签定位器]

在定位表单字段时使用此定位器。
:::

### 通过占位符定位

输入框可能有占位符属性来提示用户应输入什么值。您可以使用 [`page.getByPlaceholder()`](/java/api/class-page#page-get-by-placeholder) 定位此类输入框。

例如，考虑以下 DOM 结构。

```html
<input type="email" placeholder="name@example.com" />
```

您可以在通过占位符文本定位后填充输入框：

```java
page.getByPlaceholder("name@example.com").fill("playwright@microsoft.com");
```

:::note[何时使用占位符定位器]

在定位没有标签但有占位符文本的表单元素时使用此定位器。
:::

### 通过文本定位

通过元素包含的文本查找元素。使用 [`page.getByText()`](/java/api/class-page#page-get-by-text) 时可以按子字符串、精确字符串或正则表达式匹配。

例如，考虑以下 DOM 结构。

```html
<span>Welcome, John</span>
```

您可以通过元素包含的文本定位它：

```java
assertThat(page.getByText("Welcome, John")).isVisible();
```

设置精确匹配：

```java
assertThat(page
    .getByText("Welcome, John", new Page.GetByTextOptions().setExact(true)))
    .isVisible();
```

使用正则表达式匹配：

```java
assertThat(page
    .getByText(Pattern.compile("welcome, john$", Pattern.CASE_INSENSITIVE)))
    .isVisible();
```

::: info
按文本匹配始终会规范化空白，即使是精确匹配也是如此。例如，它会将多个空格转换为一个，将换行符转换为空格，并忽略前导和尾随空白。
:::

:::note[何时使用文本定位器]
我们建议使用文本定位器来查找非交互式元素，如 `div`、`span`、`p` 等。对于交互式元素（如 `button`、`a`、`input` 等），请使用[角色定位器](#locate-by-role)。
:::

您还可以[按文本过滤](#filter-by-text)，这在尝试查找列表中的特定项目时非常有用。

### 通过替代文本定位

所有图片都应该有描述图片的 `alt` 属性。您可以使用 [`page.getByAltText()`](/java/api/class-page#page-get-by-alt-text) 基于替代文本定位图片。

例如，考虑以下 DOM 结构。

```html
<img alt="playwright logo" src="/img/playwright-logo.svg" width="100" />
```

您可以在通过替代文本定位后点击图片：

```java
page.getByAltText("playwright logo").click();
```

:::note[何时使用替代文本定位器]

当元素支持替代文本（如 `img` 和 `area` 元素）时使用此定位器。
:::

### 通过标题定位

使用 [`page.getByTitle()`](/java/api/class-page#page-get-by-title) 定位具有匹配 title 属性的元素。

例如，考虑以下 DOM 结构。

```html
<span title='Issues count'>25 issues</span>
```

您可以在通过标题文本定位后检查问题计数：

```java
assertThat(page.getByTitle("Issues count")).hasText("25 issues");
```

:::note[何时使用标题定位器]

当元素具有 `title` 属性时使用此定位器。
:::

### 通过测试 ID 定位

通过测试 ID 进行测试是最具弹性的测试方式，因为即使属性的文本或角色发生变化，测试仍然会通过。QA 和开发人员应定义显式测试 ID 并使用 [`page.getByTestId()`](/java/api/class-page#page-get-by-test-id) 查询它们。但是，通过测试 ID 进行测试不是面向用户的。如果角色或文本值对您很重要，请考虑使用面向用户的定位器，如[角色](#locate-by-role)和[文本定位器](#locate-by-text)。

例如，考虑以下 DOM 结构。

```html
<button data-testid="directions">Itinéraire</button>
```

您可以通过测试 ID 定位元素：

```java
page.getByTestId("directions").click();
```

:::note[何时使用 testid 定位器]

当您选择使用测试 ID 方法论，或者无法通过[角色](#locate-by-role)或[文本](#locate-by-text)定位时，也可以使用测试 ID。
:::

#### 设置自定义测试 ID 属性

默认情况下，[`page.getByTestId()`](/java/api/class-page#page-get-by-test-id) 将基于 `data-testid` 属性定位元素，但您可以在测试配置中或通过调用 [`selectors.setTestIdAttribute()`](/java/api/class-selectors#selectors-set-test-id-attribute) 来配置它。

设置测试 ID 以使用自定义数据属性进行测试。

```java
playwright.selectors().setTestIdAttribute("data-pw");
```

在您的 HTML 中，您现在可以使用 `data-pw` 作为测试 ID，而不是默认的 `data-testid`。

```html
<button data-pw="directions">Itinéraire</button>
```

然后像往常一样定位元素：

```java
page.getByTestId("directions").click();
```

### 通过 CSS 或 XPath 定位

如果您确实必须使用 CSS 或 XPath 定位器，可以使用 [`page.locator()`](/java/api/class-page#page-locator) 创建一个定位器，该定位器接受描述如何在页面中查找元素的选择器。Playwright 支持 CSS 和 XPath 选择器，如果省略 `css=` 或 `xpath=` 前缀，会自动检测它们。

```java
page.locator("css=button").click();
page.locator("xpath=//button").click();

page.locator("button").click();
page.locator("//button").click();
```

XPath 和 CSS 选择器可能与 DOM 结构或实现绑定。当 DOM 结构发生变化时，这些选择器可能会失效。下面的长 CSS 或 XPath 链是导致测试不稳定的**不良实践**示例：

```java
page.locator(
    "#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input"
).click();

page.locator("//*[@id='tsf']/div[2]/div[1]/div[1]/div/div[2]/input").click();
```

:::note[何时使用此方法]

不推荐使用 CSS 和 XPath，因为 DOM 经常会发生变化，导致测试不稳定。相反，尝试提出接近用户感知页面方式的定位器，如[角色定位器](#locate-by-role)，或使用测试 ID [定义显式测试契约](#locate-by-test-id)。
:::

## 在 Shadow DOM 中定位

Playwright 中的所有定位器**默认**都可以处理 Shadow DOM 中的元素。例外情况是：
- 通过 XPath 定位不会穿透 shadow root。
- 不支持[闭合模式的 shadow root](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters)。

考虑以下使用自定义 Web 组件的示例：

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

您可以像 shadow root 不存在一样进行定位。

点击 `<div>Details</div>`：

```java
page.getByText("Details").click();
```

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

点击 `<x-details>`：

```java
page.locator("x-details", new Page.LocatorOptions().setHasText("Details"))
    .click();
```

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

确保 `<x-details>` 包含文本 "Details"：

```java
assertThat(page.locator("x-details")).containsText("Details");
```

## 过滤定位器

考虑以下 DOM 结构，我们想要点击第二个产品卡的购买按钮。我们有几种选项来过滤定位器以获取正确的元素。

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

可以使用 [`locator.filter()`](/java/api/class-locator#locator-filter) 方法按文本过滤定位器。它将在元素内部某处搜索特定字符串，可能在后代元素中，不区分大小写。您也可以传递正则表达式。

```java
page.getByRole(AriaRole.LISTITEM)
    .filter(new Locator.FilterOptions().setHasText("Product 2"))
    .getByRole(AriaRole.BUTTON,
               new Locator.GetByRoleOptions().setName("Add to cart"))
    .click();
```

使用正则表达式：

```java
page.getByRole(AriaRole.LISTITEM)
    .filter(new Locator.FilterOptions()
        .setHasText(Pattern.compile("Product 2")))
    .getByRole(AriaRole.BUTTON,
               new Locator.GetByRoleOptions().setName("Add to cart"))
    .click();
```

### 按不包含文本过滤

或者，按**不包含**文本过滤：

```java
// 5 个有库存的项目
assertThat(page.getByRole(AriaRole.LISTITEM)
    .filter(new Locator.FilterOptions().setHasNotText("Out of stock")))
    .hasCount(5);
```

### 按子元素/后代元素过滤

定位器支持只选择有或没有匹配另一个定位器的后代元素的选项。因此，您可以通过任何其他定位器进行过滤，如 [`locator.getByRole()`](/java/api/class-locator#locator-get-by-role)、[`locator.getByTestId()`](/java/api/class-locator#locator-get-by-test-id)、[`locator.getByText()`](/java/api/class-locator#locator-get-by-text) 等。

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

```java
page.getByRole(AriaRole.LISTITEM)
    .filter(new Locator.FilterOptions()
        .setHas(page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions()
        .setName("Product 2"))))
    .getByRole(AriaRole.BUTTON,
               new Locator.GetByRoleOptions().setName("Add to cart"))
    .click();
```

我们还可以断言产品卡以确保只有一个：

```java
assertThat(page
    .getByRole(AriaRole.LISTITEM)
    .filter(new Locator.FilterOptions()
        .setHas(page.getByRole(AriaRole.HEADING,
                               new Page.GetByRoleOptions().setName("Product 2")))))
    .hasCount(1);
```

过滤定位器**必须相对于**原始定位器，并从原始定位器匹配开始查询，而不是从文档根开始。因此，以下代码将不起作用，因为过滤定位器从 `<ul>` 列表元素开始匹配，而该元素在原始定位器匹配的 `<li>` 列表项之外：

```java
// ✖ 错误
assertThat(page
    .getByRole(AriaRole.LISTITEM)
    .filter(new Locator.FilterOptions()
        .setHas(page.getByRole(AriaRole.LIST)
                    .getByRole(AriaRole.HEADING,
                               new Locator.GetByRoleOptions().setName("Product 2")))))
    .hasCount(1);
```

### 按不包含子元素/后代元素过滤

我们还可以按内部**没有**匹配元素进行过滤。

```java
assertThat(page
    .getByRole(AriaRole.LISTITEM)
    .filter(new Locator.FilterOptions().setHasNot(page.getByText("Product 2"))))
    .hasCount(1);
```

请注意，内部定位器是从外部定位器开始匹配的，而不是从文档根开始。

## 定位器运算符

### 在定位器内部匹配

您可以链式调用创建定位器的方法，如 [`page.getByText()`](/java/api/class-page#page-get-by-text) 或 [`locator.getByRole()`](/java/api/class-locator#locator-get-by-role)，将搜索范围缩小到页面的特定部分。

在这个示例中，我们首先通过定位角色为 `listitem` 来创建一个名为 product 的定位器。然后按文本过滤。我们可以再次使用 product 定位器通过角色获取按钮并点击它，然后使用断言确保只有一个带有文本 "Product 2" 的产品。

```java
Locator product = page
    .getByRole(AriaRole.LISTITEM)
    .filter(new Locator.FilterOptions().setHasText("Product 2"));

product
    .getByRole(AriaRole.BUTTON,
               new Locator.GetByRoleOptions().setName("Add to cart"))
    .click();
```

您还可以使用 [`locator.within()`](/java/api/class-locator#locator-within) 组合两个定位器，例如在特定对话框中查找"保存"按钮：

```java
Locator saveButton = page.getByRole(AriaRole.BUTTON,
                                    new Page.GetByRoleOptions().setName("Save"));
// ...
Locator dialog = page.getByTestId("settings-dialog");
saveButton.within(dialog).click();
```

### 同时匹配两个定位器

方法 [`locator.and()`](/java/api/class-locator#locator-and) 通过匹配额外的定位器来缩小现有定位器的范围。例如，您可以组合 [`page.getByRole()`](/java/api/class-page#page-get-by-role) 和 [`page.getByTitle()`](/java/api/class-page#page-get-by-title) 以同时按角色和标题匹配。

```java
Locator button = page.getByRole(AriaRole.BUTTON).and(page.getByTitle("Subscribe"));
```

### 匹配两个备选定位器之一

如果您想定位两个或多个元素之一，而您不知道会是哪一个，请使用 [`locator.or()`](/java/api/class-locator#locator-or) 创建一个匹配任一或两个备选项的定位器。

例如，考虑一个场景，您想点击"新邮件"按钮，但有时会出现安全设置对话框。在这种情况下，您可以等待"新邮件"按钮或对话框，并相应地采取行动。

::: info
如果"新邮件"按钮和安全对话框都出现在屏幕上，"or"定位器将匹配它们两个，可能会抛出["严格模式违规"错误](#strictness)。在这种情况下，您可以使用 [`locator.first()`](/java/api/class-locator#locator-first) 只匹配其中一个。
:::

```java
Locator newEmail = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("New"));
Locator dialog = page.getByText("Confirm security settings");
assertThat(newEmail.or(dialog).first()).isVisible();
if (dialog.isVisible())
  page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Dismiss")).click();
newEmail.click();
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
  
  ```java
  page.locator("button").click();
  ```
* 这将只找到第二个按钮，因为它是可见的，然后点击它。
  
  ```java
  page.locator("button").visible().click();
  ```

要改为匹配不可见元素，请使用 [`locator.filter()`](/java/api/class-locator#locator-filter)，并将 [`visible`](/java/api/class-locator#locator-filter-option-visible) 选项设置为 `false`。

## 列表

### 统计列表中的项目数

您可以断言定位器以统计列表中的项目数。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

使用 count 断言确保列表有 3 个项目。

```java
assertThat(page.getByRole(AriaRole.LISTITEM)).hasCount(3);
```

### 断言列表中的所有文本

您可以断言定位器以查找列表中的所有文本。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

使用 [`locatorAssertions.hasText()`](/java/api/class-locatorassertions#locator-assertions-to-have-text) 确保列表包含文本 "apple"、"banana" 和 "orange"。

```java
assertThat(page
    .getByRole(AriaRole.LISTITEM))
    .hasText(new String[] { "apple", "banana", "orange" });
```

### 获取特定项目

有多种方法可以获取列表中的特定项目。

#### 通过文本获取

使用 [`page.getByText()`](/java/api/class-page#page-get-by-text) 方法通过文本内容在列表中定位元素，然后点击它。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

通过文本内容定位项目并点击它。

```java
page.getByText("orange").click();
```

#### 按文本过滤

使用 [`locator.filter()`](/java/api/class-locator#locator-filter) 在列表中定位特定项目。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

通过角色 "listitem" 定位项目，然后按文本 "orange" 过滤，然后点击它。

```java
page.getByRole(AriaRole.LISTITEM)
    .filter(new Locator.FilterOptions().setHasText("orange"))
    .click();
```

#### 通过测试 ID 获取

使用 [`page.getByTestId()`](/java/api/class-page#page-get-by-test-id) 方法在列表中定位元素。如果您还没有测试 ID，可能需要修改 HTML 并添加测试 ID。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li data-testid='apple'>apple</li>
  <li data-testid='banana'>banana</li>
  <li data-testid='orange'>orange</li>
</ul>
```

通过测试 ID "orange" 定位项目，然后点击它。

```java
page.getByTestId("orange").click();
```

#### 通过第 n 个项目获取

如果您有一个相同元素的列表，而区分它们的唯一方式是顺序，您可以使用 [`locator.first()`](/java/api/class-locator#locator-first)、[`locator.last()`](/java/api/class-locator#locator-last) 或 [`locator.nth()`](/java/api/class-locator#locator-nth) 从列表中选择特定元素。

```java
Locator banana = page.getByRole(AriaRole.LISTITEM).nth(1);
```

但是，请谨慎使用此方法。很多时候，页面可能会发生变化，定位器将指向与您预期完全不同的元素。相反，尝试提出一个能通过[严格性标准](#strictness)的唯一定位器。

### 链式过滤

当您有具有各种相似性的元素时，可以使用 [`locator.filter()`](/java/api/class-locator#locator-filter) 方法选择正确的元素。您还可以链式调用多个过滤器来缩小选择范围。

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

```java
Locator rowLocator = page.getByRole(AriaRole.LISTITEM);

rowLocator
    .filter(new Locator.FilterOptions().setHasText("Mary"))
    .filter(new Locator.FilterOptions()
        .setHas(page.getByRole(
            AriaRole.BUTTON,
            new Page.GetByRoleOptions().setName("Say goodbye"))))
    .screenshot(new Locator.ScreenshotOptions().setPath(Paths.get("screenshot.png")));
```

现在您的项目根目录中应该有一个 "screenshot.png" 文件。

### 少见用例

#### 对列表中的每个元素执行操作

迭代元素：

```java
for (Locator row : page.getByRole(AriaRole.LISTITEM).all())
  System.out.println(row.textContent());
```

使用常规 for 循环迭代：

```java
Locator rows = page.getByRole(AriaRole.LISTITEM);
int count = rows.count();
for (int i = 0; i < count; ++i)
  System.out.println(rows.nth(i).textContent());
```

#### 在页面中求值

[`locator.evaluateAll()`](/java/api/class-locator#locator-evaluate-all) 内部的代码在页面中运行，您可以在那里调用任何 DOM API。

```java
Locator rows = page.getByRole(AriaRole.LISTITEM);
Object texts = rows.evaluateAll(
    "list => list.map(element => element.textContent)");
```

## 严格性

定位器是严格的。这意味着所有暗示某个目标 DOM 元素的定位器操作，如果匹配多个元素，将抛出异常。例如，如果 DOM 中有多个按钮，以下调用将抛出：

#### 如果有多个则抛出错误

```java
page.getByRole(AriaRole.BUTTON).click();
```

另一方面，Playwright 理解您何时执行多元素操作，因此当定位器解析为多个元素时，以下调用完全正常工作。

#### 多个元素正常工作

```java
page.getByRole(AriaRole.BUTTON).count();
```

您可以通过告诉 Playwright 当多个元素匹配时使用哪个元素，来显式地选择不进行严格性检查，方法是使用 [`locator.first()`](/java/api/class-locator#locator-first)、[`locator.last()`](/java/api/class-locator#locator-last) 和 [`locator.nth()`](/java/api/class-locator#locator-nth)。**不推荐**使用这些方法，因为当页面发生变化时，Playwright 可能会点击您不希望的元素。相反，请遵循上述最佳实践来创建唯一标识目标元素的定位器。

## 更多定位器

有关较少使用的定位器，请查看[其他定位器](./other-locators.md)指南。
