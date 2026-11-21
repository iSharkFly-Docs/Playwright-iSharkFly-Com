---
title: "其他定位器"
---

# 其他定位器

## 简介

::: info
查看主要的[定位器指南](./locators)了解最常用和推荐的定位器。
:::

除了推荐的定位器如 [`page.getByRole()`](/java/api/class-page#page-get-by-role) 和 [`page.getByText()`](/java/api/class-page#page-get-by-text)，Playwright 还支持本指南中描述的各种其他定位器。

## CSS 定位器

::: info
我们建议优先使用[用户可见的定位器](./locators.md#quick-guide)，如文本或可访问角色，而不是使用与实现绑定的 CSS，因为页面更改时可能会出问题。
:::

Playwright 可以通过 CSS 选择器定位元素。

```java
page.locator("css=button").click();
```

Playwright 以两种方式增强了标准 CSS 选择器：
* CSS 选择器可以穿透开放的 shadow DOM。
* Playwright 添加了自定义伪类，如 `:visible`、`:has-text()`、`:has()`、`:is()`、`:nth-match()` 等。

### CSS：通过文本匹配

Playwright 包含多个 CSS 伪类来通过文本内容匹配元素。
- `article:has-text("Playwright")` - `:has-text()` 匹配任何在内部某处（可能在子元素或后代元素中）包含指定文本的元素。匹配不区分大小写，会修剪空白并搜索子字符串。
  
  例如，`article:has-text("Playwright")` 匹配 `<article><div>Playwright</div></article>`。
  
  注意 `:has-text()` 应该与其他 CSS 选择器一起使用，否则它将匹配所有包含指定文本的元素，包括 `<body>`。
  
  ```java
  // 错误，将匹配许多元素，包括 <body>
  page.locator(":has-text(\"Playwright\")").click();
  // 正确，只匹配 <article> 元素
  page.locator("article:has-text(\"Playwright\")").click();
  ```
- `#nav-bar :text("Home")` - `:text()` 伪类匹配包含指定文本的最小元素。匹配不区分大小写，会修剪空白并搜索子字符串。
  
  例如，这将在 `#nav-bar` 元素内部找到一个包含文本 "Home" 的元素：
  
  ```java
  page.locator("#nav-bar :text('Home')").click();
  ```
- `#nav-bar :text-is("Home")` - `:text-is()` 伪类匹配具有精确文本的最小元素。精确匹配区分大小写，会修剪空白并搜索完整字符串。
  
  例如，`:text-is("Log")` 不匹配 `<button>Log in</button>`，因为 `<button>` 包含一个不等于 `"Log"` 的单个文本节点 `"Log in"`。但是，`:text-is("Log")` 匹配 `<button> Log <span>in</span></button>`，因为 `<button>` 包含一个文本节点 `" Log "`。
  
  类似地，`:text-is("Download")` 不会匹配 `<button>download</button>`，因为它区分大小写。
* `#nav-bar :text-matches("reg?ex", "i")` - `:text-matches()` 伪类匹配文本内容与 [JavaScript 风格正则表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)匹配的最小元素。
  
  例如，`:text-matches("Log\s*in", "i")` 匹配 `<button>Login</button>` 和 `<button>log IN</button>`。

::: info
文本匹配总是会规范化空白。例如，它将多个空格转换为一个，将换行符转换为空格，并忽略前导和尾随空白。
:::

::: info
类型为 `button` 和 `submit` 的输入元素通过其 `value` 而不是文本内容进行匹配。例如，`:text("Log in")` 匹配 `<input type=button value="Log in">`。
:::

### CSS：仅匹配可见元素

Playwright 在 CSS 选择器中支持 `:visible` 伪类。例如，`css=button` 匹配页面上的所有按钮，而 `css=button:visible` 只匹配可见按钮。这对于区分非常相似但可见性不同的元素很有用。

::: info
优先使用 [`locator.visible()`](/java/api/class-locator#locator-visible) 快捷方式而不是 `:visible` 伪类。
:::

考虑一个有两个按钮的页面，第一个不可见，第二个可见。

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
  page.locator("button:visible").click();
  ```

### CSS：包含其他元素的元素

`:has()` 伪类是一个 [CSS 伪类](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)。如果作为参数传递的任何选择器相对于给定元素的 `:scope` 至少匹配一个元素，它就返回该元素。

以下代码片段返回内部有 `<div class=promo>` 的 `<article>` 元素的文本内容。

```java
page.locator("article:has(div.promo)").textContent();
```

### CSS：匹配条件之一的元素

以逗号分隔的 CSS 选择器列表将匹配所有可以被该列表中任一选择器选中的元素。

```java
// 点击具有 "Log in" 或 "Sign in" 文本的 <button>。
page.locator("button:has-text(\"Log in\"), button:has-text(\"Sign in\")").click();
```

`:is()` 伪类是一个 [CSS 伪类](https://developer.mozilla.org/en-US/docs/Web/CSS/:is)，可用于在元素上指定额外条件列表。

### CSS：基于布局匹配元素

::: warning
布局选择器已弃用，可能会在将来移除。基于布局的匹配可能会产生意外结果。例如，当布局改变一个像素时，可能会匹配到不同的元素。

我们建议优先使用[用户可见的定位器](./locators.md#quick-guide)。
:::

有时，当目标元素缺乏独特特征时，很难找到一个好的选择器。在这种情况下，使用 Playwright 布局 CSS 伪类可能会有帮助。这些可以与常规 CSS 结合使用，从多个选择中精确定位一个。

例如，`input:right-of(:text("Password"))` 匹配文本 "Password" 右侧的输入字段 - 当页面有多个难以区分的输入时很有用。

请注意，布局伪类作为其他选择器的补充很有用，比如 `input`。如果你单独使用布局伪类，比如 `:right-of(:text("Password"))`，很可能你得到的不是你要找的输入，而是文本和目标输入之间的某个空元素。

布局伪类使用[边界客户端矩形](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)来计算元素的距离和相对位置。
* `:right-of(div > button)` - 匹配在任何匹配内部选择器的元素右侧、任何垂直位置的元素。
* `:left-of(div > button)` - 匹配在任何匹配内部选择器的元素左侧、任何垂直位置的元素。
* `:above(div > button)` - 匹配在任何匹配内部选择器的元素上方、任何水平位置的元素。
* `:below(div > button)` - 匹配在任何匹配内部选择器的元素下方、任何水平位置的元素。
* `:near(div > button)` - 匹配在任何匹配内部选择器的元素附近（50 CSS 像素以内）的元素。

请注意，结果匹配按与锚元素的距离排序，因此你可以使用 [`locator.first()`](/java/api/class-locator#locator-first) 来选择最近的一个。这仅在你有类似元素列表且最近的明显是正确的时候才有用。然而，在其他情况下使用 [`locator.first()`](/java/api/class-locator#locator-first) 很可能不会按预期工作 - 它不会定位你正在搜索的元素，而是一些恰好最近的其他元素，比如一个随机的空 `<div>`，或一个滚动出去当前不可见的元素。

```java
// 填充 "Username" 右侧的输入。
page.locator("input:right-of(:text(\"Username\"))").fill("value");

// 点击促销卡片附近的按钮。
page.locator("button:near(.promo-card)").click();

// 点击列表中最接近 "Label 3" 的单选输入。
page.locator("[type=radio]:left-of(:text(\"Label 3\"))").first().click();
```

所有布局伪类都支持可选的最大像素距离作为最后一个参数。例如，`button:near(:text("Username"), 120)` 匹配距离文本 "Username" 的元素最多 120 CSS 像素的按钮。

### CSS：从查询结果中选择第 n 个匹配项

::: info
通常可以通过某些属性或文本内容来区分元素，这对页面更改更具弹性。
:::

有时页面包含多个相似的元素，很难选择特定的一个。例如：

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

在这种情况下，`:nth-match(:text("Buy"), 3)` 将从上面的代码片段中选择第三个按钮。请注意，索引从一开始。

```java
// 点击第三个 "Buy" 按钮
page.locator(":nth-match(:text('Buy'), 3)").click();
```

`:nth-match()` 还可用于使用 [`locator.waitFor()`](/java/api/class-locator#locator-wait-for) 等待指定数量的元素出现。

```java
// 等待所有三个按钮都可见
page.locator(":nth-match(:text('Buy'), 3)").waitFor();
```

::: info
与 [`:nth-child()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child) 不同，元素不必是兄弟元素，它们可以在页面的任何位置。在上面的代码片段中，所有三个按钮都匹配 `:text("Buy")` 选择器，`:nth-match()` 选择第三个按钮。
:::

## 第 N 个元素定位器

你可以使用 `nth=` 定位器传递从零开始的索引来将查询缩小到第 n 个匹配项。

```java
// 点击第一个按钮
page.locator("button").locator("nth=0").click();

// 点击最后一个按钮
page.locator("button").locator("nth=-1").click();
```

## 父元素定位器

当你需要定位某个其他元素的父元素时，大多数时候你应该通过子定位器进行 [`locator.filter()`](/java/api/class-locator#locator-filter)。例如，考虑以下 DOM 结构：

```html
<li><label>Hello</label></li>
<li><label>World</label></li>
```

如果你想定位文本为 `"Hello"` 的标签的父 `<li>`，使用 [`locator.filter()`](/java/api/class-locator#locator-filter) 效果最好：

```java
Locator child = page.getByText("Hello");
Locator parent = page.getByRole(AriaRole.LISTITEM).filter(new Locator.FilterOptions().setHas(child));
```

或者，如果你找不到父元素的合适定位器，可以使用 `xpath=..`。请注意，这种方法不太可靠，因为对 DOM 结构的任何更改都会破坏你的测试。尽可能优先使用 [`locator.filter()`](/java/api/class-locator#locator-filter)。

```java
Locator parent = page.getByText("Hello").locator("xpath=..");
```

## XPath 定位器

::: warning
我们建议优先使用[用户可见的定位器](./locators.md#quick-guide)，如文本或可访问角色，而不是使用与实现绑定且页面更改时容易出问题的 XPath。
:::

XPath 定位器等效于调用 [`Document.evaluate`](https://developer.mozilla.org/en/docs/Web/API/Document/evaluate)。

```java
page.locator("xpath=//button").click();
```

::: info
任何以 `//` 或 `..` 开头的选择器字符串都被假定为 xpath 选择器。例如，Playwright 将 `'//html/body'` 转换为 `'xpath=//html/body'`。
:::

::: info
XPath 不穿透 shadow root。
:::

### XPath 联合

管道运算符 (`|`) 可用于在 XPath 中指定多个选择器。它将匹配所有可以被该列表中任一选择器选中的元素。

```java
// 等待确认对话框或加载旋转器。
page.locator("//span[contains(@class, 'spinner__loading')]|//div[@id='confirmation']").waitFor();
```

## 标签到表单控件的重定向

::: warning
我们建议[通过标签文本定位](./locators.md#locate-by-label)，而不是依赖标签到控件的重定向。
:::

Playwright 中的目标输入操作自动区分标签和控件，因此你可以定位标签来对相关联的控件执行操作。

例如，考虑以下 DOM 结构：`<label for="password">Password:</label><input id="password" type="password">`。你可以使用 [`page.getByText()`](/java/api/class-page#page-get-by-text) 通过 "Password" 文本来定位标签。但是，以下操作将在输入而不是标签上执行：
- [`locator.click()`](/java/api/class-locator#locator-click) 将点击标签并自动聚焦输入字段；
- [`locator.fill()`](/java/api/class-locator#locator-fill) 将填充输入字段；
- [`locator.inputValue()`](/java/api/class-locator#locator-input-value) 将返回输入字段的值；
- [`locator.selectText()`](/java/api/class-locator#locator-select-text) 将选择输入字段中的文本；
- [`locator.setInputFiles()`](/java/api/class-locator#locator-set-input-files) 将为 `type=file` 的输入字段设置文件；
- [`locator.selectOption()`](/java/api/class-locator#locator-select-option) 将从选择框中选择一个选项。

```java
// 通过定位标签来填充输入。
page.getByText("Password").fill("secret");
```

然而，其他方法将定位标签本身，例如 [`locatorAssertions.hasText()`](/java/api/class-locatorassertions#locator-assertions-to-have-text) 将断言标签的文本内容，而不是输入字段。

```java
// 通过定位标签来填充输入。
assertThat(page.locator("label")).hasText("Password");
```

## 传统文本定位器

::: warning
我们建议使用现代的[文本定位器](./locators.md#get-by-text)。
:::

传统文本定位器匹配包含传入文本的元素。

```java
page.locator("text=Log in").click();
```

传统文本定位器有几种变体：
- `text=Log in` - 默认匹配不区分大小写，修剪空白并搜索子字符串。例如，`text=Log` 匹配 `<button>Log in</button>`。
  
  ```java
  page.locator("text=Log in").click();
  ```
- `text="Log in"` - 文本主体可以用单引号或双引号转义，以在修剪空白后搜索具有精确内容的文本节点。
  
  例如，`text="Log"` 不匹配 `<button>Log in</button>`，因为 `<button>` 包含一个不等于 `"Log"` 的单个文本节点 `"Log in"`。但是，`text="Log"` 匹配 `<button> Log <span>in</span></button>`，因为 `<button>` 包含一个文本节点 `" Log "`。这种精确模式意味着区分大小写的匹配，所以 `text="Download"` 不会匹配 `<button>download</button>`。
  
  带引号的主体遵循通常的转义规则，例如使用 `\"` 在双引号字符串中转义双引号：`text="foo\"bar"`。
  
  ```java
  page.locator("text='Log in'").click();
  ```
- `/Log\s*in/i` - 主体可以是包裹在 `/` 符号中的 [JavaScript 风格正则表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)。例如，`text=/Log\s*in/i` 匹配 `<button>Login</button>` 和 `<button>log IN</button>`。
  
  ```java
  page.locator("text=/Log\\s*in/i").click();
  ```

::: info
以引号（`"` 或 `'`）开头和结尾的字符串选择器被假定为传统文本定位器。例如，`"Log in"` 在内部被转换为 `text="Log in"`。
:::

::: info
匹配总是规范化空白。例如，它将多个空格转换为一个，将换行符转换为空格，并忽略前导和尾随空白。
:::

::: info
类型为 `button` 和 `submit` 的输入元素通过其 `value` 而不是文本内容进行匹配。例如，`text=Log in` 匹配 `<input type=button value="Log in">`。
:::

## id、data-testid、data-test-id、data-test 选择器

::: warning
我们建议[通过测试 ID 定位](./locators.md#locate-by-test-id)。
:::

Playwright 支持使用某些属性选择元素的简写。目前，仅支持以下属性：
- `id`
- `data-testid`
- `data-test-id`
- `data-test`

```java
// 填充 id 为 "username" 的输入
page.locator("id=username").fill("value");

// 点击 data-test-id 为 "submit" 的元素
page.locator("data-test-id=submit").click();
```

::: info
属性选择器不是 CSS 选择器，因此不支持任何 CSS 特定的东西，如 `:enabled`。要使用更多功能，请使用正确的 [css](#css-定位器) 选择器，例如 `css=[data-test="login"]:enabled`。
:::

## 链接选择器

::: warning
我们建议[链接定位器](./locators.md#matching-inside-a-locator)。
:::

定义为 `engine=body` 或简写形式的选择器可以与 `>>` 标记组合，例如 `selector1 >> selector2 >> selectors3`。当选择器被链接时，下一个选择器相对于前一个的结果进行查询。

例如，

```txt
css=article >> css=.bar > .baz >> css=span[attr=value]
```

等效于

如果选择器需要在主体中包含 `>>`，则应在字符串内转义以免与链接分隔符混淆，例如 `text="some >> text"`。

### 中间匹配

::: warning
我们建议[通过另一个定位器过滤](./locators.md#filter-by-childdescendant)来定位包含其他元素的元素。
:::

默认情况下，链接选择器解析为由最后一个选择器查询的元素。选择器可以用 `*` 前缀来捕获由中间选择器查询的元素。

例如，`css=article >> text=Hello` 捕获具有文本 `Hello` 的元素，而 `*css=article >> text=Hello`（注意 `*`）捕获包含某个具有文本 `Hello` 的元素的 `article` 元素。
