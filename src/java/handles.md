---
title: "Handles"
---

# Handles

## Introduction

Playwright can create handles to the page DOM elements or any other objects inside the
page. These handles live in the Playwright process, whereas the actual objects live
in the browser. There are two types of handles:
- [JSHandle](/java/api/class-jshandle) to reference any JavaScript objects in the page
- [ElementHandle](/java/api/class-elementhandle) to reference DOM elements in the page, it has extra methods that allow
  performing actions on the elements and asserting their properties.

Since any DOM element in the page is also a JavaScript object, any [ElementHandle](/java/api/class-elementhandle) is
a [JSHandle](/java/api/class-jshandle) as well.

Handles are used to perform operations on those actual objects in the page. You can evaluate
on a handle, get handle properties, pass handle as an evaluation parameter, serialize page
object into JSON etc. See the [JSHandle](/java/api/class-jshandle) class API for these and methods.

### API reference
- [JSHandle](/java/api/class-jshandle)
- [ElementHandle](/java/api/class-elementhandle)

Here is the easiest way to obtain a [JSHandle](/java/api/class-jshandle).

```java
JSHandle jsHandle = page.evaluateHandle("window");
//  Use jsHandle for evaluations.
```

## Element Handles

:::warning[Discouraged]

The use of [ElementHandle](/java/api/class-elementhandle) is discouraged, use [Locator](/java/api/class-locator) objects and web-first assertions instead.
:::

When [ElementHandle](/java/api/class-elementhandle) is required, it is recommended to fetch it with the
[`page.waitForSelector()`](/java/api/class-page#page-wait-for-selector) or [`frame.waitForSelector()`](/java/api/class-frame#frame-wait-for-selector) methods. These
APIs wait for the element to be attached and visible.

```java
// Get the element handle
JSHandle jsHandle = page.waitForSelector("#box");
ElementHandle elementHandle = jsHandle.asElement();

// Assert bounding box for the element
BoundingBox boundingBox = elementHandle.boundingBox();
assertEquals(100, boundingBox.width);

// Assert attribute for the element
String classNames = elementHandle.getAttribute("class");
assertTrue(classNames.contains("highlighted"));
```

## Handles as parameters

Handles can be passed into the [`page.evaluate()`](/java/api/class-page#page-evaluate) and similar methods.
The following snippet creates a new array in the page, initializes it with data
and returns a handle to this array into Playwright. It then uses the handle
in subsequent evaluations:

```java
// Create new array in page.
JSHandle myArrayHandle = page.evaluateHandle("() => {\n" +
  "  window.myArray = [1];\n" +
  "  return myArray;\n" +
  "}");

// Get the length of the array.
int length = (int) page.evaluate("a => a.length", myArrayHandle);

// Add one more element to the array using the handle
Map<String, Object> arg = new HashMap<>();
arg.put("myArray", myArrayHandle);
arg.put("newElement", 2);
page.evaluate("arg => arg.myArray.push(arg.newElement)", arg);

// Release the object when it is no longer needed.
myArrayHandle.dispose();
```

## Handle Lifecycle

Handles can be acquired using the page methods such as [`page.evaluateHandle()`](/java/api/class-page#page-evaluate-handle),
[`page.querySelector()`](/java/api/class-page#page-query-selector) or [`page.querySelectorAll()`](/java/api/class-page#page-query-selector-all) or their frame counterparts
[`frame.evaluateHandle()`](/java/api/class-frame#frame-evaluate-handle), [`frame.querySelector()`](/java/api/class-frame#frame-query-selector) or [`frame.querySelectorAll()`](/java/api/class-frame#frame-query-selector-all). Once
created, handles will retain object from
[garbage collection](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
unless page navigates or the handle is manually disposed via the [`jsHandle.dispose()`](/java/api/class-jshandle#js-handle-dispose) method.

### API reference
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

## Locator vs ElementHandle

::: warning
We only recommend using [ElementHandle](/java/api/class-elementhandle) in the rare cases when you need to perform extensive DOM traversal
on a static page. For all user actions and assertions use locator instead.
:::

The difference between the [Locator](/java/api/class-locator) and [ElementHandle](/java/api/class-elementhandle) is that the latter points to a particular element, while Locator captures the logic of how to retrieve that element.

In the example below, handle points to a particular DOM element on page. If that element changes text or is used by React to render an entirely different component, handle is still pointing to that very stale DOM element. This can lead to unexpected behaviors.

```java
ElementHandle handle = page.querySelector("text=Submit");
handle.hover();
handle.click();
```

With the locator, every time the locator is used, up-to-date DOM element is located in the page using the selector. So in the snippet below, underlying DOM element is going to be located twice.

```java
Locator locator = page.getByText("Submit");
locator.hover();
locator.click();
```
