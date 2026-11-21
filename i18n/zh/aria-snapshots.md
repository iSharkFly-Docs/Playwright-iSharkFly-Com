---
title: "快照测试"
---

# 快照测试

import LiteYouTube from '@site/src/components/LiteYouTube';

## 概述

使用 Playwright 的快照测试，您可以将页面的无障碍树与预定义的快照模板进行断言。

```js
await page.goto('https://playwright.dev/');
await expect(page).toMatchAriaSnapshot(`
  - banner:
    - heading /Playwright enables reliable end-to-end/ [level=1]
    - link "Get started":
      - /url: /docs/intro
    - link "Star microsoft/playwright on GitHub":
      - /url: https://github.com/microsoft/playwright
    - link /[\\d]+k\\+ stargazers on GitHub/
`);
```

<LiteYouTube
id="P4R6hnsE0UY"
title="ARIA 快照入门"
/>

## 断言测试与快照测试

快照测试和断言测试在测试自动化中有不同的用途：

### 断言测试

断言测试是一种有针对性的方法，您可以断言元素或组件的特定值或条件。例如，在 Playwright 中，[`locatorAssertions.toHaveText()`](/api/class-locatorassertions#locator-assertions-to-have-text) 验证元素包含预期的文本，[`locatorAssertions.toHaveValue()`](/api/class-locatorassertions#locator-assertions-to-have-value) 确认输入字段具有预期的值。
断言测试是具体的，通常根据预期的预定义状态检查元素或属性的当前状态。
它们适用于可预测的单值检查，但在测试更广泛的结构或变化时范围有限。

**优点**
- **清晰性**：测试的意图是明确且易于理解的。
- **具体性**：测试关注功能的特定方面，使其对不相关的更改更加健壮。
- **调试**：失败提供有针对性的反馈，直接指向有问题的方面。

**缺点**
- **复杂输出时冗长**：为复杂数据结构或大型输出编写断言可能很繁琐且容易出错。
- **维护开销**：随着代码的发展，手动更新断言可能很耗时。

### 快照测试

快照测试在给定时刻捕获元素、组件或数据的整个状态的"快照"或表示，然后保存以供将来比较。重新运行测试时，将当前状态与快照进行比较，如果存在差异，则测试失败。这种方法对于复杂或动态结构特别有用，因为手动断言每个细节会太耗时。快照测试比断言测试更广泛和全面，允许您跟踪随时间推移的更复杂变化。

**优点**
- **简化复杂输出**：例如，使用传统断言测试 UI 组件的渲染输出可能很繁琐。快照捕获整个输出以便于比较。
- **快速反馈循环**：开发人员可以轻松发现输出中的意外更改。
- **鼓励一致性**：有助于随着代码的发展保持一致的输出。

**缺点**
- **过度依赖**：可能很容易接受对快照的更改而不完全理解它们，这可能会隐藏 bug。
- **粒度**：当出现差异时，大型快照可能难以解释，特别是如果微小的更改影响了输出的大部分。
- **适用性**：不适用于输出频繁或不可预测地更改的高度动态内容。

### 何时使用
- **快照测试**适用于：
  - 整个页面和组件的 UI 测试。
  - 复杂 UI 组件的广泛结构检查。
  - 结构很少更改的输出的回归测试。
- **断言测试**适用于：
  - 核心逻辑验证。
  - 计算值测试。
  - 需要精确条件的细粒度测试。

通过结合快照测试进行广泛的结构检查和断言测试进行特定功能测试，您可以实现全面的测试策略。

## Aria 快照

在 Playwright 中，aria 快照提供页面无障碍树的 YAML 表示。
这些快照可以存储并在以后进行比较，以验证页面结构是否保持一致或符合定义的期望。模板是约束，不一定是无障碍树的完整序列化。

YAML 格式描述了页面上可访问元素的层次结构，详细说明**角色**、**属性**、**值**和**文本内容**。
该结构遵循树状语法，其中每个节点表示一个可访问元素，缩进表示嵌套元素。

无障碍树中的每个可访问元素表示为一个 YAML 节点：

```yaml
- role "name" [attribute=value]
```
- **role**：指定元素的 ARIA 或 HTML 角色（例如，`heading`、`list`、`listitem`、`button`）。
- **"name"**：元素的可访问名称。带引号的字符串表示精确值，`/patterns/` 用于正则表达式。
- **[attribute=value]**：方括号中的属性和值表示特定的 ARIA 属性，例如 `checked`、`disabled`、`expanded`、`invalid`、`level`、`pressed`、`required` 或 `selected`。属性可以约束特定值，例如 `[pressed=mixed]`。

这些值来自 ARIA 属性或根据 HTML 语义计算。要检查页面的无障碍树结构，请使用 [Chrome DevTools 无障碍标签](https://developer.chrome.com/docs/devtools/accessibility/reference#tab)。

## 快照匹配

Playwright 中的 [`pageAssertions.toMatchAriaSnapshot()`](/api/class-pageassertions#page-assertions-to-match-aria-snapshot) 断言方法将页面的可访问结构与预定义的 aria 快照模板进行比较，帮助根据测试要求验证页面状态。您还可以使用 [`locatorAssertions.toMatchAriaSnapshot()`](/api/class-locatorassertions#locator-assertions-to-match-aria-snapshot) 来匹配页面的特定部分。

对于以下 DOM：

```html
<h1>title</h1>
```

您可以使用以下快照模板进行匹配：

```js
await expect(page).toMatchAriaSnapshot(`
  - heading "title"
`);
```

匹配时，快照模板与页面的当前无障碍树进行比较：
* 如果树结构与模板匹配，则测试通过；否则失败，表明预期和实际无障碍状态之间存在不匹配。
* 比较区分大小写，并规范化名称和文本值中的空白。YAML 缩进决定嵌套。
* 比较是顺序敏感的，意味着快照模板中元素的顺序必须与页面无障碍树中的顺序匹配。
* 单节点模板可以在所选页面或定位器内的任何深度匹配。多个顶级节点必须在同一父级下按顺序匹配。

### 部分匹配

您可以通过省略属性或可访问名称对节点执行部分匹配，从而可以验证无障碍树的特定部分而无需精确匹配。这种灵活性对于动态或不相关的属性很有帮助。

```html
<button>Submit</button>
```

::: code-group

```yaml [aria 快照]
- button
```

:::

在此示例中，匹配了 button 角色，但未指定可访问名称（"Submit"），允许测试通过而不管按钮的标签是什么。

<hr/>

对于具有 ARIA 属性（如 `checked` 或 `disabled`）的元素，省略这些属性允许部分匹配，仅关注角色和层次结构。

```html
<input type="checkbox" checked>
```

::: code-group

```yaml [aria 快照（部分匹配）]
- checkbox
```

:::

在此部分匹配中，`checked` 属性被忽略，因此无论复选框状态如何，测试都会通过。

<hr/>

同样，您可以通过省略特定列表项或嵌套元素来部分匹配列表或组中的子项。

```html
<ul>
  <li>Feature A</li>
  <li>Feature B</li>
  <li>Feature C</li>
</ul>
```

::: code-group

```yaml [aria 快照（部分匹配）]
- list:
  - listitem: Feature B
```

:::

部分匹配让您可以创建灵活的快照测试，验证基本页面结构而不强制执行特定内容或属性。

### 严格匹配

默认情况下，包含子集子项的模板将被匹配：

```html
<ul>
  <li>Feature A</li>
  <li>Feature B</li>
  <li>Feature C</li>
</ul>
```

::: code-group

```yaml [aria 快照（部分匹配）]
- list:
  - listitem: Feature B
```

:::

`/children` 属性控制其出现位置的节点的子项：
- `contain`（默认）：如果所有指定的子项按顺序存在，则匹配。
- `equal`：如果直接子项按顺序与指定列表完全匹配，则匹配。
- `deep-equal`：如果子项和嵌套子项按顺序与指定列表完全匹配，则匹配。

没有预期的子项条目时，`contain` 允许任何子项，而 `equal` 和 `deep-equal` 要求没有子项。将 `/children: contain` 添加到嵌套节点以覆盖继承的 `deep-equal` 匹配并允许那里有额外的子项。

```html
<ul>
  <li>Feature A</li>
  <li>Feature B</li>
  <li>Feature C</li>
</ul>
```

以下快照将因 Feature C 不在模板中而失败：

::: code-group

```yaml [aria 快照]
- list:
  - /children: equal
  - listitem: Feature A
  - listitem: Feature B
```

:::

#### 全局设置 `children` 模式

您可以在配置文件中为所有 `toMatchAriaSnapshot` 调用设置默认的子项匹配模式，而不是为每个快照添加 `/children` 属性：

::: code-group

```js [playwright.config.ts]
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    toMatchAriaSnapshot: {
      children: 'equal',
    },
  },
});
```

:::

单个快照仍然可以通过在模板中包含显式 `/children` 属性来覆盖全局设置。

### 使用正则表达式匹配

正则表达式允许对具有动态或可变文本的元素进行灵活匹配。可访问名称和文本可以支持正则表达式模式。

```html
<h1>Issues 12</h1>
```

::: code-group

```yaml [aria 快照]
- heading /Issues \d+/
```

:::

## 生成快照

在 Playwright 中创建 aria 快照有助于确保和维护应用程序的结构。
根据您的测试设置和工作流程，您可以通过多种方式生成快照。

### 使用 Playwright 代码生成器生成快照

如果您使用 Playwright 的[代码生成器](./codegen.md)，生成 aria 快照可以通过其交互式界面简化：
- **"Assert snapshot"操作**：在代码生成器中，您可以使用"Assert snapshot"操作自动为所选元素创建快照断言。这是在录制的测试流程中捕获 aria 快照的快速方法。
- **"Aria snapshot"标签**：代码生成器界面中的"Aria snapshot"标签可视化表示所选定位器的 aria 快照，让您可以探索、检查和验证元素角色、属性和可访问名称，以帮助快照创建和审查。

### 使用 `@playwright/test` 和 `--update-snapshots` 标志更新快照

使用 Playwright 测试运行器（`@playwright/test`）时，您可以使用 `--update-snapshots` 标志（简写为 `-u`）自动更新快照。

不带该标志运行时使用 `default` 模式：缺失的快照会被生成，但生成它们的测试会失败，这样带有新快照的运行不会静默通过。使用 `missing` 生成缺失的快照并保持这些测试通过。提供 `-u` 使用 `changed` 模式并更新不匹配的快照。使用 `all` 重新生成每个快照，包括匹配的，或使用 `none` 防止快照更新。

```bash
npx playwright test --update-snapshots
```

当应用程序结构更改需要新快照作为基准时，更新快照很有用。Playwright 会重试断言直到其期望超时过期。如果快照生成比测试超时花费更长时间，请调整 `--timeout`。

#### 用于快照生成的空模板

在断言中传递空字符串作为模板会即时生成快照：

```js
await expect(locator).toMatchAriaSnapshot('');
```

这在不使用 `-u` 的情况下有效，因为默认模式会生成缺失的快照。

#### 快照补丁文件

对于内联快照模板，Playwright 会创建捕获差异的补丁文件。这些补丁文件可以被审查和应用。单独的 `.aria.yml` 快照直接写入其配置的快照路径。

可以使用 `--update-source-method` 标志更改源代码更新的方式。有几个可用选项：
- **"patch"**（默认）：生成可以使用 `git apply` 应用于源代码的统一差异文件。
- **"3way"**：在源代码中生成合并冲突标记，允许您选择是否接受更改。
- **"overwrite"**：用新快照值覆盖源代码。

```bash
npx playwright test --update-snapshots --update-source-method=3way
```

#### 快照作为单独文件

要将快照存储在单独的文件中，请使用带有 `name` 选项的 `toMatchAriaSnapshot` 方法，指定 `.aria.yml` 文件扩展名。

```js
await expect(page.getByRole('main')).toMatchAriaSnapshot({ name: 'main.aria.yml' });
```

默认情况下，来自测试文件 `example.spec.ts` 的快照放在 `example.spec.ts-snapshots` 目录中。由于快照在不同浏览器之间应该相同，即使使用多个浏览器测试也只保存一个快照。如果您愿意，可以使用以下配置自定义[快照路径模板](./api/class-testconfig#test-config-snapshot-path-template)：

```js
export default defineConfig({
  expect: {
    toMatchAriaSnapshot: {
      pathTemplate: '__snapshots__/{testFilePath}/{arg}{ext}',
    },
  },
});
```

### 使用 [`page.ariaSnapshot()`](/api/class-page#page-aria-snapshot) 和 [`locator.ariaSnapshot()`](/api/class-locator#locator-aria-snapshot)

方法 [`page.ariaSnapshot()`](/api/class-page#page-aria-snapshot) 和 [`locator.ariaSnapshot()`](/api/class-locator#locator-aria-snapshot) 允许您以编程方式在定位器范围内创建可访问元素的 YAML 表示，特别有助于在测试执行期间动态生成快照。

**示例**：

```js
const snapshot = await page.ariaSnapshot();
console.log(snapshot);
```

此命令以 YAML 格式输出指定定位器范围内的 aria 快照，您可以根据需要验证或存储。

## 无障碍树示例

### 带有级别属性的标题

标题可以包含表示其标题级别的 `level` 属性。

```html
<h1>Title</h1>
<h2>Subtitle</h2>
```

::: code-group

```yaml [aria 快照]
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

```yaml [aria 快照]
- text: Sample accessible name
```

:::

### 内联多行文本

多行文本（如段落）在 aria 快照中被规范化。

```html
<p>Line 1<br>Line 2</p>
```

::: code-group

```yaml [aria 快照]
- paragraph: Line 1 Line 2
```

:::

### 链接

链接显示其文本或来自伪元素的组合内容。可以使用 `/url` 属性匹配链接的目标。

```html
<a href="#more-info">Read more about Accessibility</a>
```

::: code-group

```yaml [aria 快照]
- link "Read more about Accessibility":
    - /url: "#more-info"
```

:::

`/url` 的值也可以是正则表达式：

```html
<a href="https://www.youtube.com/channel/UC46Zj8pDH5tDosqm1gd7WTg">YouTube channel</a>
```

::: code-group

```yaml [aria 快照]
- link:
  - /url: /https://www.youtube.com/channel/.*/
```

:::

### 文本框

类型为 `text` 的输入元素显示其 `value` 属性内容。

```html
<input type="text" value="Enter your name">
```

::: code-group

```yaml [aria 快照]
- textbox: Enter your name
```

:::

### 带有项目的列表

有序和无序列表包含其列表项。

```html
<ul aria-label="Main Features">
  <li>Feature 1</li>
  <li>Feature 2</li>
</ul>
```

::: code-group

```yaml [aria 快照]
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

```yaml [aria 快照]
- group: Summary
```

:::

### 属性和状态

常用的 ARIA 属性，如 `checked`、`disabled`、`expanded`、`invalid`、`level`、`pressed`、`required` 和 `selected`，表示控件状态。

#### 带有 `checked` 属性的复选框

```html
<input type="checkbox" checked>
```

::: code-group

```yaml [aria 快照]
- checkbox [checked]
```

:::

#### 带有 `pressed` 属性的按钮

```html
<button aria-pressed="true">Toggle</button>
```

::: code-group

```yaml [aria 快照]
- button "Toggle" [pressed=true]
```

:::

#### 带有 `aria-invalid` 属性的输入

`aria-invalid` 值直接显示。值为 `true` 渲染为 `[invalid]`，而 `grammar` 和 `spelling` 渲染为 `[invalid=grammar]` 和 `[invalid=spelling]`。值为 `false` 时省略。

```html
<input type="text" aria-label="Email" aria-invalid="true" value="not-an-email">
```

::: code-group

```yaml [aria 快照]
- textbox "Email" [invalid]: not-an-email
```

:::

```html
<input type="text" aria-label="Bio" aria-invalid="spelling">
```

::: code-group

```yaml [aria 快照]
- textbox "Bio" [invalid=spelling]
```

:::

#### 带有 `required` 属性的输入

在支持 `aria-required` 的角色上，输入、文本区域和选择框的原生 `required` 属性或 `aria-required="true"` 渲染为 `[required]`。原生 `required` 属性优先于 `aria-required="false"`。值为 false 时从快照中省略，但可以使用 `[required=false]` 进行断言。

```html
<input type="email" aria-label="Email" required>
```

::: code-group

```yaml [aria 快照]
- textbox "Email" [required]
```

:::
