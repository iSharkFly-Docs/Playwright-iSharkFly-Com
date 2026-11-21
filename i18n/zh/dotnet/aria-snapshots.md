---
title: "快照测试"
---

# 快照测试

import LiteYouTube from '@site/src/components/LiteYouTube';

## 概述

使用 Playwright 的快照测试，您可以将页面的可访问性树与预定义的快照模板进行断言比较。

```csharp
await page.GotoAsync("https://playwright.dev/");
await Expect(page).ToMatchAriaSnapshotAsync(@"
  - banner:
    - heading ""Playwright enables reliable end-to-end testing for modern web apps."" [level=1]
    - link ""Get started"":
      - /url: /docs/intro
    - link ""Star microsoft/playwright on GitHub"":
      - /url: https://github.com/microsoft/playwright
    - link /[\d]+k\+ stargazers on GitHub/
");
```

<LiteYouTube
id="P4R6hnsE0UY"
title="开始使用 ARIA 快照"
/>

## 断言测试与快照测试的比较

快照测试和断言测试在测试自动化中具有不同的用途：

### 断言测试

断言测试是一种有针对性的方法，用于断言元素或组件的特定值或条件。例如，在 Playwright 中，[`LocatorAssertions.ToHaveTextAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-text)
可以验证元素是否包含预期的文本，[`LocatorAssertions.ToHaveValueAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-have-value)
可以确认输入字段是否具有预期的值。
断言测试是具体的，通常检查元素或属性的当前状态
是否与预期的、预定义的状态相匹配。
它们非常适合可预测的单值检查，但在测试更广泛的
结构或变体时范围有限。

**优点**
- **清晰性**：测试的意图是明确的，易于理解。
- **针对性**：测试专注于功能的特定方面，使其对不相关的变更更加健壮。
- **调试性**：失败时提供有针对性的反馈，直接指向问题所在。

**缺点**
- **对于复杂输出过于冗长**：为复杂数据结构或大型输出编写断言
  可能会很繁琐且容易出错。
- **维护开销**：随着代码的演进，手动更新断言可能会很耗时。

### 快照测试

快照测试捕获元素、组件或数据在给定时刻的"快照"或完整状态表示，
然后保存以供将来比较。重新运行测试时，当前状态会与快照进行比较，如果
有差异，测试就会失败。这种方法对于复杂或动态的
结构特别有用，手动断言每个细节会太耗时。快照测试
比断言测试更广泛、更全面，允许您跟踪随时间推移的更复杂变化。

**优点**
- **简化复杂输出**：例如，使用传统断言测试 UI 组件的渲染输出可能很繁琐。快照可以捕获整个输出以便于比较。
- **快速反馈循环**：开发人员可以轻松发现输出中的意外变化。
- **鼓励一致性**：有助于随着代码演进保持一致的输出。

**缺点**
- **过度依赖**：接受快照更改时可能会不充分理解它们，
  从而可能隐藏错误。
- **粒度**：当出现差异时，大型快照可能难以解释，特别是
  当微小的变化影响大部分输出时。
- **适用性**：不适合高度动态的内容，其中输出经常或
  不可预测地变化。

### 何时使用
- **快照测试**适用于：
  - 整个页面和组件的 UI 测试。
  - 对复杂 UI 组件进行广泛的结构检查。
  - 对结构很少改变的输出进行回归测试。
- **断言测试**适用于：
  - 核心逻辑验证。
  - 计算值测试。
  - 需要精确条件的细粒度测试。

通过将快照测试用于广泛的结构检查，将断言测试用于特定功能，您可以实现全面的测试策略。

## Aria 快照

在 Playwright 中，aria 快照提供了页面可访问性树的 YAML 表示。
这些快照可以存储并在以后进行比较，以验证页面结构是否保持一致或满足定义的
期望。模板是一个约束，不一定是可访问性树的完整序列化。

YAML 格式描述了页面上可访问元素的层次结构，详细说明了 **角色**、**属性**、**值** 和 **文本内容**。
该结构遵循树状语法，其中每个节点代表一个可访问元素，缩进表示
嵌套元素。

树中的每个可访问元素都表示为一个 YAML 节点：

```yaml
- role "name" [attribute=value]
```
- **role**：指定元素的 ARIA 或 HTML 角色（例如 `heading`、`list`、`listitem`、`button`）。
- **"name"**：元素的可访问名称。引号字符串表示精确值，`/patterns/` 用于正则表达式。
- **[attribute=value]**：方括号中的属性和值表示特定的 ARIA 属性，例如
  `checked`、`disabled`、`expanded`、`invalid`、`level`、`pressed`、`required` 或 `selected`。属性可以约束
  特定值，例如 `[pressed=mixed]`。

