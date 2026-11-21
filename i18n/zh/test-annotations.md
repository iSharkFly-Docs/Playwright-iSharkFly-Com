---
title: "注解"
---

# 注解

## 简介

Playwright 支持在测试报告中显示标签和注解。

你可以随时添加自己的标签和注解，但 Playwright 自带一些内置的：
- [`test.skip()`](/api/class-test#test-skip) 将测试标记为不相关。Playwright 不会运行此测试。当测试在某些配置中不适用时使用此注解。
- [`test.fail()`](/api/class-test#test-fail) 将测试标记为预期失败。Playwright 将运行此测试并确保它确实失败。如果测试没有失败，Playwright 会报错。
- [`test.fixme()`](/api/class-test#test-fixme) 将测试标记为失败。与 `fail` 注解不同，Playwright 不会运行此测试。当运行测试很慢或会崩溃时使用 `fixme`。
- [`test.slow()`](/api/class-test#test-slow) 将测试标记为慢速，并将测试超时时间增加三倍。

注解可以添加到单个测试或一组测试上。

内置注解可以是条件性的，在这种情况下，当条件为真时应用，并且可能依赖于测试夹具。同一个测试上可以有多个注解，可能在不同的配置中。

## 聚焦测试

你可以聚焦某些测试。当有聚焦的测试时，只会运行这些测试。

```js
test.only('聚焦此测试', async ({ page }) => {
  // 仅在整个项目中运行聚焦的测试。
});
```

## 跳过测试

将测试标记为跳过。

```js
test.skip('跳过此测试', async ({ page }) => {
  // 此测试不会运行
});
```

## 条件跳过测试

你可以根据条件跳过某些测试。

```js
test('跳过此测试', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', '仍在开发中');
});
```

## 分组测试

你可以将测试分组，为它们提供一个逻辑名称，或将 before/after 钩子的作用域限定在该组内。

```js
import { test, expect } from '@playwright/test';

test.describe('两个测试', () => {
  test('第一个', async ({ page }) => {
    // ...
  });

  test('第二个', async ({ page }) => {
    // ...
  });
});
```

## 为测试添加标签

有时你想将测试标记为 `@fast` 或 `@slow`，然后在测试报告中按标签过滤。或者你可能只想运行具有特定标签的测试。

要为测试添加标签，可以在声明测试时提供额外的详细信息对象，或在测试标题中添加 `@` 标记。请注意，标签必须以 `@` 符号开头。

```js
import { test, expect } from '@playwright/test';

test('测试登录页面', {
  tag: '@fast',
}, async ({ page }) => {
  // ...
});

test('测试完整报告 @slow', async ({ page }) => {
  // ...
});
```

你还可以为组中的所有测试添加标签或提供多个标签：

```js
import { test, expect } from '@playwright/test';

test.describe('组', {
  tag: '@report',
}, () => {
  test('测试报告头部', async ({ page }) => {
    // ...
  });

  test('测试完整报告', {
    tag: ['@slow', '@vrt'],
  }, async ({ page }) => {
    // ...
  });
});
```

现在你可以使用 [`--grep`](./test-cli.md#all-options) 命令行选项运行具有特定标签的测试。

::: code-group

```bash [Bash]
npx playwright test --grep @fast
```

```powershell [PowerShell]
npx playwright test --grep "@fast"
```

```bat [Batch]
npx playwright test --grep @fast
```

:::

或者，如果你想相反，可以跳过具有特定标签的测试：

::: code-group

```bash [Bash]
npx playwright test --grep-invert @fast
```

```powershell [PowerShell]
npx playwright test --grep-invert "@fast"
```

```bat [Batch]
npx playwright test --grep-invert @fast
```

:::

要运行包含任一标签的测试（逻辑 `OR` 运算符）：

::: code-group

```bash [Bash]
npx playwright test --grep "@fast|@slow"
```

```powershell [PowerShell]
npx playwright test --grep --% "@fast^|@slow"
```

```bat [Batch]
npx playwright test --grep "@fast^|@slow"
```

:::

或使用正则表达式前瞻运行包含两个标签的测试（逻辑 `AND` 运算符）：

```bash
npx playwright test --grep "(?=.*@fast)(?=.*@slow)"
```

你还可以通过 [`testConfig.grep`](/api/class-testconfig#test-config-grep) 和 [`testProject.grep`](/api/class-testproject#test-project-grep) 在配置文件中过滤测试。

## 为测试添加注解

如果你想用比标签更实质性的内容来注解测试，可以在声明测试时这样做。注解有一个 `type` 和一个用于提供更多上下文的 `description`，可在报告器 API 中使用。Playwright 的内置 HTML 报告器会显示所有注解，除了那些 `type` 以 `_` 符号开头的注解。

例如，用问题 URL 注解测试：

```js
import { test, expect } from '@playwright/test';

test('测试登录页面', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/microsoft/playwright/issues/23180',
  },
}, async ({ page }) => {
  // ...
});
```

你还可以为组中的所有测试添加注解或提供多个注解：

```js
import { test, expect } from '@playwright/test';

test.describe('报告测试', {
  annotation: { type: 'category', description: 'report' },
}, () => {
  test('测试报告头部', async ({ page }) => {
    // ...
  });

  test('测试完整报告', {
    annotation: [
      { type: 'issue', description: 'https://github.com/microsoft/playwright/issues/23180' },
      { type: 'performance', description: '非常慢的测试！' },
    ],
  }, async ({ page }) => {
    // ...
  });
});
```

## 条件跳过一组测试

例如，你可以通过传递一个回调函数来仅在 Chromium 中运行一组测试。

::: code-group

```js [example.spec.ts]

test.describe('仅 chromium', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', '仅 Chromium！');

  test.beforeAll(async () => {
    // 此钩子仅在 Chromium 中运行。
  });

  test('测试 1', async ({ page }) => {
    // 此测试仅在 Chromium 中运行。
  });

  test('测试 2', async ({ page }) => {
    // 此测试仅在 Chromium 中运行。
  });
});
```

:::

## 在 `beforeEach` 钩子中使用 fixme

为了避免运行 `beforeEach` 钩子，你可以在钩子本身中放置注解。

::: code-group

```js [example.spec.ts]

test.beforeEach(async ({ page, isMobile }) => {
  test.fixme(isMobile, '设置页面在移动端尚不可用');

  await page.goto('http://localhost:3000/settings');
});

test('用户资料', async ({ page }) => {
  await page.getByText('My Profile').click();
  // ...
});
```

:::

## 运行时注解

当测试已经在运行时，你可以向 [`test.info().annotations`](./api/class-testinfo#test-info-annotations) 添加注解。

::: code-group

```js [example.spec.ts]

test('示例测试', async ({ page, browser }) => {
  test.info().annotations.push({
    type: 'browser version',
    description: browser.version(),
  });

  // ...
});
```

:::
