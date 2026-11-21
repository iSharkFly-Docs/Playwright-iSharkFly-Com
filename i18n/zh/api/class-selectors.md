---
title: Selectors
outline: 2
---

# Selectors

<Badge type="info" text="新增于: v1.8" />

Selectors 可用于安装自定义选择器引擎。更多信息请参阅[扩展性](../extensibility.md)。

## 方法

### selectors.register() {#selectors-register}

<Badge type="info" text="新增于: v1.8" /> <Badge type="tip" text="async" />

选择器必须在创建页面之前注册。

**用法**

一个注册选择器引擎的示例，该引擎根据标签名称查询元素：

```js
const { selectors, firefox } = require('@playwright/test');  // 或者使用 'chromium' 或 'webkit'。

(async () => {
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

  // 注册引擎。选择器将以 "tag=" 为前缀。
  await selectors.register('tag', createTagNameEngine);

  const browser = await firefox.launch();
  const page = await browser.newPage();
  await page.setContent(`<div><button>Click me</button></div>`);

  // 使用带有其名称前缀的选择器。
  const button = page.locator('tag=button');
  // 我们可以将它与内置定位器组合使用。
  await page.locator('tag=div').getByText('Click me').click();
  // 可以在任何支持选择器的方法中使用。
  const buttonCount = await page.locator('tag=button').count();

  await browser.close();
})();
```

**参数**

- <a id="selectors-register-option-name"></a>`name` `string`

  在选择器中用作前缀的名称，例如 `{name: 'foo'}` 启用 `foo=myselectorbody` 选择器。只能包含 `[a-zA-Z0-9_]` 字符。
- <a id="selectors-register-option-script"></a>`script` `function() | string | Object`

  计算为选择器引擎实例的脚本。该脚本在页面上下文中执行。

  - `path` `path` *(可选)*

    JavaScript 文件的路径。如果 `path` 是相对路径，则相对于当前工作目录解析。可选。
  - `content` `string` *(可选)*

    原始脚本内容。可选。
- <a id="selectors-register-option-options"></a>`options` `Object` *(可选)*

  - <a id="selectors-register-option-content-script"></a>`contentScript` `boolean` *(可选)*

    是否在隔离的 JavaScript 环境中运行此选择器引擎。此环境可以访问相同的 DOM，但无法访问框架脚本中的任何 JavaScript 对象。默认为 `false`。请注意，当此引擎与其他已注册的引擎一起使用时，不能保证作为内容脚本运行。


### selectors.setTestIdAttribute() {#selectors-set-test-id-attribute}

<Badge type="info" text="新增于: v1.27" />

定义要在 [`page.getByTestId()`](/api/class-page#page-get-by-test-id) 中使用的自定义属性名称。默认使用 `data-testid`。

**参数**

- <a id="selectors-set-test-id-attribute-option-attribute-name"></a>`attributeName` `string`

  测试 ID 属性名称。要匹配具有多个属性之一的元素，请将它们作为逗号分隔的列表传递，例如 `"data-pw,data-ti"`。
