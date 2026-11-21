---
title: "其他定位器"
---

# 其他定位器

## 简介

::: info
查看主要的[定位器指南](./locators)了解最常用和推荐的定位器。
:::

除了推荐的定位器如 [`Page.GetByRole()`](/dotnet/api/class-page#page-get-by-role) 和 [`Page.GetByText()`](/dotnet/api/class-page#page-get-by-text) 之外，Playwright 还支持本指南中描述的各种其他定位器。

## CSS 定位器

::: info
我们建议优先使用[用户可见的定位器](./locators.md#quick-guide)如文本或可访问角色，而不是使用与实现绑定的 CSS，因为当页面更改时可能会中断。
:::

Playwright 可以通过 CSS 选择器定位元素。

```csharp
await page.Locator("css=button").ClickAsync();
```

Playwright 以两种方式增强了标准 CSS 选择器：
* CSS 选择器穿透开放的 shadow DOM。
* Playwright 添加了自定义伪类如 `:visible`、`:has-text()`、`:has()`、`:is()`、`:nth-match()` 等。

### CSS：通过文本匹配

Playwright 包含许多 CSS 伪类来通过文本内容匹配元素。
- `article:has-text("Playwright")` - `:has-text()` 匹配任何在内部某处包含指定文本的元素，可能在子元素或后代元素中。匹配不区分大小写，修剪空白并搜索子字符串。
  
  例如，`article:has-text("Playwright")` 匹配 `<article><div>Playwright</div></article>`。
  
  注意 `:has-text()` 应该与其他 CSS 说明符一起使用，否则它将匹配所有包含指定文本的元素，包括 `<body>`。
  
  ```csharp
  // 错误，将匹配许多元素包括 <body>
  await page.Locator(":has-text(\"Playwright\")").ClickAsync();
  // 正确，只匹配 <article> 元素
  await page.Locator("article:has-text(\"Playwright\")").ClickAsync();
  ```
- `#nav-bar :text("Home")` - `:text()` 伪类匹配包含指定文本的最小元素。匹配不区分大小写，修剪空白并搜索子字符串。
  
  例如，这将在 `#nav-bar` 元素内部某处找到一个包含文本 "Home" 的元素：
  
  ```csharp
  await page.Locator("#nav-bar :text('Home')").ClickAsync();
  ```
- `#nav-bar :text-is("Home")` - `:text-is()` 伪类匹配具有精确文本的最小元素。精确匹配区分大小写，修剪空白并搜索完整字符串。
  
  例如，`:text-is("Log")` 不匹配 `<button>Log in</button>` 因为 `<button>` 包含一个单独的文本节点 `"Log in"` 不等于 `"Log"`。然而，`:text-is("Log")` 匹配 `<button> Log <span>in</span></button>`，因为 `<button>` 包含一个文本节点 `" Log "`。
  
  类似地，`:text-is("Download")` 不会匹配 `<button>download</button>` 因为它区分大小写。
* `#nav-bar :text-matches("reg?ex", "i")` - `:text-matches()` 伪类匹配文本内容与 [JavaScript 风格正则表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) 匹配的最小元素。
  
  例如，`:text-matches("Log\s*in", "i")` 匹配 `<button>Login</button>` 和 `<button>log IN</button>`。

::: info
文本匹配总是规范化空白。例如，它将多个空格转换为一个，将换行符转换为空格，并忽略前导和尾随空白。
:::

::: info
类型为 `button` 和 `submit` 的输入元素通过其 `value` 而不是文本内容来匹配。例如，`:text("Log in")` 匹配 `<input type=button value="Log in">`。
:::

### CSS：仅匹配可见元素

Playwright 在 CSS 选择器中支持 `:visible` 伪类。例如，`css=button` 匹配页面上的所有按钮，而 `css=button:visible` 只匹配可见按钮。这对于区分非常相似但在可见性上不同的元素很有用。

::: info
优先使用 [`Locator.Visible()`](/dotnet/api/class-locator#locator-visible) 快捷方式而不是 `:visible` 伪类。
:::

考虑一个有两个按钮的页面，第一个不可见，第二个可见。

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
  await page.Locator("button:visible").ClickAsync();
  ```

### CSS：包含其他元素的元素

`:has()` 伪类是一个 [CSS 伪类](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)。如果传递的任何选择器相对于给定元素的 `:scope` 匹配至少一个元素，它就返回该元素。

以下代码片段返回内部有 `<div class=promo>` 的 `<article>` 元素的文本内容。

```csharp
await page.Locator("article:has(div.promo)").TextContentAsync();
```

### CSS：匹配条件之一的元素

以逗号分隔的 CSS 选择器列表将匹配可以由该列表中的任一选择器选择的所有元素。

```csharp
// 点击具有 "Log in" 或 "Sign in" 文本的 <button>。
await page.Locator("button:has-text(\"Log in\"), button:has-text(\"Sign in\")").ClickAsync();
```

`:is()` 伪类是一个 [CSS 伪类](https://developer.mozilla.org/en-US/docs/Web/CSS/:is)，可用于在元素上指定额外条件列表。

### CSS：基于布局匹配元素

::: warning
布局选择器已弃用，可能在未来被移除。基于布局的匹配可能产生意外结果。例如，当布局变化一个像素时，可能会匹配不同的元素。

我们建议优先使用[用户可见的定位器](./locators.md#quick-guide)。
:::

有时，当目标元素缺乏独特特征时，很难找到一个好的选择器。在这种情况下，使用 Playwright 布局 CSS 伪类可能会有帮助。这些可以与常规 CSS 结合使用来精确定位多个选择中的一个。

例如，`input:right-of(:text("Password"))` 匹配在文本 "Password" 右边的输入字段 - 当页面有多个难以区分的输入时很有用。

注意布局伪类作为其他东西的补充很有用，比如 `input`。如果你单独使用布局伪类，如 `:right-of(:text("Password"))`，你很可能不会得到你要找的输入，而是文本和目标输入之间的某个空元素。

布局伪类使用[边界客户端矩形](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)来计算元素的距离和相对位置。
* `:right-of(div > button)` - 匹配在任何匹配内部选择器的元素右边的元素，在任何垂直位置。
* `:left-of(div > button)` - 匹配在任何匹配内部选择器的元素左边的元素，在任何垂直位置。
* `:above(div > button)` - 匹配在任何匹配内部选择器的元素上方的元素，在任何水平位置。
* `:below(div > button)` - 匹配在任何匹配内部选择器的元素下方的元素，在任何水平位置。
* `:near(div > button)` - 匹配在任何匹配内部选择器的元素附近（50 CSS 像素内）的元素。

注意结果匹配是按照它们与锚元素的距离排序的，所以你可以使用 [`Locator.First()`](/dotnet/api/class-locator#locator-first) 来选择最近的一个。这只在你有类似元素列表的情况下有用，其中最近的显然是正确的。然而，在其他情况下使用 [`Locator.First()`](/dotnet/api/class-locator#locator-first) 很可能不会按预期工作 - 它不会定位你要搜索的元素，而是某个恰好是最近的其他元素，如一个随机的空 `<div>`，或一个滚动出去当前不可见的元素。

```csharp
// 填写 "Username" 右边的输入。
await page.Locator("input:right-of(:text(\"Username\"))").FillAsync("value");

// 点击促销卡附近的按钮。
await page.Locator("button:near(.promo-card)").ClickAsync();

// 点击列表中最靠近 "Label 3" 的单选输入。
await page.Locator("[type=radio]:left-of(:text(\"Label 3\"))").First.ClickAsync();
```

所有布局伪类支持可选的最大像素距离作为最后一个参数。例如 `button:near(:text("Username"), 120)` 匹配距离带有文本 "Username" 的元素最多 120 CSS 像素远的按钮。

### CSS：从查询结果中选择第 n 个匹配

::: info
通常可以通过某些属性或文本内容来区分元素，这对页面更改更具弹性。
:::

有时页面包含许多类似的元素，很难选择特定的一个。例如：

```html
<section>
  <button>Buy</button>
</section>
<article>
  <div>
    <button>Buy</button>
  </div>
</article>
<div>
  <div>
    <button>Buy</button>
  </div>
</div>
```

在这种情况下，`:nth-match(:text("Buy"), 3)` 将从上面的代码片段中选择第三个按钮。注意索引是从一开始的。

```csharp
// 点击第三个 "Buy" 按钮
await page.Locator(":nth-match(:text('Buy'), 3)").ClickAsync();
```

`:nth-match()` 对于等待指定数量的元素出现也很有用，使用 [`Locator.WaitForAsync()`](/dotnet/api/class-locator#locator-wait-for)。

```csharp
// 等待直到所有三个按钮都可见
await page.Locator(":nth-match(:text('Buy'), 3)").WaitForAsync();
```

::: info
与 [`:nth-child()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child) 不同，元素不必是兄弟元素，它们可以在页面上的任何位置。在上面的代码片段中，所有三个按钮都匹配 `:text("Buy")` 选择器，而 `:nth-match()` 选择第三个按钮。
:::

## 第 N 个元素定位器

你可以使用 `nth=` 定位器传递从零开始的索引来将查询缩小到第 n 个匹配。

```csharp
// 点击第一个按钮
await page.Locator("button").Locator("nth=0").ClickAsync();

// 点击最后一个按钮
await page.Locator("button").Locator("nth=-1").ClickAsync();
```

## 父元素定位器

当你需要定位另一个元素的父元素时，大多数时候你应该通过子定位器使用 [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter)。例如，考虑以下 DOM 结构：

```html
<li><label>Hello</label></li>
<li><label>World</label></li>
```

如果你想定位带有文本 `"Hello"` 的标签的父 `<li>`，使用 [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter) 效果最好：

```csharp
var child = page.GetByText("Hello");
var parent = page.GetByRole(AriaRole.Listitem).Filter(new () { Has = child });
```

或者，如果你无法为父元素找到合适的定位器，使用 `xpath=..`。注意这种方法不太可靠，因为 DOM 结构的任何更改都会破坏你的测试。尽可能优先使用 [`Locator.Filter()`](/dotnet/api/class-locator#locator-filter)。

```csharp
var parent = page.GetByText("Hello").Locator("xpath=..");
```

## XPath 定位器

::: warning
我们建议优先使用[用户可见的定位器](./locators.md#quick-guide)如文本或可访问角色，而不是使用与实现绑定的 XPath，因为当页面更改时容易中断。
:::

XPath 定位器等同于调用 [`Document.evaluate`](https://developer.mozilla.org/en/docs/Web/API/Document/evaluate)。

```csharp
await page.Locator("xpath=//button").ClickAsync();
```

::: info
任何以 `//` 或 `..` 开头的选择器字符串都被假定为 xpath 选择器。例如，Playwright 将 `'//html/body'` 转换为 `'xpath=//html/body'`。
:::

::: info
XPath 不穿透 shadow roots。
:::

### XPath 联合

管道运算符 (`|`) 可用于在 XPath 中指定多个选择器。它将匹配可以由该列表中的任一选择器选择的所有元素。

```csharp
// 等待确认对话框或加载旋转器。
await page.Locator("//span[contains(@class, 'spinner__loading')]|//div[@id='confirmation']").WaitForAsync();
```

## 标签到表单控件重定向

::: warning
我们建议[通过标签文本定位](./locators.md#locate-by-label)而不是依赖标签到控件的重定向。
:::

Playwright 中的目标输入操作自动区分标签和控件，因此你可以定位标签来对关联的控件执行操作。

例如，考虑以下 DOM 结构：`<label for="password">Password:</label><input id="password" type="password">`。你可以使用 [`Page.GetByText()`](/dotnet/api/class-page#page-get-by-text) 通过其 "Password" 文本定位标签。然而，以下操作将在输入上执行而不是标签：
- [`Locator.ClickAsync()`](/dotnet/api/class-locator#locator-click) 将点击标签并自动聚焦输入字段；
- [`Locator.FillAsync()`](/dotnet/api/class-locator#locator-fill) 将填写输入字段；
- [`Locator.InputValueAsync()`](/dotnet/api/class-locator#locator-input-value) 将返回输入字段的值；
- [`Locator.SelectTextAsync()`](/dotnet/api/class-locator#locator-select-text) 将选择输入字段中的文本；
- [`Locator.SetInputFilesAsync()`](/dotnet/api/class-locator#locator-set-input-files) 将为 `type=file` 的输入字段设置文件；
- [`Locator.SelectOptionAsync()`](/dotnet/api/class-locator#locator-select-option) 将从选择框中选择一个选项。

```csharp
// 通过定位标签来填写输入。
await page.GetByText("Password").FillAsync("secret");
```

然而，其他方法将定位标签本身，例如 [`LocatorAssertions.ToHaveTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text) 将断言标签的文本内容，而不是输入字段。

```csharp
// 通过定位标签来填写输入。
await Expect(Page.Locator("label")).ToHaveTextAsync("Password");
```

## 旧版文本定位器

::: warning
我们建议使用现代[文本定位器](./locators.md#get-by-text)。
:::

旧版文本定位器匹配包含传递文本的元素。

```csharp
await page.Locator("text=Log in").ClickAsync();
```

旧版文本定位器有几种变体：
- `text=Log in` - 默认匹配不区分大小写，修剪空白并搜索子字符串。例如，`text=Log` 匹配 `<button>Log in</button>`。
  
  ```csharp
  await page.Locator("text=Log in").ClickAsync();
  ```
- `text="Log in"` - 文本主体可以用单引号或双引号转义，以在修剪空白后搜索具有精确内容的文本节点。
  
  例如，`text="Log"` 不匹配 `<button>Log in</button>` 因为 `<button>` 包含一个单独的文本节点 `"Log in"` 不等于 `"Log"`。然而，`text="Log"` 匹配 `<button> Log <span>in</span></button>`，因为 `<button>` 包含一个文本节点 `" Log "`。这种精确模式意味着区分大小写匹配，所以 `text="Download"` 不会匹配 `<button>download</button>`。
  
  引用主体遵循通常的转义规则，例如使用 `\"` 在双引号字符串中转义双引号：`text="foo\"bar"`。
  
  ```csharp
  await page.Locator("text='Log in'").ClickAsync();
  ```
- `/Log\s*in/i` - 主体可以是包裹在 `/` 符号中的 [JavaScript 风格正则表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)。例如，`text=/Log\s*in/i` 匹配 `<button>Login</button>` 和 `<button>log IN</button>`。
  
  ```csharp
  await page.Locator("text=/Log\\s*in/i").ClickAsync();
  ```

::: info
以引号（`"` 或 `'`）开始和结束的字符串选择器被假定为旧版文本定位器。例如，`"Log in"` 在内部被转换为 `text="Log in"`。
:::

::: info
匹配总是规范化空白。例如，它将多个空格转换为一个，将换行符转换为空格，并忽略前导和尾随空白。
:::

::: info
类型为 `button` 和 `submit` 的输入元素通过其 `value` 而不是文本内容来匹配。例如，`text=Log in` 匹配 `<input type=button value="Log in">`。
:::

## id、data-testid、data-test-id、data-test 选择器

::: warning
我们建议[通过测试 id 定位](./locators.md#locate-by-test-id)。
:::

Playwright 支持使用某些属性选择元素的简写。目前，只支持以下属性：
- `id`
- `data-testid`
- `data-test-id`
- `data-test`

```csharp
// 填写 id 为 "username" 的输入
await page.Locator("id=username").FillAsync("value");

// 点击 data-test-id 为 "submit" 的元素
await page.Locator("data-test-id=submit").ClickAsync();
```

::: info
属性选择器不是 CSS 选择器，所以任何 CSS 特定的东西如 `:enabled` 不支持。要获得更多功能，使用适当的 [css](#css-定位器) 选择器，例如 `css=[data-test="login"]:enabled`。
:::

## 链接选择器

::: warning
我们建议[链接定位器](./locators.md#matching-inside-a-locator)。
:::

定义为 `engine=body` 或简写形式的选择器可以与 `>>` 令牌组合，例如 `selector1 >> selector2 >> selectors3`。当选择器被链接时，下一个是相对于前一个的结果进行查询的。

例如，

```txt
css=article >> css=.bar > .baz >> css=span[attr=value]
```

等同于

如果选择器需要在主体中包含 `>>`，它应该在字符串中转义以不与链接分隔符混淆，例如 `text="some >> text"`。

### 中间匹配

::: warning
我们建议[通过另一个定位器过滤](./locators.md#filter-by-childdescendant)来定位包含其他元素的元素。
:::

默认情况下，链接选择器解析为由最后一个选择器查询的元素。选择器可以用 `*` 前缀来捕获由中间选择器查询的元素。

例如，`css=article >> text=Hello` 捕获带有文本 `Hello` 的元素，而 `*css=article >> text=Hello`（注意 `*`）捕获包含某个带有文本 `Hello` 的元素的 `article` 元素。
