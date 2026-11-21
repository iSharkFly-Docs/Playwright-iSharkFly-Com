---
title: "Handles"
---

# Handles

## Introduction

Playwright can create handles to the page DOM elements or any other objects inside the
page. These handles live in the Playwright process, whereas the actual objects live
in the browser. There are two types of handles:
- [JSHandle](/dotnet/api/class-jshandle) to reference any JavaScript objects in the page
- [ElementHandle](/dotnet/api/class-elementhandle) to reference DOM elements in the page, it has extra methods that allow
  performing actions on the elements and asserting their properties.

Since any DOM element in the page is also a JavaScript object, any [ElementHandle](/dotnet/api/class-elementhandle) is
a [JSHandle](/dotnet/api/class-jshandle) as well.

Handles are used to perform operations on those actual objects in the page. You can evaluate
on a handle, get handle properties, pass handle as an evaluation parameter, serialize page
object into JSON etc. See the [JSHandle](/dotnet/api/class-jshandle) class API for these and methods.

### API reference
- [JSHandle](/dotnet/api/class-jshandle)
- [ElementHandle](/dotnet/api/class-elementhandle)

Here is the easiest way to obtain a [JSHandle](/dotnet/api/class-jshandle).

```csharp
var jsHandle = await page.EvaluateHandleAsync("window");
//  Use jsHandle for evaluations.
```

## Element Handles

:::warning[Discouraged]

The use of [ElementHandle](/dotnet/api/class-elementhandle) is discouraged, use [Locator](/dotnet/api/class-locator) objects and web-first assertions instead.
:::

When [ElementHandle](/dotnet/api/class-elementhandle) is required, it is recommended to fetch it with the
[`Page.WaitForSelectorAsync()`](/dotnet/api/class-page#page-wait-for-selector) or [`Frame.WaitForSelectorAsync()`](/dotnet/api/class-frame#frame-wait-for-selector) methods. These
APIs wait for the element to be attached and visible.

```csharp
// Get the element handle
var elementHandle = await page.WaitForSelectorAsync("#box");

// Assert bounding box for the element
var boundingBox = await elementHandle.BoundingBoxAsync();
Assert.AreEqual(100, boundingBox.Width);

// Assert attribute for the element
var classNames = await elementHandle.GetAttributeAsync("class");
Assert.True(classNames.Contains("highlighted"));
```

## Handles as parameters

Handles can be passed into the [`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) and similar methods.
The following snippet creates a new array in the page, initializes it with data
and returns a handle to this array into Playwright. It then uses the handle
in subsequent evaluations:

```csharp
// Create new array in page.
var myArrayHandle = await page.EvaluateHandleAsync(@"() => {
    window.myArray = [1];
    return myArray;
}");

// Get the length of the array.
var length = await page.EvaluateAsync<int>("a => a.length", myArrayHandle);

// Add one more element to the array using the handle
await page.EvaluateAsync("arg => arg.myArray.push(arg.newElement)",
    new { myArray = myArrayHandle, newElement = 2 });

// Release the object when it is no longer needed.
await myArrayHandle.DisposeAsync();
```

## Handle Lifecycle

Handles can be acquired using the page methods such as [`Page.EvaluateHandleAsync()`](/dotnet/api/class-page#page-evaluate-handle),
[`Page.QuerySelectorAsync()`](/dotnet/api/class-page#page-query-selector) or [`Page.QuerySelectorAllAsync()`](/dotnet/api/class-page#page-query-selector-all) or their frame counterparts
[`Frame.EvaluateHandleAsync()`](/dotnet/api/class-frame#frame-evaluate-handle), [`Frame.QuerySelectorAsync()`](/dotnet/api/class-frame#frame-query-selector) or [`Frame.QuerySelectorAllAsync()`](/dotnet/api/class-frame#frame-query-selector-all). Once
created, handles will retain object from
[garbage collection](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
unless page navigates or the handle is manually disposed via the [`JsHandle.DisposeAsync()`](/dotnet/api/class-jshandle#js-handle-dispose) method.

### API reference
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

## Locator vs ElementHandle

::: warning
We only recommend using [ElementHandle](/dotnet/api/class-elementhandle) in the rare cases when you need to perform extensive DOM traversal
on a static page. For all user actions and assertions use locator instead.
:::

The difference between the [Locator](/dotnet/api/class-locator) and [ElementHandle](/dotnet/api/class-elementhandle) is that the latter points to a particular element, while Locator captures the logic of how to retrieve that element.

In the example below, handle points to a particular DOM element on page. If that element changes text or is used by React to render an entirely different component, handle is still pointing to that very stale DOM element. This can lead to unexpected behaviors.

```csharp
var handle = await page.QuerySelectorAsync("text=Submit");
await handle.HoverAsync();
await handle.ClickAsync();
```

With the locator, every time the locator is used, up-to-date DOM element is located in the page using the selector. So in the snippet below, underlying DOM element is going to be located twice.

```csharp
var locator = page.GetByText("Submit");
await locator.HoverAsync();
await locator.ClickAsync();
```
