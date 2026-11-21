---
title: "执行 JavaScript"
---

# 执行 JavaScript

## 简介

Playwright 脚本在你的 Playwright 环境中运行。而你的页面脚本在浏览器页面环境中运行。这两个环境互不交叉，它们在不同的虚拟机、不同的进程中运行，甚至可能在不同的计算机上运行。

[`page.evaluate()`](/api/class-page#page-evaluate) API 可以在网页上下文中运行 JavaScript 函数，并将结果返回到 Playwright 环境。浏览器全局对象如 `window` 和 `document` 可以在 `evaluate` 中使用。

```js
const href = await page.evaluate(() => document.location.href);
```

如果返回值是 Promise 或者函数是异步的，evaluate 会自动等待直到其完成：

```js
const status = await page.evaluate(async () => {
  const response = await fetch(location.href);
  return response.status;
});
```

## 不同的环境

被执行的脚本在浏览器环境中运行，而你的测试在测试环境中运行。这意味着你不能在页面中使用测试中的变量，反之亦然。你应该将它们作为参数显式传递。

以下代码片段是**错误的**，因为它直接使用了变量：

```js
const data = 'some data';
const result = await page.evaluate(() => {
  // 错误：网页中没有 "data" 变量。
  window.myApp.use(data);
});
```

以下代码片段是**正确的**，因为它将值作为参数显式传递：

```js
const data = 'some data';
// 将 |data| 作为参数传递。
const result = await page.evaluate(data => {
  window.myApp.use(data);
}, data);
```

## 执行参数

Playwright 的执行方法如 [`page.evaluate()`](/api/class-page#page-evaluate) 接受一个可选参数。这个参数可以是 [Serializable] 值和 [JSHandle](/api/class-jshandle) 实例的混合。句柄会自动转换为它们所代表的值。

```js
// 基本类型值。
await page.evaluate(num => num, 42);

// 数组。
await page.evaluate(array => array.length, [1, 2, 3]);

// 对象。
await page.evaluate(object => object.foo, { foo: 'bar' });

// 单个句柄。
const button = await page.evaluateHandle('window.button');
await page.evaluate(button => button.textContent, button);

// 使用 JSHandle.evaluate 的替代写法。
await button.evaluate((button, from) => button.textContent.substring(from), 5);

// 包含多个句柄的对象。
const button1 = await page.evaluateHandle('window.button1');
const button2 = await page.evaluateHandle('window.button2');
await page.evaluate(
    o => o.button1.textContent + o.button2.textContent,
    { button1, button2 });

// 对象解构也可以使用。注意属性名必须在解构对象和参数之间匹配。
// 还要注意必需的括号。
await page.evaluate(
    ({ button1, button2 }) => button1.textContent + button2.textContent,
    { button1, button2 });

// 数组也同样适用。解构时可以使用任意名称。
// 注意必需的括号。
await page.evaluate(
    ([b1, b2]) => b1.textContent + b2.textContent,
    [button1, button2]);

// 可序列化值和句柄的任意组合都可以使用。
await page.evaluate(
    x => x.button1.textContent + x.list[0].textContent + String(x.foo),
    { button1, list: [button2], foo: null });
```

## 初始化脚本

有时在页面开始加载之前执行一些代码会很方便。例如，你可能想要设置一些模拟数据或测试数据。

在这种情况下，可以使用 [`page.addInitScript()`](/api/class-page#page-add-init-script) 或 [`browserContext.addInitScript()`](/api/class-browsercontext#browser-context-add-init-script)。在下面的示例中，我们将用一个常量值替换 `Math.random()`。

首先，创建一个包含模拟代码的 `preload.js` 文件。

```js
// preload.js
Math.random = () => 42;
```

然后，将初始化脚本添加到页面。

```js
import { test, expect } from '@playwright/test';
import path from 'path';

test.beforeEach(async ({ page }) => {
  // 在 beforeEach 钩子中为每个测试添加脚本。
  // 确保正确解析脚本路径。
  await page.addInitScript({ path: path.resolve(__dirname, '../mocks/preload.js') });
});
```

###### 
或者，你可以传递一个函数而不是创建预加载脚本文件。这对于简短或一次性的脚本更方便。你也可以通过这种方式传递参数。

```js
import { test, expect } from '@playwright/test';

// 在 beforeEach 钩子中为每个测试添加脚本。
test.beforeEach(async ({ page }) => {
  const value = 42;
  await page.addInitScript(value => {
    Math.random = () => value;
  }, value);
});
```