这些值来自 ARIA 属性或根据 HTML 语义计算。要检查页面的可访问性树
结构，请使用 [Chrome DevTools 可访问性选项卡](https://developer.chrome.com/docs/devtools/accessibility/reference#tab)。

## 快照匹配

Playwright 中的 [`PageAssertions.ToMatchAriaSnapshotAsync()`](/dotnet/api/class-pageassertions#page-assertions-to-match-aria-snapshot) 断言方法将页面的可访问
结构与预定义的 aria 快照模板进行比较，帮助根据
测试要求验证页面状态。您还可以使用 [`LocatorAssertions.ToMatchAriaSnapshotAsync()`](/dotnet/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) 来匹配页面的特定部分。

对于以下 DOM：

```html
<h1>title</h1>
```

您可以使用以下快照模板进行匹配：

```csharp
await Expect(page).ToMatchAriaSnapshotAsync(@"
  - heading ""title""
");
```

匹配时，快照模板会与页面当前的可访问性树进行比较：
* 如果树结构与模板匹配，测试通过；否则失败，表示
  预期和实际可访问性状态之间存在不匹配。
* 比较区分大小写，并规范化名称和文本值中的空白。YAML 缩进
  决定嵌套关系。
* 比较是顺序敏感的，这意味着快照模板中元素的顺序必须与
  页面可访问性树中的顺序匹配。
* 单节点模板可以匹配选定页面或定位器内的任何深度。多个顶级节点必须
  按顺序在同一父级下匹配。

### 部分匹配

您可以通过省略属性或可访问名称对节点进行部分匹配，从而无需精确匹配即可验证
可访问性树的特定部分。这种灵活性对于动态或无关的
属性很有帮助。

```html
<button>Submit</button>
```

::: code-group

```yaml [aria snapshot]
- button
```

:::

在此示例中，button 角色被匹配，但可访问名称（"Submit"）未指定，允许测试
无论按钮的标签是什么都能通过。

<hr/>

对于具有 `checked` 或 `disabled` 等 ARIA 属性的元素，省略这些属性允许部分匹配，
仅关注角色和层次结构。

```html
<input type="checkbox" checked>
```

::: code-group

```yaml [aria snapshot (partial match)]
- checkbox
```

:::

在此部分匹配中，`checked` 属性被忽略，因此无论复选框状态如何，测试都会通过。

<hr/>

类似地，您可以通过省略特定列表项或嵌套元素来部分匹配列表或组中的子元素。

```html
<ul>
  <li>Feature A</li>
  <li>Feature B</li>
  <li>Feature C</li>
</ul>
```

::: code-group

```yaml [aria snapshot (partial match)]
- list:
  - listitem: Feature B
```

:::

部分匹配让您可以创建灵活的快照测试，验证基本页面结构而不强制要求
特定内容或属性。

### 严格匹配

默认情况下，包含子元素子集的模板将被匹配：

```html
<ul>
  <li>Feature A</li>
  <li>Feature B</li>
  <li>Feature C</li>
</ul>
```

::: code-group

```yaml [aria snapshot (partial match)]
- list:
  - listitem: Feature B
```

:::

`/children` 属性控制其所在节点的子元素：
- `contain`（默认）：如果所有指定的子元素按顺序存在则匹配。
- `equal`：如果直接子元素按顺序完全匹配指定列表则匹配。
- `deep-equal`：如果子元素和嵌套子元素按顺序完全匹配指定列表则匹配。

没有预期子元素条目时，`contain` 允许任何子元素，而 `equal` 和 `deep-equal` 要求没有子元素。在
嵌套节点上添加 `/children: contain` 可以覆盖继承的 `deep-equal` 匹配并允许那里有额外的子元素。

```html
<ul>
  <li>Feature A</li>
  <li>Feature B</li>
  <li>Feature C</li>
</ul>
```

由于 Feature C 不在模板中，以下快照将失败：

::: code-group

```yaml [aria snapshot]
- list:
  - /children: equal
  - listitem: Feature A
  - listitem: Feature B
```

:::

#### 全局设置 `children` 模式

您可以在配置文件中为所有 `toMatchAriaSnapshot` 调用设置默认的子元素匹配模式，
而不是为每个快照添加 `/children` 属性：

单个快照仍然可以通过在模板中包含显式的 `/children` 属性来覆盖全局设置。

### 使用正则表达式匹配

正则表达式允许对具有动态或可变文本的元素进行灵活匹配。可访问名称和文本可以
支持正则表达式模式。

```html
<h1>Issues 12</h1>
```

::: code-group

```yaml [aria snapshot]
- heading /Issues \d+/
```

:::

## 生成快照

在 Playwright 中创建 aria 快照有助于确保和维护您的应用程序结构。
根据您的测试设置和工作流程，您可以通过多种方式生成快照。

### 使用 Playwright 代码生成器生成快照

如果您使用 Playwright 的[代码生成器](./codegen.md)，通过其
交互式界面可以简化 aria 快照的生成：
- **"断言快照"操作**：在代码生成器中，您可以使用"断言快照"操作为选定元素自动创建
  快照断言。这是将 aria 快照作为录制测试流程一部分捕获的快速方法。
- **"Aria 快照"选项卡**：代码生成器界面中的"Aria 快照"选项卡直观地表示
  选定定位器的 aria 快照，让您可以探索、检查和验证元素角色、属性和
  可访问名称，以辅助快照的创建和审查。

### 使用 [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) 和 [`Locator.AriaSnapshotAsync()`](/dotnet/api/class-locator#locator-aria-snapshot)

方法 [`Page.AriaSnapshotAsync()`](/dotnet/api/class-page#page-aria-snapshot) 和 [`Locator.AriaSnapshotAsync()`](/dotnet/api/class-locator#locator-aria-snapshot) 允许您以编程方式创建
定位器范围内可访问元素的 YAML 表示，这对于在测试执行期间动态生成快照特别有帮助。

**示例**：

```csharp
var snapshot = await page.AriaSnapshotAsync();
Console.WriteLine(snapshot);
```

此命令以 YAML 格式输出指定定位器范围内的 aria 快照，您可以根据需要进行验证
或存储。

## 可访问性树示例

### 带有 level 属性的标题

标题可以包含 `level` 属性来表示其标题级别。

```html
<h1>Title</h1>
<h2>Subtitle</h2>
```

::: code-group

```yaml [aria snapshot]
- heading "Title" [level=1]
- heading "Subtitle" [level=2]
```

:::

### 文本节点

独立或描述性文本元素显示为文本节点。

```html
<div>Sample accessible name</div>
```

::: code-group

```yaml [aria snapshot]
- text: Sample accessible name
```

:::

### 内联多行文本

多行文本（如段落）在 aria 快照中会被规范化。

```html
<p>Line 1<br>Line 2</p>
```

::: code-group

```yaml [aria snapshot]
- paragraph: Line 1 Line 2
```

:::

### 链接

链接显示其文本或来自伪元素的组合内容。链接的目标可以使用
`/url` 属性进行匹配。

```html
<a href="#more-info">Read more about Accessibility</a>
```

::: code-group

```yaml [aria snapshot]
- link "Read more about Accessibility":
    - /url: "#more-info"
```

:::

`/url` 的值也可以是正则表达式：

```html
<a href="https://www.youtube.com/channel/UC46Zj8pDH5tDosqm1gd7WTg">YouTube channel</a>
```

::: code-group

```yaml [aria snapshot]
- link:
  - /url: /https://www.youtube.com/channel/.*/
```

:::

### 文本框

`text` 类型的输入元素显示其 `value` 属性内容。

```html
<input type="text" value="Enter your name">
```

::: code-group

```yaml [aria snapshot]
- textbox: Enter your name
```

:::

### 带有项目的列表

有序和无序列表包含它们的列表项。

```html
<ul aria-label="Main Features">
  <li>Feature 1</li>
  <li>Feature 2</li>
</ul>
```

::: code-group

```yaml [aria snapshot]
- list "Main Features":
  - listitem: Feature 1
  - listitem: Feature 2
```

:::

### 分组元素

组捕获嵌套元素，例如带有摘要内容的 `<details>` 元素。

```html
<details>
  <summary>Summary</summary>
  <p>Detail content here</p>
</details>
```

::: code-group

```yaml [aria snapshot]
- group: Summary
```

:::

### 属性和状态

常用的 ARIA 属性，如 `checked`、`disabled`、`expanded`、`invalid`、`level`、`pressed`、`required` 和 `selected`，
表示控件状态。

#### 带有 `checked` 属性的复选框

```html
<input type="checkbox" checked>
```

::: code-group

```yaml [aria snapshot]
- checkbox [checked]
```

:::

#### 带有 `pressed` 属性的按钮

```html
<button aria-pressed="true">Toggle</button>
```

::: code-group

```yaml [aria snapshot]
- button "Toggle" [pressed=true]
```

:::

#### 带有 `aria-invalid` 属性的输入框

`aria-invalid` 的值会直接显示。值为 `true` 时显示为 `[invalid]`，而 `grammar`
和 `spelling` 分别显示为 `[invalid=grammar]` 和 `[invalid=spelling]`。值为 `false` 时省略。

```html
<input type="text" aria-label="Email" aria-invalid="true" value="not-an-email">
```

::: code-group

```yaml [aria snapshot]
- textbox "Email" [invalid]: not-an-email
```

:::

```html
<input type="text" aria-label="Bio" aria-invalid="spelling">
```

::: code-group

```yaml [aria snapshot]
- textbox "Bio" [invalid=spelling]
```

:::

#### 带有 `required` 属性的输入框

在支持 `aria-required` 的角色上，输入框、文本区域和选择框的原生 `required` 属性，
或 `aria-required="true"`，会显示为 `[required]`。原生 `required` 属性优先于
`aria-required="false"`。快照中会省略 false 值，但可以用 `[required=false]` 进行断言。

```html
<input type="email" aria-label="Email" required>
```

::: code-group

```yaml [aria snapshot]
- textbox "Email" [required]
```

:::
