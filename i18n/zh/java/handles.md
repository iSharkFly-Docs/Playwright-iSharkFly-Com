---
title: "句柄"
---

# 句柄

## 简介

Playwright 可以创建指向页面 DOM 元素或页面内任何其他对象的句柄。这些句柄存在于 Playwright 进程中，而实际对象存在于浏览器中。有两种类型的句柄：
- [JSHandle](/java/api/class-jshandle) 用于引用页面中的任何 JavaScript 对象
- [ElementHandle](/java/api/class-elementhandle) 用于引用页面中的 DOM 元素，它有额外的方法允许对元素执行操作和断言其属性。

由于页面中的任何 DOM 元素也是 JavaScript 对象，任何 [ElementHandle](/java/api/class-elementhandle) 也是 [JSHandle](/java/api/class-jshandle)。

句柄用于对页面中的实际对象执行操作。您可以在句柄上执行求值、获取句柄属性、将句柄作为求值参数传递、将页面对象序列化为 JSON 等。有关这些方法和其他方法，请参阅 [JSHandle](/java/api/class-jshandle) 类 API。

### API 参考
- [JSHandle](/java/api/class-jshandle)
- [ElementHandle](/java/api/class-elementhandle)

以下是获取 [JSHandle](/java/api/class-jshandle) 的最简单方法。

```java
JSHandle jsHandle = page.evaluateHandle("window");
//  使用 jsHandle 进行求值。
```

## 元素句柄

:::warning[不推荐]

不推荐使用 [ElementHandle](/java/api/class-elementhandle)，请改用 [Locator](/java/api/class-locator) 对象和 Web 优先断言。
:::

当需要 [ElementHandle](/java/api/class-elementhandle) 时，建议使用 [`page.waitForSelector()`](/java/api/class-page#page-wait-for-selector) 或 [`frame.waitForSelector()`](/java/api/class-frame#frame-wait-for-selector) 方法获取它。这些 API 会等待元素被附加并可见。

```java
// 获取元素句柄
JSHandle jsHandle = page.waitForSelector("#box");
ElementHandle elementHandle = jsHandle.asElement();

// 断言元素的边界框
BoundingBox boundingBox = elementHandle.boundingBox();
assertEquals(100, boundingBox.width);

// 断言元素的属性
String classNames = elementHandle.getAttribute("class");
assertTrue(classNames.contains("highlighted"));
```

## 句柄作为参数

句柄可以传递给 [`page.evaluate()`](/java/api/class-page#page-evaluate) 和类似的方法。以下代码片段在页面中创建一个新数组，用数据初始化它，并将此数组的句柄返回给 Playwright。然后在后续求值中使用该句柄：

```java
// 在页面中创建新数组。
JSHandle myArrayHandle = page.evaluateHandle("() => {\n" +
  "  window.myArray = [1];\n" +
  "  return myArray;\n" +
  "}");

// 获取数组的长度。
int length = (int) page.evaluate("a => a.length", myArrayHandle);

// 使用句柄向数组添加一个元素
Map<String, Object> arg = new HashMap<>();
arg.put("myArray", myArrayHandle);
arg.put("newElement", 2);
page.evaluate("arg => arg.myArray.push(arg.newElement)", arg);

// 当不再需要该对象时释放它。
myArrayHandle.dispose();
```

## 句柄生命周期

可以使用页面方法获取句柄，如 [`page.evaluateHandle()`](/java/api/class-page#page-evaluate-handle)、[`page.querySelector()`](/java/api/class-page#page-query-selector) 或 [`page.querySelectorAll()`](/java/api/class-page#page-query-selector-all)，或它们的框架对应方法 [`frame.evaluateHandle()`](/java/api/class-frame#frame-evaluate-handle)、[`frame.querySelector()`](/java/api/class-frame#frame-query-selector) 或 [`frame.querySelectorAll()`](/java/api/class-frame#frame-query-selector-all)。一旦创建，句柄将保持对象不被[垃圾回收](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)，除非页面导航或通过 [`jsHandle.dispose()`](/java/api/class-jshandle#js-handle-dispose) 方法手动释放句柄。

### API 参考
- [JSHandle](/java/api/class-jshandle)
- [ElementHandle](/java/api/class-elementhandle)
- [`elementHandle.boundingBox()`](/java/api/class-elementhandle#element-handle-bounding-box)
- [`elementHandle.getAttribute()`](/java/api/class-elementhandle#element-handle-get-attribute)
- [`elementHandle.innerText()`](/java/api/class-elementhandle#element-handle-inner-text)
- [`elementHandle.innerHTML()`](/java/api/class-elementhandle#element-handle-inner-html)
- [`elementHandle.textContent()`](/java/api/class-elementhandle#element-handle-text-content)
- [`jsHandle.evaluate()`](/java/api/class-jshandle#js-handle-evaluate)
- [`page.evaluateHandle()`](/java/api/class-page#page-evaluate-handle)
- [`page.querySelector()`](/java/api/class-page#page-query-selector)
- [`page.querySelectorAll()`](/java/api/class-page#page-query-selector-all)

## Locator 与 ElementHandle

::: warning
我们只建议在需要对静态页面执行大量 DOM 遍历的罕见情况下使用 [ElementHandle](/java/api/class-elementhandle)。对于所有用户操作和断言，请改用 locator。
:::

[Locator](/java/api/class-locator) 和 [ElementHandle](/java/api/class-elementhandle) 之间的区别在于，后者指向特定元素，而 Locator 捕获如何检索该元素的逻辑。

在下面的示例中，handle 指向页面上的特定 DOM 元素。如果该元素更改了文本或被 React 用于渲染完全不同的组件，handle 仍然指向那个过时的 DOM 元素。这可能导致意外行为。

```java
ElementHandle handle = page.querySelector("text=Submit");
handle.hover();
handle.click();
```

使用 locator 时，每次使用 locator 时，都会使用选择器在页面中定位最新的 DOM 元素。因此在下面的代码片段中，底层 DOM 元素将被定位两次。

```java
Locator locator = page.getByText("Submit");
locator.hover();
locator.click();
```
