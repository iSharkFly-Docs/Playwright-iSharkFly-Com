---
title: "从 Testing Library 迁移"
---

# 从 Testing Library 迁移

## 迁移原则

本指南描述了从 [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro/)、[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) 和 [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro) 迁移到 Playwright 的[组件测试](./test-components)。

::: info
如果你在浏览器中使用 DOM Testing Library（例如，你使用 webpack 打包端到端测试），你可以直接切换到 Playwright Test。下面的示例专注于组件测试，但对于端到端测试，你只需要将 `await mount` 替换为 `await page.goto('http://localhost:3000/')` 来打开被测页面。
:::

Playwright 通过 **story** 渲染组件——一个将组件嵌入特定场景的小型包装器——由你自己的开发服务器从 **gallery** 页面提供服务。Testing Library 在测试中内联调用 `render()`，而 Playwright 将该设置移到 story 中，并在测试中通过 id 引用它。请参阅[组件测试](./test-components)了解如何设置 gallery。

## 速查表

| Testing Library                                                                 | Playwright                                                             |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [screen](https://testing-library.com/docs/queries/about#screen)                 | [page](./api/class-page) 和 [component](./api/class-locator)          |
| [queries](https://testing-library.com/docs/queries/about)                       | [locators](./locators)                                                 |
| [async helpers](https://testing-library.com/docs/dom-testing-library/api-async) | [assertions](./test-assertions)                                        |
| [user events](https://testing-library.com/docs/user-event/intro)                | [actions](./api/class-locator)                                         |
| `await user.click(screen.getByText('Click me'))`                                | `await component.getByText('Click me').click()`                        |
| `await user.click(await screen.findByText('Click me'))`                         | `await component.getByText('Click me').click()`                        |
| `await user.type(screen.getByLabelText('Password'), 'secret')`                  | `await component.getByLabel('Password').fill('secret')`                |
| `expect(screen.getByLabelText('Password')).toHaveValue('secret')`               | `await expect(component.getByLabel('Password')).toHaveValue('secret')` |
| `screen.getByRole('button', { pressed: true })`                                 | `component.getByRole('button', { pressed: true })`                     |
| `screen.getByLabelText('...')`                                                  | `component.getByLabel('...')`                                          |
| `screen.queryByPlaceholderText('...')`                                          | `component.getByPlaceholder('...')`                                    |
| `screen.findByText('...')`                                                      | `component.getByText('...')`                                           |
| `screen.getByTestId('...')`                                                     | `component.getByTestId('...')`                                         |
| `render(<Component />);`                                                        | story 导出 + `await mount('Component/Default');`                   |
| `const { unmount } = render(<Component />);`                                    | `const component = await mount('...'); await component.unmount();`     |
| `const { rerender } = render(<Component />);`                                   | `const component = await mount('...'); await component.update(props);` |

## 示例

Testing Library:

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('sign in', async () => {
  // 设置页面。
  const user = userEvent.setup();
  render(<SignInPage />);

  // 执行操作。
  await user.type(screen.getByLabelText('Username'), 'John');
  await user.type(screen.getByLabelText('Password'), 'secret');
  await user.click(screen.getByRole('button', { name: 'Sign in' }));

  // 通过等待"欢迎"消息出现来验证登录状态。
  expect(await screen.findByText('Welcome, John')).toBeInTheDocument();
});
```

逐行迁移到 Playwright Test。首先，将场景从测试移到组件旁边的 story 中：

::: code-group

```js [src/pages/SignInPage.story.tsx]
import { SignInPage } from './SignInPage';

export const Default = () => <SignInPage />; // 1
```

:::

然后测试通过 id 挂载该 story：

```js
const { test, expect } = require('@playwright/test'); // 2

test('sign in', async ({ mount }) => { // 3
  // 设置页面。
  const component = await mount('pages/SignInPage/Default'); // 4

  // 执行操作。
  await component.getByLabel('Username').fill('John'); // 5
  await component.getByLabel('Password').fill('secret');
  await component.getByRole('button', { name: 'Sign in' }).click();

  // 通过等待"欢迎"消息出现来验证登录状态。
  await expect(component.getByText('Welcome, John')).toBeVisible(); // 6
});
```

迁移要点（请参阅 Playwright Test 代码片段中的内联注释）：
1. 无论 `render()` 以前内联设置什么——props、providers、mock 数据——都变成 story 导出。Story 在浏览器中运行，因此活动对象不再需要传递到测试中。
1. 从 `@playwright/test` 导入所有内容，适用于组件测试和端到端测试。
1. 测试函数会获得一个与其他测试隔离的 `page`，以及在此页面中渲染 story 的 `mount`。这是 Playwright Test 中许多[有用的 fixtures](./api/class-fixtures) 中的两个。
1. 将 `render` 替换为 [`fixtures.mount()`](/api/class-fixtures#fixtures-mount)，它接受一个 story id 并返回一个作用域为 gallery 根的[组件定位器](./locators)。
1. 使用通过 [`locator.locator()`](/api/class-locator#locator-locator) 或 [`page.locator()`](/api/class-page#page-locator) 创建的定位器来执行大多数操作。
1. 使用[断言](./test-assertions)来验证状态。

## 迁移查询

所有像 `getBy...`、`findBy...`、`queryBy...` 及其多元素对应方法的查询都被 `component.getBy...` 定位器替代。定位器始终自动等待并在需要时重试，因此你不必担心选择正确的方法。当你想执行[列表操作](./locators#lists)时，例如断言文本列表，Playwright 会自动执行多元素操作。

## 替换 `waitFor`

Playwright 包含会自动等待条件满足的[断言](./test-assertions)，因此你通常不需要显式的 `waitFor`/`waitForElementToBeRemoved` 调用。

```js
// Testing Library
await waitFor(() => {
  expect(getByText('the lion king')).toBeInTheDocument();
});
await waitForElementToBeRemoved(() => queryByText('the mummy'));

// Playwright
await expect(page.getByText('the lion king')).toBeVisible();
await expect(page.getByText('the mummy')).toBeHidden();
```

当你找不到合适的断言时，使用 [`expect.poll`](./test-assertions#expectpoll) 代替。

```js
await expect.poll(async () => {
  const response = await page.request.get('https://api.example.com');
  return response.status();
}).toBe(200);
```

## 替换 `within`

你可以使用 [`locator.locator()`](/api/class-locator#locator-locator) 方法在另一个定位器内部创建定位器。

```js
// Testing Library
const messages = screen.getByTestId('messages');
const helloMessage = within(messages).getByText('hello');

// Playwright
const messages = component.getByTestId('messages');
const helloMessage = messages.getByText('hello');
```

## Playwright Test 的超强能力

一旦使用 Playwright Test，你将获得很多功能！
- 完全零配置的 TypeScript 支持
- 在**任何流行操作系统**（Windows、macOS、Ubuntu）上的**所有 Web 引擎**（Chrome、Firefox、Safari）上运行测试
- 完全支持多源、[(i)frames](./api/class-frame)、[标签页和上下文](./pages)
- 在多个浏览器上并行隔离运行测试
- 内置测试[产物收集](./test-use-options.md#recording-options)

你还将获得与 Playwright Test 捆绑在一起的所有这些精彩工具：
- [Visual Studio Code 集成](./getting-started-vscode.md)
- [UI 模式](./test-ui-mode.md)用于调试测试，具有时间旅行体验和监视模式。
- [Playwright Inspector](./debug.md#playwright-inspector)
- [Playwright Test 代码生成](./codegen-intro.md)
- [Playwright Tracing](./trace-viewer.md) 用于事后调试

## 延伸阅读

了解更多关于 Playwright Test 运行器的信息：
- [入门指南](./intro)
- [组件测试](./test-components)
- [定位器](./locators.md)
- [断言](./test-assertions)
- [自动等待](./actionability)
