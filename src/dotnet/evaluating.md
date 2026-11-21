---
title: "Evaluating JavaScript"
---

# Evaluating JavaScript

## Introduction

Playwright scripts run in your Playwright environment. Your page scripts run in the browser page environment. Those environments don't intersect, they are running in different virtual machines in different processes and even potentially on different computers.

The [`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) API can run a JavaScript function in the context
of the web page and bring results back to the Playwright environment. Browser globals like
`window` and `document` can be used in `evaluate`.

```csharp
var href = await page.EvaluateAsync<string>("document.location.href");
```

If the result is a Promise or if the function is asynchronous evaluate will automatically wait until it's resolved:

```csharp
int status = await page.EvaluateAsync<int>(@"async () => {
  const response = await fetch(location.href);
  return response.status;
}");
```

## Different environments

Evaluated scripts run in the browser environment, while your test runs in a testing environments. This means you cannot use variables from your test in the page and vice versa. Instead, you should pass them explicitly as an argument.

The following snippet is **WRONG** because it uses the variable directly:

```csharp
var data = "some data";
var result = await page.EvaluateAsync(@"() => {
  // WRONG: there is no 'data' in the web page.
  window.myApp.use(data);
}");
```

The following snippet is **CORRECT** because it passes the value explicitly as an argument:

```csharp
var data = "some data";
// Pass |data| as a parameter.
var result = await page.EvaluateAsync("data => { window.myApp.use(data); }", data);
```

## Evaluation Argument

Playwright evaluation methods like [`Page.EvaluateAsync()`](/dotnet/api/class-page#page-evaluate) take a single optional argument. This argument can be a mix of [Serializable] values and [JSHandle](/dotnet/api/class-jshandle) instances. Handles are automatically converted to the value they represent.

```csharp
// A primitive value.
await page.EvaluateAsync<int>("num => num", 42);

// An array.
await page.EvaluateAsync<int[]>("array => array.length", new[] { 1, 2, 3 });

// An object.
await page.EvaluateAsync<object>("object => object.foo", new { foo = "bar" });

// A single handle.
var button = await page.EvaluateHandleAsync("window.button");
await page.EvaluateAsync<IJSHandle>("button => button.textContent", button);

// Alternative notation using JSHandle.EvaluateAsync.
await button.EvaluateAsync<string>("(button, from) => button.textContent.substring(from)", 5);

// Object with multiple handles.
var button1 = await page.EvaluateHandleAsync("window.button1");
var button2 = await page.EvaluateHandleAsync("window.button2");
await page.EvaluateAsync("o => o.button1.textContent + o.button2.textContent", new { button1, button2 });

// Object destructuring works. Note that property names must match
// between the destructured object and the argument.
// Also note the required parenthesis.
await page.EvaluateAsync("({ button1, button2 }) => button1.textContent + button2.textContent", new { button1, button2 });

// Array works as well. Arbitrary names can be used for destructuring.
// Note the required parenthesis.
await page.EvaluateAsync("([b1, b2]) => b1.textContent + b2.textContent", new[] { button1, button2 });

// Any mix of serializables and handles works.
await page.EvaluateAsync("x => x.button1.textContent + x.list[0].textContent + String(x.foo)", new { button1, list = new[] { button2 }, foo = null as object });
```

## Init scripts

Sometimes it is convenient to evaluate something in the page before it starts loading. For example, you might want to setup some mocks or test data.

In this case, use [`Page.AddInitScriptAsync()`](/dotnet/api/class-page#page-add-init-script) or [`BrowserContext.AddInitScriptAsync()`](/dotnet/api/class-browsercontext#browser-context-add-init-script). In the example below, we will replace `Math.random()` with a constant value.

First, create a `preload.js` file that contains the mock.

Next, add init script to the page.

```csharp
// In your test, assuming the "preload.js" file is in the "mocks" directory.
await Page.AddInitScriptAsync(scriptPath: "mocks/preload.js");
```
