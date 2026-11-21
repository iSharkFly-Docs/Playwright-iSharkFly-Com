---
title: "断言"
---

# 断言

## 简介

Playwright 以 `expect` 函数的形式包含测试断言。要进行断言，调用 `expect(value)` 并选择一个反映预期的匹配器。有许多[通用匹配器](./api/class-genericassertions.md)，如 `toEqual`、`toContain`、`toBeTruthy`，可用于断言任何条件。

```js
expect(success).toBeTruthy();
```

Playwright 还包含 Web 专用的[异步匹配器](./api/class-locatorassertions.md)，它们会等待直到满足预期条件。请看以下示例：

```js
await expect(page.getByTestId('status')).toHaveText('Submitted');
```

Playwright 将持续重新测试具有测试 id `status` 的元素，直到获取的元素具有 `"Submitted"` 文本。它会反复重新获取元素并检查，直到满足条件或达到超时时间。你可以传递此超时时间，或通过测试配置中的 [`testConfig.expect`](/api/class-testconfig#test-config-expect) 值进行一次性配置。

默认情况下，断言的超时时间设置为 5 秒。了解更多关于[各种超时时间](./test-timeouts.md)的信息。

## 自动重试断言

以下断言会重试，直到断言通过或达到断言超时时间。
注意，重试断言是异步的，所以你必须 `await` 它们。

| 断言 | 描述 |
| :- | :- |
| [await expect(locator).toBeAttached()](./api/class-locatorassertions.md#locator-assertions-to-be-attached) | 元素已附加 |
| [await expect(locator).toBeChecked()](./api/class-locatorassertions.md#locator-assertions-to-be-checked) | 复选框已选中 |
| [await expect(locator).toBeDisabled()](./api/class-locatorassertions.md#locator-assertions-to-be-disabled) | 元素已禁用 |
| [await expect(locator).toBeEditable()](./api/class-locatorassertions.md#locator-assertions-to-be-editable) | 元素可编辑 |
| [await expect(locator).toBeEmpty()](./api/class-locatorassertions.md#locator-assertions-to-be-empty) | 容器为空 |
| [await expect(locator).toBeEnabled()](./api/class-locatorassertions.md#locator-assertions-to-be-enabled) | 元素已启用 |
| [await expect(locator).toBeFocused()](./api/class-locatorassertions.md#locator-assertions-to-be-focused) | 元素已获得焦点 |
| [await expect(locator).toBeHidden()](./api/class-locatorassertions.md#locator-assertions-to-be-hidden) | 元素不可见 |
| [await expect(locator).toBeInViewport()](./api/class-locatorassertions.md#locator-assertions-to-be-in-viewport) | 元素在视口内 |
| [await expect(locator).toBeVisible()](./api/class-locatorassertions.md#locator-assertions-to-be-visible) | 元素可见 |
| [await expect(locator).toContainText()](./api/class-locatorassertions.md#locator-assertions-to-contain-text) | 元素包含文本 |
| [await expect(locator).toContainClass()](./api/class-locatorassertions.md#locator-assertions-to-contain-class) | 元素具有指定的 CSS 类 |
| [await expect(locator).toHaveAccessibleDescription()](./api/class-locatorassertions.md#locator-assertions-to-have-accessible-description) | 元素具有匹配的[可访问描述](https://w3c.github.io/accname/#dfn-accessible-description) |
| [await expect(locator).toHaveAccessibleName()](./api/class-locatorassertions.md#locator-assertions-to-have-accessible-name) | 元素具有匹配的[可访问名称](https://w3c.github.io/accname/#dfn-accessible-name) |
| [await expect(locator).toHaveAttribute()](./api/class-locatorassertions.md#locator-assertions-to-have-attribute) | 元素具有 DOM 属性 |
| [await expect(locator).toHaveClass()](./api/class-locatorassertions.md#locator-assertions-to-have-class) | 元素具有指定的 CSS 类属性 |
| [await expect(locator).toHaveCount()](./api/class-locatorassertions.md#locator-assertions-to-have-count) | 列表具有确切数量的子元素 |
| [await expect(locator).toHaveCSS()](./api/class-locatorassertions.md#locator-assertions-to-have-css) | 元素具有 CSS 属性 |
| [await expect(locator).toHaveId()](./api/class-locatorassertions.md#locator-assertions-to-have-id) | 元素具有 ID |
| [await expect(locator).toHaveJSProperty()](./api/class-locatorassertions.md#locator-assertions-to-have-js-property) | 元素具有 JavaScript 属性 |
| [await expect(locator).toHaveRole()](./api/class-locatorassertions.md#locator-assertions-to-have-role) | 元素具有特定的 [ARIA 角色](https://www.w3.org/TR/wai-aria-1.2/#roles) |
| [await expect(locator).toHaveScreenshot()](./api/class-locatorassertions.md#locator-assertions-to-have-screenshot-1) | 元素具有截图 |
| [await expect(locator).toHaveText()](./api/class-locatorassertions.md#locator-assertions-to-have-text) | 元素匹配文本 |
| [await expect(locator).toHaveValue()](./api/class-locatorassertions.md#locator-assertions-to-have-value) | 输入框具有值 |
| [await expect(locator).toHaveValues()](./api/class-locatorassertions.md#locator-assertions-to-have-values) | 选择框已选中选项 |
| [await expect(locator).toMatchAriaSnapshot()](./api/class-locatorassertions.md#locator-assertions-to-match-aria-snapshot) | 元素匹配 Aria 快照 |
| [await expect(page).toMatchAriaSnapshot()](./api/class-pageassertions.md#page-assertions-to-match-aria-snapshot) | 页面匹配 Aria 快照 |
| [await expect(page).toHaveScreenshot()](./api/class-pageassertions.md#page-assertions-to-have-screenshot-1) | 页面具有截图 |
| [await expect(page).toHaveTitle()](./api/class-pageassertions.md#page-assertions-to-have-title) | 页面具有标题 |
| [await expect(page).toHaveURL()](./api/class-pageassertions.md#page-assertions-to-have-url) | 页面具有 URL |
| [await expect(response).toBeOK()](./api/class-apiresponseassertions.md#api-response-assertions-to-be-ok) | 响应状态为 OK |

## 非重试断言

这些断言允许测试任何条件，但不会自动重试。大多数时候，网页异步显示信息，使用非重试断言可能会导致测试不稳定。

尽可能优先使用[自动重试](#自动重试断言)断言。对于需要重试的更复杂断言，请使用 [`expect.poll`](#expectpoll) 或 [`expect.toPass`](#expecttopass)。

| 断言 | 描述 |
| :- | :- |
| [`genericAssertions.toBe()`](/api/class-genericassertions#generic-assertions-to-be) | 值相同 |
| [`genericAssertions.toBeCloseTo()`](/api/class-genericassertions#generic-assertions-to-be-close-to) | 数字近似相等 |
| [`genericAssertions.toBeDefined()`](/api/class-genericassertions#generic-assertions-to-be-defined) | 值不是 `undefined` |
| [`genericAssertions.toBeFalsy()`](/api/class-genericassertions#generic-assertions-to-be-falsy) | 值为假值，例如 `false`、`0`、`null` 等 |
| [`genericAssertions.toBeGreaterThan()`](/api/class-genericassertions#generic-assertions-to-be-greater-than) | 数字大于 |
| [`genericAssertions.toBeGreaterThanOrEqual()`](/api/class-genericassertions#generic-assertions-to-be-greater-than-or-equal) | 数字大于或等于 |
| [`genericAssertions.toBeInstanceOf()`](/api/class-genericassertions#generic-assertions-to-be-instance-of) | 对象是某个类的实例 |
| [`genericAssertions.toBeLessThan()`](/api/class-genericassertions#generic-assertions-to-be-less-than) | 数字小于 |
| [`genericAssertions.toBeLessThanOrEqual()`](/api/class-genericassertions#generic-assertions-to-be-less-than-or-equal) | 数字小于或等于 |
| [`genericAssertions.toBeNaN()`](/api/class-genericassertions#generic-assertions-to-be-na-n) | 值是 `NaN` |
| [`genericAssertions.toBeNull()`](/api/class-genericassertions#generic-assertions-to-be-null) | 值是 `null` |
| [`genericAssertions.toBeTruthy()`](/api/class-genericassertions#generic-assertions-to-be-truthy) | 值为真值，即不是 `false`、`0`、`null` 等 |
| [`genericAssertions.toBeUndefined()`](/api/class-genericassertions#generic-assertions-to-be-undefined) | 值是 `undefined` |
| [`genericAssertions.toContain()`](/api/class-genericassertions#generic-assertions-to-contain-1) | 字符串包含子字符串 |
| [`genericAssertions.toContain()`](/api/class-genericassertions#generic-assertions-to-contain-2) | 数组或集合包含元素 |
| [`genericAssertions.toContainEqual()`](/api/class-genericassertions#generic-assertions-to-contain-equal) | 数组或集合包含相似元素 |
| [`genericAssertions.toEqual()`](/api/class-genericassertions#generic-assertions-to-equal) | 值相似 - 深度相等和模式匹配 |
| [`genericAssertions.toHaveLength()`](/api/class-genericassertions#generic-assertions-to-have-length) | 数组或字符串具有长度 |
| [`genericAssertions.toHaveProperty()`](/api/class-genericassertions#generic-assertions-to-have-property) | 对象具有属性 |
| [`genericAssertions.toMatch()`](/api/class-genericassertions#generic-assertions-to-match) | 字符串匹配正则表达式 |
| [`genericAssertions.toMatchObject()`](/api/class-genericassertions#generic-assertions-to-match-object) | 对象包含指定属性 |
| [`genericAssertions.toStrictEqual()`](/api/class-genericassertions#generic-assertions-to-strict-equal) | 值相似，包括属性类型 |
| [`genericAssertions.toThrow()`](/api/class-genericassertions#generic-assertions-to-throw) | 函数抛出错误 |

## 非对称匹配器

这些表达式可以嵌套在其他断言中，以允许更宽松地匹配给定条件。

| 匹配器 | 描述 |
| :- | :- |
| [expect.any()](./api/class-genericassertions.md#generic-assertions-any) | 匹配类/原始类型的任何实例 |
| [expect.anything()](./api/class-genericassertions.md#generic-assertions-anything) | 匹配任何内容 |
| [expect.arrayContaining()](./api/class-genericassertions.md#generic-assertions-array-containing) | 数组包含特定元素 |
| [expect.arrayOf()](./api/class-genericassertions.md#generic-assertions-array-of) | 数组包含特定类型的元素 |
| [expect.closeTo()](./api/class-genericassertions.md#generic-assertions-close-to) | 数字近似相等 |
| [expect.objectContaining()](./api/class-genericassertions.md#generic-assertions-object-containing) | 对象包含特定属性 |
| [expect.stringContaining()](./api/class-genericassertions.md#generic-assertions-string-containing) | 字符串包含子字符串 |
| [expect.stringMatching()](./api/class-genericassertions.md#generic-assertions-string-matching) | 字符串匹配正则表达式 |

## 否定匹配器

通常，我们可以通过在匹配器前面添加 `.not` 来期望相反的结果为真：

```js
expect(value).not.toEqual(0);
await expect(locator).not.toContainText('some text');
```

## 软断言

默认情况下，失败的断言会终止测试执行。Playwright 也支持*软断言*：失败的软断言**不会**终止测试执行，但会将测试标记为失败。

```js
// 进行一些检查，失败时不会停止测试...
await expect.soft(page.getByTestId('status')).toHaveText('Success');
await expect.soft(page.getByTestId('eta')).toHaveText('1 day');

// ... 然后继续测试以检查更多内容。
await page.getByRole('link', { name: 'next page' }).click();
await expect.soft(page.getByRole('heading', { name: 'Make another order' })).toBeVisible();
```

在测试执行的任何时刻，你都可以检查是否有软断言失败：

```js
// 进行一些检查，失败时不会停止测试...
await expect.soft(page.getByTestId('status')).toHaveText('Success');
await expect.soft(page.getByTestId('eta')).toHaveText('1 day');

// 如果有软断言失败，则避免继续运行。
expect(test.info().errors).toHaveLength(0);
```

注意，软断言仅适用于 Playwright 测试运行器。

## 自定义 expect 消息

你可以将自定义 expect 消息指定为 `expect` 函数的第二个参数，例如：

```js
await expect(page.getByText('Name'), 'should be logged in').toBeVisible();
```

此消息将显示在报告器中，无论 expect 通过还是失败，为断言提供更多上下文。

当 expect 通过时，你可能会看到这样的成功步骤：

```txt
✅ should be logged in    @example.spec.ts:18
```

当 expect 失败时，错误将如下所示：

```bash
    Error: should be logged in

    Call log:
      - expect.toBeVisible with timeout 5000ms
      - waiting for "getByText('Name')"


      2 |
      3 | test('example test', async({ page }) => {
    > 4 |   await expect(page.getByText('Name'), 'should be logged in').toBeVisible();
        |                                                                  ^
      5 | });
      6 |
```

软断言也支持自定义消息：

```js
expect.soft(value, 'my soft assertion').toBe(56);
```

## expect.configure

你可以创建自己的预配置 `expect` 实例，使其具有自己的默认值，如 `timeout` 和 `soft`。

```js
const slowExpect = expect.configure({ timeout: 10000 });
await slowExpect(locator).toHaveText('Submit');

// 始终进行软断言。
const softExpect = expect.configure({ soft: true });
await softExpect(locator).toHaveText('Submit');
```

## expect.poll

你可以使用 `expect.poll` 将任何同步 `expect` 转换为异步轮询。

以下方法将轮询给定函数，直到它返回 HTTP 状态 200：

```js
await expect.poll(async () => {
  const response = await page.request.get('https://api.example.com');
  return response.status();
}, {
  // 用于报告的自定义 expect 消息，可选。
  message: 'make sure API eventually succeeds',
  // 轮询 10 秒；默认为 5 秒。传递 0 禁用超时。
  timeout: 10000,
}).toBe(200);
```

你还可以指定自定义轮询间隔：

```js
await expect.poll(async () => {
  const response = await page.request.get('https://api.example.com');
  return response.status();
}, {
  // 探测，等待 1 秒，探测，等待 2 秒，探测，等待 10 秒，探测，等待 10 秒，探测
  // ... 默认为 [100, 250, 500, 1000]。
  intervals: [1_000, 2_000, 10_000],
  timeout: 60_000
}).toBe(200);
```

你可以将 `expect.soft` 与 `expect.poll` 结合使用，在轮询逻辑中执行软断言。这允许测试即使轮询内的断言失败也能继续。

```js
await expect.soft.poll(async () => {
  const response = await page.request.get('https://api.example.com');
  return response.status();
}).toBe(200);
```

`expect.configure({ soft: true })` 也可以与 `expect.poll` 链式使用，当你想重用配置的实例时很有用。

```js
const softExpect = expect.configure({ soft: true });
await softExpect.poll(async () => {
  const response = await page.request.get('https://api.example.com');
  return response.status();
}).toBe(200);
```

## expect.toPass

你可以重试代码块，直到它们成功通过。

```js
await expect(async () => {
  const response = await page.request.get('https://api.example.com');
  expect(response.status()).toBe(200);
}).toPass();
```

你还可以指定自定义超时和重试间隔：

```js
await expect(async () => {
  const response = await page.request.get('https://api.example.com');
  expect(response.status()).toBe(200);
}).toPass({
  // 探测，等待 1 秒，探测，等待 2 秒，探测，等待 10 秒，探测，等待 10 秒，探测
  // ... 默认为 [100, 250, 500, 1000]。
  intervals: [1_000, 2_000, 10_000],
  timeout: 60_000
});
```

注意，默认情况下 `toPass` 的超时为 0，不遵循自定义 [expect 超时](./test-timeouts.md#expect-超时)。

## 使用 expect.extend 添加自定义匹配器

你可以通过提供自定义匹配器来扩展 Playwright 断言。这些匹配器将在 `expect` 对象上可用。

在这个示例中，我们添加了一个自定义的 `toHaveAmount` 函数。自定义匹配器应返回一个 `pass` 标志，指示断言是否通过，以及一个 `message` 回调，用于断言失败时。

::: code-group

```js [fixtures.ts]
import { expect as baseExpect } from '@playwright/test';
import type { Locator } from '@playwright/test';

export { test } from '@playwright/test';

export const expect = baseExpect.extend({
  async toHaveAmount(locator: Locator, expected: number, options?: { timeout?: number }) {
    const assertionName = 'toHaveAmount';
    let pass: boolean;
    let matcherResult: any;
    try {
      const expectation = this.isNot ? baseExpect(locator).not : baseExpect(locator);
      await expectation.toHaveAttribute('data-amount', String(expected), options);
      pass = true;
    } catch (e: any) {
      matcherResult = e.matcherResult;
      pass = false;
    }

    if (this.isNot) {
      pass =!pass;
    }

    const message = pass
      ? () => this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: not ${this.utils.printExpected(expected)}\n` +
          (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '')
      : () =>  this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: ${this.utils.printExpected(expected)}\n` +
          (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '');

    return {
      message,
      pass,
      name: assertionName,
      expected,
      actual: matcherResult?.actual,
    };
  },
});
```

:::

现在我们可以在测试中使用 `toHaveAmount`。

::: code-group

```js [example.spec.ts]
import { test, expect } from './fixtures';

test('amount', async () => {
  await expect(page.locator('.cart')).toHaveAmount(4);
});
```

:::

### 泛型自定义匹配器

TypeScript 无法将类型参数从匹配器实现传递到调用点。如果匹配器对接收的值是泛型的，当你在 `expect` 上调用匹配器时，其类型参数会变成 `unknown`。

要在匹配器参数中获取接收值的类型，请在 `PlaywrightTest.Matchers` 接口中声明匹配器签名。它的第二个类型参数 `T` 是传递给 `expect` 的值的类型。注意，泛型匹配器还需要显式的 `this` 参数类型来访问 `this.utils` 和其他匹配器状态。

::: code-group

```js [fixtures.ts]
import { expect as baseExpect } from '@playwright/test';
import type { ExpectMatcherState } from '@playwright/test';

export const expect = baseExpect.extend({
  toSatisfy<T>(this: ExpectMatcherState, received: T, predicate: (value: T) => boolean) {
    const pass = predicate(received);
    return {
      message: () => `expected ${this.utils.printReceived(received)} to satisfy the predicate`,
      pass,
    };
  },
});

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T = unknown> {
      toSatisfy(predicate: (value: T) => boolean): R;
    }
  }
}
```

:::

现在 `value` 参数具有接收值的类型。

::: code-group

```js [example.spec.ts]
import { test, expect } from './fixtures';

test('generic matcher', async () => {
  expect('hello').toSatisfy(value => value.startsWith('h'));
  expect(42).toSatisfy(value => value > 40);
});
```

:::

### 与 expect 库的兼容性

::: info
不要将 Playwright 的 `expect` 与 [`expect` 库](https://jestjs.io/docs/expect)混淆。后者与 Playwright 测试运行器没有完全集成，所以确保使用 Playwright 自己的 `expect`。
:::

### 从多个模块合并自定义匹配器

你可以从多个文件或模块合并自定义匹配器。

::: code-group

```js [fixtures.ts]
import { mergeTests, mergeExpects } from '@playwright/test';
import { test as dbTest, expect as dbExpect } from 'database-test-utils';
import { test as a11yTest, expect as a11yExpect } from 'a11y-test-utils';

export const expect = mergeExpects(dbExpect, a11yExpect);
export const test = mergeTests(dbTest, a11yTest);
```

:::

::: code-group

```js [test.spec.ts]
import { test, expect } from './fixtures';

test('passes', async ({ database }) => {
  await expect(database).toHaveDatabaseUser('admin');
});
```

:::
