---
title: "扩展性"
---

# 扩展性

## 自定义选择器引擎

Playwright 支持通过 [`Selectors.RegisterAsync()`](/dotnet/api/class-selectors#selectors-register) 注册自定义选择器引擎。

选择器引擎应具有以下属性：
- `query` 函数用于查询相对于 `root` 匹配 `selector` 的第一个元素。
- `queryAll` 函数用于查询相对于 `root` 匹配 `selector` 的所有元素。

默认情况下，引擎直接在框架的 JavaScript 上下文中运行，例如可以调用
应用程序定义的函数。要将引擎与框架中的任何 JavaScript 隔离，但保留对 DOM 的访问，
请使用 `{contentScript: true}` 选项注册引擎。内容脚本引擎更安全，因为它受到保护，不会受到
对全局对象的任何篡改，例如更改 `Node.prototype` 方法。所有内置选择器引擎都作为
内容脚本运行。请注意，当引擎与其他自定义引擎一起使用时，不能保证作为内容脚本运行。

选择器必须在创建页面之前注册。

以下是注册基于标签名称查询元素的选择器引擎的示例：

```csharp
// 注册引擎。选择器将以 "tag=" 为前缀。
// 该脚本在页面上下文中执行。
await playwright.Selectors.RegisterAsync("tag", new() {
  Script = @"
  // 必须求值为一个选择器引擎实例。
  {
    // 返回 root 子树中匹配给定选择器的第一个元素。
    query(root, selector) {
      return root.querySelector(selector);
    },

    // 返回 root 子树中匹配给定选择器的所有元素。
    queryAll(root, selector) {
      return Array.from(root.querySelectorAll(selector));
    }
  }"
});

// 现在我们可以使用 "tag=" 选择器了。
await page.Locator("tag=button").ClickAsync();

// 我们可以将其与内置定位器结合使用。
await page.Locator("tag=div").GetByText("Click me").ClickAsync();
```
