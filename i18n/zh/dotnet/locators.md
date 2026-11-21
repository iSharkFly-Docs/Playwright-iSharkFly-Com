---
title: "定位器"
---

# 定位器

## 简介

[Locator](/dotnet/api/class-locator)（定位器）是 Playwright 自动等待和重试能力的核心。简而言之，定位器代表一种在任何时刻在页面上查找元素的方式。

### 快速指南

这些是推荐的内置定位器。
- [`Page.GetByRole()`](#locate-by-role) 通过显式和隐式可访问性属性定位。
- [`Page.GetByText()`](#locate-by-text) 通过文本内容定位。
- [`Page.GetByLabel()`](#locate-by-label) 通过关联标签的文本定位表单控件。
- [`Page.GetByPlaceholder()`](#locate-by-placeholder) 通过占位符定位输入框。
- [`Page.GetByAltText()`](#locate-by-alt-text) 通过替代文本定位元素，通常是图片。
- [`Page.GetByTitle()`](#locate-by-title) 通过 title 属性定位元素。
- [`Page.GetByTestId()`](#locate-by-test-id) 基于 `data-testid` 属性定位元素（可配置其他属性）。

```csharp
await Page.GetByLabel("User Name").FillAsync("John");

await Page.GetByLabel("Password").FillAsync("secret-password");

await Page.GetByRole(AriaRole.Button, new() { Name = "Sign in" }).ClickAsync();

await Expect(Page.GetByText("Welcome, John!")).ToBeVisibleAsync();
```

## 定位元素

Playwright 带有多个内置定位器。为了使测试具有弹性，我们建议优先使用面向用户的属性和显式契约，如 [`Page.GetByRole()`](/dotnet/api/class-page#page-get-by-role)。

例如，考虑以下 DOM 结构。

```html
<button>Sign in</button>
```

通过角色 `button` 和名称 "Sign in" 定位元素。

```csharp
await Page.GetByRole(AriaRole.Button, new() { Name = "Sign in" }).ClickAsync();
```

::: info
使用[代码生成器](./codegen.md)生成定位器，然后根据需要编辑它。
:::

每次使用定位器执行操作时，都会在页面中定位最新的 DOM 元素。在下面的代码片段中，底层 DOM 元素将被定位两次，每次操作前一次。这意味着如果 DOM 在两次调用之间由于重新渲染而发生变化，将使用与定位器对应的新元素。

```csharp
var locator = Page.GetByRole(AriaRole.Button, new() { Name = "Sign in" });

await locator.HoverAsync();
await locator.ClickAsync();
```

请注意，所有创建定位器的方法，如 [`Page.GetByLabel()`](/dotnet/api/class-page#page-get-by-label)，在 [Locator](/dotnet/api/class-locator) 和 [FrameLocator](/dotnet/api/class-framelocator) 类上也可用，因此你可以链式调用它们并逐步缩小定位器的范围。

```csharp
var locator = Page
    .FrameLocator("#my-frame")
    .GetByRole(AriaRole.Button, new() { Name = "Sign in" });

await locator.ClickAsync();
```

### 通过角色定位

[`Page.GetByRole()`](/dotnet/api/class-page#page-get-by-role) 定位器反映了用户和辅助技术感知页面的方式，例如某个元素是按钮还是复选框。通过角色定位时，通常还应传递可访问名称，以便定位器精确定位到确切的元素。

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

```csharp
await Expect(Page
    .GetByRole(AriaRole.Heading, new() { Name = "Sign up" }))
    .ToBeVisibleAsync();

await Page
    .GetByRole(AriaRole.Checkbox, new() { Name = "Subscribe" })
    .CheckAsync();

await Page
    .GetByRole(AriaRole.Button, new() {
        NameRegex = new Regex("submit", RegexOptions.IgnoreCase)
    })
    .ClickAsync();
```

角色定位器包括[按钮、复选框、标题、链接、列表、表格等](https://www.w3.org/TR/html-aria/#docconformance)，并遵循 W3C 关于 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles)、[ARIA 属性](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes)和[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name)的规范。请注意，许多 html 元素如 `<button>` 具有[隐式定义的角色](https://w3c.github.io/html-aam/#html-element-role-mappings)，可以被角色定位器识别。

请注意，角色定位器**不能替代**可访问性审计和合规性测试，而是提供关于 ARIA 指南的早期反馈。

:::note[何时使用角色定位器]

我们建议优先使用角色定位器来定位元素，因为这是最接近用户和辅助技术感知页面的方式。
:::

### 通过标签定位

大多数表单控件通常都有专用标签，可以方便地用于与表单交互。在这种情况下，你可以使用 [`Page.GetByLabel()`](/dotnet/api/class-page#page-get-by-label) 通过关联标签定位控件。

例如，考虑以下 DOM 结构。

```html
<label>Password <input type="password" /></label>

```

你可以在通过标签文本定位后填写输入框：

```csharp
await Page.GetByLabel("Password").FillAsync("secret");
```

:::note[何时使用标签定位器]

在定位表单字段时使用此定位器。
:::

### 通过占位符定位

输入框可能有占位符属性来提示用户应该输入什么值。你可以使用 [`Page.GetByPlaceholder()`](/dotnet/api/class-page#page-get-by-placeholder) 定位这样的输入框。

例如，考虑以下 DOM 结构。

```html
<input type="email" placeholder="name@example.com" />
```

你可以在通过占位符文本定位后填写输入框：

```csharp
await Page
    .GetByPlaceholder("name@example.com")
    .FillAsync("playwright@microsoft.com");
```

:::note[何时使用占位符定位器]

在定位没有标签但有占位符文本的表单元素时使用此定位器。
:::

### 通过文本定位

通过元素包含的文本查找元素。使用 [`Page.GetByText()`](/dotnet/api/class-page#page-get-by-text) 时，你可以通过子字符串、精确字符串或正则表达式进行匹配。

例如，考虑以下 DOM 结构。

```html
<span>Welcome, John</span>
```

你可以通过元素包含的文本定位它：

```csharp
await Expect(Page.GetByText("Welcome, John")).ToBeVisibleAsync();
```

设置精确匹配：

```csharp
await Expect(Page
    .GetByText("Welcome, John", new() { Exact = true }))
    .ToBeVisibleAsync();
```

使用正则表达式匹配：

```csharp
await Expect(Page
    .GetByText(new Regex("welcome, john", RegexOptions.IgnoreCase)))
    .ToBeVisibleAsync();
```

::: info
按文本匹配始终会规范化空白，即使是精确匹配也是如此。例如，它会将多个空格转换为一个，将换行符转换为空格，并忽略前导和尾随空白。
:::

:::note[何时使用文本定位器]
我们建议使用文本定位器来查找非交互元素，如 `div`、`span`、`p` 等。对于交互元素如 `button`、`a`、`input` 等，请使用[角色定位器](#locate-by-role)。
:::

你还可以[按文本过滤](#filter-by-text)，这在尝试查找列表中的特定项时很有用。

### 通过替代文本定位

所有图片都应该有一个描述图片的 `alt` 属性。你可以使用 [`Page.GetByAltText()`](/dotnet/api/class-page#page-get-by-alt-text) 基于替代文本定位图片。

例如，考虑以下 DOM 结构。

```html
<img alt="playwright logo" src="/img/playwright-logo.svg" width="100" />
```

你可以在通过替代文本定位后点击图片：

```csharp
await Page.GetByAltText("playwright logo").ClickAsync();
```

:::note[何时使用替代文本定位器]

当你的元素支持替代文本时使用此定位器，如 `img` 和 `area` 元素。
:::

### 通过 title 定位

使用 [`Page.GetByTitle()`](/dotnet/api/class-page#page-get-by-title) 定位具有匹配 title 属性的元素。

例如，考虑以下 DOM 结构。

```html
<span title='Issues count'>25 issues</span>
```

你可以在通过标题文本定位后检查问题计数：

```csharp
await Expect(Page.GetByTitle("Issues count")).toHaveText("25 issues");
```

:::note[何时使用 title 定位器]

当你的元素具有 `title` 属性时使用此定位器。
:::

### 通过测试 ID 定位

按测试 ID 测试是最具弹性的测试方式，因为即使你的文本或属性角色发生变化，测试仍然会通过。QA 和开发人员应该定义显式的测试 ID 并使用 [`Page.GetByTestId()`](/dotnet/api/class-page#page-get-by-test-id) 查询它们。然而，按测试 ID 测试不是面向用户的。如果角色或文本值对你很重要，那么考虑使用面向用户的定位器，如[角色](#locate-by-role)和[文本定位器](#locate-by-text)。

例如，考虑以下 DOM 结构。

```html
<button data-testid="directions">Itinéraire</button>
```

你可以通过测试 ID 定位元素：

```csharp
await Page.GetByTestId("directions").ClickAsync();
```

:::note[何时使用测试 ID 定位器]

当你选择使用测试 ID 方法论时，或者当你无法通过[角色](#locate-by-role)或[文本](#locate-by-text)定位时，也可以使用测试 ID。
:::

#### 设置自定义测试 ID 属性

默认情况下，[`Page.GetByTestId()`](/dotnet/api/class-page#page-get-by-test-id) 将基于 `data-testid` 属性定位元素，但你可以在测试配置中或通过调用 [`Selectors.SetTestIdAttribute()`](/dotnet/api/class-selectors#selectors-set-test-id-attribute) 来配置它。

设置测试 ID 以使用自定义数据属性进行测试。

```csharp
playwright.Selectors.SetTestIdAttribute("data-pw");
```

在你的 html 中，你现在可以使用 `data-pw` 作为测试 ID 而不是默认的 `data-testid`。

```html
<button data-pw="directions">Itinéraire</button>
```

然后像平常一样定位元素：

```csharp
await Page.GetByTestId("directions").ClickAsync();
```

### 通过 CSS 或 XPath 定位

如果你绝对必须使用 CSS 或 XPath 定位器，你可以使用 [`Page.Locator()`](/dotnet/api/class-page#page-locator) 创建一个定位器，该定位器接受描述如何在页面中查找元素的选择器。Playwright 支持 CSS 和 XPath 选择器，如果省略 `css=` 或 `xpath=` 前缀，会自动检测它们。

```csharp
await Page.Locator("css=button").ClickAsync();
await Page.Locator("xpath=//button").ClickAsync();

await Page.Locator("button").ClickAsync();
await Page.Locator("//button").ClickAsync();
```

XPath 和 CSS 选择器可能与 DOM 结构或实现绑定。当 DOM 结构发生变化时，这些选择器可能会失效。下面的长 CSS 或 XPath 链是导致测试不稳定的**不良实践**示例：

```csharp
await Page.Locator("#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input").ClickAsync();

await Page.Locator("//*[@id='tsf']/div[2]/div[1]/div[1]/div/div[2]/input").ClickAsync();
```

:::note[何时使用此方法]

不推荐使用 CSS 和 XPath，因为 DOM 经常会发生变化，导致测试不稳定。相反，尝试想出一个接近用户感知页面方式的定位器，如[角色定位器](#locate-by-role)，或者使用测试 ID [定义显式测试契约](#locate-by-test-id)。
:::

## 在 Shadow DOM 中定位

Playwright 中的所有定位器**默认**都可以处理 Shadow DOM 中的元素。例外情况是：
- 通过 XPath 定位不会穿透 shadow root。
- 不支持[闭合模式的 shadow root](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters)。

考虑以下带有自定义 Web 组件的示例：

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

你可以像 shadow root 不存在一样进行定位。

要点击 `<div>Details</div>`：

```csharp
await page.GetByText("Details").ClickAsync();
```

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

要点击 `<x-details>`：

```csharp
await page
    .Locator("x-details", new() { HasText = "Details" })
    .ClickAsync();
```

```html
<x-details role=button aria-expanded=true aria-controls=inner-details>
  <div>Title</div>
  #shadow-root
    <div id=inner-details>Details</div>
</x-details>
```

要确保 `<x-details>` 包含文本 "Details"：

```csharp
await Expect(Page.Locator("x-details")).ToContainTextAsync("Details");
```

## 过滤定位器

考虑以下 DOM 结构，我们想要点击第二个产品卡的购买按钮。我们有几个选项来过滤定位器以获取正确的元素。

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

可以使用 [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter) 方法按文本过滤定位器。它将在元素内部某处搜索特定字符串，可能在后代元素中，不区分大小写。你也可以传递正则表达式。

```csharp
await page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() { HasText = "Product 2" })
    .GetByRole(AriaRole.Button, new() { Name = "Add to cart" })
    .ClickAsync();
```

使用正则表达式：

```csharp
await page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() { HasTextRegex = new Regex("Product 2") })
    .GetByRole(AriaRole.Button, new() { Name = "Add to cart" })
    .ClickAsync();
```

### 按不包含文本过滤

或者，按**不包含**文本过滤：

```csharp
// 5 个有货的项目
await Expect(Page.GetByRole(AriaRole.Listitem).Filter(new() { HasNotText = "Out of stock" }))
    .ToHaveCountAsync(5);
```

### 按子元素/后代元素过滤

定位器支持一个选项，只选择具有或不具有匹配另一个定位器的后代元素的元素。因此你可以通过任何其他定位器进行过滤，如 [`Locator.GetByRole()`](/dotnet/api/class-locator#locator-get-by-role)、[`Locator.GetByTestId()`](/dotnet/api/class-locator#locator-get-by-test-id)、[`Locator.GetByText()`](/dotnet/api/class-locator#locator-get-by-text) 等。

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

```csharp
await page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() {
        Has = page.GetByRole(AriaRole.Heading, new() {
            Name = "Product 2"
        })
    })
    .GetByRole(AriaRole.Button, new() { Name = "Add to cart" })
    .ClickAsync();
```

我们还可以断言产品卡以确保只有一个：

```csharp
await Expect(Page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() {
        Has = page.GetByRole(AriaRole.Heading, new() { Name = "Product 2" })
    }))
    .ToHaveCountAsync(1);
```

过滤定位器**必须相对于**原始定位器，并且从原始定位器匹配开始查询，而不是从文档根开始。因此，以下将不起作用，因为过滤定位器从 `<ul>` 列表元素开始匹配，而该元素在原始定位器匹配的 `<li>` 列表项之外：

```csharp
// 错误
await Expect(Page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() {
        Has = page.GetByRole(AriaRole.List).GetByRole(AriaRole.Heading, new() { Name = "Product 2" })
    }))
    .ToHaveCountAsync(1);
```

### 按不包含子元素/后代元素过滤

我们还可以按**不包含**匹配元素进行过滤。

```csharp
await Expect(Page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() {
        HasNot = page.GetByRole(AriaRole.Heading, new() { Name = "Product 2" })
    }))
    .ToHaveCountAsync(1);
```

请注意，内部定位器是从外部定位器开始匹配的，而不是从文档根开始。

## 定位器操作符

### 在定位器内部匹配

你可以链接创建定位器的方法，如 [`Page.GetByText()`](/dotnet/api/class-page#page-get-by-text) 或 [`Locator.GetByRole()`](/dotnet/api/class-locator#locator-get-by-role)，以将搜索范围缩小到页面的特定部分。

在这个示例中，我们首先通过角色 `listitem` 定位来创建一个名为 product 的定位器。然后我们按文本过滤。我们可以再次使用 product 定位器通过角色 button 获取并点击它，然后使用断言确保只有一个文本为 "Product 2" 的产品。

```csharp
var product = page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() { HasText = "Product 2" });

await product
    .GetByRole(AriaRole.Button, new() { Name = "Add to cart" })
    .ClickAsync();
```

你还可以使用 [`Locator.Within()`](/dotnet/api/class-locator#locator-within) 组合两个定位器，例如在特定对话框中查找"Save"按钮：

```csharp
var saveButton = page.GetByRole(AriaRole.Button, new() { Name = "Save" });
// ...
var dialog = page.GetByTestId("settings-dialog");
await saveButton.Within(dialog).ClickAsync();
```

### 同时匹配两个定位器

方法 [`Locator.And()`](/dotnet/api/class-locator#locator-and) 通过匹配附加定位器来缩小现有定位器的范围。例如，你可以组合 [`Page.GetByRole()`](/dotnet/api/class-page#page-get-by-role) 和 [`Page.GetByTitle()`](/dotnet/api/class-page#page-get-by-title) 来同时按角色和标题匹配。

```csharp
var button = page.GetByRole(AriaRole.Button).And(page.GetByTitle("Subscribe"));
```

### 匹配两个备选定位器之一

如果你想定位两个或多个元素之一，而你不知道会是哪一个，使用 [`Locator.Or()`](/dotnet/api/class-locator#locator-or) 创建一个匹配任一或两个备选项的定位器。

例如，考虑一个场景，你想点击"New email"按钮，但有时会出现安全设置对话框。在这种情况下，你可以等待"New email"按钮或对话框并相应地采取行动。

::: info
如果"New email"按钮和安全对话框都出现在屏幕上，"or"定位器将匹配它们两个，可能会抛出["strict mode violation"错误](#strictness)。在这种情况下，你可以使用 [`Locator.First()`](/dotnet/api/class-locator#locator-first) 只匹配其中一个。
:::

```csharp
var newEmail = page.GetByRole(AriaRole.Button, new() { Name = "New" });
var dialog = page.GetByText("Confirm security settings");
await Expect(newEmail.Or(dialog).First).ToBeVisibleAsync();
if (await dialog.IsVisibleAsync())
  await page.GetByRole(AriaRole.Button, new() { Name = "Dismiss" }).ClickAsync();
await newEmail.ClickAsync();
```

### 只匹配可见元素

::: info
通常最好找到一个[更可靠的方式](./locators.md#quick-guide)来唯一标识元素，而不是检查可见性。
:::

考虑一个有两个按钮的页面，第一个不可见，第二个[可见](./actionability.md#visible)。

```html
<button style='display: none'>Invisible</button>
<button>Visible</button>
```
* 这将找到两个按钮并抛出[严格性](./locators.md#strictness)违规错误：
  
  ```csharp
  await page.Locator("button").ClickAsync();
  ```
* 这将只找到第二个按钮，因为它是可见的，然后点击它。
  
  ```csharp
  await page.Locator("button").Visible.ClickAsync();
  ```

要改为匹配不可见元素，使用 [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter) 并将 [`visible`](/dotnet/api/class-locator#locator-filter-option-visible) 选项设置为 `false`。

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

```csharp
await Expect(Page.GetByRole(AriaRole.Listitem)).ToHaveCountAsync(3);
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

使用 [`LocatorAssertions.ToHaveTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text) 确保列表具有文本 "apple"、"banana" 和 "orange"。

```csharp
await Expect(Page
    .GetByRole(AriaRole.Listitem))
    .ToHaveTextAsync(new string[] {"apple", "banana", "orange"});
```

### 获取特定项目

有很多方法可以获取列表中的特定项目。

#### 通过文本获取

使用 [`Page.GetByText()`](/dotnet/api/class-page#page-get-by-text) 方法通过文本内容在列表中定位元素，然后点击它。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

通过文本内容定位项目并点击它。

```csharp
await page.GetByText("orange").ClickAsync();
```

#### 按文本过滤

使用 [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter) 在列表中定位特定项目。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```

通过角色 "listitem" 定位项目，然后按文本 "orange" 过滤，然后点击它。

```csharp
await page
    .GetByRole(AriaRole.Listitem)
    .Filter(new() { HasText = "orange" })
    .ClickAsync();
```

#### 通过测试 ID 获取

使用 [`Page.GetByTestId()`](/dotnet/api/class-page#page-get-by-test-id) 方法在列表中定位元素。如果你还没有测试 ID，可能需要修改 html 并添加测试 ID。

例如，考虑以下 DOM 结构：

```html
<ul>
  <li data-testid='apple'>apple</li>
  <li data-testid='banana'>banana</li>
  <li data-testid='orange'>orange</li>
</ul>
```

通过测试 ID "orange" 定位项目，然后点击它。

```csharp
await page.GetByTestId("orange").ClickAsync();
```

#### 通过第 N 个项目获取

如果你有一个相同元素的列表，区分它们的唯一方法是顺序，你可以使用 [`Locator.First()`](/dotnet/api/class-locator#locator-first)、[`Locator.Last()`](/dotnet/api/class-locator#locator-last) 或 [`Locator.Nth()`](/dotnet/api/class-locator#locator-nth) 从列表中选择特定元素。

```csharp
var banana = await page.GetByRole(AriaRole.Listitem).Nth(1);
```

但是，请谨慎使用此方法。通常，页面可能会发生变化，定位器将指向与你预期完全不同的元素。相反，尝试想出一个能够通过[严格性标准](#strictness)的唯一定位器。

### 链式过滤器

当你有具有各种相似性的元素时，你可以使用 [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter) 方法选择正确的一个。你还可以链接多个过滤器来缩小选择范围。

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

```csharp
var rowLocator = page.GetByRole(AriaRole.Listitem);

await rowLocator
    .Filter(new() { HasText = "Mary" })
    .Filter(new() {
        Has = page.GetByRole(AriaRole.Button, new() { Name = "Say goodbye" })
    })
    .ScreenshotAsync(new() { Path = "screenshot.png" });
```

你现在应该在项目根目录中有一个 "screenshot.png" 文件。

### 罕见用例

#### 对列表中的每个元素执行操作

迭代元素：

```csharp
foreach (var row in await page.GetByRole(AriaRole.Listitem).AllAsync())
  Console.WriteLine(await row.TextContentAsync());
```

使用常规 for 循环迭代：

```csharp
var rows = page.GetByRole(AriaRole.Listitem);
var count = await rows.CountAsync();
for (int i = 0; i < count; ++i)
  Console.WriteLine(await rows.Nth(i).TextContentAsync());
```

#### 在页面中求值

[`Locator.EvaluateAllAsync()`](/dotnet/api/class-locator#locator-evaluate-all) 内部的代码在页面中运行，你可以在那里调用任何 DOM API。

```csharp
var rows = page.GetByRole(AriaRole.Listitem);
var texts = await rows.EvaluateAllAsync(
    "list => list.map(element => element.textContent)");
```

## 严格性

定位器是严格的。这意味着所有暗示某个目标 DOM 元素的定位器操作如果匹配多个元素将抛出异常。例如，如果 DOM 中有多个按钮，以下调用将抛出异常：

#### 如果超过一个则抛出错误

```csharp
await page.GetByRole(AriaRole.Button).ClickAsync();
```

另一方面，Playwright 理解你何时执行多元素操作，因此当定位器解析为多个元素时，以下调用可以正常工作。

#### 对多个元素正常工作

```csharp
await page.GetByRole(AriaRole.Button).CountAsync();
```

你可以通过告诉 Playwright 当多个元素匹配时使用哪个元素来显式选择退出严格性检查，通过 [`Locator.First()`](/dotnet/api/class-locator#locator-first)、[`Locator.Last()`](/dotnet/api/class-locator#locator-last) 和 [`Locator.Nth()`](/dotnet/api/class-locator#locator-nth)。**不推荐**使用这些方法，因为当你的页面发生变化时，Playwright 可能会点击一个你不想要的元素。相反，遵循上面的最佳实践来创建一个唯一标识目标元素的定位器。

## 更多定位器

对于不太常用的定位器，请查看[其他定位器](./other-locators.md)指南。
