---
title: "编写测试"
---

# 编写测试

## 简介

Playwright 测试很简单：它们**执行操作**并**对状态进行断言**以验证预期结果。

Playwright 会在执行每个操作之前自动等待[可操作性](./actionability.md)检查通过。你无需添加手动等待或处理竞态条件。Playwright 断言被设计为描述最终会满足的预期，消除了不稳定的超时和竞态检查。

**你将学到**
- [如何编写第一个测试](/writing-tests.md#first-test)
- [如何执行操作](/writing-tests.md#actions)
- [如何使用断言](/writing-tests.md#assertions)
- [测试如何隔离运行](/writing-tests.md#test-isolation)
- [如何使用测试钩子](/writing-tests.md#using-test-hooks)

## 第一个测试

看看下面的示例，了解如何编写测试。

::: code-group

```js [tests/example.spec.ts]
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // 期望标题"包含"某个子字符串。
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // 点击 get started 链接。
  await page.getByRole('link', { name: 'Get started' }).click();

  // 期望页面有一个名为 Installation 的标题。
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

:::

::: info
在 VS Code 中使用 JavaScript 时，在每个测试文件开头添加 `// @ts-check` 以获得自动类型检查。
:::

## 操作

### 导航

大多数测试从导航到一个 URL 开始。之后，测试与页面元素交互。

```js
await page.goto('https://playwright.dev/');
```

Playwright 会等待页面达到加载状态后再继续。了解更多关于 [`page.goto()`](/api/class-page#page-goto) 选项的信息。

### 交互

执行操作首先需要定位元素。Playwright 使用 [定位器 API](./locators.md) 来实现这一点。定位器代表了一种在任何时刻查找页面上元素的方式。了解更多关于[不同类型](./locators.md)定位器的信息。

Playwright 会在执行操作之前等待元素变为[可操作](./actionability.md)状态，因此你无需等待它变得可用。

```js
// 创建定位器。
const getStarted = page.getByRole('link', { name: 'Get started' });

// 点击它。
await getStarted.click();
```

在大多数情况下，可以写成一行：

```js
await page.getByRole('link', { name: 'Get started' }).click();
```

### 基本操作

以下是最常用的 Playwright 操作。完整列表请查看 [定位器 API](./api/class-locator.md) 部分。

| 操作 | 描述 |
| :- | :- |
| [`locator.check()`](/api/class-locator#locator-check) | 勾选输入复选框 |
| [`locator.click()`](/api/class-locator#locator-click) | 点击元素 |
| [`locator.uncheck()`](/api/class-locator#locator-uncheck) | 取消勾选输入复选框 |
| [`locator.hover()`](/api/class-locator#locator-hover) | 将鼠标悬停在元素上 |
| [`locator.fill()`](/api/class-locator#locator-fill) | 填写表单字段，输入文本 |
| [`locator.focus()`](/api/class-locator#locator-focus) | 聚焦元素 |
| [`locator.press()`](/api/class-locator#locator-press) | 按下单个按键 |
| [`locator.setInputFiles()`](/api/class-locator#locator-set-input-files) | 选择要上传的文件 |
| [`locator.selectOption()`](/api/class-locator#locator-select-option) | 在下拉菜单中选择选项 |

## 断言

Playwright 以 `expect` 函数的形式包含[测试断言](./test-assertions.md)。要进行断言，调用 `expect(value)` 并选择反映预期的匹配器。

Playwright 包含异步匹配器，它们会等待直到满足预期条件。使用这些匹配器可以使测试稳定且具有弹性。例如，此代码会等待直到页面标题包含 "Playwright"：

```js
await expect(page).toHaveTitle(/Playwright/);
```

以下是最常用的异步断言。完整列表请参阅 [断言指南](./test-assertions.md)：

| 断言 | 描述 |
| :- | :- |
| [`locatorAssertions.toBeChecked()`](/api/class-locatorassertions#locator-assertions-to-be-checked) | 复选框已勾选 |
| [`locatorAssertions.toBeEnabled()`](/api/class-locatorassertions#locator-assertions-to-be-enabled) | 控件已启用 |
| [`locatorAssertions.toBeVisible()`](/api/class-locatorassertions#locator-assertions-to-be-visible) | 元素可见 |
| [`locatorAssertions.toContainText()`](/api/class-locatorassertions#locator-assertions-to-contain-text) | 元素包含文本 |
| [`locatorAssertions.toHaveAttribute()`](/api/class-locatorassertions#locator-assertions-to-have-attribute) | 元素具有属性 |
| [`locatorAssertions.toHaveCount()`](/api/class-locatorassertions#locator-assertions-to-have-count) | 元素列表具有给定长度 |
| [`locatorAssertions.toHaveText()`](/api/class-locatorassertions#locator-assertions-to-have-text) | 元素匹配文本 |
| [`locatorAssertions.toHaveValue()`](/api/class-locatorassertions#locator-assertions-to-have-value) | 输入元素具有值 |
| [`pageAssertions.toHaveTitle()`](/api/class-pageassertions#page-assertions-to-have-title) | 页面具有标题 |
| [`pageAssertions.toHaveURL()`](/api/class-pageassertions#page-assertions-to-have-url) | 页面具有 URL |

Playwright 还包含通用匹配器，如 `toEqual`、`toContain`、`toBeTruthy`，可用于断言任何条件。这些断言不使用 `await` 关键字，因为它们对已有值执行即时同步检查。

```js
expect(success).toBeTruthy();
```

### 测试隔离

Playwright Test 基于[测试夹具](./test-fixtures.md)的概念，例如[内置的 page 夹具](./test-fixtures#built-in-fixtures)，它会传递到你的测试中。页面之间通过[浏览器上下文](./browser-contexts)相互隔离，这相当于一个全新的浏览器配置文件。每个测试都获得一个全新的环境，即使多个测试在单个浏览器中运行也是如此。

::: code-group

```js [tests/example.spec.ts]
import { test } from '@playwright/test';

test('example test', async ({ page }) => {
  // "page" 属于一个隔离的 BrowserContext，专为此测试创建。
});

test('another test', async ({ page }) => {
  // 第二个测试中的 "page" 与第一个测试完全隔离。
});
```

:::

### 使用测试钩子

你可以使用各种[测试钩子](./api/class-test.md)，例如 `test.describe` 用于声明测试组，`test.beforeEach` 和 `test.afterEach` 在每个测试之前/之后执行。其他钩子包括 `test.beforeAll` 和 `test.afterAll`，它们在每个工作进程的所有测试之前/之后执行一次。

::: code-group

```js [tests/example.spec.ts]
import { test, expect } from '@playwright/test';

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    // 在每个测试之前转到起始 URL。
    await page.goto('https://playwright.dev/');
  });

  test('main navigation', async ({ page }) => {
    // 断言使用 expect API。
    await expect(page).toHaveURL('https://playwright.dev/');
  });
});
```

:::

## 下一步
- [运行单个测试、多个测试、有头模式](./running-tests.md)
- [使用 Codegen 生成测试](./codegen-intro.md)
- [查看测试的追踪记录](./trace-viewer-intro.md)
- [探索 UI 模式](./test-ui-mode.md)
- [使用 GitHub Actions 在 CI 上运行测试](./ci-intro.md)
