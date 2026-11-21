---
title: "执行 JavaScript"
---

# 执行 JavaScript

## 简介

Playwright 脚本在你的 Playwright 环境中运行。你的页面脚本在浏览器页面环境中运行。这些环境不相交，它们在不同的虚拟机、不同的进程中运行，甚至可能在不同的计算机上运行。

[`page.evaluate()`](/java/api/class-page#page-evaluate) API 可以在网页的上下文中运行 JavaScript 函数，并将结果返回到 Playwright 环境。浏览器全局变量（如 `window` 和 `document`）可以在 `evaluate` 中使用。

```java
String href = (String) page.evaluate("document.location.href");
```

如果结果是 Promise 或者函数是异步的，evaluate 将自动等待直到它被解析：

```java
int status = (int) page.evaluate("async () => {\n" +
  "  const response = await fetch(location.href);\n" +
  "  return response.status;\n" +
  "}");
```

## 不同的环境

被执行的脚本在浏览器环境中运行，而你的测试在测试环境中运行。这意味着你不能在页面中使用测试中的变量，反之亦然。相反，你应该将它们作为参数显式传递。

以下代码片段是**错误的**，因为它直接使用了变量：

```java
String data = "some data";
Object result = page.evaluate("() => {\n" +
  "  // 错误：网页中没有 'data'。\n" +
  "  window.myApp.use(data);\n" +
  "}");
```

以下代码片段是**正确的**，因为它将值作为参数显式传递：

```java
String data = "some data";
// 将 |data| 作为参数传递。
Object result = page.evaluate("data => {\n" +
  "  window.myApp.use(data);\n" +
  "}", data);
```

## 执行参数

Playwright 的执行方法（如 [`page.evaluate()`](/java/api/class-page#page-evaluate)）接受一个可选参数。此参数可以是 [Serializable] 值和 [JSHandle](/java/api/class-jshandle) 实例的混合。句柄会自动转换为它们所代表的值。

```java
// 原始值。
page.evaluate("num => num", 42);

// 数组。
page.evaluate("array => array.length", Arrays.asList(1, 2, 3));

// 对象。
Map<String, Object> obj = new HashMap<>();
obj.put("foo", "bar");
page.evaluate("object => object.foo", obj);

// 单个句柄。
ElementHandle button = page.evaluateHandle("window.button");
page.evaluate("button => button.textContent", button);

// 使用 JSHandle.evaluate 的替代写法。
button.evaluate("(button, from) => button.textContent.substring(from)", 5);

// 包含多个句柄的对象。
ElementHandle button1 = page.evaluateHandle("window.button1");
ElementHandle button2 = page.evaluateHandle("window.button2");
Map<String, ElementHandle> arg = new HashMap<>();
arg.put("button1", button1);
arg.put("button2", button2);
page.evaluate("o => o.button1.textContent + o.button2.textContent", arg);

// 对象解构可用。注意属性名必须在
// 解构的对象和参数之间匹配。
// 还要注意必需的括号。
Map<String, ElementHandle> arg = new HashMap<>();
arg.put("button1", button1);
arg.put("button2", button2);
page.evaluate("({ button1, button2 }) => button1.textContent + button2.textContent", arg);

// 数组也可以使用。解构时可以使用任意名称。
// 注意必需的括号。
page.evaluate(
  "([b1, b2]) => b1.textContent + b2.textContent",
  Arrays.asList(button1, button2));

// 可序列化值和句柄的任意混合都可以。
Map<String, Object> arg = new HashMap<>();
arg.put("button1", button1);
arg.put("list", Arrays.asList(button2));
arg.put("foo", 0);
page.evaluate(
  "x => x.button1.textContent + x.list[0].textContent + String(x.foo)",
  arg);
```

## 初始化脚本

有时在页面开始加载之前执行某些操作很方便。例如，你可能想要设置一些模拟或测试数据。

在这种情况下，使用 [`page.addInitScript()`](/java/api/class-page#page-add-init-script) 或 [`browserContext.addInitScript()`](/java/api/class-browsercontext#browser-context-add-init-script)。在下面的示例中，我们将用一个常量值替换 `Math.random()`。

首先，创建一个包含模拟的 `preload.js` 文件。

然后，将初始化脚本添加到页面。

```java
// 在你的测试中，假设 "preload.js" 文件在 "mocks" 目录中。
page.addInitScript(Paths.get("mocks/preload.js"));
```
