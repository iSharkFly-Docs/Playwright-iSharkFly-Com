---
title: "句柄"
---

# 句柄

## 简介

Playwright 可以创建指向页面 DOM 元素或页面内任何其他对象的句柄。这些句柄存在于 Playwright 进程中，而实际对象存在于浏览器中。有两种类型的句柄：
- [JSHandle](/python/api/class-jshandle) 用于引用页面中的任何 JavaScript 对象
- [ElementHandle](/python/api/class-elementhandle) 用于引用页面中的 DOM 元素，它有额外的方法允许对元素执行操作和断言其属性。

由于页面中的任何 DOM 元素也是 JavaScript 对象，任何 [ElementHandle](/python/api/class-elementhandle) 也是 [JSHandle](/python/api/class-jshandle)。

句柄用于对页面中的实际对象执行操作。您可以在句柄上执行求值、获取句柄属性、将句柄作为求值参数传递、将页面对象序列化为 JSON 等。有关这些方法和其他方法，请参阅 [JSHandle](/python/api/class-jshandle) 类 API。

### API 参考
- [JSHandle](/python/api/class-jshandle)
- [ElementHandle](/python/api/class-elementhandle)

以下是获取 [JSHandle](/python/api/class-jshandle) 的最简单方法。

::: code-group

```python [Async]
js_handle = await page.evaluate_handle('window')
#  使用 jsHandle 进行求值。
```

```python [Sync]
js_handle = page.evaluate_handle('window')
#  使用 jsHandle 进行求值。
```

:::

## 元素句柄

:::warning[不推荐]

不推荐使用 [ElementHandle](/python/api/class-elementhandle)，请改用 [Locator](/python/api/class-locator) 对象和 Web 优先断言。
:::

当需要 [ElementHandle](/python/api/class-elementhandle) 时，建议使用 [`page.wait_for_selector()`](/python/api/class-page#page-wait-for-selector) 或 [`frame.wait_for_selector()`](/python/api/class-frame#frame-wait-for-selector) 方法获取它。这些 API 会等待元素被附加并可见。

::: code-group

```python [Async]
# 获取元素句柄
element_handle = await page.wait_for_selector('#box')

# 断言元素的边界框
bounding_box = await element_handle.bounding_box()
assert bounding_box["width"] == 100

# 断言元素的属性
class_names = await element_handle.get_attribute('class')
assert 'highlighted' in class_names
```

```python [Sync]
# 获取元素句柄
element_handle = page.wait_for_selector('#box')

# 断言元素的边界框
bounding_box = element_handle.bounding_box()
assert bounding_box["width"] == 100

# 断言元素的属性
class_names = element_handle.get_attribute('class')
assert 'highlighted' in class_names
```

:::

## 句柄作为参数

句柄可以传递给 [`page.evaluate()`](/python/api/class-page#page-evaluate) 和类似的方法。以下代码片段在页面中创建一个新数组，用数据初始化它，并将此数组的句柄返回给 Playwright。然后在后续求值中使用该句柄：

::: code-group

```python [Async]
# 在页面中创建新数组。
my_array_handle = await page.evaluate_handle("""() => {
  window.myArray = [1];
  return myArray;
}""")

# 获取数组的当前长度。
length = await page.evaluate("a => a.length", my_array_handle)

# 使用句柄向数组添加一个元素
await page.evaluate("(arg) => arg.myArray.push(arg.newElement)", {
  'myArray': my_array_handle,
  'newElement': 2
})

# 当不再需要该对象时释放它。
await my_array_handle.dispose()
```

```python [Sync]
# 在页面中创建新数组。
my_array_handle = page.evaluate_handle("""() => {
  window.myArray = [1];
  return myArray;
}""")

# 获取数组的当前长度。
length = page.evaluate("a => a.length", my_array_handle)

# 使用句柄向数组添加一个元素
page.evaluate("(arg) => arg.myArray.push(arg.newElement)", {
  'myArray': my_array_handle,
  'newElement': 2
})

# 当不再需要该对象时释放它。
my_array_handle.dispose()
```

:::

## 句柄生命周期

可以使用页面方法获取句柄，如 [`page.evaluate_handle()`](/python/api/class-page#page-evaluate-handle)、[`page.query_selector()`](/python/api/class-page#page-query-selector) 或 [`page.query_selector_all()`](/python/api/class-page#page-query-selector-all)，或它们的框架对应方法 [`frame.evaluate_handle()`](/python/api/class-frame#frame-evaluate-handle)、[`frame.query_selector()`](/python/api/class-frame#frame-query-selector) 或 [`frame.query_selector_all()`](/python/api/class-frame#frame-query-selector-all)。一旦创建，句柄将保持对象不被[垃圾回收](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)，除非页面导航或通过 [`js_handle.dispose()`](/python/api/class-jshandle#js-handle-dispose) 方法手动释放句柄。

### API 参考
- [JSHandle](/python/api/class-jshandle)
- [ElementHandle](/python/api/class-elementhandle)
- [`element_handle.bounding_box()`](/python/api/class-elementhandle#element-handle-bounding-box)
- [`element_handle.get_attribute()`](/python/api/class-elementhandle#element-handle-get-attribute)
- [`element_handle.inner_text()`](/python/api/class-elementhandle#element-handle-inner-text)
- [`element_handle.inner_html()`](/python/api/class-elementhandle#element-handle-inner-html)
- [`element_handle.text_content()`](/python/api/class-elementhandle#element-handle-text-content)
- [`js_handle.evaluate()`](/python/api/class-jshandle#js-handle-evaluate)
- [`page.evaluate_handle()`](/python/api/class-page#page-evaluate-handle)
- [`page.query_selector()`](/python/api/class-page#page-query-selector)
- [`page.query_selector_all()`](/python/api/class-page#page-query-selector-all)

## Locator 与 ElementHandle

::: warning
我们只建议在需要对静态页面执行大量 DOM 遍历的罕见情况下使用 [ElementHandle](/python/api/class-elementhandle)。对于所有用户操作和断言，请改用 locator。
:::

[Locator](/python/api/class-locator) 和 [ElementHandle](/python/api/class-elementhandle) 之间的区别在于，后者指向特定元素，而 Locator 捕获如何检索该元素的逻辑。

在下面的示例中，handle 指向页面上的特定 DOM 元素。如果该元素更改了文本或被 React 用于渲染完全不同的组件，handle 仍然指向那个过时的 DOM 元素。这可能导致意外行为。

::: code-group

```python [Async]
handle = await page.query_selector("text=Submit")
await handle.hover()
await handle.click()
```

```python [Sync]
handle = page.query_selector("text=Submit")
handle.hover()
handle.click()
```

:::

使用 locator 时，每次使用 locator 时，都会使用选择器在页面中定位最新的 DOM 元素。因此在下面的代码片段中，底层 DOM 元素将被定位两次。

::: code-group

```python [Async]
locator = page.get_by_text("Submit")
await locator.hover()
await locator.click()
```

```python [Sync]
locator = page.get_by_text("Submit")
locator.hover()
locator.click()
```

:::
