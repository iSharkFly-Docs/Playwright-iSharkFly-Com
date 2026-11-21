---
title: "可扩展性"
---

# 可扩展性

## 自定义选择器引擎

Playwright 支持自定义选择器引擎，通过 [`selectors.register()`](/python/api/class-selectors#selectors-register) 注册。

选择器引擎应具有以下属性：
- `query` 函数用于查询相对于 `root` 匹配 `selector` 的第一个元素。
- `queryAll` 函数用于查询相对于 `root` 匹配 `selector` 的所有元素。

默认情况下，引擎直接在框架的 JavaScript 上下文中运行，例如可以调用应用程序定义的函数。要将引擎与框架中的任何 JavaScript 隔离，但保留对 DOM 的访问，请使用 `{contentScript: true}` 选项注册引擎。内容脚本引擎更安全，因为它受到保护，不会受到任何对全局对象的篡改，例如更改 `Node.prototype` 方法。所有内置选择器引擎都作为内容脚本运行。请注意，当引擎与其他自定义引擎一起使用时，不能保证作为内容脚本运行。

选择器必须在创建页面之前注册。

以下是一个注册基于标签名查询元素的选择器引擎的示例：

::: code-group

```python [Async]
tag_selector = """
    // 必须计算为选择器引擎实例。
    {
      // 返回根子树中第一个匹配给定选择器的元素。
      query(root, selector) {
        return root.querySelector(selector);
      },

      // 返回根子树中所有匹配给定选择器的元素。
      queryAll(root, selector) {
        return Array.from(root.querySelectorAll(selector));
      }
    }"""

# 注册引擎。选择器将以 "tag=" 为前缀。
await playwright.selectors.register("tag", tag_selector)

# 现在我们可以使用 "tag=" 选择器。
button = page.locator("tag=button")
await button.click()

# 我们可以将其与内置定位器组合。
await page.locator("tag=div").get_by_text("click me").click()

# 我们可以在任何支持选择器的方法中使用它。
button_count = await page.locator("tag=button").count()
```

```python [Sync]
tag_selector = """
    // 必须计算为选择器引擎实例。
    {
      // 返回根子树中第一个匹配给定选择器的元素。
      query(root, selector) {
        return root.querySelector(selector);
      },

      // 返回根子树中所有匹配给定选择器的元素。
      queryAll(root, selector) {
        return Array.from(root.querySelectorAll(selector));
      }
    }"""

# 注册引擎。选择器将以 "tag=" 为前缀。
playwright.selectors.register("tag", tag_selector)

# 现在我们可以使用 "tag=" 选择器。
button = page.locator("tag=button")
button.click()

# 我们可以将其与内置定位器组合。
page.locator("tag=div").get_by_text("click me").click()

# 我们可以在任何支持选择器的方法中使用它。
button_count = page.locator("tag=button").count()
```

:::
