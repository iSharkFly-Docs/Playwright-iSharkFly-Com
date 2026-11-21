---
title: "执行 JavaScript"
---

# 执行 JavaScript

## 简介

Playwright 脚本在你的 Playwright 环境中运行。你的页面脚本在浏览器页面环境中运行。这些环境不交叉，它们在不同的虚拟机、不同的进程中运行，甚至可能在不同的计算机上运行。

[`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) API 可以在网页上下文中运行 JavaScript 函数，并将结果返回到 Playwright 环境。浏览器全局对象如 `window` 和 `document` 可以在 `evaluate` 中使用。

```csharp
var href = await page.EvaluateAsync<string>("document.location.href");
```

如果结果是 Promise 或函数是异步的，evaluate 将自动等待直到它被解决：

```csharp
int status = await page.EvaluateAsync<int>(@"async () => {
  const response = await fetch(location.href);
  return response.status;
}");
```

## 不同的环境

被执行的脚本在浏览器环境中运行，而你的测试在测试环境中运行。这意味着你不能在页面中使用测试中的变量，反之亦然。相反，你应该将它们作为参数显式传递。

以下代码片段是**错误的**，因为它直接使用了变量：

```csharp
var data = "some data";
var result = await page.EvaluateAsync(@"() => {
  // 错误：网页中没有 'data'。
  window.myApp.use(data);
}");
```

以下代码片段是**正确的**，因为它将值作为参数显式传递：

```csharp
var data = "some data";
// 将 |data| 作为参数传递。
var result = await page.EvaluateAsync("data => { window.myApp.use(data); }", data);
```

## 执行参数

Playwright 的执行方法如 [`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) 接受一个可选的单一参数。这个参数可以是[可序列化]值和 [JSHandle](/dotnet/api/class-jshandle) 实例的混合。句柄会自动转换为它们所代表的值。

```csharp
// 原始值。
await page.EvaluateAsync<int>("num => num", 42);

// 数组。
await page.EvaluateAsync<int[]>("array => array.length", new[] { 1, 2, 3 });

// 对象。
await page.EvaluateAsync<object>("object => object.foo", new { foo = "bar" });

// 单个句柄。
var button = await page.EvaluateHandleAsync("window.button");
await page.EvaluateAsync<IJSHandle>("button => button.textContent", button);

// 使用 JSHandle.EvaluateAsync 的替代写法。
await button.EvaluateAsync<string>("(button, from) => button.textContent.substring(from)", 5);

// 具有多个句柄的对象。
var button1 = await page.EvaluateHandleAsync("window.button1");
var button2 = await page.EvaluateHandleAsync("window.button2");
await page.EvaluateAsync("o => o.button1.textContent + o.button2.textContent", new { button1, button2 });

// 对象解构可用。注意属性名称必须匹配
// 解构对象和参数之间的名称。
// 还要注意必需的括号。
await page.EvaluateAsync("({ button1, button2 }) => button1.textContent + button2.textContent", new { button1, button2 });

// 数组也可以使用。解构时可以使用任意名称。
// 注意必需的括号。
await page.EvaluateAsync("([b1, b2]) => b1.textContent + b2.textContent", new[] { button1, button2 });

// 可序列化值和句柄的任意混合都可以。
await page.EvaluateAsync("x => x.button1.textContent + x.list[0].textContent + String(x.foo)", new { button1, list = new[] { button2 }, foo = null as object });
```

## 初始化脚本

有时在页面开始加载之前执行一些操作很方便。例如，你可能想要设置一些模拟或测试数据。

在这种情况下，使用 [`Page.AddInitScriptAsync()`](/dotnet/api/class-page#page-add-init-script) 或 [`BrowserContext.AddInitScriptAsync()`](/dotnet/api/class-browsercontext#browser-context-add-init-script)。在下面的示例中，我们将用一个常量值替换 `Math.random()`。

首先，创建一个包含模拟的 `preload.js` 文件。

接下来，将初始化脚本添加到页面。

```csharp
// 在你的测试中，假设 "preload.js" 文件在 "mocks" 目录中。
await Page.AddInitScriptAsync(scriptPath: "mocks/preload.js");
```
