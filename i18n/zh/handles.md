---
title: "句柄"
---

# 句柄

## 简介

Playwright 可以创建指向页面 DOM 元素或页面内任何其他对象的句柄。这些句柄存在于 Playwright 进程中，而实际对象存在于浏览器中。有两种类型的句柄：
- [JSHandle](/api/class-jshandle) 用于引用页面中的任何 JavaScript 对象
- [ElementHandle](/api/class-elementhandle) 用于引用页面中的 DOM 元素，它有额外的方法可以对元素执行操作和断言其属性。

由于页面中的任何 DOM 元素也是 JavaScript 对象，因此任何 [ElementHandle](/api/class-elementhandle) 也是 [JSHandle](/api/class-jshandle)。

句柄用于对页面中的实际对象执行操作。你可以在句柄上执行求值、获取句柄属性、将句柄作为求值参数传递、将页面对象序列化为 JSON 等。有关这些方法，请参阅 [JSHandle](/api/class-jshandle) 类 API。

### API 参考
- [JSHandle](/api/class-jshandle)
- [ElementHandle](/api/class-elementhandle)

以下是获取 [JSHandle](/api/class-jshandle) 的最简单方法。

```js
const jsHandle = await page.evaluateHandle('window');
// 使用 jsHandle 进行求值。
```

## 元素句柄

:::warning[不推荐使用]

不推荐使用 [ElementHandle](/api/class-elementhandle)，请改用 [Locator](/api/class-locator) 对象和 web-first 断言。
:::

当需要 [ElementHandle](/api/class-elementhandle) 时，建议使用 [`page.waitForSelector()`](/api/class-page#page-wait-for-selector) 或 [`frame.waitForSelector()`](/api/class-frame#frame-wait-for-selector) 方法获取。这些 API 会等待元素被附加到 DOM 并可见。

```js
// 获取元素句柄
const elementHandle = await page.waitForSelector('#box');

// 断言元素的边界框
const boundingBox = await elementHandle.boundingBox();
expect(boundingBox.width).toBe(100);

// 断言元素的属性
const classNames = await elementHandle.getAttribute('class');
expect(classNames.includes('highlighted')).toBeTruthy();
```

## 句柄作为参数

句柄可以传递给 [`page.evaluate()`](/api/class-page#page-evaluate) 和类似的方法。以下代码片段在页面中创建一个新数组，用数据初始化它，并将指向该数组的句柄返回到 Playwright。然后在后续求值中使用该句柄：

```js
// 在页面中创建新数组。
const myArrayHandle = await page.evaluateHandle(() => {
  window.myArray = [1];
  return myArray;
});

// 获取数组的长度。
const length = await page.evaluate(a => a.length, myArrayHandle);

// 使用句柄向数组添加一个元素
await page.evaluate(arg => arg.myArray.push(arg.newElement), {
  myArray: myArrayHandle,
  newElement: 2
});

// 当不再需要对象时释放它。
await myArrayHandle.dispose();
```

## 句柄生命周期

句柄可以使用页面方法获取，如 [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle)、[`page.$()`](/api/class-page#page-query-selector) 或 [`page.$$()`](/api/class-page#page-query-selector-all)，或者它们的 frame 对应方法 [`frame.evaluateHandle()`](/api/class-frame#frame-evaluate-handle)、[`frame.$()`](/api/class-frame#frame-query-selector) 或 [`frame.$$()`](/api/class-frame#frame-query-selector-all)。创建后，句柄会防止对象被[垃圾回收](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)，除非页面导航或通过 [`jsHandle.dispose()`](/api/class-jshandle#js-handle-dispose) 方法手动释放句柄。

### API 参考
- [JSHandle](/api/class-jshandle)
- [ElementHandle](/api/class-elementhandle)
- [`elementHandle.boundingBox()`](/api/class-elementhandle#element-handle-bounding-box)
- [`elementHandle.getAttribute()`](/api/class-elementhandle#element-handle-get-attribute)
- [`elementHandle.innerText()`](/api/class-elementhandle#element-handle-inner-text)
- [`elementHandle.innerHTML()`](/api/class-elementhandle#element-handle-inner-html)
- [`elementHandle.textContent()`](/api/class-elementhandle#element-handle-text-content)
- [`jsHandle.evaluate()`](/api/class-jshandle#js-handle-evaluate)
- [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle)
- [`page.$()`](/api/class-page#page-query-selector)
- [`page.$$()`](/api/class-page#page-query-selector-all)

## Locator 与 ElementHandle 的区别

::: warning
我们只建议在极少数情况下使用 [ElementHandle](/api/class-elementhandle)，即当你需要在静态页面上执行大量 DOM 遍历时。对于所有用户操作和断言，请使用 locator。
:::

[Locator](/api/class-locator) 和 [ElementHandle](/api/class-elementhandle) 之间的区别在于，后者指向特定元素，而 Locator 捕获的是如何检索该元素的逻辑。

在下面的示例中，handle 指向页面上的特定 DOM 元素。如果该元素更改了文本或被 React 用于渲染完全不同的组件，handle 仍然指向那个过时的 DOM 元素。这可能导致意外的行为。

```js
const handle = await page.$('text=Submit');
// ...
await handle.hover();
await handle.click();
```

使用 locator 时，每次使用 locator 时都会使用选择器在页面中定位最新的 DOM 元素。因此在下面的代码片段中，底层 DOM 元素将被定位两次。

```js
const locator = page.getByText('Submit');
// ...
await locator.hover();
await locator.click();
```
