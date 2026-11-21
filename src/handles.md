---
title: "Handles"
---

# Handles

## Introduction

Playwright can create handles to the page DOM elements or any other objects inside the
page. These handles live in the Playwright process, whereas the actual objects live
in the browser. There are two types of handles:
- [JSHandle](/api/class-jshandle) to reference any JavaScript objects in the page
- [ElementHandle](/api/class-elementhandle) to reference DOM elements in the page, it has extra methods that allow
  performing actions on the elements and asserting their properties.

Since any DOM element in the page is also a JavaScript object, any [ElementHandle](/api/class-elementhandle) is
a [JSHandle](/api/class-jshandle) as well.

Handles are used to perform operations on those actual objects in the page. You can evaluate
on a handle, get handle properties, pass handle as an evaluation parameter, serialize page
object into JSON etc. See the [JSHandle](/api/class-jshandle) class API for these and methods.

### API reference
- [JSHandle](/api/class-jshandle)
- [ElementHandle](/api/class-elementhandle)

Here is the easiest way to obtain a [JSHandle](/api/class-jshandle).

```js
const jsHandle = await page.evaluateHandle('window');
//  Use jsHandle for evaluations.
```

## Element Handles

:::warning[Discouraged]

The use of [ElementHandle](/api/class-elementhandle) is discouraged, use [Locator](/api/class-locator) objects and web-first assertions instead.
:::

When [ElementHandle](/api/class-elementhandle) is required, it is recommended to fetch it with the
[`page.waitForSelector()`](/api/class-page#page-wait-for-selector) or [`frame.waitForSelector()`](/api/class-frame#frame-wait-for-selector) methods. These
APIs wait for the element to be attached and visible.

```js
// Get the element handle
const elementHandle = await page.waitForSelector('#box');

// Assert bounding box for the element
const boundingBox = await elementHandle.boundingBox();
expect(boundingBox.width).toBe(100);

// Assert attribute for the element
const classNames = await elementHandle.getAttribute('class');
expect(classNames.includes('highlighted')).toBeTruthy();
```

## Handles as parameters

Handles can be passed into the [`page.evaluate()`](/api/class-page#page-evaluate) and similar methods.
The following snippet creates a new array in the page, initializes it with data
and returns a handle to this array into Playwright. It then uses the handle
in subsequent evaluations:

```js
// Create new array in page.
const myArrayHandle = await page.evaluateHandle(() => {
  window.myArray = [1];
  return myArray;
});

// Get the length of the array.
const length = await page.evaluate(a => a.length, myArrayHandle);

// Add one more element to the array using the handle
await page.evaluate(arg => arg.myArray.push(arg.newElement), {
  myArray: myArrayHandle,
  newElement: 2
});

// Release the object when it's no longer needed.
await myArrayHandle.dispose();
```

## Handle Lifecycle

Handles can be acquired using the page methods such as [`page.evaluateHandle()`](/api/class-page#page-evaluate-handle),
[`page.$()`](/api/class-page#page-query-selector) or [`page.$$()`](/api/class-page#page-query-selector-all) or their frame counterparts
[`frame.evaluateHandle()`](/api/class-frame#frame-evaluate-handle), [`frame.$()`](/api/class-frame#frame-query-selector) or [`frame.$$()`](/api/class-frame#frame-query-selector-all). Once
created, handles will retain object from
[garbage collection](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
unless page navigates or the handle is manually disposed via the [`jsHandle.dispose()`](/api/class-jshandle#js-handle-dispose) method.

### API reference
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

## Locator vs ElementHandle

::: warning
We only recommend using [ElementHandle](/api/class-elementhandle) in the rare cases when you need to perform extensive DOM traversal
on a static page. For all user actions and assertions use locator instead.
:::

The difference between the [Locator](/api/class-locator) and [ElementHandle](/api/class-elementhandle) is that the latter points to a particular element, while Locator captures the logic of how to retrieve that element.

In the example below, handle points to a particular DOM element on page. If that element changes text or is used by React to render an entirely different component, handle is still pointing to that very stale DOM element. This can lead to unexpected behaviors.

```js
const handle = await page.$('text=Submit');
// ...
await handle.hover();
await handle.click();
```

With the locator, every time the locator is used, up-to-date DOM element is located in the page using the selector. So in the snippet below, underlying DOM element is going to be located twice.

```js
const locator = page.getByText('Submit');
// ...
await locator.hover();
await locator.click();
```
