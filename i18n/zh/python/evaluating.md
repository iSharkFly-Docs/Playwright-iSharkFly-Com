---
title: "执行 JavaScript"
---

# 执行 JavaScript

## 简介

Playwright 脚本在你的 Playwright 环境中运行。你的页面脚本在浏览器页面环境中运行。这些环境不相交，它们运行在不同的虚拟机、不同的进程中，甚至可能在不同的计算机上。

[`page.evaluate()`](/python/api/class-page#page-evaluate) API 可以在网页的上下文中运行 JavaScript 函数，并将结果带回 Playwright 环境。浏览器全局变量如 `window` 和 `document` 可以在 `evaluate` 中使用。

::: code-group

```python [Async]
href = await page.evaluate('() => document.location.href')
```

```python [Sync]
href = page.evaluate('() => document.location.href')
```

:::

如果结果是 Promise 或者函数是异步的，evaluate 会自动等待直到它被解析：

::: code-group

```python [Async]
status = await page.evaluate("""async () => {
  response = await fetch(location.href)
  return response.status
}""")
```

```python [Sync]
status = page.evaluate("""async () => {
  response = await fetch(location.href)
  return response.status
}""")
```

:::

## 不同的环境

执行的脚本在浏览器环境中运行，而你的测试运行在测试环境中。这意味着你不能在页面中使用测试中的变量，反之亦然。相反，你应该将它们作为参数显式传递。

以下代码片段是**错误的**，因为它直接使用了变量：

::: code-group

```python [Async]
data = "some data"
result = await page.evaluate("""() => {
  // 错误：网页中没有 "data"。
  window.myApp.use(data)
}""")
```

```python [Sync]
data = "some data"
result = page.evaluate("""() => {
  // 错误：网页中没有 "data"。
  window.myApp.use(data)
}""")
```

:::

以下代码片段是**正确的**，因为它将值作为参数显式传递：

::: code-group

```python [Async]
data = "some data"
# 将 |data| 作为参数传递。
result = await page.evaluate("""data => {
  window.myApp.use(data)
}""", data)
```

```python [Sync]
data = "some data"
# 将 |data| 作为参数传递。
result = page.evaluate("""data => {
  window.myApp.use(data)
}""", data)
```

:::

## 执行参数

Playwright 的执行方法如 [`page.evaluate()`](/python/api/class-page#page-evaluate) 接受一个可选参数。这个参数可以是 [Serializable] 值和 [JSHandle](/python/api/class-jshandle) 实例的混合。句柄会自动转换为它们所代表的值。

::: code-group

```python [Async]
# 原始值。
await page.evaluate('num => num', 42)

# 数组。
await page.evaluate('array => array.length', [1, 2, 3])

# 对象。
await page.evaluate('object => object.foo', { 'foo': 'bar' })

# 单个句柄。
button = await page.evaluate_handle('button')
await page.evaluate('button => button.textContent', button)

# 使用 JSHandle.evaluate 的替代写法。
await button.evaluate('(button, from) => button.textContent.substring(from)', 5)

# 包含多个句柄的对象。
button1 = await page.evaluate_handle('window.button1')
button2 = await page.evaluate_handle('window.button2')
await page.evaluate("""
    o => o.button1.textContent + o.button2.textContent""",
    { 'button1': button1, 'button2': button2 })

# 对象解构也可以工作。注意属性名必须
# 在解构对象和参数之间匹配。
# 还要注意必需的括号。
await page.evaluate("""
    ({ button1, button2 }) => button1.textContent + button2.textContent""",
    { 'button1': button1, 'button2': button2 })

# 数组也可以工作。解构时可以使用任意名称。
# 注意必需的括号。
await page.evaluate("""
    ([b1, b2]) => b1.textContent + b2.textContent""",
    [button1, button2])

# 可序列化值和句柄的任意混合都可以工作。
await page.evaluate("""
    x => x.button1.textContent + x.list[0].textContent + String(x.foo)""",
    { 'button1': button1, 'list': [button2], 'foo': None })
```

```python [Sync]
# 原始值。
page.evaluate('num => num', 42)

# 数组。
page.evaluate('array => array.length', [1, 2, 3])

# 对象。
page.evaluate('object => object.foo', { 'foo': 'bar' })

# 单个句柄。
button = page.evaluate_handle('window.button')
page.evaluate('button => button.textContent', button)

# 使用 JSHandle.evaluate 的替代写法。
button.evaluate('(button, from) => button.textContent.substring(from)', 5)

# 包含多个句柄的对象。
button1 = page.evaluate_handle('window.button1')
button2 = page.evaluate_handle('.button2')
page.evaluate("""o => o.button1.textContent + o.button2.textContent""",
    { 'button1': button1, 'button2': button2 })

# 对象解构也可以工作。注意属性名必须
# 在解构对象和参数之间匹配。
# 还要注意必需的括号。
page.evaluate("""
    ({ button1, button2 }) => button1.textContent + button2.textContent""",
    { 'button1': button1, 'button2': button2 })

# 数组也可以工作。解构时可以使用任意名称。
# 注意必需的括号。
page.evaluate("""
    ([b1, b2]) => b1.textContent + b2.textContent""",
    [button1, button2])

# 可序列化值和句柄的任意混合都可以工作。
page.evaluate("""
    x => x.button1.textContent + x.list[0].textContent + String(x.foo)""",
    { 'button1': button1, 'list': [button2], 'foo': None })
```

:::

## 初始化脚本

有时在页面开始加载之前执行一些操作很方便。例如，你可能想要设置一些模拟或测试数据。

在这种情况下，使用 [`page.add_init_script()`](/python/api/class-page#page-add-init-script) 或 [`browser_context.add_init_script()`](/python/api/class-browsercontext#browser-context-add-init-script)。在下面的示例中，我们将用一个常量值替换 `Math.random()`。

首先，创建一个包含模拟的 `preload.js` 文件。

然后，将初始化脚本添加到页面。

::: code-group

```python [Async]
# 在你的测试中，假设 "preload.js" 文件在 "mocks" 目录中。
await page.add_init_script(path="mocks/preload.js")
```

```python [Sync]
# 在你的测试中，假设 "preload.js" 文件在 "mocks" 目录中。
page.add_init_script(path="mocks/preload.js")
```

:::
