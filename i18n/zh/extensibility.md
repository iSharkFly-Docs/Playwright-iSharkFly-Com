---
title: "可扩展性"
---

# 可扩展性

## 自定义选择器引擎

Playwright 支持自定义选择器引擎，通过 [`selectors.register()`](/api/class-selectors#selectors-register) 注册。

选择器引擎应具有以下属性：
- `query` 函数用于查询相对于 `root` 匹配 `selector` 的第一个元素。
- `queryAll` 函数用于查询相对于 `root` 匹配 `selector` 的所有元素。

默认情况下，引擎直接在框架的 JavaScript 上下文中运行，例如可以调用应用程序定义的函数。要将引擎与框架中的任何 JavaScript 隔离，但保留对 DOM 的访问，请使用 `{contentScript: true}` 选项注册引擎。内容脚本引擎更安全，因为它受到保护，不受全局对象篡改的影响，例如修改 `Node.prototype` 方法。所有内置选择器引擎都作为内容脚本运行。请注意，当引擎与其他自定义引擎一起使用时，不保证作为内容脚本运行。

选择器必须在创建页面之前注册。

以下是注册基于标签名查询元素的选择器引擎的示例：

::: code-group

```js [baseTest.ts]
import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';

// 必须是一个返回选择器引擎实例的函数。
const createTagNameEngine = () => ({
  // 返回 root 子树中匹配给定选择器的第一个元素。
  query(root, selector) {
    return root.querySelector(selector);
  },

  // 返回 root 子树中匹配给定选择器的所有元素。
  queryAll(root, selector) {
    return Array.from(root.querySelectorAll(selector));
  }
});

export const test = base.extend<{}, { selectorRegistration: void }>({
  // 每个 worker 注册一次选择器。
  selectorRegistration: [async ({ playwright }, use) => {
    // 注册引擎。选择器将以 "tag=" 为前缀。
    await playwright.selectors.register('tag', createTagNameEngine);
    await use();
  }, { scope: 'worker', auto: true }],
});
```

:::

::: code-group

```js [example.spec.ts]
import { test, expect } from './baseTest';

test('selector engine test', async ({ page }) => {
  // 现在我们可以使用 'tag=' 选择器了。
  const button = page.locator('tag=button');
  await button.click();

  // 我们可以将它与内置定位器结合使用。
  await page.locator('tag=div').getByText('Click me').click();

  // 我们可以在任何支持选择器的方法中使用它。
  await expect(page.locator('tag=button')).toHaveCount(3);
});
```

:::
