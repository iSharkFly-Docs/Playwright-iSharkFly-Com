---
title: "无障碍测试"
---

# 无障碍测试

## 简介

Playwright 可用于测试您的应用程序的多种无障碍问题。

以下是一些可以捕获的问题示例：
- 由于与背景的颜色对比度差，对于视力障碍用户来说难以阅读的文本
- 没有屏幕阅读器可识别标签的 UI 控件和表单元素
- 具有重复 ID 的交互元素，可能会混淆辅助技术

以下示例依赖于 [`@axe-core/playwright`](https://npmjs.org/@axe-core/playwright) 包，该包添加了对将 [axe 无障碍测试引擎](https://www.deque.com/axe/)作为 Playwright 测试的一部分运行的支持。

:::note[免责声明]

自动化无障碍测试可以检测一些常见的无障碍问题，例如缺失或无效的属性。但许多无障碍问题只能通过手动测试发现。我们建议结合使用自动化测试、手动无障碍评估和包容性用户测试。

对于手动评估，我们推荐 [Accessibility Insights for Web](https://accessibilityinsights.io/docs/web/overview/?referrer=playwright-accessibility-testing-js)，这是一个免费的开源开发工具，可以指导您评估网站的 [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa) 覆盖范围。
:::

## 无障碍测试示例

无障碍测试与任何其他 Playwright 测试一样工作。您可以为它们创建单独的测试用例，或将无障碍扫描和断言集成到现有的测试用例中。

以下示例演示了一些基本的无障碍测试场景。

### 扫描整个页面

此示例演示了如何测试整个页面的自动可检测无障碍违规。测试：
1. 导入 `@axe-core/playwright` 包
1. 使用常规 Playwright Test 语法定义测试用例
1. 使用常规 Playwright 语法导航到被测页面
1. 等待 `AxeBuilder.analyze()` 对页面运行无障碍扫描
1. 使用常规 Playwright Test [断言](./test-assertions)验证返回的扫描结果中没有违规

::: code-group

```js [TypeScript]
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'; // 1

test.describe('首页', () => { // 2
  test('不应有任何自动检测的无障碍问题', async ({ page }) => {
    await page.goto('https://your-site.com/'); // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
});
```

```js [JavaScript]
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default; // 1

test.describe('首页', () => { // 2
  test('不应有任何自动检测的无障碍问题', async ({ page }) => {
    await page.goto('https://your-site.com/'); // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
});
```

:::

### 配置 axe 扫描页面的特定部分

`@axe-core/playwright` 支持 axe 的许多配置选项。您可以通过使用 `AxeBuilder` 类的构建器模式来指定这些选项。

例如，您可以使用 [`AxeBuilder.include()`](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md#axebuilderincludeselector-string--string) 将无障碍扫描限制为仅针对页面的特定部分运行。

`AxeBuilder.analyze()` 会在您调用它时扫描页面*当前状态*。要扫描基于 UI 交互显示的页面部分，请在调用 `analyze()` 之前使用[定位器](./locators.md)与页面交互：

```js
test('导航菜单不应有自动检测的无障碍违规', async ({
  page,
}) => {
  await page.goto('https://your-site.com/');

  await page.getByRole('button', { name: '导航菜单' }).click();

  // 重要的是在运行 analyze() 之前 waitFor() 页面处于所需状态。
  // 否则，axe 可能找不到您的测试期望扫描的所有元素。
  await page.locator('#navigation-menu-flyout').waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#navigation-menu-flyout')
      .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### 扫描 WCAG 违规

默认情况下，axe 会检查各种无障碍规则。其中一些规则对应于 [Web 内容无障碍指南 (WCAG)](https://www.w3.org/TR/WCAG21/) 中的特定成功标准，而其他规则是"最佳实践"规则，不是任何 WCAG 标准特别要求的。

您可以使用 [`AxeBuilder.withTags()`](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md#axebuilderwithtagstags-stringarray) 将无障碍扫描限制为仅运行那些"标记"为对应特定 WCAG 成功标准的规则。例如，[Accessibility Insights for Web 的自动检查](https://accessibilityinsights.io/docs/web/getstarted/fastpass/?referrer=playwright-accessibility-testing-js)仅包括测试 WCAG A 和 AA 成功标准违规的 axe 规则；要匹配该行为，您可以使用标签 `wcag2a`、`wcag2aa`、`wcag21a` 和 `wcag21aa`。

请注意，自动化测试无法检测所有类型的 WCAG 违规。

```js
test('不应有任何自动检测的 WCAG A 或 AA 违规', async ({ page }) => {
  await page.goto('https://your-site.com/');

  const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

您可以在 [axe API 文档的"Axe-core 标签"部分](https://www.deque.com/axe/core-documentation/api-documentation/#axecore-tags)找到 axe-core 支持的规则标签的完整列表。

## 处理已知问题

在向应用程序添加无障碍测试时，一个常见问题是"如何抑制已知违规？"以下示例演示了您可以使用的几种技术。

### 从扫描中排除单个元素

如果您的应用程序包含一些具有已知问题的特定元素，您可以使用 [`AxeBuilder.exclude()`](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md#axebuilderexcludeselector-string--string) 将它们从扫描中排除，直到您能够修复这些问题。

这通常是最简单的选项，但有一些重要的缺点：
* `exclude()` 将排除指定的元素*及其所有后代*。避免将其用于包含许多子元素的组件。
* `exclude()` 将阻止*所有*规则针对指定元素运行，而不仅仅是与已知问题对应的规则。

以下是在一个特定测试中排除一个元素不被扫描的示例：

```js
test('除了有已知问题的元素外，不应有任何无障碍违规', async ({
  page,
}) => {
  await page.goto('https://your-site.com/page-with-known-issues');

  const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('#element-with-known-issue')
      .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

如果相关元素在许多页面中重复使用，请考虑[使用测试夹具](#使用测试夹具进行通用-axe-配置)在多个测试中重用相同的 `AxeBuilder` 配置。

### 禁用单个扫描规则

如果您的应用程序包含许多特定规则的现有违规，您可以使用 [`AxeBuilder.disableRules()`](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md#axebuilderdisablerulesrules-stringarray) 临时禁用单个规则，直到您能够修复这些问题。

您可以在要抑制的违规的 `id` 属性中找到要传递给 `disableRules()` 的规则 ID。[axe 规则的完整列表](https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md)可以在 `axe-core` 的文档中找到。

```js
test('除了有已知问题的规则外，不应有任何无障碍违规', async ({
  page,
}) => {
  await page.goto('https://your-site.com/page-with-known-issues');

  const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['duplicate-id'])
      .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### 使用快照允许特定的已知问题

如果您想允许更细粒度的已知问题集，您可以使用[快照](./test-snapshots.md)来验证一组现有违规是否已更改。这种方法避免了使用 `AxeBuilder.exclude()` 的缺点，但代价是稍微增加了复杂性和脆弱性。

不要使用整个 `accessibilityScanResults.violations` 数组的快照。它包含相关元素的实现细节，例如其渲染的 HTML 片段；如果您将这些包含在快照中，每当相关组件因不相关的原因更改时，您的测试都容易中断：

```js
// 不要这样做！这很脆弱。
expect(accessibilityScanResults.violations).toMatchSnapshot();
```

相反，创建相关违规的*指纹*，其中仅包含足以唯一标识问题的信息，并使用指纹的快照：

```js
// 这比快照整个违规数组更不脆弱。
expect(violationFingerprints(accessibilityScanResults)).toMatchSnapshot();

// my-test-utils.js
function violationFingerprints(accessibilityScanResults) {
  const violationFingerprints = accessibilityScanResults.violations.map(violation => ({
    rule: violation.id,
    // 这些是 CSS 选择器，唯一标识违反相关规则的每个元素。
    targets: violation.nodes.map(node => node.target),
  }));

  return JSON.stringify(violationFingerprints, null, 2);
}
```

## 将扫描结果导出为测试附件

大多数无障碍测试主要关注 axe 扫描结果的 `violations` 属性。然而，扫描结果不仅包含 `violations`。例如，结果还包含有关通过的规则以及 axe 发现某些规则结果不确定的元素的信息。此信息对于调试未检测到您期望的所有违规的测试很有用。

要将*所有*扫描结果作为测试结果的一部分包含以用于调试目的，您可以使用 [`testInfo.attach()`](./api/class-testinfo#test-info-attach) 将扫描结果添加为测试附件。[报告器](./test-reporters)可以将完整结果嵌入或链接到测试输出中。

以下示例演示了将扫描结果附加到测试：

```js
test('带附件的示例', async ({ page }, testInfo) => {
  await page.goto('https://your-site.com/');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(accessibilityScanResults, null, 2),
    contentType: 'application/json'
  });

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## 使用测试夹具进行通用 axe 配置

[测试夹具](./test-fixtures)是在许多测试之间共享通用 `AxeBuilder` 配置的好方法。一些可能有用的场景包括：
* 在所有测试中使用一组通用规则
* 抑制出现在许多不同页面中的通用元素的已知违规
* 为许多扫描一致地附加独立的无障碍报告

以下示例演示了创建和使用涵盖每种场景的测试夹具。

### 创建夹具

此示例夹具创建一个预配置了共享 `withTags()` 和 `exclude()` 配置的 `AxeBuilder` 对象。

::: code-group

```js [TypeScript]
import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder;
};

// 通过提供"makeAxeBuilder"扩展基础测试
//
// 这个新的"test"可以在多个测试文件中使用，每个文件都会获得
// 一个一致配置的 AxeBuilder 实例。
export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('#commonly-reused-element-with-known-issue');

    await use(makeAxeBuilder);
  }
});
export { expect } from '@playwright/test';
```

```js [JavaScript]
const base = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// 通过提供"makeAxeBuilder"扩展基础测试
//
// 这个新的"test"可以在多个测试文件中使用，每个文件都会获得
// 一个一致配置的 AxeBuilder 实例。
exports.test = base.test.extend({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('#commonly-reused-element-with-known-issue');

    await use(makeAxeBuilder);
  }
});
exports.expect = base.expect;
```

:::

### 使用夹具

要使用夹具，请将前面示例中的 `new AxeBuilder({ page })` 替换为新定义的 `makeAxeBuilder` 夹具：

```js
const { test, expect } = require('./axe-test');

test('使用自定义夹具的示例', async ({ page, makeAxeBuilder }) => {
  await page.goto('https://your-site.com/');

  const accessibilityScanResults = await makeAxeBuilder()
      // 自动使用共享的 AxeBuilder 配置，
      // 但也支持额外的测试特定配置
      .include('#specific-element-under-test')
      .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
