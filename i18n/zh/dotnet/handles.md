---
title: "句柄"
---

# 句柄

## 简介

Playwright 可以创建页面 DOM 元素或页面内任何其他对象的句柄。这些句柄存在于 Playwright 进程中，而实际对象存在于浏览器中。有两种类型的句柄：
- [JSHandle](/dotnet/api/class-jshandle) 用于引用页面中的任何 JavaScript 对象
- [ElementHandle](/dotnet/api/class-elementhandle) 用于引用页面中的 DOM 元素，它有额外的方法允许对元素执行操作并断言其属性。

由于页面中的任何 DOM 元素也是一个 JavaScript 对象，所以任何 [ElementHandle](/dotnet/api/class-elementhandle) 也是一个 [JSHandle](/dotnet/api/class-jshandle)。

句柄用于对页面中的实际对象执行操作。你可以在句柄上求值、获取句柄属性、将句柄作为求值参数传递、将页面对象序列化为 JSON 等。有关这些方法，请参阅 [JSHandle](/dotnet/api/class-jshandle) 类 API。

### API 参考
- [JSHandle](/dotnet/api/class-jshandle)
- [ElementHandle](/dotnet/api/class-elementhandle)

以下是获取 [JSHandle](/dotnet/api/class-jshandle) 最简单的方法。

```csharp
var jsHandle = await page.EvaluateHandleAsync("window");
//  使用 jsHandle 进行求值。
```

## 元素句柄

:::warning[不推荐使用]

不鼓励使用 [ElementHandle](/dotnet/api/class-elementhandle)，请改用 [Locator](/dotnet/api/class-locator) 对象和 web-first 断言。
:::

当需要 [ElementHandle](/dotnet/api/class-elementhandle) 时，建议使用
[`Page.WaitForSelectorAsync()`](/dotnet/api/class-page#page-wait-for-selector) 或 [`Frame.WaitForSelectorAsync()`](/dotnet/api/class-frame#frame-wait-for-selector) 方法来获取。这些
API 会等待元素被附加并可见。

```csharp
// 获取元素句柄
var elementHandle = await page.WaitForSelectorAsync("#box");

// 断言元素的边界框
var boundingBox = await elementHandle.BoundingBoxAsync();
Assert.AreEqual(100, boundingBox.Width);

// 断言元素的属性
var classNames = await elementHandle.GetAttributeAsync("class");
Assert.True(classNames.Contains("highlighted"));
```

## 句柄作为参数

句柄可以传递给 [`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) 和类似的方法。
以下代码片段在页面中创建一个新数组，用数据初始化它
并将此数组的句柄返回到 Playwright。然后在后续求值中使用该句柄：

```csharp
// 在页面中创建新数组。
var myArrayHandle = await page.EvaluateHandleAsync(@"() => {
    window.myArray = [1];
    return myArray;
}");

// 获取数组的长度。
var length = await page.EvaluateAsync<int>("a => a.length", myArrayHandle);

// 使用句柄向数组添加一个元素
await page.EvaluateAsync("arg => arg.myArray.push(arg.newElement)",
    new { myArray = myArrayHandle, newElement = 2 });

// 当不再需要对象时释放它。
await myArrayHandle.DisposeAsync();
```

## 句柄生命周期

句柄可以使用页面方法获取，例如 [`Page.EvaluateHandleAsync()`](/dotnet/api/class-page#page-evaluate-handle)、
[`Page.QuerySelectorAsync()`](/dotnet/api/class-page#page-query-selector) 或 [`Page.QuerySelectorAllAsync()`](/dotnet/api/class-page#page-query-selector-all) 或它们的框架对应方法
[`Frame.EvaluateHandleAsync()`](/dotnet/api/class-frame#frame-evaluate-handle)、[`Frame.QuerySelectorAsync()`](/dotnet/api/class-frame#frame-query-selector) 或 [`Frame.QuerySelectorAllAsync()`](/dotnet/api/class-frame#frame-query-selector-all)。一旦
创建，句柄将阻止对象被
[垃圾回收](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)，
除非页面导航或通过 [`JsHandle.DisposeAsync()`](/dotnet/api/class-jshandle#js-handle-dispose) 方法手动释放句柄。

### API 参考
- [JSHandle](/dotnet/api/class-jshandle)
- [ElementHandle](/dotnet/api/class-elementhandle)
- [`ElementHandle.BoundingBoxAsync()`](/dotnet/api/class-elementhandle#element-handle-bounding-box)
- [`ElementHandle.GetAttributeAsync()`](/dotnet/api/class-elementhandle#element-handle-get-attribute)
- [`ElementHandle.InnerTextAsync()`](/dotnet/api/class-elementhandle#element-handle-inner-text)
- [`ElementHandle.InnerHTMLAsync()`](/dotnet/api/class-elementhandle#element-handle-inner-html)
- [`ElementHandle.TextContentAsync()`](/dotnet/api/class-elementhandle#element-handle-text-content)
- [`JsHandle.EvaluateAsync()`](/dotnet/api/class-jshandle#js-handle-evaluate)
- [`Page.EvaluateHandleAsync()`](/dotnet/api/class-page#page-evaluate-handle)
- [`Page.QuerySelectorAsync()`](/dotnet/api/class-page#page-query-selector)
- [`Page.QuerySelectorAllAsync()`](/dotnet/api/class-page#page-query-selector-all)

## 定位器 vs 元素句柄

::: warning
我们只建议在极少数情况下使用 [ElementHandle](/dotnet/api/class-elementhandle)，即当你需要在静态页面上执行大量 DOM 遍历时。对于所有用户操作和断言，请改用定位器。
:::

[Locator](/dotnet/api/class-locator) 和 [ElementHandle](/dotnet/api/class-elementhandle) 之间的区别在于，后者指向一个特定的元素，而定位器捕获的是如何检索该元素的逻辑。

在下面的示例中，handle 指向页面上的特定 DOM 元素。如果该元素更改了文本或被 React 用于渲染一个完全不同的组件，handle 仍然指向那个非常陈旧的 DOM 元素。这可能导致意外的行为。

```csharp
var handle = await page.QuerySelectorAsync("text=Submit");
await handle.HoverAsync();
await handle.ClickAsync();
```

使用定位器时，每次使用定位器时，都会使用选择器在页面中定位最新的 DOM 元素。因此在下面的代码片段中，底层 DOM 元素将被定位两次。

```csharp
var locator = page.GetByText("Submit");
await locator.HoverAsync();
await locator.ClickAsync();
```
